/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         小红书提取文章配图
// @version      0.1.2
// @namespace    http://tampermonkey.net/
// @description  当打开小红书文章网页时，弹出新窗口显示作者名、文章时间、配图或视频、文章标题、文章内容，方便另存为笔记形式
// @author       Yuan2183
// @match        http*://www.xiaohongshu.com/explore*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458677/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%8F%90%E5%8F%96%E6%96%87%E7%AB%A0%E9%85%8D%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458677/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%8F%90%E5%8F%96%E6%96%87%E7%AB%A0%E9%85%8D%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
            //设置通用IP地址前缀
            var articleUrl = "https://www.xiaohongshu.com";

            //获取作者名及跳转连接
            var authorNameHref = articleUrl + $("a.name:first").attr("href");
            var authorNameText = $("a.name:first").text();

            //获取笔记时间
            var articleDate = $("div.date").text();
            articleDate = articleDate.replace(/-/g,'/');

            //获取笔记标题
            var articleTitle = $(".title").text();

            //获取笔记内容
            var articleDesc = $(".desc").html();
            articleDesc = articleDesc.replace('<br>','<p></p>');

            //遍历配图
            $("div.note-scroller").before("<div id='img-location'></div>");
            $(".swiper-slide.zoom-in:not(.swiper-slide-duplicate)").each(
                function(i, item){
                    var style = $(item).attr('style');
                    var url1 = style.replace('background-image: url("', '');
                    var url = url1.replace('");', '');
                    $("div#img-location").append("<a href='"+url+"'><image class='img' style='width: 100px;' src='"+url+"'></a>");
                }
            );
            //获取视频
            var videoSrc = $(".browser-player").attr("src");
            //var src = videoSrc.replace('','sns-video-bd');

            //获取当前窗口的url
            let websiteNow = location.href;
            var loc = websiteNow.indexOf("?") ;
            if(loc != -1){websiteNow = websiteNow.substr(0,loc);}

            //打开新窗口
            var myWindow = window.open("", "MsgWindow");

            //取新窗口父窗口中id为img-location的元素
            var img = myWindow.opener.document.getElementById("img-location");

            //将作者名、文章时间、配图或视频、文章标题、内容写入新窗口
            $(myWindow.document.body).append(websiteNow);
            $(myWindow.document.body).append(
                '<div><a href="'+authorNameHref+'">'+authorNameText+'</a></div>'
                +
                '<div>'+articleDate+'</div>'
            );
        if($(".browser-player").length > 0){
            $(myWindow.document.body).append(
                '<div><a href="'+videoSrc+'">'+videoSrc+'</a></div>'
            );
        }else{
            $(myWindow.document.body).append(img);
        }
            $(myWindow.document.body).append(
                '<h1>'+articleTitle+'</h1>'
                +
                '<div>'+articleDesc+'</div>'
            );
        };
})();