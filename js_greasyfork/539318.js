// ==UserScript==
// @name         Cineby.app X-Ray Feature (OMDb API)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a Prime Video-like X-Ray panel to cineby.app, fetching data from OMDb API using IMDb ID.
// @author       Gemini
// @match        *://*.cineby.app/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539318/Cinebyapp%20X-Ray%20Feature%20%28OMDb%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539318/Cinebyapp%20X-Ray%20Feature%20%28OMDb%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IMPORTANT: Replace 'YOUR_OMDB_API_KEY' with your actual OMDb API key.
    // Get your free API key from: http://www.omdbapi.com/
    const OMDB_API_KEY = 'YOUR_OMDB_API_KEY';

    // --- Helper function to add CSS styles ---
    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // --- Inject CSS for the X-Ray panel and button ---
    addGlobalStyle(`
        /* Inter font for a modern look */
        body {
            font-family: 'Inter', sans-serif;
        }

        /* X-Ray Button Styling */
        #xray-toggle-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0A84FF; /* A vibrant blue */
            color: white;
            border: none;
            border-radius: 8px; /* Slightly rounded */
            padding: 12px 20px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Soft shadow */
            z-index: 10000; /* Ensure it's on top */
            transition: background-color 0.3s ease, transform 0.2s ease;
        }

        #xray-toggle-button:hover {
            background-color: #0070e0; /* Darker blue on hover */
            transform: translateY(-2px); /* Slight lift effect */
        }

        #xray-toggle-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        /* X-Ray Panel Styling */
        #xray-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 350px; /* Fixed width */
            height: 100%;
            background-color: rgba(26, 26, 26, 0.95); /* Dark, slightly transparent background */
            color: white;
            box-shadow: -4px 0 15px rgba(0, 0, 0, 0.3); /* Shadow on the left edge */
            z-index: 9999;
            transform: translateX(100%); /* Initially off-screen */
            transition: transform 0.4s ease-out; /* Smooth slide-in/out */
            padding: 20px;
            box-sizing: border-box; /* Include padding in width */
            overflow-y: auto; /* Scroll for long content */
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
        }

        #xray-panel.open {
            transform: translateX(0); /* Slide into view */
        }

        #xray-panel h2 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #E0E0E0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 10px;
        }

        #xray-panel h3 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #CCCCCC;
        }

        #xray-panel p, #xray-panel ul, #xray-panel li {
            font-size: 15px;
            line-height: 1.6;
            color: #B0B0B0;
            margin-bottom: 15px;
        }

        #xray-panel ul {
            list-style: none;
            padding: 0;
        }

        #xray-panel li {
            margin-bottom: 5px;
        }

        /* Close button styling for the panel */
        #xray-close-button {
            position: absolute;
            top: 15px;
            left: 15px;
            background: none;
            border: none;
            font-size: 28px;
            color: #CCCCCC;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background-color 0.2s ease;
        }

        #xray-close-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Loading indicator styling */
        .loader {
            border: 4px solid #f3f3f3; /* Light grey */
            border-top: 4px solid #0A84FF; /* Blue */
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
            display: none; /* Hidden by default */
        }

        .loader.active {
            display: block; /* Show when active */
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // --- Create X-Ray Toggle Button ---
    const toggleButton = document.createElement('button');
    toggleButton.id = 'xray-toggle-button';
    toggleButton.innerText = 'X-Ray';
    document.body.appendChild(toggleButton);

    // --- Create X-Ray Panel ---
    const xrayPanel = document.createElement('div');
    xrayPanel.id = 'xray-panel';
    xrayPanel.innerHTML = `
        <button id="xray-close-button">&times;</button>
        <h2>X-Ray Information</h2>
        <div class="loader" id="xray-loader"></div>
        <div id="xray-content">
            <p>Click "X-Ray" and enter an IMDb ID to fetch movie details.</p>
            <p>Example IMDb ID: tt0133093 (The Matrix)</p>
        </div>
    `;
    document.body.appendChild(xrayPanel);

    const closeButton = xrayPanel.querySelector('#xray-close-button');
    const xrayContentDiv = xrayPanel.querySelector('#xray-content');
    const xrayLoader = xrayPanel.querySelector('#xray-loader');

    // --- Function to fetch movie data from OMDb API ---
    async function fetchMovieData(imdbID) {
        if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_OMDB_API_KEY') {
            xrayContentDiv.innerHTML = `<p style="color: red;">Error: OMDb API Key is missing or invalid. Please update the script with your key.</p>`;
            return;
        }

        xrayLoader.classList.add('active'); // Show loader
        xrayContentDiv.innerHTML = ''; // Clear previous content

        const apiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}&plot=full`; // Request full plot

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.Response === 'True') {
                displayMovieData(data);
            } else {
                xrayContentDiv.innerHTML = `<p style="color: red;">Error: ${data.Error || 'Movie not found or API issue.'}</p>`;
            }
        } catch (error) {
            console.error('Error fetching movie data:', error);
            xrayContentDiv.innerHTML = `<p style="color: red;">Failed to fetch movie data. Check console for details.</p>`;
        } finally {
            xrayLoader.classList.remove('active'); // Hide loader
        }
    }

    // --- Function to display fetched movie data ---
    function displayMovieData(movie) {
        xrayContentDiv.innerHTML = `
            <h3>Title:</h3>
            <p>${movie.Title || 'N/A'}</p>

            <h3>Year:</h3>
            <p>${movie.Year || 'N/A'}</p>

            <h3>Genre:</h3>
            <p>${movie.Genre || 'N/A'}</p>

            <h3>Director:</h3>
            <p>${movie.Director || 'N/A'}</p>

            <h3>Writer(s):</h3>
            <p>${movie.Writer || 'N/A'}</p>

            <h3>Cast:</h3>
            <p>${movie.Actors || 'N/A'}</p>

            <h3>Plot:</h3>
            <p>${movie.Plot || 'N/A'}</p>

            <h3>IMDb Rating:</h3>
            <p>${movie.imdbRating || 'N/A'}</p>

            ${movie.Poster && movie.Poster !== 'N/A' ? `
                <h3>Poster:</h3>
                <img src="${movie.Poster}" alt="${movie.Title} Poster" style="max-width: 100%; height: auto; border-radius: 8px;">
            ` : ''}
        `;
    }

    // --- Event Listeners ---
    toggleButton.addEventListener('click', async () => {
        // If the panel is closed, prompt for IMDb ID and fetch data
        if (!xrayPanel.classList.contains('open')) {
            const imdbID = prompt('Please enter the IMDb ID for the movie (e.g., tt0133093 for The Matrix):');
            if (imdbID) {
                await fetchMovieData(imdbID.trim());
            } else {
                // User cancelled or entered empty, reset content
                xrayContentDiv.innerHTML = `<p>Click "X-Ray" and enter an IMDb ID to fetch movie details.</p><p>Example IMDb ID: tt0133093 (The Matrix)</p>`;
                xrayLoader.classList.remove('active');
            }
        }
        xrayPanel.classList.toggle('open');
    });

    closeButton.addEventListener('click', () => {
        xrayPanel.classList.remove('open');
    });

})();
