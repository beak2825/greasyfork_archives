// ==UserScript==
// @name         s1临时脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  看着办吧。。。
// @author       You
// @match        https://bbs.saraba1st.com/2b/*
// @grant        none


// @require		https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36282/s1%E4%B8%B4%E6%97%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/36282/s1%E4%B8%B4%E6%97%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('<style type="text/css">.wp{max-width:1600px!important} div.pti{display:inline-block;width: calc(100% - 60px)} div.author{display: inline-block; width: 50%;} div.author+div{display: inline-block;text-align: right;width: 49%}div.pct{min-height:150px}.bm{background: #EBEBEB;}#toptb{height:auto}</style>').appendTo("head");
    $('<a href="https://bbs.saraba1st.com/2b/forum-75-1.html">外野</a><a href="https://bbs.saraba1st.com/2b/forum-6-1.html">动漫</a><a href="https://bbs.saraba1st.com/2b/forum-4-1.html">游戏</a>').appendTo("#toptb>div>div.z");
})();