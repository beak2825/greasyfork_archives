// ==UserScript==
// @name         WME Closed Road Closer
// @description  Shortcut keys to answer old closed road URs with F8 key
// @author       TxAgBQ
// @version      20230323
// @namespace    https://greasyfork.org/en/users/820296-txagbq/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462409/WME%20Closed%20Road%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/462409/WME%20Closed%20Road%20Closer.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    document.addEventListener('keydown', (event) => {
    // Add comment then click send, NI and Next
        if (event.key === 'F8') {
            // Inserts this text
            let textToInsert = "I'm sorry for the delay but Waze only recently made these reports visible to editors and since this one is from more than a month ago I'm going to close it out. If it's still valid and you'd like to tell me more about the closure you can still reply back to this report from the Waze inbox.";

            // Comment on hold for later
                // let textToInsert = "Since we haven't heard back from you I'm going to close out your report. If it's still valid and you'd like to tell me more about the closure you can still reply back to this report from the Waze inbox.";

            $('#panel-container .mapUpdateRequest .top-section .body .conversation .new-comment-text').val(textToInsert);
            // Clicks send
            $("#panel-container .mapUpdateRequest .top-section .body .conversation .new-comment-form .send-button").click();
            // Clicks NI
            $('#panel-container .mapUpdateRequest.panel .problem-edit[data-state="open"] .actions .controls-container label[for|="state-not-identified"').click();
            // Clicks Next
            $('#panel-container .mapUpdateRequest.panel .problem-edit .actions .navigation .waze-plain-btn').click();
       }
    });
})();
