// ==UserScript==
// @name         tawkToCustomTabParams
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Insert User Details into the Custom Tab URLS
// @author       Anthony van Orizande
// @match        https://dashboard.tawk.to/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369666/tawkToCustomTabParams.user.js
// @updateURL https://update.greasyfork.org/scripts/369666/tawkToCustomTabParams.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var contactEmail = null;

    // Assume that jQuery is loaded by the Tawk.to client.
    // Activity loop to look for detail changes.
    setInterval(function () {
        $('div.chat-content-container').width('calc(50% - 10px)');
        $('div.chat-details-container.ui-resizable').width('calc(50% - 10px)');

        try {
            var $detailsForm = $('#details-form table tr');
            if (!$detailsForm) {
                $detailsForm = $('#conversation-details-container table tr');
            }

            // If we have a detail form then capture the details.
            if ($detailsForm && $detailsForm.length) {
                // Save the contact information.
                for(var i = 0; i < $detailsForm.length; i++) {
                    var fieldNameRaw = $detailsForm[i].firstChild.innerText;
                    var fieldName = (fieldNameRaw) ? String(fieldNameRaw).trim().toLowerCase(): null;
                    var fieldValueRaw = $detailsForm[i].lastChild.innerText;
                    var fieldValue = (fieldValueRaw) ? String(fieldValueRaw).trim() : null;
                    switch(fieldName) {
                        case 'email': contactEmail = fieldValue; break;
                    }
                }
            }
            else {
                // Chat Form
                var chatEmailRaw = $('input.visitor-email-input').attr('value');
                if (chatEmailRaw) {
                    contactEmail = String(chatEmailRaw).trim();
                }
            }

            // Update the Custom Tabs if any parameters found.
            var $customIFrames = $(".details-container .custom-view iframe");
            if ($customIFrames && $customIFrames.length) {
                // Assume that a new iFrame will be injected if a new ticket or user is opened.
                for(var j = 0; j < $customIFrames.length; j++) {
                    var $iframe = $customIFrames[j];
                    var iframeSrc = $iframe.src;
                    if (contactEmail && $iframe.src.indexOf("($email$)") > -1) {
                        iframeSrc = iframeSrc.replace("($email$)", contactEmail);
                    }

                    // Allow for otherwise invalid domain names by stripping 'https://tawk.to/' if found.
                    // A local "HTTP:" address is invalid.
                    // e.g. INVALID "http://localhost/dbFront/default.aspx?k=ew4dsjguxxtx94u1hy4qiu1ejw&t=clients&s=($email$)"
                    // So we prefix it with "https://tawk.to/" which makes it look valid to the Tawk.to UI.
                    // e.g. VALID "https://tawk.to/http://localhost/dbFront/default.aspx?k=ew4dsjguxxtx94u1hy4qiu1ejw&t=clients&s=($email$)"
                    // At runtime this script will strip the "https://tawk.to/"
                    iframeSrc = iframeSrc.replace('https://tawk.to/', '');

                    // Make the final update to the iFrame Source.
                    if ($iframe.src != iframeSrc) {
                        $iframe.src = iframeSrc;
                    }
                }
            }
        }
        catch(ex)
        {
            console.error('Custom Tabs Error: ' + (typeof ex == 'string') ? ex : ex.message);
        }
    }, 100);
})();