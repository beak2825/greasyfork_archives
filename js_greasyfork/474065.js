// ==UserScript==
// @name         动漫花园魔改
// @namespace    https://greasyfork.org/zh-CN/scripts/474065
// @version      1.2.0
// @license      MIT
// @description  在不改变原来的功能的情况下，去除广告，实现暗色主题，都是一些主观上的美化，适用于动漫花园（dmhy）及相关镜像站，如果你也喜欢，欢迎使用~
// @author       kasuie
// @include     http://share.dmhy.org/*
// @include     https://share.dmhy.org/*
// @include     https://dmhy.org/*
// @include     https://dmhy.anoneko.com/*
// @include     https://www.dmhy.org/*
// @resource css https://cdn.jsdelivr.net/gh/kasuie/web-static@v1.2.0/web-dmhy/index.min.css
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmhy.org
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/474065/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E9%AD%94%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/474065/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E9%AD%94%E6%94%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (typeof GM_addStyle != "undefined" && typeof GM_getResourceText != "undefined") {
        GM_addStyle(GM_getResourceText("css"));
    } else {
        var linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = 'https://cdn.jsdelivr.net/gh/kasuie/web-static@v1.2.0/web-dmhy/index.css';
        var head = document.head || document.getElementsByTagName('head')[0];
        head.insertBefore(linkElement, head.firstChild);
    }
})();