// ==UserScript==
// @name         Cerca su IMDB
// @namespace    http://www.piratestreaming.black/film-aggiornamenti.php
// @version      0.5
// @description  Cerca su IMDB e avverti se c'è una nuova puntata delle tue serie tv preferite
// @author       You
// @match        http://www.imdb.com/find?ref_=nv_sr_fn&q=*&s=tt
// @match        http://www.imdb.com/title/*
// @match        http://www.piratestreaming.black/film-aggiornamenti.php
// @match        http://www.piratestreaming.black/serietv-aggiornamentii.php
// @match        http://www.piratestreaming.black/film-aggiornamenti.php?*
// @match        http://www.piratestreaming.black/categoria/*/*
// @match        http://www.italia-film.gratis/novita-streaming/*
// @match        http://www.italia-film.gratis/*
// @match        http://www.italia-film.gratis/novita-streaming/page/*/*
// @match        http://www.italia-film.gratis/category/*
// @match        http://www.italia-film.gratis/ultimi-telefilm-streaming/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27655/Cerca%20su%20IMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/27655/Cerca%20su%20IMDB.meta.js
// ==/UserScript==
(function() {
   'use strict';
    var titoli = $('div.featuredText > b > a, h3.entry-title > a'); //titoli film
    var sideBar = $('ul.sideNav > li > b > a, ul.sideNav > li > a, span.tvseries_name'); //titoli serie
    var titolo_serie = [];
    var serie_len = sideBar.length;
    var url = "";
    //cerca serie
    for(var i = 0; i < serie_len; i++){
        
        titolo_serie.push(sideBar[i].textContent);
        //Elenca serie tv preferite
        if(titolo_serie[i].includes("Pulsaciones")){
            alert("Pulsaciones");
        }
        
        if(titolo_serie[i].includes("Legion")){
            alert("Legion");
        }
        
        if(titolo_serie[i].includes("Doubt")){
            alert("Doubt");
        }
        
        if(titolo_serie[i].includes("Imposters")){
            alert("Imposters");
        }
        
        if(titolo_serie[i].includes("SS GB")){
            alert("SS GB");
        }
        
        if(titolo_serie[i].includes("The Americans")){
            alert("The Americans");
        }
        
        if(titolo_serie[i].includes("Feud")){
            alert("Feud");
        }
    }
    //cerca film su imdb
    titoli.click(function(){
        var testo = $(this).text();
        var testo1 = "";
        if(testo.endsWith("Sub ita")){
            testo1 = testo.replace("Sub ita", "");
        } else {
            testo1 = testo;
        }
        url = "http://www.imdb.com/find?ref_=nv_sr_fn&q=" + testo1 + "&s=tt";
        window.open(url);
    });
    //apri pagina film su imdb
    var risultati = $('td.result_text > a');
    var titolo = risultati[0].getAttribute("href");
    url = "http://www.imdb.com" + titolo;
    window.open(url, "_self");
    //Aggiorna
    window.setTimeout(function(){location.reload();}, 60000 );
})();