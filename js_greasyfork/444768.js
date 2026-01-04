// ==UserScript==
// @name         Mozaik show more
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a button to show more recents results on mozaik portal
// @author       You
// @match        https://mozaikportail.ca/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozaikportail.ca
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/444768/Mozaik%20show%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/444768/Mozaik%20show%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let showMore;
    let resultsContainer;
    let sortedResults;

    function retract() {
        for (let i = 0; i<9; i++) {
            resultsContainer.removeChild(resultsContainer.children[2]);
        };
    };

    function expand() {
        for (let i = 0; i<9; i++) {
            let adding = sortedResults[i];
            let resultDate = new Date(adding.dateTravail);
            let newDiv = document.createElement("div");
            newDiv.innerHTML = '<div><ul class="derniersResultats__travaux"><li class="derniersResultats__unTravail"><div><div class="unResultatTravail__matiereTravail donnee">'+adding.descriptionMatiere+'</div> <div class="unResultatTravail__info"><div class="unResultatTravail__info__contenu"><div class="unResultatTravail__titreTravail donnee"><span>'+adding.descriptionTravail+'</span></div> <div class="unResultatTravail__dateTravail donnee"><span class="date"><span class="jour">'+resultDate.toLocaleString("default", {day: "numeric"})+'</span><span>&nbsp;</span><span class="mois ">'+resultDate.toLocaleString("default", {month: "long"})+'</span><span>&nbsp;</span><span class="annee">'+resultDate.toLocaleString("default", {year: "numeric"})+'</span></span></div></div> <div class="resultat"><span class="note"><span class="noteEntiere">'+adding.resultat.valeur+'</span><span><span class="diviseur">/</span><span class="total">'+adding.resultat.noteMaximale+'</span></span></span> <span class="note noteEnPourcentage"><span class="total">('+Math.round((adding.resultat.valeur/adding.resultat.noteMaximale)*100)+'</span><span class="pourcent">%</span><span class="total">)</span></span> </div></div> </div></li></ul></div>';
            resultsContainer.insertBefore(newDiv, showMore);
        };
    };

    function showMoreClick() {
        if (showMore.classList.contains("voirPlusOuvert")) {
            showMore.classList.remove("voirPlusOuvert");
            showMore.text="Afficher plus";
            retract();
        }else{
            showMore.classList.add("voirPlusOuvert");
            showMore.text="Afficher moins";
            expand();
        };
    };

    function onLoaded() {
        resultsContainer = document.getElementsByClassName("derniersResultats")[0];
        showMore = document.createElement("a");
        showMore.text = "Afficher plus";
        showMore.className = "voirPlus";
        resultsContainer.insertBefore(showMore, resultsContainer.lastChild);
        showMore.addEventListener("click", showMoreClick);
    }

    function sort(results) {
        sortedResults = results.sort(function(obb1, obb2) {let date1 = new Date(obb1.dateHeureMajResultat); let date2 = new Date(obb2.dateHeureMajResultat); return date2.getTime()-date1.getTime()});
        sortedResults.shift();
    }

    function getResults() {
        unsafeWindow.obtenirDonneeServeur("https://apiaffaires.mozaikportail.ca/api/evaluation/resultats/"+unsafeWindow.mozaikApplication.bd.utilisateur.identite.eleve.profils[0].codeEtablissementEnseignement+"/anneeCourante/eleves/"+unsafeWindow.mozaikApplication
.bd.utilisateur.identite.eleve.profils[0].fiche+"/travaux/visibleParentEleve", unsafeWindow.authentification.jeton.id_token, function(elem) {sort(JSON.parse(elem));});
    }

    function waitForApiLoaded() {
        if (unsafeWindow.authentification != undefined) {
            if (unsafeWindow.authentification.jeton != undefined) {
            getResults();
            } else {
                setTimeout(waitForApiLoaded, 1000);
            }
        } else {
            setTimeout(waitForApiLoaded, 1000);
        }
    }

    function onMutate() {
        if (document.getElementsByClassName("menuEleve")[0] == undefined) return;
        if (document.getElementsByClassName("menuEleve")[0].firstChild.attributes["data-onglet-actif"].value != "maVieScolaire") return;
        if (document.getElementsByClassName("derniersResultats")[0].childElementCount != 3) return;
        onLoaded();
    }

    waitForApiLoaded();
    const options = {
        subtree: true,
        childList: true
    };
    onMutate();
    new MutationObserver(onMutate).observe(document.body,options);
})();