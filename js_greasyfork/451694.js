// ==UserScript==
// @name        Fiverr requests auto-reload
// @namespace   Violentmonkey Scripts
// @match       *://*.fiverr.com/users/*/requests*
// @grant       none
// @version     1.1
// @author      Glitchii (https://github.com/Glitchii)
// @description Script that auto-reloads Fiverr requests every 30 seconds or as defined.
// @icon        https://www.google.com/s2/favicons?domain=fiverr.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451694/Fiverr%20requests%20auto-reload.user.js
// @updateURL https://update.greasyfork.org/scripts/451694/Fiverr%20requests%20auto-reload.meta.js
// ==/UserScript==

let autoReload = true; // Set to false to disable reloads
let reloadSeconds = 30; // Seconds to wait between reloads. You can change it in inspect console too.
let reload = () => {
    // We don't reload if a 'send offer' popup open.
    if (document.querySelector('.popup-background-overlay'))
        return console.log('A popup is open; skipping reload.');
    location.reload();
};

let reloadInterval = setInterval(reload, reloadSeconds * 1000);

Object.defineProperty(window, 'reloadSeconds', {
    configurable: true,
    get: () => reloadSeconds,
    set: secs => {
        reloadSeconds = secs;
        clearInterval(reloadInterval);
        console.log('Reload time changed to', secs, 'seconds and will be applied on the next reload');
        reloadInterval = setInterval(reload, secs * 1000);
    }
});

Object.defineProperty(window, 'autoReload', {
    configurable: true,
    get: () => autoReload,
    set: bool => {
        autoReload = bool;
        clearInterval(reloadInterval);
        if (autoReload) reloadInterval = setInterval(reload, reloadSeconds * 1000);
        console.log('Reloads are now', autoReload ? 'enabled' : 'disabled');
    }
});