// ==UserScript==
// @name         Steamgifts Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press enter to click the insert/delete button
// @author       goateeya
// @match        https://www.steamgifts.com/giveaway/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22791/Steamgifts%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/22791/Steamgifts%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('start...');
    document.body.onkeyup = function(e) {
        if (e.keyCode == 13) {
            var btnInsert = $('.sidebar__entry-insert');
            var btnDelete = $('.sidebar__entry-delete');
            var isInsertButtonVisible = !btnInsert.hasClass('is-hidden');
            if (isInsertButtonVisible) {
                btnInsert.click();
            } else {
                btnDelete.click();
            }
            isInsertButtonVisible = !btnInsert.hasClass('is-hidden');
        }
    };
})();