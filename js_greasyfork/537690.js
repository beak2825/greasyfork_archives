// ==UserScript==
// @name         Roblox Green Play Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace The blue color of the play button by the old color.
// @author       aividedghost
// @match        https://www.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537690/Roblox%20Green%20Play%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/537690/Roblox%20Green%20Play%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function applyStyleToPlayButton() {
        const playButton = document.querySelector('button[data-testid="play-button"]');
        if (playButton && !playButton.dataset.modified) {
            playButton.style.backgroundColor = '#00b06b'; //
            playButton.style.color = 'white';
            playButton.style.border = 'none';
            playButton.style.borderRadius = '8px';
            playButton.style.fontWeight = 'bold';
            playButton.style.transition = 'background-color 0.2s ease';
            playButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            playButton.dataset.modified = 'true';

            playButton.addEventListener('mouseover', () => {
                playButton.style.backgroundColor = '#009a5a';
            });

            playButton.addEventListener('mouseout', () => {
                playButton.style.backgroundColor = '#00b06b';
            });
        }
    }

    //
    applyStyleToPlayButton();

    // 
    const observer = new MutationObserver(() => {
        applyStyleToPlayButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
