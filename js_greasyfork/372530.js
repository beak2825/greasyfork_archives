// ==UserScript==
// @name         Google Calendar on Verdana
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  see name
// @author       csapdani
// @match        https://calendar.google.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/372530/Google%20Calendar%20on%20Verdana.user.js
// @updateURL https://update.greasyfork.org/scripts/372530/Google%20Calendar%20on%20Verdana.meta.js
// ==/UserScript==

(function($) {
    'use strict';
   var style = "body, button, input, label, select, td, textarea { " +
       "font-family: Verdana;" + "font-color: white;" + "font-size: 12px;"
       "}";
    var styleDom = $('<style type="text/css"></style>');
    styleDom.text(style);
    $('body').append(styleDom);
    
})(jQuery);