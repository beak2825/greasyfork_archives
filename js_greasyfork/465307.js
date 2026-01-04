// ==UserScript==
// @name             [SNOLAB] [Mulango] Search
// @name:zh          [SNOLAB] [Mulango] 多语言搜索
// @namespace        https://userscript.snomiao.com/
// @author           snomiao@gmail.com
// @version          1.0.2
// @description      [snolab] Mulango - Walkers for bilingual learners. View a google search result in two languages side by side for comparison and language learning. now supports Bing & Google,
// @description:zh   [snolab] Mulango - 双语学习者的学步车，以并列多语言视角浏览谷歌搜索结果 现支持 Bing & Google,
// @match            https://*.google.com/search?*
// @match            https://*.bing.com/search?*
// @match            https://*/search*
// @grant            none
// @run-at           document-start
// @license          GPL-3.0+
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @contributionURL  https://snomiao.com/donate
// @grant            GM_setValue
// @grant            GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/465307/%5BSNOLAB%5D%20%5BMulango%5D%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/465307/%5BSNOLAB%5D%20%5BMulango%5D%20Search.meta.js
// ==/UserScript==

(async function () {
    if (!location.hostname.match(/google|bing/)) return;
    const isIframe = parent !== window;
    if (isIframe) return iframeSetup();
    iframeHeightReceiverSetup();
    const searchLinks = await mulangoSearchLinksFetch();
    searchLinks.length && mulangoPageReplace(searchLinks);
})();

function mulangoPageReplace(searchLinks) {
    const iframes = searchLinks.map((src) => `<iframe src="${src}"></iframe>`);
    const style = `
        <style>
            body{margin: 0; display: flex; flex-direction: row; }
            iframe{flex: auto; height: 100vh; overflow: hidden; border: none; }
        </style>
    `;
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
    const langs = [
        ...new Set(navigator.languages.map((e) => e.replace(/-.*/, ""))),
    ].slice(0, 2);

    const translate = await useTranslator();
    return await Promise.all(
        langs.map(async (lang) => {
            const u2 = new URL(url.href);
            const transcript = (await translate(query, { to: lang })).text;
            if (transcript === query) return location.href; // try use cache
            u2.searchParams.set("q", transcript);
            u2.searchParams.set("lr", "lang_" + lang); // for google search
            return u2.href;
        })
    );
}
async function useTranslator() {
    return (
        await import(
            "https://cdn.skypack.dev/@snomiao/google-translate-api-browser"
        )
    ).setCORS("https://google-translate-cors.vercel.app/api?url=", {
        encode: true,
    });
}

async function amap(fn, a) {
    const r = [];
    let i = 0;
    for await (const v of a) r.push(await fn(v, i++, a));
    return r;
}
