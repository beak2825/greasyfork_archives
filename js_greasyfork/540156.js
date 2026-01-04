// ==UserScript==
// @name         Twonky Explorer
// @version      v20250703.1430
// @description  An alternative Web UI to navigate Twonky servers
// @author       ltlwinston
// @match        http*://*/twonkyexplorer*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/zlibjs@0.3.1/bin/zlib.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1/dist/index.global.min.js
// @require      https://cdn.jsdelivr.net/npm/video.js@8.23.3/dist/video.min.js
// @require      https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/js/all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/core-js/3.43.0/minified.js
// @ require      https://cdn.jsdelivr.net/npm/navigation-api-polyfill@0.0.6/dist/index.min.js
// @namespace    https://greasyfork.org/users/754595
// @downloadURL https://update.greasyfork.org/scripts/540156/Twonky%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/540156/Twonky%20Explorer.meta.js
// ==/UserScript==

if (!window.navigation) {
    var u=()=>Math.random().toString(36).substr(2,10),p=class{constructor(){this.eventListeners={navigate:[],currentchange:[],navigatesuccess:[],navigateerror:[]};this.onEventListeners={navigate:null,currentchange:null,navigatesuccess:null,navigateerror:null};this.current=new d({url:window.location.href}),this.current.__updateEntry(void 0,0),this.entries=[this.current],this.canGoBack=!1,this.canGoForward=!1}getOptionsFromParams(e,t){let n;switch(typeof e){case"string":{t&&typeof t=="object"?(n=t,n.url=e):n={url:e};break}case"object":{e&&(n=e);break}default:break}return n}reload(e){return this.navigate(this.current.url,e)}navigate(e,t){return new Promise((n,r)=>{let v=performance.now(),i=this.getOptionsFromParams(e,t);if(i?.replace&&Object.keys(i).length===1){r(new Error("Must include more options than just {'replace: true'}"));return}let s=this.current,a=new d(i,this.current),L=this.sendNavigateEvent(i?.replace?this.current:a,i?.navigateInfo);i?.replace||this.current.__fireEventListenersForEvent("navigatefrom");let y=this.entries.findIndex(o=>o.key===s.key),A=new URL(a.url);console.log({upcomingEntry:a}),A.origin===window.location.origin?i?.replace?(console.log("replace"),window.history.replaceState(i?.state,"",a.url)):window.history.pushState(i?.state,"",a.url):window.location.assign(a.url),i?.replace&&this.current.__updateEntry(i??{}),i?.replace||(this.current=a,this.canGoBack=!0,this.canGoForward=!1);let w=this.transition;this.transition=new l({type:i?.replace?"replace":"push",from:s}),this.sendCurrentChangeEvent(v),i?.replace||this.current.__fireEventListenersForEvent("navigateto"),w&&s.__fireAbortForAssociatedEvent();let c;a.__getAssociatedAbortSignal()?.addEventListener("abort",()=>{c=new DOMException(`A new entry was added before the promises passed to transitionWhile() resolved for entry with url ${a.url}`,"AbortError"),this.sendNavigateErrorEvent(c),w?.__fireReject(c)},{once:!0}),i?.replace||(this.entries.slice(y+1).forEach(o=>{o.__updateEntry(void 0,-1),o.__fireEventListenersForEvent("dispose")}),this.entries=[...this.entries.slice(0,y+1),this.current].map((o,m)=>(o.__updateEntry(void 0,m),o))),Promise.all(L).then(()=>{if(c)throw c;(i?.replace?s:a).__fireEventListenersForEvent("finish"),this.sendNavigateSuccessEvent(),n(),this.transition?.__fireResolve(),this.transition=void 0}).catch(o=>{if(o&&o===c){r(o);return}(i?.replace?s:a).__fireEventListenersForEvent("finish"),this.sendNavigateErrorEvent(o),r(o),this.transition?.__fireReject(o),this.transition=void 0})})}set onnavigate(e){this.addOnEventListener("navigate",e)}set oncurrentchange(e){this.addOnEventListener("currentchange",e)}set onnavigatesuccess(e){this.addOnEventListener("navigatesuccess",e)}set onnavigateerror(e){this.addOnEventListener("navigateerror",e)}addOnEventListener(e,t){this.onEventListeners[e]&&(e==="navigate"?this.eventListeners.navigate=this.eventListeners.navigate.filter(n=>n!==this.onEventListeners.navigate):this.eventListeners[e]=this.eventListeners[e].filter(n=>n!==this.onEventListeners[e])),this.onEventListeners[e]=t,t&&this.addEventListener(e,t)}addEventListener(e,t){if(e==="navigate"||e==="currentchange"||e==="navigatesuccess"||e==="navigateerror"){_(e,t)?this.eventListeners.navigate.includes(t)||this.eventListeners.navigate.push(t):this.eventListeners[e].includes(t)||this.eventListeners[e].push(t);return}throw new Error("appHistory does not listen for that event at this time")}async goTo(e,t){let n=this.entries.findIndex(v=>v.key===e);if(n===-1)throw new DOMException("InvalidStateError");let r=this.entries[n];return this.changeCurrentEntry(r,t)}async back(e){let t=this.entries.findIndex(r=>r.key===this.current.key);if(t===0)throw new DOMException("InvalidStateError");let n=this.entries[t-1];return this.changeCurrentEntry(n,e)}async forward(e){let t=this.entries.findIndex(r=>r.key===this.current.key);if(t===this.entries.length-1)throw new DOMException("InvalidStateError");let n=this.entries[t+1];return this.changeCurrentEntry(n,e)}async changeCurrentEntry(e,t){let n=this.sendNavigateEvent(e,t?.navigateInfo),r=this.current;r.__fireEventListenersForEvent("navigatefrom"),this.current=e,this.canGoBack=this.current.index>0,this.canGoForward=this.current.index<this.entries.length-1;let v=this.transition;this.transition=new l({type:"traverse",from:r}),e.__fireEventListenersForEvent("navigateto"),v&&r.__fireAbortForAssociatedEvent();let i;return e.__getAssociatedAbortSignal()?.addEventListener("abort",()=>{i=new DOMException(`A new entry was added before the promises passed to transitionWhile() resolved for entry with url ${e.url}`,"AbortError"),this.sendNavigateErrorEvent(i),v?.__fireReject(i)},{once:!0}),Promise.all(n).then(()=>{if(i)throw i;e.__fireEventListenersForEvent("finish"),this.sendNavigateSuccessEvent(),this.transition?.__fireResolve(),this.transition=void 0}).catch(s=>{throw s&&s===i||(e.__fireEventListenersForEvent("finish"),this.sendNavigateErrorEvent(s),this.transition?.__fireReject(s),this.transition=void 0),s})}sendNavigateEvent(e,t){let n=[],r=new URL(e.url,window.location.origin+window.location.pathname),v=r.origin===window.location.origin,i=new f({cancelable:!0,userInitiated:!0,hashChange:e.sameDocument&&r.hash!==window.location.hash,destination:e,info:t,canIntercept:v,transitionWhile:s=>{if(v)e.sameDocument=!0,n.push(s);else throw new DOMException("Cannot call NavigateEvent.transitionWhile() if NavigateEvent.canIntercept is false","SecurityError")}});if(e.__associateNavigateEvent(i),this.eventListeners.navigate.forEach(s=>{try{s.call(this,i)}catch(a){setTimeout(()=>{throw a})}}),i.defaultPrevented)throw new DOMException("AbortError");return n}sendCurrentChangeEvent(e){this.eventListeners.currentchange.forEach(t=>{try{t.call(this,new E({startTime:e}))}catch(n){setTimeout(()=>{throw n})}})}sendNavigateSuccessEvent(){this.eventListeners.navigatesuccess.forEach(e=>{try{e(new CustomEvent("TODO figure out the correct event"))}catch(t){setTimeout(()=>{throw t})}})}sendNavigateErrorEvent(e){this.eventListeners.navigateerror.forEach(t=>{try{t(new CustomEvent("TODO figure out the correct event",{detail:{error:e}}))}catch(n){setTimeout(()=>{throw n})}})}},d=class{constructor(e,t){this.eventListeners={navigateto:[],navigatefrom:[],dispose:[],finish:[]};this._state=null,e?.state&&(this._state=e.state),this.key=u(),this.id=u(),this.index=-1;let n=e?.url??t?.url??window.location.pathname,r=new URL(n,window.location.origin+window.location.pathname);this.url=r,this.sameDocument=r.origin===window.location.origin&&r.pathname===window.location.pathname}getState(){return JSON.parse(JSON.stringify(this._state))}addEventListener(e,t){this.eventListeners[e].includes(t)||this.eventListeners[e].push(t)}__updateEntry(e,t){e?.state!==void 0&&(this._state=e.state),e?.url&&(this.url=new URL(e.url,location.origin)),typeof t=="number"&&(this.index=t),this.id=u()}__fireEventListenersForEvent(e){let t=new g({detail:{target:this}},e);this.eventListeners[e].map(n=>{try{n(t)}catch(r){setTimeout(()=>{throw r})}})}__associateNavigateEvent(e){this.latestNavigateEvent=e}__fireAbortForAssociatedEvent(){this.latestNavigateEvent?.__abort()}__getAssociatedAbortSignal(){return this.latestNavigateEvent?.signal}},f=class extends Event{constructor(t){super("NavigateEvent",t);this.userInitiated=t.userInitiated??!1,this.hashChange=t.hashChange??!1,this.destination=t.destination,this.formData=t.formData,this.canIntercept=t.canIntercept,this.transitionWhile=t.transitionWhile,this.info=t.info,this.abortController=new AbortController,this.signal=this.abortController.signal}async intercept({handler:t=Promise.resolve}){return this.transitionWhile(t())}__abort(){this.abortController.abort()}},E=class extends Event{constructor(t){super("AppHistoryCurrentChangeEvent",t);this.startTime=t.startTime}},g=class extends CustomEvent{constructor(e,t){super(t,e)}},l=class{constructor({type:e,from:t}){this.type=e,this.from=t,this.finished=new Promise((n,r)=>{this.finishedResolveReject={resolve:n,reject:r}}),this.finished.catch(()=>{})}rollback(){return Promise.resolve(void 0)}__fireResolve(){this.finishedResolveReject?.resolve(void 0)}__fireReject(e){this.finishedResolveReject?.reject(e)}};function _(h,e){return h==="navigate"}Object.defineProperty(window,"navigation",{value:new p,enumerable:!0,configurable:!1});window.addEventListener("click",O);window.addEventListener("popstate",()=>window.navigation.navigate(location.pathname));function O(h){let e=h.composedPath().find(({tagName:t})=>t==="A");!e?.href||new URL(e.href).hash||e.target||e.hasAttribute("download")||e.getAttribute("rel")==="external"||(h.preventDefault(),window.navigation.navigate(e.href,{info:{type:`${e.nodeName.toLowerCase()}-click`}}))}
}

