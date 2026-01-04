// ==UserScript==
// @name         remove the header of zhihu
// @namespace    remove the header of zhihu
// @version      1.0.4
// @description  移除知乎title
// @author       huge_cc
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442443/remove%20the%20header%20of%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/442443/remove%20the%20header%20of%20zhihu.meta.js
// ==/UserScript==

(function () {

  document.getElementsByClassName("AppHeader")[0].backgroundColor = "red !important"
  var topHeader = document.getElementsByClassName("AppHeader-inner")
  if(!topHeader||!topHeader.length)topHeader=document.getElementsByClassName("sgui-header")
  if (topHeader && topHeader.length > 0) {
    topHeader[0].getElementsByTagName("a")[0].style.width = 0
    topHeader[0].getElementsByTagName("a")[0].style.height = 0

  }
  document.getElementsByClassName("AppHeader-inner")[0].getElementsByTagName("a")[0].style.display = "none"
  var pageHeader = window.document.getElementsByClassName('PageHeader');
  if(!pageHeader||!pageHeader.length)pageHeader=document.getElementsByClassName("sgui-header")
  if (pageHeader.length > 0) {
    pageHeader[0].getElementsByClassName('QuestionHeader-title')[0].innerHTML = '';
  }
})();