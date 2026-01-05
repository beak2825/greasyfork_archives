// ==UserScript==
// @name         Yahoo Disposable Mail Limit Enablement
// @namespace    https://mail.yahoo.com/settings/security/disposable/limit
// @version      1.0
// @description  Yahoo enforces max 500 disposable addresses (somewhere in 3rd quarter 2016). Users who exceeded ths limit are only allowed to Remove addresses only. This script allows users to Edit their existing disposable addresses.
// @author       Tok Hock Guan
// @match        https://mg.mail.yahoo.com/neo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26251/Yahoo%20Disposable%20Mail%20Limit%20Enablement.user.js
// @updateURL https://update.greasyfork.org/scripts/26251/Yahoo%20Disposable%20Mail%20Limit%20Enablement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // dirty way to running script every 10 seconds
    var timerVar = setInterval(function() {doMeEveryInterval(); }, 10000);
})();


function doMeEveryInterval()
{
    if ((addAddr = document.getElementById("options-add-addr")) !== null) {
        //alert(addAddr);
        addAddr.removeAttribute("disabled");
    }
    if ((editAddr = document.getElementById("options-edit-addr")) !== null) {
        //alert(editAddr);
        editAddr.removeAttribute("disabled");
    }
}