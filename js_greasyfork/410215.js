// ==UserScript==
// @name         Shop autobuyer BETA
// @version      2021.01.03
// @namespace    neopets
// @description  Autobuy
// @author       iiTANGGUO :) :)
// @match        http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @match        http://www.neopets.com/objects.phtml?obj_type=*&type=shop
// @match        http://www.neopets.com/haggle.phtml*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410215/Shop%20autobuyer%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/410215/Shop%20autobuyer%20BETA.meta.js
// ==/UserScript==

(function () {

    if (document.title.includes("Bad Gateway")) {
        location.reload();
        return false;
    }

    // Exit if not using beta site
    if ($("[class^='nav-pet-menu-icon']").length < 1) {
        return false;
    }

    /******************************************************
     *  Settings
     *
     ******************************************************/

    let times_profit = 2.25;

    let [minRefresh, maxRefresh] = [900, 5400];

    let delayWhenStocked = 1500;
    let delay_newRestock = 40000;

    let longPauseTime = 60000;
    let longPauseFrequency = 0;

    let shopBanTimeLimit = 50; // Value in minutes
    let refreshLimit = 350;

    /******************************************************
     *  Initialise
     *
     ******************************************************/

    const d = document;
    const url = window.location.href;

    const digitSeparator = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const NST = `[${$("#nst").text().replace(/ NST/g, "")}]`;

    if (!GM_getValue) {
        GM_getValue = (key, def) => localStorage[key] || def;
        GM_setValue = (key, value) => localStorage[key] = value;
    }

    // Toggle auto modes
    if (!GM_getValue("Mode")) {
        let Mode = {
            autoclick : true,
            autorefresh : true,
            highlight : false,
            autobuy : true,
            pin : false,
            pricecheck : true
        };
        GM_setValue("Mode", Mode);
    }
    var Mode = GM_getValue("Mode");

    /******************************************************
     *  Shop page
     *
     ******************************************************/

    if (url.includes("type=shop")) {

        // Check for shop ban
        if (!GM_getValue("ban")) {
            let ban = {
                startTime : new Date().getTime(),
                currentTime : new Date().getTime(),
                refreshCount : 0,
                isNoStockBefore : false,
                banned : false
            };
            GM_setValue("ban", ban);
        }
        var ban = GM_getValue("ban");

        // Shop stock
        if (!GM_getValue("Stock")) {
            let Stock = {
                prev : 0,
                current : 0,
                blacklist : []
            };
            GM_setValue("Stock", Stock);
        }
        var Stock = GM_getValue("Stock");

        /******************************************************
         *  Item list
         *
         ******************************************************/

        const r100 = 0;
        const r99 = 0;

        const itemList = {
            get shop1() {// Neopian Fresh Foods
                return [
                    // r100
                    ["Baby Bloater", 0, 100], // Inflation Notice
                    ["Banana Grub", 5000, 100],
                    ["Barnacle Bills Belt Busting Burger", 0, 100], // No price
                    ["Berry Joy Fun Pop", 0, 100], // No price
                    ["Bilge Rat Madeira", 0, 100], // No price
                    ["Blueberry and Oyster Ice Cream", 0, 100], // No price
                    ["Bomberry Grog", 620000, 100],
                    ["Caesar Salad", 6000, 100],
                    ["Cannon Fodder", 0, 100], // No price
                    ["Capn Threelegs Cutlass Crusade", 0, 100], // No price
                    ["Cherry Pop", 0, 100], // No price
                    ["Chocolate Joy Fun Pop", 920000, 100],
                    ["Chocolate Sandwich", 0, 100], // No price
                    ["Chocolately Cheese Wedges", 0, 100], // No price
                    ["Crusty Clam Surprise", 20000, 100],
                    ["Double Stuffed Guppy", 20000, 100],
                    ["ErgyFruit Grog", 0, 100], // No price
                    ["Fish Negg Stew", 0, 100], // No price
                    ["Forbidden Plunder", 0, 100], // No price
                    ["Grape Pop", 0, 100], // No price
                    ["Grog Light", 0, 100], // Inflation Notice
                    ["Headless Horsefish", 0, 100], // No price
                    ["Hogshead", 0, 100], // Inflation Notice
                    ["Keel Haul", 0, 100], // Inflation Notice
                    ["Krakuberry Cove", 0, 100], // No price
                    ["Krakuberry Grog", 0, 100], // No price
                    ["Land Lubber", 0, 100], // Inflation Notice
                    ["Lemon Pop", 0, 100], // Inflation Notice
                    ["Lime Negg", 0, 100], // No price
                    ["Loretta Fontaines Perfect Pizza", 0, 100], // No price
                    ["Man O War", 0, 100], // No price
                    ["Mocha Joy Fun Pop", 0, 100], // No price
                    ["Our Famous Krawk Pie", 0, 100], // No price
                    ["Oyster Obsession", 26000, 100],
                    ["Pinanna Paradise", 0, 100], // No price
                    ["Raspberry Pop", 0, 100], // No price
                    ["Shiver Me Shrimp", 14000, 100],
                    ["Slithering Squid Surprise", 0, 100], // No price
                    ["Squid on a Stick", 0, 100], // No price
                    ["Tchea Grog", 0, 100], // No price
                    ["Tomato Cannon Ball", 15100, 100],
                    ["Tropical Breeze", 7500, 100],
                    ["Walk The Plank", 0, 100], // No price

                    // the rest
                    ["Mega Sandwich", 10000000, 99],
                    ["Rainbow Cybunny Negg", 10000000, 99],
                    ["Jelly Negg", 8000000, 99],
                    ["Big Gulp Neocola", 6000000, 99],
                    ["Chocolate Coated Blue Cheese", 5000000, 99],
                    ["Puzzle Fruit", 4500000, 99],
                    ["BLT Croissant", 4000000, 99],
                    ["Candy Floss Carrot", 4000000, 99],
                    ["Green Picnic Hamper", 4000000, 99],
                    ["Polka Carrot", 4000000, 99],
                    ["Mighty Steakwich", 0, 99], // No price
                    ["Olivetato", 0, 99], // No price
                    ["Onion and Mustard Pie", 0, 99], // No price
                    ["Upside Down Ice Cream", 4000000, 94],
                    ["Rainbow Carrot", 3900000, 99],
                    ["Borovan Layered Cake", 3500000, 99],
                    ["Chocolate Coated Cheese Strings", 2900000, 99],
                    ["Black Currant Juice", 2450000, 99],
                    ["Kadoatie Biscuits", 1900000, 95],
                    ["Cheesy Chocoshake", 1500000, 98],
                    ["Illusen Negg", 1500000, 97],
                    ["Purple Picnic Hamper", 1400000, 98],
                    ["Happy Anniversary Negg", 1300000, 95],
                    ["Mega Pipper Sandwich", 1300000, 95],
                    ["Blue Picnic Hamper", 1200000, 97],
                    ["Chokato Toffee Apple", 1200000, 95],
                    ["Blue Cybunny Negg", 1100000, 95],

                    //---------------------------------------------------
                    // Slotting all the unpriced r90+ here
                    ["Deluxe Elephante Cake", 0, 92], // Inflation Notice
                    ["Chocolate Coated Tangy Cheese", 0, 97], // Inflation Notice
                    ["Le Sausage", 0, 94], // Inflation Notice
                    ["Donut Burger", 0, 93], // Inflation Notice
                    ["Heart Shaped Negg", 0, 92], // Inflation Notice
                    ["Chilli Salmon Souffle", 0, 94], // Inflation Notice
                    ["Puntec Parcel", 0, 94], // Inflation Notice
                    ["Jalapeno Kacheek Cheese", 0, 93], // Inflation Notice
                    ["Green Ham", 0, 96], // Inflation Notice
                    ["Fire Carrot", 0, 92], // Inflation Notice
                    ["Square Meat", 0, 93], // Inflation Notice
                    ["Peanut Dash Stir Fry", 0, 92], // Inflation Notice
                    ["Watermelon Maraquan Shoyru", 0, 91], // Inflation Notice
                    ["Leftover Shortcrust Pastry", 0, 96], // Inflation Notice
                    ["Strawberry Taco", 0, 92], // Inflation Notice
                    ["Fried Negg Sandwich", 0, 91], // Inflation Notice
                    ["Evil Popcorn", 0, 92], // Inflation Notice
                    ["Apple Juice Sippy Cup", 0, 91], // Inflation Notice
                    ["Asparagus Borovan Lasagne", 0, 91], // Inflation Notice
                    ["Flower Nectar", 0, 92], // Inflation Notice
                    ["Welsh Rarebit", 0, 92], // Inflation Notice
                    ["Wocky Plum Pudding", 0, 91], // Inflation Notice
                    ["Extra Fancy Crackers", 0, 92], // Inflation Notice
                    ["Chokato Neggnog", 0, 92], // Inflation Notice
                    ["French Toast PB&J Sandwich", 0, 92], // Inflation Notice
                    ["Bacon Taco", 0, 91], // Inflation Notice
                    //---------------------------------------------------

                    ["Ruki Salad", 999999, 92], // Inflation Notice
                    ["Cheesy Chokato Pie", 999999, 98],
                    ["Cheesy Strawberry Slice", 999999, 98],
                    ["Christmas Pattern Negg", 999999, 97],
                    ["Fun Icy Cheese Pop", 999999, 98],
                    ["Illusens Family Recipe Cake", 999999, 93],
                    ["Invisible Cookie", 995000, 98],
                    ["Mega Tuna Sandwich", 995000, 98],
                    ["Pretty Purple Princess Negg", 990000, 96],
                    ["Tigersquash Custard", 990000, 95],
                    ["Tchea Toffee Apple", 985000, 93],
                    ["Glowing Apple", 965000, 95],
                    ["Plum", 965000, 99],
                    ["Starry Cupcake", 950000, 94],
                    ["Puntec Cupcake", 900000, 98],
                    ["Starry Scorchipepper", 870000, 94],
                    ["Mutated Negg", 845000, 95],
                    ["Chocolate Coated Cheese", 800000, 98],
                    ["Cybunny Day Canape", 800000, 97],
                    ["Raspberry Toffee Apple", 795000, 94],
                    ["Uni Ice Cream", 755000, 91],
                    ["Flaming Tuskaninny Ice Cream", 745000, 95],
                    ["Thorn on the Cob", 720000, 92],
                    ["Grey Toast", 705000, 94],
                    ["Bangers and Mash", 700000, 97],
                    ["Cheesy Krawk Dip", 700000, 97],
                    ["Chocolate Coated Holey Cheese", 700000, 98],
                    ["Mega Manoroot Sandwich", 685000, 95],
                    ["Cheesy Carrot Chunks", 680000, 98],
                    ["Carrot Crown", 620000, 97],
                    ["Uni Salad", 590000, 97],
                    ["Ice Apple", 565000, 96],
                    ["Rainbow Apple", 555000, 94],
                    ["Acara Ice Cream Surprise", 550000, 96],
                    ["Red Picnic Hamper", 505000, 96],
                    ["Container of Purple Liquid", 500000, 94],
                    ["Wocky Steak", 500000, 97],
                    ["Lawyerbot Degreaser", 490000, 96],
                    ["Cheesy Choco Cookie", 485000, 92],
                    ["Assorted Vandagyre Approved Nuts", 480000, 96],
                    ["Rainbow Neggnog", 460000, 96],
                    ["Zeenana Toffee Apple", 430000, 96],
                    ["Honey and Bacon Burger", 425000, 94],
                    ["Steak Surprise", 425000, 97],
                    ["Pirate Negg", 395000, 96],
                    ["Lenny Salad", 385000, 97],
                    ["Black Caviar", 375000, 97],
                    ["Fire Apple", 330000, 97],
                    ["Fancy Rack of Lamb with Fruit", 305000, 96],
                    ["Petpet Crackers", 280000, 92],
                    ["Seaweed Flotsam Burger", 280000, 96],
                    ["Kau Kau Farm Soy Milk", 260000, 85],
                    ["Kyrii Agueena Milkshake", 238000, 91],
                    ["Peach Jelly", 223000, 92],
                    ["Frozen Veggie Delight", 200000, 96],
                    ["Peppered Salmon Dish", 180000, 92],
                    ["JubJub Coconut Juice", 169000, 92],
                    ["Tomato Baby Food", 161000, 90],
                    ["Funnydew Neggnog", 150000, 93],
                    ["Raspberry Jam", 149000, 92],
                    ["Meerca Apertif", 137000, 96],
                    ["Kau Waffles", 129000, 92],
                    ["Rainbow Negg", 125000, 95],
                    ["Tasty Guacamole", 120000, 92],
                    ["Bag of Peanuts", 108000, 79],
                    ["Lutari Fizz", 108000, 91],
                    ["Deluxe Peophin Burger", 104000, 92],
                    ["Kau Kau Farm Organic Bottled Milk", 100000, 86],
                    ["Baked Avocado with Curried Sauce", 98500, 91],
                    ["Twin Salad", 96000, 92],
                    ["Super Icy Custard", 95500, 92],
                    ["Purple Carrot", 93000, 91],
                    ["Steak Negg", 91000, 92],
                    ["Cawl", 90000, 92],
                    ["Techo Jelly Surprise", 90000, 91],
                    ["Mynci Surprise Ice Cream", 89000, 92],
                    ["Turnip Eyrie Souffle", 88000, 90],
                    ["Faeriemoya", 83500, 91],
                    ["Purple Cybunny Negg", 83500, 89],
                    ["Speckled Negg", 80500, 89],
                    ["Noil Candy Floss", 70000, 91],
                    ["Unripe Puntec Wrap", 65500, 91],
                    ["Battle Duck Negg", 64500, 90],
                    ["Ultimate Icy Negg", 64500, 98],
                    ["Rock Negg", 60000, 90],
                    ["Candy Cane Negg", 58000, 89],
                    ["Maple Syrup Negg", 56000, 90],
                    ["Chocolate Ice Cream", 54000, 80],
                    ["Buzz Mashed Potato", 52000, 90],
                    ["Yellow Negg", 52000, 80],
                    ["Decorative Negg", 51500, 89],
                    ["Partitioned Negg", 51000, 78],
                    ["Ultra Icy Negg", 51000, 88],
                    ["Vanilla Neocola", 50500, 90],
                    ["Knowledge Hungry Burger", 49000, 90],
                    ["Sweet and Sour Negg", 48500, 88],
                    ["Blue Negg", 46400, 86],
                    ["Squibble Berry Sandwich", 43000, 91],
                    ["Pink Negg", 42600, 85],
                    ["Grey Waffles", 42500, 92],
                    ["Nimmo Day Fruit Cake", 42500, 91],
                    ["Swirly Negg #498", 42200, 83],
                    ["Glass Negg", 42000, 87],
                    ["Ornate Purple Negg", 41200, 89],
                    ["Baby Elephante Milk Bottle", 40000, 93],
                    ["Meerca Bolognese", 40000, 91],
                    ["Buzz Sandwich", 35900, 91],
                    ["Super Icy Negg", 33600, 78],
                    ["Lemon Swirly Negg", 33100, 82],
                    ["Orange Negg", 32000, 85],
                    ["Happy Birthday Negg", 28700, 89],
                    ["Green Negg", 27000, 80],
                    ["Neopets 18th Birthday Cake", 26000, 93],
                    ["Lime Swirly Negg", 25000, 84],
                    ["Congratulations Negg", 17800, 90],
                    ["Purple Negg", 17700, 65],
                    ["Cookie Negg", 15500, 90],
                    ["Negg", 7900, 45],
                    ["Mosaic Negg", 7550, 90],
                ]
            },

            get shop2() {
                return [ // Kauvara's Magic Shop (last updated 2020-11-28)
                    ["Desert Lutari Morphing Potion", 4000000],
                    ["Stealthy Lutari Morphing Potion", 4000000],
                    ["Maraquan Gelert Morphing Potion", 3900000],
                    ["8-bit Power-Up Potion", 3750000],
                    ["Maraquan Kacheek Morphing Potion", 3500000],
                    ["Maraquan Grarrl Morphing Potion", 3300000],
                    ["Island Lutari Morphing Potion", 3000000],
                    ["Faerie Lutari Morphing Potion", 3000000],
                    ["Ice Hissi Morphing Potion", 2700000],
                    ["Plushie Aisha Morphing Potion", 2700000],
                    ["Maraquan Cybunny Morphing Potion", 2700000],
                    ["Baby Draik Morphing Potion", 2500000],
                    ["Wraith Gelert Morphing Potion", 2500000],
                    ["Pink Lutari Morphing Potion", 2500000],
                    ["Faerie Poogle Morphing Potion", 2400000],
                    ["Plushie Gnorbu Morphing Potion", 2400000],
                    ["Pirate Lutari Morphing Potion", 2400000],
                    ["Stealthy Krawk Morphing Potion", 2300000],
                    ["Plushie Cybunny Morphing Potion", 2250000],
                    ["Green Lutari Morphing Potion", 2200000],
                    ["Island Quiggle Morphing Potion", 2100000],
                    ["Wraith Draik Morphing Potion", 2100000],
                    ["Baby Chia Morphing Potion", 2000000],
                    ["Halloween Aisha Morphing Potion", 2000000],
                    ["Halloween Hissi Morphing Potion", 2000000],
                    ["Plushie Poogle Morphing Potion", 2000000],
                    ["Woodland Cybunny Morphing Potion", 2000000],
                    ["Halloween Cybunny Morphing Potion", 2000000],
                    ["Plushie Jetsam Morphing Potion", 2000000],
                    ["Maraquan Krawk Morphing Potion", 1900000],
                    ["Strange Potion", 1900000],
                    ["Baby Korbat Morphing Potion", 1800000],
                    ["Faerie Bori Morphing Potion", 1800000],
                    ["Faerie Krawk Morphing Potion", 1800000],
                    ["Faerie Shoyru Morphing Potion", 1800000],
                    ["Halloween Uni Morphing Potion", 1800000],
                    ["Royal Boy Kyrii Morphing Potion", 1800000],
                    ["Royal Girl Kyrii Morphing Potion", 1800000],
                    ["Baby Gnorbu Morphing Potion", 1800000],
                    ["Faerie Grundo Morphing Potion", 1750000],
                    ["Grey Draik Morphing Potion", 1750000],
                    ["Darigan Grundo Morphing Potion", 1700000],
                    ["Faerie Xweetok Morphing Potion", 1700000],
                    ["Baby Hissi Morphing Potion", 1675000],
                    ["Darigan Bori Morphing Potion", 1600000],
                    ["Desert Aisha Morphing Potion", 1600000],
                    ["Kauvaras Potion", 1600000],
                    ["Maraquan Usul Morphing Potion", 1600000],
                    ["Stealthy Kyrii Morphing Potion", 1600000],
                    ["White Ixi Morphing Potion", 1600000],
                    ["Apple Chia Morphing Potion", 1600000],
                    ["Faerie Ixi Morphing Potion", 1550000],
                    ["Halloween Ixi Morphing Potion", 1550000],
                    ["Faerie Draik Morphing Potion", 1550000],
                    ["Baby Aisha Morphing Potion", 1500000],
                    ["Baby Kau Morphing Potion", 1500000],
                    ["Darigan Zafara Morphing Potion", 1500000],
                    ["Faerie Meerca Morphing Potion", 1500000],
                    ["Island Gelert Morphing Potion", 1500000],
                    ["Maractite Draik Morphing Potion", 1500000],
                    ["Maraquan Mynci Morphing Potion", 1500000],
                    ["Red Gelert Morphing Potion", 1500000],
                    ["Stealthy Grarrl Morphing Potion", 1500000],
                    ["Wraith Shoyru Morphing Potion", 1500000],
                    ["Maraquan Ixi Morphing Potion", 1500000],
                    ["Woodland Uni Morphing Potion", 1500000],
                    ["Baby Kacheek Morphing Potion", 1400000],
                    ["Darigan Ixi Morphing Potion", 1400000],
                    ["Darigan Wocky Morphing Potion", 1400000],
                    ["Grey Ixi Morphing Potion", 1400000],
                    ["Island Krawk Morphing Potion", 1400000],
                    ["Maractite Hissi Morphing Potion", 1400000],
                    ["Plushie Bori Morphing Potion", 1400000],
                    ["Plushie Kiko Morphing Potion", 1400000],
                    ["Rainbow Hissi Morphing Potion", 1400000],
                    ["Shadow Cybunny Morphing Potion", 1400000],
                    ["Spotted Gelert Morphing Potion", 1400000],
                    ["Spotted Kau Morphing Potion", 1400000],
                    ["Wraith Krawk Morphing Potion", 1400000],
                    ["Faerie Hissi Morphing Potion", 1400000],
                    ["Halloween Grundo Morphing Potion", 1400000],
                    ["Pastel Xweetok Morphing Potion", 1400000],
                    ["Darigan Draik Morphing Potion", 1350000],
                    ["Baby Chomby Morphing Potion", 1300000],
                    ["Baby Kougra Morphing Potion", 1300000],
                    ["Blue Gelert Morphing Potion", 1300000],
                    ["Christmas Gelert Morphing Potion", 1300000],
                    ["Faerie Ruki Morphing Potion", 1300000],
                    ["Plushie Hissi Morphing Potion", 1300000],
                    ["Yellow Gelert Morphing Potion", 1300000],
                    ["Eventide Gelert Morphing Potion", 1300000],
                    ["Island Kacheek Morphing Potion", 1250000],
                    ["Baby Lupe Morphing Potion", 1200000],
                    ["Darigan Eyrie Morphing Potion", 1200000],
                    ["Desert Blumaroo Morphing Potion", 1200000],
                    ["Disco Kacheek Morphing Potion", 1200000],
                    ["Faerie Bruce Morphing Potion", 1200000],
                    ["Faerie Usul Morphing Potion", 1200000],
                    ["Ghost Gelert Morphing Potion", 1200000],
                    ["Green Gelert Morphing Potion", 1200000],
                    ["Plushie Skeith Morphing Potion", 1200000],
                    ["Speckled Cybunny Morphing Potion", 1200000],
                    ["Water Usul Morphing Potion", 1200000],
                    ["Cloud Gelert Morphing Potion", 1200000],
                    ["Faerie Cybunny Morphing Potion", 1200000],
                    ["Plushie Grundo Morphing Potion", 1125000],
                    ["Baby Jetsam Morphing Potion", 1100000],
                    ["Eventide Aisha Morphing Potion", 1100000],
                    ["Maraquan Acara Morphing Potion", 1075000],
                    ["Fire Blumaroo Morphing Potion", 999999],
                    ["Island Bruce Morphing Potion", 999999],
                    ["Spotted Kougra Morphing Potion", 999999],
                    ["Stealthy Blumaroo Morphing Potion", 999999],
                    ["Stealthy Techo Morphing Potion", 999999],
                    ["Faerie Lenny Morphing Potion", 999999],
                    ["Faerie Pteri Morphing Potion", 999999],
                    ["Halloween Bori Morphing Potion", 999999],
                    ["Water Draik Morphing Potion", 999999],
                    ["Shadow Peophin Morphing Potion", 999999],
                    ["Yellow Jetsam Morphing Potion", 999999],
                    ["Glowing Jetsam Morphing Potion", 999999],
                    ["Desert Flotsam Morphing Potion", 995000],
                    ["Halloween Lenny Morphing Potion", 995000],
                    ["Halloween Kyrii Morphing Potion", 990000],
                    ["Maraquan Korbat Morphing Potion", 980000],
                    ["Invisible Wocky Morphing Potion", 975000],
                    ["Transparent Skeith Morphing Potion", 975000],
                    ["Christmas Cybunny Morphing Potion", 970000],
                    ["Baby Bruce Morphing Potion", 965000],
                    ["Grey Grarrl Morphing Potion", 965000],
                    ["Darigan Aisha Morphing Potion", 960000],
                    ["Faerie Lupe Morphing Potion", 960000],
                    ["Halloween Eyrie Morphing Potion", 960000],
                    ["Striped Jetsam Morphing Potion", 950000],
                    ["Rainbow Swirly Potion", 945000],
                    ["Spotted Koi Morphing Potion", 945000],
                    ["Plushie Tuskaninny Morphing Potion", 940000],
                    ["Red Cybunny Morphing Potion", 940000],
                    ["Grey Cybunny Morphing Potion", 940000],
                    ["Plushie Kougra Morphing Potion", 940000],
                    ["Polkadot Tonu Morphing Potion", 935000],
                    ["Island Ixi Morphing Potion", 930000],
                    ["Baby Buzz Morphing Potion", 925000],
                    ["Island Cybunny Morphing Potion", 920000],
                    ["Baby JubJub Morphing Potion", 915000],
                    ["Desert Mynci Morphing Potion", 915000],
                    ["Camouflage Cybunny Morphing Potion", 910000],
                    ["Starry Cybunny Morphing Potion", 905000],
                    ["Red Draik Morphing Potion", 900000],
                    ["Christmas Kacheek Morphing Potion", 900000],
                    ["Spotted Lupe Morphing Potion", 900000],
                    ["Red Jetsam Morphing Potion", 900000],
                    ["Island Uni Morphing Potion", 890000],
                    ["Maractite Krawk Morphing Potion", 885000],
                    ["Woodland Bori Morphing Potion", 885000],
                    ["Island Bori Morphing Potion", 880000],
                    ["Blue Cybunny Morphing Potion", 870000],
                    ["Cloud Cybunny Morphing Potion", 870000],
                    ["Island Zafara Morphing Potion", 865000],
                    ["Plushie Chomby Morphing Potion", 860000],
                    ["Fire Kacheek Morphing Potion", 850000],
                    ["Spotted Jetsam Morphing Potion", 850000],
                    ["Grey Zafara Morphing Potion", 840000],
                    ["Halloween Blumaroo Morphing Potion", 840000],
                    ["Darigan Grarrl Morphing Potion", 835000],
                    ["White Xweetok Morphing Potion", 835000],
                    ["Green Kacheek Morphing Potion", 830000],
                    ["Pirate Kacheek Morphing Potion", 830000],
                    ["Green Cybunny Morphing Potion", 830000],
                    ["Pink Ruki Morphing Potion", 825000],
                    ["Desert Kacheek Morphing Potion", 815000],
                    ["Woodland Wocky Morphing Potion", 805000],
                    ["Green Jetsam Morphing Potion", 800000],
                    ["Tyrannian Flotsam Morphing Potion", 800000],
                    ["Fire Draik Morphing Potion", 795000],
                    ["Rainbow Cybunny Morphing Potion", 795000],
                    ["Baby Uni Morphing Potion", 790000],
                    ["Desert Krawk Morphing Potion", 790000],
                    ["Yellow Cybunny Morphing Potion", 790000],
                    ["Baby Acara Morphing Potion", 785000],
                    ["Cloud Scorchio Morphing Potion", 785000],
                    ["Pirate Cybunny Morphing Potion", 780000],
                    ["Darigan Kyrii Morphing Potion", 775000],
                    ["Blue Kacheek Morphing Potion", 765000],
                    ["Halloween Xweetok Morphing Potion", 765000],
                    ["Starry Kacheek Morphing Potion", 760000],
                    ["Purple Draik Morphing Potion", 755000],
                    ["Clay Aisha Morphing Potion", 750000],
                    ["Relic Chia Morphing Potion", 745000],
                    ["Faerie Peophin Morphing Potion", 740000],
                    ["Zombie Cybunny Morphing Potion", 735000],
                    ["Maraquan Techo Morphing Potion", 720000],
                    ["Striped Chia Morphing Potion", 720000],
                    ["Maractite Aisha Morphing Potion", 715000],
                    ["Ghost Draik Morphing Potion", 700000],
                    ["White Skeith Morphing Potion", 700000],
                    ["Starry Nimmo Morphing Potion", 700000],
                    ["Transparent Korbat Morphing Potion", 695000],
                    ["Island Peophin Morphing Potion", 690000],
                    ["Baby Koi Morphing Potion", 685000],
                    ["Maraquan Meerca Morphing Potion", 685000],
                    ["Faerie Blumaroo Morphing Potion", 675000],
                    ["Ghost Hissi Morphing Potion", 675000],
                    ["Halloween Chia Morphing Potion", 675000],
                    ["Woodland Draik Morphing Potion", 670000],
                    ["Yellow Kacheek Morphing Potion", 665000],
                    ["Island Hissi Morphing Potion", 665000],
                    ["Rainbow Kacheek Morphing Potion", 665000],
                    ["Skunk Eyrie Morphing Potion", 660000],
                    ["Strawberry Kacheek Morphing Potion", 650000],
                    ["Darigan Blumaroo Morphing Potion", 645000],
                    ["Halloween Grarrl Morphing Potion", 640000],
                    ["Shadow Blumaroo Morphing Potion", 640000],
                    ["Pirate Kougra Morphing Potion", 635000],
                    ["Fire Xweetok Morphing Potion", 615000],
                    ["Plushie Grarrl Morphing Potion", 615000],
                    ["Red Kacheek Morphing Potion", 615000],
                    ["Halloween Meerca Morphing Potion", 600000],
                    ["Pink Lenny Morphing Potion", 600000],
                    ["Christmas Chia Morphing Potion", 600000],
                    ["Spotted Hissi Morphing Potion", 600000],
                    ["Starry Scorchio Morphing Potion", 600000],
                    ["Strawberry Techo Morphing Potion", 600000],
                    ["Blue Jetsam Morphing Potion", 600000],
                    ["Purple Pteri Morphing Potion", 590000],
                    ["Eventide Draik Morphing Potion", 590000],
                    ["Desert Ixi Morphing Potion", 580000],
                    ["Grey Korbat Morphing Potion", 580000],
                    ["Faerie Acara Morphing Potion", 575000],
                    ["Halloween Kau Morphing Potion", 575000],
                    ["Baby Blumaroo Morphing Potion", 575000],
                    ["Disco Shoyru Morphing Potion", 570000],
                    ["Yellow Bruce Morphing Potion", 570000],
                    ["Baby Kiko Morphing Potion", 565000],
                    ["Fire Chia Morphing Potion", 560000],
                    ["Eventide Hissi Morphing Potion", 550000],
                    ["Pink Draik Morphing Potion", 550000],
                    ["Blue Draik Morphing Potion", 545000],
                    ["Faerie JubJub Morphing Potion", 545000],
                    ["Camouflage Chia Morphing Potion", 545000],
                    ["Blue Kiko Morphing Potion", 540000],
                    ["Maractite Peophin Morphing Potion", 540000],
                    ["Rainbow Lupe Morphing Potion", 540000],
                    ["Desert Chomby Morphing Potion", 530000],
                    ["Faerie Techo Morphing Potion", 520000],
                    ["Split Chia Morphing Potion", 520000],
                    ["White Chia Morphing Potion", 515000],
                    ["Water Acara Morphing Potion", 510000],
                    ["Eventide Tonu Morphing Potion", 500000],
                    ["Green Lupe Morphing Potion", 495000],
                    ["Plushie Usul Morphing Potion", 495000],
                    ["Baby Usul Morphing Potion", 495000],
                    ["Tyrannian Peophin Morphing Potion", 495000],
                    ["Rainbow Wocky Morphing Potion", 490000],
                    ["Striped Xweetok Morphing Potion", 490000],
                    ["Woodland Lenny Morphing Potion", 485000],
                    ["Maraquan Hissi Morphing Potion", 485000],
                    ["Grey JubJub Morphing Potion", 480000],
                    ["Grey Mynci Morphing Potion", 480000],
                    ["Baby Shoyru Morphing Potion", 480000],
                    ["Purple Chia Morphing Potion", 475000],
                    ["Plushie Kau Morphing Potion", 465000],
                    ["Green Draik Morphing Potion", 460000],
                    ["Grey Lenny Morphing Potion", 460000],
                    ["Grey Yurble Morphing Potion", 460000],
                    ["Tyrannian Gnorbu Morphing Potion", 455000],
                    ["Yellow Chia Morphing Potion", 455000],
                    ["Darigan Kau Morphing Potion", 450000],
                    ["Island Lupe Morphing Potion", 450000],
                    ["Red Chia Morphing Potion", 450000],
                    ["Wraith Scorchio Morphing Potion", 450000],
                    ["Dimensional Jetsam Morphing Potion", 450000],
                    ["Baby Meerca Morphing Potion", 445000],
                    ["Desert Poogle Morphing Potion", 445000],
                    ["Zombie Aisha Morphing Potion", 440000],
                    ["Shadow Chomby Morphing Potion", 435000],
                    ["Transparent Lenny Morphing Potion", 430000],
                    ["Transparent Wocky Morphing Potion", 430000],
                    ["Green Chia Morphing Potion", 425000],
                    ["Island Poogle Morphing Potion", 425000],
                    ["Snow Chia Morphing Potion", 425000],
                    ["Blue Chia Morphing Potion", 420000],
                    ["Faerie Yurble Morphing Potion", 420000],
                    ["Desert Chia Morphing Potion", 420000],
                    ["Darigan Acara Morphing Potion", 410000],
                    ["Grey Techo Morphing Potion", 410000],
                    ["Island Blumaroo Morphing Potion", 410000],
                    ["Yellow Lupe Morphing Potion", 410000],
                    ["Brown Ixi Morphing Potion", 400000],
                    ["Desert Peophin Morphing Potion", 400000],
                    ["Maraquan Buzz Morphing Potion", 400000],
                    ["Green Acara Morphing Potion", 400000],
                    ["Shadow Ogrin Morphing Potion", 400000],
                    ["Rainbow Shoyru Morphing Potion", 400000],
                    ["Baby Scorchio Morphing Potion", 395000],
                    ["Fire Lupe Morphing Potion", 395000],
                    ["Starry Draik Morphing Potion", 395000],
                    ["Transparent Elephante Morphing Potion", 395000],
                    ["Eventide Poogle Morphing Potion", 395000],
                    ["Camouflage Krawk Morphing Potion", 390000],
                    ["Blue Lupe Morphing Potion", 385000],
                    ["Blue Krawk Morphing Potion", 380000],
                    ["Faerie Kau Morphing Potion", 380000],
                    ["Halloween Korbat Morphing Potion", 375000],
                    ["Rainbow Kau Morphing Potion", 365000],
                    ["Green Krawk Morphing Potion", 360000],
                    ["Island Grundo Morphing Potion", 360000],
                    ["Baby Grundo Morphing Potion", 360000],
                    ["Glowing Lupe Morphing Potion", 360000],
                    ["Shadow Hissi Morphing Potion", 360000],
                    ["Plushie Korbat Morphing Potion", 350000],
                    ["Yellow Draik Morphing Potion", 350000],
                    ["Yellow Krawk Morphing Potion", 350000],
                    ["Skunk Draik Morphing Potion", 350000],
                    ["Cloud Eyrie Morphing Potion", 350000],
                    ["Shadow Ruki Morphing Potion", 345000],
                    ["Baby Poogle Morphing Potion", 345000],
                    ["Red Krawk Morphing Potion", 345000],
                    ["Red Lupe Morphing Potion", 345000],
                    ["Red Acara Morphing Potion", 340000],
                    ["Water Gnorbu Morphing Potion", 340000],
                    ["Wraith Grundo Morphing Potion", 340000],
                    ["Baby Peophin Morphing Potion", 335000],
                    ["Desert Hissi Morphing Potion", 335000],
                    ["Shadow Lenny Morphing Potion", 330000],
                    ["White Chomby Morphing Potion", 330000],
                    ["Wraith Korbat Morphing Potion", 330000],
                    ["Eventide Kougra Morphing Potion", 330000],
                    ["Island Aisha Morphing Potion", 325000],
                    ["Christmas Lupe Morphing Potion", 320000],
                    ["Pirate Poogle Morphing Potion", 315000],
                    ["Plushie Yurble Morphing Potion", 315000],
                    ["Rainbow Flotsam Morphing Potion", 315000],
                    ["Island Shoyru Morphing Potion", 305000],
                    ["Plushie Bruce Morphing Potion", 300000],
                    ["Plushie Ogrin Morphing Potion", 300000],
                    ["Water Flotsam Morphing Potion", 300000],
                    ["Wraith Pteri Morphing Potion", 300000],
                    ["Christmas Acara Morphing Potion", 300000],
                    ["Shadow Uni Morphing Potion", 300000],
                    ["Fire Ixi Morphing Potion", 300000],
                    ["Checkered Acara Morphing Potion", 295000],
                    ["Dimensional Aisha Morphing Potion", 295000],
                    ["Fire Wocky Morphing Potion", 290000],
                    ["Island Usul Morphing Potion", 290000],
                    ["Skunk Lupe Morphing Potion", 290000],
                    ["Split Lupe Morphing Potion", 290000],
                    ["Strawberry Lupe Morphing Potion", 290000],
                    ["Yellow Hissi Morphing Potion", 290000],
                    ["Blue Usul Morphing Potion", 285000],
                    ["Fire Kiko Morphing Potion", 285000],
                    ["Island JubJub Morphing Potion", 285000],
                    ["Island Kiko Morphing Potion", 285000],
                    ["Island Mynci Morphing Potion", 280000],
                    ["Island Acara Morphing Potion", 280000],
                    ["Pink Uni Morphing Potion", 275000],
                    ["Fire Shoyru Morphing Potion", 270000],
                    ["Light Faerie Dust", 270000],
                    ["Yellow Poogle Morphing Potion", 270000],
                    ["Disco Acara Morphing Potion", 270000],
                    ["Blue Kau Morphing Potion", 265000],
                    ["Christmas Magic Hat", 265000],
                    ["Ghost Peophin Morphing Potion", 265000],
                    ["Green Zafara Morphing Potion", 265000],
                    ["Christmas Grundo Morphing Potion", 260000],
                    ["Faerie Nimmo Morphing Potion", 260000],
                    ["Wraith Ogrin Morphing Potion", 260000],
                    ["Pastel Gnorbu Morphing Potion", 260000],
                    ["Plushie Buzz Morphing Potion", 255000],
                    ["Christmas Chomby Morphing Potion", 255000],
                    ["Fire Ruki Morphing Potion", 250000],
                    ["Faerie Uni Morphing Potion", 250000],
                    ["Plushie Wocky Morphing Potion", 250000],
                    ["Ghost Acara Morphing Potion", 247000],
                    ["Island Lenny Morphing Potion", 244000],
                    ["Blue Zafara Morphing Potion", 239000],
                    ["Cloud Ruki Morphing Potion", 238000],
                    ["Pirate Ixi Morphing Potion", 238000],
                    ["Starry Zafara Morphing Potion", 236000],
                    ["Tyrannian Bori Morphing Potion", 236000],
                    ["Darigan Mynci Morphing Potion", 235000],
                    ["Pirate Gnorbu Morphing Potion", 235000],
                    ["Yellow Zafara Morphing Potion", 232000],
                    ["Desert Yurble Morphing Potion", 230000],
                    ["Green Bori Morphing Potion", 230000],
                    ["Island Tuskaninny Morphing Potion", 230000],
                    ["Rainbow Chomby Morphing Potion", 230000],
                    ["Striped Shoyru Morphing Potion", 227000],
                    ["Electric Ixi Morphing Potion", 226000],
                    ["Tyrannian Ixi Morphing Potion", 226000],
                    ["Yellow Usul Morphing Potion", 222000],
                    ["Water Kyrii Morphing Potion", 222000],
                    ["Christmas Zafara Morphing Potion", 221000],
                    ["Desert Scorchio Morphing Potion", 220000],
                    ["Plushie Scorchio Morphing Potion", 220000],
                    ["Pirate Shoyru Morphing Potion", 219000],
                    ["Red Chomby Morphing Potion", 218000],
                    ["Darigan Quiggle Morphing Potion", 214000],
                    ["Darigan Buzz Morphing Potion", 212000],
                    ["Plushie Ixi Morphing Potion", 210000],
                    ["Christmas Ixi Morphing Potion", 209000],
                    ["Pirate Wocky Morphing Potion", 209000],
                    ["Brown Uni Morphing Potion", 209000],
                    ["Faerie Quiggle Morphing Potion", 208000],
                    ["Swamp Gas Ogrin Morphing Potion", 207000],
                    ["Fire Acara Morphing Potion", 206000],
                    ["Blue Hissi Morphing Potion", 205000],
                    ["Eventide Zafara Morphing Potion", 205000],
                    ["Blue Chomby Morphing Potion", 202000],
                    ["Cloud Acara Morphing Potion", 202000],
                    ["Checkered Aisha Morphing Potion", 200000],
                    ["Eventide Ixi Morphing Potion", 200000],
                    ["Pirate Grundo Morphing Potion", 200000],
                    ["Halloween Techo Morphing Potion", 200000],
                    ["Striped Grarrl Morphing Potion", 200000],
                    ["Split Flotsam Morphing Potion", 200000],
                    ["Electric Moehog Morphing Potion", 200000],
                    ["Christmas Peophin Morphing Potion", 200000],
                    ["Halloween Nimmo Morphing Potion", 197000],
                    ["Yellow Ruki Morphing Potion", 197000],
                    ["Ghost Kiko Morphing Potion", 195000],
                    ["Yellow Acara Morphing Potion", 195000],
                    ["Purple Peophin Morphing Potion", 193000],
                    ["Green Bruce Morphing Potion", 192000],
                    ["Island Xweetok Morphing Potion", 192000],
                    ["Snow Blumaroo Morphing Potion", 190000],
                    ["Dimensional Shoyru Morphing Potion", 190000],
                    ["Plushie JubJub Morphing Potion", 190000],
                    ["Island Eyrie Morphing Potion", 189000],
                    ["White Shoyru Morphing Potion", 189000],
                    ["Fire Chomby Morphing Potion", 187000],
                    ["Purple Zafara Morphing Potion", 187000],
                    ["Water Buzz Morphing Potion", 186000],
                    ["White Peophin Morphing Potion", 186000],
                    ["Faerie Aisha Morphing Potion", 185000],
                    ["Red Zafara Morphing Potion", 183000],
                    ["Dimensional Kougra Morphing Potion", 182000],
                    ["Red Hissi Morphing Potion", 181000],
                    ["Water Kau Morphing Potion", 181000],
                    ["Pirate Lenny Morphing Potion", 180000],
                    ["Blue Ixi Morphing Potion", 180000],
                    ["Blue Ruki Morphing Potion", 180000],
                    ["Sketch Peophin Morphing Potion", 180000],
                    ["Red Kiko Morphing Potion", 179000],
                    ["Purple Tonu Morphing Potion", 178000],
                    ["Rainbow Poogle Morphing Potion", 176000],
                    ["Disco Korbat Morphing Potion", 175000],
                    ["Island Chomby Morphing Potion", 174000],
                    ["Pink Shoyru Morphing Potion", 174000],
                    ["Desert Elephante Morphing Potion", 172000],
                    ["Green Usul Morphing Potion", 172000],
                    ["Woodland Grundo Morphing Potion", 171000],
                    ["Zombie Buzz Morphing Potion", 170000],
                    ["Christmas Bruce Morphing Potion", 169000],
                    ["Plushie Techo Morphing Potion", 169000],
                    ["Darigan Techo Morphing Potion", 168000],
                    ["Pink Koi Morphing Potion", 168000],
                    ["Silver Peophin Morphing Potion", 168000],
                    ["Checkered Poogle Morphing Potion", 167000],
                    ["Ghost Shoyru Morphing Potion", 166000],
                    ["Rainbow JubJub Morphing Potion", 166000],
                    ["Snow Peophin Morphing Potion", 166000],
                    ["Red Ruki Morphing Potion", 165000],
                    ["Striped Kau Morphing Potion", 163000],
                    ["Christmas Kougra Morphing Potion", 162000],
                    ["Starry Hissi Morphing Potion", 162000],
                    ["Woodland Mynci Morphing Potion", 160000],
                    ["Green Hissi Morphing Potion", 160000],
                    ["Woodland Acara Morphing Potion", 160000],
                    ["Glowing Korbat Morphing Potion", 160000],
                    ["Fire Bori Morphing Potion", 159000],
                    ["Plushie Flotsam Morphing Potion", 158000],
                    ["Blue Acara Morphing Potion", 157000],
                    ["Snow Usul Morphing Potion", 157000],
                    ["Plushie Mynci Morphing Potion", 156000],
                    ["Purple Shoyru Morphing Potion", 154000],
                    ["Zombie Korbat Morphing Potion", 154000],
                    ["Woodland Pteri Morphing Potion", 150000],
                    ["Desert Ogrin Morphing Potion", 150000],
                    ["Spotted Nimmo Morphing Potion", 150000],
                    ["Ghost Korbat Morphing Potion", 149000],
                    ["Brown Ruki Morphing Potion", 149000],
                    ["Yellow Ixi Morphing Potion", 149000],
                    ["Disco Bruce Morphing Potion", 148000],
                    ["Green Kau Morphing Potion", 148000],
                    ["Woodland Koi Morphing Potion", 147000],
                    ["Shadow Skeith Morphing Potion", 145000],
                    ["Island Wocky Morphing Potion", 142000],
                    ["Yellow Kau Morphing Potion", 142000],
                    ["Green Ixi Morphing Potion", 142000],
                    ["Rainbow Aisha Morphing Potion", 142000],
                    ["Red Shoyru Morphing Potion", 141000],
                    ["Yellow Blumaroo Morphing Potion", 141000],
                    ["Woodland Skeith Morphing Potion", 137000],
                    ["Eventide Korbat Morphing Potion", 137000],
                    ["Island Skeith Morphing Potion", 136000],
                    ["Cloud Grundo Morphing Potion", 135000],
                    ["Green Chomby Morphing Potion", 135000],
                    ["Fire Quiggle Morphing Potion", 134000],
                    ["Zombie Eyrie Morphing Potion", 134000],
                    ["Tyrannian Usul Morphing Potion", 134000],
                    ["Christmas Uni Morphing Potion", 133000],
                    ["Cloud Ixi Morphing Potion", 133000],
                    ["Red Usul Morphing Potion", 133000],
                    ["Fire Aisha Morphing Potion", 133000],
                    ["Starry Skeith Morphing Potion", 132000],
                    ["Woodland Peophin Morphing Potion", 132000],
                    ["Snow Aisha Morphing Potion", 130000],
                    ["Woodland Tonu Morphing Potion", 130000],
                    ["Green Kiko Morphing Potion", 130000],
                    ["Pirate Krawk Morphing Potion", 130000],
                    ["Plushie Pteri Morphing Potion", 130000],
                    ["Cloud Peophin Morphing Potion", 129000],
                    ["Blue Peophin Morphing Potion", 127000],
                    ["Disco Chomby Morphing Potion", 127000],
                    ["Checkered Kiko Morphing Potion", 125000],
                    ["Christmas Blumaroo Morphing Potion", 125000],
                    ["Fire Kyrii Morphing Potion", 125000],
                    ["Flaming Torch", 125000],
                    ["Christmas Aisha Morphing Potion", 125000],
                    ["Striped Ixi Morphing Potion", 125000],
                    ["Green Blumaroo Morphing Potion", 123000],
                    ["Speckled Kau Morphing Potion", 123000],
                    ["Faerie Tuskaninny Morphing Potion", 122000],
                    ["Red Kau Morphing Potion", 122000],
                    ["Red Peophin Morphing Potion", 122000],
                    ["Yellow Kiko Morphing Potion", 122000],
                    ["Brown Aisha Morphing Potion", 122000],
                    ["Green Grundo Morphing Potion", 121000],
                    ["Blue Shoyru Morphing Potion", 120000],
                    ["Green Peophin Morphing Potion", 120000],
                    ["Red Ixi Morphing Potion", 120000],
                    ["Starry Ruki Morphing Potion", 120000],
                    ["Striped Flotsam Morphing Potion", 120000],
                    ["Water Faerie Bubbles", 119000],
                    ["Yellow Skeith Morphing Potion", 119000],
                    ["Dimensional Poogle Morphing Potion", 119000],
                    ["Green Ruki Morphing Potion", 119000],
                    ["Pirate Hissi Morphing Potion", 119000],
                    ["Fire Kau Morphing Potion", 117000],
                    ["Christmas Bori Morphing Potion", 116000],
                    ["Pirate Usul Morphing Potion", 116000],
                    ["Purple Grundo Morphing Potion", 116000],
                    ["Starry Bruce Morphing Potion", 116000],
                    ["Starry Grundo Morphing Potion", 116000],
                    ["Electric Grarrl Morphing Potion", 115000],
                    ["Fire Pteri Morphing Potion", 115000],
                    ["Tyrannian JubJub Morphing Potion", 115000],
                    ["Pirate Chomby Morphing Potion", 115000],
                    ["Cloud Bori Morphing Potion", 114000],
                    ["Snow Ogrin Morphing Potion", 114000],
                    ["Yellow Peophin Morphing Potion", 114000],
                    ["Yellow Grundo Morphing Potion", 113000],
                    ["Island Ogrin Morphing Potion", 112000],
                    ["Striped Skeith Morphing Potion", 111000],
                    ["Christmas Kiko Morphing Potion", 110000],
                    ["Island Nimmo Morphing Potion", 110000],
                    ["Starry Usul Morphing Potion", 110000],
                    ["Yellow Chomby Morphing Potion", 110000],
                    ["Green Skeith Morphing Potion", 109000],
                    ["Faerie Buzz Morphing Potion", 109000],
                    ["Shadow Korbat Morphing Potion", 109000],
                    ["Striped Meerca Morphing Potion", 109000],
                    ["Snow Wocky Morphing Potion", 108000],
                    ["Island Techo Morphing Potion", 107000],
                    ["Rainbow Koi Morphing Potion", 106000],
                    ["Cloud Poogle Morphing Potion", 106000],
                    ["Purple Uni Morphing Potion", 106000],
                    ["Red Bori Morphing Potion", 105000],
                    ["Red Skeith Morphing Potion", 105000],
                    ["Snow Bori Morphing Potion", 104000],
                    ["Blue Bruce Morphing Potion", 104000],
                    ["Zombie Usul Morphing Potion", 104000],
                    ["Pink Peophin Morphing Potion", 102000],
                    ["Wraith Bruce Morphing Potion", 102000],
                    ["Christmas Wocky Morphing Potion", 101000],
                    ["Cloud Shoyru Morphing Potion", 101000],
                    // ["Snow Bruce Morphing Potion", 101000],
                    // ["Fire Techo Morphing Potion", 100000],
                    // ["Island Korbat Morphing Potion", 100000],
                    // ["Desert Kyrii Morphing Potion", 100000],
                    // ["Spotted Grundo Morphing Potion", 99000],
                    // ["Blue Bori Morphing Potion", 98500],
                    // ["Christmas JubJub Morphing Potion", 98500],
                    // ["Plushie Tonu Morphing Potion", 98500],
                    // ["Blue Grundo Morphing Potion", 98000],
                    // ["Blue Skeith Morphing Potion", 97000],
                    // ["Split Bruce Morphing Potion", 97000],
                    // ["Striped Korbat Morphing Potion", 96500],
                    // ["Island Koi Morphing Potion", 96000],
                    // ["Christmas Elephante Morphing Potion", 95500],
                    // ["Ghost Lenny Morphing Potion", 95000],
                    // ["Desert Grundo Morphing Potion", 95000],
                    // ["Pink Pteri Morphing Potion", 95000],
                    // ["Tyrannian Eyrie Morphing Potion", 95000],
                    // ["Fire Skeith Morphing Potion", 93500],
                    // ["Spotted Blumaroo Morphing Potion", 93500],
                    // ["Glowing Koi Morphing Potion", 93000],
                    // ["Camouflage Shoyru Morphing Potion", 92500],
                    // ["Christmas Shoyru Morphing Potion", 91000],
                    // ["Faerie Mynci Morphing Potion", 91000],
                    // ["Snow Eyrie Morphing Potion", 90500],
                    // ["Starry Kau Morphing Potion", 90000],
                    // ["Rainbow Korbat Morphing Potion", 90000],
                    // ["Blue Korbat Morphing Potion", 89000],
                    // ["Christmas Pteri Morphing Potion", 88500],
                    // ["Disco Mynci Morphing Potion", 88500],
                    // ["Yellow Bori Morphing Potion", 87500],
                    // ["Disco Moehog Morphing Potion", 87000],
                    // ["Yellow Wocky Morphing Potion", 86500],
                    // ["Striped Blumaroo Morphing Potion", 86000],
                    // ["Brown Bruce Morphing Potion", 85500],
                    // ["White Flotsam Morphing Potion", 85500],
                    // ["Cloud Elephante Morphing Potion", 85000],
                    // ["Desert Buzz Morphing Potion", 85000],
                    // ["Faerie Skeith Morphing Potion", 85000],
                    // ["Purple Poogle Morphing Potion", 85000],
                    // ["Green Korbat Morphing Potion", 84000],
                    // ["Purple Eyrie Morphing Potion", 84000],
                    // ["Pirate Flotsam Morphing Potion", 83500],
                    // ["Skunk Kyrii Morphing Potion", 83000],
                    // ["Speckled Shoyru Morphing Potion", 83000],
                    // ["Strawberry Bruce Morphing Potion", 83000],
                    // ["Yellow Aisha Morphing Potion", 83000],
                    // ["Blue Quiggle Morphing Potion", 82500],
                    // ["Orange Yurble Morphing Potion", 82500],
                    // ["Blue Koi Morphing Potion", 82000],
                    // ["Rainbow Grundo Morphing Potion", 82000],
                    // ["Rainbow Uni Morphing Potion", 82000],
                    // ["Yellow Shoyru Morphing Potion", 82000],
                    // ["Camouflage Techo Morphing Potion", 81500],
                    // ["Fire Poogle Morphing Potion", 81000],
                    // ["Rainbow Kyrii Morphing Potion", 80000],
                    // ["Pirate Draik Morphing Potion", 80000],
                    // ["Rainbow Grarrl Morphing Potion", 80000],
                    // ["Snow Techo Morphing Potion", 80000],
                    // ["Swamp Gas Techo Morphing Potion", 79000],
                    // ["Cloud Grarrl Morphing Potion", 78000],
                    // ["Fire Yurble Morphing Potion", 78000],
                    // ["Ghost Elephante Morphing Potion", 78000],
                    // ["Green Poogle Morphing Potion", 78000],
                    // ["Skunk Buzz Morphing Potion", 78000],
                    // ["Blue Uni Morphing Potion", 77500],
                    // ["Fire Bruce Morphing Potion", 77000],
                    // ["Red Blumaroo Morphing Potion", 77000],
                    // ["Purple Techo Morphing Potion", 76000],
                    // ["Pink Ogrin Morphing Potion", 76000],
                    // ["Starry Eyrie Morphing Potion", 75500],
                    // ["Yellow Lenny Morphing Potion", 75000],
                    // ["Pink Korbat Morphing Potion", 75000],
                    // ["White Kyrii Morphing Potion", 75000],
                    // ["Blue Wocky Morphing Potion", 74500],
                    // ["Shadow Shoyru Morphing Potion", 74500],
                    // ["Gold Tonu Morphing Potion", 74000],
                    // ["Strawberry Tuskaninny Morphing Potion", 73500],
                    // ["Camouflage Scorchio Morphing Potion", 73500],
                    // ["Cloud Bruce Morphing Potion", 73000],
                    // ["Pirate Bori Morphing Potion", 73000],
                    // ["Red Korbat Morphing Potion", 73000],
                    // ["Spotted Shoyru Morphing Potion", 73000],
                    // ["Green Quiggle Morphing Potion", 72000],
                    // ["Fire Nimmo Morphing Potion", 71500],
                    // ["Pink Kyrii Morphing Potion", 71000],
                    // ["Blue Lenny Morphing Potion", 70000],
                    // ["Gold Shoyru Morphing Potion", 70000],
                    // ["Green Shoyru Morphing Potion", 70000],
                    // ["Purple Aisha Morphing Potion", 70000],
                    // ["Starry Shoyru Morphing Potion", 70000],
                    // ["Speckled Xweetok Morphing Potion", 69000],
                    // ["Blue Blumaroo Morphing Potion", 68500],
                    // ["Pirate Yurble Morphing Potion", 68500],
                    // ["Blue Poogle Morphing Potion", 68000],
                    // ["Ghost Techo Morphing Potion", 67500],
                    // ["Desert Gnorbu Morphing Potion", 67500],
                    // ["Pink Eyrie Morphing Potion", 67000],
                    // ["Checkered Bori Morphing Potion", 66500],
                    // ["Red Bruce Morphing Potion", 65000],
                    // ["Silver Shoyru Morphing Potion", 65000],
                    // ["Speckled Bori Morphing Potion", 65000],
                    // ["Striped Aisha Morphing Potion", 65000],
                    // ["Spotted Korbat Morphing Potion", 64000],
                    // ["Ghost Grarrl Morphing Potion", 63500],
                    // ["Red Grarrl Morphing Potion", 63500],
                    // ["Checkered Shoyru Morphing Potion", 63500],
                    // ["Shadow Tonu Morphing Potion", 63500],
                    // ["Blue Kougra Morphing Potion", 63000],
                    // ["Striped Nimmo Morphing Potion", 63000],
                    // ["Red Wocky Morphing Potion", 62500],
                    // ["Christmas Scorchio Morphing Potion", 61500],
                    // ["Rainbow Bori Morphing Potion", 61500],
                    // ["Christmas Koi Morphing Potion", 61000],
                    // ["Blue Grarrl Morphing Potion", 60500],
                    // ["Starry Bori Morphing Potion", 60500],
                    // ["Yellow Korbat Morphing Potion", 60000],
                    // ["Christmas Lenny Morphing Potion", 60000],
                    // ["Island Pteri Morphing Potion", 60000],
                    // ["Speckled Bruce Morphing Potion", 60000],
                    // ["Spotted Bori Morphing Potion", 59500],
                    // ["Brown Lenny Morphing Potion", 59000],
                    // ["Rainbow Quiggle Morphing Potion", 59000],
                    // ["Yellow Vandagyre Morphing Potion", 59000],
                    // ["Blue Tonu Morphing Potion", 58500],
                    // ["Christmas Korbat Morphing Potion", 58500],
                    // ["Green Tuskaninny Morphing Potion", 58500],
                    // ["Rainbow Gnorbu Morphing Potion", 58500],
                    // ["Blue Aisha Morphing Potion", 58000],
                    // ["Fire Gnorbu Morphing Potion", 57500],
                    // ["Green Meerca Morphing Potion", 57000],
                    // ["Red Kougra Morphing Potion", 57000],
                    // ["Red Eyrie Morphing Potion", 56500],
                    // ["Fire Moehog Morphing Potion", 56000],
                    // ["Green JubJub Morphing Potion", 56000],
                    // ["Cloud Lenny Morphing Potion", 55000],
                    // ["Ghost Tuskaninny Morphing Potion", 55000],
                    // ["Faerie Flotsam Morphing Potion", 55000],
                    // ["Camouflage Lenny Morphing Potion", 54500],
                    // ["Island Buzz Morphing Potion", 53500],
                    // ["Checkered Koi Morphing Potion", 53000],
                    // ["Faerie Eyrie Morphing Potion", 52000],
                    // ["Dimensional Moehog Morphing Potion", 52000],
                    // ["Fire Buzz Morphing Potion", 51000],
                    // ["Starry Xweetok Morphing Potion", 51000],
                    // ["Brown Grundo Morphing Potion", 50500],
                    // ["Red Mynci Morphing Potion", 50000],
                    // ["Gold Scorchio Morphing Potion", 50000],
                    // ["Spotted Scorchio Morphing Potion", 50000],
                    // ["Blue Tuskaninny Morphing Potion", 49200],
                    // ["Green Grarrl Morphing Potion", 49000],
                    // ["Green Nimmo Morphing Potion", 48000],
                ]
            },

            get shop3() {// Toy Shop
                return [
                    ["Elephante Lamp Collectable Charm", 40000000],
                    ["Sloth Collectable Charm", 12000000],
                    ["Space Faerie Doll", 9500000],
                    ["Vanity Doll", 9300000],
                    ["Tooth Faerie Doll", 8000000],
                    ["Water Faerie Doll", 7725000],
                    ["Negg Faerie Doll", 6500000],
                    ["Fire Faerie Doll", 6375000],
                    ["Dark Faerie Doll", 6000000],
                    ["Air Faerie Doll", 5500000],
                    ["Techo Statue Collectable Charm", 4900000],
                    ["Light Faerie Doll", 4500000],
                    ["Gallion Collectable Charm", 3250000],
                    ["Malice Doll", 2700000],
                    ["A Grey Faerie Doll", 2400000],
                    ["Princess Terrana Collectable Charm", 2325000],
                    ["Neopets 21st Birthday Goodie Bag", 2000000],
                    ["Taelia Quiguki", 1900000],
                    ["Jeran Quiguki", 1800000],
                    ["Year 9 Quiguki", 1800000],
                    ["Negg Faerie Snowglobe", 1700000],
                    ["Quiguki Mermaid", 1700000],
                    ["Illusen Faerie Doll", 1600000],
                    ["Spite Doll", 1400000],
                    ["Luxury Beach Scene Faerie Snowglobe", 1325000],
                    ["Cyodrake Collectable Charm", 1300000],
                    ["Wherfy Collectable Charm", 1100000],
                    ["Soup Faerie Snowglobe", 1000000],
                    ["Luxury Dark and Earth Faerie Snowglobe", 990000],
                    ["King Skarl Quiguki", 950000],
                    ["Blushing Bride Quiguki Doll", 855000],
                    ["Rainbow Scooter", 840000],
                    ["Handsome Valentine Quiguki", 825000],
                    ["Red Wocky Balloon", 815000],
                    ["Beautiful Hair Quiguki Doll", 800000],
                    ["Feather Bow and Arrow", 795000],
                    ["Cheerleader Quiguki Doll", 780000],
                    ["Floud Balloon", 765000],
                    ["Jhuidah Snowglobe", 750000],
                    ["Hannah Quiguki", 710000],
                    ["King Hagan Quiguki", 700000],
                    ["Traditional Welsh Quiguki", 695000],
                    ["Blue PaintBrush Collectable Charm", 690000],
                    ["Ballerina Quiguki", 555000],
                    ["Quiguki Prom Queen", 545000],
                    ["Mime Quiguki", 450000],
                    ["Tigerfruit Collectable Charm", 445000],
                    ["Quiguki Musketeer", 425000],
                    ["Magical Green Elephante Toy", 420000],
                    ["What What What Stick", 390000],
                    ["Happy Halloween Bag", 310000],
                    ["Snot Blocks", 290000],
                    ["Glowing Mushrooms", 270000],
                    ["Tooth Faerie Snowglobe", 260000],
                    ["Clock", 240000],
                    ["Halloween Y14 Goodie Bag", 240000],
                    ["Quiguki Zombie", 230000],
                    ["Faerie Buzz Plushie Collectable Charm", 220000],
                    ["Psellia Doll", 220000],
                    ["Usukicon Y21 Bag", 205000],
                    ["Snot Slingshot", 200000],
                    ["Mutant Golf Club", 170000],
                    ["Cool Purple Teddy Bear", 165000],
                    ["Candy Cane Stocking", 160000],
                    ["Faerie Queen Snowglobe", 137000],
                    ["Queen Fyora Quiguki", 128000],
                    ["Kaylas Chemistry Set", 95500],
                    ["Patched Stocking", 89000],
                    ["Neopets 20th Birthday Goodie Bag", 88500],
                    ["Summer Fun Quiguki", 85000],
                    ["Jhudora Bobblehead", 83000],
                    ["Red Skateboard", 79500],
                    ["Starry Stocking", 73500],
                    ["Earth Faerie Snowglobe", 71000],
                    ["Charming Belle Quiguki", 67000],
                    ["Blumaroo Jester Mock Sceptre", 63500],
                ]
            },

            get shop4() {// Clothes Shop
                return [
                    ["Flower Basket", 5000000],
                    ["Baby Cloud Hat", 2200000],
                    ["Charming Pink Draik Gown", 2000000],
                    ["Pretty Net Dress", 1800000],
                    ["Red Fur Jacket", 1300000],

                    // All the new stuff
                    ["Rancher Xweetok Gloves", 0], // No price
                    ["Rancher Xweetok Holster", 0], // No price
                    ["Rancher Xweetok Pants", 0], // No price
                    ["Rancher Xweetok Boots", 0], // No price
                    ["Rancher Xweetok Vest", 0], // No price
                    ["Rancher Xweetok Hat", 0], // No price
                    ["Biker Usul Makeup", 0], // No price
                    ["Biker Usul Boots", 0], // No price
                    ["Biker Usul Pants", 0], // No price
                    ["Biker Usul Gloves", 0], // No price
                    ["Biker Usul Jacket", 0], // No price
                    ["Biker Usul Wig", 0], // No price
                    // new stuff ends here

                    ["I Love Kadoatie T-Shirt", 975000],
                    ["Kacheek Pyjama Cap", 940000],
                    ["Kacheek Pyjama Gown", 915000],
                    ["Kougra Fortune Teller Dress", 915000],
                    ["3D Glasses", 900000],
                    ["Elegant Draik Hat", 900000],
                    ["Mysterious Draik Trousers", 900000],
                    ["Illusen Umbrella Cut Dress", 865000],
                    ["I Love Hornsby T-Shirt", 840000],
                    ["Lupe Knight Tail Armour", 810000],
                    ["Pink Blooky T-Shirt", 785000],
                    ["Snowy Xweetok Dress", 750000],
                    ["Lupe Knight Bottom Armour", 705000],
                    ["Pink Kadoatie T-Shirt", 700000],
                    ["Xweetok Popstar Dress", 695000],
                    ["Goth Blumaroo Makeup", 660000],
                    ["Studded Leather Uni Shoes", 655000],
                    ["I Love Scarabug T-Shirt", 635000],
                    ["Chia Sailor Shirt", 630000],
                    ["Alien Aisha Ears", 620000],
                    ["Steel Nails", 585000],
                    ["Yellow Sunutek T-Shirt", 585000],
                    ["Elegant Draik Earrings", 545000],
                    ["I Love Tenna T-Shirt", 500000],
                    ["Jungle Aisha Hat", 500000],
                    ["Pretty Spring Cybunny Dress", 500000],
                    ["Yellow Ramosan T-Shirt", 500000],
                    ["Heart Print Dress", 495000],
                    ["Shenkuu-Inspired Paper Parasol", 470000],
                    ["Traditional Shenkuu Hissi Hat", 450000],
                    ["Lupe Knight Foot Armour", 445000],
                    ["Bionic Cybunny Cranium Cover", 425000],
                    ["Green Kougra Wig", 425000],
                    ["I Love Faerie Cadro T-Shirt", 420000],
                    ["Kyrii Mage Robe", 420000],
                    ["Cool Jetsam Jacket", 410000],
                    ["Draik Archer Hat", 400000],
                    ["I Love Lyins T-Shirt", 400000],
                    ["Gothic Kougra Shoes", 390000],
                    ["Quiggle Tea Party Makeup", 380000],
                    ["Kougra Fortune Teller Sandals", 360000],
                    ["Little Red Riding Hood Cybunny Cape", 360000],
                    ["Gothic Kougra Jacket", 350000],
                    ["Mysterious Draik Jacket", 345000],
                    ["Elegant Pink Draik Fan", 340000],
                    ["Magic Sparkle Wand", 340000],
                    ["On the Go Cybunny Makeup", 340000],
                    ["Ombre Fyora Wig", 330000],
                    ["Purple Krawk Cloak", 325000],
                    ["Draik Archer Trousers", 315000],
                    ["Uni Knight Helmet", 300000],
                    ["Usul Ski Suit", 295000],
                    ["Krawk Wizard Cloak", 285000],
                    ["Mysterious Draik Mask", 285000],
                    ["Faerie Queen Wings", 280000],
                    ["Fancy Aisha Wig", 265000],
                    ["School Girl Shoes", 260000],
                    ["Lovely Kacheek Dress", 250000],
                    ["Pinceron T-Shirt", 250000],
                    ["Pink Flosset T-Shirt", 250000],
                    ["Tonu Detective Pants", 250000],
                    ["Kougra Fortune Teller Jewelry", 245000],
                    ["Dapper Poogle Hat", 240000],
                    ["Gothic Kougra Trousers", 240000],
                    ["Lovely Kacheek Wig", 240000],
                    ["On the Go Cybunny Dress", 240000],
                    ["Pink Krawk Hair", 240000],
                    ["Elegant Draik Slippers", 237000],
                    ["Purple Hissi Dress", 235000],
                    ["Cybunny Ocean Warrior Dress", 230000],
                    ["On the Go Cybunny Wig", 230000],
                    ["Draik Sorceress Cloak", 225000],
                    ["Lutari Gentleman Trousers", 220000],
                    ["Trendy Aisha Shirt and Trousers", 220000],
                    ["Candy Ruki Dress", 215000],
                    ["Cybunny Ocean Warrior Shoes", 215000],
                    ["Witch Eyrie Wings", 215000],
                    ["Beach Day Kacheek Sun Hat", 210000],
                    ["Lutari Gentleman Jacket", 210000],
                    ["Wasteland Gelert Bracers", 210000],
                    ["Shrouded Draik Trousers", 205000],
                    // ["Gothic Korbat Wig", 195000],
                    // ["Lovely Kacheek Tail Cover", 190000],
                    // ["Dapper Poogle Trousers", 185000],
                    // ["Delightful Poogle Necklace", 185000],
                    // ["Ixi Forest Cape", 185000],
                    // ["Space Gypsy Xweetok Dress", 180000],
                    // ["Traditional Shenkuu Hissi Gloves", 180000],
                    // ["Hasee T-Shirt", 175000],
                    // ["Ixi Bandit Belt", 175000],
                    // ["Beach Day Kacheek Tank Top", 170000],
                    // ["I got taxed by the Tax Beast T-Shirt", 170000],
                    // ["Hissi Gentleman Jacket", 160000],
                    // ["Uni Knight Top Armour", 160000],
                    // ["Beach Day Kacheek Sandals", 155000],
                    // ["Gothic Kougra Wig", 155000],
                    // ["Xweetok Party Dress", 155000],
                    // ["Chia Sailor Hat", 150000],
                    // ["Elegant Draik Necklace", 150000],
                    // ["Goth Blumaroo Rose", 150000],
                    // ["Shoyru Knight Boots", 150000],
                    // ["Shrouded Draik Shoes", 148000],
                    // ["Proper Zafara Overalls Outfit", 142000],
                    // ["I Love Spyder T-Shirt", 140000],
                    // ["Elegant Kacheek Warrior Wig", 137000],
                    // ["I Love Buzzer T-Shirt", 134000],
                    // ["Blue Bogie T-Shirt", 133000],
                    // ["Zafara Altador Heroine Dress", 132000],
                    // ["Studded Leather Uni Trousers", 128000],
                    // ["Lupe Knight Top Armour", 125000],
                    // ["Lutari Aviator Jacket", 124000],
                    // ["Aviator Scorchio Wing Wraps", 121000],
                    // ["Lotus Xweetok Dress", 120000],
                    // ["Krawk Wizard Shoes", 119000],
                    // ["Dark Uni Cloak", 118000],
                    // ["Draik Sorceress Belt and Tunic", 117000],
                    // ["Trekker Shoyru Walking Stick", 117000],
                    // ["Beach Day Kacheek Skirt", 115000],
                    // ["Goth Blumaroo Scarf", 115000],
                    // ["Mysterious Draik Gloves", 115000],
                    // ["Grundo Space Goggles", 110000],
                    // ["Rocket Shoyru Helmet", 110000],
                    // ["Aisha Space Suit", 109000],
                    // ["Krawk Wizard Beard", 109000],
                    // ["Lutari Gentleman Shoes", 109000],
                    // ["Little Hearts Dress", 108000],
                    // ["Shrouded Draik Shirt and Sash", 106000],
                    // ["Krawk T-Shirt", 104000],
                    // ["Slick Gelert Shirt and Vest", 104000],
                    // ["Bruce Archer Dress", 100000],
                    // ["Krawk Hunter Boots", 100000],
                    // ["Spring Time Female Krawk Bouquet", 100000],
                    // ["Xweetok Popstar Earrings", 100000],
                ]
            },

            get shop5() {// Grooming Shop
                return [
                    ["Dung Derived Lipstick", 999999],
                    ["Aromatic Candle", 999999],
                    ["Glyme Perfume", 999999],
                    ["Wibreth Comb", 385000],
                    ["Fire Faerie Hair Brush", 185000],
                    ["Rose Brush", 85000],
                ]
            },

            get shop6() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop7() {// Book Shop
                return [
                    ["Koya Korbat Huntress", r100],
                    ["Culture and History of Faerieland", r99],
                    ["Petfolio", r99],
                    ["Modern Lupe Magazine", r99], // Inflation Notice
                    ["Beating Sloth", 5000000], // Inflation Notice r99
                    ["Neopian Heroes", 5000000], // Inflation Notice r99
                    ["Trigonometry Hyperbolics", 5000000],
                    ["When Neggs Explode", 5000000],
                    ["Forbidden Zafara", 4100000],
                    ["Illusens Diary", 3600000],
                    ["Super Secret Guide to the Defenders of Neopia Headquarters", 3500000],
                    ["The Voodoo Techo", 3200000],
                    ["A History of Chias", 3000000],
                    ["Gifts for your Enemies", 3000000],
                    ["The Bad Skeith", 3000000],
                    ["Zafara Mystery Collection", 3000000],
                    ["Bruces Guide to Combat Eating", 2800000],
                    ["Best Friends", 2700000],
                    ["A Chia Story", 2600000],
                    ["Ultimate Space Chronicles Set", 2600000],
                    ["Flotsam Tales", 2500000],
                    ["Brain Trees Brainiac", 2500000],
                    ["The Magic Staff", 2500000],
                    ["A Seasonal Pea", 2400000],
                    ["Cures for Bad Breath", 2400000],
                    ["A Chia Halloween", 2300000],
                    ["Lenny Cookbook", 2300000],
                    ["101 Thieving Tricks", 2200000],
                    ["The Shadow Usul", 2200000],
                    ["Jelly Acara Travels", 2000000],
                    ["Decoding a Coded Decoding Book", 2000000],
                    ["Nimmo Battle Cry", 2000000],
                    ["Olde Zafara", 2000000],
                    ["Sophie, A Biography", 2000000],
                    ["Uni Myths", 2000000],
                    ["Gruslens Galore", 1900000],
                    ["The Key to being an Altadorian", 1900000],
                    ["Inside the Mind of Bob", 1860000],
                    ["Zafara War", 1850000],
                    ["Chomby Mysteries", 1800000],
                    ["Princess Vyssas Diary", 1600000],
                    ["Meercas In Love", 1500000],
                    ["Lenny Witchcraft", 1500000],
                    ["Baking Chocolate Korbats", 1350000],
                    ["Chia Art History", 1300000],
                    ["The Island Of Kacheeks", 999999],
                    ["Faerie Secrets", 999999],
                    ["Lupe Digest", 999999],
                    ["The Happiest Day", 999999],
                    ["Book of Fake Scratchcards", 999999],
                    ["Joy of Jelly Kaus", 999999],
                    ["12 Angry Myncies", 990000],
                    ["Gallery Of Toast", 935000],
                    ["My Life As A Lenny", 925000],
                    ["Book Of Peas", 900000],
                    ["Calculus Basics", 890000],
                    ["Chia Quotes", 855000],
                    ["Conquer the Dark", 850000],
                    ["Go Home Moehog!", 850000],
                    ["Extinct Neopian Languages", 835000],
                    ["Finding Illusen", 835000],
                    ["Cake Recipes for All Occasions", 815000],
                    ["Cheat By Capara", 800000],
                    ["Iron Skeith", 800000],
                    ["Quantum Physics", 800000],
                    ["Zafara Lore", 775000],
                    ["Professor Hugo Fairweathers Guide to Petpetpets", 750000],
                    ["Pteri Pop-Up Book", 720000],
                    ["Cybunny Care", 715000],
                    ["Book of Bruno", 705000],
                    ["Faerie Chombies", 700000],
                    ["Faerie Imprisonment for Fun and Profit", 700000],
                    ["Mortog Music", 700000],
                    ["Book of Evil Schemes", 700000],
                    ["Kougra Classics", 695000],
                    ["The Book of Paper Cuts", 685000],
                    ["Grundo Tales", 655000],
                    ["Mollusk Magazine", 655000],
                    ["Lawyerbot Poetry Vol. 1", 615000],
                    ["Moehog Matching", 615000],
                    ["A Magazine", 600000], // Inflation Notice
                    ["Origami Poogle Pop Up Book", 600000],
                    ["Peophin Power!", 550000],
                    ["Shenkuu Hiking", 550000],
                    ["The Zombie Chomby", 520000],
                    ["1052 Sakhmetian Tales", 500000],
                    ["Aerial Shots of Neopia", 500000],
                    ["The Pea From Outer Space", 500000], // Inflation Notice
                    ["Neopias Past", 495000],
                    ["Poogle Pages", 485000],
                    ["Care of Koi", 440000],
                    ["The Eyrie Guard", 430000],
                    ["Hold Your Breath", 415000],
                    ["The Joys of Cooking with Magma", 415000],
                    ["All is Well", 410000],
                    ["A Chias Choice", 400000], // Inflation Notice
                    ["The Velveteen Draik", 400000], // Inflation Notice
                    ["Famous Chias", 400000],
                    ["Baby JubJub Cloth Book", 395000],
                    ["Illusens Journey", 390000],
                    ["Neopian Atlas", 390000],
                    ["Unabridged Dictionary", 385000],
                    ["Jazzmosis Biography", 380000],
                    ["Rubber Mallard Collecting", 375000],
                    ["A Grarrls Growl", 350000],
                    ["Illusions Illusion", 350000],
                    ["Super Lupe Comics", 350000],
                    ["Growing a Vine Yard", 335000],
                    ["Faerieland Altador Cup Media Book", 330000],
                    ["Kau Pastures", 325000],
                    ["Making Kau Plushies", 320000],
                    ["Decorative Towel Folding", 310000],
                    ["Spooky Usul Stories", 310000],
                    ["Chianatomy", 305000],
                    ["Secret Lenny Book", 300000], // Inflation Notice
                    ["Meruth The True Story", 300000], // Inflation Notice
                    ["Legend Of The Quiggle Runner", 300000], // Inflation Notice
                    ["Shenkuu Altador Cup Media Book", 300000],
                    ["Deciphering Your Dreams", 280000],
                    ["Jeran the Lupe", 270000],
                    ["The Life of a Hot Dog", 260000],
                    ["Moehog Masterpieces", 255000],
                    ["Space and Magic", 225000],
                    ["The Draik", 223000],
                    ["The Way of the Draik", 220000],
                    ["The Grizzly Gruslen", 210000],
                    ["Chomby Poems", 200000],
                    ["Do It Yourself Bobbleheads", 200000],
                    ["Poogle Day Ideas", 200000],
                    ["Lupe Legends", 200000],
                    ["Cenanit Ragamans", 200000], // Inflation Notice
                    ["101 Leafy Uses", 200000], // Inflation Notice
                    ["Captain Meerca", 183000],
                    ["Krawk Island Altador Cup Play Book", 175000],
                    ["Maraquan Pop-Up Book", 170000],
                    ["Monstrous Makeovers", 156000],
                    ["Gelert A to Z", 150000], // Inflation Notice
                    ["Spotting Seaweed", 142000],
                    ["Buzz Acrobatic Stunts", 134000],
                    ["A Faerie Beautiful Day", 133000],
                    ["All About Dark Faeries", 129000],
                    ["The Chomby Secret", 126000],
                    ["Cleaning Technology", 125000],
                    ["Darigan Citadel Altador Cup Media Book", 110000],
                    ["The Symol Scientist", 110000],
                    ["The Guide to Facial Hair", 106000],
                    ["All About Earth Faeries", 105000],
                    ["Cooking With Your Wock(y)", 102000],
                    ["How to Make a Bonfire", 99500],
                    ["Experimental Physics", 97500],
                    ["Hand-crafted Wool Paper", 95500],
                    ["Purple Lupe Photo Album", 94500],
                    ["Shenkuu Floral Arrangement", 91500],
                    ["Harquins Day", 89000],
                    ["All About Fire Faeries", 88500],
                    ["The Legend of Scordrax", 86000],
                    ["An Eyrie Evening", 85500],
                    ["Unwanted Grey", 85500],
                    ["Draik Tales", 85000],
                    ["Enchanted Butterfly Book", 81500],
                    ["Big Book of Facts", 80000],
                    ["300m Peanut Dash Guide Book", 79000],
                    ["Abominable Snowball Fights", 75500],
                    ["The Lonely JubJub", 75000],
                    ["Carnival Of Terror Guide Book", 70000],
                    ["Biological Encyclopedia of 14 Basic Neopian Algaes Vol. 12", 66000],
                    ["Faeries from Paradise", 62500],
                    ["Usul Investigations", 61500],
                    ["Common Cures: Revised Edition", 59500],
                    ["Now You Can Fry Anything", 59500],
                    ["Bleak Meals for One", 57500],
                    ["Ixi Glade", 57500],
                    ["Illusens Book of Charm", 56500],
                    ["Common Cures", 56000],
                    ["How To Avoid Poisonous Mushrooms.", 56000],
                    ["Haunted Woods Altador Cup Media Book", 50000],
                    ["Lost Desert Altador Cup Media Book", 47300],
                    ["Quiguki Mermaid Tales", 43800],
                    ["Vicious Attack Book", 43300],
                    ["The Hot Scorchio Cook Book", 43100],
                    ["Kacheek Magic", 41000],
                    ["All about Food", 40000],
                ]
            },

            get shop8() {// Collectable Card Shop
                return [
                    ["Little Timmy", 30000000],
                    ["Khan the Unstoppable", 10000000],
                    ["Enchanted Ixi", 8500000],
                    ["Extreme Herder", 8300000],
                    ["Captain Xelqued", 6000000],
                    ["Siona", 6000000],
                    ["Draconus Maximus", 4500000],
                    ["Sergeant Brexis", 4000000],
                    ["Swamp Ghoul", 4000000],
                    ["Marillis Harbane", 3875000],
                    ["Punchbag Bob", 3750000],
                    ["Professor Kachevski", 3475000],
                    ["Lord Kass Card", 3200000],
                    ["Duel Bazuka", 2800000],
                    ["Gilly the Usul", 2700000],
                    ["The Incredible Grarrl", 2000000],
                    ["Jeran", 1950000],
                    ["Champion", 1800000],
                    ["Meruth", 1800000],
                    ["Zafara Double Agent", 1700000],
                    ["Zeirn the Electric Kougra", 1700000],
                    ["Kalandra", 1600000],
                    ["Master Vex", 1500000],
                    ["Wock Til You Drop", 1500000],
                    ["The Hairy Tongue Beast", 1375000],
                    ["Lady Quintara", 1275000],
                    ["Branston the Eyrie", 999999],
                    ["Sargug", 999999],
                    ["Zygorax", 965000],
                    ["Jhudora the Dark Faerie", 925000],
                    ["Deckswabber", 920000],
                    ["Shylock Usulski", 890000],
                    ["Iskha Lightbringer", 830000],
                    ["Krawk Swashbuckler", 700000],
                    ["Space Krawk", 690000],
                    ["Valrigard", 670000],
                    ["Grotson", 650000],
                    ["Margoreth", 650000],
                    ["Kauvara", 570000],
                    ["Hubrid Nox", 500000],
                    ["Gedda Happycheek", 430000],
                    ["Lunchtime", 390000],
                    ["Mr. Chuckles", 385000],
                    ["The Shop Wizard", 355000],
                    ["Scauderwelsch", 345000],
                    ["Mechanoid Warrior", 330000],
                    ["Taelia The Snow Faerie", 280000],
                    ["Illusen the Earth Faerie", 200000],
                    ["Cherlops, Protector of Garn", 175000],
                    ["Treasure Seekers", 175000],
                    ["Mechachiazilla", 170000],
                    ["Garrox5 The Grundo Trooper", 160000],
                    ["Jahbal", 132000],
                ]
            },

            get shop9() {// Battle Magic Shop
                return [
                    ["Bony Grarrl Club", 18000000],
                    ["Kacheek Flour", 2750000],
                    ["Water Faerie Token", 2000000],
                    ["Fire Faerie Token", 999999],
                    ["Blade of Ultranova", 800000],
                    ["Moehog Crossbow", 795000],
                    ["Dark Faerie Token", 750000],
                    ["Super Attack Bacon", 730000],
                    ["Chia Mites", 700000],
                    ["Illusens Gems", 620000],
                    ["Painted Techo Club", 595000],
                    ["Silver Korbat Amulet", 585000],
                    ["Draik Enhancement Brew", 580000],
                    ["Air Faerie Token", 575000],
                    ["Enchanted Ixi Wand", 575000],
                    ["Rainbow Sticky Hand", 500000],
                    ["Taelias Snowball", 500000],
                    ["Hand Carved Draik Slingshot", 495000],
                    ["Last Avocado Bomb", 490000],
                    ["Wooden Krawk Mallet", 480000],
                    ["Blade of the Battle Faerie", 450000],
                    ["Bottled Uni Essence", 425000],
                    ["JubJub Foot Hardening Lotion", 420000],
                    ["Golden Peophin Harp", 400000],
                    ["Highland Chia War Paint", 400000],
                    ["Light Faerie Token", 400000],
                    ["Sack of Garlic Powder", 400000],
                    ["Coral Koi Slingshot", 380000],
                    ["Grape Jelly Sword", 370000],
                    ["Icy Chia Goggles", 370000],
                    ["Bubbling Lupe Potion", 365000],
                    ["JubJub Flame Ball", 360000],
                    ["Acara Twin Blade", 350000],
                    ["Spotted Kau Sword", 350000],
                    ["Blue Clockwork Kiko", 345000],
                    ["Techo Dagger Of Speed", 335000],
                    ["Kaylas Hat", 330000],
                    ["Bouncy Kiko Ball of Doom", 325000],
                    ["Winged Shoyru Spear", 325000],
                    ["Chia Apple Bomb", 320000],
                    ["Uni Horn Wand", 315000],
                    ["Blade of Supernova", 310000],
                    ["Earth Faerie Token", 310000],
                    ["Kiko Throwing Plasters", 300000],
                    ["Mango Jelly Club", 300000],
                    ["Nova Blade", 300000],
                    ["Poogle Slingshot", 300000],
                    ["Silver Draik Bow", 300000],
                    ["Maraquan Draik Dagger", 295000],
                    ["Enhanced Acara Potion", 290000],
                    ["Golden Bori Staff", 290000],
                    ["Tangle Net Gun", 290000],
                    ["Green Clockwork Hissi", 280000],
                    ["Barbed Buzz Dagger", 275000],
                    ["Blue Acara Slingshot", 275000],
                    ["P-Bomb", 270000],
                    ["Uni Hoof Magnet", 270000],
                    ["Hand Carved Blumaroo Bow", 260000],
                    ["Ticking Eyrie Bomb", 260000],
                    ["Pink Clockwork Poogle", 245000],
                    ["Apple Jelly Club", 240000],
                    ["Regal Draik Wand", 240000],
                    ["Moehog Bristle Dagger", 230000],
                    ["Enchanted Kougra Pendant", 225000],
                    ["Furry Lupe Staff", 225000],
                    ["Pteri Egg Shot", 220000],
                    ["Staff of Ultranova", 220000],
                    ["Horned Grarrl Slingshot", 210000],
                    ["Ixi Elixir of the Woods", 205000],
                    ["Highland Chia War Hammer", 200000],
                    ["Pirate Slingshot", 200000],
                    ["Pirate Spear", 200000],
                    ["Wooden Kau Wand", 200000],
                ]
            },

            get shop10() {// Defense Magic Shop
                return [
                    ["Thyoras Tear", 35000000],
                    ["Flame Reflectozap", 3800000],
                    ["Rainbow Scorchstone", 3200000],
                    ["Ultra Dual Shovel", 1800000],
                    ["Squishy Shoyru Healing Stone", 1700000],
                    ["Purple Scorchstone", 1500000],
                    ["Triple Turbo Dryer", 1425000],
                    ["Superior Reflection Shield", 999999],
                    ["Bag of Lenny Healing Seeds", 900000],
                    ["Ultimate Dark Reflectorb", 900000],
                    ["Winged Shoyru Amulet", 900000],
                    ["Healing Ankh of the Nimmo", 750000],
                    ["Highland Chia Battle Shield", 625000],
                    ["Full Gnorbu Armour", 445000],
                    ["Uni Charm", 440000],
                    ["Uni Healing Crown", 400000],
                    ["Maraquan Draik Cloak", 390000],
                    ["Bubbling Ruki Elixir", 380000],
                    ["Hand Carved Shoyru Wand", 380000],
                    ["Full Elephante Armour", 370000],
                    ["Elixir of the Pirate", 355000],
                    ["Nimmo Elixir of Healing", 335000],
                    ["Kaylas Magic Cloak", 325000],
                    ["Full Aisha Armour", 310000],
                    ["Full Draik Armour", 310000],
                    ["Illusens Silver Shield", 310000],
                    ["Tower Shield", 290000],
                    ["Lucky Uni Charm", 270000],
                    ["Silver Draik Wing Guards", 260000],
                    ["Cloak of Night", 250000],
                    ["Full JubJub Armour", 250000],
                    ["Combo Battle Mirror", 245000],
                    ["Full Lutari Armour", 225000],
                    ["Full Poogle Armour", 200000],
                ]
            },

            get shop11() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop12() {// Garden Centre
                return [
                    ["Jellybean Tree", 3775000],
                    ["Mini Giant Jelly", 2800000],
                    ["Jhudora Statue", 2000000],
                    ["Disco Birdhouse", 1500000],
                    ["Lord Kass Gnome", 1200000],
                    ["All Seeing Tree", 895000],
                    ["Scarescorchio", 750000],
                    ["Golden Garden Bench", 705000],
                    ["Asparagus Garden", 700000],
                    ["Faerie Birdhouse", 655000],
                    ["Jeran Gnome", 650000],
                    ["Quiggle Statue", 556000],
                    ["Techo Statue", 510000],
                    ["White Wood Pergola", 420000],
                    ["Chia Statue", 345000],
                    ["Oozing Tulip", 320000],
                    ["Slimy Tree", 250000],
                    ["Twisting Vines", 230000],
                    ["Strange Bulb", 215000],
                    ["Blumaroo Statue", 205000],
                    ["Tuskaninny Plant", 200000],
                ]
            },

            get shop13() {// Neopian Pharmacy
                return [
                    ["Sporkle Syrup", 43000],
                    ["Extra Thick Goggles", 14400],
                ]
            },

            get shop14() {// Chocolate Factory
                return [
                    ["Choco Spray", r100],
                    ["Chococherry Blumaroo Ears", r100],
                    ["Chocolate Gum", r100],
                    ["Chocolate Lipstick", r100],
                    ["Chocolate Peanuts With Peas", r100],
                    ["Chocoon", r100],
                    ["Crunchy Chocolate Grarrl", r100],
                    ["Apple Moquot Lollypop", r99],
                    ["Double Chocolate Jelly Beans", r99],
                    ["Fishy Delight Grarrl Gobstopper", r99],
                    ["Rainbow Candy Floss", r99],
                    ["Candy Cane Chocolate Advent Calendar", 5000000],
                    ["Sniddberry Meerca Gobstopper", 5000000],
                    ["Chocolate Crown of the Faeries", 4500000],
                    ["Deluxe Strawberry Toffee Chokato", 3000000],
                    ["Chocolate Crown of Sinsi", 2000000],
                    ["Neotruffle", 2000000],
                    ["Luxury Chocolate Easter Negg", 1700000],
                    ["Spotted Easter Negg", 1700000],
                    ["Mint Chocolate Easter Negg", 1500000],
                    ["Pretty Pink Easter Negg", 1500000],
                    ["Strawberries and Cream Easter Negg", 1500000],
                    ["Marshmallow Plumpy", 1400000],
                    ["Chocolate Orange Easter Negg", 1300000],
                    ["Chocolate Moltenore", 1225000],
                    ["Lemon and Lime Easter Negg", 999999],
                    ["Chocolate Ruki Kit", 665000],
                    ["Orange Lightmite Lollypop", 660000],
                    ["Chocolate Advent Calendar", 565000],
                    ["Holiday Bell Chocolate Advent Calendar", 445000],
                    ["Sugar Tonu Skull", 365000],
                    ["Orange Scoach Lolly", 300000],
                    ["Chocolate Peach", 255000],
                    ["Chocolate Cybunny Negg", 220000],
                    ["Chocolate Dr Sloth", 215000],
                    ["Snowflake Chocolate Advent Calendar", 215000],
                    ["Creamy Choccywhip", 205000],
                    ["Hazelnut Whirl", 205000],
                    ["Draik Sugar Skull", 170000],
                    ["Yummy Drops", 150000],
                    ["ErgyFruit Jelly Beans", 139000],
                    ["Super Spicy Jelly Beans", 102000],
                ]
            },

            get shop15() {// Bakery
                return [
                    ["Chokato Deluxe Aisha Cake", 4125000],
                    ["Grapefruit Cake", 4000000],
                    ["Stack It High Cake", 4000000],
                    ["Meepit Muffins", 3400000],
                    ["Chia Cake", 3300000],
                    ["Borovan Layered Cake", 3250000],
                    ["Double Cream Vanilla Sponge", 3000000],
                    ["Dargil Meat Mince Pie", 2450000],
                    ["Gooseberry Crepe", 2100000],
                    ["Buttered Juppie Waffle", 2000000],
                    ["Chocolate Chip Quiggle Cookie", 1900000],
                    ["Chocolate Cherry Cheesecake", 1500000],
                    ["Pterimisu", 1500000],
                    ["Kacheek Fruit Salad Sandwich", 715000],
                    ["Vionanna Mince Pie", 710000],
                    ["Scamander Cookies", 665000],
                    ["Chocolate Stuffed Pastry", 580000],
                    ["Bluepepper Muffin", 380000],
                    ["Fyora Cookies", 315000],
                    ["Lime Chomby Cake", 300000],
                    ["Irate Zafara Claw", 243000],
                    ["Snowy Pancakes", 232000],
                    ["Angry Cinnamon Roll", 203000],
                    ["Chocolate Meerca Roll", 200000],
                    ["Doglefox Bread Creature", 198000],
                    ["Haiku Dessert", 180000],
                    ["Hostile Quiche", 180000],
                    ["Explosive New Year Cake", 177000],
                    ["Sugar Nerkmid Biscuit", 177000],
                    ["Kacheek Baby Cabbage Sandwiches", 170000],
                    ["Cranky Croissant", 166000],
                    ["Borovan Cupcake", 165000],
                    ["Babaa Cake", 161000],
                    ["Blue PaintBrush Cookie", 121000],
                ]
            },

            get shop16() {// Neopian Health Foods
                return [
                    ["Asparagus Balls", r99],
                    ["Cauliflower Lolly", r99],
                    ["Artichoke Fondue", 2000000],
                    ["Broccoli with Sprinkles", 2000000],
                    ["Four Layer Carrot Cake", 2000000],
                    ["Pickled Cauliflower", 2000000],
                    ["Souper Bowl", 2000000],
                    ["Artichoke Cupcake", 1900000],
                    ["Cheesy Asparagus", 1800000],
                    ["Cheesy Carrots", 1700000],
                    ["Cauliflower Shake", 1680000],
                    ["Cauliflower Soup", 1500000],
                    ["Luxury Cabbage Cake", 1500000],
                    ["Tomato Kebab", 1500000],
                    ["Cone-Shaped Cherry", 1400000],
                    ["French Onion Soup", 1400000],
                    ["Artichoke and Onion Surprise", 1300000],
                    ["Fresh Sushi Cone", 350000],
                    ["Broccoli and Mustard Sandwich", 223000],
                    ["Radish and Cheese", 220000],
                    ["Cone-Shaped Lemon", 195000],
                    ["Fresh Sushi Roll", 127000],
                    ["Cone-Shaped Orange", 120000],
                    ["Broccoli Kebab", 85500],
                    ["Baked Apple with Snowberries", 76500],
                    ["Green Tea Spaghetti", 75000],
                    ["Black Mushroom", 68000],
                    ["Radish Meringue", 51000],
                ]
            },

            get shop17() {// Neopian Gift Shop
                return [
                    ["Raining Confetti Hearts", 5000000],
                    ["Pretty Baby Stroller", 1900000],
                    ["Tree of Love", 1275000],
                    ["Lawyerbot Self-Portrait", 835000],
                    ["Must-Have Figure Assortment", 675000],
                    ["Green Gem Negg", 375000],
                    ["Lighted Wreath Frame", 375000],
                    ["Ornate Ivory Love Spoon", 229000],
                    ["Pretty Fish Bowl", 205000],
                    ["Silverware Set", 100000],
                    ["Field of Glowing Flowers", 99000],
                    ["Blurtle Sand Pit", 69000],
                ]
            },

            get shop18() {// Smoothie Store
                return [
                    ["Mega Honeyplume Smoothie", 3000000],
                    ["Large Sand Smoothie", 224000],
                    ["Mega Lemon Blitz Smoothie", 118000],
                    ["Mega Salmon Sherbert Smoothie", 99000],
                ]
            },

            get shop19() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop20() {// Tropical Food
                return [
                    ["Zeenana", r100],
                    ["Songray", 3500000],
                    ["Icy Doughnutfruit", 1850000],
                    ["Fiery Doughnutfruit", 1700000],
                    ["Silver Doughnutfruit", 1700000],
                    ["Rainbow Doughnutfruit", 1600000],
                    ["Bubbling Kraku Thickshake", 1500000],
                    ["Purple Doughnutfruit", 1500000],
                    ["TeaLeef", 1500000],
                    ["Yellow Doughnutfruit", 1500000],
                    ["Pink Chokato", 1400000],
                    ["Green Doughnutfruit", 1400000],
                    ["Fish Doughnutfruit", 1350000],
                    ["Blue Doughnutfruit", 1300000],
                    ["Checkered Doughnutfruit", 1300000],
                    ["Sponge Doughnutfruit", 1100000],
                    ["Golden Doughnutfruit", 999999],
                    ["Marafalop", 850000],
                    ["Plantcake", 825000],
                    ["Bludberry", 710000],
                    ["Evil Pinanna", 690000],
                    ["Ugly Pinanna", 670000],
                    ["Pinanna Plus", 380000],
                    ["Strange Pinanna", 330000],
                    ["Lavaberry", 260000],
                    ["Chokato", 245000],
                    ["Gelupepper", 235000],
                    ["Krakuberries", 235000],
                    ["Tigersquash", 235000],
                    ["Vein Cabbage", 225000],
                    ["Doughnutfruit", 195000],
                    ["Fresh Lobster Tail", 195000],
                    ["Thornberry", 170000],
                    ["Strong Berry", 147000],
                    ["Cornupepper", 137000],
                    ["Purple Juppie Slurpbowl", 136000],
                    ["Roe Sushi", 121000],
                    ["Tigerbuggles", 114000],
                    ["Strawberry Salmon", 112000],
                    ["Tigerfruit", 106000],
                    ["Phear", 104000],
                    ["Seedless Skeem Jam", 102000],
                    ["Ergyfruit", 100000],
                    ["Juicy Melon", 96000],
                    ["Seafood Pasta Salad", 93500],
                ]
            },

            get shop21() {// Tiki Tack
                return [
                    ["Fancy Bottle of Sand", 999999],
                    ["Bottle of Bubbles Sand", 710000],
                    ["Skull Full of Sand", 226000],
                    ["Volcano Crystal", 165000],
                ]
            },

            get shop22() {// Grundos
                return [
                    ["Tofu Space Slug Soup", 1600000],
                    ["Vegetarian Sloth Wrap", 1300000],
                    ["Sloth Wrap", 930000],
                    ["Milkyway Shake", 325000],
                    ["Spotted Pudding with Custard", 300000],
                    ["Tigersquash Spectacular", 182000],
                    ["Obliteratoes", 123000],
                ]
            },

            get shop23() {// Space Weaponry
                return [
                    ["Pocket Satellite", r99],
                    ["Neutralising Ray", 93000],
                    ["Virtublaster 5000", 92000],
                    ["Bzzapper", 90000],
                    ["Honey Goo Blaster", 77000],
                    ["Sonic Melter", 72000],
                    ["Calculation Device", 67000],
                    ["Energy Blaster", 51500],
                ]
            },

            get shop24() {// Space Armour
                return [
                    ["Space Scrap Shield", 205000],
                    ["Full Grundo Armour", 96000],
                    ["Zero-G Scout Pack", 95000],
                    ["Force Shield", 60000],
                    ["Green Attack Stilts", 55000],
                    ["Solar Flare Shield", 55000],
                    ["Nebula Force Field Generator", 26000],
                ]
            },

            get shop25() {// Neopian Petpet Shop
                return [
                    ["Kadoatie", 10000000],
                    ["Moltenore", 2875000],
                    ["Cadro", 820000],
                    ["Snotbunny", 350000],
                    ["Bogie", 215000],
                    ["Darblat", 98500],
                ]
            },

            get shop26() {// Robopet Shop
                return [
                    ["Zoomik", 650000],
                    ["Rotoblur 4000", 540000],
                    ["Vacumatic 9000", 390000],
                    ["Beepallite", 380000],
                    ["C430 Autobot", 255000],
                    ["Rollatron", 109000],
                    ["Avabot", 100000],
                ]
            },

            get shop27() {// Rock Pool
                return [
                    ["Lutra", 275000],
                    ["Frowny", 220000],
                    ["Spirkle", 80500],
                    ["Ghostkerfish", 37500],
                ]
            },

            get shop28() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop29() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop30() {// Spooky Food
                return [
                    ["Cadaverous Cola", 1300000],
                    ["Elderly Apple", 870000],
                    ["Snorkle Pudding", 800000],
                    ["Apple Lantern", 765000],
                    ["Coco Pumpkin", 755000],
                    ["Pumpkin Scoopings", 695000],
                    ["Jelly Spider Eyeball", 685000],
                    ["Wing of Korbat", 680000],
                    ["Mouldy Cheese", 620000],
                    ["Gorerito", 610000],
                    ["Parts on a Pizza", 605000],
                    ["Halloween Candy Cane", 445000],
                    ["Meerca Pie", 440000],
                    ["Jelly Finger", 435000],
                    ["Crunchy Snotball", 380000],
                    ["Rotting Veggies Salad", 270000],
                    ["Forgotten Apple", 235000],
                    ["Ghost Puff", 235000],
                    ["Pink Apple Lantern", 200000],
                    ["Poison Apples", 150000],
                    ["BluePepper Porridge", 143000],
                    ["Pink Spooky Ice Cream", 140000],
                    ["Spoooky Muffin", 130000],
                    //["Grundo Toe Lint", (no price)],
                    //["Raspberry Ghostkerchief Jelly", (no price)],
                    ["Coffee of the Dead", 55000],
                    ["Chocolate Coated Eye", 40000],
                    ["Deadly Apple Pie", 33000],
                ]
            },

            get shop31() {// Spooky Petpets
                return [
                    ["Pofew", 2400000],
                    ["Schnelly", 83000],
                    ["Candy Vampire", 32300],
                ]
            },

            get shop32() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop33() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop34() {// Ye Olde Coffee Shop
                return [
                    ["Coffee Service", 2000000],
                    ["Zeenana Split", 1900000],
                    ["Elegant Tea Service", 340000],
                    ["Murky Green", 300000],
                    ["Cocoa Juppie Mocha", 240000],
                    ["Rosemary Mushroom Tea", 137000],
                    ["Relaxation Tea", 0], // no price
                    ["Dark Tea", 62500],
                ]
            },

            get shop35() {// Slushie Shop
                return [
                    ["Transparaberry Slushie", 2000000],
                    ["Freshly Cut Grass Slushie", 1400000],
                    ["Cheeseburger Slushie", 935000],
                    ["Magical Red Starry Slushie", 745000],
                    ["Cherry Lemonade Slushie", 600000],
                    ["Pan Galactic Gargle Slushie", 435000],
                    ["Tiger Orange Slushie", 390000],
                    ["Peanut and Chocolate Slushie", 345000],
                    ["Creme Brulee Slushie", 200000],
                    ["Berry Blend Slushie", 134000],
                    ["Secret Sloth Slushie", 50500],
                ]
            },

            get shop36() {// Ice Crystal Shop
                return [
                    ["Freezing Potion", 4000000],
                    ["Frozen Scroll", 155000],
                    ["Ice Sceptre", 140000],
                    //["Frozen Wave Scimitar", 120000],
                    ["Claw of the Ancient Bori", 102000],
                    ["Snow Flame", 97000],
                    //["Icy Snowflake", 90000],
                    //["Frozen Water Daggers", 88000],
                    ["Icy Glove", 88000],
                    ["Unlockable Ice Treasure", 49700],
                ]
            },

            get shop37() {// Icy Fun Snow Shop
                return [
                    ["Magical Pea Chia Pop", 4100000],
                    ["Angelic Ice Lolly", 1600000],
                    ["Maractite Ice Lolly", 885000],
                    ["Hamarama Ice Lolly", 665000],
                    ["Magical Grape Chia Pop", 620000],
                    ["Magical Peach Chia Pop", 590000],
                    ["Magical Apple Chia Pop", 575000],
                    ["Magical Asparagus Chia Pop", 455000],
                    ["Magical Tomato Chia Pop", 450000],
                    ["Magical Pepper Chia Pop", 445000],
                    ["Magical Plum Chia Pop", 410000],
                    ["Magical Blueberry Chia Pop", 390000],
                    ["Magical Chokato Chia Pop", 370000],
                    ["Magical Carrot Chia Pop", 350000],
                    ["Magical Aubergine Chia Pop", 340000],
                    ["Magical Durian Chia Pop", 335000],
                    ["Magical Pear Chia Pop", 335000],
                    ["Magical Onion Chia Pop", 325000],
                    ["Magical Avocado Chia Pop", 300000],
                    ["Magical Agueena Chia Pop", 290000],
                    ["Magical Thornberry Chia Pop", 280000],
                    ["Banana Split Chia Pop", 270000],
                    ["Magical Pineapple Chia Pop", 270000],
                    ["Magical Lime Chia Pop", 265000],
                    ["Magical Gooseberry Chia Pop", 255000],
                    ["Magical Lemon Chia Pop", 240000],
                    ["Magical Orange Chia Pop", 239000],
                    ["Magical Ummagine Chia Pop", 231000],
                    ["Magical Strawberry Chia Pop", 200000],
                    ["Crystal Turkey", 165000],
                    ["Tartan Chia Pop", 107000],
                    ["Crystal Taco", 85000],
                    ["Frozen Negg", 81500],
                ]
            },

            get shop38() {// Faerieland bookshop
                return [
                    ["Fountain of Youth", 2000000],
                    ["Hidden Tower Secrets", 320000],
                    ["The Magic of The Healing Springs", 180000],
                    ["Secret Faerie Diary", 100000],
                ]
            },

            get shop39() {// Faerie Food
                return [
                    ["Ultra Nova Pop", 4000000],
                    ["Grey Faerie Mushroom", 3000000],
                    ["Faerie Dreamwich", 2000000],
                    ["Fyora Apple", 1700000],
                    ["Space Faerie Mushroom", 1600000],
                    ["Faerie Sparklecake", 1500000],
                    ["Faerie Fruit Salad", 490000],
                    ["Faerie Chocodrop", 405000],
                    ["Light Faerie Mushroom", 310000],
                    ["Deluxe Fyora Day Cake", 250000],
                    ["Fire Faerie Red Pepper", 245000],
                    ["Soup Faerie Mushroom", 215000],
                    ["Faerie Block Mallows", 165000],
                    ["Dark Nova Pop", 145000],
                    ["Sugar Coated Leaf", 120000],
                    ["Dark Faerie Mushroom", 92000],
                    ["Bacon Belly Buster", 91500],
                    ["Earth Faerie Mushroom", 81000],
                    ["Fire Faerie Mushroom", 80500],
                    ["Water Faerie Mushroom", 44400],
                    ["Air Faerie Mushroom", 41500],
                ]
            },

            get shop40() {// Faerieland Petpets
                return [
                    ["Zumagorn", 945000],
                    ["Flosset", 855000],
                    ["Floreena", 820000],
                    ["Gwortz", 190000],
                    ["Teemyte", 75000],
                ]
            },

            get shop41() {// Neopian Furniture
                return [
                    ["Glaring Pumpkin", 3800000],
                    ["Jolly Pumpkin", 2000000],
                    ["Heart Shaped Bed", 1800000],
                    ["Kass Toy Box", 1800000],
                    ["Hilarious Pumpkin", 1700000],
                    ["I Love Lord Kass Bean Bag", 1500000],
                    ["Tall Pumpkin", 1500000],
                    ["Icy Fridge", r99],
                    ["Dark Nova Lamp", 905000],
                    ["Glowing Sofa", 895000],
                    ["Dark Nova Rug", 880000],
                    ["Dark Nova Sofa", 875000],
                    ["Rainbow Bath Tub", 875000],
                    ["Curved Glowing Drawer", 720000],
                    ["Cheese Lamp", 500000],
                    ["Dark Nova Table", 470000],
                    ["Glowing Mirror", 440000],
                    ["Mutant Loveseat", 400000],
                    ["Robo Blumaroo", 395000],
                    ["I Love Lord Kass Bed", 375000],
                    ["Glowing Bed", 370000],
                    ["Wiggly Glowing Drawer", 355000],
                    ["Gold Velvet Chair", 340000],
                    ["Meridell Toy Box", 330000],
                    ["Glowing Table", 305000],
                    ["The Hikalakas Totem", 305000],
                    ["Ultranova Wardrobe", 270000],
                    ["Cheese Mat", 255000],
                    ["Mootix Table", 255000],
                    ["Glowing Rug", 215000],
                    ["Cheese Pillow", 210000],
                    ["Cheese Chair", 190000],
                    ["Tiger Sofa", 180000],
                    ["Robo Aisha", 179000],
                    ["Red Brick Bath Tub", 170000],
                    ["Long Glowing Drawer", 160000],
                    ["Glowing Bath Tub", 130000],
                    ["Royal Play Pen", 130000],
                    ["The Three Poster", 121000],
                    ["I Love Lord Kass Pillow", 97000],
                    ["Chilli Table", 86500],
                    ["Lord Kass Emblem Flag", 75000],
                    ["Rainbow Disco Ball", 75000],
                    ["Robo Poogle", 74000],
                    ["I Love Lord Kass Lamp", 73500],
                    ["Cloud Bath Tub", 72500],
                ]
            },

            get shop42() {// Tyrannian Food
                return [
                    ["Blood Mole Plant", 945000],
                    ["Honey Blossom Stone Doughnuts", 780000],
                    ["Primordial Stew", 130000],
                    ["Tyrannian Water Negg", 96500],
                ]
            },

            get shop43() {// Tyrannian Furniture
                return [
                    ["Stone Bedside Table", r99],
                    ["Stone Drawer", r99],
                ]
            },

            get shop44() {// Tyrannian Petpets
                return [
                    ["Krawk", 8250000],
                    ["Rock", 2000000],
                    ["Gathow", 777000],
                    ["Woolypapith", 245000],
                ]
            },

            get shop45() {// Tyrannian Weaponry
                return [
                    ["Turned Tooth", 205000],
                    ["Billion Degree Sword", 150000],
                    ["Monoceraptors Toenail", 0],
                    ["Fiery Spine of Death", 0],
                    ["Fire Ball Staff", 0],
                    ["Mega Fire Shield", 0],
                    ["Fiery Throwing Marble", 0],
                    ["Fire Hammer", 0],
                    ["Rings of Fire", 0],
                ]
            },

            get shop46() {// Hubert's Hot Dog
                return [
                    ["Mummified Hot Dog", r100],
                    ["Mecha Hot Dog", 2000000],
                    ["Diamond Hot Dog", 1800000],
                    ["Burning Hot Dog", 1600000],
                    ["Mini Baby Hot Dogs", 1500000],
                    ["Punk Rocker Hot Dog", 1400000],
                    ["Well-Aged Hot Dog", 1200000],
                    ["Big Beefy Hot Dog", 780000],
                    ["Salt Water Hot Dog", 300000],
                    ["Linked Hot Dogs", 255000],
                    ["Hot Dog with Everything", 225000],
                    ["Stealthy Hot Dog", 200000],
                    ["Natural Hot Dog", 165000],
                    ["14 Karat Baked Potato", 78000],
                    ["Sloth Dog", 72000],
                ]
            },

            get shop47() {// Pizzaroo
                return [
                    ["Happy Birthday Pizza", 1900000],
                    ["PIZZA OF DEATH", 1400000],
                    ["Peachy Pizza", 615000],
                    ["Pirate Pizza", 415000],
                    ["Rainbow Melt Pizza", 11000],
                ]
            },

            get shop48() {// Usuki Land
                return [
                    ["Bat Thing Usuki", r100],
                    ["Queen Fyora Usuki Doll", r100],
                    ["Cheerleader Usuki Reject", 3900000],
                    ["Space Prom Date Usuki Reject", 2500000],
                    ["Lord Kass Usuki", 1600000],
                    ["King Skarl Usuki", 999999],
                    ["Valentines Boy Usuki", 999999],
                    ["Year 8 Usuki", 980000],
                    ["Valentines Girl Usuki", 900000],
                    ["Werewolf Usuki", 880000],
                    ["Strange Metal Usuki", 830000],
                    ["Meridell Usuki Queen", 825000],
                    ["Alien Usuki", 815000],
                    ["Grey Faerie Usuki Doll", 725000],
                    ["Jeran Usuki", 700000],
                    ["Year 9 Usuki", 655000],
                    ["Meridell Usuki King", 600000],
                    ["Usukicon Year 9 Usuki", 535000],
                    ["Gondolier Usuki", 505000],
                    ["Welsh Usuki Reject", 500000],
                    ["Grundo Independence Day Usuki", 475000],
                    ["Graduate Usuki", 465000],
                    ["Lost Desert Usuki", 435000],
                    ["Pirate Captain Usuki", 430000],
                    ["Tyrannian Usuki Reject", 430000],
                    ["Little Brother Usuki", 410000],
                    ["Negg Faerie Usuki Set", 395000],
                    ["Usuki Defender", 385000],
                    ["Air Faerie Usuki Doll", 375000],
                    ["Usuki Dream Jetski", 350000],
                    ["Teenage Usuki Reject", 345000],
                    ["Meridell Usuki", 340000],
                    ["Magical Hair Usuki Reject", 325000],
                    ["Fun in the Sun Usuki Reject", 315000],
                    ["Super Hero Usuki", 310000],
                    ["Hawaiian Usuki Reject", 300000],
                    ["Mayor Thumburt Usuki", 300000],
                    ["Prom Date Usuki Reject", 290000],
                    ["Ornate Usuki", 250000],
                    ["Wilderness Usuki Set", 246000],
                    ["Kadoatie Usuki Set", 245000],
                    ["Water Faerie Usuki Doll", 245000],
                    ["Fire Faerie Usuki Set", 220000],
                    ["Usuki Dream Bike", 220000],
                    ["Usuki Buzzer Set", 200000],
                    ["Official Usuki Battle Set", 199000],
                    ["Summer Fun Usuki", 199000],
                    ["Usuki Rogue", 180000],
                    ["Usuki Reaper", 113000],
                    ["Usuki Poetry Set", 106000],
                    ["Usuki Artist Set", 93500],
                    ["Snow Faerie Usuki Doll", 76500],
                    ["Space Faerie Usuki Doll", 72000],
                ]
            },

            get shop49() {// Food of the Lost Desert
                return [
                    ["Geopeppers", 1800000],
                    ["Pyramid Purpple", 1400000],
                    ["Pyramid Strawberry", 1300000],
                    ["Pyramid Banana", 104000],
                    ["Odorra Pod", 53500],
                ]
            },

            get shop50() {// Peopatra's Pet Pets
                return [
                    ["Blobikins", 4500000],
                    ["Geb", 2500000],
                    ["Scamander", 675000],
                    ["Khonsu", 190000],
                    ["Dua", 134000],
                ]
            },

            get shop51() {// Sutek's Scrolls
                return [
                    ["Vengeful Scroll", 960000],
                    ["Malediction for Beginners", 750000],
                    ["Curse of Ultimate Malison", 660000],
                    ["Golden Scamander Scroll", 645000],
                    ["The Scroll of Scrolls", 505000],
                    ["The Legendary Sutek Scroll", 490000],
                    ["Book of Flames", 475000],
                    ["Vile Curse of Pestilence", 460000],
                    ["A Plague Upon You!", 450000],
                    ["Dusty Harmless Looking Scroll", 400000],
                    ["Mummified Scroll", 365000],
                    ["You Will Get Verrucas!", 345000],
                    ["Book of Scarabs", 325000],
                    ["Youve Been Hexed!", 320000],
                    ["Vile Scroll of Possession", 285000],
                    ["Curse of Foul Odour", 227000],
                    ["Scroll of the Ancients", 210000],
                    ["Scroll of the Warrior", 94000],
                    ["Advanced Curses", 87000],
                    ["Forgotten Tome", 85500],
                    ["Scroll of Hunger", 77000],
                ]
            },

            get shop52() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop53() {// Back to School Shop
                return [
                    ["MSPP Backpack", 995000],
                    ["Dr Sloth Backpack", 560000],
                    ["Charcoal", 500000],
                    ["Halloween Grundo Notebook", 490000],
                    ["Orange JubJub Topper Pencil", 340000],
                    ["Light Faerie Backpack", 330000],
                    ["Pencil of the Space Faerie", 295000],
                    ["Pencil of Nova", 290000],
                    ["Moach Eraser", 280000],
                    ["Bendy Desk Light", 270000],
                    ["Stealthy Pencil Case", 270000],
                    ["Vira Eraser", 237000],
                    ["Techo Master Lunchbox", 196000],
                    ["Vira Ruler", 185000],
                    ["Valentine Pencil", 160000],
                    ["Asparagus Pen", 149000],
                    ["Vira Pencil Holder", 140000],
                    ["Scorchio Calculator", 136000],
                    ["Space Faerie Lunch Box", r99],
                    ["Cheesy Stapler", 99999],
                    ["Rainbow Pencil", 96000],
                    ["Quiggle Backpack", 89000],
                    ["Grundo Backpack", 74000],
                    ["Jhudora Bookmark", 59500],
                    ["Dark Battle Duck Notepad", 55000],
                    ["Pencil of the Earth Faerie", 50500],
                ]
            },

            get shop54() {// Sakhmet Battle Supplies
                return [
                    ["Scarab Medallion", 495000],
                    ["Golden Coltzan Statue", 400000],
                    ["Ruby Encrusted Sceptre", 270000],
                    ["Dehydration Potion", 195000],
                    ["Bag of Sand", 155000],
                    ["Sakhmetian Dagger", 105000],
                    ["Sakhmetian Axe", 97500],
                    ["Golden Scarab Shield", 91000],
                ]
            },

            get shop55() {// Osiri's Pottery
                return [
                    ["Delicate Terracotta Jug", r99], // the only r99 in this shop
                ]
            },

            get shop56() {// Merifoods
                return [
                    ["Darigan Draik Egg", 1900000],
                    ["Zombie Draik Egg", 1800000],
                    ["Ice Draik Egg", 1350000],
                    ["Lost Desert Draik Egg", 940000],
                    ["Island Draik Egg", 920000],
                    ["Meridellian Style Mashed Potatoes", 585000],
                    ["Red Draik Egg", 450000],
                    ["Fresh Fruit Goblet", 425000],
                    ["Roast Pork", 395000],
                    ["Bread Wreath", 360000],
                    ["Pootato", 270000],
                    ["Yellow Draik Egg", 250000],
                    ["Green Draik Egg", 225000],
                    ["Blue Draik Egg", 200000],
                    ["Leaf Taco", 170000],
                ]
            },

            get shop57() {// Ye Olde Petpets
                return [
                    ["Turmac", 4900000],
                    ["Zebie", 1500000],
                    ["Mortog", 595000],
                    ["Vullard", 570000],
                ]
            },

            get shop58() {// Neopian Post Office Kiosk
                return [
                    ["Battle Slices Stamp", 110000000],
                    ["Shenkuu Stamp", 87000000],
                    ["Snowbunny Stamp", 85000000],
                    ["Sticky Snowflake Stamp", 85000000],
                    ["Darigan Spectre Stamp", 80000000],
                    ["Queen Fyora Stamp", 80000000],
                    ["King Kelpbeard Stamp", 55000000],
                    ["Lab Ray Stamp", 52000000],
                    ["King Altador Stamp", 51500000],
                    ["Captain Scarblade Stamp", 47000000],
                    ["Scuzzy Stamp", 45000000],
                    ["The Three Stamp", 42500000],
                    ["King Jazan Stamp", 40000000],
                    ["Lord Kass Stamp", 40000000],
                    ["Terask Stamp", 37500000],
                    ["ARGH!!!! DONNA STAMP", 30750000],
                    ["Sasha Stamp", 23000000],
                    ["Holographic Magax Stamp", 20000000],
                    ["Misprint Meuka Stamp", 17000000],
                    ["Holographic Coltzans Shrine Stamp", 15000000],
                    ["Need a Better Printer Stamp", 15000000],
                    ["Foil Slorg Stamp", 14700000],
                    ["Foil Food Shop Stamp", 14000000],
                    ["Holographic Virtupets Stamp", 13750000],
                    ["Double Printed Evil Fuzzle Stamp", 13100000],
                    ["Misaligned Printer Stamp", 13000000],
                    ["Inverted Space Faerie Stamp", 12000000],
                    ["Upside Down Island Acara Stamp", 11000000],
                    ["Xantan Stamp", 10000000],
                    ["Dark Battle Duck Stamp", 9800000],
                    ["Nibbled Cooking Pot Stamp", 9500000],
                    ["Jhudoras Cloud Stamp", 7500000],
                    ["One Hundred Million Neopoint Stamp", 7400000],
                    ["Quilin Stamp", 5400000],
                    ["Skeith Defender Stamp", 4700000],
                    ["Ready to Roll Stamp", 4000000],
                    ["Garin Stamp", 3750000],
                    ["Grimtooth Stamp", 3250000],
                    ["Jahbal Stamp", 3000000],
                    ["Guardian Of Spectral Magic Stamp", 2500000],
                    ["Nightsteed Stamp", 2500000],
                    ["NeoQuest II Esophagor Stamp", 2400000],
                    ["Court Dancer Stamp", 1900000],
                    ["Ramtor Stamp", 1850000],
                    ["Wise Gnorbu Stamp", 1800000],
                    ["Geraptiku Stamp", 1750000],
                    ["Count Von Roo Stamp", 1700000],
                    ["Morguss Stamp", 1700000],
                    ["NeoQuest Hero Stamp", 1600000],
                    ["Sword Of Apocalypse Stamp", 1600000],
                    ["Count Von Roo Plushie Stamp", 1530000],
                    ["Darigan Moehog Stamp", 1500000],
                    ["Darkest Faerie Stamp", 1500000],
                    ["Hadrak Stamp", 1500000],
                    ["NeoQuest Logo Stamp", 1500000],
                    ["Isca Stamp", 1450000],
                    ["Rainbow Sticky Hand Stamp", 1400000],
                    ["Shiny Monoceraptor Stamp", 1400000],
                    ["Virtupets Space Station Stamp", 1400000],
                    ["Meerca Spy Stamp", 1300000],
                    ["Stone Stamp", 1300000],
                    ["Lucky Coin Stamp", 1200000],
                    ["Usuki Doll Stamp", 1200000],
                    ["Von Roos Castle Stamp", 1200000],
                    ["Drackonack Stamp", 1100000],
                    ["Gors The Mighty Stamp", 1100000],
                    ["Anubits Stamp", 999999],
                    ["Jacques Stamp", 999999],
                    ["Morris Stamp", 999999],
                    ["Battle Uni Stamp", 975000],
                    ["Grundo Warehouse Stamp", 960000],
                    ["Igneots Cavern Stamp", 760000],
                    ["Mipsy Stamp", 750000],
                    ["Nabile Stamp", 700000],
                    ["Golden Dubloon Stamp", 635000],
                    ["Aethia Stamp", 625000],
                    ["Torakor Stamp", 590000],
                    ["Zafara Double Agent Stamp", 550000],
                    ["Northern Watch Tower Stamp", 505000],
                    ["Anshu Fishing Stamp", 500000],
                    ["Blugthak Stamp", 500000],
                    ["Swordsmaster Talek Stamp", 440000],
                    ["Gold Mote Stamp", 425000],
                    ["Capn Threelegs Stamp", 400000],
                    ["Fyoras Castle Stamp", 390000],
                    ["Yellow Knight Stamp", 340000],
                    ["Altador Travel Stamp", 300000],
                    ["The Sleeper Constellation Stamp", 265000],
                    ["The Cyodrakes Gaze Stamp", 255000],
                    ["Lampwyck Stamp", 240000],
                    ["Shadow Gulch Stamp", 220000],
                    ["Forgotten Shore Stamp", 215000],
                    ["Biyako Stamp", 200000],
                    ["Lost City of Phorofor Stamp", 189000],
                    ["Cybunny on a Cycle Stamp", 180000],
                    ["Commemorative Defenders Stamp #4", 175000],
                    ["Shenkuu Helmet Stamp", 150000],
                    ["Luperus Right Head Stamp", 138000],
                    ["Faerie Slorg Stamp", 135000],
                    ["Meridell Heroes Stamp", 130000],
                    ["Tomos Stamp", 128000],
                    ["Tyrannian Victory Day Stamp", 121000],
                    ["Darigan Citadel Stamp", 120000],
                    ["Dark Ilere Stamp", 120000],
                    ["Talinia Stamp", 118000],
                    ["Space Faerie Stamp", 109000],
                    ["Luperus Centre Head Stamp", 104000],
                    ["Scordrax Stamp", 99500],
                    ["Rainbow Pteri Feather Stamp", 85000],
                    ["Altador Magic Stamp", 83500],
                ]
            },

            get shop59() {// Haunted Weaponry
                return [
                    ["Glowing Cauldron", r99],
                    ["Amulet of the Unblinking Eye", r99],
                    ["Cursed Elixir", 200000],
                    ["Pumpkin Club", 110000],
                ]
            },

            get shop60() {// Spooky Furniture
                return [
                    ["nobody restocks here lol", 0],
                ]
            },

            get shop61() {// Wintery Petpet
                return [
                    ["Candychan", 12000000],
                    ["Snowickle", 5100000],
                ]
            },

            get shop62() {// Jelly Food
                return [
                    ["Floral Jelly", 11000000],
                    ["Moulded Jelly Dessert", 43000],
                    ["Jelly Doughnut Jelly", 21200],
                    ["Doglefox Jelly", 17900],
                ]
            },

            get shop63() {// Refreshments
                return [
                    ["no items", 0],
                ]
            },

            get shop64() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop65() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop66() {// Kiko Lake Treats
                return [
                    ["Unguberry Kiko Candy Floss", 225000], // r98
                    ["Gelupepper Kiko Drink", 108000],
                    ["Purple Felberry Kiko Candy Floss", 50000],
                ]
            },

            get shop67() {// Kiko Lake Carpentry
                return [
                    ["Lakebed Chair", 210000], // r98
                ]
            },

            get shop68() {// Collectable Coins
                return [
                    ["Emerald Eyrie Coin", r100],
                    ["Large Black Collectable Scarab", 75000000],
                    ["Smiling Space Faerie Coin", 42000000],
                    ["Scowling Sloth Coin", 40000000],
                    ["Neopian Times Coin", 8000000], // r100
                    ["Red Striped Collectable Scarab", 3300000],
                    ["Spotted Blue Collectable Scarab", 2700000],
                    ["Money Tree Coin", 2500000],
                    ["Black and Yellow Collectable Scarab", 2300000],
                    ["PaintBrush Coin", 2000000],
                    ["Silver Babaa Coin", 1600000],
                    ["Defenders Of Neopia Coin", 1500000],
                    ["Crystal Kauvara Coin", 999999],
                    ["Dr Sloth Coin", 999999],
                    ["Giant Ghostkerchief Coin", 999999],
                    ["Hasee Coin", 999999],
                    ["Rainbow Pool Coin", 950000],
                    ["Dazzling Verdant Collectable Scarab", 895000],
                    ["Larnikin Coin", 815000],
                    ["Sparkleback Collectable Scarab", 650000],
                    ["Bzzt Blaster Coin", 450000],
                    ["Greater Yellow Collectable Scarab", 430000],
                    ["Gorix and Cylara Coin", 425000],
                    ["Neopet V2 Coin", 419000],
                    ["Mallow Coin", 249000],
                    ["Brass Usuki Coin", 224000],
                    ["Turtum Coin", 175000],
                    ["Silver Buzzer Coin", 165000],
                    ["Book Coin", 117000],
                ]
            },

            get shop69() {// Petpet Supplies
                return [
                    ["Wobbly Turtum Toy", 187000],
                    ["Luxury Castle Petpet Bed", 63000],
                ]
            },

            get shop70() {// Booktastic Books
                return [
                    ["Advanced Kreludan Physics", r100],
                    ["Beam Me Aboard", r100],
                    ["How Purples Got Their Spots", r100],
                    ["Interplanetary Communications", r100],
                    ["Know Your Robot Petpet", r100],
                    ["Kreludan Engineering", r100],
                    ["Kreludor Versus Neopia", r100],
                    ["Scenic Kreludan Views", r100],
                    ["The Green Grundo Invasion", r100],
                    ["It Came From Kreludor", 8000000],
                    ["Kreludor Mining Corridor Maps", 8000000],
                    ["Alien Aisha Invasion", 7100000],
                    ["Guide to the Neocola Machine", 6800000],
                    ["Space Station Schematics", 1800000],
                    ["The Space Ace", 925000],
                    ["It Came From the Mine", 740000],
                    ["Kreludan Cookie Cookbook", 700000],
                    ["The Big Book of Intermediate Evil Plots", 635000],
                    ["Kreludan Architecture", 175000],
                    ["Secrets of the Universe", 102000],
                    ["Diary of a Baby Space Fungus", 79000],
                ]
            },

            get shop71() {// Kreludan Homes
                return [
                    ["no items", 0],
                ]
            },

            get shop72() {// Cafe Kreludor
                return [
                    ["Kreludan Candy Floss", 120000],
                ]
            },

            get shop73() {// Kayla's Potion Shop
                return [
                    ["Kaylas Super Special Potion", 410000],
                    ["Elixir of Levelling", 204000],
                    ["Energising Elixir", 200000],
                    ["Potato Potion", 150000],
                    ["Strength Serum", 138000],
                    ["Potion of Doldrums", 120000],
                    ["Kaylas Golden Brew", 94500],
                    ["Illusens Forest Essence", 70500],
                    ["Mano Root Elixir", 69000],
                    ["Meridellian Potion of Defence", 57000],
                    ["Bullseye Potion", 55000],
                    ["Essence of Mortog", 49400],
                    ["Twisted Potion of Strength", 46600],
                    ["Bubbling Fungus", 37000],
                    ["Jar of Forest Earth", 35000],
                    ["Bomberry Elixir", 16500],
                    ["Essence of Drackonack", 14300],
                ]
            },

            get shop74() {// Darigan Toys
                return [
                    ["Darigan Globe", 205000],
                ]
            },

            get shop75() {// Faerie Furniture
                return [
                    ["Light Faerie Sofa", 385000],
                ]
            },

            get shop76() {// Roo Island Marchandise Shop
                return [
                    ["Blumaroo Oven", 62500],
                ]
            },

            get shop77() {// Brightval Books
                return [
                    ["Alchemy Lessons", 2000000],
                    ["Waking the Draik", 999999],
                ]
            },

            get shop78() {// The Scrollery
                return [
                    ["Greater Healing Scroll", 111000],
                    ["Scroll of Knowledge", 49700],
                ]
            },

            get shop79() {// Brightvale Glaziers
                return [
                    ["no items", 0],
                ]
            },

            get shop80() {// Brightvale Armoury
                return [
                    ["Heavy Blue Tunic", 3200000],
                    ["Cloak of the Night", 1850000],
                    ["Crisp Blue Tunic", 1500000],
                    ["Short Sleeved Yellow Tunic", 895000],
                    ["Wanderers Cloak", 260000],
                ]
            },

            get shop81() {// Brightvale Fruits
                return [
                    ["Carved Watermelon", 1800000],
                    ["Edible Magenorb Bouquet", 1300000],
                    ["Prickly Merato", 455000],
                    ["Assorted Brightvale Fruit Basket", 85500],
                    ["Flaming Blooble Fruit", 56500],
                ]
            },

            get shop82() {// Brightvale Motery
                return [
                    ["no items", 0],
                ]
            },

            get shop83() {// Royal Potionery
                return [
                    ["Leaded Elemental Vial", 25000000],
                    ["Greater Earthen Potion", 300000],
                    ["Scroll Potion", 275000],
                    ["Lightning in a Bottle", 86500],
                ]
            },

            get shop84() {// Neopian Music Shop
                return [
                    ["Blueberry Jelly Bass", r99],
                    ["Orange Jelly Guitar", r99],
                    ["Bone Trombone", 740000],
                    ["Bronze Gong", 500000],
                    ["Cutout Violin", 345000],
                ]
            },

            get shop85() {// Lost Desert Medicine
                return [
                    ["Doctors Bag", 6500],
                ]
            },

            get shop86() {// Collectable Sea Shells
                return [
                    ["Golden Shell", 55000000],
                    ["Floral Maractite Coin", 12500000],
                    ["Choker of the Deep", 10000000],
                    ["Dazzling Blue Mussel Shell", 3300000],
                    ["Anklet of the Deep", 1200000],
                    ["Maraquan Draik Maractite Coin", 830000],
                    ["Royal Orange Cowry Shell", 370000],
                    ["Purple Twirly Shell", 355000],
                    ["Diadem of the Deep", 150000],
                    ["Tiny Golden Shell", 100000],
                    ["Streaked Maractite Coin", 88500],
                ]
            },

            get shop87() {// Maractite Marvels
                return [
                    ["Maractite Dimensional Trap", 15000000], // unclear if this still restocks
                    ["Glowing Maractite Wand", 385000],
                    ["Reinforced Maractite Shield", 100000],
                ]
            },

            get shop88() {// Maraquan Petpet
                return [
                    ["Spyrabor", 58500],
                    ["Urgoni", 31900],
                ]
            },

            get shop89() {// Geraptiku Petpets
                return [
                    ["Tootum", 88500],
                ]
            },

            get shop90() {// Qasalan Delights
                return [
                    ["no items", 0],
                ]
            },

            get shop91() {// Desert Arms
                return [
                    ["no items", 0],
                ]
            },

            get shop92() {// Words of Antiquity (Qasalan Tablets)
                return [
                    ["The Pyramid Tablets", 805000],
                    ["Strangely Etched Tablet", 114000],
                    ["The Future of Fire", 90000],
                    ["Tablet of the Vampire", 38000],
                    ["Crystal Tablet", 36800],
                ]
            },

            get shop93() {// Faerie Weapon Shop
                return [
                    ["Grey Faerie Axe", 815000],
                    ["Bow of the Water Faerie", 720000],
                    ["Bow of the Light Faerie", 395000],
                    ["Dark Faerie Bow", 275000],
                ]
            },

            get shop94() {// Illustrious Armoury
                return [
                    ["no items", 0],
                ]
            },

            get shop95() {// Exquisite Ambrosia
                return [
                    ["no items", 0],
                ]
            },

            get shop96() {// Magical Marvels
                return [
                    ["Bag of Healing Dust", 7500000],
                ]
            },

            get shop97() {// Legendary Petpets
                return [
                    ["no items", 0],
                ]
            },

            get shop98() {// Plushie Palace
                return [
                    ["Mastermind Plushie", r100],
                    ["Neopian Times White Weewoo Plushie", 10000000], // r100

                    // unpriced r99s
                    ["Bowe Plushie", 0],
                    ["Brown Wadjet Plushie", 0],
                    ["Cloud Draik Plushie", 0],
                    ["Faerie Korbat Plushie", 0],
                    ["Faleinn Plushie", 0],
                    ["Fire Eyrie Plushie", 0],
                    ["Frozen Lizard Plushie", 0],
                    ["Ghost Fuzzle", 0],
                    ["Leirobas Plushie", 0],
                    ["Magical Blue Flotsam Plushie", 0],
                    ["Magical Blue Krawk Plushie", 0],
                    ["Magical Green Gelert Plushie", 0],
                    ["Magical Green Krawk Plushie", 0],
                    ["Magical Green Yurble Plushie", 0],
                    ["Magical Rainbow Aisha Plushie", 0],
                    ["Magical Starry Kau Plushie", 0],
                    ["Mastermind Plushie", 0],
                    ["Melatite Dervish Plushie", 0],
                    ["Mokti Plushie", 0],
                    ["Monoceraptor Plushie", 0],
                    ["Mutant Korbat Plushie", 0],
                    ["Mutant Shoyru Plushie", 0],
                    ["Old Beaten Chokato Chia Plushie", 0],
                    ["Rainbow Grundo Plushie", 0],
                    ["Rainbow Tuskaninny Plushie", 0],
                    ["Serpentine Dervish Plushie", 0],
                    ["Shadow Kougra Plushie", 0],
                    ["Speckled Bruce Plushie", 0],
                    ["Spotted Gelert Plushie", 0],
                    ["Swamp Lupe Neoquest Plushie", 0],
                    ["Boraxis Plushie", 0],
                    ["Starry Draik Plushie", 0],
                    ["Shadow Usul Plushie", 0],
                    ["Collectors Edition Quiguki Boy Plushie", 0],

                    ["Darkest Faerie Plushie", 7500000],
                    ["Bat Thing Plushie", 5000000],
                    ["MSPP Plushie", 4800000],
                    ["Dusk Kougra Plushie", 4500000],
                    ["King Terask Plushie", 4200000],
                    ["Fish Negg Plushie", 4000000],
                    ["Darigan Acara Plushie", 3000000],
                    ["Magical Red Grarrl Plushie", 3000000],
                    ["Mist Kougra Plushie", 3000000],
                    ["NeoQuest Hero Plushie", 2800000],
                    ["Gloom Kougra Plushie", 2500000],
                    ["Hannah Plushie", 2500000],
                    ["Black Wadjet Plushie", 2000000],
                    ["Blizzard Kougra Plushie", 2000000],
                    ["Desert Lupe Plushie", 2000000],
                    ["Frost Lizard Plushie", 2000000],
                    ["Ghost Evil Fuzzle", 2000000],
                    ["Keeper Of Time Plushie", 2000000],
                    ["Magical Blue Kacheek Plushie", 2000000],
                    ["Magical Cloud Lenny Plushie", 2000000],
                    ["Magical Desert Krawk Plushie", 2000000],
                    ["Magical Ghost Marshmallows Plushie", 2000000],
                    ["Magical Red Yurble Plushie", 2000000],
                    ["Reject Gelert Plushie", 2000000],
                    ["Shock Lizard Plushie", 2000000],
                    ["Tax Beast Plushie", 2000000],
                    ["Archmagus of Roo Plushie", 1900000],
                    ["Chaos Giant Plushie", 1900000],
                    ["Halloween JubJub Plushie", 1900000],
                    ["Razul Plushie", 1900000],
                    ["Christmas Korbat Plushie", 1800000],
                    ["Guardian of Fire Magic Plushie", 1800000],
                    ["Inferno Lizard Plushie", 1800000],
                    ["Magical Red Gelert Plushie", 1800000],
                    ["Rainbow Uni Plushie", 1800000],
                    ["Rikti Plushie", 1800000],
                    ["Sidney Plushie", 1800000],
                    ["Disco Bruce Plushie", 1750000],
                    ["Lord Kass Plushie", 1725000],
                    ["Electro Lizard Plushie", 1700000],
                    ["King Skarl Plushie", 1700000],
                    ["Magical Green Flotsam Plushie", 1700000],
                    ["Rainbow Evil Fuzzle", 1650000],
                    ["Two Rings Archmagus Plushie", 1600000],
                    ["Halloween Draik Plushie", 1500000],
                    ["Jahbal Plushie", 1500000],
                    ["Kiko Cadet Plushie", 1500000],
                    ["Neoquest Gatekeeper Plushie", 1500000],
                    ["Thunder Lizard Plushie", 1500000],
                    ["White Draik Plushie", 1500000],
                    ["Magical Cloud Gelert Plushie", 1400000],
                    ["Baby Bruce Plushie", 1300000],
                    ["Magical Rainbow Cybunny Plushie", 1300000],
                    ["Magical Blue Tonu Plushie", 1200000],
                    ["Lightning Giant Plushie", 999999],
                    ["Lightning Lizard Plushie", 999999],
                    ["Magical Blue Kiko Plushie", 999999],
                    ["Magical Rainbow Blumaroo Plushie", 999999],
                    ["Magical Red Blumaroo Plushie", 999999],
                    ["Reject Red Acara Plushie", 999999],
                    ["Cloud Lenny Plushie", 975000],
                    ["Floppy Turtum Plushie", 950000],
                    ["Reject Blue Acara Plushie", 950000],
                    ["Fire Lizard Plushie", 940000],
                    ["Chrysolite Dervish Plushie", 910000],
                    ["White Ixi Plushie", 900000],
                    ["Magical Blue Cybunny Plushie", 895000],
                    ["Magical Red Krawk Plushie", 895000],
                    ["Tyrannian Techo Plushie", 895000],
                    ["Magical Yellow Lenny Plushie", 890000],
                    ["Rainbow Korbat Plushie", 885000],
                    ["Insane Evil Fuzzle", 875000],
                    ["Magical Yellow Wocky Plushie", 870000],
                    ["Magical Red Lenny Plushie", 865000],
                    ["Magical Red Wocky Plushie", 865000],
                    ["Magical Blue Yurble Plushie", 860000],
                    ["Magical Red Tonu Plushie", 850000],
                    ["Reject Green Acara Plushie", 845000],
                    ["Faerie Draik Plushie", 825000],
                    ["Magical Green Wocky Plushie", 810000],
                    ["Magical Green Cybunny Plushie", 805000],
                    ["Magical Purple Blumaroo Plushie", 800000],
                    ["Magical Red Cybunny Plushie", 800000],
                    ["Magical Spotted Blumaroo Plushie", 800000],
                    ["Magical Yellow Kiko Plushie", 800000],
                    ["Lazulite Dervish Plushie", 795000],
                    ["Magical Blue Shoyru Plushie", 795000],
                    ["Rainbow JubJub Plushie", 795000],
                    ["Blue Doglefox Plushie", 790000],
                    ["Reject Yellow Acara Plushie", 775000],
                    ["Wrawk the Merciless Plushie", 750000],
                    ["Magical Green Koi Plushie", 745000],
                    ["Magical Purple Koi Plushie", 725000],
                    ["Magical Yellow Cybunny Plushie", 725000],
                    ["Magical Yellow Skeith Plushie", 715000],
                    ["Grey Mynci Plushie", 710000],
                    ["Magical Yellow Nimmo Plushie", 700000],
                    ["Speckled Nimmo Plushie", 695000],
                    ["Steel Golem Neoquest Plushie", 690000],
                    ["Faerie Nimmo Plushie", 675000],
                    ["Magical Red Koi Plushie", 650000],
                    ["Magical Yellow Yurble Plushie", 635000],
                    ["Magical Red Nimmo Plushie", 630000],
                    ["Magical Red Usul Plushie", 600000],
                    ["Magical Yellow Tonu Plushie", 600000],
                    ["Magical Blue Nimmo Plushie", 580000],
                    ["Magical Green Tonu Plushie", 570000],
                    ["Pomanna Plushie", 560000],
                    ["Magical Red Kiko Plushie", 555000],
                    ["Skunk Mynci Plushie", 550000],
                    ["Magical Green Kiko Plushie", 525000],
                    ["Magical Purple Zafara Plushie", 495000],
                    ["Taelia Plushie", 480000],
                    ["Magical Silver Kougra Plushie", 460000],
                    ["Tormund Plushie", 430000],
                    ["Starry Uni Plushie", 425000],
                    ["Magical Red Skeith Plushie", 420000],
                    ["Christmas Bruce Plushie", 410000],
                    ["Sophie Plushie", 400000],
                    ["Magical Electric Lupe Plushie", 390000],
                    ["Spotted Koi Plushie", 375000],
                    ["Grey Kacheek Plushie", 350000],
                    ["Maraquan Ixi Plushie", 350000],
                    ["Halloween Chia Plushie", 305000],
                    ["Darigan Lupe Plushie", 300000],
                    ["Mutant Usul Plushie", 300000],
                    ["Plushie Ixi Plushie", 295000],
                    ["Zafara Double Agent Plushie", 275000],
                    ["Darigan Eyrie Plushie", 265000],
                    ["Kanrik Plushie", 265000],
                    ["Plushie Poogle Plushie", 265000],
                    ["Shop Wizard Plushie", 265000],
                    ["Giant Jeran Plushie", 250000],
                    ["Magical Starry Lupe Plushie", 250000],
                    ["Royal Boy Ixi Plushie", 250000],
                    ["Desert Aisha Plushie", 245000],
                    ["Magical Fire Lupe Plushie", 238000],
                    ["Desert Cobrall Plushie", 225000],
                    ["Denethrir Plushie", 214000],
                    ["Purple Mynci Plushie", 200000],
                    ["Mutant Krawk Plushie", 195000],
                    ["Electric Evil Fuzzle", 190000],
                    ["Grey Peophin Plushie", 190000],
                    ["Mutant Blumaroo Plushie", 183000],
                    ["Plains Lupe Neoquest Plushie", 172000],
                    ["Roberta Plushie", 172000],
                    ["Island Peophin Plushie", 155000],
                    ["Magical Pirate Krawk Plushie", 147000],
                    ["Handcrafted Kanrik Plushie", 146000],
                    ["Angel Kiko Plushie", 145000],
                ]
            },

            get shop99() {// Altador Cup Souvenirs
                return [
                    ["no items", 0],
                ]
            },

            get shop100() {// Wonderous Weaponry
                return [
                    ["Shuriken", 2000000],
                ]
            },

            get shop101() {// Exotic Foods
                return [
                    ["Sushi Boat", 2700000],
                    ["Chomby Sushi", 242000],
                    ["Peach and Berries Flambe", 200000],
                    ["Shenkuu Pumpkin Cake", 80000],
                ]
            },

            get shop102() {// Remarkable Restoratives
                return [
                    ["no items", 0],
                ]
            },

            get shop103() {// Fanciful Fauna
                return [
                    ["no items", 0],
                ]
            },

            get shop104() {// Chesterdrawers' Antiques
                return [
                    ["no items", 0],
                ]
            },

            get shop105() {// The Crumpetmonger
                return [
                    ["no items", 0],
                ]
            },

            get shop106() {// Neovian Printing Press
                return [
                    ["Guide to Dilapidated Homes", 1700000],
                    ["Secrets of Tombola", 1575000],
                    ["The Eve of the Eve", 1400000],
                    ["Waiting for Midnight", 615000],
                    ["The Final Sunset", 36500],
                ]
            },

            get shop107() {// Prigpants & Swolthy, Tailors
                return [
                    ["Creepy Darigan Citadel Background", 700000],
                ]
            },

            get shop108() {// Mystical Surroundings
                return [
                    ["no items", 0],
                ]
            },

            get shop109() {// Petpetpet Habitat
                return [
                    ["no items", 0],
                ]
            },

            get shop110() {// Lampwyck's Lights Fantastic
                return [
                    ["no items", 0],
                ]
            },

            get shop111() {// Cog's Togs
                return [
                    ["no items", 0],
                ]
            },

            get shop112() {// Molten Morsels
                return [
                    ["Red Moltite Popsicle", 1500000],
                ]
            },

            get shop113() {// Moltaran Petpets
                return [
                    ["no items", 0],
                ]
            },

            get shop114() {// Moltaran Books
                return [
                    ["Locating Iron", r99],
                    ["How to Get Past the Guard", 935000],
                    ["Cog Jewellery Making", 125000],
                    ["Tangors Autobiography", 120000],
                    ["Moltara Town Hall Records", 99500],
                    ["Steam Engineering", 41100],
                ]
            },

            get shop115() {// (this shop doesn't exist)
                return [
                    ["no items", 0],
                ]
            },

            get shop116() {// Springy Things
                return [
                    ["no items", 0],
                ]
            },

            get shop117() {// Ugga Shinies
                return [
                    ["no items", 0],
                ]
            },
        };

        /******************************************************/ // End of item list

        // Shop information + redirect if empty shop
        var shopID = url.match(/\d+/g);
        if (d.title === "Neopets - Shops") { // Redirect to another shop if Shop ID is invalid
            console.log(`${NST} Invalid Shop ID, redirecting to random shop`);
            var randomShopID = Math.floor(Math.random() * 117) + 1;
            location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + randomShopID;
            return false;
        }

        // Get shop stock status
        var $itemImages = $(".item-img, .item-obelisk");
        var itemCount = $itemImages.length;

        currentStock = [];
        for (let i = 0; i < itemCount; i++) {
            let $thisItem = $itemImages.eq(i);
            if (Stock.blacklist.includes($thisItem.attr("data-link"))) {
                continue;
            }
            let itemName = $thisItem.attr("data-name");
            let itemPrice = parseInt($thisItem.attr("data-price").replace(/,/g, ""));
            currentStock.push([itemName, itemPrice]);
        }

        // Stock logs in console - only will log if items are added or shop is completely cleared
        Stock.current = itemCount;
        var stockDiff = Stock.current - Stock.prev;
        var isJustRestocked = false;
        Stock.prev = Stock.current;
        // GM_setValue("Stock", Stock);
        if (stockDiff !== 0) {
            (function () {
                if (Stock.current === 0) {
                    Stock.blacklist = [];
                    console.log(`${NST} Out of stock`);
                    return false;
                }
                if (stockDiff > 0) {
                    isJustRestocked = true;
                    console.log(`%c${NST} Restock (+${stockDiff})`, "color:lime");
                    return false;
                }
            })();
        }
        GM_setValue("Stock", Stock);

        // Settings panel
        function onoffText(Mode) {
            if (Mode === true) {
                return ' style="color:green;">ON';
            }
            if (Mode === false) {
                return ' style="color:red;">OFF';
            }
            return ' style="color:red;">ERROR';
        }

        $(".shop-info:contains('Neopian Inflation')").html(
            `<button id="shopBan" style="display: none;"></button><table style="width: 35%; margin: auto; border: 1px solid black; border-spacing: 0; padding: 3px;"> <tbody> <tr> <td style="background-color: #e4e4e4"><b>Auto click:</b></td><td style="background-color: #ffffff"> <button id="onoff0" type="button" ${onoffText(Mode.autoclick)}</button></td><td style="background-color: #e4e4e4"><b>Auto refresh:</b></td><td style="background-color: #ffffff"> <button id="onoff1" type="button" ${onoffText(Mode.autorefresh)}</button></td></tr><tr> <td style="background-color: #e4e4e4"><b>Highlight items:</b></td><td style="background-color: #ffffff"> <button id="onoff2" type="button" ${onoffText(Mode.highlight)}</button></td><td style="background-color: #e4e4e4"><b>Autobuy:</b></td><td style="background-color: #ffffff"> <button id="onoff3" type="button" ${onoffText(Mode.autobuy)}</button></td></tr><tr> <td style="background-color: #e4e4e4"><b>Pin rare items:</b></td><td style="background-color: #ffffff"> <button id="onoff4" type="button" ${onoffText(Mode.pin)}</button></td><td style="background-color: #e4e4e4"><b>Price check:</b></td><td style="background-color: #ffffff"> <button id="onoff5" type="button" ${onoffText(Mode.pricecheck)}</button></td></tr></tbody></table>`
        );

        // Shopban button
        if (ban.banned === true) {
            let button = $("#shopBan");
            $(button).show();
            $(button).css({
                "color" : "red"
            });
            $(button).html("You may be shop banned (Click to reset)");
            $(button).one("click", function () {
                $(this).html("Success!");
                $(this).css({
                    "color" : "green"
                });
                if ($("#onoff1").html() === "OFF") {
                    $("#onoff1").click();
                }
                ban.banned = false;
                ban.isNoStockBefore = false;
                Mode.autorefresh = true;
                GM_setValue("ban", ban);
                $(this).off("click");
            });
        }

        function addToggle(id) {
            function toggle(button, onoff) {
                if (onoff === "off") {
                    $(button).css({
                        "color" : "red"
                    });
                    $(button).html("OFF");
                }
                if (onoff === "on") {
                    $(button).css({
                        "color" : "green"
                    });
                    $(button).html("ON");
                }
            }

            $("#onoff" + id).on("click", function () {
                let k = Object.keys(Mode)[id];
                if (Mode[k] === true) {
                    Mode[k] = false;
                    toggle(this, "off");
                    if (id === 2) { // If highlight is toggled off, disable pin as well
                        Mode.pin = false;
                        let pin = $("#onoff4");
                        toggle(pin, "off");
                    }
                    GM_setValue("Mode", Mode);
                } else {
                    Mode[k] = true;
                    toggle(this, "on");
                    if (id === 4) { // If pin is toggled on, enable highlight as well
                        Mode.highlight = true;
                        let hl = $("#onoff2");
                        toggle(hl, "on");
                    }
                    GM_setValue("Mode", Mode);
                }
            });
        }

        for (let i = 0; i < 6; i++) {
            addToggle(i);
        }

        shopList = itemList[`shop${shopID}`];

        // Execution
        var isClickingItem = false;

        checkForShopBan();
        highlightItem();
        autoClick();
        autoRefresh();

        /******************************************************
         *  Functions
         *
         ******************************************************/

        // Highlight item and pin it to top
        function highlightItem() {
            if (itemCount === 0) {
                return false;
            }
            for (let i = 0; i < shopList.length; i++) {
                for (let j = 0; j < currentStock.length; j++) {
                    let item = currentStock[j];
                    if (item[0] === shopList[i][0]) {
                        const thisWorth = shopList[i][1];
                        console.log(
                            `%c${NST}\n${item[0]}\n` +
                            `%cPrice : ${digitSeparator(item[1])} NP\n` +
                            (thisWorth === 0 ? "" : `%cWorth : ${digitSeparator(thisWorth)} NP`),
                            "color:cyan", "color:#008fff", "color:#aaaeff"
                        );

                        if (Mode.highlight === true) {
                            let cell = $itemImages.eq(j).parent();
                            $(cell).css({
                                "background-color" : "#00cc99",
                                "border-style" : "solid",
                                "border-width" : "medium",
                                "border-color" : "red"
                            });
                        }

                        if (Mode.pin === true) {
                            $("h2").before($(cell).clone());
                        }
                    }
                }
            }
        }

        // Auto click & price check
        function autoClick() {
            if (Mode.autoclick === true) {
                if (itemCount === 0) {
                    return false;
                }
                let clicked = false;

                for (let i = 0; i < shopList.length; i++) {
                    for (let j = 0; j < currentStock.length; j++) {
                        let item = currentStock[j];
                        if (item[0] === shopList[i][0]) {
                            if (Mode.pricecheck === true) {
                                let sellPrice = item[1];
                                let worth = shopList[i][1];
                                if (sellPrice >= (worth / times_profit) && worth !== 0) {
                                    console.log(`%c${NST} ${item[0]} is too expensive`, "color:orange");
                                    // <div class="item-img" style="background-image:url(&quot;http://images.neopets.com/items/pot_krawk_pirate.gif&quot;);" alt="Arr, give this here potion to yer Neopet and it will instantly become a proper pirate Krawk. Arr." title="Arr, give this here potion to yer Neopet and it will instantly become a proper pirate Krawk. Arr." border="1" onclick="confirmPurchase(this)" data-name="Pirate Krawk Morphing Potion" data-price="1,067,655" data-link="haggle.phtml?obj_info_id=51307&amp;stock_id=604937943&amp;g=3"></div>
                                    const stockID = $itemImages.eq(j).attr("data-link");
                                    Stock.blacklist.push(stockID);
                                    GM_setValue("Stock", Stock);
                                    continue;
                                }
                            }
                            if (clicked === false) {
                                isClickingItem = true;
                                console.log(`%c${NST} Clicked on ${item[0]}`, "color:cyan");
                                window.open($itemImages.eq(j).attr("data-link"), "_self");
                                clicked = true;
                                return;
                            }
                        }
                    }
                }

            } else {
                return false;
            }
        }

        // Refresh interval
        function autoRefresh() {
            if (isClickingItem) {
                // console.log(NST + "Rare item available! Page will not refresh.")
                return false;
            } else {
                if (Mode.autorefresh === true) {
                    // Set refresh delay
                    let wait = randn_bm(minRefresh, maxRefresh, 1);
                    let isLongPause = Math.floor(Math.random() * 10000);
                    if (isLongPause < longPauseFrequency * 100) {
                        wait += longPauseTime;
                        console.log(`${NST} Long pause (${longPauseFrequency}% chance) activated`);
                    }
                    if (itemCount !== 0) {
                        wait += delayWhenStocked;
                    }
                    if (isJustRestocked === true) {
                        wait += delay_newRestock;
                    }

                    // Show refresh interval on page
                    $(`<br><div style="text-align:center;">Time to next refresh: <span style="color: blue; "><b>${wait}</b></span> ms<br><br></div>`).appendTo(".shop-info:last");

                    // Refresh
                    var refresh = setTimeout(function () {
                        location.reload();
                    }, wait);
                }
                $("#onoff1").on("click", function () {
                    if (Mode.autorefresh === false) {
                        clearTimeout(refresh);
                        console.log(`${NST} Auto refresh disabled`);
                    }
                    if (Mode.autorefresh === true) {
                        console.log(`${NST} Auto refresh enabled`);
                        location.reload();
                    }
                });
            }
            return false;
        }

        // Bellcurve RNG - stolen from https://stackoverflow.com/a/49434653
        function randn_bm(min, max, skew) {
            let u = 0;
            let v = 0;
            while (u === 0) {
                u = Math.random(); // Converting [0,1) to (0,1)
            }
            while (v === 0) {
                v = Math.random();
            }
            let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

            num = num / 10.0 + 0.5; // Translate to 0 -> 1
            if (num > 1 || num < 0) {
                num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
            }
            num = Math.pow(num, skew); // Skew
            num *= max - min; // Stretch to fill range
            num += min; // offset to min
            return Math.floor(num);
        }

        // Shop Ban checking - for jiejie
        function checkForShopBan() {
            if (itemCount === 0) {
                if (ban.isNoStockBefore === false) {
                    ban.startTime = new Date().getTime();
                    ban.refreshCount = 0;
                }
                ban.currentTime = new Date().getTime();
                ban.isNoStockBefore = true;

                let limit = shopBanTimeLimit * 60000;
                let diff = ban.currentTime - ban.startTime;
                let diffFormatted = convertTime(diff);

                $(".soldOutMessage").html(`<b><span style="color: red;">Out of stock for ${diffFormatted}</span></b>`);

                ban.refreshCount++;

                if (diff > limit && ban.refreshCount > refreshLimit) {
                    console.log(`Out of stock for more than ${convertTime(limit)}! Auto refresh has been stopped.`);
                    ban.banned = true;
                    Mode.autorefresh = false;
                    GM_setValue("Mode", Mode);
                }
            }
            if (itemCount > 0) {
                ban.banned = false;
                ban.isNoStockBefore = false;
            }
            GM_setValue("ban", ban);
        }

        function convertTime(ms) {
            const secTotal = Math.floor(ms / 1000);
            const days = Math.floor(secTotal / 86400);
            const h = Math.floor((secTotal % 86400) / 3600);
            const min = Math.floor((secTotal % 3600) / 60); // leftover secs from hours
            const sec = Math.floor((secTotal % 3600) % 60); // leftover secs from minutes
            let duration = "";
            duration += `${days > 0 ? (days + " days ") : ""}${h > 0 ? (h + " h ") : ""}${min > 0 ? (min + " min ") : ""}${sec > 0 ? (sec + " sec ") : ""}`;
            duration += duration === "" ? "0 sec" : "";
            return duration;
        }

    }

    /******************************************************
     *  Buying page
     *
     ******************************************************/

    else if (Mode.autobuy === true) {

        const html = d.getElementsByTagName("body")[0].innerHTML;

        const solve_captcha = url => new Promise(resolve => {
            let captcha = new Image();
            captcha.src = url;
            captcha.onload = () => {
                let width = captcha.width;
                let height = captcha.height;

                let canvas = unsafeWindow.document.createElement("canvas");
                canvas.width = canvas.height = width;
                canvas.getContext("2d").drawImage(captcha, 0, 0);

                let imgData = canvas.getContext("2d").getImageData(0, 0, width, height);
                let lowy = 999;
                let lowx = 999;
                let low = 999;

                for (let x = 0; x < imgData.width; x++) {
                    for (let y = 0; y < imgData.height; y++) {
                        let i = x * 4 + y * 4 * imgData.width;
                        let avg = Math.floor((imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3);
                        if (avg < low) {
                            low = avg;
                            lowx = x;
                            lowy = y;
                        }
                    }
                }
                resolve([lowx, lowy])
            };
        });

        (async () => {

            function goBack(timeout) {
                setTimeout(function () {
                    d.getElementsByClassName("icon-back__2020")[0].click();
                }, timeout);
            }

            if (html.includes("I accept your offer")) {
                //const item = $("h2").text().replace(/Haggle for /g, "");
                const item = d.getElementsByTagName("h2")[0].innerHTML.replace(/Haggle for /g, "");
                const price = $("b:contains('I accept your offer')").find("b").text();
                const itemImg = $(".haggle-item").attr("style").replace(/background-image:url\(|\);/g, "");
                const msg = `${NST} Bought ${item} for ${digitSeparator(price)} NP! `;
                const msgStyle = "color:lime;";

                console.image = function (url, text = "", textstyle = "") {
                    let image = new Image();
                    image.onload = function () {
                        const imgcss = [
                            `font-size: 1px;`,
                            `padding: ${this.height / 2}px ${this.width / 2}px;`,
                            `background: url(${url}) no-repeat;`,
                            `background-size: ${this.width}px ${this.height}px;`
                        ].join(' ');
                        console.log(`%c${text}%c `, textstyle, imgcss);
                    };
                    image.src = url;
                };
                console.image(itemImg, msg, msgStyle);

                goBack(Math.floor(Math.random() * 2000) + 3000);
                return;
            }

            if (html.includes("SOLD OUT!")) {
                let soldOutMsg = $(".item-desc").next().text();
                console.log(`%c${NST} ${soldOutMsg}`, "color:red");
                goBack(Math.floor(Math.random() * 500) + 500);
                return;
            }

            if (html.includes("five seconds")) {
                console.log(`%c${NST} 5 second delay, failed to buy item`, `color:red`);
                goBack(Math.floor(Math.random() * 500) + 500);
                return;
            }

            if (url.includes("haggle.phtml")) {
                console.time("Captcha solve time");
                const haggle_price = d.getElementById("shopkeeper_makes_deal").innerHTML.replace(/[^\d]+/g, "");
                d.querySelector("input[name=current_offer]").value = (price => {
                    const val = [price.substr(0, 1), price.substr(1, 1)];
                    let end_price = val[0] + val[1];
                    for (let x = 2; x < price.length; x++) {
                        end_price += val[0];
                    }
                    return end_price;
                })(haggle_price);

                const [x, y] = await solve_captcha(d.querySelector("input[type='image']").getAttribute("src"));
                setTimeout(() => {
                    const form = d.querySelector("form[name='haggleform']");
                    var xInput = d.createElement("input");
                    var yInput = d.createElement("input");

                    xInput.type = "hidden";
                    xInput.name = "x";
                    xInput.value = x;
                    form.appendChild(xInput);

                    yInput.type = "hidden";
                    yInput.name = "y";
                    yInput.value = y;
                    form.appendChild(yInput);

                    form.submit();
                    console.timeEnd("Captcha solve time");
                }, 1);
            }

        })();
    }

    /******************************************************
     *  Console commands
     *
     *  unban() => { // Reset shopban settings }
     *
     ******************************************************/

    unban = () => {
        ban.banned = false;
        ban.isNoStockBefore = false;
        ban.refreshCount = 0;
        GM_setValue("ban", ban);
        return `${NST} Ban settings reset!`;
    };

    faster = number => {
        if (typeof number !== "number") {
            return `${NST} Input must be a number`;
        }
        minRefresh -= number;
        maxRefresh -= number;
        if (minRefresh <= 0 || maxRefresh <= 2000) {
            minRefresh = 0;
            maxRefresh = 2000;
            console.log(`${NST} min and max cannot be set below 0 and 2000`);
        }
        return(`${NST} min = ${minRefresh}, max = ${maxRefresh}`);
    };

    slower = number => {
        faster(-1 * number);
    }

})();