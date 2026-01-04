// ==UserScript==
// @name         Auto Job Bot
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to auto apply jobs!
// @author       Narender
// @include      https://au.neuvoo.com/view/?id=*
// @include      https://neuvoo.ca/view/?id=*
// @include      https://www.neuvoo.ca/view/?id=*
// @include      https://neuvoo.co.uk/view/?id=*
// @include      https://www.neuvoo.co.uk/view/?id=*
// @include      https://www.neuvoo.com/view/?id=*
// @include      https://neuvoo.com/view/?id=*
// @include      https://neuvoo.de/view/?id=*
// @include      https://www.neuvoo.de/view/?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382419/Auto%20Job%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/382419/Auto%20Job%20Bot.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';
    let apply_action = document.getElementById("apply-action");
    if (apply_action) {
        apply_action.click();
        setTimeout(()=> {
            let continue_skip = document.getElementById("continue-skip");
            if (continue_skip) {
                // leveraging an internal function on page
                skip_alert();
            }
        }, 1000);
//        let user_create_response_message = document.getElementById('user-create-response-message');
//        if (user_create_response_message) {
//        }
    }
})();

