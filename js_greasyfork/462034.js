// ==UserScript==
// @name         🐭️ MouseHunt - Spring Egg Hunt Helper
// @version      1.5.2
// @description  Make the Spring Egg Hunt / Eggscavator interface better.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.5.3/mousehunt-utils.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/462034/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Spring%20Egg%20Hunt%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/462034/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Spring%20Egg%20Hunt%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * The ways to get each egg.
   */
  const ways = {
    // Interface / Misc.
    century_egg_convertible: 'Visit King\'s Crowns Tab of your <a href=\'/profile.php\'>Hunter Profile</a> if you have at least 100 silver crowns.',
    century_of_luck_egg_convertible: 'Have a trap setup with 100 or more Luck.',
    explorers_egg_convertible: 'Visit the <a href=\'https://www.mousehuntgame.com/travel.php?\'>Travel</a> page if you have at least 15 map pieces.',
    freshly_painted_egg_convertible: 'Visit your <a href=\'https://www.mousehuntgame.com/preferences.php?tab=game_settings\'>Game Settings</a>.',
    lucky_egg_convertible: 'Catch a mouse.',
    market_mogul_egg_convertible: 'Visit the <a href=\'https://www.mousehuntgame.com/marketplace.php\'>Marketplace</a>.',
    novice_journeyman_eggsweeper_convertible: 'Play Eggsweeper',
    over_9000_egg_convertible: 'Have a trap setup with 9001 or more Power.',
    teamwork_egg_convertible: 'Join a <a href=\'https://www.mousehuntgame.com/tournament.php\'>Tournament</a> or board a train.',
    treasure_clue_egg_convertible: 'Get a map Treasure Clue from a mouse.',
    workshop_egg_convertible: 'Visit the Workshop in Floating Islands.',

    // Equip / Activate
    enerchi_egg_convertible: 'Hunt with an Enerchi charm equipped.',
    bottled_wind_egg_convertible: 'Hunt with Bottled Wind active.',
    glowing_oil_egg_convertible: 'Hunt with Lanter Oil active.',
    queso_wild_tonic_egg_convertible: 'Hunt with Wild Tonic active.',
    chummy_egg_convertible: 'Hunt with Chum activated',

    // Misc
    deep_sea_egg_convertible: 'Dive more than 50,000 meters.',
    rain_egg_convertible: 'Charge the Rain Meter to 100%.',
    stealthy_egg_convertible: 'Have 100 or more stealth.',
    storm_egg_convertible: 'Catch a mouse with Lightning Aura active or catch a mouse with Rain and Wind at 100%.',
    wind_egg_convertible: 'Charge the Wind Meter to 100%.',
    wordy_egg_convertible: 'Claim your writing rewards when finishing an encyclopedia.',

    // Floating Islands.
    ancient_jade_egg_convertible: 'Hunt on any Island with one or more Ancient Jade tiles.',
    empyrean_seal_egg_convertible: 'Hunt on any Island with one or more Empyrean Seal tiles.',
    loot_cache_egg_convertible: 'Hunt on any Island with one or more Loot Cache tiles.',
    sky_gem_egg_convertible: 'Hunt on any Island with two or more Sky Glass tiles.',
    sky_ore_egg_convertible: 'Hunt on any Island with two or more Sky Ore tiles.',
    sky_pirate_egg_convertible: 'Hunt on any Island with one more Sky Pirate Den tiles.',
    sky_sprocket_egg_convertible: 'Catch a Paragon on any Island with a Sky Sprocket tile.',
    skysoft_silk_egg_convertible: 'Catch a Paragon on any Island with a Skysoft Silk tile.',
    enchanted_wing_egg_convertible: 'Catch a Paragon on any Island with a Enchanted Wing tile.',
    cloudstone_bangle_egg_convertible: 'Catch a Paragon on any Island with a Cloudstone Bangle tile.',
    sky_conqueror_egg_convertible: 'Clear 40 steps on a Low Altitude Island or High Altitude Island.',
    sky_explorer_egg_convertible: 'Clear 40 steps on any Island or Vault.',

    // Vrift
    puppet_floor_egg_convertible: 'Catch a mouse on a Puppet Floor (1).',
    thief_floor_egg_convertible: 'Catch a mouse on a Thief Floor (2).',
    melee_floor_egg_convertible: 'Catch a mouse on a Melee Floor (3).',
    bard_floor_egg_convertible: 'Catch a mouse on a Bard Floor (4).',
    magic_floor_egg_convertible: 'Catch a mouse on a Magic Floor (5).',
    noble_floor_egg_convertible: 'Catch a mouse on a Noble Floor (6).',
    dust_floor_egg_convertible: 'Catch a mouse on a Dusty Floor (7).',
    tower_secret_egg_convertible: { text: 'Catch a Champion mouse with Secret Research activated.', mice: ['Shade of the Eclipse'] },
    tower_sigil_egg_convertible: { text: 'Catch a Champion mouse with Sigil Hunter activated.', mice: ['Shade of the Eclipse'] },
    tower_siphon_egg_convertible: { text: 'Catch a Champion mouse with Siphon activated.', mice: ['Shade of the Eclipse'] },

    zokor_fealty_egg_convertible: 'Catch a mouse in a Fealty District.',
    zokor_scholar_egg_convertible: 'Catch a mouse in a Scholar District.',
    zokor_tech_egg_convertible: 'Catch a mouse in a Tech District.',
    zokor_treasury_egg_convertible: 'Catch a mouse in a Treasury District.',

    // Mice.
    '2011_spring_hunt_egg_6': { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    '21k_golden_egg_convertible': { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    abominable_snow_egg_convertible: { mice: ['Abominable Snow'] },
    absolute_acolyte_egg_convertible: { mice: ['Absolute Acolyte'] },
    acolyte_egg_convertible: { mice: ['Acolyte'] },
    aether_egg_convertible: { mice: ['Aether'] },
    ascended_elder_egg_convertible: { mice: ['Ascended Elder'] },
    assassin_egg_convertible: { mice: ['Assassin'] },
    balack_the_banished_egg_convertible: { mice: ['Balack the Banished'] },
    barnacle_egg_convertible: { mice: ['Barnacle Beautician', 'Bottom Feeder', 'Crabolia', 'Deep Sea Diver', 'Deranged Deckhand', 'Dread Pirate Mousert', 'Pirate Anchor', 'Sunken Banshee', 'Swashblade', 'Clownfish', 'Eel', 'Manatee', 'Mlounder Flounder', 'Stingray'] },
    barricade_egg_convertible: { mice: ['Bat Mouse', 'Ghost Mouse', 'Mousevina von Vermin', 'Mummy Mouse', 'Vampire Mouse'] },
    bbb_egg_convertible: { mice: ['Big Bad Burroughs'] },
    black_widow_egg_convertible: { mice: ['Black Widow'] },
    blue_argyle_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    bristle_woods_rift_egg_convertible: { mice: ['Absolute Acolyte', 'Carrion Medium', 'Chamber Cleaver', 'Chronomaster', 'Clockwork Timespinner', 'Dread Knight', 'Epoch Golem', 'Harbinger of Death', 'Portal Paladin', 'Portal Plunderer', 'Portal Pursuer', 'Record Keeper', 'Record Keeper\'s Assistant', 'Sentient Slime', 'Shackled Servant', 'Skeletal Champion', 'Timeless Lich', 'Timelost Thaumaturge', 'Timeslither Pythoness', 'Vigilant Ward'] },
    brown_egg_convertible: { mice: ['Brown'] },
    bubbling_egg_convertible: { mice: ['Angelfish', 'Betta', 'Cuttle', 'Eel', 'Jellyfish', 'Koimaid', 'Manatee', 'Puffer', 'Serpent Monster', 'Stingray'] },
    burglar_egg_convertible: { mice: ['Burglar'] },
    captain_croissant_egg_convertible: { mice: ['Captain Croissant'] },
    caring_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    cave_crystal_egg_convertible: { mice: ['Crystal Golem', 'Crystal Lurker', 'Crystal Observer', 'Crystal Queen'] },
    cave_diamond_egg_convertible: { mice: ['Crystal Behemoth', 'Diamondhide', 'Huntereater'] },
    chamber_cleaver_egg_convertible: { mice: ['Chamber Cleaver'] },
    cherry_egg_convertible: { mice: ['Cherry'] },
    cherry_sprite_egg_convertible: { mice: ['Cherry Sprite'] },
    chrono_egg_convertible: { mice: ['Chrono'] },
    clean_egg_convertible: { mice: ['Hazmat', 'Lab Technician'] },
    clockwork_egg_convertible: { mice: ['Pocketwatch'] },
    cook_egg_convertible: { mice: ['Cook'] },
    coral_egg_convertible: { mice: ['Coral Corral', 'Angelfish', 'Clownfish', 'Coral', 'Cuttle', 'Jellyfish', 'Mlounder Flounder'] },
    cork_egg_convertible: { mice: ['Burly Bruiser', 'Cork Defender', 'Corkataur', 'Corky, the Collector', 'Fuzzy Drake', 'Horned Cork Hoarder', 'Rambunctious Rain Rumbler'] },
    corky_the_collector_egg_convertible: { mice: ['Corky, the Collector'] },
    corrupt_egg_convertible: { mice: ['Corrupt'] },
    crate_egg_convertible: { mice: ['Crate Camo', 'Cute Crate Carrier'] },
    crimson_egg_convertible: { mice: ['Bat Mouse', 'Coffin Zombie', 'Ghost Mouse', 'Mousevina von Vermin', 'Mummy Mouse', 'Vampire Mouse'] },
    crown_collector_egg_convertible: { mice: ['Crown Collector'] },
    crystal_behemoth_egg_convertible: { mice: ['Crystal Behemoth'] },
    crystal_library_egg_convertible: { mice: ['Effervescent', 'Flutterby', 'Infiltrator'] },
    cursed_librarian_egg_convertible: { mice: ['Cursed Librarian'] },
    dawn_egg_convertible: { mice: ['Battering Ram', 'Dawn Guardian', 'Monster of the Meteor'] },
    day_egg_convertible: { mice: ['Hardworking Hauler', 'Meteorite Miner', 'Meteorite Mover', 'Meteorite Snacker', 'Mining Materials Manager', 'Mischievous Meteorite Miner'] },
    decrepit_tentacle_egg_convertible: { mice: ['Decrepit Tentacle Terror'] },
    deep_egg_convertible: { mice: ['Deep'] },
    derr_egg_convertible: { mice: ['Derr Chieftain', 'Renegade'] },
    desert_nomad_egg_convertible: { mice: ['Desert Nomad'] },
    diamond_egg_convertible: { mice: ['Diamond'] },
    dojo_student_egg_convertible: { mice: ['Student of the Cheese Belt', 'Student of the Cheese Claw', 'Student of the Cheese Fang'] },
    dragon_egg_convertible: { mice: ['Dragon'] },
    dragonshard_egg_convertible: { mice: ['Bearded Elder', 'Bruticus, the Blazing', 'Cinderstorm', 'Ignatia', 'Kalor\'ignis of the Geyser', 'Mild Spicekin', 'Sizzle Pup', 'Smoldersnap', 'Stormsurge, the Vile Tempest'] },
    drheller_egg_convertible: { mice: ['General Drheller'] },
    eclipse_egg_convertible: { mice: ['Eclipse'] },
    elub_egg_convertible: { mice: ['Elub Chieftain', 'Vanquisher'] },
    empyrean_empress_egg_convertible: { mice: ['Empyrean Empress'] },
    enlarged_rift_egg_convertible: { mice: ['Agitated Gentle Giant', 'Brawny', 'Cyborg', 'Dream Drifter', 'Excitable Electric', 'Goliath Field', 'Greyrun', 'Micro', 'Mighty Mole', 'Raw Diamond', 'Rift Guardian', 'Riftweaver', 'Shard Centurion', 'Spiritual Steel', 'Supernatural', 'Wealth', 'Amplified Brown', 'Amplified Grey', 'Amplified White', 'Assassin Beast', 'Automated Sentry', 'Big Bad Behemoth Burroughs', 'Boulder Biter', 'Clump', 'Count Vampire', 'Cyber Miner', 'Cybernetic Specialist', 'Doktor', 'Evil Scientist', 'Itty Bitty Rifty Burroughs', 'Lambent', 'Lycanoid', 'Master Exploder', 'Mecha Tail', 'Menace of the Rift', 'Monstrous Abomination', 'Phase Zombie', 'Plutonium Tentacle', 'Pneumatic Dirt Displacement', 'Portable Generator', 'Prototype', 'Radioactive Ooze', 'Rancid Bog Beast', 'Revenant', 'Rift Bio Engineer', 'Rifterranian', 'Robat', 'Super Mega Mecha Ultra RoboGold', 'Surgeon Bot', 'Tech Ravenous Zombie', 'Tomb Exhumer', 'Toxic Avenger', 'Toxikinetic', 'Zombot Unipire the Third', 'Bloomed Sylvan', 'Cherry Sprite', 'Cranky Caterpillar', 'Cyclops Barbarian', 'Faction Boss', 'Mossy Moosker', 'Red-Eyed Watcher Owl', 'Spirit Fox', 'Treant Queen', 'Centaur Ranger', 'Faction Boss', 'Fungal Frog', 'Karmachameleon', 'Naturalist', 'Nomadic Warrior', 'Red Coat Bear', 'Rift Tiger', 'Spirit of Balance', 'Crazed Goblin', 'Grizzled Silth', 'Medicine', 'Tree Troll', 'Tri-dra', 'Faction Boss', 'Twisted Treant', 'Water Sprite', 'Winged Harpy', 'Gilded Leaf', 'Monstrous Black Widow'] },
    essence_guardian_egg_convertible: { mice: ['Essence Guardian'] },
    ethereal_librarian_egg_convertible: { mice: ['Ethereal Librarian'] },
    experimental_egg_convertible: { mice: ['Clumsy Chemist Mouse', 'Sludge Scientist Mouse'] },
    fog_egg_convertible: { mice: ['Fog'] },
    friendly_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    ful_mina_egg_convertible: { mice: ['Ful\'Mina, The Mountain Queen'] },
    fungal_egg_convertible: { mice: ['Bitter Root', 'Floating Spore', 'Funglore', 'Lumahead', 'Mouldy Mole', 'Mush', 'Mushroom Sprite', 'Nightshade Masquerade', 'Quillback', 'Spiked Burrower', 'Spore Muncher', 'Sporeticus'] },
    furoma_egg_convertible: { mice: ['Dojo Sensei', 'Master of the Cheese Belt', 'Master of the Cheese Claw', 'Master of the Cheese Fang', 'Master of the Dojo'] },
    gargantua_egg_convertible: { mice: ['Gargantuamouse'] },
    gate_guardian_egg_convertible: { mice: ['Gate Guardian'] },
    geyser_egg_convertible: { mice: ['Bearded Elder', 'Bruticus, the Blazing', 'Cinderstorm', 'Ignatia', 'Kalor\'ignis of the Geyser', 'Mild Spicekin', 'Sizzle Pup', 'Smoldersnap', 'Stormsurge, the Vile Tempest'] },
    gilded_leaf_egg_convertible: { mice: ['Gilded Leaf'] },
    gnawnia_egg_convertible: { mice: ['Brown', 'Cowardly', 'Field', 'Granite', 'Grey', 'Ninja', 'Spud', 'Steel', 'White'] },
    gnawnian_express_egg_convertible: { mice: ['Angry Train Staff', 'Automorat', 'Bartender', 'Black Powder Thief', 'Cannonball', 'Coal Shoveller', 'Requiries:', 'Dusty Coal Charm', 'Crate Camo', 'Cute Crate Carrier', 'Dangerous Duo', 'Farrier', 'Fuel', 'Hookshot', 'Magmatic Crystal Thief', 'Magmatic Golem', 'Mouse With No Name', 'Mysterious Traveller', 'Parlour Player', 'Passenger', 'Photographer', 'Sharpshooter', 'Steel Horse Rider', 'Stoutgear', 'Stowaway', 'Stuffy Banker', 'Supply Hoarder', 'Tonic Salesman', 'Train Conductor', 'Train Engineer', 'Travelling Barber', 'Upper Class Lady', 'Warehouse Manager'] },
    green_plaid_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    grey_egg_convertible: { mice: ['Grey'] },
    grizzled_silth_egg_convertible: { mice: ['Grizzled Silth'] },
    haunted_egg_convertible: { mice: ['Keeper\'s Assistant', 'Ghost', 'Mummy', 'Ravenous Zombie', 'Vampire'] },
    huntington_egg_convertible: { mice: ['Bottled', 'Captain', 'Squeaken'] },
    hydra_egg_convertible: { mice: ['Hydra'] },
    iceberg_egg_convertible: { mice: ['Iceblock', 'Polar Bear', 'Snowblind', 'Wolfskie'] },
    icewing_egg_convertible: { mice: ['Icewing'] },
    icewing_generals_egg_convertible: { mice: ['Lady Coldsnap', 'Princess Fist', 'Lord Splodington', 'General Drheller'] },
    jod_egg_convertible: { mice: ['Chitinous', 'Fetid Swamp', 'Jurassic', 'Magma Carrier', 'Primal', 'Stonework Warrior'] },
    kalor_ignis_egg_convertible: { mice: ['Kalor\'ignis of the Geyser'] },
    living_garden_egg_convertible: { mice: ['Barkshell', 'Cursed Thief', 'Ethereal Engineer', 'Serpentine', 'Spiky Devil', 'Thistle'] },
    living_salt_egg_convertible: { mice: ['Living Salt'] },
    m400_egg_convertible: { mice: ['M400'] },
    mage_weaver_egg_convertible: { mice: ['Mage Weaver'] },
    magic_egg_convertible: { mice: ['Magic'] },
    magmatic_golem_egg_convertible: { mice: ['Magmatic Golem'] },
    master_of_the_dojo_egg_convertible: { mice: ['Master of the Dojo'] },
    mighty_mole_egg_convertible: { mice: ['Mighty Mole'] },
    monster_egg_convertible: { mice: ['Monster'] },
    monster_of_the_meteor_egg_convertible: { mice: ['Monster of the Meteor'] },
    mouse_scale_egg_convertible: { mice: ['Scale Society, Betta, Clownfish, Koimaid, Mlounder Flounder, Puffer'] },
    muridae_egg_convertible: { mice: ['Glass Blower', 'Limestone Miner', 'Lumberjack'] },
    mutant_mongrel_egg_convertible: { mice: ['Mutant Mongrel'] },
    mutated_behemoth_egg_convertible: { mice: ['Mutated Behemoth'] },
    mystic_king_egg_convertible: { mice: ['Mystic King'] },
    naturalist_egg_convertible: { mice: ['Naturalist'] },
    nerg_egg_convertible: { mice: ['Conqueror', 'Nerg Chieftain'] },
    nibbler_egg_convertible: { mice: ['Nibbler'] },
    night_egg_convertible: { mice: ['Alpha Weremouse', 'Arcane Summoner', 'Battering Ram', 'Cursed Taskmaster', 'Hypnotized Gunslinger', 'Meteorite Golem', 'Meteorite Mystic', 'Mischievous Wereminer', 'Night Shift Materials Manager', 'Night Watcher', 'Nightfire', 'Nightmancer', 'Reveling Lycanthrope', 'Wealthy Werewarrior', 'Werehauler', 'Wereminer'] },
    nightshade_egg_convertible: { mice: ['Nightshade Flower Girl', 'Nightshade Masquerade', 'Nightshade Nanny', 'Nightshade Maiden'] },
    null_rift_egg_convertible: { mice: ['Menace of the Rift'] },
    overflowing_pump_egg_convertible: { mice: ['Sleepy Merchant', 'Tiny Saboteur', 'Pump Raider', 'Croquet Crusher', 'Queso Extractor', 'Queen Quesada'] },
    oxygen_baron_egg_convertible: { mice: ['Angelfish', 'Betta', 'Cuttle', 'Eel', 'Jellyfish', 'Koimaid', 'Manatee', 'Oxygen Baron', 'Puffer', 'Stingray'] },
    peggy_egg_convertible: { mice: ['Peggy the Plunderer'] },
    pirate_crew_egg_convertible: { mice: ['Barmy Gunner', 'Bilged Boatswain', 'Cabin Boy', 'Corrupt Commodore', 'Dashing Buccaneer'] },
    pirate_egg_convertible: { mice: ['Pirate'] },
    pressure_egg_convertible: { mice: ['Emberstone Scaled', 'Pyrehyde', 'Steam Sailor', 'Vaporior', 'Warming Wyvern'] },
    pygmy_swarm_egg_convertible: { mice: ['Swarm of Pygmy Mice'] },
    queso_nachore_egg_convertible: { mice: ['Ore Chipper', 'Rubble Rummager', 'Nachore Golem', 'Rubble Rouser', 'Grampa Golem', 'Fiery Crusher', 'Nachous, The Molten'] },
    queso_pump_egg_convertible: { mice: ['Tiny Saboteur', 'Pump Raider', 'Croquet Crusher', 'Queso Extractor'] },
    queso_spice_egg_convertible: { mice: ['Spice Farmer', 'Granny Spice', 'Spice Sovereign', 'Spice Finder', 'Spice Raider', 'Spice Reaper', 'Inferna, The Engulfed'] },
    quesodillo_egg_convertible: { mice: ['Quesodillo'] },
    real_lich_egg_convertible: { mice: ['Derr Lich', 'Nerg Lich', 'Elub Lich'] },
    realm_ripper_egg_convertible: { mice: ['Realm Ripper'] },
    relic_hunter_egg_convertible: { mice: ['Relic Hunter'] },
    richest_egg_convertible: { mice: ['Richard the Rich', 'Fortuitous Fool'] },
    rift_dojo_master_egg_convertible: { mice: ['Grand Master of the Dojo'] },
    rift_egg_convertible: { mice: ['Cyborg', 'Greyrun', 'Shard Centurion', 'Spiritual Steel', 'Rift Guardian', 'Raw Diamond', 'Wealth'] },
    rift_fang_egg_convertible: { mice: ['Count Vampire'] },
    rift_mist_egg_convertible: { mice: ['Amplified Brown', 'Amplified Grey', 'Amplified White', 'Assassin Beast', 'Automated Sentry', 'Big Bad Behemoth Burroughs', 'Boulder Biter', 'Clump', 'Count Vampire', 'Cyber Miner', 'Cybernetic Specialist', 'Doktor', 'Evil Scientist', 'Itty Bitty Rifty Burroughs', 'Lambent', 'Lycanoid', 'Master Exploder', 'Mecha Tail', 'Menace of the Rift', 'Monstrous Abomination', 'Phase Zombie', 'Plutonium Tentacle', 'Pneumatic Dirt Displacement', 'Portable Generator', 'Prototype', 'Radioactive Ooze', 'Rancid Bog Beast', 'Revenant', 'Rift Bio Engineer', 'Rifterranian', 'Robat', 'Super Mega Mecha Ultra RoboGold', 'Surgeon Bot', 'Tech Ravenous Zombie', 'Tomb Exhumer', 'Toxic Avenger', 'Toxikinetic', 'Zombot Unipire the Third'] },
    rift_venom_egg_convertible: { mice: ['Monstrous Black Widow'] },
    riptide_egg_convertible: { mice: ['Riptide'] },
    rrs_egg_convertible: { mice: ['Retired Minotaur Mouse'] },
    runny_egg_convertible: { mice: ['Extreme Everysports', 'Hurdle', 'Trampoline', 'Wave Racer', 'Winter Games'] },
    salty_sea_egg_convertible: { mice: ['Ancient of the Deep', 'Angelfish', 'Angler', 'Barnacle Beautician', 'Barracuda', 'Betta', 'Bottom Feeder', 'Carnivore', 'City Noble', 'City Worker', 'Clownfish', 'Clumsy Carrier', 'Coral', 'Coral Cuddler', 'Coral Dragon', 'Coral Gardener', 'Coral Guard', 'Coral Harvester', 'Coral Queen', 'Crabolia', 'Cuttle', 'Deep Sea Diver', 'Deranged Deckhand', 'Derpshark', 'Dread Pirate Mousert', 'Eel', 'Elite Guardian', 'Enginseer', 'Guppy', 'Hydrologist', 'Jellyfish', 'Koimaid', 'Manatee', 'Mermousette', 'Mershark', 'Mlounder Flounder', 'Octomermaid', 'Old One', 'Oxygen Baron', 'Pearl', 'Pearl Diver', 'Pirate Anchor', 'Puffer', 'Saltwater Axolotl', 'Sand Dollar Diver', 'Sand Dollar Queen', 'School of Mish', 'Seadragon', 'Serpent Monster', 'Spear Fisher', 'Stingray', 'Sunken Banshee', 'Sunken Citizen', 'Swashblade', 'Tadpole', 'Treasure Hoarder', 'Treasure Keeper', 'Tritus', 'Turret Guard', 'Urchin King'] },
    sand_dollar_egg_convertible: { mice: ['Mlounder Flounder', 'Pearl', 'Pearl Diver', 'Saltwater Axolotl', 'Sand Dollar Diver', 'Sand Dollar Queen', 'Treasure Hoarder', 'Treasure Keeper'] },
    sarcophamouse_egg_convertible: { mice: ['Sarcophamouse'] },
    scalloped_pink_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    scavenger_egg_convertible: { mice: ['Scavenger'] },
    seasonal_garden_egg_convertible: { mice: ['Frostbite', 'Harvest Harrier', 'Puddlemancer', 'Stinger'] },
    sharing_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    sharpshooter_egg_convertible: { mice: ['Sharpshooter'] },
    shattered_egg_convertible: { mice: ['Shattered Carmine', 'Dark Magi', 'King Scarab'] },
    shelder_egg_convertible: { mice: ['Shelder'] },
    silth_egg_convertible: { mice: ['Silth'] },
    slushy_shoreline_egg_convertible: { mice: ['Chipper', 'Icebreaker', 'Incompetent Ice Climber', 'Living Ice', 'Polar Bear', 'Saboteur', 'Snow Bowler', 'Snow Slinger', 'Snow Sniper', 'Snow Soldier', 'Yeti'] },
    spud_egg_convertible: { mice: ['Spud'] },
    stripy_red_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    sunken_treasure_egg_convertible: { mice: ['Pearl Diver', 'Pearl', 'Treasure Hoarder', 'Treasure Keeper'] },
    technic_king_egg_convertible: { mice: ['Technic King'] },
    thistle_egg_convertible: { mice: ['Thistle'] },
    thunderlord_egg_convertible: { mice: ['⚡Thunderlord⚡'] },
    tier_five_egg_convertible: { mice: ['Aquos', 'Black Mage', 'Ignis', 'Terra', 'Zephyr'] },
    tier_four_egg_convertible: { mice: ['Cowbell', 'Dancer', 'Drummer', 'Fiddler', 'Guqin Player'] },
    tiny_egg_convertible: { mice: ['Tiny'] },
    tower_elixir_egg_convertible: { mice: ['Elixir Maker'] },
    tower_umbra_egg_convertible: { mice: ['The Total Eclipse'] },
    toxic_spill_egg_convertible: { mice: ['Biohazard', 'Bog Beast', 'Gelatinous Octahedron', 'Hazmat', 'Lab Technician', 'Monster Tail', 'Mutant Mongrel', 'Mutant Ninja', 'Mutated Behemoth', 'Mutated Siblings', 'Outbreak Assassin', 'Plague Hag', 'Scrap Metal Monster', 'Slimefist', 'Sludge', 'Sludge Soaker', 'Sludge Swimmer', 'Spore', 'Swamp Runner', 'Telekinetic Mutant', 'Tentacle', 'The Menace', 'Toxic Warrior'] },
    tritus_egg_convertible: { mice: ['Tritus'] },
    twisted_lilly_egg_convertible: { mice: ['Twisted Lilly'] },
    underwater_predator_egg_convertible: { mice: ['Ancient of the Deep', 'Barracuda', 'Carnivore', 'Clownfish', 'Derpshark', 'Serpent Monster', 'Spear Fisher', 'Tritus'] },
    unstable_zokor_crystal_egg_convertible: { mice: ['Molten Midas Mouse'] },
    valour_egg_convertible: { mice: ['Bandit', 'Berserker', 'Dwarf', 'Gold', 'Pugilist'] },
    wanted_poster_egg_convertible: { mice: ['Bounty Hunter'] },
    warden_of_fog_egg_convertible: { mice: ['Warden of Fog'] },
    warden_of_frost_egg_convertible: { mice: ['Warden of Frost'] },
    warden_of_rain_egg_convertible: { mice: ['Warden of Rain'] },
    warden_of_wind_egg_convertible: { mice: ['Warden of Wind'] },
    warmonger_egg_convertible: { mice: ['Warmonger'] },
    warpath_egg_convertible: { mice: ['Crimson Commander', 'Flame Ordnance', 'Gargantuamouse', 'Sand Cavalry', 'Sandwing Cavalry', 'Warmonger'] },
    wavy_purple_egg_convertible: { mice: ['Carefree Cook', 'Chocolate Gold Foil', 'Chocolate Overload', 'Coco Commander', 'Egg Painter', 'Egg Scrambler', 'Eggscavator', 'Eggsplosive Scientist', 'Eggsquisite Entertainer', 'Hardboiled', 'Hare Razer', 'Onion Chopper', 'Pan Slammer', 'Sinister Egg Painter', 'Spring Sprig'] },
    whisker_woods_egg_convertible: { mice: ['Centaur', 'Eagle Owl', 'Elven Princess', 'Nomad', 'Wicked Witch of Whisker Woods', 'Wiggler'] },
    white_egg_convertible: { mice: ['White'] },
    zurreal_egg_convertible: { mice: ['Zurreal the Eternal'] },
    zzt_egg_convertible: { mice: ['Mystic Rook', 'Technic Rook'] },
    mythweaver_egg_convertible: { mice: ['Mythweaver'] },
    monstrous_midge_egg_convertible: { mice: ['Monstrous Midge'] },
    architeuthulhu_egg_convertible: { mice: ['Architeuthulhu'] },
  };

  /**
   * Transparent and highres images for all the eggs.
   */
  const eggImages = {
    '21k_golden_egg_convertible': 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3ada6ff18f89d020908e35fee2de7a45.png?cv=2',
    abominable_snow_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/9dd4706d4ca6b28332046ba180f69287.png?cv=2',
    absolute_acolyte_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d90069102ac0edad8555875b5da3d87f.png?cv=2',
    acolyte_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/35766857704c957e242ae0f74c872a48.png?cv=2',
    aether_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d44a47f4e08a8434b2a41d73f721ea6f.png?cv=2',
    ancient_jade_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/644ad0dcc59d7048e43b3606a800f660.png?cv=2',
    ascended_elder_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/fef8364694b5a21479b66d9072c10da8.png?cv=2',
    assassin_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2958dca15f7384abbcf04a74a75b7f72.png?cv=2',
    balack_the_banished_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/33937d2da8507da8437bd8a49dfed351.png?cv=2',
    bard_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5c623ae3c79b2778ff1ef46480940497.png?cv=2',
    barnacle_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/19600035c31d3e30646411af8ffc54de.png?cv=2',
    baron_count_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/29c23a04682b44e0875469dbd3e72ba7.png?cv=2',
    barricade_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/219505567261c31535aeae15e7c45a0e.png?cv=2',
    bbb_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b95e9e16f38c872ba699881d6cbb43c3.png?cv=2',
    blue_argyle_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/e09817e3d5a14bc2cbb4aeb128f55cea.png?cv=2',
    bottled_wind_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4c3c721315831603676d759dd2921f5f.png?cv=2',
    bristle_woods_rift_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/cc7e4a6fceeb699fc7713e3c79a798ee.png?cv=2',
    brown_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3ecfb08fe8e7ce5317a827cc0edcc76b.png?cv=2',
    bubbling_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/0efbfce5fb0243e11da52d5631f16a7c.png?cv=2',
    burglar_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/72850ea1ab986d6008c18d69e87ae710.png?cv=2',
    captain_croissant_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/471c76722899f41d415f8b8043a5815b.png?cv=2',
    cave_crystal_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4acc3426ef7d78e06418669e558f2183.png?cv=2',
    cave_diamond_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5e2fe2dd9a7c9661ee31969a933080c4.png?cv=2',
    century_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3bddd357f1582b577168e894ecde1ed3.png?cv=2',
    century_of_luck_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/89ac76ffeee0a115c549355cc5bf8d14.png?cv=2',
    chamber_cleaver_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/0411d830abcf7f3974faa9cc10cdc975.png?cv=2',
    cherry_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5a3cc361232eb34aa5d081ba960eab8e.png?cv=2',
    cherry_sprite_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3c90bb7355933f4c09839c3451c7f560.png?cv=2',
    chrono_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/60a6573a1391410960d7e18f3e468d7d.png?cv=2',
    clean_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/033ce65bafc0587eb212051245cdd254.png?cv=2',
    clockwork_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b9f02917b12eeeb458e4248643efd944.png?cv=2',
    cloudstone_bangle_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/cebd5c3c1e80a2ecd31f90a7f7cd82b6.png?cv=2',
    cook_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/265dd09e0e376d5cc24c67787c3ba8c8.png?cv=2',
    coral_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/e5f50962709dc6988d79743fb3e311b4.png?cv=2',
    cork_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/28eaf63af32fe6082e308f7b916ab019.png?cv=2',
    corky_the_collector_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/85aa7dd96971188eb1f2c912302baffc.png?cv=2',
    corrupt_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c3290823759389d177aaa36601b52a16.png?cv=2',
    crate_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/21949f9008eaa3961d12d32034ee8b09.png?cv=2',
    crimson_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/605588c17cb422e4a21116fa1a723e1e.png?cv=2',
    crown_collector_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d092ab1bea462b1e792211fc52f4f63a.png?cv=2',
    crystal_behemoth_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b4a50b302df30a66734aa18d92c3062e.png?cv=2',
    crystal_library_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5b6687c75e3d77474bac749c74adbf0d.png?cv=2',
    cursed_librarian_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/12a4e405ccc4c34925e28e5d9d1106b9.png?cv=2',
    dawn_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/49e417e50ebabb68c33aa19ce05376ee.png?cv=2',
    day_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2f05a09437dee3ad1c46ab5da0c2a3d8.png?cv=2',
    decrepit_tentacle_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/533fa05f06b805510c0f5e31940a3ee7.png?cv=2',
    deep_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b5d96938cfad6e037d7792c2eb1c45d3.png?cv=2',
    deep_sea_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8a604d3444dcd43b7769596d80bc63ed.png?cv=2',
    derr_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/86df3ec07216a0f441135d81f409f988.png?cv=2',
    desert_nomad_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ec3714130b28914b2c4ef28d6a5614bd.png?cv=2',
    diamond_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/25098864302043b8335c8d5e6f5c1787.png?cv=2',
    dojo_student_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4d241f49f0d357c7a4445543794466f6.png?cv=2',
    dragon_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c45ce42da58b335f0895b675f4ee08d2.png?cv=2',
    dragonshard_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2befdc0c2e8f6745c1aba36d7c99a414.png?cv=2',
    drheller_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c0571bd2951b090121969288b5fae6fc.png?cv=2',
    duke_grandduke_eggsweeper_2020_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a6c27aa72a249b9cd133d4632224af40.png?cv=2',
    dust_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4d40431ca159d9fca1f6528bea6ec5c2.png?cv=2',
    dusted_baron_count_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c0c8703d62a392ca0494f03f19acd281.png?cv=2',
    dusted_duke_grandduke_eggsweeper_2020_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8f1f5c3b2ffb968b9c9dd4709fd7bc2b.png?cv=2',
    dusted_master_lord_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b2dca9eed66d32117932cbc94e6bfd01.png?cv=2',
    dusted_novice_journeyman_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/656539f39d69f25de835a44ac0a448c6.png?cv=2',
    eclipse_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/aa3dbaf5bac08d425c3478b1e30db358.png?cv=2',
    eggstra_charge_trinket: 'https://www.mousehuntgame.com/images/items/trinkets/transparent_thumb/18f0f0d9212a2b8708ef2fe1833a8588.png?cv=2',
    eggstra_trinket: 'https://www.mousehuntgame.com/images/items/trinkets/transparent_thumb/70e0c61a1a7136cb4b04b6993ad0802c.png?cv=2',
    elub_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a9a58b3d5b68167a75f6d0dad36ce20f.png?cv=2',
    empyrean_empress_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/dc4635c6d734f802a07835a387f8b783.png?cv=2',
    empyrean_seal_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/98526624e56160e7c81909d0c99cc9dc.png?cv=2',
    enchanted_wing_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/77df854f321ccea97ce3fbb6ca12bce3.png?cv=2',
    enerchi_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8ec1e39f9ad8553411d9662baafd7537.png?cv=2',
    enlarged_rift_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c249d131cd83beb1d7426034231f6ba6.png?cv=2',
    essence_guardian_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ee8b71b0f6f0a0e57fcfb98d968e6709.png?cv=2',
    ethereal_librarian_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/fb9c74c018bb3f9720b0bd7e7742a3ff.png?cv=2',
    experimental_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ab2281f3849363e97ff1569e608326e6.png?cv=2',
    explorers_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8d10ced6585b17be3e479782d8e92e6d.png?cv=2',
    fog_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/bb2cf8cf2b39b57270e908e0fb07a254.png?cv=2',
    freshly_painted_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/822eaeb800c2b4fe33ec3b44a497b73c.png?cv=2',
    fungal_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b11645d3c46dcf6f29bb20d13ddd5fd0.png?cv=2',
    furoma_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5de2763fa921e48fabe9c524f03d2b82.png?cv=2',
    gargantua_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/bf891dc32dd31f7ed472e94767afedbb.png?cv=2',
    gate_guardian_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b06817007a3e8d32898e0316af12e2c6.png?cv=2',
    geyser_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ad5229f2e14040ba4f7954b88bee67fe.png?cv=2',
    gilded_leaf_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8e65dabe86c48a81a5e17dab2366636c.png?cv=2',
    glowing_oil_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4a1b8eac9c50a96a15da5677c1df5501.png?cv=2',
    gnawnia_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a7986350b3d660201d9bfcab12c8a5ad.png?cv=2',
    gnawnian_express_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/143ce299c5e4f36b4917129df5b0dcfb.png?cv=2',
    green_plaid_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/887162c61d0e01985ffc12e41c03d952.png?cv=2',
    grey_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4a8546ba8863c1b5ab75deec11ff00a8.png?cv=2',
    grizzled_silth_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/94b6bcfaa2200a37d7ebf1e991c8e888.png?cv=2',
    haunted_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c3ed88f9b4529a081a5843cacc320582.png?cv=2',
    high_charge_egg_convertible_2014: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ac76cda184767545237124b93a7b65a9.png?cv=2',
    high_charge_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7f2c7d53bf0aa5535a2fc581dce9507c.png?cv=2',
    huntington_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/9f5dd6802fedb166c0c53d2df8047d29.png?cv=2',
    hydra_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a58d37d7d8e30b2e6fa8257e148e90a4.png?cv=2',
    iceberg_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/055da6410fc56ecbf231f4d640210344.png?cv=2',
    icewing_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d6b33eee7817327584abd12d48b03de6.png?cv=2',
    icewing_generals_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7d821c743230eba77922c1e7781c1f32.png?cv=2',
    jod_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a8df917df6cd125b25f2b28acfb03b5f.png?cv=2',
    kalor_ignis_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/495802cedc9651b26fc2b7d220aa07a2.png?cv=2',
    lich_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/db7a3090546cf227fd74fb1e0a090923.png?cv=2',
    living_garden_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7475dab32e3dc994c847bd84bbcc9f9a.png?cv=2',
    living_salt_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/803c34c5907dffe7e59866d4236d957b.png?cv=2',
    loot_cache_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/4ef0d0c6b7728fa4b4f7490168d268a2.png?cv=2',
    lucky_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c0e7ed8da27272d0beaccd1cbde51a96.png?cv=2',
    m400_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b2eb034c98964eab81ff7c4a235fc644.png?cv=2',
    mage_weaver_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/89ed7a2cda758c220d99be4028e077ae.png?cv=2',
    magic_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3b466a1e29db3103bb54e441620af52f.png?cv=2',
    magic_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/059cfea095e4c1dec37951d1f7d66b53.png?cv=2',
    magical_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3ccd4fd671eb4f53c2540df6d0c4cc56.png?cv=2',
    magmatic_golem_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5fac1395e51350c27197800e9a5ee58b.png?cv=2',
    market_mogul_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/95b191428afa73aad55f64e3dd4abcce.png?cv=2',
    marshmallow_monterey_cheese: 'https://www.mousehuntgame.com/images/items/bait/transparent_thumb/615d47b424c7babe771305088cbf1b1d.png?cv=2',
    master_lord_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/9d59aaf113696227b9981dfef7cc66f2.png?cv=2',
    master_of_the_dojo_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a0b5e37ddf417aead3c812f1cc3167c3.png?cv=2',
    medium_charge_egg_convertible_2014: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/00fdd4d23051b82eb79e373389a71455.png?cv=2',
    medium_charge_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ec013ca6b2b59f956941193886b49d35.png?cv=2',
    melee_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3cf99291a4804907802268d7114bd695.png?cv=2',
    mighty_mole_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/44b66f84164b2c173f389c79e49f302d.png?cv=2',
    monster_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2398fafeb5c068797c04decb904763e9.png?cv=2',
    monster_of_the_meteor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/075a931836ee7b1ca6fcdeed5422e671.png?cv=2',
    mouse_scale_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/bd0155a3002c7c3354d61225fb7c511b.png?cv=2',
    muridae_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ba0b914501da1f7ce769f40b8412256b.png?cv=2',
    mutant_mongrel_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/f28138b52663c514a2cb5bdd83af1b19.png?cv=2',
    mutated_behemoth_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d4abd5d322641153812defcfe2646926.png?cv=2',
    mystic_king_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/48a7dabd0ecbdbb5380703a304a0a603.png?cv=2',
    naturalist_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/431c863ce5f8c05ee365025cf66e7133.png?cv=2',
    nerg_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/04577ef760297f27bf907c29dc533f58.png?cv=2',
    nibbler_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8705fa6fe03ea75513589c166bfa01da.png?cv=2',
    night_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5cdf051e566593d6ac873281428e4543.png?cv=2',
    nightshade_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d4e71a92a95c59f632752483726f81fe.png?cv=2',
    noble_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d22d9a630368405e6b61820cbe52500a.png?cv=2',
    novice_journeyman_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b2a26bf6598102e48ca4a7a519f2c4ff.png?cv=2',
    null_rift_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3ce2ac8b3f79007a0ff8ed5ac067be68.png?cv=2',
    over_9000_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/952973fbc52bae6606e688297c05095e.png?cv=2',
    overflowing_pump_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/989016f54b0bea191ab1c913c9fc2d2f.png?cv=2',
    oxygen_baron_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ab782b48ba5b40d67fc1b469a252b644.png?cv=2',
    peggy_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2b623c5ab508f5c3a2ac2305d1975ac1.png?cv=2',
    pirate_crew_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7df121b6b4cecd8fdd49f549dddd6332.png?cv=2',
    pirate_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/f090f1d15c31099933811f9e62e9967b.png?cv=2',
    pressure_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/57cbbbbf3aad8b4f6c23154fcc52e3d3.png?cv=2',
    puppet_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/fdc64b997a42c129f5477beb1f793e70.png?cv=2',
    pygmy_swarm_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/38a70113bd6c96fa3214026165542cc9.png?cv=2',
    queso_nachore_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/08604f17934b7f86ca1d6f412794bf45.png?cv=2',
    queso_pump_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d6740c2a9db6dee8c93e20fe3ad33763.png?cv=2',
    queso_spice_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/0aa0f0a7a93992365c775a2cbe273d09.png?cv=2',
    queso_wild_tonic_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/93e5c47e860fa6d8c2d8d6e345bc3914.png?cv=2',
    quesodillo_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/82215e7848afc469861437a2d56d9820.png?cv=2',
    rain_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2ad172b729b2f11046ad1c542387e538.png?cv=2',
    real_lich_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/90e6af59caf922ecfd8e282b379409cf.png?cv=2',
    relic_hunter_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8b32cd31062c9df72c3d330432443adb.png?cv=2',
    richest_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5389b34153666f1f86170c0324d77064.png?cv=2',
    rift_dojo_master_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d20df2a1625ab299defdd3c3eedfa607.png?cv=2',
    rift_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c171b1245e82f75ffa822b9ae8aa6837.png?cv=2',
    rift_fang_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d34adf8f6efa51fe91216aef996e68dd.png?cv=2',
    rift_mist_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/fc4098a34d1a3c5329c83276b0c40141.png?cv=2',
    rift_venom_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/27169b939b7ecf37de6b1a2a1b9e18f9.png?cv=2',
    riptide_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/0aa9ac23fc62404b4b7fcdbe77b4ccb8.png?cv=2',
    rrs_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/642f3f8eae4c796deeab07c25a323502.png?cv=2',
    runny_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/0e1357f59c7711724670faf71d51a903.png?cv=2',
    salty_sea_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2591bb4bfe466739707726e6cafdd0ee.png?cv=2',
    sand_dollar_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/c5d0aa811e77fedac381f722daa75d9e.png?cv=2',
    sarcophamouse_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7b915f3c621d86a91c91c1f692f6a745.png?cv=2',
    scalloped_pink_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/06d89673a1fa0be3714292c4bc10468e.png?cv=2',
    scavenger_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/247b1c6dd83b65678d1f0f984c2b61ca.png?cv=2',
    seasonal_garden_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a7913b46b8afdf35bdb018fe63163b21.png?cv=2',
    sharpshooter_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2be168253e4fbedeb667e1007bd5e24b.png?cv=2',
    shattered_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d9a6e0de2d1ceba8d3b1a58118d442c9.png?cv=2',
    shelder_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/239a2342cad8ba4376b1eff11a0c0cbf.png?cv=2',
    silth_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/1dbcdb3745492e77bc4398f01a7953ba.png?cv=2',
    sky_conqueror_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/e3f75990f6c0408ddb168c4f1dac0447.png?cv=2',
    sky_explorer_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/faf6aa947821296fd6dfe2caa662249a.png?cv=2',
    sky_gem_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ccc46aaabcce629281d996a6f180e375.png?cv=2',
    sky_ore_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/59b0b060631cfaf2fd119bd13779bcd4.png?cv=2',
    sky_pirate_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a17000e6e5bd7a8eb06403f2c3a3c60a.png?cv=2',
    sky_sprocket_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/23fc2b6df0657a89567376a5375a1003.png?cv=2',
    skysoft_silk_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/39a7ca4bd5cf71c4012bb243d8faa879.png?cv=2',
    slushy_shoreline_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/676b0433964bb62cd53e0a85ced09d04.png?cv=2',
    spud_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2fe307ede5656791fe058422fc63b519.png?cv=2',
    stealthy_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ed10770a0fc1b81d0b7e20705f4c656b.png?cv=2',
    storm_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7a5c1b0b9da4cb032ff3e5c9f42e47a0.png?cv=2',
    stripy_red_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3b2e468000680e03221f87c9957a944e.png?cv=2',
    sunken_treasure_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/e77152a0ed2e7c1c4ce4170a9c340fc2.png?cv=2',
    teamwork_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/6202f2c8ed8f489f295814d2bd2389e3.png?cv=2',
    technic_king_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/158f10d9b412a7901c2dfd920ff26a7d.png?cv=2',
    thief_floor_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/99b3413ecbb85e8c3af941d7099036ec.png?cv=2',
    thistle_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/f7cc792a40e59f87b640813ef5513a62.png?cv=2',
    thunderlord_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/24a61eb6f8d6c259d434a1d181f9ea31.png?cv=2',
    tier_five_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/34dfef984983dae893ea2439c29fcb12.png?cv=2',
    tier_four_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/fc1766ac339518093634a219a1d558ba.png?cv=2',
    tiny_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/540294d277a77bc88aae5e5912369e7b.png?cv=2',
    tower_elixir_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/92cc3d9700d8ba23293c4b61779f0897.png?cv=2',
    tower_secret_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/33a702c95008850ee1cd002e257acf00.png?cv=2',
    tower_sigil_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/b3860346167e182218be1e0b5dd9ae87.png?cv=2',
    tower_siphon_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3ce06edb473184458a5e9c4e9fd2aefb.png?cv=2',
    tower_umbra_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/bea6c2e165d63a088728e03e99028d5f.png?cv=2',
    toxic_spill_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3a962c9fe36be8fda59d3de3b9cfac28.png?cv=2',
    treasure_clue_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d66660398e40110a9d60c795f5d96f56.png?cv=2',
    tritus_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2960db0a1eec4e69a152ae706d53d46f.png?cv=2',
    twisted_lilly_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/a04056b7b88fd8c783c1e52dcaa14576.png?cv=2',
    underwater_predator_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/39282b426fa5ea808f7b06355e914617.png?cv=2',
    unstable_zokor_crystal_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/e8c5ed6c69e866c0a2b2d63013a7ad55.png?cv=2',
    valour_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/afaf4d5d9954adcd03aaa3cb3d4726f0.png?cv=2',
    wanted_poster_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/8b9d1478f16b2192814aacc80467ef00.png?cv=2',
    warden_of_fog_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/bd9e56045d8459f38cff3e7db8892c63.png?cv=2',
    warden_of_frost_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/d0ccb0397b6ded6ee63667a4179dc8e1.png?cv=2',
    warden_of_rain_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/84433c71a0c9234ba5be2302f5111681.png?cv=2',
    warden_of_wind_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/1de90054e0e0be3432000b51c316a90b.png?cv=2',
    warmonger_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/9ab072dbd878982db9adab0a85d50b8f.png?cv=2',
    warpath_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/5171ee5005a91f301baedb7ab7647f1c.png?cv=2',
    wavy_purple_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/7b4bdafe3e690212b1407ae0363c6a63.png?cv=2',
    whisker_woods_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/f7de3d418c45cb7fc1a612ad57a73c77.png?cv=2',
    white_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/443f5c07485f5c0b75d85b74da57489e.png?cv=2',
    wind_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/91e6d807162fa8056a919fda6a2566fd.png?cv=2',
    workshop_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/1059cbc24317dd26a669325d952ec3e1.png?cv=2',
    zokor_fealty_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ec1495d1bb3dec04644ac55f9f1aadb6.png?cv=2',
    zokor_scholar_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/ad3d56dfb6b788dcdc8b0849f779bf47.png?cv=2',
    zokor_tech_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/f8c72f3d4bfd3848e2812abc4342a05b.png?cv=2',
    zokor_treasury_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/47ee91aa08ad6592e89c95fc6044c7de.png?cv=2',
    zurreal_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3896a1b68260eb95119fc54c35e7e95e.png?cv=2',
    zzt_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/2337b5b8e14a4ebf668139a750770f10.png?cv=2',
    agriculture_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/810d262bc2fe10a3c99b59993e8dd737.png?cv=2',
    archduke_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/5ac4d6da9f8e28d01adaccec620cb1d2.png?cv=2',
    architeuthulhu_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/ef6336b16c27cc3eb83d6babb62c54b4.png?cv=2',
    chummy_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/22022f49a2971100620162510f45a493.png?cv=2',
    dusted_archduke_eggsweeper_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/7d1b3cf75058c66f8a18ad40ed4bafae.png?cv=2',
    monstrous_midge_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/db525f45235eb31938088e276beed622.png?cv=2',
    mythweaver_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/0a57f3c7f8e7f3b031b740280e54ab61.png?cv=2',
    wordy_egg_convertible: 'https://www.mousehuntgame.com/images/items/convertibles/large/c5bc3c1bd62a3c7e9a8c3013b80bfa18.png?cv=2',

    // Removed backgrounds
    '2011_spring_hunt_egg_6': 'https://i.mouse.rip/2011-spring-hunt.png',
    black_widow_egg_convertible: 'https://i.mouse.rip/egg-black-widow.png',
    caring_egg_convertible: 'https://i.mouse.rip/caring-egg.png',
    friendly_egg_convertible: 'https://i.mouse.rip/friendly-egg.png',
    ful_mina_egg_convertible: 'https://i.mouse.rip/ful-mina-egg.png',
    realm_ripper_egg_convertible: 'https://i.mouse.rip/realm-ripper-egg.png',
    sharing_egg_convertible: 'https://i.mouse.rip/sharing-egg.png',
  };

  // Add the styles
  addStyles(`#overlayPopup.mh-dialog-book-wrapper .jsDialog.top,
  #overlayPopup.mh-dialog-book-wrapper .jsDialog.bottom,
  #overlayPopup.mh-dialog-book-wrapper .jsDialogContainer .suffix {
    display: none;
  }

  #overlayPopup.mh-dialog-book-wrapper .jsDialogContainer .prefix,
  #overlayPopup.mh-dialog-book-wrapper .jsDialogContainer .content,
  #overlayPopup.mh-dialog-book-wrapper .jsDialog.background {
    padding: 0;
    margin: 0;
    background: none;
  }

  #overlayPopup.mh-dialog-book-wrapper #jsDialogClose:hover, #overlayPopup.mh-dialog-book-wrapper #jsDialogClose:focus {
    background-position-y: 50%;
  }

  #overlayPopup.mh-dialog-book-wrapper #jsDialogClose:active {
    background-position-y: 100%;
  }

  #overlayPopup.mh-dialog-book-wrapper {
    position: relative;
    width: 744px;
    padding: 0;
    margin: 0 auto;
    margin-top: -150px;
  }

  #overlayPopup.mh-dialog-book-wrapper .jsDialog.top,
  #overlayPopup.mh-dialog-book-wrapper .jsDialog.bottom {
    position: absolute;
    top: 105px;
    left: 1px;
    display: block;
    width: 125px;
    height: 105px;
    content: '';
    background: url(https://www.mousehuntgame.com/images/ui/hud/folklore_forest_region/dialog/top_left.png?asset_cache_version=2);
  }

  #overlayPopup.mh-dialog-book-wrapper .jsDialog.bottom::after {
    position: absolute;
    top: 1px;
    right: -621px;
    z-index: 1;
    width: 138px;
    height: 106px;
    content: '';
    background: url(https://www.mousehuntgame.com/images/ui/hud/folklore_forest_region/dialog/top_right.png?asset_cache_version=2);
  }

  #overlayPopup.mh-dialog-book-wrapper #jsDialogClose {
    top: 118px;
    right: 16px;
    z-index: 1;
    width: 32px;
    height: 32px;
    background-image: url(https://www.mousehuntgame.com/images/ui/hud/folklore_forest_region/dialog/close_button.png?asset_cache_version=2) !important;
    background-position-y: 100%;
  }

  #overlayPopup.mh-dialog-book-wrapper .jsDialog.bottom::before {
    position: absolute;
    bottom: -566px;
    left: -8px;
    width: 55px;
    height: 54px;
    content: '';
    background: url(https://www.mousehuntgame.com/images/ui/hud/folklore_forest_region/dialog/bottom_left.png?asset_cache_version=2);
  }

  .custom-submenu-item .icon {
    top: 3px;
    left: 3px;
    width: 23px;
    height: 23px;
  }

  .book-wrapper {
    width: 744px;
    height: 822px;
    background: url(https://i.mouse.rip/book-wrapper.png) 50% 0 no-repeat;
  }

  .right-header {
    box-sizing: border-box;
    width: 326px;
    height: 75px;
    padding: 10px 20px 0 14px;
    padding-bottom: 7px;
    margin-left: 0;
    text-align: center;
    background: url(https://i.mouse.rip/book-header.png) 0 0 no-repeat;
    box-shadow: 0 5px 4px -5px #d2a155;
  }

  .right-header-text {
    max-width: 180px;
    margin: 0 auto;
    font-size: 12px;
    font-weight: 700;
  }

  .right-subheader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 0.75em;
    font-size: 10px;
    font-style: italic;
  }

  .right-content {
    height: 429px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 10px;
  }

  .right-thumb {
    width: 80px;
    height: 80px;
  }

  .right-meta {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 15px;
  }

  .egg-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 5px;
  }

  .egg-wrapper-image {
    flex: 1;
  }

  .eggs-wrapper .egg-wrapper-unfound img {
    mix-blend-mode: luminosity;
    opacity: .5;
  }

  .egg-wrapper-image img {
    width: 40px;
    height: 40px;
    margin-right: 5px;
    vertical-align: middle;
  }

  .egg-name {
    color: #8c5909;
  }

  .egg-wrapper:hover .find-egg,
  .egg-wrapper:focus .find-egg {
    display: inline-block;
    padding: 5px 0;
    color: #916728;
    text-decoration: none;
    background: none;
  }

  .egg-wrapper:hover,
  .egg-wrapper:focus {
    cursor: pointer;
    background-color: #f7e3a9;
    border-radius: 10px;
    box-shadow: inset 1px 1px 3px 1px #f7e3a9;
  }

  .find-egg:hover, .find-egg:focus {
    text-decoration: none;
    background-color: #d1fdff;
    background-image: linear-gradient(to bottom, #d1fdff, #658c99);
  }

  .book-right-side,
  .book-welcome-categories {
    position: absolute;
    top: 155px;
    left: 385px;
    width: 335px;
  }

  .eggs-wrapper,
  .categories-wrapper {
    position: absolute;
    top: 200px;
    left: 40px;
    width: 315px;
    height: 480px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: transparent;
  }

  .categories-wrapper {
    top: 80px;
    left: 5px;
    width: 325px;
    height: 429px;
    padding-top: 5px;
  }

  .eggs-wrapper,
  .right-content {
    scrollbar-color: #e1c07f transparent;
  }

  .eggs-wrapper::-webkit-scrollbar,
  .categories-wrapper::-webkit-scrollbar,
  .right-content::-webkit-scrollbar {
    width: 10px;
  }

  .eggs-wrapper::-webkit-scrollbar-track,
  .categories-wrapper::-webkit-scrollbar-track,
  .right-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .eggs-wrapper::-webkit-scrollbar-thumb,
  .categories-wrapper::-webkit-scrollbar-thumb,
  .right-content::-webkit-scrollbar-thumb {
    background-color: #e1c07f;
    border: 3px solid transparent;
    border-radius: 5px;
  }

  .right-description {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-gap: 1.25em;
    align-items: center;
    max-width: 300px;
    -ms-grid-columns: 1fr 1.25em 4fr;
  }

  .book-right-side h2,
  .right-name h2 {
    font-size: 1.25em;
  }

  .egg-wrapper-found {
    position: relative;
    color: #2c672c;
  }

  .egg-wrapper-found::after {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 25px;
    height: 25px;
    content: '';
    background-image: url(https://www.mousehuntgame.com/images/ui/hud/meadow_checkmark.png?asset_cache_version=2);
    filter: drop-shadow(5px -1px 5px #19e718);
    background-repeat: no-repeat;
    background-size: contain;
  }

  .right-short-text p {
    font-size: 11px;
    font-style: italic;
    line-height: 15px;
  }

  .right-text {
    margin: 2em;
  }

  .halloweenBoilingCauldronRecipeView-recipe-ingredientContainer td:first-child,
  .halloweenBoilingCauldronRecipeView-recipe-ingredientContainer td:last-child {
    padding-left: 5px;
  }

  .aqure-list-wrapper {
    position: relative;
    padding: 10px;
    margin-top: 20px;
    background: #f7e3a9;
    border-radius: 5px;
    box-shadow: 0 0 5px #e8d7a4 inset;
  }

  .aquire-list-header {
    font-size: 12px;
    font-style: italic;
    color: #916728;
  }

  .aquire-text {
    padding: 10px;
    font-size: 13px;
    line-height: 21px;
  }

  .left-header {
    position: absolute;
    top: 155px;
    left: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 305px;
    padding-bottom: 1em;
    border: none;
    box-shadow: 0 5px 4px -5px #d2a155;
  }

  .egg-search-input {
    padding: 5px;
    font-size: 12px;
    color: #674e29;
    background-color: #f2dca4;
    border: none;
    border-radius: 6px;
    box-shadow: inset 1px 1px 1px 0 #daa756;
  }

  .egg-search-input::placeholder {
    color: #b58e51 !important;
  }

  .egg-tool-image {
    width: 30px;
    height: 30px;
    filter: opacity(0.8);
    mix-blend-mode: luminosity;
  }

  .egg-tool-image:hover,
  .egg-tool-image:focus {
    filter: opacity(1);
    mix-blend-mode: multiply;
  }

  .category-eggs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  img.category-egg-image {
    width: 50px;
    height: 50px;
  }

  .category-title {
    font-size: 1.75em;
    color: #996f2e;
    text-align: center;
  }

  .category-subtitle {
    padding: 1em;
    font-size: 10px;
    font-style: italic;
    line-height: 15px;
    text-align: center;
  }

  .category-wrapper {
    margin-bottom: 2em;
  }

  .book-welcome-categories {
    height: 526px;
    overflow: hidden;
  }

  .egg-close {
    position: absolute;
    bottom: 50px;
    left: 138px;
    width: 168px;
    height: 63px;
    font-size: 17px;
    font-weight: 700;
    line-height: 51px;
    color: #d7eecb;
    text-align: center;
    text-shadow: 1px 1px 2px #1a2502;
    background-image: url(https://www.mousehuntgame.com/images/ui/hud/folklore_forest_region/dialog/continue_button_frame.png?asset_cache_version=2);
    background-position: 0 100%;
  }

  .egg-close:hover,
  .egg-close:focus {
    text-decoration: none;
  }

  .egg-export {
    position: absolute;
    bottom: 50px;
    left: 438px;
    width: 168px;
    height: 63px;
    font-size: 11px;
    font-weight: 700;
    line-height: 51px;
    color: #d7eecb;
    text-align: center;
    text-shadow: 1px 1px 2px #1a2502;
    background-image: url(https://www.mousehuntgame.com/images/ui/hud/folklore_forest_region/dialog/continue_button_frame.png?asset_cache_version=2);
    background-position: 0 100%;
  }

  .egg-export:hover,
  .egg-export:focus {
    text-decoration: none;
  }

  .egg-filter,
  .egg-back-button {
    color: #b0833d;
  }

  .egg-back-button {
    position: absolute;
    top: 136px;
    right: 275px;
    z-index: 1;
    font-size: 13px;
  }

  .egg-filter:hover,
  .egg-back-button:hover,
  .egg-back-button:focus,
  .egg-back-button:active {
    color: #7b581f;
    text-decoration: none;
  }

  .book-welcome-categories-hidden,
  .egg-back-button-hidden,
  .egg-wrapper-hidden,
  .egg-wrapper-filter-hidden,
  .find-egg {
    display: none;
  }

  .category-egg-wrapper.egg-wrapper-unfound {
    mix-blend-mode: luminosity;
    opacity: .2;
  }

  .category-egg-wrapper.egg-wrapper-unfound:hover, .category-egg-wrapper.egg-wrapper-unfound:focus {
    mix-blend-mode: initial;
    opacity: 1;
  }

  @media screen and (prefers-reduced-motion: reduce) {
  .category-egg-wrapper {
    transition: none;
  }
  }

  .category-egg-wrapper {
    transition: .125s;
  }

  .category-egg-wrapper:hover, .category-egg-wrapper:focus {
    transform: scale(1.1);
  }

  .collected-text {
    margin-top: 1.75em;
    font-size: 10px;
    color: #957f58;
    text-align: center;
    opacity: .75;
  }

  .collected-text a {
    color: #481313;
  }

  .no-eggs-found {
    display: inline-block;
    width: 100%;
    margin-top: 2em;
    color: #cdab6f;
    text-align: center;
  }

  .no-eggs-found-hidden {
    display: none;
  }

  @media screen and (prefers-reduced-motion: reduce) {
  #mh-custom-icon-egg {
    position: absolute;
    top: 5px;
    left: -27px;
    z-index: 1;
    filter: drop-shadow(1px 1px 1px #debb6c);
    transition: none;
  }
  }

  #mh-custom-icon-egg {
    position: absolute;
    top: 5px;
    left: -27px;
    z-index: 1;
    filter: drop-shadow(1px 1px 1px #debb6c);
    transition: .125s;
  }

  #mh-custom-icon-egg:hover, #mh-custom-icon-egg:focus {
    filter: drop-shadow(1px 1px 6px #debb6c);
    transform: scale(1.2);
  }

  #mh-custom-icon-egg img {
    width: 30px;
    height: 30px;
    filter: drop-shadow(2px 4px 6px #debe6b);
  }

  .drop-rate {
    margin-left: 0.25em;
    font-size: .9em;
    font-style: italic;
    color: #423726;
  }

  #mh-mouseplace-setting-seh-uem-mode .defaultSettingText,
  #mh-mouseplace-setting-seh-scrambles .defaultSettingText,
  #mh-mouseplace-setting-seh-scrambles-buddy .defaultSettingText {
    margin-top: 0.65em;
  }

  @media screen and (prefers-reduced-motion: reduce) {
    .seh-image-saved-hidden::after {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      width: 80px;
      height: 15px;
      margin-top: 90px;
      margin-left: 10px;
      color: #8e784f;
      text-align: center;
      content: "Saved!";
      background-image: url(https://www.mousehuntgame.com/images/ui/events/winter_hunt_2013/checkmark.png?asset_cache_version=2);
      background-repeat: no-repeat;
      background-size: contain;
      opacity: 0;
      transition: none;
    }
  }

  .seh-image-saved-hidden::after {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 80px;
    height: 15px;
    margin-top: 90px;
    margin-left: 10px;
    color: #8e784f;
    text-align: center;
    content: "Saved!";
    background-image: url(https://www.mousehuntgame.com/images/ui/events/winter_hunt_2013/checkmark.png?asset_cache_version=2);
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0;
    transition: .125s linear;
  }

  @media screen and (prefers-reduced-motion: reduce) {
  .seh-image-saved::after {
    opacity: 1;
    transition: none;
  }
  }

  .seh-image-saved::after {
    opacity: 1;
    transition: .125s linear;
  }

  .expanded-eggs {
    display: flex;
    flex-wrap: wrap;
    background: #f6f3eb;
    z-index: 100;
    position: absolute;
    top: 0;
    padding: 25px;
    border: 1px solid #7b581f;
    left: -50%;
    right: -50%;
    margin: 0 auto;
    height: auto;
    width: 800px;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  .expanded-eggs-close {
    display: block;
    color: #b0833d;
    font-size: 12px;
    position: absolute;
    top: 11px;
    background-color: #f6f3eb;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border: 1px solid #7b581f;
    border-top-color: #f6f3eb;
    padding: 5px 20px;
    right: -40px;
    transform: rotate(270deg);
    pointer-events: all;
  }

  .expanded-eggs-close:hover {
    background-color: #cebe92;
    border-top-color: #cebe92;
    color: #f6f3eb;
    text-decoration: none;
  }

  .welcome-expand-button {
    margin: 0 auto;
    display: inline-block;
    color: #b38741;
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
  }
  `);

  const getEggs = async () => {
    const response = await doRequest('managers/ajax/events/spring_hunt.php', { action: 'get_eggs' });
    if (! response || (response && ! response.spring_hunt_egg_info)) {
      return [];
    }

    return response.spring_hunt_egg_info;
  };

  const isFound = (egg) => {
    isUEM = getSetting('seh-uem-mode', false);
    if (isUEM) {
      return egg.quantity > 0;
    }

    return egg.is_found;
  };

  const isScrambles = () => {
    return getSetting('seh-scrambles', false);
  };

  const makeAquireSection = (egg, title, content, appendTo = null, type = null) => {
    const wrapper = document.createElement('div');

    const aquireListHeader = makeElement('div', 'aquire-list-header', title);
    const aquireText = makeElement('div', 'aquire-text');

    if (! Array.isArray(content)) {
      content = [content];
    }

    const list = makeElement('ul', 'aquire-list');

    content.forEach((item) => {
      const text = item.name ? item.name : item;
      const listItem = document.createElement('li');
      listItem.classList.add('aquire-list-item');

      if ('mice' === type) {
        const link = document.createElement('a');
        link.setAttribute('href', `https://mhct.win/attractions.php?mouse_name=${text}`);
        link.setAttribute('target', '_blank');
        link.innerHTML = text;

        listItem.appendChild(link);
      } else if ('location' === type) {
        const locationLink = document.createElement('a');
        locationLink.setAttribute('href', '#');
        locationLink.setAttribute('data-location', item.type);
        locationLink.classList.add('location-link');
        locationLink.innerHTML = item.name;

        locationLink.addEventListener('click', (e) => {
          e.preventDefault();
          const location = e.target.getAttribute('data-location');
          hg.utils.PageUtil.setPage('Travel');

          setTimeout(() => {
            // Change tab in case Travel Tweaks is installed.
            const travelTab = document.querySelector('.mousehuntHud-page-tabHeader.map');
            if (travelTab) {
              travelTab.click();
            }

            popup.hide();

            // Force zoomed in all the way in case Travel Tweaks is installed.
            app.pages.TravelPage.zoomIn();
            app.pages.TravelPage.zoomIn();

            setTimeout(() => {
              app.pages.TravelPage.zoomIn();
            }, 100);

            setTimeout(() => {
              app.pages.TravelPage.zoomIn();
            }, 250);

            app.pages.TravelPage.showEnvironment(location);
          }, 500);
        });

        listItem.appendChild(locationLink);
      } else {
        listItem.innerHTML = text;
      }

      list.appendChild(listItem);
    });

    aquireText.appendChild(list);

    wrapper.appendChild(aquireListHeader);
    wrapper.appendChild(aquireText);

    if (appendTo) {
      appendTo.appendChild(wrapper);
    }

    return wrapper;
  };

  const getAquireList = (egg) => {
    const wrapper = document.createElement('div');
    const aquireListWrapper = makeElement('div', 'aqure-list-wrapper');
    let tipShown = false;

    if (ways[egg.type] !== undefined) {
      if (ways[egg.type].text !== undefined) {
        makeAquireSection(egg, '', [ways[egg.type].text], aquireListWrapper, 'tip');
        tipShown = true;
      }
    }

    if (ways[egg.type] !== undefined) {
      if (Array.isArray(ways[egg.type].mice)) {
        makeAquireSection(egg, 'Can be dropped from:', ways[egg.type].mice, aquireListWrapper, 'mice');
      } else if (! tipShown) {
        makeAquireSection(egg, '', [ways[egg.type]], aquireListWrapper, 'tip');
      }
    }

    if (environments[egg.type] !== undefined && environments[egg.type].length > 0) {
      makeAquireSection(egg, 'Can be found in:', environments[egg.type], aquireListWrapper, 'location');
    }

    wrapper.appendChild(aquireListWrapper);

    return wrapper;
  };

  const showEggDetails = (eggType) => {
    const bookRightSide = document.querySelector('.book-right-side');
    if (! bookRightSide) {
      return;
    }

    const welcome = document.querySelector('.book-welcome-categories');
    if (welcome) {
      welcome.classList.add('book-welcome-categories-hidden');
    }

    const backButton = document.querySelector('.egg-back-button');
    if (backButton) {
      backButton.classList.remove('egg-back-button-hidden');
    }

    const egg = eggsData[eggType];

    const detailsWrapper = makeElement('div', 'book-right-side');
    const detailHeader = makeElement('div', 'right-header');

    const nameWrapper = makeElement('div', 'right-header-text');
    makeElement('h2', 'right-name', egg.name, nameWrapper);

    detailHeader.appendChild(nameWrapper);

    makeElement('div', 'right-subheader', egg.category.charAt(0).toUpperCase() + egg.category.slice(1), detailHeader);

    detailsWrapper.appendChild(detailHeader);

    const descriptionWrapper = makeElement('div', 'right-content');
    const description = makeElement('div', 'right-description');
    description.classList.add('seh-image-saved-hidden');

    const descriptionImage = document.createElement('img');
    if (eggImages[egg.type]) {
      descriptionImage.src = eggImages[egg.type];
    } else {
      descriptionImage.src = egg.thumb;
    }
    descriptionImage.alt = egg.name;
    descriptionImage.classList.add('right-thumb');

    descriptionImage.addEventListener('click', (e) => {
      if (! e.shiftKey) {
        return;
      }

      const image = e.target;
      changeEggImage(image.src);

      image.parentElement.classList.add('seh-image-saved');
      setTimeout(() => {
        image.parentElement.classList.remove('seh-image-saved');
      }, 2000);
    });

    description.appendChild(descriptionImage);

    const descriptionText = makeElement('div', 'right-short-text');
    const descriptionTextContent = makeElement('p', 'right-description-text', egg.description);
    descriptionText.appendChild(descriptionTextContent);

    if (egg.description !== egg.hint) {
      const hint = makeElement('p', 'right-description-text', egg.hint);
      hint.classList.add('egg-hint');
      descriptionText.appendChild(hint);
    }

    description.appendChild(descriptionText);

    descriptionWrapper.appendChild(description);

    const detailsText = makeElement('div', 'right-text');

    const aquire = getAquireList(egg);
    detailsText.appendChild(aquire);

    const collectedText = makeElement('div', 'collected-text');
    if (isFound(egg)) {
      makeElement('div', 'egg-collected', `You have <a href="#" onclick="hg.views.ItemView.show('${egg.type}'); return false;">${egg.quantity} in your inventory</a>.`, collectedText);
    } else {
      makeElement('div', 'egg-not-collected', 'You have not collected this egg.', collectedText);
    }

    detailsText.appendChild(collectedText);

    descriptionWrapper.appendChild(detailsText);
    detailsWrapper.appendChild(descriptionWrapper);

    bookRightSide.parentNode.replaceChild(detailsWrapper, bookRightSide);
  };

  const makeEggsWrapper = (eggs) => {
    environments = {};
    eggs.environments.forEach((environment) => {
      if (environment.egg_types.length > 0) {
        environment.egg_types.forEach((eggType) => {
          if (environments[eggType] !== undefined) {
            environments[eggType].push(environment);
          } else {
            environments[eggType] = [environment];
          }
        });
      }
    });

    // Deduplicate environments
    Object.keys(environments).forEach((eggType) => {
      environments[eggType] = [...new Set(environments[eggType])];
    });

    // sort eggs.eggs alphabetically
    eggs.eggs.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    const eggsWrapper = makeElement('div', 'eggs-wrapper');

    eggs.eggs.forEach((egg) => {
      const itemWrapper = makeElement('div', 'egg-wrapper');
      if (isFound(egg)) {
        itemWrapper.classList.add('egg-wrapper-found');
      } else {
        itemWrapper.classList.add('egg-wrapper-unfound');
      }

      itemWrapper.setAttribute('data-type', egg.type);
      itemWrapper.classList.add('egg-action');

      const itemWrapperImage = makeElement('div', 'egg-wrapper-image');

      const eggImage = document.createElement('img');
      eggImage.src = eggImages[egg.type] || egg.thumb;
      eggImage.alt = egg.name;

      const eggName = document.createElement('span');
      eggName.classList.add('egg-name');
      eggName.innerText = egg.name;

      itemWrapperImage.appendChild(eggImage);
      itemWrapperImage.appendChild(eggName);

      itemWrapper.appendChild(itemWrapperImage);

      const itemAction = makeElement('a', 'egg-action');
      itemAction.href = '#';
      itemAction.classList.add('find-egg');
      itemAction.setAttribute('data-type', egg.type);
      eggsData[egg.type] = egg;

      itemAction.innerText = 'View Details →';

      itemWrapper.appendChild(itemAction);

      eggsWrapper.appendChild(itemWrapper);
    });

    makeElement('div', 'no-eggs-found no-eggs-found-hidden', 'No eggs found', eggsWrapper);

    return eggsWrapper;
  };

  const makeWelcome = (eggs) => {
    const rightSideWrapper = makeElement('div', 'book-welcome-categories');

    const rightSideHeader = makeElement('div', 'right-header');
    const rightHeaderText = makeElement('div', 'right-header-text');
    const rightSideHeaderTitle = makeElement('h2', 'right-name');
    rightSideHeaderTitle.innerText = 'Spring Egg Hunt';
    const rightSideHeaderSubTitle = makeElement('div', 'right-subheader');

    const foundEggs = eggs.eggs.filter((egg) => isFound(egg)).length;
    rightSideHeaderSubTitle.innerText = `${foundEggs} / ${eggs.eggs.length} eggs found`;
    if (isUEM) {
      rightSideHeaderSubTitle.innerText += ' (UEM mode)';
    }

    rightHeaderText.appendChild(rightSideHeaderTitle);
    rightSideHeader.appendChild(rightHeaderText);

    rightSideHeader.appendChild(rightSideHeaderSubTitle);
    rightSideWrapper.appendChild(rightSideHeader);

    const categoriesWrapper = makeElement('div', 'categories-wrapper');

    Object.keys(eggs.categories).forEach((categoryKey) => {
      if ('charge' === categoryKey) {
        return;
      }

      const categoryWrapper = makeElement('div', 'category-wrapper');

      const categoryTitle = makeElement('h4', 'category-title');
      categoryTitle.innerText = eggs.categories[categoryKey].name;

      categoryWrapper.appendChild(categoryTitle);

      const categorySubTitle = makeElement('h5', 'category-subtitle');
      categorySubTitle.innerText = eggs.categories[categoryKey].description;

      categoryWrapper.appendChild(categorySubTitle);

      const categoryEggs = makeElement('div', 'category-eggs');

      eggs.categories[categoryKey].egg_types.forEach((eggType) => {
        const eggWrapper = makeElement('div', 'category-egg-wrapper');
        const eggLink = makeElement('a', 'egg-action');
        eggLink.href = '#';
        eggLink.classList.add('welcome-egg-action');

        const eggImage = makeElement('img', 'category-egg-image');
        eggImage.src = eggImages[eggsData[eggType].type] || eggsData[eggType].thumb;

        eggLink.setAttribute('data-type', eggType);

        eggLink.setAttribute('title', eggsData[eggType].name);

        if (! isFound(eggsData[eggType])) {
          eggWrapper.classList.add('egg-wrapper-unfound');
        }

        eggLink.appendChild(eggImage);
        eggWrapper.appendChild(eggLink);
        categoryEggs.appendChild(eggWrapper);
      });

      categoryWrapper.appendChild(categoryEggs);

      categoriesWrapper.appendChild(categoryWrapper);
    });

    makeElement('a', 'welcome-expand-button', 'Expand egg summary', categoriesWrapper);

    rightSideWrapper.appendChild(categoriesWrapper);

    return rightSideWrapper;
  };

  const makeLeftHeader = () => {
    const leftHeader = makeElement('div', 'left-header');

    const searchWrapper = makeElement('div', 'search-wrapper');
    const searchInput = makeElement('input', 'egg-search-input');
    searchInput.setAttribute('id', 'egg-search-input');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('placeholder', 'Search eggs...');

    searchWrapper.appendChild(searchInput);

    leftHeader.appendChild(searchWrapper);

    const filtersWrapper = makeElement('div', 'filters-wrapper');

    const filter = makeElement('a', 'egg-filter');
    filter.href = '#';
    filter.id = 'egg-filter';

    filter.innerText = 'Hide Collected';

    filtersWrapper.appendChild(filter);

    leftHeader.appendChild(filtersWrapper);

    const eggToolLinks = makeElement('a', 'egg-tool-link');
    eggToolLinks.setAttribute('href', '#');

    const eggToolImage = document.createElement('img');
    eggToolImage.src = 'https://i.mouse.rip/eggtool.png';
    eggToolImage.alt = 'Egg Tool';
    eggToolImage.classList.add('egg-tool-image');

    eggToolLinks.appendChild(eggToolImage);
    eggToolLinks.setAttribute('onclick', 'hg.views.CampHudSpringEggHunt.showPopup();');

    leftHeader.appendChild(eggToolLinks);

    return leftHeader;
  };

  const addEggShowAction = () => {
    const eggActions = document.querySelectorAll('.egg-action');
    if (! eggActions) {
      return;
    }

    eggActions.forEach((action) => {
      action.addEventListener('click', (e) => {
        e.preventDefault();
        const type = e.currentTarget.getAttribute('data-type');
        showEggDetails(type);
      });
    });
  };

  const addSearchAction = () => {
    const searchFilter = document.querySelector('#egg-search-input');
    if (! searchFilter) {
      return;
    }

    searchFilter.addEventListener('keyup', (e) => {
      const searchTerm = e.target.value;
      searchEggs(searchTerm);
    });

    searchFilter.addEventListener('input', (e) => {
      e.preventDefault();
      const searchTerm = e.target.value;
      searchEggs(searchTerm);
    });
  };

  const addFilterAction = () => {
    const filterButton = document.querySelector('#egg-filter');
    if (! filterButton) {
      return;
    }

    filterButton.addEventListener('click', (e) => {
      e.preventDefault();
      filterEggs(filterButton);

      const searchTerm = document.querySelector('#egg-search-input');
      if (searchTerm.value) {
        searchEggs(searchTerm);
      }
    });
  };

  const addBackAction = () => {
    const backButton = document.querySelector('#egg-back-button');
    if (! backButton) {
      return;
    }

    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      const welcome = document.querySelector('.book-welcome-categories');
      if (welcome) {
        welcome.classList.remove('book-welcome-categories-hidden');
      }

      const eggDetails = document.querySelector('.book-right-side');
      if (eggDetails) {
        eggDetails.innerHTML = '';
      }

      backButton.classList.add('egg-back-button-hidden');
    });
  };

  const searchEggs = (searchTerm) => {
    const eggsWrapper = document.querySelector('.eggs-wrapper');
    if (! eggsWrapper) {
      return;
    }

    const eggNames = eggsWrapper.querySelectorAll('.egg-name');

    let hasAtLeastOneMatch = false;
    eggNames.forEach((eggName) => {
      const eggWrapper = eggName.parentNode.parentNode;
      if (eggName.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
        eggWrapper.classList.remove('egg-wrapper-hidden');
        hasAtLeastOneMatch = true;
      } else {
        eggWrapper.classList.add('egg-wrapper-hidden');
      }
    });

    const noResults = document.querySelector('.no-eggs-found');
    if (noResults) {
      if (hasAtLeastOneMatch) {
        noResults.classList.add('no-eggs-found-hidden');
      } else {
        noResults.classList.remove('no-eggs-found-hidden');
      }
    }
  };

  const filterEggs = (filterButton) => {
    filterButton.classList.toggle('egg-filter-active');

    if (filterButton.classList.contains('egg-filter-active')) {
      filterButton.innerText = 'Show Collected';
    } else {
      filterButton.innerText = 'Hide Collected';
    }

    const eggsWrapper = document.querySelector('.eggs-wrapper');
    const eggWrappers = eggsWrapper.querySelectorAll('.egg-wrapper');

    if (! eggsWrapper || ! eggWrappers) {
      return;
    }

    eggWrappers.forEach((eggWrapper) => {
      if (eggWrapper.classList.contains('egg-wrapper-found')) {
        eggWrapper.classList.toggle('egg-wrapper-filter-hidden');
      } else {
        eggWrapper.classList.remove('egg-wrapper-filter-hidden');
      }
    });
  };

  const addExpandAction = () => {
    const expandButton = document.querySelector('.welcome-expand-button');
    const bookWrapper = document.querySelector('.book-wrapper');
    if (expandButton && bookWrapper) {
      expandButton.addEventListener('click', () => {
        bookWrapper.classList.toggle('book-wrapper-expanded');

        const welcomeEggs = document.querySelectorAll('.book-welcome-categories .category-egg-wrapper');
        if (welcomeEggs) {
          const expandedEggs = document.createElement('div');
          expandedEggs.classList.add('expanded-eggs');

          welcomeEggs.forEach((egg) => {
            expandedEggs.appendChild(egg.cloneNode(true));
          });

          const close = document.createElement('a');
          close.classList.add('expanded-eggs-close');
          close.innerText = '✕';
          close.addEventListener('click', () => {
            expandedEggs.remove();
          });

          expandedEggs.appendChild(close);

          bookWrapper.appendChild(expandedEggs);
        }
      });
    }
  };

  function createExportRow(egg) {
    return `${egg.name}\t${egg.quantity > 0 ? 1 : 0}`;
  }

  function exportAllMyData() {
    let fullOutput = '';
    Object.values(eggsData).forEach((egg) => {
      fullOutput += createExportRow(egg) + '\n';
    });

    navigator.clipboard.writeText(fullOutput)
      .then(() => console.log('Copied to clipboard:\n')) // eslint-disable-line no-console
      .catch((err) => console.error('Failed to copy text: ', err)); // eslint-disable-line no-console
  }

  const bookPopup = async () => {
    popup = new jsDialog();
    popup.setTemplate('ajax');
    popup.setAttributes({ className: 'mh-dialog-book-wrapper' });
    popup.addToken('{*prefix*}', '');
    popup.addToken('{*suffix*}', '');

    const eggs = await getEggs();

    const leftWrapper = makeElement('div', 'book-left-side');

    const leftHeader = makeLeftHeader();
    leftWrapper.appendChild(leftHeader);

    const eggsWrapper = makeEggsWrapper(eggs);
    leftWrapper.appendChild(eggsWrapper);

    const rightSideFull = makeElement('div', 'book-right-side-full');

    const backButton = makeElement('a', 'egg-back-button');
    backButton.id = 'egg-back-button';
    backButton.classList.add('egg-back-button-hidden');
    backButton.href = '#';
    backButton.innerText = '← back';

    rightSideFull.appendChild(backButton);

    const welcome = makeWelcome(eggs);
    rightSideFull.appendChild(welcome);

    const rightSide = makeElement('div', 'book-right-side');
    rightSideFull.appendChild(rightSide);

    popup.addToken('{*content*}', `<div class="book-wrapper">
      ${leftWrapper.outerHTML}
      ${rightSideFull.outerHTML}
      <a href="#" class="halloweenBoilingCauldronRecipeView-doneButton egg-close" onclick="activejsDialog.hide(); return false;">Close</a>
      <a href="#" id="egg-export-button" class="halloweenBoilingCauldronRecipeView-doneButton egg-export">Copy to clipboard</a>
    </div>`);

    popup.show();

    document.getElementById('egg-export-button').addEventListener('click', function () {
      exportAllMyData(eggs);
    });

    addEggShowAction();
    addSearchAction();
    addFilterAction();
    addBackAction();
    addExpandAction();
  };

  /**
   * Create a Larry popup.
   */
  const createLarryWelcomePopup = () => {
    if (getSetting('has-seen-egg-welcome-popup', false)) {
      return;
    }

    addStyles('#overlayPopup.egg-larry-popup .jsDialogContainer { background-image: url(https://i.mouse.rip/larry-welcome.png);}');

    const message = {
      content: { body: '<div class="custom-larry-popup"><span class="text">Thanks for installing the SEH Helper! <p>You can find it under the Camp menu and can change the settings in your Preferences.</span> <a href="#" id="spring-egg-hunt-helper" class="action jsDialogClose">Continue</a></div>' },
      css_class: 'larryOffice egg-larry-popup',
      show_overlay: true,
      is_modal: true
    };

    hg.views.MessengerView.addMessage(message);
    hg.views.MessengerView.go();

    const larryPopup = document.querySelector('#spring-egg-hunt-helper');
    if (larryPopup) {
      larryPopup.addEventListener('click', () => {
        saveSetting('has-seen-egg-welcome-popup', true);
      });
    }
  };

  const doScrambles = async () => {
    const resp = await doRequest('managers/ajax/users/userInventory.php', {
      action: 'get_items',
      'item_types[]': ['spring_chick_message_item'],
    });

    if (! (resp && resp.items && resp.items.length)) {
      return false;
    }

    const scrambles = createPopup({
      title: resp.items[0].name,
      content: resp.items[0].message,
      hasCloseButton: true,
      template: 'singleItemLeft',
      show: false,
    });

    scrambles.setAttributes({
      className: resp.items[0].type
    });

    scrambles.addToken('{*items*}', {
      0: resp.items[0]
    }, 'imgArray');

    scrambles.show();
  };

  /**
   * Get a random egg image.
   *
   * @return {string} The URL of the egg image.
   */
  const getRandomEggImage = () => {
    return Object.values(eggImages)[Math.floor(Math.random() * Object.values(eggImages).length)];
  };

  /**
   * Change the egg icon to a random egg image.
   *
   * @param {string} url The URL of the egg image.
   */
  const changeEggImage = (url = false) => {
    const icon = document.querySelector('#mh-egg-icon');
    if (icon) {
      if (url) {
        icon.src = url;
      } else {
        icon.src = getRandomEggImage();
      }
    }

    // Save the setting after 1 second, but reset the timer if the user clicks again.
    if (saveEggImage) {
      clearTimeout(saveEggImage);
    }

    saveEggImage = setTimeout(() => {
      saveSetting('seh-egg-image', icon.src);
    }, 1000);
  };

  /**
   * Add the egg icon.
   */
  const addEggIcon = () => {
    if (! getSetting('seh-show-egg', true)) {
      return;
    }

    const menu = document.querySelector('.mousehuntHud-menu');
    if (! menu) {
      return;
    }

    const item = document.createElement('div');
    item.id = 'mh-custom-icon-egg';

    item.addEventListener('click', () => {
      if (isScrambles()) {
        doScrambles();
      } else {
        changeEggImage();
      }
    });

    const icon = document.createElement('img');
    icon.id = 'mh-egg-icon';
    if (isScrambles()) {
      icon.src = 'https://i.mouse.rip/scrambles.png';
    } else {
      const savedImage = getSetting('seh-egg-image', getRandomEggImage());
      if (savedImage) {
        icon.src = savedImage;
      }
    }

    icon.alt = 'Spring Egg Hunt Helper';

    item.appendChild(icon);

    menu.appendChild(item);
  };

  /**
   * Bawk!
   */
  const addDraggableScrambles = () => {
    if (! getSetting('seh-scrambles-buddy', false)) {
      return;
    }

    addStyles(`#scrambles {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 50;
    }

    #scrambles img {
      width: 50px;
      height: 50px;
      filter: drop-shadow(1px 4px 2px #656565);
      filter: drop-shadow(1px 4px 2px #656565);
    }

    @keyframes scrambles-spin {
      from {
        transform: rotate(0deg);
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes scrambles-spin {
      from {
        transform: rotate(0deg);
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @media screen and (prefers-reduced-motion: reduce) {
      #scrambles.scrambles-spin {
        animation-name: scrambles-spin;
        animation: none;
        animation-duration: .5s;
        animation-duration: .5s;
        animation-timing-function: linear;
        animation-timing-function: linear;
        animation-iteration-count: 1;
        animation-iteration-count: 1;
      }
    }

    #scrambles.scrambles-spin {
      animation-name: scrambles-spin;
      animation-name: scrambles-spin;
      animation-duration: .5s;
      animation-duration: .5s;
      animation-timing-function: linear;
      animation-timing-function: linear;
      animation-iteration-count: 1;
      animation-iteration-count: 1;
    }

    #scrambles.scrambles-flip {
      transform: scaleX(-1);
      transform: scaleX(-1);
    }
    `);

    const body = document.querySelector('body');

    const item = document.createElement('div');
    item.id = 'scrambles';
    const icon = document.createElement('img');
    icon.id = 'scrambes-icon';
    icon.src = 'https://i.mouse.rip/scrambles.png';

    icon.addEventListener('dblclick', (e) => {
      if (e.shiftKey) {
        // randomize the position
        const x = Math.floor(Math.random() * (window.innerWidth - 50));
        const y = Math.floor(Math.random() * (window.innerHeight - 50));

        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
      } else {
        item.classList.add('scrambles-spin');
        setTimeout(() => {
          item.classList.remove('scrambles-spin');
        }, 550);
      }
    });

    icon.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      item.classList.toggle('scrambles-flip');
    });

    icon.addEventListener('wheel', (e) => {
      e.preventDefault();
      const scale = e.deltaY > 0 ? 0.9 : 1.1;
      const transform = icon.style.transform;
      const scaleValue = transform ? transform.match(/scale\((\d+\.?\d*)\)/)[1] : 1;
      let newScale = scaleValue * scale;

      // don't let it get too big or too small
      if (newScale < 0.3) {
        newScale = 0.3;
      }

      if (newScale > 40) {
        newScale = 40;
      }

      icon.style.transform = `scale(${newScale})`;

      // save the new scale
      localStorage.setItem('mh-scrambles-scale', newScale);
    });

    const scale = localStorage.getItem('mh-scrambles-scale');
    if (scale) {
      icon.style.transform = `scale(${scale})`;
    }

    item.appendChild(icon);
    body.appendChild(item);

    makeElementDraggable('#scrambles', '#scrambes-icon');
  };

  let popup = null;
  let environments = [];
  const eggsData = [];
  let isUEM = false;
  let saveEggImage = false;

  addDraggableScrambles();
  addEggIcon();

  addSubmenuItem({
    menu: 'camp',
    label: 'Spring Egg Hunt Helper',
    icon: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/887162c61d0e01985ffc12e41c03d952.png?cv=2',
    class: 'mh-dialog-book',
    callback: bookPopup
  });

  if (isLegacyHUD()) {
    addItemToGameInfoBar({
      label: 'Spring Egg Hunt Helper',
      icon: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/887162c61d0e01985ffc12e41c03d952.png?cv=2',
      class: 'mh-egg-helper-top-menu',
      callback: bookPopup
    });
  }

  const settingSection = {
    id: 'seh-settings',
    name: '🥚️ SEH Helper Settings',
  };

  const tab = addSettingsTab();

  addSetting(
    'Ultimate Egg Master Mode',
    'seh-uem-mode',
    false,
    'Track collected/uncollected by whether or not they\'re in your inventory.',
    settingSection,
    tab
  );

  addSetting(
    'Show an egg next to the shield',
    'seh-show-egg',
    true,
    'Shows a random egg next to your shield. Click it to change to a random one.',
    settingSection,
    tab
  );

  addSetting(
    'Scrambles instead of a random egg',
    'seh-scrambles',
    false,
    'Replace the random egg icon with Scrambles.',
    settingSection,
    tab
  );

  addSetting(
    'Scrambles Buddy',
    'seh-scrambles-buddy',
    false,
    'Gives you a draggable Scrambles buddy to put anywhere on the screen. <p>Double-click to spin him! Right-click to flip! Scroll to resize! Shift + double-click to randomize!',
    settingSection,
    tab
  );

  createLarryWelcomePopup();
}());
