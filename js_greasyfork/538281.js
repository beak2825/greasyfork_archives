// ==UserScript==
// @name         Quick Stock Helper
// @namespace https://greasyfork.org/en/users/145271-aybecee
// @version      20250606
// @description  Quickly move stuff to donate/deposit/discard
// @match        https://www.grundos.cafe/quickstock/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require https://update.greasyfork.org/scripts/512407/1463866/GC%20-%20Virtupets%20API%20library.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538281/Quick%20Stock%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538281/Quick%20Stock%20Helper.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function deposit_unsellables(){

        var deposit = [
            "Bottled Dark Faerie","Pile of Sludge",
            "Bottled Earth Faerie",
            "Bottled Air Faerie","Bottled Water Faerie",
            "Bottled Fire Faerie","Lu Codestone",
            "Vo Codestone",
            "Eo Codestone",
            "Mau Codestone",
            "Zei Codestone",
            "Orn Codestone",
            "Har Codestone",
            "Bri Codestone",
            "Mag Codestone",
            "Vux Codestone",
            "Cui Codestone",
            "Kew Codestone",
            "Sho Codestone",
            "Zed Codestone",
            "Main Codestone",
            "Tai-Kai Codestone","Five Dubloon Coin"

        ]


        $('.data.justify-right.align-right').each(function () {
            var itemName = $(this).text().trim();

            if (deposit.indexOf(itemName) >= 0) {
                console.log(`depositing ${itemName} because of array`)
                $(this).next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().css("background-image","linear-gradient(blue, purple);")
            } else if (Number($(this).attr("virtu_item_info")) < 1000 || $(this).attr("virtu_item_info") == "null") {
                console.log(`depositing ${itemName} because of virtupets price null`)
                $(this).next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().css("background-image","linear-gradient(blue, yellow);")
            } else {
                $(this).next().find('[type="radio"]').prop("checked", true);
                $(this).next().css("background-image","linear-gradient(blue, green);")
            }


        })
    }
    function donate_shit() {
        var donate = [
            "Dull Grey Pearl",
            "Tombola T-shirt",
            "Bubble Mote",
            "Poison Snowball",
            "Healing Potion VIII",
            "Darigan Seaweed",
            "Nupie",
            "Enormous Fake Diamond",
            "Tanglepus",
            "Inferno Mollusk",
            "Organic Mushroom",
            "Ultra Bubble Beam",
            "Kora",
            "Lurman",
            "Brightvale Guard Plushie",
            "Koibat Plushie",
            "Magical Healing Potion",
            "Cheap Water Ring",
            "Transparifish",
            "Spectral Shrimp",
            "Wet Snowball",
            "Lesser Spotted Fish",
            "Fishing Made Easy",
            "Yoakie",
            "Giant Giant Squid",
            "Bombfish",
            "Mundo",
            "On Gelert Pond",
            "Rhuby Fruit",
            "Yellow Snowball",
            "Spherical Strawberry",
            "Mummified Jelly",
            "Small Giant Squid",
            "Doomfish",
            "Water Muffin",
            "Island Slorg Usuki Set",
            "Golden Mechafish",
            "Surzard",
            "Landfish",
            "Evil Snowball",
            "Rock Baby Cabbages",
            "Fractalpus",
            "Glistening Mechafish",
            "Jhudoras Brush",
            "Toothy Pumpkin",
            "Broccoli",
            "Slimy Bog Scroll",
            "Vegetable Deluxe",
            "Whole Purplum Jelly",
            "Yellow Growth",
            "Sloth Faerie Plushie",
            "Pea Stuffed Pepper",
            "Robo Jelly",
            "Eyefish",
            "Smooth Black Sphere",
            "Giant Bath Plug",
            "Tyrannian Mechafish",
            "Organic Peach",
            "Fire Mote",
            "Rock Bin",
            "Queela Jelly",
            "Snotty Jelly",
            "Chocolate Jelly",
            "Scorcie Plushie",
            "Slime Potion",
            "Feather Tickler",
            "Purple Blob Potion",
            "Noxious Nectar",
            "Nurako",
            "Stone Jelly",
            "Little Timmy Battlecard",
            "Fire Jelly",
            "Perfectly Flat Rock Shield",
            "Garlic Shield",
            "Usulbat Plushie",
            "Lil Frankie",
            "Stone Shelves",
            "17-Pound Trout",
            "Golden Shield",
            "Pumpkin Shield",
            "Titanic Giant Squid",
            "Waterfish",
            "Scrawnyfish",
            "Ptolymelon",
            "Clawmatoe",
            "Spoogentberry",
            "Mint Jelly",
            "Rockfish",
            "Large Giant Squid",
            "Watery Hot Dog",
            "Breadfish",
            "Plushie Fungus",
            "Serf Lens",
            "Tombola Visor",
            "Brightvale Usuki Doll",
            "Blandfish",
            "Wooden Blocking Shield",
            "Kelp Samosa",
            "Noak",
            "Madfish",
            "Radarfish",
            "Jubusul Plushie",
            "Strawberry Artichoke",
            "Healing Potion I",
            "Cucumber Eye Cream",
            "Carrot",
            "Diseased Mechafish",
            "Jumbleberry",
            "Brown Broadberry",
            "Organic Leek",
            "Pyramibread",
            "Pusberry",
            "Organic Pear",
            "Pleto Melon",
            "Autumnberry",
            "Organic Green Apple",
            "Healing Potion XVIII",
            "Mouldy Tome",
            "Ixi Hoof Soup",
            "Cheese Jelly",
            "Reject Ornate Rainbow Sand",
            "Organic Red Apple",
            "Healing Potion XIII",
            "Water Mote",
            "Splime",
            "Snout Plant",
            "Unguberry",
            "Mummy Baby",
            "Dried Apricots",
            "Purple Felberry",
            "Pink Brain Tree Plushie",
            "Squished Jelly",
            "Soggy Old Box",
            "Dartail",
            "Lint Jelly",
            "Frozen Jelly",
            "Leminty Elixir of Healing",
            "Bat Pack",
            "Peanut Butter Jelly",
            "Organic Pear",
            "Suti Fruit",
            "Glowing Jelly",
            "Healing Potion II",
            "Downpour Bottle",
            "Cheops Plant",
            "Chocolate Eclair Paste",
            "Deviled Steak",
            "Ummagine",
            "Healing Potion IX",
            "Healing Potion XV",
            "Yoakie"
        ]

        var deposit = [
            "Bottled Dark Faerie","Pile of Sludge",
            "Bottled Earth Faerie","Giant Green Kelp","Giant Brown Kelp",
            "Bottled Air Faerie","Bottled Water Faerie",
            "Mouldy Tome","Ghost Marshmallows",
            "Waterlogged Book",
            "Bottled Fire Faerie","Lu Codestone",
            "Vo Codestone",
            "Eo Codestone",
            "Mau Codestone",
            "Zei Codestone",
            "Orn Codestone",
            "Har Codestone",
            "Bri Codestone",
            "Mag Codestone",
            "Vux Codestone",
            "Cui Codestone",
            "Kew Codestone",
            "Sho Codestone",
            "Zed Codestone",
            "Main Codestone",
            "Tai-Kai Codestone","Five Dubloon Coin","Spongy Algae","Starry Sea Fern"

        ]
        var discard = [
            "Maggoty Spud",
            "Broken Fishing Pole",
            "Rotten Beetroot",
            "Bagguss",
            "Slimy Bog Scroll",
            "Yellow Growth",
            "Bit of Barbed Wire",
            "Piece of Wool",
            "Old Boot",
            "Rotten Berry",
            "Half-eaten Berry",
            "Headless Von Roo Plushie",
            "Baby Haystack",
            "Half Coconut Shell",
            "Blandfish",
            "Waterfish",
            "Breadfish",
            "Rockfish",
            "Lesser Spotted Fish",
            "Scrawnyfish",
            "Butterfish",
            "Landfish",
            "Eyefish",
            "Cubefish",
            "Bombfish",
            "Transparifish",
            "Tanglepus",
            "Madfish",
            "Small Giant Squid",
            "Giant Giant Squid",
            "Diseased Mechafish",
            "Petrified Bone","Titanic Giant Squid",
            "Frozen Mechafish",
            "Glistening Mechafish",
            "Golden Mechafish",
            "Spooky Mechafish",
            "Inferno Mollusk",
            "Spectral Shrimp",
            "Cheery Plant",
            "MaBroken Fishing Pole",
            "Broken Toy Sailboat",
            "Bucket of Sludge",
            "Dull Grey Pearl",
            "Enormous Fake Diamond",
            "Giant Bath Plug",
            "Mouldy Petpet Bed",
            "Old Rotten Left Boot",
            "Old Rotten Right Boot",
            "Old Rotten Left Shoe",
            "Old Rotten Right Shoe",
            "Old Rotten Left Sandal",
            "Old Rotten Right Sandal",
            "Petrified Bone",
            "Rotting Driftwood",
            "Rusty Old Can",
            "Gravitic Urn",
            "Smelly Jelly",
            "Half Squished Jelly",
            "Rancid Old Meat",
            "Rock Baby Cabbages",
            "Spongy Mound",
            "Snout Plant",
            "Maggoty Spud",
            "Rusty Old Can",
            "Old Rotten Left Boot",
            "Old Rotten Right Boot"
        ]

        $('.data.justify-right.align-right').each(function () {
            var itemName = $(this).text().trim();

            if (donate.indexOf(itemName) >= 0) {
                console.log(`donating ${itemName} because of array`)
                $(this).next().next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().next().css("background","green")
            } else if (discard.indexOf(itemName) >= 0) {
                console.log(`discarding ${itemName} because of array`)
                $(this).next().next().next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().next().next().css("background","blue")
            } else if (deposit.indexOf(itemName) >= 0) {
                console.log(`depositing ${itemName} because of array`)
                $(this).next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().css("background","purple")
            } else if (Number($(this).attr("virtu_item_info")) == 1) {
                console.log(`discarding ${itemName} because of virtupets price <10`)
                $(this).next().next().next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().next().next().css("background","red")
            } else if ($(this).attr("virtu_item_info") == "null") {
                console.log(`depositing ${itemName} because of virtupets price null`)
                $(this).next().next().find('[type="radio"]').prop("checked", true);
                $(this).next().next().css("background","blue")
            } else {
                console.log(`doing nothing with ${itemName}`)
            }


        })
    }
    (async () => {

        var itemStockArray = [];

        $('.data.justify-right.align-right').each(function () {
            var itemName = $(this).text().trim();
            itemStockArray.push(itemName)
        })

        $('.market_grid.qs.margin-1').before('<div id="donate_shit">quick sort</div><div id="deposit_unsellables">deposit unsellables</div>')

        try {
            //  console.log(itemStockArray)
            const response = await bulkShopWizardPrices(itemStockArray);
            const data = await response.json();
            console.log(data);

            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);

                var virtu_item_info = data[i];

                $('.data.justify-right.align-right').each(function () {
                    var itemName = $(this).text().trim();

                    if (itemName == virtu_item_info['name']) {
                        console.log(virtu_item_info['price']);
                        if (virtu_item_info['price'] == null) {
                            $(this).attr("virtu_item_info", "null")
                        } else{
                            $(this).attr("virtu_item_info", virtu_item_info['price'])
                        }
                    }
                })

                if ( i + 1 == data.length) {
                    $("#donate_shit").addClass("fakebutton")
                    $('#donate_shit').click(function () {
                        donate_shit()
                    })
                    $("#deposit_unsellables").addClass("fakebutton")
                    $('#deposit_unsellables').click(function () {
                        deposit_unsellables()
                    })

                }
            }




        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
    })();

})();