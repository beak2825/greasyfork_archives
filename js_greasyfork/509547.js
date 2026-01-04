// ==UserScript==
// @name         Parkour Helper for miniblox.io
// @namespace    http://tampermonkey.net/
// @description  parkour helper for miniblox.io
// @match        https://miniblox.io/
// @grant        none
// @license      Redistribution prohibited
// @version 0.0.1.20240921150824
// @downloadURL https://update.greasyfork.org/scripts/509547/Parkour%20Helper%20for%20minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/509547/Parkour%20Helper%20for%20minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const xpath = "/html/body/div[2]/div/div[5]/div[1]/div[2]/span[22]/span/text()[1]";
    const offsetY = -260;
    const offsetX = 50;

    const centerElement = () => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (element) {
            const parent = element.parentNode;
            const rect = parent.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            parent.style.position = 'absolute';
            parent.style.left = `${(viewportWidth - rect.width) / 2 + offsetX}px`;
            parent.style.top = `${(viewportHeight - rect.height) / 2 + offsetY}px`;

            // remove"Rotation: "
            const originalText = element.textContent;
            const newText = originalText.replace(/Rotation: /, '');
            element.textContent = newText.trim();
        }
    };

    centerElement();

    const observer = new MutationObserver(centerElement);
    observer.observe(document.body, { childList: true, subtree: true });
})();