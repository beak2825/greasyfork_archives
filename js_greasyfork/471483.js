// ==UserScript==
// @name         Mvideo Third-Party Sellers remover
// @name:ru      Удаление сторонних продавцов М.Видео
// @namespace    https://www.mvideo.ru
// @version      1.0
// @description  Removes products from third-party sellers on mvideo.ru
// @description:ru Удаление товаров от сторонних продавцов на М.Видео
// @author       Levi Somerset
// @license      MIT
// @match        https://www.mvideo.ru/*
// @icon         https://img.mvideo.ru/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471483/Mvideo%20Third-Party%20Sellers%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/471483/Mvideo%20Third-Party%20Sellers%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove third-party products
    function removeThirdPartyProducts() {
        var productCards = document.querySelectorAll('.product-card--list');
        productCards.forEach(function(card) {
            var supplier = card.querySelector('.product-supplier');
            if (supplier) {
                var productCardLayout = card.closest('.product-cards-layout__item');
                if (productCardLayout) {
                    productCardLayout.remove();
                }
            }
        });
    }

    // Function to handle dynamic content using Mutation observer
    function observeDynamicContent() {
        var observer = new MutationObserver(function(mutationList, observer) {
            removeThirdPartyProducts();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Bind removeThirdPartyProducts function to window load event
    window.addEventListener('load', removeThirdPartyProducts);

    // Bind observeDynamicContent function to window load event
    window.addEventListener('load', observeDynamicContent);
})();