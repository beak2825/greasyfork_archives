// ==UserScript==
// @name         VSIX download button
// @namespace    http://tampermonkey.net/
// @version      2025-02-05
// @description  A simple user script to show vsix download button from vs-code extension marketplace. It will allow to download a file with .vsix
// @author       dnh2025
// @icon         https://www.google.com/s2/favicons?sz=64&domain=githubusercontent.com
// @match        https://marketplace.visualstudio.com/*
// @grant        none
// @sources      https://github.com/mjmirza/Download-VSIX-From-Visual-Studio-Market-Place/blob/main/downloadVSIX-V2.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525946/VSIX%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/525946/VSIX%20download%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /***
    // First Script: Extracts extension data and creates a download button
    ***/
    // Object to store extension data (version, publisher, identifier)
    const extensionData = {
        version: "",
        publisher: "",
        identifier: "",
        // Function to get the download URL for the VSIX file
        getDownloadUrl: function () {
            return `https://${this.identifier.split(".")[0]}.gallery.vsassets.io/_apis/public/gallery/publisher/${this.identifier.split(".")[0]}/extension/${this.identifier.split(".")[1]}/${this.version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;
        },
        // Function to get the filename for the downloaded VSIX file
        getFileName: function () {
            return `${this.identifier}_${this.version}.vsix`;
        },
        // Function to create the download button element
        getDownloadButton: function () {
            const button = document.createElement("a");
            button.className = 'vsix-download-button';
            button.innerHTML = "Download VSIX";
            button.style.fontFamily = "wf_segoe-ui,Helvetica Neue,Helvetica,Arial,Verdana";
            button.style.display = "inline-block";
            button.style.padding = "10px 20px"; // Increased padding for a bigger button
            button.style.background = "darkgreen";
            button.style.color = "white";
            button.style.fontWeight = "bold";
            button.style.fontSize = "16px"; // Increased font size
            button.style.margin = "2px 5px";
            button.style.textDecoration = "none"; // Remove default link underline

            // Store the download URL and filename in data attributes
            button.setAttribute("data-download-url", this.getDownloadUrl());
            button.setAttribute("data-download-filename", this.getFileName());

            // Event handler for when the button is clicked
            button.onclick = function (event) {
                
                const downloadUrl = event.target.getAttribute("data-download-url");
                const downloadFilename = event.target.getAttribute("data-download-filename");

                /**
                 * This will not correct filename on chrome (edge)
                 */
                // // Create a temporary link element
                // const link = document.createElement("a");
                // link.href = downloadUrl;
                // link.download = downloadFilename;

                // // Trigger the download
                // link.click();



                //force filename with xhr blob
                window.URL = window.URL || window.webkitURL;

                let xhr = new XMLHttpRequest(),
                    a = document.createElement('a'), file;

                xhr.open('GET', downloadUrl, true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    file = new Blob([xhr.response], { type: 'application/octet-stream' });
                    a.href = window.URL.createObjectURL(file);
                    a.download = downloadFilename;  // Set to whatever file name you want
                    // Now just click the link you created
                    // Note that you may have to append the a element to the body somewhere
                    // for this to work in Firefox
                    a.click();
                };
                xhr.send();
            };

            return button;
        }
    };

    const start = async () => {
        // Map to associate metadata table headers with extension data keys
        const metadataMap = {
            version: "version",
            publisher: "publisher",
            "unique-identifier": "identifier"
        };

        // Select all rows in the metadata table
        let metadataValues = document.querySelectorAll(".ux-table-metadata tr td[role='definition']");
        if (metadataValues.length === 0) { setTimeout(start, 500); return; }

        // Iterate through each row to extract extension data
        for (let i = 0; i < metadataValues.length; i++) {
            const cell = metadataValues[i];
            if (cell.getAttribute("aria-labelledby")) {
                const key = cell.getAttribute("aria-labelledby").trim();
                const value = cell.innerText.trim();
                if (metadataMap.hasOwnProperty(key)) {
                    extensionData[metadataMap[key]] = value;
                }
            }
        }

        // Find the element with the class ".ux-oneclick-install-button-container"
        const oneclickInstallButtonContainer = document.querySelector(".ux-oneclick-install-button-container");
        if (oneclickInstallButtonContainer) {
            // Append the download button to the parent element
            oneclickInstallButtonContainer.appendChild(extensionData.getDownloadButton());

            //có thể sẽ bị block bởi ads-blocker
            //thêm 1 setTimeout kiểm tra 1 lần sau 1s
            const checkLast = () => {
                if (!document.querySelector('.vsix-download-button')) {
                    setTimeout(checkLast, 1000);
                    document.querySelector(".ux-oneclick-install-button-container")?.appendChild(extensionData.getDownloadButton());
                };
            }
            setTimeout(checkLast, 1000);

        } else {
            console.error("Element with class 'ux-oneclick-install-button-container' not found.");
        }
    }
    start();
})();