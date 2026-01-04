// ==UserScript==
// @name         Skip Amazon Prime Interstitials
// @namespace    club.porcupine.gm_scripts.skip_amazon_prime_interstitials
// @version      1
// @description  Automatically click "no thanks" when Amazon nags you to join Prime.
// @author       Sam Birch
// @license      MIT
// @match        https://*.amazon.com/gp/buy/primeinterstitial/*
// @icon         https://icons.duckduckgo.com/ip2/amazon.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443989/Skip%20Amazon%20Prime%20Interstitials.user.js
// @updateURL https://update.greasyfork.org/scripts/443989/Skip%20Amazon%20Prime%20Interstitials.meta.js
// ==/UserScript==
(function(){
    'use strict'

    document.querySelector('.prime-nothanks-button').click()
})()
