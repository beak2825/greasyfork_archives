// ==UserScript==
// @name         RARBG Torrents - Dynamic Column Highlighting v5
// @namespace    tampermonkey
// @version      5.0
// @description  Highlights torrents based on dynamic column identification, focusing on the 'S.' column.
// @author       sharmanhall
// @match        https://rarbg.to/torrents.php*
// @match        https://rarbg.to/torrents.php*
// @match        https://rarbg.to/torrents.php*
// @include      https://rarbgprx.org/torrents.php*
// @include      https://proxyrarbg.org/torrents.php*
// @include      https://rarbgunblocked.org/torrents.php*
// @include      https://rarbgaccess.org/torrents.php*
// @include      https://rarbgaccessed.org/torrents.php*
// @include      https://rarbgcore.org/torrents.php*
// @include      https://rarbgdata.org/torrents.php*
// @include      https://rarbgenter.org/torrents.php*
// @include      https://rarbgget.org/torrents.php*
// @include      https://rarbggo.org/torrents.php*
// @include      https://rarbgindex.org/torrents.php*
// @include      https://rarbgmirror.org/torrents.php*
// @include      https://rarbgmirrored.org/torrents.php*
// @include      https://rarbgp2p.org/torrents.php*
// @include      https://rarbgproxied.org/torrents.php*
// @include      https://rarbgproxies.org/torrents.php*
// @include      https://rarbgproxy.org/torrents.php*
// @include      https://rarbgto.org/torrents.php*
// @include      https://rarbgtor.org/torrents.php*
// @include      https://rarbgtorrents.org/torrents.php*
// @include      https://rarbgunblock.org/torrents.php*
// @include      https://rarbgway.org/torrents.php*
// @include      https://rarbgweb.org/torrents.php*
// @include      https://unblockedrarbg.org/torrents.php*
// @include      https://rarbg2018.org/torrents.php*
// @include      https://rarbg2019.org/torrents.php*
// @include      https://rarbg2020.org/torrents.php*
// @include      https://rarbg2021.org/torrents.php*
// @include      https://*rarbg.*
// @include      /https?:\/\/.{0,8}rarbg.*\.\/*/
// @include      /https?:\/\/.{0,8}rargb.*\.\/*/
// @include      https://*rarbg.*
// @include      /https?:\/\/.{0,8}rarbg.*\.\/*/
// @include      /https?:\/\/.{0,8}rargb.*\.\/*/
// @include      /https?:\/\/.*u=MTcyLjIxLjAuMXw6Ly9yYXJiZy50by90b3JyZW50LzIyMDg3MjYwfE1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS83OS4wLjM5NDUuMTMwIFNhZmFyaS81MzcuMzZ8ODc4MDQz.*/
// @include      https://www.rarbg.is
// @include      https://proxyrarbg.org
// @include      https://rarbg.com
// @include      https://rarbg.to
// @include      https://rarbg2018.org
// @include      https://rarbg2019.org
// @include      https://rarbg2020.org
// @include      https://rarbg2021.org
// @include      https://rarbgaccess.org
// @include      https://rarbgaccessed.org
// @include      https://rarbgcdn.org
// @include      https://rarbgcore.org
// @include      https://rarbgdata.org
// @include      https://rarbgenter.org
// @include      https://rarbgget.org
// @include      https://rarbggo.org
// @include      https://rarbgindex.org
// @include      https://rarbgmirror.com
// @include      https://rarbgmirror.org
// @include      https://rarbgmirrored.org
// @include      https://rarbgp2p.org
// @include      https://rarbgproxied.org
// @include      https://rarbgproxies.org
// @include      https://rarbgproxy.com
// @include      https://rarbgproxy.org
// @include      https://rarbgprx.org
// @include      https://rarbgto.org
// @include      https://rarbgtor.org
// @include      https://rarbgtorrents.org
// @include      https://rarbgunblock.com
// @include      https://rarbgunblock.org
// @include      https://rarbgunblocked.org
// @include      https://rarbgway.org
// @include      https://rarbgweb.org
// @include      https://unblockedrarbg.org
// @include      https://www.rarbg.is
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://rarbg.to&size=16
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493324/RARBG%20Torrents%20-%20Dynamic%20Column%20Highlighting%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/493324/RARBG%20Torrents%20-%20Dynamic%20Column%20Highlighting%20v5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findSeederColumnIndex() {
        // Find the 'a' tag with 'href' containing "seeders"
        //var seederLink = document.querySelector('a[href*="seeders"]');
        var seederLink = document.querySelector('.lista2t a[href*="seeders"]:not(#pager_links a)');
        console.log("seederLink" + seederLink);
        if (!seederLink) {
            console.log("Seeder link not found");
            return -1;
        }

        // Find the parent 'td' of the 'a' tag
        var seederTd = seederLink.parentElement;
        while (seederTd.tagName !== 'TD' && seederTd != null) {
            seederTd = seederTd.parentElement;
        }

        if (!seederTd) {
            console.log("Seeder TD not found");
            return -1;
        }

        // Count the number of preceding 'td' elements to find the index
        var index = 0;
        while ((seederTd = seederTd.previousElementSibling) != null) {
            index++;
        }
        console.log("Seeder Column Index Found: " + index);
        return index;
    }

function getHighlightColor(seederCount) {
    if (seederCount >= 1000) return "#c0edc8"; // Very light green
    if (seederCount >= 900) return "#c0edc8"; // Slightly darker
    if (seederCount >= 800) return "#c0edc8"; // Gradually getting darker
    if (seederCount >= 700) return "#c0edc8"; // Still light, but more green
    if (seederCount >= 600) return "#c0edc8"; // Green with a hint of blue
    if (seederCount >= 500) return "#c0edc8"; // Light green-blue
    if (seederCount >= 400) return "#c0edc8"; // Even lighter green-blue
    if (seederCount >= 300) return "#c0edc8"; // Very pale green
    if (seederCount >= 200) return "#c0edc8"; // Nearing very light green
    return "#C0EDC8"; // Almost white with a hint of green
}


    function highlightTorrents() {
        console.log("Running highlightTorrents");

        var seederColumnIndex = findSeederColumnIndex();

        if (seederColumnIndex === -1) {
            console.error("Seeder column not found");
            return;
        }

        var rows = document.querySelectorAll(".lista2t > tbody > tr.lista2");
        console.log("Total Rows Found: " + rows.length);
        var countHighlighted = 0;

        rows.forEach(function(row, rowIndex) {
            var sValueText = row.cells[seederColumnIndex].textContent.trim();
            console.log("Row " + rowIndex + " Seeder Value: " + sValueText);

            var sValue = parseInt(sValueText, 10);

            if (!isNaN(sValue) && sValue >= 100) {
                var highlightColor = getHighlightColor(sValue);
                row.style.background = highlightColor; // Highlight based on seeder count
                countHighlighted++;
            }
        });

        console.log(countHighlighted + " rows highlighted");
    }

    // Initial highlighting
    highlightTorrents();

    // Re-apply highlighting every second
    setInterval(highlightTorrents, 1000);
})();
