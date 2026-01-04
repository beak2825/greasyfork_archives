// ==UserScript==
// @name         Enhanced AG Grid Functionality
// @version      4.7
// @description  Adds vibrant row hover effect, conditional status styling, emergency row highlighting, and 1-min green highlight on row click.
// @match        https://his.kaauh.org/lab/*
// @grant        GM_addStyle
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/517623/Enhanced%20AG%20Grid%20Functionality.user.js
// @updateURL https://update.greasyfork.org/scripts/517623/Enhanced%20AG%20Grid%20Functionality.meta.js
// ==/UserScript==



    // Constants for row click highlight
    const CLICKED_ROW_EXPIRY_PREFIX = 'clicked_row_expiry_';
    const CLICK_DURATION_MS = 60 * 1000; // 1 minute

  