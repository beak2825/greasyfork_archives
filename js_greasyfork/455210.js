// ==UserScript==
// @name         Displaycase Item Sets
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Get plushie and flower sets
// @author       olesien
// @match        https://www.torn.com/displaycase*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455210/Displaycase%20Item%20Sets.user.js
// @updateURL https://update.greasyfork.org/scripts/455210/Displaycase%20Item%20Sets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener(
        "load",
        function () {
            //DOM has loaded
            setTimeout(() => doIt(), 200);
        },
        false
    );

    const plushieIds = [258, 261, 266, 268, 269, 273, 274, 281, 384, 618];
    const flowerIds = [260, 263, 264, 267, 271, 272, 276, 277, 282, 385, 617]

    function doIt() {
        const infoBoxEl = document.querySelector(".display-main-page");

        //Create item box
        const divEl = document.createElement("div");

        //Grab items
        const items = Array.from(document.querySelectorAll("li.torn-divider"));

        //Function to get lowest set count
        const getSets = (items, itemIds) => {
            const itemMisc = itemIds.map((itemId) => ({id: itemId, count: 0}));

            items.forEach((itemEl) => {
               const itemImageEl = itemEl.querySelector("img.torn-item");
                const source = itemImageEl.src;
                ///images/items/16/large.png
                const id = Number(source.replace(/\D/g,''));
                const itemIndex = itemMisc.findIndex((item) => item.id == id);
                if (itemIndex >= 0) {
                   //exists

                    //Get count
                    const countEl = itemEl.querySelector(".b-item-amount");
                    const count = Number(countEl.innerText.replace(/\D/g,''));

                    //Replace array index
                    itemMisc.splice(itemIndex, 1, {id, count})

                }
            })

            //Reduce to lowest count in array
            return itemMisc.reduce((prev, curr) => (prev.count < curr.count ? prev : curr)).count
        }

        const plushieSets = getSets(items, plushieIds)

        const flowerSets = getSets(items, flowerIds)

        //Add text
        divEl.innerText = `Plushie sets: ${plushieSets} | Flower sets: ${flowerSets}`;
        //Append to box
        infoBoxEl.insertBefore(divEl, infoBoxEl.firstChild);
    }
})();