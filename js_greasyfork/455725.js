// ==UserScript==
// @name         决策平台黑白
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  把决策平台变成黑白色
// @author       Johnny.Xue
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @match        *://localhost:8075/*
// @match        *://yinfr.bigdata.ytx.com/*
// @match        *://yinfr.yintech.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455725/%E5%86%B3%E7%AD%96%E5%B9%B3%E5%8F%B0%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455725/%E5%86%B3%E7%AD%96%E5%B9%B3%E5%8F%B0%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==
(function() {
    addNewStyle("*{-webkit-filter: grayscale(1)}")
})();

function addNewStyle(newStyle) {
    console.log("FR add new style:", newStyle)
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
}