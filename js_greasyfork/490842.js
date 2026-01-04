// ==UserScript==
// @name            	Youtube play all from channel
// @namespace       	https://greasyfork.org/users/821661
// @match           	https://www.youtube.com/*
// @grant           	none
// @version         	1.2
// @author          	hdyzen
// @description     	add button to play all videos from channel
// @license         	MIT
// @downloadURL https://update.greasyfork.org/scripts/490842/Youtube%20play%20all%20from%20channel.user.js
// @updateURL https://update.greasyfork.org/scripts/490842/Youtube%20play%20all%20from%20channel.meta.js
// ==/UserScript==
'use strict';

// Get channel id
async function getChannelId() {
    try {
        const response = await fetch(window.location.href);

        if (!response.ok) {
            throw new Error('Error loading data');
        }

        const data = await response.text();
        const result = /(?<="channelId":)"(.*?)"/.exec(data);

        return `UU${result[1].substring(2)}`;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add param to url
function addParam(url, key = 'list', value) {
    const urlObj = new URL(url);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
}

// Add play all button style
(function addBtnStyle() {
    const btnStyle = document.createElement('style');

    btnStyle.textContent = `
    #playAll {
        background-color: var(--yt-spec-badge-chip-background);
        color: var(--yt-spec-text-primary);
        transition: background-color .5s cubic-bezier(.05,0,0,1);
        height: 32px;
        min-width: 12px;
        padding: 0 10px;
        border-radius: 8px;
        box-sizing: border-box;
        outline: none;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        position: relative;
        font-family: "Roboto","Arial",sans-serif;
        font-size: 1.4rem;
        line-height: 2rem;
        font-weight: 500;
        -moz-box-orient: horizontal;
        -moz-box-direction: normal;
        flex-direction: row;
        -moz-box-align: center;
        align-items: center;
        display: inline-flex;
        text-wrap: nowrap;
        text-decoration: none;
    }
    #playAll:hover {
        background-color: var(--yt-spec-button-chip-background-hover);
    }
    iron-selector#chips yt-chip-cloud-chip-renderer + #playAll {
        margin-left: 12px;
    }
    #owner #playAll {
        padding: 0 16px;
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        border-radius: 18px;
        margin-left: 8px;
    }
    #header.ytd-rich-grid-renderer:has(> #playAll) {
        margin-top: 16px;
        margin-bottom: -8px;
        display: unset !important;
    }      
    `;

    document.head.appendChild(btnStyle);
})();

// Create/Update play all button
document.addEventListener('yt-page-data-updated', async e => {
    if (!/\/videos$|^\/watch/.test(window.location.pathname)) return;

    const playAllButton = document.querySelector(':is(ytd-watch-flexy, ytd-browse[page-subtype="channels"]):not([hidden]) #playAll');
    const channelId = await getChannelId();
    const toAppend = document.querySelector(':is(ytd-browse[page-subtype="channels"], ytd-watch-flexy):not([hidden]) :is(iron-selector#chips, #owner.ytd-watch-metadata), #header.ytd-rich-grid-renderer[hidden]:empty');
    const getFistVideo = document.getElementById('video-title-link');

    if (!playAllButton && channelId && toAppend) {
        const aEl = document.createElement('a');
        aEl.textContent = 'Play All';
        aEl.id = 'playAll';
        aEl.href = window.location.pathname === '/watch' ? addParam(document.URL, 'list', channelId) : addParam(getFistVideo.href, 'list', channelId);
        toAppend.appendChild(aEl);
    }

    if (playAllButton) {
        playAllButton.href = window.location.pathname === '/watch' ? addParam(document.URL, 'list', channelId) : addParam(getFistVideo.href, 'list', channelId);
    }
});
