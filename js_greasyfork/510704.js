// ==UserScript==
// @name         [New] Bitcotasks PTC by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      1.1.1
// @description  Open and close the PTC
// @author       Andrewblood
// @match        *://*.bitcotasks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcotasks.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @grant        window.close
// @grant        unsafeWindow
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/510704/%5BNew%5D%20Bitcotasks%20PTC%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/510704/%5BNew%5D%20Bitcotasks%20PTC%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function specialClick(selector) {
        var interval001 = setInterval(function() {
            // Wähle den Button anhand des Selektors
            var button = document.querySelector(selector);
            // Wähle das CAPTCHA-Element und das Response-Element
            var captchaElement = document.querySelector(".captcha-modal, .g-recaptcha, .h-captcha");
            var captchaResponse = document.querySelector("#g-recaptcha-response, #g-recaptcha-response, #fform > center > div > div > input[type=hidden]");

            // Überprüfe, ob das CAPTCHA-Element vorhanden ist
            if (captchaElement) {
                // Falls das CAPTCHA ausgefüllt ist und der Button sichtbar und aktiv ist, klicke den Button
                if (captchaResponse && captchaResponse.value.length > 0 && button && button.offsetHeight > 0 && !button.hasAttribute('disabled')) {
                    button.click();
                    console.log("Element is clicked.");
                    clearInterval(interval001);
                }
            } else {
                // Falls kein CAPTCHA vorhanden ist, überprüfe nur die Sichtbarkeit des Buttons
                if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled')) {
                    button.click();
                    console.log("Element is clicked.");
                    clearInterval(interval001);
                }
            }
        }, 500);
    }

    // Überprüfen, ob der Titel der Seite 'Just a Moment' in verschiedenen Sprachen ist
    var titles = [
        'Just a moment', // Englisch
        '稍等片刻', // Chinesisch
        'Een ogenblik', // Holländisch
        'Un instant', // Französisch
        'Nur einen Moment', // Deutsch
        'Un momento', // Italienisch
        'Um momento', // Portugiesisch
        'Bir an', // Türkisch
    ];

    // Überprüfen, ob der Titel einen der Strings enthält
    if (titles.some(title => document.title.includes(title))) {
        console.log('Cloudflare-Challenger-Seite erkannt. Skript wird nicht ausgeführt.');

    } else {

        var checkForClaimLimit = ("#faucetContent > h3");
        var loadingSite = ("#main-content > div > h3");

        // ReCaptcha Firewall
        if (window.location.href.includes("firewall")){
            specialClick(".btn.btn-primary.btn-block");
        }

        // Ads Overlay
        if (window.location.href.includes("offerwall")){
            GM_setValue('adActive', false);

            setInterval(function() {
                if (GM_getValue('adActive') === false && document.querySelector(".card.mb-3.mt-1.campaign-block:not(.clicked)")) {
                    specialClick(".card.mb-3.mt-1.campaign-block:not(.clicked)");
                    GM_setValue('adActive', true);
                } else if (GM_getValue('adActive') === false && !document.querySelector(".card.mb-3.mt-1.campaign-block:not(.clicked)")){
                    window.close();
                    console.log("Wait for next Ad.");
                }
            }, 3000);

            // Faucet
            specialClick(".btn.btn-lg.btn-primary");
        }

        // PTC ansehem
        if (window.location.href.includes("/lead/")){

            // not aviable ad schliessen
            if (window.location.href.includes("not_available")){
                GM_setValue('adActive', false);
                window.close();
            }

            var oldFunction = unsafeWindow.open;
            var lastOpenedWindow = null;

            function newFunction(url, target) {
                var windowName = (target && target !== "_blank") ? target : "popUpWindow";
                lastOpenedWindow = oldFunction(url, windowName);
                return lastOpenedWindow;
            }
            unsafeWindow.open = newFunction;

            // Open view Ad in new window
            specialClick(".btn-primary.btn");

            setInterval(function() {
                if (document.querySelector("#status > div") && document.querySelector("#status > div").innerText.includes("SUCCESS")){
                    GM_setValue('adActive', false);
                    lastOpenedWindow.close();
                    lastOpenedWindow = null;
                    window.close();
                }
            }, 100);

            let interval1 = setInterval(function() {
                if (document.title.includes('Claim Reward!')){
                    window.focus();
                    clearInterval(interval1);
                }
            }, 1000);

        }
    }
})();