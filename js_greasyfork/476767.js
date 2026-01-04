// ==UserScript==
// @name         财经M平方去掉图片墙
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  去掉财经M平方的图片水印
// @author       深海探长
// @match        *://*.macromicro.me/*
// @icon         https://cdn.macromicro.me/assets/img/favicons/favicon-32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476767/%E8%B4%A2%E7%BB%8FM%E5%B9%B3%E6%96%B9%E5%8E%BB%E6%8E%89%E5%9B%BE%E7%89%87%E5%A2%99.user.js
// @updateURL https://update.greasyfork.org/scripts/476767/%E8%B4%A2%E7%BB%8FM%E5%B9%B3%E6%96%B9%E5%8E%BB%E6%8E%89%E5%9B%BE%E7%89%87%E5%A2%99.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 修改App.isUserPrime函数，使其总是返回true
    const originalIsUserPrime = App.isUserPrime;
    App.isUserPrime = function() {
        return true;
    };

    // 修改App.isUserLoggedIn函数，使其总是返回true
    const originalIsUserLoggedIn = App.isUserLoggedIn;
    App.isUserLoggedIn = function() {
        return true;
    };

    // 修改logChartView函数
    const originalLogChartView = App.logChartView;
    App.logChartView = function(n, i) {
        return new Promise((resolve, reject) => {
            // 直接解析r对象，确保图片展示的条件被满足
            let r = {
                chart_views_exceeded: false,
                go_pro: 1,
                is_micro_chart: false,
                freq: 'Y',
                docref_allowed: true,
                is_allow_chart: true
            };

            // 获取图表标题
            let o = App.getChartTitle(n, i);

            // 确保图片展示
            if ("chart" === n) {
                if ($("body").hasClass("page-sector") && r.is_micro_chart && (!App.isUserPrime() || "Y" !== r.freq)) {
                    let t = App.isUserLoggedIn() ? "/subscribe" : "/login?next=" + encodeURIComponent(location.pathname);
                    App.appendChartWall('.chart[data-chid="' + i + '"]', "walled-mbr", App.__("user:pls-subscribe:sector"), t, "chart_micro", App.__("btn:add-now"), o);
                    reject();
                } else if ($("body").hasClass("page-sector") && $("#chart-view-btn-" + i).css("display", "block"),
                "boolean" !== typeof r.chart_views_exceeded || !r.chart_views_exceeded || r.docref_allowed) {
                    resolve();
                } else if ($("body").hasClass("page-index") || $("body").hasClass("page-macro-home")) {
                    resolve();
                } else if (r.hasOwnProperty("go_pro") && 0 < r.go_pro) {
                    App.trk4("chart_subscribe_prompt");
                    let t = App.__("user:pls-subscribe:charts");
                    2 === r.go_pro && (t = App.__("user:subscriber-only-content"));
                    ($("body").hasClass("page-bookmarks") || $("body").hasClass("page-chart-collection")) && r.is_allow_chart ? resolve() : (App.appendChartWall('.chart[data-chid="' + i + '"]', "walled-pro", t, "/subscribe", "chart_subscribe", App.__("btn:subscribe-now"), o), reject());
                } else {
                    App.trk4("chart_login_prompt");
                    let t = App.__("user:pls-login");
                    $("body").hasClass("page-industries") ? (App.appendChartWall('.chart[data-chid="' + i + '"]', "walled-mbr", t, "/login?next=" + encodeURIComponent(location.pathname), "chart_login", App.__("common:btn:sign-up-log-in"), o), App.appendChartWall(".quote-container", "walled-mbr", t, "/login?next=" + encodeURIComponent(location.pathname), "chart_login", App.__("common:btn:sign-up-log-in"), o)) : App.appendChartWall('.chart[data-chid="' + i + '"]', "walled-mbr", t, "/login?next=" + encodeURIComponent(location.pathname), "chart_login", App.__("common:btn:sign-up-log-in"), o), reject();
                }
            } else {
                resolve();
            }
        });
    };
})();