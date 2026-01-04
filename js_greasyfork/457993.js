// ==UserScript==
// @name         Blue Mod
// @namespace    blank
// @version      1
// @description  Changes some colors on MooMoo.io to blue.
// @author       Color Mods
// @match        https://moomoo.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457993/Blue%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/457993/Blue%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.getElementById('gameName').innerHTML = 'blue';
document.getElementById('gameName').style.color = 'Blue';
document.getElementById('enterGame').style.color = 'Blue';
document.getElementById('ageText').style.color = 'Blue';
document.getElementById('foodDisplay').style.color = 'Blue';
document.getElementById('woodDisplay').style.color = 'Blue';
document.getElementById('stoneDisplay').style.color = 'Blue';
document.getElementById('goldDisplay').style.color = 'Blue';
document.getElementById('chatButton').style.color = 'Blue';
document.getElementById('allianceButton').style.color = 'Blue';
document.getElementById('storeButton').style.color = 'Blue';
document.getElementById("leaderBoard").style.color = 'Blue';
})();