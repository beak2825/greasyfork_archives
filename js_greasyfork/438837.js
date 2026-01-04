// ==UserScript==
// @name          Geoguessr百度街景脚本
// @description   For a full list of features included in this script, see this document https://docs.google.com/document/d/18nLXSQQLOzl4WpUgZkM-mxhhQLY6P3FKonQGp-H0fqI/edit?usp=sharing
// @version       6.2.1
// @author        Jupaoqq
// @match         https://www.geoguessr.com/*
// @run-at        document-start
// @license       MIT
// @namespace     https://greasyfork.org/users/838374
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/438837/Geoguessr%E7%99%BE%E5%BA%A6%E8%A1%97%E6%99%AF%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438837/Geoguessr%E7%99%BE%E5%BA%A6%E8%A1%97%E6%99%AF%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

console.log("Geoguessr百度街景脚本 v6.2.1 by Jupaoqq");

// Store each player instance
let BAIDU_INJECTED;

// Game mode detection
let isBattleRoyale = false;
let isDuel = false;
let isBullseye = false;
let isLiveChallenge = false;

// Player detection and coordinate conversion
let nextPlayer = "Google";
let global_lat = 0;
let global_lng = 0;
let global_panoID = null;
let global_BDID;

// Callback variables
let playerLoaded = false;
let locHistory = [];

// Round check
let ROUND = 0;
let CURRENT_ROUND_DATA = null;
let switch_call = true;
let one_reset = false;

var isFirefox = typeof InstallTrigger !== 'undefined';
let linksList = []
let fire1 = true;
let allowDetect = false;

// Geoguessr Canvas String Names
let GENERAL_LAYOUT = ".game-layout__canvas";
let GENERAL_CANVAS = ".game-layout__panorama-canvas";
let BR_CANVAS = ".br-game-layout__panorama-canvas";
let BR_WRAPPER = ".br-game-layout__panorama-wrapper";
let BR_LAYOUT = ".br-game-layout";
let FAIL_TO_LOAD_CANVAS = ".game-layout__panorama-message";
let DUEL_LAYOUT = ".game_layout__TO_jf";
let DUELS_CANVAS = ".game-panorama_panorama__rdhFg";
let DUELS_CANVAS2 = ".game-panorama_panoramaCanvas__PNKve";
let BULLSEYE_CANVAS = ".game-panorama_panorama__ncMwh";
let BULLSEYE_CANVAS2 = ".game-panorama_panoramaCanvas__r_5ea";
let LIVE_CANVAS = ".game-panorama_panorama__Qpsxl";
let LIVE_CANVAS2 = ".game-panorama_panoramaCanvas__LaXCd";
let DUELS_POPUP = ".overlay_overlay__AR02x";
let BR_POPUP = ".popup__content";
let rtded = false;
let NM = false;
let NP = false;
let NZ = false;
let GAME_CANVAS = "";
let DUEL_CANVAS = "";

/**
 * Helper Functions
 */
// Highlight API Load Message

function myHighlight(...args) {
    console.log(`%c${[...args]}`, "color: dodgerblue; font-size: 24px;");
}

