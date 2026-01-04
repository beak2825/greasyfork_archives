// ==UserScript==
// @name         fix unsupported gamemodes
// @namespace    https://greasyfork.org/en/users/1019657-nrzt
// @version      1.0
// @author       Nrzt
// @license MIT
// @description  this game mode fixes any errors while the main bot is running.
// @match        https://deceptivedinos.blooket.com/*
// @match        https://blookrush.blooket.com/*
// @match        https://crazykingdom.blooket.com/*
// @match        https://towerofdoom.blooket.com/*
// @match        https://play.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462635/fix%20unsupported%20gamemodes.user.js
// @updateURL https://update.greasyfork.org/scripts/462635/fix%20unsupported%20gamemodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('The script is running.');

    setTimeout(() => {
        console.log('Navigating to the target URL.');
        window.location.href = 'https://dashboard.blooket.com/history';
    }, 7000);
})();