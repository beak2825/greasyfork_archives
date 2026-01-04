// ==UserScript==
// @name         Twitch Latency on Player Controls FFZ Version
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Puts FFZ stream latency in player controls
// @author       ploorp
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465533/Twitch%20Latency%20on%20Player%20Controls%20FFZ%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/465533/Twitch%20Latency%20on%20Player%20Controls%20FFZ%20Version.meta.js
// ==/UserScript==

(function() {

    window.addEventListener('load',function(){
        
        setTimeout(function(){
            
            document.querySelector(".player-controls__right-control-group").insertAdjacentHTML("afterbegin", "<div style='margin-right:10px;color:white;' id='userScript_latencyDiv'>0:00</div>");
            
            setInterval(function(){
                
                var userScript_latency = document.querySelector("button[data-key='player-stats'] > div > span[class='ffz-stat-text']").innerText;
                document.getElementById("userScript_latencyDiv").innerText = userScript_latency;
                
            }, 1000);
            
        }, 3000);
    });
    
})();
