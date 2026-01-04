// ==UserScript==
// @name        云中转云盘美化
// @license     MIT
// @namespace   yzzpan
// @include     *://www.yzzpan.com/#*
// @include     *://www.yunzhongzhuan.com/#*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/2/17 14:01:43
// @downloadURL https://update.greasyfork.org/scripts/460177/%E4%BA%91%E4%B8%AD%E8%BD%AC%E4%BA%91%E7%9B%98%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460177/%E4%BA%91%E4%B8%AD%E8%BD%AC%E4%BA%91%E7%9B%98%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function () {
	'use strict';
  //去除反调试代码
  endebug = null;
  for (let i = 1; i <= 1000; i++) {
    clearInterval(i);
  }
  //去除广告
  for(let item of document.querySelectorAll(".sharefile-ad-only-one")){
    item.remove()
  }
  //去除乱七八糟的链接
  document.querySelector(".links").remove()
  //恢复鼠标样式
  document.body.style.cursor = "auto"
  //界面美化
  for(let item of document.querySelectorAll(".top-applications-item")){
    item.style.backgroundSize = "contain";
    item.style.width = "30px"
    item.style.height = "30px"
  }
  document.querySelectorAll(".top")[0].style.height = "60px";
  document.querySelector("#files").style.paddingTop = "30px";
  document.querySelector("#files").style.width = "calc(100% - 120px)";


})();