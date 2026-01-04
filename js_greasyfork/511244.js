// ==UserScript==
// @name         UPJV CELCAT-Calendar Filtre/Regex
// @namespace    Bookertie's Scripts
// @version      1.0.1
// @description  Filtre planning en fonction du groupe/partern (Regex) prédéfinis. (Make sure to change the @match statement to your CELCAT Calendar website)
// @author       bookerite
// @match        https://extra.u-picardie.fr/calendar/*
// @icon         https://www.celcat.fr/assets/images/icon-demo.png
// @grant        none
// @run-at       document-document-idle
// @supportURL
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/511244/UPJV%20CELCAT-Calendar%20FiltreRegex.user.js
// @updateURL https://update.greasyfork.org/scripts/511244/UPJV%20CELCAT-Calendar%20FiltreRegex.meta.js
// ==/UserScript==

// Fonction permettant de simuler une pause à partir d'un temps renseigné en millisecondes
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {
    'use strict';
    //=====  USER-EDIT  ====== Définir le numéro de son groupe :
    const grp = 2;

    //=====  USER-EDIT  ====== Faire apparaître ce que l'on souhaite, modifier le pattern au besoin :
    const regex = new RegExp(`(groupe.*${grp})|(^()$)`, 'g');
    /*
    new RegExp(`(groupe.*${grp})|(^()$)`, 'g') :
       <=> Ex: "groupe2", "groupe 2", "groupe1.2.3", "groupe 1.2.3", "GROUPE1.2.3", etc. ==> OK
       <=> Ex: "groupe3", "groupe 1", "groupe1.2.3", "Cycle de conférence", "Toussaint", etc. ==> Les événements de l'agenda relatifs à ces "Remarques" seront supprimés.
    */

    //=====  USER-EDIT  ====== Ajuster la durée de la pause (en millisecondes) :
    const pause = 2000;

    // Programme principal
    async function main() {
        await delay(pause);
        console.log(`Après ` + pause + ` ms d'attente :`);

        // Récupère la liste de tous les événements de l'agenda dans const elements
        const elements = document.querySelectorAll(".fc-event.fc-start.fc-end");

        // Parcours la liste de tous les événements (const elements) de l'agenda un par un dans const element
        for (const element of elements) {
            await delay((pause/10));
            element.click();

            await delay((pause/10));

            // Récupère la liste des "Remarques" (.notes) relatives à l'événement (const element) dans const elements2
            const elements2 = document.querySelectorAll(".notes");

            // Parcours la liste des "Remarques" (const elements2) une par une dans const element2
            for (const element2 of elements2) {
                await delay((pause/10));

                // Si une des "Remarques" ne correspond pas au pattern défini (const regex), si elle ne correspond pas à ton groupe défini (const grp), l'événement (const element) relatif à la "Remarque" (const element2) sera supprimé
                if (!element2.textContent.toLowerCase().match(regex)) {
                    console.log(`[Débogage Trie CELCAT Calendar ] Présence de "Remarque" non autorisée : `, element2.textContent);
                    element.remove();
                }
            }
        }
    }

    console.clear();
    main();
    //alert('Tri du planning accompli !');
})();