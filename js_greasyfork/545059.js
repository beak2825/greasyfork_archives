// ==UserScript==
// @name         Geoguessr Location Downloader
// @namespace    https://greasyfork.org/en/users/1501889
// @version      13.12
// @description  saves location data and makes it downloadable in the result screen
// @author       Clemens
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/545059/Geoguessr%20Location%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545059/Geoguessr%20Location%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let roundData = [];

    function getCompactTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    }

    function updateDownloadButton() {
        const button = document.getElementById('geoguessr-downloader-button');
        const countBadge = document.getElementById('geoguessr-downloader-badge');
        if (button && countBadge) {
            if (roundData.length > 0) {
                button.style.display = 'flex';
                countBadge.textContent = `${roundData.length}`;
            } else {
                button.style.display = 'none';
            }
        }
    }

    function exportAndClearData() {
        if (roundData.length === 0) {
            console.log('No round data available to export.');
            return;
        }

        const jsonData = JSON.stringify(roundData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `geoguessr_locations_${getCompactTimestamp()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('Round data exported and cleared.');
        roundData = [];
        updateDownloadButton();
    }

    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (method.toUpperCase() === 'POST' &&
                (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
                 url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

                this.addEventListener('load', function () {
                    try {
                        const interceptedResult = this.responseText;
                        const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                        const match = interceptedResult.match(pattern);

                        if (match && match.length > 0) {
                            const split = match[0].split(",");
                            const lat = Number.parseFloat(split[0]);
                            const lng = Number.parseFloat(split[1]);

                            const isDuplicate = roundData.some(round => round.lat === lat && round.lng === lng);
                            if (!isDuplicate) {
                                roundData.push({ lat, lng });
                                console.log(`Round ${roundData.length} recorded:`, { lat, lng });
                                updateDownloadButton();
                            }
                        }
                    } catch (e) {
                        console.error('Error processing intercepted response:', e);
                    }
                });
            }
            return originalOpen.apply(this, arguments);
        };
    }

    function manageDownloadButton() {
        const finalResultWrapper = document.querySelector('.standard-final-result_wrapper__MoXZL');
        const existingContainer = document.getElementById('geoguessr-downloader-container');

        if (finalResultWrapper) {
            if (roundData.length > 0 && !existingContainer) {
                const downloadContainer = document.createElement('div');
                downloadContainer.id = 'geoguessr-downloader-container';
                downloadContainer.classList.add('standard-final-result_linkWrapper__gC96Q');

                const downloadButton = document.createElement('button');
                downloadButton.id = 'geoguessr-downloader-button';
                downloadButton.type = 'button';
                downloadButton.classList.add('button_button__aR6_e', 'button_variantTertiary__y_oa3', 'button_sizeRound__rmHiD');
                downloadButton.style.display = 'flex';

                const wrapperDiv = document.createElement('div');
                wrapperDiv.classList.add('button_wrapper__zayJ3');

                wrapperDiv.innerHTML = `
                    <span class="button_icon__qFeMJ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </span>
                `;

                const countBadge = document.createElement('div');
                countBadge.id = 'geoguessr-downloader-badge';
                countBadge.textContent = `${roundData.length}`;
                countBadge.style.position = 'absolute';
                countBadge.style.bottom = '-5px';
                countBadge.style.right = '-5px';
                countBadge.style.backgroundColor = '#f76a51';
                countBadge.style.color = '#fff';
                countBadge.style.borderRadius = '50%';
                countBadge.style.padding = '2px 6px';
                countBadge.style.fontSize = '12px';
                countBadge.style.border = '2px solid #333149';
                countBadge.style.boxSizing = 'content-box';

                downloadButton.appendChild(wrapperDiv);
                downloadContainer.appendChild(downloadButton);
                downloadButton.style.position = 'relative';
                downloadButton.appendChild(countBadge);

                const labelP = document.createElement('p');
                labelP.id = 'geoguessr-downloader-label';
                labelP.classList.add('standard-final-result_label__kHtVM', 'standard-final-result_indicatorLabel__K3TAF');
                labelP.textContent = 'Download';

                downloadContainer.appendChild(labelP);

                downloadButton.addEventListener('click', () => {
                    exportAndClearData();
                    downloadContainer.remove();
                });

                const exitButtonContainer = document.querySelector('.standard-final-result_linkWrapper__gC96Q:last-child');
                if (exitButtonContainer) {
                     exitButtonContainer.parentNode.insertBefore(downloadContainer, exitButtonContainer);
                } else {
                    finalResultWrapper.appendChild(downloadContainer);
                }

            } else if (existingContainer) {
                updateDownloadButton();
            }
        } else if (!finalResultWrapper && existingContainer) {
            existingContainer.remove();
        }
    }

    window.addEventListener('load', () => {
        interceptXHR();
        setInterval(manageDownloadButton, 5);
        console.log('GeoGuessr Game Data Extractor (Manual Download) script loaded.');
    });

})();