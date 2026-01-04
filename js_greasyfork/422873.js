// ==UserScript==
// @name        PCR作业网返回顶部按钮
// @namespace   Violentmonkey Scripts
// @match       *://*pcrdfans*/*
// @grant       none
// @version     1.0
// @author      千城忆梦
// @description 给PCR作业网增加“返回顶部”按钮
// @description 非原创，修改自https://blog.csdn.net/insgo/article/details/113799700，感谢原作者！
// @downloadURL https://update.greasyfork.org/scripts/422873/PCR%E4%BD%9C%E4%B8%9A%E7%BD%91%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/422873/PCR%E4%BD%9C%E4%B8%9A%E7%BD%91%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var toTopBtn = document.createElement('button')
    toTopBtn.innerHTML = "UP"
    toTopBtn.className = "a-b-c-d-toTop"
    toTopBtn.onclick = function (e) {
      scrollTo(0, 0)
    }
    var body = document.body
    var style = document.createElement('style')
    style.id = "a-b-c-d-style"
    var css = `.a-b-c-d-toTop{
      position: fixed;
      bottom: 10%;
      right: 5%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 15px;
      z-index: 999;
      cursor: pointer;
      font-size: 12px;
      overflow: hidden;
    }`
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    body.appendChild(toTopBtn)
    body.appendChild(style)
})();
