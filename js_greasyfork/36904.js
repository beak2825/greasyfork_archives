// ==UserScript==
// @name         eBonus.gg [Captcha Skip] Pro
// @namespace    http://www.mediafire.com/file/u55hupzyiy14ye8/Captcha%20Ebonus.user.js
// @version      1.0.0
// @description  This automatically clicks on any recaptcha on the webpage and submits it directly after you solved it
// @author       Minh Hieu Nguyen
// @match	 http://eBonus.gg
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36904/eBonusgg%20%5BCaptcha%20Skip%5D%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/36904/eBonusgg%20%5BCaptcha%20Skip%5D%20Pro.meta.js
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