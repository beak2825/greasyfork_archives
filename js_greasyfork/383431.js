// ==UserScript==
// @name         极简weibo.com 个人微型博客
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  精简weibo页面样式，用微博作为个人微型博客、个人笔记或简单wiki，记录生活感悟和技术要点。
// @author       You
// @match        https://*.weibo.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383431/%E6%9E%81%E7%AE%80weibocom%20%E4%B8%AA%E4%BA%BA%E5%BE%AE%E5%9E%8B%E5%8D%9A%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/383431/%E6%9E%81%E7%AE%80weibocom%20%E4%B8%AA%E4%BA%BA%E5%BE%AE%E5%9E%8B%E5%8D%9A%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle(`

#v6_pl_ad_yaoyaofans,
#plc_bot,
#v6_pl_leftnav_group,
.WB_main_r,
.PCD_header,
.WB_frame_b,
#pl_common_footer,
#v6_pl_content_homefeed,
.gn_logo,
.gn_search_v2,
.gn_nav_list > li:nth-child(-n + 4),
.face,
.WB_info,
.WB_feed_handle,
#WB_webchat {
    display: none !important;
}

body,
.S_page,
.S_page .WB_miniblog {
    background-image: none !important;
}

.WB_detail {
    margin-left: 6px !important;
}

.WB_frame_a,
.B_page .WB_frame,
.WB_frame_c {
    width: 800px;
}

.WB_global_nav .gn_header {
    width: 280px;
}


     `)
})();