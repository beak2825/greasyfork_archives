// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Private.
// @author       You
// @match        https://publictesting.uwyo.edu/formRegister.php
// @icon         https://www.google.com/s2/favicons?domain=uwyo.edu
// @downloadURL https://update.greasyfork.org/scripts/429383/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/429383/New%20Userscript.meta.js
// ==/UserScript==

(async () => {
    'use strict';

     function makeRandom(chars, length) {
        var result           = '';
        var characters       = chars;
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }    

     let $clientEmailElm = document.getElementById('clientEmail');
     let $clientDobElm = document.getElementById('clientDOB');
     let $clientFirstNameElm = document.getElementById('clientFirstName');
     let $clientLastNameElm = document.getElementById('clientLastName');

     let $clientGenderElm = $('#clientGender');
     let $clientRaceElm = $('#clientRace');
     let $clientEthnicityElm = $('#clientEthnicity')

     let $clientCellPhoneElm = document.getElementById('clientCellPhone');
     let $clientAddressElm = document.getElementById('clientAddress1');
     let $clientCityElm = document.getElementById('clientCity');
     let $clientStateElm = document.getElementById('clientState');
     let $clientZipElm = document.getElementById('clientZip');
     let $clientConsentElm = document.getElementById('consent');
     let $clientConsentNameElm = document.getElementById('clientName');
     let $clientPasswordElm = document.getElementById('clientPassword');
     let $clientPasswordRepeatElm = document.getElementById('repeatPassword');

     let $alphaBoth = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
     let $numeric = "0123456789";

     $clientEmailElm.value = `${makeRandom($alphaBoth, 10)}@${makeRandom($alphaBoth, 10)}.com`;
     $clientDobElm.value = "01/01/2001";
     $clientFirstNameElm.value = makeRandom($alphaBoth, 10);
     $clientLastNameElm.value = makeRandom($alphaBoth, 10);

     let $randNum1 = Math.floor(Math.random() * 3) + 1;
     let $randNum2 = Math.floor(Math.random() * 6) + 1;
     let $randNum3 = Math.floor(Math.random() * 3) + 1;

     $clientGenderElm.find(`option:eq(${$randNum1})`).prop("selected", "selected");
     $clientRaceElm.find(`option:eq(${$randNum2})`).prop("selected", "selected");
     $clientEthnicityElm.find(`option:eq(${$randNum3})`).prop("selected", "selected");

     $clientGenderElm.trigger('change.select2');
     $clientEthnicityElm.trigger('change.select2');
     $clientRaceElm.trigger('change.select2');

     $clientCellPhoneElm.value = makeRandom($numeric, 9);
     $clientAddressElm.value = makeRandom($alphaBoth, 10) + " " + makeRandom($alphaBoth, 10);
     $clientCityElm.value = makeRandom($alphaBoth, 10);
     $clientStateElm.value = makeRandom($alphaBoth.toUpperCase(), 2);
     $clientZipElm.value = makeRandom($numeric, 5);

     $clientConsentElm.checked = true;
     $clientConsentNameElm.value = $clientFirstNameElm.value + " " + $clientLastNameElm.value;
     $clientPasswordElm.value = "Aardvark!";
     $clientPasswordRepeatElm.value = "Aardvark!";
})();