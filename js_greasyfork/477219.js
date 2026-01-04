// ==UserScript==
// @name         YouTube.com quality change buttons (Mobile / Desktop)
// @namespace    m-youtube-com-quality-change-buttons
// @version      1.14
// @description  Adds quality change buttons below the video (144p, 240p, 360p, 480p, 720p, 1080p...) works on mobile (m.youtube.com) and on desktop.
// @author       hlorand.hu
// @match        https://m.youtube.com/watch*
// @match        https://youtube.com/watch*
// @match        https://*.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/477219/YouTubecom%20quality%20change%20buttons%20%28Mobile%20%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477219/YouTubecom%20quality%20change%20buttons%20%28Mobile%20%20Desktop%29.meta.js
// ==/UserScript==

// Screenshot: https://ibb.co/pyXQd4C

(function() {
    //'use strict';

    function addbuttons(){
        document.getElementById("qualitybuttons").innerText = "";

        var player = document.getElementById('movie_player');

        // it is neccesary to start the video, to getAvailableQualityData
        if( document.location.href.includes("m.youtube.com") ){
           player.click(); // start video
           player.click(); // pause video
        }

        const qualities = player.getAvailableQualityData();

        qualities.forEach((q)=>{

            let button = document.createElement('button');
            button.setAttribute("quality", q.quality);
            button.textContent = q.qualityLabel.replace("p50","p").replace("p60","p"); // remove fps from label
            button.className = "qualitybutton";

            button.style.margin = "4px";
            button.style.padding = "4px";
            button.style.position = "relative";

            // get current quality
            if( player.getPlaybackQualityLabel() == q.qualityLabel ){
                button.style.backgroundColor = "darkorange";
            } else{
                button.style.backgroundColor = "green";
            }

            button.onclick = function() {
                player.setPlaybackQualityRange( this.getAttribute("quality") );

                // highlight the clicked button and desaturate the others
                document.querySelectorAll(".qualitybutton").forEach((btn)=>{
                    btn.style.backgroundColor = "green";
                });
                this.style.backgroundColor = "darkorange";
            };

            let target = document.getElementById('qualitybuttons');
            target.insertBefore(button, target.firstChild);

        }); // end qualities foreach

    } // end addbuttons


        // Periodically check if the buttons are visible (sometimes YouTube redraws its interface).
        setInterval(()=>{

            // Creating a div that will contain buttons.
            if( document.getElementById("qualitybuttons") == undefined ){

                // placement of buttons on desktop
                let parent = document.getElementById('above-the-fold');

                // placement of buttons on tablet
                if( !parent ){
                    parent = document.querySelector('.watch-below-the-player');
                }

                // placement of buttons on mobile
                if( !parent ){
                    parent = document.querySelector('.related-chips-slot-wrapper');
                }

                let wrapper = document.createElement('div');
                wrapper.setAttribute("id","qualitybuttons");
                parent.insertBefore(wrapper, parent.firstChild);
                addbuttons();

            }

            // Sometimes the buttons are not added, so I check and add them if necessary.
            if( document.getElementById("qualitybuttons").textContent.trim() === '' ){
                addbuttons();
            }
        }, 1000);

})();