GM_addElement('link',{
    rel: "stylesheet",
    href: "//cdn.jsdelivr.net/npm/flag-icons@7.5.0/css/flag-icons.min.css"
});
GM_addElement('link',{
    rel: "stylesheet",
    href: "//cdn.jsdelivr.net/npm/video.js@8.23.3/dist/video-js.min.css"
});

let jQuery = unsafeWindow.jQuery || window.jQuery;
let Zlib = unsafeWindow.Zlib || window.Zlib;
let md5 = unsafeWindow.md5 || window.md5;

const ENABLE_JSON_CACHE = true;
const KNOWN_LANGS = ['it','en'];

function browserSupportsLangAPI() {
    return (typeof LanguageDetector !== 'undefined' && typeof Translator !== 'undefined');
}
async function detectLang(text) {
    try {
        const detector = await LanguageDetector.create();
        const result = await detector.detect(text);
        if (!result || result.length===0) {
            return false;
        }
        return result[0].detectedLanguage;
    } catch(e){
        return false;
    }
}
async function isForeignLang(text) {
    return !KNOWN_LANGS.includes(await detectLang(text));
}
async function translate(text) {
    try {
        const translator = await Translator.create({
            sourceLanguage: await detectLang(text), //try to detect language
            targetLanguage: KNOWN_LANGS[0], //use the first known language
        });
        return await translator.translate(text);
    } catch(e){
        return text;
    }
}

