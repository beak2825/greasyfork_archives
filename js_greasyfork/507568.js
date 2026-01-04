// ==UserScript==
// @name               优惠券小助手——自动显示京东（jd.com）、淘宝（taobao.com）、天猫（tmall.com）、天猫国际（tmall.hk）、唯品会（vip.com）、京东国际（jd.hk）优惠券，简洁易用！
// @name:zh            优惠券小助手——自动显示京东（jd.com）、淘宝（taobao.com）、天猫（tmall.com）、天猫国际（tmall.hk）、唯品会（vip.com）、京东国际（jd.hk）优惠券，简洁易用！
// @name:zh-TW         優惠券小助手——自動顯示京東（jd.com）、淘寶（taobao.com）、天貓（tmall.com）、天貓國際（tmall.hk）、唯品會（vip.com）、京東國際（jd.hk）優惠券，簡潔易用！
// @namespace          yiyezhiqiu
// @version            2.1.6
// @author             一叶知秋
// @description        最新简洁易用的京东（jd.com）、淘宝（taobao.com）、天猫（tmall.com）、唯品会（vip.com）优惠券小助手，自动显示隐藏优惠券，支持各大电商平台，包括京东（jd.com）、淘宝（taobao.com）、天猫（tmall.com）、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)、唯品会（vip.com），让您购物省心更省钱！
// @description:zh     最新简洁易用的京东（jd.com）、淘宝（taobao.com）、天猫（tmall.com）、唯品会（vip.com）优惠券小助手，自动显示隐藏优惠券，支持各大电商平台，包括京东（jd.com）、淘宝（taobao.com）、天猫（tmall.com）、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)、唯品会（vip.com），让您购物省心更省钱！
// @description:zh-TW  最新簡潔易用的京東（jd.com）、淘寶（taobao.com）、天貓（tmall.com）、唯品會（vip.com）優惠券小助手，自動顯示隱藏優惠券，支持各大電商平台，包括京東（jd.com）、淘寶（taobao.com）、天貓（tmall.com）、聚划算、天貓超市、天貓國際(tmall.hk)、京東國際(jd.hk)、京東圖書、京東電子書、京東工業品、京東大藥房(yiyaojd.com)、唯品會（vip.com），讓您購物省心更省錢！
// @license            None
// @icon               data:image/png;base64,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
// @homepage           https://coupon.jasonzk.com
// @match              *://*.taobao.com/*
// @match              *://*.tmall.com/*
// @match              *://*.tmall.hk/*
// @match              *://*.detail.tmall.com/*
// @match              *://*.liangxinyao.com/*
// @match              *://*.jd.com/*
// @match              *://*.jd.hk/*
// @match              *://*.yiyaojd.com/*
// @match              *://*.jingdonghealth.cn/*
// @match              *://*.jkcsjd.com/*
// @match              *://*.vip.com/*
// @match              *://*.vipglobal.hk/*
// @exclude            *://login.taobao.com/*
// @exclude            *://uland.taobao.com/*
// @exclude            *://login.tmall.com/*
// @exclude            *://pages.tmall.com/*
// @exclude            *://wq.jd.com/*
// @exclude            *://trade.jd.com/*
// @exclude            *://union.jd.com/*
// @require            https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @require            https://cdn.jsdelivr.net/npm/easyqrcodejs@4.6.1/dist/easy.qrcode.min.js
// @grant              GM.deleteValue
// @grant              GM.getValue
// @grant              GM.info
// @grant              GM.setClipboard
// @grant              GM.setValue
// @grant              GM_addStyle
// @grant              GM_deleteValue
// @grant              GM_getValue
// @grant              GM_info
// @grant              GM_openInTab
// @grant              GM_setClipboard
// @grant              GM_setValue
// @grant              unsafeWindow
// @grant              window.close
// @run-at             document-start
// @antifeature        referral-link
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/507568/%E4%BC%98%E6%83%A0%E5%88%B8%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%EF%BC%88jdcom%EF%BC%89%E3%80%81%E6%B7%98%E5%AE%9D%EF%BC%88taobaocom%EF%BC%89%E3%80%81%E5%A4%A9%E7%8C%AB%EF%BC%88tmallcom%EF%BC%89%E3%80%81%E5%A4%A9%E7%8C%AB%E5%9B%BD%E9%99%85%EF%BC%88tmallhk%EF%BC%89%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%EF%BC%88vipcom%EF%BC%89%E3%80%81%E4%BA%AC%E4%B8%9C%E5%9B%BD%E9%99%85%EF%BC%88jdhk%EF%BC%89%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E7%AE%80%E6%B4%81%E6%98%93%E7%94%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/507568/%E4%BC%98%E6%83%A0%E5%88%B8%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%EF%BC%88jdcom%EF%BC%89%E3%80%81%E6%B7%98%E5%AE%9D%EF%BC%88taobaocom%EF%BC%89%E3%80%81%E5%A4%A9%E7%8C%AB%EF%BC%88tmallcom%EF%BC%89%E3%80%81%E5%A4%A9%E7%8C%AB%E5%9B%BD%E9%99%85%EF%BC%88tmallhk%EF%BC%89%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%EF%BC%88vipcom%EF%BC%89%E3%80%81%E4%BA%AC%E4%B8%9C%E5%9B%BD%E9%99%85%EF%BC%88jdhk%EF%BC%89%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E7%AE%80%E6%B4%81%E6%98%93%E7%94%A8%EF%BC%81.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const t=document.createElement("style");t.textContent=r,document.head.append(t)})(" .oirmr34xc *,.oirmr34xc :before,.oirmr34xc :after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.oirmr34xc ::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.oirmr34xc .container{width:100%}@media (min-width: 640px){.oirmr34xc .container{max-width:640px}}@media (min-width: 768px){.oirmr34xc .container{max-width:768px}}@media (min-width: 1024px){.oirmr34xc .container{max-width:1024px}}@media (min-width: 1280px){.oirmr34xc .container{max-width:1280px}}@media (min-width: 1536px){.oirmr34xc .container{max-width:1536px}}.oirmr34xc .visible{visibility:visible}.oirmr34xc .fixed{position:fixed}.oirmr34xc .absolute{position:absolute}.oirmr34xc .relative{position:relative}.oirmr34xc .inset-0{top:0;right:0;bottom:0;left:0}.oirmr34xc .right-\\[8px\\]{right:8px}.oirmr34xc .top-\\[8px\\]{top:8px}.oirmr34xc .z-20{z-index:20}.oirmr34xc .my-\\[8px\\]{margin-top:8px;margin-bottom:8px}.oirmr34xc .mb-4{margin-bottom:1rem}.oirmr34xc .mb-\\[12px\\]{margin-bottom:12px}.oirmr34xc .mb-\\[20px\\]{margin-bottom:20px}.oirmr34xc .mb-\\[6px\\]{margin-bottom:6px}.oirmr34xc .ml-\\[-3px\\]{margin-left:-3px}.oirmr34xc .mt-\\[28px\\]{margin-top:28px}.oirmr34xc .mt-\\[8px\\]{margin-top:8px}.oirmr34xc .block{display:block}.oirmr34xc .inline-block{display:inline-block}.oirmr34xc .flex{display:flex}.oirmr34xc .grid{display:grid}.oirmr34xc .h-\\[25px\\]{height:25px}.oirmr34xc .w-\\[120px\\]{width:120px}.oirmr34xc .w-\\[25px\\]{width:25px}.oirmr34xc .w-full{width:100%}.oirmr34xc .flex-none{flex:none}.oirmr34xc .flex-grow{flex-grow:1}.oirmr34xc .transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.oirmr34xc .cursor-pointer{cursor:pointer}.oirmr34xc .grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.oirmr34xc .flex-col{flex-direction:column}.oirmr34xc .items-center{align-items:center}.oirmr34xc .justify-center{justify-content:center}.oirmr34xc .justify-between{justify-content:space-between}.oirmr34xc .gap-4{gap:1rem}.oirmr34xc .gap-5{gap:1.25rem}.oirmr34xc .gap-\\[12px\\]{gap:12px}.oirmr34xc .gap-\\[20px\\]{gap:20px}.oirmr34xc .gap-\\[4px\\]{gap:4px}.oirmr34xc .gap-\\[6px\\]{gap:6px}.oirmr34xc .overflow-auto{overflow:auto}.oirmr34xc .rounded{border-radius:.25rem}.oirmr34xc .rounded-full{border-radius:9999px}.oirmr34xc .rounded-lg{border-radius:.5rem}.oirmr34xc .rounded-md{border-radius:.375rem}.oirmr34xc .rounded-e-lg{border-start-end-radius:.5rem;border-end-end-radius:.5rem}.oirmr34xc .border{border-width:1px}.oirmr34xc .border-l-4{border-left-width:4px}.oirmr34xc .border-r-2{border-right-width:2px}.oirmr34xc .border-none{border-style:none}.oirmr34xc .border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity, 1))}.oirmr34xc .border-l-red-600{--tw-border-opacity: 1;border-left-color:rgb(220 38 38 / var(--tw-border-opacity, 1))}.oirmr34xc .bg-black{--tw-bg-opacity: 1;background-color:rgb(0 0 0 / var(--tw-bg-opacity, 1))}.oirmr34xc .bg-blue-400{--tw-bg-opacity: 1;background-color:rgb(96 165 250 / var(--tw-bg-opacity, 1))}.oirmr34xc .bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity, 1))}.oirmr34xc .bg-gray-50{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.oirmr34xc .bg-slate-100{--tw-bg-opacity: 1;background-color:rgb(241 245 249 / var(--tw-bg-opacity, 1))}.oirmr34xc .bg-transparent{background-color:transparent}.oirmr34xc .bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.oirmr34xc .bg-opacity-70{--tw-bg-opacity: .7 }.oirmr34xc .p-4{padding:1rem}.oirmr34xc .p-\\[12px\\]{padding:12px}.oirmr34xc .p-\\[16px\\]{padding:16px}.oirmr34xc .p-\\[8px\\]{padding:8px}.oirmr34xc .px-4{padding-left:1rem;padding-right:1rem}.oirmr34xc .py-2{padding-top:.5rem;padding-bottom:.5rem}.oirmr34xc .py-\\[10px\\]{padding-top:10px;padding-bottom:10px}.oirmr34xc .pl-4{padding-left:1rem}.oirmr34xc .pl-\\[10px\\]{padding-left:10px}.oirmr34xc .pr-4{padding-right:1rem}.oirmr34xc .pr-\\[40px\\]{padding-right:40px}.oirmr34xc .text-center{text-align:center}.oirmr34xc .text-2xl{font-size:1.5rem;line-height:2rem}.oirmr34xc .text-3xl{font-size:1.875rem;line-height:2.25rem}.oirmr34xc .text-\\[12px\\]{font-size:12px}.oirmr34xc .text-lg{font-size:1.125rem;line-height:1.75rem}.oirmr34xc .text-sm{font-size:.875rem;line-height:1.25rem}.oirmr34xc .font-bold{font-weight:700}.oirmr34xc .font-semibold{font-weight:600}.oirmr34xc .text-\\[\\#888\\]{--tw-text-opacity: 1;color:rgb(136 136 136 / var(--tw-text-opacity, 1))}.oirmr34xc .text-blue-500{--tw-text-opacity: 1;color:rgb(59 130 246 / var(--tw-text-opacity, 1))}.oirmr34xc .text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.oirmr34xc .text-gray-600{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.oirmr34xc .text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.oirmr34xc .text-orange-500{--tw-text-opacity: 1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.oirmr34xc .text-red-500{--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity, 1))}.oirmr34xc .text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.oirmr34xc .underline{text-decoration-line:underline}.oirmr34xc .shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.oirmr34xc .shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.oirmr34xc .filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.oirmr34xc .transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.hover\\:bg-blue-400:hover{--tw-bg-opacity: 1;background-color:rgb(96 165 250 / var(--tw-bg-opacity, 1))}.hover\\:text-gray-900:hover{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.hover\\:text-orange-600:hover{--tw-text-opacity: 1;color:rgb(234 88 12 / var(--tw-text-opacity, 1))}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.hover\\:underline:hover{text-decoration-line:underline}.focus\\:border-blue-500:focus{--tw-border-opacity: 1;border-color:rgb(59 130 246 / var(--tw-border-opacity, 1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-blue-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1)) }@media (prefers-color-scheme: dark){.dark\\:border-gray-600{--tw-border-opacity: 1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.dark\\:bg-gray-700{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.dark\\:text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.dark\\:placeholder-gray-400::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(156 163 175 / var(--tw-placeholder-opacity, 1))}.dark\\:placeholder-gray-400::placeholder{--tw-placeholder-opacity: 1;color:rgb(156 163 175 / var(--tw-placeholder-opacity, 1))}.dark\\:focus\\:border-blue-500:focus{--tw-border-opacity: 1;border-color:rgb(59 130 246 / var(--tw-border-opacity, 1))}} ");

