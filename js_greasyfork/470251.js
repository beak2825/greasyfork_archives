// ==UserScript==
// @name         网页黑白滤镜
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将网页显示为黑白效果
// @author       ccav5
// @match        *://*/*
// @exclude      *://*.jd.com/*
// @exclude      *://*.jd.hk/*
// @exclude      *://*.taoao.com/*
// @exclude      *://*.tmall.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470251/%E7%BD%91%E9%A1%B5%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/470251/%E7%BD%91%E9%A1%B5%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.meta.js
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