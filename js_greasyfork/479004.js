// ==UserScript==
// @name          SimpleNovelReader
// @namespace     net.myitian.js.SimpleNovelReader
// @version       0.7.3
// @description   简单的笔趣阁类网站小说阅读器
// @source        https://github.com/Myitian/SimpleNovelReader
// @author        Myitian
// @license       MIT
// @match         *://*.xiaoshuohu.com/*/*/*.html*
// @match         *://*.ibiquge.cc/*/*.html*
// @match         *://*.beqege.com/*/*.html*
// @match         *://*.beqege.cc/*/*.html*
// @match         *://*.biqiuge.net/*_*/*.html*
// @match         *://*.biquge11.cc/read/*/*.html*
// @match         *://*.bqgpp.com/read/*/*.html*
// @match         *://*.qe19.cc/read/*/*.html
// @match         *://*.biquge66.net/book/*/*.html*
// @match         *://*.52bqg.org/book_*/*.html*
// @match         *://*.bqg78.cc/book/*/*.html*
// @match         *://*.bige3.cc/book/*/*.html*
// @match         *://*.biqg.cc/book/*/*.html*
// @match         *://*.wxsc8.com/book/*/*.html*
// @match         *://*.5scw.com/book_*/*.html*
// @match         *://*.zhenhunxiaoshuo.com/*.html*
// @match         *://*.xyyuedu.com/writer/*/*/*.html*
// @match         *://*.wxzpyd.com/novel/chapter/*.html*
// @match         *://*.e365xs.com/*/read_*.html*
// @match         *://*.xbanxia.com/books/*/*.html
// @match         *://*.faloo.com/*.html
// @match         *://funs.me/text/*/*.html
// @match         *://*.trxs.cc/tongren/*/*.html
// @match         *://trxs.cc/tongren/*/*.html
// @match         *://*.hjwzw.com/Book/Read/*,*
// @match         *://www.69shuba.pro/txt/*/*
// @match         *://bh3.mihoyo.com/news/*
// @match         *://ys.mihoyo.com/main/news/detail/*
// @match         *://sr.mihoyo.com/news/*
// @match         *://zzz.mihoyo.com/news/*
// @match         file:///*.txt
// @match         file:///*.htm
// @match         file:///*.html
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_listValues
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/479004/SimpleNovelReader.user.js
// @updateURL https://update.greasyfork.org/scripts/479004/SimpleNovelReader.meta.js
// ==/UserScript==

const PageRegex = [
    /.*:\/\/.*\.xiaoshuohu\.com\/.*\/.*\/.*\.html.*/,
    /.*:\/\/.*\.ibiquge\.cc\/.*\/.*\.html.*/,
    /.*:\/\/.*\.beqege\.com\/.*\/.*\.html.*/,
    /.*:\/\/.*\.beqege\.cc\/.*\/.*\.html.*/,
    /.*:\/\/.*\.biqiuge\.net\/.*_.*\/.*\.html.*/,
    /.*:\/\/.*\.biquge11\.cc\/read\/.*\/.*\.html.*/,
    /.*:\/\/.*\.bqgpp\.com\/read\/.*\/.*\.html.*/,
    /.*:\/\/.*\.qe19\.cc\/read\/.*\/.*\.html/,
    /.*:\/\/.*\.biquge66\.net\/book\/.*\/.*\.html.*/,
    /.*:\/\/.*\.52bqg\.org\/book_.*\/.*\.html.*/,
    /.*:\/\/.*\.bqg78\.cc\/book\/.*\/.*\.html.*/,
    /.*:\/\/.*\.bige3\.cc\/book\/.*\/.*\.html.*/,
    /.*:\/\/.*\.biqg\.cc\/book\/.*\/.*\.html.*/,
    /.*:\/\/.*\.wxsc8\.com\/book\/.*\/.*\.html.*/,
    /.*:\/\/.*\.5scw\.com\/book_.*\/.*\.html.*/,
    /.*:\/\/.*\.zhenhunxiaoshuo\.com\/.*\.html.*/,
    /.*:\/\/.*\.xyyuedu\.com\/writer\/.*\/.*\/.*\.html.*/,
    /.*:\/\/.*\.wxzpyd\.com\/novel\/chapter\/.*\.html.*/,
    /.*:\/\/.*\.e365xs\.com\/.*\/read_.*\.html.*/,
    /.*:\/\/.*\.xbanxia\.com\/books\/.*\/.*\.html/,
    /.*:\/\/.*\.faloo\.com\/.*\.html/,
    /.*:\/\/funs\.me\/text\/.*\/.*\.html/,
    /.*:\/\/.*\.trxs\.cc\/tongren\/.*\/.*\.html/,
    /.*:\/\/trxs\.cc\/tongren\/.*\/.*\.html/,
    /.*:\/\/.*\.hjwzw\.com\/Book\/Read\/.*,.*/,
    /.*:\/\/www\.69shuba\.pro\/txt\/.*\/.*/,
    /.*:\/\/bh3\.mihoyo\.com\/news\/.*/,
    /.*:\/\/ys\.mihoyo\.com\/main\/news\/detail\/.*/,
    /.*:\/\/sr\.mihoyo\.com\/news\/.*/,
    /.*:\/\/zzz\.mihoyo\.com\/news\/.*/,
    /file:\/\/\/.*\.txt/,
    /file:\/\/\/.*\.htm/,
    /file:\/\/\/.*\.html/
];
const StandalonePageRegex = [
    /.*:\/\/(?:sr|zzz)\.mihoyo\.com\/.*/,
    /file:\/\/\/.*\.txt/,
    /file:\/\/\/.*\.htm/,
    /file:\/\/\/.*\.html/
];
const DynamicPageRegex = [
    /.*:\/\/.*\.mihoyo\.com\/.*/,
    /file:\/\/\/.*\.txt/,
    /file:\/\/\/.*\.htm/,
    /file:\/\/\/.*\.html/
];
const ProcessLFRegex = [
    /file:\/\/\/.*\.txt/
];
const FontSizes = [
    ["xx-small", "极小"],
    ["x-small", "小"],
    ["small", "较小"],
    ["medium", "中"],
    ["large", "较大"],
    ["x-large", "大"],
    ["xx-large", "极大"]
];
const SimpleNovelReader = document.createElement("div");
const OriginalUrl = window.location.origin + window.location.pathname + window.location.search;
const ActivePageRegex = PageRegex.find(x => x.test(window.location.href));
const IsDynamicPage = DynamicPageRegex.findIndex(x => x.test(window.location.href)) != -1;
const IsStandalonePage = StandalonePageRegex.findIndex(x => x.test(window.location.href)) != -1;
const IsProcessingLF = ProcessLFRegex.findIndex(x => x.test(window.location.href)) != -1;

