// ==UserScript==
// @name               电商平台比价小助手，自动对比各大电商平台（淘宝、京东、拼多多、唯品会）的商品价格，自动显示隐藏优惠券，官方活动列表，历史价格走势，支持手机扫码下单！
// @name:zh            电商平台比价小助手，自动对比各大电商平台（淘宝、京东、拼多多、唯品会）的商品价格，自动显示隐藏优惠券，官方活动列表，历史价格走势，支持手机扫码下单！
// @name:zh-TW         電商平台比價小助手，自動對比各大電商平台（淘寶、京東、拼多多、唯品會）的商品價格，自動顯示隱藏優惠券，官方活動列表，歷史價格走勢，支持手機掃碼下單！
// @namespace          https://api2.jasonzk.com
// @version            2.6.8
// @author             JasonZK
// @description        简单易用的电商平台比价小助手！自动对比淘宝（taobao.com）、天猫（tmall.com）、京东（jd.com）、拼多多（pinduoduo.com）和唯品会（vip.com）电商平台的商品价格，除了普通商详页，同时也支持在聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)上显示。提供搜索功能，也支持按分类（人气、销量、价格）搜索。自动显示隐藏优惠券，自动显示官方活动列表，支持手机扫码下单，方便快捷。持续维护中！
// @description:zh     简单易用的电商平台比价小助手！自动对比淘宝（taobao.com）、天猫（tmall.com）、京东（jd.com）、拼多多（pinduoduo.com）和唯品会（vip.com）电商平台的商品价格，除了普通商详页，同时也支持在聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)上显示。提供搜索功能，也支持按分类（人气、销量、价格）搜索。自动显示隐藏优惠券，自动显示官方活动列表，支持手机扫码下单，方便快捷。持续维护中！
// @description:zh-TW  簡單易用的電商平台比價小助手！自動對比淘寶（taobao.com）、天貓（tmall.com）、京東（jd.com）、拼多多（pinduoduo.com）和唯品會（vip.com）電商平台的商品價格，除了普通商品詳情頁，同時也支持在聚划算、天貓超市、天貓國際(tmall.hk)、京東國際(jd.hk)、京東圖書、京東電子書、京東工業品、京東大藥房(yiyaojd.com)上顯示。提供搜索功能，也支持按分類（人氣、銷量、價格）搜索。自動顯示隱藏優惠券，自動顯示官方活動列表，支持手機掃碼下單，方便快捷。持續維護中！
// @license            None
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAFkCAYAAABRreKKAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuZGJhM2RhMywgMjAyMy8xMi8xMy0wNTowNjo0OSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjYgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNC0wNy0yM1QxMTozOToxNiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjQtMDctMjNUMTE6NDA6NDkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDctMjNUMTE6NDA6NDkrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYyZTFkMWRmLTVjMWYtYTM0Yi1hNGZiLTZjODgyNWNjNDliYyIgeG1wTU06RG9jdW1lbnRJRD0i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
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
// @require            https://cdn.jsdelivr.net/npm/lightweight-charts@4.2.3/dist/lightweight-charts.standalone.production.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/503064/%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%E6%AF%94%E4%BB%B7%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%AF%B9%E6%AF%94%E5%90%84%E5%A4%A7%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%EF%BC%88%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%EF%BC%89%E7%9A%84%E5%95%86%E5%93%81%E4%BB%B7%E6%A0%BC%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E5%AE%98%E6%96%B9%E6%B4%BB%E5%8A%A8%E5%88%97%E8%A1%A8%EF%BC%8C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E8%B5%B0%E5%8A%BF%EF%BC%8C%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/503064/%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%E6%AF%94%E4%BB%B7%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%AF%B9%E6%AF%94%E5%90%84%E5%A4%A7%E7%94%B5%E5%95%86%E5%B9%B3%E5%8F%B0%EF%BC%88%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%EF%BC%89%E7%9A%84%E5%95%86%E5%93%81%E4%BB%B7%E6%A0%BC%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E5%AE%98%E6%96%B9%E6%B4%BB%E5%8A%A8%E5%88%97%E8%A1%A8%EF%BC%8C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E8%B5%B0%E5%8A%BF%EF%BC%8C%E6%94%AF%E6%8C%81%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%EF%BC%81.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const t=document.createElement("style");t.textContent=r,document.head.append(t)})(" .ormtxerfe4h *,.ormtxerfe4h :before,.ormtxerfe4h :after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.ormtxerfe4h ::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.ormtxerfe4h .\\!container{width:100%!important}.ormtxerfe4h .container{width:100%}@media (min-width: 640px){.ormtxerfe4h .\\!container{max-width:640px!important}}@media (min-width: 640px){.ormtxerfe4h .container{max-width:640px}}@media (min-width: 768px){.ormtxerfe4h .\\!container{max-width:768px!important}}@media (min-width: 768px){.ormtxerfe4h .container{max-width:768px}}@media (min-width: 1024px){.ormtxerfe4h .\\!container{max-width:1024px!important}}@media (min-width: 1024px){.ormtxerfe4h .container{max-width:1024px}}@media (min-width: 1280px){.ormtxerfe4h .\\!container{max-width:1280px!important}}@media (min-width: 1280px){.ormtxerfe4h .container{max-width:1280px}}@media (min-width: 1536px){.ormtxerfe4h .\\!container{max-width:1536px!important}}@media (min-width: 1536px){.ormtxerfe4h .container{max-width:1536px}}.ormtxerfe4h .visible{visibility:visible}.ormtxerfe4h .fixed{position:fixed}.ormtxerfe4h .absolute{position:absolute}.ormtxerfe4h .relative{position:relative}.ormtxerfe4h .inset-0{top:0;right:0;bottom:0;left:0}.ormtxerfe4h .bottom-\\[-25px\\]{bottom:-25px}.ormtxerfe4h .end-0{inset-inline-end:0px}.ormtxerfe4h .right-\\[-12\\.5px\\]{right:-12.5px}.ormtxerfe4h .right-\\[8px\\]{right:8px}.ormtxerfe4h .top-0{top:0}.ormtxerfe4h .top-\\[-25px\\]{top:-25px}.ormtxerfe4h .top-\\[8px\\]{top:8px}.ormtxerfe4h .z-10{z-index:10}.ormtxerfe4h .z-20{z-index:20}.ormtxerfe4h .mx-auto{margin-left:auto;margin-right:auto}.ormtxerfe4h .my-\\[24px\\]{margin-top:24px;margin-bottom:24px}.ormtxerfe4h .my-\\[8px\\]{margin-top:8px;margin-bottom:8px}.ormtxerfe4h .mb-4{margin-bottom:1rem}.ormtxerfe4h .mb-\\[12px\\]{margin-bottom:12px}.ormtxerfe4h .mb-\\[20px\\]{margin-bottom:20px}.ormtxerfe4h .mb-\\[6px\\]{margin-bottom:6px}.ormtxerfe4h .ml-\\[-3px\\]{margin-left:-3px}.ormtxerfe4h .ml-\\[10px\\]{margin-left:10px}.ormtxerfe4h .ml-\\[2px\\]{margin-left:2px}.ormtxerfe4h .mt-4{margin-top:1rem}.ormtxerfe4h .mt-\\[16px\\]{margin-top:16px}.ormtxerfe4h .mt-\\[28px\\]{margin-top:28px}.ormtxerfe4h .mt-\\[2px\\]{margin-top:2px}.ormtxerfe4h .mt-\\[4px\\]{margin-top:4px}.ormtxerfe4h .mt-\\[8px\\]{margin-top:8px}.ormtxerfe4h .box-border{box-sizing:border-box}.ormtxerfe4h .block{display:block}.ormtxerfe4h .inline-block{display:inline-block}.ormtxerfe4h .flex{display:flex}.ormtxerfe4h .inline-flex{display:inline-flex}.ormtxerfe4h .table{display:table}.ormtxerfe4h .grid{display:grid}.ormtxerfe4h .hidden{display:none}.ormtxerfe4h .h-\\[10px\\]{height:10px}.ormtxerfe4h .h-\\[16px\\]{height:16px}.ormtxerfe4h .h-\\[25px\\]{height:25px}.ormtxerfe4h .h-\\[60x\\]{height:60x}.ormtxerfe4h .h-auto{height:auto}.ormtxerfe4h .h-full{height:100%}.ormtxerfe4h .w-20{width:5rem}.ormtxerfe4h .w-44{width:11rem}.ormtxerfe4h .w-\\[10px\\]{width:10px}.ormtxerfe4h .w-\\[120px\\]{width:120px}.ormtxerfe4h .w-\\[16px\\]{width:16px}.ormtxerfe4h .w-\\[25px\\]{width:25px}.ormtxerfe4h .w-\\[60px\\]{width:60px}.ormtxerfe4h .w-\\[80px\\]{width:80px}.ormtxerfe4h .w-full{width:100%}.ormtxerfe4h .min-w-full{min-width:100%}.ormtxerfe4h .max-w-\\[200px\\]{max-width:200px}.ormtxerfe4h .flex-1{flex:1 1 0%}.ormtxerfe4h .flex-none{flex:none}.ormtxerfe4h .flex-shrink-0{flex-shrink:0}.ormtxerfe4h .flex-grow{flex-grow:1}.ormtxerfe4h .transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.ormtxerfe4h .cursor-pointer{cursor:pointer}.ormtxerfe4h .list-inside{list-style-position:inside}.ormtxerfe4h .grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.ormtxerfe4h .flex-col{flex-direction:column}.ormtxerfe4h .flex-wrap{flex-wrap:wrap}.ormtxerfe4h .items-center{align-items:center}.ormtxerfe4h .justify-center{justify-content:center}.ormtxerfe4h .justify-between{justify-content:space-between}.ormtxerfe4h .gap-2{gap:.5rem}.ormtxerfe4h .gap-4{gap:1rem}.ormtxerfe4h .gap-5{gap:1.25rem}.ormtxerfe4h .gap-\\[12px\\]{gap:12px}.ormtxerfe4h .gap-\\[20px\\]{gap:20px}.ormtxerfe4h .gap-\\[6px\\]{gap:6px}.ormtxerfe4h .gap-\\[8px\\]{gap:8px}.ormtxerfe4h .divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse: 0;border-top-width:calc(1px * calc(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px * var(--tw-divide-y-reverse))}.ormtxerfe4h .divide-gray-100>:not([hidden])~:not([hidden]){--tw-divide-opacity: 1;border-color:rgb(243 244 246 / var(--tw-divide-opacity, 1))}.ormtxerfe4h .overflow-auto{overflow:auto}.ormtxerfe4h .rounded{border-radius:.25rem}.ormtxerfe4h .rounded-full{border-radius:9999px}.ormtxerfe4h .rounded-lg{border-radius:.5rem}.ormtxerfe4h .rounded-md{border-radius:.375rem}.ormtxerfe4h .rounded-sm{border-radius:.125rem}.ormtxerfe4h .rounded-e-lg{border-start-end-radius:.5rem;border-end-end-radius:.5rem}.ormtxerfe4h .rounded-s-lg{border-start-start-radius:.5rem;border-end-start-radius:.5rem}.ormtxerfe4h .border{border-width:1px}.ormtxerfe4h .border-b{border-bottom-width:1px}.ormtxerfe4h .border-e-0{border-inline-end-width:0px}.ormtxerfe4h .border-l-4{border-left-width:4px}.ormtxerfe4h .border-r-2{border-right-width:2px}.ormtxerfe4h .border-solid{border-style:solid}.ormtxerfe4h .border-dotted{border-style:dotted}.ormtxerfe4h .border-none{border-style:none}.ormtxerfe4h .border-blue-700{--tw-border-opacity: 1;border-color:rgb(29 78 216 / var(--tw-border-opacity, 1))}.ormtxerfe4h .border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity, 1))}.ormtxerfe4h .border-l-red-600{--tw-border-opacity: 1;border-left-color:rgb(220 38 38 / var(--tw-border-opacity, 1))}.ormtxerfe4h .bg-\\[\\#ffe8e7\\]{--tw-bg-opacity: 1;background-color:rgb(255 232 231 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-\\[white\\]{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-black{--tw-bg-opacity: 1;background-color:rgb(0 0 0 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-blue-400{--tw-bg-opacity: 1;background-color:rgb(96 165 250 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-blue-700{--tw-bg-opacity: 1;background-color:rgb(29 78 216 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-gray-100{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-gray-50{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-transparent{background-color:transparent}.ormtxerfe4h .bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.ormtxerfe4h .bg-opacity-70{--tw-bg-opacity: .7 }.ormtxerfe4h .p-4{padding:1rem}.ormtxerfe4h .p-\\[10px\\]{padding:10px}.ormtxerfe4h .p-\\[16px\\]{padding:16px}.ormtxerfe4h .p-\\[20px\\]{padding:20px}.ormtxerfe4h .p-\\[8px\\]{padding:8px}.ormtxerfe4h .px-4{padding-left:1rem;padding-right:1rem}.ormtxerfe4h .px-\\[12px\\]{padding-left:12px;padding-right:12px}.ormtxerfe4h .px-\\[16px\\]{padding-left:16px;padding-right:16px}.ormtxerfe4h .px-\\[3px\\]{padding-left:3px;padding-right:3px}.ormtxerfe4h .py-2{padding-top:.5rem;padding-bottom:.5rem}.ormtxerfe4h .py-\\[10px\\]{padding-top:10px;padding-bottom:10px}.ormtxerfe4h .py-\\[24px\\]{padding-top:24px;padding-bottom:24px}.ormtxerfe4h .py-\\[8px\\]{padding-top:8px;padding-bottom:8px}.ormtxerfe4h .pl-4{padding-left:1rem}.ormtxerfe4h .pl-\\[10px\\]{padding-left:10px}.ormtxerfe4h .pr-4{padding-right:1rem}.ormtxerfe4h .pr-\\[40px\\]{padding-right:40px}.ormtxerfe4h .text-center{text-align:center}.ormtxerfe4h .text-2xl{font-size:1.5rem;line-height:2rem}.ormtxerfe4h .text-3xl{font-size:1.875rem;line-height:2.25rem}.ormtxerfe4h .text-\\[12px\\]{font-size:12px}.ormtxerfe4h .text-\\[14px\\]{font-size:14px}.ormtxerfe4h .text-\\[16px\\]{font-size:16px}.ormtxerfe4h .text-lg{font-size:1.125rem;line-height:1.75rem}.ormtxerfe4h .text-sm{font-size:.875rem;line-height:1.25rem}.ormtxerfe4h .font-bold{font-weight:700}.ormtxerfe4h .font-medium{font-weight:500}.ormtxerfe4h .font-semibold{font-weight:600}.ormtxerfe4h .leading-\\[16px\\]{line-height:16px}.ormtxerfe4h .text-\\[\\#888\\]{--tw-text-opacity: 1;color:rgb(136 136 136 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-\\[\\#ff2828\\]{--tw-text-opacity: 1;color:rgb(255 40 40 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-blue-500{--tw-text-opacity: 1;color:rgb(59 130 246 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-gray-600{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-gray-700{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-green-500{--tw-text-opacity: 1;color:rgb(34 197 94 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-orange-500{--tw-text-opacity: 1;color:rgb(249 115 22 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-red-500{--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-red-600{--tw-text-opacity: 1;color:rgb(220 38 38 / var(--tw-text-opacity, 1))}.ormtxerfe4h .text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.ormtxerfe4h .underline{text-decoration-line:underline}.ormtxerfe4h .line-through{text-decoration-line:line-through}.ormtxerfe4h .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.ormtxerfe4h .shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.ormtxerfe4h .shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.ormtxerfe4h .grayscale{--tw-grayscale: grayscale(100%);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.ormtxerfe4h .filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.ormtxerfe4h .transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.hover\\:bg-blue-400:hover{--tw-bg-opacity: 1;background-color:rgb(96 165 250 / var(--tw-bg-opacity, 1))}.hover\\:bg-blue-800:hover{--tw-bg-opacity: 1;background-color:rgb(30 64 175 / var(--tw-bg-opacity, 1))}.hover\\:bg-gray-100:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.hover\\:bg-gray-200:hover{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity, 1))}.hover\\:text-gray-900:hover{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.hover\\:text-orange-600:hover{--tw-text-opacity: 1;color:rgb(234 88 12 / var(--tw-text-opacity, 1))}.hover\\:text-red-600:hover{--tw-text-opacity: 1;color:rgb(220 38 38 / var(--tw-text-opacity, 1))}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.hover\\:underline:hover{text-decoration-line:underline}.focus\\:border-blue-500:focus{--tw-border-opacity: 1;border-color:rgb(59 130 246 / var(--tw-border-opacity, 1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-1:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-4:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-blue-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(147 197 253 / var(--tw-ring-opacity, 1)) }.focus\\:ring-blue-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1)) }.focus\\:ring-gray-300:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity, 1)) }@media (prefers-color-scheme: dark){.dark\\:border-gray-600{--tw-border-opacity: 1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.dark\\:border-gray-700{--tw-border-opacity: 1;border-color:rgb(55 65 81 / var(--tw-border-opacity, 1))}.dark\\:bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity, 1))}.dark\\:bg-gray-600{--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity, 1))}.dark\\:bg-gray-700{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.dark\\:text-gray-200{--tw-text-opacity: 1;color:rgb(229 231 235 / var(--tw-text-opacity, 1))}.dark\\:text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.dark\\:placeholder-gray-400::-moz-placeholder{--tw-placeholder-opacity: 1;color:rgb(156 163 175 / var(--tw-placeholder-opacity, 1))}.dark\\:placeholder-gray-400::placeholder{--tw-placeholder-opacity: 1;color:rgb(156 163 175 / var(--tw-placeholder-opacity, 1))}.dark\\:hover\\:bg-blue-700:hover{--tw-bg-opacity: 1;background-color:rgb(29 78 216 / var(--tw-bg-opacity, 1))}.dark\\:hover\\:bg-gray-700:hover{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.dark\\:focus\\:border-blue-500:focus{--tw-border-opacity: 1;border-color:rgb(59 130 246 / var(--tw-border-opacity, 1))}.dark\\:focus\\:ring-blue-800:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(30 64 175 / var(--tw-ring-opacity, 1)) }.dark\\:focus\\:ring-gray-800:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(31 41 55 / var(--tw-ring-opacity, 1)) }} ");

