// ==UserScript==
// @name         HTML Table to Markdown/XWiki/CSV Converter
// @namespace    tungxd301
// @version      1.1
// @description  Convert HTML tables to Markdown/XWiki/CSV format
// @author       Tung Dinh
// @match        *://*/*
// @run-at       document-end
// @grant        GM_setClipboard
// @license      Tung Dinh
// @downloadURL https://update.greasyfork.org/scripts/476528/HTML%20Table%20to%20MarkdownXWikiCSV%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/476528/HTML%20Table%20to%20MarkdownXWikiCSV%20Converter.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Configuration options
    const config = {
        waitForDOMTimeout: 3000,
        toastDuration: 3000, // Duration of toast message display (in milliseconds)
        maxAllowedTotalPaginatedPages: 100,
        childList: true, // Watch for changes to the child nodes (elements added or removed)
        subtree: true,   // Watch for changes in the whole subtree, not just the immediate children
    };

    const a = document.querySelector('[href*="&page="]');

    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';

    // Create the loading circle element
    const loadingCircle = document.createElement('div');
    loadingCircle.id = 'loading-circle';
    loadingContainer.appendChild(loadingCircle);

    // Create the loading progress element
    const loadingProgress = document.createElement('div');
    loadingProgress.id = 'loading-progress';
    loadingContainer.appendChild(loadingProgress);

    // Function to convert an HTML table to Markdown
    function tableToMarkdown(table) {
        let markdown = '|';

        // Iterate through table headers
        table.querySelectorAll('th').forEach(header => {
            markdown += header.textContent.trim() + '|';
        });

        markdown += '\n|';

        // Add line separator below headers
        table.querySelectorAll('th').forEach(() => {
            markdown += ' --- |';
        });

        // Iterate through table rows
        table.querySelectorAll('tr').forEach(row => {
            row.querySelectorAll('td').forEach(cell => {
                markdown += cell.textContent.trim() + '|';
            });
            markdown += '\n|';
        });

        return markdown.slice(0, -1);
    }

    // Function to convert an HTML table to XWiki syntax
    function tableToXWiki(table) {
        let xwikiSyntax = '';

        // Iterate through table rows
        table.querySelectorAll('tr').forEach(row => {
            row.querySelectorAll('th, td').forEach(cell => {
                // Determine cell type (header or data)
                const cellType = cell.tagName === 'TH' ? 'th' : 'td';

                // Append cell content to XWiki syntax with proper formatting
                xwikiSyntax += `|${cell.textContent.trim()}`;
                if (cellType === 'th') {
                    xwikiSyntax += ' (header)';
                }
            });

            // Add a new row
            xwikiSyntax += '\n';
        });

        return xwikiSyntax.trim();
    }

    // Function to convert an HTML table to CSV format
    function tableToCSV(table) {
        const rows = table.querySelectorAll('tr');
        let csv = '';

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i].querySelectorAll('th, td');
            for (let j = 0; j < row.length; j++) {
                csv += '"' + row[j].textContent.trim() + '"';
                if (j < row.length - 1) {
                    csv += ',';
                }
            }
            csv += '\n';
        }

        return csv;
    }

    // Function to initiate the download
    function downloadCSV(table, tableIndex) {
        const csvContent = tableToCSV(table);
        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `table_${tableIndex}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }

    async function downloadCSVAllPages(tableIndex) {
        showToast("Downloading CSV...Hang tight!");

        let page = 1;
        let mergedTable = document.createElement('table');
        let currentTables = await fetchTableAllPages(page);
        while (page < config.maxAllowedTotalPaginatedPages
        && currentTables != null
        && currentTables.length > 0
        && currentTables.length <= tableIndex + 1) {
            updateLoadingProgress(page);

            let table = currentTables[tableIndex];
            // Loop through each row in the table
            var rows = table.querySelectorAll('tr');
            rows.forEach(function (row, rowIndex) {
                // Clone the row from the original table
                var clonedRow = row.cloneNode(true);

                // If it's not the first table, and it's the first row (header row), skip it
                if (page > 1 && rowIndex === 0) {
                    return;
                }

                // Append the cloned row to the merged table
                mergedTable.appendChild(clonedRow);
            });
            currentTables = await fetchTableAllPages(++page);
        }
        downloadCSV(mergedTable, tableIndex);

        loadingContainer.remove();
    }

    async function fetchTableAllPages(page) {
        let splitPage = a.href.split('page=') || '';
        let pagePart = splitPage[1];
        let basePage = getFirstDigits(pagePart);
        let targetPagePart = pagePart.replace(basePage, page);
        let url = splitPage[0] + 'page=' + targetPagePart;
        return await fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                return doc.querySelectorAll('table');
            })
            .catch(error => {
                return [];
            });
    }

    function getFirstDigits(inputString) {
        const firstDigits = inputString.match(/\d+/);

        if (firstDigits !== null) {
            return firstDigits[0];
        } else {
            return -1;
        }
    }

    // Function to display a toast message
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, config.toastDuration); // Display for 3 seconds
    }

    // Function to update the loading indicator with data points
    function updateLoadingProgress(dataPointsLoaded) {
        loadingProgress.textContent = `Downloading page ${dataPointsLoaded}`;
    }

    // Function to copy all tables to clipboard
    function copyAllTablesToClipboard() {
        let clipboard = '';
        let allMarkdown = '';
        let allXWiki = '';

        // Find and process all HTML tables on the page
        document.querySelectorAll('table').forEach((table, tableIndex) => {
            downloadCSV(table, tableIndex);
            const markdown = tableToMarkdown(table);
            allMarkdown += markdown + '\n---\n'; // Add a separator between tables
            const xwiki = tableToXWiki(table);
            allXWiki += xwiki + '\n----\n'; // Add a separator between tables
        });

        clipboard += 'Markdown Tables: \n\n' + allMarkdown + '\n';
        clipboard += 'XWiki Tables: \n\n' + allXWiki + '\n';

        GM_setClipboard(clipboard);

        // Display a toast notification
        showToast('Markdown/XWiki table copied to clipboard!');
    }


    // Add a keyboard shortcut to copy all tables (e.g., Ctrl + Shift + C)
    window.addEventListener('keydown', event => {
        if (event.ctrlKey && event.shiftKey && event.key === 'C') {
            copyAllTablesToClipboard();
            event.preventDefault();
        }
    });

    // Create a Mutation Observer to watch for changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        // Check if the tables you're looking for are now available in the DOM
        if (document.querySelectorAll('table').length > 0) {
            // Disconnect the observer to stop watching for changes
            observer.disconnect();

            setTimeout(() => {
                processTables();
            }, config.waitForDOMTimeout);
        }
    });

    // Start observing changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    function processTables() {
        // Find and process all HTML tables on the page
        document.querySelectorAll('table').forEach((table, tableIndex) => {
            const computedStyle = window.getComputedStyle(table);
            if (computedStyle.display === 'none') {
                return;
            }

            const markdown = tableToMarkdown(table);
            const xwiki = tableToXWiki(table);

            // Create a markdown button element
            const markdownButton = document.createElement('button');
            markdownButton.className = 'clipboard-button'; // Add a CSS class for styling
            markdownButton.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i> Copy Markdown Table to Clipboard';

            // Create a xwiki button element
            const xwikiButton = document.createElement('button');
            xwikiButton.className = 'clipboard-button'; // Add a CSS class for styling
            xwikiButton.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i> Copy XWiki Table to Clipboard';

            // Create a csv button element
            const csvButton = document.createElement('button');
            csvButton.className = 'clipboard-button'; // Add a CSS class for styling
            csvButton.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i> Download CSV';

            // Create a csv button element
            const csvAllButton = document.createElement('button');
            csvAllButton.className = 'clipboard-button'; // Add a CSS class for styling
            csvAllButton.innerHTML = '<i class="fa fa-clipboard" aria-hidden="true"></i> Download CSV All Pages';

            // Add a click event listener to the button
            markdownButton.addEventListener('click', () => {
                GM_setClipboard(markdown);
                showToast('Markdown table copied to clipboard!');
            });

            // Add a click event listener to the button
            xwikiButton.addEventListener('click', () => {
                GM_setClipboard(xwiki);
                showToast('XWiki table copied to clipboard!');
            });

            // Add a click event listener to the button
            csvButton.addEventListener('click', () => {
                if (table) {
                    downloadCSV(table, tableIndex);
                } else {
                    showToast('No table found on this page.');
                }
            });

            // Add a click event listener to the button
            csvAllButton.addEventListener('click', () => {
                if (table) {
                    document.body.appendChild(loadingContainer);
                    downloadCSVAllPages(tableIndex);
                } else {
                    showToast('No table found on this page.');
                }
            });

            // Append the button under the table
            const container = document.createElement('div');
            container.appendChild(markdownButton);
            container.appendChild(xwikiButton);
            container.appendChild(csvButton);
            if (a != null) {
                container.appendChild(csvAllButton);
            }
            table.parentNode.insertBefore(container, table.nextSibling);
        });
    }

    // Add custom CSS styles for your UI elements (customize as needed)
    const styles = `
    .markdown-table-container {
        margin-bottom: 20px;
        border: 1px solid #ccc;
        padding: 10px;
    }

    .clipboard-button {
        display: inline-block;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
        margin-top: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .clipboard-button:hover {
        background-color: #0056b3; /* Hover background color */
        color: #fff; /* Hover text color */
    }


    .clipboard-button i {
        margin-right: 5px;
    }

    #loading-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    #loading-circle {
        border: 4px solid transparent;
        border-top: 4px solid #007BFF; /* Loading circle color */
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }
    
    #loading-progress {
        font-size: 12px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
        
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #333;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 9999;
    }`;
    // Create a <style> element and add the custom styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
})();
