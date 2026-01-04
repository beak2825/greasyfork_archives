// ==UserScript==
// @name         Bilibili视频播放自动网页全屏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站视频播放自动网页全屏
// @author       lscsczl
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @grant        none
// @icon         http://bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/498596/Bilibili%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/498596/Bilibili%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("DOMContentLoaded", function() {
        var customCtrlButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-web');

        if (customCtrlButton) {
            customCtrlButton.click();

            console.log('Yes');
        } else {
            console.log('No');
        }
    });
    var observer = new MutationObserver(function(mutationsList) {
        mutationsList.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('bpx-player-ctrl-btn') && node.classList.contains('bpx-player-ctrl-web')) {
                    node.click();
                    console.log('Fine');
                }
            });
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});
})();