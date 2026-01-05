// ==UserScript==
// @author        Xiphias[187717]
// @name          Torn City - Extended Top Bar Search by Xiphias[187717]
// @description   This script adds useful search functions to the top bar.
// @include       http://www.torn.com/*
// @include       http://torn.com/*
// @include       https://www.torn.com/*
// @include       https://torn.com/*
// @version       0.60.3
// @namespace     https://greasyfork.org/users/3898
// @downloadURL https://update.greasyfork.org/scripts/3627/Torn%20City%20-%20Extended%20Top%20Bar%20Search%20by%20Xiphias%5B187717%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/3627/Torn%20City%20-%20Extended%20Top%20Bar%20Search%20by%20Xiphias%5B187717%5D.meta.js
// ==/UserScript==

/***************** Initialize Variables ***********************/
window.availableItems = ["Hammer", "Baseball Bat", "Crow Bar", "Knuckle Dusters", "Pen Knife", "Kitchen Knife", "Dagger", "Axe", "Scimitar", "Chainsaw", "Samurai Sword", "Glock 18", "Raven MP25", "Ruger 22/45", "M-9", "USP", "Beretta 92FS", "Fiveseven", "Magnum", "Desert Eagle", "Dual 96G Berettas", "Sawed-Off Shotgun", "Benelli M1 Tactical", "MP5 Navy", "P90", "AK-47", "M4A1 Colt Carbine", "Benelli M4 Super", "M16 A2 Rifle", "Steyr AUG", "M249 PARA LMG", "Leather Vest", "Riot Gear", "Bulletproof Vest", "Box of Chocolate Bars", "Big Box of Chocolate Bars", "Bag of Bon Bons", "Box of Bon Bons", "Box of Extra Strong Mints", "Pack of Music CDs", "DVD Player", "MP3 Player", "CD Player", "Pack of Blank CDs", "Hard Drive", "Tank Top", "Pair of Trainers", "Jacket", "Full Body Armour", "Outer Tactical Vest", "Plain Silver Ring", "Sapphire Ring", "Gold Ring", "Diamond Ring", "Pearl Necklace", "Silver Necklace", "Gold Necklace", "Plastic Watch", "Stainless Steel Watch", "Gold Watch", "Personal Computer", "Microwave", "Minigun", "Pack of Cuban Cigars", "Big TV Screen", "Morphine", "First Aid Kit", "Small First Aid Kit", "Simple Virus", "Polymorphic Virus", "Tunnelling Virus", "Armored Virus", "Stealth Virus", "Santa Hat 2004", "Christmas Cracker 2004", "Snow Cannon", "Toyota MR2", "Honda NSX", "Audi TT Quattro", "BMW M5", "BMW Z8", "Chevrolet Corvette Z06", "Dodge Charger", "Firebird", "Ford GT40", "Hummer H3", "Audi S4", "Honda Integra R", "Honda Accord", "Honda Civic", "Volkswagen Beetle", "Chevrolet Cavalier", "Ford Mustang", "Reliant Robin", "Holden SS", "Coat Hanger", "Bunch of Flowers", "Neutrilux 2000", "Springfield 1911-A1", "Egg Propelled Launcher", "Bunny Fur", "Chocolate Egg 2005", "Firewalk Virus", "Playstation", "Xbox", "Parachute", "Kevlar Trench Coat", "9mm Uzi", "RPG Launcher", "Leather Bull Whip", "Ninja Claws", "Test Trophy", "Pet Rock", "Non-Anon Doll", "Poker Doll", "Yoda Figurine", "Trojan Horse", "Evil Doll", "Rubber Ducky of Doom", "Teppic Bear", "RockerHead Doll", "Mouser Doll", "Elite Action Man", "Toy Reactor", "Royal Doll", "Blue Dragon", "China Tea Set", "Mufasa Toy", "Dozen Roses", "Skanky Doll", "Lego Hurin", "Mystical Sphere", "10 Ton Pacifier", "Horse", "Uriels Speakers", "Strife Clown", "Locked Teddy", "Riddles Bat", "Soup Nazi Doll", "Pouncer Doll", "Spammer Doll", "Cookie Jar", "Vanity Mirror", "Banana Phone", "Xbox 360", "Yasukuni Sword", "Rusty Sword", "Dance Toy", "Lucky Dime", "Crystal Carousel", "Pixie Sticks", "Ice Sculpture", "Case of Whiskey", "Laptop", "Purple Frog Doll", "Skeleton Key", "Patriot Whip", "Statue Of Aeolus", "Bolt Cutters", "Photographs", "Black Unicorn", "WarPaint Kit", "Official Ninja Kit", "Leukaemia TeddyBear", "Chocobo Flute", "Annoying Man", "Article on Crime", "Unknown", "Barbie Doll", "Wand of Destruction", "Jack-O-Lantern 2005", "Gas Can", "Butterfly Knife", "XM8 Rifle", "Taser", "Chain Mail", "Cobra Derringer", "Flak Jacket", "Birthday Cake 2005", "Bottle of Beer", "Bottle of Champagne", "Soap on a Rope", "Single Red Rose", "Bunch of Black Roses", "Bunch of Balloons 2005", "Sheep Plushie", "Teddy Bear Plushie", "Cracked Crystal Ball", "S&W Revolver", "C4 Explosive", "Memory Locket", "Rainbow Stud Earring", "Hamster Toy", "Snowflake 2005", "Christmas Tree 2005", "Cannabis", "Ecstasy", "Ketamine", "LSD", "Opium", "PCP", "Mr Torn 2007 Crown", "Shrooms", "Speed", "Vicodin", "Xanax", "Miss Torn 2007 Crown", "Unknown", "Box of Sweet Hearts", "Bag of Chocolate Kisses", "Crazy Cow", "Legends Urn", "Dreamcatcher", "Brutus Keychain", "Kitten Plushie", "Single White Rose", "Claymore Sword", "Crossbow", "Enfield SA-80", "Grenade", "Stick Grenade", "Flash Grenade", "Jackhammer", "Swiss Army Knife", "Mag 7", "Smoke Grenade", "Spear", "Vektor CR-21", "Claymore Mine", "Flare Gun", "Heckler & Koch SL8", "Sig 550", "BT MP9", "Chain Whip", "Wooden Nunchucks", "Kama", "Kodachi Swords", "Sai", "Ninja Stars", "Anti Tank", "Bushmaster Carbon 15 Type 21s", "HEG", "Taurus", "Blowgun", "Bo Staff", "Fireworks", "Katana", "Qsz-92", "Sks Carbine", "Twin Tiger Hooks", "Wushu Double Axes", "Ithaca 37", "Lorcin 380", "S&W M29", "Flame Thrower", "Tear Gas", "Throwing Knife", "Jaguar Plushie", "Mayan Statue", "Dahlia", "Wolverine Plushie", "Hockey Stick", "Crocus", "Orchid", "Pele Charm", "Nessie Plushie", "Heather", "Red Fox Plushie", "Monkey Plushie", "Soccer Ball", "Ceibo Flower", "Edelweiss", "Chamois Plushie", "Panda Plushie", "Jade Buddha", "Peony", "Cherry Blossom", "Kabuki Mask", "Maneki Neko", "Elephant Statue", "Lion Plushie", "African Violet", "Donator Pack", "Bronze Paint Brush", "Silver Paint Brush", "Gold Paint Brush", "Pand0ras Box", "Mr Brownstone Doll", "Dual Axes", "Dual Hammers", "Dual Scimitars", "Dual Samurai Swords", "Japanese/English Dictionary", "Bottle of Sake", "Oriental Log", "Oriental Log Translation", "YouYou Yo Yo", "Monkey Cuffs", "Jesters Cap", "Gibals Dragonfly", "Red Ornament", "Blue Ornament", "Green Ornament", "Purple Bell", "Mistletoe", "Mini Sleigh", "Snowman", "Christmas Gnome", "Gingerbread House", "Lollipop", "Mardi Gras Beads", "Devil Toy", "Cookie Launcher", "Cursed Moon Pendant", "Apartment Blueprint", "Semi-Detached House Blueprint", "Detached House Blueprint", "Beach House Blueprint", "Chalet Blueprint", "Villa Blueprint", "Penthouse Blueprint", "Mansion Blueprint", "Ranch Blueprint", "Palace Blueprint", "Castle Blueprint", "Printing Paper", "Blank Tokens", "Blank Credit Cards", "Skateboard", "Boxing Gloves", "Dumbbells", "Improved Interceptor Vest", "Liquid Body Armour", "Flexible Body Armour", "Stick of Dynamite", "Cesium-137", "Dirty Bomb", "Sh0rtys Surfboard", "Puzzle piece", "Hunny Pot", "Seductive Stethoscope", "Dollar Bill Collectible", "Backstage Pass", "Chemis Magic Potion", "Pack of Trogins", "Pair of High Heels", "Thong", "Hazmat Suit", "Flea Collar", "Dunkins Donut", "Amazon Doll", "BBQ Smoker", "Bag of Cheetos", "Motorbike", "Citrus Squeezer", "Superman Shades", "Kevlar Helmet", "Raw Ivory", "Fine Chisel", "Ivory Walking Cane", "Neumune Tablet", "Mr Torn 2008 Crown", "Miss Torn 2008 Crown", "Box of Grenades", "Box of Medical Supplies", "Erotic DVD", "Feathery Hotel Coupon", "Lawyer Business Card", "Lottery Voucher", "Drug Pack", "Dark Doll", "Empty Box", "Parcel", "Birthday Present", "Present", "Christmas Present", "Birthday Wrapping Paper", "Generic Wrapping Paper", "Christmas Wrapping Paper", "Small Explosive Device", "Gold Laptop", "Gold Plated AK-47", "Platinum PDA", "Camel Plushie", "Tribulus Omanense", "Sports Sneakers", "Handbag", "Pink Mac-10", "Mr Torn 2009 Crown", "Miss Torn 2009 Crown", "Macana", "Pepper Spray", "Slingshot", "Brick", "Nunchakas", "Business Class Ticket", "Mace", "Swiss Army SG 550", "ArmaLite M-15A4 Rifle", "Guandao", "Lead Pipe", "Ice Pick", "Box of Tissues", "Bandana", "Loaf of Bread", "Afro Comb", "Compass", "Sextant", "Yucca Plant", "Fire Hydrant", "Model Space Ship", "Sports Shades", "Mountie Hat", "Proda Sunglasses", "Ship in a Bottle", "Paper Weight", "RS232 Cable", "Tailors Dummy", "Small Suitcase", "Medium Suitcase", "Large Suitcase", "Vanity Hand Mirror", "Poker Chip", "Rabbit Foot", "Voodoo Doll", "Bottle of Tequila", "Sumo Doll", "Casino Pass", "Chopsticks", "Coconut Bra", "Dart Board", "Crazy Straw", "Sensu", "Yakitori Lantern", "Dozen White Roses", "Snowboard", "Glow stick", "Cricket Bat", "Frying Pan", "Pillow", "Khinkeh P0rnStar Doll", "Blow-Up Doll", "Strawberry Milkshake", "Breadfan Doll", "Chaos Man", "Karate Man", "Burmese Flag", "Bl0ndies Dictionary", "Hydroponic Grow Tent", "Leopard Coin", "Florin Coin", "Gold Noble Coin", "Ganesha Sculpture", "Vairocana Buddha Sculpture", "Script from the Quran: Ibn Masud", "Script from the Quran: Ubay Ibn Kab", "Script from the Quran: Ali", "Shabti Sculpture", "Egyptian Amulet", "White Senet Pawn", "Black Senet Pawn", "Senet Board", "Epinephrine", "Melatonin", "Serotonin", "Snow Globe 2009", "Dancing Santa Claus 2009", "Christmas Stocking 2009", "Santas Elf 2009", "Christmas Card 2009", "Admin Portrait 2009", "Blue Easter Egg", "Green Easter Egg", "Red Easter Egg", "Yellow Easter Egg", "White Easter Egg", "Black Easter Egg", "Gold Easter Egg", "Metal Dog Tag", "Bronze Dog Tag", "Silver Dog Tag", "Gold Dog Tag", "MP5k", "AK74u", "Skorpian", "TMP", "Thompson", "MP 40", "Luger", "Blunderbuss", "Zombie Brain", "Human Head", "Medal of Honor", "Citroen Saxo", "Classic Mini", "Fiat Punto", "Nissan Micra", "Peugeot 106", "Renault Clio", "Vauxhall Corsa", "Volvo 850", "Alfa Romeo 156", "BMW X5", "Seat Leon Cupra", "Vauxhall Astra GSI", "Volkswagen Golf GTI", "Audi S3", "Ford Focus RS", "Honda S2000", "Mini Cooper S", "Ford Cosworth", "Lotus Exige", "Mitsubishi Evo X", "Porsche 911 GT3", "Subaru Impreza STI", "TVR Sagaris", "Aston Martin One-77", "Audi R8", "Bugatti Veyron", "Ferrari 458", "Lamborghini Gallardo", "Lexus LFA", "Mercedes SLR", "Nissan GT-R", "Mr Torn 2010 Crown", "Miss Torn 2010 Crown", "Bag of Candy Kisses", "Bag of Tootsie Rolls", "Bag of Chocolate Truffles", "Can of Munster", "Bottle of Pumpkin Brew", "Can of Red Cow", "Can of Tourine Elite", "Witches Cauldron", "Electronic Pumpkin", "Jack O Lantern Lamp", "Spooky Paper Weight", "Silver Armour", "Blood Spattered Sickle", "Cauldron", "Bottle of Stinky Swamp Punch", "Bottle of Wicked Witch", "Deputy Star", "Wind Proof Lighter", "Dual TMPs", "Dual Bushmasters", "Dual MP5s", "Dual P90s", "Dual Uzis", "Bottle of Kandy Kane", "Bottle of Minty Mayhem", "Bottle of Mistletoe Madness", "Can of Santa Shooters", "Can of Rockstar Rudolph", "Can of X-MASS", "Bag of Reindeer Droppings", "Advent Calendar", "Santas Snot", "Polar Bear Toy", "Fruitcake", "Book of Carols", "Sweater", "Gift Card", "Pair of Glasses", "High-Speed DVD Drive", "Mountain Bike", "Cut-Throat Razor", "Slim Crowbar", "Balaclava", "Advanced Driving Tactics", "Ergonomic Keyboard", "Tracking Device ", "Screwdriver", "Fanny Pack", "Tumble Dryer", "Chloroform", "Heavy Duty Padlock", "Duct Tape", "Wireless Dongle", "Horses Head", "Book", "Tin Foil Hat", "Brown Easter Egg", "Orange Easter Egg", "Pink Easter Egg", "Jawbreaker", "Bag of Sherbet", "Goodie Bag", "Undefined", "Undefined 2", "Undefined 3", "Undefined 4", "Mr Torn 2011 Crown", "Miss Torn 2011 Crown", "Pile of Vomit", "Rusty Dog Tag", "Gold Nugget", "Witches Hat", "Golden Broomstick", "Devils Pitchfork", "Christmas Lights", "Gingerbread Man", "Golden Wreath", "Pair of Ice Skates", "Diamond Icicle", "Santa Boots", "Santa Gloves", "Santa Hat", "Santa Jacket", "Santa Trousers", "Snowball", "Tavor TAR-21", "Harpoon", "Diamond Bladed Knife", "Naval Cutlass Sword", "Trout", "Banana Orchid", "Stingray Plushie", "Steel Drum", "Nodding Turtle", "Snorkel", "Flippers", "Speedo", "Bikini", "Wetsuit", "Diving Gloves", "Dog Poop", "Stink Bombs", "Toilet Paper", "Mr Torn 2012 Crown", "Miss Torn 2012 Crown", "Petrified Humerus", "Latex Gloves", "Bag of Bloody Eyeballs", "Straitjacket", "Cinnamon Ornament", "Christmas Express", "Bottle of Christmas Cocktail", "Golden Candy Cane", "Kevlar Gloves", "WWII Helmet", "Motorcycle Helmet", "Construction Helmet", "Welding Helmet", "Safety Boots", "Hiking Boots", "Leather Helmet", "Leather Pants", "Leather Boots", "Leather Gloves", "Combat Helmet", "Combat Pants", "Combat Boots", "Combat Gloves", "Riot Helmet", "Riot Body", "Riot Pants", "Riot Boots", "Riot Gloves", "Dune Helmet", "Dune Body", "Dune Pants", "Dune Boots", "Dune Gloves", "Assault Helmet", "Assault Body", "Assault Pants", "Assault Boots", "Assault Gloves", "Delta Gas Mask", "Delta Body", "Delta Pants", "Delta Boots", "Delta Gloves", "Ballistic Face Mask", "Ballistic Body", "Ballistic Pants", "Ballistic Boots", "Ballistic Gloves", "EOD Helmet", "EOD Apron", "EOD Pants", "EOD Boots", "EOD Gloves", "Torn Bible", "Friendly Bot Guide", "Egotistical Bear", "Brewery Key", "Signed Jersey", "Mafia Kit", "Octopus Toy", "Bear Skin Rug", "Tractor Toy", "Mr Torn 2013 Crown", "Miss Torn 2013 Crown", "Piece of Cake", "Rotten Eggs", "Peg Leg", "Antidote", "Christmas Angel", "Eggnog", "Sprig of Holly", "Festive Socks", "Respo Hoodie", "Staff Haxx Button"];
window.availableItems.sort();

