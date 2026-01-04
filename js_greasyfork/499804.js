// ==UserScript==
// @name         Neopets Quicker-stock
// @namespace    neopets
// @version      1.7
// @description  Highlights and selects pre-determined option for items on the Quick Stock Page based on their categorization.
//               Currently covers codestones Giant Space Fungus drops, R102 - 179 daily drop items from JellyNeo's Recycling Strategies Guide (https://www.jellyneo.net/?go=faerie_festival&year=2023&id=r102_strategies)
//               The Coincidence quest items, TVW Battledome & NeoHospital Pools, and rare valuable items (paint brushes, morphing potions, transmog potions, neggs, dubloons),
//               Underwater Fishing, & Grave Danger.
// @author       darknstormy
// @match        https://www.neopets.com/quickstock.phtml*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499810/Neopets%20Quicker-stock.user.js
// @updateURL https://update.greasyfork.org/scripts/499810/Neopets%20Quicker-stock.meta.js
// ==/UserScript==

const TVW_RECYCLING_ITEMS = [
    "Darkness Potion",
    "Lucky Robots Foot",
    // All these are R90 - R99
    "Doctor Plushie", // R98
    "Greater Healing Scroll", // R99
    "Twisted Dark Dagger",
    "Helm of Recovery",
    "Dark Nova Pop",
    "Lesser Healing Scroll",
    "Instant Invisible Armour Potion",
    "Cursed Elixir",
    "Dark Faerie Plums",
    "Faerie Fruit Salad",
    "Greater Healing Scroll",
    "Lutari Gaming System",
    "Jerdana Usuki",
    "Bullseye Potion",
    "Bullseye Potion",
    "All About Dark Faeries",
    "Maraqua Altador Cup Media Book",
]

const TVW_DISCARD_ITEMS = [
    "Angel Hair Salad",
    "Doctor",
    "Doctor Top",
    "Face Bandage",
    "Golden Sun Chalice",
    "Granny Hopbobbins Glasses",
    "Healing Gauze Pads",
    "Hospital Gown",
    "Hospital Room Background",
    "Medical Face Mask",
    "Neopian Hospital Stamp",
    "Peppermint Stomach Medicine",
    "A Guide to Find the Right Cure",
    "Faerie Healing Dust",
    "Black Square Glasses",
    "Deluxe Organic Salad",
    "Golden Draik Charm",
    "Green Toadstool",
    "Healing Potion (TCG)",
    "Hurt Orange Kiko Book",
    "Medical Bracelet",
    "Medical Hairnet",
    "Nurse Glee Plushie",
    "Nurse Skeleton Bobblehead",
    "Reflex Hammer Handheld",
    "Service Petpet Kadoatie",
    "Grey Cupcake",
    "Voidberry Extract",
    "Voidberry Cobbler",
    "Dark Faerie Apple",
];

const TVW_DEPOSIT_ITEMS = [
    "Leaded Elemental Vial",
    "Strength Serum", // +strength
    "Therapeutic Swamp Water" // +level, +defense
];


const TVW_SELL_ITEMS = [
    "Bubbling Healing Goo",
    "Yellow Healthshroom",
    "Bullseye Potion",
    "Book of Strange and Incurable Diseases",
    "Cooling Ointment",
    "Faerie Fruit Salad",
    "Green Healthshroom",
    "Service Petpet Doglefox",
    "Strength Serum",
    "Super Strength Healing Potion",
    "Angry Vira Plushie",
    "Harquins Day",
    "Grey Usul Plushie",
    "Purple Carrot",
    "Extinct Neopian Languages",
    "Dwoobaphone",
    "Grape Jelly Bongos",
    "Grey Waffles",
    "Grey Eggs and Bacon",
    "Gamer Quiguki",
];

const RED_CODESTONES = [
    "Mag Codestone",
    "Kew Codestone",
    "Cui Codestone",
    "Zed Codestone",
    "Sho Codestone",
    "Vux Codestone"
];

const TAN_CODESTONES = [
    "Main Codestone",
    "Eo Codestone",
    "Bri Codestone",
    "Har Codestone",
    "Orn Codestone",
    "Tai-Kai Codestone",
    "Lu Codestone",
    "Mau Codestone",
    "Zei Codestone",
    "Vo Codestone",
];

