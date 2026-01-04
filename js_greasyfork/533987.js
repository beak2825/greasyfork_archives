// ==UserScript==
// @name         纯净直播（pure live）
// @namespace    https://github.com/ljezio
// @version      5.2.13
// @author       ljezio
// @description  纯净直播，只保留直播和弹幕，支持🦈斗鱼、🐯虎牙、📺B站直播、🎶抖音直播
// @license      GPL-3.0-or-later
// @icon         data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzYxMDcyMzM2NjA2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ4NjYiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMzI5Ljk1NTU1NiAzODYuODQ0NDQ0aDU0Ni4xMzMzMzNjNTAuMDYyMjIyIDAgOTEuMDIyMjIyIDQwLjk2IDkxLjAyMjIyMiA5MS4wMjIyMjN2MzQxLjMzMzMzM2MwIDUwLjA2MjIyMi00MC45NiA5MS4wMjIyMjItOTEuMDIyMjIyIDkxLjAyMjIyMkgzMjkuOTU1NTU2Yy01MC4wNjIyMjIgMC05MS4wMjIyMjItNDAuOTYtOTEuMDIyMjIzLTkxLjAyMjIyMlY0NzcuODY2NjY3YzAtNTAuMDYyMjIyIDQwLjk2LTkxLjAyMjIyMiA5MS4wMjIyMjMtOTEuMDIyMjIzeiIgZmlsbD0iIzIwREFCNCIgcC1pZD0iNDg2NyI+PC9wYXRoPjxwYXRoIGQ9Ik04NzYuMDg4ODg5IDEwMjRIMTQ3LjkxMTExMWMtNjMuNzE1NTU2IDAtMTEzLjc3Nzc3OC01MC4wNjIyMjItMTEzLjc3Nzc3OC0xMTMuNzc3Nzc4VjI5NS44MjIyMjJjMC02My43MTU1NTYgNTAuMDYyMjIyLTExMy43Nzc3NzggMTEzLjc3Nzc3OC0xMTMuNzc3Nzc4aDcyOC4xNzc3NzhjNjMuNzE1NTU2IDAgMTEzLjc3Nzc3OCA1MC4wNjIyMjIgMTEzLjc3Nzc3OCAxMTMuNzc3Nzc4djYxNC40YzAgNjMuNzE1NTU2LTUwLjA2MjIyMiAxMTMuNzc3Nzc4LTExMy43Nzc3NzggMTEzLjc3Nzc3OHpNMTQ3LjkxMTExMSAyMjcuNTU1NTU2Yy0zOC42ODQ0NDQgMC02OC4yNjY2NjcgMjkuNTgyMjIyLTY4LjI2NjY2NyA2OC4yNjY2NjZ2NjE0LjRjMCAzOC42ODQ0NDQgMjkuNTgyMjIyIDY4LjI2NjY2NyA2OC4yNjY2NjcgNjguMjY2NjY3aDcyOC4xNzc3NzhjMzguNjg0NDQ0IDAgNjguMjY2NjY3LTI5LjU4MjIyMiA2OC4yNjY2NjctNjguMjY2NjY3VjI5NS44MjIyMjJjMC0zOC42ODQ0NDQtMjkuNTgyMjIyLTY4LjI2NjY2Ny02OC4yNjY2NjctNjguMjY2NjY2SDE0Ny45MTExMTF6IiBmaWxsPSIjMTA2RDVBIiBwLWlkPSI0ODY4Ij48L3BhdGg+PHBhdGggZD0iTTc4NS4wNjY2NjcgODg3LjQ2NjY2N0gyMzguOTMzMzMzYy02My43MTU1NTYgMC0xMTMuNzc3Nzc4LTUwLjA2MjIyMi0xMTMuNzc3Nzc3LTExMy43Nzc3NzhWMzg2Ljg0NDQ0NGMwLTYzLjcxNTU1NiA1MC4wNjIyMjItMTEzLjc3Nzc3OCAxMTMuNzc3Nzc3LTExMy43Nzc3NzdoNTQ2LjEzMzMzNGM2My43MTU1NTYgMCAxMTMuNzc3Nzc4IDUwLjA2MjIyMiAxMTMuNzc3Nzc3IDExMy43Nzc3Nzd2Mzg2Ljg0NDQ0NWMwIDYzLjcxNTU1Ni01MC4wNjIyMjIgMTEzLjc3Nzc3OC0xMTMuNzc3Nzc3IDExMy43Nzc3Nzh6TTIzOC45MzMzMzMgMzE4LjU3Nzc3OGMtMzguNjg0NDQ0IDAtNjguMjY2NjY3IDI5LjU4MjIyMi02OC4yNjY2NjYgNjguMjY2NjY2djM4Ni44NDQ0NDVjMCAzOC42ODQ0NDQgMjkuNTgyMjIyIDY4LjI2NjY2NyA2OC4yNjY2NjYgNjguMjY2NjY3aDU0Ni4xMzMzMzRjMzguNjg0NDQ0IDAgNjguMjY2NjY3LTI5LjU4MjIyMiA2OC4yNjY2NjYtNjguMjY2NjY3VjM4Ni44NDQ0NDRjMC0zOC42ODQ0NDQtMjkuNTgyMjIyLTY4LjI2NjY2Ny02OC4yNjY2NjYtNjguMjY2NjY2SDIzOC45MzMzMzN6TTM3NS40NjY2NjcgODg3LjQ2NjY2N2gxMTMuNzc3Nzc3djQ1LjUxMTExMWgtMTEzLjc3Nzc3N3YtNDUuNTExMTExeiBtMTgyLjA0NDQ0NCAwaDExMy43Nzc3Nzh2NDUuNTExMTExaC0xMTMuNzc3Nzc4di00NS41MTExMTF6IiBmaWxsPSIjMTA2RDVBIiBwLWlkPSI0ODY5Ij48L3BhdGg+PHBhdGggZD0iTTcxNi44IDc5Ni40NDQ0NDR2LTQ1LjUxMTExMWM0MC45NiAwIDQ1LjUxMTExMS00NS41MTExMTEgNDUuNTExMTExLTQ3Ljc4NjY2NlY0NTUuMTExMTExaDQ1LjUxMTExMXYyNTAuMzExMTExYy0yLjI3NTU1NiAzMS44NTc3NzgtMjUuMDMxMTExIDkxLjAyMjIyMi05MS4wMjIyMjIgOTEuMDIyMjIyek01MTIgMjEzLjkwMjIyMmwtMTc1LjIxNzc3OC0xNzUuMjE3Nzc4TDM2OC42NCA2LjgyNjY2NyA1MTIgMTUwLjE4NjY2NyA2NTUuMzYgNi44MjY2NjdsMzEuODU3Nzc4IDMxLjg1Nzc3N3oiIGZpbGw9IiMxMDZENUEiIHAtaWQ9IjQ4NzAiPjwvcGF0aD48L3N2Zz4=
// @homepage     https://github.com/ljezio/pure-live
// @source       https://github.com/ljezio/pure-live.git
// @match        *://www.douyu.com/*
// @match        *://www.huya.com/*
// @match        *://live.bilibili.com/*
// @match        *://live.douyin.com/*
// @require      https://registry.npmmirror.com/vue/3.5.22/files/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/533987/%E7%BA%AF%E5%87%80%E7%9B%B4%E6%92%AD%EF%BC%88pure%20live%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533987/%E7%BA%AF%E5%87%80%E7%9B%B4%E6%92%AD%EF%BC%88pure%20live%EF%BC%89.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(' .wrap[data-v-0bb3c17f]{z-index:99999;display:flex;align-items:center;width:650px;height:40px;position:fixed;left:50vw;bottom:20vh;translate:-50%;border-radius:10px;background:#fffc;box-shadow:0 0 16px #00000040;font-size:14px}.wrap[data-v-0bb3c17f]:focus-within{background:#fff}.input[data-v-0bb3c17f]{flex:1;padding:0 16px;height:28px;border:0;color:#333;font-weight:400;opacity:.5;background:none}.input[data-v-0bb3c17f]:focus{opacity:1;outline:none}.button[data-v-0bb3c17f]{position:relative;flex-shrink:0;padding:0 13px;margin:4px;height:32px;line-height:32px;border-radius:8px;border:none;text-align:center;background:linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);background-size:500%;color:#fff;font-weight:500;cursor:pointer;opacity:.5}.button[data-v-0bb3c17f]:before{z-index:-1;content:"";position:absolute;inset:-5px;border-radius:12px;background:linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4);background-size:500%;filter:blur(20px);opacity:0}.wrap:focus-within .button[data-v-0bb3c17f],.wrap:focus-within .button[data-v-0bb3c17f]:before{animation:flow-0bb3c17f 10s linear infinite;opacity:1}@keyframes flow-0bb3c17f{0%{background-position:0}to{background-position:500%}}.button[data-v-82e78e2e]{display:block;cursor:pointer;border:none;padding:0;background-color:transparent;opacity:.3;transition:opacity .3s ease}.opaque-button[data-v-82e78e2e],.button[data-v-82e78e2e]:hover{opacity:1}.draggable[data-v-2a7ea298]{position:fixed;cursor:move;padding:8px;background-color:transparent;-webkit-user-select:none;user-select:none}.app[data-v-d54956fa]{position:relative;z-index:99999} ');

  const siteBilibiliRestyleCss = "#sections-vm,#sidebar-vm,#head-info-vm,#prehold-nav-vm,#room-background-vm,#gift-control-vm,#aside-area-vm,#shop-popover-vm,#web-player__bottom-bar__container,#fullscreen-danmaku-vm,.link-navbar-ctnr,.link-footer,.link-footer-ctnr,.ext-nodes{display:none!important}.app-content,.app-body,.player-and-aside-area,.player-ctnr,.player-section,.live-player-ctnr,#live-player{margin:0!important;padding:0!important;height:100vh!important;width:100vw!important}";
  const STORAGE_KEY = Object.freeze({
SWITCH_SCRIPT: "switch_script",
AUTO_HIGHEST_IMAGE: "auto_highest_image",
DRAGGABLE_AXIS: "draggable_axis"
  });
  const INJECTION_KEY = Object.freeze({
TOP_LAYER_EL: "topLayerEl",
INPUT_MAX_LENGTH: "inputMaxlength",
SEND_BULLET_CHAT_FN: "sendBulletChatFn"
  });
  const INPUT_MAX = Object.freeze({
    DOUYU: 70,
    HUYA: 30,
    BILIBILI: 40,
    DOUYIN: 50
  });
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const storage = (() => {
    const cache = new Map();
    return {
      set: (key, value) => {
        cache.set(key, value);
        _GM_setValue(key, value);
      },
      get: (key, defaultValue) => {
        const cacheVal = cache.get(key);
        if (cacheVal !== void 0 && cacheVal !== null) {
          return cacheVal;
        }
        const storageValue = _GM_getValue(key);
        if (storageValue !== void 0 && storageValue !== null) {
          cache.set(key, storageValue);
          return storageValue;
        } else {
          return defaultValue;
        }
      }
    };
  })();
  const swt = (() => {
    class SwitchFunction {
      #key;
      constructor(key) {
        this.#key = key;
      }
      isOn() {
        return storage.get(this.#key, true);
      }
      isOff() {
        return !this.isOn();
      }
      switch() {
        storage.set(this.#key, !this.isOn());
      }
    }
    return {
script: new SwitchFunction(STORAGE_KEY.SWITCH_SCRIPT),
autoHighestImage: new SwitchFunction(STORAGE_KEY.AUTO_HIGHEST_IMAGE)
    };
  })();
  function throttle(fn, delay = 100) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime > delay) {
        fn.apply(this, args);
        lastTime = now;
      }
    };
  }
  function delayJitter(seconds, jitter = 500) {
    const random = Math.floor(Math.random() * jitter);
    return new Promise((resolve) => setTimeout(resolve, seconds * 1e3 + random));
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$2 = { class: "wrap" };
  const _hoisted_2$2 = ["maxlength"];
  const _sfc_main$4 = {
    __name: "BulletChat",
    setup(__props) {
      const topLayerEl = vue.inject(INJECTION_KEY.TOP_LAYER_EL);
      const inputMaxlength = vue.inject(INJECTION_KEY.INPUT_MAX_LENGTH, 30);
      const sendBulletChatFn2 = vue.inject(INJECTION_KEY.SEND_BULLET_CHAT_FN, () => {
      });
      const inputEl = vue.useTemplateRef("inputRef");
      const isShow = vue.ref(false);
      const bulletChat = vue.ref("");
      const composing = vue.ref(false);
      function send() {
        if (document.activeElement !== inputEl.value) {
          inputEl.value.focus();
        }
        if (!bulletChat.value) return;
        sendBulletChatFn2(bulletChat.value);
        bulletChat.value = "";
        isShow.value = false;
      }
      function handleEnter(event) {
        if (event.key !== "Enter" && event.code !== "Enter") return;
        if (isShow.value === false) {
          isShow.value = true;
          vue.nextTick(() => inputEl.value.focus());
          return;
        }
        if (composing.value) return;
        if (isShow.value === true && !bulletChat.value) {
          isShow.value = false;
          return;
        }
        send();
      }
      vue.onMounted(() => {
        document.addEventListener("keydown", handleEnter);
      });
      vue.onUnmounted(() => {
        document.removeEventListener("keydown", handleEnter);
      });
      return (_ctx, _cache) => {
        return vue.unref(topLayerEl) ? (vue.openBlock(), vue.createBlock(vue.Teleport, {
          key: 0,
          to: vue.unref(topLayerEl)
        }, [
          vue.withDirectives(vue.createElementVNode("div", _hoisted_1$2, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "input",
              placeholder: "请输入弹幕~",
              maxlength: vue.unref(inputMaxlength),
              autocomplete: "off",
              ref: "inputRef",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => bulletChat.value = $event),
              onCompositionstart: _cache[1] || (_cache[1] = ($event) => composing.value = true),
              onCompositionend: _cache[2] || (_cache[2] = ($event) => composing.value = false)
            }, null, 40, _hoisted_2$2), [
              [vue.vModelText, bulletChat.value]
            ]),
            vue.createElementVNode("button", {
              class: "button",
              onClick: send
            }, "发送 (Enter)")
          ], 512), [
            [vue.vShow, isShow.value]
          ])
        ], 8, ["to"])) : vue.createCommentVNode("", true);
      };
    }
  };
  const BulletChat = _export_sfc(_sfc_main$4, [["__scopeId", "data-v-0bb3c17f"]]);
  const _hoisted_1$1 = ["title"];
  const _hoisted_2$1 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20"
  };
  const _hoisted_3 = ["fill"];
  const _hoisted_4 = { key: 0 };
  const _hoisted_5 = ["title"];
  const _hoisted_6 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20"
  };
  const _hoisted_7 = ["fill"];
  const ON_COLOR = "#2C9EFF";
  const OFF_COLOR = "#D94A3C";
  const _sfc_main$3 = {
    __name: "ButtonGroup",
    setup(__props) {
      const scriptSwitchOn = vue.ref(swt.script.isOn());
      function switchScript() {
        scriptSwitchOn.value = !scriptSwitchOn.value;
        swt.script.switch();
        location.reload();
      }
      const autoHighestImageSwitchOn = vue.ref(swt.autoHighestImage.isOn());
      function switchAutoHighestImage() {
        autoHighestImageSwitchOn.value = !autoHighestImageSwitchOn.value;
        swt.autoHighestImage.switch();
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["button", { "opaque-button": !scriptSwitchOn.value }]),
            onClick: switchScript,
            title: scriptSwitchOn.value ? "关闭脚本" : "启用脚本"
          }, [
            (vue.openBlock(), vue.createElementBlock("svg", _hoisted_2$1, [
              vue.createElementVNode("path", {
                d: "M512.64 0C229.674667 0 0.298667 229.248 0.298667 512s229.376 512 512.384 512c282.965333 0 512.341333-229.248 512.341333-512S795.605333 0 512.64 0z m-37.290667 225.578667a38.528 38.528 0 0 1 77.141334 0v134.741333a38.528 38.528 0 0 1-77.141334 0V225.578667z m38.570667 578.773333a280.405333 280.405333 0 0 1-280.490667-280.277333 280.192 280.192 0 0 1 203.477334-269.312V323.413333a215.04 215.04 0 0 0 76.970666 415.829334 215.210667 215.210667 0 0 0 215.296-215.125334 215.04 215.04 0 0 0-138.282666-200.704V254.72c117.418667 33.493333 203.477333 141.269333 203.477333 269.312a280.362667 280.362667 0 0 1-280.448 280.32z",
                fill: scriptSwitchOn.value ? ON_COLOR : OFF_COLOR
              }, null, 8, _hoisted_3)
            ]))
          ], 10, _hoisted_1$1),
          scriptSwitchOn.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
            vue.createElementVNode("button", {
              class: "button",
              onClick: switchAutoHighestImage,
              title: autoHighestImageSwitchOn.value ? "关闭自动切换最高画质" : "开启自动切换最高画质"
            }, [
              (vue.openBlock(), vue.createElementBlock("svg", _hoisted_6, [
                vue.createElementVNode("path", {
                  d: "M0 0m256 0l512 0q256 0 256 256l0 512q0 256-256 256l-512 0q-256 0-256-256l0-512q0-256 256-256Z",
                  fill: autoHighestImageSwitchOn.value ? ON_COLOR : OFF_COLOR
                }, null, 8, _hoisted_7),
                _cache[0] || (_cache[0] = vue.createElementVNode("path", {
                  d: "M752.4864 802.048a70.144 70.144 0 0 1-3.4816 0.1024H274.9952A70.144 70.144 0 0 1 204.8 731.9552V326.1952A70.2464 70.2464 0 0 1 274.944 256h474.112a68.9664 68.9664 0 0 1 33.0752 8.2432 70.9632 70.9632 0 0 1 27.136 25.856 73.3696 73.3696 0 0 1 7.8336 18.9952 75.1616 75.1616 0 0 1 2.0992 17.1008v405.76a70.3488 70.3488 0 0 1-43.3152 64.8704 74.24 74.24 0 0 1-16.5376 4.5568 69.2736 69.2736 0 0 1-6.8608 0.6656zM342.9888 392.5504a34.4576 34.4576 0 0 0-28.0576 12.4416 34.2016 34.2016 0 0 0-7.7312 21.6576v204.8a34.048 34.048 0 0 0 4.864 17.5616l0.8704 1.4336a34.9184 34.9184 0 0 0 15.36 12.5952 34.4576 34.4576 0 0 0 29.1328-1.4336 38.0928 38.0928 0 0 0 8.0384-5.9904 32.768 32.768 0 0 0 7.9872-12.6464 33.28 33.28 0 0 0 2.048-11.52V563.2h68.2496v68.2496a34.4576 34.4576 0 0 0 12.4416 26.4192 35.2256 35.2256 0 0 0 16.6912 7.3728 36.3008 36.3008 0 0 0 11.6224-0.3072 30.1056 30.1056 0 0 0 7.936-2.6112 39.2704 39.2704 0 0 0 7.0656-4.4544 33.9968 33.9968 0 0 0 12.4928-26.4192v-204.8a33.792 33.792 0 0 0-13.824-27.392 34.0992 34.0992 0 0 0-54.4256 27.392v68.3008H375.4496V426.6496a34.4576 34.4576 0 0 0-12.4416-26.368 34.2528 34.2528 0 0 0-19.968-7.68z m271.4112 0h-41.5232a26.6752 26.6752 0 0 0-26.7264 26.7264V640.2048a22.528 22.528 0 0 0 0.768 5.12 32.768 32.768 0 0 0 2.3552 6.144 28.16 28.16 0 0 0 6.656 8.0896 26.624 26.624 0 0 0 16.896 6.0416H614.4a139.008 139.008 0 0 0 45.9776-7.9872 135.68 135.68 0 0 0 63.6928-47.2064 144.5376 144.5376 0 0 0 13.7728-22.9888 135.9872 135.9872 0 0 0 7.168-97.9968 132.8128 132.8128 0 0 0-17.1008-36.1984 139.008 139.008 0 0 0-32.2048-33.792 133.632 133.632 0 0 0-35.328-18.944A138.24 138.24 0 0 0 614.4 392.6016z m3.3792 204.6976a66.6112 66.6112 0 0 1-3.3792 0.1024V460.8a67.84 67.84 0 0 1 50.6368 22.4256 69.12 69.12 0 0 1 17.3568 39.168 60.7744 60.7744 0 0 1 0 13.3632 66.304 66.304 0 0 1-7.7312 25.4976 67.8912 67.8912 0 0 1-46.9504 34.816 65.4336 65.4336 0 0 1-9.9328 1.1776z",
                  fill: "#FFFFFF"
                }, null, -1))
              ]))
            ], 8, _hoisted_5)
          ])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  };
  const ButtonGroup = _export_sfc(_sfc_main$3, [["__scopeId", "data-v-82e78e2e"]]);
  const _sfc_main$2 = {
    __name: "Draggable",
    setup(__props) {
      const draggableEl = vue.useTemplateRef("draggableRef");
      const axis = vue.reactive({ x: 0, y: 0, mouseX: 0, mouseY: 0 });
      function startDrag(event) {
        if (event.target !== draggableEl.value) return;
        axis.mouseX = event.clientX;
        axis.mouseY = event.clientY;
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);
      }
      function onDrag(event) {
        setNewAxis(event.clientX - axis.mouseX + axis.x, event.clientY - axis.mouseY + axis.y);
        axis.mouseX = event.clientX;
        axis.mouseY = event.clientY;
      }
      function stopDrag() {
        storage.set(STORAGE_KEY.DRAGGABLE_AXIS, { oldX: axis.x, oldY: axis.y, oldWidth: innerWidth, oldHeight: innerHeight });
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
      }
      function setNewAxis(newX, newY) {
        if (newX < 0) {
          axis.x = 0;
        } else if (newX > document.documentElement.clientWidth - draggableEl.value.offsetWidth) {
          axis.x = document.documentElement.clientWidth - draggableEl.value.offsetWidth;
        } else {
          axis.x = newX;
        }
        if (newY < 0) {
          axis.y = 0;
        } else if (newY > document.documentElement.clientHeight - draggableEl.value.offsetHeight) {
          axis.y = document.documentElement.clientHeight - draggableEl.value.offsetHeight;
        } else {
          axis.y = newY;
        }
      }
      vue.onBeforeMount(() => {
        const oldAxis = storage.get(STORAGE_KEY.DRAGGABLE_AXIS);
        if (!oldAxis) return;
        axis.x = oldAxis.oldX / oldAxis.oldWidth * innerWidth;
        axis.y = oldAxis.oldY / oldAxis.oldHeight * innerHeight;
      });
      vue.onMounted(() => {
        let beforeSize = { width: innerWidth, height: innerHeight };
        window.addEventListener(
          "resize",
          throttle(() => {
            setNewAxis(axis.x / beforeSize.width * innerWidth, axis.y / beforeSize.height * innerHeight);
            beforeSize.width = innerWidth;
            beforeSize.height = innerHeight;
          }, 100)
        );
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref: "draggableRef",
          class: "draggable",
          style: vue.normalizeStyle({ left: axis.x + "px", top: axis.y + "px" }),
          onMousedown: startDrag
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 36);
      };
    }
  };
  const Draggable = _export_sfc(_sfc_main$2, [["__scopeId", "data-v-2a7ea298"]]);
  const _sfc_main$1 = {
    __name: "FunctionButtons",
    setup(__props) {
      const isShow = vue.ref(true);
      function handleShowButtonGroup() {
        isShow.value = !document.fullscreenElement;
      }
      vue.onMounted(() => {
        document.addEventListener("fullscreenchange", handleShowButtonGroup);
      });
      vue.onUnmounted(() => {
        document.removeEventListener("fullscreenchange", handleShowButtonGroup);
      });
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(Draggable, null, {
            default: vue.withCtx(() => [
              vue.createVNode(ButtonGroup)
            ]),
            _: 1
          })
        ], 512)), [
          [vue.vShow, isShow.value]
        ]);
      };
    }
  };
  const _hoisted_1 = { class: "app" };
  const _hoisted_2 = { key: 0 };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.createVNode(_sfc_main$1),
          vue.unref(swt).script.isOn() ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
            vue.createVNode(BulletChat)
          ])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  };
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-d54956fa"]]);
  function mountVue(topLayerEl, inputMaxlength, sendBulletChatFn2) {
    const app = vue.createApp(App);
    app.provide(INJECTION_KEY.TOP_LAYER_EL, topLayerEl);
    app.provide(INJECTION_KEY.INPUT_MAX_LENGTH, inputMaxlength);
    app.provide(INJECTION_KEY.SEND_BULLET_CHAT_FN, sendBulletChatFn2);
    app.mount(
      (() => {
        const div = document.createElement("div");
        document.body.append(div);
        return div;
      })()
    );
  }
  function redirectRealLive() {
    const root = document.querySelector(".rendererRoot");
    if (!root) return;
    const urlPrefix = `${window.location.href.split("//")[0]}//live.bilibili.com`;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const iframe = node.querySelector("iframe");
          if (!iframe?.src?.startsWith(urlPrefix)) continue;
          window.location.replace(iframe.src);
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    setInterval(() => observer.disconnect(), 1e3 * 10);
  }
  function autoHighestImage$2() {
    if (swt.autoHighestImage.isOff()) return;
    const player = document.querySelector("#live-player");
    if (!player) return;
    player.dispatchEvent(new MouseEvent("mousemove"));
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.localName !== "div") continue;
          if (node.className?.startsWith("quality-wrap")) {
            node.dispatchEvent(new MouseEvent("mouseenter"));
          } else if (node.className?.startsWith("list-it") && node.previousElementSibling?.className?.startsWith("line-wrap")) {
            observer.disconnect();
            delayJitter(1).then(async () => {
              node.click();
              await delayJitter(1);
              player.querySelector(".quality-wrap")?.dispatchEvent(new MouseEvent("mouseleave"));
            });
            return;
          }
        }
      }
    });
    observer.observe(player, { childList: true, subtree: true });
    player.querySelector(".quality-wrap")?.dispatchEvent(new MouseEvent("mouseenter"));
    delayJitter(10).then(() => observer.disconnect());
  }
  function dbClick$3(element) {
    element.ondblclick = () => {
      if (!document.fullscreenElement) {
        document.querySelector("#web-player-controller-wrap-el .right-area :first-child span")?.click();
      } else {
        document.exitFullscreen().then();
      }
    };
  }
  const sendBulletChatFn$3 = (() => {
    let txt, button;
    return (bulletChat) => {
      if (!txt || !button) {
        const box = document.querySelector("#control-panel-ctnr-box");
        txt = box?.querySelector(".chat-input");
        button = box?.querySelector(".bl-button");
        if (!txt || !button) return;
      }
      txt.value = bulletChat;
      txt.dispatchEvent(new InputEvent("input"));
      button.click();
    };
  })();
  function pureBilibili() {
    const video = document.querySelector("#live-player");
    if (!video && !document.querySelector("#app .rendererRoot")) return;
    mountVue(video, INPUT_MAX.BILIBILI, sendBulletChatFn$3);
    if (swt.script.isOn()) {
      redirectRealLive();
      importCSS(siteBilibiliRestyleCss);
      autoHighestImage$2();
      dbClick$3(video);
    }
  }
  const siteDouyinRestyleCss = "#douyin-navigation,#douyin-header,#RightBackgroundLayout,#BottomLayout,#HeaderLayout,#GiftEffectLayout,#GiftTrayLayout,#EcmoCardLayout,#ShortTouchLayout,#LikeLayout,#room_info_bar,.ShortTouchBigCard,.douyin-player-controls-inner+div,.chatroom_close{display:none!important}#LeftBackgroundLayout,#ContainerBackgroundLayout{margin:0!important;height:100vh!important;width:100vw!important}.__livingPlayer__{padding:0!important}";
  function autoHighestImage$1() {
    if (swt.autoHighestImage.isOff()) return;
    const control = document.querySelector(".douyin-player-controls-right");
    if (!control) return;
    const observer = new MutationObserver(async (mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.localName !== "div" || !node.className.includes("QualitySwitchNewPlugin")) continue;
          observer.disconnect();
          node.querySelector('[data-e2e="quality-selector"] > :nth-child(2)')?.click();
          return;
        }
      }
    });
    observer.observe(control, { childList: true, subtree: true });
    delayJitter(10).then(() => observer.disconnect());
  }
  function dbClick$2(element) {
    element.ondblclick = () => {
      if (!document.fullscreenElement) {
        document.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyH" }));
      } else {
        document.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyY", bubbles: true }));
      }
    };
  }
  const sendBulletChatFn$2 = (() => {
    let input, btn;
    return (bulletChat) => {
      if (!input || !btn) {
        const chat = document.querySelector("#chatInput");
        input = chat.querySelector(".zone-container");
        btn = chat.querySelector(".webcast-chatroom___send-btn");
        if (!input || !btn) return;
      }
      input.children[0].innerHTML = `<span data-string="true" data-leaf="true">${bulletChat}</span><span data-string="true" data-enter="true" data-leaf="true">​</span>`;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      btn.dispatchEvent(new Event("click", { bubbles: true }));
    };
  })();
  function pureDouyin() {
    const player = document.querySelector("#PlayerLayout");
    if (!player) return;
    mountVue(document.body, INPUT_MAX.DOUYIN, sendBulletChatFn$2);
    if (swt.script.isOn()) {
      importCSS(siteDouyinRestyleCss);
      autoHighestImage$1();
      dbClick$2(player);
    }
  }
  const siteDouyuRestyleCss = "header,aside,#js-bottom-left,#bc3,#bc3-bgblur,#js-player-dialog,#js-player-above-controller,#js-layout-fixed-buff,#js-room-top-banner,#js-layout-fixed-right,#driver-popover-content,#js-layout-fixed-banner,.wm-general,.bc-wrapper,.RechangeJulyPopups,.MatchVoteDialog,.bacpCommonKeFu,.dy-Modal-wrap,.CloseVideoPlayerAd,.JinChanChanGame,.dy-Message,[class^=snapbar__],[class^=sidebar__],[class^=title__],[class^=interactive__],[class^=toggle__],[class^=quickChatBarView-],[class^=fullScreenSendor-]{display:none!important}#root,#js-player-main{margin:0!important;height:100vh!important}[class^=stream__]{bottom:0!important;top:0!important}[class^=case__],[class^=playerWrap__],[class^=page__]{padding:0!important}#js-player-main:before,[class^=player__]:before{content:none!important}[class^=stream__]{height:100vh!important}body{overflow:hidden!important}";
  function avoidSmallWindow() {
    const element = document.querySelector("#js-player-video-case");
    const observer = new MutationObserver(() => {
      observer.disconnect();
      setTimeout(() => element.querySelector(".roomSmallPlayerFloatLayout-closeBtn")?.click(), 3e3);
      element.style.left = 0;
      element.className = element.className.replace("is-smallDangling", "");
      const subEl = element.querySelector(".room-Player-Box");
      if (subEl) {
        subEl.className = subEl.className.replace("is-smallDangling", "");
      }
    });
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }
  function autoHighestImage() {
    if (swt.autoHighestImage.isOff()) return;
    const controlBar = document.querySelector("#js-player-controlbar");
    if (!controlBar) return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE || !node.className?.startsWith("ControlBar-")) continue;
          observer.disconnect();
          node.querySelector('[class^="tipItem-"]:nth-child(2) li:first-child')?.click();
          return;
        }
      }
    });
    observer.observe(controlBar, { childList: true, subtree: true });
    delayJitter(10).then(() => observer.disconnect());
  }
  function dbClick$1(element) {
    const keyboardEvent = new KeyboardEvent("keydown", {
      code: "KeyH",
      bubbles: true
    });
    element.ondblclick = () => {
      if (!document.fullscreenElement) {
        document.body.dispatchEvent(keyboardEvent);
      } else {
        document.exitFullscreen().then();
      }
    };
  }
  const sendBulletChatFn$1 = (() => {
    let txt, button;
    return (bulletChat) => {
      if (!txt || !button) {
        const aside = document.querySelector("#js-player-asideMain");
        txt = aside?.querySelector(".ChatSend-txt");
        button = aside?.querySelector(".ChatSend-button");
        if (!txt || !button) return;
      }
      txt.innerHTML = bulletChat;
      button.click();
    };
  })();
  function pureDouyu() {
    const player = document.querySelector("#js-player-main");
    if (!player) return;
    mountVue(document.body, INPUT_MAX.DOUYU, sendBulletChatFn$1);
    if (swt.script.isOn()) {
      const location2 = window.location;
      if (!location2.pathname.startsWith("/beta/") && Date.now() <= 17671104e5) {
        window.location.replace(`${location2.origin}/beta${location2.pathname}${location2.search}`);
      }
      importCSS(siteDouyuRestyleCss);
      avoidSmallWindow();
      autoHighestImage();
      dbClick$1(player);
    }
  }
  const siteHuyaRestyleCss = "#duya-header,#matchComponent2,#room-footer,#match-cms-content,#J_roomHeader,#player-gift-wrap,#player-ext-wrap,#player-fullpage-right-btn,#player-fullpage-btn,#J_spbg,#gift-show-btn,#J_roomGgTop,#player-login-guide-tip,#player-full-input,#huya-ab,.mod-sidebar,.match-top,.match-nav,.room-core-r,.common-popup,.popup-slide-in,.gift-info-wrap,.match-score-popup,.pre-ab-new-wrap,.new-reward-ab-wrap,.end-ab-wrap{display:none!important}#J_mainRoom{background-image:none!important}#J_mainWrap,#J_mainRoom{padding:0!important}.room-core-l,.match-room{margin:0!important}.room-player-wrap{width:100vw!important}#root{height:auto!important}#player-wrap,#player-video{height:100vh!important}#videoContainer{height:calc(100vh + 60px)!important}.bitrate-right-btn.common-enjoy-btn{text-decoration:line-through!important}";
  function skipAd() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.className !== "pre-ab-new-wrap") continue;
          node.querySelector(".ab-skip")?.click();
        }
      }
    });
    observer.observe(document.querySelector("#videoContainer"), { childList: true });
    delayJitter(10).then(() => observer.disconnect());
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.className !== "new-reward-ab-container") continue;
          node.querySelector(".ab-close")?.click();
          node.querySelector(".ab-close-2")?.click();
        }
      }
    }).observe(document.querySelector("#player-wrap"), { childList: true });
  }
  function unlockAndSwitchHighestImage() {
    const liveRoom = document.querySelector("#liveRoomObj");
    if (!liveRoom) return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE || node.id !== "player-ctrl-wrap") continue;
          observer.disconnect();
          delayJitter(3).then(() => {
            const videoTypeList = node.querySelector(".player-videotype-list")?.children;
            if (!videoTypeList) return;
            for (const ul of videoTypeList) {
              $(ul).data("data").status = 0;
            }
            if (swt.autoHighestImage.isOn()) {
              videoTypeList[0].click();
            }
          });
          return;
        }
      }
    });
    observer.observe(liveRoom, { childList: true, subtree: true });
    delayJitter(10).then(() => observer.disconnect());
  }
  function dbClick(element) {
    element.ondblclick = () => {
      if (!document.fullscreenElement) {
        document.querySelector("#player-fullscreen-btn")?.click();
      } else {
        document.exitFullscreen().then();
      }
    };
  }
  const sendBulletChatFn = (() => {
    let txt, button;
    return (bulletChat) => {
      if (!txt || !button) {
        txt = document.querySelector("#player-full-input-txt");
        button = document.querySelector("#player-full-input-btn");
        if (!txt || !button) return;
      }
      txt.value = bulletChat;
      button.click();
    };
  })();
  function pureHuya() {
    const video = document.querySelector("#videoContainer");
    if (!video) return;
    mountVue(video, INPUT_MAX.HUYA, sendBulletChatFn);
    if (swt.script.isOn()) {
      importCSS(siteHuyaRestyleCss);
      skipAd();
      unlockAndSwitchHighestImage();
      dbClick(video);
    }
  }
  const platformMap = new Map([
    ["www.douyu.com", pureDouyu],
    ["www.huya.com", pureHuya],
    ["live.bilibili.com", pureBilibili],
    ["live.douyin.com", pureDouyin]
  ]);
  (() => {
    platformMap.get(window.location.hostname)?.();
  })();

})(Vue);