// ==UserScript==
// @name         google translate utils
// @name:zh-CN   google翻译实用工具
// @description  Full screen content, replace line breaks; draw inspiration from tabedit
// @description:zh-CN 内容全屏，替换换行；借鉴 tabedit
// @namespace    http://tampermonkey.net/
// @version      20251117
// @author       linlccc
// @include     http*://translate.google.*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543711/google%20translate%20utils.user.js
// @updateURL https://update.greasyfork.org/scripts/543711/google%20translate%20utils.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 激活时颜色
  const activeColor = "rgba(66,133,244,.12)";
  // 非激活时颜色
  const inactiveColor = "rgba(0, 0, 0, 0)";
  // 获取导航栏容器
  const navContainer = Array.from(document.querySelectorAll("nav")).filter((v) => v.innerHTML.indexOf("翻译类型") !== -1)[0];
  if (!navContainer) {
    console.warn("无法找到导航栏容器，可能页面结构已更改");
    return;
  }

  // 添加一个导航按钮
  function addNavButton(text, callback) {
    // 复制一个按钮
    const copyButtonCon = navContainer.children[2].cloneNode(true);
    const copyButton = copyButtonCon.querySelector("button");
    // 设置按钮
    copyButton.querySelector("svg").remove();
    copyButton.querySelector("span").innerText = text;
    copyButton.addEventListener("click", callback);
    // 添加到导航栏
    navContainer.appendChild(copyButtonCon);
    return copyButton;
  }
  // 设置导航按钮文本
  function setNavButtonContent(button, content) {
    if (button && button.querySelector("span")) button.querySelector("span").innerText = content;
  }
  // 添加占位
  function addNavButtonPlaceholder() {
    const button = addNavButton("分隔占位");
    button.innerText = "";
    button.style.minWidth = "0";
    button.style.padding = "0";
  }
  // 添加样式
  function addStyle(style, id) {
    const styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(style));
    if (id) styleElement.id = id;
    document.head.appendChild(styleElement);
  }

  // 内容全屏
  function addFullScreenContent() {
    // 控制的元素
    const ctrlE = document.evaluate("/html/body/c-wiz/div/div[2]/c-wiz", document).iterateNext();
    const ctrlE2 = document.evaluate("/html/body/c-wiz/div/div[2]/c-wiz/div[6]", document).iterateNext();
    if (!ctrlE) {
      console.warn("无法找到内容容器，可能页面结构已更改");
      return;
    }
    // 全屏状态 key
    const fullScreenKey = "enableContentFullScreen";
    // 创建的按钮
    let button = null;
    // 获取是否全屏状态
    const getFullScreenState = () => localStorage.getItem(fullScreenKey) === "true";
    // 设置全屏状态
    const setFullScreenState = (enabled) => localStorage.setItem(fullScreenKey, enabled.toString());
    // 更新按钮显示
    function updateButton() {
      const state = getFullScreenState();
      // 设置按钮背景颜色
      button.style.backgroundColor = state ? activeColor : inactiveColor;
      // 设置按钮文本
      setNavButtonContent(button, state ? "关闭内容全屏" : "开启内容全屏");
    }
    // 更新全屏样式
    function updateFullScreenStyle() {
      if (getFullScreenState()) {
        ctrlE.style.padding = "5px";
        ctrlE.style.maxWidth = "100%";
        if (ctrlE2) ctrlE2.style.maxWidth = "100%";
      } else {
        ctrlE.style.padding = "";
        ctrlE.style.maxWidth = "";
        if (ctrlE2) ctrlE2.style.maxWidth = "";
      }
    }

    // 添加内容全屏按钮
    button = addNavButton("", () => {
      setFullScreenState(!getFullScreenState());
      updateButton();
      updateFullScreenStyle();
    });

    // 恢复状态
    updateButton();
    updateFullScreenStyle();
  }

  // 替换换行
  function replaceLineBreaks() {
    addNavButton("替换换行", () => {
      var raw = /text=([^&]+)/.exec(location.href);
      raw = raw && raw[1];
      if (!raw) return;

      raw = decodeURIComponent(raw);
      if (!/\n/.test(raw)) return;

      var replaced = raw.replace(/\n/g, " ").replace(/ {2,}/g, " ").replace(/\. /g, ".");
      replaced = encodeURIComponent(replaced);
      var location_href = location.href.replace(/text=([^&]+)/, "text=" + replaced);
      location.href = location_href;
    });
  }

  // 屏蔽干扰元素
  function removeExtraElements() {
    // 头部
    const header = document.evaluate("/html/body/div[2]/header", document).iterateNext();
    // 头部占位
    const headerPlaceholder = document.evaluate("/html/body/c-wiz/div/div[1]", document).iterateNext();
    // 反馈
    const feedback = document.evaluate("/html/body/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[3]", document).iterateNext();
    // 历史数据
    const historyData = document.evaluate("/html/body/c-wiz/div/div[2]/c-wiz/nav", document).iterateNext();

    // key
    const removeKey = "removeExtraElements";
    // 创建的按钮
    let button = null;
    // 获取是否移除状态
    const getRemoveState = () => localStorage.getItem(removeKey) === "true";
    // 设置移除状态
    const setRemoveState = (enabled) => localStorage.setItem(removeKey, enabled.toString());
    // 更新按钮显示
    function updateButton() {
      const state = getRemoveState();
      // 设置按钮背景颜色
      button.style.backgroundColor = state ? activeColor : inactiveColor;
      // 设置按钮文本
      setNavButtonContent(button, state ? "恢复干扰元素" : "屏蔽干扰元素");
    }
    // 更新元素显示
    function updateElements() {
      if (getRemoveState()) {
        if (header) header.style.display = "none";
        if (headerPlaceholder) headerPlaceholder.style.display = "none";
        if (feedback) feedback.style.display = "none";
        if (historyData) historyData.style.display = "none";
      } else {
        if (header) header.style.display = "";
        if (headerPlaceholder) headerPlaceholder.style.display = "";
        if (feedback) feedback.style.display = "";
        if (historyData) historyData.style.display = "";
      }
    }

    // 添加移除多余元素按钮
    button = addNavButton("", () => {
      setRemoveState(!getRemoveState());
      updateButton();
      updateElements();
    });

    // 恢复状态
    updateButton();
    updateElements();
  }

  // 深色模式
  function darkMode() {
    // 添加深色模式样式
    addStyle(
      `html[theme='dark'] {
        filter: invert(1) hue-rotate(180deg);
      }
      html[theme='dark'] img, picture, video {
        filter: invert(1) hue-rotate(180deg);
      }`,
      "darkModeStyle",
    );

    // 深色模式 key
    const darkModeKey = "enableDarkMode";
    // 创建的按钮
    let button = null;
    // 获取是否深色模式状态
    const getDarkModeState = () => localStorage.getItem(darkModeKey) === "true";
    // 设置深色模式状态
    const setDarkModeState = (enabled) => localStorage.setItem(darkModeKey, enabled.toString());
    // 更新按钮显示
    function updateButton() {
      const state = getDarkModeState();
      // 设置按钮背景颜色
      button.style.backgroundColor = state ? activeColor : inactiveColor;
      // 设置按钮文本
      setNavButtonContent(button, state ? "关闭深色模式" : "开启深色模式");
    }
    // 更新深色模式样式
    function updateDarkModeStyle() {
      if (getDarkModeState()) {
        document.documentElement.setAttribute("theme", "dark");
      } else {
        document.documentElement.removeAttribute("theme");
      }
    }

    // 添加深色模式按钮
    button = addNavButton("", () => {
      setDarkModeState(!getDarkModeState());
      updateButton();
      updateDarkModeStyle();
    });

    // 恢复状态
    updateButton();
    updateDarkModeStyle();
  }

  // 添加分隔占位
  addNavButtonPlaceholder();
  // 内容全屏
  addFullScreenContent();
  // 替换换行
  replaceLineBreaks();
  // 屏蔽干扰元素
  removeExtraElements();
  // 深色模式
  darkMode();
})();