// Hex to number conversion for Baidu coordinate conversion
function hex2a(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
    {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

// Script injection, extracted from extenssr:
// https://gitlab.com/nonreviad/extenssr/-/blob/main/src/injected_scripts/maps_api_injecter.ts

function launchObserver() {
    console.log("Main Observer");
    let observer3 = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (oldHref != document.location.href && allowDetect) {
                oldHref = document.location.href;
                detectGamePage();
            }
            if (mutation.addedNodes)
            {
                for (let m of mutation.addedNodes) {
                    if (m.classList)
                    {
                        let PATHNAME = window.location.pathname;
                        if (m.getElementsByClassName("tooltip_tooltip__CHe2s").length !== 0)
                        {
                            detectGamePage();
                        }
                        else if ((PATHNAME.startsWith("/challenge/") ||PATHNAME.startsWith("/results/") ||
                                  PATHNAME.startsWith("/game/")|| PATHNAME.startsWith("/battle-royale/") ||
                                  PATHNAME.startsWith("/duels/") || PATHNAME.startsWith("/team-duels/") ||
                                  PATHNAME.startsWith("/bullseye/")) && (m.getElementsByClassName('fullscreen-spinner_square__mwMfl').length !== 0))
                        {
                            if (allowDetect)
                            {
                                detectGamePage();
                            }
                        }
                        else if ((PATHNAME.startsWith("/duels/") || PATHNAME.startsWith("/team-duels/")) && (m.classList.contains('new-round_roundInfo__UlMCc')))
                        {
                            if (allowDetect)
                            {
                                detectGamePage();
                            }
                        }
                        else if (PATHNAME.startsWith("/live-challenge/") && (m.classList.contains('round-starting_wrapper__1G_FC')))
                        {
                            // console.log("detect live challie")
                            if (allowDetect)
                            {
                                detectGamePage();
                            }
                        }
                        let sat = m.getElementsByClassName('result-layout_bottom__qLPd2');
                        if (m.getElementsByClassName('result-layout_bottom__qLPd2').length !== 0)
                        {
                            // console.log("Round middle Callback");
                            nextButtonCallback();
                        }
                        let sat2 = m.getElementsByClassName('guess-map__canvas-container');
                    }
                }
            }
        })
    })
    observer3.observe(document.body, {childList: true, subtree: true, attributes: false, characterData: false})
}

/**
 * Once the Google Maps API was loaded we can do more stuff
 */

var oldHref = document.location.href;
window.addEventListener('DOMContentLoaded', (event) => {
    launchObserver();
});

const base62 = {
    charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split(''),
    encode: integer => {
        if (integer === 0) {
            return 0;
        }
        let s = [];
        while (integer > 0) {
            s = [base62.charset[integer % 62], ...s];
            integer = Math.floor(integer / 62);
        }
        return s.join('');
    },
    decode: chars => chars.split('').reverse().reduce((prev, curr, i) =>
                                                      prev + (base62.charset.indexOf(curr) * (62 ** i)), 0)
};

/**
 * Check whether the current page is a game, if so which game mode
 */

function detectGamePage() {
    if (document.querySelector(FAIL_TO_LOAD_CANVAS) !== null && !one_reset)
    {
        one_reset = true;
        console.log("Hide fail to load panorama canvas");
        document.querySelector(FAIL_TO_LOAD_CANVAS).style.visibility = "hidden";
    }
    function loadModule()
    {
        if (toLoad) {
            initializeCanvas();
        }
        waitLoad();
    }
    let toLoad = !playerLoaded;
    const PATHNAME = window.location.pathname;
    if (PATHNAME.startsWith("/game/") || PATHNAME.startsWith("/challenge/")) {
        isBattleRoyale = false;
        isDuel = false;
        loadModule();
    }
    else if (PATHNAME.startsWith("/battle-royale/")) {
        if (document.querySelector(BR_LAYOUT) == null) {
            rstValues();
        }
        else {
            isBattleRoyale = true;
            isDuel = false;
            loadModule();
        }
    }
    else if (PATHNAME.startsWith("/duels/") || PATHNAME.startsWith("/team-duels/")) {
        if (document.querySelector(DUEL_LAYOUT) == null) {
            rstValues();
        }
        else {
            isBattleRoyale = true;
            isDuel = true;
            loadModule();
        }
    }
    else if (PATHNAME.startsWith("/bullseye/")) {
        if (document.querySelector(".game_layout__0vAWj") == null) {
            rstValues();
        }
        else {
            isBattleRoyale = true;
            isBullseye = true;
            if (document.getElementById("player") == null)
            {
                loadModule();
            }
        }
    }
    else if (PATHNAME.startsWith("/live-challenge/")) {
        if (document.querySelector(".panorama-question_layout__DYh_Y") == null) {
            rstValues();
        }
        else {
            isLiveChallenge = true;
            isBattleRoyale = true;
            loadModule();
        }
    }
    else {
        rstValues();
    }
}
function rstValues()
{
    ROUND = 0;
    BAIDU_INJECTED = false;
    nextPlayer = "Google";
    global_lat = 0;
    global_lng = 0;
    global_panoID = null;
    global_BDID = null;
    playerLoaded = false;
    locHistory = [];
    one_reset = false;
    CURRENT_ROUND_DATA = null;
    isDuel = false;
    isBattleRoyale = false;
    isBullseye = false;
    isLiveChallenge = false;
    rtded = false;
    linksList = [];
    NM = false;
    NP = false;
    NZ = false;
    GAME_CANVAS = "";
    DUEL_CANVAS = "";
}

