// ==UserScript==
// @name         BiliToPlusButton
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bilibili转Biliplus按钮
// @require      https://code.jquery.com/jquery-latest.js
// @author       Hakuame
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/bangumi/play/ep*
// @include      *://www.bilibili.com/bangumi/play/ss*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371909/BiliToPlusButton.user.js
// @updateURL https://update.greasyfork.org/scripts/371909/BiliToPlusButton.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("Button");
    button.innerHTML = "<a><font color=\"white\">To<br>Biliplus</font></a>";
    button.className = "biliplus";

    //按钮CSS
    button.style = "bottom:50%;\
                    left:0px;\
                    height:54px;\
                    display: block;\
                    border: none;\
                    width: 70px;\
                    border-radius: 0 6px 6px 0;\
                    color: #fff;\
                    background: #00b5e5;\
                    text-align: center;\
                    font-size: 14px;\
                    position:absolute;\
                    z-index:99999;\
                    -webkit-transition: all .2s ease-in-out;\
                    transition: all .2s ease-in-out;";
    //按钮hover效果CSS
    button.onmouseover = function hoverEffect(){
        $(".biliplus").hover(function(){
            $(this).css("background-color", "#00A3CC");
            $(this).css("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19");
        }, function(){
            $(this).css("background-color", "#00b5e5");
            $(this).css("box-shadow", "0 0 0 0");
        });
    }

    //添加按钮到页面上
    document.body.appendChild(button);

    /**
    普通视频直接切换连接转向Biliplus
    番剧电影等正版视频解析av号连接后再转向Biliplus
    */
    button.onclick = function redirectBP(){
        var currURL = location.href;
        var newURL;

        //currURL.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.biliplus.com/video');

        //普通视频
        if(currURL.includes("video")){
            newURL = currURL.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.biliplus.com/video');
        }
        //官网正版视频
        else{
            //获得av连接
            var avLink = document.querySelector(".info-sec-av").href;
            newURL = avLink.replace(/\:\/\/www\.bilibili\.com\/video/, '://www.biliplus.com/video');
        }

        //转向biliplus
        location.assign(newURL);
    }
})();