// ==UserScript==
// @name         WHEEL OF GOLD
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      none
// @description  faucet
// @author       SON
// @match        https://wheelofgold.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wheelofgold.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537375/WHEEL%20OF%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/537375/WHEEL%20OF%20GOLD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        return;} else {

    let sonEML = '' // coloque seu email aqui
    let sonRDR = ''

    if (window.location.href === 'https://wheelofgold.com/') {
        setTimeout(() => {
        let sonBTL = document.querySelector('[class="btn btn-outline-warning"]')
        if (sonBTL) {
            sonBTL.click()
        }
        }, 3000)
    }

    if (window.location.href === 'https://wheelofgold.com/') {
        setTimeout (() => {
        document.querySelector('[id="InputEmail"]').value = sonEML
    })
}

if (window.location.href === 'https://wheelofgold.com/') {
        let sonTML = setInterval (() => {
            let sonBTL = document.querySelector('[class="btn btn-outline-warning"][type="submit"]')
            if (sonBTL && (window.turnstile.getResponse().length > 0)) {
                sonBTL.click()
                clearInterval(sonTML)
            }
        }, 3000)
        }

    if (window.location.href === 'https://wheelofgold.com/dashboard') {
        setTimeout (() => {
            window.location.href = 'https://wheelofgold.com/faucet/currency/usdt'
        }, 2000)
    }

            if (window.location.href.includes('/currency/')) {
        let sonTMF = setInterval (() => {
             let sonBTC = document.querySelector('[class="btn btn-outline-warning claim-button"]');
            let sonABL = document.getElementById('antibotlinks');
             if (sonBTC && document.querySelector('.iconcaptcha-modal__body-title').textContent.trim() === 'Verification complete.' /* && sonABL.value.trim() !== '' */ ) {
        sonBTC.click()
        clearInterval(sonTMF)
             }
        }, 12000)
        }

          if (window.location.href.includes('/usdt')) {
            setTimeout (() => {
              if (document.body.textContent.includes('has been added to your account balance.')) {
                window.location.href = 'https://wheelofgold.com/faucet/currency/usdc'
              }
            }, 3000)
          }

            if (window.location.href.includes('/usdc')) {
            setTimeout (() => {
              if (document.body.textContent.includes('has been added to your account balance.')) {
                window.location.href = 'https://wheelofgold.com/faucet/currency/usdt'
              }
            }, 3000)
          }

          if (window.location.href.includes('/currency/')) {
            setTimeout (() => {
              location.reload()
            }, 120000)
          }

          let sonTMS = setInterval(() => {
    const targetElement = document.querySelector('.iconcaptcha-modal__body-title');
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
        clearInterval(sonTMS);
    }
}, 3000);


        }

})();