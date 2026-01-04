// ==UserScript==
// @name         whatsappsenzarubrica
// @namespace    https://whatsappsenzarubrica.it/
// @version      1.0
// @description  Contact someone on whatsapp without having the number in the phone addressbook!
// @author       Vito Tafuni
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsappsenzarubrica.it
// @grant        none
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513969/whatsappsenzarubrica.user.js
// @updateURL https://update.greasyfork.org/scripts/513969/whatsappsenzarubrica.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let phone = prompt("Phone number", "");
    if ( phone!=null && phone != "" ) {
        window.location='https://web.whatsapp.com/send?phone='+(phone.slice(0,1)=='+'?'':'+39')+phone.replaceAll(' ','');
    }
})();

