// ==UserScript==
// @name         Subeta: Restock buyer
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  try to take over the world!
// @author       AyBeCee
// @match        https://subeta.net/shop.php?shopid=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        None
// @downloadURL https://update.greasyfork.org/scripts/415637/Subeta%3A%20Restock%20buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/415637/Subeta%3A%20Restock%20buyer.meta.js
// ==/UserScript==



Notification.requestPermission();

var url = window.location.href;

// adds shop search under each item
$('.two.wide.column').each(function() {
    // https://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
    var itemName = $(this).find(`form[method="post"]`).clone().children().remove().end().text();
    itemName = itemName.replace(/(\r\n|\n|\r)/gm, "");
    $(this).append(`<a href="/user_shops.php/search/shops/${itemName}" style="text-align: center; display: block; background: #c3deb5; font-size: 10px;">Shop search</a>`);
});

function restock(url, buyArray) {
    if (window.location.href.includes(url)) {
        $('.two.wide.column').each(function() {
            var itemName = $(this).find(`form[method="post"]`).clone().children().remove().end().text();
            itemName = itemName.replace(/(\r\n|\n|\r)/gm, "");
            if ( buyArray.includes(itemName) ) {
                $(this).find(`input[type="image"]`).click();
            }
        });
    }
}
// Accessory Bin
var buy32 = [ "Evil Flaming Handbag of Pernicious Rage", "Angelic Terracoontail Hat", "Broken Heart Collar", "Striped Dragon Tail", "Liquid Metal Wings", "White Bunny Tail", "Chai Playset",
             "Ghostly Mask", "Emo Hat", "Jumbo White Back Ribbon", "Pink Bunny Tail", "Crown of Ultimate Evil", "Jumbo Burgundy Back Ribbon", "Gray Goatee Kit", "Kuro Neko San Collar",
             "Puppy Head Collar", "Green Pocket Protector", "Dillo Handbag", "Blue Chibi Dragon Wings", "Telenine Collar", "Black Bunny Tail", "Jumbo Orange Back Ribbon", "Jumbo Toxic Back Ribbon",
             "Jumbo Yellow Back Ribbon", "Posh Spiked Collar", "Swirly Orange Umbrella", "Purple Glowstick", "Pink Glowstick", "Blue Formal Gloves", "Super Feathery Purple Boa",
             "Jumbo Spider Legs Back Ribbon", "Long Black Dragon Horns", "Folded Crane Wings", "Black Horse Tail", "Jumbo Fuchsia Back Ribbon", "Mountain Rocks", "Red Bunny Tail", "Blue Head Sash",
             "Orange Head Sash", "Cupcake Collar", "Angelic Watch", "Bloodred Dragon Tail", "Deep Red Giant Rose Corsage", "Reborn Spiked Canine Collar", "Angelic Warador Hat", "Skull Puffy Hat",
             "Party Goggles", "Red Horse Tail", "Green Bunny Tail", "Large Leaflet", "Glamorous Faux Fur Wrap", "Brown Horse Tail", "Pale Pink Giant Rose Corsage",
             "Enchanted Tasmanian Devil Familiar Stone", "Antlephore Mask", "Red Fannypack", "Purple Bunny Tail", "Field Gloves", "Grim Blossoming Horn", "Jumbo Tiger Striped Back Ribbon",
             "Ruffie Collar", "Mystical White Serpent Scale", "Sad Glasses", "Capricorn Pendant", "White Kitsune Fur", "Long Striped Dragon Horns", "Jumbo Forest Green Back Ribbon", "Brown Earmuffs",
             "Winter Hipscarf", "Gray Wrap Glasses", "Red Giant Rose Corsage", "Magical Twilight Feli Headband", "Brown Bunny Tail", "White Horse Tail", "Ashen Ram Rack", "Laughing Mask",
             "White Chibi Dragon Wings", "Charlie Playset", "Anyu Playset", "Tan Bunny Tail", "Skull Trucker Hat", "Decorated Sombrero", "Lime Green Bunny Tail", "Pink Wrap Glasses",
             "Purple Bag of Friendship", "Fancy Old Lady Chai Glasses", "Yellow Bunny Tail", "Bat Glasses", "Burgundy-Handled Magic Broom", "Blue Bunny Tail", "Jumbo Crimson Back Ribbon",
             "Orange Bunny Tail", "Nurse Hat", "Pale Rosea Band", "Super Feathery Lime Boa", "Classic Rosea Drape", "Kumos Hat", "White Giant Rose Corsage", "Jumbo Brown Back Ribbon", "Sleepy Glasses",
             "White Top Hat", "Rainbow Striped Corset", "Heart Wallet", "Heart Messenger Bag", "Kumos Fannypack", "Sky Basic Tights", "Long Purple Dragon Horns", "Lime Basic Tights", "Chai Hat",
             "Super Feathery Orange Boa", "Jumbo Spectrum Back Ribbon", "Velvet Trucker Hat", "Amethyst Lovely Pendant", "Verdant Fallen Leaf", "Super Feathery Chickie Boa", "Tigrean Collar",
             "Star-Charmed Anklet", "Cutesy Sheriff Badge", "Boot Collar", "Mystical Red Serpent Scale", "Mystical Opal Serpent Scale", "Sunny Goggles", "Love Sombrero", "Pherret Hat",
             "Shiny Deputy Badge", "Gothic Collar", "Basic Olive Cap", "Super Feathery Green Boa", "Purple Horse Tail", "Feli Hat", "Blue Tie", "Maleria Wings", "Shinwa Wig", "Orange Horse Tail",
             "Blacklight Terracoontail Hat", "Navy Academy Scarf", "Starry Messenger Bag", "Brilliant Gold Giant Rose Corsage", "White Morticlaw", "Golden Insect Goggles", "Nori Head Ribbon",
             "Stylish Sports Bag", "Twilight Gloves", "Purple Pocket Protector", "Hipottu Backpack", "Morticlaw", "Black Rosea Drape", "Wine Basic Tights", "Maleria Gloves", "Gray Striped Corset",
             "Blue and Black Dreadfalls", "Star Hoop Earrings", "Powder Charming Belt", "Mystical Sheeta Pendant", "PPT Backpack", "Purple Wings", "Yellow Glowstick", "Lime Knit Pom Pom Hat",
             "Navy Basic Tights", "Yellow and Black Dreadfalls", "Folded Jasminstale Wings", "Kumos Backpack", "Striped Belt", "Pie Sombrero", "Single Sheer Glove (Base 20)", "Orange Beer Helmet",
             "Super Feathery Teal Boa", "Purple Lolita Sleeves", "Black Headband", "Emerald Academy Scarf", "Serpenth Backpack", "Golden Academy Scarf", "Long Burgundy Patterned Sash", "Wyllop Playset",
             "Swirly Rainbow Umbrella", "Charcoal Bow Belt", "Single Sheer Glove (Base 2)", "Orange Basic Tights", "Greige Braided Belt", "Wine Rosea Drape", "Green and White Polka Dot Bow",
             "Silver Lovely Sash", "Purple Ankle Wraps", "Black Short Veil", "Giant Ruby Puffy (Right Arm)", "Yellow and Black Polka Dot Bow", "Pink Floral Hair Piece", "Giant Sapphire Puffy (Left Arm)",
             "Big Charcoal Retro Glasses", "Black High Belt", "Brown Low Belt", "Burgundy Suspenders", "Coral Raineez Poncho", "Earth Beaded Necklace", "Ghostly Hat", "Ginger Stick-On Sideburns",
             "Leopard Brim Logo Snapback", "Oracle Cape", "Orange Sheer Scarf", "Black Lace Rust Millinery", "Clip-On Blue Collar", "Soothe Striped Ribbon", "Gray Clipon Mustache", "Dated Striped Hat",
             "Giant Pearl Puffy (Left Arm)", "Simple Black Leather Collar", "Cyan Twinkle Earrings", "Buttermilk Bow Belt", "Apples and Oranges Eco-Friendly Canvas Tote", "Black Wig",
             "Baby Blue False Halter Straps", "Gold Patterned Sash", "Friendly Tree Eco-Friendly Canvas Tote", "Red Droop Beanie", "Jungle Fowl Feather Beaded Headdress", "Brown Waist Ribbon",
             "Oracle Accessories", "Super Feathery Spectrum Boa", "Hugs and Kisses Bracelet", "Red Beer Helmet", "Black Backward Logo Snapback", "White Vial of Sand", "Kabuki Lion Spirit Mask",
             "Stone Conductors Hat", "Yellowish BOLD Patterned Sash", "Graveyard Terracoontail Hat", "Brown Prospector Hat", "Taupe Conductors Hat", "Cucumber Earrings", "Pink Suspenders",
             "Giant Rose Quartz Puffy (Right Arm)", "Black Satin Corsage Headband", "Magic Mittens", "Cute Black Nerd Glasses", "Emperors Brooch", "Pink Sheer Scarf", "Royal Heath Tied Hairband",
             "Long Coral Patterned Sash", "Green Striped Buckle Tights", "High Purple Cummerbund", "Emerald Rosea Band", "Yellow Coat Back", "Red Horned Glasses Case", "Single Sheer Glove (Base 21)",
             "Green Suspenders", "Brick Leather Messenger Bag", "Leek Earrings", "Ice Blue and White Dreadfalls", "Goldenrod Tied Hairband", "Ashen Decorative Antler" ]
