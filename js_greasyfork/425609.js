// ==UserScript==
// @name         Sales_SalesOrder_detailView
// @namespace    http://tampermonkey.net/
// @version      0.3.0.0
// @description  OMS Skript Vertrieb Auftrags_Ansicht
// @author       Michel Lappe
// @match        https://crmz.org/index.php?module=SalesOrder&view=Detail&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425609/Sales_SalesOrder_detailView.user.js
// @updateURL https://update.greasyfork.org/scripts/425609/Sales_SalesOrder_detailView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#SalesOrder_detailView_fieldValue_sostatus').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_subject').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_assigned_user_id').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_type').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_953').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_oms_picklist_branch_id').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1321').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1325').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1434').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_street').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_city').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_code').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_bill_street').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_bill_city').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_bill_code').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_customerno').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1632').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1752').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_909').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1075').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_961').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1694').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_oms_picklist_product_id').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_959').css('background-color', 'yellow');

function copyToClip(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};

var unternehmen = $('#SalesOrder_detailView_fieldValue_account_id').text();
var auftrag = '<a href="' + document.location.href + '">'
+ $('#SalesOrder_detailView_fieldValue_subject').text() + '</a> ';

var unternehmen = $('#SalesOrder_detailView_fieldValue_account_id').text().trim();
var auftrag = '<a href="' + document.location.href + '">'
+ $('#SalesOrder_detailView_fieldValue_subject').text() + '</a> ';

var plz = $('#SalesOrder_detailView_fieldValue_ship_code>span.value').text().trim();
var ort = $('#SalesOrder_detailView_fieldValue_ship_city>span.value').text().trim();
var umfang = $('#SalesOrder_detailView_fieldValue_cf_1321>span.value').text().trim();
var lieferdatum = $('#SalesOrder_detailView_fieldValue_cf_909>span.value').text().trim();
var adresse = $('#SalesOrder_detailView_fieldValue_ship_city>span.value').text().trim();
var auftragsnr = $('#SalesOrder_detailView_fieldValue_salesorder_no>span.value').text().trim();
var pruefung = $('#SalesOrder_detailView_fieldValue_cf_1075>span.value').text().trim();
var umfang = $('#SalesOrder_detailView_fieldValue_cf_1321>span.value').text().trim();

$('#SalesOrder_detailView_fieldLabel_account_id')
.append("<button>Betreff</button>")
.click(
    () => copyToClip('' + auftragsnr + ' ' + unternehmen + ' // ' + adresse + '')
);

    $('#SalesOrder_detailView_fieldLabel_cf_1331')
.append("<button>Beschreibung</button>")
.click(
    () => copyToClip('<span>' + pruefung  + ' // ' +umfang + ' // CRM: https://crmz.org/index.php?module=SalesOrder&view=Detail&record=' + auftragsnr + '</span>')
);

})();
