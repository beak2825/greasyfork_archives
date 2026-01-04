// ==UserScript==
// @name         Twitch Activity Feed View Date
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  Twitchのアクティビティフィードで日付を表示するヤツ
// @author       tofulix
// @match        https://dashboard.twitch.tv/*
// @match        https://www.twitch.tv/*
// @run-at       document-idle
// @noframes
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451386/Twitch%20Activity%20Feed%20View%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/451386/Twitch%20Activity%20Feed%20View%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        const dateElements = document.querySelectorAll(".activity-feed-popout .activity-base-list-item__subtitle > span");
        dateElements.forEach((element, index) => {
            const date = element.title;
            const inner_text = date + " - " + element.innerHTML
            element.innerHTML = inner_text;
        });
    }, 3000);
})();