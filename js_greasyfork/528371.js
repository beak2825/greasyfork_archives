// ==UserScript==
// @name         Niro's GS Speedrun Timer
// @namespace    http://tampermonkey.net/
// @version      1.3.2.1
// @description  Adds a MM:SS:ms timer to the top right of the screen with start, stop, reset controls, gold and WR splits!
// @author       Niro ("nirokr" on Discord or @NiroGS on YouTube)
// @match        https://nirogs.github.io/GetawayShootout/*
// @match        https://htmlxm.github.io/h4/getaway-shootout/*
// @match        https://ubg44.github.io/GetawayShootout/*
// @match        https://watchdocumentaries.com/getaway-shootout-game/*
// @match        https://ducklife4.github.io/play/getaway-shootout.html
// @match        https://sites.google.com/site/thegamecompilation/getaway-shootout*
// @match        https://play.unity.com/en/games/f5c4d162-bae9-48ee-8238-1b7f039503ed/getaway-shootout*
// @match        https://www.twoplayergames.org/game/getaway-shootout*
// @match        https://tbg95.github.io/getaway-shootout/*
// @match        https://pizzaedition.one/g/getawayshootout/*
// @match        https://sites.google.com/view/iogames/getaway-shootout-io*
// @match        https://lablockedgames.com/getaway-shootout*
// @match        https://www.sites.google.com/site/unblockedgamestop/getaway-shootout*
// @match        https://coolunblockedgame.com/game/getaway-shootout/*
// @match        https://getawayshootout.io/*
// @match        https://eggy-car.github.io/detail/getaway-shootout.html
// @match        https://nirogs.github.io/NewGetawayShootout/*
// @match        https://narrow-one.github.io/n6/rooftop-snipers-2/*
// @match        https://sirtificatetech.github.io/GetawayShootout/


// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528371/Niro%27s%20GS%20Speedrun%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/528371/Niro%27s%20GS%20Speedrun%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let getawayStages = [];
    let numGetaways = parseInt(prompt("How many getaways? (3, 4, or 5)", "3"));

    function setStages(n) {
        if (n === 3) return ["Market", "Bus", "Train"];
        if (n === 4) return ["Plane", "Market", "Bus", "Train"];
        if (n === 5) return ["Train", "Office", "Market", "Bus", "Train"];
        numGetaways = 3;
        return ["Market", "Bus", "Train"];
    }

    getawayStages = setStages(numGetaways);

    const goldTimes = {
        3: [11600, 28266, 40300],
        4: [12666, 31000, 53400, 68300],
        5: [5237, 46766, 65633, 87900, 99266]
    };

    let timerDiv = document.createElement('div');
    Object.assign(timerDiv.style, {
        position: 'fixed', top: '15%', right: '10px',
        background: 'rgba(0,0,0,1)', color: 'white',
        padding: '5px 10px', fontSize: '18px',
        fontFamily: 'monospace', borderRadius: '0px',
        zIndex: '2'
    });
    timerDiv.innerText = '00:00.00';
    document.body.appendChild(timerDiv);

    let splitsDiv = document.createElement('div');
    Object.assign(splitsDiv.style, {
        position: 'fixed', top: 'calc(15% + 30px)', right: '10px',
        background: 'rgba(0,0,0,1)', color: 'white',
        padding: '5px 10px', fontSize: '14px',
        fontFamily: 'monospace', borderRadius: '0px',
        zIndex: '2', textAlign: 'right'
    });
    document.body.appendChild(splitsDiv);

    let splitElements = [];
    function createSplitElements() {
        splitsDiv.innerHTML = '';
        splitElements = getawayStages.map((name, i) => {
            const el = document.createElement('div');
            el.textContent = `${name}: --:--:--`;
            el.style.color = 'white';
            splitsDiv.appendChild(el);
            return el;
        });
    }

    let startTime = 0, elapsedTime = 0, running = false, finished = false;
    let animationFrame, lastUpdate = 0;
    let splits = Array(getawayStages.length).fill("--:--:--");

    function updateTimer(timestamp) {
        if (timestamp - lastUpdate >= 50) {
            const now = timestamp - startTime + elapsedTime;
            const m = Math.floor(now / 60000).toString().padStart(2, '0');
            const s = Math.floor((now % 60000) / 1000).toString().padStart(2, '0');
            const ms = Math.floor((now % 1000) / 10).toString().padStart(2, '0');
            timerDiv.innerText = `${m}:${s}.${ms}`;
            lastUpdate = timestamp;
        }
        if (running) animationFrame = requestAnimationFrame(updateTimer);
    }

    function updateSplits() {
        splits.forEach((split, idx) => {
            const el = splitElements[idx];
            const name = getawayStages[idx] || `Split ${idx + 1}`;
            el.textContent = `${name}: ${split}`;
            el.style.color = 'white';
            if (!split.includes('-')) {
                const [mm, ss, mss] = split.split(':').map(Number);
                const timeMs = mm * 60000 + ss * 1000 + mss * 10;
                const gold = goldTimes[numGetaways]?.[idx];
                if (gold !== undefined && timeMs < gold) el.style.color = 'gold';
            }
        });
    }

    createSplitElements();
    updateSplits();

    document.addEventListener('keydown', (e) => {
        if (e.key === '1' && !e.repeat && !finished) {
            if (!running) {
                startTime = performance.now();
                lastUpdate = 0;
                running = true;
                updateTimer(performance.now());
                return;
            }
            const now = performance.now() - startTime + elapsedTime;
            const m = Math.floor(now / 60000).toString().padStart(2, '0');
            const s = Math.floor((now % 60000) / 1000).toString().padStart(2, '0');
            const ms = Math.floor((now % 1000) / 10).toString().padStart(2, '0');

            const idx = splits.findIndex(t => t === "--:--:--");
            if (idx !== -1 && running) {
                splits[idx] = `${m}:${s}:${ms}`;
                updateSplits();
                if (idx === splits.length - 1) {
                    elapsedTime += performance.now() - startTime;
                    running = false; finished = true;
                    cancelAnimationFrame(animationFrame);
                    const final = elapsedTime + 2500;
                    const fm = Math.floor(final / 60000).toString().padStart(2, '0');
                    const fs = Math.floor((final % 60000) / 1000).toString().padStart(2, '0');
                    const fms = Math.floor((final % 1000) / 10).toString().padStart(2, '0');
                    timerDiv.innerText = `${fm}:${fs}.${fms}`;
                }
            }
        } else if (e.key === '2' && running) {
            elapsedTime += performance.now() - startTime;
            running = false;
            cancelAnimationFrame(animationFrame);
        } else if (e.key === '0') {
            running = false; finished = false; elapsedTime = 0;
            splits = Array(getawayStages.length).fill("--:--:--");
            timerDiv.innerText = '00:00.00';
            updateSplits();
            cancelAnimationFrame(animationFrame);
        } else if (e.key.toLowerCase() === 'g') {
            const newCount = parseInt(prompt("Change to how many getaways? (3, 4, or 5)", numGetaways));
            if ([3, 4, 5].includes(newCount)) {
                numGetaways = newCount;
            } else {
                numGetaways = 3;
            }
            getawayStages = setStages(numGetaways);
            splits = Array(getawayStages.length).fill("--:--:--");
            elapsedTime = 0;
            running = false;
            finished = false;
            timerDiv.innerText = '00:00.00';
            createSplitElements();
            updateSplits();
            cancelAnimationFrame(animationFrame);
        }
    });

    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your timer progress will be lost.';
    });
})();
