// ==UserScript==
// @name         External people no more
// @namespace    http://tampermonkey.net/
// @description  Remove information about people from external organizations and trial notification
// @author       StrahinjaT97
// @match        https://app.slack.com/client/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @license      MIT
// @version      1.1.0
// @downloadURL https://update.greasyfork.org/scripts/534445/External%20people%20no%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/534445/External%20people%20no%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeExternalPeople() {
        const peskyExternalPeople = document.querySelectorAll('div.p-context_bar_v2[data-qa="context_bar"]');
        peskyExternalPeople.forEach((pesky) => {
            pesky.style.display = 'none';
        });
    }

    function removeTrialNotification() {
        const trialNotification = document.querySelectorAll('div.p-message_pane_banner__container.p-message_pane_banner__container--alert');
        trialNotification.forEach((notif) => {
            notif.style.display = 'none';
        });
    }


    const externalPeopleObserver = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            try {
                removeExternalPeople()
            } catch (err) {
                console.error(err);
            }
        });
    });

    externalPeopleObserver.observe(document, {
        childList: true,
        subtree: true,
        attribute: true
    });

    const trailNotificationObserver = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            try {
                removeTrialNotification();
            } catch (err) {
                console.error(err);
            }
        });
    });

    trailNotificationObserver.observe(document, {
        childList: true,
        subtree: true,
        attribute: true
    });


})();
