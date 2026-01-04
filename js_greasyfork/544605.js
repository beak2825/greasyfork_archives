// ==UserScript==
// @name         Torn City Flight Timer (PDA Compatible)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  xx
// @author       aquagloop 
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544605/Torn%20City%20Flight%20Timer%20%28PDA%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544605/Torn%20City%20Flight%20Timer%20%28PDA%20Compatible%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let initialTop = GM_getValue('widgetTop', '20px');
    let initialLeft = GM_getValue('widgetLeft', '20px');

    const widgetStyle = `
        #flight-timer-widget {
            position: fixed;
            top: ${initialTop};
            left: ${initialLeft};
            background-color: rgba(15, 15, 15, 0.9);
            border: 1px solid #333;
            border-radius: 8px;
            padding: 10px 15px;
            font-family: 'Signika', sans-serif;
            font-size: 14px;
            color: #ccc;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            display: none;
            text-align: center;
            cursor: move;
            white-space: nowrap;
            min-width: 150px;
            user-select: none;
            -webkit-user-select: none;
        }
        #flight-timer-widget .destination {
            font-size: 16px;
            font-weight: bold;
            color: #4CAF50;
        }
        #flight-timer-widget .time-left {
            font-size: 20px;
            font-weight: bold;
            color: #fff;
            margin-top: 5px;
        }
    `;

    function getApiKey() {
        let storedApiKey = GM_getValue('tornApiKey', null);
        if (!storedApiKey || storedApiKey.length < 16) {
            storedApiKey = prompt('Please enter your Torn API Key (Public access level only).\nIt will be stored locally and securely.');
            if (storedApiKey && storedApiKey.length >= 16) {
                GM_setValue('tornApiKey', storedApiKey);
            } else {
                alert('Invalid API Key. The script will not run. Please refresh the page to try again.');
                return null;
            }
        }
        return storedApiKey;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("Torn Flight Timer: No valid API key provided. Script halted.");
        return;
    }

    GM_addStyle(widgetStyle);
    const widget = document.createElement('div');
    widget.id = 'flight-timer-widget';
    document.body.appendChild(widget);

    function dragElement(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const getCoords = (e) => {
            if (e.type.includes('touch')) {
                return e.touches[0];
            }
            return e;
        };

        const dragStart = (e) => {
            e.preventDefault();
            const coords = getCoords(e);
            pos3 = coords.clientX;
            pos4 = coords.clientY;
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('mousemove', dragMove);
            document.addEventListener('touchmove', dragMove, { passive: false });
        };

        const dragMove = (e) => {
            e.preventDefault();
            const coords = getCoords(e);
            pos1 = pos3 - coords.clientX;
            pos2 = pos4 - coords.clientY;
            pos3 = coords.clientX;
            pos4 = coords.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        };

        const dragEnd = () => {
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchmove', dragMove);
            GM_setValue('widgetTop', elmnt.style.top);
            GM_setValue('widgetLeft', elmnt.style.left);
        };

        elmnt.addEventListener('mousedown', dragStart);
        elmnt.addEventListener('touchstart', dragStart, { passive: false });
    }

    dragElement(widget);

    let countdownInterval = null;
    let syncedRemainingSeconds = 0;
    let localTimeOfSync = 0;

    function formatTime(seconds) {
        if (seconds < 0) seconds = 0;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h.toString().padStart(2, '0'), m.toString().padStart(2, '0'), s.toString().padStart(2, '0')].join(':');
    }

    function updateTimer() {
        const elapsedSeconds = Math.floor((Date.now() - localTimeOfSync) / 1000);
        const currentRemaining = syncedRemainingSeconds - elapsedSeconds;

        if (currentRemaining > 0) {
            widget.querySelector('.time-left').textContent = formatTime(currentRemaining);
        } else {
            if (countdownInterval) clearInterval(countdownInterval);
            countdownInterval = null;
            setTimeout(checkTravelStatus, 1500);
        }
    }

    function checkTravelStatus() {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=travel,timestamp&key=${apiKey}`,
            onload: function(response) {
                if (response.status !== 200) return;
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        console.error(`Torn API Error: ${data.error.error}`);
                        return;
                    }

                    const travel = data.travel;
                    const serverTime = data.timestamp;

                    if (countdownInterval) clearInterval(countdownInterval);

                    if (travel && travel.time_left > 0) {
                        syncedRemainingSeconds = travel.timestamp - serverTime;
                        localTimeOfSync = Date.now();

                        widget.innerHTML = `
                            <div>Traveling to</div>
                            <div class="destination">${travel.destination}</div>
                            <div class="time-left">Loading...</div>
                        `;
                        widget.style.display = 'block';
                        updateTimer();
                        countdownInterval = setInterval(updateTimer, 1000);
                    }
                    else if (travel && travel.timestamp > 0 && travel.time_left === 0) {
                        const lastLandedTimestamp = GM_getValue('lastLandedTimestamp', 0);

                        if (travel.timestamp > lastLandedTimestamp) {
                            widget.innerHTML = `
                                <div class="destination">Landed!</div>
                                <div style="color: #fff;">Arrived at ${travel.destination}</div>
                            `;
                            widget.style.display = 'block';
                            setTimeout(() => { widget.style.display = 'none'; }, 5000);
                            GM_setValue('lastLandedTimestamp', travel.timestamp);
                        } else {
                            widget.style.display = 'none';
                        }
                    }
                    else {
                        widget.style.display = 'none';
                    }
                } catch (e) {
                    console.error("Error parsing Torn API response:", e);
                }
            }
        });
    }

    checkTravelStatus();
})();