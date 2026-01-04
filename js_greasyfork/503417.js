// ==UserScript==
// @name         Action Recorder and Replayer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Records and replays user actions with periodic and on-demand options
// @match        *:///*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/503417/Action%20Recorder%20and%20Replayer.user.js
// @updateURL https://update.greasyfork.org/scripts/503417/Action%20Recorder%20and%20Replayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let actions = [];
    let recording = false;
    let replayInterval;

    // Create and style the red curved cube
    let cube = document.createElement('div');
    cube.style.position = 'fixed';
    cube.style.width = '100px';
    cube.style.height = '100px';
    cube.style.backgroundColor = 'red';
    cube.style.borderRadius = '10px'; // To give it a "curved" look
    cube.style.top = '50%';
    cube.style.left = '50%';
    cube.style.transform = 'translate(-50%, -50%)';
    cube.style.zIndex = '10000'; // Make sure it appears on top
    cube.style.display = 'none'; // Initially hidden
    document.body.appendChild(cube);

    // Start recording when 'x' is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'x') {
            recording = true;
            actions = [];
            cube.style.display = 'block'; // Show the red cube
            console.log('Recording started');
        } else if (event.key === 'y') {
            recording = false;
            cube.style.display = 'none'; // Hide the red cube
            console.log('Recording stopped');
        }
    });

    // Capture mouse clicks and key presses
    document.addEventListener('click', function(event) {
        if (recording) {
            actions.push({
                type: 'click',
                x: event.clientX,
                y: event.clientY,
                time: Date.now()
            });
        }
    });

    document.addEventListener('keydown', function(event) {
        if (recording) {
            actions.push({
                type: 'keydown',
                key: event.key,
                time: Date.now()
            });
        }
    });

    // Replay actions
    function replayActions() {
        if (actions.length === 0) return;

        let startTime = actions[0].time;

        actions.forEach(action => {
            let delay = action.time - startTime;
            setTimeout(() => {
                if (action.type === 'click') {
                    let clickEvent = new MouseEvent('click', {
                        clientX: action.x,
                        clientY: action.y,
                        bubbles: true
                    });
                    document.dispatchEvent(clickEvent);
                } else if (action.type === 'keydown') {
                    let keyEvent = new KeyboardEvent('keydown', {
                        key: action.key,
                        bubbles: true
                    });
                    document.dispatchEvent(keyEvent);
                }
            }, delay);
        });
    }

    // Set up periodic replay every 4 hours
    function startPeriodicReplay() {
        replayInterval = setInterval(replayActions, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    }

    // Stop periodic replay
    function stopPeriodicReplay() {
        clearInterval(replayInterval);
    }

    // Trigger replay with 'z' and 'P' keys
    document.addEventListener('keydown', function(event) {
        if (event.key === 'z') {
            replayActions();
            startPeriodicReplay();
        } else if (event.key === 'P') {
            replayActions();
        }
    });

    // Optional: Stop periodic replay when the script is unloaded or at some other condition
    window.addEventListener('beforeunload', function() {
        stopPeriodicReplay();
    });
})();
