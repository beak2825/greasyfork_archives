// ==UserScript==
// @name         Copy Building Details
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Add a button to copy Building Details to the clipboard.
// @author       Anton Grouchtchak
// @match        https://office.roofingsource.com/admin/BuildingView.php*
// @icon         https://office.roofingsource.com/images/roofing-source-logo.png
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478262/Copy%20Building%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/478262/Copy%20Building%20Details.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Fix button label typo
    $('#create-sc').button('option', {label: 'New Service Call'}); // eslint-disable-line no-undef

    // Show a message on the 'Copy' button
    const showButtonMessage = (message, icon) => {
        // copyButton is always initialized before this function is called, so it's okay to use it out of scope.

        // Update button label and icons
        $(copyButton).button('option', {label: message, icons: { primary: icon }}); // eslint-disable-line no-undef

        // Revert to the default button label and icons after 2 seconds
        setTimeout(() => {
            $(copyButton).button('option', {label: 'Copy Details', icons: { primary: 'ui-icon-copy' }}); // eslint-disable-line no-undef
        }, 2000);
    }

    // Copy the information to the clipboard using Clipboard API
    const copyToClipboard = () => {
        // Get the hyperlink HTML from the <a> tag or the plain text if it's only a <b> tag
        const buildingName = `${bTag.outerHTML}<br>`;

        // Plaintext option for clipboard preview and plaintext pasting
        const plainTextPreview = `${bTag.textContent.trim()}\n${nodes.slice(0, 3).map(node => node.textContent.trim()).join("\n")}`;
        const plainTextBlob = new Blob([plainTextPreview], { type: 'text/plain' });

        // Get and format the rest of the data nodes
        const remainingData = nodes.slice(0, 3).map((node, index) => {
            return `${node.textContent.trim()}<br>`; // Add line break to each node
        }).join("");

        // Create a blob from the complete HTML
        const htmlBlob = new Blob([buildingName, remainingData], { type: 'text/html' });

        // Copy the blob to the clipboard
        navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': plainTextBlob })]).then(
            () => {
                showButtonMessage('Copied!', 'ui-icon-check');
            },
            (err) => {
                showButtonMessage('Error!', 'ui-icon-closethick')
                console.error('Unable to copy the building details:', err);
            }
        );
    }

    // Create a button with jQuery UI style
    const createStyledButton = (text, icon, clickHandler) => {
        const button = document.createElement('button');

        $(button).button({ // eslint-disable-line no-undef
            icons: { primary: icon },
            label: text
        });

        button.addEventListener('click', clickHandler);
        return button;
    }

    const buildingInfo = document.querySelector('.rs-ui-content');
    const bTag = buildingInfo.querySelector('b');
    const br = document.createElement('br');
    const nodes = Array.from(bTag.parentElement.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

    // Create a 'Copy' button element dynamically
    const copyButton = createStyledButton('Copy Details', 'ui-icon-copy', copyToClipboard);

    // Prepend the 'Copy' button and two line breaks before the first element of the Building Info

    const firstBuildingChild = buildingInfo.firstChild;
    buildingInfo.insertBefore(copyButton, firstBuildingChild);
    buildingInfo.insertBefore(br.cloneNode(), firstBuildingChild);
    buildingInfo.insertBefore(br.cloneNode(), firstBuildingChild);
})();
