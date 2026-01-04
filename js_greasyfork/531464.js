// ==UserScript==
// @name         KAAUH Lab Suite - Verification, Alerts & Enhancements
// @namespace    Violentmonkey Scripts
// @version      7.18
// @description  Combines verification buttons (F7/F8), dynamic alerts, critical result reporting, checkbox automation, toggle back-nav, and inline sample counters.
// @match        *://his.kaauh.org/lab/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531464/KAAUH%20Lab%20Suite%20-%20Verification%2C%20Alerts%20%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/531464/KAAUH%20Lab%20Suite%20-%20Verification%2C%20Alerts%20%20Enhancements.meta.js
// ==/UserScript==
 
// Constants for row click highlight
    const CLICKED_ROW_EXPIRY_PREFIX = 'clicked_row_expiry_';
    const CLICK_DURATION_MS = 60 * 1000; // 1 minute
 