// ==UserScript==
// @name         微信公众号助手（综合助手）
// @namespace    http://rainytop.com/
// @version      0.4
// @description  Wechat Helper.
// @author       xiedali
// @match       https://mp.weixin.qq.com/cgi-bin/home*
// @match       https://mp.weixin.qq.com/misc/useranalysis*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license MIT

// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478369/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8A%A9%E6%89%8B%EF%BC%88%E7%BB%BC%E5%90%88%E5%8A%A9%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/478369/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8A%A9%E6%89%8B%EF%BC%88%E7%BB%BC%E5%90%88%E5%8A%A9%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==


// 添加 jQuery 脚本
// require 部分需要引入未压缩的jquery（否则在图文编辑页面会出现无法加载编辑页面的问题，非常奇怪）
var $ = window.jQuery;


//1. 记录从昨天（最后一次访问用户分析页面的时间）到现在总共增加的用户数
$(document).ready(function(){


    //A. 在“用户分析”页面写入cookie
    var yesterday_user_count=$(".yesterday-all__count");
    if(yesterday_user_count){
        yesterday_user_count= $(yesterday_user_count[3]).text();

        if(yesterday_user_count){
            //alert(yesterday_user_count);
            $.cookie('yesterday_user_count_cookie', yesterday_user_count, {path: '/' });
            //$.cookie('yesterday_date', yesterday_user_count);
        }else{
            //alert("no");
        }
    }

    //B. 在“后台首页” 展示最近增加的用户数
    var yesterday_user_count_cookie =$.cookie('yesterday_user_count_cookie');
    if(yesterday_user_count_cookie){
        var str = yesterday_user_count_cookie;
        var yesterday_num = parseInt(str.replace(/,/g, ''));
        //alert(yesterday_num);

        var objDisplay= $(".weui-desktop-user_num .weui-desktop-user_sum span");
        var today_string = objDisplay.html();
        var today_num = parseInt(today_string.replace(/,/g, ''));

        var diff= today_num - yesterday_num;
        objDisplay.html(objDisplay.html()+"<span style='font-size: 16px;'> (共+"+ diff +")</span>");
    }else{
        //alert("no cookie");
    }
});