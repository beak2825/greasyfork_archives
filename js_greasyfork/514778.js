// ==UserScript==
// @name         GEM Auto-Download Printouts
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Automatically downloads the raw HTML of the GEM pairings printout pages.
// @author       Dan Collins <dcollins@batwing.tech>
// @website      https://github.com/dcollinsn/gem-tampermonkey
// @match        https://gem.fabtcg.com/gem/*/run/*/print/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fabtcg.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514778/GEM%20Auto-Download%20Printouts.user.js
// @updateURL https://update.greasyfork.org/scripts/514778/GEM%20Auto-Download%20Printouts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize the filename by removing invalid characters
    function sanitizeFilename(filename) {
        // Replace invalid characters with underscores
        return filename.replace(/[\s\\/:*?"<>|]/g, '_');
    }

    // Find the name of the printout. This is the title of the first
    // page of the download, which may not be super accurate for
    // multi-print setups, but it will have at least the event name and
    // hopefully the round number.
    const tdElement = document.querySelector('h2');

    let tournamentName = tdElement.textContent.trim();
    tournamentName = sanitizeFilename(tournamentName);
    const timestamp = new Date().toISOString().replace(/[:]/g, "-");
    const filename = `${tournamentName}-${timestamp}.html`;

    // Get the raw HTML content of the page
    const htmlContent = document.documentElement.outerHTML;

    // Create a Blob from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;

    // Set the download attribute with the filename
    link.download = filename;

    // Create and click a link to execute the attachment download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
})();