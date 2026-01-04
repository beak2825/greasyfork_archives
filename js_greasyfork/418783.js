// ==UserScript==
// @name         Add Raid Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adding raid button cause I'm lazy ;D
// @author       Barbaroti
// @match        https://bravehaxviustactics.com/Bot
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418783/Add%20Raid%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/418783/Add%20Raid%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var x = document.getElementsByClassName("modal-footer");
    var button = document.createElement('BUTTON');
    var text = document.createTextNode("Run Raid...");
    button.type = 'button';
    button.appendChild(text);
    button.setAttribute('onclick', 'doBattle("Raid")');
    button.setAttribute('class', 'btn btn-primary');
    x[0].insertBefore(button, x[0].firstChild);
})();