// ==UserScript==
// @name         95306 MAll
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  95306 MAll Helper
// @author       solobear
// @license      MIT
// @match        https://mall.95306.cn/mall-view/negotiationArea/*
// @match        https://mall.95306.cn/shop-view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mall.95306.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js#sha384=Q96qXpLdPU1SBEdvTZkaSZfHRsUwS+sj/WFUdmYvGhBNtwYUucjuwhZT6glwdVXk
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/482272/95306%20MAll.user.js
// @updateURL https://update.greasyfork.org/scripts/482272/95306%20MAll.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // Welcome
    waitForKeyElements(".layui-btn",handleEveryDisableBtn);
    function handleEveryDisableBtn() {
         $(".layui-btn").removeAttr("disabled");
         $(".layui-btn").removeClass("disabled");
         //$(".layui-btn").click();
    }

    // Negotiation
    waitForKeyElements(".proAnnlist",handleEveryNegotiation);
    function handleEveryNegotiation() {
        // Project
        $(".goProDetails").each(function () {
            var uuid = $(this).attr("data-uuid");

            var detail = $(this).children(".proListTttle").children("div.tittle_text");
            detail.replaceWith('<a href="https://mall.95306.cn/mall-view/negotiationArea/details-project-ann?uuid=' + uuid + '" target="_blank">' + detail.text() + '</a>');
        });

        // Res
        $(".goResDetails").each(function () {
            var uuid = $(this).attr("data-uuid");

            var detail = $(this).children(".proListTttle").children("div");
            detail.replaceWith('<a href="https://mall.95306.cn/mall-view/negotiationArea/details-result-ann?uuid=' + uuid + '" target="_blank">' + detail.text() + '</a>');
        });

        console.log("Details: " + $(".goProDetails").length);
    }

    // Your code here...
    $(document).ready(function () {
        console.log("Init");
    })

})();