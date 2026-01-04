// ==UserScript==
// @name         WaniKani Vocabulary play reading audio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replicate the keybinding to play the reading audio of a vocabulary
// @author       LeReverandNox
// @match        https://www.wanikani.com/vocabulary/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389404/WaniKani%20Vocabulary%20play%20reading%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/389404/WaniKani%20Vocabulary%20play%20reading%20audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const playKey = 'j';

    document.addEventListener("keydown", e => {
        if (e.key === playKey) {
            const playButton = document.getElementsByClassName("audio-btn")[0];
            playButton.click();
        }
    });
})();