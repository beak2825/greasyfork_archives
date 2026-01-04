// ==UserScript==
// @name uhdmovies - Auto Bypass Timer and Click Start Verification
// @namespace http://tampermonkey.net/
// @author       Hasan-Abbas
// @version 0.1
// @description Automatically click "Start Verification" after the 10-second timer finishes or button appears
// @match https://*.unblockedgames.*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/525828/uhdmovies%20-%20Auto%20Bypass%20Timer%20and%20Click%20Start%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/525828/uhdmovies%20-%20Auto%20Bypass%20Timer%20and%20Click%20Start%20Verification.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function clickStartVerificationButton() {
        let startVerificationButton = document.querySelector('a[onclick="document.getElementById(\'landing\').submit();"]');
        if (startVerificationButton) {
            startVerificationButton.click();
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const startVerificationButton = document.querySelector('a[onclick="document.getElementById(\'landing\').submit();"]');
                if (startVerificationButton) {
                    clickStartVerificationButton();
                    observer.disconnect();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(clickStartVerificationButton, 100);
})();


// ==UserScript==
// @name         Auto Bypass Timer and Click Buttons (For 3rd URL - tech.unblockedgames.world)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates clicking buttons and handling delays between each step for 3rd URL
// @match        https://tech.unblockedgames.world/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function clickVerifyButton() {
        let verifyButton = document.getElementById('verify_button2');
        if (verifyButton) {
            verifyButton.click();
        }
    }

    function clickContinueButton() {
        let continueButton = document.getElementById('verify_button');
        if (continueButton) {
            continueButton.click();
        }
    }

    function scrollToDownloadButton() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    function clickDownloadButton() {
        let downloadButton = document.getElementById('two_steps_btn');
        if (downloadButton) {
            downloadButton.click();
        }
    }

    setTimeout(() => {
        clickVerifyButton();
    }, 20);


    setTimeout(() => {
    }, 7);


    setTimeout(() => {
        clickContinueButton();
    }, 10);


    setTimeout(() => {
        scrollToDownloadButton();
    }, 20);


    setTimeout(() => {
        clickDownloadButton();
    }, 4000);
})();
