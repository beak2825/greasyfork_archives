

// ==UserScript==
// @name         No disabled
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382645/No%20disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/382645/No%20disabled.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function () {
        console.log("No disabled now execute");
        console.log($("input"));
        $("input").each(function( index ) {
            console.log( index + ": " + $( this ).text() );
            $(this).removeAttr("disabled");
        });


        console.log($("textarea"));
        $("textarea").each(function( index ) {
            console.log( index + ": " + $( this ).text() );
            $(this).removeAttr("disabled");
        });
        console.log("No disabled complete executed");
    }, 4500);
})();



