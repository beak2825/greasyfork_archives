// ==UserScript==
// @name         Go to specified page on PoE ladder site
// @namespace    PoeScripts
// @version      0.4
// @description  Adds an input box for going to a specified page on a Path of Exile ladder page.
// @author       TripleTroubl3
// @match        https://www.pathofexile.com/ladders/league/**
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/526751/Go%20to%20specified%20page%20on%20PoE%20ladder%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/526751/Go%20to%20specified%20page%20on%20PoE%20ladder%20site.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let debounceTimer;

    // Function to create or update the info box
    function createOrUpdateInfoBox(message, found) {
        let box = document.getElementById('dataGotopageBox');

        if (!box) {
            box = document.createElement('div');
            box.id = 'dataGotopageBox';
            box.style.position = 'fixed';
            box.style.top = '50px';
            box.style.left = '10px';
            box.style.backgroundColor = found ? '#ffeb3b' : '#f44336';
            box.style.color = '#000';
            box.style.padding = '10px';
            box.style.border = '2px solid #000';
            box.style.borderRadius = '5px';
            box.style.fontFamily = 'Arial, sans-serif';
            box.style.fontSize = '14px';
            box.style.zIndex = '9999';
            box.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
            document.body.appendChild(box);
        }

        box.style.backgroundColor = found ? '#ffeb3b' : '#f44336';
        box.innerText = message;
    }

    // Function to clone and modify a link
    function cloneAndModifyLink(link) {
        let inputBox = document.getElementById('newDataGoToPageInput');
        if (!inputBox) return; // If input box is missing, do nothing

        let newValue = inputBox.value.trim();
        if (!newValue) {
            alert("Please enter a new data-gotopage value!");
            return;
        }

        let clonedLink = link.cloneNode(true); // Clone the original link
        clonedLink.setAttribute('data-gotopage', newValue); // Modify the data-gotopage attribute
        clonedLink.style.border = "2px solid blue"; // Highlight created link
        clonedLink.innerText = " Go to " + newValue;

        link.parentNode.appendChild(clonedLink); // Append next to the original
    }

    // Function to add the input box next to the links container
    function addInputBox(linksContainer) {
        let existingInput = document.getElementById('newDataGoToPageInput');
        if (existingInput) return; // Avoid duplicates

        let inputContainer = document.createElement('div');
        inputContainer.style.marginLeft = '10px';
        inputContainer.style.display = 'inline-block';

        let inputBox = document.createElement('input');
        inputBox.id = 'newDataGoToPageInput';
        inputBox.type = 'text';
        inputBox.placeholder = 'Enter page number';
        inputBox.style.padding = '5px';
        inputBox.style.marginRight = '5px';

        let button = document.createElement('button');
        button.innerText = 'Create Link';
        button.style.padding = '5px';
        button.onclick = function() {
            let links = document.querySelectorAll('a[data-gotopage]');
            if (links.length > 0) {
                cloneAndModifyLink(links[0]); // Clone the first found link
            } else {
                alert("No links found to clone.");
            }
        };

        inputContainer.appendChild(inputBox);
        inputContainer.appendChild(button);
        linksContainer.parentNode.insertBefore(inputContainer, linksContainer.nextSibling); // Place input next to links
    }

    // Function to detect links and run the custom behavior
    function checkLinks() {
        let links = document.querySelectorAll('a[data-gotopage]');

        if (links.length > 0) {
            //createOrUpdateInfoBox(`✅ Found ${links.length} link(s) with data-gotopage`, true);
            //links.forEach(link => link.style.border = "2px solid red"); // Highlight links

            // Add input box next to the links container
            addInputBox(links[0].parentNode);
        } else {
            //createOrUpdateInfoBox("❌ No links with data-gotopage found", false);
        }
    }

    // Function to observe dynamic changes
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(checkLinks, 500); // Wait 500ms before checking again
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Fallback: Periodically re-check in case observer misses something
        setInterval(checkLinks, 10000); // Every 5 seconds
    }

    // Initialize on page load
    window.addEventListener('load', () => {
        checkLinks();
        observeDOMChanges();
    });

})();
