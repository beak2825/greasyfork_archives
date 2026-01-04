// ==UserScript==
// @name         Dropout.tv/VHX.tv playback speed toggle button
// @namespace    https://foolmoron.io/
// @version      2.0
// @description  Add 1x/1.25x/1.5x/2x speed button to vimeo player (like on Dropout.tv)
// @author       foolmoron
// @include      *embed.vhx.tv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375919/DropouttvVHXtv%20playback%20speed%20toggle%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/375919/DropouttvVHXtv%20playback%20speed%20toggle%20button.meta.js
// ==/UserScript==

var DEFAULT_SPEED_KEY = 'foolmoron_dropout_default_speed';
var DEFAULT_SPEED = localStorage.getItem(DEFAULT_SPEED_KEY) || 1.0;

var html = `
<button type="button" class="" style="
    height: 1.4em;
    padding-left: 0.5em;
    padding-right: 0.3em;
    margin-right: -0.5em;
    margin-top: -0.3em;
    color: white;
    font-size: 1.5em;
">${DEFAULT_SPEED.toFixed(1)}x</button>
`;

(function() {
    'use strict';
    var poll = setInterval(function() {
        var video = document.querySelector('video');
        var container = video && video.closest('.player-container') && video.closest('.player-container').querySelector('.play-bar');
        debugger;
        if (video && container) {
            clearInterval(poll);
            video.playbackRate = DEFAULT_SPEED;
            var d = document.createElement('div');
            d.innerHTML = html;
            var button = d.querySelector('button');
            container.insertBefore(button, container.querySelector('.vp-prefs'));
            button.onclick = e => {
                switch (video.playbackRate) {
                    case 1.0:
                        localStorage.getItem(DEFAULT_SPEED_KEY, 1.2);
                        video.playbackRate = 1.2;
                        button.textContent = "1.2x";
                    break;
                    case 1.2:
                        localStorage.getItem(DEFAULT_SPEED_KEY, 1.5);
                        video.playbackRate = 1.5;
                        button.textContent = "1.5x";
                    break;
                    case 1.5:
                        localStorage.getItem(DEFAULT_SPEED_KEY, 2.0);
                        video.playbackRate = 2;
                        button.textContent = "2.0x";
                    break;
                    default:
                        localStorage.getItem(DEFAULT_SPEED_KEY, 1.0);
                        video.playbackRate = 1;
                        button.textContent = "1.0x";
                }
            };
        }
    }, 500);
})();