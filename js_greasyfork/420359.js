// ==UserScript==
// @name         OZON.RU Price converter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces prices in CURRENCY with ANOTHER_CURRENCY in the OZON catalog (not everywhere)
// @author       Vladislav Romanovsky
// @match        https://www.ozon.ru/*
// @downloadURL https://update.greasyfork.org/scripts/420359/OZONRU%20Price%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/420359/OZONRU%20Price%20converter.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const CURRENCY = 'RUB';
    const ANOTHER_CURRENCY = 'BYN';
    const api_key = 'YOUR_KEY';
    const searchContainers = [
        '.tile-hover-target span',
        '.tile-hover-target .itemasdasda div',
        '.container [data-widget=webPrice] span',
        '.container [data-widget=webCharacteristics] dd',
        '.container [data-widget=skuShelfGoods] span',
        '.container [data-widget=skuLine] span',
    ];

    const url = `https://free.currconv.com/api/v7/convert?q=${CURRENCY}_${ANOTHER_CURRENCY}&compact=ultra&apiKey=${api_key}`;
    const response = await fetch(url);

    let rate = 0;

    if (!response.ok) return console.log('HTTP ERROR: ' + response.status)
    else rate = (await response.json())[`${CURRENCY}_${ANOTHER_CURRENCY}`];

    const replace = () => {
        searchContainers
            .map(selector => [...document.querySelectorAll(selector)])
            .flat()
            .filter(span => /\d.*₽/gi.test(span.textContent))
            .forEach(span => {
                const text = span.textContent;
                const digit = text.replace(/\D/g, '');
                span.title = span.textContent;
                span.textContent = span.textContent.replace(/\d.*₽/gi, (digit * rate).toFixed(2) + ' ' + ANOTHER_CURRENCY);
            });
    };

    const callback = mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type == 'childList') {
                console.log('A child node has been added or removed.');
                //if (response.ok) replace();
            } else if (mutation.type == 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
                if (mutation.attributeName === 'cz-shortcut-listen' && response.ok) replace();
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, { attributes: true, childList: true });
})();