restock("/shop.php?shopid=32",buy32)

// Apocalyptic Apothecary
var buy36 = ["Nightmare Potion", "Reborn Potion", "Spectrum Potion", "Bloodred Potion", "Graveyard Potion", "Powdered Muscles", "Evil Potion", "Calvin Blackmoons Clover", "Magical Arctic Star Potion",
             "Bottle of Luminaire Spirit", "Vibrant Potion", "Cream Potion", "Legend Water", "Dusk Popoko Elixir", "Frozen Froth", "Arid Urubu Elixir", "Twilight Potion", "Bloodred Fester Elixir",
             "Silver Potion", "Aqua Potion", "Bloodred Clawsion Elixir", "Bloodred Cybill Elixir", "Field Potion", "Acid Juice", "Sun Hikei Elixir", "Arid Potion", "Sun Urubu Elixir",
             "Bloodred Feli Elixir", "Mixed Blessing Potion", "Bottled Angst", "Common Kumos Elixir", "Limitless Endurance Potion", "Potion of Fleetness", "Impenetrable Force Potion",
             "Potion of Life", "Cream Urubu Elixir", "Field Noktoa Elixir", "Experimental Dew", "Rancid Banana Potion", "Golden Scootle Elixir", "Spiraling Ascension Potion",
             "Bloodred Ghostly Elixir", "Lilac Darkonite Elixir", "Surging Power Potion", "Cherry Potion", "Gold Potion", "X5 Cadogre Elixir", "Twilight Feli Elixir", "Twilight Priggle Elixir",
             "Cream Devonti Elixir", "Bloodred Telenine Elixir", "Common Urubu Elixir", "Bloodred Wyllop Elixir", "Dusk Montre Elixir", "Dusk Sheeta Elixir", "Cream Dillema Elixir",
             "Bloodred Serpenth Elixir", "Dawn Zasaba Elixir", "Lilac Urubu Elixir", "Lilac Potion", "Bloodred Montre Elixir", "Dawn Dillema Elixir", "Twilight Urubu Elixir", "Twilight Kumos Elixir",
             "Dusk Kumos Elixir", "Dusk Urubu Elixir", "Field Kumos Elixir", "Golden Kumos Elixir", "Arid Clawsion Elixir", "Arid Serpenth Elixir", "Bloodred Tigrean Elixir",
             "Bloodred Escalade Elixir", "Golden Feli Elixir", "Dusk Tutani Elixir", "Bloodred Donadak Elixir", "Common Lain Elixir", "Bloodred Devonti Elixir", "Twilight Irion Elixir",
             "Dawn Feli Elixir", "Cream Noktoa Elixir", "Sun Sheeta Elixir", "Arid Noktoa Elixir", "Sun Kumos Elixir", "Lilac Kumos Elixir", "Marsh Urubu Elixir", "100HP Healing Potion",
             "Sun Scootle Elixir", "Bloodred Ruffie Elixir", "Twilight Paralix Elixir", "Arid Kumos Elixir", "Arid Warador Elixir", "Marsh Potion", "Golden Archan Elixir", "Cream Lasirus Elixir",
             "Golden Urubu Elixir", "Dusk Celinox Elixir", "Twilight Serpenth Elixir", "Arid Sheeta Elixir", "Common Dillema Elixir"]
