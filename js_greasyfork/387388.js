// ==UserScript==
// @name         Hot Toys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://hk.hottoys-registration.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387388/Hot%20Toys.user.js
// @updateURL https://update.greasyfork.org/scripts/387388/Hot%20Toys.meta.js
// ==/UserScript==

$('#chkAgreeTerms').removeAttr("disabled");
$('.recaptcha-checkbox-border').click();
$('.radOrderItem').prop('checked', true);
$('#txtSurname').val('SHUM');
$('#txtGivenName').val('SEN KIT');
$('#chkGenderMr')[0].checked = true;
$('#DOBMonth').val(1);
$('#DOBDay').val(5);
$('#DOBYear').val(1997);

$('#confirmDOBMonth').val(1);
$('#confirmDOBDay').val(5);
$('#confirmDOBYear').val(1997);
$('#txtContactNo').val('68489392');
$('#txtEmail').val('ssk555720@gmail.com');
$('#txtConfirmEmail').val('ssk555720@gmail.com');
$('#chkAgreeTerms').prop('checked', true);
$('#chkSubcribe').prop('checked', true);

setTimeout(function(){
   $('#submitBtn').click();
}, 2500);