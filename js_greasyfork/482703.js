// ==UserScript==
// @name         Eskisozluk URL yönlendirici
// @namespace    electrigeneer
// @version      0.1
// @description  Google üzerindeki eksisozluk1999.com adresine tıklandığında otomatik olarak eksisozluk111.com adresine yönlendirir
// @match        *://www.google.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=eksisozluk.com
// @downloadURL https://update.greasyfork.org/scripts/482703/Eskisozluk%20URL%20y%C3%B6nlendirici.user.js
// @updateURL https://update.greasyfork.org/scripts/482703/Eskisozluk%20URL%20y%C3%B6nlendirici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(event) {
        var link = event.target.closest('a');
        // Özelleştirilebilir URL
        if (link && link.href.includes('eksisozluk1999.com')) {
            event.preventDefault();
            // Özelleştirilebilir URL
            var yeniURL = link.href.replace('eksisozluk1999.com', 'eksisozluk111.com');
            window.location.href = yeniURL;
        }
    }, true);
})();
