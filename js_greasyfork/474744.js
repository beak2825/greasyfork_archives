// ==UserScript==
// @name         Mittvaccin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Åtgärdar de värsta galenskaperna vid registrering av nya patienter i Mittvaccin
// @author       Mårten Segerkvist
// @match        https://mvjournal.mittvaccin.se/index.php?p=patient&u=addKund
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mittvaccin.se
// @grant        none
// @licence      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/474744/Mittvaccin.user.js
// @updateURL https://update.greasyfork.org/scripts/474744/Mittvaccin.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('#patient_form').first('table.tr:first').prepend('<tr><td><label class="form_label">Personnummer (alla siffror)</label></td><td><input type="text" class="mittvaccin_mod" style="width: 120px" value></td></tr>');
    $('.mittvaccin_mod').on('keyup', function() {
        var pnr = $('.mittvaccin_mod').val().replaceAll('-', '');
        if (pnr.length != 12) {
            return;
        }
        var cent = pnr.substring(0,2);
        if (cent != '19' && cent != '20') {
            return;
        }
        if (isNaN(pnr.substring(3,12))) {
            return;
        }
        var pnr1 = pnr.substring(2,8);
        var pnr2 = pnr.substring(8,12);
        $('#century option[value="' + cent + '"]').attr('selected', 'selected');
        $('#centurySelectBoxItText').attr('data-val', cent);
        $('#centurySelectBoxItText').html(cent);
        $('[name="patient_pnr_2"]').val(pnr1);
        $('[name="patient_pnr_3"]').val(pnr2);
        $('[name="patient_pnr_3"]').trigger('onkeyup');
    });
});

