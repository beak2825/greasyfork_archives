// ==UserScript==
// @name                Remove Shorts in Youtube
// @name:zh             Remove Short in Youtube
// @namespace           Anon
// @version             0.1.2
// @description         Remove Shorts in youtube domain (youtube.com)
// @description:zh      Remove Shorts in youtube domain (youtube.com)
// @author              Anon
// @match               *://*.youtube.com/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @run-at              document-start
// @require             https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/477387/Remove%20Shorts%20in%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/477387/Remove%20Shorts%20in%20Youtube.meta.js
// ==/UserScript==


let Hide_Shorts_Renderer = GM_getValue("Hide_Shorts_Renderer", true);
let Hide_Shorts_Video = GM_getValue("Hide_Shorts_Video", true);
let Redirect_Shorts_URL = GM_getValue("Redirect_Shorts_URL", true);

Node.prototype.getParentElement = function(times = 0){let e=this;for(let i=0;i<times;i++)e=e.parentElement;return e;}

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

            if(tryTimes>0 && ++t>tryTimes) {reject(new Error("Wait Timeout"));return;}
            await delay(interval);
        }
        resolve(result);
    })
}

const CSS4_has_Support = (()=>{try{document.querySelector(":has(body)");return true;}catch{return false;}})();

let videos = [], menuID = [], oldHref = null, timeLock = false;

const css =
{
    hideRenderer: document.createElement("style"),
    hideVideo: document.createElement("style"),
}
css.hideRenderer.innerHTML = `
ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer,
ytd-mini-guide-entry-renderer[aria-label='Shorts'],
ytd-rich-shelf-renderer[is-shorts],
a.yt-simple-endpoint.style-scope.ytd-guide-entry-renderer[title='Shorts']
{display:none !important}`;
css.hideVideo.innerHTML = `
ytd-video-renderer:has(a[href^='/shorts']),
ytd-grid-video-renderer:has(a[href^='/shorts']),
ytd-compact-video-renderer:has(a[href^='/shorts']),
ytd-search ytd-shelf-renderer:has(a[href^='/shorts']),
ytd-browse ytd-item-section-renderer:has(yt-img-shadow#avatar):has(div#title-text):has(ytd-video-renderer):has(a[href^='/shorts'])
{display:none !important}`;
const f = (e)=>
{
    let t = e.getParentElement(3);
    videos.push(t);
    t.hidden=true;
}

const onPageUpdate = () =>
{
    if (oldHref != window.location.href)
    {
        oldHref = window.location.href;
        toggle.redirect();
    }

    if(Hide_Shorts_Video && !timeLock)
    {
        timeLock = true;
        delay(200).then(()=>{timeLock = false;});
        videos.forEach((e)=>{e.hidden=false;})
        videos = [];
        document.querySelectorAll("a[href^='/shorts']").forEach(f);
    }
}

const toggle =
{
    renderer: ()=>
    {
        if(Hide_Shorts_Renderer) document.documentElement.append(css.hideRenderer);
        else css.hideRenderer.remove();
    },

    video: ()=>
    {
        if(Hide_Shorts_Video)
        {
            document.querySelectorAll("a[href^='/shorts']").forEach(f);
            document.arrive("a[href^='/shorts']", f);
            if(CSS4_has_Support) document.documentElement.append(css.hideVideo);
        }
        else
        {
            document.unbindArrive("a[href^='/shorts']");
            videos.forEach((e)=>{e.hidden=false;})
            videos = [];
            if(CSS4_has_Support) css.hideVideo.remove();
        }
    },

    redirect: ()=>
    {
        if(Redirect_Shorts_URL && window.location.pathname.indexOf("/shorts/")!=-1) window.location.replace(window.location.href.replace("/shorts/","/watch?v="));
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

toggle.redirect();
toggle.renderer();
toggle.video();
setMenu();

waitElementLoad("yt-page-navigation-progress",false,40,250)
    .then((e)=>{new MutationObserver(onPageUpdate).observe(e, {attributes: true});})
    .catch(()=>
    {
        onPageUpdate();
        document.addEventListener("yt-page-data-fetched", onPageUpdate)
        document.addEventListener("yt-navigate-finish", onPageUpdate);
    })

console.log("RemoveShorts executed");