window.availablePlaces = {
	"ammo locker" : "/ammo.php",
	"auction house" : "/amarket.php",
	"awards" : "/awards.php",
	"bank" : "/bank.php",
	"bazaar" : "/bazaar.php",
	"big al's gun shop" : "/bigalgunshop.php",
	"bits 'n' bobs" : "/shops.php?step=bitsnbobs",

	"casino" : "/casino.php",
	"casino: blackjack" : "/blackjack.php",
	"casino: bookie" : "/bookie.php",
	"casino: chess" : "/loader.php?sid=chessgame&step=showgames",
	"casino: craps" : "/loader.php?sid=craps",
	"casino: high/low" : "/loader.php?sid=highlow",
	"casino: keno" : "/loader.php?sid=keno",
	"casino: lottery" : "/loader.php?sid=lottery",
	"casino: poker" : "/poker.php",
	"casino: roulette" : "/loader.php?sid=roulette",
	"casino: slots" : "/loader.php?sid=slots",

	"church" : "/church.php",
	"city hall" : "/citystats.php",
	"city" : "/city.php",
	"committee" : "/committee.php",
	"community center" : "/fans.php",
	"company" : "/companies.php",
	"company: newsletter" : "/companies.php?step=newsletter",
	"contact" : "/contact/",
	"crimes" : "/crimes.php",
	"criminal record" : "/crimes.php?step=criminalrecords&ajax_load=true&rfcv=" + getCookie('rfc_v'),
	"cyber force" : "/shops.php?step=cyberforce",
	"display cabinet" : "/displaycase.php",
	"docks" : "/shops.php?step=docks",
	"donator house" : "/donator.php",
	"dump" : "/dump.php",
	"education" : "/education.php",
	"enemies" : "/blacklist.php",
	"estate agents" : "/estateagents.php",
	"events" : "/events.php#/step=all",

	"my faction" : "/factions.php?step=your#/tab=main",

	"my faction: armoury" : "/factions.php?step=your#/tab=armoury",
	"my faction: controls" : "/factions.php?step=your#/tab=controls",
	"my faction: crimes" : "/factions.php?step=your#/tab=crimes",
	"my faction: forum" : "/factions.php?step=your#/tab=forum",
	"my faction: info" : "/factions.php?step=your#/tab=info",
	"my faction: rank" : "/factions.php?step=your#/tab=rank",

	"faction control center" : "/factions.php",
	"faction lists" : "/factions.php?step=listing",

	"forums" : "/forums.php",
	"friends" : "/friendlist.php",
	"gym" : "/gym.php",
	"hall of fame" : "/halloffame.php",
	"help" : "/wiki",
	"home" : "/index.php",
	"hospital" : "/hospitalview.php",
	"item market" : "/imarket.php",
	"items" : "/item.php",
	"jail" : "/jailview.php",
	"jewelry store" : "/shops.php?step=jewelry",
	"job" : "/companies.php",
	"loan shark" : "/loan.php",
	"notebook" : "/notebook.php",

	"mailbox: inbox" : "/messages.php#/p=inbox",
	"mailbox: compose" : "/messages.php#/p=compose",
	"mailbox: outbox" : "/messages.php#/p=outbox",
	"mailbox: saved" : "/messages.php#/p=saved",
	"mailbox: ignore list" : "/messages.php#/p=ignorelist",

	"message inc" : "/messageinc.php",
	"missions" : "/loader.php?sid=missions",
	"msg inc" : "/messageinc.php",
	"museum" : "/museum.php",

	"newspaper" : "/newspaper.php",
	"newspaper: bounties" : "/bounties.php#!p=main",
	"newspaper: chronicles" : "/chronicles.php#!p=main",
	"newspaper: classified ads" : "/newspaper_class.php",
	"newspaper: comics" : "/comics.php#!p=main",
	"newspaper: freebies" : "/freebies.php#!p=main",
	"newspaper: job listing" : "/joblist.php#!p=main",
	"newspaper: personals" : "/personals.php#!p=main",

	"nikeh sports" : "/shops.php?step=nikeh",
	"pawn shop" : "/shops.php?step=pawnshop",

	"personal computer" : "/pc.php",
	"pc" : "/pc.php",

	"personal stats" : "/personalstats.php",
	"pharmacy" : "/shops.php?step=pharmacy",

	"player report" : "/playerreport.php",

	"points building" : "/points.php",
	"points market" : "/pmarket.php",
	"post office" : "/shops.php?step=postoffice",
	"preferences" : "/preferences.php",
	"properties" : "/properties.php",
	"race track" : "/loader.php?sid=racing",
	"recruits citizens" : "/bringafriend.php",
	"sally's sweet shop" : "/shops.php?step=candy",
	"staff" : "/staff.php",
	"stock exchange" : "/stockexchange.php",
	"super store" : "/shops.php?step=super",
	"tc clothing" : "/shops.php?step=clothes",
	"trades" : "/trade.php",
	"travel agency" : "/travelagency.php",
	"view detailed stats" : "/personalstats.php",
	"visitor center" : "/wiki",
	"wiki" : "/wiki",
	"your gallery" : "/userimages.php?XID=" + getCookie('uid'),
	"your portfolio" : "/stockexchange.php?step=portfolio",
	"your profile" : "/profiles.php?XID=" + getCookie('uid'),
	// Main forums
	"forum: achievements" : "/forums.php?p=forums&f=16&b=0&a=0",
	"forum: announcements" : "/forums.php?p=forums&f=1&b=0&a=0",
	"forum: bugs & issues" : "/forums.php?p=forums&f=19&b=0&a=0",
	"forum: company discussion" : "/forums.php?p=forums&f=20&b=0&a=0",
	"forum: company recruitment" : "/forums.php?p=forums&f=46&b=0&a=0",
	"forum: donator forum" : "/forums.php?p=forums&f=8&b=0&a=0",
	"forum: faction discussion" : "/forums.php?p=forums&f=9&b=0&a=0",
	"forum: faction recruitment" : "/forums.php?p=forums&f=24&b=0&a=0",
	"forum: fun & games" : "/forums.php?p=forums&f=13&b=0&a=0",
	"forum: gambling" : "/forums.php?p=forums&f=15&b=0&a=0",
	"forum: general discussion" : "/forums.php?p=forums&f=2&b=0&a=0",
	"forum: graphics" : "/forums.php?p=forums&f=23&b=0&a=0",
	"forum: graveyard" : "/forums.php?p=forums&f=17&b=0&a=0",
	"forum: IRC general" : "/forums.php?p=forums&f=14&b=0&a=0",
	"forum: missions" : "/forums.php?p=forums&f=47&b=0&a=0",
	"forum: properties" : "/forums.php?p=forums&f=22&b=0&a=0",
	"forum: questions & answers" : "/forums.php?p=forums&f=3&b=0&a=0",
	"forum: racing" : "/forums.php?p=forums&f=21&b=0&a=0",
	"forum: stock market" : "/forums.php?p=forums&f=11&b=0&a=0",
	"forum: suggestions" : "/forums.php?p=forums&f=4&b=0&a=0",
	"forum: trading post" : "/forums.php?p=forums&f=10&b=0&a=0",
	// Non Related Forums
	"forum: animals & nature" : "/forums.php?p=forums&f=55&b=0&a=0",
	"forum: art & litterature" : "/forums.php?p=forums&f=49&b=0&a=0",
	"forum: food & cooking" : "/forums.php?p=forums&f=54&b=0&a=0",
	"forum: gaming non-related" : "/forums.php?p=forums&f=6&b=0&a=0",
	"forum: gaming" : "/forums.php?p=forums&f=40&b=0&a=0",
	"forum: health & fitness" : "/forums.php?p=forums&f=39&b=0&a=0",
	"forum: hobbies & interests" : "/forums.php?p=forums&f=52&b=0&a=0",
	"forum: motoring" : "/forums.php?p=forums&f=51&b=0&a=0",
	"forum: music" : "/forums.php?p=forums&f=41&b=0&a=0",
	"forum: paranormal" : "/forums.php?p=forums&f=53&b=0&a=0",
	"forum: politics & law" : "/forums.php?p=forums&f=38&b=0&a=0",
	"forum: roleplay" : "/forums.php?p=forums&f=7&b=0&a=0",
	"forum: science" : "/forums.php?p=forums&f=50&b=0&a=0",
	"forum: sports" : "/forums.php?p=forums&f=37&b=0&a=0",
	"forum: technology" : "/forums.php?p=forums&f=36&b=0&a=0",
	"forum: travel & culture" : "/forums.php?p=forums&f=56&b=0&a=0",
	"forum: tv & movies" : "/forums.php?p=forums&f=35&b=0&a=0"

};

