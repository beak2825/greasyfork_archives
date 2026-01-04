// ==UserScript==
// @name         Auto switch to chat for offline channels
// @namespace    https://greasyfork.org/scripts?set=586259
// @version      1.6.0
// @description  Automaticaly switches to the chat view and closes the "Most Recent Video" and "Whatch now" popups when joining an offline channel.
// @author       Sonyo
// @match        http*://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466420/Auto%20switch%20to%20chat%20for%20offline%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/466420/Auto%20switch%20to%20chat%20for%20offline%20channels.meta.js
// ==/UserScript==


function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function getElement(selector) {
    let element = document.querySelector(selector);
    let count = 0;
    while (element === null) {
        await delay(1000);
        element = document.querySelector(selector);
        count++;
        if (count > 15) {
            return null;
        }
    }
    return element;
}

void async function () {
    'use strict';

    let prevUrl = undefined;
    setInterval(async () => {
        const currUrl = window.location.href;
        if (currUrl != prevUrl) {
            if (currUrl.includes('/about') || currUrl.includes('/schedule') || currUrl.includes('/videos') || currUrl.includes('/clips')) // User switching to About or other page
                return;
            setup();
            prevUrl = currUrl;
        }
    }, 1000);
}();

async function setup() {
    if (!location.pathname.includes('moderator')) {
        let button = await getElement('[data-a-target="channel-home-tab-Chat"]');
        if (button === null) // channel is online
            return;
        button.click();
    }

    button = await getElement(".player-overlay-background button");
    if (button === null) // no videos
        return;
    button.click();

    await delay(0);
    button = await getElement(".player-overlay-background button");
    button.click();
}