// ==UserScript==
// @name AbyssusHelper2 - Extension
// @description AH2 + tout plein d'autre truc | IL FAUT AH2 POUR POUVOIR UTILISER CE SCRIPT
// @version  1.0
// @grant none
// @match https://s1.abyssus.games/*
// @include https://s1.abyssus.games/*
// @namespace https://greasyfork.org/users/190016
// @downloadURL https://update.greasyfork.org/scripts/403401/AbyssusHelper2%20-%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/403401/AbyssusHelper2%20-%20Extension.meta.js
// ==/UserScript==

var page;
if (document.location.href.indexOf("?page=") != -1) {
    page = document.location.href.split("?page=")[1];
    if (page.indexOf("&") != -1) page = page.split("&")[0];
} else {
    page = "accueil";
}
if (page == "ennemies"){
    document.querySelector("center").appendChild(document.createElement("br"));
    document.querySelector("center").appendChild(document.createElement("br"));
    var button = document.createElement("a");
    button.textContent = "MS en 1 clic";
    button.title = "Sonder tout les joueurs actuellement affichés.";
    button.href = "#";
    button.id = "Sonde1clic";

    document.querySelector("center").appendChild(button);

    document.getElementById('Sonde1clic').addEventListener('click', (event) => {
        document.querySelector("center").appendChild(document.createElement("br"));
        var text = document.createElement("p");
        text.textContent = "Êtes-vous sur de vouloir sonder l'ensemble des joueurs actuellement affichés ? ";
        var button = document.createElement("a");
        button.textContent = " OUI";
        button.title = "J'ai menti il y a 2 clics :D";
        button.href = "#";
        button.id = "Sonde2clic";

        text.appendChild(button);
        document.querySelector("center").appendChild(text);
            console.log(1);
        document.getElementById('Sonde2clic').addEventListener('click', (event) => {
            console.log(2);
            var list = document.getElementById("table").children[0].children;
            var cibles2 = [];
            for (var i = 1 ; i < list.length; i++){
                cibles2.push(list[i].children[1].innerText.split("\n")[0]);
            }
            console.log(cibles2);
            ahMultiSonde(cibles2);
        });
    });
}