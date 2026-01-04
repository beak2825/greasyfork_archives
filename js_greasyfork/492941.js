// ==UserScript==
// @name         colorblind text helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change all red text color to preferred one
// @author       Something begins
// @license      none
// @include       https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492941/colorblind%20text%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492941/colorblind%20text%20helper.meta.js
// ==/UserScript==

const shadeCoef = 80;
const toColor = "purple";
// Function to check if an element is a text element
function isTextElement(element) {
    return element.nodeType === Node.TEXT_NODE;
}

// Function to check if a text element has a red color
function isRedText(element) {
    const parentElement = element.parentElement;
    if (!parentElement) {
        return false;
    }

    const computedStyle = window.getComputedStyle(parentElement);
    const color = computedStyle.color;

    if (color.startsWith('rgb(')) {
        const rgb = color.match(/\d+/g);
        const red = parseInt(rgb[0]);
        const green = parseInt(rgb[1]);
        const blue = parseInt(rgb[2]);

        if (red > green + shadeCoef && red > blue + shadeCoef) {
            return true;
        }
    } else if (color.startsWith('#')) {
        const hex = color.substr(1);
        const red = parseInt(hex.substr(0, 2), 16);
        const green = parseInt(hex.substr(2, 2), 16);
        const blue = parseInt(hex.substr(4, 2), 16);

        if (red > green + shadeCoef && red > blue + shadeCoef) {
            return true;
        }
    }

    return false;
}

// Get all text nodes on the page
const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    { acceptNode: node => NodeFilter.FILTER_ACCEPT }
);

const textNodes = [];
while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
}

// Filter text nodes that are red
const redTextNodes = textNodes.filter(isRedText);

// Log red text nodes
redTextNodes.forEach(textNode => {
    console.log('Red text:', textNode);
    textNode.parentElement.style.color = toColor;
});
