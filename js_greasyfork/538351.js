// ==UserScript==
// @name         Holodex for YouTube
// @description  A userscript that adds a player in your YouTube page when current video has valid timeline on Holodex.
// @author       Allen Wei
// @namespace    https://github.com/Alllen95Wei
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://holodex.net/*
// @version      1.0.3
// @grant        GM_getValues
// @grant        GM_setValues
// @downloadURL https://update.greasyfork.org/scripts/538351/Holodex%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/538351/Holodex%20for%20YouTube.meta.js
// ==/UserScript==


let HOLODEX_API_KEY = GM_getValues({holodex_api_key: null}).holodex_api_key
const STYLE_TEXT = `
/*
 * Below is the stylesheet injected by "Holodex for YouTube" and is for elements created by the userscript.
 * Don't worry; other elements shouldn't be affected!
 */

table, th, td {
    border: 1px solid #000000;
    border-collapse: collapse;
}

th {
    background-color: #f06292;
}

td {
    background-color: #9cc9fd;
}

button:hover {
    cursor: pointer;
}

#song-list-btn {
    border: none;
    background-image: linear-gradient(to bottom right, #5da2f2, #f06292);
}

#song-list-btn:hover {
    background-image: linear-gradient(to bottom right, #7bb1f3, #ed82a8);
}

#song-list-div {
    font-size: small;
    white-space: pre-line;
}

#song-list-table-div {
    max-height: 75vh;
    margin: 0.5vh;
    overflow: auto;
    border-radius: 12px;
}

#autoplay-div {
    width: 100%;
    background-color: white;
}

#autoplay-switch-label {
    margin-left: 5px;
}

#song-info-div {
    width: 100%;
    overflow: auto;
    display: flex;
    align-items: center;
}

#hd-thumbnail {
    margin: 5px;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    box-shadow: 0 0 5px 0 #A5A5A5;
    transition: width 0.1s linear, height 0.1s linear;
}

#hd-thumbnail:hover {
    width: 110px;
    height: 110px;
    transition: width 0.1s linear, height 0.1s linear;
}

#song-detail-div {
    display: inline-grid;
}

#song-info-name {
    font-size: large;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
    margin-bottom: 0.05em;
}

#song-info-artist {
    font-size: small;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 5px;
    margin-bottom: 0.1em;
}

#autoplay-div {
    position: sticky;
    top: 0;
}

#control-div {
    display: flex;
    align-items: center;
    justify-content: center;
}

#progress-div {
    width: 100%;
    display: flex;
}

#progress-bar {
    -webkit-appearance: none;
    width: 80%;
    display: flex;
    appearance: none;
    background: transparent;
    cursor: pointer;
}

#progress-bar:focus {
    outline: none;
}

/******** Chrome, Safari, Opera and Edge Chromium styles ********/
/* slider track */
#progress-bar::-webkit-slider-runnable-track {
    background-image: linear-gradient(to right, #81b7f3, #ef86aa);
    border-radius: 0.5rem;
    height: 0.25rem;
}

/* slider thumb */
#progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -4px;  /* Centers thumb on the track */
    background-color: #808080;
    border-radius: 0.1rem;
    height: 1.2rem;
    width: 0.3rem;
}

#progress-bar:focus::-webkit-slider-thumb {
    outline: 3px solid #808080;
    outline-offset: 0.125rem;
}

/*********** Firefox styles ***********/
/* slider track */
#progress-bar::-moz-range-track {
    background-image: linear-gradient(to right, #81b7f3, #ef86aa);
    border-radius: 0.5rem;
    height: 0.25rem;
}

/* slider thumb */
#progress-bar::-moz-range-thumb {
    background-color: #808080;
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0.1rem;
    height: 1rem;
    width: 0.2rem;
}

#progress-bar:focus::-moz-range-thumb{
    outline: 3px solid #808080;
    outline-offset: 0.125rem;
}

.song-name-div {
    height: 40px;
    max-height: 40px;
    overflow: auto;
    align-content: center;
}

.song-artist {
    font-size: 10px;
    font-style: italic;
}

.hd-button {
    border: none;
    width: 100%;
    height: auto;
    padding: 5px;
    transition-duration: 0.15s;
}

.hd-button:hover {
    background-color: #b6b6b6;
}

.play-button {
    border: none;
    width: 40px;
    height: 40px;
    background-size: cover;
    background-color: #7f7f7f;
}

.progress-span {
    width: 10%;
    display: flex;
    justify-content: center;
}

.control-buttons {
    border: none;
    margin: 2px 4px;
    width: 3.5vw;
    background-color: darkgray;
}

/* ============= Google Material Symbols Stylesheet ============= */
.material-symbols-rounded {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 200,
  'opsz' 24
}
`
const DEFAULT_ART_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAGHaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj48dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCjw/eHBhY2tldCBlbmQ9J3cnPz4slJgLAAABAElEQVR4Xu3RoQHAIBDAwNLFf3TwLEDEnYzNmpn9kfHfgbcMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEk5gAHmwNEhZDUhAAAAABJRU5ErkJggg=="
const GOOGLE_ICONS_URL = [
    // "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,500,1,200&icon_names=skip_previous",
    // "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,500,1,200&icon_names=play_arrow",
    // "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,500,1,200&icon_names=skip_next"
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..20"
]

