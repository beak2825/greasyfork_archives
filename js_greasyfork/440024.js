// ==UserScript==
// @name         Apple Podcast: Low Volume
// @namespace    https://github.com/HayaoGai
// @version      1.0.0
// @description  Low volume to 0.2.
// @author       Hayao-Gai
// @match        https://podcasts.apple.com/*
// @icon         https://sssfreelancehacker.com/wp-content/uploads/2020/06/apple-podcast.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440024/Apple%20Podcast%3A%20Low%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/440024/Apple%20Podcast%3A%20Low%20Volume.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const vol = 0.2;

    init(10);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(lowVolume, 500 * i);
        }
    }

    function lowVolume() {
        document.querySelectorAll("button").forEach(button => {
            if (button.className.includes("low-volume")) return;
            button.classList.add("low-volume");
            button.addEventListener("click", onClick);
        });
    }

    function onClick() {
        const audio = document.querySelector("audio");
        if (!audio) return;
        audio.volume = vol;
    }

})();