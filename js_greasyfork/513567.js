// ==UserScript==
// @name         redditp mobile friendly
// @namespace    redditp.mobile.friendly
// @version      2025-05-14
// @description  better buttons
// @author       You
// @match        https://redditp.com/*
// @match        https://www.redditp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513567/redditp%20mobile%20friendly.user.js
// @updateURL https://update.greasyfork.org/scripts/513567/redditp%20mobile%20friendly.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for (const id of ['prevButton', 'nextButton']) {
        const left = id == 'prevButton';
        const button = document.getElementById(id);
        if (button) {
            button.style.left = "0xp";
            if (left) {
                button.style.top = "0px";
            } else {
                button.style.top = "50%";
            }
            button.style.height = "50%";
            button.style.width = "90%";
            button.style.opacity = "0";
        } else {
            console.log(`couldn't find button: ${id}`);
        }
    }
    console.log('applied redditp optimization');
})();

/*
(function() {
    'use strict';
    for (const id of ['prevButton', 'nextButton']) {
        const button = document.getElementById(id);
        if (button) {
            button.style.height = "100%";
            button.style.width = "50%";
            button.style.opacity = "0";
            button.style.top = "0px";
        }
    }
})();
*/