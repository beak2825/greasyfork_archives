// ==UserScript==
// @name         Open Launchpad Kernel SRU Verification Bugs
// @namespace    http://anthonywong.net/
// @version      1.2
// @description  Adds a button to open verification bugs in new windows on Launchpad bug pages, excluding the current bug ID
// @author       Grok
// @match        https://bugs.launchpad.net/kernel-sru-workflow/+bug/*
// @grant        GM_openInTab
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/533200/Open%20Launchpad%20Kernel%20SRU%20Verification%20Bugs.user.js
// @updateURL https://update.greasyfork.org/scripts/533200/Open%20Launchpad%20Kernel%20SRU%20Verification%20Bugs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script started');

    // Extract current bug ID from URL
    const url = window.location.href;
    const urlRegex = /\+bug\/(\d+)/;
    const urlMatch = url.match(urlRegex);
    const currentBugId = urlMatch ? urlMatch[1] : null;
    console.log('Current bug ID from URL:', currentBugId);

    // Find the div with class yui3-editable_text-text
    const div = document.querySelector('div.yui3-editable_text-text');
    if (!div) {
        console.log('No div with class yui3-editable_text-text found');
        return;
    }
    console.log('Found div with class yui3-editable_text-text');

    // Find the p element inside the div
    const pElements = div.getElementsByTagName('p');
    console.log(`Found ${pElements.length} p elements in div`);

    let targetP;
    let bugNumbers = [];

    // Iterate through p elements to find the one with verification-bugs
    for (let p of pElements) {
        if (p.textContent.includes('verification-bugs')) {
            console.log('Found verification-bugs in p element');
            console.log('P element content (first 200 chars):', p.textContent.substring(0, 200));
            targetP = p;
            // Extract bug numbers using regex
            const bugsRegex = /verification-bugs:\s*\[([\d,\s]*)\]/;
            const match = p.textContent.match(bugsRegex);
            if (match && match[1]) {
                bugNumbers = match[1].split(',').map(num => num.trim()).filter(num => num);
                console.log('Extracted bug numbers:', bugNumbers);
            } else {
                console.log('No bug numbers matched in regex');
            }
            break;
        }
    }

    if (!targetP) {
        console.log('No p element with verification-bugs found in div');
        return;
    }

    if (bugNumbers.length === 0) {
        console.log('No bug numbers extracted');
        return;
    }

    // Check if button already exists
    const existingButtons = div.querySelectorAll('button');
    for (let btn of existingButtons) {
        if (btn.textContent === 'Open bugs in new window') {
            console.log('Button already exists, skipping');
            return;
        }
    }

    // Create button
    console.log('Creating button');
    const button = document.createElement('button');
    button.textContent = 'Open bugs in new window';
    button.style.marginLeft = '10px';
    button.style.cursor = 'pointer';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.display = 'inline-block';
    button.style.verticalAlign = 'middle';

    // Add click event listener, excluding current bug ID
    button.addEventListener('click', () => {
        console.log('Button clicked, processing bug numbers:', bugNumbers);
        const filteredBugNumbers = bugNumbers.filter(num => num !== currentBugId);
        console.log('Filtered bug numbers (excluding current bug ID):', filteredBugNumbers);
        filteredBugNumbers.forEach(bugNumber => {
            const url = `http://launchpad.net/bugs/${bugNumber}`;
            console.log(`Opening tab for bug ${bugNumber}: ${url}`);
            GM_openInTab(url, { active: false });
        });
    });

    // Insert button inline after verification-bugs line
    console.log('Modifying p element to insert button');
    const innerHTML = targetP.innerHTML;
    // Log a snippet of innerHTML around verification-bugs for debugging
    const verificationIndex = innerHTML.toLowerCase().indexOf('verification-<wbr>bugs');
    if (verificationIndex !== -1) {
        const snippetStart = Math.max(0, verificationIndex - 100);
        const snippetEnd = verificationIndex + 200;
        console.log('innerHTML snippet around verification-bugs:', innerHTML.substring(snippetStart, snippetEnd));
    } else {
        console.log('verification-bugs not found in innerHTML');
    }

    // Find the verification-bugs text node (search for 'verification-' due to <wbr>)
    const textNodes = document.evaluate(
        ".//text()[contains(., 'verification-')]",
        targetP,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    if (textNodes.snapshotLength > 0) {
        console.log(`Found ${textNodes.snapshotLength} text nodes containing 'verification-'`);
        const verificationNode = textNodes.snapshotItem(0);
        let currentNode = verificationNode;
        let foundBracket = false;

        // Traverse until we find the closing ]
        while (currentNode && !foundBracket) {
            if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.includes(']')) {
                foundBracket = true;
                // Split the text node at ]
                const textContent = currentNode.textContent;
                const bracketIndex = textContent.indexOf(']');
                if (bracketIndex !== -1) {
                    const beforeBracket = textContent.substring(0, bracketIndex + 1);
                    const afterBracket = textContent.substring(bracketIndex + 1);
                    currentNode.textContent = beforeBracket;
                    if (afterBracket) {
                        const newTextNode = document.createTextNode(afterBracket);
                        currentNode.parentNode.insertBefore(newTextNode, currentNode.nextSibling);
                    }
                    // Insert button after the ]
                    console.log('Inserting button after closing ] of bug list');
                    currentNode.parentNode.insertBefore(button, currentNode.nextSibling);
                }
            }
            currentNode = currentNode.nextSibling;
        }

        if (!foundBracket) {
            console.log('No closing ] found, appending to p');
            targetP.appendChild(button);
        }
    } else {
        console.log('No verification- text node found, appending button after p');
        targetP.insertAdjacentElement('afterend', button);
    }

    console.log('Button insertion complete');
})();