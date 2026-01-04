// ==UserScript==
// @name        Nyaa SI Slim
// @namespace   Original by Vietconnect & Simon1, updated by minori_aoi then me.
// @require     https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.3.1/markdown-it.min.js
// @match       https://sukebei.nyaa.si/*
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @version     1.4.3
// @description Show descriptions of torrents in the search page.
// @homepageURL https://sleazyfork.org/en/scripts/420886-nyaa-si-slim
// @supportURL  https://sleazyfork.org/en/scripts/420886-nyaa-si-slim/feedback
// @downloadURL https://update.greasyfork.org/scripts/420886/Nyaa%20SI%20Slim.user.js
// @updateURL https://update.greasyfork.org/scripts/420886/Nyaa%20SI%20Slim.meta.js
// ==/UserScript==
/* jshint esversion:9 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function log(...msg) {
    console.log(`[Nyaa SI Slim] ${msg}`);
}
function getXmlHttpRequest() {
    return typeof GM !== "undefined" && GM !== null
        ? GM.xmlHttpRequest
        : GM_xmlhttpRequest;
}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function crossOriginRequest(details) {
    return new Promise((resolve, reject) => {
        getXmlHttpRequest()({
            timeout: 10000,
            onload: resolve,
            onerror: reject,
            ontimeout: (err) => {
                log(`${details.url} timed out`);
                reject(err);
            },
            ...details,
        });
    });
}
/** The maximum concurrent connection executed by the script. Default is 4.*/
const CONCURRENCY_LIMIT = 4;
/** The delay before spawning a new connection. Default is 1000ms.*/
const DELAY = 1000;
/**
 * After TIMEOUT ms, a connection still not resolved is considered inactive, the
 * script will move on to spawn the next connection as if it no longer exists.
 * Default value is null (never).
 **/
const TIMEOUT = null;
const ROW_SELECTOR = "table.torrent-list > tbody > tr";
const DESC_SELECTOR = "#torrent-description";
const LINK_SELECTOR = "td:nth-child(2) a";
const COMMENT_SELECTOR = "#comments .comment-content";
/**
 * a Promise that resolves after a period of time.
 * @param  {number|null} ms - ms milliseconds, or never if ms == null
 * @returns Promise<void>
 */
