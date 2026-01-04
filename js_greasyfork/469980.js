// ==UserScript==
// @name         移除萌游网的马赛克
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除萌游网图片的马赛克
// @author       knoic
// @match        https://galge.cn
// @match https://galge.cn/*
// @icon         https://www.google.com/s2/favicons?domain=galge.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469980/%E7%A7%BB%E9%99%A4%E8%90%8C%E6%B8%B8%E7%BD%91%E7%9A%84%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469980/%E7%A7%BB%E9%99%A4%E8%90%8C%E6%B8%B8%E7%BD%91%E7%9A%84%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var sty=document.createElement('style');
	sty.innerText='.blur:before{display:none!important}';
	document.body.appendChild(sty);

    // Your code here...
})();