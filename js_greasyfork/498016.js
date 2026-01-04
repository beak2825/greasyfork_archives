// ==UserScript==
// @name         [KPX] TornStats Table Modifier
// @namespace    https://www.tornstats.com
// @version      0.2
// @description  Add text in front of the corresponding number
// @author       KPCX
// @match        https://www.tornstats.com/spies/faction/search?user=&faction=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornstats.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498016/%5BKPX%5D%20TornStats%20Table%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/498016/%5BKPX%5D%20TornStats%20Table%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        let table = document.getElementById('spies-table');
        let rows = table.getElementsByTagName('tr');

        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('td');
            if (cells.length > 7) {
                let link = cells[0].getElementsByTagName('a')[0];
                let level = document.createTextNode(' - Lvl: ' + cells[1].innerText);
                cells[0].appendChild(level);
                cells[3].innerText = 'Str: ' + cells[3].innerText;
                cells[4].innerText = 'Def: ' + cells[4].innerText;
                cells[5].innerText = 'Spd: ' + cells[5].innerText;
                cells[6].innerText = 'Dex: ' + cells[6].innerText;
                cells[7].innerText = 'Total: ' + cells[7].innerText;

                // Extract the user ID from the profile link
                let userId = link.href.split('=')[1];

                // Create a new link element for the "Attack" link
                let attackLink = document.createElement('a');
                attackLink.href = 'https://www.torn.com/loader.php?sid=attack&user2ID=' + userId;
                attackLink.target = '_blank';
                attackLink.innerText = 'Attack';

                // Replace the "FF Bonus" cell with the new "Attack" link
                cells[8].innerHTML = '';
                cells[8].appendChild(attackLink);

                // Empty the "Level", "Faction", and "Last Update" data
                cells[1].setAttribute('data-order', '');
                cells[1].innerText = '';
                cells[2].innerText = '';
                cells[9].setAttribute('data-order', '');
                cells[9].innerText = '';
            }
        }
    };
})();