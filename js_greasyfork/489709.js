// ==UserScript==
// @name         vite-project
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @author       monkey
// @description  test
// @license      test
// @icon         https://vitejs.dev/logo.svg
// @match        http://oa.yousheng186.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.21/dist/vue.global.prod.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489709/vite-project.user.js
// @updateURL https://update.greasyfork.org/scripts/489709/vite-project.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const r=document.createElement("style");r.textContent=n,document.head.append(r)})(" .notification[data-v-320548a0]{display:none;position:fixed;top:10px;right:10px;padding:15px;background-color:#4caf50;color:#fff;border-radius:5px;box-shadow:0 4px 8px #0000001a;z-index:1000}#--unocss--{layer:__ALL__}#--unocss-layer-start--__ALL__--{start:__ALL__}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.ml-2{margin-left:.5rem}.block{display:block}#--unocss-layer-end--__ALL__--{end:__ALL__} ");

(function (vue) {
  'use strict';

  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const renderTip = () => {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.innerHTML = "复制成功";
        document.body.appendChild(notification);
        notification.style.display = "block";
      };
      const copyText = (text) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          renderTip();
        } catch (err) {
          console.error("无法执行复制操作", err);
        }
        document.body.removeChild(textarea);
      };
      const addBtn = () => {
        const labelElement = document.querySelectorAll(".page-title .label")[0];
        if (!labelElement)
          return;
        const btn = document.createElement("div");
        btn.innerText = "复制";
        btn.className = "btn btn-primary ml-2";
        const textElement = document.querySelectorAll(".page-title .text")[0];
        btn.onclick = () => copyText(`${labelElement.innerHTML}-${textElement.getAttribute("title")}`);
        textElement.appendChild(btn);
      };
      vue.onMounted(() => {
        addBtn();
      });
      return (_ctx, _cache) => {
        return null;
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-320548a0"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);