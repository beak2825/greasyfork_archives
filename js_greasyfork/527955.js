// ==UserScript==
// @name        FAUCETOSHI.COM
// @namespace   Tampermonkey Scripts
// @match       https://faucetoshi.com/*
// @license     MIT
// @grant       none
// @version     1.0
// @author      SON
// @description login, ptc, achievements and autofaucet
// @downloadURL https://update.greasyfork.org/scripts/527955/FAUCETOSHICOM.user.js
// @updateURL https://update.greasyfork.org/scripts/527955/FAUCETOSHICOM.meta.js
// ==/UserScript==

( function() {
    'use strict';

    const pageTitle = document.title.toLowerCase();
    if (pageTitle.includes('just a moment...') || pageTitle.includes('um momento...')) {
        return;} else {

            let sonEML = '#' // MUDE O # PARA O SEU EMAIL CADASTRADO NO SITE
            let sonPSW = '#' // MUDE O # PARA A SUA SENHA
            let sonRDR = '#' // MUDE O # PARA O PRÓXIMO SITE DA ROTAÇÃO

            if (window.location.href === 'https://faucetoshi.com/') {
                setTimeout (() => {
                    window.location.href = 'https://faucetoshi.com/login'
                }, 3000)
            }

            if (window.location.href === 'https://faucetoshi.com/faucet') {
                setTimeout (() => {
                    window.location.href = 'https://faucetoshi.com/ptc'
                }, 3000)
            }

            if (window.location.href === 'https://faucetoshi.com/login') {
                setTimeout (() => {
                    document.querySelector('[id="email"]').value = sonEML
                    document.querySelector('[id="password"]').value = sonPSW
                })
            }

            if (window.location.href === 'https://faucetoshi.com/login') {
                setTimeout (() => {
                    let sonBTL = document.querySelector('[class="btn btn-block"]')
                    if (sonBTL) {
                        sonBTL.click()
                    }
                }, 5000)
            }

            if (window.location.href === 'https://faucetoshi.com/dashboard') {
                setTimeout (() => {
                    window.location.href = 'https://faucetoshi.com/ptc'
                }, 3000)
            }

            if (window.location.href === 'https://faucetoshi.com/ptc') {
                setInterval (function() {
                    let sonBPC = document.querySelector('.btn.btn-primary.btn-block.waves-effect')
                    sonBPC.click();
                    clearInterval();
                }, 5000)
            }


            if (window.location.href.includes('/view/')) {
                let sonVIW = setInterval (function() {
                    let sonCDW = document.getElementById('ptcCountdown')
                    let sonBTV = document.querySelector('.btn.btn-success.btn-block.mt-3')
                    if (sonBTV && sonCDW.textContent.trim() === '0 second') {
                        sonBTV.click();
                        clearInterval(sonVIW);
                    }
                }, 5000)
            }


            if (window.location.href.includes('/ptc')) {
                setTimeout (() => {
                let sonBDY = document.body
                if (sonBDY.textContent.includes('There are currently no PTC ads available!')) {
                    window.location.href = 'https://faucetoshi.com/achievements'
                }
                }, 3000)
            }

            if (window.location.href.includes('/view/')) {
                let sonVIX = setInterval (function() {
                    let sonCDX = document.getElementById('ptcCountdown')
                    if (sonCDX.textContent.trim() === 'NaN second') {
                        location.reload()
                        clearInterval(sonVIX)
                    }
                }, 3000)
                }

            if (window.location.href === 'https://faucetoshi.com/auto') {
                setTimeout (() => {
                let sonBDAY = document.body
                if (sonBDAY.textContent.includes("You don't have enough energy for Auto Faucet!")) {
                    window.location.href = sonRDR
                }
                }, 3000)
            }

            if (window.location.href === 'https://faucetoshi.com/achievements') {
                setTimeout (() => {
                let sonBTA = document.querySelector('[class="btn btn-success rounded-circle waves-effect"][type="submit"]')
                if (sonBTA) {
                    sonBTA.click()
                    } else { window.location.href = 'https://faucetoshi.com/auto' }
              }, 3000)
                            }

        }

})();