(function (CryptoJS, EasyQRCode, lightweightCharts) {
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
  function prevent_default(fn) {
    return function(event) {
      event.preventDefault();
      return fn.call(this, event);
    };
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
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
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
  const PluginName = "2";
  const PluginClassName = "ormtxerfe4h";
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
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
  const getCompareGoodsList = `${baseUrl}/compare/price`;
  const getTransformLink = `${baseUrl}/${transformLink}`;
  const getHisPrice = `${baseUrl}/tools/goods-his`;
  const getActivitySets = `${baseUrl}/activity/sets2`;
  const checkClear = `${baseUrl}/config/clear`;
  const vwC = `${baseUrl}/vw/c`;
  const vwB = `${baseUrl}/vw/b`;
  const vwLvt = `${baseUrl}/${lvt}`;
  const checkVersion = `${baseUrl}/version/check`;
  const API = {
    getCompareGoodsList,
    getTransformLink,
    getHisPrice,
    getActivitySets,
    checkVersion,
    checkClear,
    vwC,
    vwB,
    vwLvt
  };
  let title = "";
  function setTitle(t) {
    title = t;
  }
  function getTitle() {
    return title;
  }
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
  function createGoodsList() {
    const { subscribe: subscribe2, set, update: update2 } = writable(null);
    return {
      subscribe: subscribe2,
      updateGoodsList: (data) => update2(() => data)
    };
  }
  const goodsList = createGoodsList();
  var Category = /* @__PURE__ */ ((Category2) => {
    Category2[Category2["renqi"] = 1] = "renqi";
    Category2[Category2["xiaoliang"] = 2] = "xiaoliang";
    Category2[Category2["jiage"] = 3] = "jiage";
    return Category2;
  })(Category || {});
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
  function getCateogryName(category) {
    switch (category) {
      case Category.renqi:
        return "人气";
      case Category.xiaoliang:
        return "销量";
      case Category.jiage:
        return "价格";
    }
  }
  function create_fragment$f(ctx) {
    let form;
    let div2;
    let button0;
    let t0_value = getCateogryName(
      /*currentCategory*/
      ctx[1]
    ) + "";
    let t0;
    let t1;
    let svg0;
    let path0;
    let t2;
    let div0;
    let ul;
    let li0;
    let button1;
    let t4;
    let li1;
    let button2;
    let t6;
    let li2;
    let button3;
    let div0_class_value;
    let t8;
    let div1;
    let input;
    let t9;
    let button4;
    let mounted2;
    let dispose;
    return {
      c() {
        form = element("form");
        div2 = element("div");
        button0 = element("button");
        t0 = text(t0_value);
        t1 = space();
        svg0 = svg_element("svg");
        path0 = svg_element("path");
        t2 = space();
        div0 = element("div");
        ul = element("ul");
        li0 = element("li");
        button1 = element("button");
        button1.textContent = `${getCateogryName(Category.renqi)}`;
        t4 = space();
        li1 = element("li");
        button2 = element("button");
        button2.textContent = `${getCateogryName(Category.xiaoliang)}`;
        t6 = space();
        li2 = element("li");
        button3 = element("button");
        button3.textContent = `${getCateogryName(Category.jiage)}`;
        t8 = space();
        div1 = element("div");
        input = element("input");
        t9 = space();
        button4 = element("button");
        button4.innerHTML = `<svg class="h-[16px] w-[16px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"></path></svg>`;
        attr(path0, "stroke", "currentColor");
        attr(path0, "stroke-linecap", "round");
        attr(path0, "stroke-linejoin", "round");
        attr(path0, "stroke-width", "2");
        attr(path0, "d", "m1 1 4 4 4-4");
        attr(svg0, "class", "ml-[10px] h-[10px] w-[10px]");
        attr(svg0, "aria-hidden", "true");
        attr(svg0, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg0, "fill", "none");
        attr(svg0, "viewBox", "0 0 10 6");
        attr(button0, "id", "dropdown-button");
        attr(button0, "data-dropdown-toggle", "dropdown");
        attr(button0, "class", "cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 z-10 inline-flex flex-shrink-0 items-center rounded-s-lg border border-e-0 border-gray-300 bg-gray-100 px-[16px] py-[10px] text-center text-sm font-medium text-gray-900 hover:bg-gray-200 border-solid");
        attr(button0, "type", "button");
        attr(button1, "class", "flex-1 cursor-pointer px-[16px] py-[8px] text-center hover:bg-gray-100 border-none");
        attr(button1, "type", "button");
        attr(li0, "class", "flex");
        attr(button2, "class", "flex-1 cursor-pointer px-[16px] py-[8px] text-center hover:bg-gray-100 border-none");
        attr(button2, "type", "button");
        attr(li1, "class", "flex");
        attr(button3, "class", "flex-1 cursor-pointer px-[16px] py-[8px] text-center hover:bg-gray-100 border-none");
        attr(button3, "type", "button");
        attr(li2, "class", "flex");
        attr(ul, "class", "dark:text-gray-200 py-[8px] text-sm text-gray-700");
        attr(ul, "aria-labelledby", "dropdown-button");
        attr(div0, "id", "dropdown");
        attr(div0, "class", div0_class_value = `z-10 ${/*isDropdownVisible*/
      ctx[0] ? "block" : "hidden"} dark:bg-gray-700 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow`);
        set_style(div0, "position", "absolute");
        set_style(div0, "inset", "0px auto auto 0px");
        set_style(div0, "margin-top", "45px");
        set_style(div0, "transform", "$" + /*isDropdownVisible*/
        (ctx[0] ? "translate(92px, 72px)" : "translate(4px, 72px)"));
        attr(input, "type", "search");
        attr(input, "id", "search-dropdown");
        attr(input, "class", "rounded-s-gray-100 rounded-s-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 z-20 w-full rounded-e-lg border border-gray-300 bg-gray-50 py-[10px] pl-[10px] pr-[40px] text-sm text-gray-900 border-solid");
        attr(input, "placeholder", "请输入商品标题查询");
        set_style(input, "display", "block");
        set_style(input, "box-sizing", "border-box");
        input.required = true;
        attr(button4, "type", "submit");
        attr(button4, "class", "focus:outline-none focus:ring-4 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 focus:ring-blue-300 absolute end-0 top-0 box-border h-full rounded-e-lg border border-blue-700 bg-blue-700 p-[10px] text-sm font-medium text-white hover:bg-blue-800");
        attr(div1, "class", "relative w-full");
        attr(div2, "class", "relative flex");
      },
      m(target, anchor) {
        insert(target, form, anchor);
        append(form, div2);
        append(div2, button0);
        append(button0, t0);
        append(button0, t1);
        append(button0, svg0);
        append(svg0, path0);
        append(div2, t2);
        append(div2, div0);
        append(div0, ul);
        append(ul, li0);
        append(li0, button1);
        append(ul, t4);
        append(ul, li1);
        append(li1, button2);
        append(ul, t6);
        append(ul, li2);
        append(li2, button3);
        append(div2, t8);
        append(div2, div1);
        append(div1, input);
        set_input_value(
          input,
          /*title*/
          ctx[2]
        );
        append(div1, t9);
        append(div1, button4);
        if (!mounted2) {
          dispose = [
            listen(
              button0,
              "click",
              /*handleDropdownToggle*/
              ctx[3]
            ),
            listen(
              button1,
              "click",
              /*handleDropdownClick*/
              ctx[5](Category.renqi)
            ),
            listen(
              button2,
              "click",
              /*handleDropdownClick*/
              ctx[5](Category.xiaoliang)
            ),
            listen(
              button3,
              "click",
              /*handleDropdownClick*/
              ctx[5](Category.jiage)
            ),
            listen(
              input,
              "input",
              /*input_input_handler*/
              ctx[6]
            ),
            listen(form, "submit", prevent_default(
              /*handleSubmit*/
              ctx[4]
            ))
          ];
          mounted2 = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*currentCategory*/
        2 && t0_value !== (t0_value = getCateogryName(
          /*currentCategory*/
          ctx2[1]
        ) + "")) set_data(t0, t0_value);
        if (dirty & /*isDropdownVisible*/
        1 && div0_class_value !== (div0_class_value = `z-10 ${/*isDropdownVisible*/
      ctx2[0] ? "block" : "hidden"} dark:bg-gray-700 w-44 divide-y divide-gray-100 rounded-lg bg-white shadow`)) {
          attr(div0, "class", div0_class_value);
        }
        if (dirty & /*isDropdownVisible*/
        1) {
          set_style(div0, "transform", "$" + /*isDropdownVisible*/
          (ctx2[0] ? "translate(92px, 72px)" : "translate(4px, 72px)"));
        }
        if (dirty & /*title*/
        4 && input.value !== /*title*/
        ctx2[2]) {
          set_input_value(
            input,
            /*title*/
            ctx2[2]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(form);
        }
        mounted2 = false;
        run_all(dispose);
      }
    };
  }
  function instance$e($$self, $$props, $$invalidate) {
    const platform2 = getPlatform();
    let isDropdownVisible = false;
    let currentCategory = Category.renqi;
    let title2 = getTitle();
    function handleDropdownToggle() {
      $$invalidate(0, isDropdownVisible = !isDropdownVisible);
    }
    function handleOutsideClick(event) {
      const dropdown = document.getElementById("dropdown");
      const button = document.getElementById("dropdown-button");
      if (dropdown && !dropdown.contains(event.target) && button && !button.contains(event.target)) {
        $$invalidate(0, isDropdownVisible = false);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    async function handleSubmit() {
      const json = await get(API.getCompareGoodsList, { title: title2, platform: platform2, sort: currentCategory });
      if (json && json.data) {
        goodsList.updateGoodsList(json.data.list);
      }
    }
    function handleDropdownClick(category) {
      return (e) => {
        e.stopPropagation();
        $$invalidate(1, currentCategory = category);
        $$invalidate(0, isDropdownVisible = false);
        if (title2 == "") {
          e.preventDefault();
          return;
        }
        handleSubmit();
      };
    }
    function input_input_handler() {
      title2 = this.value;
      $$invalidate(2, title2);
    }
    return [
      isDropdownVisible,
      currentCategory,
      title2,
      handleDropdownToggle,
      handleSubmit,
      handleDropdownClick,
      input_input_handler
    ];
  }
  class Search extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$e, create_fragment$f, safe_not_equal, {});
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
  function create_fragment$e(ctx) {
    let span;
    let t;
    let mounted2;
    let dispose;
    return {
      c() {
        span = element("span");
        t = text(
          /*text*/
          ctx[0]
        );
        attr(span, "class", "h-[16px] cursor-pointer rounded-sm bg-[#ffe8e7] px-[3px] text-[12px] leading-[16px] text-[#ff2828]");
        attr(
          span,
          "title",
          /*title*/
          ctx[1]
        );
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);
        if (!mounted2) {
          dispose = listen(
            span,
            "click",
            /*handleClick*/
            ctx[2]
          );
          mounted2 = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & /*text*/
        1) set_data(
          t,
          /*text*/
          ctx2[0]
        );
        if (dirty & /*title*/
        2) {
          attr(
            span,
            "title",
            /*title*/
            ctx2[1]
          );
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) {
          detach(span);
        }
        mounted2 = false;
        dispose();
      }
    };
  }
  function instance$d($$self, $$props, $$invalidate) {
    let { text: text2 = "" } = $$props;
    let { url = "" } = $$props;
    let { title: title2 = "" } = $$props;
    const platform2 = getPlatform();
    let { pf = void 0 } = $$props;
    const handleClick = () => {
      var _a;
      if (Platform.Vip == platform2 && pf == Platform.Vip) {
        (_a = document.querySelector(".J-getCouponBtn")) == null ? void 0 : _a.click();
        return;
      }
      if (url) {
        openWindow(url);
      }
    };
    $$self.$$set = ($$props2) => {
      if ("text" in $$props2) $$invalidate(0, text2 = $$props2.text);
      if ("url" in $$props2) $$invalidate(3, url = $$props2.url);
      if ("title" in $$props2) $$invalidate(1, title2 = $$props2.title);
      if ("pf" in $$props2) $$invalidate(4, pf = $$props2.pf);
    };
    return [text2, title2, handleClick, url, pf];
  }
  class Tag extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$d, create_fragment$e, safe_not_equal, { text: 0, url: 3, title: 1, pf: 4 });
    }
  }
  function create_fragment$d(ctx) {
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
  function instance$c($$self, $$props, $$invalidate) {
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
          logoBackgroundTransparent: true,
          drawer: "canvas"
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
      init(this, options, instance$c, create_fragment$d, safe_not_equal, {
        url: 1,
        width: 2,
        height: 3,
        logo: 4,
        logoWidth: 5
      });
    }
  }
  function create_fragment$c(ctx) {
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
  function instance$b($$self, $$props, $$invalidate) {
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
      init(this, options, instance$b, create_fragment$c, safe_not_equal, {});
    }
  }
  function create_if_block$8(ctx) {
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
  function create_fragment$b(ctx) {
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
  function instance$a($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { show = false } = $$props;
    let { title: title2 = "微信扫码购买" } = $$props;
    const dispatch = createEventDispatcher();
    function closeModal() {
      dispatch("close");
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
      init(this, options, instance$a, create_fragment$b, safe_not_equal, { show: 0, title: 1 });
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
  function get_each_context$4(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[9] = list[i];
    return child_ctx;
  }
  function create_if_block$7(ctx) {
    let div;
    let table;
    let tbody;
    let t;
    let modal;
    let current;
    let each_value = ensure_array_like(
      /*$goodsList*/
      ctx[4]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    modal = new Modal({
      props: {
        show: (
          /*showModal*/
          ctx[0]
        ),
        title: (
          /*modalTitle*/
          ctx[2]
        ),
        $$slots: { default: [create_default_slot$2] },
        $$scope: { ctx }
      }
    });
    modal.$on(
      "close",
      /*close_handler*/
      ctx[8]
    );
    return {
      c() {
        div = element("div");
        table = element("table");
        tbody = element("tbody");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t = space();
        create_component(modal.$$.fragment);
        attr(table, "class", "min-w-full border bg-white");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, table);
        append(table, tbody);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(tbody, null);
          }
        }
        append(div, t);
        mount_component(modal, div, null);
        current = true;
      },
      p(ctx2, dirty) {
        if (dirty & /*$goodsList, handleShowQrCode, window, handleGo*/
        112) {
          each_value = ensure_array_like(
            /*$goodsList*/
            ctx2[4]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$4(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block$4(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(tbody, null);
            }
          }
          group_outros();
          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }
          check_outros();
        }
        const modal_changes = {};
        if (dirty & /*showModal*/
        1) modal_changes.show = /*showModal*/
        ctx2[0];
        if (dirty & /*modalTitle*/
        4) modal_changes.title = /*modalTitle*/
        ctx2[2];
        if (dirty & /*$$scope, imageUrl, currentPlatform*/
        4106) {
          modal_changes.$$scope = { dirty, ctx: ctx2 };
        }
        modal.$set(modal_changes);
      },
      i(local) {
        if (current) return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        transition_in(modal.$$.fragment, local);
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        transition_out(modal.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div);
        }
        destroy_each(each_blocks, detaching);
        destroy_component(modal);
      }
    };
  }
  function create_if_block_2$2(ctx) {
    let span;
    let t0;
    let t1_value = (
      /*item*/
      ctx[9].origin_price + ""
    );
    let t1;
    return {
      c() {
        span = element("span");
        t0 = text("¥");
        t1 = text(t1_value);
        attr(span, "class", "text-[16px] text-gray-500 line-through");
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t0);
        append(span, t1);
      },
      p(ctx2, dirty) {
        if (dirty & /*$goodsList*/
        16 && t1_value !== (t1_value = /*item*/
        ctx2[9].origin_price + "")) set_data(t1, t1_value);
      },
      d(detaching) {
        if (detaching) {
          detach(span);
        }
      }
    };
  }
  function create_if_block_1$3(ctx) {
    let tag;
    let current;
    tag = new Tag({
      props: {
        pf: (
          /*item*/
          ctx[9].platform
        ),
        url: (
          /*item*/
          ctx[9].short_url
        ),
        text: `券${/*item*/
      ctx[9].coupon}元`,
        title: `${/*item*/
      ctx[9].coupon_desc}，有效期：${/*item*/
      ctx[9].coupon_start_time}至${/*item*/
      ctx[9].coupon_end_time}`
      }
    });
    return {
      c() {
        create_component(tag.$$.fragment);
      },
      m(target, anchor) {
        mount_component(tag, target, anchor);
        current = true;
      },
      p(ctx2, dirty) {
        const tag_changes = {};
        if (dirty & /*$goodsList*/
        16) tag_changes.pf = /*item*/
        ctx2[9].platform;
        if (dirty & /*$goodsList*/
        16) tag_changes.url = /*item*/
        ctx2[9].short_url;
        if (dirty & /*$goodsList*/
        16) tag_changes.text = `券${/*item*/
      ctx2[9].coupon}元`;
        if (dirty & /*$goodsList*/
        16) tag_changes.title = `${/*item*/
      ctx2[9].coupon_desc}，有效期：${/*item*/
      ctx2[9].coupon_start_time}至${/*item*/
      ctx2[9].coupon_end_time}`;
        tag.$set(tag_changes);
      },
      i(local) {
        if (current) return;
        transition_in(tag.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(tag.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(tag, detaching);
      }
    };
  }
  function create_each_block$4(ctx) {
    let tr;
    let td;
    let div6;
    let div0;
    let a0;
    let img0;
    let img0_src_value;
    let img0_alt_value;
    let a0_href_value;
    let t0;
    let div4;
    let div1;
    let img1;
    let img1_src_value;
    let t1;
    let a1;
    let t2_value = (
      /*item*/
      ctx[9].title + ""
    );
    let t2;
    let t3;
    let div2;
    let span0;
    let t4;
    let t5_value = (
      /*item*/
      ctx[9].price + ""
    );
    let t5;
    let t6;
    let t7;
    let t8;
    let div3;
    let span1;
    let t10;
    let div5;
    let qrcode;
    let t11;
    let span2;
    let td_title_value;
    let t13;
    let current;
    let mounted2;
    let dispose;
    let if_block0 = (
      /*item*/
      ctx[9].origin_price && /*item*/
      ctx[9].origin_price > /*item*/
      ctx[9].price && create_if_block_2$2(ctx)
    );
    let if_block1 = (
      /*item*/
      ctx[9].coupon > 0 && create_if_block_1$3(ctx)
    );
    function click_handler() {
      return (
        /*click_handler*/
        ctx[7](
          /*item*/
          ctx[9]
        )
      );
    }
    qrcode = new QrCode({
      props: {
        url: (
          /*item*/
          ctx[9].short_url
        ),
        logo: getPlatformLogo(
          /*item*/
          ctx[9].platform
        ),
        logoWidth: getLogoWidth(
          /*item*/
          ctx[9].platform
        )
      }
    });
    return {
      c() {
        tr = element("tr");
        td = element("td");
        div6 = element("div");
        div0 = element("div");
        a0 = element("a");
        img0 = element("img");
        t0 = space();
        div4 = element("div");
        div1 = element("div");
        img1 = element("img");
        t1 = space();
        a1 = element("a");
        t2 = text(t2_value);
        t3 = space();
        div2 = element("div");
        span0 = element("span");
        t4 = text("¥");
        t5 = text(t5_value);
        t6 = space();
        if (if_block0) if_block0.c();
        t7 = space();
        if (if_block1) if_block1.c();
        t8 = space();
        div3 = element("div");
        span1 = element("span");
        span1.textContent = "更多结果";
        t10 = space();
        div5 = element("div");
        create_component(qrcode.$$.fragment);
        t11 = space();
        span2 = element("span");
        span2.textContent = "官方二维码";
        t13 = space();
        if (!src_url_equal(img0.src, img0_src_value = /*item*/
        ctx[9].img)) attr(img0, "src", img0_src_value);
        attr(img0, "alt", img0_alt_value = /*item*/
        ctx[9].title);
        attr(img0, "class", "mx-auto h-auto w-[80px]");
        attr(a0, "href", a0_href_value = /*item*/
        ctx[9].img);
        attr(a0, "target", "_blank");
        attr(div0, "class", "w-[80px] flex-shrink-0");
        if (!src_url_equal(img1.src, img1_src_value = getPlatformLogo(
          /*item*/
          ctx[9].platform
        ))) attr(img1, "src", img1_src_value);
        attr(img1, "alt", "platform");
        set_style(img1, "height", "15px");
        set_style(img1, "margin-right", "4px");
        set_style(img1, "vertical-align", "middle");
        attr(a1, "class", "cursor-pointer text-[16px] underline hover:text-red-600");
        set_style(a1, "vertical-align", "middle");
        attr(div1, "class", "");
        attr(span0, "class", "text-[16px] text-red-600");
        attr(div2, "class", "mt-[4px] flex items-center gap-2");
        attr(span1, "class", "cursor-pointer text-[14px] text-blue-500 underline hover:text-red-600");
        attr(div3, "class", "mt-[2px]");
        attr(div4, "class", "flex-1");
        attr(span2, "class", "text-[12px]");
        attr(div5, "class", "flex cursor-pointer flex-col items-center gap-[8px]");
        attr(div5, "title", "官方商品二维码，安全无毒，点击可放大");
        attr(div6, "class", "flex items-center gap-[12px]");
        attr(td, "class", "border-b px-4 py-2");
        attr(td, "title", td_title_value = /*item*/
        ctx[9].title);
      },
      m(target, anchor) {
        insert(target, tr, anchor);
        append(tr, td);
        append(td, div6);
        append(div6, div0);
        append(div0, a0);
        append(a0, img0);
        append(div6, t0);
        append(div6, div4);
        append(div4, div1);
        append(div1, img1);
        append(div1, t1);
        append(div1, a1);
        append(a1, t2);
        append(div4, t3);
        append(div4, div2);
        append(div2, span0);
        append(span0, t4);
        append(span0, t5);
        append(div2, t6);
        if (if_block0) if_block0.m(div2, null);
        append(div2, t7);
        if (if_block1) if_block1.m(div2, null);
        append(div4, t8);
        append(div4, div3);
        append(div3, span1);
        append(div6, t10);
        append(div6, div5);
        mount_component(qrcode, div5, null);
        append(div5, t11);
        append(div5, span2);
        append(tr, t13);
        current = true;
        if (!mounted2) {
          dispose = [
            listen(a1, "click", function() {
              if (is_function(
                /*handleGo*/
                ctx[5](
                  /*item*/
                  ctx[9]
                )
              )) ctx[5](
                /*item*/
                ctx[9]
              ).apply(this, arguments);
            }),
            listen(span1, "click", click_handler),
            listen(div5, "click", function() {
              if (is_function(
                /*handleShowQrCode*/
                ctx[6](
                  /*item*/
                  ctx[9]
                )
              )) ctx[6](
                /*item*/
                ctx[9]
              ).apply(this, arguments);
            })
          ];
          mounted2 = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (!current || dirty & /*$goodsList*/
        16 && !src_url_equal(img0.src, img0_src_value = /*item*/
        ctx[9].img)) {
          attr(img0, "src", img0_src_value);
        }
        if (!current || dirty & /*$goodsList*/
        16 && img0_alt_value !== (img0_alt_value = /*item*/
        ctx[9].title)) {
          attr(img0, "alt", img0_alt_value);
        }
        if (!current || dirty & /*$goodsList*/
        16 && a0_href_value !== (a0_href_value = /*item*/
        ctx[9].img)) {
          attr(a0, "href", a0_href_value);
        }
        if (!current || dirty & /*$goodsList*/
        16 && !src_url_equal(img1.src, img1_src_value = getPlatformLogo(
          /*item*/
          ctx[9].platform
        ))) {
          attr(img1, "src", img1_src_value);
        }
        if ((!current || dirty & /*$goodsList*/
        16) && t2_value !== (t2_value = /*item*/
        ctx[9].title + "")) set_data(t2, t2_value);
        if ((!current || dirty & /*$goodsList*/
        16) && t5_value !== (t5_value = /*item*/
        ctx[9].price + "")) set_data(t5, t5_value);
        if (
          /*item*/
          ctx[9].origin_price && /*item*/
          ctx[9].origin_price > /*item*/
          ctx[9].price
        ) {
          if (if_block0) {
            if_block0.p(ctx, dirty);
          } else {
            if_block0 = create_if_block_2$2(ctx);
            if_block0.c();
            if_block0.m(div2, t7);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (
          /*item*/
          ctx[9].coupon > 0
        ) {
          if (if_block1) {
            if_block1.p(ctx, dirty);
            if (dirty & /*$goodsList*/
            16) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_1$3(ctx);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div2, null);
          }
        } else if (if_block1) {
          group_outros();
          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });
          check_outros();
        }
        const qrcode_changes = {};
        if (dirty & /*$goodsList*/
        16) qrcode_changes.url = /*item*/
        ctx[9].short_url;
        if (dirty & /*$goodsList*/
        16) qrcode_changes.logo = getPlatformLogo(
          /*item*/
          ctx[9].platform
        );
        if (dirty & /*$goodsList*/
        16) qrcode_changes.logoWidth = getLogoWidth(
          /*item*/
          ctx[9].platform
        );
        qrcode.$set(qrcode_changes);
        if (!current || dirty & /*$goodsList*/
        16 && td_title_value !== (td_title_value = /*item*/
        ctx[9].title)) {
          attr(td, "title", td_title_value);
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block1);
        transition_in(qrcode.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(if_block1);
        transition_out(qrcode.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(tr);
        }
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
        destroy_component(qrcode);
        mounted2 = false;
        run_all(dispose);
      }
    };
  }
  function create_default_slot$2(ctx) {
    let qrcode;
    let current;
    qrcode = new QrCode({
      props: {
        url: (
          /*imageUrl*/
          ctx[1]
        ),
        width: 250,
        height: 250,
        logo: getPlatformLogo(
          /*currentPlatform*/
          ctx[3]
        ),
        logoWidth: getLogoWidth(
          /*currentPlatform*/
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
        const qrcode_changes = {};
        if (dirty & /*imageUrl*/
        2) qrcode_changes.url = /*imageUrl*/
        ctx2[1];
        if (dirty & /*currentPlatform*/
        8) qrcode_changes.logo = getPlatformLogo(
          /*currentPlatform*/
          ctx2[3]
        );
        if (dirty & /*currentPlatform*/
        8) qrcode_changes.logoWidth = getLogoWidth(
          /*currentPlatform*/
          ctx2[3],
          2
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
  function create_fragment$a(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*$goodsList*/
      ctx[4] != null && /*$goodsList*/
      ctx[4].length > 0 && create_if_block$7(ctx)
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
          /*$goodsList*/
          ctx2[4] != null && /*$goodsList*/
          ctx2[4].length > 0
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
            if (dirty & /*$goodsList*/
            16) {
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
  function instance$9($$self, $$props, $$invalidate) {
    let $goodsList;
    component_subscribe($$self, goodsList, ($$value) => $$invalidate(4, $goodsList = $$value));
    let showModal = false;
    let imageUrl = "";
    let modalTitle = "";
    let currentPlatform = Platform.None;
    function handleGo(item) {
      return async () => {
        openWindow(item.short_url);
      };
    }
    function handleShowQrCode(item) {
      return () => {
        if (item.platform == Platform.Tmall) {
          $$invalidate(2, modalTitle = "天猫/淘宝APP扫码购买");
        } else {
          $$invalidate(2, modalTitle = `微信扫码，${getPlatformName(item.platform)}购买`);
        }
        $$invalidate(3, currentPlatform = item.platform);
        $$invalidate(0, showModal = true);
        $$invalidate(1, imageUrl = item.short_url);
      };
    }
    const click_handler = (item) => window.open(item.more_url);
    const close_handler = () => $$invalidate(0, showModal = false);
    return [
      showModal,
      imageUrl,
      modalTitle,
      currentPlatform,
      $goodsList,
      handleGo,
      handleShowQrCode,
      click_handler,
      close_handler
    ];
  }
  class Products extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$9, create_fragment$a, safe_not_equal, {});
    }
  }
  function create_if_block$6(ctx) {
    let div2;
    let div0;
    let p0;
    let t0;
    let t1;
    let t2;
    let t3;
    let p1;
    let t4;
    let t5;
    let t6;
    let t7;
    let div1;
    let if_block0 = (
      /*max_date*/
      ctx[3] != "" && create_if_block_2$1(ctx)
    );
    let if_block1 = (
      /*min_date*/
      ctx[2] != "" && create_if_block_1$2(ctx)
    );
    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        p0 = element("p");
        t0 = text("最高价：");
        t1 = text(
          /*max*/
          ctx[0]
        );
        t2 = space();
        if (if_block0) if_block0.c();
        t3 = space();
        p1 = element("p");
        t4 = text("最低价：");
        t5 = text(
          /*min*/
          ctx[1]
        );
        t6 = space();
        if (if_block1) if_block1.c();
        t7 = space();
        div1 = element("div");
        attr(p0, "class", "text-red-500");
        attr(p1, "class", "mt-[8px] text-green-500");
        attr(div0, "class", "text-center");
        attr(div1, "id", "buding-his-price-chart");
        attr(div1, "class", "relative mt-[16px]");
        attr(div2, "class", "mt-[16px]");
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);
        append(div0, p0);
        append(p0, t0);
        append(p0, t1);
        append(p0, t2);
        if (if_block0) if_block0.m(p0, null);
        append(div0, t3);
        append(div0, p1);
        append(p1, t4);
        append(p1, t5);
        append(p1, t6);
        if (if_block1) if_block1.m(p1, null);
        append(div2, t7);
        append(div2, div1);
      },
      p(ctx2, dirty) {
        if (dirty & /*max*/
        1) set_data(
          t1,
          /*max*/
          ctx2[0]
        );
        if (
          /*max_date*/
          ctx2[3] != ""
        ) {
          if (if_block0) {
            if_block0.p(ctx2, dirty);
          } else {
            if_block0 = create_if_block_2$1(ctx2);
            if_block0.c();
            if_block0.m(p0, null);
          }
        } else if (if_block0) {
          if_block0.d(1);
          if_block0 = null;
        }
        if (dirty & /*min*/
        2) set_data(
          t5,
          /*min*/
          ctx2[1]
        );
        if (
          /*min_date*/
          ctx2[2] != ""
        ) {
          if (if_block1) {
            if_block1.p(ctx2, dirty);
          } else {
            if_block1 = create_if_block_1$2(ctx2);
            if_block1.c();
            if_block1.m(p1, null);
          }
        } else if (if_block1) {
          if_block1.d(1);
          if_block1 = null;
        }
      },
      d(detaching) {
        if (detaching) {
          detach(div2);
        }
        if (if_block0) if_block0.d();
        if (if_block1) if_block1.d();
      }
    };
  }
  function create_if_block_2$1(ctx) {
    let t0;
    let t1;
    let t2;
    return {
      c() {
        t0 = text("（");
        t1 = text(
          /*max_date*/
          ctx[3]
        );
        t2 = text("）");
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, t1, anchor);
        insert(target, t2, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*max_date*/
        8) set_data(
          t1,
          /*max_date*/
          ctx2[3]
        );
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
          detach(t2);
        }
      }
    };
  }
  function create_if_block_1$2(ctx) {
    let t0;
    let t1;
    let t2;
    return {
      c() {
        t0 = text("（");
        t1 = text(
          /*min_date*/
          ctx[2]
        );
        t2 = text("）");
      },
      m(target, anchor) {
        insert(target, t0, anchor);
        insert(target, t1, anchor);
        insert(target, t2, anchor);
      },
      p(ctx2, dirty) {
        if (dirty & /*min_date*/
        4) set_data(
          t1,
          /*min_date*/
          ctx2[2]
        );
      },
      d(detaching) {
        if (detaching) {
          detach(t0);
          detach(t1);
          detach(t2);
        }
      }
    };
  }
  function create_fragment$9(ctx) {
    let if_block_anchor;
    let if_block = (
      /*history*/
      ctx[4] && /*history*/
      ctx[4].length > 0 && create_if_block$6(ctx)
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
          /*history*/
          ctx2[4] && /*history*/
          ctx2[4].length > 0
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
  function instance$8($$self, $$props, $$invalidate) {
    let { url = location.href } = $$props;
    let chart;
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
        $$invalidate(4, history = json.data.his);
        const maxItem = history.find((item) => item.price == max);
        const minItem = history.find((item) => item.price == min);
        $$invalidate(3, max_date = maxItem ? maxItem.updatetime : "");
        $$invalidate(2, min_date = minItem ? minItem.updatetime : "");
      }
      const his = history.reverse();
      if (his.length > 0) {
        const data = his.map((data2) => ({
          time: data2.updatetime,
          value: parseFloat(data2.price)
        }));
        drawPrice(data);
      }
    }
    function drawPrice(data) {
      const container = document.getElementById("buding-his-price-chart");
      if (!container) {
        setTimeout(
          () => {
            return drawPrice(data);
          },
          500
        );
        return;
      }
      chart = lightweightCharts.createChart(container, {
        height: 400,
        layout: {
          textColor: "black",
          background: { color: "white" }
        }
      });
      chart.applyOptions({
        crosshair: {
          // hide the horizontal crosshair line
          horzLine: { visible: false, labelVisible: false },
          // hide the vertical crosshair label
          vertLine: { labelVisible: false }
        },
        // hide the grid lines
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false }
        }
      });
      const series = chart.addAreaSeries({
        topColor: "#2962FF",
        bottomColor: "rgba(41, 98, 255, 0.28)",
        lineColor: "#2962FF",
        lineWidth: 2,
        crosshairMarkerVisible: false
      });
      series.priceScale().applyOptions({
        scaleMargins: {
          top: 0.3,
          // leave some space for the legend
          bottom: 0.25
        }
      });
      const toolTipWidth = 80;
      const toolTipHeight = 80;
      const toolTipMargin = 15;
      const toolTip = document.createElement("div");
      toolTip.style.cssText = `width: 120px; height: 50px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
      toolTip.style.background = "white";
      toolTip.style.color = "black";
      toolTip.style.borderColor = "#2962FF";
      container.appendChild(toolTip);
      series.setData(data);
      chart.subscribeCrosshairMove((param) => {
        if (param.point === void 0 || !param.time || param.point.x < 0 || param.point.x > container.clientWidth || param.point.y < 0 || param.point.y > container.clientHeight) {
          toolTip.style.display = "none";
        } else {
          const dateStr = param.time;
          toolTip.style.display = "block";
          const data2 = param.seriesData.get(series);
          const price = (data2 == null ? void 0 : data2.value) ?? (data2 == null ? void 0 : data2.close) ?? 0;
          toolTip.innerHTML = `
            <div  style="color: ${"black"}">
              价格: ${price}
            </div>
            <div style="color: ${"black"}">
              日期: ${dateStr}
            </div>`;
          const coordinate = series.priceToCoordinate(price);
          let shiftedCoordinate = param.point.x - 50;
          if (coordinate === null) {
            return;
          }
          shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
          const coordinateY = coordinate - toolTipHeight - toolTipMargin > 0 ? coordinate - toolTipHeight - toolTipMargin : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
          toolTip.style.left = shiftedCoordinate + "px";
          toolTip.style.top = coordinateY + "px";
        }
      });
      chart.timeScale().fitContent();
    }
    onMount(() => {
      getHis(url);
    });
    $$self.$$set = ($$props2) => {
      if ("url" in $$props2) $$invalidate(5, url = $$props2.url);
    };
    return [max, min, min_date, max_date, history, url];
  }
  class HisPrice extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$8, create_fragment$9, safe_not_equal, { url: 5 });
    }
  }
  function get_each_context$3(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_each_block$3(ctx) {
    let div;
    let h3;
    let t1;
    let img;
    let img_src_value;
    let t2;
    return {
      c() {
        div = element("div");
        h3 = element("h3");
        h3.textContent = `${/*item*/
      ctx[4].title}`;
        t1 = space();
        img = element("img");
        t2 = space();
        attr(h3, "class", "text-center");
        set_style(h3, "margin-bottom", "12px");
        if (!src_url_equal(img.src, img_src_value = /*item*/
        ctx[4].img)) attr(img, "src", img_src_value);
        attr(
          img,
          "alt",
          /*item*/
          ctx[4].title
        );
        set_style(img, "width", "280px");
        attr(div, "class", "cursor-pointer rounded-md p-[20px]");
        set_style(div, "border", "1px solid #eee");
        set_style(div, "margin-bottom", "20px");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, h3);
        append(div, t1);
        append(div, img);
        append(div, t2);
      },
      p: noop,
      d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }
  function create_default_slot$1(ctx) {
    let div;
    let each_value = ensure_array_like(
      /*list*/
      ctx[1]
    );
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    }
    return {
      c() {
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        attr(div, "class", "flex flex-wrap items-center justify-center gap-[20px] overflow-auto");
        set_style(div, "max-height", "600px");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*list*/
        2) {
          each_value = ensure_array_like(
            /*list*/
            ctx2[1]
          );
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$3(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$3(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div, null);
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
          detach(div);
        }
        destroy_each(each_blocks, detaching);
      }
    };
  }
  function create_fragment$8(ctx) {
    let div;
    let span;
    let t1;
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
        title: "外卖红包",
        $$slots: { default: [create_default_slot$1] },
        $$scope: { ctx }
      }
    });
    modal.$on(
      "close",
      /*close_handler*/
      ctx[3]
    );
    return {
      c() {
        div = element("div");
        span = element("span");
        span.textContent = "外卖红包";
        t1 = space();
        create_component(modal.$$.fragment);
        attr(span, "class", "cursor-pointer text-blue-500 underline");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span);
        append(div, t1);
        mount_component(modal, div, null);
        current = true;
        if (!mounted2) {
          dispose = listen(
            span,
            "click",
            /*handleOpenModal*/
            ctx[2]
          );
          mounted2 = true;
        }
      },
      p(ctx2, [dirty]) {
        const modal_changes = {};
        if (dirty & /*showModal*/
        1) modal_changes.show = /*showModal*/
        ctx2[0];
        if (dirty & /*$$scope*/
        128) {
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
  function instance$7($$self, $$props, $$invalidate) {
    let showModal = false;
    const list = [
      {
        title: "美团外卖红包",
        img: "https://www.jasonzk.com/images/promotion/meituan.jpg"
      },
      {
        title: "饿了么外卖红包",
        img: "https://www.jasonzk.com/images/promotion/elme.jpg"
      },
      {
        title: "支付宝红包",
        img: "https://www.jasonzk.com/images/promotion/zfb.jpg"
      }
    ];
    function handleOpenModal() {
      $$invalidate(0, showModal = true);
    }
    const close_handler = () => $$invalidate(0, showModal = false);
    return [showModal, list, handleOpenModal, close_handler];
  }
  class Takeaway extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$8, safe_not_equal, {});
    }
  }
  function create_if_block$5(ctx) {
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
  function create_fragment$7(ctx) {
    let if_block_anchor;
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
      },
      p(ctx2, [dirty]) {
        if (
          /*activityItem*/
          ctx2[0]
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block$5(ctx2);
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
  function instance$6($$self, $$props, $$invalidate) {
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
      init(this, options, instance$6, create_fragment$7, safe_not_equal, { activityItem: 0, platform: 1 });
    }
    get platform() {
      return this.$$.ctx[1];
    }
  }
  function create_if_block$4(ctx) {
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
      ctx[0].short_url != "" && create_if_block_1$1(ctx)
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
            if_block2 = create_if_block_1$1(ctx2);
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
  function create_if_block_1$1(ctx) {
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
  function create_fragment$6(ctx) {
    let if_block_anchor;
    let current;
    let if_block = (
      /*activityItem*/
      ctx[0] && create_if_block$4(ctx)
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
  function instance$5($$self, $$props, $$invalidate) {
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
      init(this, options, instance$5, create_fragment$6, safe_not_equal, { activityItem: 0, platform: 1 });
    }
  }
  function get_each_context$2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }
  function create_if_block$3(ctx) {
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
  function create_fragment$5(ctx) {
    let if_block_anchor;
    let if_block = (
      /*activityItem*/
      ctx[0] && /*activityItem*/
      ctx[0].list && /*activityItem*/
      ctx[0].list.length > 0 && create_if_block$3(ctx)
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
            if_block = create_if_block$3(ctx2);
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
  function instance$4($$self, $$props, $$invalidate) {
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
      init(this, options, instance$4, create_fragment$5, safe_not_equal, { activityItem: 0, platform: 3 });
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
  function create_if_block$2(ctx) {
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
    let if_block = show_if && create_if_block$2(ctx);
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
  function create_fragment$4(ctx) {
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
  function instance$3($$self, $$props, $$invalidate) {
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
      init(this, options, instance$3, create_fragment$4, safe_not_equal, { data: 0, platform: 1 });
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
  function create_if_block$1(ctx) {
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
  function create_if_block_1(ctx) {
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
      ctx[12] && create_if_block_1(ctx)
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
            if_block = create_if_block_1(ctx2);
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
  function create_fragment$3(ctx) {
    var _a;
    let if_block_anchor;
    let current;
    let if_block = (
      /*activityList*/
      ctx[1] && /*activityList*/
      ((_a = ctx[1]) == null ? void 0 : _a.show) && create_if_block$1(ctx)
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
            if_block = create_if_block$1(ctx2);
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
  function instance$2($$self, $$props, $$invalidate) {
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
      init(this, options, instance$2, create_fragment$3, safe_not_equal, {});
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
  const setCardLink = (newLink) => {
    link = newLink;
  };
  const getCardLink = () => {
    return link;
  };
  function create_if_block(ctx) {
    let t;
    return {
      c() {
        t = text("暂无商品，");
      },
      m(target, anchor) {
        insert(target, t, anchor);
      },
      d(detaching) {
        if (detaching) {
          detach(t);
        }
      }
    };
  }
  function create_fragment$1(ctx) {
    let div6;
    let div5;
    let search;
    let t0;
    let div0;
    let t1;
    let div1;
    let t2;
    let a0;
    let t4;
    let a1;
    let svg;
    let path;
    let t5;
    let div2;
    let t6;
    let div3;
    let activitycontainer;
    let t7;
    let takeaway;
    let t8;
    let card;
    let t9;
    let div4;
    let t10;
    let products;
    let t11;
    let hisprice;
    let current;
    search = new Search({});
    let if_block = (
      /*$goodsList*/
      (ctx[1] == null || /*$goodsList*/
      ctx[1].length == 0) && create_if_block()
    );
    activitycontainer = new Container({});
    takeaway = new Takeaway({});
    card = new Card({ props: { link: getCardLink() } });
    products = new Products({});
    hisprice = new HisPrice({});
    return {
      c() {
        div6 = element("div");
        div5 = element("div");
        create_component(search.$$.fragment);
        t0 = space();
        div0 = element("div");
        t1 = space();
        div1 = element("div");
        if (if_block) if_block.c();
        t2 = text("\r\n      更多商品优惠请访问：");
        a0 = element("a");
        a0.textContent = "布丁领券";
        t4 = space();
        a1 = element("a");
        svg = svg_element("svg");
        path = svg_element("path");
        t5 = space();
        div2 = element("div");
        t6 = space();
        div3 = element("div");
        create_component(activitycontainer.$$.fragment);
        t7 = space();
        create_component(takeaway.$$.fragment);
        t8 = space();
        create_component(card.$$.fragment);
        t9 = space();
        div4 = element("div");
        t10 = space();
        create_component(products.$$.fragment);
        t11 = space();
        create_component(hisprice.$$.fragment);
        attr(div0, "class", "mt-4");
        attr(a0, "href", "https://coupon.jasonzk.com");
        attr(a0, "class", "text-red-500 hover:text-red-600 hover:underline");
        attr(a0, "target", "_blank");
        attr(path, "stroke-linecap", "round");
        attr(path, "stroke-linejoin", "round");
        attr(path, "d", "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr(svg, "fill", "none");
        attr(svg, "viewBox", "0 0 24 24");
        attr(svg, "stroke-width", "1.5");
        attr(svg, "stroke", "currentColor");
        attr(svg, "width", "16px");
        attr(svg, "height", "16px");
        attr(a1, "href", "https://www.jasonzk.com/saves/coupon-intro/");
        attr(a1, "class", "absolute ml-[2px] text-red-500");
        attr(a1, "target", "_blank");
        set_style(
          a1,
          "margin-top",
          /*infoMarginTop*/
          ctx[0]
        );
        attr(a1, "title", "查看布丁领券使用说明");
        attr(div1, "class", "text-center");
        attr(div2, "class", "mt-4");
        attr(div3, "class", "flex flex-wrap items-center justify-center gap-[8px] text-center");
        attr(div4, "class", "mt-4");
        attr(div5, "class", "rounded-lg bg-gray-100 px-[12px] py-[24px]");
        attr(div6, "class", "my-[24px]");
      },
      m(target, anchor) {
        insert(target, div6, anchor);
        append(div6, div5);
        mount_component(search, div5, null);
        append(div5, t0);
        append(div5, div0);
        append(div5, t1);
        append(div5, div1);
        if (if_block) if_block.m(div1, null);
        append(div1, t2);
        append(div1, a0);
        append(div1, t4);
        append(div1, a1);
        append(a1, svg);
        append(svg, path);
        append(div5, t5);
        append(div5, div2);
        append(div5, t6);
        append(div5, div3);
        mount_component(activitycontainer, div3, null);
        append(div3, t7);
        mount_component(takeaway, div3, null);
        append(div3, t8);
        mount_component(card, div3, null);
        append(div5, t9);
        append(div5, div4);
        append(div5, t10);
        mount_component(products, div5, null);
        append(div5, t11);
        mount_component(hisprice, div5, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (
          /*$goodsList*/
          ctx2[1] == null || /*$goodsList*/
          ctx2[1].length == 0
        ) {
          if (if_block) ;
          else {
            if_block = create_if_block();
            if_block.c();
            if_block.m(div1, t2);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
        if (!current || dirty & /*infoMarginTop*/
        1) {
          set_style(
            a1,
            "margin-top",
            /*infoMarginTop*/
            ctx2[0]
          );
        }
      },
      i(local) {
        if (current) return;
        transition_in(search.$$.fragment, local);
        transition_in(activitycontainer.$$.fragment, local);
        transition_in(takeaway.$$.fragment, local);
        transition_in(card.$$.fragment, local);
        transition_in(products.$$.fragment, local);
        transition_in(hisprice.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(search.$$.fragment, local);
        transition_out(activitycontainer.$$.fragment, local);
        transition_out(takeaway.$$.fragment, local);
        transition_out(card.$$.fragment, local);
        transition_out(products.$$.fragment, local);
        transition_out(hisprice.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(div6);
        }
        destroy_component(search);
        if (if_block) if_block.d();
        destroy_component(activitycontainer);
        destroy_component(takeaway);
        destroy_component(card);
        destroy_component(products);
        destroy_component(hisprice);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let $goodsList;
    component_subscribe($$self, goodsList, ($$value) => $$invalidate(1, $goodsList = $$value));
    let infoMarginTop = "1px";
    const platform2 = getPlatform();
    if (platform2 == Platform.Tmall) {
      infoMarginTop = "2px";
    }
    return [infoMarginTop, $goodsList];
  }
  class Compare extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment$1, safe_not_equal, {});
    }
  }
  function create_fragment(ctx) {
    let main;
    let compare;
    let current;
    compare = new Compare({});
    return {
      c() {
        main = element("main");
        create_component(compare.$$.fragment);
      },
      m(target, anchor) {
        insert(target, main, anchor);
        mount_component(compare, main, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current) return;
        transition_in(compare.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(compare.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching) {
          detach(main);
        }
        destroy_component(compare);
      }
    };
  }
  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, null, create_fragment, safe_not_equal, {});
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
        title: title2 ?? "",
        dl: dl ? 1 : 0,
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
    const title2 = await initTitle();
    if (title2 == "" && platform2 == Platform.None) {
      return;
    }
    const json = await get(API.getCompareGoodsList, {
      title: title2,
      platform: platform2,
      sort: Category.renqi
    });
    if (json && json.data) {
      goodsList.updateGoodsList(json.data.list);
      setCardLink(json.data.card);
      const target = await createTarget(json.data.selector);
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
    {
      checkAndUpdate();
    }
  }
  mounted();

})(CryptoJS, QRCode, LightweightCharts);