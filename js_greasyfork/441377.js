// ==UserScript==
// @name       RYM: VGMdb tracklist formatter
// @version    1.0.0
// @description  converts tracklist copied from VGMdb to RYM format
// @match      https://rateyourmusic.com/releases/ac*
// @copyright  2022, w_biggs
// @namespace https://greasyfork.org/users/170755
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441377/RYM%3A%20VGMdb%20tracklist%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/441377/RYM%3A%20VGMdb%20tracklist%20formatter.meta.js
// ==/UserScript==
var target = document.getElementById('advancedhelp').getElementsByTagName('td')[0];
var newButton = document.createElement('a');
function formatFromVGMdb() {

    var box = document.getElementById('track_advanced');
    var str = box.value;
    str = str.replace(/^0?([0-9]*)\s*\t(.+?)\s*\t(.+)\n?/gm, '$1|$2|$3\n');
    box.value = str;

}
newButton.className = 'ratingbutton';
newButton.style = 'display:block;';
newButton.addEventListener('click', formatFromVGMdb, false);
newButton.innerHTML = 'Format VGMdb tracklist';
target.appendChild(newButton);