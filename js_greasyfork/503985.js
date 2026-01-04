// ==UserScript==
// @name         Koharu Artist Page Opener
// @namespace    https://koharu.to/
// @version      1.0
// @license      MIT
// @description  Open artist pages in new tabs with a control panel
// @author       viatana35
// @match        https://koharu.to/artists*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503985/Koharu%20Artist%20Page%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/503985/Koharu%20Artist%20Page%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentPage = 1;
    let maxPagesToOpen = 0;
    let artistLinks = [];

    // Function to open artist pages in new tabs
    function openArtistPages() {
        const linksToOpen = artistLinks.slice((currentPage - 1) * maxPagesToOpen, currentPage * maxPagesToOpen);
        linksToOpen.forEach(link => {
            window.open(link, '_blank');
        });
    }

    // Function to handle the "Begin Treatment" button click
    function handleBeginTreatment() {
        maxPagesToOpen = parseInt(maxPagesInput.value, 10);
        if (maxPagesToOpen > 0) {
            beginTreatmentButton.disabled = true;
            continueTreatmentButton.disabled = false;
            openArtistPages();
        }
    }

    // Function to handle the "Continue Treatment" button click
    function handleContinueTreatment() {
        currentPage++;
        openArtistPages();
        if (currentPage * maxPagesToOpen >= artistLinks.length) {
            continueTreatmentButton.disabled = true;
        }
    }

    // Create the control panel
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'sticky';
    controlPanel.style.top = '0';
    controlPanel.style.backgroundColor = '#f1f1f1';
    controlPanel.style.padding = '10px';
    controlPanel.style.zIndex = 1000;
    controlPanel.style.display = 'flex';
    controlPanel.style.justifyContent = 'center';
    controlPanel.style.alignItems = 'center';
    document.body.prepend(controlPanel);

    // Create the input field for the maximum number of pages to open simultaneously
    const maxPagesInput = document.createElement('input');
    maxPagesInput.type = 'number';
    maxPagesInput.min = '1';
    maxPagesInput.placeholder = 'Max pages to open';
    controlPanel.appendChild(maxPagesInput);

    // Create the "Begin Treatment" button
    const beginTreatmentButton = document.createElement('button');
    beginTreatmentButton.textContent = 'Begin Treatment';
    beginTreatmentButton.style.margin = '0 10px';
    beginTreatmentButton.style.padding = '10px';
    beginTreatmentButton.style.backgroundColor = '#4CAF50';
    beginTreatmentButton.style.color = 'white';
    beginTreatmentButton.style.border = 'none';
    beginTreatmentButton.style.cursor = 'pointer';
    beginTreatmentButton.onclick = handleBeginTreatment;
    controlPanel.appendChild(beginTreatmentButton);

    // Create the "Continue Treatment" button
    const continueTreatmentButton = document.createElement('button');
    continueTreatmentButton.textContent = 'Continue Treatment';
    continueTreatmentButton.style.margin = '0 10px';
    continueTreatmentButton.style.padding = '10px';
    continueTreatmentButton.style.backgroundColor = '#2196F3';
    continueTreatmentButton.style.color = 'white';
    continueTreatmentButton.style.border = 'none';
    continueTreatmentButton.style.cursor = 'pointer';
    continueTreatmentButton.disabled = true;
    continueTreatmentButton.onclick = handleContinueTreatment;
    controlPanel.appendChild(continueTreatmentButton);

    // Get all the artist links on the page
    window.onload = () => {
        const artistLinkElements = document.querySelectorAll('main.flex.flex-col.grow section#tags main.grid a');
        artistLinks = Array.from(artistLinkElements).map(link => link.href);
    };

})();
