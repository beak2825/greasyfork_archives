// ==UserScript==
// @name         Bilibili Live Screenshot Helper
// @name:zh-TW   Bilibili 直播截圖助手
// @name:zh-CN   Bilibili 直播截图助手
// @namespace    https://www.tampermonkey.net/
// @version      2.7
// @description  Bilibili Live Screenshot Tool – supports hotkey capture, burst mode, customizable hotkeys, burst interval settings, and menu language switch between Chinese and English.
// @description:zh-TW B站直播截圖工具，支援快捷鍵截圖、連拍功能，自定義快捷鍵、連拍間隔設定、中英菜單切換 
// @description:zh-CN B站直播截图工具，支援快捷键截图、连拍功能，自定义快捷键、连拍间隔设定、中英菜单切换
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://live.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545424/Bilibili%20Live%20Screenshot%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545424/Bilibili%20Live%20Screenshot%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === 預設設定 ===
  const DEFAULT_KEY = 'S';
  const DEFAULT_INTERVAL = 1000;
  const MIN_INTERVAL = 100;

  // === 樣式設定：控制列整合與位置微調 ===
  GM_addStyle(`
    .screenshot-helper-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      cursor: pointer;
      color: #fff;
      font-size: 13px;
      line-height: 100%;
      height: 100%;
      transition: color 0.2s;
      vertical-align: middle;
      /* 調整按鈕垂直位置：向下移 4 像素 */
      transform: translateY(4px);
    }
    .screenshot-helper-btn:hover {
      color: #23ade5;
    }
  `);

  // === 多語言設定 ===
  const LANGS = {
    EN: {
      screenshot: 'Screenshot',
      keySetting: key => `Set Hotkey (Current: ${key})`,
      intervalSetting: val => `Set Burst Interval (Current: ${val}ms)`,
      langToggle: 'Switch Language (Current: EN)',
      keyPrompt: 'Enter new key (A-Z)',
      intervalPrompt: 'Enter new interval in ms (min 100ms)',
    },
    ZH: {
      screenshot: '截圖',
      keySetting: key => `設定快捷鍵 (目前: ${key})`,
      intervalSetting: val => `設定連拍間隔 (目前: ${val}ms)`,
      langToggle: '切換語言 (目前: 中文)',
      keyPrompt: '輸入新快捷鍵 (A-Z)',
      intervalPrompt: '輸入連拍間隔 (最小 100ms)',
    }
  };

  let lang = GM_getValue('lang', 'ZH');
  let currentKey = GM_getValue('hotkey', DEFAULT_KEY);
  let interval = GM_getValue('interval', DEFAULT_INTERVAL);
  const t = () => LANGS[lang];

  // === 核心功能：產生檔名 ([房間號]年月日_時_分_秒_毫秒_解析度) ===
  function generateFilename(video, canvas) {
    const pad = n => n.toString().padStart(2, '0');
    const padMs = n => n.toString().padStart(3, '0');
    const now = new Date();

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const s = pad(now.getSeconds());
    const ms = padMs(now.getMilliseconds());

    const roomIdMatch = location.pathname.match(/^\/(\d+)/);
    const roomId = roomIdMatch ? roomIdMatch[1] : 'Unknown';

    return `[${roomId}]${year}${month}${day}_${h}_${m}_${s}_${ms}_${canvas.width}x${canvas.height}.png`;
  }

  function takeScreenshot() {
    const video = document.querySelector('video');
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const filename = generateFilename(video, canvas);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }

  // === UI 插入邏輯 ===
  function injectUI() {
    if (document.getElementById('screenshot-helper-trigger')) return;

    const rightCtnr = document.querySelector('.right-ctnr');
    if (!rightCtnr) return;

    const btn = document.createElement('div');
    btn.id = 'screenshot-helper-trigger';
    btn.className = 'screenshot-helper-btn';
    btn.innerText = t().screenshot;
    btn.title = `${t().keySetting(currentKey)}\n${t().intervalSetting(interval)}`;
    btn.onclick = (e) => {
      e.preventDefault();
      takeScreenshot();
    };

    // 插入至 right-ctnr 的左側
    rightCtnr.parentNode.insertBefore(btn, rightCtnr);
  }

  const observer = new MutationObserver(() => injectUI());
  observer.observe(document.body, { childList: true, subtree: true });

  // === 快捷鍵監控 (含長按連拍) ===
  let holdTimer = null;
  let isKeyDown = false;

  document.addEventListener('keydown', e => {
    if (isKeyDown) return;
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.isContentEditable) return;
    if (e.key.toUpperCase() === currentKey) {
      isKeyDown = true;
      takeScreenshot();
      holdTimer = setInterval(takeScreenshot, interval);
    }
  });

  document.addEventListener('keyup', e => {
    if (e.key.toUpperCase() === currentKey) {
      clearInterval(holdTimer);
      holdTimer = null;
      isKeyDown = false;
    }
  });

  // === 註冊油猴選單 ===

  // 1. 設定快捷鍵
  GM_registerMenuCommand(t().keySetting(currentKey), () => {
    const input = prompt(t().keyPrompt, currentKey);
    if (input && /^[a-zA-Z]$/.test(input)) {
      GM_setValue('hotkey', input.toUpperCase());
      location.reload();
    }
  });

  // 2. 設定連拍間隔
  GM_registerMenuCommand(t().intervalSetting(interval), () => {
    const input = prompt(t().intervalPrompt, interval);
    const val = parseInt(input, 10);
    if (!isNaN(val) && val >= MIN_INTERVAL) {
      GM_setValue('interval', val);
      location.reload();
    }
  });

  // 3. 切換語言
  GM_registerMenuCommand(t().langToggle, () => {
    const newLang = lang === 'EN' ? 'ZH' : 'EN';
    GM_setValue('lang', newLang);
    location.reload();
  });

  injectUI();
})();