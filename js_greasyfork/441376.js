// ==UserScript==
// @name       RYM: khinsider tracklist formatter
// @version    1.0.1
// @description  converts tracklist copied from khinsider to RYM format
// @match      https://rateyourmusic.com/releases/ac*
// @copyright  2022, w_biggs
// @namespace https://greasyfork.org/users/170755
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441376/RYM%3A%20khinsider%20tracklist%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/441376/RYM%3A%20khinsider%20tracklist%20formatter.meta.js
// ==/UserScript==
var target = document.getElementById('advancedhelp').getElementsByTagName('td')[0];
var newButton = document.createElement('a');
function formatFromKhinsider() {

    var box = document.getElementById('track_advanced');
    var str = box.value;
    str = str.replace(/^\s*/gm, '');
    str = str.replace(/^([0-9]*)\.(\n|\s)+/gm, '$1|');
    str = str.replace(/\n+0?(\w?\w:\w\w)/g, '|$1');
    str = str.replace(/\n(\n|\s)+/g, '\n');
    str = str.replace(/^[0-9]+\..+B\n/gm, '');
    str = str.replace(/^get_app\n?/gm, '');
    box.value = str;

}
newButton.className = 'ratingbutton';
newButton.style = 'display:block;';
newButton.addEventListener('click', formatFromKhinsider, false);
newButton.innerHTML = 'Format khinsider tracklist';
target.appendChild(newButton);