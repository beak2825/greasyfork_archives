// ==UserScript==
// @name         芯参数网站破解
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  芯参数网站免密码查看
// @author       LH
// @match        https://www.xincanshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439337/%E8%8A%AF%E5%8F%82%E6%95%B0%E7%BD%91%E7%AB%99%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/439337/%E8%8A%AF%E5%8F%82%E6%95%B0%E7%BD%91%E7%AB%99%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
      if (document.querySelector("#oDiv").parentElement.children[3]) {
        document.querySelector("#oDiv").parentElement.children[3].style.background = "none";
      }
      if (document.querySelector("#oDiv").parentElement.children[4]) {
        document.querySelector("#oDiv").parentElement.children[4].style.display = "none";
      }
      if (document.querySelector(".vip_denglukejian .cpu_index_a3 #chart-wrapper")) {
        document.querySelector(".vip_denglukejian .cpu_index_a3 #chart-wrapper").style.filter =
          "none";
      }
      if (document.querySelector(".vip_denglukejian .cpu_index_a3 .paofenjietu")) {
        document.querySelector(".vip_denglukejian .cpu_index_a3 .paofenjietu").style.filter =
          "none";
      }
      // 下载按钮
      if (document.querySelector("#jtkjid_0001")) {
        document.querySelector("#jtkjid_0001").style.zIndex = 100;
      }
})();