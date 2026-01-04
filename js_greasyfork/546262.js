// ==UserScript==
// @name         PDF.js Direct Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to PDF.js viewers that saves the original PDF file
// @author       Anonymous
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546262/PDFjs%20Direct%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/546262/PDFjs%20Direct%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        // Check if PDF.js is available
        if (typeof PDFViewerApplication === "undefined" ||
            !PDFViewerApplication.pdfDocument) {
            return;
        }

        // Avoid duplicate buttons
        if (document.getElementById("tm-pdf-download-btn")) return;

        // Create button
        let btn = document.createElement("button");
        btn.id = "tm-pdf-download-btn";
        btn.textContent = "Download PDF";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.padding = "8px 12px";
        btn.style.background = "#007bff";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";

        btn.onclick = function() {
            PDFViewerApplication.pdfDocument.getData().then(function(data) {
                let blob = new Blob([data], { type: "application/pdf" });
                let url = URL.createObjectURL(blob);

                let a = document.createElement("a");
                a.href = url;
                a.download = "document.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        };

        document.body.appendChild(btn);
    }

    // Try adding button periodically (since PDF.js may load async)
    setInterval(addDownloadButton, 2000);
})();
