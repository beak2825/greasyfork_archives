// ==UserScript==
// @name         Bienici quick infos
// @namespace    artemisart
// @version      0.2
// @description  Affiche les infos de prix, prix/m2...
// @author       artemisart
// @match        https://www.bienici.com/annonce/location/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bienici.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475450/Bienici%20quick%20infos.user.js
// @updateURL https://update.greasyfork.org/scripts/475450/Bienici%20quick%20infos.meta.js
// ==/UserScript==

(function() {
    'use strict'

    function waitForKeyElements(selector, action) {
        if (document.querySelector(selector) === null) {
            setTimeout(waitForKeyElements, 500, selector, action)
        }
        else {
            action()
        }
    }

    waitForKeyElements('.titleInside h1', main)

    function main() {
        const area = +document.querySelector('.titleInside h1').textContent.match(/([\d\s]+)\sm²/)[1].replace(/\s/g, '')
        const price = +document.querySelector('.ad-price__the-price').textContent.match(/[\d\s]+/)[0].replace(/\s/g, '')
        const fees = +document.querySelector('.ad-price__fees-infos').textContent.match(/[\d\s]+/)[0].replace(/\s/g, '')
        const element = document.querySelector('.closeBtnContainer')
        element.children[0].append(`Loyer : ${(price / area).toFixed(1)}€/m², ${price}€ hc ${price - fees}€, surface ${area}m²`)
    }
})()
