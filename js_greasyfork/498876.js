// ==UserScript==
// @name         Grundos Cafe Quickstock Auto Discard
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Automatically checks "discard" in quickstock for worthless items.
// @author       Dij
// @match        https://www.grundos.cafe/quickstock/
// @match        https://grundos.cafe/quickstock/
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/498876/Grundos%20Cafe%20Quickstock%20Auto%20Discard.user.js
// @updateURL https://update.greasyfork.org/scripts/498876/Grundos%20Cafe%20Quickstock%20Auto%20Discard.meta.js
// ==/UserScript==
const defaultDiscard = [ // Fishing
    "Broken Toy Sailboat","Old Rotten Left Sandal", "Old Rotten Left Shoe","Old Rotten Left Boot",
    "Old Rotten Right Sandal", "Old Rotten Right Shoe","Old Rotten Right Boot", "Petrified Bone",
    "Enormous Fake Diamond", "Rusty Old Can","Giant Bath Plug", "Fish Scale Breastplate", "17-Pound Trout",
    "Shiny Shoal Shell Shield", "Cheap Water Ring", "Dull Grey Pearl", "Water Mote", "Water Muffin", "Bubble Mote",
    "Magical Healing Potion", "Ultra Bubble Beam", "Water Faerie Water Blaster", "Necklace of the Water Faerie",
    "The Old Mynci and the Sea", "Fishing Made Easy", "Slimy Bog Scroll", "Mouldy Tome", "On Gelert Pond", "Waterlogged Book",
    "Nupie", "Surzard", "Noak", "Yoakie", "Mundo", "Kora", "Lurman", "Splime", "Rotting Driftwood", "Watery Hot Dog",
    "Landfish", "Rockfish", "Chaosfish", "Breadfish", "Eyefish", "Blandfish", "Scrawnyfish", "Bombfish", "Transparifish",
    "Bombfish", "Doomfish", "Madfish", "Cubefish","Spectral Shrimp", "Tyrannian Mechafish", "Golden Mechafish",
    "Diseased Mechafish", "Glistening Mechafish", "Frozen Mechafish", "Spooky Mechafish", "Tanglepus", "Waterfish",
    "Inferno Mollusk", "Fractalpus", "Lesser Spotted Fish", "Neopet-Eating Carp", "Scroll of the Sea", "Pike Pike",
    "Small Giant Squid", "Large Giant Squid", "Giant Giant Squid", "Titanic Giant Squid", "Smooth Black Sphere",
    "Radarfish", "Rotten Beetroot", "Broken Fishing Pole", "Mouldy Petpet Bed", "Hovering Four-Dimensional Pyramid",
    "Butterfish",
    // Tombola
    "Reject Curly Shaped Sand", "Volcanic Rock", "Surfboard Keyring", "Tombola Pencil Sharpener", "Unlabelled Tin Can",
    "Palm Fan", "Pickled Olives", "Sandals", "Toy Sailboat", "Super Toy Sailboat", "Coconut Keyring",
    "Souvenir Magnet", "Tombola Aisha Keyring", "Tombola Visor", "Half Coconut Shell", "Reject Star Shaped Sand",
    "Reject Flower Shaped Sand", "Tombola T-shirt", "Dried Prunes", "Jelly Float", "Brown Sauce", "Dandelion and Burdock Drink",
    "Can of Prune Juice",
    // those kings
    "King Hagan", "Keeping the Peace", "Cartography For Beginners", "Brightvale Maps", "Brightvale Castle",
    // Buried Treasure
    "Maggoty Spud", "Buried Burger", "Rancid Old Meat", "Snout Plant", "Rock Baby Cabbages", "Spongy Mound", "Yellow Growth",
    // Pick your own, but not your nose
    "Bit of Barbed Wire", "Piece of Wool", "Old Boot", "Half-eaten Berry", "Rotten Berry",
    // Non Gourmet Berries
    "Unguberry", "Blue Bomberry", "Eyeballberry", "Jumbleberry", "Conkerberry", "Purple Felberry", "Voidberry",
    "Red Chiaberry", "Super Juicy Berry", "Sniddberry", "Pusberry", "Mortogberry", "Dorkleberry", "Spoogentberry",
    "Aquaberry", "Brown Broadberry", "Orange Graspberry", "Burritoberry", "Breenutberry", "Autumnberry", "Benyeroberry",
    "Strebbleberry", "Orfaberry", "Stinkberry", "Edgyberry",
    // Rubbish Dump
    "Old Paper", "Broken Spoon", "Old Croutons", "Baby Haystack", "Meridell Gravy", "Packet of Gravel", "Muddy Bone",
    "Strange Green Seeds", "Squished Tomato", "UFFH", "Soggy Old Box",
    // Coltzan
    "Serf Lens", "Spoiled Sphinx Links", "Peanut Butter and Jam Shield", "Omelette Shield", "Toasted Pyramibread",
    "Scorched Pyramicake", "Broken Corn Pyramid", "Damaged Bagguss", "Ruined Ptolymelon", "Mangled Geopeppers",
    "Scorched Grackle-Stuffed Turkey", "Scorched Sutek Muffin", "Rotten Puntec Fruit", "Scorched Tut Trout",
    "Burnt Grackle Bug on a Stick", "Cracked Mummified Pepper", "Burnt Scarab Cookie", "Scorched Cheops Plant",
    "Burnt Red Eye Egg", "Damaged Ummagine", "Squashed Tchea Fruit", "Scorched Sutek Beans", "Scorched Suti Fruit",
    "Scorched Chomato", "Scorched Gobi Fruit", "Scorched Pleto", "Scorched Cheopple", "Perfectly Flat Rock Shield",
    "Clay Shield", "Stone Shield", "Wooden Shield", "Tchea Fruit", "Sphinx Links", "Cheopple",
    // Tyrannian furniture
    "Stone Side Table", "Stone Wardrobe", "Stone Cool Box", "Stone Shelves", "Hewn Stone Table", "Small Stone Table",
    "Stone Pot", "Stone Carpet", "Stone Box", "Stone Chair", "Hewn Stone Bed", "Hewn Stone Chair", "Stone Sofa", "Rock Chair",
    "Stone Kitchen Shelf Unit", "Stone Rug", "Stone Tablet", "Stone Pot", "Straw Bed", "Straw Chair", "Straw Desk",
    "Straw Sofa", "Straw Sofa Chair",
    // Snowballs
    "Poison Snowball", "Wet Snowball", "Yellow Snowball", "Sand Snowball", "Evil Snowball", "Peach Snowball", "Exploding Snowball",
    // Misc
    "Healing Potion I", "Healing Potion II", "Poisonous Jelly", "Glowing Jelly", "Half Eaten Poisonous Jelly",
    "Jhudora T-Shirt", "Poisonous Lollipop", "Bat Pack", "Feather Tickler", "Straw Chair", "Scarab Ring", "Squished Jelly",
    "Mummmified Jelly", "Half Eaten Glowing Jelly", "Snotty Jelly", "Jhudoras Brush", "Purple Blob Potion"
];

(function() {
    'use strict';
    const quickstock = document.querySelector("main .market_grid");
    if (!quickstock) {return;}
    const gridLength = quickstock.querySelectorAll(".header").length;

    let quickstockNames = quickstock.querySelectorAll(".data.justify-right");
    // Grab gallery offset
    let quickstockData = quickstock.querySelectorAll(`.data`);
    for (let i = 0; i < quickstockNames.length; i++) {
        if (defaultDiscard.includes(quickstockNames[i].innerText)) {
            quickstockData[gridLength*i + 4].children[0].checked = true;
        }
    }
})();