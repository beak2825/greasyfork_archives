// ==UserScript==
// @name         原神语音听书导入
// @namespace    https://yfi.moe
// @version      0.1.3
// @author       Yunfi <i@yfi.moe>
// @description  从 https://bv2.firefly.matce.cn 导入原神语音用于听书
// @license      MIT
// @icon         https://bv2.firefly.matce.cn/favicon.ico
// @match        https://bv2.firefly.matce.cn/*
// @require      https://cdn.staticfile.org/vue/3.4.21/vue.global.prod.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489531/%E5%8E%9F%E7%A5%9E%E8%AF%AD%E9%9F%B3%E5%90%AC%E4%B9%A6%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/489531/%E5%8E%9F%E7%A5%9E%E8%AF%AD%E9%9F%B3%E5%90%AC%E4%B9%A6%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#202020de;background-color:#fff;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}.v-a{font-weight:500;color:#646cff;text-decoration:inherit}.v-a:hover{color:#535bf2}h1{font-size:3.2em;line-height:1.1}.v-button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#f9f9f9;cursor:pointer;transition:border-color .25s}.v-button:hover{border-color:#646cff}.card{padding:2em}@media (prefers-color-scheme: dark){:root{color:#ffffffde;background-color:#0b0f19}.v-a:hover{color:#747bff}.v-button{background-color:#343434}}#iread-oc-modal[data-v-63501ad3]{position:fixed;margin:auto;border:none;border-radius:1rem;box-shadow:0 0 10px #0000001a;padding:3rem}.close-dialog[data-v-63501ad3]{position:absolute;top:.5rem;right:.5rem}.inner-modal[data-v-63501ad3]{display:flex;flex-direction:column;gap:1rem;background-color:#fff}.btn-a[data-v-63501ad3]{text-decoration:none;color:inherit;text-align:center}.show-btn[data-v-43b38518]{position:fixed;bottom:1rem;right:1rem;border-radius:9999px}.btn-card[data-v-43b38518]{position:fixed;bottom:4rem;right:1rem;display:flex;flex-direction:column;gap:1rem;padding:1rem;background-color:#fff;border-radius:1rem;box-shadow:0 0 10px #0000001a}@media (prefers-color-scheme: dark){.btn-card[data-v-43b38518]{background-color:#222}}.slide-enter-active[data-v-43b38518],.slide-leave-active[data-v-43b38518]{transition:all .15s ease-in-out}.slide-enter-from[data-v-43b38518],.slide-leave-to[data-v-43b38518]{transform:translate(100%);opacity:0} ");

