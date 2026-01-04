// ==UserScript==
// @name         Sterge AWB DPD
// @namespace    dedeman
// @version      1.1
// @description  Stergere AWB-uri de test din MyDPD (Onesti)
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @author       Dragos
// @match        https://mydpd.dpd.ro/consignments/unconfirmed
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/383112/Sterge%20AWB%20DPD.user.js
// @updateURL https://update.greasyfork.org/scripts/383112/Sterge%20AWB%20DPD.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    $(".cancel-consignment-btn").off('click').on('click', function () {
        setTimeout(function(){
            $('#cancel-consignment-dialog-comment').val('AWB de test');
            $('#cancel-consignment-dialog .btn-save').click();
        }, 300);
    });
})();