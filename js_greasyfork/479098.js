// ==UserScript==
// @name         Sploop Improver
// @namespace    -
// @version      -
// @description  Improves Sploop
// @author       Carolina Reaper
// @match        *://sploop.io/*
// @match        *://lostworld.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479098/Sploop%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/479098/Sploop%20Improver.meta.js
// ==/UserScript==
// Start Injection
let inject1 = Date.now();
console.log("Injecting Script, Sploop Improver.");

// Remove annoying pop-up before tab is closed
window.onbeforeunload = null;

//Element Remover
function remove(e) {
    e.forEach(t => document.getElementById(t) && document.getElementById(t).remove());
};

// Removes unnessecary stuff
setInterval(function() {
    remove(["google_play", "cross-promo", "da-bottom", "bottom-wrap", "right-content", "lostworld-io_970x250", "lostworld-io_300x250", "lostworld-io_300x250_1", "lostworld-io_300x250_2", "shop-io-games", "webgames-text", "da-right", "da-left"]);
}, 0);

// Create New Elements
let progress = document.createElement("div"), progressBar = document.createElement("div"), progressTitle = document.createElement("div"),
    percentageValue = document.createElement("div"), scoreValue = document.createElement("div"), rightTextKills = document.createElement("div"),
    rightTextDeaths = document.createElement("div"), killDeathRatio = document.createElement("div");

// Variables for menu parts
let bottom = document.getElementById("game-bottom-content"), right = document.getElementById("game-right-content-main"), left = document.getElementById("game-left-content-main");

// Provide ID and Class to elements
progress.classList.add("progress");
progressBar.classList.add("progressBar");
progressTitle.id = "progressTitle";
percentageValue.id = "percentageValue";
scoreValue.id = "scoreValue";
rightTextKills.id = "rightTextKills";
rightTextDeaths.id = "rightTextDeaths";
killDeathRatio.id = "killDeathRatio";
bottom.classList.add("boldBorders");
right.classList.add("boldBorders");
left.classList.add("boldBorders");

// Append elements to bottom
bottom.appendChild(progressTitle);
bottom.appendChild(progress);
progress.appendChild(progressBar);
progressBar.appendChild(percentageValue);
bottom.appendChild(scoreValue);

// Append elements to right
right.appendChild(rightTextKills);
right.appendChild(rightTextDeaths);
right.appendChild(killDeathRatio);

// Add innerHTML
progressTitle.innerHTML = "Rank Progress";

// Interval
setInterval(function() {
    let percentage = Math.round((parseInt(document.getElementById("total-score").innerText, 1e1) / (parseInt(document.getElementById("score-left-value").innerText, 1e1) + parseInt(document.getElementById("total-score").innerText, 1e1))) * 1e2);
    progressBar.style.width = percentage.toString() + "%";
    percentageValue.innerHTML = progressBar.style.width;
    scoreValue.innerHTML = "(" + document.getElementById("total-score").innerText + " / " + (parseInt(document.getElementById("score-left-value").innerText) + parseInt(document.getElementById("total-score").innerText)).toString() + ")";
    rightTextKills.innerHTML = "Total Kills<br>" + document.getElementById("total-kill").innerText;
    rightTextDeaths.innerHTML = "Total Deaths<br>" + document.getElementById("total-death").innerText;
    killDeathRatio.innerHTML = Math.round(parseInt(document.getElementById("total-kill").innerText) / parseInt(document.getElementById("total-death").innerText)) + " kills per death";
}, 0);

// Add CSS
let styleSheet = document.createElement("style");
styleSheet.innerText = `
.boldBorders {
    border: 5px solid rgb(20 20 20 / 30%);
    border-radius: 10px;
}

#game-bottom-content {
    width: 1000px;
    height: 225px;
}

#progressTitle {
    font-size: 25px;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    border: 7px solid rgba(0,0,0,0);
}

.progress {
    background-color: rgb(20 20 20 / 40%);
    border-radius: 25px;
    border: 5px solid rgb(20 20 20 / 80%);
    height: 50px;
    width: 700px;
    margin: auto;
}

.progressBar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    background-color: rgb(20 20 20 / 60%);
    height: 100%;
    width: 0%;
    transition: 1s ease 0.25s;
}

#percentageValue {
    color: rgba(255, 255, 255, 0.8);
    font-size: 18px;
    text-align: center;
}

#scoreValue {
    font-size: 18px;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    border: 5px solid rgba(0,0,0,0);
}

#rightTextKills {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.8);
    border: 10px solid rgba(0,0,0,0);
    text-align: center;
    float: left;
}

#rightTextDeaths {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.8);
    border: 10px solid rgba(0,0,0,0);
    text-align: center;
    float: right;
}

#killDeathRatio {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.8);
    border: 5px solid rgba(0,0,0,0);
    text-align: center;
}
`;
document.head.appendChild(styleSheet);

