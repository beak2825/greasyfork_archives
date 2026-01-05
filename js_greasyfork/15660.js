// ==UserScript==
// @name        CSGODouble Skin
// @version     1.2.2
// @grant       GM_addStyle
// @description:en Also install this Stylish style https://userstyles.org/styles/122409/csgodouble-mlg
// @namespace   CSGODoubleSkinScript
// @include     http://www.csgodouble.com/
// @include     http://csgodouble.com/
// @include     http://www.csgodouble.com/index.php
// @include     http://csgodouble.com/index.php
// @description Also install this Stylish style https://userstyles.org/styles/122409/csgodouble-mlg
// @downloadURL https://update.greasyfork.org/scripts/15660/CSGODouble%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/15660/CSGODouble%20Skin.meta.js
// ==/UserScript==
var maxBet = document.querySelector('button[data-action="max"]');
var redBet = document.querySelector('button[data-lower="1"]');
var greenBet = document.querySelector('button[data-lower="0"]');
var blackBet = document.querySelector('button[data-lower="8"]');

maxBet.innerHTML="360 No-Scope";
redBet.innerHTML="Doritos (1-7)";
greenBet.innerHTML="MTN DEW (0)";
blackBet.innerHTML="Illuminati (8-14)";
//maxBet.className="btn btn-primary betshort";
unsafeWindow.sounds_rolling = new Audio('https://dl.dropboxusercontent.com/s/496pqfizg24jz8v/rolling2.wav');
unsafeWindow.sounds_rolling.volume = 0.15;
unsafeWindow.sounds_tone = new Audio('https://dl.dropboxusercontent.com/s/y7h59p553nr2325/tone.wav');
unsafeWindow.sounds_tone.volume = 0.15;