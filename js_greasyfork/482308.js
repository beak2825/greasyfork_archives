// ==UserScript==
// @name         教评脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  东北大学秦皇岛分校教务处教师评价的自动化油猴脚本
// @author       Juns
// @match        http://jwxt.neuq.edu.cn/eams/quality/*
// @match        https://jwxt.neuq.edu.cn/eams/quality/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482308/%E6%95%99%E8%AF%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482308/%E6%95%99%E8%AF%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("匹配成功");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const baseUrls = [
    "http://jwxt.neuq.edu.cn/eams/quality/stdEvaluate!innerIndex.action",
    "https://jwxt.neuq.edu.cn/eams/quality/stdEvaluate!innerIndex.action",
  ];

  // 具体评价页面执行的函数
  async function evaluate() {
    await delay(1000);
    let inputs = document.querySelectorAll("input");
    for (let i in inputs) if (inputs[i].value == 0) inputs[i].checked = true;
    document.querySelector("textarea").value = "无";
    await delay(500);
    document.querySelector("#sub").click();
  }

  // 在根页面跳转的函数
  function jumpFn() {
    const span = document.querySelector(".eval");
    span.click();
  }

  // 初始化运行的函数
  function init() {
    baseUrls.includes(location.href) ? jumpFn() : evaluate();
  }

  init();
})();