function fixUrl(url) {
    if (!url || typeof url !== 'string') {
        return "";
    }
    const re = /((127\.\d+\.\d+\.\d+)|(10\.\d+\.\d+\.\d+)|(172\.1[6-9]\.\d+\.\d+)|(172\.2[0-9]\.\d+\.\d+)|(172\.3[0-1]\.\d+\.\d+)|(192\.168\.\d+\.\d+))(:\d+)?/g;
    return url.replace(re,window.location.host);
}
async function loadServerStatus() {
    let status = await fetch('/nmc/rss/server?start=0&fmt=json').then(r => r.json())
    .catch(e => {
        console.log('First load server status request failed, re-trying....',e);
    });
    if (status) {
        return status;
    }
    const serverData = {};
    await fetch('/rpc/info_status').then(r => r.text()).then(s => s.split(/[\t\n ]/).forEach(i => {
        const [k,v] = i.split('|');
        switch(k) {
            case 'server_udn':
                serverData.bookmark = v;
                break;
            default:
                serverData[k] = v;
                break;
        }
    }));
    return {item:[serverData]};
}
async function addTreeview(uuid) {
    const tv = jQuery('<div id="tv" style="max-width: 14em; max-height: 800px; overflow: auto;"></div>');
    tv.css('float:', 'left');
    tv.css('color', 'black');
    tv.css('background', '#cccccc');
    tv.append(await createTreeLevel('/', uuid, []));
    jQuery(document.body).append(tv);
    createNewGallery();
}
function createNewGallery() {
    const gallery = jQuery(`<div class="newgallery" style="float: left; overflow: auto; background: white;"></div>`);
    jQuery(document.body).append(gallery);
}
function displayFolder(child) {
    let title = child.title;
    if ('childCount' in child.meta) {
        title = `${title} [${child.meta.childCount}]`;
    }
    let cover = false;
    try {
        cover = fixUrl(child.meta['upnp:albumArtURI']);
    } catch(e){
    }
    let folder = '<span class="fa fa-folder" style="font-size: 100px"></span>';
    if (cover) {
        folder = `
          <span class="absolute fa fa-spinner fa-spin text-gray-200" style="font-size: 100px"></span>
          <img class="rounded-lg h-auto max-w-full hover:brightness-200 max-h-64 min-h-32 invisible" src="${cover}">`;
    }
    const link = jQuery(`
    <a href="${createNavigateUrl(child.title, child.bookmark, [], true)}" class="gtranslate grid place-items-center">
      ${folder}
      <div class="break-all text-xs"><i class="fa fa-folder"></i> ${title}</div>
    </a>`);
    link.click((e)=>{
        e.preventDefault();
        e.stopPropagation();
        navigateTo(child.title, child.bookmark, [], true);
    });
    jQuery('img',link).on('error', function(e) {
        jQuery('.fa-spin', link).remove();
        jQuery(this).replaceWith('<span class="fa fa-folder" style="font-size: 150px"></span>');
    });
    jQuery('img',link).on('load', function(e) {
        jQuery(this).removeClass('invisible');
        jQuery('.fa-spin', link).remove();
    });
    const cont = jQuery(`<p style="display: inline-block; position: relative; padding: 0.5em;"></p>`);
    cont.append(link);
    jQuery('#grid').append(cont);
}

