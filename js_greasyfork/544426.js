// ==UserScript==
// @name         Twitch Game Google Search Button (Fixed Position)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a Google Search button next to the game name on Twitch stream pages
// @author       andreas1337
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544426/Twitch%20Game%20Google%20Search%20Button%20%28Fixed%20Position%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544426/Twitch%20Game%20Google%20Search%20Button%20%28Fixed%20Position%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility: Wait for element using XPath
    function waitForElementByXPath(xpath, callback) {
        const observer = new MutationObserver(() => {
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const element = result.singleNodeValue;
            if (element && !element.dataset.googleButtonAdded) {
                element.dataset.googleButtonAdded = 'true';
                observer.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // XPath for the game name <a> (not just the <span>)
    const gameLinkXPath = "/html/body/div[1]/div/div[1]/div/main/div[1]/div/div[1]/div/div[2]/div/section/div/div/div[2]/div[2]/div[2]/div[1]/div/div[2]/div/div/div[1]/a";

    waitForElementByXPath(gameLinkXPath, function(gameLink) {
        const gameName = gameLink.textContent.trim();

        // Create the button
        const button = document.createElement('button');
        button.textContent = '🔍';
        button.title = 'Search game on Google';
        button.style.marginLeft = '8px';
        button.style.padding = '2px 6px';
        button.style.fontSize = '12px';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.background = '#eee';

        button.addEventListener('click', () => {
            const query = encodeURIComponent(gameName);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        });

        // Insert the button after the game link
        gameLink.parentElement.insertBefore(button, gameLink.nextSibling);
    });

})();
