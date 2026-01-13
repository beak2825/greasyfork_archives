// ==UserScript==
// @name         YouTube Screenshot Helper & Hide the video title when playing Shorts
// @name:zh-TW   YouTube 截圖助手 & 播放Shorts時隱藏影片標題
// @name:zh-CN   YouTube 截图助手 & 播放Shorts时隐藏视频标题
// @namespace    https://www.tampermonkey.net/
// @version      3.0
// @description  YouTube Screenshot Tool – supports hotkey capture, burst mode, customizable hotkeys, burst interval settings, and menu language switch between Chinese and English. Hide the video title when playing Shorts; show the video title when the video is paused.
// @description:zh-TW YouTube截圖工具，支援快捷鍵截圖、連拍模式，自定義快捷鍵、連拍間隔設定、中英菜單切換、播放Shorts時隱藏影片標題，暫停影片時顯示影片標題
// @description:zh-CN YouTube截图工具，支援快捷键截图、连拍模式，自定义快捷键、连拍间隔设定、中英菜单切换、播放Shorts时隐藏影片标题，暂停影片时显示影片标题
// @author       Hzbrrbmin + ChatGPT
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545427/YouTube%20Screenshot%20Helper%20%20Hide%20the%20video%20title%20when%20playing%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/545427/YouTube%20Screenshot%20Helper%20%20Hide%20the%20video%20title%20when%20playing%20Shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 預設參數
    const CONFIG = {
        defaultHotkey: 'a',
        defaultInterval: 1000,
        minInterval: 100,
        defaultLang: 'EN',
    };

    // 取得設定值
    let screenshotKey = GM_getValue('screenshotKey', CONFIG.defaultHotkey);
    let interval = Math.max(parseInt(GM_getValue('captureInterval', CONFIG.defaultInterval)), CONFIG.minInterval);
    let lang = GM_getValue('lang', CONFIG.defaultLang);

    // 多語系
    const I18N = {
        EN: {
            langToggle: 'LANG EN',
            setHotkey: `Set Screenshot Key (Now: ${screenshotKey.toUpperCase()})`,
            setInterval: `Set Burst Interval (Now: ${interval}ms)`,
            promptKey: 'Enter new hotkey (a-z):',
            promptInterval: `Enter new interval (min ${CONFIG.minInterval}ms):`,
        },
        ZH: {
            langToggle: '語言 中文',
            setHotkey: `設定截圖快捷鍵（目前：${screenshotKey.toUpperCase()}）`,
            setInterval: `設定連拍間隔（目前：${interval}ms）`,
            promptKey: '請輸入新的快捷鍵（單一字母）:',
            promptInterval: `請輸入新的連拍間隔（單位ms，最低 ${CONFIG.minInterval}ms）：`,
        },
    };
    const t = I18N[lang];

    // 狀態變數
    let keyDown = false;
    let intervalId = null;
    let observer = null;
    let lastHref = location.href;

    // 取得影片元素
    function getVideoElement() {
        const videos = Array.from(document.querySelectorAll('video'));
        if (window.location.href.includes('/shorts/')) {
            return videos.find(v => v.offsetParent !== null);
        }
        return videos[0] || null;
    }

    // 格式化時間
    function formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
        const ms = String(Math.floor((seconds % 1) * 1000)).padStart(3, '0');
        return { h, m, s, ms };
    }

    // 取得影片ID
    function getVideoID() {
        let match = window.location.href.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
        match = window.location.href.match(/\/live\/([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
        match = window.location.href.match(/[?&]v=([^&]+)/);
        return match ? match[1] : 'unknown';
    }

    // 取得影片標題
    function getVideoTitle() {
        if (window.location.href.includes('/shorts/')) {
            let h2 = document.querySelector('ytd-reel-video-renderer[is-active] h2');
            if (h2 && h2.textContent.trim()) return h2.textContent.trim().replace(/[\\/:*?"<>|]/g, '').trim();
            h2 = document.querySelector('ytd-reel-video-renderer h2');
            if (h2 && h2.textContent.trim()) return h2.textContent.trim().replace(/[\\/:*?"<>|]/g, '').trim();
            let meta = document.querySelector('meta[name="title"]');
            if (meta) return meta.getAttribute('content').replace(/[\\/:*?"<>|]/g, '').trim();
            return (document.title || 'unknown').replace(/[\\/:*?"<>|]/g, '').trim();
        }
        if (window.location.href.includes('/live/')) {
            let title = document.querySelector('meta[name="title"]')?.getAttribute('content')
                || document.title
                || 'unknown';
            return title.replace(/[\\/:*?"<>|]/g, '').trim();
        }
        let title = document.querySelector('h1.ytd-watch-metadata')?.textContent
            || document.querySelector('h1.title')?.innerText
            || document.querySelector('h1')?.innerText
            || document.querySelector('meta[name="title"]')?.getAttribute('content')
            || document.title
            || 'unknown';
        return title.replace(/[\\/:*?"<>|]/g, '').trim();
    }

    // 截圖主程式
    function takeScreenshot() {
        const video = getVideoElement();
        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        const link = document.createElement('a');
        const timeObj = formatTime(video.currentTime);
        const title = getVideoTitle();
        const id = getVideoID();
        const resolution = `${canvas.width}x${canvas.height}`;
        // 修改檔名格式：影片標題_小時_分鐘_秒_毫秒_ID_解析度
        link.download = `${title}_${timeObj.h}_${timeObj.m}_${timeObj.s}_${timeObj.ms}_${id}_${resolution}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // 初始化腳本
    function init() {
        // 清除舊的監聽與計時器
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        clearInterval(intervalId);
        keyDown = false;

        // 監聽 DOM 變化（Shorts 專用，可保留或移除，這裡保留以利未來擴充）
        if (window.location.href.includes('/shorts/')) {
            observer = new MutationObserver(() => {});
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // 快捷鍵事件（先移除再加，避免重複）
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
        document.addEventListener('keydown', keydownHandler);
        document.addEventListener('keyup', keyupHandler);
    }

    // 快捷鍵事件處理
    function keydownHandler(e) {
        if (
            e.key.toLowerCase() === screenshotKey &&
            !keyDown &&
            !['INPUT', 'TEXTAREA'].includes(e.target.tagName)
        ) {
            keyDown = true;
            takeScreenshot();
            intervalId = setInterval(takeScreenshot, interval);
        }
    }
    function keyupHandler(e) {
        if (e.key.toLowerCase() === screenshotKey) {
            keyDown = false;
            clearInterval(intervalId);
        }
    }

    // 油猴選單
    GM_registerMenuCommand(t.setHotkey, () => {
        const input = prompt(t.promptKey, screenshotKey);
        if (input && /^[a-zA-Z]$/.test(input)) {
            GM_setValue('screenshotKey', input.toLowerCase());
            location.reload();
        }
    });

    GM_registerMenuCommand(t.setInterval, () => {
        const input = parseInt(prompt(t.promptInterval, interval));
        if (!isNaN(input) && input >= CONFIG.minInterval) {
            GM_setValue('captureInterval', input);
            location.reload();
        }
    });

    GM_registerMenuCommand(t.langToggle, () => {
        GM_setValue('lang', lang === 'EN' ? 'ZH' : 'EN');
        location.reload();
    });

    // 監聽 SPA 路由變化，自動重新初始化
    setInterval(() => {
        if (location.href !== lastHref) {
            lastHref = location.href;
            setTimeout(init, 300); // 延遲初始化，確保 DOM 已切換
        }
    }, 200);

    // 首次初始化
    init();

    // ===== Shorts 標題隱藏模組 =====
    function hideShortsTitleOnPlay() {
    const selectors = [
        'ytd-reel-player-overlay-renderer div.metadata-container',
        'ytd-reel-player-overlay-renderer .style-scope.ytd-reel-player-overlay-renderer'
    ];

    function toggleTitleDisplay(hide) {
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = hide ? 'none' : '';
            });
        });
    }

    function checkAndHide() {
        if (!location.href.includes('/shorts/')) return;

        const video = getVideoElement();
        if (!video) return;

        if (!video.paused) {
            toggleTitleDisplay(true);
        } else {
            toggleTitleDisplay(false);
        }
    }

    // 首次執行
    checkAndHide();

    // 每 3 秒檢查一次
    setInterval(checkAndHide, 3000);

    // 原本事件監聽依然保留，提升即時性
    const observer = new MutationObserver(() => {
        if (document.querySelector('ytd-reel-player-overlay-renderer')) {
            setTimeout(checkAndHide, 300);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

    // 呼叫模組
    hideShortsTitleOnPlay();

})();