// ==UserScript==
// @name        Syll'&Pel' AITL/TP Custom
// @namespace   InGame
// @match       https://www.dreadcast.net/Main
// @grant       none
// @version     1.2
// @author      Isilin/Pelagia
// @date        07/12/2023
// @description Customisation du TP et de l'AITL pour Syllanh et Pelagia
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/482350/Syll%27Pel%27%20AITLTP%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/482350/Syll%27Pel%27%20AITLTP%20Custom.meta.js
// ==/UserScript==

AITL.prototype.showCouple = function () {
  $('#' + this.id + " .aitl_page").hide();
  $("#" + this.id + " .actions .menu").fadeOut();
  $("#" + this.id + " .couple").fadeIn();
}

Engine.prototype.showTerminalCouple = function () {
  $('#db_portable_device relative .content .dbloader').hide();
  $('#db_portable_device relative .head .title').html('Syllanh et Pelagia');
  $('#db_portable_device relative .content').append('<div class="texte"><img src="https://i.imgur.com/EInxZUu.png" width="400"></div>')
}

MenuInventaire.prototype.activeObjet = function(idObj) {
		if (this.binding[idObj] && $("#" + this.binding[idObj]).length) return $("#" + this.binding[idObj]).remove(), !0;

		var thecase, inventaire = ($(".case_objet").each(function() {
				$(this).find("#" + idObj).length && ($(this).find(".objetLoader").show(), thecase = $(this).attr("id"))
			}), $("#infoBox").hide(), clearTimeout($("#" + idObj).parent().data("timeout")), this),
			url = "Item/Activate",
			id_personnage = 0;

		$("#" + idObj).hasClass("objet_type_AITL") && Tutoriel.validateTutoCallback(Tutoriel.EVENT_AITL), (id_personnage = $("#" + idObj).parents(".conteneur").attr("alt")) && (url = "Interface/Steal/Item", engine.closeDataBox("db_steal_" + id_personnage)), $.post("./" + url, {
			id: idObj,
			id_personnage: id_personnage
		}, function(xml) {
			if ($("#" + thecase + " .objetLoader").hide(), engine.useAjaxReturn(xml), xml_result(xml))
				if ($(xml).find("content").length) {
					var html = $(xml).find("content").xml();
					if ($(html).hasClass("conteneur")) {
						var id = $(html).attr("id"),
							idPerso = $(html).attr("alt"),
							mon_inventaire = (inventaire.binding[idObj] = id, !isset(idPerso)),
							idPerso = idPerso ? ".perso_" + idPerso + " " : "";
						$(".zone_conteneurs_displayed" + idPerso).find("#" + id).length ? $(".zone_conteneurs_displayed" + idPerso).find("#" + id).remove() : ("none" == $("#zone_inventaire").css("display") && mon_inventaire && nav.ouvre_menu("inventaire"), (mon_inventaire ? $("#zone_conteneurs_displayed") : $(".zone_conteneurs_displayed" + idPerso)).append(html), $("#" + id).hide().fadeIn("fast"), $(".zone_conteneurs_displayed" + idPerso + " .conteneur").draggable({
							cancel: ".case_objet",
							create: function() {
								engine.getDraggablePosition(id)
							},
							drag: function() {
								engine.saveDraggablePosition(id)
							}
						}), $("#" + id + " .case_objet").each(function() {
							inventaire.updateEffectsCaseObjet($(this), null, !0, mon_inventaire)
						}))
					} else if ($(html).hasClass("dataBox")) {
            if($(html).attr('id').includes('db_aitl')) {
              html = nomuraHackAITL(html);
            }
            else if($(html).attr('id').includes('db_portable_device')) {
              html = nomuraHackTP(html);
            }

						if (!1 === engine.displayDataBox(html)) return !1;
						var id = $(html).attr("id");
						preload(id), "db_map_1" != id && "db_map_2" != id || evolution.unlock(5), $(xml).find("content").attr("update") && $("#" + id + " " + $(xml).find("content").attr("update")).load($(xml).find("content").attr("url")), $(xml).find("content").attr("controller") && engine.setCtl(id, eval("new " + $(xml).find("content").attr("controller") + "()")), $("#" + idObj).hasClass("objet_type_AITL") && $(window).trigger(Encyclopedie.EVENT_LOADED)
					}
				} else {
					var tmp;
					$(xml).find("case_objet").length ? ($(xml).find("case_objet").each(function() {
						tmp = $(this).attr("id").split(/^numConteneur_([0-9]+)_([\-0-9]+)$/), tmp2 = $(this).attr("id").split(/^chargeurArme_([0-9]+)_([0-9]+)$/), tmp3 = $(this).attr("id").split(/^quantiteObjet_([0-9]+)_([0-9]+)$/), 1 < tmp.length ? $("#contenance_item_" + tmp[1]).html(parseInt($("#contenance_item_" + tmp[1]).html()) + parseInt(tmp[2])) : 1 < tmp2.length ? $(".balles_munitions_" + tmp2[1]).html(tmp2[2]) : 1 < tmp3.length ? $(".quantite_" + tmp3[1]).html("x" + tmp3[2]) : inventaire.updateCaseObjet($(this)), $("#" + $(this).attr("id")).hasClass("linkBox_vide") && $("#" + $(this).attr("id")).removeClass("active")
					}), $(".active").each(function() {
						$(this).find("#" + idObj).length && $(this).removeClass("active")
					})) : $(xml).find("switch").length && $(".item_" + $(xml).find("switch").xml() + "_switch").toggleClass("hidden")
				}
			else $(".active").each(function() {
				$(this).find("#" + idObj).length && $(this).removeClass("active")
			}), $(xml).find("stayactive").length && $("#" + idObj).parent().addClass("active")
		})
	}

function nomuraHackAITL(html) {
  var result = $(html);
  (function() {
    this.find('.canaux1.inlineBlock.textleft').children().append('<tr><td class="link couleur2 type1" style="color: purple;" onclick="engine.getCtl(this).showCouple();">Syllanh et Pelagia ♥</td><td class="type2">Par Syll & Pel</td></tr>');
    this.find('.in').append('<div class="aitl_page couple" style="display: none;"><div class="titre">Syllanh et Pelagia ♥</div><div class="texte"><span style="display: block; text-align: center;"><img src="https://i.imgur.com/EInxZUu.png" width="400"></span></div></div>');
  }).call(result);

  return result;
}

function nomuraHackTP(html) {
  var result = $(html);
  (function() {
    this.find('ul').append('<li class="link couleur4" style="color: purple;" onclick="$(\'#terminal_portable\').hide().prev().show();setTimeout(\'engine.showTerminalCouple();\', 1000);"> Terminal de Syll\' & Pel\' <br><span>Syllanh et Pelagia</span></li>');
  }).call(result);

  return result;
}

console.log('> Injection du virus n0mur4_1nt3f4c3_ctrl <')
console.log('Terminal Portable hacké pour Syllanh et Pelagia...');
console.log('AITL hacké pour Syllanh et Pelagia...');