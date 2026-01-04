// ==UserScript==
// @name         Favoritos mercadolivre (Ordenar por preço)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Organiza a lista de itens salvos como favoritos por preço ascendente.
// @author       edmesmo
// @match        https://myaccount.mercadolivre.com.br/bookmarks/list
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392786/Favoritos%20mercadolivre%20%28Ordenar%20por%20pre%C3%A7o%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392786/Favoritos%20mercadolivre%20%28Ordenar%20por%20pre%C3%A7o%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => $('<button style="vertical-align: middle; margin-left: 2rem" class="andes-button bf-ui-button andes-button--medium andes-button--quiet">Ordenar por Preço</button>').click(() => {
        var lista = $('.ui-list');
        var items = lista.children();
        items.sort((a,b) => {
            var aPreco = $(a).find('.price-tag-fraction').text().trim();
            var bPreco = $(b).find('.price-tag-fraction').text().trim();

            return parseInt(aPreco, 10) > parseInt(bPreco, 10) ? 1 : -1;
        });
        items.detach().appendTo(lista);
    }).appendTo('.ui-bookmarks-list-desktop__title'), 1000)
})();