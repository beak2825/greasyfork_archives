// ==UserScript==
// @name         GC - NeoDeck Helper
// @namespace    https://greasyfork.org/en/users/1175371
// @version      2.1
// @description  Lists missing cards so you can fill out your NeoDeck
// @author       You
// @match        https://www.grundos.cafe/games/neodeck/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486055/GC%20-%20NeoDeck%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486055/GC%20-%20NeoDeck%20Helper.meta.js
// ==/UserScript==

// based on Rowan's Gourmet Helper script! https://greasyfork.org/en/scripts/454267-grundo-s-cafe-gourmet-helper/code

var cards = [{name: "Jahbal", rarity: 94, color: "gold"}, {name: "Underwater Chef", rarity: 49, color: "red"}, {name: "Glug Glug Jones", rarity: 58, color: "pink"}, {name: "Bug Eye McGee", rarity: 80, color: "purple"}, {name: "Capara", rarity: 82, color: "black"}, {name: "Samuel No Eyes", rarity: 50, color: "red"}, {name: "Velvet Pimpernel", rarity: 39, color: "blue"}, {name: "The Fontaine Sisters", rarity: 64, color: "green"}, {name: "Lord Luparn", rarity: 37, color: "blue"}, {name: "Spectre", rarity: 90, color: "black"}, {name: "Ursula Usul", rarity: 75, color: "purple"}, {name: "Korabric", rarity: 32, color: "blue"}, {name: "Flutter", rarity: 49, color: "red"}, {name: "Gorunda the Wise", rarity: 35, color: "blue"}, {name: "Princess Fernypoo", rarity: 68, color: "green"}, {name: "Brucey B", rarity: 101, color: "holographic"}, {name: "Punchbag Bob", rarity: 99, color: "gold"}, {name: "Moogi", rarity: 35, color: "blue"}, {name: "Kyruggi", rarity: 68, color: "green"}, {name: "Mrs. Prenderghast", rarity: 50, color: "red"}, {name: "Grarrg", rarity: 67, color: "green"}, {name: "Antikia Lighten", rarity: 43, color: "red"}, {name: "Myncha", rarity: 64, color: "green"}, {name: "The Phantom", rarity: 45, color: "red"}, {name: "Aurora the Healer", rarity: 46, color: "red"}, {name: "Mr. Chuckles", rarity: 96, color: "gold"}, {name: "Dr. Frank Sloth", rarity: 101, color: "holographic"}, {name: "Nucifera", rarity: 68, color: "green"}, {name: "Tyrela Softpaw", rarity: 47, color: "red"}, {name: "Pomanna", rarity: 50, color: "red"}, {name: "Liandra", rarity: 56, color: "pink"}, {name: "Haiki-Lu", rarity: 46, color: "red"}, {name: "Grundo Chef", rarity: 43, color: "red"}, {name: "Wrawk the Merciless", rarity: 49, color: "red"}, {name: "Sarkif", rarity: 49, color: "red"}, {name: "The Lupe Collector", rarity: 88, color: "black"}, {name: "Admiral Arvakis", rarity: 44, color: "red"}, {name: "Margoreth", rarity: 95, color: "gold"}, {name: "The Stuff Collectable Card", rarity: 45, color: "red"}, {name: "Trrygdorr", rarity: 49, color: "red"}, {name: "Green Scale", rarity: 45, color: "red"}, {name: "Flaming Wuzzle", rarity: 32, color: "blue"}, {name: "Fyora The Faerie Queen", rarity: 101, color: "holographic"}, {name: "The Snowager", rarity: 90, color: "black"}, {name: "Grargadon", rarity: 80, color: "purple"}, {name: "Li-sha", rarity: 37, color: "blue"}, {name: "Otona, Protector of the Seas", rarity: 47, color: "red"}, {name: "Kharlos", rarity: 65, color: "green"}, {name: "Fire Paw", rarity: 52, color: "pink"}, {name: "Island Music", rarity: 48, color: "red"}, {name: "Midas", rarity: 42, color: "red"}, {name: "Uzarro", rarity: 36, color: "blue"}, {name: "Rikti", rarity: 48, color: "red"}, {name: "Ghi Pharun", rarity: 90, color: "black"}, {name: "Tylix", rarity: 70, color: "green"}, {name: "Gors the Mighty", rarity: 34, color: "blue"}, {name: "Kreai", rarity: 91, color: "gold"}, {name: "The Spider Grundo", rarity: 89, color: "black"}, {name: "Captain Astounding", rarity: 78, color: "purple"}, {name: "The Incredible Grarrl", rarity: 99, color: "gold"}, {name: "Electro-Boy", rarity: 80, color: "purple"}, {name: "The Wall", rarity: 79, color: "purple"}, {name: "Ryshiki", rarity: 45, color: "red"}, {name: "Shylock Usulski", rarity: 98, color: "gold"}, {name: "Grotson", rarity: 96, color: "gold"}, {name: "Doirn", rarity: 30, color: "blue"}, {name: "Xenia, Master Prankster", rarity: 49, color: "red"}, {name: "Gargon IV", rarity: 101, color: "holographic"}, {name: "Arlhox VII", rarity: 101, color: "holographic"}, {name: "Rollay Scaleback", rarity: 31, color: "blue"}, {name: "Shreegla VI", rarity: 101, color: "holographic"}, {name: "Scauderwelsch", rarity: 96, color: "gold"}, {name: "Boraxis the Healer", rarity: 34, color: "blue"}, {name: "The Archmagus of Roo", rarity: 58, color: "pink"}, {name: "Professor Kachevski", rarity: 99, color: "gold"}, {name: "Eureka", rarity: 90, color: "black"}, {name: "Moehawk", rarity: 43, color: "red"}, {name: "Alabaster", rarity: 44, color: "red"}, {name: "Professor Chesterpot", rarity: 42, color: "red"}, {name: "Farlax V", rarity: 76, color: "purple"}, {name: "Desert Flower", rarity: 36, color: "blue"}, {name: "Captain Astounding (H)", rarity: 101, color: "holographic"}, {name: "The Incredible Grarrl (H)", rarity: 101, color: "holographic"}, {name: "Electro-Boy (H)", rarity: 101, color: "holographic"}, {name: "The Wall (H)", rarity: 101, color: "holographic"}, {name: "Xantan the Foul", rarity: 46, color: "red"}, {name: "Faleinn", rarity: 90, color: "black"}, {name: "Denethrir", rarity: 46, color: "red"}, {name: "The Shop Wizard", rarity: 96, color: "gold"}, {name: "Leirobas", rarity: 59, color: "pink"}, {name: "Beerlap III", rarity: 80, color: "purple"}, {name: "Captain Threelegs", rarity: 75, color: "purple"}, {name: "Maelstra The Dark Faerie", rarity: 81, color: "black"}, {name: "Gali Yoj", rarity: 42, color: "red"}, {name: "Erick", rarity: 33, color: "blue"}, {name: "Jelly Chia", rarity: 50, color: "red"}, {name: "Shadow Usul", rarity: 70, color: "green"}, {name: "Mechachiazilla", rarity: 96, color: "gold"}, {name: "Chiazilla", rarity: 60, color: "pink"}, {name: "Choras Tillie", rarity: 50, color: "red"}, {name: "Eleus Batrin", rarity: 45, color: "red"}, {name: "Morax Dorangis", rarity: 38, color: "blue"}, {name: "Edna the Witch", rarity: 71, color: "purple"}, {name: "The Gate Keeper", rarity: 51, color: "pink"}, {name: "Lummock Sendent", rarity: 37, color: "blue"}, {name: "Mokti", rarity: 37, color: "blue"}, {name: "Fuhnah The Fire Faerie", rarity: 45, color: "red"}, {name: "The Auction Genie", rarity: 51, color: "pink"}, {name: "Treasure Seekers", rarity: 97, color: "gold"}, {name: "Mr Irgo", rarity: 39, color: "blue"}, {name: "Breadoch Big Foot", rarity: 32, color: "blue"}, {name: "The Esophagor", rarity: 61, color: "green"}, {name: "Wock Til You Drop", rarity: 98, color: "gold"}, {name: "Neopian Tank Patrol 45", rarity: 50, color: "red"}, {name: "Gargoyle Troop", rarity: 33, color: "blue"}, {name: "Uugbah Sharp Spear", rarity: 39, color: "blue"}, {name: "Rayn Trueshot", rarity: 42, color: "red"}, {name: "The Brain Tree", rarity: 95, color: "gold"}, {name: "Kargrax the Defender", rarity: 46, color: "red"}, {name: "Berserker", rarity: 38, color: "blue"}, {name: "Sharpeye", rarity: 35, color: "blue"}, {name: "Tehuti", rarity: 54, color: "pink"}, {name: "Hubert the Hot Dog Salesman", rarity: 59, color: "pink"}, {name: "Uggsul", rarity: 35, color: "blue"}, {name: "Bacheek", rarity: 60, color: "pink"}, {name: "Lady Osiri", rarity: 59, color: "pink"}, {name: "Senator Palpus", rarity: 85, color: "black"}, {name: "Princess Sankara", rarity: 93, color: "gold"}, {name: "Riyella", rarity: 36, color: "blue"}, {name: "Senator Barca", rarity: 67, color: "green"}, {name: "Giant Grackle Bug", rarity: 68, color: "green"}, {name: "General Crustygums", rarity: 85, color: "black"}, {name: "Gedda Happycheek", rarity: 96, color: "gold"}, {name: "Korosu Crestscar", rarity: 94, color: "gold"}, {name: "Jeuru Stripedmane", rarity: 35, color: "blue"}, {name: "Money Tree", rarity: 79, color: "purple"}, {name: "Chimi Magi", rarity: 34, color: "blue"}, {name: "Guardian of Fire Magic", rarity: 31, color: "blue"}, {name: "Guardian of Ice Magic", rarity: 92, color: "gold"}, {name: "The Hairy Tongue Beast", rarity: 100, color: "holographic"}, {name: "Alhazad the Trader", rarity: 48, color: "red"}, {name: "Guardian of Life Magic", rarity: 81, color: "black"}, {name: "Rhiannon", rarity: 33, color: "blue"}, {name: "Guardian of Shock Magic", rarity: 69, color: "green"}, {name: "Ruali", rarity: 47, color: "red"}, {name: "Guardian of Spectral Magic", rarity: 88, color: "black"}, {name: "Advisor Wessle", rarity: 52, color: "pink"}, {name: "Princess Vyssa", rarity: 91, color: "gold"}, {name: "King Coltzan III", rarity: 63, color: "green"}, {name: "Remnok the Nomad", rarity: 87, color: "black"}, {name: "Goldwing", rarity: 31, color: "blue"}, {name: "Daedelon", rarity: 82, color: "black"}, {name: "Brack, Cactus Farmer", rarity: 70, color: "green"}, {name: "Geirrod Sternhoof", rarity: 36, color: "blue"}, {name: "Brista Lightfeet", rarity: 79, color: "purple"}, {name: "Shoonee", rarity: 62, color: "green"}, {name: "Cherlops, Protector of Garn", rarity: 95, color: "gold"}, {name: "Hubrid Nox", rarity: 96, color: "gold"}, {name: "Professor Agatha", rarity: 38, color: "blue"}, {name: "Doctor", rarity: 38, color: "blue"}, {name: "Shahuaga The Red", rarity: 74, color: "purple"}, {name: "Rhan Tyr", rarity: 62, color: "green"}, {name: "Balthazar the Bounty Hunter", rarity: 101, color: "holographic"}, {name: "Lustra the Golden Peophin", rarity: 65, color: "green"}, {name: "Arnie Hulltusk", rarity: 34, color: "blue"}, {name: "Lhika Burrtail", rarity: 35, color: "blue"}, {name: "Hagalugg", rarity: 45, color: "red"}, {name: "Ryshu", rarity: 61, color: "green"}, {name: "Captain Dread", rarity: 42, color: "red"}, {name: "Gelert Pack", rarity: 80, color: "purple"}, {name: "Sir Wockilan the Brave", rarity: 50, color: "red"}, {name: "Zephiea Boltheart", rarity: 64, color: "green"}, {name: "Hagar Mountbane", rarity: 30, color: "blue"}, {name: "Marillis Harbane", rarity: 99, color: "gold"}, {name: "Scorchio Mummy", rarity: 75, color: "purple"}, {name: "Buzz Alchemist", rarity: 77, color: "purple"}, {name: "Florg the Devourer", rarity: 36, color: "blue"}, {name: "Hegred Aishann", rarity: 76, color: "purple"}, {name: "Niten Hiroru", rarity: 65, color: "green"}, {name: "Chen-Ra Son of the Sun", rarity: 69, color: "green"}, {name: "Uncle Tharg", rarity: 52, color: "pink"}, {name: "Venuquin", rarity: 35, color: "blue"}, {name: "Jasper Gen", rarity: 101, color: "holographic"}, {name: "Duel Bazuka", rarity: 99, color: "gold"}, {name: "Tyran Far", rarity: 42, color: "red"}, {name: "Grimilix", rarity: 71, color: "purple"}, {name: "Frostburn the Chia", rarity: 56, color: "pink"}, {name: "Keergo", rarity: 66, color: "green"}, {name: "Magnus the Torch", rarity: 51, color: "pink"}, {name: "Draconus Maximus", rarity: 99, color: "gold"}, {name: "Undead Farmer", rarity: 73, color: "purple"}, {name: "Undead Grundo Shopkeeper", rarity: 45, color: "red"}, {name: "Gog", rarity: 62, color: "green"}, {name: "Nadia the Peophin of Love", rarity: 52, color: "pink"}, {name: "Shyanna", rarity: 30, color: "blue"}, {name: "Pteri Knight", rarity: 61, color: "green"}, {name: "Captain Telhan", rarity: 38, color: "blue"}, {name: "Scorchio Mage", rarity: 50, color: "red"}, {name: "Darien", rarity: 35, color: "blue"}, {name: "Sir Cheekalot", rarity: 48, color: "red"}, {name: "The Monocerous", rarity: 110, color: "holographic"}, {name: "Swamp Ghoul", rarity: 99, color: "gold"}, {name: "Solar Fyre", rarity: 42, color: "red"}, {name: "Ghartun The Grundo Commander", rarity: 38, color: "blue"}, {name: "Garrox5 The Grundo Trooper", rarity: 97, color: "gold"}, {name: "Valkyrie", rarity: 79, color: "purple"}, {name: "Nocan Vish", rarity: 99, color: "gold"}, {name: "Evil Sloth Clone #32", rarity: 81, color: "black"}, {name: "Lavender", rarity: 63, color: "green"}, {name: "Mechanoid Warrior", rarity: 96, color: "gold"}, {name: "Blarthrox", rarity: 72, color: "purple"}, {name: "Rock Beast", rarity: 57, color: "pink"}, {name: "The Monoceraptor", rarity: 110, color: "holographic"}, {name: "Grarrl Battlemaster", rarity: 56, color: "pink"}, {name: "Umbus Alta", rarity: 73, color: "purple"}, {name: "Imperius Flare", rarity: 88, color: "black"}, {name: "Tyragh the Tyrannian Buzz", rarity: 82, color: "black"}, {name: "Tazzalor", rarity: 78, color: "purple"}, {name: "Kyrii Islander", rarity: 39, color: "blue"}, {name: "Kasuki Lu", rarity: 45, color: "red"}, {name: "Orig the Great", rarity: 101, color: "holographic"}, {name: "Siona", rarity: 99, color: "gold"}, {name: "Sir Fufon Lui", rarity: 85, color: "black"}, {name: "Luperus", rarity: 66, color: "green"}, {name: "Gutan Kai", rarity: 43, color: "red"}, {name: "Ukkrah the Fire Grarrl", rarity: 52, color: "pink"}, {name: "Grackle the Chia Bomber", rarity: 77, color: "purple"}, {name: "Slychi the Skeith Invader", rarity: 33, color: "blue"}, {name: "Lunchtime", rarity: 96, color: "gold"}, {name: "Gragarex the Grarrl Trooper", rarity: 83, color: "black"}, {name: "Feemix the Korbat Scout", rarity: 61, color: "green"}, {name: "Kraag the Korbat Leader", rarity: 32, color: "blue"}, {name: "Ghoul Catchers", rarity: 98, color: "gold"}, {name: "Zafara Hero", rarity: 55, color: "pink"}, {name: "Plains Aisha", rarity: 66, color: "green"}, {name: "Jannen", rarity: 44, color: "red"}, {name: "Iyana the Earth Faerie", rarity: 76, color: "purple"}, {name: "Godfried the Good", rarity: 42, color: "red"}, {name: "Psellia the Air Faerie", rarity: 44, color: "red"}, {name: "Usinda", rarity: 46, color: "red"}, {name: "Meerca Menace", rarity: 44, color: "red"}, {name: "Flying Shoyru", rarity: 43, color: "red"}, {name: "Highland Chia", rarity: 43, color: "red"}, {name: "A Light Faerie", rarity: 89, color: "black"}, {name: "The Battle Faerie", rarity: 57, color: "pink"}, {name: "Taelia The Snow Faerie", rarity: 98, color: "gold"}, {name: "Zyrolon", rarity: 63, color: "green"}, {name: "Annual Gormball Championship", rarity: 36, color: "blue"}, {name: "Neopet Version Two", rarity: 97, color: "gold"}, {name: "The Soup Faerie", rarity: 96, color: "gold"}, {name: "The Tooth Faerie", rarity: 57, color: "pink"}, {name: "A Two Rings Crusader", rarity: 36, color: "blue"}, {name: "The Negg Faerie", rarity: 78, color: "purple"}, {name: "Kauvara", rarity: 99, color: "gold"}, {name: "Zafara Rogue", rarity: 31, color: "blue"}, {name: "Malkus Vile", rarity: 34, color: "blue"}, {name: "Lupe Warrior", rarity: 31, color: "blue"}, {name: "The Lava Ghoul", rarity: 30, color: "blue"}, {name: "Spectral Elemental", rarity: 32, color: "blue"}, {name: "The Pant Devil", rarity: 96, color: "gold"}, {name: "Fire Breathing Meerca", rarity: 30, color: "blue"}, {name: "Yes Boy Ice Cream", rarity: 51, color: "pink"}, {name: "M*ynci", rarity: 31, color: "blue"}, {name: "2 Gallon Hatz", rarity: 68, color: "green"}, {name: "Nereid the Water Faerie", rarity: 30, color: "blue"}, {name: "Sticks and Stones", rarity: 30, color: "blue"}, {name: "Uggaroo", rarity: 35, color: "blue"}, {name: "Dreaming", rarity: 36, color: "blue"}, {name: "Quiggle Warlord", rarity: 35, color: "blue"}, {name: "Quiggle Strongman", rarity: 33, color: "blue"}, {name: "Sargug", rarity: 99, color: "gold"}, {name: "Trapped", rarity: 31, color: "blue"}, {name: "Neoquest Hero", rarity: 36, color: "blue"}, {name: "Undead Cybunny", rarity: 34, color: "blue"}, {name: "Plesio", rarity: 53, color: "pink"}, {name: "Chomby and the Fungus Balls", rarity: 86, color: "black"}, {name: "The Space Faerie", rarity: 83, color: "black"}, {name: "Wesley Clearheart", rarity: 75, color: "purple"}, {name: "Bazri The Grundo", rarity: 73, color: "purple"}, {name: "Dr_Death", rarity: 84, color: "black"}, {name: "Count Von Roo", rarity: 67, color: "green"}, {name: "Two Rings Wizard", rarity: 56, color: "pink"}, {name: "Temple Watchman", rarity: 44, color: "red"}, {name: "King Roo", rarity: 97, color: "gold"}, {name: "Two Rings Warlock", rarity: 37, color: "blue"}, {name: "Two Rings Archmagus", rarity: 39, color: "blue"}, {name: "Garon the Lupe", rarity: 87, color: "black"}, {name: "00 Hog", rarity: 85, color: "black"}, {name: "Kalora the Kau", rarity: 61, color: "green"}, {name: "Chuffer Bob", rarity: 62, color: "green"}, {name: "Branston the Eyrie", rarity: 98, color: "gold"}, {name: "Little Timmy", rarity: 100, color: "holographic"}, {name: "Alstaf Poogle", rarity: 110, color: "holographic"}, {name: "The Great Blurendo", rarity: 93, color: "gold"}, {name: "Krawk Card", rarity: 94, color: "gold"}, {name: "Zygorax", rarity: 97, color: "gold"}, {name: "Meruth", rarity: 98, color: "gold"}, {name: "Captain Xelqued", rarity: 99, color: "gold"}, {name: "Space Krawk", rarity: 97, color: "gold"}, {name: "Iskha Lightbringer", rarity: 96, color: "gold"}, {name: "Krawk Swashbuckler", rarity: 97, color: "gold"}, {name: "Kyrii Sorceror", rarity: 99, color: "gold"}, {name: "Extreme Herder", rarity: 99, color: "gold"}, {name: "Sergeant Brexis", rarity: 99, color: "gold"}, {name: "Champion", rarity: 98, color: "gold"}, {name: "Illusen the Earth Faerie", rarity: 95, color: "gold"}, {name: "Deckswabber", rarity: 97, color: "gold"}, {name: "Jhudora the Dark Faerie", rarity: 96, color: "gold"}, {name: "Calabrus the Cloud Aisha", rarity: 101, color: "holographic"}, {name: "Lady Quintara", rarity: 98, color: "gold"}, {name: "Draik Paladin", rarity: 90, color: "black"}, {name: "Jeran", rarity: 98, color: "gold"}, {name: "Valrigard", rarity: 97, color: "gold"}, {name: "Ixi Lancer", rarity: 90, color: "black"}, {name: "Enchanted Ixi", rarity: 99, color: "gold"}, {name: "Kalandra", rarity: 98, color: "gold"}, {name: "Scratch Card Kiosk Wocky", rarity: 80, color: "purple"}, {name: "Meuka", rarity: 90, color: "black"}, {name: "Maths Nightmare", rarity: 85, color: "black"}, {name: "Maitre D", rarity: 82, color: "black"}, {name: "The Storyteller", rarity: 180, color: "holographic"}, {name: "Snow Wars Collectable Card", rarity: 180, color: "holographic"}, {name: "Mutant Aisha Twins", rarity: 83, color: "black"}, {name: "Lord Darigan", rarity: 99, color: "gold"}, {name: "Magax: Destroyer", rarity: 85, color: "black"}, {name: "Pacha The Vet", rarity: 80, color: "purple"}, {name: "Lightning Lenny", rarity: 88, color: "black"}, {name: "Khan the Unstoppable", rarity: 99, color: "gold"}, {name: "Master Vex", rarity: 98, color: "gold"}, {name: "Gilly the Usul", rarity: 99, color: "gold"}, {name: "Stan the Kyrii", rarity: 93, color: "gold"}, {name: "Dr. Flexo", rarity: 101, color: "holographic"}, {name: "Zeirn the Electric Kougra", rarity: 98, color: "gold"}, {name: "LDPBSTSCC", rarity: 89, color: "black"}, {name: "Tug-O-War Card", rarity: 76, color: "purple"}, {name: "Deserted Fairground Card", rarity: 90, color: "black"}, {name: "Commander Garoo Card", rarity: 90, color: "black"}, {name: "Korbats Lab Card", rarity: 68, color: "green"}, {name: "Grarrl Keno Card", rarity: 70, color: "green"}, {name: "Rainbow Fountain Card", rarity: 89, color: "black"}, {name: "The Tax Beast", rarity: 99, color: "gold"}, {name: "Grey Faerie Card", rarity: 90, color: "black"}, {name: "Judge Hog", rarity: 88, color: "black"}, {name: "The Masked Intruder", rarity: 89, color: "black"}, {name: "Super Happy Icy Fun Snow Shop Card", rarity: 180, color: "holographic"}, {name: "Lord Kass Card", rarity: 99, color: "gold"}, {name: "Galem Darkhand", rarity: 90, color: "black"}, {name: "Armin the Small", rarity: 90, color: "black"}, {name: "Buzz Avenger", rarity: 88, color: "black"}, {name: "Berti the Creator", rarity: 88, color: "black"}, {name: "Gadgadsbogen Festival", rarity: 88, color: "black"}, {name: "Hasee Bounce Card", rarity: 82, color: "black"}, {name: "Zafara Double Agent", rarity: 98, color: "gold"}, {name: "Sophie the Swamp Witch", rarity: 84, color: "black"}, {name: "Kiko Explorer", rarity: 80, color: "purple"}, {name: "Grundo Gazette 200th Anniversary Card", rarity: 101, color: "holographic"}, {name: "King Roos Nemesis", rarity: 80, color: "purple"}, {name: "Meerouladen and Heermeedjet", rarity: 87, color: "black"}, {name: "King Hagan of Brightvale", rarity: 85, color: "black"}, {name: "The Navigator", rarity: 80, color: "purple"}, {name: "Bruce Avenger", rarity: 82, color: "black"}, {name: "Mysterious Aisha Sorceress", rarity: 82, color: "black"}, {name: "Mystical Hissi Knight", rarity: 72, color: "purple"}, {name: "Lenny Curator", rarity: 76, color: "purple"}, {name: "Tonunishiki", rarity: 78, color: "purple"}, {name: "Jake the Explorer", rarity: 57, color: "pink"}]

