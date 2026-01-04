// ==UserScript==
// @name         Bs.to Filler Episode Checker
// @name:en      Bs.to Filler Episode Checker
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  Markiert Filler Episoden mit einem roten "F"
// @description:en Mark filler episodes with a red "F"
// @author       Ai
// @match        https://bs.to/serie/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.jikan.moe
// @connect      animefillerlist.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522150/Bsto%20Filler%20Episode%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/522150/Bsto%20Filler%20Episode%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of German proxies
    const proxies = [
        '141.147.9.254:80',
        '134.255.179.138:3128',
        '37.60.232.250:3128',
        '5.252.224.41:58071',
        '162.55.161.159:3128'
    ];

    // Function to replace spaces with hyphens in the anime name
    const replaceSpacesWithHyphens = (animeName) => animeName.replace(/\s+/g, '-');

    // Function to make a request with a random proxy and fallback to normal IP
    const makeRequest = (url, proxies, onSuccess, onError) => {
        const shuffledProxies = [...proxies].sort(() => 0.5 - Math.random());
        let currentProxyIndex = 0;

        function attemptRequest() {
            if (currentProxyIndex >= shuffledProxies.length) {
                // Fallback to a direct request if all proxies fail
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: onSuccess,
                    onerror: onError
                });
                return;
            }

            const proxy = shuffledProxies[currentProxyIndex++];
            // Attempting request with a proxy
            GM_xmlhttpRequest({
                method: "GET",
                url,
                proxy,
                onload: onSuccess,
                onerror: attemptRequest // Retry with the next proxy
            });
        }

        attemptRequest();
    };

    // Function to fetch filler data from AnimeFillerList.com
    const fetchFillerDataFromAnimeFillerList = (animeName, callback) => {
        const url = `https://www.animefillerlist.com/shows/${replaceSpacesWithHyphens(animeName)}`;
        makeRequest(url, proxies, (response) => {
            if (response.status === 200) {
                // Parse the HTML response to extract filler episodes
                const fillerEpisodes = [];
                const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                const rows = doc.querySelectorAll(".EpisodeList tbody tr");

                rows.forEach(row => {
                    const type = row.querySelector("td.Type span")?.textContent.trim().toLowerCase();
                    const episodeNumber = row.querySelector("td.Number")?.textContent.trim();
                    if (type === "filler" && episodeNumber) {
                        fillerEpisodes.push(parseInt(episodeNumber, 10));
                    }
                });

                callback(fillerEpisodes);
            } else {
                // Return an empty array if the response is invalid
                callback([]);
            }
        }, () => callback([]));
    };

    // Function to fetch filler data from Jikan API
    const fetchFillerDataFromJikan = (animeName, callback) => {
        const url = `https://api.jikan.moe/v4/anime?q=${replaceSpacesWithHyphens(animeName)}&limit=1`;
        makeRequest(url, proxies, (response) => {
            if (response.status === 200) {
                const animeId = JSON.parse(response.responseText)?.data?.[0]?.mal_id;
                if (animeId) {
                    const episodesUrl = `https://api.jikan.moe/v4/anime/${animeId}/episodes`;
                    makeRequest(episodesUrl, proxies, (resp) => {
                        if (resp.status === 200) {
                            // Extract filler episodes using the Jikan API response
                            const fillerEpisodes = JSON.parse(resp.responseText).data
                                .filter(episode => episode.filler)
                                .map(episode => parseInt(episode.mal_id, 10));
                            callback(fillerEpisodes);
                        } else {
                            callback([]);
                        }
                    }, () => callback([]));
                } else {
                    callback([]);
                }
            } else {
                callback([]);
            }
        }, () => callback([]));
    };

    // Function to mark filler episodes with a red "F"
    const markFillerEpisodes = (fillerEpisodes) => {
        // Select all episode elements from the webpage
        const allEpisodeElements = [
            ...document.querySelectorAll("#root > section > table > tbody > tr > td:nth-child(2) > a:nth-child(2)"),
            ...document.querySelectorAll("#root > section > div.episode > h2 > span")
        ];

        allEpisodeElements.forEach(episodeElement => {
            const match = episodeElement.textContent.trim().match(/Episode (\d+)/);
            if (match && fillerEpisodes.includes(parseInt(match[1], 10))) {
                // Add a red "F" mark to filler episodes
                const fillerMark = document.createElement("span");
                fillerMark.textContent = "F ";
                fillerMark.style.color = "red";
                fillerMark.style.fontWeight = "bold";
                episodeElement.prepend(fillerMark);
            }
        });
    };

    // Function to extract the anime names from the webpage
    const getAnimeNamesFromWebpage = () => {
        const animeNameElement = document.querySelector("h2");
        if (animeNameElement) {
            animeNameElement.querySelector("small")?.remove();
            // Extract anime names and split by the "|" delimiter
            return animeNameElement.textContent.trim().split('|').map(name => name.trim());
        }
        return [];
    };

    // Main function to initiate the script
    const main = () => {
        const animeNames = getAnimeNamesFromWebpage();
        if (!animeNames.length) return;

        let fillerEpisodes = new Set();
        let remainingRequests = animeNames.length * 2; // Two requests per anime name

        const onFillerDataReceived = (episodes) => {
            // Combine filler episodes into a single set
            episodes.forEach(episode => fillerEpisodes.add(episode));
            if (--remainingRequests === 0) {
                // Mark filler episodes after all requests are completed
                markFillerEpisodes([...fillerEpisodes]);
            }
        };

        // Fetch filler data for each anime name from both sources
        animeNames.forEach(animeName => {
            fetchFillerDataFromAnimeFillerList(animeName, onFillerDataReceived);
            fetchFillerDataFromJikan(animeName, onFillerDataReceived);
        });
    };

    main(); // Execute the main function
})();