(function (EasyQRCode, CryptoJS) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const CryptoJS__namespace = /*#__PURE__*/_interopNamespaceDefault(CryptoJS);

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
  var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
  function noop() {
  }
  function assign(tar, src) {
    for (const k in src) tar[k] = src[k];
    return (
      /** @type {T & S} */
      tar
    );
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
  }
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (element_src === url) return true;
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      for (const callback of callbacks) {
        callback(void 0);
      }
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) ;
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function stop_propagation(fn) {
    return function(event) {
      event.stopPropagation();
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.data === data) return;
    text2.data = /** @type {string} */
    data;
  }
  function set_style(node, key2, value, important) {
    if (value == null) {
      node.style.removeProperty(key2);
    } else {
      node.style.setProperty(key2, value, "");
    }
  }
  function toggle_class(element2, name, toggle) {
    element2.classList.toggle(name, !!toggle);
  }
  function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    return new CustomEvent(type, { detail, bubbles, cancelable });
  }
  function construct_svelte_component(component, props) {
    return new component(props);
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component) throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        const event = custom_event(
          /** @type {string} */
          type,
          detail,
          { cancelable }
        );
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
  }
  function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      callbacks.slice().forEach((fn) => fn.call(this, event));
    }
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length) binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
      // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2) block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
        if (ready) make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    constructor() {
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$");
      /**
       * ### PRIVATE API
       *
       * Do not use, may change at any time
       *
       * @type {any}
       */
      __publicField(this, "$$set");
    }
    /** @returns {void} */
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    /**
     * @template {Extract<keyof Events, string>} K
     * @param {K} type
     * @param {((e: Events[K]) => void) | null | undefined} callback
     * @returns {() => void}
     */
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
    /**
     * @param {Partial<Props>} props
     * @returns {void}
     */
    $set(props) {
      if (this.$$set && !is_empty(props)) {
        this.$$.skip_bound = true;
        this.$$set(props);
        this.$$.skip_bound = false;
      }
    }
  }
  const PUBLIC_VERSION = "4";
  if (typeof window !== "undefined")
    (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
  const subscriber_queue = [];
  function writable(value, start = noop) {
    let stop;
    const subscribers = /* @__PURE__ */ new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update2(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set, update2) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0 && stop) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update: update2, subscribe: subscribe2 };
  }
  function createCoupon() {
    const { subscribe: subscribe2, set, update: update2 } = writable(null);
    return {
      subscribe: subscribe2,
      updateCoupon: (data) => update2(() => data)
    };
  }
  const coupon = createCoupon();
  function create_fragment$c(ctx) {
    let div1;
    let div0;
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        ctx[6](div0);
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        ctx[6](null);
      }
    };
  }
  function instance$b($$self, $$props, $$invalidate) {
    let { url = "" } = $$props;
    let { width = 70 } = $$props;
    let { height = 70 } = $$props;
    let { logo = "" } = $$props;
    let { logoWidth = 20 } = $$props;
    let qrCodeContainer;
    onMount(() => {
      generateQRCode();
    });
    function generateQRCode() {
      if (!qrCodeContainer) return;
      $$invalidate(0, qrCodeContainer.innerHTML = "", qrCodeContainer);
      new EasyQRCode(
        qrCodeContainer,
        {
          text: url,
          width,
          height,
          logo,
          logoWidth,
          logoBackgroundTransparent: true
        }
      );
    }
    function div0_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        qrCodeContainer = $$value;
        $$invalidate(0, qrCodeContainer);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("url" in $$props2) $$invalidate(1, url = $$props2.url);
      if ("width" in $$props2) $$invalidate(2, width = $$props2.width);
      if ("height" in $$props2) $$invalidate(3, height = $$props2.height);
      if ("logo" in $$props2) $$invalidate(4, logo = $$props2.logo);
      if ("logoWidth" in $$props2) $$invalidate(5, logoWidth = $$props2.logoWidth);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*url, width, height, logo, logoWidth*/
      62) {
        if (url || width || height || logo || logoWidth) {
          generateQRCode();
        }
      }
    };
    return [qrCodeContainer, url, width, height, logo, logoWidth, div0_binding];
  }
  class QrCode extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$b, create_fragment$c, safe_not_equal, {
        url: 1,
        width: 2,
        height: 3,
        logo: 4,
        logoWidth: 5
      });
    }
  }
  var PluginType = /* @__PURE__ */ ((PluginType2) => {
    PluginType2["BASE"] = "0";
    PluginType2["COUPON"] = "1";
    PluginType2["COMPARE"] = "2";
    PluginType2["PROMOTION"] = "3";
    PluginType2["ALLINONE"] = "5";
    PluginType2["TOOL"] = "6";
    return PluginType2;
  })(PluginType || {});
  const PluginName = "3";
  const PluginClassName = "oirmr34xc";
  function create_fragment$b(ctx) {
    let div;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[2].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[1],
      null
    );
    return {
      c() {
        div = element("div");
        if (default_slot) default_slot.c();
        attr(div, "class", PluginClassName);
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (default_slot) {
          default_slot.m(div, null);
        }
        ctx[3](div);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          2)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[1],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[1]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[1],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (default_slot) default_slot.d(detaching);
        ctx[3](null);
      }
    };
  }
  function instance$a($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let ref;
    function div_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        ref = $$value;
        $$invalidate(0, ref);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("$$scope" in $$props2) $$invalidate(1, $$scope = $$props2.$$scope);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*ref*/
      1) {
        ref && document.body.appendChild(ref);
      }
    };
    return [ref, $$scope, slots, div_binding];
  }
  class Portal extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$a, create_fragment$b, safe_not_equal, {});
    }
  }
  function create_if_block$8(ctx) {
    let portal;
    let current;
    portal = new Portal({
      props: {
        $$slots: { default: [create_default_slot$2] },
        $$scope: { ctx }
      }
    });
    return {
      c() {
        create_component(portal.$$.fragment);
      },
      m(target, anchor) {
        mount_component(portal, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const portal_changes = {};
        if (dirty & /*$$scope, title*/
        34) {
          portal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        portal.$set(portal_changes);
      },
      i(local) {
        if (current) return;
        transition_in(portal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(portal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(portal, detaching);
      }
    };
  }
  function create_default_slot$2(ctx) {
    let div3;
    let div2;
    let div0;
    let p;
    let t0;
    let t1;
    let button;
    let t3;
    let div1;
    let current;
    let mounted2;
    let dispose;
    const default_slot_template = (
      /*#slots*/
      ctx[3].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[5],
      null
    );
    return {
      c() {
        div3 = element("div");
        div2 = element("div");
        div0 = element("div");
        p = element("p");
        t0 = text(
          /*title*/
          ctx[1]
        );
        t1 = space();
        button = element("button");
        button.textContent = "×";
        t3 = space();
        div1 = element("div");
        if (default_slot) default_slot.c();
        set_style(p, "margin-top", "-3px");
        attr(button, "class", "border-none cursor-pointer bg-transparent hover:text-gray-900 focus:outline-none absolute right-[8px] top-[8px] text-2xl text-gray-600");
        attr(div1, "class", "mt-[28px]");
        attr(div2, "class", "relative flex flex-col items-center justify-center rounded-lg bg-white p-[16px]");
        set_style(div2, "max-width", "90%");
        attr(div3, "class", "fixed inset-0 flex items-center justify-center bg-black bg-opacity-70");
        set_style(div3, "z-index", "99999999");
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div2);
        append(div2, div0);
        append(div0, p);
        append(p, t0);
        append(div0, t1);
        append(div0, button);
        append(div2, t3);
        append(div2, div1);
        if (default_slot) {
          default_slot.m(div1, null);
        }
        current = true;
        if (!mounted2) {
          dispose = [
            listen(
              button,
              "click",
              /*closeModal*/
              ctx[2]
            ),
            listen(div2, "click", stop_propagation(
              /*click_handler*/
              ctx[4]
            )),
            listen(
              div3,
              "click",
              /*closeModal*/
              ctx[2]
            )
          ];
          mounted2 = true;
        }
      },
      p(ctx2, dirty) {
        if (!current || dirty & /*title*/
        2) set_data(
          t0,
          /*title*/
          ctx2[1]
        );
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          32)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[5],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[5]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[5],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        if (default_slot) default_slot.d(detaching);
        mounted2 = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$a(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*show*/
      ctx[0] && create_if_block$8(ctx)
    );
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*show*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*show*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$8(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function instance$9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { show = false } = $$props;
    let { title = "微信扫码购买" } = $$props;
    const dispatch = createEventDispatcher();
    function closeModal() {
      dispatch("close");
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$props2) => {
      if ("show" in $$props2) $$invalidate(0, show = $$props2.show);
      if ("title" in $$props2) $$invalidate(1, title = $$props2.title);
      if ("$$scope" in $$props2) $$invalidate(5, $$scope = $$props2.$$scope);
    };
    return [show, title, closeModal, slots, click_handler, $$scope];
  }
  class Modal extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$9, create_fragment$a, safe_not_equal, { show: 0, title: 1 });
    }
  }
  var Platform = /* @__PURE__ */ ((Platform2) => {
    Platform2[Platform2["Tmall"] = 1] = "Tmall";
    Platform2[Platform2["JD"] = 2] = "JD";
    Platform2[Platform2["Pdd"] = 3] = "Pdd";
    Platform2[Platform2["Vip"] = 4] = "Vip";
    Platform2[Platform2["None"] = 5] = "None";
    Platform2[Platform2["Dev"] = 6] = "Dev";
    Platform2[Platform2["ZK"] = 7] = "ZK";
    return Platform2;
  })(Platform || {});
  let platform = null;
  function getPlatform() {
    return platform;
  }
  function setPlatform(value) {
    platform = value;
  }
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const isAsyncAPIAvailable = (fn) => typeof _GM !== "undefined" && typeof _GM[fn] === "function";
  async function getGMValue(key2, initialValue) {
    if (isAsyncAPIAvailable("getValue")) {
      return await _GM.getValue(key2, initialValue);
    } else if (_GM_getValue) {
      return _GM_getValue(key2, initialValue);
    } else {
      console.warn("GM_getValue or GM.getValue is not available.");
      return initialValue;
    }
  }
  async function setGMValue(key2, value) {
    if (isAsyncAPIAvailable("setValue")) {
      await _GM.setValue(key2, value);
    } else if (_GM_setValue) {
      _GM_setValue(key2, value);
    } else {
      console.warn("GM_setValue or GM.setValue is not available.");
    }
  }
  async function deleteGMValue(key2) {
    if (isAsyncAPIAvailable("deleteValue")) {
      await _GM.deleteValue(key2);
    } else if (_GM_deleteValue) {
      _GM_deleteValue(key2);
    } else {
      console.warn("GM_deleteValue or GM.deleteValue is not available.");
    }
  }
  async function openNewTab(url, active = true) {
    if (_GM_openInTab) {
      _GM_openInTab(url, { active });
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  async function setClipboard(text2, callback) {
    if (isAsyncAPIAvailable("setClipboard")) {
      await _GM.setClipboard(text2, "text");
      callback == null ? void 0 : callback();
    } else if (_GM_setClipboard) {
      _GM_setClipboard(text2, "text", callback);
    } else {
      console.warn("GM_setClipboard or GM.setClipboard is not available.");
    }
  }
  async function openWindow(url) {
    await openNewTab(url);
  }
  async function copy(text2, callback) {
    const flag = !!_GM_setClipboard;
    if (flag) {
      await setClipboard(text2, callback);
    } else {
      navigator.clipboard.writeText(text2).then(callback).catch((error) => {
        console.error("Failed to copy text:", error);
      });
    }
  }
  function initPlatform() {
    const host = window.location.host;
    let pf = Platform.None;
    if (host.includes("jd.") || host.includes("jingdonghealth")) {
      pf = Platform.JD;
    } else if (host.includes("tmall.") || host.includes("taobao.") || host.includes("liangxinyao.com")) {
      pf = Platform.Tmall;
    } else if (host.includes("vip.") || host.includes(".vip")) {
      pf = Platform.Vip;
    } else if (host.includes("pinduoduo.")) {
      pf = Platform.Pdd;
    } else if (host.includes("jasonzk.")) {
      pf = Platform.ZK;
    } else if (host.includes("localhost")) {
      pf = Platform.Dev;
    }
    setPlatform(pf);
    return pf;
  }
  function getPlatformLogo(platform2) {
    switch (platform2) {
      case Platform.Tmall:
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABE0lEQVRIS2P8r6XF9uLGjcp/DAwxjAwMCv8ZGFgYqAgYGRj+/GdgeMDEwLBEQkOjnfEpC0sDw79/9VS0A6dRTAwMDYxPmZhuMzAwqNDDQgYGhjuMz5iYflM7GHE5HhS8IB/+p5PvwNYMDgsFly5lYLWwwOpxJhERBkZ2drDc/58/Gf69eYNV3e8TJxjeR0djyGH1ofDevQzsDg4UhfTPAwcY3jo7D1ILecrKGFjU1bH6kN3dnYFZUhIs9/f5c4afO3diVffn5k2GL11dxPkQX1giBzeuYMOnn+RUOmohoaQ9GqQYITSaaEYTzWi2wEgDyDUJrhoBb+E9EI0o+jYTnzMx1f9jYGgglH+oIQ9uCNO7qQ8Aj+XKFcR3kJwAAAAASUVORK5CYII=";
      case Platform.JD:
        return "data:image/png;base64,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";
      case Platform.Pdd:
        return "data:image/png;base64,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";
      case Platform.Vip:
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAFZElEQVR42mWWW4id1RXHf2t/35xJnLSStqaiYhOmaWIvtqTTVii9aUGaFEpLrZS2UlBffNQXES8oQXwVFV/0QfRFJSJe0eiDRsS7eE0cjXclmURjJpmcmZxvr78nszbfRt2w+PbZa+/13+u/LvsYgM69ZQPYtbjOBqaQwAAnhgQYSP3UBAgkAWWOMEE9KwxbkPQIyS4D3jKde+uPcH9IYtqES0pGGDIKCIAquGQYFYhv6ONsuYwjErA7edrcMspbEdOITlJbMEAgHFQWqEaNYlQCVSxU96gaSYLOxHQmb23J2hxK2qDLsGQIgQwzgALqQu4wckgJT8TeLnQAJMPCUE+xQRsXtM2tsqZQodAMLSyipUyNCwHWNrCiBQw779fw4xOxvfP4TU9hG07A/v1L9O5+uO155FDprbkgfKpV58UPoexwziZs08kw7MALdRMN7JlHtz47BvsV9t8ZGGX8ul3w/gH47TpsLKw+Dr/56WDAQI1B02D0CaaWLBOE+1nY6SdhZ6wDV6XHDH1yEJqE/f10APTpPLb2O3Dl2di68RdgzSrSxX+Miw8aeOFj2D6L2gQCJGtxKBwsb7TFLuazc2jbK/CLk0lbfoJ9dwr728+WQZGwH6xG/5vBAKOM703B5tNIWWjVJBp2+MO7+jKSi1bZa5rlmor66Av8+h3YeTMwBlyO34Ej6GjGvv8t/L7X8asfBUG67CzSP3+OXvmUfNE2rBOycMRSgq7Wa1In5EI5YihBaBKsHGBtAwCHlshjAL30MUDEabFDSx1kBwAXjDLqMnQOo7B5TCgYCRd0RbJA9Ic1ctSFMX22gL+2JyiFANt/BI7JMMJg2eHzYch4XfNLkCnORI60uMABQoGLfizfTtXjiQbMwvjMKTTXbYksPuNUABgnUbr0zLj4oEFv7MUf3NmfkUSrkcAACesqGBLqhLn634S3Abj+BGzDGqAOGydNc8Fv+gz3R2fJ972JGRUQV1/h7iL1AMDXPFb2HtSffJd8y3OYQfr/DOms9fjsPvI1j0H2oH7fEcwBU580LVm1y9cYIini59SRASn0H36B3/8mYPCHaRLAgSH+xHsBaAYJbKJFoseIsqDY6Qog1UPlr3tMDBWdCVT30MW6oeg0SYiqb79ya6+A9g1KyxwL/SnH0/xlIxLYqasB4PgV2O/WYoVS5hbQO/uLPUMoPKweeAWXygUMIL5ZUH6mP/1wOW5QRzptDYO7/tMnTX5gJ6Pzty3PJYWH5tSunsuXmJNHaGGpUujVY981F/ESpN+vJf30RDR3mO6Ol7HOUZPQq3sgg2qm03rnGLUOe8TjBrDxJJo/ry86R0dzf9h3fMBo3MYEDG74RwCOG3p3xXY4ts8MaxOsnAiTAuuztCZFFDfQnDlNs/MSyAXg9T3ow4O9nkHCJleElcmmNodx02aUMTNwQRYmENQ6lISVGGrvYTS/CIePBvefD/HH3yHf+AyIyoBZPDt1FJ0VAUGAigIqbLhmqyMMK1y3ifIEhWShQ0exZDCRGNz+L5q/box1A0ToylwHh8HKqgHdna8xuvDeKA/AJLVyN2Qg1abs9V+XGdhkC5RGkOKwv70PvTEXFJdXxiAuLMFku5w0cg9bgIS1ZBaQTyGjnjL6IdAox5pDd9Oz5O27yTvex1/8BBs0yMEQKlYRIUawlQuabMEWvn31XUjnAB2irbGgHkT9XbQ4AhxSi7UJ1T0giz21lmPNVGzb3W0Sl3vWJonp8EEpvA1g9QEuBgYT9b3M1ZuCEEel2pGQS7QGu8EuTysPXTWLNVuSuIfMsH/5PQQnYpePSTzKjKX0zABWEWodG+WLDQ27x2i2GDb7JcYo/09XdwlHAAAAAElFTkSuQmCC";
    }
  }
  function getLogoWidth(platform2, rate = 1) {
    switch (platform2) {
      case Platform.Tmall:
        return 15 * rate;
      case Platform.JD:
        return 20 * rate;
      case Platform.Vip:
        return 15 * rate;
      case Platform.Pdd:
        return 30 * rate;
      default:
        return 20 * rate;
    }
  }
  function getPlatformName(platform2) {
    switch (platform2) {
      case Platform.Tmall:
        return "淘宝";
      case Platform.JD:
        return "京东";
      case Platform.Vip:
        return "唯品会";
      case Platform.Pdd:
        return "拼多多";
      default:
        return "";
    }
  }
  function create_if_block_1$3(ctx) {
    let div;
    let t0;
    let t1;
    return {
      c() {
        div = element("div");
        t0 = text("剩余：");
        t1 = text(
          /*remainCount*/
          ctx[4]
        );
        attr(div, "class", "text-md");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t0);
        append(div, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*remainCount*/
        16) set_data(
          t1,
          /*remainCount*/
          ctx2[4]
        );
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_if_block$7(ctx) {
    let div;
    let t0;
    let t1;
    return {
      c() {
        div = element("div");
        t0 = text("有效期至：");
        t1 = text(
          /*couponEndTime*/
          ctx[2]
        );
        attr(div, "class", "text-md");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t0);
        append(div, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*couponEndTime*/
        4) set_data(
          t1,
          /*couponEndTime*/
          ctx2[2]
        );
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_default_slot$1(ctx) {
    let qrcode;
    let current;
    qrcode = new QrCode({
      props: {
        url: (
          /*url*/
          ctx[3]
        ),
        width: 250,
        height: 250,
        logo: getPlatformLogo(
          /*platform*/
          ctx[7]
        ),
        logoWidth: getLogoWidth(
          /*platform*/
          ctx[7],
          2
        )
      }
    });
    return {
      c() {
        create_component(qrcode.$$.fragment);
      },
      m(target, anchor) {
        mount_component(qrcode, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const qrcode_changes = {};
        if (dirty & /*url*/
        8) qrcode_changes.url = /*url*/
        ctx2[3];
        qrcode.$set(qrcode_changes);
      },
      i(local) {
        if (current) return;
        transition_in(qrcode.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(qrcode.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(qrcode, detaching);
      }
    };
  }
  function create_fragment$9(ctx) {
    let div8;
    let div4;
    let div0;
    let t0;
    let div1;
    let t1;
    let div2;
    let t2;
    let t3;
    let t4;
    let div3;
    let t5;
    let t6;
    let div6;
    let div5;
    let t7;
    let t8;
    let t9;
    let t10;
    let t11;
    let div7;
    let qrcode;
    let t12;
    let modal;
    let current;
    let mounted2;
    let dispose;
    let if_block0 = (
      /*remainCount*/
      ctx[4] != null && /*remainCount*/
      ctx[4] > 0 && create_if_block_1$3(ctx)
    );
    let if_block1 = (
      /*couponEndTime*/
      ctx[2] && /*couponEndTime*/
      ctx[2] != "" && create_if_block$7(ctx)
    );
    qrcode = new QrCode({
      props: {
        url: (
          /*url*/
          ctx[3]
        ),
        logo: getPlatformLogo(
          /*platform*/
          ctx[7]
        ),
        logoWidth: getLogoWidth(
          /*platform*/
          ctx[7],
          0.8
        )
      }
    });
    modal = new Modal({
      props: {
        show: (
          /*showModal*/
          ctx[6]
        ),
        title: (
          /*modalTitle*/
          ctx[5]
        ),
        $$slots: { default: [create_default_slot$1] },
        $$scope: { ctx }
      }
    });
    modal.$on(
      "close",
      /*close_handler*/
      ctx[10]
    );
    return {
      c() {
        div8 = element("div");
        div4 = element("div");
        div0 = element("div");
        t0 = space();
        div1 = element("div");
        t1 = space();
        div2 = element("div");
        t2 = text("¥");
        t3 = text(
          /*couponAmount*/
          ctx[0]
        );
        t4 = space();
        div3 = element("div");
        t5 = text(
          /*couponInfo*/
          ctx[1]
        );
        t6 = space();
        div6 = element("div");
        div5 = element("div");
        t7 = text(
          /*couponAmount*/
          ctx[0]
        );
        t8 = text("元优惠券");
        t9 = space();
        if (if_block0) if_block0.c();
        t10 = space();
        if (if_block1) if_block1.c();
        t11 = space();
        div7 = element("div");
        create_component(qrcode.$$.fragment);
        t12 = space();
        create_component(modal.$$.fragment);
        attr(div0, "class", "absolute h-[25px] w-[25px] rounded-full border bg-slate-100");
        set_style(div0, "border-bottom", "transparent");
        set_style(div0, "border-right", "transparent");
        set_style(div0, "transform", "rotate(-135deg)");
        set_style(div0, "right", "-12.5px");
        set_style(div0, "top", "-25px");
        attr(div1, "class", "absolute h-[25px] w-[25px] rounded-full border bg-slate-100");
        set_style(div1, "border-bottom", "transparent");
        set_style(div1, "border-right", "transparent");
        set_style(div1, "transform", "rotate(45deg)");
        set_style(div1, "right", "-12.5px");
        set_style(div1, "bottom", "-25px");
        attr(div2, "class", "text-3xl font-bold text-red-500");
        attr(div3, "class", "text-gray-500");
        attr(div4, "class", "relative w-[120px] flex-none border-r-2 pr-4 text-center");
        set_style(div4, "border-right-style", "dotted");
        attr(div5, "class", "text-lg font-semibold");
        attr(div6, "class", "flex flex-grow flex-col gap-[4px] pl-4");
        attr(div7, "class", "zk-flex zk-cursor-pointer zk-flex-col zk-items-center zk-gap-[8px]");
        attr(div7, "title", "官方商品二维码，安全无毒，点击可放大");
        attr(div8, "class", "flex cursor-pointer rounded-lg border border-l-4 border-l-red-600 bg-white p-4");
      },
      m(target, anchor) {
        insert(target, div8, anchor);
        append(div8, div4);
        append(div4, div0);
        append(div4, t0);
        append(div4, div1);
        append(div4, t1);
        append(div4, div2);
        append(div2, t2);
        append(div2, t3);
        append(div4, t4);
        append(div4, div3);
        append(div3, t5);
        append(div8, t6);
        append(div8, div6);
        append(div6, div5);
        append(div5, t7);
        append(div5, t8);
        append(div6, t9);
        if (if_block0) if_block0.m(div6, null);
        append(div6, t10);
        if (if_block1) if_block1.m(div6, null);
        append(div8, t11);
        append(div8, div7);
        mount_component(qrcode, div7, null);
        append(div8, t12);
        mount_component(modal, div8, null);
        current = true;
        if (!mounted2) {
          dispose = [
            listen(
              div7,
              "click",
              /*handleShowQrCode*/
              ctx[9]
            ),
            listen(
              div8,
              "click",
              /*handleClick*/
              ctx[8]
            )
          ];
          mounted2 = true;
        }
      },
      p(ctx2, [dirty]) {
        if (!current || dirty & /*couponAmount*/
        1) set_data(
          t3,
          /*couponAmount*/
          ctx2[0]
        );
        if (!current || dirty & /*couponInfo*/
        2) set_data(
          t5,
          /*couponInfo*/
          ctx2[1]
        );
        if (!current || dirty & /*couponAmount*/
        1) set_data(
          t7,
          /*couponAmount*/
          ctx2[0]
        );
        if (
          /*remainCount*/
          ctx2[4] != null && /*remainCount*/
          ctx2[4] > 0
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_1$3(ctx2);
            if_block0.c();
            if_block0.m(div6, t10);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*couponEndTime*/
          ctx2[2] && /*couponEndTime*/
          ctx2[2] != ""
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block$7(ctx2);
            if_block1.c();
            if_block1.m(div6, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        const qrcode_changes = {};
        if (dirty & /*url*/
        8) qrcode_changes.url = /*url*/
        ctx2[3];
        qrcode.$set(qrcode_changes);
        const modal_changes = {};
        if (dirty & /*showModal*/
        64) modal_changes.show = /*showModal*/
        ctx2[6];
        if (dirty & /*modalTitle*/
        32) modal_changes.title = /*modalTitle*/
        ctx2[5];
        if (dirty & /*$$scope, url*/
        2056) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current) return;
        transition_in(qrcode.$$.fragment, local);
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(qrcode.$$.fragment, local);
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div8);
        }
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        destroy_component(qrcode);
        destroy_component(modal);
        mounted2 = false;
        run_all(dispose);
      }
    };
  }
  function instance$8($$self, $$props, $$invalidate) {
    let { couponAmount = 5 } = $$props;
    let { couponInfo = "满100可用" } = $$props;
    let { couponEndTime = "" } = $$props;
    let { url = "" } = $$props;
    let { remainCount = 0 } = $$props;
    let modalTitle = "";
    let showModal = false;
    const platform2 = getPlatform();
    const handleClick = () => {
      var _a;
      if (Platform.Vip == platform2) {
        (_a = document.querySelector(".J-getCouponBtn")) == null ? void 0 : _a.click();
        return;
      }
      if (url) {
        openWindow(url);
        window.close();
      }
    };
    function handleShowQrCode(e) {
      e.stopPropagation();
      if (platform2 == Platform.Tmall) {
        $$invalidate(5, modalTitle = "天猫/淘宝APP扫码购买");
      } else {
        $$invalidate(5, modalTitle = `微信扫码，${getPlatformName(platform2)}购买`);
      }
      $$invalidate(6, showModal = true);
    }
    const close_handler = () => $$invalidate(6, showModal = false);
    $$self.$$set = ($$props2) => {
      if ("couponAmount" in $$props2) $$invalidate(0, couponAmount = $$props2.couponAmount);
      if ("couponInfo" in $$props2) $$invalidate(1, couponInfo = $$props2.couponInfo);
      if ("couponEndTime" in $$props2) $$invalidate(2, couponEndTime = $$props2.couponEndTime);
      if ("url" in $$props2) $$invalidate(3, url = $$props2.url);
      if ("remainCount" in $$props2) $$invalidate(4, remainCount = $$props2.remainCount);
    };
    return [
      couponAmount,
      couponInfo,
      couponEndTime,
      url,
      remainCount,
      modalTitle,
      showModal,
      platform2,
      handleClick,
      handleShowQrCode,
      close_handler
    ];
  }
  class Coupon extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$8, create_fragment$9, safe_not_equal, {
        couponAmount: 0,
        couponInfo: 1,
        couponEndTime: 2,
        url: 3,
        remainCount: 4
      });
    }
  }
  function create_if_block$6(ctx) {
    let div;
    let img;
    let img_src_value;
    let img_title_value;
    let img_alt_value;
    return {
      c() {
        div = element("div");
        img = element("img");
        if (!src_url_equal(img.src, img_src_value = /*activityItem*/
        ctx[0].img)) attr(img, "src", img_src_value);
        attr(img, "title", img_title_value = /*activityItem*/
        ctx[0].title);
        attr(img, "alt", img_alt_value = /*activityItem*/
        ctx[0].title);
        attr(img, "width", "98%");
        toggle_class(
          div,
          "cursor-pointer",
          /*activityItem*/
          ctx[0].url && /*activityItem*/
          ctx[0].url != ""
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
      },
      p(ctx2, dirty) {
        if (dirty & /*activityItem*/
        1 && !src_url_equal(img.src, img_src_value = /*activityItem*/
        ctx2[0].img)) {
          attr(img, "src", img_src_value);
        }
        if (dirty & /*activityItem*/
        1 && img_title_value !== (img_title_value = /*activityItem*/
        ctx2[0].title)) {
          attr(img, "title", img_title_value);
        }
        if (dirty & /*activityItem*/
        1 && img_alt_value !== (img_alt_value = /*activityItem*/
        ctx2[0].title)) {
          attr(img, "alt", img_alt_value);
        }
        if (dirty & /*activityItem*/
        1) {
          toggle_class(
            div,
            "cursor-pointer",
            /*activityItem*/
            ctx2[0].url && /*activityItem*/
            ctx2[0].url != ""
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_fragment$8(ctx) {
    let if_block_anchor;
    let if_block = (
      /*activityItem*/
      ctx[0] && create_if_block$6(ctx)
    );
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, [dirty]) {
        if (
          /*activityItem*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$6(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function instance$7($$self, $$props, $$invalidate) {
    let { activityItem = null } = $$props;
    const platform2 = null;
    $$self.$$set = ($$props2) => {
      if ("activityItem" in $$props2) $$invalidate(0, activityItem = $$props2.activityItem);
    };
    return [activityItem, platform2];
  }
  class ActivityImg extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$8, safe_not_equal, { activityItem: 0, platform: 1 });
    }
    get platform() {
      return this.$$.ctx[1];
    }
  }
  function create_if_block$5(ctx) {
    let div3;
    let img;
    let img_src_value;
    let img_title_value;
    let img_alt_value;
    let t0;
    let div2;
    let div1;
    let div0;
    let h4;
    let t1_value = (
      /*activityItem*/
      ctx[0].title + ""
    );
    let t1;
    let t2;
    let t3;
    let t4;
    let current;
    let if_block0 = (
      /*activityItem*/
      ctx[0].desc && /*activityItem*/
      ctx[0].desc != "" && create_if_block_3(ctx)
    );
    let if_block1 = (
      /*activityItem*/
      ctx[0].activity_date && /*activityItem*/
      ctx[0].activity_date != "" && create_if_block_2(ctx)
    );
    let if_block2 = (
      /*activityItem*/
      ctx[0].short_url && /*activityItem*/
      ctx[0].short_url != "" && create_if_block_1$2(ctx)
    );
    return {
      c() {
        div3 = element("div");
        img = element("img");
        t0 = space();
        div2 = element("div");
        div1 = element("div");
        div0 = element("div");
        h4 = element("h4");
        t1 = text(t1_value);
        t2 = space();
        if (if_block0) if_block0.c();
        t3 = space();
        if (if_block1) if_block1.c();
        t4 = space();
        if (if_block2) if_block2.c();
        if (!src_url_equal(img.src, img_src_value = /*activityItem*/
        ctx[0].img)) attr(img, "src", img_src_value);
        attr(img, "title", img_title_value = /*activityItem*/
        ctx[0].title);
        attr(img, "alt", img_alt_value = /*activityItem*/
        ctx[0].title);
        attr(img, "width", "98%");
        attr(h4, "class", "mb-[6px] font-bold");
        attr(div1, "class", "flex items-center justify-between gap-[12px]");
        attr(div2, "class", "mt-[8px] w-full");
        toggle_class(
          div3,
          "cursor-pointer",
          /*activityItem*/
          ctx[0].url && /*activityItem*/
          ctx[0].url != ""
        );
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, img);
        append(div3, t0);
        append(div3, div2);
        append(div2, div1);
        append(div1, div0);
        append(div0, h4);
        append(h4, t1);
        append(div0, t2);
        if (if_block0) if_block0.m(div0, null);
        append(div0, t3);
        if (if_block1) if_block1.m(div0, null);
        append(div1, t4);
        if (if_block2) if_block2.m(div1, null);
        current = true;
      },
      p(ctx2, dirty) {
        if (!current || dirty & /*activityItem*/
        1 && !src_url_equal(img.src, img_src_value = /*activityItem*/
        ctx2[0].img)) {
          attr(img, "src", img_src_value);
        }
        if (!current || dirty & /*activityItem*/
        1 && img_title_value !== (img_title_value = /*activityItem*/
        ctx2[0].title)) {
          attr(img, "title", img_title_value);
        }
        if (!current || dirty & /*activityItem*/
        1 && img_alt_value !== (img_alt_value = /*activityItem*/
        ctx2[0].title)) {
          attr(img, "alt", img_alt_value);
        }
        if ((!current || dirty & /*activityItem*/
        1) && t1_value !== (t1_value = /*activityItem*/
        ctx2[0].title + "")) set_data(t1, t1_value);
        if (
          /*activityItem*/
          ctx2[0].desc && /*activityItem*/
          ctx2[0].desc != ""
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_3(ctx2);
            if_block0.c();
            if_block0.m(div0, t3);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*activityItem*/
          ctx2[0].activity_date && /*activityItem*/
          ctx2[0].activity_date != ""
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_2(ctx2);
            if_block1.c();
            if_block1.m(div0, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
        if (
          /*activityItem*/
          ctx2[0].short_url && /*activityItem*/
          ctx2[0].short_url != ""
        ) {
          if (if_block2) {
            if_block2.p(ctx2, dirty);
            if (dirty & /*activityItem*/
            1) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block_1$2(ctx2);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(div1, null);
          }
        } else if (if_block2) {
          group_outros();
          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });
          check_outros();
        }
        if (!current || dirty & /*activityItem*/
        1) {
          toggle_class(
            div3,
            "cursor-pointer",
            /*activityItem*/
            ctx2[0].url && /*activityItem*/
            ctx2[0].url != ""
          );
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block2);
        current = true;
      },
      o(local) {
        transition_out(if_block2);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        if (if_block2) if_block2.d();
      }
    };
  }
  function create_if_block_3(ctx) {
    let p;
    let t_value = (
      /*activityItem*/
      ctx[0].desc + ""
    );
    let t;
    return {
      c() {
        p = element("p");
        t = text(t_value);
        attr(p, "class", "my-[8px] text-[12px]");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*activityItem*/
        1 && t_value !== (t_value = /*activityItem*/
        ctx2[0].desc + "")) set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_if_block_2(ctx) {
    let p;
    let t_value = (
      /*activityItem*/
      ctx[0].activity_date + ""
    );
    let t;
    return {
      c() {
        p = element("p");
        t = text(t_value);
        attr(p, "class", "text-[12px]");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, t);
      },
      p(ctx2, dirty) {
        if (dirty & /*activityItem*/
        1 && t_value !== (t_value = /*activityItem*/
        ctx2[0].activity_date + "")) set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let qrcode;
    let current;
    qrcode = new QrCode({
      props: {
        url: (
          /*activityItem*/
          ctx[0].short_url
        ),
        width: 100,
        height: 100,
        logo: getPlatformLogo(
          /*platform*/
          ctx[1]
        ),
        logoWidth: getLogoWidth(
          /*platform*/
          ctx[1]
        )
      }
    });
    return {
      c() {
        create_component(qrcode.$$.fragment);
      },
      m(target, anchor) {
        mount_component(qrcode, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const qrcode_changes = {};
        if (dirty & /*activityItem*/
        1) qrcode_changes.url = /*activityItem*/
        ctx2[0].short_url;
        if (dirty & /*platform*/
        2) qrcode_changes.logo = getPlatformLogo(
          /*platform*/
          ctx2[1]
        );
        if (dirty & /*platform*/
        2) qrcode_changes.logoWidth = getLogoWidth(
          /*platform*/
          ctx2[1]
        );
        qrcode.$set(qrcode_changes);
      },
      i(local) {
        if (current) return;
        transition_in(qrcode.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(qrcode.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(qrcode, detaching);
      }
    };
  }
  function create_fragment$7(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*activityItem*/
      ctx[0] && create_if_block$5(ctx)
    );
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*activityItem*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*activityItem*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$5(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    let { activityItem = null } = $$props;
    let { platform: platform2 } = $$props;
    $$self.$$set = ($$props2) => {
      if ("activityItem" in $$props2) $$invalidate(0, activityItem = $$props2.activityItem);
      if ("platform" in $$props2) $$invalidate(1, platform2 = $$props2.platform);
    };
    return [activityItem, platform2];
  }
  class ActivityImgText extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$7, safe_not_equal, { activityItem: 0, platform: 1 });
    }
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_if_block$4(ctx) {
    var _a;
    let div1;
    let h3;
    let t0_value = (
      /*activityItem*/
      ctx[0].title + ""
    );
    let t0;
    let t1;
    let p;
    let t2_value = (
      /*activityItem*/
      (ctx[0].desc ?? "使用说明：点击复制，复制口令后打开对应平台app搜索即可") + ""
    );
    let t2;
    let t3;
    let div0;
    let each_value = ensure_array_like(
      /*activityItem*/
      (_a = ctx[0]) == null ? void 0 : _a.list
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    }
    return {
      c() {
        div1 = element("div");
        h3 = element("h3");
        t0 = text(t0_value);
        t1 = space();
        p = element("p");
        t2 = text(t2_value);
        t3 = space();
        div0 = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(h3, "class", "mb-[12px] text-center");
        attr(p, "class", "mb-[20px] text-center text-[12px] text-[#888]");
        set_style(div0, "width", "80%");
        set_style(div0, "margin", "0 auto");
        attr(div1, "class", "flex w-full flex-col justify-center");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, h3);
        append(h3, t0);
        append(div1, t1);
        append(div1, p);
        append(p, t2);
        append(div1, t3);
        append(div1, div0);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div0, null);
          }
        }
      },
      p(ctx2, dirty) {
        var _a2;
        if (dirty & /*activityItem*/
        1 && t0_value !== (t0_value = /*activityItem*/
        ctx2[0].title + "")) set_data(t0, t0_value);
        if (dirty & /*activityItem*/
        1 && t2_value !== (t2_value = /*activityItem*/
        (ctx2[0].desc ?? "使用说明：点击复制，复制口令后打开对应平台app搜索即可") + "")) set_data(t2, t2_value);
        if (dirty & /*handleCopy, activityItem, handleGo*/
        7) {
          each_value = ensure_array_like(
            /*activityItem*/
            (_a2 = ctx2[0]) == null ? void 0 : _a2.list
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$2(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div0, null);
            }
          }
          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }
          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_each_block$2(ctx) {
    let p;
    let span0;
    let t0_value = (
      /*item*/
      ctx[4] + ""
    );
    let t0;
    let t1;
    let span1;
    let t3;
    let mounted2;
    let dispose;
    return {
      c() {
        p = element("p");
        span0 = element("span");
        t0 = text(t0_value);
        t1 = space();
        span1 = element("span");
        span1.textContent = "（复制）";
        t3 = space();
        toggle_class(
          span0,
          "text-blue-500",
          /*item*/
          ctx[4].startsWith("https")
        );
        toggle_class(
          span0,
          "cursor-pointer",
          /*item*/
          ctx[4].startsWith("https")
        );
        attr(span1, "class", "ml-[-3px] cursor-pointer text-blue-500 hover:underline");
        attr(p, "class", "my-[8px]");
      },
      m(target, anchor) {
        insert(target, p, anchor);
        append(p, span0);
        append(span0, t0);
        append(p, t1);
        append(p, span1);
        append(p, t3);
        if (!mounted2) {
          dispose = [
            listen(span0, "click", function() {
              if (is_function(
                /*handleGo*/
                ctx[1](
                  /*item*/
                  ctx[4]
                )
              )) ctx[1](
                /*item*/
                ctx[4]
              ).apply(this, arguments);
            }),
            listen(span1, "click", function() {
              if (is_function(
                /*handleCopy*/
                ctx[2](
                  /*item*/
                  ctx[4]
                )
              )) ctx[2](
                /*item*/
                ctx[4]
              ).apply(this, arguments);
            })
          ];
          mounted2 = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*activityItem*/
        1 && t0_value !== (t0_value = /*item*/
        ctx[4] + "")) set_data(t0, t0_value);
        if (dirty & /*activityItem*/
        1) {
          toggle_class(
            span0,
            "text-blue-500",
            /*item*/
            ctx[4].startsWith("https")
          );
        }
        if (dirty & /*activityItem*/
        1) {
          toggle_class(
            span0,
            "cursor-pointer",
            /*item*/
            ctx[4].startsWith("https")
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(p);
        }
        mounted2 = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment$6(ctx) {
    let if_block_anchor;
    let if_block = (
      /*activityItem*/
      ctx[0] && /*activityItem*/
      ctx[0].list && /*activityItem*/
      ctx[0].list.length > 0 && create_if_block$4(ctx)
    );
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p(ctx2, [dirty]) {
        if (
          /*activityItem*/
          ctx2[0] && /*activityItem*/
          ctx2[0].list && /*activityItem*/
          ctx2[0].list.length > 0
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$4(ctx2);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function instance$5($$self, $$props, $$invalidate) {
    let { activityItem = null } = $$props;
    const platform2 = null;
    function handleGo(url) {
      return () => {
        if (url.startsWith("https")) {
          openWindow(url);
        }
      };
    }
    function handleCopy(text2) {
      return () => {
        copy(text2, () => {
          window.alert("复制成功，温馨提示：粘贴到微信，手机打开领取更方便哦~");
        });
      };
    }
    $$self.$$set = ($$props2) => {
      if ("activityItem" in $$props2) $$invalidate(0, activityItem = $$props2.activityItem);
    };
    return [activityItem, handleGo, handleCopy, platform2];
  }
  class ActivityText extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$6, safe_not_equal, { activityItem: 0, platform: 3 });
    }
    get platform() {
      return this.$$.ctx[3];
    }
  }
  var ActivityType = /* @__PURE__ */ ((ActivityType2) => {
    ActivityType2["TEXT"] = "text";
    ActivityType2["IMG"] = "img";
    ActivityType2["IMAGETEXT"] = "imgtext";
    return ActivityType2;
  })(ActivityType || {});
  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_if_block$3(ctx) {
    let div;
    let switch_instance;
    let t;
    let current;
    let mounted2;
    let dispose;
    var switch_value = (
      /*getComponent*/
      ctx[2](
        /*item*/
        ctx[4].type
      )
    );
    function switch_props(ctx2, dirty) {
      return {
        props: {
          activityItem: (
            /*item*/
            ctx2[4]
          ),
          platform: (
            /*platform*/
            ctx2[1]
          )
        }
      };
    }
    if (switch_value) {
      switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
    }
    return {
      c() {
        div = element("div");
        if (switch_instance) create_component(switch_instance.$$.fragment);
        t = space();
        attr(div, "class", "flex flex-col items-center justify-center rounded-md p-[8px] shadow");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (switch_instance) mount_component(switch_instance, div, null);
        append(div, t);
        current = true;
        if (!mounted2) {
          dispose = listen(div, "click", function() {
            if (is_function(
              /*handleGo*/
              ctx[3](
                /*item*/
                ctx[4]
              )
            )) ctx[3](
              /*item*/
              ctx[4]
            ).apply(this, arguments);
          });
          mounted2 = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*data*/
        1 && switch_value !== (switch_value = /*getComponent*/
        ctx[2](
          /*item*/
          ctx[4].type
        ))) {
          if (switch_instance) {
            group_outros();
            const old_component = switch_instance;
            transition_out(old_component.$$.fragment, 1, 0, () => {
              destroy_component(old_component, 1);
            });
            check_outros();
          }
          if (switch_value) {
            switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
            create_component(switch_instance.$$.fragment);
            transition_in(switch_instance.$$.fragment, 1);
            mount_component(switch_instance, div, t);
          } else {
            switch_instance = null;
          }
        } else if (switch_value) {
          const switch_instance_changes = {};
          if (dirty & /*data*/
          1) switch_instance_changes.activityItem = /*item*/
          ctx[4];
          if (dirty & /*platform*/
          2) switch_instance_changes.platform = /*platform*/
          ctx[1];
          switch_instance.$set(switch_instance_changes);
        }
      },
      i(local) {
        if (current) return;
        if (switch_instance) transition_in(switch_instance.$$.fragment, local);
        current = true;
      },
      o(local) {
        if (switch_instance) transition_out(switch_instance.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (switch_instance) destroy_component(switch_instance);
        mounted2 = false;
        dispose();
      }
    };
  }
  function create_each_block$1(ctx) {
    let show_if = (
      /*getComponent*/
      ctx[2](
        /*item*/
        ctx[4].type
      )
    );
    let if_block_anchor;
    let current;
    let if_block = show_if && create_if_block$3(ctx);
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*data*/
        1) show_if = /*getComponent*/
        ctx2[2](
          /*item*/
          ctx2[4].type
        );
        if (show_if) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*data*/
            1) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$3(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function create_fragment$5(ctx) {
    let div;
    let current;
    let each_value = ensure_array_like(
      /*data*/
      ctx[0]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "grid grid-cols-3 gap-5 p-4");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & /*handleGo, data, getComponent, platform*/
        15) {
          each_value = ensure_array_like(
            /*data*/
            ctx2[0]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    let { data = [] } = $$props;
    let { platform: platform2 } = $$props;
    function getComponent(type) {
      switch (type) {
        case ActivityType.IMG:
          return ActivityImg;
        case ActivityType.IMAGETEXT:
          return ActivityImgText;
        case ActivityType.TEXT:
          return ActivityText;
        default:
          return null;
      }
    }
    function handleGo(item) {
      return () => {
        if (!item || !item.url || item.url === "") {
          return;
        }
        openWindow(item.url);
      };
    }
    $$self.$$set = ($$props2) => {
      if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
      if ("platform" in $$props2) $$invalidate(1, platform2 = $$props2.platform);
    };
    return [data, platform2, getComponent, handleGo];
  }
  class TabContainer extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$5, safe_not_equal, { data: 0, platform: 1 });
    }
  }
  function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  function getScriptEnv() {
    let scriptManager = "Unknown";
    if (typeof _GM_info !== "undefined" && _GM_info.scriptHandler) {
      scriptManager = _GM_info.scriptHandler;
    } else if (typeof _GM !== "undefined" && _GM.info && _GM.info.scriptHandler) {
      scriptManager = _GM.info.scriptHandler;
    }
    return scriptManager;
  }
  function getScriptVersion() {
    if (typeof _GM_info !== "undefined" && _GM_info.script.version) {
      return _GM_info.script.version;
    } else if (typeof _GM !== "undefined" && _GM.info && _GM.info.script.version) {
      return _GM.info.script.version;
    }
    return "Unknown";
  }
  const words = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "-",
    ","
  ];
  function shuffleWords() {
    return words.sort(() => Math.random() - 0.5);
  }
  function getToken() {
    const words2 = shuffleWords();
    const index0 = getIndex(words2, "all", true);
    const index1 = getIndex(words2, "iance", true);
    const random = Math.floor(Math.random() * 2);
    const splits = [getIndex(words2, ","), getIndex(words2, "-")];
    const now = Date.now();
    const split = random == 0 ? "," : "-";
    const data = [
      split,
      index0,
      splits[random] + split,
      index1,
      splits[random] + split,
      now
    ];
    const key2 = "jason";
    const token = CryptoJS__namespace.AES.encrypt(data.join(""), key2).toString();
    const keyMap = getKeyMap(words2, now, split, key2);
    return {
      token,
      keyMap
    };
  }
  function getKeyMap(words2, now, split, key2) {
    const data = [split, words2, now];
    const keyMap = CryptoJS__namespace.AES.encrypt(JSON.stringify(data), key2).toString();
    return keyMap;
  }
  function getIndex(words2, keyword, needSplit = false) {
    const index = [];
    for (let i = 0; i < keyword.length; i++) {
      index.push(words2.indexOf(keyword[i]).toString());
      if (needSplit) {
        index.push("@");
      }
    }
    return index.join("");
  }
  function getCkValue(key2) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [k, v] = cookie.split("=");
      if (k === key2) return decodeURIComponent(v);
    }
    return null;
  }
  function encrypt(content) {
    return CryptoJS__namespace.AES.encrypt(content, "ck").toString();
  }
  var COOKIE_KEY = /* @__PURE__ */ ((COOKIE_KEY2) => {
    COOKIE_KEY2["JD_USER_NAME"] = "unick";
    COOKIE_KEY2["TAOBAO_USER_NAME"] = "tracknick";
    COOKIE_KEY2["VIP_USER_NAME"] = "VipRNAME";
    return COOKIE_KEY2;
  })(COOKIE_KEY || {});
  var GM_KEY = /* @__PURE__ */ ((GM_KEY2) => {
    GM_KEY2["JD_HAS_COUPON_URL"] = "73haz73_jd_coupon_url";
    GM_KEY2["JD_USER_NAME"] = "jd_user_name";
    GM_KEY2["JD_GOODS_LIST"] = "jd_goods_list";
    GM_KEY2["JD_GOODS_LIST2"] = "jd_goods_list2";
    GM_KEY2["JD_GOODS_LIST3"] = "jd_goods_list3";
    GM_KEY2["JD_GOODS"] = "jd_goods";
    GM_KEY2["TAOBAO_USER_NAME"] = "taobao_user_name";
    GM_KEY2["TAOBAO_GOODS"] = "taobao_goods";
    GM_KEY2["VIP_USER_NAME"] = "vip_user_name";
    GM_KEY2["VIP_GOODS"] = "vip_goods";
    GM_KEY2["UUID"] = "jae2u5xruuid";
    GM_KEY2["VERSION_CHECK_TIME"] = "version_check_time";
    GM_KEY2["VERSION_UPDATE_TIME"] = "version_update_time";
    GM_KEY2["VERSION_IS_FORCE"] = "version_force_update";
    return GM_KEY2;
  })(GM_KEY || {});
  function getEncryptUUID(platform2) {
    switch (platform2) {
      case Platform.JD:
        return getJDUUID();
    }
  }
  function getJDUUID() {
    const nick = getCkValue(COOKIE_KEY.JD_USER_NAME);
    const c = encrypt(`${nick}`);
    return c;
  }
  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === "x" ? random : random & 3 | 8;
      return value.toString(16);
    });
  }
  async function initUUID() {
    const uuid = await getUUID();
    if (!uuid) {
      const id = generateUUID();
      await setGMValue(GM_KEY.UUID, id);
      localStorage.setItem(GM_KEY.UUID, id);
    }
  }
  async function getUUID() {
    const u1 = await getGMValue(GM_KEY.UUID);
    const u2 = localStorage.getItem(GM_KEY.UUID);
    if (!u1 && u2) {
      setGMValue(GM_KEY.UUID, u2);
    }
    if (u1 && (!u2 || u1 != u2)) {
      localStorage.setItem(GM_KEY.UUID, u1);
    }
    return u1 ?? u2;
  }
  async function fetchWithOptionalTimeout(url, options = {}, timeout) {
    if (!timeout) {
      return fetch(url, options);
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal });
      clearTimeout(timeoutId);
      return res;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Fetch request timed out");
      }
      throw error;
    }
  }
  async function get(url, data, timeout) {
    const params = new URLSearchParams(data ?? {});
    url = url + "?" + params.toString();
    const { token, keyMap } = getToken();
    const plgid = await getUUID() ?? "";
    const pf = getPlatform();
    const headers = {
      authorization: token,
      authhash: keyMap,
      plgn: PluginName,
      plgv: getScriptVersion(),
      plgEnv: getScriptEnv(),
      plgzid: getEncryptUUID(pf) ?? "",
      plgid: plgid ?? ""
    };
    const res = await fetchWithOptionalTimeout(url, { headers }, timeout);
    const json = await res.json();
    return json;
  }
  async function post(url, data, timeout) {
    const { token, keyMap } = getToken();
    const plgid = await getUUID() ?? "";
    const pf = getPlatform();
    const headers = {
      authorization: token,
      authhash: keyMap,
      plgn: PluginName,
      plgv: getScriptVersion(),
      plgEnv: getScriptEnv(),
      plgzid: getEncryptUUID(pf) ?? "",
      plgid: plgid ?? "",
      "Content-Type": "application/json"
    };
    const res = await fetchWithOptionalTimeout(
      url,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      },
      timeout
    );
    const json = await res.json();
    return json;
  }
  const baseUrl = "https://api2.jasonzk.com";
  const transformLink = "transform/linkv2";
  const lvt = "vw/lvt";
  const getTransformLink = `${baseUrl}/${transformLink}`;
  const getCoupon = `${baseUrl}/goods/couponV3`;
  const getHisPrice = `${baseUrl}/tools/goods-his`;
  const getActivitySets = `${baseUrl}/activity/sets2`;
  const checkClear = `${baseUrl}/config/clear`;
  const vwC = `${baseUrl}/vw/c`;
  const vwB = `${baseUrl}/vw/b`;
  const vwLvt = `${baseUrl}/${lvt}`;
  const checkVersion = `${baseUrl}/version/check`;
  const API = {
    getTransformLink,
    getHisPrice,
    getActivitySets,
    checkVersion,
    checkClear,
    getCoupon,
    vwC,
    vwB,
    vwLvt
  };
  function checkIsOpenedActivity(activity, platform2) {
    const { key: key2, jdLink, tbLink } = activity;
    const keyValue = localStorage.getItem(key2);
    if (!keyValue) {
      localStorage.setItem(key2, key2);
      switch (platform2) {
        case Platform.JD:
          if (jdLink && jdLink != "") {
            openWindow(jdLink);
          }
          return;
        case Platform.Tmall:
          if (tbLink && tbLink != "") {
            openWindow(tbLink);
          }
          return;
      }
    }
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[10] = list[i].data;
    child_ctx[7] = list[i].platform;
    child_ctx[12] = i;
    return child_ctx;
  }
  function get_each_context_1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[13] = list[i].name;
    child_ctx[15] = i;
    return child_ctx;
  }
  function create_if_block$2(ctx) {
    let div;
    let span;
    let t0_value = (
      /*activityList*/
      ctx[1].title + ""
    );
    let t0;
    let t1_value = (
      /*activityList*/
      ctx[1].hot ? "🔥" : ""
    );
    let t1;
    let t2;
    let modal;
    let current;
    let mounted2;
    let dispose;
    modal = new Modal({
      props: {
        show: (
          /*showModal*/
          ctx[0]
        ),
        title: (
          /*activityList*/
          ctx[1].title
        ),
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    modal.$on(
      "close",
      /*closeModal*/
      ctx[4]
    );
    return {
      c() {
        div = element("div");
        span = element("span");
        t0 = text(t0_value);
        t1 = text(t1_value);
        t2 = space();
        create_component(modal.$$.fragment);
        attr(span, "class", "cursor-pointer text-red-500 underline");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span);
        append(span, t0);
        append(span, t1);
        append(div, t2);
        mount_component(modal, div, null);
        current = true;
        if (!mounted2) {
          dispose = listen(
            span,
            "click",
            /*openModal*/
            ctx[3]
          );
          mounted2 = true;
        }
      },
      p(ctx2, dirty) {
        if ((!current || dirty & /*activityList*/
        2) && t0_value !== (t0_value = /*activityList*/
        ctx2[1].title + "")) set_data(t0, t0_value);
        if ((!current || dirty & /*activityList*/
        2) && t1_value !== (t1_value = /*activityList*/
        ctx2[1].hot ? "🔥" : "")) set_data(t1, t1_value);
        const modal_changes = {};
        if (dirty & /*showModal*/
        1) modal_changes.show = /*showModal*/
        ctx2[0];
        if (dirty & /*activityList*/
        2) modal_changes.title = /*activityList*/
        ctx2[1].title;
        if (dirty & /*$$scope, activityList, $activeTab*/
        65542) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current) return;
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(modal);
        mounted2 = false;
        dispose();
      }
    };
  }
  function create_each_block_1(ctx) {
    let button;
    let t0_value = (
      /*name*/
      ctx[13] + ""
    );
    let t0;
    let t1;
    let mounted2;
    let dispose;
    function click_handler() {
      return (
        /*click_handler*/
        ctx[8](
          /*index*/
          ctx[15]
        )
      );
    }
    return {
      c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", "border-none cursor-pointer rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-400 hover:text-white");
        toggle_class(
          button,
          "bg-blue-500",
          /*$activeTab*/
          ctx[2] === /*index*/
          ctx[15]
        );
        toggle_class(
          button,
          "text-white",
          /*$activeTab*/
          ctx[2] === /*index*/
          ctx[15]
        );
      },
      m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
        if (!mounted2) {
          dispose = listen(button, "click", click_handler);
          mounted2 = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (dirty & /*activityList*/
        2 && t0_value !== (t0_value = /*name*/
        ctx[13] + "")) set_data(t0, t0_value);
        if (dirty & /*$activeTab*/
        4) {
          toggle_class(
            button,
            "bg-blue-500",
            /*$activeTab*/
            ctx[2] === /*index*/
            ctx[15]
          );
        }
        if (dirty & /*$activeTab*/
        4) {
          toggle_class(
            button,
            "text-white",
            /*$activeTab*/
            ctx[2] === /*index*/
            ctx[15]
          );
        }
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        mounted2 = false;
        dispose();
      }
    };
  }
  function create_if_block_1$1(ctx) {
    let tabcontainer;
    let current;
    tabcontainer = new TabContainer({
      props: {
        data: (
          /*data*/
          ctx[10]
        ),
        platform: (
          /*platform*/
          ctx[7]
        )
      }
    });
    return {
      c() {
        create_component(tabcontainer.$$.fragment);
      },
      m(target, anchor) {
        mount_component(tabcontainer, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tabcontainer_changes = {};
        if (dirty & /*activityList*/
        2) tabcontainer_changes.data = /*data*/
        ctx2[10];
        if (dirty & /*activityList*/
        2) tabcontainer_changes.platform = /*platform*/
        ctx2[7];
        tabcontainer.$set(tabcontainer_changes);
      },
      i(local) {
        if (current) return;
        transition_in(tabcontainer.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tabcontainer.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(tabcontainer, detaching);
      }
    };
  }
  function create_each_block(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*$activeTab*/
      ctx[2] === /*tabIndex*/
      ctx[12] && create_if_block_1$1(ctx)
    );
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        if (
          /*$activeTab*/
          ctx2[2] === /*tabIndex*/
          ctx2[12]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$activeTab*/
            4) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block_1$1(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function create_default_slot(ctx) {
    let div2;
    let div0;
    let t;
    let div1;
    let current;
    let each_value_1 = ensure_array_like(
      /*activityList*/
      ctx[1].tabs
    );
    let each_blocks_1 = [];
    for (let i = 0; i < each_value_1.length; i += 1) {
      each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    }
    let each_value = ensure_array_like(
      /*activityList*/
      ctx[1].tabs
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].c();
        }
        t = space();
        div1 = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div0, "class", "mb-4 flex gap-4");
        attr(div1, "class", "overflow-auto");
        set_style(div1, "max-height", "450px");
        attr(div2, "class", "flex flex-col items-center gap-4");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        for (let i = 0; i < each_blocks_1.length; i += 1) {
          if (each_blocks_1[i]) {
            each_blocks_1[i].m(div0, null);
          }
        }
        append(div2, t);
        append(div2, div1);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div1, null);
          }
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*$activeTab, switchTab, activityList*/
        70) {
          each_value_1 = ensure_array_like(
            /*activityList*/
            ctx2[1].tabs
          );
          let i;
          for (i = 0; i < each_value_1.length; i += 1) {
            const child_ctx = get_each_context_1(ctx2, each_value_1, i);
            if (each_blocks_1[i]) {
              each_blocks_1[i].p(child_ctx, dirty);
            } else {
              each_blocks_1[i] = create_each_block_1(child_ctx);
              each_blocks_1[i].c();
              each_blocks_1[i].m(div0, null);
            }
          }
          for (; i < each_blocks_1.length; i += 1) {
            each_blocks_1[i].d(1);
          }
          each_blocks_1.length = each_value_1.length;
        }
        if (dirty & /*activityList, $activeTab*/
        6) {
          each_value = ensure_array_like(
            /*activityList*/
            ctx2[1].tabs
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div1, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
        destroy_each(each_blocks_1, detaching);
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_fragment$4(ctx) {
    var _a;
    let if_block_anchor;
    let current;
    let if_block = (
      /*activityList*/
      ctx[1] && /*activityList*/
      ((_a = ctx[1]) == null ? void 0 : _a.show) && create_if_block$2(ctx)
    );
    return {
      c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        var _a2;
        if (
          /*activityList*/
          ctx2[1] && /*activityList*/
          ((_a2 = ctx2[1]) == null ? void 0 : _a2.show)
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*activityList*/
            2) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$2(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(if_block_anchor);
        }
        if (if_block) if_block.d(detaching);
      }
    };
  }
  function instance$3($$self, $$props, $$invalidate) {
    let $activeTab;
    let showModal = false;
    let activityList = null;
    const platform2 = getPlatform();
    function openModal() {
      $$invalidate(0, showModal = true);
    }
    function closeModal() {
      $$invalidate(0, showModal = false);
    }
    let activeTab = writable(0);
    component_subscribe($$self, activeTab, (value) => $$invalidate(2, $activeTab = value));
    function switchTab(index) {
      activeTab.set(index);
    }
    async function fetchActivity() {
      const json = await get(API.getActivitySets, {});
      const { data } = json;
      if (data) {
        $$invalidate(1, activityList = data);
        checkIsOpenedActivity(data, platform2);
      }
    }
    onMount(() => {
      fetchActivity();
    });
    const click_handler = (index) => switchTab(index);
    return [
      showModal,
      activityList,
      $activeTab,
      openModal,
      closeModal,
      activeTab,
      switchTab,
      platform2,
      click_handler
    ];
  }
  let Container$1 = class Container extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$4, safe_not_equal, {});
    }
  };
  function create_if_block$1(ctx) {
    let span;
    return {
      c() {
        span = element("span");
        span.textContent = "暂无优惠券！";
        attr(span, "class", "text-red-500");
      },
      m(target, anchor) {
        insert(target, span, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_fragment$3(ctx) {
    let div;
    let t;
    let activitycontainer;
    let current;
    let if_block = (
      /*show*/
      ctx[0] && create_if_block$1()
    );
    activitycontainer = new Container$1({});
    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
        t = space();
        create_component(activitycontainer.$$.fragment);
        attr(div, "class", "flex justify-center gap-[20px] text-center");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
        append(div, t);
        mount_component(activitycontainer, div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*show*/
          ctx2[0]
        ) {
          if (if_block) ;
          else {
            if_block = create_if_block$1();
            if_block.c();
            if_block.m(div, t);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i(local) {
        if (current) return;
        transition_in(activitycontainer.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(activitycontainer.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        if (if_block) if_block.d();
        destroy_component(activitycontainer);
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let { show = false } = $$props;
    $$self.$$set = ($$props2) => {
      if ("show" in $$props2) $$invalidate(0, show = $$props2.show);
    };
    return [show];
  }
  class Desc extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$3, safe_not_equal, { show: 0 });
    }
  }
  function create_fragment$2(ctx) {
    let div;
    let span;
    let mounted2;
    let dispose;
    return {
      c() {
        div = element("div");
        span = element("span");
        span.textContent = "🔥大流量卡，免费领（运营商直发）";
        attr(span, "class", "text-orange-500 cursor-pointer font-bold underline hover:text-orange-600");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span);
        if (!mounted2) {
          dispose = listen(
            span,
            "click",
            /*click_handler*/
            ctx[2]
          );
          mounted2 = true;
        }
      },
      p: noop,
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted2 = false;
        dispose();
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let { link: link2 } = $$props;
    function handleGo(link22) {
      if (link22) {
        openWindow(link22);
      }
    }
    const click_handler = () => handleGo(link2);
    $$self.$$set = ($$props2) => {
      if ("link" in $$props2) $$invalidate(0, link2 = $$props2.link);
    };
    return [link2, handleGo, click_handler];
  }
  class Card extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$2, safe_not_equal, { link: 0 });
    }
  }
  let link = "https://hy.yunhaoka.com/#/pages/micro_store/index?agent_id=1e2ccde37dc0ef93";
  const getCardLink = () => {
    return link;
  };
  function getSessionStorage(key2) {
    const item = sessionStorage.getItem(key2) ?? "";
    let data = null;
    try {
      data = JSON.parse(item);
    } catch (e) {
    }
    return data;
  }
  function setSessionStorage(key2, data) {
    sessionStorage.setItem(key2, JSON.stringify(data));
  }
  function clearSessionStorage(key2) {
    sessionStorage.removeItem(key2);
  }
  function clearLocalStorage(key2) {
    localStorage.removeItem(key2);
  }
  const key$1 = "tampermonkey_plugin_je82j46";
  function initPlugin() {
    function updateTimestamp() {
      const plugins = getSessionStorage(key$1) ?? [];
      const currentTime = Date.now();
      const updatedPlugins = plugins.filter(
        (plugin) => plugin.name !== PluginName
      );
      updatedPlugins.push({ name: PluginName, timestamp: currentTime });
      setSessionStorage(key$1, updatedPlugins);
      setTimeout(updateTimestamp, 3e3);
    }
    updateTimestamp();
  }
  function existPlugin(pluginName, timeout = 3e3) {
    const plugins = getSessionStorage(key$1) ?? [];
    const plugin = plugins.find(
      (plugin2) => plugin2.name === pluginName
    );
    if (!plugin) return false;
    return Date.now() - plugin.timestamp <= timeout;
  }
  function canExec() {
    const currentPlugin = PluginName;
    switch (currentPlugin) {
      case PluginType.COMPARE:
        return true;
      case PluginType.ALLINONE:
        return !existPlugin(PluginType.COMPARE);
      case PluginType.TOOL:
        return !existPlugin(PluginType.COMPARE) && !existPlugin(PluginType.ALLINONE);
      case PluginType.COUPON:
        return !existPlugin(PluginType.COMPARE) && !existPlugin(PluginType.TOOL) && !existPlugin(PluginType.ALLINONE);
      case PluginType.PROMOTION:
        return !existPlugin(PluginType.COMPARE) && !existPlugin(PluginType.COUPON) && !existPlugin(PluginType.TOOL) && !existPlugin(PluginType.ALLINONE);
    }
    return true;
  }
  function create_if_block_1(ctx) {
    var _a, _b, _c, _d, _e;
    let div;
    let t;
    let coupon_1;
    let current;
    coupon_1 = new Coupon({
      props: {
        couponAmount: (
          /*$coupon*/
          (_a = ctx[0]) == null ? void 0 : _a.couponAmount
        ),
        couponInfo: (
          /*$coupon*/
          (_b = ctx[0]) == null ? void 0 : _b.couponInfo
        ),
        couponEndTime: (
          /*$coupon*/
          (_c = ctx[0]) == null ? void 0 : _c.couponEndTime
        ),
        url: (
          /*$coupon*/
          (_d = ctx[0]) == null ? void 0 : _d.shortUrl
        ),
        remainCount: (
          /*$coupon*/
          (_e = ctx[0]) == null ? void 0 : _e.remainCount
        )
      }
    });
    return {
      c() {
        div = element("div");
        t = space();
        create_component(coupon_1.$$.fragment);
        attr(div, "class", "mb-[12px]");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        insert(target, t, anchor);
        mount_component(coupon_1, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        var _a2, _b2, _c2, _d2, _e2;
        const coupon_1_changes = {};
        if (dirty & /*$coupon*/
        1) coupon_1_changes.couponAmount = /*$coupon*/
        (_a2 = ctx2[0]) == null ? void 0 : _a2.couponAmount;
        if (dirty & /*$coupon*/
        1) coupon_1_changes.couponInfo = /*$coupon*/
        (_b2 = ctx2[0]) == null ? void 0 : _b2.couponInfo;
        if (dirty & /*$coupon*/
        1) coupon_1_changes.couponEndTime = /*$coupon*/
        (_c2 = ctx2[0]) == null ? void 0 : _c2.couponEndTime;
        if (dirty & /*$coupon*/
        1) coupon_1_changes.url = /*$coupon*/
        (_d2 = ctx2[0]) == null ? void 0 : _d2.shortUrl;
        if (dirty & /*$coupon*/
        1) coupon_1_changes.remainCount = /*$coupon*/
        (_e2 = ctx2[0]) == null ? void 0 : _e2.remainCount;
        coupon_1.$set(coupon_1_changes);
      },
      i(local) {
        if (current) return;
        transition_in(coupon_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(coupon_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
          detach(t);
        }
        destroy_component(coupon_1, detaching);
      }
    };
  }
  function create_if_block(ctx) {
    var _a;
    let card;
    let current;
    card = new Card({
      props: {
        link: (
          /*$coupon*/
          ((_a = ctx[0]) == null ? void 0 : _a.card) ?? getCardLink()
        )
      }
    });
    return {
      c() {
        create_component(card.$$.fragment);
      },
      m(target, anchor) {
        mount_component(card, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        var _a2;
        const card_changes = {};
        if (dirty & /*$coupon*/
        1) card_changes.link = /*$coupon*/
        ((_a2 = ctx2[0]) == null ? void 0 : _a2.card) ?? getCardLink();
        card.$set(card_changes);
      },
      i(local) {
        if (current) return;
        transition_in(card.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(card.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(card, detaching);
      }
    };
  }
  function create_fragment$1(ctx) {
    var _a, _b, _c, _d;
    let div1;
    let div0;
    let desc;
    let t0;
    let t1;
    let show_if = canExec();
    let current;
    desc = new Desc({
      props: {
        show: (
          /*$coupon*/
          ((_a = ctx[0]) == null ? void 0 : _a.couponAmount) == null || /*$coupon*/
          ((_b = ctx[0]) == null ? void 0 : _b.couponAmount) == 0
        )
      }
    });
    let if_block0 = (
      /*$coupon*/
      ((_c = ctx[0]) == null ? void 0 : _c.couponAmount) != null && /*$coupon*/
      ((_d = ctx[0]) == null ? void 0 : _d.couponAmount) > 0 && create_if_block_1(ctx)
    );
    let if_block1 = show_if && create_if_block(ctx);
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        create_component(desc.$$.fragment);
        t0 = space();
        if (if_block0) if_block0.c();
        t1 = space();
        if (if_block1) if_block1.c();
        attr(div0, "class", "mb-[12px] rounded-md bg-slate-100 p-[12px]");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, div0);
        mount_component(desc, div0, null);
        append(div0, t0);
        if (if_block0) if_block0.m(div0, null);
        append(div1, t1);
        if (if_block1) if_block1.m(div1, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        var _a2, _b2, _c2, _d2;
        const desc_changes = {};
        if (dirty & /*$coupon*/
        1) desc_changes.show = /*$coupon*/
        ((_a2 = ctx2[0]) == null ? void 0 : _a2.couponAmount) == null || /*$coupon*/
        ((_b2 = ctx2[0]) == null ? void 0 : _b2.couponAmount) == 0;
        desc.$set(desc_changes);
        if (
          /*$coupon*/
          ((_c2 = ctx2[0]) == null ? void 0 : _c2.couponAmount) != null && /*$coupon*/
          ((_d2 = ctx2[0]) == null ? void 0 : _d2.couponAmount) > 0
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
            if (dirty & /*$coupon*/
            1) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_1(ctx2);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div0, null);
          }
        } else if (if_block0) {
          group_outros();
          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });
          check_outros();
        }
        if (show_if) if_block1.p(ctx2, dirty);
      },
      i(local) {
        if (current) return;
        transition_in(desc.$$.fragment, local);
        transition_in(if_block0);
        transition_in(if_block1);
        current = true;
      },
      o(local) {
        transition_out(desc.$$.fragment, local);
        transition_out(if_block0);
        transition_out(if_block1);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div1);
        }
        destroy_component(desc);
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let $coupon;
    component_subscribe($$self, coupon, ($$value) => $$invalidate(0, $coupon = $$value));
    return [$coupon];
  }
  class Container2 extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment$1, safe_not_equal, {});
    }
  }
  function create_fragment(ctx) {
    let main;
    let container;
    let current;
    container = new Container2({});
    return {
      c() {
        main = element("main");
        create_component(container.$$.fragment);
      },
      m(target, anchor) {
        insert(target, main, anchor);
        mount_component(container, main, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current) return;
        transition_in(container.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(container.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(main);
        }
        destroy_component(container);
      }
    };
  }
  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment, safe_not_equal, {});
    }
  }
  const HOST = {
    JD: {
      // https://list.jd.com/list.html?cat=6728,12402
      DETAIL: "https://item.jd.com",
      I_DETAIL: "https://i-item.jd.com",
      IC_DETAIL: "https://ic-item.jd.com",
      YIYAO_DETAIL: "https://item.yiyaojd.com",
      GLOBAL_DETAIL: "https://npcitem.jd.hk",
      HEALTH_DETAIL: "https://item.jkcsjd.com"
    },
    TMALL: {
      DETAIL: "detail.tmall.com/item",
      TB_DETAIL: "item.taobao.com/item",
      CHAOSHI_DETAIL: "chaoshi.detail.tmall.com/item",
      GLOBAL_DETAIL: "detail.tmall.hk/item",
      GLOBAL_HK_DETAIL: "detail.tmall.hk/hk/item"
    },
    VIP: {
      DETAIL: "detail.vip.com/detail",
      GLOABL_DETAIL: "www.vipglobal.hk/detail",
      H5_DETAIL: "m.vip.com/product"
    }
  };
  function getOriginalUrl(platform2) {
    switch (platform2) {
      case Platform.JD:
        return location.origin + location.pathname;
      case Platform.Tmall:
        return location.href;
      case Platform.Vip:
        return location.origin + location.pathname;
    }
    return location.href;
  }
  async function fetchTransformLink(params) {
    const {
      platform: platform2,
      url = getOriginalUrl(platform2),
      shop = "",
      dl = true,
      timeout,
      title,
      price,
      img
    } = params;
    const json = await get(
      API.getTransformLink,
      {
        platform: platform2,
        url,
        shop: shop ?? void 0,
        pt: PluginName,
        dl: dl ? 1 : 0,
        title: title ?? "",
        price: price ?? "",
        img: img ?? ""
      },
      timeout
    );
    return json;
  }
  function isGoodsDetailPage(url) {
    if (!url) return false;
    if (url.includes(HOST.JD.DETAIL) || url.includes(HOST.JD.YIYAO_DETAIL) || url.includes(HOST.JD.GLOBAL_DETAIL) || url.includes(HOST.JD.IC_DETAIL) || url.includes(HOST.JD.I_DETAIL))
      return true;
    return false;
  }
  function getJdId(url) {
    try {
      if (url == "") {
        return null;
      }
      const parsedUrl = new URL(url);
      for (const [key2, value] of parsedUrl.searchParams.entries()) {
        if (value.includes("http")) {
          return getJdId(value);
        }
      }
      const pathMatch = parsedUrl.pathname.match(/\/(\d+)\.html/);
      if (pathMatch) {
        return pathMatch[1];
      }
      for (const value of parsedUrl.searchParams.values()) {
        const embeddedMatch = value.match(/\/(\d+)\.html/);
        if (embeddedMatch) {
          return embeddedMatch[1];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  function getUrlParams(url) {
    let queryString = window.location.search;
    if (url) {
      queryString = url;
      if (url.indexOf("http") != -1) {
        const index = url.indexOf("?");
        queryString = url.slice(index);
      }
    }
    const params = new URLSearchParams(queryString);
    const queryParams = {};
    for (const [key2, value] of params.entries()) {
      queryParams[key2] = value;
    }
    return queryParams;
  }
  function getTmallId(url) {
    const params = getUrlParams(url);
    const id = params["id"];
    return id ?? null;
  }
  function getVipId(url) {
    const match = url.match(/detail-(\d+)-(\d+)/);
    if (match && match[1] && match[2]) {
      return match[1] + "-" + match[2];
    }
    return null;
  }
  const key = "gm_transform_goods_links4";
  function getId(url) {
    if (url.includes("jd") || url.includes("jingdonghealth")) {
      const id = getJdId(url);
      if (id) {
        return "jd-" + id;
      }
    }
    if (url.includes("tmall")) {
      const id = getTmallId(url);
      if (id) {
        return "tmall-" + id;
      }
    }
    if (url.includes("taobao")) {
      const id = getTmallId(url);
      if (id) {
        return "taobao-" + id;
      }
    }
    if (url.includes("vip")) {
      const id = getVipId(url);
      if (id) {
        return "vip-" + id;
      }
    }
    return null;
  }
  async function saveTransformLink(url, data) {
    let transformList = await getTransformSets();
    if (!transformList) {
      transformList = {};
    }
    const id = getId(url);
    if (!id) {
      return;
    }
    if (transformList[id]) return;
    transformList[id] = {
      ...data,
      viewed: false,
      originalUrl: url
    };
    await setGMValue(key, transformList);
  }
  async function getTransformSets() {
    const transformList = await getGMValue(
      key,
      {}
    );
    return transformList;
  }
  async function updateTransformLink(url, data) {
    let transformList = await getTransformSets();
    const id = getId(url);
    if (!id) {
      return;
    }
    if (!(transformList == null ? void 0 : transformList[id])) {
      return;
    }
    transformList[id] = {
      ...transformList[id],
      ...data
    };
    await setGMValue(key, transformList);
  }
  async function getTransformLinkByUrl(url) {
    const transformList = await getTransformSets();
    const id = getId(url);
    if (!id) return null;
    return (transformList == null ? void 0 : transformList[id]) ?? null;
  }
  async function deleteTransformList() {
    await deleteGMValue(key);
  }
  async function clearTransformList() {
    const transformList = await getTransformSets();
    if (transformList) {
      const keys = Object.keys(transformList);
      if (keys.length > 5e3) {
        for (const key2 of keys) {
          const link2 = transformList[key2];
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1e3;
          if (!link2.ts) {
            Reflect.deleteProperty(transformList, key2);
          } else {
            if (now - link2.ts > oneDay) {
              Reflect.deleteProperty(transformList, key2);
            }
          }
        }
        await deleteTransformList();
        await setGMValue(key, transformList);
      }
    }
  }
  async function waitForElement(selector) {
    return new Promise((resolve) => {
      const existingElement = document.querySelector(selector);
      if (existingElement) {
        return resolve(existingElement);
      }
      const observeElement = () => {
        const observer = new MutationObserver(() => {
          const targetElement = document.querySelector(selector);
          if (targetElement) {
            resolve(targetElement);
            observer.disconnect();
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      };
      if (document.body) {
        observeElement();
      } else {
        window.addEventListener("DOMContentLoaded", observeElement, {
          once: true
        });
      }
    });
  }
  async function waitForDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve(0);
      }
    });
  }
  async function createTarget(target) {
    return new Promise((resolve) => {
      let timer = 0;
      function addSibling() {
        let t = null;
        for (const item of target) {
          t = document.querySelector(item);
          if (t) {
            break;
          }
        }
        if (t) {
          clearTimeout(timer);
          resolve(t);
        } else {
          timer = setTimeout(addSibling, 100);
        }
      }
      timer = setTimeout(addSibling, 100);
    });
  }
  async function initTitle() {
    const platform2 = getPlatform();
    let title = "";
    switch (platform2) {
      case Platform.Tmall:
        title = await getTbTitle();
        break;
      case Platform.JD:
        title = await getJdTitle();
        break;
      case Platform.Vip:
        title = await getVipTitle();
        break;
    }
    return title;
  }
  function getTbTitle() {
    return new Promise((resolve) => {
      const getTitle = () => {
        var _a, _b;
        return (_b = (_a = document.querySelector('[class^="mainTitle--"]')) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      };
      function tryGetTitle(timeout = 5e3) {
        const title = getTitle();
        if (title) {
          resolve(title);
          return;
        }
        if (timeout <= 0) {
          const observer = new MutationObserver(() => {
            const title2 = getTitle();
            if (title2) {
              observer.disconnect();
              resolve(title2);
            }
          });
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          return;
        }
        setTimeout(() => {
          tryGetTitle(timeout - 100);
        }, 100);
      }
      tryGetTitle();
    });
  }
  async function getJdTitle() {
    return new Promise(async (resolve) => {
      var _a;
      const title = (_a = document.querySelector(".sku-title-name")) == null ? void 0 : _a.textContent;
      if (title) {
        const rt = title.replace(/\s+/g, "");
        resolve(rt);
      } else {
        const observer = new MutationObserver(() => {
          var _a2;
          const title2 = (_a2 = document.querySelector(".sku-title-name")) == null ? void 0 : _a2.textContent;
          if (title2) {
            observer.disconnect();
            const rt = title2.replace(/\s+/g, "");
            resolve(rt);
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    });
  }
  async function getVipTitle() {
    const isH5 = isMobile();
    const className = isH5 ? ".name_title_ll" : ".pib-title-detail";
    return new Promise((resolve) => {
      var _a;
      const title = (_a = document.querySelector(className)) == null ? void 0 : _a.textContent;
      if (title && title != "商家店铺") {
        resolve(title.replace("商家店铺", ""));
      } else {
        const observer = new MutationObserver(() => {
          var _a2;
          const title2 = (_a2 = document.querySelector(className)) == null ? void 0 : _a2.textContent;
          if (title2 && title2 != "商家店铺") {
            observer.disconnect();
            resolve(title2.replace("商家店铺", ""));
          }
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    });
  }
  async function initJDRedirect() {
    var _a, _b;
    const url = getOriginalUrl(Platform.JD);
    const cached = await getTransformLinkByUrl(url);
    const flag = await checkCanRedirect$2(cached);
    if (flag) {
      if (cached && cached.url) {
        openWindow(cached.url);
        window.close();
        return;
      }
      const shopEl = await waitForElement('[class="top-name"]');
      const shop = (shopEl == null ? void 0 : shopEl.getAttribute("title")) ?? (shopEl == null ? void 0 : shopEl.textContent);
      const title = await getJdTitle() ?? "";
      const price = (_b = (_a = document.querySelectorAll(
        '.price[class^="J-p"], .price[class*=" J-p"]'
      )) == null ? void 0 : _a[0]) == null ? void 0 : _b.textContent;
      const json = await fetchTransformLink({
        platform: Platform.JD,
        title,
        shop,
        price
      });
      if (json && json.data && json.data.url) {
        saveTransformLink(url, json.data);
        await openWindow(json.data.url);
        window.close();
      }
    }
  }
  async function checkCanRedirect$2(cached) {
    const href = window.location.href;
    const flag = href.includes("2015895618") || href.includes("2035344819") || href.includes("2035856307");
    if (href.includes("utm_campaign") && !flag) {
      post(API.vwLvt, {
        url: href,
        long_url: cached == null ? void 0 : cached.url,
        platform: Platform.JD,
        ts: (cached == null ? void 0 : cached.ts) ?? 0,
        now: Date.now(),
        src: "utm_campaign_y"
      });
      return true;
    }
    const url = getOriginalUrl(Platform.JD);
    if (flag) {
      if (cached) {
        updateTransformLink(url, {
          ...cached,
          viewed: true
        });
      }
      post(API.vwLvt, {
        url: href,
        long_url: cached == null ? void 0 : cached.url,
        platform: Platform.JD,
        ts: (cached == null ? void 0 : cached.ts) ?? 0,
        now: Date.now(),
        src: "include_y"
      });
      return false;
    }
    if (!cached) {
      post(API.vwLvt, {
        url: href,
        platform: Platform.JD,
        ts: 0,
        now: Date.now(),
        src: "cached_n"
      });
      return true;
    }
    if (!cached.viewed) {
      updateTransformLink(url, {
        ...cached,
        viewed: true
      });
      post(API.vwLvt, {
        url: href,
        long_url: cached == null ? void 0 : cached.url,
        platform: Platform.JD,
        ts: (cached == null ? void 0 : cached.ts) ?? 0,
        now: Date.now(),
        src: "viewed_n"
      });
      return true;
    }
    post(API.vwLvt, {
      url: href,
      long_url: cached == null ? void 0 : cached.url,
      platform: Platform.JD,
      ts: (cached == null ? void 0 : cached.ts) ?? 0,
      now: Date.now(),
      src: "false"
    });
    return false;
  }
  async function initTMallRedirect() {
    const flag = checkCanRedirect$1();
    const url = getOriginalUrl(Platform.Tmall);
    if (flag) {
      const shopEl = await waitForElement('[class*="shopName-"]');
      const shop = (shopEl == null ? void 0 : shopEl.getAttribute("title")) ?? (shopEl == null ? void 0 : shopEl.textContent);
      const title = await getTbTitle() ?? "";
      const json = await fetchTransformLink({
        platform: Platform.Tmall,
        title,
        shop
      });
      if (json && json.data && json.data.url) {
        saveTransformLink(url, json.data);
        await openWindow(json.data.url);
        window.close();
      }
    }
  }
  function checkCanRedirect$1() {
    const href = window.location.href;
    return href.indexOf("mm_117425171_2324550020_111391250310") == -1 && href.indexOf("mm_117425171_21428696_71990812") == -1 && href.indexOf("mm_117425171_33696257_277458675") == -1;
  }
  async function initVIPRedirect() {
    const url = getOriginalUrl(Platform.Vip);
    const cached = await getTransformLinkByUrl(url);
    const flag = checkCanRedirect();
    if (flag) {
      if (cached) {
        if (cached.url && !url.includes(HOST.VIP.GLOABL_DETAIL)) {
          openWindow(cached.url);
          window.close();
          return;
        }
      } else {
        const json = await fetchTransformLink({
          platform: Platform.Vip
        });
        if (json && json.data && json.data.url) {
          if (url.includes(HOST.VIP.GLOABL_DETAIL)) {
            saveTransformLink(url, json.data);
            return;
          }
          await openWindow(json.data.url);
          window.close();
        }
      }
    }
  }
  function checkCanRedirect() {
    const href = window.location.href;
    if (href.includes(HOST.VIP.GLOABL_DETAIL)) {
      return false;
    }
    return href.indexOf("a1bea5af456e316c7745ed3ca2a379e6") == -1 && href.indexOf("f938d6787b301f8cd8d258aa477437a3") == -1 && href.indexOf("41c6df95c56c4de075bf27fffb06af9f") == -1 && (window.location.pathname.indexOf("detail-") > -1 || window.location.hostname.indexOf("m.vip.com") > -1);
  }
  async function initRedirect() {
    const href = location.href;
    if (href.includes(HOST.JD.DETAIL) || href.includes(HOST.JD.I_DETAIL) || href.includes(HOST.JD.YIYAO_DETAIL) || href.includes(HOST.JD.GLOBAL_DETAIL) || href.includes(HOST.JD.IC_DETAIL) || href.includes(HOST.JD.HEALTH_DETAIL) || href.includes("item.jingdonghealth.cn")) {
      await initJDRedirect();
    } else if (href.includes(HOST.TMALL.DETAIL) || href.includes(HOST.TMALL.TB_DETAIL) || href.includes(HOST.TMALL.CHAOSHI_DETAIL) || href.includes(HOST.TMALL.GLOBAL_DETAIL) || href.includes(HOST.TMALL.GLOBAL_HK_DETAIL)) {
      initTMallRedirect();
    } else if (href.includes(HOST.VIP.DETAIL) || href.includes(HOST.VIP.GLOABL_DETAIL) || href.includes(HOST.VIP.H5_DETAIL)) {
      initVIPRedirect();
    }
  }
  async function waitForTs(timestamp, timeout = 1050) {
    const now = Date.now();
    if (now - timestamp < timeout) {
      await wait(timeout - (now - timestamp));
    }
  }
  async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function isOverDays(timestamp, days = 55) {
    const now = Date.now();
    const dayInMilliseconds = days * 24 * 60 * 60 * 1e3;
    return Math.abs(now - timestamp) > dayInMilliseconds;
  }
  async function initJDPrefetch() {
    const host = location.host;
    const homeSelector = ".more2_list .more2_item_good a";
    const searchSelector = ".plugin_goodsContainer .plugin_goodsCardWrapper";
    const advanceSearchSelector = ".jSubObject .jItem .jdNum";
    switch (host) {
      case "www.jd.com":
        await waitForElement(homeSelector);
        initPrefetch$3(homeSelector);
        break;
      case "search.jd.com":
        await waitForElement(searchSelector);
        initSearchPrefetch(searchSelector);
        break;
      case "mall.jd.com":
        await waitForElement(advanceSearchSelector);
        initMallPrefetch(advanceSearchSelector);
        break;
    }
  }
  function initPrefetch$3(selector) {
    const itemsSet = /* @__PURE__ */ new Set();
    async function processLink(item) {
      var _a, _b;
      let link2 = item.getAttribute("href") ?? "";
      if (!link2.includes("https")) {
        link2 = "https:" + link2;
      }
      const cached = await getTransformLinkByUrl(link2);
      if (cached) {
        return;
      }
      const title = item.getAttribute("title") ?? "";
      const price = ((_a = item.querySelector(".more2_extra_price_txt")) == null ? void 0 : _a.getAttribute("title")) ?? "";
      const img = ((_b = item.querySelector("img")) == null ? void 0 : _b.getAttribute("src")) ?? "";
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const json = await fetchTransformLink({
          platform: Platform.JD,
          url: link2,
          dl: false,
          price,
          title,
          img
        });
        if (json && json.data) {
          saveTransformLink(link2, json.data);
        }
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            processLink(item);
            observer.unobserve(item);
          }
        });
      },
      {
        root: null,
        // 默认为视口
        rootMargin: "0px",
        threshold: 0.1
        // 只要 10% 元素进入视口就会触发
      }
    );
    async function processLinks() {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        if (!item.hasAttribute("data-obveduce")) {
          observer.observe(item);
          item.setAttribute("data-obveduce", "true");
        }
      });
    }
    processLinks();
    let throttleTimeout = null;
    window.addEventListener("scroll", () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        processLinks();
      }, 500);
    });
    async function handleClick() {
      await wait(300);
      const el = document.querySelector("#J_loading");
      if (el) {
        return await handleClick();
      }
      await waitForElement(selector);
      processLinks();
    }
    document.body.addEventListener("click", handleClick, true);
  }
  function initMallPrefetch(selector) {
    const itemsSet = /* @__PURE__ */ new Set();
    async function processLink(item) {
      var _a;
      const parent = item.closest(".jItem");
      const linkEl = parent == null ? void 0 : parent.querySelector(".jDesc a");
      let link2 = (linkEl == null ? void 0 : linkEl.getAttribute("href")) ?? "";
      if (!link2.includes("https")) {
        link2 = "https:" + link2;
      }
      const cached = await getTransformLinkByUrl(link2);
      if (cached) {
        return;
      }
      const title = (linkEl == null ? void 0 : linkEl.innerText.trim()) ?? "";
      const price = item.getAttribute("preprice") ?? "";
      const img = ((_a = parent == null ? void 0 : parent.querySelector("img")) == null ? void 0 : _a.getAttribute("src")) ?? "";
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const json = await fetchTransformLink({
          platform: Platform.JD,
          url: link2,
          dl: false,
          price,
          title,
          img
        });
        if (json && json.data) {
          saveTransformLink(link2, json.data);
        }
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            processLink(item);
            observer.unobserve(item);
          }
        });
      },
      {
        root: null,
        // 默认为视口
        rootMargin: "0px",
        threshold: 0.1
        // 只要 10% 元素进入视口就会触发
      }
    );
    async function processLinks() {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        if (!item.hasAttribute("data-obveduce")) {
          observer.observe(item);
          item.setAttribute("data-obveduce", "true");
        }
      });
    }
    processLinks();
    let throttleTimeout = null;
    window.addEventListener("scroll", () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        processLinks();
      }, 500);
    });
    async function handleClick() {
      await wait(300);
      const el = document.querySelector("#J_loading");
      if (el) {
        return await handleClick();
      }
      await waitForElement(selector);
      processLinks();
    }
    document.body.addEventListener("click", handleClick, true);
  }
  function initSearchPrefetch(selector) {
    const itemsSet = /* @__PURE__ */ new Set();
    async function processLink(item) {
      var _a;
      const list = getReactData$1(".plugin_goodsContainer");
      const sku = item.getAttribute("data-sku") ?? "";
      if (!sku) return;
      const link2 = `https://item.jd.com/${sku}.html`;
      const cached = await getTransformLinkByUrl(link2);
      if (cached) {
        return;
      }
      const data = list.filter((it2) => {
        return it2.skuId == sku;
      });
      if (!data || data.length != 1) {
        return;
      }
      const it = data[0];
      const title = it.$dataForReport.title;
      const price = it.jdPrice;
      const img = ((_a = item.querySelector("img")) == null ? void 0 : _a.getAttribute("src")) ?? "";
      const shop = it.shopName;
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const json = await fetchTransformLink({
          platform: Platform.JD,
          url: link2,
          dl: false,
          price,
          title,
          shop,
          img
        });
        if (json && json.data) {
          saveTransformLink(link2, json.data);
        }
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            processLink(item);
            observer.unobserve(item);
          }
        });
      },
      {
        root: null,
        // 默认为视口
        rootMargin: "0px",
        threshold: 0.1
        // 只要 10% 元素进入视口就会触发
      }
    );
    async function processLinks() {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        if (!item.hasAttribute("data-obveduce")) {
          observer.observe(item);
          item.setAttribute("data-obveduce", "true");
        }
      });
    }
    processLinks();
    let throttleTimeout = null;
    window.addEventListener("scroll", () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        processLinks();
      }, 500);
    });
    async function handleClick() {
      await wait(300);
      const el = document.querySelector("#J_loading");
      if (el) {
        return await handleClick();
      }
      await waitForElement(selector);
      processLinks();
    }
    document.body.addEventListener("click", handleClick, true);
  }
  function getReactData$1(el) {
    const container = document.querySelector(el);
    if (container) {
      const keys = Object.keys(container);
      const k = keys.filter((key2) => key2.includes("Fiber"));
      if (k && k.length > 0) {
        const key2 = k[0];
        const allData = container[key2];
        const reactData = allData.memoizedProps.children.map((child) => {
          var _a, _b, _c, _d;
          const data = (_d = (_c = (_b = (_a = child == null ? void 0 : child.props) == null ? void 0 : _a.children) == null ? void 0 : _b[2]) == null ? void 0 : _c.props) == null ? void 0 : _d.info;
          return data;
        });
        return reactData;
      }
    }
    return null;
  }
  async function initTmallPrefetch() {
    const url = location.host + location.pathname;
    const homeSelector = ".tb-pick-content-item a";
    const searchSelector = "#content_items_wrapper .search-content-col > a";
    switch (url) {
      case "www.tmall.com/":
      case "www.taobao.com/":
        await waitForElement(homeSelector);
        initPrefetch$2(homeSelector);
        break;
      case "s.taobao.com/search":
        await waitForElement(searchSelector);
        initPrefetch$2(searchSelector);
        break;
    }
  }
  function initPrefetch$2(selector) {
    const itemsSet = /* @__PURE__ */ new Set();
    async function processLink(item) {
      var _a;
      let link2 = item.getAttribute("href") ?? "";
      if (!link2.includes("https")) {
        link2 = "https:" + link2;
      }
      const cached = await getTransformLinkByUrl(link2);
      if (cached) {
        return;
      }
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const shopName = ((_a = item.querySelector('span[class*="shopNameText"]')) == null ? void 0 : _a.textContent) ?? "";
        const json = await fetchTransformLink({
          platform: Platform.Tmall,
          url: link2,
          shop: shopName,
          dl: false
        });
        if (json && json.data) {
          saveTransformLink(link2, json.data);
        }
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            processLink(item);
            observer.unobserve(item);
          }
        });
      },
      {
        root: null,
        // 默认为视口
        rootMargin: "0px",
        threshold: 0.1
        // 只要 10% 元素进入视口就会触发
      }
    );
    async function processLinks() {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        if (!item.hasAttribute("data-obveduce")) {
          observer.observe(item);
          item.setAttribute("data-obveduce", "true");
        }
      });
    }
    processLinks();
    let throttleTimeout = null;
    window.addEventListener("scroll", () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        processLinks();
      }, 500);
    });
    document.body.addEventListener(
      "click",
      async function() {
        await wait(500);
        await waitForElement(selector);
        processLinks();
      },
      true
    );
  }
  async function initVIPPrefetch() {
    const url = location.host;
    const homeSelector = ".J-goods-item a";
    const mstSelector = ".product .item";
    switch (url) {
      case "mst-pc.vip.com":
        await waitForElement(mstSelector);
        initMstPcPrefetch(mstSelector);
        break;
      case "list.vip.com":
      case "category.vip.com":
        await waitForElement(homeSelector);
        initPrefetch$1(homeSelector);
        break;
    }
  }
  function initPrefetch$1(selector) {
    const itemsSet = /* @__PURE__ */ new Set();
    async function processLink(item) {
      let link2 = item.getAttribute("href") ?? "";
      if (!link2.includes("https")) {
        link2 = "https:" + link2;
      }
      const cached = await getTransformLinkByUrl(link2);
      if (cached) {
        return;
      }
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const json = await fetchTransformLink({
          platform: Platform.Vip,
          url: link2,
          dl: false
        });
        if (json && json.data) {
          saveTransformLink(link2, json.data);
        }
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            processLink(item);
            observer.unobserve(item);
          }
        });
      },
      {
        root: null,
        // 默认为视口
        rootMargin: "0px",
        threshold: 0.1
        // 只要 10% 元素进入视口就会触发
      }
    );
    async function processLinks() {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        if (!item.hasAttribute("data-obveduce")) {
          observer.observe(item);
          item.setAttribute("data-obveduce", "true");
        }
      });
    }
    processLinks();
    let throttleTimeout = null;
    window.addEventListener("scroll", () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        processLinks();
      }, 500);
    });
    document.body.addEventListener(
      "click",
      async function() {
        await wait(500);
        await waitForElement(selector);
        processLinks();
      },
      true
    );
  }
  function initMstPcPrefetch(selector) {
    const itemsSet = /* @__PURE__ */ new Set();
    async function processLink(item) {
      try {
        const product = item["props"].children[0]._owner._currentElement.props.product;
        if (product) {
          const link2 = `https://detail.vip.com/detail-${product.brandStoreId}-${product.goodsId}.html`;
          const cached = await getTransformLinkByUrl(link2);
          if (cached) {
            return;
          }
          if (!itemsSet.has(link2)) {
            itemsSet.add(link2);
            const json = await fetchTransformLink({
              platform: Platform.Vip,
              url: link2,
              dl: false
            });
            if (json && json.data && json.data.url) {
              saveTransformLink(link2, json.data);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = entry.target;
            processLink(item);
            observer.unobserve(item);
          }
        });
      },
      {
        root: null,
        // 默认为视口
        rootMargin: "0px",
        threshold: 0.1
        // 只要 10% 元素进入视口就会触发
      }
    );
    async function processLinks() {
      const items = document.querySelectorAll(selector);
      items.forEach((item) => {
        if (!item.hasAttribute("data-obveduce")) {
          observer.observe(item);
          item.setAttribute("data-obveduce", "true");
        }
      });
    }
    processLinks();
    let throttleTimeout = null;
    window.addEventListener("scroll", () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        processLinks();
      }, 500);
    });
    document.body.addEventListener(
      "click",
      async function() {
        await wait(500);
        await waitForElement(selector);
        processLinks();
      },
      true
    );
  }
  async function initPrefetch() {
    await wait(1100);
    initJDPrefetch();
    initTmallPrefetch();
    initVIPPrefetch();
  }
  function initJDGoodsClick(event) {
    const host = location.host;
    switch (host) {
      case "www.jd.com":
        initHomeGoodsClick$2(event);
        break;
      case "item.jd.com":
      case "npcitem.jd.hk":
      case "item.yiyaojd.com":
      case "i-item.jd.com":
      case "ic-item.jd.com":
      case "item.jingdonghealth.cn":
        initOpenComment(event);
        break;
      case "mall.jd.com":
        initMallGoodsClick(event);
        break;
      case "search.jd.com":
        initSearchGoodsClick$1(event);
    }
  }
  async function initHomeGoodsClick$2(event) {
    const target = event.target;
    const link2 = target == null ? void 0 : target.closest("a.more2_lk");
    if (link2) {
      event.preventDefault();
      let url = link2.getAttribute("href");
      target.style.cursor = "wait";
      if (!url.includes("https")) {
        url = "https:" + url;
      }
      const cached = await getTransformLinkByUrl(url);
      if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
        await waitForTs((cached == null ? void 0 : cached.ts) ?? Date.now() - 2e4);
        openWindow(cached == null ? void 0 : cached.url);
      } else {
        openWindow(url);
      }
    }
    target.style.cursor = "pointer";
  }
  async function initMallGoodsClick(event) {
    const target = event.target;
    const link2 = target == null ? void 0 : target.closest("a");
    if (link2) {
      let url = link2.getAttribute("href");
      if (!url.includes("https")) {
        url = "https:" + url;
      }
      if (!isGoodsDetailPage(url)) {
        return;
      }
      event.preventDefault();
      target.style.cursor = "wait";
      const cached = await getTransformLinkByUrl(url);
      if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
        await waitForTs((cached == null ? void 0 : cached.ts) ?? Date.now() - 2e4);
        openWindow(cached == null ? void 0 : cached.url);
      } else {
        openWindow(url);
      }
    }
    target.style.cursor = "pointer";
  }
  async function initSearchGoodsClick$1(event) {
    const target = event.target;
    const el = target == null ? void 0 : target.closest(".plugin_goodsCardWrapper");
    const sku = el.getAttribute("data-sku") ?? "";
    if (!sku) return;
    const url = `https://item.jd.com/${sku}.html`;
    event.preventDefault();
    event.stopPropagation();
    target.style.cursor = "wait";
    const cached = await getTransformLinkByUrl(url);
    if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
      await waitForTs((cached == null ? void 0 : cached.ts) ?? Date.now() - 2e4);
      openWindow(cached == null ? void 0 : cached.url);
    } else {
      openWindow(url);
    }
    target.style.cursor = "pointer";
  }
  async function initOpenComment(event) {
    const target = event.target;
    const el = target == null ? void 0 : target.closest("#comment-count");
    if (el) {
      const node = document.querySelector(
        "[data-anchor='#comment']"
      );
      node == null ? void 0 : node.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      await waitForElement("#comm-curr-sku");
      await wait(300);
      const currentComment = document.querySelector("#comm-curr-sku");
      if (!(currentComment == null ? void 0 : currentComment.checked)) {
        currentComment == null ? void 0 : currentComment.click();
      }
    }
  }
  function initTmallGoodsClick(event) {
    const url = location.host + location.pathname;
    switch (url) {
      case "www.tmall.com/":
      case "www.taobao.com/":
        initHomeGoodsClick$1(event);
        break;
      case "s.taobao.com/search":
        initSearchGoodsClick(event);
        break;
    }
  }
  async function initHomeGoodsClick$1(event) {
    const target = event.target;
    const link2 = target == null ? void 0 : target.closest("a.item-link");
    if (link2) {
      event.preventDefault();
      let url = link2.getAttribute("href");
      target.style.cursor = "wait";
      if (!url.includes("https")) {
        url = "https:" + url;
      }
      const cached = await getTransformLinkByUrl(url);
      if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
        openWindow(cached == null ? void 0 : cached.url);
      } else {
        openWindow(url);
      }
    }
    target.style.cursor = "pointer";
  }
  async function initSearchGoodsClick(event) {
    const target = event.target;
    let link2 = target == null ? void 0 : target.closest("a");
    let url = "";
    if (link2) {
      url = link2.getAttribute("href");
      if (url.includes("click.simba.taobao.com")) {
        return;
      }
    } else {
      if (!isCardVisible()) return;
      const tagName = target.tagName.toLocaleLowerCase();
      if (tagName == "svg" || tagName == "path") {
        return;
      }
      const reactData = getReactData();
      if (reactData && reactData.length > 0) {
        url = reactData[0];
      }
    }
    if (url && url != "") {
      if (!url.includes("https")) {
        url = "https:" + url;
      }
      event.stopImmediatePropagation();
      event.preventDefault();
      target.style.cursor = "wait";
      const cached = await getTransformLinkByUrl(url);
      if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
        await waitForTs((cached == null ? void 0 : cached.ts) ?? Date.now() - 2e4);
        openWindow(cached == null ? void 0 : cached.url);
      } else {
        openWindow(url);
      }
    }
    target.style.cursor = "pointer";
  }
  function getReactData() {
    const container = document.querySelector('div[class*="detailHoverCard"]');
    if (container) {
      const keys = Object.keys(container);
      const k = keys.filter((key2) => key2.includes("Fiber"));
      if (k && k.length > 0) {
        const key2 = k[0];
        const allData = container[key2];
        const reactData = allData.memoizedProps.children.map((child) => {
          var _a, _b;
          const data = (_b = (_a = child == null ? void 0 : child.props) == null ? void 0 : _a.hoverDetailCardData) == null ? void 0 : _b.auctionURL;
          return data;
        });
        return reactData;
      }
    }
    return null;
  }
  function isCardVisible() {
    const el = document.querySelector('div[class*="detailHoverCard"]');
    if (el) {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.visibility == "visible";
    }
  }
  function initVIPGoodsClick(event) {
    const host = location.host;
    const href = window.location.href;
    if (href.includes(HOST.VIP.GLOABL_DETAIL)) {
      return false;
    }
    switch (host) {
      case "list.vip.com":
      case "category.vip.com":
        initHomeGoodsClick(event);
        break;
      case "mst-pc.vip.com":
        initMstPcGoodsClick(event);
        break;
    }
  }
  async function initHomeGoodsClick(event) {
    const target = event.target;
    const link2 = target == null ? void 0 : target.closest("a");
    if (link2) {
      const classList = link2.classList.value;
      if (classList.includes("page-next-txt") || classList.includes("page-pre")) {
        return;
      }
      event.preventDefault();
      let url = link2.getAttribute("href");
      target.style.cursor = "wait";
      if (!url.includes("https")) {
        url = "https:" + url;
      }
      const cached = await getTransformLinkByUrl(url);
      if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
        openWindow(cached == null ? void 0 : cached.url);
      } else {
        openWindow(url);
      }
    }
    target.style.cursor = "pointer";
  }
  async function initMstPcGoodsClick(event) {
    const target = event.target;
    const el = target == null ? void 0 : target.closest(".item");
    if (!el) return;
    const product = el["props"].children[0]._owner._currentElement.props.product;
    if (product) {
      event.stopImmediatePropagation();
      event.preventDefault();
      const url = `https://detail.vip.com/detail-${product.brandStoreId}-${product.goodsId}.html`;
      const cached = await getTransformLinkByUrl(url);
      if ((cached == null ? void 0 : cached.url) && (cached == null ? void 0 : cached.url) != "") {
        openWindow(cached == null ? void 0 : cached.url);
      } else {
        openWindow(url);
      }
    }
  }
  function initEvent() {
    const platform2 = getPlatform();
    document.body.addEventListener(
      "click",
      function(event) {
        switch (platform2) {
          case Platform.JD:
            initJDGoodsClick(event);
            break;
          case Platform.Tmall:
            initTmallGoodsClick(event);
            break;
          case Platform.Vip:
            initVIPGoodsClick(event);
        }
      },
      true
    );
  }
  async function initQrCode$1(data) {
    const { ts, qrUrl } = data ?? {};
    const isExpired = isOverDays(ts ?? 0, 55);
    if (data && qrUrl && !isExpired) {
      drawQrcodeWithLogo(qrUrl);
      drawQrcode$1(qrUrl);
    }
  }
  async function drawQrcodeWithLogo(url) {
    const [container, el] = await Promise.all([
      waitForElement("#toolbar-qrcode"),
      waitForElement("#toolbar-qrcode img")
    ]);
    if (el && container) {
      const originalSrc = el.src;
      container.style.display = "none";
      const index = originalSrc.indexOf("html") + 4;
      el.src = "//qrimg.jd.com/" + encodeURIComponent(url) + originalSrc.slice(index);
      await wait(2e3);
      container.style.display = "block";
    }
  }
  async function drawQrcode$1(url) {
    const div = document.createElement("div");
    const qrCode = new EasyQRCode(div, {
      text: url,
      width: 80,
      height: 80,
      logoBackgroundTransparent: true
    });
    await wait(3e3);
    const base64Image = qrCode._oDrawing.dataURL;
    if (base64Image) {
      const [container, el] = await Promise.all([
        waitForElement(".qrcode.fl"),
        waitForElement(".qrcode.fl img")
      ]);
      if (el && container) {
        el.src = base64Image;
      }
    }
  }
  async function initJDGoodsDetail() {
    const url = getOriginalUrl(Platform.JD);
    let data = await getTransformLinkByUrl(url);
    if (data && !data.viewed) {
      updateTransformLink(url, {
        ...data,
        viewed: true
      });
    }
    initQrCode$1(data);
  }
  async function initQrCode(data) {
    const { ts, qrUrl } = data ?? {};
    const isExpired = isOverDays(ts ?? 0, 55);
    if (data && qrUrl && !isExpired) {
      drawQrcode(qrUrl);
    }
  }
  async function drawQrcode(url) {
    const [container, canvasEl, tipsEl] = await Promise.all([
      waitForElement(".tk-qr-wrapper .tk-qr-inner"),
      waitForElement(".tk-qr-wrapper .tk-qr-inner canvas"),
      waitForElement(".tk-qr-wrapper .tk-qr-inner .tk-qr-tips")
    ]);
    canvasEl.style.display = "none";
    tipsEl.style.display = "none";
    new EasyQRCode(container, {
      text: url,
      width: 100,
      height: 100,
      logoBackgroundTransparent: true
    });
    const newTipsEl = document.createElement("div");
    newTipsEl.className = ".tk-qr-tips";
    newTipsEl.textContent = "扫一扫，去手机购买";
    container.append(newTipsEl);
  }
  async function initTmallGoodsDetail() {
    const url = getOriginalUrl(Platform.Tmall);
    let data = await getTransformLinkByUrl(url);
    if (data && !data.viewed) {
      updateTransformLink(url, {
        ...data,
        viewed: true
      });
    }
    initQrCode(data);
  }
  async function initGoodsDetail() {
    const href = location.href;
    if (href.includes(HOST.JD.DETAIL) || href.includes(HOST.JD.I_DETAIL) || href.includes(HOST.JD.YIYAO_DETAIL) || href.includes(HOST.JD.GLOBAL_DETAIL) || href.includes(HOST.JD.IC_DETAIL) || href.includes(HOST.JD.HEALTH_DETAIL) || href.includes("item.jingdonghealth.cn")) {
      await initJDGoodsDetail();
    } else if (href.includes(HOST.TMALL.DETAIL) || href.includes(HOST.TMALL.TB_DETAIL) || href.includes(HOST.TMALL.CHAOSHI_DETAIL) || href.includes(HOST.TMALL.GLOBAL_DETAIL) || href.includes(HOST.TMALL.GLOBAL_HK_DETAIL)) {
      await initTmallGoodsDetail();
    }
  }
  function daysToMs(days) {
    return days * 24 * 60 * 60 * 1e3;
  }
  async function checkAndUpdate() {
    const now = Date.now();
    const t = await getGMValue(GM_KEY.VERSION_CHECK_TIME, "0") ?? "0";
    const isForce = (await getGMValue(GM_KEY.VERSION_IS_FORCE, "0") ?? "0") == "1";
    const lastCheckTime = parseInt(t, 10);
    if (now - lastCheckTime < daysToMs(0.02) && !isForce) return;
    try {
      const res = await get(API.checkVersion);
      await setGMValue(GM_KEY.VERSION_CHECK_TIME, now + "");
      if (!res || !res.data) {
        await setGMValue(GM_KEY.VERSION_IS_FORCE, "0");
        return;
      }
      const { force, url } = res.data;
      if (force) {
        await setGMValue(GM_KEY.VERSION_IS_FORCE, "1");
        openWindow(url);
      } else {
        await setGMValue(GM_KEY.VERSION_IS_FORCE, "0");
        const t2 = await getGMValue(GM_KEY.VERSION_UPDATE_TIME, "0") ?? "0";
        const lastUpdateTime = parseInt(t2, 10);
        if (now - lastUpdateTime >= daysToMs(10)) {
          openWindow(url);
          await setGMValue(GM_KEY.VERSION_UPDATE_TIME, now + "");
        }
      }
    } catch (error) {
    }
  }
  async function clear() {
    await clearCache();
    clearLocalStorage("73haz73_unique_url");
    clearLocalStorage("tampermonkey_plugin_je82j45");
    clearSessionStorage("tampermonkey_plugin_je82j45");
    clearTransformList();
    deleteGMValue(GM_KEY.JD_GOODS_LIST);
    deleteGMValue(GM_KEY.JD_GOODS_LIST2);
    deleteGMValue(GM_KEY.JD_GOODS_LIST3);
    deleteGMValue(GM_KEY.JD_HAS_COUPON_URL);
    deleteGMValue("gm_current_transform");
    deleteGMValue("gm_transform_sets");
    deleteGMValue("gm_transform_links");
    deleteGMValue("gm_transform_goods_links");
    deleteGMValue("gm_transform_goods_links2");
    deleteGMValue("gm_transform_goods_links3");
  }
  async function clearCache() {
    const json = await get(API.checkClear);
    if (json && json.data) {
      const clearKey = "clear" + PluginClassName + "cached";
      const value = localStorage.getItem(clearKey);
      if (value != json.data) {
        await deleteTransformList();
        localStorage.setItem(clearKey, json.data);
      }
    }
  }
  const containerId = PluginClassName;
  async function mounted() {
    initPlugin();
    await initUUID();
    const platform2 = initPlatform();
    const execFlag = canExec();
    if (execFlag) {
      await initRedirect();
    }
    clear();
    await waitForDOMReady();
    if (execFlag) {
      initPrefetch();
      initEvent();
      initGoodsDetail();
    }
    const title = await initTitle();
    if (title == "" && platform2 == Platform.None) {
      return;
    }
    if (isMobile() && platform2 == Platform.Vip) {
      return;
    }
    let shop = void 0;
    if (platform2 == Platform.Tmall) {
      const titleEl = await waitForElement('[class*="shopName-"]');
      shop = (titleEl == null ? void 0 : titleEl.getAttribute("title")) ?? (titleEl == null ? void 0 : titleEl.textContent);
    }
    const json = await get(API.getCoupon, {
      title,
      platform: platform2,
      pt: PluginName,
      shop,
      url: window.location.href
    });
    if (json && json.data) {
      coupon.updateCoupon(json.data);
      const target = await createTarget(json.data.selector);
      if (!document.getElementById(containerId)) {
        const app = document.createElement("div");
        app.id = containerId;
        app.className = PluginClassName;
        target.after(app);
        new App({
          target: app
        });
      }
    }
    {
      checkAndUpdate();
    }
  }
  mounted();

})(QRCode, CryptoJS);