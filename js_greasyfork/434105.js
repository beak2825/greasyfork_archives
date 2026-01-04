// ==UserScript==
// @name         Satisfactory Calculator Item Search
// @namespace    https://gitlab.com/bunjiboys/
// @version      0.2
// @description  Add search functionality to the Satisfactory Calculater item view
// @author       Asbjorn Kjaer
// @match        https://satisfactory-calculator.com/en/items
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434105/Satisfactory%20Calculator%20Item%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/434105/Satisfactory%20Calculator%20Item%20Search.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(
                () => {
                    func.apply(this, args);
                },
                timeout
            );
        };
    }

    function doSearch() {
        let scrolled = false;
        const nodes = document.querySelectorAll('div.card-body > a[href*="/en/items/detail"] > img');
        const terms = document.getElementById('itemSearch').value.trim().toLowerCase();

        if (terms === undefined || terms === '') {
            nodes.forEach(node => {
                node.parentElement.parentElement.parentElement.classList.remove('searchResult');
            });
        } else {
            nodes.forEach(node => {
                const alt = node.alt.toLowerCase();

                if (alt.indexOf(terms) !== -1) {
                    node.parentElement.parentElement.parentElement.classList.add('searchResult');
                    if (!scrolled) {
                        node.scrollIntoView({behavior: 'smooth'});
                        scrolled = true;
                    }
                } else {
                    if (node.parentElement.parentElement.parentElement.classList.contains('searchResult')) {
                        node.parentElement.parentElement.parentElement.classList.remove('searchResult');
                    }
                }
            });
        }
    }

    // Create a div to hold our search box
    const search = document.createElement('div');
    search.classList.add('form-group');

    // Create search box
    const input = document.createElement('input');
    input.id = 'itemSearch';
    input.value = '';
    input.type = 'text';
    input.classList.add('form-control');
    input.placeholder = 'Search';
    input.onkeyup = debounce(doSearch);

    search.appendChild(input);

    const styles = document.createElement('style');
    styles.textContent = '.searchResult{border:2px solid rgb(266,180,0);animation:blink .5s;animation-iteration-count:5;}@keyframes blink{50%{border-color: #fff;}}';
    document.head.appendChild(styles);


    document.querySelector('main[role="main"] > div.container-fluid:first-child div.card-body').prepend(input);
})();