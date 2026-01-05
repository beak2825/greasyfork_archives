// ==UserScript==
// @name        CPBDDL2
// @namespace   CPBDDL2
// @description CPasbien Direct Download Link without jquery
// @description:fr Ajoute un lien direct vers le torrent depuis les résultats de recherche ou les suggestions sur Cpasbien
// @include     http://www.cpasbien.cm/*
// @version     0.2.1
// @grant       none
// @license     GPL
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/17633/CPBDDL2.user.js
// @updateURL https://update.greasyfork.org/scripts/17633/CPBDDL2.meta.js
// ==/UserScript==

function prepend(element, content) {
    element.innerHTML = content+element.innerHTML;
}

var dl_base_url = window.location.protocol + '//' + window.location.host + '/telechargement/';
var lignes = document.querySelectorAll('a.titre');
var lLength = lignes.length;
for (var i = 0; i < lLength; i++) {
    var torrentLink;
    var ligne = lignes[i];
    var lien = ligne.getAttribute('href');
    lien = lien.split('/');
    lien = lien.pop();
    lien = lien.replace(/html$/i, 'torrent');
    lien = dl_base_url + lien;
    torrentLink = '<a href="'+lien+'" class="titre" title="'+lien+'" style="width:40px;">TT</a>&nbsp;';
    console.log(torrentLink);
    ligne.setAttribute('style','width:532px;');
    prepend(ligne.parentElement, torrentLink);
}
