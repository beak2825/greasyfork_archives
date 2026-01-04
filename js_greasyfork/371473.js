// ==UserScript==
// @name         animeout downlaod list
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Provides a download list to the free download servers.
// @author       You
// @match        https://www.animeout.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371473/animeout%20downlaod%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/371473/animeout%20downlaod%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery("body").prepend("<textarea id='LinkList' style='width:100%'></textarea>");
    var textArea =jQuery("#LinkList");
    jQuery.each( jQuery( "a:contains(Direct Download)" ), function( i, val ) {
        var link = jQuery(val).attr("href").substring(7)
        link = "http://public.animeout.xyz/" + link;
        textArea.val( textArea.val() + "\n" + link);
    });


    // Your code here...
})();