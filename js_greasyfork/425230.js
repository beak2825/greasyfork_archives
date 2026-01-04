// ==UserScript==
// @name         网页变黑白
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  把网页变成黑白色
// @author       luzhiyuan
// @match        *://*.jd.com/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425230/%E7%BD%91%E9%A1%B5%E5%8F%98%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/425230/%E7%BD%91%E9%A1%B5%E5%8F%98%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function() {
    addNewStyle("*{-webkit-filter: grayscale(100%)}")
})();

function addNewStyle(newStyle) {
    console.log("👴 add new style:", newStyle)
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}