const DAILY_RECYCLING_ITEMS = [
    // From Omelette
    "Tomato and Pepper Omelette",
    "1/3 Tomato and Pepper Omelette",
    "2/3 Tomato and Pepper Omelette",
    "Tomato Omelette",
    "1/3 Tomato Omelette",
    "2/3 Tomato Omelette",
    "Cheese Omelette",
    "1/3 Cheese Omelette",
    "2/3 Cheese Omelette",
    "Cheese and Onion Omelette",
    "1/3 Cheese and Onion Omelette",
    "2/3 Cheese and Onion Omelette",
    "BBQ Sauce Omelette",
    "1/3 BBQ Sauce Omelette",
    "2/3 BBQ Sauce Omelette",
    "Bacon Omelette",
    "1/3 Bacon Omelette",
    "2/3 Bacon Omelette",
    "Bacon and Broccoli Omelette",
    "1/3 Bacon and Broccoli Omelette",
    "2/3 Bacon and Broccoli Omelette",
    "Green Pepper Omelette",
    "1/3 Green Pepper Omelette",
    "2/3 Green Pepper Omelette",
    "Carrot and Pea Omelette",
    "1/3 Carrot and Pea Omelette",
    "2/3 Carrot and Pea Omelette",
    "Sausage Omelette",
    "1/3 Sausage Omelette",
    "2/3 Sausage Omelette",
    "Sausage and Pepperoni Omelette",
    "1/3 Sausage and Pepperoni Omelette",
    "2/3 Sausage and Pepperoni Omelette",
    // From Wheel of Misfortune
    "Jubusul Plushie",
    "Koibat Plushie",
    "Kougrachio Plushie",
    "Quigquig Plushie",
    "Scorcie Plushie",
    "Sloth Faerie Plushie",
    "Von Kougra Plushie",
    "Space Blumfaerie Plushie",
    "Usulbat Plushie",
    // From Buried Treasure
    "Buried Burger",
    "Maggoty Spud",
    "Rancid Old Meat",
    "Rock Baby Cabbages",
    "Snout Plant",
    "Spongy Mound",
    // From scratchcards
    "Undead Jackpot of Doom Scratchcard",
    "Festering Fortune Scratchcard",
    "Mutating Millions Scratchcard",
    "Terror Trove Scratchcard",
    "Faeries Fortune Scratchcard",
    "Peak O Plenty Scratchcard",
    // From Cheat!
    "00 Hog Battlecard",
    "Branston Battlecard",
    "Brucey B Battlecard",
    "Chuffer Bob Battlecard",
    "Fernypoo Battlecard",
    "Gold 00 Hog Battlecard",
    "Gold Branston Battlecard",
    "Gold Brucey B Battlecard",
    "Gold Capara Battlecard",
    "Gold Chuffer Bob Battlecard",
    "Gold Fernypoo Battlecard",
    "Gold Kalora Battlecard",
    "Gold Little Timmy Battlecard",
    "Gold Spectre Battlecard",
    "Kalora Battlecard",
    "Little Timmy Battlecard",
    "Silver 00 Hog Battlecard",
    "Silver Branston Battlecard",
    "Silver Brucey B Battlecard",
    "Silver Capara Battlecard",
    "Silver Chuffer Bob Battlecard",
    "Silver Fernypoo Battlecard",
    "Silver Kalora Battlecard",
    "Silver Little Timmy Battlecard",
    "Silver Spectre Battlecard",
    "Spectre Battlecard",
    // Jhudora's Quests
    "Poisonous Lollypop",
    "Noxious Nectar",
    "Jhudoras Brush",
    "Purple Blob Potion",
    "Jhudora T-Shirt",
    "Caustic Potion",
    "Dark Faerie Magic",
    "Malice Potion",
    "Wind Up Rat",
    // Brain Tree Quests
    "Attack Fork",
    "Baby Fireball",
    "Bat Pack",
    "Bearog",
    "Brain Tree Branch",
    "Brain Tree Mace",
    "Brain Tree Root",
    "Brain Tree Splinters",
    "Feather Tickler",
    "Garlic Shield",
    "Lil Frankie",
    "Lucky Robots Foot",
    "Magic Branch",
    "Mummy Baby",
    "Pumpkin Shield",
    "Slime Potion",
    "Staff of Brain",
    "Walking Carpet",
    "Web Claw",
    // Cheeseroller Prizes
    "Smoked Snorkle Cheese",
    "Triple Mustard Cheese",
    "Honey Cheese",
    "Big Beefy Cheese",
    "Purple Spotted Cheese",
    "Brain Cheese",
    "Alkenore Cheese",
    "Mutated Cheese",
    "Bubbling Blueberry Cheese",
    "Tyrannian Dung Cheese",
    "Quadruple Fudge Cheese",
    "Brick Cheese",
    "Gooey Snot Cheese",
    "Peppermint Cheese",
    "Overgrown Cheese",
    // Coltzan's Shrine
    "Coltzans Burning Gem",
    "Expert Lens",
    "Artisans Lens",
    "Coltzans Ring",
    "Coltzans Necklace",
]

