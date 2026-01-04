// ==UserScript==
// @name         Facebook on Tahoma
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/30594/Facebook%20on%20Tahoma.user.js
// @updateURL https://update.greasyfork.org/scripts/30594/Facebook%20on%20Tahoma.meta.js
// ==/UserScript==

(function($) {
    'use strict';
   var style = "body, button, input, label, select, td, textarea { " +
       "font-family: Tahoma;" +
       "}";
    var styleDom = $('<style type="text/css"></style>');
    styleDom.text(style);
    $('body').append(styleDom);
    
})(jQuery);