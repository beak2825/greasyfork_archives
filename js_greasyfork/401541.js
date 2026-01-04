// ==UserScript==
// @name         壁纸图片下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  找出某些壁纸网站图片源地址，绕过登录，便于下载，目前支持【彼岸图网】【pixivision】【wallhaven】【美图集】【pixabay】
// @author       Priate
// @match        *://www.pixivision.net/*
// @match        *://pic.netbian.com/tupian/*
// @match        *://wallhaven.cc/w/*
// @match        *://photo.ihansen.org/*
// @match        *://pixabay.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401541/%E5%A3%81%E7%BA%B8%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/401541/%E5%A3%81%E7%BA%B8%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //彼岸图网
    if(document.location.host == 'pic.netbian.com'){
        $(".downpic a").unbind("click");
        var imgsrc = $('#img').children('img')[0].src;
        var dowlond_a = $('.downpic').children('a')[0];
        dowlond_a.href = imgsrc;
        dowlond_a.download = "";
        dowlond_a.innerText = "通过脚本" + dowlond_a.innerText;
        $('#login_opacity_bg').remove();
        $('.tbox').remove();
        $('#img').click(function(){
            openImg(imgsrc);
        })

    }
    //pixivision
    if(document.location.host == 'www.pixivision.net'){
        var all_a = document.getElementsByTagName("a")
        for(var num = 0; num < all_a.length; num++){
            if(all_a[num].href.match(/https:\/\/www.pixiv.net.*/)){
                var img = $(all_a[num]).find('img')[0]
                if(img){
                    all_a[num].href = img.src;
                    all_a[num].download = "";
                }
            }
        }
    }
    //wallhaven
    if(document.location.host == 'wallhaven.cc'){
        $("#wallpaper").unbind("click");
        $('#wallpaper').click(function(){
            downloadImg($('#wallpaper').attr('src'));
        }).hover(function(){$(this).css('cursor', 'pointer')})
    }

    //美图集
    if(document.location.host == 'photo.ihansen.org'){
        $(document).on("click",".viewer-move",function(){
            downloadImg($(this).attr('src'));
        })
    }
    //pixabay
    if(document.location.host == 'pixabay.com'){
        $(document).on("click","#media_container>img",function(){
            downloadImg($(this).attr('src'));
        })
        $("#media_container").css('cursor', 'pointer')
    }

    function downloadImg(src){
        var $a = $("<a></a>").attr("href", src).attr("download", "").attr('target', '_blank')
        $a[0].click();
    }

    function openImg(src){
        var $a = $("<a></a>").attr("href", src).attr('target', '_blank')
        $a[0].click();
    }
})();