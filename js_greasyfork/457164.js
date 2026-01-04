// ==UserScript==
// @name         SuperNova
// @author       Saputra
// @version      1.1
// @description  Auto Open Captcha
// @match        https://*/recaptcha/*
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @grant        none
// @license      MIT 
// @namespace    SuperNova
// ==/UserScript==


// you can configure auto-open interval in HC_PAUSE or RC_PAUSE


function qSelector(selector) {
    return document.querySelector(selector);
}

function isHidden(el) {
    return (el.offsetParent === null)
}

(function() {
    'use strict';


    var domain = (window.location != window.parent.location) ? document.referrer.toString() : document.location.toString();
    // excluding domains
    if(
        domain.indexOf('example.com') == -1
        &&
        domain.indexOf('PartOfUrlName') == -1
        &&
        domain.indexOf('paypal.com') == -1
    ) {



        // HCAPTCHA SECTION
        const HC_PAUSE = "4000"; // ms to open ( 3000ms = 5sec )
        const HC_CHECK_BOX = "#checkbox";
        const HC_ARIA_CHECKED = "aria-checked";

        if (window.location.href.includes("checkbox")) {
            var hc_checkboxInterval = setInterval(function() {
                if (!qSelector(HC_CHECK_BOX)) {
                } else if (qSelector(HC_CHECK_BOX).getAttribute(HC_ARIA_CHECKED) == "true") {
                    clearInterval(hc_checkboxInterval);
                    console.log("HC SOLVED");
                } else if (!isHidden(qSelector(HC_CHECK_BOX)) && qSelector(HC_CHECK_BOX).getAttribute(HC_ARIA_CHECKED) == "false") {
                    qSelector(HC_CHECK_BOX).click();
                    clearInterval(hc_checkboxInterval);
                    console.log("HC OPEN BOX");
                } else {
                    return;
                }

            }, HC_PAUSE );
        }



        // RECAPTCHA SECTION
        const RC_PAUSE = "4000"; // ms to open ( 3000ms = 5sec )
        const CHECK_BOX = ".recaptcha-checkbox-border";
        const RECAPTCHA_STATUS = "#recaptcha-accessible-status";
        const DOSCAPTCHA = ".rc-doscaptcha-body";

        var rc_checkboxInterval = setTimeout(function() {

            var solved = false;
            var checkBoxClicked = false;
            var requestCount = 0;

            var recaptchaInitialStatus = qSelector(RECAPTCHA_STATUS) ? qSelector(RECAPTCHA_STATUS).innerText : ""
            function isHidden(el) {
                return(el.offsetParent === null)
            }
            try {
                if(!checkBoxClicked && qSelector(CHECK_BOX) && !isHidden(qSelector(CHECK_BOX))) {
                    qSelector(CHECK_BOX).click();
                    checkBoxClicked = true;
                    console.log("RC OPEN BOX");
                }
                //Check if the captcha is solved
                if(qSelector(RECAPTCHA_STATUS) && (qSelector(RECAPTCHA_STATUS).innerText != recaptchaInitialStatus)) {
                    solved = true;
                    console.log("RC SOLVED");
                }
                if(requestCount > 1) {
                    console.log("Attempted Max Retries. Stopping the solver");
                    solved = true;
                }
                //Stop solving when Automated queries message is shown
                if(qSelector(DOSCAPTCHA) && qSelector(DOSCAPTCHA).innerText.length > 0) {
                    console.log("Automated Queries Detected");
                }
            } catch(err) {
                console.log(err.message);
                console.log("An error occurred while solving. Stopping the solver.");
            }

        }, RC_PAUSE );
        
    }
    else {

        console.log( domain +" EXCLUDED!" );

    }


})();