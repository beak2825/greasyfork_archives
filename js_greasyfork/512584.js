// ==UserScript==
// @name         vite-vue-ts-starter
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @author       monkey
// @description  油猴快速开发
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.baidu.com/
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/lib/index.iife.min.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.8.5/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.8.5/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/512584/vite-vue-ts-starter.user.js
// @updateURL https://update.greasyfork.org/scripts/512584/vite-vue-ts-starter.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const r=document.createElement("style");r.textContent=n,document.head.append(r)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;display:flex;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.read-the-docs[data-v-5689f7b5]{color:#888}.logo[data-v-da01b740]{height:6em;padding:1.5em;will-change:filter}.logo[data-v-da01b740]:hover{filter:drop-shadow(0 0 2em #646cffaa)}.logo.vue[data-v-da01b740]:hover{filter:drop-shadow(0 0 2em #42b883aa)}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.h1{height:1px}.bg-indigo-500{--un-bg-opacity:1;background-color:rgb(99 102 241 / var(--un-bg-opacity))}.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.filter{filter:var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)} ");

(function (vue, $, ElementPlus) {
  'use strict';

  function okMsg(title, msg = "") {
    msgShow(
      title,
      msg,
      "success"
      /* ok */
    );
  }
  function warnMsg(title, msg = "") {
    msgShow(
      title,
      msg,
      "warning"
      /* warn */
    );
  }
  function msgShow(title, msg, type) {
    if (msg) {
      ElementPlus.ElNotification({
        title,
        message: msg,
        type
      });
    } else {
      ElementPlus.ElNotification({
        title,
        type
      });
    }
  }
  const _hoisted_1$1 = { class: "card" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "HelloWorld",
    props: {
      msg: {}
    },
    setup(__props) {
      const count = vue.ref(0);
      const getElementVersion = () => {
        okMsg("成功", "饿了么组件库成功");
      };
      const getUnoCssTest = () => {
        warnMsg("成功", "这这个按钮是unocss的样式效果");
      };
      const getJqTest = () => {
        console.log($("#ele-plus")[0]);
        okMsg("查找成功", "看控制台");
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("h1", null, vue.toDisplayString(_ctx.msg), 1),
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("button", {
              type: "button",
              onClick: _cache[0] || (_cache[0] = ($event) => count.value++)
            }, "count is " + vue.toDisplayString(count.value), 1),
            vue.createVNode(_component_el_button, {
              id: "ele-plus",
              type: "success",
              onClick: getElementVersion
            }, {
              default: vue.withCtx(() => _cache[1] || (_cache[1] = [
                vue.createTextVNode("饿了么")
              ])),
              _: 1
            }),
            vue.createElementVNode("button", {
              type: "button",
              onClick: getUnoCssTest,
              class: "bg-indigo-500 text-white rounded-lg-40"
            }, "unocss"),
            vue.createVNode(_component_el_button, {
              type: "warn",
              onClick: getJqTest
            }, {
              default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                vue.createTextVNode("jQuery")
              ])),
              _: 1
            }),
            _cache[3] || (_cache[3] = vue.createElementVNode("p", null, [
              vue.createTextVNode(" Edit "),
              vue.createElementVNode("code", null, "components/HelloWorld.vue"),
              vue.createTextVNode(" to test HMR ")
            ], -1))
          ]),
          _cache[4] || (_cache[4] = vue.createElementVNode("p", null, [
            vue.createTextVNode(" Check out "),
            vue.createElementVNode("a", {
              href: "https://vuejs.org/guide/quick-start.html#local",
              target: "_blank"
            }, "create-vue"),
            vue.createTextVNode(", the official Vue + Vite starter ")
          ], -1)),
          _cache[5] || (_cache[5] = vue.createElementVNode("p", null, [
            vue.createTextVNode(" Install "),
            vue.createElementVNode("a", {
              href: "https://github.com/johnsoncodehk/volar",
              target: "_blank"
            }, "Volar"),
            vue.createTextVNode(" in your IDE for a better DX ")
          ], -1)),
          _cache[6] || (_cache[6] = vue.createElementVNode("p", { class: "read-the-docs" }, "Click on the Vite and Vue logos to learn more", -1))
        ], 64);
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
  const HelloWorld = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-5689f7b5"]]);
  const viteLogoUrl = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='31.88'%20height='32'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20257'%3e%3cdefs%3e%3clinearGradient%20id='IconifyId1813088fe1fbc01fb466'%20x1='-.828%25'%20x2='57.636%25'%20y1='7.652%25'%20y2='78.411%25'%3e%3cstop%20offset='0%25'%20stop-color='%2341D1FF'%3e%3c/stop%3e%3cstop%20offset='100%25'%20stop-color='%23BD34FE'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient%20id='IconifyId1813088fe1fbc01fb467'%20x1='43.376%25'%20x2='50.316%25'%20y1='2.242%25'%20y2='89.03%25'%3e%3cstop%20offset='0%25'%20stop-color='%23FFEA83'%3e%3c/stop%3e%3cstop%20offset='8.333%25'%20stop-color='%23FFDD35'%3e%3c/stop%3e%3cstop%20offset='100%25'%20stop-color='%23FFA800'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20fill='url(%23IconifyId1813088fe1fbc01fb466)'%20d='M255.153%2037.938L134.897%20252.976c-2.483%204.44-8.862%204.466-11.382.048L.875%2037.958c-2.746-4.814%201.371-10.646%206.827-9.67l120.385%2021.517a6.537%206.537%200%200%200%202.322-.004l117.867-21.483c5.438-.991%209.574%204.796%206.877%209.62Z'%3e%3c/path%3e%3cpath%20fill='url(%23IconifyId1813088fe1fbc01fb467)'%20d='M185.432.063L96.44%2017.501a3.268%203.268%200%200%200-2.634%203.014l-5.474%2092.456a3.268%203.268%200%200%200%203.997%203.378l24.777-5.718c2.318-.535%204.413%201.507%203.936%203.838l-7.361%2036.047c-.495%202.426%201.782%204.5%204.151%203.78l15.304-4.649c2.372-.72%204.652%201.36%204.15%203.788l-11.698%2056.621c-.732%203.542%203.979%205.473%205.943%202.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505%204.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z'%3e%3c/path%3e%3c/svg%3e";
  const vueLogoUrl = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='37.07'%20height='36'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20198'%3e%3cpath%20fill='%2341B883'%20d='M204.8%200H256L128%20220.8L0%200h97.92L128%2051.2L157.44%200h47.36Z'%3e%3c/path%3e%3cpath%20fill='%2341B883'%20d='m0%200l128%20220.8L256%200h-51.2L128%20132.48L50.56%200H0Z'%3e%3c/path%3e%3cpath%20fill='%2335495E'%20d='M50.56%200L128%20133.12L204.8%200h-47.36L128%2051.2L97.92%200H50.56Z'%3e%3c/path%3e%3c/svg%3e";
  const unocssLogoUrl = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='64'%20height='108'%20viewBox='0%200%20256%20256'%3e%3cg%20fill='%23333'%3e%3cpath%20fill-opacity='.6'%20d='M137.176%20195.927c0-32.812%2026.6-59.412%2059.412-59.412S256%20163.115%20256%20195.927s-26.6%2059.412-59.412%2059.412s-59.412-26.6-59.412-59.412'/%3e%3cpath%20fill-opacity='.3'%20d='M137.176%2059.412C137.176%2026.6%20163.776%200%20196.588%200S256%2026.6%20256%2059.412v53.471a5.94%205.94%200%200%201-5.941%205.941H143.117a5.94%205.94%200%200%201-5.941-5.94z'/%3e%3cpath%20d='M118.824%20195.927c0%2032.812-26.6%2059.412-59.412%2059.412S0%20228.74%200%20195.927v-53.471a5.94%205.94%200%200%201%205.941-5.941h106.942c3.28%200%205.941%202.66%205.941%205.941z'/%3e%3c/g%3e%3c/svg%3e";
  const jqLogoUrl = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='128'%20height='128'%20viewBox='0%200%20128%20128'%3e%3cpath%20fill='%230868AC'%20d='M27.758%2020.421c-7.352%2010.565-6.437%2024.312-.82%2035.54l.411.798l.263.506l.164.291l.293.524q.261.46.536.919l.306.504q.304.489.622.973l.265.409q.439.656.901%201.301l.026.033l.152.205q.401.552.821%201.093l.309.393q.374.469.759.934l.29.346c.345.406.698.812%201.057%201.208l.021.022l.041.045c.351.383.71.758%201.075%201.133l.344.347q.424.425.858.841l.351.334q.579.547%201.176%201.07l.018.016l.205.174q.527.457%201.068.902l.442.353q.441.353.89.696l.477.361q.495.364.999.717l.363.258l.101.072c.318.22.645.431.97.642l.42.28c.5.315%201.007.628%201.519.93l.42.237q.565.326%201.14.639l.631.326l.816.424l.188.091l.334.161q.64.307%201.293.599l.273.122q.747.327%201.508.628l.368.144q.705.274%201.423.527l.179.062c.524.184%201.054.353%201.587.52l.383.114c.542.164%201.079.358%201.638.462c35.553%206.483%2045.88-21.364%2045.88-21.364c-8.674%2011.3-24.069%2014.28-38.656%2010.962c-.553-.125-1.089-.298-1.628-.456l-.406-.124a45%2045%200%200%201-1.568-.51l-.215-.077a50%2050%200%200%201-1.382-.513l-.388-.152q-.753-.297-1.492-.62l-.298-.133a55%2055%200%200%201-1.259-.585l-.364-.175c-.327-.159-.65-.328-.974-.495l-.649-.341q-.591-.316-1.167-.654l-.394-.219a58%2058%200%200%201-1.52-.932l-.41-.273a41%2041%200%200%201-1.081-.719l-.349-.245a54%2054%200%200%201-1.022-.738l-.453-.343q-.466-.355-.922-.721l-.411-.33q-.582-.476-1.149-.969l-.126-.105a55%2055%200%200%201-1.208-1.098l-.34-.328a33%2033%200%200%201-.868-.851l-.34-.34q-.543-.555-1.065-1.126l-.053-.057a42%2042%200%200%201-1.08-1.229l-.283-.336a45%2045%200%200%201-.777-.961l-.285-.355a53%2053%200%200%201-.898-1.195c-8.098-11.047-11.008-26.283-4.535-38.795m17.081-1.626c-5.316%207.65-5.028%2017.893-.88%2025.983a34%2034%200%200%200%202.351%203.925c.796%201.143%201.68%202.501%202.737%203.418c.383.422.784.834%201.193%201.238l.314.311q.594.579%201.218%201.132l.05.043l.012.012c.462.405.939.794%201.423%201.178l.323.252c.486.372.981.738%201.489%201.087l.043.033l.68.447l.322.213q.544.35%201.104.676l.156.092q.484.278.975.545l.347.18l.682.354l.103.047q.701.347%201.424.663l.314.13q.579.246%201.167.473l.5.184c.356.132.712.253%201.072.373l.484.155c.511.158%201.017.359%201.549.448c27.45%204.547%2033.787-16.588%2033.787-16.588c-5.712%208.228-16.775%2012.153-28.58%209.089a35%2035%200%200%201-1.555-.449l-.467-.151a29%2029%200%200%201-1.087-.374l-.491-.183a39%2039%200%200%201-1.171-.473l-.315-.133a33%2033%200%200%201-1.432-.666l-.718-.365l-.414-.213q-.46-.25-.909-.514l-.217-.123a31%2031%200%200%201-1.1-.672l-.332-.221l-.712-.472a37%2037%200%200%201-1.484-1.085l-.334-.264c-5.167-4.079-9.263-9.655-11.21-15.977c-2.041-6.557-1.601-13.917%201.935-19.891m14.847-.518c-3.134%204.612-3.442%2010.341-1.267%2015.435c2.293%205.407%206.992%209.648%2012.477%2011.66l.682.235l.3.096c.323.102.644.22.978.282c15.157%202.929%2019.268-7.777%2020.362-9.354c-3.601%205.185-9.653%206.43-17.079%204.627a19%2019%200%200%201-1.796-.555a22%2022%200%200%201-2.134-.886a22%2022%200%200%201-3.741-2.282c-6.645-5.042-10.772-14.659-6.436-22.492'/%3e%3cpath%20fill='%23131B28'%20d='M66.359%2096.295h-4.226a.56.56%200%200%200-.517.417l-1.5%206.94l-1.5%206.94a.554.554%200%200%201-.516.417h-2.991c-2.959%200-2.617-2.047-2.011-4.851l.018-.085l.066-.354l.012-.066l.135-.72l.145-.771l.154-.785l.682-3.332l.683-3.332a.336.336%200%200%200-.341-.419h-4.337a.55.55%200%200%200-.514.418l-.933%204.424l-.932%204.425l-.002.006l-.086.412c-1.074%204.903-.79%209.58%205.048%209.727l.17.003h9.163a.554.554%200%200%200%20.516-.417l1.976-9.289l1.976-9.29c.049-.23-.103-.417-.338-.418m-45.256-.049h-4.64a.56.56%200%200%200-.521.416l-.44%201.942l-.44%201.942c-.051.229.098.416.333.416h4.676a.56.56%200%200%200%20.518-.417l.425-1.941l.425-1.941c.049-.229-.101-.417-.336-.417m-1.346%206.044H15.08a.56.56%200%200%200-.521.416l-.657%202.91l-.656%202.909l-.183.834l-.631%202.97l-.63%202.971c-.049.229-.15.599-.225.821c0%200-.874%202.6-2.343%202.57l-.184-.004l-1.271-.023h-.001a.56.56%200%200%200-.524.407l-.485%202.039l-.484%202.038c-.055.228.093.416.326.42c.833.01%202.699.031%203.828.031c3.669%200%205.604-2.033%206.843-7.883l1.451-6.714l1.361-6.297c.049-.227-.103-.415-.337-.415m86.117-1.574l-.194-.801l-.191-.82l-.097-.414c-.38-1.477-1.495-2.328-3.917-2.328l-3.77-.004l-3.472-.005h-3.907a.55.55%200%200%200-.515.417l-.173.816l-.204.964l-.057.271l-1.759%208.24l-1.67%207.822c-.05.23-.066.512-.038.626c.028.115.479.209.713.209h3.524c.235%200%20.532-.042.66-.094s.317-.513.364-.742l.626-3.099l.627-3.1l.001-.005l.084-.413l.76-3.56l.671-3.144a.555.555%200%200%201%20.515-.417l11.089-.005c.235.002.383-.185.33-.414m14.275-7.24l-.854.003h-3.549a.9.9%200%200%200-.667.353l-7.849%2011.498c-.132.194-.283.166-.335-.062l-.578-2.533a.56.56%200%200%200-.522-.416h-5.045c-.235%200-.374.184-.31.409l2.261%207.921c.064.226.069.596.011.824l-.985%203.833c-.059.228.085.413.32.413h4.987a.58.58%200%200%200%20.532-.413l.986-3.833a2.5%202.5%200%200%201%20.363-.755l12.742-16.911c.142-.188.065-.341-.169-.339zm-40.086%209.919v-.004a.514.514%200%200%201-.499.441h-6.397c-.222%200-.334-.15-.301-.336l.006-.015l-.004.002l.003-.021l.029-.109c.611-1.624%201.855-2.69%204.194-2.69c2.634-.001%203.148%201.285%202.969%202.732m-1.877-7.384c-8.211%200-10.157%204.984-11.249%2010.015c-1.091%205.128-.998%209.921%207.5%209.921h1.03l.256-.001h.06l1.02-.003h.018c2.244-.009%204.495-.026%205.406-.033a.55.55%200%200%200%20.509-.42l.344-1.681l.067-.327l.41-2.006a.335.335%200%200%200-.341-.418h-7.639c-3.039%200-3.941-.807-3.608-3.181H84.18l-.001.001l.008-.001a.5.5%200%200%200%20.445-.315l.029-.106l-.001.001c1.813-6.839%201.293-11.445-6.474-11.446m-38.81%207.358l-.116.409v.001l-.922%203.268l-.922%203.267a.6.6%200%200%201-.543.411h-4.88c-3.702%200-4.604-2.896-3.702-7.166c.901-4.368%202.668-7.083%206.312-7.358c4.98-.376%205.976%203.126%204.773%207.168m3.348%207.105s2.301-5.588%202.823-8.814c.713-4.319-1.45-10.585-9.804-10.585c-8.306%200-11.914%205.981-13.29%2012.484c-1.376%206.55.427%2012.293%208.686%2012.246l6.516-.024l6.089-.022a.59.59%200%200%200%20.534-.414l1.061-4.046c.059-.228-.084-.414-.319-.416l-1.017-.006l-1.017-.006c-.199-.001-.313-.131-.289-.302zm41.12-3.741a.28.28%200%201%201-.56.001a.28.28%200%200%201%20.56-.001'/%3e%3c/svg%3e";
  const elpLogoUrl = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='128'%20height='128'%20viewBox='0%200%201024%201024'%3e%3cpath%20fill='%230284c7'%20d='M839.7%20734.7c0%2033.3-17.9%2041-17.9%2041S519.7%20949.8%20499.2%20960c-10.2%205.1-20.5%205.1-30.7%200c0%200-314.9-184.3-325.1-192c-5.1-5.1-10.2-12.8-12.8-20.5V368.6c0-17.9%2020.5-28.2%2020.5-28.2L466%20158.6q19.2-7.65%2038.4%200s279%20161.3%20309.8%20179.2c17.9%207.7%2028.2%2025.6%2025.6%2046.1c-.1-5-.1%20317.5-.1%20350.8M714.2%20371.2c-64-35.8-217.6-125.4-217.6-125.4c-7.7-5.1-20.5-5.1-30.7%200L217.6%20389.1s-17.9%2010.2-17.9%2023v297c0%205.1%205.1%2012.8%207.7%2017.9c7.7%205.1%20256%20148.5%20256%20148.5c7.7%205.1%2017.9%205.1%2025.6%200c15.4-7.7%20250.9-145.9%20250.9-145.9s12.8-5.1%2012.8-30.7v-74.2l-276.5%20169v-64c0-17.9%207.7-30.7%2020.5-46.1L745%20535c5.1-7.7%2010.2-20.5%2010.2-30.7v-66.6l-279%20169v-69.1c0-15.4%205.1-30.7%2017.9-38.4zM919%20135.7c0-5.1-5.1-7.7-7.7-7.7h-58.9V66.6c0-5.1-5.1-5.1-10.2-5.1l-30.7%205.1c-5.1%200-5.1%202.6-5.1%205.1V128h-56.3c-5.1%200-5.1%205.1-7.7%205.1v38.4h69.1v64c0%205.1%205.1%205.1%2010.2%205.1l30.7-5.1c5.1%200%205.1-2.6%205.1-5.1v-56.3h64z'/%3e%3c/svg%3e";
  const _hoisted_1 = {
    href: "https://vitejs.dev",
    target: "_blank"
  };
  const _hoisted_2 = ["src"];
  const _hoisted_3 = {
    href: "https://vuejs.org/",
    target: "_blank"
  };
  const _hoisted_4 = ["src"];
  const _hoisted_5 = {
    href: "https://element-plus.org/zh-CN/",
    target: "_blank"
  };
  const _hoisted_6 = ["src"];
  const _hoisted_7 = {
    href: "https://jquery.com/",
    target: "_blank"
  };
  const _hoisted_8 = ["src"];
  const _hoisted_9 = {
    href: "https://unocss.nodejs.cn/",
    target: "_blank"
  };
  const _hoisted_10 = ["src"];
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", null, [
            vue.createElementVNode("a", _hoisted_1, [
              vue.createElementVNode("img", {
                src: vue.unref(viteLogoUrl),
                class: "logo",
                alt: "Vite logo"
              }, null, 8, _hoisted_2)
            ]),
            vue.createElementVNode("a", _hoisted_3, [
              vue.createElementVNode("img", {
                src: vue.unref(vueLogoUrl),
                class: "logo vue",
                alt: "Vue logo"
              }, null, 8, _hoisted_4)
            ])
          ]),
          vue.createElementVNode("div", null, [
            vue.createElementVNode("a", _hoisted_5, [
              vue.createElementVNode("img", {
                src: vue.unref(elpLogoUrl),
                class: "logo element-plus",
                alt: "element-plus logo"
              }, null, 8, _hoisted_6)
            ]),
            vue.createElementVNode("a", _hoisted_7, [
              vue.createElementVNode("img", {
                src: vue.unref(jqLogoUrl),
                class: "logo jquery",
                alt: "jquery logo"
              }, null, 8, _hoisted_8)
            ]),
            vue.createElementVNode("a", _hoisted_9, [
              vue.createElementVNode("img", {
                src: vue.unref(unocssLogoUrl),
                class: "unocss",
                alt: "unocss logo"
              }, null, 8, _hoisted_10)
            ])
          ]),
          vue.createVNode(HelloWorld, { msg: "Vite + Vue + Elp + jQuery + unocss" })
        ], 64);
      };
    }
  });
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-da01b740"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const app = vue.createApp(App);
  app.use(ElementPlus);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );

})(Vue, jQuery, ElementPlus);
