// ==UserScript==
// @name         Shodan IP Extractor
// @namespace    https://github.com/dan098/shodanpuller
// @version      1.0
// @description  Extract and copy IP addresses from Shodan search results
// @author       Dan098
// @match        https://www.shodan.io/search*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503846/Shodan%20IP%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/503846/Shodan%20IP%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractIPsFromHostLinks() {
        const hostLinks = document.querySelectorAll('a[href^="/host/"]');
        const ips = Array.from(hostLinks).map(link => link.getAttribute('href').split('/').pop());
        return [...new Set(ips)].join('\n');
    }

    function copyIPs() {
        const ips = extractIPsFromHostLinks();
        if (ips) {
            GM_setClipboard(ips);
            alert('IP addresses extracted from host links copied to clipboard:\n\n' + ips);
        } else {
            alert('No IP addresses found in host links.');
        }
    }

    function goToNextPage() {
        const nextButton = document.querySelector('.pagination a.button:last-child');
        if (nextButton && nextButton.textContent.trim() === 'Next') {
            nextButton.click();
        } else {
            alert('No next page button found.');
        }
    }

    function copyAndGoNext() {
        copyIPs();
        setTimeout(goToNextPage, 500); // Delay to ensure the alert is shown before navigating
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.marginLeft = '10px';
        button.addEventListener('click', onClick);
        return button;
    }

    // Create and add buttons
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const copyButton = createButton('Copy IPs', copyIPs);
        const copyAndNextButton = createButton('Copy IPs & Next', copyAndGoNext);
        navbar.appendChild(copyButton);
        navbar.appendChild(copyAndNextButton);
    }
})();