// ==UserScript==
// @name			YouTube video speed control
// @name:ru			YouTube с управлением скоростью
// @namespace		https://greasyfork.org/users/953995
// @description		Simple YouTube video speed control
// @description:ru	Простое управление скоростью видео на YouTube
// @version			blic-2.3
// @date			2023-02-09
// @author			blic
// @match			*://www.youtube.com/*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/459730/YouTube%20video%20speed%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/459730/YouTube%20video%20speed%20control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setPlaybackRate(player, rate) {
        if (rate < 0.1) rate = 0.1;
        else if (rate > 16) rate = 16;
        player.playbackRate = rate;
        //console.log("playing in %sx", (rate).toFixed(1));
    }

    window.addEventListener('keypress', function(event) {
        let player = document.querySelector("video");
        // console.log(event);
        let curRate = Number(player.playbackRate);

        if (event.key == "-") {
            setPlaybackRate(player, curRate - 0.1);
        } else if (event.key == "=") {
            setPlaybackRate(player, curRate + 0.1);
		} else if (event.key == "_") {
            setPlaybackRate(player, curRate - 1);
		} else if (event.key == "+") {
			if (curRate == 0.1) setPlaybackRate(player, 1);
			else setPlaybackRate(player, curRate + 1);
        } else if (event.key == "\\") {
            setPlaybackRate(player, 1);
		} else if ((event.key == "|") || (event.key == "/")) {
            setPlaybackRate(player, 16);
        }

		console.log(event.key + " pressed");
    });
})();
