// ==UserScript==
// @name         Geoguessr Local records
// @include      /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @description  Keeps local records on GeoGuessr website
// @version      0.6
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/736457
// @downloadURL https://update.greasyfork.org/scripts/421551/Geoguessr%20Local%20records.user.js
// @updateURL https://update.greasyfork.org/scripts/421551/Geoguessr%20Local%20records.meta.js
// ==/UserScript==

(function () {

    const LOCAL_STORAGE_RESULTS_KEY = "__geoguessr_results__";
    const LOCAL_STORAGE_HIGHSCORE_TAB_KEY = "__geoguessr_highscore_tab__";
    const RESULTS_DIV_ID = "__geoguessrResult";
    const HIGHSCORES_DIV_ID = "__geoguessrLocalHighscores";
    const HIGHSCORES_BUTTON_BAR_ID = "__geoguessrLocalHighscoresButtonBar";
    let USER_ID = undefined;

    /*
     * Utilities
     */

    function onLocationChange(callback) {
        let currentLocation = "";
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (currentLocation != document.location.href) {
                    currentLocation = document.location.href;
                    callback();
                }
            });
        });


        observer.observe(document.querySelector("body"), {
            childList: true,
            subtree: true
        });
    }

    function migrateHighscores(highscores) {
        if (!highscores) {
            return highscores;
        }

        for (const [user, maps] of Object.entries(highscores)) {
            for (const [map, modes] of Object.entries(maps)) {
                for (const [mode, score] of Object.entries(modes)) {
                    if (typeof score !== 'number') {
                        // Already dealing with new format highscores. we can return ealier.
                        return highscores;
                    }

                    modes[mode] = [{
                        "points": score,
                        "gameId": undefined,
                        "time": undefined,
                    }]
                }
            }
        }

        return highscores;
    }

    function getCurrentHighscoreTab() {
        return localStorage.getItem(LOCAL_STORAGE_HIGHSCORE_TAB_KEY)
            || getGameMode({
                forbidMoving: false,
                forbidRotating: false,
                forbidZooming: false,
            });
    }

    function setCurrentHighscoreTab(mode) {
        return localStorage.setItem(LOCAL_STORAGE_HIGHSCORE_TAB_KEY, mode);
    }

    function getResults() {
        let stored = localStorage.getItem(LOCAL_STORAGE_RESULTS_KEY);
        if (stored) {
            return migrateHighscores(JSON.parse(stored));
        } else {
            return {};
        }
    }

    function saveResults(results) {
        localStorage.setItem(LOCAL_STORAGE_RESULTS_KEY, JSON.stringify(results));
    }

    function getGameMode(config) {
        return `${config.forbidMoving ? "NoMove" : "Move"}${config.forbidRotating ? "NoPan" : "Pan"}${config.forbidZooming ? "NoZoom" : "Zoom"}`;
    }

    function formatSeconds(duration) {
        // Hours, minutes and seconds
        var hrs = Math.floor(duration / 3600);
        var mins = Math.floor((duration % 3600) / 60);
        var secs = duration % 60;

        var ret = "";
        if (hrs > 0) {
            ret += "" + hrs + " hr, ";
        }
        if (mins > 0) {
            ret += "" + mins + " min, ";
        }
        ret += "" + secs + " sec";
        return ret;
    }

    async function getUserId() {
        if (USER_ID) {
            return USER_ID;
        }
        let response = await fetch("https://www.geoguessr.com/api/v3/profiles/", { "credentials": "include" })
            .then(res => res.json())
            .then(res => {
                USER_ID = res.user.id;
                return USER_ID
            });
        return response;
    }

    /*
     * Game summary page
     */

    function alreadyHasScore() {
        return !!document.getElementById(RESULTS_DIV_ID);
    }

    function displayBest(best) {
        if (alreadyHasScore()) {
            return;
        }

        const previousBestDiv = document.createElement("div");
        previousBestDiv.id = RESULTS_DIV_ID;
        document.getElementsByClassName("score-bar")[0].parentElement.appendChild(previousBestDiv);
        previousBestDiv.innerHTML = `<span>Your best score is: <b>${Number(best.points).toLocaleString()}</b></span>`;
    };

    function processGame(game) {
        if (game.map === "country-streak") {
            return;
        }

        const mapId = game.map;
        const mapName = game.mapName;
        const player = game.player.id;
        const points = parseInt(game.player.totalScore.amount);
        const time = game.player.totalTime;
        const results = getResults();
        const gameMode = getGameMode(game);;

        if (!(player in results)) {
            results[player] = {};
        }

        if (!(mapId in results[player])) {
            // Migrate from results based on map name to map id
            if (mapName in results[player]) {
                results[player][mapId] = results[player][mapName];
                delete results[player][mapName];
            } else {
                results[player][mapId] = {};
            }
        }

        if (!(gameMode in results[player][mapId])) {
            results[player][mapId][gameMode] = [];
        }

        results[player][mapId][gameMode].push({
            "points": points,
            "gameId": game.token,
            "time": time,
        });

        results[player][mapId][gameMode] = results[player][mapId][gameMode]
            .sort((a, b) => b.points - a.points || a.time - b.time)
            .reduce((uniques, game) => uniques.some(other => other.gameId === game.gameId) ? uniques : [...uniques, game], []);

        results[player][mapId][gameMode].splice(3);

        saveResults(results);
        displayBest(results[player][mapId][gameMode][0]);
    }

    function checkGame() {
        const challengeTag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        fetch(`https://www.geoguessr.com/api/v3/games/${challengeTag}`)
            .then(res => res.json())
            .then(processGame)
            .catch(err => { throw err });
    };

    function checkChallenge() {
        const challengeTag = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        fetch(`https://www.geoguessr.com/api/v3/challenges/${challengeTag}/game`, { "credentials": "include" })
            .then(res => res.json())
            .then(processGame)
            .catch(err => { throw err });
    };

    function check() {
        if (alreadyHasScore()) {
            return;
        }

        let matched = false;

        const internalCheck = () => {
            if (matched) return;

            if (location.pathname.startsWith("/game/") && !!document.querySelector('.title')) {
                matched = true;
                checkGame();
            } else if (location.pathname.startsWith("/challenge/") && !!document.querySelector('.title')) {
                matched = true;
                checkChallenge();
            }
        };

        internalCheck();
        setTimeout(internalCheck, 250);
        setTimeout(internalCheck, 500);
        setTimeout(internalCheck, 1000);
        setTimeout(internalCheck, 2000);
    };

    /*
     * Map page
     */

    function alreadyHasHighscores() {
        return !!document.getElementById(HIGHSCORES_DIV_ID);
    }

    function createTabButton(key, label, active) {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("button-bar__button");
        if (key === active) {
            button.classList.add("button-bar__button--active");
        }
        button.innerText = label;
        button.onclick = function () {
            setCurrentHighscoreTab(key);
            addLocalHighscores(true);
        }
        return button;
    }

    function createTableRowString(position, score) {
        let gameLink = "";
        if (score && score.gameId) {
            gameLink = `<a class="highscore__result-link" href="/results/${score.gameId}" target="_blank" rel="noopener noreferrer" title="View results"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAzNDRhIiBkPSJNNSAxOWgtNHYtOGg0djh6bTYgMGgtNHYtMThoNHYxOHptNiAwaC00di0xMmg0djEyem02IDBoLTR2LTRoNHY0em0xIDJoLTI0djJoMjR2LTJ6IiAvPjwvc3ZnPg==" alt="View results"></a>`
        }

        return `
        <tr class="table__row">
            <td class="table__cell table__cell--no-wrap highscore__number">${position}.</td>
            <td class="table__cell table__cell--collapse-left table__cell--span label-2"></td>
            <td class="table__cell table__cell--align-right table__cell--collapse-right table__cell--no-wrap"><span class="highscore__score">${score && score.points ? Number(score.points).toLocaleString() + " points" : ""}</span></td>
            <td class="table__cell table__cell--align-right table__cell--collapse-right table__cell--no-wrap"><span class="highscore__total-time">${score && score.time ? formatSeconds(score.time) : ""}</span></td>
            <td class="table__cell table__cell--collapse-left">${gameLink}</td>
        </tr>
        `
    }

    function createResultsTableString(scores) {
        return `
        <table class="table table--spacing-small highscore">
            <tbody>
                ${createTableRowString(1, scores[0])}
                ${createTableRowString(2, scores[1])}
                ${createTableRowString(3, scores[2])}
            </tbody>
        </table>
        `
    }

    function addLocalHighscores(reload = false) {
        if (alreadyHasHighscores()) {
            if (reload) {
                const oldTable = document.getElementById(HIGHSCORES_DIV_ID);
                oldTable.parentNode.removeChild(oldTable);
            } else {
                return true;
            }
        }

        const mapInfo = document.getElementsByClassName('map-block')[0];
        if (!mapInfo) {
            return false;
        }
        const highscores = mapInfo.nextElementSibling;
        if (!highscores) {
            return false;
        }
        const peopleWhoLikeThisMap = highscores.nextElementSibling;
        if (!peopleWhoLikeThisMap) {
            return false;
        }

        getUserId().then(userId => {
            const currentTab = getCurrentHighscoreTab();
            const mapId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            const mapName = document.querySelector('.map-block .map-block__title').textContent;

            let results = [];
            const globalResults = getResults();
            const userResults = globalResults[userId];
            if (userResults) {
                const mapResults = userResults[mapId] || userResults[mapName];
                if (mapResults) {
                    results = mapResults[currentTab];
                }
            }

            let scoresTableString;
            if (!results || results.length == 0) {
                scoresTableString = `<p class="center-content">No recorded results.</p>`;
            } else {
                scoresTableString = createResultsTableString(results);
            }

            const localHighscoresDiv = document.createElement("div");
            peopleWhoLikeThisMap.parentNode.insertBefore(localHighscoresDiv, peopleWhoLikeThisMap);

            localHighscoresDiv.id = HIGHSCORES_DIV_ID;
            localHighscoresDiv.className = 'margin--top-large';
            localHighscoresDiv.innerHTML = `
                <div class="margin--top-large">
                    <section class="grid grid--gutter-size-large grid--num-columns-1">
                        <section class="grid__column">
                            <h1 class="title title--medium title--dark">Local Highscore</h1>
                            ${scoresTableString}
                            <div class="center-content margin--top">
                                <div id="${HIGHSCORES_BUTTON_BAR_ID}" class="button-bar">
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
            `;

            const buttonBar = document.getElementById(HIGHSCORES_BUTTON_BAR_ID);
            const movingButton = createTabButton(getGameMode({ forbidMoving: false, forbidRotating: false, forbidZooming: false }), "Moving", currentTab);
            const noMoveButton = createTabButton(getGameMode({ forbidMoving: true, forbidRotating: false, forbidZooming: false }), "No move", currentTab);
            const noMoveNoZoomButton = createTabButton(getGameMode({ forbidMoving: true, forbidRotating: false, forbidZooming: true }), "No move, No zoom", currentTab);
            const noMoveNoZoomNoPanButton = createTabButton(getGameMode({ forbidMoving: true, forbidRotating: true, forbidZooming: true }), "No move, No pan, No zoom", currentTab);

            buttonBar.appendChild(movingButton);
            buttonBar.appendChild(noMoveButton);
            buttonBar.appendChild(noMoveNoZoomButton);
            buttonBar.appendChild(noMoveNoZoomNoPanButton);
        });
        return true;
    }

    function attemptToCreateHighscoresTable(attemptsLeft) {
        if (!location.pathname.startsWith("/maps/")) {
            return;
        }

        setTimeout(function () {
            attemptsLeft -= 1;
            if (!addLocalHighscores() && attemptsLeft > 0) {
                attemptToCreateHighscoresTable(attemptsLeft);
            }
        }, 100);
    }

    document.addEventListener('click', check, false);
    onLocationChange(function () { attemptToCreateHighscoresTable(20) });

})();