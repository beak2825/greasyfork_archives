// ==UserScript==
// @name        GoodGame.Ru (new design) enhancer
// @include     https://goodgame.ru/*
// @version     1.11
// @description:ru Выключает верхний блок с рекламой. Уменьшает шрифт до нормального в новостях и на форуме.
// @description Disable ad in header. Desrease font size at news pages and forum.
// @namespace https://greasyfork.org/users/72530
// @license The MIT License
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/23899/GoodGameRu%20%28new%20design%29%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/23899/GoodGameRu%20%28new%20design%29%20enhancer.meta.js
// ==/UserScript==

//news - decrease font size
GM_addStyle (".news-wrapper .news-block p {font-size: 14px !important; line-height: 22px !important;}");
GM_addStyle (".news-wrapper .news-block h1 {font-size: 18px !important; line-height: 26px !important;}");
GM_addStyle (".news-wrapper .news-footer {font-size: 14px !important; line-height: 22px !important;}");
GM_addStyle (".news-text ul, ol {font-size: 14px !important; line-height: 22px !important;}");
GM_addStyle ("blockquote {font-size: 14px !important; line-height: 22px !important;}");
GM_addStyle (".interview {font-size: 14px !important; line-height: 22px !important;}");


//forum - decrease font size
GM_addStyle (".dashboard-block .title {font-size: 18px !important; line-height: 26px !important;}");
GM_addStyle (".forum-wrap .topic-block .topic-body .title {font-size: 18px !important; line-height: 26px !important;}");
GM_addStyle (".dashboard-block.comments-block .comment-block .content-part .comment-body {font-size: 14px !important; line-height: 1.7em !important;}");

//remove ad
document.getElementsByTagName("body")[0].className  = "no-ads";