// ==UserScript==
// @name         Magelo Simple Search
// @namespace    https://greasyfork.org/en/users/152683
// @version      0.1
// @description  Simple item search for magelo profiles.
// @author       Steven Bell
// @match        https://eq.magelo.com/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391227/Magelo%20Simple%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/391227/Magelo%20Simple%20Search.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
/* globals JQuery, $, items, openItemExplorer */

(function() {
    'use strict';

    function searchItems(match) {
        const results = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i]) {
                if (items[i].name && items[i].name.includes(match)) {
                    items[i].orignalIndex = i;
                    results.push(items[i]);
                    continue;
                }
                if (items[i].desc && items[i].desc.includes(match)) {
                    items[i].orignalIndex = i;
                    results.push(items[i]);
                    continue;
                }
            }
        }
        return results
    }

    function displayItems(results) {
        const resultsDiv = $('#resultsDiv');
        resultsDiv.empty();
        for (let i = 0; i < results.length; i++) {
            let itemLabel = document.createElement('Label');
            itemLabel.innerText = `${results[i].name} (${results[i].qt})`;
            itemLabel.style.cssText = 'display: block';
            itemLabel.onclick = () => (openItemExplorer(results[i].orignalIndex));
            resultsDiv.append(itemLabel);
        }
    }

    function loadUI() {
        const mainWindow = $('#mainWindow')[0];
        mainWindow.style.top = '21px';

        const searchLabel = document.createElement('Label');
        searchLabel.innerHTML = 'Search:';
        searchLabel.style['padding-right'] = '5px';

        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.onkeyup = () => {
            if (searchInput.value) {
                const results = searchItems(searchInput.value);
                displayItems(results);
            } else {
                $('#resultsDiv').empty();
            }
        };

        const searchDiv = document.createElement('div');
        searchDiv.style['padding-left'] = '20px';
        searchDiv.id = 'searchDiv';
        searchDiv.appendChild(searchLabel);
        searchDiv.appendChild(searchInput);

        $('#mainWindow').before(searchDiv);

        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'resultsDiv';
        resultsDiv.style.cssText = 'position: absolute; top: 21px; left: 450px; width: 100%;';

        $('#profile').append(resultsDiv);
    };

    loadUI();
})();