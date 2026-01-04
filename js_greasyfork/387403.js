// ==UserScript==
// @name        Drive Intermarche Accessibilite TM
// @namespace   Naxedim & Yoldark
// @description Rajoute de l'accessibilité avec un lecteur d'écran sur le site du Drive intermarché en utilisant Tampermonkey...
// @include     https://drive.intermarche.com/*
// @author        Naxedim & Yoldark
// @version     1.3.3
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/387403/Drive%20Intermarche%20Accessibilite%20TM.user.js
// @updateURL https://update.greasyfork.org/scripts/387403/Drive%20Intermarche%20Accessibilite%20TM.meta.js
// ==/UserScript==

//be fully load to avoid error with plugins in need to jQuery
(function() {
    $(".search_button").attr('alt', 'Rechercher').html('Rechercher');
    $(".panier_count").append($('<button name="button">Aperçu du panier</button>'));

    $(".ajouter_panier").append($('<button name="button">Ajouter au panier</button>'));
    $(".supprime_panier").append($('<button name="button">Supprimer du panier</button>'));

    $.each($(".vignette_info"), function() {
        var elemMake = $(this).children('p:first');
        var make = $(elemMake).text();
        $(elemMake).empty().append('<h3>' + make + '</h3>');

        var elemName = $(this).children('p:last');
        var name = $(elemName).text();
        $(elemName).empty().append('<h4>' + name + '</h4>');
    });

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('input[type="checkbox"] { display: initial ! important; }');

    //Fix duplicate id problem on intermarché side
    var suiviCommandeCheckboxId = $($('.js-suivi_commande')[1]).attr('id');
    if (suiviCommandeCheckboxId !== undefined && suiviCommandeCheckboxId === 'suivi_commande') {
        $($('.js-suivi_commande')[1]).attr('id', 'suivi_commande_recap');
    }

    function cssCheckboxFix(identifier) {
        console.log(identifier);
        $(identifier).change(function() {
            if (this.checked) {
                $.each($(identifier), function() {
                    $(this).removeClass('off').addClass('on');
                    $(this).attr('checked', true);
                });
            } else {
                $.each($(identifier), function() {
                    $(this).removeClass('on').addClass('off');
                    $(this).attr('checked', false);
                });
            }
        });
    }

    $.each($(":checkbox"), function() {
        console.log($(this));
        //There is duplicated checkbox so we need to use the classes.
        var id = $(this).attr('id');
        console.log(id);
        var classNames = $(this).attr('class');
        console.log(classNames);
        var forceClass = false;
        if (classNames !== undefined) {
            //As this checkbox is in double in the checkout, we must use classes even if they got an id.
            forceClass = classNames.indexOf('js-suivi_commande') != -1 || classNames.indexOf('js-cgv_accept') != -1;
        }
        if (id !== undefined && !forceClass) {
            cssCheckboxFix('#' + $(this).attr('id'));
        } else {
            var classes = $(this).attr('class').split(' ');
            var classIdentifier;
            //Normaly i should take the first one but there is a checkbox where i need the second one as it is not built like the others
            for (var i = 0 ; i < classes.length ; i++) {
                if (classes[i].startsWith("js")) {
                    classIdentifier = classes[i];
                    break;
                }
            }
            cssCheckboxFix('.' + classIdentifier);
        }
        console.log('lol');
    });
})();