/**
 * Wait for various players to load
 */

function waitLoad() {
    if (!document.getElementById("i_container") ) {
        if (isBullseye && (document.getElementById("player") == null))
        {
            BAIDU_INJECTED = false;
            initializeCanvas();
        }
        setTimeout(waitLoad, 250);
    } else {
        checkRound();
    }
}

/**
 * Checks for round changes
 */

function checkRound() {
    if (!isBattleRoyale) {
        let currentRound = getRoundFromPage();
        if (ROUND != currentRound) {
            console.log("New round");
            ROUND = currentRound;
            locHistory = [];
            one_reset = false;
            getMapData();
        }
    }
    else {
        getMapData();
    }
}

/**
 * Add listeners if buttons have been created
 */

function finalDetail()
{
    let target = document.querySelector("a[data-qa='play-same-map']");
    if (target)
    {
        var div = document.createElement("div");
        div.classList.add("buttons_buttons__0B3SB")
        document.querySelector('.result-layout_content__jAHfP').appendChild(div);
        for (var rd of linksList)
        {
            let str = rd[1];
            let cl = target.cloneNode( true );
            let tx = "View R" + rd[0] + " in " + str;
            cl.querySelector('.button_label__kpJrA').innerHTML = tx;
            cl.removeAttribute('data-qa');
            cl.removeAttribute('href');
            cl.urlStr = rd[2];
            cl.addEventListener("click", (e) => {
                window.open(cl.urlStr);
            })
            cl.style = "top:10px;right:-10px;";
            div.appendChild(cl);
        }
    }
    else
    {
        setTimeout(finalDetail, 500);
    }
}
function nextButtonCallback()
{
    let nextButton = document.querySelector("button[data-qa='close-round-result']");
    nextButton.addEventListener("click", (e) => {
        if (ROUND == 5)
        {
            console.log("Game Finished")
            if (linksList)
            {
                finalDetail();
            }
        }
    })
    let urlStr = ""
    if (nextPlayer !== "Google")
    {
        let clone = document.querySelector("button[data-qa='close-round-result']").cloneNode( true );
        let tx = "View Location in " + nextPlayer;
        clone.querySelector('.button_label__kpJrA').innerHTML = tx;
        clone.setAttribute('id', "LinkBtn");
        clone.removeAttribute('data-qa');
        if (nextPlayer == "Baidu")
        {
            urlStr = "https://map.baidu.com/?panotype=street&pid=" + global_BDID + "&panoid=" + global_BDID + "&from=api";
        }
        clone.addEventListener("click", (e) => {
            window.open(urlStr);
        })
        if (ROUND == 5)
        {
            clone.style = "top:10px;";
        }
        else
        {
            clone.style = "right:-10px;";
        }
        linksList.push([ROUND, nextPlayer, urlStr]);
        document.querySelector('.round-result_actions__5j26U').appendChild(clone);
    }
}

/**
 * Load different streetview players
 */

function loadPlayers() {
    playerLoaded = true;
    injectContainer();
    getSeed().then((data) => {
        if (typeof data.isRated !== 'undefined')
        {
            rtded = data.isRated;
        }
        if (typeof data.options !== 'undefined')
        {
            if (typeof data.options.isRated !== 'undefined')
            {
                rtded = data.options.isRated;
            }
        }
    }).catch((error) => {
        console.log(error);
    });
}

/**
 * Handles Return to start and undo
 */

