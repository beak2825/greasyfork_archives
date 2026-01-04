// ==UserScript==
// @name         theHandy support for FapInstructor.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds support for theHandy for FapInstructor.com
// @author       notSafeForDev
// @match        https://fapinstructor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407959/theHandy%20support%20for%20FapInstructorcom.user.js
// @updateURL https://update.greasyfork.org/scripts/407959/theHandy%20support%20for%20FapInstructorcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Enter connection key...";
    inputText.style.position = "absolute";
    inputText.style.top = "calc(100vh - 100px)";

    let stroking = false;
    let strokeLength = 0.4;
    let lastStrokesPerSecond = 0;

    const sendRequest = (url, onResponse) => {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.send();

        request.onreadystatechange = () => {
            if (request.readyState == 4 && onResponse != undefined) {
                onResponse(request);
            }
        }
    }

    const lerp = (value1, value2, amount) => {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }

    const updateStrokeLength = () => {
        if (inputText.value == "") {
            return;
        }

        const api = "https://www.handyfeeling.com/api/v1/" + inputText.value;

        sendRequest(api + "/getSettings", (request) => {
            var newStrokeLength = JSON.parse(request.responseText).stroke / 100;
            if (newStrokeLength != strokeLength) {
                strokeLength = newStrokeLength;
                updateStrokeSpeed(lastStrokesPerSecond);
            }
        });
    }

    const updateStrokeSpeed = (strokesPerSecond) => {
        if (stroking == false && strokesPerSecond == 0) {
            return;
        }

        let toySpeed = Math.round(strokesPerSecond * lerp(10, 45, strokeLength));

        const api = "https://www.handyfeeling.com/api/v1/" + inputText.value;

        if (stroking == false && strokesPerSecond > 0) {
            stroking = true;
            sendRequest(api + "/setMode?mode=1", () => {
                sendRequest(api + "/setSpeed?speed=" + toySpeed + "&type=%25");
            });
        } else if (stroking == true && strokesPerSecond == 0) {
            stroking = false;
            sendRequest(api + "/setMode?mode=0");
        } else {
            sendRequest(api + "/setSpeed?speed=" + toySpeed + "&type=%25");
        }

        lastStrokesPerSecond = strokesPerSecond;
    }

    const getSpeedText = () => {
        return document.querySelector(
            `#root > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)
            > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1)`
        );
    }

    const onRequestAnimationFrame = (ms) => {
        requestAnimationFrame(onRequestAnimationFrame);

        const speedText = getSpeedText();

        if (speedText == null) {
            if (stroking == true) {
                updateStrokeSpeed(0);
            }
            return;
        }

        if (inputText.parentNode == null) {
            document.body.appendChild(inputText);
        }

        if (inputText.value == "") {
            return;
        }

        const strokesPerSecond = parseFloat(speedText.textContent);

        if (strokesPerSecond != lastStrokesPerSecond) {
            updateStrokeSpeed(strokesPerSecond);
        }
    }

    setInterval(() => {
        updateStrokeLength();
    }, 5000);

    requestAnimationFrame(onRequestAnimationFrame);
})();