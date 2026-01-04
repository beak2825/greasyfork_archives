// ==UserScript==
// @name         Fullscreen Shortcut
// @namespace    https://greasyfork.org/users/673298
// @version      1.2.5
// @author       Fingalzzz
// @description  Add a shortcut to enable fullscreen mode of several streaming-media websites
// @homepage     https://greasyfork.org/en/scripts/408194-fullscreen-shortcut
// @supportURL   https://greasyfork.org/en/scripts/408194-fullscreen-shortcut
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.iqiyi.com/*
// @match        https://v.qq.com/x/*
// @match        https://www.youtube.com/*
// @match        https://v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408194/Fullscreen%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/408194/Fullscreen%20Shortcut.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const shortcut = 'Backslash'; // You can change this to your preferred key

    const siteSelectors = [
        { pattern: /bilibili\.com\/(bangumi|video)/, selector: ".bpx-player-ctrl-btn.bpx-player-ctrl-full" },
        { pattern: /iqiyi\.com/, selector: ".iqp-btn.iqp-btn-fullscreen" },
        { pattern: /v\.qq\.com/, selector: ".txp_btn.txp_btn_fullscreen" },
        { pattern: /youtube\.com/, selector: ".ytp-fullscreen-button.ytp-button" }
        // Youku handled separately
    ];

    document.addEventListener('keydown', (e) => {
        if (e.code === shortcut) {
            let selector = null;
            const link = window.location.href;

            for (const site of siteSelectors) {
                if (site.pattern.test(link)) {
                    selector = site.selector;
                    break;
                }
            }
            if (link.includes('v.youku.com')) {
                selector = document.fullscreen ? ".iconfont.icon-exit-fullscreen" : ".iconfont.icon-fullscreen";
            }

            if (selector) {
                const btn = document.querySelector(selector);
                if (btn) {
                    btn.click();
                } else {
                    // Optional: Add feedback for debugging
                    // alert("Fullscreen button not found on this page.");
                }
            }
        }
    });
})();

