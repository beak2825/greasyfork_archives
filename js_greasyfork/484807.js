// ==UserScript==
// @name         Send to Real-Debrid
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Add a button next to each magnet link to send it to Real-Debrid, with user-friendly API token setup and enhanced error handling
// @author       dlee2
// @license      MIT
// @match        *://*nyaa.si/*
// @match        *://*thepiratebay.*
// @match        *://*1337x.*
// @match        *://*rarbg.*
// @match        *://*yts.*
// @match        *://*eztv.*
// @match        *://*torrentz2.*
// @match        *://*zooqle.*
// @match        *://*limetorrents.*
// @match        *://*kickasstorrents.*
// @match        *://*torrentdownloads.*
// @match        *://*extratorrent.*
// @match        *://*torrentgalaxy.*
// @match        *://*magnetdl.*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/484807/Send%20to%20Real-Debrid.user.js
// @updateURL https://update.greasyfork.org/scripts/484807/Send%20to%20Real-Debrid.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function getApiToken() {
        let apiToken = GM_getValue('apiToken');
        if (!apiToken) {
            apiToken = prompt('Enter your Real-Debrid API token:', '');
            if (apiToken) {
                GM_setValue('apiToken', apiToken);
            } else {
                alert('No API token provided. Set it later by clicking a "Send to RD" button.');
                return null;
            }
        }
        return apiToken;
    }

    function handleApiError(response) {
        let errorMsg = 'Error occurred while sending request to Real-Debrid.';
        if (response.status === 401) {
            errorMsg = 'Invalid or expired API token.';
        } else if (response.status === 403) {
            errorMsg = 'Permission denied. Account might be locked.';
        }
        alert(errorMsg);
        console.error('Real-Debrid API Error:', response.status, response.responseText);
    }

    function sendToRealDebrid(magnetLink) {
        const API_TOKEN = getApiToken();
        if (!API_TOKEN) {
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.real-debrid.com/rest/1.0/torrents/addMagnet",
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "magnet=" + encodeURIComponent(magnetLink),
            onload: function (response) {
                if (response.status === 201) {
                    let torrentId = JSON.parse(response.responseText).id;
                    selectAllFiles(torrentId, API_TOKEN);
                } else {
                    handleApiError(response);
                }
            },
            onerror: function (response) {
                handleApiError(response);
            }
        });
    }

    function selectAllFiles(torrentId, apiToken) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`,
            headers: {
                "Authorization": `Bearer ${apiToken}`
            },
            data: "files=all",
            onload: function (response) {
                if (response.status === 204) {
                    alert("All files have been selected for download.");
                } else {
                    console.error('Error selecting files:', response.responseText);
                    alert("Failed to select files for download.");
                }
            },
            onerror: function (response) {
                console.error('Error sending request to select files:', response.responseText);
                alert("Error occurred while selecting files for download.");
            }
        });
    }

    function createSendButton(magnetLink) {
        let button = document.createElement('button');
        button.textContent = 'RD';
        button.style.marginLeft = '10px';
        button.addEventListener('click', function () {
            sendToRealDebrid(magnetLink);
        });
        return button;
    }

    function addSendButtons() {
        let magnetLinks = document.querySelectorAll('a[href^="magnet:"]');
        magnetLinks.forEach(link => {
            let sendButton = createSendButton(link.href);
            link.parentNode.insertBefore(sendButton, link.nextSibling);
        });
    }

    addSendButtons();
})();
