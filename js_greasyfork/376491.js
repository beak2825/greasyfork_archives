// ==UserScript==
// @name         UN 盒子 VIP视频全网解析 + VIP音乐全网解析
// @namespace    http://xx.xx21.cn
// @version      1.0.8
// @description  本脚本精选解析网站为大家提供优酷VIP解析，爱奇艺VIP解析，腾讯VIP解析，乐视VIP解析，芒果VIP解析等各大视频网站视频解析服务，让你省去购买视频VIP费用，目前功能都在测试中，欢迎大家多提意见！
// @author       新来的，给我去买包辣条来
// @match        *://v.qq.com/x/*
// @match        *://m.v.qq.com/x/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://v.youku.com/v_*
// @match        *://m.youku.com/video/*
// @match        *://*.mgtv.com/b/*
// @match        *://*.mgtv.com/l/*
// @match        *://tv.sohu.com/v/*
// @match        *://m.tv.sohu.com/v*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376491/UN%20%E7%9B%92%E5%AD%90%20VIP%E8%A7%86%E9%A2%91%E5%85%A8%E7%BD%91%E8%A7%A3%E6%9E%90%20%2B%20VIP%E9%9F%B3%E4%B9%90%E5%85%A8%E7%BD%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/376491/UN%20%E7%9B%92%E5%AD%90%20VIP%E8%A7%86%E9%A2%91%E5%85%A8%E7%BD%91%E8%A7%A3%E6%9E%90%20%2B%20VIP%E9%9F%B3%E4%B9%90%E5%85%A8%E7%BD%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    var html = "\
<style type='text/css'>\
.un-menu {\
position: absolute;\
text-decoration:none;\
width: 60px;\
height: 60px;\
-webkit-border-radius: 50%;\
border-radius: 50%;\
background: #fdb933;\
left: 0;\
top: 200px;\
right: 0;\
bottom: 0;\
text-align: center;\
line-height: 60px;\
color: #fff;\
font-size: 20px;\
z-index: 999999;\
cursor: pointer;\
opacity: .75;\
}\
.un-menu:link { color: #fff; }\
.un-menu:visited { color: #fff; }\
.un-menu:hover { color: #fff; }\
.un-menu:active { color: #fff; }\
</style>\
<a class='un-menu' href='http://xx.xx21.cn/index/market/analytic?url=" + escape(escape(window.location.href)) + "'>VIP</a>";
    $("body").append(html);
})();