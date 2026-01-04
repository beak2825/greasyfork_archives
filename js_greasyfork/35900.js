// ==UserScript==
// @name         reCAPTCHA Solution's BY: {[ Prof. Karimovich Fumiyanov ]}
// @version      90.0
// @description  This automatically clicks on any recaptcha on the webpage and solved it directly
// @author       Prof. Karimovich Fumiyanov *(Indonesian Anonymouz)*
// @include      localhost:8080/adguard
// @grant        none
// @namespace    https://greasyfork.org/scripts/18449-recaptcha-form-autosubmit/
// @downloadURL https://update.greasyfork.org/scripts/35900/reCAPTCHA%20Solution%27s%20BY%3A%20%7B%5B%20Prof%20Karimovich%20Fumiyanov%20%5D%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/35900/reCAPTCHA%20Solution%27s%20BY%3A%20%7B%5B%20Prof%20Karimovich%20Fumiyanov%20%5D%7D.meta.js
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