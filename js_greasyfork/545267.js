// ==UserScript==
// @name         懂球帝移动端自动跳转PC端
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  将 m.dongqiudi.com 的页面自动跳转到 www.dongqiudi.com。针对文章页会将 /article/{id}.html 映射为 /articles/{id}.html，其余路径直接替换域名并保留参数与哈希。
// @author       you
// @match        https://m.dongqiudi.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545267/%E6%87%82%E7%90%83%E5%B8%9D%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/545267/%E6%87%82%E7%90%83%E5%B8%9D%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%AB%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  try {
    // 仅在 m 子域生效，防止循环跳转
    if (!/^(?:m)\.dongqiudi\.com$/i.test(location.hostname)) return;

    // 用 URL API 更稳妥地处理
    const u = new URL(location.href);

    // 目标主站
    const targetOrigin = 'https://www.dongqiudi.com';

    // 规则1：文章页 /article/{id}.html -> /articles/{id}.html
    // 示例：/article/5288965.html?from=timeline#comments
    const mArticle = u.pathname.match(/^\/article\/(\d+)\.html$/i);
    if (mArticle) {
      const id = mArticle[1];
      const newUrl = `${targetOrigin}/articles/${id}.html${u.search}${u.hash}`;
      if (newUrl !== location.href) location.replace(newUrl);
      return;
    }

    // 规则2：根路径跳首页
    if (u.pathname === '/' || u.pathname === '') {
      const newUrl = `${targetOrigin}/${u.search}${u.hash}`;
      if (newUrl !== location.href) location.replace(newUrl);
      return;
    }

    // 规则3：其他路径（球队、球员、比赛、专栏等）直接把 m 换成 www，路径保持不变
    // 例如：
    //   /team/50001759.html -> https://www.dongqiudi.com/team/50001759.html
    //   /player/50000392.html -> https://www.dongqiudi.com/player/50000392.html
    //   /match/123456.html -> https://www.dongqiudi.com/match/123456.html
    const newUrl = `${targetOrigin}${u.pathname}${u.search}${u.hash}`;
    if (newUrl !== location.href) location.replace(newUrl);
  } catch (e) {
    // 兜底：简单把域名 m -> www（不做 article -> articles 的特殊处理）
    try {
      const fallback = location.href.replace(/^https:\/\/m\.dongqiudi\.com/i, 'https://www.dongqiudi.com');
      if (fallback !== location.href) location.replace(fallback);
    } catch (_) {
      // 忽略
    }
    console.log('[DqdPcGo] 跳转失败：', e);
  }
})();