/**
 * @param {Document} doc
 */
function extractPageData(doc) {
    const pageTitle = doc.title.trim();
    /** @type {?HTMLElement} */
    const title = (
        doc.querySelector("#arcxs_title>h1,.bookname>h1,.pt-read-cont>.pt-read-title>h1,.pt-read>div") ??
        doc.querySelector(".article-title,.bookname,#nr_title,.title,.zhong,.cont-title,.article__title,.news-detail__title,tr>td[background='/image/bgheader.gif']") ??
        doc.querySelector("h1")
    );
    /** @type {string} */
    const content = (
        doc.querySelector("#onearcxsbd,#cont-body,.pt-read-text,.article__bd,#nr1") ??
        doc.querySelector(".article-content,#content,#chaptercontent,#nr,.article,.pt-read-cont,.main-wrap,.article__content,.news-detail__content,.read_chapterDetail,.txtnav,.nodeContent,#AllySite+div,#ChSize") ??
        doc.querySelector("article:not(#myt-snr-content)") ??
        doc.querySelector("html>body>pre") // for txt in Firefox
    )?.innerHTML.replaceAll("　", "");
    /** @type {?HTMLAnchorElement} */
    const prev = (
        doc.querySelector("[rel=prev],#prev_url,#pb_prev,#link-preview,.pt-prechapter>a") ??
        doc.querySelector(".bottem1>a:nth-child(1),.col-md-6.text-center>a[href]:nth-child(1),b>a.prevPage:nth-child(1),td.prev>a,article>ul.pages>li:nth-child(2)>a,.page_chapter>ul>li:nth-child(1)>a,.pt-prechapter,.buttombar__prev:not(.buttombar__prev--disabled),.article__ft>a[href]:nth-child(1),.pageNav>a:nth-child(2),.page1>a:nth-child(1),.bl_pre,center>a.pages:nth-of-type(1)") ??
        doc.querySelector("body>table:has(#AllySite)+div>a:nth-child(1)")
    );
    /** @type {?HTMLAnchorElement} */
    const info = (
        doc.querySelector("[rel='category tag'],#info_url,#pb_mulu,#link-indexz,.pt-catalogue>a") ??
        doc.querySelector(".bottem1>a:nth-child(2),.col-md-6.text-center>a[href]:nth-child(2),a.returnIndex,td.mulu>a,article>ul.pages>li:nth-child(4)>a,.page_chapter>ul>li:nth-child(2)>a,.pt-prechapter+a,.news-detail .btn-back,.topbar__back,.nuxt-link-active,.pageNav>a:nth-child(5),.page1>a:nth-child(3),#page_muLu,tr>td>li>a:nth-of-type(3)") ??
        doc.querySelector("body>table:has(#AllySite)+div>a:nth-child(2)")
    );
    /** @type {?HTMLAnchorElement} */
    const next = (
        doc.querySelector("[rel=next],#next_url,#pb_next,#link-next,.pt-nextchapter>a") ??
        doc.querySelector(".bottem1>a:nth-child(3),.col-md-6.text-center>a[href]:nth-child(3),b>a.prevPage:nth-child(2),td.next>a,article>ul.pages>li:nth-child(3)>a,.page_chapter>ul>li:nth-child(3)>a,.pt-nextchapter,.buttombar__next:not(.buttombar__next--disabled),.article__ft>a[href]:nth-child(2),.pageNav>a:nth-child(3),.page1>a:nth-child(4),.bl_next,center>a.pages:nth-of-type(2)") ??
        doc.querySelector("body>table:has(#AllySite)+div>a:nth-child(3)")
    );
    const prevText = prev?.href ?? "";
    const nextText = next?.href ?? "";
    return {
        pageTitle: pageTitle,
        title: title?.innerText?.trim() ?? pageTitle,
        content: content?.trim() ?? "",
        prev: ActivePageRegex.test(prevText) ? prevText?.trim() : "",
        info: info?.href.trim() ?? "",
        next: ActivePageRegex.test(nextText) ? nextText?.trim() : ""
    };
}

/**
 * @param {?{pageTitle:string,title:string,content:string,prev:string,info:string,next:string}} data
 */
function loadPageData(data) {
    if (data) {
        document.title = data.pageTitle;
        /** @type {HTMLHeadingElement} */
        const title = SimpleNovelReader.querySelector("#myt-snr-title");
        title.innerText = data.title;
        if (IsProcessingLF) {
            const lines = data.content.split("\n");
            SimpleNovelReader.querySelector("#myt-snr-content").innerHTML = "<p>" + lines.join("</p><p>") + "</p>";
        } else {
            SimpleNovelReader.querySelector("#myt-snr-content").innerHTML = data.content;
        }
        /** @type {HTMLButtonElement} */
        const prev = SimpleNovelReader.querySelector("#myt-snr-prev");
        prev.dataset.href = data.prev;
        prev.disabled = !data.prev;
        /** @type {HTMLButtonElement} */
        const info = SimpleNovelReader.querySelector("#myt-snr-info");
        info.dataset.href = data.info;
        /** @type {HTMLButtonElement} */
        const next = SimpleNovelReader.querySelector("#myt-snr-next");
        next.dataset.href = data.next;
        next.disabled = !data.next;
    } else {
        SimpleNovelReader.querySelector("#myt-snr-title").innerHTML = "";
        SimpleNovelReader.querySelector("#myt-snr-content").innerHTML = "";
        /** @type {HTMLButtonElement} */
        const prev = SimpleNovelReader.querySelector("#myt-snr-prev");
        prev.dataset.href = "";
        prev.disabled = true;
        /** @type {HTMLButtonElement} */
        const info = SimpleNovelReader.querySelector("#myt-snr-info");
        info.dataset.href = "";
        /** @type {HTMLButtonElement} */
        const next = SimpleNovelReader.querySelector("#myt-snr-next");
        next.dataset.href = "";
        next.disabled = true;
    }
}

/**
 * @param {HTMLMediaElement} media 
 */
function pause(media) {
    media.autoplay = false;
    media.pause();
}

function loadPreload() {
    /** @type {HTMLIFrameElement} */
    const preloadFrame = SimpleNovelReader.querySelector("#myt-snr-preload");
    const doc = preloadFrame.contentWindow.document;
    doc.querySelectorAll("audio").forEach(pause);
    doc.querySelectorAll("video").forEach(pause);
    loadPageData(extractPageData(doc));
    SimpleNovelReader.querySelector("#myt-snr-content").scrollTop = 0;
}

