// ==UserScript==
// @name         AniList Score YomiYasu
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Obten puntaje de AniList y velo en Yomiyasu
// @author       Pedrubik🦙
// @match        https://manga.ajr.moe/app/series/*
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/477202/AniList%20Score%20YomiYasu.user.js
// @updateURL https://update.greasyfork.org/scripts/477202/AniList%20Score%20YomiYasu.meta.js
// ==/UserScript==
// ...
(function() {
    'use strict';

    // Function to make the GraphQL request to AniList
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
                        // Check if the element with id "averageScore" already exists
                        let averageScoreElement = document.getElementById("averageScore");
                        if (!averageScoreElement) {
                            averageScoreElement = document.createElement("a");
                            averageScoreElement.id = "averageScore";
                            const lineBreakElement = document.createElement("br");
                            text3xlElement.appendChild(lineBreakElement);
                            text3xlElement.appendChild(averageScoreElement);
                        }

                        averageScoreElement.href = manga.siteUrl;
                        averageScoreElement.textContent = `Average Score: ${manga.averageScore}`;

                    }
                }
            },
        });
    }

    // Define a function to observe changes in the DOM
    function observeText3xl() {
        const text3xlElement = document.querySelector(".text-3xl");
        if (text3xlElement) {
            const searchQuery = text3xlElement.textContent.trim();
            // Call the function to fetch data with the dynamic search query
            fetchAniListData(searchQuery);
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(observeText3xl);

    // Configure and start observing
    observer.observe(document.body, { childList: true, subtree: true });
})();
// ...
