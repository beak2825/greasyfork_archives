// ==UserScript==
// @name         TW Quests+
// @namespace    Johnny
// @author       Johnny
// @version      1.1
// @description  Detailed list of quest lines for The West Classic
// @match        https://classic.the-west.net/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31531/TW%20Quests%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/31531/TW%20Quests%2B.meta.js
// ==/UserScript==

window.QuestsPlus = {
  quests: [{
    group: 'Introduction',
    lvl: 1,
    quests: [{
      employer: 'barkeeper',
      title: 'Introduction',
      req: {txt: ['None']},
      rew: {txt: ['1 XP']},
    },{
      employer: 'barkeeper',
      title: 'Clothing',
      req: {item: [['Gray rags', 'body/mini/tatter_grey', 1]]},
      rew: {item: [['Whiskey', 'yield/whiskey', 1]]}
    },{
      employer: 'sheriff',
      title: 'Bottle exchange',
      req: {item: [['Whiskey', 'yield/whiskey', 1]]},
      rew: {item: [['Empty bottle', 'yield/empty_bottle', 1]], txt: ['$5']},
    },{
      employer: 'barkeeper',
      title: 'Pick tobacco leaves',
      req: {item: [['Tobacco', 'yield/tabacco', 1]]},
      rew: {txt: ['+3 skill points', '$10']},
    },{
      employer: 'barkeeper',
      title: 'Raise Vigor',
      req: {img: ['img.php?type=skill_box&subtype=punch:normal:normal&value=2']},
      rew: {txt: ['3 XP']},
    },{
      employer: 'barkeeper',
      title: 'Fresh sugar',
      req: {item: [['Sugar', 'yield/sugar', 1]]},
      rew: {txt: ['$5']},
    },{
      employer: 'barkeeper',
      title: 'Experience',
      req: {item: [['Cotton', 'yield/cotton', 1]]},
      rew: {txt: ['$8']},
    },{
      employer: 'barkeeper',
      title: 'Advancing levels',
      req: {txt: ['Level 2']},
      rew: {txt: ['$15']},
    },{
      employer: 'barkeeper',
      title: 'Wages',
      req: {txt: ['$40']},
      rew: {item: [['Gray cap', 'head/slouch_cap_grey', 1]]},
    },{
      employer: 'barkeeper',
      title: 'The bouncer',
      req: {txt: ['Beat The double-faced Jules (duel)']},
      rew: {txt: ['$60']},
    }]
  },{
    group: 'Manhunt',
    lvl: 2,
    quests: [{
      employer: 'sheriff',
      title: 'The search',
      req: {item: [['Poster', 'yield/poster', 2]]},
      rew: {item: [['Broken clay jug', 'right_arm/mini/clayjug', 1]]},
    },{
      employer: 'sheriff',
      title: 'The petty henchman',
      req: {txt: ['Beat Sidekick (duel)']},
      rew: {txt: ['30 XP']},
    },{
      employer: 'sheriff',
      title: 'The search (Part 2)',
      req: {item: [['Newspaper *The Western Star*', 'yield/newspaper', 3]]},
      rew: {txt: ['35 XP']},
    },{
      employer: 'sheriff',
      title: 'The mean henchman',
      req: {txt: ['Beat Henchman (duel)']},
      rew: {item: [['Handcuffs', 'yield/nippers', 1]]},
    }]
  },{
    group: 'Erik\'s Flight',
    lvl: 3,
    quests: [{
      employer: 'lady',
      title: 'Rascality',
      req: {item: [['Ham', 'yield/ham', 1]]},
      rew: {txt: ['20 XP']},
    },{
      employer: 'lady',
      title: 'Cotton',
      req: {item: [['Cotton', 'yield/cotton', 2]]},
      rew: {txt: ['25 XP']},
    },{
      employer: 'lady',
      title: 'Field work',
      req: {item: [['Grain', 'yield/cereals', 2]]},
      rew: {txt: ['30 XP']},
    },{
      employer: 'lady',
      title: 'Erik',
      req: {item: [['Poster', 'yield/poster', 3]]},
      rew: {txt: ['20 XP'], item: [['Red Poncho', 'body/mini/poncho_red', 1]]},
    }]
  },{
    group: 'Fire heart',
    lvl: 5,
    quests: [{
      employer: 'indian',
      title: 'Tobacco',
      req: {item: [['Tobacco', 'yield/tabacco', 4]]},
      rew: {txt: ['10 XP']},
    },{
      employer: 'indian',
      title: 'Raven feather',
      req: {item: [['Raven feather', 'yield/feather', 1]]},
      rew: {txt: ['15 XP']},
    },{
      employer: 'indian',
      title: 'Beans',
      req: {item: [['Beans', 'yield/beans', 3]]},
      rew: {txt: ['20 XP']},
    },{
      employer: 'indian',
      title: 'Sugar',
      req: {item: [['Sugar', 'yield/sugar', 5]]},
      rew: {txt: ['25 XP']},
    },{
      employer: 'indian',
      title: 'Turkey',
      req: {item: [['Turkey', 'yield/turkey', 1]]},
      rew: {txt: ['30 XP']},
    },{
      employer: 'indian',
      title: 'The last ingredient',
      req: {txt: ['One of your hairs']},
      rew: {txt: ['+4 Skill points towards health']},
    },{
      employer: 'indian',
      title: 'Just a dream?',
      req: {item: [['Berries', 'yield/berrys', 5]]},
      rew: {txt: ['4 days premium More Energy', '40 XP']},
    }]
  },{
    group: 'The cattle herd',
    lvl: 8,
    quests: [{
      employer: 'sheriff',
      title: 'Repair fences',
      req: {item: [['Hammer', 'yield/hammer', 1]]},
      rew: {txt: ['1 skill point towards Repairing']},
    },{
      employer: 'sheriff',
      title: 'The donkey',
      req: {item: [['Donkey', 'animal/donkey', 1]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'sheriff',
      title: 'Corn for the donkey',
      req: {item: [['Corn', 'yield/corn', 3]]},
      rew: {txt: ['20 XP']},
    },{
      employer: 'sheriff',
      title: 'The herd',
      req: {item: [['T-Bone-Steak', 'yield/beef', 2]]},
      rew: {txt: ['90 XP']},
    },{
      employer: 'sheriff',
      title: 'Branding',
      req: {item: [['Horn of a cow', 'yield/horn', 1]]},
      rew: {txt: ['$75']},
    },{
      employer: 'sheriff',
      title: 'barbed wire',
      req: {item: [['barbed wire', 'yield/fence', 2]]},
      rew: {item: [['Brown cotton shoes', 'foot/light_brown', 1]]},
    }],
  },{
    group: 'Henry\'s Birthday',
    lvl: 11,
    quests: [{
      employer: 'lady',
      title: 'Back pain',
      req: {item: [['Wool', 'yield/shearings', 3]]},
      rew: {txt: ['$50']},
    },{
      employer: 'indian',
      title: 'Moccasins',
      req: {item: [['Leather', 'yield/leather', 2]]},
      rew: {txt: ['$50']},
    },{
      employer: 'sheriff',
      title: 'Union flag',
      req: {item: [['Union flag', 'yield/flag_north', 1]]},
      rew: {txt: ['180 XP']},
    },{
      employer: 'barkeeper',
      title: 'Another gift',
      req: {txt: ['None']},
      rew: {item: [['Gray bowler hat', 'head/bowler_grey', 1]]},
    }],
  },{
    group: 'Waupee\'s Grandfather',
    lvl: 14,
    quests: [{
      employer: 'indian',
      title: 'Green smoke',
      req: {img: ['img.php?type=skill_box&subtype=tough:normal:normal&value=9']},
      rew: {txt: ['45 XP']},
    },{
      employer: 'indian',
      title: 'The golden hawk',
      req: {item: [['Leather', 'yield/leather', 3], ['Trout', 'yield/trout', 3]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'indian',
      title: 'The Thievery',
      req: {item: [['Golden Falk', 'yield/falcon', 1]]},
      rew: {txt: ['70 XP', 'Able to reuse skills and attributes']},
    },{
      employer: 'barkeeper',
      title: 'Re-Thievery',
      req: {txt: ['Beat Thief (duel)']},
      rew: {txt: ['50 XP', '$30']},
    },{
      employer: 'lady',
      title: 'Re-Thievery',
      req: {item: [['Blue bandana', 'neck/band_blue', 1]], txt: ['$170']},
      rew: {item: [['Golden Falk', 'yield/falcon', 1]]},
    }],
  },{
    group: 'Duel tactics',
    lvl: 15,
    quests: [{
      employer: 'sheriff',
      title: 'Paddy the bulldog',
      req: {txt: ['Beat Paddy (duel)']},
      rew: {txt: ['50 XP']},
    },{
      employer: 'sheriff',
      title: 'Matthew the Snake',
      req: {txt: ['Beat Matthew (duel)']},
      rew: {txt: ['4 days Dueling Premium', '30 XP']},
    }],
  },{
    group: 'Unforgiven',
    lvl: 15,
    quests: [{
      employer: 'barkeeper',
      title: 'The rowdy',
      req: {item: [['Fool\'s gold', 'yield/copper_pyrites', 1]]},
      rew: {txt: ['50 XP']},
    },{
      employer: 'barkeeper',
      title: 'The right outfit',
      req: {item: [['Black headband', 'head/band_black', 1]]},
      rew: {txt: ['40 XP']},
    },{
      employer: 'barkeeper',
      title: 'Gathering in the forest',
      req: {item: [['Wood', 'yield/planks', 1]]},
      rew: {txt: ['30 XP']},
    },{
      employer: 'barkeeper',
      title: '3 henchmen',
      req: {txt: ['Beat Henchman (duel)']},
      rew: {txt: ['60 XP']},
    },{
      employer: 'lady',
      title: '3 henchmen',
      req: {item: [['Berries', 'yield/berrys', 3]], txt: ['$200']},
      rew: {txt: ['50 XP']},
    },{
      employer: 'barkeeper',
      title: 'Gathering in the forest',
      req: {item: [['Wood', 'yield/planks', 8]]},
      rew: {txt: ['25 XP']},
    },{
      employer: 'barkeeper',
      title: 'Unforgiven',
      req: {txt: ['Beat Unforgiven (duel)']},
      rew: {item: [['Green shirt', 'body/mini/shirt_green', 1]]}
    }],
  },{
    group: 'Optimization of profits ',
    lvl: 18,
    quests: [{
      employer: 'lady',
      title: 'Starvation wages',
      req: {item: [['Newspaper *The Western Star*', 'yield/newspaper', 1]]},
      rew: {txt: ['20 XP', '3 days premium Higher income']},
    },{
      employer: 'lady',
      title: 'Easy money',
      req: {item: [['Newspaper *The Western Star*', 'yield/newspaper', 3]]},
      rew: {txt: ['60 XP']},
    }]
  },{
    group: 'Well organized',
    lvl: 18,
    quests: [{
      employer: 'barkeeper',
      title: 'Juicy steaks',
      req: {item: [['T-Bone-Steak', 'yield/beef', 5]]},
      rew: {txt: ['50 XP', '7 days premium Automation']},
    },{
      employer: 'barkeeper',
      title: 'Trimmings',
      req: {item: [['Grain', 'yield/cereals', 3], ['Beans', 'yield/beans', 3], ['Corn', 'yield/corn', 3], ['Glass of water', 'yield/water', 3]]},
      rew: {txt: ['200 XP']},
    }],
  },{
    group: 'Gemstones',
    lvl: 20,
    quests: [{
      employer: 'lady',
      title: 'Precious rocks on chains',
      req: {item: [['Blue Indian necklace', 'neck/indian_chain_blue', 1], ['Green Indian necklace', 'neck/indian_chain_green', 1]]},
      rew: {txt: ['20 XP']},
    },{
      employer: 'lady',
      title: 'Precious rocks from the water',
      req: {item: [['Gemstones', 'yield/gems', 2]]},
      rew: {txt: ['25 XP']},
    },{
      employer: 'lady',
      title: 'Precious rocks from the ground',
      req: {txt: ['Beat Cemetery watchman  (duel)']},
      rew: {txt: ['30 XP']},
    },{
      employer: 'lady',
      title: 'Precious rocks from the grave',
      req: {item: [['Spade', 'yield/spade', 1]]},
      rew: {item: [['Metal cross', 'neck/cross_bronze', 1]], txt: ['35 XP']},
    }],
  },{
    group: 'Bob',
    lvl: 23,
    quests: [{
      employer: 'barkeeper',
      title: 'Hard work',
      req: {item: [['Glass of water', 'yield/water', 1]]},
      rew: {txt: ['$50']},
    },{
      employer: 'barkeeper',
      title: 'Wood supply',
      req: {item: [['Wood', 'yield/planks', 10]]},
      rew: {txt: ['$350']},
    },{
      employer: 'barkeeper',
      title: 'Disassembly',
      req: {txt: ['Beat Indian (duel)']},
      rew: {txt: ['60 XP']},
    },{
      employer: 'barkeeper',
      title: 'Granite mining',
      req: {item: [['Granite blocks', 'yield/stone', 5]]},
      rew: {txt: ['$300']},
    },{
      employer: 'barkeeper',
      title: 'Bridge construction',
      req: {item: [['Sledge hammer', 'yield/sledgehammer', 1]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'barkeeper',
      title: 'The railroad station',
      req: {item: [['Train ticket', 'yield/ticket', 1]]},
      rew: {item: [['Gray work shoes', 'foot/working_grey', 1]]},
    }],
  },{
    group: 'The decision',
    lvl: 25,
    quests: [{
      employer: 'sheriff',
      title: 'Breaking in horses',
      req: {item: [['Horseshoe', 'yield/horseshoe', 4]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'sheriff',
      title: 'Break a leg!',
      req: {item: [['Coal', 'yield/coal', 5]]},
      rew: {txt: ['80 XP']},
    },{
      employer: 'sheriff',
      title: 'fat loot',
      req: {item: [['Beaver skin', 'yield/beaver', 5]]},
      rew: {txt: ['$500']},
    },{
      employer: 'indian',
      title: 'Sabotage',
      req: {item: [['Beaver trap', 'yield/trap', 5]]},
      rew: {txt: ['100 XP'], item: [['Calumet', 'yield/pipe', 1]]},
    }],
  },{
    group: 'Clothes make the man',
    lvl: 27,
    quests: [{
        employer: 'lady',
        title: 'Roll of cloth',
        req: {item: [['Roll of cloth', 'yield/fabric', 1]]},
        rew: {txt: ['$22']},
    },{
      employer: 'lady',
      title: 'Buttons',
      req: {item: [['Horn of a cow', 'yield/horn', 1]]},
      rew: {txt: ['$78']},
    },{
      employer: 'lady',
      title: 'Brooch',
      req: {item: [['Roll with wire', 'yield/string', 1]]},
      rew: {txt: ['2 skill points towards Fine motor skills']},
    },{
      employer: 'lady',
      title: 'Stage fright',
      req: {item: [['Glass of water', 'yield/water', 1]]},
      rew: {txt: ['40 XP']},
    },{
      employer: 'barkeeper',
      title: 'Beer',
      req: {txt: ['$20']},
      rew: {item: [['Beer', 'yield/beer', 1], ['Beer', 'yield/beer', 1]]},
    },{
      employer: 'lady',
      title: 'Good deal',
      req: {item: [['Beer', 'yield/beer', 2]]},
      rew: {item: [['Yellow checkered shirt', 'body/mini/plaid_shirt_yellow', 1]]},
    }],
  },{
    group: 'Wild horses',
    lvl: 30,
    quests: [{
      employer: 'sheriff',
      title: 'John is hungry',
      req: {item: [['Warm meal', 'yield/meal', 2]]},
      rew: {txt: ['$20']},
    },{
      employer: 'sheriff',
      title: 'A lot of wood',
      req: {item: [['Wood', 'yield/planks', 24]]},
      rew: {txt: ['$300']},
    },{
      employer: 'sheriff',
      title: 'Catching horses',
      req: {item: [['Lasso', 'yield/rope', 5]]},
      rew: {txt: ['140 XP', '$150']},
    },{
      employer: 'sheriff',
      title: 'Horse thief',
      req: {txt: ['Beat Horse Thief (duel)']},
      rew: {item: [['Mustang', 'animal/mustang', 1]]},
    }],
  },{
    group: 'The hunt',
    lvl: 33,
    quests: [{
      employer: 'indian',
      title: 'Turkey hunt',
      req: {item: [['Turkey', 'yield/turkey', 2]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'indian',
      title: 'Catching salmon',
      req: {item: [['Salmon', 'yield/grund', 3]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'indian',
      title: 'Coyote hunt',
      req: {item: [['Coyote tooth', 'yield/coyote', 1]]},
      rew: {txt: ['60 XP']},
    },{
      employer: 'indian',
      title: 'Buffalo hunt',
      req: {item: [['Buffalo skin', 'yield/buffalo', 1]]},
      rew: {txt: ['120 XP'], item: [['Gold Indian necklace', 'neck/indian_chain_fine', 1]]},
    }],
  },{
    group: 'The Dalton clan',
    lvl: 36,
    quests: [{
      employer: 'sheriff',
      title: 'Tool box',
      req: {item: [['Tool box', 'yield/toolbox', 1]]},
      rew: {txt: ['80 XP']},
    },{
      employer: 'sheriff',
      title: 'Dynamite',
      req: {item: [['Dynamite', 'yield/dynamite', 2]]},
      rew: {txt: ['120 XP']},
    },{
      employer: 'sheriff',
      title: 'Ambush at the bridge',
      req: {item: [['Train ticket', 'yield/ticket', 1]]},
      rew: {txt: ['150 XP']},
    },{
      employer: 'sheriff',
      title: 'Lots of coffins',
      req: {item: [['Planer', 'yield/slicer', 2]]},
      rew: {txt: ['$500']},
    }],
  },{
    group: 'Three Rivers',
    lvl: 39,
    quests: [{
      employer: 'indian',
      title: 'poacher',
      req: {txt: ['Beat poacher (duel)']},
      rew: {txt: ['70 XP']},
    },{
      employer: 'indian',
      title: 'Beaver traps',
      req: {item: [['Beaver trap', 'yield/trap', 2]]},
      rew: {txt: ['90 XP']},
    },{
      employer: 'indian',
      title: 'Gold search',
      req: {item: [['Map', 'yield/map', 1]]},
      rew: {txt: ['110 XP']},
    },{
      employer: 'indian',
      title: 'Gold Mining',
      req: {item: [['Fool\'s gold', 'yield/copper_pyrites', 15]]},
      rew: {txt: ['150 XP']},
    },{
      employer: 'indian',
      title: 'Decision 1:  Gold trade',
      req: {item: [['Roll of cloth', 'yield/fabric', 3]]},
      rew: {txt: ['$800']},
    },{
      employer: 'lady',
      title: 'Decision 2:  Offer',
      req: {txt: ['None']},
      rew: {txt: ['$1400']},
    },{
      employer: 'lady',
      title: 'Decision 2:  Commercialization',
      req: {item: [['Flag', 'yield/flag', 5]]},
      rew: {txt: ['$700']},
    }],
  },{
    group: 'Henry Walker\'s Special',
    lvl: 42,
    quests: [{
      employer: 'barkeeper',
      title: 'Flavor diversity',
      req: {item: [['Berries', 'yield/berrys', 5], ['Glass of water', 'yield/water', 4], ['Sugar', 'yield/sugar', 3]]},
      rew: {txt: ['200 XP']},
    },{
      employer: 'barkeeper',
      title: 'The salt in the soup',
      req: {item: [['Cigars', 'yield/cigar', 1]]},
      rew: {txt: ['100 XP']},
    },{
      employer: 'barkeeper',
      title: 'Filtering booze',
      req: {item: [['Coal', 'yield/coal', 1]]},
      rew: {txt: ['+3 skill points towards Toughness', '$200']},
    }],
  },{
    group: 'Transporting prisoners',
    lvl: 45,
    quests: [{
      employer: 'sheriff',
      title: 'Handcuffs',
      req: {item: [['Handcuffs', 'yield/nippers', 1]]},
      rew: {txt: ['50 XP']},
    },{
      employer: 'sheriff',
      title: 'Coachman with strange habits',
      req: {item: [['Brown cotton shoes', 'foot/light_brown', 1]]},
      rew: {txt: ['$200']},
    },{
      employer: 'sheriff',
      title: 'Speech is silver',
      req: {item: [['Silver', 'yield/silver', 3]]},
      rew: {txt: ['150 XP']},
    },{
      employer: 'lady',
      title: 'Decision 1:  Eavesdropping',
      req: {item: [['Roll with wire', 'yield/string', 5]]},
      rew: {txt: ['$500']},
    },{
      employer: 'lady',
      title: 'Decision 1:   Blackmail',
      req: {txt: ['$1000']},
      rew: {txt: ['$3000']},
    },{
      employer: 'sheriff',
      title: 'Decision 2:  Rescue mission',
      req: {txt: ['Beat Prison guard (duel)']},
      rew: {txt: ['500 XP']},
    }],
  },{
    group: 'Kate\'s wedding band',
    lvl: 46,
    quests: [{
      employer: 'sheriff',
      title: 'The unknown thief.',
      req: {item: [['Kate\'s ring', 'yield/kates_ring', 1]]},
      rew: {txt: ['800 XP']},
    },{
      employer: 'sheriff',
      title: 'The thief',
      req: {txt: ['Beat Thief (duel)']},
      rew: {txt: ['$1200', '600 XP']},
    },{
      employer: 'sheriff',
      title: 'Silver mining',
      req: {item: [['Silver', 'yield/silver', 5]]},
      rew: {txt: ['300 XP']},
    },{
      employer: 'sheriff',
      title: 'The dealer',
      req: {txt: ['Beat Dealer (duel)']},
      rew: {item: [['Kate\'s ring', 'yield/kates_ring', 1]], txt: ['$1500']},
    }]
  },{
    group: 'John moves out',
    lvl: 49,
    quests: [{
      employer: 'sheriff',
      title: 'Hotel Mama',
      req: {item: [['Granite blocks', 'yield/stone', 4]]},
      rew: {txt: ['200 XP'], item: [['Corn', 'yield/corn', 1]]},
    },{
      employer: 'sheriff',
      title: 'There is much to do',
      req: {item: [['Saw', 'yield/saw', 1]]},
      rew: {txt: ['100 XP'], item: [['Corn', 'yield/corn', 1]]},
    },{
      employer: 'sheriff',
      title: 'Online',
      req: {item: [['Roll with wire', 'yield/string', 1]]},
      rew: {txt: ['150 XP'], item: [['Berries', 'yield/berrys', 1]]},
    },{
      employer: 'sheriff',
      title: 'The way to a man\'s heart is through his stomach.',
      req: {item: [['Jug', 'yield/pitcher', 1]]},
      rew: {txt: ['100 XP'], item: [['Warm meal', 'yield/meal', 1], ['Turkey', 'yield/turkey', 1]]},
    },{
      employer: 'sheriff',
      title: 'Progress',
      req: {item: [['Tool box', 'yield/toolbox', 1]]},
      rew: {item: [['Machete', 'right_arm/mini/machete', 1], ['Pepperbox revolver', 'right_arm/mini/pepperbox', 1]]},
    },{
      employer: 'sheriff',
      title: 'A note',
      req: {txt: ['Beat Burglar (duel)']},
      rew: {item: [['Piece of a note (Part 2)', 'yield/paper2', 1]]},
    }]
  }],

  windowName: 'QuestsPlus',

  init: function() {
    QuestsPlus.addCss();
    QuestsPlus.addMenuButton();
  },

  addCss: function() {
    let css = '\
      #menu_quests_plus a { background: url("data:image/png;base64,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"); cursor: pointer; } \
      #window_' + QuestsPlus.windowName + '_content { overflow-y: auto; } \
      #window_' + QuestsPlus.windowName + '_content .questlog_header { cursor: pointer; position: relative; width: 669px; line-height: 21px; padding: 4px 6px; } \
      #window_' + QuestsPlus.windowName + '_content .questlog_header span { font-weight: normal; padding-left: 10px; } \
      #window_' + QuestsPlus.windowName + '_content .questlog_header img { position: absolute; top: 2px; right: 3px; padding: 0; } \
      #window_' + QuestsPlus.windowName + '_content table { display: none; border-spacing: 0; border-collapse: collapse; width: 683px; border-right: 1px solid #666; } \
      #window_' + QuestsPlus.windowName + '_content td, #window_' + QuestsPlus.windowName + '_content th { padding: 4px 6px; background-image: url(../images/border/table/bright.png); border-bottom: 1px solid #666; border-left: 1px solid #666; line-height: 20px; vertical-align: middle; text-align: center; } \
      #window_' + QuestsPlus.windowName + '_content td:nth-of-type(2) { text-align: left; } \
      #window_' + QuestsPlus.windowName + '_content th { background-image: url(../images/border/table/dark.png); } \
      #window_' + QuestsPlus.windowName + '_content .bag_item { display: inline-block; margin: 0 auto; float: none; width: 47px; height: 47px; background-size: cover; position: relative; } \
      #window_' + QuestsPlus.windowName + '_content .bag_item img { width: 47px; height: 47px; } \
      #window_' + QuestsPlus.windowName + '_content .bag_item .count { background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAATCAMAAAC0hZ1zAAAAwFBMVEUAAACvr69wcHBeXl6Li4tSUlJmZmZfX1+Dg4N7e3t1dXViYmI5OTlJSUlCQkKHh4d9fX0nJydUVFSOjo59fX18fHxGRkY2NjaOjo5wcHBnZ2dVVVWysrKTk5Nqampvb29tbW06OjpnZ2dzc3M2NjY9PT16enp3d3eEhIR9fX0vLy9cXFxxcXFlZWUzMzMyMjJRUVFNTU1GRkYZGRmBgYFVVVUrKysnJycjIyNiYmJYWFhJSUlCQkIfHx+enp6Ojo5EkFSAAAAAHnRSTlMABgbRz87Ny25uG/n49PTz8/PQx8fHx8dubm5tGxtpsIjwAAABPUlEQVQoz1WRh27DMAxEmWane29RlqzYimzHMzvt//9VTzaKpk8UAfLAowARUe/l/nrH9TxirbWdR5G19ubx7YzA5yDOTRjghFmIjBsE+1SOZ5gbbDfVegkWHuRsuYRe5MMzmurNsUyVUAghWCIj0rzIy3d6KKsySrCNOZHQpGRWMmHnyifS4UowC4ERSIK7QEflF6SyAJXwph0SJWrJLvNi24GbBCzbKbhrt/Cib7TOoDVJJYy1W5EKA8EKnuh3OvoC6MaLhv/AKICsdeIOrdi+BtEBGyyReutIGdPu+Qcs2DZrOi8Ozove89cUpZrX5pbGTbETSbewA76s42+xeaZJ3qQczUHkX5HoCIWNv+JF9Uq9/r5IbRzXEHFqCwWkq6qPH/0YhVkATHDCujrezQj0JqNLA040czWcYu4HGJBFQzh8ViwAAAAASUVORK5CYII="); width: 28px; height: 19px; position: absolute; bottom: -5px; left: -6px; color: #fff; font-weight: bold; } \
    ';
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  },

  addMenuButton: function() {
    let button = document.createElement('li');
    button.id = 'menu_quests_plus';
    let buttonLink = document.createElement('a');
    buttonLink.onclick = QuestsPlus.openWindow;
    buttonLink.innerHTML = '<span>Quests+</span>';
    button.appendChild(buttonLink);
    let saloonMenu = document.getElementById('menu_saloon');
    saloonMenu.parentNode.insertBefore(button, saloonMenu.nextSibling);
  },

  openWindow: function() {
    if (!AjaxWindow.windows[QuestsPlus.windowName]) {
      let win = new Element('div', {
        'id': 'window_' + QuestsPlus.windowName,
        'class': 'window'
      });

      AjaxWindow.windows[QuestsPlus.windowName] = win;

      let html = '\
        <div class="window_borders"> \
        <h2 id="window_' + QuestsPlus.windowName + '_title" class="window_title"><span>Quests+</span></h2> \
        <a href="javascript:AjaxWindow.closeAll();" class="window_closeall"></a><a href="javascript:AjaxWindow.toggleSize(\'' + QuestsPlus.windowName + '\');" class="window_minimize"></a><a href="javascript:AjaxWindow.close(\'' + QuestsPlus.windowName + '\');" class="window_close"></a> \
        <div id="window_' + QuestsPlus.windowName + '_content" class="window_content"></div> \
        </div> \
      ';
      win.setHTML(html);
      win.bringToTop();
      win.injectInside('windows');
      win.centerLeft();

      let win_title = $('window_' + QuestsPlus.windowName + '_title');
      win_title.addEvent('dblclick', function () {
        win.centerLeft();
        win.setStyle('top', 133);
      });
      win.makeDraggable({
        handle: win_title,
        onStart: function () {
        },
        onComplete: function () {
        }.bind(AjaxWindow)
      });
      win.addEvent('mousedown', win.bringToTop.bind(win, []));
      win_title.addEvent('mousedown', win.bringToTop.bind(win, []));

      let win_content = $('window_' + QuestsPlus.windowName + '_content');
      QuestsPlus.clear(win_content);
      win_content.appendChild(QuestsPlus.getQuests());
    } else {
      AjaxWindow.maximize(QuestsPlus.windowName);
      AjaxWindow.windows[QuestsPlus.windowName].bringToTop();
    }
  },

  getQuests: function() {
    let div = document.createElement('div');

    for (let group of QuestsPlus.quests) {
      let wrap = document.createElement('div');
      wrap.className = 'wrap';

      let header = document.createElement('div');
      header.className = 'questlog_header';
      header.innerHTML = group.group + ' - Level ' + group.lvl + ' <span>(Quests: ' + group.quests.length + ')</span> <img class="toggle" src="https://classic.the-west.net/img.php?type=button&subtype=normal&value=plus">';
      header.addEventListener('click', function() {
        let plus = 'https://classic.the-west.net/img.php?type=button&subtype=normal&value=plus';
        let minus = 'https://classic.the-west.net/img.php?type=button&subtype=normal&value=minus';
        let toggle = this.querySelector('.toggle');
        toggle.src = (toggle.src === plus ? minus : plus);

        let table = this.parentNode.querySelector('table');
        table.style.display = (table.style.display === 'table' ? 'none' : 'table');
      }, false);
      wrap.appendChild(header);

      let th = document.createElement('tr');
      th.innerHTML = '\
        <th style="width:60px">Employer</th> \
        <th>Title</th> \
        <th style="width:200px">Requirement</th> \
        <th style="width:200px">Reward</th> \
      ';

      let table = document.createElement('table');
      table.appendChild(th);
      for (let quest of group.quests) {
        let tr = document.createElement('tr');

        let tdEmployer = document.createElement('td');
        tdEmployer.innerHTML = '<img src="images/quest/employer/' + quest.employer + '.png" width="50" height="50">';
        tr.appendChild(tdEmployer);

        let tdTitle = document.createElement('td');
        tdTitle.textContent = quest.title;
        tr.appendChild(tdTitle);

        let tdReq = document.createElement('td');
        tdReq.appendChild(QuestsPlus.format(quest.req));
        tr.appendChild(tdReq);

        let tdRew = document.createElement('td');
        tdRew.appendChild(QuestsPlus.format(quest.rew));
        tr.appendChild(tdRew);

        table.appendChild(tr);
      }
      wrap.appendChild(table);

      div.appendChild(wrap);
    }

    return div;
  },

  format: function(data) {
    let div = document.createElement('div');

    if (data.txt) {
      for (let txt of data.txt) {
        let el = document.createElement('div');
        el.textContent = txt;
        div.appendChild(el);
      }
    }

    if (data.img) {
      for (let img of data.img) {
        let el = document.createElement('img');
        el.src = img;
        div.appendChild(el);
      }
    }

    if (data.item) {
      for (let item of data.item) {
        let item_div = document.createElement('div');
        item_div.className = 'bag_item';
        let item_img = document.createElement('img');
        item_img.src = 'images/items/' + item[1] + '.png';
        item_div.appendChild(item_img);
        item_div.addMousePopup(new MousePopup(item[0], 250, {opacity: 0.9}));

        if (item[2] > 1) {
          let count_div = document.createElement('div');
          count_div.className = 'count';
          count_div.textContent = item[2];
          item_div.appendChild(count_div);
        }

        div.appendChild(item_div);
      }
    }

    return div;
  },

  clear: function(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  },
};

QuestsPlus.init();