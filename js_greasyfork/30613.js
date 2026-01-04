// ==UserScript==
// @name         辅助下载www.ifblue.net(若蓝格)杂志
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  打开一本杂志页面，点击“下载地址”，本脚本会自动获取百度网盘提取码，并自动输入，打开下载页面。
// @author       lemodd@qq.com
// @match        http://www.ifblue.net/download.html?pid=*
// @match        https://pan.baidu.com/share/init*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/30613/%E8%BE%85%E5%8A%A9%E4%B8%8B%E8%BD%BDwwwifbluenet%28%E8%8B%A5%E8%93%9D%E6%A0%BC%29%E6%9D%82%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/30613/%E8%BE%85%E5%8A%A9%E4%B8%8B%E8%BD%BDwwwifbluenet%28%E8%8B%A5%E8%93%9D%E6%A0%BC%29%E6%9D%82%E5%BF%97.meta.js
// ==/UserScript==

//v0.4说明
//用GM_setValue和GM_getValue来传递提取码
//不再用URL来传递

//url = window.location+'';
//url = window.location.toString();   //window.location并不是字符串，加空字符串，将其转换为字符串
url = String(window.location);   //或者这样
host = window.location.host;

//GM_log('host:'+host);

(function() {
    'use strict';

    if(host=='www.ifblue.net'){
        //在'www.ifblue.net'页面获取提取码
        var pwd = $('.infos li').eq(1).text().slice(-4);
        //保存提取码
        GM_setValue('pwd',pwd);

        //在'www.ifblue.net'页面获取资源的网盘地址
        var pan_url = $('#filelink center a').attr('href');

        //打开网盘页面
        window.location.href = pan_url;
    }

    if(host=='pan.baidu.com'){
        //获取刚才保存的提取码
        var pwd2 = GM_getValue('pwd');
        //GM_log('pwd:'+pwd);
        //输入提取吗
        $('#accessCode').val(pwd2);
        //打开下载页面
        $('.text').click();

    }

})();




