function handleReturnToStart() {
    let rtsButton = document.querySelector("button[data-qa='return-to-start']");
    rtsButton.addEventListener("click", (e) => {
        if (nextPlayer !== "Baidu")
        {
            goToLocation(true);
        }
        else
        {
            document.getElementById("i_container").src = "https://map.baidu.com/?panotype=street&pid=" + global_BDID + "&panoid=" + global_BDID + "&from=api";
        }
        const elementClicked = e.target;
        elementClicked.setAttribute('listener', 'true');
        console.log("Return to start");
    });
}

/**
 * Load game information
 */

function modularget(data)
{
    if (data)
    {
        locationCheck(data);
        goToLocation(true);
        handleButtons();
    }
}

function getMapData() {
    getSeed().then((data) => {
        let mainMenuBtn = document.getElementById("Show Buttons")
        if (isBattleRoyale) {
            if (data.status == "Finished" || typeof data.gameId == typeof undefined) {
            }
            else
            {
                let origin = false;
                if (!CURRENT_ROUND_DATA) {
                    CURRENT_ROUND_DATA = data
                    origin = true;
                }
                if (origin || !(data.currentRoundNumber === CURRENT_ROUND_DATA.currentRoundNumber)) {
                    locHistory = [];
                    one_reset = false;
                    if (!origin) {
                        CURRENT_ROUND_DATA = data;
                    }
                    modularget(data);
                }
            }
        }
        else {
            modularget(data);
        }
    }).catch((error) => {
        console.log(error);
    });
}
/**
 * Hide unnecessary buttons for non-Google coverages
 */
function handleButtons() {
    let CHECKPOINT = document.querySelector("button[data-qa='set-checkpoint']");
    let ZOOM_IN = document.querySelector("button[data-qa='pano-zoom-in']");
    let ZOOM_OUT = document.querySelector("button[data-qa='pano-zoom-out']");
    let UNDO_MOVE = document.querySelector("button[data-qa='undo-move']");
    let DEFAULT_COMPASS = document.querySelector(".compass");
    let NEW_COMPASS = document.querySelector(".panorama-compass_compassContainer__MEnh0");
    let RETURN_TO_START = document.querySelector("button[data-qa='return-to-start']");
    let C1 = (CHECKPOINT !== null);
    let C2 = (ZOOM_IN !== null);
    let C3 = (ZOOM_OUT !== null);
    let C4 = (UNDO_MOVE !== null);
    let C5 = (DEFAULT_COMPASS !== null);
    let C6 = (NEW_COMPASS !== null);
    let C7 = (RETURN_TO_START !== null);
    let waitCond = C5 || C6;
    let cpCond = true;
    let comCond = true;
    if (!NM)
    {
        cpCond = C1 && C4 && C7;
    }
    if (!NZ)
    {
        comCond = C2 && C3;
    }
    function moduleButtons(cond)
    {
        if (!NM)
        {
            CHECKPOINT.style.visibility = cond;
            UNDO_MOVE.style.visibility = cond;
        }
        if (!NZ)
        {
            ZOOM_IN.style.visibility = cond;
            ZOOM_OUT.style.visibility = cond;
        }
        if (C5)
        {
            DEFAULT_COMPASS.style.visibility = cond;
        }
        if (C6)
        {
            NEW_COMPASS.style.visibility = cond;
        }
    }
    if (waitCond && cpCond && comCond)
    {
        if (nextPlayer === "Google") {
            moduleButtons("");
        }
        else if (nextPlayer === "Baidu" )
        {
            moduleButtons("hidden");
        }
        if (!NM)
        {
            handleReturnToStart();
        }
    }
    else
    {
        setTimeout(handleButtons, 250);
    }
}

/**
 * Check which player to use for the next location
 */

