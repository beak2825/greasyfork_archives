// ==UserScript==
// @name         ELTE Covid questionnaire autofill (healthy)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fills out the questionnaire as a healthy person. Does not auto send, please review your answers.
// @author       mosomedve
// @match        https://covidkerdoiv.elte.hu/covid_kerdoiv_aktualis.php?*
// @icon         https://www.google.com/s2/favicons?domain=elte.hu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436049/ELTE%20Covid%20questionnaire%20autofill%20%28healthy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436049/ELTE%20Covid%20questionnaire%20autofill%20%28healthy%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('statusz').value = "hallgató";
    document.getElementById('kar_neve').value = "Informatikai Kar";
    document.getElementById('helyszin').value = "Szombathely";
    document.getElementById('covid_statusz_2').checked = true;
    document.getElementById('jelenlegi_tunetek_0').checked = true;
    document.getElementById('karanten_2').checked = true;
})();