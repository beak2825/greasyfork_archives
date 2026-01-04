// ==UserScript==
// @name         eBonus.gg [Captcha Skip]
// @version      1.0
// @description  Resolve o captcha automaticamente em alguns segundos.
// @author       YTGustavinho
// @match	 ebonus.gg google.com
// @include      *
// @grant        none
// @namespace https://greasyfork.org/users/200015
// @downloadURL https://update.greasyfork.org/scripts/376478/eBonusgg%20%5BCaptcha%20Skip%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/376478/eBonusgg%20%5BCaptcha%20Skip%5D.meta.js
// ==/UserScript==

var domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
if (domain.indexOf('miped.ru') == -1 && domain.indexOf('indiegala') == -1 && domain.indexOf('gleam.io') == -1) { //You can exclude domains here (advanced)
    if (location.href.indexOf('google.com/recaptcha') > -1) {
        var clickCheck = setInterval(function() {
            if (document.querySelectorAll('.recaptcha-checkbox-checkmark').length > 0) {
                clearInterval(clickCheck);
                document.querySelector('.recaptcha-checkbox-checkmark').click();
            }
        }, 5000);
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
}