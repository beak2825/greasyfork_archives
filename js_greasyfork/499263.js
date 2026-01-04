// ==UserScript==
// @name         Try to Bypass
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Inlinks, Bitss, Urlcut, Revcut, Chainfo, Gplinks, Yorurl, Just2earn Bypass + Shortsme e Shrinkme adicional
// @author       LTW
// @match        https://121989.xyz/*
// @match        https://131989.xyz/*
// @match        https://489651.xyz/*
// @match        https://845265.xyz/*
// @match        https://healthytip.eu/*
// @match        https://infotrends.co/*
// @match        https://docadvice.eu/*
// @match        https://earnbox.findgptprompts.com/*
// @match        https://travelkuku.com/*
// @match        https://financebolo.com/*
// @match        https://bitzite.com/*
// @match        https://quick91.com/*
// @match        https://loanteacher.in/*
// @match        https://impact24.us/*
// @match        https://carbikelo.com/*
// @match        https://article24.online/*
// @match        https://globalrecipes.us/*
// @match        https://horoscop.info/*
// @match        https://reintroducing.us/*
// @match        https://gameblog.in/*
// @match        https://eblog.pro/*
// @match        https://coingraph.us/*
// @license      none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=489651.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499263/Try%20to%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/499263/Try%20to%20Bypass.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const secondsThreshold = 35; // Tempo em segundos para iniciar clicks
    const processedUrls = new Set();

    const waitForCaptchaResponse = async () => {
        while (true) {
            const reCaptchaTextarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const hCaptchaTextarea = document.querySelector('textarea[name="h-captcha-response"]');

            if (reCaptchaTextarea?.value || hCaptchaTextarea?.value) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    };

    const processPage = async (urlPatterns, buttonConfigs, delay, useText) => {
        const currentUrl = window.location.href;
        const match = urlPatterns.some(pattern => currentUrl.includes(pattern));

        if (processedUrls.has(currentUrl)) {
            return;
        }

        if (match) {
            if (document.querySelector('textarea[name="g-recaptcha-response"]') || document.querySelector('textarea[name="h-captcha-response"]')) {
                await waitForCaptchaResponse();
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }

            if (useText) {
                buttonConfigs.forEach(({ selector, buttonTextRegex, buttonDelay }) => {
                    const stepInterval = setInterval(() => {
                        const steps = document.querySelectorAll(selector);
                        steps.forEach(step => {
                            if (step.textContent.trim().match(buttonTextRegex) && !step.classList.contains('processed')) {
                                step.classList.add('processed');
                                clearInterval(stepInterval);
                                setTimeout(() => {
                                    step.click();
                                }, buttonDelay * 1000);
                            }
                        });
                    }, 1000);
                });
            } else {
                buttonConfigs.forEach(({ selector, buttonDelay, followUpButton }) => {
                    setTimeout(() => {
                        const buttons = document.querySelectorAll(selector);
                        buttons.forEach(button => {
                            if (!button.disabled && !button.classList.contains('processed')) {
                                button.classList.add('processed');
                                button.click();
                            }
                        });

                        if (followUpButton) {
                            setTimeout(() => {
                                const followUps = document.querySelectorAll(followUpButton.selector);
                                followUps.forEach(followUp => {
                                    if (!followUp.disabled && !followUp.classList.contains('processed')) {
                                        followUp.classList.add('processed');
                                        followUp.click();
                                    }
                                });
                            }, buttonDelay * 1000);
                        }
                    }, buttonDelay * 1000);
                });
            }

            processedUrls.add(currentUrl);
        }
    };

    const siteConfigs = [
        { urlPatterns: ["https://bitzite.com/"], buttonConfigs: [{ selector: 'a', buttonTextRegex: /^Step \d\/\d$|^Click|^GOTO STEP|^FINAL STEP|^PROCEED/, buttonDelay: 1 }], delay: 15, useText: true },
        { urlPatterns: ["https://gameblog.in/", "https://globalrecipes.us/", "https://coingraph.us/", "https://docadvice.eu/", "https://eblog.pro/", "https://impact24.us/", "https://article24.online/", "https://horoscop.info/", "https://infotrends.co/", "https://reintroducing.us/", "https://bitzite.com/", "https://healthytip.eu/"], buttonConfigs: [{ selector: 'a', buttonTextRegex: /^Step \d\/\d$|^Click|^GOTO STEP|^FINAL STEP|^PROCEED TO STEP|^PROCEED TO FINAL STEP|^PROCEED TO LAST STEP|^PROCEED|^GET THE LINK/, buttonDelay: 1 }], delay: secondsThreshold, useText: true },
        { urlPatterns: ["https://845265.xyz/", "https://489651.xyz/", "https://121989.xyz/", "https://131989.xyz/"], buttonConfigs: [{ selector: 'button[type="submit"]', buttonDelay: 1 }], delay: 3, useText: false },
        { urlPatterns: ["https://carbikelo.com/"], buttonConfigs: [{ selector: 'a#NextBtn', buttonDelay: 1 }], delay: 15, useText: false },
        { urlPatterns: ["https://loanteacher.in/"], buttonConfigs: [{ selector: 'button[id="notarobot"]', buttonDelay: 2 },{ selector: 'button[id="getlink"]', buttonDelay: 2 },{ selector: 'a#btn7', buttonDelay: 3 }], delay: 1, useText: false },
        { urlPatterns: ["https://travelkuku.com/"], buttonConfigs: [{ selector: 'button[id="btn2"]', buttonDelay: 1 }], delay: 10, useText: false },
        { urlPatterns: ["https://financebolo.com/"], buttonConfigs: [{ selector: 'button[id="tp-snp2"]', buttonDelay: 1 }], delay: 3, useText: false },
        { urlPatterns: ["https://earnbox.findgptprompts.com/", "https://quick91.com/"], buttonConfigs: [{ selector: 'button[id="tp-snp2"]', buttonDelay: 2 },{ selector: 'a#btn7', buttonDelay: 18 }], delay: 1, useText: false },
    ];

    setInterval(() => {
        siteConfigs.forEach(config => processPage(config.urlPatterns, config.buttonConfigs, config.delay, config.useText));
    }, 1000);

})();
