// ==UserScript==
// @name         This Is not Greasy Fork
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      CC BY-NC
// @description  Tired of Greasy Fork? Well Make your Own Fork :3
// @author        Unknown Hacker
// @match        *://greasyfork.org/*
// @match        *://sleazyfork.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/524457/This%20Is%20not%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/524457/This%20Is%20not%20Greasy%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IF THIS DOES NOT ABIDE BY THE RULES THEN LET ME KNOW LIKE A HUMAN BEING AND I WILL EITHER REMOVE THE SCRIPT OR CHANGE THE DEFAULT
    const defaultText = "Sleazy Fork"; // Sleazy Fork to Greasy Fork will come soon..

    let replacementText = GM_getValue("replacementText", defaultText);

    function setReplacementText() {
        const userInput = prompt("Enter the text to replace 'Greasy Fork' with:", replacementText);
        if (userInput !== null && userInput.trim() !== "") {
            GM_setValue("replacementText", userInput.trim());
            replacementText = userInput.trim();
            alert(`Replacement text set to: ${replacementText}`);
        }
    }

    function resetReplacementText() {
        GM_setValue("replacementText", defaultText);
        replacementText = defaultText;
        alert(`Replacement text reset to default: ${defaultText}`);
    }

    GM_registerMenuCommand("Set Replacement Text", setReplacementText);
    GM_registerMenuCommand("Reset to Default Text", resetReplacementText);

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/Greasy Fork/g, replacementText);
        } else {
            for (let child of node.childNodes) {
                replaceTextInNode(child);
            }
        }
    }

    replaceTextInNode(document.body);

    document.title = document.title.replace(/Greasy Fork/g, replacementText);
})();