function timeout(ms) {
    if (ms === null) {
        return new Promise(() => { });
    }
    else {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
/** A simple task pool limiting the number of concurrently running tasks. */
class Pool {
    /**
     * Create a task pool.
     * @constructor
     * @param  {number} limit - the maximum number of concurrent tasks.
     * @param  {number|null=null} timeout - when timeout != null, tasks are considered complete after timeout ms.
     */
    constructor(limit, timeout = null) {
        this.limit = limit;
        this.timeout = timeout;
        this.running = 0;
        this.tasks = [];
    }
    /**
     * Push a task to the end of the task queue.
     * @param  {Task} task
     */
    push(task) {
        this.tasks.push(task);
        this.on_release();
    }
    /**
     * Insert a task at the start of the task queue.
     * @param  {Task} task
     */
    insert(task) {
        this.tasks.unshift(task);
        this.on_release();
    }
    spawn() {
        const task = this.tasks.shift();
        if (task === undefined) {
            return;
        }
        this.running += 1;
        Promise.race([task(), timeout(this.timeout)])
            .catch(console.error)
            .finally(() => {
            this.running -= 1;
            this.on_release();
        });
    }
    on_release() {
        while (this.running < this.limit && this.tasks.length > 0) {
            this.spawn();
        }
    }
}
const POOL = new Pool(CONCURRENCY_LIMIT, TIMEOUT);
function set_placeholder(element, text) {
    const LOADING_LINE = `<tr><td colspan=9>${text}</td></tr>`;
    element.innerHTML = LOADING_LINE;
}
/**
 * Collect urls to individual pages of torrents on current page, insert a placeholder after each row.
 * @returns Array - pairs of (url, DOM element to inject description)
 */
function collect_rows() {
    const rows = Array.from(document.querySelectorAll(ROW_SELECTOR));
    return rows.map((row) => {
        const link = row.querySelector(LINK_SELECTOR);
        if (link === null) {
            throw new Error(`No link found in row ${row.innerHTML}`);
        }
        const url = link.href;
        const loading = document.createElement("tr");
        set_placeholder(loading, "queued");
        row.insertAdjacentElement("afterend", loading);
        return [url, loading.firstElementChild];
    });
}
class TorrentPage {
    constructor(desc, comments) {
        this.desc = desc;
        this.comments = comments;
    }
    static parse(dom, nComments) {
        var _a;
        const desc_elem = dom.querySelector(DESC_SELECTOR);
        if (desc_elem === null) {
            throw new Error(`No ${DESC_SELECTOR} on DOM`);
        }
        const desc = (_a = desc_elem.textContent) !== null && _a !== void 0 ? _a : "";
        const comments = Array.from(dom.querySelectorAll(COMMENT_SELECTOR))
            .slice(0, nComments)
            .map((elem) => { var _a; return (_a = elem.textContent) !== null && _a !== void 0 ? _a : ""; });
        return new TorrentPage(desc, comments);
    }
    first_nonempty() {
        var _a;
        if (this.desc !== "" && this.desc !== "#### No description.") {
            return this.desc;
        }
        else {
            return (_a = this.comments.find((md) => md != "")) !== null && _a !== void 0 ? _a : null;
        }
    }
}
/**
 * Fetch and render descriptions on the current page.
 * @param  {string} url - url pointing to the description of a torrent.
 * @param  {Element} loading - the element on the current page where the description should be injected.
 * @returns Promise
 */
async function fetch_render_description(url, loading) {
    var _a;
    set_placeholder(loading, "loading...");
    let page;
    try {
        page = await fetch_description(url);
    }
    catch (e) {
        render_error(url, loading, e);
        return;
    }
    render_description(loading, (_a = page.first_nonempty()) !== null && _a !== void 0 ? _a : "");
}
async function fetch_description(url) {
    const res = await fetch(url);
    if (res.status >= 400) {
        throw new Error(`${res.url} returned ${res.status}`);
    }
    const dom = new DOMParser().parseFromString(await res.text(), "text/html");
    return TorrentPage.parse(dom, 1);
}
/**
 * @param {string} url
 * @param  {Element} loading
 * @param  {Error} error
 */
function render_error(url, loading, error) {
    var _a;
    loading.innerHTML = "";
    const a = document.createElement("a");
    a.text = `${error.message}, click to retry`;
    a.setAttribute("href", "#");
    a.setAttribute("style", "color: red;");
    a.setAttribute("title", (_a = error.stack) !== null && _a !== void 0 ? _a : "empty stack");
    a.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        set_placeholder(loading, "queued");
        POOL.insert(() => fetch_render_description(url, loading));
    });
    loading.appendChild(a);
}
/**
 * Render and inject the description.
 * @param  {Element} loading
 * @param  {Element} desc - a div element, the innerHTML of which is torrent description in markdown format.
 */
