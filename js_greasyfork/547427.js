// ==UserScript==
// @name         Perplexity Outline Toggle
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0
// @description  개요 단축키 Alt+F로 설정합니다. Complexity 필요.
// @author       zeronox
// @match        https://www.perplexity.ai/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @downloadURL https://update.greasyfork.org/scripts/547427/Perplexity%20Outline%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/547427/Perplexity%20Outline%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key.toLowerCase() === 'f') {
            event.preventDefault();

            const openButton = document.querySelector('div[role="button"] svg path[d^="M8 12h13"]')?.closest('div[role="button"]');

            if (!openButton) {
                console.log('Hotkey pressed, but the open button was not found.');
                return;
            }

            const isPanelOpen = openButton.classList.contains('x:hidden');

            if (isPanelOpen) {
                const closeButtonSvg = document.querySelector('#thread-toc-container svg path[d^="M18 6"]');
                if (closeButtonSvg) {
                    const clickableCloseDiv = closeButtonSvg.closest('div[class*="cursor-pointer"]');
                    if (clickableCloseDiv) {
                        clickableCloseDiv.click();
                        console.log('Panel CLOSED via hotkey.');
                    }
                }
            } else {
                openButton.click();
                console.log('Panel OPENED via hotkey.');
            }
        }
    });
})();