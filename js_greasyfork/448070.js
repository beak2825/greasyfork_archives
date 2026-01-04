// ==UserScript==
// @name Codewars helper
// @author Murka
// @description Removes unlock solution buttons and AD under the kata description
// @icon https://i.imgur.com/LKAcLYO.png
// @version 0.2
// @match *://www.codewars.com/*
// @run-at document-end
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/448070/Codewars%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448070/Codewars%20helper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633
*/

(function() {
    "use strict";

    // Removes unlock solution button, right under sample tests
    const HIDE_SOLUTION_TRAIN = true;

    // Removes unlock solution button in the kata preview
    const HIDE_SOLUTION_PREVIEW = false;

    // Removes AD banner under kata description
    const HIDE_DESCRIPTION_BANNER = true;

    const styles = [];

    if (HIDE_SOLUTION_TRAIN) {
        styles.push(`
            #view_solutions, #surrender_btn {
                display: none!important;
            }
        `)
    }

    if (HIDE_SOLUTION_PREVIEW) {
        styles.push(`
            .w-full.mt-2:not(.clear-both) > * > ul.flex.flex-row.justify-center.items-center.space-x-2.px-0.border-0.h-10 > li:nth-child(2) {
                display: none!important;
            }
        `)
    }

    if (HIDE_DESCRIPTION_BANNER) {
        styles.push(`
            .description.h-full {
                height: auto!important;
            }

            .description.h-full > .description-footer {
                display: none!important;
            }
        `)
    }

    const style = document.createElement("style");
    style.innerHTML = styles.join("\n");
    document.head.appendChild(style);

})();