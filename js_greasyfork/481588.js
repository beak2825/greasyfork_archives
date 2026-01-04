// ==UserScript==
// @name         nonono
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  no.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481588/nonono.user.js
// @updateURL https://update.greasyfork.org/scripts/481588/nonono.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectOnRefresh() {
    
        var redirectURL = "https://";
        if (performance.navigation.type === 1) {
            window.location.href = redirectURL;
        }
    
}
    redirectOnRefresh();

function cariDanKlik() {
        const elemen = document.querySelector('a[href="javascript:location.reload();"]');
        if (elemen) {
            elemen.click();
        }
    }

    // Panggil fungsi setelah halaman selesai dimuat
    window.addEventListener('load', cariDanKlik);

})();
