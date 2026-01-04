// ==UserScript==
// @name         Bing Reward AUTO
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.0.2
// @author       yeshuqz
// @description  script for bing reward, help you to get reward automatically
// @license      MIT
// @icon         https://toolb.cn/favicon/bing.com
// @match        https://www.bing.com/search?*
// @match        https://cn.bing.com/search?*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.17/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/522369/Bing%20Reward%20AUTO.user.js
// @updateURL https://update.greasyfork.org/scripts/522369/Bing%20Reward%20AUTO.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const a=document.createElement("style");a.textContent=t,document.head.append(a)})(" #bing-reward{display:inline-block}button[data-v-10aff0a9],span[data-v-10aff0a9]{margin-right:10px} ");

(function (vue) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  function getLevenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from(
      { length: m + 1 },
      () => Array(n + 1).fill(0)
    );
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          // 删除
          dp[i][j - 1] + 1,
          // 插入
          dp[i - 1][j - 1] + cost
          // 替换
        );
      }
    }
    return dp[m][n];
  }
  function similarity(a, b) {
    if (a === b) return 1;
    if (a.length === 0 || b.length === 0) return 0;
    const distance = getLevenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    return 1 - distance / maxLen;
  }
  function randomText() {
    const forbiddenWords = ["周内", "月内", "小时内"];
    const method = () => {
      const div = document.querySelector("#b_content");
      if (!div || !div.textContent) return "";
      const zh = div.textContent.replace(/[^\u4e00-\u9fa5]+/g, "").substring(201);
      const length = Math.floor(Math.random() * 10) + 2;
      const index = Math.floor(Math.random() * 100) + 1;
      return zh.substring(index, index + length);
    };
    const text = method();
    for (const word of forbiddenWords) {
      if (text == null ? void 0 : text.includes(word)) {
        return randomText();
      }
    }
    return text;
  }
  function getSearchText(stringList) {
    let text = randomText();
    let similarityList = stringList.filter((s) => similarity(s, text) > 0.7);
    while (similarityList.length > 0) {
      text = randomText();
      similarityList = stringList.filter((s) => similarity(s, text) > 0.7);
    }
    return text;
  }
  const StringUtil = { getSearchText };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "Main",
    setup(__props) {
      var _a;
      const config = vue.ref(_GM_getValue("config", { enable: false, dayLimit: 30 }));
      const history = _GM_getValue("history", {});
      const today = (_a = (/* @__PURE__ */ new Date()).toLocaleString().split(" ")[0]) == null ? void 0 : _a.replaceAll("/", "-");
      const todaySearchList = vue.ref(history[today] || []);
      const searchText = vue.ref(StringUtil.getSearchText(todaySearchList.value));
      function nextSearchText() {
        searchText.value = StringUtil.getSearchText(todaySearchList.value);
      }
      const timeout = vue.ref(Math.random() * 15 * 1e3 + 7e3);
      const interval = setInterval(() => {
        if (!config.value.enable) return;
        if (todaySearchList.value.length >= config.value.dayLimit) {
          clearInterval(interval);
          return;
        }
        if (timeout.value <= 0) {
          clearInterval(interval);
          jump();
          return;
        }
        timeout.value -= 100;
      }, 100);
      function jump() {
        const href = window.location.href;
        const url = href.replace(/([?&])q=(.*?)&/, "?q=" + encodeURIComponent(searchText.value) + "&");
        console.log(" jump to url", url);
        _GM_openInTab(url, true);
        window.close();
      }
      const timeoutDisplay = vue.computed(() => {
        if (timeout.value <= 0) return 0;
        let sec = timeout.value / 1e3;
        return sec.toFixed(2);
      });
      function toggleButton() {
        config.value.enable = !config.value.enable;
        _GM_setValue("config", config.value);
      }
      vue.onMounted(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        if (q && !todaySearchList.value.includes(q)) {
          todaySearchList.value.push(q);
          history[today] = todaySearchList.value;
          _GM_setValue("history", history);
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          todaySearchList.value.length < config.value.dayLimit ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createElementVNode("button", { onClick: toggleButton }, vue.toDisplayString(config.value.enable ? "停止" : "启动"), 1),
            vue.createElementVNode("button", {
              onClick: nextSearchText,
              onContextmenu: jump,
              title: "右键直接跳转！"
            }, "切换搜索词", 32),
            vue.createElementVNode("span", null, "距离搜索 “" + vue.toDisplayString(searchText.value) + "” 还剩 " + vue.toDisplayString(timeoutDisplay.value) + " 秒", 1)
          ], 64)) : vue.createCommentVNode("", true),
          vue.createElementVNode("span", null, "今日次数：" + vue.toDisplayString(todaySearchList.value.length) + "/" + vue.toDisplayString(config.value.dayLimit), 1)
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
  const Main = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-10aff0a9"]]);
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(Main);
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      app.id = "bing-reward";
      const headerDom = document.getElementById("b_header");
      let userDom = document.getElementById("id_h");
      if (userDom.parentNode === headerDom) {
        headerDom == null ? void 0 : headerDom.insertBefore(app, userDom);
      } else {
        userDom = document.querySelector(".b_searchbox_line");
        userDom.style.display = "inline-block";
        headerDom == null ? void 0 : headerDom.appendChild(app);
      }
      return app;
    })()
  );

})(Vue);