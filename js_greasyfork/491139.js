// ==UserScript==
// @name         SurePrintZhihu
// @namespace    http://surewong.com/SurePrint
// @version      0.2
// @description  try to print to pdf of Zhihu!
// @author       SureWong
// @match        https://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491139/SurePrintZhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/491139/SurePrintZhihu.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';

    // Your code here...
    var surePrintBtn = document.createElement('button')
    surePrintBtn.innerHTML = "准备打印pdf"
    surePrintBtn.className = "sure-print-pdf"

    surePrintBtn.onclick = function (e) {


      // 专栏，例如：https://zhuanlan.zhihu.com/p/78340397
      document.querySelector(".ColumnPageHeader-Wrapper")?.remove();// 顶栏
      document.querySelector(".ContentItem-actions")?.remove();// 底栏
      document.querySelector(".RichContent-actions")?.remove();// 赞同按钮
      document.querySelector(".CornerButtons")?.remove();// 角落按钮

      // 回答，例如：https://www.zhihu.com/question/68482809/answer/264632289
      document.querySelector(".AppHeader")?.remove();// 顶栏
    }

    var body = document.body
    var style = document.createElement('style')
    style.id = "sure-print-pdf"
    var css = `.sure-print-pdf{
      position: fixed;
      bottom: 5%;
      right: 1%;
      width: 70px;
      height: 70px;
      background: lightblue;
      border-radius: 50%;
      font-size: 10px;
      z-index: 999;
      cursor: pointer;
      font-size: 10px;
      overflow: hidden;
    }`
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    body.appendChild(surePrintBtn)
    body.appendChild(style)


})();