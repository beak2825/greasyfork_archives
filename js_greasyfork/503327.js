// ==UserScript==
// @name         Shorts Reminder
// @namespace    https://fxzfun.com/userscripts
// @version      1.0.1
// @description  Get reminders to take a break from watching shorts (default every 15 minutes)
// @author       FXZFun
// @match        https://*.youtube.com/*
// @match        https://*.facebook.com/*
// @match        https://*.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503327/Shorts%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/503327/Shorts%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // SET THIS VARIABLE TO THE NUMBER OF MINUTES TO WATCH SHORTS FOR
    const TARGET_MINUTES = 15;
    let running = false;
    let overallMilliseconds;
    let startTime;
    let interval;

    const waitForShorts = setInterval(() => {
        if (location.href.includes('/reel') || location.href.includes('/shorts')) {
            if (!running) {
                run();
                running = true;
            }
        } else {
            overallMilliseconds += (new Date() - startTime);
            clearInterval(interval);
            running = false;
        }
    }, 1000);

    function run() {

        overallMilliseconds = 0;
        startTime = new Date();
        interval = setInterval(createOverlay, TARGET_MINUTES * 60 * 1000);

        document.addEventListener('visibilitychange', startStop);

        function startStop(isHidden) {
            if (isHidden) {
                overallMilliseconds += (new Date() - startTime);
                clearInterval(interval);
            } else {
                startTime = new Date();
                interval = setInterval(createOverlay, TARGET_MINUTES * 60 * 1000);
            }
        }

        function createOverlay() {
            const div = document.createElement('div');
            div.id = 'fxzfun-shortsReminderOverlay';
            div.style = `
                position: fixed;
                inset: 0;
                background: #0f0f0f;
                color: #fafafa;
                z-index: 99999999999999999;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                font-size: 500%;
            `;

            const btnHome = document.createElement('button');
            btnHome.style = `
                position: fixed;
                top: 0;
                left: 0;
                background: #272727;
                border: 0px;
                border-radius: 100vh;
                color: #f1f1f1;
                font-family: Roboto, Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                padding: 10px 20px;
                cursor: pointer;
                margin: 20px;
            `;
            btnHome.innerText = 'Go Home';
            btnHome.addEventListener('click', () => (location.href = '/'));

            const pTitle = document.createElement('p');
            pTitle.style = `font-size: 50px; margin: 0; line-height: normal;`;
            pTitle.innerText = `You've been watching ${location.href.includes('youtube') ? 'shorts' : 'reels'} for`;

            const h1Amount = document.createElement('h1');
            h1Amount.style = `font-size: 100px; margin: 0; color: #f1f1f1; line-height: normal;`;
            const time = parseInt((new Date() - startTime + overallMilliseconds) / 60 / 1000);
            h1Amount.innerText = `${time} minute${time === 1 ? '' : 's'}`;

            const pStop = document.createElement('p');
            pStop.style = `margin: 0;`;
            const btnStop = document.createElement('button');
            btnStop.style = `
                background: #1B5E20;
                border: 0px;
                border-radius: 100vh;
                color: #f1f1f1;
                font-family: Roboto, Arial, sans-serif;
                font-size: 24px;
                font-weight: bold;
                padding: 20px 40px;
                cursor: pointer;
                margin: 20px;
            `;
            btnStop.innerText = 'Do something else';
            btnStop.addEventListener('click', () => { location.href = thingsToOpen[Math.floor(Math.random() * thingsToOpen.length)] });
            pStop.appendChild(btnStop);

            const pContinue = document.createElement('p');
            pContinue.style = `margin: 0;`;
            const btnContinue = document.createElement('button');
            btnContinue.style = `
                background: #272727;
                border: 0px;
                border-radius: 100vh;
                color: #f1f1f1;
                font-family: Roboto, Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                padding: 10px 20px;
                cursor: pointer;
                margin: 20px;
            `;
            btnContinue.innerText = 'Continue Watching';
            btnContinue.addEventListener('click', () => {
                document.getElementById('fxzfun-shortsReminderOverlay')?.remove();
                document.querySelector('video').play();
                startStop(false);
            });
            pContinue.appendChild(btnContinue);

            div.appendChild(btnHome);
            div.appendChild(pTitle);
            div.appendChild(h1Amount);
            div.appendChild(pStop);
            div.appendChild(pContinue);

            document.getElementById('fxzfun-shortsReminderOverlay')?.remove();
            document.body.appendChild(div);
            document.querySelector('video').pause();
            startStop(true);
        }
    }

    const thingsToOpen = [
        'https://facebook.com',
        'https://youtube.com',
        "https://play2048.co/",
        "https://babelle.terrylaire.fr/",
        "https://bibli.petraguardsoftware.com/",
        "https://bibordle.web.app/",
        "https://canucklegame.github.io/canuckle/",
        "https://capitale.countryle.com/",
        "https://www.chordle.synthase.cc/",
        "https://citydle.com/",
        "https://www.countryle.com/",
        "https://www.washingtonpost.com/crossword-puzzles/daily/",
        "https://quizl.io/",
        "https://zaratustra.itch.io/dordle",
        "https://duotrigordle.com/",
        "https://www.sporcle.com/",
        "https://gameswordle.com/dogsdle/",
        "https://www.gamesforthebrain.com/",
        "https://globle-game.com/",
        "https://gramjam.app/",
        "https://gram-jam-english.vercel.app/",
        "https://statele.teuteuf.fr/",
        "https://gameswordle.com/jungdle/",
        "https://melodle.yesmeno.com/",
        "https://www.playlinkr.net/",
        "https://www.thenumble.app/",
        "https://morsle.fun/",
        "https://octordle.com/",
        "https://oec.world/en/tradle/",
        "https://solitaired.com/phrazle",
        "https://www.quordle.com/",
        "https://www.sedecordle.com/",
        "https://looserrip.github.io/shadle",
        "https://www.keybr.com/",
        "https://unlockle.app/",
        "https://versle.web.app/",
        "https://wafflegame.net/",
        "https://wafflegame.net/canuckle/index.html",
        "https://wheredle.xyz/",
        "https://www.nytimes.com/games/wordle/index.html",
        "https://gameswordle.com/wordlecat/",
        "https://worldle.teuteuf.fr/",
        "https://histordle.com/yeardle/",
        "https://wheretaken.teuteuf.fr/",
        "https://globle-capitals.com/",
        "https://wheretakenusa.teuteuf.fr/",
        "https://dubsterdev.web.app/wordmind/",
        "https://dubster.hazelhope.com/citylights/",
        "https://dubsterweb.web.app/games/biblequizl/",
        "https://dubsterdev.web.app/birdle/",
        "https://squaredle.app/",
        "https://dubster.hazelhope.com/biblehuntle/",
        "https://dubster.hazelhope.com/games/wordhuntle/",
        "https://dubster.hazelhope.com/games/mastermind/",
        "https://dubster.hazelhope.com/games/cities/",
        'https://maze.toys/',
        'https://sliding.toys/'
    ];
})();
