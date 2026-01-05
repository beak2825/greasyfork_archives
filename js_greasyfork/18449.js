// ==UserScript==
// @name         reCAPTCHA Helper
// @icon         https://www.gstatic.com/recaptcha/admin/favicon.ico
// @version      1.1.4
// @description  This automatically clicks or executes on any reCAPTCHA on the webpage and submits its form directly after you solved it.
// @author       Royalgamer06
// @include      *
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/scripts/18449-recaptcha-form-autosubmit/
// @homepageURL  https://greasyfork.org/scripts/18449-recaptcha-form-autosubmit/
// @supportURL   https://greasyfork.org/scripts/18449-recaptcha-form-autosubmit/feedback/
// @downloadURL https://update.greasyfork.org/scripts/18449/reCAPTCHA%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/18449/reCAPTCHA%20Helper.meta.js
// ==/UserScript==

// ==Configuration==
const blacklistedUrls = [
    "miped.ru",
    "www.indiegala",
    "https://gleam.io/"
];
// ==/Configuration==

// ==Code==
const url = window.location !== window.parent.location ? document.referrer : document.location.href;
if (isNotBlackListed(url)) {
    if (location.href.includes("google.com/recaptcha")) {
        var clickCheck = setInterval(function() {
            if (document.querySelectorAll(".recaptcha-checkbox-checkmark").length > 0) {
                clearInterval(clickCheck);
                document.querySelector(".recaptcha-checkbox-checkmark").click();
            }
        }, 50);
    } else {
        window.onload = readyToHelp;
    }
}

function readyToHelp() {
    var execCheck = setInterval(function() {
        if (window.grecaptcha && window.grecaptcha.execute) {
            clearInterval(execCheck);
            try { window.grecaptcha.execute(); } catch(e) {}
        }
    }, 50);
    [...document.forms].forEach(form => {
        if (form.innerHTML.includes("google.com/recaptcha")) {
            var solveCheck = setInterval(function() {
                if (window.grecaptcha && !!grecaptcha.getResponse()) {
                    clearInterval(solveCheck);
                    form.submit();
                }
            }, 50);
        }
    });
}

function isNotBlackListed(url) {
    return blacklistedUrls.every(bu => !url.includes(bu));
}
// ==/Code==