// ==UserScript==
// @name         Der Standard - User Highlighting
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Colorize all users in tickers.
// @author       Winston Smith
// @license      MIT
// @match        https://www.derstandard.at/jetzt/livebericht/*
// @icon         https://www.google.com/s2/favicons?domain=derstandard.at
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505354/Der%20Standard%20-%20User%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/505354/Der%20Standard%20-%20User%20Highlighting.meta.js
// ==/UserScript==

// Your Username
const OWN_USERNAME = "DEIN USERNAME"

// Text and background colors for yourself.
// Use null for default.
const OWN_BACKGROUND_COLOR = "gold";
const OWN_TEXT_COLOR = null;

// Color settings for other users.
// If enabled, the color will be generated based on the user ID.
const OTHER_COLORS_ENABLED = true;

// Minimum value for color components to avoid dark colors.
// Has to be between 0 and 255. The resulting color is the original value
// scaled between MIN_COLOR_INTENSITY and 255.
// Higher values result in brighter colors.
const MIN_COLOR_INTENSITY = 128;

// We use Knuth's multiplicative hash to generate colors, so salting it should lead
// to different colors for users.
const HASH_SALT = 0;


function generateColor(userId) {
    const num = (((userId + HASH_SALT) * 2654435761) >>> 0);

    var r = (num & 0xFF0000) >> 16;
    var g = (num & 0x00FF00) >> 8;
    var b = num & 0x0000FF;

    r = Math.floor(MIN_COLOR_INTENSITY + (r / 256) * (256 - MIN_COLOR_INTENSITY));
    g = Math.floor(MIN_COLOR_INTENSITY + (g / 256) * (256 - MIN_COLOR_INTENSITY));
    b = Math.floor(MIN_COLOR_INTENSITY + (b / 256) * (256 - MIN_COLOR_INTENSITY));

    // Convert to hex and return as a color
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

}

// Convert a string to some deterministic number.
function stringToNumber(s) {
    let n = 0
    for (let i = 0; i < s.length; i++) {
        // ChatGPT thinks this is good, but who cares...
        n = s.charCodeAt(i) + ((n << 5) - n)
    }
    return n
}

function colorizeElement(ownerName, e) {
    const userContainer = e.querySelector("button.upost-usercontainer");
    const userName = userContainer.querySelector("strong").textContent
    const userHash = stringToNumber(userName)

    if (userName == ownerName) {
        e.style.backgroundColor = OWN_BACKGROUND_COLOR;
        e.style.color = OWN_TEXT_COLOR;
    } else if (OTHER_COLORS_ENABLED) {
        e.style.backgroundColor = generateColor(userHash);
    }
}

(function() {
    'use strict';

    // Executed on DOM changes.
    function onDomChange() {
        highlightUsers();
    }

    const observer = new MutationObserver(onDomChange);
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    function highlightUsers() {
        // TODO: Detect this again.
        // let ownerName = JSON.parse(localStorage.userdata).value.communityName;
        let ownerName = OWN_USERNAME
        let xpath = `//button[contains(@href, '/legacy/') and contains(@class, 'upost-usercontainer')]/..`;
        let nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < nodes.snapshotLength; i++) {
            const element = nodes.snapshotItem(i);
            colorizeElement(ownerName, element);
        }
    }
})();