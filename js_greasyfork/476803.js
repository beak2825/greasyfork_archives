// ==UserScript==
// @name         2025|暴力破解lurl&myptt密碼|自動帶入日期|可下載圖影片🚀|v3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  針對lurl與myptt的圖片帶入當天日期;開放下載圖片與影片(此部分僅支援lurl)
// @author       You
// @match        https://lurl.cc/*
// @match        https://myppt.cc/*
// @match        https://www.dcard.tw/f/sex/*
// @match        https://www.dcard.tw/f/sex
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lurl.cc
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/476803/2025%7C%E6%9A%B4%E5%8A%9B%E7%A0%B4%E8%A7%A3lurlmyptt%E5%AF%86%E7%A2%BC%7C%E8%87%AA%E5%8B%95%E5%B8%B6%E5%85%A5%E6%97%A5%E6%9C%9F%7C%E5%8F%AF%E4%B8%8B%E8%BC%89%E5%9C%96%E5%BD%B1%E7%89%87%F0%9F%9A%80%7Cv30.user.js
// @updateURL https://update.greasyfork.org/scripts/476803/2025%7C%E6%9A%B4%E5%8A%9B%E7%A0%B4%E8%A7%A3lurlmyptt%E5%AF%86%E7%A2%BC%7C%E8%87%AA%E5%8B%95%E5%B8%B6%E5%85%A5%E6%97%A5%E6%9C%9F%7C%E5%8F%AF%E4%B8%8B%E8%BC%89%E5%9C%96%E5%BD%B1%E7%89%87%F0%9F%9A%80%7Cv30.meta.js
// ==/UserScript==

/*
================================================================================
📋 程式執行流程：

A. 初始化階段
   A1. 載入外部資源（Toast通知庫）→ 
   A2. 初始化全域樣式 →
   A3. 判斷當前網站路由

B. 路由分發
   B1. Dcard路由 → 註冊連結攔截 → 延遲執行年齡確認 → 移除登入彈窗
   B2. Myptt路由 → 取得上傳日期 → 自動填入密碼 → 重新載入頁面  
   B3. Lurl路由  → 嘗試破解密碼 → 判斷內容類型 → 載入對應處理器

C. 功能執行
   C1. 影片處理 → 建立下載按鈕 → 替換原生播放器 → 綁定下載事件
   C2. 圖片處理 → 取得預載圖片 → 建立下載按鈕 → 插入頁面DOM
   C3. 密碼處理 → 解析上傳日期 → 設定Cookie值 → 自動重新載入

================================================================================
更新紀錄：
2025/09/19 v3.0 - 重構為functional風格，採用jQuery，改善架構
2025/09/19 v2.1 - 新增myptt密碼自動帶入
2025/07/29 v2.0 - 修復lurl邏輯改變問題
================================================================================
*/

