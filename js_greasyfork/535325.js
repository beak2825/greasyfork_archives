// ==UserScript==
// @name         kaauh.org Lab Workbench Buttons
// @namespace    Violentmonkey Scripts
// @version      4.9
// @description  Add dynamic workbench buttons under tab bar with toggle and color support (Enhanced Stability)
// @match        https://his.kaauh.org/lab/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535325/kaauhorg%20Lab%20Workbench%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/535325/kaauhorg%20Lab%20Workbench%20Buttons.meta.js
// ==/UserScript==

// Constants for row click highlight
    const CLICKED_ROW_EXPIRY_PREFIX = 'clicked_row_expiry_';
    const CLICK_DURATION_MS = 60 * 1000; // 1 minute
 