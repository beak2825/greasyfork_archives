// ==UserScript==
// @name         YouTube Music Center Play Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This userscript centers the Play/Pause button on Youtube Music
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454998/YouTube%20Music%20Center%20Play%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/454998/YouTube%20Music%20Center%20Play%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const bar = document.getElementsByTagName('ytmusic-player-bar')[0];
    const playContainer = bar.children[1]
    const crapContainer = bar.children[2]
    const rightContainer = bar.children[3]

    console.log(rightContainer)

    playContainer.classList.add('middle-controls')
    playContainer.classList.remove('left-controls')

    crapContainer.classList.add('left-controls')
    crapContainer.classList.remove('middle-controls')

    rightContainer.style.width = 'initial'
    rightContainer.removeAttribute("style")
})();