// ==UserScript==
// @name        Monitor Video Speed
// @version     1.0
// @description Monitor and set video speed to 1.5
// @match       *://*/*
// @grant       none
// @author      Kvy
// @license     MIT
// @namespace https://greasyfork.org/users/773641
// @downloadURL https://update.greasyfork.org/scripts/494521/Monitor%20Video%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/494521/Monitor%20Video%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let defaultSpeed = 1.5;

    const setSpeed = (video) => {
        console.log(`Current speed: ${video.playbackRate}`);
        if (video.playbackRate !== defaultSpeed) {
            video.playbackRate = defaultSpeed;
        }
    };

    const monitorVideoSpeed = () => {
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            setSpeed(video);
        }
    };

    document.onkeyup = function(e) {
        if (e.which == 86 && defaultSpeed == 1.5) {
            defaultSpeed = 2;
        }
        else if (e.which == 86) {
            defaultSpeed = 1.5;
        }
    };

    setInterval(monitorVideoSpeed, 1000);
})();