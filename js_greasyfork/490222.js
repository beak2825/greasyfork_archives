// ==UserScript==
// @name         Muambeiro Calculator
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Obtém os valores encontrados em <div class="promocao-item-preco-text"> e multiplica por 1.2.
// @author       Lucas S.
// @match        https://*comprasparaguai.com.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490222/Muambeiro%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/490222/Muambeiro%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function displayAdjustedPrices() {
        document.querySelectorAll('div.promocao-item-preco-text').forEach(function(element) {
            // Verifica se o preço ajustado já foi adicionado
            if (element.getAttribute('data-price-adjusted')) return;

            const priceText = element.textContent;
            const numericValueMatch = priceText.match(/(\d+(?:\.\d{3})*),(\d{2})/);
            if (numericValueMatch) {
                const numericValue = parseFloat(numericValueMatch[1].replace(/\./g, '') + '.' + numericValueMatch[2]);
                const adjustedPrice = numericValue * 1.2;

                const adjustedPriceFormatted = adjustedPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 2
                });

                const adjustedPriceElement = document.createElement('div');
                adjustedPriceElement.style.marginTop = '5px';
                adjustedPriceElement.textContent = `📦 ${adjustedPriceFormatted}`;
                adjustedPriceElement.style.fontWeight = 'bold';
                adjustedPriceElement.style.color = 'green';

                element.parentNode.insertBefore(adjustedPriceElement, element.nextSibling);
                element.setAttribute('data-price-adjusted', 'true'); // Marca o elemento como processado
            }
        });
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) displayAdjustedPrices();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
