// ==UserScript==
// @name         Foodpanda random chooser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Randomly select a foodpanda restaurant
// @author       You
// @match        https://www.foodpanda.com.tw/restaurants/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420612/Foodpanda%20random%20chooser.user.js
// @updateURL https://update.greasyfork.org/scripts/420612/Foodpanda%20random%20chooser.meta.js
// ==/UserScript==

function onClick() {
    const poiElements = document.querySelectorAll('section[data-testid="restaurant-swimlane"] .vendor-lane > li');
    const randomIndex = Math.floor(Math.random() * Math.floor(poiElements.length));
    const choosedEl = poiElements[randomIndex];
    const url = choosedEl.querySelector('a').href;
    window.open(url, '_blank');
}

function createButton() {
    const container = document.querySelector('.filters-search-wrapper');
    const button = document.createElement("BUTTON");
    button.onclick = onClick;
    button.innerHTML = "試一下運氣";
    container.appendChild(button);
}

(function() {
    'use strict';

    window.setTimeout(createButton, 5000);
})();