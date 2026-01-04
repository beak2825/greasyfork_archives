// ==UserScript==
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @name         Tarjeta Roja (bro.adca.st)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://bro.adca.st/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35733/Tarjeta%20Roja%20%28broadcast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35733/Tarjeta%20Roja%20%28broadcast%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        $('#propis').remove();
        $('#punga').remove();
        $('.pibe').remove();
        $('body .container div').remove();
        $('body .container style').remove();
        $('#roviralta').remove();
    }, 1);
    // Your code here...
})();