window.forumSearchOptions = {
	"All Forums" : "0",
	"My Faction" : "999",
	"My Company" : "999",
	"Donator Forum" : "8",
	"Announcements" : "1",
	"Gaming" : "40",
	"General Non-related" : "6",
	"Music" : "41",
	"TV & Movies" : "35",
	"Paranormal" : "53",
	"Politics & Law" : "38",
	"Health & Fitness" : "39",
	"Sports" : "37",
	"Food & Cooking" : "54",
	"Technology" : "36",
	"Hobbies & Interests" : "52",
	"Science" : "50",
	"Art & Literature" : "49",
	"Motoring" : "51",
	"Animals & Nature" : "55",
	"Roleplay" : "7",
	"Travel & Culture" : "56",
	"General Discussion" : "2",
	"Questions & Answers" : "3",
	"Trading Post" : "10",
	"Fun & Games" : "13",
	"Achievements" : "16",
	"Faction Discussion" : "9",
	"Faction Recruitment" : "24",
	"Company Discussion" : "20",
	"Company Recruitment" : "46",
	"Stock Market" : "11",
	"Properties" : "22",
	"Gambling" : "15",
	"Racing" : "21",
	"Missions" : "47",
	"Graphics" : "23",
	"IRC General" : "14",
	"Bugs & Issues" : "19",
	"Suggestions" : "4",
	"Graveyard" : "17"
}

