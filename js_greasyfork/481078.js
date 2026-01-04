// ==UserScript==
// @name         Unhide Attendance Percentage on Mobile
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Unhides attendance percentage on TMU attendance portal for mobile users
// @author       Musheer360
// @match        http://portal1.tmu.ac.in/Student/StudentAttendance.aspx
// @match        http://portal2.tmu.ac.in/Student/StudentAttendance.aspx
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481078/Unhide%20Attendance%20Percentage%20on%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/481078/Unhide%20Attendance%20Percentage%20on%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add or update styles
    function addStyles() {
        GM_addStyle('.visible-lg, .visible-md, .visible-sm, .visible-xs { display: initial!important; }');
    }

    // Add styles on initial page load
    addStyles();

    // Add styles again after page reload
    window.addEventListener('load', addStyles);
})();