// ==UserScript==
// @name         腾讯、爱奇艺、芒果、优酷、乐视、B站、土豆、搜狐、1905等 VIP视频助手V2
// @namespace    Aice.Fu_gwTools
// @version      0.0.1
// @description  腾讯、爱奇艺、芒果、优酷、乐视、B站、土豆、搜狐、1905等各大视频网站视频解析服务
// @author       Aice.Fu
// @include      *://v.youku.com/v_*
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://*.iqiyi.com/v_*
// @include      *://*.iqiyi.com/w_*
// @include      *://*.iqiyi.com/a_*
// @include      *://*.iqiyi.com/dianying/*
// @include      *://*.le.com/ptv/vplay/*
// @include      *://*v.qq.com/x/cover/*
// @include      *://*v.qq.com/x/page/*
// @include      *://*v.qq.com/play*
// @include      *://*v.qq.com/cover*
// @include      *://*.tudou.com/listplay/*
// @include      *://*.tudou.com/albumplay/*
// @include      *://*.tudou.com/programs/view/*
// @include      *://*.tudou.com/v*
// @include      *://*.mgtv.com/b/*
// @include      *://film.sohu.com/album/*
// @include      *://tv.sohu.com/*
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.com/anime/*
// @include      *://*.bilibili.com/bangumi/play/*
// @include      *://*.pptv.com/show/*
// @include      *://*.wasu.cn/Play/show*
// @include      *://*.1905.com/play/*
// @downloadURL https://update.greasyfork.org/scripts/396317/%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81B%E7%AB%99%E3%80%81%E5%9C%9F%E8%B1%86%E3%80%81%E6%90%9C%E7%8B%90%E3%80%811905%E7%AD%89%20VIP%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8BV2.user.js
// @updateURL https://update.greasyfork.org/scripts/396317/%E8%85%BE%E8%AE%AF%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81B%E7%AB%99%E3%80%81%E5%9C%9F%E8%B1%86%E3%80%81%E6%90%9C%E7%8B%90%E3%80%811905%E7%AD%89%20VIP%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8BV2.meta.js
// ==/UserScript==
(function() {

    'use strict'
    var pan_html = "<div id='AiceVipCls'  style='cursor:pointer;z-index:98;display:block;width:50px;height:30px;line-height:30px;position:fixed;left:0;top:270px;text-align:center;'> <p>关闭</p> </div><div id='AiceVipDiv'  href='javascript:void(0)' target='_blank' style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;'><img src='http://xcx.ubja.vip/freevip/static/img/vip.png' height='55' ></div>";
        $("body").append(pan_html);

        $("#AiceVipDiv").click(function() {
            var openUrl = window.location.href;
            window.open('http://xcx.ubja.vip/freevip/vip2.html?zwx=' + openUrl);
        });


     var ClsVip = document.getElementById('AiceVipCls');
            ClsVip.addEventListener('click', function() {
                   $("#AiceVipDiv").hide();
                    $("#AiceVipCls").hide();
                 });
    if(window.location.href.indexOf('xcx.ubja.vip')!=-1){
        $("#AiceVipDiv").hide();
        $("#AiceVipCls").hide();
    }

})();
