// ==UserScript==
// @name         Sales_SalesOrder_editView
// @namespace    http://tampermonkey.net/
// @version      0.2.1.1
// @description  OMS Skript Vertrieb Auftrags_Bearbeitung
// @author       Michel Lappe
// @match        https://crmz.org/index.php?module=SalesOrder&view=Edit&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425612/Sales_SalesOrder_editView.user.js
// @updateURL https://update.greasyfork.org/scripts/425612/Sales_SalesOrder_editView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(2) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(4) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(4) > td:nth-child(4)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(6) > td:nth-child(4)').css('background-color', 'yellow');

    $('#oms_picklist_product_id_display').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(10) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(7) > tbody > tr:nth-child(11) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(11) > tbody > tr:nth-child(3) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(11) > tbody > tr:nth-child(4) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(13) > tbody > tr:nth-child(2) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(13) > tbody > tr:nth-child(2) > td:nth-child(2)').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_cf_961').css('background-color', 'yellow');

    $('#oms_picklist_branch_id_display').css('background-color', 'yellow');

    $('#EditView > table:nth-child(39) > tbody > tr:nth-child(2) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(39) > tbody > tr:nth-child(2) > td:nth-child(4)').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_cf_1321').css('background-color', 'yellow');

    $('#EditView > table:nth-child(39) > tbody > tr:nth-child(7) > td:nth-child(2)').css('background-color', 'yellow');

    $('#EditView > table:nth-child(39) > tbody > tr:nth-child(12) > td:nth-child(4)').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_bill_street').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_bill_city').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_bill_code').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_ship_street').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_ship_city').css('background-color', 'yellow');

    $('#SalesOrder_editView_fieldName_ship_code').css('background-color', 'yellow');

})();
