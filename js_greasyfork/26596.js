// ==UserScript==
// @name           Allow copy-paste of Costco membership number on login page of www.costcotravel.ca
// @namespace      none
// @description    Disable the membership number validation, so that the number can be pasted with ctrl+v

// @include        https://www.costcotravel.ca/*

// @run            document-end

// @author         Markus Meier
// @copyright      Creative Commons Attribution-Attribution 4.0 International (CC BY 4.0)
// @license        https://creativecommons.org/licenses/by/4.0/
// @version        1.0
// @lastupdated    2017.01.16
// 
// @downloadURL https://update.greasyfork.org/scripts/26596/Allow%20copy-paste%20of%20Costco%20membership%20number%20on%20login%20page%20of%20wwwcostcotravelca.user.js
// @updateURL https://update.greasyfork.org/scripts/26596/Allow%20copy-paste%20of%20Costco%20membership%20number%20on%20login%20page%20of%20wwwcostcotravelca.meta.js
// ==/UserScript==
//-------------------------------------------------------------------------------------------------------------------

// The membershipNumber form field on the login page intercepts key press events to validate the Costco membership
// number. The validator only allows numeric keystrokes, which effectively disables keyboard pasting with ctrl+v.
// Fantastic achievement, Costco guys!
// We simply remove the onkeypress event, killing the validation. Any input is now possible.

var inputs = document.getElementsByTagName('input');
for (var i=0; i < inputs.length; i++) {
  if (inputs[i].getAttribute('id') === 'membershipNumber') {
    inputs[i].onkeypress = null
  }
}

//-------------------------------------------------------------------------------------------------------------------
