// ==UserScript==
// @name         Anti-post ou cancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cliquez sur le bouton pour vérifier la présence d'un poc sur le topic
// @author       You
// @icon         https://image.noelshack.com/fichiers/2021/32/4/1628802495-geraltlerifpazulacarteantipostoucancerpazqlfent2.jpg
// @grant        none
// @match        https://onche.org/forum/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469865/Anti-post%20ou%20cancer.user.js
// @updateURL https://update.greasyfork.org/scripts/469865/Anti-post%20ou%20cancer.meta.js
// ==/UserScript==

//let colors = {000;000};

let topicListe;
topicListe = document.getElementById("content").getElementsByClassName("container")[0].childNodes[0].childNodes[0].childNodes[2].childNodes;
//console.log(topicListe);

for(let i = 0; i < topicListe.length ; i++){
    var bouton = document.createElement('button');
    bouton.style = "border-color : #CCC; border-radius: 6px";
    bouton.onclick = function (){requete(i);};
    topicListe[i].appendChild(bouton);
    console.log("fini");
}



function requete(place){
     var req = new XMLHttpRequest();
     req.open("GET", topicListe[place].childNodes[0].href , true);
     req.send();

     req.onload = function() {

         if (req.status === 200) {
             if (req.response.includes("cancer")){
                  topicListe[place].childNodes[3].style.setProperty("background-color", "#ff0000");
             }else{
                  topicListe[place].childNodes[3].style.setProperty("background-color", "#00ff99");
             }

         }else{
             console.log("pas bon").
             topicListe[place].childNodes[3].style.setProperty("background-color", "#0000CD");}
     };
}

