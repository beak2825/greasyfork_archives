// ==UserScript==
// @name         Netflix Screenshot Hack
// @namespace    http://netflix.com
// @version      1.0.1
// @description  Simulates casting page. Press Alt+C to start/stop fake capture.
// @author       igmn
// @match        https://www.netflix.com/*
// @license      MPL-2.0
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAgUlEQVRYw+3YMQ6AIAwFUM4hp3fovVxgkTt8FzcxocRqWv+fCS8BSigpBQ0yBBWj2bBi0U3foM2uICCYiYwDZQoo48AZq/HvAdoQeB7wf4p6y0XgBjDfAwJfAv4rOTJwrXYCQYDe9U2Ab1MC/3ybmjeB5m3sTCPekO2+EipENb2rHNr8w2PHFGGbAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433520/Netflix%20Screenshot%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/433520/Netflix%20Screenshot%20Hack.meta.js
// ==/UserScript==

/* jshint esversion:6 */

// Press ALT+C

(function () {
    'use strict';

    if (!localStorage.getItem('firstTime')) localStorage.setItem('firstTime', 'true');

    if (localStorage.getItem('firstTime') == 'true') {
        alert(`
This script will fake a capture to fool Chromium into thinking that we are casting.
Press Alt+C after this alert, select your browser in the Window tab, and you should be able to screen record and screenshot Netflix.
Enjoy :)`);
        localStorage.setItem('firstTime', 'false');
    }

    const fakeVideo = document.createElement('video');
    let isCapturing = false;

    document.onkeydown = keydown;
    function keydown(evt = event) {
        // Alt + C (stop capturing)
        if (evt.altKey && evt.keyCode == 67 && isCapturing) {
            isCapturing = false;
            fakeVideo.srcObject.getTracks().forEach(track => track.stop())
            return;
        }

        // Alt + C (start capturing)
        if (evt.altKey && evt.keyCode == 67) {
            getDisplayMedia(screen => {
                isCapturing = true;
                console.log(isCapturing);
                fakeVideo.srcObject = screen;
            });
            return;
        }
    }

    function getDisplayMedia(success, error) {
        if (navigator.mediaDevices.getDisplayMedia) navigator.mediaDevices.getDisplayMedia().then(success).catch(error);
        else navigator.getDisplayMedia().then(success).catch(error);
    }

})();