// ==UserScript==
// @name         小帅的QQ音乐下载脚本 小帅长期维护ing...每天进步一点点！
// @namespace    XiaoShuai_QQMusic_script
// @version      1.0.0.0
// @description  【自用】小帅改QQ音乐下载
// @author       小帅
// @match        *://music.163.com/*
// @match        *://y.qq.com/*
// @require      https://lib.baomitu.com/jquery/3.5.1/jquery.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @charset		 UTF-8
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/415442/%E5%B0%8F%E5%B8%85%E7%9A%84QQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%20%E5%B0%8F%E5%B8%85%E9%95%BF%E6%9C%9F%E7%BB%B4%E6%8A%A4ing%E6%AF%8F%E5%A4%A9%E8%BF%9B%E6%AD%A5%E4%B8%80%E7%82%B9%E7%82%B9%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/415442/%E5%B0%8F%E5%B8%85%E7%9A%84QQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%20%E5%B0%8F%E5%B8%85%E9%95%BF%E6%9C%9F%E7%BB%B4%E6%8A%A4ing%E6%AF%8F%E5%A4%A9%E8%BF%9B%E6%AD%A5%E4%B8%80%E7%82%B9%E7%82%B9%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;
    //音乐下载：无损音乐、封面、歌词
    var musicvip={};
    musicvip.operation=function(){
        var reWY = /163(.*)song/i;
        var reQQ = /QQ(.*)song/i;
        var reKG = /kugou(.*)song/i;

        //var ayaMusicWebsite2 = "https://music.liuzhijin.cn/?url=";
        //var ayaMusicTitle2 = "https://music.liuzhijin.cn/?name=@name@&type=netease";
        var vipapi = "https://xx.kkip.top/qq_music.php?get=";
        var vipBtn = '<div>';
        vipBtn += '<a target="_blank" id="ayasongurl999" style="margin:5px 10px 5px 0px;display:inline-block;padding:4px 8px;background-color:#FF410F;color:#FFF;vertical-align:bottom;text-decoration:none;font-size:13px;"><b>小帅免费下载</b></a>';
        //vipBtn += '<a target="_blank" id="ayasongtitle999" style="margin:5px 0px;display:inline-block;padding:4px 8px;background-color:#FF410F;color:#FFF;vertical-align:bottom;text-decoration:none;font-size:13px;"><b>歌名搜索</b></a>';
        vipBtn += '</div>';
        if(reWY.test(window_url)){
            var $title = $('.u-icn-37');
            $title.parent('.hd').after(vipBtn);
            var titleText = $(".tit").text();
            $('#ayasongurl999').attr('href',vipapi + window.location.href + "&title=" + titleText);
        }else if(reQQ.test(window_url)){
            var $title = $('.data__name_txt');
            var titleText = $(".data__name_txt").text();
            $title.parent('.data__name').after(vipBtn);
            $('#ayasongurl999').attr('href',vipapi + window.location.href + "&title=" + titleText);
        }else if(reKG.test(window_url)){
            setTimeout(function(){
                var $title = $('.audioName');
                $title.parent('.songName').after(vipBtn);
                var titleText = $(".audioName").text();
                $('#ayasongurl999').attr(vipapi,"http://xx.kkip.top/qq_music.php?get=" + window.location.href + "&title=" + titleText);
            },1200);
        }
    };
    musicvip.start=function(){
        if(window_url.indexOf("music.163.com")!=-1 || window_url.indexOf("y.qq.com")!=-1 || window_url.indexOf("www.kugou.com")!=-1){
            musicvip.operation();
        }
    };
    musicvip.start();


    // 获取URL并解析出来音乐编号，然后访问API获取下载链接，最后跳转下载
    function jiexi(URL){
        //获取音乐编号
        //正则表达式 https://y.qq.com/n/yqq/song/(.*?).html
        var url,UID,result;
        url = URL.replace("https://y.qq.com/n/yqq/song/","");
        url = url.replace(".html","");
        UID = url;
        window.open("http://xx.kkip.top/qq_music.php?get=" + url);
    }
    
    // Your code here...
})();