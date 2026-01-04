// ==UserScript==
// @name         Floating Screenshot Button for Facebook Posts
// @name:zh-TW   FaceBook 貼文懸浮截圖按鈕
// @name:zh-CN   FaceBook 贴文悬浮截图按钮
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  A floating screenshot button is added to the top-right corner of the post. When clicked, it allows users to capture and save a screenshot of the post, making it easier to share with others.
// @description:zh-TW 在貼文右上新增一個懸浮截圖按鈕，按下後可以對貼文進行截圖保存，方便與其他人分享
// @description:zh-CN 在贴文右上新增一个悬浮截图按钮，按下后可以对贴文进行截图保存，方便与其他人分享
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://www.facebook.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545420/Floating%20Screenshot%20Button%20for%20Facebook%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/545420/Floating%20Screenshot%20Button%20for%20Facebook%20Posts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 禁用聚焦樣式 =====
  const style = document.createElement('style');
  style.textContent = `
    *:focus, *:focus-visible, *:focus-within {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);

  // ===== 輔助工具 =====
  const pad = n => n.toString().padStart(2, '0');

  // 確保圖片載入的 Promise
  async function ensureImagesLoaded(post) {
    const imgs = Array.from(post.querySelectorAll('img'));
    const promises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve; // 即使載入失敗也繼續，避免卡死整個流程
      });
    });
    return Promise.all(promises);
  }

  // ===== 從貼文中取得 FBID =====
  function getFbidFromPost(post) {
    const links = Array.from(post.querySelectorAll('a[href*="fbid="], a[href*="story_fbid="]'));
    for (const a of links) {
      try {
        const url = new URL(a.href);
        const fbid = url.searchParams.get('fbid') || url.searchParams.get('story_fbid');
        if (fbid) return fbid;
      } catch { }
    }
    const dataFt = post.getAttribute('data-ft');
    if (dataFt) {
      const match = dataFt.match(/"top_level_post_id":"(\d+)"/);
      if (match) return match[1];
    }
    try {
      const url = new URL(window.location.href);
      const fbid = url.searchParams.get('fbid') || url.searchParams.get('story_fbid');
      if (fbid) return fbid;
    } catch { }
    return 'unknownFBID';
  }

  // ===== 建立截圖按鈕 =====
  function createScreenshotButton(post, filenameBuilder) {
    const btn = document.createElement('div');
    btn.textContent = '📸';
    btn.title = '截圖貼文';
    btn.classList.add('ignore-me-please');

    Object.assign(btn.style, {
      position: 'absolute', left: '-40px', top: '0',
      width: '32px', height: '32px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', backgroundColor: '#3A3B3C',
      color: 'white', cursor: 'pointer', zIndex: '9999',
      transition: 'background .2s'
    });
    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#4E4F50');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#3A3B3C');

    btn.addEventListener('click', async e => {
      e.stopPropagation();
      btn.textContent = '⏳';
      btn.style.pointerEvents = 'none';

      let attempts = 0;
      const maxAttempts = 2; // 最多嘗試 3 次 (0, 1, 2)

      const runScreenshot = async () => {
        const originalMargins = [];
        try {
          // 1. 展開「查看更多」
          post.querySelectorAll('span,a,div,button').forEach(el => {
            const txt = el.innerText?.trim() || el.textContent?.trim();
            if (['查看更多', '顯示更多', 'See more', 'See More', '…更多'].includes(txt)) {
              el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
          });

          // 2. 等待資源穩定：針對重整後的第一則貼文特別重要
          await ensureImagesLoaded(post);
          await new Promise(r => setTimeout(r, 800)); // 等待展開動畫與圖片渲染

          // 3. 調整內文 margin (美化截圖)
          const storyMessages = post.querySelectorAll('div[dir="auto"], div[data-ad-preview="message"]');
          storyMessages.forEach(el => {
            const computedMargin = window.getComputedStyle(el).marginTop;
            originalMargins.push({ el, margin: computedMargin });
            el.style.marginTop = '10px';
          });

          await new Promise(r => setTimeout(r, 200));
          await document.fonts.ready;

          // 4. 設定截圖參數 (優化版)
          const options = {
            backgroundColor: '#1c1c1d',
            pixelRatio: 2,
            cacheBust: true,
            // 關鍵修正：跳過字體轉換，這能極大提升 FB 這種複雜頁面的成功率
            skipFonts: true,
            filter: (node) => {
               if (node.classList && node.classList.contains('ignore-me-please')) return false;
               if (node.tagName === 'IFRAME') return false; // 排除可能導致跨域錯誤的 iframe
               return true;
            }
          };

          const dataUrl = await window.htmlToImage.toPng(post, options);

          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = filenameBuilder();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          btn.textContent = '📸';

        } catch (err) {
          console.warn(`第 ${attempts + 1} 次截圖失敗:`, err);
          if (attempts < maxAttempts) {
            attempts++;
            await new Promise(r => setTimeout(r, 1500)); // 失敗後等待 1.5 秒再重試
            return runScreenshot();
          } else {
            throw err; // 超過次數後拋出，進入最後的 catch
          }
        } finally {
          // 還原原本的 margin-top
          originalMargins.forEach(({ el, margin }) => {
            el.style.marginTop = margin;
          });
        }
      };

      try {
        await runScreenshot();
      } catch (err) {
        console.error('最終截圖失敗：', err);
        alert('截圖失敗。這通常是因為 Facebook 資源加載過慢或限制。請稍等幾秒並捲動一下頁面後再試一次。');
        btn.textContent = '❌';
      } finally {
        btn.style.pointerEvents = 'auto';
      }
    });

    return btn;
  }

  // ===== 判斷頁面類型 =====
  function getPageType(path) {
    if (path.startsWith('/groups/')) return 'group';
    const segments = path.split('/').filter(Boolean);
    const excluded = ['watch', 'gaming', 'marketplace', 'groups', 'friends', 'notifications', 'messages'];
    if (segments.length > 0 && !excluded.includes(segments[0])) return 'page';
    return 'home';
  }

  // ===== 核心觀察器 =====
  const observer = new MutationObserver(() => {
    const type = getPageType(location.pathname);

    if (type === 'home') {
      document.querySelectorAll('div.x1lliihq').forEach(post => {
        if (post.dataset.sbtn === '1') return;
        const textContent = post.innerText || post.textContent || '';
        if (textContent.includes('社團建議') || textContent.includes('Suggested Groups')) return;

        let btnGroup = post.querySelector('div[role="group"]')
          || post.querySelector('div.xqcrz7y')
          || post.querySelector('div.x1qx5ct2');
        if (!btnGroup) return;

        post.dataset.sbtn = '1';
        btnGroup.style.position = 'relative';
        const fbid = getFbidFromPost(post);
        btnGroup.appendChild(createScreenshotButton(post, () => {
          const now = new Date();
          return `${fbid}_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}.png`;
        }));
      });
    }

    if (type === 'group' || type === 'page') {
      document.querySelectorAll('div.x1yztbdb').forEach(post => {
        if (post.dataset.sbtn === '1') return;
        let btnParent = post.querySelector('div.xqcrz7y') || post.closest('div.xqcrz7y');
        if (!btnParent) return;

        post.dataset.sbtn = '1';
        btnParent.style.position = 'relative';

        btnParent.appendChild(createScreenshotButton(post, () => {
          const now = new Date();
          if (type === 'group') {
            const groupId = location.pathname.match(/^\/groups\/(\d+)/)?.[1] || 'unknownGroup';
            return `${groupId}_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}.png`;
          } else {
            const pageName = location.pathname.split('/').filter(Boolean)[0] || 'page';
            return `${pageName}_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}.png`;
          }
        }));
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();