async function render_description(loading, desc) {
    const MARKDOWN_OPTIONS = {
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
    };
    const md = markdownit(MARKDOWN_OPTIONS);
    const rendered_desc = md.render(desc);
    loading.innerHTML = rendered_desc;
    await expandHostedImage(loading);
    limitImageSize(loading);
}
function selectorHostFactory(matchFn, selector, attr = "src") {
    return {
        match: matchFn,
        async extract(url) {
            const res = await crossOriginRequest({
                method: "GET",
                url,
            });
            const dom = new DOMParser().parseFromString(res.responseText, "text/html");
            const elem = dom.querySelector(selector);
            if (elem === null) {
                throw new Error(`no ${selector} in page, check HTML`);
            }
            const link = elem.getAttribute(attr);
            if (link === null) {
                throw new Error(`${selector} has no attribute ${attr}, check HTML`);
            }
            return link;
        },
    };
}
function BarelinkHostFactory(matchFn) {
    return {
        match: matchFn,
        async extract(url) {
            return url;
        },
    };
}
const XpicImageHost = selectorHostFactory((url) => url.startsWith("https://xpic.org") || url.startsWith("https://xxpics.org"), "img.attachment-original");
const HentaiCoverHost = selectorHostFactory((url) => url.startsWith("https://hentai-covers.site"), "#image-viewer > img");
const DlsiteImageHost = {
    match(url) {
        return /https:\/\/www\.dlsite\.com\/(maniax|pro)\/work\/=\/product_id\//.test(url);
    },
    async extract(url) {
        const DATA_SELECTOR = ".product-slider-data > :first-child";
        const res = await crossOriginRequest({
            method: "GET",
            url,
        });
        const dom = new DOMParser().parseFromString(res.responseText, "text/html");
        const div = dom.querySelector(DATA_SELECTOR);
        if (div === null) {
            throw new Error(`no ${DATA_SELECTOR} in page, check HTML`);
        }
        const dataSrc = div.dataset["src"];
        if (dataSrc == null) {
            throw new Error(`no data-src in ${DATA_SELECTOR}, check HTML`);
        }
        return dataSrc;
    },
};
const IbbImageHost = selectorHostFactory((url) => url.startsWith("https://ibb.co"), "#image-viewer-container > img");
const DLDShareHost = selectorHostFactory((url) => url.startsWith("https://dldshare.net/archives"), ".product_det > img.attachment-large", "data-src-webp");
const HRecordsHost = selectorHostFactory((url) => /hrecords\.jp\/archives\/\d+/.test(url), ".entry-content > p > a > img", "data-src");
const ImagetwistHost = selectorHostFactory((url) => url.startsWith("https://imagetwist.com"), "img.pic.img");
const PixxxarHost = selectorHostFactory((url) => url.startsWith("https://pixxxar.com/image"), "#image-viewer > img");
const KsyMoeHost = BarelinkHostFactory((url) => url.startsWith("https://ksy.moe/src/archive"));
const DlsiteCienArticleHost = {
    match(url) {
        return /ci-en\.dlsite\.com\/creator\/\d+\/article\/\d+/.test(url);
    },
    async extract(url) {
        var _a, _b, _c;
        const JD_SELECTOR = "head > script[type='application/ld+json']";
        const res = await crossOriginRequest({
            method: "GET",
            url,
        });
        const dom = new DOMParser().parseFromString(res.responseText, "text/html");
        const json = dom.querySelector(JD_SELECTOR);
        if (json === null) {
            throw new Error(`no ${JD_SELECTOR} in page, check HTML`);
        }
        const articles = JSON.parse((_a = json.textContent) !== null && _a !== void 0 ? _a : "");
        const src = (_c = (_b = articles === null || articles === void 0 ? void 0 : articles[0]) === null || _b === void 0 ? void 0 : _b.image) !== null && _c !== void 0 ? _c : null;
        return src;
    },
};
// 403 forbidden
// const GetchuImageHost: ImageHost = {
//   match(url: string): boolean {
//     return /https:\/\/(www\.)?getchu\.com\/soft\.phtml\?id=(\d+)/.test(url)
//   },
//   async extract(url: string): Promise<string> {
//     const A_SELECTOR = ".highslide";
//     const pageRes = await crossOriginRequest({
//       method: "GET",
//       url,
//     });
//     const dom = new DOMParser().parseFromString(pageRes.responseText, "text/html");
//     const a = <HTMLAnchorElement>dom.querySelector(A_SELECTOR);
//     let src = a.href;
//     if (src.startsWith("https://sukebei.nyaa.si")) {
//       src = src.replace("sukebei.nyaa.si", "www.getchu.com");
//     }
//     const imgRes = await crossOriginRequest({
//       method: "GET",
//       url: src,
//       binary: true,
//       responseType: "blob",
//     })
//     log(imgRes.responseHeaders);
//     return URLCreator.createObjectURL(imgRes.response);
//   }
// }
const IMAGE_HOSTS = [
    XpicImageHost,
    DlsiteImageHost,
    HentaiCoverHost,
    IbbImageHost,
    DLDShareHost,
    HRecordsHost,
    ImagetwistHost,
    PixxxarHost,
    KsyMoeHost,
    DlsiteCienArticleHost,
];
async function expandHostedImage(desc) {
    // skip if there's already an image
    if (desc.querySelector("img") !== null) {
        return;
    }
    for (const a of desc.querySelectorAll("a")) {
        const host = IMAGE_HOSTS.find((h) => h.match(a.href));
        if (host == null) {
            continue;
        }
        const src = await host.extract(a.href);
        if (src === null) {
            continue;
        }
        const img = document.createElement("img");
        img.src = src;
        img.style.display = "block";
        a.appendChild(img);
        return;
    }
}
function limitImageSize(desc) {
    for (const img of desc.querySelectorAll("img")) {
        // what if the load event didn't fire, e.g. the image is already loaded?
        img.addEventListener("load", () => {
            if (img.width > 600) {
                img.width = 600;
            }
        });
    }
}
async function main() {
    for (const [url, loading] of collect_rows()) {
        POOL.push(() => fetch_render_description(url, loading));
        await timeout(DELAY);
    }
}
main().catch(console.error);
