// ==UserScript==
// @name        TCG Album Helper
// @namespace   Neoscripts
// @match       *://www.neopets.com/games/neodeck/index.phtml*
// @grant       none
// @version     1.0.2
// @author      kart
// @description Adds info menu about missing TCG cards. 
// @credits     Based on Stamp Album Helper by EatWooloos: https://greasyfork.org/en/scripts/421034-stamp-album-helper
// @downloadURL https://update.greasyfork.org/scripts/432622/TCG%20Album%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/432622/TCG%20Album%20Helper.meta.js
// ==/UserScript==


const hasPremium = !!$("#sswmenu .imgmenu").length;
const owner = location.search.match(/owner=(.+)&*/)?.[1] || appInsightsUserName;

const CARD_LIST = {
    "1": {
        "album": "1-20",
        "list": [
            { position: 1, name: "Jahbal", img: "med_1.gif", rarity: "yellow" },
            { position: 2, name: "Underwater Chef", img: "med_2.gif", rarity: "red" },
            { position: 3, name: "Glug Glug Jones", img: "med_3.gif", rarity: "pink" },
            { position: 4, name: "Bug Eye McGee", img: "med_4.gif", rarity: "purple" },
            { position: 5, name: "Capara", img: "med_5.gif", rarity: "black" },
            { position: 6, name: "Samuel No Eyes", img: "med_6.gif", rarity: "red" },
            { position: 7, name: "Velvet Pimpernel", img: "med_7.gif", rarity: "blue" },
            { position: 8, name: "The Fontaine Sisters", img: "med_8.gif", rarity: "green" },
            { position: 9, name: "Lord Luparn", img: "med_9.gif", rarity: "blue" },
            { position: 10, name: "Spectre", img: "med_10.gif", rarity: "black" },
            { position: 11, name: "Ursula Usul", img: "med_11.gif", rarity: "purple" },
            { position: 12, name: "Korabric", img: "med_12.gif", rarity: "blue" },
            { position: 13, name: "Flutter", img: "med_13.gif", rarity: "red" },
            { position: 14, name: "Gorunda the Wise", img: "med_14.gif", rarity: "blue" },
            { position: 15, name: "Princess Fernypoo", img: "med_15.gif", rarity: "green" },
            { position: 16, name: "Brucey B", img: "med_16.gif", rarity: "holo" },
            { position: 17, name: "Punchbag Bob", img: "med_17.gif", rarity: "yellow" },
            { position: 18, name: "Moogi", img: "med_18.gif", rarity: "blue" },
            { position: 19, name: "Kyruggi", img: "med_19.gif", rarity: "green" },
            { position: 20, name: "Mrs. Prenderghast", img: "med_20.gif", rarity: "red" }
        ]
    },
    "2": {
        "album": "21-40",
        "list": [
            { position: 1, name: "Grarrg", img: "med_21.gif", rarity: "green" },
            { position: 2, name: "Antikia Lighten", img: "med_22.gif", rarity: "red" },
            { position: 3, name: "Myncha", img: "med_23.gif", rarity: "green" },
            { position: 4, name: "The Phantom", img: "med_24.gif", rarity: "red" },
            { position: 5, name: "Aurora the Healer", img: "med_25.gif", rarity: "red" },
            { position: 6, name: "Mr. Chuckles", img: "med_26.gif", rarity: "yellow" },
            { position: 7, name: "Dr. Frank Sloth", img: "med_27.gif", rarity: "holo" },
            { position: 8, name: "Umma Bunga", img: "med_28.gif", rarity: "green" },
            { position: 9, name: "Tyrela Softpaw", img: "med_29.gif", rarity: "red" },
            { position: 10, name: "Pomanna", img: "med_30.gif", rarity: "red" },
            { position: 11, name: "Liandra", img: "med_31.gif", rarity: "pink" },
            { position: 12, name: "Haiki-Lu", img: "med_32.gif", rarity: "red" },
            { position: 13, name: "Grundo Chef", img: "med_33.gif", rarity: "red" },
            { position: 14, name: "Wrawk the Merciless", img: "med_34.gif", rarity: "red" },
            { position: 15, name: "Sarkif", img: "med_35.gif", rarity: "red" },
            { position: 16, name: "The Lupe Collector", img: "med_36.gif", rarity: "black" },
            { position: 17, name: "Admiral Arvakis", img: "med_37.gif", rarity: "red" },
            { position: 18, name: "Margoreth", img: "med_38.gif", rarity: "yellow" },
            { position: 19, name: "The Stuff Collectable Card", img: "med_39.gif", rarity: "red" },
            { position: 20, name: "Trrygdorr", img: "med_40.gif", rarity: "red" }
        ]
    },
    "3": {
        "album": "41-60",
        "list": [
            { position: 1, name: "Green Scale", img: "med_41.gif", rarity: "red" },
            { position: 2, name: "Flaming Wuzzle", img: "med_42.gif", rarity: "blue" },
            { position: 3, name: "Fyora The Faerie Queen", img: "med_43.gif", rarity: "holo" },
            { position: 4, name: "The Snowager", img: "med_44.gif", rarity: "black" },
            { position: 5, name: "Grargadon", img: "med_45.gif", rarity: "purple" },
            { position: 6, name: "Li-sha", img: "med_46.gif", rarity: "blue" },
            { position: 7, name: "Otona, Protector of the Seas", img: "med_47.gif", rarity: "red" },
            { position: 8, name: "Kharlos", img: "med_48.gif", rarity: "green" },
            { position: 9, name: "Fire Paw", img: "med_49.gif", rarity: "pink" },
            { position: 10, name: "Island Mystic", img: "med_50.gif", rarity: "red" },
            { position: 11, name: "Midas", img: "med_51.gif", rarity: "red" },
            { position: 12, name: "Uzarro", img: "med_52.gif", rarity: "blue" },
            { position: 13, name: "Rikti", img: "med_53.gif", rarity: "red" },
            { position: 14, name: "Ghi Pharun", img: "med_54.gif", rarity: "black" },
            { position: 15, name: "Tylix", img: "med_55.gif", rarity: "green" },
            { position: 16, name: "Gors the Mighty", img: "med_56.gif", rarity: "blue" },
            { position: 17, name: "Kreai", img: "med_57.gif", rarity: "yellow" },
            { position: 18, name: "The Spider Grundo", img: "med_58.gif", rarity: "black" },
            { position: 19, name: "Captain Astounding", img: "med_59.gif", rarity: "purple" },
            { position: 20, name: "The Incredible Grarrl", img: "med_60.gif", rarity: "yellow" }
        ]
    },
    "4": {
        "album": "61-80",
        "list": [
            { position: 1, name: "Electro-Boy", img: "med_61.gif", rarity: "purple" },
            { position: 2, name: "The Wall", img: "med_62.gif", rarity: "purple" },
            { position: 3, name: "Ryshiki", img: "med_63.gif", rarity: "red" },
            { position: 4, name: "Shylock Usulski", img: "med_64.gif", rarity: "yellow" },
            { position: 5, name: "Grotson", img: "med_65.gif", rarity: "yellow" },
            { position: 6, name: "Doirn", img: "med_66.gif", rarity: "blue" },
            { position: 7, name: "Xenia, Master Prankster", img: "med_67.gif", rarity: "red" },
            { position: 8, name: "Gargon IV", img: "med_68.gif", rarity: "holo" },
            { position: 9, name: "Arlhox VII", img: "med_69.gif", rarity: "holo" },
            { position: 10, name: "Rollay Scaleback", img: "med_70.gif", rarity: "blue" },
            { position: 11, name: "Shreegla VI", img: "med_71.gif", rarity: "holo" },
            { position: 12, name: "Scauderwelsch", img: "med_72.gif", rarity: "yellow" },
            { position: 13, name: "Boraxis the Healer", img: "med_73.gif", rarity: "blue" },
            { position: 14, name: "The Archmagus of Roo", img: "med_74.gif", rarity: "pink" },
            { position: 15, name: "Professor Kachevski", img: "med_75.gif", rarity: "yellow" },
            { position: 16, name: "Eureka", img: "med_76.gif", rarity: "black" },
            { position: 17, name: "Moehawk", img: "med_77.gif", rarity: "red" },
            { position: 18, name: "Alabaster", img: "med_78.gif", rarity: "red" },
            { position: 19, name: "Professor Chesterpot", img: "med_79.gif", rarity: "red" },
            { position: 20, name: "Farlax V", img: "med_80.gif", rarity: "purple" }
        ]
    },
    "5": {
        "album": "81-100",
        "list": [
            { position: 1, name: "Desert Flower", img: "med_81.gif", rarity: "blue" },
            { position: 2, name: "Captain Astounding (H)", img: "med_82.gif", rarity: "holo" },
            { position: 3, name: "The Incredible Grarrl (H)", img: "med_83.gif", rarity: "holo" },
            { position: 4, name: "Electro-Boy (H)", img: "med_84.gif", rarity: "holo" },
            { position: 5, name: "The Wall (H)", img: "med_85.gif", rarity: "holo" },
            { position: 6, name: "Xantan the Foul", img: "med_86.gif", rarity: "red" },
            { position: 7, name: "Faleinn", img: "med_87.gif", rarity: "black" },
            { position: 8, name: "Denethrir", img: "med_88.gif", rarity: "red" },
            { position: 9, name: "The Shop Wizard", img: "med_89.gif", rarity: "yellow" },
            { position: 10, name: "Leirobas", img: "med_90.gif", rarity: "pink" },
            { position: 11, name: "Beerlap III", img: "med_91.gif", rarity: "purple" },
            { position: 12, name: "Captain Threelegs", img: "med_92.gif", rarity: "purple" },
            { position: 13, name: "Maelstra The Dark Faerie", img: "med_93.gif", rarity: "black" },
            { position: 14, name: "Gali Yoj", img: "med_94.gif", rarity: "red" },
            { position: 15, name: "Erick", img: "med_95.gif", rarity: "blue" },
            { position: 16, name: "Jelly Chia", img: "med_96.gif", rarity: "red" },
            { position: 17, name: "Shadow Usul", img: "med_97.gif", rarity: "green" },
            { position: 18, name: "Mechachiazilla", img: "med_98.gif", rarity: "yellow" },
            { position: 19, name: "Chiazilla", img: "med_99.gif", rarity: "pink" },
            { position: 20, name: "Choras Tillie", img: "med_100.gif", rarity: "red" }
        ]
    },
    "6": {
        "album": "101-120",
        "list": [
            { position: 1, name: "Eleus Batrin", img: "med_101.gif", rarity: "red" },
            { position: 2, name: "Morax Dorangis", img: "med_102.gif", rarity: "blue" },
            { position: 3, name: "Edna the Witch", img: "med_103.gif", rarity: "purple" },
            { position: 4, name: "The Gate Keeper", img: "med_104.gif", rarity: "pink" },
            { position: 5, name: "Lummock Sendent", img: "med_105.gif", rarity: "blue" },
            { position: 6, name: "Mokti", img: "med_106.gif", rarity: "blue" },
            { position: 7, name: "Fuhnah The Fire Faerie", img: "med_107.gif", rarity: "red" },
            { position: 8, name: "The Auction Genie", img: "med_108.gif", rarity: "pink" },
            { position: 9, name: "Treasure Seekers", img: "med_109.gif", rarity: "yellow" },
            { position: 10, name: "Mr Irgo", img: "med_110.gif", rarity: "blue" },
            { position: 11, name: "Breadoch Big Foot", img: "med_111.gif", rarity: "blue" },
            { position: 12, name: "The Esophagor", img: "med_112.gif", rarity: "green" },
            { position: 13, name: "Wock Til You Drop", img: "med_113.gif", rarity: "yellow" },
            { position: 14, name: "Neopian Tank Patrol 45", img: "med_114.gif", rarity: "red" },
            { position: 15, name: "Gargoyle Troop", img: "med_115.gif", rarity: "blue" },
            { position: 16, name: "Uugbah Sharp Spear", img: "med_116.gif", rarity: "blue" },
            { position: 17, name: "Rayn Trueshot", img: "med_117.gif", rarity: "red" },
            { position: 18, name: "The Brain Tree", img: "med_118.gif", rarity: "yellow" },
            { position: 19, name: "Kargrax the Defender", img: "med_119.gif", rarity: "red" },
            { position: 20, name: "Berserker", img: "med_120.gif", rarity: "blue" }
        ]
    },
    "7": {
        "album": "121-140",
        "list": [
            { position: 1, name: "Sharpeye", img: "med_121.gif", rarity: "blue" },
            { position: 2, name: "Tehuti", img: "med_122.gif", rarity: "pink" },
            { position: 3, name: "Hubert the Hot Dog Salesman", img: "med_123.gif", rarity: "pink" },
            { position: 4, name: "Uggsul", img: "med_124.gif", rarity: "blue" },
            { position: 5, name: "Bacheek", img: "med_125.gif", rarity: "pink" },
            { position: 6, name: "Lady Osiri", img: "med_126.gif", rarity: "pink" },
            { position: 7, name: "Senator Palpus", img: "med_127.gif", rarity: "black" },
            { position: 8, name: "Princess Sankara", img: "med_128.gif", rarity: "yellow" },
            { position: 9, name: "Riyella", img: "med_129.gif", rarity: "blue" },
            { position: 10, name: "Senator Barca", img: "med_130.gif", rarity: "green" },
            { position: 11, name: "Giant Grackle Bug", img: "med_131.gif", rarity: "green" },
            { position: 12, name: "General Crustygums", img: "med_132.gif", rarity: "black" },
            { position: 13, name: "Gedda Happycheek", img: "med_133.gif", rarity: "yellow" },
            { position: 14, name: "Korosu Crestscar", img: "med_134.gif", rarity: "yellow" },
            { position: 15, name: "Jeuru Stripedmane", img: "med_135.gif", rarity: "blue" },
            { position: 16, name: "Money Tree", img: "med_136.gif", rarity: "purple" },
            { position: 17, name: "Chimi Magi", img: "med_137.gif", rarity: "blue" },
            { position: 18, name: "Guardian of Fire Magic", img: "med_138.gif", rarity: "blue" },
            { position: 19, name: "Guardian of Ice Magic", img: "med_139.gif", rarity: "yellow" },
            { position: 20, name: "The Hairy Tongue Beast", img: "med_140.gif", rarity: "holo" }
        ]
    },
    "8": {
        "album": "141-160",
        "list": [
            { position: 1, name: "Alhazad the Trader", img:  "med_141.gif", rarity: "red" },
            { position: 2, name: "Guardian of Life Magic", img:  "med_142.gif", rarity: "black" },
            { position: 3, name: "Rhiannon", img:  "med_143.gif", rarity: "blue" },
            { position: 4, name: "Guardian of Shock Magic", img:  "med_144.gif", rarity: "green" },
            { position: 5, name: "Ruali", img:  "med_145.gif", rarity: "red" },
            { position: 6, name: "Guardian of Spectral Magic", img:  "med_146.gif", rarity: "black" },
            { position: 7, name: "Advisor Wessle", img:  "med_147.gif", rarity: "pink" },
            { position: 8, name: "Princess Vyssa", img:  "med_148.gif", rarity: "yellow" },
            { position: 9, name: "King Coltzan III", img:  "med_149.gif", rarity: "green" },
            { position: 10, name: "Remnok the Nomad", img: "med_150.gif", rarity: "black" },
            { position: 11, name: "Goldwing", img: "med_151.gif", rarity: "blue" },
            { position: 12, name: "Daedelon", img: "med_152.gif", rarity: "black" },
            { position: 13, name: "Brack, Cactus Farmer", img: "med_153.gif", rarity: "green" },
            { position: 14, name: "Geirrod Sternhoof", img: "med_154.gif", rarity: "blue" },
            { position: 15, name: "Brista Lightfeet", img: "med_155.gif", rarity: "purple" },
            { position: 16, name: "Shoonee", img: "med_156.gif", rarity: "green" },
            { position: 17, name: "Cherlops, Protector of Garn", img: "med_157.gif", rarity: "yellow" },
            { position: 18, name: "Hubrid Nox", img: "med_158.gif", rarity: "yellow" },
            { position: 19, name: "Professor Agatha", img: "med_159.gif", rarity: "blue" },
            { position: 20, name: "Doctor", img: "med_160.gif", rarity: "blue" }
        ]
    },
    "9": {
        "album": "161-180",
        "list": [
            { position: 1, name: "Shahuaga The Red", img:  "med_161.gif", rarity: "purple" },
            { position: 2, name: "Rhan Tyr", img:  "med_162.gif", rarity: "green" },
            { position: 3, name: "Balthazar the Bounty Hunter", img:  "med_163.gif", rarity: "holo" },
            { position: 4, name: "Lustra the Golden Peophin", img:  "med_164.gif", rarity: "green" },
            { position: 5, name: "Arnie Hulltusk", img:  "med_165.gif", rarity: "blue" },
            { position: 6, name: "Lhika Burrtail", img:  "med_166.gif", rarity: "blue" },
            { position: 7, name: "Hagalugg", img:  "med_167.gif", rarity: "red" },
            { position: 8, name: "Ryshu", img:  "med_168.gif", rarity: "green" },
            { position: 9, name: "Captain Dread", img:  "med_169.gif", rarity: "red" },
            { position: 10, name: "Gelert Pack", img: "med_170.gif", rarity: "purple" },
            { position: 11, name: "Sir Wockilan the Brave", img: "med_171.gif", rarity: "red" },
            { position: 12, name: "Zephiea Boltheart", img: "med_172.gif", rarity: "green" },
            { position: 13, name: "Hagar Mountbane", img: "med_173.gif", rarity: "blue" },
            { position: 14, name: "Marillis Harbane", img: "med_174.gif", rarity: "yellow" },
            { position: 15, name: "Scorchio Mummy", img: "med_175.gif", rarity: "purple" },
            { position: 16, name: "Buzz Alchemist", img: "med_176.gif", rarity: "purple" },
            { position: 17, name: "Florg the Devourer", img: "med_177.gif", rarity: "blue" },
            { position: 18, name: "Hegred Aishann", img: "med_178.gif", rarity: "purple" },
            { position: 19, name: "Niten Hiroru", img: "med_179.gif", rarity: "green" },
            { position: 20, name: "Chen-Ra Son of the Sun", img: "med_180.gif", rarity: "green" }
        ]
    },
    "10": {
        "album": "181-200",
        "list": [
            { position: 1, name: "Uncle Tharg", img:  "med_181.gif", rarity: "pink" },
            { position: 2, name: "Venuquin", img:  "med_182.gif", rarity: "blue" },
            { position: 3, name: "Jasper Gen", img:  "med_183.gif", rarity: "holo" },
            { position: 4, name: "Duel Bazuka", img:  "med_184.gif", rarity: "yellow" },
            { position: 5, name: "Tyran Far", img:  "med_185.gif", rarity: "red" },
            { position: 6, name: "Grimilix", img:  "med_186.gif", rarity: "purple" },
            { position: 7, name: "Frostburn the Chia", img:  "med_187.gif", rarity: "pink" },
            { position: 8, name: "Keergo", img:  "med_188.gif", rarity: "green" },
            { position: 9, name: "Magnus the Torch", img:  "med_189.gif", rarity: "pink" },
            { position: 10, name: "Draconus Maximus", img: "med_190.gif", rarity: "yellow" },
            { position: 11, name: "Undead Farmer", img: "med_191.gif", rarity: "purple" },
            { position: 12, name: "Undead Grundo Shopkeeper", img: "med_192.gif", rarity: "red" },
            { position: 13, name: "Gog", img: "med_193.gif", rarity: "green" },
            { position: 14, name: "Nadia the Peophin of Love", img: "med_194.gif", rarity: "pink" },
            { position: 15, name: "Shyanna", img: "med_195.gif", rarity: "blue" },
            { position: 16, name: "Pteri Knight", img: "med_196.gif", rarity: "green" },
            { position: 17, name: "Captain Telhan", img: "med_197.gif", rarity: "blue" },
            { position: 18, name: "Scorchio Mage", img: "med_198.gif", rarity: "red" },
            { position: 19, name: "Darien", img: "med_199.gif", rarity: "blue" },
            { position: 20, name: "Sir Cheekalot", img: "med_200.gif", rarity: "red" }
        ],
    },
    "11": {
        "album": "201-220",
        "list": [
            { position: 1, name: "The Monocerous", img:  "med_201.gif", rarity: "holo" },
            { position: 2, name: "Swamp Ghoul", img:  "med_202.gif", rarity: "yellow" },
            { position: 3, name: "Solar Fyre", img:  "med_203.gif", rarity: "red" },
            { position: 4, name: "Ghartun The Grundo Commander", img:  "med_204.gif", rarity: "blue" },
            { position: 5, name: "Garrox5 The Grundo Trooper", img:  "med_205.gif", rarity: "yellow" },
            { position: 6, name: "Valkyrie", img:  "med_206.gif", rarity: "purple" },
            { position: 7, name: "Nocan Vish", img:  "med_207.gif", rarity: "yellow" },
            { position: 8, name: "Evil Sloth Clone #32", img:  "med_208.gif", rarity: "black" },
            { position: 9, name: "Lavender", img:  "med_209.gif", rarity: "green" },
            { position: 10, name: "Mechanoid Warrior", img: "med_210.gif", rarity: "yellow" },
            { position: 11, name: "Blarthrox", img: "med_211.gif", rarity: "purple" },
            { position: 12, name: "Rock Beast", img: "med_212.gif", rarity: "pink" },
            { position: 13, name: "The Monoceraptor", img: "med_213.gif", rarity: "holo" },
            { position: 14, name: "Grarrl Battlemaster", img: "med_214.gif", rarity: "pink" },
            { position: 15, name: "Umbus Alta", img: "med_215.gif", rarity: "purple" },
            { position: 16, name: "Imperius Flare", img: "med_216.gif", rarity: "black" },
            { position: 17, name: "Tyragh the Tyrannian Buzz", img: "med_217.gif", rarity: "black" },
            { position: 18, name: "Tazzalor", img: "med_218.gif", rarity: "purple" },
            { position: 19, name: "Kyrii Native", img: "med_219.gif", rarity: "blue" },
            { position: 20, name: "Kasuki Lu", img: "med_220.gif", rarity: "red" }
        ]
    },
    "12": {
        "album": "221-240",
        "list": [
            { position: 1, name: "Orig the Great", img:  "med_221.gif", rarity: "holo" },
            { position: 2, name: "Siona", img:  "med_222.gif", rarity: "yellow" },
            { position: 3, name: "Sir Fufon Lui", img:  "med_223.gif", rarity: "black" },
            { position: 4, name: "Luperus", img:  "med_224.gif", rarity: "green" },
            { position: 5, name: "Gutan Kai", img:  "med_225.gif", rarity: "red" },
            { position: 6, name: "Ukkrah the Fire Grarrl", img:  "med_226.gif", rarity: "pink" },
            { position: 7, name: "Grackle the Chia Bomber", img:  "med_227.gif", rarity: "purple" },
            { position: 8, name: "Slychi the Skeith Invader", img:  "med_228.gif", rarity: "blue" },
            { position: 9, name: "Lunchtime", img:  "med_229.gif", rarity: "yellow" },
            { position: 10, name: "Gragarex the Grarrl Trooper", img: "med_230.gif", rarity: "black" },
            { position: 11, name: "Feemix the Korbat Scout", img: "med_231.gif", rarity: "green" },
            { position: 12, name: "Kraag the Korbat Leader", img: "med_232.gif", rarity: "blue" },
            { position: 13, name: "Ghoul Catchers", img: "med_233.gif", rarity: "yellow" },
            { position: 14, name: "Zafara Hero", img: "med_234.gif", rarity: "pink" },
            { position: 15, name: "Plains Aisha", img: "med_235.gif", rarity: "green" },
            { position: 16, name: "Jannen", img: "med_236.gif", rarity: "red" },
            { position: 17, name: "Iyana the Earth Faerie", img: "med_237.gif", rarity: "purple" },
            { position: 18, name: "Godfried the Good", img: "med_238.gif", rarity: "red" },
            { position: 19, name: "Psellia the Air Faerie", img: "med_239.gif", rarity: "red" },
            { position: 20, name: "Usinda", img: "med_240.gif", rarity: "red" }
        ]
    },
    "13": {
        "album": "241-260",
        "list": [
            { position: 1, name: "Meerca Menace", img:  "med_241.gif", rarity: "red" },
            { position: 2, name: "Flying Shoyru", img:  "med_242.gif", rarity: "red" },
            { position: 3, name: "Highland Chia", img:  "med_243.gif", rarity: "red" },
            { position: 4, name: "A Light Faerie", img:  "med_244.gif", rarity: "black" },
            { position: 5, name: "The Battle Faerie", img:  "med_245.gif", rarity: "pink" },
            { position: 6, name: "Taelia The Snow Faerie", img:  "med_246.gif", rarity: "yellow" },
            { position: 7, name: "Zyrolon", img:  "med_247.gif", rarity: "green" },
            { position: 8, name: "Annual Gormball Championship", img:  "med_248.gif", rarity: "blue" },
            { position: 9, name: "Neopet Version Two", img:  "med_249.gif", rarity: "yellow" },
            { position: 10, name: "The Soup Faerie", img: "med_250.gif", rarity: "yellow" },
            { position: 11, name: "The Tooth Faerie", img: "med_251.gif", rarity: "pink" },
            { position: 12, name: "A Two Rings Crusader", img: "med_252.gif", rarity: "blue" },
            { position: 13, name: "The Negg Faerie", img: "med_253.gif", rarity: "purple" },
            { position: 14, name: "Kauvara", img: "med_254.gif", rarity: "yellow" },
            { position: 15, name: "Zafara Rogue", img: "med_255.gif", rarity: "blue" },
            { position: 16, name: "Malkus Vile", img: "med_256.gif", rarity: "blue" },
            { position: 17, name: "Lupe Warrior", img: "med_257.gif", rarity: "blue" },
            { position: 18, name: "The Lava Ghoul", img: "med_258.gif", rarity: "blue" },
            { position: 19, name: "Spectral Elemental", img: "med_259.gif", rarity: "blue" },
            { position: 20, name: "The Pant Devil", img: "med_260.gif", rarity: "yellow" }
        ]
    },
    "14": {
        "album": "261-280",
        "list": [
            { position: 1, name: "Fire Breathing Meerca", img:  "med_261.gif", rarity: "blue" },
            { position: 2, name: "Yes Boy Ice Cream", img:  "med_262.gif", rarity: "pink" },
            { position: 3, name: "M*ynci", img:  "med_263.gif", rarity: "blue" },
            { position: 4, name: "2 Gallon Hatz", img:  "med_264.gif", rarity: "green" },
            { position: 5, name: "Nereid the Water Faerie", img:  "med_265.gif", rarity: "blue" },
            { position: 6, name: "Sticks and Stones", img:  "med_266.gif", rarity: "blue" },
            { position: 7, name: "Uggaroo", img:  "med_267.gif", rarity: "blue" },
            { position: 8, name: "Dreaming", img:  "med_268.gif", rarity: "blue" },
            { position: 9, name: "Quiggle Warlord", img:  "med_269.gif", rarity: "blue" },
            { position: 10, name: "Quiggle Strongman", img: "med_270.gif", rarity: "blue" },
            { position: 11, name: "Sargug", img: "med_271.gif", rarity: "yellow" },
            { position: 12, name: "Trapped", img: "med_272.gif", rarity: "blue" },
            { position: 13, name: "Neoquest Hero", img: "med_273.gif", rarity: "blue" },
            { position: 14, name: "Undead Cybunny", img: "med_274.gif", rarity: "blue" },
            { position: 15, name: "Plesio", img: "med_275.gif", rarity: "pink" },
            { position: 16, name: "Chomby and the Fungus Balls", img: "med_276.gif", rarity: "black" },
            { position: 17, name: "The Space Faerie", img: "med_277.gif", rarity: "black" },
            { position: 18, name: "Wesley Clearheart", img: "med_278.gif", rarity: "purple" },
            { position: 19, name: "Bazri The Grundo", img: "med_279.gif", rarity: "purple" },
            { position: 20, name: "Dr_Death", img: "med_280.gif", rarity: "black" }
        ]
    },
    "15": {
        "album": "281-300",
        "list": [
            { position: 1, name: "Count Von Roo", img:  "med_281.gif", rarity: "green" },
            { position: 2, name: "Two Rings Wizard", img:  "med_282.gif", rarity: "pink" },
            { position: 3, name: "Temple Watchman", img:  "med_283.gif", rarity: "red" },
            { position: 4, name: "King Roo", img:  "med_284.gif", rarity: "yellow" },
            { position: 5, name: "Two Rings Warlock", img:  "med_285.gif", rarity: "blue" },
            { position: 6, name: "Two Rings Archmagus", img:  "med_286.gif", rarity: "blue" },
            { position: 7, name: "Garon the Lupe", img:  "med_287.gif", rarity: "black" },
            { position: 8, name: "00 Hog", img:  "med_288.gif", rarity: "black" },
            { position: 9, name: "Kalora the Kau", img:  "med_289.gif", rarity: "green" },
            { position: 10, name: "Chuffer Bob", img: "med_290.gif", rarity: "green" },
            { position: 11, name: "Branston the Eyrie", img: "med_291.gif", rarity: "yellow" },
            { position: 12, name: "Little Timmy", img: "med_292.gif", rarity: "holo" },
            { position: 13, name: "Alstaf Poogle", img: "med_293.gif", rarity: "holo" },
            { position: 14, name: "Zygorax", img: "med_294.gif", rarity: "yellow" },
            { position: 15, name: "Krawk card", img: "med_295.gif", rarity: "yellow" },
            { position: 16, name: "The Great Blurendo", img: "med_296.gif", rarity: "yellow" },
            { position: 17, name: "Meruth", img: "med_297.gif", rarity: "yellow" },
            { position: 18, name: "Captain Xelqued", img: "med_298.gif", rarity: "yellow" },
            { position: 19, name: "Space Krawk", img: "med_299.gif", rarity: "yellow" },
            { position: 20, name: "Iskha Lightbringer", img: "med_300.gif", rarity: "yellow" }
        ]
    },
    "16": {
        "album": "301-320",
        "list": [
            { position: 1, name: "Krawk Swashbuckler", img:  "med_301.gif", rarity: "yellow" },
            { position: 2, name: "Kyrii Sorceror", img:  "med_302.gif", rarity: "yellow" },
            { position: 3, name: "Extreme Herder", img:  "med_303.gif", rarity: "yellow" },
            { position: 4, name: "Sergeant Brexis", img:  "med_304.gif", rarity: "yellow" },
            { position: 5, name: "Champion", img:  "med_305.gif", rarity: "yellow" },
            { position: 6, name: "Illusen the Earth Faerie", img:  "med_306.gif", rarity: "yellow" },
            { position: 7, name: "Deckswabber", img:  "med_307.gif", rarity: "yellow" },
            { position: 8, name: "Jhudora the Dark Faerie", img:  "med_308.gif", rarity: "yellow" },
            { position: 9, name: "Calabrus the Cloud Aisha", img:  "med_309.gif", rarity: "holo" },
            { position: 10, name: "Lady Quintara", img: "med_310.gif", rarity: "yellow" },
            { position: 11, name: "Draik Paladin", img: "med_311.gif", rarity: "black" },
            { position: 12, name: "Jeran", img: "med_312.gif", rarity: "yellow" },
            { position: 13, name: "Valrigard", img: "med_313.gif", rarity: "yellow" },
            { position: 14, name: "Ixi Lancer", img: "med_314.gif", rarity: "black" },
            { position: 15, name: "Enchanted Ixi", img: "med_315.gif", rarity: "yellow" },
            { position: 16, name: "Kalandra", img: "med_316.gif", rarity: "yellow" },
            { position: 17, name: "Scratch Card Kiosk Wocky", img: "med_317.gif", rarity: "purple" },
            { position: 18, name: "Meuka", img: "med_318.gif", rarity: "black" },
            { position: 19, name: "Maths Nightmare", img: "med_319.gif", rarity: "black" },
            { position: 20, name: "Maitre D", img: "med_320.gif", rarity: "black" }
        ]
    },
    "17": {
        "album": "321-340",
        "list": [
            { position: 1, name: "The Storyteller", img:  "med_321.gif", rarity: "holo" },
            { position: 2, name: "Snow Wars Collectable Card", img:  "med_322.gif", rarity: "holo" },
            { position: 3, name: "Mutant Aisha Twins", img:  "med_323.gif", rarity: "black" },
            { position: 4, name: "Magax: Destroyer", img:  "med_324.gif", rarity: "black" },
            { position: 5, name: "Lord Darigan", img:  "med_325.gif", rarity: "yellow" },
            { position: 6, name: "Pacha The Vet", img:  "med_326.gif", rarity: "purple" },
            { position: 7, name: "Lightning Lenny", img:  "med_327.gif", rarity: "black" },
            { position: 8, name: "Khan the Unstoppable", img:  "med_328.gif", rarity: "yellow" },
            { position: 9, name: "Master Vex", img:  "med_329.gif", rarity: "yellow" },
            { position: 10, name: "Gilly the Usul", img: "med_330.gif", rarity: "yellow" },
            { position: 11, name: "Stan the Kyrii", img: "med_331.gif", rarity: "yellow" },
            { position: 12, name: "Dr. Flexo", img: "med_332.gif", rarity: "holo" },
            { position: 13, name: "Zeirn the Electric Kougra", img: "med_333.gif", rarity: "yellow" },
            { position: 14, name: "LDPBSTSCC", img: "med_334.gif", rarity: "black" },
            { position: 15, name: "Tug-O-War Card", img: "med_335.gif", rarity: "purple" },
            { position: 16, name: "Deserted Fairground Card", img: "med_336.gif", rarity: "black" },
            { position: 17, name: "Commander Garoo Card", img: "med_337.gif", rarity: "black" },
            { position: 18, name: "Korbats Lab Card", img: "med_338.gif", rarity: "green" },
            { position: 19, name: "Grarrl Keno Card", img: "med_339.gif", rarity: "green" },
            { position: 20, name: "Rainbow Fountain Card", img: "med_340.gif", rarity: "black" }
        ]
    },
    "18": {
        "album": "341-360",
        "list": [
            { position: 1, name: "The Tax Beast", img:  "med_341.gif", rarity: "yellow" },
            { position: 2, name: "Grey Faerie Card", img:  "med_342.gif", rarity: "black" },
            { position: 3, name: "Judge Hog", img:  "med_343.gif", rarity: "black" },
            { position: 4, name: "The Masked Intruder", img:  "med_344.gif", rarity: "black" },
            { position: 5, name: "Super Happy Icy Fun Snow Shop Card", img:  "med_345.gif", rarity: "holo" },
            { position: 6, name: "Lord Kass Card", img:  "med_346.gif", rarity: "yellow" },
            { position: 7, name: "Galem Darkhand", img:  "med_347.gif", rarity: "black" },
            { position: 8, name: "Armin the Small", img:  "med_348.gif", rarity: "black" },
            { position: 9, name: "Buzz Avenger", img:  "med_349.gif", rarity: "black" },
            { position: 10, name: "Berti the Creator", img: "med_350.gif", rarity: "black" },
            { position: 11, name: "Gadgadsbogen Festival", img: "med_351.gif", rarity: "black" },
            { position: 12, name: "Hasee Bounce Card", img: "med_352.gif", rarity: "black" },
            { position: 13, name: "Zafara Double Agent", img: "med_353.gif", rarity: "yellow" },
            { position: 14, name: "Sophie the Swamp Witch", img: "med_354.gif", rarity: "black" },
            { position: 15, name: "Kiko Explorer", img: "med_355.gif", rarity: "purple" },
            { position: 16, name: "Neopian Times 200th Anniversary Card", img: "med_356.gif", rarity: "holo" },
            { position: 17, name: "King Roos Nemesis", img: "med_357.gif", rarity: "purple" },
            { position: 18, name: "Merouladen and Heermeedjet", img: "med_358.gif", rarity: "black" },
            { position: 19, name: "King Hagan of Brightvale", img: "med_359.gif", rarity: "black" },
            { position: 20, name: "The Navigator", img: "med_360.gif", rarity: "purple" }
        ]
    },
    "19": {
        "album": "361-366",
        "list": [
            { position: 1, name: "Bruce Avenger", img: "med_361.gif", rarity: "black" },
            { position: 2, name: "Mysterious Aisha Sorceress", img: "med_362.gif", rarity: "purple" },
            { position: 3, name: "Mystical Hissi Knight", img: "med_363.gif", rarity: "green" },
            { position: 4, name: "Lenny Curator", img: "med_364.gif", rarity: "green" },
            { position: 5, name: "Tonunishiki", img: "med_365.gif", rarity: "purple" },
            { position: 6, name: "Jake the Explorer", img: "med_366.gif", rarity: "pink" }
        ]
    }
}

