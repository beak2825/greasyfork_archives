// ==UserScript==
// @name         double-touched to enter fullscreen
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  I AM THE WORLD
// @author       You
// @match        *://*.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530362/double-touched%20to%20enter%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/530362/double-touched%20to%20enter%20fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ref_url = 'https://www.douyin.com/?is_from_mobile_home=1&recommend=1';
    if(window.location.href == 'https://www.douyin.com/home') {
        window.location.href = ref_url;
    };

     function toggleFullscreen() {
        let videoElement = document.querySelector("video"); // Target the video element

        if (!document.fullscreenElement) {
            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if (videoElement.mozRequestFullScreen) { // Firefox
                videoElement.mozRequestFullScreen();
            } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                videoElement.webkitRequestFullscreen();
            } else if (videoElement.msRequestFullscreen) { // IE/Edge
                videoElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    }

    // Register the menu command to toggle fullscreen
    GM_registerMenuCommand('Toggle Fullscreen', toggleFullscreen);


    // Hide the DanMu Data
    const observer = new MutationObserver(() => {
    document.querySelectorAll('.danmu').forEach(element => {
        element.style.display = 'none';
        });

    });

// Configure the observer to watch for changes in the entire document
    observer.observe(document, {
        childList: true,
        subtree: true,
    });

   window.onload = () => {
      let btn = document.createElement("button");
        btn.innerHTML = "Let's Go";
        btn.id = "fullscreen";
        btn.style.position = "fixed";  // Stays in place while scrolling
        btn.style.top = "10px";        // Distance from the top
        btn.style.left = "10px";       // Distance from the left
        btn.style.padding = "10px 20px";
        btn.style.backgroundColor = "blue";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.style.zIndex = "9999"; // Ensures the button is in the front layer

        // Add click event to redirect
        btn.onclick = function () {
            document.documentElement.webkitRequestFullscreen();
            document.getElementById('fullscreen').style.display = 'none'
        };

        // Append button to the body
        document.body.appendChild(btn);
   }
})();