// ==UserScript==
// @name         OpaxViewer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Permet de cacher tous les messages du topic hormis ceux de l'auteur
// @author       You
// @match        https://onche.org/topic/*
// @icon         https://image.noelshack.com/fichiers/2021/43/4/1635454847-elton-john-tison-golem.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470076/OpaxViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/470076/OpaxViewer.meta.js
// ==/UserScript==

let barre = document.getElementsByClassName("title")[0].childNodes[1];
let bouAff = document.createElement("button");
let afficher = true;

bouAff.style = "background-color : #71c2fb; border-color : #71c2fb; border-radius: 4px; border-style : solid; ";
bouAff.style.width = "23px";
bouAff.style.length = "10px";
bouAff.innerHTML = "👀";
bouAff.style.fontSize = "xx-small";
bouAff.style.textAlign = "right";
bouAff.onclick = function (){
    afficher = !afficher;
    cacherafficher(afficher);
};

barre.appendChild(bouAff);
let verif = document.getElementsByClassName("messages")[0];
const styleMess = verif.childNodes[1].style.display;

function cacherafficher(etat){

      for(let i = 0; i < verif.childNodes.length ; i++){
          if(verif.childNodes[i].className != "message-anchor"){
              if(afficher) {
                  verif.childNodes[i].style.display = styleMess;
                  bouAff.style.backgroundColor = "#71c2fb";
                  bouAff.style.borderColor = "#71c2fb";
              }else if(verif.childNodes[i].getAttribute("data-username") != verif.childNodes[1].getAttribute("data-username")){
                  verif.childNodes[i].style.display = "none";
                  bouAff.style.backgroundColor = "#033b63";
                  bouAff.style.borderColor = "#033b63";
              }
      }
      }
}
