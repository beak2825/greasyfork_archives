// ==UserScript==
// @name         Seznam/Idnes Auto Consent
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  Automatically conset to data collection on Seznam and Idnes
// @match     https://cmp.seznam.cz/nastaveni-souhlasu*
// @match     https://www.idnes.cz/nastaveni-souhlasu*
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514148/SeznamIdnes%20Auto%20Consent.user.js
// @updateURL https://update.greasyfork.org/scripts/514148/SeznamIdnes%20Auto%20Consent.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    window.addEventListener('load', async () => {
        if (window.location.href.includes("idnes.cz")) {
            SkipIdnes();
        }
        else {
            await SkipSeznam();
        }
    });

    async function SkipIdnes() {
        await sleep(500);
        Didomi.setUserAgreeToAll();
    }

    async function SkipSeznam() {
        // Unlock the DOM
        unlockDom();

        // Wait for the page to load
        await sleep(500);
        try {
            var button2 = await findConsentButton();
            button2.click();
            await sleep(1000);
        }
        catch (e) {
            await sleep(100);
        }
        var attempts = 0;
        var button = await findBackButton();
        if (button != null) {
            button.click();
            await sleep(1000);
        }
        attempts = 0;
        while (attempts < 100) {
            try {
                button2 = await findConsentButton();
                button2.click();
                await sleep(100);
            }
            catch (e) {
                await sleep(100);
                attempts++;
            }
        }
    }

    // Find the back button
    async function findBackButton() {
        var button = null;
        var attempts = 0;
        while (button === null && attempts < 200) {
            button = querySelector('button[data-testid="cw-button-content-preferences"]')
            if (button === null) {
                await sleep(10);
                attempts++;
            }
        }
        return button;
    }

    // Find the consent button
    async function findConsentButton() {
        var button = null;
        var attempts = 0;
        while (button === null && attempts < 500) {
            button = querySelector('button[data-testid="cw-button-agree-with-ads"]');
            if (button === null) {
                await sleep(10);
                attempts++;
            }
        }
        return button;
    }

    // Sleep for the given number of milliseconds
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function unlockDom() {
        const originalAttachShadow = Element.prototype.attachShadow;
        function customAttachShadow() {
            return originalAttachShadow.apply(this, [{ mode: 'open' }]);
        };
        Element.prototype.attachShadow = customAttachShadow;
    }

    function querySelector(selector) {
        return querySelectorAll(document, selector)[0];
    }

    function querySelectorAll(node, selector) {
        const nodes = [...node.querySelectorAll(selector)];
        const nodeIterator = document.createNodeIterator(
            node,
            NodeFilter.SHOW_ELEMENT,
            node => node instanceof Element && node.shadowRoot
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT,
        );

        let currentNode = nodeIterator.nextNode();
        while (currentNode) {
            nodes.push(...querySelectorAll(currentNode.shadowRoot, selector));
            currentNode = nodeIterator.nextNode();
        }

        return nodes;
    }
})();
