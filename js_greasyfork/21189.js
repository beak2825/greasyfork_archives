// ==UserScript==
// @name         trvn_button_fix
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  fix button class
// @author       iti
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include      http://*.travian.*/build.php?id=39*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21189/trvn_button_fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21189/trvn_button_fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btnOk = document.getElementById('btn_ok');
    var btnEdit = document.getElementById('btn_edit');
    console.log(btnOk);
    console.log(btnEdit);
    if( btnOk !== undefined && btnEdit !== undefined ){
        btnEdit.className = 'green rallyPointConfirm';
        btnOk.className = 'green';
        btnEdit.parentNode.insertBefore(btnOk, btnEdit);
    }
})();