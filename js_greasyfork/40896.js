// ==UserScript==
// @name         eBonus.gg akai2u
// @namespace    akai2u
// @version      0.2
// @description  Automate tasks on eBonus.gg
// @author       combined from 2 uploader
// @include      *://ebonus.gg*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/40896/eBonusgg%20akai2u.user.js
// @updateURL https://update.greasyfork.org/scripts/40896/eBonusgg%20akai2u.meta.js
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
                    if (grecaptcha.getResponse().length > 1) {
                        clearInterval(solveCheck);
                        rc_form.submit();
                    }
                }, 100);
            }
        }
    }
}

setInterval(function() {
                  window.location.reload();
                }, 170000);

$(document).ready(function(){
    var coinsclicker = setInterval(function() {
        ClickNext();
        ClickOnBubble();
    }, 1000);

    window.ClickNext = function(){
        if ($(".coins_popup").length > 1) {
            console.log("clicked");
            $(".coins_popup").click();
        }
    };
    window.ClickOnBubble = function(){
        if ($(".sweet-alert.showSweetAlert.visible").length > 1) {
            console.log("clicked");
            $(".confirm").click();
        }
    };
});