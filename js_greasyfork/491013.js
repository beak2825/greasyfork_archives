// ==UserScript==
// @name         Intercept Facebook Ads Library Requests
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Scrape Facebook ad data on the fly - with CSV export
// @author       BBAtech
// @match        https://*.facebook.com/ads/library/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491071/Intercept%20Facebook%20Ads%20Library%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/491071/Intercept%20Facebook%20Ads%20Library%20Requests.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Facebook Ad Interceptor] - Started');

    // Define a global variable to store the accumulated data
    var accumulatedData = [];
    var tableContainer;
    var table;
    var exportButton;

    // Function to create table and export button inside a styled div
    function createExportControls() {
        const exportDiv = document.createElement('div');
        exportDiv.style.zIndex = '200';
        exportDiv.style.position = 'fixed';
        exportDiv.style.top = '280px';
        exportDiv.style.right = '40px';
        exportDiv.style.backgroundColor = '#ffffff';
        exportDiv.style.padding = '10px';
        exportDiv.style.border = '1px solid #ccc';
        exportDiv.style.borderRadius = '5px';

        // Create table container
        tableContainer = document.createElement('div');
        tableContainer.style.height = '300px'; // Set the height as needed
        tableContainer.style.overflowY = 'scroll'; // Make it scrollable
        exportDiv.appendChild(tableContainer);

        // Create table
        table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        tableContainer.appendChild(table);

        // Create export button
        exportButton = document.createElement('button');
        updateExportButtonText(); // Update button text initially
        exportButton.style.width = '100%';
        exportButton.style.padding = '5px';
        exportButton.style.border = '1px solid #007bff';
        exportButton.style.backgroundColor = '#007bff';
        exportButton.style.color = '#fff';
        exportButton.style.cursor = 'pointer';
        exportButton.addEventListener('click', function() {
            const csvData = convertToCSV(accumulatedData);
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(-2)}-${("0" + now.getDate()).slice(-2)} ${("0" + now.getHours()).slice(-2)}-${("0" + now.getMinutes()).slice(-2)}-${("0" + now.getSeconds()).slice(-2)}`;
            const filename = `FB Ad Data _ ${timestamp}.csv`;
            downloadCSV(csvData, filename);
        });
        exportDiv.appendChild(exportButton);

        // Append export div to the body
        document.body.appendChild(exportDiv);
    }

    // Call function to create export controls
    createExportControls();

    // Listen for completed XMLHttpRequests
    window.addEventListener('load', function() {
        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {

                // Check if the request URL matches ad library results
                if (/(web|www)\.facebook\.com\/ads\/library\/async\/search_ads\//.test(this.responseURL)) {
                    console.log('[Facebook Ad Interceptor] - Intercepted search_ads response');
                    // Extract the search keyword
                    var responseURL = this.responseURL;
                    var url = new URL(responseURL);
                    var searchKeyword = url.searchParams.get("q");

                    var jsonString = this.responseText.substring(9); // Remove 'for (;;);'

                    // Parse JSON
                    try {
                        var jsonData = JSON.parse(jsonString);
                        processRequest(jsonData, searchKeyword);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                }

                // Check if the request URL matches graph results
                if (/(web|www)\.facebook\.com\/api\/graphql\/$/.test(this.responseURL)) {
                    console.log('[Facebook Ad Interceptor] - Intercepted graphql response');
                    // Extract the page name, website, category_name, and best_description from GraphQL response
                    try {
                        var jsonData = JSON.parse(this.responseText);
                        if (jsonData.data && jsonData.data.page) {
                            var page = jsonData.data.page;
                            var pageName = page.name;
                            var websites = page.websites;
                            var website = websites && websites.length > 0 ? websites[0] : null;
                            var category = page.category_name;
                            var pageURL = page.url;
                            var description = page.best_description && page.best_description.text;

                            // Add extracted data to accumulatedData
                            var existingDataIndex = accumulatedData.findIndex(item => item.pageURL === pageURL);
                            if (existingDataIndex !== -1) {
                                accumulatedData[existingDataIndex].category = category;
                                accumulatedData[existingDataIndex].website = website;
                                accumulatedData[existingDataIndex].description = description;
                            }
                        } else {
                            console.warn('Page data not found in GraphQL response.');
                        }
                    } catch (error) {
                        console.error('Error parsing GraphQL JSON:', error);
                    }
                }
            });
            open.apply(this, arguments);
        };
    });

    //Process the intercepted json data
    function processRequest(jsonData, searchKeyword) {
        // Check if payload exists and contains results
        if (jsonData.payload && Array.isArray(jsonData.payload.results) && jsonData.payload.results.length > 0) {
            console.log('[Facebook Ad Interceptor] - Processing Data');
            // Loop through results array
            jsonData.payload.results.forEach(function(result) {
                // Check if result array is not empty
                if (Array.isArray(result) && result.length > 0) {
                    // Extract pageName, pageURL, page_like_count, and title if they exist
                    var pageName = result[0].pageName || '';
                    var pageURL = result[0].snapshot?.page_profile_uri || '';
                    var pageLikes = result[0].snapshot?.page_like_count || '';
                    var title = result[0].snapshot?.title || '';
                    //Advanced way of looking for linkUrl
                    var linkUrl;
                    if (result[0].snapshot && result[0].snapshot.link_url) {
                        linkUrl = result[0].snapshot.link_url;
                    } else if (result[0].snapshot && result[0].snapshot.cards && result[0].snapshot.cards.length > 0) {
                        // If the link_url is not directly available, try to find it in cards
                        for (var i = 0; i < result[0].snapshot.cards.length; i++) {
                            if (result[0].snapshot.cards[i].link_url) {
                                linkUrl = result[0].snapshot.cards[i].link_url;
                                break;
                            }
                        }
                    }
                    var adBody = 'test'; //remove this
                    var linkDescription = 'test'; // remove this
                    var adUrl = 'https://web.facebook.com/ads/library/?id=' + result[0].adArchiveID || '';
                    // Check if the combination of pageURL and searchKeyword already exists in accumulatedData
                    var isDuplicate = accumulatedData.some(function(item) {
                        return item.pageURL === pageURL && item.searchKeyword === searchKeyword;
                    });
                    // If not a duplicate, create a new object with extracted data and push it into the global variable array
                    if (!isDuplicate) {
                        var extractedObject = {
                            searchKeyword: searchKeyword, // Change order here
                            pageName: pageName,
                            pageURL: pageURL,
                            pageLikes: pageLikes,
                            title: title,
                            linkUrl: linkUrl,
                            linkDescription: linkDescription, // Include link description field
                            adUrl: adUrl,
                            adBody: adBody,
                            category: '', // Initialize category field
                            website: '', // Initialize website field
                            description: '' // Initialize description field
                        };
                        accumulatedData.push(extractedObject);
                        updateExportButtonText(); // Update button text when new data is added
                    }
                }
            });
        }
        updateTable();
    }

// Function to update the table with accumulated data
function updateTable() {
    // Clear previous table content
    table.innerHTML = '';
    // Create table header row
    var headerRow = table.insertRow();
    ['Search Keyword', 'Page Name'].forEach(function(header) { // Adjusted headers
        var cell = headerRow.insertCell();
        cell.textContent = header;
        cell.style.fontWeight = 'bold';
        cell.style.borderBottom = '1px solid #ccc';
        cell.style.padding = '5px';
    });
    // Fill table with data
    accumulatedData.slice().reverse().forEach(function(item) { // Reverse the accumulatedData array
        var row = table.insertRow(); // Insert new row at the beginning of the table
        var keywordCell = row.insertCell();
        keywordCell.textContent = item.searchKeyword;
        keywordCell.style.padding = '5px';
        var nameCell = row.insertCell();
        nameCell.textContent = item.pageName;
        nameCell.style.padding = '5px';
    });
}




// Function to sanitize HTML content for CSV format
function sanitizeHTML(html) {
    // If html is null or undefined, return an empty string
    if (html === null || html === undefined) {
        return '';
    }
    // Replace double quotes with two double quotes and surround with double quotes
    return '"' + html.replace(/"/g, '""') + '"';
}

    // Function to convert data to CSV format
    function convertToCSV(data) {
        const header = ['Search Keyword', 'Page Name', 'Page URL', 'Page Website', 'Page Likes', 'Page Category', 'Page Description', 'Direct Ad URL', 'Ad Landing URL', 'Ad Title', 'Ad Link Description', 'Ad Body'].join(',');
        const rows = data.map(obj => {
            // Escape special characters in adBody and link description using sanitizeHTML function
            const adBody = sanitizeHTML(obj.adBody);
            const linkDescription = sanitizeHTML(obj.linkDescription || ''); // Include link description or empty string if it doesn't exist
            const category = sanitizeHTML(obj.category); // Include category
            const website = sanitizeHTML(obj.website); // Include website
            const description = sanitizeHTML(obj.description); // Include description
            return [obj.searchKeyword, obj.pageName, obj.pageURL, website, obj.pageLikes, category, description, obj.adUrl, obj.linkUrl, obj.title, obj.linkDescription, obj.adBody].join(',');
        });
        return header + '\n' + rows.join('\n');
    }

    // Function to download CSV file
    function downloadCSV(csvData, filename) {
        const blob = new Blob([csvData], {
            type: 'text/csv'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Function to update the export button text
    function updateExportButtonText() {
        if (exportButton) {
            exportButton.textContent = `Export as CSV (${accumulatedData.length} results)`;
        }
    }


     // Function to remove an element after a specified delay
    function removeElementAfterDelay(element) {
        setTimeout(() => {
            // Check if the element still has a parent node
            if (element.parentNode) {
                //console.log('Removing element:', element);
                element.parentNode.removeChild(element);
            }
        }, 1000); // Delay of 1 second
    }

   // Callback function to handle mutations
function mutationCallback(mutationsList, observer) {
    // Iterate through each mutation
    mutationsList.forEach(mutation => {
        // Check if nodes have been added
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Iterate through each added node
            mutation.addedNodes.forEach(node => {
                // Check if the node is a valid DOM element before proceeding
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Traverse the added node's descendants to find images and videos
                    const imageElements = node.querySelectorAll('img');
                    const videoElements = node.querySelectorAll('video');

                    // Remove images after a delay
                    imageElements.forEach(imageElement => {
                        removeElementAfterDelay(imageElement);
                    });

                    // Remove videos after a delay
                    videoElements.forEach(videoElement => {
                        removeElementAfterDelay(videoElement);
                    });
                }
            });
        }
    });
}


    // Initialize the MutationObserver
    const observer = new MutationObserver(mutationCallback);

    // Start observing the document body for childList changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });



})();
