// ==UserScript==
// @name         EarnMatic
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  collect faucet
// @author       White
// @match        https://earnmatic.softpog.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=softpog.com.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477882/EarnMatic.user.js
// @updateURL https://update.greasyfork.org/scripts/477882/EarnMatic.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const email = "";
    let pageLoadTime = Date.now();

    async function fillEmail() {
        var mtElement = document.getElementById('mt');
        if (mtElement && isElementInViewport(mtElement)) {
            setTimeout(function() {
                mtElement.value = email;
            }, 3000);
        } else {
            setTimeout(fillEmail, 1000);
        }
    }

    function isElementInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    let buttonClicked = false;

    function checkAndClickButton() {
        const turnstileResponseInput = document.querySelector('input[name="cf-turnstile-response"]');

        if (turnstileResponseInput && turnstileResponseInput.value.trim() !== '') {
            setTimeout(() => {
                if (!buttonClicked) {
                    const button = document.getElementById('sv');
                    if (button) {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });

                        button.dispatchEvent(clickEvent);
                        buttonClicked = true;
                    }
                }
            }, 5000);
        }
    }

    function okbutton() {
        const buttons = document.querySelectorAll('button.swal2-confirm.swal2-styled');

        if (buttons.length > 0) {
            setTimeout(() => {
                buttons[0].click();
            }, 5000);
        }
    }

    function reloadPageIfNecessary() {
        const currentTime = Date.now();
        if (currentTime - pageLoadTime >= 240000) {
            location.reload();
        }
    }

    window.addEventListener('load', function() {
        fillEmail();
        setInterval(checkAndClickButton, 2000);
        okbutton();
        setInterval(reloadPageIfNecessary, 60000);
    });
})();
