// ==UserScript==
// @name        Zero Hedge - Auto-expand Comments
// @match       https://www.zerohedge.com/*
// @version     1.0
// @author      MedX
// @namespace   MedX-AA
// @license     MIT
// @icon        https://s2.googleusercontent.com/s2/favicons?domain=www.zerohedge.com
// @description Automatically expands the fun comments.
// @downloadURL https://update.greasyfork.org/scripts/527957/Zero%20Hedge%20-%20Auto-expand%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/527957/Zero%20Hedge%20-%20Auto-expand%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickComments() {
        const buttons = document.getElementsByClassName("BlockComments_showBtn__Ds_Lu");
        if (buttons.length > 0) {
            for (const button of buttons) {
                button.click();
            }
            observer.disconnect(); // Stop observing once clicked.
        }
    }

    const observer = new MutationObserver(mutations => {
        clickComments();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Initial check, in case the elements are already loaded.
    clickComments();
})();
