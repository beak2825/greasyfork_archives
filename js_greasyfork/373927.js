// ==UserScript==
// @name         oneindex辅助
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  1.打开外部播放器 2.点击右下角蓝色图标 切换大图模式 3.可自动壁纸 需要手工打开代码
// @author       wangwangyang
// @match        https://sleazyfork.org/zh-CN/scripts/26927-222%E5%8F%B7%E5%B7%B4%E5%A3%AB%E9%80%9A%E7%A5%A8/code
// @grant        none
// @require      http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @include      *://*/*
// @downloadURL https://update.greasyfork.org/scripts/373927/oneindex%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/373927/oneindex%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jq214 = $.noConflict(true);
    if (jq214('body').hasClass('mdui-theme-primary-blue-grey')) {
        var ls = window.localStorage;
        jq214('.mdui-theme-accent-blue .mdui-color-theme-accent').attr('href', 'javascript:;');
        jq214('.mdui-theme-accent-blue .mdui-color-theme-accent').click(function() {
            thumbb();
        });
        //自动背景壁纸
//         jq214.ajax({
//             url: "https://api.desktoppr.co/1/users/keithpitt/wallpapers/random",
//             type: "GET",
//             dataType: "jsonp",
//             success: function (data) {
//                 console.info(data.response.image.url);
//                 jq214("html").append("<style>body{background:#f2f5fa url('"+data.response.image.url+"') no-repeat right center !important;background-color: rgba(255, 255, 255, 0);}</style>")
//             }
//         });

        //背景壁纸
        jq214("html").append("<style>body{background:#f2f5fa url('http://a.desktopprassets.com/wallpapers/b8182eebb086123d9521b605711503c70046cc0c/thailand-3840x2160-5k-4k-wallpaper-ocean-shore-palms-sun-5652.jpg') no-repeat right center fixed !important;background-color: rgba(255, 255, 255, 0);}</style>");

        jq214('.mdui-list .file  a').each(function() {
            var href = jq214(this).attr('href');
            if (typeof(href) != 'undefined') {
                //console.info(href);
                if (jq214(this).find('i').text() == 'ondemand_video') {
                    var key = jq214(this).find('span').text();
                    if (ls[key] != null) {
                        jq214(this).css("backgroundColor", "#f0f0ff");
                    }
                    var loc = window.location.href;
                    var xy = loc.substring(0, loc.indexOf('://') + 3);
                    var host = loc.substring(xy.length, loc.length);
                    host = host.substring(0, host.indexOf('/'));
                    loc = xy + host;
                    //console.info(loc);
                    //            href='oneindex://'+loc+href;
                    href = 'potplayer://' + loc + href;
                    jq214(this).attr('href', 'javascript:;');
                    jq214(this).attr('url', href);
                    jq214(this).attr('target', '_self');
                    //console.info(href);
                    jq214(this).click(function() {
                        var url = jq214(this).attr('url');
                        console.info(url);
                        jq214(this).css("backgroundColor", "#f0f0ff");
                        var key = jq214(this).find('span').text();
                        ls.setItem(key, url);
                        console.info(jq214(this).find('span').text());
                        window.location.href = url;
                    })
                }
            }
        });

        function thumbb() {
            if (jq214('.mdui-fab i').text() == "apps") {
                jq214('.mdui-fab i').text("format_list_bulleted");
                jq214('.nexmoe-item').removeClass('thumb');
                jq214('.nexmoe-item .mdui-icon').show();
                jq214('.nexmoe-item .mdui-list-item').css("background", "");
            } else {
                jq214('.mdui-fab i').text("apps");
                jq214('.mdui-col-xs-12 i.mdui-icon').each(function() {
                    if (jq214(this).text() == "image" || jq214(this).text() == "ondemand_video") {
                        var href = jq214(this).parent().parent().attr('href');
                        var thumb = (href.indexOf('?') == -1) ? '?t=220': '&t=220';
                        //jq214('.nexmoe-item').remove();
                        //jq214('body').append('<img src=\"'+href+'\" style=\"width:100%;\">');
                        jq214(this).parent().parent().html('<img src=\"' + href + '\" style=\"width:100%;\">');
                        jq214(this).hide();
                    }
                });
            }

        }

    }
})();