function locationCheck(data) {
    let round;
    // console.log(data);
    if (isBattleRoyale) {
        if (isDuel || isBullseye)
        {
            round = data.rounds[data.currentRoundNumber - 1].panorama;
        }
        else if (isLiveChallenge)
        {
            round = data.rounds[data.currentRoundNumber - 1].question.panoramaQuestionPayload.panorama;
        }
        else
        {
            round = data.rounds[data.currentRoundNumber - 1];
        }
    }
    else {
        round = data.rounds[data.round - 1];
    }
    global_lat = round.lat;
    global_lng = round.lng;
    global_panoID = round.panoId;
    nextPlayer = "Google";
    if (global_panoID) {
        let locInfo;
        if (isBullseye)
        {
            locInfo = global_panoID;
        }
        else
        {
            locInfo = hex2a(global_panoID);
        }
        let mapType = locInfo.substring(0, 5);
        if (mapType === "BAIDU" ) {
            nextPlayer = "Baidu";
            let lengths = [5, 7, 7, 3];
            let toPiece = lengths.map((p => i => locInfo.slice(p, p += i))(0));
            let panoId1 = base62.decode(toPiece[1]).toString().substring(1);
            let panoId2 = base62.decode(toPiece[2]).toString().substring(1);
            global_BDID = panoId1 + panoId2 + toPiece[3]
        }
    }
    else
    {
        nextPlayer = "Google";
    }
    // Disable buttons if NM, NMPZ
    if(!isBattleRoyale)
    {
        NM = data.forbidMoving;
        NP = data.forbidRotating;
        NZ = data.forbidZooming;
    }
    else
    {
        if (isBullseye || isLiveChallenge)
        {
            NM = data.options.movementOptions.forbidMoving;
            NP = data.options.movementOptions.forbidRotating;
            NZ = data.options.movementOptions.forbidZooming;
        }
        else
        {
            NM = data.movementOptions.forbidMoving;
            NP = data.movementOptions.forbidRotating;
            NZ = data.movementOptions.forbidZooming;
        }
    }
    if (!rtded)
    {
        injectCanvas();
    }
    else
    {
        console.log("rated game, no canvas injection");
    }
}

/**
 * setID for canvas
 */

function initializeCanvas() {
    GAME_CANVAS = "";
    DUEL_CANVAS = "";
    if (isBattleRoyale) {
        if (isDuel) {
            GAME_CANVAS = document.querySelector(DUELS_CANVAS);
            DUEL_CANVAS = document.querySelector(DUELS_CANVAS2);
        }
        else if (isBullseye) {
            GAME_CANVAS = document.querySelector(BULLSEYE_CANVAS);
            DUEL_CANVAS = "dummy";
        }
        else if (isLiveChallenge)
        {
            GAME_CANVAS = document.querySelector(LIVE_CANVAS);
            DUEL_CANVAS = "dummy";
        }
        else
        {
            GAME_CANVAS = document.querySelector(BR_WRAPPER);
            DUEL_CANVAS = "dummy";
        }
    }
    else {
        GAME_CANVAS = document.querySelector(GENERAL_LAYOUT);
        DUEL_CANVAS = "dummy";
    }
    if (GAME_CANVAS && DUEL_CANVAS)
    {
        console.log("Canvas injected");
        GAME_CANVAS.id = "player";
        if (isDuel) {
            DUEL_CANVAS.id = "default_player";
        }
        loadPlayers();
    }
    else
    {
        setTimeout(initializeCanvas, 250);
    }
}

/**
 * Hide or show players based on where the next location is
 */

function injectCanvas() {
    if (isDuel)
    {
        if (!rtded)
        {
            canvasSwitch();
        }
    }
    else
    {
        Google();
        Baidu();
    }
}

// for duels (class ID change)

