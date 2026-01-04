// ==UserScript==
// @name         GC - Copy SDB Inventory
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       AshyAsh
// @description  Adds a button to your SDB page above your items. When clicked it copies all the items on the current page.
// @match        https://www.grundos.cafe/safetydeposit/*
// @grant        GM_setClipboard
// @license      MIT   
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/481496/GC%20-%20Copy%20SDB%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/481496/GC%20-%20Copy%20SDB%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom CSS
    function addCustomCSS() {
        const css = `
            .custom-copy-button {
              background-color: #ACE1AF;
              border: 2px solid #6ECB73;
              padding: 5px 10px 15px 10px;
              margin: 10px;
              cursor: pointer;
              width: 85%;
              font-weight: 600;
              letter-spacing: 2px;
              text-transform: uppercase;
            }

            .custom-copy-button:hover {
                background-color: #AFADE1;
                letter-spacing: 3px;
                border: 2px solid #726FCA;
            }

            .custom-copy-button.copied {
                background-color: #03C03C;
                color: white;
                border: 2px solid #6ECB73;
            }
        `;

        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    // Function to extract text and copy to clipboard
    function copyText() {
        let elements = document.querySelectorAll('.data.flex-column.small-gap.break strong');
        let textList = [];

        elements.forEach(element => {
            textList.push(element.textContent);
        });

        GM_setClipboard(textList.join("\n"));

        // Change button appearance upon successful copy
        copyButton.classList.add('copied');
        copyButton.textContent = 'Items Copied!';
    }

    // Add custom CSS to the page
    addCustomCSS();

    // Create and insert a button to trigger the copy function
    let copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Inventory';
    copyButton.className = 'custom-copy-button';
    copyButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent any default button behavior
        copyText();
    });

    // Select the target element to place the button above
    let targetElement = document.querySelector('.market_grid.sdb.margin-1');

    if (targetElement) {
        targetElement.parentNode.insertBefore(copyButton, targetElement);
    }
})();