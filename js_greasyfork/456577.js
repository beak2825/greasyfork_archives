// ==UserScript==
// @name         Contraseña TPs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456577/Contrase%C3%B1a%20TPs.user.js
// @updateURL https://update.greasyfork.org/scripts/456577/Contrase%C3%B1a%20TPs.meta.js
// ==/UserScript==

$(document).ready(function(){
    var val_input = $('#pc-login-password.tpInput')

    if (typeof val_input !== 'undefined') {
        val_input.val('Tecnico2018')
    }
});

waitForKeyElements (".T_adv.text", function(e) {
    $(".T_adv.text").click()
});