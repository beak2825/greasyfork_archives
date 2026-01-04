// ==UserScript==
// @name                Youtube Anti Shorts
// @name:zh             Youtube Anti Shorts 反短片
// @namespace           Anong0u0
// @version             0.7.6.1
// @description         shorts is a shit, fuck you youtube
// @description:zh      短片就是坨屎，去你的youtube
// @author              Anong0u0
// @match               *://*.youtube.com/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @run-at              document-start
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/441709/Youtube%20Anti%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/441709/Youtube%20Anti%20Shorts.meta.js
// ==/UserScript==

console.log("[Anti Shorts] load start");

let Hide_Shorts_Renderer = GM_getValue("Hide_Shorts_Renderer", true);
let Hide_Shorts_Video = GM_getValue("Hide_Shorts_Video", true);
let Redirect_Shorts_URL = GM_getValue("Redirect_Shorts_URL", true);

Node.prototype.getParentElement = function(times = 0){let e=this;for(let i=0;i<times;i++)e=e.parentElement;return e;}
NodeList.prototype.filter = Array.prototype.filter
NodeList.prototype.slice = Array.prototype.slice

const delay = (ms = 0) => {return new Promise((r)=>{setTimeout(r, ms)})}

const waitElementLoad = (elementSelector, isSelectAll, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(isSelectAll) {if((result = document.querySelectorAll(elementSelector)).length > 0) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) {return reject(new Error("Wait Timeout"))}
            await delay(interval);
        }
        resolve(result);
    })
}

if (window.trustedTypes)
{
    const policy = trustedTypes.createPolicy("ytAntiShorts", {createHTML: (string) => string,});
    Node.prototype.setHTML = function (html) {this.innerHTML = policy.createHTML(html)}
}
else Node.prototype.setHTML = function (html) {this.innerHTML = html}

const fillRow = () =>
{
    if(window.location.pathname!="/feed/subscriptions") return;
    console.log("[Anti Shorts] fill row count")
    let row = document.querySelector("ytd-browse[page-subtype='subscriptions'] ytd-rich-grid-renderer > div#contents.ytd-rich-grid-renderer > ytd-rich-grid-row")
    const rowCount = getComputedStyle(row).getPropertyValue("--ytd-rich-grid-items-per-row")
    while(row.nextElementSibling?.tagName=="YTD-RICH-GRID-ROW")
    {
        const showedItem = row.querySelectorAll("ytd-rich-item-renderer").filter((e)=>getComputedStyle(e).display!="none")
        let need = rowCount-showedItem.length
        let nextRow = row
        while(need>0 && nextRow.nextElementSibling!=null)
        {
            nextRow = nextRow.nextElementSibling
            const rowContent = row.querySelector("div#contents.ytd-rich-grid-row")
            for (const e of nextRow.querySelectorAll("ytd-rich-item-renderer"))
            {
                if (need == 0) break;
                if (getComputedStyle(e).display != "none")
                {
                    rowContent.appendChild(e);
                    need--;
                }
            }
        }
        row = row.nextElementSibling
    }
}

const unfillRow = () =>
{
    if(window.location.pathname!="/feed/subscriptions") return;
    console.log("[Anti Shorts] unfill row count")
    let row = document.querySelector("ytd-browse[page-subtype='subscriptions'] ytd-rich-grid-renderer > div#contents.ytd-rich-grid-renderer > ytd-rich-grid-row")
    const rowCount = getComputedStyle(row).getPropertyValue("--ytd-rich-grid-items-per-row")
    while(row.nextElementSibling?.tagName=="YTD-RICH-GRID-ROW")
    {
        const rowContent = row.nextElementSibling.querySelector("div#contents.ytd-rich-grid-row")
        row.querySelectorAll("ytd-rich-item-renderer").slice(rowCount).forEach((e)=>
        {
            rowContent.appendChild(e)
        })
        row = row.nextElementSibling
    }
}

const debounce = ()=>
{
    clearTimeout(lockID)
    lockID = setTimeout(() => {fillRow()}, 50);
}

if((()=>{try{document.querySelector(":has(body)");return false;}catch{return true;}})())
{
    alert(`[Anti Shorts] Warning:
Your browser Does Not Support CSS4 selector (:has).
Please update or change your browser.
For Firefox users, please to go to "about:config" and enable "layout.css.has-selector.enabled" setting.`)
}

let menuID = [], oldHref = null, lockID = null;

