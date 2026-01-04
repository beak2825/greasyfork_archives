// ==UserScript==
// @name         百度题库去除答案遮挡
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  去除【百度题库】页面“查看答案”中对“查看答案与解析”的遮挡，去除会员广告，支持隐藏[视频讲解]|[试卷来源]等板块
// @author       Albresky
// @license      GPL v3
// @match        *://easylearn.baidu.com/edu-page/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/461406/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E5%8E%BB%E9%99%A4%E7%AD%94%E6%A1%88%E9%81%AE%E6%8C%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/461406/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E5%8E%BB%E9%99%A4%E7%AD%94%E6%A1%88%E9%81%AE%E6%8C%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const log_prefix = "[BDWK] ";

  const maskClass = ".mask";
  const tiganClass = ".tigan";
  const answerClass=".analysis-text";
  const adScrollClass = ".vip-banner-cont";
  const checkInterval = 100; // ms

  let menu_ALL = [
    ["menu_el_disable_shijuan", "移除[本题试卷]", ".shijuan-cont", true],
    ["menu_el_disable_shijuan_source", "移除[本题试卷来源]", ".right", true],
    ["menu_el_disable_video", "移除[视频解析]", ".question-video-cont", true],
  ];
  let menu_ID = [];

  let adContentClass = [
    ".feedback-icon",
    ".kaixue-dialog-mask",
    ".kaixuebanner",
    ".business-el-line"
  ];
  let adContentDiv = [];

  window.addEventListener("scroll", fuckScroll);

  initMenu();

  fuck();

  function log(msg) {
    console.log(log_prefix + msg);
  }

  function initMenu() {
    for (let i = 0; i < menu_ALL.length; i++) {
      if (GM_getValue(menu_ALL[i][0]) == null) {
        GM_setValue(menu_ALL[i][0], menu_ALL[i][3]);
      }
    }
    registerMenuCommand();
  }

  function registerMenuCommand() {
    if (menu_ID.length > menu_ALL.length) {
      for (let i = 0; i < menu_ID.length; i++) {
        GM_unregisterMenuCommand(menu_ID[i]);
      }
    }
    for (let i = 0; i < menu_ALL.length; i++) {
      menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
      menu_ID[i] = GM_registerMenuCommand(
        `${menu_ALL[i][3] ? "✅" : "❎"} ${menu_ALL[i][1]}`,
        function () {
          menu_switch(
            `${menu_ALL[i][0]}`,
            `${menu_ALL[i][1]}`,
            `${menu_ALL[i][3]}`
          );
        }
      );
    }
  }

  function menu_switch(kname, name, value) {
    if (value == "false") {
      log(name + "=" + kname);
      GM_setValue(`${kname}`, true);
      registerMenuCommand();
      location.reload();
    } else {
      log(name + "=" + kname);
      GM_setValue(`${kname}`, false);
      registerMenuCommand();
      location.reload();
    }
    registerMenuCommand();
  }

  function rmMask() {
    let t = setInterval(function () {
      let mask = document.querySelectorAll(maskClass);
      let tigan = document.querySelector(tiganClass);
      let answer = document.querySelector(answerClass);
      getAdContent();
      if (answer&&tigan && mask) {
        log("mask found");
        for (let m of mask) {
          log(m.className + " removed.");
          m.remove();
        }
        log("show full tigan and answer");
        tigan.classList.add("tigan-auto");
        answer.classList.add("text-auto");
        rmVipContent();
        clearInterval(t);
      }
    }, checkInterval);
  }

  function fuck() {
    for (let i = 0; i < menu_ALL.length; i++) {
      if (menu_ALL[i][3]) {
        rmCont(menu_ALL[i][2]);
      }
    }
    rmMask();
  }

  function rmCont(contClass) {
    let _timer = setInterval(() => {
      let contDiv = document.querySelector(contClass);
      if (contDiv) {
        log(contDiv.className + " removed.");
        contDiv.remove();
        clearInterval(_timer);
      }
    }, checkInterval);
  }

  function getAdContent() {
    for (let c of adContentClass) {
      let vipContent = document.querySelector(c);
      if (vipContent) {
        adContentDiv.push(vipContent);
        adContentClass.filter((item) => item != vipContent);
      }
    }
  }

  function rmVipContent() {
    for (let div of adContentDiv) {
      if (div) {
        div.remove();
        log(div.className + " removed");
      }
    }
  }

  function fuckScroll() {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if (t > 0) {
      rmCont(adScrollClass);
    }
  }
})();
