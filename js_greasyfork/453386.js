// ==UserScript==
// @name UpgradedDecking
// @namespace InGame
// @author Lorkah
// @date 02/09/2022
// @version 1
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Rend le decking plus agréable
// @downloadURL https://update.greasyfork.org/scripts/453386/UpgradedDecking.user.js
// @updateURL https://update.greasyfork.org/scripts/453386/UpgradedDecking.meta.js
// ==/UserScript==

Deck.prototype.startSave = Deck.prototype.start;
Deck.prototype.start = function(t) {
    var i = this;
    console.log("start i : " + i );
    this.id = t;
    deckId = t.toString().replace("db_deck_", "");
    console.log("start t : " + t );
    var e = $("#txt_pseudo").html();

    $("#"+ t).find(".content").append("<div id=etat_deck_" + deckId + " class=etat_deck >test</div>")
    $("#etat_deck_"+deckId).html("Etat : " + $(".durabiliteinfo_" + deckId).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + deckId).find("span.item_pv_max").html());
    $("#etat_deck_"+deckId).css({'position' : 'absolute', 'bottom' : '0', 'right' : '0' , 'user-select' : 'none', 'color' : '#fff', 'font-size' : '12px', 'background-color' : '#006974', 'padding' : '2px', '-webkit-box-shadow' :'5px 5px 15px 5px rgba(0,0,0,0.65)', 'box-shadow' : '5px 5px 15px 5px rgba(0,0,0,0.65)' });

    var i = this;
    this.id = t;
    var e = $("#txt_pseudo").html();
    this.contexte = "matrice", $("#" + t + " .deck_main").dblclick(function() {
        $(this).find(".ligne_ecriture input").focus()
    }), $("#" + t + " .intro span").html(e), $("#" + t + " .contexte").html(e + "@" + this.contexte + ":"), $("#" + t + " .ligne_ecriture  input").focus(function() {
        khable = !1
    }), $("#" + t + " .ligne_ecriture input").blur(function() {
        khable = !0
    }), $("#" + t + " .ligne_ecriture  input").focus(), $("#" + t + " .ligne_ecriture  input").keyup(function(e) {
        e.charCode || 13 != e.keyCode ? e.charCode || 38 != e.keyCode ? !e.charCode && 40 == e.keyCode && $("#" + t + " .zone_ecrit .targeted").length ? ($("#" + t + " .zone_ecrit .targeted").removeClass("targeted").next(".ligne_ecrite_fixed").addClass("targeted"), $("#" + t + " .zone_ecrit .targeted").length ? $("#" + t + " .ligne_ecriture  input").val($("#" + t + " .zone_ecrit .targeted input").val()) : ($("#" + t + " .zone_ecrit .ligne_ecrite_fixed:last").addClass("targeted"), $("#" + t + " .ligne_ecriture  input").val(""))) : ($("#" + t + " .ligne_ecriture .texte").html($("#" + t + " .ligne_ecriture  input").val().replace(/ /g, "&nbsp;")), this.colonne++) : (($("#" + t + " .zone_ecrit .targeted").length ? $("#" + t + " .zone_ecrit .targeted").removeClass("targeted").prev(".ligne_ecrite_fixed") : $("#" + t + " .zone_ecrit .ligne_ecrite_fixed:last")).addClass("targeted"), $("#" + t + " .zone_ecrit .targeted").length || $("#" + t + " .zone_ecrit .ligne_ecrite_fixed:first").addClass("targeted"), $("#" + t + " .ligne_ecriture  input").val($("#" + t + " .zone_ecrit .targeted input").val())) : (i.executeCommand(i, t), $("#" + t + " .zone_ecrit .targeted").removeClass("targeted"))
    })

    window['updateDecksEtat'+deckId] = setInterval(function(){
        $("#etat_deck_"+deckId).html("Etat : " + $(".durabiliteinfo_" + deckId).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + deckId).find("span.item_pv_max").html());
    }, 1000);

};
Deck.prototype.closeSave = Deck.prototype.close;
Deck.prototype.close = function() {}, Deck.prototype.useKey = function(e) {
    return 81 == e
};

Deck.prototype.getContexteSave = Deck.prototype.getContexte;
Deck.prototype.getContexte = function(e) {
    return this.contexte
};

