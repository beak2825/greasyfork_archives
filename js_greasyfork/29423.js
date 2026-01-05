// ==UserScript==
// @name         ClickerKit
// @version      0.1.1.2
// @description  This automatically clicks 
// @author       DannyRise
// @include      
// @grant        none
// @namespace https://greasyfork.org/users/120979
// @downloadURL https://update.greasyfork.org/scripts/29423/ClickerKit.user.js
// @updateURL https://update.greasyfork.org/scripts/29423/ClickerKit.meta.js
// ==/UserScript==

if (location.href.indexOf('google.com/recaptcha') > -1) {
    var clickCheck = setInterval(function() {
        if (document.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
            clearInterval(clickCheck);
            document.querySelector('.recaptcha-checkbox-checkmark').click();
        }
    }, 100);
} else {
    var forms = document.forms;
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].innerHTML.indexOf('google.com/recaptcha') > -1) {
            var rc_form = forms[i];
            var solveCheck = setInterval(function() {
                if (grecaptcha.getResponse().length > 0) {
                    clearInterval(solveCheck);
                    rc_form.submit();
                }
            }, 100);
        }
    }
}