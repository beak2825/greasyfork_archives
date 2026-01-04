// ==UserScript==
// @name         JPS Random Torrent Button
// @description  Puts a random torrent button in the JPS menu header
// @version      1.1
// @author       FlyingForNothing
// @match        https://*.jpopsuki.eu/*
// @namespace https://greasyfork.org/users/310981
// @downloadURL https://update.greasyfork.org/scripts/386590/JPS%20Random%20Torrent%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/386590/JPS%20Random%20Torrent%20Button.meta.js
// ==/UserScript==



var rndIndex = Math.floor(Math.random()*310924);
var menuBar1 = document.getElementById('userinfo_minor');
var placeholderBtn = document.createElement('li');
placeholderBtn.className = 'placeholderBtn';
placeholderBtn.innerHTML = '<button onclick="location.href = \'torrents.php?id='+rndIndex+'\';">Random torrent</button>';
menuBar1.appendChild(placeholderBtn);
