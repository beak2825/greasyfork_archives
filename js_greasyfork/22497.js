// ==UserScript==
// @name         ao3 clone subscribe button
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.2
// @description  recreate subscribe button at end of works
// @author       scriptfairy
// @include      /https?://archiveofourown\.org/works/\d+/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22497/ao3%20clone%20subscribe%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/22497/ao3%20clone%20subscribe%20button.meta.js
// ==/UserScript==

(function($) {
    $(document).ready(function() {
        var sub = $('li.subscribe').clone();
        $('#new_kudo').parent().after(sub);
    });
})(window.jQuery);