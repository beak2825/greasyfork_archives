// ==UserScript==
// @name         IKEA Baia Mare Order Helper
// @namespace    https://github.com/janosrusiczki/ikea-baia-mare
// @version      0.3
// @description  Adds a button to IKEA Romania product pages which when pressed copies some data to the clipboard. This data can then be used in Google Sheets.
// @author       Janos Rusiczki
// @match        https://www.ikea.com/ro/ro/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikea.com
// @require      https://code.jquery.com/jquery-3.6.3.min.js#sha256=a6f3f0faea4b3d48e03176341bef0ed3151ffbf226d4c6635f1c6039c0500575
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/waitForKeyElements.js#sha256=fe967293ad8e533dd8ad61e20461c1fe05d369eed31e6d3e73552c2231b528da
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/461134/IKEA%20Baia%20Mare%20Order%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461134/IKEA%20Baia%20Mare%20Order%20Helper.meta.js
// ==/UserScript==

/* globals $, waitForKeyElements */

(function() {
    'use strict';

    waitForKeyElements(".js-buy-module.pip-buy-module:not(.pip-buy-module--initially-hidden)", actionFunction);

    function actionFunction(jNode) {
        jNode.after('<div class="pip-buy-module__buttons--container"><button type="button" class="pip-btn pip-btn--emphasised" id="inserted-button" style="display: block; margin: auto;"><span class="pip-btn__inner"><span class="pip-btn__label">Copiază pentru spreadsheet</span></span></button></div></div>');
        $('#inserted-button').click(copyDataToClipboard);
    };

    function copyDataToClipboard() {
        var productIdentifier = firstTextTrim('.pip-product-identifier__value');
        var title = firstTextTrim('.pip-header-section__title--big.notranslate');
        var description = `${firstTextTrim('.pip-header-section__description-text')} ${firstTextTrim('.pip-link-button.pip-header-section__description-measurement')}`.trim();
        var price = `${firstTextTrim('.pip-temp-price__integer')}.${firstTextTrim('.pip-temp-price__decimal').replace(/\D/g,'')}`;
        var theString = `${productIdentifier}\t${calculateWeight()}\t${title}\t${description}\t${price}`;
        console.log(theString);
        GM_setClipboard(theString);
    };

    function calculateWeight() {
        var totalWeight = 0;
        $(".pip-product-dimensions__measurement-wrapper:contains('Greutate')").each(function() {
            totalWeight += parseFloat($(this).text().replace(/[^.\d]/g, ''));
        });
        return totalWeight;
    }

    function firstTextTrim(selector) {
        return $(selector).first().text().trim();
    }
})();
