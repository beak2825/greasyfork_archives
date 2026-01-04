// ==UserScript==
// @name DC Combat Companion
// @namespace InGame
// @author Lorkah
// @date 15/03/2021
// @version 2.4.3
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Relève vos actions en combats pour faire des stats
// @connect dctrainer.bacon-network.net
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/452022/DC%20Combat%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/452022/DC%20Combat%20Companion.meta.js
// ==/UserScript==
function initLocalMemory(defaultValue, localVarName) {
  if (GM_getValue(localVarName) === undefined) {
      GM_setValue(localVarName, defaultValue);
      return defaultValue;
  } else {
      return GM_getValue(localVarName);
  }
}

let apiKey = initLocalMemory("", "DCCC_apiKey");

if (!apiKey) {
  alert("Vous n'avez pas entré votre clé API. (Voir dans le bandeau, onglet Paramètres)");
}

var $params_menu = $('.menus > .parametres > ul');
var $dccc_config = $('<li />').appendTo($params_menu);
$dccc_config.text("Combat Companion: clé API");
$dccc_config.addClass('link couleur2 separator');

$dccc_config.click(function() {
  apiKey = prompt("Veuillez entrer votre clé API:", "") || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(apiKey)) {
      alert("Format invalide.");
      return;
  }

  GM_setValue("DCCC_apiKey", apiKey);
  alert("Clé API enregistrée.");
});


// Ici on prépare le format de la requête

const reqLog = function(response) {
  console.log(response.status, JSON.parse(response.responseText));
};

var postActions = function(payload) {
  //console.log(payload);
  GM_xmlhttpRequest({
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      url: "https://dctrainer.bacon-network.net/api/action",
      responseType: "json",
      data: JSON.stringify(payload),
      onerror: reqLog,
  });
};

// Le beau tableau du cul pour sauvegarder qui a participé en cas de KO ou de fuite.

$("#ingame").append("<div id=combat_equipes_Saver></div>")
$("#combat_equipes_Saver").append("<div id=Attaquants></div>")
$("#combat_equipes_Saver").append("<div id=Defenseurs></div>")

// On refais la fonction de fin de combat pour nettoyer le beau tableau du cul.
Combat.prototype.finDeCombat = function() {
  nav.getChat().removeRoom("combat" + this.id_combat, 1), this.map_standard.clone(this.map_combat), this.map_standard.activate(), this.map_combat.desactivate(), this.map_combat.clear(), engine.setMap(this.map_standard), engine.setAction(), $(".interaction_11_a").addClass("interaction_11_np").removeClass("interaction_11_a"), $("#main_fight").remove(), $("#main_content").fadeIn(), $("#zone_lieu").fadeIn(), $("#zone_action").fadeIn(), $("#informations_lieu").fadeIn(), $("#db_combat").remove(), zoneCentreResize(), engine.clearCtl("db_combat")
  $(".savedCombattant").remove()
}

// On re-génère la fonction du traitement des tours de combat


function GetFighterTeam(id_acteur) {
  // Déjà vu
  if ($("#savedCombattant_" + id_acteur + "").length == 1) {
      var team = $("#savedCombattant_" + id_acteur + "").parent().attr("id");
      return team
  }
  // Jamais vu
  if ($("#savedCombattant_" + id_acteur + "").length == 0) {
      var team = $("#combattant_" + id_acteur).parent().attr("class").replace("equipe_", "");
      return team
  }
  // Buggé, éxiste pas
  if ($("#combattant_" + id_acteur).parent().attr("class").replace("equipe_", "") == "undefined") {
      var team = "none";
      return team
  }
}

