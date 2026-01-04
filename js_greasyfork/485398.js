// ==UserScript==
// @name         网易云歌单——>Bilibili视频快速匹配
// @namespace    monkey-plugin-starter
// @version      0.0.6
// @author       monkey
// @description  快速拉取网易云歌单列表，用于匹配哔哩哔哩原版歌曲
// @license      MIT
// @icon         https://api.iconify.design/simple-icons:applemusic.svg
// @match        https://www.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.15/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/axios@1.6.5/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @resource     @unocss/reset/tailwind-compat.css  https://cdn.jsdelivr.net/npm/@unocss/reset@0.58.3/reset/tailwind-compat.css
// @resource     vue3-toastify/dist/index.css       https://cdn.jsdelivr.net/npm/vue3-toastify@0.2.1/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/485398/%E7%BD%91%E6%98%93%E4%BA%91%E6%AD%8C%E5%8D%95%E2%80%94%E2%80%94%3EBilibili%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/485398/%E7%BD%91%E6%98%93%E4%BA%91%E6%AD%8C%E5%8D%95%E2%80%94%E2%80%94%3EBilibili%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const t=document.createElement("style");t.textContent=r,document.head.append(t)})(` @charset "UTF-8";.loader[data-v-0e2c1d51]{width:100%;height:.25rem;border-radius:9999px;background:repeating-linear-gradient(135deg,#f03355 0,#f03355 10px,#ffa516 0,#ffa516 20px) 0/0% no-repeat;animation:loading-0e2c1d51 2s infinite}@keyframes loading-0e2c1d51{to{background-size:100%}}[data-v-6faa8d1d]::-webkit-scrollbar{width:6px}[data-v-6faa8d1d]::-webkit-scrollbar-thumb{background:#888;border-radius:10px}[data-v-6faa8d1d]::-webkit-scrollbar-thumb:hover{background:#555}.keyword{--un-text-opacity:1;color:rgb(252 128 161 / var(--un-text-opacity));font-style:normal}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.i-carbon-checkmark-filled{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m-2 19.59l-5-5L10.59 15L14 18.41L21.41 11l1.596 1.586Z'/%3E%3Cpath fill='none' d='m14 21.591l-5-5L10.591 15L14 18.409L21.41 11l1.595 1.585z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em}.center{display:flex;align-items:center;justify-content:center}.btn-main{border-radius:.5rem;--un-bg-opacity:1 !important;background-color:rgb(252 128 161 / var(--un-bg-opacity))!important;padding:.25rem .75rem;font-size:1.125rem;line-height:1.75rem;--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity));font-weight:700}.text{font-size:1.125rem;line-height:1.75rem;font-weight:700}@media (min-width: 640px){.text{font-size:1.5rem;line-height:2rem}}@media (min-width: 768px){.text{font-size:1.875rem;line-height:2.25rem}}@media (min-width: 1024px){.text{font-size:2.25rem;line-height:2.5rem}}:root,[data-theme]{background-color:hsl(var(--b1) / var(--un-bg-opacity, 1));color:hsl(var(--bc) / var(--un-text-opacity, 1))}html{-webkit-tap-highlight-color:transparent}.badge{display:inline-flex;align-items:center;justify-content:center;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);height:1.25rem;font-size:.875rem;line-height:1.25rem;width:-moz-fit-content;width:fit-content;padding-left:.563rem;padding-right:.563rem;border-width:1px;--un-border-opacity: 1;border-color:hsl(var(--b2) / var(--un-border-opacity));--un-bg-opacity: 1;background-color:hsl(var(--b1) / var(--un-bg-opacity));--un-text-opacity: 1;color:hsl(var(--bc) / var(--un-text-opacity));border-radius:var(--rounded-badge, 1.9rem)}.btn:active:hover{animation:none;transform:scale(var(--btn-focus-scale, .97))}.btn:hover{--un-border-opacity: 1;border-color:hsl(var(--b3) / var(--un-border-opacity));--un-bg-opacity: 1;background-color:hsl(var(--b3) / var(--un-bg-opacity))}.btn.glass:hover{--glass-opacity: 25%;--glass-border-opacity: 15% }.btn:is(input[type=checkbox]:checked):hover,.btn:is(input[type=radio]:checked):hover{--un-border-opacity: 1;border-color:hsl(var(--pf) / var(--un-border-opacity));--un-bg-opacity: 1;background-color:hsl(var(--pf) / var(--un-bg-opacity))}.btn{display:inline-flex;flex-shrink:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-wrap:wrap;align-items:center;justify-content:center;border-color:transparent;border-color:hsl(var(--b2) / var(--un-border-opacity));text-align:center;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-duration:.2s;transition-timing-function:cubic-bezier(.4,0,.2,1);border-radius:var(--rounded-btn, .5rem);height:3rem;padding-left:1rem;padding-right:1rem;font-size:.875rem;line-height:1.25rem;line-height:1em;min-height:3rem;gap:.5rem;font-weight:600;text-decoration-line:none;border-width:var(--border-btn, 1px);animation:button-pop var(--animation-btn, .25s) ease-out;text-transform:var(--btn-text-case, uppercase);--un-border-opacity: 1;--un-bg-opacity: 1;background-color:hsl(var(--b2) / var(--un-bg-opacity));--un-text-opacity: 1;color:hsl(var(--bc) / var(--un-text-opacity))}.btn:is(input[type=checkbox]),.btn:is(input[type=radio]){-webkit-appearance:none;-moz-appearance:none;appearance:none}.btn:is(input[type=checkbox]):after,.btn:is(input[type=radio]):after{--un-content: attr(aria-label);content:var(--un-content)}.btn:active:focus{animation:none;transform:scale(var(--btn-focus-scale, .97))}.btn:focus-visible{outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:hsl(var(--bc) / 1)}.btn.glass{--un-shadow: 0 0 #0000;--un-shadow-colored: 0 0 #0000;box-shadow:var(--un-ring-offset-shadow, 0 0 #0000),var(--un-ring-shadow, 0 0 #0000),var(--un-shadow)}.btn.glass.btn-active{--glass-opacity: 25%;--glass-border-opacity: 15%}.btn.glass:focus-visible{outline-color:currentColor}.btn:is(input[type=checkbox]:checked),.btn:is(input[type=radio]:checked){--un-border-opacity: 1;border-color:hsl(var(--p) / var(--un-border-opacity));--un-bg-opacity: 1;background-color:hsl(var(--p) / var(--un-bg-opacity));--un-text-opacity: 1;color:hsl(var(--pc) / var(--un-text-opacity))}.btn:is(input[type=checkbox]:checked):focus-visible,.btn:is(input[type=radio]:checked):focus-visible{outline-color:hsl(var(--p) / 1)}.btn-disabled:hover,.btn[disabled]:hover,.btn:disabled:hover{--un-border-opacity: 0;background-color:hsl(var(--n) / var(--un-bg-opacity));--un-bg-opacity: .2;color:hsl(var(--bc) / var(--un-text-opacity));--un-text-opacity: .2 }.btn-disabled,.btn[disabled],.btn:disabled{pointer-events:none;--un-border-opacity: 0;background-color:hsl(var(--n) / var(--un-bg-opacity));--un-bg-opacity: .2;color:hsl(var(--bc) / var(--un-text-opacity));--un-text-opacity: .2}.card{position:relative;display:flex;flex-direction:column;border-radius:var(--rounded-box, 1rem)}.card:focus{outline:2px solid transparent;outline-offset:2px}.card figure{display:flex;align-items:center;justify-content:center}.card.image-full{display:grid}.card.image-full:before{position:relative;content:"";z-index:10;--un-bg-opacity: 1;background-color:hsl(var(--n) / var(--un-bg-opacity));opacity:.75;border-radius:var(--rounded-box, 1rem)}.card.image-full:before,.card.image-full>*{grid-column-start:1;grid-row-start:1}.card.image-full>figure img{height:100%;-o-object-fit:cover;object-fit:cover}.card.image-full>.card-body{position:relative;z-index:20;--un-text-opacity: 1;color:hsl(var(--nc) / var(--un-text-opacity))}.card :where(figure:first-child){overflow:hidden;border-start-start-radius:inherit;border-start-end-radius:inherit;border-end-start-radius:unset;border-end-end-radius:unset}.card :where(figure:last-child){overflow:hidden;border-start-start-radius:unset;border-start-end-radius:unset;border-end-start-radius:inherit;border-end-end-radius:inherit}.card:focus-visible{outline:2px solid currentColor;outline-offset:2px}.card.bordered{border-width:1px;--un-border-opacity: 1;border-color:hsl(var(--b2) / var(--un-border-opacity))}.card.compact .card-body{padding:1rem;font-size:.875rem;line-height:1.25rem}.card.image-full :where(figure){overflow:hidden;border-radius:inherit}.card-body{display:flex;flex:1 1 auto;flex-direction:column;padding:var(--padding-card, 2rem);gap:.5rem}.card-body :where(p){flex-grow:1}.card-actions{display:flex;flex-wrap:wrap;align-items:flex-start;gap:.5rem}.indicator{position:relative;display:inline-flex;width:-moz-max-content;width:max-content}.indicator :where(.indicator-item){z-index:1;position:absolute;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y));white-space:nowrap}.indicator :where(.indicator-item){right:0;left:auto;top:0;bottom:auto;--un-translate-x: 50%;--un-translate-y: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.indicator :where(.indicator-item.indicator-start){right:auto;left:0;--un-translate-x: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.indicator :where(.indicator-item.indicator-center){right:50%;left:50%;--un-translate-x: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.indicator :where(.indicator-item.indicator-end){right:0;left:auto;--un-translate-x: 50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.indicator :where(.indicator-item.indicator-bottom){top:auto;bottom:0;--un-translate-y: 50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.indicator :where(.indicator-item.indicator-middle){top:50%;bottom:50%;--un-translate-y: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.indicator :where(.indicator-item.indicator-top){top:0;bottom:auto;--un-translate-y: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.input{flex-shrink:1;height:3rem;padding-left:1rem;padding-right:1rem;font-size:.875rem;font-size:1rem;line-height:1.25rem;line-height:2;line-height:1.5rem;border-width:1px;border-color:hsl(var(--bc) / var(--un-border-opacity));--un-border-opacity: 0;--un-bg-opacity: 1;background-color:hsl(var(--b1) / var(--un-bg-opacity));border-radius:var(--rounded-btn, .5rem)}.input[list]::-webkit-calendar-picker-indicator{line-height:1em}.input:focus{outline-style:solid;outline-width:2px;outline-offset:2px;outline-color:hsl(var(--bc) / 1)}.toast{position:fixed;display:flex;min-width:-moz-fit-content;min-width:fit-content;flex-direction:column;white-space:nowrap;gap:.5rem;padding:1rem}.toast>*{animation:toast-pop .25s ease-out}:where(.toast){right:0;left:auto;top:auto;bottom:0;--un-translate-x: 0px;--un-translate-y: 0px;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.toast:where(.toast-start){right:auto;left:0;--un-translate-x: 0px;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.toast:where(.toast-center){right:50%;left:50%;--un-translate-x: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.toast:where(.toast-end){right:0;left:auto;--un-translate-x: 0px;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.toast:where(.toast-bottom){top:auto;bottom:0;--un-translate-y: 0px;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.toast:where(.toast-middle){top:50%;bottom:auto;--un-translate-y: -50%;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.toast:where(.toast-top){top:0;bottom:auto;--un-translate-y: 0px;transform:translate(var(--un-translate-x),var(--un-translate-y)) rotate(var(--un-rotate)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y))}.loading{pointer-events:none;display:inline-block;aspect-ratio:1 / 1;width:1.5rem;background-color:currentColor;-webkit-mask-size:100%;mask-size:100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E");mask-image:url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='3'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E")}.btn-md{height:3rem;padding-left:1rem;padding-right:1rem;min-height:3rem;font-size:.875rem}@keyframes button-pop{0%{transform:scale(var(--btn-focus-scale, .98))}40%{transform:scale(1.02)}to{transform:scale(1)}}@keyframes checkmark{0%{background-position-y:5px}50%{background-position-y:-2px}to{background-position-y:0}}@keyframes progress-loading{50%{left:107%}}@keyframes radiomark{0%{box-shadow:0 0 0 12px hsl(var(--b1)) inset,0 0 0 12px hsl(var(--b1)) inset}50%{box-shadow:0 0 0 3px hsl(var(--b1)) inset,0 0 0 3px hsl(var(--b1)) inset}to{box-shadow:0 0 0 4px hsl(var(--b1)) inset,0 0 0 4px hsl(var(--b1)) inset}}@keyframes rating-pop{0%{transform:translateY(-.125em)}40%{transform:translateY(-.125em)}to{transform:translateY(0)}}@keyframes toast-pop{0%{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}:root{color-scheme:light;--pf: 331 100% 41%;--sf: 334 37% 34%;--af: 139 16% 36%;--nf: 44 100% 1%;--b2: 0 4% 84%;--b3: 0 4% 77%;--in: 198 93% 60%;--su: 158 64% 52%;--wa: 43 96% 56%;--er: 0 91% 71%;--pc: 346 100% 93%;--sc: 340 30% 88%;--ac: 136 12% 88%;--inc: 198 100% 12%;--suc: 158 100% 10%;--wac: 43 100% 11%;--erc: 0 100% 14%;--rounded-box: 1rem;--rounded-btn: .5rem;--rounded-badge: 1.9rem;--animation-btn: .25s;--animation-input: .2s;--btn-text-case: uppercase;--btn-focus-scale: .95;--border-btn: 1px;--tab-border: 1px;--tab-radius: .5rem;--p: 331 100% 48%;--s: 334 37% 41%;--a: 139 16% 43%;--n: 44 100% 8%;--nc: 0 4% 91%;--b1: 0 4% 91%;--bc: 0 3% 6%}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.sticky{position:sticky}.inset-0,.group:hover .group-hover\\:inset-0{top:0;right:0;bottom:0;left:0}.-right-2{right:-.5rem}.-top-2{top:-.5rem}.bottom-0{bottom:0}.bottom-1{bottom:.25rem}.left-0{left:0}.left-1{left:.25rem}.left-10{left:2.5rem}.right-0{right:0}.right-1{right:.25rem}.right-6{right:1.5rem}.top-0{top:0}.top-10{top:2.5rem}.line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1;line-clamp:1}.line-clamp-2{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2}.line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;line-clamp:3}.z-2{z-index:2}.z-99{z-index:99}.z-9999{z-index:9999}.mb4{margin-bottom:1rem}.ml2{margin-left:.5rem}.mt-auto{margin-top:auto}.mt3{margin-top:.75rem}.box-border{box-sizing:border-box}.h-full,.group:hover .group-hover\\:h-full{height:100%}.h1{height:.25rem}.h10{height:2.5rem}.h30{height:7.5rem}.h4{height:1rem}.h40{height:10rem}.h6{height:1.5rem}.h8{height:2rem}.max-h148{max-height:37rem}.max-w1\\/2{max-width:50%}.max-w130{max-width:32.5rem}.max-w2\\/3{max-width:66.6666666667%}.max-w45\\/100{max-width:45%}.min-h-30{min-height:7.5rem}.w-full{width:100%}.w10{width:2.5rem}.w38{width:9.5rem}.w4{width:1rem}.w40{width:10rem}.w6{width:1.5rem}.w8{width:2rem}.flex{display:flex}.inline-flex{display:inline-flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.hover\\:scale-105:hover{--un-scale-x:1.05;--un-scale-y:1.05;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.hover\\:cursor-pointer:hover{cursor:pointer}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap1{gap:.25rem}.gap3{gap:.75rem}.gap4{gap:1rem}.overflow-hidden{overflow:hidden}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.bg-\\[\\#696969\\]{--un-bg-opacity:1;background-color:rgb(105 105 105 / var(--un-bg-opacity))}.bg-base-100{--un-bg-opacity:1;background-color:hsl(var(--b1) / var(--un-bg-opacity))}.bg-black\\/70,.group:hover .group-hover\\:bg-black\\/70{background-color:#000000b3}.bg-black\\/80{background-color:#000c}.from-black{--un-gradient-from-position:0%;--un-gradient-from:rgb(0 0 0 / var(--un-from-opacity, 1)) var(--un-gradient-from-position);--un-gradient-to-position:100%;--un-gradient-to:rgb(0 0 0 / 0) var(--un-gradient-to-position);--un-gradient-stops:var(--un-gradient-from), var(--un-gradient-to)}.to-transparent{--un-gradient-to-position:100%;--un-gradient-to:transparent var(--un-gradient-to-position)}.bg-gradient-to-t{--un-gradient-shape:to top;--un-gradient:var(--un-gradient-shape), var(--un-gradient-stops);background-image:linear-gradient(var(--un-gradient))}.object-cover{object-fit:cover}.p1{padding:.25rem}.p2{padding:.5rem}.px2{padding-left:.5rem;padding-right:.5rem}.px4{padding-left:1rem;padding-right:1rem}.py1{padding-top:.25rem;padding-bottom:.25rem}.py2{padding-top:.5rem;padding-bottom:.5rem}.pb2{padding-bottom:.5rem}.pl2{padding-left:.5rem}.pt1{padding-top:.25rem}.text-\\[16px\\]{font-size:16px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.text-primary{--un-text-opacity:1;color:rgb(252 128 161 / var(--un-text-opacity))}.text-primary-content{--un-text-opacity:1;color:hsl(var(--pc) / var(--un-text-opacity))}.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.text-white\\/50{color:#ffffff80}.text-white\\/70{color:#ffffffb3}.text-white\\/90{color:#ffffffe6}.hover\\:text-secondary:hover{--un-text-opacity:1;color:rgb(0 169 248 / var(--un-text-opacity))}.font-bold{font-weight:700}.font-normal{font-weight:400}.font-semibold{font-weight:600}.font-not-italic{font-style:normal}.opacity-0{opacity:0}.group:hover .group-hover\\:opacity-100{opacity:1}.shadow-lg{--un-shadow:var(--un-shadow-inset) 0 10px 15px -3px var(--un-shadow-color, rgb(0 0 0 / .1)),var(--un-shadow-inset) 0 4px 6px -4px var(--un-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.shadow-xl{--un-shadow:var(--un-shadow-inset) 0 20px 25px -5px var(--un-shadow-color, rgb(0 0 0 / .1)),var(--un-shadow-inset) 0 8px 10px -6px var(--un-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.hover\\:shadow-2xl:hover{--un-shadow:var(--un-shadow-inset) 0 25px 50px -12px var(--un-shadow-color, rgb(0 0 0 / .25));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s} `);

