// ==UserScript==
// @name Colorier son pseudo
// @author bloempje
// @version 1.00
// @description Permet de colorier son pseudo sur jeuxvideo.com
// @match http://www.jeuxvideo.com/forums/*
// @match http://www.jeuxvideo.com/recherche/forums/*
// @namespace https://greasyfork.org/users/455666
// @downloadURL https://update.greasyfork.org/scripts/397495/Colorier%20son%20pseudo.user.js
// @updateURL https://update.greasyfork.org/scripts/397495/Colorier%20son%20pseudo.meta.js
// ==/UserScript==

(function() {
'use strict';
var pseudo = document.getElementsByClassName("account-pseudo")[0].innerText;
var nombre_message = document.getElementsByClassName("xXx bloc-pseudo-msg text-user").length
var nombre_topic = document.getElementsByClassName("xXx text-user topic-author").length
var pseudo_fonction_recherche = document.getElementsByClassName("xXx text-user topic-author").length

for(var i=0; i<nombre_message; i++){                                                            //couleur dans les topics
    if(pseudo == document.getElementsByClassName("xXx bloc-pseudo-msg text-user")[i].innerText){
       document.getElementsByClassName("xXx bloc-pseudo-msg text-user")[i].style.color= "#de5900";}
}
  
  
for(var i=0; i<nombre_topic; i++){                                                              //couleur dans la liste des topics
    if(pseudo == document.getElementsByClassName("xXx text-user topic-author")[i].innerText){
       document.getElementsByClassName("xXx text-user topic-author")[i].style.color= "#de5900";}
}
  
for(var i=0; i<pseudo_fonction_recherche; i++){                                                 //couleur dans la barre recherche
    if(pseudo == document.getElementsByClassName("xXx text-user topic-author")[i].innerText){
       document.getElementsByClassName("xXx text-user topic-author")[i].style.color= "#de5900";}
} 
 
  
})();