// ==UserScript==
// @name                研究生视频破解会员
// @namespace           https://tampermonkey.net.cn/
// @version             3.4.0
// @license             MIT
// @match               https://*.aidou.pro/*
// @match               https://*.aidou.art/*
// @match               https://*.aidoo.pw/*
// @match               https://*.aidoo.info/*
// @match               https://*.aido2.cc/*    
// @match               https://*.aido2.icu/*
// @icon                https://www6.aidou.pro/static/img/logo.png
// @grant               none
// @description         针对研究生视频网站的优化脚本，此脚本可以让用户观看全站视频,免费无任何注入
// @downloadURL https://update.greasyfork.org/scripts/505457/%E7%A0%94%E7%A9%B6%E7%94%9F%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/505457/%E7%A0%94%E7%A9%B6%E7%94%9F%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
   
   function loadScript(url, callback){
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('body')[0].appendChild(script);
        if (script.readyState){//IE
            script.onreadystatechange = function(){
                if (script.readyState == 'loaded' || script.readyState == 'complete'){
                    script.onreadystatechange = null;
                    callback();
                }
            }
        }else{
            script.onload = function(){
                callback();
            }
        }
    }
    loadScript('https://cdn.bootcdn.net/ajax/libs/hls.js/1.5.13/hls.js',function(){
        console.log('script loaded.');
        loadScript('https://cdn.bootcdn.net/ajax/libs/dplayer/1.27.1/DPlayer.min.js',function(){
            console.log('script loaded.');
    });
    });
   
    window.onload = function(){
    var line = localStorage.getItem("line") || "1";
    var cookie = {
        'set': function(name, value, days) {
            var key = name.match(/\w+\.m3u8/)[0];
            window.localStorage ? localStorage.setItem(key, value) : null;
        },
        'get': function(name) {
            var key = name.match(/\w+\.m3u8/)[0];
            var value = window.localStorage ? localStorage.getItem(key) : 0;
            return parseFloat(value);
        }
    };
    var isIOS = function() {
        if ((/(iPhone|iPad|iPod|iOS|macintosh)/i.test(navigator.userAgent))) {
            return true;
        }
        return false;
    };
    var initVideo = function(vod, picUrl) {
        var vodUrl = vod.vodPlayUrl + "?ios=1&line=" + line;
        $('<video src="' + vodUrl + '" poster="' + picUrl + '" width="100%" height="100%" playsinline="true" autoplay controls autobuffer type="application/vnd.apple.mpegurl"></video>').appendTo($("#video"));
        var $video = $("video");
    };
    var initDPlayer = function(vod, picUrl) {
        var vodUrl = vod.vodPlayUrl + "?line=" + line;
        var jump = "";
        var logo = '';
        var dp = new DPlayer({
            container: document.getElementById('formatVideo'),
            theme: '#4C8FE8',
            volume: 0.8,
            logo: logo,
            autoplay: false,
            preload: 'auto',
            video: {
                url: vodUrl,
                pic: picUrl,
                type: 'auto',
                defaultQuality: 0
            }
        });
        dp.on("fullscreen", function() {
            dp.notice("全屏已开启");
        });
        dp.on("fullscreen_cancel", function() {
            dp.notice("全屏已关闭");
        });
        dp.on('loadeddata', function() {
            cookie.get(vodUrl) ? dp.seek(cookie.get(vodUrl)) : dp.notice("视频已就绪");
            dp.on('timeupdate', function() {
                if (cookie)
                    cookie.set(vodUrl, dp.video.currentTime, 30);
            });
            Boot.addPlay({
                "vodId": vod.vodId
            });
        });
        dp.on('loadstart', function(e) {});
        dp.on('ended', function() {
            dp.notice("视频播放已结束");
            if (jump != '') {
                top.location.href = jump;
            }
        });
    };
    $(function() {
        Boot.getVod({
            "id": window.location.href.split('/', -1).pop().split('.', -1)[0],
            "line": line
        }, function(vod) {
            Boot.getCover(vod.vodPic, function(picUrl) {
                if (isIOS(vod, picUrl)) {
                    initVideo(vod, picUrl);
                } else {
                    initDPlayer(vod, picUrl);
                }
            });
        });
    });
    }
})();