// FPS + Server
(function() {
    'use strict';
    try {
        window.admob = {
            requestInterstitialAd: () => {},
            showInterstitialAd: () => {}
        };
    } catch (e) {
        console.warn(e)
    };

    let UPDATE_DELAY = 7e2;
    let UPDATE_DELAY1 = 1e2;
    let frames = 0;
    let frames1 = 0;
    let lastUpdate = 0;
    let lastUpdate1 = 0;

    function updateCounter1() {
        let bgColor = getComputedStyle(document.body, null).getPropertyValue("background-color");
        let bgColorValues = cssColorToRGB(bgColor);
        let textColor = getInvertedRGB(bgColorValues);
        let displayBg = getOpaqueRGB(bgColorValues);
        let now = Date.now();
        let elapsed = now - lastUpdate1;

        if (elapsed < UPDATE_DELAY1) frames1++;
        else {
            frames1 = 0;
            lastUpdate1 = now;
        };

        requestAnimationFrame(updateCounter1);
    };

    lastUpdate1 = Date.now();
    requestAnimationFrame(updateCounter1);

    let displayElement = document.createElement("div");
    displayElement.style.padding = "20px";
    displayElement.style = "font-size:20px;"
    displayElement.style.display = "block";
    displayElement.style.position = "absolute";
    displayElement.style.top = "1px";
    displayElement.style.left = "50%";
    displayElement.style.transform = "translateX(-50%)";
    displayElement.textContent = "Loading...";
    displayElement.style.color = "#fff";
    displayElement.style.background = "rgba(255, 255, 255, 0)";
    document.body.appendChild(displayElement);

    function cssColorToRGB(color) {
        let values;

        if (color.startsWith("rgba")) {
            values = color.substring(5, color.length - 1).split(",");
        } else if (color.startsWith("rgb")) {
            values = color.substring(4, color.length - 1).split(",");
        } else if (color.startsWith("#") && color.length === 4) {
            values = [];
            values[0] = "" + parseInt("0x" + color.substr(1, 1));
            values[1] = "" + parseInt("0x" + color.substr(2, 1));
            values[2] = "" + parseInt("0x" + color.substr(3, 1));
        } else if (color.startsWith("#") && color.length === 7) {
            values = [];
            values[0] = "" + parseInt("0x" + color.substr(1, 2));
            values[1] = "" + parseInt("0x" + color.substr(3, 2));
            values[2] = "" + parseInt("0x" + color.substr(5, 2));
        } else return {
            r: 255,
            g: 255,
            b: 255
        };

        return {
            r: Number(values[0]),
            g: Number(values[1]),
            b: Number(values[2])
        };
    };

    function getInvertedRGB(values) {
        return "rgb(" + (255 - values.r) + "," + (255 - values.g) + "," + (255 - values.b) + ")";
    };

    function getOpaqueRGB(values) {
        return "rgba(" + values.r + "," + values.g + "," + values.b + ", 0.7)";
    };

    const dropDown = document.querySelector("#server-select");

    function updateCounter() {
        let bgColor = getComputedStyle(document.body, null).getPropertyValue("background-color");
        let bgColorValues = cssColorToRGB(bgColor);
        let textColor = getInvertedRGB(bgColorValues);
        let displayBg = getOpaqueRGB(bgColorValues);
        let now = Date.now();
        let elapsed = now - lastUpdate;

        if (elapsed < UPDATE_DELAY) frames++;
        else {
            let fps = Math.round(frames / (elapsed / 1e3));
            frames = 0;
            lastUpdate = now;
            displayElement.textContent = `Fps: ${fps} \n ${dropDown.value.split(" -")[0]}`;
        };

        requestAnimationFrame(updateCounter);
    };

    lastUpdate = Date.now();
    requestAnimationFrame(updateCounter);
})();

// Complete Injection
let injectionTime = Date.now() - inject1;
console.log("Injection Complete, Sploop Improver.\nInjection Time: " + injectionTime + "ms");