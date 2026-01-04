// ==UserScript==
// @name         bzoj娱乐插件：kirka
// @namespace    https://bzoj.org
// @version      1.1.8
// @description  在bzoj站底，提供kirka大窗口服务
// @author       gy
// @match        *://bzoj.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434157/bzoj%E5%A8%B1%E4%B9%90%E6%8F%92%E4%BB%B6%EF%BC%9Akirka.user.js
// @updateURL https://update.greasyfork.org/scripts/434157/bzoj%E5%A8%B1%E4%B9%90%E6%8F%92%E4%BB%B6%EF%BC%9Akirka.meta.js
// ==/UserScript==
(function () {
  setTimeout(function () {
    var status_html = "<iframe src=\"https://kirka.io\" width=100% height=\"725px\" onmouseout=\"document.getElementsByClassName('footer')[0].innerHTML='';\"></iframe>";
    var node = document.getElementsByClassName("footer");
    node[0].innerHTML = status_html;
  },500);
})();