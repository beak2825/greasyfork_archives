// ==UserScript==
// @name         TASeeeeeeee
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Lazy man's time is more expensive!
// @author       Novosync
// @match        https://tas.vghtpe.gov.tw/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370910/TASeeeeeeee.user.js
// @updateURL https://update.greasyfork.org/scripts/370910/TASeeeeeeee.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i;
    var a=4;
    for(i=0;i<9;i++) {
        $('input[type="radio"]')[a].checked=true;
        a+=5;
    };
    document.getElementsByClassName("form-control")[0].value='9';
})();