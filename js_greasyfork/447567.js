// ==UserScript==
// @name        Commune Paris - Liste des Frequences Radios - Choisir Tri par Frequences ou Noms
// @author      decembre
// @namespace   https://greasyfork.org/fr/users/8-decembre 

// @description Un click pour changer l'ordre de la Liste des Fréquences Radios...

// @include     https://www.commune-mairie.fr/frequence-radio*

// @version     01.00
// @grant       none
// @require     https://greasyfork.org/scripts/12036-mutation-summary/code/Mutation%20Summary.js?version=70722
// @require     https://greasyfork.org/scripts/5844-tablesorter/code/TableSorter.js
// 
// @license     unlicense

// FROM : Metal Archives (discography pages) - Reviews column split and sortable tables
// BY darkred
// https://greasyfork.org/fr/scripts/5751-metal-archives-discography-pages-reviews-column-split-and-sortable-tables/code

// This userscript uses jQuery UI, the jQuery plugin 'tablesorter' (forked by Rob Garrison (Mottie)) http://mottie.github.io/tablesorter/docs/index.html
// and the JavaScript library 'Mutation Summary' (https://github.com/rafaelw/mutation-summary) (by Rafael Weinstein)
//
// @namespace rikkie
// @downloadURL https://update.greasyfork.org/scripts/447567/Commune%20Paris%20-%20Liste%20des%20Frequences%20Radios%20-%20Choisir%20Tri%20par%20Frequences%20ou%20Noms.user.js
// @updateURL https://update.greasyfork.org/scripts/447567/Commune%20Paris%20-%20Liste%20des%20Frequences%20Radios%20-%20Choisir%20Tri%20par%20Frequences%20ou%20Noms.meta.js
// ==/UserScript==

// TEST for <table class="author-styles">
// TEST SELECTOR
// http://mottie.github.io/tablesorter/docs/example-option-selectorsort.html

  // call the tablesorter plugin
  $("table").tablesorter({
	  		cssAsc: 'up',
			cssDesc: 'down',
            selectorSort : 'th',
            sortInitialOrder: "desc",
			widgets: ["zebra"],
			widgetOptions: {
			zebra: ["odd","even"]
}

});



// CSS rules in order to show 'up' and 'down' arrows in each table header
var stylesheet = `
<style>
#tablex>thead>tr.tablesorter-headerRow{
    background-repeat: no-repeat !important;
    background-position: right center;
}
#tablex>thead>tr.tablesorter-headerRow th.up {
    position: relative !important;
    line-height: 25px !important;
    height: 25px !important;
    top: 0 !important;
    right: 0px !important;
    padding-right: 0px !important;
    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
    background-color: red !important;
    background-repeat: no-repeat !important;
    background-position: center 15px !important;
}
#tablex>thead>tr.tablesorter-headerRow th.down {
    position: relative !important;
    line-height: 25px !important;
    height: 25px !important;
    top: 0 !important;
    right: 0px !important;
    padding-right: 0px !important;
    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
    background-color: red !important;
    background-repeat: no-repeat !important;
    background-position: center 15px !important;
}

</style>`;


$('head').append(stylesheet);