// ==UserScript==
// @name               💰 轻松省钱！超简洁好用的购物优惠券小助手，自动显示淘宝（taobao.com）、天猫（tmall.com）、聚划算、京东（jd.com）等平台优惠券与历史价格，支持手机扫码下单！最新技术实现。🛍️
// @name:zh            💰 轻松省钱！超简洁好用的购物优惠券小助手，自动显示淘宝（taobao.com）、天猫（tmall.com）、聚划算、京东（jd.com）等平台优惠券与历史价格，支持手机扫码下单！最新技术实现。🛍️
// @name:zh-TW         💰 輕鬆省錢！超簡潔好用的購物優惠券小助手，自動顯示淘寶（taobao.com）、天貓（tmall.com）、聚划算、京東（jd.com）等平台優惠券與歷史價格，支持手機掃碼下單！最新技術實現。🛍️
// @namespace          https://api.jasonzk.com
// @version            2.4.6
// @author             JasonZK
// @description        🚀 最新简洁好用的购物优惠券小助手！自动显示淘宝（taobao.com）、天猫（tmall.com）、天猫超市、天猫国际（tmall.hk）、聚划算、京东（jd.com）、京东国际（jd.hk）、京东图书、京东电子书、京东工业品、京东大药房（yiyaojd.com）等平台的隐藏优惠券与历史价格。支持手机扫码下单，方便快捷。告别虚假降价，以最优惠的价格，快乐购物，心情美满！🎉 持续维护中，让您省时省力，享受购物的乐趣！
// @description:zh     🚀 最新简洁好用的购物优惠券小助手！自动显示淘宝（taobao.com）、天猫（tmall.com）、天猫超市、天猫国际（tmall.hk）、聚划算、京东（jd.com）、京东国际（jd.hk）、京东图书、京东电子书、京东工业品、京东大药房（yiyaojd.com）等平台的隐藏优惠券与历史价格。支持手机扫码下单，方便快捷。告别虚假降价，以最优惠的价格，快乐购物，心情美满！🎉 持续维护中，让您省时省力，享受购物的乐趣！
// @description:zh-TW  🚀 最新簡潔好用的購物優惠券小助手！自動顯示淘寶（taobao.com）、天貓（tmall.com）、天貓超市、天貓國際（tmall.hk）、聚划算、京東（jd.com）、京東國際（jd.hk）、京東圖書、京東電子書、京東工業品、京東大藥房（yiyaojd.com）等平台的隱藏優惠券與歷史價格。支持手機掃碼下單，方便快捷。告別虛假降價，以最優惠的價格，快樂購物，心情美滿！🎉 持續維護中，讓您省時省力，享受購物的樂趣！
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
// @downloadURL https://update.greasyfork.org/scripts/497783/%F0%9F%92%B0%20%E8%BD%BB%E6%9D%BE%E7%9C%81%E9%92%B1%EF%BC%81%E8%B6%85%E7%AE%80%E6%B4%81%E5%A5%BD%E7%94%A8%E7%9A%84%E8%B4%AD%E7%89%A9%E4%BC%98%E6%83%A0%E5%88%B8%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E6%B7%98%E5%AE%9D%EF%BC%88taobaocom%EF%BC%89%E3%80%81%E5%A4%A9%E7%8C%AB%EF%BC%88tmallcom%EF%BC%89%E3%80%81%E8%81%9A%E5%88%92%E7%AE%97%E3%80%81%E4%BA%AC%E4%B8%9C%EF%BC%88jdcom%EF%BC%89%E7%AD%89%E5%B9%B3%E5%8F%B0%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%8E%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%EF%BC%8C%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%EF%BC%81%E6%9C%80%E6%96%B0%E6%8A%80%E6%9C%AF%E5%AE%9E%E7%8E%B0%E3%80%82%F0%9F%9B%8D%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497783/%F0%9F%92%B0%20%E8%BD%BB%E6%9D%BE%E7%9C%81%E9%92%B1%EF%BC%81%E8%B6%85%E7%AE%80%E6%B4%81%E5%A5%BD%E7%94%A8%E7%9A%84%E8%B4%AD%E7%89%A9%E4%BC%98%E6%83%A0%E5%88%B8%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E6%B7%98%E5%AE%9D%EF%BC%88taobaocom%EF%BC%89%E3%80%81%E5%A4%A9%E7%8C%AB%EF%BC%88tmallcom%EF%BC%89%E3%80%81%E8%81%9A%E5%88%92%E7%AE%97%E3%80%81%E4%BA%AC%E4%B8%9C%EF%BC%88jdcom%EF%BC%89%E7%AD%89%E5%B9%B3%E5%8F%B0%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%8E%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%EF%BC%8C%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%EF%BC%81%E6%9C%80%E6%96%B0%E6%8A%80%E6%9C%AF%E5%AE%9E%E7%8E%B0%E3%80%82%F0%9F%9B%8D%EF%B8%8F.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .emajueenrr *,.emajueenrr :before,.emajueenrr :after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.emajueenrr ::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.emajueenrr .container{width:100%}@media (min-width: 640px){.emajueenrr .container{max-width:640px}}@media (min-width: 768px){.emajueenrr .container{max-width:768px}}@media (min-width: 1024px){.emajueenrr .container{max-width:1024px}}@media (min-width: 1280px){.emajueenrr .container{max-width:1280px}}@media (min-width: 1536px){.emajueenrr .container{max-width:1536px}}.emajueenrr .visible{visibility:visible}.emajueenrr .fixed{position:fixed}.emajueenrr .absolute{position:absolute}.emajueenrr .relative{position:relative}.emajueenrr .block{display:block}.emajueenrr .inline-block{display:inline-block}.emajueenrr .flex{display:flex}.emajueenrr .grid{display:grid}.emajueenrr .transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.emajueenrr .gap-5{gap:1.25rem}.emajueenrr .rounded-md{border-radius:.375rem}.emajueenrr .border{border-width:1px}.emajueenrr .p-4{padding:1rem}.emajueenrr .font-bold{font-weight:700}.emajueenrr .text-orange-500{--tw-text-opacity: 1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.emajueenrr .underline{text-decoration-line:underline}.emajueenrr .shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.emajueenrr .filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.emajueenrr .transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.hover\\:text-orange-600:hover{--tw-text-opacity: 1;color:rgb(234 88 12 / var(--tw-text-opacity, 1))}.ck-container.svelte-v5fmoh{margin:12px 0}.card-link.svelte-v5fmoh{color:#f97316;font-weight:700;font-size:14px;text-decoration:underline;cursor:pointer}.card-link.svelte-v5fmoh:hover{color:#ea580c}.price-container.svelte-1cy8qli.svelte-1cy8qli{display:flex;flex-direction:column;gap:6px;margin:12px 0;align-self:flex-start}.price-container.svelte-1cy8qli .high-price.svelte-1cy8qli{color:#e10c0c}.price-container.svelte-1cy8qli .low-price.svelte-1cy8qli{color:#058505}.modal-overlay.svelte-qp8tkm{position:fixed;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;background-color:#000000b3}.modal-content.svelte-qp8tkm{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;background-color:#fff;padding:16px;border-radius:8px}.close-button.svelte-qp8tkm{position:absolute;right:8px;top:8px;font-size:24px;color:#4a4a4a;background:none;border:none;cursor:pointer}.close-button.svelte-qp8tkm:hover{color:#1a1a1a}.content-slot.svelte-qp8tkm{margin-top:28px}.clickable.svelte-1remv7x{cursor:pointer}.clickable.svelte-1remv7x:hover{opacity:.8}.activity-img.svelte-1remv7x{width:98%}.activity-container.svelte-wh6wcg.svelte-wh6wcg{cursor:pointer;width:100%}.activity-container.svelte-wh6wcg .activity-img.svelte-wh6wcg{width:98%}.activity-container.svelte-wh6wcg .activity-content.svelte-wh6wcg{margin-top:8px;width:100%}.activity-container.svelte-wh6wcg .activity-header.svelte-wh6wcg{display:flex;justify-content:space-between;gap:12px;align-items:center}.activity-container.svelte-wh6wcg .activity-title.svelte-wh6wcg{margin-bottom:6px;font-weight:700}.activity-container.svelte-wh6wcg .activity-desc.svelte-wh6wcg{margin:8px 0;font-size:12px}.activity-container.svelte-wh6wcg .activity-date.svelte-wh6wcg{font-size:12px}.activity-container.svelte-hd8iy{display:flex;flex-direction:column;width:100%;align-items:center}.activity-title.svelte-hd8iy{margin-bottom:12px;text-align:center}.activity-desc.svelte-hd8iy{margin-bottom:20px;text-align:center;font-size:12px;color:#888}.activity-list.svelte-hd8iy{width:80%;margin:0 auto}.activity-item.svelte-hd8iy{margin:8px 0}.item-link.svelte-hd8iy{color:#00f;cursor:pointer}.item-link.clickable.svelte-hd8iy:hover{text-decoration:underline}.copy-link.svelte-hd8iy{margin-left:-3px;cursor:pointer;color:#00f}.copy-link.svelte-hd8iy:hover{text-decoration:underline}.activity-grid.svelte-tumn8m{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;padding:1rem}.activity-item.svelte-tumn8m{display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:.375rem;padding:8px;box-shadow:0 2px 5px #0000001a;cursor:pointer}.activity-item.svelte-tumn8m:hover{box-shadow:0 4px 10px #0003}.activity-title.svelte-1xq8gez{cursor:pointer;color:#f56565;text-decoration:underline;font-size:14px}.modal-content.svelte-1xq8gez{display:flex;flex-direction:column;align-items:center;gap:1rem}.tab-header.svelte-1xq8gez{margin-bottom:1rem;display:flex;gap:1rem}.tab-button.svelte-1xq8gez{cursor:pointer;border-radius:.25rem;background-color:#4f91c8;padding:.5rem 1rem;font-size:.875rem;font-weight:600;box-shadow:0 2px 5px #0003;transition:background-color .3s ease;color:#fff;border:none}.tab-button.svelte-1xq8gez:hover{background-color:#1467b4}.tab-button.selected.svelte-1xq8gez{background-color:#0b498b;color:#fff}.tab-content.svelte-1xq8gez{overflow:auto}article.svelte-6pxzag{color:#fff;padding:.75rem 1.5rem;border-radius:.2rem;display:flex;align-items:center;margin:0 auto .5rem;width:20rem}.error.svelte-6pxzag{background:#cd5c5c}.success.svelte-6pxzag{background-color:#ff583c}.info.svelte-6pxzag{background:#87ceeb}.text.svelte-6pxzag{margin-left:1rem}.close.svelte-6pxzag{cursor:pointer}button.svelte-6pxzag{color:#fff;background:transparent;border:0 none;padding:0;margin:0 0 0 auto;line-height:1;font-size:1rem}section.svelte-12fd4jl{position:fixed;top:0;left:0;right:0;width:100%;display:flex;margin-top:1rem;justify-content:center;flex-direction:column;z-index:100000000}.container.svelte-ykcexl.svelte-ykcexl{margin:10px 0;font-family:Microsoft YaHei;font-size:16px}.container.svelte-ykcexl .coupon-box.svelte-ykcexl{display:inline-flex;flex-direction:column;align-items:center;background-color:#dfd5ca;box-shadow:0 0 2px 1px #dfd5ca;border-radius:10px;color:#b27e52;padding:12px 16px}.container.svelte-ykcexl .coupon-box .title.svelte-ykcexl{font-size:30px;font-weight:700;margin-bottom:20px;line-height:1.1}.container.svelte-ykcexl .coupon-box .coupon.svelte-ykcexl{display:flex;align-items:center;justify-content:center;padding:10px 20px;background-image:linear-gradient(to right,#e8ceb6,#d19568);box-shadow:0 0 2px 1px #e8ceb6;border-radius:8px;cursor:pointer}.container.svelte-ykcexl .coupon-box .coupon .left.svelte-ykcexl{display:flex;align-items:center;font-weight:700;word-break:normal}.container.svelte-ykcexl .coupon-box .coupon .left .symbol.svelte-ykcexl{color:#5e391d;font-size:20px;align-self:flex-end}.container.svelte-ykcexl .coupon-box .coupon .left .price.svelte-ykcexl{color:#ab6f41;font-size:50px;margin-right:4px;line-height:.9}.container.svelte-ykcexl .coupon-box .coupon .left .unit.svelte-ykcexl{color:#785539;font-size:14px;align-self:flex-start}.container.svelte-ykcexl .coupon-box .coupon .middle.svelte-ykcexl{width:2px;height:60px;background-color:#aa896f;margin:0 10px}.container.svelte-ykcexl .coupon-box .coupon .right.svelte-ykcexl{display:flex;flex-direction:column;align-items:baseline}.container.svelte-ykcexl .coupon-box .coupon .right .desc.svelte-ykcexl{color:#372312;line-height:1;margin-bottom:6px}.container.svelte-ykcexl .coupon-box .coupon .right .time.svelte-ykcexl{line-height:1;margin-bottom:6px}.container.svelte-ykcexl .coupon-box .coupon .right .remain.svelte-ykcexl{line-height:1}.container.svelte-ykcexl .coupon-box .qrcodezk.svelte-ykcexl{margin-top:20px;display:flex;justify-content:space-between;align-items:center;font-size:16px}.container.svelte-ykcexl .coupon-box .action.svelte-ykcexl{margin-top:20px}.container.svelte-ykcexl .coupon-box .action button.svelte-ykcexl:first-child{margin-right:10px}.container.svelte-ykcexl button.svelte-ykcexl{border-radius:8px;border:0px solid transparent;padding:.6em 1.2em;font-size:16px;font-weight:700;font-family:inherit;background-image:linear-gradient(to right,#cf9a5d,#a26233);color:#fff;cursor:pointer;transition:border-color .25s}.container.svelte-ykcexl button.svelte-ykcexl:hover,.container.svelte-ykcexl button.svelte-ykcexl:focus{border-color:#a26233;box-shadow:0 0 8px #0003}.container.svelte-ykcexl button.svelte-ykcexl:active{box-shadow:0 0 4px #0003;transform:scale(.98);border-color:#8c4f26} ");

