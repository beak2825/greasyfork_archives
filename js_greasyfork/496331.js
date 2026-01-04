// ==UserScript==
// @name         ReplayWatchSorter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  BeatLeaderのユーザーページでリプレイを見られた回数順に譜面をソートするボタンを追加します
// @author       You
// @match        https://beatleader.xyz/u/*
// @icon         https://drive.google.com/uc?id=1lzYoEVZG2I5gyht5j9U2tZPlUYxToL6y
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496331/ReplayWatchSorter.user.js
// @updateURL https://update.greasyfork.org/scripts/496331/ReplayWatchSorter.meta.js
// ==/UserScript==

(function() {
    function sortByReplayWatched() {
    changeButtonScore();
    var url = location.href;
    var urlArr = url.split("/");
    var userId = urlArr[4];
    if (userId.includes("?")) {
        userId = userId.replace("?", "");
    }
    getAllPlayerScores(userId).then(playerAllFetchedScore => {
        console.log(playerAllFetchedScore);
        pushElements(playerAllFetchedScore)
    });
}

function copyToClipboard(str) {
    navigator.clipboard.writeText(str);
}

function changeButtonScore() {
    var scoreSortElement = document.querySelector("div.score-sorting");
    var selectedElement = scoreSortElement.querySelector("a.button:not(.not-selected)");
    if (selectedElement) {
        selectedElement.style.setProperty("--color", "#444");
        selectedElement.style.setProperty("--bg-color", "#dbdbdb");
        selectedElement.style.setProperty("--active-color", "#222");
        selectedElement.style.setProperty("--active-bg-color", "#aaa");
        selectedElement.classList.add("not-selected");
    }

    var sortByReplayWatchedElement = document.getElementById("sortByReplayWatched");
    sortByReplayWatchedElement.style.setProperty("--color", "#dbdbdb");
    sortByReplayWatchedElement.style.setProperty("--bg-color", "#3273db");
    sortByReplayWatchedElement.style.setProperty("--active-color", "#fff");
    sortByReplayWatchedElement.style.setProperty("--active-bg-color", "#2366d1");
    sortByReplayWatchedElement.classList.remove("not-selected");

    document.querySelector("div.histogram-controls")?.remove();
    document.querySelector("section.scores-date-browse")?.remove();
    document.querySelector("button.scores-playlist-button")?.remove();
    document.querySelector("nav.pagination")?.remove();
    document.querySelector("section.score-filters")?.remove();
    document.querySelector("div.song-scores").innerHTML = `<p id="processingText"></p>`;
}

async function getAllPlayerScores(id) {
    try {
        const response = await fetch(`https://api.beatleader.xyz/player/${id}/scores?sortBy=date&page=1&count=1&requirements=none&scoreStatus=none&leaderboardContext=general`);
        const data = await response.json();
        let playerAllScore = [];
        let totalScoreCount = data.metadata.total;
        totalScoreCount = Math.ceil(totalScoreCount / 100);
        console.log(`Total pages: ${totalScoreCount}`);

        for (let i = 1; i <= totalScoreCount; i++) {
            document.getElementById("processingText").textContent = "fetching: " + i + "/" + totalScoreCount;
            console.log("fetching: " + i + "/" + totalScoreCount);
            const scoresResponse = await fetch(`https://api.beatleader.xyz/player/${id}/scores?sortBy=date&page=${i}&count=100&requirements=none&scoreStatus=none&leaderboardContext=general`);
            const scoresData = await scoresResponse.json();
            console.log(`Page ${i}: ${scoresData.data.length} scores`);

            for (let j = 0; j < scoresData.data.length; j++) {
                const score = scoresData.data[j];
                const playerScore = {
                    name: score.leaderboard.song.name,
                    mapper: score.leaderboard.song.mapper,
                    replayWatched: score.replaysWatched,
                    bsr: score.leaderboard.song.id,
                    replayUrl: `https://replay.beatleader.xyz/?scoreId=${score.id}`,
                    difficultyName: score.leaderboard.difficulty.difficultyName,
                    coverImage: score.leaderboard.song.coverImage,
                    acc: score.accuracy,
                    timeSet: score.timeset,
                    globalRank: score.rank,
                    artist: score.leaderboard.song.author,
                    score: score.baseScore,
                    badCuts: score.badCuts,
                    missedNotes: score.missedNotes,
                    bombCuts: score.bombCuts,
                    wallsHit: score.wallsHit,
                    mod: score.modifiers,
                    maxStreak: score.maxStreak
                };
                playerAllScore.push(playerScore);
            }
        }
        playerAllScore.sort((a, b) => b.replayWatched - a.replayWatched);
        document.getElementById("processingText").textContent = "Completed! Total " + playerAllScore.length + " scores!";
        return playerAllScore;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById("processingText").textContent = "Error!";
    }
}
function pushElements(scoreArr) {
    var parentElement = document.querySelector("div.song-scores");
    parentElement.innerHTML = "";


    for (let i = 0; i < scoreArr.length; i++) {
        var score = scoreArr[i];
        if (score.replayWatched ===0){
            return;
        }
        var missImage = `<i class="fas fa-times"></i>`
        var fcClass = ""
        var element = document.createElement("div");
        var acc = score.acc;
        var accDisplay = Math.floor(acc * 1000) / 10;
        element.setAttribute("class", `song-score row-${i} score-in-list svelte-lf64ki`);
        if (score.bsr.includes("x")) {
            score.bsr = score.bsr.replace(/x/g, "");
        }
        var accColor = getColor(accDisplay)
        var difficultyDisplay
        var difficultyColor
        if (score.difficultyName === "ExpertPlus") {
            difficultyDisplay = "E+"
            difficultyColor = "#8f48db"
        } else if (score.difficultyName === "Expert") {
            difficultyDisplay = "Ex"
            difficultyColor = "#bf2a42"
        } else if (score.difficultyName === "Hard") {
            difficultyDisplay = "H"
            difficultyColor = "tomato"
        } else if (score.difficultyName === "Normal") {
            difficultyDisplay = "N"
            difficultyColor = "#59b0f4"
        } else if (score.difficultyName === "Easy") {
            difficultyDisplay = "Es"
            difficultyColor = "MediumSeaGreen"
        }
        var totalMisses = score.badCuts + score.missedNotes + score.bombCuts + score.wallsHit
        if (totalMisses === 0) {
            totalMisses = "FC"
            missImage = ``
            fcClass = "fc svelte-11p9i0b"
        }
        var displayMods = ""
        if (!score.mod) {
            score.mod = "No mods"
            displayMods =""
        } else {
            displayMods = `<small class="mods svelte-17vqyw4" slot="additional"><span>${score.mod}</span></small>`
        }
        if (!score.maxStreak) {
            score.maxStreak = 0
        }

        element.innerHTML = `
            <div class="main svelte-lf64ki">
                <span class="rank tablet-and-up svelte-lf64ki">
                    <span class="val svelte-z7b7c7">
                        <i class="fas fa-globe-americas svelte-z7b7c7"></i>
                        <strong class="value svelte-z7b7c7"><span class="value">#${score.globalRank}</span></strong>
                    </span>
                    <div class="timeset svelte-lf64ki">
                        <span title="${new Date(score.timeSet * 1000).toLocaleString()}">${timeAgo(score.timeSet)}</span>
                    </div>
                </span>
                <span class="song svelte-lf64ki">
                    <div class="svelte-lf64ki">
                        <section class="svelte-4dz2lc">
                            <div class="cover-difficulty svelte-yrzvmg">
                                <a><img src="${score.coverImage}" alt="" class="svelte-yrzvmg"></a>
                                <div class="difficulty svelte-yrzvmg">
                                    <span class="diff reversed svelte-hbvn3s" style="color: white; background-color: ${difficultyColor};" title="${score.difficultyName}">
                                        ${difficultyDisplay}
                                    </span>
                                </div>
                            </div>
                            <div class="songinfo svelte-4dz2lc">
                                <a>
                                    <span class="name svelte-4dz2lc">${score.name}</span>
                                    <div class="author">${score.artist}<small class="svelte-4dz2lc">${score.mapper}</small></div>
                                </a>
                            </div>
                            <div class="desktop-and-up">
                                <div class="score-action-buttons-layout large svelte-1498k6l">
                                    <div class="main-grid buttons-container svelte-1498k6l">
                                        <span slot="default_buttons">
                                            <a href="https://beatsaver.com/maps/${score.bsr}" target="_blank" rel="noreferrer">
                                                <button
                                                    style="--color:#444; --bg-color: #dbdbdb; --border:transparent;--active-color: #222; --active-bg-color: #aaa; --active-border: transparent; --margin: 1px; --btn-padding: calc(.45em - 1px) .25em; --btn-margin: 0;; --hovered-scale:110%;"
                                                    title="Go to Beat Saver" class="button clickable default animated svelte-1tztge5">
                                                    <span class="icon svelte-1tztge5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" version="1.1">
                                                            <g fill="none" stroke="#000000" stroke-width="10">
                                                                <path d="M 100,7 189,47 100,87 12,47 Z" stroke-linejoin="round"></path>
                                                                <path d="M 189,47 189,155 100,196 12,155 12,47" stroke-linejoin="round"></path>
                                                                <path d="M 100,87 100,196" stroke-linejoin="round"></path>
                                                                <path d="M 26,77 85,106 53,130 Z" stroke-linejoin="round"></path>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                    <span></span>
                                                </button>
                                            </a>
                                            <a href="beatsaver://${score.bsr}">
                                                <button
                                                    style="--color:#444; --bg-color: #dbdbdb; --border:transparent;--active-color: #222; --active-bg-color: #aaa; --active-border: transparent; --margin: 1px; --btn-padding: calc(.45em - 1px) .25em; --btn-margin: 0;; --hovered-scale:110%;"
                                                    title="One click install" class="button clickable default animated svelte-1tztge5">
                                                    <i class="far fa-hand-pointer svelte-1tztge5"></i>
                                                    <span></span>
                                                </button>
                                            </a>
                                            <a href="${score.replayUrl}"
                                                style="--color:#444; --bg-color: #dbdbdb; --border:transparent;--active-color: #222; --active-bg-color: #aaa; --active-border: transparent; --margin: 1px; --btn-padding: calc(.45em - 1px) .25em; --btn-margin: 0; ; --hovered-scale:110%;"
                                                disabled="false" title="Replay"
                                                class="button clickable default animated replay-button svelte-1tztge5">
                                                <span class="icon svelte-1tztge5"><img src="/assets/bs-pepe.gif"></span>
                                                <span></span>
                                            </a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </span>
                <div class="player-performance svelte-10mo4n9">
                    <div class="player-performance-badges svelte-1ipm8vb" style="--min-width: 20.000000000000004em; --cols: 3;">
                        <span class="with-badge acc svelte-1ipm8vb">
                            <span class="badge svelte-1u914s9" style="--color:white; --background-color:${accColor};" title="${accDisplay}%">
                                <span class="label svelte-1u914s9">
                                    <span slot="label">
                                        <span class="value" title="${accDisplay}%">${accDisplay}%</span>
                                    </span>
                                </span>
                                <small class="mods svelte-17vqyw4" slot="additional"></small>
                            </span>
                        </span>
                        <span class="with-badge score svelte-1ipm8vb">
                            <span class="badge svelte-1u914s9" style="--color:white; --background-color:var(--dimmed);">
                                <span class="label svelte-1u914s9">
                                    <span slot="label">
                                        <span class="value">${score.score.toLocaleString()}</span>
                                    </span>
                                </span>
                            </span>
                        </span>
                        <span class="with-badge beatSavior svelte-1ipm8vb">
                            <span class="badge svelte-1u914s9" style="--color:white; --background-color:var(--dimmed);"
                                title="Missed notes: ${score.missedNotes}, Bad cuts: ${score.badCuts}, Bomb hit: ${score.bombCuts}, Wall hit: ${score.wallsHit}">
                                <span class="label svelte-1u914s9">
                                    <span slot="label" title="Missed notes: ${score.missedNotes}, Bad cuts: ${score.badCuts}, Bomb hit: ${score.bombCuts}, Wall hit: ${score.wallsHit}">
                                        ${missImage}
                                        <span class="${fcClass}" title="Missed notes: ${score.missedNotes}, Bad cuts: ${score.badCuts}, Bomb hit: ${score.bombCuts}, Wall hit: ${score.wallsHit}">${totalMisses}</span>
                                    </span>
                                </span>
                            </span>
                        </span>
                        <span class="with-badge beatSavior svelte-1ipm8vb">
                            <span class="badge svelte-1u914s9" style="--color:white; --background-color:var(--dimmed);">
                                <span class="label svelte-1u914s9">
                                    <span slot="label">${score.mod}</span>
                                </span>
                            </span>
                        </span>
                        <span class="with-badge beatSavior svelte-1ipm8vb">
                            <span class="badge svelte-1u914s9" style="--color:white; --background-color:var(--dimmed);" title="Replays watched: ${score.replayWatched}">
                                <span class="label svelte-1u914s9">
                                    <span slot="label">
                                        <i class="fas fa-eye svelte-1ipm8vb"></i>
                                        <span class="value">${score.replayWatched}</span>
                                    </span>
                                </span>
                            </span>
                        </span>
                        <span class="with-badge beatSavior svelte-1ipm8vb">
                            <span class="badge svelte-1u914s9" style="--color:white; --background-color:var(--dimmed);"
                                title="${score.maxStreak} &quot;115s&quot; in a row">
                                <span class="label svelte-1u914s9">
                                    <span slot="label">
                                        <i class="fa-solid fa-crosshairs svelte-1ipm8vb"></i>
                                        <span class="value">${score.maxStreak}</span>
                                    </span>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>`;
        parentElement.appendChild(element);
    }
}
function getTimeByUnixTime(time) {
    var timestamp = time * 1000;
    var date = new Date(timestamp);
    var options = {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    var dateString = new Intl.DateTimeFormat('ja-JP', options).format(date);
    return dateString
}
function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp * 1000);
    const secondsAgo = Math.floor((now - past) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30);
    const yearsAgo = Math.floor(daysAgo / 365);

    if (secondsAgo < 60) {
        return secondsAgo === 1 ? '1秒前' : `${secondsAgo}秒前`;
    } else if (minutesAgo < 60) {
        return minutesAgo === 1 ? '1分前' : `${minutesAgo}分前`;
    } else if (hoursAgo < 24) {
        return hoursAgo === 1 ? '1時間前' : `${hoursAgo}時間前`;
    } else if (daysAgo < 30) {
        if (daysAgo === 1) {
            return '昨日';
        } else if (daysAgo === 2) {
            return '一昨日';
        } else {
            return `${daysAgo}日前`;
        }
    } else if (monthsAgo < 12) {
        return monthsAgo === 1 ? '1か月前' : `${monthsAgo}か月前`;
    } else {
        if (yearsAgo === 1) {
            return '昨年';
        } else {
            return `${yearsAgo}年前`;
        }
    }
}

function getColor(score) {
    if (score >= 95.00) {
        return "#8f48db";
    } else if (score >= 90.00) {
        return "#bf2a42";
    } else if (score >= 85.00) {
        return "tomato";
    } else if (score >= 80.00) {
        return "#59b0f4";
    } else if (score >= 70.00) {
        return "MediumSeaGreen";
    } else if (score >= 60.00) {
        return "var(--dimmed)";
    } else {
        return "var(--dimmed)";
    }
}

function addSortButton() {
    var sortButtonElement = document.createElement("a");
    sortButtonElement.setAttribute("style", "--color:#444; --bg-color: #dbdbdb; --border:transparent; --active-color: #222; --active-bg-color: #aaa; --active-border: transparent; --margin: .45em; --btn-padding: calc(.45em - 1px) 1em; --btn-margin: 0 0 .45em 0; --hovered-scale:100%;");
    sortButtonElement.setAttribute("title", "Sort by My replays watched");
    sortButtonElement.setAttribute("class", "button clickable default svelte-1tztge5 not-selected");
    sortButtonElement.setAttribute("id", "sortByReplayWatched");
    sortButtonElement.innerHTML = `<i class="fas fa-eye svelte-91jusj"></i><span>Watched</span>`;
    sortButtonElement.addEventListener("click", sortByReplayWatched);

    var scoreSortElement = document.querySelector("div.score-sorting");
    scoreSortElement.appendChild(sortButtonElement);
}

var observer = new MutationObserver(function (mutations, observer) {
    var scoreSortElement = document.querySelector("div.score-sorting");
    if (scoreSortElement) {
        addSortButton();
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
})();