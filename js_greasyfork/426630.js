// ==UserScript==
// @name dc_traning_saver
// @namespace InGame
// @author Lorkah
// @date 15/03/2021
// @version 1.8
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Relève vos actions en combats pour faire des stats
// @connect quartier.bacon-network.net
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426630/dc_traning_saver.user.js
// @updateURL https://update.greasyfork.org/scripts/426630/dc_traning_saver.meta.js
// ==/UserScript==

// On défini les paramètres des requêtes http

var url = 'https://quartier.bacon-network.net/trainer/post_state.php';

// Ici on prépare le format de la requête

var postActions = function(url, e){
    GM_xmlhttpRequest({
    method: 'POST',
    headers:    {
    "Content-Type": "application/json"
    },
    url: url,
    responseType: 'json',
    data: e
})
};

// On re-génère la fonction du traitement des tours de combat

Combat.prototype.traiteLigneHistorique = function(num_ligne, total_lignes, elt, personnages, num_tour) {
    var ctl = this,
        id = parseInt($(elt).attr("id")),
        action = parseInt($(elt).attr("action")),
        traitement = null;

    switch (action) {
        case 10:
            traitement = function() {
                var e = {
                    fighterId: $("#txt_pseudo").text().toLowerCase(),
                    class_action: "protection",
                    texte: $(elt).xml(),
                    num_tour: num_tour,
                    nom_acteur: $(elt).attr("nom_personnage"),
                    id_acteur: $(elt).attr("id_personnage"),
                    precision: $(elt).attr("valeur"),
                    idcombat: $('#main_fight').attr('class'),
                    equipe: $('#combattant_' + $(elt).attr("id_personnage")).parent().attr('id')
                };
                postActions(url, JSON.stringify(e)), ctl.slideshowHistorique(id, num_tour, e)
            };
            break;
        case 11:
            traitement = function() {
                var e = $(elt).attr("valeur").split(/_/g),
                    e = 1 == parseInt(e[0]) ? e[0] + " case" : e[0] + " cases",
                    e = {
                        fighterId: $("#txt_pseudo").text().toLowerCase(),
                        class_action: "deplacement",
                        texte: $(elt).xml(),
                        num_tour: num_tour,
                        nom_acteur: $(elt).attr("nom_personnage"),
                        id_acteur: $(elt).attr("id_personnage"),
                        idcombat: $('#main_fight').attr('class'),
                        precision: e.slice(0,1),
                        equipe: $('#combattant_' + $(elt).attr("id_personnage")).parent().attr('id')
                    };
                    postActions(url, JSON.stringify(e)), ctl.slideshowHistorique(id, num_tour, e)
            };
            break;
        case 12:
            traitement = function() {
                var e = {
                    fighterId: $("#txt_pseudo").text().toLowerCase(),
                    class_action: "soin",
                    texte: $(elt).xml(),
                    num_tour: num_tour,
                    nom_acteur: $(elt).attr("nom_personnage"),
                    id_acteur: $(elt).attr("id_personnage"),
                    id_cible: $(elt).attr("id_cible"),
                    precision: $(elt).attr("valeur"),
                    quantite: $(elt).attr("valeur"),
                    idcombat: $('#main_fight').attr('class'),
                    equipe: $('#combattant_' + $(elt).attr("id_personnage")).parent().attr('id')
                };
                    postActions(url, JSON.stringify(e)), ctl.slideshowHistorique(id, num_tour, e), ctl.changeSanteJoueur($(elt).attr("id_cible"), personnages.find("#combattant_" + $(elt).attr("id_cible") + " .combat_joueur_barre_int").attr("style").replace("width:", "").replace("%;", ""), 1)
            };
            break;
        case 13:
            traitement = function() {
                var e = {
                    fighterId: $("#txt_pseudo").text().toLowerCase(),
                    class_action: "rien",
                    texte: $(elt).xml(),
                    num_tour: num_tour,
                    nom_acteur: $(elt).attr("nom_personnage"),
                    id_acteur: $(elt).attr("id_personnage"),
                    idcombat: $('#main_fight').attr('class'),
                    equipe: $('#combattant_' + $(elt).attr("id_personnage")).parent().attr('id')
                };
                    postActions(url, JSON.stringify(e)), ctl.slideshowHistorique(id, num_tour, e)
            };
            break;
        case 14:
            var infos = $(elt).attr("valeur").split(/_/g),
                degats = infos[0].split(/=/g),
                nbCrit = infos[1];
            degats = 1 < degats.length ? degats[1] : degats[0];
            var typeAttaque = infos[3] || infos[5] ? infos[5] ? "22" : "20" : "0",
                quantite = infos[2] ? parseInt(degats) - parseInt(infos[2]) : parseInt(degats);
                traitement = function() {
                    var e = {
                        fighterId: $("#txt_pseudo").text().toLowerCase(),
                        class_action: "attaque" + typeAttaque,
                        texte: $(elt).xml(),
                        num_tour: num_tour,
                        nom_acteur: $(elt).attr("nom_personnage"),
                        id_acteur: $(elt).attr("id_personnage"),
                        id_cible: $(elt).attr("id_cible"),
                        nom_cible: $(elt).attr("nom_cible"),
                        quantite: quantite,
                        nb_crit: nbCrit,
                        idcombat: $('#main_fight').attr('class'),
                        equipe: $('#combattant_' + $(elt).attr("id_personnage")).parent().attr('id')
                    };
                    postActions(url, JSON.stringify(e)), ctl.slideshowHistorique(id, num_tour, e), ctl.changeSanteJoueur($(elt).attr("id_cible"), personnages.find("#combattant_" + $(elt).attr("id_cible") + " .combat_joueur_barre_int").attr("style").replace("width:", "").replace("%;", ""), -1)
                };
            break;
        case 15:
            var infos = $(elt).attr("valeur").split(/_/g),
                degats = infos[0].split(/=/g),
                nbCrit = infos[1];
            degats = 1 < degats.length ? degats[1] : degats[0];
            var typeAttaque = infos[6] ? "11" : "10",
                quantite = infos[2] ? parseInt(degats) - parseInt(infos[2]) : parseInt(degats);
            traitement = function() {
                var e = {
                    fighterId: $("#txt_pseudo").text().toLowerCase(),
                    class_action: "attaque" + typeAttaque,
                    texte: $(elt).xml(),
                    num_tour: num_tour,
                    nom_acteur: $(elt).attr("nom_personnage"),
                    id_acteur: $(elt).attr("id_personnage"),
                    id_cible: $(elt).attr("id_cible"),
                    nom_cible: $(elt).attr("nom_cible"),
                    quantite: quantite,
                    nb_crit: nbCrit,
                    idcombat: $('#main_fight').attr('class'),
                    equipe: $('#combattant_' + $(elt).attr("id_personnage")).parent().attr('id')
                };
                    postActions(url, JSON.stringify(e)), ctl.slideshowHistorique(id, num_tour, e), ctl.changeSanteJoueur($(elt).attr("id_cible"), personnages.find("#combattant_" + $(elt).attr("id_cible") + " .combat_joueur_barre_int").attr("style").replace("width:", "").replace("%;", ""), -1)
            }
    }
    traitement && (this.deroulement_historique ? setTimeout(traitement, 5 * this.deroulement_historique * 1e3) : eval("traitement();"), this.deroulement_historique++)
}

console.log("DC_Trainer : Activé.")