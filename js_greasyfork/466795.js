// ==UserScript==
// @name         Meldeliste meldeportal.rudern.de
// @namespace    MeldelisteMeldeportal
// @version      0.3
// @description  Alle Meldungen, sowie gemeldete Sportler als Liste darstellen
// @author       Markus Schlick
// @match        https://meldeportal.rudern.de/regattas/*/my-entries*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.10
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js
// @resource REMOTE_CSS https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/css/theme.default.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466795/Meldeliste%20meldeportalrudernde.user.js
// @updateURL https://update.greasyfork.org/scripts/466795/Meldeliste%20meldeportalrudernde.meta.js
// ==/UserScript==

    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);

$(document).ready(function() {
    'use strict';

    var table = $('<table>').addClass('tablesorter1');
        var row = $('<thead>').addClass('titel').html('<tr><td>RennNr.</td><td>Bezeichnung</td><td>Bootsname</td><td>Alternative</td><td>Sportler 1</td><td>Sportler 2</td><td>Sportler 3</td><td>Sportler 4</td><td>Sportler 5</td></tr>');
    table.append(row);

    table.append('<tbody>');

    // Tabelle der Sportler
    var table2 = $('<table>').addClass('tablesorter2');
        var row2 = $('<thead>').addClass('titel').html('<tr><td>RennNr.</td><td>Bezeichnung</td><td>Sportler</td></tr>');
    table2.append(row2);

    table2.append('<tbody>');

var i = 0;
    $( ".card" ).each(function( index, element ) {
        i = i+1;
        var RennNr = $( this ).find("[data-event-number]").text();
        var Bezeichnung = $( this ).find(".event-code").contents().get(1).nodeValue;
        var Bootsname = $( this ).find(".card-title").text();
        var Alternative = $( this ).find("span:contains('Alternative zu')").text();
        var Sportler1 = $( this ).find(".fw-bold:eq(0)").text().trim().replace("()", '');
            var row2 = $('<tr>').addClass('bar').html('<td>'+RennNr+'</td><td>'+Bezeichnung+'</td><td>'+Sportler1+'</td>');
        table2.append(row2);
        var Text2 = $( this ).find(".fw-bold:eq(1)").text().trim().replace("()", '');
        
        if(false) // TODO: Prüfe auf Trainer
            var Sportler2 = '';
        else {
            var Sportler2 = Text2;
            if(Text2!=''){
                var row2 = $('<tr>').addClass('bar').html('<td>'+RennNr+'</td><td>'+Bezeichnung+'</td><td>'+Text2+'</td>');
        table2.append(row2);
            }
        }
        var Text3 = $( this ).find(".fw-bold:eq(2)").text().trim().replace("()", '');
        if(false) // TODO: Prüfe auf Trainer
            var Sportler3 = '';
        else {
            var Sportler3 = Text3;
            if(Text3!=''){
            var row2 = $('<tr>').addClass('bar').html('<td>'+RennNr+'</td><td>'+Bezeichnung+'</td><td>'+Text3+'</td>');
        table2.append(row2);
            }
        }
        var Text4 = $( this ).find(".fw-bold:eq(3)").text().trim().replace("()", '');
        if(false) // TODO: Prüfe auf Trainer
            var Sportler4 = '';
        else {
            var Sportler4 = Text4;
            if(Text4!=''){
            var row2 = $('<tr>').addClass('bar').html('<td>'+RennNr+'</td><td>'+Bezeichnung+'</td><td>'+Text4+'</td>');
        table2.append(row2);
            }
        }
        var Text5 = $( this ).find(".fw-bold:eq(4)").text().trim().replace("()", '');
        if(false) // TODO: Prüfe auf Trainer
            var Sportler5 = '';
        else {
            var Sportler5 = Text5;
            if(Text5!=''){
            var row2 = $('<tr>').addClass('bar').html('<td>'+RennNr+'</td><td>'+Bezeichnung+'</td><td>'+Text5+'</td>');
        table2.append(row2);
            }
        }
        var Link = $( this ).find(".btn-link").attr('href');
        if(Link != '') Link = '<a href="'+Link+'">'+Bezeichnung+'</a>';
        else Link = Bezeichnung;

        var row = $('<tr>').addClass('bar').html('<td>'+RennNr+'</td><td>'+Link+'</td><td>'+Bootsname+'</td><td>'+Alternative+'</td><td>'+Sportler1+'</td><td>'+Sportler2+'</td><td>'+Sportler3+'</td><td>'+Sportler4+'</td><td>'+Sportler5+'</td>');
        table.append(row);
    });

    table.append('</tbody>');
    table2.append('</tbody>');


$('.page-content').prepend(table2);
$('.page-content').prepend("<h1>Auflistung der Sportler</h1>");
$('.page-content').prepend(table);
$('.page-content').prepend("<h1>Auflistung der Rennen</h1>");

    $(".tablesorter1").tablesorter({
    theme : 'default',
    sortList: [[0,0]]
  });
    $(".tablesorter2").tablesorter({
    theme : 'default',
    sortList: [[2,0],[0,0]]
  });
});
