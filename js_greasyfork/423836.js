// ==UserScript==
// @name         4399游戏下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  flash已死，给4399游戏页面增加下载按钮
// @author       You
// @match        http://www.4399.com/flash/*_*.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423836/4399%E6%B8%B8%E6%88%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/423836/4399%E6%B8%B8%E6%88%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var nav = document.querySelector(".p-nav");
    var el = document.createElement("a");
    el.text = "下载";
    el.href = window.webServer + window._strGamePath;
    el.style = "font-size: 16px;";
    el.download = nav.firstElementChild.textContent;
    el.target = "_self";
    nav.append(el);
})();