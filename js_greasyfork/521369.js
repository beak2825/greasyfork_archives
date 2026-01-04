// ==UserScript==
// @name         Captha Solver
// @namespace    https://tampermonkey.net/
// @version      1.25
// @description  Automatically click hCaptcha checkbox
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521369/Captha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/521369/Captha%20Solver.meta.js
// ==/UserScript==

(function() {
    var CHECKBOX = "#checkbox";
    var ARIA_CHECKED = "aria-checked";
    var captchaDetected = false; // Flag to track if "Ada Chapta" has been sent


    function qSelector(selector) {
        return document.querySelector(selector);
    }

    function isHidden(el) {
        return (el.offsetParent === null);
    }

    if (window.location.href.includes("checkbox")) {
        var checkboxInterval = setInterval(function() {
            if (!qSelector(CHECKBOX)) {
                // If checkbox is not found, do nothing
            } else if (qSelector(CHECKBOX).getAttribute(ARIA_CHECKED) == "true") {
                clearInterval(checkboxInterval);  // Stop checking if already checked
            } else if (!isHidden(qSelector(CHECKBOX)) && qSelector(CHECKBOX).getAttribute(ARIA_CHECKED) == "false") {
                if (!captchaDetected) {
                    // Send "Ada Chapta" message only once
                    console.log("Ada Chapta");
                    captchaDetected = true; // Set flag to true to prevent repeated messages
                }

                // Introduce a random delay before clicking the checkbox
                setTimeout(function() {
                    qSelector(CHECKBOX).click();
                    console.log("Chapta solved");
                    location.reload();
                }, Math.floor(Math.random() * 75000) + 15000);  // Fixed the syntax here
            } else {
                return;
            }

        }, 3000);
    }

})();
