// ==UserScript==
// @name auto click load more
// @description auto click load more useful button
// @version 1.1
// @grant none
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @include http://www.zhihu.com/*
// @include https://www.zhihu.com/*
// @include https://vcrypt.net/*
// @include http://www.instagram.com*
// @include https://www.instagram.com*
// @include http://www.auroravid.to/*
// @include http://www.porntube.com/videos/*
// @include http://www.85porn.net/video/*
// @include http://www.85po.com/video/*
// @include http://www.fastvideo.me/*
// @include http://www.rapidvideo.org/*
// @include http://swzz.xyz/*
// @include https://www.keeplinks.eu/*

// @include http://vcrypt.net/*

// @namespace   https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/40622/auto%20click%20load%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/40622/auto%20click%20load%20more.meta.js
// ==/UserScript==

var time_interval = 500; //运行间隔(毫秒)
var lo; //当前网址 *html5的历史前进后退功能导致页面载入不刷新,例如Y2B,要不断检测页面对应的按钮
var dis = 4000; //load_more按钮距离底边距离像素

var autotimer = setInterval(auto,time_interval);

var sites = [
    {
    "urls":[
       /https?:\/\/www.rapidvideo.org/],
    "btns":[{
    "id":"#proceed_to.button.green",
    "distance":0}]
    },
     {
    "urls":[
       /https?:\/\/vcrypt.net/],
    "btns":[{
    "id":"input.btncontinue",
    "distance":0}]
    },
     {
    "urls":[
       /https?:\/\/www.keeplinks.eu/],
    "btns":[{
    "id":"a#btnsubmit",
    "distance":0}]
    },
    {
    "urls":[
       /https?:\/\/www.auroravid.to/],
    "btns":[{
    "id":"Continue to the video",
    "distance":0}]
    },
      {
    "urls":[
       /https?:\/\/swzz.xyz/],
    "btns":[{
    "id":"a.btn-wrapper",
    "distance":0}]
    },
    {
    "urls":[
       /https?:\/\/www.auroravid.to/],
    "btns":[{
    "id":"Continue to the video",
    "distance":0}]
    },
{
    "urls":[
       /https?:\/\/www.fastvideo.me/],
    "btns":[{
    "id":"#btn_download.button.green",
    "distance":0}]
    },
    {
    "urls":[
        /https?:\/\/www.youtube.com\/user\/.+/gi,
        /https?:\/\/www.youtube.com\/channel\/.+/gi],
    "btns":[{
    "id":".load-more-text",
    "distance":0}]
    }, //youtube_user_page
    {
    "urls":[
        /https?:\/\/www.youtube.com\/watch\?.+/gi,
        /https?:\/\/www.youtube.com\/watch2\?.+/gi],
    "btns":[{
    "id":"[data-uix-load-more-target-id=comment-section-renderer-items]",
    "distance":0},
    {
    "id":"#watch-more-related-button",
    "distance":0}]
    }, //youtube_watch_page
    {
    "urls":[
        /https?:\/\/www.zhihu.com\/question\/.+/gi,
        /https?:\/\/www.zhihu.com\/people\/.+/gi,
        /https?:\/\/www.zhihu.com\/search\?.+/gi],
    "btns":[{
    "id":"[aria-role=button]",
    "distance":0}]
    }, //zhihu_question
    {
    "urls":[
        /https?:\/\/[a-z]+.pornhub.com\/view_video.php\?viewkey=.+/gi,
        /https?:\/\/[a-z]+.pornhubpremium.com\/view_video.php\?viewkey=.+/gi],
    "btns":[{
    "id":"a.greyButton.light.more_related_btn.nav-related",
    "distance":0}]
    },
    {
    "urls":[
        /https?:\/\/www.porntube.com\/videos\/.+/gi],
    "btns":[{
    "id":"button.btn.btn-simple.btn-large.load-more-videos",
    "distance":0}]
    },
    {
    "urls":[
        /https?:\/\/www.85porn.net\/video\/.+/gi,
        /https?:\/\/www.85po.com\/video\/.+/gi],
    "btns":[{
    "id":"a[id^=\"next_related_videos\"]",
    "distance":0}]
    },
    {
    "urls":[
        /https?:\/\/[a-z]+.pornhub.com\/feeds/gi,
        /https?:\/\/[a-z]+.pornhubpremium.com\/feeds/gi,
        /https?:\/\/[a-z]+.pornhub.com\/users/gi,
        /https?:\/\/[a-z]+.pornhubpremium.com\/users/gi],
    "btns":[{
    "id":"#moreDataBtn",
    "distance":0}]
    },
    {
    "urls":[
        /https?:\/\/www.instagram.com\/?.+/gi],
    "btns":[{
    "id":"a._oidfu",
    "distance":0}]
    },
    {
    "urls":[
        /https?:\/\/www.youtube.com\/channel777\/.+/gi,
        /https?:\/\/www.youtube.com\/channel999\/.+/gi],
    "btns":[{
    "id":"bt3",
    "distance":0},
    {
    "id":"bt4",
    "distance":0}]
    } // example
]

function auto()
{
    try
    {
        lo = window.location; //当前网址
        for ( x in sites )
        {
            for ( u in sites[x].urls )
            {
                //sites[x].urls[u].test(lo) 为什么连续2次,第2次就变成false呢
                //console.log("reg | "+sites[x].urls[u] +" url | "+lo + " | "+sites[x].urls[u].test(lo));
                //console.log("1_ "+sites[x].urls[u] + "2_ "+sites[x].urls[u].test(lo));
                if(sites[x].urls[u].test(lo))
                {
                    //console.log("bbb");
                    for ( b in sites[x].btns )
                    {
                        try
                        {
                            //console.log(sites[x].btns[b].distance+"|"+lo+"|"+sites[x].urls[u])
                            //console.log(sites[x].btns[b].id)
                            if(document.querySelector(sites[x].btns[b].id))
                            {
                                //console.log("|"+sites[x].btns[b].id);

                                if(tob(document.querySelector(sites[x].btns[b].id))<dis && document.querySelector(sites[x].btns[b].id).getBoundingClientRect().top != sites[x].btns[b].distance)
                                {
                                    sites[x].btns[b].distance = document.querySelector(sites[x].btns[b].id).getBoundingClientRect().top;
                                    document.querySelector(sites[x].btns[b].id).click();
                                    console.log("auto_click_load_more_1_times");
                                }
                            }
                        }catch(e){console.log(e)}
                    }
                }
            }

        }
    }catch(e)
    {
        console.log("error"+e);
    }
}

function tob(x) //返回元素上边到浏览器窗口底边距离,正值表示元素上边在浏览器底边以下的距离,负值表示元素在浏览器底边以上
{
    var bh = document.documentElement.clientHeight;//浏览器可视高
    var ett = x.getBoundingClientRect().top;//元素距离浏览器上边高
    return ett - bh;
}