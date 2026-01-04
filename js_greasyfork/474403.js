// ==UserScript==
// @name         ChatGPT custom instructions button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Doesn't seem to work in Chrome/Edge. Adds a 'Custom instructions' button to the bottom of the side panel. You have to do this manually once first for the script to work.
// @author       Nick Bell
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474403/ChatGPT%20custom%20instructions%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/474403/ChatGPT%20custom%20instructions%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonAdded = false;

    function simulateClick(target) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        target.dispatchEvent(event);
    }

    // Function to add the button next to menuElement
    function addButtonNextToMenuElement() {
        const menuElement = document.querySelector("div.border-t:nth-child(4)");
        if (menuElement && !buttonAdded) {
            const button = document.createElement("button");
            button.innerHTML = "Custom instructions";
            button.style = "font-family: 'Courier New';font-size: 9pt; color:white; padding: 0.2rem; border: 1px white solid;";
            button.addEventListener('mouseup', function() {
                setTimeout(function() {
                    // Programmatically click the identified button
                    const targetElement = document.querySelector("[id='headlessui-menu-button-:r9:']");
                    if (targetElement) {
                        simulateClick(targetElement);
                    }

                    // Start polling for ciElement
                    const ciElementIntervalId = setInterval(function() {
                        const ciElement = document.querySelector("[id='headlessui-menu-item-:r22:']");
                        if (ciElement) {
                            clearInterval(ciElementIntervalId);
                            simulateClick(ciElement);
                        }
                    }, 500);
                }, 100);  // 100ms delay
            });
            menuElement.parentNode.insertBefore(button, menuElement.nextSibling);
            buttonAdded = true;
        }
    }

    // Mutation observer to watch for changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            addButtonNextToMenuElement();
        });
    });

    // Configuration of the observer
    const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    };

    // Pass in the target node, as well as the observer options
    observer.observe(document.body, config);
})();
