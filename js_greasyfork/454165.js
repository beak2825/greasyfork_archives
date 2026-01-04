// ==UserScript==
// @name         Fuck微博网页版Fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动关闭广告，关闭视频自动播放以及微博视频号语音，强制跳转最新微博（避免植入）
// @author       parhelion,rainssong
// @include      https://weibo.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454165/Fuck%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5%E7%89%88Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/454165/Fuck%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5%E7%89%88Fix.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const sleep = (timeountMS) => new Promise((resolve) => {
        setTimeout(resolve, timeountMS);
});

    function BanAutoPlay(){
        var e = document.getElementsByClassName("woo-switch-shadow woo-switch-checked")[0];
        if(e){
            e.click();
        }
    }

    function BanSBAudio(){
        var e = document.getElementsByClassName("AfterPatch_bgm_3mYmJ")[0];
        if(e){
        e.parentNode.removeChild(e);
        }
    }

   async function BanAD(){
        var e = document.getElementsByClassName("woo-font woo-font--cross morepop_action_bk3Fq morepop_cross_1Q1PF")[0];
        if(e)
        {
            e.click();
            await sleep(100);
            e = document.getElementsByClassName("woo-box-flex woo-box-alignCenter woo-pop-item-main")[0];
            if(e.textContent=="不感兴趣")
                e.click();
            e = document.getElementsByClassName("woo-box-flex woo-box-alignCenter woo-pop-item-main")[2];
            if(e.textContent=="屏蔽此条微博")
                e.click();
        }
    }

    //强制跳转最新微博
    function NewWB()
    {
        if(window.location.href=="https://weibo.com/")
        {
            var target=$("div[title='最新微博']")[0]?.parentElement
            console.log(target)
            if(target?.href)
                window.location.href=target.href;
        }
    }


    BanAutoPlay();
    setInterval(BanAutoPlay, 1000);
    setInterval(BanAD, 500);
    setInterval(BanSBAudio, 100);
    setTimeout(NewWB, 1000);
})();
