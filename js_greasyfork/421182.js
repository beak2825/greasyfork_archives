// ==UserScript==
// @name         Recrutamento de Nobre em massa
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  So usar bb
// @author       HassaN
// @include      https://*/game.php?*screen=train&mode=mass*
// @icon         https://img.icons8.com/ios/452/h.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421182/Recrutamento%20de%20Nobre%20em%20massa.user.js
// @updateURL https://update.greasyfork.org/scripts/421182/Recrutamento%20de%20Nobre%20em%20massa.meta.js
// ==/UserScript==
setTimeout(function(){
$('input#unit_input_snob.unit_input_field').val("1")

setTimeout(function(){
$('[value="Inserir tropas"]')[0].click()


setTimeout(function(){
$('[class="btn btn-recruit"]')[0].click()},5000);

    },5000);

},600000);
