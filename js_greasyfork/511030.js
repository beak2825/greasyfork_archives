// ==UserScript==
// @name         RED - Show time elapsed since torrent creation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  create a new column on torrent pages showing time elapsed since each torrent creation
// @license MIT
// @author       zortilox
// @match        https://redacted.ch/torrents.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511030/RED%20-%20Show%20time%20elapsed%20since%20torrent%20creation.user.js
// @updateURL https://update.greasyfork.org/scripts/511030/RED%20-%20Show%20time%20elapsed%20since%20torrent%20creation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const torrents = document.querySelectorAll('#torrent_details .torrent_row');

    if (0 === torrents.length) {
        return;
    }

    // Add cell to table heading
    let headCell = document.createElement('td')
    headCell.innerText = 'Time';

    document.querySelector('#torrent_details > tbody > tr').appendChild(headCell);

    // Change columns count to 6 per row
    const cells = document.querySelectorAll('#torrent_details td[colspan="5"]');

    cells.forEach((cell) => {
        cell.colSpan = "6";
    });

    // Append time elapsed on each row
    torrents.forEach((torrent) => {
        let cell;

        cell = document.createElement('td');

        cell.innerHTML = torrent.nextElementSibling.querySelector('.time').innerText.replace(' ago', '').split(',').join('<br/>');
        cell.style['min-width'] = '70px';

        torrent.appendChild(cell);
    });

})();