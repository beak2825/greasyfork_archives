// ==UserScript==
// @name         Youtube卡片隐藏
// @namespace    https://www.youtube.com/
// @version      0.8
// @description  使用css隐藏视频结尾的卡片
// @author       woodj
// @license      MIT
// @include      *://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/ebcf1b0f/img/favicon.ico
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/410940/Youtube%E5%8D%A1%E7%89%87%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/410940/Youtube%E5%8D%A1%E7%89%87%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var style = document.createElement("style");
    let node = document.createTextNode(".ytp-ce-element { visibility: hidden; display: none; }");
    style.appendChild(node);
    document.head.appendChild(style);
    setInterval(() => {
        document.head.removeChild(style);
        document.head.appendChild(style);
        console.log("hide");
    }, 1000);
    console.log(node);
    console.log('Youtube卡片隐藏: done')
})();