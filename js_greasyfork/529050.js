// ==UserScript==
// @name         Remove LinkedIn Promoted Jobs
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides promoted job listings on LinkedIn
// @author       Salma Hajian
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529050/Remove%20LinkedIn%20Promoted%20Jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/529050/Remove%20LinkedIn%20Promoted%20Jobs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePromotedJobs() {
        document.querySelectorAll('li.ember-view').forEach(job => {
            if (job.textContent.includes('Promoted')) {
                job.remove();
            }
        });
    }

    // Run on page load
    removePromotedJobs();

    const observer = new MutationObserver(removePromotedJobs);
    observer.observe(document.body, { childList: true, subtree: true });
})();
