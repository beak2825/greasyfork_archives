// ==UserScript==
// @name         iPrima ads killer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world and block ads on iprima.cz
// @author       You
// @match        https://api.play-backend.iprima.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36004/iPrima%20ads%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/36004/iPrima%20ads%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
    	if (document.querySelectorAll('.vjs-skip-countdown').length > 0) {
    		document.querySelectorAll('#ott-video-player_html5_api')[0].setAttribute('src', 'damn');
    	}
        if (document.querySelectorAll('.vjs-vol-0').length > 0) {
    		document.querySelectorAll('.vjs-vol-0')[0].click();
        }
        if (document.querySelectorAll('.vjs-skip-button').length > 0) {
            document.querySelectorAll('.vjs-skip-countdown')[0].click();
        }
    	if (document.querySelectorAll('.AdTrack-CSS-Base').length > 0) {
    		document.querySelectorAll('.AdTrack-CSS-Base')[0].remove();
    	}
        if (document.querySelectorAll('.vjs-ad-button-close').length > 0) {
            document.querySelectorAll('.vjs-ad-button-close')[0].click();
        }
        if (document.querySelectorAll('.vjs-icon-close').length > 0) {
            document.querySelectorAll('.vjs-icon-close')[0].click();
        }
    }, 500);
})();