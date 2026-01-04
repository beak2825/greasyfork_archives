// ==UserScript==
// @name         巨量百应平台达人详情
// @namespace    https://buyin.jinritemai.com/
// @version      0.2
// @description  巨量百应平台达人跳转查看带货详情
// @author       骄阳
// @include        https://buyin.jinritemai.com/dashboard/followed-daren*
// @include        http://buyin.jinritemai.com/dashboard/followed-daren*
// @exclude      https://buyin.jinritemai.com/dashboard/servicehall/daren-profile*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497992/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%B9%B3%E5%8F%B0%E8%BE%BE%E4%BA%BA%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/497992/%E5%B7%A8%E9%87%8F%E7%99%BE%E5%BA%94%E5%B9%B3%E5%8F%B0%E8%BE%BE%E4%BA%BA%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function redirecturl(){
        var url0 = window.location.href;
        console.log("跳转...");
        var reg = new RegExp('(^|&)' + 'uid' + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        var uid=unescape(r[2]);
        window.location.href='https://buyin.jinritemai.com/dashboard/servicehall/daren-profile?uid='+uid;
    };
    redirecturl();
})();