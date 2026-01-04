// ==UserScript==
// @name         New Bahamut Cleaner & Content Widening
// @name:zh-TW   新版巴哈姆特乾淨化 & 擴寬顯示區域
// @name:zh-CN   新版巴哈姆特干净化 & 扩宽显示区域
// @namespace    https://www.tampermonkey.net/
// @version      6.4
// @description  Cleans up ads on the new version of Bahamut (Homepage, GNN News, and Forum), widens the content display area (Homepage, GNN News, and Forum), and removes the footer and unnecessary floating elements.
// @description:zh-TW 清理新版巴哈姆特的廣告(首頁、GNN新聞、哈拉區)、擴寬顯示區域(首頁、GNN新聞、哈拉區)、移除頁腳與無用的浮動區塊
// @description:zh-CN 清理新版巴哈姆特的广告(首页、GNN新闻、哈拉区)、扩宽显示区域(首页、GNN新闻、哈拉区)、移除页脚与无用的浮动区块
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://www.gamer.com.tw/*
// @match        https://gnn.gamer.com.tw/*
// @match        https://forum.gamer.com.tw/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545423/New%20Bahamut%20Cleaner%20%20Content%20Widening.user.js
// @updateURL https://update.greasyfork.org/scripts/545423/New%20Bahamut%20Cleaner%20%20Content%20Widening.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==========================================
  // 1. 設定管理模組 (讀取與預設值)
  // ==========================================
  const config = {
    homeWidth: GM_getValue('homeWidth', '1400px'), // 首頁預設寬度
    gnnWidth: GM_getValue('gnnWidth', '1600px'),   // GNN 預設寬度
    postWidth: GM_getValue('postWidth', '1600px'), // 文章頁預設寬度
    listWidth: GM_getValue('listWidth', '1600px'), // 列表頁預設寬度
  };

  // 輔助函式：自動補上 'px' 單位
  const formatUnit = (val) => {
    if (!val) return null;
    val = val.trim();
    return /^\d+$/.test(val) ? val + 'px' : val;
  };

  // ==========================================
  // 2. 樣式即時應用函式 (負責修改畫面寬度)
  // ==========================================

  // [首頁] 寬度應用
  const applyHomeWidth = (width) => {
    const mainCenter = document.querySelector('.main-container__center');
    if (mainCenter) {
      mainCenter.style.maxWidth = width;
    }
  };

  // [文章頁 C.php / Co.php] 寬度應用
  const applyPostWidth = (width) => {
    // 檢查是否已存在自定義樣式標籤，若無則建立
    let style = document.getElementById('custom-post-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'custom-post-style';
      document.head.appendChild(style);
    }
    // 寫入 CSS 規則
    style.textContent = `
      .c-section__main {
        float: right;
        width: ${width};
        text-align: left;
        box-sizing: border-box;
      }
      #BH-slave {
        width: 100px !important;
      }
      .c-section__main img {
        max-width: 100%;
        height: auto;
        width: auto !important;
        image-rendering: auto;
      }
      .c-article__content img,
      .c-article__content a.photoswipe-image img,
      .c-post__body img {
        max-width: 100%;
        height: auto;
        display: block;
      }
      .c-article__content a.photoswipe-image {
        display: inline-block;
        max-width: 100%;
      }
    `;

    // 配合寬度調整外層容器
    const bhWrapper = document.querySelector('#BH-wrapper');
    if (bhWrapper) bhWrapper.style.width = '100%';
    const bhMaster = document.querySelector('#BH-master');
    if (bhMaster) bhMaster.style.width = 'auto';
  };

  // [列表頁 B.php] 寬度應用
  const applyListWidth = (width) => {
    const bhMaster = document.querySelector('#BH-master');
    if (bhMaster) bhMaster.style.width = width;

    const bhWrapper = document.querySelector('#BH-wrapper');
    if (bhWrapper) bhWrapper.style.width = '100%';
  };

  // [GNN 新聞] 寬度應用 (修正置中)
  const applyGNNWidth = (width) => {
    const bhWrapper = document.querySelector('div#BH-wrapper');
    if (bhWrapper) {
      // 將自定義寬度應用在 Wrapper 上，並透過 margin auto 置中
      bhWrapper.style.width = width;
      bhWrapper.style.maxWidth = '100%'; // 防止小螢幕破版
      bhWrapper.style.margin = '0 auto'; // 確保置中
    }

    const bhMaster = document.querySelector('div#BH-master');
    if (bhMaster) {
      // 內部區塊填滿 Wrapper 即可
      bhMaster.style.width = '100%';
      bhMaster.style.float = 'none'; // 防止浮動影響置中
    }

    const gnTopimg = document.querySelector('div#BH-master div.GN-topimg');
    if (gnTopimg) {
      gnTopimg.style.width = '100%';
    }
  };

  // ==========================================
  // 3. 註冊 Tampermonkey 選單 (含選單排序)
  // ==========================================
  const menuIds = {};

  function registerMenus() {
    // 通用註冊函式
    const addMenu = (key, title, promptText, applyFn) => {
        if (menuIds[key]) {
            GM_unregisterMenuCommand(menuIds[key]);
        }
        menuIds[key] = GM_registerMenuCommand(`${title} (目前: ${config[key]})`, () => {
            const input = prompt(promptText, config[key]);
            const formatted = formatUnit(input);
            if (formatted) {
                GM_setValue(key, formatted); // 儲存
                config[key] = formatted;     // 更新記憶體變數
                applyFn(formatted);          // 即時生效
                registerMenus();             // 更新選單顯示數值
            }
        });
    };

    // [選單排序] 依序為：首頁 -> GNN -> 列表 -> 文章
    addMenu('homeWidth', '首頁寬度', '請輸入首頁寬度 (輸入純數字將自動預設為 px，例如 1400):', applyHomeWidth);
    addMenu('gnnWidth', 'GNN 新聞寬度', '請輸入 GNN 內容寬度 (輸入純數字將自動預設為 px，例如 1600):', applyGNNWidth);
    addMenu('listWidth', '哈拉區 B.php寬度', '請輸入列表頁總寬度 (輸入純數字將自動預設為 px，例如 1600):', applyListWidth);
    addMenu('postWidth', '哈拉區 C.php寬度', '請輸入文章頁內容寬度 (輸入純數字將自動預設為 px，例如 1600):', applyPostWidth);
  }

  registerMenus();

  // ==========================================
  // 4. 清理與優化模組 (各頁面邏輯)
  // ==========================================

  // --- 首頁清理 ---
  const cleanBahaAds = () => {
    // 移除各類廣告區塊
    const bannerImg = document.querySelector('#adunit img[alt="超級看板廣告"]');
    if (bannerImg) {
      const adContainer = bannerImg.closest('div.GoogleActiveViewElement');
      if (adContainer) adContainer.remove();
    }

    const gapContainer = document.querySelector('#billboardAd.BH-banner--lg');
    if (gapContainer) gapContainer.remove();

    const rightContainer = document.querySelector('.main-container__right');
    if (rightContainer) rightContainer.remove();

    const fixedRightLinks = document.querySelectorAll('div.fixed-right div.column a.fixed-right__link');
    fixedRightLinks.forEach(link => link.remove());

    // 應用首頁寬度
    applyHomeWidth(config.homeWidth);

    // 處理文章列表間廣告
    const postPanel = document.querySelector('#postPanel.section-index');
    if (postPanel) {
      const adWrappers = postPanel.querySelectorAll('.ad__wrapper');
      adWrappers.forEach(ad => {
        if (ad.parentElement?.children.length > 1) {
          ad.style.display = 'none';
        }
      });
    }

    // 補回圖片預覽容器 (避免報錯)
    if (!document.querySelector('div.pswp')) {
      const pswp = document.createElement('div');
      pswp.className = 'pswp';
      document.body.appendChild(pswp);
    }

    const centerBanner = document.querySelector('div.main-index__content div.BH-banner.section-index');
    if (centerBanner) centerBanner.remove();

    const ecSection = document.querySelector('.section-index.section-ec');
    if (ecSection) ecSection.remove();

    const footer = document.querySelector('footer.main-container__footer');
    if (footer) footer.remove();
  };

  // --- GNN 新聞清理 ---
  const cleanGNN = () => {
    // 移除多餘廣告與區塊
    const shop = document.querySelector('div#shop.lazyloaded');
    if (shop) shop.remove();

    const banner4gamer = document.querySelector('div#banner-4gamer');
    if (banner4gamer) banner4gamer.remove();

    const gptBanner = document.querySelector('div#div-gpt-ad-banner');
    if (gptBanner) gptBanner.remove();

    const googleImageDiv = document.querySelector('div#google_image_div.GoogleActiveViewElement');
    if (googleImageDiv) googleImageDiv.remove();

    document.querySelectorAll('div.GN-lbox2B').forEach(el => {
      const id = el.id || '';
      const html = el.innerHTML;
      const isAd = /ad|ads|gpt|google/i.test(id) || /google_ads_iframe|gpt|doubleclick|adservice|googlesyndication/i.test(html);
      if (isAd) el.remove();
    });

    const flySalve = document.querySelector('div#flySalve');
    if (flySalve) flySalve.remove();

    const bhSlave = document.querySelector('div#BH-slave');
    if (bhSlave) bhSlave.remove();

    // 應用 GNN 寬度
    applyGNNWidth(config.gnnWidth);
  };

  // --- 單篇文章 (C.php) 廣告清理 ---
  const cleanPostHeaderAds = () => {
    document.querySelectorAll('div.c-post__header').forEach(adBlock => {
      const hasAd = adBlock.querySelector(
        'iframe[id^="google_ads_iframe"], iframe[src*="ads"], div[id^="google_ads_iframe"]'
      );
      if (hasAd) adBlock.remove();
    });
  };

  const startPostHeaderAdCleaner = () => {
    setInterval(() => {
      cleanPostHeaderAds();
    }, 3000);
  };

  // --- 哈拉區通用清理 ---
  const cleanForumAds = () => {
    const marqueeAd = document.querySelector('#BH-master marquee#ieslider');
    if (marqueeAd) marqueeAd.remove();

    document.querySelectorAll('form div.b-list-wrap table.b-list tbody tr.b-list__row')
      .forEach(row => {
        if (row.querySelector('td.b-list_ad')) row.remove();
      });

    ['div#div-gpt-ad-banner', 'div#google_image_div.GoogleActiveViewElement', 'div#flySalve', 'div#BH-master div.forum-ad_top']
      .forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.remove();
      });

    if (location.pathname === '/search.php') return;

    // 強力移除含有廣告關鍵字的 div
    document.querySelectorAll('div').forEach(div => {
      const id = div.id || '';
      const className = div.className || '';
      const html = div.innerHTML;
      const isAdLike = /ad|ads|gpt|google/i.test(id + ' ' + className);
      const containsAdContent = /google_ads_iframe|gpt|doubleclick|adservice|googlesyndication/i.test(html);

      if (isAdLike && containsAdContent) {
        div.remove();
      }
    });
  };

  // --- 哈拉區文章頁 (C.php) 優化 ---
  const enhanceForumPost = () => {
    applyPostWidth(config.postWidth);
  };

  // --- 哈拉區列表頁 (B.php) 優化 ---
  const enhanceForumList = () => {
    applyListWidth(config.listWidth);

    // 注入列表頁專用 CSS
    if (!document.getElementById('custom-list-style')) {
        const style = document.createElement('style');
        style.id = 'custom-list-style';
        style.textContent = `
        .b-imglist-wrap03 .b-list__main,
        .b-imglist-wrap03 .b-list-item .b-list__main {
            max-width: 100%;
        }
        .b-imglist-wrap03 .imglist-text {
            display: inline-block;
            width: 1100px;
            vertical-align: top;
        }
        `;
        document.head.appendChild(style);
    }
  };

  // ==========================================
  // 5. 執行與監聽 (MutationObserver)
  // ==========================================
  const delay = 100;

  // 防抖動監聽函式
  function observeWithDebounce(target, callback, delay = 100) {
    if (!target) return;
    let timer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(callback, delay);
    });
    observer.observe(target, { childList: true, subtree: true });
    return observer;
  }

  function initPage({ hostname, callback, observeSelector }) {
    if (location.hostname !== hostname) return;
    setTimeout(callback, delay);
    const target = document.querySelector(observeSelector);
    observeWithDebounce(target, callback, delay);
  }

  // --- 根據網址執行對應邏輯 ---

  // 1. 首頁 (www.gamer.com.tw)
  initPage({
    hostname: 'www.gamer.com.tw',
    callback: () => cleanBahaAds?.(),
    observeSelector: '.main-index__content'
  });

  // 2. 新聞 (gnn.gamer.com.tw)
  initPage({
    hostname: 'gnn.gamer.com.tw',
    callback: () => cleanGNN?.(),
    observeSelector: 'div#BH-wrapper'
  });

  // 3. 哈拉區 (forum.gamer.com.tw)
  if (location.hostname === 'forum.gamer.com.tw') {
    setTimeout(() => {
      cleanForumAds();

      const pathname = location.pathname;
      const searchParams = new URLSearchParams(location.search);

      // 判斷是否為文章頁 (C.php 或 Co.php)
      const isPostPage = (pathname === '/C.php' && searchParams.has('bsn') && searchParams.has('snA')) ||
                         (pathname === '/Co.php' && searchParams.has('bsn'));

      if (isPostPage) {
        enhanceForumPost();
        cleanPostHeaderAds();
        observeWithDebounce(
          document.querySelector('.c-section__main'),
          cleanPostHeaderAds,
          delay
        );
        startPostHeaderAdCleaner();
      }

      if (pathname === '/B.php' && searchParams.has('bsn')) {
        enhanceForumList();
      }
    }, delay);

    observeWithDebounce(
      document.querySelector('form div.b-list-wrap'),
      cleanForumAds,
      delay
    );
  }
})();