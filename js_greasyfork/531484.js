// ==UserScript==
// @name         Directly download Wikiloc GPX files
// @namespace    https://www.wikiloc.com/
// @version      2025-04-01
// @description  This is a script that helps you directly download GPX file from WikiLoc.
// @author       WikiLoc
// @match        *://*.wikiloc.com/*
// @icon         https://sc.wklcdn.com/favicon.ico
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531484/Directly%20download%20Wikiloc%20GPX%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/531484/Directly%20download%20Wikiloc%20GPX%20files.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractIdFromUrl(url) {
        // Check if the URL contains "download.do?id="
        if (url && url.includes('download.do?id=')) {
            // Use regex to extract the ID
            const match = url.match(/download\.do\?id=(\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }

    // Function to initiate download with the extracted ID
    function initiateDownload(id) {

        /*
          POST TO: /wikiloc/downloadToFile.do
          id: 163518627
          event: download
          format: gpx
          selFormat: gpx
          filter: simplified500
        */

        console.log('Initiating download for ID:', id);

        // Create form data for the POST request
        const formData = new FormData();
        formData.append('id', id);
        formData.append('event', 'download');
        formData.append('format', 'gpx');
        formData.append('selFormat', 'gpx');
        formData.append('filter', 'simplified500');

        // Get the base URL to ensure we're posting to the correct domain
        const baseUrl = window.location.origin;
        const downloadUrl = `${baseUrl}/wikiloc/downloadToFile.do`;

        console.log('Sending POST request to:', downloadUrl);

        // Make the POST request
        fetch(downloadUrl, {
            method: 'POST',
            body: formData,
            credentials: 'include' // Include cookies for authentication
        })
        .then(response => {
            if (response.ok) {
                console.log('Download request successful');
                // For file downloads, we need to handle the response as a blob
                return response.blob();
            } else {
                throw new Error('Download request failed with status: ' + response.status);
            }
        })
        .then(blob => {
            // Create a download link for the blob
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            // Try to get filename from Content-Disposition header, or use a default
            const filename = `wikiloc_track_${id}.gpx`;
            a.download = filename;

            // Append to the document, click it, and clean up
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            console.log('Download initiated for file:', filename);
        })
        .catch(error => {
            console.error('Error during download:', error);
            alert('Download failed: ' + error.message);
        });
    }

    $(document).on('click', '.btn-download', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const url = $(this).attr('href');

        if (url) {
            const id = extractIdFromUrl(url);
            if (id) {
                console.log('Wikiloc Download ID:', id);
                initiateDownload(id);
            }
        }
    });

})();