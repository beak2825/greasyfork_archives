// ==UserScript==
// @name         LINUX.DO Discourse页面加载动画去除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  彻底移除Discourse网页中 id 为 "d-splash" 的 section 元素
// @author       Dahi
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/538534/LINUXDO%20Discourse%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%8A%A8%E7%94%BB%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/538534/LINUXDO%20Discourse%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%8A%A8%E7%94%BB%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSplashElement() {
        const splashElement = document.getElementById('d-splash');
        if (splashElement) {
            splashElement.remove();
        }
    }

    function initRemove() {
        removeSplashElement();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRemove);
    } else {
        initRemove();
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes) {
                removeSplashElement();
            }
        });
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();