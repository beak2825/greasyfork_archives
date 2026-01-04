// ==UserScript==
// @name         Plex Auto Skip Intro (Optimized)
// @description:en  Automate the Skip Intro of your Series reproduced in plex so you can watch them without interruptions
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto skip intro in Plex
// @author       CodeRED
// @description:es    Automatiza el Saltar Intro de tus Series reproducidas en plex para asi poderlas ver sin interrupciones
// @match        https://app.plex.tv/desktop*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465935/Plex%20Auto%20Skip%20Intro%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465935/Plex%20Auto%20Skip%20Intro%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkForSkipIntroButton = () => {
        const skipIntroButton = document.querySelector('.AudioVideoFullPlayer-overlayButton-D2xSex');
        if (skipIntroButton) {
            skipIntroButton.click();
            console.log('Opening omitido');
        }
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                checkForSkipIntroButton();
            }
        }
    });

    const targetNode = document.querySelector('body');
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(targetNode, config);

})();