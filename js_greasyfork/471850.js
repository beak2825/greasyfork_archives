// ==UserScript==
// @name         Transistor.fm Volume -/+ Controls
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Add simple volume up/down buttons to embeddable transistor player
// @author       burnhamrobertp
// @match        share.transistor.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=transistor.fm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471850/Transistorfm%20Volume%20-%2B%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/471850/Transistorfm%20Volume%20-%2B%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.getElementsByTagName('audio')).forEach(audio => {
        const downE = document.createElement('button');
        downE.innerHTML = '-';
        downE.onclick = () => {
            audio.volume = audio.volume - 0.1 < 0 ? 0 : audio.volume - 0.1;
        };
        const upE = document.createElement('button');
        upE.innerHTML = '+';
        upE.onclick = () => {
            audio.volume = audio.volume + 0.1 > 1 ? 1 : audio.volume + 0.1;
        };

        const targetButton = audio.parentElement.querySelector('#volumeBtn');
        targetButton.insertAdjacentElement('beforebegin', downE);
        targetButton.insertAdjacentElement('afterend', upE);
    });
})();