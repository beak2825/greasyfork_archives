// ==UserScript==
// @name         UT video player speed controller
// @namespace    http://tampermonkey.net/
// @version      2024-01-17
// @description  fixes the ut gov class video page
// @author       Jay Mehta
// @match        *://tower.la.utexas.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485088/UT%20video%20player%20speed%20controller.user.js
// @updateURL https://update.greasyfork.org/scripts/485088/UT%20video%20player%20speed%20controller.meta.js
// ==/UserScript==

(function() {
    // size of the size increase/decrease
    const stepSize = 0.25;
    // time to sleep in ms before running the script
    // increase this if its not working
    const runTimeout = 200;
    // speed to start it at
    const defaultSpeed = 1;
    function run() {
        console.log("b4 timeout")
        console.log("after timeout")
        const upBtn = document.createElement('button');
        upBtn.textContent = 'speed up';
        document.body.appendChild(upBtn);
        const downBtn = document.createElement('button');
        downBtn.textContent = 'speed down';
        document.body.appendChild(downBtn);
        const currSpeedLabel = document.createElement("label")
        currSpeedLabel.textContent = 'curr speed= ';
        document.body.appendChild(currSpeedLabel);

        const video = document.querySelector('video');

        let speed = defaultSpeed;

        upBtn.onclick = function() {
            speed += stepSize;
            loop();
        }
        downBtn.onclick = function() {
            speed -= stepSize;
            loop();
        }

        function loop() {
            console.log(speed)
            video.playbackRate = speed;
            currSpeedLabel.textContent = 'curr speed= ' + speed;
        }
        setInterval(loop, 500);
    }
    setTimeout(run, runTimeout);
    // Your code here...
})();