function popupImage(title, content, imgElem) {
    const $modal = jQuery(`
<div tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-white/[var(--bg-opacity)] [--bg-opacity:70%] bg-opacity-30 place-items-center">
    <div class="relative p-4 w-full h-full">
        <!-- Modal content -->
        <div class="relative bg-white h-full flex flex-col rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex-none flex flex-row items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    ${title}
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crypto-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="flex-1 grow p-4 md:p-5">
              <div class="text-sm grid grid-cols-4 h-full">
                <div class="bg-white p-4 text-pretty overflow-auto break-all h-full">${content}</div>
                <div class="relative col-span-3 h-full grid place-items-center">
                  <div class="absolute h-full">
                    <a href="${imgElem.src}" class="text-white" target="_blank">
                      <span class="loading absolute top-[calc(40%)] center"><i class="fa fa-spin fa-spinner" style="font-size: 150px;"></i></span>
                      <img class="popup-img relative h-full object-scale-down invisible" onload="this.dataset.loadcomplete=true" src="${imgElem.src}">
                    </a>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</div>`);
    jQuery('button',$modal).click(() => $modal.remove());
    jQuery('#content').append($modal);
    setTimeout(()=>{
        const $img = jQuery('img',$modal);
        $img.on('error', function(){
            jQuery('.loading',$modal).hide();
            $img.replaceWith(`<h1 class="text-4xl">Error loading picture</h1>`);
        });
        $img.on('load', function(){
            jQuery('.loading',$modal).hide();
            $img.removeClass('invisible');
        });
        $modal.show();
        if($img.data('loadcomplete')) {
            jQuery('.loading',$modal).hide();
            $img.removeClass('invisible');
        }
    }, 100);
}
function popupVideo(title, content, videoElem) {
    const $modal = jQuery(`
<div tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-white/[var(--bg-opacity)] [--bg-opacity:70%] bg-opacity-30 place-items-center">
    <div class="relative p-4 w-full h-full">
        <!-- Modal content -->
        <div class="relative bg-white h-full flex flex-col rounded-lg shadow-sm dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex-none flex flex-row items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">${title}</h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crypto-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="flex-1 grow p-4 md:p-5">
              <div class="text-sm grid grid-cols-4 h-full">
                <div class="bg-white p-4 text-pretty h-full">
                  <a href="${videoElem.src}" target="_blank">
                    <button type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                      <i class="fa fa-video"></i>
                      Download
                      <i class="fa fa-download"></i>
                    </button>
                  </a>
                  <div class="break-all">${content}</div>
                </div>
                <div class="relative col-span-3 h-full grid place-items-center text-white">
                      <span class="z-100 loading absolute top-[calc(50% - 75px)] center invisible"><i class="fa fa-spin fa-spinner" style="font-size: 150px;"></i></span>
                    <video id="my-video" onload="this.dataset.loadcomplete=true" onerror="this.dataset.loaderror=true" class="z-0 video-js relative min-h-full min-w-full h-full w-full object-scale-down" controls preload="auto" poster="${videoElem.poster}" src="${videoElem.src}"></video>
                </div>
              </div>
            </div>
        </div>
    </div>
</div>`);
    jQuery('button',$modal).click(() => $modal.remove());
    jQuery('#content').append($modal);
    setTimeout(()=>{
        const $video = jQuery('video',$modal);
        $video.on('error', function(e){
            jQuery('.loading',$modal).hide();
            $video.replaceWith(`<h1 class="text-2xl">Error loading video<br><small>Cannot reproduce this video, use the Download button to open it on your PC.</h1>`);
        });
        $video.on('loadeddata', function(e){
            jQuery('.loading',$modal).hide();
        });
        $modal.show();
        if($video.data('loadstart')) {
            jQuery('.loading',$modal).show();
        }
        if($video.data('loadcomplete')) {
            jQuery('.loading',$modal).hide();
        }
    }, 100);
}