const UNDERWATER_FISHING_DISCARD_ITEMS = [
    "Giant Brown Kelp",
    "Giant Green Kelp",
    "Giant Red Kelp",
    "Mossy Rock",
    "Grey Sea Fern",
    "Spongy Algae",
    "Cheery Plant",
    "Cinder Block Sea Fungus",
    "Cubical Sea Fungus",
    "Cave Rock",
    "Shimmery Seagrass",
    "Void Plant",
    "Prismatic Sea Fern",
    "Darigan Seaweed",
    "Magic Crystalline Kelp",
    "Starry Sea Fern",
    "Plushie Fungus",
    "Lurman",
    "Noak",
    "Nupie",
    "Splime",
    "Yoakie",
    "Kora",
    "Mundo",
    "Surzard",
    "Waterlogged Book",
    "Slimy Bog Scroll",
    "Soggy Scroll",
    "Cheap Water Ring",
    "Rotten Beetroot",
    "Scroll of the Sea",
    "Water Mote",
    "Bubble Mote",
    "Magical Healing Potion",
    "Ultra Bubble Beam",
    "Water Muffin",
    "Water Faerie Water Blaster",
    "Necklace of the Water Faerie",
    "Broken Fishing Pole",
    "Bucket of Sludge",
    "Healing Springs Residue",
    "Old Rotten Left Boot",
    "Old Rotten Right Boot",
    "Old Rotten Left Sandal",
    "Old Rotten Right Sandal",
    "Old Rotten Left Shoe",
    "Old Rotten Right Shoe",
    "Rotting Driftwood",
    "Rusty Old Can",
    "Watery Hot Dog",
    "Mouldy Left-Overs",
    "Petrified Bone",
    "Dull Grey Pearl",
    "Rotten Omelette Sandwich",
    "Broken Toy Sailboat",
    "Enormous Fake Diamond",
    "Old Box Fort",
    "Edible Smelly Gym Socks",
    "Giant Bath Plug",
    "Mouldy Petpet Bed",
    "Plushie Clam",
    "Mouldy Pencil Case",
    "Titanic Giant Squid", // but hey! At least you got the avatar :)
    "Breadfish",
    "Rockfish",
    "Butterfish",
    "Madfish",
    "Small Giant Squid",
    "Tanglepus",
    "Large Giant Squid",
    "Fractalpus",
    "Eyefish",
    "Giant Giant Squid",
    "Cubefish",
    "Doomfish",
    "Inferno Mollusk",
    "Tyrannian Mechafish",
    "Radarfish",
    "Bombfish",
    "Chaosfish",
    "Diseased Mechafish",
    "Frozen Mechafish",
    "Glistening Mechafish",
    "Golden Mechafish",
    "Spooky Mechafish",
    "Spectral Shrimp",
    "Transparifish",
    "Neopet-Eating Carp"
]

const UNDERWATER_FISHING_SELL_ITEMS = [
    "Dead Bonfire",
    "Fishing Made Easy",
    "On Gelert Pond",
    "Ancient Shopping List Scroll",
    "The Old Mynci and the Sea",
    "Mouldy Tome",
    "Secret of the Bogberries",
    "17-Pound Trout",
    "Fish Scale Breastplate",
    "Pike Pike",
    "Shiny Shoal Shell Shield",
    "Bag of Broken Neopoints",
    "Stagnant Puddle of Water",
    "Old Picket Fence",
    "Leminty Elixir of Healing",
    "Healing Potion XV",
    "Gravitic Urn",
    "Pant Devil Attractor",
    "Smooth Black Sphere",
    "Molten Borovan Rod",
    "Obelisk of Doom",
    "Hovering Four-Dimensional Pyramid",
    "Golden Meepit Statue",
    "Glowing Wooden Mask",
    "Shiny Sloth Head",
    "Rockfish Plushie",
    "The Two Ring",
    "Lesser Spotted Fish Plushie",
    "Flask of Clear, Odourless Liquid",
    "Strange Glowing Disc",
    "Blandfish",
    "Lesser Spotted Fish",
    "Scrawnyfish",
    "Waterfish",
    "Landfish",
]

const UNDERWATER_FISHING_DEPOSIT_ITEMS = [
    "Irritable Genie-in-a-Bottle",
    "Mysterious Swirly Potion",
    "Flask of Rainbow Fountain Water",
]

