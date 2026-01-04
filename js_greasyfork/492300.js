// ==UserScript==
// @name         4gamers error 429 & 404 handler / 4gamers 錯誤 429 & 404 處理器
// @name:zh-TW   4gamers 錯誤 429 & 404 處理器
// @version      1.8
// @description  Automatically refresh the page when 4gamers.com.tw shows error 429, and redirect to Web Archive if it shows 404
// @description:zh-TW 當4gamers.com.tw顯示錯誤 429 時自動重新整理網頁，若顯示 404 則跳轉至網際網路檔案館。(此腳本由AI協助撰寫)
// @author       特務E04
// @match        https://www.4gamers.com.tw/*
// @license      MIT
// @noframes
// @supportURL   https://github.com/jmsch23280866/4gamers-error-handler/issues
// @namespace    https://github.com/jmsch23280866
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492300/4gamers%20%E9%8C%AF%E8%AA%A4%20429%20%20404%20%E8%99%95%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/492300/4gamers%20%E9%8C%AF%E8%AA%A4%20429%20%20404%20%E8%99%95%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定背景分頁重試延遲時間（毫秒）
    const BACKGROUND_DELAY = {
        MIN: 500,    // 背景分頁最小延遲 0.5 秒
        MAX: 5000    // 背景分頁最大延遲 5 秒
    };
    
    let isPaused = false; // 追蹤頁面是否暫停載入
    let isNormalTitle = false; // 追蹤標題是否恢復正常
    
    // 取得背景分頁的隨機延遲時間
    function getBackgroundDelay() {
        return Math.floor(Math.random() * (BACKGROUND_DELAY.MAX - BACKGROUND_DELAY.MIN + 1)) + BACKGROUND_DELAY.MIN;
    }

    // 檢查分頁是否可見
    function isPageVisible() {
        return document.visibilityState === 'visible';
    }

    // 停止頁面載入
    function stopLoading() {
        document.documentElement.innerHTML = '';
        window.stop();
    }

    // 處理分頁可見性變化
    document.addEventListener('visibilitychange', function() {
        if (isPageVisible() && isPaused) {
            console.log('分頁恢復前景，繼續載入');
            isPaused = false;
            location.reload();
        }
    });

    // 建立一個觀察者來監視<title>的變化
    const observer = new MutationObserver(function() {
        checkTitle();
    });

    // 檢查<title>標籤中的文字內容
    function checkTitle() {
        const titleText = document.title;
        const visible = isPageVisible();

        if (titleText === "429 Too Many Requests") {
            isNormalTitle = false;
            console.log(`偵測到 429 Too Many Requests... (${visible ? '前景' : '背景'}分頁)`);
            stopLoading();
            
            if (visible) {
                // 前景分頁立即重新整理
                console.log('前景分頁立即重新整理');
                location.reload();
            } else {
                // 背景分頁使用延遲重新整理
                const delay = getBackgroundDelay();
                console.log(`背景分頁將在 ${delay/1000} 秒後重新整理...`);
                document.title = '🔄 ' + titleText; // 加入重新整理圖示
                setTimeout(() => location.reload(), delay);
            }
            
        } else if (titleText === "404 Not Found") {
            console.log("偵測到 404 Not Found，重新導向至網際網路檔案館...");
            stopLoading();
            const currentUrl = window.location.href;
            const archiveUrl = "https://web.archive.org/web/" + currentUrl;
            window.location.replace(archiveUrl);
        } else if (!visible && !isPaused) {
            // 背景分頁且標題正常時，暫停載入
            isNormalTitle = true;
            isPaused = true;
            console.log('標題恢復正常，背景分頁暫停載入');
            stopLoading();
            document.title = '⏸️ ' + titleText; // 加入暫停圖示
        }
    }

    // 在文檔開始載入時就開始監視<title>的變化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 立即檢查<title>
    checkTitle();
})();
