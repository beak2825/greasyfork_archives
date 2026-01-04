// ==UserScript==
// @name         Lichess Time Glow Alert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights the board when time is low in Lichess
// @match        *://lichess.org/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501408/Lichess%20Time%20Glow%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/501408/Lichess%20Time%20Glow%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let glowAdded = false;

    const addGlowEffect = () => {
        const board = document.querySelector('.cg-wrap');
        if (!board) return;

        board.style.border = `1px solid red`;
        board.style.borderRadius = '5px';
        board.style.boxShadow = '0 0 40px red'; // Increased glow size
    };

    const removeGlowEffect = () => {
        const board = document.querySelector('.cg-wrap');
        if (!board) return;

        board.style.border = '';
        board.style.borderRadius = '';
        board.style.boxShadow = '';
    };

    const getUserColor = () => {
        const userTag = document.getElementById('user_tag');
        if (!userTag) return;

        const userName = userTag.innerText.trim();
        let userColor;

        const playerContainers = document.querySelectorAll('.game__meta__players .player');
        playerContainers.forEach(player => {
            const anchor = player.querySelector('a');
            if (anchor && anchor.href.includes(userName)) {
                userColor = player.classList.contains('black') ? 'black' : 'white';
            }
        });

        return userColor;
    };

    const checkTime = (userColor, lowTime) => {
        const clockClass = `.rclock-${userColor}.running .time`;
        const timeElement = document.querySelector(clockClass);
        if (!timeElement) return;

        let timeText = '';
        timeElement.childNodes.forEach(node => {
            timeText += node.nodeType === 3 ? node.textContent : node.innerText;
        });

        let totalSeconds;
        if (timeText.includes(':')) {
            const [minutes, seconds] = timeText.split(':').map(Number);
            totalSeconds = minutes * 60 + seconds;
        } else if (timeText.includes('.')) {
            const [seconds] = timeText.split('.').map(Number);
            totalSeconds = seconds;
        } else {
            totalSeconds = Number(timeText);
        }

        if (totalSeconds <= lowTime) {
            if (!glowAdded) {
                addGlowEffect();
                glowAdded = true;
            }
        } else {
            if (glowAdded) {
                removeGlowEffect();
                glowAdded = false;
            }
        }
    };

    const monitorTime = () => {
        const lowTime = 10; // Set low time threshold
        const userColor = getUserColor();
        if (!userColor) return;

        setInterval(() => {
            checkTime(userColor, lowTime);
        }, 1000);
    };

    const monitorNewGame = () => {
        let currentUrl = window.location.href;
        setInterval(() => {
            if (currentUrl !== window.location.href) {
                currentUrl = window.location.href;
                removeGlowEffect(); // Reset glow effect on new game
            }
        }, 1000);
    };

    monitorTime();
    monitorNewGame();
})();