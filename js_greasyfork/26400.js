// ==UserScript==
// @name        torrent9
// @namespace   torrent9
// @description Direct torrent download from results
// @description:fr Ajoute un lien direct vers torrent dans résultats
// @include     http://www.torrent9.cc/*
// @version     0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/26400/torrent9.user.js
// @updateURL https://update.greasyfork.org/scripts/26400/torrent9.meta.js
// ==/UserScript==

var tableHeader = document.querySelectorAll('table thead tr');
var lignes = document.querySelectorAll('td a');
tableHeader[0].innerHTML += '<th style="width:80px">Lien</th>';
for (var i=0, llen=lignes.length; i<llen; i++) {
    var lien = lignes[i].getAttribute('href');
    lien = lien.replace(/torrent/i, 'get_torrent');
    lien = "http://www.torrent9.biz"+lien;
    lien +=".torrent";
    lignes[i].parentElement.parentElement.innerHTML += '<td><a href="'+lien+'">DD</a></td>';
}

