// ==UserScript==
// @name         AvitoAppartPricePerSquareMeter
// @namespace    http://avito.apparts.custom.aleksvander.ru/
// @version      0.1а - just support search page
// @description  Show price per square meter for appartment on avito!
// @author       AleksVander
// @match        https://www.avito.ru/*/kvartiry/*
// @icon         https://www.google.com/s2/favicons?domain=avito.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434070/AvitoAppartPricePerSquareMeter.user.js
// @updateURL https://update.greasyfork.org/scripts/434070/AvitoAppartPricePerSquareMeter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    class Entity {
        constructor(item, price, size, priceItem) {
            this.item = item;
            this.price = price;
            this.size = size;
            this.priceItem = priceItem;
        }
    }

    window.onload = function(){
        var entities = calculateData();

        for (var x = 0; x < entities.length; x++) {
            var entity = entities[x];
            //            alert(entity.price);
            //alert(entity.size);
            entity.priceItem.innerHTML = entity.priceItem.innerHTML
                + '<span class="prise-for-size" style="color: red;"> - '
                + Math.round(entity.price / entity.size * 10) / 10
                + ' ₽</span>';
        }
    };


    function calculateData() {
        var entities = [];
//alert('start');
        var items = document.getElementsByClassName('iva-item-root-Nj_hb photo-slider-slider-_PvpN iva-item-list-H_dpX iva-item-redesign-nV4C4 iva-item-responsive-gIKjW items-item-My3ih items-listItem-Gd1jN js-catalog-item-enum');
        //console.log(items);
        for(var i = 0; i < items.length; i++) {
            var item = items[i];

            var itemName = item.getElementsByClassName('title-root-j7cja iva-item-title-_qCwt title-listRedesign-XHq38 title-root_maxHeight-SXHes text-text-LurtD text-size-s-BxGpL text-bold-SinUO');
            var rAreaSize =
                ((replaceNbsps(itemName[0].innerHTML)).match(/(\d+\,?\d*\s)\м²/)[1]).replace(',', '.');
            //alert('area size: ' + rAreaSize);

            var priceItem = item.getElementsByClassName('price-price-BQkOZ');
            var priceNode = priceItem[0].querySelector('[itemprop=price]');
            var rPrice = priceNode.getAttribute('content');
            //alert(rPrice);

            entities.push(new Entity(item, rPrice, rAreaSize, priceItem[0]));
        }

        return entities;
    }

    function replaceNbsps(str) {
        var result = str.replace(/&nbsp;/g, ' ');
        //console.log(result);
        return result;
    }

})();