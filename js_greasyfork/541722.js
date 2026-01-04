// ==UserScript==
// @name           X（旧Twitter）画像プレビュー
// @name:en        X Image Hover Preview
// @name:zh-CN     X 图片悬停预览
// @namespace      https://github.com/yourname/TwitterImageHoverPreview
// @version        1.0
// @description    写真にマウスを乗せると原寸プレビューを中央表示。複数画像ツイートではホイールで前後の画像に切替。動画・GIFサムネは対象外。
// @description:en Hover over a photo on X (Twitter) to see a full‑size preview. Scroll wheel to switch between images in multi‑photo tweets. Video/GIF thumbnails are ignored.
// @description:zh-CN 悬停在图片上可在屏幕中间显示原图；多图推文中滚轮可切换前后图片；视频/GIF 缩略图不会预览。
// @author         @pueka_3
// @match          https://twitter.com/*
// @match          https://x.com/*
// @icon           https://x.com/favicon.ico
// @grant          GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541722/X%EF%BC%88%E6%97%A7Twitter%EF%BC%89%E7%94%BB%E5%83%8F%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/541722/X%EF%BC%88%E6%97%A7Twitter%EF%BC%89%E7%94%BB%E5%83%8F%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PREVIEW_ID = 'tm-hover-preview';
  const BORDER_PX = 2;

  /** State for wheel navigation */
  let currentGallery = [];
  let currentIndex = 0;
  let wheelBind = false;

  // ───────────────────────────────────────── Styles
  GM_addStyle(`
    #${PREVIEW_ID} {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 70vw;
      max-height: 80vh;
      border: ${BORDER_PX}px solid #fff;
      box-shadow: 0 0 8px rgba(0, 0, 0, .5);
      z-index: 999999;
      pointer-events: none;
      display: none;
      background: #000;
      opacity: 0;
      transition: opacity .15s ease-out;
    }
  `);

  // ──────────────────────────────────────── Helpers
  function ensurePreview() {
    let el = document.getElementById(PREVIEW_ID);
    if (!el) {
      el = document.createElement('img');
      el.id = PREVIEW_ID;
      document.body.appendChild(el);
    }
    return el;
  }

  /** Convert thumbnail URL to original quality */
  function toOrig(url) {
    try {
      const u = new URL(url);
      if (u.searchParams.has('name')) u.searchParams.set('name', 'orig');
      return u.toString().replace(/:(?:small|medium|large|orig)$/i, ':orig');
    } catch (_) {
      return url;
    }
  }

  /** True if img *belongs to* a video player (should be skipped). */
  function isVideoContext(img) {
    return (
      img.closest('[data-testid="videoPlayer"], [data-testid="videoPlayerThumbnail"]') ||
      img.closest('[aria-label*="動画" i], [aria-label*="video" i]') ||
      img.closest('article')?.querySelector('video')
    );
  }

  /** Return true if URL is a photo (jpg/png/webp), false for video / gif thumbs */
  function isPhotoUrl(url) {
    let u;
    try { u = new URL(url); } catch { return false; }

    // Reject video-related paths
    if (/(?:^|\/)(?:amplify|ext_tw|tweet)_video(?:_|\/|$)/i.test(u.pathname)) return false;
    if (/video_thumb|animated_gif/i.test(u.pathname)) return false;

    // Query-param check
    const mime = u.searchParams.get('mimetype');
    if (mime && mime.startsWith('video')) return false;
    const fmt = u.searchParams.get('format');
    if (fmt) return /^(?:jpe?g|png|webp)$/i.test(fmt);

    // File extension fallback
    return /\.(?:jpe?g|png|webp)$/i.test(u.pathname);
  }

  /** Collect all photo URLs in the same tweet (gallery) for wheel navigation */
  function collectGallery(img) {
    const article = img.closest('article');
    if (!article) return [toOrig(img.src)];

    const imgs = Array.from(article.querySelectorAll('img'));
    const urls = [];
    for (const i of imgs) {
      const url = toOrig(i.src);
      if (!url.includes('/media/')) continue; // only media images
      if (isPhotoUrl(url) && !isVideoContext(i) && !urls.includes(url)) urls.push(url);
    }
    return urls.length ? urls : [toOrig(img.src)];
  }

  // ───────────────────────────────────────── Wheel Handler
  function onWheel(e) {
    if (currentGallery.length <= 1) return;
    e.preventDefault();

    currentIndex = (currentIndex + (e.deltaY > 0 ? 1 : -1) + currentGallery.length) % currentGallery.length;
    const nextSrc = currentGallery[currentIndex];

    const preview = ensurePreview();
    preview.style.opacity = '0';

    const buffer = new Image();
    buffer.onload = () => {
      preview.src = buffer.src;
      void preview.offsetWidth;
      preview.style.opacity = '1';
    };
    buffer.src = nextSrc;
  }

  function bindWheel() {
    if (!wheelBind) {
      window.addEventListener('wheel', onWheel, { passive: false });
      wheelBind = true;
    }
  }
  function unbindWheel() {
    if (wheelBind) {
      window.removeEventListener('wheel', onWheel, { passive: false });
      wheelBind = false;
    }
  }

  // ───────────────────────────────────────── Events
  function showPreview(e) {
    const img = /** @type {HTMLImageElement} */ (e.currentTarget);

    if (isVideoContext(img)) { hidePreview(); return; }

    const src = toOrig(img.src);
    if (!isPhotoUrl(src)) { hidePreview(); return; }

    currentGallery = collectGallery(img);
    currentIndex = currentGallery.indexOf(src);
    if (currentIndex === -1) currentIndex = 0;

    const preview = ensurePreview();

    const buffer = new Image();
    buffer.onload = () => {
      preview.src = buffer.src;
      preview.style.display = 'block';
      void preview.offsetWidth;
      preview.style.opacity = '1';
      bindWheel();
    };
    buffer.src = src;

    preview.style.opacity = '0';
  }

  function hidePreview() {
    const p = document.getElementById(PREVIEW_ID);
    if (p) {
      p.style.opacity = '0';
      p.addEventListener('transitionend', () => { if (p.style.opacity === '0') p.style.display = 'none'; }, { once: true });
    }
    unbindWheel();
    currentGallery = [];
  }

  // ─────────────────────────────────── Binding & Observer
  function bind(img) {
    if (img.dataset.tmHoverBound) return;
    img.dataset.tmHoverBound = '1';
    img.addEventListener('mouseenter', showPreview);
    img.addEventListener('mouseleave', hidePreview);
  }

  const obs = new MutationObserver((mut) => {
    for (const m of mut) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.tagName === 'IMG') bind(node);
        node.querySelectorAll?.('img').forEach(bind);
      }
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('img').forEach(bind);
})();
