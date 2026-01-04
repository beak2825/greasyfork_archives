// ==UserScript==
// @name         JavBus会员视频免费播放
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  免费播放JavBus收费视频，并且去除了悬浮广告
// @author       c.c.木头
// @include      *://hd1080thd.club/*
// @include      *://hdthd.club/*
// @include      *://thd1024.club/*
// @include      *://91thd80.club/*
// @include      *://boxthd.club/*
// @include      *://thdaq.club/*
// @include      *://92thd.club/*
// @include      *://521thd.club/*
// @include      *://thd521.club/*
// @include      *://520thd.club/*
// @include      *://rhathd.club/*
// @include      *://fieethd.club/*
// @include      *://thd2019.club/*
// @include      *://thdgq.club/*
// @include      *://lookthd.club/*
// @include      *://javbus.91thd.me/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @require      http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/385632/JavBus%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/385632/JavBus%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = unsafeWindow.$
    var videojs = unsafeWindow.videojs

    if(window.location.pathname.startsWith('/play')){
        handlePlayView()
    }else{
        handleListView()
    }

    $('div.kefudiv').remove()
    $('div.appDownLoad').remove()

    function handlePlayView(){
        var videoTitle = GM_getValue('video_title')
        document.title = videoTitle
        var titleElement = $('h3.panel-title').get(0)
        titleElement.innerHTML = videoTitle

        var videoImageSrc = GM_getValue('video_image_src')
        var reg=new RegExp("(-[sb])*.jpg","g")
        var videoSrc = videoImageSrc.replace(reg,'.m3u8')
        var videoPreview = videoImageSrc.replace(reg,'.jpg')
        replaceVideoSrc(videoSrc,videoPreview)

        $('div.row div.panel div.panel-body div.thumbnail a').click(function(event){
            event.preventDefault()
            matchInformation(this)
        })
    }

    function replaceVideoSrc(videoSrc,videoPreview){
        var videoPlayer=$("#thd-video_html5_api").get(0);
        if(typeof(videoPlayer)!="undefined"){
            var myPlayer = videojs('thd-video_html5_api');
            myPlayer.dispose();
        }
        var id="thd-video_html5_api";
        $("#pldiv").html("<video id='"+id+"' style='width:100%' poster='" + videoPreview + "' class='video-js' tabindex='-1' preload='auto' controls ></video>");
        $("#"+id).html("<source src='" + videoSrc + "' type='application/x-mpegURL'>");
        videojs(id, {}, function(){
            var myPlayer = videojs(id);
            videojs(id).ready(function(){
                console.log("视频初始化完成 ")
            });
        });
    }

    function handleListView(){
        $('div.row div.panel div.panel-body div.thumbnail a').click(function(event){
            event.preventDefault()
            matchInformation(this)
        })

        $('div.xiaolunbo div div a').click(function(event){
            event.preventDefault()
            matchInformation(this)
        })

        $('div#carousel-example-generic div.carousel-inner div.item a').click(function(event){
            event.preventDefault()
            matchInformation(this)
        })

        matchFreeVideo()
    }

    function matchFreeVideo(){
        var freeVideo = $('div#freeMovies div.panel div.panel-body div.thumbnail a').get(0)
        if(freeVideo && freeVideo.href){
            console.log('匹配到免费视频：'+freeVideo.href)
            GM_setValue('free_video_src',freeVideo.href)
        }
    }

    function matchInformation(container){
        var aElement = $(container)
        var imageElement = aElement.find('img').get(0)
        var imageTitle = container.title
        var imageSrc = imageElement.src

        console.log("匹配到视频："+imageTitle)
        GM_setValue('video_title',imageTitle)
        GM_setValue('video_image_src',imageSrc)

        var freeVideoSrc = GM_getValue('free_video_src')
        window.location.href = freeVideoSrc
    }
})();

