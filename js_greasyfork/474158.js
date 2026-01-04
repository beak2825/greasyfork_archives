// ==UserScript==
// @name         Anime 2 MAL
// @namespace    https://github.com/longkidkoolstar
// @version      1.0.1
// @author       longkidkoolstar
// @description  Adds a Button that fetches the MAL(My Anime List) link for anime on Anime-Watching-Websites such as Aniwatch.to (Zoro.to)
// @match        https://aniwatch.to/*
// @grant        GM_xmlhttpRequest
// @license      CC BY-NC-ND 4.0
// @icon         https://repository-images.githubusercontent.com/62559339/bef33a00-628e-11e9-8c12-e36b0cb6c734
// @downloadURL https://update.greasyfork.org/scripts/474158/Anime%202%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/474158/Anime%202%20MAL.meta.js
// ==/UserScript==

(function() {
    'use strict';


  // Find the anime name using DOM manipulation
    const animeNameElement = document.querySelector('h2.film-name.dynamic-name');
    if (animeNameElement) {
        const animeName = animeNameElement.textContent.trim();
        console.log('Anime Name:', animeName);

        // Construct the Jikan API request
        const malApiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}`;
        console.log('API URL:', malApiUrl);

        GM_xmlhttpRequest({
            method: 'GET',
            url: malApiUrl,
            onload: function(response) {
                const responseData = JSON.parse(response.responseText);
                console.log('API Response:', responseData);

                if (responseData.data && responseData.data.length > 0) {
                    const malAnimeLink = responseData.data[0].url;
                    console.log(`MAL Link for "${animeName}": ${malAnimeLink}`);

                    // Create a new button and add it to the DOM
                    const newButton = document.createElement('a');
                    newButton.setAttribute('class', 'btn btn-radius btn-primary ml-2');
                    newButton.textContent = 'Open In MAL';

                    // Add an event listener to open the MAL link when clicked
                    newButton.addEventListener('click', function() {
                        window.open(malAnimeLink, '_blank');
                    });

                    // Find the existing button and its parent element
                    const existingButton = document.querySelector('.dr-fav a.btn-light');
                    const parentElement = existingButton.parentElement;

                    // Insert the new button next to the existing button
                    parentElement.insertBefore(newButton, existingButton.nextSibling);
                } else {
                    console.log(`Anime "${animeName}" not found on MAL.`);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data from MAL API:', error);
            }
        });
    } else {
        console.log('Anime name element not found.');
    }
})();