async function displayImage(child) {
    const res = child.meta.res;
    let src = fixUrl(res[res.length-1].value);
    if (res.every(x => !!x.resolution)) {
        src = fixUrl(res.reduce((acc, curr) => {
            let [cw,ch] = curr.resolution.split('x');
            let [aw,ah] = acc.resolution.split('x');
            return aw*ah > cw*ch ? curr : acc;
        }).value);
    }
    const href = fixUrl(res[0].value);
    const ext = child.meta['pv:extension'];
    const $cont = jQuery(`<div class=""></div>`);
    /*
    <br>
    */
    const link = jQuery(`
    <a href="${href}" target="_blank" class="grid place-items-center">
      <span class="absolute fa fa-spinner fa-spin text-gray-200" style="font-size: 100px"></span>
      <img class="rounded-lg h-auto max-w-full hover:brightness-200 max-h-64 min-h-32 invisible" src="${src}">
    </a>`);/*
    link.click(e => {
        e.preventDefault();
        e.stopPropagation();
        popupImage(child.title, Object.keys(child.meta).map(key => key + ": " + child.meta[key]).join("<br>"), {src: href});
    });*/
    jQuery('img',link).on('error', function(e) {
        jQuery('.fa-spin', link).remove();
        jQuery(this).replaceWith('<span class="fa fa-image text-gray-200" style="font-size: 150px"></span>');
    });
    jQuery('img',link).on('load', function(e) {
        jQuery(this).removeClass('invisible');
        jQuery('.fa-spin', link).remove();
    });
    $cont.append(link);

    const desc = jQuery(`<p class="text-xs text-center gtranslate"></p>`);
    const infoBtn = jQuery(`<a class="pr" href="#"><i class="fa fa-info-circle" style="font-size: 2em;"></i></a>`);
    infoBtn.click((e) => {
        e.preventDefault();
        e.stopPropagation();
        popupImage(child.title, Object.keys(child.meta).map(key => {
            let value = child.meta[key];
            if (/PersistentBookmark/.test(key)) {
                const valueItems = value.split(',-');
                value = b64DecodeUnicode(valueItems[1]);
            }
            return `${key}: ${value}`;
        }).join("<br>"), {src: href});
    });
    desc.append(infoBtn);
    desc.append(`<b class="flex-1 ms-3 whitespace-nowrap"></b>${child.title.length > 30 ? child.title.substring(0,20)+'...' : child.title} [${ext}]`);
    link.append(desc);
    /**/
    if ('upnp:album' in child.meta) {
        const albumTitle = child.meta['upnp:album'];
        const albumBookmark = await findImageAlbumBookmarkByName(albumTitle,getUuidFromBookmark(child.bookmark));
        if (albumBookmark) {
            const albumUrl = createNavigateUrl(albumTitle, albumBookmark);
            $cont.append(`<a href="${albumUrl}" class="text-xs break-all"><span class="fa fa-folder"></span> ${albumTitle}`);
        }
    }/**/

    jQuery('#grid').append($cont);
}
async function displayVideo(child) {
    let src = '';
    let href = '';
    let ext = '';
    let duration = '';
    const res = child.meta.res;
    src = fixUrl(res[res.length-1].value);
    if (!/(jpg|jpeg|png|gif)/i.test(src)) {
        src = '/resources/webbrowse/nocover_video.jpg';
    }
    href = fixUrl(res[0].value);
    ext = child.meta['pv:extension'];
    duration = child.meta['pv:duration'] || '';
    const $cont = jQuery(`<div class=""></div>`);
    /*
    <br>
    */
    const link = jQuery(`
    <a href="${href}" target="_blank" class="grid place-items-center">
      <div class="relative grid place-items-center">
        <span class="absolute fa fa-spinner fa-spin text-gray-200" style="font-size: 100px"></span>
        <span class="absolute bottom-1 text-sm text-shadow-[1px_1px_0px] text-shadow-white">${duration}</span>
        <img class="rounded-lg h-auto max-w-full hover:brightness-200 max-h-64 min-h-32 invisible" src="${src}">
      </div>
    </a>`);
    jQuery('img',link).on('error', function(e) {
        jQuery('.fa-spin', link).remove();
        jQuery(this).replaceWith('<span class="fa fa-film text-gray-200" style="font-size: 150px"></span>');
    });
    jQuery('img',link).on('load', function(e) {
        jQuery(this).removeClass('invisible');
        jQuery('.fa-spin', link).remove();
    });
    $cont.append(link);

    const desc = jQuery(`<p class="text-xs text-center gtranslate"></p>`);
    const infoBtn = jQuery(`<a class="pr" href="#"><i class="fa fa-info-circle" style="font-size: 2em;"></i></a>`);
    infoBtn.click((e) => {
        e.preventDefault();
        e.stopPropagation();
        popupVideo(child.title, Object.keys(child.meta).map(key => {
            let value = child.meta[key];
            if (/PersistentBookmark/.test(key)) {
                const valueItems = value.split(',-');
                value = b64DecodeUnicode(valueItems[1]);
            }
            return `${key}: ${value}`;
        }).join("<br>"), {poster: src, src: href});
    });
    desc.append(infoBtn);
    desc.append(`<b class="flex-1 ms-3 whitespace-nowrap"></b>${child.title.length > 30 ? child.title.substring(0,20)+'...' : child.title} [${ext}]`);
    link.append(desc);
    /**/
    if ('upnp:album' in child.meta) {
        const albumTitle = child.meta['upnp:album'];
        const albumBookmark = await findVideoAlbumBookmarkByName(albumTitle,getUuidFromBookmark(child.bookmark));
        if (albumBookmark) {
            const albumUrl = createNavigateUrl(albumTitle, albumBookmark);
            $cont.append(`<a href="${albumUrl}" class="text-xs break-all"><span class="fa fa-folder"></span> ${albumTitle}`);
        }
    }/**/
    jQuery('#grid').append($cont);
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

async function findVideoAlbumBookmarkByName(albumName, uuid) {
    const key = `${uuid}_vid_${albumName}`.toLowerCase();
    return albumCache.get(key) || false;
}
async function findImageAlbumBookmarkByName(albumName, uuid) {
    const key = `${uuid}_img_${albumName}`.toLowerCase();
    return albumCache.get(key) || false;
}
async function preloadAlbumCache(uuid) {
    const bookmarks = [
        {
            type: 'img',
            bookmark: `${uuid},_MCQyJDI0,,1,0,_Um9vdA==,0,,0,0,_UGhvdG9z,_MCQz,`
        },
        {
            type: 'vid',
            bookmark: `${uuid},_MCQzJDM1,,1,0,_Um9vdA==,0,,0,0,_VmlkZW9z,_MCQz,`
        }
    ];
    for(const bookmark of bookmarks) {
        const allAlbums = await getJsonByBookmark(bookmark.bookmark, 0, 'ALL');
        if (allAlbums && allAlbums.item) {
            for(const album of allAlbums.item) {
                albumCache.set(`${uuid}_${bookmark.type}_${album.title}`.toLowerCase(), album.bookmark);
            }
        }
    }
}
async function fillGrid($grid, children) {
    for(const child of children.item) {
        try{
            switch (child.meta['upnp:class']) {
                case 'object.item.imageItem.photo':
                    await displayImage(child);
                    break;
                case 'object.item.videoItem':
                case 'object.item.videoItem.movie':
                    await displayVideo(child);
                    break;
                case 'object.container':
                case 'object.container.storageFolder':
                case 'object.container.album.musicAlbum':
                case 'object.container.album.photoAlbum':
                case 'object.container.playlistContainer':
                    await displayFolder(child);
                    break;
                default:
                    console.error('BOH!',child);
            }
        }catch(e){
            console.error(e);
        }
    }
}

async function createTranslatableTextHtml(text) {
    if (!browserSupportsLangAPI()) return text;
    const langOrig = await detectLang(text);
    const langDest = KNOWN_LANGS[0];
    const translation = await translate(text);
    if (!langOrig) return text;
    const $translatable = jQuery('<div class="inline-block"></div>');
    const $text = jQuery(`<span>${text}</span>`);
    const $trBtn = jQuery(`<i class="ml-1"></i>`);
    $trBtn.addClass(`fi`);
    $trBtn.addClass(`fi-${langOrig}`);
    $trBtn.click(e => {
        e.preventDefault();
        e.stopPropagation();
        $text.text((_,t) => t === text ? translation : text);
        $trBtn.toggleClass([`fi-${langOrig}`,`fi-${langDest}`]);
    });
    $translatable.append($text);
    $translatable.append($trBtn);
    return $translatable;
}

async function openFolder(bookmark, parents, start=0, count=100) {
    console.log(`[openFolder] Opening ${bookmark} start=${start} count=${100}`);
    const $content = jQuery('#content');
    $content.empty();
    $content.append(`<h1>LOADING <i class="fa fa-spinner fa-spin" style="font-size:1.2em"></i></h1>`);
    const children = await getJsonByBookmark(bookmark, start, count)
    .catch(e => {
        $content.empty();
        $content.append(`<h1>Error loading data: ${e}</h1>`);
    });
    if (!children) {
        return;
    }
    if (!children.item || children.item.length === 0) {
        if (start === 0) {
            $content.empty();
            $content.append(`<h1>EMPTY</h1>`);
        }
        return;
    }
    $content.empty();
    $content.append(`<div id="breadcrumb" class="text-left"></div>`);
    const $breadcrumb = jQuery('#breadcrumb');
    let breadcrumbUrl = '/twonkyexplorer'
    if ((!parents || parents.length===0) && (children.parentList && children.parentList.length>0)) {
        parents = children.parentList.map(p => ({name: p.title, bookmark: getBookmarkFromTwonkyUrl(p.url)})).reverse().filter(p => !!p.bookmark);
    }
    parents.forEach(p => {
        breadcrumbUrl += `/${encodeURIElem(p.name,p.bookmark)}`;
        $breadcrumb.append(`<a href="${breadcrumbUrl}">${p.name}</a>&nbsp;&raquo;&nbsp;`)
    });
    breadcrumbUrl += `/${encodeURIElem(children.title,bookmark)}`;
    $breadcrumb.append(`<a href="${breadcrumbUrl}">${children.title}</a>`);
    let goToParent = '';
    if (children.parentList && children.parentList.length>0) {
        const parent = children.parentList[0];
        const parentBookmark = getBookmarkFromTwonkyUrl(parent.url);
        const url = createNavigateUrl(parent.title, parentBookmark);
        if (url) {
            goToParent = `<a href="${url}"><span class="fa fa-circle-up"></span></a> `;
        }
    }
    $content.append(`<h1 class="title mb-5 mt-5 text-2xl">${goToParent}${children.title} [${children.childCount}]</h1>`)
    const $grid = jQuery(`<div id="grid" class="grid grid-cols-4 md:grid-cols-6 gap-4"></div>`);
    $content.append($grid);
    await fillGrid($grid, children);
    const $keepLoading = jQuery(`<label><input type="checkbox" id="keep-loading" checked> Keep loading</label>`);
    if (children.childCount>start+count) {
        const moreHtml = `<small class="text-xs"><i id="loaded-children"></i>/<i>${children.childCount}</i></small><br>Load more`;
        const $btnMore = jQuery(`
<button type="button" class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-3xl mt-10 px-5 py-2.5 me-2 mb-30 dark:focus:ring-yellow-900" id="btn-more">
  ${moreHtml}
</button>`);
        $btnMore.data('start', start+count);
        $btnMore.data('count', count);
        $btnMore.click(async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const moreStart = $btnMore.data('start');
            const moreCount = $btnMore.data('count');
            $btnMore.attr('disabled',true);
            $btnMore.html('Loading more... <i class="fa fa-spinner fa-spin"></i>');
            const moreChildren = await getJsonByBookmark(bookmark, moreStart, moreCount)
            .catch(e => {
                $grid.append(`<h1>Error loading more data: ${e}</h1>`);
            });
            if (moreChildren) {
                await fillGrid($grid, moreChildren);
            }
            $btnMore.removeAttr('disabled');
            $btnMore.html(moreHtml);
            if (children.childCount<=moreStart+moreCount) {
                $btnMore.hide();
                $keepLoading.hide();
            }else{
                jQuery('#loaded-children').text(moreStart+moreCount);
                $btnMore.data('start', moreStart+moreCount);
                $btnMore.data('count', moreCount);
                if (jQuery('#keep-loading',$keepLoading).is(':checked')) {
                    setTimeout(() => $btnMore.trigger('click'), 1000);
                }
            }
        });
        $content.append($btnMore);
        $content.append($keepLoading);
        jQuery('#loaded-children').text(start+count);
        $btnMore.show();
        $keepLoading.show();
        if (children.childCount<1000) {
            setTimeout(() => $btnMore.trigger('click'), 1000);
        }
    } else {
        jQuery('#btn-more').remove();
    }
}
async function createTreeLevel(name, bookmark, parents=[], container=false) {
    console.log(`[createTreeLevel] Opening "${name}" ${bookmark}`);
    const levelElem = jQuery(`<li></li>`);
    const linkElem = jQuery(`<div class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"></div>`);
    const nameElem = jQuery(`<a href="#" class="flex-1 ms-3 whitespace-nowrap gtranslate"></a>`);
    nameElem.append(await createTranslatableTextHtml(name));
    const $loadElem = jQuery(`<span class="load-elem"><i class="fa fa-spin fa-spinner"></i></span>`);
    $loadElem.hide();
    const openUrl = createNavigateUrl(name, bookmark, parents, false);
    const openElem = jQuery(`<a href="${openUrl}" class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium hover:bg-green-100 text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">&rarr;</a>`);
    levelElem.append(linkElem);
    linkElem.append(nameElem);
    linkElem.append($loadElem);
    linkElem.append(openElem);
    const childrenElem = jQuery(`<ul class="py-2 space-y-2 pl-5 text-sm"></ul>`);
    childrenElem.hide();
    levelElem.append(childrenElem);

    nameElem.click(async function(){
        event.preventDefault();
        event.stopPropagation();
        if(!container) {
            $loadElem.show();
            await openFolder(bookmark, [], $loadElem, 0, 100);
            $loadElem.hide();
            return;
        }
        if( childrenElem.data('loaded') ) {
            childrenElem.toggle();
        }else {
            $loadElem.show();
            getJsonByBookmark(bookmark).then(children => {
                if (!children.item || children.item.length === 0) {
                    childrenElem.append(jQuery('<li>Empty</li>'));
                } else {
                    children.item.forEach(async child => {
                        let title = child.title;
                        if ('childCount' in child.meta) {
                            title = `${title} [${child.meta.childCount}]`;
                        }
                        childrenElem.append(await createTreeLevel(title, child.bookmark, [...parents,{name,bookmark}], /object\.container/.test(child.meta['upnp:class'])));
                    });
                }
                childrenElem.show();
                childrenElem.data('loaded', true);
                $loadElem.hide();
            }).catch(e => {
                console.error('Error on getJsonByBookmark: ',e);
                childrenElem.empty();
                childrenElem.append(`<p>ERROR: ${e}</p>`);
                childrenElem.show();
                $loadElem.hide();
            });
        }
    });

    return levelElem;
}
function buildUrl(bookmark, start=0, count=100) {
    const uuid = getUuidFromBookmark(bookmark);
    return `/nmc/rss/server/RB${uuid},0/IB${bookmark}?start=${start}&count=${count}&fmt=json`;
}
function decodeData(encodedData) {
    try {
        if (!encodedData) {
            return "";
        }
        const data = Uint8Array.fromBase64(encodedData);
        const inflate = new Zlib.Inflate(data);
        return JSON.parse(new TextDecoder().decode(inflate.decompress()));
    }catch(e) {
        console.error('decodeData() error:',e);
        return "";
    }
}
function encodeData(data) {
    const deflate = new Zlib.Deflate(new TextEncoder().encode(JSON.stringify(data)));
    const compressed = deflate.compress();
    return compressed.toBase64();
}
unsafeWindow.encodeData=encodeData;
function dataCachePut(id, data) {
    window.localStorage.setItem(md5(id), encodeData(data));
}
function dataCacheGet(id) {
    const cached = window.localStorage.getItem(md5(id));
    return decodeData(cached);
}
function getBookmarkFromTwonkyUrl(twonkyUrl) {
    const data = `${twonkyUrl}`.match(/IB(uuid:[a-zA-Z0-9,-_=]+)$/);
    if (data) {
        return data[1];
    }
    return false;
}
function getUuidFromBookmark(bookmark) {
    return bookmark.split(',')[0];
}
function isMalformedJsonError(text) {
    return /\{ error : ".*" \}/.test(text);
}
function parseMalformedJsonError(text) {
    return JSON.parse('{ error : "{"success": false, "code": 3, "message": "Specified device does not exist"}" }'.match(/\{ error : "(.*)" \}/)[1]);
}
async function getJsonByBookmark(bookmark, start=0, count=100) {
    const cacheId = `${bookmark}_${start}_${count}`;
    const existing = dataCacheGet(cacheId);
    if (existing && ENABLE_JSON_CACHE) {
        return new Promise((resolve) => resolve(existing));
    }
    const json = await fetch(buildUrl(bookmark, start, count)+'&fmt=json')
        .then(r => r.text())
        .then(r => {
            if (isMalformedJsonError(r)) {
                const error = parseMalformedJsonError(r);
                throw new Error(error.message);
                return null;
            }
            try {
                return JSON.parse(r.replace(/[\x01-\x19]/g,''));
            }catch(e) {
                console.error('Unexpected error:',e);
                return null;
            }
        });
    dataCachePut(cacheId, json);
    return json;
}
unsafeWindow.changeLang = function (lang) {
    console.log('LANG: '+lang);
}

