// ==UserScript==
// @name         阻止js脚本运行
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  这个脚本用于阻止指定的 JavaScript 文件在特定网站上运行。
// @author       veip007
// @match        *://*.sexinsex.net/*
// @match        *://*.91porn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515877/%E9%98%BB%E6%AD%A2js%E8%84%9A%E6%9C%AC%E8%BF%90%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/515877/%E9%98%BB%E6%AD%A2js%E8%84%9A%E6%9C%AC%E8%BF%90%E8%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 要阻止的JS文件列表
    const blockedScripts = ['indexonly.js', 'myjavascriptajax.js', 'adblock.js'];

    // 拦截并阻止特定的JS文件
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        for (let script of blockedScripts) {
            if (url.includes(script)) {
                console.log('Blocked:', url);
                return;
            }
        }
        originalOpen.apply(this, arguments);
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT') {
                    blockedScripts.forEach((script) => {
                        if (node.src.includes(script)) {
                            node.parentNode.removeChild(node);
                            console.log('Blocked:', node.src);
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.head, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });
})();
