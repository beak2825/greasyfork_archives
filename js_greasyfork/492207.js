// ==UserScript==
// @name         Youtube Comments Section First (Latest)
// @name:zh-CN   Youtube 详情评论在左边 (还能用)
// @namespace    http://tampermonkey.net/
// @version      20240531
// @description  Title description and comments section first, suggestions on the right
// @description:zh-CN   标题、描述和评论会在左侧占据更多空间，视频建议则在右侧显示。
// @author       leovoon
// @match        *.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/492207/Youtube%20Comments%20Section%20First%20%28Latest%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492207/Youtube%20Comments%20Section%20First%20%28Latest%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // Function to be called when the target element exists
    function waitForElement(selector, callback) {
        const targetNode = document.querySelector(selector);
        if (targetNode) {
            callback(targetNode);
            return;
        }

        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const targetNode = document.querySelector(selector);
                    if (targetNode) {
                        callback(targetNode);
                        observer.disconnect();
                        break;
                    }
                }
            }
        });

        // Start observing the target node for changes in children
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement('#columns', function(targetNode) {
        if(!targetNode) return

        targetNode.children[0].style.flexGrow = 1 // how much suggestion spans
         targetNode.children[0].style.flexBasis = 0
        targetNode.children[0].style.minWidth = 'auto'
         targetNode.children[0].style.order = 2

        targetNode.children[1].style.flexGrow = 5
        targetNode.children[1].style.flexBasis = 0
        targetNode.children[1].style.order = 1

        if (window.matchMedia("(min-width: 1025px)").matches) {
            targetNode.style.width = 'var(--ytd-watch-flexy-max-player-height)';
        }


    });




})();