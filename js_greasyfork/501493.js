// ==UserScript==
// @name         Linux.do 美化
// @namespace    http://tampermonkey.net/
// @version      2024-07-22
// @description  美化 Linux.do 
// @author       huala
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/501493/Linuxdo%20%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/501493/Linuxdo%20%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
:root {
  --d-sidebar-background: #ffffff !important;
  --header_background: #ffffff !important;
  --secondary: #ffffff !important;
}

/* WebKit 浏览器（如 Chrome 和 Safari） */
::-webkit-scrollbar {
  width: 12px !important; /* 滚动条的宽度 */
  height: 12px !important; /* 滚动条的高度 */
}

::-webkit-scrollbar-track {
  background: #f1f1f1 !important; /* 滚动条轨道的背景色 */
  border-radius: 6px !important; /* 圆角 */
}

::-webkit-scrollbar-thumb {
  background: #888 !important; /* 滚动条滑块的颜色 */
  border-radius: 6px !important; /* 圆角 */
}

::-webkit-scrollbar-thumb:hover {
  background: #555 !important; /* 鼠标悬停时的颜色 */
}

/* Firefox 浏览器 */
* {
  scrollbar-width: thin !important; /* 滚动条的宽度 */
  scrollbar-color: #888 #f1f1f1 !important; /* 滚动条滑块和轨道的颜色 */
}

*::-webkit-scrollbar-track {
  background: #f1f1f1 !important; /* 滚动条轨道的背景色 */
}

*::-webkit-scrollbar-thumb {
  background-color: #888 !important; /* 滚动条滑块的颜色 */
  border-radius: 6px !important; /* 圆角 */
  border: 3px solid #f1f1f1 !important; /* 给滑块添加边框，使其与轨道间有间距 */
}

#main-outlet-wrapper > div.sidebar-wrapper {
  padding-top: 18px !important;
}

.has-sidebar-page .sidebar-wrapper .sidebar-container {
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em !important;
  height: 85% !important;
  border: none !important;
}

.main-outlet {
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em !important;
}

#main-outlet-wrapper > div.sidebar-wrapper {
  padding: 1px;
}

#main-outlet > div.list-controls > div > section.category-heading {
  display: flex !important;
  align-items: center !important;
}

#main-outlet > div.list-controls > div > section.category-heading > div {
  --max-height: 50px !important;
}

  `);
})();