function showNoServerMessage($content) {
    $content.empty();
    $content.append(`<h1>No compatible Twonky Server found!<br>Refresh to return to original page</h1>`);
}
function isBase64(text) {
    return /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(text);
}
function parseUrl(url) {
    let twonkyPath = url.replace(/\/twonkyexplorer(\/)?/,'');
    if (isBase64(twonkyPath)) {
        twonkyPath = decodeData(twonkyPath);
    }
    return twonkyPath.split('/');
}
function handleUrl(url) {
    const bookmarks = parseUrl(url);
    if (bookmarks.length>0) {
        const last = bookmarks.pop();
        if (last) {
            const {name,bookmark} = decodeURIElem(last);
            const parents = bookmarks.map(b => decodeURIElem(b));
            //console.log(`Opening Folder "${name}" @ ${bookmark} parents: `, parents);
            openFolder(bookmark, parents);
        }
    }
}
function createBookmarkById(uuid, id) {
    return `/nmc/rss/server/RB${uuid},0/IB${uuid},_${atob(id)},,,,0,0,`;
}
function createNavigateUrl(name, bookmark, parents=[], append=false) {
    if (!name || !bookmark) {
        return false;
    }
    let twonkyPath = '';
    parents.forEach(p => {twonkyPath += '/' + encodeURIElem(p.name,p.bookmark)});
    twonkyPath += '/' + encodeURIElem(name, bookmark);
    if (append) {
        const currentBookmarks = parseUrl(new URL(window.location.href).pathname);
        twonkyPath = currentBookmarks.join('/') + `/${encodeURIElem(name,bookmark)}`;
    }
    const encodedTwonkyPath = encodeData(twonkyPath);
    return '/twonkyexplorer/' + encodedTwonkyPath;
}
function navigateTo(name, bookmark, parents=[], append=false) {
    window.navigation.navigate(createNavigateUrl(name, bookmark, parents, append));
}
function routingSetup() {
    window.navigation.addEventListener('navigate', navigateEvent => {
        const url = new URL(navigateEvent.destination.url);
        if (!url.pathname.match(/twonkyexplorer/)) {
            return;
        }
        navigateEvent.intercept({handler: () => handleUrl(url.pathname)});
    });
    handleUrl(new URL(window.location.href).pathname);
}

