// ==UserScript==
// @name        Prime : Recherche SensCritique
// @namespace   prime-recherche-senscritique
// @version     0.1.6
// @description Permet de rechercher rapidement un produit sur SensCritique.
// @author      Emilien
// @match       https://www.primevideo.com/detail/*
// @match       https://primevideo.com/detail/*
// @grant       none
// @icon        https://images-na.ssl-images-amazon.com/images/G/01/digital/video/DVUI/favicons/favicon._CB527404570_.png
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/392784/Prime%20%3A%20Recherche%20SensCritique.user.js
// @updateURL https://update.greasyfork.org/scripts/392784/Prime%20%3A%20Recherche%20SensCritique.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/* ****************************************
 * CSS
 ******************************************/

injectStyles(`
  .search-button {
    padding: 12px 18px;
    margin-bottom: 20px;
    border-radius: 2px;
    background-color: #509be6 !important;
    color: white !important;
    font-family: sans-serif;
    font-weight: normal;
    cursor: pointer;
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

var url = "https://old.senscritique.com/recherche?query=";

var title = $('._3I-nQy').html();
var type = $('._36qUej').html().split(' ')[0];
var director = $('span:contains("Réalisation")').parents(1).find('dd a:first').html();
var filter;

switch(type) {
  case 'Saison':
    filter = '&filter=tvshows';
  break;
  default:
    filter = '&filter=movies';
  break;
}

if(!director) { director = ''; }
if(!filter) { filter = ''; }

$('.av-detail-section').prepend(`<a href="${url}${title} ${director}${filter}" target="_blank" class="search-button">Recherche sur SensCritique</a>`);
















