// ==UserScript==
// @name         Fragment Fixer
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  GUI to filter through Fragment auctions
// @match        *://fragment.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499177/Fragment%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/499177/Fragment%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hiddenSubdomains = JSON.parse(localStorage.getItem('hiddenSubdomains') || '[]');
    let hiddenShitSubdomains = JSON.parse(localStorage.getItem('hiddenShitSubdomains') || '[]');

    // Function to create the GUI
    function createGUI() {
        const gui = document.createElement('div');
        gui.style.position = 'fixed';
        gui.style.top = '10px';
        gui.style.right = '10px';
        gui.style.backgroundColor = '#1a2026'; // Dark background color
        gui.style.color = '#ffffff'; // White font color
        gui.style.padding = '10px';
        gui.style.zIndex = '10000';
        gui.style.cursor = 'move';
        gui.style.width = '180px'; // Compact width
        gui.style.fontSize = '12px';
        gui.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        gui.style.border = 'none'; // Remove borders
        gui.id = 'draggableGui';

        const resaleCheckbox = createCheckbox('hideResale', 'Hide Resales');
        const commaCheckbox = createCheckbox('hideComma', 'Hide $1,000+');
        const shitCheckbox = createCheckbox('hideShit', 'Hide Shit');

        const credit = document.createElement('a'); // Changed to anchor element
        credit.href = 'https://t.me/poseidon'; // URL to redirect
        credit.innerText = 't.me/poseidon';
        credit.style.fontSize = '10px';
        credit.style.marginTop = '10px';
        credit.style.textAlign = 'center';
        credit.style.display = 'block'; // Make the anchor element block-level for easier clicking

        gui.appendChild(resaleCheckbox);
        gui.appendChild(commaCheckbox);
        gui.appendChild(shitCheckbox);
        gui.appendChild(credit); // Append anchor element to GUI

        document.body.appendChild(gui);

        makeDraggable(gui);
    }

    // Helper function to create checkbox with label
    function createCheckbox(id, label) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.style.marginRight = '5px'; // Add space between checkbox and text
        checkbox.addEventListener('change', hideRows);

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = id;
        checkboxLabel.innerText = label;

        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.marginBottom = '5px'; // Add margin bottom for separation
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);

        return checkboxContainer;
    }

    // Function to hide rows based on criteria
    function hideRows() {
        const hideResale = document.getElementById('hideResale')?.checked;
        const hideComma = document.getElementById('hideComma')?.checked;
        const hideShit = document.getElementById('hideShit')?.checked;

        let rows = document.querySelectorAll('tr.tm-row-selectable');
        rows.forEach(row => {
            let subdomain = row.querySelector('.subdomain') ? row.querySelector('.subdomain').innerText : '';
            let hide = false;

            if (hiddenSubdomains.includes(subdomain)) {
                hide = true;
            } else {
                if (hideResale && row.innerText.includes('Resale')) {
                    hide = true;
                }
                if (hideComma && row.innerText.includes(',')) {
                    hide = true;
                }
                if (hideShit && (subdomain.includes('_') || /\d/.test(subdomain))) {
                    hide = true;
                }
            }

            if (hide) {
                row.style.display = 'none';
            } else {
                row.style.display = ''; // Reset the display style if criteria do not match
                addHideButton(row); // Add hide button if not already hidden
            }
        });
    }

    // Function to add "Hide" button to a row
    function addHideButton(row) {
        const subdomainElement = row.querySelector('.subdomain');
        if (subdomainElement && !row.querySelector('.hide-button')) {
            const hideButton = document.createElement('button');
            hideButton.innerText = 'Hide';
            hideButton.className = 'hide-button';
            hideButton.style.marginLeft = '10px';
            hideButton.style.backgroundColor = '#1a2026';
            hideButton.style.color = '#ffffff';
            hideButton.style.border = '1px solid #1a2026';
            hideButton.style.cursor = 'pointer';
            hideButton.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default action
                event.stopPropagation(); // Stop the event from propagating
                const subdomain = subdomainElement.innerText;
                hiddenSubdomains.push(subdomain);
                localStorage.setItem('hiddenSubdomains', JSON.stringify(hiddenSubdomains));
                hideRows();
            });
            const descElement = row.querySelector('.table-cell-desc');
            if (descElement) {
                descElement.appendChild(hideButton);
            }
        }
    }

    // Function to make the GUI draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Initialize the GUI on page load
    window.addEventListener('load', () => {
        createGUI();
        hideRows();
    });

    // Re-apply hiding on DOM changes (e.g., AJAX content load)
    let observer = new MutationObserver(() => {
        hideRows();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
