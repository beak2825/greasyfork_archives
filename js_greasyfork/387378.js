// ==UserScript==
// @name         twitter latest
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.1
// @description  force web twitter to show tweets chronologically
// @author       scriptfairy
// @match        https://twitter.com/home
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387378/twitter%20latest.user.js
// @updateURL https://update.greasyfork.org/scripts/387378/twitter%20latest.meta.js
// ==/UserScript==

(function($) {

    $(document).ready(function() {
        setTimeout(function(){
            let top = $('[aria-label="Top Tweets on"]');

            if (top[0]) {
                top.trigger("click");
                setTimeout(function() {
                    let toggle = $("span:contains('See latest Tweets instead')");
                    toggle.parent().parent().parent().trigger("click");
                }, 1000);
            }

        }, 2000);
    });

})(window.jQuery);