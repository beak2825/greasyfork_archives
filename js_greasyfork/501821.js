// ==UserScript==
// @name         Auto-activate Perplexity.ai Pro Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-activates the Pro button on Perplexity.ai
// @match        https://www.perplexity.ai/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501821/Auto-activate%20Perplexityai%20Pro%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/501821/Auto-activate%20Perplexityai%20Pro%20Button.meta.js
// ==/UserScript==

'use strict';

function activateProButton() {
    const proButton = document.querySelector('button[data-testid="copilot-toggle"]');
    if (proButton && proButton.getAttribute('data-state') === 'closed') {
        proButton.click();
    }
}

window.addEventListener('load', () => {
    activateProButton();
    new MutationObserver(activateProButton).observe(document, { childList: true, subtree: true });
});