const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape})
let UPDATE_TRY = 0
let LAST_SONG_ID = ""
let LAST_SONG_INDEX = 0
let IS_RANDOM = false

/*
* 0 = no repeat \
* 1 = repeat one \
* 2 = repeat all
*/
let REPEAT_MODE = 0
let QUEUE = []
let SONG_INDEX = []


// Utils

function secondsToFormattedString(seconds) {
    return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""}${Math.floor(seconds % 60)}`
}

function compareSongSequence(a, b) {
    if (a["start"] > b["start"]) {
        return 1
    }
    if (a["start"] < b["start"]) {
        return -1
    }
    return 0
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function autoplay(videoPlayer, updateNow, goNext, goPrevious) {
    UPDATE_TRY++
    // check every 4 triggers (see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event)
    if (UPDATE_TRY >= 4 || updateNow) {
        UPDATE_TRY = 0
        const currentTime = videoPlayer.currentTime
        let nextSong = null
        for (const [start, end, i] of SONG_INDEX) {
            if (start <= currentTime && currentTime <= end) {  // now playing
                const nowPlaying = QUEUE[i]
                console.log(`Now playing: ${nowPlaying["name"]}, by ${nowPlaying["original_artist"]}`)
                LAST_SONG_INDEX = i
                if (goNext) {
                    nextSong = QUEUE[i + 1] || null
                } else if (goPrevious) {
                    nextSong = QUEUE[i - 1] || null
                } else {
                    nextSong = "PLAYING"
                }
                break
            } else if (!IS_RANDOM && start > currentTime) {  // finds the next song only when "shuffle" is not enabled
                // if (nextSong === songList[i]) {  // the next song is confirmed and will NOT change
                //     break
                // }
                nextSong = QUEUE[i]
                break
            } else if (IS_RANDOM) {  // the playlist is random and no song is playing
                nextSong = QUEUE[LAST_SONG_INDEX + 1] || null
                break
            }
        }
        if (nextSong !== null && nextSong !== "PLAYING") {
            console.log("Next song:", nextSong)
            console.log(`Seeking to ${nextSong["start"]}`)
            videoPlayer.currentTime = nextSong["start"]
        } else if (nextSong !== "PLAYING") {
            console.log(nextSong)
            console.log("The last song in the list has finished, pausing the player")
            videoPlayer.pause()
        }
    }
}

function getNowPlayingSong(videoPlayer) {
    const currentTime = videoPlayer.currentTime
    let i = 0
    for (const song of QUEUE) {
        if (song.start <= currentTime && currentTime <= song.end) {
            return [song, i]
        }
        i++
    }
    return [{
        "id": null,
        "name": "未在播放任何歌曲",
        "original_artist": "啟用自動播放以使用播放器功能",
        "art": DEFAULT_ART_BASE64,
        "start": 0,
        "end": 0
    }, -1]
}

function updateNowPlayingInfo(videoPlayer, forceUpdate) {
    const [nowSong, index] = getNowPlayingSong(videoPlayer)
    const currentTime = videoPlayer.currentTime
    const progressBar = document.getElementById("progress-bar")
    if (nowSong.id !== LAST_SONG_ID || forceUpdate) {
        // Update song info
        document.getElementById("hd-thumbnail").src = (nowSong.art || DEFAULT_ART_BASE64).replace("100x100", "500x500")
        document.getElementById("song-info-name").textContent = nowSong.name
        document.getElementById("song-info-name").title = nowSong.name
        document.getElementById("song-info-artist").textContent = nowSong.original_artist
        document.getElementById("song-info-artist").title = nowSong.original_artist
        // Update time length of the song
        const duration = nowSong.end - nowSong.start
        document.getElementById("progress-duration").textContent = secondsToFormattedString(duration)
        LAST_SONG_ID = nowSong.id
        const controlBtns = document.getElementsByClassName("control-buttons")
        if (nowSong.id === null) {
            for (const btn of controlBtns) {
                btn.disabled = true
            }
            progressBar.disabled = true
        } else {
            for (const btn of controlBtns) {
                btn.disabled = false
            }
            progressBar.disabled = false
            // Disable skip buttons on the first/last one
            if (index === QUEUE.length - 1) {
                document.getElementById("skip-next-btn").disabled = true
            }
            if (index === 0) {
                document.getElementById("skip-previous-btn").disabled = true
            }
        }
    }
    // Update progress bar
    if (nowSong.id === null) {
        progressBar.min = 0
        progressBar.max = 1
        progressBar.value = 0
        document.getElementById("progress-nowtime").textContent = "0:00"
        document.getElementById("progress-nowtime").title = "-0:00"
    } else {
        progressBar.min = `${nowSong.start}`
        progressBar.max = `${nowSong.end}`
        progressBar.value = currentTime
        document.getElementById("progress-nowtime").textContent = secondsToFormattedString(currentTime - nowSong.start)
        document.getElementById("progress-nowtime").title = `-${secondsToFormattedString(nowSong.end - currentTime)}`
    }
}

function renderQueue(songListTable, videoPlayer) {
    const tableLength = songListTable.rows.length
    for (let i = 0; i < (tableLength - 1); i++) {
        songListTable.deleteRow(-1)
    }
    let index = 1
    for (const song of QUEUE) {
        const row = songListTable.insertRow()
        // Song no.
        const songNoCell = row.insertCell()
        songNoCell.style.textAlign = "center"
        songNoCell.textContent = `${index}`
        // Song name
        const songNameCell = row.insertCell()
        songNameCell.style.paddingLeft = "0.3vw"
        const songNameDiv = document.createElement("div")
        songNameDiv.className = "song-name-div"
        const songName = document.createElement("p")
        songName.className = "song-name"
        songName.textContent = song["name"]
        const songArtist = document.createElement("p")
        songArtist.className = "song-artist"
        songArtist.textContent = song["original_artist"]
        songNameDiv.append(songName, songArtist)
        songNameCell.append(songNameDiv)
        // Song duration
        const songDurationCell = row.insertCell()
        songDurationCell.style.textAlign = "center"
        songDurationCell.textContent = secondsToFormattedString(song["end"] - song["start"])
        // Play button
        const playButton = document.createElement("button")
        playButton.id = `play-button-${index}`
        playButton.className = "play-button"
        playButton.textContent = "▶️"
        playButton.style.backgroundImage = `url(${song["art"]})`
        // Left click: seek to the start of the song
        playButton.addEventListener("click", () => {
            videoPlayer.currentTime = song["start"]
        })
        // Right click: open in Musicdex
        playButton.addEventListener("contextmenu", () => {
            window.open(`https://music.holodex.net/song/${song["id"]}`, "_blank")
        })
        row.insertCell().appendChild(playButton)
        index++
    }
}

