// ==UserScript==
// @name         Sales_Quotes_editView
// @namespace    http://tampermonkey.net/
// @version      0.2.1.1
// @description  OMS Skript Vertrieb Angebots_Bearbeitung
// @author       Michel Lappe
// @match        https://crmz.org/index.php?module=Quotes&view=Edit&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425617/Sales_Quotes_editView.user.js
// @updateURL https://update.greasyfork.org/scripts/425617/Sales_Quotes_editView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(3) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(6) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(9) > td.fieldValue.medium').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(8) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(7) > td:nth-child(4)').css('background-color', 'yellow');

    $('#Quotes_editView_fieldName_bill_street').css('background-color', 'yellow');

    $('#Quotes_editView_fieldName_bill_code').css('background-color', 'yellow');

    $('#Quotes_editView_fieldName_bill_city').css('background-color', 'yellow');

    $('#Quotes_editView_fieldName_ship_street').css('background-color', 'yellow');

    $('#Quotes_editView_fieldName_ship_code').css('background-color', 'yellow');

    $('#Quotes_editView_fieldName_ship_city').css('background-color', 'yellow');

    $('#EditView > table:nth-child(13) > tbody > tr:nth-child(2) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(13) > tbody > tr:nth-child(2) > td:nth-child(4)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(17) > tbody > tr:nth-child(2) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(17) > tbody > tr:nth-child(3) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(17) > tbody > tr:nth-child(3) > td:nth-child(4)').css('background-color', 'yellow');

    $('#lineItemTab > tbody > tr:nth-child(1) > th:nth-child(1)').css('background-color', 'yellow');

})();
