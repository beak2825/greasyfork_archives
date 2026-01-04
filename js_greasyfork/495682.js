// ==UserScript==
// @name         cdcas社会gy刷课
// @description  学堂在线自动播放下一集（仅在成都文理学院测试成功，其他学校没试）
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @license MIT
// @author       peter
// @match        https://gyxy.cdcas.com/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cdcas.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495682/cdcas%E7%A4%BE%E4%BC%9Agy%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/495682/cdcas%E7%A4%BE%E4%BC%9Agy%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var playNext = function(){
        var localElement = $('.detmain-navlist ').parent().find('.item a').index($('a.on'));
        var sameChaperNameArray = $('.detmain-navlist ').parent().find('.item a');
        if(localElement == (sameChaperNameArray.length-1)){
            $('video')[0].onended = function(){
                 alert("跳过")
            }
        }else{
            setTimeout(function(){
                async : $(sameChaperNameArray[localElement+1])[0].click();
            },5000);
        }
    }
    $(document).ready(function(){
        var timer = setInterval(function(){
            if($('video').length && $('video')[0].readyState == 4){
                if($('video')[0].readyState == 4){
                    if($('video')[0].paused){
                        console.log("paused");
                        $('video')[0].play();
                    }
                    $('video')[0].onended = function(){
                        playNext();
                    }
                     $('video')[0].muted = true;
                    $('video')[0].playbackRate = 1.0;
                    $('video')[0].currentTime = 0;
                   // $('video')[0].volume = 0;
                    clearInterval(timer);
                }
            }
        },1000);
    });
})();