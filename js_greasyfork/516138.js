// ==UserScript==
// @name         NZ Wine Directory Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrape and consolidate winery contact details across multiple pages into a single CSV output
// @author       The Label Room
// @match        https://www.nzwine.com/en/winery-directory/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516138/NZ%20Wine%20Directory%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/516138/NZ%20Wine%20Directory%20Scraper.meta.js
// ==/UserScript==
/*
* INSTRUCTIONS:
* Visit https://www.nzwine.com/en/winery-directory/?page=1
* Then turn on the script in the Tampermonkey extension options, and refresh the page.
* It will visit each page in succession, and when finished it will download the resulting CSV file.
* Please turn off the script when complete, otherwise it will reactivate upon refreshing the page.
*/
(function () {
    // Retrieve stored data or initialize if not present
    let wineriesData = JSON.parse(localStorage.getItem('wineriesData')) || [];
    let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
    const totalPages = getTotalPages();

    // Function to fetch the total number of pages
    function getTotalPages() {
        const paginationDropdown = document.querySelector('.c-pagination__mobile-dropdown');
        if (paginationDropdown) {
            return paginationDropdown.options.length;
        }
        const paginationLinks = document.querySelectorAll('.c-pagination__number a');
        return paginationLinks.length ? parseInt(paginationLinks[paginationLinks.length - 1].textContent, 10) : 1;
    }

    // Function to fetch the details of each winery
    async function fetchWineryDetails(url) {
        const response = await fetch(url);
        const html = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const website = tempDiv.querySelector('.c-winery-contacts__website-link')?.href || 'N/A';
        const phone = tempDiv.querySelector('.c-winery-contacts__item-content--large')?.innerText.trim() || 'N/A';
        const email = tempDiv.querySelector('a[type="email"]')?.innerText.trim() || 'N/A';

        return { website, phone, email };
    }

    // Function to scrape winery links on the page
    async function scrapePage() {
        const wineryLinks = document.querySelectorAll('.c-winery-directory__item-content a.item-title');
        for (const link of wineryLinks) {
            const wineryUrl = link.href;
            const details = await fetchWineryDetails(wineryUrl);
            wineriesData.push({
                name: link.textContent.trim(),
                url: wineryUrl,
                ...details
            });
        }

        // Save the updated data to localStorage
        localStorage.setItem('wineriesData', JSON.stringify(wineriesData));

        // Check if there's another page to visit
        if (currentPage < totalPages) {
            currentPage++;
            localStorage.setItem('currentPage', currentPage);
            const nextPageLink = document.querySelector(`.c-pagination__mobile-dropdown option[value*="page=${currentPage}"]`);
            if (nextPageLink) {
                setTimeout(() => {
                    window.location.href = nextPageLink.value; // Navigate to the next page
                }, 2000); // Add delay for navigating to the next page
            }
        } else {
            // Output data as CSV after all pages have been scraped
            downloadCSV();
            // Clear the stored data
            localStorage.removeItem('wineriesData');
            localStorage.removeItem('currentPage');
        }
    }

    // Function to generate CSV and download
    function downloadCSV() {
        const csvHeader = 'Name,URL,Website,Phone,Email\n';
        const csvRows = wineriesData
            .map(winery => `${winery.name},"${winery.url}","${winery.website}","${winery.phone}","${winery.email}"`)
            .join('\n');

        const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'wineries_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Start the script
    scrapePage();
})();
