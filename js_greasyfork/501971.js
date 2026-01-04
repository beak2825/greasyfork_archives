// ==UserScript==
// @name         Ratio Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  dunno
// @author       snowy man aka Snowfall
// @match        https://*diep.io/*
// @license      /??
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501971/Ratio%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/501971/Ratio%20Script.meta.js
// ==/UserScript==

(function() {
    let startTime = 0;
    let spawnedIn = false;
    let counter
    let prettyText = false

    const create = () => {
        counter = document.createElement('div');

        counter.style.position = 'fixed';
        counter.style.right = '0';
        counter.style.top = '68%';
        counter.style.transform = 'translateY(-50%)';
        counter.style.color = 'white';
        counter.style.textShadow = '2px 2px 0 black, -2px -2px 0 black, -2px 2px 0 black, 2px -2px 0 black';
        counter.style.background = 'none';
        counter.style.padding = '10px';
        counter.style.fontSize = '20px';
        counter.style.zIndex = '1000';

        document.body.appendChild(counter);
    };
    create()

    const getTime = () => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const seconds = Math.floor((now - startOfDay) / 1000);
        return seconds;
    }

    const format = (hours, minutes, seconds) => {
        let time;
        if (hours > 0) {
            time = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else if (minutes > 0) {
            time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        } else {
            time = `${seconds}`;
        }
        return time;
    };

    const spawned = () => {
        if (__common__.screen_state === "in-game") {
            if (!spawnedIn) {
                startTime = getTime();
            }
            spawnedIn = true;
        } else {
            spawnedIn = false;
        }
        return spawnedIn;
    }

    const updateTime = () => {
        spawned();

        if (spawnedIn) {
            const now = getTime();
            const time = now - startTime;

            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;

            if (prettyText) {
                counter.textContent = format(hours, minutes, seconds);
            } else {
                counter.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
            }
        } else {
            counter.textContent = "00:00:00"
        }
    }

    setInterval(updateTime, 1000);
})();
