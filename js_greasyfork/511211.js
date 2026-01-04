// ==UserScript==
// @name         Synchroniser KD Tools avec Pilotest…
// @namespace    http://tampermonkey.net/
// @version      20241104
// @description  Synchronise les résultats Pilotest avec KD Tools (kd.valentin.xyz).
// @author       valentindotxyz
// @match        https://kd.valentin.xyz/suivi/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_log
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511211/Synchroniser%20KD%20Tools%20avec%20Pilotest%E2%80%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/511211/Synchroniser%20KD%20Tools%20avec%20Pilotest%E2%80%A6.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Configuration
    const downloadLinkSelector = '#btn-download-pilotest-csv';

    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.style.position = 'fixed';
    messageElement.style.bottom = '10px';
    messageElement.style.right = '10px';
    messageElement.style.padding = '6px 12px';
    messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    messageElement.style.color = 'white';
    messageElement.style.borderRadius = '4px';
    messageElement.style.zIndex = '9999';
    document.body.appendChild(messageElement);

    // Function to update the message
    function updateMessage(text) {
        messageElement.textContent = text;
    }

    // Function to remove the message
    function removeMessage() {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
    }

    // Click the download link
    function clickDownloadLink() {
        const downloadLink = document.querySelector(downloadLinkSelector);
        if (downloadLink) {
            updateMessage('Synchronisation en cours…');
            const downloadUrl = downloadLink.href;
            downloadFile(downloadUrl);
        } else {
            updateMessage('Lien de téléchargement non trouvé !');
        }
    }

    // Download the file using GM_xmlhttpRequest
    function downloadFile(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    const blob = response.response;

                    if (!blob.type.includes("text/csv")) {
                        updateMessage('Non connecté à Pilotest !');

                        return setTimeout(() => {
                            GM_openInTab("https://www.pilotest.com/fr/users/sign_in", {active: true});
                            removeMessage();
                        }, 1500)
                    }

                    const file = new File([blob], 'downloaded-file', { type: blob.type });
                    uploadFile(file, "#csvFile");
                } else {
                    updateMessage('Échec de téléchargement !');
                    console.error('Failed to download file', response.status, response.statusText);
                }
            },
            onerror: function(error) {
                console.error('Error during file download', error);
            }
        });
    }

    function readResultsFromPilotest() {
        updateMessage('Synchronisation en cours…');

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.pilotest.com/fr/results',
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                const resStructureDiv = doc.querySelector('#data-structure');

                if (resStructureDiv && resStructureDiv.getAttribute('data-structure')) {
                    const dataStructure = resStructureDiv.getAttribute('data-structure');
                    const dataStructureJson = JSON.parse(dataStructure);

                    const resResultsDiv = doc.querySelector('#data-results');

                    if (resResultsDiv && resResultsDiv.getAttribute('data-results')) {
                        // Get the content of the data-results attribute
                        const dataResults = resResultsDiv.getAttribute('data-results');
                        const dataResultsJson = JSON.parse(dataResults).map(row => ({ ...row, test_name: dataStructureJson[row.test_id].fr.content }));

                        const file = new File([new Blob([JSON.stringify(dataResultsJson)], { type: "application/json" })], 'downloaded-json', { type: "application/json" });
                        uploadFile(file, "#jsonFile");
                    } else {
                        console.log('Could not find results.');
                    }

                } else {
                    console.log('Could not find data structure.');
                }
            },
            onerror: function() {
                console.log('Error occurred while making the request.');
            }
        });
    }

    // Upload the file by setting it to the file input element
    function uploadFile(file, selector) {
        const fileInput = document.querySelector(selector);
        if (fileInput) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            updateMessage('Synchronisation terminée !');
            setTimeout(removeMessage, 3000);

            // Trigger any change events on the file input element
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        } else {
            updateMessage('Échec d\'envoi !');
            console.error('File input element not found');
        }
    }

    // clickDownloadLink();
    readResultsFromPilotest();
})();