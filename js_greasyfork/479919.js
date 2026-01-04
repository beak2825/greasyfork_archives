// ==UserScript==
// @name         BiliBili网站AI总结夜间模式样式修复
// @namespace    https://github.com/PeterYRZ
// @version      0.3
// @description  修正了插件Bilibili Evolved提供的夜间模式导致的新功能“AI视频总结”样式显示问题
// @author       PeterYRZ
// @match        *://*.bilibili.com/*
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @icon64       https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479919/BiliBili%E7%BD%91%E7%AB%99AI%E6%80%BB%E7%BB%93%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/479919/BiliBili%E7%BD%91%E7%AB%99AI%E6%80%BB%E7%BB%93%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(".ai-summary-popup, div[data-video-assistant-subject] {border: 0px;box-shadow: 0 0 30px rgba(34,34,34,.10196);background: #333333;}");
    GM_addStyle(".ai-summary-popup-body-outline .section:hover, div[data-video-assistant-subject-tabs], div[class^='_SearchBar_']:not([class*=' _Shrinked_']), div[class^='_SearchBtn_']:hover, div[class^='_CloseBtn_']:hover{background-color: #444444 !important;}");
    GM_addStyle("div[class^='_Part_']:hover {background: #242628 !important;}");
    GM_addStyle("div[class^='_Part_']:hover div[class^='_Content_'] {color: #00A0D8 !important;}");
    GM_addStyle("div[class^='_Part_'] div[class^='_TimeText_'] {background: #444444 !important;color: white !important;}");
    GM_addStyle("div[class^='_Part_']:hover div[class^='_TimeText_'] {background: #242628 !important;color: #00A0D8 !important;}");
    GM_addStyle("div[class^='_Feedback_'] div[class^='_Btn_']:hover {background: #444444 !important;color: #00A0D8 !important;}");
    GM_addStyle(".ai-summary-popup-body-abstracts {color: #eeeeee;}");
    GM_addStyle("span.ai-summary-popup-tips-text {color: #eeeeee !important;}");
    GM_addStyle(".ai-summary-popup-header {background: none;}");
    GM_addStyle(".resizable-component {background: #333333;}");
    GM_addStyle(".ai-summary-popup-body-outline .section .section-title:before {background: #eeeeee;}");
    GM_addStyle(".video-ai-assistant.disabled:hover::after {display: block;background: #333333;border: 0px;}");
    GM_addStyle(".ai-summary-popup-header-right .ai-summary-popup-close:hover, .ai-summary-popup-header-right .ai-summary-popup-dislike:hover, .ai-summary-popup-header-right .ai-summary-popup-like:hover {color: #eeeeee;}");
    GM_addStyle(".ai-summary-popup-header-left .ai-summary-popup-tips-main .tips-icon:hover {color: #eeeeee;}");
})();