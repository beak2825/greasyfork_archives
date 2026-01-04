// ==UserScript==
// @name SkinBuildings
// @namespace InGame
// @author Lorkah, Odul(json method), MockingJay (débug)
// @date 16/02/2021
// @version 1.1
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Change le skin des batiments dans DC.
// 1.1 prise en charge du responsive
// @downloadURL https://update.greasyfork.org/scripts/422119/SkinBuildings.user.js
// @updateURL https://update.greasyfork.org/scripts/422119/SkinBuildings.meta.js
// ==/UserScript==
let batimentSkin = new Array();


function loadArrayb() {
    $.ajax({
        type: 'GET',
        url: "https://docs.google.com/uc?export=download&id=1w_H2ggu4Cie_wZUd994lKpoJdFsFgHZi",
        async: true,
        jsonpCallback: 'jsonCallbackSkinbat0',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            for (let i = 0; i < json.outsideBatiment.length; i++) {
                batimentSkin[json.outsideBatiment[i][0]] = json.outsideBatiment[i][1];
            }

            loadOutsideMap();
        },
        error: function(e) {
            console.log("Erreur:" + e.message);
        }
    });
}

function loadOutsideMap() {
    let batiments = $('.case_map');
    batiments.each(function(ind, el) {
        let idBat = $(el).attr("alt");
        if (batimentSkin[idBat]) {
            $(`.case_map[alt=${idBat}]`).css('background', 'url(' + batimentSkin[idBat] + ') no-repeat').css('background-size', 'contain');
        }
    });
}

Carte.prototype.displayMapSaveBis = Carte.prototype.displayMap;
Carte.prototype.displayMap = function (a, b, c) {
    $.ajaxSetup({async: false});
    this.displayMapSaveBis(a, b, c);
    loadOutsideMap();
    $.ajaxSetup({async: true});
}

Carte.prototype.deplacementSaveBis = Carte.prototype.deplacement;
Carte.prototype.deplacement = function(e, x, y, reload_infos, params, toEval) {
    let theMap = this;
    if ("transition" == this.type && "rand" != x && "rand" != y) return !1;
    e || isset(x) || isset(y) || (e = this.donnees[0], x = this.donnees[1], y = this.donnees[2]);
    let newX = parseInt(Math.floor(x / this.tailleCase)) + parseInt(this.offsetX),
        newY = parseInt(Math.floor(y / this.tailleCase)) + parseInt(this.offsetY);
    x <= 0 && y <= 0 ? (newX = -x, newY = -y) : ("rand" == x && "rand" == y || "rand2" == x && "rand2" == y) && (newX = x, newY = y), reload_infos = reload_infos ? "1" : "0", $("#infos_building").length && !$("#infos_building_default").length && (reload_infos = "2");
    let course = "Course" == $("#action_actuelle").attr("data-value") || 6674 == engine.getIdPersonnage();
    if (!course && !theMap.canMove) return !1;
    if (this.enDeplacement) return !1;
    this.enDeplacement = !0;
    let parametres = "",
        key;
    for (key in params) parametres += "&" + key + "=" + params[key];
    loaderException = !1, $(this.id + " .carte_loader").show(), $("#informations_lieu.meuble").length && engine.displayMapInfo("default"), $.get("./Action/Move/x=" + newX + "&y=" + newY + "&reload=" + reload_infos + parametres, function(xml) {
        let zone, duree;
        xml_result(xml, !1) ? (toEval && eval(toEval), loaderException = theMap.useReturnMove(xml, reload_infos)) : (message = xml_message(xml)) && (zone = message.split(/Digicode zone (\-?[0-9]+)/g), zone[1] ? theMap.askDigicode(zone[1]) : (duree = message.split(/Prison ([0-9 jhminsec]+)/g), duree[1] ? engine.displayJailAnnonce(duree[1]) : "fatal error" !== message && engine.displayLightInfo(message, 6))), loaderException || ($(theMap.getId() + " .carte_loader").hide(), course || (theMap.canMove = !1, Interface.displayMapLoadbar(theMap).done(function() {
            theMap.canMove = !0
        }))), theMap.enDeplacement = !1, Tutoriel.instance.tutoData.actif && $(window).trigger(Tutoriel.EVENT_DEPLACEMENT)
    })
    loadOutsideMap();
}

Carte.prototype.useReturnMoveSaveBis = Carte.prototype.useReturnMove;
Carte.prototype.useReturnMove = function (xml, reload, theMap) {
    this.useReturnMoveSaveBis(xml, reload, theMap);
    loadOutsideMap();
}



$(document).ready(function() {
    $.ajaxSetup({
        async: false
    });
    loadArrayb();
    $.ajaxSetup({
        async: true
    });
});