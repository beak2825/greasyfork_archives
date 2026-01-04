// ==UserScript==
// @name         HKK ClinicCare Choose Alle
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  This script will choose alle when opening the calender in ClinicCare
// @author       You
// @match        https://login.cliniccare.dk/cc045/*
// @match        http://login.cliniccare.dk/cc045/*
// @icon         https://www.google.com/s2/favicons?domain=hudkraeftklinikken.dk
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/431340/HKK%20ClinicCare%20Choose%20Alle.user.js
// @updateURL https://update.greasyfork.org/scripts/431340/HKK%20ClinicCare%20Choose%20Alle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Selecting Alle'); 
    setTimeout(function() {
      document.getElementById("ctl00_MainContent_cUInit").options[document.getElementById("ctl00_MainContent_cUInit").options.length-1].selected = "selected";
          const isGM = 'undefined' === typeof GM_info.script.author;
	if(isGM){
            unsafeWindow.Setatid();
        }else{
            Setatid();
        }
    }, 1000);
    console.log('Done');
})();