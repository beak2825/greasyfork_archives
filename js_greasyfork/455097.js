// ==UserScript==
// @name         Nepremicnine na m^2
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Calculates price per square meter
// @author       semrola
// @match        https://www.nepremicnine.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nepremicnine.net
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/455097/Nepremicnine%20na%20m%5E2.user.js
// @updateURL https://update.greasyfork.org/scripts/455097/Nepremicnine%20na%20m%5E2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.property-details').each(function(idx, el) {
        let price = $(el).find('meta[itemprop=price]');
        let priceValue = parseFloat(price.attr('content'));

        let size = $(el).find('ul li:first')
        let val = $(size).html();
        let sizeText = $(val)[1].data
        let sizeValue = parseFloat(sizeText.toString().replace('.','')) //?.replace(',', '.'))

        let m2 = $(el).find('h6').html().includes('m')

        //console.log('priceValue', priceValue, 'sizeValue', sizeValue, 'm2', m2)

        let ratio = 0;
        if (m2) {
            ratio = Math.round(priceValue * sizeValue)
        }
        else {
            ratio = Math.round(priceValue / sizeValue)
        }

        price.after('<span>' + ratio + ' €' + (!m2 ? '/m2':'') + '</span>')
    })


})();