// ==UserScript==
// @name         9GAG video and volume control
// @version      1.0
// @description  Enables the video controls on all video elements on 9GAG and sets low default volume.
// @author       Akxe
// @match        https://9gag.com/*
// @run-at       document-idle
// @icon         https://9gag.com/favicon.ico
// @license      CC BY-SA 4.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1500324
// @downloadURL https://update.greasyfork.org/scripts/544236/9GAG%20video%20and%20volume%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/544236/9GAG%20video%20and%20volume%20control.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Výchozí hlasitost, pokud není uživatelsky nastavena
    let defaultVideoVolume = GM_getValue("videoVolume", 0.1);

    // Nabídka pro změnu hlasitosti
    GM_registerMenuCommand("Set default video volume (0–1)", () => {
        const input = prompt("Set default video volume between 0 and 1:", defaultVideoVolume);
        const value = parseFloat(input);

        if (!isNaN(value) && value >= 0 && value <= 1) {
            GM_setValue("videoVolume", value);
            defaultVideoVolume = value;
            alert(`Volume set to: ${value}`);

            videosSet = new WeakSet();
            enableControlsOnContainer(document)
        } else {
            alert("Invalid value, set one bweteen 0 and 1.");
        }
    });

    enableControlsOnContainer(document);

    addObserver();

    let videosSet = new WeakSet();

    /**
     * Aktivuje ovládací prvky a nastaví hlasitost
     */
    function enableControlsOnContainer(container) {
        if (!container || !container.querySelectorAll) return;

        const videos = container.querySelectorAll('video');

        for (const video of videos) {
            if (videosSet.has(video)) continue;

            video.controls = true;
            video.volume = defaultVideoVolume;
            videosSet.add(video);
        }
    }

    /**
     * Sleduje přidané prvky a aplikuje změny
     */
    function addObserver() {
        const targetNode = document.getElementById('page');
        if (!targetNode) return;

        const config = { childList: true, subtree: true };

        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                for (const addedElement of mutation.addedNodes) {
                    enableControlsOnContainer(addedElement);
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
})();