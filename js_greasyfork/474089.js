// ==UserScript==
// @name         LinkedIn Company Matcher Revised
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Check if LinkedIn job company is in IND km sponsor list
// @author       JP Zhang
// @match        https://www.linkedin.com/jobs/*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license             MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/474089/LinkedIn%20Company%20Matcher%20Revised.user.js
// @updateURL https://update.greasyfork.org/scripts/474089/LinkedIn%20Company%20Matcher%20Revised.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch the IND km sponsor list (supposed to be a JSON file)
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/zjplab/Dutch_KM_Sponsored_Company_Lists/main/km_company.json",
        onload: function(response) {
            let indCompanies = JSON.parse(response.responseText);

            // Run the check every 5 seconds
            setInterval(function() {
                // Find the company name in the page
                let companyNameElement = document.querySelector(".job-details-jobs-unified-top-card__primary-description-container a.app-aware-link");
                if (!companyNameElement) {
                    console.log("Company name element not found");
                    return;
                }
                let companyName = companyNameElement.textContent.trim().toLowerCase();

                // Find the location in the page
                let locationAndTimeElement = companyNameElement.parentElement.textContent;
                let locationAndTime = locationAndTimeElement.split("·")[1];
                let location = locationAndTime ? locationAndTime.split("·")[0].trim() : ''; // Extracting only the location part

                // Print the company name and location
                console.log("Company name: " + companyName);
                console.log("Location: " + location);

                if (location.includes('Netherlands') || location.includes('荷兰') || location.includes('尼德兰') || location.includes('Amsterdam Area')) {
                    let companyLink = companyNameElement; // Save the object for the company name link

                    console.time("Matching time"); // Start timer

                    let matched = indCompanies.sponsors.some(function(sponsor) {
                        if (isKMismatchSubstring(companyName, sponsor.toLowerCase(), 3)) {
                            // The company name is a K-mismatch substring of this company,
                            // so you can change the CSS as needed.
                            companyLink.style.fontWeight = 'bold';
                            companyLink.style.color = 'green';
                            return true;
                        }
                        return false;
                    });

                    console.timeEnd("Matching time"); // End timer and log time

                    if (!matched) {
                        // The company name did not match any sponsor,
                        // so you can change the CSS as needed.
                        console.log("Not matched!");
                        companyLink.style.fontWeight = 'bold';
                        companyLink.style.color = 'red';
                    }
                }
            }, 5000);
        }
    });
})();

function isKMismatchSubstring(query, text, k) {
    let m = query.length;
    for (let i = 0; i <= text.length - m; i++) {
        let mismatches = 0;
        for (let j = 0; j < m; j++) {
            if (text[i + j] !== query[j]) {
                mismatches++;
                if (mismatches > k) {
                    break;
                }
            }
        }
        if (mismatches <= k) {
            return true;
        }
    }
    return false;
}
