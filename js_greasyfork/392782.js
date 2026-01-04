// ==UserScript==
// @name        OCS : Recherche SensCritique
// @namespace   ocs-recherche-senscritique
// @version     0.1.1
// @description Permet de rechercher rapidement un produit sur SensCritique.
// @author      Emilien
// @match       https://www.ocs.fr/programme/*
// @match       https://ocs.fr/programme/*
// @grant       none
// @icon        https://www.ocs.fr/themes/ocs/img/favicons/favicon.ico
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392782/OCS%20%3A%20Recherche%20SensCritique.user.js
// @updateURL https://update.greasyfork.org/scripts/392782/OCS%20%3A%20Recherche%20SensCritique.meta.js
// ==/UserScript==



this.$ = this.jQuery = jQuery.noConflict(true);

/* ****************************************
 * CSS
 ******************************************/

injectStyles(`
  .search-button {
    padding: 12px 16px;
    border-radius: 2px;
    background-color: #509be6 !important;
    color: white !important;
    font-family: sans-serif;
    font-weight: normal;
    font-size: 16px;
    cursor: pointer;
    margin-top: -50px;
    position: absolute;
    text-transform: none;
  }
`);

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
}

/* ****************************************
 * FONCTIONNEMENT DU SCRIPT
 ******************************************/

var url = "https://www.senscritique.com/recherche?query=";

console.log();

var title = dataLayer[0].title;
var type = dataLayer[0].contenu_category;
var director = $.trim($('span.head:contains("Réalisateur")').parent().contents()[1].textContent);

var filter;

switch(type) {
  case 'film':
    filter = '&filter=movies';
  break;
  default:
    filter = '&filter=tvshows';
  break;
}

if(!director) {
  director = '';
 }

$('h1 span').prepend(`<a href="${url}${title} ${director}${filter}" target="_blank" class="search-button">Recherche sur SensCritique</a>`);