restock("/shop.php?shopid=36",buy36)

// Bean Me Up
var buy6 = ["Dawn Urubu Beanbag", "Angelic Antlephore Beanbag", "Silver Anyu Beanbag", "Silver Endeavor Beanbag", "Silver Yaherra Beanbag", "Vibrant Priggle Beanbag", "Hydrus Warador Beanbag",
            "Dusk Blob Beanbag", "Silver Chelon Beanbag", "Glade Anyu Beanbag", "Vibrant Feli Beanbag", "Cherry Tigrean Beanbag", "Field Scootle Beanbag", "Old Wizard Beanbag", "Nuclear Kora Beanbag",
            "Lilac Blob Beanbag", "Angelic Ontra Beanbag", "Nuclear Tigrean Beanbag", "Common Yaherra Beanbag", "Silver Kerubi Beanbag", "Silver Montre Beanbag", "Silver Qrykee Beanbag",
            "Neela Cheese Beanbag", "Lilac Scootle Beanbag", "Nuclear Serpenth Beanbag", "Twilight Urubu Beanbag", "Silver Malticorn Beanbag", "Nuclear Popoko Beanbag", "Silver Sheeta Beanbag",
            "Field Yaherra Beanbag", "Nuclear Bovyne Beanbag", "Nuclear Chelon Beanbag", "Arid Urubu Beanbag", "Common Kerubi Beanbag", "Dawn Zasaba Beanbag", "Golden Scootle Beanbag",
            "Dawn Qrykee Beanbag", "Lilac Montre Beanbag", "Field Blob Beanbag", "Glade Terracoon Beanbag", "Field Priggle Beanbag", "Golden Blob Beanbag", "Vibrant Kerubi Beanbag",
            "Cherry Sheeta Beanbag", "Glade Kerubi Beanbag", "Silver Cadogre Beanbag", "Cream Blob Beanbag", "Cream Zentu Beanbag", "Glacier Antlephore Beanbag", "Golden Telenine Beanbag",
            "Silver Lasirus Beanbag", "Marsh Kora Beanbag", "Golden Xotl Beanbag", "Cherry Feli Beanbag", "Patchwork Wyllop Beanbag", "Cherry Endeavor Beanbag", "Nuclear Zasaba Beanbag",
            "Marsh Tigrean Beanbag", "Vibrant Montre Beanbag", "Aqua Demi Beanbag", "Nuclear Endeavor Beanbag", "Aqua Swampie Beanbag", "Silver Dragarth Beanbag", "Cherry Priggle Beanbag",
            "Common Qrykee Beanbag", "Dawn Yaherra Beanbag", "Aqua Ontra Beanbag", "Smiley Sushi Beanbag", "Sun Zentu Beanbag", "Field Telenine Beanbag", "Galactic Legeica Beanbag",
            "Luna Beanbag", "Aqua Mallarchy Beanbag", "Nuclear Donadak Beanbag", "Nuclear Feli Beanbag", "Nuclear Sheeta Beanbag", "Silver Urubu Beanbag", "Arid Chelon Beanbag",
            "Cherry Escalade Beanbag", "Reinela Beanbag", "Angelic Magnus Beanbag", "Golden Jollin Beanbag", "Field Zasaba Beanbag", "Bloodred Telenine Beanbag", "Sun Noktoa Beanbag",
            "Spectrum Wyllop Beanbag", "Dusk Priggle Beanbag", "Nuclear Warador Beanbag", "Bloodred Archan Beanbag", "Twilight Kumos Beanbag", "Demonic Beanbag", "Marsh Torrey Beanbag",
            "Golden Bhakoru Beanbag", "Golden Clawsion Beanbag", "Dark Matter Super Cute Rat Beanbag", "Nuclear Ghostly Beanbag", "Yellow Pointed Petal Flower Beanbag", "Glacier Popoko Beanbag",
            "Arid Noktoa Beanbag"]
restock("/shop.php?shopid=6",buy6)

/// book nook
var buy9 = [ "Cozy Winter Hats", "Evil Singing Lessons", "Beware the Kelpie", "Darkonite Guide to Evil Genius", "The Gunpowder Treason", "Encyclopedia of Squishyness", "Book of Terriers",
            "Potions III", "All About Balloons", "Renaissance Scroll", "Catfish Tales", "My Life with Five Daughters", "Science for Pets III", "Shinwa Sketchbook", "The Blue Chelon",
            "The Big Book of Lizards", "Sarus List of Item Rarities", "Book of Magic I", "Our First Date...", "Guide to Restocking", "The Frog", "The Ontra III", "All About Gentry Inc.",
            "The Vampire Hunter", "Potions I", "Guide to Rarity 99s", "The Ontra I", "Book of Demonic Names", "Tattered Wedding Photo Album", "All About Cotton Candy", "Book of Donations",
            "The SP Guide", "The Horribly Bad Day!", "Why Pete and Hilary PWN!", "Kuro Neko San Book of Death", "DANGER!", "Crowns of Royalty", "Journal of The Pink Fleece", "Advanced Rhyming",
            "Fun with History: Sacred Lands", "Book of Terriers II", "Ghostly Stories", "The Big Book of PHP", "101 Lime Recipes", "Oracle Quests", "Spiffy Pink Book", "The Lonely Ontra",
            "Stories of Old", "Rare Items 101", "Book of Ancient Black Magic", "UFO Sightings!", "Famous Cults", "Almost Metal Scientist", "Rainbow Journal", "Book of Extremely Vague Prophecy",
            "Onegai Maleria III", "Sewing for Royalty", "Modified Book of Records", "Science for Pets II", "Rules of Subeta", "Pop-Up Book of Heroic Tales", "Freddy the Ontra",
            "Grayson Guide to Fishing: Veta Lake", "Bobs Pie Book", "A Guide to Minions II", "Fun with History: Omen Islands", "Broken Spines", "All About Cavies!", "Potions II", "Life as a Stocker!",
            "Minion Manners III", "Smiling Evil", "How to Slap and Poke People", "Intermediate Rhyming", "Amulets of Subeta CE" ]
