// ==UserScript==
// @name         Email Scraper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Scrape emails across multiple pages and save to CSV
// @match        https://solicitors.lawsociety.org.uk/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530988/Email%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/530988/Email%20Scraper.meta.js
// ==/UserScript==

// Install this in Tampermonkey by clicking [https://gist.githubusercontent.com/MarwanShehata/34acd0b3d2a4431cf8a93c9d3cdf2d41/raw/3050c898be3f8fc651eaeaca3e982cee1a84642f/Email-Scraper-gig.js] 
// or copying the code from [https://gist.github.com/MarwanShehata/34acd0b3d2a4431cf8a93c9d3cdf2d41].

// https://solicitors.lawsociety.org.uk/search/results?Pro=False&Page=1

(function() {
    'use strict';

    const DELAY_BETWEEN_PAGES = 6000;
    const MAX_PAGES = 80; // Upper limit to prevent infinite loops

    // Helper functions
    function getEmails() {
        const dataEmailsArray = document.querySelectorAll("a[data-email]");
        return [...dataEmailsArray].map(element => element.getAttribute('data-email'));
    }

    function getStoredEmails() {
        return GM_getValue('emails', []);
    }

    function setStoredEmails(emails) {
        GM_setValue('emails', emails);
    }

    function getCurrentPage() {
        return GM_getValue('currentPage', 1);
    }

    function setCurrentPage(page) {
        GM_setValue('currentPage', page);
    }

    function saveToCSV(emails) {
        const csvContent = "data:text/csv;charset=utf-8," + emails.map(email => `"${email}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "extracted_emails.csv");

        const button = document.createElement("div");
        button.innerHTML = "Download Extracted Emails";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.left = "50%";
        button.style.transform = "translateX(-50%)";
        button.style.backgroundColor = "green";
        button.style.color = "white";
        button.style.padding = "10px 20px";
        button.style.zIndex = "9999";
        button.style.cursor = "pointer";

        button.addEventListener("click", () => {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.body.removeChild(button);
            // Reset storage after download
            GM_setValue('emails', []);
            GM_setValue('currentPage', 1);
        });

        document.body.appendChild(button);
        console.log(`Total emails extracted: ${emails.length}`);
    }

    // Main logic
    function scrapePage() {
        let currentPage = getCurrentPage();
        let allEmails = getStoredEmails();

        if (currentPage > MAX_PAGES) {
            console.log('Reached max pages, stopping.');
            saveToCSV(allEmails);
            return;
        }

        // Scrape current page
        const newEmails = getEmails();
        allEmails = [...new Set([...allEmails, ...newEmails])]; // Remove duplicates
        setStoredEmails(allEmails);
        console.log(`Page ${currentPage}: Extracted ${newEmails.length} emails, Total: ${allEmails.length}`);

        // Check for next page
        const nextPage = document.querySelector('li.next>a');
        if (nextPage && currentPage < MAX_PAGES) {
            setCurrentPage(currentPage + 1);
            setTimeout(() => nextPage.click(), DELAY_BETWEEN_PAGES);
        } else {
            console.log('No more pages or max reached, finishing.');
            saveToCSV(allEmails);
        }
    }

    // Start scraping
    scrapePage();
})();