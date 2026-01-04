// ==UserScript==
// @name               google multilang search view enja
// @name:zh            谷歌多语言搜索 enja
// @namespace          snomiao@gmail.com
// @author             snomiao@gmail.com
// @version            1.0.1
// @description        [snolab] Mulango - en/ja Walkers for bilingual learners. View a google search result in two languages side by side for comparison and language learning. now supports Bing & Google,
// @description:zh     [snolab] Mulango - en/ja 双语学习者的学步车，以并列多语言视角浏览谷歌搜索结果 现支持 Bing & Google,
// @match              https://*.google.com/search?*
// @match              https://*.bing.com/search?*
// @match              https://*/search*
// @grant              none
// @run-at             document-start
// @license            GPL-3.0+
// @supportURL         https://gist.github.com/snomiao/ecee0271ac7599d526aaa210293e3f43
// @contributionURL    https://snomiao.com/donate
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/522663/google%20multilang%20search%20view%20enja.user.js
// @updateURL https://update.greasyfork.org/scripts/522663/google%20multilang%20search%20view%20enja.meta.js
// ==/UserScript==

(async function main() {
    if (!location.hostname.match(/google|bing/)) return;
    if (parent !== window) return iframeSetup();
    iframeHeightReceiverSetup();
    const searchLinks = await mulangoSearchLinksFetch();
    searchLinks.length && mulangoPageReplace(searchLinks);
})();

function mulangoPageReplace(searchLinks) {
    const iframes = searchLinks.map((src) => `<iframe src="${src}"></iframe>`);
    const style = `<style>
        body{margin: 0; display: flex; flex-direction: row; }
        iframe{flex: auto; height: 100vh; overflow: hidden;border: none; }
    </style>`;
    document.body.innerHTML = `${style}${iframes}`;
}

function iframeHeightReceiverSetup() {
    const setHeight = (height = 0) =>
        height &&
        [...document.querySelectorAll("iframe[src]")].map(
            (e) =>
                (e.style.height =
                    Math.max(
                        Number(String(e.style.height).replace(/\D+/g, "") || 0),
                        height
                    ) + "px")
        );
    window.addEventListener("message", (e) => setHeight(e.data?.height), false);
}
function iframeSetup() {
    iframeScrollbarRemove();
    const sendHeight = () =>
        parent.postMessage?.({ height: document.body.scrollHeight }, "*");
    window.addEventListener("resize", sendHeight, false);
    window.addEventListener("load", sendHeight, false);
    sendHeight();
    window.addEventListener("load", iframeLinksSetup, false);
}

function iframeLinksSetup() {
    return [...document.querySelectorAll("a[href]")]
        .filter(({ href }) => new URL(href).origin === location.origin)
        .map((e) => (e.target = "_parent"));
}

function iframeScrollbarRemove() {
    document.body.style.margin = "-18px auto 0";
}

async function mulangoSearchLinksFetch() {
    const url = new URL(location.href);
    const query = url.searchParams.get("q") || "";
    if (!query) return [];
    const result = await bilangTranslate(query);
    const searchLinks = result.map((t) => {
        const u2 = new URL(url.href);
        u2.searchParams.set("q", t);
        return u2.href;
    });
    return searchLinks;
}
async function bilangTranslate(s) {
    const translate = (
        await import(
            "https://cdn.skypack.dev/@snomiao/google-translate-api-browser"
        )
    ).setCORS("https://google-translate-cors.vercel.app/api?url=", {
        encode: true,
    });
    return [
        await translate(s, { to: "ja" })
            .then((e) => e.text)
            .catch(console.error),
        await translate(s, { to: "en" })
            .then((e) => e.text)
            .catch(console.error),
    ].filter((e) => e);
}
