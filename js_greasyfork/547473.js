// ==UserScript==
// @name        GC - Underwater Fishing Reward Sorting
// @namespace   Grundo's Cafe
// @match       https://www.grundos.cafe/water/fishing/
// @version     1.2
// @license     MIT
// @author      Twiggies, Dark_Kyuubi
// @icon        https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @description Fishing rewards sorting.
// @downloadURL https://update.greasyfork.org/scripts/547473/GC%20-%20Underwater%20Fishing%20Reward%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/547473/GC%20-%20Underwater%20Fishing%20Reward%20Sorting.meta.js
// ==/UserScript==

//Variant of Cupkait's script. 
let prizes = [
    { item: "Paint Brush", color: "black" },
    { item: "Underwater Map Piece", color: "black" },
    { item: "Mystical Fish Lobber", color: "black" },
    { item: "Battle Plunger", color: "black" },
    { item: "King Kelpbeards Blessing", color: "black" },
    { item: "Golden Meepit Statue", color: "black" },
    { item: "Mysterious Swirly Potion", color: "black" },
    { item: "Flask of Rainbow Fountain Water", color: "black" },
    { item: "Flask of Clear, Odourless Liquid", color: "black" },
    { item: "Genie-in-a-Bottle", color: "black" },
    { item: "Spotted Karp", color: "black" },
    { item: "Pant Devil Attractor", color: "black" },
    { item: "Spooky Treasure Map", color: "#993301" },
    { item: "Auntie", color: "aquamarine" },
    { item: "Blumpy", color: "aquamarine" },
    { item: "Boris", color: "aquamarine" },
    { item: "Proto-Bubbles", color: "aquamarine" },
    { item: "Cleo", color: "aquamarine" },
    { item: "Clippers", color: "aquamarine" },
    { item: "Conehead", color: "aquamarine" },
    { item: "Proto-Crabby", color: "aquamarine" },
    { item: "Flapjack", color: "aquamarine" },
    { item: "Proto-Flippy", color: "aquamarine" },
    { item: "Proto-Goldy", color: "aquamarine" },
    { item: "Gomer", color: "aquamarine" },
    { item: "Proto-Gulper", color: "aquamarine" },
    { item: "Gumdrop", color: "aquamarine" },
    { item: "Legs", color: "aquamarine" },
    { item: "Phishy", color: "aquamarine" },
    { item: "Pinky", color: "aquamarine" },
    { item: "Pokey", color: "aquamarine" },
    { item: "Prince", color: "aquamarine" },
    { item: "Prissy", color: "aquamarine" },
    { item: "Ruby", color: "aquamarine" },
    { item: "Seamonkeys", color: "aquamarine" },
    { item: "Proto-Sharky", color: "aquamarine" },
    { item: "Sluggo", color: "aquamarine" },
    { item: "Proto-Smiley", color: "aquamarine" },
    { item: "Snappy", color: "aquamarine" },
    { item: "Speck", color: "aquamarine" },
    { item: "Swirly", color: "aquamarine" },
    { item: "Scruffy", color: "aquamarine" }
];

if (window.location.href.endsWith('settings')) {
    document.querySelector('main').remove();
}

async function collectFishingResults() {


    const resultsList = document.querySelectorAll('.center-items');
    const resultsDiv = document.querySelector('.flex-column')
    let highlights = false;
    const goodPrizes = document.createElement('div');


    if (resultsList.length > 0) {

        resultsList.forEach(result => {
            var item = result.querySelector('p').textContent.match(/ a (.*?)!/)[1];

            const prize = prizes.find(prize => item.includes(prize.item));
            if (prize) {
                highlights = true
                goodPrizes.append(result);
            }
        });

        if (highlights === true) {

            const fishingstyle = document.createElement('style');
            fishingstyle.innerHTML = `
    .center-items img {
        transform: translate3d(0, 0, 0);
        mix-blend-mode: multiply;
    }
`;

            //document.head.appendChild(fishingstyle);
            goodPrizes.classList.add("center-items");
            goodPrizes.style.backgroundColor = "#efef404f";
            goodPrizes.style.border = "2px solid black"
            resultsDiv.insertAdjacentElement('beforebegin', goodPrizes);
        }


    }
}

// Only collect results if you've actually attempted to fish.
if (document.referrer.endsWith("/water/fishing/") && document.querySelector('main').textContent.includes("You reel in your line and get")) {
    collectFishingResults();
}