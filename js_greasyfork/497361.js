// ==UserScript==
// @name         Are You Still Watching blocker
// @namespace    http://tampermonkey.net/
// @version      2024-06-08
// @description  A simple script looking for the pop up of "Are You Still Watching?" and closes it.
// @author       IW
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497361/Are%20You%20Still%20Watching%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/497361/Are%20You%20Still%20Watching%20blocker.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const observer = new MutationObserver(() => {
        if (document.querySelector("[id='confirm-button']")) {
            document.querySelector("[id='confirm-button']").click();
            console.log("Blocked a 'Still listening pop-up'");
        }
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
    });
    console.log("NonStop YT Loaded")
})();