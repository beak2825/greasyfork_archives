// ==UserScript==
// @name         网盘下载+视频网站VIP解析
// @description  热门视频站跳转VIP视频+Pandownload可以不登录直接下载。
// @namespace    https://greasyfork.org/zh-CN/users/246564-%E7%8E%8B%E5%85%88%E7%94%9F
// @author       laoame
// @copyright    laoame
// @include      https://pan.baidu.com/disk/home*
// @include      https://pan.baidu.com/s/*
// @include      https://pan.baidu.com/share/link*
// @include      https://v.youku.com/v_*
// @include      https://*.iqiyi.com/v_*
// @include      https://*.le.com/ptv/vplay/*
// @include      https://*v.qq.com/x*
// @include      https://*.mgtv.com/b/*
// @include      https://film.sohu.com/album/*
// @include      https://tv.sohu.com/v*
// @include      https://*.bilibili.com/bangumi/play/*
// @include      https://v.pptv.com/show/*
// @include      https://*.baofeng.com/play/*
// @include      https://*.wasu.cn/Play/show*
// @include      https://v.yinyuetai.com/video/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @version      2.2
// @downloadURL https://update.greasyfork.org/scripts/383400/%E7%BD%91%E7%9B%98%E4%B8%8B%E8%BD%BD%2B%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99VIP%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/383400/%E7%BD%91%E7%9B%98%E4%B8%8B%E8%BD%BD%2B%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99VIP%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //写入CSS样式
    $('body').append('<style type="text/css">a:hover{text-decoration: none;color: #fff;}a:active{text-decoration: none;color: #fff;}a:hover{text-decoration: none;color: #fff;}a:visited{text-decoration: none;color: #fff;}.my_button_{padding:0;padding:0;display: block;position:absolute;z-index: 9999;border: 0px;color: #fff;font-size: 14px;left:0px;text-align: center;} .my_button_vip{left:0px;width: 60px;height: 50px;background-color: #009688;line-height: 50px;}.my_button_wp{top:237px;left:200px;width: 150px;height: 30px;background-color: #009688;line-height: 30px;}</style>');
    var cur_url = window.location.href;
    //百度网盘
    if (cur_url.indexOf("pan.baidu.com") != -1) {
        var new_url=window.location.href.replace(/baidu.com/, "baiduwp.com");
        $('body').append('<a target="_blank" class="my_button_ my_button_wp" style="background-color: #ff5722;"  href="'+new_url+'">跳转到直接下载页</a>');
    }
    //视频网站添加VIP解析按钮
    if (cur_url.indexOf("pan.baidu.com") == -1) {
        $('body').append('<a target="_blank" class="my_button_ my_button_vip" style="background-color: #ff5722;top:70px;"  href="http://www.zhmdy.top/index.php?zhm_jx='+cur_url+'">线路①</a>');
        $('body').append('<a target="_blank" class="my_button_ my_button_vip" style="background-color: #ffb800;top:130px;" href="http://tv.wandhi.com/go.html?url='+cur_url+'">线路②</a>');
        $('body').append('<a target="_blank" class="my_button_ my_button_vip" style="background-color: #1e9fff;top:190px;" href="http://lingquyouhuiquan.cn/vip/index.php?url='+cur_url+'">线路③</a>');
        $('body').append('<a target="_blank" class="my_button_ my_button_vip" style="background-color: #009688;top:250px;" href="http://www.guandianzhiku.com/v/s/?url='+cur_url+'">线路④</a>');
    }
})();