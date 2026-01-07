// ==UserScript==
// @name         X/Twitter Clean-up & Wide Layout Display
// @name:zh-TW   X/Twitter 乾淨化 & 加寬版面顯示
// @name:zh-CN   X/Twitter 干净化 & 加宽版面显示
// @name:ja      X/Twitter クリーンアップ & ワイドレイアウト表示
// @name:ko      X/Twitter 깔끔하게 & 레이아웃 너비 확장
// @namespace    https://www.tampermonkey.net/
// @version      5.9
// @description  Hide unnecessary X menu items on the left (Bookmarks, Jobs, Communities, Business, Premium, Verified Organizations, Monetization, Ads) and right (Subscribe to Premium, Footer), Bottom right (floating message bar, Grok), Enlarge and customize the width of the tweet timeline, Custom Script Loading Speed. 
// @description:zh-TW  隱藏 X 多餘選單項目，左側（書籤、工作機會、社群、商業、Premium、已認證組織、營利、廣告）、右側（訂閱 Premium、頁尾欄目）、右下（浮動訊息欄、Grok），加大、自定義推文時間軸的寬度，自定義腳本加載速度
// @description:zh-CN  隐藏 X 多余选单项目，左侧（书签、工作机会、社群、商业、Premium、已认证组织、营利、广告）、右侧（订阅 Premium、页尾栏目）、右下（浮动讯息栏、Grok），加大、自定义推文时间轴的宽度，自定义脚本加载速度
// @description:ja  Xの不要なメニュー項目を左側（ブックマーク、求人、コミュニティ、ビジネス、Premium、認証済み組織、収益化、広告）および右側（Premiumの購読、フッター） 右下（フローティングメッセージバー、Grok）で非表示にし、 ツイートのタイムラインの幅を拡大し、カスタマイズする、カスタムスクリプトの読み込み速度。
// @description:ko  X(트위터)의 불필요한 메뉴 항목을 숨깁니다: 왼쪽(북마크, 채용 정보, 커뮤니티, 비즈니스, 프리미엄, 인증된 조직, 수익 창출, 광고), 오른쪽(프리미엄 구독, 푸터), 오른쪽 하단(메시지 창, Grok). 트윗 타임라인 너비 확장 및 스크립트 로딩 속도 사용자 설정 기능을 제공합니다. 
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545419/XTwitter%20Clean-up%20%20Wide%20Layout%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/545419/XTwitter%20Clean-up%20%20Wide%20Layout%20Display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===【0】排除特定頁面（訊息與設定頁）===
  const excludedPaths = ['/messages', '/settings'];
  if (excludedPaths.some(path => location.pathname.startsWith(path))) {
    return;
  }

  // ===【1】預設參數與變數讀取 ===
  const defaultWidth = 1200;
  const defaultDebounce = 0;

  // 讀取設定值
  let timelineWidth = GM_getValue('timelineWidth', defaultWidth);
  let debounceDelay = GM_getValue('debounceDelay', defaultDebounce);
  let hideLeftbar = GM_getValue('hideLeftbar', false);
  let hideSidebar = GM_getValue('hideSidebar', false);
  let fillCenter = GM_getValue('fillCenter', false);
  let hideMessageBar = GM_getValue('hideMessageBar', true);

  // ===【2】選單 ID 變數 (用於刪除舊選單) ===
  let menuIdLeft = null;
  let menuIdRight = null;
  let menuIdCenter = null;
  let menuIdMessage = null;
  let menuIdWidth = null;
  let menuIdDebounce = null;

  // ===【3】樣式應用函式 (獨立出來以便即時呼叫) ===

  function applyLeftbarToggle() {
    const leftbar = document.querySelector('header[role="banner"]');
    if (leftbar) {
        leftbar.style.display = hideLeftbar ? 'none' : '';
    }
  }

  function applySidebarToggle() {
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (sidebar) {
        sidebar.style.display = hideSidebar ? 'none' : '';
    }
  }

  // 寬度應用邏輯統一移至 cleanUpAndResize 處理，避免衝突

  // ===【4】註冊與刷新選單的核心函式 ===
  function registerMenus() {
    // 1. 清除舊選單
    if (menuIdLeft !== null) GM_unregisterMenuCommand(menuIdLeft);
    if (menuIdRight !== null) GM_unregisterMenuCommand(menuIdRight);
    if (menuIdCenter !== null) GM_unregisterMenuCommand(menuIdCenter);
    if (menuIdMessage !== null) GM_unregisterMenuCommand(menuIdMessage);
    if (menuIdWidth !== null) GM_unregisterMenuCommand(menuIdWidth);
    if (menuIdDebounce !== null) GM_unregisterMenuCommand(menuIdDebounce);

    // 2. 重新註冊選單

    // [左側欄開關]
    menuIdLeft = GM_registerMenuCommand(`${hideLeftbar ? '顯示' : '隱藏'}左側欄`, () => {
        hideLeftbar = !hideLeftbar;
        GM_setValue('hideLeftbar', hideLeftbar);
        applyLeftbarToggle();
        registerMenus();
    });

    // [右側欄開關]
    menuIdRight = GM_registerMenuCommand(`${hideSidebar ? '顯示' : '隱藏'}右側欄`, () => {
        hideSidebar = !hideSidebar;
        GM_setValue('hideSidebar', hideSidebar);
        applySidebarToggle();
        registerMenus();
    });

    // [中間欄填滿開關]
    menuIdCenter = GM_registerMenuCommand(`${fillCenter ? '取消' : '啟用'}中間欄填滿`, () => {
        fillCenter = !fillCenter;
        GM_setValue('fillCenter', fillCenter);

        if (fillCenter) {
            hideSidebar = true;
            hideLeftbar = true;
        } else {
            hideSidebar = false;
            hideLeftbar = false;
        }
        GM_setValue('hideSidebar', hideSidebar);
        GM_setValue('hideLeftbar', hideLeftbar);

        applyLeftbarToggle();
        applySidebarToggle();
        cleanUpAndResize();
        registerMenus();
    });

    // [訊息欄開關]
    menuIdMessage = GM_registerMenuCommand(`${hideMessageBar ? '顯示' : '隱藏'}右下訊息欄`, () => {
        hideMessageBar = !hideMessageBar;
        GM_setValue('hideMessageBar', hideMessageBar);
        cleanUpAndResize(); // 立即觸發更新樣式
        registerMenus();    // 更新選單文字
    });

    // [時間軸寬度設定]
    menuIdWidth = GM_registerMenuCommand(`設定：時間軸推文寬度 (目前 ${timelineWidth}px)`, () => {
        const input = prompt('請輸入時間軸推文寬度（600 ~ 3000 px）：', timelineWidth);
        const val = parseInt(input);
        if (!isNaN(val) && val >= 600 && val <= 3000) {
            timelineWidth = val;
            GM_setValue('timelineWidth', val);
            cleanUpAndResize();
            registerMenus();
        } else {
            alert('請輸入合理的數值（600 ~ 3000）');
        }
    });

    // [防抖設定]
    menuIdDebounce = GM_registerMenuCommand(`設定：防抖延遲 (目前 ${debounceDelay}ms)`, () => {
        const input = prompt('請輸入防抖延遲時間（0 表示關閉，1~300 表示啟用防抖）：', debounceDelay);
        const val = parseInt(input);
        if (!isNaN(val) && val >= 0 && val <= 300) {
            debounceDelay = val;
            GM_setValue('debounceDelay', val);
            location.reload();
        } else {
            alert('請輸入合理的數值（0 ~ 300）');
        }
    });
  }

  // ===【5】防抖函式封裝 ===
  function debounce(func, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // ===【6】主處理函式 ===
  function cleanUpAndResize() {
    try {
      // -- 隱藏左側多語系選單項目 --
      const labels = [
        '書籤', 'Bookmarks', 'ブックマーク', '书签', '북마크',
        '工作機會', 'Careers', '求人', '工作机会', '채용 정보',
        '社群', 'Communities', 'コミュニティ', '社区', '커뮤니티',
        '商業', '商业', 'ビジネス', 'Business', '비즈니스',
        'Premium', 'プレミアム',
        '已認證組織', 'Verified Orgs', '認証済み組織', '认证组织', '인증된 조직',
        '營利', 'Monetization', '収益化', '营利', '수익 창출',
        '廣告', 'Ads', '広告', '广告', '광고',
      ];
      document.querySelectorAll('nav[role="navigation"] div[dir="ltr"]').forEach(item => {
        const label = item.innerText?.trim();
        if (labels.includes(label)) {
          const top = item.closest('a, div[role="link"]');
          if (top) top.style.display = 'none';
        }
      });

      // -- 隱藏右上的「訂閱 Premium」多語系項目 --
      const subscribeLabels = [
          '訂閱 Premium',
          '订阅 Premium',
          'Subscribe to Premium',
          'プレミアムにサブスクライブ',
          'Premium 구독하기'
      ];

      subscribeLabels.forEach(label => {
          const targets = document.querySelectorAll(`[aria-label="${label}"]`);
          targets.forEach(el => {
              el.style.display = 'none';
          });
      });

      // -- 隱藏右側 Premium 推銷卡片 --
      const premiumCard = document.querySelector('.css-175oi2r[data-testid="super-upsell-UpsellCardRenderProperties"]');
      if (premiumCard) premiumCard.style.display = 'none';

      // -- 隱藏頁尾區塊 --
      const footerLabels = ['頁尾', 'Footer', '页脚', 'フッター', '바닥글'];
      document.querySelectorAll('nav[role="navigation"]').forEach(nav => {
        const label = nav.getAttribute('aria-label')?.trim();
        if (label && footerLabels.includes(label)) {
          nav.style.display = 'none';
        }
      });

      // -- 隱藏右下角浮動訊息欄 (改為根據變數判斷) --
      const messagePanels = document.querySelectorAll('#layers div.r-1jte41z');
      messagePanels.forEach(el => {
        // 如果 hideMessageBar 為 true，則隱藏 (none)；否則移除樣式 ('')，讓其恢復顯示
        el.style.display = hideMessageBar ? 'none' : '';
      });

      // === 寬度與填滿邏輯核心 ===

      // 1. 決定目標寬度
      const targetWidth = fillCenter ? '100%' : `${timelineWidth}px`;

      // 2. 加寬主內容區塊（外層）
      const main = document.querySelector('main.css-175oi2r');
      if (main) {
        Object.assign(main.style, {
          width: '100%',
          maxWidth: 'none',
          marginLeft: 'auto',
          marginRight: 'auto',
        });
      }

      // 3. 加寬推文容器 (內層)
      const containers = document.querySelectorAll('div.r-f8sm7e.r-13qz1uu.r-1ye8kvj');
      containers.forEach(el => {
        Object.assign(el.style, {
          width: targetWidth,
          maxWidth: 'none',
          marginLeft: 'auto',
          marginRight: 'auto',
        });
      });

      // 4. 特別針對 .r-113js5t
      document.querySelectorAll('.r-113js5t').forEach(el => {
          el.style.width = fillCenter ? '100%' : '';
      });

      // -- 推文操作列寬度繼承外層 --
      const actionBars = document.querySelectorAll('div.r-1kbdv8c');
      actionBars.forEach(el => {
        Object.assign(el.style, {
          width: '100%',
          maxWidth: 'none',
        });
      });

      // === 每次執行清理時，確保開關狀態正確 ===
      applyLeftbarToggle();
      applySidebarToggle();

    } catch (e) {
      console.error('腳本錯誤:', e);
    }
  }

  // ===【7】初始化執行 ===
  // 1. 註冊選單
  registerMenus();

  // 2. 啟用 MutationObserver
  const handler = debounceDelay >= 1 && debounceDelay <= 300
    ? debounce(cleanUpAndResize, debounceDelay)
    : cleanUpAndResize;

  const observer = new MutationObserver(handler);
  observer.observe(document.body, { childList: true, subtree: true });
})();