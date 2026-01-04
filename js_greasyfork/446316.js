// ==UserScript==
// @name         Turntable Lab autoplay
// @namespace    https://www.turntablelab.com/
// @version      0.1
// @description  Play all audio samples automatically.
// @author       Daniel Saner
// @license      GPL v3
// @match        https://www.turntablelab.com/products/*
// @icon         https://www.google.com/s2/favicons?domain=turntablelab.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446316/Turntable%20Lab%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/446316/Turntable%20Lab%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var listenerAdded = false;
    var currentTrack = 0;
    var tracks = [];

    waitForKeyElements ('.audio-track', addListener, true);

    function addListener() {
        if (!listenerAdded) {
            listenerAdded = true;
            const element = document.getElementsByClassName('product-gallery__tracks-button')[0];
            element.children[0].textContent = 'PLAY ALL SAMPLES';
            element.addEventListener('click', play);
        }
    }

    function play() {
        tracks = document.getElementsByClassName('audio-track__button');
        tracks[currentTrack].click();
        setTimeout(playNext, 1000);
    }

    function playNext() {
        if (document.getElementsByClassName('audio-track--playing').length < 1) {
            currentTrack++;
            if (tracks.length > currentTrack) {
                tracks[currentTrack].click();
            } else {
                currentTrack = 0;
                return;
            }
        }
        setTimeout(playNext, 1000);
    }
})();