// ==UserScript==
// @name         YouTube.com more playback speeds (Mobile / Desktop)
// @namespace    m-youtube-com-more-playback-speeds
// @version      1.12
// @description  Adds 2.25x 2.5x 2.75x 3x speed buttons below the video. Works on mobile, tablet (m.youtube.com) and on desktop.
// @author       hlorand.hu
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/477218/YouTubecom%20more%20playback%20speeds%20%28Mobile%20%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477218/YouTubecom%20more%20playback%20speeds%20%28Mobile%20%20Desktop%29.meta.js
// ==/UserScript==

// Screenshot: https://ibb.co/chtmD9F

(function() {
    //'use strict';

    function setspeed(speed){

        // highlight
        document.querySelectorAll(".speedbutton").forEach((btn)=>{
            if( btn.textContent == speed){
                btn.style.backgroundColor = "darkorange";
            } else {
                btn.style.backgroundColor = "blue";
            }
        });

        let video = document.querySelector("video");

        if(video && video.readyState >= 2) {

            localStorage.setItem("yt_playbackspeed", speed);

            video.playbackRate = speed;
            video.mozPreservesPitch = video.webkitPreservesPitch = video.preservePitch = true;
        }
    }

    function addbuttons(){
        document.getElementById("speedbuttons").innerText = "";

        const speeds = ["3.5","3.25","3.0","2.75","2.5","2.25","2.0","1.75","1.5","1.25","1.0"];

        speeds.forEach((speed)=>{
            let button = document.createElement('button');
            button.textContent = speed;
            button.className = "speedbutton";

            button.style.margin = "4px";
            button.style.padding = "4px";

            button.style.backgroundColor = "blue";
            button.style.position = "relative";

            button.onclick = function() {
                setspeed(this.textContent);
            };

            let target = document.getElementById("speedbuttons");
            target.insertBefore(button, target.firstChild);

        }); // end speeds foreach

    } // end addbuttons

    // Periodically check if the buttons are visible
    // (sometimes YouTube redraws its interface).
    setInterval(()=>{
        // Creating a div that will contain buttons.
        if( document.getElementById("speedbuttons") == undefined ){
            
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
            wrapper.setAttribute("id","speedbuttons");
            parent.insertBefore(wrapper, parent.firstChild);
            addbuttons();

        }

        // Sometimes the buttons are not added, so I check and add them if necessary.
        if( document.getElementById("speedbuttons").textContent.trim() === '' ){
            addbuttons();
        }

        setspeed( localStorage.getItem("yt_playbackspeed") ?? 1 );

    }, 1000);

})();