const COINCIDENCE_STANDARD_POOL_QUEST_ITEMS = [
    "Blandfish",
    "Box of Wheat Flakes",
    "Brown Sauce",
    "Cheops Plant",
    "Dried Apricots",
    "Dried Prunes",
    "Landfish",
    "Lesser Spotted Fish",
    "Ptolymelon",
    "Rotten Omelette",
    "Scrawnyfish",
    "Semolina",
    "Snazzy Moon Comb",
    "Stagnant Puddle of Water",
    "Super Toy Sailboat",
    "Tchea Fruit",
    "Toy Sailboat",
    "Volcanic Rock",
    "Waterfish",
    "Yellow Growth"
];

const COINCIDENCE_ALTERNATIVE_POOL_QUEST_ITEMS = [
    "Acara Acrobat Plushie",
    "Adventures In Space",
    "Altador Rug",
    "Altador Stained Glass Window",
    "Amber Sword",
    "Amulet of Darkness",
    "Aplets",
    "Apple Cherry Tarts",
    "Apple Cinnamon Crepe",
    "Apple and Cheese Sandwich",
    "Aquatic Arrangement",
    "Arkmite",
    "Assorted Mini Biscuits",
    "Avocado Baby Food",
    "Baby Lupe Plushie",
    "Baby Quiggle Plushie",
    "Baby Scorchio Plushie",
    "Bag of Decorative Seashells",
    "Bagguss",
    "Baked Asparagus Biscuit",
    "Baked Cheddar Straws",
    "Banjo",
    "Basket of Vegetables",
    "Battle Faerie Dagger",
    "Bean Bag of Nova",
    "Beetroot and Cream Smores",
    "Bite Size Celery",
    "Biyako",
    "Blue Ixi Plushie",
    "Blue Meerca Gnome Plushie",
    "Blue Ruki Plushie",
    "Blue Scorchio Paddleball Game",
    "Boots of Leaping",
    "Bori Balloon Animal",
    "Bottle of Shenkuu Ink",
    "Bottle of White Sand",
    "Brain Muffin",
    "Brightvale Berry Stained Glass Window",
    "Brioche",
    "Brown Rice",
    "Bucket of Neopets",
    "Buttered Toast",
    "Camouflage Ruki Marionette",
    "Caramel Creams",
    "Castle Window",
    "Cello",
    "Cheopple",
    "Chia Clown Punching Bag",
    "Chilli Stir Fry",
    "Chocolate Covered Cherries",
    "Chomato",
    "Cinnamon Roll",
    "Claw Necklace",
    "Cobrall Root",
    "Comfy Pumpkin Bean Bag",
    "Corn Bread",
    "Creamy Stick Biscuit",
    "Croissant",
    "Cursed Wand of Shadow",
    "Cyodrake Scratching Post",
    "Cyodrakes Gaze Keychain",
    "Darigan Aisha Crystal Ball",
    "Darigan Faellie Action Figure",
    "Darigan Muffin",
    "Dark Island Palm Tree",
    "Dartail",
    "Desert Kabob",
    "Dont Splat the Korbat!",
    "Doughnut Holes",
    "Dried Mango",
    "Drillaroot",
    "Drinking Lenny Toy",
    "Drumsticks",
    "Dual Tone Maractite Coin",
    "Eau de Korbat",
    "Electro Sword",
    "Endless Salad and Bread Sticks",
    "Evil Hair Clip",
    "Evil Muffin",
    "Evil Snowball",
    "Evil Twin Goatee",
    "Exotic Fried Noodles",
    "Exploding Snowball",
    "Faerie Gnorbu Plushie",
    "Fauna Stamp",
    "Finneus Stained Glass Window",
    "Fire Muffin",
    "Fizzy Neocola Bottles",
    "French Toast Sticks",
    "Fresh Bamboo Chair",
    "Fried Chicken and Waffles",
    "Fried Egg on Toast",
    "Fruit and Vegetable Hand Roll",
    "Fruity Pancakes",
    "GX-Oscillabot",
    "Ghostkerchief Banjo",
    "Ghoti",
    "Gilded War Hammer",
    "Glowing Top",
    "Gobi Fruit",
    "Gold Trimmed Tunic",
    "Golden Laurel Circlet",
    "Golden Muffin",
    "Green Cyodrake Plushie",
    "Green Kiko Jigsaw Puzzle",
    "Green Mynci Sand Bottle",
    "Gummy Pirate Candies",
    "Harris Lamp",
    "Healthy Veggie Deluxe Sandwich",
    "Healing Gauze Pads",
    "Iced Soy Chai Latte",
    "Icy Snowball",
    "Inflatable Bouncy Pirate Ship",
    "Island Grarrl Plushie",
    "Island Pteri Plushie",
    "Island Usul Bubble Bath",
    "Jetsam Ace Action Figure",
    "Jug of Fresh Phearade",
    "Juicy Elixir",
    "Karate for Beginners",
    "Kazeriu",
    "Kora",
    "Kougra Tape Dispenser",
    "Kreludan Defender Plushie",
    "Legends of Maraqua",
    "Light Speed Made Easy",
    "Linae Stamp",
    "Lost Desert Architecture",
    "Lucky Pandaphant Doll",
    "Lurman",
    "Main Codestone Plushie",
    "Manacle Mace",
    "Maractite Mynci Sand Bottle",
    "Maraquan Bed Time Stories",
    "Maraquan Kacheek Plushie",
    "Marzipan Sugared Slorg",
    "Milk Chocolate Rose",
    "Mimbi",
    "Money Tree Window",
    "Moon and Star Stickies",
    "Mutant Petpet Foreground",
    "Native Mask",
    "Negg Latte",
    "Negg Noodles",
    "Neocola Book",
    "Niptor Plushie",
    "Noak",
    "Nupie",
    "Organic Bran Carrot Muffin",
    "Outdoor Pirate Flag",
    "Pale Elixir",
    "Pandaphant Puppet",
    "Paper Dagger",
    "Pawkeet Pencil Sharpener",
    "Peach Snowball",
    "Peophin Squirt Gun",
    "Pimplepepper",
    "Pirate Aisha Plushie",
    "Pirate Attack Stamp",
    "Pirate Flotsam Plushie",
    "Pirate Hook Candy Cane",
    "Pirate Ogrin Plushie",
    "Pirate Potato Crisps",
    "Pirate Small Talk",
    "Pirate Tonu Plushie",
    "Pirate Warning Sign",
    "Pirate Xweetok Plushie",
    "Pottery Shard Dagger",
    "Pretty Bouquet",
    "Princess Amira Balloon",
    "Pull Along Kougra",
    "Purple Hasee Plushie",
    "Purple Pull Along Tuskaninny",
    "Pygui Hand Puppet",
    "Pygui Nesting Dolls",
    "Quintilc Throwing Star",
    "Rainbow Grarrl Plushie",
    "Red Toadstool",
    "Regular Sand Smoothie",
    "Relaxing Shenkuu Rock Garden",
    "Rhuby Fruit",
    "Ridiculously Heavy Battle Hammer",
    "Ringed Scroll",
    "Robot Muffin",
    "Rocket Fizzy Drink",
    "Rocky Ocean Background",
    "Rolled Up Treasure Map",
    "Rotten Beetroot",
    "Rotten Egg Salad",
    "Rotten Negg and Onion Quesadilla",
    "Rotten Tomato Salad",
    "Royal Girl Zafara Plushie",
    "Ruki Balloon",
    "Scary Ink Frame",
    "Scorched Cheopple",
    "Scorched Gobi Fruit",
    "Scorched Rhuby",
    "Scorched Suti Fruit",
    "Scrambled Egg on Toast",
    "Scroll of the Sea",
    "Service Pet Vest",
    "Shenkuu Postcard",
    "Shenkuu Sushi Roll Magnet",
    "Silly Clown Usuki",
    "Skeith Inspired Treasure Maps",
    "Slime Covered Window",
    "Smelly Dung Muffin",
    "Snot Snake",
    "Snow Footbag",
    "Soothing Stones",
    "Space Faerie Cupcake",
    "Splime",
    "Spooky Nimmo Stained Glass Window",
    "Spooky Skull Perfume",
    "Squared Maractite Coin",
    "Squirty Selket Toy",
    "Starry Biscuit Jar",
    "Starry Crunch",
    "Starry Peophin Plushie",
    "Steel Snowball",
    "Stripy Spinning Top",
    "Strong Forever Glue",
    "Supernova",
    "Suti Fruit",
    "Symol",
    "Tablet of Water Runes",
    "Taco Salad",
    "Tai-Kai Codestone Plushie",
    "The Secret of Treasure Island",
    "Thermal Explosive Device",
    "Tiara of the Deep",
    "Tiki Bookmark",
    "Tiki Brochure",
    "Tiki Bucket of Sand",
    "Tiki Kite",
    "Tiny Edible Palm Trees",
    "Toad in a Hole",
    "Toy Pirate Hat",
    "Toy Pirate Sword",
    "Toy Scorchio Biscuit Thief",
    "Treasure Map Negg",
    "Turmac Snacks",
    "Tuskaninny Treasure",
    "Tuskaninny Yoyo",
    "Tyragh the Tyrannian Buzz",
    "Twisted Dark Dagger",
    "Ubikiberry Elixir",
    "Ultra Bubble Beam",
    "Ultranova",
    "Ummagine",
    "Undead Turnip",
    "Underwater Tour",
    "Valentines Bruce Plushie",
    "Vanilla Gnorbu Biscuit",
    "Vegetarian Meat Pie",
    "Very Rotten Tomato",
    "Vial of Pure Water",
    "Virtupets Energy Sabre",
    "Volcano Run II Puzzle",
    "Walking Cane with Spikes",
    "Water Faerie Halberd",
    "Water Faerie Water Blaster",
    "Weak Bottled Air Faerie",
    "Weak Bottled Earth Faerie",
    "Weak Bottled Fire Faerie",
    "Weak Bottled Water Faerie",
    "Weighted Blanket",
    "White Flosset Plushie",
    "White Squid Root",
    "Wind Up Red Draik Toy",
    "Wooden Korbat Bat and Ball Game",
    "Wooden Meepit Totem",
    "Wooden Paddleball Game",
    "Wooden Pirate Ship",
    "Wrapped Strawberry Candy",
    "Yellow Snowball",
    "Yoakie",
    "Yurble Puzzle",
    "Zargrold the COOL Bobblehead",
    "Zombie Bori Plushie",
    "Vegetarian Meat Pie",
    "Void Snowball",
    "Voidberry Pudding",
    "Voidberry Slushie",
    "Darkberry Cheese",
    "Amulet of Darkness",
    "Voidberry Potion",
];

