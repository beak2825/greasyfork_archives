// ==UserScript==
// @name         Bonk max menu sizes
// @version      1.0
// @author       Salama
// @description  Automatically makes menus max size
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/441669/Bonk%20max%20menu%20sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/441669/Bonk%20max%20menu%20sizes.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.maxSize { width: 100vw !important; height: 100vh !important; }';
document.getElementsByTagName('head')[0].appendChild(style);

document.getElementById('newbonklobby').className = 'maxSize';
document.getElementById('maploadwindow').className = 'maxSize';

console.log("Room menus set to max size");