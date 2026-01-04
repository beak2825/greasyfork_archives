// ==UserScript==
// @name         Mozaik show average
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Display the average result on mozaik portal
// @author       You
// @match        https://mozaikportail.ca/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozaikportail.ca
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/444166/Mozaik%20show%20average.user.js
// @updateURL https://update.greasyfork.org/scripts/444166/Mozaik%20show%20average.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pending;
    let resultsJSON;
    function start(response) {
        pending = false;
        if(response != null) {resultsJSON = response; pending = false;} else {response = resultsJSON};
        document.querySelectorAll(".unResultatTravail__titreTravail").forEach(function(element) {if(element.parentElement.parentElement.parentElement.parentElement.className != "derniersResultats__unTravail"){
            if(element.parentElement.parentElement.childElementCount == 2) {
                let title = element.firstChild.textContent;
                let json = response.find(e=>e.descriptionTravail==title);
                createAverageDisplay(json.resultat.moyenne, json.resultat.noteMaximale, element.parentElement.parentElement.parentElement.parentElement);
            }}});
    }

    function update() {
        if (unsafeWindow.authentification == undefined) return;
        if (pending) return;
        if(resultsJSON == undefined) {
            pending = true
            unsafeWindow.obtenirDonneeServeur("https://apiaffaires.mozaikportail.ca/api/evaluation/resultats/"+unsafeWindow.mozaikApplication.bd.utilisateur.identite.eleve.profils[0].codeEtablissementEnseignement+"/anneeCourante/eleves/"+unsafeWindow.mozaikApplication
.bd.utilisateur.identite.eleve.profils[0].fiche+"/travaux/visibleParentEleve", unsafeWindow.authentification.jeton.id_token, elem => start(JSON.parse(elem)));
        } else {
            start(null)
        }
    }
    function createAverageDisplay(note, noteMax, contentBox) {
        let averageDiv = document.createElement("div");
        let resultsParent = contentBox.firstChild.children[0];
        let resultatSpan = document.createElement("span");
        let br = document.createElement("br")
        averageDiv.className = "resultat";
        averageDiv.innerHTML = '<span>Moyenne</span><br><span class="note"><span class="noteEntiere">'+Math.round(note)+'</span><span><span class="diviseur">/</span><span class="total">'+noteMax+'</span></span></span> <span class="note noteEnPourcentage"><span class="total">('+Math.round((note/noteMax)*100)+'</span><span class="pourcent">%</span><span class="total">)</span></span>';
        if (noteMax == 100) averageDiv.innerHTML = '<span>Moyenne</span><br><span class="note"><span class="noteEntiere">'+Math.round(note)+'</span><span><span class="diviseur">/</span><span class="total">'+noteMax+'</span></span></span>';
        averageDiv.style.paddingLeft="20px"
        resultsParent.appendChild(averageDiv);
        resultatSpan.innerText = "Résultat";
        resultsParent.children[1].insertBefore(br, resultsParent.children[1].firstChild);
        resultsParent.children[1].insertBefore(resultatSpan, resultsParent.children[1].firstChild);
    }
    const options = {
        subtree: true,
        childList: true
    };
    new MutationObserver(update).observe(document.body,options);
})();