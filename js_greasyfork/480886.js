// ==UserScript==
// @name         LI - Betsapi xG
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Skript pro LI, který zobrazuje tabulku s upraveným xG.
// @author       KvidoTeam
// @match        https://betsapi.com/r/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480886/LI%20-%20Betsapi%20xG.user.js
// @updateURL https://update.greasyfork.org/scripts/480886/LI%20-%20Betsapi%20xG.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    function transformXGValue(xgValue) {
        const XG = parseFloat(xgValue.trim().replace(/[^0-9.,]*/, ''));
        function hashStr(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                var charCode = str.charCodeAt(i);
                hash += charCode;
            }
            return hash;
        }
        const modulo = 30;
        const str = document.URL + XG;
        const percentage = 1 + (((hashStr(str) % (modulo + 1)) - (modulo / 2)) / 100);
        return Math.round(XG * percentage * 100) / 100;
    }
    function findAndDisplayTransformedxGValues() {
        const xGElementA = document.evaluate('//td[contains(text(),"xG")]/../td[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const xGElementB = document.evaluate('//td[contains(text(),"xG")]/../td[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (xGElementA && xGElementB) {
            const xGValueA = transformXGValue(xGElementA.textContent);
            const xGValueB = transformXGValue(xGElementB.textContent);
            createDisplayTable(xGValueA, xGValueB);
            clearInterval(refreshInterval);
        }
    }
    function createDisplayTable(valueA, valueB) {
        const existingTable = document.getElementById('transformedXGValuesDisplay');

        if (!existingTable) {
            const displayTable = document.createElement('table');
            displayTable.id = 'transformedXGValuesDisplay';
            displayTable.style.position = 'fixed';
            displayTable.style.top = '150px';
            displayTable.style.left = '20%';
            displayTable.style.backgroundColor = 'white';
            displayTable.style.border = '1px solid black';
            displayTable.style.zIndex = '9999';
            displayTable.style.fontSize = '20px';
            const cellBorderStyle = '1px solid black';
            displayTable.innerHTML = `
                <tr>
                    <td style="border:${cellBorderStyle};">Home team xG: </td>
                    <td style="border:${cellBorderStyle};"><strong>${valueA}</strong></td>
                </tr>
                <tr>
                    <td style="border:${cellBorderStyle};">Away team xG: </td>
                    <td style="border:${cellBorderStyle};"><strong>${valueB}</strong></td>
                </tr>
            `;
            document.body.appendChild(displayTable);
        } else {}
    }
    const refreshInterval = setInterval(findAndDisplayTransformedxGValues, 1000);
    window.addEventListener('load', findAndDisplayTransformedxGValues);
},1000)();