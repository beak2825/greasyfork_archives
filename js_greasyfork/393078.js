// ==UserScript==
// @name         Reload Timesheet Page when regaining Focus
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  To handle the legacy functionality of session expiry for the Timesheet system, reload the page whenever the tab regains focus after having lost it
// @author       You
// @match        https://timesheets.dialoggroup.biz/*
// @exclude      https://timesheets.dialoggroup.biz/TSCommit.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393078/Reload%20Timesheet%20Page%20when%20regaining%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/393078/Reload%20Timesheet%20Page%20when%20regaining%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Source https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

    var seen = false;


    // ----------SectionStart
    // ----------Tab Change Detection and Handling
    // ----------SectionStart
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    // If the page is hidden, remember that it's been seen once;
    // if the page is shown and has been seen once, reload the page
    function handleVisibilityChange() {
        if (document[hidden] && !seen) {
            seen = true;
        } else {
            location.reload();
        }
    }

    if (typeof document.addEventListener === "undefined" || hidden === undefined) {
        alert("This script (Reload TImesheet Page when regaining Focus) requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
        // Handle page visibility change
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }

    // ----------SectionEnd
    // ----------Tab Change Detection and Handling
    // ----------SectionEnd

    // ----------SectionStart
    // ----------Window Focus Detection and Handling
    // ----------SectionStart

    window.addEventListener('focus', function() {
        if(seen) {
            location.reload();
        }
    });

    window.addEventListener('blur', function() {
        seen = true;
    });

    // ----------SectionEnd
    // ----------Window Focus Detection and Handling
    // ----------SectionEnd
})();