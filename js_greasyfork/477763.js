// ==UserScript==
// @name         Appnify
// @namespace    appnify
// @version      0.0.0
// @author       monkey
// @description  A vite based tampermonkey starter
// @icon         https://vitejs.dev/logo.svg
// @match        *://*/*
// @require      https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://unpkg.com/@arco-design/web-vue@2.52.0/dist/arco-vue.min.js
// @resource     @arco-design/web-vue/dist/arco.css  https://unpkg.com/@arco-design/web-vue@2.52.0/dist/arco.css
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/477763/Appnify.user.js
// @updateURL https://update.greasyfork.org/scripts/477763/Appnify.meta.js
// ==/UserScript==

(r=>{const n=document.createElement("style");n.dataset.source="vite-plugin-monkey",n.textContent=r,document.head.append(n)})(` html body{--border-radius-small: 4px}.arco-table table td,.arco-table table th{border-top:none;border-right:none;border-left:none;padding:0}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgba(0,0,0,0);--un-ring-shadow:0 0 rgba(0,0,0,0);--un-shadow-inset: ;--un-shadow:0 0 rgba(0,0,0,0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgba(0,0,0,0);--un-ring-shadow:0 0 rgba(0,0,0,0);--un-shadow-inset: ;--un-shadow:0 0 rgba(0,0,0,0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.i-icon-park-outline-download{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 48 48' display='inline-block' vertical-align='-2px' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cg fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M6 24.008V42h36V24'/%3E%3Cpath d='m33 23l-9 9l-9-9m8.992-17v26'/%3E%3C/g%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;display:inline-block;vertical-align:-2px;width:1em;height:1em}.ml-2{margin-left:.5rem} `);

(function (vue, webVue) {
  'use strict';

  const useComponent = (component, props = {}) => {
    const el = document.createElement("span");
    const vnode = vue.createVNode(component, props);
    vue.render(vnode, el);
    const node = vnode.el;
    const unmount = () => vue.render(null, el);
    const remove = () => (unmount(), el.remove());
    console.log(vnode);
    return { el, node, vnode, unmount, remove };
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const download = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
  };
  const json2DataUrl = (json) => {
    const content = encodeURIComponent(JSON.stringify(json));
    return `data:text/json;charset=utf-8,${content}`;
  };
  const downloadJSON = (json, filename = "data.json") => {
    const url = json2DataUrl(json);
    download(url, filename);
  };
  const definePage = (page) => {
    return page;
  };
  const __vite_glob_0_0 = definePage({
    when: () => {
      const isHost = location.hostname === "www.iconfont.cn";
      const params = new URLSearchParams(location.search);
      const isType = params.get("manage_type") === "myprojects";
      return isHost && isType;
    },
    work: async () => {
      await sleep(2e3);
      const box = document.querySelector(".project-iconlist");
      const btn = useComponent(DownloadButton);
      if (box) {
        box.prepend(btn.node);
      }
    }
  });
  const DownloadButton = /* @__PURE__ */ vue.defineComponent({
    name: "DownloadButton",
    setup() {
      const loading = vue.ref(false);
      const btnRef = vue.ref(null);
      const onBtnRef = (el) => btnRef.value = el;
      const getDetailJSON = async () => {
        const pid = new URLSearchParams(location.search).get("projectId");
        const url = `/api/project/detail.json?pid=${pid}`;
        const resData = await (await fetch(url)).json();
        if (resData.code !== 200) {
          throw new Error(resData.message);
        }
        const result = {};
        for (let {
          show_svg,
          font_class
        } of resData.data.icons) {
          show_svg = show_svg.replace("currentColor", "transparent");
          result[font_class] = show_svg;
        }
        return result;
      };
      const onConfirm = async () => {
        console.log(btnRef);
        try {
          loading.value = true;
          const data = await getDetailJSON();
          downloadJSON(data);
        } catch (e) {
          webVue.Message.error(e == null ? void 0 : e.message);
        } finally {
          loading.value = false;
        }
      };
      return () => vue.createVNode(webVue.Button, {
        "ref": onBtnRef,
        "type": "primary",
        "size": "small",
        "class": "ml-2",
        "loading": loading.value,
        "onClick": onConfirm
      }, {
        icon: () => vue.createVNode("i", {
          "class": "i-icon-park-outline-download"
        }, null),
        default: () => "下载"
      });
    }
  });
  const files = /* @__PURE__ */ Object.assign({ "./page-iconfont.tsx": __vite_glob_0_0 });
  const pages = Object.values(files);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("@arco-design/web-vue/dist/arco.css");
  const run = () => {
    for (const page of pages) {
      if (page.when()) {
        page.work();
      }
    }
  };
  run();

})(Vue, ArcoVue);
