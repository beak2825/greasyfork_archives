// ==UserScript==
// @name         中文维基百科转换成简体
// @namespace    polonium.space
// @version      0.8
// @description  中文（zh）或其他中文大区（如zh-my）维基百科自动跳转至大陆简体（zh-cn），移动版自动跳转至电脑版
// @author       chemPolonium
// @include      http*://zh.wikipedia.org/*
// @include      http*://*.m.wikipedia.org/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/422194/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%BD%AC%E6%8D%A2%E6%88%90%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/422194/%E4%B8%AD%E6%96%87%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%BD%AC%E6%8D%A2%E6%88%90%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let replacedUrl = document.URL;

    replacedUrl = replacedUrl.replace(/(zh.wikipedia.org\/)(?:zh-cn\/|zh-hans\/|zh\/|zh-hk\/|zh-mo\/|zh-my\/|zh-sg\/|zh-tw\/|wiki\/)?/, '$1zh-cn/');

    replacedUrl = replacedUrl.replace('.m.wiki', '.wiki');

    if (replacedUrl !== document.URL) {
        window.location = replacedUrl;
    }
})()