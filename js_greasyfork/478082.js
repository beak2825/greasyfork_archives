// ==UserScript==
// @name         zmiana ilosci osob w wozie na max
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zmiana ilosci osob w wozie na max!
// @author       Niby informatyk
// @match        https://www.operatorratunkowy.pl/vehicles/*/edit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=operatorratunkowy.pl
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/478082/zmiana%20ilosci%20osob%20w%20wozie%20na%20max.user.js
// @updateURL https://update.greasyfork.org/scripts/478082/zmiana%20ilosci%20osob%20w%20wozie%20na%20max.meta.js
// ==/UserScript==
var $ = window.jQuery;




function autoplay_change() {
 return;
}


(function() {
    'use strict';

    $("#vehicle_personal_max option:last").attr('selected', 'selected');
    document.querySelector("#iframe-inside-container > form > div.form-actions > input").click();
    setTimeout(function(){
                window.close();
            }, 1000);



})();