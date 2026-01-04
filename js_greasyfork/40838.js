// ==UserScript==
// @name         Massengeschmack-TV
// @namespace    1elv
// @version      1.1
// @description  Verbesserungen am Videoplayer von Massengeschmack-TV.
// @author       1elv
// @match        https://massengeschmack.tv/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40838/Massengeschmack-TV.user.js
// @updateURL https://update.greasyfork.org/scripts/40838/Massengeschmack-TV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playerFrame, timestampNav;
    if ((playerFrame = document.querySelector('.modulePlayer .row > div.col-md-8.col-md-offset-2.col-sm-12.col-sm-offset-0')) !== null) {
        // without timestamp navigation
        console.info('found player');
        // small windows: full width (12 columns)
        playerFrame.classList.remove('col-md-8', 'col-md-offset-2');
        // medium windows: 10 columns
        playerFrame.classList.add('col-md-10', 'col-md-offset-1');
        // large windows: 8 columns (original size)
        playerFrame.classList.add('col-lg-8', 'col-lg-offset-2');
    } else if ((playerFrame = document.querySelector('.modulePlayer .row > div.col-sm-9.col-sm-push-3.col-md-8.col-md-push-3')) !== null &&
               (timestampNav = document.querySelector('.modulePlayer .row > div.col-sm-3.col-sm-pull-9.col-md-3.col-md-pull-8')) !== null) {
        // with timestamp navigation
        console.info('found player and timestamp navigation');
        // large windows: 8 columns
        playerFrame.classList.add('col-lg-8');

        let toggleButton = document.createElement('a');
        toggleButton.textContent = 'Navigation umschalten';
        playerFrame.prepend(toggleButton);
        toggleButton.onclick = function () {
            playerFrame.classList.toggle('col-sm-push-3');
            playerFrame.classList.toggle('col-md-push-3');
            playerFrame.classList.toggle('col-sm-9');
            playerFrame.classList.toggle('col-md-8');
            playerFrame.classList.toggle('col-md-10');
            playerFrame.classList.toggle('col-md-offset-1');
            playerFrame.classList.toggle('col-lg-offset-2');

            timestampNav.classList.toggle('hidden');
        };
    } else {
        console.warn('did not find player');
    }
})();