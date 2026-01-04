// ==UserScript==
// @name         m.YouTube.com auto fullscreen on rotate
// @namespace    m-youtube-com-auto-fullcreen-on-rotate
// @version      1.1
// @description  Switches the video to full-screen mode when you rotate your smart device
// @author       hlorand.hu
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/477524/mYouTubecom%20auto%20fullscreen%20on%20rotate.user.js
// @updateURL https://update.greasyfork.org/scripts/477524/mYouTubecom%20auto%20fullscreen%20on%20rotate.meta.js
// ==/UserScript==

// Screenshot: https://ibb.co/chtmD9F

(function() {
    //'use strict';

    var isFullscreen = false;

    window.addEventListener("orientationchange", (event) => {
        let player = document.getElementById("player-container-id");
        let angle = event.target.screen.orientation.angle;
        console.log(angle, isFullscreen);

        // enter fullscreen
        if( !isFullscreen && (angle > 60 && angle < 120 || angle > 240 && angle < 300) ){
            player.requestFullscreen();
            isFullscreen = true;
            return;
        }

        // exit fullscreen
        if( isFullscreen && (angle > 330 || angle < 30 || angle > 150 && angle < 210) ){
            document.exitFullscreen();
            isFullscreen = false;
            return;
        }



    });

})();