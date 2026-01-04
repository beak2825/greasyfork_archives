// ==UserScript==
// @name         vite-monkey-csdn-test
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       wyd
// @description  CSDN 删除广告 DEMO
// @include      *://*.csdn.net/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.27/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.7.3/dist/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.7.3/dist/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/496531/vite-monkey-csdn-test.user.js
// @updateURL https://update.greasyfork.org/scripts/496531/vite-monkey-csdn-test.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .v-button[data-v-ba5aff76]{width:44px!important;height:44px!important;font-size:32px!important;margin-top:8px} ");

(function (vue, elementPlus) {
  'use strict';

  /*! Element Plus Icons Vue v2.3.1 */
  var star_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Star",
    __name: "star",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"
        })
      ]));
    }
  });
  var star_default = star_vue_vue_type_script_setup_true_lang_default;
  const _withScopeId = (n) => (vue.pushScopeId("data-v-ba5aff76"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "app" };
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "This is a message", -1));
  const _hoisted_3 = { class: "dialog-footer" };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const dialogVisible = vue.ref(false);
      const handleClose = (done) => {
        elementPlus.ElMessageBox.confirm("Are you sure to close this dialog?").then(() => {
          done();
        }).catch(() => {
        });
      };
      const handleOpen = () => {
        dialogVisible.value = true;
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createVNode(vue.unref(elementPlus.ElButton), {
              color: "white",
              type: "warning",
              icon: vue.unref(star_default),
              size: "large",
              circle: "",
              class: "v-button",
              onClick: handleOpen
            }, null, 8, ["icon"])
          ]),
          vue.createVNode(vue.unref(elementPlus.ElDialog), {
            modelValue: dialogVisible.value,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogVisible.value = $event),
            title: "Tips",
            width: "500",
            "before-close": handleClose
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_3, [
                vue.createVNode(vue.unref(elementPlus.ElButton), {
                  onClick: _cache[0] || (_cache[0] = ($event) => dialogVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("Cancel")
                  ]),
                  _: 1
                }),
                vue.createVNode(vue.unref(elementPlus.ElButton), {
                  type: "primary",
                  onClick: _cache[1] || (_cache[1] = ($event) => dialogVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" Confirm ")
                  ]),
                  _: 1
                })
              ])
            ]),
            default: vue.withCtx(() => [
              _hoisted_2
            ]),
            _: 1
          }, 8, ["modelValue"])
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ba5aff76"]]);
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  function init() {
    console.log("vite-monkey-csdn-script init");
    _GM_addStyle(".login-mark,#passportbox{display:none!important;}");
    _GM_addStyle(".passport-login-container{display:none!important;}");
    $("li[data-type='ad']").remove();
    $("div[id^=kp_box]").remove();
    $(".recommend-box").remove();
    $(".blog-footer-bottom").remove();
    $("#asideWriteGuide").remove();
    $("div[data-pid='blog']").remove();
    $("#csdn-redpack").remove();
    $(".toolbar-advert").remove();
    $(".hljs-button").removeClass("signin");
    $(".hljs-button").addClass("{2}");
    $(".hljs-button").attr("data-title", "免登录复制");
    $(".hljs-button").attr("onclick", "hljs.copyCode(event)");
    $("code").attr("onclick", "mdcp.copyCode(event)");
    try {
      Object.defineProperty(window, "articleType", {
        value: 0,
        writable: false,
        configurable: false
      });
    } catch (err) {
    }
    var ef = document.getElementsByClassName("hide-article-box text-center")[0];
    if (ef) {
      ef.remove();
      document.getElementById("article_content").style.height = "auto";
    }
  }
  vue.createApp(App).mount(
    (() => {
      var _a;
      const app = document.createElement("div");
      (_a = $(".option-box[data-type='cs']")) == null ? void 0 : _a.after(app);
      init();
      return app;
    })()
  );

})(Vue, ElementPlus);