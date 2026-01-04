// ==UserScript==
// @name         UW Odyssey Hide Past Assessments
// @namespace    https://brandonfowler.me/
// @version      2024-03-10
// @license      MIT
// @description  Hide past exams and quizzes on the University of Waterloo's Odyssey Assessment Schedule.
// @author       Brandon Fowler
// @match        https://odyssey.uwaterloo.ca/teaching/schedule
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489456/UW%20Odyssey%20Hide%20Past%20Assessments.user.js
// @updateURL https://update.greasyfork.org/scripts/489456/UW%20Odyssey%20Hide%20Past%20Assessments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const header = document.querySelector('.uw-site-content table').rows[0].cloneNode(true);
    const rows = [...document.querySelector('.uw-site-content table').rows].slice(1)
        .filter(row => new Date(row.children[2].textContent.replace(/–.+$/, '') + ' EST') < new Date());

    const prevTable = document.createElement('table');
    prevTable.append(header, ...rows);

    const details = document.createElement('details');
    
    const summary = document.createElement('summary');
    summary.textContent = 'Past assessments';

    details.append(summary, prevTable);
    document.querySelector('.uw-site-content').prepend(details);
})();