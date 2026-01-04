// ==UserScript==
// @name        Filtre Anti-Caca-Prout
// @namespace   filtreanticacaprout
// @description Censure ce nouveau délire de merde
// @include     http://www.jeuxvideo.com/forums/*
// @include     https://www.jeuxvideo.com/forums/*
// @include     http://m.jeuxvideo.com/forums/*
// @version     2
// @grant       none
// @author      Alectrona
// @downloadURL https://update.greasyfork.org/scripts/405241/Filtre%20Anti-Caca-Prout.user.js
// @updateURL https://update.greasyfork.org/scripts/405241/Filtre%20Anti-Caca-Prout.meta.js
// ==/UserScript==

var listesujets = document.getElementsByClassName("lien-jv topic-title");

for (i = 0; i < listesujets.length; i++) {
		var motscles = /(caca|prout)/gi;
		if(listesujets[i].title.match(motscles)) { // Si le titre du sujet contient un des mots-clés ci-dessus
		    listesujets[i].parentNode.parentNode.style.display = "none"; // On masque le sujet de la liste des sujets
		}
	}