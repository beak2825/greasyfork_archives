// ==UserScript==
// @name        JR cary helper
// @version     0.1
// @namespace   https://greasyfork.org/users/6406
// @description A script to make cary hits a little bit faster
// @author      (JohnnyRS)
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @include     http*://*mturkcontent.com/dynamic*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16817/JR%20cary%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/16817/JR%20cary%20helper.meta.js
// ==/UserScript==

function isCaryPage() { return $('div.panel-body:contains("Help us categorize this restaurant data")').length; }

$(function() {
    if ( isCaryPage() ) {
        $(document).keydown(function(event) {
            if (event.which == 49 || event.which == 97) {
                $("#result_type").prop('value', "other");
            }
            if (event.which == 50 || event.which == 98) {
                $("#result_type").prop('value', "ok");
            }
        });
    }
});
