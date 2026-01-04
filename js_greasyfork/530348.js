// ==UserScript==
// @name         VS Code Extension Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to download VS Code extensions directly from the marketplace.
// @author       You
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530348/VS%20Code%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/530348/VS%20Code%20Extension%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if it's an extension details page (basic check)
    if (!document.querySelector(".ux-item-name")) {
        return;
    }

    // Delay execution to allow page to load
    setTimeout(getExtensionInfoAndInsertButton, 1000); // 1-second delay

    function getExtensionInfoAndInsertButton() {
        const url = new URL(window.location.href);
        const identifier = url.searchParams.get('itemName');

        if (!identifier) {
            console.error("Could not find extension identifier in the URL.");
            return;
        }

        const publisher = identifier.split('.')[0];
        const extensionName = identifier.split('.')[1];

        // Extract version from the specified table cell (more robust selector)
        const versionElement = document.querySelector('td[role="definition"][aria-labelledby^="version"]');
        const version = versionElement ? versionElement.textContent.trim() : "";

        if (!version) {
            console.warn("Could not find extension version. Using an empty string.");
        }

        const extensionInfo = {
            version: version,
            publisher: publisher,
            extensionName: extensionName, // Store extension name separately
            identifier: identifier,
            getDownloadUrl: function() {
                return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${this.publisher}/vsextensions/${this.extensionName}/${this.version}/vspackage`;
            },
            getFileName: function() {
                return [this.identifier, "_", this.version, ".vsix"].join("");
            },
            getDownloadButton: function() {
                const button = document.createElement("a");
                button.innerHTML = "Download VSIX";
                button.href = "javascript:void(0);";
                button.style.fontFamily = "wf_segoe-ui,Helvetica Neue,Helvetica,Arial,Verdana";
                button.style.display = "inline-block";
                button.style.padding = "2px 5px";
                button.style.background = "darkgreen";
                button.style.color = "white";
                button.style.fontWeight = "bold";
                button.style.margin = "2px 5px";
                button.setAttribute("data-url", this.getDownloadUrl());
                button.setAttribute("data-filename", this.getFileName());
                button.onclick = function(event) {
                    event.preventDefault(); // Prevent the default action
                    const downloadUrl = this.getAttribute("data-url");
                    window.open(downloadUrl, '_blank'); // Open in a new tab
                };
                return button;
            }
        };

        const installButtonContainer = document.querySelector(".installButtonContainer");
        if (installButtonContainer) {
            installButtonContainer.parentNode.insertBefore(extensionInfo.getDownloadButton(), installButtonContainer);
        } else {
            console.error("Could not find install button container.");
        }
    }
})();