var cardsTable = document.querySelector('table.deck-center');
var yourCardsNodes = document.querySelectorAll('table.deck-center tbody tr tbody td a b');
var yourCards = [];
yourCardsNodes.forEach((card) => {yourCards.push(card.textContent)});
var missingCards = [];

cards.sort((a,b) => {
    return a.rarity - b.rarity;
}) 

function Card(name, rarity, color) {
    this.name = name;
    this.rarity = rarity;
    this.color = color;
}

var totals = {};

cards.forEach((card) => {
	if (!yourCards.includes(card.name)) {
		missingCards.push(new Card(card.name, card.rarity, card.color));
	}
	totals[card.color] ||= 0;
	totals[card.color]++;
});

function setColor(color) {
    if (color == 'holographic') {
        return 'silver';
    } else {
        return color;
    }
}

function populateMissingCards(card) {
	var li = document.createElement('li');
	var span = document.createElement('span');
	span.textContent = card.name;
	span.setAttribute('style', 'padding-right: 5px;');
    var color = document.createElement('span');
    color.style.width = '14px';
    color.style.height = '14px';
    color.style.display = 'inline-block';
    color.style.backgroundColor = setColor(card.color);
    color.style.marginRight = '5px';
    var rarity = document.createElement('b');
    rarity.textContent = "(r" + card.rarity + ")";
    rarity.style.paddingRight = '5px'
	li.appendChild(span);
    li.appendChild(color);
    li.appendChild(rarity);
	var shopWizLink = document.createElement('a');
	shopWizLink.setAttribute('target', '_neodeckSearch');
	shopWizLink.setAttribute('href', '/market/wizard/?query=' + card.name);
	var shopWizImg = document.createElement('img');
	shopWizImg.setAttribute('width', '20px');
	shopWizImg.setAttribute('src', 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/wiz.png');
    shopWizLink.style.paddingRight = '3px';

	var tpLink = document.createElement('a');
	tpLink.setAttribute('target', '_neodeckSearch');
	tpLink.setAttribute('href', '/island/tradingpost/browse/?query=' + card.name);
	var tpImg = document.createElement('img');
	tpImg.setAttribute('width', '20px');
	tpImg.setAttribute('src', 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/tp.png');
    tpLink.style.paddingRight = '3px';

	var sdbLink = document.createElement('a');
	sdbLink.setAttribute('target', '_neodeckSearch');
	sdbLink.setAttribute('href', '/safetydeposit/?page=1&category=&type&query=' + card.name);
	var sdbImg = document.createElement('img');
	sdbImg.setAttribute('width', '15px');
	sdbImg.setAttribute('src', 'https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/sdb.gif');
    sdbLink.style.paddingRight = '3px';

	shopWizLink.appendChild(shopWizImg);
	tpLink.appendChild(tpImg);
	sdbLink.appendChild(sdbImg);

	li.appendChild(shopWizLink);
	li.appendChild(tpLink);
	li.appendChild(sdbLink);

	return li;
}
var counts = {};

var missingList = document.createElement('ul');
missingList.className = 'missingNeoDeckCards';
missingList.style.paddingLeft = '2em';
missingList.style.columns = '2';
missingCards.forEach((card) => {
	missingList.appendChild(populateMissingCards(card));
	counts[card.color] ||= 0;
	counts[card.color]++;
})

var h3 = document.createElement('h3')
h3.textContent = 'You are missing ' + missingList.childNodes.length + ' cards!';
h3.style.textAlign = 'center';
cardsTable.after(h3);
h3.after(missingList);

var countsTable = document.createElement('table');
var countsHeader = countsTable.createTHead().insertRow();
var countsBody = countsTable.createTBody().insertRow();
Object.entries(counts).map(entry => {
	let key = entry[0];
	let value = entry[1];
	cardType = (key == 'holographic') ? 'holo' : key;
	var cat = countsHeader.appendChild(document.createElement('th'));
	cat.innerHTML = "<img style='height: 25px' src='https://grundoscafe.b-cdn.net/items/" + cardType + "tradingcardback.gif'/>";
	var count = countsBody.appendChild(document.createElement('td'))
	count.textContent = totals[key] - value + "/" + totals[key];
	cat.style.border = 'black 1px solid';
	cat.style.padding = '5px 1em';
	count.style.border = 'black 1px solid';
});
countsTable.style.border = 'black 1px solid';
countsTable.style.borderCollapse = 'collapse';
countsTable.style.textAlign = 'center';
countsTable.style.margin = '0 auto';
var tableInfo = document.createElement('p');
tableInfo.style.fontWeight = 'bold';
tableInfo.style.textAlign = 'center';
tableInfo.style.marginBottom = '2px';
tableInfo.textContent = 'Your collection progress';

cardsTable.before(countsTable);
countsTable.before(tableInfo);