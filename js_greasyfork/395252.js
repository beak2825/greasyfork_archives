// ==UserScript==
// @name        动漫花园(dmhy.org) - 种子文件命名
// @namespace   moe.jixun
// @description 保留下载种子文件的文件名
// @match       https://share.dmhy.org/topics/*
// @grant       none
// @version     1.0
// @author      Jixun
// @run-at      document-start
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/395252/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28dmhyorg%29%20-%20%E7%A7%8D%E5%AD%90%E6%96%87%E4%BB%B6%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395252/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%28dmhyorg%29%20-%20%E7%A7%8D%E5%AD%90%E6%96%87%E4%BB%B6%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', () => {
  const link = document.querySelector('#tabs-1 > p:first-child strong+a');
  const name = link.textContent.trim() + '.torrent';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    GM_download(link.href, name);
  });
});

