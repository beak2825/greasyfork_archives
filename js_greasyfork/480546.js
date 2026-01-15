// ==UserScript==
// @name         OTIS Set Queue to Me
// @namespace    http://tampermonkey.net/
// @version      2026.01.14.3
// @description  Sets ticket to user's queue upon edit
// @author       Vance M. Allen
// @match        https://apps.sde.idaho.gov/*/Queue/*/Ticket/ViewTicket/*
// @match        https://apps.sde.idaho.gov/*/Ticket/ViewTicket/*
// @match        https://apps2.sde.idaho.gov/*/Queue/*/Ticket/ViewTicket/*
// @match        https://apps2.sde.idaho.gov/*/Ticket/ViewTicket/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idaho.gov
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480546/OTIS%20Set%20Queue%20to%20Me.user.js
// @updateURL https://update.greasyfork.org/scripts/480546/OTIS%20Set%20Queue%20to%20Me.meta.js
// ==/UserScript==

/* Due to @match being case sensitive, and OTIS using Otis and OTIS interchangably, I have a wildcard
   where OTIS would go as the other applications don't have queues/tickets. */

/*
Change log
2023.10.05.1  - Original release
2025.11.19.2  - Made queue selection more accurate
2026.01.14.3  - Add APPS2 server support, update @match and queue selection for compatibility in APPS+APPS2
*/

/* globals $ */
(function() {
    'use strict';

    const apps2 = location.hostname.split('.').shift() === 'apps2';
    const btnSaveUnlock = $('#btnSaveUnlock');

    // Bail if there is no button
    if(!btnSaveUnlock.length) return;
    // Try to determine what queue "me" is!
    console.warn('OTIS Set Queue to Me running!');
    let me,myQueue;
    let queue = $('#queue');

    // Pick out the last name using the e-mail address of the logged in user.
    let lastName = (function() {
        let lastName;
        if(apps2) {
            lastName = $('li.pull-right.k-state-default span.k-link').contents().filter(i => !i);
        }
        else {
            lastName = $('div.idbox');
        }

        lastName = lastName.text().trim().slice(1).replace('@edu.idaho.gov','');
        return lastName.charAt(0).toUpperCase() + lastName.slice(1);
    })();

    // Loop through the queues to identify who the user is (and their queue number)
    $(`a[href*="/Tech/ViewQueue"]`).each(function(i,x) {
        if($(x).text().trim().split(' ').includes(lastName)) {
            me = x.innerText;
            myQueue = x.attributes.href.value.match(/\d+$/)[0];
        }
    });

    // Set up "Set to Me"
    let btnSetToMe = $('<button id="btnSetToMe" type="button" style="width:100px;">Set to Me</button>').click(function() {
        // Before doing anything, make sure both of these elements exist.
        if(!$('#queue,#ticket_CurrentQueueId').length === 2) return;

        // Set queue to "me" (visible to user)
        $('#queue').val(me);

        // Set queue number to myQueue (not visible to user)
        $('#ticket_CurrentQueueId').val(myQueue);
    });

    // If queue is already "me", disable the button
    if($('#ticket_CurrentQueueId').val() === myQueue) {
        btnSetToMe.attr('disabled','disabled').css('cursor','not-allowed');
    }

    // Place button on the page
    btnSaveUnlock.after(`<br>`,btnSetToMe);
})();