// ==UserScript==
// @name         Arca Live Image and Video Downloader
// @name:zh-TW   Arca Live 圖片與影片下載器
// @name:zh-CN   Arca Live 图片和视频下载器
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Supports downloading images, GIFs, MP4s, and WEBMs from Arca Live posts (using GM_download to bypass CORS), with automatic filename formatting as "Board_PostID_0001~n". Offers both fast download and sequential download modes.And WebP to PNG conversion mode
// @description:zh-TW 支援下載 Arca Live 貼文中的圖片、GIF、MP4、WEBM（使用 GM_download 繞過 CORS）並自動命名為「板塊_編號_0001~n」格式，快速下載、逐一下載兩種模式，以及Webp轉png模式。
// @description:zh-CN 支援下载 Arca Live 贴文中的图片、GIF、MP4、WEBM（使用 GM_download 绕过 CORS）并自动命名为「板块_编号_0001~n」格式，快速下载、逐一下载两种模式，以及Webp转png模式。
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://arca.live/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      *.arca.live
// @connect      arca.live
// @connect      namu.la
// @connect      *.twimg.com
// @connect      *.twitter.com
// @connect      *.x.com
// @connect      *.pximg.net
// @connect      *.pixiv.net
// @connect      i.imgur.com
// @connect      *.discordapp.com
// @connect      *.discordapp.net
// @connect      *.postype.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545416/Arca%20Live%20Image%20and%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545416/Arca%20Live%20Image%20and%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 輔助函式：延遲執行，用於控制下載頻率
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * 功能：根據檔案的真實 MIME 類型回傳正確的副檔名
   * 目的：防止網址副檔名與實際內容不符，導致 Photoshop (PS) 或 SAI 無法開啟檔案
   */
  const getExtFromMime = (mime, defaultExt) => {
    const map = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'image/x-icon': 'ico',
      'image/bmp': 'bmp'
    };
    return map[mime] || defaultExt;
  };

  /**
   * 功能：利用 Canvas 將 WebP 的 Blob 轉換為 PNG 格式的 Base64 字串
   * 觸發條件：使用者開啟「WebP轉PNG」功能且檔案確實為 WebP
   */
  const convertBlobToPngBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0); // 將圖片繪製到畫布上
        const dataUrl = canvas.toDataURL('image/png'); // 導出為 PNG 數據
        URL.revokeObjectURL(objUrl); // 釋放記憶體
        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject('圖片解析失敗');
      };
      img.src = objUrl;
    });
  };

  /**
   * 功能：解析目前網址，提取板塊名稱與貼文 ID
   * 用於檔案命名格式：板塊_ID_序號
   */
  const parseBoardInfo = () => {
    const match = location.pathname.match(/^\/b\/([^/]+)\/(\d+)/);
    return { board: match ? match[1] : 'unknown', postId: match ? match[2] : 'unknown' };
  };

  /**
   * 功能：遍歷貼文內容，收集所有圖片與影片網址
   * 排除：class 為 arca-emoticon 的表情貼（包含靜態與動態）
   */
  const collectMediaUrls = () => {
    const urls = new Set(); // 使用 Set 避免網址重複
    const article = document.querySelector('.article-body');
    if (!article) return [];

    // 1. 處理圖片：優先選取 data-src (原圖)，排除表情貼
    article.querySelectorAll('img:not(.arca-emoticon)').forEach(img => {
      let src = img.getAttribute('data-src') || img.src;
      if (src && !src.startsWith('data:')) {
        // Arca Live 特有邏輯：去除縮圖參數並強制指定獲取原圖 (orig)
        if (src.includes('media.arca.live')) {
          src = src.split('?')[0] + '?type=orig';
        } else {
          src = new URL(src, location.href).href; // 轉換相對路徑為絕對路徑
        }
        urls.add(src);
      }
    });

    // 2. 處理影片：排除帶有表情貼類名的影片
    article.querySelectorAll('video:not(.arca-emoticon)').forEach(v => {
      const vSrc = v.src || v.getAttribute('src') || (v.querySelector('source') && v.querySelector('source').src);
      if (vSrc) urls.add(new URL(vSrc, location.href).href);
    });

    return Array.from(urls);
  };

  /**
   * 下載核心函式：管理下載流程、處理格式轉換與副檔名校準
   */
  const downloadMedia = async (urls, button, fastMode, convertMode) => {
    const { board, postId } = parseBoardInfo();
    let success = 0;
    const total = urls.length;
    const tasks = [];

    for (let i = 0; i < total; i++) {
      const url = urls[i];
      // 預設檔案名稱：板塊_貼文ID_四位數流水號
      const filenameBase = `${board}_${postId}_${String(i + 1).padStart(4, '0')}`;

      // 單一媒體處理任務
      const task = async () => {
        return new Promise((resolveTask) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob", // 以 Blob 方式抓取原始數據以利格式判定
            onload: async (response) => {
              const blob = response.response;
              const mime = blob.type; // 獲取伺服器回傳的真實 MIME
              let finalUrl = url;

              // 獲取網址中的副檔名作為備份
              let urlExt = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
              let finalExt = getExtFromMime(mime, urlExt ? urlExt[1].toLowerCase() : 'jpg');

              // 判斷是否轉換 WebP 為 PNG
              if (convertMode && mime === 'image/webp') {
                try {
                  const base64 = await convertBlobToPngBase64(blob);
                  finalUrl = base64;
                  finalExt = 'png';
                } catch (e) { console.error('轉換 PNG 失敗', e); }
              } else if (mime.startsWith('image/')) {
                // 非 WebP 圖片或不轉換時，將 Blob 轉為 DataURL 確保檔案正確命名與下載
                const reader = new FileReader();
                reader.onloadend = () => {
                  GM_download({
                    url: reader.result,
                    name: `${filenameBase}.${finalExt}`,
                    onload: () => { success++; button.textContent = `下載中 (${success}/${total})`; resolveTask(); },
                    onerror: () => resolveTask()
                  });
                };
                reader.readAsDataURL(blob);
                return;
              }

              // 下載非圖片檔案（如影片）或已處理過的 DataURL
              GM_download({
                url: finalUrl,
                name: `${filenameBase}.${finalExt}`,
                onload: () => { success++; button.textContent = `下載中 (${success}/${total})`; resolveTask(); },
                onerror: () => resolveTask()
              });
            },
            onerror: () => resolveTask()
          });
        });
      };

      // 根據模式決定併行下載或逐一下載
      if (fastMode) {
        tasks.push(task());
        await sleep(100); // 快速模式下的小間隔
      } else {
        await task();
        await sleep(100); // 逐一下載模式下的較長間隔
      }
    }

    // 等待所有快速模式任務完成
    if (fastMode) await Promise.all(tasks);
    button.textContent = '✅ 下載完成';

    // 5 秒後恢復按鈕狀態
    setTimeout(() => {
      button.disabled = false;
      button.textContent = '📥 下載本頁媒體';
    }, 5000);
  };

  /**
   * UI 面板建構：建立下載按鈕與兩個切換開關（快速模式、WebP轉PNG）
   */
  const createControlPanel = (mainBtn) => {
    const container = document.createElement('div');
    container.style = 'position: relative; display: inline-block;';
    container.appendChild(mainBtn);

    const toggleWrapper = document.createElement('div');
    toggleWrapper.style = 'position: absolute; left: 100%; top: 0; display: flex; gap: 8px; margin-left: 10px;';

    let fastMode = false;
    let convertMode = false;

    // 建立開關的小按鈕
    const createToggle = (text) => {
      const t = document.createElement('div');
      t.textContent = `${text}：❌`;
      t.style = 'padding: 4px 10px; background: #343a40; color: #fff; border-radius: 6px; white-space: nowrap; font-size: 12px; cursor: pointer; user-select: none;';
      return t;
    };

    const fastToggle = createToggle('⚡ 快速模式');
    fastToggle.onclick = () => {
      fastMode = !fastMode;
      fastToggle.textContent = `⚡ 快速模式：${fastMode ? '✅' : '❌'}`;
      fastToggle.style.background = fastMode ? '#28a745' : '#343a40';
    };

    const webpToggle = createToggle('🖼️ WebP轉PNG');
    webpToggle.onclick = () => {
      convertMode = !convertMode;
      webpToggle.textContent = `🖼️ WebP轉PNG：${convertMode ? '✅' : '❌'}`;
      webpToggle.style.background = convertMode ? '#007bff' : '#343a40';
    };

    toggleWrapper.appendChild(fastToggle);
    toggleWrapper.appendChild(webpToggle);
    container.appendChild(toggleWrapper);

    // 回傳容器與狀態讀取函式
    return { wrapper: container, getFastMode: () => fastMode, getConvertMode: () => convertMode };
  };

  /**
   * 啟動函式：尋找插入點（收藏按鈕）並放置下載工具組
   */
  const insertButton = async () => {
    let scrapBtn = null;
    // 重試最多 50 次等待頁面渲染完成
    for (let i = 0; i < 50; i++) {
      scrapBtn = document.querySelector('form#scrapForm > button.scrap-btn');
      if (scrapBtn) break;
      await sleep(200);
    }
    if (!scrapBtn) return;

    const btn = document.createElement('button');
    btn.textContent = '📥 下載本頁媒體';
    btn.className = 'btn btn-arca btn-sm float-left mr-2';

    const { wrapper, getFastMode, getConvertMode } = createControlPanel(btn);

    // 下載按鈕點擊事件
    btn.onclick = async () => {
      btn.disabled = true;
      btn.textContent = '🔄 處理中...';
      const urls = collectMediaUrls();
      if (urls.length === 0) {
        alert('⚠️ 找不到媒體');
        btn.disabled = false;
        btn.textContent = '📥 下載本頁媒體';
        return;
      }
      // 開始下載程序
      await downloadMedia(urls, btn, getFastMode(), getConvertMode());
    };

    // 插入到收藏按鈕左側
    scrapBtn.parentElement.insertBefore(wrapper, scrapBtn);
  };

  // 初始化執行
  insertButton();
})();