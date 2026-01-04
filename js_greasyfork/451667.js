// ==UserScript==
// @name         Plex Playback Speed
// @namespace    https://github.com/ZigZagT
// @version      1.4.0
// @description  Add playback speed controls to plex web player with keyboard shortcuts
// @author       ZigZagT
// @include      /^https?://[^/]*plex[^/]*/
// @include      /^https?://[^/]*:32400/
// @match        https://app.plex.tv/
// @match        https://plex.tv/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451667/Plex%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/451667/Plex%20Playback%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const console_log = (...args) => {
        console.log(`PlexPlaybackSpeed:`, ...args)
    }
    const cycleSpeeds = [
        0.5, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.5, 3, 3, 5, 4, 5, 6, 7, 8, 9, 10, 15, 20
    ];
    const quickSetSpeeds = {
        1: 1,
        2: 1.5,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
        7: 7,
        8: 8,
        9: 10,
    };
    let currentSpeed = 1;

    function prompt(txt) {
        const existingPrompt = document.querySelector("#playback-speed-prompt");
        if (existingPrompt) {
            document.body.removeChild(existingPrompt);
        }
        const prompt = document.createElement("div");
        prompt.id = "playback-speed-prompt";
        prompt.innerText = txt;
        document.body.appendChild(prompt);
        prompt.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 8em;
            height: 2em;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 2em;
            text-align: center;
            z-index: 99999;
            pointer-events: none;
          `;
        setTimeout(() => {
            try {
                document.body.removeChild(prompt);
            } catch (e) {}
        }, 2000);
    }

    function setVideoSpeed(speed) {
        currentSpeed = speed;
    }

    function syncVideoSpeed() {
        const videoElem = document.querySelector("video");
        if (videoElem == null) {
            return;
        }
        if (videoElem.playbackRate != currentSpeed) {
            console_log(`setting playbackRate to ${currentSpeed} for`, videoElem);
            videoElem.playbackRate = currentSpeed;
        }
    }

    function getNextCycleSpeed(direction, currentSpeed) {
        let newSpeed = currentSpeed;
        for (const speed of cycleSpeeds) {
            if (direction === 'slowdown') {
                if (speed < currentSpeed) {
                    newSpeed = speed;
                } else {
                    break;
                }
            } else if (direction === 'speedup') {
                if (speed > currentSpeed) {
                    newSpeed = speed;
                    break;
                }
            } else {
                console.error(`invalid change speed direction ${direction}`)
                break;
            }
        }
        return newSpeed;
    }

    function keyboardUpdateSpeed(e) {
        let newSpeed = currentSpeed;
        console_log({currentSpeed, key: e.key});
        if (e.key in quickSetSpeeds) {
            newSpeed = quickSetSpeeds[e.key];
        } else if (["<", ","].includes(e.key)) {
            newSpeed = getNextCycleSpeed('slowdown', currentSpeed);
        } else if ([">", "."].includes(e.key)) {
            newSpeed = getNextCycleSpeed('speedup', currentSpeed);
        } else {
            return;
        }
        console_log('change speed to', newSpeed);
        setVideoSpeed(newSpeed);
        prompt(`Speed: ${newSpeed}x`);
    }

    function btnSpeedUpFn() {
        let newSpeed = getNextCycleSpeed('speedup', currentSpeed);
        console_log('change speed to', newSpeed);
        setVideoSpeed(newSpeed);
        prompt(`Speed: ${newSpeed}x`);
    }

    function btnSlowdownFn() {
        let newSpeed = getNextCycleSpeed('slowdown', currentSpeed);
        console_log('change speed to', newSpeed);
        setVideoSpeed(newSpeed);
        prompt(`Speed: ${newSpeed}x`);
    }

    function addPlaybackButtonControls() {
        const btnStyle = `
            align-items: center;
            border-radius: 15px;
            display: flex;
            font-size: 18px;
            height: 30px;
            justify-content: center;
            margin-left: 5px;
            text-align: center;
            width: 30px;
        `;

        const containers = document.querySelectorAll('[class*="PlayerControls-buttonGroupRight"]');
        containers.forEach(container => {
            if (container.querySelector('#playback-speed-btn-slowdown')) {
                return;
            }

            const btnSlowDown = document.createElement('button');
            btnSlowDown.id = 'playback-speed-btn-slowdown';
            btnSlowDown.style = btnStyle;
            btnSlowDown.innerHTML = '🐢';
            btnSlowDown.addEventListener('click', btnSlowdownFn);

            const btnSpeedUp = document.createElement('button');
            btnSpeedUp.id = 'playback-speed-btn-speedup';
            btnSpeedUp.style = btnStyle;
            btnSpeedUp.innerHTML = '🐇';
            btnSpeedUp.addEventListener('click', btnSpeedUpFn);

            console_log('adding speed controls to', container);
            container.prepend(btnSlowDown, btnSpeedUp);
        })

    }

    function scheduleLoopFrame() {
        setTimeout(() => {
            requestAnimationFrame(() => {
                syncVideoSpeed();
                addPlaybackButtonControls();
                scheduleLoopFrame();
            });
        }, 500);
    }

    if (window.__plex_playback_speed_control_registered__) {
        console_log('plex playback speed controls are already registered');
    } else {
        window.__plex_playback_speed_control_registered__ = true;
        console_log('registering plex playback speed controls');
        window.addEventListener("keydown", keyboardUpdateSpeed);
        scheduleLoopFrame();
    }
})();
