// ==UserScript==
// @name         discord-midjourney-tampermonkey
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  暂无
// @author       simsir
// @match        https://discord.com/channels/*/*
// @icon         https://www.midjourney.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT License
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/476205/discord-midjourney-tampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/476205/discord-midjourney-tampermonkey.meta.js
// ==/UserScript==
(function() {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = "\n.auto[data-v-6c473c6f] {\n  padding: 14px 0px;\n}\n.auto .dmt-button[data-v-6c473c6f] {\n  margin-top: 24px;\n}\n.random[data-v-6c473c6f] {\n  display: flex;\n  align-items: center;\n}\n\n.setting[data-v-681503ab] {\n  padding: 16px 0px;\n}\n\n.app[data-v-03cfaed7] {\n  position: fixed;\n  right: 0px;\n  top: 0px;\n  height: 100vh;\n  width: 380px;\n  z-index: 99999;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);\n  transition: all 0.2s ease-out;\n  box-sizing: border-box;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n}\n.app-hidden[data-v-03cfaed7] {\n  transform: translateX(100%);\n}\n.app-show[data-v-03cfaed7] {\n  transform: translateX(0%);\n}\n.app-switch[data-v-03cfaed7] {\n  position: absolute;\n  top: 50%;\n  left: 0px;\n  transform: translate(-100%, -50%);\n  width: 20px;\n  font-size: 14px;\n  padding: 10px 7px;\n  border-radius: 8px 0px 0px 8px;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);\n  text-align: center;\n  line-height: 20px;\n}\n.app-switch[data-v-03cfaed7]:hover {\n  cursor: pointer;\n}\n.info[data-v-03cfaed7] {\n  margin-top: auto;\n  font-size: 13px;\n  text-align: center;\n}\n.info a[data-v-03cfaed7] {\n  color: #1677ff;\n}\n.app-mask[data-v-03cfaed7] {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  backdrop-filter: saturate(180%) blur(5px);\n  background-color: rgba(0, 0, 0, 0.6);\n  z-index: 9;\n  text-align: left;\n  padding: 20px;\n  transition: all 0.3s ease-out;\n  box-sizing: border-box;\n  max-height: 100%;\n  overflow-y: auto;\n}\n.app-mask_title[data-v-03cfaed7] {\n  font-weight: bold;\n  color: #fff;\n  font-size: 15px;\n}\n.app-mask_log[data-v-03cfaed7] {\n  color: #fff;\n  font-size: 13px;\n  margin-top: 6px;\n  opacity: 0.8;\n  word-break: break-all;\n}\n#discord-midjourney-tampermonkey {\n  --discord-midjourney-tampermonkey-bg: rgba(255, 255, 255, 0.9);\n}\n\n/* @media (prefers-color-scheme: dark) {\n  #discord-midjourney-tampermonkey {\n    --discord-midjourney-tampermonkey-bg: rgba(20, 20, 20, 0.9);\n  }\n} */\n\n.dmt-ios-style {\n  backdrop-filter: saturate(180%) blur(10px);\n  background-color: var(--discord-midjourney-tampermonkey-bg);\n}\n\n.dmt-button {\n  outline: none;\n  position: relative;\n  display: inline-block;\n  font-weight: 400;\n  white-space: nowrap;\n  text-align: center;\n  background-image: none;\n  background-color: transparent;\n  border: 1px solid transparent;\n  cursor: pointer;\n  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);\n  user-select: none;\n  touch-action: manipulation;\n  line-height: 1.5714285714285714;\n  border-radius: 40px;\n  padding-inline-start: 20px;\n  padding-inline-end: 20px;\n  font-size: 14px;\n  height: 40px;\n  padding: 6.428571428571429px 15px;\n  color: #fff;\n  background-color: #1677ff;\n  box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);\n  width: 100%;\n}\n\n.dmt-button-white {\n  background-color: #ffffff;\n  border-color: #d9d9d9;\n  color: rgba(0, 0, 0, 0.88);\n  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);\n}\n\n.dmt-input-group {\n  padding: 8px 0px;\n  text-align: left;\n}\n.dmt-input-group p {\n  font-size: 14px;\n  line-height: 14px;\n  margin: 0;\n  padding-bottom: 8px;\n}\n.dmt-input-group input {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 4px 11px;\n  color: rgba(0, 0, 0, 0.88);\n  font-size: 14px;\n  line-height: 1.5714285714285714;\n  list-style: none;\n  display: inline-block;\n  width: 100%;\n  min-width: 0;\n  background-color: #ffffff;\n  background-image: none;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #d9d9d9;\n  border-radius: 6px;\n}\n.dmt-input-group input[disabled] {\n  cursor: not-allowed;\n}\n.dmt-input-group textarea {\n  margin: 0;\n  box-sizing: border-box;\n  padding: 4px 11px;\n  color: rgba(0, 0, 0, 0.88);\n  font-size: 14px;\n  line-height: 1.5714285714285714;\n  list-style: none;\n  display: inline-block;\n  width: 100%;\n  height: 300px;\n  min-width: 0;\n  background-color: #ffffff;\n  background-image: none;\n  border-width: 1px;\n  border-style: solid;\n  border-color: #d9d9d9;\n  border-radius: 6px;\n  resize: none;\n}\n\n.tabs {\n  padding: 0px 6px;\n  position: relative;\n  background-color: rgba(0, 0, 0, 0.1);\n  border-radius: 20px;\n  height: 42px;\n  flex-shrink: 0;\n}\n.tab-menu {\n  position: absolute;\n  left: 0;\n  top: 5px;\n  display: flex;\n  width: 100%;\n  z-index: 2;\n}\n.tab-current {\n  position: absolute;\n  left: 6px;\n  top: 5px;\n  box-shadow: 0px 3px 8px rgba(var(--gray-rgb-99), 0.12), 0px 3px 1px rgba(var(--gray-rgb-99), 0.04);\n  background-color: #fff;\n  width: calc(50% - 3px);\n  height: 32px;\n  border-radius: 32px;\n  transition: all 0.3s;\n}\n.tab {\n  width: calc(50% - 3px);\n  height: 32px;\n  border-radius: 32px;\n  color: #333;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 14px;\n  margin-left: 6px;\n}\n.tab:first-child {\n  margin-left: 0px;\n}\n.tab:hover {\n  cursor: pointer;\n}\n";
  document.head.appendChild(__vite_style__);
  const auto_vue_vue_type_style_index_0_scoped_6c473c6f_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$2 = {
    data() {
      return {
        form: {
          prompt: "",
          interval: 20,
          clickInterval: 5,
          random: false
        }
      };
    },
    methods: {
      inputPrompt(event) {
        this.form.prompt = event.target.value;
      },
      inputInterval(event) {
        if (/\d+/.test(event.target.value)) {
          this.form.interval = Number(event.target.value);
        } else {
          alert("请输入数字");
        }
      },
      inputClickInterval(event) {
        if (/\d+/.test(event.target.value)) {
          this.form.clickInterval = Number(event.target.value);
        } else {
          alert("请输入数字");
        }
      },
      start() {
        this.$emit("start", {
          ...this.form
        });
      }
    }
  };
  const _withScopeId$2 = (n) => (Vue.pushScopeId("data-v-6c473c6f"), n = n(), Vue.popScopeId(), n);
  const _hoisted_1$2 = { class: "auto" };
  const _hoisted_2$2 = { class: "dmt-input-group" };
  const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ Vue.createElementVNode("p", null, "prompt（按回车换行）", -1));
  const _hoisted_4$2 = ["value"];
  const _hoisted_5$2 = { class: "dmt-input-group" };
  const _hoisted_6$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ Vue.createElementVNode("p", null, "生成检测间隔时间（秒）", -1));
  const _hoisted_7$2 = ["value"];
  const _hoisted_8$1 = { class: "dmt-input-group" };
  const _hoisted_9$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ Vue.createElementVNode("p", null, "自动点击间隔时间（秒）", -1));
  const _hoisted_10 = ["value"];
  const _hoisted_11 = { class: "random" };
  const _hoisted_12 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ Vue.createElementVNode("label", {
    for: "random",
    style: { "margin-left": "4px", "user-select": "none" }
  }, "随机点击", -1));
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$2, [
      Vue.createElementVNode("div", _hoisted_2$2, [
        _hoisted_3$2,
        Vue.createElementVNode("textarea", {
          value: $data.form.prompt,
          onInput: _cache[0] || (_cache[0] = (...args) => $options.inputPrompt && $options.inputPrompt(...args))
        }, null, 40, _hoisted_4$2)
      ]),
      Vue.createElementVNode("div", _hoisted_5$2, [
        _hoisted_6$2,
        Vue.createElementVNode("input", {
          value: $data.form.interval,
          onInput: _cache[1] || (_cache[1] = (...args) => $options.inputInterval && $options.inputInterval(...args))
        }, null, 40, _hoisted_7$2)
      ]),
      Vue.createElementVNode("div", _hoisted_8$1, [
        _hoisted_9$1,
        Vue.createElementVNode("input", {
          value: $data.form.clickInterval,
          onInput: _cache[2] || (_cache[2] = (...args) => $options.inputClickInterval && $options.inputClickInterval(...args))
        }, null, 40, _hoisted_10)
      ]),
      Vue.createElementVNode("div", _hoisted_11, [
        Vue.withDirectives(Vue.createElementVNode("input", {
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.form.random = $event),
          id: "random",
          name: "random",
          type: "checkbox"
        }, null, 512), [
          [Vue.vModelCheckbox, $data.form.random]
        ]),
        _hoisted_12
      ]),
      Vue.createElementVNode("button", {
        class: "dmt-button",
        onClick: _cache[4] || (_cache[4] = (...args) => $options.start && $options.start(...args))
      }, "开始")
    ]);
  }
  const Auto = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-6c473c6f"]]);
  const setting_vue_vue_type_style_index_0_scoped_681503ab_lang = "";
  const _sfc_main$1 = {
    props: {},
    data() {
      return {
        token: ""
      };
    },
    mounted() {
      console.log(window.DMT_GLOBAL);
      this.token = window.DMT_GLOBAL.token;
      this.params = JSON.parse(JSON.stringify(window.DMT_GLOBAL.params));
    },
    methods: {
      input(event) {
        this.params[event.target.dataset.key] = event.target.value;
      },
      save() {
        window.DMT_GLOBAL.params = this.params;
        GM_setValue("session_id", this.params.session_id);
        alert("已保存");
      }
    }
  };
  const _withScopeId$1 = (n) => (Vue.pushScopeId("data-v-681503ab"), n = n(), Vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "setting" };
  const _hoisted_2$1 = { class: "dmt-input-group" };
  const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ Vue.createElementVNode("p", null, "token", -1));
  const _hoisted_4$1 = ["value"];
  const _hoisted_5$1 = {
    key: 0,
    href: "https://ne8p66imfs.feishu.cn/docx/ZVQGdI74doPRDnxlTEVcEl19nde?from=from_copylink",
    target: "_blank",
    style: { "margin-left": "8px" }
  };
  const _hoisted_6$1 = ["value", "disabled", "data-key", "placeholder"];
  const _hoisted_7$1 = { class: "dmt-input-group" };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return Vue.openBlock(), Vue.createElementBlock("div", _hoisted_1$1, [
      Vue.createElementVNode("div", _hoisted_2$1, [
        _hoisted_3$1,
        Vue.createElementVNode("input", {
          value: $data.token,
          disabled: ""
        }, null, 8, _hoisted_4$1)
      ]),
      _ctx.params ? (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, { key: 0 }, Vue.renderList(_ctx.params, (value, key) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: "dmt-input-group",
          key
        }, [
          Vue.createElementVNode("p", null, [
            Vue.createTextVNode(Vue.toDisplayString(key), 1),
            key === "session_id" ? (Vue.openBlock(), Vue.createElementBlock("a", _hoisted_5$1, "查看获取文档")) : Vue.createCommentVNode("", true)
          ]),
          Vue.createElementVNode("input", {
            value,
            onInput: _cache[0] || (_cache[0] = (...args) => $options.input && $options.input(...args)),
            disabled: key !== "session_id",
            "data-key": key,
            placeholder: key !== "session_id" ? "无需设置，自动获取" : ""
          }, null, 40, _hoisted_6$1)
        ]);
      }), 128)) : Vue.createCommentVNode("", true),
      Vue.createElementVNode("div", _hoisted_7$1, [
        Vue.createElementVNode("button", {
          class: "dmt-button",
          style: { "margin-top": "14px" },
          onClick: _cache[1] || (_cache[1] = (...args) => $options.save && $options.save(...args))
        }, "保存")
      ])
    ]);
  }
  const Setting = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-681503ab"]]);
  function useVisible() {
    const visible = Vue.ref(false);
    const toggleVisible = () => {
      visible.value = !visible.value;
    };
    return {
      visible,
      toggleVisible
    };
  }
  function useTabs() {
    const tab = Vue.ref(0);
    const tabs = Vue.ref([
      {
        title: "开始跑图"
      },
      {
        title: "密钥设置"
      }
    ]);
    const changeTab = (i) => {
      tab.value = i;
    };
    return {
      tab,
      tabs,
      changeTab
    };
  }
  const interactionsPrarms = JSON.stringify({
    type: 2,
    application_id: "",
    guild_id: "",
    channel_id: "",
    session_id: "",
    data: {
      version: "",
      id: "",
      name: "imagine",
      type: 1,
      options: [
        {
          type: 3,
          name: "prompt",
          value: ""
        }
      ],
      application_command: {
        id: "",
        application_id: "",
        version: "",
        default_member_permissions: null,
        type: 1,
        nsfw: false,
        name: "imagine",
        description: "Create images with Midjourney",
        dm_permission: true,
        contexts: [0, 1, 2],
        integration_types: [0],
        options: [{ type: 3, name: "prompt", description: "The prompt to imagine", required: true }]
      },
      attachments: []
    },
    nonce: ""
    // 1155142449786519552
  });
  function sendInteractions(prompt) {
    if (window.DMT_GLOBAL.isDevelopment) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1e3);
      });
    }
    return fetchCommand().then(() => {
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      const params = JSON.parse(interactionsPrarms);
      params.nonce = `${(/* @__PURE__ */ new Date()).getTime()}${randomInRange(1e5, 999999)}`;
      params.application_id = window.DMT_GLOBAL.params.application_id;
      params.guild_id = window.DMT_GLOBAL.params.guild_id;
      params.channel_id = window.DMT_GLOBAL.params.channel_id;
      params.session_id = window.DMT_GLOBAL.params.session_id;
      params.data.version = window.DMT_GLOBAL.params.dataVersion;
      params.data.id = window.DMT_GLOBAL.params.dataId;
      params.data.application_command.application_id = window.DMT_GLOBAL.params.application_id;
      params.data.application_command.version = window.DMT_GLOBAL.params.dataVersion;
      params.data.application_command.id = window.DMT_GLOBAL.params.dataId;
      params.data.options[0].value = prompt;
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: "https://discord.com/api/v9/interactions",
          headers: {
            Authorization: window.DMT_GLOBAL.token,
            "Content-Type": "application/json"
          },
          data: JSON.stringify(params),
          onload: function(response) {
            resolve(response);
          },
          onerror: function(err) {
            reject(err);
          }
        });
      });
    });
  }
  function fetchCommand() {
    return new Promise((resolve, reject) => {
      if (window.DMT_GLOBAL.params.dataVersion) {
        resolve();
        return;
      }
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://discord.com/api/v9/channels/${window.DMT_GLOBAL.params.channel_id}/application-commands/search?type=1&query=im&limit=7&include_applications=false`,
        headers: {
          Authorization: window.DMT_GLOBAL.token,
          "Content-Type": "application/json"
        },
        onload: function(response) {
          if (response && response.responseText) {
            try {
              const p = JSON.parse(response.responseText);
              if (p && p.application_commands && p.application_commands.length && p.application_commands[0].id) {
                window.DMT_GLOBAL.params.dataId = p.application_commands[0].id;
                window.DMT_GLOBAL.params.application_id = p.application_commands[0].application_id;
                window.DMT_GLOBAL.params.dataVersion = p.application_commands[0].version;
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          }
          resolve(response.responseText);
        },
        onerror: function(err) {
          reject(err);
        }
      });
    });
  }
  function fetchMainElement() {
    if (!window.DMT_GLOBAL.isDevelopment) {
      return document.querySelector("main");
    }
    let mockHtml = "";
    {
      mockHtml = '<main><li id="chat-messages-1154715233001148476-1155792367308247061" class="messageListItem-ZZ7v6g" aria-setsize="-1"><div class="message-2CShn3 cozyMessage-1DWF9U mentioned-Tre-dv wrapper-30-Nkg cozy-VmLDNB zalgo-26OfGz" role="article" data-list-item-id="chat-messages___chat-messages-1154715233001148476-1155792367308247061" tabindex="-1" aria-setsize="-1" aria-roledescription="消息" aria-labelledby="message-username-1155790643319279667 uid_1 message-content-1155792367308247061 message-accessories-1155792367308247061 uid_2 message-timestamp-1155792367308247061"><div class="contents-2MsGLg"><span class="latin12CompactTimeStamp-2G5XJd timestamp-p1Df1m timestampVisibleOnHover-9PEuZS alt-1dvXnH"><time aria-label="今天17:06" id="message-timestamp-1155792367308247061" datetime="2023-09-25T09:06:13.950Z"><i class="separator-AebOhG" aria-hidden="true">[</i>17:06<i class="separator-AebOhG" aria-hidden="true">] </i></time></span><div id="message-content-1155792367308247061" class="markup-eYLPri messageContent-2t3eCI"><strong><span>studio is called needcode</span><span>,logo</span><span>,flat design</span><span>,white background </span><span>-</span><span>-v </span><span>5</span><span>.1</span></strong><span> </span><span>- </span><span class="mention wrapper-1ZcZW- interactive" aria-expanded="false" tabindex="0" role="button">@nathanaguirre</span><span> </span><span>(relaxed</span><span>)</span></div></div><div id="message-accessories-1155792367308247061" class="container-2sjPya"><div class="mediaAttachmentsContainer-1WGRWy"><div class="oneByOneGrid-3Cl27N oneByOneGridSingle-2ss-Zx"><div class="messageAttachment-CZp8Iv messageAttachmentNoJustify-lIzP9c messageAttachmentMediaMosaic-2ic1yt hideOverflow-bsO1Md"><div class="imageContent-3Av-9c embedWrapper-1MtIDg attachmentContentContainer-3WAhvQ attachmentContentItem-UKeiCx obscured-20kiwN"><div class="imageContainer-10XenG"><div class="imageWrapper-oMkQl4 imageZoom-3yLCXY clickable-LksVCf lazyImgContainer-3k3gRy" style="display: block; max-height: inherit; margin: auto; width: 350px; height: 100%;"><a tabindex="-1" aria-hidden="true" class="originalLink-Azwuo9" href="https://cdn.discordapp.com/attachments/1154715233001148476/1155792367136276531/nathanaguirre_studio_is_called_needcodelogoflat_designwhite_bac_c75feefb-7258-460b-b724-967df6393655.png" data-role="img" data-safe-src="https://media.discordapp.net/attachments/1154715233001148476/1155792367136276531/nathanaguirre_studio_is_called_needcodelogoflat_designwhite_bac_c75feefb-7258-460b-b724-967df6393655.png?width=350&amp;height=350"></a><div class="clickableWrapper-2WTAkL" tabindex="0" aria-label="图片" aria-describedby="uid_4" role="button"><img class="lazyImg-ewiNCh" alt="图片" src="https://media.discordapp.net/attachments/1154715233001148476/1155792367136276531/nathanaguirre_studio_is_called_needcodelogoflat_designwhite_bac_c75feefb-7258-460b-b724-967df6393655.png?width=350&amp;height=350" style="display: block; object-fit: cover; min-width: 100%; min-height: 100%; max-width: calc(100% + 1px);"></div></div></div></div></div></div></div><div class="container-3Sqbyb"><div class="container-3nKPGI"><div class="children-2XdE_I"><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">U1</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">U2</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">U3</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">U4</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><img src="/assets/2ffcb91dee0015f46b03482b3c73fcad.svg" alt="🔄" draggable="false" class="emoji" data-type="emoji" data-name="🔄"></div></div></button></div></div><div class="container-3nKPGI"><div class="children-2XdE_I"><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">V1</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">V2</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">V3</div></div></div></button><button role="button" type="button" class="component-ifCTxY button-ejjZWC lookFilled-1H2Jvj colorPrimary-2-Lusz sizeSmall-3R2P2p grow-2T4nbg"><div class="contents-3NembX"><div class="content-1xP6ZE" aria-hidden="false"><div class="label-31sIdr">V4</div></div></div></button></div></div></div></div><div class="buttonContainer-1502pf"><div class="buttons-3dF5Kd container-2gUZhU" role="group" aria-label="消息操作"><div class="buttonsInner-1ynJCY wrapper-2vIMkT"><div class="button-3bklZh" aria-label="添加反应" aria-expanded="false" role="button" tabindex="0"><svg class="icon-tZV_7s" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.1151 2.00065C12.0768 2.00022 12.0384 2 12 2C6.477 2 2 6.477 2 12C2 17.522 6.477 22 12 22C17.523 22 22 17.522 22 12C22 11.9616 21.9998 11.9232 21.9993 11.8849C21.1882 12.1737 20.3146 12.3309 19.4043 12.3309C15.1323 12.3309 11.6691 8.86771 11.6691 4.59565C11.6691 3.68536 11.8263 2.8118 12.1151 2.00065ZM7.92105 11.8023C7.92105 12.7107 7.18468 13.4471 6.27631 13.4471C5.36795 13.4471 4.63158 12.7107 4.63158 11.8023C4.63158 10.894 5.36795 10.1576 6.27631 10.1576C7.18467 10.1576 7.92105 10.894 7.92105 11.8023ZM10.5217 14.5171C10.3859 13.9893 9.84786 13.6716 9.32005 13.8074C8.79223 13.9433 8.47448 14.4813 8.61033 15.0091C9.01196 16.5695 10.4273 17.7236 12.1147 17.7236C13.8021 17.7236 15.2174 16.5695 15.6191 15.0091C15.7549 14.4813 15.4372 13.9433 14.9093 13.8074C14.3815 13.6716 13.8435 13.9893 13.7077 14.5171C13.525 15.2267 12.8797 15.7499 12.1147 15.7499C11.3497 15.7499 10.7044 15.2267 10.5217 14.5171Z" fill="currentColor"></path><path d="M18.5 2C17.9477 2 17.5 2.44772 17.5 3V4.5H16C15.4477 4.5 15 4.94771 15 5.5C15 6.05228 15.4477 6.5 16 6.5H17.5V8C17.5 8.55228 17.9477 9 18.5 9C19.0523 9 19.5 8.55229 19.5 8V6.5H21C21.5523 6.5 22 6.05229 22 5.5C22 4.94772 21.5523 4.5 21 4.5H19.5V3C19.5 2.44772 19.0523 2 18.5 2Z" fill="currentColor"></path></svg></div><div class="button-3bklZh" aria-label="添加超级反应" aria-expanded="false" role="button" tabindex="0"><svg class="icon-tZV_7s" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M20.3397 14.2379C21.2318 14.4731 22.1292 14.5474 23 14.4789C22.9906 14.5151 22.9809 14.5514 22.9711 14.5876C21.5194 19.9201 15.9496 23.086 10.5309 21.6569C10.3451 21.6079 10.1619 21.5542 9.98145 21.4958C7.94618 20.8378 5.90941 20 3.77041 20H3.5C2.67157 20 2 19.3284 2 18.5C2 17.6716 2.67157 17 3.5 17C4.75918 17 3.9661 15.8584 3.47514 14.7655C3.28101 14.3334 2.86615 14 2.39244 14H1.5C0.671573 14 0 13.3284 0 12.5C0 11.6716 0.671573 11 1.5 11V11C2.38174 11 3.10559 10.3274 3.33171 9.47516C3.33726 9.45427 3.34287 9.43338 3.34856 9.41249V9.41249C3.53406 8.7311 2.9812 8.0187 2.44976 7.55366C2.17543 7.31362 2 6.96872 2 6.5C2 5.67157 2.67157 5 3.5 5V5C5.03983 5 6.4765 4.31861 7.78941 3.51404C10.0926 2.10261 12.9612 1.59744 15.7887 2.34316C15.827 2.35324 15.8651 2.36352 15.9031 2.374C15.4064 3.08271 15.0224 3.88574 14.7831 4.76493C13.6598 8.89108 16.1476 13.1323 20.3397 14.2379ZM9.26206 8.71607C8.70747 8.56981 8.13976 8.79579 7.83448 9.23964C7.62045 9.55083 7.19184 9.86027 6.69655 9.72964C6.24033 9.60932 5.88292 9.10507 6.13732 8.60064C6.78216 7.32202 8.27206 6.62396 9.72714 7.00771C11.1822 7.39146 12.1179 8.72923 12.0268 10.1539C11.9909 10.7159 11.4252 10.9767 10.969 10.8564C10.4737 10.7258 10.2597 10.2469 10.2324 9.87205C10.1935 9.33743 9.81666 8.86234 9.26206 8.71607ZM16.3671 14.9268C16.17 14.5422 15.7892 14.2404 15.3308 14.1195L10.6411 12.8827C10.1826 12.7618 9.69947 12.8357 9.33352 13.0718C8.95878 13.3135 8.70829 13.7284 8.7613 14.2422C8.93054 15.8827 10.1055 17.3278 11.821 17.7802C13.5365 18.2326 15.2881 17.5594 16.2681 16.222C16.575 15.8031 16.5688 15.3205 16.3671 14.9268Z" fill="currentColor"></path><path d="M20.5 4C19.9477 4 19.5 4.44772 19.5 5V6.5H18C17.4477 6.5 17 6.94771 17 7.5C17 8.05228 17.4477 8.5 18 8.5H19.5V10C19.5 10.5523 19.9477 11 20.5 11C21.0523 11 21.5 10.5523 21.5 10V8.5H23C23.5523 8.5 24 8.05229 24 7.5C24 6.94772 23.5523 6.5 23 6.5H21.5V5C21.5 4.44772 21.0523 4 20.5 4Z" fill="currentColor"></path></svg></div><div class="button-3bklZh" aria-label="回复" role="button" tabindex="0"><svg class="icon-1zidb7" width="24" height="24" viewBox="0 0 24 24"><path d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z" fill="currentColor"></path></svg></div><div class="button-3bklZh" aria-label="创建子区" role="button" tabindex="0"><svg class="icon-1zidb7" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.40991 9H3.55274C3.47819 9 3.42168 8.93274 3.43453 8.85931L3.74253 7.09931C3.75258 7.04189 3.80244 7 3.86074 7H7.75991L8.45234 3.09903C8.46251 3.04174 8.51231 3 8.57049 3H10.3267C10.4014 3 10.4579 3.06746 10.4449 3.14097L9.75991 7H15.7599L16.4523 3.09903C16.4625 3.04174 16.5123 3 16.5705 3H18.3267C18.4014 3 18.4579 3.06746 18.4449 3.14097L17.7599 7H21.6171C21.6916 7 21.7481 7.06725 21.7353 7.14069L21.4273 8.90069C21.4172 8.95811 21.3674 9 21.3091 9H17.4099L17.0495 11.04H15.05L15.4104 9H9.41035L8.35035 15H10.5599V17H7.99991L7.30749 20.901C7.29732 20.9583 7.24752 21 7.18934 21H5.43309Z"></path><path fill="currentColor" d="M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z"></path></svg></div><div class="button-3bklZh" aria-label="更多" aria-expanded="false" role="button" tabindex="0"><svg class="icon-1zidb7" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7 12.001C7 10.8964 6.10457 10.001 5 10.001C3.89543 10.001 3 10.8964 3 12.001C3 13.1055 3.89543 14.001 5 14.001C6.10457 14.001 7 13.1055 7 12.001ZM14 12.001C14 10.8964 13.1046 10.001 12 10.001C10.8954 10.001 10 10.8964 10 12.001C10 13.1055 10.8954 14.001 12 14.001C13.1046 14.001 14 13.1055 14 12.001ZM19 10.001C20.1046 10.001 21 10.8964 21 12.001C21 13.1055 20.1046 14.001 19 14.001C17.8954 14.001 17 13.1055 17 12.001C17 10.8964 17.8954 10.001 19 10.001Z"></path></svg></div></div></div></div></div></li></main>';
    }
    return $(mockHtml).get(0);
  }
  function useRun() {
    const isRun = Vue.ref(false);
    const isFinish = Vue.ref(true);
    const logs = Vue.ref([]);
    const _runData = Vue.ref({});
    const _prompts = Vue.ref([]);
    const _getLastLi = () => {
      const main2 = fetchMainElement();
      const li = main2.querySelectorAll("li");
      return li[li.length - 1];
    };
    const _randomInRange = (min, max) => Math.random() * (max - min) + min;
    const send = (prompt) => {
      logs.value.push(`发送关键词【${prompt}】`);
      sendInteractions(prompt).then(() => {
        logs.value.push(`已发送关键词【${prompt}】`);
        window.DMT_GLOBAL.timer = setTimeout(() => {
          check();
        }, _runData.value.interval * 1e3);
      }).catch((err) => {
        logs.value.push(`发送关键词失败【${err}】`);
        logs.value.push(`请检查密钥设置`);
      });
    };
    const check = () => {
      logs.value.push(`开始检测生成结果...`);
      const lastLi = _getLastLi();
      const buttonEle = lastLi.querySelectorAll("button");
      const buttons = [];
      for (let i = 0; i < buttonEle.length; i++) {
        if (/U[1-4]/.test(buttonEle[i].innerHTML)) {
          buttons.push(buttonEle[i]);
        }
      }
      if (buttons.length) {
        logs.value.push(`检测到生成结果，将自动请求原图`);
        click(buttons, []);
      } else {
        logs.value.push(`未检测到生成结果，${_runData.value.interval}秒后重新检测...`);
        window.DMT_GLOBAL.timer = setTimeout(() => {
          check();
        }, _runData.value.interval * 1e3);
      }
    };
    const click = (buttons, clickedIndex) => {
      if (clickedIndex.length >= buttons.length) {
        if (_prompts.value.length === 0) {
          isFinish.value = true;
          logs.value.push(`已完成所有关键词生成！！！`);
          return;
        }
        const prompt = _prompts.value.shift();
        send(prompt);
        return;
      }
      const index = _runData.value.random ? parseInt(_randomInRange(0, buttons.length)) : clickedIndex.length;
      if (clickedIndex.includes(index)) {
        click(buttons, clickedIndex);
        return;
      }
      window.DMT_GLOBAL.timer = setTimeout(() => {
        buttons[index].click();
        logs.value.push(`已自动点击U${index + 1}按钮`);
        checkButtonFail(buttons, clickedIndex, index);
      }, _runData.value.clickInterval * 1e3);
    };
    const checkButtonFail = (buttons, clickedIndex, nextIndex) => {
      logs.value.push(`3秒后检测U${nextIndex + 1}按钮点击结果`);
      window.DMT_GLOBAL.timer = setTimeout(() => {
        if (/交互失败/.test(buttons[nextIndex].parentNode.innerHTML)) {
          logs.value.push(`U${nextIndex + 1}按钮点击失败，${_runData.value.clickInterval}秒后重新执行按钮点击`);
          click(buttons, clickedIndex);
        } else {
          clickedIndex.push(nextIndex);
          checkOriginImage(buttons, clickedIndex);
        }
      }, 3 * 1e3);
    };
    const checkOriginImage = (buttons, clickedIndex) => {
      window.DMT_GLOBAL.timer = setTimeout(() => {
        const lastLi = _getLastLi();
        const reg = new RegExp("Custom Zoom");
        if (reg.test(lastLi.innerHTML)) {
          const links = lastLi.querySelectorAll("a[data-role=img]");
          let findIndex = -1;
          for (let i = 0; i < links.length; i++) {
            if (/media\.discordapp/.test(links[i].href) || /cdn\.discordapp/.test(links[i].href)) {
              findIndex = i;
            }
          }
          if (findIndex >= 0) {
            const src = links[findIndex].getAttribute("data-safe-src");
            const splits = src ? src.split("?") : links[findIndex].href.split("?");
            if (/png|jpg/.test(splits[0])) {
              download(splits[0], `U${clickedIndex[clickedIndex.length - 1] + 1}`);
              click(buttons, clickedIndex);
            } else {
              checkOriginImage(buttons, clickedIndex);
            }
          } else {
            checkOriginImage(buttons, clickedIndex);
          }
        } else {
          checkOriginImage(buttons, clickedIndex);
        }
      }, 3e3);
    };
    const download = (url, flag) => {
      if (!url) {
        return;
      }
      const index = (url || "").lastIndexOf("/");
      const name2 = url.slice(index + 1);
      logs.value.push(`已自动下载【${url}】图片`);
      if (window.DMT_GLOBAL.isDevelopment) {
        return;
      }
      GM_download(url, `${flag}-${name2}`);
    };
    const run = (prompts, data) => {
      if (isRun.value) {
        return;
      }
      logs.value = [];
      isFinish.value = false;
      isRun.value = true;
      _runData.value = {
        ...data
      };
      if (prompts.length <= 0) {
        logs.value.push(`无输入关键词，自动点击下载模式...`);
        check();
        return;
      }
      _prompts.value = prompts;
      const prompt = _prompts.value.shift();
      send(prompt);
    };
    const stop = () => {
      isFinish.value = true;
      isRun.value = false;
      window.DMT_GLOBAL.timer && clearTimeout(window.DMT_GLOBAL.timer);
    };
    return {
      run,
      stop,
      isRun,
      isFinish,
      logs
    };
  }
  const app_vue_vue_type_style_index_0_scoped_03cfaed7_lang = "";
  const _withScopeId = (n) => (Vue.pushScopeId("data-v-03cfaed7"), n = n(), Vue.popScopeId(), n);
  const _hoisted_1 = { class: "tabs" };
  const _hoisted_2 = { class: "tab-menu" };
  const _hoisted_3 = ["onClick"];
  const _hoisted_4 = { class: "flex-grow" };
  const _hoisted_5 = { class: "info" };
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("span", null, [
    /* @__PURE__ */ Vue.createElementVNode("a", {
      href: "https://ne8p66imfs.feishu.cn/docx/ZVQGdI74doPRDnxlTEVcEl19nde?from=from_copylink",
      target: "_blank",
      style: { "margin-left": "8px" }
    }, "帮助文档")
  ], -1));
  const _hoisted_7 = {
    key: 0,
    class: "app-mask"
  };
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ Vue.createElementVNode("div", { class: "app-mask_title" }, "运行日志：", -1));
  const _hoisted_9 = { key: 0 };
  const _sfc_main = {
    __name: "app",
    setup(__props) {
      const version2 = Vue.ref(window.DMT_GLOBAL.version);
      const { visible, toggleVisible } = useVisible();
      const { tab, tabs, changeTab } = useTabs();
      const { run, stop, isRun, isFinish, logs } = useRun();
      const start = (e) => {
        if (!window.DMT_GLOBAL.params.session_id) {
          alert("请设置session_id");
          changeTab(1);
          return;
        }
        const { prompt, ...config } = e;
        const prompts = e.prompt.split("\n");
        console.log("discord-midjourney-tampermonkey", prompts);
        console.log("discord-midjourney-config", config);
        run(prompts.filter((item) => !!item), config);
      };
      Vue.onMounted(() => {
        if (window.DMT_GLOBAL.isDevelopment) {
          toggleVisible();
          return;
        }
        setTimeout(() => {
          toggleVisible();
        }, 1e3);
      });
      return (_ctx, _cache) => {
        return Vue.openBlock(), Vue.createElementBlock("div", {
          class: Vue.normalizeClass({
            "dmt-ios-style": true,
            app: true,
            "app-hidden": !Vue.unref(visible),
            "app-show": Vue.unref(visible)
          })
        }, [
          Vue.createElementVNode("div", _hoisted_1, [
            Vue.createElementVNode("div", _hoisted_2, [
              (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(Vue.unref(tabs), (item, index) => {
                return Vue.openBlock(), Vue.createElementBlock("div", {
                  class: "tab",
                  onClick: ($event) => Vue.unref(changeTab)(index),
                  key: index
                }, Vue.toDisplayString(item.title), 9, _hoisted_3);
              }), 128))
            ]),
            Vue.createElementVNode("div", {
              class: "tab-current",
              style: Vue.normalizeStyle({
                transform: Vue.unref(tab) === 0 ? "translateX(0%)" : "translateX(calc(100% - 6px))"
              })
            }, null, 4)
          ]),
          Vue.createElementVNode("div", _hoisted_4, [
            Vue.unref(tab) === 0 ? (Vue.openBlock(), Vue.createBlock(Auto, {
              key: 0,
              onStart: start
            })) : Vue.createCommentVNode("", true),
            Vue.unref(tab) === 1 ? (Vue.openBlock(), Vue.createBlock(Setting, { key: 1 })) : Vue.createCommentVNode("", true)
          ]),
          Vue.createElementVNode("div", _hoisted_5, [
            Vue.createElementVNode("span", null, "v" + Vue.toDisplayString(version2.value), 1),
            _hoisted_6
          ]),
          Vue.createElementVNode("div", {
            class: "dmt-ios-style app-switch",
            onClick: _cache[0] || (_cache[0] = (...args) => Vue.unref(toggleVisible) && Vue.unref(toggleVisible)(...args))
          }, Vue.toDisplayString(Vue.unref(visible) ? "隐藏" : "打开") + "自动跑图", 1),
          Vue.unref(isRun) ? (Vue.openBlock(), Vue.createElementBlock("div", _hoisted_7, [
            _hoisted_8,
            (Vue.openBlock(true), Vue.createElementBlock(Vue.Fragment, null, Vue.renderList(Vue.unref(logs), (item, index) => {
              return Vue.openBlock(), Vue.createElementBlock("div", {
                class: "app-mask_log",
                key: index
              }, Vue.toDisplayString(item), 1);
            }), 128)),
            Vue.unref(isFinish) ? (Vue.openBlock(), Vue.createElementBlock("div", _hoisted_9, [
              Vue.createElementVNode("button", {
                class: "dmt-button dmt-button-white",
                style: { "margin-top": "20px" },
                onClick: _cache[1] || (_cache[1] = (...args) => Vue.unref(stop) && Vue.unref(stop)(...args))
              }, "关闭")
            ])) : Vue.createCommentVNode("", true)
          ])) : Vue.createCommentVNode("", true)
        ], 2);
      };
    }
  };
  const app = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-03cfaed7"]]);
  const main = "";
  const name = "discord-midjourney-tampermonkey";
  const version = "1.0.3";
  const scripts = {
    dev: "vite build --mode dev",
    build: "vite build --mode prod"
  };
  const dependencies = {
    vue: "^3.2.47"
  };
  const devDependencies = {
    "@vitejs/plugin-vue": "^4.1.0",
    "rollup-plugin-external-globals": "^0.7.3",
    vite: "^4.2.1"
  };
  const packageJson = {
    name,
    "private": true,
    version,
    scripts,
    dependencies,
    devDependencies
  };
  const DMT_ID = packageJson.name;
  const isDevelopment = /baidu/.test(window.location.href);
  function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
      XMLHttpRequest.callbacks.push(callback);
    } else {
      XMLHttpRequest.callbacks = [callback];
      oldSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function() {
        for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
          XMLHttpRequest.callbacks[i](this);
        }
        oldSend.apply(this, arguments);
      };
    }
  }
  addXMLRequestCallback(function(xhr) {
    xhr.addEventListener("load", function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (/\/country-code/.test(xhr.responseURL) || isDevelopment) {
          GM_addElement(document.body, "div", {
            id: DMT_ID
          });
          Vue.createApp(app).mount(`#${DMT_ID}`);
          console.log(`${DMT_ID} 启动！`);
        }
      }
    });
  });
  $(function() {
    let token = isDevelopment ? "123" : localStorage.getItem("token");
    if (token !== null) {
      let guild_id, channel_id = "";
      const urlSplit = (isDevelopment ? "https://discord.com/channels/1154712779815653386/1154715233001148476" : window.location.href).split("/");
      if (urlSplit.length === 6) {
        guild_id = urlSplit[4];
        channel_id = urlSplit[5];
      }
      window.DMT_GLOBAL = {
        version: packageJson.version,
        isDevelopment,
        params: {
          application_id: "",
          // 936929561302675456
          guild_id,
          channel_id,
          session_id: GM_getValue("session_id", ""),
          // 6869e3d65cd9ec8b28db555f87526696
          dataVersion: "",
          // '1118961510123847772',
          dataId: ""
          // '938956540159881230'
        },
        token: token.replace(/\"/g, ""),
        timer: 0
      };
    }
  });
})();
