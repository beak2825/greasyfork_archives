// ==UserScript==
// @name         优雅的滚动条
// @version      0.1
// @description  Elegant scrollbar style to all websites
// @author       StarKWL
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/936647
// @downloadURL https://update.greasyfork.org/scripts/471512/%E4%BC%98%E9%9B%85%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/471512/%E4%BC%98%E9%9B%85%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
  const css = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    opacity: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #7D7D7D;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #979797;
  }

  ::-webkit-scrollbar-thumb:active {
    background: #8A8A8A;
  }
  `;

  const style = document.createElement('style');
  style.textContent = css;

  document.head.appendChild(style);
})();