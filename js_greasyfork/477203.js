// ==UserScript==
// @name         AniList And MAL Score YomiYasu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Obten puntaje de AniList y MAL y velo en Yomiyasu
// @author       Pedrubik🦙
// @match        https://manga.ajr.moe/app/series/*
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/477203/AniList%20And%20MAL%20Score%20YomiYasu.user.js
// @updateURL https://update.greasyfork.org/scripts/477203/AniList%20And%20MAL%20Score%20YomiYasu.meta.js
// ==/UserScript==
// ...

(function() {
    'use strict';

    // Function to fetch data from AniList
    function fetchAniListData(searchQuery) {
        // Your AniList GraphQL query
        const aniListQuery = `
        query ($page: Int, $perPage: Int, $search: String) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              total
              perPage
            }
            media(search: $search, type: MANGA, format:MANGA, countryOfOrigin: "JP") {
              id
              title {
                romaji
                english
                native
              }
              type
              genres
              averageScore
              siteUrl
            }
          }
        }
        `;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://graphql.anilist.co",
            data: JSON.stringify({
                query: aniListQuery,
                variables: {
                    page: 1,
                    perPage: 1,
                    search: searchQuery
                },
            }),
            headers: {
                "Content-Type": "application/json",
            },
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const manga = data.data.Page.media[0];

                if (manga) {
                    const text3xlElement = document.querySelector(".text-3xl");

                    if (text3xlElement) {
                        // Check if the element with id "averageScoreAniList" already exists
                        let averageScoreAniListElement = document.getElementById("averageScoreAniList");
                        if (!averageScoreAniListElement) {
                            averageScoreAniListElement = document.createElement("a");
                            averageScoreAniListElement.id = "averageScoreAniList";
                            const lineBreakElement = document.createElement("br");
                            averageScoreAniListElement.href = manga.siteUrl;
                            averageScoreAniListElement.style.fontSize = "medium"
                            text3xlElement.appendChild(lineBreakElement);
                            text3xlElement.appendChild(averageScoreAniListElement);

                        }

                        averageScoreAniListElement.innerHTML = `Anilist: ${manga.averageScore}`;
                    }
                }
            },
        });
    }

    // Function to fetch data from MyAnimeList (MAL)
    function fetchMyAnimeListData(searchQuery) {
        // Define the Jikan API URL
        const jikanApiUrl = "https://api.jikan.moe/v4/manga";

        // Construct the full API request URL for MAL
        const apiUrl = `${jikanApiUrl}?q=${searchQuery}&sfw&type=manga`;

        // Make a GET request to the Jikan API for MAL
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            responseType: "json",
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.data.length > 0) {
                        // Get the MAL manga information from the response
                        const malMangaInfo = data.data[0];
                        const malScore = malMangaInfo.score;

                        const text3xlElement = document.querySelector(".text-3xl");

                        if (text3xlElement) {
                            // Check if the element with id "averageScoreMAL" already exists
                            let averageScoreMALElement = document.getElementById("averageScoreMAL");
                            if (!averageScoreMALElement) {
                                averageScoreMALElement = document.createElement("a");
                                averageScoreMALElement.id = "averageScoreMAL";
                                averageScoreMALElement.href = malMangaInfo.url;
                                const lineBreakElement = document.createElement("br");
                                averageScoreMALElement.style.fontSize = "medium"
                                averageScoreMALElement.style.padding = "0"
                                text3xlElement.appendChild(lineBreakElement)
                                text3xlElement.appendChild(averageScoreMALElement);
                            }

                            averageScoreMALElement.innerHTML = `MAL: ${malScore}`;

                            // Create a link to the MyAnimeList page
                            const malLinkElement = document.createElement("a");
                        }
                    } else {
                        console.log("No manga found on MyAnimeList.");
                    }
                } else {
                    console.error("Error fetching data from MyAnimeList.");
                }
            },
            onerror: function(error) {
                console.error("Error: ", error);
            }
        });
    }

    // Define a function to observe changes in the DOM
    function observeText3xl() {
        const text3xlElement = document.querySelector(".text-3xl");
        if (text3xlElement) {
            const searchQuery = text3xlElement.textContent.trim();

            // Call the functions to fetch data with the dynamic search query
            fetchAniListData(searchQuery);
            fetchMyAnimeListData(searchQuery);
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(observeText3xl);

    // Configure and start observing
    observer.observe(document.body, { childList: true, subtree: true });
})();