function encodeURIElem(name, bookmark) {
    return `${encodeURIComponent(name)}_@TE@_${encodeURIComponent(bookmark)}`;
}
function decodeURIElem(encoded) {
    const [name,bookmark] = encoded.split('_@TE@_').map(x => decodeURIComponent(x));
    return {name, bookmark};
}
async function initialSetup() {
    console.log('[initialSetup]');

    document.title = 'Twonky Explorer';
    const $body = jQuery(document.body);
    const $head = jQuery(document.head);
    $body.empty();
    $head.append(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
    jQuery('link[type="text/css"]').remove();
    GM_addElement('link',{
        rel: "stylesheet",
        //href: "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
        href: "//cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/css/fontawesome.min.css"
    });
    /*
      <div class="mb-5">
        Translate:
        <select onchange="changeLang(this.value)">
          <option selected>Original</option>
          <option value="it">ITA</option>
          <option value="en">ENG</option>
        </select>
      </div>
    */
    const $layout = jQuery(`
<div id="wrapper" class="">
  <aside id="default-sidebar" class="fixed resize-x top-0 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar" aria-hidden="true">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:text-white dark:bg-gray-800">
      <h1 class="pb-5 text-red-700 text-xl">
        <div class="relative inline-block text-left float-right">
          <button id="btn-clean-cache" data-tooltip-target="tooltip-cache" type="button" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"><i class="fa fa-eraser"></i></button>
        </div>
        Twonky Explorer<br><small>by ltlwinston</small>
      </h1>
      <ul class="space-y-2 font-medium" id="navigation"></ul>
    </div>
  </aside>
  <div class="sm:ml-80 resize-x p-5 text-center" id="content">
    <h1>Welcome to Twonky Explorer!</h1>
    <h2>Use sidebar links to start your journey in this Twonky Server!</h2>
  </div>
</div>
    `)
    $body.append($layout);

    const $nav = jQuery('#navigation');
    const $content = jQuery('#content');
    $nav.append(`<h1>LOADING <i class="fa fa-spinner fa-spin" style="font-size:1.2em"></i></h1>`);
    const status = await loadServerStatus();
    jQuery('#btn-clean-cache').click(e => {
        window.localStorage.clear();
    });

    if (!status || !status.item || status.item.length === 0) {
            showNoServerMessage($content);
    } else {
        $nav.empty();
        let foundOne = false;
        status.item.forEach(async server => {
            if (server.title && server.bookmark) {
                foundOne = true;
                $nav.append(await createTreeLevel(server.title, server.bookmark, [], true));
                preloadAlbumCache(getUuidFromBookmark(server.bookmark));
            }
        });
        if (!foundOne) {
            showNoServerMessage($content);
        }
    }
    routingSetup();

}

const albumCache = new Map();

(async function(window){
    'use strict';
    console.log('_start: initialSetup()');
    initialSetup();
})(unsafeWindow);