(function ($) {
  "use strict";

  // ==================== 通用工具函數 ====================
  const Utils = {
    // 從日期字串提取月日（MMDD格式）
    extractMMDD: (dateText) => {
      const pattern = /(\d{4})-(\d{2})-(\d{2})/;
      const match = dateText.match(pattern);
      return match ? match[2] + match[3] : null;
    },

    // 取得URL查詢參數
    getQueryParam: (name) => {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    },

    // Cookie操作
    cookie: {
      get: (name) => {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
      },
      set: (name, value) => {
        document.cookie = `${name}=${value}; path=/`;
      },
    },

    // 顯示Toast通知
    showToast: (message, type = "success") => {
      if (typeof Toastify === "undefined") return;

      Toastify({
        text: message,
        duration: 5000,
        gravity: "top",
        position: "right",
        style: {
          background: type === "success" ? "#28a745" : "#dc3545",
        },
      }).showToast();
    },

    // 下載檔案（使用Blob）
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
  };

  // ==================== 資源載入器 ====================
  const ResourceLoader = {
    loadToastify: () => {
      // 載入CSS
      $("<link>", {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css",
      }).appendTo("head");

      // 載入JS
      $("<script>", {
        src: "https://cdn.jsdelivr.net/npm/toastify-js",
      }).appendTo("head");
    },

    loadCustomStyles: () => {
      $("<style>")
        .text(
          `
                .disabled-button {
                    background-color: #ccc !important;
                    color: #999 !important;
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `
        )
        .appendTo("head");
    },

    init: () => {
      ResourceLoader.loadToastify();
      ResourceLoader.loadCustomStyles();
    },
  };

  // ==================== Myptt處理器 ====================
  const MypttHandler = {
    getUploadDate: () => {
      const $dateSpan = $(".login_span").eq(1);
      if ($dateSpan.length === 0) return null;

      return Utils.extractMMDD($dateSpan.text());
    },

    autoFillPassword: () => {
      const date = MypttHandler.getUploadDate();
      if (!date) return;

      $("#pasahaicsword").val(date);
      $("#main_fjim60unBU").click();
      location.reload();
    },

    init: () => {
      $(document).ready(() => {
        MypttHandler.autoFillPassword();
      });
    },
  };

  // ==================== Dcard處理器 ====================
  const DcardHandler = {
    // 攔截Lurl連結點擊
    interceptLurlLinks: () => {
      $(document).on("click", 'a[href^="https://lurl.cc/"]', function (e) {
        e.preventDefault();

        const href = $(this).attr("href");
        const title = encodeURIComponent(document.title);

        window.open(`${href}?title=${title}`, "_blank");
      });
    },

    // 自動點選年齡確認
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

    // 移除登入提示並恢復捲動
    removeLoginModal: () => {
      $(".__portal").remove();
      $("body").css("overflow", "auto");
    },

    // 監聽路由變化（單頁應用）
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
      DcardHandler.interceptLurlLinks();
      DcardHandler.watchRouteChange();

      // 延遲執行（等待頁面載入）
      setTimeout(() => {
        DcardHandler.autoConfirmAge();
        DcardHandler.removeLoginModal();
      }, 3500);
    },
  };

  // ==================== Lurl處理器 ====================
  const LurlHandler = {
    // 密碼破解模組
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
        if (LurlHandler.passwordCracker.isPasswordCorrect()) {
          return false;
        }

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

    // 圖片下載模組
    pictureDownloader: {
      getImageUrl: () => {
        const $preloadLink = $('link[rel="preload"][as="image"]');
        return $preloadLink.attr("href") || null;
      },

      createDownloadButton: () => {
        const imageUrl = LurlHandler.pictureDownloader.getImageUrl();
        if (!imageUrl) return null;

        const $button = $("<button>", {
          text: "下載圖片",
          class: "btn btn-primary",
        });

        const $link = $("<a>", {
          href: imageUrl,
          download: "downloaded-image.jpg",
          css: { textDecoration: "none" },
        }).append($button);

        return $("<div>", { class: "col-12" }).append($link);
      },

      inject: () => {
        const $button = LurlHandler.pictureDownloader.createDownloadButton();
        if (!$button) return;

        const $targetRow = $(
          'div.row[style*="margin: 10px"][style*="border-style:solid"]'
        );
        if ($targetRow.length) {
          $targetRow.append($button);
        }
      },
    },

    // 影片下載模組
    videoDownloader: {
      getVideoUrl: () => {
        const $source = $("source").first();
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

        // 清理原始控制項
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

        // 綁定點擊事件
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
        const $button = LurlHandler.videoDownloader.createDownloadButton();
        if (!$button) return;

        const $h2List = $("h2");

        if ($h2List.length === 3) {
          // 建立新的標題區塊
          const $header = $("<h2>", {
            text: "✅助手啟動",
            css: {
              color: "white",
              textAlign: "center",
              marginTop: "25px",
            },
          });

          $("#vjs_video_3").before($header);
          $header.append($button);
        } else {
          // 附加到現有標題
          $h2List.first().append($button);
        }
      },
    },

    // 內容類型判斷
    detectContentType: () => {
      return $("video").length > 0 ? "video" : "picture";
    },

    init: () => {
      // 先嘗試密碼破解
      LurlHandler.passwordCracker.init();

      // 頁面載入完成後處理內容
      $(window).on("load", () => {
        const contentType = LurlHandler.detectContentType();

        if (contentType === "video") {
          LurlHandler.videoDownloader.inject();
          LurlHandler.videoDownloader.replacePlayer();
        } else {
          LurlHandler.pictureDownloader.inject();
        }
      });
    },
  };

  // ==================== 路由系統 ====================
  const Router = {
    routes: {
      "myppt.cc": MypttHandler,
      "dcard.tw/f/sex": DcardHandler,
      "lurl.cc": LurlHandler,
    },

    getCurrentRoute: () => {
      const url = window.location.href;

      for (const [pattern, handler] of Object.entries(Router.routes)) {
        if (url.includes(pattern)) {
          return handler;
        }
      }

      return null;
    },

    dispatch: () => {
      const handler = Router.getCurrentRoute();

      if (handler) {
        console.log(`路由匹配成功: ${handler.constructor?.name || "Handler"}`);
        handler.init();
      } else {
        console.log("未匹配到任何路由");
      }
    },
  };

  // ==================== 主程式入口 ====================
  const Main = {
    init: () => {
      // 載入資源
      ResourceLoader.init();

      // 分發路由
      Router.dispatch();
    },
  };

  // 啟動應用
  $(document).ready(() => {
    Main.init();
  });
})(jQuery);
