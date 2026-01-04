// ==UserScript==
// @description A greasemonky userscript for cheating on a dumb online game
// @name        FT cheat
// @namespace   https://bolche.github.io/FT-cheat/
// @include     http://faptitans.com/*
// @version     1
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34989/FT%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/34989/FT%20cheat.meta.js
// ==/UserScript==

// Replace scripts
DEBUG = 1
window.SCRIPT_SRC = ['https://bolche.github.io/FT-cheat/vendor.js', 'https://bolche.github.io/FT-cheat/conf.js', 'https://bolche.github.io/FT-cheat/app.js'];

// Create buttons for cheats
var cheatToolbar = document.createElement('div');

var killButton = document.createElement('button');
killButton.innerHTML = 'Kill monster';
killButton.onclick = function() { window.killMonster() };
cheatToolbar.appendChild(killButton);

var DPSButton = document.createElement('button')
DPSButton.innerHTML = 'Increase DPS';
DPSButton.onclick = function() {
    var multip = parseFloat(prompt('Increase DPS in % (numbers only)'));
    window.game.getUser().get("multipliers").add("DPS", {value: new window.numbers(multip)});
};
cheatToolbar.appendChild(DPSButton);

var realPromoteLabel = document.createElement('label'), realPromoteCheck = document.createElement('input'), realPromoteText = document.createTextNode('Free (fake) promotions');
realPromoteCheck.type = 'checkbox';
realPromoteCheck.checked = true;
realPromoteCheck.onchange = function() { window.realPromote = !this.checked; };
realPromoteLabel.appendChild(realPromoteCheck);
realPromoteLabel.appendChild(realPromoteText);
cheatToolbar.appendChild(realPromoteLabel);

// Style the toolbar
cheatToolbar.style.position = 'absolute';
cheatToolbar.style.bottom = '0';
cheatToolbar.style.textAlign = 'center';
cheatToolbar.style.width = '100%';
cheatToolbar.style.backgroundColor = 'black';
cheatToolbar.style.color = 'whitesmoke';
document.body.appendChild(cheatToolbar);