/**
 * @param {URL} url
 */
function loadUrl(url) {
    if (IsStandalonePage) {
        loadPageData(extractPageData(document));
    } else if (IsDynamicPage) {
        /** @type {HTMLIFrameElement} */
        const preloadFrame = SimpleNovelReader.querySelector("#myt-snr-preload");
        url.hash = "disable-simple-novel-reader";
        if (preloadFrame.contentWindow && preloadFrame.src == url.href) {
            loadPageData(extractPageData(preloadFrame.contentWindow.document));
            SimpleNovelReader.querySelector("#myt-snr-content").scrollTop = 0;
        } else {
            loadPageData(null);
            preloadFrame.src = url.href;
        }
    } else {
        get(url).then(
            xhr => {
                loadPageData(extractPageData(xhr.response));
                SimpleNovelReader.querySelector("#myt-snr-content").scrollTop = 0;
            }
        );
    }
}

/**
 * GET 请求
 * @param {string | URL} url 请求地址
 * @param {XMLHttpRequestResponseType} responseType 响应类型
 * @param {number} timeout 超时
 * @returns {Promise<XMLHttpRequest>} Promise 对象，其 resolve 和 reject 均传入请求所用的 XMLHttpRequest 对象
 */
function get(url, responseType = "document", timeout = 0) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.timeout = timeout;
        xhr.withCredentials = true;
        xhr.responseType = responseType;
        xhr.send();
        xhr.ontimeout = () => reject(timeout);
        xhr.onload = () => {
            if (xhr.status < 300) {
                resolve(xhr);
            } else {
                reject(xhr);
            }
        };
    });
}

function detectHashChange() {
    if (window.location.hash == "#simple-novel-reader") {
        SimpleNovelReader.style.top = "0";
    } else {
        SimpleNovelReader.style.top = "200%";
    }
}

function toggle() {
    if (window.location.hash == "#simple-novel-reader") {
        hide();
    } else {
        show();
    }
}

let prevUrl = "";

/**
 * 
 * @param {?string} url 
 */
function show(url = undefined) {
    window.location.hash = "simple-novel-reader";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (url || prevUrl != window.location.href) {
        const newUrl = new URL(url ?? window.location.href);
        newUrl.hash = "simple-novel-reader";
        history.pushState(null, "", newUrl.toString());
        SimpleNovelReader.scrollTop = 0;
        loadUrl(newUrl);
    }
}

function hide() {
    const newUrl = window.location.origin + window.location.pathname + window.location.search;
    if (newUrl != OriginalUrl) {
        window.location.href = newUrl;
    } else {
        window.location.hash = "";
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
    }
    prevUrl = newUrl;
}

function toggleSettingDisplay() {
    /** @type {HTMLDivElement} */
    const settings = SimpleNovelReader.querySelector("#myt-snr-setting-items");
    /** @type {HTMLButtonElement} */
    const settingBtn = SimpleNovelReader.querySelector("#myt-snr-setting");
    if (settings.toggleAttribute("hidden")) {
        settingBtn.innerText = "展开样式设置";
    } else {
        settingBtn.innerText = "收起样式设置";
    }
}

/**
 * @param {Event} event
 */
function switchChapter(event) {
    /** @type {HTMLButtonElement} */
    // @ts-ignore
    const btn = event.target;
    if (btn.dataset.href) {
        show(btn.dataset.href);
    }
}

function viewInfo() {
    /** @type {HTMLButtonElement} */
    const e = SimpleNovelReader.querySelector("#myt-snr-info");
    if (e?.dataset.href) {
        window.location.href = e.dataset.href;
    }
}

function updateCustomFontButtonStyle() {
    /** @type {HTMLLabelElement} */
    const label = SimpleNovelReader.querySelector("[for=myt-snr-setting-font-family-custom]");
    label.style.fontFamily = GM_getValue("config.font-family.custom", "sans-serif");
    /** @type {HTMLInputElement} */
    const input = SimpleNovelReader.querySelector("#myt-snr-setting-font-family-custom-name");
    input.style.fontFamily = GM_getValue("config.font-family.custom", "sans-serif");
}

function updateContentStyle() {
    const fontSizeStr = FontSizes[GM_getValue("config.font-size", 3)];
    const lineHeightStr = GM_getValue("config.line-height", 1.5).toFixed(1);
    const maxWidthStr = GM_getValue("config.max-width", 40) + "em";
    /** @type {HTMLSpanElement} */
    const fontSizeE = SimpleNovelReader.querySelector("#myt-snr-setting-font-size-value");
    fontSizeE.innerText = fontSizeStr[1];
    /** @type {HTMLSpanElement} */
    const lineHeightE = SimpleNovelReader.querySelector("#myt-snr-setting-line-height-value");
    lineHeightE.innerText = lineHeightStr;
    /** @type {HTMLSpanElement} */
    const maxWidthE = SimpleNovelReader.querySelector("#myt-snr-setting-max-width-value");
    maxWidthE.innerText = maxWidthStr;
    SimpleNovelReader.querySelector("#myt-snr-content-style").innerHTML = `
#myt-snr-root * {
    font-family: ${GM_getValue("config.font-family.name", "sans-serif")};
    font-size: ${fontSizeStr[0]};
    line-height: ${lineHeightStr};
}

#myt-snr-root {
    --x-max-width: ${maxWidthStr};
}
`;
}

function updateCustomStyle() {
    if (GM_getValue("config.custom-style.enabled", false)) {
        SimpleNovelReader.querySelector("#myt-snr-custom-style").innerHTML = GM_getValue("config.custom-style", "");
    } else {
        SimpleNovelReader.querySelector("#myt-snr-custom-style").innerHTML = "";
    }
}

/**
 * @param {string} name
 * @param {string} value 
 */
function updateRadioButtonGroup(name, value) {
    /** @type {HTMLInputElement} */
    const radio = SimpleNovelReader.querySelector(`input[name=${name}][data-value=${CSS.escape(value)}]`);
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));
}

/**
 * @param {Event} event
 */
function updateRadioButton(event) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const radio = event.target;
    SimpleNovelReader.querySelector(`label[for=${radio.id}]`).toggleAttribute("checked", true);
    for (const r of SimpleNovelReader.querySelectorAll(`input[name=${radio.name}]:not([id=${radio.id}])`)) {
        SimpleNovelReader.querySelector(`label[for=${r.id}]`).toggleAttribute("checked", false);
    }
}

/**
 * @param {Event} event
 */
