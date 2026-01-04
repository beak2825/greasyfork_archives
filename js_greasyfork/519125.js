// ==UserScript==
// @name         [Premium] H-Captcha Solver by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      1.0.3
// @description  Use the 2Captcha service to successfully complete the H-Captcha
// @author       Andrewblood
// @match        *://*/*
// @exclude      *challenges.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinfinity.top
// @noframes
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/519125/%5BPremium%5D%20H-Captcha%20Solver%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/519125/%5BPremium%5D%20H-Captcha%20Solver%20by%20Andrewblood.meta.js
// ==/UserScript==
/*

!!! You need balance on https://2captcha.com/?from=19960724 and the price is 2,99$ for 1000 h-captchas !!!

1) Please open a new Account at https://2captcha.com/?from=19960724
2) Deposit your choosen amounnt of money. (I have 10$ every 3 months)
3) Insert your API key from the Dashboard at the beginning of this script source/code.
4) If one site I don't have added the sitekey you can write a comment or add it under "sitekeys" manualy

You can find the sitekey of your domain when you press F12 in chrome browser for console and then press CRTL+F for searching elements.
Then you must only type/search for "site_key" or "sitekey" and look that it stand hcaptcha before the sitekey. (extract only the key)

*/
(function() {
    'use strict';

    // Number of questions to 2Captcha when the captcha is solved
    var maxAttempts = 60;

    // Wait time in milliseconds between questions
    var delay = 2000;

    // Your API Key from 2captcha.com (balance is needed)
    var apiKey = 'YOUR_API_KEY_HERE';

    var sitekeys = {
        'autofaucet.dutchycorp.space': '277d934d-3bdc-49bd-90bb-a73f9e0eef0d',
        "dutchycorp.space/shp2": "dcce507b-3d06-4cf7-a1b4-35d6b7fa4cd0",
        'dutchycorp.ovh': 'dcce507b-3d06-4cf7-a1b4-35d6b7fa4cd0',
        'playonpc.online': '215ae94b-b7f2-4cc6-9af0-ee259eca5ad1',
        "quins.us": "215ae94b-b7f2-4cc6-9af0-ee259eca5ad1",
        "gally.shop": "215ae94b-b7f2-4cc6-9af0-ee259eca5ad1",
        'wordcounter.icu': 'fbd3c1c5-bfa3-4f8f-a70f-cb612e3bb044',
        'adshnk.com': '7dee8357-7cd2-41d7-8b48-158f96365173',
        // "surflink.tech": "9ed65efe-ab27-4439-8d4a-edb52e6c796b",
        "shortit.pw": "da32ea56-c2ae-4b42-aa52-31fcfe240408",
        "dekhe.click": "2f9e938c-2526-45eb-8361-6b9a47caf978",
    };

    var titles = [
        'Just a moment', // Englisch
        '稍等片刻', // Chinesisch
        'Een ogenblik', // Holländisch
        'Un instant', // Französisch
        'Nur einen Moment', // Deutsch
        'Un momento', // Italienisch
        'Um momento', // Portugiesisch
        'Bir an', // Türkisch
        "Fly"
    ];
    if (titles.some(title => document.title.includes(title))) {
        console.log('Cloudflare Challenger page recognised. H-Captcha Solver Script is not executed.');
    } else if (apiKey == "YOUR_API_KEY_HERE") {
        console.log('Please enter a valid API key in the H-Captcha Solver Script.');
    } else {

        createTextElement();

        showMessage("H-Captcha Solver by Andrewblood is turned on and no captcha was found on this page.", "blue");

        const interval001 = setInterval(() => {
            const captchaElement = document.querySelector('#captchaShortlink, .h-captcha, .g-recaptcha-antibot');
            const captchaResponse = document.querySelector('[name="h-captcha-response"]');

            if (captchaElement) {
                clearInterval(interval001);
                showMessage('H-Captcha detected and look in script for a saved sitekey!', "green");

                // Aktuelle URL abrufen
                const currentURL = window.location.href;

                // Funktion, um den Sitekey basierend auf der URL zu finden
                const findSiteKey = () => {
                    for (const urlPart in sitekeys) {
                        if (currentURL.includes(urlPart)) {
                            return sitekeys[urlPart];
                        }
                    }
                    return null;
                };

                const sitekey = findSiteKey();

                if (sitekey) {
                    showMessage('H-Captcha and Sitekey found: Starting the resolving process.', "green");
                    getCaptchaResponse(sitekey)
                        .then(response => {
                        if (response && response.token) {
                            const captchaResponse = document.querySelector('[name="h-captcha-response"]');
                            if (captchaResponse) {
                                captchaResponse.value = response.token;
                                showMessage('Captcha successfully solved!', "green");
                                const invisibleButton = document.querySelector("#invisibleCaptchaShortlink");
                                if (invisibleButton) invisibleButton.removeAttribute("disabled");
                            } else {
                                showMessage('Captcha response element not found in the DOM.', "red");
                            }
                        } else {
                            showMessage('Failed to solve captcha', "red");
                            window.location.reload();
                        }
                    })
                        .catch(err =>console.log('Error fetching captcha response:', err));
                } else {
                    showMessage('Sitekey from this page is not saved in the script.', "red");
                }
            }
        }, 500);

        var textElement;
        function createTextElement() {
            textElement = document.createElement("div");
            textElement.style.position = "fixed";
            textElement.style.bottom = "0";
            textElement.style.left = "50%";
            textElement.style.transform = "translateX(-50%)";
            textElement.style.color = "blue";
            textElement.style.fontSize = "12px";
            textElement.style.zIndex = "9999";
            textElement.style.fontFamily = "Arial, sans-serif";
            textElement.style.textAlign = "center";
            textElement.style.display = "none";
            textElement.style.cursor = "pointer";

            textElement.addEventListener("click", function () {
                window.open("https://2captcha.com/?from=19960724", "_blank");
            });

            document.body.appendChild(textElement);
        }

        function showMessage(newText, color) {
            if (!textElement) {
                createTextElement();
            }
            textElement.innerText = newText;
            textElement.style.color = color;
            textElement.style.display = "block";
        };

        async function getCaptchaResponse(sitekey) {
            const requestUrl = `https://2captcha.com/in.php?key=${apiKey}&method=hcaptcha&sitekey=${sitekey}&pageurl=${window.location.href}`;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: requestUrl,
                    onload: function(response) {
                        if (response.responseText.startsWith('OK|')) {
                            const captchaId = response.responseText.split('|')[1];
                            // print('Captcha ID:', captchaId);
                            pollCaptchaSolution(apiKey, captchaId).then(resolve).catch(reject);
                        } else {
                            console.log('Error sending captcha request:', response.responseText);
                            reject(response.responseText);
                        }
                    },
                    onerror: function(err) {
                        console.log('Error in GM_xmlhttpRequest:', err);
                        reject(err);
                    }
                });
            });
        }

        async function pollCaptchaSolution(apiKey, captchaId) {
            const resultUrl = `https://2captcha.com/res.php?key=${apiKey}&action=get&id=${captchaId}`;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                await new Promise(resolve => setTimeout(resolve, delay));

                // Verwende GM_xmlhttpRequest anstelle von fetch
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: resultUrl,
                        onload: function(response) {
                            resolve(response.responseText);
                        },
                        onerror: function(err) {
                            console.log('Error in GM_xmlhttpRequest:', err);
                            reject(err);
                        }
                    });
                });

                if (response === 'CAPCHA_NOT_READY') {
                    showMessage('The captcha has been sent to 2Captcha and we are now waiting for the completed captcha as a response.', "green");
                    continue;
                }

                if (response.startsWith('OK|')) {
                    return { token: response.split('|')[1] };
                }

                console.log('Error fetching captcha solution:', response);
                return null;
            }

            showMessage('Captcha solution timed out', "red");
            return null;
        }
    }
})();