restock("/shop.php?shopid=9",buy9)

// Clothing Rack
var buy11 = [ "Pink Ribbon Surprise Bottom", "White Opal Crown", "Shellsuit", "White Legacy Cape", "Pink Cute Bunny Slippers", "Green Polka Dot Dress",
           "Baggy Purple Jeans", "White Angelic Bunny Hat", "White Ribbon Surprise Bottom", "Black Boxers", "Green Angelic Bunny Hat", "Camo Striped Top", "Pink Angelic Bunny Hat", "Brown Tweed Shorts",
           "Funky Burgundy Corset", "Red Tweed Shorts", "Hideous Button-down Shirt", "Burgundy Tweed Shorts", "Goldenrod Deep V Tee", "Chicken on my Head", "Koi Kimono", "Plain Turquoise Waist Corset",
           "Gold Cute Bunny Slippers", "Purple Angelic Bunny Hat", "Pleated Galaxy Miniskirt", "Mauve Denimz", "I Heart Limes T-shirt", "Tan Discreet Robe", "White Sushi Pajama Bottoms",
           "Angelic Tank Top", "Black Laced Leggings", "Glamorous Black Gown", "Comfy Coffee Striped Pants", "Red Plaid Button Shirt", "Black Poplin Vest", "Brown Plaid Button Shirt",
           "Brown Mid-Length Balloon Pants", "Lilac Single Button Vest", "Kanis Fannypack", "White Pleather Garter Belt", "Nori Scarf", "Crane Kimono", "Lush Knitted Cardigan", "White Tulle Tutu",
           "Brown Single Button Vest", "Likes Unicorns Statement Tee", "Fanboy Pants", "Green Kilt", "Fanboy Shirt", "Navy Tweed Shorts", "Fuchsia Deep V Tee", "Cyan Deep V Tee", "White Poplin Pants",
           "Magical Hikei Shoes", "Shepherdess Dress", "Plain Blue Waist Corset", "Spectrum Tie-Dye Skirt", "Prom Jacket", "Gray Contrast Banded Maxi Dress", "Yellow Tweed Shorts",
           "Plain Orange Waist Corset", "Burgundy Rugby Shirt", "Seductive Green Button-Up", "Olive Poplin Vest", "Turquoise Angelic Bunny Hat", "Bloodred Harvester Raincloak", "I Heart Anime T-shirt",
           "White Halftop", "Red Polka Dot Maternity Shirt", "Green Monster Face Shirt", "Red Vest and Shirt", "White Tweed Shorts", "Chilkat Robe", "Purple Tweed Shorts", "Gray Angelic Bunny Hat",
           "Kabuki Lion Spirit Top", "Red Thong", "Bamboo Kimono", "Nuclear Miniskirt", "Purple Wheelchair Shirt", "Green Cropped Vest", "Passionate Prom Dress", "Blue Angelic Bunny Hat",
           "Plain Red Shirt", "Kabuki Lion Spirit Hakama", "Black Lace Teddy", "I Love Chais Tee", "Satin White Halter Top", "Very Baggy Black Jeans", "Mini Kilt Novelty Pouch", "Pink Kilt",
           "Red and Black Polo Shirt", "Pink Polo Shirt", "High Slit Black Skirt", "Purple Corset", "Lemon Denimz", "Black and Red Fancy Silk Waistcoat", "Dessert Striped Shorts", "Red Lace Teddy",
           "Classic Steele Excavations Tee", "Satin Cyan Halter Top", "Comfy Purple Striped Pants", "Wrapped Orange Corset", "Tight Pink Tank", "White Ruched Bandeau", "Black Polka Dot Maternity Shirt",
           "Mud Striped Tank Top", "Satin Tangerine Halter Top", "Transparent Violet Halter", "Pink Striped Top", "Turquoise Fitted Dress", "Dark Matter Tank Top", "Yellow Monster Face Shirt",
           "White Plaid Button Shirt", "Baggy Blue Jeans", "White Asmodeus Genetech Lab Shirt", "Tight Blue Tank", "Plain Red Sleeved Shirt", "Green Laced Leggings", "White Mid-Length Balloon Pants",
           "Pride T-shirt", "Amber Fitted Dress", "Swirly Green and Gray Cowl Top", "Blue Skirt", "Royal Prom Vest", "Black Tweed Shorts", "Black Asmodeus Genetech Lab Shirt", "Funky Red Corset",
           "White Thong", "High Slit White Skirt", "Cherry Deep V Tee", "Maple Leaf Dress", "Purple Contrast Banded Maxi Dress", "Regal White Sleeves", "Teal Cowl Top", "I Love Anyus Tee",
           "Dawn Argyle Shirt", "Black Argyle V-Neck Sweater", "Blue Argyle V-Neck Sweater", "Plum Poplin Vest", "High Collared Black Robe", "Black Halftop", "Ivory and Red Argyle V-Neck Sweater",
           "White Leather Skirt", "Tight Red Tank", "White Party Dress", "Dated Striped Pants", "Tight Black Tank", "Cream Argyle V-Neck Sweater", "Wrapped Yellow Corset", "Smoky Striped Pants",
           "Sophisticated Prom Vest", "Pink Pleather Garter Belt", "Tan Flirty Miniskirt", "Spectrum Tie-Dye Pants", "Glamorous White Gown", "Black Pleather Garter Belt", "Labcoat",
           "High Slit Pink Skirt", "Red Ribbon Surprise Top", "Silk Black Keyhole Top", "Tight Green Tank", "Twilight Wraptop", "Dark Purple Strapless Ribbon Dress", "Ruched Black Top",
           "Silk Red Keyhole Top", "Long Pink Tulle Skirt", "High Slit Green Skirt", "Kitty Hoodie", "Pink Sushi Pajama Bottoms", "White Contrast Banded Maxi Dress", "Onyx Fitted Dress",
           "I Love Mallarchies Tee", "Brown Graceful Witch Gown", "Lemon Green Checked Skirt", "Full Body Baby Phoenix Costume", "Black Button-down Shirt", "Black Goffic Pants", "Black Ball Gown",
           "Blue Single Button Vest", "Teal Poplin Pants", "Black Gauchos", "Long Black Tulle Skirt", "Nuclear Argyle Shirt", "Lolita Dress", "Brown Gauchos", "Turquoise Contrast Banded Maxi Dress",
           "Brown Contrast Banded Maxi Dress", "White Ball Gown", "Pink Ball Gown", "Black Panties", "Rosy Lace Panel Top", "Cream Watercolor Splattered Dress", "Diamond Fitted Dress", "Nori Stole",
           "High Collared Purple Robe", "Battle Shirt", "Black Single Button Vest", "Rumpled Black Dress Shirt", "Blue Striped Pantaloons", "Cherub Panties", "Purple Patterned Skirt",
           "Teal Water Lily Brocade Dress", "Funky Black Corset", "Passionate Prom Vest", "Cultural Groupie Miniskirt", "Black Short Sleeved Smoking Jacket", "Blue Flippy Skirt", "Alley Screen Dress",
           "Eggplant Plain Tiered Skirt", "Colorless Two-Toned Shirt", "Harvest Sheer Blouse", "Broken Black Zipper", "Flowing Black Skirt", "Gray Drippy Rain Tank", "Snow Tree Blouse",
           "Small Orange Mesh Boxers", "Aqua Boxy Cropped Jacket", "Baby Blue Sliced Cami", "Blue Floral Printed Button-Up", "Cadet Blue Bell Skirt", "Cyan Uncomfortably Short Shorts", "Gray Maxi Skirt",
           "Gray Striped Bodycon Skirt", "Ocean Long Tiered Skirt", "Omen Islands Football Jersey", "Orange Heart and Diamond Lingerie", "Purple Drippy Rain Tank", "Quote Trunks",
           "Rainbow Striped Sweater", "Red Buttoned Varsity Jacket", "Red Satin Fabric Bolt", "Red Scrunchy Top", "Small Blue Mesh Boxers", "Tangerine Translucent Under-Bust Dress",
           "Yellow Scrunchy Top", "Fresh Lace Panel Top", "Purple Pinstripe Shirt", "Weathered Strapped Vest", "Frilly Pink Pants", "Golden Tiger Bottoms", "Cornsilk High Waisted Satin Shorts",
           "Black and Blue Fancy Silk Waistcoat", "Olive Tweed Blazer", "Broken Green Zipper", "Black Parted Dress", "Blue Dark-Harlequin Shorts", "Bolt of Red Tartan",
           "Cream Lovingly Laced Layering Tank", "Blue Utility Vest", "Cream Lacy Camisole", "Black Lace Collar Cardigan", "Faded Red Skirt", "Green Scrunchy Top", "White Cropped Pocket Jacket",
           "Orange Tank Top", "Yellow Flower Speckled Top", "Tan Bird Tracks Shirt", "Lilac Long Tiered Skirt", "Pale Blue Girly Bow Shirt", "Formal Dress", "Blue Uncomfortably Short Shorts",
           "Gray Strapped Vest", "Purple Mankini", "High Waist Patterned Black Shorts", "Buttercup Herringbone High Waisted Shorts", "Purple Tank Top", "Red Phoenix Brocade Dress", "Seafoam Drape Top",
           "Shinwa Dress", "Blue Floral Lace Top", "White and Blue Fancy Silk Waistcoat", "Blue Lace Collar Cardigan", "Frilly Black Lingerie Bottoms", "Baggy Light Denim Overalls",
           "Red Striped Pantaloons", "Pink Lovingly Laced Layering Tank", "Lavender Long Lace Cardigan", "Navy Buttoned Varsity Jacket", "Black High Waisted Satin Shorts", "Cozy Black Pants",
           "Long White Halter Top", "Black Hikei Print Leggings", "Blue Flower Speckled Top", "Cozy Blue Pants", "Neon Floral Jacket", "Transparent Emerald Halter", "Pink Lace Panties",
           "Sunglo Bell Skirt", "Small Black Mesh Boxers", "Blue Corseted Crop Top", "Yellow Mankini", "Relaxed Fit Light Wash Jeans", "Milky Layered Shirts", "Red Subeta Sweatpants",
           "Side Cut Blue Tank", "Dark Wash Flood Jeans", "High Collared Blue Robe", "Purple Utility Vest", "Cream Translucent Under-Bust Dress" ]
