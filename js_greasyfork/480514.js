// ==UserScript==
// @name         openbeku pairurisuto
// @version      0.1
// @description  >audio>playlists>playlist
// @author       uchiha sasuke
// @match        https://openvk.*/playlist*
// @license      Do What The Fuck You Want To Public License 
// @namespace https://greasyfork.org/users/1221724
// @downloadURL https://update.greasyfork.org/scripts/480514/openbeku%20pairurisuto.user.js
// @updateURL https://update.greasyfork.org/scripts/480514/openbeku%20pairurisuto.meta.js
// ==/UserScript==

(function() {
    var yeroruheaderu = document.querySelector('.page_yellowheader');
    var audiorinko = yeroruheaderu.querySelector('a[href*="/audios-"], a[href*="/audios"]');

    if (audiorinko.href.includes('-')) {
      curubuorunotu = "-";
    } else {
      curubuorunotu = "";
    }

    var id = audiorinko.href.replace(/\D/g,'');

    var newrinko = document.createElement('a');
    newrinko.href = '/playlists' + curubuorunotu + id;
    newrinko.textContent = 'Плейлисты';

    audiorinko.parentNode.insertBefore(newrinko, audiorinko.nextSibling);
    yeroruheaderu.insertBefore(document.createTextNode(' » '), audiorinko.nextSibling);
})();