window.forumTopicsAndPosts = {
	"Posts & Topics" : "0",
	"Topics only" : "1",
	"Posts only" : "2"
}

var myFactionTabs = {
	"#/tab=rank" : "#faction-rank",
	"#/tab=info" : "#faction-info",
	"#/tab=armoury" : "#faction-armoury",
	"#/tab=controls" : "#faction-controls",
	"#/tab=forum" : "#faction-forum",
	"#/tab=crimes" : "#faction-crimes",
	"#/tab=main" : "#faction-main"
};

window.availableSearchOptions = {
	"Name" : "usersearch", //original is "playername" but this is overwritten to "usersearch" to avoid some search fuctions by Torn.
	"User ID" : "userID",
	"Faction" : "faction",
	"Company" : "company",
	"Forum posts" : "forumextended", //original is "forum" but this is overwritten to "forumextended" to avoid some search fuctions by Torn.
	"Help Wiki" : "wiki"
};

var options = {
    "itemMarketSearch": false,
        "placesSearch": false,
        "nameSearch": false,
        "forumSearch": false
};

window.functionDisabled = false;
function functionCallableDelay() {
    window.functionDisabled = true;
    setTimeout(function() {
        window.functionDisabled = false;
    }, 500);
}

/***************** Helper Functions ***********************/
function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

