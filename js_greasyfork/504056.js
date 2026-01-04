// ==UserScript==
// @name         dアニメストア　照準表示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  真正面からアニメを視聴したい変人向け。動画再生ページでミドルボタンをクリックすると照準表示を切り替えられます。
// @match        https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504056/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%80%80%E7%85%A7%E6%BA%96%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/504056/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%80%80%E7%85%A7%E6%BA%96%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the focus overlay
    GM_addStyle(`
        #focus-overlay {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.7);
            border: 2px solid #fff;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            display: none;
            z-index: 9999;
        }
    `);

    // Create the focus overlay element
    const focusOverlay = document.createElement('div');
    focusOverlay.id = 'focus-overlay';
    document.body.appendChild(focusOverlay);

    // Toggle functionality
    let isFocused = false;
    function toggleFocus() {
        isFocused = !isFocused;
        focusOverlay.style.display = isFocused ? 'block' : 'none';
    }

    // Add event listener for middle mouse button click
    document.addEventListener('mousedown', (event) => {
        if (event.button === 1) { // 1 is the middle mouse button
            event.preventDefault(); // Prevent default middle click action
            toggleFocus();
        }
    });
})();
