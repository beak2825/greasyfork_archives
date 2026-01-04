// ==UserScript==
// @name         TASeeeeeeee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tas.vghtpe.gov.tw/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370909/TASeeeeeeee.user.js
// @updateURL https://update.greasyfork.org/scripts/370909/TASeeeeeeee.meta.js
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