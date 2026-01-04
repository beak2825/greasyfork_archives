// ==UserScript==
// @name         易浏览
// @namespace    yicode
// @version      1.0.0
// @author       https://yicode.tech
// @description  易编程科技 - 专注于浏览器体验增强油猴插件
// @license      Apache 2.0
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAmVBMVEUAAABIs/9Ns/9Vqv9QpP9NqP9Jsv9LsP9Itv9Itf9Mrf9ItP9QoP9Nr/////9QqP9Itf/p9v9Ksv9Qo/9Orf9Pqv/u+P9Ppf/z+v9MsP/6/f/3/P/S6f+02f+MxP/N5f9ntf/n8//h8f/c7v/F4/+s2P+cy/+BxP+Dvf9xtv9YrP+83v+azP+Ry/96vf98uf9gtf9orf9Ypf8Mfy5YAAAADHRSTlMAgAoG/Nms59TRyaRgAzOMAAABG0lEQVQ4y3WT2XaCMBBAJ2x2iYkhCFQWqVpb7d7//7iOMSdDIN7Xe5mZPAAAEXu8X1nyfGkoirWU8iEChK0caA1oDbpiAPFNXWnOqxiY0xarJWokhcz3w2A/51cSuDP+yfrXpvkij2iYeCHqEwbcAWP/UwukPEvtBXT+Thj26CkgvzwIy3Yc0IJP4TiNAhrwTEE3CtyAF0GoNwrcgHocHCgIDdgoGgF0AVEr1U2DYiOIUql2FngbkGmwrr0BajsN5N75RiHdLHinN144zgJZuhfQBi/ozX2lMnwHAtntSqvbns8D5PzRGn384+EAGfr+l+Q8QLiPhgX9DaEggWwSaD9IIcpNUEhL5W+IAFh++4iKARJni+AOnaQxwD/1iTqyx1cHaAAAAABJRU5ErkJggg==
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.45/dist/vue.global.prod.js
// @grant        GM_addElement
// @grant        GM_cookie
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/455452/%E6%98%93%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455452/%E6%98%93%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(e=>{const o=document.createElement("style");o.dataset.source="vite-plugin-monkey",o.innerText=e,document.head.appendChild(o)})(":root{font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}.yibrowser[data-v-2d848074]{position:fixed;z-index:999999999;top:10px;right:10px;width:200px;height:100px;border:1px solid #858585;border-radius:4px;padding:10px;box-shadow:0 0 8px #161515;background-color:#f7f7f7}.yibrowser .box[data-v-2d848074]{width:100%;background-color:#e1ecf4;border-radius:3px;border:1px solid #7aa7c7;box-shadow:#ffffffb3 0 1px inset;box-sizing:border-box;color:#39739d;cursor:pointer;display:inline-block;font-family:-apple-system,system-ui,Segoe UI,Liberation Sans,sans-serif;font-size:13px;font-weight:400;line-height:1.15385;margin:0;outline:none;padding:8px .8em;position:relative;text-align:center;text-decoration:none;user-select:none;-webkit-user-select:none;touch-action:manipulation;vertical-align:baseline;white-space:nowrap;transition:all .2s}.yibrowser .box[data-v-2d848074]:hover,.yibrowser .box[data-v-2d848074]:focus{background-color:#b3d3ea;color:#2c5777}.yibrowser .box[data-v-2d848074]:focus{box-shadow:0 0 0 4px #0095ff26}.yibrowser .box[data-v-2d848074]:active{background-color:#a0c7e4;box-shadow:none;color:#2c5777}");

(function(vue) {
  "use strict";
  const style = "";
  var t = ["Shift", "Meta", "Alt", "Control"], e = "object" == typeof navigator && /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "Meta" : "Control";
  function n(t2, e2) {
    return "function" == typeof t2.getModifierState && t2.getModifierState(e2);
  }
  function r(t2) {
    return t2.trim().split(" ").map(function(t3) {
      var n2 = t3.split(/\b\+/), r2 = n2.pop();
      return [n2 = n2.map(function(t4) {
        return "$mod" === t4 ? e : t4;
      }), r2];
    });
  }
  function o(e2, o2) {
    var i2;
    void 0 === o2 && (o2 = {});
    var u = null != (i2 = o2.timeout) ? i2 : 1e3, a = Object.keys(e2).map(function(t2) {
      return [r(t2), e2[t2]];
    }), f = /* @__PURE__ */ new Map(), c = null;
    return function(e3) {
      e3 instanceof KeyboardEvent && (a.forEach(function(r2) {
        var o3 = r2[0], i3 = r2[1], u2 = f.get(o3) || o3;
        !function(e4, r3) {
          return !(r3[1].toUpperCase() !== e4.key.toUpperCase() && r3[1] !== e4.code || r3[0].find(function(t2) {
            return !n(e4, t2);
          }) || t.find(function(t2) {
            return !r3[0].includes(t2) && r3[1] !== t2 && n(e4, t2);
          }));
        }(e3, u2[0]) ? n(e3, e3.key) || f.delete(o3) : u2.length > 1 ? f.set(o3, u2.slice(1)) : (f.delete(o3), i3(e3));
      }), c && clearTimeout(c), c = setTimeout(f.clear.bind(f), u));
    };
  }
  function i(t2, e2, n2) {
    var r2;
    void 0 === n2 && (n2 = {});
    var i2 = null != (r2 = n2.event) ? r2 : "keydown", u = o(e2, n2);
    return t2.addEventListener(i2, u), function() {
      t2.removeEventListener(i2, u);
    };
  }
  var monkeyWindow = window;
  var GM_openInTab = /* @__PURE__ */ (() => monkeyWindow.GM_openInTab)();
  const App_vue_vue_type_style_index_0_scoped_2d848074_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "yibrowser" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      let $Data = vue.ref({
        isShowDD: false
      });
      i(window, {
        "d d": () => {
          $Data.value.isShowDD = !$Data.value.isShowDD;
        }
      });
      async function fnOpenInVscodeDev() {
        if (location.origin === "https://github.com") {
          $Data.value.isShowDD = false;
          GM_openInTab(`https://vscode.dev/${location.href}`, { active: true });
        }
      }
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("div", {
            class: "box",
            onClick: fnOpenInVscodeDev
          }, "\u4F7F\u7528vscode.dev\u6253\u5F00")
        ], 512)), [
          [vue.vShow, $Data.value.isShowDD === true]
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2d848074"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
})(Vue);
