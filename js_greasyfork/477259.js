// ==UserScript==
// @name         YouTube.com seek buttons (Mobile / Desktop)
// @namespace    m-youtube-com-seek-buttons
// @version      1.6
// @description  Adds +-30sec +-1min +-5min buttons below the video. Works on mobile, tablet (m.youtube.com) and on desktop.
// @author       hlorand.hu
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/477259/YouTubecom%20seek%20buttons%20%28Mobile%20%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477259/YouTubecom%20seek%20buttons%20%28Mobile%20%20Desktop%29.meta.js
// ==/UserScript==

// Screenshot: https://ibb.co/72YKQPn
 
(function() {
    //'use strict';
 
    function addbuttons(){
        document.getElementById("seekbuttons").innerText = "";
 
        const times = ["+300s", "+60s", "+30s", "-30s", "-60s", "-300s"];
 
        times.forEach((time)=>{
            let button = document.createElement('button');
            button.textContent = time;
 
            button.style.margin = "4px";
            button.style.padding = "4px";
            button.style.backgroundColor = "purple";
            button.style.position = "relative";
 
            button.onclick = function() {
                let video = document.querySelector("video");
 
                if(video && video.readyState >= 2) {
                    video.currentTime += parseInt(this.textContent.replace("s",""));
                }
            };
 
            let target = document.getElementById("seekbuttons");
            target.insertBefore(button, target.firstChild);
 
        }); // end times foreach
 
    } // end addbuttons
 
    // Periodically check if the buttons are visible 
    // (sometimes YouTube redraws its interface).
    setInterval(()=>{
        // Creating a div that will contain buttons.
        if( document.getElementById("seekbuttons") == undefined ){
            
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
            wrapper.setAttribute("id","seekbuttons");
            parent.insertBefore(wrapper, parent.firstChild);
            addbuttons();
        }

        // Sometimes the buttons are not added, so I check and add them if necessary.
        if( document.getElementById("seekbuttons").textContent.trim() === '' ){
            addbuttons();
        }

    }, 1000);

})();