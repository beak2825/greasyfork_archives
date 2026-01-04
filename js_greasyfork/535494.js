// ==UserScript==
// @name         Mobile Youtube Hide next/prev and fullscrean recommend
// @version      2025-05-10
// @description  モバイル版Youtubeの動画上の次の動画/前の動画ボタン、フルスクリーン時のリコメンド表示を非表示にします
// @author       hirhirbyrd
// @match        https://m.youtube.com/* 
// @license MIT
// @namespace https://greasyfork.org/users/1467931
// @downloadURL https://update.greasyfork.org/scripts/535494/Mobile%20Youtube%20Hide%20nextprev%20and%20fullscrean%20recommend.user.js
// @updateURL https://update.greasyfork.org/scripts/535494/Mobile%20Youtube%20Hide%20nextprev%20and%20fullscrean%20recommend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        const selectors = [
            'button.icon-button[aria-label="前の動画"]',
            'button.icon-button[aria-label="次の動画"]',
            'div.fullscreen-action-menu',
            'div.fullscreen-recommendations-wrapper'
        ];

        selectors.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.style.display = 'none';
        });
    }

    window.addEventListener('load', () => {
        hideElements();

        const observer = new MutationObserver(hideElements);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();