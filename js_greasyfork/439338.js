// ==UserScript==
// @name         Streamate Model Blacklist Fix
// @namespace    https://greasyfork.org/en/users/870933
// @version      0.3
// @description  Links to member profiles on Streamate's Blocked Customers admin page for models have been broken long enough! This simple script adds the missing userid back to the broken links so they work as expected again.
// @author       LintillaTaylor
// @match        https://legacy.streamatemodels.com/smblock.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439338/Streamate%20Model%20Blacklist%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/439338/Streamate%20Model%20Blacklist%20Fix.meta.js
// ==/UserScript==

let rows = document.querySelectorAll('tbody tr');
for (let i = 0; i < rows.length; i++) {
    rows[i].querySelector('td:nth-child(2) a').href += rows[i].querySelector('td:nth-child(3) input:first-child').name.split(/[\[\]]/)[1];
}