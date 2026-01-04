// ==UserScript==
// @name         Steam Level Up Filter
// @namespace    https://vandaele.software/
// @version      1.0
// @description  Adds additional filters to the Steam Level Up store
// @author       Joshua Vandaële
// @match        https://steamlvlup.com/*
// @icon         https://steamlvlup.com/img/slvlup-favi.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496361/Steam%20Level%20Up%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/496361/Steam%20Level%20Up%20Filter.meta.js
// ==/UserScript==

let pageItems = [];

class pageItem {
    constructor(element) {
        this.element = element;
    }

    getStock() {
        const stockElement = this.element.querySelector('.i_storage span');
        return stockElement ? parseInt(stockElement.textContent, 10) : 0;
    }

    getCompleted() {
        const completedElement = this.element.querySelector('.i_badges span');
        return completedElement ? parseInt(completedElement.textContent, 10) : 0;
    }
}

function show(sort) {
    const titleElement = document.getElementById("title_filter");
    titleElement.textContent = sort;

    const menuElement = titleElement.nextElementSibling;
    menuElement.style.display = "none";

    pageItems.forEach(item => {
        switch (sort) {
            case "All":
                item.element.style.display = "";
                break;
            case "In Stock":
                item.element.style.display = item.getStock() > 0 ? "" : "none";
                break;
            case "Not completed":
                item.element.style.display = item.getCompleted() === 0 ? "" : "none";
                break;
            case "In stock and not completed":
                item.element.style.display = item.getStock() > 0 && item.getCompleted() === 0 ? "" : "none";
                break;
        }
    });
}

function addMenuElement(menuElement, text) {
    const liElement = document.createElement("li");
    liElement.textContent = text;
    liElement.onclick = () => {
        show(text);
    }

    menuElement.appendChild(liElement);
}

(function () {
    'use strict';
    const filters = [
        "All",
        "In Stock",
        "Not completed",
        "In stock and not completed",
    ]
    const storeFilters = document.getElementsByClassName("store-filter");

    const showElement = document.createElement("div");

    showElement.className = "store-filter";

    const showLabelElement = document.createElement("span");
    showLabelElement.className = "store-filter-label";
    showLabelElement.textContent = "Show:";
    showElement.appendChild(showLabelElement);

    const showTitleElement = document.createElement("span");
    showTitleElement.className = "store-filter-title";
    showTitleElement.id = "title_filter";
    showTitleElement.textContent = filters[0];
    showElement.appendChild(showTitleElement);

    const showIconElement = document.createElement("i");
    showIconElement.className = "fa fa-chevron-down";
    showElement.appendChild(showIconElement);

    const showMenuElement = document.createElement("ul");
    showMenuElement.className = "store-filter-menu";
    showMenuElement.style.display = "none";
    filters.forEach((filter, index) => {
        addMenuElement(showMenuElement, filter);
    });
    showElement.appendChild(showMenuElement);

    storeFilters[0].parentNode.insertBefore(showElement, storeFilters[0]);
})();

setInterval(() => {
    pageItems = Array.from(document.getElementsByClassName("store-item")).map(item => new pageItem(item));
});