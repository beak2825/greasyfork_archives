// ==UserScript==
// @name         COVID-19 Add daily death per million column
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add column "Daily deaths per million" to see fairly the daily deaths impact on each country, regardless of population size.
// @author       Clément Dufour
// @match        https://www.worldometers.info/coronavirus/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419159/COVID-19%20Add%20daily%20death%20per%20million%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/419159/COVID-19%20Add%20daily%20death%20per%20million%20column.meta.js
// ==/UserScript==

(function() {
    'use strict';


        const nameColumn = Array.from(document.querySelector('#main_table_countries_today thead tr').children).map(col => col.textContent);
        const indexDailyDeath = nameColumn.indexOf("NewDeaths");
        const indexPop = nameColumn.indexOf("Population");

    document.querySelectorAll('.main_table_countries_div').forEach((table) => {
        const parentThead = table.querySelector('thead tr');
        const childAfter = parentThead.querySelector('th:nth-child(6)');
        const newChild = childAfter.cloneNode();

        newChild.innerText = 'New Deaths/ 1M pop';
        newChild.ariaLabel = 'New Deaths/ 1M pop : activate to sort column descending'
        parentThead.insertBefore(newChild, childAfter);



        const bodyTable = Array.from(table.querySelector('tbody').children);
        bodyTable.forEach((row) => {
            const dailyDeath = parseInt(row.children[indexDailyDeath].textContent.replaceAll(',',''));
            const pop = parseInt(row.children[indexPop].textContent.replaceAll(',',''));
            const deathsPerMillion = Math.round((dailyDeath / (pop / 1000000)) * 100 ) / 100;
            const cellAfter = row.querySelector('td:nth-child(6)');
            const newCell = cellAfter.cloneNode();

            if (dailyDeath && !Number.isNaN(deathsPerMillion)) {
                newCell.innerText = `+${deathsPerMillion}`;
            }
            row.insertBefore(newCell, cellAfter);
        });
    });

})();