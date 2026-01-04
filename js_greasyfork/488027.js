// ==UserScript==
// @name         GauthMath Bypass Paywall newer version
// @namespace    http://tampermonkey.net/
// @version      2.5
// @license      MIT
// @description  Bypass the paywall and hopefully jailbreak the site
// @author       Viruszy
// @match        https://www.gauthmath.com/
// @match        https://www.gauthmath.com/calculator
// @match        https://www.gauthmath.com/search-question?questionID=1791612050420741&action=image_search
// @match        https://www.gauthmath.com/solution/1782791331021829/
// @match        https://www.gauthmath.com/solution/1782791331021829/
// @match        https://www.gauthmath.com/solution/1782635516057605/
// @icon         a photo of gauthmath symbol
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const elementsToRemove = [
        "[data-testid^='ad_below_']" //Annoying video ads
    ];
    //simulating button click to keep native Gauth Math functionality without needing additional code.
    const elementsToClick = [
        "[data-testid='registration_toplayer_close_button']", //Login popup/modal close button
        '[aria-label="Close this dialog window"]' //Promotion popup/modal close button
    ];
    const config = { attributes: true, childList: true, subtree: true };
    let timeoutID = 0;
    let mutationObserver;
    const mutationCallback = () => {
        mutationObserver.disconnect();
        for (let query of elementsToRemove) {
            let nodes = document.querySelectorAll(query);
            for (let node of nodes)
                node.remove();
        }
        for (let query of elementsToClick) {
            let nodes = document.querySelectorAll(query);
            for (let node of nodes)
                if (timeoutID === 0)
                    timeoutID = setTimeout(() => { timeoutID = 0; node.click(); }, 500);
        }
        mutationObserver.observe(document.body, config);
    }
    try {
        localStorage.clear();
    } catch (err) {
        console.error("Couldn't clear local storage, the browser is most likely blocking access to it. (are all cookies being blocked?)");
        console.error(err);
    }
    document.addEventListener("DOMContentLoaded", () => {
        mutationObserver = new MutationObserver(mutationCallback);
        mutationCallback();
        // Remove paywall elements
    function bypassPaywall() {
        const paywallElement = document.getElementById('paywall'); // Adjust the ID based on the actual paywall element
        if (paywallElement) {
            paywallElement.remove();
        }
    }
         // Enable Gauthplus features
    function enableGauthplus() {
        // Simulate successful Gauthplus subscription
        localStorage.setItem('isGauthplus', 'true');
    }

    // Check if user has Gauthplus subscription
    function hasGauthplus() {
        return localStorage.getItem('isGauthplus') === 'true';
    }

    // Main function
    function main() {
        bypassPaywall();
        if (!hasGauthplus()) {
            enableGauthplus();
        }
    }
    });
})();