restock("/shop.php?shopid=11",buy11)

// Icy Goods
var buy25 = ["Red Arm Warmers", "Eggnog", "Smiley Ice Cream", "Snowshoe", "Snow Matter", "Ice Urchin", "Rainbow Lumi Lights", "Fake Pherret Fur", "Lonely Green Penguin Plushie", "Trapd!",
             "Chocolate Eggnog", "Mint Poopy Soft Serve", "Melty", "Peach Eggnog", "Ice Flavored Ice", "Iceeci", "Citrus Flavored Ice", "Berry Flavored Ice", "Budgie", "Dropped Pistachio Ice Cream",
             "Snips", "Tiny Candy Cane Shiv", "Cherry Ice Dessert", "Smiley Milkshake", "Pineapple Freeze Pop", "Pink Bunny Beanie", "Polar", "Ice Cream", "Banana Ice Dessert", "Orange Scarf",
             "Yellow Bunny Beanie", "Turquoise Pompom Scarf", "Apple Flavored Ice", "Hockey Stick", "White Wintery Cybill Beanbag", "Baby Angel Sundae", "Arctic Treat", "Rainbow Arm Warmers",
             "Fake Kumos Fur", "Festive Snowflake Silk Dress", "Cream Knit Mittens", "Snowplow of Unexpected Carnage", "Rainbow Aurora Necklace", "Ice Dragon Plushie", "Red Hooded Jacket",
             "Green Bunny Anaconda Scarf", "Cherry Flavored Ice", "Icei", "Green Fuzzy Half-Cape", "Strawberry Eggnog", "Icy Freezing Rod of Doom", "Fuzzy Mittens",
             "Partially Zipped Black Leather Jacket", "White Winter Beastie Beanbag", "Cream Snowflake Silk Dress", "Fleece Skull Throw", "Peppermint Tights", "Teal Bubble Sweater", "White Hoodie",
             "Red Cozy Shirt", "White Snowsuit", "White Furry Winter Vest", "Blue Cuddlie", "Brown Spotted Rabbit Ear Cap", "Ivory Back Rack Antlers", "Ice Chameleon Plushie", "Chocolate Winter Boots",
             "Striped Red Scarf", "Candy Apple Loose Scarf", "Brown Furry Winter Vest", "Anchovy Frozen Pizza", "Yellow Scarf", "Blue and Black Snowboarding Jacket", "Yellow Argyle Arm Warmers",
             "Striped Teal Scarf", "Red Loose Sweater", "Bottled Ice", "Tiny Multi-Colored Replacement Bulbs", "Pink Knit Arm Warmers", "Sea Fair Isle Shawl Cardigan", "Cream Fitted Jacket",
             "Box-O-Snowballs", "Pink Argyle Arm Warmers", "Violet One-Shoulder Ice Skating Costume", "Below Freezing Smoky Cloak", "Orange Kitty Ear Cap", "Blue Knit Leg Warmers",
             "Winter Night Chunky Knit Sweater", "Gray Cozy Shirt", "Green Ice Skating Vest Shirt", "Open Red Cardi", "Dual Tone Yellow Jacket", "Green Aurora Borealis Pantyhose",
             "Frozen Lake Chunky Knit Sweater", "Spectrum Bear Beanie", "Lime Argyle Arm Warmers", "Yellow Knit Leg Warmers", "Pink Knitted Bikini Top", "Gold Knit Mittens", "Magical Snowflake"]
