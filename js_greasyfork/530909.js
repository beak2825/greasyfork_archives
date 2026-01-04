// ==UserScript==
// @name         Get Track Numbers from AliExpress Orders
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Add a button to get track of AliExpress orders and copy their tracking numbers to clipboard
// @author       Hegy
// @match        https://www.aliexpress.com/p/tracking/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530909/Get%20Track%20Numbers%20from%20AliExpress%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/530909/Get%20Track%20Numbers%20from%20AliExpress%20Orders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    insertMaterializeCSSLink()

    // Create a button to trigger the tracking process
    const button = document.createElement('button');
    button.textContent = 'Get Track Numbers';
    button.classList.add('waves-effect', 'waves-light', 'btn');
    button.style.position = 'fixed';
    button.style.top = '20%'; // Move button to the vertical center
    button.style.left = '50%'; // Move button to the horizontal center
    button.style.transform = 'translate(-50%, -50%)'; // Center the button
    button.style.zIndex = '9999';
    button.addEventListener('click', processURLs);
    document.body.appendChild(button);

    // Function to open a URL in a new tab
    function openURLInNewTab(url) {
        const newTab = window.open('https://www.aliexpress.com/p/tracking/index.html?tradeOrderId=' + url, 'myTempTab');
        return newTab;
    }

    // Function to wait for page fully loaded
    function waitForLoadAndDelay(tab) {
        return new Promise(resolve => {
            tab.onload = () => setTimeout(resolve, 100);
        });
    }

    // Function to extract href source value from <a> element inside <span class="full-number">
    const extractHrefSourceValue = (spanElement) => {
        const aElement = spanElement.querySelector('a');
        return aElement ? aElement.getAttribute('href') : null;
    }

    // Function to extract text from <span class="full-number">
    function OLD_extractTextFromSpan(tab) {
        const spanElement = tab.document.querySelector('span.full-number');
        if (spanElement) {
            const hrefSourceValue = extractHrefSourceValue(spanElement);
            return hrefSourceValue;
        }
        return null;
    }

    // Function to extract text from span nested inside <div class="logistic-info--mailNo-pc--3cTqcXe">
    function extractTextFromSpan(tab) {
        const spanElement = tab.document.querySelector('span.logistic-info-v2--mailNoValue--X0fPzen');
        if (spanElement) {
            const trackingNumber = spanElement.textContent.trim();
            return trackingNumber;
        }
        return null;
    }

    // Function to close the tab
    function closeTab(tab) {
        tab.close();
    }

    // Function to extract track numbers
    function checkAndExtractHref(text) {
        const regex = /mailNoList=([A-Za-z0-9,]+)/;
        const match = text.match(regex);
        if (match && match[1]) {
            const mailNoList = match[1].split(',');
            return mailNoList;
        }
    }

    // Function to write text into clipboard
    async function writeClipboardText(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Text copied to clipboard:', text);
            })
            .catch(err => {
                console.error('Unable to copy text to clipboard:', err);
            });
    }

    // Simpre workaround to copy text
    function copyToClipboard(text) {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
    }

    // Function to copy text from textarea to clipboard
    function copyTextToClipboard() {
        const textarea = document.getElementById('trackingNumbers');
        if (textarea) {
            textarea.select();
            document.execCommand('copy');
            alert('Text copied to clipboard!');
        }
    }

    function pasteToTextarea(text) {
        // Find <div class="arrival-time-v2--title--e0sXWcA">
        let trackingTitleDiv = document.querySelector('.arrival-time-v2--title--e0sXWcA');
        if (!trackingTitleDiv) {
            trackingTitleDiv= document.querySelector('.error--title--Ar9UOn6');
        }
        if (trackingTitleDiv) {
            // Delete everything inside the div
            trackingTitleDiv.innerHTML = '';

            // Insert textarea inside the div
            const textareaHTML = '<textarea id="trackingNumbers" name="trackingNumbers" rows="30" cols="40" style="height: 240px;">' + text + '</textarea>';
            trackingTitleDiv.insertAdjacentHTML('beforeend', textareaHTML);

            // Insert button after textarea with Materialize CSS styling
            const buttonHTML = '<button id="copyButton" class="waves-effect waves-light btn">Copy Text</button>';
            trackingTitleDiv.insertAdjacentHTML('beforeend', buttonHTML);

            // Add event listener to the button
            const copyButton = document.getElementById('copyButton');
            if (copyButton) {
                copyButton.addEventListener('click', copyTextToClipboard);
            }
        }
    }


    // Function to insert Materialize CSS link into the head section
    function insertMaterializeCSSLink() {
        const head = document.querySelector('head');
        if (head) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css';
            head.appendChild(link);
        }
    }

    // Main function to process URLs
    async function processURLs() {


        var userInput = prompt("Please enter your order numbers separated by commas, spaces, or a new line:\nБудь ласка, введіть номери ваших замовлень через кому, пробіл або новий рядок:");
        if (!userInput) {
            console.log("User input is empty or canceled.");
            return;
        }
        var urls = userInput.split(/[\r\n\s,]+/);
        var trackNumbers = [];
        for (const url of urls) {
            const tab = openURLInNewTab(url);
            await waitForLoadAndDelay(tab);
            const trackValue = extractTextFromSpan(tab);
            closeTab(tab);
            if (trackValue) {
                console.log(trackValue);
                trackNumbers.push(trackValue);
            } else {
                trackNumbers.push("");
            }
        }
        pasteToTextarea(trackNumbers.join('\n'))
        // copyToClipboard(trackNumbers.join('\n'));
    }


})();

