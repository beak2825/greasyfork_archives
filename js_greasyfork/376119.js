// ==UserScript==
// @name         Making MIUI forums usable
// @description  Disable all the annoying crap from the MIUI forums
// @version      1.4
// @author       Mario O.M.
// @namespace    https://github.com/marioortizmanero/
// @match        http://*.miui.com/*
// @match        https://*.miui.com/*
// @match        https://web.archive.org/web/*/http://*.miui.com/*
// @match        https://web.archive.org/web/*/https://*.miui.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376119/Making%20MIUI%20forums%20usable.user.js
// @updateURL https://update.greasyfork.org/scripts/376119/Making%20MIUI%20forums%20usable.meta.js
// ==/UserScript==

// This script isn't useful since the 8th of April, when the MIUI forums were merged into the Mi Community.

(function() {
    'use strict';
    var to_remove = [
        'cm', // Experience widget under upvoted posts
        'md_ctrl', // Big medals in the user data
        'sign', // Signature under the comments
        'pil cl', // Credits and such data under the profile image
        'b_rad_5', // Profile icons
        'pbg2', // Small experience bar under the profile icon
        'start', // Small medals under the profile icon
    ];

    for (let i = 0; i < to_remove.length; i++) {
        let element = document.getElementsByClassName(to_remove[i]);
        while (element.length > 0) {
            element[0].parentNode.removeChild(element[0]);
        }
    }

    const margins1 = document.getElementsByClassName('plc'); // Margins between comments 1
    for (let i = 0; i < margins1.length; i++) {
        margins1[i].style.padding = "4px 10px";
    }

    const margins2 = document.getElementsByClassName('t_fsz'); // Margins between comments 2
    for (let i = 0; i < margins2.length; i++) {
        margins2[i].style.minHeight = "40px";
    }

    const stamp = document.getElementById('threadstamp'); // Stamp in some posts
    stamp.style.display = "none";
})();
