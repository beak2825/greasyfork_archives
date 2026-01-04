// ==UserScript==
// @name         苏州大学继续教育
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  苏州专业技术人员继续教育，自动播放下一个，弹窗屏蔽
// @author       MisaIce
// @match        https://cj1060-kfkc.webtrn.cn/*
// @icon         http://webtrn.cn/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/465863/%E8%8B%8F%E5%B7%9E%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/465863/%E8%8B%8F%E5%B7%9E%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.pathname == '/learnspace/learn/learn/templatetwo/index.action' ||
        window.location.pathname == '/learnspace/learn/learn/blue/index.action') {
        console.log('进入课程详情');

        //弹窗点击
        setInterval(function () {
            if ($('.layui-layer-btn0').length > 0) {
                console.log('.layui-layer-btn0 戎阳豪');
                $('.layui-layer-btn0').click();
            }
        }, 1000);

        //是否播放页面
        setInterval(function () {
            var text = $('.s_mainmenucurrent').text();
            if (text != '课件') {
                $('#courseware_main_menu div').click();
            }
        }, 5000);

    }
    if (window.location.pathname == '/learnspace/learn/learn/templatetwo/content_video.action' ||
        window.location.pathname == '/learnspace/learn/learn/templatetwo/courseware_index.action' ||
        window.location.pathname == '/learnspace/learn/learn/blue/index.action') {
        console.log('进入视频播放');

        window.isEnd = false;
        console.log('戎阳豪');
        //播放完成，点击下一节
        setInterval(function () {
            if (isEnd == true) {
                isEnd = false;
                var len = $('.childItem').length;
                for (var i = 0; i < len; i++) {
                    if ($('.s_point').eq(i).hasClass('s_pointerct') == false && $('.s_point').eq(i).attr('completestate') == 0 && $('.s_point').eq(i).attr('itemtype') == 'video') {
                        $('.s_point').eq(i).parent().show();
                        $('.s_point').eq(i).click();
                        break;
                    }
                }
            }
        }, 1000);
    }

    if (window.location.pathname == '/learnspace/learn/learn/templatetwo/content_video.action' ||
        window.location.pathname == '/learnspace/learn/learn/blue/index.action') {
        console.log('播放内容页');

        // 视频暂停点击
        setInterval(function () {
            if ($('.prism-play-btn.playing').length == 0) {
                $('.prism-play-btn').click();
            }
        }, 3000);
        setInterval(function () {
            if ($('#container_display_button').css('opacity') == 1) {
                $('#container_display_button').click();
            }
        }, 3000);

        //播放完成检测
        setInterval(function () {
            var now = time_to_sec($('.current-time').text());
            var total = time_to_sec($('.duration').text());
            if (now > 0 && total > 0 && (now / total) > 0.95) {
                window.parent.isEnd = true;
            }
        }, 500);
        setInterval(function () {
            var now = time_to_sec($('#container_controlbar_elapsed').text());
            var total = time_to_sec($('#container_controlbar_duration').text());
            if (now > 0 && total > 0 && (now / total) > 0.95) {
                window.parent.isEnd = true;
            }
        }, 500);

    }

    function time_to_sec(time) {
        var s = '';
        var hour = 0;
        var min = 0;
        var sec = 0;
        if (time.split(':').length == 1) {
            sec = time.split(':')[0];
        }
        if (time.split(':').length == 2) {
            min = time.split(':')[0];
            sec = time.split(':')[1];
        }
        if (time.split(':').length == 3) {
            hour = time.split(':')[0];
            min = time.split(':')[1];
            sec = time.split(':')[2];
        }

        s = Number(hour * 3600) + Number(min * 60) + Number(sec);

        return s;
    };
})();