/**
 * Sort a select menu's options.
 */
function NASort(a, b) {    
    if (a.innerHTML == 'NA') {
        return 1;   
    }
    else if (b.innerHTML == 'NA') {
        return -1;   
    }       
    return (a.innerHTML > b.innerHTML) ? 1 : -1;
};

function getKeys(obj) {
	var keys = [];
	for (var k in obj)
		keys.push(toTitleCase(k));
	return keys;
}

function setValue(key, val) {
	localStorage.setItem(key, val);
}

function getValue(key) {
	var item = localStorage.getItem(key);
	if (item) {
		return item;
	} else {
		return "";
	}
}



function setOptionBoolean(property) {
    options["itemMarketSearch"] = false;
    options["placesSearch"] = false;
    options["nameSearch"] = false;
    options["forumSearch"] = false;

    if (options.hasOwnProperty(property)) {
        options[property] = true;
    }
}

function addKeyboardShortcut() {
	(function () {
		document.addEventListener('keydown', function (e) {
			// pressed alt+g
			if (e.keyCode == 71 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
				setTimeout(function () {
					$("#userword").focus().setSelectionRange(0, 0);
				}, 50);
			}
		}, false);
	})();
}

function changeSelectMenuOptionValue(selectMenuId, oldOption, newOption) {
	$("#" + selectMenuId + " option[value='" + oldOption + "']").val(newOption);
	$("#" + selectMenuId).selectmenu(); // Refresh the selectmenu widget
}

/**
 * Adds a new option to the search. The new option is placed first in the list.
 */
function addSearchOption(option) {

	var search_type = document.getElementById('search-type');
	var item_option = document.createElement('option');
	item_option.setAttribute('value', option);
	item_option.innerHTML = toTitleCase(option);
	var name_option = search_type.firstChild;
	search_type.insertBefore(item_option, name_option);

	window.availableSearchOptions[toTitleCase(option)] = option; // Add new option to available options
	$('#search-type').selectmenu(); // Refresh the selectmenu widget, Thanks  Mauk[1494436].
}

/**
 * Save the last used search option to local storage.
 */
function saveLastUsedSearchOption(searchOption) {
	try {
		setValue('lastUsedSearchOption', searchOption);
	} catch (error) {
		console.log(error);
	}
}

function enableSaveOptionOnChange() {
	try {
		$('#search-type').on('change', function () {
			var searchMenu = document.getElementById('search-type');
			var selectedSearchOption = searchMenu.options[searchMenu.selectedIndex].text;
			saveLastUsedSearchOption(selectedSearchOption);
		});
	} catch (error) {
		console.log(error);
	}
}

/**
 * Sets the last used select-menu item as the default.
 */
function setLastUsedSearchOption() {
	$(document).ready(function () {
		try {
			var lastUsedSearchOption = getValue('lastUsedSearchOption');
			var searchOption = window.availableSearchOptions[lastUsedSearchOption];

			document.getElementById("search-type-button").firstChild.innerHTML = lastUsedSearchOption;
			$('#search-type').val(searchOption);

			var instance = $('#userword').attr('id');
			var $instance = $("#" + instance);

			if (lastUsedSearchOption == "Item Market") {

				setOptionBoolean("itemMarketSearch");

				addPlaceAndItemMarketAutocomplete();

				$instance.autocomplete('enable');
				$instance.attr('autocomplete', 'off');

			} else if (lastUsedSearchOption == "Place") {

				setOptionBoolean("placesSearch");

				addPlaceAndItemMarketAutocomplete();

				$instance.autocomplete('enable');
				$instance.attr('autocomplete', 'off');

			} else if (lastUsedSearchOption == "Name") {

                setOptionBoolean("nameSearch");

				removeAutocomplete("userword");

				$(document).ready(function () {
					initializeAutocompleteSearch();
				});

				$instance.attr('autocomplete', 'off');
				$('#userword-topbar-cont .scrollbar').addClass('disable');

			} else if (lastUsedSearchOption == "Forum posts") {

				setOptionBoolean("forumSearch");

			}

		} catch (error) {
			console.log(error);
		}
	});
}

/**
 * Add a click function to the Search icon. So you can search by clicking the icon.
 */
function addIconClickSearch() {
	$(document).ready(function () {
		$('input.search').click(function () {
            
            if (!window.functionDisabled) {
                if (options.itemMarketSearch) {
                    searchForItem();
                } else if (options.placesSearch) {
                    goPlaces();
                } else if (options.nameSearch) {
                    searchForUser();
                } else if (options.forumSearch) {
                    searchForum();
                }
            }
            functionCallableDelay();
		});
	});
}

function addSearchFunctions() {

	// Enable new search options on change.
	document.getElementById("search-type").onchange = function () {

		var instance = $('#userword').attr('id');
		var $instance = $("#" + instance);

		var sheet = this.value.toLowerCase();

		if (sheet == "item market") {

            setOptionBoolean("itemMarketSearch");
            
			addPlaceAndItemMarketAutocomplete();

			$instance.autocomplete('enable');
			$instance.attr('autocomplete', 'off');

		} else if (sheet == "place") {

            setOptionBoolean("placesSearch");
            
			addPlaceAndItemMarketAutocomplete();
			$instance.autocomplete('enable');
			$instance.attr('autocomplete', 'off');

		} else if (sheet == "playername" || sheet == "usersearch") {

            setOptionBoolean("nameSearch");

			removeAutocomplete("userword");

			$(document).ready(function () {
				initializeAutocompleteSearch();
			});
			$instance.autocomplete('enable');
			$instance.attr('autocomplete', 'off');
			$('#userword-topbar-cont .scrollbar').addClass('disable');

		} else if (sheet == "forum" || sheet == "forumextended") {

            setOptionBoolean("forumSearch");

		} else {

            setOptionBoolean("set all false");

			$instance.autocomplete('disable');
			$instance.attr('autocomplete', 'on');
		}

		if (sheet != "playername" && sheet != "usersearch") {

			$("#userword-topbar-cont").hide();
			$("#userword-topbar-cont").tinyscrollbar({
				scroll : false
			});
			$instance.removeClass('open');
			$("#userword-topbar-cont").removeClass('open');

			$('#userword-topbar-cont .scrollbar').addClass('disable');
		}

		if (sheet != "forum" && sheet != "forumextended") {
			$("#forum-search-container").hide();
		}

		return false;
	};
}

/**
 * Search for the item in the Item Market.
 */
function searchForItem() {
    
    if (!window.functionDisabled) {
        var item_name = document.getElementById('userword').value;
        var item_search_url = 'http://www.torn.com/imarket.php#/p=shop&step=shop&searchname=';
        item_name = item_name.replace('Script from the Quran: ', ''); // There is a bug in the item market. You can't search for Scripts from the Quran by their full name.
        item_name = item_name.split(' ').join('+');
        item_search_url += item_name;
        window.location.href = item_search_url;
    }
    functionCallableDelay();
}

