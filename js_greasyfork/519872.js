// ==UserScript==
// @name         视频自动网页全屏｜倍速播放
// @namespace    http://tampermonkey.net/
// @version      3.9.3
// @author       Feny
// @description  支持所有H5视频的增强脚本，通用网页全屏｜倍速调节；B站(含直播) / 腾讯视频 / 优酷 / 爱奇艺 / 芒果TV / AcFun 默认自动网页全屏，其他网站可手动开启；自动网页全屏 + 记忆倍速 + 下集切换，减少鼠标操作，让追剧更省心、更沉浸；支持视频旋转、截图、镜像翻转、缩放与移动、记忆播放进度等功能
// @license      GPL-3.0-only
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAqdJREFUWEftl91LFFEYxp/3jB9ESZjtSl51F1RUSgRCF/kHlF1IhiFhF65dqEQkBUErdJMStBukGwQre2NZUiCRqUiURkW65mIfqGUFsW6Ii0jY7p4Tc3Rqd5zaGVldAudynve8z28e3jMzh5Dmi1R/V0vQyRRWxgWG6x22SrcnOAhQcQIbwVtXba8y1EANSpS1xzJin5c/Dz+jRDPvGWoErwRw35zuh8ChpcXXFjbwi9k/WADA9viGgovGnxtFs6EmcApMvCdBA3oIIirl4N8NNQngmRYJiwTOE7EHHLERAmXFawQ6AdCQkRbjsZIMUvIFoV0HMSsEDjCgSK8tJqAHAEDAMWLKLOexx8tiVVDEhLLVQAtzRPcwKOUANSWCw1/rsBe6PcFz8dpfAdTFgtF+EmIvBG7pID7mZNl2zkVCFQbahzqHfYerddpNhFpdsnfqauzl8ZoEuO4JXdIKOefynnZlimxXhBbqjTZL/el8pzrAVjTGmKh12Bq1ddJs974abQDXfFMuAhQ6EodwDTHWAf6/BAoK8nD0cDEKtuVhyD+OzvvLXnyWJshyApedJ1F65M9n4tlAAF5fL168fGfJWCu2DDA61GpodLvjCdp8vfjyNWQJJGUAquvMzBzafD0yEc65KZCUAmiOo4FPEqS753VSiFUB0FxbPF244en6J8SqAoTD8zhYcjZ9AP6RCVRWNacHYPD5GJqudmBi8tvaAkxNBeUuuNv5NOkAqgUpm4FIJCrfA+r0z4bnTZmvCKCv+wrsts0JBg8fvZLGY28NfoqToFhOoOJ4CS40lMu2I28mpXFP37DpJ9YXWgZQG+Tm5mBL7qakA2aGakUAZhqbrVkH0BLoB34fzcyml5K6pd/yaicRlQlgV0q6mmwitMOpyfpVKfsFya4w73cz9xQAAAAASUVORK5CYII=
// @homepage     https://github.com/xFeny/UserScript/tree/main/monkey-web-fullscreen
// @include      *://x.com/*
// @include      *://www.youtube.com/*
// @match        *://www.mgtv.com/b/*
// @match        *://www.acfun.cn/v/*
// @match        *://www.iqiyi.com/v_*
// @match        *://v.qq.com/x/page/*
// @match        *://v.douyu.com/show/*
// @match        *://v.qq.com/x/cover/*
// @match        *://live.bilibili.com/*
// @match        *://v.youku.com/video?*
// @match        *://v.youku.com/v_show/*
// @match        *://live.acfun.cn/live/*
// @match        *://www.acfun.cn/bangumi/*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/*/play/*
// @match        *://v.qq.com/live/p/newtopic/*
// @match        *://www.bilibili.com/festival/*
// @match        *://v.qq.com/wasm-kernel/*/fake-video*
// @require      https://unpkg.com/notyf@3.10.0/notyf.min.js
// @require      data:application/javascript,%3Bwindow.notyf%3D%7BNotyf%7D%3B
// @require      https://unpkg.com/sweetalert2@11.20.0/dist/sweetalert2.min.js
// @require      data:application/javascript,%3Bwindow.sweetalert2%3DSwal%3B
// @resource     notyf/notyf.min.css  https://unpkg.com/notyf@3.10.0/notyf.min.css
// @resource     sweetalert2          https://unpkg.com/sweetalert2@11.20.0/dist/sweetalert2.min.css
// @connect      gitee.com
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @note         *://*/*
// @downloadURL https://update.greasyfork.org/scripts/519872/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BD%9C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/519872/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%EF%BD%9C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(e=>{const n=Symbol("styleAdded"),t=document.createElement("style");t.textContent=e,window.gmStyle=t,document.addEventListener("addStyle",r=>{const{shadowRoot:o}=r.detail;o[n]||o instanceof Document||(o.prepend(t.cloneNode(!0)),o[n]=!0)}),(GM_addStyle??(()=>document.head.append(t.cloneNode(!0))))(e)})(' @charset "UTF-8";.monkey-toast{line-height:normal;left:10px!important;bottom:16%!important;color:#fff!important;font-size:13px!important;padding:6px 10px!important;border-radius:5px!important;position:absolute!important;z-index:2147483647!important;font-weight:400!important;transition:opacity .3s ease-in!important;background:#000000bf!important}.monkey-toast span{display:inline!important}.monkey-toast .cText{margin:0 3px!important;color:#ff5f00!important}[gm_webfullscreen],body[gm_webfullscreen] [gm_webfullscreen]{top:0!important;left:0!important;margin:0!important;padding:0!important;zoom:normal!important;border:none!important;width:100vw!important;height:100vh!important;position:fixed!important;transform:none!important;max-width:none!important;max-height:none!important;border-radius:0!important;transition:none!important;z-index:2147483646!important;background-color:#000!important;flex-direction:column!important;overflow:hidden!important;display:flex!important}[gm_webfullscreen]~*:not(.monkey-web-fullscreen){display:none!important}[gm_webfullscreen] video,body[gm_webfullscreen] [gm_webfullscreen] video{top:0!important;left:0!important;width:100vw!important;border:none!important;transform:none!important;object-fit:contain!important;height:clamp(100vh - 100%,100vh,100%)!important}[gm_webfullscreen] video.__tsr,body[gm_webfullscreen] [gm_webfullscreen] video.__tsr{transform:scale(var(--scale, 1)) scale(var(--zoom, 1)) scaleX(var(--mirror, 1)) rotate(var(--rotate, 0deg)) translate(var(--mvX, 0),var(--mvY, 0))!important}.__tsr{object-fit:contain!important;transform-origin:center!important;transition:transform .35s!important;transform:var(--deftsr, matrix(1, 0, 0, 1, 0, 0)) scale(var(--scale, 1)) scale(var(--zoom, 1)) scaleX(var(--mirror, 1)) rotate(var(--rotate, 0deg)) translate(var(--mvX, 0),var(--mvY, 0))!important}.__hc{cursor:none!important}.hide{display:none!important}.monkey-web-fullscreen{z-index:2147483647!important}.monkey-web-fullscreen *{box-sizing:border-box!important;font-family:Verdana,Geneva,Tahoma,sans-serif}.monkey-web-fullscreen .swal2-popup{font-size:14px!important}.monkey-web-fullscreen button:where(.swal2-styled):focus{box-shadow:0 0 0 1px #6496c880!important}.monkey-web-fullscreen .swal2-confirm{background-color:#7066e0!important}.monkey-web-fullscreen .swal2-deny{background-color:#dc3741!important}.monkey-web-fullscreen .swal2-cancel{background-color:#757575!important}.monkey-web-fullscreen button:where(.swal2-close){color:#666!important;font-size:1.7em!important;font-weight:bolder!important}.monkey-web-fullscreen h4{color:red!important;margin:0 auto!important;font-size:18px!important;font-weight:400!important}.monkey-web-fullscreen p{color:#999!important;margin-top:0!important;font-size:12px!important}.monkey-web-fullscreen #__picker{width:100%!important;height:auto!important;max-width:25em!important;font-size:14px!important;margin-bottom:0!important;min-height:10em!important;resize:vertical!important}.monkey-web-fullscreen .swal2-tabs-header{display:flex;position:relative;margin-bottom:12px;font-size:15px!important;border-bottom:1px solid #e2e8f0}.monkey-web-fullscreen .swal2-tab{flex:1;padding:8px 0;cursor:pointer;color:#64748b;font-weight:700;text-align:center;position:relative;transition:all .2s ease}.monkey-web-fullscreen .swal2-tab.active{color:#3b82f6}.monkey-web-fullscreen .swal2-tab.active:after{left:0;content:"";width:100%;height:2px;bottom:-1px;position:absolute;visibility:visible;background-color:#3b82f6;border-radius:2px 2px 0 0}.monkey-web-fullscreen .swal2-tab:hover:not(.active){color:#3b82f6}.monkey-web-fullscreen .swal2-tabs-content{width:100%;padding:0 5px;min-height:325px}.monkey-web-fullscreen .swal2-tab-panel{display:none}.monkey-web-fullscreen .swal2-tab-panel.active{display:block}.monkey-web-fullscreen .__menu{margin:0 0 5px!important;padding:0 0 5px!important;float:none!important;height:30px!important;color:#666!important;display:flex!important;font-size:14px!important;line-height:30px!important;font-weight:400!important;align-items:center!important;justify-content:space-between!important;border-bottom:1px solid #f5f5f5!important}.monkey-web-fullscreen .__menu:last-of-type{margin-bottom:0!important;border-bottom:none!important}.monkey-web-fullscreen .__menu input[type=text]{color:#333;border-radius:3px;border:1px solid #cbd5e1!important;text-align:center!important;line-height:12px!important;font-size:12px!important;padding:0 3px!important;height:23px!important;width:75px!important}.monkey-web-fullscreen .__menu input[type=checkbox]{position:absolute!important;opacity:0!important}.monkey-web-fullscreen .__menu .toggle-track{width:38px!important;height:18px!important;cursor:pointer!important;position:relative!important;border-radius:13px!important;background-color:#ccc!important;transition:background-color .3s ease!important}.monkey-web-fullscreen .__menu .toggle-track:after{top:3px!important;left:3px!important;content:""!important;width:12px!important;height:12px!important;position:absolute!important;border-radius:50%!important;background-color:#fff!important;transition:transform .3s ease!important}.monkey-web-fullscreen .__menu input[type=checkbox]:checked+.toggle-track{background-color:#2196f3!important}.monkey-web-fullscreen .__menu input[type=checkbox]:checked+.toggle-track:after{transform:translate(20px)!important}.monkey-web-fullscreen .text-group{margin-bottom:5px;padding-bottom:5px;border-bottom:1px solid #f5f5f5}.monkey-web-fullscreen .text-group:last-of-type{margin-bottom:0!important;padding-bottom:0!important;border-bottom:none!important}.monkey-web-fullscreen .text-group p{margin-bottom:2px;color:#333!important;text-align:left!important}.monkey-web-fullscreen .text-group textarea{color:#333;border-radius:3px;width:100%!important;resize:none!important;height:50px!important;font-size:12px!important;padding:2px 5px!important;line-height:normal!important;border:1px solid #cbd5e1!important}.monkey-web-fullscreen .text-group textarea::-webkit-scrollbar{width:4px}.monkey-web-fullscreen .text-group textarea::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}.monkey-web-fullscreen textarea:focus,.monkey-web-fullscreen input[type=text]:focus{outline:none!important;box-shadow:none!important;border-color:#3b82f6!important}.monkey-web-fullscreen table{width:100%!important;border-collapse:collapse!important}.monkey-web-fullscreen table th,.monkey-web-fullscreen table td{line-height:2!important;font-size:13px!important;vertical-align:middle!important;border:1px solid #efefef!important}.monkey-web-fullscreen table tr:nth-child(odd){background-color:#f8f8f8!important}.notyf{z-index:2147483647!important}.notyf .notyf__message{overflow:hidden;display:-webkit-box;line-clamp:4;-webkit-line-clamp:4;text-overflow:ellipsis;-webkit-box-orient:vertical;color:#fff!important}#bilibili-player :is(.bpx-player-toast-wrap,.bpx-player-cmd-dm-wrap),#bilibili-player .bpx-player-dialog-wrap>:not(.bpx-player-dm-tip){display:none!important}#buffer,#install,.player-overlay,.memory-play-wrap,.atom-notice-click,.dplayer-resume-tip,#player #loading-box,.dplayer-notice strong,.air-player-loading-box,body>#loading:not(:has(video)),*:has(video) :is(#tips,.art-layers){display:none!important}.__Clock,.__timeupdate,.__rateDisplay{color:#e0e0e0;text-indent:0!important;text-shadow:0 0 2px #000;position:absolute!important;pointer-events:none!important;font-family:Arial,Helvetica,sans-serif!important;z-index:2147483647!important;opacity:1!important}.__Clock{top:10px!important;right:20px!important;width:auto!important;height:auto!important;font-size:17.5px!important;line-height:17.5px!important;font-weight:700!important;text-align:right!important;background-color:transparent!important}.__Clock:after{top:50%!important;left:50%!important;content:"-"!important;position:fixed!important;text-shadow:none!important;color:transparent!important;pointer-events:none!important;display:inline-block!important;background-color:transparent!important}.__timeupdate{top:27px!important;right:20px!important;font-size:12px!important;line-height:12px!important;transform:scale(.9)!important;transform-origin:top right!important}.__timeupdate b{font-size:inherit!important;display:inline-block!important;transform:scale(.75)!important;vertical-align:text-bottom!important}.__rateDisplay{color:#c9c9c9;top:5px!important;left:5px!important;font-size:12px!important;box-shadow:none!important;line-height:12px!important;display:inline-block!important;transform:scale(.9)!important;transform-origin:top}.__edgeClick{cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAaBJREFUSEutlL8vBEEcxT9fpxSdVtQkGqqrHP8CoqDXSZTC7VpcRa3SCBJEclcgEQmNShDFKVRXKSj8atmv7Gbvsrd2Zydhus2+75v33rwZwXKpx0UAlTIlmxGxAQUY9dCI2GrGCvRn4tCu8CJLTCadmBTrCgcoPfGY2hRHgAmEwyR5FnHWzK8osoDq0hdm7NJoujEJSc24NdDJgCzwkHbAWqGfL+pp7kIBWa1QjyEpc2NqjQlj3QrbWjZxucQty3CHsMU3u+LylreRRDdqJAa8xmdaXB7D/rp00cFngmgPZUccTrM2SCNu4FNKnP42ykwKSdCQbaAqZe7i/3OjCFWvUsTnKsf+GUKVb2ri8mRFHJIvc48wmJct8AHMZdetQn+8w+oxC2xaEAeQdfMFgeFml7VCD188G4hfgRpKVRxq1lc6euECxYHy+LpEOKHAcdyh9SMU5TyGcN5GqyyKw1rSSTux4dlsPTzLXCEUo+93fEbF5dZIbHMw6jEPbIRY5UgcxtPmrOvWUuzQS4E60IUyJQ77/0IcZe0C3eKE6lPXDznkqgSwYj+tAAAAAElFTkSuQmCC),pointer!important;left:0!important;top:6%!important;width:25px!important;height:70%!important;position:absolute!important;z-index:2147483647!important;background-color:transparent!important;user-select:none!important;opacity:0!important}.__edgeClick.right{right:0!important;left:auto!important} ');

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
  function querySelector(selector, ctx = document) {
    const direct = ctx.querySelector(selector);
    if (direct) return direct;
    const shadowRoots = [...getShadowRoots(ctx, true)];
    for (const root of shadowRoots) {
      const match = root.querySelector(selector);
      if (match) return match;
    }
    return null;
  }
  function querySelectorAll(selector, ctx = document) {
    const results = [...ctx.querySelectorAll(selector)];
    const shadowRoots = [...getShadowRoots(ctx, true)];
    for (const root of shadowRoots) {
      results.push(...root.querySelectorAll(selector));
    }
    return results;
  }
  const Consts = Object.freeze({
    EMPTY: "",
    HALF_SEC: 500,
    ONE_SEC: 1e3,
    TWO_SEC: 2e3,
    THREE_SEC: 3e3,
    FAKE_VIDEO: "fake-video",
    webFull: "gm_webfullscreen",
    MSG_SOURCE: "SCRIPTS_AUTO_WEB_FULLSCREEN",
    DEF_TSR: { zoom: 100, mvX: 0, mvY: 0, rotate: 0, mirror: 1 }
  });
  const Tools = unsafeWindow.FyTools = {
    isTopWin: () => window.top === window,
    isNumber: (str) => /^[0-9]$/.test(str),
    scrollTop: (top) => window.scrollTo({ top }),
    getRect: (el) => el?.getBoundingClientRect(),
    microTask: (fn) => Promise.resolve().then(fn),
    alert: (...data) => window.alert(data.join(" ")),
    isMultiV: () => querySelectorAll("video").length > 1,
    query: (selector, ctx) => querySelector(selector, ctx),
    querys: (selector, ctx) => querySelectorAll(selector, ctx),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    toFixed: (value, digits = 2) => (+value).toFixed(digits).replace(/\.?0+$/, Consts.EMPTY),
    postMessage: (win, data) => win?.postMessage({ source: Consts.MSG_SOURCE, ...data }, "*"),
    getNumbers: (str) => typeof str === "string" ? (str.match(/\d+/g) ?? []).map(Number) : [],
    log: (...data) => console.log(...["%c===== 脚本日志 =====\n\n", "color:green;", ...data, "\n\n"]),
    getIFrames: () => querySelectorAll("iframe:not([src=''], [src='#'], [id='buffer'], [id='install'])"),
    isVisible: (el) => !!(el && getComputedStyle(el).visibility !== "hidden" && (el.offsetWidth || el.offsetHeight)),
    preventDefault: (e) => (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()),
    attr: (el, name, val) => el && name && el[val ? "setAttribute" : "removeAttribute"](name, val),
    emitEvent: (type, detail = {}) => document.dispatchEvent(new CustomEvent(type, { detail })),
    isInputable: (el) => ["INPUT", "TEXTAREA"].includes(el?.tagName) || el?.isContentEditable,
    createElement: (name, attrs = {}) => Object.assign(document.createElement(name), attrs),
    hasCls: (el, ...cls) => cls.flat().some((c) => el?.classList.contains(c)),
    delCls: (el, ...cls) => el?.classList.remove(...cls),
    addCls: (el, ...cls) => el?.classList.add(...cls),
    notyf(msg, isError = false) {
      const notyf$1 = new notyf.Notyf({ duration: Consts.THREE_SEC, position: { x: "center", y: "top" } });
      isError ? notyf$1.error(msg) : notyf$1.success(msg);
      return false;
    },
    sendToIFrames(data) {
      this.getIFrames().forEach((el) => this.postMessage(el?.contentWindow, data));
    },
    freqTimes: /* @__PURE__ */ new Map(),
    isThrottle(key = "throttle", gap = 300) {
      const now = Date.now();
      const last = this.freqTimes.get(key) ?? 0;
      const diff = now - last;
      return diff >= gap ? this.freqTimes.set(key, now) && false : true;
    },
    countMap: /* @__PURE__ */ new Map(),
    isOverLimit(key = "default", max = 5) {
      const count = this.countMap.get(key) ?? 0;
      if (count < max) return this.countMap.set(key, count + 1) && false;
      return true;
    },
    resetLimit(...keys) {
      const keyList = keys.length > 0 ? keys : ["default"];
      keyList.forEach((key) => this.countMap.set(key, 0));
    },
    pointInElement(x, y, el) {
      if (!el) return false;
      const { top, left, right, bottom } = this.getRect(el);
      return x >= left && x <= right && y >= top && y <= bottom;
    },
    emitMousemove(el) {
      const { top: y, left, right } = this.getRect(el);
      for (let x = left; x <= right; x += 10) this.fireMouseEvt(el, "mousemove", x, y);
    },
    fireMouseEvt(el, type, clientX, clientY) {
      const dict = { clientX, clientY, bubbles: true };
      el?.dispatchEvent(new MouseEvent(type, dict));
    },
    isValidId: (el) => el.id && !/[\d\u4e00-\u9fa5]/.test(el.id),
    getElementPath(element) {
      const parents = [];
      let current = element;
      while (current && !current.matches("body")) {
        parents.unshift(this.getSelector(current));
        if (this.isValidId(current)) break;
        current = this.getParent(current);
      }
      return parents.join(" > ");
    },
    getSelector(el) {
      if (this.isValidId(el)) return `#${el.id}`;
      const tag = el.tagName.toLowerCase();
      const validCls = Array.from(el.classList).filter((cls) => !/[\[\]\d]/.test(cls));
      return validCls.length ? `${tag}.${validCls.join(".")}` : tag;
    },
    getParent(el) {
      if (!el) return null;
      const parent = el.parentNode;
      if (parent instanceof ShadowRoot) return parent.host;
      return parent === document ? null : parent;
    },
    getParents(el, max = Infinity, self = true) {
      const parents = self && el ? [el] : [];
      for (let current = el, deep = 0; current && deep < max; deep++) {
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
      const flatTexts = texts.flat().map((t) => t.replace(/'/g, "\\'"));
      const part = (t) => mode === "text" ? `contains(text(), '${t}')` : `@*[contains(., '${t}')]`;
      const expr = `.//*[${flatTexts.map(part).join(" or ")}]`;
      const nodes = document.evaluate(expr, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      return Array.from({ length: nodes.snapshotLength }, (_, i) => nodes.snapshotItem(i)).filter((el) => !el.matches("script"));
    },
    safeHTML(html) {
      if (!window.trustedTypes?.createPolicy) return html;
      const policy = trustedTypes.defaultPolicy ?? trustedTypes.createPolicy("default", { createHTML: (input) => input });
      return policy.createHTML(html);
    },
    cloneAttrs(source, target, ...attrs) {
      attrs.flat().forEach((attr) => {
        const value = source.getAttribute(attr);
        if (value) target.setAttribute(attr, value);
      });
    },
    setStyle(els, prop, val, priority) {
      if (!els || !prop) return;
      const fn = val ? "setProperty" : "removeProperty";
      [].concat(els).forEach((el) => el?.style?.[fn]?.(prop, val, priority));
    },
    isAttached(el) {
      if (!el) return false;
      const root = el.getRootNode?.();
      return el.isConnected && (!root || !(root instanceof ShadowRoot) || root.host.isConnected);
    }
  };
  class VideoEnhancer {
    static setPlaybackRate(video, rate) {
      this.defineProperty(video, "playbackRate", {
        set(value, setter) {
          if (this.playbackRate === value) return;
          this.__playRate === value && setter(value);
        }
      });
      video.playbackRate = video.__playRate = Tools.toFixed(rate);
    }
    static defineProperty(target, prop, hooks) {
      try {
        const original = this.getPropertyDescriptor(target, prop);
        if (!original) throw new Error(`属性 ${prop} 不存在`);
        Object.defineProperty(target, prop, {
          get() {
            const value = original.get ? original.get.call(this) : original.value;
            return hooks.get ? hooks.get.call(this, value) : value;
          },
          set(value) {
            const setter = (v) => (original.set ? original.set.call(this, v) : original.value = v, v);
            hooks.set ? hooks.set.call(this, value, setter) : setter(value);
          },
          configurable: true
        });
      } catch (e) {
        console.error(`修改 ${prop} 属性时出错：`, e);
      }
    }
    static getPropertyDescriptor(target, prop) {
      for (let proto = target; proto; proto = Object.getPrototypeOf(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc) return desc;
      }
      return null;
    }
    static hackAttachShadow() {
      if (Element.prototype.__attachShadow) return;
      Element.prototype.__attachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(options) {
        if (this._shadowRoot) return this._shadowRoot;
        const shadowRoot = this._shadowRoot = this.__attachShadow.call(this, options);
        VideoEnhancer.detectShadowVideo();
        return shadowRoot;
      };
      Element.prototype.attachShadow.toString = () => Element.prototype.__attachShadow.toString();
    }
    static detectShadowVideo() {
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
      this.storage = useLocalStore ? localStorage : { getItem: GM_getValue, setItem: GM_setValue, removeItem: GM_deleteValue };
      BasicStorage.#instances.push(this);
      if (BasicStorage.#instances.length === 1) requestIdleCallback(() => BasicStorage.cleanExpired());
    }
    #getFinalKey(suffix) {
      if (this.splice && !suffix) throw new Error(`${this.name} 后缀不能为空！`);
      return this.name + (this.splice ? suffix : "");
    }
    set(value, key, expires) {
      const val = expires ? JSON.stringify({ value, expires: Date.now() + expires * 864e5 }) : value;
      this.storage.setItem(this.#getFinalKey(key), val);
      return value;
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
      const keys = Object.is(this.storage, localStorage) ? Object.keys(localStorage) : GM_listValues();
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
  const Storage = unsafeWindow.FyStorage = {
    ICONS_SELECTOR: new BasicStorage("ICONS_SELECTOR", null),
    CUSTOM_CTN: new BasicStorage("CUSTOM_WEB_FULL_", "", false, String, true),
    NO_AUTO_DEF: new BasicStorage("DISABLE_DEFAULT_AUTO", false, false, Boolean),
    IS_SITE_AUTO: new BasicStorage("ENABLE_THIS_SITE_AUTO_", false, false, Boolean, true),
    ENABLE_EDGE_CLICK: new BasicStorage("ENABLE_EDGE_CLICK", false, false, Boolean),
    DETACH_THRESHOLD: new BasicStorage("DETACH_THRESHOLD_", 20, false, Number, true),
    HIDE_ELEMENTS: new BasicStorage("HIDE_ELEMENTS_", "", false, void 0, true),
    DISABLE_TRY_PLAY: new BasicStorage("DISABLE_TRY_PLAY", false, false, Boolean),
    SPEED_STEP: new BasicStorage("PLAY_RATE_STEP", 0.25, false, parseFloat),
    DISABLE_SPEED: new BasicStorage("CLOSE_PLAY_RATE", false, false, Boolean),
    RATE_KEEP_SHOW: new BasicStorage("RATE_KEEP_SHOW", false, false, Boolean),
    NOT_CACHE_SPEED: new BasicStorage("DISABLE_MEMORY_SPEED", false, false, Boolean),
    CACHED_SPEED: new BasicStorage("FENY_SCRIPTS_V_PLAYBACK_RATE", 1, true, parseFloat),
    PRESET_SPEED: new BasicStorage("PRESET_SPEED", "1.15,1.45,1.75", false, (value) => value.split(",")),
    SKIP_INTERVAL: new BasicStorage("VIDEO_SKIP_INTERVAL", 5, false, Number),
    ZERO_KEY_SKIP: new BasicStorage("ZERO_KEY_SKIP_INTERVAL", 30, false, Number),
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
  const Listen = {
    fsWrapper: null,
    isFullscreen: false,
    isNoVideo: () => !window.vMeta && !window.topWin,
    isMutedLoop: (video) => video?.muted && video?.loop,
    isExecuted: (key, ctx = window) => ctx[key] || !!(ctx[key] = true, false),
    init(isNonFirst = false) {
      this.host = location.host;
      this.docElement = document.documentElement;
      this.setupKeydownListener();
      this.setupVisibleListener();
      this.setupMouseMoveListener();
      this.setupFullscreenListener();
      this.setupVideoListeners();
      if (isNonFirst) return;
      this.setupDocumentObserver();
      this.observeWebFullscreenChange();
      this.setupIgnoreChangeListener();
      this.setupShadowVideoListener();
      this.setupLoadEventListener();
    },
    setupVisibleListener() {
      window.addEventListener("visibilitychange", () => {
        if (this.isNoVideo() || Storage.IS_INVISIBLE_PAUSE.get()) return;
        const video = this.player;
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
    setCurrentVideo(video) {
      if (!video || this.player === video || video.offsetWidth < 260 || this.isMutedLoop(video)) return;
      if (this.player && !this.player.paused && !isNaN(this.player.duration)) return;
      this.setPlayer(video);
      this.observeVideoSrcChange(video);
    },
    setPlayer(video) {
      this.player = video;
      const vMeta = { isLive: video.duration === Infinity, timestamp: Date.now() };
      this.syncMetaToParentWin(vMeta);
    },
    syncMetaToParentWin(vMeta) {
      window.vMeta = this.vMeta = vMeta;
      if (!Tools.isTopWin()) return Tools.postMessage(window.parent, { vMeta: { ...vMeta, iFrame: location.href } });
      Tools.microTask(() => (this.initMenuCmds(), this.watchIFrameChange(), this.setupPickerListener()));
      this.sendTopWinInfo();
    },
    sendTopWinInfo() {
      const { host, href: url } = location;
      const { innerWidth: vw, innerHeight: vh } = window;
      const topWin = { vw, vh, url, host, urlHash: Tools.hashCode(url) };
      window.topWin = this.topWin = topWin;
      Tools.sendToIFrames({ topWin });
    },
    observeVideoSrcChange(video) {
      if (this.isExecuted("observed", video)) return;
      const isFake = video.matches(Consts.FAKE_VIDEO);
      const onChange = (v) => (delete this.topWin, this.setPlayer(v));
      VideoEnhancer.defineProperty(video, isFake ? "srcConfig" : "src", {
        set(value, setter) {
          setter(value), value && this === App.player && onChange(this);
        }
      });
    },
    watchIFrameChange() {
      const iFrame = this.getVideoIFrame();
      if (!iFrame || this.isExecuted("observed", iFrame)) return;
      new MutationObserver(
        () => this.isFullscreen ? this.toggleFullscreen() : this.fsWrapper && this.exitWebFullscreen()
      ).observe(iFrame, { attributes: true, attributeFilter: ["src"] });
      iFrame.focus();
    },
    setupFullscreenListener() {
      document.addEventListener("fullscreenchange", () => {
        Tools.postMessage(window.top, { isFullscreen: !!document.fullscreenElement });
      });
      if (this.isExecuted("isDefined")) return;
      VideoEnhancer.defineProperty(this, "isFullscreen", {
        set: (value, setter) => (setter(value), this.handleFullscreenChange(value))
      });
    },
    handleFullscreenChange(isFullscreen) {
      isFullscreen && Tools.isInputable(document.activeElement) && document.activeElement.blur();
      !isFullscreen && this.fsWrapper && this.dispatchShortcut(Keyboard.P);
      this.changeTimeDisplay();
    },
    observeWebFullscreenChange() {
      const handle = (e, { code, type } = e) => {
        if (type === "scroll") return Tools.scrollTop(this.fsWrapper.scrollY);
        if (this.isInputFocus(e) || ![Keyboard.Space, Keyboard.Left, Keyboard.Right].includes(code)) return;
        Tools.preventDefault(e), Object.is(type, "keydown") && this.dispatchShortcut(code, { bypass: true });
      };
      VideoEnhancer.defineProperty(this, "fsWrapper", {
        set(value, setter) {
          const method = setter(value) ? "addEventListener" : "removeEventListener";
          ["scroll", "keyup", "keydown"].forEach((type) => unsafeWindow[method](type, handle, true));
        }
      });
    },
    setupMouseMoveListener() {
      let timer = null;
      const handle = ({ type, clientX, clientY }) => {
        if (Tools.isThrottle(type)) return;
        this.createEdgeElement(this.getVideoForCoord(clientX, clientY));
        if (this.isNoVideo()) return;
        clearTimeout(timer), this.toggleCursor();
        timer = setTimeout(() => this.toggleCursor(true), Consts.TWO_SEC);
      };
      document.addEventListener("mousemove", handle, { passive: true });
    },
    toggleCursor(hide = false, cls = "__hc") {
      if (!hide) return Tools.querys(`.${cls}`).forEach((el) => Tools.delCls(el, cls));
      const eles = [...Tools.getParents(this.player, 3), this.getVideoIFrame()];
      eles.forEach((el) => (Tools.addCls(el, cls), Tools.fireMouseEvt(el, "mouseleave")));
    },
    getVideoForCoord(x, y) {
      if (!Storage.ENABLE_EDGE_CLICK.get()) return;
      if (Tools.pointInElement(x, y, this.player)) return this.player;
      const getZIndex = (el) => Number(getComputedStyle(el).zIndex) || 0;
      const videos = Tools.querys("video").filter((v) => !this.isMutedLoop(v) && Tools.pointInElement(x, y, v));
      return videos.sort((a, b) => getZIndex(b) - getZIndex(a)).shift();
    },
    createEdgeElement(video) {
      if (!video || !Storage.ENABLE_EDGE_CLICK.get()) return;
      const container = this.getEdgeContainer(video);
      if (video.lArea?.parentNode === container) return;
      if (container instanceof Element && this.lacksRelativePosition(container)) {
        Tools.setStyle(container, "position", "relative");
      }
      Tools.querys(".__edgeClick", container).forEach((el) => el.remove());
      if (video.lArea) return container.prepend(video.lArea, video.rArea);
      const createEdge = (cls = "") => {
        const element = Tools.createElement("div", { video, className: `__edgeClick ${cls}` });
        element.onclick = (e) => {
          Tools.preventDefault(e);
          this.setPlayer(e.target.video);
          Tools.sleep(5).then(() => this.dispatchShortcut(Keyboard.P, { isTrusted: true }));
        };
        return element;
      };
      [video.lArea, video.rArea] = [createEdge(), createEdge("right")];
      container.prepend(video.lArea, video.rArea);
    },
    getEdgeContainer(video) {
      if (this.fsWrapper) return video.closest(`[${Consts.webFull}]`) ?? this.fsWrapper;
      const parent = video.parentNode;
      const sroot = video.getRootNode() instanceof ShadowRoot;
      return sroot ? parent : this.findVideoContainer(parent, void 0, false);
    },
    lacksRelativePosition(el) {
      return Tools.getParents(el, 2).every((e) => e && getComputedStyle(e).position === "static");
    },
    removeEdgeElements() {
      Tools.querys(".__edgeClick").forEach((el) => (el.remove(), delete el.video.lArea, delete el.video.rArea));
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
      Tools.microTask(() => (this.#createSiteTests(), this.#convertGmMatch()));
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
      GM.xmlHttpRequest({ url, timeout: 3e3 }).then((res) => {
        const remoteConf = JSON.parse(res.responseText ?? "{}");
        this.selectors = { ...this.selectors, ...remoteConf };
        Storage.ICONS_SELECTOR.set(this.selectors, Consts.EMPTY, 1 / 3);
      }).catch((e) => console.error("加载远程配置失败", e));
    }
    static #convertGmMatch() {
      const { matches, includes: excluded } = GM_info.script;
      const isValid = (s) => s !== "*://*/*" && !excluded.includes(s);
      this.gmMatches = matches.filter(isValid).map((s) => new RegExp(s.replace(/\*/g, "\\S+")));
    }
    static #createSiteTests() {
      Object.entries(this._siteRegExps).forEach(([name, regex]) => {
        const method = `is${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        if (!this[method]) this[method] = () => regex.test(location.href);
      });
    }
  }
  const Keydown = {
    isInputFocus: (e) => Tools.isInputable(e.composedPath()[0]),
    preventKey(e, { code, altKey } = e) {
      const isNumKeys = Tools.isNumber(e.key) && !this.isDisRate();
      const isOverrideKeys = this.isOverrideKey() && [Keyboard.Space, Keyboard.Left, Keyboard.Right].includes(code);
      const isPreventKeys = [Keyboard.K, Keyboard.L, Keyboard.M, Keyboard.N, Keyboard.P, Keyboard.R].includes(code);
      const isZoomKeys = altKey && !this.isDisZoom() && [Keyboard.Up, Keyboard.Down, Keyboard.Left, Keyboard.Right].includes(code);
      if (isNumKeys || isOverrideKeys || isPreventKeys || isZoomKeys) Tools.preventDefault(e);
    },
    dispatchShortcut(code, { bypass = false, isTrusted = false } = {}) {
      const key = this.processShortcutKey({ code });
      Tools.postMessage(window.top, { key, bypass, isTrusted });
    },
    processShortcutKey({ key, code, ctrlKey, shiftKey, altKey }) {
      code = code.replace(/key|arrow|numpad|tract/gi, Consts.EMPTY);
      const keys = [ctrlKey && "ctrl", shiftKey && "shift", altKey && "alt", /[0-9]/.test(key) ? key : code];
      return keys.filter(Boolean).join("_").toUpperCase();
    },
    setupKeydownListener() {
      unsafeWindow.addEventListener("keyup", (e) => this.preventKey(e), true);
      unsafeWindow.addEventListener("keydown", (e) => this.handleKeydown(e), true);
      unsafeWindow.addEventListener("message", ({ data }) => this.handleMessage(data));
    },
    handleKeydown(e, { key, code, isTrusted } = e) {
      if (this.isNoVideo() || this.isInputFocus(e)) return;
      if (!Object.values(Keyboard).includes(code) && !Tools.isNumber(key)) return;
      this.preventKey(e);
      key = this.processShortcutKey(e);
      const specialKeys = [Keyboard.N, Keyboard.P, Keyboard.Enter, Keyboard.NumEnter];
      if (specialKeys.includes(code)) return this.dispatchShortcut(key, { isTrusted });
      this.processEvent({ key, isTrusted });
    },
    processEvent(data) {
      if (this.vMeta?.iFrame && this.player) delete this.player;
      if (!this.player) Tools.sendToIFrames(data);
      if (data?.key) this.execKeyActions(data);
    },
    execKeyActions({ key, bypass, isTrusted }) {
      const dict = {
        M: () => this.muteVideo(),
        R: () => this.rotateVideo(),
        L: () => this.freezeFrame(),
        K: () => this.freezeFrame(-1),
        ENTER: () => this.toggleFullscreen(),
        P: () => this.toggleWebFullscreen(isTrusted),
        D: () => Site.isGmMatch() && this.triggerIconElement(Site.icons.danmaku),
        N: () => Site.isGmMatch() ? this.triggerIconElement(Site.icons.next) : this.switchEpisode(),
        SPACE: () => (bypass || this.isOverrideKey()) && this.playToggle(this.player),
        LEFT: () => this.skipPlayback(-Storage.SKIP_INTERVAL.get(), bypass),
        RIGHT: () => this.skipPlayback(Storage.SKIP_INTERVAL.get(), bypass),
        0: () => this.skipPlayback(Storage.ZERO_KEY_SKIP.get(), true) || 0,
        SHIFT_A: () => this.autoNextEnabled(),
        CTRL_ALT_A: () => this.screenshot(),
        ALT_SUB: () => this.zoomVideo(-1),
        ALT_ADD: () => this.zoomVideo(),
        SHIFT_R: () => this.horizFlip(),
        CTRL_Z: () => this.resetTsr()
      };
      ["A", "S", "ADD", "SUB"].forEach((k, i) => dict[k] = () => this.adjustPlayRate([1, -1][i % 2] * Storage.SPEED_STEP.get()));
      for (let i = 1; i < 6; i++) dict[`CTRL_${i}`] = () => this.setPlaybackRate(Storage.PRESET_SPEED.get()[i - 1]);
      ["ALT_UP", "ALT_DOWN", "ALT_LEFT", "ALT_RIGHT"].forEach((k) => dict[k] = () => this.moveVideo(k));
      dict[key]?.() ?? (Tools.isNumber(key) && this.setPlaybackRate(key));
    },
    handleMessage(data) {
      if (!data?.source?.includes(Consts.MSG_SOURCE)) return;
      if (data?.vMeta) return this.syncMetaToParentWin(data.vMeta);
      if ("isFullscreen" in data) this.isFullscreen = data.isFullscreen;
      if (data?.topWin) window.topWin = this.topWin = data.topWin;
      this.handleConfsMessage(data);
      this.processEvent(data);
    },
    handleConfsMessage(data) {
      if (data?.sw_zoom) this.resetTsr();
      if (data?.sw_memory) this.delCachedRate();
      if (data?.sw_speed) this.setPlaybackRate(1);
      if ("sw_rateKeep" in data) this.playbackRateDisplay();
      if ("sw_clockAlw" in data) setTimeout(() => this.changeTimeDisplay(), 30);
      if ("sw_color" in data) this.setTimeColor(data.sw_color);
      if ("sw_edgeClk" in data) this.removeEdgeElements();
    }
  };
  const Events = {
    videoAborts: /* @__PURE__ */ new Map(),
    videoEvts: ["loadedmetadata", "loadeddata", "timeupdate", "canplay", "playing", "ended"],
    setupVideoListeners(video) {
      const handle = (e) => {
        const target = video ?? e.target;
        if (video || target.matches(`video, ${Consts.FAKE_VIDEO}`)) this[e.type](target);
      };
      const ctrl = new AbortController();
      video && this.videoAborts.get(video)?.abort();
      this.videoEvts.forEach((t) => (video ?? document).addEventListener(t, handle, { capture: true, signal: ctrl.signal }));
      if (video) this.videoAborts.set(video, ctrl), this.unbindVideoEvts();
    },
    setupShadowVideoListener() {
      document.addEventListener("shadow-video", (e) => {
        const { video } = e.detail;
        if (!video || video.hasAttribute("received")) return;
        video.setAttribute("received", true);
        this.setupVideoListeners(video);
      });
    },
    unbindVideoEvts() {
      if (Tools.isThrottle("cleanup")) return;
      this.videoAborts.forEach((ctrl, video) => {
        if (Tools.isAttached(video)) return;
        ctrl.abort(), video.removeAttribute("received"), this.videoAborts.delete(video);
      });
    },
    loadedmetadata(video) {
      if (video.matches(Consts.FAKE_VIDEO)) this.loadeddata(video);
      if (!this.player) this.setCurrentVideo(video);
      this.autoWebFullscreen(video);
    },
    loadeddata(video) {
      this.initVideoProps(video);
    },
    timeupdate(video) {
      if (isNaN(video.duration)) return;
      if (!this.player) this.playing(video);
      this.autoWebFullscreen(video);
      this.autoNextEpisode(video);
      this.cachePlayTime(video);
      this.videoProgress(video);
      this.ensureRateDisplay();
    },
    canplay(video) {
      if (!Tools.isVisible(video) || Storage.DISABLE_TRY_PLAY.get()) return;
      if (video._mfs_tryPlay || Tools.isMultiV()) return;
      video._mfs_tryPlay = true;
      this.tryPlay(video);
    },
    playing(video) {
      this.setCurrentVideo(video);
      if (!video.tsr) video.tsr = { ...Consts.DEF_TSR };
      Tools.sleep(50).then(() => this.initVideoPlay(video));
    },
    ended(video) {
      this.autoExitWebFullscreen();
      this.clearCachedTime(video);
    }
  };
  const Control = {
    isLive() {
      if (!this.vMeta || !this.player) return false;
      return this.vMeta.isLive || this.player?.duration === Infinity || this.isDynamicDur(this.player);
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
      this.removeRateDisplay();
      this.removeProgElement();
    },
    initVideoPlay(video) {
      if (this.isExecuted("_mfs_apply", video)) return;
      this.applyCachedRate();
      this.applyCachedTime(video);
      this.playbackRateDisplay();
      this.setupPlayerClock();
      this.setBiliQuality();
    },
    remainTime: (video) => Math.floor(App.getRealDur(video)) - Math.floor(video.currentTime),
    playToggle: (video) => Site.isDouyu() ? video?.click() : video?.[video?.paused ? "play" : "pause"](),
    tryPlay: (video) => video?.paused && (Site.isDouyu() ? video?.click() : video?.play()),
    setPlaybackRate(rate) {
      if (!rate || !this.player || this.isLive() || this.isDisRate() || +this.player.playbackRate === +rate) return;
      VideoEnhancer.setPlaybackRate(this.player, rate);
      this.customToast("正在以", `${this.player.playbackRate}x`, "倍速播放");
      this.playbackRateDisplay();
      if (!Storage.NOT_CACHE_SPEED.get()) Storage.CACHED_SPEED.set(this.player.playbackRate);
    },
    adjustPlayRate(step = 0.25) {
      const rate = Math.max(0.1, +this.player.playbackRate + step);
      this.setPlaybackRate(Math.min(16, rate));
    },
    applyCachedRate: () => Storage.NOT_CACHE_SPEED.get() ? App.delCachedRate() : App.setPlaybackRate(Storage.CACHED_SPEED.get()),
    delCachedRate: () => Storage.CACHED_SPEED.del(),
    skipPlayback(second = 0, bypass = false) {
      if (!bypass && !this.isOverrideKey()) return;
      if (!this.player || this.isLive() || this.player.ended) return;
      this.setCurrentTime(Math.min(+this.player.currentTime + second, this.player.duration));
    },
    cachePlayTime(video) {
      if (video !== this.player || !this.topWin || video.duration < 120 || this.isLive()) return;
      if (Tools.isThrottle("cacheTime", Consts.ONE_SEC) || +video.currentTime < Storage.SKIP_INTERVAL.get()) return;
      if (Storage.NOT_CACHE_TIME.get() || this.remainTime(video) <= 10) return this.clearCachedTime(video);
      Storage.PLAY_TIME.set(+video.currentTime - 1, this.getUniqueKey(video), Storage.STORAGE_DAYS.get());
      if (Tools.isMultiV()) this.ensureUniqueCacheTime();
    },
    applyCachedTime(video) {
      if (!this.topWin || this.isLive()) return;
      if (Storage.NOT_CACHE_TIME.get()) return this.clearCachedTime(video);
      const time = Storage.PLAY_TIME.get(this.getUniqueKey(video));
      if (time <= +video.currentTime) return;
      this.setCurrentTime(time);
      this.customToast("上次观看至", this.formatTime(time), "处，已为您续播", Consts.ONE_SEC * 3.5, false).then((el) => {
        if (Tools.query(".monkey-toast")) Tools.setStyle(el, "transform", `translateY(${-5 - el.offsetHeight}px)`);
      });
    },
    setCurrentTime: (ct) => ct && (App.player.currentTime = Math.max(0, ct)),
    clearCachedTime: (video) => App.topWin && Storage.PLAY_TIME.del(App.getUniqueKey(video)),
    getUniqueKey(video, { duration, __duration } = video) {
      if (video._mfs_cacheTKey) return video._mfs_cacheTKey;
      const currNumber = this.getCurrentEpisodeNumber();
      const baseKey = `${this.topWin.urlHash}_${Math.floor(__duration || duration)}`;
      const cacheKey = currNumber ? `${baseKey}_${currNumber}` : baseKey;
      video._mfs_cacheTKey = cacheKey;
      return cacheKey;
    },
    ensureUniqueCacheTime() {
      const pattern = `${Storage.PLAY_TIME.name}${this.topWin.urlHash}`;
      const keys = Object.keys(Storage.PLAY_TIME.fuzzyGet(pattern));
      if (keys.length > 1) Storage.PLAY_TIME.fuzzyDel(pattern);
    },
    formatTime(sec) {
      if (isNaN(sec)) return "00:00";
      const [h, m, s] = [~~(sec / 3600), ~~(sec % 3600 / 60), ~~(sec % 60)];
      return (h ? [h, m, s] : [m, s]).map((v) => String(v).padStart(2, "0")).join(":");
    },
    horizFlip() {
      if (!this.player) return;
      const { tsr } = this.player;
      this.setTsr("--mirror", tsr.mirror = -tsr.mirror);
    },
    rotateVideo() {
      if (!this.player) return;
      const { tsr } = this.player;
      tsr.rotate = (tsr.rotate + 90) % 360;
      const { videoWidth: w, videoHeight: h } = this.player;
      const scale = [90, 270].includes(tsr.rotate) ? h / w : 1;
      this.setTsr("--scale", scale).setTsr("--rotate", `${tsr.rotate}deg`);
    },
    zoomVideo(dir = 1) {
      if (!this.player || this.isDisZoom()) return;
      const { tsr } = this.player;
      const step = Storage.ZOOM_PERCENT.get();
      const zoom = Math.max(25, Math.min(500, tsr.zoom + dir * step));
      tsr.zoom = zoom;
      this.setTsr("--zoom", zoom / 100);
      this.showToast(`缩放：${zoom}%`, Consts.ONE_SEC);
    },
    moveVideo(key) {
      if (!this.player || this.isDisZoom()) return;
      const { tsr } = this.player;
      const s = Storage.MOVING_DISTANCE.get();
      const dMap = { ALT_UP: [0, -s, "上"], ALT_DOWN: [0, s, "下"], ALT_LEFT: [-s, 0, "左"], ALT_RIGHT: [s, 0, "右"] };
      let [x, y, desc] = dMap[key];
      x *= tsr.mirror;
      [x, y] = { 90: [y, -x], 180: [-x, -y], 270: [-y, x] }[tsr.rotate] || [x, y];
      tsr.mvX += x, tsr.mvY += y;
      this.setTsr("--mvX", `${tsr.mvX}px`).setTsr("--mvY", `${tsr.mvY}px`);
      this.showToast(`向${desc}移动：${x ? tsr.mvX : tsr.mvY}px`, Consts.ONE_SEC);
    },
    resetTsr() {
      if (!this.player || this.isDisZoom()) return;
      const styles = ["--zoom", "--mvX", "--mvY", "--scale", "--mirror", "--rotate", "--deftsr"];
      styles.forEach((n) => Tools.setStyle(this.player, n));
      this.player.tsr = { ...Consts.DEF_TSR };
      Tools.delCls(this.player, "__tsr");
      delete this.player._mfs_tsr;
    },
    setTsr(name, value) {
      try {
        Tools.addCls(this.player, "__tsr");
        this.player._mfs_tsr = this.player._mfs_tsr ?? getComputedStyle(this.player).transform;
        Tools.setStyle(this.player, "--deftsr", this.player._mfs_tsr);
        Tools.setStyle(this.player, name, value);
      } catch (e) {
        console.error(e);
      }
      return this;
    },
    muteVideo() {
      if (!this.player) return;
      const isMuted = this.player.muted || !this.player.volume;
      Object.assign(this.player, { muted: !isMuted, volume: +isMuted });
      this.showToast(isMuted ? "🔊 取消静音" : "🔇 已静音", Consts.ONE_SEC);
    },
    async screenshot() {
      if (!this.player || Storage.DISABLE_SCREENSHOT.get()) return;
      this.player.setAttribute("crossorigin", "anonymous");
      const { videoWidth: width, videoHeight: height } = this.player;
      const canvas = Tools.createElement("canvas", { width, height });
      const ctx = canvas.getContext("2d");
      try {
        ctx.drawImage(this.player, 0, 0, width, height);
        const url = URL.createObjectURL(await new Promise((resolve) => canvas.toBlob(resolve, "image/png")));
        GM_download({ url, name: `视频截图_${Date.now()}.png`, onload: () => URL.revokeObjectURL(url) });
      } catch (e) {
        Tools.setStyle(canvas, "max-width", "97vw");
        const popup = window.open(Consts.EMPTY, "_blank", "width=1000,height=570,top=130,left=270");
        popup.document.title = "鼠标右键选择「图片另存为」";
        popup.document.body.appendChild(canvas);
        console.error(e);
      }
    },
    freezeFrame(dir = 1) {
      if (!this.player) return;
      !this.player.paused && this.player.pause();
      this.player.currentTime += dir / 24;
    },
    autoNextEnabled() {
      const status = Storage.IS_AUTO_NEXT.set(!Storage.IS_AUTO_NEXT.get());
      this.showToast(`已${status ? "启" : "禁"}用自动切换下集`);
    },
    customToast(start, text, end, dealy, isRemove) {
      const span = document.createElement("span");
      const child = Tools.createElement("span", { textContent: text, className: "cText" });
      span.append(document.createTextNode(start), child, document.createTextNode(end));
      return this.showToast(span, dealy, isRemove);
    },
    showToast(content, dealy = Consts.THREE_SEC, isRemove = true) {
      return new Promise((resolve) => {
        if (isRemove) Tools.query(".monkey-toast")?.remove();
        const el = Tools.createElement("div", { className: "monkey-toast" });
        content instanceof Element ? el.appendChild(content) : el.textContent = content;
        this.findVideoContainer(null, 2, false).prepend(el), resolve(el);
        setTimeout(() => (el.style.opacity = 0, setTimeout(() => el.remove(), Consts.HALF_SEC)), dealy);
      });
    }
  };
  const WebFull = {
    triggerIconElement(name) {
      if (Tools.isThrottle("icon")) return;
      if (!Site.isBiliLive()) return Tools.query(Site.getIcons()?.[name])?.click();
      const index = Object.values(Site.icons).indexOf(name);
      this.getLiveIcons()?.[index]?.click();
    },
    getLiveIcons() {
      Tools.emitMousemove(this.player);
      return Tools.querys(".right-area .icon");
    },
    toggleFullscreen() {
      if (!Tools.isTopWin() || Tools.isThrottle("toggleFull")) return;
      if (Site.isGmMatch() && !Site.isBiliLive()) return this.triggerIconElement(Site.icons.full);
      this.isFullscreen ? document.exitFullscreen() : this.getVideoHostContainer()?.requestFullscreen();
      if (this.isFullscreen || !this.fsWrapper) this.dispatchShortcut(Keyboard.P);
    },
    toggleWebFullscreen(isTrusted) {
      if (this.isNoVideo() || Tools.isThrottle("toggleWeb")) return;
      if (Site.isGmMatch() && !Site.isBiliLive()) return this.triggerIconElement(Site.icons.webFull);
      if (this.isFullscreen && isTrusted) return document.fullscreenElement && document.exitFullscreen();
      this.fsWrapper ? this.exitWebFullscreen() : this.enterWebFullscreen();
      requestAnimationFrame(() => this.hideRelatedOnFullscreen());
    },
    enterWebFullscreen() {
      const container = this.fsWrapper = this.getVideoHostContainer();
      if (!container || container.matches(":is(html, body)")) return this.adaptToWebFullscreen();
      container.scrollY = window.scrollY;
      const parents = Tools.getParents(container);
      container instanceof HTMLIFrameElement || parents.length < Storage.DETACH_THRESHOLD.get(this.host) ? parents.forEach((el) => {
        Tools.emitEvent("addStyle", { shadowRoot: el.getRootNode() });
        Tools.attr(el, Consts.webFull, true);
      }) : this.detachForFullscreen();
      this.adaptToWebFullscreen();
    },
    detachForFullscreen() {
      if (this.fsParent) return;
      this.fsParent = Tools.getParent(this.fsWrapper);
      this.fsPlaceholder = document.createElement("div");
      Tools.cloneAttrs(this.fsWrapper, this.fsPlaceholder, ["id", "class", "style"]);
      this.fsParent.replaceChild(this.fsPlaceholder, this.fsWrapper);
      document.body.insertAdjacentElement("beforeend", this.fsWrapper);
      this.fsWrapper.querySelector("video")?.play();
      Tools.attr(this.fsWrapper, Consts.webFull, true);
    },
    exitWebFullscreen() {
      if (!this.fsWrapper) return;
      const { scrollY } = this.fsWrapper;
      Tools.setStyle(this.docElement, "scroll-behavior", "auto", "important");
      if (this.fsParent?.contains(this.fsPlaceholder)) this.fsParent?.replaceChild(this.fsWrapper, this.fsPlaceholder);
      Tools.querys(`[${Consts.webFull}]`).forEach((el) => Tools.attr(el, Consts.webFull));
      requestAnimationFrame(() => (Tools.scrollTop(scrollY), Tools.setStyle(this.docElement, "scroll-behavior")));
      this.videoParents.clear();
      this.fsPlaceholder = this.fsWrapper = this.fsParent = null;
    },
    getVideoHostContainer() {
      if (this.player) return this.getVideoContainer();
      return this.getVideoIFrame() ?? Tools.getIFrames().find(Tools.isVisible);
    },
    getVideoIFrame() {
      if (!this.vMeta?.iFrame) return null;
      const { pathname, search } = new URL(this.vMeta.iFrame);
      const partial = ((s) => s.slice(0, s.length * 0.8))(decodeURIComponent(search));
      return Tools.query(`iframe[src*="${pathname + partial}"]`);
    },
    getVideoContainer() {
      const selector = Storage.CUSTOM_CTN.get(this.topWin?.host)?.trim();
      const ctn = selector ? this.player.closest(selector) ?? Tools.query(selector) : null;
      return ctn ?? this.findVideoContainer(this.findCtrlContainer());
    },
    findCtrlContainer() {
      const ignore = ":not(.Drag-Control, .vjs-controls-disabled, .vjs-control-text, .xgplayer-prompt)";
      const selector = `[class*="contr" i]${ignore}, [id*="control"], [class*="ctrl"], [class*="progress"], [class*="volume"]`;
      let parent = Tools.getParent(this.player);
      while (parent && parent.offsetHeight <= this.player.offsetHeight) {
        if (Tools.query(selector, parent)) return parent;
        parent = Tools.getParent(parent);
      }
      return null;
    },
    videoParents: /* @__PURE__ */ new Set(),
    findVideoContainer(container, max = 4, track = true) {
      container = container ?? Tools.getParent(this.player);
      if (!container.offsetHeight) container = Tools.getParent(container);
      const { offsetWidth: cw, offsetHeight: ch } = container;
      if (track) this.videoParents.clear();
      for (let parent = container, deep = 0; parent && deep < max; parent = Tools.getParent(parent), deep++) {
        if (parent.offsetWidth === cw && parent.offsetHeight === ch) container = parent;
        if (this.hasExplicitlySize(parent)) return container;
        if (track) this.videoParents.add(parent);
      }
      return container;
    },
    hasExplicitlySize(el) {
      const style = el.style;
      const regex = /^\d+(\.\d+)?(px|em|rem)$/;
      return ["width", "height"].some((prop) => {
        const value = style?.getPropertyValue(prop);
        return value && regex.test(value);
      });
    },
    adaptToWebFullscreen() {
      const { vw, vh } = this.topWin;
      [...this.videoParents].reverse().forEach((el) => {
        if (!this.fsWrapper.contains(el)) return;
        const { offsetWidth: width, offsetHeight: height } = this.player;
        if (width === vw && height === vh && el.offsetHeight === vh) return;
        Tools.attr(el, Consts.webFull, true);
      });
    },
    hideRelatedOnFullscreen(cls = "hide") {
      const selector = Storage.HIDE_ELEMENTS.get(this.topWin?.host);
      selector && Tools.querys(selector).forEach((el) => this.fsWrapper ? Tools.addCls(el, cls) : Tools.delCls(el, cls));
    }
  };
  const Automatic = {
    autoNextEpisode(video) {
      if (video.duration < 300 || video._mfs_hasTriedNext || this.remainTime(video) > Storage.NEXT_ADVANCE_SEC.get()) return;
      if (!Storage.IS_AUTO_NEXT.get() || Tools.isThrottle("autoNext", Consts.HALF_SEC)) return;
      if (this.isIgnoreNext()) return video._mfs_hasTriedNext = true;
      this.dispatchShortcut(Keyboard.N);
      video._mfs_hasTriedNext = true;
    },
    async autoWebFullscreen(video) {
      if (!this.topWin) await Tools.sleep(50);
      if (!this.topWin || !video.offsetWidth || this.player !== video) return;
      if (video._mfs_isWide || Tools.isThrottle("autoWide", Consts.ONE_SEC)) return;
      if (Site.isGmMatch() ? this.noAutoDefault() : !this.isAutoSite()) return;
      if (this.isIgnoreWide() || await this.isWebFull(video) || Tools.isOverLimit("autoWide")) return video._mfs_isWide = true;
      this.dispatchShortcut(Keyboard.P);
    },
    async isWebFull(video) {
      const { vw } = this.topWin;
      if (video.offsetWidth < vw) return false;
      await Tools.sleep(Consts.HALF_SEC);
      return video.offsetWidth >= vw;
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
      const target = this.getTargetEpisode(this.getCurrentEpisode(), isPrev) ?? this.getEpisodeByText(isPrev) ?? this.getEpisodeByClass(isPrev);
      this.jumpToTargetEpisode(target);
    },
    getCurrentEpisode() {
      return Storage.RELATIVE_EPISODE.get(this.host) ? this.getCurrentEpisodeBySelector() : this.getCurrentEpisodeByLink();
    },
    getCurrentEpisodeByLink() {
      const { pathname, search, hash } = location;
      const last = pathname.split("/").pop();
      const links = Tools.querys(`a[href*="${[pathname + search, last, search, hash].filter(Boolean).join('"], a[href*="')}"]`);
      return links.length <= 1 ? this.getEpisodeWrapper(links[0]) : this.findCurrentEpisode(links, pathname + search);
    },
    findCurrentEpisode(eles, pageUrl) {
      const filter = [
        "h1, header, footer, [class*='header']",
        "[class*='rank'], [class*='hotlist'], [class*='vodlist']",
        "[id*='guankan'], [id*='history'], [class*='history'], [class*='record'], [class*='lishi']"
      ];
      eles = eles.filter((el) => {
        const { pathname, search } = new URL(el.href);
        return !el.closest(`:is(${filter})`) && pageUrl.includes(pathname + search);
      }).map(this.getEpisodeWrapper).filter((el) => this.getAllEpisodes(el).map(this.getEpisodeNumber).filter(Boolean).length > 1);
      return eles.length <= 1 ? eles[0] : eles.find((el) => Tools.hasCls(el, "cur", "active") || !!this.getEpisodeNumber(el));
    },
    getEpisodeNumber: (el) => Tools.getNumbers(el?.innerText?.replace(/-|\./g, Consts.EMPTY))?.shift(),
    getTargetEpisode(el, isPrev = false) {
      if (!el) return;
      const episodes = this.getAllEpisodes(el);
      const numbers = episodes.map(this.getEpisodeNumber).filter(Boolean);
      if (numbers.length < 2) return;
      const index = episodes.indexOf(el);
      const currNumber = this.getEpisodeNumber(el);
      const { lSmall, rLarge } = this.compareNumSize(numbers, currNumber, index);
      return (lSmall || rLarge) === isPrev ? episodes[index - 1] : episodes[index + 1];
    },
    getAllEpisodes(element) {
      if (!element) return [];
      const numSet = /* @__PURE__ */ new Set();
      const elName = element.tagName;
      const elCls = Array.from(element.classList);
      const children = Array.from(element.parentNode.children);
      return children.filter((el) => {
        const curCls = Array.from(el.classList).filter((cls) => !["on", "cur", "active"].includes(cls));
        const hasCls = elCls.some((value) => curCls.includes(value));
        const isMatch = curCls.length ? hasCls : el.tagName === elName;
        if (!isMatch || numSet.has(el.innerText)) return false;
        return numSet.add(el.innerText);
      });
    },
    jumpToTargetEpisode(el) {
      const stack = [el].filter(Boolean);
      while (stack.length > 0) {
        const current = stack.pop();
        if (current.matches("a, button")) return current?.click();
        stack.push(...Array.from(current.children).reverse());
        current?.click && current.click();
      }
    },
    getEpisodeWrapper(el) {
      while (el?.parentElement) {
        const sibs = Array.from(el.parentElement.children);
        if (sibs.filter((s) => s.tagName === el.tagName).length > 1) return el;
        el = el.parentElement;
      }
      return null;
    },
    getEpisodeByText(isPrev = false) {
      const ignore = (el) => !el?.innerText?.includes("自动");
      const texts = isPrev ? ["上集", "上一集", "上话", "上一话", "上一个"] : ["下集", "下一集", "下话", "下一话", "下一个"];
      return Tools.findByText("attr", texts).filter(ignore).shift() ?? Tools.findByText("text", texts).filter(ignore).shift();
    },
    getEpisodeByClass(isPrev = false) {
      return isPrev ? null : Tools.query("[class*='control'] [class*='next' i]");
    },
    compareNumSize: (nums, compareVal = 0, index) => ({
      lSmall: nums.some((v, i) => i < index && v < compareVal),
      rLarge: nums.some((v, i) => i > index && v > compareVal)
    })
  };
  const Picker = {
    setupPickerListener() {
      if (Site.isGmMatch() || this.isExecuted("isBindPicker")) return;
      const handle = (event, { target, ctrlKey, altKey, isTrusted } = event) => {
        if (!ctrlKey || !altKey || !isTrusted || this.isNoVideo() || this.isLive()) return;
        Tools.preventDefault(event);
        const curSelector = Storage.CURRENT_EPISODE.get(this.host);
        const relSelector = Storage.RELATIVE_EPISODE.get(this.host);
        if (curSelector && relSelector) return Tools.notyf("已拾取过剧集元素 (￣ー￣)", true);
        const number = this.getEpisodeNumber(target);
        if (!number) return Tools.notyf("点击位置无数字 (•ิ_•ิ)?", true);
        curSelector ? this.pickerRelativeEpisodePath(target) : this.pickerCurrentEpisodePath(target);
      };
      document.addEventListener("click", handle, true);
    },
    pickerCurrentEpisodePath(el) {
      if (Storage.CURRENT_EPISODE.get(this.host)) return;
      this.pickerEpisodePopup(el, {
        onVerify(value) {
          try {
            const number = this.getEpisodeNumber(Tools.query(value));
            number ? Tools.notyf(`当前集数：${number}`) : Tools.notyf("获取集数失败 〒▽〒", true);
          } catch (e) {
            Tools.notyf("获取集数失败 〒▽〒", true);
            console.error(e);
          }
        },
        onSave(value) {
          Storage.CURRENT_EPISODE.set(value, this.host);
          Tools.notyf("继续拾取元素 ＼(＞０＜)／");
        }
      });
    },
    pickerRelativeEpisodePath(el) {
      if (Storage.RELATIVE_EPISODE.get(this.host)) return;
      this.pickerEpisodePopup(el, {
        onVerify(value) {
          try {
            const container = this.getEpisodeWrapper(Tools.query(value));
            const numbers = this.getAllEpisodes(container)?.map(this.getEpisodeNumber);
            numbers.length ? Tools.notyf(`所有集数：${numbers.join(" ")}`) : Tools.notyf("获取集数失败 〒▽〒", true);
          } catch (e) {
            Tools.notyf("获取集数失败 〒▽〒", true);
            console.error(e);
          }
        },
        onSave(value) {
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
    pickerEpisodePopup(el, { onVerify, onSave }) {
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
          return value ? onVerify.call(this, value) ?? false : Tools.notyf("元素选择器不能为空！", true);
        },
        preConfirm: () => Tools.query("#__picker").value.trim() || Tools.notyf("元素选择器不能为空！", true),
        didOpen: () => Tools.query("#__picker").value = Tools.getElementPath(el)
      }).then((res) => res.isConfirmed && onSave.call(this, res.value));
    }
  };
  class Clock {
    opts = { color: null, clss: "__Clock" };
    constructor(container, opts) {
      if (!container) throw new Error("时钟创建失败：container不能为空");
      this.opts = Object.assign(this.opts, opts);
      this.container = container;
      this.initClock();
      this.start();
    }
    initClock() {
      if (this.element) return;
      const { color, clss } = this.opts;
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
    formatTime(date, fmt = "2-digit") {
      return new Intl.DateTimeFormat("zh-CN", { hour: fmt, minute: fmt, second: fmt }).format(date);
    }
    update() {
      if (!this.isRun) return;
      this.element.textContent = this.formatTime(/* @__PURE__ */ new Date());
      if (!this.container.contains(this.element)) this.container.prepend(this.element);
    }
    start() {
      if (this.isRun) return;
      this.isRun = true;
      this.element.style.removeProperty("display");
      this.timerId = setInterval(() => this.update(), 500);
      this.update();
    }
    stop(hide = false) {
      this.isRun = false;
      if (this.timerId) clearInterval(this.timerId), delete this.timerId;
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
        Tools.query("body > #start, #play-button-overlay")?.click?.();
        this.setFakeBiliUser();
      });
    },
    setFakeBiliUser() {
      if (!Site.isBili() || unsafeWindow.UserStatus?.userInfo?.isLogin) return;
      Tools.sleep(Consts.THREE_SEC).then(() => {
        unsafeWindow.__BiliUser__.cache.data.isLogin = true;
        unsafeWindow.__BiliUser__.cache.data.mid = Date.now();
      });
    },
    setBiliQuality() {
      if (!Site.isBili() || !document.cookie.includes("DedeUserID") || !unsafeWindow.player) return;
      const current = unsafeWindow.player.getQuality().realQ;
      const list = unsafeWindow.player.getSupportedQualityList();
      const target = list.find((quality) => quality === 80) ?? list[0];
      if (current !== target) unsafeWindow.player.requestQuality(target);
    },
    shouldHideTime: () => App.isFullscreen && Storage.DISABLE_CLOCK.get() || !App.isFullscreen && !Storage.PAGE_CLOCK.get(),
    setupPlayerClock() {
      if (!this.player || this.shouldHideTime()) return this.Clock?.stop(true);
      if (this.Clock && !this.shouldHideTime()) return this.Clock.setContainer(this.player.parentNode).start();
      this.Clock = new Clock(this.player.parentNode, { color: Storage.CLOCK_COLOR.get() });
    },
    getRealDur(video) {
      if (!Site.isQiyi()) return video.duration;
      return unsafeWindow.webPlay?.wonder?._player?._playProxy?._info?.duration ?? video.duration;
    },
    videoProgress(video, bypass) {
      if (!video || !bypass && video.paused || this.player !== video || this.isMutedLoop(video)) return;
      if (video.duration <= 30 || this.isLive() || this.shouldHideTime()) return this.removeProgElement();
      const duration = this.getRealDur(video);
      if (duration > 86400) return this.removeProgElement();
      const percent = Tools.toFixed(video.currentTime / duration * 100, 1);
      const remain = this.formatTime(duration - video.currentTime);
      const el = this.createProgressElement();
      el.firstChild.textContent = `${remain} / ${percent}`;
      this.prependElement(el);
    },
    createProgressElement() {
      if (this.progNode) return this.progNode;
      const el = this.createDisplayElement("__timeupdate", Storage.CLOCK_COLOR.get());
      el.append(document.createTextNode("00:00"), Tools.createElement("b", { textContent: "%" }));
      this.progNode = el;
      return el;
    },
    removeProgElement: () => App.progNode?.remove(),
    playbackRateDisplay() {
      if (!this.player || this.isLive()) return;
      if (!Storage.RATE_KEEP_SHOW.get()) return this.removeRateDisplay();
      if (!this.rateDisplay) this.rateDisplay = this.createDisplayElement("__rateDisplay");
      this.rateDisplay.textContent = `倍速: ${this.player.playbackRate}`;
      this.prependElement(this.rateDisplay);
    },
    ensureRateDisplay() {
      if (document.contains(this.rateDisplay) || Tools.isOverLimit("rateKeep")) return;
      this.playbackRateDisplay();
    },
    removeRateDisplay: () => App.rateDisplay?.remove(),
    createDisplayElement(cls, color) {
      const el = Tools.createElement("div", { className: cls, style: `color: ${color}` });
      this.prependElement(el);
      return el;
    },
    prependElement(el) {
      const container = this.player?.parentNode;
      if (el && !container?.contains(el)) container?.prepend(el);
    },
    changeTimeDisplay: () => (App.setupPlayerClock(), App.videoProgress(App.player, true)),
    setTimeColor: (color) => Tools.setStyle([App.progNode, App.Clock?.element], "color", color)
  };
  const Ignore = {
    setupIgnoreChangeListener() {
      [Storage.FULL_IGNORE_URLS, Storage.NEXT_IGNORE_URLS].forEach(
        (it) => GM_addValueChangeListener(it.name, (_, oldVal, newVal) => oldVal !== newVal && this.initIgnoreUrls())
      );
    },
    initIgnoreUrls() {
      const nextIgnore = ["https://www.youtube.com/watch", "https://www.bilibili.com/video", "https://www.bilibili.com/list"];
      this.nextFilter = this.processIgnoreUrls(Storage.NEXT_IGNORE_URLS, nextIgnore);
      const wideIgnore = ["https://www.youtube.com/results", "https://www.youtube.com/shorts"];
      this.wideFilter = this.processIgnoreUrls(Storage.FULL_IGNORE_URLS, wideIgnore);
    },
    isIgnoreNext() {
      if (!this.nextFilter) this.initIgnoreUrls();
      return this.isBlocked(this.nextFilter);
    },
    isIgnoreWide() {
      if (!this.wideFilter) this.initIgnoreUrls();
      return this.isBlocked(this.wideFilter);
    },
    processIgnoreUrls(cache, defUrls) {
      const existUrls = cache.get().match(/[^\s;]+/g) || [];
      return existUrls.length ? existUrls : (cache.set(defUrls.join(";\n")), defUrls);
    },
    isBlocked(urls = []) {
      const { href, pathname } = new URL(this.topWin.url);
      return pathname === "/" || urls.some((u) => href.startsWith(u));
    }
  };
  const Menu = {
    isDisRate: () => Storage.DISABLE_SPEED.get(),
    noAutoDefault: () => Storage.NO_AUTO_DEF.get(),
    isOverrideKey: () => Storage.OVERRIDE_KEY.get(),
    isDisZoom: () => Storage.DISABLE_ZOOM_MOVE.get(),
    isAutoSite: () => Storage.IS_SITE_AUTO.get(window.topWin?.host ?? location.host),
    initMenuCmds() {
      if (this.isExecuted("hasMenu") || !Tools.isTopWin()) return;
      this.setupMenuStorageListener();
      this.setupMenuCmds();
    },
    setupMenuStorageListener() {
      [Storage.IS_SITE_AUTO, Storage.CURRENT_EPISODE].forEach(
        (it) => GM_addValueChangeListener(`${it.name}${this.host}`, () => this.setupMenuCmds())
      );
    },
    setupMenuCmds() {
      const epHide = !Storage.CURRENT_EPISODE.get(this.host);
      const tle = `此站${this.isAutoSite() ? "禁" : "启"}用自动网页全屏`;
      const sFn = ({ host, cache }) => cache.set(!cache.get(host), host);
      const delFn = ({ host }) => Storage.CURRENT_EPISODE.del(host) & Storage.RELATIVE_EPISODE.del(host);
      const configs = [
        { title: tle, cache: Storage.IS_SITE_AUTO, useHost: true, isHide: Site.isGmMatch(), fn: sFn },
        { title: "此站脱离式全屏阈值", cache: Storage.DETACH_THRESHOLD, useHost: true, isHide: Site.isGmMatch() },
        { title: "删除此站剧集选择器", cache: Storage.CURRENT_EPISODE, useHost: true, isHide: epHide, fn: delFn },
        { title: "快捷键说明", cache: { name: "SHORTCUTKEY" }, fn: this.shortcutKeysPopup },
        { title: "更多设置", cache: { name: "SETTING" }, fn: this.settingPopup }
      ];
      configs.forEach(({ title, isHide, useHost, cache, fn }) => {
        const id = `${cache.name}_MENU_ID`;
        GM_unregisterMenuCommand(this[id]);
        if (isHide) return;
        const host = useHost ? this.host : Consts.EMPTY;
        this[id] = GM_registerMenuCommand(title, () => {
          if (fn) return fn.call(this, { host, cache, title });
          const input = prompt(title, host ? cache.get(host) : cache.get());
          if (input !== null) host ? cache.set(input, host) : cache.set(input);
        });
      });
    },
    shortcutKeysPopup() {
      const keys = [
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
      const rows = keys.reduce((acc, it, i) => {
        if (i % 2) return acc;
        const next = keys[i + 1] || { key: Consts.EMPTY, desc: Consts.EMPTY };
        return acc + `<tr><td>${it.key}</td><td>${it.desc}</td><td>${next.key}</td><td>${next.desc}</td></tr>`;
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
      const [a, b, c, d] = [this.genBasics(), this.genAssist(), this.genParams(), this.genIgnore()];
      const cacheMap = Object.assign({}, ...[a, b, c, d].map((it) => it.eCache));
      const html = `
        <div class="swal2-tabs">
          <div class="swal2-tabs-header">
              <div class="swal2-tab active" data-id="tab1">播放设置</div>
              <div class="swal2-tab" data-id="tab2">辅助设置</div>
              <div class="swal2-tab" data-id="tab3">参数设置</div>
              <div class="swal2-tab" data-id="tab4">其他设置</div>
          </div>
          <div class="swal2-tabs-content">
            <div class="swal2-tab-panel active" id="tab1">${a.html}</div>
            <div class="swal2-tab-panel" id="tab2">${b.html}</div>
            <div class="swal2-tab-panel" id="tab3">${c.html}</div>
            <div class="swal2-tab-panel" id="tab4">${d.html}</div>
          </div>
        </div>`;
      Swal.fire({
        width: 410,
        title: "设置",
        showCancelButton: true,
        cancelButtonText: "关闭",
        showConfirmButton: false,
        html: Tools.safeHTML(html),
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
    genBasics() {
      const confs = [
        { name: "speed", text: "禁用 倍速调节", cache: Storage.DISABLE_SPEED, attrs: ["send", "delay"] },
        { name: "memory", text: "禁用 记忆倍速", cache: Storage.NOT_CACHE_SPEED, attrs: ["send"] },
        { name: "prog", text: "禁用 记忆进度", cache: Storage.NOT_CACHE_TIME },
        { name: "tabs", text: "禁用 不可见暂停", cache: Storage.IS_INVISIBLE_PAUSE },
        { name: "try", text: "禁用 尝试自动播放", cache: Storage.DISABLE_TRY_PLAY },
        { name: "next", text: "启用 自动切换下集", cache: Storage.IS_AUTO_NEXT },
        { name: "override", text: "启用 空格◀️▶️ 控制", cache: Storage.OVERRIDE_KEY }
      ];
      const render = ({ text, name, value, dataset }) => `
        <label class="__menu">${text}
          <input name="${name}" ${value ? "checked" : ""} ${dataset} type="checkbox"/>
          <span class="toggle-track"></span>
        </label>`;
      return this.generate(confs, render);
    },
    genAssist() {
      const confs = [
        { name: "autoDef", text: "禁用 默认自动", cache: Storage.NO_AUTO_DEF },
        { name: "shot", text: "禁用 视频截图", cache: Storage.DISABLE_SCREENSHOT },
        { name: "zoom", text: "禁用 缩放移动", cache: Storage.DISABLE_ZOOM_MOVE, attrs: ["send"] },
        { name: "clock", text: "禁用 全屏显时间", cache: Storage.DISABLE_CLOCK },
        { name: "clockAlw", text: "启用 非全屏显时间", cache: Storage.PAGE_CLOCK, attrs: ["send"] },
        { name: "rateKeep", text: "启用 左上角常显倍速", cache: Storage.RATE_KEEP_SHOW, attrs: ["send"] },
        { name: "edgeClk", text: "启用 侧边单击网页全屏", cache: Storage.ENABLE_EDGE_CLICK, attrs: ["send"] }
      ];
      const render = ({ text, name, value, dataset }) => `
        <label class="__menu">${text}
          <input name="${name}" ${value ? "checked" : ""} ${dataset} type="checkbox"/>
          <span class="toggle-track"></span>
        </label>`;
      return this.generate(confs, render);
    },
    genParams() {
      const confs = [
        { name: "step", text: "倍速步进", cache: Storage.SPEED_STEP },
        { name: "skip", text: "快进/退秒数", cache: Storage.SKIP_INTERVAL },
        { name: "zero", text: "零键快进秒数", cache: Storage.ZERO_KEY_SKIP },
        { name: "advance", text: "下集提前秒数", cache: Storage.NEXT_ADVANCE_SEC },
        { name: "days", text: "进度保存天数", cache: Storage.STORAGE_DAYS },
        { name: "percent", text: "缩放百分比", cache: Storage.ZOOM_PERCENT },
        { name: "move", text: "移动距离", cache: Storage.MOVING_DISTANCE },
        { name: "color", text: "时间颜色", cache: Storage.CLOCK_COLOR, attrs: ["send"] },
        { name: "preset", text: "常用倍速", cache: Storage.PRESET_SPEED }
      ];
      const render = ({ text, name, value, dataset }) => `
        <label class="__menu">${text}
          <input name="${name}" value="${value}" ${dataset} type="text" autocomplete="off"/>
        </label>`;
      return this.generate(confs, render);
    },
    genIgnore() {
      const disd = Site.isGmMatch() && !Site.isBiliLive();
      const confs = [
        { name: "custCtn", text: "自定义此站视频容器", cache: Storage.CUSTOM_CTN, disable: disd, useHost: true },
        { name: "hideEle", text: "此站全屏时隐藏的元素（用 , 隔开）", cache: Storage.HIDE_ELEMENTS, disable: disd, useHost: true },
        { name: "ignoreNext", text: "自动切换下集时忽略的网址（用 ; 隔开）", cache: Storage.NEXT_IGNORE_URLS },
        { name: "ignoreFs", text: "自动网页全屏时忽略的网址（用 ; 隔开）", cache: Storage.FULL_IGNORE_URLS }
      ];
      const render = ({ text, name, value, dataset, disable }) => `
        <div class="text-group"><p>${text}</p>
          <textarea name="${name}" ${dataset} ${disable ? "disabled" : ""} spellcheck="false" autocomplete="off">${value}</textarea>
        </div>`;
      return this.generate(confs, render);
    },
    generate(confs, render) {
      const finalConfs = confs.map((conf) => {
        const { cache, attrs = [], useHost } = conf;
        const host = useHost ? this.host : Consts.EMPTY;
        let dataset = attrs.map((key) => `data-${key}="true"`).join(" ");
        if (host) dataset = `${dataset} data-host="${host}"`.trim();
        return { ...conf, dataset, value: cache.get(host) };
      });
      const html = finalConfs.map((conf) => render(conf)).join(Consts.EMPTY);
      const eCache = Object.fromEntries(finalConfs.map((e) => [e.name, e.cache]));
      return { html, eCache };
    }
  };
  unsafeWindow.AUTO_WEB_FULLSCREEN = window.App = {};
  const handlers = [Listen, Keydown, Events, Control, WebFull, Automatic, Episode, Picker, Extend, Ignore, Menu];
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