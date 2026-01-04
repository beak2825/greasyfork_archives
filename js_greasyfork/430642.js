// ==UserScript==
// @name         Fuck微博网页版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动关闭广告，关闭视频自动播放以及微博视频号语音
// @author       parhelion
// @include      https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430642/Fuck%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/430642/Fuck%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const sleep = (timeountMS) => new Promise((resolve) => {
  setTimeout(resolve, timeountMS);
});
    function BanAutoPlay(){
        //var str = document.getElementByClassName("woo-switch-main VideoList_switch_1-TPG").innerHTML;
        //var txt = str.replace("woo-switch-shadow woo-switch-checked","woo-switch-shadow");
        //document.getElementsByClassName("woo-switch-shadow woo-switch-checked")[0].classname = "woo-switch-shadow";
        var e = document.getElementsByClassName("woo-switch-shadow woo-switch-checked")[0];
        if(e){
        //e.setAttribute("class","woo-switch-shadow");
        e.click();
        }
    }

    function BanSBAudio(){
        //var str = document.getElementByClassName("woo-switch-main VideoList_switch_1-TPG").innerHTML;
        //var txt = str.replace("woo-switch-shadow woo-switch-checked","woo-switch-shadow");
        //document.getElementsByClassName("woo-switch-shadow woo-switch-checked")[0].classname = "woo-switch-shadow";
        var e = document.getElementsByClassName("AfterPatch_bgm_3mYmJ")[0];
        if(e){
        //e.setAttribute("class","woo-switch-shadow");
        //e.removeAttribute("autoplay");
        e.parentNode.removeChild(e);
        }
    }

   async function BanAD(){
        //var str = document.getElementByClassName("woo-switch-main VideoList_switch_1-TPG").innerHTML;
        //var txt = str.replace("woo-switch-shadow woo-switch-checked","woo-switch-shadow");
        //document.getElementsByClassName("woo-switch-shadow woo-switch-checked")[0].classname = "woo-switch-shadow";
        var e = document.getElementsByClassName("woo-font woo-font--cross morepop_action_bk3Fq morepop_cross_1Q1PF")[0];
        if(e){
        //e.setAttribute("class","woo-switch-shadow");
        e.click();
        await sleep(100);
        e = document.getElementsByClassName("woo-box-flex woo-box-alignCenter woo-pop-item-main")[0];
        e.click();
        console.log("AD delete");
        }
    }




    BanAutoPlay();
    setInterval(BanAutoPlay, 1000);
    setInterval(BanAD, 500);
    setInterval(BanSBAudio, 100);
    // Your code here...
})();
