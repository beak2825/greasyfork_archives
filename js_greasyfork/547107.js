// ==UserScript==
// @name          巴哈動畫瘋 背景主題
// @namespace     k100466jerry
// @description   在 ani.gamer.com.tw 套用全頁背景圖，並將主題變數底色改為透明/半透明，讓背景透出。
// @author        k100466jerry
// @match         https://ani.gamer.com.tw/*
// @run-at        document-start
// @grant         none
// @version       2025.08.24.2243
// @downloadURL https://update.greasyfork.org/scripts/547107/%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B%20%E8%83%8C%E6%99%AF%E4%B8%BB%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/547107/%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B%20%E8%83%8C%E6%99%AF%E4%B8%BB%E9%A1%8C.meta.js
// ==/UserScript==

(function () {
  /** 取得背景圖清單（與你 Anime1 腳本一致的 key） */
  const picList = (() => {
    try {
      return JSON.parse(localStorage.getItem('背景圖片網址連結')) || [];
    } catch (e) {
      console.warn('[AnimeBG] 背景圖片網址連結 解析錯誤', e);
      return [];
    }
  })();

  /** 隨機圖片，預設一張備援 */
  const fallbackPic = 'https://imgur.com/fdKXU4N.png';
  const 背景圖片網址 = picList.length > 0
    ? picList[Math.floor(Math.random() * picList.length)]
    : fallbackPic;

  /** 核心樣式：
   *  - 用 body::before 放固定背景圖（不影響原本 layout）
   *  - 將常見底色變數覆蓋成透明 / 半透明
   *  - 把最外層容器也設為透明，避免把背景蓋掉
   */
  const css = `
    /* 1) 全站背景圖（固定＆cover） */
    html, body {
      background: transparent !important;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      background: #08090d url(${CSS.escape(背景圖片網址)}) no-repeat center top;
      background-attachment: fixed;
      background-size: cover;
      pointer-events: none;
    }

    /* 2) 暗色主題下，覆蓋各種底色變數為透明/半透明
          注意：這些變數原本都被拿去當 background-color 用，不能塞 url()
     */
    html[data-theme="dark"] {
      /* 基底底色改透明，讓圖片透出 */
      --anime-background-base: transparent !important;
      --anime-background-base-rgb: 0, 0, 0 !important;

      /* 提升層與實心背景給一點玻璃感半透明，保留可讀性 */
      --anime-background-elevated: rgba(0, 0, 0, 0.35) !important;
      --anime-background-fill: rgba(0, 0, 0, 0.35) !important;
      --anime-background-fill-rgb: 0, 0, 0 !important;

      --anime-bg-trans-light: rgba(255, 255, 255, 0.05) !important;
      --anime-bg-trans-first: rgba(255, 255, 255, 0.09) !important;
      --anime-bg-trans-second: rgba(255, 255, 255, 0.15) !important;
      --anime-bg-trans-third: rgba(255, 255, 255, 0.26) !important;
      --anime-bg-trans-heavy: rgba(0, 0, 0, 0.48) !important;

      --anime-bg-solid-elevated: rgba(0, 0, 0, 0.35) !important;
      --anime-bg-solid-hover: rgba(255, 255, 255, 0.08) !important;
      --anime-bg-solid-tippy: rgba(0, 0, 0, 0.55) !important;

      /* 卡片與導覽等常見容器底色 */
      --card-bg: rgba(0, 0, 0, 0.35) !important;
      --card-brand-bg: rgba(0, 0, 0, 0.35) !important;

      /* 邊框/分隔可以稍微淡一點 */
      --border-color: rgba(255, 255, 255, 0.18) !important;
      --border-strong: rgba(255, 255, 255, 0.28) !important;
      --seperator-light: rgba(255, 255, 255, 0.18) !important;
      --seperator-transparent: rgba(217, 217, 217, 0.15) !important;
      --seperator-solid: rgba(255, 255, 255, 0.22) !important;

      /* 文字顏色保持高對比 */
      --text-default-color: rgba(255, 255, 255, 0.95) !important;
      --text-secondary-color: rgba(235, 235, 245, 0.7) !important;
      --text-tertiary-color: rgba(235, 235, 245, 0.55) !important;
      --text-quaternary-color: rgba(235, 235, 245, 0.28) !important;
    }

    /* 3) 一些常見容器設為透明，避免自家 background 把圖蓋掉
         （類別名稱可能調整過，這裡挑常見 pattern；若官網 class 變動，再補規則）
     */
    #root, #__next, .container, .layout, .wrap, main, .main, .page, .app, .app-container,
    [role="main"], [class*="container"], [class*="content"], [class*="layout"] {
      background: transparent !important;
    }

    /* 表格/卡片半透明底、維持可讀性 */
    .card, [class*="card"], .panel, [class*="panel"], .block, [class*="block"] {
      background-color: rgba(0, 0, 0, 0.35) !important;
      backdrop-filter: blur(3px);
    }

    /* 表頭/標題字亮一點 */
    h1, h2, h3, h4, h5, h6 {
      color: rgba(255, 255, 255, 0.98) !important;
    }
    a { color: #a4e9ff !important; }
  `;


    const css2 = `
    /* 1) 全站背景圖（固定＆cover） */
    html, body {
      background: transparent !important;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      background: #08090d url(${CSS.escape(背景圖片網址)}) no-repeat center top;
      background-attachment: fixed;
      background-size: cover;
      pointer-events: none;
    }




  `;

  const style = document.createElement('style');
  style.setAttribute('data-userscript', 'bahamut-anime-background');
  style.textContent = css2;

  // 提前插入到 <head>，若 head 尚未生成則掛到 docElement，稍後再搬到 head
  (document.head || document.documentElement).appendChild(style);
  if (!document.head) {
    const mo = new MutationObserver(() => {
      if (document.head && style.parentNode !== document.head) {
        document.head.appendChild(style);
        mo.disconnect();
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
