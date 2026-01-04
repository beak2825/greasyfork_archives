// ==UserScript==
// @name         177Viewer
// @namespace    https://greasyfork.org/zh-CN/scripts/380478-177viewer
// @version      1.1
// @description  添加三个按钮，免翻页查看整篇漫画，下载全部图片
// @author       gfbxy
// @match        *://*.177pic.pw/html/*.html
// @match        *://*.177pic.info/html/*.html
// @match        *://*.177pic001.info/html/*.html
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/380478/177Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/380478/177Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var btnOne = $('<button style="padding:3px;color:#999;margin-right:5px" >动态加载</button>');
    var btnAll = $('<button style="padding:3px;color:#999;margin-right:5px" >加载全部</button>');
    var btnLoad = $('<button style="padding:3px;color:#fb9251;" >下载图片</button>');
    var config;
    var cookieIndex = document.cookie.indexOf('177viewer=')

    // 读取设置
    if (cookieIndex>-1) {
        config = document.cookie.slice(cookieIndex + 10, cookieIndex + 11);
        if (config == 1) {
            $(btnAll).css('color', '#ff6100');
        }
        else {
            $(btnOne).css('color', '#ff6100');
        }
    }
    else {
        document.cookie = '177viewer=0'
        config = 1;
        $(btnOne).css('color', '#ff6100');
    }

    // 重新设置并刷新
    $('.entry-title').after(btnOne, btnAll, btnLoad);
    $(btnOne).on('click', function () {
        document.cookie = '177viewer=0';
        location = location;
    });
    $(btnAll).on('click', function () {
        document.cookie = '177viewer=1';
        location = location;
    });


    //获取页面链接
    var a = $('div.page-links a');
    var href = [window.location.href];
    for (var i = 1; i < a.length - 1; i++) {
        href[i] = (a.eq(i).attr('href'));
    }
    console.log(href)
    var wait = 0;
    var pageIndex = 1;
    // 一次性加载
    if (config == 1) {
        loadImg(1, href.length);
    }
    // 动态加载
    else {
        // 滚动加载函数
        window.onload = function () {
            window.onscroll = function () {
                if (wait == 1 || pageIndex >= href.length) {
                    return;
                }
                wait = 1;
                setTimeout(function () {
                    wait = 0;
                }, 500);
                // 快滚到底了
                if ($(this).scrollTop() + $(this).height() + 1500 >= $(document).height()) {
                    loadImg(pageIndex, href.length);
                    pageIndex++;
                }
            };
        };
    }

    // 加载图片函数
    function loadImg(page, end) {
        if (page >= end) {
            return;
        }
        $('<div></div>').load(href[page] + ' .single-content', function () {
            $('.single-content').append($(this).children().children('p'));

            if (config == 1) {
                page++;
                loadImg(page, end);
            }
        });
    }


    // 下载按钮
    $(btnLoad).on('click', function () {
        var title = $("h1").text();
        title = title.replace(/\[|\]|\(|\)"/g, function (matchStr) {
            var tokenMap = {
                '(': '【',
                ')': '】',
                '[': '【',
                "]": '】'
            };
            return tokenMap[matchStr];
        });

        $.ajaxSetup({
            async: false
        });
        var doc = [];
        for (var l = 0; l < href.length; l++) {
            $.get(href[l], function (data) {
                doc[l] = new DOMParser().parseFromString(data, "text/html");
            });
        }
        var result = 'md "' + title + '"\r\n' + 'cd "' + title + '"\r\n';
        for (var i = 0, n = 0; i < doc.length; i++ , n = n + img.length) {
            var img = doc[i].querySelectorAll("noscript");
            for (var j = 0; j < img.length; j++) {
                if(img[j].firstChild.src){
                    result = result + "wget -O " + '"' + [n + j] + '.jpg" ' + img[j].firstChild.src + "\r\n";
                }
            }
        }
        result = result;
        GM_setClipboard(result);
        console.log(result)
        alert("已复制！在想保存的文件夹打开cmd，右键粘贴下载！");
    });
})();