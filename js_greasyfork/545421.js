// ==UserScript==
// @name         Facebook Cleaner & Expand post area & Hide video titles during Facebook Reels playback.
// @name:zh-TW   Facebook 乾淨化 & 加寬貼文區 & 播放連續短片時隱藏影片標題
// @name:zh-CN   Facebook 乾淨化 & 加宽贴文区 & 播放连续短片时隐藏影片标题
// @name:ja      Facebookのクリーンアップ ＆ 投稿エリアの拡張 ＆ 連続ショート動画再生時のタイトル非表示
// @namespace    http://tampermonkey.net/
// @version      8.9
// @description  Remove unnecessary and rarely used feature buttons and elements from Facebook to make the entire page look cleaner and more streamlined, Widen the post area to improve the overall visual experience, Hide video titles during Facebook Reels playback.
// @description:zh-TW 刪除FaceBook多餘、不常使用的功能按鈕和要素，使整個頁面看起來更加簡潔，加寬貼文區，讓整體觀感更好，播放連續短片時隱藏影片標題
// @description:zh-CN 删除FaceBook多余、不常使用的功能按钮和要素，使整个页面看起来更加简洁，加宽贴文区，让整体观感更好，播放连续短片时隐藏影片标题
// @description:ja  Facebookの不要であまり使われない機能ボタンや要素を削除し、ページ全体をよりシンプルに見せます。投稿エリアを広げ、全体的な見た目や読みやすさを向上させます。連続ショート動画を再生する際には、動画のタイトルを非表示にします。
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://www.facebook.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545421/Facebook%20Cleaner%20%20Expand%20post%20area%20%20Hide%20video%20titles%20during%20Facebook%20Reels%20playback.user.js
// @updateURL https://update.greasyfork.org/scripts/545421/Facebook%20Cleaner%20%20Expand%20post%20area%20%20Hide%20video%20titles%20during%20Facebook%20Reels%20playback.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === 0. 網域安全檢查 (防止在 Instagram 或其他網站執行) ===
  if (!window.location.hostname.includes('facebook.com')) {
    return; // 如果不是 Facebook 網域，立即終止執行
  }

  // === 全域設定與狀態管理 ===
  const config = {
    autoExpandSidebar: GM_getValue('autoExpandSidebar', true),
    postWidth: GM_getValue('postWidth', 1200)
  };

  const menuIds = {
    expand: null,
    width: null
  };

  // === 1. 即時選單管理系統 ===
  function updateMenus() {
    if (typeof GM_unregisterMenuCommand !== 'undefined') {
      if (menuIds.expand) GM_unregisterMenuCommand(menuIds.expand);
      if (menuIds.width) GM_unregisterMenuCommand(menuIds.width);
    }

    menuIds.expand = GM_registerMenuCommand(`自動展開：${config.autoExpandSidebar ? "✅開啟" : "⛔關閉"}`, () => {
      config.autoExpandSidebar = !config.autoExpandSidebar;
      GM_setValue('autoExpandSidebar', config.autoExpandSidebar);
      updateMenus();
      if (config.autoExpandSidebar) tryExpandOnce();
    });

    menuIds.width = GM_registerMenuCommand(`設定貼文區寬度 (目前: ${config.postWidth}px)`, () => {
      const input = prompt("請輸入貼文寬度（數值，範圍 600～3000）：", config.postWidth);
      const newWidth = parseInt(input);
      if (!isNaN(newWidth) && newWidth >= 600 && newWidth <= 3000) {
        config.postWidth = newWidth;
        GM_setValue('postWidth', newWidth);
        updateMenus();
        updateWidenStyle();
      } else if (input !== null) {
        alert("請輸入 600～3000 之間的有效數字！");
      }
    });
  }

  updateMenus();

  // === 2. 第一階段：Facebook 清爽化 & 自動展開 ===
  let tryExpandOnce;

  (function cleanerPhase() {
    const leftKeywords = [
      // 繁體中文
      '動態回顧', '我的珍藏', '我的收藏', 'Marketplace', '兒童版 Messenger',
      '玩遊戲', '近期廣告動態', '訂單和付款', '氣候科學中心', '募款活動', '籌款活動',
      '廣告管理員', 'Meta Quest 3S',
      // 簡體中文
      '那年今天', '收藏夹', '广告管理工具', '气候科学中心',
      '订单与支付', '玩游戏', '近期广告动态', '筹款活动', 'Messenger 少儿版',
      // 英文
      'Memories', 'Saved', 'Messenger Kids',
      'Gaming', 'Play games', 'Recent ad activity', 'Orders and payments',
      'Climate Science Center', 'Fundraisers', 'Ads Manager',
      //日文
      '思い出', '保存済み', '保存したで', '広告マネージャ', '広告マネージャー','気候学センター',
      '注文と支払い', 'ゲームをプレイ', '最近の広告アクティビティ','募金キャンペーン', '資金調達専門家', 'Messengerキッズ'
    ];
    const moreKeywords = ['顯示更多', '更多', '展开', 'See more', 'More', 'Show more', 'See More', 'MORE', 'SHOW MORE', 'もっと見る'];
    const lessKeywords = ['顯示較少', '收起', 'Show less', 'Show Less', 'Less', 'LESS', '表示を減らす'];
    const selectors = ['footer', 'div[role="contentinfo"]'];

    function isMainSidebarPage() { return !!document.querySelector('nav[role="navigation"], [role=navigation]'); }

    function hideLeftSidebarByText() {
      document.querySelectorAll('nav a[role="link"], [role=navigation] a[role="link"]').forEach(a => {
        let match = false;
        a.querySelectorAll('span.x1lliihq').forEach(span => {
          if (span.textContent && leftKeywords.includes(span.textContent.trim()) && span.children.length === 0) match = true;
        });
        if (match) a.style.display = 'none';
      });
    }

    function hideRightSidebarByTitle() {
      const rightKeywords = ['贊助', '赞助内容', '聯絡人', '联系人', '群組聊天室', '群聊', 'Sponsored', 'Contacts', 'Group conversations', '連絡先', 'グループチャット'];
      document.querySelectorAll('h3').forEach(h3 => {
        if (h3.textContent && rightKeywords.some(kw => h3.textContent.includes(kw))) {
          let parent = h3;
          for (let i = 0; i < 6; i++) if (parent.parentElement) parent = parent.parentElement;
          if (parent && parent.offsetWidth > 200) parent.style.display = 'none';
        }
      });
    }

    function removeRightSidebarComplementary() {
      const sidebar = document.querySelector('[role="complementary"]');
      if (!sidebar || !sidebar.parentElement) return;
      if (location.href.includes('/photo') || location.href.includes('fbid=') || location.href.includes('/posts/') || location.href.includes('/permalink/')) return;
      const contactKeywords = ['聯絡人', '联系人', '群組聊天室', '群聊', 'Contacts', 'Group conversations', '連絡先', 'グループチャット'];
      const sidebarText = sidebar.textContent || '';
      if (contactKeywords.some(kw => sidebarText.includes(kw))) {
        sidebar.parentElement.removeChild(sidebar);
      }
    }

    function removeMarketplaceButton() {
      document.querySelectorAll('a[aria-label="Marketplace"], a[href="/marketplace/?ref=app_tab"], a[href="/marketplace/"]').forEach(a => {
        let li = a;
        for (let i = 0; i < 5; i++) {
          if (li.parentElement && li.parentElement.tagName === 'LI') { li = li.parentElement; break; }
          if (li.parentElement) li = li.parentElement;
        }
        if (li.tagName === 'LI') li.remove();
      });
    }

    function hidePolicyLinks() {
      const policyKeywords = ['隱私政策', '服務條款', '廣告', 'Ad Choices', 'Cookie', 'Meta © 2025', 'Privacy Policy', 'Terms'];
      document.querySelectorAll('footer, div[role="contentinfo"]').forEach(container => {
        if (container.querySelector('[role="progressbar"]')) return;
        policyKeywords.forEach(kw => {
          if (container.textContent.includes(kw)) container.style.display = 'none';
        });
      });
    }

    function removeMoreAndLessButtons() {
      document.querySelectorAll('[role="button"]').forEach(btn => {
        const spans = btn.querySelectorAll('span');
        for (const span of spans) {
          const text = span.textContent.trim().toLowerCase();
          if (moreKeywords.some(kw => text === kw.toLowerCase() || text.includes(kw.toLowerCase()))) {
            btn.style.display = 'none';
            break;
          }
          if (lessKeywords.some(kw => text === kw.toLowerCase() || text.includes(kw.toLowerCase()))) {
            btn.style.display = 'none';
            break;
          }
        }
      });
    }

    tryExpandOnce = function() {
      if (!config.autoExpandSidebar || !isMainSidebarPage()) return;
      let found = false;
      const btns = Array.from(document.querySelectorAll('nav[role="navigation"] [role="button"], [role=navigation] [role="button"]'));
      for (const btn of btns) {
        if (btn.offsetParent === null) continue;
        const spans = btn.querySelectorAll('span');
        for (const span of spans) {
          const text = span.textContent.trim().toLowerCase();
          if (moreKeywords.some(kw => text === kw.toLowerCase() || text.includes(kw.toLowerCase()))) {
            btn.click();
            found = true;
            setTimeout(removeMoreAndLessButtons, 800);
            break;
          }
        }
        if (found) break;
      }
    };

    function hideOtherElements() {
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.querySelector('[role="progressbar"]')) return;
          el.style.display = 'none';
        });
      });
      hideLeftSidebarByText();
      hideRightSidebarByTitle();
      removeMarketplaceButton();
      hidePolicyLinks();
      removeRightSidebarComplementary();
    }

    function debounceHideAndExpand() {
      clearTimeout(window.__fbCleanerDebounceTimer);
      window.__fbCleanerDebounceTimer = setTimeout(() => {
        hideOtherElements();
        tryExpandOnce();
      }, 300);
    }

    function expandLeftSidebar() {
      const leftRail = document.querySelector('[aria-label="左側導覽列"]');
      if (!leftRail) return;
      const extraItems = leftRail.querySelectorAll('div[role="navigation"] > div:not(:first-child):not(:nth-child(2))');
      extraItems.forEach(el => el.remove());
      if (config.autoExpandSidebar) {
        const collapseBtn = document.querySelector('div[aria-label="收合左側欄"]');
        if (collapseBtn) collapseBtn.click();
      }
    }

    window.addEventListener('load', () => { setTimeout(expandLeftSidebar, 1000); });
    hideOtherElements();
    const observer = new MutationObserver(debounceHideAndExpand);
    observer.observe(document.body, { childList: true, subtree: true });
  })();

  // === 3. 第二階段：加寬貼文顯示區域 ===
  function updateWidenStyle() {
      let styleWiden = document.getElementById('fb-cleaner-widen-style');
      if (!styleWiden) {
          styleWiden = document.createElement('style');
          styleWiden.id = 'fb-cleaner-widen-style';
          document.head.appendChild(styleWiden);
      }
      styleWiden.textContent = `
        div.x193iq5w.xvue9z {
          width: ${config.postWidth}px !important;
          max-width: ${config.postWidth}px !important;
          margin-left: -60px !important;
          box-sizing: border-box !important;
          transition: width 0.3s ease !important;
          will-change: width !important;
        }
        div.x193iq5w.xgmub6v { width: ${config.postWidth}px !important; }
        .xxc7z9f { max-width: 60px !important; }
        /* 修正影片點擊層位移問題 */
        .widened .x1yztbdb.x1n2onr6 {
          width: 100% !important;
          left: 0 !important;
        }
      `;
  }

  updateWidenStyle();

  function applyWiden() {
    const posts = document.querySelectorAll('div.x193iq5w.xvue9z.xq1tmr.x1ceravr');
    posts.forEach(post => {
      if (!post.classList.contains('widened')) {
        post.classList.add('widened');
      }
    });
  }
  applyWiden();

  const widenObserver = new MutationObserver(() => {
    clearTimeout(window.__fbWidenDebounce);
    window.__fbWidenDebounce = setTimeout(applyWiden, 200);
  });
  if (document.body) {
    widenObserver.observe(document.body, { childList: true, subtree: true });
  }

