// ==UserScript==
// @name         Anti-anti Addblock RA
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://rencontre-ados.net/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/35232/Anti-anti%20Addblock%20RA.user.js
// @updateURL https://update.greasyfork.org/scripts/35232/Anti-anti%20Addblock%20RA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('*').filter(function() {
    return $(this).css('z-index') == 9990;
}).each(function() {
   this.style.display = 'none';
});
})();