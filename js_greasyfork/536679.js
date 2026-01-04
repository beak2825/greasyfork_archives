// ==UserScript==
// @name         Capes.me - Free Glow
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Capes.me Free Glow
// @author       @yd0 (Gigant)
// @match        https://capes.me/edit
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536679/Capesme%20-%20Free%20Glow.user.js
// @updateURL https://update.greasyfork.org/scripts/536679/Capesme%20-%20Free%20Glow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Capes.me Free Glow");

    function activateFeatures() {
        const donatorDisabledElements = document.querySelectorAll('.donator-disabled');
        donatorDisabledElements.forEach(el => {
            el.classList.remove('donator-disabled');
        });

        const disabledAttributeElements = document.querySelectorAll('[disabled]');
        disabledAttributeElements.forEach(el => {
            el.removeAttribute('disabled');
            if (typeof el.disabled !== 'undefined') {
                el.disabled = false;
            }
        });

        const tebexLinks = document.querySelectorAll('a[href="https://capesme.tebex.io/category/capes-me-plus"]');
        tebexLinks.forEach(link => {
            link.removeAttribute('href');
        });

       // if (typeof jscolor !== 'undefined' && typeof jscolor.init === 'function') {
       //     setTimeout(() => {
       //         jscolor.init();
       //     }, 500);
       // } else {
       // }

    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        activateFeatures();
    } else {
        window.addEventListener('load', activateFeatures);
    }
})();