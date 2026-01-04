// ==UserScript==
// @name         move zhibo ad for huya
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       You
// @match        *://www.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374952/move%20zhibo%20ad%20for%20huya.user.js
// @updateURL https://update.greasyfork.org/scripts/374952/move%20zhibo%20ad%20for%20huya.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //huyatv
    document.getElementsByClassName("room-footer")[0].style.display="none";
    console.info(document.getElementsByClassName("room-footer")[0]);
    //head img
    if(document.getElementById("J_spbg")) {
        document.getElementById("J_spbg").style.display="none";
    }
    //room-core-r
    document.getElementsByClassName("room-core-r")[0].style.display="none";


    setTimeout(function(){
        var targetNode = document.getElementById('player-gift-wrap');
        var observer = new MutationObserver(function(){
            if(targetNode.style.display !='none' ){//exit full mode will show
                document.getElementById("player-gift-wrap").style.display="none";
            }
        });
        observer.observe(targetNode,  { attributes: true, childList: true });

        //player-gift-wrap
        document.getElementById("player-gift-wrap").style.display="none";
        //player-danmu-btn
        document.getElementById("player-danmu-btn").click();
        //select the best quality
        document.getElementsByClassName("player-videotype-list")[0].firstChild.click()

        //control player-ctrl-wrap  full_screen by click for gif info hidden
        document.getElementsByClassName("player-fullscreen-btn")[0].addEventListener('click', function() {
            //full screen gif info
            document.getElementsByClassName("gift-info-wrap")[0].style.display="none";
        });
    }, 10000);
})();