// ==UserScript==
// @name         VK Garland Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically removes garland decorations from VK.com
// @author       https://vk.com/oranzeviypegas
// @match        *://*.vk.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521476/VK%20Garland%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/521476/VK%20Garland%20Remover.meta.js
// ==/UserScript==
// @license MIT
(function() {
    'use strict';

    function removeGarland() {
        const garlands = document.querySelectorAll([
            '.GarlandParts__root--GY7Sw',
            '.GarlandParts__rootVisible--TCO1L',
            '.GarlandParts__rootAnimated--MVe70',
            '[class*="GarlandParts"]'
        ].join(','));

        garlands.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        const styles = document.querySelectorAll('style');
        styles.forEach(style => {
            if (style.textContent.includes('GarlandParts')) {
                style.parentNode.removeChild(style);
            }
        });
    }

    function initialize() {
        removeGarland();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList &&
                            (node.classList.toString().includes('Garland') ||
                             node.querySelector('[class*="GarlandParts"]'))) {
                            removeGarland();
                        }
                    });
                }
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();