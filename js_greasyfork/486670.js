// ==UserScript==
// @name         YouTube.com add PIP picture in picture pop-out button (Mobile / Desktop)
// @namespace    m-youtube-com-pip-button
// @version      1.4
// @description  Adds a pop out to PIP button below the video. Works on mobile, tablet (m.youtube.com) and on desktop.
// @author       hlorand.hu
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/486670/YouTubecom%20add%20PIP%20picture%20in%20picture%20pop-out%20button%20%28Mobile%20%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486670/YouTubecom%20add%20PIP%20picture%20in%20picture%20pop-out%20button%20%28Mobile%20%20Desktop%29.meta.js
// ==/UserScript==


(function() {
    //'use strict';
    function addbutton(){
        document.getElementById("pipbutton").innerText = "";

        let button = document.createElement('button');
        button.textContent = "PIP";
        button.className = "pipbutton";

        button.style.margin = "4px";
        button.style.padding = "6px";

        button.style.backgroundColor = "brown";
        button.style.position = "relative";

        button.onclick = function() {
            let video = document.querySelector("video");
            video.disablePictureInPicture = false;
            video.requestPictureInPicture();
        };

        let target = document.getElementById("pipbutton");
        target.insertBefore(button, target.firstChild);


    } // end addbuttons

    // Periodically check if the buttons are visible
    // (sometimes YouTube redraws its interface).
    setInterval(()=>{
        // Creating a div that will contain buttons.
        if( document.getElementById("pipbutton") == undefined ){
            
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
            wrapper.setAttribute("id","pipbutton");
            parent.insertBefore(wrapper, parent.firstChild);
            addbutton();

        }

        // Sometimes the buttons are not added, so I check and add them if necessary.
        if( document.getElementById("qualitybuttons") === undefined ){
            addbutton();
        }

    }, 1000);

})();