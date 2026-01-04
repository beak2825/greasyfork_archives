// ==UserScript==
// @name         jiaoyupan资源
// @namespace    https://www.jyp.com/
// @version      1.0.0
// @author       hackhase
// @description  一键复制教育盘下载链接，并自动打开网盘下载地址，让你轻松获取想要的资源
// @license      MIT
// @icon         https://jiaoyupan.com/source/plugin/levnav/statics/img/nav_icon_1.jpg
// @match        https://jiaoyupan.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.13/dist/vue.global.prod.js
// @connect      www.softrr.cn
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/484899/jiaoyupan%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/484899/jiaoyupan%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.modal-wrapper[data-v-706295c3]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modal[data-v-706295c3]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-706295c3]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-706295c3]{margin:0;font-size:20px;font-weight:700}.header button[data-v-706295c3]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.content[data-v-706295c3]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.content .produce p[data-v-706295c3]{margin-top:15px}.content .produce .ipt[data-v-706295c3]{margin-top:15px;height:35px!important;border-radius:5px;padding-left:10px}.content .img[data-v-706295c3]{display:flex;align-items:center;justify-content:center}.content .img img[data-v-706295c3]{width:180px}input[data-v-706295c3]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.copy[data-v-50566f70]{width:130px;position:fixed;right:10px;top:80px;color:#111;z-index:999}.copy .btn[data-v-50566f70]{float:left;width:100%;background-color:red;color:#fff}.copy .btn[data-v-50566f70]:hover{flex:25%;background-color:#87ceeb;color:#fff} ");

(function (vue) {
  'use strict';

  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-706295c3"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "modal" };
  const _hoisted_2 = { class: "header" };
  const _hoisted_3 = { class: "content" };
  const _hoisted_4 = { class: "produce" };
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧公众号，点击关注！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、在软件爬取者后台回复：验证码", -1));
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "3、在下方输入框输入获取的验证码后回车", -1));
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "img" }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      src: "https://www.softrr.cn/assets/pqz-daa4b840.jpg",
      alt: ""
    })
  ], -1));
  const _sfc_main$1 = {
    __name: "Model",
    props: {
      title: {
        type: String,
        required: true
      },
      code: {
        type: String || Number
      }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const visible = vue.ref(false);
      const openModal = () => {
        visible.value = true;
      };
      const closeModal = () => {
        visible.value = false;
      };
      __expose({
        visible,
        openModal,
        closeModal
      });
      const codeValue = vue.ref();
      const enterCode = () => {
        if (codeValue.value == props.code) {
          localStorage.setItem("code", codeValue.value);
          visible.value = false;
          alert("验证成功，请再次点击一键下载按钮！");
          codeValue.value = "";
        } else {
          alert("验证码错误，请重新输入！");
          codeValue.value = "";
        }
      };
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "modal-wrapper",
          onClick: vue.withModifiers(closeModal, ["self"])
        }, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("h2", null, vue.toDisplayString(__props.title), 1),
              vue.createElementVNode("button", { onClick: closeModal }, "X")
            ]),
            vue.createElementVNode("div", _hoisted_3, [
              vue.createElementVNode("div", _hoisted_4, [
                _hoisted_5,
                _hoisted_6,
                _hoisted_7,
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "ipt",
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => codeValue.value = $event),
                  onKeydown: vue.withKeys(enterCode, ["enter"]),
                  placeholder: "请输入验证码后按回车"
                }, null, 544), [
                  [vue.vModelText, codeValue.value]
                ])
              ]),
              _hoisted_8
            ])
          ])
        ], 512)), [
          [vue.vShow, visible.value]
        ]);
      };
    }
  };
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-706295c3"]]);
  const _hoisted_1 = { class: "copy" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      var copy_pswd = document.querySelector(".copy_pswd").attributes.onclick.nodeValue;
      var copyArr = copy_pswd.split(",");
      var aid = copyArr[0].split("'")[1];
      var formhash = copyArr[1].split("'")[1];
      const code = vue.ref();
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.softrr.cn/crawler/getCode`,
        headers: {
          Referer: "https://www.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          code.value = JSON.parse(res.response).data[0].code;
        }
      });
      const model = vue.ref("");
      const onDownload = () => {
        let locaCode = localStorage.getItem("code") || "";
        if (locaCode == code.value) {
          window.open(
            "https://jiaoyupan.com/plugin.php?id=threed_attach:downld&aid=" + aid + "&formhash=" + formhash,
            "_blank"
          );
        } else {
          model.value.openModal();
        }
      };
      const title = vue.ref("为了防止滥用，本插件采取必要的验证手段。");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createElementVNode("button", {
            onClick: onDownload,
            class: "btn"
          }, "一键复制下载"),
          vue.createVNode(Model, {
            title: title.value,
            code: code.value,
            ref_key: "model",
            ref: model
          }, null, 8, ["title", "code"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-50566f70"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);