// === 4. 第三階段：Reels 影片標題穩定處理 ===

  // 1. 定義隱藏樣式：移除 display: none，改用不影響佈局的隱藏方式
  const styleReels = document.createElement('style');
  styleReels.id = 'fb-reels-hide-style';
  styleReels.textContent = `
    .fb-script-hide-reels-title {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        transition: opacity 0.2s ease !important; /* 增加平滑感 */
    }
  `;
  document.head.appendChild(styleReels);

  const REELS_TITLE_SELECTOR = '.xw8ag78.x127lhb5.x1ey2m1c.x78zum5.xdt5ytf.xozqiw3.x1o0tod.x13a6bvl.x9zwxv7.x10l6tqk.xh8yej3';

  function monitorReelsPlayback() {
    // 1. 判斷當前是否在 Reels 頁面，如果不是，直接結束函數
    // 這樣在瀏覽一般動態牆時，這段邏輯幾乎不佔用任何 CPU 資源
    if (!location.href.includes('/reels/') && !location.href.includes('/reel/')) {
      return;
    }

    const allTitleBars = document.querySelectorAll(REELS_TITLE_SELECTOR);
    // 2. 如果畫面上根本沒出現標題列（還沒讀取出來），也直接結束
    if (allTitleBars.length === 0) return;

    // 只有在以上條件都滿足時，才進行較耗資源的影片篩選與座標檢查
    const allVideos = Array.from(document.querySelectorAll('video')).filter(v => {
      return v.offsetWidth > 0 && !v.paused && !v.ended;
    });

    // ... 後續原本的標題判定與隱藏邏輯維持不變 ...
    allTitleBars.forEach(titleBar => {
      // (這裡接你原本的 tRect 取得與 isInsideVideo 判定邏輯)
      let shouldHide = false;
      const tRect = titleBar.getBoundingClientRect();
      if (tRect.height === 0) return;

      allVideos.forEach(video => {
        const vRect = video.getBoundingClientRect();
        const tCenterX = tRect.left + tRect.width / 2;
        const tCenterY = tRect.top + tRect.height / 2;

        const isInsideVideo = (
          tCenterX > vRect.left && tCenterX < vRect.right &&
          tCenterY > vRect.top && tCenterY < vRect.bottom
        );
        if (isInsideVideo) shouldHide = true;
      });

      if (shouldHide) {
        if (!titleBar.classList.contains('fb-script-hide-reels-title')) titleBar.classList.add('fb-script-hide-reels-title');
      } else {
        if (titleBar.classList.contains('fb-script-hide-reels-title')) titleBar.classList.remove('fb-script-hide-reels-title');
      }
    });
  }
  // 監測頻率
  setInterval(monitorReelsPlayback, 300);

  // 點擊補強
  window.addEventListener('click', () => setTimeout(monitorReelsPlayback, 100));
})();