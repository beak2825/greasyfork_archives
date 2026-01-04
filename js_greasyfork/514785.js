// ==UserScript==
// @name         Plex Random Movie Picker
// @namespace    https://greasyfork.org/en/users/247131
// @author       ALi3naTEd0
// @version      1.7
// @license      MIT
// @description  Picks a random movie from the Plex library on localhost and displays additional information
// @match        http://localhost:32400/web/*
// @match        https://localhost:32400/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514785/Plex%20Random%20Movie%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/514785/Plex%20Random%20Movie%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // History to track previously shown movies
    let movieHistory = [];
    let currentHistoryIndex = -1;

    // Create the main button for random movie selection
    const button = document.createElement("button");
    button.innerText = "Pick Random Movie";
    button.style.position = "fixed";
    button.style.top = "20px"; // Space from the top
    button.style.left = "50%";
    button.style.transform = "translateX(-50%)";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.zIndex = 1000;
    button.style.backgroundColor = "#e5a00d";
    button.style.color = "#000";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.fontWeight = "bold";
    button.style.cursor = "pointer";
    button.onclick = fetchRandomMovie;
    document.body.appendChild(button);

    // Function to display a movie from history
    function showMovieFromHistory(index) {
        if (index >= 0 && index < movieHistory.length) {
            currentHistoryIndex = index;
            displayMovie(movieHistory[index]);
        }
    }

    // Function to fetch a random movie from the Plex library
    async function fetchRandomMovie() {
        try {
            // Replace with your Plex token and server details
            const token = "TOKEN";
            const url = "http://localhost:32400/library/sections/1/all?X-Plex-Token=" + token;

            // Get server machine identifier
            const identityResponse = await fetch(`http://localhost:32400/identity?X-Plex-Token=${token}`);
            const identityData = await identityResponse.text();
            const identityParser = new DOMParser();
            const identityDoc = identityParser.parseFromString(identityData, "text/xml");
            const serverId = identityDoc.documentElement.getAttribute("machineIdentifier");

            const response = await fetch(url);
            const data = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            // Get all movies in the library
            const movies = xmlDoc.getElementsByTagName("Video");
            if (movies.length === 0) {
                alert("No movies found.");
                return;
            }

            // Select a random movie
            const randomIndex = Math.floor(Math.random() * movies.length);
            const randomMovie = movies[randomIndex];

            // Retrieve movie details
            const title = randomMovie.getAttribute("title");
            const year = randomMovie.getAttribute("year");
            const durationMs = randomMovie.getAttribute("duration");
            const duration = durationMs ? Math.round(durationMs / 60000) + " mins" : "Unknown";
            const movieKey = randomMovie.getAttribute("ratingKey");
            const thumbPath = randomMovie.getAttribute("thumb");

            // Construct Plex movie URL on localhost using the actual server ID
            const plexUrl = `http://localhost:32400/web/index.html#!/server/${serverId}/details?key=%2Flibrary%2Fmetadata%2F${movieKey}`;

            // Construct IMDb search URL
            const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(title + " " + year)}&s=tt`;

            // Create movie data object
            const movieData = {
                title, year, duration, movieKey, thumbPath, plexUrl, imdbSearchUrl, token, serverId
            };

            // Add to history (remove any items after current position if we went back)
            if (currentHistoryIndex < movieHistory.length - 1) {
                movieHistory = movieHistory.slice(0, currentHistoryIndex + 1);
            }
            movieHistory.push(movieData);
            currentHistoryIndex = movieHistory.length - 1;

            // Display the movie
            displayMovie(movieData);

        } catch (error) {
            console.error("Error fetching movie:", error);
            alert("Error fetching movie.");
        }
    }

    // Function to display movie details
    function displayMovie(movieData) {
        const { title, year, duration, movieKey, thumbPath, plexUrl, imdbSearchUrl, token, serverId } = movieData;

        // If dialog exists, remove it to refresh content
        const existingDialog = document.getElementById("movieDialog");
        if (existingDialog) existingDialog.remove();

            // Create custom dialog to display movie details
            const dialog = document.createElement("div");
            dialog.id = "movieDialog";
            dialog.style.position = "fixed";
            dialog.style.top = "50%";
            dialog.style.left = "50%";
            dialog.style.transform = "translate(-50%, -50%)";
            dialog.style.backgroundColor = "#1f1f1f";
            dialog.style.border = "2px solid #e5a00d";
            dialog.style.padding = "20px";
            dialog.style.zIndex = 1001;
            dialog.style.boxShadow = "0 8px 16px rgba(0,0,0,0.6)";
            dialog.style.width = "300px";
            dialog.style.textAlign = "center";
            dialog.style.borderRadius = "10px";

            // Add movie thumbnail if available
            if (thumbPath) {
                const thumbnail = document.createElement("img");
                thumbnail.src = `http://localhost:32400${thumbPath}?X-Plex-Token=${token}`;
                thumbnail.style.width = "100%";
                thumbnail.style.borderRadius = "5px";
                thumbnail.style.marginBottom = "10px";
                dialog.appendChild(thumbnail);
            }

            // Add movie details
            const message = document.createElement("p");
            message.innerText = `Title: ${title}\nYear: ${year}\nDuration: ${duration}`;
            message.style.color = "#ffffff";
            message.style.fontSize = "14px";
            message.style.lineHeight = "1.5";
            message.style.whiteSpace = "pre-line";
            dialog.appendChild(message);

            // Add link to open movie in current tab
            const goButton = document.createElement("a");
            goButton.href = plexUrl; // URL of the movie in localhost
            goButton.innerText = "Go to Movie";
            goButton.style.display = "block";
            goButton.style.marginTop = "15px";
            goButton.style.textDecoration = "none";
            goButton.style.color = "#4d9cff";
            goButton.style.fontWeight = "bold";
            goButton.onclick = () => {
                window.location.href = plexUrl; // Opens the URL in the same tab
            };
            dialog.appendChild(goButton);

            // Add IMDb link in yellow Plex color
            const imdbLink = document.createElement("a");
            imdbLink.href = imdbSearchUrl;
            imdbLink.innerText = "View on IMDb";
            imdbLink.target = "_blank"; // Open IMDb in a new tab
            imdbLink.style.display = "block";
            imdbLink.style.marginTop = "10px";
            imdbLink.style.marginBottom = "15px"; // Add space before the buttons
            imdbLink.style.textDecoration = "none";
            imdbLink.style.color = "#f5c518"; // IMDb yellow color
            imdbLink.style.fontWeight = "bold";
            dialog.appendChild(imdbLink);

            // Add 'Previous' button
            const previousButton = document.createElement("button");
            previousButton.innerText = "Previous";
            previousButton.onclick = () => {
                if (currentHistoryIndex > 0) {
                    showMovieFromHistory(currentHistoryIndex - 1);
                }
            };
            previousButton.style.marginTop = "10px";
            previousButton.style.marginRight = "10px";
            previousButton.style.backgroundColor = currentHistoryIndex > 0 ? "#e5a00d" : "#666";
            previousButton.style.color = currentHistoryIndex > 0 ? "#000" : "#999";
            previousButton.style.border = "none";
            previousButton.style.padding = "8px 16px";
            previousButton.style.borderRadius = "5px";
            previousButton.style.fontWeight = "bold";
            previousButton.style.cursor = currentHistoryIndex > 0 ? "pointer" : "not-allowed";
            previousButton.disabled = currentHistoryIndex <= 0;
            dialog.appendChild(previousButton);

            // Add 'Next' button for another random selection
            const nextButton = document.createElement("button");
            nextButton.innerText = "Next";
            nextButton.onclick = fetchRandomMovie; // Calls the function again for a new random movie
            nextButton.style.marginTop = "10px";
            nextButton.style.marginLeft = "10px";
            nextButton.style.backgroundColor = "#e5a00d";
            nextButton.style.color = "#000";
            nextButton.style.border = "none";
            nextButton.style.padding = "8px 16px";
            nextButton.style.borderRadius = "5px";
            nextButton.style.fontWeight = "bold";
            nextButton.style.cursor = "pointer";
            dialog.appendChild(nextButton);

            // Add line break for button layout
            const lineBreak = document.createElement("br");
            dialog.appendChild(lineBreak);

            // Add 'Close' button below Previous and Next
            const closeButton = document.createElement("button");
            closeButton.innerText = "Close";
            closeButton.onclick = () => {
                document.body.removeChild(dialog);
            };
            closeButton.style.marginTop = "10px";
            closeButton.style.backgroundColor = "#666";
            closeButton.style.color = "#fff";
            closeButton.style.border = "none";
            closeButton.style.padding = "8px 16px";
            closeButton.style.borderRadius = "5px";
            closeButton.style.fontWeight = "bold";
            closeButton.style.cursor = "pointer";
            dialog.appendChild(closeButton);

            // Add the dialog to the document
            document.body.appendChild(dialog);
    }
})();