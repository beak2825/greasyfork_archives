// ==UserScript==
// @name         B站快捷键页面全屏快捷键 bilibili webfullscreen
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  shortcut for bilibili website
// @author       wiekes XU
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      ??
// @downloadURL https://update.greasyfork.org/scripts/441979/B%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%A1%B5%E9%9D%A2%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE%20bilibili%20webfullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/441979/B%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%A1%B5%E9%9D%A2%E5%85%A8%E5%B1%8F%E5%BF%AB%E6%8D%B7%E9%94%AE%20bilibili%20webfullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        //var wide = document.getElementsByClassName("bpx-player-ctrl-wide")[0]
        //var web = document.getElementsByClassName("bpx-player-ctrl-web")[0]
        //var pip = document.getElementsByClassName("bpx-player-ctrl-pip")[0]
        document.onkeydown = function(e){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            //console.log(e.keyCode)
            var activeEle = document.activeElement.localName
            //console.log(activeEle)
            //console.log(1)
            if(activeEle == 'input' || activeEle == 'textarea'){
                return
            }
            if(e.keyCode == 71){
                document.getElementsByClassName("bpx-player-ctrl-web")[0].click();
            }else if(e.keyCode==72){
                document.getElementsByClassName("bpx-player-ctrl-wide")[0].click();
            }else if(e.keyCode==74){
                document.getElementsByClassName("bpx-player-ctrl-pip")[0].click();
            }else if(e.keyCode==82){
                document.getElementsByTagName("video")[0].currentTime=0;
            }else if(e.keyCode >= 48 && e.keyCode<=57 || e.keyCode===187 || e.keyCode===189){
                //document.getElementsByTagName("video")[0].video.playbackRate = 1
                // - 189 =187
                // 1 2 3 4 5 6 7 8 9 0
                // 49              57 48
                function playRate(speed){
                    document.querySelector('video').playbackRate = speed
                    console.log('test'.speed)
                }
                function addPlayRate(speed){
                    let tempSpeed = document.querySelector('video').playbackRate
                    tempSpeed>0.1 ? document.querySelector('video').playbackRate = (tempSpeed+speed).toFixed(2) : document.querySelector('video').playbackRate;
                }
                if(e.keyCode===48){
                    playRate(1)
                }else if(e.keyCode===49){ //1
                    playRate(0.25)
                    //document.querySelector('video').playbackRate = 0.25
                }else if(e.keyCode===50){ //2
                    playRate(0.5)
                }else if(e.keyCode===51){ //3
                     playRate(0.75)
                }else if(e.keyCode===52){ //4
                     playRate(1)
                }else if(e.keyCode===53){ //5
                     playRate(1.25)
                }else if(e.keyCode===54){ //6
                     playRate(1.5)
                }else if(e.keyCode===55){ //7
                     playRate(1.75)
                }else if(e.keyCode===56){ //8
                     playRate(2)
                }else if(e.keyCode===57){ //9
                     playRate(3)
                }else if(e.keyCode===187){ //-
                     addPlayRate(0.1)
                }else if(e.keyCode===189){ //=
                     addPlayRate(-0.1)
                }
            }
        }

    }
})();