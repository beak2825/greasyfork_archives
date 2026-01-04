// ==UserScript==
// @name         禁止百度搜索自动播放视频和禁止粘贴板口令
// @version      2.3
// @description  让百度搜索结果的视频无法自动播放，无法复制粘贴板口令
// @author       ChatGPT
// @match        https://m.baidu.com/*
// @match        https://www.baidu.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/470469/%E7%A6%81%E6%AD%A2%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%92%8C%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4%E6%9D%BF%E5%8F%A3%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/470469/%E7%A6%81%E6%AD%A2%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%92%8C%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4%E6%9D%BF%E5%8F%A3%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = `.cos-rich-video-player-video,[data-video-player='true'] {display: none !important;}`;
    document.head.appendChild(style);
})();

document.addEventListener('copy', function(e) {
  var copiedText = window.getSelection().toString();
  if (copiedText.startsWith('1.fu:/') || 
      copiedText.startsWith('#baiduhaokan') || 
      copiedText.includes(':/¥^')) {
    e.preventDefault(); // 阻止写入粘贴板
    console.log('禁止复制指定内容');
  }
});