// ==UserScript==
// @name               视频自动网页全屏｜倍速播放
// @name:zh-TW         視頻自動網頁全屏｜倍速播放
// @namespace          http://tampermonkey.net/
// @version            3.8.2
// @author             Feny
// @description        支持所有H5视频的增强脚本，通用网页全屏｜倍速调节，对微博 / 推特 / Instagram / Facebook等多视频平台均适用；B站(含直播) / 腾讯视频 / 优酷 / 爱奇艺 / 芒果TV / AcFun 默认自动网页全屏，其他网站可手动开启；自动网页全屏 + 记忆倍速 + 下集切换，减少鼠标操作，让追剧更省心、更沉浸；还支持视频旋转、截图、镜像翻转、缩放与移动、记忆播放进度等功能
// @description:zh-TW  支持所有H5视频的增强脚本，通用網頁全屏｜倍速調節，对微博 / 推特 / Instagram / Facebook等平臺均適用；B站(含直播) / 騰訊視頻 / 優酷 / 愛奇藝 / 芒果TV / AcFun 默認自動網頁全屏，其他網站可手動開啓；自動網頁全屏 + 記憶倍速 + 下集切換，減少鼠標操作，讓追劇更省心、更沉浸；還支持視頻旋轉、截圖、鏡像翻轉、縮放與移動、記憶播放進度等功能
// @license            GPL-3.0-only
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqdJREFUWEftl91LFFEYxp/3jB9ESZjtSl51F1RUSgRCF/kHlF1IhiFhF65dqEQkBUErdJMStBukGwQre2NZUiCRqUiURkW65mIfqGUFsW6Ii0jY7p4Tc3Rqd5zaGVldAudynve8z28e3jMzh5Dmi1R/V0vQyRRWxgWG6x22SrcnOAhQcQIbwVtXba8y1EANSpS1xzJin5c/Dz+jRDPvGWoErwRw35zuh8ChpcXXFjbwi9k/WADA9viGgovGnxtFs6EmcApMvCdBA3oIIirl4N8NNQngmRYJiwTOE7EHHLERAmXFawQ6AdCQkRbjsZIMUvIFoV0HMSsEDjCgSK8tJqAHAEDAMWLKLOexx8tiVVDEhLLVQAtzRPcwKOUANSWCw1/rsBe6PcFz8dpfAdTFgtF+EmIvBG7pID7mZNl2zkVCFQbahzqHfYerddpNhFpdsnfqauzl8ZoEuO4JXdIKOefynnZlimxXhBbqjTZL/el8pzrAVjTGmKh12Bq1ddJs974abQDXfFMuAhQ6EodwDTHWAf6/BAoK8nD0cDEKtuVhyD+OzvvLXnyWJshyApedJ1F65M9n4tlAAF5fL168fGfJWCu2DDA61GpodLvjCdp8vfjyNWQJJGUAquvMzBzafD0yEc65KZCUAmiOo4FPEqS753VSiFUB0FxbPF244en6J8SqAoTD8zhYcjZ9AP6RCVRWNacHYPD5GJqudmBi8tvaAkxNBeUuuNv5NOkAqgUpm4FIJCrfA+r0z4bnTZmvCKCv+wrsts0JBg8fvZLGY28NfoqToFhOoOJ4CS40lMu2I28mpXFP37DpJ9YXWgZQG+Tm5mBL7qakA2aGakUAZhqbrVkH0BLoB34fzcyml5K6pd/yaicRlQlgV0q6mmwitMOpyfpVKfsFya4w73cz9xQAAAAASUVORK5CYII=
// @homepage           https://github.com/xFeny/UserScript/tree/main/monkey-web-fullscreen
// @include            *://x.com/*
// @include            *://vimeo.com/*
// @include            *://www.twitch.tv/*
// @include            *://www.reddit.com/*
// @include            *://www.youtube.com/*
// @include            *://www.facebook.com/*
// @include            *://www.instagram.com/*
// @include            *://www.dailymotion.com/*
// @include            *://geo.dailymotion.com/*
// @include            *://pages.iqiyi.com/p/zy/*
// @match              *://www.mgtv.com/b/*
// @match              *://www.acfun.cn/v/*
// @match              *://www.iqiyi.com/v_*
// @match              *://v.qq.com/x/page/*
// @match              *://v.douyu.com/show/*
// @match              *://v.qq.com/x/cover/*
// @match              *://live.bilibili.com/*
// @match              *://v.youku.com/video?*
// @match              *://v.youku.com/v_show/*
// @match              *://live.acfun.cn/live/*
// @match              *://www.acfun.cn/bangumi/*
// @match              *://www.bilibili.com/list/*
// @match              *://www.bilibili.com/video/*
// @match              *://www.bilibili.com/*/play/*
// @match              *://v.qq.com/live/p/newtopic/*
// @match              *://www.bilibili.com/festival/*
// @match              *://v.qq.com/wasm-kernel/*/fake-video*
// @require            https://unpkg.com/notyf@3.10.0/notyf.min.js
// @require            data:application/javascript,%3Bwindow.notyf%3D%7BNotyf%7D%3B
// @require            https://unpkg.com/sweetalert2@11.20.0/dist/sweetalert2.min.js
// @require            data:application/javascript,%3Bwindow.sweetalert2%3DSwal%3B
// @resource           notyf/notyf.min.css  https://unpkg.com/notyf@3.10.0/notyf.min.css
// @resource           sweetalert2          https://unpkg.com/sweetalert2@11.20.0/dist/sweetalert2.min.css
// @connect            gitee.com
// @grant              GM.xmlHttpRequest
// @grant              GM_addStyle
// @grant              GM_addValueChangeListener
// @grant              GM_deleteValue
// @grant              GM_download
// @grant              GM_getResourceText
// @grant              GM_getValue
// @grant              GM_info
// @grant              GM_listValues
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              GM_unregisterMenuCommand
// @grant              unsafeWindow
// @run-at             document-start
// @note               *://*/*
// @downloadURL https://update.greasyfork.org/scripts/519872/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BD%9C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/519872/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BD%9C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(e=>{const n=Symbol("styleAdded"),t=document.createElement("style");t.textContent=e,window.gmStyle=t,document.addEventListener("addStyle",r=>{const{shadowRoot:o}=r.detail;o[n]||o instanceof Document||(o.prepend(t.cloneNode(!0)),o[n]=!0)}),(GM_addStyle??(()=>document.head.append(t.cloneNode(!0))))(e)})(' @charset "UTF-8";.monkey-toast{line-height:normal;left:10px!important;bottom:16%!important;color:#fff!important;font-size:13px!important;padding:6px 10px!important;border-radius:5px!important;position:absolute!important;z-index:2147483647!important;font-weight:400!important;transition:opacity .3s ease-in!important;background:#000000bf!important}.monkey-toast span{display:inline!important}.monkey-toast .cText{margin:0 3px!important;color:#ff5f00!important}::part(webFullscreen),[part*=webFullscreen],body[part*=webFullscreen] [part*=webFullscreen]{top:0!important;left:0!important;margin:0!important;padding:0!important;zoom:normal!important;border:none!important;width:100vw!important;height:100vh!important;position:fixed!important;transform:none!important;max-width:none!important;max-height:none!important;border-radius:0!important;transition:none!important;z-index:2147483646!important;background-color:#000!important;flex-direction:column!important;overflow:hidden!important;display:flex!important}[part*=webFullscreen]~*:not(.monkey-web-fullscreen){display:none!important}[part*=webFullscreen] video,body[part*=webFullscreen] [part*=webFullscreen] video{top:0!important;left:0!important;width:100vw!important;border:none!important;height:clamp(100vh - 100%,100vh,100%)!important;object-fit:contain!important;transform:scale(var(--scale, 1)) scale(var(--zoom, 1)) scaleX(var(--mirror, 1)) rotate(var(--rotate, 0deg)) translate(var(--moveX, 0),var(--moveY, 0))!important}.__tsr{object-fit:contain!important;transform-origin:center!important;transition:transform .35s!important;transform:var(--deftsr, matrix(1, 0, 0, 1, 0, 0)) scale(var(--scale, 1)) scale(var(--zoom, 1)) scaleX(var(--mirror, 1)) rotate(var(--rotate, 0deg)) translate(var(--moveX, 0),var(--moveY, 0))!important}.__hc{cursor:none!important}.monkey-web-fullscreen{z-index:2147483647!important}.monkey-web-fullscreen *{box-sizing:border-box!important;font-family:Verdana,Geneva,Tahoma,sans-serif}.monkey-web-fullscreen .hide{display:none!important}.monkey-web-fullscreen .swal2-popup{font-size:14px!important}.monkey-web-fullscreen button:where(.swal2-styled):focus{box-shadow:0 0 0 1px #6496c880!important}.monkey-web-fullscreen .swal2-confirm{background-color:#7066e0!important}.monkey-web-fullscreen .swal2-deny{background-color:#dc3741!important}.monkey-web-fullscreen .swal2-cancel{background-color:#757575!important}.monkey-web-fullscreen button:where(.swal2-close){color:#666!important;font-size:1.7em!important;font-weight:bolder!important}.monkey-web-fullscreen h4{color:red!important;margin:0 auto!important;font-size:18px!important;font-weight:400!important}.monkey-web-fullscreen p{color:#999!important;margin-top:0!important;font-size:12px!important}.monkey-web-fullscreen #__picker{width:100%!important;height:auto!important;max-width:25em!important;font-size:14px!important;margin-bottom:0!important;min-height:10em!important;resize:vertical!important}.monkey-web-fullscreen #__picker:focus{box-shadow:0 0 0 1px #6496c880!important}.monkey-web-fullscreen .swal2-tabs-header{display:flex;position:relative;margin-bottom:15px;font-size:15px!important;border-bottom:1px solid #e2e8f0}.monkey-web-fullscreen .swal2-tab{flex:1;cursor:pointer;color:#64748b;font-weight:500;text-align:center;padding:12px 10px;position:relative;transition:all .2s ease}.monkey-web-fullscreen .swal2-tab.active{color:#3b82f6}.monkey-web-fullscreen .swal2-tab.active:after{left:0;content:"";width:100%;height:2px;bottom:-1px;position:absolute;visibility:visible;background-color:#3b82f6;border-radius:2px 2px 0 0}.monkey-web-fullscreen .swal2-tab:hover:not(.active){color:#3b82f6}.monkey-web-fullscreen .swal2-tabs-content{width:100%;padding:0 5px;min-height:325px}.monkey-web-fullscreen .swal2-tab-panel{display:none}.monkey-web-fullscreen .swal2-tab-panel.active{display:block}.monkey-web-fullscreen .__menu{margin:0 0 5px!important;padding:0 0 5px!important;float:none!important;height:30px!important;color:#666!important;display:flex!important;font-size:14px!important;line-height:30px!important;font-weight:400!important;align-items:center!important;justify-content:space-between!important;border-bottom:1px solid #f5f5f5!important}.monkey-web-fullscreen .__menu:last-of-type{margin-bottom:0!important;padding-bottom:0!important;border-bottom:none!important}.monkey-web-fullscreen .__menu input[type=text],.monkey-web-fullscreen .__menu input[type=number]{color:#333;border-radius:3px;border:1px solid #cbd5e1!important;text-align:center!important;line-height:12px!important;font-size:12px!important;padding:0 3px!important;height:23px!important;width:75px!important}.monkey-web-fullscreen .__menu input[type=text]:focus,.monkey-web-fullscreen .__menu input[type=number]:focus{outline:none!important;border-color:#3b82f6!important}.monkey-web-fullscreen .__menu input[type=checkbox]{position:absolute!important;opacity:0!important}.monkey-web-fullscreen .__menu .toggle-track{width:38px!important;height:18px!important;cursor:pointer!important;position:relative!important;border-radius:13px!important;background-color:#ccc!important;transition:background-color .3s ease!important}.monkey-web-fullscreen .__menu .toggle-track:after{top:3px!important;left:3px!important;content:""!important;width:12px!important;height:12px!important;position:absolute!important;border-radius:50%!important;background-color:#fff!important;transition:transform .3s ease!important}.monkey-web-fullscreen .__menu input[type=checkbox]:checked+.toggle-track{background-color:#2196f3!important}.monkey-web-fullscreen .__menu input[type=checkbox]:checked+.toggle-track:after{transform:translate(20px)!important}.monkey-web-fullscreen .others-sett{margin-bottom:5px;padding-bottom:5px;border-bottom:1px solid #f5f5f5}.monkey-web-fullscreen .others-sett:last-of-type{margin-bottom:0!important;padding-bottom:0!important;border-bottom:none!important}.monkey-web-fullscreen .others-sett p{margin-bottom:3px;color:#333!important;font-size:13px!important;text-align:left!important}.monkey-web-fullscreen .others-sett textarea{color:#333;border-radius:3px;width:100%!important;resize:none!important;height:75px!important;font-size:12px!important;padding:3px 5px!important;border:1px solid #cbd5e1!important}.monkey-web-fullscreen .others-sett textarea::-webkit-scrollbar{width:4px}.monkey-web-fullscreen .others-sett textarea::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}.monkey-web-fullscreen .others-sett textarea:focus{outline:none!important;border-color:#3b82f6!important}.monkey-web-fullscreen table{width:100%!important;border-collapse:collapse!important}.monkey-web-fullscreen table th{font-weight:600!important}.monkey-web-fullscreen table th,.monkey-web-fullscreen table td{line-height:2!important;font-size:13px!important;vertical-align:middle!important;border:1px solid #e5e6eb!important}.monkey-web-fullscreen table tr:nth-child(odd){background-color:#f8f8f8!important}.notyf{z-index:2147483647!important}.notyf .notyf__message{overflow:hidden;display:-webkit-box;line-clamp:4;-webkit-line-clamp:4;text-overflow:ellipsis;-webkit-box-orient:vertical;color:#fff!important}.login-tip,.login-guide,.live-room-app #sidebar-vm,.lite-room .bili-mini-mask,.live-room-app #prehold-nav-vm,.live-room-app #shop-popover-vm,.risk-captcha-adapt .bili-mini-mask,#bilibili-player .bpx-player-toast-wrap,#bilibili-player .bpx-player-cmd-dm-wrap,#bilibili-player .bpx-player-dialog-wrap>:not(.bpx-player-dm-tip){display:none!important}#buffer,#install,#fd_tips,#a1 #tips,#loading.hide,.player-overlay,.memory-play-wrap,.atom-notice-click,.dplayer-resume-tip,[id*=player] #tips,#player #loading-box,.dplayer-comment-box,.dplayer-notice strong,.air-player-loading-box,.art-layer-autoPlayback,.art-layer-auto-playback,.invoke-app-floating-tips,.invoke-app-san-container{display:none!important}.Clock,.__time-progress,.__rate-keep-show{color:#e0e0e0;text-indent:0!important;text-shadow:0 0 2px #000;position:absolute!important;pointer-events:none!important;font-family:Arial,Helvetica,sans-serif!important;z-index:2147483647!important;opacity:1!important}.Clock{top:10px!important;right:20px!important;width:auto!important;height:auto!important;font-size:17.5px!important;line-height:17.5px!important;font-weight:700!important;text-align:right!important;background-color:transparent!important}.Clock:after{top:50%!important;left:50%!important;content:"-"!important;position:fixed!important;text-shadow:none!important;color:transparent!important;pointer-events:none!important;display:inline-block!important;background-color:transparent!important}.__time-progress{top:27px!important;right:20px!important;font-size:12px!important;line-height:12px!important;transform:scale(.9)!important;transform-origin:top right!important}.__time-progress b{font-size:inherit!important;display:inline-block!important;transform:scale(.75)!important;vertical-align:text-bottom!important}.__rate-keep-show{color:#c9c9c9;top:5px!important;left:5px!important;font-size:12px!important;box-shadow:none!important;line-height:12px!important;display:inline-block!important;transform:scale(.9)!important;transform-origin:top}.video-edge-click{cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAaBJREFUSEutlL8vBEEcxT9fpxSdVtQkGqqrHP8CoqDXSZTC7VpcRa3SCBJEclcgEQmNShDFKVRXKSj8atmv7Gbvsrd2Zydhus2+75v33rwZwXKpx0UAlTIlmxGxAQUY9dCI2GrGCvRn4tCu8CJLTCadmBTrCgcoPfGY2hRHgAmEwyR5FnHWzK8osoDq0hdm7NJoujEJSc24NdDJgCzwkHbAWqGfL+pp7kIBWa1QjyEpc2NqjQlj3QrbWjZxucQty3CHsMU3u+LylreRRDdqJAa8xmdaXB7D/rp00cFngmgPZUccTrM2SCNu4FNKnP42ykwKSdCQbaAqZe7i/3OjCFWvUsTnKsf+GUKVb2ri8mRFHJIvc48wmJct8AHMZdetQn+8w+oxC2xaEAeQdfMFgeFml7VCD188G4hfgRpKVRxq1lc6euECxYHy+LpEOKHAcdyh9SMU5TyGcN5GqyyKw1rSSTux4dlsPTzLXCEUo+93fEbF5dZIbHMw6jEPbIRY5UgcxtPmrOvWUuzQS4E60IUyJQ77/0IcZe0C3eKE6lPXDznkqgSwYj+tAAAAAElFTkSuQmCC),pointer!important;left:0!important;top:6%!important;width:25px!important;height:70%!important;position:absolute!important;z-index:2147483647!important;background-color:transparent!important;user-select:none!important;opacity:0!important}.video-edge-click.right{right:0!important;left:auto!important} ');

