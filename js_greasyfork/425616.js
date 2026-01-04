// ==UserScript==
// @name         Project Planner_SalesOrder_detailView
// @namespace    http://tampermonkey.net/
// @version      0.2.1.1
// @description  OMS Skript Project Planner Auftrags_Ansicht
// @author       You
// @match        https://crmz.org/index.php?module=SalesOrder&view=Detail&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425616/Project%20Planner_SalesOrder_detailView.user.js
// @updateURL https://update.greasyfork.org/scripts/425616/Project%20Planner_SalesOrder_detailView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#SalesOrder_detailView_fieldValue_cf_957').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_909').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1050').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_street').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_code').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_ship_city').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1528').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_979').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1532').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1746').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_1510').css('background-color', 'yellow');

    $('#SalesOrder_detailView_fieldValue_cf_991').css('background-color', 'yellow');

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
.append("<button>Trello</button>")
.click(
    () => copyToClip('<span>' + auftragsnr + ' ' + unternehmen + '</span>')
);

})();