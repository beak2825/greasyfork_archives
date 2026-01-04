// ==UserScript==
// @name         Fuck Bilibili 
// @namespace    
// @version      0.1
// @description  去除Bilibili的登錄提示
// @match        *://bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514138/Fuck%20Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/514138/Fuck%20Bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList.contains('bpx-player-toast-item')) {
                    node.remove();
                }
                if (node.nodeType === 1 && node.classList.contains('bili-mini-mask')) {
                    node.remove();
                }
            });
        });
    });
    window.player.pause = function(){}
    window.player.play();
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
