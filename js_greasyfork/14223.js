// ==UserScript==
// @name 		AcFun样式微调小助手
// @namespace   AcFun
// @description 仅对评论区样式做了紧凑化处理，欢迎提出意见建议
// @include 	http://*.acfun.tv/a/*
// @grant 		none
// @version 	0.0.1.1
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/14223/AcFun%E6%A0%B7%E5%BC%8F%E5%BE%AE%E8%B0%83%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/14223/AcFun%E6%A0%B7%E5%BC%8F%E5%BE%AE%E8%B0%83%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function ($) {
  window._doFixA = function () {
    var f = document.createElement('script');
    f.src = 'http://acfun.io/js/styletweak.js?ran=?ran=' + new Date().getTime();
    document.body.appendChild(f);
  }
  window.AC_waitPlayer = function () {
    if (document.getElementById('area-comment-inner') && window.$) {
      clearInterval(AC_waitInt);
      _doFixA();
    }
  }
  AC_waitInt = setInterval('AC_waitPlayer()', 500);
}) (function ($) {
  return document.querySelector($);
});