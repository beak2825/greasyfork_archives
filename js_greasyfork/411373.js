// ==UserScript==
// @name            ntdo swh auto decrypt
// @namespace       Violentmonkey Scripts
// @match           https://www.softcobra.com/ntdo/ntdo-swh/*/*/
// @grant           none
// @version         1.3
// @author          Asmial
// @description     Auto decrypt ntdo swh website links
// @description:es  Descifrar automáticamente los links de la página ntdo swh
// @requires        https://nin10news.com/wp-content/themes/twentysixteen/js/aes.js
// @downloadURL https://update.greasyfork.org/scripts/411373/ntdo%20swh%20auto%20decrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/411373/ntdo%20swh%20auto%20decrypt.meta.js
// ==/UserScript==

// jshint esversion: 6

var script = document.createElement('script');
script.src = 'https://nin10news.com/wp-content/themes/twentysixteen/js/aes.js';
script.type = 'text/javascript';
script.onload = function () {
    var tables = document.querySelectorAll('tbody');
    for (let i = 0; i < tables.length; i++) {
        for (let j = 2; j < tables[i].rows.length; j += 2) {
            var res = CryptoJS.AES.decrypt(tables[i].rows[j].cells[0].innerHTML, "/").toString(CryptoJS.enc.Utf8);
            tables[i].rows[j].cells[0].innerHTML = `<a href='${res}'>${res}</a>`;
        }
    }
};
document.querySelector('head').appendChild(script);