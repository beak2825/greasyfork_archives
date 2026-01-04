// ==UserScript==
// @name         J-word detector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cliquez sur le bouton pour vérifier la présence d'un jword sur le topic
// @author       You
// @icon         https://image.noelshack.com/fichiers/2021/32/4/1628802495-geraltlerifpazulacarteantipostoucancerpazqlfent2.jpg
// @grant        none
// @match        https://onche.org/forum/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477214/J-word%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/477214/J-word%20detector.meta.js
// ==/UserScript==

let topicListe = document.getElementById("content").getElementsByClassName("container")[0].childNodes[0].childNodes[0].childNodes[2].childNodes;

function processTopic(index) {
    var bouton = document.createElement('button');
    bouton.style.border = "1px solid #CCC";
    bouton.style.borderRadius = "6px";
    topicListe[index].appendChild(bouton);
    requete(index);
}

for (let i = 0; i < topicListe.length; i++) {
    // Utilisez setTimeout pour ajouter un délai de 20 ms entre chaque requête
    setTimeout(function() {
        processTopic(i);
    }, i * 1000);
}

function requete(place) {
    var req = new XMLHttpRequest();
    req.open("GET", topicListe[place].childNodes[0].href, true);
    req.send();

    req.onload = function() {
        if (req.status === 200) {
            const content = req.response.toLowerCase();
            const hasCancer = /juif/.test(content);
            if (hasCancer) {
                topicListe[place].childNodes[3].style.backgroundColor = "#ff0000";
            } else {
                topicListe[place].childNodes[3].style.backgroundColor = "#00ff99";
            }
        } else {
            console.log("pas bon");
            topicListe[place].childNodes[3].style.backgroundColor = "#0000CD";
        }
    };
}
