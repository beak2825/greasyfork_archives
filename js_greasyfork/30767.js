
// ==UserScript==
// @name        Chuckold Online Users
// @namespace   chk
// @include     https://thecuckold.com/online.php
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version     1.2
// @grant       none
// @description:it Visualizzare solo alcune categorie di utenti tra quelli online sul sito thechuckold.com. 
// @description Visualizzare solo alcune categorie di utenti tra quelli online sul sito thechuckold.com.
// @downloadURL https://update.greasyfork.org/scripts/30767/Chuckold%20Online%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/30767/Chuckold%20Online%20Users.meta.js
// ==/UserScript==

//https://thecuckold.com/genere/3.jpg
this.$ = this.jQuery = jQuery.noConflict(true);
var regioni =["Tutte","Sicilia", "Piemonte", "Marche", "Valle_d_Aosta", "Toscana", "Campania", "Puglia", "Veneto", "Lombardia", "Emil Romag", "Trentino_Alto_Adige", "Sardegna", "Molise", "Calabria", "Abruzzo", "Lazio", "Liguria", "Friuli_Venezia_Giulia", "Basilicata", "Umbria"]
var regioni_html =["Tutte","Sicilia", "Piemonte", "Marche", "Valle d'Aosta", "Toscana", "Campania", "Puglia", "Veneto", "Lombardia", "Emilia Romagna", "Trentino Alto Adige", "Sardegna", "Molise", "Calabria", "Abruzzo", "Lazio", "Liguria", "Friuli Venezia Giulia", "Basilicata", "Umbria"]
var categorie_html =["Tutte","Aspirante chuck","Coppia con lui Chuck passivo","Coppia con lui Chuck attivo","Bull (singolo)","Bull (lui di coppia)","Sweet (singola)","Sweet (lei di coppia)","Voyeur","Coppia esibizionista","Coppia esibizionista-scambista","Lesbica","Coppia irregolare"]
var categorie = ["Tutte","/1.jpg","/2.jpg","/11.jpg","/3.jpg","/8.jpg","/4.jpg","/12.jpg","/5.jpg","/6.jpg","/10.jpg","/7.jpg","/20.jpg"]
var selected_regione="Tutte";
var selected_categoria="Tutte";


$(document).ready(function()
{
    var regioni_select =$("div#centrale_zop").prepend($('<select>').attr({'name':'regione_select','id':'regione_select'}))
    regioni_select.on('change', '#regione_select', function(event){  change(event);});
    for (var x=0; x<regioni.length; x++ ) {
        $('<option>').attr({'value':regioni[x]}).html(regioni_html[x]).appendTo('#regione_select');
    }
    var categoria_select =$("div#centrale_zop").prepend($('<select>').attr({'name':'categoria_select','id':'categoria_select'}))
    categoria_select.on('change', '#categoria_select', function(event){  change(event);});
    for (var x=0; x<categorie_html.length; x++ ) {
        $('<option>').attr({'value':categorie[x]}).html(categorie_html[x]).appendTo('#categoria_select');
    }
});

function change(event){    
    var value = event.target.value;  //console.log(regione)
    var id =event.target.id;
    var n;
    if(id=="regione_select"){
        n = regioni.indexOf(value);
        if(n>-1)         
        selected_regione=value;        
    }    
    else if(id=="categoria_select"){
        n =categorie.indexOf(value)
        if(n>-1) {
            selected_categoria=value;
            //console.log(selected_categoria)
        }
    }
    var allspans = $("span.stile17")
    allspans.each(function( index ) {   $( this ).parent().css( "display", "block" ); });
    var alldivs = $("img.media")
    alldivs.each(function( index ) {    $( this ).parent().css( "display", "block" ); }); 
    
    if(selected_regione!="Tutte"){
          var spans =$("span.stile17:not(:contains("+selected_regione+")) ")
          spans.each(function( index ) {
          $( this ).parent().css( "display", "none" );
          //console.log( index);
          });
        }     
     if(selected_categoria!="Tutte"){
          var divs = $("img.media:not([src$='"+selected_categoria+"'])")
          divs.each(function( index ) {
          $( this ).parent().css( "display", "none" );
           //console.log( index);
          });
     }    
  
}