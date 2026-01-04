// ==UserScript==
// @name         Kapiland Blinkende Zeitung entfernen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lässt die Zeitung nicht mehr blinken
// @author       jockel09
// @match        http://*.kapilands.eu/main.php*
// @icon         https://www.google.com/s2/favicons?domain=kapiland.de
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488431/Kapiland%20Blinkende%20Zeitung%20entfernen.user.js
// @updateURL https://update.greasyfork.org/scripts/488431/Kapiland%20Blinkende%20Zeitung%20entfernen.meta.js
// ==/UserScript==

var j = jQuery.noConflict();


j("img[src*='zeitung_blink.gif']").each(function() {
    j("img[src*='zeitung_blink.gif']").attr('src', 'http://kapigfx1.wavecdn.de/pics/zeitung2n.gif');
});