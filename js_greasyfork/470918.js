// ==UserScript==
// @name         Twitch Latency on Player Controls 7tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Puts 7tv stream latency in player controls
// @author       ploorp
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470918/Twitch%20Latency%20on%20Player%20Controls%207tv.user.js
// @updateURL https://update.greasyfork.org/scripts/470918/Twitch%20Latency%20on%20Player%20Controls%207tv.meta.js
// ==/UserScript==

(function() {

    window.addEventListener('load',function(){

        setTimeout(function(){

            document.querySelector(".player-controls__right-control-group").insertAdjacentHTML("afterbegin", "<div style='margin-right:10px;color:white;' id='userScript_latencyDiv'>0:00</div>");

            setInterval(function(){

                var userScript_latency = document.querySelector("div[class='seventv-video-stats'] > span").innerText;
                document.getElementById("userScript_latencyDiv").innerText = userScript_latency;


            }, 1000);

        }, 3000);
    });

})();
