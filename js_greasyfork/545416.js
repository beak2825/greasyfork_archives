// ==UserScript==
// @name         Arca Live Image and Video Downloader
// @name:zh-TW   Arca Live 圖片與影片下載器
// @name:zh-CN   Arca Live 图片和视频下载器
// @namespace    http://tampermonkey.net/
// @version      3.1
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

  // 延遲工具函式：用於控制下載頻率，避免請求過快被封鎖
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * 功能：將 WebP 格式圖片轉成 PNG 格式的 Base64 字串
   * 原理：透過 GM_xmlhttpRequest 抓取原始數據，再利用 Canvas 重新繪製導出
   */
  const convertWebpToBase64 = async (url) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob", // 以二進位數據接收
        onload: (response) => {
          const blob = response.response;
          // 檢查 MIME 類型是否為 webp，若不是則跳過不處理
          if (blob.type !== 'image/webp' && !url.toLowerCase().includes('webp')) {
            reject('Not a WebP image');
            return;
          }
          const img = new Image();
          const objUrl = URL.createObjectURL(blob);
          img.onload = () => {
            // 建立虛擬畫布進行轉換
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // 將畫布內容轉成 PNG 的 Base64 編碼，解決 blob 網址下載權限問題
            const dataUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(objUrl); // 釋放記憶體
            resolve(dataUrl);
          };
          img.onerror = () => reject('Image load error');
          img.src = objUrl;
        },
        onerror: (err) => reject(err)
      });
    });
  };

  /**
   * 功能：解析當前頁面的板塊名稱 (Board) 與貼文編號 (Post ID)
   * 用於產生檔案名稱
   */
  const parseBoardInfo = () => {
    const match = location.pathname.match(/^\/b\/([^/]+)\/(\d+)/);
    return {
      board: match ? match[1] : 'unknown',
      postId: match ? match[2] : 'unknown'
    };
  };

  /**
   * 功能：收集文章內所有媒體網址
   * 包含：圖片 (優先取原圖)、影片、GIF 附件
   */
  const collectMediaUrls = () => {
    const urls = new Set(); // 使用 Set 避免重複抓取相同網址
    const article = document.querySelector('.article-body');
    if (!article) return [];

    // 處理圖片標籤
    article.querySelectorAll('img').forEach(img => {
      let src = img.getAttribute('data-src') || img.src;
      if (src && !src.startsWith('data:')) {
        // Arca Live 特有邏輯：去除縮圖參數並強制指定為 orig (原圖)
        if (src.includes('media.arca.live')) {
          src = src.split('?')[0] + '?type=orig';
        } else {
          // 處理相對路徑轉絕對路徑
          src = new URL(src, location.href).href;
        }
        urls.add(src);
      }
    });

    // 處理影片標籤 (video 及內含的 source)
    article.querySelectorAll('video, video source').forEach(v => {
      const vSrc = v.src || v.getAttribute('src');
      if (vSrc) urls.add(new URL(vSrc, location.href).href);
    });

    return Array.from(urls);
  };

  /**
   * 功能：封裝 GM_download 成為 Promise，方便配合 async/await 使用
   */
  const downloadFile = (url, name) => {
    return new Promise((resolve) => {
      GM_download({
        url: url,
        name: name,
        saveAs: false,
        onload: () => resolve(true),
        onerror: (err) => {
          console.error('Download failed:', err);
          resolve(false);
        }
      });
    });
  };

  /**
   * 核心下載邏輯：遍歷網址清單並執行下載
   * 參數：urls (清單), button (UI元件), fastMode (快速開關), convertMode (WebP轉PNG開關)
   */
  const downloadMedia = async (urls, button, fastMode, convertMode) => {
    const { board, postId } = parseBoardInfo();
    let success = 0;
    const total = urls.length;
    const tasks = [];

    for (let i = 0; i < total; i++) {
      const url = urls[i];
      // 解析副檔名，若無則預設 jpg
      const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
      let ext = (match && match[1]) ? match[1].toLowerCase() : 'jpg';
      // 檔名格式：板塊_編號_流水號 (四位數)
      const filenameBase = `${board}_${postId}_${String(i + 1).padStart(4, '0')}`;

      // 單個下載任務
      const task = async () => {
        let finalUrl = url;
        let finalExt = ext;

        // 判斷是否執行 WebP 轉 PNG
        if (convertMode && (ext === 'webp' || url.includes('type=orig'))) {
          try {
            const base64Data = await convertWebpToBase64(url);
            finalUrl = base64Data;
            finalExt = 'png';
          } catch (e) {
            // 轉換失敗則回歸原始 URL 下載
          }
        }

        const isOk = await downloadFile(finalUrl, `${filenameBase}.${finalExt}`);
        if (isOk) success++;
        button.textContent = `下載中 (${success}/${total})`;
      };

      if (fastMode) {
        // 快速模式：不等待完成即啟動下一個，僅加少量延遲
        tasks.push(task());
        await sleep(100);
      } else {
        // 逐張模式：嚴格等待上一張下載完畢後才繼續
        await task();
        await sleep(100);
      }
    }

    // 若為快速模式，須等所有 Promise 任務完成後再更新 UI
    if (fastMode) await Promise.all(tasks);
    button.textContent = '✅ 下載完成';

    // 5秒後恢復按鈕狀態，方便使用者再次下載 (例如貼文有更新)
    setTimeout(() => {
      button.disabled = false;
      button.textContent = '📥 下載本頁媒體';
    }, 5000);
  };

  /**
   * UI 建立：產生控制面板 (主按鈕 + 兩個模式開關)
   */
  const createControlPanel = (mainBtn) => {
    const container = document.createElement('div');
    container.style = 'position: relative; display: inline-block;';
    container.appendChild(mainBtn);

    // 開關按鈕容器
    const toggleWrapper = document.createElement('div');
    toggleWrapper.style = 'position: absolute; left: 100%; top: 0; display: flex; gap: 8px; margin-left: 10px;';

    let fastMode = false;
    let convertMode = false;

    // 通用開關按鈕產生器
    const createToggle = (text) => {
      const t = document.createElement('div');
      t.textContent = `${text}：❌`;
      t.style = 'padding: 4px 10px; background: #343a40; color: #fff; border-radius: 6px; white-space: nowrap; font-size: 12px; cursor: pointer; user-select: none;';
      return t;
    };

    // 快速模式按鈕點擊事件
    const fastToggle = createToggle('⚡ 快速模式');
    fastToggle.onclick = () => {
      fastMode = !fastMode;
      fastToggle.textContent = `⚡ 快速模式：${fastMode ? '✅' : '❌'}`;
      fastToggle.style.background = fastMode ? '#28a745' : '#343a40';
    };

    // WebP 轉換按鈕點擊事件
    const webpToggle = createToggle('🖼️ WebP轉PNG');
    webpToggle.onclick = () => {
      convertMode = !convertMode;
      webpToggle.textContent = `🖼️ WebP轉PNG：${convertMode ? '✅' : '❌'}`;
      webpToggle.style.background = convertMode ? '#007bff' : '#343a40';
    };

    toggleWrapper.appendChild(fastToggle);
    toggleWrapper.appendChild(webpToggle);
    container.appendChild(toggleWrapper);

    return {
      wrapper: container,
      getFastMode: () => fastMode,
      getConvertMode: () => convertMode
    };
  };

  /**
   * 啟動函式：將按鈕組插入到 Arca Live 的文章操作區
   */
  const insertButton = async () => {
    let scrapBtn = null;
    // 重試機制：等待 Arca Live 側邊選單載入完成
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

    btn.onclick = async () => {
      btn.disabled = true;
      btn.textContent = '🔄 收集媒體中...';
      const urls = collectMediaUrls();
      if (urls.length === 0) {
        alert('⚠️ 找不到媒體');
        btn.disabled = false;
        btn.textContent = '📥 下載本頁媒體';
        return;
      }
      // 開始下載流程
      await downloadMedia(urls, btn, getFastMode(), getConvertMode());
    };

    // 插入到原本「收藏」按鈕的旁邊
    scrapBtn.parentElement.insertBefore(wrapper, scrapBtn);
  };

  // 初始化執行
  insertButton();
})();