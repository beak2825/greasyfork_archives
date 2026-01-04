// ==UserScript==
// @name         [New] GitHub Downloads Counter
// @namespace    https://greasyfork.org/users/1162863
// @version      1.0
// @description  Counts the total downloads of all published releases in a Search Result and in Repository view.
// @author       Andrewblood
// @match        *://*.github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @license      Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/511315/%5BNew%5D%20GitHub%20Downloads%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/511315/%5BNew%5D%20GitHub%20Downloads%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Here your Access Token if you have one
    const accessToken = ''; // 'ghp_your_access_token_here'

    setTimeout(function() {
        getRepoDownloads();
        processSearchResults();
    }, 1000 * 3);

    // Funktion zum Abrufen der Downloads über die GitHub API
    function getDownloads(repoPath, callback) {
        const apiUrl = `https://api.github.com/repos/${repoPath}/releases`;
        let totalDownloads = 0;

        // API-Anfrage senden
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            headers: accessToken ? { 'Authorization': `token ${accessToken}` } : {}, // Token hinzufügen, falls vorhanden
            onload: function(res) {
                if (res.status === 200) {
                    const releases = JSON.parse(res.responseText);

                    // Downloads zählen
                    releases.forEach(release => {
                        release.assets.forEach(asset => {
                            totalDownloads += asset.download_count || 0; // Zähle die Downloads
                        });
                    });

                    // Rückgabe der Gesamtzahl der Downloads
                    callback(totalDownloads);
                } else {
                    console.error(`Error fetching downloads: ${res.status}`); // Fehlermeldung
                    callback(0); // Rückgabe 0 bei Fehler
                }
            }
        });
    }

    // Funktion zum Anzeigen der Gesamtzahl der Downloads für jedes Repository
    function displayTotalDownloads(repoElement, total) {
        const totalElement = document.createElement('div');
        totalElement.textContent = `Total Downloads: ${total}`; // Anzeige der Gesamtzahl
        totalElement.style.marginTop = '5px';
        totalElement.style.fontWeight = 'bold';
        repoElement.appendChild(totalElement);
    }

    // Funktion zum Verarbeiten der Suchergebnisse
    function processSearchResults() {
        const repoElements = document.querySelectorAll('.Box-sc-g0xbh4-0.iwUbcA');
        repoElements.forEach(repo => {
            const repoLink = repo.querySelector('.prc-Link-Link-85e08'); // Link zum Repository
            if (repoLink) {
                const repoPath = repoLink.href.replace('https://github.com/', ''); // Repository-Pfad

                // Downloads abrufen und anzeigen
                getDownloads(repoPath, function(totalDownloads) {
                    displayTotalDownloads(repo, totalDownloads); // Gesamtzahl anzeigen
                });
            }
        });
    }

    // Funktion zum Abrufen der Downloads über die GitHub API
    function getRepoDownloads() {
        const header = document.querySelector('#repo-title-component');
        const repoPath = window.location.pathname.replace('/releases', '');
        const apiUrl = `https://api.github.com/repos${repoPath}/releases`;
        let totalDownloads = 0;
        if (header) {

            // API-Anfrage senden
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function(res) {
                    if (res.status === 200) {
                        const releases = JSON.parse(res.responseText);

                        // Downloads zählen
                        releases.forEach(release => {
                            release.assets.forEach(asset => {
                                totalDownloads += asset.download_count || 0; // Zähle die Downloads
                            });
                        });

                        const totalElement = document.createElement('div');
                        totalElement.textContent = `Total Downloads: ${totalDownloads}`; // Anzeige der Gesamtzahl
                        totalElement.style.marginLeft = '10px';
                        header.appendChild(totalElement);
                    } else {
                        console.error(`Error: ${res.status}`);
                    }
                }
            });
        }
    }

})();