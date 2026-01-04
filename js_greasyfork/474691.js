// ==UserScript==
// @name         github增强
// @namespace    ChatGPT
// @version      1.0
// @description  增强github网站的响应速度，增强github网站的下载速度！！！
// @author       zhang6666j
// @match      *://github.com/*
// @run-at     document-start
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474691/github%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/474691/github%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentUrl = window.location.href;
    var newUrl = currentUrl.replace(new URL(currentUrl).hostname, 'githubfast.com');

    if (currentUrl !== newUrl) {
        window.location.replace(newUrl);
    }
})();