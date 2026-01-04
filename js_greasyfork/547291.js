// ==UserScript==
// @name         [GC][Backup] - Enhanced Relic Log View
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @version      3.10.2
// @license      MIT
// @description  See additional details related to your relic log, included view filter options.
// @author       Cupkait
// @match        https://www.grundos.cafe/space/warehouse/*
// @match        https://www.grundos.cafe/search/items/*
// @match        https://www.grundos.cafe/space/warehouse/relics/#details
// @match        https://www.grundos.cafe/safetydeposit/*&category=999*
// @grant        none
// @icon        https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/547291/%5BGC%5D%5BBackup%5D%20-%20Enhanced%20Relic%20Log%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/547291/%5BGC%5D%5BBackup%5D%20-%20Enhanced%20Relic%20Log%20View.meta.js
// ==/UserScript==

const relicArray = [
  {
    "name": "Air Faerie Crown",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing any Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Air Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing an Air Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Ancient Lupe Wand",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Aquatic Gem",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/sutekstomb/'>Sutek's Tomb</a>.</li></ul>"
  },
  {
    "name": "Army Math Tools",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing History NeoSchool Course.</li></ul>"
  },
  {
    "name": "Attack Cape",
    "rarity": "",
    "origin": "<ul><li>Originally available as a prize in the 2023 Haunted House prize shop.</li></ul>"
  },
  {
    "name": "Attack Fork",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li></ul>"
  },
  {
    "name": "Bag of Occult Jelly",
    "rarity": "",
    "origin": "<ul><li>Possible reward when collecting from the <a href='/jelly/greenjelly/'>Green Jelly</a>.</li></ul>"
  },
  {
    "name": "Battle Plunger",
    "rarity": "",
    "origin": "<ul><li>Possible reward from <a href='/water/fishing/'>Underwater Fishing</a>.</li></ul>"
  },
  {
    "name": "Battle Quill",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Early Neopian History, Grammar and Language, Simple Spelling, Art, Geography, or Spanish NeoSchool Course.</li></ul>"
  },
  {
    "name": "Bit of Evil Clown",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/carnivalofterror/'>Carnival of Terror</a>.</li></ul>"
  },
  {
    "name": "Blizzard Ring",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Blood Grub",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching a <a href='search/items/?item_name=Pustravaganza%20Scratchcard'>Pustravaganza Scratchcard</a> or <a href='/search/items/?item_name=Rotting%20Riches%20Scratchcard'>Rotting Riches Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Boom Sticks",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/tntstaffsmasher/'>TNT Staff Smasher</a>.</li></ul>"
  },
  {
    "name": "Brain Tree Branch",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li></ul>"
  },
  {
    "name": "Brain Tree Knife",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=spooky'>Spooky Treasure Map</a>.</li></ul>"
  },
  {
    "name": "Brain Tree Mace",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li></ul>"
  },
  {
    "name": "Brain Tree Root",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=spooky'>Spooky Treasure Map</a>.</li></ul>"
  },
  {
    "name": "Brain Tree Splinters",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li></ul>"
  },
  {
    "name": "Cabbage of Mystery",
    "rarity": "",
    "origin": "<ul><li>Possible reward from <a href='/guilds'>Guild Gardens</a> with an inventory above 1,000.</li></ul>"
  },
  {
    "name": "Candy Club",
    "rarity": "",
    "origin": "<ul><li>Previously awarded during the annual Celebration Calendar.</li></ul>"
  },
  {
    "name": "Castle Defenders Shield",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing all 10 missions in <a href='/games/invasionofmeridell/'>Invasion of Meridell</a>.</li></ul>"
  },
  {
    "name": "Castle Defenders Sword",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing all 10 missions in <a href='/games/invasionofmeridell/'>Invasion of Meridell</a>.</li></ul>"
  },
  {
    "name": "Caustic Potion",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward when completing level 17 <a href='/faerieland/darkfaerie/'>Jhudora's Quest</a>.</li></ul>"
  },
  {
    "name": "Charles' Torch",
    "rarity": "",
    "origin": "<ul><li>Originally available as a prize in 2023 Haunted House prize shop.</li></ul>"
  },
  {
    "name": "Cobrall Wand",
    "rarity": "",
    "origin": "<ul><li>Possible reward when winning a round of <a href='/games/sakhmet_solitaire/'>Sakhmet Solitaire</a>.</li></ul>"
  },
  {
    "name": "Dark Faerie Dagger",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/faeriebubbles'>Faerie Bubbles</a>.</li></ul>"
  },
  {
    "name": "Dark Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a Dark Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Donny's Mallet",
    "rarity": "",
    "origin": "<ul><li>Originally awarded following the 2022 Snowball Fight.</li></ul>"
  },
  {
    "name": "Earth Faerie Dagger",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/faeriebubbles'>Faerie Bubbles</a>.</li></ul>"
  },
  {
    "name": "Earth Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing an Earth Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Earth Stone Gem",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/sutekstomb/'>Sutek's Tomb</a>.</li></ul>"
  },
  {
    "name": "Elephante Lamp",
    "rarity": "",
    "origin": "<ul><li>Possible reward when visiting <a href='/desert/shrine/'>Coltzan's Shrine</a>.</li></ul>"
  },
  {
    "name": "Eraser of the Dark Faerie",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Potion Brewing Basics NeoSchool Course.</li></ul>"
  },
  {
    "name": "Exploding Space Bugs",
    "rarity": "",
    "origin": "<ul><li>Possible reward for defeating an <a href='/dome/1p/select/?arena=5'>Space Arena</a> challenger.</li></ul>"
  },
  {
    "name": "Faerie Eraser",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Faerie Studies NeoSchool Course.</li></ul>"
  },
  {
    "name": "Fat Red Pen",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing History NeoSchool Course.</li></ul>"
  },
  {
    "name": "Fire Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a Fire Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Fire Stone Gem",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/sutekstomb/'>Sutek's Tomb</a>.</li></ul>"
  },
  {
    "name": "Frostbite Dart",
    "rarity": "",
    "origin": "<ul><li>Sold for 3,000 points in the 2023 Snowball Fight Prize Shop.</li></ul>"
  },
  {
    "name": "Fumpu Leaf Medallion",
    "rarity": "",
    "origin": "<ul><li>Possible reward when playing <a href='/island/tombola/'>Tombola</a>.</li></ul>"
  },
  {
    "name": "Garin's Sword",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/attackoftherevenge/'>Attack of the Revenge</a>.</li></ul>"
  },
  {
    "name": "Genie Orb",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Ghost Lupe Sword",
    "rarity": "",
    "origin": "<ul><li>Possible reward for defeating an <a href='/dome/1p/select/?arena=4'>Island Arena</a> challenger.</li></ul>"
  },
  {
    "name": "Golden Aisha Wand",
    "rarity": "",
    "origin": "<ul><li>Possible prize when you wish for the word 'relic' at the <a href='/wishing/'>Wishing Well</a> and have your wish granted.</li></ul>"
  },
  {
    "name": "Golden Meepit Statue",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/meepitjuicebreak/'>Meepit Juice Break</a>.</li><li>Possible reward from <a href='/water/fishing/'>Underwater Fishing</a>.</li></ul>"
  },
  {
    "name": "Golden Pirate Amulet",
    "rarity": "",
    "origin": "<ul><li>Possible reward when looking for <a href='/pirates/buriedtreasure/'>Buried Treasure</a>.</li></ul>"
  },
  {
    "name": "Good Snowball",
    "rarity": "",
    "origin": "<ul><li>Possible reward when visiting <a href='/island/mystichut/'>Island Music</a>.</li><li>Possible reward when stealing from the <a href='/winter/snowager/'>Snowager</a>.</li></ul>"
  },
  {
    "name": "Grarrg Tooth",
    "rarity": "",
    "origin": "<ul><li>Possible prize for landing on the Grarrl space at the <a href='/prehistoric/wheel'>Wheel of Mediocrity</a>.</li></ul>"
  },
  {
    "name": "Great Snowball",
    "rarity": "",
    "origin": "<ul><li>Sold for 3,000 points in the 2023 Snowball Fight Prize Shop.</li></ul>"
  },
  {
    "name": "Grundo Gavel",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/staffsmasher/'>GC Staff Smasher</a>.</li></ul>"
  },
  {
    "name": "Halloween Aisha Bucket",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing History NeoSchool Course.</li></ul>"
  },
  {
    "name": "Happy Anniversary Negg",
    "rarity": "",
    "origin": "<ul><li>Possible reward when feeding a <strong>Very Sad</strong> kad at the <a href='/games/kadoatery/'>Kadoatery</a>.</li></ul>"
  },
  {
    "name": "Happy Negg Eraser",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Basic Mathematics or Fishing NeoSchool Course.</li></ul>"
  },
  {
    "name": "Hawk Bracelet",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Hawk Wand",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Iced Wand",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Iceray Bracelet",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
    {
    "name": "Illusens Bow",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward when completing level 23 <a href='/faerieland/earthfaerie/'>Illusen's Quest</a>.</li></ul>"
  },
  {
    "name": "Irregulation Chainmail",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/castleescape'>Escape from Meridell Castle</a>.</li></ul>"
  },
  {
    "name": "Jar of Spiders",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/webofvernax'>Web of Vernax</a>.</li></ul>"
  },
  {
    "name": "King Kelpbeards Blessing",
    "rarity": "",
    "origin": "<ul><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=underwater'>Underwater Treasure Map</a>.</li><li>Possible reward from <a href='/water/fishing/'>Underwater Fishing</a>.</li></ul>"
  },
  {
    "name": "Lava Rock",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/destructomatch'>Destruct-O-Match</a>.</li></ul>"
  },
  {
    "name": "Legendary von Roo Ring",
    "rarity": "",
    "origin": "<ul><li>Possible prize for landing on the Gift space at the <a href='/halloween/wheel'>Wheel of Misfortune</a>.</li></ul>"
  },
  {
    "name": "Light Faerie Dagger",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/faeriebubbles'>Faerie Bubbles</a>.</li></ul>"
  },
  {
    "name": "Light Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing an Light Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Magic Branch",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li></ul>"
  },
  {
    "name": "Magnus Club",
    "rarity": "",
    "origin": "<ul><li>Possible reward for defeating an <a href='/dome/1p/select/?arena=7'>Tyrannian Arena</a> challenger.</li></ul>"
  },
  {
    "name": "Malice Potion",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward when completing level 20 <a href='/faerieland/darkfaerie/'>Jhudora's Quest</a>.</li></ul>"
  },
  {
    "name": "Maraquan Shieldmaidens Blade",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/jubblebubble/'>Jubble Bubble</a>.</li></ul>"
  },
  {
    "name": "Maraquan War Token",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/jubblebubble/'>Jubble Bubble</a>.</li></ul>"
  },
  {
    "name": "Melting Mirror",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching a <a href='search/items/?item_name=Pustravaganza%20Scratchcard'>Pustravaganza Scratchcard</a> or <a href='/search/items/?item_name=Rotting%20Riches%20Scratchcard'>Rotting Riches Scratchcard</a>.</li></ul>"
  },
    {
    "name": "Moach Brooch",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing History NeoSchool Course.</li><li>If another source is discovered, please neomail Cupkait</li></ul>"
  },
  {
    "name": "Mystic Guitar",
    "rarity": "",
    "origin": "<ul><li>Possible reward when visiting <a href='/island/mystichut/'>Island Music</a>.</li></ul>"
  },
  {
    "name": "Mystic Jelly Bean Necklace",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/jellyblobs'>Jelly Blobs of Doom</a>.</li></ul>"
  },
  {
    "name": "Mystical Fish Lobber",
    "rarity": "",
    "origin": "<ul><li>Possible reward from <a href='/water/fishing/'>Underwater Fishing</a>.</li></ul>"
  },
  {
    "name": "Neutron Wand",
    "rarity": "",
    "origin": "<ul><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=space'>Space Map</a>.</li></ul>"
  },
  {
    "name": "Nimmo Finger",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching a <a href='search/items/?item_name=Pustravaganza%20Scratchcard'>Pustravaganza Scratchcard</a> or <a href='/search/items/?item_name=Rotting%20Riches%20Scratchcard'>Rotting Riches Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Official Prissy Miss Hair Brush",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/usukifrenzy/'>Usuki Frenzy</a>.</li></ul>"
  },
  {
    "name": "Patched Magic Hat",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing an <a href='/halloween/witchtower/'>Edna's Quest</a>.</li><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=spooky'>Spooky Treasure Map</a>.</li></ul>"
  },
  {
    "name": "Pear of Disintegration",
    "rarity": "",
    "origin": "<ul><li>Possible reward from <a href='/gulids/'>Guild Gardens</a> with an inventory above 1,000.</li></ul>"
  },
  {
    "name": "Petpet Bone",
    "rarity": "",
    "origin": "<ul><li>Possible reward when waking <a href='/medieval/turmaculus/'>Turmaculus</a>.</li></ul>"
  },
  {
    "name": "Platinum Dubloon",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/dubloondisaster'>Dubloon Disaster</a>.</li></ul>"
  },
  {
    "name": "Poké Ball",
    "rarity": "",
    "origin": "<ul><li>Randomly awarded through an extremely rare site-wide random event.</li></ul>"
  },
  {
    "name": "Power Negg Eraser",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Neopian Driver's Ed or Physical Education NeoSchool Course.</li></ul>"
  },
  {
    "name": "Pumpkin Stick",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching a <a href='search/items/?item_name=Pustravaganza%20Scratchcard'>Pustravaganza Scratchcard</a> or <a href='/search/items/?item_name=Rotting%20Riches%20Scratchcard'>Rotting Riches Scratchcard</a>.<li>Possible prize item from <a href='/games/html5/carnivakofterror'>Carnival of Terror</a>.</li></ul>"
  },
  {
    "name": "Radish Bow",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/bullseye'>Ultimate Bullseye</a>.</li></ul>"
  },
  {
    "name": "Rainbow Cybunny Wand",
    "rarity": "",
    "origin": "<ul><li>Possible prize when you wish for the word 'relic' at the <a href='/wishing/'>Wishing Well</a> and have your wish granted.</li></ul>"
  },
  {
    "name": "Rainbow Kacheek Pendant",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing History NeoSchool Course.</li></ul>"
  },
  {
    "name": "Rainbow Negg Eraser",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Science or Computer Science NeoSchool Course.</li></ul>"
  },
  {
    "name": "Rainbow Pteri Feather",
    "rarity": "",
    "origin": "<ul><li>Possible reward when playing <a href='/island/tombola/'>Tombola</a>.</li><li>Randomly dropped when receiving the 'golden pteri' site-wide random event.</li></ul>"
  },
  {
    "name": "Reinvented Wheel",
    "rarity": "",
    "origin": "<ul><li>Randomly available to purchase for 14 credits from the <a href='/games/emporium/'>Puzzle Emporium</a>.</li></ul>"
  },
  {
    "name": "Ring of the Lost",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='/search/items/?item_name=Bagguss%20Bonanza%20Scratchcard'>Bagguss Bonanza Scratchcard</a> or <a href='/search/items/?item_name=Sandtravaganza%20Scratchcard'>Sandtravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Robo Sloth Fist of Power",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward for receiving an A or higher in Back to Business NeoSchool Course.</li></ul>"
  },
  {
    "name": "Royal Wedding Ring",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='/search/items/?item_name=Bagguss%20Bonanza%20Scratchcard'>Bagguss Bonanza Scratchcard</a> or <a href='/search/items/?item_name=Sandtravaganza%20Scratchcard'>Sandtravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Rusty Garden Pitchfork",
    "rarity": "",
    "origin": "<ul><li>Possible item you can find during <a href='/medieval/pickyourown/index/'>Pick Your Own</a>.</li></ul>"
  },
  {
    "name": "Rutabaga Lance",
    "rarity": "",
    "origin": "<ul><li>Possible reward when guessing correctly at <a href='/medieval/potatocounter/'>Potato Counter</a>.</li></ul>"
  },
  {
    "name": "Scarab Amulet",
    "rarity": "",
    "origin": "<ul><li>Possible reward when winning a round of <a href='/games/sakhmet_solitaire/'>Sakhmet Solitaire</a>.</li></ul>"
  },
  {
    "name": "Scroll of Ultimate Knowledge",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing History NeoSchool Course.</li></ul>"
  },
  {
    "name": "Snow Beast Horn",
    "rarity": "",
    "origin": "<ul><li>Possible reward for defeating an <a href='/dome/1p/select/?arena=3'>Ice Arena</a> challenger.</li></ul>"
  },
  {
    "name": "Snowager Pendant",
    "rarity": "",
    "origin": "<ul><li>Possible reward when stealing from the <a href='/winter/snowager/'>Snowager</a>.</li></ul>"
  },
  {
    "name": "Snowager Sleep Ray",
    "rarity": "",
    "origin": "<ul><li>Sold for 3,000 points in the 2023 Snowball Fight Prize Shop.</li></ul>"
  },
  {
    "name": "Snowflake Pendant",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/icecreammachine'>Ice Cream Machine</a>.</li></ul>"
  },
  {
    "name": "Snowglobe Staff",
    "rarity": "",
    "origin": "<ul><li>Possible prize from scratching <a href='search/items/?item_name=Faeries%20Fortune%20Scratchcard'>Faeries Fortune Scratchcard</a>, <a href='/search/items/?item_name=Peak%20O%20Plenty%20Scratchcard'>Peak O Plenty Scratchcard</a>, or <a href='/search/items/?item_name=Icetravaganza%20Scratchcard'>Icetravaganza Scratchcard</a>.</li></ul>"
  },
  {
    "name": "Soul Stone",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing a <a href='/island/kitchen/'>Kitchen Quest</a>.</li></ul>"
  },
  {
    "name": "Space Amulet",
    "rarity": "",
    "origin": "<ul><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=space'>Space Map</a>.</li></ul>"
  },
  {
    "name": "Space Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a Space Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li></ul>"
  },
  {
    "name": "Space Faeries Shield",
    "rarity": "",
    "origin": "<ul><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=space'>Space Map</a>.</li></ul>"
  },
  {
    "name": "Spider Grundo Sword",
    "rarity": "",
    "origin": "<ul><li>Possible reward for defeating a <a href='/dome/1p/select/?arena=2'>Stone Dome</a> challenger.</li></ul>"
  },
  {
    "name": "Spirited Fiddle",
    "rarity": "",
    "origin": "<ul><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=spooky'>Spooky Treasure Map</a>.<li>Possible prize item from <a href='/games/html5/korbatslab'>Korbat's Lab</a>.</li></ul>"
  },
  {
    "name": "Spooky Slime",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing an <a href='/halloween/esophagor/'>Esophagor Quest</a>.</li><li>Randomly dropped when a slorg is thrown at you.</li></ul>"
  },
  {
    "name": "Squash Club",
    "rarity": "",
    "origin": "<ul><li>Possible reward when guessing correctly at <a href='/medieval/potatocounter/'>Potato Counter</a>.</li></ul>"
  },
  {
    "name": "Staff of Brain",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a <a href='/halloween/braintree/'>Brain Tree Quest</a>.</li></ul>"
  },
  {
    "name": "Starry Scorchio Wand",
    "rarity": "",
    "origin": "<ul><li>Possible prize when you wish for the word 'relic' at the <a href='/wishing/'>Wishing Well</a> and have your wish granted.</li></ul>"
  },
  {
    "name": "Superior Battle Plunger",
    "rarity": "",
    "origin": "<ul><li>Possible item you can find when jumping into the <a href='/halloween/toilet/'>Spooky Toilet</a>.</li></ul>"
  },
  {
    "name": "Trident of Chiazilla",
    "rarity": "",
    "origin": "<ul><li>Possible reward for defeating a <a href='/dome/1p/select/?arena=6'>Water Arena</a> challenger.</li></ul>"
  },
  {
    "name": "Trusty Hand Cannon",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/attackoftherevenge'>Attack of the Revenge</a>.</li></ul>"
  },
  {
    "name": "Tyrannian Amulet",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/volcanorun'>Volcano Run</a>.</li></ul>"
  },
  {
    "name": "Ultra Fire Gem",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/sutekstomb/'>Sutek's Tomb</a>.</li></ul>"
  },
  {
    "name": "Wand of the Snow Faerie",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing a <a href='/winter/snowfaerie/'>Snow Faerie Quest</a>.</li></ul>"
  },
  {
    "name": "Water Faerie Dagger",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/faeriebubbles'>Faerie Bubbles</a>.</li></ul>"
  },
  {
    "name": "Water Faerie Token",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing a Water Faerie Quest.</li><li>Possible prize item from <a href='/games/html5/faeriecloudracers/'>Faerie Cloud Racers</a>.</li><li>Possible reward when turning in a <a href='/games/treasurehunt/?type=underwater'>Underwater Treasure Map</a>.</li></ul>"
  },
  {
    "name": "Wind Up Rat",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward when completing level 32 <a href='/faerieland/darkfaerie/'>Jhudora's Quest</a>.</li></ul>"
  },
  {
    "name": "Witches Orb",
    "rarity": "",
    "origin": "<ul><li>Possible reward when completing an <a href='/halloween/witchtower/'>Edna's Quest</a>.</li></ul>"
  },
  {
    "name": "Wooden Compass",
    "rarity": "",
    "origin": "<ul><li>Guaranteed reward when turning in a <a href='/games/treasurehunt/?type=original'>Original Treasure Map</a>.</li></ul>"
  },
  {
    "name": "Zucchini Bat",
    "rarity": "",
    "origin": "<ul><li>Possible reward when guessing correctly at <a href='/medieval/potatocounter/'>Potato Counter</a>.</li></ul>"
  },
  {
    "name": "Bismuth",
    "rarity": "",
    "origin": "<ul><li>Originally available as a prize in 2024 Volcano Plot prize shop.</li></ul>"
  },
  {
    "name": "Gilly's Lantern",
    "rarity": "",
    "origin": "<ul><li>Originally available as a prize in 2024 Haunted House prize shop.</li></ul>"
  },
  {
    "name": "Hannahs Magic Rope",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/piratecaves'>Hannah and the Pirate Caves</a>.</li></ul>"
  },
  {
    "name": "Heart of the Ocean",
    "rarity": "",
    "origin": "<ul><li>Possible reward when visiting <a href='/island/mystichut/'>Island Music</a>.</li></ul>"
  },
  {
    "name": "Lenny de Barcelos",
    "rarity": "",
    "origin": "<ul><li>Possible reward for completing Portuguese NeoSchool Course.</li></ul>"
  },
  {
    "name": "Portable Seismometer",
    "rarity": "",
    "origin": "<ul><li>Originally available as a prize in 2024 Volcano Plot prize shop.</li></ul>"
  },
  {
    "name": "Stump of Despair",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/turmacroll'>Turmac Roll</a>.</li></ul>"
  },
  {
    "name": "The Bat",
    "rarity": "",
    "origin": "<ul><li>Possible prize item from <a href='/games/html5/kassbasher'>Kass Basher</a>.</li></ul>"
  },
  {
    "name": "Monotonous Dial",
    "rarity": "",
    "origin": "<ul><li>Possible prize for landing on the Paper space at the <a href='/prehistoric/monotony'>Wheel of Mediocrity</a>.</li></ul>"
  }
]

if (window.location.href.includes('/warehouse/relics/')) {
    const pageContent = document.getElementById('page_content');
    const relicCountElement = document.querySelector("#page_content > main > div.center > p:nth-child(2)");

    const relicCount = relicCountElement.innerText.replace(/[^\d/]/g, '');
    const [countLogged, relicTotal] = relicCount.split('/').map(value => parseInt(value.trim(), 10));

    const countNeeded = relicTotal - countLogged;
    const relicPercent = ((countLogged / relicTotal) * 100).toFixed(1);

    relicCountElement.innerHTML += `
        <br>Your collection is <strong>${relicPercent}%</strong> complete.
        <br>You are missing <strong>${countNeeded}</strong> relics.
        <br>Click <a href="https://www.grundos.cafe/safetydeposit/?query=&category=999&sort=count">here</a> to check for them in your SDB.<p style="font-size:9px"><i>https://www.grundos.cafe/space/warehouse/relics/?user=</i></p>`;

    createDropdown(relicCountElement);

    const flexColumns = document.querySelectorAll('.flex-column');
    const notLoggedSet = getNotLoggedRelics(flexColumns);

    if (!window.location.href.includes('/?user=')) {
        localStorage.setItem('notLoggedRelic', JSON.stringify(Array.from(notLoggedSet)));
        console.log("Logged list updated.");
    }

    applySelectedOption();
    highlightRarities();

}

if (window.location.href.includes('/safetydeposit/') && window.location.href.includes('&category=999')) {
    highlightMissingRelics('.flex-column.small-gap.break');
}

if (window.location.href === 'https://www.grundos.cafe/space/warehouse/') {
    highlightMissingRelics('.centered-item');
}

if (window.location.href.includes('/items/')) {
    displayRelicOrigin();
}

if (window.location.href.includes('#details')) {
    createDivs();
}

// Helper Functions

function createDropdown(parentElement) {
    const dropdown = document.createElement('select');
    dropdown.id = 'orderDropdown';
    dropdown.style.marginLeft = '10px';
    dropdown.style.marginBottom = '10px';

    const options = [
        { value: 'choose_view', text: 'Choose View', disabled: true, selected: true },
        { value: 'show_needed', text: 'Show Needed' },
        { value: 'show_logged', text: 'Show Logged' },
        { value: 'show_all', text: 'Show All' }
    ];

    options.forEach(({ value, text, disabled = false, selected = false }) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        option.disabled = disabled;
        option.selected = selected;
        dropdown.add(option);
    });

    const selectedOption = localStorage.getItem('selectedOption');
    if (selectedOption) dropdown.value = selectedOption;

    parentElement.parentNode.insertBefore(dropdown, parentElement.nextSibling);

    dropdown.addEventListener('change', () => {
        applySelectedOption();
        localStorage.setItem('selectedOption', dropdown.value);
    });
}

