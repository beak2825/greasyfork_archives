// ==UserScript==
// @name        Voyages-SNCF Mon Forfait Annuel
// @namespace   http://userscripts.org/users/useridnumber
// @include     https://monforfaitannuel.voyages-sncf.com/mnf/account/*
// @version     1
// @description Ce script est utile pour les abonné SNCF "Mon Forfait Annuel" et qui sont amené à utiliser l'outil de réservation en ligne sur le site Voyage-SNCF.com. Ce script permet d'améliorer l'expérience utilisateur notamment en gommant quelques aspects trop contraignants de l'interface.
// @downloadURL https://update.greasyfork.org/scripts/14831/Voyages-SNCF%20Mon%20Forfait%20Annuel.user.js
// @updateURL https://update.greasyfork.org/scripts/14831/Voyages-SNCF%20Mon%20Forfait%20Annuel.meta.js
// ==/UserScript==

var updateAll = function updateAll () {
    var items = {};
    var selects = $('select[id$=Station]');
    selects.children('option').each(function(_, e) {
        items[e.value] = e.innerHTML;
    });
    selects.each(function (_, e) {
        var k;
        $(e).unbind('change');
        for (k in items) {
            if ($(e).children('option[value=' + k + ']').length === 0) {
                $(e).append('<option value="' + k + '"' + (e.value === k ? 'selected="selected"':'') + '>' + items[k] + '</option>');
            }
        }
    });
}

$(window).load(updateAll);