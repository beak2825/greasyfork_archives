// ==UserScript==
// @name         Shiba's GC Giveaway Counter
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Display total number of Giveaways
// @author       Shiba
// @match      https://www.grundos.cafe/giveaways/
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/503634/Shiba%27s%20GC%20Giveaway%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/503634/Shiba%27s%20GC%20Giveaway%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Select all giveaway items
    var giveawayItems = document.querySelectorAll('.giveaway-item');
    var totalGiveaways = 0;
    var enteredGiveaways = 0;

    giveawayItems.forEach(function(item) {
        var title = item.querySelector('.giveaway-title');
        if (title && title.textContent.trim() !== 'Special') {
            totalGiveaways++;
            if (title.textContent.trim() === 'Entered') {
                enteredGiveaways++;
            }
        }
    });

        var countDisplay = document.createElement('div');
    countDisplay.style.position = 'fixed';
    countDisplay.style.top = '10px';
    countDisplay.style.left = '10px';
    countDisplay.style.backgroundColor = '#fff';
    countDisplay.style.padding = '10px';
    countDisplay.style.border = '1px solid #000';
    countDisplay.style.zIndex = '1000';
    countDisplay.textContent = `Total Giveaways: ${totalGiveaways} | Entered: ${enteredGiveaways}`;
    document.body.appendChild(countDisplay);

})();