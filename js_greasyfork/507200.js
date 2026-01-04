// ==UserScript==
// @name         YouTube 4x Speed
// @namespace    https://www.youtube.com/
// @version      1.0
// @description  Add a 4x speed option to YouTube player.
// @author       YourName
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507200/YouTube%204x%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/507200/YouTube%204x%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSpeedOption() {
        const player = document.querySelector('video');
        const speedMenu = document.querySelector('.ytp-settings-menu');
        
        if (player && speedMenu) {
            const existingSpeeds = player.playbackRate;
            
            // Add the 4x speed option to the playback rate menu if it doesn't already exist
            if (!Array.from(document.querySelectorAll('.ytp-menuitem')).some(el => el.innerText.includes('4'))) {
                const speedOption = document.createElement('div');
                speedOption.className = 'ytp-menuitem';
                speedOption.setAttribute('role', 'menuitem');
                speedOption.setAttribute('aria-checked', 'false');
                speedOption.setAttribute('tabindex', '0');
                
                const speedLabel = document.createElement('div');
                speedLabel.className = 'ytp-menuitem-label';
                speedLabel.innerText = '4x';
                
                speedOption.appendChild(speedLabel);
                
                speedOption.addEventListener('click', function() {
                    player.playbackRate = 4.0;
                    closeSpeedMenu();
                });

                speedMenu.appendChild(speedOption);
            }
        }
    }

    function closeSpeedMenu() {
        // Close the YouTube settings menu
        const settingsButton = document.querySelector('.ytp-settings-button');
        settingsButton.click();
    }

    function observerCallback() {
        addSpeedOption();
    }

    // Mutation observer to ensure the script runs even after navigating to a different video
    const observer = new MutationObserver(observerCallback);
    observer.observe(document, { childList: true, subtree: true });
})();
