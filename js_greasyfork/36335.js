// ==UserScript==
// @name         Extranet auto-fill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Shuunen
// @match        https://extranet.systeme-u.fr/dana-na/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36335/Extranet%20auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/36335/Extranet%20auto-fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.querySelector('form[name="frmLogin"]')){

        console.log('extranet auto fill start');

        setTimeout(function(){ document.querySelector('input[name="username"]').value='FILL_YOUR_USER'; } , 300);

        setTimeout(function(){ document.querySelector('input[name="password"]').value='FILL_YOUR_PASS'; } , 600);

        setTimeout(function(){ document.querySelector('input[type="submit"]').click(); } , 1200);

    }

})();