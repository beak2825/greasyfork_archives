// ==UserScript==
// @name         V2EX精简版
// @namespace   v2ex.com
// @version      0.0.1
// @description  去头像、页脚、广告、侧栏等
// @author       abledf
// @match        https://www.v2ex.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436424/V2EX%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/436424/V2EX%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle(`
#Wrapper,

/* #Logo {
    background-image: none !important;
    background-color: #fff !important;
} */
#Main {
    width: 100%;
    margin: auto;
}
.topic_content, .reply_content, .item_title{
    font-size: 18px;
}
/* #Top {
    background-color: #333344;
}*/

a:link,
a:visited,
a:active {
    color: #000000;
}

#ad_unit,
#google-center-div,
.avatar,
#Bottom,
.item tr>td:nth-child(1),
#Rightbar {
    display: none !important;
}

#Main tr > td:nth-child(1) {
    width: 0px;
}


     `)
})();