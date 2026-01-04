// ==UserScript==
// @name           Attaque mortelle sur taming.io
// @namespace      https://www.taming.io
// @version        1.0
// @description    Effectue une attaque mortelle sur un personnage sur taming.io
// @author         hackerlevel999
// @match          https://www.taming.io/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/491484/Attaque%20mortelle%20sur%20tamingio.user.js
// @updateURL https://update.greasyfork.org/scripts/491484/Attaque%20mortelle%20sur%20tamingio.meta.js
// ==/UserScript==
// Fonction pour effectuer une attaque mortelle instantanée
function attaqueMortelleInstantanee(adversaireId) {
    var adversaire = document.getElementById(adversaireId);
    if (adversaire) {
        adversaire.inflictDamage(1000000); // Inflige 1 million de dégâts à l'adversaire
    }
}
window.onload = function() {
    // Utilisation de l'identifiant de l'adversaire (à remplacer par l'identifiant réel)
    attaqueMortelleInstantanee('id-de-l-adversaire');
};