(function (CryptoJS, EasyQRCode) {
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
  const identity = (x) => x;
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
  function null_to_empty(value) {
    return value == null ? "" : value;
  }
  const is_client = typeof window !== "undefined";
  let now = is_client ? () => window.performance.now() : () => Date.now();
  let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
  const tasks = /* @__PURE__ */ new Set();
  function run_tasks(now2) {
    tasks.forEach((task) => {
      if (!task.c(now2)) {
        tasks.delete(task);
        task.f();
      }
    });
    if (tasks.size !== 0) raf(run_tasks);
  }
  function loop(callback) {
    let task;
    if (tasks.size === 0) raf(run_tasks);
    return {
      promise: new Promise((fulfill) => {
        tasks.add(task = { c: callback, f: fulfill });
      }),
      abort() {
        tasks.delete(task);
      }
    };
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function get_root_for_style(node) {
    if (!node) return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && /** @type {ShadowRoot} */
    root.host) {
      return (
        /** @type {ShadowRoot} */
        root
      );
    }
    return node.ownerDocument;
  }
  function append_empty_stylesheet(node) {
    const style_element = element("style");
    style_element.textContent = "/* empty */";
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
  }
  function append_stylesheet(node, style) {
    append(
      /** @type {Document} */
      node.head || node,
      style
    );
    return style.sheet;
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
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
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
  const managed_styles = /* @__PURE__ */ new Map();
  let active = 0;
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i--) hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
    return hash2 >>> 0;
  }
  function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
  }
  function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = "{\n";
    for (let p = 0; p <= 1; p += step) {
      const t = a + (b - a) * ease(p);
      keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
      rules[name] = true;
      stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || "";
    node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
  }
  function delete_rule(node, name) {
    const previous = (node.style.animation || "").split(", ");
    const next = previous.filter(
      name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
      // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
      node.style.animation = next.join(", ");
      active -= deleted;
      if (!active) clear_rules();
    }
  }
  function clear_rules() {
    raf(() => {
      if (active) return;
      managed_styles.forEach((info) => {
        const { ownerNode } = info.stylesheet;
        if (ownerNode) detach(ownerNode);
      });
      managed_styles.clear();
    });
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
  let promise;
  function wait$1() {
    if (!promise) {
      promise = Promise.resolve();
      promise.then(() => {
        promise = null;
      });
    }
    return promise;
  }
  function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
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
  const null_transition = { duration: 0 };
  function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: "both" };
    let config = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    let original_inert_value;
    function clear_animation() {
      if (animation_name) delete_rule(node, animation_name);
    }
    function init2(program, duration) {
      const d = (
        /** @type {Program['d']} */
        program.b - t
      );
      duration *= Math.abs(d);
      return {
        a: t,
        b: program.b,
        d,
        duration,
        start: program.start,
        end: program.start + duration,
        group: program.group
      };
    }
    function go(b) {
      const {
        delay = 0,
        duration = 300,
        easing = identity,
        tick = noop,
        css
      } = config || null_transition;
      const program = {
        start: now() + delay,
        b
      };
      if (!b) {
        program.group = outros;
        outros.r += 1;
      }
      if ("inert" in node) {
        if (b) {
          if (original_inert_value !== void 0) {
            node.inert = original_inert_value;
          }
        } else {
          original_inert_value = /** @type {HTMLElement} */
          node.inert;
          node.inert = true;
        }
      }
      if (running_program || pending_program) {
        pending_program = program;
      } else {
        if (css) {
          clear_animation();
          animation_name = create_rule(node, t, b, duration, delay, easing, css);
        }
        if (b) tick(0, 1);
        running_program = init2(program, duration);
        add_render_callback(() => dispatch(node, b, "start"));
        loop((now2) => {
          if (pending_program && now2 > pending_program.start) {
            running_program = init2(pending_program, duration);
            pending_program = null;
            dispatch(node, running_program.b, "start");
            if (css) {
              clear_animation();
              animation_name = create_rule(
                node,
                t,
                running_program.b,
                running_program.duration,
                0,
                easing,
                config.css
              );
            }
          }
          if (running_program) {
            if (now2 >= running_program.end) {
              tick(t = running_program.b, 1 - t);
              dispatch(node, running_program.b, "end");
              if (!pending_program) {
                if (running_program.b) {
                  clear_animation();
                } else {
                  if (!--running_program.group.r) run_all(running_program.group.c);
                }
              }
              running_program = null;
            } else if (now2 >= running_program.start) {
              const p = now2 - running_program.start;
              t = running_program.a + running_program.d * easing(p / running_program.duration);
              tick(t, 1 - t);
            }
          }
          return !!(running_program || pending_program);
        });
      }
    }
    return {
      run(b) {
        if (is_function(config)) {
          wait$1().then(() => {
            const opts = { direction: b ? "in" : "out" };
            config = config(opts);
            go(b);
          });
        } else {
          go(b);
        }
      },
      end() {
        clear_animation();
        running_program = pending_program = null;
      }
    };
  }
  function ensure_array_like(array_like_or_iterator) {
    return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--) old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = /* @__PURE__ */ new Map();
    const deltas = /* @__PURE__ */ new Map();
    const updates = [];
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key2 = get_key(child_ctx);
      let block = lookup.get(key2);
      if (!block) {
        block = create_each_block2(key2, child_ctx);
        block.c();
      } else {
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key2, new_blocks[i] = block);
      if (key2 in old_indexes) deltas.set(key2, Math.abs(i - old_indexes[key2]));
    }
    const will_move = /* @__PURE__ */ new Set();
    const did_move = /* @__PURE__ */ new Set();
    function insert2(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert2(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert2(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
    }
    while (n) insert2(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
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
  let link = "https://hy.yunhaoka.com/#/pages/micro_store/index?agent_id=1e2ccde37dc0ef93";
  const getCardLink = () => {
    return link;
  };
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
  async function openNewTab(url, active2 = true) {
    if (_GM_openInTab) {
      _GM_openInTab(url, { active: active2 });
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
  function create_fragment$h(ctx) {
    let div;
    let span;
    let mounted2;
    let dispose;
    return {
      c() {
        div = element("div");
        span = element("span");
        span.textContent = "🔥大流量卡，免费领（运营商直发）";
        attr(span, "class", "card-link svelte-v5fmoh");
        attr(div, "class", "ck-container svelte-v5fmoh");
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
  function instance$g($$self, $$props, $$invalidate) {
    let $coupon;
    component_subscribe($$self, coupon, ($$value) => $$invalidate(0, $coupon = $$value));
    function handleGo(link2) {
      if (link2) {
        openWindow(link2);
      }
    }
    const click_handler = () => handleGo(($coupon == null ? void 0 : $coupon.card) ?? getCardLink());
    return [$coupon, handleGo, click_handler];
  }
  class Card extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$g, create_fragment$h, safe_not_equal, {});
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
  var PluginType = /* @__PURE__ */ ((PluginType2) => {
    PluginType2["BASE"] = "0";
    PluginType2["COUPON"] = "1";
    PluginType2["COMPARE"] = "2";
    PluginType2["PROMOTION"] = "3";
    PluginType2["ALLINONE"] = "5";
    PluginType2["TOOL"] = "6";
    return PluginType2;
  })(PluginType || {});
  const PluginName = "1";
  const PluginClassName = "emajueenrr";
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
    const now2 = Date.now();
    const split = random == 0 ? "," : "-";
    const data = [
      split,
      index0,
      splits[random] + split,
      index1,
      splits[random] + split,
      now2
    ];
    const key2 = "jason";
    const token = CryptoJS__namespace.AES.encrypt(data.join(""), key2).toString();
    const keyMap = getKeyMap(words2, now2, split, key2);
    return {
      token,
      keyMap
    };
  }
  function getKeyMap(words2, now2, split, key2) {
    const data = [split, words2, now2];
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
  const getTmallCouponUrl = `${baseUrl}/taobao/coupon`;
  const getJdCouponUrl = `${baseUrl}/jd/coupon`;
  const getVipCouponUrl = `${baseUrl}/vip/couponV2`;
  const getTransformLink = `${baseUrl}/${transformLink}`;
  const getHisPrice = `${baseUrl}/tools/goods-his`;
  const getActivitySets = `${baseUrl}/activity/sets2`;
  const checkClear = `${baseUrl}/config/clear`;
  const vwC = `${baseUrl}/vw/c`;
  const vwB = `${baseUrl}/vw/b`;
  const vwLvt = `${baseUrl}/${lvt}`;
  const checkVersion = `${baseUrl}/version/check`;
  const API = {
    getTmallCouponUrl,
    getJdCouponUrl,
    getVipCouponUrl,
    getTransformLink,
    getHisPrice,
    getActivitySets,
    checkVersion,
    checkClear,
    vwC,
    vwB,
    vwLvt
  };
  function create_if_block$a(ctx) {
    let div2;
    let div0;
    let t0;
    let t1;
    let t2;
    let t3;
    let t4;
    let t5;
    let div1;
    let t6;
    let t7;
    let t8;
    let t9;
    let t10;
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        t0 = text("历史最高价：");
        t1 = text(
          /*max*/
          ctx[0]
        );
        t2 = text("（");
        t3 = text(
          /*max_date*/
          ctx[3]
        );
        t4 = text("）");
        t5 = space();
        div1 = element("div");
        t6 = text("历史最低价：");
        t7 = text(
          /*min*/
          ctx[1]
        );
        t8 = text("（");
        t9 = text(
          /*min_date*/
          ctx[2]
        );
        t10 = text("）");
        attr(div0, "class", "high-price svelte-1cy8qli");
        attr(div1, "class", "low-price svelte-1cy8qli");
        attr(div2, "class", "price-container svelte-1cy8qli");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, t0);
        append(div0, t1);
        append(div0, t2);
        append(div0, t3);
        append(div0, t4);
        append(div2, t5);
        append(div2, div1);
        append(div1, t6);
        append(div1, t7);
        append(div1, t8);
        append(div1, t9);
        append(div1, t10);
      },
      p(ctx2, dirty) {
        if (dirty & /*max*/
        1) set_data(
          t1,
          /*max*/
          ctx2[0]
        );
        if (dirty & /*max_date*/
        8) set_data(
          t3,
          /*max_date*/
          ctx2[3]
        );
        if (dirty & /*min*/
        2) set_data(
          t7,
          /*min*/
          ctx2[1]
        );
        if (dirty & /*min_date*/
        4) set_data(
          t9,
          /*min_date*/
          ctx2[2]
        );
      },
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
      }
    };
  }
  function create_fragment$g(ctx) {
    let if_block_anchor;
    let if_block = (
      /*max*/
      ctx[0] && /*max*/
      ctx[0] != 0 && create_if_block$a(ctx)
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
          /*max*/
          ctx2[0] && /*max*/
          ctx2[0] != 0
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$a(ctx2);
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
  function instance$f($$self, $$props, $$invalidate) {
    let { url = location.href } = $$props;
    let max = 0;
    let min = 0;
    let min_date = "";
    let max_date = "";
    let history = [];
    async function getHis(url2) {
      if (!url2 || url2 === "") return;
      const json = await get(API.getHisPrice, { url: url2 });
      if (json && json.data) {
        $$invalidate(0, max = json.data.max);
        $$invalidate(1, min = json.data.min);
        history = json.data.his;
        const maxItem = history.find((item) => item.price == max);
        const minItem = history.find((item) => item.price == min);
        $$invalidate(3, max_date = maxItem ? maxItem.updatetime : "");
        $$invalidate(2, min_date = minItem ? minItem.updatetime : "");
      }
    }
    onMount(() => {
      getHis(url);
    });
    $$self.$$set = ($$props2) => {
      if ("url" in $$props2) $$invalidate(4, url = $$props2.url);
    };
    return [max, min, min_date, max_date, url];
  }
  class HisPrice extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$f, create_fragment$g, safe_not_equal, { url: 4 });
    }
  }
  function create_fragment$f(ctx) {
    let div1;
    let div0;
    return {
      c() {
        div1 = element("div");
        div0 = element("div");
        set_style(div1, "padding", "6px");
        set_style(div1, "background-color", "white");
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
  function instance$e($$self, $$props, $$invalidate) {
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
      init(this, options, instance$e, create_fragment$f, safe_not_equal, {
        url: 1,
        width: 2,
        height: 3,
        logo: 4,
        logoWidth: 5
      });
    }
  }
  function create_fragment$e(ctx) {
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
  function instance$d($$self, $$props, $$invalidate) {
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
      init(this, options, instance$d, create_fragment$e, safe_not_equal, {});
    }
  }
  function create_if_block$9(ctx) {
    let portal;
    let current;
    portal = new Portal({
      props: {
        $$slots: { default: [create_default_slot$3] },
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
  function create_default_slot$3(ctx) {
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
        attr(button, "class", "close-button svelte-qp8tkm");
        attr(div1, "class", "content-slot svelte-qp8tkm");
        attr(div2, "class", "modal-content svelte-qp8tkm");
        set_style(div2, "max-width", "90%");
        attr(div3, "class", "modal-overlay svelte-qp8tkm");
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
  function create_fragment$d(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*show*/
      ctx[0] && create_if_block$9(ctx)
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
            if_block = create_if_block$9(ctx2);
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
  function instance$c($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { show = false } = $$props;
    let { title: title2 = "微信扫码购买" } = $$props;
    const dispatch2 = createEventDispatcher();
    function closeModal() {
      dispatch2("close");
    }
    function click_handler(event) {
      bubble.call(this, $$self, event);
    }
    $$self.$$set = ($$props2) => {
      if ("show" in $$props2) $$invalidate(0, show = $$props2.show);
      if ("title" in $$props2) $$invalidate(1, title2 = $$props2.title);
      if ("$$scope" in $$props2) $$invalidate(5, $$scope = $$props2.$$scope);
    };
    return [show, title2, closeModal, slots, click_handler, $$scope];
  }
  class Modal extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$c, create_fragment$d, safe_not_equal, { show: 0, title: 1 });
    }
  }
  var ActivityType = /* @__PURE__ */ ((ActivityType2) => {
    ActivityType2["TEXT"] = "text";
    ActivityType2["IMG"] = "img";
    ActivityType2["IMAGETEXT"] = "imgtext";
    return ActivityType2;
  })(ActivityType || {});
  function create_if_block$8(ctx) {
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
        attr(img, "class", "activity-img svelte-1remv7x");
        attr(div, "class", "svelte-1remv7x");
        toggle_class(
          div,
          "clickable",
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
            "clickable",
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
  function create_fragment$c(ctx) {
    let if_block_anchor;
    let if_block = (
      /*activityItem*/
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
      },
      p(ctx2, [dirty]) {
        if (
          /*activityItem*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$8(ctx2);
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
  function instance$b($$self, $$props, $$invalidate) {
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
      init(this, options, instance$b, create_fragment$c, safe_not_equal, { activityItem: 0, platform: 1 });
    }
    get platform() {
      return this.$$.ctx[1];
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
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAAAnCAYAAABtyERkAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAXaADAAQAAAABAAAAJwAAAABorNOCAAASTklEQVRoBc2bd6wkR/HHq2f3PRswPmMyJtwZW2QwiAzGh7FIskAEg8hCIMwRJQsBRoB+CJAFf1iIIGMDIgoJmZzDyYQDkTMmY3IGc2cb8L3b6fl9PzVd83rn7e4dPunHr6V9NdNdXVVdXal77pKV1p1xxrrt3Xua5fx0dZ3cmR2TYjBgUk+nkcOFQQ9Y0epEO+ndoYbEyVyGCocpi9rSuTVyTedw1rGE5lgGoe3Vb481zRvtmGN2pwsv3GCqr6k77bRtUvY5WvHT1DdhYGiVcKEEYN0GRYXCClyGU/fPCVrPFxLCOa9KhmW86v6afm0k/w35iyyt5LhAyj877d69L3U7dx6ZUzq3mUx2SfFbFjm3gP/WyzILreU5FJwa///wGYOQwi2bndfMZmc1su5TG7Mzu9lMOlc3P1qBWCJtDL0z/hQctyqe49dPDKxNWOPXOFW/89O7Q4yBsVWyHQqOeMU6NoXxzv4VHvWPXt7HLfpWwFr+Dtna1pqcz0TfUw3uYh9AGlzUeeldkB+MgUx2nICL5tQhIuYJuvBhjYUmwOlWeMN7RSfw+mlFllVzhOjrKfT/P8jv6++6RprYlfIpp+yVgNtYUDT21hc/gtL4vPLiPSZqM5w474xNlB5QeOABteNzOHK7ha2eU9MI5JoXfeAXWldZ/qBdQ+StZeGZ38FaPaeSX0a7byrr3TYmEiTHkBCURCCsqBPhNJ327IHXuY55n3q6Awcs/eMf5nPAgDFKueENB+X4+9/+ZnbllVsWssWrind5iEERO3aYXfvam5u6tmZ2ySVmf/+7ltNLvkX+8NAR7BfQ/x08HvmvcQ3rTjxxc43If/nlPR82fUVbJj/6JrysmCpdaNQtB4Xf9raW7nhHXxR9jQTIH/uYmQRUSWTNi15k6fjjXYFp3z7r9G4/+YnZ+rrHtHSrW1l65Sv93ZlecYV1L3yhdT/7mSUpzfkUfowPsoWMUrZv5sknWzrrLEs3upGTcdwf/9jyi1/ce1JliYP8Qqo3YzCcoD1QEl+MQLTTk59s6SEPcR04j/37rXvVq6z74Q97I8HoNOBy63mQPzwuaFcQvr2ZRmdh7AJBhH4guypB0t3uZukpT3EstyJZlX3yk2YSxv74R+u++lVr7nCHnspRR1l3+9ub/ehHljc2LCHIwx5mSd4QLX/ta5a1KXgLSRya2I/TFl/3Dr27HCj8Wtey9IQnWHroQ90Kg073+99bfstbeoVLWVvkL+vr8AIZSChn4AUhcFinQmK6170sPeMZlk44IVj4WPfZz1r3y1+a3eIWfb/wXW6g5hMF8r/+ZQm9sF5ols1wFoXalAGECARgnSz9fZtCPlZ17LFlWgH//nc/T8qwa17T7NJLe6vH1dXSfe/bWwWbolCQZKFDo08Wbtu3e0gwaKHo0tw9tRi3bPje9a7WPO5xhreMW7re9WyClRcLG4/zDr387Geb/fSnQ7hwbihGRmHITCg54wxr7n9/syOOmCcj2s0pp+jYWK3BCbv2Btz8hS9YJ1m6q11tTo9hCCB6eIE5Uz1e04sgBfri73lPa84+e8uiwOqw4kc+0hpZxrilO93JGiywtE2VqkOLSrt22US/9jnPMfv6160rSnMBRdctGxqybJMMc/ODKBCFYRgrms8VffeaWB9hEcu+9a3Ndu60Bk9UmFzapMiDNuFQHrpOMWBN8PUUyPxNS6eTHjV3FVmdQ6xNoSNRiSxqJDWFh2UKWdYPKR8TfWi7m+KKCIxlK5ZOTj21d/Exb81xwyib5GKhSPrpq/srmT1Msh54CiexkVJ0c7vbbfVi5imPOa3KA50HvKKAqOj7I/pAd/AoOqQ/dEufK9072RV1hBu4YPH+l78Mgjrh+g8LVfy+yg0FYfXi70qhalDMnDxNNxJjZYtJ/t73zJQ7ul/9qq8ksHIt1KukHTusedSjLN3kJlvEyeSeP/3JvQleJPf0xCdaI08at07rzV/6koe/7g9/8A3yqoxEqjDa3Oc+lhSCxobIvG73buuK3L4e6dCtXUzcyMR78pLjjvufMdOwzkBKWIcIunKqisEuu8zy+95ndvTRbhGJEq6KhZ2SaPftb1v3i19Y9/Ofe+xM173uJjslnfzlL1u3Z491f/2rWwhW0kk56aY3tXTzmw+4nWJx/vjHPVkTtqhcus99zt875QOSXkOYq+YwmbF84YWWX/OafpPCC6hQVK56nNYGOC7V2Oc/7xUZCk3ytO7Xv7buU5/qy0Sts3nAAyw98IFDXvCJ+oMxZFVmndbj4S4GFsDB0uuxcAWHKEHCdG9+syUs+s53rlGtw80+8hFrxSy9/vVupYHQslj9vByUNU6UpCbEz9KoJtpXv9qoPhJlZXib4nl77rlmN7iBl6L57W+37qKLzLZvt7XXvW7wrKSwkL/yFWsoYylVRy3LI/Jb32rdN77hG0rOGPIW65I1t297mydo6OcPfMCyav3py19ujRROa255S8usWbHaK7NRzO8wvHe9y9fZ7d27uQ7NRX9hwNCKtrBOBzEmBLQjj1y4g46rBfghKawoqBPfZDG4m4eu8bjmeQgB4vLRUIgsf0aCpf/PfzbnLxmyPKcpFUQ67jibPOIRMWuAWaGne+97LcsYUAqyER6gFVxCnvyOd1j7oQ9ZIjRQxagSyyoN0z3uYYnEKZkbWfaWJkNs5aH5ne/szxnISagr6wg+Aev5bulzsbwSjAmuVGAhVk/m2auBcWe8Ux1UQkBrS2McnoEHpJxkk7VoykEvNVXONYr1i0rGoEmcz5/4hLUf/rBxbvAEj8KFEBYe66EUdb7y3qTKJ8miCWfOAz4l5ATtAf7zn+bnC7zii1/su7UxXnmxjkAMQxpDjbulzy2YSSy8QvZxMjm/usFEP4/59JcEMqBQ9pHFC57THQb7BxeScRIyuIrV02c+02O65woUcpByEErkgZbDi2p/VwCyiK6PAVmPmvfIAxuS6L3v3VdK8OCssawi8Zn6o43ykEUO0mma/OUlM3SRv9LZsMlFhkEW4Q4xfc7aNTBYBJPErCMB1klUOLEQHoOoP5c/7q6a7xuzBId5selOgwR3/ev7lUNNa+6ZakX3OlQgHMqQnQQ91eGJpL2hKwK/I8ECa2XzjGLplwE1OnCtasRoLxHxBnhpLqGtUeiZ6fyRpXwPn4XHQAv6FBTqZ5NDl/22V0qPhY8hikgSbvrUp1pz97sPdIcH7bBXDyhr3DhlqkJxxRLfcem6saGEEuZe/eq9MrBYxdjmpJO2eE73299aVhXkoU7XCWnHDle4k8Sy9cu/+U0/l1IQ66MB+bHBxHt5AyVk95jHbCkvyQHuLZyudeFF3mgieaJcxW3Wywma8nSgz1qCH1WQco+vrSgePDaAlq486STQ53bDLRNkjRA6OKmtvexlPqH+wz3ExvOeZ1PV1NTGxMRUlYyZYz7Wop33JkU1N7vZJgkpPFNO/u53NlNV4rU3o3L1daoUKhpdLmVdZqHwRjwaXS0k0UAZ/3HTemaqhGaqmLBaqilkz9//fr8RXBGwZoWdRpd7zfbtfW4ZM0JjbMCSRpm5ISP1MltrBzN0zJSheqGTNkAIl0biwJ097kUnEAGlZKwyKSSMW6Pkt7IxVyVkx3Uv5SiWghvLyjZ0sWUKGenGN7aJ3BkF+YZVm7qS9qJBFMV88eFEOnv3uz3xUpr6gUzXDRM8hHukFUpdOQZfigDmo8PYoAIx5Pm7F+FvqnpTaurp2fvfb9MHPcgStXNYrgh7FUCpdThN8RUleGiDlg5GxGfqYq8qKMUWNRI1rh6LI9ETEghVyxqhTPgk2ykbqXocq65vP8dTOadEeHKIcXCBt2xjCKOE0yKXr0tEgejXEykPtQvU775jErQ97zw/9k6f9KQ5mbgrQahE7B4vVgohYYVlcEiqT6y+AJSguZ79i1BJypzc736W8IAFDa9rP/MZa3Uw6hTDmY/HcSW7duaZC2aoS3K0KvNa6mq8CcXIkyY7dy7Gl1yEx1YlaL74YvNrYZQoz5vqentSXVHXBLJC7uyccyzrnBHFST3Os1K5WlmsP3qHugLCSI2F+o7Xu6u4yGXYfoWCRqe2I84/v8wSvjZiQ1ep+Qc/6EOGrGP62MfaGgee0jodevY/97nW8cWHzaGyUOOEekAxff0Vr9j0KmRUEmx1ikQZE91/rCvPtB/9qNflzemn2/ThD+8PNIV+AHLGhq4B8qc/vclH/GY6LTfa3LlTskJbVh5pdUXLCXyiZNuoPJxpPl+Sps96Vh/rg3iBnfJTq+Q806kcfgurGnClPz7XbbHyEb3+FWWHy1SKx2WShBrHdDaDk6HxdUjK9Foeq64bisR19evkBYO3Cb/VF6mWjwnKF62U1X3rW9aS8FTdrMvrJkqotKmUMn30ozc3p6LPF6CZTqYzHdPZWL9qUFhxWYCScfamN1l6wQss87GFexd4cOrVBq6rP84ezRvesOW+JVixSRsa97sg9BHnFT3T+Btrw8A3w4sU6QocQZ/FH+KYBI1QQZeTpIZnAeOLJi2o4/snc1AuAhQhmOut9DkdcKIbXrKc/S99qSUu00THP2ZQixOH5eJzDR51kxUTEjbkLdzNxEcKl0F4Az/N8/Dxne/0hx0MQEmw0ReyCR8skKMocPgWXPHxXCdvmb3nPb11Ez6L/io0dc3r1v05FBLC+EQYCtkZY6FaCJXEXNOR2PgJj+Pz0KRALMcPKHJJb2OF01mU3iOUdxSIolU2NpxEVRVNKN9k8Vw++SYME0YPkrmVR8x089nqRjLq5PpOZJgh5ULL7+75viujmcBDnxgbytHxRg4TpRIZVCuvmHGZpvLQG3ki1iiILmvrrnXLx0kfZCJINLf4gLr/mD7+8V5JTEafqvJ3v9snSn10qK9UO32UJvYSMkKxfiwmblfNkyeJGBn0AzZS9vT5z7eJckRDpRSuWs0bP3Ikb3VLSEx1vrJYEmucRt1wNCmUkMRz8uAH25qKAqqxRIl4CI3zwkzJeCaFc9XMZnrVBW3kBxaFQ84VPYKMD3U6SHUbJih8ULGMXRp3P/DBD3qcn+iKtf7MlSVQy3UqiZHdD5cbKd0/PpQ8Ea6fOUypGnFrqwUaPVMqEr6oYg7oNtE4ZGmzvTriUAXfUatvGrHQg54jMAhtaFb4Ya1Za+Kjhq8Jy1YLPsEt4DikxDvjHl589rI/iq0ciymVonVSysZrX2utEg7Ww02gl43lw/UBHTr8IkiWEF7jgo4VgSfIQoZGONMiZwoNa4rdUc0wDn2ue7MSaad4PaOKkTL8mgEahAOuYlc09ygMQDit5s5UoUxVBQ1NhpTJH3w5UumXv/lNm5ETKEtDTgwJOQ/S3IvhxbwKMi1dfuKJMoD5QD+m19zlLjblckiuziUQ2Tordvr3TBarXW/4cqOQgKseuOACT14sLlwapSedUKcc49XvFqEFzviMRp0eC2FjRG+df9eiko06nPsUVwTJWeVkJEa/J4fHQeQfr4d3Qgx3SWuqfrKuGPxeR1ZMGZuxZi7UtDbnMYrvY37xXvOJvjF03ijdrZBFs+BFkLAQSuGZ3eM4HX3M4ySJcOWYvZAOoYS5wQcJsJxowZtxjtJAEnXwB7e2tKBzVSA84QcfbbpfutEHffIIv0Ohy5xoIf8qKNx0+QknKIjaNi1vsMCwRKA3mNcNooua8DycSPke6yrmA81DpOWhQDxcrkIPq1nWVsq/dJJmhWILbZdfz0vlX0Zr1F/Tqa1daPumWsYeZdTT22CO4gqBgCN6m4KWOYNCA5F+frQCg5bDMo8xnwssCw2IFcbC5+JiT9X/Bi7Q+RQ4x6vCn3us5gwygFDkHcM5mrX8Rc5aloVyw09ermpnT9PmfJ4WlZ0xrr+C8ZwgESYEXSkBJZC/I1j1iz6HrK3wWgaHxAVd6ARkLu8raMzJ6YhFZWWej8M/6PIM/dIX0MfB0S/6lsk77h/LT6koOhl9N5fmfFGb0vlHqLNWfBBxxosEp+9gDUa0Q4TBcwyRi+awyDmmOZ4T72O84b0nufrvIcodNIPnGCrTmTKg6X+8nI++fR2XHn/8tqZtz5nwf466bkIlES6yVCoEqlzUGfNet/8QZ85FRQdqvm01nZr+Iv417lieeu4YL94PA2eR/EUjlBAXZP2fo2MvuWTfoKXuNrdZv+yKK06T4p+uf07n/7uu5r/lOYQcQTZrjnl5r+cvxRnRWriRNaHDeV7Ca6lsFa+lOCOaUu7eJqU9ypdvPPqoo3aniy9WiWf2v/Wa00L0k+GHAAAAAElFTkSuQmCC";
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
  function create_if_block$7(ctx) {
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
      ctx[0].desc != "" && create_if_block_3$1(ctx)
    );
    let if_block1 = (
      /*activityItem*/
      ctx[0].activity_date && /*activityItem*/
      ctx[0].activity_date != "" && create_if_block_2$2(ctx)
    );
    let if_block2 = (
      /*activityItem*/
      ctx[0].short_url && /*activityItem*/
      ctx[0].short_url != "" && create_if_block_1$3(ctx)
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
        attr(img, "class", "activity-img svelte-wh6wcg");
        attr(h4, "class", "activity-title svelte-wh6wcg");
        attr(div1, "class", "activity-header svelte-wh6wcg");
        attr(div2, "class", "activity-content svelte-wh6wcg");
        attr(div3, "class", "activity-container svelte-wh6wcg");
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
            if_block0 = create_if_block_3$1(ctx2);
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
            if_block1 = create_if_block_2$2(ctx2);
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
            if_block2 = create_if_block_1$3(ctx2);
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
  function create_if_block_3$1(ctx) {
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
        attr(p, "class", "activity-desc svelte-wh6wcg");
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
  function create_if_block_2$2(ctx) {
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
        attr(p, "class", "activity-date svelte-wh6wcg");
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
  function create_if_block_1$3(ctx) {
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
  function create_fragment$b(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*activityItem*/
      ctx[0] && create_if_block$7(ctx)
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
            if_block = create_if_block$7(ctx2);
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
  function instance$a($$self, $$props, $$invalidate) {
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
      init(this, options, instance$a, create_fragment$b, safe_not_equal, { activityItem: 0, platform: 1 });
    }
  }
  function get_each_context$3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_if_block$6(ctx) {
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
      each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
        attr(h3, "class", "activity-title svelte-hd8iy");
        attr(p, "class", "activity-desc svelte-hd8iy");
        attr(div0, "class", "activity-list svelte-hd8iy");
        attr(div1, "class", "activity-container svelte-hd8iy");
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
            const child_ctx = get_each_context$3(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$3(child_ctx);
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
  function create_each_block$3(ctx) {
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
        attr(span0, "class", "svelte-hd8iy");
        toggle_class(
          span0,
          "item-link",
          /*item*/
          ctx[4].startsWith("https")
        );
        toggle_class(
          span0,
          "clickable",
          /*item*/
          ctx[4].startsWith("https")
        );
        attr(span1, "class", "copy-link svelte-hd8iy");
        attr(p, "class", "activity-item svelte-hd8iy");
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
            "item-link",
            /*item*/
            ctx[4].startsWith("https")
          );
        }
        if (dirty & /*activityItem*/
        1) {
          toggle_class(
            span0,
            "clickable",
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
  function create_fragment$a(ctx) {
    let if_block_anchor;
    let if_block = (
      /*activityItem*/
      ctx[0] && /*activityItem*/
      ctx[0].list && /*activityItem*/
      ctx[0].list.length > 0 && create_if_block$6(ctx)
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
  function instance$9($$self, $$props, $$invalidate) {
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
      init(this, options, instance$9, create_fragment$a, safe_not_equal, { activityItem: 0, platform: 3 });
    }
    get platform() {
      return this.$$.ctx[3];
    }
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_if_block$5(ctx) {
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
        attr(div, "class", "activity-item svelte-tumn8m");
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
  function create_each_block$2(ctx) {
    let show_if = (
      /*getComponent*/
      ctx[2](
        /*item*/
        ctx[4].type
      )
    );
    let if_block_anchor;
    let current;
    let if_block = show_if && create_if_block$5(ctx);
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
  function create_fragment$9(ctx) {
    let div;
    let current;
    let each_value = ensure_array_like(
      /*data*/
      ctx[0]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
        attr(div, "class", "activity-grid svelte-tumn8m");
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
            const child_ctx = get_each_context$2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$2(child_ctx);
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
  function instance$8($$self, $$props, $$invalidate) {
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
      init(this, options, instance$8, create_fragment$9, safe_not_equal, { data: 0, platform: 1 });
    }
  }
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
  function get_each_context$1(ctx, list, i) {
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
  function create_if_block$4(ctx) {
    let div;
    let span;
    let t0;
    let t1_value = (
      /*activityList*/
      ctx[1].title + ""
    );
    let t1;
    let t2_value = (
      /*activityList*/
      ctx[1].hot ? "🔥" : ""
    );
    let t2;
    let t3;
    let t4;
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
        $$slots: { default: [create_default_slot$2] },
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
        t0 = text("（");
        t1 = text(t1_value);
        t2 = text(t2_value);
        t3 = text("）");
        t4 = space();
        create_component(modal.$$.fragment);
        attr(span, "class", "activity-title svelte-1xq8gez");
        set_style(div, "display", "inline-block");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span);
        append(span, t0);
        append(span, t1);
        append(span, t2);
        append(span, t3);
        append(div, t4);
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
        2) && t1_value !== (t1_value = /*activityList*/
        ctx2[1].title + "")) set_data(t1, t1_value);
        if ((!current || dirty & /*activityList*/
        2) && t2_value !== (t2_value = /*activityList*/
        ctx2[1].hot ? "🔥" : "")) set_data(t2, t2_value);
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
        attr(button, "class", "tab-button svelte-1xq8gez");
        toggle_class(
          button,
          "selected",
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
            "selected",
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
  function create_if_block_1$2(ctx) {
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
  function create_each_block$1(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*$activeTab*/
      ctx[2] === /*tabIndex*/
      ctx[12] && create_if_block_1$2(ctx)
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
            if_block = create_if_block_1$2(ctx2);
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
  function create_default_slot$2(ctx) {
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
      each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
        attr(div0, "class", "tab-header svelte-1xq8gez");
        attr(div1, "class", "tab-content svelte-1xq8gez");
        set_style(div1, "max-height", "450px");
        attr(div2, "class", "modal-content svelte-1xq8gez");
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
            const child_ctx = get_each_context$1(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
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
  function create_fragment$8(ctx) {
    var _a;
    let if_block_anchor;
    let current;
    let if_block = (
      /*activityList*/
      ctx[1] && /*activityList*/
      ((_a = ctx[1]) == null ? void 0 : _a.show) && create_if_block$4(ctx)
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
            if_block = create_if_block$4(ctx2);
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
  function instance$7($$self, $$props, $$invalidate) {
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
  class Container extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$8, safe_not_equal, {});
    }
  }
  function getCopyText(coupon2) {
    if (coupon2.couponInfo != null && coupon2.couponInfo != "") {
      let s = `发现了一件好物，快来看看吧~~${coupon2 == null ? void 0 : coupon2.couponInfo}`;
      if (coupon2.longTpwd != null && coupon2.longTpwd != "") {
        s += `，${coupon2 == null ? void 0 : coupon2.longTpwd}`;
      } else if (coupon2.shortUrl != null && coupon2.shortUrl != "") {
        s += `，${coupon2 == null ? void 0 : coupon2.shortUrl}`;
      }
      return s;
    } else if (coupon2.shortUrl != null && coupon2.shortUrl != "") {
      return `发现了一件好物，快来看看吧~~${coupon2 == null ? void 0 : coupon2.shortUrl}`;
    }
    return "";
  }
  function getPrice(couponInfo) {
    let price = couponInfo.split("减")[1];
    price = price.split("元")[0];
    return price;
  }
  function getScanText(platform2) {
    switch (platform2) {
      case Platform.Tmall:
        return "使用天猫/淘宝APP扫码";
      case Platform.JD:
        return "使用微信扫码";
      case Platform.Vip:
        return "使用微信扫码";
      default:
        return "";
    }
  }
  const toasts = writable([]);
  const addToast = (toast) => {
    const id = Math.floor(Math.random() * 1e4);
    const defaults = {
      id,
      type: "info",
      dismissible: true,
      timeout: 3e3
    };
    toasts.update((all) => [{ ...defaults, ...toast }, ...all]);
    if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
  };
  const dismissToast = (id) => {
    toasts.update((all) => all.filter((t) => t.id !== id));
  };
  function getToastMsg(platform2) {
    switch (platform2) {
      case Platform.Tmall:
        return "拷贝成功，可粘贴到微信后，手机复制到淘宝/天猫APP打开~";
      case Platform.JD:
        return "拷贝成功，可粘贴到微信后，手机复制到京东APP打开~";
      case Platform.Vip:
        return "拷贝成功，可粘贴到微信后，手机复制到唯品会APP打开~";
      default:
        return "";
    }
  }
  function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
    const o = +getComputedStyle(node).opacity;
    return {
      delay,
      duration,
      easing,
      css: (t) => `opacity: ${t * o}`
    };
  }
  function create_fragment$7(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill", "currentColor");
        attr(path, "d", "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z");
        attr(
          svg,
          "width",
          /*width*/
          ctx[0]
        );
        set_style(svg, "text-align", "center");
        set_style(svg, "display", "inline-block");
        attr(svg, "aria-hidden", "true");
        attr(svg, "focusable", "false");
        attr(svg, "role", "img");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "viewBox", "0 0 512 512");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*width*/
        1) {
          attr(
            svg,
            "width",
            /*width*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    let { width = "1em" } = $$props;
    $$self.$$set = ($$props2) => {
      if ("width" in $$props2) $$invalidate(0, width = $$props2.width);
    };
    return [width];
  }
  class SuccessIcon extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$7, safe_not_equal, { width: 0 });
    }
  }
  function create_fragment$6(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill", "currentColor");
        attr(path, "d", "M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z");
        attr(path, "class", "");
        attr(
          svg,
          "width",
          /*width*/
          ctx[0]
        );
        set_style(svg, "text-align", "center");
        set_style(svg, "display", "inline-block");
        attr(svg, "aria-hidden", "true");
        attr(svg, "focusable", "false");
        attr(svg, "role", "img");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "viewBox", "0 0 512 512");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*width*/
        1) {
          attr(
            svg,
            "width",
            /*width*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
      }
    };
  }
  function instance$5($$self, $$props, $$invalidate) {
    let { width = "1em" } = $$props;
    $$self.$$set = ($$props2) => {
      if ("width" in $$props2) $$invalidate(0, width = $$props2.width);
    };
    return [width];
  }
  class ErrorIcon extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$6, safe_not_equal, { width: 0 });
    }
  }
  function create_fragment$5(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill", "currentColor");
        attr(path, "d", "M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z");
        attr(
          svg,
          "width",
          /*width*/
          ctx[0]
        );
        set_style(svg, "text-align", "center");
        set_style(svg, "display", "inline-block");
        attr(svg, "aria-hidden", "true");
        attr(svg, "focusable", "false");
        attr(svg, "role", "img");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "viewBox", "0 0 512 512");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*width*/
        1) {
          attr(
            svg,
            "width",
            /*width*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
      }
    };
  }
  function instance$4($$self, $$props, $$invalidate) {
    let { width = "1em" } = $$props;
    $$self.$$set = ($$props2) => {
      if ("width" in $$props2) $$invalidate(0, width = $$props2.width);
    };
    return [width];
  }
  class InfoIcon extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$5, safe_not_equal, { width: 0 });
    }
  }
  function create_fragment$4(ctx) {
    let svg;
    let path;
    return {
      c() {
        svg = svg_element("svg");
        path = svg_element("path");
        attr(path, "fill", "currentColor");
        attr(path, "d", "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z");
        attr(
          svg,
          "width",
          /*width*/
          ctx[0]
        );
        set_style(svg, "text-align", "center");
        set_style(svg, "display", "inline-block");
        attr(svg, "aria-hidden", "true");
        attr(svg, "focusable", "false");
        attr(svg, "role", "img");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "viewBox", "0 0 352 512");
      },
      m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, path);
      },
      p(ctx2, [dirty]) {
        if (dirty & /*width*/
        1) {
          attr(
            svg,
            "width",
            /*width*/
            ctx2[0]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(svg);
        }
      }
    };
  }
  function instance$3($$self, $$props, $$invalidate) {
    let { width = "1em" } = $$props;
    $$self.$$set = ($$props2) => {
      if ("width" in $$props2) $$invalidate(0, width = $$props2.width);
    };
    return [width];
  }
  class CloseIcon extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$4, safe_not_equal, { width: 0 });
    }
  }
  function create_else_block(ctx) {
    let infoicon;
    let current;
    infoicon = new InfoIcon({ props: { width: "1.1em" } });
    return {
      c() {
        create_component(infoicon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(infoicon, target, anchor);
        current = true;
      },
      i(local) {
        if (current) return;
        transition_in(infoicon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(infoicon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(infoicon, detaching);
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let erroricon;
    let current;
    erroricon = new ErrorIcon({ props: { width: "1.1em" } });
    return {
      c() {
        create_component(erroricon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(erroricon, target, anchor);
        current = true;
      },
      i(local) {
        if (current) return;
        transition_in(erroricon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(erroricon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(erroricon, detaching);
      }
    };
  }
  function create_if_block_1$1(ctx) {
    let successicon;
    let current;
    successicon = new SuccessIcon({ props: { width: "1.1em" } });
    return {
      c() {
        create_component(successicon.$$.fragment);
      },
      m(target, anchor) {
        mount_component(successicon, target, anchor);
        current = true;
      },
      i(local) {
        if (current) return;
        transition_in(successicon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(successicon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(successicon, detaching);
      }
    };
  }
  function create_if_block$3(ctx) {
    let button;
    let closeicon;
    let current;
    let mounted2;
    let dispose;
    closeicon = new CloseIcon({ props: { width: "0.8em" } });
    return {
      c() {
        button = element("button");
        create_component(closeicon.$$.fragment);
        attr(button, "class", "close svelte-6pxzag");
      },
      m(target, anchor) {
        insert(target, button, anchor);
        mount_component(closeicon, button, null);
        current = true;
        if (!mounted2) {
          dispose = listen(
            button,
            "click",
            /*click_handler*/
            ctx[5]
          );
          mounted2 = true;
        }
      },
      p: noop,
      i(local) {
        if (current) return;
        transition_in(closeicon.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(closeicon.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(button);
        }
        destroy_component(closeicon);
        mounted2 = false;
        dispose();
      }
    };
  }
  function create_fragment$3(ctx) {
    let article;
    let current_block_type_index;
    let if_block0;
    let t0;
    let div;
    let t1;
    let article_class_value;
    let article_transition;
    let current;
    const if_block_creators = [create_if_block_1$1, create_if_block_2$1, create_else_block];
    const if_blocks = [];
    function select_block_type(ctx2, dirty) {
      if (
        /*type*/
        ctx2[0] === "success"
      ) return 0;
      if (
        /*type*/
        ctx2[0] === "error"
      ) return 1;
      return 2;
    }
    current_block_type_index = select_block_type(ctx);
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    const default_slot_template = (
      /*#slots*/
      ctx[4].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    let if_block1 = (
      /*dismissible*/
      ctx[1] && create_if_block$3(ctx)
    );
    return {
      c() {
        article = element("article");
        if_block0.c();
        t0 = space();
        div = element("div");
        if (default_slot) default_slot.c();
        t1 = space();
        if (if_block1) if_block1.c();
        attr(div, "class", "text svelte-6pxzag");
        attr(article, "class", article_class_value = null_to_empty(
          /*type*/
          ctx[0]
        ) + " svelte-6pxzag");
        attr(article, "role", "alert");
      },
      m(target, anchor) {
        insert(target, article, anchor);
        if_blocks[current_block_type_index].m(article, null);
        append(article, t0);
        append(article, div);
        if (default_slot) {
          default_slot.m(div, null);
        }
        append(article, t1);
        if (if_block1) if_block1.m(article, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        let previous_block_index = current_block_type_index;
        current_block_type_index = select_block_type(ctx2);
        if (current_block_type_index !== previous_block_index) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          }
          transition_in(if_block0, 1);
          if_block0.m(article, t0);
        }
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
        if (
          /*dismissible*/
          ctx2[1]
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
            if (dirty & /*dismissible*/
            2) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block$3(ctx2);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(article, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        if (!current || dirty & /*type*/
        1 && article_class_value !== (article_class_value = null_to_empty(
          /*type*/
          ctx2[0]
        ) + " svelte-6pxzag")) {
          attr(article, "class", article_class_value);
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block0);
        transition_in(default_slot, local);
        transition_in(if_block1);
        if (local) {
          add_render_callback(() => {
            if (!current) return;
            if (!article_transition) article_transition = create_bidirectional_transition(article, fade, {}, true);
            article_transition.run(1);
          });
        }
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(default_slot, local);
        transition_out(if_block1);
        if (local) {
          if (!article_transition) article_transition = create_bidirectional_transition(article, fade, {}, false);
          article_transition.run(0);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(article);
        }
        if_blocks[current_block_type_index].d();
        if (default_slot) default_slot.d(detaching);
        if (if_block1) if_block1.d();
        if (detaching && article_transition) article_transition.end();
      }
    };
  }
  function instance$2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    const dispatch2 = createEventDispatcher();
    let { type = "error" } = $$props;
    let { dismissible = true } = $$props;
    const click_handler = () => dispatch2("dismiss");
    $$self.$$set = ($$props2) => {
      if ("type" in $$props2) $$invalidate(0, type = $$props2.type);
      if ("dismissible" in $$props2) $$invalidate(1, dismissible = $$props2.dismissible);
      if ("$$scope" in $$props2) $$invalidate(3, $$scope = $$props2.$$scope);
    };
    return [type, dismissible, dispatch2, $$scope, slots, click_handler];
  }
  class Toast extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$2, create_fragment$3, safe_not_equal, { type: 0, dismissible: 1 });
    }
  }
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[2] = list[i];
    return child_ctx;
  }
  function create_if_block$2(ctx) {
    let section;
    let each_blocks = [];
    let each_1_lookup = /* @__PURE__ */ new Map();
    let current;
    let each_value = ensure_array_like(
      /*$toasts*/
      ctx[0]
    );
    const get_key = (ctx2) => (
      /*toast*/
      ctx2[2].id
    );
    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context(ctx, each_value, i);
      let key2 = get_key(child_ctx);
      each_1_lookup.set(key2, each_blocks[i] = create_each_block(key2, child_ctx));
    }
    return {
      c() {
        section = element("section");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(section, "class", "svelte-12fd4jl");
      },
      m(target, anchor) {
        insert(target, section, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(section, null);
          }
        }
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*$toasts*/
        1) {
          each_value = ensure_array_like(
            /*$toasts*/
            ctx2[0]
          );
          group_outros();
          each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block, null, get_each_context);
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
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(section);
        }
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      }
    };
  }
  function create_default_slot$1(ctx) {
    let t_value = (
      /*toast*/
      ctx[2].message + ""
    );
    let t;
    return {
      c() {
        t = text(t_value);
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*$toasts*/
        1 && t_value !== (t_value = /*toast*/
        ctx2[2].message + "")) set_data(t, t_value);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_each_block(key_1, ctx) {
    let first;
    let toast_1;
    let current;
    function dismiss_handler() {
      return (
        /*dismiss_handler*/
        ctx[1](
          /*toast*/
          ctx[2]
        )
      );
    }
    toast_1 = new Toast({
      props: {
        type: (
          /*toast*/
          ctx[2].type
        ),
        dismissible: (
          /*toast*/
          ctx[2].dismissible
        ),
        $$slots: { default: [create_default_slot$1] },
        $$scope: { ctx }
      }
    });
    toast_1.$on("dismiss", dismiss_handler);
    return {
      key: key_1,
      first: null,
      c() {
        first = empty();
        create_component(toast_1.$$.fragment);
        this.first = first;
      },
      m(target, anchor) {
        insert(target, first, anchor);
        mount_component(toast_1, target, anchor);
        current = true;
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        const toast_1_changes = {};
        if (dirty & /*$toasts*/
        1) toast_1_changes.type = /*toast*/
        ctx[2].type;
        if (dirty & /*$toasts*/
        1) toast_1_changes.dismissible = /*toast*/
        ctx[2].dismissible;
        if (dirty & /*$$scope, $toasts*/
        33) {
          toast_1_changes.$$scope = { dirty, ctx };
        }
        toast_1.$set(toast_1_changes);
      },
      i(local) {
        if (current) return;
        transition_in(toast_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(toast_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(first);
        }
        destroy_component(toast_1, detaching);
      }
    };
  }
  function create_fragment$2(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*$toasts*/
      ctx[0] && create_if_block$2(ctx)
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
          /*$toasts*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$toasts*/
            1) {
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
  function instance$1($$self, $$props, $$invalidate) {
    let $toasts;
    component_subscribe($$self, toasts, ($$value) => $$invalidate(0, $toasts = $$value));
    const dismiss_handler = (toast) => dismissToast(toast.id);
    return [$toasts, dismiss_handler];
  }
  class Toasts extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$2, safe_not_equal, {});
    }
  }
  function create_if_block$1(ctx) {
    let div3;
    let div0;
    let t0_value = (
      /*$coupon*/
      ctx[2].couponInfo != null && /*$coupon*/
      ctx[2].couponInfo != "" ? "优惠满减券" : "暂无优惠券"
    );
    let t0;
    let t1;
    let activitycontainer;
    let t2;
    let t3;
    let hisprice;
    let t4;
    let div2;
    let span;
    let t5_value = getScanText(
      /*platform*/
      ctx[3]
    ) + "";
    let t5;
    let t6_value = (
      /*$coupon*/
      ctx[2].couponInfo != null && /*$coupon*/
      ctx[2].couponInfo != "" ? "领取" : "下单"
    );
    let t6;
    let t7;
    let t8;
    let div1;
    let qrcode;
    let t9;
    let current;
    let mounted2;
    let dispose;
    activitycontainer = new Container({});
    let if_block0 = (
      /*$coupon*/
      ctx[2].couponInfo != null && /*$coupon*/
      ctx[2].couponInfo != "" && create_if_block_2(ctx)
    );
    hisprice = new HisPrice({});
    qrcode = new QrCode({
      props: {
        url: (
          /*$coupon*/
          ctx[2].shortUrl
        ),
        logo: getPlatformLogo(
          /*platform*/
          ctx[3]
        ),
        logoWidth: getLogoWidth(
          /*platform*/
          ctx[3]
        )
      }
    });
    let if_block1 = (
      /*$coupon*/
      ctx[2].couponInfo != null && /*$coupon*/
      ctx[2].couponInfo != "" && create_if_block_1(ctx)
    );
    return {
      c() {
        div3 = element("div");
        div0 = element("div");
        t0 = text(t0_value);
        t1 = space();
        create_component(activitycontainer.$$.fragment);
        t2 = space();
        if (if_block0) if_block0.c();
        t3 = space();
        create_component(hisprice.$$.fragment);
        t4 = space();
        div2 = element("div");
        span = element("span");
        t5 = text(t5_value);
        t6 = text(t6_value);
        t7 = text("：");
        t8 = space();
        div1 = element("div");
        create_component(qrcode.$$.fragment);
        t9 = space();
        if (if_block1) if_block1.c();
        attr(div0, "class", "title svelte-ykcexl");
        attr(div1, "title", "官方二维码，点击可放大");
        set_style(div1, "cursor", "pointer");
        attr(div2, "class", "qrcodezk svelte-ykcexl");
        attr(div3, "class", "coupon-box svelte-ykcexl");
      },
      m(target, anchor) {
        insert(target, div3, anchor);
        append(div3, div0);
        append(div0, t0);
        append(div0, t1);
        mount_component(activitycontainer, div0, null);
        append(div3, t2);
        if (if_block0) if_block0.m(div3, null);
        append(div3, t3);
        mount_component(hisprice, div3, null);
        append(div3, t4);
        append(div3, div2);
        append(div2, span);
        append(span, t5);
        append(span, t6);
        append(span, t7);
        append(div2, t8);
        append(div2, div1);
        mount_component(qrcode, div1, null);
        append(div3, t9);
        if (if_block1) if_block1.m(div3, null);
        current = true;
        if (!mounted2) {
          dispose = listen(
            div1,
            "click",
            /*handleShowQrCode*/
            ctx[4]()
          );
          mounted2 = true;
        }
      },
      p(ctx2, dirty) {
        if ((!current || dirty & /*$coupon*/
        4) && t0_value !== (t0_value = /*$coupon*/
        ctx2[2].couponInfo != null && /*$coupon*/
        ctx2[2].couponInfo != "" ? "优惠满减券" : "暂无优惠券")) set_data(t0, t0_value);
        if (
          /*$coupon*/
          ctx2[2].couponInfo != null && /*$coupon*/
          ctx2[2].couponInfo != ""
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_2(ctx2);
            if_block0.c();
            if_block0.m(div3, t3);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if ((!current || dirty & /*$coupon*/
        4) && t6_value !== (t6_value = /*$coupon*/
        ctx2[2].couponInfo != null && /*$coupon*/
        ctx2[2].couponInfo != "" ? "领取" : "下单")) set_data(t6, t6_value);
        const qrcode_changes = {};
        if (dirty & /*$coupon*/
        4) qrcode_changes.url = /*$coupon*/
        ctx2[2].shortUrl;
        qrcode.$set(qrcode_changes);
        if (
          /*$coupon*/
          ctx2[2].couponInfo != null && /*$coupon*/
          ctx2[2].couponInfo != ""
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_1(ctx2);
            if_block1.c();
            if_block1.m(div3, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      i(local) {
        if (current) return;
        transition_in(activitycontainer.$$.fragment, local);
        transition_in(hisprice.$$.fragment, local);
        transition_in(qrcode.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(activitycontainer.$$.fragment, local);
        transition_out(hisprice.$$.fragment, local);
        transition_out(qrcode.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div3);
        }
        destroy_component(activitycontainer);
        if (if_block0) if_block0.d();
        destroy_component(hisprice);
        destroy_component(qrcode);
        if (if_block1) if_block1.d();
        mounted2 = false;
        dispose();
      }
    };
  }
  function create_if_block_2(ctx) {
    let div5;
    let div0;
    let span0;
    let t1;
    let span1;
    let t2_value = (
      /*$coupon*/
      (ctx[2].price ?? getPrice(
        /*$coupon*/
        ctx[2].couponInfo
      )) + ""
    );
    let t2;
    let t3;
    let span2;
    let t5;
    let div1;
    let t6;
    let div4;
    let div2;
    let t7_value = (
      /*$coupon*/
      ctx[2].couponInfo + ""
    );
    let t7;
    let t8;
    let div3;
    let t9;
    let t10_value = (
      /*$coupon*/
      ctx[2].couponEndTime + ""
    );
    let t10;
    let t11;
    let mounted2;
    let dispose;
    let if_block = (
      /*$coupon*/
      ctx[2].remainCount != null && /*$coupon*/
      ctx[2].remainCount != "" && create_if_block_3(ctx)
    );
    return {
      c() {
        div5 = element("div");
        div0 = element("div");
        span0 = element("span");
        span0.textContent = "￥";
        t1 = space();
        span1 = element("span");
        t2 = text(t2_value);
        t3 = space();
        span2 = element("span");
        span2.textContent = "元";
        t5 = space();
        div1 = element("div");
        t6 = space();
        div4 = element("div");
        div2 = element("div");
        t7 = text(t7_value);
        t8 = space();
        div3 = element("div");
        t9 = text("有效期至：");
        t10 = text(t10_value);
        t11 = space();
        if (if_block) if_block.c();
        attr(span0, "class", "symbol svelte-ykcexl");
        attr(span1, "class", "price svelte-ykcexl");
        attr(span2, "class", "unit svelte-ykcexl");
        attr(div0, "class", "left svelte-ykcexl");
        attr(div1, "class", "middle svelte-ykcexl");
        attr(div2, "class", "desc svelte-ykcexl");
        attr(div3, "class", "time svelte-ykcexl");
        attr(div4, "class", "right svelte-ykcexl");
        attr(div5, "class", "coupon svelte-ykcexl");
      },
      m(target, anchor) {
        insert(target, div5, anchor);
        append(div5, div0);
        append(div0, span0);
        append(div0, t1);
        append(div0, span1);
        append(span1, t2);
        append(div0, t3);
        append(div0, span2);
        append(div5, t5);
        append(div5, div1);
        append(div5, t6);
        append(div5, div4);
        append(div4, div2);
        append(div2, t7);
        append(div4, t8);
        append(div4, div3);
        append(div3, t9);
        append(div3, t10);
        append(div4, t11);
        if (if_block) if_block.m(div4, null);
        if (!mounted2) {
          dispose = listen(
            div5,
            "click",
            /*handleGo*/
            ctx[6]
          );
          mounted2 = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*$coupon*/
        4 && t2_value !== (t2_value = /*$coupon*/
        (ctx2[2].price ?? getPrice(
          /*$coupon*/
          ctx2[2].couponInfo
        )) + "")) set_data(t2, t2_value);
        if (dirty & /*$coupon*/
        4 && t7_value !== (t7_value = /*$coupon*/
        ctx2[2].couponInfo + "")) set_data(t7, t7_value);
        if (dirty & /*$coupon*/
        4 && t10_value !== (t10_value = /*$coupon*/
        ctx2[2].couponEndTime + "")) set_data(t10, t10_value);
        if (
          /*$coupon*/
          ctx2[2].remainCount != null && /*$coupon*/
          ctx2[2].remainCount != ""
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block_3(ctx2);
            if_block.c();
            if_block.m(div4, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div5);
        }
        if (if_block) if_block.d();
        mounted2 = false;
        dispose();
      }
    };
  }
  function create_if_block_3(ctx) {
    let div;
    let t0;
    let t1_value = (
      /*$coupon*/
      ctx[2].remainCount + ""
    );
    let t1;
    return {
      c() {
        div = element("div");
        t0 = text("剩余：");
        t1 = text(t1_value);
        attr(div, "class", "remain svelte-ykcexl");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, t0);
        append(div, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*$coupon*/
        4 && t1_value !== (t1_value = /*$coupon*/
        ctx2[2].remainCount + "")) set_data(t1, t1_value);
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_if_block_1(ctx) {
    let div;
    let button0;
    let t1;
    let button1;
    let mounted2;
    let dispose;
    return {
      c() {
        div = element("div");
        button0 = element("button");
        button0.textContent = "分享好友";
        t1 = space();
        button1 = element("button");
        button1.textContent = "立即领取";
        attr(button0, "class", "svelte-ykcexl");
        attr(button1, "class", "svelte-ykcexl");
        attr(div, "class", "action svelte-ykcexl");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, button0);
        append(div, t1);
        append(div, button1);
        if (!mounted2) {
          dispose = [
            listen(
              button0,
              "click",
              /*handleCopy*/
              ctx[5]
            ),
            listen(
              button1,
              "click",
              /*handleGo*/
              ctx[6]
            )
          ];
          mounted2 = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        mounted2 = false;
        run_all(dispose);
      }
    };
  }
  function create_default_slot(ctx) {
    var _a;
    let qrcode;
    let current;
    qrcode = new QrCode({
      props: {
        url: (
          /*$coupon*/
          (_a = ctx[2]) == null ? void 0 : _a.shortUrl
        ),
        width: 250,
        height: 250,
        logo: getPlatformLogo(
          /*platform*/
          ctx[3]
        ),
        logoWidth: getLogoWidth(
          /*platform*/
          ctx[3],
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
        var _a2;
        const qrcode_changes = {};
        if (dirty & /*$coupon*/
        4) qrcode_changes.url = /*$coupon*/
        (_a2 = ctx2[2]) == null ? void 0 : _a2.shortUrl;
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
  function create_fragment$1(ctx) {
    let div;
    let toasts2;
    let t0;
    let t1;
    let modal;
    let current;
    toasts2 = new Toasts({});
    let if_block = (
      /*$coupon*/
      ctx[2] != null && create_if_block$1(ctx)
    );
    modal = new Modal({
      props: {
        show: (
          /*showModal*/
          ctx[0]
        ),
        title: (
          /*modalTitle*/
          ctx[1]
        ),
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx }
      }
    });
    modal.$on(
      "close",
      /*close_handler*/
      ctx[7]
    );
    return {
      c() {
        div = element("div");
        create_component(toasts2.$$.fragment);
        t0 = space();
        if (if_block) if_block.c();
        t1 = space();
        create_component(modal.$$.fragment);
        attr(div, "class", "container svelte-ykcexl");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(toasts2, div, null);
        append(div, t0);
        if (if_block) if_block.m(div, null);
        append(div, t1);
        mount_component(modal, div, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*$coupon*/
          ctx2[2] != null
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$coupon*/
            4) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$1(ctx2);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div, t1);
          }
        } else if (if_block) {
          group_outros();
          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });
          check_outros();
        }
        const modal_changes = {};
        if (dirty & /*showModal*/
        1) modal_changes.show = /*showModal*/
        ctx2[0];
        if (dirty & /*modalTitle*/
        2) modal_changes.title = /*modalTitle*/
        ctx2[1];
        if (dirty & /*$$scope, $coupon*/
        260) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current) return;
        transition_in(toasts2.$$.fragment, local);
        transition_in(if_block);
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(toasts2.$$.fragment, local);
        transition_out(if_block);
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_component(toasts2);
        if (if_block) if_block.d();
        destroy_component(modal);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let $coupon;
    component_subscribe($$self, coupon, ($$value) => $$invalidate(2, $coupon = $$value));
    let showModal = false;
    let modalTitle = "";
    const platform2 = getPlatform();
    function handleShowQrCode() {
      return () => {
        if (platform2 == Platform.Tmall) {
          $$invalidate(1, modalTitle = "天猫/淘宝APP扫码购买");
        } else {
          $$invalidate(1, modalTitle = `微信扫码，${getPlatformName(platform2)}官网购买`);
        }
        $$invalidate(0, showModal = true);
      };
    }
    function handleCopy() {
      if ($coupon == null) {
        return;
      }
      const text2 = getCopyText($coupon);
      copy(text2, () => {
        addToast({
          type: "success",
          message: getToastMsg(platform2),
          dismissible: true,
          timeout: 5e3
        });
      });
    }
    function handleGo() {
      var _a;
      if (Platform.Vip == platform2) {
        (_a = document.querySelector(".J-getCouponBtn")) == null ? void 0 : _a.click();
        return;
      }
      if (($coupon == null ? void 0 : $coupon.shortUrl) != null && ($coupon == null ? void 0 : $coupon.shortUrl) != "") {
        openWindow($coupon.shortUrl);
        window.close();
      }
    }
    const close_handler = () => $$invalidate(0, showModal = false);
    return [
      showModal,
      modalTitle,
      $coupon,
      platform2,
      handleShowQrCode,
      handleCopy,
      handleGo,
      close_handler
    ];
  }
  class Coupon extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment$1, safe_not_equal, {});
    }
  }
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
  function create_if_block(ctx) {
    let card;
    let current;
    card = new Card({});
    return {
      c() {
        create_component(card.$$.fragment);
      },
      m(target, anchor) {
        mount_component(card, target, anchor);
        current = true;
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
  function create_fragment(ctx) {
    let main;
    let coupon2;
    let t;
    let show_if = canExec();
    let current;
    coupon2 = new Coupon({});
    let if_block = show_if && create_if_block();
    return {
      c() {
        main = element("main");
        create_component(coupon2.$$.fragment);
        t = space();
        if (if_block) if_block.c();
      },
      m(target, anchor) {
        insert(target, main, anchor);
        mount_component(coupon2, main, null);
        append(main, t);
        if (if_block) if_block.m(main, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current) return;
        transition_in(coupon2.$$.fragment, local);
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(coupon2.$$.fragment, local);
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(main);
        }
        destroy_component(coupon2);
        if (if_block) if_block.d();
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
      title: title2,
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
        title: title2 ?? "",
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
          const now2 = Date.now();
          const oneDay = 24 * 60 * 60 * 1e3;
          if (!link2.ts) {
            Reflect.deleteProperty(transformList, key2);
          } else {
            if (now2 - link2.ts > oneDay) {
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
  let title = "";
  function setTitle(t) {
    title = t;
  }
  function getTitle() {
    return title;
  }
  async function initTitle() {
    const platform2 = getPlatform();
    let title2 = "";
    switch (platform2) {
      case Platform.Tmall:
        title2 = await getTbTitle();
        break;
      case Platform.JD:
        title2 = await getJdTitle();
        break;
      case Platform.Vip:
        title2 = await getVipTitle();
        break;
    }
    setTitle(title2);
    return title2;
  }
  function getTbTitle() {
    return new Promise((resolve) => {
      const getTitle2 = () => {
        var _a, _b;
        return (_b = (_a = document.querySelector('[class^="mainTitle--"]')) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
      };
      function tryGetTitle(timeout = 5e3) {
        const title2 = getTitle2();
        if (title2) {
          resolve(title2);
          return;
        }
        if (timeout <= 0) {
          const observer = new MutationObserver(() => {
            const title22 = getTitle2();
            if (title22) {
              observer.disconnect();
              resolve(title22);
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
      const title2 = (_a = document.querySelector(".sku-title-name")) == null ? void 0 : _a.textContent;
      if (title2) {
        const rt = title2.replace(/\s+/g, "");
        resolve(rt);
      } else {
        const observer = new MutationObserver(() => {
          var _a2;
          const title22 = (_a2 = document.querySelector(".sku-title-name")) == null ? void 0 : _a2.textContent;
          if (title22) {
            observer.disconnect();
            const rt = title22.replace(/\s+/g, "");
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
      const title2 = (_a = document.querySelector(className)) == null ? void 0 : _a.textContent;
      if (title2 && title2 != "商家店铺") {
        resolve(title2.replace("商家店铺", ""));
      } else {
        const observer = new MutationObserver(() => {
          var _a2;
          const title22 = (_a2 = document.querySelector(className)) == null ? void 0 : _a2.textContent;
          if (title22 && title22 != "商家店铺") {
            observer.disconnect();
            resolve(title22.replace("商家店铺", ""));
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
      const title2 = await getJdTitle() ?? "";
      const price = (_b = (_a = document.querySelectorAll(
        '.price[class^="J-p"], .price[class*=" J-p"]'
      )) == null ? void 0 : _a[0]) == null ? void 0 : _b.textContent;
      const json = await fetchTransformLink({
        platform: Platform.JD,
        title: title2,
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
      const title2 = await getTbTitle() ?? "";
      const json = await fetchTransformLink({
        platform: Platform.Tmall,
        title: title2,
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
    const now2 = Date.now();
    if (now2 - timestamp < timeout) {
      await wait(timeout - (now2 - timestamp));
    }
  }
  async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function isOverDays(timestamp, days = 55) {
    const now2 = Date.now();
    const dayInMilliseconds = days * 24 * 60 * 60 * 1e3;
    return Math.abs(now2 - timestamp) > dayInMilliseconds;
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
      const title2 = item.getAttribute("title") ?? "";
      const price = ((_a = item.querySelector(".more2_extra_price_txt")) == null ? void 0 : _a.getAttribute("title")) ?? "";
      const img = ((_b = item.querySelector("img")) == null ? void 0 : _b.getAttribute("src")) ?? "";
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const json = await fetchTransformLink({
          platform: Platform.JD,
          url: link2,
          dl: false,
          price,
          title: title2,
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
      const title2 = (linkEl == null ? void 0 : linkEl.innerText.trim()) ?? "";
      const price = item.getAttribute("preprice") ?? "";
      const img = ((_a = parent == null ? void 0 : parent.querySelector("img")) == null ? void 0 : _a.getAttribute("src")) ?? "";
      if (!itemsSet.has(link2)) {
        itemsSet.add(link2);
        const json = await fetchTransformLink({
          platform: Platform.JD,
          url: link2,
          dl: false,
          price,
          title: title2,
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
      const title2 = it.$dataForReport.title;
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
          title: title2,
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
    const now2 = Date.now();
    const t = await getGMValue(GM_KEY.VERSION_CHECK_TIME, "0") ?? "0";
    const isForce = (await getGMValue(GM_KEY.VERSION_IS_FORCE, "0") ?? "0") == "1";
    const lastCheckTime = parseInt(t, 10);
    if (now2 - lastCheckTime < daysToMs(0.02) && !isForce) return;
    try {
      const res = await get(API.checkVersion);
      await setGMValue(GM_KEY.VERSION_CHECK_TIME, now2 + "");
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
        if (now2 - lastUpdateTime >= daysToMs(10)) {
          openWindow(url);
          await setGMValue(GM_KEY.VERSION_UPDATE_TIME, now2 + "");
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
  async function mountedTmall() {
    const { id } = getUrlParams();
    if (id == null || id == "") {
      return;
    }
    const title2 = getTitle();
    const titleEl = await waitForElement('[class*="shopName-"]');
    const shop = (titleEl == null ? void 0 : titleEl.getAttribute("title")) ?? (titleEl == null ? void 0 : titleEl.textContent);
    const json = await get(API.getTmallCouponUrl, {
      goodsId: id,
      url: location.href,
      shop,
      title: title2
    });
    if (json.data != null) {
      coupon.updateCoupon(json.data);
      const target = await createTarget(
        json.data.selector ?? [".Price--root--1CrVGjc"]
      );
      if (!document.getElementById(PluginClassName)) {
        const app = document.createElement("div");
        app.id = PluginClassName;
        app.className = PluginClassName;
        target.after(app);
        new App({
          target: app
        });
      }
    }
  }
  async function mountedJd() {
    const url = getOriginalUrl(Platform.JD);
    const json = await get(API.getJdCouponUrl, {
      url
    });
    if (json.data != null) {
      coupon.updateCoupon(json.data);
      const target = await createTarget(json.data.selector ?? [".summary-first"]);
      if (!document.getElementById(PluginClassName)) {
        const app = document.createElement("div");
        app.id = PluginClassName;
        app.className = PluginClassName;
        target.after(app);
        new App({
          target: app
        });
      }
    }
  }
  async function mountedVip() {
    const url = getOriginalUrl(Platform.Vip);
    if (isMobile()) {
      return;
    }
    const json = await get(API.getVipCouponUrl, {
      url
    });
    if (json.data != null) {
      coupon.updateCoupon(json.data);
      const target = await createTarget(
        json.data.selector ?? ["#J-pi-price-box"]
      );
      if (!document.getElementById(PluginClassName)) {
        const app = document.createElement("div");
        app.id = PluginClassName;
        app.className = PluginClassName;
        target.after(app);
        new App({
          target: app
        });
      }
    }
  }
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
    await initTitle();
    switch (platform2) {
      case Platform.Tmall:
        mountedTmall();
        break;
      case Platform.JD:
        mountedJd();
        break;
      case Platform.Vip:
        mountedVip();
        break;
    }
    {
      checkAndUpdate();
    }
  }
  mounted();

})(CryptoJS, QRCode);