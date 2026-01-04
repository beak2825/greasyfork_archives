// ==UserScript==
// @name         IMDb Watcher
// @namespace    https://www.imdb.com/
// @icon         https://vidsrc.net/template/vidsrc-ico.png
// @version      2.1.1
// @description  Watch movies & series for free on IMDb
// @author       cevoj35548
// @license      MIT
// @match        https://*.imdb.com/title/*
// @grant        GM_xmlhttpRequest
// @connect      api.themoviedb.org
// @downloadURL https://update.greasyfork.org/scripts/523385/IMDb%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/523385/IMDb%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sources = [{
            name: 'VidLink',
            urls: {
                movie: 'https://vidlink.pro/movie/{id}?autoplay=true',
                tv: 'https://vidlink.pro/tv/{id}/{season}/{episode}?autoplay=true'
            },
            tmdb: true,
        },
        {
            name: 'Embed.su',
            urls: {
                movie: 'https://embed.su/embed/movie/{id}/1/1',
                tv: 'https://embed.su/embed/tv/{id}/{season}/{episode}'
            },
        },
        {
            name: 'SuperEmbed',
            urls: {
                movie: 'https://multiembed.mov/?video_id={id}',
                tv: 'https://multiembed.mov/?video_id={id}&s={season}&e={episode}'
            },
        },
        {
            name: '2Embed',
            urls: {
                movie: 'https://www.2embed.stream/embed/movie/{id}',
                tv: 'https://www.2embed.stream/embed/tv/{id}/{season}/{episode}'
            },
        }
    ];

    const buttonSpacing = 10; // Space between buttons
    const tmdbCache = {}; // Cache the imdb -> tmdb resps

    // helper to convert IMDb IDs to TMDb IDs
    async function getTmdbID(imdbId) {
        // check cache
        if (tmdbCache[imdbId]) {
            console.log(`Cache hit for ${imdbId}`);
            return tmdbCache[imdbId];
        }

        // fetch
        console.log(`Fetching TMDb ID for ${imdbId}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.themoviedb.org/3/find/${imdbId}?api_key=8d6d91941230817f7807d643736e8a49&language=en-US&external_source=imdb_id`,
                onload: function(response) {
                    const respJson = JSON.parse(response.responseText);
                    const tmdbId =
                        respJson.tv_results?.[0]?.id ||
                        respJson.movie_results?.[0]?.id ||
                        respJson.tv_episode_results?.[0]?.show_id;
                    if (!tmdbId) {
                        reject("No TMDb ID found");
                        return;
                    }
                    console.log(`TMDb ID: ${tmdbId}`);
                    tmdbCache[imdbId] = tmdbId; // cache the result
                    resolve(tmdbId);
                },
            });
        });
    }

    // extract season and episode numbers from the IMDb page
    function extractSeasonEpisode() {
        const seasonEpisodeDiv = document.querySelector('[data-testid="hero-subnav-bar-season-episode-numbers-section"]');
        if (seasonEpisodeDiv) {
            const seasonEpisodeText = seasonEpisodeDiv.textContent.trim();
            const match = seasonEpisodeText.match(/S(\d+).E(\d+)/);
            if (match) {
                return {
                    season: match[1],
                    episode: match[2],
                };
            }
        }
        return null;
    }

    // extract the series ID from the IMDb page
    function extractSeriesId() {
        const seriesLink = document.querySelector('[data-testid="hero-title-block__series-link"]');
        if (seriesLink) {
            const href = seriesLink.getAttribute('href');
            const match = href.match(/\/title\/(tt\d+)\//);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    // generate the URL for a specific source
    async function generateUrl(urls, isMovie, isEpisode, imdbId, seriesId, seasonEpisode, isTmdb) {
        imdbId = seriesId || imdbId;
        if (isTmdb) {
            imdbId = await getTmdbID(imdbId);
        }

        if (isMovie && isEpisode) {
            return urls.movie.replace('{id}', imdbId);
        }

        if (seasonEpisode && seriesId) {
            const {
                season,
                episode
            } = seasonEpisode;
            return urls.tv.replace('{id}', imdbId).replace('{season}', season).replace('{episode}', episode);
        } else {
            return urls.tv.replace('{id}', imdbId).replace('{season}', '1').replace('{episode}', '1');
        }
    }

    // create the iframe only once
    const createIframe = (defaultUrl) => {
        const mainEl = document.querySelector('main');
        const iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'height:800px; width:100%;');
        iframe.id = "Player";
        iframe.allowFullscreen = "true";
        iframe.webkitallowfullscreen = "true";
        iframe.mozallowfullscreen = "true";
        iframe.src = defaultUrl;
        mainEl.before(iframe);
        return iframe;
    };

    const imdbId = window.location.pathname.split('/')[2];
    const isMovie = document.title.indexOf('TV Series') === -1;
    const isEpisode = document.title.indexOf('TV Episode') === -1;
    const seasonEpisode = extractSeasonEpisode();
    const seriesId = extractSeriesId();

    // initialize the iframe with the first source as default
    (async () => {
        const defaultUrl = await generateUrl(
            sources[0].urls,
            isMovie,
            isEpisode,
            imdbId,
            seriesId,
            seasonEpisode,
            !!sources[0].tmdb
        );
        const iframe = createIframe(defaultUrl);
        document.querySelector('section.ipc-page-section').setAttribute('style', 'padding-top: 10px;')

        // add buttons to switch sources
        const mainEl = document.querySelector('main');
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.zIndex = '1000';

        let selectedButton = null;

        sources.forEach((source, index) => {
            const button = document.createElement('button');
            button.textContent = `📽 Source - ${source.name}`;
            button.style.fontFamily = 'Arial';
            button.style.marginBottom = `${buttonSpacing}px`;
            button.style.padding = '10px';
            button.style.background = '#3B3A3C';
            button.style.color = '#ffffff';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.borderRadius = '6px';
            button.style.boxShadow =
                '0 10px 8px rgb(0 0 0 / 0.05), 0 4px 3px rgb(0 0 0 / 0.1)';

            // highlight selected button
            const highlightButton = (btn) => {
                if (selectedButton) {
                    selectedButton.style.border = 'none';
                }
                selectedButton = btn;
                btn.style.border = '2px solid #FFD700';
            };

            // button click handler
            button.addEventListener('click', async () => {
                highlightButton(button);
                button.textContent = "⏳ Loading...";
                button.disabled = true;

                try {
                    const url = await generateUrl(source.urls, isMovie, isEpisode, imdbId, seriesId, seasonEpisode, !!source.tmdb);
                    console.log('Reloading iframe');
                    document.querySelector('iframe#Player').remove()
                    createIframe(url);
                } catch (error) {
                    console.error("Error generating URL:", error);
                    alert(`Failed to generate URL: ${error}`);
                } finally {
                    button.textContent = `📽 Source - ${source.name}`;
                    button.disabled = false;
                }
            });

            // set the first button as highlighted
            if (index === 0) {
                highlightButton(button);
            }

            buttonContainer.appendChild(button);
        });

        // Add "Open in Popup" button
        const popupButton = document.createElement('button');
        popupButton.textContent = "⛶  Open in Popup";
        popupButton.style.position = 'absolute';
        popupButton.style.top = '10px';
        popupButton.style.left = '10px';
        popupButton.style.padding = '10px';
        popupButton.style.background = '#3B3A3C';
        popupButton.style.color = '#ffffff';
        popupButton.style.border = 'none';
        popupButton.style.cursor = 'pointer';
        popupButton.style.fontWeight = 'bold';
        popupButton.style.borderRadius = '6px';
        popupButton.style.boxShadow =
            '0 10px 8px rgb(0 0 0 / 0.02), 0 4px 3px rgb(0 0 0 / 0.1)';
        popupButton.addEventListener('click', () => {
            window.open(document.querySelector('iframe#Player').src, '_blank', 'width=800,height=600,scrollbars=yes');
        });

        mainEl.style.position = 'relative';
        mainEl.appendChild(buttonContainer);
        mainEl.appendChild(popupButton);
    })();
})();