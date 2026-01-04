// ==UserScript==
// @name 真白萌：更好的用戶介面
// @namespace https://jasonhk.dev/
// @version 1.1.0
// @description 透過調整真白萌的用戶介面來改善使用體驗。
// @author Jason Kwok
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://masiro.me/admin*
// @match https://masiro.me/admin/noticeCenter*
// @match https://masiro.me/admin/noticeMiddlePage*
// @match https://masiro.me/admin/novelView*
// @downloadURL https://update.greasyfork.org/scripts/459624/%E7%9C%9F%E7%99%BD%E8%90%8C%EF%BC%9A%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B6%E4%BB%8B%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459624/%E7%9C%9F%E7%99%BD%E8%90%8C%EF%BC%9A%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B6%E4%BB%8B%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://masiro.me/admin")) {
  css += `
      .message-content-list-item-content
      {
          -webkit-line-clamp: revert !important;
      }
  `;
}
if (location.href.startsWith("https://masiro.me/admin/noticeCenter")) {
  css += `
      .sys-notice-item .sys-notice
      {
          height: revert;
      }

      .sys-notice-item .notice_details
      {
          float: revert;
          width: revert;
      }

      .sys-notice-item .notice_details > div:first-of-type
      {
          float: revert !important;
      }

      .sys-notice-item .sys_notice_content
      {
          margin-top: 12.15px;
          max-height: revert;
          white-space: revert;
      }
  `;
}
if (location.href.startsWith("https://masiro.me/admin/noticeMiddlePage")) {
  css += `
      .notice > div:last-of-type
      {
          width: 98% !important;
          height: revert !important;
      }
  `;
}
if (location.href.startsWith("https://masiro.me/admin/novelView")) {
  css += `
      .n-ori
      {
          -webkit-line-clamp: revert;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
