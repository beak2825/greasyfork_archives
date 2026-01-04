// ==UserScript==
// @name         DC_Auto_500k_Centrale
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Met directement le prix à 500.000 dans les centrale. La grosse flemme
// @author       Nasty
// @match        https://www.dreadcast.net/Main
// @license      CC-BY-NC-ND - https://creativecommons.org/licenses/by-nc-nd/2.0/fr/
// @downloadURL https://update.greasyfork.org/scripts/443876/DC_Auto_500k_Centrale.user.js
// @updateURL https://update.greasyfork.org/scripts/443876/DC_Auto_500k_Centrale.meta.js
// ==/UserScript==



MenuInventaire.prototype.checkDeplacement = function(idDest) {
    var inventaire = this,
        currentDrag = this.currentDrag;
    if (currentDrag) {
        var idInit = currentDrag.parent().attr("id"),
            tav, tav;
        if (idInit == idDest) $("#" + idInit + " .item").css({
            left: this.initPos.x,
            top: this.initPos.y
        });
        else if ("poubelleInventaire" == idDest) engine.validation("Voulez-vous vraiment jeter cet objet ?", "nav.getInventaire().deleteObjet('" + idInit + "', '" + currentDrag.attr("id") + "', '" + inventaire.initPos.x + "', '" + inventaire.initPos.y + "');", "$('#" + idInit + " .item').css({left: '" + this.initPos.x + "', top: '" + this.initPos.y + "'});");
        else if ("ciseauxInventaire" == idDest) this.diviseObjets();
        else if ("window_chat" == idDest) {
            var id_objet = currentDrag.attr("id").replace(/([0-9]+)_[0-9]+/g, "$1"),
                nom_objet = currentDrag.parent().find(".titreinfo").text();
            "Votre message..." == $("#" + idDest).find("input").val() ? $("#" + idDest).find("input").val("[objet_" + id_objet + "_" + nom_objet + "]").css("color", "black") : $("#" + idDest).find("input").val($("#" + idDest).find("input").val() + "[objet_" + id_objet + "_" + nom_objet + "]"), currentDrag.css({
                left: this.initPos.x,
                top: this.initPos.y
            })
        } else if ("customisation_0_1" == idDest) {
            return $("#" + idInit).parents(".dataBox").length ? (engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1) : $("#" + idInit + " .infoBox .technoinfo").length ? ($("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), reg = new RegExp("([0-9]*)_([34])", "g"), (tab = $("#" + idInit + " .item").attr("id").split(reg)) && (3 == tab[2] ? $("#" + tab[1] + "_4").length && $("#" + tab[1] + "_4").addClass("objet_flou").draggable("disable").parent().addClass("gris") : $("#" + tab[1] + "_3").length && $("#" + tab[1] + "_3").addClass("objet_flou").draggable("disable").parent().addClass("gris")), void engine.getCtlById("db_customisation").placeItem(currentDrag)) : (engine.displayLightInfo("Cet objet ne peut pas Ãªtre amÃ©liorÃ©."), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1)
        } else {
            if ("custommodele_0_1" === idDest) return $("#" + idInit).parents(".dataBox").length ? engine.displayLightInfo("Cet objet doit Ãªtre sur vous.") : CM.getInstance().fetchObjectData(currentDrag), $("#" + idInit + " .item").css({
                left: inventaire.initPos.x,
                top: inventaire.initPos.y
            }), !1;
            if ("customise_object_0_1" === idDest) {
                if ($("#" + idInit).parents(".dataBox").length) return engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), !1;
                Custom_process.getInstance().placeItem(currentDrag), $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                })
            } else if ("reparation_0_1" == idDest) {
                if ($("#" + idInit).parents(".dataBox").length) return engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), !1;
                if (!$("#" + idInit + " .infoBox .durabiliteinfo").length) return engine.displayLightInfo("Cet objet ne peut pas Ãªtre rÃ©parÃ©."), $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), !1;
                $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), reg = new RegExp("([0-9]*)_([34])", "g"), (tab = $("#" + idInit + " .item").attr("id").split(reg)) && (3 == tab[2] ? $("#" + tab[1] + "_4").length && $("#" + tab[1] + "_4").addClass("objet_flou").draggable("disable").parent().addClass("gris") : $("#" + tab[1] + "_3").length && $("#" + tab[1] + "_3").addClass("objet_flou").draggable("disable").parent().addClass("gris"));
                var idDB = $("#" + idDest).parents(".dataBox").attr("id");
                engine.getCtlById(idDB).placeItem(currentDrag, idInit)
            } else if (test = idDest.match(/meuble_[0-9]+/)) {
                $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                });
                var infos = $("#" + idInit + " .item").attr("id").split(/_/g),
                    infosMeuble = idDest.split(/_/g);
                $.post("Item/Clean/Neuvopack", {
                    id_objet: infos[0],
                    id_meuble: infosMeuble[1]
                }, function(e) {
                    var t;
                    xml_result(e, 8) && (t = $(e).find("id_item").xml(), $(".contenance_appareil_" + t).html("0"), engine.useAjaxReturn(e))
                })
            } else {
                if ($("#" + idDest).hasClass("case_objet_type_Paquet")) return $("#" + idInit).parents(".dataBox").length || 0 !== idInit.indexOf("conteneur_") && 0 !== idInit.indexOf("inventaire_") ? (engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), $("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), !1) : $("#" + idDest).parents(".dataBox").length || 0 !== idDest.indexOf("conteneur_") && 0 !== idDest.indexOf("inventaire_") ? (engine.displayLightInfo("Cet objet doit Ãªtre sur vous."), !1) : ($("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), void $.post("Item/Paquet", {
                    id_appareil: idDest,
                    id_objet: idInit
                }, function(e) {
                    xml_result(e, 8) ? engine.useAjaxReturn(e) : $("#" + idInit).removeClass("gris").find(".item").removeClass("objet_flou").draggable("enable")
                }));
                var reg = new RegExp("echange_.*", "g"),
                    tab;
                idDest.match(reg) && ($("#" + idInit + " .item").css({
                    left: inventaire.initPos.x,
                    top: inventaire.initPos.y
                }), $("#" + idInit).addClass("gris").find(".item").addClass("objet_flou").draggable("disable"), reg = new RegExp("([0-9]*)_([34])", "g"), (tab = $("#" + idInit + " .item").attr("id").split(reg)) && (3 == tab[2] ? $("#" + tab[1] + "_4").length && $("#" + tab[1] + "_4").addClass("objet_flou").draggable("disable").parent().addClass("gris") : $("#" + tab[1] + "_3").length && $("#" + tab[1] + "_3").addClass("objet_flou").draggable("disable").parent().addClass("gris")));
                var defered = null,
                    action, defered, nom_objet, actions, formulaire, lb;
                $("#" + idDest).parent(".meuble_inventaire").length && (action = $("#" + idDest).parent(".meuble_inventaire").attr("data-action-meuble"), 26 == action && (defered = $.Deferred(), nom_objet = currentDrag.parent().find(".titreinfo").text(), actions = {
                    valider: function() {
                        defered.resolve()
                    },
                    annuler: function() {
                        defered.reject()
                    }
                }, formulaire = [{
                    type: "text",
                    id: "centrale_vente_prix",
                    label: "Prix",
                    postlabel: "Cr",
                    direction: "right",
                    value: 500000
                }], idInit.match(/^meubleInventaire/g) ? defered.reject() : (lb = new LightBox(idDest, 1, "Mise en vente d'un objet", 'Vous allez mettre en vente l\'objet <span class="couleur4">' + nom_objet + "</span>.<br />Remplissez le formulaire ci-dessous :", actions, formulaire), lb.display(), $("#lb_form_centrale_vente_prix input").keydown(function(e) {
                    if (13 == e.keyCode) return $(this).parent().parent().parent().parent().parent().children(".valider").click(), e.preventDefault(), !1
                }))));
                var effectue_deplacement = function(custom_data) {
                    $.post("./Item/Move", {
                        item: idInit + "_" + currentDrag.attr("id"),
                        box: idDest,
                        custom_data: custom_data
                    }, function(xml) {
                        var ctl, tmp;
                        xml_result(xml) ? (inventaire.binding[idInit] = !1, inventaire.binding[idDest] = !1, currentDrag.parents(".case_objet").removeClass("active"), currentDrag.parent().find(".typeinfo").text().match("Deck") && engine.closeDataBox("db_deck_" + currentDrag.parent().find(".info_objet").attr("id_item")), $(xml).find("callback").length && eval($(xml).find("callback").xml()), $(xml).find("reload").length && nav.getTravail().updateItemsToSell(), $(xml).find("achat").length && ($(window).trigger(Tutoriel.EVENT_PRISE_ASSURANCE), currentDrag.parent().replaceWith($(xml).find("caseEntreprise").xml()), $("#zone_cases_achat .case_objet_vide_type_inv_vide").droppable() && $("#zone_cases_achat .case_objet_vide_type_inv_vide").droppable("destroy"), $("#zone_cases_achat .case_objet_vide_type_inv_vide").droppable({
                            accept: ".objet_stock",
                            activeClass: "case_main_hover",
                            hoverClass: "case_main_drop",
                            drop: function(e, t) {
                                nav.getTravail().mise_en_vente($(this).attr("id"))
                            }
                        }), $("#contenance_item_" + $(xml).find("idIBConteneur").xml()).html(parseInt($("#contenance_item_" + $(xml).find("idIBConteneur").xml()).html()) + 1)), $(xml).find("pilules").length && Interface.setPilules($(xml).find("pilules").xml()), engine.useAjaxReturn(xml), ctl = engine.getCtlById("db_combat"), ctl && ctl.checkAttaqueDistance(3), $(xml).find("case_objet").length && $(xml).find("case_objet").each(function() {
                            tmp = $(this).attr("id").split(/^numConteneur_([0-9]+)_([\-0-9]+)$/), tmp2 = $(this).attr("id").split(/^quantiteObjet_([0-9]+)_([0-9]+)$/), 1 < tmp.length ? $("#contenance_item_" + tmp[1]).html(parseInt($("#contenance_item_" + tmp[1]).html()) + parseInt(tmp[2])) : 1 < tmp2.length ? $(".quantite_" + tmp2[1]).html("x" + tmp2[2]) : inventaire.updateCaseObjet($(this))
                        })) : $("#" + idInit + " .item").css({
                            left: inventaire.initPos.x,
                            top: inventaire.initPos.y
                        })
                    })
                };
                isset(defered) ? defered.then(function() {
                    effectue_deplacement.call(inventaire, lb.formData())
                }, function() {
                    $("#" + idInit + " .item").css({
                        left: inventaire.initPos.x,
                        top: inventaire.initPos.y
                    })
                }) : effectue_deplacement.call()
            }
        }
    }
}