const GIANT_SPACE_FUNGUS_DISCARD_ITEMS = [
    "Scroll of Supernova",
    "Scroll of Ultranova",
    "Nova",
    "Dark Nova",
    "Supernova",
    "Ultranova",
    "Flutter",
    "Gorunda the Wise",
    "Space Faerie Cereal",
    "Space Faerie Cupcake",
    "Starry Cookie Pile",
    "Starry Crunch",
    "Triple Tier Space Faerie Cake",
    "Starry Biscuit Jar",
    "Starry Box Kite",
    "Meteor Bomb",
    "Space Fungus Action Figure",
    "Space Fungus Sundae",
    "Baby Space Fungus"
]

const GIANT_SPACE_FUNGUS_SELL_ITEMS = [
    "Red Neocola Token",
    "Blue Neocola Token",
    "Green Neocola Token",
    "Scroll of Dark Nova",
    "Aluminium Nerkmid",
    "Average Nerkmid",
    "Basic Golden Nerkmid",
    "Basic Platinum Nerkmid",
    "Copper Nerkmid",
    "Golden Nerkmid X",
    "Golden Nerkmid XX",
    "Good Nerkmid",
    "Lesser Nerkmid",
    "Magical Golden Nerkmid",
    "Magical Platinum Nerkmid",
    "Normal Golden Nerkmid",
    "Normal Platinum Nerkmid",
    "Platinum Nerkmid X",
    "Platinum Nerkmid XX",
    "Super Nerkmid",
    "Ultimate Nerkmid",
    "Ultra Golden Nerkmid",
    "Ultra Nerkmid",
    "Ultra Platinum Nerkmid"
]

