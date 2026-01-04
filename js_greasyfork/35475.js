// ==UserScript==
// @name         头条禁用自动播放及去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yungs
// @match        http*://www.ixigua.com/*
// @match        http*://www.toutiao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35475/%E5%A4%B4%E6%9D%A1%E7%A6%81%E7%94%A8%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%8F%8A%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/35475/%E5%A4%B4%E6%9D%A1%E7%A6%81%E7%94%A8%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%8F%8A%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.onload=Delay();
   window.onmousewheel = document.onmousewheel=RemoveAD;
    function Delay(){
        setTimeout(PauseVideo,2000);
        setTimeout(RemoveAD,300);
    }
    function PauseVideo(){
        console.log("register event");
        var v = document.body.getElementsByTagName("video");
        if(v.length===0){
            return;
        }
        v[0].addEventListener("ended",function(){
            console.log("over");
            document.getElementsByClassName("cancel")[0].click();
        });
    }
    function RemoveAD(){
        console.log("Check AD");
        var ad =  document.body.getElementsByClassName("item J_add   ");
        if (ad.length===0){
            return;
        }
        for(var i = 0;i < ad.length;i++){
            ad[i].remove();
            console.log("remove ad");
        }
    }
})();