restock("/shop.php?shopid=25",buy25)

// Minions Market
var buy21 = [ "Honeybear", "Flopalops", "Badnit", "XOX Bunny", "Creambunn", "Little Dear", "Yume", "Bluberribunni", "Deyw", "Turnip Warrior", "Darkside Tree Blub", "Birb Blub", "Florae", "Baby Cthulhu",
             "Zeedra", "Lumineve Fish", "Uni Blub", "Jenevive", "Living Paint Splotch", "Incendo", "Nessie", "Guilty Wallaby", "Maliss", "Lil Buns", "Waru", "Kaniri", "Rockitty", "Rainbear",
             "Monpetitchou", "Fairgrounds Tree Blub", "Candisaurolophus", "Banshee", "Mudpuppy", "Targit", "Huvveropt", "Teeny Pie Minion", "Inky", "Lizard Minion", "Cayman", "Mirath", "Nips",
             "Pirem", "Pompom", "Fire Eyes", "Bitten Pie Minion", "Fuzzy of Doom", "Sock Puppet of Rage", "Darko", "Lapine", "Cadogite", "Broklee", "Uumpa", "Sakura", "Fishbowl", "Endeavling",
             "Whiffle", "Teren", "Starpy", "Binx", "Pure Matter", "Dark Matter Sugar Pixie", "Stinker", "Misfortunat", "Moof", "Lilapin", "Shoofly", "Nursling", "Lizzie", "Ivory", "Sylsha",
             "Terraptrine", "Bloodred Pearasaur", "Spyte", "Patches", "Lockjaw", "Hund", "Survival Canary", "Slyy", "Korahel", "Zephyr", "Rainbie", "Holiday Dark Matter", "Anubi", "Chimera",
             "Klawsion", "Brokenhearted Kitty", "Phiso", "Dogo", "Reborn Matter", "Kitmonkey", "Radioactive Blub", "Subeta Cola Fairy", "Porkymer", "Tarantella", "Tinoh", "Hissper", "Baaaaaa",
             "Dillo", "Kangoo", "Womba", "Angelkitty", "Phalfo", "Bobber", "Fost", "Acornling", "Old Wizzurd", "PO-TA-TIS", "Dandilion", "Kyndir", "Particle Matter", "Hadi", "Chihiro", "Ippo",
             "Brain Sucker", "Kizzy", "Kuro Neko San", "Drama Llama", "Tufty", "Cinnaman", "Fairy Bear", "Wired Wabbit", "Cheery Cherry Pie Minion", "Rackle", "Precious", "Cutesy Funnel", "Turngel",
             "Demonic Peeper of Doom", "Firefox", "Hydrade", "Velvet", "Sheeza", "Laeva", "Rainbow Pie Minion", "Taupe Polish Chicken", "Seel", "Eaglet", "Fireside Blob Kitty", "Blinky", "Hyrus",
             "Kirin", "Kerops", "Mister Paintbrush", "Banare", "Stalwart", "Bloodbear", "Punkmallow", "Eodd", "Blob Kitty Cousin", "Festive Duck", "Twerp" ]
restock("/shop.php?shopid=21",buy21)

