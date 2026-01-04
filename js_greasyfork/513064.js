// ==UserScript==
// @name         Stream sources from justwatch
// @namespace    http://tampermonkey.net/
// @version      2024-10-18
// @description  Search for movies on streaming sites
// @author       You
// @match        https://www.justwatch.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=justwatch.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513064/Stream%20sources%20from%20justwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/513064/Stream%20sources%20from%20justwatch.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Function to create the dropdown and buttons for streaming options
    function createDropdown(movieId) {
        let existingDiv = document.getElementById('streamingDiv');
        if (existingDiv) {
            existingDiv.remove(); // Remove old dropdown if already present
        }

        // Create a div to contain the dropdown and buttons
        let div = document.createElement('div');
        div.id = 'streamingDiv';

        // Create a select element (dropdown) with options
        let select = document.createElement('select');
        select.id = 'streamingOptions';

        // Add the streaming options
        let options = [
            {name: 'HydraHD', url: 'https://hydrahd.cc/index.php?menu=search&query='},
            {name: 'Kipstream', url: 'https://kipstream.lol/search?query='},
            {name: 'Nunflix', url: 'https://nunflix.org/search/'},
            {name: 'popcornmovies', url: 'https://popcornmovies.to/search/'},
            {name: 'autoembed', url: 'https://watch.autoembed.cc/search?query='},
            {name: 'streamflix', url: 'https://watch.streamflix.one/tv?search='},
            {name: 'fmovies.co', url: 'https://ww4.fmovies.co/search/?q='},
            {name: 'smashystream', url: 'https://smashystream.xyz/search?query='},
        ];

        // Create the option elements and append them to the select element
        options.forEach(option => {
            let opt = document.createElement('option');
            opt.value = option.url;
            opt.textContent = option.name;
            select.appendChild(opt);
        });

        // Create a button to search using the selected option
        let button = document.createElement('button');
        button.textContent = 'Search';
        button.style.marginLeft = '10px';

        // When the button is clicked, open the selected option's search URL in a new tab
        button.addEventListener('click', function() {
            let selectedOption = document.getElementById('streamingOptions').value;
            window.open(selectedOption + movieId, '_blank');
        });

        // Create a 'Try Next' button
        let tryNextButton = document.createElement('button');
        tryNextButton.textContent = 'Try Next';
        tryNextButton.style.marginLeft = '10px';

        // When 'Try Next' is clicked, select the next option and trigger the search
        tryNextButton.addEventListener('click', function() {
            let selectElement = document.getElementById('streamingOptions');
            if (selectElement.selectedIndex < selectElement.options.length - 1) {
                selectElement.selectedIndex += 1;  // Move to next option
            } else {
                selectElement.selectedIndex = 0;  // Loop back to the first option
            }
            button.click();  // Trigger the search button
        });

        // Style the div and append the select and buttons
        div.style.display = "inline-block";
        div.style.position = "fixed";
        div.style.left = "1%";
        div.style.bottom = "1%";
        div.style.zIndex = '999999';
        div.appendChild(select);
        div.appendChild(button);
        div.appendChild(tryNextButton);  // Append the 'Try Next' button

        // Append the div to the body
        document.body.append(div);
    }

    function getMovieId() {
        let h1Element = document.querySelector('h1');
        if (h1Element && h1Element.textContent.trim()) {
            let movieId = h1Element.textContent.trim();
            if (movieId.includes('(')) {
                movieId = movieId.replace(/\(.*?\)/g, '').trim();
            }
            return movieId;
        }

        // Fallback to document title if h1 is not available
        let title = document.title;
        let arr = title.split(' - ');

        let fallbackId = arr[0] ? arr[0].trim() : null;
        if (fallbackId && !fallbackId.includes('(')) {
            return fallbackId;
        }

        return null;
    }

    // Initial call to get the movieId and create the dropdown
    let movieId = getMovieId();
    if (movieId) {
        createDropdown(movieId);
    }

    // Listen for URL changes via popstate (history navigation) and mutation observer (AJAX navigation)
    function observeUrlChanges() {
        // Observe history changes (e.g., back/forward button)
        window.addEventListener('popstate', function() {
            let newMovieId = getMovieId();
            if (newMovieId !== movieId) {
                movieId = newMovieId;
                createDropdown(movieId); // Recreate the dropdown with the new movieId
            }
        });

        // Use MutationObserver to detect URL changes caused by AJAX
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    let newMovieId = getMovieId();
                    if (newMovieId !== movieId) {
                        movieId = newMovieId;
                        createDropdown(movieId); // Recreate the dropdown with the new movieId
                    }
                }
            });
        });

        // Start observing the document's <title> element to detect changes
        observer.observe(document.querySelector('title'), { childList: true });
    }

    // Call the function to observe URL changes
    observeUrlChanges();

})();
