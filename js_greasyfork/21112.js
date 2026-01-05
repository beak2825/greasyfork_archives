// ==UserScript==
// @name        Trimps Squish
// @namespace   https://greasyfork.org/en/scripts/21112-trimps-squish
// @description Makes the Trimps window on Kongregate less wide
// @include     http://www.kongregate.com/games/GreenSatellite/trimps
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21112/Trimps%20Squish.user.js
// @updateURL https://update.greasyfork.org/scripts/21112/Trimps%20Squish.meta.js
// ==/UserScript==
GM_addStyle('#maingame{width: 1250px !important} #maingamecontent{width: 1250px !important} #flashframecontent{width: 1250px !important} #gameholder{width: 950px !important} #game{width: 950px !important} #gameiframe{width: 950px !important}');