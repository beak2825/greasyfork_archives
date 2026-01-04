// ==UserScript==
// @name         必应-新标签页打开所有链接
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  让bing的所有链接在新标签页打开
// @author       丸子
// @match        *://*.bing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495778/%E5%BF%85%E5%BA%94-%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/495778/%E5%BF%85%E5%BA%94-%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            links[i].target = '_blank';
        }
    }, false);
})();