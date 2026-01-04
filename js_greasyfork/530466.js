// ==UserScript==
// @name         Bypass per saltare video DIDASKO
// @name:en      DIDASKO videos skip bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description       Salta i video di DIDASKO. Premi spazio per saltare istantaneamente e usa le frecce per andare avanti/indietro di 5 secondi nel video.
// @description:en    Skip videos on DIDASKO Platform. Press space to skip instantly and the arrows to step forward/backward by 5 seconds.
// @author       DumDum
// @match        https://didasko.eipass.com/user/*
// @grant        none
// @license      GPL v2.0
// @icon         https://didasko.eipass.com/images/marchio.png
// @downloadURL https://update.greasyfork.org/scripts/530466/Bypass%20per%20saltare%20video%20DIDASKO.user.js
// @updateURL https://update.greasyfork.org/scripts/530466/Bypass%20per%20saltare%20video%20DIDASKO.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function checkVideoControls() {
        let plsControls = document.getElementsByClassName("mvp-player-controls-bottom");
        let hkvids = document.getElementsByTagName("video");
        if (plsControls.length == 0 || hkvids.length == 0) {
            setTimeout(checkVideoControls, 100);
            return;
        }
        
        hkvids[0].controls = true;
        plsControls[0].style.position = "fixed";
        document.onkeydown = function(event) {
            if (event.code=="ArrowRight") hkvids[0].currentTime += 5;
            if (event.code=="ArrowLeft") hkvids[0].currentTime -= 5;
            if (event.code=="Space") { event.preventDefault(); hkvids[0].currentTime = hkvids[0].duration; }
        };
    }
    checkVideoControls();
})();