// ==UserScript==
// @name         JVCercle Blacklist
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Masque les posts des cerclés sur JVC
// @author       Delawarde
// @match          http://*.jeuxvideo.com/forums/42-*
// @match          https://*.jeuxvideo.com/forums/42-*
// @match          http://*.jeuxvideo.com/forums/1-*
// @match          https://*.jeuxvideo.com/forums/1-*
// @require      http://code.jquery.com/jquery-latest.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452427/JVCercle%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/452427/JVCercle%20Blacklist.meta.js
// ==/UserScript==

/*ce script permet de masquer les messages des cerclés sur le forum
en un bouton, vous pouvez également les ré-afficher, puis les re-masquer
le choix est conservé entre les différentes pages, et même après avoir fermé la fenêtre*/
var nombredegolems = document.getElementsByClassName("challenge-border-avatar js-lazy").length; //on compte combien de golem cerclés sont sur le topic
var buffer = nombredegolems
var golems = nombredegolems
var current = 0
var init = 0
var affichage = 0

 $(".bloc-outils-top > .bloc-pre-right").append(
     "<button id=\"btn-cercle\">Afficher les cerclés");
var btn = document.getElementById('btn-cercle');
btn.addEventListener('click', afficherCercle); //on créé un bouton pour afficher les cerclés

$(".bloc-outils-top > .bloc-pre-right").append(
     "<button id=\"btn-nocercle\">Masquer les cerclés");
    var btndeux = document.getElementById('btn-nocercle');
    btndeux.addEventListener('click', masquerCercle);

affichage = localStorage.getItem("affichage"); //on récupère le choix de masquer/afficher
if (affichage == 0) {
   btndeux.style.display = 'none'
   btn.style.display = 'block'
}
 else {
   btndeux.style.display = 'block'
   btn.style.display = 'none'
 }

if (init === 0) {
    init = init+1;
     if (affichage == 0) {
             masquerCercle(); //si le choix était de masquer, alors masquer
     }
     if (affichage == 1) {
        afficherCercle(); //si le choix était d'afficher, alors afficher
     }

}

function masquerCercle() { //masquer les posts des cerclés
   golems = nombredegolems
   btndeux.style.display = 'none'
   btn.style.display = 'block'
     while (golems !== 0) {
golems = golems-1;
var post = document.getElementsByClassName("challenge-border-avatar js-lazy")[golems].parentElement;
var poste = post.parentElement;
var posted = poste.parentElement;
var postedent = posted.parentElement;
postedent.style.display = 'none';
    }
    affichage = 0;
  localStorage.setItem("affichage", affichage); //on se rappelle du choix effectué
}

function afficherCercle() { //afficher les posts des cerclés
    current = 0;
    btndeux.style.display = 'block'
    btn.style.display = 'none'
     while (current !== nombredegolems) {
var post = document.getElementsByClassName("challenge-border-avatar js-lazy")[current].parentElement;
var poste = post.parentElement;
var posted = poste.parentElement;
var postedent = posted.parentElement;
postedent.style.display = 'block';
current = current+1;
    }
    affichage = 1;
  localStorage.setItem("affichage", affichage); //on se rappelle du choix effectué
}