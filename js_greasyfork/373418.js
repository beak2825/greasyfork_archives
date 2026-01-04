// ==UserScript==
// @name         去除A-COE 2018网站顶部广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除A-COE 2018网站广告
// @author       Cqdbdong
// @match        https://acoe2018.wixsite.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373418/%E5%8E%BB%E9%99%A4A-COE%202018%E7%BD%91%E7%AB%99%E9%A1%B6%E9%83%A8%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/373418/%E5%8E%BB%E9%99%A4A-COE%202018%E7%BD%91%E7%AB%99%E9%A1%B6%E9%83%A8%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#WIX_ADS").hide();
    $("header").css("margin-top","0px");
    $("#SITE_ROOT").css("top","0px");
})();