// ==UserScript==
// @name         fruitchan
// @namespace    http://github.com/teladi-toaster
// @version      2023-12-16.2
// @license      MIT
// @description  assigns randomly chosen (but deterministic) emoji to replies, to make it easier to remember comment IDs apart
// @author       (You)
// @source       https://github.com/teladi-toaster/fruitchan.git
// @match        https://boards.4channel.org/*
// @match        https://boards.4chan.org/*
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/fruits-vegetables/fruit-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482340/fruitchan.user.js
// @updateURL https://update.greasyfork.org/scripts/482340/fruitchan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const AMENDED_ATTR = "fruitchanAmended";
    const SYMBOLS=[
        {"symbol": "🐵","label": "Monkey face"},
        {"symbol": "🐒","label": "Monkey"},
        {"symbol": "🦍","label": "Gorilla"},
        {"symbol": "🦧","label": "Orangutan"},
        {"symbol": "🐶","label": "Dog face"},
        {"symbol": "🐕","label": "Dog"},
        {"symbol": "🦮","label": "Guide dog"},
        {"symbol": "🐕‍🦺","label": "Service dog"},
        {"symbol": "🐩","label": "Poodle"},
        {"symbol": "🐺","label": "Wolf"},
        {"symbol": "🦊","label": "Fox"},
        {"symbol": "🦝","label": "Racoon"},
        {"symbol": "🐱","label": "Cat face"},
        {"symbol": "🐈","label": "Cat"},
        {"symbol": "🐈‍⬛","label": "Black Cat"},
        {"symbol": "🦁","label": "Lion"},
        {"symbol": "🐯","label": "Tiger face"},
        {"symbol": "🐅","label": "Tiger"},
        {"symbol": "🐆","label": "Leopard"},
        {"symbol": "🐴","label": "Horse face"},
        {"symbol": "🐎","label": "Horse"},
        {"symbol": "🦄","label": "Unicorn"},
        {"symbol": "🦓","label": "Zebra"},
        {"symbol": "🦌","label": "Deer"},
        {"symbol": "🦬","label": "Bison"},
        {"symbol": "🐮","label": "Cow face"},
        {"symbol": "🐄","label": "Cow"},
        {"symbol": "🐂","label": "Ox"},
        {"symbol": "🐃","label": "Water buffalo"},
        {"symbol": "🐷","label": "Pig face"},
        {"symbol": "🐖","label": "Pig"},
        {"symbol": "🐗","label": "Boar"},
        {"symbol": "🐽","label": "Pig nose"},
        {"symbol": "🐏","label": "Ram"},
        {"symbol": "🐑","label": "Ewe"},
        {"symbol": "🐐","label": "Goat"},
        {"symbol": "🐪","label": "Camel"},
        {"symbol": "🐫","label": "Two hump camel"},
        {"symbol": "🦙","label": "Llama"},
        {"symbol": "🦒","label": "Giraffe"},
        {"symbol": "🐘","label": "Elephant"},
        {"symbol": "🦣","label": "Mammoth"},
        {"symbol": "🦏","label": "Rhinoceros"},
        {"symbol": "🦛","label": "Hippopotamus"},
        {"symbol": "🐭","label": "Mouse face"},
        {"symbol": "🐁","label": "Mouse"},
        {"symbol": "🐀","label": "Rat"},
        {"symbol": "🐹","label": "Hamster"},
        {"symbol": "🐰","label": "Rabbit face"},
        {"symbol": "🐇","label": "Rabbit"},
        {"symbol": "🐿","label": "Chipmunk"},
        {"symbol": "🦫","label": "Beaver"},
        {"symbol": "🦔","label": "Hedgehog"},
        {"symbol": "🦇","label": "Bat"},
        {"symbol": "🐻","label": "Bear"},
        {"symbol": "🐻‍❄️","label": "Polar bear"},
        {"symbol": "🐨","label": "Koala"},
        {"symbol": "🐼","label": "Panda"},
        {"symbol": "🦥","label": "Sloth"},
        {"symbol": "🦦","label": "Otter"},
        {"symbol": "🦨","label": "Skunk"},
        {"symbol": "🦘","label": "Kangaroo"},
        {"symbol": "🦡","label": "Badger"},
        {"symbol": "🐾","label": "Paw prints"},
        {"symbol": "🦃","label": "Turkey"},
        {"symbol": "🐔","label": "Chicken"},
        {"symbol": "🐓","label": "Rooster"},
        {"symbol": "🐣","label": "Hatching"},
        {"symbol": "🐤","label": "Baby chick"},
        {"symbol": "🐥","label": "Front-facing chick"},
        {"symbol": "🐦","label": "Bird"},
        {"symbol": "🐦‍⬛","label": "Black bird"},
        {"symbol": "🐧","label": "Penguin"},
        {"symbol": "🕊","label": "Dove"},
        {"symbol": "🦅","label": "Eagle"},
        {"symbol": "🦆","label": "Duck"},
        {"symbol": "🦢","label": "Swan"},
        {"symbol": "🦉","label": "Owl"},
        {"symbol": "🦤","label": "Dodo"},
        {"symbol": "🪶","label": "Feather"},
        {"symbol": "🦩","label": "Flamingo"},
        {"symbol": "🦜","label": "Peacock"},
        {"symbol": "🐸","label": "Frog"},
        {"symbol": "🐊","label": "Crocodile"},
        {"symbol": "🐢","label": "Turtle"},
        {"symbol": "🦎","label": "Lizard"},
        {"symbol": "🐍","label": "Snake"},
        {"symbol": "🐲","label": "Dragon face"},
        {"symbol": "🐉","label": "Dragon"},
        {"symbol": "🦕","label": "Sauropod"},
        {"symbol": "🦖","label": "Tyrannosaurus"},
        {"symbol": "🐳","label": "Spouting whale"},
        {"symbol": "🐋","label": "Whale"},
        {"symbol": "🐬","label": "Dolphin"},
        {"symbol": "🦭","label": "Seal"},
        {"symbol": "🐟","label": "Fish"},
        {"symbol": "🐠","label": "Tropical fish"},
        {"symbol": "🐡","label": "Blowfish"},
        {"symbol": "🦈","label": "Shark"},
        {"symbol": "🐙","label": "Octopus"},
        {"symbol": "🐚","label": "Spiral shell"},
        {"symbol": "🐌","label": "Snail"},
        {"symbol": "🦋","label": "Butterfly"},
        {"symbol": "🐛","label": "Bug"},
        {"symbol": "🐜","label": "Ant"},
        {"symbol": "🐝","label": "Honeybee"},
        {"symbol": "🪲","label": "Beetle"},
        {"symbol": "🐞","label": "Lady Beetle"},
        {"symbol": "🦗","label": "Cricket"},
        {"symbol": "🪳","label": "Cockroach"},
        {"symbol": "🕷","label": "Spider"},
        {"symbol": "🕸","label": "Spider web"},
        {"symbol": "🦂","label": "Scorpion"},
        {"symbol": "🦟","label": "Mosquito"},
        {"symbol": "🪰","label": "Fly"},
        {"symbol": "🪱","label": "Worm"},
        {"symbol": "🦠","label": "Microbe"},
        {"symbol": "💐","label": "Bouquet"},
        {"symbol": "🌸","label": "Cherry blossom"},
        {"symbol": "💮","label": "White flower"},
        {"symbol": "🏵","label": "Rosette"},
        {"symbol": "🌹","label": "Rose"},
        {"symbol": "🥀","label": "Wilted flower"},
        {"symbol": "🌺","label": "Hibiscus"},
        {"symbol": "🌻","label": "Sunflower"},
        {"symbol": "🌼","label": "Blossom"},
        {"symbol": "🌷","label": "Tulip"},
        {"symbol": "🌱","label": "Seedling"},
        {"symbol": "🪴","label": "Potted plant"},
        {"symbol": "🌲","label": "Evergreen tree"},
        {"symbol": "🌳","label": "Deciduous plant"},
        {"symbol": "🌴","label": "Palm tree"},
        {"symbol": "🌵","label": "Cactus"},
        {"symbol": "🌾","label": "Sheaf of rice"},
        {"symbol": "🌿","label": "Herb"},
        {"symbol": "☘","label": "Shamrock"},
        {"symbol": "🍀","label": "Four leaf clover"},
        {"symbol": "🍁","label": "Maple leaf"},
        {"symbol": "🍂","label": "Fallen leaf"},
        {"symbol": "🍃","label": "Leaf fluttering in wind"},
        {"symbol": "🪹","label": "Empty nest"},
        {"symbol": "🪺","label": "Nest with eggs"},
        {"symbol": "🍇","label": "Grapes"},
        {"symbol": "🍈","label": "Melon"},
        {"symbol": "🍉","label": "Water melon"},
        {"symbol": "🍊","label": "Tangerine"},
        {"symbol": "🍋","label": "Lime"},
        {"symbol": "🍌","label": "Banana"},
        {"symbol": "🍍","label": "Pineapple"},
        {"symbol": "🥭","label": "Mango"},
        {"symbol": "🍎","label": "Red apple"},
        {"symbol": "🍏","label": "Green apple"},
        {"symbol": "🍐","label": "Pear"},
        {"symbol": "🍑","label": "Peach"},
        {"symbol": "🍒","label": "Cherries"},
        {"symbol": "🍓","label": "Strawberries"},
        {"symbol": "🫐","label": "Blueberries"},
        {"symbol": "🥝","label": "Kiwi fruit"},
        {"symbol": "🍅","label": "Tomato"},
        {"symbol": "🫒","label": "Olive"},
        {"symbol": "🥥","label": "Coconut"},
        {"symbol": "🥑","label": "Avocado"},
        {"symbol": "🍆","label": "Eggplant"},
        {"symbol": "🥔","label": "Potato"},
        {"symbol": "🥕","label": "Carrot"},
        {"symbol": "🌽","label": "Corn"},
        {"symbol": "🌶","label": "Pepper"},
        {"symbol": "🫑","label": "Bell pepper"},
        {"symbol": "🥒","label": "Cucumber"},
        {"symbol": "🥬","label": "Leafy green"},
        {"symbol": "🥦","label": "Broccoli"},
        {"symbol": "🧄","label": "Garlic"},
        {"symbol": "🧅","label": "Onion"},
        {"symbol": "🍄","label": "Mushroom"},
        {"symbol": "🥜","label": "Peanuts"},
        {"symbol": "🫑","label": "Beans"},
        {"symbol": "🌰","label": "Chestnut"},
        {"symbol": "🍞","label": "Bread"},
        {"symbol": "🥐","label": "Croissant"},
        {"symbol": "🥖","label": "Baguette bread"},
        {"symbol": "🫓","label": "Flat bread"},
        {"symbol": "🥨","label": "Pretzel"},
        {"symbol": "🥯","label": "Bagel"},
        {"symbol": "🥞","label": "Pancake"},
        {"symbol": "🧇","label": "Waffle"},
        {"symbol": "🧀","label": "Cheese wedge"},
        {"symbol": "🍖","label": "Meat with bone"},
        {"symbol": "🍗","label": "Poultry leg"},
        {"symbol": "🥩","label": "Cut of meat"},
        {"symbol": "🥓","label": "Bacon"},
        {"symbol": "🍔","label": "Hamburger"},
        {"symbol": "🍟","label": "French fries"},
        {"symbol": "🍕","label": "Pizza"},
        {"symbol": "🌭","label": "Hot dog"},
        {"symbol": "🥪","label": "Sandwich"},
        {"symbol": "🌮","label": "Taco"},
        {"symbol": "🌯","label": "Burrito"},
        {"symbol": "🫔","label": "Tamale"},
        {"symbol": "🥙","label": "Stuffed flatbread"},
        {"symbol": "🧆","label": "Falafel"},
        {"symbol": "🥚","label": "Egg"},
        {"symbol": "🍳","label": "Cooking"},
        {"symbol": "🥘","label": "Shallow pan of food"},
        {"symbol": "🍲","label": "Pot of food"},
        {"symbol": "🫕","label": "Fondue"},
        {"symbol": "🥣","label": "Bowl with food"},
        {"symbol": "🥗","label": "Green salad"},
        {"symbol": "🍿","label": "Popcorn"},
        {"symbol": "🧈","label": "Butter"},
        {"symbol": "🧂","label": "Salt"},
        {"symbol": "🥫","label": "Canned food"},
        {"symbol": "🍱","label": "Bento box"},
        {"symbol": "🍘","label": "RIce cracker"},
        {"symbol": "🍙","label": "Rice ball"},
        {"symbol": "🍚","label": "Cooked rice"},
        {"symbol": "🍛","label": "Curry rice"},
        {"symbol": "🍜","label": "Steaming bowl"},
        {"symbol": "🍝","label": "Spaghetti"},
        {"symbol": "🍠","label": "Roasted sweet potato"},
        {"symbol": "🍢","label": "Oden"},
        {"symbol": "🍣","label": "Sushi"},
        {"symbol": "🍤","label": "Fried shrimp"},
        {"symbol": "🍥","label": "Fish cake with swiri"},
        {"symbol": "🥮","label": "Moon cake"},
        {"symbol": "🍡","label": "Dango"},
        {"symbol": "🥟","label": "Dumpling"},
        {"symbol": "🥠","label": "Fortune cookie"},
        {"symbol": "🥡","label": "Take out box"},
        {"symbol": "🦀","label": "Crab"},
        {"symbol": "🦞","label": "Lobster"},
        {"symbol": "🦐","label": "Shrimp"},
        {"symbol": "🦑","label": "Squid"},
        {"symbol": "🦪","label": "Oyster"},
        {"symbol": "🍨","label": "Ice cream"},
        {"symbol": "🍧","label": "Shaved ice cream"},
        {"symbol": "🍦","label": "Soft ice cream"},
        {"symbol": "🍩","label": "Doughnut"},
        {"symbol": "🍪","label": "Cookie"},
        {"symbol": "🎂","label": "Birthday cake"},
        {"symbol": "🍰","label": "Short cake"},
        {"symbol": "🧁","label": "Cup cake"},
        {"symbol": "🥧","label": "Pie"},
        {"symbol": "🍫","label": "Chocolate"},
        {"symbol": "🍬","label": "Candy"},
        {"symbol": "🍭","label": "Lollipop"},
        {"symbol": "🍮","label": "Custard"},
        {"symbol": "🍯","label": "Honey pot"},
        {"symbol": "🍼","label": "Baby bottle"},
        {"symbol": "🥛","label": "Glass of milk"},
        {"symbol": "☕","label": "Hot beverage"},
        {"symbol": "🫖","label": "Teapot"},
        {"symbol": "🍵","label": "Teacup without handle"},
        {"symbol": "🍶","label": "Sake"},
        {"symbol": "🍾","label": "Bottle with poppin cork"},
        {"symbol": "🍷","label": "Wine glass"},
        {"symbol": "🍸","label": "Cocktail glass"},
        {"symbol": "🍹","label": "Tropical drink"},
        {"symbol": "🍺","label": "Beer mug"},
        {"symbol": "🍻","label": "Clinking beer mug"},
        {"symbol": "🥂","label": "Clinking glasses"},
        {"symbol": "🥃","label": "Tumbler glass"},
        {"symbol": "🥤","label": "Cup with strawberry"},
        {"symbol": "🧋","label": "Bubble tea"},
        {"symbol": "🧃","label": "Beverage box"},
        {"symbol": "🧉","label": "Mate drink"},
        {"symbol": "🧊","label": "Ice"},
        {"symbol": "🥢","label": "Chopsticks"},
        {"symbol": "🍽","label": "Fork and knife with plate"},
        {"symbol": "🍴","label": "Fork and knife"},
        {"symbol": "🥄","label": "Spoon"},
        {"symbol": "🔪","label": "Kitchen knife"},
        {"symbol": "🧋","label": "Jar"},
        {"symbol": "🏺","label": "Amphora"},
    ];

    function fnv1a(data) {
        const prime = 16777619;
        let hash = 2166136261;
        for(let i=0; i<data.length; i++) {
            hash *= prime;
            hash ^= data[i];
        }
        return hash;
    }
    function fixupNumber(numElem) {
        const reNumStr = /([0-9]+)/;
        let m = numElem.textContent.match(reNumStr)
        if (m == null) { return; };
        let num = m[1];
        let hash = fnv1a(num);
        let symbol = SYMBOLS[Math.abs(hash % SYMBOLS.length)];
        numElem.textContent = numElem.textContent.replace(reNumStr, (m) => {
            return `${m} ${symbol.symbol}`;
        });
        numElem.setAttribute("title", symbol.label);
        numElem.setAttribute(AMENDED_ATTR, AMENDED_ATTR);
    }
    function fixupLink(linkElem) {
        const reNumStr = /(?<=>>)([0-9]+)/;
        let m = linkElem.textContent.match(reNumStr)
        if (m == null) { return; };
        let num = m[1];
        let hash = fnv1a(num);
        let symbol = SYMBOLS[Math.abs(hash % SYMBOLS.length)];
        linkElem.textContent = linkElem.textContent.replace(reNumStr, (m) => {
            return `${m} ${symbol.symbol}`;
        });
        linkElem.setAttribute("title", symbol.label);
        linkElem.setAttribute(AMENDED_ATTR, AMENDED_ATTR);
    }
    function fixupLinks() {
        var numbers = document.querySelectorAll(`.postNum.desktop a:nth-child(2):not([${AMENDED_ATTR}])`);
        numbers.forEach(fixupNumber);
        var links = document.querySelectorAll(`.quotelink:not([${AMENDED_ATTR}])`);
        links.forEach(fixupLink);
        // 4chanx/onee-chan
        var backlinks = document.querySelectorAll(`a.backlink:not([${AMENDED_ATTR}])`);
        backlinks.forEach(fixupLink);
    }
    function changeCallback(mutationList, observer) {
        fixupLinks();
    }

    const obsConfig = { childList: true };
    const observer = new MutationObserver(changeCallback);
    window.addEventListener('load', function() {
        const thread = document.querySelector(".thread");
        const board = document.querySelector(".board");
        const body = document.querySelector("body");
        if(thread) { observer.observe(thread, obsConfig); }
        if(board) { observer.observe(board, obsConfig); } // browsing All
        observer.observe(body, obsConfig); // hover preview
        fixupLinks();
    }, false);
})();
