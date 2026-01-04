// ==UserScript==
// @name         Workday Jobs Tab Renamer
// @namespace    https://greasyfork.org/en/users/688917
// @version      0.2
// @description  Rename tabs on myworkdayjobs.com based on job title and company name
// @icon64       https://www.workday.com/favicon.ico
// @match        *://*.myworkdayjobs.com/*/job/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489872/Workday%20Jobs%20Tab%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/489872/Workday%20Jobs%20Tab%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the company name from the URL
    function getCompanyName(url) {
        const matches = url.match(/\/\/(.*?)\.myworkdayjobs/);
        if (matches) {
            // Assuming the company name is the first part of the subdomain
            const subdomainParts = matches[1].split('.');
            return subdomainParts.length > 0 ? subdomainParts[0] : null;
        }
        return null;
    }

    // Function to rename the tab
    function renameTab() {
        const companyName = getCompanyName(window.location.href);
        const jobTitleElement = document.querySelector("#mainContent > div > div > div.css-e23il0 > div.css-cabox8 > div > h2");
        if (companyName && jobTitleElement) {
            const jobTitle = jobTitleElement.textContent.trim();
            document.title = `${jobTitle} - ${companyName}`;
        }
    }

    // Wait for the page to load and the job title element to be available
    const observer = new MutationObserver((mutations, obs) => {
        const jobTitleElement = document.querySelector("#mainContent > div > div > div.css-e23il0 > div.css-cabox8 > div > h2");
        if (jobTitleElement) {
            renameTab();
            obs.disconnect(); // Stop observing once we've renamed the tab
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
