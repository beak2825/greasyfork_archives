// ==UserScript==
// @name Revert Reddit Tab Title
// @license MIT
// @description Changes the tab title of Reddit back to "reddit: the front page of the internet" while on new reddit
// @match https://www.reddit.com/
// @icon https://i.imgur.com/ykdcVrp.png
// @author vanta
// @version 1.0
// @namespace https://greasyfork.org/en/users/1435355
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/526984/Revert%20Reddit%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/526984/Revert%20Reddit%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set the title
    function setTitle() {
        document.title = 'reddit: the front page of the internet';
    }

    // Initially set the title on page load
    setTitle();

    // Create a MutationObserver to detect title changes
    const observer = new MutationObserver(() => {
        if (document.title !== 'reddit: the front page of the internet') {
            setTitle();
        }
    });

    // Observe changes to the title element
    observer.observe(document.querySelector('title'), { childList: true });

})();