function clickLink(anchor) {
	var els = document.getElementsByTagName("a");
	for (var i = 0, l = els.length; i < l; i++) {
		var el = els[i];
		if (el.href.indexOf(anchor) >= 0) {
			el.click();
		}
	}
}

/**
 * Go to a place in Torn.
 */
function goPlaces() {
    
    if (!window.functionDisabled) {
        var oldUrl = window.location.href;

        var place_name = document.getElementById('userword').value;
        place_name = place_name.toLowerCase();
        if (!(place_name in window.availablePlaces)) {
            console.log('Could not find any place with the name: ' + place_name);
            return;
        }
        var place_url = window.availablePlaces[place_name];
        window.location.href = place_url;

        if (place_url.indexOf('factions.php?step=your') >= 0 && oldUrl.indexOf('factions.php?step=your') >= 0) {
            var i = place_url.indexOf('#');
            var anchor = place_url.substring(i);
            clickLink(myFactionTabs[anchor]);
        }
    }
    functionCallableDelay();
}

function addExpandOnFocus() {
	$('#userword').focus(function () {
		var newWidth = 220;

		if (options.itemMarketSearch || options.placesSearch || options.nameSearch) {
			if ($(this).width() <= newWidth) {
				$(this).animate({
					width : newWidth + 'px'
				}, 350, function () {
					// Animation complete.
				});
			}
		} else if (options.forumSearch) {
			if ($(this).width() != 260) {
				$(this).animate({
					width : 260 + 'px'
				}, 350, function () {
					$("#forum-search-container").show();// Animation complete.
				});
			} else {
                $("#forum-search-container").show();
            }
		}
	});
}

function removeAutocomplete(elementId) {
	if ($("#" + elementId).data('autocomplete')) {
		$("#" + elementId).autocomplete("destroy");
		$("#" + elementId).removeData('autocomplete');
	}
}

/**
 * Adds autocomplete to the search options Item Market and Place.
 * @param {option} The search option autocomplete should be added to.
 * @param {tags} The autocomplete tags to choose from.
 */
