// ==UserScript==
// @name         Reverse Table Columns on WikiTree
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Reverse the order of family tree columns on WikiTree profiles when "Hide Ancestors" --> "Show Ancestors" is clicked
// @author       Hebert-4971
// @match        *://*.wikitree.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518852/Reverse%20Table%20Columns%20on%20WikiTree.user.js
// @updateURL https://update.greasyfork.org/scripts/518852/Reverse%20Table%20Columns%20on%20WikiTree.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to reverse table columns
    function reverseTableColumns(table) {
        for (var i = 0; i < table.rows.length; i++) {
            var row = table.rows[i];
            var cells = Array.from(row.cells);
            cells.reverse();
            cells.forEach(function(cell) {
                row.appendChild(cell);
            });
        }
    }

    // Function to observe the DOM for added tables
    function reverseAncestorTreeTable() {
        var container = document.getElementById('ancestorTreeContainer');
        if (!container) return;

        var table = container.querySelector('table');
        if (table) {
            reverseTableColumns(table);
        }
    }

    // Add event listener to the "Show ancestors" button
    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'SPAN' && event.target.textContent.toLowerCase().includes('ancestors')) {
            reverseAncestorTreeTable();
        }
    });
})();
