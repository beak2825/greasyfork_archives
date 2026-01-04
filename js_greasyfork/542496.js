// ==UserScript==
// @name         ADBTC REDIRECT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adbtc redirect
// @author       SON
// @match        https://adbtc.top/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adbtc.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542496/ADBTC%20REDIRECT.user.js
// @updateURL https://update.greasyfork.org/scripts/542496/ADBTC%20REDIRECT.meta.js
// ==/UserScript==

(function() {
    'use strict'

    if (window.location.href.includes('/tuo/')) {
        window.stop()
    }

    if (window.location.href === 'https://adbtc.top/index/earn') {
        setTimeout (() => {
            let sonINC = document.querySelector('[class="btn yellow black-text"]')
            if (sonINC) {
                sonINC.click()
            }
        }, 5000)
    }

    if (window.location.href.includes('/surf/')) {
        let sonBTR = setInterval (() => {
            if (document.body.textContent.includes('You have watched all the available ads for now')) {
                let sonBT = document.querySelectorAll('[class="collection-item hoverable "]')
                sonBT[2].click()
                clearInterval(sonBTR)
            }
        }, 5000)
        }

    if (window.location.href.includes('/surfusd/')) {
        let sonBTR1 = setInterval (() => {
            if (document.body.textContent.includes('You have watched all the available ads for now')) {
                let sonBT1 = document.querySelectorAll('[class="collection-item hoverable "]')
                sonBT1[3].click()
                clearInterval(sonBTR1)
            }
        }, 5000)
        }

    if (window.location.href.includes('/surfiat/')) {
        let sonBTR2 = setInterval (() => {
            if (document.body.textContent.includes('You have watched all the available ads for now')) {
                let sonBT2 = document.querySelectorAll('a')
                sonBT2[18].click()
                clearInterval(sonBTR2)
            }
        }, 5000)
        }

    let sonRLD = setInterval (() => {
        let sonTAB = document.querySelector('title')
        if (sonTAB.textContent.includes('You closed page!')) {
            location.reload()
            clearInterval(sonRLD)
        }
    }, 5000)

})();