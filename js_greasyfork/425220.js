// ==UserScript==
// @name         YouTube - Remove Comments on Others' Videos
// @namespace    https://greasyfork.org/en/users/761164
// @version      3.0.0
// @description  Dramatically reduce the stress that watching videos causes by getting rid of the comments down below.
// @homepage     https://greasyfork.org/en/users/761164
// @license      GPL-3.0
// @author       XerBlade
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@3439cbc6f49da5bfc4c3597a7906f1c5203a260d/waitForKeyElements.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425220/YouTube%20-%20Remove%20Comments%20on%20Others%27%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/425220/YouTube%20-%20Remove%20Comments%20on%20Others%27%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements("#subscribe-button #notification-preference-button button", (subButton) => {
        // Comments go bye bye
        waitForKeyElements("#comments", (comments) => {
            comments.remove();
        });
        waitForKeyElements("#comment-teaser", (teaser) => {
            teaser.remove();
        });
    });
})();