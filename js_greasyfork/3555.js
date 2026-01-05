// ==UserScript==
// @name        SkinSilhouette
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @version     1.11
// @grant       none
// @author      Odul, Lorkah
// @description Voir des silhouettes personnalisées
// @downloadURL https://update.greasyfork.org/scripts/3555/SkinSilhouette.user.js
// @updateURL https://update.greasyfork.org/scripts/3555/SkinSilhouette.meta.js
// ==/UserScript==

var silhouettesId = new Array();
var silhouettesNom = new Array();

function loadArray()
{
     $.ajax({
               type: 'GET',
               url: "http://docs.google.com/uc?export=download&id=0ByK4ISi_fO8uUFRjRnh1RWhILVU",
               async: true,
               jsonpCallback: 'jsonCallbackSilouhette0',
               contentType: "application/json",
               dataType: 'jsonp',
               success: function(json) {
                  for (var i=0 ; i < json.personnage.length ; i++)
                  {
                     silhouettesId[json.personnage[i][0]] = json.personnage[i][1];
                      if(json.personnage[i].length >= 3)
                          silhouettesNom[(json.personnage[i][2]).toLowerCase()] = json.personnage[i][1];
                  }
                   
                   var pseudo = $("#txt_pseudo").text().toLowerCase();
                   if(silhouettesNom[pseudo])
                      $('.personnage_image').css('background-image','url(http://bit.ly/'+silhouettesNom[pseudo]+')').css('background-position','0px 0px');
               },
                error: function(e) {
                   console.log(e.message);
                }
           });
}


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
                   
                    if(silhouettesId[a])
                         $("#zone_infoBoxFixed #ib_persoBox_" + a +" .personnage_image").css('background-image','url(http://bit.ly/'+silhouettesId[a]+')').css('background-position','0px 0px');
       }
    })
}


$(document).ready(function() {
$.ajaxSetup({async: false});
loadArray();
$.ajaxSetup({async: true});
})();
