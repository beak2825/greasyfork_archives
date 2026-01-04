// ==UserScript==
// @name         微信读书舒适版(改)
// @version      0.0.1
// @namespace    http://tampermonkey.net/
// @description  优化微信读书传统阅读模式界面: 宽屏,护眼. 如果存在阅读控制栏按钮遮挡文字的情况可以缩放一下页面或搭配微信读书沉浸式阅读(https://greasyfork.org/zh-CN/scripts/413731)
// @contributor  
// @author       v
// @license      MIT
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/477311/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%88%92%E9%80%82%E7%89%88%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477311/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%88%92%E9%80%82%E7%89%88%28%E6%94%B9%29.meta.js
// ==/UserScript==
 
// 布局-全屏
GM_addStyle(".wr_page_reader .app_content {margin-left: 0; margin-right:0; max-width: 100%; !important;}");
GM_addStyle(".readerTopBar {max-width: 100%; height: 45px; !important;}");
GM_addStyle(".readerControls {margin-bottom: -28px; left: 5px; margin-left: 5px; !important;}");
 
// 亮色主题-淡黄色
GM_addStyle(".wr_whiteTheme .readerHeaderButton {color: #5d646e !important;}");
GM_addStyle(".wr_whiteTheme .readerTopBar {background-color: #fff6dd !important;}");
GM_addStyle(".wr_whiteTheme .readerContent .app_content {background-color: #fff6dd; !important;}");
GM_addStyle(".wr_whiteTheme .readerFooter_button {color: #5d646e; background-color: #fec046; !important;}");