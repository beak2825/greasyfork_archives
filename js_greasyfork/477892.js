// ==UserScript==
// @name            UNMUTE KICK ON FIREFOX 100% WORKING FIX!!!
// @namespace       https://greasyfork.org/en/users/1200587-trilla-g
// @match        *://kick.com/*
// @description     Unmute audio for kick.com on Firefox
// @grant           none
// @version         3.0
// @author          Trilla_G
// @downloadURL https://update.greasyfork.org/scripts/477892/UNMUTE%20KICK%20ON%20FIREFOX%20100%25%20WORKING%20FIX%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/477892/UNMUTE%20KICK%20ON%20FIREFOX%20100%25%20WORKING%20FIX%21%21%21.meta.js
// ==/UserScript==

// Function to change the mute button value to "vjs-vol-3"
const autoChangeVolume = () => {
    const muteButton = document.querySelector('.vjs-mute-control.vjs-control.vjs-button.vjs-vol-0');
    if (muteButton) {
        muteButton.click(); // Automatically click the mute button
        setTimeout(() => {
            if (muteButton.classList.contains('vjs-vol-0')) {
                muteButton.classList.replace('vjs-vol-0', 'vjs-vol-3');
                console.log('Volume changed to "vjs-vol-3".');
            }
        }, 1600); // 2-second delay before changing the class (adjust as needed)
    }
};

// Function to observe URL changes using MutationObserver
const observeUrlChanges = () => {
    const observer = new MutationObserver(() => {
        const newUrl = window.location.href;
        if (newUrl.includes('kick.com') || newUrl.includes('kick.com/video')) {
            autoChangeVolume();
        }
    });

    // Start observing changes to the href attribute of the document's body
    observer.observe(document.body, { subtree: true, childList: true });

    // Cleanup observer on page unload
    window.addEventListener('beforeunload', () => observer.disconnect());
};

// Initial run of the script
setTimeout(autoChangeVolume, 1600); // 2-second delay before the initial click

// Initial observation of URL changes
observeUrlChanges();

