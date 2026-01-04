// ==UserScript==
// @name        BlockUse
// @namespace   InGame
// @include     http://www.dreadcast.net/Main
// @include     https://www.dreadcast.net/Main
// @version     1.15
// @description Bloque l'utilisation de consommables par défaut. Il faut déverrouiller le petit cadenas 'BU' pour pouvoir.
// @author      Odul, MockingJay
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/394075/BlockUse.user.js
// @updateURL https://update.greasyfork.org/scripts/394075/BlockUse.meta.js
// ==/UserScript==

function initLocalMemory(defaultValue, localVarName) {
    if (GM_getValue(localVarName) === undefined) {
        GM_setValue(localVarName, defaultValue);
        return defaultValue;
    } else {
        return GM_getValue(localVarName);
    }
}

var isLocked = initLocalMemory(true, "BU_isLocked");

function checkActivable() {
    if (!isLocked) {
        $('.objets .objet_type_Consommable.non_activable').each(function(index) { //Sacs ouverts
            $(this).removeClass("non_activable").addClass("activable");
        });
        $(".zone_case10 .objet_type_Consommable.non_activable").removeClass("non_activable").addClass("activable"); //Inventaire RP
        $(".zone_case11 .objet_type_Consommable.non_activable").removeClass("non_activable").addClass("activable");
        $(".zone_case12 .objet_type_Consommable.non_activable").removeClass("non_activable").addClass("activable");
        $(".zone_case13 .objet_type_Consommable.non_activable").removeClass("non_activable").addClass("activable");
    } else {
        $('.objets .objet_type_Consommable.activable').each(function(index) { //Sacs ouverts
            $(this).removeClass("activable").addClass("non_activable");
        });
        $(".zone_case10 .objet_type_Consommable.activable").removeClass("activable").addClass("non_activable"); //Inventaire RP
        $(".zone_case11 .objet_type_Consommable.activable").removeClass("activable").addClass("non_activable");
        $(".zone_case12 .objet_type_Consommable.activable").removeClass("activable").addClass("non_activable");
        $(".zone_case13 .objet_type_Consommable.activable").removeClass("activable").addClass("non_activable");
    }
}

var invTimeout = [];

function invCallback(i) {
    for (let i = 1; i <= 20; i++) {
        clearTimeout(invTimeout[i-1]);
        invTimeout[i-1] = setTimeout(checkActivable, 500*i); //Fix très sale mais le bug à l'initialisation m'énerve
    }
    $("#annexe_inventaire_ext .content").off("ajaxComplete", invCallback);
}

function bagCallback() { //Optimisation de l'appel de la fonction avec une callback qui ne se déclenche qu'une fois.
    checkActivable();
    $("#zone_conteneurs_displayed").off("ajaxComplete", bagCallback);
}

$(document).ready(function() {

    $('<li class="separator"></li>').prependTo($('#bandeau ul.menus'));

    var blockUse = $('<li>').prependTo($('#bandeau ul.menus'));
    blockUse.attr("id", 'blockUse');
    blockUse.css({
        top: '5px',
        left: '10px',
        height: '30px',
        "background-image": isLocked ? "url('https://i.imgur.com/TTYgqO6.png')" : "url('https://i.imgur.com/u8m9f9A.png')",
        "background-position": "0px 6px",
        "background-size": "15px 15px",
        "background-repeat": "no-repeat",
        "z-index": 999999,
    });
    $('#blockUse').addClass('link').text('BU').css("color", "#999");

    $("#blockUse").click(function() {
        if (document.getElementById('blockUse').style.backgroundImage.replace(/\"/g, '') == 'url(https://i.imgur.com/u8m9f9A.png)') {
            document.getElementById('blockUse').style.backgroundImage = 'url("https://i.imgur.com/TTYgqO6.png")';
            isLocked = true;
            GM_setValue("BU_isLocked", true);
        }
        else {
            document.getElementById('blockUse').style.backgroundImage = 'url("https://i.imgur.com/u8m9f9A.png")';
            isLocked = false;
            GM_setValue("BU_isLocked", false);
        }
        checkActivable(); //Bloquer/débloquer lors d'un clic
    });

    //Initialisation de l'inventaire RP via callback
    $("#annexe_inventaire_ext .content").ajaxComplete(invCallback);

    //Refaire un coup de vérifications après déplacement d'un item
    $(".item.ui-draggable").mousedown(function(){
        $(document).mouseup(function() {
            $("#annexe_inventaire_ext .content").ajaxComplete(invCallback);
        });
    });

    //Bloquer/débloquer les consommables à l'ouverture d'un sac
    $(".zone_case7,.zone_case8,.zone_case9").click(function(){
        $("#zone_conteneurs_displayed").ajaxComplete(bagCallback); //Déclenchement de la callback une fois le sac chargé sur l'interface
    });

});


