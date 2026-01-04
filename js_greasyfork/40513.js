// ==UserScript==
// @name         Greentext
// @namespace    http://pastebin.com/
// @version      0.1
// @description  Make greentext actually green!
// @author       Wolvan
// @match        *://pastebin.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @icon         http://i.imgur.com/d9FGWV5.png
// @downloadURL https://update.greasyfork.org/scripts/40513/Greentext.user.js
// @updateURL https://update.greasyfork.org/scripts/40513/Greentext.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery.noConflict(true);

    $("ol.text > li > div").each(function() {
        if ($(this).text().trim().startsWith(">")) $(this).attr("style", "color: #8ba446 !important;");
    });
    // Your code here...
})();