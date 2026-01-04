// ==UserScript==
// @name         Twitch Screenshot Helper
// @name:zh-TW   Twitch 截圖助手
// @name:zh-CN   Twitch 截图助手
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Twitch screen capture tool with support for hotkeys, burst mode, customizable shortcuts, capture interval, and English/Chinese menu switching.
// @description:zh-TW Twitch截圖工具，支援截圖按鈕、快捷鍵截圖、連拍功能，自定義快捷鍵、連拍間隔設定、中英菜單切換
// @description:zh-CN Twitch截图工具，支援截图按钮、快捷键截图、连拍功能，自定义快捷键、连拍间隔设定、中英菜单切换
// @author       Hzbrrbmin + ChatGPT
// @match        https://www.twitch.tv/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545428/Twitch%20Screenshot%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545428/Twitch%20Screenshot%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 取得語言、快捷鍵、連拍間隔等設定
    const lang = GM_getValue("lang", "en").toLowerCase(); // 語言（en/zh-tw）
    const screenshotKey = GM_getValue("screenshotKey", "s"); // 快捷鍵
    const intervalTime = parseInt(GM_getValue("shootInterval", "1000"), 10); // 連拍間隔(ms)
    let shootTimer = null; // 連拍定時器
    let debounceTimeout = null; // 防抖用於按鈕插入

    // 多語系文字
    const textMap = {
        en: {
            btnTooltip: `Screenshot (Shortcut: ${screenshotKey.toUpperCase()})`,
            setKey: `Set Screenshot Key (Current: ${screenshotKey.toUpperCase()})`,
            setInterval: `Set Interval (Current: ${intervalTime}ms)`,
            langSwitch: `language EN`,
            keyError: `Please enter a single letter (A-Z).`,
            intervalError: `Please enter a number >= 100`,
        },
        "zh-tw": {
            btnTooltip: `擷取畫面（快捷鍵：${screenshotKey.toUpperCase()}）`,
            setKey: `設定快捷鍵（目前為 ${screenshotKey.toUpperCase()}）`,
            setInterval: `設定連拍間隔（目前為 ${intervalTime} 毫秒）`,
            langSwitch: `語言 中文`,
            keyError: `請輸入單一英文字母（A-Z）！`,
            intervalError: `請輸入 100ms 以上的數字！`,
        }
    };
    const text = textMap[lang] || textMap["en"];

    // 取得目前直播主ID（網址路徑第一段）
    function getStreamerId() {
        const match = window.location.pathname.match(/^\/([^\/?#]+)/);
        return match ? match[1] : "unknown";
    }

    // 取得當前時間字串（小時_分鐘_秒_毫秒，檔名用）
    function getTimeString() {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const padMs = n => n.toString().padStart(3, '0');
        return `${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}_${padMs(now.getMilliseconds())}`;
    }

    // 取得年月日字串（檔名用）
    function getDateString() {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    }

    // 擷取畫面主函式
    function takeScreenshot() {
        const video = document.querySelector('video');
        if (!video || video.readyState < 2) return; // 沒有影片或影片未載入完成
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            if (!blob) return;
            const a = document.createElement("a");
            // 檔名格式：ID_年月日_小時_分鐘_秒_毫秒_解析度.png
            a.download = `${getStreamerId()}_${getDateString()}_${getTimeString()}_${canvas.width}x${canvas.height}.png`;
            a.href = URL.createObjectURL(blob);
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            }, 100);
        }, "image/png");
    }

    // 開始連拍
    function startContinuousShot() {
        if (shootTimer) return;
        takeScreenshot();
        shootTimer = setInterval(takeScreenshot, intervalTime);
    }

    // 停止連拍
    function stopContinuousShot() {
        clearInterval(shootTimer);
        shootTimer = null;
    }

    // 插入截圖按鈕到 Twitch 控制列
    function createIntegratedButton() {
        if (document.querySelector("#screenshot-btn")) return; // 已存在就不重複插入
        // 嘗試多個常見控制列選擇器
        const controls = document.querySelector('.player-controls__right-control-group') ||
                         document.querySelector('[data-a-target="player-controls-right-group"]');
        if (!controls) {
            // 控制列還沒出現，稍後重試
            setTimeout(createIntegratedButton, 1000);
            return;
        }
        // 建立按鈕
        const btn = document.createElement("button");
        btn.id = "screenshot-btn";
        btn.innerHTML = "📸";
        btn.title = text.btnTooltip;
        Object.assign(btn.style, {
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center',
            order: 9999,
            zIndex: '2147483647'
        });
        // 綁定滑鼠事件（支援連拍）
        btn.addEventListener('mousedown', startContinuousShot, { capture: true });
        btn.addEventListener('mouseup', stopContinuousShot, { capture: true });
        btn.addEventListener('mouseleave', stopContinuousShot, { capture: true });
        // 插入到控制列最右側
        try {
            const referenceNode = controls.querySelector('[data-a-target="player-settings-button"]');
            if (referenceNode) {
                controls.insertBefore(btn, referenceNode);
            } else {
                controls.appendChild(btn);
            }
        } catch (e) {
            controls.appendChild(btn);
        }
    }

    // 防抖：避免頻繁重複插入按鈕
    function createIntegratedButtonDebounced() {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(createIntegratedButton, 500);
    }

    // 初始化主流程
    function init() {
        createIntegratedButton();
        // 監控整個 body，偵測 DOM 變動時自動補回按鈕
        const observer = new MutationObserver(createIntegratedButtonDebounced);
        observer.observe(document.body, { childList: true, subtree: true });
        // 每5秒定時檢查按鈕是否存在
        setInterval(() => {
            if (!document.querySelector("#screenshot-btn")) {
                createIntegratedButton();
            }
        }, 5000);
    }

    // 判斷目前是否在輸入框內輸入
    function isTyping() {
        const active = document.activeElement;
        return active && ['INPUT', 'TEXTAREA'].includes(active.tagName) || active.isContentEditable;
    }

    // 快捷鍵事件：支援單鍵連拍
    document.addEventListener("keydown", e => {
        if (
            e.key.toLowerCase() === screenshotKey.toLowerCase() &&
            !shootTimer &&
            !isTyping() &&
            !e.repeat
        ) {
            e.preventDefault();
            startContinuousShot();
        }
    });

    document.addEventListener("keyup", e => {
        if (
            e.key.toLowerCase() === screenshotKey.toLowerCase() &&
            !isTyping()
        ) {
            e.preventDefault();
            stopContinuousShot();
        }
    });

    // 註冊油猴右鍵選單：自訂快捷鍵
    GM_registerMenuCommand(text.setKey, () => {
        const input = prompt(
            lang === "en"
                ? "Enter new shortcut key (A-Z)"
                : "請輸入新的快捷鍵（A-Z）",
            screenshotKey
        );
        if (input && /^[a-zA-Z]$/.test(input)) {
            GM_setValue("screenshotKey", input.toLowerCase());
            location.reload();
        } else {
            alert(text.keyError);
        }
    });

    // 註冊油猴右鍵選單：自訂連拍間隔
    GM_registerMenuCommand(text.setInterval, () => {
        const input = prompt(
            lang === "en"
                ? "Enter interval in milliseconds (min: 100)"
                : "請輸入新的連拍間隔（最小100毫秒）",
            intervalTime
        );
        const val = parseInt(input, 10);
        if (!isNaN(val) && val >= 100) {
            GM_setValue("shootInterval", val);
            location.reload();
        } else {
            alert(text.intervalError);
        }
    });

    // 註冊油猴右鍵選單：語言切換
    GM_registerMenuCommand(text.langSwitch, () => {
        GM_setValue("lang", lang === "en" ? "zh-tw" : "en");
        location.reload();
    });

      // ========== 劇院模式快捷鍵切換 (` / ~ 鍵) ==========
    document.addEventListener('keydown', (event) => {
        const active = document.activeElement;
        const isTyping = active && (
              active.tagName === 'INPUT' ||
              active.tagName === 'TEXTAREA' ||
              active.isContentEditable
    );
          if (isTyping) return;

          if (event.key === '`') {
      // 使用 aria-label 含「劇院模式」的按鈕（中英文皆可）
        const buttons = Array.from(document.querySelectorAll('button[aria-label]'));
        const theaterButton = buttons.find(btn =>
        /劇院模式|Theatre Mode/i.test(btn.getAttribute('aria-label'))
    );

          if (theaterButton) {
              theaterButton.click();
      } else {
              console.warn('找不到劇院模式切換按鈕');
    }
  }
});

    // 啟動腳本
    init();
})();