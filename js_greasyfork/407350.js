// ==UserScript==
// @name         Twitch web video player downscale fix
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  disables the annoying video playback downscaling when a tab is inactive
// @author       Slapsy
// @match        https://*.twitch.tv/*
// @match        http://*.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407350/Twitch%20web%20video%20player%20downscale%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/407350/Twitch%20web%20video%20player%20downscale%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(document, 'hidden', {value: false});
    Object.defineProperty(document, 'visibilityState', {value: 'visible'});
}
)();
