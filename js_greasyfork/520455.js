// ==UserScript==
// @name         Fixing twitch
// @namespace    http://tampermonkey.net/
// @version      2024-12-12
// @description  Recent Twitch UI change where title is above video player. This reverts that.
// @author       You
// @match        https://www.twitch.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/520455/Fixing%20twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/520455/Fixing%20twitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    window.onload = async function () {
        await sleep(2000);

        const parentDiv = document.querySelector('.channel-root__info');
        if (!parentDiv) return;

        const channelDiv = document.querySelector('.channel-root__upper-watch');
        if (!channelDiv) return;

        const children = Array.from(parentDiv.children);

        parentDiv.insertBefore(channelDiv, children[0]);
    };
})();