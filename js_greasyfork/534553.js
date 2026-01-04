// ==UserScript==
// @name         AIUB TPE Evaluation Auto-Complete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically completes TPE evaluation on AIUB portal by selecting all 5s, adding a comment, and submitting the form.
// @author       Fahad777
// @match        https://portal.aiub.edu/Student/Tpe/Select?teacherID=*&sectionID=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534553/AIUB%20TPE%20Evaluation%20Auto-Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/534553/AIUB%20TPE%20Evaluation%20Auto-Complete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all radio buttons with value="5" and check them, low value means low rating (5 = best, 4 = better, 3 = good and so on)
    [].forEach.call(document.querySelectorAll('input[type="radio"][value="5"]'), function(rdo) {
        rdo.checked = true;
    });

    // Set the comment field to "awesome faculty"
    const commentField = document.getElementById("Comment");
    if (commentField) {
        commentField.value = "awesome faculty";
    } else {
        console.error("Comment field not found!");
    }

    // Submit the first form
    const form = document.forms[0];
    if (form) {
        form.submit();
    } else {
        console.error("Form not found!");
    }
})();