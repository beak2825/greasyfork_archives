// ==UserScript==
// @name         Auto Deposit Fishing Junk
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.0
// @description  Automatically marks fishing junk to be deposited in the Quick Stock page, for AzureFlame.
// @author       Twiggies
// @match        https://www.grundos.cafe/quickstock/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489362/Auto%20Deposit%20Fishing%20Junk.user.js
// @updateURL https://update.greasyfork.org/scripts/489362/Auto%20Deposit%20Fishing%20Junk.meta.js
// ==/UserScript==

//Fishing junk list. Add or remove items from this array.
const junkList = ["Spectral Shrimp", "Magic Crystalline Kelp", "Shiny Sloth Head", "Madfish", "Starry Sea Fern", "Cave Rock", "Rockfish", "Large Giant Squid", "Giant Green Kelp", "Shimmery Seagrass", "Bombfish", "Nupie", "Cheery Plant", "Lurman", "Bag of Broken Neopoints", "Glistening Mechafish", "Broken Fishing Pole", "Dull Grey Pearl", "Old Rotten Right Boot", "Spooky Mechafish", "Old Rotten Left Boot", "Plushie Fungus", "Water Mote", "Mundo", "Pant Devil Attractor", "Lesser Spotted Fish", "Fishing Made Easy", "Landfish", "Mouldy Petpet Bed", "Chaosfish", "Frozen Mechafish", "Plushie Clam", "Bucket of Sludge", "Splime", "Kora", "Bubble Mote", "Darigan Seaweed", "Giant Bath Plug", "Broken Toy Sailboat", "Giant Red Kelp", "Prismatic Sea Fern", "Titanic Giant Squid", "Healing Potion XV", "Underwater Map Piece 8", "Waterlogged Book", "Water Muffin", "Tanglepus", "Strange Glowing Disc", "On Gelert Pond", "Golden Mechafish", "Old Rotten Left Shoe", "Giant Giant Squid", "Radarfish", "Rotten Beetroot", "Old Rotten Right Sandal", "Petrified Bone", "Doomfish", "Noak", "Cinder Block Sea Fungus", "Mouldy Tome", "The Old Mynci and the Sea", "Enormous Fake Diamond", "Glowing Wooden Mask", "Inferno Mollusk", "Scrawnyfish", "Slimy Bog Scroll", "Surzard", "Cubefish", "Grey Sea Fern", "Rotting Driftwood", "Waterfish", "Giant Brown Kelp", "Transparifish", "Blandfish", "Diseased Mechafish", "Void Plant", "Mossy Rock", "Small Giant Squid", "Breadfish", "Flask of Clear, Odourless Liquid", "Tyrannian Mechafish", "Necklace of the Water Faerie", "Fractalpus", "Spongy Algae", "Rusty Old Can", "Butterfish", "Cheap Water Ring", "Underwater Map Piece 7", "Old Rotten Right Shoe", "Old Rotten Left Sandal", "Eyefish", "Molten Borovan Rod", "Underwater Map Piece 3", "Cubical Sea Fungus", "Scroll of the Sea", "Watery Hot Dog", "Yoakie", "Underwater Map Piece 4", "Underwater Map Piece 5", "Gravitic Urn", "17-Pound Trout", "Water Faerie Water Blaster", "Ultra Bubble Beam", "Underwater Map Piece 9", "Leminty Elixir of Healing", "Irritable Genie-in-a-Bottle", "Magical Healing Potion", "Flask of Rainbow Fountain Water", "Hovering Four-Dimensional Pyramid", "Underwater Map Piece 1", "Smooth Black Sphere", "Pike Pike", "King Kelpbeards Blessing", "The Two Ring", "Underwater Map Piece 6", "Shiny Shoal Shell Shield", "Battle Plunger", "Golden Meepit Statue", "Underwater Map Piece 2", "Obelisk of Doom", "Neopet-Eating Carp", "Fish Scale Breastplate", "Proto-Goldy", "Blumpy", "Proto-Smiley", "Gomer", "Squeaky", "Alfy", "Cleo", "Conehead", "Speck", "Boris", "Gumdrop", "Proto-Sharky", "Proto-Gulper"]

//Get the list of items
const itemList = document.querySelectorAll('div.data.justify-right.align-right')

//Loop through each item...

for (let i = 0; i < itemList.length; i++) {
    const itemText = itemList[i].innerText.trim();
    console.log(itemText);
    //If the item matches an item in the list...
    if (junkList.includes(itemText)) {
        //Get the 2nd next element (this will be the element housing the deposit radio button) and then the first child of that element (which will be the actual input) and mark it as done
        itemList[i].nextElementSibling.nextElementSibling.firstElementChild.checked = true;
    }
}