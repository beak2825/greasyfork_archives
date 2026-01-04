// ==UserScript==
// @name         move zhibo ad for douyutv
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       You
// @match        https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374253/move%20zhibo%20ad%20for%20douyutv.user.js
// @updateURL https://update.greasyfork.org/scripts/374253/move%20zhibo%20ad%20for%20douyutv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // doyutv
    if(document.getElementById("container")){
            document.getElementById("container").children[1].style.display="none";
    }

    var str_by_id = ['js-room-activity', 'js-player-asideMain', 'js-bottom', 'js-background-holder', 'js-live-room-normal-right'];

    str_by_id.forEach(function(item, index, array) {
        if(document.getElementById(item)) {
            document.getElementById(item).style.display="none"; //guess-main-panel
        }
    });

    //
    setTimeout(function(){
       if(document.getElementsByClassName("PlayerToolbar").length > 0){
           document.getElementsByClassName("PlayerToolbar")[0].style.display="none";
       }

       if(document.querySelector('div[class^="showdanmu"]')){
           document.querySelector('div[class^="showdanmu"]').click();
       }

       if(document.getElementsByClassName("LotteryContainer").length > 0){
           document.getElementsByClassName("LotteryContainer")[0].style.display="none";
       }

       if(document.getElementsByClassName("UPlayerLotteryEnter").length > 0){
           document.getElementsByClassName("UPlayerLotteryEnter")[0].style.display="none";
       }

       if(document.getElementById("guess-main-panel")){
           document.getElementById("guess-main-panel").style.display="none";
       }

       //select the best quality
        if(document.querySelector('div[class^="tip-"]')){
            document.querySelector('div[class^="tip-"]').childNodes[3].firstChild.click();
        }

    }, 10000);

    //huyatv
})();