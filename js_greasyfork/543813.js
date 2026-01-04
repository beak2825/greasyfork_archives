// ==UserScript==
// @name         Auto Click DS Icon Button (stable)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自動點擊指定的黃色圓形圖示按鈕
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543813/Auto%20Click%20DS%20Icon%20Button%20%28stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543813/Auto%20Click%20DS%20Icon%20Button%20%28stable%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function clickTarget() {
        const iconPath = document.querySelector(
            '.ds-icon-button svg path[d^="M12 .5C18.351"]'
        );
        if (iconPath) {
            const btn = iconPath.closest('.ds-icon-button');
            if (btn) {
                console.log('[AutoClick] 找到目標按鈕，點擊！');
                btn.click();
            }
        }
    }

    // 用 MutationObserver 監聽動態出現
    const observer = new MutationObserver(() => {
        clickTarget();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 頁面載入後立即檢查一次
    window.addEventListener('load', clickTarget);
})();
