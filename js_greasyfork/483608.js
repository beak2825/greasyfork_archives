// ==UserScript==
// @name        [GC] - Bilge Dice Keyboard Controls & Tracking Enhancements
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/games/bilgedice/*
// @license     MIT
// @version     86
// @grant       GM_getValue
// @grant       GM_setValue
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @description Keyboard controls for Bilge Dice. Streak tracking tweaked so the new in-game streak is displayed during gameplay. You can now press enter to start a game with a default Ante, which is set to 10 NP unless you change it.
// @downloadURL https://update.greasyfork.org/scripts/483608/%5BGC%5D%20-%20Bilge%20Dice%20Keyboard%20Controls%20%20Tracking%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/483608/%5BGC%5D%20-%20Bilge%20Dice%20Keyboard%20Controls%20%20Tracking%20Enhancements.meta.js
// ==/UserScript==



if (!localStorage.getItem('scriptAlert-483608')) {
    alert("The Bilge Dice Keyboard script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-483608', 'true');
}