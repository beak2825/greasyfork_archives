// ==UserScript==
// @name         PrintFix
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Remove margin, padding and max-width of body.
// @author       duoduo
// @match        https://www.teach.cs.toronto.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toronto.edu
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515311/PrintFix.user.js
// @updateURL https://update.greasyfork.org/scripts/515311/PrintFix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = $("<button>Print Fix</button>");
    $("body").prepend(btn);

    btn.on("click", function() {
        $("body").css("width", "100%");
        $("body").css("margin", "6px");
        $("body").css("max-width", "10000000000px");
        $("body").css("padding", "0px");
    });
})();