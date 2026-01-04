// ==UserScript==
// @name         智慧考试
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  试题复制，方便巩固复习
// @author       You
// @match        http://47.96.77.18/ks/*
// @icon         http://47.96.77.18/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520201/%E6%99%BA%E6%85%A7%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520201/%E6%99%BA%E6%85%A7%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeGarbledTextAndWhitespace() {
       const targetDivs = document.querySelectorAll('.ss3');

        targetDivs.forEach(targetDiv => {
            const walkNodes = function(node) {
                Array.from(node.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.nodeValue = child.nodeValue.replace(/[\u0780-\u07Ba\u2005]/g, '').replace(/\s+/g, '');
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        walkNodes(child);
                    }
                });
            };

            walkNodes(targetDiv);
        });
    }

    function allowTextSelection() {
        document.body.style.webkitUserSelect = 'text';
        document.body.style.userSelect = 'text';
    }

    function disableContextMenu() {
        document.oncontextmenu = function() {
            return true;
        };
    }

    removeGarbledTextAndWhitespace();
    allowTextSelection();
    disableContextMenu();

})();