function toggleVisibility(elements, displayValue) {
    elements.forEach(element => {
        element.style.display = displayValue;
    });
}

function applySelectedOption() {
    const relicLoggedDivs = document.querySelectorAll('#reliclogged');
    const notLoggedDivs = document.querySelectorAll('#notlogged');
    const dropdown = document.getElementById('orderDropdown');

    if (dropdown.value === 'show_all') {
        toggleVisibility(relicLoggedDivs, '');
        toggleVisibility(notLoggedDivs, '');
    } else if (dropdown.value === 'show_needed') {
        toggleVisibility(relicLoggedDivs, 'none');
        toggleVisibility(notLoggedDivs, '');
    } else if (dropdown.value === 'show_logged') {
        toggleVisibility(notLoggedDivs, 'none');
        toggleVisibility(relicLoggedDivs, '');
    }
}

function getNotLoggedRelics(flexColumns) {
    const notLoggedSet = new Set();

    flexColumns.forEach(flexColumn => {
        const imagesWithOpacity = flexColumn.querySelectorAll('img[style*="opacity"]');
        const id = imagesWithOpacity.length > 0 ? 'notlogged' : 'reliclogged';
        flexColumn.setAttribute('id', id);

        if (id === 'notlogged') {
            const relicName = flexColumn.querySelector('strong').innerText;
            notLoggedSet.add(relicName);
        }
    });

    return notLoggedSet;
}

