// ==UserScript==
// @name         b站隐藏投票
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  隐藏网页端b站的各种烦人弹窗，包括但不限于投票窗口、三连窗口、打星窗口等
// @author       hinayahh
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/464312/b%E7%AB%99%E9%9A%90%E8%97%8F%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/464312/b%E7%AB%99%E9%9A%90%E8%97%8F%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("My script is running!");

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const bpXplayerCmd = document.querySelector('.bpx-player-cmd-dm-inside');
                if (bpXplayerCmd) {
                    console.log("Delete successfully!");
                    bpXplayerCmd.style.display = 'none';
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
