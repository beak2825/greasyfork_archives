// ==UserScript==
// @name         图寻题库计时器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  题库记录每个轮次用时以及总用时
// @author       lemures
// @match        https://tuxun.fun/challenge/*
// @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485300/%E5%9B%BE%E5%AF%BB%E9%A2%98%E5%BA%93%E8%AE%A1%E6%97%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485300/%E5%9B%BE%E5%AF%BB%E9%A2%98%E5%BA%93%E8%AE%A1%E6%97%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeExistingTimer() {
        const existingTimer = document.querySelector('.lemurestimer');
        if (existingTimer) {
            existingTimer.remove();
        }
    }
    // 主要逻辑封装在这个函数中
    function initializeTimer() {
        removeExistingTimer();
        document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            //event.preventDefault();
            const roundButton = document.querySelector('.ant-btn-round');
            if (roundButton) {
                roundButton.click();
            }
        }
    });


    function getChallengeIdFromUrl() {
        const urlParts = window.location.pathname.split('/');
        return urlParts[urlParts.length - 1];
    }

    function getLocalStorageKey(challengeId, round) {
        return `lemures-timer-${challengeId}-${round}`;
    }

    function saveStartTime(challengeId, round, startTime) {
        localStorage.setItem(getLocalStorageKey(challengeId, round), startTime);
    }

    function getSavedStartTime(challengeId, round) {
        return localStorage.getItem(getLocalStorageKey(challengeId, round));
    }

    const challengeId = getChallengeIdFromUrl();
    const apiUrl = `https://tuxun.fun/api/v0/tuxun/challenge/getGameInfo?challengeId=${challengeId}`;

    async function fetchGameData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

     function waitForElement(selector, callback) {
        const observer = new MutationObserver(mutations => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    function createStyledElement(gameRound, roundTimes, totalElapsedTime, currentRoundStartTime) {
    const newElement = document.createElement('div');
    newElement.className = 'lemurestimer';
    newElement.style.cssText = `
        --online-width: 3rem;
        position: absolute;
        right: 1rem;
        z-index: 1;
        margin-top: 1rem;
        background-color: #ff9427;
        border-radius: 35px;
        filter: drop-shadow(0 .3rem .3rem rgba(0,0,0,.4));
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        padding: .5rem 2rem;
        min-width: 110px;
        display: flex;
        gap: 1rem;
    `;

    let roundsHtml = '';
    for (let i = 1; i <= gameRound.totalRounds; i++) {
        if (i === gameRound.currentRound && !(i in roundTimes)) {
            roundsHtml += `<span id="current-round-${i}">Round ${i}: ---</span><br>`;
        } else {
            roundsHtml += `Round ${i}: ${roundTimes[i] ? formatTime(roundTimes[i]) : '---'} <br>`;
        }
    }

    newElement.innerHTML = `${roundsHtml}Total: ${formatTime(totalElapsedTime)}`;

    if (gameRound.currentRound in roundTimes === false) {
        const timerElement = document.getElementById(`current-round-${gameRound.currentRound}`);

        setInterval(() => {
            const elapsed = Date.now() - currentRoundStartTime;
            timerElement.innerHTML = `Round ${gameRound.currentRound}: ${formatTime(elapsed)}`;
        }, 1000);
    }

    return newElement;
}

    function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
}

    function saveRoundTime(challengeId, round, timeElapsed) {
        const key = `lemures-round-time-${challengeId}-${round}`;
        localStorage.setItem(key, timeElapsed);
    }


function updateRoundTimeElement(gameRound, startTime) {
    const timerElement = document.getElementById(`current-round-${gameRound.currentRound}`);
    if (timerElement) {
        const elapsed = Date.now() - startTime;
        timerElement.innerText = `Round ${gameRound.currentRound}: ${formatTime(elapsed)}`;
    }
}

async function main(targetElement) {
    const gameData = await fetchGameData();
    if (gameData && gameData.success) {
        const gameRound = {
            currentRound: gameData.data.currentRound,
            totalRounds: gameData.data.roundNumber
        };
        let startTime = getSavedStartTime(challengeId, gameRound.currentRound);

        if (!startTime) {
            startTime = Date.now();
            saveStartTime(challengeId, gameRound.currentRound, startTime);
        } else {
            startTime = parseInt(startTime);
        }

        const roundTimes = {};
        let totalElapsedTime = 0;

        for (let i = 1; i <= gameRound.totalRounds; i++) {
            const savedTime = localStorage.getItem(`lemures-round-time-${challengeId}-${i}`);
            if (savedTime) {
                roundTimes[i] = parseInt(savedTime);
                totalElapsedTime += roundTimes[i];
            }
        }

        const newElement = createStyledElement(gameRound, roundTimes, totalElapsedTime, startTime);
        const rect = targetElement.getBoundingClientRect();
        newElement.style.top = `${rect.bottom + window.scrollY}px`;
        newElement.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(newElement);

        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('ant-btn-round')) {
                const endTime = Date.now();
                const timeElapsed = endTime - startTime;
                saveRoundTime(challengeId, gameRound.currentRound, timeElapsed);

                roundTimes[gameRound.currentRound] = timeElapsed;
                totalElapsedTime += timeElapsed;
                newElement.innerHTML = createStyledElement(gameRound, roundTimes, totalElapsedTime, startTime).innerHTML;
            }
        });

        if (!(gameRound.currentRound in roundTimes)) {
            setInterval(() => updateRoundTimeElement(gameRound, startTime), 1000);
        }
    }
}


    waitForElement('.roundWrapper___eTnOj', main);
    }

    // 监听空格键
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            initializeTimer();// 重新执行脚本的主要逻辑
        }
    });

    // 首次执行
    initializeTimer();
})();
