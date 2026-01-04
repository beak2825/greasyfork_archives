// ==UserScript==
// @name         Auto Blum natural
// @namespace    http://violentmonkey.net/
// @version      3
// @description  click like a real person
// @author       nothing here
// @match        https://telegram.blum.codes/*
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508405/Auto%20Blum%20natural.user.js
// @updateURL https://update.greasyfork.org/scripts/508405/Auto%20Blum%20natural.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    const minBombClickCount = 0; // number of bombs will click
    const minFreezeClickCount = 2; // The tape number will click
    const cloverSkipPercentage = 10; // clover click abandonment rate (%)
 
    const consoleRed = 'font-weight: bold; color: red;';
    const consoleGreen = 'font-weight: bold; color: green;';
    const consolePrefix = '%c [AutoBot] ';
    const originalConsoleLog = console.log;
 
    console.log = function () {
        if (arguments[0].includes('[AutoBot]') || arguments[0].includes('github.com')) {
            originalConsoleLog.apply(console, arguments);
        }
    };
 
    console.error = console.warn = console.info = console.debug = function () { };
 
    console.clear();
    console.log(`${consolePrefix}Start bots...`, consoleGreen);
 
    let totalPoints = 0;
    let bombClickCount = 0;
    let freezeClickCount = 0;
    let skippedClovers = 0;
    let gameEnded = false;
    let checkGameEndInterval;
 
    // Function to get random delay
    function getRandomDelay(min, max) {
        return Math.random() * (max - min) + min;
    }
 
    // Function to click at a random position within an element
    function clickRandomPosition(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;

        const clickEvent = new MouseEvent('click', {
            clientX: x,
            clientY: y
        });

        element.dispatchEvent(clickEvent);
    }
 
    // Function to simulate human-like click with movement
    function simulateHumanClick(element) {
        const delayBeforeClick = getRandomDelay(500, 2000); // Delay acak sebelum klik
        setTimeout(() => {
            // Simulate mouse movement if necessary (optional)
            clickRandomPosition(element); // Klik pada posisi acak
        }, delayBeforeClick);
    }
 
    // Function to check and click the Play button
    function checkAndClickPlayButton() {
        const playButton = document.querySelector('a.play-btn');
        
        if (playButton && playButton.offsetParent !== null) {
            const rect = playButton.getBoundingClientRect();
            if (rect.top >= 0 && rect.left >= 0) {
                simulateHumanClick(playButton);
                console.log('Tombol Play diklik.');
            } else {
                console.log('Tombol Play tidak berada dalam viewport.');
            }
        } else {
            console.log('Tombol Play tidak ditemukan.');
        }
    }
 
    // Function to continuously check the Play button
    function continuousPlayButtonCheck() {
        console.log('Memeriksa tombol Play...');
        checkAndClickPlayButton();
        setTimeout(continuousPlayButtonCheck, 1000); // Memanggil kembali setiap detik
    }
 
    continuousPlayButtonCheck(); // Start continuous check
 
    const originalPush = Array.prototype.push;
    Array.prototype.push = function(...args) {
        args.forEach(arg => {
            if (arg && arg.item) {
                if (arg.item.type === "CLOVER" || arg.item.type === "FREEZE") {
                    const randomDelay = getRandomDelay(1000, 5000); // Delay antara 1 hingga 5 detik
                    setTimeout(() => {
                        if (arg && arg.item) { // Memastikan arg masih valid
                            if (arg.item.type === "CLOVER") {
                                arg.shouldSkip = Math.random() < (cloverSkipPercentage / 100);
                                if (arg.shouldSkip) {
                                    skippedClovers++;
                                    console.log(`${consolePrefix}Skip the three-leaf clover (${skippedClovers})`, consoleRed);
                                } else {
                                    console.log(`${consolePrefix}Click on the three-leaf clover (${totalPoints})`, consoleGreen);
                                    totalPoints++;
                                    simulateHumanClick(arg.item.element); // Klik dengan perilaku manusia
                                    arg.isExplosion = true;
                                    arg.addedAt = performance.now();
                                }
                            } else if (arg.item.type === "FREEZE" && freezeClickCount < minFreezeClickCount) {
                                console.log(`${consolePrefix}Click freeze`, consoleGreen);
                                simulateHumanClick(arg.item.element); // Klik dengan perilaku manusia
                                arg.isExplosion = true;
                                arg.addedAt = performance.now();
                                freezeClickCount++;
                            }
                        }
                    }, randomDelay); // Menunggu selama waktu acak sebelum melakukan klik
                } else if (arg.item.type === "BOMB" && bombClickCount < minBombClickCount) {
                    console.log(`${consolePrefix}Click on bomb`, consoleRed);
                    totalPoints = 0;
                    simulateHumanClick(arg.item.element); // Klik dengan perilaku manusia
                    arg.isExplosion = true;
                    arg.addedAt = performance.now();
                    bombClickCount++;
                }
            }
        });
        return originalPush.apply(this, args);
    };
 
    function checkGameEnd() {
        const rewardElement = document.querySelector('div.reward .animated-points.visible');
        if (rewardElement && !gameEnded) {
            gameEnded = true;
            const rewardAmount = rewardElement.querySelector('.amount').textContent;
            console.log(`${consolePrefix}Game over. Total points earned: ${rewardAmount}`, consoleGreen);
            totalPoints = 0;
            bombClickCount = 0;
            freezeClickCount = 0;
            skippedClovers = 0;
 
            const playButton = document.querySelector('button.kit-button.is-large.is-primary');
            if (playButton) {
                const playPassesText = playButton.querySelector('.label span').textContent;
                const playPasses = parseInt(playPassesText.match(/\d+/)[0], 10);
 
                if (playPasses > 0) {
                    setTimeout(() => {
                        playButton.click();
                        console.log(`${consolePrefix}Start a new game...`, consoleGreen);
                        gameEnded = false;
                    }, getRandomDelay(3000, 5000)); // Delay acak antara 3 hingga 5 detik
                } else {
                    console.log(`${consolePrefix}Completed the game`, consoleRed);
                    clearInterval(checkGameEndInterval);
                }
            } else {
                console.log(`${consolePrefix}Play button not found`, consoleRed);
            }
        }
    }
 
    function startGameEndCheck() {
        if (checkGameEndInterval) {
            clearInterval(checkGameEndInterval);
        }
 
        checkGameEndInterval = setInterval(checkGameEnd, 1000);
 
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    checkGameEnd();
                }
            }
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
    }
 
    startGameEndCheck();
 
})();

