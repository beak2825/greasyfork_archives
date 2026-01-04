// ==UserScript==
// @name         Roam YouTube timestamp controls
// @namespace    learnstream.org
// @version      0.1
// @description  Add timestamp controls to YouTube videos embedded in Roam
// @author       Ryan Muller <ryanmuller@google.com>
// @match        https://*.roamresearch.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405550/Roam%20YouTube%20timestamp%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/405550/Roam%20YouTube%20timestamp%20controls.meta.js
// ==/UserScript==
// Copyright 2020 Google LLC.
// SPDX-License-Identifier: Apache 2.0

(function() {
    'use strict';

    let ytApiReady = false;
    const players = new Map();

    const activateYtVideos = () => {
        if (!ytApiReady) {
            if (window.YT !== undefined) loadYtApi(); // wait until Roam loads its YT, then insert script on top
            return null;
        }
        Array.from(document.getElementsByTagName('IFRAME'))
            .filter(iframe => iframe.src.includes('youtube.com'))
            .forEach(ytEl => {
            const ytId = ytEl.src.split('/')[4].split('?')[0];
            const block = ytEl.closest('.roam-block-container');
            if (!block.classList.contains('youtube-activated')) {
                const parent = ytEl.parentElement;
                parent.id = 'player-' + players.size;
                block.classList.add('youtube-activated');
                block.dataset.ytId = ytId;
                ytEl.remove();
                players[ytId] = new window.YT.Player(parent.id, {
                    height: '300', width: '450', videoId: ytId});
            }
            addTimestampControls(block, players[ytId]);
        });
    };

    const loadYtApi = () => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = () => { ytApiReady = true; };
    };

    const addTimestampControls = (block, player) => {
        if (block.children.length < 2) return null;
        const childBlocks = Array.from(block.children[1].children);
        childBlocks.forEach(child => {
            const timestamp = getTimestamp(child);
            const buttonIfPresent = child.classList.contains('timestamp-activated') ? getControlButton(child) : null;
            const timestampChanged = buttonIfPresent !== null && timestamp != buttonIfPresent.dataset.timestamp;
            if (buttonIfPresent !== null && (timestamp === null || timestampChanged)) {
                buttonIfPresent.remove();
                child.classList.remove('timestamp-activated');
            }
            if (timestamp !== null && (buttonIfPresent === null || timestampChanged)) {
                addControlButton(child, () => player.seekTo(timestamp, true));
                getControlButton(child).dataset.timestamp = timestamp;
                child.classList.add('timestamp-activated');
            }
        });
    };

    const getControlButton = (block) => block.querySelectorAll('.timestamp-control')[0];

    const addControlButton = (block, fn) => {
        const button = document.createElement('button');
        button.innerText = '►';
        button.classList.add('timestamp-control');
        button.addEventListener('click', fn);
        button.style.marginRight = '8px';
        const parentEl = block.children[0].children[0];
        parentEl.insertBefore(button, parentEl.querySelectorAll('.roam-block')[0]);
    };

    const getTimestamp = (block) => {
        const innerBlockSelector = block.querySelectorAll('.roam-block');
        const blockText = innerBlockSelector.length ? innerBlockSelector[0].textContent : '';
        const matches = blockText.match(/^((?:\d+:)?\d+:\d\d)\D/); // start w/ m:ss or h:mm:ss
        if (!matches || matches.length < 2) return null;
        const timeParts = matches[1].split(':').map(part => parseInt(part));
        if (timeParts.length == 3) return timeParts[0]*3600 + timeParts[1]*60 + timeParts[2];
        else if (timeParts.length == 2) return timeParts[0]*60 + timeParts[1];
        else return null;
    };

    setInterval(activateYtVideos, 1000);
})();