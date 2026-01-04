// ==UserScript==
// @name         LinkedIn Job Search - Uncheck "Follow Company" Checkbox
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Uncheck by default the "follow company" checkbox when applying for job offer
// @author       johnrednex
// @match        https://www.linkedin.com/jobs/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408119/LinkedIn%20Job%20Search%20-%20Uncheck%20%22Follow%20Company%22%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/408119/LinkedIn%20Job%20Search%20-%20Uncheck%20%22Follow%20Company%22%20Checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs
        if (document.getElementById("follow-company-checkbox") !== null) {
            document.getElementById("follow-company-checkbox").click();
        }
    });
    
    observer.observe(document, {
        subtree: true,
        attributes: true
    });

})();