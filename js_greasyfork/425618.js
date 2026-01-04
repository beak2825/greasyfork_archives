// ==UserScript==
// @name         Project Manager_SalesOrder_detailView
// @namespace    http://tampermonkey.net/
// @version      0.2.1.1
// @description  OMS Skript Project Manager Auftrags_Ansicht
// @author       Michel Lappe
// @match        https://crmz.org/index.php?module=SalesOrder&view=Detail&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425618/Project%20Manager_SalesOrder_detailView.user.js
// @updateURL https://update.greasyfork.org/scripts/425618/Project%20Manager_SalesOrder_detailView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#SalesOrder_detailView_fieldValue_oms_picklist_product_id').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_oms_picklist_squad_id').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_953').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_991').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1257').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1047').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_997').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_911').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1003').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1472').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_951').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_2323').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_2251').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_999').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1632').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1007').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1756').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1758').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1760').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_street').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_city').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_code').css('background-color', 'yellow');

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
var adresse = $('#SalesOrder_detailView_fieldValue_ship_street>span.value').text().trim();
var auftragsnr = $('#SalesOrder_detailView_fieldValue_salesorder_no>span.value').text().trim();

$('#SalesOrder_detailView_fieldLabel_account_id')
.append("<button>Timo liefert ab</button>")
.click(
    () => copyToClip('' + plz + ' ' + ort + ', ' + adresse + '')
);

    $('#SalesOrder_detailView_fieldLabel_salesorder_no')
.append("<button>Tr-hello</button>")
.click(
    () => copyToClip('<span>' + auftragsnr + ' ' + unternehmen + '</span>')
);

})();
