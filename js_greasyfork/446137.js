// ==UserScript==
// @name         sortColumns
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort Redactle guessed-words table by a column
// @author       gauss256
// @match        https://www.redactle.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redactle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446137/sortColumns.user.js
// @updateURL https://update.greasyfork.org/scripts/446137/sortColumns.meta.js
// ==/UserScript==

/* jshint esversion:6 */

// The lovely code to do the sorting comes from:
// https://stackoverflow.com/a/50127768/80309

(function () {
    'use strict';

    function hash(node) {
        return parseInt(node.querySelector('td:nth-child(1)').innerHTML);
    }

    function guess(node) {
        return node.querySelector('td:nth-child(2)').innerHTML;
    }

    function hits(node) {
        return parseInt(node.querySelector('td:nth-child(3)').innerHTML);
    }

    function sortByHash() {
        const guessLogBody = document.getElementById('guessLogBody');
        [...guessLogBody.children]
            .sort((a, b) => hash(b) - hash(a))
            .forEach(node => guessLogBody.appendChild(node));
    }

    function sortByGuess() {
        const guessLogBody = document.getElementById('guessLogBody');
        [...guessLogBody.children]
            .sort((a, b) => guess(a) > guess(b))
            .forEach(node => guessLogBody.appendChild(node));
    }

    function sortByHits() {
        const guessLogBody = document.getElementById('guessLogBody');
        [...guessLogBody.children]
            .sort((a, b) => hits(b) - hits(a))
            .forEach(node => guessLogBody.appendChild(node));
    }

    // Set up click events on the column headers
    const columnHeads = document
        .getElementById('tableHolder')
        .querySelectorAll('th');
    let hashBtn;
    let guessBtn;
    let hitsBtn;
    for (let i = 0; i < columnHeads.length; i++) {
        let headElem = columnHeads[i];
        let headLabel = headElem.innerHTML;
        switch(headLabel) {
            case '#':
                hashBtn = headElem;
                break;
            case 'Guess':
                guessBtn = headElem;
                break;
            default:
                hitsBtn = headElem;
        }
    }
    hashBtn.style = 'cursor: pointer';
    guessBtn.style = 'cursor: pointer';
    hitsBtn.style = 'cursor: pointer';

    // Set up event handlers
    hashBtn.onclick = function () {
        sortByHash();
    };
    guessBtn.onclick = function () {
        sortByGuess();
    };
    hitsBtn.onclick = function () {
        sortByHits();
    };

})();
