// ==UserScript==
// @name         热带遗迹
// @namespace    https://yourdomain.example
// @version      1.0
// @description  阅读即可 
// @author       海域
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532766/%E7%83%AD%E5%B8%A6%E9%81%97%E8%BF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/532766/%E7%83%AD%E5%B8%A6%E9%81%97%E8%BF%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入样式
    GM_addStyle(`
/* 图片变黄效果 */
img {
  filter: sepia(0.4) brightness(1.1) contrast(0.9) saturate(0.8);
  transition: filter 5s ease-in-out;
}

/* 文字老化、模糊效果（排除超链接） */
body *:not(a) {
  transition:
    color 6s ease-in-out,
    filter 8s ease-in-out,
    text-shadow 8s ease-in-out;
  color: #333 !important;
  filter: blur(0.5px);
}

/* 扫描纸张背景 */
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 9999;
  background: url('https://example.com/your-background.jpg') repeat;
  opacity: 0.15;
}
    `);

    // 延迟加载并逐渐模糊所有文字（排除链接）
    function degradeText() {
      const textNodes = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (
          node.parentNode &&
          node.nodeValue.trim().length > 3 &&
          node.parentNode.tagName.toLowerCase() !== 'a'
        ) {
          textNodes.push(node);
        }
      }

      textNodes.forEach((node, index) => {
        const span = document.createElement('span');
        span.textContent = node.nodeValue;
        span.style.transition = 'all 6s ease-in-out';
        span.style.display = 'inline-block';
        span.style.filter = 'blur(0.5px)';
        span.style.color = '#555';
        node.parentNode.replaceChild(span, node);
      });
    }

    window.addEventListener('load', () => {
      setTimeout(degradeText, 1000);
    });

})();
