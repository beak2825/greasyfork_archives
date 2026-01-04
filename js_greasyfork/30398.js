// ==UserScript==
// @name        BlackList 2.0
// @author samsamdu44
// @namespace   ?
// @description Permet de censurer un topic 
// @include http://www.jeuxvideo.com/*
// @include http://www.forumjv.com/*
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30398/BlackList%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/30398/BlackList%2020.meta.js
// ==/UserScript==

var n = 0; // Variable pour la boucle
while(document.getElementsByClassName("xXx text-user topic-author")[n]) { // Teste le nombre d'auteurs de topics
  n++;
}

var nbreModo = 25 - n; // Je soustrais les auteurs au total des topics (les modos ont une classe différente des forumeurs)

var forumeurChoisi1 = ""; // Mettre le(s) pseudo(s) à blacklister
var forumeurChoisi2 = "";
var forumeurChoisi3 = ""; 
var forumeurChoisi4 = ""; 
var forumeurChoisi5 = "";

for (var i = 0; i <= 25 - nbreModo; i++) {
  if (document.getElementsByClassName("xXx text-user topic-author")[i].innerText == forumeurChoisi1 || document.getElementsByClassName("xXx text-user topic-author")[i].innerText == forumeurChoisi2 || document.getElementsByClassName("xXx text-user topic-author")[i].innerText == forumeurChoisi3 || document.getElementsByClassName("xXx text-user topic-author")[i].innerText == forumeurChoisi4 || document.getElementsByClassName("xXx text-user topic-author")[i].innerText == forumeurChoisi5) { // Teste si les forumeurs sont égaux au forumeurs choisis
    // Pour l'auteur
    document.getElementsByClassName("xXx text-user topic-author")[i].innerText = "Censuré"; // Ecris censuré
    document.getElementsByClassName("xXx text-user topic-author")[i].style.color = "#FF0000"; // Mets en rouge
    document.getElementsByClassName("xXx text-user topic-author")[i].style.fontStyle = "italic"; // En italique
    
    // Pour le titre
    document.getElementsByClassName("lien-jv topic-title")[i + nbreModo].innerText = "Censuré"; // Ecris censuré
    document.getElementsByClassName("lien-jv topic-title")[i + nbreModo].style.color = "#FF0000"; // Mets en rouge
    document.getElementsByClassName("lien-jv topic-title")[i + nbreModo].style.fontStyle = "italic"; // En italique
  }
}