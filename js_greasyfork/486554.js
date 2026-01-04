// ==UserScript==
// @name         抖快营销助手
// @namespace    wasdjkl
// @version      0.0.5
// @author       wasdjkl
// @description  自动评论推广
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/13827327
// @homepage     https://www.wasdjkl.com
// @match        https://www.douyin.com/*
// @match        https://www.kuaishou.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.15/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.19.1/dist/lil-gui.umd.min.js
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/486554/%E6%8A%96%E5%BF%AB%E8%90%A5%E9%94%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/486554/%E6%8A%96%E5%BF%AB%E8%90%A5%E9%94%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function (vue, lilGui) {
  'use strict';

  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  const _hoisted_1 = { style: { "position": "fixed", "top": "0", "left": "100px", "z-index": "999999999999", "color": "red" } };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      function getRandom(n, m) {
        return Math.floor(Math.random() * (m - n + 1) + n);
      }
      function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }
      async function nextVideo() {
        document.body.dispatchEvent(new KeyboardEvent("keydown", {
          bubbles: true,
          code: "ArrowDown",
          key: "ArrowDown",
          keyCode: 40
        }));
        setting.times -= 1;
        console.log("剩余次数：", setting.times);
      }
      let flag = true;
      async function process() {
        if (!flag)
          return;
        const commentInputContainer = document.querySelector(".comment-input-container");
        console.warn("评论区", commentInputContainer);
        if (!commentInputContainer) {
          const feedCommentIcon = document.querySelector('div[data-e2e="feed-comment-icon"]');
          console.warn("打开评论区的按钮", feedCommentIcon);
          if (!feedCommentIcon) {
            console.warn("该视频不支持评论，自动下一个");
            await nextVideo();
            setTimeout(process, getRandom(setting.sleep, setting.sleep + 2e3));
            return;
          } else {
            console.log("打开评论区", feedCommentIcon);
            feedCommentIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            await sleep(1e3);
          }
        }
        await sleep(1e3);
        console.warn("进入评论逻辑");
        const input = document.querySelector(".comment-input-inner-container");
        console.warn("输入框", input);
        if (!input) {
          console.warn("该视频不支持评论，自动下一个");
          await nextVideo();
          setTimeout(process, getRandom(setting.sleep, setting.sleep + 2e3));
        }
        input.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await sleep(500);
        const draftEditor = input.querySelector('.DraftEditor-root [data-contents="true"]');
        const dataTransfer = new DataTransfer();
        dataTransfer.setData("text/plain", setting.msg);
        const pasteEvent = new ClipboardEvent("paste", {
          bubbles: true,
          clipboardData: dataTransfer
        });
        draftEditor.dispatchEvent(pasteEvent);
        await sleep(500);
        if (!setting.test) {
          document.querySelector(".commentInput-right-ct span:nth-child(3)").dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
        console.warn("该视频评论完毕，自动下一个");
        await sleep(1e3);
        await nextVideo();
        setTimeout(process, getRandom(setting.sleep, setting.sleep + 2e3));
      }
      const container = vue.ref(null);
      let gui;
      let startBtn;
      let endBtn;
      const setting = vue.reactive({
        sleep: 1e3,
        times: 100,
        performance: true,
        msg: " [666]  [666]  [666] ",
        test: true,
        start() {
          flag = true;
          process();
          startBtn.hide();
          endBtn.show();
        },
        end() {
          flag = false;
          startBtn.show();
          endBtn.hide();
        }
      });
      vue.onMounted(async () => {
        setting.sleep = await _GM.getValue("setting.sleep", 1e3);
        setting.times = await _GM.getValue("setting.times", 100);
        setting.performance = await _GM.getValue("setting.performance", true);
        setting.msg = await _GM.getValue("setting.msg", " [666]  [666]  [666] ");
        setting.test = await _GM.getValue("setting.test", true);
        gui = new lilGui.GUI({
          title: "抖音营销助手",
          width: 200,
          closeFolders: true,
          autoPlace: true,
          container: container.value
        });
        const commontGui = gui.addFolder("自动评论");
        commontGui.add(setting, "sleep").name("每次操作的最小随机延时").min(1e3).max(5e3);
        commontGui.add(setting, "times").name("操作次数").min(1).max(1e3).step(1);
        commontGui.add(setting, "performance").name("性能模式（不显示视频）");
        commontGui.add(setting, "test").name("测试模式(不点击发送按钮)");
        commontGui.add(setting, "msg").name("评论内容");
        startBtn = commontGui.add(setting, "start").name("启动");
        endBtn = commontGui.add(setting, "end").name("停止").hide();
      });
      const style = document.createElement("style");
      style.textContent = `video{display:none}`;
      vue.watch(() => setting.performance, (value) => {
        console.warn("性能模式:", value);
        if (value) {
          document.head.append(style);
        } else {
          document.head.removeChild(style);
        }
      }, {
        immediate: true
      });
      vue.watch(setting, (setting2) => {
        _GM.setValue("setting.sleep", setting2.sleep);
        _GM.setValue("setting.times", setting2.times);
        _GM.setValue("setting.performance", setting2.performance);
        _GM.setValue("setting.msg", setting2.msg);
        _GM.setValue("setting.test", setting2.test);
      });
      vue.onUnmounted(() => {
        gui.destroy();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("div", {
            ref_key: "container",
            ref: container,
            style: { "position": "fixed", "top": "0", "left": "0", "z-index": "999999999999" }
          }, null, 512),
          vue.createElementVNode("div", _hoisted_1, " 剩余次数：" + vue.toDisplayString(setting.times), 1)
        ], 64);
      };
    }
  };
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, lil);