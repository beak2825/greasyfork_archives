// ==UserScript==
// @name         Userscript Everywhere
// @namespace    https://greasyfork.org/users/28298
// @version      0.6
// @description  Some user scripts for every website! (Personal Use)
// @author       Jerry
// @include      *
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @noframes
// @license      GNU GPLv3
// @require      https://greasyfork.org/scripts/456410-gmlibrary/code/GMLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/456829/Userscript%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/456829/Userscript%20Everywhere.meta.js
// ==/UserScript==

function TogglePassword() {
    var passFields = document.querySelectorAll("input[type='password']");
    if (!passFields.length) return;
    for (var i = 0; i < passFields.length; i++) {
        passFields[i].addEventListener("mouseover", function() {
            this.type = "text";
        }, false);
        passFields[i].addEventListener("mouseout", function() {
            this.type = "password";
        }, false);
    }
}

(function () {
    "use strict";
    setTimeout(function () {
        TogglePassword();
    }, 1500);

})();
