// ==UserScript==
// @name        CSDN展开代码
// @author      Arden
// @namespace   https://github.com/ningbowang/UserScripts
// @match       *://*.csdn.net/*
// @run-at      document-start
// @grant       none
// @version     1.0.0
// @author      Arden
// @description 2022/6/27 15:32:38
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452741/CSDN%E5%B1%95%E5%BC%80%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/452741/CSDN%E5%B1%95%E5%BC%80%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function(){
  setTimeout(function() {
      // 取消代码折叠;

      // 配合自己写的  "自用：CSDN无关内容，露出导航栏" 更好用, 地址: https://userstyles.world/style/3910/csdn
      document.querySelector(".hide-preCode-bt").click();
    $(".look-more-preCode").click();
  }, 3500);
})()