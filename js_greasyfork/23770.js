// ==UserScript==
// @name          Web Jaguar
// @version        0.1
// @description   Clear Product Search in Backend
// @author         Me
// @require     http://code.jquery.com/jquery-latest.min.js
// @include      http://promotionalproducts.wjserver630.com/admin/*
// @copyright     2016 Me
// @grant GM_setClipboard
// @namespace https://greasyfork.org/users/71462
// @downloadURL https://update.greasyfork.org/scripts/23770/Web%20Jaguar.user.js
// @updateURL https://update.greasyfork.org/scripts/23770/Web%20Jaguar.meta.js
// ==/UserScript==

$(document).ready(function() {

$('.searchformBox').append("<button id='clear' type='button'>Reset Search</button>"); // Adds Reset Button

$("#clear").click(function(e) {
 e.preventDefault();
 $("#category").val('');
 $("[name='product_id']").val('');
 $("[name='product_name']").val('');
 $("[name='short_desc']").val('');
 $("[name='product_sku']").val('');
 $("[name='salesTag_title']").val('');
 $('select[name="_type"]>option:eq(0)').prop('selected', true); // Sets dropdown to ALL
 $('select[name="_inventory"]>option:eq(0)').prop('selected', true); // Sets dropdown to ALL
 $("[name='oh_number']").val('');
 $("[name='afs_number']").val('');
 $('select[name="_active"]>option:eq(0)').prop('selected', true); // Sets dropdown to ALL
 $("[name='supplier_company']").val('');
 $("[name='supplier_account_number']").val('');
 $('select[name="manufacturer"]>option:eq(0)').prop('selected', true); // Sets dropdown to Blank
 $('select[name="productFieldNumber"]>option:eq(5)').prop('selected', true); // Sets field search to Supplier SKU
 $("input[name='productField']").val('');
 });
});