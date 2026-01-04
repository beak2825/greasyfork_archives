// ==UserScript==
// @name            	Youtube hide video suggestion that already in watching later playlist
// @namespace       	https://greasyfork.org/users/821661
// @match           	https://www.youtube.com/*
// @grant           	GM_addStyle
// @version         	1.1a
// @author          	hdyzen
// @description     	hide video suggestion in watch later
// @license         	MIT
// @downloadURL https://update.greasyfork.org/scripts/492395/Youtube%20hide%20video%20suggestion%20that%20already%20in%20watching%20later%20playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/492395/Youtube%20hide%20video%20suggestion%20that%20already%20in%20watching%20later%20playlist.meta.js
// ==/UserScript==
'use strict';

// Get video ids in WL and return ids
async function getWLVideoIds() {
    try {
        const response = await fetch('https://www.youtube.com/playlist?list=WL');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const html = await response.text();
        const matched = html.match(/(?<="playlistVideoRenderer":{"videoId":")[a-zA-Z0-9_-]+/gm) || [];
        return matched || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Add CSS to hide videos that match the id in the element
async function addCSSToHide() {
    const ids = await getWLVideoIds();
    if (ids.length) {
        ids.forEach(id => {
            GM_addStyle(`:is(ytd-rich-item-renderer, ytd-compact-video-renderer):has(a[href*="v=${id}"]){ display: none !important; }`);
        });
    }
}

addCSSToHide();
