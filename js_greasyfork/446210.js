// ==UserScript==
// @name         Volume Booster
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  boost volume!
// @author       paperbenni
// @match        https://fmovies.to/series/*
// @match        https://mcloud.to/*
// @match        https://vizcloud.cloud/*
// @match        https://videovard.to/*
// @match        https://streamtape.com/*
// @match        https://vizcloud.store/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fmovies.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446210/Volume%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/446210/Volume%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var boostedvideos = [];
    function videodetect() {
        var videos = document.getElementsByTagName('video');
        for (let i of videos) {
            if (boostedvideos.includes(i)) {
                 continue;
            }
            boostedvideos.push(i)
            var audioCtx = new AudioContext();
            var source = audioCtx.createMediaElementSource(i);
            var gainNode = audioCtx.createGain();
            gainNode.gain.value = 10;
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        }
    }
    setInterval(videodetect, 2000);

})();