function generateQueue(songListTable, videoPlayer, start, isRandom) {
    if (isRandom) {
        QUEUE = shuffle(QUEUE)
    } else {
        QUEUE = QUEUE.sort(compareSongSequence)
    }
    console.log("New queue:", QUEUE)
    renderQueue(songListTable, videoPlayer)
    let index = 0
    SONG_INDEX = []
    for (const song of QUEUE) {
        // Append to index
        SONG_INDEX.push([song["start"], song["end"], index])
        index++
    }
}


// Main function
function main() {
    // Try to remove previous ones
    LAST_SONG_ID = ""
    LAST_SONG_INDEX = 0
    IS_RANDOM = false
    QUEUE = []
    SONG_INDEX = []
    try {
        document.getElementById("song-list-div").remove()
    } catch (e) {}  // Ignore error when nothing found
    const vId = new URLSearchParams(window.location.search).get("v")
    if (vId === null) {
        console.log("No video ID found, not a video page.")
        return
    }
    let data = {}
    if (HOLODEX_API_KEY === null || HOLODEX_API_KEY === undefined) {
        console.warn("No API key found. Visit https://holodex.net/ and login to update your API key.")
        return
    } else {
        console.log(`Holodex API key found: ${HOLODEX_API_KEY.slice(0, 9)}****-****-****-************`)
    }
    fetch(`https://holodex.net/api/v2/videos/${vId}`, {headers: {"X-APIKEY": HOLODEX_API_KEY}})
        .then((response) => {
            console.log("API responded with status code: ", response.status)
            return response.json()
        })
        .then(response => {
            data = response
            if (!("songs" in data)) {
                console.log("No songs found.")
                return
            }
            // Get song list
            QUEUE = data.songs
            console.log(QUEUE)
            // Inject CSS
            const stylesheet = document.createElement("style");
            stylesheet.textContent = STYLE_TEXT;
            document.head.append(stylesheet)
            for (const url of GOOGLE_ICONS_URL) {
                const googleStylesheet = document.createElement("link")
                googleStylesheet.rel = "stylesheet"
                googleStylesheet.href = url
                document.head.append(googleStylesheet)
            }
            // Fetch YouTube elements
            const minorColumn = document.getElementById("secondary-inner")
            const videoPlayer = document.getElementsByTagName("video")[0]
            // Create song list div
            const songListDiv = document.createElement("div")
            songListDiv.id = "song-list-div"
            // Create div for table to prevent super long table
            const songListTableDiv = document.createElement("div")
            songListTableDiv.id = "song-list-table-div"
            songListTableDiv.style.height = "0px"
            songListTableDiv.style.visibility = "hidden"
            // Create "autoplay" switch
            const autoplayDiv = document.createElement("div")
            autoplayDiv.id = "autoplay-div"
            const autoplaySwitchLabel = document.createElement("label")
            autoplaySwitchLabel.id = "autoplay-switch-label"
            autoplaySwitchLabel.htmlFor = "autoplay-switch"
            autoplaySwitchLabel.textContent = "啟用自動播放"
            const autoplaySwitch = document.createElement("input")
            autoplaySwitch.id = "autoplay-switch"
            autoplaySwitch.type = "checkbox"
            autoplayDiv.append(autoplaySwitchLabel, autoplaySwitch)
            songListTableDiv.append(autoplayDiv)
            // Create player
            const playerDiv = document.createElement("div")
            playerDiv.id = "player-div"
            // Create info div
            const songInfoDiv = document.createElement("div")
            songInfoDiv.id = "song-info-div"
            const thumbnail = document.createElement("img")
            thumbnail.id = "hd-thumbnail"
            const songDetailDiv = document.createElement("div")
            songDetailDiv.id = "song-detail-div"
            const songName = document.createElement("span")
            songName.id = "song-info-name"
            const songArtist = document.createElement("span")
            songArtist.id = "song-info-artist"
            songDetailDiv.append(songName, songArtist)
            songInfoDiv.append(thumbnail, songDetailDiv)
            // Create control div
            const controlDiv = document.createElement("div")
            controlDiv.id = "control-div"
            controlDiv.style.display = "flex"
            const progressDiv = document.createElement("div")
            progressDiv.id = "progress-div"
            const nowTime = document.createElement("span")
            nowTime.id = "progress-nowtime"
            nowTime.className = "progress-span"
            nowTime.textContent = "0:00"
            const duration = document.createElement("span")
            duration.id = "progress-duration"
            duration.className = "progress-span"
            duration.textContent = "0:00"
            const progressBar = document.createElement("input")
            progressBar.id = "progress-bar"
            progressBar.type = "range"
            progressBar.addEventListener("input", () => {
                videoPlayer.currentTime = parseInt(progressBar.value)
            })
            progressDiv.append(nowTime, progressBar, duration)
            const repeatBtn = document.createElement("button")
            repeatBtn.classList.add("material-symbols-rounded", "control-buttons")
            repeatBtn.id = "repeat-btn"
            repeatBtn.textContent = "repeat"
            repeatBtn.addEventListener("click", () => {
                if (REPEAT_MODE === 2) {
                    REPEAT_MODE = 0
                } else {
                    REPEAT_MODE++
                }
                if (REPEAT_MODE === 0) {
                    repeatBtn.textContent = "repeat"
                } else if (REPEAT_MODE === 1) {
                    repeatBtn.textContent = "repeat_one_on"
                } else if (REPEAT_MODE === 2) {
                    repeatBtn.textContent = "repeat_on"
                }
            })
            const previousBtn = document.createElement("button")
            previousBtn.classList.add("material-symbols-rounded", "control-buttons")
            previousBtn.id= "skip-previous-btn"
            previousBtn.textContent = "skip_previous"
            const playBtn = document.createElement("button")
            playBtn.classList.add("material-symbols-rounded", "control-buttons")
            playBtn.id = "play-pause-btn"
            playBtn.textContent = "pause"
            playBtn.addEventListener("click", () => {
                if (videoPlayer.paused) {
                    videoPlayer.play().then()
                } else {
                    videoPlayer.pause()
                }
            })
            const nextBtn = document.createElement("button")
            nextBtn.classList.add("material-symbols-rounded", "control-buttons")
            nextBtn.id = "skip-next-btn"
            nextBtn.textContent = "skip_next"
            const shuffleBtn = document.createElement("button")
            shuffleBtn.classList.add("material-symbols-rounded", "control-buttons")
            shuffleBtn.id = "shuffle-btn"
            shuffleBtn.textContent = "shuffle"
            shuffleBtn.addEventListener("click", () => {
                let [_, nowSongIndex] = getNowPlayingSong(videoPlayer)
                if (IS_RANDOM) {
                    shuffleBtn.textContent = "shuffle"
                } else {
                    shuffleBtn.textContent = "shuffle_on"
                }
                IS_RANDOM = !IS_RANDOM
                generateQueue(songListTable, videoPlayer, nowSongIndex + 1, IS_RANDOM)
                updateNowPlayingInfo(videoPlayer, true)
            })
            controlDiv.append(repeatBtn, previousBtn, playBtn, nextBtn, shuffleBtn)
            playerDiv.append(songInfoDiv, progressDiv, controlDiv)
            autoplayDiv.append(playerDiv)
            // Create song list table
            const songListTable = document.createElement("table")
            songListTable.id = "song-list-table"
            songListTable.style.width = "100%"
            songListTable.style.backgroundColor = "#FFFFFF"
            songListTable.innerHTML = escapeHTMLPolicy.createHTML(`
            <tr style="height: fit-content">
                <th style="width: 5%">#</th>
                <th style="width: 75%">歌名</th>
                <th style="width: 10%">時長</th>
                <th style="width: 40px">播放</th>
            </tr>
            `)
            generateQueue(songListTable, videoPlayer, 0, false)
            // Set up autoplay after loop
            // Wrap autoplay as a lambda object, so that we can remove it when needed
            function apl() {
                autoplay(videoPlayer, false, false, false)
            }
            autoplaySwitch.addEventListener("change", () => {
                console.log("Autoplay enabled: ", autoplaySwitch.checked)
                if (autoplaySwitch.checked) {
                    videoPlayer.addEventListener("timeupdate", apl)
                } else {
                    videoPlayer.removeEventListener("timeupdate", apl)
                }
            })
            // Remove the old autoplay instance before switching to other videos
            document.addEventListener("yt-navigate-start", () => {
                try {
                    videoPlayer.removeEventListener("timeupdate", apl)
                } catch (e) {}
            })
            // Set up song info updater
            // Same reason as autoplay
            function unpil() {
                updateNowPlayingInfo(videoPlayer, false)
            }
            videoPlayer.addEventListener("timeupdate", unpil)
            document.addEventListener("yt-navigate-start", () => {
                try {
                    videoPlayer.removeEventListener("timeupdate", unpil)
                } catch (e) {}
            })
            videoPlayer.addEventListener("play", () => {
                playBtn.textContent = "pause"
            })
            videoPlayer.addEventListener("pause", () => {
                playBtn.textContent = "play_arrow"
            })
            // Set up control buttons
            function appl() {
                autoplay(videoPlayer, true, false, true)
            }
            previousBtn.addEventListener("click", appl)
            function apnl() {
                autoplay(videoPlayer, true, true, false)
            }
            nextBtn.addEventListener("click", apnl)
            // Append the table into its div before it appends into the main div
            songListTableDiv.append(songListTable)
            songListDiv.append(songListTableDiv)
            // Create "toggle song list" button
            const songListBtn = document.createElement("button")
            songListBtn.id = "song-list-btn"
            songListBtn.classList.add(
                "hd-button",
                "yt-spec-button-shape-next",
                "yt-spec-button-shape-next--outline",
                "yt-spec-button-shape-next--mono",
                "yt-spec-button-shape-next--size-m",
                "yt-spec-button-shape-next--enable-backdrop-filter-experiment"
            )
            songListBtn.textContent = "開啟歌曲清單"
            songListBtn.addEventListener("click", () => {
                if (songListTableDiv.style.visibility !== "visible") {
                    songListBtn.textContent = "關閉歌曲清單"
                    songListTableDiv.style.visibility = "visible"
                    songListTableDiv.style.height = ""
                } else {
                    songListBtn.textContent = "開啟歌曲清單"
                    songListTableDiv.style.visibility = "hidden"
                    songListTableDiv.style.height = "0px"
                }
            })
            songListDiv.prepend(songListBtn)
            minorColumn.prepend(songListDiv)
        })
        .catch((error) => {
            console.error(error)
        })
}

(function () {
    "use strict";

    console.log("Extension starts")
    if (window.location.hostname === "holodex.net") {
        console.log("We're in Holodex!")
        const rawData = JSON.parse(window.localStorage.getItem("holodex-v2"))
        if (rawData.userdata.user === null) {
            console.warn("Not logged in. Login to update your API key.")
            return
        }
        if (HOLODEX_API_KEY === null || HOLODEX_API_KEY === undefined) {
            console.log("API key is missing, fetching")
        } else if (HOLODEX_API_KEY !== rawData.userdata.user.api_key) {
            console.log("New API key found, updating")
        } else {
            console.log("Your API key is good to go!")
            return
        }
        HOLODEX_API_KEY = rawData.userdata.user.api_key
        GM_setValues({holodex_api_key: HOLODEX_API_KEY})
        console.log(`Your new API key: ${HOLODEX_API_KEY.slice(0, 9)}****-****-****-************`)
    }

    // 程式碼開始
    // if (new URLSearchParams(window.location.search).get("v") !== null) {
    //     document.addEventListener("load", main)
    // }
    // document.addEventListener("yt-navigate-finish", main)
    // main()

    document.addEventListener("yt-navigate-finish", () => {
        console.log("yt-navigate-finish")
        main()
    });
})()
