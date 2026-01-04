// ==UserScript==
// @name            Fullscreen NO-IP
// @name:es         Pantalla completa NO-IP
// @name:ru         Fullscreen NO-IP
// @namespace       Violentmonkey Script
// @include         *.zapto.org/
// @include         *.3utilities.com/
// @include         *.bounceme.net/
// @include         *.ddns.net/
// @include         *.ddnsking.com/
// @include         *.freedynamicdns.net/
// @include         *.freedynamicdns.org/
// @include         *.gotdns.ch/
// @include         *.hopto.org/
// @include         *.myddns.me/
// @include         *.myftp.biz/
// @include         *.myftp.org/
// @include         *.myvnc.com/
// @include         *.onthewifi.com/
// @include         *.redirectme.net/
// @include         *.servebeer.com/
// @include         *.serveblog.net/
// @include         *.servecounterstrike.com/
// @include         *.serveftp.com/
// @include         *.servegame.com/
// @include         *.servehalflife.com/
// @include         *.servehttp.com/
// @include         *.serveminecraft.net/
// @include         *.servemp3.com/
// @include         *.servepics.com/
// @include         *.servequake.com/
// @include         *.sytes.net/
// @include         *.viewdns.net/
// @include         *.webhop.me/
// @grant           none
// @version         0.3.1
// @author          Lood Strike
// @description     20/5/2024, 17:46:27
// @description:es  20/5/2024, 17:46:27
// @description:ru  20/5/2024, 17:46:27
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/495617/Fullscreen%20NO-IP.user.js
// @updateURL https://update.greasyfork.org/scripts/495617/Fullscreen%20NO-IP.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var frameset = document.querySelector('frameset');
    if (frameset) {
        frameset.setAttribute('rows', '0');
        console.log("El atributo 'rows' se ha establecido a '0' por un script de 'Violentmonkey'");
    } else {
    }
})();