// Get the data for this album page
let pageID = location.search.match(/place=(\d+)&*/);

// If there is no pageID, then it is page 1
if (pageID === null) { pageID = 1 } 
else { pageID = pageID[1] }

const thisPage = CARD_LIST[pageID];

$("body").append(`
    <style>
        .fake-card {
            opacity: 25% !important;
        }
        .card-info {
            display: none;
        }
        .card-info.visible {
            display: block;
            text-align: center;
        }
        .card-info-table {
            width: 450px;
            margin: auto;
            border: 1px solid #b1b1b1;
            border-collapse: collapse;
        }
        .card-info-table td {
            padding: 6px;
        }
        .searchimg {
            width: 35px !important;
            height: 35px !important;
        }
        .content table img {
            cursor: pointer;
        }

        .card-info-arrow:hover {
            background: #dfdfdf;
        }

        img[rarity="blue"] { border: solid #00AFD4 4px; }
        img[rarity="blue"].card-selected { box-shadow: #00AFD4 0px 20px 30px -10px; }
  
        img[rarity="red"] { border: solid #FF4848 4px; }
        img[rarity="red"].card-selected { box-shadow: #FF4848 0px 20px 30px -10px; }
  
        img[rarity="pink"] { border: solid #ED79C3 4px; }
        img[rarity="pink"].card-selected { box-shadow: #ED79C3 0px 20px 30px -10px; }

        img[rarity="green"] { border: solid #1BB12C 4px; }
        img[rarity="green"].card-selected { box-shadow: #1BB12C 0px 20px 30px -10px; }

        img[rarity="purple"] { border: solid #B347B4 4px; }
        img[rarity="purple"].card-selected { box-shadow: #B347B4 0px 20px 30px -10px; }
  
        img[rarity="black"] { border: solid #404040 4px; }
        img[rarity="black"].card-selected { box-shadow: #404040 0px 20px 30px -10px; }
  
        img[rarity="yellow"] { border: solid #FEC635 4px; }
        img[rarity="yellow"].card-selected { box-shadow: #FEC635 0px 20px 30px -10px; }
  
        img[rarity="holo"] { border: solid #AE9EAD 4px; }
        img[rarity="holo"].card-selected { box-shadow: #000000 0px 20px 30px -10px; }
    </style>
`);

