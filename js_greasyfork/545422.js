// ==UserScript==
// @name         AniGamer Screenshot Helper
// @name:zh-TW   動畫瘋截圖助手
// @name:zh-CN   动画疯截图助手
// @namespace    https://www.tampermonkey.net/
// @version      2.3
// @description  AniGamer Screenshot Tool – supports hotkey capture, burst mode, customizable hotkeys, burst interval settings, and menu language switch between Chinese and English.
// @description:zh-TW 動畫瘋截圖工具，支援快捷鍵截圖、連拍模式，自定義快捷鍵、連拍間隔設定、中英菜單切換
// @description:zh-CN 动画疯截图工具，支援快捷键截图、连拍模式，自定义快捷键、连拍间隔设定、中英菜单切换
// @author       Hzbrrbmin + ChatGPT
// @match        https://ani.gamer.com.tw/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545422/AniGamer%20Screenshot%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545422/AniGamer%20Screenshot%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 預設快捷鍵
  const DEFAULT_SHORTCUT = 'S';
  // 預設連拍間隔（毫秒）
  const DEFAULT_INTERVAL = 1000;
  // 最小連拍間隔（毫秒）
  const MIN_INTERVAL = 100;

  // 多語系字典
  const i18n = {
    EN: {
      langSwitch: 'LANG EN',
      setKey: key => `Set Shortcut Key (Current: ${key})`,
      setInterval: ms => `Set Burst Interval (Current: ${ms}ms)`,
      inputKey: 'Enter a new shortcut key (one character):',
      inputInterval: 'Enter new burst interval in ms (min: 100):',
      invalidInterval: 'Invalid input. Must be ≥ 100.'
    },
    ZH: {
      langSwitch: '語言 中文',
      setKey: key => `設定快捷鍵（目前：${key}）`,
      setInterval: ms => `設定連拍間隔（目前：${ms}ms）`,
      inputKey: '請輸入新的截圖快捷鍵（單一字母）：',
      inputInterval: '請輸入新的連拍間隔（單位：毫秒，最小值：100）：',
      invalidInterval: '請輸入一個不小於 100 的有效數字。'
    }
  };

  // 取得目前設定（語言、快捷鍵、連拍間隔）
  function getSettings() {
    return {
      lang: GM_getValue('lang', 'EN'),
      shortcutKey: GM_getValue('screenshotKey', DEFAULT_SHORTCUT),
      interval: parseInt(GM_getValue('burstInterval', DEFAULT_INTERVAL), 10)
    };
  }

  // 產生檔名：影片標題_小時_分鐘_秒_毫秒_解析度.png
  function generateFilename(video, canvas) {
    // 補零用
    const pad = (n, len = 2) => n.toString().padStart(len, '0');
    const time = video.currentTime;
    const h = pad(Math.floor(time / 3600));
    const m = pad(Math.floor((time % 3600) / 60));
    const s = pad(Math.floor(time % 60));
    const ms = pad(Math.floor((time % 1) * 1000), 3);
    // 取得網頁標題並移除非法字元
    const rawTitle = document.title;
    const cleanedTitle = rawTitle.replace(/[\s\\/:*?"<>|]/g, '_');
    // 解析度
    const resolution = `${canvas.width}x${canvas.height}`;
    // 修改命名規則：影片標題_小時_分鐘_秒_毫秒_解析度
    return `${cleanedTitle}_${h}_${m}_${s}_${ms}_${resolution}.png`;
  }

  // 截圖主程式
  function captureScreenshot() {
    const video = document.querySelector('video');
    // 若找不到影片或影片未載入完成則不執行
    if (!video || video.readyState < 2) return;

    // 建立 canvas 並繪製當前影像
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 產生檔名
    const filename = generateFilename(video, canvas);

    // 轉成 blob 並觸發下載
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      // 延遲釋放 blob，避免尚未下載即釋放
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  }

  // 綁定快捷鍵與連拍事件
  (function bindHotkeys() {
    let isPressing = false;   // 是否正在按壓
    let burstTimer = null;    // 連拍計時器

    window.addEventListener('keydown', e => {
      const { shortcutKey, interval } = getSettings();
      // 按下自訂快捷鍵且未重複觸發時
      if (e.key.toUpperCase() === shortcutKey.toUpperCase() && !isPressing) {
        isPressing = true;
        captureScreenshot();
        burstTimer = setInterval(captureScreenshot, interval);
      }
    });

    window.addEventListener('keyup', e => {
      const { shortcutKey } = getSettings();
      // 放開自訂快捷鍵時停止連拍
      if (e.key.toUpperCase() === shortcutKey.toUpperCase()) {
        isPressing = false;
        if (burstTimer) clearInterval(burstTimer);
      }
    });
  })();

  // 劇院模式切換快捷鍵 (~ 或 `)
  (function bindTheaterToggle() {
    window.addEventListener('keydown', e => {
      // 檢查是否按下 ` 或 ~ 鍵（同一鍵位）
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();

        // 嘗試取得目前模式的切換按鈕
        const enterTheaterBtn = document.querySelector(
          'button.vjs-indent-button.vjs-control.vjs-show-tip[title="劇院模式 (T)"]'
        );
        const exitTheaterBtn = document.querySelector(
          'button.vjs-indent-button.vjs-control.vjs-show-tip.vjs-indent-enable.fullwindow-close[title="一般模式 (T)"]'
        );

        if (exitTheaterBtn) {
          // 已在劇院模式 → 點擊退出
          exitTheaterBtn.click();
          console.log('🎞️ 已退出劇院模式');
        } else if (enterTheaterBtn) {
          // 在一般模式 → 點擊進入
          enterTheaterBtn.click();
          console.log('🎬 已進入劇院模式');
        } else {
          console.warn('⚠️ 找不到劇院模式切換按鈕，可能頁面尚未完全載入。');
        }
      }
    });
  })();

  // 註冊油猴右上角選單
  (function registerMenu() {
    // 動態取得目前語系與設定
    function t() {
      const { lang, shortcutKey, interval } = getSettings();
      return { ...i18n[lang], shortcutKey, interval, lang };
    }

    // 設定快捷鍵
    GM_registerMenuCommand(t().setKey(t().shortcutKey), () => {
      const input = prompt(t().inputKey, t().shortcutKey);
      // 僅接受單一字元
      if (input && input.length === 1) {
        GM_setValue('screenshotKey', input.toUpperCase());
        location.reload(); // 直接重新整理，不跳提示
      }
    });

    // 設定連拍間隔
    GM_registerMenuCommand(t().setInterval(t().interval), () => {
      const input = prompt(t().inputInterval, t().interval);
      const newVal = parseInt(input, 10);
      if (!isNaN(newVal) && newVal >= MIN_INTERVAL) {
        GM_setValue('burstInterval', newVal);
        location.reload(); // 直接重新整理，不跳提示
      } else {
        alert(t().invalidInterval); // 僅錯誤時提示
      }
    });

    // 語言切換
    GM_registerMenuCommand(t().langSwitch, () => {
      const newLang = t().lang === 'EN' ? 'ZH' : 'EN';
      GM_setValue('lang', newLang);
      location.reload();
    });
  })();

})();