function updateFontFamilyByRadio(event) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const radio = event.target;
    /** @type {HTMLInputElement} */
    const customE = SimpleNovelReader.querySelector("#myt-snr-setting-font-family-custom-name");
    const custom = customE.value;
    GM_setValue("config.font-family.custom", custom);
    GM_setValue("config.font-family", radio.dataset.value);
    if (radio.dataset.value == "custom") {
        GM_setValue("config.font-family.name", custom);
    } else {
        GM_setValue("config.font-family.name", radio.dataset.value);
    }
    updateCustomFontButtonStyle();
    updateContentStyle();
}

/**
 * @param {Event} event
 */
function updateFontFamilyByInput(event) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const input = event.target;
    // @ts-ignore
    if (GM_getValue("config.font-family", "sans-serif") == "custom") {
        GM_setValue("config.font-family.name", input.value);
        updateContentStyle();
    }
    GM_setValue("config.font-family.custom", input.value);
    updateCustomFontButtonStyle();
}

/**
 * @param {number} diff 
 */
function updateFontSize(diff) {
    const min = 0;
    const max = FontSizes.length - 1;
    const oldVal = GM_getValue("config.font-size", 3) + diff;
    let newVal = oldVal;
    if (oldVal <= min) {
        newVal = min;
        SimpleNovelReader.querySelector("#myt-snr-setting-font-size-minus").toggleAttribute("disabled", true);
    } else {
        SimpleNovelReader.querySelector("#myt-snr-setting-font-size-minus").toggleAttribute("disabled", false);
    }
    if (oldVal >= max) {
        newVal = max;
        SimpleNovelReader.querySelector("#myt-snr-setting-font-size-plus").toggleAttribute("disabled", true);
    } else {
        SimpleNovelReader.querySelector("#myt-snr-setting-font-size-plus").toggleAttribute("disabled", false);
    }
    GM_setValue("config.font-size", newVal);
    updateContentStyle();
}

/**
 * @param {number} diff 
 */
function updateLineSpace(diff) {
    const min = 0.5;
    const max = 5;
    const oldVal = GM_getValue("config.line-height", 1.5) + diff;
    let newVal = oldVal;
    if (oldVal <= min) {
        newVal = min;
        SimpleNovelReader.querySelector("#myt-snr-setting-line-height-minus").toggleAttribute("disabled", true);
    } else {
        SimpleNovelReader.querySelector("#myt-snr-setting-line-height-minus").toggleAttribute("disabled", false);
    }
    if (oldVal >= max) {
        newVal = max;
        SimpleNovelReader.querySelector("#myt-snr-setting-line-height-plus").toggleAttribute("disabled", true);
    } else {
        SimpleNovelReader.querySelector("#myt-snr-setting-line-height-plus").toggleAttribute("disabled", false);
    }
    GM_setValue("config.line-height", parseFloat(newVal.toFixed(1)));
    updateContentStyle();
}

/**
 * @param {number} diff 
 */
function updateMaxWidth(diff) {
    const min = 5;
    const max = 10000;
    const oldVal = GM_getValue("config.max-width", 40) + diff;
    let newVal = oldVal;
    if (oldVal <= min) {
        newVal = min;
        SimpleNovelReader.querySelector("#myt-snr-setting-max-width-minus").toggleAttribute("disabled", true);
    } else {
        SimpleNovelReader.querySelector("#myt-snr-setting-max-width-minus").toggleAttribute("disabled", false);
    }
    if (oldVal >= max) {
        newVal = max;
        SimpleNovelReader.querySelector("#myt-snr-setting-max-width-plus").toggleAttribute("disabled", true);
    } else {
        SimpleNovelReader.querySelector("#myt-snr-setting-max-width-plus").toggleAttribute("disabled", false);
    }
    GM_setValue("config.max-width", newVal);
    updateContentStyle();
}

/**
 * @param {Event} event
 */
function updateColorScheme(event) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const radio = event.target;
    GM_setValue("config.color-scheme", radio.dataset.value);
    SimpleNovelReader.dataset.colorScheme = radio.dataset.value;
}

/**
 * @param {Event} event
 */
function importCustomStyle(event) {
    /** @type {HTMLInputElement} */
    // @ts-ignore
    const input = event.target;
    input.files[0].text().then(
        s => {
            /** @type {HTMLInputElement} */
            const input = SimpleNovelReader.querySelector("#myt-snr-setting-custom-style");
            input.value = s;
            GM_setValue("config.custom-style", s);
        }
    );
}

function applyCustomStyle() {
    /** @type {HTMLInputElement} */
    const input = SimpleNovelReader.querySelector("#myt-snr-setting-custom-style");
    GM_setValue("config.custom-style", input.value);
    GM_setValue("config.custom-style.enabled", true);
    updateCustomStyle();
}

function disableCustomStyle() {
    GM_setValue("config.custom-style.enabled", false);
    updateCustomStyle();
}

function deleteData() {
    if (confirm("确认删除储存的样式数据？")) {
        GM_deleteValue("config.font-family");
        GM_deleteValue("config.font-family.name");
        GM_deleteValue("config.font-family.custom");
        GM_deleteValue("config.font-size");
        GM_deleteValue("config.line-height");
        GM_deleteValue("config.max-width");
        GM_deleteValue("config.color-scheme");
        GM_deleteValue("config.custom-style");
        GM_deleteValue("config.custom-style.enabled");
    }
}

