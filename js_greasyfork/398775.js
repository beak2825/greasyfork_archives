// ==UserScript==
// @name         Twitch Pause Carousel
// @namespace    https://github.com/dotmick/
// @version      0.2
// @description  Pause home page carousel
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author       dotmick
// @match        *://www.twitch.tv
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/398775/Twitch%20Pause%20Carousel.user.js
// @updateURL https://update.greasyfork.org/scripts/398775/Twitch%20Pause%20Carousel.meta.js
// ==/UserScript==


// Ugly, but that works
$(document).ready(() => {
	console.log('Running Twitch Pause Carousel (TPC)');

    var checkExist = setInterval(function() {
        if ($('.video-player__container video').get(0).readyState == 4) {
            console.log("TPC – Video ready to be paused");
            clearInterval(checkExist);
            var nbPausing = 100;
            var forcePausing = setInterval(function() {
                console.log("TPC – Forcing pause...");
                $('.video-player__container video').get(0).pause();
                nbPausing--;
                if(nbPausing == 0)
                {
                    clearInterval(forcePausing);
                    console.log("TPC – Forcing pause done (x" + nbPausing + ")");
                }

            }, 100);
        }
    }, 100);
});