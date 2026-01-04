// ==UserScript==
// @name         4k影视网页全屏播放去滚动条
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  去掉4k影视网页全屏播放时浏览器屏幕右侧的垂直滚动条
// @author       zhaoxinsoft.com
// @match        https://www.4kvm.org/artplayer?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4kvm.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489618/4k%E5%BD%B1%E8%A7%86%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E5%8E%BB%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/489618/4k%E5%BD%B1%E8%A7%86%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E5%8E%BB%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('HELLO FROM zhaoxinsoft.com');
  // Your code here...
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutations, ob) => {
    // 检查节点的class变化是否包含了art-fullscreen-web
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        if (mutation.target.classList.contains('art-fullscreen-web')) {
          // set the parent document body to overflow hidden because the artplayer-app is in an iframe
          window.parent.document.body.style.overflowY = 'hidden';
        } else {
          // 退出了全屏播放
          window.parent.document.body.style.overflowY = 'auto';
        }
      }
    });
  });
  // Start observing the target node for configured mutations
  observer.observe(document.querySelector('#artplayer-app .art-video-player'), { attributes: true });
})();