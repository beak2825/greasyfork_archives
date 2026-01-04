// ==UserScript==
// @name         pepper reniferki
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  pułapka na reniferki
// @author       Szymon Borda
// @match        https://www.pepper.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36545/pepper%20reniferki.user.js
// @updateURL https://update.greasyfork.org/scripts/36545/pepper%20reniferki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function () {
        setInterval(function () {
            $('div[data-handler="replace"]').click();
            console.log('Symulacja kliknięcia renifera...');
        }, 2000);

        setTimeout(function () {
            location.reload();
        }, 30000);
        //$('.vote-up').click();
        console.log('Strona zostanie odświeżona za 30 sekund...');
    });


})();
