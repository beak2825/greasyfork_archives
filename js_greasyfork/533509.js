// ==UserScript==
// @name         AdBlock + YouTube Skip Ads
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  強化版：封鎖廣告 + 手動清除 + 擋追蹤 + 自動跳過 YouTube 廣告！
// @author       Tang yuan+ ChatGPT
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533509/AdBlock%20%2B%20YouTube%20Skip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/533509/AdBlock%20%2B%20YouTube%20Skip%20Ads.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 自動點擊 YouTube 跳過廣告
    setInterval(() => {
        const skipBtn = document.querySelector('.ytp-ad-skip-button');
        if (skipBtn) {
            skipBtn.click();
            console.log('[YouTube] ⏩ 自動跳過廣告');
        }

        const closeOverlayBtn = document.querySelector('.ytp-ad-overlay-close-button');
        if (closeOverlayBtn) {
            closeOverlayBtn.click();
            console.log('[YouTube] ❌ 關閉橫幅廣告');
        }

        // 關掉影片中廣告音量或隱藏畫面（進階可選）
        const adText = document.querySelector('.ad-showing');
        const video = document.querySelector('video');
        if (adText && video) {
            video.muted = true;
            video.currentTime += 5; // 快轉 5 秒加速略過
        }
    }, 1500);
})();