// ==UserScript==
// @name         Vhall Focus Assistant
// @namespace    https://www.maxalex.tk
// @version      0.1
// @description  更好地专注于在线课堂
// @author       MaxAlex, aka zyf722
// @match        https://class.vhall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396265/Vhall%20Focus%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/396265/Vhall%20Focus%20Assistant.meta.js
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

setInterval(function () {
    setCSS(".tab-content");
    setCSS(".chat-wapper");
},trytime);