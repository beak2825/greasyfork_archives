// ==UserScript==
// @name         Vortex Forge Deadshot.io
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Vortex Forge Web Client with Scope Autoshoot,Sniper Mode,Player Rank Search & FPS Booster
// @author       NOOB
// @match        https://deadshot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518544/Vortex%20Forge%20Deadshotio.user.js
// @updateURL https://update.greasyfork.org/scripts/518544/Vortex%20Forge%20Deadshotio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let featuresEnabled = true;
    let sniperModeEnabled = false;
    let fireworkInterval = null;
    let kKeyInterval = null;
    let isRightMousePressed = false;
    let spacebarLockEnabled = false;
    let fpsDisplay = null;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;
    const fpsThreshold = 30;

    const newSettingsContent = `
    <div class="setting toggle" style="margin-top: 30px; padding: 9px 30px; background-color: rgba(255, 255, 255, 0.03);">
        <p style="font-size: 21px;">Search My Rank</p>
        <button id="searchRankButton" style="padding: 5px 10px; font-size: 16px; cursor: pointer;">Search</button>
    </div>
    <div class="setting toggle" style="padding: 9px 30px;">
        <p style="font-size: 21px;">Sniper Mode</p>
        <label>
            <input id="vfSniperMode" class="checkbox" type="checkbox">
            <span></span>
        </label>
    </div>
    <div class="setting toggle" style="padding: 9px 30px; background-color: rgba(255, 255, 255, 0.03);">
        <p style="font-size: 21px;">Vortex Forge Mode</p>
        <label>
            <input id="vfsettings" class="checkbox" type="checkbox" checked="">
            <span></span>
        </label>
    </div>
    `;

     function createSearchPopup() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.color = 'white';
        popup.style.zIndex = '10000';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter username';
        input.style.padding = '10px';
        input.style.fontSize = '16px';
        input.style.marginRight = '10px';

        const searchButton = document.createElement('button');
        searchButton.innerText = 'Search';
        searchButton.style.padding = '10px';
        searchButton.style.fontSize = '16px';
        searchButton.style.cursor = 'pointer';

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginLeft = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';

        closeButton.onclick = () => popup.remove();
        searchButton.onclick = async () => {
            const username = input.value.trim();
            if (username) {
                const rank = await fetchLeaderboardRank(username);
                showRankPopup(username, rank);
            }
        };

        popup.appendChild(input);
        popup.appendChild(searchButton);
        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    }

    async function fetchLeaderboardRank(username) {
    try {
        const response = await fetch('https://login.deadshot.io/leaderboards');
        const data = await response.json();

        const categories = ["daily", "weekly", "alltime"];

        for (const category of categories) {
            if (data[category] && data[category].kills) {
                const leaderboard = data[category].kills;

                leaderboard.sort((a, b) => b.kills - a.kills);

                const player = leaderboard.find(player => player.name === username);

                if (player) {
                    const rank = leaderboard.indexOf(player);
                    return `Rank: ${rank + 1} in ${category} leaderboard`;
                }
            }
        }

        return 'Not found in any leaderboard';
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return 'Error';
    }
}


    function showRankPopup(username, rank) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popup.style.padding = '20px';
        popup.style.borderRadius = '10px';
        popup.style.color = 'white';
        popup.style.zIndex = '10000';
        popup.innerText = rank === 'Not found' ? `User ${username} not found in the leaderboard.` : `User ${username} is ranked #${rank}`;

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => popup.remove();

        popup.appendChild(closeButton);
        document.body.appendChild(popup);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const searchButton = document.getElementById('searchRankButton');
        if (searchButton) {
            searchButton.addEventListener('click', createSearchPopup);
        }
    });

    //Make space by removing left handed mode(rubbish)
    function removeLeftHandedSetting() {
        const leftHandedDiv = document.querySelector('.setting.toggle input#lefthand')?.closest('.setting.toggle');
        if (leftHandedDiv) {
            leftHandedDiv.remove();
            console.log("Left-Handed setting removed.");
        }
    }
     function removeADSToggle() {
        const leftHandedDiv = document.querySelector('.setting.toggle input#toggleads')?.closest('.setting.toggle');
        if (leftHandedDiv) {
            leftHandedDiv.remove();
            console.log("Toggle ADS removed.");
        }
    }

   function addCustomSettingsToTop() {
    const settingsDiv = document.getElementById('settingsDiv');
    if (settingsDiv && !document.getElementById('vfSniperMode')) {
        const customDiv = document.createElement('div');
        customDiv.innerHTML = newSettingsContent;
        settingsDiv.insertBefore(customDiv, settingsDiv.firstChild);

        const searchButton = document.getElementById('searchRankButton');
        if (searchButton) {
            searchButton.addEventListener('click', createSearchPopup);
        }
    }
}


    function waitForSettingsDiv() {
        const retryInterval = setInterval(() => {
            const settingsDiv = document.getElementById('settingsDiv');
            if (settingsDiv) {
                removeLeftHandedSetting();
                removeADSToggle();
                addCustomSettingsToTop();
                setupSniperModeToggle();
                setupVortexForgeModeToggle();
                clearInterval(retryInterval);
            }
        }, 500);
    }

    function setupSniperModeToggle() {
        const sniperModeCheckbox = document.getElementById('vfSniperMode');
        if (sniperModeCheckbox) {
            sniperModeCheckbox.addEventListener('change', (event) => {
                sniperModeEnabled = event.target.checked;
            });
        }
    }

    function setupVortexForgeModeToggle() {
        const vfCheckbox = document.getElementById('vfsettings');
        if (vfCheckbox) {
            vfCheckbox.addEventListener('change', (event) => {
                featuresEnabled = event.target.checked;
                toggleFeatures(featuresEnabled);
            });
        }
    }

    function toggleFeatures(enabled) {
        if (!enabled) {
            stopKKeyPress();
            isRightMousePressed = false;
        }
    }

    function startKKeyPress() {
        if (!kKeyInterval) {
            kKeyInterval = setInterval(() => {
                const kKeyEvent = new KeyboardEvent('keydown', {
                    key: 'K',
                    code: 'KeyK',
                    keyCode: 75,
                    which: 75,
                    bubbles: true,
                    cancelable: true,
                });
                document.dispatchEvent(kKeyEvent);
            }, 100);
        }
    }

     function stopKKeyPress() {
        if (kKeyInterval) {
            clearInterval(kKeyInterval);
            kKeyInterval = null;

            const kKeyUpEvent = new KeyboardEvent('keyup', {
                key: 'K',
                code: 'KeyK',
                keyCode: 75,
                which: 75,
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent(kKeyUpEvent);
        }
    }

    function startShooting() {
        const shootKeyEvent = new KeyboardEvent('keydown', {
            key: 'K',
            code: 'KeyK',
            keyCode: 75,
            which: 75,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(shootKeyEvent);

        const shootKeyUpEvent = new KeyboardEvent('keyup', {
            key: 'K',
            code: 'KeyK',
            keyCode: 75,
            which: 75,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(shootKeyUpEvent);
    }

    document.addEventListener('mousedown', (e) => {
        if (!featuresEnabled) return;

        if (e.button === 2) {
            if (!isRightMousePressed) {
                isRightMousePressed = true;

                if (!sniperModeEnabled) {
                    startKKeyPress();
                }
            }
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 2) {
            if (sniperModeEnabled) {
                startShooting();
            }else{
                stopKKeyPress();
            }

            isRightMousePressed = false;
        }
    });

    //Fps settings
    function createFPSDisplay() {
        fpsDisplay = document.createElement('div');
        fpsDisplay.style.position = 'fixed';
        fpsDisplay.style.bottom = '10px';
        fpsDisplay.style.right = '10px';
        fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        fpsDisplay.style.padding = '10px';
        fpsDisplay.style.borderRadius = '5px';
        fpsDisplay.style.color = 'white';
        fpsDisplay.style.fontSize = '14px';
        fpsDisplay.style.zIndex = '10000';
        document.body.appendChild(fpsDisplay);
    }

    function updateFPS() {
        const now = performance.now();
        frameCount++;

        if (now - lastFrameTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFrameTime = now;
            fpsDisplay.innerText = `FPS: ${fps}`;
            if (fps < fpsThreshold) {
                boostFPS();
            }
        }
        requestAnimationFrame(updateFPS);
    }

    function boostFPS() {
        document.querySelectorAll('canvas').forEach(canvas => {
            canvas.style.imageRendering = 'pixelated';
        });
        reduceGraphicsQuality();
    }

    function reduceGraphicsQuality() {
        const elementsToModify = [
            ...document.querySelectorAll('img, video, canvas')
        ];
        elementsToModify.forEach(el => {
            el.style.filter = 'brightness(0.9) contrast(0.9)';
        });
    }

    window.addEventListener('load', () => {
        waitForSettingsDiv();
        createFPSDisplay();
        updateFPS();
    });
})();
