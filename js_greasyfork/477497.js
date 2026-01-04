// ==UserScript==
// @name         zmiana ilosci osob w wozie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modyfikacja pod autoplaya
// @author       Niby informatyk
// @match        https://www.operatorratunkowy.pl/vehicles/*/edit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=operatorratunkowy.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477497/zmiana%20ilosci%20osob%20w%20wozie.user.js
// @updateURL https://update.greasyfork.org/scripts/477497/zmiana%20ilosci%20osob%20w%20wozie.meta.js
// ==/UserScript==
var $ = window.jQuery;




function autoplay_change() {
 return;
}


(function() {
    'use strict';

    $("#vehicle_personal_max option:first").attr('selected', 'selected');
    document.querySelector("#iframe-inside-container > form > div.form-actions > input").click();



})();