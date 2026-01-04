// ==UserScript==
// @name        优酷获取ID脚本
// @namespace   Violentmonkey Scripts
// @match       https://v.youku.com/v_show*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/3/30 19:14:17
// @license      -
// @downloadURL https://update.greasyfork.org/scripts/544363/%E4%BC%98%E9%85%B7%E8%8E%B7%E5%8F%96ID%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/544363/%E4%BC%98%E9%85%B7%E8%8E%B7%E5%8F%96ID%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// 获取所有 link 标签
const links = document.querySelectorAll('link[href*="id_"]');
let videoId = null;

links.forEach(link => {
  const href = link.getAttribute('href');
  const match = href.match(/id_(.*?)\.html/);
  if (match) {
    videoId = match[1];
  }
});

// 获取 <meta name="irTitle"> 的 content 内容
const meta = document.querySelector('meta[name="irTitle"]');
const irTitle = meta ? meta.getAttribute('content') : null;

// 打印结果
console.log('Video ID:', videoId);
console.log('irTitle:', irTitle);
alert(`视频名称: ${irTitle}     ,      视频id: ${videoId}`)