function canvasSwitch()
{
    let GOOGLE_MAPS_CANVAS = document.querySelector(DUELS_CANVAS);
    let BAIDU_MAPS_CANVAS = document.getElementById("i_container");
    if (GOOGLE_MAPS_CANVAS && BAIDU_MAPS_CANVAS )
    {
        document.getElementById("default_player").style.position = "absolute";
        document.getElementById("default_player").className = "inactive";
        BAIDU_MAPS_CANVAS.style.position = "absolute";
        BAIDU_MAPS_CANVAS.className = "inactive";
        BAIDU_MAPS_CANVAS.visibility = "hidden";
        if (nextPlayer === "Google") {
            document.getElementById("default_player").className = "game-panorama_panoramaCanvas__PNKve";
            document.getElementById("default_player").visibility = "";
            console.log("Google Duel Canvas loaded");
        }
        else if (nextPlayer === "Baidu" )
        {
            BAIDU_MAPS_CANVAS.visibility = "";
            BAIDU_MAPS_CANVAS.className = "game-panorama_panorama__rdhFg";
            console.log("Container Duel Canvas loaded");
        }
    }
    else
    {
        setTimeout(canvasSwitch(), 1000);
    }
}

// for Battle Royale and classic (change visibility)

function gCanvas()
{
    let GOOGLE_MAPS_CANVAS = ""
    if (isBattleRoyale) {
        if (isBullseye)
        {
            GOOGLE_MAPS_CANVAS = document.querySelector(BULLSEYE_CANVAS2);
        }
        else if (isLiveChallenge)
        {
            GOOGLE_MAPS_CANVAS = document.querySelector(LIVE_CANVAS2);
        }
        else
        {
            GOOGLE_MAPS_CANVAS = document.querySelector(BR_CANVAS);
        }
    }
    else {
        GOOGLE_MAPS_CANVAS = document.querySelector(GENERAL_CANVAS);
    }
    return GOOGLE_MAPS_CANVAS;
}

function Google() {
    let GOOGLE_MAPS_CANVAS = gCanvas();
    if (GOOGLE_MAPS_CANVAS !== null)
    {
        if (nextPlayer === "Google") {
            GOOGLE_MAPS_CANVAS.style.visibility = "";
        }
        else {
            GOOGLE_MAPS_CANVAS.style.visibility = "hidden";
        }
    }
    else
    {
        setTimeout(Google, 250);
    }
}

function Baidu() {
    let BAIDU_MAPS_CANVAS = document.getElementById("i_container");
    if (BAIDU_MAPS_CANVAS !== null)
    {
        BAIDU_MAPS_CANVAS.style.position = "absolute";
        if (nextPlayer === "Baidu") {
            BAIDU_MAPS_CANVAS.style.visibility = "";
            console.log("Container Canvas loaded");
        }
        else {
            BAIDU_MAPS_CANVAS.style.visibility = "hidden";
        }
    }
    else
    {
        setTimeout(Baidu, 250);
    }
}

function goToLocation(cond) {
    console.log("Going to location");
    console.log(nextPlayer);
    if (nextPlayer === "Baidu" ) {
        if (document.getElementById("i_container") !== null)
        {
            let iframe = document.getElementById("i_container");
            if (!isFirefox)
            {
                iframe.style.top = '-60px';
                iframe.style.height = (window.innerHeight + 200) + 'px';
            }
            else
            {
                iframe.style.top = '-60px';
                iframe.style.height = (window.innerHeight + 219) + 'px';
            }
            if (!isFirefox)
            {
                iframe.style.right = '-55px';
                iframe.style.width = (window.innerWidth + 55) + 'px';
            }
            else
            {
                iframe.style.right = '-15px';
                iframe.style.width = (window.innerWidth + 15) + 'px';
            }
            let urlStr2 = "https://map.baidu.com/?panotype=street&pid=" + global_BDID + "&panoid=" + global_BDID + "&from=api";
            iframe.src = urlStr2;
            iframe.style.visibility = "";
        }
    }
}

/**
 * Gets the seed data for the current game
 *
 * @returns Promise with seed data as object
 */

