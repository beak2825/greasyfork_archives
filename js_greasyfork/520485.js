// ==UserScript==
// @name         Bing广告拦截
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  广告拦截
// @match        https://*.bing.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/520485/Bing%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/520485/Bing%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
  // 设置检测间隔时间和最大检测时间（5秒）
  const checkInterval = 100; // 0.1秒
  const maxWaitTime = 5000; // 5秒
  let elapsedTime = 0;

  // 定义检测函数
  function checkElements() {
    // 获取所有.b_overflow2类型的元素
    const bOverflow2Elements = document.querySelectorAll('.b_overflow2');

    bOverflow2Elements.forEach(el => {
      // 检查前方的元素值（例如父元素或前一个兄弟元素）
      const previousElement = el.previousElementSibling; // 获取前一个兄弟元素

      // 如果前方的元素或父元素有特定条件，可以进一步过滤
      if (previousElement && previousElement.classList.contains('dynamicClass')) {
        const parent = el.closest('.b_algo');
        if (parent) {
          parent.remove(); // 删除包含该元素的b_algo元素
        }
      }
    });

    // 查找并删除包含b_ad和b_adTop类的元素
    const bAdTopElements = document.querySelectorAll('.b_ad.b_adTop');
    bAdTopElements.forEach(el => {
      if (el.classList.contains('b_ad') && el.classList.contains('b_adTop')) {
        el.remove(); // 删除同时包含b_ad和b_adTop类的元素
      }
    });

    // 获取所有包含b_ad或b_adTop的元素并删除
    const bAdElements = document.querySelectorAll('.b_ad, .b_adTop');
    bAdElements.forEach(el => el.remove()); // 删除包含b_ad或b_adTop的元素

    // 更新已检测时间
    elapsedTime += checkInterval;
    if (elapsedTime >= maxWaitTime) {
      clearInterval(intervalId); // 如果超过5秒，停止检测
    }
  }

  // 等待页面加载完成后开始检测
  window.addEventListener('load', () => {
    setTimeout(() => {
      const intervalId = setInterval(checkElements, checkInterval);
    }, 500); // 页面加载完成后延迟0.5秒开始检测
  });
})();
