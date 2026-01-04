// ==UserScript==
// @name         Facebook Ads preferences eraser
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove the Ad personalisation, until or you have empty preferences or you get blocked for a while to ads preferences
// @author       Martino Mensio
// @match        https://www.facebook.com/ds/preferences/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396998/Facebook%20Ads%20preferences%20eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/396998/Facebook%20Ads%20preferences%20eraser.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';

    setTimeout(function() {
        // alive!!!
        console.log('running erasr');

        // declaration of the CSS selectors
        var interests_selector = 'div[id="interests"]';
        var interacted_selector = 'div[id="interacted"]';
        var tabs_selector = 'a[role="tab"]';
        var buttons_selector = 'button[data-tooltip-content="Remove"]';
        var other_buttons_selector = 'button[data-tooltip-content="Hide all ads from this advertiser"]';

        // let's see if we have already run this script before (by using the search parameter "deleted"
        var current_url = new URL(location.href);
        var previously_removed = current_url.searchParams.get('deleted') || 0;
        var total_removed = previously_removed;
        console.log('previously_removed ' + total_removed);
        // when it's the first run, ask if would like to start
        if(!total_removed && !confirm('Delete the preferences?')) {
            // terminate in this case
            return;
        }

        // locate the vertical zones of interest (your interests and advertisers and businesses)
        var zones = [document.querySelector(interests_selector), document.querySelector(interacted_selector)];
        console.log(zones);
        for (var z of zones) {
            // expand the zone
            z.click();
            console.log('clicked on zone');
            // conditionally test if expanded or not
            if (!document.querySelectorAll(tabs_selector)) {
                z.click();
            }
            // find the horizontal tabs of this vertical zone
            var tabs = z.parentElement.querySelectorAll(tabs_selector);
            console.log('found ' + tabs.length + ' tabs');
            for (var t of tabs) {
                // switch to the tab
                t.click();
                // find the "x" buttons
                var buttons = document.querySelectorAll(buttons_selector);
                for (var b of buttons) {
                    // click each one of them
                    b.click();
                    total_removed++;
                }
                // same as before, but in vertical zone 2 the selector is different
                buttons = document.querySelectorAll(other_buttons_selector);
                for (var b2 of buttons) {
                    b2.click();
                    total_removed++;
                }
            }
        }
        var msg = 'Removed ' + total_removed + ' preferences.';
        // see if it is the case to reload
        var do_reload = false;
        if (total_removed != previously_removed) {
            // if some more have been removed, ask if continue or stop
            do_reload = confirm(msg + ' Reload the page to delete more?');
        }
        else {
            // otherwise just brag to the user
            alert(msg);
        }
        if (do_reload) {
            // update the search parameter
            current_url.searchParams.set('deleted', total_removed);
            // and reload
            location.href = current_url.href;
        }

    }, 10000);
})();