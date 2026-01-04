// ==UserScript==
// @name         自动隐藏pornhub和xhamster上已经观看的视频
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动隐藏已观看的视频
// @author       xiaoxiao
// @match        *://*.pornhub.*/*
// @match        *://*.xhamster.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476352/%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8Fpornhub%E5%92%8Cxhamster%E4%B8%8A%E5%B7%B2%E7%BB%8F%E8%A7%82%E7%9C%8B%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/476352/%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8Fpornhub%E5%92%8Cxhamster%E4%B8%8A%E5%B7%B2%E7%BB%8F%E8%A7%82%E7%9C%8B%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

// 移除已观看的视频
function removeWatchedVideos() {
  // 获取所有视频项（Pornhub）
  var phElements = document.querySelectorAll('.pcVideoListItem.js-pop.videoblock, .pcVideoListItem.js-pop.videoblock.videoBox');

  // 批量移除已观看的视频（Pornhub）
  phElements.forEach(function(element) {
    if (element.textContent.includes("已观看")) {
      element.remove();
    }
  });

  // 获取所有视频项（XHamster）
  var xhElements = document.querySelectorAll('.thumb-list__item.video-thumb');

  // 批量移除已观看的视频（XHamster）
  xhElements.forEach(function(element) {
    // 判断是否已观看
    var watchedElement = element.querySelector('.thumb-image-container__watched');
    if (watchedElement) {
      element.remove();
    }
  });
}

// 使用 MutationObserver 监听 DOM 变化，动态移除已观看视频
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    mutation.addedNodes.forEach(function(node) {
      // 处理新加载的视频项（Pornhub）
      if (node.nodeType === 1 && node.classList.contains('pcVideoListItem')) {
        if (node.textContent.includes("已观看")) {
          node.remove();
        }
      }

      // 处理新加载的视频项（XHamster）
      if (node.nodeType === 1 && node.classList.contains('thumb-list__item')) {
        var watchedElement = node.querySelector('.thumb-image-container__watched');
        if (watchedElement) {
          node.remove();
        }
      }
    });
  });
});

// 观察文档的变化
observer.observe(document.body, { childList: true, subtree: true });

// 初始加载时移除已观看的视频
removeWatchedVideos();
