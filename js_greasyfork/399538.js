// ==UserScript==
// @name         Microsoft Math Copy Enabler
// @namespace    http://mathsolver.microsoft.com/
// @version      1.0
// @description  Enables Copying of Latex Equations in Microsoft Math Website upon clicking Enable Copy menu item from Tampermonkey Extension.
// @author       Debanjan Dhar
// @match        http*://mathsolver.microsoft.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/399538/Microsoft%20Math%20Copy%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/399538/Microsoft%20Math%20Copy%20Enabler.meta.js
// ==/UserScript==
var copyEnabled;
var enableButton;
var disableButton;
(function() {
    'use strict';
    copyEnabled = false;
    menuHandler();
    // Your code here...
})();
function menuHandler() {
    if(copyEnabled) {
        GM_unregisterMenuCommand(enableButton);
        disableButton = GM_registerMenuCommand("Disable Copy", disable);
    }
    else {
        GM_unregisterMenuCommand(disableButton);
        enableButton = GM_registerMenuCommand("Enable Copy", enable);
    }
}
function enable() {
    $("head").append('<span id="copyPaste"><link href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/copy-tex.css" rel="stylesheet" type="text/css"><script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/copy-tex.min.js" integrity="sha384-XhWAe6BtVcvEdS3FFKT7Mcft4HJjPqMQvi5V4YhzH9Qxw497jC13TupOEvjoIPy7" crossorigin="anonymous"></script></span>');
    copyEnabled = true;
    menuHandler();
}
function disable() {
    $( "#copyPaste" ).remove();
    copyEnabled = false;
    menuHandler();
}