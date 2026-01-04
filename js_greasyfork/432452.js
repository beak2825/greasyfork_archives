// ==UserScript==
// @name         CSDN屏蔽会员资源
// @namespace    eyes
// @version      1.5.3
// @description  专门屏蔽（注意是屏蔽，不是破解）需要积分才能下载的资源页面以及会员专属资源的页面，让白嫖党在CSDN拥有更舒适的体验
// @author       eyes
// @match        *://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432452/CSDN%E5%B1%8F%E8%94%BD%E4%BC%9A%E5%91%98%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/432452/CSDN%E5%B1%8F%E8%94%BD%E4%BC%9A%E5%91%98%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var loc = location.href;

    // 搜索页面
    var reg = /\/so\/search/g;
    if (reg.test(loc)) {
        // 执行屏蔽
        function search_shield() {
            var list_item = $('.list-item');
            var clear_num = 0;
            $.each(list_item, function (i, v) {
                // 屏蔽资源
                var b1 = $(v).find('.icon-download').length;  // 下载资源
                var b2 = $(v).find('.download-size').length;  // 下载资源
                var b3 = $(v).find('.icon-course_count').length;  // 付费课程
                if ((b1 || b2 || b3) && v.style.display != 'none') {
                    $(v).hide();
                    clear_num++;
                }
            })
            return clear_num;
        }

        // 初始时执行
        // 油猴脚本里似乎必须绑定事件才能执行，我试了很多种加载完成执行都没用。。。。我也没办法只能这样。。。。。感觉这是个油猴bug
        $(document).mousemove(function() {
            var clear_num = search_shield();
            if (clear_num) {
                console.log("初次屏蔽", clear_num, "个会员资源链接╮(￣▽ ￣)╭");
                $(document).off("mousemove");
            }
        })

        // 页面下滑加载时执行
        $(window).scroll(function () {
            var clear_num = search_shield();
            if (clear_num) console.log("再次屏蔽", clear_num, "个会员资源链接╮(￣▽ ￣)╭");
        })

        // 点击加载更多时执行
        $(".so-load-data").click(function () {
            var clear_num = search_shield();
            if (clear_num) {
                console.log("再次屏蔽", clear_num, "个会员资源链接╮(￣▽ ￣)╭");
                $(document).off("scroll");  // 取消对滚动的监听
            }
        })
    }

    // 文章页面
    var reg2 = /article\/details/g;
    if (reg2.test(loc)) {
        // 执行屏蔽
        function article_shield() {
            var clear_num = 0;
            var download_item = $('.recommend-box .type_download');
            var download_type = $("div[data-type='download']");
            $.each([download_item, download_type], function (i, v) {
                $.each(v, function (i, v) {
                    $(v).hide();
                    clear_num++;
                })
            })
            return clear_num;
        }

        // 与搜索页面初始屏蔽同理
        $(document).mousemove(function() {
            var clear_num = article_shield();
            if (clear_num) {
                console.log("一共屏蔽", clear_num, "个会员资源链接╮(￣▽ ￣)╭");
                $(document).off("mousemove");
            }
        })
    }
})();