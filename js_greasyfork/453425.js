// ==UserScript==
// @name         Nitrotype Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks the ads on Nitrotype
// @author       Logzilla6
// @match        https://www.nitrotype.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nitrotype.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453425/Nitrotype%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/453425/Nitrotype%20Ad%20Blocker.meta.js
// ==/UserScript==

const ads = document.getElementsByClassName("structure-leaderboard por");
while (ads.length > 0) ads[0].remove();