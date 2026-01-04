// ==UserScript==
// @name         AirAlgerie Error Reload
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  reload error page until you find a flight
// @author       You
// @match        https://*.airalgerie.dz/*
// @icon         https://www.google.com/s2/favicons?domain=airalgerie.dz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429204/AirAlgerie%20Error%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/429204/AirAlgerie%20Error%20Reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // in case DOM loaded longer than 6s, reload page
      var backup = window.setTimeout(function(){
        window.location.reload();
     },12000);

     window.setTimeout(function(){
        backup = null;
        if (window.location.href.indexOf('Override.action') == -1) {
            document.querySelector('div[data-tab="new-booking"]').click();

            document.querySelector('label[for="new-booking-2-way"]').click()

            document.querySelector('#seldcity1').value = 'Paris (ORY)';
            document.querySelector('#selacity1').value = 'Alger (ALG)';
            document.querySelector('#selddate1').value = '15 juil. 2021';

            document.querySelector('button[class="simple-btn js-submit-booking"]').click();
        } else {
                if (window.document.querySelector('.alert-title').innerText.indexOf('Une erreur') != -1 || window.document.querySelector('.alert-title').innerText.indexOf('went wrong') != -1){
                    window.location = 'https://airalgerie.dz/';
                }
        }

    },6000);


})();