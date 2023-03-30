import { getDocById } from "@/pages/api/docs";
import { blogConfig } from "@/routes/blog-config";
import { toTitle } from "@/utils/title";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Doc from "@/components/doc-editor";

type Params = {
  params: {
    id: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const { id } = params;
  const content = await getDocById(id, "blogs");
  return {
    props: {
      content,
    },
  };
}

export async function getStaticPaths() {
  const paths = blogConfig.map(
    ({ id }): Params => ({
      params: { id },
    })
  );
  return {
    paths,
    fallback: false,
  };
}

function getEditUrl(id: string) {
  return `https://github.com/Milkdown/website/edit/main/docs/blogs/${id}.md`;
}

export default function Blog({ content }: { content: string }) {
  const router = useRouter();
  const { id } = router.query;
  const url = getEditUrl(id as string);
  const title = `${toTitle(id as string)} | Milkdown`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="twitter:card" content="summary" />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={content.slice(0, 100) + "..."}
        />
      </Head>
      <div className="mx-8 pt-24 md:mx-24 lg:mx-40 xl:mx-80">
        <MilkdownProvider>
          <ProsemirrorAdapterProvider>
            <Doc url={url} content={content} />
          </ProsemirrorAdapterProvider>
        </MilkdownProvider>
      </div>
    </>
  );
}
