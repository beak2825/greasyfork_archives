// ==UserScript==
// @name        NemeLioGui
// @namespace   Violentmonkey Scripts
// @match *://*.moomoo.io/*
// @grant       none
// @version     1.0
// @license MIT
// @author      Zexus
// @description Only Text-Button Ui
// @downloadURL https://update.greasyfork.org/scripts/479877/NemeLioGui.user.js
// @updateURL https://update.greasyfork.org/scripts/479877/NemeLioGui.meta.js
// ==/UserScript==
document.getElementById('gameName').innerHTML = '✵NelilinOS✵';
document.getElementById('loadingText').innerHTML = '☛👌Fucking..'
document.getElementById('loadingText').style.color = '#fe3200'
document.getElementById('enterGame').innerHTML = '⊕Start Fucking player⊕';
document.getElementById('mapDisplay').style = 'width="140" height="140';
document.getElementById('chatButton').remove();
document.getElementById('diedText').innerHTML = "♨!!You Loser!!♨";
document.getElementById('diedText').style.color = "#fe3200";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove();
document.getElementById("storeMenu").style = "height: 50px; width: 90px;";
document.getElementById("leaderboard").append('The Bext Player');