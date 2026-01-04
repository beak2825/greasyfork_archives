// ==UserScript==
// @name         Aktuality.sk skip 'Pokračovať na článok'
// @namespace    https://www.aktuality.sk/
// @version      0.1
// @description  Automaticky načíta zvyšok článku
// @author       Slada
// @match        https://www.aktuality.sk/clanok/*
// @icon         https://www.google.com/s2/favicons?domain=aktuality.sk
// @grant        none
// @license MIT
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/435746/Aktualitysk%20skip%20%27Pokra%C4%8Dova%C5%A5%20na%20%C4%8Dl%C3%A1nok%27.user.js
// @updateURL https://update.greasyfork.org/scripts/435746/Aktualitysk%20skip%20%27Pokra%C4%8Dova%C5%A5%20na%20%C4%8Dl%C3%A1nok%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>$( "span.text:contains('Pokračovať na článok')").click(), 1000)
})();