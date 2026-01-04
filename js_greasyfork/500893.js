// ==UserScript==
// @name         BreakRuanyifengChecker
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  让阮一峰的反广告检查失效
// @author       ikrong
// @match        https://www.ruanyifeng.com/blog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruanyifeng.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500893/BreakRuanyifengChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/500893/BreakRuanyifengChecker.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var mainContent;
    var comment = document.createComment('BreakRuanyifengChecker');
    function getMainContent() {
        mainContent = document.querySelector('#main-content');
        if (!mainContent) {
            setTimeout(() => {
                getMainContent();
            }, 100);
        } else {
            mainContent.before(comment);
            listen()
        }
    }
    function listen() {
        var cloneNode = mainContent.cloneNode(true);
        const mo = new MutationObserver((mutations) => {
            if (!document.body.contains(mainContent)) {
                mo.disconnect();
                comment.replaceWith(cloneNode);
            }
        })
        mo.observe(mainContent.parentNode, {
            childList: true,
            subtree: true,
        });
    }
    getMainContent();
    // Your code here...
})();