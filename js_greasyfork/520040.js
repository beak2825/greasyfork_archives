// ==UserScript==
// @name         chdbits已下载高亮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the background color of the second column in a specific table.
// @author       Your Name
// @match        https://ptchdbits.co/torrents.php*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520040/chdbits%E5%B7%B2%E4%B8%8B%E8%BD%BD%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/520040/chdbits%E5%B7%B2%E4%B8%8B%E8%BD%BD%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var wholepage = document.querySelectorAll('body > table.mainouter');
        wholepage[0].style = "width:60%";

    // Wait for the DOM to fully load
    window.addEventListener('load', function () {



        // Get all the second <td> elements in the specified table rows
        var rows = document.querySelectorAll('table.torrents > tbody > tr ');
        for (var i = 1; i < rows.length; i++) {
    var percentCell = rows[i].querySelector('td:nth-child(10)');
    if (percentCell && percentCell.innerText !== "--") {
        var percentText = percentCell.innerText.trim();
        var titleBar = rows[i].querySelector('td:nth-child(2) > table.torrentname > tbody > tr');
        var percentValue = parseFloat(percentText.replace('%', '')); // Convert percentage to a number

        // Determine the background color based on the percentage value
        var backgroundColor = "";
        if (percentValue === 100) {
            backgroundColor = "#35f41a"; // Green for 100%
        } else if (percentValue >= 71 && percentValue <= 99) {
            backgroundColor = "#cdfa78"; // Light green for 71-99%
        } else if (percentValue >= 30 && percentValue <= 70) {
            backgroundColor = "#FFC300"; // Yellow for 30-70%
        } else if (percentValue >= 1 && percentValue <= 30) {
            backgroundColor = "#fa8f78"; // Orange for 1-30%
        } else if (percentValue === 0) {
            backgroundColor = "#fc3a10"; // Red for 0%
        }

        // Apply the background color to the row and title bar
        rows[i].style.backgroundColor = backgroundColor;

            titleBar.style.backgroundColor = backgroundColor;

    }
}

    });
})();
