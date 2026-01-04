// ==UserScript==
// @name         Facebook Cleaner & Expand post area & Hide video titles during Facebook Reels playback.
// @name:zh-TW   Facebook 乾淨化 & 加寬貼文區 & 播放連續短片時隱藏影片標題
// @name:zh-CN   Facebook 乾淨化 & 加宽贴文区 & 播放连续短片时隐藏影片标题
// @name:ja      Facebookのクリーンアップ ＆ 投稿エリアの拡張 ＆ 連続ショート動画再生時のタイトル非表示
// @namespace    http://tampermonkey.net/
// @version      8.5
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
    disableVideoAutoplay: GM_getValue('disableVideoAutoplay', false),
    postWidth: GM_getValue('postWidth', 1200),
    runtimeAutoplayAllowed: false
  };

  const menuIds = {
    expand: null,
    autoplay: null,
    width: null
  };

  // === 1. 即時選單管理系統 ===
  function updateMenus() {
    if (typeof GM_unregisterMenuCommand !== 'undefined') {
      if (menuIds.expand) GM_unregisterMenuCommand(menuIds.expand);
      if (menuIds.autoplay) GM_unregisterMenuCommand(menuIds.autoplay);
      if (menuIds.width) GM_unregisterMenuCommand(menuIds.width);
    }

    menuIds.expand = GM_registerMenuCommand(`自動展開：${config.autoExpandSidebar ? "✅開啟" : "⛔關閉"}`, () => {
      config.autoExpandSidebar = !config.autoExpandSidebar;
      GM_setValue('autoExpandSidebar', config.autoExpandSidebar);
      updateMenus();
      if (config.autoExpandSidebar) tryExpandOnce();
    });

    menuIds.autoplay = GM_registerMenuCommand(`禁止影片自動播放：${config.disableVideoAutoplay ? "✅開啟" : "⛔關閉"}`, () => {
      config.disableVideoAutoplay = !config.disableVideoAutoplay;
      GM_setValue('disableVideoAutoplay', config.disableVideoAutoplay);
      updateMenus();
      if (config.disableVideoAutoplay) scanAndPauseVideos();
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

  // === 2. 禁止影片自動播放模組 ===
  let scanAndPauseVideos;

  (function preventVideoAutoplayModule() {
    function isAllowedAutoplayPage() {
      const url = location.href;
      // 嚴格限定為 facebook 的網域路徑
      return url.includes("facebook.com/watch") || url.includes("facebook.com/reel/");
    }

    function checkURLForAllowedPage() {
      const currentlyAllowed = isAllowedAutoplayPage();
      if (currentlyAllowed && !config.runtimeAutoplayAllowed) {
        config.runtimeAutoplayAllowed = true;
      } else if (!currentlyAllowed && config.runtimeAutoplayAllowed) {
        config.runtimeAutoplayAllowed = false;
      }
    }

    setInterval(checkURLForAllowedPage, 1000);
    window.addEventListener('popstate', checkURLForAllowedPage);

    function isReelsVideo(video) {
      let el = video;
      for (let i = 0; i < 10; i++) {
        if (!el.parentElement) break;
        el = el.parentElement;
        if (el.innerHTML && (el.innerHTML.includes('/reel/') || el.innerHTML.includes('/reels/'))) {
          return true;
        }
      }
      return false;
    }

    let lastUserInteractionTime = 0;
    ['click', 'keydown', 'mousedown'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        lastUserInteractionTime = Date.now();
      }, true);
    });

    function wasRecentlyInteracted() {
      return Date.now() - lastUserInteractionTime < 1000;
    }

    scanAndPauseVideos = function() {
      if (!config.disableVideoAutoplay || config.runtimeAutoplayAllowed) return;

      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (isReelsVideo(video)) {
          if (video.dataset.reelsProcessed) return;
          video.dataset.reelsProcessed = "true";

          function preventPlay(e) {
            if (!config.disableVideoAutoplay || config.runtimeAutoplayAllowed) return;
            if (!wasRecentlyInteracted()) {
              e.preventDefault();
              e.stopPropagation();
              video.pause();
              console.log('[FB Cleaner] 阻止自動播放');
            }
          }

          video.addEventListener('play', preventPlay, true);
          video.pause();
          video.autoplay = false;
          video.muted = true;
          video.removeAttribute("autoplay");
          video.removeAttribute("playsinline");

          video.addEventListener('mouseenter', () => {
             if (config.disableVideoAutoplay && !config.runtimeAutoplayAllowed && !wasRecentlyInteracted()) {
               video.pause();
             }
          });
          return;
        }

        if (!video.__autoplayChecked) {
            video.__autoplayChecked = true;
            if (!video.paused && !wasRecentlyInteracted()) {
                video.pause();
            }
        }
      });
    };

    document.addEventListener('play', (e) => {
      if (!config.disableVideoAutoplay || config.runtimeAutoplayAllowed) return;
      const video = e.target;
      if (video.tagName === 'VIDEO') {
        setTimeout(() => {
          if (!wasRecentlyInteracted() && !video.paused) {
            video.pause();
          }
        }, 100);
      }
    }, true);

    scanAndPauseVideos();
    const observer = new MutationObserver(scanAndPauseVideos);
    observer.observe(document.body, { childList: true, subtree: true });
  })();

  // === 3. 第一階段：Facebook 清爽化 & 自動展開 ===
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

  // === 4. 第二階段：加寬貼文顯示區域 ===
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

  // === 5. 第三階段：Reels 影片標題穩定處理 ===
  const videoTitleMap = new WeakMap();

  function monitorReelsPlayback() {
    const videos = Array.from(document.querySelectorAll('video')).filter(v => v.offsetParent !== null);
    videos.forEach(video => {
      let record = videoTitleMap.get(video);
      let titleBar = null;

      function isInsideReels(video) {
        let el = video;
        for (let i = 0; i < 10; i++) {
          if (!el.parentElement) break;
          el = el.parentElement;
          const classList = el.className || '';
          if ((classList.includes('x1ey2m1c') && classList.includes('xh8yej3')) &&
              (classList.includes('x13a6bvl') || classList.includes('xdhlvrg') || classList.includes('x10l6tqk'))) {
            return true;
          }
        }
        return false;
      }
      if (!isInsideReels(video)) return;

      const needsRebind = !record || !record.titleBar?.isConnected;
      if (needsRebind) {
        let el = video;
        for (let i = 0; i < 10; i++) {
          if (!el.parentElement) break;
          el = el.parentElement;
          const candidates = el.querySelectorAll(
            'div[class*="x1ey2m1c"][class*="x13a6bvl"], div[class*="x1ey2m1c"][class*="xdhlvrg"], div[class*="x1ey2m1c"][class*="xh8yej3"], div[class*="x1ey2m1c"][class*="x10l6tqk"]'
          );
          for (const c of candidates) {
            const text = c.innerText?.trim();
            const hasControlButtons = c.querySelector('button[aria-label*="暫停"]') || c.querySelector('button[aria-label*="播放"]') || c.querySelector('button[aria-label*="靜音"]') || c.querySelector('[role="slider"]');
            if (text && text.length > 2 && c.offsetHeight > 0 && c.offsetWidth > 0 && !hasControlButtons) {
              titleBar = c;
              break;
            }
          }
          if (titleBar) break;
        }
        if (titleBar) {
          videoTitleMap.set(video, { titleBar, lastPaused: video.paused });
          titleBar.style.display = video.paused ? "" : "none";
        }
      } else {
        titleBar = record.titleBar;
        const lastPaused = record.lastPaused;
        const isPaused = video.paused;
        if (isPaused !== lastPaused) {
          titleBar.style.display = isPaused ? "" : "none";
          videoTitleMap.set(video, { titleBar, lastPaused: isPaused });
        }
      }
    });
  }
  setInterval(monitorReelsPlayback, 300);

})();