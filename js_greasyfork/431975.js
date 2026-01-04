// ==UserScript==
// @name         Isekaiscan: Show Only Updated Follows
// @version      1.0
// @description  On the isekaiscan follows page, only show manga that have an update.
// @author       tomcatadam
// @grant        None
// @match        https://isekaiscan.com/user-settings/?tab=bookmark
// @match        https://isekaiscan.com/user-settings/
// @icon         https://www.google.com/s2/favicons?domain=isekaiscan.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/710133
// @downloadURL https://update.greasyfork.org/scripts/431975/Isekaiscan%3A%20Show%20Only%20Updated%20Follows.user.js
// @updateURL https://update.greasyfork.org/scripts/431975/Isekaiscan%3A%20Show%20Only%20Updated%20Follows.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* globals $, jQuery */

this.$ = this.jQuery = jQuery.noConflict(true);

const verbose = false;

$(document).ready(function() {
    if ($('div.c-notifications').length === 0) {
        // TODO: Insert some info on the page to make this clear.
        console.log("No new updates found. Showing all manga.");
        return;
    }

    $('tr').each(function() {
        // TODO: This is probably very inefficient and slow.
        if ( $(this).has('td > div.mange-name > div.item-thumb').length > 0) {
            if (verbose) {
                console.log(`Element ${$(this)[0].textContent} has thumbnail.`);
            }

            if ($(this).has('td > div.mange-name > div.item-thumb > div.c-notifications').length > 0) {
                console.log("Element has notification. Not hiding.");
            } else {
                console.log("Element does not have notification. Hiding.");
                $(this).hide();
            }
        }
    });
});
