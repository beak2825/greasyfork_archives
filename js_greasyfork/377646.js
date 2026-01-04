// ==UserScript==
// @name         SensCritique : Liste des ID produits
// @namespace    sc-products-id
// @version      0.1.1
// @description  Afficher les ids des produits sur la page des résultats de la recherche.
// @author       Emilien
// @match        https://old.senscritique.com/recherche*
// @grant        none
// @icon		     https://www.senscritique.com/favicon-32x32.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/377646/SensCritique%20%3A%20Liste%20des%20ID%20produits.user.js
// @updateURL https://update.greasyfork.org/scripts/377646/SensCritique%20%3A%20Liste%20des%20ID%20produits.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $('.esco-item').each(function(index) {
    const pid = $(this).attr('data-sc-product-id');
    $(this).find('.erra-main').prepend(`<span style="font-size: 13px;background-color: #f7f1ad;padding: 4px;font-family: consolas;color: #656565;margin: 5px 0 0 -70px;position: absolute;">${pid}</span>`);
  });

})();