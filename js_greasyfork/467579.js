// ==UserScript==
// @name        MouseHunt Minlucks
// @description Minlucks and power for MouseHunt, from Google Sheets, to power the multiple mini-CRE scripts.
// @version     2024.1.7
// @license     MIT
// @author      brap
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/cheese.png
// @run-at      document-end
// @grant       none
// ==/UserScript==

window.minlucks = {
  "Abominable Snow": {
    "power": 1900,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Absolute Acolyte": {
    "power": 59400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2750
    ]
  },
  "Acolyte": {
    "power": 18000,
    "effs": [
      25,
      0,
      175,
      0,
      0,
      0,
      25,
      0,
      0,
      0
    ]
  },
  "Admiral Arrrgh": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Admiral Cloudbeard": {
    "power": 81690,
    "effs": [
      500,
      500,
      500,
      500,
      0,
      500,
      500,
      500,
      500,
      0
    ]
  },
  "Aether": {
    "power": 9800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      275,
      0,
      0
    ]
  },
  "Aged": {
    "power": 9000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Agent M": {
    "power": 38885,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300,
      0
    ]
  },
  "Agitated Gentle Giant": {
    "power": 1000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Alchemist": {
    "power": 1930,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Alnilam": {
    "power": 5500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Alnitak": {
    "power": 6150,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Alpha Weremouse": {
    "power": 6825,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Amplified Brown": {
    "power": 750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Amplified Grey": {
    "power": 750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Amplified White": {
    "power": 750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Ancient of the Deep": {
    "power": 37999,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ancient Scribe": {
    "power": 16700,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Angelfish": {
    "power": 4960,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Angler": {
    "power": 8709,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Angry Aphid": {
    "power": 10000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Angry Train Staff": {
    "power": 3499,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Aquos": {
    "power": 4600,
    "effs": [
      100,
      100,
      100,
      100,
      25,
      75,
      400,
      75,
      0,
      0
    ]
  },
  "Arcane Summoner": {
    "power": 7150,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Arch Champion Necromancer": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Archer": {
    "power": 1500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Architeuthulhu of the Abyss": {
    "power": 100000,
    "effs": [
      0,
      0,
      0,
      400,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Aristo-Cat Burglar": {
    "power": 14590,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      600,
      0
    ]
  },
  "Armored Archer": {
    "power": 2590,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Artillery Commander": {
    "power": 21065,
    "effs": [
      100,
      0,
      0,
      50,
      0,
      50,
      0,
      50,
      0,
      0
    ]
  },
  "Ascended Elder": {
    "power": 375015,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      350
    ]
  },
  "Ash Golem": {
    "power": 13601,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Assassin": {
    "power": 13175,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Assassin Beast": {
    "power": 14999,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Astrological Astronomer": {
    "power": 11825,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Automated Sentry": {
    "power": 950,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Automated Stone Sentry": {
    "power": 20250,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Automorat": {
    "power": 3751,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Baba Gaga": {
    "power": 3750,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Balack the Banished": {
    "power": 62000,
    "effs": [
      50,
      0,
      200,
      0,
      0,
      0,
      25,
      0,
      0,
      0
    ]
  },
  "Bandit": {
    "power": 100,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      200,
      25,
      100,
      100,
      0
    ]
  },
  "Bark": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Barkshell": {
    "power": 8000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Barmy Gunner": {
    "power": 275,
    "effs": [
      100,
      100,
      100,
      175,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Barnacle Beautician": {
    "power": 5400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Baroness Von Bean": {
    "power": 31000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Baroque Dancer": {
    "power": 33000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Barracuda": {
    "power": 8600,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Bartender": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Bat": {
    "power": 515,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      100,
      200,
      25,
      0,
      0
    ]
  },
  "Battering Ram": {
    "power": 60000,
    "effs": [
      25,
      0,
      0,
      0,
      0,
      0,
      25,
      0,
      0,
      0
    ]
  },
  "Battle Cleric": {
    "power": 10851,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Beachcomber": {
    "power": 8000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Bear": {
    "power": 700,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Bearded Elder": {
    "power": 7825,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Beast Tamer": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Berserker": {
    "power": 600,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Berzerker": {
    "power": 8250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175
    ]
  },
  "Betta": {
    "power": 4960,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Big Bad Behemoth Burroughs": {
    "power": 35002,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Big Bad Burroughs": {
    "power": 51151,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Bilged Boatswain": {
    "power": 250,
    "effs": [
      100,
      100,
      100,
      175,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Biohazard": {
    "power": 12999,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Bionic": {
    "power": 220,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Birthday": {
    "power": 765,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Bitter Grammarian": {
    "power": 90000,
    "effs": [
      0,
      0,
      400,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Bitter Root": {
    "power": 6825,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Black Diamond Racer": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Black Mage": {
    "power": 1550,
    "effs": [
      100,
      100,
      100,
      100,
      25,
      75,
      400,
      75,
      0,
      0
    ]
  },
  "Black Powder Thief": {
    "power": 4999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Black Widow": {
    "power": 4010,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Blacksmith": {
    "power": 27899,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Bloomed Sylvan": {
    "power": 1750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Bog Beast": {
    "power": 4200,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Bonbon Gummy Globlin": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Bookborn": {
    "power": 6100,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      200,
      0,
      0
    ]
  },
  "Borean Commander": {
    "power": 2400,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Bottled": {
    "power": 3600,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Bottom Feeder": {
    "power": 3930,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Boulder Biter": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Bounty Hunter": {
    "power": 2100,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Brawny": {
    "power": 882,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Breakdancer": {
    "power": 750,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Breeze Borrower": {
    "power": 3500,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Briegull": {
    "power": 635,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Brimstone": {
    "power": 3200,
    "effs": [
      150,
      0,
      125,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Brothers Grimmaus": {
    "power": 9000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Brown": {
    "power": 3,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Bruticle": {
    "power": 16800,
    "effs": [
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Bruticus, the Blazing": {
    "power": 49100,
    "effs": [
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Buccaneer": {
    "power": 4544,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Buckethead": {
    "power": 500,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Budrich Thornborn": {
    "power": 12000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Builder": {
    "power": 559,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Bulwark of Ascent": {
    "power": 818250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      7500
    ]
  },
  "Burglar": {
    "power": 2100,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      125,
      100
    ]
  },
  "Burly Bruiser": {
    "power": 6300,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cabin Boy": {
    "power": 100,
    "effs": [
      100,
      100,
      100,
      175,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Cagey Countess": {
    "power": 29000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Calalilly": {
    "power": 6000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Calligraphy": {
    "power": 888,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Camoflower": {
    "power": 9000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Camofusion": {
    "power": 14500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Candy Cane": {
    "power": 172,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Candy Cat": {
    "power": 1250,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Candy Goblin": {
    "power": 1750,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Cannonball": {
    "power": 3499,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Captain": {
    "power": 6885,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Captain Cannonball": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Captain Cloudkicker": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      0
    ]
  },
  "Captain Croissant": {
    "power": 500,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Caravan Guard": {
    "power": 9000,
    "effs": [
      0,
      0,
      0,
      50,
      0,
      50,
      0,
      50,
      0,
      0
    ]
  },
  "Cardshark": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Carefree Cook": {
    "power": 2200,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Careless Catfish": {
    "power": 10000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Caretaker": {
    "power": 1600,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Carmine the Apothecary": {
    "power": 9998,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Carnivore": {
    "power": 15099,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Carrion Medium": {
    "power": 8000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300
    ]
  },
  "Cavalier": {
    "power": 1270,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Cavern Crumbler": {
    "power": 3630,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cell Sweeper": {
    "power": 16200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Centaur": {
    "power": 5690,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Centaur Ranger": {
    "power": 7500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Chafed Cellist": {
    "power": 30520,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Chamber Cleaver": {
    "power": 1400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Chameleon": {
    "power": 635,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Champion": {
    "power": 12000,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Champion Danseuse": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Champion Thief": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Charming Chimer": {
    "power": 5100,
    "effs": [
      150,
      50,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Cheesy Party": {
    "power": 1010,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Cherry": {
    "power": 1500,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Cherry Sprite": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Chess Master": {
    "power": 55000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2500,
      0,
      0
    ]
  },
  "Chip Chiseler": {
    "power": 1260,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Chipper": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Chitinous": {
    "power": 14000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Chocolate Gold Foil": {
    "power": 2650,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Chocolate Overload": {
    "power": 200,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Christmas Tree": {
    "power": 847,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Chrono": {
    "power": 25450,
    "effs": [
      25,
      0,
      175,
      0,
      0,
      0,
      25,
      0,
      0,
      0
    ]
  },
  "Chronomaster": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300
    ]
  },
  "Cinderstorm": {
    "power": 9410,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Circuit Judge": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "City Noble": {
    "power": 3810,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "City Worker": {
    "power": 4240,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Clockwork Samurai": {
    "power": 50,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      100,
      25,
      100,
      0,
      0
    ]
  },
  "Clockwork Timespinner": {
    "power": 2300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Cloud Collector": {
    "power": 2400,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Cloud Miner": {
    "power": 41950,
    "effs": [
      500,
      500,
      500,
      500,
      0,
      500,
      500,
      500,
      500,
      0
    ]
  },
  "Cloud Strider": {
    "power": 33400,
    "effs": [
      0,
      0,
      0,
      600,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Clownfish": {
    "power": 5110,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Clump": {
    "power": 1300,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Clumsy Carrier": {
    "power": 6559,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Clumsy Chemist": {
    "power": 233,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Clumsy Cupbearer": {
    "power": 28000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Coal Shoveller": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Cobweb": {
    "power": 1100,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Coco Commander": {
    "power": 2000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Coffin Zombie": {
    "power": 1135,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Confused Courier": {
    "power": 2064,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Conjurer": {
    "power": 6000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Conqueror": {
    "power": 6600,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Consumed Charm Tinkerer": {
    "power": 18435,
    "effs": [
      300,
      300,
      300,
      300,
      0,
      300,
      300,
      300,
      300,
      0
    ]
  },
  "Cook": {
    "power": 2650,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Coral": {
    "power": 5400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Coral Cuddler": {
    "power": 3930,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Coral Dragon": {
    "power": 7500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Coral Gardener": {
    "power": 6741,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Coral Guard": {
    "power": 8709,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Coral Harvester": {
    "power": 6380,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Coral Queen": {
    "power": 11150,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Core Sample": {
    "power": 1000,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Cork Defender": {
    "power": 4550,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Corkataur": {
    "power": 15525,
    "effs": [
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Corky, the Collector": {
    "power": 2595,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Corridor Bruiser": {
    "power": 17150,
    "effs": [
      100,
      0,
      125,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Corrupt": {
    "power": 6351,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Corrupt Commodore": {
    "power": 300,
    "effs": [
      100,
      100,
      100,
      175,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Costumed Dog": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Dragon": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Horse": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Monkey": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Ox": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Pig": {
    "power": 1300,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Rabbit": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Rat": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Rooster": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Sheep": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Snake": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Costumed Tiger": {
    "power": 1200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Count Vampire": {
    "power": 1000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Covetous Coastguard": {
    "power": 7000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cowardly": {
    "power": 4,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Cowbell": {
    "power": 570,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Crabolia": {
    "power": 4900,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crag Elder": {
    "power": 4100,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Craggy Ore": {
    "power": 600,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Cranky Caterpillar": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Crate Camo": {
    "power": 3751,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Crazed Cultivator": {
    "power": 7000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Crazed Goblin": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Creepy Marionette": {
    "power": 4000,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Crimson Commander": {
    "power": 9299,
    "effs": [
      125,
      125,
      0,
      125,
      0,
      125,
      0,
      125,
      0,
      0
    ]
  },
  "Crimson Ranger": {
    "power": 5999,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Crimson Titan": {
    "power": 6799,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Crimson Watch": {
    "power": 5600,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Croquet Crusher": {
    "power": 2945,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Crown Collector": {
    "power": 2647,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Crystal Behemoth": {
    "power": 94170,
    "effs": [
      0,
      0,
      2150,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystal Cave Worm": {
    "power": 12526,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystal Controller": {
    "power": 10550,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystal Golem": {
    "power": 17399,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystal Lurker": {
    "power": 24100,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystal Observer": {
    "power": 28400,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystal Queen": {
    "power": 20500,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystalback": {
    "power": 10925,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Crystalline Slasher": {
    "power": 6575,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cumulost": {
    "power": 19100,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cupcake Camo": {
    "power": 900,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Cupcake Candle Thief": {
    "power": 290,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Cupcake Cutie": {
    "power": 950,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Cupcake Runner": {
    "power": 600,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Cupid": {
    "power": 680,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Curious Chemist": {
    "power": 800,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Cursed": {
    "power": 4225,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cursed Crusader": {
    "power": 21500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      600
    ]
  },
  "Cursed Enchanter": {
    "power": 3500,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cursed Engineer": {
    "power": 6499,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cursed Librarian": {
    "power": 12499,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cursed Taskmaster": {
    "power": 12025,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Cursed Thief": {
    "power": 8502,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cute Cloud Conjurer": {
    "power": 23400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cute Crate Carrier": {
    "power": 3499,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Cutpurse": {
    "power": 6650,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Cutthroat Cannoneer": {
    "power": 32604,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Cutthroat Pirate": {
    "power": 24375,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Cuttle": {
    "power": 3990,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Cyber Miner": {
    "power": 1350,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Cybernetic Specialist": {
    "power": 880,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Cyborg": {
    "power": 1340,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Cycloness": {
    "power": 10800,
    "effs": [
      150,
      50,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Cyclops": {
    "power": 1600,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Cyclops Barbarian": {
    "power": 7500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Dance Party": {
    "power": 500,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Dancer": {
    "power": 1280,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Dancing Assassin": {
    "power": 93000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500
    ]
  },
  "Dangerous Duo": {
    "power": 4999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Dark Magi": {
    "power": 40001,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dark Templar": {
    "power": 28901,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dashing Buccaneer": {
    "power": 225,
    "effs": [
      100,
      100,
      100,
      175,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Dastardly Duchess": {
    "power": 34550,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Davy Jones": {
    "power": 2000,
    "effs": [
      150,
      0,
      125,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Dawn Guardian": {
    "power": 72000,
    "effs": [
      1000,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Daydreamer": {
    "power": 12565,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Decrepit Tentacle Terror": {
    "power": 24251,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      300,
      0,
      0,
      0
    ]
  },
  "Deep": {
    "power": 94990,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Deep Sea Diver": {
    "power": 7500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Defender": {
    "power": 8400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Dehydrated": {
    "power": 2000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Demolitions": {
    "power": 2300,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Deranged Deckhand": {
    "power": 11150,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Derpicorn": {
    "power": 998,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      125,
      0,
      0
    ]
  },
  "Derpshark": {
    "power": 11302,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Derr Chieftain": {
    "power": 20400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Derr Lich": {
    "power": 8400,
    "effs": [
      150,
      0,
      200,
      0,
      0,
      0,
      125,
      0,
      0,
      0
    ]
  },
  "Desert Archer": {
    "power": 4398,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Desert Architect": {
    "power": 11151,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Desert Nomad": {
    "power": 17201,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Desert Soldier": {
    "power": 4900,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Desperado": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Destructoy": {
    "power": 1506,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Devious Gentleman": {
    "power": 5520,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Diamond": {
    "power": 400,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Diamondhide": {
    "power": 48748,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Diminutive Detainee": {
    "power": 20000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Dinosuit": {
    "power": 900,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Dire Lycan": {
    "power": 1240,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Dirt Thing": {
    "power": 5925,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dojo Sensei": {
    "power": 45000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Doktor": {
    "power": 1150,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Double Black Diamond Racer": {
    "power": 2400,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Draconic Warden": {
    "power": 13194,
    "effs": [
      0,
      100,
      0,
      75,
      0,
      75,
      0,
      75,
      0,
      0
    ]
  },
  "Dragon": {
    "power": 74800,
    "effs": [
      0,
      900,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dragonbreather": {
    "power": 17790,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dragoon": {
    "power": 48000,
    "effs": [
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dread Knight": {
    "power": 2450,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Dread Pirate Mousert": {
    "power": 6380,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Dream Drifter": {
    "power": 947,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Drudge": {
    "power": 7900,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Drummer": {
    "power": 1000,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Dumpling Chef": {
    "power": 2000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Dumpling Delivery": {
    "power": 2305,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Dunehopper": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Dungeon Master": {
    "power": 86875,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      250,
      0,
      0,
      0,
      0
    ]
  },
  "Dwarf": {
    "power": 40,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Eagle Owl": {
    "power": 2295,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Eclipse": {
    "power": 37399,
    "effs": [
      1000,
      1000,
      100000,
      1000,
      25,
      1000,
      1000,
      1000,
      0,
      0
    ]
  },
  "Eel": {
    "power": 4960,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Effervescent": {
    "power": 13500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      250,
      0,
      0
    ]
  },
  "Egg Painter": {
    "power": 900,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Egg Scrambler": {
    "power": 1250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Eggscavator": {
    "power": 2200,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Eggsplosive Scientist": {
    "power": 2100,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Eggsquisite Entertainer": {
    "power": 2200,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "El Flamenco": {
    "power": 1400,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Elder": {
    "power": 8800,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Elf": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Elite Guardian": {
    "power": 5710,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Elixir Maker": {
    "power": 5050,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Elub Chieftain": {
    "power": 15250,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Elub Lich": {
    "power": 8800,
    "effs": [
      150,
      0,
      200,
      0,
      0,
      0,
      125,
      0,
      0,
      0
    ]
  },
  "Elven Princess": {
    "power": 1270,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Emberstone Scaled": {
    "power": 15575,
    "effs": [
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Empyrean Appraiser": {
    "power": 20550,
    "effs": [
      300,
      300,
      300,
      300,
      0,
      300,
      300,
      300,
      300,
      0
    ]
  },
  "Empyrean Empress": {
    "power": 263025,
    "effs": [
      500,
      500,
      500,
      500,
      0,
      500,
      500,
      500,
      500,
      0
    ]
  },
  "Empyrean Geologist": {
    "power": 15235,
    "effs": [
      300,
      300,
      300,
      300,
      0,
      300,
      300,
      300,
      300,
      0
    ]
  },
  "Empyrean Javelineer": {
    "power": 25350,
    "effs": [
      0,
      600,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Enginseer": {
    "power": 3930,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Enlightened Labourer": {
    "power": 2180,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Enslaved Spirit": {
    "power": 5730,
    "effs": [
      150,
      0,
      125,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Epoch Golem": {
    "power": 1250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Escape Artist": {
    "power": 50,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      200,
      25,
      100,
      100,
      0
    ]
  },
  "Essence Collector": {
    "power": 3275,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Essence Guardian": {
    "power": 3275,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ethereal Enchanter": {
    "power": 2500,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ethereal Engineer": {
    "power": 5500,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ethereal Guardian": {
    "power": 10851,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ethereal Librarian": {
    "power": 6499,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ethereal Thief": {
    "power": 6499,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Evil Scientist": {
    "power": 1100,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Excitable Electric": {
    "power": 965,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Exo-Tech": {
    "power": 10851,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Explorator": {
    "power": 4700,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      150,
      0,
      0
    ]
  },
  "Extreme Everysports": {
    "power": 1000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Factory Technician": {
    "power": 1000,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Fairy": {
    "power": 2500,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Fall Familiar": {
    "power": 11500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      100,
      0,
      0
    ]
  },
  "Fallen Champion Footman": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Falling Carpet": {
    "power": 12200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Farmhand": {
    "power": 600,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Farrier": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Fencer": {
    "power": 225,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Fete Fromager": {
    "power": 200,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Fetid Swamp": {
    "power": 12675,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Fibbocchio": {
    "power": 12000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Fiddler": {
    "power": 2000,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Field": {
    "power": 5,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Fiend": {
    "power": 11000,
    "effs": [
      125,
      125,
      125,
      400,
      25,
      75,
      125,
      75,
      0,
      0
    ]
  },
  "Fiery Crusher": {
    "power": 5095,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Finder": {
    "power": 2350,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Firebreather": {
    "power": 15401,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0
    ]
  },
  "Firefly": {
    "power": 3691,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0
    ]
  },
  "Flamboyant Flautist": {
    "power": 12500,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Flame Archer": {
    "power": 5200,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Flame Ordnance": {
    "power": 7900,
    "effs": [
      100,
      0,
      0,
      50,
      0,
      50,
      0,
      50,
      0,
      0
    ]
  },
  "Flame Warrior": {
    "power": 5700,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Floating Spore": {
    "power": 9200,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Flutterby": {
    "power": 6248,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      200,
      0,
      0
    ]
  },
  "Fluttering Flutist": {
    "power": 8000,
    "effs": [
      150,
      50,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Flying": {
    "power": 50,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Fog": {
    "power": 160,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Force Fighter Blue": {
    "power": 1000,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Force Fighter Green": {
    "power": 2000,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Force Fighter Pink": {
    "power": 1750,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Force Fighter Red": {
    "power": 1500,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Force Fighter Yellow": {
    "power": 1250,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Forever Alone": {
    "power": 900,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Forgotten Elder": {
    "power": 29000,
    "effs": [
      0,
      0,
      600,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Fortuitous Fool": {
    "power": 39150,
    "effs": [
      200,
      200,
      200,
      200,
      0,
      200,
      200,
      200,
      200,
      0
    ]
  },
  "Foxy": {
    "power": 1650,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Free Skiing": {
    "power": 2064,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Frightened Flying Fireworks": {
    "power": 106,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Frigid Foreman": {
    "power": 1276,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Frog": {
    "power": 590,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Frost King": {
    "power": 1768,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Frostbite": {
    "power": 14399,
    "effs": [
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Frostlance Guard": {
    "power": 6500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Frostwing Commander": {
    "power": 15250,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Frosty Snow": {
    "power": 280,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Frozen": {
    "power": 80,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Fuel": {
    "power": 3253,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Ful'Mina, The Mountain Queen": {
    "power": 78003,
    "effs": [
      0,
      900,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Fungal Frog": {
    "power": 1250,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Fungal Spore": {
    "power": 11499,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Fungal Technomorph": {
    "power": 28901,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Funglore": {
    "power": 8525,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Fuzzy Drake": {
    "power": 3175,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Gargantuamouse": {
    "power": 93997,
    "effs": [
      50,
      50000,
      0,
      25,
      0,
      25,
      0,
      25,
      0,
      0
    ]
  },
  "Gargoyle": {
    "power": 5010,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Gate Guardian": {
    "power": 7600,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Gate Keeper": {
    "power": 25185,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Gelatinous Octahedron": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Gemorpher": {
    "power": 8501,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Gemstone Worshipper": {
    "power": 3340,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "General Drheller": {
    "power": 23500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Gentleman Caller": {
    "power": 2000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Ghost": {
    "power": 2200,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Ghost Pirate Queen": {
    "power": 4000,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Giant Snail": {
    "power": 1515,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Gilded Leaf": {
    "power": 1400,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Gingerbread": {
    "power": 558,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Glacia Ice Fist": {
    "power": 1768,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Gladiator": {
    "power": 15600,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Glamorous Gladiator": {
    "power": 28575,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      600,
      0,
      0,
      0,
      0
    ]
  },
  "Glass Blower": {
    "power": 27899,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Glazy": {
    "power": 2,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Glitchpaw": {
    "power": 785,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Gluttonous Zombie": {
    "power": 820,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Goblin": {
    "power": 2290,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      175,
      100,
      0,
      0
    ]
  },
  "Gold": {
    "power": 350,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Goldleaf": {
    "power": 2100,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Golem": {
    "power": 6885,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Goliath Field": {
    "power": 11175,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Gorgon": {
    "power": 9500,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Gourd Ghoul": {
    "power": 3500,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Gourdborg": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Grampa Golem": {
    "power": 2815,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Grand Master of the Dojo": {
    "power": 330997,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Grandfather": {
    "power": 7000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Granite": {
    "power": 185,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Granny Spice": {
    "power": 4625,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Grave Robber": {
    "power": 2145,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      125,
      300
    ]
  },
  "Great Giftnapper": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Great Winter Hunt Impostor": {
    "power": 3780,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Greedy Al": {
    "power": 2400,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Greenbeard": {
    "power": 11500,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Grey": {
    "power": 2,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Grey Recluse": {
    "power": 2500,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Greyrun": {
    "power": 913,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Grit Grifter": {
    "power": 10000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Grizzled Silth": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Ground Gavaleer": {
    "power": 12475,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Grubling": {
    "power": 1200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Grubling Herder": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Grunt": {
    "power": 4620,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Guardian": {
    "power": 13200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Guppy": {
    "power": 4900,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Guqin Player": {
    "power": 4000,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Gyrologer": {
    "power": 18050,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Hans Cheesetian Squeakersen": {
    "power": 8000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Hapless": {
    "power": 570,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Hapless Marionette": {
    "power": 2,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      100,
      25,
      100,
      0,
      0
    ]
  },
  "Harbinger of Death": {
    "power": 4250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Hardboiled": {
    "power": 2500,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Hardworking Hauler": {
    "power": 1400,
    "effs": [
      50,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      200,
      0
    ]
  },
  "Hare Razer": {
    "power": 2600,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Harpy": {
    "power": 14500,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      175,
      100,
      0,
      0
    ]
  },
  "Harvest Harrier": {
    "power": 10867,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      100,
      0,
      0
    ]
  },
  "Harvester": {
    "power": 20700,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      100,
      0,
      0
    ]
  },
  "Hazmat": {
    "power": 5799,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Healer": {
    "power": 3650,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      100,
      0,
      0
    ]
  },
  "Heart of the Meteor": {
    "power": 1500000,
    "effs": [
      1000,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Heavy Blaster": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Herbaceous Bravestalk": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Herc": {
    "power": 21625,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "High Roller": {
    "power": 12500,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Hired Eidolon": {
    "power": 11900,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Hoarder": {
    "power": 172,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Hollowed": {
    "power": 3500,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      200
    ]
  },
  "Hollowed Minion": {
    "power": 4000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      200
    ]
  },
  "Hollowhead": {
    "power": 750,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Homeopathic Apothecary": {
    "power": 1300,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Hookshot": {
    "power": 4250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Hope": {
    "power": 10,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Horned Cork Hoarder": {
    "power": 8565,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Hot Head": {
    "power": 2300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0
    ]
  },
  "Humphrey Dumphrey": {
    "power": 9500,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Huntereater": {
    "power": 12551,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Hurdle": {
    "power": 1250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Hydra": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Hydrologist": {
    "power": 4970,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Hydrophobe": {
    "power": 1995,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      125,
      0,
      0
    ]
  },
  "Hypnotized Gunslinger": {
    "power": 6500,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Ice Regent": {
    "power": 13000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Iceberg Sculptor": {
    "power": 2790,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Iceblade": {
    "power": 7700,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Iceblock": {
    "power": 5400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Icebreaker": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Icewing": {
    "power": 25000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Icicle": {
    "power": 11340,
    "effs": [
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Ignatia": {
    "power": 9400,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ignis": {
    "power": 2300,
    "effs": [
      100,
      100,
      100,
      100,
      25,
      75,
      400,
      75,
      0,
      0
    ]
  },
  "Impersonator": {
    "power": 5,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      200,
      25,
      100,
      100,
      0
    ]
  },
  "Incompetent Ice Climber": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Industrious Digger": {
    "power": 1150,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Inferna, The Engulfed": {
    "power": 35325,
    "effs": [
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Inferno Mage": {
    "power": 4800,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      75,
      0,
      75,
      0,
      0
    ]
  },
  "Infiltrator": {
    "power": 12500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      250,
      0,
      0
    ]
  },
  "Itty Bitty Rifty Burroughs": {
    "power": 1250,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Itty-Bitty Burroughs": {
    "power": 8250,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Jellyfish": {
    "power": 4300,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Jovial Jailor": {
    "power": 17300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Joy": {
    "power": 2,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Juliyes": {
    "power": 2999,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Jurassic": {
    "power": 13650,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Kalor'ignis of the Geyser": {
    "power": 59640,
    "effs": [
      0,
      900,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Karmachameleon": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Keeper": {
    "power": 3485,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Keeper's Assistant": {
    "power": 3300,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Key Master": {
    "power": 23140,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "King Grub": {
    "power": 499995,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "King Scarab": {
    "power": 999989,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Kite Flyer": {
    "power": 22275,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Knight": {
    "power": 800,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Koimaid": {
    "power": 2240,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Kung Fu": {
    "power": 5695,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Lab Technician": {
    "power": 1800,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Lady Coldsnap": {
    "power": 18500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Lambent": {
    "power": 1350,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Lambent Crystal": {
    "power": 8000,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Lancer Guard": {
    "power": 15532,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Land Loafer": {
    "power": 8000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Lasso Cowgirl": {
    "power": 2000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Launchpad Labourer": {
    "power": 9512,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Lawbender": {
    "power": 9680,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Leafton Beanwell": {
    "power": 13000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Leprechaun": {
    "power": 27200,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Lethargic Guard": {
    "power": 19040,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Leviathan": {
    "power": 13706,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Lich": {
    "power": 20700,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Lightning Rod": {
    "power": 4,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Limestone Miner": {
    "power": 25101,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Little Bo Squeak": {
    "power": 10000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Little Miss Fluffet": {
    "power": 9000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Living Ice": {
    "power": 2000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Living Salt": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Loathsome Locust": {
    "power": 20000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500,
      0,
      0
    ]
  },
  "Lockpick": {
    "power": 10,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      200,
      25,
      100,
      100,
      0
    ]
  },
  "Longtail": {
    "power": 80,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Lord Splodington": {
    "power": 12000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Lost": {
    "power": 6425,
    "effs": [
      100,
      0,
      125,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Lost Legionnaire": {
    "power": 5300,
    "effs": [
      100,
      0,
      125,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Lovely Sports": {
    "power": 650,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Lucky": {
    "power": 250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Lumahead": {
    "power": 8275,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Lumberjack": {
    "power": 26000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Lumi-lancer": {
    "power": 23000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175
    ]
  },
  "Lunar Red Candle Maker": {
    "power": 88,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Lycan": {
    "power": 8765,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Lycanoid": {
    "power": 1100,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "M400": {
    "power": 16400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      50,
      0,
      0
    ]
  },
  "Mad Elf": {
    "power": 3780,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Madame d'Ormouse": {
    "power": 8500,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mage Weaver": {
    "power": 29999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Magic": {
    "power": 300,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Magic Champion": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Magma Carrier": {
    "power": 14300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Magmarage": {
    "power": 5500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      75,
      0,
      75,
      0,
      0
    ]
  },
  "Magmatic Crystal Thief": {
    "power": 5499,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Magmatic Golem": {
    "power": 6000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Mairitime Pirate": {
    "power": 137485,
    "effs": [
      300,
      300,
      300,
      300,
      0,
      300,
      300,
      300,
      300,
      0
    ]
  },
  "Maize Harvester": {
    "power": 3050,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Malevolent Maestro": {
    "power": 92300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      0
    ]
  },
  "Malicious Marquis": {
    "power": 36660,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Mammoth": {
    "power": 7000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Manaforge Smith": {
    "power": 18501,
    "effs": [
      100,
      0,
      5000,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Manatee": {
    "power": 3990,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Market Guard": {
    "power": 42803,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Market Thief": {
    "power": 42900,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      400,
      0
    ]
  },
  "Martial": {
    "power": 8800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300
    ]
  },
  "Masked Pikeman": {
    "power": 13601,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Master Burglar": {
    "power": 3000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      125,
      100
    ]
  },
  "Master Exploder": {
    "power": 1450,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Master of the Cheese Belt": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Master of the Cheese Claw": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Master of the Cheese Fang": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Master of the Chi Belt": {
    "power": 115000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500
    ]
  },
  "Master of the Chi Claw": {
    "power": 115000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500
    ]
  },
  "Master of the Chi Fang": {
    "power": 115000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500
    ]
  },
  "Master of the Dojo": {
    "power": 10000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Matriarch Gander": {
    "power": 7000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Matron of Machinery": {
    "power": 16700,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Matron of Wealth": {
    "power": 15400,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mecha Tail": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Medicine": {
    "power": 1250,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Melodramatic Minnow": {
    "power": 11000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Menace of the Rift": {
    "power": 5003,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Mermouse": {
    "power": 3300,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Mermousette": {
    "power": 6380,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mershark": {
    "power": 7500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Meteorite Golem": {
    "power": 13650,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Meteorite Miner": {
    "power": 2550,
    "effs": [
      50,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      200,
      0
    ]
  },
  "Meteorite Mover": {
    "power": 11000,
    "effs": [
      50,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      200,
      0
    ]
  },
  "Meteorite Mystic": {
    "power": 17500,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Meteorite Snacker": {
    "power": 1325,
    "effs": [
      50,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      200,
      0
    ]
  },
  "Micro": {
    "power": 866,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Mighty Mite": {
    "power": 13000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Mighty Mole": {
    "power": 1000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Mild Spicekin": {
    "power": 5725,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Militant Samurai": {
    "power": 18000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Mimic": {
    "power": 18051,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mind Tearer": {
    "power": 20250,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Miner": {
    "power": 3442,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Mining Materials Manager": {
    "power": 1650,
    "effs": [
      50,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      200,
      0
    ]
  },
  "Mintaka": {
    "power": 8000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Mischievous Meteorite Miner": {
    "power": 1950,
    "effs": [
      50,
      0,
      0,
      0,
      0,
      0,
      50,
      0,
      200,
      0
    ]
  },
  "Mischievous Wereminer": {
    "power": 6825,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Miser": {
    "power": 2790,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Missile Toe": {
    "power": 2400,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Mist Maker": {
    "power": 91674,
    "effs": [
      0,
      0,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mlounder Flounder": {
    "power": 3710,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mobster": {
    "power": 20400,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Mole": {
    "power": 300,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Molten Midas": {
    "power": 491997,
    "effs": [
      100,
      0,
      5000,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Monarch": {
    "power": 2530,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0
    ]
  },
  "Monk": {
    "power": 6630,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Monsoon Maker": {
    "power": 9500,
    "effs": [
      100,
      50,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Monster": {
    "power": 8240,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      500,
      500,
      100,
      100,
      0
    ]
  },
  "Monster of the Meteor": {
    "power": 88000,
    "effs": [
      1000,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Monster Tail": {
    "power": 3750,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Monstrous Abomination": {
    "power": 24998,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Monstrous Black Widow": {
    "power": 9000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      200
    ]
  },
  "Monstrous Midge": {
    "power": 110000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      400,
      0,
      0
    ]
  },
  "Moosker": {
    "power": 45,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Mossy Moosker": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Mouldy Mole": {
    "power": 5560,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mountain": {
    "power": 1100,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Mousataur Priestess": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Mouse of Elements": {
    "power": 16000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500
    ]
  },
  "Mouse of Winter Future": {
    "power": 1276,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Mouse of Winter Past": {
    "power": 1768,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Mouse of Winter Present": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Mouse With No Name": {
    "power": 4999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Mousevina von Vermin": {
    "power": 18300,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      2500,
      25,
      0,
      0
    ]
  },
  "Moussile": {
    "power": 700,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Mummy": {
    "power": 3860,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Mush": {
    "power": 7290,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mush Monster": {
    "power": 13601,
    "effs": [
      275,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mushroom Harvester": {
    "power": 10851,
    "effs": [
      275,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mushroom Sprite": {
    "power": 8800,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mutant Mongrel": {
    "power": 17499,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mutant Ninja": {
    "power": 11003,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mutated Behemoth": {
    "power": 25000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mutated Brown": {
    "power": 465,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Mutated Grey": {
    "power": 192,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Mutated Mole": {
    "power": 5004,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Mutated Siblings": {
    "power": 3500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mutated White": {
    "power": 138,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Mysterious Traveller": {
    "power": 3253,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Mystic": {
    "power": 3250,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mystic Bishop": {
    "power": 10800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Mystic Guardian": {
    "power": 40602,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mystic Herald": {
    "power": 20250,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mystic King": {
    "power": 24000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2500,
      0,
      0
    ]
  },
  "Mystic Knight": {
    "power": 8596,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Mystic Pawn": {
    "power": 1800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Mystic Queen": {
    "power": 22004,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Mystic Rook": {
    "power": 18620,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Mystic Scholar": {
    "power": 28901,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Mythical Giant King": {
    "power": 148100,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      0
    ]
  },
  "Mythweaver": {
    "power": 200000,
    "effs": [
      0,
      0,
      750,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Nachore Golem": {
    "power": 2235,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Nachous, The Molten": {
    "power": 26675,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      500,
      0,
      0,
      0
    ]
  },
  "Narrator": {
    "power": 1330,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Naturalist": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Naughty Nougat": {
    "power": 4428,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Necromancer": {
    "power": 2000,
    "effs": [
      125,
      125,
      125,
      400,
      25,
      75,
      125,
      75,
      0,
      0
    ]
  },
  "Nefarious Nautilus": {
    "power": 15000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Nerg Chieftain": {
    "power": 12600,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Nerg Lich": {
    "power": 8000,
    "effs": [
      150,
      0,
      200,
      0,
      0,
      0,
      125,
      0,
      0,
      0
    ]
  },
  "New Year's": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Nibbler": {
    "power": 275,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Nice Knitting": {
    "power": 419,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Night Shift Materials Manager": {
    "power": 5500,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Night Watcher": {
    "power": 9587.5,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Nightfire": {
    "power": 67600,
    "effs": [
      150,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Nightmancer": {
    "power": 41600,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Nightshade Flower Girl": {
    "power": 2800,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Nightshade Fungalmancer": {
    "power": 15400,
    "effs": [
      275,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Nightshade Maiden": {
    "power": 1600,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Nightshade Masquerade": {
    "power": 3800,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Nightshade Nanny": {
    "power": 16700,
    "effs": [
      275,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Nimbomancer": {
    "power": 13474,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ninja": {
    "power": 1275,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Nitro Racer": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Nomad": {
    "power": 13175,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Nomadic Warrior": {
    "power": 2500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Nugget": {
    "power": 900,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Nutcracker": {
    "power": 2400,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Obstinate Oboist": {
    "power": 19000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Octomermaid": {
    "power": 6741,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Ol' King Coal": {
    "power": 1506,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Old One": {
    "power": 9850,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Old Spice Collector": {
    "power": 3800,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "One-Mouse Band": {
    "power": 11750,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      400
    ]
  },
  "Onion Chopper": {
    "power": 2200,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Ooze": {
    "power": 5205,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Ore Chipper": {
    "power": 1720,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Ornament": {
    "power": 2790,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Outbreak Assassin": {
    "power": 17250,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Outlaw": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Over-Prepared": {
    "power": 2280,
    "effs": [
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Overcaster": {
    "power": 17275,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Oxygen Baron": {
    "power": 7500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pack": {
    "power": 2700,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Page": {
    "power": 275,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Paladin": {
    "power": 7700,
    "effs": [
      300,
      200,
      200,
      200,
      25,
      75,
      200,
      75,
      0,
      0
    ]
  },
  "Paladin Weapon Master": {
    "power": 18501,
    "effs": [
      100,
      0,
      5000,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pan Slammer": {
    "power": 2500,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Para Para Dancer": {
    "power": 900,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Paragon of Arcane": {
    "power": 225000,
    "effs": [
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Paragon of Dragons": {
    "power": 151650,
    "effs": [
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Paragon of Forgotten": {
    "power": 315000,
    "effs": [
      0,
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Paragon of Shadow": {
    "power": 246650,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      500,
      0,
      0,
      0
    ]
  },
  "Paragon of Strength": {
    "power": 305875,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      500,
      0,
      0,
      0,
      0
    ]
  },
  "Paragon of Tactics": {
    "power": 246965,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500,
      0,
      0
    ]
  },
  "Paragon of the Lawless": {
    "power": 124100,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500,
      0
    ]
  },
  "Paragon of Water": {
    "power": 322000,
    "effs": [
      0,
      0,
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Parlour Player": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Party Head": {
    "power": 266,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Passenger": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Pathfinder": {
    "power": 1500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Peaceful Prisoner": {
    "power": 15000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Pearl": {
    "power": 5720,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pearl Diver": {
    "power": 4960,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pebble": {
    "power": 120,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Peevish Piccoloist": {
    "power": 21000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Peggy the Plunderer": {
    "power": 110950,
    "effs": [
      700,
      700,
      700,
      700,
      0,
      700,
      700,
      700,
      700,
      0
    ]
  },
  "Penguin": {
    "power": 2508,
    "effs": [
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Pernicious Prince": {
    "power": 115150,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      0
    ]
  },
  "Phalanx": {
    "power": 900,
    "effs": [
      50,
      50,
      50,
      50,
      25,
      50,
      50,
      200,
      0,
      0
    ]
  },
  "Phase Zombie": {
    "power": 975,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Photographer": {
    "power": 2752,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Pie Thief": {
    "power": 8600,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      400,
      0
    ]
  },
  "Pinchy": {
    "power": 635,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Pinkielina": {
    "power": 11000,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pintail": {
    "power": 600,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Pirate": {
    "power": 1275,
    "effs": [
      100,
      100,
      100,
      175,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Pirate Anchor": {
    "power": 6741,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Plague Hag": {
    "power": 8801,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Plotting Page": {
    "power": 32000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Plutonium Tentacle": {
    "power": 14999,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Pneumatic Dirt Displacement": {
    "power": 1200,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Pocketwatch": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      150,
      0,
      0
    ]
  },
  "Polar Bear": {
    "power": 5200,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pompous Perch": {
    "power": 9000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Portable Generator": {
    "power": 1000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Portal Paladin": {
    "power": 8000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Portal Plunderer": {
    "power": 1650,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Portal Pursuer": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      50
    ]
  },
  "Possessed Armaments": {
    "power": 38000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1000
    ]
  },
  "Praetorian Champion": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Present": {
    "power": 778,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Prestigious Adventurer": {
    "power": 150000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2500
    ]
  },
  "Primal": {
    "power": 12345,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Princess and the Olive": {
    "power": 9800,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Princess Fist": {
    "power": 15500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Prospector": {
    "power": 1750,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Protector": {
    "power": 10400,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Prototype": {
    "power": 950,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Puddlemancer": {
    "power": 9925,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      125,
      0,
      0
    ]
  },
  "Puffer": {
    "power": 3990,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pugilist": {
    "power": 70,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Pump Raider": {
    "power": 1915,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Pumpkin Head": {
    "power": 2400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      100,
      0,
      0
    ]
  },
  "Pumpkin Hoarder": {
    "power": 1600,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Puppet Champion": {
    "power": 72000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      900
    ]
  },
  "Puppet Master": {
    "power": 100,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      100,
      25,
      100,
      0,
      0
    ]
  },
  "Puppetto": {
    "power": 2900,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Pygmy Wrangler": {
    "power": 2400,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Pyrehyde": {
    "power": 13700,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Pyrite": {
    "power": 650,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Queen Quesada": {
    "power": 42000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      500,
      0
    ]
  },
  "Queso Extractor": {
    "power": 4310,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Quesodillo": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Quillback": {
    "power": 8000,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Radioactive Ooze": {
    "power": 1601,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Rain Collector": {
    "power": 2400,
    "effs": [
      100,
      50,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Rain Summoner": {
    "power": 7000,
    "effs": [
      100,
      50,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Rain Wallower": {
    "power": 3800,
    "effs": [
      100,
      50,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Rainbow Racer": {
    "power": 2790,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Rainmancer": {
    "power": 18500,
    "effs": [
      100,
      50,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Rainwater Purifier": {
    "power": 3500,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Rambunctious Rain Rumbler": {
    "power": 13700,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Rancid Bog Beast": {
    "power": 2199,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Ravenous Zombie": {
    "power": 2385,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Raw Diamond": {
    "power": 1525,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Reality Restitch": {
    "power": 300,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Realm Ripper": {
    "power": 3200,
    "effs": [
      400,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Reanimated Carver": {
    "power": 14651,
    "effs": [
      100,
      0,
      125,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Reaper": {
    "power": 11400,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Record Keeper": {
    "power": 2300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Record Keeper's Assistant": {
    "power": 1650,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Red Coat Bear": {
    "power": 1750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Red Envelope": {
    "power": 888,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300,
      300
    ]
  },
  "Red-Eyed Watcher Owl": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Regal Spearman": {
    "power": 68550,
    "effs": [
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Reinbo": {
    "power": 1275,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Relic Hunter": {
    "power": 1250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Renegade": {
    "power": 9700,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Retired Minotaur": {
    "power": 1824975,
    "effs": [
      100,
      0,
      5000,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Reveling Lycanthrope": {
    "power": 7637.5,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Revenant": {
    "power": 1150,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Ribbon": {
    "power": 106,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Richard the Rich": {
    "power": 33725,
    "effs": [
      200,
      200,
      200,
      200,
      0,
      200,
      200,
      200,
      200,
      0
    ]
  },
  "Ridiculous Sweater": {
    "power": 558,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Rift Bio Engineer": {
    "power": 980,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Rift Guardian": {
    "power": 1225,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Rift Tiger": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Rifterranian": {
    "power": 1250,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Riftweaver": {
    "power": 900,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Riptide": {
    "power": 3260,
    "effs": [
      150,
      0,
      200,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Robat": {
    "power": 975,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Rock Muncher": {
    "power": 1145,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Rocketeer": {
    "power": 27300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      600,
      0,
      0
    ]
  },
  "Rockstar": {
    "power": 3000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Rogue": {
    "power": 600,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      200,
      25,
      100,
      100,
      0
    ]
  },
  "Romeno": {
    "power": 1,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Romeo": {
    "power": 3000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Root Rummager": {
    "power": 9000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "RR-8": {
    "power": 7900,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Rubble Rouser": {
    "power": 4225,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Rubble Rummager": {
    "power": 3480,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Ruffian": {
    "power": 2000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "S.N.O.W. Golem": {
    "power": 4720,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Saboteur": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sacred Shrine": {
    "power": 5200,
    "effs": [
      300,
      200,
      200,
      200,
      25,
      75,
      200,
      75,
      0,
      0
    ]
  },
  "Saloon Gal": {
    "power": 1750,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Salt Water Snapper": {
    "power": 1650,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Saltwater Axolotl": {
    "power": 3990,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Samurai": {
    "power": 6630,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Sand Cavalry": {
    "power": 5500,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      75,
      0,
      100,
      0,
      0
    ]
  },
  "Sand Colossus": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Sand Dollar Diver": {
    "power": 3750,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sand Dollar Queen": {
    "power": 4300,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sand Pilgrim": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Sand Sifter": {
    "power": 9000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sandmouse": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Sandwing Cavalry": {
    "power": 6200,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      75,
      0,
      100,
      0,
      0
    ]
  },
  "Sanguinarian": {
    "power": 13601,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sarcophamouse": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Sassy Salsa Dancer": {
    "power": 24000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Scarab": {
    "power": 7998,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Scarecrow": {
    "power": 2645,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      100,
      0,
      0
    ]
  },
  "Scarlet Revenger": {
    "power": 114000,
    "effs": [
      300,
      300,
      300,
      300,
      0,
      300,
      300,
      300,
      300,
      0
    ]
  },
  "Scavenger": {
    "power": 5205,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Scheming Squire": {
    "power": 38000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "School of Mish": {
    "power": 3930,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Scorned Pirate": {
    "power": 2350,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Scout": {
    "power": 1750,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Scrap Metal Monster": {
    "power": 10000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Scribe": {
    "power": 26999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      275,
      0,
      0
    ]
  },
  "Scrooge": {
    "power": 2064,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Scruffy": {
    "power": 120,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Seadragon": {
    "power": 4900,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Seasoned Islandographer": {
    "power": 20550,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Seer": {
    "power": 8800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Sentient Slime": {
    "power": 1750,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Sentinel": {
    "power": 4800,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Serpent Monster": {
    "power": 26599,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Serpentine": {
    "power": 7998,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Shackled Servant": {
    "power": 5800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Shade of the Eclipse": {
    "power": 7000000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100000
    ]
  },
  "Shadow Sage": {
    "power": 73500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      0,
      0
    ]
  },
  "Shadow Stalker": {
    "power": 51990,
    "effs": [
      0,
      0,
      50,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Shaman": {
    "power": 755,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Shaolin Kung Fu": {
    "power": 12375,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Shard Centurion": {
    "power": 1340,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Sharpshooter": {
    "power": 4999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Shattered Carmine": {
    "power": 40000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Shattered Obsidian": {
    "power": 8325,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Shelder": {
    "power": 1270,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Shinobi": {
    "power": 2910,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Shipwrecked": {
    "power": 1485,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Shopkeeper": {
    "power": 1500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Shortcut": {
    "power": 1750,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Shorts-All-Year": {
    "power": 2064,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Shroom": {
    "power": 7000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Silth": {
    "power": 60001,
    "effs": [
      100,
      0,
      0,
      175,
      0,
      100,
      100,
      125,
      0,
      0
    ]
  },
  "Silvertail": {
    "power": 500,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Sinister Egg Painter": {
    "power": 1100,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Sinister Squid": {
    "power": 13000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sir Fleekio": {
    "power": 16700,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Siren": {
    "power": 5508,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Sizzle Pup": {
    "power": 5725,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Skeletal Champion": {
    "power": 1550,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Skeleton": {
    "power": 3175,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Sky Dancer": {
    "power": 18375,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Glass Glazier": {
    "power": 16100,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Glass Sorcerer": {
    "power": 11000,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Glider": {
    "power": 24350,
    "effs": [
      600,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Greaser": {
    "power": 8185,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Sky Highborne": {
    "power": 64845,
    "effs": [
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Squire": {
    "power": 80460,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Surfer": {
    "power": 20374,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sky Swordsman": {
    "power": 18610,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Skydiver": {
    "power": 5950,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Slay Ride": {
    "power": 1067,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Slayer": {
    "power": 9800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0
    ]
  },
  "Sleepwalker": {
    "power": 800,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Sleepy Merchant": {
    "power": 420,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Slimefist": {
    "power": 18500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Slope Swimmer": {
    "power": 600,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Sludge": {
    "power": 3900,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sludge Scientist": {
    "power": 462,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Sludge Soaker": {
    "power": 7400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sludge Swimmer": {
    "power": 19000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Smoldersnap": {
    "power": 7820,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Smug Smuggler": {
    "power": 30000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Snake Charmer": {
    "power": 6351,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Snooty": {
    "power": 4000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snow Boulder": {
    "power": 419,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snow Bowler": {
    "power": 6500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Snow Fort": {
    "power": 712,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snow Golem Architect": {
    "power": 882,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snow Golem Jockey": {
    "power": 847,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snow Scavenger": {
    "power": 1506,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snow Slinger": {
    "power": 5400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Snow Sniper": {
    "power": 5600,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Snow Soldier": {
    "power": 5200,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Snow Sorceress": {
    "power": 1508,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snowball Hoarder": {
    "power": 558,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snowblind": {
    "power": 5600,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Snowblower": {
    "power": 1768,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snowflake": {
    "power": 286,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Snowglobe": {
    "power": 1506,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Sock Puppet Ghost": {
    "power": 210,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      100,
      25,
      100,
      0,
      0
    ]
  },
  "Soldier of the Shade": {
    "power": 350000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      5000
    ]
  },
  "Solemn Soldier": {
    "power": 40602,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Soothsayer": {
    "power": 6775,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sorcerer": {
    "power": 5208,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Soul Binder": {
    "power": 18501,
    "effs": [
      100,
      0,
      5000,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Space Party-Time Plumber": {
    "power": 500,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Spear Fisher": {
    "power": 9850,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spectral Butler": {
    "power": 3200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Spectral Swashbuckler": {
    "power": 3000,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Spectre": {
    "power": 5210,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Speedy": {
    "power": 120,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Spellbinder": {
    "power": 5350,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0
    ]
  },
  "Spheric Diviner": {
    "power": 86670,
    "effs": [
      0,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spice Farmer": {
    "power": 2455,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spice Finder": {
    "power": 5575,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spice Merchant": {
    "power": 13950,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      300,
      300,
      0
    ]
  },
  "Spice Raider": {
    "power": 3810,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spice Reaper": {
    "power": 6700,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spice Seer": {
    "power": 1873,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spice Sovereign": {
    "power": 3080,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spider": {
    "power": 5205,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Spiked Burrower": {
    "power": 5750,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spiky Devil": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Spirit Fox": {
    "power": 1750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Spirit Light": {
    "power": 600,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Spirit of Balance": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Spiritual Steel": {
    "power": 1340,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Splintered Stone Sentry": {
    "power": 7050,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spore": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spore Muncher": {
    "power": 5275,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spore Salesman": {
    "power": 2200,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Sporeticus": {
    "power": 5175,
    "effs": [
      0,
      0,
      100,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sporty Ski Instructor": {
    "power": 680,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Spotted": {
    "power": 5,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Spring Familiar": {
    "power": 10500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      125,
      0,
      0
    ]
  },
  "Spring Sprig": {
    "power": 2250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Sprinkly Sweet Cupcake Cook": {
    "power": 1000,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Spry Sky Explorer": {
    "power": 9594,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spry Sky Seer": {
    "power": 16175,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Spud": {
    "power": 250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Squeaken": {
    "power": 13250,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Squeaker Bot": {
    "power": 65,
    "effs": [
      100,
      0,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Squeaker Claws": {
    "power": 5210,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Stack of Thieves": {
    "power": 8400,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Stagecoach Driver": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Stalagmite": {
    "power": 14799,
    "effs": [
      0,
      0,
      200,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Stealth": {
    "power": 300,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      200,
      25,
      100,
      100,
      0
    ]
  },
  "Steam Grip": {
    "power": 23001,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      300,
      0,
      275,
      0,
      0
    ]
  },
  "Steam Sailor": {
    "power": 5365,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Steel": {
    "power": 160,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Steel Horse Rider": {
    "power": 4999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Stickybomber": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Stinger": {
    "power": 13200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0
    ]
  },
  "Stingray": {
    "power": 4300,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Stocking": {
    "power": 3245,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Stone Cutter": {
    "power": 2100,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Stone Maiden": {
    "power": 3950,
    "effs": [
      0,
      0,
      100,
      50,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Stonework Warrior": {
    "power": 13450,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Stormsurge, the Vile Tempest": {
    "power": 52750,
    "effs": [
      0,
      500,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Stoutgear": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Stowaway": {
    "power": 2501,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Stratocaster": {
    "power": 19700,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Strawberry Hotcakes": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Stuck Snowball": {
    "power": 1068,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Student of the Cheese Belt": {
    "power": 2200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Student of the Cheese Claw": {
    "power": 2200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Student of the Cheese Fang": {
    "power": 2200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Student of the Chi Belt": {
    "power": 15000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Student of the Chi Claw": {
    "power": 15000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Student of the Chi Fang": {
    "power": 15000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Stuffy Banker": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Suave Pirate": {
    "power": 18510,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      0
    ]
  },
  "Subterranean": {
    "power": 9500,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      100,
      100,
      100,
      0,
      0
    ]
  },
  "Sugar Rush": {
    "power": 3200,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Sultry Saxophonist": {
    "power": 23000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Summer Mage": {
    "power": 19800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0
    ]
  },
  "Summoning Scholar": {
    "power": 7900,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sunken Banshee": {
    "power": 9850,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sunken Citizen": {
    "power": 3930,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Super FighterBot MegaSupreme": {
    "power": 2450,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Super Mega Mecha Ultra RoboGold": {
    "power": 2300,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Supernatural": {
    "power": 980,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Supply Hoarder": {
    "power": 4999,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Supreme Sensei": {
    "power": 404014,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Surgeon Bot": {
    "power": 975,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Swabbie": {
    "power": 570,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Swamp Runner": {
    "power": 2150,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Swamp Thang": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Swarm of Pygmy Mice": {
    "power": 1800,
    "effs": [
      0,
      0,
      100,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Swashblade": {
    "power": 8709,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Sylvan": {
    "power": 200,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Tackle Tracker": {
    "power": 10000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Tadpole": {
    "power": 5400,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Taleweaver": {
    "power": 1600,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Tanglefoot": {
    "power": 4420,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      125,
      0,
      0
    ]
  },
  "Tech Golem": {
    "power": 40602,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Tech Ravenous Zombie": {
    "power": 1100,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Technic Bishop": {
    "power": 10800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Technic King": {
    "power": 24000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2500,
      0,
      0
    ]
  },
  "Technic Knight": {
    "power": 8596,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Technic Pawn": {
    "power": 1800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Technic Queen": {
    "power": 22004,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Technic Rook": {
    "power": 18620,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Teenage Vampire": {
    "power": 100,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Telekinetic Mutant": {
    "power": 14498,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Tentacle": {
    "power": 12000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Terra": {
    "power": 2200,
    "effs": [
      100,
      100,
      100,
      100,
      25,
      75,
      400,
      75,
      0,
      0
    ]
  },
  "Terrible Twos": {
    "power": 300,
    "effs": [
      25,
      25,
      25,
      25,
      200,
      25,
      25,
      25,
      100,
      25
    ]
  },
  "Terrified Adventurer": {
    "power": 100,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      150
    ]
  },
  "Terror Knight": {
    "power": 5750,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "The Menace": {
    "power": 20000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "The Total Eclipse": {
    "power": 13500000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100000
    ]
  },
  "Theurgy Warden": {
    "power": 10498,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Thirsty": {
    "power": 999,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Thistle": {
    "power": 4000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Thorn": {
    "power": 6000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Thunder Strike": {
    "power": 1650,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Thundering Watcher": {
    "power": 16500,
    "effs": [
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "⚡Thunderlord⚡": {
    "power": 13500,
    "effs": [
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Tidal Fisher": {
    "power": 2500,
    "effs": [
      150,
      0,
      125,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Tiger": {
    "power": 6700,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Time Punk": {
    "power": 1000,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Time Tailor": {
    "power": 1500,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Time Thief": {
    "power": 2850,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Timeless Lich": {
    "power": 9500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      300
    ]
  },
  "Timelost Thaumaturge": {
    "power": 4700,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Timeslither Pythoness": {
    "power": 8800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Timid Explorer": {
    "power": 3300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100
    ]
  },
  "Tiny": {
    "power": 7,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Tiny Dragonfly": {
    "power": 10390,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Tiny Saboteur": {
    "power": 1120,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0
    ]
  },
  "Tiny Toppler": {
    "power": 2815,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Titanic Brain-Taker": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Toboggan Technician": {
    "power": 1067,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Tomb Exhumer": {
    "power": 1100,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      200
    ]
  },
  "Tome Sprite": {
    "power": 6200,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      200,
      0,
      0
    ]
  },
  "Tonic Salesman": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Totally Not Bitter": {
    "power": 650,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Toxic Avenger": {
    "power": 2100,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Toxic Warrior": {
    "power": 17000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Toxikinetic": {
    "power": 1700,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Toy": {
    "power": 419,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Toy Sylvan": {
    "power": 3,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      100,
      25,
      100,
      0,
      0
    ]
  },
  "Toy Tinkerer": {
    "power": 680,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Trailblazer": {
    "power": 2500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      100,
      0,
      0
    ]
  },
  "Train Conductor": {
    "power": 3253,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Train Engineer": {
    "power": 3499,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Trampoline": {
    "power": 750,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Travelling Barber": {
    "power": 3253,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Treacherous Tubaist": {
    "power": 103900,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      0
    ]
  },
  "Treant": {
    "power": 760,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Treant Queen": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Treasure Brawler": {
    "power": 27900,
    "effs": [
      100,
      0,
      300,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Treasure Hoarder": {
    "power": 6549,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Treasure Keeper": {
    "power": 8600,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Treasurer": {
    "power": 2000,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Treat": {
    "power": 2000,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Tree Troll": {
    "power": 2000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Tri-dra": {
    "power": 7500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Trick": {
    "power": 2000,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Tricky Witch": {
    "power": 1250,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Triple Lutz": {
    "power": 266,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Tritus": {
    "power": 68501,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Troll": {
    "power": 14460,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      175,
      100,
      0,
      0
    ]
  },
  "Tumbleweed": {
    "power": 1375,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Tundra Huntress": {
    "power": 5582,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Turret Guard": {
    "power": 9850,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Twisted Carmine": {
    "power": 20000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Twisted Fiend": {
    "power": 3000,
    "effs": [
      150,
      0,
      125,
      0,
      0,
      0,
      200,
      0,
      0,
      0
    ]
  },
  "Twisted Hotcakes": {
    "power": 7501,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Twisted Lilly": {
    "power": 9499,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Twisted Treant": {
    "power": 1500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Undertaker": {
    "power": 4500,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Unwavering Adventurer": {
    "power": 4800,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      175
    ]
  },
  "Upper Class Lady": {
    "power": 2250,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Urchin King": {
    "power": 11150,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Vampire": {
    "power": 2340,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      25,
      200,
      25,
      0,
      0
    ]
  },
  "Vanguard": {
    "power": 4100,
    "effs": [
      0,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Vanquisher": {
    "power": 7450,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Vaporior": {
    "power": 10000,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Vicious Vampire Squid": {
    "power": 16000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Vigilant Ward": {
    "power": 5000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Vincent, The Magnificent": {
    "power": 4000,
    "effs": [
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Vindictive Viscount": {
    "power": 25000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Vinetail": {
    "power": 18900,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      200,
      0,
      125,
      0,
      0
    ]
  },
  "Vinneus Stalkhome": {
    "power": 80900,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      400,
      0,
      0,
      0,
      0
    ]
  },
  "Violent Violinist": {
    "power": 33090,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Violet Stormchild": {
    "power": 2000,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Walker": {
    "power": 14751,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      125,
      0,
      250,
      0,
      0
    ]
  },
  "Wandering Monk": {
    "power": 15275,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200
    ]
  },
  "Warden of Fog": {
    "power": 203580,
    "effs": [
      400,
      400,
      400,
      400,
      0,
      400,
      400,
      400,
      400,
      0
    ]
  },
  "Warden of Frost": {
    "power": 203580,
    "effs": [
      400,
      400,
      400,
      400,
      0,
      400,
      400,
      400,
      400,
      0
    ]
  },
  "Warden of Rain": {
    "power": 203580,
    "effs": [
      400,
      400,
      400,
      400,
      0,
      400,
      400,
      400,
      400,
      0
    ]
  },
  "Warden of Wind": {
    "power": 203580,
    "effs": [
      400,
      400,
      400,
      400,
      0,
      400,
      400,
      400,
      400,
      0
    ]
  },
  "Warehouse Manager": {
    "power": 4498,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      0
    ]
  },
  "Warming Wyvern": {
    "power": 7350,
    "effs": [
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Warmonger": {
    "power": 43007,
    "effs": [
      75,
      0,
      0,
      75,
      0,
      100,
      0,
      75,
      0,
      0
    ]
  },
  "Water Nymph": {
    "power": 4280,
    "effs": [
      0,
      0,
      0,
      175,
      0,
      100,
      0,
      100,
      0,
      0
    ]
  },
  "Water Sprite": {
    "power": 1750,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Water Wielder": {
    "power": 7500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Wave Racer": {
    "power": 1250,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Wealth": {
    "power": 1525,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Wealthy Werewarrior": {
    "power": 6142.5,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Werehauler": {
    "power": 5500,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Wereminer": {
    "power": 9425,
    "effs": [
      100,
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0
    ]
  },
  "Whelpling": {
    "power": 1275,
    "effs": [
      0,
      100,
      0,
      75,
      0,
      75,
      0,
      75,
      0,
      0
    ]
  },
  "Whimsical Waltzer": {
    "power": 22000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0
    ]
  },
  "Whirleygig": {
    "power": 2185,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      100,
      0,
      0
    ]
  },
  "White": {
    "power": 1,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "White Mage": {
    "power": 5200,
    "effs": [
      300,
      200,
      200,
      200,
      25,
      75,
      200,
      75,
      0,
      0
    ]
  },
  "Wicked Witch of Whisker Woods": {
    "power": 1270,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Wiggler": {
    "power": 90,
    "effs": [
      100,
      0,
      0,
      100,
      0,
      100,
      100,
      175,
      100,
      0
    ]
  },
  "Wight": {
    "power": 13780,
    "effs": [
      200,
      0,
      100,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Wild Chainsaw": {
    "power": 1800,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Wily Weevil": {
    "power": 12000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Wind Warrior": {
    "power": 21200,
    "effs": [
      150,
      50,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Wind Watcher": {
    "power": 4100,
    "effs": [
      150,
      50,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Windy Farmer": {
    "power": 2400,
    "effs": [
      100,
      100,
      0,
      0,
      0,
      0,
      100,
      0,
      0,
      0
    ]
  },
  "Winged Harpy": {
    "power": 2500,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Winter Games": {
    "power": 500,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Winter Mage": {
    "power": 21600,
    "effs": [
      0,
      0,
      0,
      200,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Withered Remains": {
    "power": 29000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      700
    ]
  },
  "Wolfskie": {
    "power": 5600,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Wordsmith": {
    "power": 3000,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      100,
      0,
      0
    ]
  },
  "Worker": {
    "power": 635,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      175,
      0,
      0
    ]
  },
  "Worried Wayfinder": {
    "power": 12410,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      100,
      0,
      0
    ]
  },
  "Wound Up White": {
    "power": 1,
    "effs": [
      25,
      25,
      25,
      25,
      25,
      100,
      25,
      100,
      0,
      0
    ]
  },
  "Wrathful Warden": {
    "power": 70300,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      150,
      0,
      0,
      0,
      0
    ]
  },
  "Wreath Thief": {
    "power": 778,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      125,
      100
    ]
  },
  "Yeti": {
    "power": 6500,
    "effs": [
      0,
      0,
      0,
      100,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  },
  "Young Prodigy Racer": {
    "power": 712,
    "effs": [
      100,
      100,
      100,
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ]
  },
  "Zealous Academic": {
    "power": 28000,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      600,
      0,
      0,
      0
    ]
  },
  "Zephyr": {
    "power": 4100,
    "effs": [
      100,
      100,
      100,
      100,
      25,
      75,
      400,
      75,
      0,
      0
    ]
  },
  "Zombie": {
    "power": 920,
    "effs": [
      100,
      0,
      100,
      0,
      0,
      100,
      200,
      25,
      0,
      0
    ]
  },
  "Zombot Unipire": {
    "power": 330,
    "effs": [
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      101,
      300
    ]
  },
  "Zombot Unipire the Third": {
    "power": 1000,
    "effs": [
      10,
      10,
      10,
      10,
      0,
      10,
      10,
      10,
      10,
      100
    ]
  },
  "Zurreal the Eternal": {
    "power": 73001,
    "effs": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      5500,
      0,
      0
    ]
  }
};