// Replace the images
let infoContent = {};
$("#content > table > tbody > tr > td.content > center:nth-child(16) > p:nth-child(2) > table img")
    .each((index, element) => {

    const { position, name, img, rarity } = thisPage["list"][index];

    $(element).attr("position", position).attr("rarity", rarity);

    if ($(element).attr("src").includes("tradingcardback")) {
        $(element)
            .addClass("fake-card")
            .attr("title", name)
            .attr("src", `http://images.neopets.com/games/tradingcards/${img}`)
            .attr("alt", name)
            .attr("rarity", rarity);
    }

    infoContent[position] = createInfoContent(element);

    $(element).on("click", () => {
        $(".card-info").html(infoContent[position]).show();
        $(".content table td img").removeClass("card-selected");
        $(element).addClass("card-selected");
    });

    if (hasPremium && name !== "No Stamp") {
        $(element).on("dblclick", function () {
            sswopen(name);
        });
    }
});

function createInfoContent(imgElement) {

    const $img = $(imgElement);
    const src = $img.attr("src");
    const cardName = $img.attr("alt");
    const position = $img.attr("position");
    const rarity = $img.attr("rarity");
    const hasCard = $img.hasClass("fake-card") === false;
    const hasCardText = `Status: ${hasCard ? '<b style="color: green">Collected!</b>' : '<b style="color: red">Not collected</b>'}`;

    const rarityText = r => {
        if (r === "blue") {return `<strong style="color:#00AFD4">Blue (r93 and lower)</strong>`;}
        if (r === "red") {return `<strong style="color:#FF4848">Red (r40-50)</strong>`;}
        if (r === "pink") {return `<strong style="color:#ED79C3">Pink (r51-60)</strong>`;}
        if (r === "green") {return `<strong style="color:#1BB12C">Green (r61-70)</strong>`;}
        if (r === "purple") {return `<strong style="color:#B347B4">Purple (r71-80)</strong>`;}
        if (r === "black") {return `<strong style="color:#404040">Black (r81-90)</strong>`;}
        if (r === "yellow") {return `<strong style="color:#FEC635">Yellow (r91-99)</strong>`;}
        if (r === "holo") {return `<strong style="color:#AE9EAD">Holographic (r100 and above)</strong>`;}
    };

    const createHelper = itemName => {
        // From diceroll's Search Helper script - https://github.com/diceroll123/NeoSearchHelper
        const linkmap = { // for urls and images for each search type
            ssw: {
                img: "http://images.neopets.com/premium/shopwizard/ssw-icon.svg"
            },
            sw: {
                url: "http://www.neopets.com/shops/wizard.phtml?string=%s",
                img: "http://images.neopets.com/themes/h5/basic/images/shopwizard-icon.png"
            },
            tp: {
                url: "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=item_exact&search_string=%s",
                img: "http://images.neopets.com/themes/h5/basic/images/tradingpost-icon.png"
            },
            au: {
                url: "http://www.neopets.com/genie.phtml?type=process_genie&criteria=exact&auctiongenie=%s",
                img: "http://images.neopets.com/themes/h5/basic/images/auction-icon.png"
            },
            sdb: {
                url: "http://www.neopets.com/safetydeposit.phtml?obj_name=%s&category=0",
                img: "http://images.neopets.com/images/emptydepositbox.gif"
            },
            jni: {
                url: "https://items.jellyneo.net/search/?name=%s&name_type=3",
                img: "http://images.neopets.com/items/toy_plushie_negg_fish.gif"
            }
        };

        const combiner = (item, url, image) => {
            url = url.replace("%s", item);
            return `<a tabindex='-1' target='_blank' href='${url}'><img src='${image}' class='searchimg'></a>`;
        };

        const sswhelper = item => {
            let ssw = ``;
            if (hasPremium) {
                ssw = `<img item="${item}" class="card-ssw-helper searchimg" src="${linkmap.ssw.img}">`;
            }
            return ssw;
        };

        return `<span class="search-helper">${sswhelper(itemName)}${combiner(itemName, linkmap.sw.url, linkmap.sw.img)}${combiner(itemName, linkmap.tp.url, linkmap.tp.img)}${combiner(itemName, linkmap.au.url, linkmap.au.img)}${combiner(itemName, linkmap.sdb.url, linkmap.sdb.img)}${combiner(itemName, linkmap.jni.url, linkmap.jni.img)}</span>`;
    };

    return `<br>
<table class="card-info-table" item="${cardName}">
    <tr>
        <td class="card-info-arrow prev-arrow" rowspan="4"><img alt="Previous" src="http://images.neopets.com/themes/h5/premium/images/arrow-left.svg" style="width: 20px"></td>
        <td rowspan="4" style="width: 30%; text-align: center;"><img src="${src}"></td>
        <td style="text-align: center; font-weight: bold; padding: 12px;">${cardName}<br>${rarityText(rarity)}</td>
        <td class="card-info-arrow next-arrow" rowspan="4"><img alt="Next" src="http://images.neopets.com/themes/h5/premium/images/arrow-right.svg" style="width: 20px"></td>
    </tr>
    <tr>
        <td>Position: <b id="current-card-pos">${position}</b></td>
    </tr>
    <tr>
        <td>${hasCardText}</td>
    </tr>
    <tr>
        <td style="text-align: center; padding: 16px 6px;">${createHelper(cardName)}</td>
    </tr>
</table>
    `;
}

