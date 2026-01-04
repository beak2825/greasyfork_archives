// ==UserScript==
// @name         Viki Title Request Auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send automatic requests for drama on Viki
// @author       Sisyphe
// @include      http://vikiinc.wufoo.com/forms/title-request-form/
// @include      http://vikiinc.wufoo.com/confirm/title-request-form/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31525/Viki%20Title%20Request%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/31525/Viki%20Title%20Request%20Auto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href == "http://vikiinc.wufoo.com/forms/title-request-form/") {
        // Modifier les valeurs ici pour qu'elles correspondent au drama
        document.getElementById("Field1").value 	= 'Into the New World';
        document.getElementById("Field13").value 	= 'Korea';
        document.getElementById("Field7").value 	= 'TV Show';
        document.getElementById("Field9").value 	= 'Viki.com';
        document.getElementById("Field19").value 	= 'France';
        document.getElementById("form1").submit();
    } else {
        setTimeout(function() {
            window.location.href = "http://vikiinc.wufoo.com/forms/title-request-form/";
        }, 5000);
    }
})();