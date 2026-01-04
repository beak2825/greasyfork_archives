
// ==UserScript==
// @name   zhi乎问答排版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  重排版
// @author       foolmos
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468771/zhi%E4%B9%8E%E9%97%AE%E7%AD%94%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/468771/zhi%E4%B9%8E%E9%97%AE%E7%AD%94%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".Question-sideColumn.Question-sideColumn--sticky, .Topbar, .css-knqde, .Post-SideActions, .Footer, .Sticky.AppHeader.is-hidden.is-fixed.css-1x8hcdw {display:none !important;}");
GM_addStyle("#QuestionAnswers-answers.QuestionAnswers-answers {width:120% !important;margin-left:9% !important;}");
GM_addStyle(".QuestionHeader-title {font-size:19px !important;}");
GM_addStyle(".SearchMain {width:90% !important;}");
GM_addStyle(".Post-RichTextContainer {width:60% !important;}");
GM_addStyle(".QuestionHeader-title, .QuestionHeader-main {width:80% !important;font-size:16px;margin-left:4% !important;}");
GM_addStyle("figure img {width:65% !important;}");
GM_addStyle(".css-eew49z, .QuestionRelatedCard-content {width:90% !important;}");
GM_addStyle(".QuestionHeader-side {margin-left:-10% !important;margin-top:4% !important;}");
GM_addStyle(".QuestionHeader-side p {width:80% !important;font-size:13px !important;margin-left:12% !important;}");
GM_addStyle("p {line-height:1.9em !important;font-size:19px !important;width:100% !important;}");
GM_addStyle(".Card {background-color:transparent  !important;width:110% !important;}");
GM_addStyle(".RichContent.is-collapsed .RichContent-inner {max-height: 110px !important;}");
GM_addStyle(".ListShortcut , .TopicMain, .TopicMetaCard.TopicMetaCard--squareImage {width:90% !important;}");
GM_addStyle(".css-1q32xh5 {display:none !important;margin-right:-10% !important;}");


(function() {
    'use strict';
 
    // Your code here...
})();
