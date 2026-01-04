// ==UserScript==
// @name         UViewPlus广告拦截器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       yhxw
// @description  UViewPlus广告拦截测试
// @license      MIT
// @icon         ./uviewnoadicon.jpg
// @match        https://uiadmin.net/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/541894/UViewPlus%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541894/UViewPlus%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (function() {
    function init() {
      console.log("脚本已加载");
      const testDiv = document.createElement("div");
      testDiv.style.position = "fixed";
      testDiv.style.top = "10px";
      testDiv.style.right = "6px";
      testDiv.style.padding = "10px";
      testDiv.style.background = "red";
      testDiv.style.color = "white";
      testDiv.style.zIndex = "9999";
      testDiv.style.cursor = "pointer";
      testDiv.style.borderRadius = "8px";
      testDiv.textContent = "×遮挡广告";
      document.body.appendChild(testDiv);
      testDiv.addEventListener("click", function() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.textContent = ".v-modal {top: 9999px!important;opacity: 0;pointer-events: none;}#pleasePrNotCrack {top: 9999px!important;opacity: 0;pointer-events: none;}";
        document.head.appendChild(style);
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();

})();