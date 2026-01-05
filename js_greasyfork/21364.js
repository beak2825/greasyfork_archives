// ==UserScript==
// @name         Telep Orb
// @namespace    https://greasyfork.org/en/scripts/21364-telep-orb
// @version      0.2
// @description  Logo Change
// @author       Paulo Vitor
// @match        https://fatura.orbitsistemas.com.br/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21364/Telep%20Orb.user.js
// @updateURL https://update.greasyfork.org/scripts/21364/Telep%20Orb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("in orbit");
    $('img[src="/visao/imgs/logo/orb.fatura3.png"')
        .attr("src", "http://www.telep.com.br/assets/images/logo_branco.png")
        .attr("style", "float:left")
        .after('<h1 style="font-size: 1.5em;float:right;line-height: 32px;padding-left:10px;font-family: &quot;Montserrat&quot;,sans-serif;margin: 3px 0;font-weight: 500;">TELE<b>P</b></h1>');
})();