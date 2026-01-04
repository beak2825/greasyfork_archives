// ==UserScript==
// @name         Youtube Country Restriction Forwarder
// @namespace    YTUB
// @version      1.0
// @description  Automatically forwards country-blocked YouTube videos to clipzag.com
// @author       etwas based on Youtube Unblocker by drhouse
// @include      https://www.youtube.com/watch*
// @include      https://clipzag.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      CC-BY-4.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/466944/Youtube%20Country%20Restriction%20Forwarder.user.js
// @updateURL https://update.greasyfork.org/scripts/466944/Youtube%20Country%20Restriction%20Forwarder.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    $(window).on("load", function() {
        setTimeout(function() {
            if ($('#subreason').text().includes("country")) {
                location = ('https://clipzag.com/watch' + location.search);
            }
        }, 1000);
    });

})(jQuery);