// ==UserScript==
// @name         Floating Screenshot Button for Facebook Posts
// @name:zh-TW   FaceBook 貼文懸浮截圖按鈕
// @name:zh-CN   FaceBook 贴文悬浮截图按钮
// @namespace    http://tampermonkey.net/
// @version      4.6
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

  // ===== 禁用聚焦樣式 (修正：僅針對截圖按鈕，避免干擾影片控制項聚焦) =====
  const style = document.createElement('style');
  style.textContent = `
    .ignore-me-please:focus, .ignore-me-please:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);

  // ===== 輔助工具 =====
  const pad = n => n.toString().padStart(2, '0');

  // 確保圖片載入
  async function ensureImagesLoaded(post) {
    const imgs = Array.from(post.querySelectorAll('img'));
    const promises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    return Promise.all(promises);
  }

  // ===== 強化 ID 偵測邏輯 =====
  function getFbidFromPost(post) {
    const links = Array.from(post.querySelectorAll('a[href*="fbid="], a[href*="story_fbid="]'));
    for (const a of links) {
      try {
        const url = new URL(a.href);
        const fbid = url.searchParams.get('fbid') || url.searchParams.get('story_fbid');
        if (fbid) return fbid;
      } catch { }
    }
    const timeLinks = Array.from(post.querySelectorAll('a[href*="/posts/"], a[href*="/permalink/"], a[href*="/groups/"][href*="/user/"]'));
    for (const a of timeLinks) {
      const match = a.href.match(/\/posts\/(\d+)/) || a.href.match(/\/permalink\/(\d+)/);
      if (match && match[1]) return match[1];
    }
    const dataFt = post.getAttribute('data-ft');
    if (dataFt) {
      const match = dataFt.match(/"top_level_post_id":"(\d+)"/);
      if (match) return match[1];
    }
    try {
      const url = new URL(window.location.href);
      const fbid = url.searchParams.get('fbid') || url.searchParams.get('story_fbid') || url.pathname.match(/\/posts\/(\d+)/)?.[1];
      if (fbid) return fbid;
    } catch { }
    return 'unknownID';
  }

  // ===== 建立截圖按鈕 =====
  function createScreenshotButton(post) {
    const btn = document.createElement('div');
    btn.textContent = '📸';
    btn.title = '截圖貼文';
    btn.classList.add('ignore-me-please');

    Object.assign(btn.style, {
      position: 'absolute', left: '-45px', top: '0',
      width: '32px', height: '32px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%', backgroundColor: '#3A3B3C',
      color: 'white', cursor: 'pointer', zIndex: '999',
      transition: 'background .2s',
      pointerEvents: 'auto' // 確保按鈕可點擊
    });
    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#4E4F50');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#3A3B3C');

    btn.addEventListener('click', async e => {
      e.stopPropagation();
      e.preventDefault(); // 避免點擊按鈕觸發 FB 底層影片播放
      btn.textContent = '⏳';
      btn.style.pointerEvents = 'none';

      let attempts = 0;
      const maxAttempts = 2;

      const runScreenshot = async () => {
        const originalMargins = [];
        try {
          post.querySelectorAll('span,a,div,button').forEach(el => {
            const txt = el.innerText?.trim() || el.textContent?.trim();
            if (['查看更多', '顯示更多', 'See more', 'See More', '…更多'].includes(txt)) {
              el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
          });

          await ensureImagesLoaded(post);
          await new Promise(r => setTimeout(r, 800));

          const storyMessages = post.querySelectorAll('div[dir="auto"], div[data-ad-preview="message"]');
          storyMessages.forEach(el => {
            const computedMargin = window.getComputedStyle(el).marginTop;
            originalMargins.push({ el, margin: computedMargin });
            el.style.marginTop = '10px';
          });

          await new Promise(r => setTimeout(r, 200));

          const options = {
            backgroundColor: '#1c1c1d',
            pixelRatio: 2,
            cacheBust: true,
            skipFonts: true,
            // 修正：除了排除 ignore 類名，也排除 VIDEO 標籤避免 Cross-Origin 衝突
            filter: (node) => {
              const isIgnore = node.classList && node.classList.contains('ignore-me-please');
              const isVideo = node.tagName === 'VIDEO';
              return !isIgnore && !isVideo;
            }
          };

          const dataUrl = await window.htmlToImage.toPng(post, options);

          const postID = getFbidFromPost(post);
          const now = new Date();
          const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(now.getSeconds())}`;
          const filename = `${postID}_${timestamp}.png`;

          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          btn.textContent = '📸';

        } catch (err) {
          if (attempts < maxAttempts) {
            attempts++;
            await new Promise(r => setTimeout(r, 1500));
            return runScreenshot();
          } else {
            throw err;
          }
        } finally {
          originalMargins.forEach(({ el, margin }) => { el.style.marginTop = margin; });
        }
      };

      try {
        await runScreenshot();
      } catch (err) {
        alert('截圖失敗，請稍候再試');
        btn.textContent = '❌';
      } finally {
        btn.style.pointerEvents = 'auto';
      }
    });

    return btn;
  }

  // ===== 核心觀察器 =====
  const observer = new MutationObserver(() => {
    document.querySelectorAll('div.x1lliihq, div.x1yztbdb').forEach(post => {
      if (post.dataset.sbtn === '1') return;

      const text = post.innerText || '';
      if (text.includes('社團建議') || text.includes('Suggested Groups')) return;

      // 修正：優先掛載在「三個點」選單的容器，這通常位於標頭，不干擾下方影片
      let btnContainer = post.querySelector('div.xqcrz7y')
                      || post.querySelector('div.x1qx5ct2')
                      || post.querySelector('div.x1cy8zhl.x78zum5.x1q0g3np')
                      || post.querySelector('div[role="group"]');

      if (!btnContainer) return;

      post.dataset.sbtn = '1';

      // 修正：僅當容器非定位元素時才設為 relative，且儘量不改動大型 root 容器
      if (getComputedStyle(btnContainer).position === 'static') {
        btnContainer.style.position = 'relative';
      }

      btnContainer.appendChild(createScreenshotButton(post));
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();