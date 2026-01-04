// ==UserScript==
// @name         宝武微学苑
// @namespace    http://tampermonkey.net/
// @version      2025-06-17-1
// @description  宝武微学苑自动播放
// @author       You
// @match        http://mooc.baosteel.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baosteel.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539682/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91.user.js
// @updateURL https://update.greasyfork.org/scripts/539682/%E5%AE%9D%E6%AD%A6%E5%BE%AE%E5%AD%A6%E8%8B%91.meta.js
// ==/UserScript==

(function () {
  "use strict";
  window.alert = function (message) {
    console.log("Alert suppressed:", message);
    return true; // 模拟用户点击“确定”
  };
  function clickFn(getBtnFn) {
    return function () {
      getBtnFn()?.click();
    };
  }

  function getConfirm() {
    const buttons = document.querySelectorAll("button.ant-btn.ant-btn-danger");
    for (const button of buttons) {
      if (button.innerText === "保存") {
        console.log("获取到确认按钮");
        return button;
      }
    }
  }

  function getGoNext() {
    const a = document.getElementsByClassName("video-modal-content")[0];
    if (!a || a.parentNode.classList.contains("hide")) {
      return null;
    }
    console.log("获取到学习下一节按钮");
    return a.lastChild?.lastChild?.firstChild;
  }

  function getPlayBtn() {
    const btn = document.getElementById("player_display_button");
    if (btn.style.opacity !== "0") {
      console.log("获取到播放按钮");
      return btn;
    }
    return null;
  }
  setInterval(clickFn(getConfirm), 60000);
  setInterval(clickFn(getGoNext), 60000);
  setInterval(clickFn(getPlayBtn), 60000);
})();
