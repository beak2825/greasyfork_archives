// ==UserScript==
// @name         [AO3-PAC] Zoho New Tickets
// @description  Auto-fills some of the new ticket fields to make sending letters a little easier
// @version      2.0
// @author       lydia-theda
// @match        https://desk.zoho.com/*
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/426794/%5BAO3-PAC%5D%20Zoho%20New%20Tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/426794/%5BAO3-PAC%5D%20Zoho%20New%20Tickets.meta.js
// ==/UserScript==


// Note 1: The default for this script is to send user letters out with the "Closed" status. If you prefer sending letters as "Pending user action" or "Waiting on Response", you'll need to replace "Closed" with your preferred status
// in the noted line.

// Note 2: The bookmarklet version of this script can be found on the wiki, with options for the various sending statuses (including a Translation option).

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var zohoNewTicket = async function(event) {

    function runOnPage() {
        return window.location.href === 'https://desk.zoho.com/agent/otwao3/ao3-policy-and-abuse/tickets/new'
    }

    if (runOnPage()) {

        var dropdowns = [['cf_language_textBox','English','-None-'],
                         ['category_textBox', 'Letter to User/Response', '-None-'],
                         ['status_textBox', 'Closed', 'Open'], // Replace 'Closed' with 'Pending user action' or 'Waiting on Response' if you prefer to use those statuses instead of Closed
                         ['channel_textBox', 'Outgoing', 'Abuse Form'],
                        ]

        function setNewTicketDropdown(box,value,stValue) {
            function retryDropdown() {
                if(runOnPage()) {
                    if (document.querySelectorAll('[data-id="' + box + '"]').length) {
                        document.querySelector('[data-id="' + box + '"]').click();
                        if (document.querySelectorAll('[data-id="' + value + '"]').length && runOnPage()) {
                            document.querySelector('[data-id="' + value + '"]').click();
                            if (document.querySelector('[data-id="' + box + '"]').value === stValue && runOnPage()) {
                                setTimeout(retryDropdown, 300);
                            }
                        } else {
                            setTimeout(retryDropdown, 300);
                        }
                    } else {
                        setTimeout(retryDropdown, 300); // try again in 300 milliseconds
                    }
                }
            }

            retryDropdown();
        }

        function hideSubmit() {
            //hides the Submit button so you don't accidentally click it
            if (document.querySelectorAll('[data-id="submit"]').length ||
                document.querySelectorAll('[data-id="saveButtonId"]').length) {
                if(document.contains(document.querySelector('[data-id="saveButtonId"]'))) {
                    document.querySelector('[data-id="saveButtonId"]').remove();
                }
                setFocus();
            } else {
                setTimeout(hideSubmit, 300); // try again in 300 milliseconds
            }
        }

        function setFocus () {
            if (document.querySelectorAll('[data-id="subject"]').length && runOnPage()) {
                document.querySelector('[data-id="subject"]').focus();
            } else {
                setTimeout(setFocus, 300); // try again in 300 milliseconds
            }
        }

        await delay(500) // Yet another attempt at fixing the NuZoho same-tab problem...

        for (const dd of dropdowns) {
            setNewTicketDropdown(dd[0],dd[1],dd[2])
        }

        hideSubmit();
    }
};

(() => {
    let oldPushState = history.pushState;
    history.pushState = function pushState() {
        let ret = oldPushState.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    let oldReplaceState = history.replaceState;
    history.replaceState = function replaceState() {
        let ret = oldReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });
})();

window.addEventListener('locationchange', zohoNewTicket, false);
window.addEventListener('load', zohoNewTicket, false);