const GIANT_SPACE_FUNGUS_DEPOSIT_ITEMS = [
    "Bubbling Fungus",
    "Weak Bottled Light Faerie",
    "Unidentifiable Weak Bottled Faerie",
    "Weak Bottled Air Faerie",
    "Weak Bottled Dark Faerie",
    "Weak Bottled Earth Faerie",
    "Weak Bottled Fire Faerie",
    "Weak Bottled Light Faerie",
    "Weak Bottled Water Faerie"
]

const GRAVE_DANGER_RECYCLING_ITEMS = [
    "Gold Trimmed Tunic", // R96
    "Green Sticky Hand", // R96
    "Hand Painted Scimitar", // R98
    "Healing Potion XIX", // R96
    "Healing Potion XVIII", // R95
    "Ice Mirror", // R97
    "Jhudoras Cursed Coin", // R95
    "Leaded Earth Vial", //R98
    "Elephante Attack Peanut", // R95
    "Ghostkerchief Banjo", // R90
    "Black Velvet Cloak", // R96
    "Amber Sword", // R93
    "Casket Table", // R94
    "Deadly Attack Spork", // R96
    "Leaded Fire Vial", // R98
    "Light Acara Hood", // R97
    "Manacle Mace", // R96
    "Mint Chocolate Kacheek", // R90
    "Neovian Darkfall", // R92
    "Orange Gummy Stamp", // R90
    "Organ", // R91
    "Organic Peanut", // R90
    "Return of Dr. Sloth Valentine Card Set", //R92
    "Skeleton Wocky Plushie", // R90
    "Supersize Gargantuplex", // R97
    "Tablet of the Zombie", // R94
    "Tale of Woe Valentine Card Set", // R91
    "Terracotta Lamp", // R97
    "Tomato Bomb", // R91
    "Tootum", // R99
    "Tropical Flora and Fauna", // R92
    "Twirly Plant", // R98
    "Virtupets X-514 Super Shield", // R90
    "Walking Carpet Cotton Candy", // R90
    "Whole Anchovy Pizza", // R95
    "Whole Chilli Deluxe Pizza", // R94
    "Yellow Sticky Hand", // R94
    "Zombie Flotsam Plushie", // R93
    "Zombie Handbook", // R90
]

