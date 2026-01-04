// ==UserScript==
// @name         极简 It之家新闻列表
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  仅保留新闻列表
// @author       You
// @match        *://*.ithome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391955/%E6%9E%81%E7%AE%80%20It%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/391955/%E6%9E%81%E7%AE%80%20It%E4%B9%8B%E5%AE%B6%E6%96%B0%E9%97%BB%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var currentURL = window.location.href;
    var newsList = /list/;

    setTimeout(() => {
        // 如果是新闻列表
        if (newsList.test(currentURL)) {
            // 新闻列表页
            $("html body").html($("#list .fl").html());
            $("html body").css({ "width": "850px", "margin": "0 auto" });
            $("ul.datel li a.t").css("width", "575px");
        } else {
            // 内容页面
            $("html body").html($("#dt.fl").html());

            $("#dt>div:eq(1)").remove();

            $("#dt .fl").css("width", "auto");

            $("#dt .fl>script").remove();

            $("#dt .fl .shareto").remove();

            $("#dt .fl .related_post").remove();

            $("#dt .fl iframe:first").remove();

            $("img").each(function () {
                $(this).prop("src", $(this).data("original"))
            });

        }
    }, 500);
})();