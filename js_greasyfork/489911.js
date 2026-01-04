// ==UserScript==
// @name         Fbox (formally Fmovies) Movie/TV Show IMDb Linker
// @namespace    https://greasyfork.org/en/users/158563-flowscript
// @version      2.5
// @description  Automatically converts movie and TV show titles on fmoviesz.to into clickable IMDb links.
// @author       flowscript
// @license      MIT
// @match        https://fboxz.to/*
// @icon         https://fboxz.to/assets/s/efc53769e615dedbfa14097647c484fc1b53872ef2.png
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489911/Fbox%20%28formally%20Fmovies%29%20MovieTV%20Show%20IMDb%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/489911/Fbox%20%28formally%20Fmovies%29%20MovieTV%20Show%20IMDb%20Linker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('apiKey', '');

    function createApiKeyBar() {
        const bar = document.createElement('div');
        bar.id = 'api-key-bar';
        bar.style.position = 'fixed';
        bar.style.top = '0';
        bar.style.left = '0';
        bar.style.right = '0';
        bar.style.background = 'white';
        bar.style.zIndex = '9999';
        bar.style.display = 'flex';
        bar.style.justifyContent = 'space-around';
        bar.style.alignItems = 'center';
        bar.style.padding = '10px';
        bar.innerHTML = `
            <div style="max-width: 650px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
                <span style="color:#000">Enter your OMDb API key:</span>
                <input type="text" id="api-key-input" value="${apiKey}" placeholder="Your OMDb API Key" />
                <button id="save-api-key">Save</button>
                <a style="color:#000; text-decoration: underline;" href="https://www.omdbapi.com/apikey.aspx?__EVENTTARGET=freeAcct&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUKLTIwNDY4MTIzNWQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgMFC3BhdHJlb25BY2N0BQhmcmVlQWNjdAUIZnJlZUFjY3TPFbhDNAP5k2IyKPJ7m9uxWYueZItroF14oycQCjz74g%3D%3D&__VIEWSTATEGENERATOR=5E550F58&__EVENTVALIDATION=%2FwEdAAqlA4T7vBlT9mLCvJHK4jtLmSzhXfnlWWVdWIamVouVTzfZJuQDpLVS6HZFWq5fYpioiDjxFjSdCQfbG0SWduXFd8BcWGH1ot0k0SO7CfuulF0vVes0SOcL8qM3Jr6aqHyFE%2Bczl1aCyjbLtuPuRU0tIVu1gi3bgvDqS3Gt3lnrv%2FgsVJPMV9tdMU3lWBBf01vN%2BDvxnwFeFeJ9MIBWR693lV1nVMd%2BBdOykS6U5QG9tWPPrmmNyoXzpQ6YDVjG%2F3M%3D&at=freeAcct&Email=&Email2=&FirstName=&LastName=&TextArea1=" target="_blank">Get an API Key</a>
                <button id="close-api-key-bar" style="margin-left: 20px;">X</button>
            </div>
        `;
        document.body.appendChild(bar);

        document.getElementById('save-api-key').addEventListener('click', function() {
            apiKey = document.getElementById('api-key-input').value.trim();
            GM_setValue('apiKey', apiKey);
            hideApiKeyBar();
            createApiKeySettingsButton(); // Ensure the button is available for future changes
            window.location.reload(); // Reload the page after saving the API key
        });

        // Close button functionality
        document.getElementById('close-api-key-bar').addEventListener('click', function() {
            hideApiKeyBar();
        });
    }

    function createApiKeySettingsButton() {
        let button = document.getElementById('api-key-settings-button');
        if (!button) {
            button = document.createElement('button');
            button.id = 'api-key-settings-button';
            button.textContent = 'API Key Settings';
            button.style.position = 'fixed';
            button.style.top = '0';
            button.style.right = '0';
            button.style.zIndex = '9998';
            document.body.appendChild(button);

            button.addEventListener('click', function() {
                let bar = document.getElementById('api-key-bar');
                if (!bar) {
                    createApiKeyBar(); // Recreate the API key bar if it doesn't exist
                    bar = document.getElementById('api-key-bar'); // Re-assign 'bar' after creation
                }
                bar.style.display = 'flex'; // Ensure the bar is visible
            });
        }
    }

    function hideApiKeyBar() {
        const bar = document.getElementById('api-key-bar');
        bar.style.display = 'none';
    }

    if (!apiKey) {
        createApiKeyBar();
    } else {
        createApiKeySettingsButton();
    }

    // Begin IMDb Linker Script
    // Modified fetchIMDbID function with year adjustment logic
    function fetchIMDbID(title, year, type, callback, attempt = 0) {
        if (!apiKey) {
            alert("OMDb API key is not set. Please set your API key at the top of the page.");
            return;
        }

        const apiType = type === 'TV' ? 'series' : 'movie';
        const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&type=${apiType}&t=${encodeURIComponent(title)}&y=${year}`;

        console.log(`Fetching IMDb ID for: ${title} ${year} ${type}`);

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: (response) => {
                const data = JSON.parse(response.responseText);
                if (data.Response === 'True') {
                    console.log(`Found: ${title} ${year}`);
                    callback(data.imdbID);
                } else {
                    if (attempt === 0) {
                        console.log(`Failed to find IMDb ID: ${title}, checking previous year for: ${title} ${year-1}`);
                        fetchIMDbID(title, year-1, type, callback, -1); // Check previous year
                    } else if (attempt === -1) {
                        console.log(`Failed to find IMDb ID: ${title}, checking next year for: ${title} ${parseInt(year)+2}`);
                        fetchIMDbID(title, parseInt(year)+2, type, callback, 1); // Skip to next year after original
                    } else {
                        console.error(`Failed to find IMDb ID after checks: ${title}`);
                        callback(null);
                    }
                }
            }
        });
    }

    const titleElement = document.querySelector('h1.name');
    const yearElement = document.querySelector('.year');
    const path = window.location.pathname;

    const title = titleElement ? titleElement.innerText.trim() : '';
    const year = yearElement ? parseInt(yearElement.innerText.trim(), 10) : '';
    const type = path.includes('/tv/') ? 'TV' : 'Movie';

    if (title && year && type) {
        fetchIMDbID(title, year, type, (imdbID) => {
            if (imdbID) {
                const imdbLink = document.createElement('a');
                imdbLink.href = `https://www.imdb.com/title/${imdbID}/`;
                imdbLink.target = '_blank';
                imdbLink.innerHTML = title; // Wrap the original title text
                titleElement.innerHTML = ''; // Clear existing content
                titleElement.appendChild(imdbLink); // Insert the link
            }
        });
    }
})();