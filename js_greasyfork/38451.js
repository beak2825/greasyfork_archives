// ==UserScript==
// @name       RYM: bandcamp tracklist formatter (updated)
// @version    1.1.1
// @description  converts tracklist copied from bandcamp to RYM format
// @match      https://rateyourmusic.com/releases/ac*
// @copyright  2019, w_biggs (originally by thought_house)
// @namespace https://greasyfork.org/users/170755
// @downloadURL https://update.greasyfork.org/scripts/38451/RYM%3A%20bandcamp%20tracklist%20formatter%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38451/RYM%3A%20bandcamp%20tracklist%20formatter%20%28updated%29.meta.js
// ==/UserScript==
var target = document.getElementById('advancedhelp').getElementsByTagName('td')[0];
var newButton = document.createElement('a');
function formatFromBandcamp() {

    var box = document.getElementById('track_advanced');
    var str = box.value;
    str = str.replace(/^([0-9]*)\.(\n|\s)+/gm, '$1|');
    str = str.replace(/ 0?(\w?\w:\w\w)/g, '|$1');
    str = str.replace(/\n(\n|\s)+/g, '\n');
    box.value = str;

}
newButton.className = 'ratingbutton';
newButton.addEventListener('click', formatFromBandcamp, false);
newButton.innerHTML = 'Format bandcamp tracklist';
target.appendChild(newButton);