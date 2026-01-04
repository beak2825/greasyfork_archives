// ==UserScript==
// @name Inoreader去广告
// @description 去掉Inoreader的页面广告和升级按钮
// @author heartnn
// @version 1.0.0
// @grant none
// @noframes
// @include http://www.inoreader.com/*
// @include https://www.inoreader.com/*
// @icon http://www.inoreader.com/favicon.ico
// @namespace https://greasyfork.org/users/10250
// @downloadURL https://update.greasyfork.org/scripts/374599/Inoreader%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/374599/Inoreader%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
/*jshint multistr: true */

var styleEl = document.createElement('style');
styleEl.type = 'text/css';
styleEl.innerHTML = "\
#sb_rp_tools,#sb_rp_notifications,#sb_rp_gear{margin-right:-74px;}\
.block_article_ad,.ad_title,#sinner_container,#sb_rp_upgrade_button,div.trc_rbox_container,div.ad_size_large_rectangle,div.sinner_under_footer{display: none !important;}\
#reader_pane.reader_pane_sinner{padding-right:0px;}\
";
document.documentElement.appendChild(styleEl);
