// ==UserScript==
// @name         Remove login wall to download from RoutineHub
// @version      1.0
// @description  Remove the login wall to download shortcuts from RoutineHub.
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://routinehub.co/*
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/525003/Remove%20login%20wall%20to%20download%20from%20RoutineHub.user.js
// @updateURL https://update.greasyfork.org/scripts/525003/Remove%20login%20wall%20to%20download%20from%20RoutineHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add event listener to the document
    document.addEventListener('click', function(e) {
        // Check if the clicked element matches the target button's class
        if (e.target && e.target.classList.contains('button') && e.target.href) {
            e.preventDefault(); // Prevent default click action

            // Extract the href from the element
            const targetHref = e.target.href;

            // Redirect the user to the href
            window.location.href = targetHref;
        }
    });
})();