// ==UserScript==
// @name   YouTube 社区图片强制原图
// @name:en YouTube community image forced original image
// @description 使Youtube社区帖子图片无裁剪完全显示
// @description:en Make Youtube community post images fully displayed without cropping
// @version        1.2.1
// @author         kaesinol
// @match          https://*.youtube.com/*
// @match          https://youtube.com/*
// @grant          GM_download
// @license        MIT
// @namespace https://greasyfork.org/users/1243515
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541412/YouTube%20%E7%A4%BE%E5%8C%BA%E5%9B%BE%E7%89%87%E5%BC%BA%E5%88%B6%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/541412/YouTube%20%E7%A4%BE%E5%8C%BA%E5%9B%BE%E7%89%87%E5%BC%BA%E5%88%B6%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('[YouTubeImgFix] 脚本启动');

  // 匹配需要“还原原图”的 URL 片段（图片 URL）
  const MATCH_RE = /-c-fcrop64=|=s\d+/;

  // 页面匹配规则：与原先的 @match 四条等价，但在运行时判断（适配 SPA）
  const PAGE_PATTERNS = [
    /https?:\/\/([^\/]+\.)?youtube\.com\/[^?#]*\/posts(?:[\/?#]|$)/,                       // */posts
    /https?:\/\/([^\/]+\.)?youtube\.com\/post\/[^\/?#]+(?:[\/?#]|$)/,                 // /post/*
    /https?:\/\/([^\/]+\.)?youtube\.com\/channel\/[^\/?#]+\/posts(?:[\/?#]|$)/       // /channel/*/posts
  ];

  function pageMatches() {
    const href = location.href;
    for (const re of PAGE_PATTERNS) if (re.test(href)) return true;
    return false;
  }

  function fixImg(img) {
    if (!active) return; // 只有在目标页面时处理
    const src = img.getAttribute('src');
    if (!src || !MATCH_RE.test(src)) return;      // 只有真正匹配到才处理
    if (img.dataset.processed) return;          // 已处理过的跳过

    console.info('[YouTubeImgFix] 原图替换前 src:', src);
    let newSrc = src
      .replace(/-c-fcrop64=[^=]*/g, '')          // 去掉裁剪参数
      .replace(/=s\d+/g, '=s0');                // 强制最大尺寸
    console.info('[YouTubeImgFix] 原图替换后 src:', newSrc);

    img.setAttribute('src', newSrc);
    img.setAttribute('loading', 'lazy');         // 添加 lazyload 属性
    img.dataset.processed = '1';
  }

  // SPA 状态：当前页面是否为目标页面
  let active = pageMatches();
  console.log('[YouTubeImgFix] 初始 active =', active);

  // 当地址发生变化时（pushState / replaceState / popstate），更新 active
  function updateActiveAndProcess() {
    const prev = active;
    active = pageMatches();
    if (active && !prev) {
      console.log('[YouTubeImgFix] 进入目标页面，开始处理已有图片');
      // 进入目标页面时对现有图片做一次处理
      for (const img of document.images) fixImg(img);
    }
    if (!active && prev) console.log('[YouTubeImgFix] 离开目标页面，暂停处理');
  }

  // hook history API
  (function() {
    const _push = history.pushState;
    const _replace = history.replaceState;
    history.pushState = function() {
      const ret = _push.apply(this, arguments);
      window.dispatchEvent(new Event('yt-navigate'));
      return ret;
    };
    history.replaceState = function() {
      const ret = _replace.apply(this, arguments);
      window.dispatchEvent(new Event('yt-navigate'));
      return ret;
    };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('yt-navigate')));
    window.addEventListener('yt-navigate', updateActiveAndProcess);
  })();

  // 1. 初次对已有图片做一次尝试（不会标记未匹配的）
  if (active) {
    for (const img of document.images) {
      fixImg(img);
    }
  }

  // 2. 监听新插入的节点
  const observer = new MutationObserver(records => {
    if (!active) return; // 只在目标页面处理变化
    for (const rec of records) {
      // 新节点加入
      for (const node of rec.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === 'IMG') {
          fixImg(node);
        } else if (node.querySelectorAll) {
          for (const img of node.querySelectorAll('img')) {
            fixImg(img);
          }
        }
      }
      // 属性变更
      if (rec.type === 'attributes' && rec.target.tagName === 'IMG') {
        fixImg(rec.target);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });

  console.log('[YouTubeImgFix] Observer 已启动，监听插入 & src 变更');
})();