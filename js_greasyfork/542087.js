// ==UserScript==
// @name         任意元素实现画中画
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @description  注册右键菜单;脚本运行后,鼠标hover到元素上时,出现切换画中画提示
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.17/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.10.2/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.10.2/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/542087/%E4%BB%BB%E6%84%8F%E5%85%83%E7%B4%A0%E5%AE%9E%E7%8E%B0%E7%94%BB%E4%B8%AD%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/542087/%E4%BB%BB%E6%84%8F%E5%85%83%E7%B4%A0%E5%AE%9E%E7%8E%B0%E7%94%BB%E4%B8%AD%E7%94%BB.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" .webpack-monkey-container{position:fixed;top:80px;left:60px;z-index:9999}.tm-hover-highlight{outline:2px solid rgba(0,123,255,.7);background-color:#007bff1a!important;border-radius:4px;transition:all .2s ease;z-index:9999999;box-shadow:6px 6px 8px 2px #d1d9e6;cursor:pointer}.dark-mode{filter:invert(.9) hue-rotate(180deg);background:#111!important} ");

(function (vue, elementPlus) {
  'use strict';

  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  function applyComputedStyles(source, target) {
    const computedStyle = window.getComputedStyle(source);
    for (let prop of computedStyle) {
      target.style[prop] = computedStyle.getPropertyValue(prop);
    }
    Array.from(source.children).forEach((child, index) => {
      applyComputedStyles(
        child,
        target.children[index]
      );
    });
  }
  function importPageStyles(doc) {
    document.querySelectorAll("link[rel='stylesheet']").forEach((link) => {
      const newLink = doc.createElement("link");
      newLink.rel = "stylesheet";
      newLink.href = link.href;
      doc.head.appendChild(newLink);
    });
    document.querySelectorAll("style").forEach((style) => {
      const newStyle = doc.createElement("style");
      newStyle.textContent = style.textContent;
      doc.head.appendChild(newStyle);
    });
  }
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      let highlightedElement = null;
      let pipWindow = null;
      const registerListener = () => {
        const removeHighlightedElementStyle = () => {
          if (highlightedElement) {
            highlightedElement.classList.remove("tm-hover-highlight");
          }
        };
        const highlighElement = (event) => {
          var _a;
          removeHighlightedElementStyle();
          if ((_a = event.target) == null ? void 0 : _a.closest(".tm-notification")) {
            return;
          }
          highlightedElement = event.target;
          highlightedElement.classList.add("tm-hover-highlight");
        };
        const click = (event) => {
          event.preventDefault();
          event.stopPropagation();
        };
        const activePip = async (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (pipWindow) {
            pipWindow.close();
            pipWindow = null;
            return;
          }
          if (!highlightedElement) {
            return elementPlus.ElMessage.error("⚠️ 未选择有效的元素！");
          }
          removeHighlightedElementStyle();
          const clonedElement = highlightedElement.cloneNode(true);
          applyComputedStyles(highlightedElement, clonedElement);
          pipWindow = await window.documentPictureInPicture.requestWindow({
            width: highlightedElement.clientWidth + 20,
            height: highlightedElement.clientHeight + 20
          });
          const doc = pipWindow.document;
          doc.body.appendChild(clonedElement);
          importPageStyles(doc);
          pipWindow.addEventListener("pagehide", () => {
            pipWindow = null;
          });
          pipWindow.addEventListener("resize", () => {
            console.log(pipWindow.innerWidth, pipWindow.innerHeight);
          });
          document.removeEventListener("mouseout", removeHighlightedElementStyle);
          document.removeEventListener("mouseover", highlighElement);
          document.removeEventListener("click", click, true);
          document.removeEventListener("dblclick", activePip, true);
        };
        document.addEventListener("mouseover", highlighElement);
        document.addEventListener("mouseout", removeHighlightedElementStyle);
        document.addEventListener("click", click, true);
        document.addEventListener("dblclick", activePip, true);
      };
      vue.onMounted(() => {
        elementPlus.ElNotification({
          title: "画中画脚本",
          message: "双击任意激活区域可开启画中画功能",
          type: "success",
          duration: 1500,
          showClose: true,
          customClass: "tm-notification"
        });
        registerListener();
      });
      return () => {
      };
    }
  });
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  console.log("=========油猴脚本已加载=========");
  _GM_registerMenuCommand("📢 启用画中画功能", () => {
    if (!("documentPictureInPicture" in window)) {
      alert("⚠️ 当前浏览器不支持 PiP 功能！");
    } else {
      const container = document.createElement("div");
      container.id = "webpack-monkey-app";
      document.body.appendChild(container);
      const app = vue.createApp(_sfc_main);
      app.mount(container);
    }
  });

})(Vue, ElementPlus);