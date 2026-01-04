// ==UserScript==
// @name         博客园沉浸模式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将宝贵的精力集中于内容本身
// @author       lnwazg
// @match        *.cnblogs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407400/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/407400/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E6%B2%89%E6%B5%B8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeAd() {
        let len = arguments.length;
        for (var i = 0; i < len; i++) {
            $(arguments[i]).hide();
        }
    }
    removeAd("#blogTitle","#navigator","#cnblogs_c2", "#comment_form", "#cnblogs_c1", "#sideBarMain", "#blog_post_info_block", "#sideBar");

    $("#mainContent").width("92%").css("marginLeft","15");
    $(".forFlow").css("marginLeft","0");
    $("body,#header,#footer,.forFlow").css("background","none");
})();