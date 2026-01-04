// ==UserScript==
// @name         Entity Manager - Prepopulate Merge Details
// @namespace    http://tampermonkey.net/
// @version      2023.07.11.1
// @description  Prepopulates name and reason for merge details
// @author       Vance M. Allen
// @match        https://apps2.sde.idaho.gov/EntityManager/PersonMerge*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476372/Entity%20Manager%20-%20Prepopulate%20Merge%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/476372/Entity%20Manager%20-%20Prepopulate%20Merge%20Details.meta.js
// ==/UserScript==

(function() {
    let retry;
    (retry = function() {
        let requestor = document.getElementById('MergeInitiator');
        let reason = document.getElementById('MergeReason');
        let change = new Event('change');

        if(requestor === null) {
            setTimeout(retry,50);
            return;
        }

        // Set merge requestor and reason
        requestor.value = 'Vance M. Allen';
        requestor.dispatchEvent(change);
        reason.value = 'Duplicate';
        reason.dispatchEvent(change);
    })();
})();
