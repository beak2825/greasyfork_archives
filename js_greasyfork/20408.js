// ==UserScript==
// @name         AutoCraft
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://steamcommunity.com/id/s3rxus/gamecards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20408/AutoCraft.user.js
// @updateURL https://update.greasyfork.org/scripts/20408/AutoCraft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        
        if(document.getElementsByClassName("badge_craft_button").length > 0) {
             document.getElementsByClassName("badge_craft_button")[0].click();
        
            setInterval(function(){
                document.getElementsByClassName("newmodal_close")[0].click();
                realoadPage(1000);

            }, 2500);
        } else {
            closePage(1000);
        }
        
        
    }, 5000);
})();

/***********************************************************
 *  Utility Functions
 **********************************************************/

function realoadPage(miliseconds) {
    setInterval(function(){
        window.location.reload();
    }, miliseconds);
}

function closePage(miliseconds) {
    setInterval(function(){
        window.close();
    }, miliseconds);
}

