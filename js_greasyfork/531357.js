// ==UserScript==
// @name         Geekbench Battery Life Wh Efficiency Calculator & Sorter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Calculates and displays min/Wh for phones on socpk.com and adds a styled sort button.
// @author       Karlcx
// @match        https://socpk.com/batlife/
// @grant        none
// @icon         https://socpk.com/MAINPIC/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531357/Geekbench%20Battery%20Life%20Wh%20Efficiency%20Calculator%20%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/531357/Geekbench%20Battery%20Life%20Wh%20Efficiency%20Calculator%20%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EFFICIENCY_ATTR = 'data-wh-efficiency';


    function parseRuntime(runtimeStr) {
        if (!runtimeStr) return null;
        const match = runtimeStr.match(/(\d+)h(\d+)min/i);
        if (match && match.length === 3) {
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            if (!isNaN(hours) && !isNaN(minutes)) {
                return (hours * 60) + minutes;
            }
        }
        return null;
    }

    function parseWh(modelStr) {
        if (!modelStr) return null;
        const match = modelStr.match(/\((\d+(\.\d+)?)\s*Wh\)/i);
        if (match && match.length >= 2) {
            const wh = parseFloat(match[1]);
            if (!isNaN(wh)) {
                return wh;
            }
        }
        return null;
    }

    function calculateAndDisplayEfficiencyForRow(row) {
        if (row.cells.length < 2) return;

        const modelElement = row.querySelector('td:nth-child(2) .ratioBar a.model');
        const runtimeElement = row.querySelector('td:nth-child(2) .ratioBar .ratio2 a');

        if (!modelElement || !runtimeElement) {
            return;
        }

        if (modelElement.textContent.includes(' min/Wh)')) {
            if (!row.hasAttribute(EFFICIENCY_ATTR)) {
                 calculateEfficiencyData(row);
            }
            return;
        }

        const originalModelTextContent = modelElement.textContent;
        const runtimeText = runtimeElement.textContent;

        const totalMinutes = parseRuntime(runtimeText);
        const wh = parseWh(originalModelTextContent);

        let efficiency = null;
        if (totalMinutes !== null && wh !== null && wh > 0) {
            efficiency = totalMinutes / wh;
            row.setAttribute(EFFICIENCY_ATTR, efficiency.toString());
            const efficiencyString = `\u2003(${efficiency.toFixed(1)} min/Wh)`;
            const efficiencyTextNode = document.createTextNode(efficiencyString);
            const enspnode = document.createTextNode(``);

            modelElement.appendChild(enspnode);
            modelElement.appendChild(efficiencyTextNode);

        } else {
             row.setAttribute(EFFICIENCY_ATTR, 'Infinity');
        }
    }

    function calculateEfficiencyData(row) {
        if (row.hasAttribute(EFFICIENCY_ATTR)) return;

        const modelElement = row.querySelector('td:nth-child(2) .ratioBar a.model');
        const runtimeElement = row.querySelector('td:nth-child(2) .ratioBar .ratio2 a');

        if (!modelElement || !runtimeElement) return;

        const modelText = modelElement.textContent;
        const runtimeText = runtimeElement.textContent;

        const totalMinutes = parseRuntime(runtimeText);
        const wh = parseWh(modelText);

        let efficiency = Infinity;
        if (totalMinutes !== null && wh !== null && wh > 0) {
            efficiency = totalMinutes / wh;
        }
        row.setAttribute(EFFICIENCY_ATTR, efficiency.toString());
    }


    function sortTableByWhEfficiency() {
        const tableBody = document.querySelector('#mainForm tbody');
        if (!tableBody) {
            console.error("Userscript: Table body not found for sorting.");
            return;
        }

        const rows = Array.from(tableBody.querySelectorAll('tr'));
        const dataRows = rows.filter(row => row.querySelector('.ratioBar .ratio2 a'));

        dataRows.forEach(row => {
             if (!row.hasAttribute(EFFICIENCY_ATTR)) {
                 calculateEfficiencyData(row);
             }
        });

        const rowsWithEfficiency = dataRows.map(row => {
            const efficiencyValue = parseFloat(row.getAttribute(EFFICIENCY_ATTR));
            return {
                row: row,
                efficiency: isNaN(efficiencyValue) || !isFinite(efficiencyValue) ? -1 : efficiencyValue
            };
        });

        rowsWithEfficiency.sort((a, b) => b.efficiency - a.efficiency);

        dataRows.forEach(row => tableBody.removeChild(row));
        rowsWithEfficiency.forEach(item => tableBody.appendChild(item.row));

        console.log("Userscript: Table sorted by Wh efficiency (Descending).");
    }

    function addSortButton() {
        if (document.getElementById('sort-by-wh-button')) {
            return;
        }

        const mainForm = document.getElementById('mainForm');
        if (!mainForm) {
            console.error("Userscript: Cannot find mainForm to insert button.");
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.padding = '20px 0';


        const button = document.createElement('button');
        button.id = 'sort-by-wh-button';
        button.textContent = '按 Wh 能效排序 (高 → 低)';
        button.style.display = 'inline-block';
        button.style.padding = '10px 25px';
        button.style.margin = '0';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#555555';
        button.style.color = '#FFFFFF';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.transition = 'background-color 0.2s ease';

        button.onmouseover = () => { button.style.backgroundColor = '#777777'; };
        button.onmouseout = () => { button.style.backgroundColor = '#555555'; };

        button.addEventListener('click', sortTableByWhEfficiency);

        buttonContainer.appendChild(button);

        mainForm.parentNode.insertBefore(buttonContainer, mainForm);
    }

    function initialize() {
        const tableBody = document.querySelector('#mainForm tbody');
        if (!tableBody) {
            console.error("Userscript: Main table body not found.");
            setTimeout(initialize, 500);
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR') {
                             if(node.querySelector('.ratioBar .ratio2 a')) {
                                calculateAndDisplayEfficiencyForRow(node);
                             }
                        }
                    });
                }
            }
        });

        observer.observe(tableBody, { childList: true });


        const initialRows = tableBody.querySelectorAll('tr');
         initialRows.forEach(row => {
             if(row.querySelector('.ratioBar .ratio2 a')) {
                calculateAndDisplayEfficiencyForRow(row);
             }
         });


        addSortButton();

        console.log("Userscript: Wh Efficiency Calculator initialized (Modified Layout).");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();