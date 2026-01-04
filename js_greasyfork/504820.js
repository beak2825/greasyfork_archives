// ==UserScript==
// @name         Mercado Livre: Cart Enhanced
// @version      0.2
// @description  Serie de melhorias na QOL do Mercado Livre
// @author       Luiz Gustavo (NiceATC)
// @match        https://www.mercadolivre.com.br/gz/cart/v2
// @grant        none
// @namespace https://greasyfork.org/users/28820
// @downloadURL https://update.greasyfork.org/scripts/504820/Mercado%20Livre%3A%20Cart%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/504820/Mercado%20Livre%3A%20Cart%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addStyle = (styles) => {
        const style = document.createElement('style');
        style.innerHTML = styles;
        document.head.appendChild(style);
    };

    const handleGratisElements = () => {
        document.querySelectorAll('.ticket-row__right-column[data-js="right-column"]').forEach((rightColumn) => {
            const spanElement = rightColumn.querySelector('span[data-js="rich-text"]');
            const ticketRow = rightColumn.closest('.ticket-row');

            //if (spanElement && spanElement.classList.contains('bf-ui-rich-text--success')) { <--- MELI+
            if (spanElement && spanElement.classList.contains('rich-text--success')) {
                ticketRow.style.display = 'none';
                ticketRow.classList.add('gratis-hidden');
            } else if (ticketRow && ticketRow.classList.contains('gratis-hidden')) {
                ticketRow.style.display = '';
                ticketRow.classList.remove('gratis-hidden');
            }
        });
    };

    const setupMutationObserver = () => {
        const observer = new MutationObserver(handleGratisElements);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const initialStyles = `
        .andes-card__header, .info-row {
            display: none;
        }
        .item-row .item-cart {
            width: 71%;
        }
        .cards-double-scroll .card--cart > .andes-card .item-row,
        .cards-list .card--cart > .andes-card .item-row {
            padding: 10px;
        }
        .cards-container .card-wrapper,
        .cards-double-scroll .card-wrapper {
            padding: 0 0 0px !important;
        }
        .card--cart .andes-card {
            border-radius: 0px;
        }
        .bf-ui-separator {
            display: none;
        }
        .cards-container {
            max-width: 1300px;
        }
        .cards-list .item-price-container {
            align-self: center;
        }
        .cards-double-scroll>.card-wrapper.card--cart {
            max-width: 1300px;
            padding: 0 0 60px !important;
        }
        .card--cart .andes-card .ticket-row {
            padding: 5px 24px !important;
        }
        .cards-double-scroll .card--cart > .andes-card .item-row, .cards-list .card--cart > .andes-card .item-row {
            padding: 5px !important;
        }
    `;

    addStyle(initialStyles);
    handleGratisElements();
    setupMutationObserver();
})();