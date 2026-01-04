// ==UserScript==
// @name         PizzaPortal Enchancer
// @namespace    uniquenamespace
// @version      1.0.0
// @description  Skrypt dodaje brakujące opcje filtrowania do PizzaPortal
// @author       zranoI
// @match        https://pizzaportal.pl/*/restauracje/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390266/PizzaPortal%20Enchancer.user.js
// @updateURL https://update.greasyfork.org/scripts/390266/PizzaPortal%20Enchancer.meta.js
// ==/UserScript==

var inputValues = {
    maxPrice: Number.MAX_VALUE,
    maxDelivery: Number.MAX_VALUE
};

function apply() {
    var filterPanel = document.querySelector('.filter-and-sort-panel');
    var filterPanelContent = filterPanel.querySelector('.filter-and-sort-panel-content');
    var customFilters = createCustomFilters();
    filterPanel.insertBefore(customFilters,filterPanelContent);

    var openRestaurants = Array.from(document.querySelectorAll('.restaurant-list > ul > li'))
                           .filter(function(restaurant) {
                               var isClosed = !!restaurant.querySelector('.restaurant-closed');
                               if (isClosed) {
                                   restaurant.style.display = 'none';
                               }
                               return !isClosed;
                           });

    document.getElementById('maxPrice').addEventListener('input', function (e) {
        inputValues.maxPrice = this.value || Number.MAX_VALUE;
        updateRestaurants(openRestaurants);
    })
    document.getElementById('maxDelivery').addEventListener('input', function (e) {
        inputValues.maxDelivery = this.value || Number.MAX_VALUE;
        updateRestaurants(openRestaurants);
    });
}

function createCustomFilters() {
    var customFilters = document.createElement('div');
    customFilters.style.backgroundColor = 'white';
    customFilters.style.paddingLeft = '16px';
    customFilters.style.paddingTop = '16px';
    customFilters.style.paddingRight = '16px';
    customFilters.style.paddingBottom = '16px';
    customFilters.style.borderBottom = '1px black solid';
    customFilters.classList.add('sort-method-panel');
    customFilters.classList.add('restaurant-search-panel');
    customFilters.innerHTML =
        '<div class="sort-method-panel-title">Skryptowe opcje</div>' +
        '<input id="maxPrice" placeholder="Minimalna kwota nie większa niż" type="text" class="restaurant-search-panel-input" style="font-size: 1rem;"></input>' +
        '<input id="maxDelivery" placeholder="Dostawa nie droższa niż" type="text" class="restaurant-search-panel-input" style="font-size: 1rem; margin-top: 8px;"></input>';
    return customFilters;
}

function updateRestaurants(restaurants) {
    restaurants.forEach(function (restaurant) {
        var price = inputValues.maxPrice !== Number.MAX_VALUE ? parseFloat(restaurant.querySelector('.restaurant-payment-infos-minimum-order-value > .restaurant-payment-infos-image-container')
                                                                                     .innerText
                                                                                     .replace(',', '.'))
                                                              : 0;
        var delivery = inputValues.maxDelivery !== Number.MAX_VALUE ? parseFloat(restaurant.querySelector('.restaurant-payment-infos-delivery-fee > .restaurant-payment-infos-image-container')
                                                                                           .innerText
                                                                                           .replace(',', '.'))
                                                                    : 0;
        if (price > inputValues.maxPrice || delivery > inputValues.maxDelivery) {
            restaurant.style.display = 'none';
        } else {
            restaurant.style.display = 'block';
        }
    });
}

(function() {
    'use strict';
    setTimeout(apply, 100);
})();