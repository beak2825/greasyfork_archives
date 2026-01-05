// ==UserScript==
// @name           MH Maps Tweaker
// @description    Rearrange mice in the map
// @author         Dusan Djordjevic
// @include        http://www.mousehuntgame.com/*
// @include        https://www.mousehuntgame.com/*
// @include        http://apps.facebook.com/mousehunt/*
// @include        https://apps.facebook.com/mousehunt/*
// @version        1.35 - GWH 2016
// @history        1.00 - Initial release
// @namespace      MH Tweaks
// @downloadURL https://update.greasyfork.org/scripts/5352/MH%20Maps%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/5352/MH%20Maps%20Tweaker.meta.js
// ==/UserScript==

VERSION = 1.35;

var LOCATIONS = {
    "Acolyte Realm<div style=\"font-size: 10px; font-weight: normal\">Ancient</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 22%</div>": ["Gorgon","Sorcerer","Spectre"],
    "Acolyte Realm<div style=\"font-size: 10px; font-weight: normal\">Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 33%</div>": ["Gate Guardian","Golem"],
    "Acolyte Realm<div style=\"font-size: 10px; font-weight: normal\">Runic</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 8%</div>": ["Acolyte","Chrono","Lich","Wight"],
    "Balack's Cove (High Tide)<div style=\"font-size: 10px; font-weight: normal\">Vanilla Stilton</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 85%</div>": ["Riptide"],
    "Balack's Cove (Low Tide)<div style=\"font-size: 10px; font-weight: normal\">Vanilla Stilton</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 19%</div>": ["Brimstone","Davy Jones","Tidal Fisher","Twisted Fiend"],
    "Balack's Cove (Low Tide)<div style=\"font-size: 10px; font-weight: normal\">Vengeful Vanilla Stilton</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 23%</div>": ["Enslaved Spirit"],
    "Balack's Cove (Mid Tide)<div style=\"font-size: 10px; font-weight: normal\">Vengeful Vanilla Stilton</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Balack the Banished","Derr Lich","Elub Lich","Nerg Lich"],
    "Bazaar<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Bionic","Granite","Steel"],
    "Bazaar<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Burglar"],
    "Burroughs Rift (Mist Level 0)<div style=\"font-size: 10px; font-weight: normal\">Brie String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Amplified White","Automated Sentry","Evil Scientist","Rift Bio Engineer"],
    "Burroughs Rift (Mist Level 0)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Amplified Brown","Amplified Grey","Cybernetic Specialist","Doktor","Portable Generator","Surgeon Bot"],
    "Burroughs Rift (Mist Level 1-5)<div style=\"font-size: 10px; font-weight: normal\">Magical String/Brie String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 24%</div>": ["Count Vampire","Phase Zombie","Prototype","Robat","Tech Ravenous Zombie"],
    "Burroughs Rift (Mist Level 1-5)<div style=\"font-size: 10px; font-weight: normal\">Polluted Parmesan</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 29%</div>": ["Mecha Tail","Radioactive Ooze","Toxikinetic"],
    "Burroughs Rift (Mist Level 1-5)<div style=\"font-size: 10px; font-weight: normal\">Terre Ricotta</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 23%</div>": ["Clump","Cyber Miner","Itty Bitty Rifty Burroughs","Pneumatic Dirt Displacement","Rifterranian"],
    "Burroughs Rift (Mist Level 19-20)<div style=\"font-size: 10px; font-weight: normal\">Magical String/Brie String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Monstrous Abomination"],
    "Burroughs Rift (Mist Level 19-20)<div style=\"font-size: 10px; font-weight: normal\">Polluted Parmesan</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Assassin Beast","Plutonium Tentacle","The Menace of the Rift"],
    "Burroughs Rift (Mist Level 19-20)<div style=\"font-size: 10px; font-weight: normal\">Terre Ricotta</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Big Bad Behemoth Burroughs"],
    "Burroughs Rift (Mist Level 6-18)<div style=\"font-size: 10px; font-weight: normal\">Magical String/Brie String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 24%</div>": ["Lycanoid","Revenant","Zombot Unipire the Third"],
    "Burroughs Rift (Mist Level 6-18)<div style=\"font-size: 10px; font-weight: normal\">Polluted Parmesan</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 21%</div>": ["Rancid Bog Beast","Super Mega Mecha Ultra RoboGold","Toxic Avenger"],
    "Burroughs Rift (Mist Level 6-18)<div style=\"font-size: 10px; font-weight: normal\">Terre Ricotta</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Boulder Biter","Lambent","Master Exploder"],
    "Calm Clearing<div style=\"font-size: 10px; font-weight: normal\">Cherry</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 22%</div>": ["Bear","Cherry","Cyclops","Shaman"],
    "Calm Clearing<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 15%</div>": ["Frog","Moosker"],
    "Calm Clearing<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 9%</div>": ["Wiggler"],
    "Cape Clawed<div style=\"font-size: 10px; font-weight: normal\">Crunchy</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 33%</div>": ["Aged","Healer","Trailblazer","Wordsmith"],
    "Cape Clawed<div style=\"font-size: 10px; font-weight: normal\">Gumbo</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 23%</div>": ["Caretaker","Grandfather","Narrator","Pathfinder"],
    "Cape Clawed<div style=\"font-size: 10px; font-weight: normal\">Shell</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Alchemist","Elder","Scout","Taleweaver"],
    "Catacombs<div style=\"font-size: 10px; font-weight: normal\">Ancient</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Skeleton"],
    "Catacombs<div style=\"font-size: 10px; font-weight: normal\">Ancient with Antiskele</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Keeper","Keeper's Assistant","Ooze","Spider"],
    "Catacombs<div style=\"font-size: 10px; font-weight: normal\">Radioactive Blue with Antiskele</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Giant Snail"],
    "Catacombs<div style=\"font-size: 10px; font-weight: normal\">Undead Emmental with Antiskele</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["Grave Robber","Terror Knight","Vampire"],
    "Claw Shot City<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Lasso Cowgirl"],
    "Claw Shot City (Hunting Bounty Hunter)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["Prospector","Ruffian","Tumbleweed"],
    "Claw Shot City (Hunting Bounty Hunter)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Bounty Hunter","Pyrite","Saloon Gal","Shopkeeper"],
    "Claw Shot City (Ringleaders)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Cardshark","Circuit Judge","Desperado","Outlaw","Stagecoach Driver","Undertaker"],
    "Crystal Library<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 7%</div>": ["Bookborn","Flutterby","Infiltrator","Pocketwatch"],
    "Crystal Library<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 1%</div>": ["Aether","Effervescent","Explorator","Scribe","Steam Grip","Tome Sprite","Walker"],
    "Crystal Library<div style=\"font-size: 10px; font-weight: normal\">SB+ with Scholar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Zurreal the Eternal"],
    "Cursed City (Curse Lifted)<div style=\"font-size: 10px; font-weight: normal\">Graveblossom Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 19%</div>": ["Corrupt","Essence Guardian"],
    "Cursed City (Curse Lifted)<div style=\"font-size: 10px; font-weight: normal\">Graveblossom Camembert with Shattering</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 27%</div>": ["Dark Magi"],
    "Cursed City (Cursed)<div style=\"font-size: 10px; font-weight: normal\">Graveblossom Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 22%</div>": ["Cursed Enchanter","Cursed Engineer","Cursed Librarian","Cursed Thief"],
    "Derr Dunes<div style=\"font-size: 10px; font-weight: normal\">Brie</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Sylvan"],
    "Derr Dunes<div style=\"font-size: 10px; font-weight: normal\">Crunchy</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Derr Chieftain","Gladiator","Guardian"],
    "Derr Dunes<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Grunt","Mintaka","Renegade","Seer","Spellbinder"],
    "Dojo<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 12%</div>": ["Samurai"],
    "Dojo<div style=\"font-size: 10px; font-weight: normal\">Maki</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 23%</div>": ["Student of the Cheese Claw","Assassin","Student of the Cheese Belt"],
    "Dracano<div style=\"font-size: 10px; font-weight: normal\">Inferno Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 29%</div>": ["Draconic Warden","Dragon","Whelpling"],
    "Elub Shore<div style=\"font-size: 10px; font-weight: normal\">Brie</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 24%</div>": ["Pinchy"],
    "Elub Shore<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Alnitak","Mystic","Pack","Soothsayer","Vanquisher"],
    "Elub Shore<div style=\"font-size: 10px; font-weight: normal\">Shell</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 28%</div>": ["Champion","Elub Chieftain","Protector"],
    "Event Mice<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 11%</div>": ["Birthday","Glitchpaw","High Roller","Hope","Leprechaun","Lucky","Mobster","Snooty","Treasurer"],
    "Fiery Warpath<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 11%</div>": ["Crimson Commander"],
    "Fiery Warpath (Wave 1)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Caravan Guard","Desert Archer","Desert Soldier","Gargantuamouse","Vanguard"],
    "Fiery Warpath (Wave 2)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 19%</div>": ["Flame Archer","Flame Warrior","Inferno Mage","Sand Cavalry","Sentinel"],
    "Fiery Warpath (Wave 3)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Crimson Ranger","Crimson Titan","Crimson Watch","Flame Ordnance","Magmarage","Sandwing Cavalry"],
    "Fiery Warpath (Wave 4)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 70%</div>": ["Theurgy Warden","Warmonger"],
    "Forbidden Grove<div style=\"font-size: 10px; font-weight: normal\">Ancient</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Gargoyle","Reaper"],
    "Forbidden Grove<div style=\"font-size: 10px; font-weight: normal\">Moon</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 22%</div>": ["Scavenger"],
    "Forbidden Grove<div style=\"font-size: 10px; font-weight: normal\">Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 13%</div>": ["Mutated Brown","Mutated Grey","Mutated White","Realm Ripper"],
    "Fungal Cavern<div style=\"font-size: 10px; font-weight: normal\">Diamond</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 64%</div>": ["Crystal Behemoth","Diamondhide","Huntereater"],
    "Fungal Cavern<div style=\"font-size: 10px; font-weight: normal\">Gemstone</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Crystal Golem","Crystal Lurker","Crystal Observer","Crystal Queen"],
    "Fungal Cavern<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 12%</div>": ["Cavern Crumbler","Crag Elder","Crystalline Slasher","Dirt Thing","Gemstone Worshipper","Shattered Obsidian","Splintered Stone Sentry","Stone Maiden"],
    "Fungal Cavern<div style=\"font-size: 10px; font-weight: normal\">Mineral</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["Crystal Cave Worm","Crystal Controller","Crystalback","Gemorpher","Stalagmite"],
    "Fungal Cavern<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 8%</div>": ["Bitter Root","Floating Spore","Funglore","Lumahead","Mouldy Mole","Mush","Mushroom Sprite","Nightshade Masquerade","Quillback","Spiked Burrower","Spore Muncher","Sporeticus"],
    "GES (Daredevil Canyon)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 15%</div>": ["Fuel"],
    "GES (Daredevil Canyon)<div style=\"font-size: 10px; font-weight: normal\">Gouda with Black Powder</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 26%</div>": ["Black Powder Thief"],
    "GES (Daredevil Canyon)<div style=\"font-size: 10px; font-weight: normal\">Gouda with Dusty Coal</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 27%</div>": ["Coal Shoveller"],
    "GES (Daredevil Canyon)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 21%</div>": ["Train Engineer"],
    "GES (Daredevil Canyon)<div style=\"font-size: 10px; font-weight: normal\">SB+ with Magmatic Crystal</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Magmatic Crystal Thief","Magmatic Golem"],
    "GES (Raider River)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 7%</div>": ["Automorat"],
    "GES (Raider River)<div style=\"font-size: 10px; font-weight: normal\">Gouda with Roof Rack</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Steel Horse Rider"],
    "GES (Raider River)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 7%</div>": ["Cannonball","Hookshot","Stoutgear"],
    "GES (Raider River)<div style=\"font-size: 10px; font-weight: normal\">SB+ with Roof Rack</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 12%</div>": ["Dangerous Duo","Mouse With No Name","Sharpshooter"],
    "GES (Supply Depot (No Supply Rush))<div style=\"font-size: 10px; font-weight: normal\">Gouda with Supply Schedule</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 11%</div>": ["Warehouse Manager"],
    "GES (Supply Depot (No Supply Rush))<div style=\"font-size: 10px; font-weight: normal\">SB+ with Supply Schedule</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Crate Camo","Cute Crate Carrier"],
    "GES (Supply Depot (Supply Rush))<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 50%</div>": ["Supply Hoarder"],
    "GES (Waiting)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Tonic Salesman","Angry Train Staff","Farrier"],
    "GES (Waiting)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 3%</div>": ["Parlour Player","Passenger","Photographer","Stowaway","Stuffy Banker","Train Conductor","Travelling Barber","Upper Class Lady","Bartender","Mysterious Traveller"],
    "Gnawnia Rift<div style=\"font-size: 10px; font-weight: normal\">Brie String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 15%</div>": ["Agitated Gentle Giant","Excitable Electric","Supernatural"],
    "Gnawnia Rift<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 9%</div>": ["Dream Drifter","Micro","Mighty Mole"],
    "Gnawnia Rift<div style=\"font-size: 10px; font-weight: normal\">Marble String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 19%</div>": ["Brawny","Greyrun","Riftweaver"],
    "Gnawnia Rift<div style=\"font-size: 10px; font-weight: normal\">Resonator</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Goliath Field"],
    "Gnawnia Rift<div style=\"font-size: 10px; font-weight: normal\">Riftiago</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Cyborg","Raw Diamond","Rift Guardian","Shard Centurion","Spiritual Steel","Wealth"],
    "Great Gnarled Tree<div style=\"font-size: 10px; font-weight: normal\">Gnarled</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 24%</div>": ["Curious Chemist","Eagle Owl","Fairy","Foxy"],
    "Great Gnarled Tree<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["Goldleaf"],
    
    "GWH Everywhere except flying<div style=\"font-size: 10px; font-weight: normal\">Standard</div>": ["Confused Courier","Greedy Al","Hoarder","Miser","Scrooge","Triple Lutz"],
    "GWH Everywhere<div style=\"font-size: 10px; font-weight: normal\">Standard</div>": ["Gingerbread","Present"],
    "GWH Everywhere<div style=\"font-size: 10px; font-weight: normal\">Any cheese + Winter charm</div>": ["Snowflake"],
    "GWH Winter Wasteland<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Borean Commander","Frigid Foreman","Glacia Ice Fist","Mouse of Winter Future","Mouse of Winter Past","Mouse of Winter Present","Snow Boulder","Snow Scavenger"],
    "GWH Toy Lot<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Destructoy","Ridiculous Sweater","Toy","Toy Tinkerer"],
    "GWH Toy Emporium<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Destructoy","Mad Elf","Nutcracker","Ridiculous Sweater","Slay Ride","Squeaker Claws","Toy","Toy Tinkerer"],
    "GWH Decorative Oasis<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Candy Cane","Christmas Tree","Ribbon","Snowglobe"],
    "GWH Tinsel Forest<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Candy Cane","Christmas Tree","Ornament","Ribbon","Snowglobe","Stocking","Wreath Thief"],
    "GWH Tinsel Forest<div style=\"font-size: 10px; font-weight: normal\">Arctic Asiago only</div>": ["Missile Toe"],
    "GWH Bunny Hills<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Free Skiing","Sporty Ski Instuctor","Toboggan Technician","Young Prodigy Racer"],
    "GWH Frosty Mountains<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Black Diamond Racer","Double Black Diamond Racer","Free Skiing","Nitro Racer","Sporty Ski Instuctor","Toboggan Technician","Young Prodigy Racer"],
    "GWH Frosty Mountains<div style=\"font-size: 10px; font-weight: normal\">Arctic Asiago only</div>": ["Nitro Racer"],
    "GWH Snowball Storm<div style=\"font-size: 10px; font-weight: normal\">Festive</div>": ["Builder","Reinbo", "S.N.O.W. Golem","Snow Fort","Snow Sorceress","Snowball Hoarder","Snowblower","Tundra Huntress"],
    "GWH Snowball Storm<div style=\"font-size: 10px; font-weight: normal\">Arctic Asiago only</div>": ["Stuck Snowball"],
    "GWH Flying<div style=\"font-size: 10px; font-weight: normal\">Any cheese</div>": ["Elf","Great Winter Hunt Impostor","Joy","Mouse of Winter Future","Mouse of Winter Past","Mouse of Winter Present","Present"],
    
    "Harbour<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Magic"],
    "Harbour<div style=\"font-size: 10px; font-weight: normal\">White Cheddar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Pirate"],
    "Iceberg (Bombing Run (Magnet))<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Stickybomber"],
    "Iceberg (Bombing Run)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Heavy Blaster"],
    "Iceberg (Brutal Bulwark)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Iceblock","Mammoth","Polar Bear","Snow Slinger"],
    "Iceberg (Generals)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["General Drheller","Lady Coldsnap","Lord Splodington","Princess Fist"],
    "Iceberg (Hidden Depths)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 34%</div>": ["Frostwing Commander","Living Salt"],
    "Iceberg (Icewing's Lair)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 69%</div>": ["Frostlance Guard","Icewing"],
    "Iceberg (The Deep Lair)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Deep"],
    "Iceberg (The Mad Depths (Hearthstone))<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Snowblind","Wolfskie"],
    "Iceberg (The Mad Depths (Magnet))<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 15%</div>": ["Iceblade","Water Wielder"],
    "Iceberg (Treacherous Tunnels (Magnet))<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 29%</div>": ["Chipper","Icebreaker"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">Creamy Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Jurassic"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">Crunchy Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Fetid Swamp"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">Magical Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Stonework Warrior"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">Pungent Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Chitinous"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 9%</div>": ["Pygmy Wrangler","Swarm of Pygmy Mice"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">Spicy Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Magma Carrier"],
    "Jungle of Dread<div style=\"font-size: 10px; font-weight: normal\">Sweet Havarti</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Primal"],
    "King's Arms<div style=\"font-size: 10px; font-weight: normal\">White Cheddar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 12%</div>": ["Longtail","Pugilist","Scruffy","Spotted"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Clockwork Samurai","Hapless Marionette","Puppet Master","Sock Puppet Ghost","Toy Sylvan","Wound Up White"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 2</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Bandit","Escape Artist","Impersonator","Lockpick","Rogue","Stealth"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 3</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Berserker","Cavalier","Fencer","Knight","Page","Phalanx"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 4</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 23%</div>": ["Cowbell","Dancer","Drummer","Fiddler","Guqin Player"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 5</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 23%</div>": ["Aquos","Black Mage","Ignis","Terra","Zephyr"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 6</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 21%</div>": ["Paladin","Sacred Shrine","White Mage"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 7</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 81%</div>": ["Fiend","Necromancer"],
    "King's Gauntlet<div style=\"font-size: 10px; font-weight: normal\">Tier 8</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Eclipse"],
    "Laboratory<div style=\"font-size: 10px; font-weight: normal\">Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Monster"],
    "Lagoon<div style=\"font-size: 10px; font-weight: normal\">Gnarled</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Centaur","Goblin","Nomad","Tiger","Troll","Water Nymph"],
    "Lagoon<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 21%</div>": ["Wicked Witch of Whisker Woods"],
    "Lagoon<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Elven Princess","Treant"],
    "Lagoon<div style=\"font-size: 10px; font-weight: normal\">Wicked Gnarly</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["Harpy","Hydra","Silth"],
    "Living Garden (Not Poured)<div style=\"font-size: 10px; font-weight: normal\">Duskshade Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Camoflower","Carmine the Apothecary","Shroom"],
    "Living Garden (Not Poured)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 21%</div>": ["Bark","Calalilly","Strawberry Hotcakes","Thistle"],
    "Living Garden (Poured)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Thirsty"],
    "Lost City (Curse Lifted)<div style=\"font-size: 10px; font-weight: normal\">Dewthief Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Essence Collector","Ethereal Librarian"],
    "Lost City (Cursed)<div style=\"font-size: 10px; font-weight: normal\">Dewthief Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 15%</div>": ["Cursed","Ethereal Enchanter","Ethereal Engineer","Ethereal Thief"],
    "M400 hunting<div style=\"font-size: 10px; font-weight: normal\">Fusion Fondue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["M400"],
    "Meadow<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 11%</div>": ["Flying","Tiny"],
    "Meadow<div style=\"font-size: 10px; font-weight: normal\">White Cheddar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 24%</div>": ["Field","Lightning Rod"],
    "Meditation Room<div style=\"font-size: 10px; font-weight: normal\">Combat</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Master of the Cheese Fang"],
    "Meditation Room<div style=\"font-size: 10px; font-weight: normal\">Glutter</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Master of the Cheese Belt"],
    "Meditation Room<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Hapless"],
    "Meditation Room<div style=\"font-size: 10px; font-weight: normal\">Susheese</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Master of the Cheese Claw"],
    "Mountain<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Abominable Snow","Black Widow","Fog","Frosty Snow","Pebble"],
    "Mountain<div style=\"font-size: 10px; font-weight: normal\">SB+ with Prospector's</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 36%</div>": ["Silvertail"],
    "Mountain<div style=\"font-size: 10px; font-weight: normal\">White Cheddar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 12%</div>": ["Frozen","Ninja"],
    "Mountain<div style=\"font-size: 10px; font-weight: normal\">White Cheddar with Prospector's</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 30%</div>": ["Diamond","Gold"],
    "Mousoleum<div style=\"font-size: 10px; font-weight: normal\">Moon</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 49%</div>": ["Lycan"],
    "Mousoleum<div style=\"font-size: 10px; font-weight: normal\">Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Bat","Gluttonous Zombie","Ravenous Zombie","Zombie"],
    "Mousoleum<div style=\"font-size: 10px; font-weight: normal\">Undead Emmental</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 29%</div>": ["Ghost","Mummy","Zombot Unipire"],
    "Muridae Market<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Falling Carpet","Pie Thief","Snake Charmer","Spice Merchant"],
    "Muridae Market<div style=\"font-size: 10px; font-weight: normal\">Gouda with Artisan</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Lumberjack"],
    "Muridae Market<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 9%</div>": ["Desert Architect","Desert Nomad","Market Guard","Market Thief"],
    "Muridae Market<div style=\"font-size: 10px; font-weight: normal\">SB+ with Artisan</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Blacksmith","Glass Blower","Limestone Miner","Mage Weaver"],
    "Nerg Plains<div style=\"font-size: 10px; font-weight: normal\">Brie</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 26%</div>": ["Chameleon"],
    "Nerg Plains<div style=\"font-size: 10px; font-weight: normal\">Gumbo</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 57%</div>": ["Defender","Nerg Chieftain","Slayer"],
    "Nerg Plains<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Alnilam","Beast Tamer","Conjurer","Conqueror","Finder"],
    "Pinnacle Chamber<div style=\"font-size: 10px; font-weight: normal\">Onyx Gorgonzola</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Dojo Sensei"],
    "Pinnacle Chamber<div style=\"font-size: 10px; font-weight: normal\">Rumble</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["Master of the Dojo"],
    "S.S. Huntington III<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 6%</div>": ["Bottled","Briegull","Captain","Leviathan","Salt Water Snapper","Shipwrecked","Swabbie"],
    "S.S. Huntington III<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 9%</div>": ["Buccaneer","Cook","Mermouse","Shelder","Siren","Squeaken"],
    "Sand Crypts<div style=\"font-size: 10px; font-weight: normal\">Graveblossom Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Sand Colossus","Sarcophamouse","Scarab","Serpentine"],
    "Sand Crypts<div style=\"font-size: 10px; font-weight: normal\">Graveblossom Camembert with Grub Scent</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["King Grub"],
    "Sand Crypts<div style=\"font-size: 10px; font-weight: normal\">Graveblossom Camembert with Shattering</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 99%</div>": ["King Scarab"],
    "Sand Dunes (No Stampede)<div style=\"font-size: 10px; font-weight: normal\">Dewthief Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Dunehopper","Grubling Herder","Sand Pilgrim"],
    "Sand Dunes (Stampede)<div style=\"font-size: 10px; font-weight: normal\">Dewthief Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 26%</div>": ["Quesodillo","Spiky Devil"],
    "Sand Dunes (Stampede)<div style=\"font-size: 10px; font-weight: normal\">Dewthief Camembert with Grubling Chow</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Grubling"],
    "Seasonal Garden (Fall)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 37%</div>": ["Harvest Harrier","Harvester","Pumpkin Head","Scarecrow","Whirleygig"],
    "Seasonal Garden (Fall)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Fall Familiar"],
    "Seasonal Garden (Spring)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Hydrophobe","Puddlemancer","Tanglefoot","Vinetail"],
    "Seasonal Garden (Spring)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Derpicorn","Spring Familiar"],
    "Seasonal Garden (Summer)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Firebreather","Stinger","Summer Mage"],
    "Seasonal Garden (Summer)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 21%</div>": ["Firefly","Hot Head","Monarch"],
    "Seasonal Garden (Winter)<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Bruticle","Icicle","Winter Mage"],
    "Seasonal Garden (Winter)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Frostbite","Over-Prepared","Penguin"],
    "Slushy Shoreline<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 15%</div>": ["Incompetent Ice Climber","Snow Bowler"],
    "Slushy Shoreline<div style=\"font-size: 10px; font-weight: normal\">Gouda with Softserve</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Saboteur","Snow Sniper","Yeti"],
    "Slushy Shoreline<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Living Ice","Snow Soldier"],
    "Carnivore Cove<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 26%</div>": ["Carnivore","Derpshark"],
    "Coral Castle<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Coral Dragon","Coral Gardener","Coral Guard","Coral Queen","Turret Guard"],
    "Coral Garden<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Coral Harvester"],
    "Coral Reef<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Coral","Coral Cuddler","Seadragon"],
    "Deep Oxygen Stream)<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Eel","Jellyfish"],
    "Sunken City (Docked)<div style=\"font-size: 10px; font-weight: normal\">Brie</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 41%</div>": ["City Noble","Sunken Citizen"],
    "Sunken City (Docked)<div style=\"font-size: 10px; font-weight: normal\">Fishy Fromage</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Clumsy Carrier","Elite Guardian","Enginseer","Oxygen Baron"],
    "Sunken City (Docked)<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 26%</div>": ["City Worker","Hydrologist"],
    "Feeding Grounds<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 35%</div>": ["Barracuda","Clownfish","Spear Fisher"],
    "Haunted Shipwreck<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Deep Sea Diver","Deranged Deckhand","Pirate Anchor","Sunken Banshee","Swashblade"],
    "Lair of the Ancients<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 65%</div>": ["Ancient of the Deep","Tritus"],
    "Lost Ruins<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Angler","Mershark","Octomermaid","Old One","Urchin King"],
    "Magma Flow<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Treasure Keeper"],
    "Mermouse Den<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Mermousette"],
    "Monster Trench<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 31%</div>": ["Serpent Monster"],
    "Murky Depths<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 16%</div>": ["Betta","Koimaid","Angelfish"],
    "Oxygen Stream<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 19%</div>": ["Stingray"],
    "Pearl Patch<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 30%</div>": ["Pearl Diver","Sand Dollar Queen"],
    "Rocky Outcrop<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Barnacle Beautician","Bottom Feeder","Crabolia"],
    "Sand Dollar Sea Bar<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 30%</div>": ["Saltwater Axolotl","Sand Dollar Diver"],
    "School of Mice<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Guppy","School of Mish","Tadpole"],
    "Shallow Shoals<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Cuttle","Manatee","Mlounder Flounder","Puffer"],
    "Shipwreck<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 17%</div>": ["Dread Pirate Mousert"],
    "Sunken Treasure<div style=\"font-size: 10px; font-weight: normal\">SB+/Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 35%</div>": ["Pearl","Treasure Hoarder"],
    "Tournament Hall<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 4%</div>": ["Crown Collector"],
    "Town of Digby<div style=\"font-size: 10px; font-weight: normal\">Limelight</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Big Bad Burroughs","Core Sample","Demolitions","Industrious Digger","Itty-Bitty Burroughs","Lambent Crystal","Miner","Nugget","Rock Muncher","Stone Cutter","Subterranean"],
    "Town of Gnawnia<div style=\"font-size: 10px; font-weight: normal\">Gilded</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 26%</div>": ["Master Burglar"],
    "Town of Gnawnia<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 18%</div>": ["Brown","Grey","White"],
    "Town of Gnawnia<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Nibbler"],
    "Town of Gnawnia<div style=\"font-size: 10px; font-weight: normal\">White Cheddar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 34%</div>": ["Cowardly","Dwarf"],
    "Toxic Spill<div style=\"font-size: 10px; font-weight: normal\">Rancid Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 12%</div>": ["Biohazard","Gelatinous Octahedron","Mutant Mongrel","Mutant Ninja","Mutated Behemoth","Mutated Siblings","Outbreak Assassin","Plague Hag","Scrap Metal Monster","Slimefist","Sludge","Sludge Soaker","Sludge Swimmer","Spore","Swamp Runner","Telekinetic Mutant","Tentacle","The Menace","Toxic Warrior"],
    "Toxic Spill (Hazmat and Lab Techs)<div style=\"font-size: 10px; font-weight: normal\">Rancid Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 50%</div>": ["Hazmat","Lab Technician"],
    "Toxic Spill (Knight)<div style=\"font-size: 10px; font-weight: normal\">Rancid Radioactive Blue</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Bog Beast","Monster Tail"],
    "Training Grounds<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 31%</div>": ["Archer","Dumpling Chef","Kung Fu","Monk","Worker"],
    "Twisted Garden (Not Poured)<div style=\"font-size: 10px; font-weight: normal\">Duskshade Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 20%</div>": ["Barkshell","Thorn","Twisted Hotcakes","Twisted Lilly"],
    "Twisted Garden (Not Poured)<div style=\"font-size: 10px; font-weight: normal\">Lunaria Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 35%</div>": ["Camofusion","Fungal Spore","Twisted Carmine"],
    "Twisted Garden (Not Poured)<div style=\"font-size: 10px; font-weight: normal\">Lunaria Camembert with Shattering</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 25%</div>": ["Shattered Carmine"],
    "Twisted Garden (Poured)<div style=\"font-size: 10px; font-weight: normal\">Duskshade Camembert</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Dehydrated"],
    "WWR (All Rage Level 25+)<div style=\"font-size: 10px; font-weight: normal\">Lactrodectus Lancashire</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 50%</div>": ["Monstrous Black Widow"],
    "WWR (Crazed Clearing)<div style=\"font-size: 10px; font-weight: normal\">Magical String with Cherry</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Cherry Sprite"],
    "WWR (Deep Lagoon)<div style=\"font-size: 10px; font-weight: normal\">Magical String with Stagnant</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Grizzled Silth"],
    "WWR (Gigantic Gnarled Tree)<div style=\"font-size: 10px; font-weight: normal\">Magical String with Gnarled</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Naturalist"],
    "WWR (Rage Level 0-24)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Bloomed Sylvan","Cranky Caterpillar","Crazed Goblin","Fungal Frog","Gilded Leaf","Karmachameleon","Mossy Moosker","Spirit of Balance","Twisted Treant","Water Sprite"],
    "WWR (Rage Level 25+ CC)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Treant Queen","Spirit Fox","Red-Eyed Watcher Owl"],
    "WWR (Rage Level 25+ DL)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Medicine","Tree Troll","Winged Harpy"],
    "WWR (Rage Level 25+ GGT)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Red Coat Bear","Rift Tiger","Nomadic Warrior"],
    "WWR (Rage Level 50 CC)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Cyclops Barbarian"],
    "WWR (Rage Level 50 DL)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Tri-dra"],
    "WWR (Rage Level 50 GGT)<div style=\"font-size: 10px; font-weight: normal\">Magical String</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 0%</div>": ["Centaur Ranger"],
    "Windmill<div style=\"font-size: 10px; font-weight: normal\">SB+</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 5%</div>": ["Farmhand","Mole","Speedy"],
    "Windmill<div style=\"font-size: 10px; font-weight: normal\">White Cheddar</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 19%</div>": ["Spud"],
    "Zugzwang's Tower<div style=\"font-size: 10px; font-weight: normal\">Checkmate</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 14%</div>": ["Chess Master","Mystic King","Mystic Queen","Technic King","Technic Queen"],
    "Zugzwang's Tower<div style=\"font-size: 10px; font-weight: normal\">Gouda</div>\<div style=\"font-size: 10px; font-weight: normal\">AR: 10%</div>": ["Mystic Bishop","Mystic Knight","Mystic Pawn","Mystic Rook","Technic Bishop","Technic Knight","Technic Pawn","Technic Rook"],
    "Labyrinth<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div>": ["Lost","Reanimated Carver","Corridor Bruiser","Lost Legionnaire"],
    "Labyrinth<div style=\"font-size: 10px; font-weight: normal\">SB+</div>": ["Shadow Stalker"],
    "<div style=\"background-color: #d851ff\">Fealty - Plain<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Drudge","Masked Pikeman"],    
    "<div style=\"background-color: #d851ff\">Fealty - Superior+<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Solemn Soldier","Mind Tearer"],    
    "<div style=\"background-color: #d851ff\">Fealty - Epic<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Dark Templar"],    
    "<div style=\"background-color: #d851ff\">Fealty - Temple (50+)<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Battle Cleric"],    
    "<div style=\"background-color: #d851ff\">Fealty - Sanctum (80+)<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Paladin Weapon Master","Sir Fleekio"],    
    "<div style=\"background-color: #21e2ff\">Tech - Plain<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["RR-8","Ash Golem"],    
    "<div style=\"background-color: #21e2ff\">Tech - Superior+<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Tech Golem","Automated Stone Sentry"],
    "<div style=\"background-color: #21e2ff\">Tech - Epic<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Fungal Technomorph"],            
    "<div style=\"background-color: #21e2ff\">Tech - Research Centre (50+)<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Exo-Tech"],    
    "<div style=\"background-color: #21e2ff\">Tech - Manaforge (80+)<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Manaforge Smith","Matron of Machinery"],    
    "<div style=\"background-color: #e96300\">Scholar - Plain<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Summoning Scholar","Sanguinarian"],
    "<div style=\"background-color: #e96300\">Scholar - Superior+<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Mystic Herald","Mystic Guardian"],            
    "<div style=\"background-color: #e96300\">Scholar - Epic<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Mystic Scholar"],            
    "<div style=\"background-color: #e96300\">Scholar - Auditorium (50+)<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Ethereal Guardian"],        
    "<div style=\"background-color: #e96300\">Scholar - Library (80+)<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Soul Binder","Ancient Scribe"],    
    "<div style=\"background-color: #11f400\">Farming - Plain<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Mushroom Harvester","Mush Monster"],    
    "<div style=\"background-color: #11f400\">Farming - Superior+<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Nightshade Nanny","Nightshade Fungalmancer"],    
    "<div style=\"background-color: #ffe400\">Treasury - Plain<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Hired Eidolon","Mimic"],    
    "<div style=\"background-color: #ffe400\">Treasury - Superior+<div style=\"font-size: 10px; font-weight: normal\">Glowing Gruyere</div></div>": ["Treasure Brawler","Matron of Wealth"]
};
    
