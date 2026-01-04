// ==UserScript==
// @name               Exhentai Enhancer
// @name:en            Exhentai Enhancer
// @name:zh-TW         Exhentai Enhancer
// @name:zh-CN         Exhentai Enhancer
// @namespace          https://github.com/sk2589822/Exhentai-Enhancer
// @version            1.17.1
// @author             sk2589822
// @description        improve UX of Gallery Page, Multi-Page Viewer and Front Page
// @description:en     improve UX of Gallery Page, Multi-Page Viewer and Front Page
// @description:zh-TW  改善 Gallery Page、Multi-Page Viewer 和 Front Page 的使用者體驗
// @description:zh-CN  改善 Gallery Page、Multi-Page Viewer 和 Front Page 的使用者體驗
// @license            MIT
// @icon               https://vitejs.dev/logo.svg
// @supportURL         https://github.com/sk2589822/Exhentai-Enhancer/issues
// @match              https://exhentai.org/*
// @match              https://e-hentai.org/*
// @require            https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.prod.js
// @grant              GM.getValue
// @grant              GM.registerMenuCommand
// @grant              GM.setValue
// @grant              GM_addStyle
// @grant              GM_addValueChangeListener
// @grant              GM_getValue
// @grant              GM_setClipboard
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @grant              unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451535/Exhentai%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/451535/Exhentai%20Enhancer.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(' @charset "UTF-8";.Vue-Toastification__container{z-index:9999;position:fixed;padding:4px;width:600px;box-sizing:border-box;display:flex;min-height:100%;color:#fff;flex-direction:column;pointer-events:none}@media only screen and (min-width : 600px){.Vue-Toastification__container.top-left,.Vue-Toastification__container.top-right,.Vue-Toastification__container.top-center{top:1em}.Vue-Toastification__container.bottom-left,.Vue-Toastification__container.bottom-right,.Vue-Toastification__container.bottom-center{bottom:1em;flex-direction:column-reverse}.Vue-Toastification__container.top-left,.Vue-Toastification__container.bottom-left{left:1em}.Vue-Toastification__container.top-left .Vue-Toastification__toast,.Vue-Toastification__container.bottom-left .Vue-Toastification__toast{margin-right:auto}@supports not (-moz-appearance: none){.Vue-Toastification__container.top-left .Vue-Toastification__toast--rtl,.Vue-Toastification__container.bottom-left .Vue-Toastification__toast--rtl{margin-right:unset;margin-left:auto}}.Vue-Toastification__container.top-right,.Vue-Toastification__container.bottom-right{right:1em}.Vue-Toastification__container.top-right .Vue-Toastification__toast,.Vue-Toastification__container.bottom-right .Vue-Toastification__toast{margin-left:auto}@supports not (-moz-appearance: none){.Vue-Toastification__container.top-right .Vue-Toastification__toast--rtl,.Vue-Toastification__container.bottom-right .Vue-Toastification__toast--rtl{margin-left:unset;margin-right:auto}}.Vue-Toastification__container.top-center,.Vue-Toastification__container.bottom-center{left:50%;margin-left:-300px}.Vue-Toastification__container.top-center .Vue-Toastification__toast,.Vue-Toastification__container.bottom-center .Vue-Toastification__toast{margin-left:auto;margin-right:auto}}@media only screen and (max-width : 600px){.Vue-Toastification__container{width:100vw;padding:0;left:0;margin:0}.Vue-Toastification__container .Vue-Toastification__toast{width:100%}.Vue-Toastification__container.top-left,.Vue-Toastification__container.top-right,.Vue-Toastification__container.top-center{top:0}.Vue-Toastification__container.bottom-left,.Vue-Toastification__container.bottom-right,.Vue-Toastification__container.bottom-center{bottom:0;flex-direction:column-reverse}}.Vue-Toastification__toast{display:inline-flex;position:relative;max-height:800px;min-height:64px;box-sizing:border-box;margin-bottom:1rem;padding:22px 24px;border-radius:8px;box-shadow:0 1px 10px #0000001a,0 2px 15px #0000000d;justify-content:space-between;font-family:Lato,Helvetica,Roboto,Arial,sans-serif;max-width:600px;min-width:326px;pointer-events:auto;overflow:hidden;transform:translateZ(0);direction:ltr}.Vue-Toastification__toast--rtl{direction:rtl}.Vue-Toastification__toast--default{background-color:#1976d2;color:#fff}.Vue-Toastification__toast--info{background-color:#2196f3;color:#fff}.Vue-Toastification__toast--success{background-color:#4caf50;color:#fff}.Vue-Toastification__toast--error{background-color:#ff5252;color:#fff}.Vue-Toastification__toast--warning{background-color:#ffc107;color:#fff}@media only screen and (max-width : 600px){.Vue-Toastification__toast{border-radius:0;margin-bottom:.5rem}}.Vue-Toastification__toast-body{flex:1;line-height:24px;font-size:16px;word-break:break-word;white-space:pre-wrap}.Vue-Toastification__toast-component-body{flex:1}.Vue-Toastification__toast.disable-transition{animation:none!important}.Vue-Toastification__close-button{font-weight:700;font-size:24px;line-height:24px;background:transparent;outline:none;border:none;padding:0 0 0 10px;cursor:pointer;transition:.3s ease;align-items:center;color:#fff;opacity:.3;transition:visibility 0s,opacity .2s linear}.Vue-Toastification__close-button:hover,.Vue-Toastification__close-button:focus{opacity:1}.Vue-Toastification__toast:not(:hover) .Vue-Toastification__close-button.show-on-hover{opacity:0}.Vue-Toastification__toast--rtl .Vue-Toastification__close-button{padding-left:unset;padding-right:10px}@keyframes scale-x-frames{0%{transform:scaleX(1)}to{transform:scaleX(0)}}.Vue-Toastification__progress-bar{position:absolute;bottom:0;left:0;width:100%;height:5px;z-index:10000;background-color:#ffffffb3;transform-origin:left;animation:scale-x-frames linear 1 forwards}.Vue-Toastification__toast--rtl .Vue-Toastification__progress-bar{right:0;left:unset;transform-origin:right}.Vue-Toastification__icon{margin:auto 18px auto 0;background:transparent;outline:none;border:none;padding:0;transition:.3s ease;align-items:center;width:20px;height:100%}.Vue-Toastification__toast--rtl .Vue-Toastification__icon{margin:auto 0 auto 18px}@keyframes bounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:none}}@keyframes bounceOutRight{40%{opacity:1;transform:translate3d(-20px,0,0)}to{opacity:0;transform:translate3d(1000px,0,0)}}@keyframes bounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:none}}@keyframes bounceOutLeft{20%{opacity:1;transform:translate3d(20px,0,0)}to{opacity:0;transform:translate3d(-2000px,0,0)}}@keyframes bounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translateZ(0)}}@keyframes bounceOutUp{20%{transform:translate3d(0,-10px,0)}40%,45%{opacity:1;transform:translate3d(0,20px,0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}@keyframes bounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:none}}@keyframes bounceOutDown{20%{transform:translate3d(0,10px,0)}40%,45%{opacity:1;transform:translate3d(0,-20px,0)}to{opacity:0;transform:translate3d(0,2000px,0)}}.Vue-Toastification__bounce-enter-active.top-left,.Vue-Toastification__bounce-enter-active.bottom-left{animation-name:bounceInLeft}.Vue-Toastification__bounce-enter-active.top-right,.Vue-Toastification__bounce-enter-active.bottom-right{animation-name:bounceInRight}.Vue-Toastification__bounce-enter-active.top-center{animation-name:bounceInDown}.Vue-Toastification__bounce-enter-active.bottom-center{animation-name:bounceInUp}.Vue-Toastification__bounce-leave-active:not(.disable-transition).top-left,.Vue-Toastification__bounce-leave-active:not(.disable-transition).bottom-left{animation-name:bounceOutLeft}.Vue-Toastification__bounce-leave-active:not(.disable-transition).top-right,.Vue-Toastification__bounce-leave-active:not(.disable-transition).bottom-right{animation-name:bounceOutRight}.Vue-Toastification__bounce-leave-active:not(.disable-transition).top-center{animation-name:bounceOutUp}.Vue-Toastification__bounce-leave-active:not(.disable-transition).bottom-center{animation-name:bounceOutDown}.Vue-Toastification__bounce-leave-active,.Vue-Toastification__bounce-enter-active{animation-duration:.75s;animation-fill-mode:both}.Vue-Toastification__bounce-move{transition-timing-function:ease-in-out;transition-property:all;transition-duration:.4s}@keyframes fadeOutTop{0%{transform:translateY(0);opacity:1}to{transform:translateY(-50px);opacity:0}}@keyframes fadeOutLeft{0%{transform:translate(0);opacity:1}to{transform:translate(-50px);opacity:0}}@keyframes fadeOutBottom{0%{transform:translateY(0);opacity:1}to{transform:translateY(50px);opacity:0}}@keyframes fadeOutRight{0%{transform:translate(0);opacity:1}to{transform:translate(50px);opacity:0}}@keyframes fadeInLeft{0%{transform:translate(-50px);opacity:0}to{transform:translate(0);opacity:1}}@keyframes fadeInRight{0%{transform:translate(50px);opacity:0}to{transform:translate(0);opacity:1}}@keyframes fadeInTop{0%{transform:translateY(-50px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes fadeInBottom{0%{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}.Vue-Toastification__fade-enter-active.top-left,.Vue-Toastification__fade-enter-active.bottom-left{animation-name:fadeInLeft}.Vue-Toastification__fade-enter-active.top-right,.Vue-Toastification__fade-enter-active.bottom-right{animation-name:fadeInRight}.Vue-Toastification__fade-enter-active.top-center{animation-name:fadeInTop}.Vue-Toastification__fade-enter-active.bottom-center{animation-name:fadeInBottom}.Vue-Toastification__fade-leave-active:not(.disable-transition).top-left,.Vue-Toastification__fade-leave-active:not(.disable-transition).bottom-left{animation-name:fadeOutLeft}.Vue-Toastification__fade-leave-active:not(.disable-transition).top-right,.Vue-Toastification__fade-leave-active:not(.disable-transition).bottom-right{animation-name:fadeOutRight}.Vue-Toastification__fade-leave-active:not(.disable-transition).top-center{animation-name:fadeOutTop}.Vue-Toastification__fade-leave-active:not(.disable-transition).bottom-center{animation-name:fadeOutBottom}.Vue-Toastification__fade-leave-active,.Vue-Toastification__fade-enter-active{animation-duration:.75s;animation-fill-mode:both}.Vue-Toastification__fade-move{transition-timing-function:ease-in-out;transition-property:all;transition-duration:.4s}@keyframes slideInBlurredLeft{0%{transform:translate(-1000px) scaleX(2.5) scaleY(.2);transform-origin:100% 50%;filter:blur(40px);opacity:0}to{transform:translate(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}@keyframes slideInBlurredTop{0%{transform:translateY(-1000px) scaleY(2.5) scaleX(.2);transform-origin:50% 0%;filter:blur(240px);opacity:0}to{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}@keyframes slideInBlurredRight{0%{transform:translate(1000px) scaleX(2.5) scaleY(.2);transform-origin:0% 50%;filter:blur(40px);opacity:0}to{transform:translate(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}@keyframes slideInBlurredBottom{0%{transform:translateY(1000px) scaleY(2.5) scaleX(.2);transform-origin:50% 100%;filter:blur(240px);opacity:0}to{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}}@keyframes slideOutBlurredTop{0%{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 0%;filter:blur(0);opacity:1}to{transform:translateY(-1000px) scaleY(2) scaleX(.2);transform-origin:50% 0%;filter:blur(240px);opacity:0}}@keyframes slideOutBlurredBottom{0%{transform:translateY(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}to{transform:translateY(1000px) scaleY(2) scaleX(.2);transform-origin:50% 100%;filter:blur(240px);opacity:0}}@keyframes slideOutBlurredLeft{0%{transform:translate(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}to{transform:translate(-1000px) scaleX(2) scaleY(.2);transform-origin:100% 50%;filter:blur(40px);opacity:0}}@keyframes slideOutBlurredRight{0%{transform:translate(0) scaleY(1) scaleX(1);transform-origin:50% 50%;filter:blur(0);opacity:1}to{transform:translate(1000px) scaleX(2) scaleY(.2);transform-origin:0% 50%;filter:blur(40px);opacity:0}}.Vue-Toastification__slideBlurred-enter-active.top-left,.Vue-Toastification__slideBlurred-enter-active.bottom-left{animation-name:slideInBlurredLeft}.Vue-Toastification__slideBlurred-enter-active.top-right,.Vue-Toastification__slideBlurred-enter-active.bottom-right{animation-name:slideInBlurredRight}.Vue-Toastification__slideBlurred-enter-active.top-center{animation-name:slideInBlurredTop}.Vue-Toastification__slideBlurred-enter-active.bottom-center{animation-name:slideInBlurredBottom}.Vue-Toastification__slideBlurred-leave-active:not(.disable-transition).top-left,.Vue-Toastification__slideBlurred-leave-active:not(.disable-transition).bottom-left{animation-name:slideOutBlurredLeft}.Vue-Toastification__slideBlurred-leave-active:not(.disable-transition).top-right,.Vue-Toastification__slideBlurred-leave-active:not(.disable-transition).bottom-right{animation-name:slideOutBlurredRight}.Vue-Toastification__slideBlurred-leave-active:not(.disable-transition).top-center{animation-name:slideOutBlurredTop}.Vue-Toastification__slideBlurred-leave-active:not(.disable-transition).bottom-center{animation-name:slideOutBlurredBottom}.Vue-Toastification__slideBlurred-leave-active,.Vue-Toastification__slideBlurred-enter-active{animation-duration:.75s;animation-fill-mode:both}.Vue-Toastification__slideBlurred-move{transition-timing-function:ease-in-out;transition-property:all;transition-duration:.4s}.itg.gld.is-fetching:after{grid-column:1/-1;display:flex;align-items:center;justify-content:center;margin:0 auto 864px;width:30px;height:30px;line-height:30px;content:"\u231B";animation:spin ease-in-out 1s infinite}.gldown{display:flex}.archive-button{display:flex;justify-content:center;align-items:center;flex-shrink:0;position:relative;top:-6px;margin-left:4px;width:24px;height:24px;border-radius:9999px;background-color:#5fa9cf;box-shadow:#0000003d 0 3px 5px;cursor:pointer}@keyframes spin{0%{rotate:0}to{rotate:360deg}}.popup{position:absolute!important;padding:20px;text-align:center;background-color:var(--bg-color);border:white solid 3px;border-radius:20px;z-index:100;transition:opacity .3s}.popup a{text-decoration:underline}div#gd5{float:unset;width:auto}.is-ready:after{content:" \u2714\uFE0F"}.is-fetching{font-size:0;pointer-events:none;text-decoration:none}.is-fetching:after{content:"\u231B";display:inline-block;font-size:8px;line-height:8px;animation:spin ease-in-out 1s infinite}input[name=dltype]+.is-fetching{position:relative}input[name=dltype]+.is-fetching:after{position:absolute;top:0;left:50%;font-size:12px;line-height:27px}input[name=dltype]+.is-fetching input{color:transparent}.is-finished{font-size:0;pointer-events:none;text-decoration:none}.is-finished:after{content:"\u2714\uFE0F";display:inline-block;font-size:8px;line-height:8px}.page-elevator[data-v-c3f8cb4a]{display:flex;flex-direction:column;gap:10px;width:40px;opacity:1}.page-elevator__input[data-v-c3f8cb4a]{display:flex;margin:0;padding:0;width:100%;height:30px;text-align:center;border:#777 solid 1px;box-sizing:border-box}.page-elevator__slash[data-v-c3f8cb4a]{line-height:100%}:fullscreen .page-elevator[data-v-c3f8cb4a]{opacity:0}:fullscreen .page-elevator[data-v-c3f8cb4a]:hover{opacity:1}#pane_images .mimg{width:min-content!important;min-width:unset;max-height:calc(var(--image-size) + 24px)!important}#pane_images .mimg>a{-webkit-user-select:none;user-select:none}#pane_images .mimg>a>img{width:auto!important;max-height:var(--image-size);pointer-events:none}.image-resizer[data-v-19caf69f]{display:flex;flex-direction:column;gap:16px;width:40px}.image-resizer__button[data-v-19caf69f]{padding:0;width:100%;height:30px;text-align:center;background-color:transparent;border:#777 solid 1px;border-radius:5px;box-sizing:border-box;cursor:pointer}.image-resizer__button[data-v-19caf69f]:hover{background-color:#ffa50033}.image-resizer__button--active[data-v-19caf69f],.image-resizer__button--active[data-v-19caf69f]:hover{background-color:orange}.magnifier-overlay[data-v-716338a1]{position:fixed;top:0;right:0;bottom:0;left:0;z-index:999;background:transparent;cursor:none}.magnifier[data-v-716338a1]{z-index:1000}.magnifier-background[data-v-716338a1]{position:absolute;top:0;right:0;bottom:0;left:0;background-color:#00000080}.magnifier-image[data-v-716338a1]{position:absolute;cursor:none}.enhancer-features{position:absolute;top:0;bottom:0;right:0;display:flex;align-items:center;padding-right:5px;z-index:100;flex-direction:row-reverse;gap:16px;box-sizing:border-box}.enhancer-features__feature{padding:10px 5px;background:#7777;border-radius:10px;opacity:0;transition:opacity .3s ease;box-sizing:border-box}.enhancer-features__feature:hover{opacity:1}.switch[data-v-894c8e09]{position:relative;display:inline-block;width:50px;height:24px}.switch__input[data-v-894c8e09]{width:0;height:0;opacity:0}.switch__slider[data-v-894c8e09]{position:absolute;top:0;bottom:0;right:0;left:0;background-color:#ccc;border-radius:9999px;transition:.4s;cursor:pointer}.switch__slider[data-v-894c8e09]:before{position:absolute;top:2px;left:2px;height:calc(100% - 4px);aspect-ratio:1/1;background-color:#fff;border-radius:50%;transition:.4s;content:""}.switch__input:checked+.switch__slider[data-v-894c8e09]{background-color:#34353b}.switch__input:checked+.switch__slider[data-v-894c8e09]:before{transform:translate(26px)}.settings-panel-wrap{display:flex;justify-content:center;align-items:center}.settings-panel{box-sizing:border-box;position:relative;display:flex;flex-direction:column;row-gap:16px;margin:32px;padding:32px;max-width:1000px;max-height:calc(100vh - 64px);background-color:#34353b;border-radius:4px;color:#f1f1f1}.settings-panel__inner{overflow-y:auto;padding-right:16px;height:100%}.settings-panel__section{background-color:#4f535b;border-radius:4px}.settings-panel__section-name{margin:16px 32px;padding-top:16px;font-size:20px;text-align:left;line-height:100%}.settings-panel__close-button{position:absolute;top:4px;right:4px;padding:8px;cursor:pointer}.settings-panel__close-button svg{width:16px;height:16px}.settings-panel__separator{background:#f1f1f1}.settings{display:flex;flex-wrap:wrap;align-items:center;justify-content:start;padding:8px 16px;column-gap:8px}.settings__name{font-size:16px}.settings__notice{font-size:12px}.settings__intro{margin-left:60px;width:100%;font-size:14px;text-align:left}.settings__magnifier-config{display:flex;flex-direction:column;gap:.75rem;margin-top:.5rem}.settings__label{display:flex;flex-direction:row;align-items:center;gap:.25rem;font-size:.9rem}.settings__input{width:120px;padding:.25rem;border:1px solid #ccc;border-radius:4px;color:#f1f1f1;background-color:#34353b;outline:none}.settings__link{color:#ddd}.settings__select{background-color:#34353b;border:rgb(141,141,141);color:#f1f1f1;outline:none}.settings__select:enabled:hover,.settings__select:enabled:focus{background-color:#43464e!important;border-color:#aeaeae!important}.settings__option{color:#f1f1f1;background-color:#34353b;outline:none}.actions{display:flex;align-items:center;justify-content:flex-end}.actions__button{padding:8px 16px;color:#fff;background-color:#4f535b;border:none;border-radius:4px;cursor:pointer}.vfm--fixed{position:fixed}.vfm--absolute{position:absolute}.vfm--inset{top:0;right:0;bottom:0;left:0}.vfm--overlay{z-index:-1;background-color:#00000080}.vfm--prevent-none{pointer-events:none}.vfm--prevent-auto{pointer-events:auto}.vfm--outline-none:focus{outline:none}@keyframes fade-in{0%{opacity:0}to{opacity:1}}@keyframes fade-out{0%{opacity:1}to{opacity:0}}.vfm-fade-enter-active{animation:fade-in .3s ease}.vfm-fade-leave-active{animation:fade-out .3s ease}.vfm-bounce-back{transition-property:transform;transition-duration:.3s}.vfm-slide-up-enter-active,.vfm-slide-up-leave-active,.vfm-slide-down-enter-active,.vfm-slide-down-leave-active{transition:transform .3s ease}.vfm-slide-down-enter-from,.vfm-slide-down-leave-to{transform:translateY(100vh)!important}.vfm-slide-up-enter-from,.vfm-slide-up-leave-to{transform:translateY(-100vh)!important}.vfm-slide-right-enter-active,.vfm-slide-right-leave-active,.vfm-slide-left-enter-active,.vfm-slide-left-leave-active{transition:transform .3s ease}.vfm-slide-right-enter-from,.vfm-slide-right-leave-to{transform:translate(100vw)!important}.vfm-slide-left-enter-from,.vfm-slide-left-leave-to{transform:translate(-100vw)!important}.vfm-swipe-banner-back,.vfm-swipe-banner-forward{position:fixed;top:0;bottom:0;width:27px;z-index:10}.vfm-swipe-banner-back{left:0}.vfm-swipe-banner-forward{right:0} ');

