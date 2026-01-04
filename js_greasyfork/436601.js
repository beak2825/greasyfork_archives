// ==UserScript==
// @name        alipansou.com
// @namespace   Violentmonkey Scripts
// @include     https://www.alipansou.com/s/*
// @include     https://www.alipansou.com/
// @grant       none
// @version     1.1
// @author      Joie
// @description 自动跳转到阿里云盘
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436601/alipansoucom.user.js
// @updateURL https://update.greasyfork.org/scripts/436601/alipansoucom.meta.js
// ==/UserScript==

(function(){
  document.getElementsByClassName("van-goods-action-button--info")[0].click();
  //想要跳转后自动关闭页面，可以 ----> //window.close()
  window.close();
})()