// ==UserScript==
// @name        trakt.tv Streaming Services Integration
// @match       https://trakt.tv/movies/*
// @match       https://trakt.tv/shows/*
// @grant       none
// @version     1.8.4.3
// @license     GPLv3
// @icon        https://icons.duckduckgo.com/ip2/trakt.tv.ico
// @description Adds P-Stream, Hexa, XPrime, Rive, Cineby, Moviemaze, Wovie, and BrocoFlix buttons to the overview page of shows and movies
// @run-at      document-end
// @namespace   https://greasyfork.org/users/1257939
// @downloadURL https://update.greasyfork.org/scripts/486706/trakttv%20Streaming%20Services%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/486706/trakttv%20Streaming%20Services%20Integration.meta.js
// ==/UserScript==

(function() {
    // Extract and sanitize URL details
    const extractDetailsFromUrl = (url) => {
        try {
            const parts = url.split("/");
            return {
                tmdbId: parts[4],
                season: parts[6] || 1, // Default to first season on show overview page
                episode: parts[8] || 1, // Default to first episode on season overview page
            };
        } catch (error) {
            console.error("Failed to extract URL details:", error);
            return null;
        }
    };

    // Sanitize the title by removing year suffix if present
    const sanitizeTitle = (title) => {
        try {
            return title.replace(/-\d{4}$/, '');
        } catch (error) {
            console.error("Failed to sanitize title:", error);
            return title;
        }
    };

    // Create a new link element with appropriate attributes
    const createNewLinkElement = (suffix, targetUrl, textContent) => {
        try {
            const linkElement = document.createElement('a');
            linkElement.target = "_blank";
            linkElement.id = `external-link-${textContent.toLowerCase().replace(" ", "-")}`;
            linkElement.href = `${targetUrl}/${suffix}`;
            linkElement.dataset.originalTitle = "";
            linkElement.title = "";
            linkElement.textContent = textContent;
            return linkElement;
        } catch (error) {
            console.error("Failed to create new link element:", error);
            return null;
        }
    };

    // Create external links based on the extracted details
    const createExternalLink = () => {
        try {
            const tmdbLink = document.getElementById("external-link-tmdb");
            if (!tmdbLink) {
                console.error("TMDB link doesn’t exist.");
                return;
            }

            const { tmdbId, season, episode } = extractDetailsFromUrl(tmdbLink.href);
            const title = sanitizeTitle(location.pathname.split("/")[2]); // Extract title from location
            const showMovie = location.pathname.split("/")[1] === "movies" ? "movie" : "tv";
            const buttonsPath = document.querySelector('.external > li');

            if (!buttonsPath) {
                console.error("Path for buttons doesn’t exist.");
                return;
            }

            const linkElements = [
                createNewLinkElement(
                    `embed/tmdb-${showMovie}-${tmdbId}/${season}/${episode}`,
                    'https://iframe.pstream.mov',
                    'P-Stream'
                ),
                createNewLinkElement(
                    `watch/${showMovie}/${tmdbId}/${season}/${episode}`,
                    'https://hexa.watch',
                    'Hexa'
                ),
                createNewLinkElement(
                    `watch/${tmdbId}/${showMovie === 'tv' ? `${season}/${episode}` : ''}`,
                    'https://xprime.tv',
                    'XPrime'
                ),
                createNewLinkElement(
                    `watch?type=${showMovie}&id=${tmdbId}${showMovie === 'tv' ? `&season=${season}&episode=${episode}` : ''}`,
                    'https://rivestream.org',
                    'Rive'
                ),
                createNewLinkElement(
                    `${showMovie}/${tmdbId}${showMovie === 'tv' ? `/${season}/${episode}` : ''}`,
                    'https://www.cineby.app',
                    'Cineby'
                ),
                createNewLinkElement(
                    `watch/${showMovie}/${tmdbId}${showMovie === 'tv' ? `?season=${season}&ep=${episode}` : ''}`,
                    'https://moviemaze.cc',
                    'Moviemaze'
                ),
                createNewLinkElement(
                    `play/${title}-${showMovie}-${tmdbId}/${showMovie === 'tv' ? `?season=${season}&episode=${episode}` : ''}`,
                    'https://wovie.vercel.app',
                    'Wovie'
                ),
                createNewLinkElement(
                    `pages/info?id=${tmdbId}&type=${showMovie}`,
                    'https://brocoflix.com',
                    'BrocoFlix'
                ),
            ];

            linkElements.forEach(function(linkElement) {
                if (linkElement) {
                    buttonsPath.appendChild(linkElement);
                } else {
                    console.log("Failed to create link element:", linkElement);
                }
            });
        } catch (error) {
            console.error("Failed to create external links:", error);
        }
    };

    // Initialize the function when the page loads
    window.addEventListener('load', () => {
        createExternalLink();
    });
})();