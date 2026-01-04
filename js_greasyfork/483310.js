// ==UserScript==
// @name         HLTB Rank Games
// @namespace    https://github.com/refatK
// @version      0.3.1
// @description  Organize games by rating for completion page grid view
// @author       RefatK
// @license      MIT
// @match        https://howlongtobeat.com/user/*/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=howlongtobeat.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/483310/HLTB%20Rank%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/483310/HLTB%20Rank%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const YEAR_FILTER = new Date().getFullYear().toString();
    var currentRatingSplitter = "/";

    function getAllGameEls() {
        return document.querySelectorAll("[class^='UserGameListBox'][class*='__box']");
    }

    function mouseEventAllGames(mouseEventName) {
        var event = new MouseEvent(mouseEventName, {
        'view': window,
        'bubbles': true,
        'cancelable': true
        });

        getAllGameEls().forEach(el => el.dispatchEvent(event));
    }

    function mouseOverAllGames() {
        mouseEventAllGames('mouseover');
    }

    function rankAllGames() {
        const gamesContainer = document.getElementById('user_games');
        const games = gamesContainer.querySelectorAll("li[class^='UserGameListBox'][class*='__user_game_col']");

        // Group games by their ratings
        const gamesByRating = {};

        games.forEach(game => {
            // UserGameListBox-module__QceeGa__info back_form shadow_box
            const infoHtml = game.querySelector("div[class^='UserGameListBox'][class*='__data_display']").innerHTML;

            // Only games in year
            const yearToRank = parseInt(document.getElementById('rankYear').value) || null;
            if (!!yearToRank && infoHtml.includes(", " + yearToRank) === false) return;

            const rating = infoHtml.split("Rated</strong>")[1];
            if (rating !== "NR") {
                currentRatingSplitter = rating.includes("%") ? "%" : "/";
            }

            if (!gamesByRating[rating]) {
                gamesByRating[rating] = [];
            }

            gamesByRating[rating].push(game.closest("li[class^='UserGameListBox'][class*='__user_game_col']"));
        });

        // Create grid sections for each rating
        let gamesByRatingContainerEl = document.querySelector("#gamesByRating");
        if (!gamesByRatingContainerEl) {
            gamesByRatingContainerEl = document.createElement("div");
            gamesByRatingContainerEl.id = "gamesByRating";
            gamesByRatingContainerEl.style.wordSpacing = "10px"
            gamesByRatingContainerEl.style.marginLeft = "15px"
        }
        // gamesByRatingContainerEl.classList.add('UserGameList_user_collection__uQNlh');
        document.getElementById('user_games').after(gamesByRatingContainerEl);

        const gamesByRatingContainer = document.getElementById('gamesByRating');

        const sortedRatings = Object.keys(gamesByRating).sort((a, b) => (parseInt(b.split(currentRatingSplitter)[0]) || -999) - (parseInt(a.split(currentRatingSplitter)[0]) || -999));
        for (const rating of sortedRatings) {
            let ratingClass;
            if (rating === "NR") {
                ratingClass = 'rating-NR';
            } else {
                ratingClass = 'rating-' + rating.split(currentRatingSplitter)[0];
            }

            let gamesGrid = document.querySelector("." + ratingClass);
            const ratingSectionAlreadyExists = !!gamesGrid;
            if (!gamesGrid) {
                gamesGrid = document.createElement("div");
                gamesGrid.classList.add('grid-container');
                gamesGrid.classList.add(ratingClass);
            }

            const gamesList = gamesByRating[rating];
            gamesList.forEach(gameBoxDiv => {
                gamesGrid.appendChild(gameBoxDiv);
                gamesGrid.appendChild(document.createTextNode(" "));
            });

            if (!ratingSectionAlreadyExists) {
                const ratingSection = document.createElement('div');
                ratingSection.innerHTML = `<br><h2>Rating: ${rating}</h2>`;
                ratingSection.appendChild(gamesGrid);
                gamesByRatingContainer.appendChild(ratingSection);
            }
        }
    }

    function waitForPageLoad(callback) {
        // Wait for full browser load
        if (document.readyState === "complete") {
            requestIdleCallback(callback, { timeout: 4000 });
            return;
        }

        window.addEventListener("load", () => {
            requestIdleCallback(callback, { timeout: 4000 });
        });
    }

    waitForPageLoad(() => {
       // 1: add Show Ranks button
       let rankFormSpan = document.querySelector("#rankFormSpan");
        if (!rankFormSpan) {
            rankFormSpan = document.createElement("span");
            rankFormSpan.id = "rankForm";
        }
       let navBtnDiv = document.querySelector('[id*="user_nav_toggle"]');
       navBtnDiv.appendChild(rankFormSpan);

       let genRanksBtn = document.createElement("button");
        genRanksBtn.classList.add(...["form_button", "back_orange"]);
        genRanksBtn.innerText = "Show Ranks for";
        genRanksBtn.onclick = function() {
            mouseOverAllGames();
            console.info("waiting");
            setTimeout(function() {
                console.info("ranking now");
                rankAllGames();
                setTimeout(function() {
                    mouseEventAllGames('mouseout');
                }, 200);
            }, 200);
        };
        rankFormSpan.appendChild(genRanksBtn);


        let yearInput = document.createElement("input");
        yearInput.id = "rankYear";
        yearInput.type = "number";
        yearInput.value = YEAR_FILTER;
        yearInput.size = 4;
        rankFormSpan.appendChild(yearInput);
    });

})();