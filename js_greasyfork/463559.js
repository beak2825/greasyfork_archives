// ==UserScript==
// @name         Change a card size in darkino
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ce script Tampermonkey ajuste la taille et la marge des cartes sur une page web et supprime les styles des images. Un curseur permet de modifier la taille des cartes, et la valeur en pourcentage est affichée à côté. La taille choisie est sauvegardée pour une utilisation sur d'autres pages du site.
// @author       M1tx
// @match        https://www2.darkino.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463559/Change%20a%20card%20size%20in%20darkino.user.js
// @updateURL https://update.greasyfork.org/scripts/463559/Change%20a%20card%20size%20in%20darkino.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const images = document.querySelectorAll('img[loading="lazy"]');
    const cards = document.querySelectorAll('.home-page-categories .videos .video-list.short, .video-latest-list.video-wrapper.short');

    function removeImageInlineStyles() {
        for (let img of images) {
            img.removeAttribute('style');
        }
    }

    function resizeCards(size) {
        for (let card of cards) {
            card.style.width = size + 'px';
        }
    }

    function adjustCardMargin(margin) {
        for (let card of cards) {
            card.style.margin = margin + 'px';
        }
    }

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '100';
    slider.max = '300';
    slider.value = localStorage.getItem('cardSize') || '300';
    slider.style.marginLeft = '10px';

    const valueDisplay = document.createElement('span');
    const percentage = Math.round((((slider.value - 100) / 200) * 100));
    valueDisplay.textContent = `${percentage}%`;
    valueDisplay.style.marginLeft = '5px';

    slider.addEventListener('input', (event) => {
        const size = parseInt(event.target.value);
        const percentage = Math.round(((size - 100) / 200) * 100);
        valueDisplay.textContent = `${percentage}%`;
        resizeCards(size);
        adjustCardMargin(size / 10);
        localStorage.setItem('cardSize', size);
    });

    const container = document.querySelector('.flex.justify-center.p-6');
    container.appendChild(slider);
    container.appendChild(valueDisplay);

    removeImageInlineStyles();

    const savedCardSize = localStorage.getItem('cardSize');
    if (savedCardSize) {
        resizeCards(savedCardSize);
        adjustCardMargin(savedCardSize / 10);
    }
})();
