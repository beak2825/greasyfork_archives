// ==UserScript==
// @namespace    WARFACE AUTO LOG-IN
// @name         WARFACE AUTO LOG-IN
// @version      0.2
// @description  Automatically signs you in to your warface account.
// @author       WFT
// @match        https://wf.my.com/en*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372469/WARFACE%20AUTO%20LOG-IN.user.js
// @updateURL https://update.greasyfork.org/scripts/372469/WARFACE%20AUTO%20LOG-IN.meta.js
// ==/UserScript==

var EMAIL="EMAIL";
var PASS="PASSWORD";

window.addEventListener('load', function() {
    if ($("[class='item js-show-login']").text() == "Log In") {
        if (EMAIL != "EMAIL" && PASS != "PASSWORD") {
            $('.js-form').hide();
            $('.js-reg-wrap, .js-form-login').show();
            $("[id='email']").val(EMAIL);
            $("[id='password']").val(PASS);
            $("[class='mcBtn']").click();
        } else {
            alert("TamperMonkey script is active, it seems like you have forgotten to input EMAIL/PASSWORD for automatic logins.")
        }
    }
}, false);