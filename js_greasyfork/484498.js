// ==UserScript==
// @name         按钮旋转
// @namespace    en20
// @version      1.0.1
// @description  非常好脚本,使我滨州旋转
// @author       en20
// @match        http*://*
// @grant        none
// @license      MIT
// @run-at		 document-start
// @downloadURL https://update.greasyfork.org/scripts/484498/%E6%8C%89%E9%92%AE%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484498/%E6%8C%89%E9%92%AE%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==
(function () {

const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
  button,.button,.btn,.Button {
    animation: spin 2s infinite linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// 将样式表添加到页面头部
document.head.appendChild(style);

})()
