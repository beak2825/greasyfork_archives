// ==UserScript==
// @name         Copy Voucher Codes
// @namespace    Violentmonkey Scripts
// @match        https://*.ictcloud.network/static/printVoucher.html*
// @version      1.0
// @author       plaxor
// @license      GNU GPLv3
// @description  Copy voucher codes to clipboard from a webpage
// @downloadURL https://update.greasyfork.org/scripts/527305/Copy%20Voucher%20Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/527305/Copy%20Voucher%20Codes.meta.js
// ==/UserScript==

// Function to copy text to clipboard using Clipboard API
function copyToClipboard() {

    // Select all elements with class 'voucher'
    let vouchers = document.querySelectorAll('.voucher');

    // Array to store extracted codes
    let codesWithStatuses = [];

    // Iterate through each voucher element
    vouchers.forEach(voucher => {
        // Extract code from each voucher
        let code = voucher.querySelector('.code').textContent.trim();
        // Extract status from each voucher and remove "Valid for"
        let statusText = voucher.querySelector('.status').textContent.trim();
        let statusMatch = statusText.match(/Valid for (\d+)h/);
        let status = statusMatch ? statusMatch[1] : '';
        // Combine code and status separated by a tab character and add to the array
        codesWithStatuses.push(`${code}\t${status}`);
    });

    navigator.clipboard.writeText(codesWithStatuses.join('\n'))
        .then(() => {
            console.log('Codes copied to clipboard:', codesWithStatuses.join('\n'));
        })
        .catch(err => {
            console.error('Failed to copy codes:', err);
        });
}

// Use a button click to copy the text to clipboard
let copyButton = document.createElement('button');
copyButton.textContent = 'Copy Clipboard';
copyButton.style.marginTop = '10px';
copyButton.addEventListener('click', () => {
    copyToClipboard();
});

// Append button to the document body or specific element
document.body.appendChild(copyButton);
