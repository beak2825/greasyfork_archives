// ==UserScript==
// @name         IMDB Streaming Service
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Allows people to watch any movie or TV show directly from the IMDb website
// @author       Tristan Reeves
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509156/IMDB%20Streaming%20Service.user.js
// @updateURL https://update.greasyfork.org/scripts/509156/IMDB%20Streaming%20Service.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentKeyIndex = 0;

    function getColor() {
        return hexCode[currentKeyIndex].substring(1);
    }

    function rotateKey() {
        currentKeyIndex = (currentKeyIndex + 1) % hexCode.length;
    }

    // Inject Font Awesome CSS
    function injectFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    }

    function getIframe(url) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '600';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        return iframe;
    }
    const hexCode = ['#3a00944e', '#c9e1059a', '#594b3352', '#3fb62173', '#6afacd8a'];

    function createControlButtons() {
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.position = 'relative';

        // Previous Episode Button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<i class="fas fa-backward"></i>';
        prevButton.title = 'Previous Episode';
        prevButton.style.fontSize = '20px';
        prevButton.style.border = 'none';
        prevButton.style.backgroundColor = 'transparent';
        prevButton.style.cursor = 'pointer';
        prevButton.style.marginRight = '10px';

        // Next Episode Button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<i class="fas fa-forward"></i>';
        nextButton.title = 'Next Episode';
        nextButton.style.fontSize = '20px';
        nextButton.style.border = 'none';
        nextButton.style.backgroundColor = 'transparent';
        nextButton.style.cursor = 'pointer';

        container.appendChild(prevButton);
        container.appendChild(nextButton);

        return { container, prevButton, nextButton };
    }

    function createInputFields() {
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.position = 'relative';

        const seasonLabel = document.createElement('label');
        seasonLabel.textContent = 'Season: ';
        const seasonInput = document.createElement('input');
        seasonInput.type = 'number';
        seasonInput.min = 1; // Keep minimum as 1 but allow any number initially
        seasonLabel.appendChild(seasonInput);

        const episodeLabel = document.createElement('label');
        episodeLabel.textContent = ' Episode: ';
        const episodeInput = document.createElement('input');
        episodeInput.type = 'number';
        episodeInput.min = 1; // Keep minimum as 1 but allow any number initially
        episodeLabel.appendChild(episodeInput);

        const messageContainer = document.createElement('span');
        messageContainer.style.marginLeft = '10px';
        messageContainer.style.transition = 'opacity 2s';
        messageContainer.style.display = 'inline-block';
        messageContainer.style.position = 'absolute';

        container.appendChild(seasonLabel);
        container.appendChild(episodeLabel);
        container.appendChild(messageContainer);

        return { container, seasonInput, episodeInput, messageContainer };
    }

    function showMessage(messageContainer, message) {
        messageContainer.textContent = message;
        messageContainer.style.opacity = '1';
        setTimeout(() => {
            messageContainer.style.opacity = '0';
        }, 3000);
    }

    async function fetchShowDetails(imdbCode) {
        let data;
        try {
            const response = await fetch(`https://www.omdbapi.com/?i=${imdbCode}&apikey=${getColor()}`);
            data = await response.json();
        } catch (error) {
            rotateKey();
            return fetchShowDetails(imdbCode);
        }
        return data;
    }

    async function fetchMaxEpisodesPerSeason(imdbCode, totalSeasons) {
        const maxEpisodesPerSeason = [];
        for (let season = 1; season <= totalSeasons; season++) {
            try {
                const response = await fetch(`https://www.omdbapi.com/?i=${imdbCode}&Season=${season}&apikey=${getColor()}`);
                const seasonData = await response.json();
                maxEpisodesPerSeason[season] = seasonData.Episodes.length;
            } catch (error) {
                rotateKey();
                season--;
            }
        }
        return maxEpisodesPerSeason;
    }

    function saveLastWatched(imdbCode, season, episode) {
        localStorage.setItem(`lastWatched_${imdbCode}`, JSON.stringify({ season, episode }));
    }

    function getLastWatched(imdbCode) {
        const lastWatched = localStorage.getItem(`lastWatched_${imdbCode}`);
        return lastWatched ? JSON.parse(lastWatched) : null;
    }

    // Inject Font Awesome CSS
    injectFontAwesome();

    const currentUrl = window.location.href;
    const idMatch = currentUrl.match(/title\/(tt\d+)\//);
    const imdbCode = idMatch ? idMatch[1] : null;

    if (!imdbCode) { return }

    const videoTypeMeta = document.querySelector('meta[property="og:type"]');
    const videoType = videoTypeMeta ? videoTypeMeta.getAttribute('content') : null;

    if (!videoType) { return }

    let embedUrl = '';

    if (videoType === 'video.movie') {
        embedUrl = `https://multiembed.mov/directstream.php?video_id=${imdbCode}`;
    } else if (videoType === 'video.tv_show') {
        embedUrl = `https://multiembed.mov/directstream.php?video_id=${imdbCode}&s=1&e=1`;
    }

    if (embedUrl) {
        const result = document.evaluate(
            '//*[@id="__next"]/main/div/section[1]/section/div[3]/section/section/div[2]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        const topDiv = result.singleNodeValue;
        if (topDiv) {
            const iframe = getIframe(embedUrl);
            topDiv.insertAdjacentElement("afterend", iframe);

            if (videoType === 'video.tv_show') {
                // Create control buttons and input fields
                const { container: buttonsContainer, prevButton, nextButton } = createControlButtons();
                iframe.insertAdjacentElement("afterend", buttonsContainer);

                const { container, seasonInput, episodeInput, messageContainer } = createInputFields();
                buttonsContainer.insertAdjacentElement("afterend", container);

                // Load last watched season and episode if available
                const lastWatched = getLastWatched(imdbCode);
                if (lastWatched) {
                    seasonInput.value = lastWatched.season;
                    episodeInput.value = lastWatched.episode;
                    iframe.src = `https://multiembed.mov/directstream.php?video_id=${imdbCode}&s=${lastWatched.season}&e=${lastWatched.episode}`;
                } else {
                    // Set default values if no last watched data is found
                    seasonInput.value = 1;
                    episodeInput.value = 1;
                }

                // Update iframe src and save state when inputs change (immediate effect without validation)
                function updateIframeSrcAndSave() {
                    const season = parseInt(seasonInput.value, 10);
                    const episode = parseInt(episodeInput.value, 10);
                    iframe.src = `https://multiembed.mov/directstream.php?video_id=${imdbCode}&s=${season}&e=${episode}`;
                    saveLastWatched(imdbCode, season, episode);
                }

                // Fetch details and validate inputs
                fetchShowDetails(imdbCode).then(data => {
                    if (data.Type === 'series') {
                        const totalSeasons = parseInt(data.totalSeasons, 10);
                        fetchMaxEpisodesPerSeason(imdbCode, totalSeasons).then(maxEpisodesPerSeason => {
                            // Validate season input
                            seasonInput.addEventListener('input', () => {
                                let season = parseInt(seasonInput.value, 10);
                                if (season < 1) {
                                    season = 1;
                                    showMessage(messageContainer, 'Number of seasons must be at least 1.');
                                } else if (season > totalSeasons) {
                                    season = totalSeasons;
                                    showMessage(messageContainer, `Season cannot exceed ${totalSeasons}.`);
                                }
                                seasonInput.value = season;
                                updateIframeSrcAndSave();
                            });

                            // Validate episode input
                            episodeInput.addEventListener('input', () => {
                                let season = parseInt(seasonInput.value, 10);
                                let episode = parseInt(episodeInput.value, 10);
                                if (episode < 1) {
                                    episode = 1;
                                    showMessage(messageContainer, 'Number of episodes must be at least 1.');
                                } else if (episode > maxEpisodesPerSeason[season]) {
                                    episode = maxEpisodesPerSeason[season];
                                    showMessage(messageContainer, `Season ${season} contains only ${maxEpisodesPerSeason[season]} episodes.`);
                                }
                                episodeInput.value = episode;
                                updateIframeSrcAndSave();
                            });

                            // Button event listeners
                            prevButton.addEventListener('click', () => {
                                let season = parseInt(seasonInput.value, 10);
                                let episode = parseInt(episodeInput.value, 10);
                                if (episode > 1) {
                                    episode--;
                                } else if (season > 1) {
                                    season--;
                                    episode = maxEpisodesPerSeason[season]; // Reset to the first episode of the previous season
                                } else {
                            showMessage(messageContainer, 'This is the first episode of the first season.');
                            return;
                        }
                                if (season < 1) {
                                    season = 1;
                                }
                                if (episode < 1) {
                                    episode = 1;
                                }
                                seasonInput.value = season;
                                episodeInput.value = episode;
                                updateIframeSrcAndSave();
                            });

                            nextButton.addEventListener('click', () => {
                                let season = parseInt(seasonInput.value, 10);
                                let episode = parseInt(episodeInput.value, 10);
                                if (episode < maxEpisodesPerSeason[season]) {
                                    episode++;
                                } else if (season < totalSeasons) {
                                    season++;
                                    episode = 1; // Reset to the first episode of the next season
                                } else {
                            showMessage(messageContainer, 'This is the last episode of the last season.');
                            return;
                        }
                                if (season > totalSeasons) {
                                    season = totalSeasons;
                                }
                                if (episode > maxEpisodesPerSeason[season]) {
                                    episode = maxEpisodesPerSeason[season];
                                }
                                seasonInput.value = season;
                                episodeInput.value = episode;
                                updateIframeSrcAndSave();
                            });
                        });
                    }
                });
            }
        }
    }
})();
