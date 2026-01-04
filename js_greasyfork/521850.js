// ==UserScript==
// @name         Modify Hupu Forum Post List Reply Display
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add reply count before post title on Hupu forum post list, styled based on count.
// @author       ieagles
// @license      LGPL
// @match        https://bbs.hupu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521850/Modify%20Hupu%20Forum%20Post%20List%20Reply%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/521850/Modify%20Hupu%20Forum%20Post%20List%20Reply%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        const postItems = document.querySelectorAll('.bbs-sl-web-post-body .post-datum');

        postItems.forEach(function(item) {
            const replyViewText = item.textContent.trim();
            if (replyViewText) {
                const match = replyViewText.match(/^(\d+)\s*\/\s*(\d+)$/);
                if (match) {
                    const replyCount = parseInt(match[1], 10);
                    const titleElement = item.closest('.bbs-sl-web-post-body')
                                            .querySelector('.post-title a');

                    if (titleElement) {
                        const replySpan = document.createElement('span');
                        replySpan.innerHTML = `[${replyCount}]&nbsp;&nbsp;`; // 使用 &nbsp;

                        if (replyCount > 139) {
                            replySpan.style.color = 'red';
                            replySpan.style.fontWeight = 'bold';
                            replySpan.style.fontSize = '1.2em';
                        } else if (replyCount > 79) {
                            replySpan.style.fontWeight = 'bold';
                            replySpan.style.fontSize = '1.1em';
                        } else {
                            replySpan.style.fontSize = '1em';
                        }

                        titleElement.parentNode.insertBefore(replySpan, titleElement);
                    }
                }
            }
        });
    });
})();