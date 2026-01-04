// ==UserScript==
// @name         Trade route quick activate
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.travian.com/build.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419602/Trade%20route%20quick%20activate.user.js
// @updateURL https://update.greasyfork.org/scripts/419602/Trade%20route%20quick%20activate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#sidebarBoxLinklist').append('<div><input style="background-color: #fff" id="deactivate" type="button" value="deactivate all" /></div>')
    $('#sidebarBoxLinklist').append('<div><input style="background-color: #fff" id="activate" type="button" value="activate all" /></div>')

    $('#deactivate').on('click', function() {
        $('input[type="checkbox"]').each(function(i, el) { if (this.checked) {$(this).click()}})
    });

    $('#activate').on('click', function() {
        $('input[type="checkbox"]').each(function(i, el) { if (!this.checked) {$(this).click()}})
    });
})();