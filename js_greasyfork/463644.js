// ==UserScript==
// @name         博客园只读模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  看完就走
// @author       luzemin
// @match        https://www.cnblogs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnblogs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463644/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E5%8F%AA%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/463644/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E5%8F%AA%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles = `
    body{background:#f1f1f1;}

    #top_nav,#side_nav,#side_right,footer#footer,#wrapper>a{display:none;}
    #pager_top,#pager_top .pager{display:none;margin:0;padding:0;}
    .hero{padding:0;display: block;margin:0 auto;width:80%;padding-bottom: 15px;}
    .card { background:none;padding:0;}
    .main-flow .card.headline {padding: 40px;border-radius:10px;margin-left: 0;
     background: url(https://i.imgur.com/536Giss.jpg) no-repeat;background-position: 0px -118px;background-size: 100%;}
    .headline li {line-height: 50px;font-size: 20px;font-weight:bold;}
    #editor_pick_lnk {font-size:inherit;font-weight:bold;}
    .post-list {width: 100% !important;}
    .post-list>.post-item {background: #fff;margin:10px 0;padding: 45px;border-radius:10px;}
    .main-flow .headline a:link, .main-flow .headline a:visited {color: #FFEB3B;}
    .post-list>.post-item>.post-item-body>.post-item-text {position: relative;}
    .post-list>.post-item>.post-item-body>.post-item-text>.post-item-title {margin-left: 70px;line-height: 60px;font-size: 25px;text-decoration: none;}
    .post-item .avatar {border-radius: 50%;position: absolute;top: 0;left: 0;}
    .post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link {color: #005da6;text-decoration: none;}
    .post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:hover, .post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:active {color: #f60;text-decoration: underline;}
    .post-list>.post-item>.post-item-body>.post-item-text>.post-item-summary {font-size: 18px;line-height: 36px;color: #999;}
    .post-list>.post-item>.post-item-body>.post-item-foot {font-size:16px;color: #999;}
    .pager>* {color: #959595;padding: 10px 15px;}
    .pager>a.current {background-color: #005da6;}

    #header,#footer,#sideBar,#cnblogs_ch,#opt_under_post,#cnblogs_c1,#under_post_card1,#under_post_card2,#HistoryToday{display:none;}
    #blog_post_info_block,#comment_form_container,#blog-comments-placeholder,#comment_nav{display:none;}
    #mainContent {background: #fff;width: 80%;margin: 50px auto;padding: 20px;border-radius: 10px;}
    .postTitle, .entrylistPosttitle, .feedback_area_title {border-bottom: none;font-size: 28px;margin: 50px 0; }
    .postTitle a{color: #FF9800;}
    .postBody {font-size: 18px;}
    .hljs {font-size: 18px;}
    .cnblogs-markdown :not(pre,div,td)>code, .blogpost-body :not(pre,div,td)>code{font-size: 18px;}
    `
    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();