const GRAVE_DANGER_DEPOSIT_ITEMS = [
    "Grave Danger Stamp",
    "Indifferent Cultist Plushie",
    "Biyako Stamp",
    "Diamond Hot Dog",
    "Draphly",
    "Elegant Tea Service",
    "Glyme",
    "Minitheus",
    "Mootix",
    "Pumpkin Stick",
    "Springabee",
    "Strale",
    "Unidentified Petpetpet",
]

const GRAVE_DANGER_SELL_ITEMS = [
    "Dancing with Ghost Meepits",
    "Evil Cultist Plushie",
    "Friendly Cultist Plushie",
    "How to Win Staring Contests",
    "Babith",
    "Blue Xweetok Morphing Potion",
    "Carrot Sculpture", //R90
    "Chocolate Bearog Claw", // R90
    "Chocolate Cherry Bundt Cake", // R90
    "Cobrall In A Can", // R90
    "Coffee Service",
    "Dark Translucent Wings",
    "Doctors Bag",
    "Elixir of Intellect", // R98
    "Flask of Liquid Fire", // R94
    "Flask of Liquid Light", // R97
    "Ghoul Catchers", // R98
    "Halloween Ona Stamp",
    "Lutra",
    "Maraquan Petpet Paint Brush",
    "No Bones About It",
    "Starry Grarrl Morphing Potion",
    "Thicket of Flowers",
    "Wings of a Ghost",
    "Wraith Staff",
    "Zombie Grave Book",
]

const GRAVE_DANGER_DISCARD_ITEMS = [
    "Gelatinous Bouillon Non-Cube",
    "Grumblebug Pie",
    "One of Us Tea Cake",
    "Banjo",
    "Basket of Vegetables",
    "Blue Meerca Gnome Plushie",
    "Butterscotch Disc",
    "Buzz Gourmet",
    "Cave Foreground",
    "Cello",
    "Courgette Building Logs",
    "Fauna Stamp",
    "Ghost Goople",
    "Gilded War Hammer",
    "Gwontek Syrup",
    "Handful of Asparagus",
    "Happy Face Latte",
    "Meat Skewered Meat",
    "Minor Healing Ointment",
    "Niptor Plushie",
    "Potato Yo-Yo",
    "Pottery Shard Dagger",
    "Red Toadstool",
    "Sandy Body Wash",
    "Shield of the North Wind",
    "Slorg Care",
    "Snot Lotion",
    "Square Gelatin",
    "Tencals Balloon",
    "Virtupets Energy Sabre",
]

const VALUABLE_ITEM_CATEGORIES = [
    "Morphing Potion",
    "Paint Brush",
    "Transmogrification Potion",
    "Negg",
    "Dubloon Coin"
]

const GIANT_SPACE_FUNGUS_DROPS = GIANT_SPACE_FUNGUS_DEPOSIT_ITEMS.concat(
    GIANT_SPACE_FUNGUS_SELL_ITEMS, GIANT_SPACE_FUNGUS_DISCARD_ITEMS)

const UNDERWATER_FISHING_POOL = UNDERWATER_FISHING_DEPOSIT_ITEMS.concat(UNDERWATER_FISHING_SELL_ITEMS, UNDERWATER_FISHING_DISCARD_ITEMS)

const TVW_POOL = TVW_SELL_ITEMS.concat(TVW_DEPOSIT_ITEMS, TVW_DISCARD_ITEMS, TVW_RECYCLING_ITEMS)

const COINCIDENCE_POOL = COINCIDENCE_STANDARD_POOL_QUEST_ITEMS.concat(COINCIDENCE_ALTERNATIVE_POOL_QUEST_ITEMS)

const GRAVE_DANGER_POOL = GRAVE_DANGER_RECYCLING_ITEMS.concat(GRAVE_DANGER_SELL_ITEMS, GRAVE_DANGER_DEPOSIT_ITEMS, GRAVE_DANGER_DISCARD_ITEMS)

const DEPOSIT_ACTION = "deposit"
const DISCARD_ACTION = "discard"
const STOCK_ACTION = "stock"

