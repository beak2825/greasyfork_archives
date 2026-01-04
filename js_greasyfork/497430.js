// ==UserScript==
// @name         HITSZ Replay Hacker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bypass the replay restrict. The script should only be used for personal study purposes.
// @author       yb
// @match        http://219.223.238.14:88/ve/back/rp/common/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497430/HITSZ%20Replay%20Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/497430/HITSZ%20Replay%20Hacker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to override the getStuControlType function
    function overrideFunction() {
        getStuControlType = (rpId, courseId, courseNum, fzId) => {
            const publicRpType = 2;
            const url = `../../../back/rp/common/rpIndex.shtml?method=studyCourseDeatil&courseId=${courseId}&dataSource=1&courseNum=${courseNum}&fzId=${fzId}&rpId=${rpId}&publicRpType=${publicRpType}`;
            window.open(url);
        };
        console.log('getStuControlType function overridden successfully.');
    }

    // Function to check if the function exists and override it
    function checkAndOverride() {
        if (typeof getStuControlType !== 'undefined') {
            overrideFunction();
            observer.disconnect(); // Stop observing once the function is found and overridden
        }
    }

    // Create a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(() => {
        checkAndOverride();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Check immediately in case the function is already defined
    checkAndOverride();
})();
