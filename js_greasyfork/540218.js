// ==UserScript==
// @name         TrustScanner
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Warn users about potentially malicious websites by checking the domain against the FishFish API and displaying a prominent alert if flagged as malware or phishing.
// @match        *://*/*
// @tag          security
// @tag          privacy
// @tag          safety
// @author       Suchti18
// @copyright    /
// @supportURL   https://github.com/Suchti18/TrustScanner
// @homepageURL  https://github.com/Suchti18/TrustScanner
// @homepage     https://github.com/Suchti18/TrustScanner
// @icon         https://raw.githubusercontent.com/Suchti18/TrustScanner/main/.github/logo.png
// @icon64       https://raw.githubusercontent.com/Suchti18/TrustScanner/main/.github/logo.png
// @license      Unlicense
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/540218/TrustScanner.user.js
// @updateURL https://update.greasyfork.org/scripts/540218/TrustScanner.meta.js
// ==/UserScript==

// This ensures we check the main domain only, ignoring subdomains because FishFish only accepts the main domain
function getCurrentDomain() {
    // Get the current host
    const hostname = window.location.host

    // Return the domain. The levels concatenated by a dot. Return null if no match is found
    return hostname ? hostname : null;
}

async function checkWebsite(domain) {
    // Null check for the parameter
    if(domain == null) {
        return ""
    }
    
    // API URL for FishFish
    const apiURL = "https://api.fishfish.gg/v1/domains/"
    const completeURL = apiURL + domain   
    
    // API Request to FishFish
    // Docs: https://api.fishfish.gg/docs/
    // Using GM_xmlhttpRequest to bypass CORS restrictions imposed by browsers
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: completeURL,
            // Response 404: Domain wasnt found in the FishFish database.
            // Response 200: FishFish got an entry for the domain
            // Every other response is an error
            onload: function(response) {
                if (response.status === 404) {
                    resolve("Not found");
                } else if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.category);
                    } catch(e) {
                        reject(e);
                    }
                } else {
                    reject(new Error("HTTP Status: " + response.status));
                }
            },
            onerror: function(err) {
                reject(new Error("An error occurred during the api request"));
            }
        });
    });
}

// Display a prominent banner warning users about the site's potential risk.
function showBanner(result) {
    // Create a div with a red background and the text "This site was flagged as [result]. Proceed with caution!"
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.minHeight = '20vh';
    div.style.padding = '2vh 1vw';
    div.style.backgroundColor = 'red';
    div.style.fontSize = '3.5vw';
    div.style.color = 'white';
    div.style.textAlign = 'center';
    div.style.boxSizing = 'border-box';

    // Adds the text mentioned earlier to the div
    div.innerHTML = `This site was flagged as\u00A0<strong>${result}</strong>. Proceed with caution!`

    // Create a shadow DOM to encapsulate the styles and prevent conflicts with the page's styles
    // This is useful to ensure the banner looks consistent across different sites
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'open' });

    shadow.appendChild(div);

    // Add banner to the top of the document
    document.body.prepend(host);
}

(async function() {
    'use strict';

    // Check the current domain against the FishFish API
    // If the domain is flagged as malware or phishing, show a warning banner
    const result = await checkWebsite(getCurrentDomain())

    // Decide whether to show the banner or not
    // Log the result to the console for debugging purposes

    console.log("Website checked: " + getCurrentDomain())

    if(result === "safe") {
        console.log("Website is marked as safe")
    } else if(result === "malware" || result === "phishing") {
        showBanner(result)
        console.log("Website was flagged as " + result + ". A warning banner was displayed.")
    } else if(result === "Not found") {
        console.log("Website was not found in the FishFish Database. Do you think its dangerous? Visit https://fishfish.gg/")
    } else {
        console.error("Oops, something went wrong while checking the website.")
        console.error("Returned result: " + result)
    }
})();