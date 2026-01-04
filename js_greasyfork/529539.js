// ==UserScript==
// @name         OurPagination
// @namespace    dotp.cc
// @version      0.2
// @description  Operate Torn's pagination using left-right arrow keys
// @author       Lenin (2199004)
// @match        https://www.torn.com/hospitalview.php*
// @match        https://www.torn.com/jailview.php*
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/forums.php*
// @match        https://www.torn.com/bounties.php*
// @match        https://www.torn.com/comics.php*
// @match        https://www.torn.com/properties.php*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/messages.php*
// @match        https://www.torn.com/amarket.php*
// @match        https://www.torn.com/page.php?sid=travel*
// @match        https://www.torn.com/personals.php*
// @match        https://www.torn.com/page.php?sid=gallery*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529539/OurPagination.user.js
// @updateURL https://update.greasyfork.org/scripts/529539/OurPagination.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Check if the focus is on a text input or textarea
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable) {
            return; // Do nothing if the user is focused on an input box or textarea
        }

        // Check if the right arrow key is pressed
        if (e.keyCode === 39) { // 39 is the keycode for the right arrow key
            let rightPaginationLink = document.querySelector('i.pagination-right').parentNode;
            if (rightPaginationLink) {
                rightPaginationLink.click();
            }
        }
        // Check if the left arrow key is pressed
        else if (e.keyCode === 37) { // 37 is the keycode for the left arrow key
            let leftPaginationLink = document.querySelector('i.pagination-left').parentNode;
            if (leftPaginationLink) {
                leftPaginationLink.click();
            }
        }
    });
})();