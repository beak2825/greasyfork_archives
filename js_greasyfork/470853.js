// ==UserScript==
// @name         Prime Video and Netflix Playback set
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Allows you to set the playback rate on Prime Video and Netflix
// @author       Djexxy (Ft. ChatGPT)
// @match        https://www.primevideo.com/*
// @match        https://www.netflix.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470853/Prime%20Video%20and%20Netflix%20Playback%20set.user.js
// @updateURL https://update.greasyfork.org/scripts/470853/Prime%20Video%20and%20Netflix%20Playback%20set.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setPlaybackRate() {
        var video = document.querySelector('video');
        var rate = prompt('Set the playback rate');
        var parsedRate = parseFloat(rate);
        if (!isNaN(parsedRate)) {
            video.playbackRate = parsedRate;
        } else {
            alert('Invalid playback rate. Please enter a valid number.');
        }
    }

    function createButton() {
        var button = document.createElement('button');
        button.textContent = 'Set Playback Rate';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.color = 'white'; // Set text color to white
        button.style.backgroundColor = 'gray'; // Set background color to gray
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', setPlaybackRate);
        document.body.appendChild(button);
    }

    createButton();
})();