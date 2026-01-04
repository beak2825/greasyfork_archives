// ==UserScript==
// @name         MooMoo.js anticheat calculator (improved)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sort of calculating kick level
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1132127
// @author       Lovou#4725 & ▄︻デW4IT?̷══━一#1814(added PPS)
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457414/MooMoojs%20anticheat%20calculator%20%28improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457414/MooMoojs%20anticheat%20calculator%20%28improved%29.meta.js
// ==/UserScript==

const MooMoo = (function MooMooJS_beta() {})[69]

let kickCount = 0;
let kickCountSec = 0;
let intervalStarted = false;
const resetInterval = 60000;
const resetIntervalSec = 1000;
let resetTime = Date.now() + resetInterval;
let resetSecTime =Date.now() + resetIntervalSec;

const resetKickCount = () => {
    kickCount = 0;
    resetTime = Date.now() + resetInterval;
};

const resetSecKickCount = () => {
    kickCountSec = 0;
    resetSecTime =Date.now() + resetIntervalSec;
};

MooMoo.addEventListener("packet", () => {
    if (!intervalStarted) {
        intervalStarted = true;
        setInterval(() => {
            const currentTime = Date.now();
            if (currentTime >= resetTime) {
                resetKickCount();
            }
            if (currentTime >= resetSecTime) {
                resetSecKickCount();
            }
        }, 100);
    }
});

const incrementKickCount = () => {
    kickCount++;
    kickCountSec++;
};

const calculateKickPercentage = (kicks, goal) => (kicks / goal) * 100;

const setStyles = element => {
    const styles = {
        position: "absolute",
        top: "0px",
        left: "0px",
        color: "white",
        fontFamily: "monospace",
        fontSize: "24px"
    };

    Object.entries(styles).forEach(([key, value]) => {
        element.style[key] = value;
    });
};

const displayGameInfo = () => {
    const gameInfoElement = document.createElement("div");
    setStyles(gameInfoElement);
    gameInfoElement.id = "playerPosition";

    document.body.appendChild(gameInfoElement);

    const updateGameInfo = () => {
        const currentTime = Date.now();
        const timeRemaining = resetTime - currentTime;
        const timeRemainingSec = resetSecTime - currentTime;
        document.getElementById("playerPosition").innerText = `Kick (PPM): ${Math.round(
            calculateKickPercentage(kickCount, 5400)
        )}% | Kick (PPS): ${Math.round(
            calculateKickPercentage(kickCountSec, 90)
        )}% \n Reset PPM: ${(timeRemaining / 1000).toFixed(1)} | PPM: ${kickCount}\n Reset PPS: ${(timeRemainingSec / 1000).toFixed(1)} | PPS: ${kickCountSec}`;
    };

    setInterval(updateGameInfo, 100);
};

MooMoo.onClientPacket = incrementKickCount;
MooMoo.onGameLoad = displayGameInfo;
