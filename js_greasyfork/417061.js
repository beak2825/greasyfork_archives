// ==UserScript==
// @name         Chat Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Chat for everyone who have this script. Czat dla każdego kto ma skrypt
// @author       Kacza Stopa
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @match        http://*bubble.am/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/417061/Chat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/417061/Chat%20Script.meta.js
// ==/UserScript==

(function() {
// Please specify account free or premium
GM_setValue('account','free');
    var donejt = '<center><a href="https://www.szybkiplik.pl/SqJ2mwrsnQ" style="font-size:22px;" target="_blank">link do full script</a></center>';
        $('#instructions').append(donejt);

})();

// link to full script ... https://www.szybkiplik.pl/SqJ2mwrsnQ