// ==UserScript==
// @name         Canarias Online
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Test
// @author       AET
// @match        https://www.pccomponentes.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372987/Canarias%20Online.user.js
// @updateURL https://update.greasyfork.org/scripts/372987/Canarias%20Online.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // PROPIEDADES GENERALES

    var re_price = /(\d+)(,\d+)/;
    var IVA_TO_IGIC_RATIO = 0.88429752066115702479338842975207;

    /*
    BLOQUES CON LISTAS DE ARTÍCULOS (MICROCARTAS)
    */
    // waitForKeyElements('.cn__content-container', micro_cards);

    /*
    PÁGINAS DE LISTA DE ARTÍCULOS (CARTAS)
    */
    var items = $('.tarjeta-articulo');
    items.each(function() {
        let item = $(this);
        let data = item.find('.GTM-productClick.enlace-disimulado');

        let price_iva = parseFloat(data.data('price'));
        let price_igic = price_iva * IVA_TO_IGIC_RATIO;

        let price_text = price_igic.toFixed(2).replace('.', ',');
        let price_text_match = re_price.exec(price_text);
        let price_text_base = price_text_match[1];
        let price_text_cents = price_text_match[2];

        let price_tag = item.find('.tarjeta-articulo__precio-actual');
        price_tag.contents().filter(function() {
            return this.nodeType == 3
        }).each(function() {
            this.textContent = price_text_base;
        });
        price_tag.find('.small').text(price_text_cents + ' €');

        let price_tag_discount = item.find('.tarjeta-articulo__pvp');
        if (price_tag_discount.length > 0) {
            let price_iva_original = parseFloat(price_tag_discount
                .find('meta[itemprop="price"]').attr('content'));
            let price_igic_original = price_iva_original * IVA_TO_IGIC_RATIO;
            let price_text = price_igic_original.toFixed(2).replace('.', ',');
            price_tag_discount.find('span').text(price_text);
        }


    });

    /*
    PÁGINAS DE ARTÍCULOS INDIVIDUALES
    */
    if (items.length === 0) {
        var PRICE_BLOCK = $('.priceBlock');

        // Cálculo de precios
        var price_iva = parseFloat(PRICE_BLOCK.data('price'));
        var price_iva_original = parseFloat(PRICE_BLOCK.data('baseprice'));
        var price_igic = price_iva * IVA_TO_IGIC_RATIO;
        var price_igic_original = price_iva_original * IVA_TO_IGIC_RATIO;

        // Creación de cadenas formateadas
        var price_text = price_igic.toFixed(2).replace('.', ',');
        var price_text_match = re_price.exec(price_text);
        var price_text_base = price_text_match[1];
        var price_text_cents = price_text_match[2];

        // Reemplazo de valores en el bloque de precios (artículo)
        $('.baseprice').first().text(price_text_base);
        var price_igic_original_text = price_igic_original.toFixed(2).replace('.', ',');
        $('.original-price-nodiscount').first().text(price_igic_original_text);
        $('.precio-no-iva').find('span.title').text('Sin IGIC');

        // Reemplazo de valores en la barra de precios
        var PRICE_BAR = $('.priceBlock.pull-xs-right');
        var PRICE_BAR_MAIN = PRICE_BAR.find('.precioMain.h1');
        var PRICE_BAR_ORIGINAL = PRICE_BAR.find('.precio').first();
        PRICE_BAR_MAIN.contents().filter(function() {
            return this.nodeType == 3
        }).each(function() {
            this.textContent = price_text_base;
        });

        if (price_text_cents !== '00') {
            $('.cents').first().text(price_text_cents);
            if (PRICE_BAR_MAIN.find('.cents') === 0) {
                PRICE_BAR_MAIN.find('.euro').before('<span class="cents"></span>');
            }
            PRICE_BAR_MAIN.find('.cents').text(price_text_cents);
        }
        PRICE_BAR_ORIGINAL.find('del').text(price_igic_original_text);
    }
})();