const css =
{
    hideRenderer: document.createElement("style"),
    hideVideo: document.createElement("style"),
}
css.hideRenderer.setHTML(`
ytm-pivot-bar-item-renderer:has(.pivot-shorts),
ytm-rich-section-renderer:has(a[href^='/shorts']),
ytm-reel-shelf-renderer:has(a[href^='/shorts']),

grid-shelf-view-model.ytGridShelfViewModelHost:has(a[href^='/shorts']),

ytd-reel-shelf-renderer.style-scope:is(.ytd-item-section-renderer,.ytd-structured-description-content-renderer),
ytd-mini-guide-entry-renderer[aria-label='Shorts'],
ytd-rich-shelf-renderer[is-shorts],
a.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer[title='Shorts']
{display:none !important}`);
css.hideVideo.setHTML(`
.is-shorts,
ytm-reel-item-renderer:has(a[href^='/shorts']),
ytm-video-with-context-renderer:has(a[href^='/shorts']),
ytm-compact-video-renderer:has(a[href^='/shorts']),

.ytGridShelfViewModelGridShelfItem:has(a[href^='/shorts']),

[is-short],
[is-shorts-grid] ytd-continuation-item-renderer,
ytd-video-renderer:has(a[href^='/shorts']),
ytd-reel-item-renderer:has(a[href^='/shorts']),
ytd-rich-item-renderer:has(a[href^='/shorts']),
ytd-grid-video-renderer:has(a[href^='/shorts']),
ytd-compact-video-renderer:has(a[href^='/shorts']),
ytd-search ytd-shelf-renderer:has(a[href^='/shorts']),
ytd-browse ytd-item-section-renderer:has(yt-img-shadow#avatar):has(div#title-text):has(ytd-video-renderer):has(a[href^='/shorts'])
{display:none !important}`);
// ":has" selector is simple and "efficient", Use it instead of javascript DOM manipulation

const onPageUpdate = () =>
{
    //console.log("[Anti Shorts] page updated");
    if (oldHref != window.location.href)
    {
        oldHref = window.location.href;
        toggle.redirect();
    }
}

const toggle =
{
    renderer: ()=>
    {
        if(Hide_Shorts_Renderer) document.documentElement.append(css.hideRenderer);
        else css.hideRenderer.remove();
    },

    video: async ()=>
    {
        if(Hide_Shorts_Video)
        {
            document.addEventListener("yt-rendererstamper-finished", debounce)
            document.documentElement.append(css.hideVideo);
            fillRow();
        }
        else
        {
            document.removeEventListener("yt-rendererstamper-finished", debounce)
            css.hideVideo.remove();
            unfillRow()
        }
    },

    redirect: ()=>
    {
        if(Redirect_Shorts_URL)
        {
            if(window.location.pathname.indexOf("/shorts/")!=-1)
            {console.log("[Anti Shorts] redirected");window.location.replace(window.location.href.replace("/shorts/","/watch?v="));}
        }
    }
}

const setMenu = ()=>
{
    menuID.forEach((e)=>{GM_unregisterMenuCommand(e)})
    menuID = [];
    menuID.push(GM_registerMenuCommand(`${Hide_Shorts_Renderer?"Dis":"En"}able "Hide Shorts Renderer"`, ()=>
    {
        Hide_Shorts_Renderer = !Hide_Shorts_Renderer;
        GM_setValue("Hide_Shorts_Renderer", Hide_Shorts_Renderer);
        toggle.renderer();
        setMenu();
    }))
    menuID.push(GM_registerMenuCommand(`${Hide_Shorts_Video?"Dis":"En"}able "Hide Shorts Video"`, ()=>
    {
        Hide_Shorts_Video = !Hide_Shorts_Video;
        GM_setValue("Hide_Shorts_Video", Hide_Shorts_Video);
        toggle.video();
        setMenu();
    }))
    menuID.push(GM_registerMenuCommand(`${Redirect_Shorts_URL?"Dis":"En"}able "Redirect Shorts URL"`, ()=>
    {
        Redirect_Shorts_URL = !Redirect_Shorts_URL;
        GM_setValue("Redirect_Shorts_URL", Redirect_Shorts_URL);
        toggle.redirect();
        setMenu();
    }))
}

console.log("[Anti Shorts] try to call function");

toggle.redirect();
toggle.renderer();
toggle.video();
setMenu();


document.addEventListener("yt-page-data-fetched", onPageUpdate)
document.addEventListener("yt-navigate-finish", onPageUpdate);
waitElementLoad("yt-page-navigation-progress",false,40,250)
    .then((e)=>{new MutationObserver(onPageUpdate).observe(e, {attributes: true});})
window.addEventListener("state-change", onPageUpdate);

console.log("[Anti Shorts] loaded");
