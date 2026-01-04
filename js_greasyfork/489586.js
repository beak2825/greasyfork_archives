// ==UserScript==
// @name        [GC] Add HST link to Games Room
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/games/*
// @grant       none
// @license     MIT
// @version     86
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Adds a HST link to most games in the games room. Games with non-traditional scoreboards may not be updated to the HST-inclusive format.


// @downloadURL https://update.greasyfork.org/scripts/489586/%5BGC%5D%20Add%20HST%20link%20to%20Games%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/489586/%5BGC%5D%20Add%20HST%20link%20to%20Games%20Room.meta.js
// ==/UserScript==



if (!localStorage.getItem('scriptAlert-489586')) {
    alert("Add HST Link to Games Room script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-489586', 'true');
}