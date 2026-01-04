// ==UserScript==
// @name         relacao de bens autocheck
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  marcar automaticamente a caixa de relação de bens no asiweb, definir formato TXT e inserir vírgula
// @author       ils94
// @match        https://asiweb.tre-rn.jus.br/asi/web?action=start&target=com.linkdata.corporativo.relatorios.web.AvailableReportsGateway&shadow=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499688/relacao%20de%20bens%20autocheck.user.js
// @updateURL https://update.greasyfork.org/scripts/499688/relacao%20de%20bens%20autocheck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let outerInterval;
    let attempts = 0;
    const maxAttempts = 60; // Stop after ~30 seconds (60 * 500ms)

    // Function to find elements by XPath in a document
    function findElementsByXPath(doc = document) {
        const checkboxXPath = "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/table/tbody/tr[51]/td[3]/input";
        const dropdownXPath = "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/table/tbody/tr[51]/td[4]/select[1]";
        const textboxXPath = "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/table/tbody/tr[51]/td[4]/input";

        let checkbox = doc.evaluate(checkboxXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let dropdown = doc.evaluate(dropdownXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let textbox = doc.evaluate(textboxXPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // Check iframes recursively
        const iframes = doc.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!checkbox) checkbox = iframeDoc.evaluate(checkboxXPath, iframeDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (!dropdown) dropdown = iframeDoc.evaluate(dropdownXPath, iframeDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (!textbox) textbox = iframeDoc.evaluate(textboxXPath, iframeDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                // Recursively check nested iframes
                const nested = findElementsByXPath(iframeDoc);
                if (!checkbox) checkbox = nested.checkbox;
                if (!dropdown) dropdown = nested.dropdown;
                if (!textbox) textbox = nested.textbox;
            } catch (e) {
                console.log('Error accessing iframe:', iframe.src, e);
            }
        }

        return { checkbox, dropdown, textbox };
    }

    // Function to perform actions
    function performActions() {
        attempts++;
        if (attempts > maxAttempts) {
            console.log('Max attempts reached. Stopping script.');
            clearInterval(outerInterval);
            return;
        }

        const { checkbox, dropdown, textbox } = findElementsByXPath();
        console.log('Attempt', attempts, 'Elements found:', { checkbox: !!checkbox, dropdown: !!dropdown, textbox: !!textbox });

        if (checkbox && dropdown) {
            console.log('Checkbox and dropdown found. Performing actions...');
            const actionInterval = setInterval(function() {
                let allDone = true;

                // Check the checkbox
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('Checkbox checked:', checkbox);
                    allDone = false;
                }

                // Set dropdown to TXT
                if (dropdown.value !== '.txt') {
                    dropdown.value = '.txt';
                    dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('Dropdown set to TXT:', dropdown);
                    allDone = false;
                }

                // Check for textbox (may appear after dropdown change)
                const updatedTextbox = findElementsByXPath().textbox;
                if (updatedTextbox && updatedTextbox.value !== ',') {
                    updatedTextbox.value = ',';
                    updatedTextbox.dispatchEvent(new Event('input', { bubbles: true }));
                    updatedTextbox.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('Comma inputted in textbox:', updatedTextbox);
                    allDone = false;
                } else if (!updatedTextbox) {
                    console.log('Textbox not yet available. Waiting...');
                    allDone = false;
                }

                // Stop if all actions are complete
                if (allDone && updatedTextbox) {
                    console.log('All actions completed successfully.');
                    clearInterval(actionInterval);
                    clearInterval(outerInterval);
                }
            }, 200);
        } else {
            console.log('Checkbox or dropdown not found. Retrying...');
        }
    }

    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(function(mutations) {
        console.log('DOM changed, checking for elements...');
        performActions();
    });

    // Observe the entire document
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Start the retry loop
    outerInterval = setInterval(performActions, 500);

    // Initial attempt
    performActions();
})();