// Colors
const COINCIDENCE_BLUE = '#a7fdff'
const CODESTONE_RED = '#d50000'
const CODESTONE_TAN = '#dbdb8c'
const GSF_PINK = '#b06165'
const UNDERWATER_FISHING = '#9d6dae'
const TVW_PURPLE = '#ff46ff'
const GRAVE_DANGER_GREY = '#74746c'
const RARE_ITEM = '#fdc92d' // morphing potion, transmog potion, paint brush
const FAERIE_FESTIVAL_PURPLE = '#febafe'

const STOCK_ITEM_LIST = TAN_CODESTONES.concat(GIANT_SPACE_FUNGUS_SELL_ITEMS,
                                              UNDERWATER_FISHING_SELL_ITEMS,
                                              TVW_SELL_ITEMS,
                                              GRAVE_DANGER_SELL_ITEMS)

const DEPOSIT_ITEM_LIST = COINCIDENCE_STANDARD_POOL_QUEST_ITEMS.concat(COINCIDENCE_ALTERNATIVE_POOL_QUEST_ITEMS,
                                                                       UNDERWATER_FISHING_DEPOSIT_ITEMS,
                                                                       RED_CODESTONES,
                                                                       DAILY_RECYCLING_ITEMS,
                                                                       GIANT_SPACE_FUNGUS_DEPOSIT_ITEMS,
                                                                       TVW_DEPOSIT_ITEMS,
                                                                       TVW_RECYCLING_ITEMS,
                                                                       GRAVE_DANGER_DEPOSIT_ITEMS,
                                                                       GRAVE_DANGER_RECYCLING_ITEMS)

const DISCARD_ITEM_LIST = GIANT_SPACE_FUNGUS_DISCARD_ITEMS.concat(UNDERWATER_FISHING_DISCARD_ITEMS,
                                                                  TVW_DISCARD_ITEMS,
                                                                  GRAVE_DANGER_DISCARD_ITEMS)

const d = document;


function shouldDepositItem(itemName) {
    return DEPOSIT_ITEM_LIST.find((element) => element == itemName) ||
        VALUABLE_ITEM_CATEGORIES.find((element) => itemName.endsWith(element))
}

function shouldStockItem(itemName) {
    return STOCK_ITEM_LIST.find((element) => element == itemName)
}

function shouldDiscardItem(itemName) {
    return DISCARD_ITEM_LIST.find((element) => element == itemName)
}

function selectAction(tableRow, action) {
     $(tableRow).find("input[value=" + action + "]").attr('checked', 'checked')
}

function highlightItem(tableRow, itemName) {
     if (COINCIDENCE_POOL.find((element) => element == itemName)) {
          $(tableRow).css('background-color', COINCIDENCE_BLUE)
     } else if (RED_CODESTONES.find((element) => element == itemName)) {
         $(tableRow).css('background-color', CODESTONE_RED)
     } else if (TAN_CODESTONES.find((element) => element == itemName)) {
         $(tableRow).css('background-color', CODESTONE_TAN)
     } else if (DAILY_RECYCLING_ITEMS.find((element) => element == itemName)) {
         $(tableRow).css('background-color', FAERIE_FESTIVAL_PURPLE)
     } else if (GIANT_SPACE_FUNGUS_DROPS.find((element) => element == itemName)) {
         $(tableRow).css('background-color', GSF_PINK)
     } else if (UNDERWATER_FISHING_POOL.find((element) => element == itemName)) {
         $(tableRow).css('background-color', UNDERWATER_FISHING)
     }  else if (TVW_POOL.find((element) => element == itemName)) {
         $(tableRow).css('background-color', TVW_PURPLE)
     }  else if (GRAVE_DANGER_POOL.find((element) => element == itemName)) {
         $(tableRow).css('background-color', GRAVE_DANGER_GREY)
     } else if (VALUABLE_ITEM_CATEGORIES.find((element) => itemName.endsWith(element))) {
         $(tableRow).css('background-color', RARE_ITEM)
     }
}

$(document).ready(function(){
        $('form[name="quickstock"] tr:not(:has(th))').not(':last').filter(function() {
            var itemName = $(this).find("td:eq(0)").text()

            highlightItem(this, itemName)

            // Items could be on multiple lists. Priority is to always preserve the item,
            // so an item is ONLY discarded if it is not in the stock or deposit list.
            // Basically...deposit > stock > discard
            if (shouldDiscardItem(itemName)) {
                selectAction(this, DISCARD_ACTION)
            }

            if (shouldStockItem(itemName)) {
                selectAction(this, STOCK_ACTION)
            }

            if (shouldDepositItem(itemName)) {
                selectAction(this, DEPOSIT_ACTION);
            }
        });
});
