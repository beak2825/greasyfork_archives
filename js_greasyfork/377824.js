// ==UserScript==
// @name         CAPTCHA SKIP BY ЦEZ4P6
// @namespace
// @version      0.1
// @description  Captcha Skip Pro By ЦEZ4P6
// @author       ЦEZ4P6
// @match	 https://m.vk.com/login
// @include      *
// @grant        none
// @namespace https://greasyfork.org/users/235804
// @downloadURL https://update.greasyfork.org/scripts/377824/CAPTCHA%20SKIP%20BY%20%D0%A6EZ4P6.user.js
// @updateURL https://update.greasyfork.org/scripts/377824/CAPTCHA%20SKIP%20BY%20%D0%A6EZ4P6.meta.js
// ==/UserScript==

var domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
if (domain.indexOf('miped.ru') == -1 && domain.indexOf('indiegala') == -1 && domain.indexOf('gleam.io') == -1) { //You can exclude domains here (advanced)
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
}