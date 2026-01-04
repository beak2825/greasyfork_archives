// ==UserScript==
// @name         知乎屏蔽登录弹窗 操作CSS
// @namespace    URL
// @version      0.1
// @description  A brief summary to describe the script
// @author       Your name
// @match        https://*.zhihu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523206/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%20%E6%93%8D%E4%BD%9CCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/523206/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%20%E6%93%8D%E4%BD%9CCSS.meta.js
// ==/UserScript==

GM_addStyle(`
/* 屏蔽登录弹窗 */
.Modal-wrapper.undefined.Modal-enter-done{
  display: none !important;
}
/* 屏蔽右下角登录提示 */
.css-1wq6v87{
  display: none !important;
}
/* 解锁滚动条 */
html{
  overflow: unset !important;
}
/* 避免闪烁 */
.Modal-backdrop{
  background-color: unset !important;
}
`)