// ==UserScript==
// @name         yt-music better volume slider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  better volume slider fot ytm
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467468/yt-music%20better%20volume%20slider.user.js
// @updateURL https://update.greasyfork.org/scripts/467468/yt-music%20better%20volume%20slider.meta.js
// ==/UserScript==

const VOLUME_SLIDER_ID = 'volume-slider';

const getVolumeLevel = () => $(`#${VOLUME_SLIDER_ID}`).attr('value');

(function() {
    'use strict';
    window.fixVolumeSlider = fixVolumeSlider;

    addVolumeCount();
})();

function addVolumeCount() {
    const volumeCountEl = $(`<div></div>`)
    .text(getVolumeLevel())
    .css('text-align', 'center');

    const volumeBtn = $('.right-controls-buttons .volume');

    volumeBtn.click(function() {
        $(volumeCountEl).text(getVolumeLevel());
    });

    volumeBtn.append(volumeCountEl);

    $(`#${VOLUME_SLIDER_ID}`).change(function(){
        const volumeLevel = getVolumeLevel();

        $(volumeCountEl).text(volumeLevel);
    });
}

function fixVolumeSlider() {
    const volumeSliderEl = document.getElementById(VOLUME_SLIDER_ID);

    if (typeof(volumeSliderEl) != 'undefined' && volumeSliderEl != null)
    {
        volumeSliderEl.style.pointerEvents = 'unset';
        console.log('Volume bar has been fixed');
    } else {
        console.error('Volume bar could not be found');
    }
}