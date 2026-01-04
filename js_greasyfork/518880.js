// ==UserScript==
// @name         AuntJudys Images & Videos
// @namespace    https://greasyfork.org/en/users/1384264-atman
// @version      2024-11-24
// @description  Access to full size content and download buttons
// @author       atman
// @match        *://*.auntjudys.com/tour/scenes/*highres.html
// @match        *://*.auntjudys.com/tour/scenes/*vids.html
// @match        *://*.auntjudysxxx.com/tour/scenes/*highres.html
// @match        *://*.auntjudysxxx.com/tour/scenes/*vids.html
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/518880/AuntJudys%20Images%20%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/518880/AuntJudys%20Images%20%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const galleryBlock = document.querySelector('.photo_gallery_block');
    const movieBlock = document.querySelector('.movie_wrapper');
    const photoHolders = document.querySelectorAll('.photo_gallery_thumbnail_wrapper img');

    // Function to replace trailer with full video
    function updatePlayingVideo() {
        if (df_movie && df_movie.length > 0 && df_movie[0].path.includes("trailer")) {
            df_movie[0].path = df_movie[0].path.replace("trailer", "720p");
            load_default_movie();
        } else {
            // Retry after a short delay
            setTimeout(checkForTrailerpAvailability, 500);
        }
    }

    const updateImageLinks = () => {
        if (photoHolders) {
            photoHolders.forEach(img => {
                const originalSrc = img.src;
                const fullImageUrl = originalSrc.replace('thumbs', 'fullwatermarked');

                // Set the link
                const link = img.parentNode;
                link.href = fullImageUrl;
                link.target = '_blank';
            });

            const match = photoHolders[1].src.match(/upload\/(\w+)\/(\w+)\/(\w+)(?=\/\/thumbs)/);
            const Letter = match[1];
            const model = match[2];
            const galleryNumber = match[3];
            const downloadUrl = `content/upload/${Letter}/${model}/${galleryNumber}/${galleryNumber}_full.zip`;

            // Create a single download button
            if (downloadUrl) {
                const downloadButton = document.createElement('a');
                downloadButton.href = downloadUrl;
                downloadButton.textContent = 'Download ZIP';
                downloadButton.style.cssText = `
            display: block;
            margin-bottom: 10px;
            padding: 10px 10px;
            background: linear-gradient(90deg, #00d478, #297d58);
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            transition: background 0.5s linear;
            `;

                galleryBlock.insertBefore(downloadButton, galleryBlock.firstChild);
            }
        }
    };

    const updateVideo = () => {
        const playerOptions = document.querySelector('.player_options');
        if (playerOptions) {
            playerOptions.style.display = 'none';
        }

        const formatSelectMenu = document.querySelector('.format_select_menu');
        if (formatSelectMenu) {
            formatSelectMenu.style.display = 'block';

            const movieFormatSelect = document.getElementById('movieformat_select');
            const downloadSelect = document.getElementById('download_select');

            const updateOptions = (selectElement, setPath = true) => {
                Array.from(selectElement.options).forEach(option => {
                    option.removeAttribute('data-trial');
                    const resolutionMatch = option.text.match(/(480p|720p|1080p)/);
                    if (resolutionMatch) {
                        const ident = df_movie[0].path;
                        const extractedIdent = ident.split('trailer/')[1].split('.mp4')[0];

                        const resolution = resolutionMatch[0];
                        option.value = resolution;
                        const originalPath = movie[resolution][extractedIdent].vtt_file;
                        const path = originalPath.replace(/\.vtt$/, '').replace(/\/vtt\//, '/');
                        movie[resolution][extractedIdent].path = path;
                        option.value = setPath ? path : resolution+":"+extractedIdent;
                    }
                });
            };

            const filterOptions = (selectElement) => {
                Array.from(selectElement.options).forEach(option => {
                    if (option.text.includes('HLS')) {
                        option.remove();
                    }
                });
            };

            if (downloadSelect) {
                updateOptions(movieFormatSelect, false);
                updateOptions(downloadSelect, true);
                filterOptions(movieFormatSelect);
                filterOptions(downloadSelect);
            }
        }
    }

    const main = () => {
        if (galleryBlock) {
            updateImageLinks();
        }
        if (movieBlock) {
            updateVideo();
            updatePlayingVideo();
        }
    };

    main();
})();