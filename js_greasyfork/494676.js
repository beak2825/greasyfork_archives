// ==UserScript==
// @name         Disable Smooth Scrolling
// @namespace    https://greasyfork.org/users/1300060
// @version      0.2
// @description  Disable smooth scrolling on all websites
// @author       AstralRift
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494676/Disable%20Smooth%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/494676/Disable%20Smooth%20Scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excludeSelector = '.ace_content';

    function stopSmoothScrolling(event) {
        if (event.target.matches(excludeSelector)) {
            return;
        }
        event.stopPropagation();
    }

    document.addEventListener("wheel", stopSmoothScrolling, { capture: true, passive: true });
})();
