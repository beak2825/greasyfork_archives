// ==UserScript==
// @name         Baidu Focus Assistant
// @namespace    https://www.maxalex.tk
// @version      0.2
// @description  更好地专注于搜索结果
// @author       MaxAlex, aka zyf722
// @match        https://www.baidu.com/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/394649/Baidu%20Focus%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/394649/Baidu%20Focus%20Assistant.meta.js
// ==/UserScript==

// Configuration Begin

var trytime = 100; // 检测页面变化时间间隔（ms）

// Configuration End

function setCSS(div){
    $(div).css("cursor","not-allowed");
    $(div).css("pointer-events","none");
    $(div).css("opacity","0.45");
    $(div).css("filter","blur(6px)");
    $(div).css("-ms-user-select","none");
    $(div).css("-moz-user-select","none");
    $(div).css("-webkit-user-select","none");
}

var url = window.location.href

setCSS("#content_right");
setCSS("#rs");

setInterval(function () {
    if (window.location.href != url) {
        setCSS("#content_right");
        setCSS("#rs");
    }
},trytime);