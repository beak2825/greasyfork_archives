// ==UserScript==
// @name         Datanodes Auto Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Datanodes Auto Downloader by Games4u
// @author       Games4u.Org
// @match        https://datanodes.to/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://datanodes.to&size=64
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499266/Datanodes%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/499266/Datanodes%20Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to initiate the download and close the tab
    function initiateDownloadAndCloseTab() {
        // Find the first submit button and click it immediately
        var firstButton = document.querySelector('button[type="submit"]');
        if (firstButton) {
            firstButton.click();
            console.log("First button clicked immediately");

            // Wait briefly to ensure DOM updates (adjust if necessary)
            setTimeout(function() {
                var form = document.createElement('form');
                form.name = "F1";
                form.method = "POST";
                form.className = "m-0";
                form.action = "";

                // Extract the file ID dynamically from the hidden input
                var fileIdInput = document.querySelector('input[name="id"]');
                var fileId = fileIdInput ? fileIdInput.value : "";

                // Extract the file name dynamically from the hidden input
                var fileNameInput = document.querySelector('input[name="fname"]');
                var fileName = fileNameInput ? fileNameInput.value : "";

                form.innerHTML = `
                    <input type="hidden" name="op" value="download2">
                    <input type="hidden" name="id" value="${fileId}">
                    <input type="hidden" name="rand">
                    <input type="hidden" name="referer" value="">
                    <input type="hidden" name="method_free" value="Free Download >>">
                    <input type="hidden" name="method_premium">
                    <div class="flex gap-3" style="display: none;">
                        <button type="button" class="px-3 py-2.5 font-semibold bg-blue-500 rounded-lg text-white text-xs hover:text-white hover:bg-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
                            </svg>
                        </button>
                    </div>
                    <button type="submit" class="py-3 relative shadow px-6 hover:opacity-90 rounded-lg bg-white text-sm font-medium text-blue-600 w-full flex items-center justify-between">
                        Continue
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"></path>
                        </svg>
                    </button>
                `;

                // Replace existing button with new form
                var firstButtonParent = firstButton.parentElement;
                firstButtonParent.replaceWith(form);

                // Submit the form after a brief delay to ensure DOM updates
                setTimeout(function() {
                    form.submit();
                    console.log("Form submitted immediately");

                    // Close the tab after a short delay (adjust as needed)
                    setTimeout(function() {
                        window.close();
                        console.log("Tab closed");
                    }, 2000); // Close tab after 2 seconds (adjust as needed)
                }, 500); // Submit form after 0.5 seconds (adjust as needed)
            }, 200); // Replace button with form after 0.2 seconds (adjust as needed)
        } else {
            console.log("First button not found, proceeding to the next step...");
            // Implement logic to proceed to the next step if needed
        }
    }

    // Execute the function
    initiateDownloadAndCloseTab();
})();
