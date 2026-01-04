// ==UserScript==
// @name         RARBG Torrent Search Results Row Hider
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes rows that match removal lists.
// @author       KeratosAndro4590
// @match        https://rarbg.to/torrents.php*
// @match        https://proxyrarbg.org/torrents.php*
// @icon         https://www.google.com/s2/favicons?domain=rarbg.to
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435310/RARBG%20Torrent%20Search%20Results%20Row%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/435310/RARBG%20Torrent%20Search%20Results%20Row%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Note: Requires the latest jquery

    console.clear();
    console.info("Custom RARBG Row Hider - applying");

    // Items to block: EDIT THESE TWO ARRAYS
    let blockedItems = [
                         "Example1.",
                         "Example2."
                       ];
    // More items to block
    let blockedItems2 = [
                         "Example3.",
                         "Example4."
                        ];

    // STOP EDITS ==========

    // Combines arrays and then sorts the final array
    blockedItems = blockedItems.concat(blockedItems2);
    blockedItems.sort();

    // Loops the rows in the table and then hides a row if text
    // partially matches an item in the 'blockedItems' array
    $.each($(".lista2"),function(){
        let self=$(this);

        console.log("Row: " + self.text());

        blockedItems.forEach((entry) => {
            if(self.text().toLowerCase().includes(entry.toLowerCase()))
            {
                $(this).hide();
                // alert(self.text());
                // $('.lista2').hide();
            }
        });
    });
    console.info("Custom RARBG Row Hider - ended");
})();