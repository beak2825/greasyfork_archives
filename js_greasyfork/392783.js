// ==UserScript==
// @name        Canal+ : Recherche SensCritique
// @namespace   canal-recherche-senscritique
// @version     0.1.2
// @description Permet de rechercher rapidement un produit sur SensCritique.
// @author      Emilien
// @match       https://www.canalplus.com/*
// @match       https://canalplus.com/*
// @grant       none
// @icon        https://www.canalplus.com//apple-touch-icon.png
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392783/Canal%2B%20%3A%20Recherche%20SensCritique.user.js
// @updateURL https://update.greasyfork.org/scripts/392783/Canal%2B%20%3A%20Recherche%20SensCritique.meta.js
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
    margin-bottom: 20px;
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

setInterval(function()
{

  if($('.search-button').is(':visible')) {
    return;
  } else {
      var url = "https://www.senscritique.com/recherche?query=";
      var title = $("h1[class*='bodyTitle']").html();
      var type = $("span[class*=meta__title]").html().split(' ')[0];
      var director = $("span[class*='personnalities__links']:first").find('a:first').html();
      var filter;

      switch(type) {
          case 'Film':
              filter = '&filter=movies';
              break;
          default:
              filter = '&filter=tvshows';
              break;
      }

      if(!director) {
          director = '';
      }

    $('h1[class*="bodyTitle"]').before(`<a href="${url}${title} ${director}${filter}" target="_blank" class="search-button">Recherche sur SensCritique</a>`);
  }

}, 200);