(function (vue, axios, dayjs) {
  'use strict';

  const k = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    TOP_CENTER: "top-center",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
    BOTTOM_CENTER: "bottom-center"
  }, M = {
    LIGHT: "light",
    DARK: "dark",
    COLORED: "colored",
    AUTO: "auto"
  }, g = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    DEFAULT: "default"
  }, Ie = {
    BOUNCE: "bounce",
    SLIDE: "slide",
    FLIP: "flip",
    ZOOM: "zoom",
    NONE: "none"
  }, fe = {
    dangerouslyHTMLString: false,
    multiple: true,
    position: k.TOP_RIGHT,
    autoClose: 5e3,
    transition: "bounce",
    hideProgressBar: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnClick: true,
    className: "",
    bodyClassName: "",
    style: {},
    progressClassName: "",
    progressStyle: {},
    role: "alert",
    theme: "light"
  }, pe = {
    rtl: false,
    newestOnTop: false,
    toastClassName: ""
  }, me = {
    ...fe,
    ...pe
  };
  ({
    ...fe,
    type: g.DEFAULT
  });
  var r = /* @__PURE__ */ ((e) => (e[e.COLLAPSE_DURATION = 300] = "COLLAPSE_DURATION", e[e.DEBOUNCE_DURATION = 50] = "DEBOUNCE_DURATION", e.CSS_NAMESPACE = "Toastify", e))(r || {}), J = /* @__PURE__ */ ((e) => (e.ENTRANCE_ANIMATION_END = "d", e))(J || {});
  const he = {
    enter: "Toastify--animate Toastify__bounce-enter",
    exit: "Toastify--animate Toastify__bounce-exit",
    appendPosition: true
  }, Oe = {
    enter: "Toastify--animate Toastify__slide-enter",
    exit: "Toastify--animate Toastify__slide-exit",
    appendPosition: true
  }, be = {
    enter: "Toastify--animate Toastify__zoom-enter",
    exit: "Toastify--animate Toastify__zoom-exit"
  }, Pe = {
    enter: "Toastify--animate Toastify__flip-enter",
    exit: "Toastify--animate Toastify__flip-exit"
  }, re = "Toastify--animate Toastify__none-enter";
  function ge(e, t = false) {
    var a;
    let n = he;
    if (!e || typeof e == "string")
      switch (e) {
        case "flip":
          n = Pe;
          break;
        case "zoom":
          n = be;
          break;
        case "slide":
          n = Oe;
          break;
      }
    else
      n = e;
    if (t)
      n.enter = re;
    else if (n.enter === re) {
      const o = (a = n.exit.split("__")[1]) == null ? void 0 : a.split("-")[0];
      n.enter = "Toastify--animate Toastify__".concat(o, "-enter");
    }
    return n;
  }
  function Le(e) {
    return e.containerId || String(e.position);
  }
  const K = "will-unmount";
  function $e(e = k.TOP_RIGHT) {
    return !!document.querySelector(".".concat(r.CSS_NAMESPACE, "__toast-container--").concat(e));
  }
  function Be(e = k.TOP_RIGHT) {
    return "".concat(r.CSS_NAMESPACE, "__toast-container--").concat(e);
  }
  function qe(e, t, n = false) {
    const a = [
      "".concat(r.CSS_NAMESPACE, "__toast-container"),
      "".concat(r.CSS_NAMESPACE, "__toast-container--").concat(e),
      n ? "".concat(r.CSS_NAMESPACE, "__toast-container--rtl") : null
    ].filter(Boolean).join(" ");
    return q(t) ? t({
      position: e,
      rtl: n,
      defaultClassName: a
    }) : "".concat(a, " ").concat(t || "");
  }
  function Me(e) {
    var E;
    const { position: t, containerClassName: n, rtl: a = false, style: o = {} } = e, s = r.CSS_NAMESPACE, d = Be(t), T = document.querySelector(".".concat(s)), u = document.querySelector(".".concat(d)), N = !!u && !((E = u.className) != null && E.includes(K)), m = T || document.createElement("div"), S = document.createElement("div");
    S.className = qe(
      t,
      n,
      a
    ), S.dataset.testid = "".concat(r.CSS_NAMESPACE, "__toast-container--").concat(t), S.id = Le(e);
    for (const v in o)
      if (Object.prototype.hasOwnProperty.call(o, v)) {
        const I = o[v];
        S.style[v] = I;
      }
    return T || (m.className = r.CSS_NAMESPACE, document.body.appendChild(m)), N || m.appendChild(S), S;
  }
  function ee(e) {
    var a, o, s;
    const t = typeof e == "string" ? e : ((a = e.currentTarget) == null ? void 0 : a.id) || ((o = e.target) == null ? void 0 : o.id), n = document.getElementById(t);
    n && n.removeEventListener("animationend", ee, false);
    try {
      D[t].unmount(), (s = document.getElementById(t)) == null || s.remove(), delete D[t], delete c[t];
    } catch {
    }
  }
  const D = vue.reactive({});
  function we(e, t) {
    const n = document.getElementById(String(t));
    n && (D[n.id] = e);
  }
  function te(e, t = true) {
    const n = String(e);
    if (!D[n])
      return;
    const a = document.getElementById(n);
    a && a.classList.add(K), t ? (Re(e), a && a.addEventListener("animationend", ee, false)) : ee(n), _.items = _.items.filter((o) => o.containerId !== e);
  }
  function Fe(e) {
    for (const t in D)
      te(t, e);
    _.items = [];
  }
  function Ce(e, t) {
    const n = document.getElementById(e.toastId);
    if (n) {
      let a = e;
      a = {
        ...a,
        ...ge(a.transition)
      };
      const o = a.appendPosition ? "".concat(a.exit, "--").concat(a.position) : a.exit;
      n.className += " ".concat(o), t && t(n);
    }
  }
  function Re(e) {
    for (const t in c)
      if (t === e)
        for (const n of c[t] || [])
          Ce(n);
  }
  function Ue(e) {
    const n = w().find((a) => a.toastId === e);
    return n == null ? void 0 : n.containerId;
  }
  function se(e) {
    return document.getElementById(e);
  }
  function xe(e) {
    const t = se(e.containerId);
    return t && t.classList.contains(K);
  }
  function ie(e) {
    var n;
    const t = vue.isVNode(e.content) ? vue.toRaw(e.content.props) : null;
    return t != null ? t : vue.toRaw((n = e.data) != null ? n : {});
  }
  function De(e) {
    return e ? _.items.filter((n) => n.containerId === e).length > 0 : _.items.length > 0;
  }
  function ke() {
    if (_.items.length > 0) {
      const e = _.items.shift();
      j(e == null ? void 0 : e.toastContent, e == null ? void 0 : e.toastProps);
    }
  }
  const c = vue.reactive({}), _ = vue.reactive({
    items: []
  });
  function w() {
    const e = vue.toRaw(c);
    return Object.values(e).reduce((t, n) => [...t, ...n], []);
  }
  function He(e) {
    return w().find((n) => n.toastId === e);
  }
  function j(e, t = {}) {
    if (xe(t)) {
      const n = se(t.containerId);
      n && n.addEventListener("animationend", ne.bind(null, e, t), false);
    } else
      ne(e, t);
  }
  function ne(e, t = {}) {
    const n = se(t.containerId);
    n && n.removeEventListener("animationend", ne.bind(null, e, t), false);
    const a = c[t.containerId] || [], o = a.length > 0;
    if (!o && !$e(t.position)) {
      const s = Me(t), d = vue.createApp(it, t);
      d.mount(s), we(d, s.id);
    }
    o && !t.updateId && (t.position = a[0].position), vue.nextTick(() => {
      t.updateId ? C.update(t) : C.add(e, t);
    });
  }
  const C = {
    /**
     * add a toast
     * @param _ ..
     * @param opts toast props
     */
    add(e, t) {
      const { containerId: n = "" } = t;
      n && (c[n] = c[n] || [], c[n].find((a) => a.toastId === t.toastId) || setTimeout(() => {
        var a, o;
        t.newestOnTop ? (a = c[n]) == null || a.unshift(t) : (o = c[n]) == null || o.push(t), t.onOpen && t.onOpen(ie(t));
      }, t.delay || 0));
    },
    /**
     * remove a toast
     * @param id toastId
     */
    remove(e) {
      if (e) {
        const t = Ue(e);
        if (t) {
          const n = c[t];
          let a = n.find((o) => o.toastId === e);
          c[t] = n.filter((o) => o.toastId !== e), !c[t].length && !De(t) && te(t, false), ke(), vue.nextTick(() => {
            a != null && a.onClose && (a.onClose(ie(a)), a = void 0);
          });
        }
      }
    },
    /**
     * update the toast
     * @param opts toast props
     */
    update(e = {}) {
      const { containerId: t = "" } = e;
      if (t && e.updateId) {
        c[t] = c[t] || [];
        const n = c[t].find((s) => s.toastId === e.toastId), a = (n == null ? void 0 : n.position) !== e.position || (n == null ? void 0 : n.transition) !== e.transition, o = { ...e, disabledEnterTransition: !a, updateId: void 0 };
        C.dismissForce(e == null ? void 0 : e.toastId), setTimeout(() => {
          i(o.content, o);
        }, e.delay || 0);
      }
    },
    /**
     * clear all toasts in container.
     * @param containerId container id
     */
    clear(e, t = true) {
      e ? te(e, t) : Fe(t);
    },
    dismissCallback(e) {
      var a;
      const t = (a = e.currentTarget) == null ? void 0 : a.id, n = document.getElementById(t);
      n && (n.removeEventListener("animationend", C.dismissCallback, false), setTimeout(() => {
        C.remove(t);
      }));
    },
    dismiss(e) {
      if (e) {
        const t = w();
        for (const n of t)
          if (n.toastId === e) {
            Ce(n, (a) => {
              a.addEventListener("animationend", C.dismissCallback, false);
            });
            break;
          }
      }
    },
    dismissForce(e) {
      if (e) {
        const t = w();
        for (const n of t)
          if (n.toastId === e) {
            const a = document.getElementById(e);
            a && (a.remove(), a.removeEventListener("animationend", C.dismissCallback, false), C.remove(e));
            break;
          }
      }
    }
  }, Ee = vue.reactive({}), Q = vue.reactive({});
  function ye() {
    return Math.random().toString(36).substring(2, 9);
  }
  function ze(e) {
    return typeof e == "number" && !isNaN(e);
  }
  function ae(e) {
    return typeof e == "string";
  }
  function q(e) {
    return typeof e == "function";
  }
  function Y(...e) {
    return vue.mergeProps(...e);
  }
  function G(e) {
    return typeof e == "object" && (!!(e != null && e.render) || !!(e != null && e.setup) || typeof (e == null ? void 0 : e.type) == "object");
  }
  function je(e = {}) {
    Ee["".concat(r.CSS_NAMESPACE, "-default-options")] = e;
  }
  function Ge() {
    return Ee["".concat(r.CSS_NAMESPACE, "-default-options")] || me;
  }
  function Ve() {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }
  var V = /* @__PURE__ */ ((e) => (e[e.Enter = 0] = "Enter", e[e.Exit = 1] = "Exit", e))(V || {});
  const Te = {
    containerId: {
      type: [String, Number],
      required: false,
      default: ""
    },
    clearOnUrlChange: {
      type: Boolean,
      required: false,
      default: true
    },
    disabledEnterTransition: {
      type: Boolean,
      required: false,
      default: false
    },
    dangerouslyHTMLString: {
      type: Boolean,
      required: false,
      default: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    limit: {
      type: Number,
      required: false,
      default: void 0
    },
    position: {
      type: String,
      required: false,
      default: k.TOP_LEFT
    },
    bodyClassName: {
      type: String,
      required: false,
      default: ""
    },
    autoClose: {
      type: [Number, Boolean],
      required: false,
      default: false
    },
    closeButton: {
      type: [Boolean, Function, Object],
      required: false,
      default: void 0
    },
    transition: {
      type: [String, Object],
      required: false,
      default: "bounce"
    },
    hideProgressBar: {
      type: Boolean,
      required: false,
      default: false
    },
    pauseOnHover: {
      type: Boolean,
      required: false,
      default: true
    },
    pauseOnFocusLoss: {
      type: Boolean,
      required: false,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      required: false,
      default: true
    },
    progress: {
      type: Number,
      required: false,
      default: void 0
    },
    progressClassName: {
      type: String,
      required: false,
      default: ""
    },
    toastStyle: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    progressStyle: {
      type: Object,
      required: false,
      default() {
        return {};
      }
    },
    role: {
      type: String,
      required: false,
      default: "alert"
    },
    theme: {
      type: String,
      required: false,
      default: M.AUTO
    },
    content: {
      type: [String, Object, Function],
      required: false,
      default: ""
    },
    toastId: {
      type: [String, Number],
      required: false,
      default: ""
    },
    data: {
      type: [Object, String],
      required: false,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      required: false,
      default: g.DEFAULT
    },
    icon: {
      type: [Boolean, String, Number, Object, Function],
      required: false,
      default: void 0
    },
    delay: {
      type: Number,
      required: false,
      default: void 0
    },
    onOpen: {
      type: Function,
      required: false,
      default: void 0
    },
    onClose: {
      type: Function,
      required: false,
      default: void 0
    },
    onClick: {
      type: Function,
      required: false,
      default: void 0
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: void 0
    },
    rtl: {
      type: Boolean,
      required: false,
      default: false
    },
    toastClassName: {
      type: String,
      required: false,
      default: ""
    },
    updateId: {
      type: [String, Number],
      required: false,
      default: ""
    }
  }, Qe = {
    autoClose: {
      type: [Number, Boolean],
      required: true
    },
    isRunning: {
      type: Boolean,
      required: false,
      default: void 0
    },
    type: {
      type: String,
      required: false,
      default: g.DEFAULT
    },
    theme: {
      type: String,
      required: false,
      default: M.AUTO
    },
    hide: {
      type: Boolean,
      required: false,
      default: void 0
    },
    className: {
      type: [String, Function],
      required: false,
      default: ""
    },
    controlledProgress: {
      type: Boolean,
      required: false,
      default: void 0
    },
    rtl: {
      type: Boolean,
      required: false,
      default: void 0
    },
    isIn: {
      type: Boolean,
      required: false,
      default: void 0
    },
    progress: {
      type: Number,
      required: false,
      default: void 0
    },
    closeToast: {
      type: Function,
      required: false,
      default: void 0
    }
  }, We = /* @__PURE__ */ vue.defineComponent({
    name: "ProgressBar",
    props: Qe,
    // @ts-ignore
    setup(e, {
      attrs: t
    }) {
      const n = vue.ref(), a = vue.computed(() => e.hide ? "true" : "false"), o = vue.computed(() => ({
        ...t.style || {},
        animationDuration: "".concat(e.autoClose === true ? 5e3 : e.autoClose, "ms"),
        animationPlayState: e.isRunning ? "running" : "paused",
        opacity: e.hide || e.autoClose === false ? 0 : 1,
        transform: e.controlledProgress ? "scaleX(".concat(e.progress, ")") : "none"
      })), s = vue.computed(() => ["".concat(r.CSS_NAMESPACE, "__progress-bar"), e.controlledProgress ? "".concat(r.CSS_NAMESPACE, "__progress-bar--controlled") : "".concat(r.CSS_NAMESPACE, "__progress-bar--animated"), "".concat(r.CSS_NAMESPACE, "__progress-bar-theme--").concat(e.theme), "".concat(r.CSS_NAMESPACE, "__progress-bar--").concat(e.type), e.rtl ? "".concat(r.CSS_NAMESPACE, "__progress-bar--rtl") : null].filter(Boolean).join(" ")), d = vue.computed(() => "".concat(s.value, " ").concat((t == null ? void 0 : t.class) || "")), T = () => {
        n.value && (n.value.onanimationend = null, n.value.ontransitionend = null);
      }, u = () => {
        e.isIn && e.closeToast && e.autoClose !== false && (e.closeToast(), T());
      }, N = vue.computed(() => e.controlledProgress ? null : u), m = vue.computed(() => e.controlledProgress ? u : null);
      return vue.watchEffect(() => {
        n.value && (T(), n.value.onanimationend = N.value, n.value.ontransitionend = m.value);
      }), () => vue.createVNode("div", {
        ref: n,
        role: "progressbar",
        "aria-hidden": a.value,
        "aria-label": "notification timer",
        class: d.value,
        style: o.value
      }, null);
    }
  }), Ke = /* @__PURE__ */ vue.defineComponent({
    name: "CloseButton",
    inheritAttrs: false,
    props: {
      theme: {
        type: String,
        required: false,
        default: M.AUTO
      },
      type: {
        type: String,
        required: false,
        default: M.LIGHT
      },
      ariaLabel: {
        type: String,
        required: false,
        default: "close"
      },
      closeToast: {
        type: Function,
        required: false,
        default: void 0
      }
    },
    setup(e) {
      return () => vue.createVNode("button", {
        class: "".concat(r.CSS_NAMESPACE, "__close-button ").concat(r.CSS_NAMESPACE, "__close-button--").concat(e.theme),
        type: "button",
        onClick: (t) => {
          t.stopPropagation(), e.closeToast && e.closeToast(t);
        },
        "aria-label": e.ariaLabel
      }, [vue.createVNode("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 14 16"
      }, [vue.createVNode("path", {
        "fill-rule": "evenodd",
        d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
      }, null)])]);
    }
  }), Z = ({
    theme: e,
    type: t,
    path: n,
    ...a
  }) => vue.createVNode("svg", vue.mergeProps({
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%",
    fill: e === "colored" ? "currentColor" : "var(--toastify-icon-color-".concat(t, ")")
  }, a), [vue.createVNode("path", {
    d: n
  }, null)]);
  function Ye(e) {
    return vue.createVNode(Z, vue.mergeProps(e, {
      path: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"
    }), null);
  }
  function Ze(e) {
    return vue.createVNode(Z, vue.mergeProps(e, {
      path: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"
    }), null);
  }
  function Xe(e) {
    return vue.createVNode(Z, vue.mergeProps(e, {
      path: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
    }), null);
  }
  function Je(e) {
    return vue.createVNode(Z, vue.mergeProps(e, {
      path: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
    }), null);
  }
  function et() {
    return vue.createVNode("div", {
      class: "".concat(r.CSS_NAMESPACE, "__spinner")
    }, null);
  }
  const oe = {
    info: Ze,
    warning: Ye,
    success: Xe,
    error: Je,
    spinner: et
  }, tt = (e) => e in oe;
  function nt({
    theme: e,
    type: t,
    isLoading: n,
    icon: a
  }) {
    let o;
    const s = {
      theme: e,
      type: t
    };
    return n ? o = oe.spinner() : a === false ? o = void 0 : G(a) ? o = vue.toRaw(a) : q(a) ? o = a(s) : vue.isVNode(a) ? o = vue.cloneVNode(a, s) : ae(a) || ze(a) ? o = a : tt(t) && (o = oe[t](s)), o;
  }
  const at = () => {
  };
  function ot(e, t, n = r.COLLAPSE_DURATION) {
    const { scrollHeight: a, style: o } = e, s = n;
    requestAnimationFrame(() => {
      o.minHeight = "initial", o.height = a + "px", o.transition = "all ".concat(s, "ms"), requestAnimationFrame(() => {
        o.height = "0", o.padding = "0", o.margin = "0", setTimeout(t, s);
      });
    });
  }
  function st(e) {
    const t = vue.ref(false), n = vue.ref(false), a = vue.ref(false), o = vue.ref(V.Enter), s = vue.reactive({
      ...e,
      appendPosition: e.appendPosition || false,
      collapse: typeof e.collapse > "u" ? true : e.collapse,
      collapseDuration: e.collapseDuration || r.COLLAPSE_DURATION
    }), d = s.done || at, T = vue.computed(() => s.appendPosition ? "".concat(s.enter, "--").concat(s.position) : s.enter), u = vue.computed(() => s.appendPosition ? "".concat(s.exit, "--").concat(s.position) : s.exit), N = vue.computed(() => e.pauseOnHover ? {
      onMouseenter: h2,
      onMouseleave: p
    } : {});
    function m() {
      const y = T.value.split(" ");
      E().addEventListener(
        J.ENTRANCE_ANIMATION_END,
        p,
        { once: true }
      );
      const O = ($) => {
        const U = E();
        $.target === U && (U.dispatchEvent(new Event(J.ENTRANCE_ANIMATION_END)), U.removeEventListener("animationend", O), U.removeEventListener("animationcancel", O), o.value === V.Enter && $.type !== "animationcancel" && U.classList.remove(...y));
      }, b = () => {
        const $ = E();
        $.classList.add(...y), $.addEventListener("animationend", O), $.addEventListener("animationcancel", O);
      };
      e.pauseOnFocusLoss && v(), b();
    }
    function S() {
      if (!E())
        return;
      const y = () => {
        const b = E();
        b.removeEventListener("animationend", y), s.collapse ? ot(b, d, s.collapseDuration) : d();
      }, O = () => {
        const b = E();
        o.value = V.Exit, b && (b.className += " ".concat(u.value), b.addEventListener("animationend", y));
      };
      n.value || (a.value ? y() : setTimeout(O));
    }
    function E() {
      return e.toastRef.value;
    }
    function v() {
      document.hasFocus() || h2(), window.addEventListener("focus", p), window.addEventListener("blur", h2);
    }
    function I() {
      window.removeEventListener("focus", p), window.removeEventListener("blur", h2);
    }
    function p() {
      (!e.loading.value || e.isLoading === void 0) && (t.value = true);
    }
    function h2() {
      t.value = false;
    }
    function R(y) {
      y && (y.stopPropagation(), y.preventDefault()), n.value = false;
    }
    return vue.watchEffect(S), vue.watchEffect(() => {
      const y = w();
      n.value = y.findIndex((O) => O.toastId === s.toastId) > -1;
    }), vue.watchEffect(() => {
      e.isLoading !== void 0 && (e.loading.value ? h2() : p());
    }), vue.onMounted(m), vue.onUnmounted(() => {
      e.pauseOnFocusLoss && I();
    }), {
      isIn: n,
      isRunning: t,
      hideToast: R,
      eventHandlers: N
    };
  }
  const rt = /* @__PURE__ */ vue.defineComponent({
    name: "ToastItem",
    inheritAttrs: false,
    props: Te,
    // @ts-ignore
    setup(e) {
      const t = vue.ref(), n = vue.computed(() => !!e.isLoading), a = vue.computed(() => e.progress !== void 0 && e.progress !== null), o = vue.computed(() => nt(e)), s = vue.computed(() => ["".concat(r.CSS_NAMESPACE, "__toast"), "".concat(r.CSS_NAMESPACE, "__toast-theme--").concat(e.theme), "".concat(r.CSS_NAMESPACE, "__toast--").concat(e.type), e.rtl ? "".concat(r.CSS_NAMESPACE, "__toast--rtl") : void 0, e.toastClassName || ""].filter(Boolean).join(" ")), {
        isRunning: d,
        isIn: T,
        hideToast: u,
        eventHandlers: N
      } = st({
        toastRef: t,
        loading: n,
        done: () => {
          C.remove(e.toastId);
        },
        ...ge(e.transition, e.disabledEnterTransition),
        ...e
      });
      return () => vue.createVNode("div", vue.mergeProps({
        id: e.toastId,
        class: s.value,
        style: e.toastStyle || {},
        ref: t,
        "data-testid": "toast-item-".concat(e.toastId),
        onClick: (m) => {
          e.closeOnClick && u(), e.onClick && e.onClick(m);
        }
      }, N.value), [vue.createVNode("div", {
        role: e.role,
        "data-testid": "toast-body",
        class: "".concat(r.CSS_NAMESPACE, "__toast-body ").concat(e.bodyClassName || "")
      }, [o.value != null && vue.createVNode("div", {
        "data-testid": "toast-icon-".concat(e.type),
        class: ["".concat(r.CSS_NAMESPACE, "__toast-icon"), e.isLoading ? "" : "".concat(r.CSS_NAMESPACE, "--animate-icon ").concat(r.CSS_NAMESPACE, "__zoom-enter")].join(" ")
      }, [G(o.value) ? vue.h(vue.toRaw(o.value), {
        theme: e.theme,
        type: e.type
      }) : q(o.value) ? o.value({
        theme: e.theme,
        type: e.type
      }) : o.value]), vue.createVNode("div", {
        "data-testid": "toast-content"
      }, [G(e.content) ? vue.h(vue.toRaw(e.content), {
        toastProps: vue.toRaw(e),
        closeToast: u,
        data: e.data
      }) : q(e.content) ? e.content({
        toastProps: vue.toRaw(e),
        closeToast: u,
        data: e.data
      }) : e.dangerouslyHTMLString ? vue.h("div", {
        innerHTML: e.content
      }) : e.content])]), (e.closeButton === void 0 || e.closeButton === true) && vue.createVNode(Ke, {
        theme: e.theme,
        closeToast: (m) => {
          m.stopPropagation(), m.preventDefault(), u();
        }
      }, null), G(e.closeButton) ? vue.h(vue.toRaw(e.closeButton), {
        closeToast: u,
        type: e.type,
        theme: e.theme
      }) : q(e.closeButton) ? e.closeButton({
        closeToast: u,
        type: e.type,
        theme: e.theme
      }) : null, vue.createVNode(We, {
        className: e.progressClassName,
        style: e.progressStyle,
        rtl: e.rtl,
        theme: e.theme,
        isIn: T.value,
        type: e.type,
        hide: e.hideProgressBar,
        isRunning: d.value,
        autoClose: e.autoClose,
        controlledProgress: a.value,
        progress: e.progress,
        closeToast: e.isLoading ? void 0 : u
      }, null)]);
    }
  });
  let x = 0;
  function Se() {
    typeof window > "u" || (x && window.cancelAnimationFrame(x), x = window.requestAnimationFrame(Se), Q.lastUrl !== window.location.href && (Q.lastUrl = window.location.href, C.clear()));
  }
  const it = /* @__PURE__ */ vue.defineComponent({
    name: "ToastifyContainer",
    inheritAttrs: false,
    props: Te,
    // @ts-ignore
    setup(e) {
      const t = vue.computed(() => e.containerId), n = vue.computed(() => c[t.value] || []), a = vue.computed(() => n.value.filter((o) => o.position === e.position));
      return vue.onMounted(() => {
        typeof window < "u" && e.clearOnUrlChange && window.requestAnimationFrame(Se);
      }), vue.onUnmounted(() => {
        typeof window < "u" && x && (window.cancelAnimationFrame(x), Q.lastUrl = "");
      }), () => vue.createVNode(vue.Fragment, null, [a.value.map((o) => {
        const {
          toastId: s = ""
        } = o;
        return vue.createVNode(rt, vue.mergeProps({
          key: s
        }, o), null);
      })]);
    }
  });
  let X = false;
  function ve() {
    const e = [];
    return w().forEach((n) => {
      const a = document.getElementById(n.containerId);
      a && !a.classList.contains(K) && e.push(n);
    }), e;
  }
  function lt(e) {
    const t = ve().length, n = e != null ? e : 0;
    return n > 0 && t + _.items.length >= n;
  }
  function dt(e) {
    lt(e.limit) && !e.updateId && _.items.push({
      toastId: e.toastId,
      containerId: e.containerId,
      toastContent: e.content,
      toastProps: e
    });
  }
  function L(e, t, n = {}) {
    if (X)
      return;
    n = Y(Ge(), {
      type: t
    }, vue.toRaw(n)), (!n.toastId || typeof n.toastId != "string" && typeof n.toastId != "number") && (n.toastId = ye()), n = {
      ...n,
      content: e,
      containerId: n.containerId || String(n.position)
    };
    const a = Number(n == null ? void 0 : n.progress);
    return a < 0 && (n.progress = 0), a > 1 && (n.progress = 1), n.theme === "auto" && (n.theme = Ve()), dt(n), Q.lastUrl = window.location.href, n.multiple ? _.items.length ? n.updateId && j(e, n) : j(e, n) : (X = true, i.clearAll(void 0, false), setTimeout(() => {
      j(e, n);
    }, 0), setTimeout(() => {
      X = false;
    }, 390)), n.toastId;
  }
  const i = (e, t) => L(e, g.DEFAULT, t);
  i.info = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.INFO
  });
  i.error = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.ERROR
  });
  i.warning = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.WARNING
  });
  i.warn = i.warning;
  i.success = (e, t) => L(e, g.DEFAULT, {
    ...t,
    type: g.SUCCESS
  });
  i.loading = (e, t) => L(e, g.DEFAULT, Y(t, {
    isLoading: true,
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
    draggable: false
  }));
  i.dark = (e, t) => L(e, g.DEFAULT, Y(t, {
    theme: M.DARK
  }));
  i.remove = (e) => {
    e ? C.dismiss(e) : C.clear();
  };
  i.clearAll = (e, t) => {
    C.clear(e, t);
  };
  i.isActive = (e) => {
    let t = false;
    return t = ve().findIndex((a) => a.toastId === e) > -1, t;
  };
  i.update = (e, t = {}) => {
    setTimeout(() => {
      const n = He(e);
      if (n) {
        const a = vue.toRaw(n), {
          content: o
        } = a, s = {
          ...a,
          ...t,
          toastId: t.toastId || e,
          updateId: ye()
        }, d = s.render || o;
        delete s.render, L(d, s.type, s);
      }
    }, 0);
  };
  i.done = (e) => {
    i.update(e, {
      isLoading: false,
      progress: 1
    });
  };
  i.promise = ut;
  function ut(e, {
    pending: t,
    error: n,
    success: a
  }, o) {
    var m, S, E;
    let s;
    const d = {
      ...o || {},
      autoClose: false
    };
    t && (s = ae(t) ? i.loading(t, d) : i.loading(t.render, {
      ...d,
      ...t
    }));
    const T = {
      autoClose: (m = o == null ? void 0 : o.autoClose) != null ? m : true,
      closeOnClick: (S = o == null ? void 0 : o.closeOnClick) != null ? S : true,
      closeButton: (E = o == null ? void 0 : o.autoClose) != null ? E : null,
      isLoading: void 0,
      draggable: null,
      delay: 100
    }, u = (v, I, p) => {
      if (I == null) {
        i.remove(s);
        return;
      }
      const h2 = {
        type: v,
        ...T,
        ...o,
        data: p
      }, R = ae(I) ? {
        render: I
      } : I;
      return s ? i.update(s, {
        ...h2,
        ...R,
        isLoading: false
      }) : i(R.render, {
        ...h2,
        ...R,
        isLoading: false
      }), p;
    }, N = q(e) ? e() : e;
    return N.then((v) => {
      u("success", a, v);
    }).catch((v) => {
      u("error", n, v);
    }), N;
  }
  i.POSITION = k;
  i.THEME = M;
  i.TYPE = g;
  i.TRANSITIONS = Ie;
  const ct = {
    install(e, t = {}) {
      ft(t);
    }
  };
  typeof window < "u" && (window.Vue3Toastify = ct);
  function ft(e = {}) {
    const t = Y(me, e);
    je(t);
  }
  const parents = /* @__PURE__ */ new Set();
  const coords = /* @__PURE__ */ new WeakMap();
  const siblings = /* @__PURE__ */ new WeakMap();
  const animations = /* @__PURE__ */ new WeakMap();
  const intersections = /* @__PURE__ */ new WeakMap();
  const intervals = /* @__PURE__ */ new WeakMap();
  const options = /* @__PURE__ */ new WeakMap();
  const debounces = /* @__PURE__ */ new WeakMap();
  const enabled = /* @__PURE__ */ new WeakSet();
  let root;
  let scrollX = 0;
  let scrollY = 0;
  const TGT = "__aa_tgt";
  const DEL = "__aa_del";
  const NEW = "__aa_new";
  const handleMutations = (mutations2) => {
    const elements = getElements(mutations2);
    if (elements) {
      elements.forEach((el) => animate(el));
    }
  };
  const handleResizes = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === root)
        updateAllPos();
      if (coords.has(entry.target))
        updatePos(entry.target);
    });
  };
  function observePosition(el) {
    const oldObserver = intersections.get(el);
    oldObserver === null || oldObserver === void 0 ? void 0 : oldObserver.disconnect();
    let rect = coords.get(el);
    let invocations = 0;
    const buffer = 5;
    if (!rect) {
      rect = getCoords(el);
      coords.set(el, rect);
    }
    const { offsetWidth, offsetHeight } = root;
    const rootMargins = [
      rect.top - buffer,
      offsetWidth - (rect.left + buffer + rect.width),
      offsetHeight - (rect.top + buffer + rect.height),
      rect.left - buffer
    ];
    const rootMargin = rootMargins.map((px) => `${-1 * Math.floor(px)}px`).join(" ");
    const observer = new IntersectionObserver(() => {
      ++invocations > 1 && updatePos(el);
    }, {
      root,
      threshold: 1,
      rootMargin
    });
    observer.observe(el);
    intersections.set(el, observer);
  }
  function updatePos(el) {
    clearTimeout(debounces.get(el));
    const optionsOrPlugin = getOptions(el);
    const delay = isPlugin(optionsOrPlugin) ? 500 : optionsOrPlugin.duration;
    debounces.set(el, setTimeout(async () => {
      const currentAnimation = animations.get(el);
      try {
        await (currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.finished);
        coords.set(el, getCoords(el));
        observePosition(el);
      } catch {
      }
    }, delay));
  }
  function updateAllPos() {
    clearTimeout(debounces.get(root));
    debounces.set(root, setTimeout(() => {
      parents.forEach((parent) => forEach(parent, (el) => lowPriority(() => updatePos(el))));
    }, 100));
  }
  function poll(el) {
    setTimeout(() => {
      intervals.set(el, setInterval(() => lowPriority(updatePos.bind(null, el)), 2e3));
    }, Math.round(2e3 * Math.random()));
  }
  function lowPriority(callback) {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => callback());
    } else {
      requestAnimationFrame(() => callback());
    }
  }
  let mutations;
  let resize;
  if (typeof window !== "undefined") {
    root = document.documentElement;
    mutations = new MutationObserver(handleMutations);
    resize = new ResizeObserver(handleResizes);
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
      scrollX = window.scrollX;
    });
    resize.observe(root);
  }
  function getElements(mutations2) {
    const observedNodes = mutations2.reduce((nodes, mutation) => {
      return [
        ...nodes,
        ...Array.from(mutation.addedNodes),
        ...Array.from(mutation.removedNodes)
      ];
    }, []);
    const onlyCommentNodesObserved = observedNodes.every((node) => node.nodeName === "#comment");
    if (onlyCommentNodesObserved)
      return false;
    return mutations2.reduce((elements, mutation) => {
      if (elements === false)
        return false;
      if (mutation.target instanceof Element) {
        target(mutation.target);
        if (!elements.has(mutation.target)) {
          elements.add(mutation.target);
          for (let i2 = 0; i2 < mutation.target.children.length; i2++) {
            const child = mutation.target.children.item(i2);
            if (!child)
              continue;
            if (DEL in child) {
              return false;
            }
            target(mutation.target, child);
            elements.add(child);
          }
        }
        if (mutation.removedNodes.length) {
          for (let i2 = 0; i2 < mutation.removedNodes.length; i2++) {
            const child = mutation.removedNodes[i2];
            if (DEL in child) {
              return false;
            }
            if (child instanceof Element) {
              elements.add(child);
              target(mutation.target, child);
              siblings.set(child, [
                mutation.previousSibling,
                mutation.nextSibling
              ]);
            }
          }
        }
      }
      return elements;
    }, /* @__PURE__ */ new Set());
  }
  function target(el, child) {
    if (!child && !(TGT in el))
      Object.defineProperty(el, TGT, { value: el });
    else if (child && !(TGT in child))
      Object.defineProperty(child, TGT, { value: el });
  }
  function animate(el) {
    var _a;
    const isMounted = el.isConnected;
    const preExisting = coords.has(el);
    if (isMounted && siblings.has(el))
      siblings.delete(el);
    if (animations.has(el)) {
      (_a = animations.get(el)) === null || _a === void 0 ? void 0 : _a.cancel();
    }
    if (NEW in el) {
      add(el);
    } else if (preExisting && isMounted) {
      remain(el);
    } else if (preExisting && !isMounted) {
      remove(el);
    } else {
      add(el);
    }
  }
  function raw(str) {
    return Number(str.replace(/[^0-9.\-]/g, ""));
  }
  function getScrollOffset(el) {
    let p = el.parentElement;
    while (p) {
      if (p.scrollLeft || p.scrollTop) {
        return { x: p.scrollLeft, y: p.scrollTop };
      }
      p = p.parentElement;
    }
    return { x: 0, y: 0 };
  }
  function getCoords(el) {
    const rect = el.getBoundingClientRect();
    const { x: x2, y } = getScrollOffset(el);
    return {
      top: rect.top + y,
      left: rect.left + x2,
      width: rect.width,
      height: rect.height
    };
  }
  function getTransitionSizes(el, oldCoords, newCoords) {
    let widthFrom = oldCoords.width;
    let heightFrom = oldCoords.height;
    let widthTo = newCoords.width;
    let heightTo = newCoords.height;
    const styles = getComputedStyle(el);
    const sizing = styles.getPropertyValue("box-sizing");
    if (sizing === "content-box") {
      const paddingY = raw(styles.paddingTop) + raw(styles.paddingBottom) + raw(styles.borderTopWidth) + raw(styles.borderBottomWidth);
      const paddingX = raw(styles.paddingLeft) + raw(styles.paddingRight) + raw(styles.borderRightWidth) + raw(styles.borderLeftWidth);
      widthFrom -= paddingX;
      widthTo -= paddingX;
      heightFrom -= paddingY;
      heightTo -= paddingY;
    }
    return [widthFrom, widthTo, heightFrom, heightTo].map(Math.round);
  }
  function getOptions(el) {
    return TGT in el && options.has(el[TGT]) ? options.get(el[TGT]) : { duration: 250, easing: "ease-in-out" };
  }
  function getTarget(el) {
    if (TGT in el)
      return el[TGT];
    return void 0;
  }
  function isEnabled(el) {
    const target2 = getTarget(el);
    return target2 ? enabled.has(target2) : false;
  }
  function forEach(parent, ...callbacks) {
    callbacks.forEach((callback) => callback(parent, options.has(parent)));
    for (let i2 = 0; i2 < parent.children.length; i2++) {
      const child = parent.children.item(i2);
      if (child) {
        callbacks.forEach((callback) => callback(child, options.has(child)));
      }
    }
  }
  function getPluginTuple(pluginReturn) {
    if (Array.isArray(pluginReturn))
      return pluginReturn;
    return [pluginReturn];
  }
  function isPlugin(config) {
    return typeof config === "function";
  }
  function remain(el) {
    const oldCoords = coords.get(el);
    const newCoords = getCoords(el);
    if (!isEnabled(el))
      return coords.set(el, newCoords);
    let animation;
    if (!oldCoords)
      return;
    const pluginOrOptions = getOptions(el);
    if (typeof pluginOrOptions !== "function") {
      const deltaX = oldCoords.left - newCoords.left;
      const deltaY = oldCoords.top - newCoords.top;
      const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords, newCoords);
      const start = {
        transform: `translate(${deltaX}px, ${deltaY}px)`
      };
      const end = {
        transform: `translate(0, 0)`
      };
      if (widthFrom !== widthTo) {
        start.width = `${widthFrom}px`;
        end.width = `${widthTo}px`;
      }
      if (heightFrom !== heightTo) {
        start.height = `${heightFrom}px`;
        end.height = `${heightTo}px`;
      }
      animation = el.animate([start, end], {
        duration: pluginOrOptions.duration,
        easing: pluginOrOptions.easing
      });
    } else {
      const [keyframes] = getPluginTuple(pluginOrOptions(el, "remain", oldCoords, newCoords));
      animation = new Animation(keyframes);
      animation.play();
    }
    animations.set(el, animation);
    coords.set(el, newCoords);
    animation.addEventListener("finish", updatePos.bind(null, el));
  }
  function add(el) {
    if (NEW in el)
      delete el[NEW];
    const newCoords = getCoords(el);
    coords.set(el, newCoords);
    const pluginOrOptions = getOptions(el);
    if (!isEnabled(el))
      return;
    let animation;
    if (typeof pluginOrOptions !== "function") {
      animation = el.animate([
        { transform: "scale(.98)", opacity: 0 },
        { transform: "scale(0.98)", opacity: 0, offset: 0.5 },
        { transform: "scale(1)", opacity: 1 }
      ], {
        duration: pluginOrOptions.duration * 1.5,
        easing: "ease-in"
      });
    } else {
      const [keyframes] = getPluginTuple(pluginOrOptions(el, "add", newCoords));
      animation = new Animation(keyframes);
      animation.play();
    }
    animations.set(el, animation);
    animation.addEventListener("finish", updatePos.bind(null, el));
  }
  function cleanUp(el, styles) {
    var _a;
    el.remove();
    coords.delete(el);
    siblings.delete(el);
    animations.delete(el);
    (_a = intersections.get(el)) === null || _a === void 0 ? void 0 : _a.disconnect();
    setTimeout(() => {
      if (DEL in el)
        delete el[DEL];
      Object.defineProperty(el, NEW, { value: true, configurable: true });
      if (styles && el instanceof HTMLElement) {
        for (const style in styles) {
          el.style[style] = "";
        }
      }
    }, 0);
  }
  function remove(el) {
    var _a;
    if (!siblings.has(el) || !coords.has(el))
      return;
    const [prev, next] = siblings.get(el);
    Object.defineProperty(el, DEL, { value: true, configurable: true });
    const finalX = window.scrollX;
    const finalY = window.scrollY;
    if (next && next.parentNode && next.parentNode instanceof Element) {
      next.parentNode.insertBefore(el, next);
    } else if (prev && prev.parentNode) {
      prev.parentNode.appendChild(el);
    } else {
      (_a = getTarget(el)) === null || _a === void 0 ? void 0 : _a.appendChild(el);
    }
    if (!isEnabled(el))
      return cleanUp(el);
    const [top, left, width, height] = deletePosition(el);
    const optionsOrPlugin = getOptions(el);
    const oldCoords = coords.get(el);
    if (finalX !== scrollX || finalY !== scrollY) {
      adjustScroll(el, finalX, finalY, optionsOrPlugin);
    }
    let animation;
    let styleReset = {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      margin: "0",
      pointerEvents: "none",
      transformOrigin: "center",
      zIndex: "100"
    };
    if (!isPlugin(optionsOrPlugin)) {
      Object.assign(el.style, styleReset);
      animation = el.animate([
        {
          transform: "scale(1)",
          opacity: 1
        },
        {
          transform: "scale(.98)",
          opacity: 0
        }
      ], { duration: optionsOrPlugin.duration, easing: "ease-out" });
    } else {
      const [keyframes, options2] = getPluginTuple(optionsOrPlugin(el, "remove", oldCoords));
      if ((options2 === null || options2 === void 0 ? void 0 : options2.styleReset) !== false) {
        styleReset = (options2 === null || options2 === void 0 ? void 0 : options2.styleReset) || styleReset;
        Object.assign(el.style, styleReset);
      }
      animation = new Animation(keyframes);
      animation.play();
    }
    animations.set(el, animation);
    animation.addEventListener("finish", cleanUp.bind(null, el, styleReset));
  }
  function adjustScroll(el, finalX, finalY, optionsOrPlugin) {
    const scrollDeltaX = scrollX - finalX;
    const scrollDeltaY = scrollY - finalY;
    const scrollBefore = document.documentElement.style.scrollBehavior;
    const scrollBehavior = getComputedStyle(root).scrollBehavior;
    if (scrollBehavior === "smooth") {
      document.documentElement.style.scrollBehavior = "auto";
    }
    window.scrollTo(window.scrollX + scrollDeltaX, window.scrollY + scrollDeltaY);
    if (!el.parentElement)
      return;
    const parent = el.parentElement;
    let lastHeight = parent.clientHeight;
    let lastWidth = parent.clientWidth;
    const startScroll = performance.now();
    function smoothScroll() {
      requestAnimationFrame(() => {
        if (!isPlugin(optionsOrPlugin)) {
          const deltaY = lastHeight - parent.clientHeight;
          const deltaX = lastWidth - parent.clientWidth;
          if (startScroll + optionsOrPlugin.duration > performance.now()) {
            window.scrollTo({
              left: window.scrollX - deltaX,
              top: window.scrollY - deltaY
            });
            lastHeight = parent.clientHeight;
            lastWidth = parent.clientWidth;
            smoothScroll();
          } else {
            document.documentElement.style.scrollBehavior = scrollBefore;
          }
        }
      });
    }
    smoothScroll();
  }
  function deletePosition(el) {
    const oldCoords = coords.get(el);
    const [width, , height] = getTransitionSizes(el, oldCoords, getCoords(el));
    let offsetParent = el.parentElement;
    while (offsetParent && (getComputedStyle(offsetParent).position === "static" || offsetParent instanceof HTMLBodyElement)) {
      offsetParent = offsetParent.parentElement;
    }
    if (!offsetParent)
      offsetParent = document.body;
    const parentStyles = getComputedStyle(offsetParent);
    const parentCoords = coords.get(offsetParent) || getCoords(offsetParent);
    const top = Math.round(oldCoords.top - parentCoords.top) - raw(parentStyles.borderTopWidth);
    const left = Math.round(oldCoords.left - parentCoords.left) - raw(parentStyles.borderLeftWidth);
    return [top, left, width, height];
  }
  function autoAnimate(el, config = {}) {
    if (mutations && resize) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const isDisabledDueToReduceMotion = mediaQuery.matches && !isPlugin(config) && !config.disrespectUserMotionPreference;
      if (!isDisabledDueToReduceMotion) {
        enabled.add(el);
        if (getComputedStyle(el).position === "static") {
          Object.assign(el.style, { position: "relative" });
        }
        forEach(el, updatePos, poll, (element) => resize === null || resize === void 0 ? void 0 : resize.observe(element));
        if (isPlugin(config)) {
          options.set(el, config);
        } else {
          options.set(el, { duration: 250, easing: "ease-in-out", ...config });
        }
        mutations.observe(el, { childList: true });
        parents.add(el);
      }
    }
    return Object.freeze({
      parent: el,
      enable: () => {
        enabled.add(el);
      },
      disable: () => {
        enabled.delete(el);
      },
      isEnabled: () => enabled.has(el)
    });
  }
  function useAutoAnimate(options2) {
    const element = vue.ref();
    let controller;
    function setEnabled(enabled2) {
      if (controller) {
        enabled2 ? controller.enable() : controller.disable();
      }
    }
    vue.onMounted(() => {
      vue.watchEffect(() => {
        if (element.value instanceof HTMLElement)
          controller = autoAnimate(element.value, options2 || {});
      });
    });
    return [element, setEnabled];
  }
  const _export_sfc = (sfc, props) => {
    const target2 = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target2[key] = val;
    }
    return target2;
  };
  const _sfc_main$7 = {};
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-0e2c1d51"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$7 = { class: "pb2 px2 center" };
  const _hoisted_2$6 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "loader" }, null, -1));
  const _hoisted_3$6 = [
    _hoisted_2$6
  ];
  function _sfc_render$3(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, _hoisted_3$6);
  }
  const Loading = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$3], ["__scopeId", "data-v-0e2c1d51"]]);
  const _sfc_main$6 = {};
  const _hoisted_1$6 = {
    viewBox: "0 0 36 36",
    xmlns: "http://www.w3.org/2000/svg",
    class: "video-like-icon video-toolbar-item-icon"
  };
  const _hoisted_2$5 = /* @__PURE__ */ vue.createElementVNode("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853 17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402 33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 25.7957C30.2558 28.7683 27.5894 30.8573 24.528 30.8573H11.9911H11.9902Z",
    fill: "currentColor"
  }, null, -1);
  const _hoisted_3$5 = [
    _hoisted_2$5
  ];
  function _sfc_render$2(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$6, _hoisted_3$5);
  }
  const LikeIcon = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$2]]);
  const _sfc_main$5 = {};
  const _hoisted_1$5 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 18 18",
    width: "18",
    height: "18"
  };
  const _hoisted_2$4 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M4.612500000000001 6.186037499999999C4.92315 6.186037499999999 5.175000000000001 6.437872500000001 5.175000000000001 6.748537499999999L5.175000000000001 9.580575C5.175000000000001 10.191075000000001 5.66991 10.686 6.280425000000001 10.686C6.8909325 10.686 7.38585 10.191075000000001 7.38585 9.580575L7.38585 6.748537499999999C7.38585 6.437872500000001 7.637700000000001 6.186037499999999 7.94835 6.186037499999999C8.259 6.186037499999999 8.51085 6.437872500000001 8.51085 6.748537499999999L8.51085 9.580575C8.51085 10.8124125 7.512262499999999 11.811 6.280425000000001 11.811C5.048595000000001 11.811 4.050000000000001 10.8124125 4.050000000000001 9.580575L4.050000000000001 6.748537499999999C4.050000000000001 6.437872500000001 4.3018350000000005 6.186037499999999 4.612500000000001 6.186037499999999z",
    fill: "currentColor"
  }, null, -1);
  const _hoisted_3$4 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M9.48915 6.748537499999999C9.48915 6.437872500000001 9.7409625 6.186037499999999 10.05165 6.186037499999999L11.79375 6.186037499999999C12.984637500000002 6.186037499999999 13.950000000000001 7.151415 13.950000000000001 8.34225C13.950000000000001 9.5331375 12.984637500000002 10.4985 11.79375 10.4985L10.61415 10.4985L10.61415 11.2485C10.61415 11.55915 10.3623 11.811 10.05165 11.811C9.7409625 11.811 9.48915 11.55915 9.48915 11.2485L9.48915 6.748537499999999zM10.61415 9.3735L11.79375 9.3735C12.3633 9.3735 12.825000000000001 8.9118 12.825000000000001 8.34225C12.825000000000001 7.7727375 12.3633 7.31103 11.79375 7.31103L10.61415 7.31103L10.61415 9.3735z",
    fill: "currentColor"
  }, null, -1);
  const _hoisted_4$4 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M9 3.7485375000000003C7.111335 3.7485375000000003 5.46225 3.84462 4.2981675 3.939015C3.4891575 4.0046175 2.8620825 4.6226400000000005 2.79 5.424405C2.7045525 6.37485 2.625 7.6282499999999995 2.625 8.9985C2.625 10.368825000000001 2.7045525 11.622225 2.79 12.5726625C2.8620825 13.374412500000002 3.4891575 13.992450000000002 4.2981675 14.058074999999999C5.46225 14.152425000000001 7.111335 14.2485 9 14.2485C10.888874999999999 14.2485 12.538050000000002 14.152425000000001 13.702200000000001 14.058037500000001C14.511074999999998 13.9924125 15.138000000000002 13.3746 15.210075 12.573037500000002C15.295499999999999 11.622975 15.375 10.3698375 15.375 8.9985C15.375 7.627237500000001 15.295499999999999 6.3740775 15.210075 5.4240375C15.138000000000002 4.622475 14.511074999999998 4.00464 13.702200000000001 3.9390374999999995C12.538050000000002 3.844635 10.888874999999999 3.7485375000000003 9 3.7485375000000003zM4.2072375 2.8176975C5.39424 2.7214425 7.074434999999999 2.6235375000000003 9 2.6235375000000003C10.925775 2.6235375000000003 12.606075 2.7214575 13.793099999999999 2.81772C15.141074999999999 2.92704 16.208849999999998 3.9695849999999995 16.330575 5.323297500000001C16.418174999999998 6.297675 16.5 7.585537500000001 16.5 8.9985C16.5 10.4115375 16.418174999999998 11.6994 16.330575 12.6738C16.208849999999998 14.027474999999999 15.141074999999999 15.0700125 13.793099999999999 15.1793625C12.606075 15.275625 10.925775 15.3735 9 15.3735C7.074434999999999 15.3735 5.39424 15.275625 4.2072375 15.179400000000001C2.859045 15.070049999999998 1.7912325 14.027212500000001 1.6695225000000002 12.673425C1.5818849999999998 11.69865 1.5 10.4106 1.5 8.9985C1.5 7.586475 1.5818849999999998 6.2984025 1.6695225000000002 5.3236725C1.7912325 3.96984 2.859045 2.9270175000000003 4.2072375 2.8176975z",
    fill: "currentColor"
  }, null, -1);
  const _hoisted_5$3 = [
    _hoisted_2$4,
    _hoisted_3$4,
    _hoisted_4$4
  ];
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$5, _hoisted_5$3);
  }
  const UPIcon = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$1]]);
  const _sfc_main$4 = {};
  const _hoisted_1$4 = {
    class: "view-icon",
    "data-v-5e7c7cb4": "",
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    viewBox: "0 0 20 20",
    width: "20",
    height: "20"
  };
  const _hoisted_2$3 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M10 4.040041666666666C7.897383333333334 4.040041666666666 6.061606666666667 4.147 4.765636666666667 4.252088333333334C3.806826666666667 4.32984 3.061106666666667 5.0637316666666665 2.9755000000000003 6.015921666666667C2.8803183333333333 7.074671666666667 2.791666666666667 8.471183333333332 2.791666666666667 9.998333333333333C2.791666666666667 11.525566666666668 2.8803183333333333 12.922083333333333 2.9755000000000003 13.9808C3.061106666666667 14.932983333333334 3.806826666666667 15.666916666666667 4.765636666666667 15.744683333333336C6.061611666666668 15.849716666666666 7.897383333333334 15.956666666666667 10 15.956666666666667C12.10285 15.956666666666667 13.93871666666667 15.849716666666666 15.234766666666667 15.74461666666667C16.193416666666668 15.66685 16.939000000000004 14.933216666666667 17.024583333333336 13.981216666666668C17.11975 12.922916666666667 17.208333333333332 11.526666666666666 17.208333333333332 9.998333333333333C17.208333333333332 8.470083333333333 17.11975 7.073818333333334 17.024583333333336 6.015513333333334C16.939000000000004 5.063538333333333 16.193416666666668 4.329865000000001 15.234766666666667 4.252118333333334C13.93871666666667 4.147016666666667 12.10285 4.040041666666666 10 4.040041666666666zM4.684808333333334 3.255365C6.001155 3.14862 7.864583333333334 3.0400416666666668 10 3.0400416666666668C12.13565 3.0400416666666668 13.999199999999998 3.148636666666667 15.315566666666667 3.2553900000000002C16.753416666666666 3.3720016666666672 17.890833333333333 4.483195 18.020583333333335 5.925965000000001C18.11766666666667 7.005906666666667 18.208333333333336 8.433 18.208333333333336 9.998333333333333C18.208333333333336 11.56375 18.11766666666667 12.990833333333335 18.020583333333335 14.0708C17.890833333333333 15.513533333333331 16.753416666666666 16.624733333333335 15.315566666666667 16.74138333333333C13.999199999999998 16.848116666666666 12.13565 16.95666666666667 10 16.95666666666667C7.864583333333334 16.95666666666667 6.001155 16.848116666666666 4.684808333333334 16.7414C3.2467266666666665 16.624750000000002 2.1092383333333338 15.513266666666667 1.9795200000000002 14.070383333333334C1.8823900000000002 12.990000000000002 1.7916666666666667 11.562683333333334 1.7916666666666667 9.998333333333333C1.7916666666666667 8.434066666666666 1.8823900000000002 7.00672 1.9795200000000002 5.926381666666667C2.1092383333333338 4.483463333333334 3.2467266666666665 3.371976666666667 4.684808333333334 3.255365z",
    fill: "currentColor"
  }, null, -1);
  const _hoisted_3$3 = /* @__PURE__ */ vue.createElementVNode("path", {
    d: "M12.23275 9.1962C12.851516666666667 9.553483333333332 12.851516666666667 10.44665 12.232683333333332 10.803866666666666L9.57975 12.335600000000001C8.960983333333335 12.692816666666667 8.1875 12.246250000000002 8.187503333333334 11.531733333333333L8.187503333333334 8.4684C8.187503333333334 7.753871666666667 8.960983333333335 7.307296666666667 9.57975 7.66456L12.23275 9.1962z",
    fill: "currentColor"
  }, null, -1);
  const _hoisted_4$3 = [
    _hoisted_2$3,
    _hoisted_3$3
  ];
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$4, _hoisted_4$3);
  }
  const WatchIcon = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render]]);
  const request = axios.create({
    withCredentials: true
  });
  request.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response.data.code === -412) {
      i.error("请在登录后使用匹配功能");
      return Promise.reject(error.response.data.message);
    }
    return Promise.reject(error);
  });
  const MUSIC_URL_PREFIX = "https://music.ayangweb.cn";
  async function searchPlaylistApi(id) {
    return request.get(`${MUSIC_URL_PREFIX}/playlist/track/all`, {
      params: { id }
    });
  }
  async function searchApi(keyword) {
    return request.get("https://api.bilibili.com/x/web-interface/wbi/search/all/v2", {
      params: {
        keyword,
        search_type: "video",
        platform: "pc",
        highlight: 1,
        page_size: 42
      }
    });
  }
  function formatMs(ms) {
    const seconds = Math.floor(ms / 1e3);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${seconds % 60 < 10 ? "0" : ""}${seconds % 60}`;
  }
  function formatTime(time) {
    const [minutes, seconds] = time.split(":");
    return `${minutes}:${seconds.padStart(2, "0")}`;
  }
  function formatNumber(num) {
    if (num < 1e4)
      return num;
    return `${(num / 1e4).toFixed(1)}万`;
  }
  function formatDateTime(time) {
    if (!time)
      return "-";
    return dayjs(+time * 1e3).format("YYYY-MM-DD");
  }
  function getVideoUrl(bvid) {
    return `https://www.bilibili.com/video/${bvid}`;
  }
  function getUpUrl(mid) {
    return `https://space.bilibili.com/${mid}`;
  }
  function downloadJson(data) {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
  }
  const _hoisted_1$3 = { class: "flex items-center bg-[#696969] min-h-30 shadow-lg w-full hover:scale-105 transition p2 rounded-lg text-white font-semibold group" };
  const _hoisted_2$2 = { class: "overflow-hidden w40 h30 rounded-lg relative" };
  const _hoisted_3$2 = ["src", "alt"];
  const _hoisted_4$2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "absolute bottom-0 left-0 right-0 h10 bg-gradient-to-t from-black to-transparent group-hover:inset-0 group-hover:bg-black/70 group-hover:h-full" }, null, -1);
  const _hoisted_5$2 = { class: "absolute bottom-1 right-1" };
  const _hoisted_6$2 = { class: "center absolute bottom-1 left-1 gap1" };
  const _hoisted_7$2 = { class: "center absolute inset-0 z-2 opacity-0 group-hover:opacity-100 gap1" };
  const _hoisted_8$1 = { class: "text-xl" };
  const _hoisted_9$1 = { class: "flex-1 text-sm flex flex-col ml2 h-full" };
  const _hoisted_10$1 = ["href", "innerHTML"];
  const _hoisted_11$1 = { class: "center justify-between mt-auto" };
  const _hoisted_12 = { class: "flex flex-col items-start justify-between text-white/70 text-sm" };
  const _hoisted_13 = ["href"];
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "MatchItem",
    props: {
      item: {}
    },
    emits: ["bind"],
    setup(__props) {
      return (_ctx, _cache) => {
        var _a, _b, _c;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createElementVNode("img", {
              src: _ctx.item.cover,
              alt: _ctx.item.bvid,
              loading: "lazy",
              class: "w-full h-full object-cover"
            }, null, 8, _hoisted_3$2),
            _hoisted_4$2,
            vue.createElementVNode("span", _hoisted_5$2, vue.toDisplayString(vue.unref(formatTime)(_ctx.item.duration)), 1),
            vue.createElementVNode("div", _hoisted_6$2, [
              vue.createVNode(WatchIcon, { class: "h4 w4" }),
              vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(formatNumber)(((_a = _ctx.item) == null ? void 0 : _a.play) || 0)), 1)
            ]),
            vue.createElementVNode("div", _hoisted_7$2, [
              vue.createVNode(LikeIcon, { class: "h10 w10 text-primary" }),
              vue.createElementVNode("span", _hoisted_8$1, vue.toDisplayString(vue.unref(formatNumber)(((_b = _ctx.item) == null ? void 0 : _b.like) || 0)), 1)
            ])
          ]),
          vue.createElementVNode("div", _hoisted_9$1, [
            vue.createElementVNode("a", {
              class: "text-[16px] font-normal hover:text-secondary line-clamp-3",
              href: vue.unref(getVideoUrl)(_ctx.item.bvid),
              target: "_blank",
              title: "打开原视频",
              onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
              }, ["stop"])),
              innerHTML: _ctx.item.title
            }, null, 8, _hoisted_10$1),
            vue.createElementVNode("div", _hoisted_11$1, [
              vue.createElementVNode("div", _hoisted_12, [
                vue.createElementVNode("a", {
                  class: "hover:text-secondary center gap1",
                  href: vue.unref(getUpUrl)(_ctx.item.mid),
                  target: "_blank",
                  title: "打开UP空间",
                  onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                  }, ["stop"]))
                }, [
                  vue.createVNode(UPIcon, { class: "h6 w6" }),
                  vue.createTextVNode(" " + vue.toDisplayString(_ctx.item.author), 1)
                ], 8, _hoisted_13),
                vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(formatDateTime)(((_c = _ctx.item) == null ? void 0 : _c.pubdate) || 0)), 1)
              ]),
              vue.createElementVNode("button", {
                class: "btn-main",
                onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => _ctx.$emit("bind"), ["stop"]))
              }, " 确认绑定 ")
            ])
          ])
        ]);
      };
    }
  });
  const _hoisted_1$2 = { class: "card w38 h40 bg-base-100 shadow-xl hover:scale-105 transition hover:cursor-pointer hover:shadow-2xl relative text-white font-bold" };
  const _hoisted_2$1 = {
    key: 0,
    class: "i-carbon-checkmark-filled absolute -top-2 -right-2 w8 h8 text-primary-content z-99"
  };
  const _hoisted_3$1 = { class: "card-body p2" };
  const _hoisted_4$1 = { class: "line-clamp-2 text-lg flex-1 p1" };
  const _hoisted_5$1 = { class: "flex gap3 text-white/90 text-sm" };
  const _hoisted_6$1 = { class: "truncate flex-1 max-w2/3" };
  const _hoisted_7$1 = { class: "card-actions mt3 center" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "SearchItem",
    props: {
      item: {}
    },
    emits: ["match", "unbind"],
    setup(__props) {
      return (_ctx, _cache) => {
        const _directive_lazy_background = vue.resolveDirective("lazy-background");
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          _ctx.item.bvid ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1)) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_3$1, [
            vue.createElementVNode("span", _hoisted_4$1, vue.toDisplayString(_ctx.item.name), 1),
            vue.createElementVNode("div", _hoisted_5$1, [
              vue.createElementVNode("span", _hoisted_6$1, vue.toDisplayString(_ctx.item.singer), 1),
              vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(formatMs)(_ctx.item.duration)), 1)
            ]),
            vue.createElementVNode("div", _hoisted_7$1, [
              vue.createElementVNode("button", {
                class: "btn-main",
                onClick: _cache[0] || (_cache[0] = ($event) => _ctx.item.bvid ? _ctx.$emit("unbind") : _ctx.$emit("match"))
              }, vue.toDisplayString(_ctx.item.bvid ? "取消匹配" : "搜索匹配"), 1)
            ])
          ])
        ])), [
          [_directive_lazy_background, _ctx.item.cover]
        ]);
      };
    }
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-6faa8d1d"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "max-w130 max-h148 bg-black/80 box-border p2 flex flex-col items-center rounded-lg relative" };
  const _hoisted_2 = { class: "center gap4 w-full" };
  const _hoisted_3 = { class: "indicator" };
  const _hoisted_4 = {
    key: 0,
    class: "indicator-item badge"
  };
  const _hoisted_5 = ["disabled"];
  const _hoisted_6 = {
    key: 0,
    class: "center px4 relative w-full pt1"
  };
  const _hoisted_7 = { class: "text-white text-lg inline-flex flex-1" };
  const _hoisted_8 = { class: "keyword line-clamp-1 max-w45/100" };
  const _hoisted_9 = { class: "flex flex-wrap gap3 pl2 py2" };
  const _hoisted_10 = {
    key: 0,
    class: "flex flex-wrap gap3 py2 px4"
  };
  const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "absolute center py1 bottom-0 w-full rounded-full" }, [
    /* @__PURE__ */ vue.createElementVNode("span", { class: "text-xs text-white/50" }, [
      /* @__PURE__ */ vue.createElementVNode("a", {
        href: "https://space.bilibili.com/405579368",
        target: "_blank"
      }, "@半糖人类"),
      /* @__PURE__ */ vue.createTextVNode(" 出品 ")
    ])
  ], -1));
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Pane",
    setup(__props) {
      const listId = vue.ref("");
      const searchList = vue.ref([]);
      const matchList = vue.ref([]);
      const inputRef = vue.ref();
      const loading = vue.ref(false);
      let lastScrollTop = 0;
      const [listRef, enable] = useAutoAnimate({ duration: 500 });
      const matchShow = vue.ref(false);
      const selectedSong = vue.ref();
      const exportList = vue.ref([]);
      async function handleSearch() {
        if (!listId.value.trim() || !/^\d+$/.test(listId.value)) {
          i.error("请输入正确的歌单ID");
          return;
        }
        loading.value = true;
        matchShow.value = false;
        const res = await searchPlaylistApi(listId.value).catch(() => {
          i.error("歌单检索失败");
          loading.value = false;
          throw new Error("歌单检索失败");
        });
        searchList.value = res.data.songs.map((item) => {
          var _a;
          return {
            name: item.name,
            // 歌曲名
            singer: item.ar.map((ar) => ar.name).join(","),
            // 歌手
            duration: item.dt,
            // 时长ms
            cover: item.al.picUrl,
            // 封面
            wyyId: item.id,
            // 网易云ID
            bvid: ((_a = exportList.value.find((v) => v.wyyId === item.id)) == null ? void 0 : _a.bvid) || ""
            // BV号
          };
        });
        loading.value = false;
      }
      async function handleMatch(item) {
        loading.value = true;
        selectedSong.value = item;
        const keyword = `${item.name} ${item.singer}`;
        const { data } = await searchApi(keyword);
        const videoData = data.data.result.filter((item2) => item2.result_type === "video");
        if (!videoData.length) {
          i.error("未搜索到相关视频");
          return;
        }
        matchShow.value = true;
        lastScrollTop = listRef.value.scrollTop;
        listRef.value.scrollTop = 0;
        matchList.value = videoData[0].data.map((item2) => {
          return {
            title: item2.title,
            cover: item2.pic,
            duration: item2.duration,
            author: item2.author,
            bvid: item2.bvid,
            like: item2.like,
            play: item2.play,
            pubdate: item2.pubdate,
            mid: item2.mid
          };
        });
        loading.value = false;
      }
      function handleBack() {
        enable(false);
        matchShow.value = false;
        vue.nextTick(() => {
          enable(true);
          listRef.value.scrollTop = lastScrollTop;
        });
      }
      function handleBind(item) {
        handleBack();
        if (!selectedSong.value)
          return;
        const idx = exportList.value.findIndex((i2) => i2.bvid === item.bvid);
        if (idx !== -1) {
          i.error("当前已存在要绑定的视频");
          return;
        }
        const { bvid, title, duration, author, cover, mid } = item;
        selectedSong.value.bvid = bvid;
        exportList.value.push({
          bvid,
          title,
          duration,
          author,
          cover,
          mid,
          wyyId: selectedSong.value.wyyId
        });
      }
      function handleUnbind(item) {
        exportList.value = exportList.value.filter((i2) => i2.bvid !== item.bvid);
        item.bvid = "";
      }
      vue.onMounted(() => {
        vue.nextTick(() => {
          inputRef.value.focus();
        });
      });
      return (_ctx, _cache) => {
        var _a;
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.withDirectives(vue.createElementVNode("div", _hoisted_2, [
            vue.withDirectives(vue.createElementVNode("input", {
              ref_key: "inputRef",
              ref: inputRef,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(listId) ? listId.value = $event : null),
              type: "text",
              placeholder: "请输入歌单ID",
              class: "input max-w1/2 text-white bg-black/70",
              onKeyup: vue.withKeys(handleSearch, ["enter"])
            }, null, 544), [
              [vue.vModelText, vue.unref(listId)]
            ]),
            vue.createElementVNode("button", {
              class: "btn-main",
              onClick: handleSearch
            }, " 检索 "),
            vue.createElementVNode("div", _hoisted_3, [
              vue.unref(exportList).length ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, vue.toDisplayString(vue.unref(exportList).length), 1)) : vue.createCommentVNode("", true),
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["btn-main", {
                  "btn-disabled": !vue.unref(exportList).length
                }]),
                disabled: !vue.unref(exportList).length,
                onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(downloadJson)(vue.unref(exportList)))
              }, " 导出 ", 10, _hoisted_5)
            ])
          ], 512), [
            [vue.vShow, !vue.unref(matchShow)]
          ]),
          vue.unref(matchShow) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
            vue.createElementVNode("span", _hoisted_7, [
              vue.createTextVNode(" 以下是 "),
              vue.createElementVNode("span", _hoisted_8, vue.toDisplayString((_a = vue.unref(selectedSong)) == null ? void 0 : _a.name), 1),
              vue.createTextVNode(" 的检索结果： ")
            ]),
            vue.createElementVNode("button", {
              class: "btn-main absolute right-6",
              onClick: handleBack
            }, " 返回 ")
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", {
            ref_key: "listRef",
            ref: listRef,
            class: "mt3 flex-1 overflow-y-auto w-full relative overflow-x-hidden mb4"
          }, [
            vue.withDirectives(vue.createVNode(Loading, { class: "sticky top-0 z-2" }, null, 512), [
              [vue.vShow, vue.unref(loading)]
            ]),
            vue.withDirectives(vue.createElementVNode("div", _hoisted_9, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(searchList), (item) => {
                return vue.openBlock(), vue.createBlock(_sfc_main$2, {
                  key: item.name,
                  item,
                  onMatch: ($event) => handleMatch(item),
                  onUnbind: ($event) => handleUnbind(item)
                }, null, 8, ["item", "onMatch", "onUnbind"]);
              }), 128))
            ], 512), [
              [vue.vShow, !vue.unref(matchShow)]
            ]),
            vue.unref(matchShow) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_10, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(matchList), (item) => {
                return vue.openBlock(), vue.createBlock(_sfc_main$3, {
                  key: item.bvid,
                  item,
                  onBind: ($event) => handleBind(item)
                }, null, 8, ["item", "onBind"]);
              }), 128))
            ])) : vue.createCommentVNode("", true)
          ], 512),
          _hoisted_11
        ]);
      };
    }
  });
  const Pane = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6faa8d1d"]]);
  const _hoisted_1 = { class: "fixed top-10 left-10 z-9999 rounded-lg" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const isShow = vue.ref(false);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("button", {
            class: "btn-main",
            onClick: _cache[0] || (_cache[0] = ($event) => isShow.value = !vue.unref(isShow))
          }, " 开启 "),
          vue.unref(isShow) ? (vue.openBlock(), vue.createBlock(Pane, { key: 0 })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function toValue(r2) {
    return typeof r2 === "function" ? r2() : vue.unref(r2);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const notNullish = (val) => val != null;
  const noop = () => {
  };
  function unrefElement(elRef) {
    var _a;
    const plain = toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  function useMounted() {
    const isMounted = vue.ref(false);
    if (vue.getCurrentInstance()) {
      vue.onMounted(() => {
        isMounted.value = true;
      });
    }
    return isMounted;
  }
  function useSupported(callback) {
    const isMounted = useMounted();
    return vue.computed(() => {
      isMounted.value;
      return Boolean(callback());
    });
  }
  function useIntersectionObserver(target2, callback, options2 = {}) {
    const {
      root: root2,
      rootMargin = "0px",
      threshold = 0.1,
      window: window2 = defaultWindow,
      immediate = true
    } = options2;
    const isSupported = useSupported(() => window2 && "IntersectionObserver" in window2);
    const targets = vue.computed(() => {
      const _target = toValue(target2);
      return (Array.isArray(_target) ? _target : [_target]).map(unrefElement).filter(notNullish);
    });
    let cleanup = noop;
    const isActive = vue.ref(immediate);
    const stopWatch = isSupported.value ? vue.watch(
      () => [targets.value, unrefElement(root2), isActive.value],
      ([targets2, root22]) => {
        cleanup();
        if (!isActive.value)
          return;
        if (!targets2.length)
          return;
        const observer = new IntersectionObserver(
          callback,
          {
            root: unrefElement(root22),
            rootMargin,
            threshold
          }
        );
        targets2.forEach((el) => el && observer.observe(el));
        cleanup = () => {
          observer.disconnect();
          cleanup = noop;
        };
      },
      { immediate, flush: "post" }
    ) : noop;
    const stop = () => {
      cleanup();
      stopWatch();
      isActive.value = false;
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      isActive,
      pause() {
        cleanup();
        isActive.value = false;
      },
      resume() {
        isActive.value = true;
      },
      stop
    };
  }
  const lazyPlugin = {
    install(app) {
      app.directive("lazy-background", {
        mounted(el, binding) {
          const { stop } = useIntersectionObserver(
            el,
            ([{ isIntersecting }]) => {
              if (isIntersecting) {
                el.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${binding.value})`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
                stop();
              }
            }
          );
        }
      });
    }
  };
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("vue3-toastify/dist/index.css");
  cssLoader("@unocss/reset/tailwind-compat.css");
  vue.createApp(_sfc_main).use(ct, {
    autoClose: 2e3,
    multiple: false,
    hideProgressBar: true,
    theme: "dark",
    closeButton: false,
    style: {
      fontSize: "20px"
    }
  }).use(lazyPlugin).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, axios, dayjs);