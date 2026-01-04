// ==UserScript==
// @name         接口破解vip视频
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to make the world better!
// @author       李德
// @include      *v.youku.com/v_*
// @include      *m.youku.com/v*
// @include      *m.youku.com/a*
// @include      *v.qq.com/x/*
// @include      *v.qq.com/play*
// @include      *v.qq.com/cover*
// @include      *v.qq.com/tv/*
// @include      *film.sohu.com/album/*
// @include      *tv.sohu.com/*
// @include      *.iqiyi.com/v_*
// @include      *.iqiyi.com/w_*
// @include      *.iqiyi.com/a_*
// @include      *.le.com/ptv/vplay/*
// @include      *.tudou.com/listplay/*
// @include      *.tudou.com/albumplay/*
// @include      *.tudou.com/programs/view/*
// @include      *.tudou.com/v*
// @include      *.mgtv.com/b/*
// @include      *.acfun.cn/v/*
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/anime/*
// @include      *.bilibili.com/bangumi/play/*
// @include      *.pptv.com/show/*
// @include      *://*.baofeng.com/play/*
// @include      *://*.wasu.cn/Play/show*
// @include      *://v.yinyuetai.com/video/*
// @include      *://v.yinyuetai.com/playlist/*
// @include      *://item.taobao.com/*
// @include      *://*detail.tmall.com/*
// @include      *://*detail.tmall.hk/*
// @include      *://*.liangxinyao.com/*
// @include      *://music.163.com/song*
// @include      *://music.163.com/m/song*
// @include      *://y.qq.com/n/*
// @include      *://*.kugou.com/song*
// @include      *://*.kuwo.cn/yinyue*
// @include      *://*.kuwo.cn/play_detail*
// @include      *://*.xiami.com/*
// @include      *://music.taihe.com/song*
// @include      *://*.1ting.com/player*
// @include      *://music.migu.cn/v*
// @require      https://lib.baomitu.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404028/%E6%8E%A5%E5%8F%A3%E7%A0%B4%E8%A7%A3vip%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/404028/%E6%8E%A5%E5%8F%A3%E7%A0%B4%E8%A7%A3vip%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    jQuery.noConflict();
    (function ($) {
        // Your code here...
        var xuanfuVip = $("<div id='myid' style='z-index: 9999; position: fixed ! important; width:100%; top: 400px;'><table><img src='https://cdn.80note.com/vip.gif' id='myimg' height='55' style='position: absolute;left: 0px; top: 0px;'></table></div>");
        if (/youku.com|qq.com|sohu.com|iqiyi.com|tudou.com|mgtv.com|pptv.com|/.test(location.hostname)&&!/bljiex|2kxy|eggvod/.test(location.hostname)) {
            $(document.body).append(xuanfuVip);
        }
        var Methods = {
            PoJieMethod: function (e) {
                $.get('https://www.eggvod.cn/jxcode.php', {
                    in:81516699,code:2
                }, function (data) {
                    location.href = 'https://www.eggvod.cn/jx.php?lrspm=' + data + '&zhm_jx=' + location.href;
                });
            },
            DoubleClickMethod: function () {
                window.location.href = "https://vip.bljiex.com/?v=" + location.href;
            }
        };
        //绑定事件到按钮
        $("img#myimg[src]").on({
            click: Methods.DoubleClickMethod,
            dblclick: Methods.PoJieMethod,
            touchstart: Methods.DoubleClickMethod,
            touchmove: Methods.PoJieMethod
        });

    })(jQuery);


})();
