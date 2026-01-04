// ==UserScript==
// @name         Bypass Detector
// @namespace    https://tampermonkey.net/
// @version      1.2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bypass.city
// @description  Adds a bypass button for supported URLs
// @author       sharmanhall
// @license      MIT
// @match        *://*.sub2get.com/*
// @match        *://*.lootlinks.com/*
// @match        *://*.adfoc.us/*
// @match        *://*.boost.ink/*
// @match        *://*.boostfusedgt.com/*
// @match        *://*.leasurepartment.xyz/*
// @match        *://*.letsboost.net/*
// @match        *://*.mboost.me/*
// @match        *://*.rekonise.com/*
// @match        *://*.shorte.st/*
// @match        *://*.sub2unlock.com/*
// @match        *://*.sub2unlock.net/*
// @match        *://*.v.gd/*
// @match        *://*.dragonslayer.site/*
// @match        *://*.tinyurl.com/*
// @match        *://*.bit.ly/*
// @match        *://*.is.gd/*
// @match        *://*.rebrand.ly/*
// @match        *://*.empebau.eu/*
// @match        *://*.socialwolvez.com/*
// @match        *://*.sub1s.com/*
// @match        *://*.tinylink.onl/*
// @match        *://*.google.com/*
// @match        *://*.justpaste.it/*
// @match        *://*.subfinal.com/*
// @match        *://*.ad-maven.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514384/Bypass%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/514384/Bypass%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and add bypass button
    function addBypassButton() {
        const button = document.createElement('button');
        button.innerHTML = 'Bypass Link';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#45a049';
        });

        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#4CAF50';
        });

        button.addEventListener('click', () => {
            const encodedUrl = encodeURIComponent(window.location.href);
            window.location.href = `https://bypass.city/bypass?bypass=${encodedUrl}`;
        });

        document.body.appendChild(button);
    }

    // Run when page loads
    window.addEventListener('load', addBypassButton);
})();