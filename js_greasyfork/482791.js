// ==UserScript==
// @name         标小智logo生成AI自动滚动加载更多
// @namespace    http://tampermonkey.net/
// @version      2023-12-21
// @description  用于logosc自动翻页
// @author       Ozymandias
// @match        https://www.logosc.cn/make
// @icon         https://www.google.com/s2/favicons?sz=64&domain=logosc.cn
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/482791/%E6%A0%87%E5%B0%8F%E6%99%BAlogo%E7%94%9F%E6%88%90AI%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/482791/%E6%A0%87%E5%B0%8F%E6%99%BAlogo%E7%94%9F%E6%88%90AI%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==
var shouldScrollToBottom = true; // 控制是否自动滚动到底部
(function() {
    'use strict';

    // Your code here...
    function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}


function checkAndScroll() {
  var loadMoreInterval = setInterval(function() {
      var loadMoreButton = document.querySelector('.load-more-logos-btn');
      if (loadMoreButton) {
          console.log("点击加载更多")
          loadMoreButton.click();
      }
      if (shouldScrollToBottom) {
        scrollToBottom();
      }
  }, 1000); // 每隔1秒检测一次
}
console.log("自动检测开始")
checkAndScroll();


window.addEventListener('scroll', function() {
  var scrollPosition = window.innerHeight + window.scrollY;
  var documentHeight = document.documentElement.scrollHeight;
  // 判断是否滚动到页面底部
  if (scrollPosition >= documentHeight) {
    shouldScrollToBottom = true;
  } else {
    shouldScrollToBottom = false;
  }
});
})();