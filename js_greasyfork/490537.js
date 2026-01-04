// ==UserScript==
// @name         Old-school GitHub Linguist Colors
// @namespace    https://gplane.win/
// @version      0.2.1
// @description  Change some GitHub linguist colors to old-school style.
// @author       Pig Fang
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490537/Old-school%20GitHub%20Linguist%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/490537/Old-school%20GitHub%20Linguist%20Colors.meta.js
// ==/UserScript==
;
(function () {
    'use strict';
    // key is current color and value is old color
    const colorsMap = {
        '#3178c6': '#2b7489', // TypeScript
        '#ef7a08': '#3be133', // OCaml
        '#a97bff': '#f18e33', // Kotlin
        '#41b883': '#2c3e50', // Vue
        '#00add8': '#375eab', // Go
    };
    const rgbMap = Object.fromEntries(Object.keys(colorsMap).map((color) => {
        const r = Number.parseInt(color.slice(1, 3), 16), g = Number.parseInt(color.slice(3, 5), 16), b = Number.parseInt(color.slice(5, 7), 16);
        return [color, `rgb(${r}, ${g}, ${b})`];
    }));
    const observer = new MutationObserver(() => {
        Object.entries(colorsMap).forEach(([from, to]) => {
            const rgbFrom = rgbMap[from];
            document.querySelectorAll(`[style*="${from}" i]`).forEach((element) => {
                element.style.cssText = element.style.cssText.replaceAll(rgbFrom, to);
                element.style.border = 'unset';
            });
            document.querySelectorAll('div[data-testid="results-list"] ul div > div')
                .forEach((element) => {
                element.style.display = 'none';
                if (window.getComputedStyle(element).backgroundColor === rgbFrom) {
                    element.style.backgroundColor = to;
                }
                element.style.borderWidth = '0';
                element.style.borderColor = 'unset';
                element.style.width = '12px';
                element.style.height = '12px';
                element.style.display = 'block';
            });
            document.querySelectorAll('[data-testid="desktop-filters"] > ul > li:nth-child(3) a > span > div')
                .forEach((element) => {
                element.style.display = 'none';
                if (window.getComputedStyle(element).backgroundColor === rgbFrom) {
                    element.style.backgroundColor = to;
                }
                element.style.borderWidth = '0';
                element.style.borderColor = 'unset';
                element.style.display = 'block';
            });
            document.querySelectorAll('[data-testid="list-view-item-main-content"] > div > div > div > div > div > div > div')
                .forEach((element) => {
                element.style.display = 'none';
                if (window.getComputedStyle(element).backgroundColor === rgbFrom) {
                    element.style.backgroundColor = to;
                }
                element.style.borderWidth = '0';
                element.style.borderColor = 'unset';
                element.style.display = 'block';
            });
        });
        document.querySelectorAll('span.repo-language-color').forEach((element) => {
            element.style.border = 'unset';
        });
    });
    observer.observe(document.body, { subtree: true, childList: true });
})();
