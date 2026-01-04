// ==UserScript==
// @name        Tumblr tag scraper
// @namespace   https://github.com/baroquenroll
// @version     0.1
// @description Export the post HTML of a Tumblr tag page
// @include     https://www.tumblr.com/tagged/*
// @include     https://tumblr.com/tagged/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40433/Tumblr%20tag%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/40433/Tumblr%20tag%20scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var exportTextArea = "<textarea rows='10' cols='86' class='exportForm'>";
    $("li.post_container > div.post > div.post_wrapper").not('.new_post_buttons_container').each(function(idx) {
        exportTextArea += "\n\n" + $(this).html() + "\n\n";
    });
    $("#posts").before(exportTextArea);
})();