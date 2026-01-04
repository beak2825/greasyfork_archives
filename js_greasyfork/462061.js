// ==UserScript==
// @name         去你大爷的文心一言水印（已被封杀，目前版本有百毒设定的 5s 间隔刷新，建议卸载此脚本！）
// @namespace    eb-watermark
// @version      1.2
// @description  FUCK WATERMARK
// @author       LufsX, GPT3.5-turbo
// @match        https://yiyan.baidu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462061/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E6%B0%B4%E5%8D%B0%EF%BC%88%E5%B7%B2%E8%A2%AB%E5%B0%81%E6%9D%80%EF%BC%8C%E7%9B%AE%E5%89%8D%E7%89%88%E6%9C%AC%E6%9C%89%E7%99%BE%E6%AF%92%E8%AE%BE%E5%AE%9A%E7%9A%84%205s%20%E9%97%B4%E9%9A%94%E5%88%B7%E6%96%B0%EF%BC%8C%E5%BB%BA%E8%AE%AE%E5%8D%B8%E8%BD%BD%E6%AD%A4%E8%84%9A%E6%9C%AC%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462061/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E6%B0%B4%E5%8D%B0%EF%BC%88%E5%B7%B2%E8%A2%AB%E5%B0%81%E6%9D%80%EF%BC%8C%E7%9B%AE%E5%89%8D%E7%89%88%E6%9C%AC%E6%9C%89%E7%99%BE%E6%AF%92%E8%AE%BE%E5%AE%9A%E7%9A%84%205s%20%E9%97%B4%E9%9A%94%E5%88%B7%E6%96%B0%EF%BC%8C%E5%BB%BA%E8%AE%AE%E5%8D%B8%E8%BD%BD%E6%AD%A4%E8%84%9A%E6%9C%AC%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var markID;
  var findDone = false;

  function findWatermark() {
    const reg = /[0-9a-z]{8}-([0-9a-z]{4}-){3}[0-9a-z]{12}/;
    const divs = document.querySelectorAll("div");
    divs.forEach((div) => {
      if (reg.test(div.id)) {
        markID = div.id;
        console.log("find");
        console.log(div.id);
        findDone = true;
      }
    });
    console.log("no found");
    if (!findDone) {
      setTimeout(findWatermark, 500);
      return;
    }
  }

  function cleanWatermark() {
    console.log("clean" + markID);
    var watermark = document.getElementById(markID);

    watermark.style = null;
    watermark.style.display = "none";
  }

  var observer = new MutationObserver(function (mutationsList) {
    for (var mutation of mutationsList) {
      if (!findDone) {
        findWatermark();
      }
      if (mutation.type === "childList" && mutation.addedNodes.length > 0 && findDone) {
        cleanWatermark();
        console.log("tir");
      }
    }
  });

  observer.observe(document.body, { childList: true });
})();