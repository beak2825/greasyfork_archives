
// ==UserScript==
// @name         refrech Timer Control with infovissa
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Add a continuous timer control panel with social media links and auto-refresh
// @author       You
// @match         hana ta9dar tzid rwabit dtyal page ali bariti msah had katba kamla
// @match         hana ta9dar tzid rwabit dtyal page ali bariti msah had katba kamla
// @match         hana ta9dar tzid rwabit dtyal page ali bariti msah had katba kamla
// @match         hana ta9dar tzid rwabit dtyal page ali bariti msah had katba kamla
// @match         hana ta9dar tzid rwabit dtyal page ali bariti msah had katba kamla
// @match       https://fr.tlscontact.com/visa/ma*
// @match        https://fr.tlscontact.com/visa/ma
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534420/refrech%20Timer%20Control%20with%20infovissa.user.js
// @updateURL https://update.greasyfork.org/scripts/534420/refrech%20Timer%20Control%20with%20infovissa.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = `
        #controlPanel {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 1px solid #000;
            padding: 10px;
            z-index: 9999;
            font-size: 12px; /* Small text size */
        }
        #controlPanel button {
            display: block;
            margin: 5px;
            padding: 10px;
            border: none;
            color: white;
            cursor: pointer;
        }
        #controlPanel #startButton {
            background: green;
        }
        #controlPanel #stopButton {
            background: red;
        }
        #controlPanel #setRateButton {
            background: blue;
        }
        #controlPanel #timer {
            display: block;
            margin-top: 10px;
        }
        #controlPanel #rateInput {
            margin-top: 10px;
            width: 60px;
        }
        #controlPanel .social-button {
            display: inline-block;
            margin-top: 10px;
            cursor: pointer;
            width: 24px;  /* Smaller image width */
            height: 24px; /* Smaller image height */
            vertical-align: middle;
        }
        #controlPanel .social-button img {
            width: 100%;
            height: 100%;
            object-fit: contain; /* Ensures images fit within their containers */
        }
        #controlPanel .social-label {
            font-size: 10px; /* Small text for labels */
            margin-left: 5px;
            vertical-align: middle;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);
    const controlPanel = document.createElement('div');
    controlPanel.id = 'controlPanel';
    controlPanel.innerHTML = `
        <button id="startButton">Start Refresh</button>
        <button id="stopButton">Stop Refresh</button>
        <input id="rateInput" type="number" value="10" min="1" step="1" /> seconds
        <button id="setRateButton">Set Refresh Rate</button>
        <div id="timer">Auto-refresh stopped.</div>
        <div>
            <a class="social-button" href="https://t.me/infovissa" target="_blank">
                <img src="https://img.icons8.com/color/48/telegram-app.png" alt="Telegram">
            </a>
            <span class="social-label">Telegram</span>
        </div>
        <div>
            <a class="social-button" href="https://www.instagram.com/infovisaa?igsh=MWcyOXc0amt4M3VvbA==" target="_blank">
                <img src="https://img.icons8.com/color/48/instagram-new.png" alt="Instagram">
            </a>
            <span class="social-label">Instagram</span>
        </div>
        <div>
            <a class="social-button" href="https://www.youtube.com/" target="_blank">
                <img src="https://img.icons8.com/color/48/youtube-play.png" alt="YouTube">
            </a>
            <span class="social-label">YouTube</span>
        </div>
    `;
    document.body.appendChild(controlPanel);
    let refreshTimeout;
    let refreshRate = parseInt(localStorage.getItem('refreshRate')) || 10000;
    let isRefreshing = localStorage.getItem('isRefreshing') === 'true';
    let timeRemaining = parseInt(localStorage.getItem('timeRemaining')) || refreshRate;
    function updateTimer() {
        const seconds = Math.ceil(timeRemaining / 1000);
        document.getElementById('timer').innerText = `Next refresh in ${seconds} seconds.`;
    }

    function scheduleRefresh() {
        refreshTimeout = setInterval(() => {
            timeRemaining -= 1000;
            updateTimer();

            if (timeRemaining <= 0) {
                localStorage.setItem('timeRemaining', refreshRate);
                location.reload();
            }
            localStorage.setItem('timeRemaining', timeRemaining);

        }, 1000);
    }
    function startRefreshing() {
        if (!isRefreshing) {
            isRefreshing = true;
            localStorage.setItem('isRefreshing', 'true');
            localStorage.setItem('timeRemaining', refreshRate);
            scheduleRefresh();
        }
    }

    function stopRefreshing() {
        if (isRefreshing) {
            isRefreshing = false;
            clearInterval(refreshTimeout);
            localStorage.setItem('isRefreshing', 'false');
            document.getElementById('timer').innerText = 'Auto-refresh stopped.';
        }
    }

    function setRefreshRate() {
        const rate = parseInt(document.getElementById('rateInput').value, 10);
        if (!isNaN(rate) && rate > 0) {
            refreshRate = rate * 1000;
            localStorage.setItem('refreshRate', refreshRate);
            timeRemaining = refreshRate;
            if (isRefreshing) {
                clearInterval(refreshTimeout);
                scheduleRefresh();
            }
        }
    }
    document.getElementById('startButton').addEventListener('click', startRefreshing);
    document.getElementById('stopButton').addEventListener('click', stopRefreshing);
    document.getElementById('setRateButton').addEventListener('click', setRefreshRate);

    if (isRefreshing) {
        scheduleRefresh();
    }

    updateTimer();

})();
refrechtlscontact (2).txt