function getSeed() {
    // console.log("get seed");
    return new Promise((resolve, reject) => {
        let token = getToken();
        let URL;
        let cred = ""
        const PATHNAME = window.location.pathname;
        if (PATHNAME.startsWith("/game/")) {
            URL = `https://www.geoguessr.com/api/v3/games/${token}`;
        }
        else if (PATHNAME.startsWith("/challenge/")) {
            URL = `https://www.geoguessr.com/api/v3/challenges/${token}/game`;
        }
        else if (PATHNAME.startsWith("/battle-royale/")) {
            URL = `https://game-server.geoguessr.com/api/battle-royale/${token}`;
        }
        else if (PATHNAME.startsWith("/duels/") || PATHNAME.startsWith("/team-duels/")) {
            URL = `https://game-server.geoguessr.com/api/duels/${token}`;
        }
        else if (PATHNAME.startsWith("/bullseye/")) {
            URL = `https://game-server.geoguessr.com/api/bullseye/${token}`;
        }
        else if (PATHNAME.startsWith("/live-challenge/")) {
            URL = `https://game-server.geoguessr.com/api/live-challenge/${token}`;
        }
        if (isBattleRoyale) {
            fetch(URL, {
                // Include credentials to GET from the endpoint
                credentials: 'include'
            })
                .then((response) => response.json())
                .then((data) => {
                resolve(data);
            })
                .catch((error) => {
                reject(error);
            });
        }
        else {
            fetch(URL)
                .then((response) => response.json())
                .then((data) => {
                resolve(data);
            })
                .catch((error) => {
                reject(error);
            });
        }
    });
}

/**
 * Gets the token from the current URL
 *
 * @returns token
 */

function getToken() {
    const PATHNAME = window.location.pathname;
    if (PATHNAME.startsWith("/game/")) {
        return PATHNAME.replace("/game/", "");
    }
    else if (PATHNAME.startsWith("/challenge/")) {
        return PATHNAME.replace("/challenge/", "");
    }
    else if (PATHNAME.startsWith("/battle-royale/")) {
        return PATHNAME.replace("/battle-royale/", "");
    }
    else if (PATHNAME.startsWith("/duels/")) {
        return PATHNAME.replace("/duels/", "");
    }
    else if (PATHNAME.startsWith("/team-duels/")) {
        return PATHNAME.replace("/team-duels/", "");
    }
    else if (PATHNAME.startsWith("/bullseye/")) {
        return PATHNAME.replace("/bullseye/", "");
    }
    else if (PATHNAME.startsWith("/live-challenge/")) {
        return PATHNAME.replace("/live-challenge/", "");
    }
}

/**
 * Gets the round number from the ongoing game from the page itself
 *
 * @returns Round number
 */

function getRoundFromPage() {
    const roundData = document.querySelector("div[data-qa='round-number']");
    if (roundData) {
        let roundElement = roundData.querySelector("div:last-child");
        if (roundElement) {
            let round = parseInt(roundElement.innerText.charAt(0));
            if (!isNaN(round) && round >= 1 && round <= 5) {
                return round;
            }
        }
    }
    else {
        return ROUND;
    }
}

/**
 * Injects Baidu script
 */

function reportWindowSize() {
    let iframeC = document.getElementById("i_container");
    if (iframeC)
    {
        if (nextPlayer == "Baidu")
        {
            iframeC.style.top = '-60px';
            iframeC.style.height = (window.innerHeight + 200) + 'px';
            iframeC.style.right = '-55px';
            iframeC.style.width = (window.innerWidth + 55) + 'px';
        }
    }
}

window.onresize = reportWindowSize;

function injectContainer() {
    myHighlight("iframe container loaded")
    const iframe = document.createElement('iframe');
    iframe.frameBorder = 0;
    iframe.style.position = "absolute";
    iframe.id = "i_container";
    if (isBattleRoyale) {
        if (isDuel)
        {
            iframe.className = "inactive";
        }
        else if (isBullseye)
        {
            iframe.className = "game-panorama_panorama__ncMwh";
        }
        else if (isLiveChallenge)
        {
            iframe.className = "game-panorama_panorama__Qpsxl";
        }
        else
        {
            iframe.className = "br-game-layout__panorama";
        }
    }
    else {
        iframe.className = "game-layout__panorama";
    }
    var div = document.getElementById("player");
    if (div)
    {
        div.style.overflow = "hidden";
        if (isBullseye || isLiveChallenge)
        {
            div.prepend(iframe);
        }
        else
        {
            div.appendChild(iframe);
        }
    }
}
