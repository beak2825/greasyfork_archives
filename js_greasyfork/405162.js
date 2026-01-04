// ==UserScript==
// @name        52破解论坛登录自动签到
// @namespace   Violentmonkey Scripts
// @match       https://www.52pojie.cn/*
// @grant       none
// @version     1.1
// @author      微信公众号：汁识
// @license     MIT
// @description 解放双手
// @downloadURL https://update.greasyfork.org/scripts/405162/52%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/405162/52%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function() {
  var zan=document.getElementsByClassName('qq_bind');
  if(zan[0].parentNode.nodeName == 'A'){
    zan[0].parentNode.click();
    console.log("签到成功");
  }
})();