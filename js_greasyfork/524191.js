// ==UserScript==
// @name         Redirect to Opener
// @version      1.1
// @description  Allow you to redirect customizable urls to the iOS Opener app.
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/524191/Redirect%20to%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/524191/Redirect%20to%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keys for stored lists
    const websiteListKey = "websiteList";
    const exclusionListKey = "exclusionList";

    // Retrieve or initialize the lists
    let websiteList = GM_getValue(websiteListKey, []);
    let exclusionList = GM_getValue(exclusionListKey, []);

    // Function to add a website to the redirect list
    function addWebsite() {
        const website = prompt("Enter a website or part of a URL to redirect (e.g., youtube.com):");
        if (!website) return;

        websiteList.push(website);
        GM_setValue(websiteListKey, websiteList);
        alert(`Website "${website}" added to the redirect list.`);
    }

    // Function to manage the redirect list
    function manageWebsiteList() {
        if (websiteList.length === 0) {
            alert("No websites have been added yet.");
            return;
        }

        let listDisplay = "Current websites in the redirect list:\n\n";
        websiteList.forEach((item, index) => {
            listDisplay += `${index + 1}. ${item}\n`;
        });
        listDisplay += "\nEnter the number of the website to delete, or press Cancel to exit.";

        const choice = prompt(listDisplay);
        const index = parseInt(choice, 10) - 1;

        if (!isNaN(index) && index >= 0 && index < websiteList.length) {
            websiteList.splice(index, 1);
            GM_setValue(websiteListKey, websiteList);
            alert("Website removed successfully!");
        }
    }

    // Function to add a website to the exclusion list
    function addExclusion() {
        const exclusion = prompt("Enter a URL part to exclude from redirection (e.g., login.google.com):");
        if (!exclusion) return;

        exclusionList.push(exclusion);
        GM_setValue(exclusionListKey, exclusionList);
        alert(`Exclusion "${exclusion}" added to the list.`);
    }

    // Function to manage the exclusion list
    function manageExclusionList() {
        if (exclusionList.length === 0) {
            alert("No exclusions have been added yet.");
            return;
        }

        let listDisplay = "Current exclusions:\n\n";
        exclusionList.forEach((item, index) => {
            listDisplay += `${index + 1}. ${item}\n`;
        });
        listDisplay += "\nEnter the number of the exclusion to delete, or press Cancel to exit.";

        const choice = prompt(listDisplay);
        const index = parseInt(choice, 10) - 1;

        if (!isNaN(index) && index >= 0 && index < exclusionList.length) {
            exclusionList.splice(index, 1);
            GM_setValue(exclusionListKey, exclusionList);
            alert("Exclusion removed successfully!");
        }
    }

    // Register menu commands
    GM_registerMenuCommand("Add Website to Redirect List", addWebsite);
    GM_registerMenuCommand("Manage Redirect List", manageWebsiteList);
    GM_registerMenuCommand("Add Exclusion", addExclusion);
    GM_registerMenuCommand("Manage Exclusion List", manageExclusionList);

    // Redirect logic
    const currentURL = window.location.href;

    // Check if the URL matches any exclusion before redirecting
    for (const exclusion of exclusionList) {
        if (currentURL.includes(exclusion)) {
            console.log(`Redirection prevented: URL contains excluded term "${exclusion}".`);
            return; // Stop execution if an exclusion is found
        }
    }

    // Check if the URL matches any redirect condition
    for (const website of websiteList) {
        if (currentURL.includes(website)) {
            const encodedURL = encodeURIComponent(currentURL);
            const openerURL = `opener://x-callback-url/show-options?url=${encodedURL}`;

            // Redirect to the constructed URL
            window.location.href = openerURL;
            break;
        }
    }
})();
