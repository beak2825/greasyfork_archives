// ==UserScript==
// @name    SkinSilhouette
// @namespace   InGame
// @author  Odul, Lorkah, DarkKobalt
// @date 24/05/2023
// @version 2.2
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @description Voir des silhouettes personnalisées
// @connect docs.google.com
// @connect googleusercontent.com
// @connect sheets.googleapis.com
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6081/SkinSilhouette.user.js
// @updateURL https://update.greasyfork.org/scripts/6081/SkinSilhouette.meta.js
// ==/UserScript==

var silhouettesUrl = new Array();
var silhouettesNom = new Array();

const API_KEY = 'AIzaSyCSnNrK0PQMz20JVuUmuO9rl9iSWRHrPm4';
const SHEET_ID = '1Ygt9q6WEU8cR_86GptLpHZ6qLHATfX42R0qcPKaqvqo';
const SHEET_NAME = 'BDD'
const SHEET_RANGE = 'A:C';
let urlGoogleSheetDatabase = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${SHEET_RANGE}?key=${API_KEY}`

const reqLog = function (response) {
    console.log(response);
};

var getSilhouettes = function (urlGoogleSheetDatabase) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: urlGoogleSheetDatabase,
        headers: {
            "Content-Type": "application/json"
        },
        responseType: 'json',
        onload: function (response) {
            console.log("Silouhettes chargées")
            var e = response.response;
            for (var i = 0; i < e.values.length; i++) {
                silhouettesUrl[e.values[i][0]] = e.values[i][2];
                if (e.values[i].length >= 3)
                    silhouettesNom[(e.values[i][1]).toLowerCase()] = e.values[i][2];
            }

            var pseudo = $("#txt_pseudo").text().toLowerCase();
            if (silhouettesNom[pseudo]) {
                $('.personnage_image').css('background-image', 'url(' + silhouettesNom[pseudo] + ')').css('background-position', '0px 0px');
            }
            console.log("Silhouette perso appliquée")
            console.log(e)

        },
        onerror: reqLog,
    });
};

Engine.prototype.openPersoBox = function (a, b) {

    var c = this;
    return $("#zone_infoBoxFixed #ib_persoBox_" + a).length ? ($("#zone_infoBoxFixed #ib_persoBox_" + a).remove(), !0) : void $.post("./Main/FixedBox/PersoBox", {
        id: a
    }, function (d) {
        if ("ERROR1" != d) {
            $("#zone_infoBoxFixed").prepend(d);

            var e = nav.getInventaire();
            $("#zone_infoBoxFixed #ib_persoBox_" + a + " .case_objet").each(function () {
                e.updateEffectsCaseObjet($(this))
            });
            $("#zone_infoBoxFixed #ib_persoBox_" + a).hide().fadeIn("fast").draggable(), setOnTop("#zone_infoBoxFixed #ib_persoBox_" + a, "infoBoxFixed"), $("#zone_infoBoxFixed #ib_persoBox_" + a).click(function () {
                $(this).hasClass("onTop") || setOnTop(this, "infoBoxFixed")
            }), centrageBox(b, "#zone_infoBoxFixed #ib_persoBox_" + a, 30, 15), c.updateToolTip(".info1, .link_info1"), c.updateToolTip(".info2, .link_info2", 2);
            var f = parseFloat($("#stat_6_entier").text() + $("#stat_6_decimal").text());
            0 == f && $("#ib_persoBox_" + a + " .interaction_3").addClass("np").attr("onClick", "");

            if (silhouettesUrl[a])
                $("#zone_infoBoxFixed #ib_persoBox_" + a + " .personnage_image").css('background-image', 'url(' + silhouettesUrl[a] + ')').css('background-position', '0px 0px');
        }
    })
}

$(document).ready(function () {
    $.ajaxSetup({ async: false });
    getSilhouettes(urlGoogleSheetDatabase);
    $.ajaxSetup({ async: true });
});