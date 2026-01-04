// ==UserScript==
// @name         simple youtube detail statistics info
// @name:zh-CN   simple youtube detail statistics info
// @namespace    http://tampermonkey.net/
// @version      3.9.1
// @icon        https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png
// @description  change video info simple
// @description:zh-cn only video load info
// @author       Semi @wechat:wxsmcg
// @match        *://*.youtube.com/*
// @include     https://www.youtube.com*
// @grant        none
// @require    https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398868/simple%20youtube%20detail%20statistics%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/398868/simple%20youtube%20detail%20statistics%20info.meta.js
// ==/UserScript==
(function ($, undefined) {
  $(function () {
    'use strict';
    var ver = 3.0;
    //
    var tt1 = setInterval(function(){
        //console.log('TIMER');
        /*
        <div style="" class="toShow">
            <div>Connection Speed</div>
            <span>
                <span>
                    <div class="ytp-horizonchart" style="height: 1em; width: 120px;">
                        <canvas width="300" height="11" style="height: 11px; width: 120px;"></canvas>
                    </div>
                </span>
                <span style="margin-right: 20px;">3234 Kbps</span>
            </span>
        </div>

Video ID / sCPN                LOTbOmvaOJo / 39ZR YNAS 8AJZ
Viewport / Frames              1023x575 / 9 dropped of 107
Current / Optimal Res          854x480@30 / 854x480@30
Volume / Normalized            100% / 100% (content loudness -20.8dB)
Codecs                         vp09.00.51.08.01.01.01.01.00 (244) / opus (251)
Color                          bt709 / bt709
Connection Speed               1021 Kbps
Network Activity               0 KB
Buffer Health                  52.43 s
Mystery Text                   s:4 t:3.33 b:0.000-55.761 P
*/

        $(".html5-video-info-panel").css({"min-width":"18em","background": "rgba(28,28,28,0.4)"});
        // infoPanel
        var infoPanel = $(".html5-video-info-panel-content");
        //
        var tagList = {
            "ConnectionSpeed":{
                "parent":$(infoPanel).find("div:contains('Connection Speed')"),
                "attr":null,
                "canvas":null,
                "val":null
            },
            "NetworkActivity":{
                "parent":$(infoPanel).find("div:contains('Network Activity')"),
                "attr":null,
                "canvas":null,
                "val":null
            },
            "BufferHealth":{
                "parent":$(infoPanel).find("div:contains('Buffer Health')"),
                "attr":null,
                "canvas":null,
                "val":null
            },
        };

        if($(infoPanel).length){
           clearInterval(tt1);
            /*
            Connection Speed
            Network Activity
            Buffer Health
            连接速度
            网络活动
            缓冲状况
            */
            // filter
            tagList.ConnectionSpeed.parent.addClass("toShow");
            tagList.NetworkActivity.parent.addClass("toShow");
            tagList.BufferHealth.parent.addClass("toShow");

            tagList.ConnectionSpeed.parent.children('div').text("CS").css("width","2em").attr("title","Connection Speed | 连接速度 | 接続速度 | Vitesse de connexion");
            tagList.NetworkActivity.parent.children('div').text("NA").css("width","2em").attr("title","Network Activity | 网络活动 | ネットワーク活動 | Activités de réseau");
            tagList.BufferHealth.parent.children('div').text("BH").css("width","2em").attr("title","Buffer Health | 缓冲状况 | 緩衝状況 | état tampon");



            // to hide children , isnot fiind all spring
           $(infoPanel).children("div:not(.toShow)").css({'display':'none'});
            // zoom scale
           $(infoPanel).find(".ytp-horizonchart").css('width','100px');
           $(infoPanel).find(".ytp-horizonchart").parent().next().css('margin-right','20px');
           $(infoPanel).find("canvas").css('width','100px');

            // hidden color
            $(infoPanel).find("div:contains('Color')").remove();
            $(infoPanel).find("div:contains('Color')").next().remove();

            // hide Live info
            $(infoPanel).find("div:contains('Live Latency')").remove();
            $(infoPanel).find("div:contains('Live Mode')").remove();


            //
            //
            //
            // filter
            //console.log("len",list.length);
            // find element
            if(ver=='1.0'){
                 var list = $(".html5-video-info-panel-content>:not(div[style='display: none;'])");
                var index = [1,2,3,4,5,6,10];
                $(list).each(function(i,e){
                    // this i start 0 (search )
                    //console.log(i+1,$.inArray(i,index));
                    if( $.inArray(i+1,index)!=-1 ){
                        $(list[i]).css({"display":"none","visibility":"hidden"});
                    }
                });
                $(list[5]).find('div').css("color","#000");
                $(list[5]).find('span').remove();
            }
            //
        }
    },1500);
  });
})(window.jQuery.noConflict(true));