function highlightRarities() {
    const itemCards = document.querySelectorAll('.center-items');

    // Shoutout to Matt/masterofdarkness for TP link suggestion + leg work!
    itemCards.forEach(item => {
        const itemName = item.querySelector('strong').innerText;
        const tplink = ` <a target="_blank" class="searchhelp" href="https://www.grundos.cafe/island/tradingpost/browse/?query=${itemName}&autosubmit=1"><img src="https://grundoscafe.b-cdn.net/searchicons/coloured/trade.png"></a>`;

        item.querySelector('strong').insertAdjacentHTML('beforeend', tplink);

        const relic = relicArray.find(relic => relic.name === itemName);
        const relicRarity = relic?.rarity || null;

        if (relicRarity === 'Rarest') {
            item.style.border = '5px solid #bb3d3d4f';
        } else if (relicRarity === 'Common') {
            item.style.border = '5px solid #76da5d70';
        }

        // Set background color to red if no matching relic is found
        if (!relic) {
            item.style.backgroundColor = 'red';
        }
    });
}



function highlightMissingRelics(selector) {
    const items = document.querySelectorAll(selector);
    const notLoggedArray = JSON.parse(localStorage.getItem('notLoggedRelic')) || [];

    items.forEach(item => {
const itemName = item.querySelector('strong')?.innerText || item.querySelector('img')?.alt;
        if (notLoggedArray.includes(itemName)) {
            item.style.backgroundColor = 'yellow';
        }
    });
}



