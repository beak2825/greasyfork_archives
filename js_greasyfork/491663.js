// ==UserScript==
// @name         Ignore List Search 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search through all pages of ignore list
// @author       kloob
// @match        https://www.gaiaonline.com/profiles/*/*/?mode=ignored
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491663/Ignore%20List%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/491663/Ignore%20List%20Search.meta.js
// ==/UserScript==
(function() {
    'use strict';

function addSearchBox() {
    // Check if the search box already exists to avoid duplicates
    if (document.getElementById("userSearchContainer")) {
        return;
    }

    // Create a container for the search box
    const searchContainer = document.createElement("div");
    searchContainer.setAttribute("id", "userSearchContainer");
    searchContainer.style.backgroundColor = "black";
    searchContainer.style.color = "white";
    searchContainer.style.padding = "5px"; // Add 5px padding
    //searchContainer.style.margin = "5px 5px 5px 5px";
    searchContainer.style.zIndex = "9999"; // High z-index to layer over other content
    searchContainer.style.position = "relative"; // Needed to make z-index effective

    // Create the search input element
    const searchBox = document.createElement("input");
    searchBox.setAttribute("type", "text");
    searchBox.setAttribute("id", "userSearch");
    searchBox.setAttribute("placeholder", "Search Ignored Users...");
    searchBox.style.color = "white";
    searchBox.style.backgroundColor = "black";
    searchBox.style.border = "none";

    // Add the search box to the container
    searchContainer.appendChild(searchBox);

    // Select the header_left element (or any other desired element)
    const headerLeft = document.getElementById("header_left");
    if (headerLeft) {
        // Insert the search container before the header_left element
        headerLeft.parentNode.insertBefore(searchContainer, headerLeft);

        // Add an event listener to initiate the search when Enter is pressed
        searchBox.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchUsers(searchBox.value);
            }
        });
    }
}




    function getAllPageLinks() {
        // Extract the base URL dynamically from the current page's URL
        // Assuming the current page's URL follows the pattern: https://www.gaiaonline.com/profiles/{username}/{userid}/?mode=ignored
        const baseUrl = window.location.href.split('?')[0];

        // URL for the first page
        const firstPageUrl = baseUrl + '?mode=ignored';
        // Set to store unique URLs, initialized with the first page URL
        const uniqueUrls = new Set([firstPageUrl]);

        // Add other page URLs to the Set
        document.querySelectorAll('.pagination a').forEach(link => {
            uniqueUrls.add(link.getAttribute('href'));
        });

        // Convert the Set to an Array and sort based on the 'start' query parameter
        return Array.from(uniqueUrls).sort((a, b) => {
            let startA = parseInt(new URL(a, window.location.origin).searchParams.get("start")) || 0;
            let startB = parseInt(new URL(b, window.location.origin).searchParams.get("start")) || 0;
            return startA - startB;
        });
    }



    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject('Error: ' + response.statusText);
                    }
                },
                onerror: function(error) {
                    reject('Error: ' + error);
                }
            });
        });
    }

async function searchUsers(searchTerm) {
    const searchBox = document.getElementById("userSearch");
    const originalPlaceholder = searchBox.placeholder;

    // Function to create a loading animation for the placeholder
    function setLoadingAnimation() {
        let dots = 0;
        return setInterval(() => {
            dots = (dots + 1) % 4; // Cycle through 0 to 3
            const dotsText = '.'.repeat(dots);
            searchBox.placeholder = `Searching Ignored List${dotsText}`;
        }, 500); // Update every 500 milliseconds
    }

    // Start the loading animation
    const animationInterval = setLoadingAnimation();

    try {
        // Reset the input field for visibility of the placeholder
        searchBox.value = '';
        const pageLinks = getAllPageLinks();
        searchTerm = searchTerm.toLowerCase();

        for (const link of pageLinks) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to prevent rate limiting
            const pageContent = await fetchPage(link);
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, "text/html");
            const users = doc.querySelectorAll('ul > li > span > a');

            for (const user of users) {
                if (user.textContent.trim().toLowerCase().includes(searchTerm)) {
                    displayResult(user.textContent.trim(), true, user.getAttribute('href'));
                    clearInterval(animationInterval); // Stop the animation
                    searchBox.placeholder = originalPlaceholder; // Restore original placeholder
                    searchBox.value = searchTerm; // Restore the searched term
                    return;
                }
            }
        }
        displayResult(searchTerm, false);
    } catch (error) {
        console.error(error);
        displayResult(searchTerm, false);
    } finally {
        clearInterval(animationInterval); // Ensure the animation is stopped
        searchBox.placeholder = originalPlaceholder; // Restore original placeholder
        searchBox.value = searchTerm; // Restore the searched term
    }
}




function displayResult(user, found, profileUrl) {
    // Clear any previous results
    const existingResult = document.getElementById("searchResult");
    if (existingResult) existingResult.remove();

    const resultDiv = document.createElement("div");
    resultDiv.setAttribute("id", "searchResult");
    resultDiv.style.marginTop = "10px";
    resultDiv.style.color = "white !important";
    resultDiv.style.fontSize = "inherit !important";
    resultDiv.style.fontFamily = "inherit !important";
    resultDiv.style.fontWeight = "normal !important";
    resultDiv.style.textDecoration = "none !important";

    if (found) {
        resultDiv.textContent = `${user} found on Ignore List: `;

        // Extract user ID from profile URL
        const userId = profileUrl.split('/profiles/')[1].split('/')[0];

        // Create and append [View Profile] link
        const profileLink = createLink(profileUrl, "[View Profile]");
        resultDiv.appendChild(profileLink);

        // Create and append [Moddog] link
        const moddogUrl = `https://www.gaiaonline.com/moddog/note/search/${userId}/`;
        const moddogLink = createLink(moddogUrl, "[Moddog]");
        resultDiv.appendChild(moddogLink);

        // Create and append [Profile Tools] link
        const profileToolsUrl = `https://www.gaiaonline.com/admin/user/mod/${userId}`;
        const profileToolsLink = createLink(profileToolsUrl, "[Profile Tools]");
        resultDiv.appendChild(profileToolsLink);
    } else {
        resultDiv.textContent = `No user found matching "${user}".`;
    }

    document.getElementById("userSearchContainer").appendChild(resultDiv);
}

function createLink(url, text) {
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.textContent = text;
    link.style.color = "white !important";
    link.style.fontWeight = "bold !important";
    link.style.textDecoration = "none !important";
    link.style.fontSize = "inherit !important";
    link.style.fontFamily = "inherit !important";
    return link;
}



    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (document.getElementById("gaia_header") && !document.getElementById("userSearch")) {
                observer.disconnect();
                addSearchBox();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();