// ==UserScript==
// @name         PoseMyArt Premium Unlock
// @namespace    http://tampermonkey.net/
// @version      6-3.7
// @description  Reprograms the Settings button to unlock all premium features upon click.
// @author       The Honorable Mustard Person
// @match        https://posemy.art/app/*
// @grant        none
// @run-at       document-end
// @license      CC0 1.0 Universal
// @downloadURL https://update.greasyfork.org/scripts/543758/PoseMyArt%20Premium%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/543758/PoseMyArt%20Premium%20Unlock.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 
    const readinessCheck = setInterval(() => {
        const settingsButton = document.getElementById('settingsMenuButton');
        const appElement = document.getElementById('v-app');
 
        if (settingsButton && appElement && appElement.__vue__ && appElement.__vue__.$children[0]) {
 
            clearInterval(readinessCheck);
            settingsButton.onclick = function(event) {
 
                event.preventDefault();
                event.stopPropagation();
 
                try {
                    const mainComponent = appElement.__vue__.$children[0];
 
                    mainComponent.isPremium = true;
                    mainComponent.isSignedIn = true;
                    mainComponent.userInfo = { is_lifetime_access: true };
 
                    mainComponent.$forceUpdate();
 
                    console.log('Premium Unlocked! The Settings button is now your unlock button.');
                } catch (e) {
                    console.error('Unlock Script Failed:', e);
                }
            };
 
            console.log('PoseMyArt Unlocker Ready. Click the "Settings" gear icon to unlock premium.');
        }
    }, 200); // Check every 200ms
})();