// ==UserScript==
// @name         Movie Ratings Inserter
// @namespace    https://anthelion.me/torrents.php
// @version      1.1
// @description  Insert movie ratings between genres and images in the gallery display
// @author       EnigmaticBacon
// @match        https://anthelion.me/torrents.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488100/Movie%20Ratings%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/488100/Movie%20Ratings%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetNode = document.body;

    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        if (document.querySelector('.ant-userscript-gallery-group')) {
            observer.disconnect();
            insertMovieRatings();
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
    const createRatingContainer = (iconSrc, altText, rating) => {
        const container = document.createElement('div');
        const icon = document.createElement('img');
        icon.src = iconSrc;
        icon.alt = altText;
        icon.style.height = '16px';
        icon.style.width = 'auto';
        icon.style.verticalAlign = 'middle';
        icon.style.marginRight = '5px';

        container.appendChild(icon);
        container.appendChild(document.createTextNode(rating ? rating : '-'));
        container.style.flex = '3';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        return container;
    };

    // Function to insert movie ratings
    const insertMovieRatings = () => {
        document.querySelectorAll('.ant-userscript-gallery-group').forEach(group => {
            const ratingsDiv = document.createElement('div');
            ratingsDiv.style.marginTop = '5px'; // Add some margin for visual separation

            const anchorElement = group.querySelector('.torrent_title');
            if (anchorElement) {
                const href = anchorElement.getAttribute('href');
                const urlParams = new URLSearchParams(href.split('?')[1]);
                const torrentId = urlParams.get('id');

                const correspondingGroupElement = document.querySelector(`img[id="${torrentId}"]`);
                if (correspondingGroupElement) {
                    const browseRatings = correspondingGroupElement.closest('.group').querySelectorAll('.browse_rating');

                    let imdbRating = '-', tmdbRating = '-', rtRating = '-';

                    browseRatings.forEach(ratingDiv => {
                        const ratingText = ratingDiv.textContent.trim();
                        const ratingValue = ratingDiv.querySelector('a') ? ratingDiv.querySelector('a').nextSibling.textContent.trim() : null;

                        if (ratingDiv.innerHTML.includes('IMDb:') && ratingValue && ratingValue !== "0.0") {
                            imdbRating = ratingValue.match(/[\d.]+/)[0]; // Extract numerical value
                        }
                        if (ratingDiv.innerHTML.includes('TMDb:') && ratingValue && ratingValue !== "0") {
                            tmdbRating = ratingValue.match(/[\d.]+/)[0] + '%'; // Extract percentage value
                        }
                        if (ratingDiv.innerHTML.includes('RT:') && ratingValue && ratingValue !== "0") {
                            rtRating = ratingValue.match(/[\d.]+/)[0] + '%'; // Extract percentage value
                        }
                    });

                    // Add IMDb icon and ratings for IMDb, TMDb, and RT
                    const imdbIcon = document.createElement('img');
                    imdbIcon.src = 'https://ptpimg.me/0kpog5.png';
                    imdbIcon.alt = 'IMDb Rating';
                    imdbIcon.style.height = '16px';
                    imdbIcon.style.width = 'auto';
                    imdbIcon.style.verticalAlign = 'middle';
                    imdbIcon.style.marginRight = '5px';

                    const RTIcon = document.createElement('img');
                    RTIcon.src = 'https://ptpimg.me/j7isf9.png';
                    RTIcon.alt = 'Rotten Tomatoes Rating';
                    RTIcon.style.height = '16px';
                    RTIcon.style.width = 'auto';
                    RTIcon.style.verticalAlign = 'middle';
                    RTIcon.style.marginRight = '5px';

                    const tmdbIcon = document.createElement('img');
                    tmdbIcon.src = 'https://ptpimg.me/2cr88r.png';
                    tmdbIcon.alt = 'TMDb Rating';
                    tmdbIcon.style.height = '16px';
                    tmdbIcon.style.width = 'auto';
                    tmdbIcon.style.verticalAlign = 'middle';
                    tmdbIcon.style.marginRight = '5px';

                    ratingsDiv.style.display = 'flex';
                    ratingsDiv.style.justifyContent = 'space-between';
                    ratingsDiv.style.alignItems = 'center';

                    // Create rating containers
                    const tmdbContainer = createRatingContainer('https://ptpimg.me/2cr88r.png', 'TMDb Rating', tmdbRating);
                    const imdbContainer = createRatingContainer('https://ptpimg.me/0kpog5.png', 'IMDb Rating', imdbRating);
                    const rtContainer = createRatingContainer('https://ptpimg.me/j7isf9.png', 'Rotten Tomatoes Rating', rtRating);

                    // Create empty divs for padding
                    const paddingDivLeft = document.createElement('div');
                    paddingDivLeft.style.flex = '1';

                    const paddingDivRight = document.createElement('div');
                    paddingDivRight.style.flex = '1';

                    // Append elements to the ratings div
                    ratingsDiv.appendChild(paddingDivLeft); // Empty div for left padding
                    ratingsDiv.appendChild(tmdbContainer); // TMDb rating in the second section
                    ratingsDiv.appendChild(imdbContainer); // IMDb rating in the center section
                    ratingsDiv.appendChild(rtContainer); // RT rating in the fourth section
                    ratingsDiv.appendChild(paddingDivRight); // Empty div for right padding
                }
            }

            const genreElement = group.querySelector('.ant-userscript-gallery-details');
            if (genreElement) {
                genreElement.parentNode.insertBefore(ratingsDiv, genreElement);
            }
        });
    };
})();
