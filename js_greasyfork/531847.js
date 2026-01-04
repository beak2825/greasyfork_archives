// ==UserScript==
// @name         Highlight Specific Neopets Shop Items (Text Highlight Version)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds yellow highlight to specific items on the Neopets shop page
// @author       You
// @match        https://www.neopets.com/objects.phtml?obj_type=1&type=shop*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531847/Highlight%20Specific%20Neopets%20Shop%20Items%20%28Text%20Highlight%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531847/Highlight%20Specific%20Neopets%20Shop%20Items%20%28Text%20Highlight%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const itemsToHighlight = [
        // Original list
        "animal-style chips", "big gulp neocola", "black currant juice", "onion and mustard pie",
        "mighty steakwich", "chocolate coated cheese strings", "green picnic hamper", "blt croissant",
        "egg and tomato sandwich", "chain of onions", "candy floss carrot", "mutated negg", "rainbow carrot",
        "borovan hot chocolate bomb", "fancy rack of lamb with fruit", "kadoatie biscuits", "plum",
        "acara ice cream surprise", "red picnic hamper", "puzzle fruit", "tigersquash custard",
        "lawyerbot degreaser", "cheesy strawberry slice", "rainbow cybunny negg",
        "chocolate coated holey cheese", "glowing apple", "assorted vandagyre approved nuts",
        "pretty purple princess negg", "cheesy krawk dip", "uni salad", "blue picnic hamper",
        "chocolate coated cheese", "upside down ice cream", "raspberry toffee apple", "le sausage",
        "donut burger", "starry cupcake", "illusens family recipe cake", "honey and bacon burger",
        "rainbow apple", "bag of peanuts", "yellow negg", "purple negg", "partitioned negg",
        "blueberry jelly doughnut", "pink negg", "swirly negg #498", "orange negg",

        // New additions
        "snot sandwich", "strawberry ixi fizzy drink", "sketch eggs", "grootafruit punch",
        "chocolate chip gelert ice cream sandwich", "egg pate", "kyrii dewy apple milkshake",
        "chocolate aisha sundae", "number fruit leather", "aisha tomato and potato soup",
        "deep-fried mac-n-cheese loaf", "granola parfait", "strawberry gelert shake",
        "fruit krawk pot", "spicy bbq chomby crisps", "chokato cream cheese dip", "deluxe ham sub",
        "eggy weggs", "ogrin pasta", "twirly fruit flavoured milk", "neggdrop soup",
        "strawberry parfait", "pickled apples", "blue bruce juice", "bubbly rhuby fruit juice",
        "xweetok sugar cookies", "chestnut shortcake", "draik salad", "kau kau farm soy milk",
        "fruit punch roll", "korbat pasta and meatballs", "edible argyle socks", "french toast",
        "bubbly harffel fruit juice", "raspberry basket", "leafy krawk pot", "carrots in salad",
        "uni crisps", "tarragon achyfi", "xweetok hot chocolate", "paper-wrapped chicken",
        "skull-n-bones pasta", "paper-wrapped salmon", "hash browns", "dubloon nuggets",
        "mouldy mini kau cheese wheel", "cheese negg", "fruity aisha sundae", "disco toast", "disco ice cream", "waffle burger", "bangers and mash", "heart shaped negg"
    ];

    function highlightItems() {
        const boldElements = document.querySelectorAll('b');

        boldElements.forEach(b => {
            const itemName = b.textContent.trim().toLowerCase();

            if (itemsToHighlight.includes(itemName)) {
                b.style.backgroundColor = 'yellow';
                b.style.fontWeight = 'bold';

                const container = b.closest('tr');
                if (container) {
                    container.style.outline = '3px solid yellow';
                    container.style.outlineOffset = '-2px';
                }
            }
        });
    }

    window.addEventListener('load', highlightItems);
})();
