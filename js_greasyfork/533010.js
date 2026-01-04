// ==UserScript==
// @name        koyso.com关闭广告
// @namespace   Violentmonkey Scripts
// @match       https://koyso.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/4/16 19:07:57
// @downloadURL https://update.greasyfork.org/scripts/533010/koysocom%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/533010/koysocom%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
// 移除可能包含廣告跳轉的函數
function removeAdFunctions() {
  if (window.loadAds) {
    window.loadAds = function() {};
  }
  if (window.aclib) {
    window.aclib = {};
  }
}

// 攔截點擊事件
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A') {
    const href = e.target.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('//')) {
      e.preventDefault();
      window.location.href = href;
    }
  }
}, true);

// 在頁面加載完成後執行
window.addEventListener('load', removeAdFunctions);

// 對於動態加載的內容,使用 MutationObserver 來監視 DOM 變化
const observer = new MutationObserver(removeAdFunctions);
observer.observe(document.body, { childList: true, subtree: true });