var miceRows = {},
    miceGroups = {},
    miceImages = {},
    miceMap = [],
    miceOrdered = '',
    remainingMice = '',
    locationsLoaded = false;
    
var mapButton = document.getElementsByClassName('treasureMap')[0];
mapButton.addEventListener('click', doMap, false);

function doMap() {
    var loaded = (document.getElementsByClassName('treasureMapPopup-mice-group-header').length == 0) ? false : true;
    
    if(loaded) {
        prepareMice();
        rearrangeMice();
    } else {
        setTimeout(doMap, 1000);
    }
}

function prepareMice() {
    var miceContainer = document.getElementsByClassName('treasureMapPopup-miceBlockRow')[0],
        mice = miceContainer.getElementsByClassName('mice')[0],
        miceContent = mice.getElementsByClassName('treasureMapPopup-leftBlock-content')[0],
        miceContentDefault = miceContent.getElementsByClassName('treasureMapPopup-leftBlock-content-default')[0],
        //uncaughtmice1 = miceContentDefault.getElementsByClassName('treasureMapPopup-mice-groups')[0],
        //uncaughtmice2 = miceContentDefault.getElementsByClassName('treasureMapPopup-mice-groups')[1],
        uncaughtmice1 = miceContentDefault.children[0],
        uncaughtmice2 = miceContentDefault.children[1],
        uncaughtmice1empty = hasClass(uncaughtmice1, 'treasureMapPopup-miceWarning'),
        uncaughtmice2other = hasClass(uncaughtmice2, 'uncaughtmiceinotherenvironments'),
        miceGroupContainer1 = (uncaughtmice1empty) ? false : uncaughtmice1.getElementsByClassName('treasureMapPopup-mice-group-miceContainer')[0],
        miceGroupContainer2 = uncaughtmice2.getElementsByClassName('treasureMapPopup-mice-group-miceContainer')[0],
        miceMapUncaugth1 = (uncaughtmice1empty) ? false : miceGroupContainer1.getElementsByClassName('treasureMapPopup-mice-group-mouse'),
        miceMapUncaugth2 = miceGroupContainer2.getElementsByClassName('treasureMapPopup-mice-group-mouse');

    miceRows = {};
    miceGroups = {};
    miceSubGroups = {};
    miceImages = {};
    miceMap = [];
    
    if(!uncaughtmice1empty) {
        for(var i=0; i<miceMapUncaugth1.length; i++) {
            var mouseUncaughtElement = miceMapUncaugth1[i],
                mouseName = mouseUncaughtElement.getAttribute("data-name"),
                mouseGroup = mouseUncaughtElement.getAttribute("data-group"),
                mouseSubGroup = mouseUncaughtElement.getAttribute("data-subgroup"),
                mouseImg = mouseUncaughtElement.getAttribute("data-image");    
            miceRows[mouseName] = mouseUncaughtElement.innerHTML;
            miceGroups[mouseName] = mouseGroup;
            miceSubGroups[mouseName] = mouseSubGroup;
            miceImages[mouseName] = mouseImg;
            miceMap.push(mouseName);
        }
    }
    
    if(uncaughtmice2other) {
        for(var i=0; i<miceMapUncaugth2.length; i++) {
            var mouseUncaughtElement = miceMapUncaugth2[i],
                mouseName = mouseUncaughtElement.getAttribute("data-name"),
                mouseGroup = mouseUncaughtElement.getAttribute("data-group"),
                mouseSubGroup = mouseUncaughtElement.getAttribute("data-subgroup"),
                mouseImg = mouseUncaughtElement.getAttribute("data-image");    
            miceRows[mouseName] = mouseUncaughtElement.innerHTML;
            miceGroups[mouseName] = mouseGroup;
            miceSubGroups[mouseName] = mouseSubGroup;
            miceImages[mouseName] = mouseImg;
            miceMap.push(mouseName);
        }    
    }
    
    miceOrdered = '';
    remainingMice = '';
    
    // remove other env
    if(!uncaughtmice1empty && uncaughtmice2other) {
       miceContentDefault.removeChild(uncaughtmice2);    
    }
}
    
