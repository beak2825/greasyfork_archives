// ==UserScript==
// @name         Coinpayu Faucet
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Faucet 
// @author       White
// @match        https://www.coinpayu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coinpayu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477303/Coinpayu%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/477303/Coinpayu%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const coins = ["litecoin", "tether", "bitcoin", "dogecoin"];

    if (window.location.href === "https://www.coinpayu.com/dashboard/faucet") {
        setTimeout(() => {
            const firstCoin = coins[0];
            const redirectURL = `https://www.coinpayu.com/dashboard/${firstCoin}_faucet/claim`;
            window.location.href = redirectURL;
        }, 30000);
    }

 const currentURL = window.location.href;
    const isClaimPage = currentURL.includes("/claim");

if (!isClaimPage) {
    const currentPage = coins.find(coin => currentURL.includes(`/${coin}_faucet`));
    if (currentPage) {
        const currentIndex = coins.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % coins.length;

        if (nextIndex === 0) {
            setTimeout(() => {
                window.location.href = 'https://www.coinpayu.com/dashboard/faucet';
            }, 60*60000);
        } else {
            const nextCoin = coins[nextIndex];
            setTimeout(() => {
                const redirectURL = `https://www.coinpayu.com/dashboard/${nextCoin}_faucet/claim`;
                window.location.href = redirectURL;
            }, 5000);
        }
    }
}



    function clickCaptchaButton() {
        const captchaButton = document.querySelector('button[data-v-cd67d660]');
        if (captchaButton && captchaButton.innerText === 'Click here to see the captcha') {
            setTimeout(() => {
                captchaButton.click();
                setTimeout(() => {
                selectHcaptchaOption();
              }, 3000);
            }, 2000);
        }
    }

function waitForGrecaptchaAndClaim() {
    const checkInterval = setInterval(() => {
        const claimButton = document.querySelector('button.claim_now[data-v-cd67d660]');
        if (claimButton) {
            const computedStyle = window.getComputedStyle(claimButton);
            const backgroundColor = computedStyle.getPropertyValue('background-color');
            if (backgroundColor === 'rgb(31, 192, 255)') {
                clearInterval(checkInterval);
                const randomDelay = 2000 + Math.floor(Math.random() * 8000);
                setTimeout(() => {
                    claimButton.click();
                    setTimeout(() => {
                        location.reload();
                    }, 10000);
                }, randomDelay);
            }
        }
    }, 1000);
}
    function selectHcaptchaOption() {
        const hcaptchaSpan = document.querySelector('div > span[class=""]:not(.recaptcha-checked)');
        if (hcaptchaSpan && hcaptchaSpan.innerText === 'Hcaptcha') {
            hcaptchaSpan.click();
        }
    }

    const observer = new MutationObserver(() => {
        clickCaptchaButton();
    });
        if (window.location.href === 'https://www.coinpayu.com/dashboard/faucet') {
        const claimButtons = document.querySelectorAll('button[data-v-9ec3e6bd][style*="background: rgb(31, 192, 255)"]');

        if (claimButtons.length > 0) {
            const firstClaimButton = claimButtons[0];

            setTimeout(function() {
                firstClaimButton.click();
            }, 10000);
        }
    }

waitForGrecaptchaAndClaim();
    observer.observe(document.body, { childList: true, subtree: true });
})();