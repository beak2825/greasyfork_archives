// ==UserScript==
// @name         Bilibili Video Screenshot Helper & VXBilibili Link Copy Button
// @name:zh-TW   Bilibili 影片截圖助手 & VXBilibili鏈結複製按鈕
// @name:zh-CN   Bilibili 视频截图助手 & VXBilibili链结复制按钮
// @namespace    https://www.tampermonkey.net/
// @version      3.3
// @description  Bilibili video screenshot tool supporting screenshot buttons, shortcut key screenshots, burst shooting, customizable shortcut keys, burst interval settings, one-click fullscreen toggle, VX link copy button, and Chinese-English menu switching.
// @description:zh-TW B站影片截圖工具，支援截圖按鈕、快捷鍵截圖、連拍功能，自定義快捷鍵、連拍間隔設定、一鍵切換全屏、VX鏈結複製按鈕、中英菜單切換
// @description:zh-CN B站视频截图工具，支援截图按钮、快捷键截图、连拍功能，自定义快捷键、连拍间隔设定、一键切换全屏、VX链结复制按钮、中英菜单切换
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/opus/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545426/Bilibili%20Video%20Screenshot%20Helper%20%20VXBilibili%20Link%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/545426/Bilibili%20Video%20Screenshot%20Helper%20%20VXBilibili%20Link%20Copy%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== 樣式定義 ======
    GM_addStyle(`
        /* 影片播放器按鈕容器 */
        .bili-helper-container {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        .bili-helper-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            margin-right: 24px;
            transition: transform 0.1s;
            color: var(--text1);
        }
        .bili-helper-btn:hover { transform: scale(1.15); color: var(--brand_pink); }

        /* 動態頁面側邊欄按鈕樣式 */
        .bili-helper-side-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            margin-top: 8px;
            cursor: pointer;
            /* 修改點：背景改為您檢測出的深灰色 #1f2022 */
            background: #1f2022;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s;
            font-size: 20px;
            color: #ffffff; /* 深色背景配白色圖示 */
        }
        .bili-helper-side-item:hover {
            background: #313235; /* 懸停時稍亮一點點 */
            color: #00aeec;
        }

        .bili-helper-notif {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 15px;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    `);

    // ====== 設定與狀態 ======
    const CONFIG = {
        key: GM_getValue('hotkey', 'S').toUpperCase(),
        interval: GM_getValue('interval', 1000),
        lang: GM_getValue('lang', 'ZH'),
        minInterval: 100
    };

    const LANGS = {
        EN: {
            screenshot: 'Screenshot',
            copyVX: 'Copy VX Link',
            keySetting: `Set Hotkey (Current: ${CONFIG.key})`,
            intervalSetting: `Set Interval (Current: ${CONFIG.interval}ms)`,
            langSwitch: 'Switch to 中文',
            copied: '✅ Link Copied!',
            copyFail: '❌ Copy Failed'
        },
        ZH: {
            screenshot: '截圖',
            copyVX: '複製 VX 連結',
            keySetting: `設定快捷鍵 (目前: ${CONFIG.key})`,
            intervalSetting: `設定連拍間隔 (目前: ${CONFIG.interval}ms)`,
            langSwitch: '切換到 English',
            copied: '✅ 連結已複製！',
            copyFail: '❌ 複製失敗'
        }
    };

    let t = LANGS[CONFIG.lang] || LANGS.ZH;
    let holdTimer = null;

    // ====== 通用工具 ======
    const showNotif = (msg) => {
        let el = document.querySelector('.bili-helper-notif');
        if (!el) {
            el = document.createElement('div');
            el.className = 'bili-helper-notif';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        requestAnimationFrame(() => { el.style.opacity = '1'; });
        clearTimeout(el.timer);
        el.timer = setTimeout(() => el.style.opacity = '0', 2500);
    };

    const safeReload = (key, val) => {
        GM_setValue(key, val);
        location.reload();
    };

    // ====== 核心功能 ======
    function getVideoTitle() {
        let title = document.querySelector('.video-title')?.title ||
                    document.querySelector('h1')?.innerText ||
                    document.title;
        return title.replace(/_嗶哩嗶哩.*$/, '').trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
    }

    function takeScreenshot() {
        const video = document.querySelector('video');
        if (!video || video.videoWidth === 0) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const res = `${canvas.width}x${canvas.height}`;
        const now = video.currentTime;
        const pad = (n, l=2) => n.toString().padStart(l, '0');
        const timeStr = `${pad(Math.floor(now/3600))}_${pad(Math.floor((now%3600)/60))}_${pad(Math.floor(now%60))}_${pad(Math.floor((now*1000)%1000), 3)}`;

        const bvId = location.pathname.match(/(BV\w+)|(av\d+)/)?.[0] || 'Unknown';
        const filename = `${getVideoTitle()}_${timeStr}_${bvId}_${res}.png`;

        canvas.toBlob(blob => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
    }

    function copyVXLink() {
        try {
            let url = location.href;
            url = url.replace(/bilibili\.com/g, 'vxbilibili.com').replace(/b23\.tv/g, 'vxb23.tv');

            if (location.pathname.includes('/video/')) {
                const u = new URL(location.href);
                const bv = u.pathname.match(/\/video\/(BV\w+|av\d+)/)?.[1];
                if (bv) {
                    const p = u.searchParams.get('p');
                    url = `https://www.vxbilibili.com/video/${bv}/` + (p ? `?p=${p}` : '');
                }
            }

            navigator.clipboard.writeText(url).then(() => {
                showNotif(t.copied);
            }).catch(() => {
                showNotif(t.copyFail);
            });
        } catch (e) { showNotif(t.copyFail); }
    }

    // ====== UI 注入邏輯 ======
    function injectPlayerButtons() {
        const controlRight = document.querySelector('.bpx-player-control-bottom-right') ||
                             document.querySelector('.squirtle-controller-right');

        if (!controlRight || document.querySelector('.bili-helper-container')) return;

        const container = document.createElement('div');
        container.className = 'bili-helper-container';

        const btnLink = document.createElement('div');
        btnLink.className = 'bili-helper-btn';
        btnLink.style.marginRight = '24px';
        btnLink.innerHTML = '🔗';
        btnLink.title = t.copyVX;
        btnLink.onclick = copyVXLink;

        const btnSnap = document.createElement('div');
        btnSnap.className = 'bili-helper-btn bili-screenshot-btn';
        btnSnap.innerHTML = '📸';
        btnSnap.title = t.screenshot;
        btnSnap.onclick = takeScreenshot;

        container.appendChild(btnLink);
        container.appendChild(btnSnap);
        controlRight.prepend(container);
    }

    function injectSidebarButton() {
        const sidebar = document.querySelector('.side-toolbar');
        if (!sidebar || document.querySelector('.bili-helper-side-item')) return;

        const sideBtn = document.createElement('div');
        sideBtn.className = 'bili-helper-side-item';
        sideBtn.innerHTML = '🔗';
        sideBtn.title = t.copyVX;
        sideBtn.onclick = copyVXLink;

        sidebar.appendChild(sideBtn);
    }

    // ====== 監聽與事件 ======
    let injectTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(injectTimeout);
        injectTimeout = setTimeout(() => {
            if (location.pathname.includes('/opus/')) {
                injectSidebarButton();
            } else {
                injectPlayerButtons();
            }
        }, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('keydown', e => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;

        if (e.key.toUpperCase() === CONFIG.key && !e.repeat) {
            takeScreenshot();
            if (!holdTimer) holdTimer = setInterval(takeScreenshot, CONFIG.interval);
        }

        if (e.key === '`') {
            const fsBtn = document.querySelector('.bpx-player-ctrl-web') ||
                          document.querySelector('.squirtle-video-pagefullscreen') ||
                          document.querySelector('[aria-label="网页全屏"]');
            fsBtn?.click();
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key.toUpperCase() === CONFIG.key && holdTimer) {
            clearInterval(holdTimer);
            holdTimer = null;
        }
    });

    // ====== 功能選單註冊 ======
    GM_registerMenuCommand(t.keySetting, () => {
        const input = prompt("New Key (A-Z):", CONFIG.key);
        if (input && /^[a-zA-Z]$/.test(input)) safeReload('hotkey', input.toUpperCase());
    });

    GM_registerMenuCommand(t.intervalSetting, () => {
        const input = prompt("Interval (ms):", CONFIG.interval);
        const val = parseInt(input, 10);
        if (!isNaN(val) && val >= CONFIG.minInterval) safeReload('interval', val);
    });

    GM_registerMenuCommand(t.langSwitch, () => {
        safeReload('lang', CONFIG.lang === 'EN' ? 'ZH' : 'EN');
    });

})();