// Plushie Parlor
var buy29 = [ "Nuclear Endeavor Plushie", "Silver Anyu Plushie", "Sun Blob Plushie", "Vibrant Priggle Plushie", "Bloodred Potion Plushie", "Long Lasting Cuddly Cuttlefish Plushie",
             "Dusk Scootle Plushie", "Cherry Endeavor Plushie", "Collectible Pete Plushie", "Coma Plushie", "Glacier Antlephore Plushie", "Yellow Firework Plushie", "Aqua Kanis Plushie",
             "Vibrant Urubu Plushie", "Angelic Demi Plushie", "White Alligator Plushie", "Fluffy Penguin Plushie", "Dark Matter Potion Plushie", "Twilight Urubu Plushie", "Hydrus Velosotor Plushie",
             "Evil Squirrel Plushie", "Silver Malticorn Plushie", "Carnival Gee Thanks Bear Plushie", "Common Scootle Plushie", "Teal Derpy Puppy Plushie", "Marsh Demi Plushie",
             "Gray Im Sorry Dog Plushie", "Tobias Plushie", "Dawn Yaherra Plushie", "Graveyard Irion Plushie", "Sun Scootle Plushie", "Polka Dot Vintage Antlephore Plushie",
             "Pink Man in the Moon Plushie", "Glade Demi Plushie", "Reborn Legeica Plushie", "Nuclear Torrent Plushie", "Paranoid Bear Plushie", "Golden Demi Plushie", "Jo Plushie",
             "New Job Congratulations Plushie", "Lilac Yaherra Plushie", "Silver Qrykee Plushie", "PPT Mascot Plushie", "Ebil Bear Plushie", "Nova Plushie", "Brown Handmade Puppy Plushie",
             "Twilight Serpenth Plushie", "Field Qrykee Plushie", "Hydrus Endeavor Plushie", "Aqua Charlie Plushie", "Cherry Blob Plushie", "Glade Kerubi Plushie", "Cuddly Bear Plushie",
             "Reborn Potion Plushie", "Aqua Qrykee Plushie", "Big Star Jollin Plushie", "Hydrus Magnus Plushie", "Cherry Priggle Plushie", "Purple Man in the Moon Plushie", "Glacier Ontra Plushie",
             "Red Ballgowned Fancy Bear Plushie", "Twilight Yaherra Plushie", "Common Blob Plushie", "Aqua Demi Plushie", "Cherry Zasaba Plushie", "Polka Dot Vintage Kanis Plushie",
             "Twilight Scootle Plushie", "Nuclear Blob Plushie", "Green Snowman Plushie", "Luminaire Kumos Plushie", "Golden Qrykee Plushie", "Love Squirrel Plushie", "Vibrant Qrykee Plushie",
             "Chibi Torrent Plushie", "Golden Chelon Plushie", "Yellow Polar Bear Plushie", "Sun Kumos Plushie", "Cherry Qrykee Plushie", "Red Heart Plushie", "White Festive Light Plushie",
             "Arid Feli Plushie", "Field Blob Plushie", "Luminaire DCM Plushie", "Aqua Endeavor Plushie", "Hydrus Warador Plushie", "Dusk Qrykee Plushie", "Graveyard Warador Plushie",
             "Common Zasaba Plushie", "Cherry Montre Plushie", "Silver Urubu Plushie", "Silver Yaherra Plushie", "Cherry Yaherra Plushie", "Marsh Keeto Plushie", "Dusk Hipottu Plushie",
             "Limited Edition Luminaire Kumos Plushie", "Bloodred Clawsion Plushie", "Johannes Plushie", "Gold Flecked Vintage Jollin Plushie", "Chibi Kerubi Plushie", "Arid Lain Plushie",
             "Angelic Bear Plushie", "Common Qrykee Plushie", "Emo Terracoon Plushie", "Daemon Plushie", "Apprentice Wizard Plushie", "Dolly Plushie", "Green Unicorn Plushie", "Lilac Torrey Plushie",
             "Arid Harvester Plushie", "Experiment 7463 Plushie", "Black Graduation Plushie", "Golden Serpenth Plushie", "Twilight Tigrean Plushie", "Gold Carrot Plushie", "Nuclear Zentu Plushie",
             "Golden Keeto Plushie", "Denial Plushie", "Grayscale Ontra Gift Plushie", "Snowflaik Plushie", "Golden Noktoa Plushie", "Darkheart Phantom Plushie", "Bloodred Endeavor Plushie",
             "Field Kanis Plushie", "Chibi Paralix Plushie", "Vintage Golden Swampie Plushie", "Bloodred Anyu Plushie", "Common Kanis Plushie", "Golden Telenine Plushie", "Elwood Plushie",
             "Nuclear Malticorn Plushie", "Graveyard Potion Plushie", "Twilight Bumbus Plushie", "Twilight Celinox Plushie", "Nuclear Anyu Plushie", "Lilac Bhakoru Plushie", "Rainbow Voodoo Doll Plushie",
             "Sebastian Phoenix Plushie", "Emerald Patched Butterfly Plushie", "Artist Plushie", "Basilisk Lizard Plushie", "Bloodred Devonti Plushie", "Bloodred Flower Plushie",
             "Bloodred Keeto Plushie", "Chibi Magnus Plushie", "Common Escalade Plushie", "Dusk Antlephore Plushie", "Engineer Orion Plushie", "Experiment 911 Plushie", "Field Xotl Plushie",
             "Glacier Priggle Plushie", "Golden Devonti Plushie", "Golden Donadak Plushie", "Golden Jollin Plushie", "Hydrus Jollin Plushie", "Hydrus Malticorn Plushie", "Hydrus Priggle Plushie",
             "Magma Spirit Plushie", "Marsh Serpenth Plushie", "Rotten Rogue Plushie", "Twilight Montre Plushie", "Twilight Terracoon Plushie", "Black Squishy Gem Plushie", "Bloodred Kerubi Plushie",
             "Chibi Sheeta Plushie", "Golden Slushii Plushie", "Twilight Irion Plushie", "Graveyard Devonti Plushie", "Cheerful Rag Doll Plushie", "Purple Lizard Plushie", "Angelic Serpenth Plushie",
             "Bloodred Irion Plushie", "Hydrus Celinox Plushie", "The Oracles Dark Matter Plushie", "Malerias Dark Matter Plushie", "Bear Plushie", "Nuclear Popoko Plushie", "Golden Hipottu Plushie",
             "Aqua Sheeta Plushie", "Common Dragarth Plushie", "Experiment 1337 Plushie", "Golden Kerubi Plushie", "Sun Clawsion Plushie", "Glade Warador Plushie", "Twilight Charlie Plushie",
             "Hydrus Kanis Plushie", "Angelic Dragarth Plushie", "Blue Ballgowned Fancy Bear Plushie", "Cuddly Llama Plushie", "Graveyard Ontra Plushie", "Heated Short Sword Plushie",
             "Lilac Feli Plushie", "Reborn Malticorn Plushie", "Sun Xotl Plushie", "Yellow Daisy Plushie", "Bloodred Cybill Plushie", "Common Torrey Plushie", "Belial Plushie", "Cream Zasaba Plushie",
             "Glacier Dillema Plushie", "Glacier Potion Plushie" ]
