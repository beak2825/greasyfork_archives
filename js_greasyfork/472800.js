// ==UserScript==
// @name         Bulk download all the PDFs
// @namespace    DWizzy:download-pdfs
// @author       DWizzy
// @license      https://www.gnu.org/licenses/gpl-3.0.en.html
// @description  Adds an "Export PDFs" button to pages with multiple PDF links for bulk download.
// @match        *://*/*
// @grant        GM_download
// @grant        GM_addStyle
// @version 0.0.1.20230809193614
// @downloadURL https://update.greasyfork.org/scripts/472800/Bulk%20download%20all%20the%20PDFs.user.js
// @updateURL https://update.greasyfork.org/scripts/472800/Bulk%20download%20all%20the%20PDFs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for the button
    GM_addStyle(`
        #pdfExportButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    `);

    // Check if the page has any PDF links
    function hasPDFLinks() {
        const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
        return pdfLinks.length > 1;
    }

    // Create a zip file containing all PDF links
    async function exportPDFs() {
        const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');
        const zip = new JSZip();

        for (const link of pdfLinks) {
            const filename = link.href.split('/').pop();
            const response = await fetch(link.href);
            const blob = await response.blob();
            zip.file(filename, blob);
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        GM_download({
            blob: blob,
            name: 'ExportedPDFs.zip'
        });
    }

    // Add the "Export PDFs" button if multiple PDF links are present
    if (hasPDFLinks()) {
        const exportButton = document.createElement('button');
        exportButton.id = 'pdfExportButton';
        exportButton.textContent = 'Export PDFs';
        exportButton.setAttribute('role', 'button');
        exportButton.setAttribute('aria-label', 'Export PDFs');
        exportButton.addEventListener('click', exportPDFs);

        document.body.appendChild(exportButton);
    }
})();