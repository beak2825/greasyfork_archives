// ==UserScript==
// @name        jia wei americandragon.com
// @version     1.4
// @description 1. open/close all Sections of americandragon.com at once. 2. search site with duckduckgo instead of google.
// @license MIT
// @match       *://americandragon.com/*
// @match       *://www.americandragon.com/*
// @grant       GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.qwant.com
// @namespace https://wu-wei.net
// @downloadURL https://update.greasyfork.org/scripts/527569/jia%20wei%20americandragoncom.user.js
// @updateURL https://update.greasyfork.org/scripts/527569/jia%20wei%20americandragoncom.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/


(function() {
 'use strict';
GM_addStyle(`
    #searchResults {
        display: none;
        width: 100%;
        height: 500px;
        border: 1px solid #ccc;
    }

`);
/*
    // Create and insert the search form
    const mainbox = document.getElementById('mainbox');
    const searchForm = document.createElement('form');
    searchForm.id = 'searchForm';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'searchInput';
    searchInput.placeholder = 'Search this site...';

    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.textContent = 'Search';

    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    mainbox.appendChild(searchForm);

    // Create a div to display results
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';
    mainbox.appendChild(resultsDiv);

    // Add an event listener to fetch search results on submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const site = window.location.hostname; // Get the current site's hostname
        const query = `site:${site} ${searchInput.value}`; // Prepend the site search operator
        fetchResults(query); // Fetch results
    });

    // Function to fetch results from DuckDuckGo API
    function fetchResults(query) {
        const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                displayResults(data);
            },
            onerror: function(error) {
                console.error('Error fetching results:', error);
            }
        });
    }

    // Function to display results in the results div
    function displayResults(data) {
        resultsDiv.innerHTML = ''; // Clear previous results

        if (data.RelatedTopics.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        data.RelatedTopics.forEach(topic => {
            if (topic.Text) { // Check if there is text to display
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `<strong>${topic.Text}</strong><br><a href="${topic.FirstURL}" target="_blank">${topic.FirstURL}</a>`;
                resultsDiv.appendChild(resultItem);
            }
        });
    }
*/


  // Function to replace the Google search form with DuckDuckGo
       function replaceSearchForm() {
    const searchForm = document.querySelector('[name="q"]');
    const searchButton = document.querySelector('[value="Search This Site"]');
    if (searchButton) {
        searchButton.remove();
    }

    // Create a new form element for DuckDuckGo
    const newForm = document.createElement('form');
    newForm.action = 'https://www.duckduckgo.com/';
    newForm.method = 'GET';

    // Create a new input element
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.name = 'q';
    newInput.placeholder = 'Search this site...';

    // Create a new button element
    const newButton = document.createElement('button');
    newButton.type = 'submit';
    newButton.textContent = 'Search';

    // Append the input and button to the new form
    newForm.appendChild(newInput);
    newForm.appendChild(newButton);

    // Add an event listener to modify the search query on submission
    newForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const site = window.location.hostname; // Get the current site's hostname
        const query = `site:${site} ${newInput.value}`; // Prepend the site search operator
        window.location.href = `https://www.duckduckgo.com/?q=${encodeURIComponent(query)}`; // Redirect to DuckDuckGo
    });

    // Replace the old form with the new form in the DOM
    searchForm.parentNode.replaceChild(newForm, searchForm);
}

// Call the function to replace the form
replaceSearchForm();




