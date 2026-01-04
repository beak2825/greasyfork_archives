// ==UserScript==
// @name         Wowhead classic redirect
// @namespace    sxxe@gmx.de
// @version      0.2
// @description  Redirects Wowhead.com to classic.wowhead.com, additinally removes adds
// @author       sxe
// @include      *.wowhead.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388448/Wowhead%20classic%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/388448/Wowhead%20classic%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var current_url = window.location.href;

    // https://www.wowhead.com/quest=1655/bailors-ore-shipment
    var regex = /(^https?:\/\/)(www.wowhead.com)(.*)/g;
    var match = regex.exec(current_url) || "";
    //console.log(current_url);
    //console.log(match[1]+" "+match[2]+" "+match[3]);
    if (match) {
        if(match[2] == 'www.wowhead.com') {
            window.location.replace(match[1]+"classic.wowhead.com"+match[3]);
        }
    }

    // remove crap from page
    $( window ).ready(function() {
        //sidbar ads
        $("#sidebar-wrapper").remove();
        $(".page-content").css("padding-right", 0);
    });

})();