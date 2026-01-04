// ==UserScript==
// @name         Followshows - Rewatch Shows
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://followshows.com/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415962/Followshows%20-%20Rewatch%20Shows.user.js
// @updateURL https://update.greasyfork.org/scripts/415962/Followshows%20-%20Rewatch%20Shows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //https://followshows.com/api/markEpisodeAsWatched?episodeId=418399
    var episodes = document.querySelectorAll(".episode .infos");
    var activity = document.querySelector('.activity .module-contents').innerText;

    for (let i=0;i<episodes.length;i++){
        let episode = episodes[i];
        let linka = episode.children[2];

        //e.g. (2x15)
        let epx = episode.querySelector(".episode-label").textContent.split("\n")[1].replace("Season ","(").replace(" Episode ","x").replace(",",")")
        if (epx.split("x")[1].length===2){
            epx = epx.replace("x","x0")
        }

        if (linka.classList.contains('watched')){
            //document.querySelectorAll(".episode .infos")[9].children[2].getAttribute("episodeid")

            let linkb = linka.cloneNode();

            if (!activity.includes(epx)){
                linkb.classList.remove("watched");
                linkb.title = "Rewatch";
                linkb.innerText = "Mark as Rewatched";
                linkb.onclick = function(){markEpisodeAsWatched($(linkb))};
                linkb.style.background = "#0df";
            } else {
                linkb.innerText = linkb.title = "Watched Recently";
                linkb.onclick = function(){};
                linkb.style.background="#088";
            }
            linkb.style.top="50px";
            episode.appendChild(linkb);
        }
    }

})();