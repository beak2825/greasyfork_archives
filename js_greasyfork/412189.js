// ==UserScript==
// @name         YouTube_music_AutoConfirm
// @namespace    YouTube_music_AutoConfirm
// @version      0.1.4
// @description  Auto-Clicks on "Yes" or "是" when asked "music paused. Continue playing?"
// @author       fork from RustyPrimeLUX
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412189/YouTube_music_AutoConfirm.user.js
// @updateURL https://update.greasyfork.org/scripts/412189/YouTube_music_AutoConfirm.meta.js
// ==/UserScript==

(function() {
    var checkDelay = 2000; // checks every 2 seconds if the pop-up has appeared

    var popUp = null;
    'use strict';
    setInterval(function(){
        if(popUp === null){
            popUp = document.querySelector("paper-dialog.ytmusic-popup-container");
        }
        if(popUp !== undefined){
            if(popUp !== null){
                if(popUp.hasAttribute("aria-hidden")){
                    if(popUp.getAttribute("aria-hidden") !== true && popUp.getAttribute("aria-hidden") !== "true"){
                        FindAndClickButton(popUp);
                    }
                }
                else{
                    FindAndClickButton(popUp);
                }
            }
        }
    }, checkDelay);

    function FindAndClickButton(popUp){
        var button = popUp.querySelector("paper-button#button yt-formatted-string#text");
        if(button.textContent === "Yes" || button.textContent === "是"){
            console.log("clicking on yes");
            button.click();
        }
    }
})();