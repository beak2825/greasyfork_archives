// ==UserScript==
// @name         Persistent Floating Stopwatch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It adds a persistent stopwatch to any page that continues even if you reload the page
// @author       b4kt
// @match        *://*/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464007/Persistent%20Floating%20Stopwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/464007/Persistent%20Floating%20Stopwatch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the HTML and CSS to the page
    const stopwatchHTML = `
    <div id="stopwatch" style="
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        padding: 8px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 14px;
        text-align: center;
    ">
        <div id="stopwatch-time">00:00:00</div>
        <button id="stopwatch-start">Start</button>
        <button id="stopwatch-stop" style="display:none;">Stop</button>
        <button id="stopwatch-reset">Reset</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', stopwatchHTML);

    // Stopwatch functionality
    let startTime;
    let elapsedTime = localStorage.getItem('elapsedTime') ? parseInt(localStorage.getItem('elapsedTime')) : 0;
    let timerInterval;

    function updateTime() {
        elapsedTime = Date.now() - startTime;
        localStorage.setItem('elapsedTime', elapsedTime);
        const timeString = new Date(elapsedTime).toISOString().substr(11, 8);
        document.getElementById('stopwatch-time').textContent = timeString;
    }

    function startStopwatch() {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 100);
        document.getElementById('stopwatch-start').style.display = 'none';
        document.getElementById('stopwatch-stop').style.display = '';
        localStorage.setItem('stopwatchRunning', 'true');
    }

    function stopStopwatch() {
        clearInterval(timerInterval);
        document.getElementById('stopwatch-start').style.display = '';
        document.getElementById('stopwatch-stop').style.display = 'none';
        localStorage.setItem('stopwatchRunning', 'false');
    }

    function resetStopwatch() {
        clearInterval(timerInterval);
        elapsedTime = 0;
        localStorage.setItem('elapsedTime', elapsedTime);
        document.getElementById('stopwatch-time').textContent = '00:00:00';
        document.getElementById('stopwatch-start').style.display = '';
        document.getElementById('stopwatch-stop').style.display = 'none';
        localStorage.setItem('stopwatchRunning', 'false');
    }

    document.getElementById('stopwatch-start').addEventListener('click', startStopwatch);
    document.getElementById('stopwatch-stop').addEventListener('click', stopStopwatch);
    document.getElementById('stopwatch-reset').addEventListener('click', resetStopwatch);

    // Set the initial state of the stopwatch based on stored data
    if (elapsedTime > 0) {
        const timeString = new Date(elapsedTime).toISOString().substr(11, 8);
        document.getElementById('stopwatch-time').textContent = timeString;
    }

    if (localStorage.getItem('stopwatchRunning') === 'true') {
        startStopwatch();
    } else {
        stopStopwatch();
    }
})();
