// ==UserScript==
// @license MIT
// @name         快猫视频 For 19jtv.site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本仅用于 19jtv.site 站点，可免费观看vip视频，暂不支持自动注册，自动登录功能
// @author       You
// @include      http://19jtv.site/*
// @icon         https://www.kmbb59.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/440404/%E5%BF%AB%E7%8C%AB%E8%A7%86%E9%A2%91%20For%2019jtvsite.user.js
// @updateURL https://update.greasyfork.org/scripts/440404/%E5%BF%AB%E7%8C%AB%E8%A7%86%E9%A2%91%20For%2019jtvsite.meta.js
// ==/UserScript==
// ==/UserScript==

(function() {
    'use strict';

    let pageUrl = document.location.href;
        let playerUrl = pageUrl.replace("/play/", "/player/")

        let playerHtml = `
        <div>
            <div class="canPlayVideoFirstShowBg">
                <div class="MacPlayer" style="z-index:99999;width:100%;height:100%;margin:0px;padding:0px;">
                    <div id="player" name="player_if"
                    style="z-index:9;width:100%;height:100%;" border="0" marginWidth="0" frameSpacing="0" marginHeight="0"
                    frameBorder="0" scrolling="no" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen"
                    msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen"
                    webkitallowfullscreen="webkitallowfullscreen">

                    </div>
                </div>
            </div>
            <div id="videoBigBg" class="videoBigBg">
            </div>
            <link href="/addons/dplayer/static/DPlayer.min.css" rel="stylesheet">
            <script src="/static/js/jquery.js"/>
            <script src="/addons/dplayer/static/hls.min.js"/>
            <script src="/addons/dplayer/static/DPlayer.min.js"/>

        </div>`


        $.ajax({
            url: playerUrl,
            type: "GET",
            dataType: "html",
            data: "",
            timeout: 5000,
            beforeSend: function (XHR) {

            },
            error: function (XHR, textStatus, errorThrown) {
                console.log(XHR, textStatus, errorThrown)
            },
            success: function (data) {
                let resHtml = data.replace("$('.MacPlayer').html( $('.player_showtry').html() );", "")
                let text = JSON.parse(resHtml)
                let res = text.match(/var player_aaaa=(\{.*?\})/)[1]
                window.player_aaaa = JSON.parse(res)
                let pic = "";
                if(document.querySelector("#videoContent .backImg img")){
                    pic = document.querySelector("#videoContent .backImg img").src
                }
                $(".exchangeBg").hide()

                $(".MacPlayer").empty()
                $(".MacPlayer").html(playerHtml)

                $(".userStatusBg.split").empty()
                $(".userStatusBg.split").html(playerHtml)

                play(player_aaaa,pic)

            },
            complete: function (XHR, TS) {
                console.log(XHR, TS)
            }
        })

        function play(player_aaaa,pic) {
            var dp = new DPlayer({
                element: document.getElementById('player'),                       
                autoplay: false,                                                   
                theme: '#FADFA3',                                                  
                loop: true,                                                        
                lang: 'zh',                                                        
                screenshot: true,                                               
                hotkey: true,                                                      
                preload: 'auto',                                         
                video: {                                                 
                    url: player_aaaa.url,                                   
                    pic: pic                                        
                }
            });
            console.log(dp)
        }

})();