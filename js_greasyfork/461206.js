// ==UserScript==
// @name         ChatGPT / Gemini / Claude Width
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  increase chatgpt, gemini and claude box width
// @author       bitmunja
// @license MIT
// @match        https://gemini.google.com/*
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/chat/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461206/ChatGPT%20%20Gemini%20%20Claude%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/461206/ChatGPT%20%20Gemini%20%20Claude%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn(`Width script: giving up after ${numAttempts} attempts. Could not find: ${readySelector}`);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    // Function to apply width adjustment to the elements returned by the getElementsCallback
    function applyWidth(getElementsCallback) {
        const elements = getElementsCallback();
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.setProperty('max-width', '98%', 'important');
        }
    }

    // Generic function to observe mutations and apply width adjustments
    function observeMutations(getElementsCallback) {
        const observer = new MutationObserver(function(mutations) {
            let eventRegistrationCount = 0;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    eventRegistrationCount++;
                }
            });
            if(eventRegistrationCount > 0) {
                applyWidth(getElementsCallback);
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Check the domain and apply the corresponding logic
    const hostname = window.location.hostname;

    if (hostname === 'chat.openai.com' || hostname === 'chatgpt.com') {
        const getElements = () => document.querySelectorAll('.text-base, .text-base > div:first-child');
        runWhenReady('.text-base', function() {
            applyWidth(getElements);
            observeMutations(getElements);
        });
    } else if (hostname === 'gemini.google.com') {
        const getElements = () => document.querySelectorAll('.conversation-container');
        runWhenReady('.conversation-container', function() {
            applyWidth(getElements);
            observeMutations(getElements);
        });
    } else if (hostname === 'claude.ai') {
        const getElements = () => {
            const coreSelector = 'div[data-test-render-count]';
            const l1Element = document.querySelector(coreSelector).parentElement;
            const l2Element = l1Element.parentElement;
            return [l1Element, l2Element]
        }
        runWhenReady('div[data-is-streaming]', function() {
            applyWidth(getElements);
            observeMutations(getElements);
        });
    }
})();