// ==UserScript==
// @name        Affiche les Pseudo sur l'ile
// @namespace   ika-Ville
// @author      TriplexXx
// @description Afficher le Pseudo du joueur dans la vue de l'île
// @include     http://s*.ikariam.gameforge.com/*
// @include     https://s*.ikariam.gameforge.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29257/Affiche%20les%20Pseudo%20sur%20l%27ile.user.js
// @updateURL https://update.greasyfork.org/scripts/29257/Affiche%20les%20Pseudo%20sur%20l%27ile.meta.js
// ==/UserScript==


$(document).ready(function () {
    console.log('tEST');
    $("a[id^=js_cityLocation][id$=Link]").each(function (index) {
        var data = ikariam.getScreen().data.cities[index];
        if (data.id == -1)
            return;
        var id = "islandTooltip" + index;
        var tooltip = $('<div id="' + id + '" class="infoTip"></div>');
        tooltip.css('padding', 3);
        var text = data.ownerName;
        if (data.ownerAllyTag)
            text += ' (' + data.ownerAllyTag + ')';
        tooltip.html('<nobr>' + text + '</nobr>');
        tooltip.offset({top: 20, left: 85});
        $(this).append(tooltip);
    });
});

$(document).ajaxSuccess(function (event, xhr, settings) {
  $('.infoTip.selected').css({'background-color': '#FAE0AE', 'color': '#542C0F'})
  var selected = $('.cityLocation.selected .infoTip')
  selected.css({'background-color': '#542C0F', 'color': '#FFDC26'}).addClass('selected');

});