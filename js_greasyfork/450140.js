// ==UserScript==
// @name         DY无水印解析
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  DY
// @author       You
// @include        https://*.douyin.com/*
// @include        https://*.iesdouyin.com/*
// @include        https://*.*douyin*.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450140/DY%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/450140/DY%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //跳转Mp4/mp3 执行下载
    if( $("body").children().length===1){
       let mp4_url = $('video source').attr('src');
       var d = new Date();
       var name = 'DY_'+(d.getMonth()+Number(1))+'-'+d.getDate()+'-'+d.getHours()+'-'+d.getMinutes();
       GM_download({
           url: mp4_url,
           name: name+".mp4",
           saveAs: true,
       })
       return;
    }



    let url_prefix = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=';
    let location = window.location.href;

    let id = 0;
    if(window.location.href.includes('iesdouyin'))
        id = location.match('video/(.*)/')[1];
    else
        id = location.match('video/(.*)(#|$)')[1];


    const url = url_prefix + id;
    console.log('Request:'+url);

    $(".xg-video-container").before('<span id="dy_loading" style="position:absolute;color:#FFF;">解析中...</span>')

    var toNew = function(url){
        window.open();
        location.href(url);
    }
    GM_xmlhttpRequest({
        method: "get",
        url: url,
        onload: function(response){
            $("#dy_loading").remove();
            let data = JSON.parse(response.responseText);
            let play_url = (data.item_list[0].video.play_addr.url_list[0]).replace('wm','');
            let mp3_url = (data.item_list[0].music.play_url.url_list[0]);

            console.log(' MP4:',play_url);
            console.log(' MP3:',mp3_url);

            $(".xg-video-container").before('<select class="login-btn" id="mp4_select" style="opacity:0.5;position:absolute;left:0;top:0;z-index: 999;background:#fff;"><option value="view" >MP4</option><option value="download">Download</option></select>');
            $(".xg-video-container").before('<a href='+mp3_url+' target="_blank" style="opacity:0.5;position:absolute;left:3em;top:0;z-index: 999;background:#fff;">MP3</a>');

            $(".btn-wrap").html('');
            $(".btn-wrap").append('<div class="login-btn" onclick="window.open(\''+play_url+'\')" target="_blank" style="opacity:0.5;z-index: 999;background:#fff;">MP4</div>');
            $(".btn-wrap").append('<div class="login-btn" onclick="window.open(\''+mp3_url+'\')" target="_blank" style="margin-left: 50px;opacity:0.5;z-index: 999;background:#fff;">MP3</div>');

            $("#mp4_select").on('change',function(){

                if( $(this).val()=='view')
                    window.open(play_url);
                else if( $(this).val()=='download'){
                   var d = new Date();
                   var name = 'DY_'+(d.getMonth()+Number(1))+'-'+d.getDate()+'-'+d.getHours()+'-'+d.getMinutes();
                   GM_download({
                       url: play_url,
                       name: name+".mp4",
                       saveAs: true,
                   })

                }

            })

        }
    })





})();