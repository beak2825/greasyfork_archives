// ==UserScript==
// @name         Modify Page Number and Size
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add controls to modify pageNo and pageSize in URL query
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526484/Modify%20Page%20Number%20and%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/526484/Modify%20Page%20Number%20and%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the URL
    function updateURL(pageNo, pageSize) {
        let url = new URL(window.location.href);
        url.searchParams.set('pageNo', pageNo);
        url.searchParams.set('pageSize', pageSize);
        window.history.replaceState(null, null, url.toString()); // Update URL without reloading
    }

    // Get initial values from URL or set defaults
    let url = new URL(window.location.href);
    let initialPageNo = parseInt(url.searchParams.get('pageNo')) || 1; // Default to 1
    let initialPageSize = parseInt(url.searchParams.get('pageSize')) || 10; // Default to 10

    // Create controls
    let controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: white;
        padding: 10px;
        border: 1px solid #ccc;
        z-index: 9999; // Ensure it's on top
    `;

    let pageNoLabel = document.createElement('label');
    pageNoLabel.textContent = 'Page No: ';
    let pageNoInput = document.createElement('input');
    pageNoInput.type = 'number';
    pageNoInput.value = initialPageNo;
    pageNoInput.min = 1; // Minimum page number
    pageNoInput.style.cssText = 'width: 50px; margin-right: 10px;';

    let pageSizeLabel = document.createElement('label');
    pageSizeLabel.textContent = 'Page Size: ';
    let pageSizeInput = document.createElement('input');
    pageSizeInput.type = 'number';
    pageSizeInput.value = initialPageSize;
    pageSizeInput.min = 1; // Minimum page size
    pageSizeInput.style.cssText = 'width: 50px;';

    let updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.style.cssText = 'margin-left: 10px;';

    // Event listener for the update button
    updateButton.addEventListener('click', function() {
        let newPageNo = parseInt(pageNoInput.value) || 1;
        let newPageSize = parseInt(pageSizeInput.value) || 10;
        updateURL(newPageNo, newPageSize);
    });

    // Append controls to the page
    controlsDiv.appendChild(pageNoLabel);
    controlsDiv.appendChild(pageNoInput);
    controlsDiv.appendChild(pageSizeLabel);
    controlsDiv.appendChild(pageSizeInput);
    controlsDiv.appendChild(updateButton);
    document.body.appendChild(controlsDiv);


    // Optional: Update input fields if URL changes (e.g., by clicking a link)
    window.addEventListener('popstate', function(event) {
        url = new URL(window.location.href);
        let newPageNo = parseInt(url.searchParams.get('pageNo')) || 1;
        let newPageSize = parseInt(url.searchParams.get('pageSize')) || 10;
        pageNoInput.value = newPageNo;
        pageSizeInput.value = newPageSize;
    });

})();