// ==UserScript==
// @name         XYZ Achievement AH Finder
// @version      0.3
// @description  When on the AH Dragons search page, marks any dragon which is an XYZ where each color is one off from the previous, acsending. Currently does not get wraparound edge cases like Pearl-Maize-Cream.
// @author       Triggernometry
// @namespace    https://greasyfork.org/en/users/999683
// @match        https://www1.flightrising.com/auction-house/buy/realm/dragons*
// @match        https://www1.flightrising.com/auction-house/buy/flight/dragons*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/468592/XYZ%20Achievement%20AH%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/468592/XYZ%20Achievement%20AH%20Finder.meta.js
// ==/UserScript==

// TODO: scrape this from search list instead, for future-proofing

const ordered_dragon_colors = [
    "Maize", "Cream", "Antique", "White", "Moon", "Ice", "Orca", "Platinum", "Silver", "Dust", "Grey", "Smoke","Gloom",
    "Lead", "Shale", "Flint", "Charcoal", "Coal", "Oilslick", "Black", "Obsidian", "Eldritch", "Midnight", "Shadow",
    "Blackberry", "Mulberry", "Plum", "Wisteria", "Thistle", "Fog", "Mist", "Lavender", "Heather", "Purple", "Orchid",
    "Amethyst", "Nightshade", "Violet", "Grape", "Royal", "Eggplant", "Iris", "Storm", "Twilight", "Indigo", "Sapphire",
    "Navy", "Cobalt", "Ultramarine", "Blue", "Periwinkle", "Lapis", "Splash", "Cornflower", "Sky", "Stonewash",
    "Overcast", "Steel", "Denim", "Abyss", "Phthalo", "Azure", "Caribbean", "Teal", "Cerulean", "Cyan", "Robin", "Aqua",
    "Turquoise", "Spruce", "Pistachio", "Seafoam", "Mint", "Jade", "Spearmint", "Thicket", "Peacock", "Emerald",
    "Shamrock", "Jungle", "Hunter", "Forest", "Camo", "Algae", "Swamp", "Avocado", "Green", "Fern", "Mantis", "Pear",
    "Leaf", "Radioactive", "Honeydew", "Peridot", "Chartreuse", "Spring", "Crocodile", "Olive", "Murk", "Moss",
    "Goldenrod", "Amber", "Honey", "Lemon", "Yellow", "Grapefruit", "Banana", "Sanddollar", "Flaxen", "Ivory",
    "Buttercup", "Gold", "Metals", "Marigold", "Sunshine", "Saffron", "Sunset", "Peach", "Cantaloupe", "Orange",
    "Bronze", "Terracotta", "Carrot", "Fire", "Pumpkin", "Tangerine", "Cinnamon", "Caramel", "Sand", "Tan", "Beige",
    "Stone", "Taupe", "Slate", "Driftwood", "Latte", "Dirt", "Clay", "Sable", "Umber", "Soil", "Hickory", "Tarnish",
    "Ginger", "Brown", "Chocolate", "Auburn", "Copper", "Rust", "Tomato", "Vermilion", "Ruby", "Cherry", "Crimson",
    "Garnet", "Sanguine", "Blood", "Maroon", "Berry", "Red", "Strawberry", "Cerise", "Carmine", "Brick", "Coral",
    "Blush", "Cottoncandy", "Watermelon", "Magenta", "Fuchsia", "Raspberry", "Wine", "Mauve", "Pink", "Bubblegum",
    "Rose", "Pearl"
];

function main() {
    // only when the search criteria is XYZ
    if (window.location.href.includes("d_pattern=XYZ")) {
        // gather list of dragons on page
        var dragon_icons = $('div.ah-listing-row');

        // get IDs and colors
        dragon_icons.each( function( index, element ){
            var dragon_id = element.attributes["data-listing-dragonid"].nodeValue;

            // find dragon tooltip, and its children
            var dragon_tooltip = $(`#dragontip-${dragon_id} > div > div`);

            // order doesn't matter, so just add ids
            var dragon_colors = [];

            // find children with thier own span child
            dragon_tooltip.each( function( index, element ){
                if(element.children && element.firstChild.localName == "span") {
                    if(["Primary Gene:", "Secondary Gene:", "Tertiary Gene:"].includes(element.firstChild.innerText)) {
                        // get text, trim whitespace, then get just the color without the gene
                        // finally, index the color agains the master list
                        var color = element.lastChild.textContent.trim().split(" ")[0];
                        color = ordered_dragon_colors.indexOf(color);
                        dragon_colors.push(color);
                    }
                    else {
                        // nothing to do, placeholder for future improvements
                        ;
                    }
                }
            });
            // order ids ascending
            dragon_colors.sort(function(a, b){return a>b});
            // a + 1 = b, b + 1 = c => a + 2 = c
            var ids = [(dragon_colors[0] + 2), (dragon_colors[1] + 1), dragon_colors[2]];
            // reduce to unique value(s)
            ids = ids.filter((value, index, array) => array.indexOf(value) === index);

            if ( ids.length == 1 ) {
                // log to console
                console.log(element);
                // hilight element with a border
                $(this).css( "border", "3px solid red" );
                // scroll to this dragon (will scroll to each, so final scroll will be last matching dragon on page)
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#' + element.id).offset().top
                }, 2000);
            }

        });
    }
}

// wait until page load, then run main
$(document).ready(main);