function displayRelicOrigin() {
    const itemCard = document.querySelector('.item-search-container');
    const itemName = itemCard.querySelector('.nomargin').innerText.trim();
    const relicOrigin = relicArray.find(item => item.name === itemName)?.origin || null;

    if (relicOrigin !== null) {
        const originDetails = document.createElement('div');
        originDetails.style.backgroundColor = 'beige';
        originDetails.style.padding = '30px';
        originDetails.style.border = '3px solid purple';
        originDetails.innerHTML = `
            <span style="font-weight: bold; color: purple; font-size: 16px;">Where is this relic from?</span>
            <span style="text-align:left;">${relicOrigin}</span>`;

        const parentElement = document.querySelector(".item-search-container");
        parentElement.insertAdjacentElement('afterend', originDetails);
    }
}

function createDivs() {
    const centerDiv = document.querySelector('#page_content');
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.width = '595px';
    centerDiv.innerHTML = null;
    centerDiv.appendChild(container);

    relicArray.forEach(relic => {
        const div = document.createElement('div');
        div.style.width = '575px';
        div.style.margin = '5px';
        div.style.padding = '10px';
        div.style.border = '1px solid black';

        const header = document.createElement('h3');
        header.textContent = relic.name;

        const body = document.createElement('p');
        body.innerHTML = relic.origin;

        div.appendChild(header);
        div.appendChild(body);
        container.appendChild(div);
    });
}