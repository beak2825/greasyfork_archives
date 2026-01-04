// ==UserScript==
// @name         🔥教育盘资源免费下载助学盘还可用（已失效）🔥
// @namespace    https://www.softrr.cn/
// @version      2.0.
// @author       hackhase
// @description  一键复制教育盘下载链接，并自动打开网盘下载地址，让你轻松获取想要的资源
// @license      MIT
// @icon         https://jiaoyupan.com/source/plugin/levnav/statics/img/nav_icon_1.jpg
// @match        *://jiaoyupan.cc/*
// @match        *://zhuxuepan.com/*
// @match        *://bbs.pan52.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.13/dist/vue.global.prod.js
// @connect      www.softrr.cn
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/516952/%F0%9F%94%A5%E6%95%99%E8%82%B2%E7%9B%98%E8%B5%84%E6%BA%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E5%8A%A9%E5%AD%A6%E7%9B%98%E8%BF%98%E5%8F%AF%E7%94%A8%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/516952/%F0%9F%94%A5%E6%95%99%E8%82%B2%E7%9B%98%E8%B5%84%E6%BA%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%E5%8A%A9%E5%AD%A6%E7%9B%98%E8%BF%98%E5%8F%AF%E7%94%A8%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89%F0%9F%94%A5.meta.js
// ==/UserScript==
 
(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.modal-wrapper[data-v-0953015d]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modal[data-v-0953015d]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-0953015d]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-0953015d]{margin:0;font-size:20px;font-weight:700}.header button[data-v-0953015d]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.content[data-v-0953015d]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.content .produce p[data-v-0953015d]{margin-top:15px}.content .produce .ipt[data-v-0953015d]{margin-top:15px;height:35px!important;border-radius:5px;padding-left:10px}.content .img[data-v-0953015d]{display:flex;align-items:center;justify-content:center}.content .img img[data-v-0953015d]{width:180px}input[data-v-0953015d]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.copy[data-v-5bdf8e40]{width:100px;position:fixed;right:10px;top:80px;color:#111;z-index:999}.copy .btn[data-v-5bdf8e40]{float:left;width:100%;height:40px;font-size:14px;border-radius:5%;background-color:red;color:#fff}.copy .btn[data-v-5bdf8e40]:hover{flex:25%;background-color:#87ceeb;color:#fff} ");
 
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
  const _withScopeId = (n) => (vue.pushScopeId("data-v-0953015d"), n = n(), vue.popScopeId(), n);
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
        type: Number || String
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
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0953015d"]]);
  const getCode = () => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.softrr.cn/crawler/getCode`,
        headers: {
          Referer: "https://www.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response).data[0].code);
        }
      });
    });
  };
  const _hoisted_1 = { class: "copy" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      var copy_pswd = document.querySelector(".wpdown_dl").children[0].href;
      var copyArr = copy_pswd.split("&");
      console.log(copyArr);
      var aid = copyArr[2].split("=")[1];
      var formhash = copyArr[4].split("=")[1];
      const code = vue.ref();
      const model = vue.ref("");
      const onDownload = async () => {
        let locaCode = localStorage.getItem("code") || "";
        code.value = await getCode();
        if (locaCode == code.value) {
          window.open(
            "https://www.jiaoyupan.vip/plugin.php?id=threed_attach:downld&aid=" + aid + "&formhash=" + formhash,
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
          }, "一键下载"),
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
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5bdf8e40"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
 
})(Vue);