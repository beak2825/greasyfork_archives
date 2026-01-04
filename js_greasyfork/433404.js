// ==UserScript==
// @name         Hunter Ed Couse Autoplay
// @namespace    https://msd3.io/userscripts
// @version      0.3
// @description  Play the next video automatically
// @author       Scott <msd3.io>
// @match        https://www.hunteredcourse.com/course/content/*
// @icon         https://www.google.com/s2/favicons?domain=hunteredcourse.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433404/Hunter%20Ed%20Couse%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/433404/Hunter%20Ed%20Couse%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickTimerIfReady() {
        var selector = ".course-controls-group>a.btn-success";
        if (document.querySelector(selector) && document.querySelector(selector).href) {
            document.querySelector(selector).click();
            return true;
        }
        return false;
    }
    function clickTimerIfReadyLooped() {
        if (!clickTimerIfReady()) {
            setTimeout(clickTimerIfReadyLooped, 1200);
        }
    }
    function clickPlayButtonAndWait() {
        var videoIframe = document.querySelector('iframe.embed-responsive-item');
        if (videoIframe) {
            // Hunter Ed already loads the vimeo player
            // eslint-disable-next-line no-undef
            var player = new Vimeo.Player(videoIframe);
            player.on("ended", clickTimerIfReadyLooped);
            player.setVolume(0).then(function() {
                player.play();
            });
        }
    }

    clickTimerIfReady() || clickPlayButtonAndWait();
})();