// ==UserScript==
// @name         跳转QQ拦截网站
// @namespace    http://tampermonkey.net/
// @author       Dogxi
// @version      1.0
// @license      MIT
// @description  自动跳转QQ拦截的网站，告别烦人的“已停止访问”
// @match        https://c.pc.qq.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/527893/%E8%B7%B3%E8%BD%ACQQ%E6%8B%A6%E6%88%AA%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/527893/%E8%B7%B3%E8%BD%ACQQ%E6%8B%A6%E6%88%AA%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const styles = `
        .popup-container {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            max-width: 300px;
            word-break: break-all;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  const url = new URLSearchParams(location.search).get("url");
  if (!url) return;

  const popup = document.createElement("div");
  popup.className = "popup-container";
  popup.textContent = `即将跳转至: ${url}`;
  document.body.appendChild(popup);

  setTimeout(() => {
    location.href = url;
  }, 500);
})();
