// ==UserScript==
// @name         autoskip yt music ads
// @namespace    http://ereynier.me/
// @version      0.1
// @icon         blob:chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/7ad949f5-13b9-49dc-bdaf-2a28f7fac4fc
// @description  Skip Youtube music ads + skip auto pause
// @author       ereynier
// @match        *://music.youtube.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/458098/autoskip%20yt%20music%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/458098/autoskip%20yt%20music%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        if (document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0]){
            document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0].click()
        }
        if (document.getElementById("play-pause-button").getAttribute("title") == "Play" && document.getElementById("pausecheckbox") && document.getElementById("pausecheckbox").checked == false){
                     document.getElementById("play-pause-button").click()
        }
        if (document.getElementById("play-pause-button") && document.getElementById("pausecheckbox") == undefined){
            console.log("fdp")
            var checkbox = document.createElement('input');

            checkbox.type = "checkbox";
            checkbox.name = "lapause";
            checkbox.value = "slt";
            checkbox.id = "pausecheckbox"

            document.getElementById("play-pause-button").appendChild(checkbox)
        }

    }, 5010);
})();