function main() {
    SimpleNovelReader.id = "myt-snr-root";
    SimpleNovelReader.className = "x-scroll-container";
    SimpleNovelReader.innerHTML = `
<div id="myt-snr-main">
    <header id="myt-snr-header" class="x-myt-content-style">
        <h1 id="myt-snr-title"></h1>
        <div id="myt-snr-tools"><!--
         --><button id="myt-snr-exit" class="x-myt-button">退出阅读模式</button><!--
         --><button id="myt-snr-settings" class="x-myt-button">展开样式设置</button><!--
     --></div>
        <div id="myt-snr-setting-items" class="x-scroll-container" hidden>
            <div id="myt-snr-setting-font-family" class="x-myt-list-item">
                <div id="myt-snr-close-settings">
                    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 24 24">
                        <path d="M6 6l12 12m0-12L6 18" />
                    </svg>
                </div>
                <h6 class="x-myt-content-style">字体</h6>
                <div><!--
                 --><span class="x-nobr"><!--
                     --><input id="myt-snr-setting-font-family-sans-serif"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-snr-setting-font-family" type="radio"
                            data-value="sans-serif" name="font-family"><!--
                     --><label for="myt-snr-setting-font-family-sans-serif"
                            class="x-myt-hidden-radio-button x-myt-button" style="font-family: sans-serif;">无衬线体</label><!--
                     --><input id="myt-snr-setting-font-family-serif"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-snr-setting-font-family" type="radio"
                            data-value="serif" name="font-family"><!--
                     --><label for="myt-snr-setting-font-family-serif" class="x-myt-hidden-radio-button x-myt-button"
                            style="font-family: serif;">衬线体</label><!--
                 --></span><!--
                 --><wbr><!--
                 --><input id="myt-snr-setting-font-family-custom"
                        class="x-myt-hidden-radio x-myt-hidden-input x-myt-snr-setting-font-family" type="radio"
                        data-value="custom" name="font-family"><!--
                 --><wbr><!--
                 --><label for="myt-snr-setting-font-family-custom"
                        class="x-myt-hidden-radio-button x-myt-button">自定义</label><!--
                 --><input id="myt-snr-setting-font-family-custom-name" type="text"><!--
             --></div>
            </div>
            <div class="x-myt-list-item">
                <div class="x-setting-short-item">
                    <h6 class="x-myt-content-style">字号</h6>
                    <div><!--
                     --><button id="myt-snr-setting-font-size-minus" class="x-myt-button x-minus" title="减少"><!--
                         --><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
                                viewBox="0 0 24 24">
                                <path d="M6 12h12" />
                            </svg><!--
                     --></button><!--
                     --><span id="myt-snr-setting-font-size-value" class="x-middle x-myt-content-style">中</span><!--
                     --><button id="myt-snr-setting-font-size-plus" class="x-myt-button x-plus" title="增加"><!--
                         --><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
                                viewBox="0 0 24 24">
                                <path d="M6 12h12M12 6v12" />
                            </svg><!--
                     --></button><!--
                 --></div>
                </div>
                <div class="x-setting-short-item">
                    <h6 class="x-myt-default-color x-myt-content-style">行间距</h6>
                    <div><!--
                     --><button id="myt-snr-setting-line-height-minus" class="x-myt-button x-minus" title="减少"><!--
                         --><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
                                viewBox="0 0 24 24">
                                <path d="M6 12h12" />
                            </svg><!--
                     --></button><!--
                     --><span id="myt-snr-setting-line-height-value" class="x-middle x-myt-content-style">1.5</span><!--
                     --><button id="myt-snr-setting-line-height-plus" class="x-myt-button x-plus" title="增加"><!--
                         --><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
                                viewBox="0 0 24 24">
                                <path d="M6 12h12M12 6v12" />
                            </svg><!--
                     --></button><!--
                 --></div>
                </div>
                <div class="x-setting-short-item">
                    <h6 class="x-myt-content-style">最大内容宽度</h6>
                    <div><!--
                     --><button id="myt-snr-setting-max-width-minus" class="x-myt-button x-minus" title="减少"><!--
                         --><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
                                viewBox="0 0 24 24">
                                <path d="M6 12h12" />
                            </svg><!--
                     --></button><!--
                     --><span id="myt-snr-setting-max-width-value" class="x-middle x-myt-content-style">40em</span><!--
                     --><button id="myt-snr-setting-max-width-plus" class="x-myt-button x-plus" title="增加"><!--
                         --><svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"
                                viewBox="0 0 24 24">
                                <path d="M6 12h12M12 6v12" />
                            </svg><!--
                     --></button><!--
                 --></div>
                </div>
            </div>
            <div id="myt-snr-setting-color-scheme" class="x-myt-list-item">
                <div><!--
                 --><span class="x-nobr"><!--
                     --><input id="myt-snr-setting-color-scheme-light"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-setting-color-scheme" type="radio"
                            data-value="light" name="color-scheme"><!--
                     --><label for="myt-snr-setting-color-scheme-light" data-color-scheme="light"
                            class="x-myt-hidden-radio-button x-myt-button">浅色</label><!--
                     --><input id="myt-snr-setting-color-scheme-dark"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-setting-color-scheme" type="radio"
                            data-value="dark" name="color-scheme"><!--
                     --><label for="myt-snr-setting-color-scheme-dark" data-color-scheme="dark"
                            class="x-myt-hidden-radio-button x-myt-button">深色</label><!--
                 --></span><!--
                 --><wbr><!--
                 --><span class="x-nobr"><!--
                     --><input id="myt-snr-setting-color-scheme-sepia"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-setting-color-scheme" type="radio"
                            data-value="sepia" name="color-scheme"><!--
                     --><label for="myt-snr-setting-color-scheme-sepia" data-color-scheme="sepia"
                            class="x-myt-hidden-radio-button x-myt-button">纸墨</label><!--
                     --><input id="myt-snr-setting-color-scheme-ex-dark"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-setting-color-scheme" type="radio"
                            data-value="ex-dark" name="color-scheme"><!--
                     --><label for="myt-snr-setting-color-scheme-ex-dark" data-color-scheme="ex-dark"
                            class="x-myt-hidden-radio-button x-myt-button">极黑</label><!--
                 --></span><!--
                 --><wbr><!--
                 --><span class="x-nobr"><!--
                     --><input id="myt-snr-setting-color-scheme-sepia2"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-setting-color-scheme" type="radio"
                            data-value="sepia2" name="color-scheme"><!--
                     --><label for="myt-snr-setting-color-scheme-sepia2" data-color-scheme="sepia2"
                            class="x-myt-hidden-radio-button x-myt-button">纸墨2</label><!--
                     --><input id="myt-snr-setting-color-scheme-auto"
                            class="x-myt-hidden-radio x-myt-hidden-input x-myt-setting-color-scheme" type="radio"
                            data-value="auto" name="color-scheme"><!--
                     --><label for="myt-snr-setting-color-scheme-auto" class="x-myt-hidden-radio-button x-myt-button"
                            data-color-scheme="auto">自动</label><!--
                 --></span><!--
             --></div>
            </div>
            <div class="x-myt-list-item">
                <div><!--
                 --><label for="myt-snr-setting-custom-style">自定义样式</label><!--
                 --><br><!--
                 --><input id="myt-snr-setting-custom-style" type="text"><!--
             --></div>
                <div><!--
                 --><input id="myt-snr-setting-custom-style-import" class="x-myt-hidden-input" type="file"
                        accept="text/css"><!--
                 --><label for="myt-snr-setting-custom-style-import" class="x-myt-button">导入</label><!--
                 --><wbr><!--
                 --><button id="myt-snr-setting-custom-style-apply" class="x-myt-button">应用</button><!--
                 --><wbr><!--
                 --><button id="myt-snr-setting-custom-style-disable" class="x-myt-button">停用</button><!--
             --></div>
            </div>
        </div>
    </header>
    <nav id="myt-snr-nav" class="x-myt-content-style"><!--
     --><button id="myt-snr-prev" class="x-myt-button x-left">上一章</button><!--
     --><button id="myt-snr-info" class="x-myt-button x-middle"><span class="x-nobr">章节</span><span
                class="x-nobr">列表</span></button><!--
     --><button id="myt-snr-next" class="x-myt-button x-right">下一章</button><!--
 --></nav><!--
 --><article id="myt-snr-content" class="x-myt-content-style"><!--
 --></article><!--
 --><footer id="myt-snr-footer" class="x-myt-content-style">
        <iframe id="myt-snr-preload"></iframe>
    </footer>
</div>
<style>
    #myt-snr-root {
        box-sizing: border-box;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 200%;
        left: 0;
        z-index: 2001;
        background: var(--x-snr-background-level-0);
        color: var(--x-snr-foreground-level-0);
        font-family: sans-serif;
        font-size: medium;
        line-height: 1.5;
        --x-max-width: 40em;
    }

    #myt-snr-root * {
        transition: all 0.2s ease;
    }

    .x-myt-content-style,
    #myt-snr-root div {
        background: inherit;
        color: inherit;
    }

    #myt-snr-root *::selection {
        background: var(--x-snr-background-selected-text);
        color: var(--x-snr-foreground-selected-text);
    }

    #myt-snr-root a {
        background: var(--x-snr-background-link);
        color: var(--x-snr-foreground-link);
        text-decoration: underline var(--x-snr-foreground-level-0);
    }

    #myt-snr-root a:visited {
        color: var(--x-snr-foreground-visited-link);
    }

    #myt-snr-root a::selection {
        background: var(--x-snr-background-selected-link);
        color: var(--x-snr-foreground-selected-link);
    }

    #myt-snr-root input[type=text] {
        background: var(--x-snr-background-level-1);
        border: 2px solid var(--x-snr-border);
        color: var(--x-snr-foreground-level-1);
        padding: revert;
        margin: .2em;
    }

    #myt-snr-root label {
        display: inline-block;
        max-width: unset;
        margin-bottom: 6px;
        font-weight: revert;
    }

    .x-myt-button {
        display: unset;
        border: none;
        background: transparent no-repeat center center;
        padding: .5em 1em;
        border-radius: .3em;
        margin: .5em 1em;
        cursor: pointer;
        background: var(--x-snr-background-button);
        color: var(--x-snr-foreground-button);
        fill: var(--x-snr-foreground-button);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    #myt-snr-content * {
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    .x-minus,
    .x-plus {
        width: 2em;
        height: 2em;
        padding: 0;
    }

    .x-myt-button:enabled:hover,
    label.x-myt-button:hover {
        background: var(--x-snr-background-button-hover);
        color: var(--x-snr-foreground-button-hover);
        fill: var(--x-snr-foreground-button-hover);
    }

    .x-myt-button:enabled:active,
    label.x-myt-button:active {
        background: var(--x-snr-background-button-active);
        color: var(--x-snr-foreground-button-active);
        fill: var(--x-snr-foreground-button-active);
    }

    .x-middle {
        margin: auto;
    }

    .x-scroll-container {
        overflow-x: clip;
        overflow-y: auto;
    }

    #myt-snr-header {
        position: unset;
        text-align: center;
        max-width: var(--x-max-width);
        margin: auto;
        padding: 1em;
        height: unset;
        background: unset;
        line-height: revert;
        border-bottom: unset;
    }

    #myt-snr-header .x-myt-button {
        margin: .2em;
    }

    #myt-snr-tools {
        margin-top: 1em;
    }

    #myt-snr-root #myt-snr-setting-items {
        position: fixed;
        background: var(--x-snr-background-level-0);
        border: 1px solid var(--x-snr-border);
        left: 0;
        top: 0;
        z-index: 2333;
        max-height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    #myt-snr-setting-font-family-custom-name {
        width: 8em;
    }

    #myt-snr-setting-custom-style {
        width: 100%;
        box-sizing: border-box;
        margin: .2em 0;
    }

    #myt-snr-setting-items .x-myt-list-item {
        margin: .5em;
    }

    #myt-snr-setting-font-family .x-myt-button {
        width: 5em;
        padding: .5em .1em;
    }

    #myt-snr-setting-color-scheme .x-myt-button {
        width: 4em;
        padding: .5em .1em;
    }

    .x-setting-short-item {
        margin: .5em;
        display: inline-block;
        width: 9em;
    }

    .x-setting-short-item>div {
        display: flex;
    }

    .x-myt-hidden-radio-button {
        display: inline-block;
        position: relative;
        background: var(--x-snr-background-level-1);
        color: var(--x-snr-foreground-level-1);
        box-sizing: border-box;
        border-radius: 2px;
        border: 2px solid var(--x-snr-background-level-1);
        font-weight: revert;
        max-width: revert;
    }

    #myt-snr-close-settings {
        position: absolute;
        width: 1.5em;
        height: 1.5em;
        right: 0;
        top: 0;
    }

    #myt-snr-close-settings:hover {
        rotate: 90deg;
    }

    .x-myt-hidden-radio-button[checked] {
        border-color: var(--x-snr-selected-border);
    }

    .x-myt-hidden-radio-button:hover::after {
        content: "";
        display: block;
        border-bottom: 2px solid var(--x-snr-selected-border);
        border-radius: 4px;
        width: calc(100% + 4px);
        position: absolute;
        bottom: -6px;
        inset-inline-start: -2px;
    }

    .x-myt-hidden-input {
        pointer-events: none;
        position: absolute;
        opacity: 0;
    }

    #myt-snr-nav {
        display: flex;
        position: sticky;
        top: 0;
        border: 1px solid var(--x-snr-border);
        border-left: none;
        border-right: none;
        padding: 0;
        background: var(--x-snr-background-level-1);
        color: var(--x-snr-foreground-level-1);
    }

    #myt-snr-nav .x-left {
        margin-right: 0;
    }

    .x-nobr {
        white-space: nowrap;
    }

    #myt-snr-nav .x-right {
        margin-left: 0;
    }

    #myt-snr-content {
        padding: 1em;
        max-width: var(--x-max-width);
        margin: auto;
    }

    #myt-snr-root h1 {
        margin: 0;
        font-size: revert;
        line-height: revert;
        font-weight: revert;
        color: var(--x-snr-foreground-level-0);
    }

    #myt-snr-root h6 {
        margin: 0;
        font-size: smaller;
        color: var(--x-snr-foreground-level-0);
    }

    #myt-snr-root p {
        text-indent: 2em;
        margin: revert;
        padding: revert;
    }

    #myt-snr-root svg {
        stroke: var(--x-snr-border);
        stroke-linecap: round;
        stroke-width: 1.5;
        fill: none;
    }

    #myt-snr-content * {
        max-width: var(--x-max-width);
    }

    #myt-snr-content p>img:first-child:last-child,
    #myt-snr-content p>video:first-child:last-child,
    #myt-snr-content p>audio:first-child:last-child {
        margin-left: -2em;
    }

    #myt-snr-preload {
        display: none;
    }

    [data-color-scheme=light] {
        --x-snr-background-level-0: #fff;
        --x-snr-background-level-1: #eee;
        --x-snr-background-button: var(--x-snr-background-level-1);
        --x-snr-background-button-hover: #ddd;
        --x-snr-background-button-active: #ccc;
        --x-snr-background-selected: rgba(0, 97, 224, 0.3);
        --x-snr-background-selected-text: var(--x-snr-background-selected);
        --x-snr-background-selected-link: var(--x-snr-background-selected);
        --x-snr-background-link: inherit;
        --x-snr-background-visited-link: inherit;
        --x-snr-foreground-level-0: rgb(21, 20, 26);
        --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-active: var(--x-snr-foreground-link);
        --x-snr-foreground-selected-text: inherit;
        --x-snr-foreground-selected-link: #333;
        --x-snr-foreground-link: rgb(0, 97, 224);
        --x-snr-foreground-visited-link: #b5007f;
        --x-snr-foreground-disabled: rgba(91, 91, 102, 0.4);
        --x-snr-border: #ccc;
        --x-snr-selected-border: var(--x-snr-foreground-link);
    }

    [data-color-scheme=dark] {
        --x-snr-background-level-0: rgb(28, 27, 34);
        --x-snr-background-level-1: rgb(66, 65, 77);
        --x-snr-background-button: var(--x-snr-background-level-1);
        --x-snr-background-button-hover: rgb(82, 82, 94);
        --x-snr-background-button-active: rgb(91, 91, 102);
        --x-snr-background-selected: rgba(0, 221, 255, 0.3);
        --x-snr-background-selected-text: var(--x-snr-background-selected);
        --x-snr-background-selected-link: var(--x-snr-background-selected);
        --x-snr-background-link: inherit;
        --x-snr-background-visited-link: inherit;
        --x-snr-foreground-level-0: rgb(251, 251, 254);
        --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-active: var(--x-snr-foreground-link);
        --x-snr-foreground-selected-text: inherit;
        --x-snr-foreground-selected-link: #fff;
        --x-snr-foreground-link: rgb(0, 221, 255);
        --x-snr-foreground-visited-link: #e675fd;
        --x-snr-foreground-disabled: rgba(251, 251, 254, 0.4);
        --x-snr-border: #ccc;
        --x-snr-selected-border: var(--x-snr-foreground-link);
    }

    [data-color-scheme=sepia] {
        --x-snr-background-level-0: rgb(244, 236, 216);
        --x-snr-background-level-1: rgb(229, 219, 200);
        --x-snr-background-button: var(--x-snr-background-level-1);
        --x-snr-background-button-hover: rgb(200, 190, 170);
        --x-snr-background-button-active: rgb(170, 160, 140);
        --x-snr-background-selected: rgba(0, 97, 224, 0.3);
        --x-snr-background-selected-text: var(--x-snr-background-selected);
        --x-snr-background-selected-link: var(--x-snr-background-selected);
        --x-snr-background-link: inherit;
        --x-snr-background-visited-link: inherit;
        --x-snr-foreground-level-0: rgb(91, 70, 54);
        --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-active: var(--x-snr-foreground-link);
        --x-snr-foreground-selected-text: inherit;
        --x-snr-foreground-selected-link: #333;
        --x-snr-foreground-link: rgb(0, 97, 224);
        --x-snr-foreground-visited-link: #b5007f;
        --x-snr-foreground-disabled: rgba(91, 70, 54, 0.4);
        --x-snr-border: rgb(91, 70, 54);
        --x-snr-selected-border: var(--x-snr-foreground-link);
    }

    [data-color-scheme=ex-dark] {
        --x-snr-background-level-0: #000;
        --x-snr-background-level-1: rgb(20, 20, 20);
        --x-snr-background-button: var(--x-snr-background-level-1);
        --x-snr-background-button-hover: rgb(40, 40, 40);
        --x-snr-background-button-active: rgb(60, 60, 60);
        --x-snr-background-selected: rgba(0, 180, 200, 0.3);
        --x-snr-background-selected-text: var(--x-snr-background-selected);
        --x-snr-background-selected-link: var(--x-snr-background-selected);
        --x-snr-background-link: inherit;
        --x-snr-background-visited-link: inherit;
        --x-snr-foreground-level-0: rgb(180, 180, 180);
        --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-active: var(--x-snr-foreground-link);
        --x-snr-foreground-selected-text: inherit;
        --x-snr-foreground-selected-link: rgb(200, 200, 200);
        --x-snr-foreground-link: rgb(0, 180, 200);
        --x-snr-foreground-visited-link: rgb(190, 100, 200);
        --x-snr-foreground-disabled: rgba(180, 180, 180, 0.4);
        --x-snr-border: #555;
        --x-snr-selected-border: var(--x-snr-foreground-link);
    }

    [data-color-scheme=sepia2] {
        --x-snr-background-level-0: rgb(230, 200, 170);
        --x-snr-background-level-1: rgb(200, 170, 120);
        --x-snr-background-button: var(--x-snr-background-level-1);
        --x-snr-background-button-hover: rgb(180, 150, 100);
        --x-snr-background-button-active: rgb(140, 120, 80);
        --x-snr-background-selected: rgba(0, 97, 224, 0.3);
        --x-snr-background-selected-text: var(--x-snr-background-selected);
        --x-snr-background-selected-link: var(--x-snr-background-selected);
        --x-snr-background-link: inherit;
        --x-snr-background-visited-link: inherit;
        --x-snr-foreground-level-0: rgb(91, 70, 54);
        --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
        --x-snr-foreground-button-active: var(--x-snr-foreground-link);
        --x-snr-foreground-selected-text: inherit;
        --x-snr-foreground-selected-link: #333;
        --x-snr-foreground-link: rgb(224, 126, 0);
        --x-snr-foreground-visited-link: #b5007f;
        --x-snr-foreground-disabled: rgba(91, 70, 54, 0.4);
        --x-snr-border: rgb(91, 70, 54);
        --x-snr-selected-border: var(--x-snr-foreground-link);
    }

    @media (prefers-color-scheme: light) {
        [data-color-scheme=auto] {
            --x-snr-background-level-0: #fff;
            --x-snr-background-level-1: #eee;
            --x-snr-background-button: var(--x-snr-background-level-1);
            --x-snr-background-button-hover: #ddd;
            --x-snr-background-button-active: #ccc;
            --x-snr-background-selected: rgba(0, 97, 224, 0.3);
            --x-snr-background-selected-text: var(--x-snr-background-selected);
            --x-snr-background-selected-link: var(--x-snr-background-selected);
            --x-snr-background-link: inherit;
            --x-snr-background-visited-link: inherit;
            --x-snr-foreground-level-0: rgb(21, 20, 26);
            --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
            --x-snr-foreground-button: var(--x-snr-foreground-level-0);
            --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
            --x-snr-foreground-button-active: var(--x-snr-foreground-link);
            --x-snr-foreground-selected-text: inherit;
            --x-snr-foreground-selected-link: #333;
            --x-snr-foreground-link: rgb(0, 97, 224);
            --x-snr-foreground-visited-link: #b5007f;
            --x-snr-foreground-disabled: rgba(91, 91, 102, 0.4);
            --x-snr-border: #ccc;
            --x-snr-selected-border: var(--x-snr-foreground-link);
        }
    }

    @media (prefers-color-scheme: dark) {
        [data-color-scheme=auto] {
            --x-snr-background-level-0: rgb(28, 27, 34);
            --x-snr-background-level-1: rgb(66, 65, 77);
            --x-snr-background-button: var(--x-snr-background-level-1);
            --x-snr-background-button-hover: rgb(82, 82, 94);
            --x-snr-background-button-active: rgb(91, 91, 102);
            --x-snr-background-selected: rgba(0, 221, 255, 0.3);
            --x-snr-background-selected-text: var(--x-snr-background-selected);
            --x-snr-background-selected-link: var(--x-snr-background-selected);
            --x-snr-background-link: inherit;
            --x-snr-background-visited-link: inherit;
            --x-snr-foreground-level-0: rgb(251, 251, 254);
            --x-snr-foreground-level-1: var(--x-snr-foreground-level-0);
            --x-snr-foreground-button: var(--x-snr-foreground-level-0);
            --x-snr-foreground-button-hover: var(--x-snr-foreground-level-0);
            --x-snr-foreground-button-active: var(--x-snr-foreground-link);
            --x-snr-foreground-selected-text: inherit;
            --x-snr-foreground-selected-link: #fff;
            --x-snr-foreground-link: rgb(0, 221, 255);
            --x-snr-foreground-visited-link: #e675fd;
            --x-snr-foreground-disabled: rgba(251, 251, 254, 0.4);
            --x-snr-border: #ccc;
            --x-snr-selected-border: var(--x-snr-foreground-link);
        }
    }
</style>
<style id="myt-snr-content-style">
</style>
<style id="myt-snr-custom-style">
</style>
`;
    GM_registerMenuCommand("切换阅读模式", toggle);
    GM_registerMenuCommand("切换设置界面", toggleSettingDisplay);
    GM_registerMenuCommand("删除样式数据", deleteData);
    SimpleNovelReader.querySelector("#myt-snr-exit").addEventListener("click", hide);
    SimpleNovelReader.querySelector("#myt-snr-settings").addEventListener("click", toggleSettingDisplay);
    SimpleNovelReader.querySelector("#myt-snr-close-settings").addEventListener("click", toggleSettingDisplay);
    SimpleNovelReader.querySelector("#myt-snr-prev").addEventListener("click", switchChapter);
    SimpleNovelReader.querySelector("#myt-snr-info").addEventListener("click", viewInfo);
    SimpleNovelReader.querySelector("#myt-snr-next").addEventListener("click", switchChapter);

    SimpleNovelReader.querySelector("#myt-snr-setting-font-size-minus").addEventListener("click", () => updateFontSize(-1));
    SimpleNovelReader.querySelector("#myt-snr-setting-font-size-plus").addEventListener("click", () => updateFontSize(1));
    SimpleNovelReader.querySelector("#myt-snr-setting-line-height-minus").addEventListener("click", () => updateLineSpace(-0.1));
    SimpleNovelReader.querySelector("#myt-snr-setting-line-height-plus").addEventListener("click", () => updateLineSpace(0.1));
    SimpleNovelReader.querySelector("#myt-snr-setting-max-width-minus").addEventListener("click", () => updateMaxWidth(-1));
    SimpleNovelReader.querySelector("#myt-snr-setting-max-width-plus").addEventListener("click", () => updateMaxWidth(1));

    SimpleNovelReader.querySelector("#myt-snr-setting-custom-style-import").addEventListener("change", importCustomStyle);
    SimpleNovelReader.querySelector("#myt-snr-setting-custom-style-apply").addEventListener("click", applyCustomStyle);
    SimpleNovelReader.querySelector("#myt-snr-setting-custom-style-disable").addEventListener("click", disableCustomStyle);

    for (const btn of SimpleNovelReader.querySelectorAll(".x-myt-hidden-radio")) {
        btn.addEventListener("change", updateRadioButton);
    }
    for (const btn of SimpleNovelReader.querySelectorAll(".x-myt-snr-setting-font-family")) {
        btn.addEventListener("change", updateFontFamilyByRadio);
    }
    for (const btn of SimpleNovelReader.querySelectorAll(".x-myt-setting-color-scheme")) {
        btn.addEventListener("change", updateColorScheme);
    }

    /** @type {HTMLInputElement} */
    const customFontFamily = SimpleNovelReader.querySelector("#myt-snr-setting-font-family-custom-name");
    customFontFamily.value = GM_getValue("config.font-family.custom", "");
    customFontFamily.addEventListener("input", updateFontFamilyByInput);

    SimpleNovelReader.querySelector("#myt-snr-preload").addEventListener("load", loadPreload);

    updateRadioButtonGroup("font-family", GM_getValue("config.font-family", "sans-serif"));
    updateRadioButtonGroup("color-scheme", GM_getValue("config.color-scheme", "auto"));
    updateCustomFontButtonStyle();
    updateContentStyle();
    updateCustomStyle();
    if (!IsDynamicPage) {
        loadUrl(new URL(window.location.href));
    }
    if (window.location.hash == "#simple-novel-reader") {
        SimpleNovelReader.style.top = "0";
        show();
    }
    document.body.appendChild(SimpleNovelReader);
    if (IsDynamicPage) {
        loadUrl(new URL(window.location.href));
    }
    window.addEventListener("hashchange", detectHashChange);
}

if (!window.location.hash.includes("disable-simple-novel-reader")) {
    main();
}