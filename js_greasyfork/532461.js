// ==UserScript==
// @name         Klavia Cinder Security Test - Shop Focus
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Test script to set Klavia cinders to 99999 in shop for security testing
// @author       You
// @match        https://playklavia.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532461/Klavia%20Cinder%20Security%20Test%20-%20Shop%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/532461/Klavia%20Cinder%20Security%20Test%20-%20Shop%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Show it’s working immediately
    console.log('Cinder hack script loaded! Targeting shop cinders.');

    function setCindersTo99999() {
        let win = unsafeWindow || window;

        // Immediate visual feedback in shop
        let shopCinderElement = document.querySelector('.shop-cinders, .cinder-amount, #cinders, [class*="cinder"], [id*="cinder"]');
        if (shopCinderElement) {
            shopCinderElement.textContent = '99999';
            shopCinderElement.innerText = '99999'; // Cover both cases
            console.log('Shop cinder display set to 99999.');
        } else {
            console.log('Shop cinder element not found yet. Waiting for shop load...');
        }

        // Override possible client-side cinder variables
        if (win.gameData && win.gameData.cinders !== undefined) {
            Object.defineProperty(win.gameData, 'cinders', {
                get: () => 99999,
                set: () => {},
                configurable: true
            });
            console.log('gameData.cinders locked to 99999.');
        }

        if (win.player && win.player.cinders !== undefined) {
            Object.defineProperty(win.player, 'cinders', {
                get: () => 99999,
                set: () => {},
                configurable: true
            });
            console.log('player.cinders locked to 99999.');
        }

        if (win.cinders !== undefined) {
            Object.defineProperty(win, 'cinders', {
                get: () => 99999,
                set: () => {},
                configurable: true
            });
            console.log('Global cinders locked to 99999.');
        }

        // Override localStorage if used
        if (localStorage.getItem('cinders')) {
            localStorage.setItem('cinders', '99999');
            console.log('localStorage cinders set to 99999.');
        }
    }

    // Run immediately and keep checking
    setCindersTo99999();
    window.addEventListener('load', setCindersTo99999);
    setInterval(setCindersTo99999, 1000); // Check every second for shop updates
})();