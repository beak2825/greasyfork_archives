// ==UserScript==
// @name         Facebook Access Controller
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enforces 30-minute cooldown between Facebook visits and limits each visit to 5 minutes
// @author       luudanmatcuoi
// @license      MIT
// @match        *://*.facebook.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/528338/Facebook%20Access%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/528338/Facebook%20Access%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const allow_duration = 5;
    const block_duration = 30;
    const snooze_duration = 2;


    // Get the last visit time from storage
    const lastVisit = GM_getValue('lastFacebookVisit', null);
    const lastAllow = GM_getValue('lastFacebookAllow', null);
    const snoozeTime = GM_getValue('snoozetime', null);
    const currentTime = new Date().getTime();

    // Nếu trước đó có lastVisit
    if (lastVisit) {
        var timeSinceLastVisit = (currentTime - parseInt(lastVisit)) / (1000 * 60); // in minutes
        var timeSinceLastAllow = (currentTime - parseInt(lastAllow)) / (1000 * 60); // in minutes
        var snoozeTimeAllow = (currentTime - parseInt(snoozeTime)) / (1000 * 60); // in minutes

        // Nếu đang trong khoảng allow --> Chạy tiếp
        if (timeSinceLastAllow < allow_duration ) {
            GM_setValue('stage_fb', true);
        // Nếu trong khoảng block nhưng trong khoảng snooze  --> Allow 2 mins
        } else if (timeSinceLastVisit < block_duration && snoozeTimeAllow < snooze_duration ) {
            GM_setValue('stage_fb', true);
            GM_setValue('stage_snooze', true);
        // Nếu trong khoảng block --> Block và return
        } else if (timeSinceLastVisit < block_duration ) {
            const minutesAgo = Math.floor(timeSinceLastVisit);
            const secondsAgo = Math.floor((timeSinceLastVisit - minutesAgo) * 60);
            const waitTime = Math.ceil(block_duration - timeSinceLastVisit);

            // Create HTML for the block page
            const blockHTML = `
            <html>
            <head>
                <title>Facebook Break Time</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding-top: 100px;
                        background-color: #f0f2f5;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #1877f2;
                    }
                    .timer {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .info {
                        margin-bottom: 20px;
                        color: #555;
                    }
                    .snooze-btn {
                        background-color: #008CBA; /* Blue */
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        font-size: 16px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 10px;
                        transition: background-color 0.3s;
                    }
                    .snooze-btn:hover {
                        background-color: #007bb5;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Facebook Break Time</h1>
                    <div class="info">
                        You visited Facebook ${minutesAgo} min ${secondsAgo} sec ago.<br>
                        Please take a break before returning.
                    </div>
                    <button class="snooze-btn" id="snoozeButton">Snooze for ${snooze_duration} Minutes</button>

                </div>

            </body>
            </html>
            `;
            document.open();
            document.write(blockHTML);
            document.close();

            // Add event listener AFTER the HTML is written to the document
            const snoozeButton = document.getElementById('snoozeButton');
            if (snoozeButton) {
                snoozeButton.addEventListener('click', () => {
                    const newAllowTime = new Date().getTime();
                    GM_setValue('snoozetime', newAllowTime.toString());
                    window.location.reload();
                });
            }
            return;

        // Nếu ngoài khoảng block --> Ghi lại lần chạy này và chạy tiếp
        } else {
            GM_setValue('stage_fb', false);
            GM_setValue('lastFacebookVisit', currentTime.toString());
            GM_setValue('lastFacebookAllow', currentTime.toString());
        }
    }
    else {
        GM_setValue('lastFacebookVisit', currentTime.toString());
        GM_setValue('lastFacebookAllow', currentTime.toString());
    }

    // Create container for the timer
    const timerContainer = document.createElement('div');
    timerContainer.style.position = 'fixed';
    timerContainer.style.bottom = '10px';
    timerContainer.style.left = '10px';
    timerContainer.style.backgroundColor = '#12224f';
    timerContainer.style.color = 'white';
    timerContainer.style.padding = '5px 5px';
    timerContainer.style.borderRadius = '5px';
    timerContainer.style.zIndex = '9999';
    timerContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    timerContainer.style.fontSize = '16px';
    timerContainer.style.fontWeight = 'bold';

    if (lastVisit) {
        const lastVisitDate = new Date(parseInt(lastVisit));
        const timeSinceLastVisit = Math.floor((currentTime - parseInt(lastVisit)) / (1000 * 60));
    } else {
        var aha = 3;
    }

    // Add notification and timer to page when body is available
    const addElementsToPage = () => {
        document.body.appendChild(timerContainer);
        // Start 5-minute countdown for this session
        let stage = GM_getValue('stage_fb', false);
        let stagesnooze = GM_getValue('stage_snooze', false);
        let secondsLeft = allow_duration * 60;
        if (stage===true && stagesnooze===true) {
            secondsLeft = snooze_duration * 60 - parseInt(snoozeTimeAllow * 60);
        } else if (stage===true) {
            secondsLeft = allow_duration * 60 - parseInt(timeSinceLastAllow * 60);
        }
        const updateTimer = () => {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;
            timerContainer.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (secondsLeft <= 0) {
                // Time's up, redirect to a "session ended" page
                const sessionEndedHTML = `
                <html>
                <head>
                    <title>Facebook Session Ended</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding-top: 100px;
                            background-color: #f0f2f5;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        h1 {
                            color: #1877f2;
                        }
                        .message {
                            margin: 20px 0;
                            font-size: 18px;
                        }
                        .info {
                            margin-bottom: 20px;
                            color: #555;
                        }
                        .snooze-btn {
                            background-color: #008CBA; /* Blue */
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            font-size: 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            margin: 10px;
                            transition: background-color 0.3s;
                        }
                        .snooze-btn:hover {
                            background-color: #007bb5;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Facebook Session Ended</h1>
                        <div class="message">
                            You've used your 5-minute Facebook allowance.
                        </div>
                        <div class="info">
                            You can return after a 10-minute break.
                        </div>
                        <button class="snooze-btn" id="snoozeButton">Snooze for ${snooze_duration} Minutes</button>
                    </div>
                </body>
                </html>
                `;

                document.open();
                document.write(sessionEndedHTML);
                document.close();

                // Add event listener AFTER the HTML is written to the document
                const snoozeButton = document.getElementById('snoozeButton');
                if (snoozeButton) {
                    snoozeButton.addEventListener('click', () => {
                        const newAllowTime = new Date().getTime();
                        GM_setValue('snoozetime', newAllowTime.toString());
                        window.location.reload();
                    });
                }

                return;
            }

            secondsLeft--;
            setTimeout(updateTimer, 1000);
        };

        updateTimer();

    };

    if (document.body) {
        addElementsToPage();
    } else {
        window.addEventListener('DOMContentLoaded', addElementsToPage);
    }
})();