// ==UserScript==
// @name         网页淡彩显示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  把网页颜色变淡，呈淡彩色显示，更护眼哦~~
// @author       ccav5
// @match        *://*/*
// @exclude      *://*.jd.com/*
// @exclude      *://*.jd.hk/*
// @exclude      *://*.taoao.com/*
// @exclude      *://*.tmall.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470253/%E7%BD%91%E9%A1%B5%E6%B7%A1%E5%BD%A9%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/470253/%E7%BD%91%E9%A1%B5%E6%B7%A1%E5%BD%A9%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    addNewStyle("*{-webkit-filter: grayscale(8%)}")
})();

function addNewStyle(newStyle) {
    console.log("?? add new style:", newStyle)
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}