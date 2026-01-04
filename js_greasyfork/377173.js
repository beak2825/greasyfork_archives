// ==UserScript==
// @name               No Raider Suffix
// @description        Automatically removes the ?referrer=raid suffix so you count for Partner average viewers
// @include            *://www.twitch.tv/*
// @version            1.00
// @run-at             document-start
// @author             ReaperDeath45
// @grant              none
// @namespace https://greasyfork.org/users/242392
// @downloadURL https://update.greasyfork.org/scripts/377173/No%20Raider%20Suffix.user.js
// @updateURL https://update.greasyfork.org/scripts/377173/No%20Raider%20Suffix.meta.js
// ==/UserScript==

var url = window.location.href;

if (url.includes("?")) {
    window.location.replace(window.location.href.split('?')[0]);
};