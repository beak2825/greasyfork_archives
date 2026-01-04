// ==UserScript==
// @name         Quitar mailtrack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mail.google.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34204/Quitar%20mailtrack.user.js
// @updateURL https://update.greasyfork.org/scripts/34204/Quitar%20mailtrack.meta.js
// ==/UserScript==

(function() {
    $( document ).ready(function() {
        $("body").on("click", function() {
            $(".mt-signature").remove();
        });
    });

    // Your code here...
})();