function rearrangeMice() {
    miceOrdered += '<div class="treasureMapPopup-mice-group-header" style="margin-top:10px">Uncaught Mice</div>';
    for(loc in LOCATIONS) {
        var mice = LOCATIONS[loc], miceList = '';
        for(key in mice) {
            var mouse = mice[key];
            if(arrayContains(miceMap, mouse)) {
                var mouseRawHtml = miceRows[mouse],
                    mouseHtml = mouseRawHtml.replace(new RegExp(mouse, 'g'), loc),
                    index = miceMap.indexOf(mouse);
                miceList += '<div onmouseout="app.views.TreasureMapView.map.removeHighlight(); return false;" onmouseover="app.views.TreasureMapView.map.highlightMouse(this);" data-name="'+mouse+'" data-group="'+miceGroups[mouse]+'" data-subgroup="'+miceSubGroups[mouse]+'" data-image="'+miceImages[mouse]+'" class="treasureMapPopup-mice-group-mouse treasureMapPopup-searchIndex" style="width: 33%">'+mouseHtml+'</div>';
                //miceList += '<div class="treasureMap-mice-group-row">'+mouseHtml+'</div>';
                miceMap.splice(index, 1); 
            }       
        }
        if(miceList.length > 0) {
            //miceOrdered += '<div class="treasureMapPopup-mice-group-header" style="margin-top:10px">'+loc+'</div>'+miceList;
            miceOrdered += miceList;
        }    
    }
    
    for(var i=0; i<miceMap.length; i++) {
        var mouse = miceMap[i];
        //remainingMice += '<div class="treasureMap-mice-group-row">'+miceRows[mouse]+'</div>';
        remainingMice += '<div onmouseout="app.views.TreasureMapView.map.removeHighlight(); return false;" onmouseover="app.views.TreasureMapView.map.highlightMouse(this);" data-name="'+mouse+'" data-group="'+miceGroups[mouse]+'" data-subgroup="'+miceSubGroups[mouse]+'" data-image="'+miceImages[mouse]+'" class="treasureMapPopup-mice-group-mouse treasureMapPopup-searchIndex">'+miceRows[mouse]+'</div>';
    }
    
    if(remainingMice != '') {
        miceOrdered += '<div class="treasureMapPopup-mice-group-header" style="margin-top:10px">Unknow Location</div>'+remainingMice;
    }

    var firstMiceGroup = document.getElementsByClassName('treasureMapPopup-mice-groups')[0];
    firstMiceGroup.innerHTML = miceOrdered;
}

function arrayContains(a, obj) { 
    var i = a.length; 
    while(i--) { 
       if(a[i] === obj) { 
           return true; 
       } 
    } 
    return false; 
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}