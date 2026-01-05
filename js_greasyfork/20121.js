// ==UserScript==
// @name		NELNET auto populator
// @description      auto populates the fields for nelnet on test
// @namespace	harry
// @version		0.1.2
// @include		https://uatquikpayasp.com/rit/qp/epay/*

// @downloadURL https://update.greasyfork.org/scripts/20121/NELNET%20auto%20populator.user.js
// @updateURL https://update.greasyfork.org/scripts/20121/NELNET%20auto%20populator.meta.js
// ==/UserScript==

document.getElementById('cardholdername_in').value = 'Test Name';
document.getElementById('cardtype_in').value = 'VISA';
document.getElementById('cardnumber_in').value = '4111111111111111';
document.getElementById('cvvcode_in').value = '999';

var sel1 = document.getElementById('include_CreditCardFormElement_expMonth');
var optionEls = sel1.getElementsByTagName('option');
optionEls[1].selected = 'selected';

sel1 = document.getElementById('include_CreditCardFormElement_expYear');
optionEls = sel1.getElementsByTagName('option');
optionEls[2].selected = 'selected';
