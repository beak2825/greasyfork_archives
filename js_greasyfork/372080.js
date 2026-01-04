// ==UserScript==
// @name         twitter opener
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Opens stuff and closes stuff
// @author     JKS
// @icon         https://i.imgur.com/YAadD6h.png
 //@include https://www.mturkcontent.com/*
// @include https://s3.amazonaws.com/*
// @match       https://worker.mturk.com/projects*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/372080/twitter%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/372080/twitter%20opener.meta.js
// ==/UserScript==


var AMAZON;


[].forEach.call(document.querySelectorAll("a[href*=\"twitter.com\"]"), function(anchor) {
   AMAZON = window.open(anchor.href, "_blank","toolbar=yes,scrollbars=yes,resizable=yes,top=0000,left=1000,width=800,height=800");
});
 $(window).on('beforeunload', function() {
    if(AMAZON) {
        AMAZON.close();
    }});