(function (vue) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _a;
  function tryOnScopeDispose$1(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function toValue$1(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const notNullish = (val) => val != null;
  const toString = Object.prototype.toString;
  const isObject$2 = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  const bypassFilter = (invoke2) => {
    return invoke2();
  };
  function pausableFilter(extendFilter = bypassFilter) {
    const isActive = vue.ref(true);
    function pause() {
      isActive.value = false;
    }
    function resume() {
      isActive.value = true;
    }
    const eventFilter = (...args) => {
      if (isActive.value)
        extendFilter(...args);
    };
    return { isActive: vue.readonly(isActive), pause, resume, eventFilter };
  }
  function objectEntries(obj) {
    return Object.entries(obj);
  }
  function getLifeCycleTarget(target) {
    return vue.getCurrentInstance();
  }
  function watchWithFilter(source, cb, options = {}) {
    const {
      eventFilter = bypassFilter,
      ...watchOptions
    } = options;
    return vue.watch(
      source,
      createFilterWrapper(
        eventFilter,
        cb
      ),
      watchOptions
    );
  }
  function watchPausable(source, cb, options = {}) {
    const {
      eventFilter: filter,
      ...watchOptions
    } = options;
    const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
    const stop = watchWithFilter(
      source,
      cb,
      {
        ...watchOptions,
        eventFilter
      }
    );
    return { stop, pause, resume, isActive };
  }
  function tryOnMounted(fn, sync = true, target) {
    const instance = getLifeCycleTarget();
    if (instance)
      vue.onMounted(fn, target);
    else if (sync)
      fn();
    else
      vue.nextTick(fn);
  }
  const defaultWindow = isClient ? window : void 0;
  const defaultDocument = isClient ? window.document : void 0;
  function unrefElement$1(elRef) {
    var _a2;
    const plain = toValue$1(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  function useEventListener(...args) {
    let target;
    let events2;
    let listeners;
    let options;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      [events2, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events2, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events2))
      events2 = [events2];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(
      () => [unrefElement$1(target), toValue$1(options)],
      ([el, options2]) => {
        cleanup();
        if (!el)
          return;
        const optionsClone = isObject$2(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events2.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, optionsClone));
          })
        );
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose$1(stop);
    return stop;
  }
  function useMounted() {
    const isMounted = vue.ref(false);
    const instance = vue.getCurrentInstance();
    if (instance) {
      vue.onMounted(() => {
        isMounted.value = true;
      }, instance);
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
  function useMutationObserver(target, callback, options = {}) {
    const { window: window2 = defaultWindow, ...mutationOptions } = options;
    let observer;
    const isSupported = useSupported(() => window2 && "MutationObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const targets = vue.computed(() => {
      const value = toValue$1(target);
      const items = (Array.isArray(value) ? value : [value]).map(unrefElement$1).filter(notNullish);
      return new Set(items);
    });
    const stopWatch = vue.watch(
      () => targets.value,
      (targets2) => {
        cleanup();
        if (isSupported.value && targets2.size) {
          observer = new MutationObserver(callback);
          targets2.forEach((el) => observer.observe(el, mutationOptions));
        }
      },
      { immediate: true, flush: "post" }
    );
    const takeRecords = () => {
      return observer == null ? void 0 : observer.takeRecords();
    };
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose$1(stop);
    return {
      isSupported,
      stop,
      takeRecords
    };
  }
  const WRITABLE_PROPERTIES = [
    "hash",
    "host",
    "hostname",
    "href",
    "pathname",
    "port",
    "protocol",
    "search"
  ];
  function useBrowserLocation(options = {}) {
    const { window: window2 = defaultWindow } = options;
    const refs = Object.fromEntries(
      WRITABLE_PROPERTIES.map((key) => [key, vue.ref()])
    );
    for (const [key, ref2] of objectEntries(refs)) {
      vue.watch(ref2, (value) => {
        if (!(window2 == null ? void 0 : window2.location) || window2.location[key] === value)
          return;
        window2.location[key] = value;
      });
    }
    const buildState = (trigger) => {
      var _a2;
      const { state: state2, length } = (window2 == null ? void 0 : window2.history) || {};
      const { origin } = (window2 == null ? void 0 : window2.location) || {};
      for (const key of WRITABLE_PROPERTIES)
        refs[key].value = (_a2 = window2 == null ? void 0 : window2.location) == null ? void 0 : _a2[key];
      return vue.reactive({
        trigger,
        state: state2,
        length,
        origin,
        ...refs
      });
    };
    const state = vue.ref(buildState("load"));
    if (window2) {
      useEventListener(window2, "popstate", () => state.value = buildState("popstate"), { passive: true });
      useEventListener(window2, "hashchange", () => state.value = buildState("hashchange"), { passive: true });
    }
    return state;
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  const handlers = /* @__PURE__ */ getHandlers();
  function getHandlers() {
    if (!(globalKey in _global))
      _global[globalKey] = _global[globalKey] || {};
    return _global[globalKey];
  }
  function getSSRHandler(key, fallback) {
    return handlers[key] || fallback;
  }
  function guessSerializerType(rawInit) {
    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
  }
  const StorageSerializers = {
    boolean: {
      read: (v) => v === "true",
      write: (v) => String(v)
    },
    object: {
      read: (v) => JSON.parse(v),
      write: (v) => JSON.stringify(v)
    },
    number: {
      read: (v) => Number.parseFloat(v),
      write: (v) => String(v)
    },
    any: {
      read: (v) => v,
      write: (v) => String(v)
    },
    string: {
      read: (v) => v,
      write: (v) => String(v)
    },
    map: {
      read: (v) => new Map(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v.entries()))
    },
    set: {
      read: (v) => new Set(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v))
    },
    date: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString()
    }
  };
  const customStorageEventName = "vueuse-storage";
  function useStorage(key, defaults2, storage, options = {}) {
    var _a2;
    const {
      flush = "pre",
      deep = true,
      listenToStorageChanges = true,
      writeDefaults = true,
      mergeDefaults = false,
      shallow,
      window: window2 = defaultWindow,
      eventFilter,
      onError = (e) => {
        console.error(e);
      },
      initOnMounted
    } = options;
    const data = (shallow ? vue.shallowRef : vue.ref)(defaults2);
    if (!storage) {
      try {
        storage = getSSRHandler("getDefaultStorage", () => {
          var _a22;
          return (_a22 = defaultWindow) == null ? void 0 : _a22.localStorage;
        })();
      } catch (e) {
        onError(e);
      }
    }
    if (!storage)
      return data;
    const rawInit = toValue$1(defaults2);
    const type = guessSerializerType(rawInit);
    const serializer = (_a2 = options.serializer) != null ? _a2 : StorageSerializers[type];
    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
      data,
      () => write(data.value),
      { flush, deep, eventFilter }
    );
    if (window2 && listenToStorageChanges) {
      tryOnMounted(() => {
        if (storage instanceof Storage)
          useEventListener(window2, "storage", update);
        else
          useEventListener(window2, customStorageEventName, updateFromCustomEvent);
        if (initOnMounted)
          update();
      });
    }
    if (!initOnMounted)
      update();
    function dispatchWriteEvent(oldValue, newValue) {
      if (window2) {
        const payload = {
          key,
          oldValue,
          newValue,
          storageArea: storage
        };
        window2.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, {
          detail: payload
        }));
      }
    }
    function write(v) {
      try {
        const oldValue = storage.getItem(key);
        if (v == null) {
          dispatchWriteEvent(oldValue, null);
          storage.removeItem(key);
        } else {
          const serialized = serializer.write(v);
          if (oldValue !== serialized) {
            storage.setItem(key, serialized);
            dispatchWriteEvent(oldValue, serialized);
          }
        }
      } catch (e) {
        onError(e);
      }
    }
    function read(event) {
      const rawValue = event ? event.newValue : storage.getItem(key);
      if (rawValue == null) {
        if (writeDefaults && rawInit != null)
          storage.setItem(key, serializer.write(rawInit));
        return rawInit;
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue);
        if (typeof mergeDefaults === "function")
          return mergeDefaults(value, rawInit);
        else if (type === "object" && !Array.isArray(value))
          return { ...rawInit, ...value };
        return value;
      } else if (typeof rawValue !== "string") {
        return rawValue;
      } else {
        return serializer.read(rawValue);
      }
    }
    function update(event) {
      if (event && event.storageArea !== storage)
        return;
      if (event && event.key == null) {
        data.value = rawInit;
        return;
      }
      if (event && event.key !== key)
        return;
      pauseWatch();
      try {
        if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
          data.value = read(event);
      } catch (e) {
        onError(e);
      } finally {
        if (event)
          vue.nextTick(resumeWatch);
        else
          resumeWatch();
      }
    }
    function updateFromCustomEvent(event) {
      update(event.detail);
    }
    return data;
  }
  function useResizeObserver(target, callback, options = {}) {
    const { window: window2 = defaultWindow, ...observerOptions } = options;
    let observer;
    const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const targets = vue.computed(() => {
      const _targets = toValue$1(target);
      return Array.isArray(_targets) ? _targets.map((el) => unrefElement$1(el)) : [unrefElement$1(_targets)];
    });
    const stopWatch = vue.watch(
      targets,
      (els) => {
        cleanup();
        if (isSupported.value && window2) {
          observer = new ResizeObserver(callback);
          for (const _el of els) {
            if (_el)
              observer.observe(_el, observerOptions);
          }
        }
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose$1(stop);
    return {
      isSupported,
      stop
    };
  }
  function useElementBounding(target, options = {}) {
    const {
      reset = true,
      windowResize = true,
      windowScroll = true,
      immediate = true,
      updateTiming = "sync"
    } = options;
    const height = vue.ref(0);
    const bottom = vue.ref(0);
    const left = vue.ref(0);
    const right = vue.ref(0);
    const top = vue.ref(0);
    const width = vue.ref(0);
    const x = vue.ref(0);
    const y = vue.ref(0);
    function recalculate() {
      const el = unrefElement$1(target);
      if (!el) {
        if (reset) {
          height.value = 0;
          bottom.value = 0;
          left.value = 0;
          right.value = 0;
          top.value = 0;
          width.value = 0;
          x.value = 0;
          y.value = 0;
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      height.value = rect.height;
      bottom.value = rect.bottom;
      left.value = rect.left;
      right.value = rect.right;
      top.value = rect.top;
      width.value = rect.width;
      x.value = rect.x;
      y.value = rect.y;
    }
    function update() {
      if (updateTiming === "sync")
        recalculate();
      else if (updateTiming === "next-frame")
        requestAnimationFrame(() => recalculate());
    }
    useResizeObserver(target, update);
    vue.watch(() => unrefElement$1(target), (ele) => !ele && update());
    useMutationObserver(target, update, {
      attributeFilter: ["style", "class"]
    });
    if (windowScroll)
      useEventListener("scroll", update, { capture: true, passive: true });
    if (windowResize)
      useEventListener("resize", update, { passive: true });
    tryOnMounted(() => {
      if (immediate)
        update();
    });
    return {
      height,
      bottom,
      left,
      right,
      top,
      width,
      x,
      y,
      update
    };
  }
  const eventHandlers = [
    "fullscreenchange",
    "webkitfullscreenchange",
    "webkitendfullscreen",
    "mozfullscreenchange",
    "MSFullscreenChange"
  ];
  function useFullscreen(target, options = {}) {
    const {
      document: document2 = defaultDocument,
      autoExit = false
    } = options;
    const targetRef = vue.computed(() => {
      var _a2;
      return (_a2 = unrefElement$1(target)) != null ? _a2 : document2 == null ? void 0 : document2.querySelector("html");
    });
    const isFullscreen = vue.ref(false);
    const requestMethod = vue.computed(() => {
      return [
        "requestFullscreen",
        "webkitRequestFullscreen",
        "webkitEnterFullscreen",
        "webkitEnterFullScreen",
        "webkitRequestFullScreen",
        "mozRequestFullScreen",
        "msRequestFullscreen"
      ].find((m) => document2 && m in document2 || targetRef.value && m in targetRef.value);
    });
    const exitMethod = vue.computed(() => {
      return [
        "exitFullscreen",
        "webkitExitFullscreen",
        "webkitExitFullScreen",
        "webkitCancelFullScreen",
        "mozCancelFullScreen",
        "msExitFullscreen"
      ].find((m) => document2 && m in document2 || targetRef.value && m in targetRef.value);
    });
    const fullscreenEnabled = vue.computed(() => {
      return [
        "fullScreen",
        "webkitIsFullScreen",
        "webkitDisplayingFullscreen",
        "mozFullScreen",
        "msFullscreenElement"
      ].find((m) => document2 && m in document2 || targetRef.value && m in targetRef.value);
    });
    const fullscreenElementMethod = [
      "fullscreenElement",
      "webkitFullscreenElement",
      "mozFullScreenElement",
      "msFullscreenElement"
    ].find((m) => document2 && m in document2);
    const isSupported = useSupported(() => targetRef.value && document2 && requestMethod.value !== void 0 && exitMethod.value !== void 0 && fullscreenEnabled.value !== void 0);
    const isCurrentElementFullScreen = () => {
      if (fullscreenElementMethod)
        return (document2 == null ? void 0 : document2[fullscreenElementMethod]) === targetRef.value;
      return false;
    };
    const isElementFullScreen = () => {
      if (fullscreenEnabled.value) {
        if (document2 && document2[fullscreenEnabled.value] != null) {
          return document2[fullscreenEnabled.value];
        } else {
          const target2 = targetRef.value;
          if ((target2 == null ? void 0 : target2[fullscreenEnabled.value]) != null) {
            return Boolean(target2[fullscreenEnabled.value]);
          }
        }
      }
      return false;
    };
    async function exit() {
      if (!isSupported.value || !isFullscreen.value)
        return;
      if (exitMethod.value) {
        if ((document2 == null ? void 0 : document2[exitMethod.value]) != null) {
          await document2[exitMethod.value]();
        } else {
          const target2 = targetRef.value;
          if ((target2 == null ? void 0 : target2[exitMethod.value]) != null)
            await target2[exitMethod.value]();
        }
      }
      isFullscreen.value = false;
    }
    async function enter() {
      if (!isSupported.value || isFullscreen.value)
        return;
      if (isElementFullScreen())
        await exit();
      const target2 = targetRef.value;
      if (requestMethod.value && (target2 == null ? void 0 : target2[requestMethod.value]) != null) {
        await target2[requestMethod.value]();
        isFullscreen.value = true;
      }
    }
    async function toggle() {
      await (isFullscreen.value ? exit() : enter());
    }
    const handlerCallback = () => {
      const isElementFullScreenValue = isElementFullScreen();
      if (!isElementFullScreenValue || isElementFullScreenValue && isCurrentElementFullScreen())
        isFullscreen.value = isElementFullScreenValue;
    };
    useEventListener(document2, eventHandlers, handlerCallback, false);
    useEventListener(() => unrefElement$1(targetRef), eventHandlers, handlerCallback, false);
    if (autoExit)
      tryOnScopeDispose$1(exit);
    return {
      isSupported,
      isFullscreen,
      enter,
      exit,
      toggle
    };
  }
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  function unrefElement(elRef) {
    var _a2;
    const plain = toValue(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  /*!
  * tabbable 6.2.0
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  */
  var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
  var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
  var NoElement = typeof Element === "undefined";
  var matches = NoElement ? function() {
  } : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
    var _element$getRootNode;
    return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
  } : function(element) {
    return element === null || element === void 0 ? void 0 : element.ownerDocument;
  };
  var isInert = function isInert2(node, lookUp) {
    var _node$getAttribute;
    if (lookUp === void 0) {
      lookUp = true;
    }
    var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
    var inert = inertAtt === "" || inertAtt === "true";
    var result = inert || lookUp && node && isInert2(node.parentNode);
    return result;
  };
  var isContentEditable = function isContentEditable2(node) {
    var _node$getAttribute2;
    var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
    return attValue === "" || attValue === "true";
  };
  var getCandidates = function getCandidates2(el, includeContainer, filter) {
    if (isInert(el)) {
      return [];
    }
    var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
    if (includeContainer && matches.call(el, candidateSelector)) {
      candidates.unshift(el);
    }
    candidates = candidates.filter(filter);
    return candidates;
  };
  var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
    var candidates = [];
    var elementsToCheck = Array.from(elements);
    while (elementsToCheck.length) {
      var element = elementsToCheck.shift();
      if (isInert(element, false)) {
        continue;
      }
      if (element.tagName === "SLOT") {
        var assigned = element.assignedElements();
        var content = assigned.length ? assigned : element.children;
        var nestedCandidates = getCandidatesIteratively2(content, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: nestedCandidates
          });
        }
      } else {
        var validCandidate = matches.call(element, candidateSelector);
        if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
          candidates.push(element);
        }
        var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
        typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
        var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
        if (shadowRoot && validShadowRoot) {
          var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
          if (options.flatten) {
            candidates.push.apply(candidates, _nestedCandidates);
          } else {
            candidates.push({
              scopeParent: element,
              candidates: _nestedCandidates
            });
          }
        } else {
          elementsToCheck.unshift.apply(elementsToCheck, element.children);
        }
      }
    }
    return candidates;
  };
  var hasTabIndex = function hasTabIndex2(node) {
    return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
  };
  var getTabIndex = function getTabIndex2(node) {
    if (!node) {
      throw new Error("No node provided");
    }
    if (node.tabIndex < 0) {
      if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
        return 0;
      }
    }
    return node.tabIndex;
  };
  var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
    var tabIndex = getTabIndex(node);
    if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
      return 0;
    }
    return tabIndex;
  };
  var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
    return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
  };
  var isInput = function isInput2(node) {
    return node.tagName === "INPUT";
  };
  var isHiddenInput = function isHiddenInput2(node) {
    return isInput(node) && node.type === "hidden";
  };
  var isDetailsWithSummary = function isDetailsWithSummary2(node) {
    var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
      return child.tagName === "SUMMARY";
    });
    return r;
  };
  var getCheckedRadio = function getCheckedRadio2(nodes, form) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].checked && nodes[i].form === form) {
        return nodes[i];
      }
    }
  };
  var isTabbableRadio = function isTabbableRadio2(node) {
    if (!node.name) {
      return true;
    }
    var radioScope = node.form || getRootNode(node);
    var queryRadios = function queryRadios2(name) {
      return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
    };
    var radioSet;
    if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
      radioSet = queryRadios(window.CSS.escape(node.name));
    } else {
      try {
        radioSet = queryRadios(node.name);
      } catch (err) {
        console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
        return false;
      }
    }
    var checked = getCheckedRadio(radioSet, node.form);
    return !checked || checked === node;
  };
  var isRadio = function isRadio2(node) {
    return isInput(node) && node.type === "radio";
  };
  var isNonTabbableRadio = function isNonTabbableRadio2(node) {
    return isRadio(node) && !isTabbableRadio(node);
  };
  var isNodeAttached = function isNodeAttached2(node) {
    var _nodeRoot;
    var nodeRoot = node && getRootNode(node);
    var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
    var attached = false;
    if (nodeRoot && nodeRoot !== node) {
      var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
      attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
      while (!attached && nodeRootHost) {
        var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
        nodeRoot = getRootNode(nodeRootHost);
        nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
        attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
      }
    }
    return attached;
  };
  var isZeroArea = function isZeroArea2(node) {
    var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
    return width === 0 && height === 0;
  };
  var isHidden = function isHidden2(node, _ref) {
    var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
    if (getComputedStyle(node).visibility === "hidden") {
      return true;
    }
    var isDirectSummary = matches.call(node, "details>summary:first-of-type");
    var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
    if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
      return true;
    }
    if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
      if (typeof getShadowRoot === "function") {
        var originalNode = node;
        while (node) {
          var parentElement = node.parentElement;
          var rootNode = getRootNode(node);
          if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
            return isZeroArea(node);
          } else if (node.assignedSlot) {
            node = node.assignedSlot;
          } else if (!parentElement && rootNode !== node.ownerDocument) {
            node = rootNode.host;
          } else {
            node = parentElement;
          }
        }
        node = originalNode;
      }
      if (isNodeAttached(node)) {
        return !node.getClientRects().length;
      }
      if (displayCheck !== "legacy-full") {
        return true;
      }
    } else if (displayCheck === "non-zero-area") {
      return isZeroArea(node);
    }
    return false;
  };
  var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
    if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
      var parentNode = node.parentElement;
      while (parentNode) {
        if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
          for (var i = 0; i < parentNode.children.length; i++) {
            var child = parentNode.children.item(i);
            if (child.tagName === "LEGEND") {
              return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
            }
          }
          return true;
        }
        parentNode = parentNode.parentElement;
      }
    }
    return false;
  };
  var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
    if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
    //  because we're limited in the type of selectors we can use in JSDom (see related
    //  note related to `candidateSelectors`)
    isInert(node) || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
    isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
      return false;
    }
    return true;
  };
  var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
    if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
      return false;
    }
    return true;
  };
  var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
    var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
    if (isNaN(tabIndex) || tabIndex >= 0) {
      return true;
    }
    return false;
  };
  var sortByOrder = function sortByOrder2(candidates) {
    var regularTabbables = [];
    var orderedTabbables = [];
    candidates.forEach(function(item, i) {
      var isScope = !!item.scopeParent;
      var element = isScope ? item.scopeParent : item;
      var candidateTabindex = getSortOrderTabIndex(element, isScope);
      var elements = isScope ? sortByOrder2(item.candidates) : element;
      if (candidateTabindex === 0) {
        isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
      } else {
        orderedTabbables.push({
          documentOrder: i,
          tabIndex: candidateTabindex,
          item,
          isScope,
          content: elements
        });
      }
    });
    return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
      sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
      return acc;
    }, []).concat(regularTabbables);
  };
  var tabbable = function tabbable2(container, options) {
    options = options || {};
    var candidates;
    if (options.getShadowRoot) {
      candidates = getCandidatesIteratively([container], options.includeContainer, {
        filter: isNodeMatchingSelectorTabbable.bind(null, options),
        flatten: false,
        getShadowRoot: options.getShadowRoot,
        shadowRootFilter: isValidShadowRootTabbable
      });
    } else {
      candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
    }
    return sortByOrder(candidates);
  };
  var focusable = function focusable2(container, options) {
    options = options || {};
    var candidates;
    if (options.getShadowRoot) {
      candidates = getCandidatesIteratively([container], options.includeContainer, {
        filter: isNodeMatchingSelectorFocusable.bind(null, options),
        flatten: true,
        getShadowRoot: options.getShadowRoot
      });
    } else {
      candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
    }
    return candidates;
  };
  var isTabbable = function isTabbable2(node, options) {
    options = options || {};
    if (!node) {
      throw new Error("No node provided");
    }
    if (matches.call(node, candidateSelector) === false) {
      return false;
    }
    return isNodeMatchingSelectorTabbable(options, node);
  };
  var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
  var isFocusable = function isFocusable2(node, options) {
    options = options || {};
    if (!node) {
      throw new Error("No node provided");
    }
    if (matches.call(node, focusableCandidateSelector) === false) {
      return false;
    }
    return isNodeMatchingSelectorFocusable(options, node);
  };
  /*!
  * focus-trap 7.5.4
  * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
  */
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function(r2) {
        return Object.getOwnPropertyDescriptor(e, r2).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
        _defineProperty(e, r2, t[r2]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
        Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
      });
    }
    return e;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  var activeFocusTraps = {
    activateTrap: function activateTrap(trapStack, trap) {
      if (trapStack.length > 0) {
        var activeTrap = trapStack[trapStack.length - 1];
        if (activeTrap !== trap) {
          activeTrap.pause();
        }
      }
      var trapIndex = trapStack.indexOf(trap);
      if (trapIndex === -1) {
        trapStack.push(trap);
      } else {
        trapStack.splice(trapIndex, 1);
        trapStack.push(trap);
      }
    },
    deactivateTrap: function deactivateTrap(trapStack, trap) {
      var trapIndex = trapStack.indexOf(trap);
      if (trapIndex !== -1) {
        trapStack.splice(trapIndex, 1);
      }
      if (trapStack.length > 0) {
        trapStack[trapStack.length - 1].unpause();
      }
    }
  };
  var isSelectableInput = function isSelectableInput2(node) {
    return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
  };
  var isEscapeEvent = function isEscapeEvent2(e) {
    return (e === null || e === void 0 ? void 0 : e.key) === "Escape" || (e === null || e === void 0 ? void 0 : e.key) === "Esc" || (e === null || e === void 0 ? void 0 : e.keyCode) === 27;
  };
  var isTabEvent = function isTabEvent2(e) {
    return (e === null || e === void 0 ? void 0 : e.key) === "Tab" || (e === null || e === void 0 ? void 0 : e.keyCode) === 9;
  };
  var isKeyForward = function isKeyForward2(e) {
    return isTabEvent(e) && !e.shiftKey;
  };
  var isKeyBackward = function isKeyBackward2(e) {
    return isTabEvent(e) && e.shiftKey;
  };
  var delay$1 = function delay(fn) {
    return setTimeout(fn, 0);
  };
  var findIndex = function findIndex2(arr, fn) {
    var idx = -1;
    arr.every(function(value, i) {
      if (fn(value)) {
        idx = i;
        return false;
      }
      return true;
    });
    return idx;
  };
  var valueOrHandler = function valueOrHandler2(value) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    return typeof value === "function" ? value.apply(void 0, params) : value;
  };
  var getActualTarget = function getActualTarget2(event) {
    return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
  };
  var internalTrapStack = [];
  var createFocusTrap = function createFocusTrap2(elements, userOptions) {
    var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
    var trapStack = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.trapStack) || internalTrapStack;
    var config = _objectSpread2({
      returnFocusOnDeactivate: true,
      escapeDeactivates: true,
      delayInitialFocus: true,
      isKeyForward,
      isKeyBackward
    }, userOptions);
    var state = {
      // containers given to createFocusTrap()
      // @type {Array<HTMLElement>}
      containers: [],
      // list of objects identifying tabbable nodes in `containers` in the trap
      // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
      //  is active, but the trap should never get to a state where there isn't at least one group
      //  with at least one tabbable node in it (that would lead to an error condition that would
      //  result in an error being thrown)
      // @type {Array<{
      //   container: HTMLElement,
      //   tabbableNodes: Array<HTMLElement>, // empty if none
      //   focusableNodes: Array<HTMLElement>, // empty if none
      //   posTabIndexesFound: boolean,
      //   firstTabbableNode: HTMLElement|undefined,
      //   lastTabbableNode: HTMLElement|undefined,
      //   firstDomTabbableNode: HTMLElement|undefined,
      //   lastDomTabbableNode: HTMLElement|undefined,
      //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
      // }>}
      containerGroups: [],
      // same order/length as `containers` list
      // references to objects in `containerGroups`, but only those that actually have
      //  tabbable nodes in them
      // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
      //  the same length
      tabbableGroups: [],
      nodeFocusedBeforeActivation: null,
      mostRecentlyFocusedNode: null,
      active: false,
      paused: false,
      // timer ID for when delayInitialFocus is true and initial focus in this trap
      //  has been delayed during activation
      delayInitialFocusTimer: void 0,
      // the most recent KeyboardEvent for the configured nav key (typically [SHIFT+]TAB), if any
      recentNavEvent: void 0
    };
    var trap;
    var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
      return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
    };
    var findContainerIndex = function findContainerIndex2(element, event) {
      var composedPath = typeof (event === null || event === void 0 ? void 0 : event.composedPath) === "function" ? event.composedPath() : void 0;
      return state.containerGroups.findIndex(function(_ref) {
        var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
        return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
        //  web components if the `tabbableOptions.getShadowRoot` option was used for
        //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
        //  look inside web components even if open)
        (composedPath === null || composedPath === void 0 ? void 0 : composedPath.includes(container)) || tabbableNodes.find(function(node) {
          return node === element;
        });
      });
    };
    var getNodeForOption = function getNodeForOption2(optionName) {
      var optionValue = config[optionName];
      if (typeof optionValue === "function") {
        for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          params[_key2 - 1] = arguments[_key2];
        }
        optionValue = optionValue.apply(void 0, params);
      }
      if (optionValue === true) {
        optionValue = void 0;
      }
      if (!optionValue) {
        if (optionValue === void 0 || optionValue === false) {
          return optionValue;
        }
        throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
      }
      var node = optionValue;
      if (typeof optionValue === "string") {
        node = doc.querySelector(optionValue);
        if (!node) {
          throw new Error("`".concat(optionName, "` as selector refers to no known node"));
        }
      }
      return node;
    };
    var getInitialFocusNode = function getInitialFocusNode2() {
      var node = getNodeForOption("initialFocus");
      if (node === false) {
        return false;
      }
      if (node === void 0 || !isFocusable(node, config.tabbableOptions)) {
        if (findContainerIndex(doc.activeElement) >= 0) {
          node = doc.activeElement;
        } else {
          var firstTabbableGroup = state.tabbableGroups[0];
          var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
          node = firstTabbableNode || getNodeForOption("fallbackFocus");
        }
      }
      if (!node) {
        throw new Error("Your focus-trap needs to have at least one focusable element");
      }
      return node;
    };
    var updateTabbableNodes = function updateTabbableNodes2() {
      state.containerGroups = state.containers.map(function(container) {
        var tabbableNodes = tabbable(container, config.tabbableOptions);
        var focusableNodes = focusable(container, config.tabbableOptions);
        var firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : void 0;
        var lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : void 0;
        var firstDomTabbableNode = focusableNodes.find(function(node) {
          return isTabbable(node);
        });
        var lastDomTabbableNode = focusableNodes.slice().reverse().find(function(node) {
          return isTabbable(node);
        });
        var posTabIndexesFound = !!tabbableNodes.find(function(node) {
          return getTabIndex(node) > 0;
        });
        return {
          container,
          tabbableNodes,
          focusableNodes,
          /** True if at least one node with positive `tabindex` was found in this container. */
          posTabIndexesFound,
          /** First tabbable node in container, __tabindex__ order; `undefined` if none. */
          firstTabbableNode,
          /** Last tabbable node in container, __tabindex__ order; `undefined` if none. */
          lastTabbableNode,
          // NOTE: DOM order is NOT NECESSARILY "document position" order, but figuring that out
          //  would require more than just https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          //  because that API doesn't work with Shadow DOM as well as it should (@see
          //  https://github.com/whatwg/dom/issues/320) and since this first/last is only needed, so far,
          //  to address an edge case related to positive tabindex support, this seems like a much easier,
          //  "close enough most of the time" alternative for positive tabindexes which should generally
          //  be avoided anyway...
          /** First tabbable node in container, __DOM__ order; `undefined` if none. */
          firstDomTabbableNode,
          /** Last tabbable node in container, __DOM__ order; `undefined` if none. */
          lastDomTabbableNode,
          /**
           * Finds the __tabbable__ node that follows the given node in the specified direction,
           *  in this container, if any.
           * @param {HTMLElement} node
           * @param {boolean} [forward] True if going in forward tab order; false if going
           *  in reverse.
           * @returns {HTMLElement|undefined} The next tabbable node, if any.
           */
          nextTabbableNode: function nextTabbableNode(node) {
            var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
            var nodeIdx = tabbableNodes.indexOf(node);
            if (nodeIdx < 0) {
              if (forward) {
                return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(function(el) {
                  return isTabbable(el);
                });
              }
              return focusableNodes.slice(0, focusableNodes.indexOf(node)).reverse().find(function(el) {
                return isTabbable(el);
              });
            }
            return tabbableNodes[nodeIdx + (forward ? 1 : -1)];
          }
        };
      });
      state.tabbableGroups = state.containerGroups.filter(function(group) {
        return group.tabbableNodes.length > 0;
      });
      if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
        throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
      }
      if (state.containerGroups.find(function(g) {
        return g.posTabIndexesFound;
      }) && state.containerGroups.length > 1) {
        throw new Error("At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.");
      }
    };
    var getActiveElement = function getActiveElement2(el) {
      var activeElement = el.activeElement;
      if (!activeElement) {
        return;
      }
      if (activeElement.shadowRoot && activeElement.shadowRoot.activeElement !== null) {
        return getActiveElement2(activeElement.shadowRoot);
      }
      return activeElement;
    };
    var tryFocus = function tryFocus2(node) {
      if (node === false) {
        return;
      }
      if (node === getActiveElement(document)) {
        return;
      }
      if (!node || !node.focus) {
        tryFocus2(getInitialFocusNode());
        return;
      }
      node.focus({
        preventScroll: !!config.preventScroll
      });
      state.mostRecentlyFocusedNode = node;
      if (isSelectableInput(node)) {
        node.select();
      }
    };
    var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
      var node = getNodeForOption("setReturnFocus", previousActiveElement);
      return node ? node : node === false ? false : previousActiveElement;
    };
    var findNextNavNode = function findNextNavNode2(_ref2) {
      var target = _ref2.target, event = _ref2.event, _ref2$isBackward = _ref2.isBackward, isBackward = _ref2$isBackward === void 0 ? false : _ref2$isBackward;
      target = target || getActualTarget(event);
      updateTabbableNodes();
      var destinationNode = null;
      if (state.tabbableGroups.length > 0) {
        var containerIndex = findContainerIndex(target, event);
        var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
        if (containerIndex < 0) {
          if (isBackward) {
            destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
          } else {
            destinationNode = state.tabbableGroups[0].firstTabbableNode;
          }
        } else if (isBackward) {
          var startOfGroupIndex = findIndex(state.tabbableGroups, function(_ref3) {
            var firstTabbableNode = _ref3.firstTabbableNode;
            return target === firstTabbableNode;
          });
          if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
            startOfGroupIndex = containerIndex;
          }
          if (startOfGroupIndex >= 0) {
            var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
            var destinationGroup = state.tabbableGroups[destinationGroupIndex];
            destinationNode = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode;
          } else if (!isTabEvent(event)) {
            destinationNode = containerGroup.nextTabbableNode(target, false);
          }
        } else {
          var lastOfGroupIndex = findIndex(state.tabbableGroups, function(_ref4) {
            var lastTabbableNode = _ref4.lastTabbableNode;
            return target === lastTabbableNode;
          });
          if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
            lastOfGroupIndex = containerIndex;
          }
          if (lastOfGroupIndex >= 0) {
            var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
            var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
            destinationNode = getTabIndex(target) >= 0 ? _destinationGroup.firstTabbableNode : _destinationGroup.firstDomTabbableNode;
          } else if (!isTabEvent(event)) {
            destinationNode = containerGroup.nextTabbableNode(target);
          }
        }
      } else {
        destinationNode = getNodeForOption("fallbackFocus");
      }
      return destinationNode;
    };
    var checkPointerDown = function checkPointerDown2(e) {
      var target = getActualTarget(e);
      if (findContainerIndex(target, e) >= 0) {
        return;
      }
      if (valueOrHandler(config.clickOutsideDeactivates, e)) {
        trap.deactivate({
          // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
          //  which will result in the outside click setting focus to the node
          //  that was clicked (and if not focusable, to "nothing"); by setting
          //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
          //  on activation (or the configured `setReturnFocus` node), whether the
          //  outside click was on a focusable node or not
          returnFocus: config.returnFocusOnDeactivate
        });
        return;
      }
      if (valueOrHandler(config.allowOutsideClick, e)) {
        return;
      }
      e.preventDefault();
    };
    var checkFocusIn = function checkFocusIn2(event) {
      var target = getActualTarget(event);
      var targetContained = findContainerIndex(target, event) >= 0;
      if (targetContained || target instanceof Document) {
        if (targetContained) {
          state.mostRecentlyFocusedNode = target;
        }
      } else {
        event.stopImmediatePropagation();
        var nextNode;
        var navAcrossContainers = true;
        if (state.mostRecentlyFocusedNode) {
          if (getTabIndex(state.mostRecentlyFocusedNode) > 0) {
            var mruContainerIdx = findContainerIndex(state.mostRecentlyFocusedNode);
            var tabbableNodes = state.containerGroups[mruContainerIdx].tabbableNodes;
            if (tabbableNodes.length > 0) {
              var mruTabIdx = tabbableNodes.findIndex(function(node) {
                return node === state.mostRecentlyFocusedNode;
              });
              if (mruTabIdx >= 0) {
                if (config.isKeyForward(state.recentNavEvent)) {
                  if (mruTabIdx + 1 < tabbableNodes.length) {
                    nextNode = tabbableNodes[mruTabIdx + 1];
                    navAcrossContainers = false;
                  }
                } else {
                  if (mruTabIdx - 1 >= 0) {
                    nextNode = tabbableNodes[mruTabIdx - 1];
                    navAcrossContainers = false;
                  }
                }
              }
            }
          } else {
            if (!state.containerGroups.some(function(g) {
              return g.tabbableNodes.some(function(n) {
                return getTabIndex(n) > 0;
              });
            })) {
              navAcrossContainers = false;
            }
          }
        } else {
          navAcrossContainers = false;
        }
        if (navAcrossContainers) {
          nextNode = findNextNavNode({
            // move FROM the MRU node, not event-related node (which will be the node that is
            //  outside the trap causing the focus escape we're trying to fix)
            target: state.mostRecentlyFocusedNode,
            isBackward: config.isKeyBackward(state.recentNavEvent)
          });
        }
        if (nextNode) {
          tryFocus(nextNode);
        } else {
          tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
        }
      }
      state.recentNavEvent = void 0;
    };
    var checkKeyNav = function checkKeyNav2(event) {
      var isBackward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
      state.recentNavEvent = event;
      var destinationNode = findNextNavNode({
        event,
        isBackward
      });
      if (destinationNode) {
        if (isTabEvent(event)) {
          event.preventDefault();
        }
        tryFocus(destinationNode);
      }
    };
    var checkKey = function checkKey2(event) {
      if (isEscapeEvent(event) && valueOrHandler(config.escapeDeactivates, event) !== false) {
        event.preventDefault();
        trap.deactivate();
        return;
      }
      if (config.isKeyForward(event) || config.isKeyBackward(event)) {
        checkKeyNav(event, config.isKeyBackward(event));
      }
    };
    var checkClick = function checkClick2(e) {
      var target = getActualTarget(e);
      if (findContainerIndex(target, e) >= 0) {
        return;
      }
      if (valueOrHandler(config.clickOutsideDeactivates, e)) {
        return;
      }
      if (valueOrHandler(config.allowOutsideClick, e)) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    var addListeners = function addListeners2() {
      if (!state.active) {
        return;
      }
      activeFocusTraps.activateTrap(trapStack, trap);
      state.delayInitialFocusTimer = config.delayInitialFocus ? delay$1(function() {
        tryFocus(getInitialFocusNode());
      }) : tryFocus(getInitialFocusNode());
      doc.addEventListener("focusin", checkFocusIn, true);
      doc.addEventListener("mousedown", checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener("touchstart", checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener("click", checkClick, {
        capture: true,
        passive: false
      });
      doc.addEventListener("keydown", checkKey, {
        capture: true,
        passive: false
      });
      return trap;
    };
    var removeListeners = function removeListeners2() {
      if (!state.active) {
        return;
      }
      doc.removeEventListener("focusin", checkFocusIn, true);
      doc.removeEventListener("mousedown", checkPointerDown, true);
      doc.removeEventListener("touchstart", checkPointerDown, true);
      doc.removeEventListener("click", checkClick, true);
      doc.removeEventListener("keydown", checkKey, true);
      return trap;
    };
    var checkDomRemoval = function checkDomRemoval2(mutations) {
      var isFocusedNodeRemoved = mutations.some(function(mutation) {
        var removedNodes = Array.from(mutation.removedNodes);
        return removedNodes.some(function(node) {
          return node === state.mostRecentlyFocusedNode;
        });
      });
      if (isFocusedNodeRemoved) {
        tryFocus(getInitialFocusNode());
      }
    };
    var mutationObserver = typeof window !== "undefined" && "MutationObserver" in window ? new MutationObserver(checkDomRemoval) : void 0;
    var updateObservedNodes = function updateObservedNodes2() {
      if (!mutationObserver) {
        return;
      }
      mutationObserver.disconnect();
      if (state.active && !state.paused) {
        state.containers.map(function(container) {
          mutationObserver.observe(container, {
            subtree: true,
            childList: true
          });
        });
      }
    };
    trap = {
      get active() {
        return state.active;
      },
      get paused() {
        return state.paused;
      },
      activate: function activate(activateOptions) {
        if (state.active) {
          return this;
        }
        var onActivate = getOption(activateOptions, "onActivate");
        var onPostActivate = getOption(activateOptions, "onPostActivate");
        var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
        if (!checkCanFocusTrap) {
          updateTabbableNodes();
        }
        state.active = true;
        state.paused = false;
        state.nodeFocusedBeforeActivation = doc.activeElement;
        onActivate === null || onActivate === void 0 || onActivate();
        var finishActivation = function finishActivation2() {
          if (checkCanFocusTrap) {
            updateTabbableNodes();
          }
          addListeners();
          updateObservedNodes();
          onPostActivate === null || onPostActivate === void 0 || onPostActivate();
        };
        if (checkCanFocusTrap) {
          checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
          return this;
        }
        finishActivation();
        return this;
      },
      deactivate: function deactivate(deactivateOptions) {
        if (!state.active) {
          return this;
        }
        var options = _objectSpread2({
          onDeactivate: config.onDeactivate,
          onPostDeactivate: config.onPostDeactivate,
          checkCanReturnFocus: config.checkCanReturnFocus
        }, deactivateOptions);
        clearTimeout(state.delayInitialFocusTimer);
        state.delayInitialFocusTimer = void 0;
        removeListeners();
        state.active = false;
        state.paused = false;
        updateObservedNodes();
        activeFocusTraps.deactivateTrap(trapStack, trap);
        var onDeactivate = getOption(options, "onDeactivate");
        var onPostDeactivate = getOption(options, "onPostDeactivate");
        var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
        var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
        onDeactivate === null || onDeactivate === void 0 || onDeactivate();
        var finishDeactivation = function finishDeactivation2() {
          delay$1(function() {
            if (returnFocus) {
              tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
            }
            onPostDeactivate === null || onPostDeactivate === void 0 || onPostDeactivate();
          });
        };
        if (returnFocus && checkCanReturnFocus) {
          checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
          return this;
        }
        finishDeactivation();
        return this;
      },
      pause: function pause(pauseOptions) {
        if (state.paused || !state.active) {
          return this;
        }
        var onPause = getOption(pauseOptions, "onPause");
        var onPostPause = getOption(pauseOptions, "onPostPause");
        state.paused = true;
        onPause === null || onPause === void 0 || onPause();
        removeListeners();
        updateObservedNodes();
        onPostPause === null || onPostPause === void 0 || onPostPause();
        return this;
      },
      unpause: function unpause(unpauseOptions) {
        if (!state.paused || !state.active) {
          return this;
        }
        var onUnpause = getOption(unpauseOptions, "onUnpause");
        var onPostUnpause = getOption(unpauseOptions, "onPostUnpause");
        state.paused = false;
        onUnpause === null || onUnpause === void 0 || onUnpause();
        updateTabbableNodes();
        addListeners();
        updateObservedNodes();
        onPostUnpause === null || onPostUnpause === void 0 || onPostUnpause();
        return this;
      },
      updateContainerElements: function updateContainerElements(containerElements) {
        var elementsAsArray = [].concat(containerElements).filter(Boolean);
        state.containers = elementsAsArray.map(function(element) {
          return typeof element === "string" ? doc.querySelector(element) : element;
        });
        if (state.active) {
          updateTabbableNodes();
        }
        updateObservedNodes();
        return this;
      }
    };
    trap.updateContainerElements(elements);
    return trap;
  };
  function useFocusTrap(target, options = {}) {
    let trap;
    const { immediate, ...focusTrapOptions } = options;
    const hasFocus = vue.ref(false);
    const isPaused = vue.ref(false);
    const activate = (opts) => trap && trap.activate(opts);
    const deactivate = (opts) => trap && trap.deactivate(opts);
    const pause = () => {
      if (trap) {
        trap.pause();
        isPaused.value = true;
      }
    };
    const unpause = () => {
      if (trap) {
        trap.unpause();
        isPaused.value = false;
      }
    };
    vue.watch(
      () => unrefElement(target),
      (el) => {
        if (!el)
          return;
        trap = createFocusTrap(el, {
          ...focusTrapOptions,
          onActivate() {
            hasFocus.value = true;
            if (options.onActivate)
              options.onActivate();
          },
          onDeactivate() {
            hasFocus.value = false;
            if (options.onDeactivate)
              options.onDeactivate();
          }
        });
        if (immediate)
          activate();
      },
      { flush: "post" }
    );
    tryOnScopeDispose(() => deactivate());
    return {
      hasFocus,
      isPaused,
      activate,
      deactivate,
      pause,
      unpause
    };
  }
  const uo = (e) => (...o) => {
    e && (e == null || e(...o), e = null);
  }, q = () => {
  };
  function oe(e, o, l) {
    return e > l ? l : e < o ? o : e;
  }
  function fe(e, o) {
    var s;
    const l = ((s = $(e, o)) == null ? void 0 : s[0]) || o;
    e.push(l);
  }
  function $(e, o) {
    const l = e.indexOf(o);
    if (l !== -1)
      return e.splice(l, 1);
  }
  const co = {
    /**
     * @description Set `null | false` to disable teleport.
     * @default `'body'`
     * @example
     * ```js
     * teleportTo: '#modals'
     * ```
     */
    teleportTo: {
      type: [String, null, Boolean, Object],
      default: "body"
    },
    /**
     * @description An uniq name for the open/close a modal via vfm.open/vfm.close APIs.
     * @default `undefined`
     * @example Symbol: `Symbol('MyModal')`
     * @example String: `'AUniqString'`
     * @example Number: `300`
     */
    modalId: {
      type: [String, Number, Symbol],
      default: void 0
    },
    /**
     * @description Display the modal or not.
     * @default `undefined`
     * @example
     * ```js
     * const showModal = ref(false)
     * v-model="showModal"
     * ```
     */
    modelValue: {
      type: Boolean,
      default: void 0
    },
    /**
     * @description Render the modal via `if` or `show`.
     * @default `'if'`
     * @example
     * ```js
     * displayDirective: 'if'
     * ```
     * @example
     * ```js
     * displayDirective: 'show'
     * ```
     */
    displayDirective: {
      type: String,
      default: "if",
      validator: (e) => ["if", "show", "visible"].includes(e)
    },
    /**
     * @description Hide the overlay or not.
     * @default `undefined`
     * @example
     * ```js
     * hideOverlay="true"
     * ```
     */
    hideOverlay: {
      type: Boolean,
      default: void 0
    },
    /**
     * @description Customize the overlay behavior.
     */
    overlayBehavior: {
      type: String,
      default: "auto",
      validator: (e) => ["auto", "persist"].includes(e)
    },
    /**
     * @description Customize the overlay transition.
     * @default `undefined`
     */
    overlayTransition: {
      type: [String, Object],
      default: void 0
    },
    /**
     * @description Customize the content transition.
     * @default `undefined`
     */
    contentTransition: {
      type: [String, Object],
      default: void 0
    },
    /**
     * @description Bind class to vfm__overlay.
     * @default `undefined`
     */
    overlayClass: {
      type: void 0,
      default: void 0
    },
    /**
     * @description Bind class to vfm__content.
     * @default `undefined`
     */
    contentClass: {
      type: void 0,
      default: void 0
    },
    /**
     * @description Bind style to vfm__overlay.
     * @default `undefined`
     */
    overlayStyle: {
      type: [String, Object, Array],
      default: void 0
    },
    /**
     * @description Bind style to vfm__content.
     * @default `undefined`
     */
    contentStyle: {
      type: [String, Object, Array],
      default: void 0
    },
    /**
     * @description Is it allow to close the modal by clicking the overlay.
     * @default `true`
     */
    clickToClose: {
      type: Boolean,
      default: true
    },
    /**
     * @description Is it allow to close the modal by keypress `esc`.
     * @default `true`
     */
    escToClose: {
      type: Boolean,
      default: true
    },
    /**
     * @description Is it allow to click outside of the vfm__content when the modal is opened
     * @default `'non-interactive'`
     */
    background: {
      type: String,
      default: "non-interactive",
      validator: (e) => ["interactive", "non-interactive"].includes(e)
    },
    /**
     * @description
     * * Use `{ disabled: true }` to disable the focusTrap.
     * * Checkout the createOptions type here https://github.com/focus-trap/focus-trap for more.
     * @default `{ allowOutsideClick: true }`
     */
    focusTrap: {
      type: [Boolean, Object],
      default: () => ({
        allowOutsideClick: true
      })
    },
    /**
     * @description Lock body scroll or not when the modal is opened.
     * @default `true`
     */
    lockScroll: {
      type: Boolean,
      default: true
    },
    /**
     * @description Creates a padding-right when scroll is locked to prevent the page from jumping
     * @default `true`
     */
    reserveScrollBarGap: {
      type: Boolean,
      default: true
    },
    /**
     * @description Define how to increase the zIndex when there are nested modals
     * @default `({ index }) => 1000 + 2 * index`
     */
    zIndexFn: {
      type: Function,
      default: ({ index: e }) => 1e3 + 2 * e
    },
    /**
     * @description The direction of swiping to close the modal
     * @default `none`
     * @example
     * Set swipeToClose="none" to disable swiping to close
     * ```js
     * swipeToClose="none"
     * ```
     */
    swipeToClose: {
      type: String,
      default: "none",
      validator: (e) => ["none", "up", "right", "down", "left"].includes(e)
    },
    /**
     * @description Threshold for swipe to close
     * @default `0`
     */
    threshold: {
      type: Number,
      default: 0
    },
    /**
     * @description If set `:showSwipeBanner="true"`, only allow clicking `swipe-banner` slot to swipe to close
     * @default `undefined`
     * @example
     * ```js
     * swipeToClose="right"
     * :showSwipeBanner="true"
     * ```
     * ```html
     * <VueFinalModal
     *   ...
     *   swipeToClose="right"
     *   :showSwipeBanner="true"
     * >
     *   <template #swipe-banner>
     *     <div style="position: absolute; height: 100%; top: 0; left: 0; width: 10px;" />
     *   </template>
     *   ...modal content
     * </VueFinalModal>
     * ```
     */
    showSwipeBanner: {
      type: Boolean,
      default: void 0
    },
    /**
     * @description When set `:preventNavigationGestures="true"`, there will be two invisible bars for prevent navigation gestures including swiping back/forward on mobile webkit. For example: Safari mobile.
     * @default `undefined`
     * @example
     * Set preventNavigationGestures="true" to prevent Safari navigation gestures including swiping back/forward.
     * ```js
     * :preventNavigationGestures="true"
     * ```
     */
    preventNavigationGestures: {
      type: Boolean,
      default: void 0
    }
  };
  function Oe(e = false) {
    const o = vue.ref(e), l = vue.ref(o.value ? 0 : void 0);
    return [o, l, {
      beforeEnter() {
        l.value = 1;
      },
      afterEnter() {
        l.value = 0;
      },
      beforeLeave() {
        l.value = 3;
      },
      afterLeave() {
        l.value = 2;
      }
    }];
  }
  function fo(e, o) {
    const { modelValueLocal: l, onEntering: s, onEnter: u, onLeaving: c, onLeave: a } = o, n = vue.ref(l.value), [t, r, m] = Oe(n.value), [f, M, S] = Oe(n.value), V = vue.computed(() => typeof e.contentTransition == "string" ? { name: e.contentTransition, appear: true } : { appear: true, ...e.contentTransition }), O = vue.computed(() => typeof e.overlayTransition == "string" ? { name: e.overlayTransition, appear: true } : { appear: true, ...e.overlayTransition }), E = vue.computed(
      () => (e.hideOverlay || M.value === 2) && r.value === 2
      /* Leave */
    );
    vue.watch(
      E,
      (k) => {
        k && (n.value = false);
      }
    ), vue.watch(r, (k) => {
      if (k === 1) {
        if (!n.value)
          return;
        s == null || s();
      } else if (k === 0) {
        if (!n.value)
          return;
        u == null || u();
      } else
        k === 3 ? c == null || c() : k === 2 && (a == null || a());
    });
    async function w() {
      n.value = true, await vue.nextTick(), t.value = true, f.value = true;
    }
    function D() {
      t.value = false, f.value = false;
    }
    return {
      visible: n,
      contentVisible: t,
      contentListeners: m,
      contentTransition: V,
      overlayVisible: f,
      overlayListeners: S,
      overlayTransition: O,
      enterTransition: w,
      leaveTransition: D
    };
  }
  function vo(e, o, l) {
    const { vfmRootEl: s, vfmContentEl: u, visible: c, modelValueLocal: a } = l, n = vue.ref();
    function t() {
      c.value && e.escToClose && (a.value = false);
    }
    function r(f) {
      n.value = f == null ? void 0 : f.target;
    }
    function m() {
      var f;
      n.value === s.value && (e.clickToClose ? a.value = false : ((f = u.value) == null || f.focus(), o("clickOutside")));
    }
    return {
      onEsc: t,
      onMouseupRoot: m,
      onMousedown: r
    };
  }
  function po(e, o, l) {
    let s = false;
    const { open: u, close: c } = l, a = vue.ref(false), n = {
      get value() {
        return a.value;
      },
      set value(r) {
        t(r);
      }
    };
    function t(r) {
      (r ? u() : c()) ? (a.value = r, r !== e.modelValue && o("update:modelValue", r)) : (s = true, o("update:modelValue", !r), vue.nextTick(() => {
        s = false;
      }));
    }
    return vue.watch(() => e.modelValue, (r) => {
      s || (n.value = !!r);
    }), {
      modelValueLocal: n
    };
  }
  function yo(e, o) {
    if (e.focusTrap === false)
      return {
        focus() {
        },
        blur() {
        }
      };
    const { focusEl: l } = o, { hasFocus: s, activate: u, deactivate: c } = useFocusTrap(l, e.focusTrap);
    function a() {
      requestAnimationFrame(() => {
        u();
      });
    }
    function n() {
      s.value && c();
    }
    return { focus: a, blur: n };
  }
  let be = false;
  if (typeof window < "u") {
    const e = {
      get passive() {
        be = true;
      }
    };
    window.addEventListener("testPassive", null, e), window.removeEventListener("testPassive", null, e);
  }
  const He = typeof window < "u" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  let j = [], le = false, ne = 0, je = -1, W, X;
  const ho = (e) => {
    if (!e || e.nodeType !== Node.ELEMENT_NODE)
      return false;
    const o = window.getComputedStyle(e);
    return ["auto", "scroll"].includes(o.overflowY) && e.scrollHeight > e.clientHeight;
  }, mo = (e, o) => !(e.scrollTop === 0 && o < 0 || e.scrollTop + e.clientHeight + o >= e.scrollHeight && o > 0), wo = (e) => {
    const o = [];
    for (; e; ) {
      if (o.push(e), e.classList.contains("vfm"))
        return o;
      e = e.parentElement;
    }
    return o;
  }, bo = (e, o) => {
    let l = false;
    return wo(e).forEach((u) => {
      ho(u) && mo(u, o) && (l = true);
    }), l;
  }, Ne = (e) => j.some(() => bo(e, -ne)), se = (e) => {
    const o = e || window.event;
    return Ne(o.target) || o.touches.length > 1 ? true : (o.preventDefault && o.preventDefault(), false);
  }, To = (e) => {
    if (X === void 0) {
      const o = !!e && e.reserveScrollBarGap === true, l = window.innerWidth - document.documentElement.clientWidth;
      if (o && l > 0) {
        const s = parseInt(getComputedStyle(document.body).getPropertyValue("padding-right"), 10);
        X = document.body.style.paddingRight, document.body.style.paddingRight = `${s + l}px`;
      }
    }
    W === void 0 && (W = document.body.style.overflow, document.body.style.overflow = "hidden");
  }, So = () => {
    X !== void 0 && (document.body.style.paddingRight = X, X = void 0), W !== void 0 && (document.body.style.overflow = W, W = void 0);
  }, Mo = (e) => e ? e.scrollHeight - e.scrollTop <= e.clientHeight : false, go = (e, o) => (ne = e.targetTouches[0].clientY - je, Ne(e.target) ? false : o && o.scrollTop === 0 && ne > 0 || Mo(o) && ne < 0 ? se(e) : (e.stopPropagation(), true)), Co = (e, o) => {
    if (!e) {
      console.error(
        "disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices."
      );
      return;
    }
    if (j.some((s) => s.targetElement === e))
      return;
    const l = {
      targetElement: e,
      options: o || {}
    };
    j = [...j, l], He ? (e.ontouchstart = (s) => {
      s.targetTouches.length === 1 && (je = s.targetTouches[0].clientY);
    }, e.ontouchmove = (s) => {
      s.targetTouches.length === 1 && go(s, e);
    }, le || (document.addEventListener("touchmove", se, be ? { passive: false } : void 0), le = true)) : To(o);
  }, ko = (e) => {
    if (!e) {
      console.error(
        "enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices."
      );
      return;
    }
    j = j.filter((o) => o.targetElement !== e), He ? (e.ontouchstart = null, e.ontouchmove = null, le && j.length === 0 && (document.removeEventListener("touchmove", se, be ? { passive: false } : void 0), le = false)) : j.length || So();
  };
  function Vo(e, o) {
    const { lockScrollEl: l, modelValueLocal: s } = o;
    let u;
    vue.watch(l, (n) => {
      n && (u = n);
    }, { immediate: true }), vue.watch(() => e.lockScroll, (n) => {
      n ? a() : c();
    }), vue.onBeforeUnmount(() => {
      c();
    });
    function c() {
      u && ko(u);
    }
    function a() {
      s.value && e.lockScroll && u && Co(u, {
        reserveScrollBarGap: e.reserveScrollBarGap,
        allowTouchMove: (n) => {
          for (; n && n !== document.body; ) {
            if (n.getAttribute("vfm-scroll-lock-ignore") !== null)
              return true;
            n = n.parentElement;
          }
          return false;
        }
      });
    }
    return {
      enableBodyScroll: c,
      disableBodyScroll: a
    };
  }
  function Eo(e) {
    const o = vue.ref();
    function l(u) {
      var c;
      o.value = (c = e.zIndexFn) == null ? void 0 : c.call(e, { index: u <= -1 ? 0 : u });
    }
    function s() {
      o.value = void 0;
    }
    return {
      zIndex: o,
      refreshZIndex: l,
      resetZIndex: s
    };
  }
  const ve = {
    beforeMount(e, { value: o }, { transition: l }) {
      e._vov = e.style.visibility === "hidden" ? "" : e.style.visibility, l && o ? l.beforeEnter(e) : G(e, o);
    },
    mounted(e, { value: o }, { transition: l }) {
      l && o && l.enter(e);
    },
    updated(e, { value: o, oldValue: l }, { transition: s }) {
      !o != !l && (s ? o ? (s.beforeEnter(e), G(e, true), s.enter(e)) : s.leave(e, () => {
        G(e, false);
      }) : G(e, o));
    },
    beforeUnmount(e, { value: o }) {
      G(e, o);
    }
  };
  function G(e, o) {
    e.style.visibility = o ? e._vov : "hidden";
  }
  const De = (e) => {
    if (e instanceof MouseEvent) {
      const { clientX: o, clientY: l } = e;
      return { x: o, y: l };
    } else {
      const { clientX: o, clientY: l } = e.targetTouches[0];
      return { x: o, y: l };
    }
  };
  function Bo(e) {
    if (!e)
      return false;
    let o = false;
    const l = {
      get passive() {
        return o = true, false;
      }
    };
    return e.addEventListener("x", q, l), e.removeEventListener("x", q), o;
  }
  function Oo(e, {
    threshold: o = 0,
    onSwipeStart: l,
    onSwipe: s,
    onSwipeEnd: u,
    passive: c = true
  }) {
    const a = vue.reactive({ x: 0, y: 0 }), n = vue.reactive({ x: 0, y: 0 }), t = vue.computed(() => a.x - n.x), r = vue.computed(() => a.y - n.y), { max: m, abs: f } = Math, M = vue.computed(
      () => m(f(t.value), f(r.value)) >= o
    ), S = vue.ref(false), V = vue.computed(() => M.value ? f(t.value) > f(r.value) ? t.value > 0 ? "left" : "right" : r.value > 0 ? "up" : "down" : "none"), O = (p, h) => {
      a.x = p, a.y = h;
    }, E = (p, h) => {
      n.x = p, n.y = h;
    };
    let w, D;
    function k(p) {
      w.capture && !w.passive && p.preventDefault();
      const { x: h, y: R } = De(p);
      O(h, R), E(h, R), l == null || l(p), D = [
        useEventListener(e, "mousemove", P, w),
        useEventListener(e, "touchmove", P, w),
        useEventListener(e, "mouseup", i, w),
        useEventListener(e, "touchend", i, w),
        useEventListener(e, "touchcancel", i, w)
      ];
    }
    function P(p) {
      const { x: h, y: R } = De(p);
      E(h, R), !S.value && M.value && (S.value = true), S.value && (s == null || s(p));
    }
    function i(p) {
      S.value && (u == null || u(p, V.value)), S.value = false, D.forEach((h) => h());
    }
    let b = [];
    return vue.onMounted(() => {
      const p = Bo(window == null ? void 0 : window.document);
      c ? w = p ? { passive: true } : { capture: false } : w = p ? { passive: false, capture: true } : { capture: true }, b = [
        useEventListener(e, "mousedown", k, w),
        useEventListener(e, "touchstart", k, w)
      ];
    }), {
      isSwiping: S,
      direction: V,
      coordsStart: a,
      coordsEnd: n,
      lengthX: t,
      lengthY: r,
      stop: () => {
        b.forEach((p) => p()), D.forEach((p) => p());
      }
    };
  }
  function Do(e, o) {
    const { vfmContentEl: l, modelValueLocal: s } = o, u = 0.1, c = 300, a = vue.ref(), n = vue.computed(() => {
      if (!(e.swipeToClose === void 0 || e.swipeToClose === "none"))
        return e.showSwipeBanner ? a.value : l.value;
    }), t = vue.ref(0), r = vue.ref(true);
    let m = q, f = true, M, S = false;
    const { lengthX: V, lengthY: O, direction: E, isSwiping: w } = Oo(n, {
      threshold: e.threshold,
      onSwipeStart(i) {
        m = useEventListener(document, "selectionchange", () => {
          var b;
          r.value = (b = window.getSelection()) == null ? void 0 : b.isCollapsed;
        }), M = (/* @__PURE__ */ new Date()).getTime(), S = P(i == null ? void 0 : i.target);
      },
      onSwipe() {
        var i, b, L, p;
        if (S && r.value && E.value === e.swipeToClose) {
          if (E.value === "up") {
            const h = oe(Math.abs(O.value || 0), 0, ((i = n.value) == null ? void 0 : i.offsetHeight) || 0) - (e.threshold || 0);
            t.value = h;
          } else if (E.value === "down") {
            const h = oe(Math.abs(O.value || 0), 0, ((b = n.value) == null ? void 0 : b.offsetHeight) || 0) - (e.threshold || 0);
            t.value = -h;
          } else if (E.value === "right") {
            const h = oe(Math.abs(V.value || 0), 0, ((L = n.value) == null ? void 0 : L.offsetWidth) || 0) - (e.threshold || 0);
            t.value = -h;
          } else if (E.value === "left") {
            const h = oe(Math.abs(V.value || 0), 0, ((p = n.value) == null ? void 0 : p.offsetWidth) || 0) - (e.threshold || 0);
            t.value = h;
          }
        }
      },
      onSwipeEnd(i, b) {
        if (m(), !r.value) {
          r.value = true;
          return;
        }
        const L = (/* @__PURE__ */ new Date()).getTime(), p = b === e.swipeToClose, h = (() => {
          var J, Q;
          if (b === "up" || b === "down")
            return Math.abs((O == null ? void 0 : O.value) || 0) > u * (((J = n.value) == null ? void 0 : J.offsetHeight) || 0);
          if (b === "left" || b === "right")
            return Math.abs((V == null ? void 0 : V.value) || 0) > u * (((Q = n.value) == null ? void 0 : Q.offsetWidth) || 0);
        })(), R = L - M <= c;
        if (f && S && p && (h || R)) {
          s.value = false;
          return;
        }
        t.value = 0;
      }
    }), D = vue.computed(() => {
      if (e.swipeToClose === "none")
        return;
      const i = (() => {
        switch (e.swipeToClose) {
          case "up":
          case "down":
            return "translateY";
          case "left":
          case "right":
            return "translateX";
        }
      })();
      return {
        class: { "vfm-bounce-back": !w.value },
        style: { transform: `${i}(${-t.value}px)` }
      };
    });
    vue.watch(
      () => r.value,
      (i) => {
        i || (t.value = 0);
      }
    ), vue.watch(
      () => s.value,
      (i) => {
        i && (t.value = 0);
      }
    ), vue.watch(
      () => t.value,
      (i, b) => {
        switch (e.swipeToClose) {
          case "down":
          case "right":
            f = i < b;
            break;
          case "up":
          case "left":
            f = i > b;
            break;
        }
      }
    );
    function k(i) {
      e.preventNavigationGestures && i.preventDefault();
    }
    function P(i) {
      const b = i == null ? void 0 : i.tagName;
      if (!b || ["INPUT", "TEXTAREA"].includes(b))
        return false;
      const L = (() => {
        switch (e.swipeToClose) {
          case "up":
            return (i == null ? void 0 : i.scrollTop) + (i == null ? void 0 : i.clientHeight) === (i == null ? void 0 : i.scrollHeight);
          case "left":
            return (i == null ? void 0 : i.scrollLeft) + (i == null ? void 0 : i.clientWidth) === (i == null ? void 0 : i.scrollWidth);
          case "down":
            return (i == null ? void 0 : i.scrollTop) === 0;
          case "right":
            return (i == null ? void 0 : i.scrollLeft) === 0;
          default:
            return false;
        }
      })();
      return i === n.value ? L : L && P(i == null ? void 0 : i.parentElement);
    }
    return {
      vfmContentEl: l,
      swipeBannerEl: a,
      bindSwipe: D,
      onTouchStartSwipeBanner: k
    };
  }
  const Ye = Symbol("vfm");
  let H;
  const Lo = (e) => H = e, Po = {
    install: q,
    modals: [],
    openedModals: [],
    openedModalOverlays: [],
    dynamicModals: [],
    modalsContainers: vue.ref([]),
    get: () => {
    },
    toggle: () => {
    },
    open: () => {
    },
    close: () => {
    },
    closeAll: () => Promise.allSettled([])
  }, Ao = () => vue.getCurrentInstance() && vue.inject(Ye, Po) || H;
  function zo() {
    const e = vue.shallowReactive([]), o = vue.shallowReactive([]), l = vue.shallowReactive([]), s = vue.shallowReactive([]), u = vue.ref([]), c = vue.markRaw({
      install(a) {
        a.provide(Ye, c), a.config.globalProperties.$vfm = c;
      },
      modals: e,
      openedModals: o,
      openedModalOverlays: l,
      dynamicModals: s,
      modalsContainers: u,
      get(a) {
        return e.find((n) => {
          var t, r;
          return ((r = (t = Z(n)) == null ? void 0 : t.value.modalId) == null ? void 0 : r.value) === a;
        });
      },
      toggle(a, n) {
        var r;
        const t = c.get(a);
        return (r = Z(t)) == null ? void 0 : r.value.toggle(n);
      },
      open(a) {
        return c.toggle(a, true);
      },
      close(a) {
        return c.toggle(a, false);
      },
      closeAll() {
        return Promise.allSettled(
          o.reduce((a, n) => {
            const t = Z(n), r = t == null ? void 0 : t.value.toggle(false);
            return r && a.push(r), a;
          }, [])
        );
      }
    });
    return Lo(c), c;
  }
  function Z(e) {
    var o;
    return (o = e == null ? void 0 : e.exposed) == null ? void 0 : o.modalExposed;
  }
  const Io = vue.defineComponent({ inheritAttrs: false }), Ro = /* @__PURE__ */ vue.defineComponent({
    ...Io,
    __name: "VueFinalModal",
    props: co,
    emits: ["update:modelValue", "beforeOpen", "opened", "beforeClose", "closed", "clickOutside"],
    setup(e, { expose: o, emit: l }) {
      const s = e, u = l, c = vue.useAttrs(), a = vue.getCurrentInstance(), { modals: n, openedModals: t, openedModalOverlays: r } = K(), m = vue.ref(), f = vue.ref(), { focus: M, blur: S } = yo(s, { focusEl: m }), { zIndex: V, refreshZIndex: O, resetZIndex: E } = Eo(s), { modelValueLocal: w } = po(s, u, { open: We, close: Xe }), { enableBodyScroll: D, disableBodyScroll: k } = Vo(s, {
        lockScrollEl: m,
        modelValueLocal: w
      });
      let P = q;
      const {
        visible: i,
        contentVisible: b,
        contentListeners: L,
        contentTransition: p,
        overlayVisible: h,
        overlayListeners: R,
        overlayTransition: J,
        enterTransition: Q,
        leaveTransition: xe
      } = fo(s, {
        modelValueLocal: w,
        onEntering() {
          vue.nextTick(() => {
            k(), M();
          });
        },
        onEnter() {
          u("opened"), P("opened");
        },
        onLeave() {
          $(t, a), E(), D(), u("closed"), P("closed");
        }
      }), { onEsc: ze, onMouseupRoot: Ge, onMousedown: Te } = vo(s, u, { vfmRootEl: m, vfmContentEl: f, visible: i, modelValueLocal: w }), {
        swipeBannerEl: $e,
        bindSwipe: Ue,
        onTouchStartSwipeBanner: Se
      } = Do(s, { vfmContentEl: f, modelValueLocal: w }), Me = vue.computed(() => a ? t.indexOf(a) : -1);
      vue.watch([() => s.zIndexFn, Me], () => {
        i.value && O(Me.value);
      }), vue.onMounted(() => {
        fe(n, a);
      }), s.modelValue && (w.value = true);
      function We() {
        let d = false;
        return u("beforeOpen", { stop: () => d = true }), d ? false : (fe(t, a), fe(r, a), ie(), Q(), true);
      }
      function Xe() {
        let d = false;
        return u("beforeClose", { stop: () => d = true }), d ? false : ($(r, a), ie(), S(), xe(), true);
      }
      function Ze() {
        w.value = false;
      }
      vue.onBeforeUnmount(() => {
        D(), $(n, a), $(t, a), S(), ie();
      });
      async function ie() {
        await vue.nextTick();
        const d = r.filter((y) => {
          var A;
          const T = Z(y);
          return (T == null ? void 0 : T.value.overlayBehavior.value) === "auto" && !((A = T == null ? void 0 : T.value.hideOverlay) != null && A.value);
        });
        d.forEach((y, T) => {
          const A = Z(y);
          A != null && A.value && (A.value.overlayVisible.value = T === d.length - 1);
        });
      }
      const Ke = vue.toRef(() => s.modalId), ge = vue.toRef(() => s.hideOverlay), qe = vue.toRef(() => s.overlayBehavior), Je = vue.computed(() => ({
        modalId: Ke,
        hideOverlay: ge,
        overlayBehavior: qe,
        overlayVisible: h,
        toggle(d) {
          return new Promise((y) => {
            P = uo((A) => y(A));
            const T = typeof d == "boolean" ? d : !w.value;
            w.value = T;
          });
        }
      }));
      return o({
        modalExposed: Je
      }), (d, y) => (vue.openBlock(), vue.createBlock(vue.Teleport, {
        to: d.teleportTo ? d.teleportTo : void 0,
        disabled: !d.teleportTo
      }, [
        d.displayDirective !== "if" || vue.unref(i) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ key: 0 }, vue.unref(c), {
          ref_key: "vfmRootEl",
          ref: m,
          class: ["vfm vfm--fixed vfm--inset", { "vfm--prevent-none": d.background === "interactive" }],
          style: { zIndex: vue.unref(V) },
          role: "dialog",
          "aria-modal": "true",
          onKeydown: y[7] || (y[7] = vue.withKeys(() => vue.unref(ze)(), ["esc"])),
          onMouseup: y[8] || (y[8] = vue.withModifiers(() => vue.unref(Ge)(), ["self"])),
          onMousedown: y[9] || (y[9] = vue.withModifiers((T) => vue.unref(Te)(T), ["self"]))
        }), [
          ge.value ? vue.createCommentVNode("", true) : (vue.openBlock(), vue.createBlock(vue.Transition, vue.mergeProps({ key: 0 }, vue.unref(J), vue.toHandlers(vue.unref(R))), {
            default: vue.withCtx(() => [
              d.displayDirective !== "if" || vue.unref(h) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(["vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none", d.overlayClass]),
                style: vue.normalizeStyle(d.overlayStyle),
                "aria-hidden": "true"
              }, null, 6)), [
                [vue.vShow, d.displayDirective !== "show" || vue.unref(h)],
                [vue.unref(ve), d.displayDirective !== "visible" || vue.unref(h)]
              ]) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }, 16)),
          vue.createVNode(vue.Transition, vue.mergeProps(vue.unref(p), vue.toHandlers(vue.unref(L))), {
            default: vue.withCtx(() => [
              d.displayDirective !== "if" || vue.unref(b) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
                key: 0,
                ref_key: "vfmContentEl",
                ref: f,
                class: ["vfm__content vfm--outline-none", [d.contentClass, { "vfm--prevent-auto": d.background === "interactive" }]],
                style: d.contentStyle,
                tabindex: "0"
              }, vue.unref(Ue), {
                onMousedown: y[6] || (y[6] = () => vue.unref(Te)())
              }), [
                vue.renderSlot(d.$slots, "default", vue.normalizeProps(vue.guardReactiveProps({ close: Ze }))),
                d.showSwipeBanner ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 0,
                  ref_key: "swipeBannerEl",
                  ref: $e,
                  class: "vfm-swipe-banner-container",
                  onTouchstart: y[2] || (y[2] = (T) => vue.unref(Se)(T))
                }, [
                  vue.renderSlot(d.$slots, "swipe-banner", {}, () => [
                    vue.createElementVNode("div", {
                      class: "vfm-swipe-banner-back",
                      onTouchstart: y[0] || (y[0] = (T) => d.swipeToClose === "left" && T.preventDefault())
                    }, null, 32),
                    vue.createElementVNode("div", {
                      class: "vfm-swipe-banner-forward",
                      onTouchstart: y[1] || (y[1] = (T) => d.swipeToClose === "right" && T.preventDefault())
                    }, null, 32)
                  ])
                ], 544)) : !d.showSwipeBanner && d.preventNavigationGestures ? (vue.openBlock(), vue.createElementBlock("div", {
                  key: 1,
                  class: "vfm-swipe-banner-container",
                  onTouchstart: y[5] || (y[5] = (T) => vue.unref(Se)(T))
                }, [
                  vue.createElementVNode("div", {
                    class: "vfm-swipe-banner-back",
                    onTouchstart: y[3] || (y[3] = (T) => d.swipeToClose === "left" && T.preventDefault())
                  }, null, 32),
                  vue.createElementVNode("div", {
                    class: "vfm-swipe-banner-forward",
                    onTouchstart: y[4] || (y[4] = (T) => d.swipeToClose === "right" && T.preventDefault())
                  }, null, 32)
                ], 32)) : vue.createCommentVNode("", true)
              ], 16)), [
                [vue.vShow, d.displayDirective !== "show" || vue.unref(b)],
                [vue.unref(ve), d.displayDirective !== "visible" || vue.unref(b)]
              ]) : vue.createCommentVNode("", true)
            ]),
            _: 3
          }, 16)
        ], 16)), [
          [vue.vShow, d.displayDirective !== "show" || vue.unref(i)],
          [vue.unref(ve), d.displayDirective !== "visible" || vue.unref(i)]
        ]) : vue.createCommentVNode("", true)
      ], 8, ["to", "disabled"]));
    }
  });
  function K() {
    const e = Ao();
    if (!e)
      throw new Error(
        `[Vue Final Modal]: getActiveVfm was called with no active Vfm. Did you forget to install vfm?
	const vfm = createVfm()
	app.use(vfm)
This will fail in production.`
      );
    return e;
  }
  var __defProp2 = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      }
    return a;
  };
  var isFunction = (value) => typeof value === "function";
  var isString = (value) => typeof value === "string";
  var isNonEmptyString = (value) => isString(value) && value.trim().length > 0;
  var isNumber = (value) => typeof value === "number";
  var isUndefined = (value) => typeof value === "undefined";
  var isObject$1 = (value) => typeof value === "object" && value !== null;
  var isJSX = (obj) => hasProp(obj, "tag") && isNonEmptyString(obj.tag);
  var isTouchEvent = (event) => window.TouchEvent && event instanceof TouchEvent;
  var isToastComponent = (obj) => hasProp(obj, "component") && isToastContent(obj.component);
  var isVueComponent = (c) => isFunction(c) || isObject$1(c);
  var isToastContent = (obj) => !isUndefined(obj) && (isString(obj) || isVueComponent(obj) || isToastComponent(obj));
  var isDOMRect = (obj) => isObject$1(obj) && ["height", "width", "right", "left", "top", "bottom"].every((p) => isNumber(obj[p]));
  var hasProp = (obj, propKey) => (isObject$1(obj) || isFunction(obj)) && propKey in obj;
  var getId = /* @__PURE__ */ ((i) => () => i++)(0);
  function getX(event) {
    return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX;
  }
  function getY(event) {
    return isTouchEvent(event) ? event.targetTouches[0].clientY : event.clientY;
  }
  var removeElement = (el) => {
    if (!isUndefined(el.remove)) {
      el.remove();
    } else if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  };
  var getVueComponentFromObj = (obj) => {
    if (isToastComponent(obj)) {
      return getVueComponentFromObj(obj.component);
    }
    if (isJSX(obj)) {
      return vue.defineComponent({
        render() {
          return obj;
        }
      });
    }
    return typeof obj === "string" ? obj : vue.toRaw(vue.unref(obj));
  };
  var normalizeToastComponent = (obj) => {
    if (typeof obj === "string") {
      return obj;
    }
    const props = hasProp(obj, "props") && isObject$1(obj.props) ? obj.props : {};
    const listeners = hasProp(obj, "listeners") && isObject$1(obj.listeners) ? obj.listeners : {};
    return { component: getVueComponentFromObj(obj), props, listeners };
  };
  var isBrowser = () => typeof window !== "undefined";
  var EventBus = class {
    constructor() {
      this.allHandlers = {};
    }
    getHandlers(eventType) {
      return this.allHandlers[eventType] || [];
    }
    on(eventType, handler) {
      const handlers2 = this.getHandlers(eventType);
      handlers2.push(handler);
      this.allHandlers[eventType] = handlers2;
    }
    off(eventType, handler) {
      const handlers2 = this.getHandlers(eventType);
      handlers2.splice(handlers2.indexOf(handler) >>> 0, 1);
    }
    emit(eventType, event) {
      const handlers2 = this.getHandlers(eventType);
      handlers2.forEach((handler) => handler(event));
    }
  };
  var isEventBusInterface = (e) => ["on", "off", "emit"].every((f) => hasProp(e, f) && isFunction(e[f]));
  var TYPE;
  (function(TYPE2) {
    TYPE2["SUCCESS"] = "success";
    TYPE2["ERROR"] = "error";
    TYPE2["WARNING"] = "warning";
    TYPE2["INFO"] = "info";
    TYPE2["DEFAULT"] = "default";
  })(TYPE || (TYPE = {}));
  var POSITION;
  (function(POSITION2) {
    POSITION2["TOP_LEFT"] = "top-left";
    POSITION2["TOP_CENTER"] = "top-center";
    POSITION2["TOP_RIGHT"] = "top-right";
    POSITION2["BOTTOM_LEFT"] = "bottom-left";
    POSITION2["BOTTOM_CENTER"] = "bottom-center";
    POSITION2["BOTTOM_RIGHT"] = "bottom-right";
  })(POSITION || (POSITION = {}));
  var EVENTS;
  (function(EVENTS2) {
    EVENTS2["ADD"] = "add";
    EVENTS2["DISMISS"] = "dismiss";
    EVENTS2["UPDATE"] = "update";
    EVENTS2["CLEAR"] = "clear";
    EVENTS2["UPDATE_DEFAULTS"] = "update_defaults";
  })(EVENTS || (EVENTS = {}));
  var VT_NAMESPACE = "Vue-Toastification";
  var COMMON = {
    type: {
      type: String,
      default: TYPE.DEFAULT
    },
    classNames: {
      type: [String, Array],
      default: () => []
    },
    trueBoolean: {
      type: Boolean,
      default: true
    }
  };
  var ICON = {
    type: COMMON.type,
    customIcon: {
      type: [String, Boolean, Object, Function],
      default: true
    }
  };
  var CLOSE_BUTTON = {
    component: {
      type: [String, Object, Function, Boolean],
      default: "button"
    },
    classNames: COMMON.classNames,
    showOnHover: {
      type: Boolean,
      default: false
    },
    ariaLabel: {
      type: String,
      default: "close"
    }
  };
  var PROGRESS_BAR = {
    timeout: {
      type: [Number, Boolean],
      default: 5e3
    },
    hideProgressBar: {
      type: Boolean,
      default: false
    },
    isRunning: {
      type: Boolean,
      default: false
    }
  };
  var TRANSITION = {
    transition: {
      type: [Object, String],
      default: `${VT_NAMESPACE}__bounce`
    }
  };
  var CORE_TOAST = {
    position: {
      type: String,
      default: POSITION.TOP_RIGHT
    },
    draggable: COMMON.trueBoolean,
    draggablePercent: {
      type: Number,
      default: 0.6
    },
    pauseOnFocusLoss: COMMON.trueBoolean,
    pauseOnHover: COMMON.trueBoolean,
    closeOnClick: COMMON.trueBoolean,
    timeout: PROGRESS_BAR.timeout,
    hideProgressBar: PROGRESS_BAR.hideProgressBar,
    toastClassName: COMMON.classNames,
    bodyClassName: COMMON.classNames,
    icon: ICON.customIcon,
    closeButton: CLOSE_BUTTON.component,
    closeButtonClassName: CLOSE_BUTTON.classNames,
    showCloseButtonOnHover: CLOSE_BUTTON.showOnHover,
    accessibility: {
      type: Object,
      default: () => ({
        toastRole: "alert",
        closeButtonLabel: "close"
      })
    },
    rtl: {
      type: Boolean,
      default: false
    },
    eventBus: {
      type: Object,
      required: false,
      default: () => new EventBus()
    }
  };
  var TOAST = {
    id: {
      type: [String, Number],
      required: true,
      default: 0
    },
    type: COMMON.type,
    content: {
      type: [String, Object, Function],
      required: true,
      default: ""
    },
    onClick: {
      type: Function,
      default: void 0
    },
    onClose: {
      type: Function,
      default: void 0
    }
  };
  var CONTAINER = {
    container: {
      type: [
        Object,
        Function
      ],
      default: () => document.body
    },
    newestOnTop: COMMON.trueBoolean,
    maxToasts: {
      type: Number,
      default: 20
    },
    transition: TRANSITION.transition,
    toastDefaults: Object,
    filterBeforeCreate: {
      type: Function,
      default: (toast2) => toast2
    },
    filterToasts: {
      type: Function,
      default: (toasts) => toasts
    },
    containerClassName: COMMON.classNames,
    onMounted: Function,
    shareAppContext: [Boolean, Object]
  };
  var propValidators_default = {
    CORE_TOAST,
    TOAST,
    CONTAINER,
    PROGRESS_BAR,
    ICON,
    TRANSITION,
    CLOSE_BUTTON
  };
  var VtProgressBar_default = vue.defineComponent({
    name: "VtProgressBar",
    props: propValidators_default.PROGRESS_BAR,
    data() {
      return {
        hasClass: true
      };
    },
    computed: {
      style() {
        return {
          animationDuration: `${this.timeout}ms`,
          animationPlayState: this.isRunning ? "running" : "paused",
          opacity: this.hideProgressBar ? 0 : 1
        };
      },
      cpClass() {
        return this.hasClass ? `${VT_NAMESPACE}__progress-bar` : "";
      }
    },
    watch: {
      timeout() {
        this.hasClass = false;
        this.$nextTick(() => this.hasClass = true);
      }
    },
    mounted() {
      this.$el.addEventListener("animationend", this.animationEnded);
    },
    beforeUnmount() {
      this.$el.removeEventListener("animationend", this.animationEnded);
    },
    methods: {
      animationEnded() {
        this.$emit("close-toast");
      }
    }
  });
  function render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", {
      style: vue.normalizeStyle(_ctx.style),
      class: vue.normalizeClass(_ctx.cpClass)
    }, null, 6);
  }
  VtProgressBar_default.render = render;
  var VtProgressBar_default2 = VtProgressBar_default;
  var VtCloseButton_default = vue.defineComponent({
    name: "VtCloseButton",
    props: propValidators_default.CLOSE_BUTTON,
    computed: {
      buttonComponent() {
        if (this.component !== false) {
          return getVueComponentFromObj(this.component);
        }
        return "button";
      },
      classes() {
        const classes = [`${VT_NAMESPACE}__close-button`];
        if (this.showOnHover) {
          classes.push("show-on-hover");
        }
        return classes.concat(this.classNames);
      }
    }
  });
  var _hoisted_1$8 = /* @__PURE__ */ vue.createTextVNode(" × ");
  function render2(_ctx, _cache) {
    return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.buttonComponent), vue.mergeProps({
      "aria-label": _ctx.ariaLabel,
      class: _ctx.classes
    }, _ctx.$attrs), {
      default: vue.withCtx(() => [
        _hoisted_1$8
      ]),
      _: 1
    }, 16, ["aria-label", "class"]);
  }
  VtCloseButton_default.render = render2;
  var VtCloseButton_default2 = VtCloseButton_default;
  var VtSuccessIcon_default = {};
  var _hoisted_12$1 = {
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "check-circle",
    class: "svg-inline--fa fa-check-circle fa-w-16",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  };
  var _hoisted_2$4 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
  }, null, -1);
  var _hoisted_3$3 = [
    _hoisted_2$4
  ];
  function render3(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_12$1, _hoisted_3$3);
  }
  VtSuccessIcon_default.render = render3;
  var VtSuccessIcon_default2 = VtSuccessIcon_default;
  var VtInfoIcon_default = {};
  var _hoisted_13$1 = {
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "info-circle",
    class: "svg-inline--fa fa-info-circle fa-w-16",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  };
  var _hoisted_22$1 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
  }, null, -1);
  var _hoisted_32$1 = [
    _hoisted_22$1
  ];
  function render4(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_13$1, _hoisted_32$1);
  }
  VtInfoIcon_default.render = render4;
  var VtInfoIcon_default2 = VtInfoIcon_default;
  var VtWarningIcon_default = {};
  var _hoisted_14$1 = {
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "exclamation-circle",
    class: "svg-inline--fa fa-exclamation-circle fa-w-16",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512"
  };
  var _hoisted_23$1 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
  }, null, -1);
  var _hoisted_33$1 = [
    _hoisted_23$1
  ];
  function render5(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_14$1, _hoisted_33$1);
  }
  VtWarningIcon_default.render = render5;
  var VtWarningIcon_default2 = VtWarningIcon_default;
  var VtErrorIcon_default = {};
  var _hoisted_15$1 = {
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "exclamation-triangle",
    class: "svg-inline--fa fa-exclamation-triangle fa-w-18",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 576 512"
  };
  var _hoisted_24$1 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
  }, null, -1);
  var _hoisted_34$1 = [
    _hoisted_24$1
  ];
  function render6(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_15$1, _hoisted_34$1);
  }
  VtErrorIcon_default.render = render6;
  var VtErrorIcon_default2 = VtErrorIcon_default;
  var VtIcon_default = vue.defineComponent({
    name: "VtIcon",
    props: propValidators_default.ICON,
    computed: {
      customIconChildren() {
        return hasProp(this.customIcon, "iconChildren") ? this.trimValue(this.customIcon.iconChildren) : "";
      },
      customIconClass() {
        if (isString(this.customIcon)) {
          return this.trimValue(this.customIcon);
        } else if (hasProp(this.customIcon, "iconClass")) {
          return this.trimValue(this.customIcon.iconClass);
        }
        return "";
      },
      customIconTag() {
        if (hasProp(this.customIcon, "iconTag")) {
          return this.trimValue(this.customIcon.iconTag, "i");
        }
        return "i";
      },
      hasCustomIcon() {
        return this.customIconClass.length > 0;
      },
      component() {
        if (this.hasCustomIcon) {
          return this.customIconTag;
        }
        if (isToastContent(this.customIcon)) {
          return getVueComponentFromObj(this.customIcon);
        }
        return this.iconTypeComponent;
      },
      iconTypeComponent() {
        const types = {
          [TYPE.DEFAULT]: VtInfoIcon_default2,
          [TYPE.INFO]: VtInfoIcon_default2,
          [TYPE.SUCCESS]: VtSuccessIcon_default2,
          [TYPE.ERROR]: VtErrorIcon_default2,
          [TYPE.WARNING]: VtWarningIcon_default2
        };
        return types[this.type];
      },
      iconClasses() {
        const classes = [`${VT_NAMESPACE}__icon`];
        if (this.hasCustomIcon) {
          return classes.concat(this.customIconClass);
        }
        return classes;
      }
    },
    methods: {
      trimValue(value, empty = "") {
        return isNonEmptyString(value) ? value.trim() : empty;
      }
    }
  });
  function render7(_ctx, _cache) {
    return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.component), {
      class: vue.normalizeClass(_ctx.iconClasses)
    }, {
      default: vue.withCtx(() => [
        vue.createTextVNode(vue.toDisplayString(_ctx.customIconChildren), 1)
      ]),
      _: 1
    }, 8, ["class"]);
  }
  VtIcon_default.render = render7;
  var VtIcon_default2 = VtIcon_default;
  var VtToast_default = vue.defineComponent({
    name: "VtToast",
    components: { ProgressBar: VtProgressBar_default2, CloseButton: VtCloseButton_default2, Icon: VtIcon_default2 },
    inheritAttrs: false,
    props: Object.assign({}, propValidators_default.CORE_TOAST, propValidators_default.TOAST),
    data() {
      const data = {
        isRunning: true,
        disableTransitions: false,
        beingDragged: false,
        dragStart: 0,
        dragPos: { x: 0, y: 0 },
        dragRect: {}
      };
      return data;
    },
    computed: {
      classes() {
        const classes = [
          `${VT_NAMESPACE}__toast`,
          `${VT_NAMESPACE}__toast--${this.type}`,
          `${this.position}`
        ].concat(this.toastClassName);
        if (this.disableTransitions) {
          classes.push("disable-transition");
        }
        if (this.rtl) {
          classes.push(`${VT_NAMESPACE}__toast--rtl`);
        }
        return classes;
      },
      bodyClasses() {
        const classes = [
          `${VT_NAMESPACE}__toast-${isString(this.content) ? "body" : "component-body"}`
        ].concat(this.bodyClassName);
        return classes;
      },
      draggableStyle() {
        if (this.dragStart === this.dragPos.x) {
          return {};
        } else if (this.beingDragged) {
          return {
            transform: `translateX(${this.dragDelta}px)`,
            opacity: 1 - Math.abs(this.dragDelta / this.removalDistance)
          };
        } else {
          return {
            transition: "transform 0.2s, opacity 0.2s",
            transform: "translateX(0)",
            opacity: 1
          };
        }
      },
      dragDelta() {
        return this.beingDragged ? this.dragPos.x - this.dragStart : 0;
      },
      removalDistance() {
        if (isDOMRect(this.dragRect)) {
          return (this.dragRect.right - this.dragRect.left) * this.draggablePercent;
        }
        return 0;
      }
    },
    mounted() {
      if (this.draggable) {
        this.draggableSetup();
      }
      if (this.pauseOnFocusLoss) {
        this.focusSetup();
      }
    },
    beforeUnmount() {
      if (this.draggable) {
        this.draggableCleanup();
      }
      if (this.pauseOnFocusLoss) {
        this.focusCleanup();
      }
    },
    methods: {
      hasProp,
      getVueComponentFromObj,
      closeToast() {
        this.eventBus.emit(EVENTS.DISMISS, this.id);
      },
      clickHandler() {
        if (this.onClick) {
          this.onClick(this.closeToast);
        }
        if (this.closeOnClick) {
          if (!this.beingDragged || this.dragStart === this.dragPos.x) {
            this.closeToast();
          }
        }
      },
      timeoutHandler() {
        this.closeToast();
      },
      hoverPause() {
        if (this.pauseOnHover) {
          this.isRunning = false;
        }
      },
      hoverPlay() {
        if (this.pauseOnHover) {
          this.isRunning = true;
        }
      },
      focusPause() {
        this.isRunning = false;
      },
      focusPlay() {
        this.isRunning = true;
      },
      focusSetup() {
        addEventListener("blur", this.focusPause);
        addEventListener("focus", this.focusPlay);
      },
      focusCleanup() {
        removeEventListener("blur", this.focusPause);
        removeEventListener("focus", this.focusPlay);
      },
      draggableSetup() {
        const element = this.$el;
        element.addEventListener("touchstart", this.onDragStart, {
          passive: true
        });
        element.addEventListener("mousedown", this.onDragStart);
        addEventListener("touchmove", this.onDragMove, { passive: false });
        addEventListener("mousemove", this.onDragMove);
        addEventListener("touchend", this.onDragEnd);
        addEventListener("mouseup", this.onDragEnd);
      },
      draggableCleanup() {
        const element = this.$el;
        element.removeEventListener("touchstart", this.onDragStart);
        element.removeEventListener("mousedown", this.onDragStart);
        removeEventListener("touchmove", this.onDragMove);
        removeEventListener("mousemove", this.onDragMove);
        removeEventListener("touchend", this.onDragEnd);
        removeEventListener("mouseup", this.onDragEnd);
      },
      onDragStart(event) {
        this.beingDragged = true;
        this.dragPos = { x: getX(event), y: getY(event) };
        this.dragStart = getX(event);
        this.dragRect = this.$el.getBoundingClientRect();
      },
      onDragMove(event) {
        if (this.beingDragged) {
          event.preventDefault();
          if (this.isRunning) {
            this.isRunning = false;
          }
          this.dragPos = { x: getX(event), y: getY(event) };
        }
      },
      onDragEnd() {
        if (this.beingDragged) {
          if (Math.abs(this.dragDelta) >= this.removalDistance) {
            this.disableTransitions = true;
            this.$nextTick(() => this.closeToast());
          } else {
            setTimeout(() => {
              this.beingDragged = false;
              if (isDOMRect(this.dragRect) && this.pauseOnHover && this.dragRect.bottom >= this.dragPos.y && this.dragPos.y >= this.dragRect.top && this.dragRect.left <= this.dragPos.x && this.dragPos.x <= this.dragRect.right) {
                this.isRunning = false;
              } else {
                this.isRunning = true;
              }
            });
          }
        }
      }
    }
  });
  var _hoisted_16$1 = ["role"];
  function render8(_ctx, _cache) {
    const _component_Icon = vue.resolveComponent("Icon");
    const _component_CloseButton = vue.resolveComponent("CloseButton");
    const _component_ProgressBar = vue.resolveComponent("ProgressBar");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.classes),
      style: vue.normalizeStyle(_ctx.draggableStyle),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.clickHandler && _ctx.clickHandler(...args)),
      onMouseenter: _cache[1] || (_cache[1] = (...args) => _ctx.hoverPause && _ctx.hoverPause(...args)),
      onMouseleave: _cache[2] || (_cache[2] = (...args) => _ctx.hoverPlay && _ctx.hoverPlay(...args))
    }, [
      _ctx.icon ? (vue.openBlock(), vue.createBlock(_component_Icon, {
        key: 0,
        "custom-icon": _ctx.icon,
        type: _ctx.type
      }, null, 8, ["custom-icon", "type"])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("div", {
        role: _ctx.accessibility.toastRole || "alert",
        class: vue.normalizeClass(_ctx.bodyClasses)
      }, [
        typeof _ctx.content === "string" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
          vue.createTextVNode(vue.toDisplayString(_ctx.content), 1)
        ], 2112)) : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.getVueComponentFromObj(_ctx.content)), vue.mergeProps({
          key: 1,
          "toast-id": _ctx.id
        }, _ctx.hasProp(_ctx.content, "props") ? _ctx.content.props : {}, vue.toHandlers(_ctx.hasProp(_ctx.content, "listeners") ? _ctx.content.listeners : {}), { onCloseToast: _ctx.closeToast }), null, 16, ["toast-id", "onCloseToast"]))
      ], 10, _hoisted_16$1),
      !!_ctx.closeButton ? (vue.openBlock(), vue.createBlock(_component_CloseButton, {
        key: 1,
        component: _ctx.closeButton,
        "class-names": _ctx.closeButtonClassName,
        "show-on-hover": _ctx.showCloseButtonOnHover,
        "aria-label": _ctx.accessibility.closeButtonLabel,
        onClick: vue.withModifiers(_ctx.closeToast, ["stop"])
      }, null, 8, ["component", "class-names", "show-on-hover", "aria-label", "onClick"])) : vue.createCommentVNode("v-if", true),
      _ctx.timeout ? (vue.openBlock(), vue.createBlock(_component_ProgressBar, {
        key: 2,
        "is-running": _ctx.isRunning,
        "hide-progress-bar": _ctx.hideProgressBar,
        timeout: _ctx.timeout,
        onCloseToast: _ctx.timeoutHandler
      }, null, 8, ["is-running", "hide-progress-bar", "timeout", "onCloseToast"])) : vue.createCommentVNode("v-if", true)
    ], 38);
  }
  VtToast_default.render = render8;
  var VtToast_default2 = VtToast_default;
  var VtTransition_default = vue.defineComponent({
    name: "VtTransition",
    props: propValidators_default.TRANSITION,
    emits: ["leave"],
    methods: {
      hasProp,
      leave(el) {
        if (el instanceof HTMLElement) {
          el.style.left = el.offsetLeft + "px";
          el.style.top = el.offsetTop + "px";
          el.style.width = getComputedStyle(el).width;
          el.style.position = "absolute";
        }
      }
    }
  });
  function render9(_ctx, _cache) {
    return vue.openBlock(), vue.createBlock(vue.TransitionGroup, {
      tag: "div",
      "enter-active-class": _ctx.transition.enter ? _ctx.transition.enter : `${_ctx.transition}-enter-active`,
      "move-class": _ctx.transition.move ? _ctx.transition.move : `${_ctx.transition}-move`,
      "leave-active-class": _ctx.transition.leave ? _ctx.transition.leave : `${_ctx.transition}-leave-active`,
      onLeave: _ctx.leave
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "default")
      ]),
      _: 3
    }, 8, ["enter-active-class", "move-class", "leave-active-class", "onLeave"]);
  }
  VtTransition_default.render = render9;
  var VtTransition_default2 = VtTransition_default;
  var VtToastContainer_default = vue.defineComponent({
    name: "VueToastification",
    devtools: {
      hide: true
    },
    components: { Toast: VtToast_default2, VtTransition: VtTransition_default2 },
    props: Object.assign({}, propValidators_default.CORE_TOAST, propValidators_default.CONTAINER, propValidators_default.TRANSITION),
    data() {
      const data = {
        count: 0,
        positions: Object.values(POSITION),
        toasts: {},
        defaults: {}
      };
      return data;
    },
    computed: {
      toastArray() {
        return Object.values(this.toasts);
      },
      filteredToasts() {
        return this.defaults.filterToasts(this.toastArray);
      }
    },
    beforeMount() {
      const events = this.eventBus;
      events.on(EVENTS.ADD, this.addToast);
      events.on(EVENTS.CLEAR, this.clearToasts);
      events.on(EVENTS.DISMISS, this.dismissToast);
      events.on(EVENTS.UPDATE, this.updateToast);
      events.on(EVENTS.UPDATE_DEFAULTS, this.updateDefaults);
      this.defaults = this.$props;
    },
    mounted() {
      this.setup(this.container);
    },
    methods: {
      async setup(container) {
        if (isFunction(container)) {
          container = await container();
        }
        removeElement(this.$el);
        container.appendChild(this.$el);
      },
      setToast(props) {
        if (!isUndefined(props.id)) {
          this.toasts[props.id] = props;
        }
      },
      addToast(params) {
        params.content = normalizeToastComponent(params.content);
        const props = Object.assign({}, this.defaults, params.type && this.defaults.toastDefaults && this.defaults.toastDefaults[params.type], params);
        const toast2 = this.defaults.filterBeforeCreate(props, this.toastArray);
        toast2 && this.setToast(toast2);
      },
      dismissToast(id) {
        const toast2 = this.toasts[id];
        if (!isUndefined(toast2) && !isUndefined(toast2.onClose)) {
          toast2.onClose();
        }
        delete this.toasts[id];
      },
      clearToasts() {
        Object.keys(this.toasts).forEach((id) => {
          this.dismissToast(id);
        });
      },
      getPositionToasts(position) {
        const toasts = this.filteredToasts.filter((toast2) => toast2.position === position).slice(0, this.defaults.maxToasts);
        return this.defaults.newestOnTop ? toasts.reverse() : toasts;
      },
      updateDefaults(update) {
        if (!isUndefined(update.container)) {
          this.setup(update.container);
        }
        this.defaults = Object.assign({}, this.defaults, update);
      },
      updateToast({
        id,
        options,
        create
      }) {
        if (this.toasts[id]) {
          if (options.timeout && options.timeout === this.toasts[id].timeout) {
            options.timeout++;
          }
          this.setToast(Object.assign({}, this.toasts[id], options));
        } else if (create) {
          this.addToast(Object.assign({}, { id }, options));
        }
      },
      getClasses(position) {
        const classes = [`${VT_NAMESPACE}__container`, position];
        return classes.concat(this.defaults.containerClassName);
      }
    }
  });
  function render10(_ctx, _cache) {
    const _component_Toast = vue.resolveComponent("Toast");
    const _component_VtTransition = vue.resolveComponent("VtTransition");
    return vue.openBlock(), vue.createElementBlock("div", null, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.positions, (pos) => {
        return vue.openBlock(), vue.createElementBlock("div", { key: pos }, [
          vue.createVNode(_component_VtTransition, {
            transition: _ctx.defaults.transition,
            class: vue.normalizeClass(_ctx.getClasses(pos))
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.getPositionToasts(pos), (toast2) => {
                return vue.openBlock(), vue.createBlock(_component_Toast, vue.mergeProps({
                  key: toast2.id
                }, toast2), null, 16);
              }), 128))
            ]),
            _: 2
          }, 1032, ["transition", "class"])
        ]);
      }), 128))
    ]);
  }
  VtToastContainer_default.render = render10;
  var VtToastContainer_default2 = VtToastContainer_default;
  var buildInterface = (globalOptions = {}, mountContainer = true) => {
    const events = globalOptions.eventBus = globalOptions.eventBus || new EventBus();
    if (mountContainer) {
      vue.nextTick(() => {
        const app2 = vue.createApp(VtToastContainer_default2, __spreadValues({}, globalOptions));
        const component = app2.mount(document.createElement("div"));
        const onMounted2 = globalOptions.onMounted;
        if (!isUndefined(onMounted2)) {
          onMounted2(component, app2);
        }
        if (globalOptions.shareAppContext) {
          const baseApp = globalOptions.shareAppContext;
          if (baseApp === true) {
            console.warn(`[${VT_NAMESPACE}] App to share context with was not provided.`);
          } else {
            app2._context.components = baseApp._context.components;
            app2._context.directives = baseApp._context.directives;
            app2._context.mixins = baseApp._context.mixins;
            app2._context.provides = baseApp._context.provides;
            app2.config.globalProperties = baseApp.config.globalProperties;
          }
        }
      });
    }
    const toast2 = (content, options) => {
      const props = Object.assign({}, { id: getId(), type: TYPE.DEFAULT }, options, {
        content
      });
      events.emit(EVENTS.ADD, props);
      return props.id;
    };
    toast2.clear = () => events.emit(EVENTS.CLEAR, void 0);
    toast2.updateDefaults = (update) => {
      events.emit(EVENTS.UPDATE_DEFAULTS, update);
    };
    toast2.dismiss = (id) => {
      events.emit(EVENTS.DISMISS, id);
    };
    function updateToast(id, { content, options }, create = false) {
      const opt = Object.assign({}, options, { content });
      events.emit(EVENTS.UPDATE, {
        id,
        options: opt,
        create
      });
    }
    toast2.update = updateToast;
    toast2.success = (content, options) => toast2(content, Object.assign({}, options, { type: TYPE.SUCCESS }));
    toast2.info = (content, options) => toast2(content, Object.assign({}, options, { type: TYPE.INFO }));
    toast2.error = (content, options) => toast2(content, Object.assign({}, options, { type: TYPE.ERROR }));
    toast2.warning = (content, options) => toast2(content, Object.assign({}, options, { type: TYPE.WARNING }));
    return toast2;
  };
  var createMockToastInterface = () => {
    const toast2 = () => console.warn(`[${VT_NAMESPACE}] This plugin does not support SSR!`);
    return new Proxy(toast2, {
      get() {
        return toast2;
      }
    });
  };
  function createToastInterface(optionsOrEventBus) {
    if (!isBrowser()) {
      return createMockToastInterface();
    }
    if (isEventBusInterface(optionsOrEventBus)) {
      return buildInterface({ eventBus: optionsOrEventBus }, false);
    }
    return buildInterface(optionsOrEventBus, true);
  }
  var toastInjectionKey = Symbol("VueToastification");
  var globalEventBus = new EventBus();
  var VueToastificationPlugin = (App, options) => {
    if ((options == null ? void 0 : options.shareAppContext) === true) {
      options.shareAppContext = App;
    }
    const inter = createToastInterface(__spreadValues({
      eventBus: globalEventBus
    }, options));
    App.provide(toastInjectionKey, inter);
  };
  var useToast = (eventBus) => {
    const toast2 = vue.getCurrentInstance() ? vue.inject(toastInjectionKey, void 0) : void 0;
    return toast2 ? toast2 : createToastInterface(globalEventBus);
  };
  var src_default = VueToastificationPlugin;
  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var GMKey = /* @__PURE__ */ ((GMKey2) => {
    GMKey2["InfiniteScroll"] = "InfiniteScroll";
    GMKey2["ScrollByRow"] = "ScrollByRow";
    GMKey2["ArchiveButton"] = "archiveButton";
    GMKey2["Highlight"] = "Highlight";
    GMKey2["BetterPopup"] = "BetterPopup";
    GMKey2["QuickArchiveDownloadMethod"] = "QuickDownloadMethod";
    GMKey2["QuickTorrentDownload"] = "QuickTorrentDownload";
    GMKey2["LoadAllGalleryImages"] = "LoadAllGalleryImages";
    GMKey2["MultipageViewerEnhancer"] = "MultipageViewerEnhancer";
    GMKey2["AutoRedirect"] = "AutoRedirect";
    GMKey2["PreventImageRemoval"] = "PreventImageRemoval";
    GMKey2["Magnifier"] = "Magnifier";
    GMKey2["MagnifierActivationButton"] = "MagnifierActivationButton";
    GMKey2["MagnifierToggleMode"] = "MagnifierToggleMode";
    GMKey2["MagnifierDefaultScale"] = "MagnifierDefaultScale";
    GMKey2["MagnifierScaleStep"] = "MagnifierScaleStep";
    GMKey2["MagnifierLongPressThreshold"] = "MagnifierLongPressThreshold";
    GMKey2["MagnifierSensitivityX"] = "MagnifierSensitivityX";
    GMKey2["MagnifierSensitivityY"] = "MagnifierSensitivityY";
    GMKey2["ShowJapaneseTitle"] = "ShowJapaneseTitle";
    return GMKey2;
  })(GMKey || {});
  var ArchiveDownloadMethod = /* @__PURE__ */ ((ArchiveDownloadMethod2) => {
    ArchiveDownloadMethod2["Manual"] = "Manual";
    ArchiveDownloadMethod2["HaH_Original"] = "download Original Resolution with H@H";
    ArchiveDownloadMethod2["HaH_2400"] = "download 2400x Resolution with H@H";
    ArchiveDownloadMethod2["Direct_Origin"] = "download Original Resolution directly";
    ArchiveDownloadMethod2["Direct_Resample"] = "download Resample Resolution directly";
    return ArchiveDownloadMethod2;
  })(ArchiveDownloadMethod || {});
  var MouseButton = /* @__PURE__ */ ((MouseButton2) => {
    MouseButton2["Left"] = "left";
    MouseButton2["Right"] = "right";
    return MouseButton2;
  })(MouseButton || {});
  class GMVariable {
    constructor(key, defaultValue) {
      __publicField(this, "_key");
      __publicField(this, "_value");
      this._key = key;
      this._value = defaultValue;
    }
    get value() {
      return this._value;
    }
    set value(value) {
      this._value = value;
      _GM.setValue(this._key, this._value);
    }
    async initialize() {
      this._value = await _GM.getValue(this._key, this._value);
    }
  }
  const infiniteScrollSwitch = vue.reactive(new GMVariable(GMKey.InfiniteScroll, true));
  const archiveButtonSwitch = vue.reactive(new GMVariable(GMKey.ArchiveButton, true));
  const highlightSwitch = vue.reactive(new GMVariable(GMKey.Highlight, true));
  const scrollByRowSwitch = vue.reactive(new GMVariable(GMKey.ScrollByRow, true));
  const betterPopupSwitch = vue.reactive(new GMVariable(GMKey.BetterPopup, true));
  const quickArchiveDownloadMethod = vue.reactive(new GMVariable(GMKey.QuickArchiveDownloadMethod, ArchiveDownloadMethod.Manual));
  const quickTorrentDownloadSwitch = vue.reactive(new GMVariable(GMKey.QuickTorrentDownload, false));
  const loadAllGalleryImagesSwitch = vue.reactive(new GMVariable(GMKey.LoadAllGalleryImages, true));
  const multipageViewerEnhancerSwitch = vue.reactive(new GMVariable(GMKey.MultipageViewerEnhancer, true));
  const autoRedirectSwitch = vue.reactive(new GMVariable(GMKey.AutoRedirect, false));
  const preventImageRemovalSwitch = vue.reactive(new GMVariable(GMKey.PreventImageRemoval, false));
  const magnifierSwitch = vue.reactive(new GMVariable(GMKey.Magnifier, true));
  const magnifierActivationButton = vue.reactive(new GMVariable(GMKey.MagnifierActivationButton, MouseButton.Left));
  const magnifierToggleMode = vue.reactive(new GMVariable(GMKey.MagnifierToggleMode, true));
  const magnifierDefaultScale = vue.reactive(new GMVariable(GMKey.MagnifierDefaultScale, 1.5));
  const magnifierScaleStep = vue.reactive(new GMVariable(GMKey.MagnifierScaleStep, 0.1));
  const magnifierLongPressThreshold = vue.reactive(new GMVariable(GMKey.MagnifierLongPressThreshold, 200));
  const magnifierSensitivityX = vue.reactive(new GMVariable(GMKey.MagnifierSensitivityX, 2));
  const magnifierSensitivityY = vue.reactive(new GMVariable(GMKey.MagnifierSensitivityY, 2));
  const showJapaneseTitle = vue.reactive(new GMVariable(GMKey.ShowJapaneseTitle, true));
  async function initializeMonkeySwitches() {
    await Promise.all([
      infiniteScrollSwitch.initialize(),
      archiveButtonSwitch.initialize(),
      highlightSwitch.initialize(),
      scrollByRowSwitch.initialize(),
      betterPopupSwitch.initialize(),
      quickArchiveDownloadMethod.initialize(),
      quickTorrentDownloadSwitch.initialize(),
      loadAllGalleryImagesSwitch.initialize(),
      multipageViewerEnhancerSwitch.initialize(),
      preventImageRemovalSwitch.initialize(),
      autoRedirectSwitch.initialize(),
      magnifierSwitch.initialize(),
      magnifierActivationButton.initialize(),
      magnifierToggleMode.initialize(),
      magnifierDefaultScale.initialize(),
      magnifierScaleStep.initialize(),
      magnifierLongPressThreshold.initialize(),
      magnifierSensitivityX.initialize(),
      magnifierSensitivityY.initialize(),
      showJapaneseTitle.initialize()
    ]);
  }
  function delay2(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function getElement(selector, root2 = document) {
    return root2.querySelector(selector);
  }
  function getElements(selector, root2 = document) {
    return root2.querySelectorAll(selector);
  }
  async function getDoc(url, options) {
    const response = await fetch(url, options);
    const html = await response.text();
    return new DOMParser().parseFromString(html, "text/html");
  }
  function scrollElement(element, { offset, absolute }) {
    if (offset) {
      element.scrollTop += offset;
      return;
    }
    if (absolute) {
      element.scrollTop = absolute;
    }
  }
  function useWheelStep({
    containerSelector,
    itemsSelector
  }) {
    const container = getElement(containerSelector);
    if (!container) {
      console.warn(`container not found. selector: ${containerSelector}`);
      return;
    }
    let firstItemOfRows = getFirstItemOfRows(itemsSelector, container);
    if (firstItemOfRows.length === 0) {
      console.warn(`item not found. selector: ${itemsSelector}`);
      return;
    }
    const mutationObserver = new MutationObserver(() => {
      firstItemOfRows = getFirstItemOfRows(itemsSelector, container);
    });
    mutationObserver.observe(container, {
      childList: true,
      characterData: true
    });
    setContainerWheelEvent();
    function setContainerWheelEvent() {
      if (!container) {
        return;
      }
      container.addEventListener("mousewheel", (event) => {
        if (!firstItemOfRows) {
          return;
        }
        const firstVisibleItemIndex = firstItemOfRows.findIndex((item) => Math.floor(item.getBoundingClientRect().bottom) > 0);
        const firstVisibleItem = firstItemOfRows[firstVisibleItemIndex];
        const boundingTop = Math.floor(firstVisibleItem.getBoundingClientRect().top);
        let nextIndex = firstVisibleItemIndex;
        if (Math.sign(event.deltaY) === 1 && boundingTop <= 0) {
          nextIndex++;
        } else if (Math.sign(event.deltaY) === -1 && boundingTop >= -1) {
          nextIndex--;
        }
        if (nextIndex >= 0 && nextIndex < firstItemOfRows.length) {
          event.preventDefault();
          event.stopPropagation();
          firstItemOfRows[nextIndex].scrollIntoView();
        }
      });
    }
  }
  function getFirstItemOfRows(selector, parent) {
    const item = getElement(selector, parent);
    if (!item) {
      return [];
    }
    if (parent.clientWidth === 0 || parent.clientWidth === 0) {
      console.warn(`container width is 0, do nothing. container: ${parent}`);
      return [];
    }
    if (item.clientWidth === 0) {
      console.warn(`item width is 0, do nothing. item: ${item}`);
      return [];
    }
    const itemsPerRow = Math.floor(parent.clientWidth / item.clientWidth);
    const firstItemOfRows = getElements(`${selector}:nth-child(${itemsPerRow}n + 1)`, parent);
    if (!firstItemOfRows) {
      return [];
    }
    return [...firstItemOfRows];
  }
  class Logger {
    constructor(feature, scope) {
      __publicField(this, "_feature");
      __publicField(this, "_featureStyle");
      __publicField(this, "_scope");
      __publicField(this, "_scopeStyle");
      this._feature = feature;
      this._scope = scope;
      this._featureStyle = "background: #777; border-radius: 5px;";
      this._scopeStyle = "background: #555; border-radius: 5px;";
    }
    set scope(scope) {
      this._scope = scope;
    }
    get prefix() {
      let prefix = `%c ${this._feature} `;
      if (this._scope) {
        prefix += `%c ${this._scope} `;
      }
      return prefix;
    }
    get style() {
      const style = [this._featureStyle];
      if (this._scope) {
        style.push(this._scopeStyle);
      }
      return style;
    }
    log(message) {
      console.log(
        this.prefix,
        ...this.style,
        message
      );
    }
    error(message, error) {
      console.error(
        this.prefix,
        ...this.style,
        message,
        error
      );
    }
  }
  class LoggerScopeDecorator {
    constructor(baseLogger2, scope) {
      __publicField(this, "_logger");
      this._logger = baseLogger2;
      this._logger.scope = scope;
    }
    log(message) {
      this._logger.log(message);
    }
    error(message, error) {
      this._logger.error(message, error);
    }
  }
  function useGalleryElements() {
    const infoDiv = getElement(".gm");
    const archiveLinkAnchor = getElement("#gd5 > p:nth-child(2) a");
    const torrentLinkAnchor = getElement("#gd5 > p:nth-child(3) a");
    const favoritesLinkAnchor = getElement("#favoritelink");
    const favoritesLinkDiv = getElement("#gdf");
    return {
      infoDiv,
      archiveLinkAnchor,
      torrentLinkAnchor,
      favoritesLinkAnchor,
      favoritesLinkDiv
    };
  }
  const torrentInnerHtml = vue.ref("");
  const archiveInnerHtml = vue.ref("");
  const favoriteInnerHtml = vue.ref("");
  function useFetchPopups() {
    const {
      archiveLinkAnchor,
      torrentLinkAnchor
    } = useGalleryElements();
    function getInnerHTMLs() {
      return {
        torrentInnerHtml,
        archiveInnerHtml,
        favoriteInnerHtml
      };
    }
    async function preloadLinks() {
      [
        archiveInnerHtml.value,
        torrentInnerHtml.value,
        favoriteInnerHtml.value
      ] = await Promise.all([
        fetchArchive(),
        fetchTorrents(),
        fetchFavorites()
      ]);
    }
    async function fetchTorrents() {
      const logger = new LoggerScopeDecorator(new Logger("Preload Links"), "Torrent");
      logger.log("Start");
      const link = getDownloadLink(torrentLinkAnchor);
      if (!link) {
        logger.error("link not found.");
        return "";
      }
      const doc = await getDoc(link);
      const popupContent = getPopupContent(doc, "#torrentinfo > div:first-child");
      if (!popupContent) {
        logger.error("popup content not found.");
        return "";
      }
      logger.log("End");
      return popupContent.innerHTML;
    }
    async function fetchArchive(url) {
      const logger = new LoggerScopeDecorator(new Logger("Preload Links"), "Archive");
      logger.log("Start");
      const link = url || getDownloadLink(archiveLinkAnchor);
      if (!link) {
        logger.error("link not found.");
        return "";
      }
      const doc = await getDoc(link);
      const popupContent = getPopupContent(doc, "#db");
      if (!popupContent) {
        logger.error("popup content not found.");
        return "";
      }
      logger.log("End");
      return popupContent.innerHTML;
    }
    async function fetchFavorites() {
      const logger = new LoggerScopeDecorator(new Logger("Preload Links"), "Favorites");
      logger.log("Start");
      const link = getFavoritesLink();
      if (!link) {
        logger.error("link not found.");
        return "";
      }
      const doc = await getDoc(link);
      const popupContent = getPopupContent(doc, ".stuffbox");
      if (!popupContent) {
        logger.error("popup content not found.");
        return "";
      }
      logger.log("End");
      return popupContent.innerHTML;
    }
    function getDownloadLink(linkElement) {
      var _a2;
      const onClick = linkElement.getAttribute("onclick");
      if (!onClick) {
        return null;
      }
      return (_a2 = onClick.match(/(https:\/\/\S+)',\d+,\d+/)) == null ? void 0 : _a2[1];
    }
    function getPopupContent(doc, selector) {
      const content = getElement(selector, doc);
      if (!content) {
        return null;
      }
      content.removeAttribute("style");
      content.classList.add("popup");
      return content;
    }
    function getFavoritesLink() {
      return `${location.origin}/gallerypopups.php?gid=${getGID()}&t=${getGalleryVersion()}&act=addfav`;
    }
    function getGID() {
      return location.pathname.split("/")[2];
    }
    function getGalleryVersion() {
      return location.pathname.split("/")[3];
    }
    return {
      getInnerHTMLs,
      preloadLinks,
      fetchTorrents,
      fetchArchive,
      fetchFavorites,
      getDownloadLink,
      getPopupContent,
      getFavoritesLink,
      getGID,
      getGalleryVersion
    };
  }
  function getAipUrl() {
    if (_unsafeWindow.location.origin === "https://exhentai.org") {
      return "https://exhentai.org/api.php";
    } else {
      return "https://api.e-hentai.org/api.php";
    }
  }
  function getGalleryMetadataBody(id, token) {
    return JSON.stringify({
      "method": "gdata",
      "gidlist": [
        [id, token]
      ],
      "namespace": 1
    });
  }
  function getGalleryIDandToken(pathname) {
    var _a2;
    const groups = (_a2 = pathname.match(/(mpv|g)\/(?<id>\d+)\/(?<token>\w+)/)) == null ? void 0 : _a2.groups;
    if (!groups) {
      return {
        id: null,
        token: null
      };
    }
    return {
      id: Number(groups.id),
      token: groups.token
    };
  }
  async function fetchGalleryData({ id, token }) {
    const apiURL = getAipUrl();
    return fetch(
      apiURL,
      {
        method: "POST",
        body: getGalleryMetadataBody(id, token)
      }
    ).then((response) => response.json());
  }
  async function changeTitleToJapanese() {
    const { id, token } = getGalleryIDandToken(_unsafeWindow.location.pathname);
    if (!id || !token) {
      return;
    }
    const galleryData = await fetchGalleryData({
      id,
      token
    });
    if (galleryData) {
      const japaneseTitle = galleryData.gmetadata[0].title_jpn;
      if (japaneseTitle) {
        document.title = japaneseTitle;
      }
    }
  }
  async function getArchiveLink(url) {
    const { id, token } = getGalleryIDandToken(url);
    if (!id || !token) {
      return;
    }
    const galleryData = await fetchGalleryData({
      id,
      token
    });
    return `${_unsafeWindow.location.origin}/archiver.php?gid=${id}&token=${token}&or=${galleryData.gmetadata[0].archiver_key}`;
  }
  function useHighlight() {
    const downloadedGalleriesIDs = _GM_getValue("downloaded-galleries-ids", []);
    function setAsDownloaded(galleryID) {
      if (!highlightSwitch.value) {
        return;
      }
      highlight(galleryID);
      downloadedGalleriesIDs.push(galleryID);
      _GM_setValue("downloaded-galleries-ids", downloadedGalleriesIDs);
    }
    function highlight(galleryID) {
      const galleryDiv = getElement(`div[gid="${galleryID}"]`);
      if (galleryDiv) {
        galleryDiv.style.backgroundColor = "black";
      }
    }
    function highlightAll() {
      if (!highlightSwitch.value) {
        return;
      }
      downloadedGalleriesIDs.forEach(highlight);
      _GM_addValueChangeListener("downloaded-galleries-ids", (_key, _oldValue, newValue) => {
        newValue.forEach(highlight);
      });
    }
    return {
      highlightAll,
      setAsDownloaded
    };
  }
  const toast = useToast();
  function useArchive() {
    const { setAsDownloaded } = useHighlight();
    function setHentaiAtHomeEvent() {
      var _a2, _b, _c;
      const logger = new Logger("Hentai At Home Event");
      const hentaiAtHomeLinks = getElements(".popup--archive table td a");
      if (!(hentaiAtHomeLinks == null ? void 0 : hentaiAtHomeLinks.length)) {
        logger.error("hentai@Home Links not found.");
        return;
      }
      const postUrl = (_a2 = getElement("#hathdl_form")) == null ? void 0 : _a2.getAttribute("action");
      if (!postUrl) {
        logger.error("postUrl not found.");
        return;
      }
      for (const link of hentaiAtHomeLinks) {
        const ORIGINAL_SIZE = "org";
        const resolution = ((_c = (_b = link.getAttribute("onclick")) == null ? void 0 : _b.split("'")) == null ? void 0 : _c[1]) || ORIGINAL_SIZE;
        link.removeAttribute("onclick");
        link.addEventListener("click", async (event) => {
          event.preventDefault();
          link.classList.add("is-fetching");
          const doc = await sendDownloadRequest(postUrl, resolution);
          const response = getElement("#db", doc);
          logger.log(response);
          const parsedResponse = parseResponse(response, logger);
          if (parsedResponse) {
            link.classList.remove("is-fetching");
            if (/download has been queued/.test(parsedResponse)) {
              toast.success(parsedResponse);
              link.classList.add("is-finished");
            } else {
              toast.error(parsedResponse);
            }
          }
          const gid = Number(new URL(postUrl).searchParams.get("gid"));
          setAsDownloaded(gid);
        });
      }
    }
    async function sendDownloadRequest(postUrl, resolution) {
      const formData = new FormData();
      formData.append("hathdl_xres", resolution);
      const doc = await getDoc(postUrl, {
        method: "POST",
        body: formData
      });
      return doc;
    }
    function parseResponse(response, logger) {
      if (!response) {
        logger.error("Failed to get response.");
        return null;
      }
      if (!response.innerHTML) {
        logger.error("Failed to get response innerHTML.");
        return null;
      }
      const result = response.innerHTML.match(new RegExp("(?<=<p>)(.*?)(?=<\\/p>)", "g"));
      if (!result) {
        logger.error("Failed to parse response.");
        return null;
      }
      return result.join("\n").replace(/<strong>#\d+<\/strong>/, "");
    }
    function setDirectDownloadEvent() {
      const logger = new Logger("Archive Event");
      const downloadButtons = getElements('form input[name="dlcheck"]');
      if (!downloadButtons) {
        logger.error("archive download buttons not found.");
        return;
      }
      for (const button of downloadButtons) {
        button.addEventListener("click", async (event) => {
          var _a2;
          event.preventDefault();
          const form = (_a2 = button == null ? void 0 : button.parentElement) == null ? void 0 : _a2.parentElement;
          if (!form) {
            logger.error("form not found.");
            return;
          }
          const url = form.getAttribute("action");
          if (!url) {
            logger.error("url not found.");
            return;
          }
          const resolution = button.getAttribute("value");
          button.parentElement.classList.add("is-fetching");
          await sendDownloadRequest2(url, resolution);
          button.parentElement.classList.remove("is-fetching");
          const gid = Number(new URL(url).searchParams.get("gid"));
          setAsDownloaded(gid);
        });
      }
      async function sendDownloadRequest2(url, resolution) {
        const resolutionParams = resolution === "Download Original Archive" ? "dlcheck=Download Original Archive&dltype=org" : "dlcheck=Download Resample Archive&dltype=res";
        const response = await fetch(url, {
          method: "POST",
          body: resolutionParams,
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
          })
        });
        const html = await response.text();
        if (!html.includes("Locating archive server and preparing file for download...")) {
          toast.error("something went wrong. Open your console to see the response");
          console.warn("Download failed, response HTML:", html);
          return;
        }
        const matches2 = html.match(/document\.location = "(.*)"/);
        if (!matches2 || (matches2 == null ? void 0 : matches2.length) !== 2) {
          toast.error("something went wrong. Open your console to see the response");
          console.warn("Download failed, response HTML:", html);
          return;
        }
        const downloadLink = `${matches2[1]}?start=1`;
        window.location.href = downloadLink;
      }
    }
    const { getInnerHTMLs } = useFetchPopups();
    const { archiveInnerHtml: archiveInnerHtml2 } = getInnerHTMLs();
    function setCancelArchiveEvent() {
      var _a2, _b;
      const logger = new Logger("Archive Event");
      const invalidateForm = getElement("#invalidate_form");
      if (!invalidateForm) {
        logger.log("no unlocked archive to invalidate.");
        return;
      }
      const cancelButton = (_b = (_a2 = invalidateForm == null ? void 0 : invalidateForm.nextElementSibling) == null ? void 0 : _a2.children) == null ? void 0 : _b[2];
      if (!cancelButton || cancelButton.innerHTML !== "cancel") {
        logger.log("no unlocked archive to invalidate.");
        return;
      }
      cancelButton.removeAttribute("onclick");
      cancelButton.addEventListener("click", (event) => {
        event.preventDefault();
        cancelButton.innerHTML = "canceling...";
        const url = invalidateForm.getAttribute("action");
        fetch(url, {
          method: "POST",
          body: "invalidate_sessions=1",
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded"
          })
        }).then((res) => res.text()).then((text) => {
          var _a3;
          const html = new DOMParser().parseFromString(text, "text/html");
          archiveInnerHtml2.value = (_a3 = getElement("#db", html)) == null ? void 0 : _a3.innerHTML;
          setTimeout(() => {
            setDirectDownloadEvent();
          }, 0);
        });
      });
    }
    function quickDownload(popup) {
      function getHaHDownloadLinkElement(downloadMethod) {
        const indexMap = {
          [ArchiveDownloadMethod.HaH_Original]: 6,
          [ArchiveDownloadMethod.HaH_2400]: 5
        };
        const index = indexMap[downloadMethod];
        return getElement(`td:nth-child(${index}) > p > a`, popup.value);
      }
      switch (quickArchiveDownloadMethod.value) {
        case ArchiveDownloadMethod.HaH_Original:
        case ArchiveDownloadMethod.HaH_2400: {
          const downloadLinkElement = getHaHDownloadLinkElement(quickArchiveDownloadMethod.value);
          if (downloadLinkElement) {
            downloadLinkElement.click();
          } else {
            toast.warning(`Failed ${quickArchiveDownloadMethod.value}. The link might not exists.
 Open popup`);
            return false;
          }
          break;
        }
        case ArchiveDownloadMethod.Direct_Origin:
          getElement('input[value="Download Original Archive"]', popup.value).click();
          break;
        case ArchiveDownloadMethod.Direct_Resample:
          getElement('input[value="Download Resample Archive"]', popup.value).click();
          break;
      }
      return true;
    }
    return {
      setHentaiAtHomeEvent,
      setDirectDownloadEvent,
      setCancelArchiveEvent,
      quickDownload
    };
  }
  const _hoisted_1$7 = ["innerHTML"];
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "FrontPageEnhancer",
    setup(__props) {
      if (scrollByRowSwitch.value) {
        useWheelStep({
          containerSelector: ".itg.gld",
          itemsSelector: ".gl1t"
        });
      }
      if (infiniteScrollSwitch.value) {
        useInfiniteScroll({
          onFetched: appendArchiveButtons
        });
      }
      function useInfiniteScroll({
        onFetched = () => {
        }
      } = {}) {
        var _a2, _b;
        const galleryContainer = getElement(".itg.gld");
        const bottomPagination = (_a2 = getElements(".searchnav")) == null ? void 0 : _a2[1];
        let nextPageUrl = (_b = getElement("#dnext")) == null ? void 0 : _b.getAttribute("href");
        let isFetching = false;
        const intersectionObserver = new IntersectionObserver(async ([bottomPagination2]) => {
          var _a3;
          if (!bottomPagination2.isIntersecting || isFetching) {
            return;
          }
          if (!nextPageUrl) {
            return;
          }
          isFetching = true;
          galleryContainer == null ? void 0 : galleryContainer.classList.add("is-fetching");
          const doc = await getDoc(nextPageUrl);
          const galleriesOfNextPage = getElements(".itg.gld > .gl1t", doc);
          if (!galleriesOfNextPage) {
            return;
          }
          galleryContainer == null ? void 0 : galleryContainer.append(...galleriesOfNextPage);
          isFetching = false;
          galleryContainer == null ? void 0 : galleryContainer.classList.remove("is-fetching");
          nextPageUrl = (_a3 = getElement("#dnext", doc)) == null ? void 0 : _a3.getAttribute("href");
          history.pushState(void 0, doc.title, nextPageUrl);
          onFetched();
        });
        if (bottomPagination) {
          intersectionObserver.observe(bottomPagination);
        }
      }
      const { getInnerHTMLs, fetchArchive } = useFetchPopups();
      const { archiveInnerHtml: archiveInnerHtml2 } = getInnerHTMLs();
      const archivePopup = vue.ref();
      const activeButton = vue.ref();
      async function appendArchiveButtons() {
        const galleries = getElements(".gl1t");
        galleries == null ? void 0 : galleries.forEach((gallery) => {
          if (getElement(".archive-button", gallery)) {
            return;
          }
          const button = document.createElement("span");
          button.classList.add("archive-button");
          button.textContent = "A";
          button.title = "Show Archive";
          button.onclick = async () => {
            isArchivePopupShow.value = !isArchivePopupShow.value;
            archiveInnerHtml2.value = "Fetching...";
            activeButton.value = button;
            const link = getElement("a", gallery);
            const archiveLink = await getArchiveLink(link.href);
            archiveInnerHtml2.value = await fetchArchive(archiveLink);
            setTimeout(() => {
              setArchiveEvent();
            }, 0);
          };
          const downloadDiv = getElement(".gldown", gallery);
          downloadDiv == null ? void 0 : downloadDiv.appendChild(button);
        });
      }
      const borderRect = useElementBounding(getElement(".itg.gld"));
      const popupRect = useElementBounding(archivePopup);
      const targetRect = useElementBounding(activeButton);
      const archivePopupPosition = vue.computed(() => {
        const top = Math.min(targetRect.bottom.value + 5, borderRect.bottom.value - popupRect.height.value);
        let left = targetRect.left.value - popupRect.width.value / 2;
        const right = left + popupRect.width.value;
        if (left < borderRect.left.value) {
          left = borderRect.left.value;
        } else if (right > borderRect.right.value) {
          left = borderRect.right.value - popupRect.width.value;
        }
        return {
          top: `${top}px`,
          left: `${left}px`,
          // 防止 popup right 超出邊界時，瀏覽器自動 shrink popup
          marginRight: "-9999px"
        };
      });
      if (archiveButtonSwitch.value) {
        appendArchiveButtons();
      }
      const modalOptions = vue.ref({
        teleportTo: ".enhancer-container",
        displayDirective: "show",
        hideOverlay: true,
        contentTransition: "vfm-fade",
        lockScroll: false
      });
      const isArchivePopupShow = vue.ref(false);
      const { setHentaiAtHomeEvent, setDirectDownloadEvent, setCancelArchiveEvent, quickDownload } = useArchive();
      const isQuickDownload = vue.computed(() => quickArchiveDownloadMethod.value !== ArchiveDownloadMethod.Manual);
      function setArchiveEvent() {
        setHentaiAtHomeEvent();
        setDirectDownloadEvent();
        setCancelArchiveEvent();
        if (isQuickDownload.value) {
          const succeed = quickDownload(archivePopup);
          if (!succeed) {
            isArchivePopupShow.value = true;
          }
        }
      }
      const { highlightAll } = useHighlight();
      highlightAll();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(Ro), vue.mergeProps({
          modelValue: isArchivePopupShow.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isArchivePopupShow.value = $event)
        }, modalOptions.value), {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", {
              ref_key: "archivePopup",
              ref: archivePopup,
              class: "popup popup--archive",
              style: vue.normalizeStyle(archivePopupPosition.value),
              innerHTML: vue.unref(archiveInnerHtml2)
            }, null, 12, _hoisted_1$7)
          ]),
          _: 1
        }, 16, ["modelValue"]);
      };
    }
  });
  function usePositions() {
    const { archiveLinkAnchor, torrentLinkAnchor, favoritesLinkAnchor, infoDiv } = useGalleryElements();
    const archiveLinkRect = useElementBounding(archiveLinkAnchor);
    const torrentLinkRect = useElementBounding(torrentLinkAnchor);
    const favoriteLinkRect = useElementBounding(favoritesLinkAnchor);
    function getDownloadPopupRight() {
      return (document.documentElement.clientWidth - infoDiv.clientWidth) / 2;
    }
    return {
      archive: vue.computed(() => ({
        top: `${archiveLinkRect.bottom.value + 5}px`,
        right: `${getDownloadPopupRight()}px`
      })),
      torrent: vue.computed(() => ({
        top: `${torrentLinkRect.bottom.value + 5}px`,
        right: `${getDownloadPopupRight()}px`
      })),
      favorite: vue.computed(() => ({
        top: `${favoriteLinkRect.bottom.value + 5}px`,
        right: `${favoriteLinkRect.left.value}px`
      }))
    };
  }
  const baseLogger = new Logger("Images");
  async function fetchAllImages({ delayInMs = 3e3 }) {
    const logger = new LoggerScopeDecorator(baseLogger, "Fetch All");
    if (!isFirstPage()) {
      logger.log("Not first page, do nothing");
      return;
    }
    logger.log("Start");
    const pageUrls = getPageUrls();
    if (!pageUrls) {
      logger.error("Page URLs not found.");
      return;
    }
    if (pageUrls.length === 0) {
      logger.log("Only one page, do nothing");
      return;
    }
    for (const url of pageUrls) {
      try {
        await delay2(delayInMs);
        logger.log(`fetching ${url}`);
        const doc = await getDoc(url);
        const imageElements = getImageElements(doc);
        if (!imageElements) {
          return;
        }
        appendImages(imageElements);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`fetch ${url} failed`, error);
        }
      }
    }
    logger.log("Done");
    function isFirstPage() {
      var _a2;
      return ((_a2 = getElement(".ptds")) == null ? void 0 : _a2.innerText) === "1";
    }
    function getImageElements(doc) {
      return getElements("#gdt > a", doc);
    }
    function getPageUrls() {
      const lastPageElement = getElement(".ptt td:nth-last-child(2) a");
      if (!lastPageElement) {
        logger.error("Get last page element failed");
        return;
      }
      const pageCount2 = Number(lastPageElement.innerText);
      if (pageCount2 === 1) {
        return [];
      }
      const { href } = window.location;
      return Array(pageCount2 - 1).fill("").map((_, index) => `${href}?p=${index + 1}`);
    }
    function appendImages(elements) {
      var _a2;
      (_a2 = getElement("#gdt")) == null ? void 0 : _a2.append(...elements);
    }
  }
  function useFavorite(favoriteInnerHtml2) {
    const { fetchFavorites, getFavoritesLink } = useFetchPopups();
    function setRequestEvents(target, popup, isPopupShow) {
      var _a2, _b;
      const submitButton = (_a2 = popup.value) == null ? void 0 : _a2.querySelector("input[type=submit]");
      submitButton == null ? void 0 : submitButton.addEventListener("click", async (event) => {
        var _a3;
        event.preventDefault();
        const favoriteCategory = (_a3 = getElement("[name=favcat]:checked")) == null ? void 0 : _a3.value;
        await setFavorite(favoriteCategory);
      });
      const categoryOptions = (_b = popup.value) == null ? void 0 : _b.querySelectorAll("#galpop .nosel > div");
      if (categoryOptions == null ? void 0 : categoryOptions.length) {
        for (const option of categoryOptions) {
          option.addEventListener("dblclick", async (event) => {
            var _a3;
            event.preventDefault();
            const category = (_a3 = option.querySelector("[name=favcat]")) == null ? void 0 : _a3.value;
            await setFavorite(category);
          });
        }
      }
      _unsafeWindow.clicked_fav = () => null;
      async function setFavorite(category) {
        var _a3, _b2;
        const formData = new FormData();
        const favoriteNote = (_a3 = getElement("[name=favnote]")) == null ? void 0 : _a3.value;
        const apply = category === "favdel" ? "Apply Changes" : "Add to Favorites";
        formData.append("favcat", category);
        formData.append("favnote", favoriteNote);
        formData.append("apply", apply);
        formData.append("update", "1");
        const response = await fetch(getFavoritesLink(), {
          method: "POST",
          body: formData
        });
        const html = await response.text();
        const originalScript = (_b2 = html.match(/(if\(window\.opener\.document\.getElementById\("favoritelink"\)).*/)) == null ? void 0 : _b2[0];
        const script = originalScript == null ? void 0 : originalScript.replaceAll(".opener", "");
        Function(script)();
        isPopupShow.value = false;
        favoriteInnerHtml2.value = await fetchFavorites();
        await vue.nextTick();
        setRequestEvents(target, popup, isPopupShow);
      }
    }
    return {
      setRequestEvents
    };
  }
  function useTorrent() {
    function downloadTorrent(popup) {
      var _a2;
      (_a2 = getElement("a", popup.value)) == null ? void 0 : _a2.click();
    }
    function extractMagnetLink(href) {
      const match = href.match(/([0-9a-f]{40})/i);
      if (!match) {
        return null;
      }
      const hash = match[1];
      return `magnet:?xt=urn:btih:${hash}`;
    }
    function addMagnetCopyButtons(popup) {
      if (!popup.value) {
        return;
      }
      const tables = popup.value.querySelectorAll("form table");
      tables.forEach((table) => {
        var _a2;
        if (table.querySelector("[data-magnet-button]")) {
          return;
        }
        const link = table.querySelector("a");
        if (!(link == null ? void 0 : link.href)) {
          return;
        }
        const magnet = extractMagnetLink(link.href);
        if (!magnet) {
          return;
        }
        const insertionPoint = table.querySelector('input[type="submit"], button[type="submit"]');
        if (!insertionPoint) {
          return;
        }
        const button = document.createElement("input");
        button.type = "button";
        button.value = "Copy Magnet";
        button.dataset.magnetButton = "true";
        button.style.marginBottom = "4px";
        button.onclick = async () => {
          _GM_setClipboard(magnet, "text");
          button.value = "✅ Copied";
          button.disabled = true;
          setTimeout(() => {
            button.disabled = false;
            button.value = "Copy Magnet";
          }, 1e3);
        };
        (_a2 = insertionPoint.parentNode) == null ? void 0 : _a2.insertBefore(button, insertionPoint);
      });
    }
    return {
      downloadTorrent,
      extractMagnetLink,
      addMagnetCopyButtons
    };
  }
  const _hoisted_1$6 = ["innerHTML"];
  const _hoisted_2$3 = ["innerHTML"];
  const _hoisted_3$2 = ["innerHTML"];
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "GalleryEnhancer",
    async setup(__props) {
      let __temp, __restore;
      if (loadAllGalleryImagesSwitch.value) {
        fetchAllImages({ delayInMs: 1e3 });
      }
      if (scrollByRowSwitch.value) {
        useWheelStep({
          containerSelector: "#gdt",
          itemsSelector: "a"
        });
      }
      const modalOptions = vue.ref({
        teleportTo: ".enhancer-container",
        displayDirective: "show",
        hideOverlay: true,
        contentTransition: "vfm-fade",
        lockScroll: false
      });
      const { archiveLinkAnchor, torrentLinkAnchor, favoritesLinkAnchor } = useGalleryElements();
      const archivePopup = vue.ref();
      const torrentPopup = vue.ref();
      const favoritePopup = vue.ref();
      const { getInnerHTMLs, preloadLinks } = useFetchPopups();
      const {
        archiveInnerHtml: archiveInnerHtml2,
        torrentInnerHtml: torrentInnerHtml2,
        favoriteInnerHtml: favoriteInnerHtml2
      } = getInnerHTMLs();
      const isArchivePopupShow = vue.ref(false);
      const isTorrentPopupShow = vue.ref(false);
      const isFavoritePopupShow = vue.ref(false);
      const {
        archive: archivePosition,
        torrent: torrentPosition,
        favorite: favoritePosition
      } = usePositions();
      const { setHentaiAtHomeEvent, setDirectDownloadEvent, setCancelArchiveEvent, quickDownload } = useArchive();
      const { downloadTorrent, addMagnetCopyButtons } = useTorrent();
      const { setRequestEvents } = useFavorite(favoriteInnerHtml2);
      if (betterPopupSwitch.value) {
        [__temp, __restore] = vue.withAsyncContext(() => preloadLinks()), await __temp, __restore();
        setTimeout(() => {
          setArchiveClickEvent();
          setTorrentClickEvent();
          setFavoriteClickEvent();
        }, 0);
      }
      const isQuickDownload = vue.computed(() => quickArchiveDownloadMethod.value !== ArchiveDownloadMethod.Manual);
      function setArchiveClickEvent() {
        setHentaiAtHomeEvent();
        setDirectDownloadEvent();
        setCancelArchiveEvent();
        archiveLinkAnchor.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isQuickDownload.value) {
            const succeed = quickDownload(archivePopup);
            if (!succeed) {
              isArchivePopupShow.value = true;
            }
          } else {
            isArchivePopupShow.value = !isArchivePopupShow.value;
          }
        });
        setReady(archiveLinkAnchor);
      }
      const { setAsDownloaded } = useHighlight();
      function setTorrentClickEvent() {
        setRequestEvents(archiveLinkAnchor, favoritePopup, isFavoritePopupShow);
        const isOnlyOneTorrent = torrentLinkAnchor.innerText.endsWith("(1)");
        addMagnetCopyButtons(torrentPopup);
        const torrentDownloadLinks = getElements("a", torrentPopup.value);
        if (torrentDownloadLinks == null ? void 0 : torrentDownloadLinks.length) {
          torrentDownloadLinks == null ? void 0 : torrentDownloadLinks.forEach((link) => {
            link.addEventListener("click", () => {
              setAsDownloaded(_unsafeWindow.gid);
            });
          });
        }
        torrentLinkAnchor.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (quickTorrentDownloadSwitch.value && isOnlyOneTorrent) {
            downloadTorrent(torrentPopup);
          } else {
            isTorrentPopupShow.value = !isTorrentPopupShow.value;
          }
        });
        setReady(torrentLinkAnchor);
      }
      function setFavoriteClickEvent() {
        favoritesLinkAnchor.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          isFavoritePopupShow.value = !isFavoritePopupShow.value;
        });
        setReady(favoritesLinkAnchor);
      }
      function setReady(element) {
        element.removeAttribute("onclick");
        element.classList.add("is-ready");
      }
      vue.onMounted(() => {
        _unsafeWindow.pop_ren = Function('popUp(popbase + "rename", window.innerWidth * 2 / 3, window.innerHeight * 2 / 3);');
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(Ro), vue.mergeProps({
            modelValue: isArchivePopupShow.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isArchivePopupShow.value = $event)
          }, modalOptions.value), {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                ref_key: "archivePopup",
                ref: archivePopup,
                class: "popup popup--archive",
                style: vue.normalizeStyle(vue.unref(archivePosition)),
                innerHTML: vue.unref(archiveInnerHtml2)
              }, null, 12, _hoisted_1$6)
            ]),
            _: 1
          }, 16, ["modelValue"]),
          vue.createVNode(vue.unref(Ro), vue.mergeProps({
            modelValue: isTorrentPopupShow.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isTorrentPopupShow.value = $event)
          }, modalOptions.value), {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                ref_key: "torrentPopup",
                ref: torrentPopup,
                class: "popup popup--torrent",
                style: vue.normalizeStyle(vue.unref(torrentPosition)),
                innerHTML: vue.unref(torrentInnerHtml2)
              }, null, 12, _hoisted_2$3)
            ]),
            _: 1
          }, 16, ["modelValue"]),
          vue.createVNode(vue.unref(Ro), vue.mergeProps({
            modelValue: isFavoritePopupShow.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isFavoritePopupShow.value = $event)
          }, modalOptions.value), {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                ref_key: "favoritePopup",
                ref: favoritePopup,
                class: "popup",
                style: vue.normalizeStyle(vue.unref(favoritePosition)),
                innerHTML: vue.unref(favoriteInnerHtml2)
              }, null, 12, _hoisted_3$2)
            ]),
            _: 1
          }, 16, ["modelValue"])
        ], 64);
      };
    }
  });
  function useMultiPageViewerElements() {
    const paneImagesDiv2 = getElement("#pane_images");
    const paneThumbsDiv2 = getElement("#pane_thumbs");
    return {
      paneImagesDiv: paneImagesDiv2,
      paneThumbsDiv: paneThumbsDiv2
    };
  }
  const { paneImagesDiv: paneImagesDiv$1 } = useMultiPageViewerElements();
  const location$1 = useBrowserLocation();
  const currentPage$1 = vue.ref(Number((_a = location$1.value.hash) == null ? void 0 : _a.replace("#page", "")) || 1);
  function usePages() {
    const pageCount2 = _unsafeWindow.pagecount;
    function appendPageIndex() {
      const imageContainers = getElements(".mimg");
      const pageCount22 = imageContainers.length;
      const mutationObserver = new MutationObserver(([mutation]) => {
        const target = mutation.target;
        const index = target.id.split("image_")[1];
        const captionElement = getElement(".mbar > *:nth-child(3)", target);
        const captionText = captionElement == null ? void 0 : captionElement.innerText;
        if (!captionText || (captionText == null ? void 0 : captionText.includes(" ／ "))) {
          return;
        }
        captionElement.innerText = `${captionText}　-　${index} ／ ${pageCount22}`;
      });
      const config = { attributes: true };
      imageContainers.forEach((container) => {
        mutationObserver.observe(container, config);
      });
    }
    function goToNextPage2() {
      goToPageByOffset2(1);
    }
    function goToPrevPage2() {
      goToPageByOffset2(-1);
    }
    function goToCurrentPage() {
      goToPage2(currentPage$1.value);
    }
    function goToPageByOffset2(offset) {
      let index = currentPage$1.value + offset;
      index = Math.min(index, pageCount2);
      index = Math.max(index, 1);
      goToPage2(index);
    }
    function goToPage2(index) {
      currentPage$1.value = index;
      const target = getElement(`#image_${index}`);
      target.scrollIntoView();
    }
    function scrollToImageTop() {
      getCurrentImage2().scrollIntoView();
    }
    function scrollToRelativePosition(relativeToViewport) {
      const currentImage = getCurrentImage2();
      const { height: imageHeight } = currentImage.getBoundingClientRect();
      const top = currentImage.offsetTop + relativeToViewport * imageHeight - window.innerHeight / 2 - 1;
      paneImagesDiv$1.scrollTo({ top });
    }
    function getRelativeToViewport2() {
      const currentImage = getCurrentImage2();
      if (!currentImage) {
        return null;
      }
      const { top: imageTop, height: imageHeight } = currentImage.getBoundingClientRect();
      return 1 - (imageHeight - 1 + imageTop - window.innerHeight / 2) / imageHeight;
    }
    function scrollToProperPosition2(relativeToViewport, currentSize) {
      const currentImage = getCurrentImage2();
      if (currentSize === 100) {
        scrollToImageTop();
      } else {
        scrollToRelativePosition(relativeToViewport);
      }
      if (currentImage.getBoundingClientRect().top > 1) {
        scrollToImageTop();
      }
    }
    function changePageOnWheel(event) {
      if (event.deltaY < 0) {
        goToPrevPage2();
      } else {
        goToNextPage2();
      }
    }
    function setPreloadImagesEvent() {
      paneImagesDiv$1.onscroll = () => {
        _unsafeWindow.preload_scroll_images();
      };
    }
    function getCurrentImage2() {
      return getElement(`img[id^=imgsrc_${currentPage$1.value}]`);
    }
    function syncCurrentImageOnScroll() {
      const imageContainers = getElements(".mimg");
      let firstIntersectingIndex = 1;
      const observer = new IntersectionObserver((entries) => {
        firstIntersectingIndex = Number(entries[0].target.id.replace("image_", ""));
      });
      imageContainers.forEach((container) => {
        observer.observe(container);
      });
      paneImagesDiv$1.addEventListener("scroll", () => {
        const visibleImageContainers = [];
        for (let index = Math.max(firstIntersectingIndex - 1, 1); index < imageContainers.length; index++) {
          const percentage = getVisiblePercentageInViewport(imageContainers[index - 1]);
          if (percentage > 0) {
            visibleImageContainers.push({
              index,
              percentage,
              element: imageContainers[index]
            });
          }
        }
        if (visibleImageContainers.length === 0) {
          return;
        } else if (visibleImageContainers.length === 1) {
          currentPage$1.value = visibleImageContainers[0].index;
        } else {
          visibleImageContainers.sort((elem1, elem2) => elem2.percentage - elem1.percentage);
          const [largest, secondLargest] = visibleImageContainers;
          if (largest.percentage / secondLargest.percentage >= 2) {
            currentPage$1.value = largest.index;
          }
        }
      });
    }
    function getVisiblePercentageInViewport(element) {
      const viewportHeight = window.innerHeight;
      const { top, bottom } = element.getBoundingClientRect();
      if (top > viewportHeight || bottom < 0) {
        return 0;
      }
      const visibleBottom = Math.min(viewportHeight, bottom);
      const visibleTop = Math.max(top, 0);
      return (visibleBottom - visibleTop) / viewportHeight;
    }
    return {
      appendPageIndex,
      pageCount: pageCount2,
      currentPage: currentPage$1,
      getCurrentImage: getCurrentImage2,
      goToNextPage: goToNextPage2,
      goToPrevPage: goToPrevPage2,
      goToPageByOffset: goToPageByOffset2,
      goToPage: goToPage2,
      goToCurrentPage,
      scrollToImageTop,
      scrollToRelativePosition,
      getRelativeToViewport: getRelativeToViewport2,
      scrollToProperPosition: scrollToProperPosition2,
      changePageOnWheel,
      syncCurrentImageOnScroll,
      setPreloadImagesEvent
    };
  }
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var Symbol$1 = root.Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var now = function() {
    return root.Date.now();
  };
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  const {
    pageCount,
    currentPage,
    getCurrentImage,
    goToPage,
    goToPageByOffset,
    goToNextPage,
    goToPrevPage,
    getRelativeToViewport,
    scrollToProperPosition
  } = usePages();
  const {
    paneImagesDiv,
    paneThumbsDiv
  } = useMultiPageViewerElements();
  setReflowTrigger();
  function setReflowTrigger() {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            var _a2;
            (_a2 = entry.target) == null ? void 0 : _a2.dispatchEvent(new CustomEvent("reflow"));
          });
        });
      }
    });
    observer.observe(document.body);
  }
  function useEvents() {
    function setKeyBoardEvent() {
      document.onkeydown = null;
      window.addEventListener("keydown", async (event) => {
        const isCtrlPressed = event.ctrlKey;
        if (isCtrlPressed) {
          switch (event.code) {
            case "ArrowLeft":
              goToPageByOffset(-10);
              break;
            case "ArrowRight":
              goToPageByOffset(10);
              break;
          }
        } else {
          const currentImage = getCurrentImage();
          switch (event.code) {
            case "Numpad8":
              if (currentImage) {
                scrollElement(paneImagesDiv, {
                  absolute: currentImage.offsetTop
                });
              }
              break;
            case "Numpad5":
              if (currentImage) {
                scrollElement(paneImagesDiv, {
                  absolute: currentImage.offsetTop + (currentImage.offsetHeight - window.innerHeight) / 2
                });
              }
              break;
            case "Numpad2":
              if (currentImage) {
                scrollElement(paneImagesDiv, {
                  absolute: currentImage.offsetTop + currentImage.offsetHeight - window.innerHeight
                });
              }
              break;
            case "ArrowUp":
              scrollElement(paneImagesDiv, { offset: -50 });
              break;
            case "ArrowDown":
              scrollElement(paneImagesDiv, { offset: 50 });
              break;
            case "ArrowLeft":
            case "Numpad1":
            case "Numpad4":
              goToPrevPage();
              break;
            case "Backspace":
              event.preventDefault();
              goToPrevPage();
              break;
            case "ArrowRight":
            case "Numpad3":
            case "Numpad6":
            case "Space":
              goToNextPage();
              break;
            case "PageUp":
              goToPageByOffset(-10);
              break;
            case "PageDown":
              goToPageByOffset(10);
              break;
            case "Home":
              goToPage(1);
              break;
            case "End":
              goToPage(pageCount);
              break;
            case "KeyF":
            case "Enter": {
              toggleFullScreen();
              break;
            }
            case "KeyR":
              _unsafeWindow.action_reload(currentPage.value);
              break;
            case "Numpad7":
              rotate(-90);
              break;
            case "Numpad9":
              rotate(90);
              break;
          }
        }
      });
    }
    function setClickEvent() {
      setChangePageClickEvent();
      setFullscreenToggleEvent();
      setThumbsClickEvent();
      function setChangePageClickEvent() {
        const config = {
          click: goToNextPage,
          contextmenu: goToPrevPage
        };
        for (const [event, action] of Object.entries(config)) {
          paneImagesDiv.addEventListener(event, (event2) => {
            const target = event2.target;
            if (target.closest(".mbar")) {
              return;
            }
            event2.preventDefault();
            event2.stopPropagation();
            action();
            hideCursor(event2);
          });
        }
      }
      function setFullscreenToggleEvent() {
        document.body.addEventListener("mousedown", (event) => {
          if (event.button !== 1) {
            return;
          }
          const target = event.target;
          if (target.closest(".original-functions")) {
            return;
          }
          document.body.addEventListener("mouseup", () => {
            toggleFullScreen();
          }, {
            once: true
          });
        });
      }
      function setThumbsClickEvent() {
        paneThumbsDiv.addEventListener("click", (event) => {
          var _a2;
          const index = Number(
            (_a2 = event.target.closest("div")) == null ? void 0 : _a2.id.replace("thumb_", "")
          );
          currentPage.value = index;
        });
      }
    }
    function setShowCursorEvent() {
      document.body.addEventListener("mousemove", (event) => {
        if (!checkMouseDelta(event)) {
          return;
        }
        showCursor();
      });
    }
    function setHideCursorEvent() {
      document.body.addEventListener("mousewheel", (event) => {
        hideCursor(event);
      }, true);
      const debouncedHideCursor = debounce(hideCursor, 1e3);
      document.body.addEventListener("mousemove", (event) => {
        debouncedHideCursor(event);
      }, true);
    }
    const prevMousePoint = {
      x: 0,
      y: 0
    };
    function checkMouseDelta({ clientX, clientY }) {
      const threshold = 50;
      return Math.abs(clientX - prevMousePoint.x) >= threshold || Math.abs(clientY - prevMousePoint.y) >= threshold;
    }
    function showCursor() {
      document.body.classList.remove("hide-cursor");
    }
    function hideCursor({ clientX, clientY }) {
      prevMousePoint.x = clientX;
      prevMousePoint.y = clientY;
      document.body.classList.add("hide-cursor");
    }
    function setShowThumbsEvent() {
      document.addEventListener("mousemove", (event) => {
        const threshold = 15;
        const shouldShowThumbs = event.clientX < paneThumbsDiv.offsetWidth + threshold;
        paneThumbsDiv.style.opacity = shouldShowThumbs ? "1" : "0";
      });
    }
    const { toggle } = useFullscreen(document.body);
    async function toggleFullScreen() {
      const relativeToViewport = getRelativeToViewport();
      const page = currentPage.value;
      document.body.addEventListener("reflow", () => {
        if (relativeToViewport) {
          setTimeout(() => {
            goToPage(page);
            setTimeout(() => {
              scrollToProperPosition(relativeToViewport);
            }, 0);
          }, 100);
        }
      }, {
        once: true
      });
      await toggle();
    }
    function rotate(degree) {
      const currentImage = getCurrentImage();
      const currentDegree = Number(currentImage.style.rotate.replace("deg", ""));
      const newDegree = (currentDegree + degree) % 360;
      currentImage.style.rotate = `${newDegree}deg`;
      if (newDegree % 180 == 0) {
        currentImage.style.scale = "initial";
      } else {
        const { width, height } = currentImage.getBoundingClientRect();
        currentImage.style.scale = (width / height).toString();
      }
    }
    return {
      setKeyBoardEvent,
      setClickEvent,
      setShowCursorEvent,
      setHideCursorEvent,
      setShowThumbsEvent
    };
  }
  const _hoisted_1$5 = { class: "page-elevator" };
  const _hoisted_2$2 = ["value"];
  const _hoisted_3$1 = ["textContent"];
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "PageElevator",
    setup(__props) {
      const {
        pageCount: pageCount2,
        currentPage: currentPage2,
        goToPage: goToPage2
      } = usePages();
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          vue.createElementVNode("input", {
            type: "text",
            class: "page-elevator__input",
            value: vue.unref(currentPage2),
            onKeydown: [
              _cache[0] || (_cache[0] = vue.withModifiers(() => {
              }, ["stop"])),
              _cache[1] || (_cache[1] = vue.withKeys(($event) => vue.unref(goToPage2)(Number($event.target.value)), ["enter"]))
            ]
          }, null, 40, _hoisted_2$2),
          _cache[2] || (_cache[2] = vue.createElementVNode("span", { class: "page-elevator__slash" }, "／", -1)),
          vue.createElementVNode("span", {
            textContent: vue.toDisplayString(vue.unref(pageCount2))
          }, null, 8, _hoisted_3$1)
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const PageElevator = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-c3f8cb4a"]]);
  const _hoisted_1$4 = { class: "image-resizer" };
  const _hoisted_2$1 = ["onClick", "textContent"];
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "ImageResizer",
    setup(__props) {
      const {
        goToCurrentPage,
        getRelativeToViewport: getRelativeToViewport2,
        scrollToProperPosition: scrollToProperPosition2
      } = usePages();
      const { paneImagesDiv: paneImagesDiv2 } = useMultiPageViewerElements();
      const {
        sizeList,
        currentIndex,
        setImageSize,
        onResizerClick,
        setResizeShortcuts
      } = useImageResizer();
      setResizeShortcuts();
      setTimeout(() => {
        setImageSize(currentIndex.value);
        goToCurrentPage();
      }, 0);
      function useImageResizer() {
        const sizeList2 = [100, 125, 150, 175, 200];
        const storedIndex = useStorage("image-resizer-index", 0);
        const currentIndex2 = vue.ref(storedIndex.value);
        vue.watch(currentIndex2, (index) => {
          storedIndex.value = index;
        });
        const currentSize = vue.computed(() => {
          if (currentIndex2.value < 0) {
            return void 0;
          }
          return sizeList2[currentIndex2.value];
        });
        function onResizerClick2(index) {
          const relativeToViewport = getRelativeToViewport2();
          if (index === currentIndex2.value) {
            clearImageSize();
          } else {
            setImageSize2(index);
          }
          if (relativeToViewport) {
            scrollToProperPosition2(relativeToViewport);
          }
        }
        function setImageSize2(index) {
          currentIndex2.value = index;
          paneImagesDiv2.style.setProperty("--image-size", `${currentSize.value}vh`);
        }
        function clearImageSize() {
          currentIndex2.value = -1;
          paneImagesDiv2.style.removeProperty("--image-size");
        }
        function increaseImageSize() {
          const index = Math.min(currentIndex2.value + 1, sizeList2.length - 1);
          setImageSize2(index);
        }
        function decreaseImageSize() {
          const index = currentIndex2.value === -1 ? sizeList2.length - 1 : Math.max(currentIndex2.value - 1, 0);
          setImageSize2(index);
        }
        function setResizeShortcuts2() {
          window.addEventListener("keydown", (event) => {
            var _a2;
            const relativeToViewport = getRelativeToViewport2();
            const isCtrlPressed = event.ctrlKey;
            if (isCtrlPressed) {
              const regex = /Numpad(?<index>[1-5])/;
              const matchResult = event.code.match(regex);
              if (!matchResult) {
                return;
              }
              const index = Number((_a2 = matchResult.groups) == null ? void 0 : _a2.index);
              setImageSize2(index - 1);
            } else {
              switch (event.code) {
                case "NumpadAdd":
                  increaseImageSize();
                  break;
                case "NumpadSubtract":
                  decreaseImageSize();
                  break;
                case "Numpad0":
                  if (currentIndex2.value === 0) {
                    clearImageSize();
                  } else {
                    setImageSize2(0);
                  }
                  break;
                case "NumpadDecimal": {
                  const index = Math.floor(sizeList2.length / 2);
                  if (currentIndex2.value === index) {
                    clearImageSize();
                  } else {
                    setImageSize2(index);
                  }
                  break;
                }
                case "NumpadEnter":
                  clearImageSize();
                  break;
                default:
                  return;
              }
            }
            if (relativeToViewport) {
              scrollToProperPosition2(relativeToViewport, currentSize.value);
            }
          });
        }
        return {
          sizeList: sizeList2,
          currentIndex: currentIndex2,
          currentSize,
          setImageSize: setImageSize2,
          onResizerClick: onResizerClick2,
          setResizeShortcuts: setResizeShortcuts2
        };
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(sizeList), (size, index) => {
            return vue.openBlock(), vue.createElementBlock("button", {
              key: size,
              class: vue.normalizeClass(["image-resizer__button", { "image-resizer__button--active": index === vue.unref(currentIndex) }]),
              onClick: ($event) => vue.unref(onResizerClick)(index),
              textContent: vue.toDisplayString(size)
            }, null, 10, _hoisted_2$1);
          }), 128))
        ]);
      };
    }
  });
  const ImageResizer = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-19caf69f"]]);
  function useMagnifierGesture(config) {
    const isLeftPressed = vue.ref(false);
    const isRightPressed = vue.ref(false);
    const pressTimer = vue.ref();
    const isPrimaryButton = vue.computed(
      () => config.activationButton === "left" ? isLeftPressed.value : isRightPressed.value
    );
    const isSecondaryButton = vue.computed(
      () => config.activationButton === "left" ? isRightPressed.value : isLeftPressed.value
    );
    function updateButtonState(e) {
      if (e.button === 0) {
        isLeftPressed.value = e.type === "mousedown";
      } else if (e.button === 2) {
        isRightPressed.value = e.type === "mousedown";
      }
    }
    function isPrimaryButtonEvent(e) {
      return config.activationButton === "left" && e.button === 0 || config.activationButton === "right" && e.button === 2;
    }
    function isSecondaryButtonEvent(e) {
      return config.activationButton === "left" && e.button === 2 || config.activationButton === "right" && e.button === 0;
    }
    function startLongPressTimer(callback) {
      pressTimer.value = window.setTimeout(callback, config.longPressThreshold);
    }
    function clearTimer() {
      if (pressTimer.value) {
        clearTimeout(pressTimer.value);
        pressTimer.value = void 0;
      }
    }
    return {
      isLeftPressed,
      isRightPressed,
      isPrimaryButton,
      isSecondaryButton,
      updateButtonState,
      isPrimaryButtonEvent,
      isSecondaryButtonEvent,
      startLongPressTimer,
      clearTimer
    };
  }
  function useMagnifierImageLoader(state) {
    const { paneImagesDiv: paneImagesDiv2 } = useMultiPageViewerElements();
    const currentRequest = vue.ref(null);
    const currentObjectUrl = vue.ref(null);
    function cleanup() {
      if (currentRequest.value) {
        currentRequest.value.abort();
        currentRequest.value = null;
      }
      if (currentObjectUrl.value) {
        URL.revokeObjectURL(currentObjectUrl.value);
        currentObjectUrl.value = null;
      }
    }
    async function loadOriginal(img) {
      const mbar = img.closest(".mimg");
      const originalLink = mbar && getElement('a[href*="/fullimg/"]', mbar);
      if (originalLink) {
        const originalUrl = originalLink.href;
        const newImage = new Image();
        state.isLoadingOriginal = true;
        state.loadingProgress = 0;
        try {
          await new Promise((resolve, reject) => {
            currentRequest.value = _GM_xmlhttpRequest({
              method: "GET",
              url: originalUrl,
              responseType: "blob",
              onprogress: (event) => {
                state.loadingProgress = event.loaded / event.total * 100;
              },
              onload: (response) => {
                const blob = response.response;
                const objectUrl = URL.createObjectURL(blob);
                currentObjectUrl.value = objectUrl;
                newImage.onload = () => {
                  resolve();
                };
                newImage.onerror = () => {
                  URL.revokeObjectURL(objectUrl);
                  reject();
                };
                newImage.src = objectUrl;
              },
              onerror: reject
            });
          });
          img.src = newImage.src;
          state.isLoadingOriginal = false;
          currentRequest.value = null;
          return true;
        } catch (error) {
          console.error("原圖載入失敗:", error);
          state.isLoadingOriginal = false;
          currentRequest.value = null;
          return false;
        }
      }
      return false;
    }
    function findImageAtPosition(posY) {
      const mouseY = posY;
      const images = paneImagesDiv2.querySelectorAll(".mimg > a > img");
      if (!images.length) {
        return;
      }
      if ((mouseY <= 0 || mouseY >= window.innerHeight) && state.currentImage) {
        return;
      }
      for (const img of images) {
        const rect = img.getBoundingClientRect();
        if (mouseY >= rect.top + window.scrollY && mouseY <= rect.bottom + window.scrollY) {
          state.currentImage = img;
          return;
        }
      }
      state.currentImage = null;
    }
    return {
      loadOriginal,
      findImageAtPosition,
      cleanup
    };
  }
  function useMagnifierEvents(state, config) {
    const { paneImagesDiv: paneImagesDiv2 } = useMultiPageViewerElements();
    const gesture = useMagnifierGesture(config);
    const imageLoader = useMagnifierImageLoader(state);
    const navigation = useMagnifierNavigation(state, config);
    const isWaitingForToggleEnd = vue.ref(false);
    function handlePress(e) {
      e.preventDefault();
      e.stopPropagation();
      gesture.updateButtonState(e);
      if (!gesture.isPrimaryButton.value) {
        return;
      }
      gesture.startLongPressTimer(() => {
        imageLoader.findImageAtPosition(e.pageY);
        if (!state.currentImage) {
          return;
        }
        state.isOriginalMode = gesture.isPrimaryButton.value && gesture.isSecondaryButton.value;
        if (state.isOriginalMode) {
          imageLoader.loadOriginal(state.currentImage);
        }
        activateMagnifier(e);
      });
    }
    function handleRelease(e) {
      gesture.updateButtonState(e);
      gesture.clearTimer();
      if (!state.isActive) {
        return;
      }
      if (config.toggleMode) {
        handleToggleModeRelease(e);
      } else {
        handleHoldModeRelease();
      }
    }
    function handleToggleModeRelease(e) {
      if (!gesture.isPrimaryButtonEvent(e)) {
        return;
      }
      if (isWaitingForToggleEnd.value) {
        deactivateMagnifier();
        isWaitingForToggleEnd.value = false;
      } else {
        isWaitingForToggleEnd.value = true;
      }
    }
    function handleHoldModeRelease() {
      if (state.isOriginalMode) {
        if (!gesture.isPrimaryButton.value && !gesture.isSecondaryButton.value) {
          deactivateMagnifier();
        }
      } else {
        if (!gesture.isPrimaryButton.value) {
          deactivateMagnifier();
        }
      }
    }
    function activateMagnifier(e) {
      state.isActive = true;
      state.position = {
        x: e.pageX,
        y: e.pageY
      };
      state.lastPosition = {
        x: e.pageX,
        y: e.pageY
      };
      state.scale = config.scale.default;
      if (state.currentImage) {
        navigation.updatePosition(e);
        paneImagesDiv2.dataset.magnifierActive = "true";
        document.body.classList.add("hide-cursor");
        const style = document.createElement("style");
        style.id = "magnifier-style";
        style.textContent = `
        #pane_thumbs {
          display: none !important;
          pointer-events: none !important;
          visibility: hidden !important;
        }
      `;
        document.head.appendChild(style);
      }
    }
    function deactivateMagnifier() {
      var _a2;
      imageLoader.cleanup();
      delete paneImagesDiv2.dataset.magnifierActive;
      state.currentImage = null;
      state.isOriginalMode = false;
      state.isLoadingOriginal = false;
      document.body.classList.remove("hide-cursor");
      (_a2 = getElement("#magnifier-style")) == null ? void 0 : _a2.remove();
      setTimeout(() => {
        state.isActive = false;
      }, 0);
    }
    function handleWheel(e) {
      if (!state.isActive) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      navigation.updateScale(-Math.sign(e.deltaY) * config.scale.step);
    }
    function handleMouseDown(e) {
      if (!e.target.closest(".mbar")) {
        handlePress(e);
      }
    }
    function preventDefaultHandler(e) {
      if (state.isActive && !e.target.closest(".mbar")) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    function bindEvents() {
      paneImagesDiv2.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleRelease);
      window.addEventListener("mousemove", navigation.updatePosition);
      const preventDefaultEvents = ["mousedown", "click", "contextmenu"];
      preventDefaultEvents.forEach((eventName) => {
        paneImagesDiv2.addEventListener(eventName, preventDefaultHandler, { capture: true });
      });
    }
    function unbindEvents() {
      imageLoader.cleanup();
      paneImagesDiv2.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("mousemove", navigation.updatePosition);
      const preventDefaultEvents = ["mousedown", "click", "contextmenu"];
      preventDefaultEvents.forEach((eventName) => {
        paneImagesDiv2.removeEventListener(eventName, preventDefaultHandler, { capture: true });
      });
    }
    return {
      bindEvents,
      unbindEvents,
      handleWheel
    };
  }
  function useMagnifierNavigation(state, config) {
    function updatePosition(e) {
      if (!state.isActive) {
        return;
      }
      const movementX = e.pageX - state.lastPosition.x;
      const movementY = e.pageY - state.lastPosition.y;
      state.position = {
        x: state.position.x + movementX * config.sensitivity.x,
        y: state.position.y + movementY * config.sensitivity.y
      };
      state.position = {
        x: Math.max(0, Math.min(window.innerWidth, state.position.x)),
        y: Math.max(0, Math.min(window.innerHeight, state.position.y))
      };
      state.lastPosition = {
        x: e.pageX,
        y: e.pageY
      };
    }
    function updateScale(delta) {
      if (!state.isActive) {
        return;
      }
      state.scale = Math.min(
        Math.max(state.scale + delta, config.scale.min),
        config.scale.max
      );
    }
    return {
      updatePosition,
      updateScale
    };
  }
  function useMagnifierStyle(state, config) {
    const { paneImagesDiv: paneImagesDiv2 } = useMultiPageViewerElements();
    const contentStyle = vue.computed(() => {
      if (!state.currentImage) {
        return {};
      }
      const style = calculateTransformStyle(
        state.currentImage,
        state.position,
        state.scale
      );
      if (state.isLoadingOriginal) {
        return {
          ...style,
          maskImage: `linear-gradient(to bottom, black ${state.loadingProgress}%, transparent ${state.loadingProgress}%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black ${state.loadingProgress}%, transparent ${state.loadingProgress}%)`
        };
      }
      return style;
    });
    function calculateTransformStyle(img, position, scale) {
      const currentImageBounds = img.getBoundingClientRect();
      const currentImageScale = getImageSizeScale();
      const idealImageBounds = getNormalizedRect(currentImageBounds);
      const magnifierCenter = getCenterPoint(currentImageBounds);
      const interactiveArea = getMappingArea(currentImageBounds, idealImageBounds);
      const mouseRelativePos = getRelativePosition(position, interactiveArea);
      const finalScale = currentImageScale * scale;
      const finalTranslate = {
        x: magnifierCenter.x - idealImageBounds.width * mouseRelativePos.x * finalScale + (position.x - magnifierCenter.x),
        y: magnifierCenter.y - idealImageBounds.height * mouseRelativePos.y * finalScale + (position.y - magnifierCenter.y)
      };
      return {
        position: "absolute",
        inset: 0,
        width: `${idealImageBounds.width * finalScale}px`,
        height: `${idealImageBounds.height * finalScale}px`,
        transform: `translate(${finalTranslate.x}px, ${finalTranslate.y}px)`,
        backgroundImage: `url(${img.src})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat"
      };
    }
    function getImageSizeScale() {
      const imageSizeStyle = getComputedStyle(paneImagesDiv2).getPropertyValue("--image-size");
      return imageSizeStyle ? parseInt(imageSizeStyle) / 100 : 1;
    }
    function getNormalizedRect(imgRect) {
      const width = window.innerHeight * (imgRect.width / imgRect.height);
      return {
        width,
        height: window.innerHeight,
        top: 0,
        bottom: window.innerHeight,
        left: (window.innerWidth - width) / 2,
        right: (window.innerWidth + width) / 2
      };
    }
    function getCenterPoint(imgRect) {
      return {
        x: imgRect.left + imgRect.width / 2,
        y: window.innerHeight / 2
      };
    }
    function getMappingArea(imgRect, normalizedRect) {
      return {
        top: normalizedRect.top + imgRect.height * config.mappingArea.vertical / 100,
        bottom: normalizedRect.bottom - imgRect.height * config.mappingArea.vertical / 100,
        left: imgRect.left + imgRect.width * config.mappingArea.horizontal / 100,
        right: imgRect.right - imgRect.width * config.mappingArea.horizontal / 100
      };
    }
    function getRelativePosition(position, mappingArea) {
      return {
        x: (position.x - mappingArea.left) / (mappingArea.right - mappingArea.left),
        y: (position.y - mappingArea.top) / (mappingArea.bottom - mappingArea.top)
      };
    }
    return {
      contentStyle
    };
  }
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "ImageMagnifier",
    setup(__props) {
      const magnifierConfig = {
        toggleMode: magnifierToggleMode.value,
        activationButton: magnifierActivationButton.value,
        longPressThreshold: magnifierLongPressThreshold.value,
        scale: {
          default: magnifierDefaultScale.value,
          step: magnifierScaleStep.value,
          min: 1.1,
          max: 10
        },
        mappingArea: {
          horizontal: 0,
          vertical: 5
        },
        sensitivity: {
          x: magnifierSensitivityX.value,
          y: magnifierSensitivityY.value
        }
      };
      const state = vue.reactive({
        isActive: false,
        position: {
          x: 0,
          y: 0
        },
        lastPosition: {
          x: 0,
          y: 0
        },
        scale: magnifierConfig.scale.default,
        currentImage: null,
        isOriginalMode: false,
        isLoadingOriginal: false,
        loadingProgress: 0
      });
      const magnifierStyle = vue.computed(() => ({
        position: "fixed",
        inset: 0,
        margin: "auto",
        pointerEvents: "none",
        zIndex: 1e3
      }));
      const { contentStyle } = useMagnifierStyle(state, magnifierConfig);
      const {
        bindEvents,
        unbindEvents,
        handleWheel
      } = useMagnifierEvents(state, magnifierConfig);
      vue.onMounted(() => {
        bindEvents();
      });
      vue.onUnmounted(() => {
        unbindEvents();
      });
      const isShow = vue.computed(() => state.isActive);
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("div", {
            class: "magnifier-overlay",
            onWheel: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => vue.unref(handleWheel) && vue.unref(handleWheel)(...args)),
            onMousedown: _cache[1] || (_cache[1] = vue.withModifiers(() => {
            }, ["prevent", "stop"])),
            onClick: _cache[2] || (_cache[2] = vue.withModifiers(() => {
            }, ["prevent", "stop"])),
            onContextmenu: _cache[3] || (_cache[3] = vue.withModifiers(() => {
            }, ["prevent", "stop"]))
          }, null, 32),
          vue.createElementVNode("div", {
            class: "magnifier",
            style: vue.normalizeStyle(magnifierStyle.value)
          }, [
            _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "magnifier-background" }, null, -1)),
            vue.createElementVNode("div", {
              class: "magnifier-image",
              style: vue.normalizeStyle(vue.unref(contentStyle))
            }, null, 4)
          ], 4)
        ], 512)), [
          [vue.vShow, isShow.value]
        ]);
      };
    }
  });
  const ImageMagnifier = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-716338a1"]]);
  const _hoisted_1$3 = ["innerHTML"];
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "MultiPageViewerEnhancer",
    setup(__props) {
      const {
        currentPage: currentPage2,
        appendPageIndex,
        changePageOnWheel,
        setPreloadImagesEvent,
        syncCurrentImageOnScroll
      } = usePages();
      const {
        setKeyBoardEvent,
        setClickEvent,
        setShowCursorEvent,
        setHideCursorEvent,
        setShowThumbsEvent
      } = useEvents();
      appendPageIndex();
      setPreloadImagesEvent();
      syncCurrentImageOnScroll();
      setKeyBoardEvent();
      setClickEvent();
      setShowCursorEvent();
      setHideCursorEvent();
      setShowThumbsEvent();
      useWheelStep({
        containerSelector: "#pane_thumbs",
        itemsSelector: "[id^=thumb_]"
      });
      const exhentaiButtons = vue.ref("");
      vue.onMounted(() => {
        exhentaiButtons.value = replaceOriginalFunctions();
      });
      function replaceOriginalFunctions() {
        var _a2;
        const originalFunctions = getElement("#bar3");
        const closeButton = originalFunctions.querySelector("img:first-child");
        if (!closeButton) {
          return "";
        }
        const link = document.createElement("a");
        link.href = window.location.origin + window.location.pathname.replace("mpv", "g");
        (_a2 = closeButton.parentNode) == null ? void 0 : _a2.insertBefore(link, closeButton);
        link.append(closeButton);
        return originalFunctions.innerHTML;
      }
      vue.onMounted(() => {
        overrideGlobalCSS();
        vue.watch(() => preventImageRemovalSwitch.value, (value) => {
          if (!value) {
            return;
          }
          _unsafeWindow.preload_generic = Function("a", "b", "c", `
      var d = a.scrollTop;
      a = d + a.offsetHeight;
      for (var e = "image" == b, f = 1; f <= pagecount; f++) {
          var g = document.getElementById(b + "_" + f)
            , h = g.offsetTop
            , k = h + g.offsetHeight;
          if ("hidden" == g.style.visibility && k >= d && h <= a + c)
              e ? load_image(f) : load_thumb(f),
              g.style.visibility = "visible";
      }
    `);
        }, { immediate: true });
        vue.watch(currentPage2, (index) => {
          var _a2;
          (_a2 = getElement(`#thumb_${index}`)) == null ? void 0 : _a2.scrollIntoView({
            block: "center"
          });
        });
      });
      function overrideGlobalCSS() {
        _GM_addStyle(`
html,
body {
  padding: 0;
  width: 100% !important;
  height: 100% !important;
}

div#bar3 {
  display: none;
}

.hide-cursor,
.hide-cursor * {
  cursor: none;
}

.original-functions {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  width: 35px;
  height: 270px;
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  > img {
    cursor: pointer;
  }
}

#pane_images {
  inset: 0 !important;
  margin: auto;
}

#pane_thumbs {
  display: block;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.3s;
}
  `);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "enhancer-features",
          onWheel: _cache[0] || (_cache[0] = vue.withModifiers(
            //@ts-ignore
            (...args) => vue.unref(changePageOnWheel) && vue.unref(changePageOnWheel)(...args),
            ["stop"]
          ))
        }, [
          vue.createVNode(PageElevator, { class: "enhancer-features__feature" }),
          vue.createVNode(ImageResizer, { class: "enhancer-features__feature" }),
          vue.createElementVNode("div", {
            class: "original-functions",
            innerHTML: exhentaiButtons.value
          }, null, 8, _hoisted_1$3),
          vue.unref(magnifierSwitch).value ? (vue.openBlock(), vue.createBlock(ImageMagnifier, { key: 0 })) : vue.createCommentVNode("", true)
        ], 32);
      };
    }
  });
  const _sfc_main$3 = {};
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    fill: "#FFF",
    version: "1.1",
    width: "800px",
    height: "800px",
    viewBox: "0 0 94.926 94.926",
    "xml:space": "preserve"
  };
  function _sfc_render(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
      vue.createElementVNode("g", null, [
        vue.createElementVNode("path", { d: "M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" })
      ], -1)
    ]));
  }
  const CrossButton = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render]]);
  const _hoisted_1$1 = { class: "switch" };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "ToggleSwitch",
    props: {
      modelValue: { type: Boolean }
    },
    emits: ["update:modelValue", "toggle"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const modelValueProxy = vue.computed({
        get: () => props.modelValue,
        set: (value) => {
          emit("update:modelValue", value);
          emit("toggle", value);
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("label", _hoisted_1$1, [
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => modelValueProxy.value = $event),
            type: "checkbox",
            class: "switch__input"
          }, null, 512), [
            [vue.vModelCheckbox, modelValueProxy.value]
          ]),
          _cache[1] || (_cache[1] = vue.createElementVNode("span", { class: "switch__slider" }, null, -1))
        ]);
      };
    }
  });
  const ToggleSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-894c8e09"]]);
  const _hoisted_1 = { class: "settings-panel__inner" };
  const _hoisted_2 = { class: "settings-panel__section" };
  const _hoisted_3 = { class: "settings" };
  const _hoisted_4 = { class: "settings-panel__section" };
  const _hoisted_5 = { class: "settings" };
  const _hoisted_6 = { class: "settings" };
  const _hoisted_7 = { class: "settings__intro" };
  const _hoisted_8 = { class: "settings__option" };
  const _hoisted_9 = { class: "settings__option" };
  const _hoisted_10 = { class: "settings__option" };
  const _hoisted_11 = { class: "settings__option" };
  const _hoisted_12 = { class: "settings__option" };
  const _hoisted_13 = { class: "settings" };
  const _hoisted_14 = { class: "settings" };
  const _hoisted_15 = { class: "settings-panel__section" };
  const _hoisted_16 = { class: "settings" };
  const _hoisted_17 = { class: "settings" };
  const _hoisted_18 = { class: "settings" };
  const _hoisted_19 = { class: "settings" };
  const _hoisted_20 = { class: "settings__intro" };
  const _hoisted_21 = { class: "settings__magnifier-config" };
  const _hoisted_22 = { class: "settings__label" };
  const _hoisted_23 = ["value"];
  const _hoisted_24 = ["value"];
  const _hoisted_25 = { class: "settings__label" };
  const _hoisted_26 = { class: "settings__label" };
  const _hoisted_27 = { class: "settings__label" };
  const _hoisted_28 = { class: "settings__label" };
  const _hoisted_29 = { class: "settings__label" };
  const _hoisted_30 = { class: "settings__label" };
  const _hoisted_31 = { class: "settings-panel__section" };
  const _hoisted_32 = { class: "settings" };
  const _hoisted_33 = { class: "settings" };
  const _hoisted_34 = { class: "settings" };
  const _hoisted_35 = { class: "settings" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "SettingsPanel",
    setup(__props) {
      const isShow = vue.ref(false);
      vue.onMounted(() => {
        _GM.registerMenuCommand("Open settings panel", () => isShow.value = !isShow.value);
      });
      function reload() {
        location.reload();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(Ro), {
          modelValue: isShow.value,
          "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => isShow.value = $event),
          "overlay-transition": "vfm-fade",
          class: "settings-panel-wrap",
          "content-class": "settings-panel"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", _hoisted_1, [
              vue.createElementVNode("section", _hoisted_2, [
                _cache[24] || (_cache[24] = vue.createElementVNode("h2", { class: "settings-panel__section-name" }, " Common ", -1)),
                _cache[25] || (_cache[25] = vue.createElementVNode("hr", { class: "settings-panel__separator" }, null, -1)),
                vue.createElementVNode("div", _hoisted_3, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(showJapaneseTitle).value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(showJapaneseTitle).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[23] || (_cache[23] = vue.createElementVNode("h3", { class: "settings__name" }, " Change page title to Japanese (effect on browser/tab title) ", -1))
                ])
              ]),
              vue.createElementVNode("section", _hoisted_4, [
                _cache[33] || (_cache[33] = vue.createElementVNode("h2", { class: "settings-panel__section-name" }, " Gallery Enhancer ", -1)),
                _cache[34] || (_cache[34] = vue.createElementVNode("hr", { class: "settings-panel__separator" }, null, -1)),
                vue.createElementVNode("div", _hoisted_5, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(scrollByRowSwitch).value,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(scrollByRowSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[26] || (_cache[26] = vue.createElementVNode("h3", { class: "settings__name" }, " Scroll by Row ", -1)),
                  _cache[27] || (_cache[27] = vue.createElementVNode("span", { class: "settings__notice" }, ' *sync with "Front Page Enhancer - Scroll by Row" ', -1))
                ]),
                vue.createElementVNode("div", _hoisted_6, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(betterPopupSwitch).value,
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(betterPopupSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[30] || (_cache[30] = vue.createElementVNode("h3", { class: "settings__name" }, " Better Popup ", -1)),
                  vue.createElementVNode("div", _hoisted_7, [
                    _cache[28] || (_cache[28] = vue.createElementVNode("span", null, ' Action when clicking "Archive Download": ', -1)),
                    vue.withDirectives(vue.createElementVNode("select", {
                      class: "settings__select",
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(quickArchiveDownloadMethod).value = $event)
                    }, [
                      vue.createElementVNode("option", _hoisted_8, vue.toDisplayString(vue.unref(ArchiveDownloadMethod).Manual), 1),
                      vue.createElementVNode("option", _hoisted_9, vue.toDisplayString(vue.unref(ArchiveDownloadMethod).HaH_Original), 1),
                      vue.createElementVNode("option", _hoisted_10, vue.toDisplayString(vue.unref(ArchiveDownloadMethod).HaH_2400), 1),
                      vue.createElementVNode("option", _hoisted_11, vue.toDisplayString(vue.unref(ArchiveDownloadMethod).Direct_Origin), 1),
                      vue.createElementVNode("option", _hoisted_12, vue.toDisplayString(vue.unref(ArchiveDownloadMethod).Direct_Resample), 1)
                    ], 512), [
                      [vue.vModelSelect, vue.unref(quickArchiveDownloadMethod).value]
                    ]),
                    _cache[29] || (_cache[29] = vue.createElementVNode("p", null, [
                      vue.createTextVNode(' *Notice: If you had changed the Archiver Settings, you have to change it back to "Manual Select, Manual Start (Default)" in the setting page: '),
                      vue.createElementVNode("a", {
                        class: "settings__link",
                        target: "_blank",
                        href: "https://e-hentai.org/uconfig.php",
                        rel: "noreferrer noopener"
                      }, " e-hentai "),
                      vue.createTextVNode(" , "),
                      vue.createElementVNode("a", {
                        class: "settings__link",
                        target: "_blank",
                        href: "https://exhentai.org/uconfig.php",
                        rel: "noreferrer noopener"
                      }, " exhentai ")
                    ], -1))
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_13, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(quickTorrentDownloadSwitch).value,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(quickTorrentDownloadSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[31] || (_cache[31] = vue.createElementVNode("h3", { class: "settings__name" }, " Download torrent directly if there is only one torrent. ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_14, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(loadAllGalleryImagesSwitch).value,
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(loadAllGalleryImagesSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[32] || (_cache[32] = vue.createElementVNode("h3", { class: "settings__name" }, " Load All Gallery Images ", -1))
                ])
              ]),
              vue.createElementVNode("section", _hoisted_15, [
                _cache[47] || (_cache[47] = vue.createElementVNode("h2", { class: "settings-panel__section-name" }, " Multi-Page Viewer Enhancer ", -1)),
                _cache[48] || (_cache[48] = vue.createElementVNode("hr", { class: "settings-panel__separator" }, null, -1)),
                vue.createElementVNode("div", _hoisted_16, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(multipageViewerEnhancerSwitch).value,
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(multipageViewerEnhancerSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[35] || (_cache[35] = vue.createElementVNode("h3", { class: "settings__name" }, " Multi-Page Viewer Enhancer ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_17, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(preventImageRemovalSwitch).value,
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(preventImageRemovalSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[36] || (_cache[36] = vue.createElementVNode("h3", { class: "settings__name" }, " Prevent Image Removal ", -1)),
                  _cache[37] || (_cache[37] = vue.createElementVNode("div", { class: "settings__intro" }, [
                    vue.createElementVNode("p", null, " The original script of exhentai would remove the images which are too far from your current scroll. "),
                    vue.createElementVNode("p", null, " So if you scroll back to the images that have been removed. It might be flashing because although your browser has cached the image but still have to re-render it. ")
                  ], -1))
                ]),
                vue.createElementVNode("div", _hoisted_18, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(autoRedirectSwitch).value,
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.unref(autoRedirectSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[38] || (_cache[38] = vue.createElementVNode("h3", { class: "settings__name" }, " Auto Redirect to Multi-Page Viewer ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_19, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(magnifierSwitch).value,
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => vue.unref(magnifierSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[46] || (_cache[46] = vue.createElementVNode("h3", { class: "settings__name" }, " Image Magnifier ", -1)),
                  vue.createElementVNode("div", _hoisted_20, [
                    _cache[45] || (_cache[45] = vue.createElementVNode("p", null, " Long press the primary button to activate magnifier. Press both primary and secondary buttons simultaneously for original image. ", -1)),
                    vue.createElementVNode("div", _hoisted_21, [
                      vue.createElementVNode("label", _hoisted_22, [
                        _cache[39] || (_cache[39] = vue.createTextVNode(" Activation Button: ")),
                        vue.withDirectives(vue.createElementVNode("select", {
                          class: "settings__select",
                          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => vue.unref(magnifierActivationButton).value = $event)
                        }, [
                          vue.createElementVNode("option", {
                            class: "settings__option",
                            value: vue.unref(MouseButton).Left
                          }, "Left Mouse Button", 8, _hoisted_23),
                          vue.createElementVNode("option", {
                            class: "settings__option",
                            value: vue.unref(MouseButton).Right
                          }, "Right Mouse Button", 8, _hoisted_24)
                        ], 512), [
                          [vue.vModelSelect, vue.unref(magnifierActivationButton).value]
                        ])
                      ]),
                      vue.createElementVNode("label", _hoisted_25, [
                        vue.createVNode(ToggleSwitch, {
                          modelValue: vue.unref(magnifierToggleMode).value,
                          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => vue.unref(magnifierToggleMode).value = $event)
                        }, null, 8, ["modelValue"]),
                        vue.createTextVNode(" " + vue.toDisplayString(vue.unref(magnifierToggleMode).value ? "Toggle Mode (click once to open, click again to close)" : "Hold Mode (hold down to use)"), 1)
                      ]),
                      vue.createElementVNode("label", _hoisted_26, [
                        _cache[40] || (_cache[40] = vue.createTextVNode(" Default Scale: ")),
                        vue.withDirectives(vue.createElementVNode("input", {
                          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => vue.unref(magnifierDefaultScale).value = $event),
                          type: "number",
                          min: "1.1",
                          max: "10",
                          step: "0.1",
                          class: "settings__input"
                        }, null, 512), [
                          [
                            vue.vModelText,
                            vue.unref(magnifierDefaultScale).value,
                            void 0,
                            { number: true }
                          ]
                        ])
                      ]),
                      vue.createElementVNode("label", _hoisted_27, [
                        _cache[41] || (_cache[41] = vue.createTextVNode(" Scale Step (Mouse Wheel): ")),
                        vue.withDirectives(vue.createElementVNode("input", {
                          "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => vue.unref(magnifierScaleStep).value = $event),
                          type: "number",
                          min: "0.05",
                          max: "0.5",
                          step: "0.05",
                          class: "settings__input"
                        }, null, 512), [
                          [
                            vue.vModelText,
                            vue.unref(magnifierScaleStep).value,
                            void 0,
                            { number: true }
                          ]
                        ])
                      ]),
                      vue.createElementVNode("label", _hoisted_28, [
                        _cache[42] || (_cache[42] = vue.createTextVNode(" Long Press Threshold (ms): ")),
                        vue.withDirectives(vue.createElementVNode("input", {
                          "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => vue.unref(magnifierLongPressThreshold).value = $event),
                          type: "number",
                          min: "50",
                          max: "1000",
                          step: "50",
                          class: "settings__input"
                        }, null, 512), [
                          [
                            vue.vModelText,
                            vue.unref(magnifierLongPressThreshold).value,
                            void 0,
                            { number: true }
                          ]
                        ])
                      ]),
                      vue.createElementVNode("label", _hoisted_29, [
                        _cache[43] || (_cache[43] = vue.createTextVNode(" Mouse Sensitivity X: ")),
                        vue.withDirectives(vue.createElementVNode("input", {
                          "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => vue.unref(magnifierSensitivityX).value = $event),
                          type: "number",
                          min: "0.5",
                          max: "5",
                          step: "0.5",
                          class: "settings__input"
                        }, null, 512), [
                          [
                            vue.vModelText,
                            vue.unref(magnifierSensitivityX).value,
                            void 0,
                            { number: true }
                          ]
                        ])
                      ]),
                      vue.createElementVNode("label", _hoisted_30, [
                        _cache[44] || (_cache[44] = vue.createTextVNode(" Mouse Sensitivity Y: ")),
                        vue.withDirectives(vue.createElementVNode("input", {
                          "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => vue.unref(magnifierSensitivityY).value = $event),
                          type: "number",
                          min: "0.5",
                          max: "5",
                          step: "0.5",
                          class: "settings__input"
                        }, null, 512), [
                          [
                            vue.vModelText,
                            vue.unref(magnifierSensitivityY).value,
                            void 0,
                            { number: true }
                          ]
                        ])
                      ])
                    ])
                  ])
                ])
              ]),
              vue.createElementVNode("section", _hoisted_31, [
                _cache[55] || (_cache[55] = vue.createElementVNode("h2", { class: "settings-panel__section-name" }, " Front Page Enhancer ", -1)),
                _cache[56] || (_cache[56] = vue.createElementVNode("hr", { class: "settings-panel__separator" }, null, -1)),
                vue.createElementVNode("div", _hoisted_32, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(infiniteScrollSwitch).value,
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => vue.unref(infiniteScrollSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[49] || (_cache[49] = vue.createElementVNode("h3", { class: "settings__name" }, " Infinite Scroll ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_33, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(scrollByRowSwitch).value,
                    "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => vue.unref(scrollByRowSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[50] || (_cache[50] = vue.createElementVNode("h3", { class: "settings__name" }, " Scroll by Row ", -1)),
                  _cache[51] || (_cache[51] = vue.createElementVNode("span", { class: "settings__notice" }, ' *sync with "Gallery Enhancer - Scroll by Row" ', -1))
                ]),
                vue.createElementVNode("div", _hoisted_34, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(highlightSwitch).value,
                    "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => vue.unref(highlightSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[52] || (_cache[52] = vue.createElementVNode("h3", { class: "settings__name" }, " Highlight downloaded gallery ", -1)),
                  _cache[53] || (_cache[53] = vue.createElementVNode("div", { class: "settings__intro" }, " Set background color of downloaded Gallery color to black. ", -1))
                ]),
                vue.createElementVNode("div", _hoisted_35, [
                  vue.createVNode(ToggleSwitch, {
                    modelValue: vue.unref(archiveButtonSwitch).value,
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => vue.unref(archiveButtonSwitch).value = $event)
                  }, null, 8, ["modelValue"]),
                  _cache[54] || (_cache[54] = vue.createElementVNode("h3", { class: "settings__name" }, " Insert archiver buttons to galleries on the front page. ", -1))
                ])
              ])
            ]),
            vue.createElementVNode("span", {
              class: "settings-panel__close-button",
              onClick: _cache[21] || (_cache[21] = ($event) => isShow.value = false)
            }, [
              vue.createVNode(CrossButton)
            ]),
            vue.createElementVNode("div", { class: "actions" }, [
              vue.createElementVNode("button", {
                class: "actions__button",
                onClick: reload
              }, " Apply and Reload ")
            ])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const { href } = window.location;
      const { enhancer } = useEnhancer();
      const { redirectIfSinglePageViewer } = useRedirect();
      if (autoRedirectSwitch.value) {
        redirectIfSinglePageViewer();
      }
      if (showJapaneseTitle.value) {
        changeTitleToJapanese();
      }
      setCSS();
      function useEnhancer() {
        const enhancer2 = vue.computed(() => {
          if (/https:\/\/e[-x]hentai\.org\/(watched|popular)?(\?.+)?$/.test(href) || /https:\/\/e[-x]hentai\.org\/(tag)\/\w+/.test(href)) {
            return _sfc_main$9;
          }
          if (/https:\/\/e[-x]hentai\.org\/g\/\w+\/\w+/.test(href)) {
            return _sfc_main$8;
          }
          if (multipageViewerEnhancerSwitch.value && /https:\/\/e[-x]hentai\.org\/mpv\/\w+\/\w+/.test(href)) {
            return _sfc_main$4;
          }
          return null;
        });
        return {
          enhancer: enhancer2
        };
      }
      function useRedirect() {
        function redirectIfSinglePageViewer2() {
          const isSinglePageViewer = /https:\/\/e[-x]hentai\.org\/s\/\w+\/\w+/.test(href);
          if (isSinglePageViewer) {
            vue.onMounted(() => {
              const page = location.pathname.split("-")[1];
              const url = getElement(".sb > a").href.replace("/g/", "/mpv/");
              location.href = `${url}#page${page}`;
            });
          }
        }
        return {
          redirectIfSinglePageViewer: redirectIfSinglePageViewer2
        };
      }
      function setCSS() {
        document.documentElement.style.setProperty(
          "--bg-color",
          _unsafeWindow.location.origin === "https://exhentai.org" ? "#34353b" : "#E3E0D1"
        );
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          (vue.openBlock(), vue.createBlock(vue.Suspense, null, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(enhancer))))
            ]),
            _: 1
          })),
          vue.createVNode(_sfc_main$1)
        ], 64);
      };
    }
  });
  const app = vue.createApp(_sfc_main);
  const vfm = zo();
  app.use(vfm);
  app.use(src_default, {
    transition: "Vue-Toastification__fade",
    maxToasts: 2,
    newestOnTop: true,
    pauseOnFocusLoss: true,
    hideProgressBar: true,
    closeButton: false
  });
  (async () => {
    await initializeMonkeySwitches();
    app.mount(
      (() => {
        const app2 = document.createElement("div");
        app2.classList.add("enhancer-container");
        document.body.append(app2);
        return app2;
      })()
    );
  })();

})(Vue);