// ==UserScript==
// @name         Extract Mots clés
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       You
// @match        https://app.seobserver.com/campaigns/rankings/*/detail_per_site/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378998/Extract%20Mots%20cl%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/378998/Extract%20Mots%20cl%C3%A9s.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $view = $('#ViewContent');
    $view.find('table:first').attr('id', 'kwdPos');
    var $tabPos = $('#kwdPos');

    var posMoy = [];
    var tabFinal = [];

    $tabPos.find('tbody').find('tr:not(:first)').each(function (index, element) {
        var $this = $(this);

        var kwd = $this.find('td:first').text().trim();
        var volume = parseInt($this.find('.campaign_columns:first').text().replace(',', ''));
        if(isNaN(volume)) volume = 10;

        var first = parseInt($this.find('.active:first').text());
        if (isNaN(first)) first = 100;
        var last = parseInt($this.find('td:last').text());
        if (isNaN(last)) last = 100;
        $this.find('td').each(function(index,element){
            if(index>3){
                var pos = parseInt($this.find('td').eq(index).text());
                if(isNaN(pos)) pos = first;
                posMoy.push(pos);
            }
        })
        var total = posMoy.reduce((a,b)=> a + b,0);
        var long = posMoy.length;
        var moy = Math.round(total / long);
        var evo = first - moy;
        tabFinal.push({"kwd":kwd,"vol":volume,"posF":first,"posL":last,"moy":moy,"evo":evo});

        posMoy = [];

    });

    console.table(tabFinal);
    console.log(tabFinal);

    var html = '';
    //html += '<textarea id="resultat" rows="10" style="width:80%;display: block;margin: auto;">';
    html += '<table id="resultat" style="width:80%;margin: 0px auto 60px auto;"><thead><tr><th>Position Début</th><th>Mots Clés</th><th>Position Fin</th><th>Moyenne Position</th><th>Évolution</th><th>Volume</th></tr><tbody>';
    for(var k = 0; k<tabFinal.length;k++){
        html += '<tr>';
        html += '<td>' + tabFinal[k].posF + '</td>';
        html += '<td>'+tabFinal[k].kwd + '</td>';
        html += '<td>'+tabFinal[k].posL + '</td>';
        html += '<td>'+tabFinal[k].moy + '</td>';
        html += '<td>'+tabFinal[k].evo + '</td>';
         html += '<td>' + tabFinal[k].vol + '</td>';
        html += '</tr>';
    }
    html += "</tbody></table>";
    //html += "\n</textarea>";

    $('body').append(html);


})();