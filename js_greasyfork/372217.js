// ==UserScript==
// @name         Bilibili Auto HD
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  bilibili自动高清
// @author       Formax
// @match        *://www.bilibili.com/video/av*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372217/Bilibili%20Auto%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/372217/Bilibili%20Auto%20HD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetRes = 80;
    const richMan = false;
    const autoPlay = true;
    // Choices for targetRes are currently:
    //   116: "1080P60"
    //   74:  "720P60"
    //   112: "1080P+"
    //   ==========rich=======
    //   80:  "1080P"
    //   64:  "720P"
    //   32:  "480P"
    //   15:  "320P"
    //   0:   "auto"

    const richList = ["116","74","112"];

    function isRichQuality(res){
        return richList.indexOf(res)>0;
    }

    function clickHD(){
        var clickChange = false;
        //find all quality <li>
        var resList =$('.bui-select-quality-menu li.bui-select-item');
        for(var i=0;i<resList.length;i++){
            if(!clickChange){
                var res = resList[i].getAttribute("data-value");
                if(isRichQuality(res)&&!richMan){
                    continue;
                }
                else{
                    if(res<=targetRes){
                        //click
                        resList[i].click();
                        clickChange = true;
                    }
                }
            }
        };
    }

    function startPlay(){
        if(autoPlay && $('video.vsc-initialized')[0].paused){
            $('div.bilibili-player-video-btn.bilibili-player-video-btn-start').click()
        }
    }

    function getVisibleStatus(){
        var hidden,statuName;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            statuName = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "hidden";
            statuName = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "hidden";
            statuName = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "hidden";
            statuName = "webkitVisibilityState";
        }
        return document[statuName]=="visible";
    }

    function timerRefresh(){
        if($('video.vsc-initialized')[0] == undefined || $('video.vsc-initialized')[0].paused){
            if(getVisibleStatus()){
                setTimeout(function(){
                    startPlay();
                },888);
            }
            setTimeout(function(){
                timerRefresh();
            },1000);
        }
        else{
            setTimeout(function(){
                clickHD();
            },1000);
        }
    }

    jQuery(document).ready(function () {
        timerRefresh();
    });
})();