// Add card info menu
$(".content").append(`<p class="card-info"></p>`);

// Add right-click tip
if (hasPremium) {
    $(".content").append(`<p style="text-align: center; font-style: italic; color: green; font-weight: bold">Double-click the card to search it<br>on the Super Shop Wizard!</p>`)
}

const jnfish = `<img src="http://images.neopets.com/items/toy_plushie_negg_fish.gif" style="width: 30px; height: 30px; vertical-align: middle;">`;
$(".content").append(`<p style="text-align: center;"><a href="https://items.jellyneo.net/search/?cat[]=39&sort=8&limit=20&not_in_scat[]=77&start=${CARD_LIST[pageID].album}" target="_blank">${jnfish}&nbsp;Album info&nbsp;${jnfish}</a></p>`);

// SSW icon
$("body").on("click", ".card-ssw-helper", function () {
    const item = $(this).attr("item");
    sswopen(item);
});

function sswopen(item) {
    if ($(".sswdrop").hasClass("panel_hidden")) {
        $("#sswmenu .imgmenu").click();
    }
    if ($("#ssw-tabs-1").hasClass("ui-tabs-hide")) {
        $("#button-new-search").click();
    }

    $("#ssw-criteria").val("exact");
    $("#searchstr").val(item);
}

// Card prev/next arrow
$("body").on("click", ".card-info-arrow", function () {
    const isNext = $(this).hasClass("next-arrow");
    const isPrev = $(this).hasClass("prev-arrow");

    const position = parseInt($("#current-card-pos").html());
    console.log(position);

    const newPosition = (function () {
        if (position === 25 && isNext) {
            return 1;
        }
        if (position === 1 && isPrev) {
            return 25;
        }
        if (isNext) {
            return position + 1;
        }
        if (isPrev) {
            return position - 1;
        }
    })();

    $(`img[position='${newPosition}']`).click();
});
