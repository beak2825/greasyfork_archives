// ==UserScript==
// @name         Hit Catcher Companion
// @namespace    https://greasyfork.org/en/users/49275
// @version      0.3
// @description  Automatically closes the tab if no HITs avail
// @author       buttlust
// @match        https://worker.mturk.com/projects*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30820/Hit%20Catcher%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/30820/Hit%20Catcher%20Companion.meta.js
// ==/UserScript==
var sWarning = 'There are no more of these HITs available';

(function() {
    'use strict';
    $(document).ready(function() {
        if ($("div.mturk-alert.mturk-alert-danger").length) {
            console.log($("h3").text());
            if ($("h3").text().trim().indexOf(sWarning) >= 0) {
                window.top.close();
            }
        }
    });
})();