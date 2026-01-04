// ==UserScript==
// @name         BlueAlert for X.com
// @namespace    https://github.com/sanair2007/BlueAlert/
// @version      1.7
// @description  Script to mark verified X.com users (blue ticks) and to blur their posts to save your sanity. 
// @author       sanair2007
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/534596/BlueAlert%20for%20Xcom.user.js
// @updateURL https://update.greasyfork.org/scripts/534596/BlueAlert%20for%20Xcom.meta.js
// ==/UserScript==

function markVerifiedContainers() {
    // search for the tick icon, ignore the processed parts
    const verifiedIcons = document.querySelectorAll('svg[data-testid="icon-verified"]:not([data-processed="true"])');

    verifiedIcons.forEach((icon) => {
        let container = icon;

        // go up until we find a div with a relevant data-testid
        while (container && container !== document.body) {
            const isTargetContainer =
                container.getAttribute('data-testid')?.match(/^(tweet|cellInnerDiv|UserCell|UserAvatar|TypeaheadUser|UserProfileHeader_Items|reply|QuoteTweet)$/i);
            // change the color and add a blur to targets
            if (isTargetContainer) {
                container.style.backgroundColor = 'rgba(29, 155, 240, 0.4)';
                container.style.filter = 'blur(2px)';
                container.style.transition = 'background-color 0.2s ease, filter 0.2s ease';
                break;
            }

            container = container.parentElement;
        }

        // mark part as processed
        icon.setAttribute('data-processed', 'true');
    });
}

// do this entire thing every 500ms
(function () {
    'use strict';
    setInterval(markVerifiedContainers, 500);
})();
