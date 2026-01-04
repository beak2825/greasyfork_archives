// ==UserScript==
// @name         Download VSCode VSIX from Marketplace
// @namespace    https://ggorg.xyz/
// @version      1.0
// @description  Adds a download button to a VSCode's extension Marketplace page
// @author       GGORG
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526875/Download%20VSCode%20VSIX%20from%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/526875/Download%20VSCode%20VSIX%20from%20Marketplace.meta.js
// ==/UserScript==

// Some credit goes to https://github.com/mjmirza/Download-VSIX-From-Visual-Studio-Market-Place/blob/main/downloadVSIX-V2.js
// The above script is licensed under the MIT License (Copyright Mirza Iqbal), see https://github.com/mjmirza/Download-VSIX-From-Visual-Studio-Market-Place/tree/main?tab=readme-ov-file#license
// I have adapted their script to be a userscript, changed the button styling, fixed the download URL to download an actual .vsix file and rewritten the comments.

(function() {
    'use strict';

    // Helper function to wait until the page has fully finished loading
    function runWhenReady(func, callback) {
        let numAttempts = 0;
        function tryNow() {
            const elem = func();
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 20) {
                    console.warn('Giving up after 20 attempts.');
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        }
        tryNow();
    }

    runWhenReady(() => document.querySelector('.vscode-moreinformation'), (moreInfoElement) => {
        const extensionData = {
            version: "",
            identifier: "",
            getDownloadUrl: function() {
                return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${this.identifier.split(".")[0]}/vsextensions/${this.identifier.split(".")[1]}/${this.version}/vspackage`;
            },
            getFileName: function() {
                return `${this.identifier}-${this.version}.vsix`;
            },
            getDownloadButton: function() {
                const button = document.createElement("a");
                button.innerHTML = "Download VSIX";
                button.style.fontFamily = "wf_segoe-ui,Helvetica Neue,Helvetica,Arial,Verdana";
                button.style.display = "inline-block";
                button.style.padding = "8px 20px";
                button.style.background = "darkgreen";
                button.style.color = "white";
                button.style.fontWeight = "bold";
                button.style.fontSize = "12px";
                button.style.margin = "2px 10px";
                button.style.textDecoration = "none";

                button.setAttribute("data-download-url", this.getDownloadUrl());
                button.setAttribute("data-download-filename", this.getFileName());

                button.onclick = function(event) {
                    const downloadUrl = event.target.getAttribute("data-download-url");
                    const downloadFilename = event.target.getAttribute("data-download-filename");

                    // Creates a temporary link element (invisible) and clicks it to trigger the download
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = downloadFilename;

                    link.click();
                };

                return button;
            }
        };

        // Maps the rows in the metadata table to our object's properties
        const metadataMap = {
            Version: "version",
            "Unique Identifier": "identifier"
        };

        // Get the metadata table
        const metadataRows = document.querySelectorAll(".ux-table-metadata tr");

        // Extract extension data from the metadata table
        for (let i = 0; i < metadataRows.length; i++) {
            const row = metadataRows[i];
            const cells = row.querySelectorAll("td");
            if (cells.length === 2) {
                const key = cells[0].innerText.trim();
                const value = cells[1].innerText.trim();
                if (metadataMap.hasOwnProperty(key)) {
                    extensionData[metadataMap[key]] = value;
                }
            }
        }

        // Adds the download button
        moreInfoElement.parentElement.appendChild(extensionData.getDownloadButton());
    });
})();