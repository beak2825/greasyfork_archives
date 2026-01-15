// ==UserScript==
// @name         web.snapchat.com - Remove Snapchat Stories/Spotlight Button from Snapchat Web
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Deletes the tCfts div from Snapchat's page, making the Stories/Spotlight buttons on the right of the page go away.
// @match        *://*.snapchat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537650/websnapchatcom%20-%20Remove%20Snapchat%20StoriesSpotlight%20Button%20from%20Snapchat%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/537650/websnapchatcom%20-%20Remove%20Snapchat%20StoriesSpotlight%20Button%20from%20Snapchat%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTargetElement() {
        const target = document.querySelector('div.tCfts');
        if (target) {
            target.remove();
            console.log('tCfts element removed');
        }
    }

    // Run initially
    removeTargetElement();

    // Observe for dynamically loaded content
    const observer = new MutationObserver(() => {
        removeTargetElement();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