Combat.prototype.traiteLigneHistorique = function(
  num_ligne,
  total_lignes,
  elt,
  personnages,
  num_tour
) {
  var ctl = this,
      id = parseInt($(elt).attr("id")),
      action = parseInt($(elt).attr("action")),
      traitement = null;

  switch (action) {
      case 10:
        //Protections
          traitement = function() {
              var e = {
                  fighterId: $("#txt_pseudo").text().toLowerCase(),
                  class_action: "protection",
                  texte: $(elt).xml(),
                  num_tour: num_tour,
                  nom_acteur: $(elt).attr("nom_personnage"),
                  id_acteur: $(elt).attr("id_personnage"),
                  precision: $(elt).attr("valeur") + "pts",
                  idcombat: $("#main_fight").attr("class"),
                  equipe: GetFighterTeam($(elt).attr("id_personnage"))
              };

              if ($("#savedCombattant_" + e.id_acteur + "").length == 0) {
                  $("#" + e.equipe + "").append("<div id=savedCombattant_" + e.id_acteur + " class=savedCombattant></div>")
              }

              var trainerPayload = {
                  apiKey: apiKey,
                  fightId: parseInt(e.idcombat.replace("combat_", "")),
                  actionId: id,
                  actionType: e.class_action,
                  actionValue: parseInt(e.precision.replace(/pts$/, "")),
                  isCritical: false,
                  turn: e.num_tour,
                  team: $("#savedCombattant_" + $(elt).attr("id_personnage")).parent().attr("id"),
                  fighterId: parseInt(e.id_acteur),
                  fighterName: e.nom_acteur,
              };

              ctl.slideshowHistorique(id, num_tour, e), postActions(trainerPayload);
          };
          break;
      case 11:
        //Déplacements
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
                      idcombat: $("#main_fight").attr("class"),
                      precision: e,
                      equipe: GetFighterTeam($(elt).attr("id_personnage"))
                  };


              if ($("#savedCombattant_" + e.id_acteur + "").length == 0) {
                  $("#" + e.equipe + "").append("<div id=savedCombattant_" + e.id_acteur + " class=savedCombattant></div>")
              }

              var trainerPayload = {
                  apiKey: apiKey,
                  fightId: parseInt(e.idcombat.replace("combat_", "")),
                  actionId: id,
                  actionType: e.class_action,
                  actionValue: parseInt(e.precision.replace(/\scases?$/, "")),
                  isCritical: false,
                  turn: e.num_tour,
                  team: $("#savedCombattant_" + $(elt).attr("id_personnage")).parent().attr("id"),
                  fighterId: parseInt(e.id_acteur),
                  fighterName: e.nom_acteur,
              };

              ctl.slideshowHistorique(id, num_tour, e), postActions(trainerPayload);
          };
          break;
      case 12:
        //Soins
          traitement = function() {
              var e = {
                  fighterId: $("#txt_pseudo").text().toLowerCase(),
                  class_action: "soin",
                  texte: $(elt).xml(),
                  num_tour: num_tour,
                  nom_acteur: $(elt).attr("nom_personnage"),
                  id_acteur: $(elt).attr("id_personnage"),
                  id_cible: $(elt).attr("id_cible"),
                  precision: $(elt).attr("valeur") + "pts",
                  quantite: $(elt).attr("valeur"),
                  idcombat: $("#main_fight").attr("class"),
                  equipe: GetFighterTeam($(elt).attr("id_personnage")),
                  equipe_cible: GetFighterTeam($(elt).attr("id_cible"))
              };

              if ($("#savedCombattant_" + e.id_acteur + "").length == 0) {
                  $("#" + e.equipe + "").append("<div id=savedCombattant_" + e.id_acteur + " class=savedCombattant></div>")
              }
              if ($("#savedCombattant_" + e.id_cible + "").length == 0) {
                  $("#" + e.equipe_cible + "").append("<div id=savedCombattant_" + e.id_cible + " class=savedCombattant></div>")
              }

              var trainerPayload = {
                  apiKey: apiKey,
                  fightId: parseInt(e.idcombat.replace("combat_", "")),
                  actionId: id,
                  actionType: e.class_action,
                  actionValue: parseInt(e.quantite),
                  isCritical: false,
                  turn: e.num_tour,
                  team: $("#savedCombattant_" + $(elt).attr("id_personnage")).parent().attr("id"),
                  fighterId: parseInt(e.id_acteur),
                  fighterName: e.nom_acteur,
                  targetId: parseInt(e.id_cible),
                  targetName: $(elt).attr("nom_cible"),
                  targetTeam: $("#savedCombattant_" + $(elt).attr("id_cible")).parent().attr("id"),
              };


              ctl.slideshowHistorique(id, num_tour, e),
                  ctl.changeSanteJoueur(
                      $(elt).attr("id_cible"),
                      personnages
                      .find(
                          "#combattant_" +
                          $(elt).attr("id_cible") +
                          " .combat_joueur_barre_int"
                      )
                      .attr("style")
                      .replace("width:", "")
                      .replace("%;", ""),

                      1
                  ),
                  postActions(trainerPayload);
          };
          break;
      case 13:
        // Rien
          traitement = function() {
              var e = {
                  fighterId: $("#txt_pseudo").text().toLowerCase(),
                  class_action: "rien",
                  texte: $(elt).xml(),
                  num_tour: num_tour,
                  nom_acteur: $(elt).attr("nom_personnage"),
                  id_acteur: $(elt).attr("id_personnage"),
                  idcombat: $("#main_fight").attr("class"),
                  equipe: GetFighterTeam($(elt).attr("id_personnage"))
              };

              if ($("#savedCombattant_" + e.id_acteur + "").length == 0) {
                  $("#" + e.equipe + "").append("<div id=savedCombattant_" + e.id_acteur + " class=savedCombattant></div>")
              }

              var trainerPayload = {
                  apiKey: apiKey,
                  fightId: parseInt(e.idcombat.replace("combat_", "")),
                  actionId: id,
                  actionType: e.class_action,
                  actionValue: 0,
                  isCritical: false,
                  turn: e.num_tour,
                  team: $("#savedCombattant_" + $(elt).attr("id_personnage")).parent().attr("id"),
                  fighterId: parseInt(e.id_acteur),
                  fighterName: e.nom_acteur,
              };

              ctl.slideshowHistorique(id, num_tour, e), postActions(trainerPayload);
          };
          break;
      case 14:
        //CAC
          var infos = $(elt).attr("valeur").split(/_/g),
              degats = infos[0].split(/=/g),
              nbCrit = parseInt(infos[1]) || 0;
          degats = 1 < degats.length ? degats[1] : degats[0];
          var typeAttaque = infos[3] || infos[5] ? (infos[5] ? "22" : "20") : "0",
              quantite = infos[2] ?
              parseInt(degats) - parseInt(infos[2]) :
              parseInt(degats),
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
                      idcombat: $("#main_fight").attr("class"),
                      equipe: GetFighterTeam($(elt).attr("id_personnage")),
                      equipe_cible: GetFighterTeam($(elt).attr("id_cible"))
                  };

                  const rawText = $(elt)
                      .find(".infoBox > .infoBox_content > div")
                      .text()
                      .trim();
                  let weapon1, weapon2;

                  if (e.class_action === "attaque20" || e.class_action === "attaque22") {
                      weapon1 = rawText.replace(
                          /^\[[^\[\]]*\][^\[\]]*\[[^\[\]]*\][^\[\]]*\[([^\[\]]*)\].*$/i,
                          "$1"
                      );
                  }
                  if (e.class_action === "attaque22") {
                      weapon2 = rawText.replace(
                          /^\[[^\[\]]*\][^\[\]]*\[[^\[\]]*\][^\[\]]*\[[^\[\]]*\][^\[\]]*\[([^\[\]]*)\].*$/i,
                          "$1"
                      );
                  }

                  if ($("#savedCombattant_" + e.id_acteur + "").length == 0) {
                      $("#" + e.equipe + "").append("<div id=savedCombattant_" + e.id_acteur + " class=savedCombattant></div>")
                  }
                  if ($("#savedCombattant_" + e.id_cible + "").length == 0) {
                      $("#" + e.equipe_cible + "").append("<div id=savedCombattant_" + e.id_cible + " class=savedCombattant></div>")
                  }
                  var trainerPayload = {
                      apiKey: apiKey,
                      fightId: parseInt(e.idcombat.replace("combat_", "")),
                      actionId: id,
                      actionType: e.class_action,
                      actionValue: parseInt(degats),
                      actionRealValue: parseInt(e.quantite),
                      isCritical: $(elt).html().includes("CRITIQUE"),
                      nbCrit: nbCrit,
                      turn: e.num_tour,
                      team: $("#savedCombattant_" + $(elt).attr("id_personnage")).parent().attr("id"),
                      fighterId: parseInt(e.id_acteur),
                      fighterName: e.nom_acteur,
                      targetId: parseInt(e.id_cible),
                      targetName: e.nom_cible,
                      targetTeam: $("#savedCombattant_" + $(elt).attr("id_cible")).parent().attr("id"),
                      weapon1: weapon1,
                      weapon2: weapon2,
                  };

                  ctl.slideshowHistorique(id, num_tour, e),
                      ctl.changeSanteJoueur(
                          $(elt).attr("id_cible"),
                          personnages
                          .find(
                              "#combattant_" +
                              $(elt).attr("id_cible") +
                              " .combat_joueur_barre_int"
                          )
                          .attr("style")
                          .replace("width:", "")
                          .replace("%;", ""),
                          -1
                      ),
                      postActions(trainerPayload);
              };
          break;
      case 15:
        //Tir
          var infos = $(elt).attr("valeur").split(/_/g),
              degats = infos[0].split(/=/g),
              nbCrit = parseInt(infos[1]) || 0;
          degats = 1 < degats.length ? degats[1] : degats[0];
          var typeAttaque = infos[6] ? "11" : "10",
              quantite = infos[2] ?
              parseInt(degats) - parseInt(infos[2]) :
              parseInt(degats);
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
                  idcombat: $("#main_fight").attr("class"),
                  equipe: GetFighterTeam($(elt).attr("id_personnage")),
                  equipe_cible: GetFighterTeam($(elt).attr("id_cible"))
              };

              const rawText = $(elt)
                  .find(".infoBox > .infoBox_content > div")
                  .text()
                  .trim();
              let weapon1, weapon2;

              if (e.class_action === "attaque10" || e.class_action === "attaque11") {
                  weapon1 = rawText.replace(
                      /^\[[^\[\]]*\][^\[\]]*\[[^\[\]]*\][^\[\]]*\[([^\[\]]*)\].*$/i,
                      "$1"
                  );
              }
              if (e.class_action === "attaque11") {
                  weapon2 = rawText.replace(
                      /^\[[^\[\]]*\][^\[\]]*\[[^\[\]]*\][^\[\]]*\[[^\[\]]*\][^\[\]]*\[([^\[\]]*)\].*$/i,
                      "$1"
                  );
              }

              if ($("#savedCombattant_" + e.id_acteur + "").length == 0) {
                  $("#" + e.equipe + "").append("<div id=savedCombattant_" + e.id_acteur + " class=savedCombattant></div>")
              }
              if ($("#savedCombattant_" + e.id_cible + "").length == 0) {
                  $("#" + e.equipe_cible + "").append("<div id=savedCombattant_" + e.id_cible + " class=savedCombattant></div>")
              }
              var trainerPayload = {
                  apiKey: apiKey,
                  fightId: parseInt(e.idcombat.replace("combat_", "")),
                  actionId: id,
                  actionType: e.class_action,
                  actionValue: parseInt(degats),
                  actionRealValue: parseInt(e.quantite),
                  isCritical: $(elt).html().includes("CRITIQUE"),
                  nbCrit: nbCrit,
                  turn: e.num_tour,
                  team: $("#savedCombattant_" + $(elt).attr("id_personnage")).parent().attr("id"),
                  fighterId: parseInt(e.id_acteur),
                  fighterName: e.nom_acteur,
                  targetId: parseInt(e.id_cible),
                  targetName: e.nom_cible,
                  targetTeam: $("#savedCombattant_" + $(elt).attr("id_cible")).parent().attr("id"),
                  weapon1: weapon1,
                  weapon2: weapon2,
              };

              ctl.slideshowHistorique(id, num_tour, e), postActions(trainerPayload),
                  ctl.changeSanteJoueur(
                      $(elt).attr("id_cible"),
                      personnages
                      .find(
                          "#combattant_" +
                          $(elt).attr("id_cible") +
                          " .combat_joueur_barre_int"
                      )
                      .attr("style")
                      .replace("width:", "")
                      .replace("%;", ""),
                      -1
                  )
          };
  }
  traitement &&
      (this.deroulement_historique ?
          setTimeout(traitement, 5 * this.deroulement_historique * 1e3) :
          eval("traitement();"),
          this.deroulement_historique++);
};

console.log("DC_Trainer : Activé.");