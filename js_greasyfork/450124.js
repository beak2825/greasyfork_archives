// ==UserScript==
// @name         Add Sound Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the download URLs for the sounds so if you left click they preview the audio, right click instead downloads the audio.
// @author       eM-Krow
// @match        *://noproblo.dayjo.org/ZeldaSounds/ZSS/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dayjo.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450124/Add%20Sound%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/450124/Add%20Sound%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const playSound = (sound) => {
        let audio = new Audio(sound);
        audio.loop = false;
        audio.play();
    };

    const generatePlayButtons = () => {
        let sounds = Array.from(document.querySelectorAll("a")).filter(a => a.href.includes(".wav"));
        for (let s in sounds) {
            const url = sounds[s].href;
            sounds[s].href = `#${url.split("/")[url.split("/").length - 1]}`;
            sounds[s].onclick = () => {
                playSound(`${url}`)
            };
            sounds[s].oncontextmenu = () => {
                window.location = `${url}`
            };
        }
    };

    generatePlayButtons();
})();