function addPlaceAndItemMarketAutocomplete() {

	var instance = $('#userword').attr('id');
	var $instance = $("#" + instance);

	removeAutocomplete(instance);

	$instance.removeClass('open');

	$instance.autocomplete({

		appendTo : $instance.parent(),

		create : function () {

			$instance.unbind('keyup.placeAndItemMarketListener').bind('keyup.placeAndItemMarketListener', function (e) {
				var event = e || window.event;
				var charCode = event.which || event.keyCode;

				if (charCode == '13') { // Enter press

					$(".ui-menu-item").hide(); // Hide autocomplete

					if (options.itemMarketSearch) {
						searchForItem();
					} else if (options.placesSearch) {
						goPlaces();
					}
				}
			});

			// Chrome fix. The Item Market search would bounce to the left and right on first search
			$instance.autocomplete("widget").css({
				position : "absolute",
				top : "27px",
				left : "-5px",
				width : 220 + "px"
			});
		},
		source : function (request, response) {
			// Limit only X amount of results.
			var results;

			if (options.itemMarketSearch) {
				results = $.ui.autocomplete.filter(window.availableItems, request.term);
				response(results.slice(0, 100));
			} else if (options.placesSearch) {
				results = $.ui.autocomplete.filter(getKeys(window.availablePlaces), request.term);
				response(results.slice(0, 100));
			}
		},
		select : function (event, ui) {
			if (ui.item) {
				$instance.val(ui.item.value);
			}
			if (options.itemMarketSearch) {
				searchForItem();
			} else if (options.placesSearch) {
				goPlaces();
			}
		},
		open : function () {

			$(this).data('autocomplete').menu.element.addClass('top-search-menu');
			$(this).data('autocomplete').menu.element.children().addClass('top-search-menu-item');

			$('.ui-menu-item').removeClass('offline');
			$('.ui-menu-item').removeClass('online');

			var totalWidth = parseInt($instance.width())

				$instance.autocomplete("widget").css({
					position : "absolute",
					top : "27px",
					left : "-5px",
					width : totalWidth + "px"
				});

		},
		focus : function (event, ui) {
			var menu = $(this).data("uiAutocomplete").menu.element,
			focused = menu.find("li:has(a.ui-state-focus)");
			menu.children().removeClass('custom-ui-state-focus');
			focused.addClass('custom-ui-state-focus');
		},
		response : function (event, ui) {
			if (ui.content.length == 1) {
				$(this).val(ui.content[0].value);
				$(this).autocomplete("close");
			}
		},
		error : function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

	// Remove helper message.
	$('.ui-helper-hidden-accessible').attr('style', 'display: none;');

	// Highlight the matching words. From http://www.boduch.ca/2013/11/jquery-ui-highlighting-autocomplete-text.html
	$instance.data('autocomplete')._renderItem = function (ul, item) {
		ul.addClass('ui-autocomplete');
		ul.removeClass('custom-ui-autocomplete');
		var re = new RegExp("(" + this.term + ")", "gi"),
		cls = this.options.highlightClass,
		template = "<strong class='" + cls + "'>$1</strong>",

		label = item.label.replace(re, template),
		$li = $("<li/>").appendTo(ul);

		$("<a/>").html(label).appendTo($li);
		$li.children().addClass('remove-shadow');
		$li.children().addClass('black-text-color');

		return $li;
	};
}

function addPlaceAndItemSearchStyles() {

	// Add styles

	var style_css = '.custom-ui-state-focus { box-shadow: 8px 0 0 0 #E8E8E8, -8px 0 0 0 #E8E8E8; color:Black; background:#E8E8E8; outline:none; }' +
		' .ui-autocomplete { max-height: 340px; overflow-y: auto; overflow-x: hidden; } .input-wrapper.search input {width: 123px;} .top-search-menu-item { padding: 0 !important;} .top-search-menu {padding: 0 8px 0 8px !important;}';

	var style = document.createElement('style');
	style.type = "text/css";
	style.innerHTML = style_css;
	//document.getElementById('userword').appendChild(style);
	document.getElementsByTagName('head')[0].appendChild(style);
}

/*********** NAME SEARCH**************************/

function addNameSearchOptionsContainer() {
	$("#userword").after('<div class="autocomplete-wrap" id="userword-topbar-cont"><ul class="ac-options gray-text-color"><li class="remove-shadow" id="ac-friends">Friends</li><li class="remove-shadow" id="ac-factions">Factions</li><li  class="remove-shadow" id="ac-company">Company</li><li  id="ac-all" class="active remove-shadow">All</li></ul><div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div><div class="viewport"><div class="overview"></div></div></div>');
}

function initializeAutocompleteSearch() {

	var userNotFoundMsg = "User cannot be found";

	var instance = $('#userword').attr('id') || $('#userword').attr('id', "ac-search-" + 123).attr('id');
	var $instance = $("#" + instance);

	var action = location.protocol + '//' + location.host + '/' + 'autocompleteUserAjaxAction.php?'
		var resultListHeight = 120;

	var $containerId = $('#' + instance + '-topbar-cont');
	$containerId.css("display", "");

	var acOption = 'all';

	$instance.autocomplete({
		appendTo : "#" + instance + "-topbar-cont .overview",
		position : {
			of : null
		},
		create : function () {
			var $el = $(this);

			var $scrollbar = $('#' + instance + '-topbar-cont.autocomplete-wrap .scrollbar');
			var $options = $('#' + instance + '-topbar-cont.autocomplete-wrap .ac-options > li');

			$('body').unbind('mousedown.nameSearchListener').bind('mousedown.nameSearchListener', function () {
				$containerId.removeClass('ac-focus-input');
				$instance.removeClass('ac-focus');

				var inputData = $instance.val();
				if (inputData) {
					var userData = $containerId.find('.custom-ui-autocomplete > li:first-child > a').text().match(/(.*)\[(.*)\]/);
					if (userData == null)
						return;
					if (inputData.toLowerCase() == $.trim(userData[1]).toLowerCase() || inputData == $.trim(userData[2])) {
						$instance.val(userData[0]);
						$instance.addClass('chosen');
					} else {
						$instance.removeClass('chosen');
					}
				}

				if ($instance.hasClass('ui-autocomplete-input')) {
					$instance.autocomplete("close");
				}
			});

			$containerId.find('.ui-autocomplete').focus(function () {
				$(this).parents('.autocomplete-wrap').addClass('ac-focus-input');
			});

			$containerId.mousedown(function (event) {
				event.stopPropagation();
			});

			$instance.mousedown(function (event) {
				event.stopPropagation();
			});

			$instance.unbind('keyup.nameSearchListenerKeyUp').bind('keyup.nameSearchListenerKeyUp', function (event) {

				if (event.keyCode == 13) { // Enter key
					var searchType = $("#search-type").val();
					if (searchType == 'usersearch') {
						searchForUser();
					}
				}
			});

			$options.click(function (event) {
				event.stopPropagation();
				var $el = $(this);
				$el.parents('.autocomplete-wrap').addClass('ac-focus-input');
				$el.siblings().removeClass('active').end().addClass('active');
				acOption = $el.attr('id');

				if ($instance.hasClass('ui-autocomplete-input')) {
					$instance.autocomplete("close");
				}
				$instance.autocomplete("search", $instance.val());
			});

			$scrollbar.mousedown(function (event) {
				event.stopPropagation();
				$(this).addClass('active');
			});

			$scrollbar.mouseup(function () {
				$(this).removeClass('active');
			});

			var updateContainerWidth = function () {
				var totalWidth = parseInt($instance.width())
					 + 8 // For the left padding
					 + 7; // For the right padding
				$containerId.width(totalWidth);
				$containerId.css("left", "-5px");
				$containerId.css("bottom", "3px");
			};

			$instance.focus(function () {
				$instance.autocomplete('enable');
				if ($instance.is(':animated')) {
					setTimeout(function () {
						$(this).addClass('ac-focus');
						$containerId.css({
							left : $instance.css('margin-left')
						});

						updateContainerWidth();
						$containerId.addClass('ac-focus-input');
					}, 350);
				} else {
					$(this).addClass('ac-focus');
					$containerId.css({
						left : $instance.css('margin-left')
					});

					updateContainerWidth();
					$containerId.addClass('ac-focus-input');
				}
			});

			$(window).resize(function () {
				updateContainerWidth();
			});

			$containerId.on('click', '.custom-ui-autocomplete a', function () {
				var $elText = $(this).text();
				$containerId.removeClass('ac-focus-input');
				$instance.removeClass('ac-focus').blur();
				if ($elText != userNotFoundMsg) {

					$instance.val($(this).text());
					$instance.addClass('chosen');
					$instance.trigger('chosen');

					var inputString = $instance.val();

					if (inputString.lastIndexOf("[") >= 0) {
						var userID = inputString.substring(inputString.lastIndexOf('[') + 1, inputString.length - 1);
						window.location.href = "/profiles.php?XID=" + userID;
					}

				} else {
					$instance.removeClass('chosen');
				}
				if ($instance.hasClass('ui-autocomplete-input')) {
					$instance.autocomplete("close");
				}
			});
		},
		source : function (request, response) {
			$.ajax({
				url : action,
				beforeSend : function () {
					$instance.addClass('loadinggif');
				},
				complete : function () {
					$instance.removeClass('loadinggif');
				},
				dataType : "json",
				data : {
					q : request.term,
					option : acOption
				},
				success : function (data) {

					if (data) {
						response($.map(data, function (item) {
								return {
									label : item,
									value : item.name + " [" + item.id + "]"
								};
							}));
					} else {
						response({
							value : userNotFoundMsg
						});
					}
				}
			});
		},
		open : function () {
			$instance.addClass('open');
			$containerId.addClass('open');
			$containerId.tinyscrollbar({
				scroll : true,
				sizethumb : 40,
				size : 118
			});
		},
		close : function (event) {
			if ($('body').hasClass('noSelect') || $containerId.hasClass('ac-focus-input')) {
				$('.custom-ui-autocomplete').show();
				$instance.focus();
			} else {
				$('#userword-topbar-cont .scrollbar').addClass('disable');
				$containerId.tinyscrollbar({
					scroll : false
				});
				$instance.removeClass('open');
				$containerId.removeClass('open');
			}
		}
	});

	$('#userword').data('autocomplete')._renderItem = function (ul, item) {
		var onlineClass = item.label.online ? 'online' : 'offline';
		ul.removeClass('ui-autocomplete');
		ul.addClass('custom-ui-autocomplete');
		return $("<li class='" + onlineClass + " ui-custom-item custom-ui-menu-item'></li>")
		.data("item.autocomplete", item)
		.append("<a class='remove-shadow black-text-color' >" + item.value + "</a>")
		.appendTo(ul);
	};

	// Remove helper message.
	$('.ui-helper-hidden-accessible').attr('style', 'display: none;');
}

function searchForUser() {
    
    if (!window.functionDisabled) {
        var userInput = $("#userword").val();
        var userIDRegex = /\[(\d+)\]/;
        var match = userInput.match(userIDRegex);

        $('#userword-topbar-cont').hide();

        if (match && match.length > 0) {
            var userID = match[1];
            location = '/profiles.php?XID=' + userID;
        } else {
            location = '/userlist.php?step=search&q=' + userInput;
        }
    }
    functionCallableDelay();
}

function addNameSearchStyles() {
	// Add styles

	var style_css = '.topbar-ac-wrapper { display: inline-block; position: relative; } '
		 + '.remove-shadow { text-shadow: none !important; }'
		 + '.gray-text-color { color: #9f9f9f !important; }'
		 + '.black-text-color { color: black !important; }'
		 + '.custom-ui-autocomplete { cursor: default; overflow-x: hidden; overflow-y: auto;} '
		 + '.custom-ui-menu-item { background-color: white !important; } .custom-ui-menu-item:hover { background-color: #e4e4e4 !important; }'
		 + '.loadinggif { background: url("http://i.imgur.com/wXgNS8B.gif") no-repeat right center !important; }';

	var style = document.createElement('style');
	style.type = "text/css";
	style.innerHTML = style_css;
	document.getElementsByTagName('head')[0].appendChild(style);
}

/****************** FORUM SEARCH *******************/

function addForumSearchOptionsContainer() {
	$("#userword").after(
		'<div id="forum-search-container" >'

		 + '<div class="select-wrapper search left">'
		 + '    <select aria-disabled="false" style="display: none;" id="search-forum-category" class="search-type" name="mode1">'
		 + '			<option value="0">All Forums</option>'
		 + '			<option value="16">Achievements</option>'
		 + '			<option value="55">Animals &amp; Nature</option>'
		 + '			<option value="1">Announcements</option>'
		 + '			<option value="49">Art &amp; Literature</option>'
		 + '			<option value="19">Bugs &amp; Issues</option>'
		 + '			<option value="20">Company Discussion</option>'
		 + '			<option value="46">Company Recruitment</option>'
		 + '			<option value="8">Donator Forum</option>'
		 + '			<option value="9">Faction Discussion</option>'
		 + '			<option value="24">Faction Recruitment</option>'
		 + '			<option value="54">Food &amp; Cooking</option>'
		 + '			<option value="13">Fun &amp; Games</option>'
		 + '			<option value="15">Gambling</option>'
		 + '			<option value="40">Gaming</option>'
		 + '			<option value="2">General Discussion</option>'
		 + '			<option value="6">General Non-related </option>'
		 + '			<option value="23">Graphics</option>'
		 + '			<option value="17">Graveyard</option>'
		 + '			<option value="39">Health &amp; Fitness</option>'
		 + '			<option value="52">Hobbies &amp; Interests</option>'
		 + '			<option value="14">IRC General</option>'
		 + '			<option value="47">Missions</option>'
		 + '			<option value="51">Motoring</option>'
		 + '			<option value="41">Music</option>'
		 + '			<option value="999">My Company</option>'
		 + '			<option value="999">My Faction </option>'
		 + '			<option value="53">Paranormal</option>'
		 + '			<option value="38">Politics &amp; Law</option>'
		 + '			<option value="22">Properties</option>'
		 + '			<option value="3">Questions &amp; Answers</option>'
		 + '			<option value="21">Racing</option>'
		 + '			<option value="7">Roleplay</option>'
		 + '			<option value="50">Science</option>'
		 + '			<option value="37">Sports</option>'
		 + '			<option value="11">Stock Market</option>'
		 + '			<option value="4">Suggestions</option>'
		 + '			<option value="35">TV &amp; Movies</option>'
		 + '			<option value="36">Technology</option>'
		 + '			<option value="10">Trading Post</option>'
		 + '			<option value="56">Travel &amp; Culture</option>'
		 + '    </select>'
		 + '  <div class="section-l"></div>'
		 + '<div class="section-r"></div>'
		 + '</div>'

		 + '<div class="select-wrapper search left">'
		 + '    <select name="mode2" class="search-type" id="search-forum-type" style="display: none;" aria-disabled="false">'
		 + '		<option value="0">Posts &amp; Topics</option>'
		 + '    	<option value="2">Posts only</option>'
		 + '		<option value="1">Topics only</option>'
		 + '    </select>'
		 + '  <div class="section-l"></div>'
		 + '  <div class="section-r"></div>'
		 + ' </div>'
		 + '</div>');

	$("#search-type").selectmenu(); // Refresh the selectmenu widget
	$("#search-forum-type").selectmenu(); // Refresh the selectmenu widget
	$("#search-forum-category").selectmenu(); // Refresh the selectmenu widget

	/*********** Type ************/
	$type = $("#search-forum-type");
	$typeMenu = $("#search-forum-type-menu");

	$type.parent().css('width', '37%');
	$type.parent().css('float', 'right');
	$type.parent().css('right', '-3px');

	$typeMenu.parent().addClass('type-width');

	/********** Category *********/
	$category = $("#search-forum-category");

	$category.parent().css('width', '55%');
	$category.parent().css('left', '-3px');
    
    
    /********* Listeners ********/
	addForumSearchListeners();
    
}

function addForumSearchStyles() {
	var style_css =
		'#forum-search-container > div { margin: 0px 0px !important;}'
         + '#forum-search-container {display: none; }'
		 + '.type-width { width: 100px !important; }'

		 + '#search-forum-category { top: 5px; } '
		 + '#search-forum-category-menu:last-child, #search-forum-type-menu:last-child { border-radius: 0 0 5px 5px !important; }'
		 + '#search-forum-category-menu .ui-selectmenu-item-focus a, #search-forum-type-menu .ui-selectmenu-item-focus a { width: 100%; background-color: #414141 !important; height: 24px !important; }'

		 + '#search-forum-category-menu { width: 161px !important; margin-top: -2px; overflow-y: scroll; overflow-x: hidden; background-color: #222; }'
		 + '#search-forum-type-menu { width: 114px !important; margin-top: -2px; overflow-y: hidden; overflow-x: hidden; background-color: #222; }'
		 + '#search-forum-type-button { width: 99px !important; }'
		 + '#search-forum-category-button > .ui-icon { right: -10px !important; }'
		 + '#search-forum-category-button { overflow: visible; }';

	var style = document.createElement('style');
	style.type = "text/css";
	style.innerHTML = style_css;
	document.getElementsByTagName('head')[0].appendChild(style);
}

function addForumSearchListeners() {
	$instance = $("#userword");
	$container = $("#forum-search-container");

	$instance.unbind('keyup.forumSearchListener').bind('keyup.forumSearchListener', function (event) {
        if (event.keyCode == 13) { // Enter press
            if (options.forumSearch) { searchForum(); }
        }
    });
    
    
    // Prevent scrolling after reaching the bottom of the menu
    // From here: http://stackoverflow.com/questions/7600454/how-to-prevent-page-scrolling-when-scrolling-a-div-element
    $( '#search-forum-category-menu' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
    var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
    
    this.scrollTop += ( delta < 0 ? 1 : -1 ) * 24;
    e.preventDefault();
});
}

try {
	addForumSearchStyles();
	addForumSearchOptionsContainer();

} catch (err) {
	console.log(err);
}

function searchForum() {
    
    if (!window.functionDisabled) {
        var query, category, type;
        
        query = $("#userword").val();
        
        var searchForumCategory = document.getElementById('search-forum-category');
        var selectedForumCategory = searchForumCategory.options[searchForumCategory.selectedIndex].value;
        category = selectedForumCategory;
        
        var searchForumType = document.getElementById('search-forum-type');
        var selectedForumType = searchForumType.options[searchForumType.selectedIndex].value;
        type = selectedForumType;
        
        window.location.href = "/forums.php#/p=search&q=" + query + "&f=" + category + "&y=" + type;
    }
    functionCallableDelay();
}

/***************** Initialization ***********************/
function init() {
	try {
		addIconClickSearch();
		addSearchOption('item market');
		addSearchOption('place');
		changeSelectMenuOptionValue("search-type", "playername", "usersearch"); // Change the option value to circumvent the original On Enter Key event by Torn.
		changeSelectMenuOptionValue("search-type", "forum", "forumextended"); // Change the option value to circumvent the original On Enter Key event by Torn.
		addSearchFunctions();
		addPlaceAndItemMarketAutocomplete();
		addPlaceAndItemSearchStyles();
		enableSaveOptionOnChange();
		addExpandOnFocus();
		setLastUsedSearchOption();
		addKeyboardShortcut();
		addNameSearchStyles();
		addNameSearchOptionsContainer();

	} catch (err) {
		console.log(err);
	}
}

/***************** Run Code ***********************/
init();