(function (vue) {
  'use strict';

  function generateRandomString(digits = 32) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < digits; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
  function getConfig() {
    const selectors = [
      null,
      "#component-5 > label > div > div.wrap-inner > div > input",
      "#range_id_0",
      "#range_id_1",
      "#range_id_2",
      "#range_id_3",
      "#component-14 > label > div > div.wrap-inner > div > input",
      "#component-29 > label > input",
      "#range_id_6",
      "#range_id_5",
      null,
      "#component-8 > label > textarea",
      "#component-22 > label > textarea",
      "#range_id_4"
    ];
    let data = [];
    for (const selector of selectors) {
      data.push(
        selector ? document.querySelector(selector).value : null
      );
    }
    if (!data[1]) {
      alert("请选择角色，或者等待页面加载完全后再点击按钮");
      throw new Error("not getting data from page");
    }
    for (let i of [2, 3, 4, 5, 8, 9, 13]) {
      data[i] = parseFloat(data[i]);
    }
    data[7] = false;
    return {
      data,
      event_data: null,
      fn_index: 0,
      session_hash: null
    };
  }
  function copy2Clipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("已复制到剪贴板");
    }).catch((error) => {
      console.error("复制到剪贴板失败", error);
    });
  }
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "CopyIRead",
    setup(__props) {
      function generateIReadConfig() {
        const originConfig = getConfig();
        originConfig.data[0] = "%@";
        const body = JSON.stringify(originConfig);
        const process = `@dyn:
p=def:"|'|\\n @=>;
txt=keyword.jxd_executeRegexRules:p;
format('${body}',txt)`;
        const iReadTemplate = {
          _ClassName: "JxdAdvCustomTTS",
          _TTSConfigID: generateRandomString(),
          maxWordCount: "200",
          ttsConfigGroup: "☁️",
          ttsHandles: [
            {
              processType: 1,
              maxPageCount: 1,
              nextPageForGetMedthod: 1,
              forGetMethod: 0,
              requestByWebView: 0,
              nextPageParams: {},
              url: "https://bv2.firefly.matce.cn/run/predict",
              parser: {
                audioUrl: '@str:"https://bv2.firefly.matce.cn/file={{@json:data[1].name}}"'
              },
              httpConfigs: {
                useCookies: 1,
                headers: {
                  "Content-Type": "application/json"
                },
                customFormatParams: "params[data]"
              },
              params: {
                data: process
              }
            },
            {
              maxPageCount: 1,
              nextPageForGetMedthod: 1,
              requestByWebView: 0,
              forGetMethod: 1,
              processType: 1,
              params: {},
              nextPageParams: {},
              url: "@json:audioUrl",
              parser: {
                playData: "ResponseData"
              },
              httpConfigs: {
                useCookies: 1,
                headers: {}
              }
            }
          ],
          _TTSName: "☁️ - MHY " + originConfig.data[1]
        };
        return iReadTemplate;
      }
      function copyIRead() {
        const iReadConfig = generateIReadConfig();
        copy2Clipboard(JSON.stringify(iReadConfig));
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("button", {
            onClick: copyIRead,
            class: "v-button"
          }, "复制爱阅记配置")
        ]);
      };
    }
  });
  const _sfc_main$3 = {
    name: "MingcuteCloseLine"
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$2 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24"
  };
  const _hoisted_2$1 = /* @__PURE__ */ vue.createElementVNode("g", {
    fill: "none",
    fillRule: "evenodd"
  }, [
    /* @__PURE__ */ vue.createElementVNode("path", { d: "M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" }),
    /* @__PURE__ */ vue.createElementVNode("path", {
      fill: "#888888",
      d: "m12 13.414l5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586L6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z"
    })
  ], -1);
  const _hoisted_3$1 = [
    _hoisted_2$1
  ];
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, _hoisted_3$1);
  }
  const MingcuteCloseLine = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-63501ad3"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { id: "iread-oc-modal" };
  const _hoisted_2 = { class: "inner-modal" };
  const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("h5", { style: { "font-size": "large", "margin": "0.5rem auto" } }, " 爱阅记一键导入 ", -1));
  const _hoisted_4 = ["href"];
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "OneClickIRead",
    setup(__props) {
      const ocURL = vue.ref("");
      function closeModal() {
        const modal = document.getElementById(
          "iread-oc-modal"
        );
        if (modal)
          modal.close();
      }
      function getUrl() {
        const { data } = getConfig();
        if (!data)
          throw new Error("No data in config");
        data[0] = "%@";
        const dataUrl = `${BACKEND_URL}/api/gvits/ireadnote?data=${encodeURIComponent(
        JSON.stringify(data)
      )}`;
        const importUrl = `iReadNote://import/itts=${dataUrl}`;
        return importUrl;
      }
      function openModal() {
        const modal = document.getElementById(
          "iread-oc-modal"
        );
        if (modal)
          modal.showModal();
        ocURL.value = getUrl();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("dialog", _hoisted_1$1, [
            vue.createVNode(MingcuteCloseLine, {
              onClick: closeModal,
              class: "close-dialog"
            }),
            vue.createElementVNode("div", _hoisted_2, [
              _hoisted_3,
              vue.createElementVNode("a", {
                href: ocURL.value,
                class: "v-button btn-a",
                target: "_blank"
              }, "直接导入", 8, _hoisted_4),
              vue.createElementVNode("button", {
                onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(copy2Clipboard)(ocURL.value)),
                class: "v-button"
              }, " 复制链接 ")
            ])
          ]),
          vue.createElementVNode("div", null, [
            vue.createElementVNode("button", {
              onClick: openModal,
              class: "v-button"
            }, "爱阅记一键导入")
          ])
        ], 64);
      };
    }
  });
  const OneClickIRead = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-63501ad3"]]);
  const _hoisted_1 = {
    key: 0,
    class: "btn-card"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "BtnCard",
    setup(__props) {
      const showCard = vue.ref(false);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("button", {
            onClick: _cache[0] || (_cache[0] = ($event) => showCard.value = !showCard.value),
            class: "show-btn v-button"
          }, "听书导入"),
          vue.createVNode(vue.Transition, { name: "slide" }, {
            default: vue.withCtx(() => [
              showCard.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
                vue.createVNode(_sfc_main$4),
                vue.createVNode(OneClickIRead)
              ])) : vue.createCommentVNode("", true)
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const BtnCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-43b38518"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(BtnCard);
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
  const BACKEND_URL = "https://tts.api.yfi.moe";

})(Vue);