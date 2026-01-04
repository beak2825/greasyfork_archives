// ==UserScript==
// @name         YT去廣告
// @namespace    http://tampermonkey.net/
// @version      0.8.0.8
// @description  移除 YouTube 廣告的用戶腳本，包括視頻廣告和界面廣告
// @author       YourName
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503323/YT%E5%8E%BB%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503323/YT%E5%8E%BB%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    `use strict`;

    let video;

    // 界面廣告CSS選擇器數組
    const adCssSelectors = [
        '#masthead-ad', // 首頁頂部橫幅廣告
        'ytd-rich-item-renderer #content.ytd-display-ad-renderer', // 首頁視頻排版廣告
        '.video-ads.ytp-ad-module', // 播放器底部廣告
        'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)', // 播放頁會員促銷廣告
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]', // 播放頁右上方推薦廣告
        '#related #player-ads', // 播放頁評論區右側推廣廣告
        '#related ytd-ad-slot-renderer', // 播放頁評論區右側視頻排版廣告
        'ytd-ad-slot-renderer', // 搜索頁廣告
        'yt-mealbar-promo-renderer', // 播放頁會員推薦廣告
        'ytd-popup-container:has(a[href="/premium"])', // 會員拦截廣告
        'ad-slot-renderer', // 移動端播放頁第三方推薦廣告
        'ytm-companion-ad-renderer' // 移動端可跳過的視頻廣告鏈接處
    ];

    // 開發模式開關
    window.dev = false;

    /**
   * 將標準時間格式化
   * @param {Date} time 標準時間
   * @returns {string} 格式化後的時間字符串
   */
    function formatTime(time) {
        const year = time.getFullYear();
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const day = time.getDate().toString().padStart(2, '0');
        const hour = time.getHours().toString().padStart(2, '0');
        const minute = time.getMinutes().toString().padStart(2, '0');
        const second = time.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    /**
   * 輸出調試信息
   * @param {string} msg 調試信息
   */
    function log(msg) {
        if (window.dev) {
            console.log(`${formatTime(new Date())}  ${msg}`);
        }
    }

    /**
   * 設置運行標誌
   * @param {string} name 標誌名稱
   */
    function setRunFlag(name) {
        const style = document.createElement('style');
        style.id = name;
        (document.head || document.body).appendChild(style);
    }

    /**
   * 檢查是否設置了運行標誌
   * @param {string} name 標誌名稱
   * @returns {boolean} 是否設置了運行標誌
   */
    function checkRunFlag(name) {
        if (document.getElementById(name)) {
            return true;
        } else {
            setRunFlag(name);
            return false;
        }
    }

    /**
   * 生成並應用去除廣告的CSS規則
   * @param {string[]} selectors CSS選擇器數組
   */
    function applyAdRemovalStyles(selectors) {
        // 如果已經應用過樣式,則退出
        if (checkRunFlag('adRemovalStyles')) {
            log('廣告移除樣式已應用');
            return;
        }

        // 生成並應用CSS規則
        const style = document.createElement('style');
        (document.head || document.body).appendChild(style);
        style.textContent = selectors.map(selector => `${selector}{display:none!important}`).join(' ');
        log('已成功應用廣告移除樣式');
    }

    /**
   * 獲取當前播放的視頻元素
   */
    function getVideoElement() {
        video = document.querySelector('.ad-showing video') || document.querySelector('video');
    }

    /**
   * 自動播放視頻
   */
    function autoPlayVideo() {
        if (video && video.paused && video.currentTime < 1) {
            video.play();
            log('已自動播放視頻');
        }
    }

    /**
   * 移除YouTube會員推廣彈窗和遮罩層
   */
    function removeOverlay() {
        // 移除會員推廣彈窗
        const premiumContainers = [...document.querySelectorAll('ytd-popup-container')];
        const matchingContainers = premiumContainers.filter(container => container.querySelector('a[href="/premium"]'));
        if (matchingContainers.length > 0) {
            matchingContainers.forEach(container => container.remove());
            log('已移除會員推廣彈窗');
        }

        // 移除遮罩層
        const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
        const targetBackdrop = Array.from(backdrops).find(backdrop => backdrop.style.zIndex === '2201');
        if (targetBackdrop) {
            targetBackdrop.className = ''; // 清空類名
            targetBackdrop.removeAttribute('opened'); // 移除 open 屬性
            log('已關閉遮罩層');
        }
    }

    /**
   * 自動跳過廣告
   */
    function skipAd() {
        const skipButton = document.querySelector('.ytp-ad-skip-button')
        || document.querySelector('.ytp-skip-ad-button')
        || document.querySelector('.ytp-ad-skip-button-modern');
        const shortAdMsg = document.querySelector('.video-ads.ytp-ad-module .ytp-ad-player-overlay')
        || document.querySelector('.ytp-ad-button-icon');

        // 靜音視頻(移動端有bug)
        if ((skipButton || shortAdMsg) && !window.location.href.includes('https://m.youtube.com/')) {
            video.muted = true;
        }

        if (skipButton) {
            const delayTime = 0.5;
            setTimeout(skipAd, delayTime * 1000); // 如果直接點擊不成功,延遲0.5秒再次嘗試
            if (video.currentTime > delayTime) {
                video.currentTime = video.duration; // 強制跳過廣告
                log('已通過特殊帳號跳過廣告');
                return;
            }
            skipButton.click(); // PC 端點擊跳過按鈕
            triggerTouchEvent(skipButton); // 手機端模擬觸摸事件以跳過廣告
            log('已成功跳過廣告');
        } else if (shortAdMsg) {
            video.currentTime = video.duration; // 強制結束短廣告
            log('已強制結束該廣告');
        }
    }

    /**
   * 模擬觸摸事件
   * @param {Element} target 目標元素
   */
    function triggerTouchEvent(target) {
        const touch = new Touch({
            identifier: Date.now(),
            target,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        const touchStartEvent = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch]
        });

        const touchEndEvent = new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touch]
        });

        target.dispatchEvent(touchStartEvent);
        target.dispatchEvent(touchEndEvent);
    }

    /**
   * 移除播放中的廣告
   */
    function removePlayerAds() {
        // 如果已經在運行,退出
        if (checkRunFlag('removePlayerAds')) {
            log('廣告移除功能已在運行');
            return;
        }

        // 監聽視頻中的廣告並處理
        const observer = new MutationObserver(() => {
            getVideoElement();
            removeOverlay();
            skipAd();
            autoPlayVideo();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        log('已成功啟動廣告移除功能');
    }

    /**
   * 主函數
   */
    function main() {
        applyAdRemovalStyles(adCssSelectors); // 移除界面中的廣告
        removePlayerAds(); // 移除播放中的廣告
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
        log('YouTube去廣告腳本即將調用');
    } else {
        main();
        log('YouTube去廣告腳本快速調用');
    }
})();