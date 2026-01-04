// ==UserScript==
// @name     mabanque bnpparibas
// @description mabanque bnpparibas overlay qui empèche l'utilisation.bnp a posé une pub qui suivant certains proxy bloque l'utilisation du site.
// permet de désactiver cette couche
// @version  1
// @grant    none
// @match https://mabanque.bnpparibas/*
// @namespace https://greasyfork.org/users/457106
// @downloadURL https://update.greasyfork.org/scripts/397677/mabanque%20bnpparibas.user.js
// @updateURL https://update.greasyfork.org/scripts/397677/mabanque%20bnpparibas.meta.js
// ==/UserScript==

//Attendre que la page se charge avant de naviguer dans les sous frames
window.addEventListener('load', function() {
  	
    setTimeout(() => {document.getElementsByClassName("popin-cache")[0].remove()},2000);

  
}, false);
