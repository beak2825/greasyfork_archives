// ==UserScript==
// @name         Jira auto-fill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Shuunen
// @match        https://extranet.systeme-u.fr/jira/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36334/Jira%20auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/36334/Jira%20auto-fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.getElementById('login-form-username')){

        console.log('jira fill start');

        setTimeout(function(){ document.getElementById('login-form-username').value='FILL_YOUR_USER'; } , 300);

        setTimeout(function(){ document.getElementById('login-form-password').value='FILL_YOUR_PASS'; } , 600);

        setTimeout(function(){ document.getElementById('login-form-remember-me').checked = true; } , 900);

        setTimeout(function(){ document.getElementById('login').click(); } , 1200);

    }

})();