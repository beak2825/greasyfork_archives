// ==UserScript==
// @name         Zalp's Dumpster Diver
// @namespace    http://hammockc.at/
// @version      2025-05-17
// @description  Highlights items on the market that are cheaper than their recycling value. One's trash is another's treasure. Prices updated as of 2025-05-10.
// @author       simplyzalp [2691559]
// @homepageURL  https://www.torn.com/profiles.php?XID=2691559
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/535604/Zalp%27s%20Dumpster%20Diver.user.js
// @updateURL https://update.greasyfork.org/scripts/535604/Zalp%27s%20Dumpster%20Diver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RECYCLING_PRICES = { // sourced from the Recycling Center wiki
        "Afro Comb": 30000,
        "Beach Ball": 10,
        "Bleaching Tray": 200,
        "Boat Engine": 75500,
        "Broom": 20,
        "Bull Semen": 25000,
        "Bunch of Black Roses": 300,
        "Bunch of Carnations": 15,
        "Bunch of Flowers": 3,
        "Car Battery": 450,
        "Cigar Cutter": 300,
        "Clippers": 220,
        "Compass": 1750,
        "Cosmetics Case": 200,
        "Crazy Straw": 10,
        "Daffodil": 5,
        "Dart Board": 500,
        "Dentures": 2200,
        "Detergent": 35,
        "Dozen Roses": 250,
        "DVD Player": 25,
        "Family Photo": 1,
        "Fire Hydrant": 15000,
        "Fishing Rod": 8000,
        "Floor Cleaner": 35,
        "Formaldehyde": 125,
        "Funeral Wreath": 75,
        "Grain": 150,
        "Hard Drive": 65,
        "Hockey Stick": 300,
        "Headphones": 250,
        "Jade Buddha": 10000,
        "Jigsaw Puzzle": 30,
        "Lipstick": 10,
        "Lubricant": 15,
        "Magazine": 5,
        "Maneki Neko": 35000,
        "Mayan Statue": 350,
        "Microwave": 150,
        "Mix CD": 5,
        "Model Space Ship": 13000,
        "Model Spine": 4000,
        "Mop": 20,
        "Mouthwash": 10,
        "Nodding Turtle": 500,
        "Notepad": 10,
        "Oxygen Tank": 200,
        "Pack of Cuban Cigars": 295,
        "Pack of Music CDs": 20,
        "Pele Charm": 1800,
        "Perfume": 2000,
        "Persian Rug": 22000,
        "Phone Card": 30,
        "Picture Frame": 200,
        "Razor Wire": 4325,
        "RS232 Cable": 15,
        "Scalp Massager": 700,
        "Scrap Metal": 50,
        "Sensu": 300,
        "Sextant": 15000,
        "Shampoo": 20,
        "Shaving Foam": 15,
        "Ship in a Bottle": 25000,
        "Silver Cutlery Set": 2700,
        "Single Red Rose": 100,
        "Snowboard": 4000,
        "Soap on a Rope": 10,
        "Soccer Ball": 30,
        "Stamp Collection": 30000,
        "Stapler": 20,
        "Steel Drum": 1000,
        "Subway Pass": 2000,
        "Tailor's Dummy": 7500,
        "Tin Can": 1,
        "Tire": 90,
        "Towel": 20,
        "Tractor Part": 6500,
        "Travel Mug": 30,
        "Umbrella": 75,
        "Vitamins": 50,
        "Yakitori Lantern": 3000,
        "Yucca Plant": 7500,
    };

    const VERBOSE = false; // if true, prints additional console log messages for debugging.

    function noop() { return; }
    function debugLog(msg) { if (VERBOSE) { console.log(msg); } }
    function debugWarn(msg) { if (VERBOSE)  { console.log(msg); } }
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));


    function checkRecyclingProfits() {
        let marketItemElts = document.querySelectorAll('div[class^=itemTile]');
        for (let e of marketItemElts) {
            let thisItemRecyclingCost = -1;
            let itemNameElt = e.querySelector('div[class^=name]');
            if (itemNameElt == null) {
                console.warn('Could not find the name element for this market item. (This is probably a bug. Sorry!)');
                continue; // continues to next market item
            }
            for (const [key, value] of Object.entries(RECYCLING_PRICES)) {
                debugLog(key);
                debugWarn(itemNameElt.innerHTML);
                if (key == itemNameElt.innerHTML) {
                    thisItemRecyclingCost = value;
                    break; // market item was matched, so no need to keep looking
                }
                // only reached if the current market item's name is not in RECYCLING_PRICES
                debugLog('Item was not found in the recycling list.');
            }
            let itemCostElt = e.querySelector('div[class^=priceAndTotal] span:not([class])');
            if (itemCostElt == null) {
                console.warn('Could not find the price element for this market item. (This is probably a bug. Sorry!)');
                continue; // continues to next market item
            }
            let junkCharsRegex = /(,|\$|\n)/g;
            let thisItemMarketCost = Number(itemCostElt.innerHTML.replaceAll(junkCharsRegex,''));

            if (thisItemMarketCost < thisItemRecyclingCost) {
                e.style.backgroundColor = 'darkred';
                let profitElt = document.createElement('div');
                profitElt.style.fontWeight = 'bold';
                profitElt.innerHTML = `(+$${thisItemRecyclingCost - thisItemMarketCost})`;
                itemCostElt.appendChild(profitElt);
            }
        }
        console.log('Recycling price check complete.');
    }


    let logoHeight = document.querySelector('a.logo-link').style.height;

    let triggerElt = document.createElement('div');
    triggerElt.style.cssText = 'display: block; position: fixed; top: 100px; left: 0; width: 30px; height: 30px; background-color: #441; color: #080; font-size: 24px;  line-height: 30px; text-align: center; cursor: pointer;';
    triggerElt.innerText = '$?';
    triggerElt.addEventListener('click', checkRecyclingProfits);

    document.querySelector('body').appendChild(triggerElt);
    console.log("Zalp's Dumpster Diver loaded successfully. Happy hunting!");

})();