// ==UserScript==
// @name         Faucets Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       White
// @match        https://qashbits.com/*
// @match        https://claimbits.net/*
// @match        https://claimlite.club/*
// @match        https://coinadster.com/*
// @match        https://earnbits.io/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476013/Faucets%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/476013/Faucets%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var currentLinkIndex = 0;

    if (window.location.href == 'https://qashbits.com/') {
        window.addEventListener('load', function () {
            setTimeout(function () {
                window.location.href = 'https://coinadster.com/faucet.html';
            }, 180000);
let buttonClicked = false;


function clickButton() {
    if (!buttonClicked) {
        document.getElementById('claimButton').click();
        buttonClicked = true;
    }
}

function redirectToPage() {
    setTimeout(function () {
        window.location.href = 'https://coinadster.com/faucet.html';
    }, 5000);
}

function checkInputAndClickButton() {
    const adcopyInput = document.querySelector('input[name="adcopy_response"]');
    if (adcopyInput && adcopyInput.value.trim() !== '') {
        clickButton();
        redirectToPage();
    }
}
//setInterval(checkInputAndClickButton, 3000); //apague os // antes de setinterval se possuir solver para solvemedia apenas
            var waitForRecaptcha = setInterval(function () {
                if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                    clearInterval(waitForRecaptcha);

                    var loginButton = document.querySelector('button[id="claimButton"]');
                    if (loginButton) {
                        setTimeout(function () {
                            loginButton.click();
                            setTimeout(function () {
                                window.location.href = 'https://coinadster.com/faucet.html';
                            }, 5000);
                        }, 5000);
                    }
                }
            }, 1000);
        });
    }

if (window.location.href === 'https://coinadster.com/faucet.html') {
    window.addEventListener('load', function () {

        setTimeout(function () {
            window.location.href = 'https://claimbits.net/faucet.html';
        }, 180000);

var modalTriggered = false;

function handlePageUnload() {
    modalTriggered = false;
}

window.addEventListener('beforeunload', handlePageUnload);

setTimeout(function () {
    var button = document.querySelector('button[data-target="#modal22my"]');
    if (button && !modalTriggered) {
               button.click();
                  modalTriggered = true;
        button.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
}, 5000);

        var waitForRecaptcha = setInterval(function () {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                clearInterval(waitForRecaptcha);
                var customButton = document.querySelector('button[class="aa3322uu"]');
                if (customButton) {

                    setTimeout(function () {
                        customButton.click();

                        setTimeout(function () {
                            window.location.href = 'https://claimbits.net/faucet.html';
                        }, 5000);
                    }, 5000);
                }
            }
        }, 1000);
    });
}
    if (window.location.href == 'https://claimbits.net/faucet.html') {
        window.addEventListener('load', function () {
            setTimeout(function () {
                window.location.href = 'https://earnbits.io/';
            }, 180000);
             setTimeout(function () {

            var modalTrigger = document.querySelector('[data-target="#modal2my"]');
            if (modalTrigger) {
                modalTrigger.click();
            }
                 },3000);
                setTimeout(function () {
            var captchaToggle = document.querySelector('#toggleCaptcha');
            if (captchaToggle) {
                captchaToggle.click();
            }
           },3000);

            var recaptchaSelect = document.querySelector('select');
            if (recaptchaSelect) {
                var recaptchaOption = recaptchaSelect.querySelector('option[value="1"]');
                if (recaptchaOption) {
                    recaptchaOption.selected = true;
                    var event = new Event('change', {
                        bubbles: true,
                        cancelable: true,
                    });
                    recaptchaSelect.dispatchEvent(event);
                }
            }

            var waitForRecaptcha = setInterval(function () {
                if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                    clearInterval(waitForRecaptcha);
                    var rollButton = document.querySelector('button.zxz[onclick="starzRoll3();"]');
                    if (rollButton) {
                        setTimeout(function () {
                            rollButton.click();
                            setTimeout(function () {
                                window.location.href = 'https://earnbits.io/';
                            }, 5000);
                        }, 5000);
                    }
                }
            }, 1000);
        });
    }
if (window.location.href === 'https://earnbits.io/') {
    window.addEventListener('load', function () {
        setTimeout(function () {
            window.location.href = 'https://qashbits.com/';
        }, 180000);

        var waitForRecaptcha = setInterval(function () {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0) {
                clearInterval(waitForRecaptcha);
                var rollAndWinButton = document.querySelector('button.btn.btn-danger.btn-md.w-100.mt-2');
                if (rollAndWinButton) {
                    setTimeout(function () {
                        rollAndWinButton.click();
                        setTimeout(function () {
                            window.location.href = 'https://qashbits.com/';
                        }, 5000);
                    }, 5000);
                }
            }
        });
    });
}
})();
