// ==UserScript==
// @name           YouTube 社区贴文图片下载
// @name:en        YouTube Community Post Image Downloader
// @description:en Right-click on a YouTube community post to automatically batch download images
// @description    右键Youtube社区帖子来自动批量下载图片
// @version        1.2.0
// @author         kaesinol (modified)
// @match          https://*.youtube.com/*
// @match          https://youtube.com/*
// @grant          GM_download
// @license        MIT
// @namespace https://greasyfork.org/users/1243515
// @downloadURL https://update.greasyfork.org/scripts/541408/YouTube%20Community%20Post%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/541408/YouTube%20Community%20Post%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 图片 URL 还原为原图
  function getOriginalUrl(rawUrl) {
    if (!rawUrl) return rawUrl;
    const match = rawUrl.match(/(\S*?)-c-fcrop64=[^=]*/);
    let base = match ? match[1] : rawUrl;
    base = base.replace(/=s\d+/, '=s0');
    if (!base.includes('=s0')) base += '=s0';
    return base;
  }

  function downloadImage(url, filename) {
    try {
      GM_download({ url: url, name: filename, onerror: err => console.error('Download failed:', err) });
    } catch (e) {
      console.error('GM_download failed:', e);
    }
  }

  function sanitizeFilename(name) {
    return (name || 'author').replace(/[\\/:*?"<>|]+/g, '').slice(0, 100);
  }

  // 页面匹配规则：与原先的 @match 四条等价，但在运行时判断（适配 SPA）
  const PAGE_PATTERNS = [
    /https?:\/\/([^\/]+\.)?youtube\.com\/[^?#]*\/posts(?:[\/?#]|$)/,
    /https?:\/\/([^\/]+\.)?youtube\.com\/post\/[^\/?#]+(?:[\/?#]|$)/,
    /https?:\/\/([^\/]+\.)?youtube\.com\/@[^\/?#]+(?:[\/?#]|$)/,
    /https?:\/\/([^\/]+\.)?youtube\.com\/channel\/[^\/?#]+\/posts(?:[\/?#]|$)/
  ];

  function pageMatches() {
    const href = location.href;
    for (const re of PAGE_PATTERNS) if (re.test(href)) return true;
    return false;
  }

  let active = pageMatches();
  console.log('[YouTubeDownload] active=', active);

  // 处理单个贴子右键事件
  async function handleRightClick(event) {
    const container = event.currentTarget;
    if (!container) return;

    const authorLink = container.querySelector('#author-text');
    let authorHref = authorLink ? (authorLink.getAttribute('href') || '') : '';
    authorHref = sanitizeFilename(authorHref || 'author');

    // 取出 post id
    let id = 'unknown';
    const postAnchor = container.querySelector('a[href*="/post/"]');
    if (postAnchor) {
      const href = postAnchor.getAttribute('href') || '';
      const m = href.split('/post/');
      if (m[1]) id = m[1].split(/[\/?#]/)[0];
    }

    const imgs = container.querySelectorAll('#content-attachment img');
    let i = 0;
    for (const img of imgs) {
      const rawUrl = img.src || img.getAttribute('src');
      if (!rawUrl) continue;
      const imgUrl = getOriginalUrl(rawUrl);
      const ext = (imgUrl.match(/\.([a-zA-Z0-9]+)(?:[?&#]|$)/) || [])[1] || 'png';
      const filename = `${authorHref} - ${id} - ${++i}.${ext}`;
      downloadImage(imgUrl, filename);
    }

    event.preventDefault();
  }

  // 绑定/解绑函数
  function bindPost(post) {
    if (!post) return;
    if (post.__ytDownloadBound) return;
    post.addEventListener('contextmenu', handleRightClick);
    post.__ytDownloadBound = true;
  }

  function unbindPost(post) {
    if (!post || !post.__ytDownloadBound) return;
    post.removeEventListener('contextmenu', handleRightClick);
    delete post.__ytDownloadBound;
  }

  // 扫描当前已有的 posts 并绑定
  function scanAndBind() {
    if (!active) return;
    const posts = document.querySelectorAll('#body.style-scope.ytd-backstage-post-renderer');
    for (const post of posts) bindPost(post);
  }

  // history hook（适配 SPA）
  (function() {
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function() {
      const res = _push.apply(this, arguments);
      window.dispatchEvent(new Event('yt-navigate'));
      return res;
    };
    history.replaceState = function() {
      const res = _replace.apply(this, arguments);
      window.dispatchEvent(new Event('yt-navigate'));
      return res;
    };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('yt-navigate')));
    window.addEventListener('yt-navigate', () => {
      const prev = active;
      active = pageMatches();
      if (active && !prev) scanAndBind();
      if (!active && prev) console.log('[YouTubeDownload] left target page');
    });
  })();

  // MutationObserver：监视新插入的 post
  const observer = new MutationObserver(records => {
    if (!active) return;
    for (const rec of records) {
      for (const node of rec.addedNodes) {
        if (node.nodeType !== 1) continue;
        // 新增 post 节点
        if (node.matches && node.matches('#body.style-scope.ytd-backstage-post-renderer')) {
          bindPost(node);
        } else if (node.querySelectorAll) {
          const posts = node.querySelectorAll('#body.style-scope.ytd-backstage-post-renderer');
          for (const p of posts) bindPost(p);
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 初次绑定
  if (active) scanAndBind();

  console.log('[YouTubeDownload] 脚本已启动');
})();