/*
//THIS IS THE FUTURE, if a reliable api can be found
      // Function to replace the Google search form with Qwant
    function replaceSearchForm() {
        const searchForm = document.querySelector('[name="q"]');
        const searchButton = document.querySelector('[value="Search This Site"]');
        if (searchButton) {
            searchButton.remove();
        }

        // Create a div for displaying search results
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'ddg-results';
        resultsDiv.style.width = '300px';
        resultsDiv.style.height = '400px';
        resultsDiv.style.overflowY = 'scroll';
        resultsDiv.style.backgroundColor = 'white';
        resultsDiv.style.border = '1px solid #ccc';
        resultsDiv.style.zIndex = '1000';
        resultsDiv.style.display = 'none'; // Initially hidden

        // Find the mainbox element
        const mainbox = document.getElementById('mainbox');
        if (mainbox) {
            // Insert the resultsDiv as a sibling after mainbox
            mainbox.parentNode.insertBefore(resultsDiv, mainbox.nextSibling);
        }

        // Create a new form element for DuckDuckGo
        const newForm = document.createElement('form');
        newForm.action = 'https://www.qwant.com/';
        newForm.method = 'GET';

        // Create a new input element
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.name = 'q';
        newInput.placeholder = 'Search this site...';

        // Create a new button element
        const newButton = document.createElement('button');
        newButton.type = 'submit';
        newButton.textContent = 'Search';

        // Append the input and button to the new form
        newForm.appendChild(newInput);
        newForm.appendChild(newButton);

        // Add an event listener to modify the search query on submission
        newForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            const site = window.location.hostname; // Get the current site's hostname
            const query = `site:${site} ${newInput.value}`; // Prepend the site search operator
            fetchQwantResults(query); // Fetch results from Qwant API
        });

        // Replace the old form with the new form in the DOM
        searchForm.parentNode.replaceChild(newForm, searchForm);
    }

        // Function to fetch Qwant search results
    function fetchQwantResults(query) {
        const url = `https://api.qwant.com/api/search/web?count=10&q=${encodeURIComponent(query)}&t=all&locale=en_US&uiv=4`;

        console.log("Fetching results from:", url); // Log the URL being fetched

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                console.log("Response Status:", response.status); // Log the response status
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log("API Response:", data); // Log the API response

                        // Check if the response has the expected structure
                        if (data && data.data && data.data.result && data.data.result.items) {
                            console.log("Search Results:", data.data.result.items); // Log search results
                            displayResults(data.data.result.items);
                        } else {
                            console.error("Unexpected API response structure:", data);
                            displayError('Unexpected response structure.');
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                        displayError('Error parsing results.');
                    }
                } else {
                    console.error("Error fetching results, status:", response.status);
                    displayError('Error fetching results.');
                }
            },
            onerror: function(error) {
                console.error("Network error occurred:", error);
                displayError('Network error occurred.');
            }
        });
    }

    // Function to display results in the div
    function displayResults(items) {
        const resultsDiv = document.getElementById('ddg-results');
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsDiv.style.display = 'block'; // Show the results div

        if (items.length === 0) {
            resultsDiv.innerHTML = 'No results found.';
            return;
        }

        items.forEach(item => {
            if (item.title && item.url) {
                const resultItem = document.createElement('div');
                resultItem.style.margin = '10px 0';
                resultItem.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
                resultsDiv.appendChild(resultItem);
            }
        });
    }

    // Function to display error messages
    function displayError(message) {
        const resultsDiv = document.getElementById('ddg-results');
        resultsDiv.innerHTML = message;
        resultsDiv.style.display = 'block'; // Show the results div
    }

    // Call the function to replace the search form
    replaceSearchForm();

*/



// Add button to toggle folding on all foldable elements:
var targetE = document.querySelector('.p7TBMtext');
console.log(targetE);
var foldedE = document.querySelectorAll("#maincontent [id^='p7ABt']");
console.log(foldedE);
var evtNew = document.createEvent("MouseEvents");
evtNew.initEvent("click", true, true);
var zNode = document.createElement('li');
zNode.innerHTML = '<button id="p7TBMt09" type="button">open/close all sections</button>';
zNode.setAttribute('id', 'myContainer');
targetE.appendChild(zNode);
targetE.insertBefore(zNode, targetE.firstChild);

//--- Activate the newly added button.
document.getElementById("p7TBMt09").addEventListener("click", ButtonClickAction, false);

function ButtonClickAction(zEvent) {
    for (const myE of foldedE) { // Declare myE with const
        console.log(myE);
        myE.dispatchEvent(evtNew);
    }
}

//--- Style our newly added elements using CSS.
function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}




})();