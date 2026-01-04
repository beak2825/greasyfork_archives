// ==UserScript==
// @name         Netflix Screenshot Helper
// @name:zh-TW   Netflix 截圖助手
// @name:zh-CN   Netflix 截图助手
// @namespace    https://www.netflix.com/
// @version      1.4
// @description  Capture Netflix screen using screen sharing (continuous sharing, customizable hotkeys, menu settings supported, long-press burst capture, filenames include video ID/series ID/timestamp).
// @description:zh-TW 使用螢幕分享擷取 Netflix 畫面 (持續共享, 快捷鍵可設定, 支援選單設定, 長按連拍, 檔名含影片ID/影集ID/時間)
// @description:zh-CN 使用萤幕分享撷取 Netflix 画面 (持续共享, 快捷键可设定, 支援选单设定, 长按连拍, 档名含影片ID/影集ID/时间)
// @author       Hzbrrbmin + ChatGPT
// @match        https://www.netflix.com/*
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547388/Netflix%20Screenshot%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/547388/Netflix%20Screenshot%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== 預設值 ======
    const DEFAULT_SHORTCUT = 's';
    const DEFAULT_INTERVAL = 1000;
    const MIN_INTERVAL = 100;

    // ====== i18n ======
    const i18n = {
        EN: {
            setKey: key => `Set Shortcut Key (Current: ${key})`,
            setInterval: ms => `Set Burst Interval (Current: ${ms}ms)`,
            inputKey: 'Enter a new shortcut key (one character):',
            inputInterval: 'Enter new burst interval in ms (min: 100):',
            invalidInterval: 'Invalid input. Must be ≥ 100.',
            langSwitch: '語言切換 → 中文'
        },
        ZH: {
            setKey: key => `設定快捷鍵（目前：${key}）`,
            setInterval: ms => `設定連拍間隔（目前：${ms}ms）`,
            inputKey: '請輸入新的截圖快捷鍵（單一字母）：',
            inputInterval: '請輸入新的連拍間隔（單位：毫秒，最小值：100）：',
            invalidInterval: '請輸入一個不小於 100 的有效數字。',
            langSwitch: 'Switch Language → EN'
        }
    };

    // ====== 儲存設定 ======
    let lang = localStorage.getItem('nf_lang') || 'ZH';
    let HOTKEY = localStorage.getItem('nf_hotkey') || DEFAULT_SHORTCUT;
    let BURST_INTERVAL = parseInt(localStorage.getItem('nf_interval')) || DEFAULT_INTERVAL;

    function saveSettings() {
        localStorage.setItem('nf_lang', lang);
        localStorage.setItem('nf_hotkey', HOTKEY);
        localStorage.setItem('nf_interval', BURST_INTERVAL);
    }

    // ====== 選單設定 ======
    function registerMenu() {
        GM_registerMenuCommand(i18n[lang].setKey(HOTKEY.toUpperCase()), () => {
            const key = prompt(i18n[lang].inputKey, HOTKEY);
            if (key && key.length === 1) {
                HOTKEY = key.toLowerCase();
                saveSettings();
                location.reload(); // 自動重整
            }
        });

        GM_registerMenuCommand(i18n[lang].setInterval(BURST_INTERVAL), () => {
            const ms = parseInt(prompt(i18n[lang].inputInterval, BURST_INTERVAL));
            if (!isNaN(ms) && ms >= MIN_INTERVAL) {
                BURST_INTERVAL = ms;
                saveSettings();
                location.reload(); // 自動重整
            }
        });

        GM_registerMenuCommand(i18n[lang].langSwitch, () => {
            lang = (lang === 'ZH' ? 'EN' : 'ZH');
            saveSettings();
            location.reload(); // 自動重整
        });
    }

    registerMenu();

    // ====== 提示訊息 ======
    function toast(msg) {
        const div = document.createElement('div');
        div.textContent = msg;
        Object.assign(div.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            zIndex: 99999,
            fontSize: '14px'
        });
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 2000);
    }

    // ====== 螢幕共享 ======
    let captureStream = null;
    let captureVideo = null;

    async function initCapture() {
        try {
            captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            captureVideo = document.createElement('video');
            captureVideo.srcObject = captureStream;
            await captureVideo.play();
            toast(lang === 'ZH' ? "✅ 已啟動螢幕分享" : "✅ Screen sharing started");
        } catch (err) {
            console.error("螢幕分享失敗:", err);
            toast(lang === 'ZH' ? "❌ 螢幕分享失敗" : "❌ Screen sharing failed");
        }
    }

    // ====== 截圖 ======
    function takeScreenshot() {
        if (!captureVideo) {
            toast(lang === 'ZH' ? "⚠️ 尚未啟動螢幕分享 (先按快捷鍵)" : "⚠️ Screen share not started (press hotkey first)");
            return;
        }

        // 解析影片ID與影集ID
        const urlParams = new URL(window.location.href);
        const videoId = urlParams.pathname.split('/watch/')[1] || 'unknownVid';
        const trackId = urlParams.searchParams.get('trackId') || 'unknownTrack';

        // 影片時間
        const time = captureVideo.currentTime;
        const pad = (n, len = 2) => n.toString().padStart(len, '0');
        const h = pad(Math.floor(time / 3600));
        const m = pad(Math.floor((time % 3600) / 60));
        const s = pad(Math.floor(time % 60));
        const ms = pad(Math.floor((time % 1) * 1000), 3);

        // 建立 canvas 並截圖
        const canvas = document.createElement('canvas');
        canvas.width = captureVideo.videoWidth;
        canvas.height = captureVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(captureVideo, 0, 0, canvas.width, canvas.height);

        // 檔名：影集ID_影片ID_時間
        const filename = `${trackId}_${videoId}_${h}_${m}_${s}_${ms}.png`;

        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // ====== 連拍邏輯 ======
    let isPressing = false;
    let burstTimer = null;

    document.addEventListener('keydown', async (e) => {
        if (e.key.toLowerCase() === HOTKEY && !isPressing) {
            isPressing = true;
            if (!captureStream) {
                await initCapture();
            } else {
                takeScreenshot();
                burstTimer = setInterval(takeScreenshot, BURST_INTERVAL);
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() === HOTKEY) {
            isPressing = false;
            if (burstTimer) {
                clearInterval(burstTimer);
                burstTimer = null;
            }
        }
    });

})();
