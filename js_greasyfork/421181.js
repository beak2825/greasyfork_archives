// ==UserScript==
// @name         Dispensar nobre em massa
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Só usar bb
// @author       HassaN
// @include      https://**.tribalwars.*/game.php?**&screen=train&mode=mass_decommission*
// @icon         https://img.icons8.com/ios/452/h.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421181/Dispensar%20nobre%20em%20massa.user.js
// @updateURL https://update.greasyfork.org/scripts/421181/Dispensar%20nobre%20em%20massa.meta.js
// ==/UserScript==
//Dispensandonobres

setTimeout(function(){
$('input#unit_input_snob.unit_input_field').val("2")

setTimeout(function(){
$('[value="Inserir tropas"]')[0].click()

setTimeout(function(){
$('[value="Dispensar"]')[0].click()

setTimeout(function(){
$('[class="btn evt-confirm-btn btn-confirm-yes"]').click()},5000);

},5000);

},5000);

},300000);