(function (notyf, Swal) {
  'use strict';

  const isElement = (node) => node instanceof Element;
  const isDocument = (node) => node instanceof Document;
  const getSRoot = (node) => node?._shadowRoot ?? node?.shadowRoot ?? null;
  function* getShadowRoots(node, deep = false) {
    if (!node || !isElement(node) && !isDocument(node)) return;
    if (isElement(node) && getSRoot(node)) yield getSRoot(node);
    const doc = isDocument(node) ? node : node.getRootNode({ composed: true });
    if (!doc.createTreeWalker) return;
    let currentNode;
    const toWalk = [node];
    while (currentNode = toWalk.pop()) {
      const walker = doc.createTreeWalker(currentNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_DOCUMENT_FRAGMENT, {
        acceptNode: (child) => isElement(child) && getSRoot(child) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      });
      let walkerNode = walker.nextNode();
      while (walkerNode) {
        const shadowRoot = getSRoot(walkerNode);
        if (isElement(walkerNode) && shadowRoot) {
          if (deep) toWalk.push(shadowRoot);
          yield shadowRoot;
        }
        walkerNode = walker.nextNode();
      }
    }
    return;
  }
  function querySelector(selector, subject = document) {
    const immediate = subject.querySelector(selector);
    if (immediate) return immediate;
    const shadowRoots = [...getShadowRoots(subject, true)];
    for (const root of shadowRoots) {
      const match = root.querySelector(selector);
      if (match) return match;
    }
    return null;
  }
  function querySelectorAll(selector, subject = document) {
    const results = [...subject.querySelectorAll(selector)];
    const shadowRoots = [...getShadowRoots(subject, true)];
    for (const root of shadowRoots) {
      results.push(...root.querySelectorAll(selector));
    }
    return results;
  }
  const Consts = Object.freeze({
    EMPTY: "",
    MIN_ZOOM: 25,
    MAX_ZOOM: 400,
    HALF_SEC: 500,
    ONE_SEC: 1e3,
    TWO_SEC: 2e3,
    THREE_SEC: 3e3,
    DEF_SPEED: 1,
    MAX_SPEED: 16,
    MIN_SPEED: 0.1,
    webFull: "webFullscreen",
    FAKE_VIDEO: "fake-video",
    MSG_SOURCE: "SCRIPTS_AUTO_WEB_FULLSCREEN",
    DEF_TSR: { zoom: 100, moveX: 0, moveY: 0, rotation: 0, isMirrored: false }
  });
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const Tools = _unsafeWindow.FyTools = {
    noNumber: (str) => !/\d/.test(str),
    isTopWin: () => window.top === window,
    isNumber: (str) => /^[0-9]$/.test(str),
    scrollTop: (top2) => window.scrollTo({ top: top2 }),
    alert: (...data) => window.alert(data.join(" ")),
    getElementRect: (el) => el?.getBoundingClientRect(),
    isMultiVideo: () => querySelectorAll("video").length > 1,
    microTask: (callback) => Promise.resolve().then(callback),
    query: (selector, context) => querySelector(selector, context),
    querys: (selector, context) => querySelectorAll(selector, context),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    toFixed: (value, digits = 2) => (+value).toFixed(digits).replace(/\.?0+$/, Consts.EMPTY),
    postMessage: (win, data) => win?.postMessage({ source: Consts.MSG_SOURCE, ...data }, "*"),
    getNumbers: (str) => typeof str === "string" ? (str.match(/\d+/g) ?? []).map(Number) : [],
    log: (...data) => console.log(...["%c===== 脚本日志 =====\n\n", "color:green;", ...data, "\n\n"]),
    getIFrames: () => querySelectorAll("iframe:not([src=''], [src='#'], [id='buffer'], [id='install'])"),
    isVisible: (el) => !!(el && getComputedStyle(el).visibility !== "hidden" && (el.offsetWidth || el.offsetHeight)),
    preventDefault: (event) => (event.preventDefault(), event.stopPropagation(), event.stopImmediatePropagation()),
    createElement: (tagName, attrs = {}) => Object.assign(document.createElement(tagName), attrs),
    emitEvent: (type, detail = {}) => document.dispatchEvent(new CustomEvent(type, { detail })),
    isInputable: (el) => ["INPUT", "TEXTAREA"].includes(el?.tagName) || el?.isContentEditable,
    hasCls: (el, ...classes) => classes.flat().some((cls) => el?.classList.contains(cls)),
    delCls: (el, ...classes) => el?.classList.remove(...classes),
    addCls: (el, ...classes) => el?.classList.add(...classes),
    notyf(msg, isError = false) {
      const notyf$1 = new notyf.Notyf({ duration: Consts.THREE_SEC, position: { x: "center", y: "top" } });
      isError ? notyf$1.error(msg) : notyf$1.success(msg);
      return false;
    },
    sendToIFrames(data) {
      this.getIFrames().forEach((iframe) => this.postMessage(iframe?.contentWindow, data));
    },
    freqTimes: /* @__PURE__ */ new Map(),
    _getTimeDiff(key) {
      const now = Date.now();
      const last = this.freqTimes.get(key) ?? 0;
      const diff = now - last;
      return { now, last, diff };
    },
    isFrequent(key = "frequent", gap = 300) {
      const { now, diff } = this._getTimeDiff(key);
      return this.freqTimes.set(key, now) && diff < gap;
    },
    isThrottle(key = "throttle", gap = 300) {
      const { now, diff } = this._getTimeDiff(key);
      return diff >= gap ? this.freqTimes.set(key, now) && false : true;
    },
    limitCountMap: /* @__PURE__ */ new Map(),
    isOverLimit(key = "default", maxCount = 5) {
      const count = this.limitCountMap.get(key) ?? 0;
      if (count < maxCount) return this.limitCountMap.set(key, count + 1) && false;
      return true;
    },
    resetLimit(...keys) {
      const keyList = keys.length > 0 ? keys : ["default"];
      keyList.forEach((key) => this.limitCountMap.set(key, 0));
    },
    getCenterPoint(element) {
      if (!element) return { centerX: 0, centerY: 0 };
      const { top: top2, left, width, height } = this.getElementRect(element);
      return { centerX: left + width / 2, centerY: top2 + height / 2 };
    },
    pointInElement(pointX, pointY, element) {
      if (!element) return false;
      const { top: top2, left, right, bottom } = this.getElementRect(element);
      return pointX >= left && pointX <= right && pointY >= top2 && pointY <= bottom;
    },
    emitMousemove(element) {
      const { centerX, centerY } = this.getCenterPoint(element);
      for (let y = 0; y < centerY; y += 10) this.emitMouseEvent(element, "mousemove", centerX, y);
    },
    emitMouseEvent(element, eventType, clientX, clientY) {
      const dict = { clientX, clientY, bubbles: true };
      element?.dispatchEvent(new MouseEvent(eventType, dict));
    },
    createObserver(target, callback, options = {}) {
      const observer = new MutationObserver(callback);
      const observeTarget = typeof target === "string" ? this.query(target) : target;
      observer.observe(observeTarget, { childList: true, subtree: true, ...options });
      return observer;
    },
    closest(element, selector, maxLevel = 3) {
      for (let level = 0; element && level < maxLevel; level++, element = element.parentElement) {
        if (element.matches(selector)) return element;
      }
      return null;
    },
    findParentWithChild(element, selector, maxLevel = 8) {
      for (let parent = element?.parentElement, level = 0; parent && level < maxLevel; parent = parent.parentElement, level++) {
        if (this.query(selector, parent)) return parent;
      }
      return null;
    },
    findSibling(element, selector, maxLevel = 3) {
      for (let parent = element?.parentElement, level = 0; parent && level < maxLevel; parent = parent.parentElement, level++) {
        for (const child of parent.children) {
          if (child !== element && child.matches(selector)) return child;
        }
      }
      return null;
    },
    getParentChain(element, nth = false) {
      const parents = [];
      for (let current = element; current && current !== document.body; current = current.parentElement) {
        parents.unshift(this.getTagInfo(current, nth));
        if (current.id && this.noNumber(current.id)) break;
      }
      return parents.join(" > ");
    },
    getTagInfo(ele, nth = false) {
      if (ele.id && this.noNumber(ele.id) && !/[\u4e00-\u9fa5]/.test(ele.id)) return `#${ele.id}`;
      let selector = ele.tagName.toLowerCase();
      const classes = Array.from(ele.classList);
      if (classes.length) {
        const validClasses = classes.filter(this.noNumber, this);
        selector += /[:[\]]/.test(ele.className) ? `[class="${ele.className}"]` : validClasses.length ? `.${validClasses.join(".")}` : Consts.EMPTY;
      }
      if (nth && ele.parentElement) {
        const siblings = Array.from(ele.parentElement.children).filter((sib) => sib.tagName === ele.tagName);
        const index = siblings.indexOf(ele);
        if (index > 0) selector += `:nth-of-type(${index + 1})`;
      }
      return selector;
    },
    getParent(element) {
      if (!element) return null;
      const parent = element.parentNode;
      if (parent instanceof ShadowRoot) return parent.host;
      return parent === document ? null : parent;
    },
    getParents(element, withSelf = false, maxLevel = Infinity) {
      const parents = withSelf && element ? [element] : [];
      for (let current = element, level = 0; current && level < maxLevel; level++) {
        current = this.getParent(current);
        current && parents.unshift(current);
      }
      return parents;
    },
    hashCode(str) {
      let hash = 2166136261;
      for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = hash * 16777619 >>> 0;
      }
      return hash;
    },
    findByText(mode, ...texts) {
      const flatTexts = texts.flat();
      const expr = Object.is(mode, "text") ? `.//*[${flatTexts.map((t) => `contains(text(), '${t.replace(/'/g, "\\'")}')`).join(" or ")}]` : `.//*[${flatTexts.map((t) => `@*[contains(., '${t.replace(/'/g, "\\'")}')]`).join(" or ")}]`;
      const nodes = document.evaluate(expr, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      return Array.from({ length: nodes.snapshotLength }, (_, i) => nodes.snapshotItem(i)).filter((el) => !el.matches("script"));
    },
    setPart(node, value) {
      if (!isElement(node)) return;
      const parts = node?.getAttribute("part")?.split(/\s+/) ?? [];
      node?.setAttribute("part", [.../* @__PURE__ */ new Set([...parts, value])].join(" ").trim());
    },
    delPart(node, value) {
      if (!isElement(node)) return;
      const parts = (node?.getAttribute("part")?.split(/\s+/) ?? []).filter((v) => v !== value);
      node?.setAttribute("part", parts.join(" ").trim());
    },
    safeHTML(htmlStr) {
      if (!window.trustedTypes?.createPolicy) return htmlStr;
      const policy = trustedTypes.defaultPolicy ?? trustedTypes.createPolicy("default", { createHTML: (input) => input });
      return policy.createHTML(htmlStr);
    },
    cloneAttrs(source, target, ...attrs) {
      attrs.flat().forEach((attr) => {
        const value = source.getAttribute(attr);
        if (value) target.setAttribute(attr, value);
      });
    },
    cloneStyle(source, target, ...names) {
      const computedStyle = window.getComputedStyle(source);
      names.flat().forEach((name) => {
        const value = computedStyle.getPropertyValue(name);
        if (value) target.style.setProperty(name, value);
      });
    },
    setStyle(eles, prop, val, priority) {
      if (!eles || !prop) return;
      const fn = val ? "setProperty" : "removeProperty";
      [].concat(eles).forEach((el) => el?.style?.[fn]?.(prop, val, priority));
    },
    isAttached(el) {
      if (!el) return false;
      const root = el.getRootNode?.();
      return el.isConnected && (!root || !(root instanceof ShadowRoot) || root.host.isConnected);
    }
  };
  class VideoEnhancer {
    static setPlaybackRate(video, playRate) {
      this.bypassPlaybackRateLimit(video);
      video.playbackRate = video.__playRate = (+playRate).toFixed(2).replace(/\.?0+$/, "");
    }
    static bypassPlaybackRateLimit(video) {
      this.defineProperty(video, "playbackRate", {
        set(value, setter) {
          if (this.playbackRate === value) return;
          if (this instanceof HTMLMediaElement) return this.__playRate === value && setter(value);
          this._playbackRate = value;
          this._quality.setPlaybackRate(value);
          this?.mailToWorker({ cmd: "callWorker_setRate", rate: value });
          Tools.microTask(() => this?.emit("ratechange", this._playbackRate));
        }
      });
    }
    static defineProperty(video, property, descs) {
      try {
        const isMediaElement = video instanceof HTMLMediaElement;
        const videoPrototype = isMediaElement ? HTMLMediaElement.prototype : Object.getPrototypeOf(video);
        const original = Object.getOwnPropertyDescriptor(videoPrototype, property);
        if (!original) throw new Error(`属性 ${property} 不存在`);
        Object.defineProperty(isMediaElement ? video : videoPrototype, property, {
          get() {
            return descs.get ? descs.get.call(this, original.get.call(this)) : original.get.call(this);
          },
          set(value) {
            descs.set ? descs.set.call(this, value, original.set.bind(this)) : original.set.call(this, value);
          },
          configurable: true
        });
      } catch (e) {
        console.error(`修改 ${property} 属性时出错：`, e);
      }
    }
    static hackAttachShadow() {
      if (Element.prototype.__attachShadow) return;
      Element.prototype.__attachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(options) {
        if (this._shadowRoot) return this._shadowRoot;
        const shadowRoot = this._shadowRoot = this.__attachShadow.call(this, options);
        VideoEnhancer.detectShadowVideoElement();
        return shadowRoot;
      };
      Element.prototype.attachShadow.toString = () => Element.prototype.__attachShadow.toString();
    }
    static detectShadowVideoElement() {
      if (Tools.isThrottle("shadow", 100)) return;
      const videos = Tools.querys("video:not([received])");
      if (!videos.length) return;
      videos.forEach((video) => {
        const root = video.getRootNode();
        if (!(root instanceof ShadowRoot)) return;
        Tools.emitEvent("shadow-video", { video });
        Tools.emitEvent("addStyle", { shadowRoot: root });
      });
    }
  }
  VideoEnhancer.hackAttachShadow();
  class BasicStorage {
    static #instances = [];
    constructor(name, defVal, useLocalStore = false, parser = (v) => v, splice = false) {
      Object.assign(this, { name, defVal, useLocalStore, parser, splice });
      this.storage = useLocalStore ? localStorage : { getItem: _GM_getValue, setItem: _GM_setValue, removeItem: _GM_deleteValue };
      BasicStorage.#instances.push(this);
      if (BasicStorage.#instances.length === 1) requestIdleCallback(() => BasicStorage.cleanExpired());
    }
    #getFinalKey(suffix = "", requireKey = false) {
      if (requireKey && [null, void 0].includes(suffix)) throw new Error("键名拼接时，suffix（第二个参数）不能为空");
      if (suffix.startsWith(this.name)) return suffix;
      return this.splice ? this.name + suffix : this.name;
    }
    set(value, key, expires) {
      const val = expires ? JSON.stringify({ value, expires: Date.now() + expires * 864e5 }) : value;
      this.storage.setItem(this.#getFinalKey(key, true), val);
    }
    get(key) {
      const data = this.#get(this.#getFinalKey(key));
      return !data?.value ? data : data.expires > Date.now() ? data.value : this.defVal;
    }
    #get(key) {
      const value = this.storage.getItem(key);
      try {
        return JSON.parse(value) ?? this.defVal;
      } catch {
        return this.parser(value ?? this.defVal);
      }
    }
    del(key) {
      this.storage.removeItem(this.#getFinalKey(key));
    }
    fuzzyGet(pattern) {
      const result = {};
      this.fuzzyHandle(pattern, (key) => result[key] = this.storage.getItem(key));
      return result;
    }
    fuzzyDel(pattern) {
      this.fuzzyHandle(pattern, (key) => this.storage.removeItem(key));
    }
    fuzzyHandle(pattern, callback) {
      const keys = Object.is(this.storage, localStorage) ? Object.keys(localStorage) : _GM_listValues();
      const keyMatcher = pattern instanceof RegExp ? (key) => pattern.test(key) : (key) => key.includes(pattern);
      keys.filter(keyMatcher).forEach(callback);
    }
    static cleanExpired() {
      this.#instances.forEach((instance) => {
        instance.fuzzyHandle(instance.name, (key) => {
          if (instance.#get(key)?.expires < Date.now()) instance.del(key);
        });
      });
    }
  }
  const Storage = _unsafeWindow.FyStorage = {
    ICONS_SELECTOR: new BasicStorage("ICONS_SELECTOR", null),
    CUSTOM_WEB_FULL: new BasicStorage("CUSTOM_WEB_FULL_", "", false, String, true),
    NO_AUTO_DEF: new BasicStorage("DISABLE_DEFAULT_AUTO", false, false, Boolean),
    IS_SITE_AUTO: new BasicStorage("ENABLE_THIS_SITE_AUTO_", false, false, Boolean, true),
    ENABLE_EDGE_CLICK: new BasicStorage("ENABLE_EDGE_CLICK", false, false, Boolean),
    DETACH_THRESHOLD: new BasicStorage("DETACH_THRESHOLD_", 20, false, Number, true),
    DISABLE_TRY_PLAY: new BasicStorage("DISABLE_TRY_PLAY", false, false, Boolean),
    SPEED_STEP: new BasicStorage("PLAY_RATE_STEP", 0.25, false, parseFloat),
    DISABLE_SPEED: new BasicStorage("CLOSE_PLAY_RATE", false, false, Boolean),
    RATE_KEEP_SHOW: new BasicStorage("RATE_KEEP_SHOW", false, false, Boolean),
    NOT_CACHE_SPEED: new BasicStorage("DISABLE_MEMORY_SPEED", false, false, Boolean),
    CACHED_SPEED: new BasicStorage("FENY_SCRIPTS_V_PLAYBACK_RATE", 1, true, parseFloat),
    PRESET_SPEED: new BasicStorage("PRESET_SPEED", "1.15,1.45,1.75", false, (value) => value.split(",")),
    SKIP_INTERVAL: new BasicStorage("VIDEO_SKIP_INTERVAL", 5, false, Number),
    ZERO_KEY_SKIP_INTERVAL: new BasicStorage("ZERO_KEY_SKIP_INTERVAL", 30, false, Number),
    OVERRIDE_KEY: new BasicStorage("OVERRIDE_KEYBOARD", false, false, Boolean),
    DISABLE_ZOOM_MOVE: new BasicStorage("DISABLE_ZOOM_MOVE", true, false, Boolean),
    MOVING_DISTANCE: new BasicStorage("MOVING_DISTANCE", 10, false, Number),
    ZOOM_PERCENT: new BasicStorage("ZOOM_PERCENT", 10, false, Number),
    IS_AUTO_NEXT: new BasicStorage("ENABLE_AUTO_NEXT_EPISODE", false, false, Boolean),
    NEXT_ADVANCE_SEC: new BasicStorage("AUTO_NEXT_ADVANCE_SECONDS", 75, false, Number),
    RELATIVE_EPISODE: new BasicStorage("RELATIVE_EPISODE_SELECTOR_", "", false, String, true),
    CURRENT_EPISODE: new BasicStorage("CURRENT_EPISODE_SELECTOR_", "", false, String, true),
    DISABLE_CLOCK: new BasicStorage("DISABLE_CLOCK", false, false, Boolean),
    PAGE_CLOCK: new BasicStorage("UNFULL_CLOCK", false, false, Boolean),
    CLOCK_COLOR: new BasicStorage("CLOCK_COLOR", "#e0e0e0"),
    NOT_CACHE_TIME: new BasicStorage("DISABLE_MEMORY_TIME", false, false, Boolean),
    STORAGE_DAYS: new BasicStorage("STORAGE_DAYS", 7, false, parseFloat),
    PLAY_TIME: new BasicStorage("PLAY_TIME_", 0, true, void 0, true),
    NEXT_IGNORE_URLS: new BasicStorage("NEXT_IGNORE_URLS", ""),
    FULL_IGNORE_URLS: new BasicStorage("FULL_IGNORE_URLS", ""),
    IS_INVISIBLE_PAUSE: new BasicStorage("DISABLE_INVISIBLE_PAUSE", false, false, Boolean),
    DISABLE_SCREENSHOT: new BasicStorage("DISABLE_SCREENSHOT", true, false, Boolean)
  };
  const Keyboard = Object.freeze({
    A: "KeyA",
    D: "KeyD",
    K: "KeyK",
    L: "KeyL",
    M: "KeyM",
    N: "KeyN",
    P: "KeyP",
    R: "KeyR",
    S: "KeyS",
    Z: "KeyZ",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Sub: "NumpadSubtract",
    Add: "NumpadAdd",
    Space: "Space",
    Enter: "Enter",
    NumEnter: "NumpadEnter"
  });
  const observedValue = { isFullscreen: false, fsWrapper: null };
  const Listen = {
    noVideo: () => !window.videoInfo && !window.topWin,
    isBackgroundVideo: (video) => video?.muted && video?.loop,
    getVideo: () => Tools.querys(":is(video, fake-video):not([loop])").find(Tools.isVisible),
    init(isNonFirst = false) {
      this.host = location.host;
      this.setupVideoDetector();
      this.setupKeydownListener();
      this.setupVisibleListener();
      this.setupMouseMoveListener();
      this.setupFullscreenListener();
      this.setupVideoListeners();
      if (isNonFirst) return;
      this.setupDocumentObserver();
      this.observeFullscreenChange();
      this.observeWebFullscreenChange();
      this.setupIgnoreUrlsChangeListener();
      this.setupShadowVideoListeners();
      this.setupLoadEventListener();
    },
    setupVisibleListener() {
      window.addEventListener("visibilitychange", () => {
        if (this.noVideo() || Storage.IS_INVISIBLE_PAUSE.get()) return;
        const video = this.player ?? this.getVideo();
        if (!video || video.ended || !Tools.isVisible(video)) return;
        document.hidden ? video.pause() : video.play();
      });
    },
    setupDocumentObserver() {
      new MutationObserver(() => {
        if (this.docElement === document.documentElement) return;
        this.init(true), document.head.append(gmStyle.cloneNode(true));
      }).observe(document, { childList: true });
    },
    setupVideoDetector() {
      this.docElement = document.documentElement;
      this.obsDoc?.disconnect(), clearTimeout(this.obsTimer);
      this.obsDoc = Tools.createObserver(document, () => {
        if (Tools.isThrottle("detector", 100)) return;
        if (this.topWin) return this.obsDoc?.disconnect();
        const video = this.getVideo();
        if (video?.offsetWidth) this.setCurrentVideo(video);
      });
      this.obsTimer = setTimeout(() => this.obsDoc?.disconnect(), Consts.ONE_SEC * 5);
    },
    setCurrentVideo(video) {
      if (!video || this.player === video || video.offsetWidth < 260 || this.isBackgroundVideo(video)) return;
      if (this.player && !this.player.paused && !isNaN(this.player.duration)) return;
      this.player = video;
      this.setVideoInfo(video);
      this.observeVideoSrcChange(video);
    },
    setVideoInfo(video) {
      const isLive = Object.is(video.duration, Infinity);
      const selector = Tools.getParentChain(video, true);
      const videoInfo = { ...Tools.getCenterPoint(video), src: video.currentSrc, isLive, selector };
      this.setParentWinVideoInfo(videoInfo);
    },
    setParentWinVideoInfo(videoInfo) {
      window.videoInfo = this.videoInfo = videoInfo;
      if (!Tools.isTopWin()) return Tools.postMessage(window.parent, { videoInfo: { ...videoInfo, iframeSrc: location.href } });
      Tools.microTask(() => (this.setupPickerEpisodeListener(), this.setupScriptMenuCommand()));
      this.getVideoIFrame()?.focus();
      this.sendTopWinInfo();
    },
    sendTopWinInfo() {
      const { host, href: url } = location;
      const { innerWidth: viewWidth, innerHeight: viewHeight } = window;
      const topWin = { url, host, viewWidth, viewHeight, urlHash: Tools.hashCode(url) };
      window.topWin = this.topWin = topWin;
      Tools.sendToIFrames({ topWin });
    },
    observeVideoSrcChange(video) {
      if (video.hasAttribute("observed")) return;
      video.setAttribute("observed", true);
      const that = this;
      const isFake = video.matches(Consts.FAKE_VIDEO);
      const handleChange = (v) => (delete that.topWin, that.setVideoInfo(v));
      VideoEnhancer.defineProperty(video, isFake ? "srcConfig" : "src", {
        set(value, setter) {
          isFake ? this._src = value : setter(value);
          if ((isFake || this === that.player) && value) handleChange(this);
        }
      });
    },
    setupFullscreenListener() {
      document.addEventListener("fullscreenchange", () => {
        const isFullscreen = !!document.fullscreenElement;
        Tools.postMessage(window.top, { isFullscreen });
      });
    },
    observeFullscreenChange() {
      Object.defineProperty(this, "isFullscreen", {
        get: () => observedValue.isFullscreen,
        set: (value) => {
          observedValue.isFullscreen = value;
          this.handleFullscreenChange(value);
        }
      });
    },
    handleFullscreenChange(isFullscreen) {
      isFullscreen && Tools.isInputable(document.activeElement) && document.activeElement.blur();
      !isFullscreen && this.fsWrapper && this.dispatchShortcutKey(Keyboard.P);
      this.changeTimeElementDisplay();
    },
    observeWebFullscreenChange() {
      const handle = (event, { code, type } = event) => {
        if (type === "scroll") return Tools.scrollTop(this.fsWrapper.scrollY);
        if (this.isInputFocus(event) || ![Keyboard.Space, Keyboard.Left, Keyboard.Right].includes(code)) return;
        Tools.preventDefault(event), Object.is(type, "keydown") && this.dispatchShortcutKey(code, { bypass: true });
      };
      Object.defineProperty(this, "fsWrapper", {
        get: () => observedValue.fsWrapper,
        set: (value) => {
          observedValue.fsWrapper = value;
          const method = value ? "addEventListener" : "removeEventListener";
          ["scroll", "keyup", "keydown"].forEach((type) => window[method](type, handle, true));
        }
      });
    },
    setupMouseMoveListener() {
      let timer = null;
      const handle = ({ type, clientX, clientY }) => {
        if (Tools.isThrottle(type, 300)) return;
        if (!this.noVideo()) {
          clearTimeout(timer), this.toggleCursor();
          timer = setTimeout(() => this.toggleCursor(true), Consts.TWO_SEC);
        }
        if (!Storage.ENABLE_EDGE_CLICK.get()) return;
        const video = this.getVideoForCoordinate(clientX, clientY);
        video && this.createEdgeClickElement(video);
      };
      document.addEventListener("mousemove", handle, { passive: true });
    },
    toggleCursor(hide = false, cls = "__hc") {
      if (!hide) return Tools.querys(`.${cls}`).forEach((el) => Tools.delCls(el, cls));
      [...Tools.getParents(this.player, true, 3), ...Tools.getIFrames()].forEach((el) => {
        el?.blur(), Tools.addCls(el, cls), el?.dispatchEvent(new MouseEvent("mouseleave"));
      });
    },
    getVideoForCoordinate(clientX, clientY) {
      return Tools.querys("video").find((video) => Tools.pointInElement(clientX, clientY, video));
    },
    createEdgeClickElement(video) {
      if (!Storage.ENABLE_EDGE_CLICK.get()) return;
      const container = this.getEdgeClickContainer(video);
      if (video.lArea?.parentNode === container) return;
      if (container instanceof Element && getComputedStyle(container).position === "static") {
        Tools.setStyle(container, "position", "relative");
      }
      if (video.lArea) return container.prepend(video.lArea, video.rArea);
      const createEdge = (clas = "") => {
        const element = Tools.createElement("div", { video, className: `video-edge-click ${clas}` });
        element.onclick = (e) => {
          Tools.preventDefault(e);
          const vid = e.target.video;
          if (this.player !== vid) this.player = vid, this.setVideoInfo(vid);
          Tools.microTask(() => this.dispatchShortcutKey(Keyboard.P, { isTrusted: true }));
        };
        return element;
      };
      [video.lArea, video.rArea] = [createEdge(), createEdge("right")];
      container.prepend(video.lArea, video.rArea);
    },
    getEdgeClickContainer(video) {
      if (this.fsWrapper) return video.closest(`[part="${Consts.webFull}"]`) ?? this.fsWrapper;
      const parentNode = video.parentNode;
      const sroot = video.getRootNode() instanceof ShadowRoot;
      return sroot ? parentNode : this.findVideoParentContainer(parentNode, 4, false);
    },
    removeEdgeClickElements() {
      Tools.querys(".video-edge-click").forEach((el) => (el.remove(), delete el.video.lArea, delete el.video.rArea));
    }
  };
  class Site {
    static icons = { full: "full", webFull: "webFull", next: "next", danmaku: "danmaku" };
    static selectors = {
      "live.acfun.cn": { webFull: ".fullscreen-web", danmaku: ".danmaku-enabled" },
      "v.douyu.com": { webFull: ".ControllerBar-PageFull-Icon", danmaku: ".BarrageSwitch-icon" },
      "v.youku.com": { webFull: "#webfullscreen-icon", danmaku: "#barrage-switch", next: ".kui-next-icon-0" },
      "www.acfun.cn": { webFull: ".fullscreen-web", danmaku: ".danmaku-enabled", next: ".btn-next-part div" },
      "www.mgtv.com": { webFull: ".webfullscreenBtn i", danmaku: "div[class*='danmuSwitch']", next: ".icon-next" },
      "www.iqiyi.com": { webFull: "[class*=videofullBtn]", danmaku: "[class*=danmuBtnSet] div", next: "[class*=playNext]" },
      "www.bilibili.com": { full: ".bpx-player-ctrl-full", webFull: ".bpx-player-ctrl-web", next: ".bpx-player-ctrl-next" },
      "v.qq.com": { full: ".txp_btn_fullscreen", webFull: ".txp_btn_fake", danmaku: ".barrage-switch", next: ".txp_btn_next_u" }
    };
    static _siteRegExps = {
      acFun: /acfun.cn\/v/,
      tencent: /v.qq.com\/x/,
      qiyi: /iqiyi.com\/v_*/,
      mgtv: /www.mgtv.com\/b/,
      douyu: /v.douyu.com\/show/,
      bili: /bilibili.com\/video/,
      biliLive: /live.bilibili.com\/*/
    };
    static {
      const selectors = Storage.ICONS_SELECTOR.get();
      selectors ? this.selectors = selectors : this.#loadRemote();
      Tools.microTask(() => (this.#createSiteTests(), this.#convertGmMatchToRegex()));
    }
    static getIcons(domain = location.host) {
      if (!Storage.ICONS_SELECTOR.get()) this.#loadRemote();
      return this.selectors[domain];
    }
    static isGmMatch() {
      return this.gmMatches.some((m) => m.test(location.href.replace(location.search, Consts.EMPTY)));
    }
    static #loadRemote() {
      const url = "https://gitee.com/xfeny/UserScript/raw/dev/monkey-web-fullscreen/src/IconsSelector.json";
      _GM.xmlHttpRequest({ url, timeout: 3e3 }).then((res) => {
        const remoteConf = JSON.parse(res.responseText ?? "{}");
        this.selectors = { ...this.selectors, ...remoteConf };
        Storage.ICONS_SELECTOR.set(this.selectors, Consts.EMPTY, 1 / 3);
      }).catch((e) => console.error("加载远程配置失败", e));
    }
    static #convertGmMatchToRegex() {
      const { matches, includes: excluded } = _GM_info.script;
      const isValid = (s) => s !== "*://*/*" && !excluded.includes(s);
      this.gmMatches = matches.filter(isValid).map((s) => new RegExp(s.replace(/\*/g, "\\S+")));
    }
    static #createSiteTests() {
      Object.entries(this._siteRegExps).forEach(([name, regex]) => {
        const methodName = `is${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        if (!this[methodName]) this[methodName] = () => regex.test(location.href);
      });
    }
  }
  const Keydown = {
    isInputFocus: (event) => Tools.isInputable(event.composedPath()[0]),
    preventDefault(event, { code, altKey } = event) {
      const isNumKeys = Tools.isNumber(event.key) && !this.isDisRate();
      const isOverrideKeys = this.isOverrideKey() && [Keyboard.Space, Keyboard.Left, Keyboard.Right].includes(code);
      const isPreventKeys = [Keyboard.K, Keyboard.L, Keyboard.M, Keyboard.N, Keyboard.P, Keyboard.R].includes(code);
      const isZoomKeys = altKey && !this.isDisZoom() && [Keyboard.Up, Keyboard.Down, Keyboard.Left, Keyboard.Right].includes(code);
      if (isNumKeys || isOverrideKeys || isPreventKeys || isZoomKeys) Tools.preventDefault(event);
    },
    dispatchShortcutKey(code, { bypass = false, isTrusted = false } = {}) {
      const key = this.processShortcutKey({ code });
      Tools.postMessage(window.top, { key, bypass, isTrusted });
    },
    processShortcutKey({ key, code, ctrlKey, shiftKey, altKey }) {
      code = code.replace(/key|arrow|numpad|tract/gi, Consts.EMPTY);
      const keys = [ctrlKey && "ctrl", shiftKey && "shift", altKey && "alt", /[0-9]/.test(key) ? key : code];
      return keys.filter(Boolean).join("_").toUpperCase();
    },
    setupKeydownListener() {
      try {
        window.addEventListener("keyup", (event) => this.preventDefault(event), true);
        window.addEventListener("keydown", (event) => this.handleKeydown(event), true);
        window.addEventListener("message", ({ data }) => this.handleMessage(data));
      } catch {
        _unsafeWindow.addEventListener("keyup", (event) => this.preventDefault(event), true);
        _unsafeWindow.addEventListener("keydown", (event) => this.handleKeydown(event), true);
        _unsafeWindow.addEventListener("message", ({ data }) => this.handleMessage(data));
      }
    },
    handleKeydown(event, { key, code, isTrusted } = event) {
      if (this.noVideo() || this.isInputFocus(event)) return;
      if (!Object.values(Keyboard).includes(code) && !Tools.isNumber(key)) return;
      this.preventDefault(event);
      key = this.processShortcutKey(event);
      const specialKeys = [Keyboard.N, Keyboard.P, Keyboard.Enter, Keyboard.NumEnter];
      if (specialKeys.includes(code)) return Tools.postMessage(window.top, { key, isTrusted });
      this.processEvent({ key, isTrusted });
    },
    processEvent(data) {
      if (!this.player) Tools.sendToIFrames(data);
      if (data?.key) this.execHotKeyActions(data);
    },
    execHotKeyActions({ key, isTrusted, bypass }) {
      const dict = {
        M: () => this.toggleMute(),
        R: () => this.rotateVideo(),
        L: () => this.freezeVideoFrame(),
        K: () => this.freezeVideoFrame(true),
        D: () => Site.isGmMatch() && this.triggerIconElement(Site.icons.danmaku),
        N: () => Site.isGmMatch() ? this.triggerIconElement(Site.icons.next) : this.switchEpisode(),
        ENTER: () => Site.isGmMatch() ? this.triggerIconElement(Site.icons.full) : this.toggleFullscreen(),
        P: () => Site.isGmMatch() ? this.triggerIconElement(Site.icons.webFull) : this.toggleWebFullscreen(isTrusted),
        LEFT: () => (bypass || this.isOverrideKey()) && this.skipPlayback(-Storage.SKIP_INTERVAL.get()),
        RIGHT: () => (bypass || this.isOverrideKey()) && this.skipPlayback(Storage.SKIP_INTERVAL.get()),
        SPACE: () => (bypass || this.isOverrideKey()) && this.playToggle(this.player),
        0: () => this.skipPlayback(Storage.ZERO_KEY_SKIP_INTERVAL.get()) ?? true,
        SHIFT_A: () => this.toggleAutoNextEnabled(),
        CTRL_ALT_A: () => this.captureScreenshot(),
        CTRL_Z: () => this.resetVideoTransform(),
        SHIFT_R: () => this.toggleMirrorFlip(),
        ALT_SUB: () => this.zoomVideo(true),
        ALT_ADD: () => this.zoomVideo()
      };
      const step = Storage.SPEED_STEP.get();
      ["A", "S", "ADD", "SUB"].forEach((k, i) => dict[k] = () => this.adjustPlaybackRate((i % 2 ? -1 : 1) * step));
      ["ALT_UP", "ALT_DOWN", "ALT_LEFT", "ALT_RIGHT"].forEach((k) => dict[k] = () => this.moveVideoPosition(k));
      for (let i = 1; i < 6; i++) dict[`CTRL_${i}`] = () => this.setPlaybackRate(Storage.PRESET_SPEED.get()[i - 1]);
      dict[key]?.() ?? (Tools.isNumber(key) && this.setPlaybackRate(key));
    },
    handleMessage(data) {
      if (!data?.source?.includes(Consts.MSG_SOURCE)) return;
      if (data?.videoInfo) return this.setParentWinVideoInfo(data.videoInfo);
      if ("isFullscreen" in data) this.isFullscreen = data.isFullscreen;
      if (data?.topWin) window.topWin = this.topWin = data.topWin;
      this.handleSettMessage(data);
      this.processEvent(data);
    },
    handleSettMessage(data) {
      if ("sw_rateKeep" in data) this.playbackRateKeepDisplay();
      if ("sw_clockAlw" in data) setTimeout(() => this.changeTimeElementDisplay(), 30);
      if ("sw_color" in data) this.setTimeElementColor(data.sw_color);
      if ("sw_edgeClk" in data) this.removeEdgeClickElements();
      if (data?.sw_memory) this.delCachedRate();
      if (data?.sw_zoom) this.resetVideoTransform();
      if (data?.sw_speed) this.setPlaybackRate(Consts.DEF_SPEED);
    }
  };
  const Events = {
    videoEvents: ["loadedmetadata", "loadeddata", "timeupdate", "canplay", "playing", "pause", "ended"],
    setupVideoListeners(video) {
      const handleEvent = (event) => {
        const target = video ?? event.target;
        if (video || target.matches("video, fake-video")) this[event.type](target);
      };
      this.videoEvents.forEach((type) => (video ?? document).addEventListener(type, handleEvent, true));
    },
    setupShadowVideoListeners() {
      document.addEventListener("shadow-video", (e) => {
        const { video } = e.detail;
        if (!video || video.hasAttribute("received")) return;
        this.setupVideoListeners(video), video.setAttribute("received", true);
        Tools.microTask(() => this.createEdgeClickElement(video));
        if (!this.player) this.setCurrentVideo(video);
      });
    },
    loadedmetadata(video) {
      if (video.matches("fake-video")) this.loadeddata(video);
      if (!this.player) this.setCurrentVideo(video);
      this.autoWebFullscreen(video);
      this.hideLoadingElement();
    },
    loadeddata(video) {
      this.initVideoProps(video);
    },
    timeupdate(video) {
      if (isNaN(video.duration)) return;
      if (!this.player) this.playing(video);
      this.resumeRateKeepDisplay();
      this.removeRelevantElements(video);
      this.autoWebFullscreen(video);
      this.autoNextEpisode(video);
      this.cachePlayTime(video);
      this.videoProgress(video);
    },
    canplay(video) {
      if (!Tools.isVisible(video) || Storage.DISABLE_TRY_PLAY.get()) return;
      if (video._mfs_tryPlay || Tools.isMultiVideo()) return;
      video._mfs_tryPlay = true;
      this.tryPlay(video);
    },
    playing(video) {
      this.setCurrentVideo(video);
      Tools.sleep(30).then(() => this.initVideoPlay(video));
    },
    pause() {
      Tools.query(".ec-no")?.click();
    },
    ended(video) {
      this.autoExitWebFullscreen();
      this.clearCachedTime(video);
    }
  };
  const Control = {
    isLive() {
      if (!this.videoInfo || !this.player) return false;
      return this.videoInfo.isLive || this.player?.duration === Infinity || this.isDynamicDur(this.player);
    },
    isDynamicDur(video) {
      if (video._mfs_isDynamic || video.currentTime > video.__duration) return true;
      const { duration, __duration } = video;
      if (!__duration) video.__duration = duration;
      if (__duration > 120 && __duration < 43200) return false;
      const isDynamic = Math.floor(duration) > Math.floor(__duration);
      if (isDynamic) video._mfs_isDynamic = true;
      return isDynamic;
    },
    initVideoProps(video) {
      if (!Tools.isAttached(this.player)) delete this.player;
      Object.keys(video).forEach((k) => k.startsWith("_mfs_") && delete video[k]);
      video.__duration = video.duration;
      video.tsr = { ...Consts.DEF_TSR };
      Tools.resetLimit("rateKeep", "autoWide");
      this.removeRateKeepDisplay();
      this.removeProgressElement();
    },
    initVideoPlay(video) {
      if (video._mfs_hasInited) return;
      video._mfs_hasInited = true;
      this.applyCachedRate();
      this.applyCachedTime(video);
      this.playbackRateKeepDisplay();
      this.setupPlayerClock();
      this.setBiliQuality();
    },
    remainTime: (video) => Math.floor(video.duration) - Math.floor(video.currentTime),
    playToggle: (video) => Site.isDouyu() ? video?.click() : video?.[video?.paused ? "play" : "pause"](),
    tryPlay: (video) => video?.paused && (Site.isDouyu() ? video?.click() : video?.play()),
    setPlaybackRate(playRate) {
      if (!playRate || !this.player || this.isLive() || this.isDisRate() || +this.player.playbackRate === +playRate) return;
      VideoEnhancer.setPlaybackRate(this.player, playRate);
      this.customToast("正在以", `${this.player.playbackRate}x`, "倍速播放");
      this.playbackRateKeepDisplay();
      if (!Storage.NOT_CACHE_SPEED.get()) Storage.CACHED_SPEED.set(this.player.playbackRate);
    },
    adjustPlaybackRate(step = Storage.SPEED_STEP.get()) {
      const playRate = Math.max(Consts.MIN_SPEED, +this.player.playbackRate + step);
      this.setPlaybackRate(Math.min(Consts.MAX_SPEED, playRate));
    },
    applyCachedRate: () => Storage.NOT_CACHE_SPEED.get() ? App.delCachedRate() : App.setPlaybackRate(Storage.CACHED_SPEED.get()),
    delCachedRate: () => Storage.CACHED_SPEED.del(),
    skipPlayback(second = Storage.SKIP_INTERVAL.get()) {
      if (!this.player || this.isLive() || this.player.ended) return;
      this.setCurrentTime(Math.min(+this.player.currentTime + second, this.player.duration));
    },
    cachePlayTime(video) {
      if (video !== this.player || !this.topWin || video.duration < 120 || this.isLive()) return;
      if (Tools.isThrottle("cacheTime", Consts.ONE_SEC) || +video.currentTime < Storage.SKIP_INTERVAL.get()) return;
      if (Storage.NOT_CACHE_TIME.get() || this.remainTime(video) <= 10) return this.clearCachedTime(video);
      Storage.PLAY_TIME.set(+video.currentTime - 1, this.getCacheTimeKey(video), Storage.STORAGE_DAYS.get());
      this.clearMultiVideoCacheTime();
    },
    applyCachedTime(video) {
      if (Storage.NOT_CACHE_TIME.get()) return this.clearCachedTime(video);
      if (video._mfs_hasApplyCTime || !this.topWin || this.isLive()) return;
      const time = Storage.PLAY_TIME.get(this.getCacheTimeKey(video));
      if (time <= +video.currentTime) return video._mfs_hasApplyCTime = true;
      this.setCurrentTime(time);
      video._mfs_hasApplyCTime = true;
      this.customToast("上次观看至", this.formatTime(time), "处，已为您续播", Consts.ONE_SEC * 3.5, false).then((el) => {
        if (video.playbackRate === Consts.DEF_SPEED) return;
        Tools.setStyle(el, "transform", `translateY(${-5 - el.offsetHeight}px)`);
      });
    },
    setCurrentTime: (currentTime) => currentTime && (App.player.currentTime = Math.max(0, currentTime)),
    clearCachedTime: (video) => App.topWin && Storage.PLAY_TIME.del(App.getCacheTimeKey(video)),
    getCacheTimeKey(video, { duration, __duration } = video) {
      if (video._mfs_cacheTKey) return video._mfs_cacheTKey;
      const currNumber = this.getCurrentEpisodeNumber();
      const baseKey = `${this.topWin.urlHash}_${Math.floor(__duration || duration)}`;
      const cacheTimeKey = currNumber ? `${baseKey}_${currNumber}` : baseKey;
      video._mfs_cacheTKey = cacheTimeKey;
      return cacheTimeKey;
    },
    async clearMultiVideoCacheTime() {
      if (!Tools.isMultiVideo()) return;
      const pattern = `${Storage.PLAY_TIME.name}${this.topWin.urlHash}`;
      const keys = Object.keys(Storage.PLAY_TIME.fuzzyGet(pattern));
      if (keys.length > 1) Storage.PLAY_TIME.fuzzyDel(pattern);
    },
    formatTime(seconds) {
      if (isNaN(seconds)) return "00:00";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = Math.floor(seconds % 60);
      return [...h ? [h] : [], m, s].map((unit) => String(unit).padStart(2, "0")).join(":");
    },
    toggleMirrorFlip() {
      if (!this.player) return;
      const tsr = this.player.tsr;
      tsr.isMirrored = !tsr.isMirrored;
      this.setTsr("--mirror", tsr.isMirrored ? -1 : 1);
    },
    rotateVideo() {
      if (!this.player) return;
      const tsr = this.player.tsr;
      tsr.rotation = (tsr.rotation + 90) % 360;
      const { videoWidth, videoHeight } = this.player;
      const isVertical = [90, 270].includes(tsr.rotation);
      const scale = isVertical ? videoHeight / videoWidth : 1;
      this.setTsr("--scale", scale).setTsr("--rotate", `${tsr.rotation}deg`);
    },
    zoomVideo(isDown) {
      if (!this.player || this.isDisZoom()) return;
      const tsr = this.player.tsr;
      const step = Storage.ZOOM_PERCENT.get();
      const zoom = tsr.zoom + (isDown ? -step : step);
      if (zoom < Consts.MIN_ZOOM || zoom > Consts.MAX_ZOOM) return;
      tsr.zoom = zoom;
      this.setTsr("--zoom", zoom / 100);
      this.showToast(`缩放：${zoom}%`, Consts.ONE_SEC);
    },
    moveVideoPosition(direction) {
      if (!this.player || this.isDisZoom()) return;
      const tsr = this.player.tsr;
      const step = Storage.MOVING_DISTANCE.get();
      const dirs = {
        ALT_UP: { x: 0, y: -step, desc: "向上移动" },
        ALT_DOWN: { x: 0, y: step, desc: "向下移动" },
        ALT_LEFT: { y: 0, x: -step, desc: "向左移动" },
        ALT_RIGHT: { y: 0, x: step, desc: "向右移动" }
      };
      let { x, y, x: _x, desc } = dirs[direction];
      if (tsr.isMirrored) x = -x, _x = x;
      ({ 90: () => (x = y, y = -_x), 180: () => (x = -x, y = -y), 270: () => (x = -y, y = _x) })[tsr.rotation]?.();
      tsr.moveX += x, tsr.moveY += y;
      this.setTsr("--moveX", `${tsr.moveX}px`).setTsr("--moveY", `${tsr.moveY}px`);
      this.showToast(`${desc}：${x ? tsr.moveX : tsr.moveY}px`, Consts.ONE_SEC);
    },
    resetVideoTransform() {
      if (!this.player || this.isDisZoom()) return;
      this.setTsr("--zoom").setTsr("--moveX").setTsr("--moveY").setTsr("--scale").setTsr("--mirror").setTsr("--rotate");
      this.player.tsr = { ...Consts.DEF_TSR };
    },
    setTsr(name, value) {
      Tools.addCls(this.player, "__tsr");
      try {
        this.player.__trans = this.player.__trans ?? getComputedStyle(this.player)?.getPropertyValue("transform");
        Tools.setStyle(this.player, "--deftsr", this.player.__trans);
      } catch (e) {
        console.error(e);
      }
      Tools.setStyle(this.player, name, value);
      return this;
    },
    toggleMute() {
      if (!this.player) return;
      const isMuted = this.player.muted || !this.player.volume;
      Object.assign(this.player, { muted: !isMuted, volume: +isMuted });
      this.showToast(isMuted ? "🔊 取消静音" : "🔇 已静音", Consts.ONE_SEC);
    },
    async captureScreenshot() {
      if (!this.player || Storage.DISABLE_SCREENSHOT.get()) return;
      const { videoWidth, videoHeight } = this.player;
      this.player.setAttribute("crossorigin", "anonymous");
      const canvas = Tools.createElement("canvas", { width: videoWidth, height: videoHeight });
      const ctx = canvas.getContext("2d");
      try {
        ctx.drawImage(this.player, 0, 0, canvas.width, canvas.height);
        const url = URL.createObjectURL(await new Promise((resolve) => canvas.toBlob(resolve, "image/png")));
        _GM_download({ url, name: `视频截图_${Date.now()}.png`, onload: () => URL.revokeObjectURL(url) });
      } catch (e) {
        Tools.setStyle(canvas, "max-width", "97vw");
        const popup = window.open(Consts.EMPTY, "_blank", "width=1000,height=570,top=130,left=270");
        popup.document.title = "鼠标右键选择「图片另存为」";
        popup.document.body.appendChild(canvas);
        console.error(e);
      }
    },
    freezeVideoFrame(isPrev) {
      if (!this.player) return;
      !this.player.paused && this.player.pause();
      this.player.currentTime += (isPrev ? -1 : 1) / 24;
    },
    toggleAutoNextEnabled() {
      const status = !Storage.IS_AUTO_NEXT.get();
      Storage.IS_AUTO_NEXT.set(status);
      this.showToast(`已${status ? "启" : "禁"}用自动切换下集`);
    },
    customToast(startText, colorText, endText, duration, isRemove) {
      const span = document.createElement("span");
      const child = Tools.createElement("span", { textContent: colorText, className: "cText" });
      span.append(document.createTextNode(startText), child, document.createTextNode(endText));
      return this.showToast(span, duration, isRemove);
    },
    showToast(content, duration = Consts.THREE_SEC, isRemove = true) {
      return new Promise((resolve) => {
        if (isRemove) Tools.query(".monkey-toast")?.remove();
        const el = Tools.createElement("div", { className: "monkey-toast" });
        content instanceof Element ? el.appendChild(content) : el.innerHTML = content;
        (this.findControlBarContainer() ?? this.findVideoParentContainer(null, 2, false)).prepend(el), resolve(el);
        setTimeout(() => (el.style.opacity = 0, setTimeout(() => el.remove(), Consts.HALF_SEC)), duration);
      });
    }
  };
  const WebFull = {
    triggerIconElement(name) {
      if (Tools.isFrequent("icon")) return;
      if (!Site.isBiliLive()) return Tools.query(Site.getIcons()?.[name])?.click();
      const index = Object.values(Site.icons).indexOf(name);
      this.liveAuxHandle(), this.getLiveIcons()?.[index]?.click();
    },
    async liveAuxHandle() {
      _unsafeWindow.top.scrollTo({ top: 70 });
      const el = Tools.query(":is(.lite-room, #player-ctnr)", top.document);
      if (el) _unsafeWindow.top.scrollTo({ top: Tools.getElementRect(el)?.top });
      if (Tools.hasCls(document.body, "hide-asida-area") || !_unsafeWindow.top?.livePlayer) return;
      _unsafeWindow.top.livePlayer.volume(100);
      _unsafeWindow.top.livePlayer.switchQualityAsync("10000");
      localStorage.setItem("FULLSCREEN-GIFT-PANEL-SHOW", 0);
      Tools.addCls(document.body, "hide-asida-area", "hide-aside-area");
    },
    getLiveIcons() {
      Tools.emitMousemove(this.getVideo());
      return Tools.querys("#web-player-controller-wrap-el .right-area .icon");
    },
    toggleFullscreen() {
      if (!Tools.isTopWin() || Tools.isFrequent("toggleFull")) return;
      this.isFullscreen ? document.exitFullscreen() : this.getVideoHostContainer()?.requestFullscreen();
      if (this.isFullscreen || !this.fsWrapper) this.dispatchShortcutKey(Keyboard.P);
    },
    toggleWebFullscreen(isTrusted) {
      if (this.noVideo() || Tools.isFrequent("toggleWeb")) return;
      if (this.isFullscreen && isTrusted) return document.fullscreenElement && document.exitFullscreen();
      this.fsWrapper ? this.exitWebFullscreen() : this.enterWebFullscreen();
    },
    enterWebFullscreen() {
      const container = this.fsWrapper = this.getVideoHostContainer();
      if (!container || container.matches(":is(html, body)")) return this.ensureWebFullscreen();
      container.scrollY = window.scrollY;
      const parents = Tools.getParents(container, true);
      container instanceof HTMLIFrameElement || parents.length < Storage.DETACH_THRESHOLD.get(this.host) ? parents.forEach((el) => {
        Tools.emitEvent("addStyle", { shadowRoot: el.getRootNode() });
        Tools.setPart(el, Consts.webFull);
      }) : this.detachForFullscreen();
      this.ensureWebFullscreen();
    },
    detachForFullscreen() {
      if (this.fsParent) return;
      this.fsParent = Tools.getParent(this.fsWrapper);
      this.fsPlaceholder = document.createElement("div");
      Tools.cloneAttrs(this.fsWrapper, this.fsPlaceholder, ["id", "class", "style"]);
      Tools.cloneStyle(this.fsWrapper, this.fsPlaceholder, ["position", "width", "height"]);
      this.fsParent.replaceChild(this.fsPlaceholder, this.fsWrapper);
      document.body.insertAdjacentElement("beforeend", this.fsWrapper);
      this.fsWrapper.querySelector("video")?.play();
      Tools.setPart(this.fsWrapper, Consts.webFull);
    },
    exitWebFullscreen() {
      if (!this.fsWrapper) return;
      const { scrollY } = this.fsWrapper;
      Tools.setStyle(this.docElement, "scroll-behavior", "auto", "important");
      if (this.fsParent?.contains(this.fsPlaceholder)) this.fsParent?.replaceChild(this.fsWrapper, this.fsPlaceholder);
      Tools.querys(`[part*=${Consts.webFull}]`).forEach((el) => Tools.delPart(el, Consts.webFull));
      requestAnimationFrame(() => (Tools.scrollTop(scrollY), Tools.setStyle(this.docElement, "scroll-behavior")));
      this.videoParents.clear();
      this.fsPlaceholder = this.fsWrapper = this.fsParent = null;
    },
    getVideoHostContainer() {
      if (this.player) return this.getVideoContainer();
      const videoIFrame = this.getVideoIFrame();
      if (videoIFrame) return videoIFrame;
      const ifrs = Tools.getIFrames();
      const { centerX, centerY } = this.videoInfo ?? {};
      return ifrs.length <= 1 ? ifrs[0] : ifrs.find((el) => Tools.isVisible(el) && Tools.pointInElement(centerX, centerY, el));
    },
    getVideoIFrame() {
      if (!this.videoInfo?.iframeSrc) return null;
      const { pathname, search } = new URL(this.videoInfo.iframeSrc);
      const decoded = decodeURI(search);
      const partial = decoded.slice(0, decoded.length * 0.8);
      return Tools.query(`iframe[src*="${pathname + partial}"]`) ?? Tools.query(`iframe[src*="${pathname}"]`);
    },
    getVideoContainer() {
      const selector = Storage.CUSTOM_WEB_FULL.get(this.topWin?.host)?.trim();
      const container = selector ? this.player.closest(selector) : null;
      if (container) return container;
      const ctrlContainer = this.findControlBarContainer();
      return ctrlContainer ? this.findVideoParentContainer(ctrlContainer) : this.findVideoParentContainer();
    },
    findControlBarContainer() {
      const ignore = ":not(.Drag-Control, .vjs-controls-disabled, .vjs-control-text, .xgplayer-prompt)";
      const ctrl = `[class*="contr" i]${ignore}, [id*="control"], [class*="ctrl"], [class*="progress"]`;
      const ctrlContainer = Tools.findParentWithChild(this.player, ctrl);
      if (!ctrlContainer) return null;
      const { width } = Tools.getElementRect(ctrlContainer);
      const { width: vw } = Tools.getElementRect(this.player);
      const { centerX, centerY } = Tools.getCenterPoint(ctrlContainer);
      const inRect = Tools.pointInElement(centerX, centerY, this.player);
      return Math.floor(width) <= Math.floor(vw) && inRect ? ctrlContainer : null;
    },
    videoParents: /* @__PURE__ */ new Set(),
    findVideoParentContainer(container, maxLevel = 4, track = true) {
      container = container ?? Tools.getParent(this.player);
      if (!container.offsetHeight) container = Tools.getParent(container);
      const { offsetWidth: cw, offsetHeight: ch } = container;
      if (track) this.videoParents.clear();
      for (let parent = container, level = 0; parent && level < maxLevel; parent = Tools.getParent(parent), level++) {
        if (parent.offsetWidth === cw && parent.offsetHeight === ch) container = parent;
        if (this.hasExplicitlySize(parent)) return container;
        if (track) this.videoParents.add(parent);
      }
      return container;
    },
    hasExplicitlySize(element) {
      const style = element.style;
      const sizeRegex = /^\d+(\.\d+)?(px|em|rem)$/;
      return ["width", "height"].some((prop) => {
        const value = style?.getPropertyValue(prop);
        return value && sizeRegex.test(value);
      });
    },
    ensureWebFullscreen() {
      const { viewWidth, viewHeight } = this.topWin;
      const elements = [...this.videoParents].reverse();
      for (const element of elements) {
        const { offsetWidth: width, offsetHeight: height } = this.player;
        if (width === viewWidth && height === viewHeight && element.offsetHeight === viewHeight) continue;
        Tools.setPart(element, Consts.webFull);
      }
    }
  };
  const Automatic = {
    autoNextEpisode(video) {
      if (video.duration < 300 || video._mfs_hasTriedNext || this.remainTime(video) > Storage.NEXT_ADVANCE_SEC.get()) return;
      if (!Storage.IS_AUTO_NEXT.get() || Tools.isThrottle("autoNext", Consts.HALF_SEC)) return;
      if (this.isIgnoreNext()) return video._mfs_hasTriedNext = true;
      this.dispatchShortcutKey(Keyboard.N);
      video._mfs_hasTriedNext = true;
    },
    async autoWebFullscreen(video) {
      if (!this.topWin || !video.offsetWidth || this.player !== video) return;
      if (video._mfs_isWide || Tools.isThrottle("autoWide", Consts.ONE_SEC)) return;
      if (Site.isGmMatch() ? this.noAutoDefault() : !this.isAutoSite()) return;
      if (this.isIgnoreWide() || await this.isWebFull(video) || Tools.isOverLimit("autoWide")) return video._mfs_isWide = true;
      this.dispatchShortcutKey(Keyboard.P);
    },
    async isWebFull(video) {
      const isWebFull = video.offsetWidth >= this.topWin.viewWidth;
      if (!isWebFull) return false;
      await Tools.sleep(Consts.HALF_SEC);
      return video?.offsetWidth >= this.topWin?.viewWidth;
    },
    autoExitWebFullscreen() {
      if (!Site.isBili() && !Site.isAcFun()) return;
      const isWide = this.player.offsetWidth === innerWidth;
      if (isWide) this.triggerIconElement(this.isFullscreen ? Site.icons.full : Site.icons.webFull);
      requestAnimationFrame(() => {
        const isLast = Tools.query('.video-pod .switch-btn:not(.on), .video-pod__item:last-of-type[data-scrolled="true"]');
        if (!Tools.query(".video-pod") || isLast) Tools.query(".bpx-player-ending-related-item-cancel")?.click();
      });
    }
  };
  const Episode = {
    switchEpisode(isPrev = false) {
      const targetEpisode = this.getTargetEpisode(this.getCurrentEpisode(), isPrev) ?? this.getTargetEpisodeByText(isPrev) ?? this.getTargetEpisodeByClass(isPrev);
      this.jumpToTargetEpisode(targetEpisode);
    },
    getCurrentEpisode() {
      return Storage.RELATIVE_EPISODE.get(this.host) ? this.getCurrentEpisodeBySelector() : this.getCurrentEpisodeByLink();
    },
    getCurrentEpisodeByLink() {
      const { pathname, search } = location;
      const last = pathname.split("/").pop();
      const links = Tools.querys(`:is(a[href*="${pathname + search}"], a[href*="${last}"], a[href*="${search}"])`);
      return links.length <= 1 ? this.getEpisodeWrapper(links[0]) : this.findCurrentEpisode(links, pathname + search);
    },
    findCurrentEpisode(eles, pageUrl) {
      const filter = [
        "h1, header, footer",
        "[class*='rank'], [class*='hotlist'], [class*='vodlist']",
        "[id*='guankan'], [id*='history'], [class*='history'], [class*='record'], [class*='lishi']"
      ];
      eles = eles.filter((el) => {
        const { pathname, search } = new URL(el.href);
        return !Tools.closest(el, `:is(${filter})`, 5) && pageUrl.includes(pathname + search);
      }).map(this.getEpisodeWrapper).filter((el) => this.getAllEpisodes(el).map(this.getEpisodeNumber).filter(Boolean).length > 1);
      return eles.length <= 1 ? eles[0] : eles.find((el) => Tools.hasCls(el, "cur", "active") || !!this.getEpisodeNumber(el));
    },
    getEpisodeNumber: (ele) => Tools.getNumbers(ele?.innerText?.replace(/-|\./g, Consts.EMPTY))?.shift(),
    getTargetEpisode(element, isPrev = false) {
      if (!element) return;
      const episodes = this.getAllEpisodes(element);
      const numbers = episodes.map(this.getEpisodeNumber).filter(Boolean);
      if (numbers.length < 2) return;
      const index = episodes.indexOf(element);
      const currNumber = this.getEpisodeNumber(element);
      const { leftSmall, rightLarge } = this.compareLeftRight(numbers, currNumber, index);
      return (leftSmall || rightLarge) === isPrev ? episodes[index - 1] : episodes[index + 1];
    },
    getAllEpisodes(element) {
      if (!element) return [];
      const numSet = /* @__PURE__ */ new Set();
      const eleName = element.tagName;
      const eleClass = Array.from(element.classList);
      const sibling = Tools.findSibling(element, eleName);
      const children = Array.from(sibling?.parentElement?.children ?? []);
      return children.filter((ele) => {
        const currClass = Array.from(ele.classList).filter((cls) => !["on", "cur", "active"].includes(cls));
        const hasSameClass = eleClass.some((value) => currClass.includes(value));
        const isMatch = currClass.length ? hasSameClass : ele.tagName === eleName;
        if (!isMatch || numSet.has(ele.innerText)) return false;
        return numSet.add(ele.innerText);
      });
    },
    jumpToTargetEpisode(element) {
      const stack = [element].filter(Boolean);
      while (stack.length > 0) {
        const current = stack.pop();
        if (current.matches("a, button")) return current?.click();
        stack.push(...Array.from(current.children).reverse());
        current?.click && current.click();
      }
    },
    getEpisodeWrapper(element) {
      while (element && element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        if (siblings.length > 1 && siblings.some((sib) => sib !== element && sib.tagName === element.tagName)) return element;
        element = element.parentElement;
      }
      return null;
    },
    getTargetEpisodeByText(isPrev = false) {
      const ignore = (el) => !el?.innerText?.includes("自动");
      const texts = isPrev ? ["上集", "上一集", "上话", "上一话", "上一个"] : ["下集", "下一集", "下话", "下一话", "下一个"];
      return Tools.findByText("attr", texts).filter(ignore).shift() ?? Tools.findByText("text", texts).filter(ignore).shift();
    },
    getTargetEpisodeByClass(isPrev = false) {
      if (isPrev) return null;
      return Tools.query("[class*='control'] [class*='next' i]");
    },
    compareLeftRight: (numbers, compareNumber = 0, index) => ({
      leftSmall: numbers.some((val, i) => i < index && val < compareNumber),
      rightLarge: numbers.some((val, i) => i > index && val > compareNumber)
    })
  };
  const EpisodePicker = {
    setupPickerEpisodeListener() {
      if (Site.isGmMatch() || this.hasPickerListener) return;
      this.hasPickerListener = true;
      const handle = (event, { target, ctrlKey, altKey, isTrusted } = event) => {
        if (!ctrlKey || !altKey || !isTrusted || this.isLive()) return;
        if (!Tools.isTopWin()) return Tools.notyf("此页面不能抓取 (•ิ_•ิ)?", true);
        Tools.preventDefault(event);
        const hasCurrentSelector = Storage.CURRENT_EPISODE.get(this.host);
        const hasRelativeSelector = Storage.RELATIVE_EPISODE.get(this.host);
        if (hasCurrentSelector && hasRelativeSelector) return Tools.notyf("已拾取过剧集元素 (￣ー￣)", true);
        const number = this.getEpisodeNumber(target);
        if (!number) return Tools.notyf("点击位置无数字 (•ิ_•ิ)?", true);
        hasCurrentSelector ? this.pickerRelativeEpisodeChain(target) : this.pickerCurrentEpisodeChain(target);
      };
      document.addEventListener("click", handle, true);
    },
    pickerCurrentEpisodeChain(element) {
      if (Storage.CURRENT_EPISODE.get(this.host)) return;
      this.pickerEpisodePopup(element, {
        validBtnCallback(value) {
          try {
            const number = this.getEpisodeNumber(Tools.query(value));
            number ? Tools.notyf(`当前集数：${number}`) : Tools.notyf("获取集数失败 〒▽〒", true);
          } catch (e) {
            Tools.notyf("获取集数失败 〒▽〒", true);
            console.error(e);
          }
        },
        confirmCallback(value) {
          Storage.CURRENT_EPISODE.set(value, this.host);
          Tools.notyf("继续拾取元素 ＼(＞０＜)／");
        }
      });
    },
    pickerRelativeEpisodeChain(element) {
      if (Storage.RELATIVE_EPISODE.get(this.host)) return;
      this.pickerEpisodePopup(element, {
        validBtnCallback(value) {
          try {
            const container = this.getEpisodeWrapper(Tools.query(value));
            const numbers = this.getAllEpisodes(container)?.map(this.getEpisodeNumber);
            numbers.length ? Tools.notyf(`所有集数：${numbers.join(" ")}`) : Tools.notyf("获取集数失败 〒▽〒", true);
          } catch (e) {
            Tools.notyf("获取集数失败 〒▽〒", true);
            console.error(e);
          }
        },
        confirmCallback(value) {
          Storage.RELATIVE_EPISODE.set(value, this.host);
          Tools.notyf("操作完成 []~(￣▽￣)~* 干杯");
        }
      });
    },
    getCurrentEpisodeNumber() {
      const selector = Storage.CURRENT_EPISODE.get(this.topWin.host);
      return selector ? this.getEpisodeNumber(Tools.query(selector)) : null;
    },
    getCurrentEpisodeBySelector() {
      const num = this.getCurrentEpisodeNumber();
      const current = this.getEpisodeWrapper(Tools.query(Storage.CURRENT_EPISODE.get(this.host)));
      const episodes = this.getAllEpisodes(this.getEpisodeWrapper(Tools.query(Storage.RELATIVE_EPISODE.get(this.host))));
      return episodes.includes(current) ? current : episodes.find((el) => this.getEpisodeNumber(el) === num);
    },
    pickerEpisodePopup(element, { validBtnCallback, confirmCallback }) {
      Swal.fire({
        html: Tools.safeHTML(`<h4>验证能正确取到集数，再确定保存</h4>
      <textarea id="__picker" class="swal2-textarea" placeholder="请输入元素选择器"></textarea>
      <p>编辑元素选择器，确保能正确获取到集数</p>`),
        customClass: { container: "monkey-web-fullscreen" },
        title: "拾取剧集元素选择器",
        confirmButtonText: "保存",
        denyButtonText: "验证",
        showCloseButton: true,
        showDenyButton: true,
        reverseButtons: true,
        focusDeny: true,
        preDeny: () => {
          const value = Tools.query("#__picker").value.trim();
          return value ? validBtnCallback.call(this, value) ?? false : Tools.notyf("元素选择器不能为空！", true);
        },
        preConfirm: () => Tools.query("#__picker").value.trim() || Tools.notyf("元素选择器不能为空！", true),
        didOpen: () => Tools.query("#__picker").value = Tools.getParentChain(element)
      }).then((result) => result.isConfirmed && confirmCallback.call(this, result.value));
    }
  };
  class Clock {
    options = { color: null, clss: "Clock" };
    constructor(container, options) {
      if (!container) throw new Error("时钟创建失败：container不能为空");
      this.options = Object.assign(this.options, options);
      this.container = container;
      this.initClockElement();
      this.start();
    }
    initClockElement() {
      if (this.element) return;
      const { color, clss } = this.options;
      this.element = document.createElement("div");
      if (color) this.element.style.setProperty("color", color);
      this.element.classList.add(clss);
      this.container.prepend(this.element);
    }
    setContainer(container) {
      if (!container || this.container === container) return this;
      if (this.element && !container.contains(this.element)) container.prepend(this.element);
      this.container = container;
      return this;
    }
    formatTime(date) {
      const pad = (n) => n.toString().padStart(2, "0");
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    update() {
      if (!this.isRunning) return;
      this.element.textContent = this.formatTime(/* @__PURE__ */ new Date());
      if (!this.container.contains(this.element)) this.container.prepend(this.element);
    }
    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.element.style.setProperty("display", "unset");
      this.intervalId = setInterval(() => this.update(), 500);
      this.update();
    }
    stop(hide = false) {
      this.isRunning = false;
      if (this.intervalId) clearInterval(this.intervalId), delete this.intervalId;
      if (hide) this.element?.style.setProperty("display", "none");
    }
    destroy() {
      this.stop();
      this.element?.remove();
      this.container = this.element = null;
    }
  }
  const Extend = {
    setupLoadEventListener() {
      window.addEventListener("load", () => {
        const element = document.querySelector("body > #start, #play-button-overlay");
        if (element) element.click?.();
        this.setFakeBiliUser();
      });
    },
    async removeRelevantElements() {
      if (Tools.isThrottle("choice", Consts.ONE_SEC) || Tools.isOverLimit("choice", 3)) return;
      const element = Tools.query(".ec-no, .conplaying, .choice-true, .close-btn, .closeclick");
      if (element) element.click?.(), element.remove?.();
    },
    setFakeBiliUser() {
      if (!Site.isBili() || _unsafeWindow.UserStatus?.userInfo?.isLogin) return;
      Tools.sleep(Consts.THREE_SEC).then(() => {
        _unsafeWindow.__BiliUser__.cache.data.isLogin = true;
        _unsafeWindow.__BiliUser__.cache.data.mid = Date.now();
      });
    },
    setBiliQuality() {
      if (!Site.isBili() || !document.cookie.includes("DedeUserID") || !_unsafeWindow.player) return;
      const current = _unsafeWindow.player.getQuality().realQ;
      const list = _unsafeWindow.player.getSupportedQualityList();
      const target = list.find((quality) => quality === 80) ?? list[0];
      if (current !== target) _unsafeWindow.player.requestQuality(target);
    },
    shouldHideTime: () => App.isFullscreen && Storage.DISABLE_CLOCK.get() || !App.isFullscreen && !Storage.PAGE_CLOCK.get(),
    async setupPlayerClock() {
      if (!this.player || this.shouldHideTime()) return this.Clock?.stop(true);
      if (this.Clock && !this.shouldHideTime()) return this.Clock.setContainer(this.player.parentNode).start();
      this.Clock = new Clock(this.player.parentNode, { color: Storage.CLOCK_COLOR.get() });
    },
    getRealDuration(video) {
      if (!Site.isQiyi()) return video.duration;
      return _unsafeWindow.webPlay?.wonder?._player?._playProxy?._info?.duration ?? video.duration;
    },
    videoProgress(video, bypass) {
      if (!video || !bypass && video.paused || this.player !== video || this.isBackgroundVideo(video)) return;
      if (video.duration <= 30 || this.isLive() || this.shouldHideTime()) return this.removeProgressElement();
      const duration = this.getRealDuration(video);
      if (duration > 86400) return this.removeProgressElement();
      const percent = Tools.toFixed(video.currentTime / duration * 100, 1);
      const timeLeft = this.formatTime(duration - video.currentTime);
      const element = this.createProgressElement();
      element.firstChild.textContent = `${timeLeft} / ${percent}`;
      this.prependElement(element);
    },
    createProgressElement() {
      if (this.progressNode) return this.progressNode;
      const element = this.createDisplayElement("__time-progress", Storage.CLOCK_COLOR.get());
      element.append(document.createTextNode("00:00"), Tools.createElement("b", { textContent: "%" }));
      this.progressNode = element;
      return element;
    },
    removeProgressElement: () => App.progressNode?.remove(),
    playbackRateKeepDisplay() {
      if (!this.player || this.isLive()) return;
      if (!Storage.RATE_KEEP_SHOW.get()) return this.removeRateKeepDisplay();
      if (!this.rateKeepElement) this.rateKeepElement = this.createDisplayElement("__rate-keep-show");
      this.rateKeepElement.textContent = `倍速: ${this.player.playbackRate}`;
      this.prependElement(this.rateKeepElement);
    },
    resumeRateKeepDisplay() {
      if (Tools.isOverLimit("rateKeep") || document.contains(this.rateKeepElement)) return;
      this.playbackRateKeepDisplay();
    },
    removeRateKeepDisplay: () => App.rateKeepElement?.remove(),
    createDisplayElement(clss, color) {
      const element = Tools.createElement("div", { className: clss, style: `color: ${color}` });
      this.prependElement(element);
      return element;
    },
    prependElement(element) {
      const container = this.player?.parentNode;
      if (element && !container?.contains(element)) container?.prepend(element);
    },
    changeTimeElementDisplay: () => (App.setupPlayerClock(), App.videoProgress(App.player, true)),
    setTimeElementColor: (color) => Tools.setStyle([App.progressNode, App.Clock?.element], "color", color),
    hideLoadingElement: () => Tools.querys("#loading").forEach((el) => !Tools.query("video", el) && Tools.addCls(el, "hide"))
  };
  class URLBlacklist {
    constructor(blacklist) {
      this.blacklist = this.normalizeBlacklist(blacklist);
    }
    normalizeBlacklist(urls) {
      return urls.map((url) => {
        try {
          const parsedUrl = new URL(url);
          return { hostname: parsedUrl.hostname, pathname: this.normalizePath(parsedUrl.pathname) };
        } catch (e) {
          console.error(`无效的URL: ${url}`, e);
          return null;
        }
      }).filter(Boolean);
    }
    normalizePath(path) {
      return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
    }
    isBlocked(url) {
      try {
        const parsedUrl = new URL(url);
        const normalizedPath = this.normalizePath(parsedUrl.pathname);
        if (normalizedPath === "/") return true;
        return this.blacklist.some((entry) => {
          if (parsedUrl.hostname !== entry.hostname) return false;
          if (entry.pathname === "/") return normalizedPath === "/";
          return normalizedPath === entry.pathname || normalizedPath.startsWith(`${entry.pathname}/`);
        });
      } catch (e) {
        console.error(`要检查的URL无效: ${url}`, e);
        return false;
      }
    }
  }
  const Ignore = {
    defNextIgnore: ["https://www.youtube.com/watch", "https://www.bilibili.com/video", "https://www.bilibili.com/list"],
    defFullIgnore: ["https://www.youtube.com/results", "https://www.youtube.com/shorts"],
    setupIgnoreUrlsChangeListener() {
      this.initializeIgnoreUrls();
      [Storage.FULL_IGNORE_URLS.name, Storage.NEXT_IGNORE_URLS.name].forEach(
        (key) => _GM_addValueChangeListener(key, (_, oldVal, newVal) => {
          if (oldVal === newVal) return;
          this.initializeIgnoreUrls();
        })
      );
    },
    initializeIgnoreUrls() {
      const nextUrls = this.processIgnoreUrls(Storage.NEXT_IGNORE_URLS, this.defNextIgnore);
      this.nextUrlFilter = new URLBlacklist(nextUrls);
      const fullUrls = this.processIgnoreUrls(Storage.FULL_IGNORE_URLS, this.defFullIgnore);
      this.fullUrlFilter = new URLBlacklist(fullUrls);
    },
    isIgnoreNext() {
      return this.nextUrlFilter?.isBlocked(this.topWin?.url ?? location.href);
    },
    isIgnoreWide() {
      return this.fullUrlFilter?.isBlocked(this.topWin?.url ?? location.href);
    },
    processIgnoreUrls(cache, defaultUrls) {
      const urlsStr = cache.get() ?? "";
      const existUrls = urlsStr.split(/[;\n]/).filter((e) => e.trim());
      if (existUrls.length) return existUrls;
      cache.set(defaultUrls.join(";\n"));
      return defaultUrls;
    }
  };
  const Menu = {
    isDisRate: () => Storage.DISABLE_SPEED.get(),
    noAutoDefault: () => Storage.NO_AUTO_DEF.get(),
    isOverrideKey: () => Storage.OVERRIDE_KEY.get(),
    isDisZoom: () => Storage.DISABLE_ZOOM_MOVE.get(),
    isAutoSite: () => Storage.IS_SITE_AUTO.get(Tools.isTopWin() ? location.host : window.topWin?.host),
    setupScriptMenuCommand() {
      if (this.hasMenu || !Tools.isTopWin()) return;
      this.setupMenuChangeListener();
      this.registMenuCommand();
      this.hasMenu = true;
    },
    setupMenuChangeListener() {
      [Storage.IS_SITE_AUTO.name + this.host, Storage.CURRENT_EPISODE.name + this.host].forEach(
        (key) => _GM_addValueChangeListener(key, () => this.registMenuCommand())
      );
    },
    registMenuCommand() {
      const noPicker = !Storage.CURRENT_EPISODE.get(this.host);
      const siteTitle = `此站${this.isAutoSite() ? "禁" : "启"}用自动网页全屏`;
      const siteFun = ({ host, cache }) => cache.set(!cache.get(host), host);
      const delPicker = ({ host }) => Storage.CURRENT_EPISODE.del(host) & Storage.RELATIVE_EPISODE.del(host);
      const configs = [
        { title: siteTitle, cache: Storage.IS_SITE_AUTO, useHost: true, isHidden: Site.isGmMatch(), fn: siteFun },
        { title: "此站脱离式全屏阈值", cache: Storage.DETACH_THRESHOLD, useHost: true, isHidden: Site.isGmMatch() },
        { title: "删除此站剧集选择器", cache: Storage.CURRENT_EPISODE, useHost: true, isHidden: noPicker, fn: delPicker },
        { title: "快捷键说明", cache: { name: "SHORTCUTKEY" }, isHidden: false, fn: this.shortcutKeysPopup },
        { title: "更多设置", cache: { name: "SETTING" }, isHidden: false, fn: this.settingPopup }
      ];
      configs.forEach(({ title, useHost, cache, isHidden, fn }) => {
        const id = `${cache.name}_MENU_ID`;
        _GM_unregisterMenuCommand(this[id]);
        if (isHidden) return;
        const host = useHost ? this.host : Consts.EMPTY;
        this[id] = _GM_registerMenuCommand(title, () => {
          if (fn) return fn.call(this, { host, cache, title });
          const input = prompt(title, host ? cache.get(host) : cache.get());
          if (input !== null) host ? cache.set(input, host) : cache.set(input);
        });
      });
    },
    shortcutKeysPopup() {
      const shortcutKeys = [
        { key: "Enter", desc: "全屏" },
        { key: "P", desc: "网页全屏" },
        { key: "N", desc: "切换下集" },
        { key: "R", desc: "旋转 90°" },
        { key: "M", desc: "静音切换" },
        { key: "D", desc: "弹幕切换" },
        { key: "K / L", desc: "上下帧" },
        { key: "Shift R", desc: "水平镜像" },
        { key: "Ctrl Z", desc: "复位缩放移动" },
        { key: "Shift A", desc: "启/禁自动下集" },
        { key: "Ctrl Alt A", desc: "截图 (默禁)" },
        { key: "Alt ➕ / ➖", desc: "缩放 (默禁)" },
        { key: "A / S 或 ➕ / ➖", desc: "倍速 ±0.25" },
        { key: "Alt ◀️🔼🔽▶️", desc: "移动 (默禁)" },
        { key: "Ctrl 1️~5️", desc: "预设倍速" },
        { key: "1️~9️", desc: "1️~9️ 倍速" },
        { key: "数字 0️", desc: "快进 N 秒" },
        { key: "◀️▶️", desc: "快退/进 (默禁)" },
        { key: "空格", desc: "播放/暂停 (默禁)" }
      ];
      const rows = shortcutKeys.reduce((acc, item, i) => {
        if (i % 2 === 0) {
          const next = shortcutKeys[i + 1] || { key: Consts.EMPTY, desc: Consts.EMPTY };
          return acc + `<tr><td>${item.key}</td><td>${item.desc}</td><td>${next.key}</td><td>${next.desc}</td></tr>`;
        }
        return acc;
      }, Consts.EMPTY);
      Swal.fire({
        width: 650,
        title: "快捷键说明",
        showCancelButton: true,
        cancelButtonText: "关闭",
        showConfirmButton: false,
        customClass: { container: "monkey-web-fullscreen" },
        html: Tools.safeHTML(`<table><tr><th>快捷键</th><th>说明</th><th>快捷键</th><th>说明</th></tr>${rows}</table>`)
      });
    },
    settingPopup() {
      const { html: basicsHtml, cacheMap: basicsMap } = this.genBasicsItems();
      const { html: assistHtml, cacheMap: assistMap } = this.genAssistItems();
      const { html: paramsHtml, cacheMap: paramsMap } = this.genParamsItems();
      const { html: ignoreHtml, cacheMap: ignoreMap } = this.genIgnoreItems();
      const cacheMap = { ...basicsMap, ...assistMap, ...paramsMap, ...ignoreMap };
      const modalHtml = `
        <div class="swal2-tabs">
          <!-- Tabs 标题栏 -->
          <div class="swal2-tabs-header">
              <div class="swal2-tab active" data-id="tab1">播放设置</div>
              <div class="swal2-tab" data-id="tab2">辅助设置</div>
              <div class="swal2-tab" data-id="tab3">参数设置</div>
              <div class="swal2-tab" data-id="tab4">其他设置</div>
          </div>
          <!-- Tabs 内容区 -->
          <div class="swal2-tabs-content">
            <div class="swal2-tab-panel active" id="tab1">${basicsHtml}</div>
            <div class="swal2-tab-panel" id="tab2">${assistHtml}</div>
            <div class="swal2-tab-panel" id="tab3">${paramsHtml}</div>
            <div class="swal2-tab-panel" id="tab4">${ignoreHtml}</div>
          </div>
        </div>`;
      Swal.fire({
        width: 410,
        title: "设置",
        showCancelButton: true,
        cancelButtonText: "关闭",
        showConfirmButton: false,
        html: Tools.safeHTML(modalHtml),
        customClass: { container: "monkey-web-fullscreen" },
        didOpen(popup) {
          popup.onclick = ({ target: tab }) => {
            if (!tab.matches(".swal2-tab")) return;
            Tools.querys(".active", popup).forEach((el) => Tools.delCls(el, "active"));
            Tools.query(`#${tab.dataset.id}`, popup).classList.add("active");
            tab.classList.add("active");
          };
          popup.oninput = ({ target: t }) => {
            const cache = cacheMap[t.name];
            const { host, send, delay } = t.dataset;
            const value = Object.is(t.type, "checkbox") ? t.checked : t.value;
            if (send) Tools.postMessage(window, { [`sw_${t.name}`]: value });
            const setCache = () => host ? cache.set(value, host) : cache.set(value);
            delay ? setTimeout(setCache, 50) : setCache();
          };
        }
      });
    },
    genBasicsItems() {
      const configs = [
        { name: "speed", text: "禁用 倍速调节", cache: Storage.DISABLE_SPEED, attrs: ["send", "delay"] },
        { name: "memory", text: "禁用 记忆倍速", cache: Storage.NOT_CACHE_SPEED, attrs: ["send"] },
        { name: "time", text: "禁用 记忆进度", cache: Storage.NOT_CACHE_TIME },
        { name: "tabs", text: "禁用 不可见暂停", cache: Storage.IS_INVISIBLE_PAUSE },
        { name: "try", text: "禁用 尝试自动播放", cache: Storage.DISABLE_TRY_PLAY },
        { name: "next", text: "启用 自动切换下集", cache: Storage.IS_AUTO_NEXT },
        { name: "override", text: "启用 空格◀️▶️ 控制", cache: Storage.OVERRIDE_KEY }
      ];
      const renderItem = ({ text, dataset, name, value }) => `
        <label class="__menu">${text}
          <input ${dataset} ${value ? "checked" : ""} name="${name}" type="checkbox"/>
          <span class="toggle-track"></span>
        </label>`;
      return this.generateCommonItems(configs, renderItem);
    },
    genAssistItems() {
      const configs = [
        { name: "fit", text: "禁用 默认自动", cache: Storage.NO_AUTO_DEF },
        { name: "pic", text: "禁用 视频截图", cache: Storage.DISABLE_SCREENSHOT },
        { name: "zoom", text: "禁用 缩放移动", cache: Storage.DISABLE_ZOOM_MOVE, attrs: ["send"] },
        { name: "clock", text: "禁用 全屏显时间", cache: Storage.DISABLE_CLOCK },
        { name: "clockAlw", text: "启用 非全屏显时间", cache: Storage.PAGE_CLOCK, attrs: ["send"] },
        { name: "rateKeep", text: "启用 左上角常显倍速", cache: Storage.RATE_KEEP_SHOW, attrs: ["send"] },
        { name: "edgeClk", text: "启用 侧边单击网页全屏", cache: Storage.ENABLE_EDGE_CLICK, attrs: ["send"] }
      ].filter(({ isHidden }) => !isHidden);
      const renderItem = ({ text, dataset, name, value }) => `
        <label class="__menu">${text}
          <input ${dataset} ${value ? "checked" : ""} name="${name}" type="checkbox"/>
          <span class="toggle-track"></span>
        </label>`;
      return this.generateCommonItems(configs, renderItem);
    },
    genParamsItems() {
      const configs = [
        { name: "step", text: "倍速步进", cache: Storage.SPEED_STEP },
        { name: "skip", text: "快进/退秒数", cache: Storage.SKIP_INTERVAL },
        { name: "zero", text: "零键快进秒数", cache: Storage.ZERO_KEY_SKIP_INTERVAL },
        { name: "advance", text: "下集提前秒数", cache: Storage.NEXT_ADVANCE_SEC },
        { name: "days", text: "进度保存天数", cache: Storage.STORAGE_DAYS },
        { name: "percent", text: "缩放百分比", cache: Storage.ZOOM_PERCENT },
        { name: "move", text: "移动距离", cache: Storage.MOVING_DISTANCE },
        { name: "color", text: "时间颜色", cache: Storage.CLOCK_COLOR, attrs: ["send"] },
        { name: "preset", text: "常用倍速", cache: Storage.PRESET_SPEED }
      ];
      const renderItem = ({ text, dataset, name, value }) => `
        <label class="__menu">${text}
          <input ${dataset} value="${value}" name="${name}" type="text" autocomplete="off"/>
        </label>`;
      return this.generateCommonItems(configs, renderItem);
    },
    genIgnoreItems() {
      const configs = [
        { name: "custom", text: "自定义此站视频容器", cache: Storage.CUSTOM_WEB_FULL, isHide: Site.isGmMatch(), useHost: true },
        { name: "nextIg", text: "自动切换下集时忽略的网址列表（分号隔开）", cache: Storage.NEXT_IGNORE_URLS },
        { name: "fsIg", text: "自动网页全屏时忽略的网址列表（分号隔开）", cache: Storage.FULL_IGNORE_URLS }
      ];
      const renderItem = ({ text, dataset, name, value }) => `
        <div class="others-sett"><p>${text}</p>
          <textarea ${dataset} name="${name}" type="text" spellcheck="false" autocomplete="off">${value}</textarea>
        </div>`;
      return this.generateCommonItems(configs, renderItem);
    },
    generateCommonItems(baseConfigs, renderItem) {
      const getDataset = (attrs = [], host) => attrs.map((key) => `data-${key}="${key === "host" ? host : true}"`).join(" ");
      const filteredConfigs = baseConfigs.filter(({ isHide }) => !isHide);
      const processedConfigs = filteredConfigs.map((config) => {
        const { cache, attrs = [], useHost } = config;
        const host = useHost ? this.host : Consts.EMPTY;
        const value = useHost ? cache.get(this.host) : cache.get();
        if (useHost && !attrs.includes("host")) attrs.push("host");
        return { ...config, host, value, dataset: getDataset(attrs, this.host) };
      });
      const html = processedConfigs.map((config) => renderItem(config)).join(Consts.EMPTY);
      const cacheMap = Object.fromEntries(processedConfigs.map((item) => [item.name, item.cache]));
      return { html, cacheMap };
    }
  };
  _unsafeWindow.AUTO_WEB_FULLSCREEN = window.App = {};
  const handlers = [Listen, Keydown, Events, Control, WebFull, Automatic, Episode, EpisodePicker, Extend, Ignore, Menu];
  handlers.forEach((handler) => {
    const entries = Object.entries(handler);
    for (const [key, value] of entries) {
      App[key] = value instanceof Function ? value.bind(App) : value;
    }
  });
  App.init();
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("sweetalert2");
  cssLoader("notyf/notyf.min.css");

})(notyf, sweetalert2);