Deck.prototype.executeCommandSave = Deck.prototype.executeCommand;
Deck.prototype.executeCommand = function(e, i, n, t) {
    id_deck = i.replace("db_deck_", "");
    var etat_fin = $(".durabiliteinfo_" + id_deck).find("span.item_pv").html();
    var etat_finmax = $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html();


    switch (n = n || $("#" + i + " .ligne_ecriture input").val()) {
        case "clear":
            if ("cydiving" === i) {
                var s = $.Deferred();
                return s.reject(), s
            }
            $("#" + i + " .zone_ecrit .ligne_ecrite_fixed, #" + i + " .zone_ecrit .ligne_resultat_fixed").remove(), $("#" + i + " .ligne_ecriture input").val("");
            $("#etat_deck_"+id_deck).html("Etat : " + $(".durabiliteinfo_" + id_deck).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html());
            break;
        case "reponse":
            $("#" + i + " .ligne_ecrite").clone().appendTo("#" + i + " .zone_ecrit").removeClass("hidden").removeClass("ligne_ecrite").addClass("ligne_ecrite_fixed"), $("#" + i + " .ligne_ecriture input").val(""), $("#" + i + " .ligne_resultat.hidden").clone().appendTo("#" + i + " .zone_ecrit").removeClass("hidden").removeClass("ligne_resultat").addClass("ligne_resultat_fixed").html(t), $("#" + i + " .deck_main").animate({
                scrollTop: $("#" + i + " .zone_ecrit").height()
            }, 500);
            $("#etat_deck_"+id_deck).html("Etat : " + $(".durabiliteinfo_" + id_deck).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html());
            break;
        case "refresh":
            $("#" + i + " .ligne_resultat_fixed:last").html(t), $("#" + i + " .deck_main").animate({
                scrollTop: $("#" + i + " .zone_ecrit").height()
            }, 500);
            $("#etat_deck_"+id_deck).html("Etat : " + $(".durabiliteinfo_" + id_deck).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html());
            break;
        default:
            return $.post("Deck/Command", {
                commande: n,
                id_deck: i.replace("db_deck_", "")
            },

            function(e) {
                id_deck = i.replace("db_deck_", "");
                if ("cydiving" === i) return !1;

                $("#" + i + " .ligne_ecrite").clone().appendTo("#" + i + " .zone_ecrit").removeClass("hidden").removeClass("ligne_ecrite").addClass("ligne_ecrite_fixed").find(".texte").val(n), $("#" + i + " .ligne_ecriture input").val(""), $(e).find("texte").length && $("#" + i + " .ligne_resultat.hidden").clone().appendTo("#" + i + " .zone_ecrit").removeClass("hidden").removeClass("ligne_resultat").addClass("ligne_resultat_fixed").html($(e).find("texte").xml()), $(e).find("acces").length && $(e).find("contexte").length && ($("#" + i + " .ligne_ecriture .contexte, #" + i + " .ligne_ecrite .contexte").html($(e).find("acces").xml() + "@" + $(e).find("contexte").xml() + ":"), "matrice" == $(e).find("contexte").xml() ? $("#" + i + " .ligne_ecriture .contexte, #" + i + " .ligne_ecrite .contexte").removeClass("connecte") : $("#" + i + " .ligne_ecriture .contexte, #" + i + " .ligne_ecrite .contexte").addClass("connecte")), $(e).find("add_class").length && $("#" + i + " .ligne_ecriture .contexte, #" + i + " .ligne_ecrite .contexte").addClass($(e).find("add_class").xml()), $(e).find("remove_class").length && $("#" + i + " .ligne_ecriture .contexte, #" + i + " .ligne_ecrite .contexte").removeClass($(e).find("remove_class").xml());
                var t = !1;
                $(e).find("parsing").length && (engine.useAjaxReturn(e), t = !0), $("#" + i + " .deck_main").animate({
                    scrollTop: $("#" + i + " .zone_ecrit").height()
                }, 500), $(e).find("quit").length && (t || engine.useAjaxReturn(e), $("#" + i + " .head .close").trigger("click")), clearInterval("updateDecksEtat"+deckId), $(e).find("case_objet").length && $(e).find("case_objet").each(function() {
                    tmp = $(this).attr("id").split(/^numConteneur_([0-9]+)_([\-0-9]+)$/), tmp2 = $(this).attr("id").split(/^quantiteObjet_([0-9]+)_([0-9]+)$/), 1 < tmp.length ? $("#contenance_item_" + tmp[1]).html(parseInt($("#contenance_item_" + tmp[1]).html()) + parseInt(tmp[2])) : 1 < tmp2.length ? $(".quantite_" + tmp2[1]).html("x" + tmp2[2]) : nav.getInventaire().updateCaseObjet($(this)), $("#etat_deck_"+id_deck).html("Etat : " + $(".durabiliteinfo_" + id_deck).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html());

                })
                $("#etat_deck_"+id_deck).html("Etat : " + $(".durabiliteinfo_" + id_deck).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html());
            })
            
    }
    $("#etat_deck_"+id_deck).html("Etat : " + $(".durabiliteinfo_" + id_deck).find("span.item_pv").html() + "/" + $(".durabiliteinfo_" + id_deck).find("span.item_pv_max").html());
};


Deck.prototype.goToBottomSave = Deck.prototype.goToBottom;
Deck.prototype.goToBottom = function(e) {
    $("#" + e + " .deck_main").scrollTop($("#" + e + " .deck_main .zone_ecrit").height() + 50)
    console.log(e)
};

