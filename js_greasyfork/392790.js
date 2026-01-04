// ==UserScript==
// @name         Netflix : Recherche SensCritique
// @namespace    netflix-recherche-senscritique
// @version      0.1
// @description  Permet de recherche les produits sur SensCritique
// @author       Emilien
// @match        https://www.netflix.com/title/*
// @grant        none
// @run-at       document-idle
// @icon         https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392790/Netflix%20%3A%20Recherche%20SensCritique.user.js
// @updateURL https://update.greasyfork.org/scripts/392790/Netflix%20%3A%20Recherche%20SensCritique.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Récupération des données du produit
    var keywords = {};
    keywords.title = $('.title .logo').attr('alt');

    if($('.meta .duration').html().indexOf('saison') > -1) {
      keywords.filter = "tvshows";
    } else {
      keywords.filter = "movies";
    }

    var search_url = `https://www.senscritique.com/recherche?query=${keywords.title}&filter=${keywords.filter}`;
    $('.jawBone').prepend(`<a href="${search_url}" target="_blank" class="search-button">Recherche sur SensCritique</a>`);

    /* ****************************************
     * CSS
     ******************************************/

    injectStyles(`
      .search-button {
        line-height: 35px;
        height: 35px;
        width: 242px;
        text-align: right;
        padding: 0 20px 0 0;
        border-radius: 4px;
        background-color: #0ad06f !important;
        color: white !important;
        font-family: sans-serif;
        font-weight: normal;
        font-size: 16px;
        cursor: pointer;
        text-transform: none;
        margin: 10px 0 30px 0;
        display: block;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABX0lEQVRIidWVPS9EQRSG39HZFdFaEZ21hULiIyjUq5KoNSKiUygU/oHQ2IbCfxA2JDSa9QcURDZCgk0ohEh8JDwKR8LN7ubcGyJOM7kz73nec2bmZqT/HiGOGOiVNCYpJyklqSJpX9JGCOE+cRVAG7DNRzwDh8ABcGVzN8BUUniXgW6BWaA5st4H7JrRUlx4GjgBLoFsHV0Als1kMo7BAvAGDDu0AdgDrqNd1ks6BYoxChqwLiY84g4TT8cwCEAFWP+ca6ijb7Xx3GsQQkDSmaSMx+DRxrTXwKJJ0oPHoCzpRVK/lwy0SMpKOvImFO2Kppz6OTu3Hq/BEPAKrDq0OeAO2HTBLSkAJatqDah6HsCI3Z4LIFNNUwteMHjJOqkAi8A4kAdmgB37GY+BziTwgn0PAlvAE9+jDMwDjYnhkfUU0G2G7S5oBL7yZc9jvRd/BzeD0Vrb8pMm+V+D/9t4B4NetUMoquRwAAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        background-position: 10px 50%;
      }
    `);

    function injectStyles(rule) {
      var div = $("<div />", {
        html: '&shy;<style>' + rule + '</style>'
      }).appendTo("body");
    }

    console.log(keywords);
    console.log('Script chargé avec succès.');
})();