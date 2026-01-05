// ==UserScript==
// @name       RYM: bandcamp tracklist formatter
// @version    0.4
// @description  converts tracklist copied from bandcamp to RYM format
// @match      https://rateyourmusic.com/releases/ac?*
// @copyright  2012+, thought_house
// @namespace https://greasyfork.org/users/2653
// @downloadURL https://update.greasyfork.org/scripts/2280/RYM%3A%20bandcamp%20tracklist%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/2280/RYM%3A%20bandcamp%20tracklist%20formatter.meta.js
// ==/UserScript==
var target = document.getElementById('advancedhelp').getElementsByTagName('td')[0];
var newButton = document.createElement('a');
function formatFromBandcamp() {
 
    var box = document.getElementById('track_advanced');
    var str = box.value;
    str = str.replace(/\.\n\t\n/g, '|');
    str = str.replace(/\.\n/g, '|');
    str = str.replace(/ (?=\w\w:\w\w)/g, '|');
    str = str.replace(/ (?=\w\w:\w.$)/g, '|');
    str = str.replace(/\|0(\w:\w\w\n)/g, '|$1');
    str = str.replace(/\|0(\w:\w\w.$)/g, '|$1');
    
    box.value = str;
    
}
newButton.className = 'ratingbutton';
newButton.addEventListener('click', formatFromBandcamp, false);
newButton.innerHTML = 'Format bandcamp tracklist';
target.appendChild(newButton);