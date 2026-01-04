// ==UserScript==
// @name         Casino
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extract UserID and control game actions via API.
// @author       You
// @match        https://swf.redrakegaming.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525942/Casino.user.js
// @updateURL https://update.greasyfork.org/scripts/525942/Casino.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userIdExtracted = false;
    let intervalId = null;
    let userId = null;

    // Function to extract UserID from JSON response
    function extractUserId(data) {
        if (data && !userIdExtracted) {
            if (data.response && data.response.uuid) {
                userId = data.response.uuid;
                console.log('Extracted UserID:', userId);
                userIdExtracted = true;
            } else {
                console.log('UserID not found in the response.');
            }
        }
    }

    // Hook into XMLHttpRequest to intercept responses
    const oldXHR = window.XMLHttpRequest;
    function newXHR() {
        const realXHR = new oldXHR();
        realXHR.addEventListener('readystatechange', function() {
            if (realXHR.readyState === 4 && realXHR.status === 200 && !userIdExtracted) {
                if (realXHR.responseURL.includes('html_api.php')) {
                    try {
                        const jsonResponse = JSON.parse(realXHR.responseText);
                        extractUserId(jsonResponse);
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                }
            }
        }, false);
        return realXHR;
    }
    window.XMLHttpRequest = newXHR;

    // Hook into fetch to intercept promises
    const oldFetch = window.fetch;
    window.fetch = function() {
        const fetchArgs = arguments;
        const responsePromise = oldFetch.apply(this, fetchArgs);
        responsePromise.then(response => {
            if (response.url.includes('html_api.php') && !userIdExtracted) {
                response.clone().json().then(jsonResponse => {
                    extractUserId(jsonResponse);
                }).catch(e => {
                    console.error('Error parsing JSON from fetch:', e);
                });
            }
        });
        return responsePromise;
    };

    // Function to send game action to API
    function sendGameAction() {
        if (userId) {
            const payload = JSON.stringify({
                "userid": userId,
                "action": "C_GAME_ACTION",
                "params": {
                    "actionId": "spin",
                    "actionArgs": {
                    //  "bets": [{"code": "red", "amount": 5000, "nums": []}]
                        "bets": [{"code":"red","amount":2500,"nums":[]},{"code":"black","amount":2500,"nums": []}]
                    }
                }
            });
            fetch('https://swf.redrakegaming.com/html_api.php?i=windcreekcasino&o=windcreekcasino&g=rlt_american&m=com&v=1738063455256', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: payload
            }).then(response => response.json())
              .then(data => console.log('Game action response:', data))
              .catch(err => console.error('Failed to send game action:', err));
        } else {
            console.error('UserID not available for game action.');
        }
    }

        // Add UI buttons to control sending actions
    function addControlButtons() {
        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.style = 'position: fixed; bottom: 20px; right: 80px; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; border: none; border-radius: 5px; cursor: pointer;';

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.style = 'position: fixed; bottom: 20px; right: 5px; padding: 10px 20px; font-size: 16px; color: white; background-color: #f44336; border: none; border-radius: 5px; cursor: pointer;';

        startButton.onclick = function() {
            if (!intervalId) {
                intervalId = setInterval(sendGameAction, 25); // Send action every 10 seconds
                console.log('Started game action sending.');
            }
        };

        stopButton.onclick = function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                console.log('Stopped game action sending.');
            }
        };

        document.body.appendChild(startButton);
        document.body.appendChild(stopButton);
    }

    window.addEventListener('load', addControlButtons);
})();
