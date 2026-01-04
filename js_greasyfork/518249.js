// ==UserScript==
// @name         Avistaz+
// @version      1.0
// @description  Enhancements for Avistaz
// @author       Mio.
// @namespace    https://github.com/dear-clouds/mio-userscripts
// @supportURL   https://github.com/dear-clouds/mio-userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=avistaz.to
// @license      GPL-3.0
// @match        *://*.avistaz.to/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518249/Avistaz%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/518249/Avistaz%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const username = document.querySelector("a[href*='/profile/']").getAttribute('href').split('/').pop();
    const STORAGE_KEY_FULL_SCAN_COMPLETED = `avistaz+_${username}_full_scan_completed`;
    let stopFetching = false;
    
    // Function to simulate a click on the "Thank Uploader" button
    function clickThankButton(torrentId) {
        const thankButton = document.querySelector(`button#btn-torrent-thank[data-id='${torrentId}']`);
        if (thankButton) {
            thankButton.click();
            console.log("Thanked uploader for torrent ID: " + torrentId);
        }
    }
    
    // Function to delete full scan completed state from localStorage
    function resetFullScanState() {
        localStorage.removeItem(STORAGE_KEY_FULL_SCAN_COMPLETED);
        console.log("Full scan state has been reset. You can now retry a full scan.");
    }
    
    // Add a click event listener to each download link
    document.querySelectorAll("a.btn.btn-xs.btn-primary").forEach(downloadLink => {
        downloadLink.addEventListener("click", function(event) {
            const torrentIdMatch = this.href.match(/\/download\/torrent\/(\d+)/);
            if (torrentIdMatch && torrentIdMatch[1]) {
                const torrentId = torrentIdMatch[1];
                // Set a small timeout to ensure the "Thank Uploader" button is available
                setTimeout(() => {
                    clickThankButton(torrentId);
                }, 500);
            }
        });
    });

        // Function to bypass anon.to redirects
        function bypassAnonRedirects() {
            const allLinks = document.querySelectorAll('a');
    
            allLinks.forEach(link => {
                if (link.href.startsWith('https://anon.to/?')) {
                    const realURL = link.href.split('?')[1];
    
                    if (realURL) {
                        link.href = decodeURIComponent(realURL);
    
                        if (window.location.href.startsWith('https://anon.to/')) {
                            window.location.href = decodeURIComponent(realURL);
                        }
                    }
                }
            });
        }

        bypassAnonRedirects();
    
    // Function to gather all Hit & Run entries from history pages
    async function collectHitAndRuns() {
        let currentPage = 1;
        const collectedHitAndRuns = [];
        let isFullScan = false;
        
        const fullScanCompleted = localStorage.getItem(STORAGE_KEY_FULL_SCAN_COMPLETED) === 'true';
        let totalPages = null;
        
        const noHnrMessage = document.querySelector('.table-responsive h3');
        if (noHnrMessage) {
            noHnrMessage.innerHTML = '<div class="loading-icon"><i class="fa fa-spinner fa-spin"></i> Searching for Hit & Run torrents... <strong>(01/??)</strong></div>';
        } else {
            console.log("No 'No Hit & Run Torrents' message found, skipping Hit & Run collection.");
            return;
        }
        
        function updateProgress(current, total) {
            const loadingIcon = document.querySelector('.loading-icon');
            if (loadingIcon) {
                loadingIcon.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Searching for Hit & Run torrents... <strong>(${current}/${total})</strong>`;
            }
        }
        
        async function fetchPage(pageNumber) {
            if (stopFetching) {
                console.log(`Skipping page ${pageNumber} as stop condition was met.`);
                return;
            }
            
            console.log(`Fetching page ${pageNumber}`);
            try {
                const response = await fetch(`https://avistaz.to/profile/${username}/history?page=${pageNumber}`);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const hitAndRunRows = doc.querySelectorAll('tr');
                
                // Get total number of pages from pagination element
                if (totalPages === null) {
                    const pagination = doc.querySelector('ul.pagination');
                    if (pagination) {
                        const pageNumbers = Array.from(pagination.querySelectorAll('a[href*="?page="]'))
                        .map(link => parseInt(link.textContent.trim(), 10))
                        .filter(page => !isNaN(page));
                        if (pageNumbers.length > 0) {
                            totalPages = Math.max(...pageNumbers);
                            console.log(`Total pages detected: ${totalPages}`);
                        }
                    }
                    if (!totalPages) {
                        totalPages = 1; // Fallback if pagination is missing
                    }
                }
                
                for (const row of hitAndRunRows) {
                    if (stopFetching) {
                        console.log(`Stopping processing of rows on page ${pageNumber} because stop condition was met.`);
                        return;
                    }
                    
                    // Specifically select the "Added" column to find the date
                    const addedDateCell = row.querySelectorAll('td')[8];
                    if (addedDateCell) {
                        const addedDateElement = addedDateCell.querySelector('span[data-toggle="tooltip"]');
                        if (addedDateElement) {
                            const addedDateText = addedDateElement.textContent.trim().toLowerCase();
                            const originalTitleText = addedDateElement.getAttribute('data-original-title')?.toLowerCase().trim() || "";
                            // console.log(`Checking date text: "${addedDateText}" and data-original-title: "${originalTitleText}" on page: ${pageNumber}`);
                            
                            // Check if either the text content or the attribute contains "1 month"
                            if (fullScanCompleted && (addedDateText.includes("1 month") || originalTitleText.includes("1 month"))) {
                                stopFetching = true;
                                console.log(`Stopping fetch, found torrent added over a month ago on page: ${pageNumber}`);
                                removeLoadingIcon();
                                break;
                            }
                        }
                    }
                    if (row.classList.contains('danger')) {
                        collectedHitAndRuns.push(row.outerHTML);
                        updateHitAndRunTable(row);
                    }
                }
                
                if (!fullScanCompleted) {
                    isFullScan = true; // Indicate this is a full scan
                }
                
                updateProgress(pageNumber, totalPages);
                currentPage++;
            } catch (err) {
                console.error(`Error fetching history page ${pageNumber}: `, err);
            }
        }
        
        // Fetch pages in parallel but with proper stopping control
        async function fetchNextPages(startPage, pagesToFetch = 5) {
            if (stopFetching) {
                removeLoadingIcon();
                return;
            }
            
            const fetchPromises = [];
            for (let i = 0; i < pagesToFetch; i++) {
                if (startPage + i <= (totalPages ?? 1) && !stopFetching) {
                    fetchPromises.push(fetchPage(startPage + i));
                }
            }
            
            await Promise.all(fetchPromises);
            
            if (!stopFetching && currentPage <= totalPages) {
                console.log(`Finished batch, continuing from page ${currentPage}`);
                await fetchNextPages(currentPage, pagesToFetch);
            } else {
                if (isFullScan && !stopFetching) {
                    console.log("Reached the last page, updating cache as full scan completed.");
                    localStorage.setItem(STORAGE_KEY_FULL_SCAN_COMPLETED, 'true');
                }
                removeLoadingIcon();
            }
        }
        
        console.log(`Starting Hit & Run collection from page ${currentPage}`);
        await fetchNextPages(currentPage, 5);
    }
    
    // Function to update Hit & Run entries as they are found
    function updateHitAndRunTable(hitAndRunRow) {
        const tableContainer = document.querySelector('.table-responsive');
        if (tableContainer) {
            // Check if we need to replace the "No Hit & Run Torrents" message
            const noHnrMessage = tableContainer.querySelector('h3');
            if (noHnrMessage) {
                noHnrMessage.remove();
            }
            // If the table doesn't already exist, create it
            let table = tableContainer.querySelector('table');
            if (!table) {
                let tableHtml = '<table class="table table-bordered"><thead><tr><th>Type</th><th>Torrent</th><th>Download</th><th>Seeding</th><th>Completed</th><th>Uploaded</th><th>Downloaded</th><th>Ratio</th><th>Added</th><th>Updated</th><th>Seed Time</th><th>Hit & Run</th></tr></thead><tbody></tbody></table>';
                tableContainer.insertAdjacentHTML('beforeend', tableHtml);
            }
            const tableBody = tableContainer.querySelector('tbody');
            if (tableBody) {
                const newHitAndRunRow = document.createElement('tr');
                newHitAndRunRow.className = hitAndRunRow.className;
                newHitAndRunRow.innerHTML = hitAndRunRow.innerHTML;
                
                // Ensure the button triggers the original modal using PopAlert.warning
                const clearButton = newHitAndRunRow.querySelector('.btn_clear_hitnrun');
                if (clearButton) {
                    clearButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        
                        // Fetch the necessary data for PopAlert
                        const id = clearButton.getAttribute('data-id');
                        const hnrPoints = clearButton.getAttribute('data-hnr');
                        
                        if (typeof PopAlert !== 'undefined' && PopAlert.warning) {
                            PopAlert.warning(
                                `Clear this H&R for ${hnrPoints} BP?`,
                                `Are you sure, you want to clear this Hit & Run for ${hnrPoints} Bonus Points?`,
                                BASEURL + `/profile/${username}/hnr/clear`,
                                {
                                    id: id,
                                    action: "clear_hnr"
                                }
                            );
                        } else {
                            console.error("PopAlert is not defined. Cannot trigger modal.");
                        }
                    });
                    
                    if (typeof $ !== 'undefined' && $.fn.tooltip) {
                        $(clearButton).tooltip();
                    }
                    
                    const dataTitle = clearButton.getAttribute('data-title');
                    if (dataTitle) {
                        clearButton.setAttribute('title', dataTitle);
                    }
                }
                
                tableBody.appendChild(newHitAndRunRow);
                console.log(`Added a new Hit & Run entry to the table.`);
            }
            // Keep the loading message visible below the table while fetching
            if (!document.querySelector('.loading-icon')) {
                tableContainer.insertAdjacentHTML('beforeend', '<div class="loading-icon"><i class="fa fa-spinner fa-spin"></i> Searching for Hit & Run torrents... <strong>(${current}/${total})</strong> <small>(This will take a while the first time it runs. Just keep the tab open.)</small></div>');
            }
        }
    }
    
    // Function to remove the loading icon
    function removeLoadingIcon() {
        const loadingIcon = document.querySelector('.loading-icon');
        if (loadingIcon) {
            loadingIcon.remove();
            console.log("Removed loading icon after completing history search.");
        }
    }
    
    // Automatically collect Hit & Runs when navigating to the H&R page
    if (window.location.href.includes(`/profile/${username}/history?hnr=1`)) {
        const noHnrMessage = document.querySelector('.table-responsive h3');
        if (noHnrMessage && noHnrMessage.textContent.includes('No Hit & Run Torrents')) {
            console.log("Detected H&R history page with no existing H&R, starting Hit & Run collection.");
            collectHitAndRuns();
        } else {
            console.log("No 'No Hit & Run Torrents' message found, skipping Hit & Run collection.");
        }
    }
    
    else if (window.location.href.includes(`/torrent`)) {
        // Function to calculate the seeding time based on file size
        function seedingTimeInHours(sizeGB) {
            if (sizeGB <= 1) {
                return 72; // Minimum seeding time for sizes less than or equal to 1GB
            } else if (sizeGB < 50) {
                return 72 + 2 * sizeGB; // For sizes between 1GB and 50GB
            } else {
                return 100 * Math.log(sizeGB) - 219.2023; // For sizes greater than or equal to 50GB
            }
        }
        
        // Function to format hours into days, hours, and minutes
        function formatTime(hours) {
            const totalMinutes = Math.round(hours * 60);
            const days = Math.floor(totalMinutes / (24 * 60));
            const remainingMinutes = totalMinutes % (24 * 60);
            const hoursPart = Math.floor(remainingMinutes / 60);
            const minutesPart = remainingMinutes % 60;
            
            return `${days} days, ${hoursPart} hours, ${minutesPart} minutes`;
        }
        
        // Get the file size element from the page
        const fileSizeRow = document.evaluate(
            "//tr[td/strong[text()='File Size']]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        
        if (fileSizeRow) {
            const sizeText = fileSizeRow.children[1].textContent.trim();
            const sizeGB = parseFloat(sizeText.split(" ")[0]);
            
            if (!isNaN(sizeGB)) {
                // Calculate the required seeding time in hours
                const seedingTimeHours = seedingTimeInHours(sizeGB);
                
                // Format the seeding time into days, hours, and minutes
                const formattedTime = formatTime(seedingTimeHours);
                
                const seedingTimeContainer = document.createElement("span");
                seedingTimeContainer.style.fontWeight = "bold";
                seedingTimeContainer.style.marginLeft = "10px";
                
                const staticText = document.createElement("span");
                staticText.textContent = "(You need to seed this for ";
                
                // Have the formatted time with the class `text-green`
                const timeSpan = document.createElement("span");
                timeSpan.className = "text-green";
                timeSpan.textContent = formattedTime;
                
                const closingText = document.createElement("span");
                closingText.textContent = ")";
                
                seedingTimeContainer.appendChild(staticText);
                seedingTimeContainer.appendChild(timeSpan);
                seedingTimeContainer.appendChild(closingText);
                
                // Append the seeding time next to the file size
                fileSizeRow.children[1].appendChild(seedingTimeContainer);
            }
        }
    }
    
    // Adding manual reset functionality
    window.resetFullScanState = resetFullScanState;
})();
