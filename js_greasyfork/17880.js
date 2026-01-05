// ==UserScript==
// @name        ZetorrentsLinks2
// @namespace   ZetorrentsLinks2
// @description Add direct download link in search results (without jQuery)
// @description:fr Ajout du lien de téléchargement du fichier Torrent dans les résultats
// @include     http://www.zetorrents.com/*
// @include     https://www.zetorrents.com/*
// @include     http://zetorrents.com/*
// @include     https://zetorrents.com/*
// @version     0.2.2
// @grant       none
// @license     GPL
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/17880/ZetorrentsLinks2.user.js
// @updateURL https://update.greasyfork.org/scripts/17880/ZetorrentsLinks2.meta.js
// ==/UserScript==
//

function prepend(element, content) {
    element.innerHTML = content+element.innerHTML;
}

function newRequest(ligne) {
    var request = new XMLHttpRequest();
    var re = /href="(.*\.torrent)"/i;
	request.open('GET', ligne.href, true);
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			var matching = request.responseText.match(re);
			if ( matching ) {
				console.log("Ajout du lien de téléchargement du fichier Torrent : "+matching[1]);
				prepend(ligne.parentElement.parentElement, '<td style="width:24px"><a href="'+matching[1]+'">TT</a></td>');
			}
		}
        }
	request.send(null);
}

var lLength;
var lignes = document.querySelectorAll('td a.size13pt');
var tableHeader = document.querySelectorAll('table thead tr');
// Ajout d'une cellule dans le tableau des résultats
prepend(tableHeader[0],'<th style="width:24px;text-align:left;">Down LINK</th>');
// Recherche de liens publicitaires
tableHeader = document.querySelectorAll('table thead tr:nth-child(2) th:first-child');
if (tableHeader[0]) {
    prepend(tableHeader[0].parentElement,'<th style="width:24px;text-align:left;"><b>PUB</b></th>');
}
lignes = document.querySelectorAll('a.size13pt');
lLength = lignes.length;
for (var id = 0; id < lLength; id++) {
	newRequest(lignes[id]);
}