restock("/shop.php?shopid=29",buy29)

// Spells Galore
var buy28 = ["Holy Water", "Unicorn Horn", "Demon Wing", "Moonstone", "River Mud", "Bottled Hatred", "Angelic Feather", "Sands of Time", "Pearl of Wisdom", "Couatl Feather", "Severed Goat Head",
             "Banshee Tongue", "Solar Barque", "Pumpkin Parasite Eggs", "Scarab of the Pharaohs", "Destroying Angel", "Whale Fat", "Viper Fang", "Tiger Bones", "Turtle Shell", "Wavy Athame",
             "Wolf Tooth", "White Siren Hair", "Siren Song", "Monkey Brain"]
restock("/shop.php?shopid=28",buy28)

// Weapons Warehouse
var buy30 = [ "Cruel Lawnmower of Slaying", "Vengeance Blade", "Almost Amazing Emo Glasses", "Slumber Party Head BO xers", "SubetaBall", "Keiths Cheater Flyswatter", "Kismets Cosmic Blade",
             "Magical Dark Matter Duct Tape", "Dark Sign", "Bleeding Rose of Deepest Blackness", "Diamond Scepter of the Terrier Queen", "Lime of Doom", "Keiths Quill", "Evil Quill",
             "Battle Wheelchair", "Golden Short Sword", "Tomahawk", "Exploding Encyclopedia of Sparklies", "Sawed Off Double Barrel Shotgun", "Mechalag Razor", "Heated Short Sword", "Red Short Sword",
             "Blue Short Sword", "Rainbow Quill", "Normal Short Sword", "Hoarding Spork of Self Destruction", "Kora Scroll of Mystery", "Silver Short Sword", "Nailed Board",
             "Teeny Pie Minion Disguised Bomb", "Fake Space Staff", "Blade of Sacrifice", "Astral Wand", "Bottled Wind", "Dark Goddess Moon Staff", "Death Charm", "Dusk Spirit", "Evil Blade of Doom",
             "Field Spirit", "Gold Sai", "Magical Fairy Crown", "Mystical Orb of the Gods", "Ontra Poison Darts", "Spark Matter", "Magical Love Duct Tape", "Pink Crystal Sword", "Telenine Staff",
             "Happy Spear", "Nuclear Curry", "Dark Goddess Amulet", "Enchanted Elven Bow", "Electric Hikei Sword", "Rainbow Chelon Gem", "V-Nuke", "Pineapple of Torture and Maiming", "Deadaim Ring",
             "Zephyr Wand", "Bloodred Chelon Gem", "Blackest Sword of Darkest Death", "Hearts Revenge Gunblade", "Purple Gun", "Bear Plushie Bomb", "Gate Keeper Gem of Power", "Kumos Wand",
             "Evil Booger", "Inverted Galaxy Orb", "Teddy Bear Sword", "Glitter Blade", "Celinox Portable Battle Snowflakes", "Mysterious Pie", "Clawsion Battle Wand", "Escalade Balance Blade",
             "Amoeba of Dooom", "Bottled Delirium", "Fake Fairy Blade", "Legendary Staff of Mists", "Poisonous Azathoth Tentacle", "Blazing Sun Rod", "Sacrificial Spork", "Bubble Wand", "Demi Sword",
             "Boysenberry Pie Bomb", "Evil Magic Wand", "Irion Battle Feather", "Pie Bomb", "Staff of Good and Evil", "Terracoon Blade", "Light Dreamcatcher", "Lilac Mahar Hourglass", "Life Dreamcatcher",
             "Dark Dagger", "Sparkling Quill", "Subeta Cola Fairy Attitude Adjuster", "Cuttlefish Sword", "Super Secret Blob Helper", "Irion Egg Bomb", "Magical Gold Duct Tape", "Cruento Dolor",
             "Awesomely Totally Bent Pokey Stick", "Crystal Dagger" ]
restock("/shop.php?shopid=30",buy30)



if ( $(`.ui.segment.text_center:contains('Purchased')`).length > 0 || $(`h2:contains('Sold Out!')`).length > 0 ) {

    const price = $(`.ui.segment.text_center p:contains('has been put in your items') b:nth-child(1)`).text();
    const itemName = $(`.ui.segment.text_center p:contains('has been put in your items')`).children().eq(2).text();
    console.log(`Bought ${itemName} for ${price}`);
//    new Notification(`Bought ${itemName} for ${price}`);

    window.location.href = url;
}

if ( $(`body:contains("You can only buy an item every 5 seconds!")`).length > 0 ) {
    setTimeout(function () {
        window.location.href = url;
    }, 1000);
}
if ( $(`body:contains("You have too many items in your inventory!")`).length > 0 ) {
    new Notification(`You have too many items in your inventory!`);
}


if ( $(`span[style="color: #767676"]:contains('Restocked')`).length > 0 ) {
    var restockTime = $(`span[style="color: #767676"]:contains('Restocked')`).text();
    restockTime = restockTime.substring( restockTime.lastIndexOf("Restocked ") + 10,  restockTime.lastIndexOf(" minute") );

    var refreshNum = 6 - Number(restockTime);

    setTimeout(function () {
        window.location.href = url;
    }, refreshNum * 60000 );

    console.log(`Refreshing in ${refreshNum} minutes`)
}
else if ( $(`body:contains('Restocked Now!')`).length > 0 ) {
    setTimeout(function () {
        window.location.href = url;
    }, 300000 );
    console.log(`Refreshing in 5 minutes`)
}


