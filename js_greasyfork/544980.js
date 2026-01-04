// ==UserScript==
// @name         Neopets - Karla's Trophy Tracker
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.4
// @description  Displays what trophies you are missing and can upgrade
// @author       Karla
// @match        *://*.neopets.com/prizes.phtml*
// @homepage     https://neopointskarla.com
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544980/Neopets%20-%20Karla%27s%20Trophy%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/544980/Neopets%20-%20Karla%27s%20Trophy%20Tracker.meta.js
// ==/UserScript==

const flashgameHighScoreTrophies = [
    {
        "name": "200m Peanut Dash",
        "images": [
            "https://images.neopets.com/trophies/987_3.gif",
            "https://images.neopets.com/trophies/987_2.gif",
            "https://images.neopets.com/trophies/987_1.gif"
        ]
    },
    {
        "name": "AAA's Revenge",
        "images": [
            "https://images.neopets.com/trophies/1375_3.gif",
            "https://images.neopets.com/trophies/1375_2.gif",
            "https://images.neopets.com/trophies/1375_1.gif"
        ]
    },
    {
        "name": "Advert Attack",
        "images": [
            "https://images.neopets.com/trophies/204_3.gif",
            "https://images.neopets.com/trophies/204_2.gif",
            "https://images.neopets.com/trophies/204_1.gif"
        ]
    },
    {
        "name": "Assignment 53",
        "images": [
            "https://images.neopets.com/trophies/1347_3.gif",
            "https://images.neopets.com/trophies/1347_2.gif",
            "https://images.neopets.com/trophies/1347_1.gif"
        ]
    },
    {
        "name": "Attack of the Gummy Dice",
        "images": [
            "https://images.neopets.com/trophies/685_3.gif",
            "https://images.neopets.com/trophies/685_2.gif",
            "https://images.neopets.com/trophies/685_1.gif"
        ]
    },
    {
        "name": "Attack of the Marblemen",
        "images": [
            "https://images.neopets.com/trophies/201_3.gif",
            "https://images.neopets.com/trophies/201_2.gif",
            "https://images.neopets.com/trophies/201_1.gif"
        ]
    },
    {
        "name": "Attack of the Revenge",
        "images": [
            "https://images.neopets.com/trophies/527_3.gif",
            "https://images.neopets.com/trophies/527_2.gif",
            "https://images.neopets.com/trophies/527_1.gif"
        ]
    },
    {
        "name": "Attack of the Slorgs",
        "images": [
            "https://images.neopets.com/trophies/386_3.gif",
            "https://images.neopets.com/trophies/386_2.gif",
            "https://images.neopets.com/trophies/386_1.gif"
        ]
    },
    {
        "name": "Barf Boat",
        "images": [
            "https://images.neopets.com/trophies/1026_3.gif",
            "https://images.neopets.com/trophies/1026_2.gif",
            "https://images.neopets.com/trophies/1026_1.gif"
        ]
    },
    {
        "name": "Berry Bash",
        "images": [
            "https://images.neopets.com/trophies/968_3.gif",
            "https://images.neopets.com/trophies/968_2.gif",
            "https://images.neopets.com/trophies/968_1.gif"
        ]
    },
    {
        "name": "Biscuit Brigade: Hagan's Last Stand",
        "images": [
            "https://images.neopets.com/trophies/941_3.gif",
            "https://images.neopets.com/trophies/941_2.gif",
            "https://images.neopets.com/trophies/941_1.gif"
        ]
    },
    {
        "name": "Black Pawkeet Slots",
        "images": [
            "https://images.neopets.com/trophies/1099_3.gif",
            "https://images.neopets.com/trophies/1099_2.gif",
            "https://images.neopets.com/trophies/1099_1.gif"
        ]
    },
    {
        "name": "Bouncy Supreme",
        "images": [
            "https://images.neopets.com/trophies/532_3.gif",
            "https://images.neopets.com/trophies/532_2.gif",
            "https://images.neopets.com/trophies/532_1.gif"
        ]
    },
    {
        "name": "Brucey B Slots",
        "images": [
            "https://images.neopets.com/trophies/1121_3.gif",
            "https://images.neopets.com/trophies/1121_2.gif",
            "https://images.neopets.com/trophies/1121_1.gif"
        ]
    },
    {
        "name": "Bruno's Backwoods Breakaway",
        "images": [
            "https://images.neopets.com/trophies/734_3.gif",
            "https://images.neopets.com/trophies/734_2.gif",
            "https://images.neopets.com/trophies/734_1.gif"
        ]
    },
    {
        "name": "Bumble Beams",
        "images": [
            "https://images.neopets.com/trophies/799_3.gif",
            "https://images.neopets.com/trophies/799_2.gif",
            "https://images.neopets.com/trophies/799_1.gif"
        ]
    },
    {
        "name": "Carnival of Terror",
        "images": [
            "https://images.neopets.com/trophies/902_3.gif",
            "https://images.neopets.com/trophies/902_2.gif",
            "https://images.neopets.com/trophies/902_1.gif"
        ]
    },
    {
        "name": "Castle Battles",
        "images": [
            "https://images.neopets.com/trophies/430_3.gif",
            "https://images.neopets.com/trophies/430_2.gif",
            "https://images.neopets.com/trophies/430_1.gif"
        ]
    },
    {
        "name": "Cave Glider",
        "images": [
            "https://images.neopets.com/trophies/1156_3.gif",
            "https://images.neopets.com/trophies/1156_2.gif",
            "https://images.neopets.com/trophies/1156_1.gif"
        ]
    },
    {
        "name": "Caves and Corridors: Mystery Island",
        "images": [
            "https://images.neopets.com/trophies/627_3.gif",
            "https://images.neopets.com/trophies/627_2.gif",
            "https://images.neopets.com/trophies/627_1.gif"
        ]
    },
    {
        "name": "Chariot Chase",
        "images": [
            "https://images.neopets.com/trophies/1148_3.gif",
            "https://images.neopets.com/trophies/1148_2.gif",
            "https://images.neopets.com/trophies/1148_1.gif"
        ]
    },
    {
        "name": "Cheeseroller",
        "images": [
            "https://images.neopets.com/trophies/155_3.gif",
            "https://images.neopets.com/trophies/155_2.gif",
            "https://images.neopets.com/trophies/155_1.gif"
        ]
    },
    {
        "name": "Chemistry for Beginners",
        "images": [
            "https://images.neopets.com/trophies/239_3.gif",
            "https://images.neopets.com/trophies/239_2.gif",
            "https://images.neopets.com/trophies/239_1.gif"
        ]
    },
    {
        "name": "Chia Bomber 2",
        "images": [
            "https://images.neopets.com/trophies/539_3.gif",
            "https://images.neopets.com/trophies/539_2.gif",
            "https://images.neopets.com/trophies/539_1.gif"
        ]
    },
    {
        "name": "Clockwork Codebreaker",
        "images": [
            "https://images.neopets.com/trophies/1173_3.gif",
            "https://images.neopets.com/trophies/1173_2.gif",
            "https://images.neopets.com/trophies/1173_1.gif"
        ]
    },
    {
        "name": "Cloud Raiders",
        "images": [
            "https://images.neopets.com/trophies/1149_3.gif",
            "https://images.neopets.com/trophies/1149_2.gif",
            "https://images.neopets.com/trophies/1149_1.gif"
        ]
    },
    {
        "name": "Coal War Tactics",
        "images": [
            "https://images.neopets.com/trophies/1370_3.gif",
            "https://images.neopets.com/trophies/1370_2.gif",
            "https://images.neopets.com/trophies/1370_1.gif"
        ]
    },
    {
        "name": "Cooty Wars",
        "images": [
            "https://images.neopets.com/trophies/796_3.gif",
            "https://images.neopets.com/trophies/796_2.gif",
            "https://images.neopets.com/trophies/796_1.gif"
        ]
    },
    {
        "name": "Crisis Courier",
        "images": [
            "https://images.neopets.com/trophies/773_3.gif",
            "https://images.neopets.com/trophies/773_2.gif",
            "https://images.neopets.com/trophies/773_1.gif"
        ]
    },
    {
        "name": "Dar-BLAT!!!",
        "images": [
            "https://images.neopets.com/trophies/895_3.gif",
            "https://images.neopets.com/trophies/895_2.gif",
            "https://images.neopets.com/trophies/895_1.gif"
        ]
    },
    {
        "name": "Darigan Dodgeball",
        "images": [
            "https://images.neopets.com/trophies/1139_3.gif",
            "https://images.neopets.com/trophies/1139_2.gif",
            "https://images.neopets.com/trophies/1139_1.gif"
        ]
    },
    {
        "name": "Deckball",
        "images": [
            "https://images.neopets.com/trophies/82_3.gif",
            "https://images.neopets.com/trophies/82_2.gif",
            "https://images.neopets.com/trophies/82_1.gif"
        ]
    },
    {
        "name": "Defender Trainer",
        "images": [
            "https://images.neopets.com/trophies/258_3.gif",
            "https://images.neopets.com/trophies/258_2.gif",
            "https://images.neopets.com/trophies/258_1.gif"
        ]
    },
    {
        "name": "Destruct-O-Match III",
        "images": [
            "https://images.neopets.com/trophies/999_3.gif",
            "https://images.neopets.com/trophies/999_2.gif",
            "https://images.neopets.com/trophies/999_1.gif"
        ]
    },
    {
        "name": "Dice Escape",
        "images": [
            "https://images.neopets.com/trophies/356_3.gif",
            "https://images.neopets.com/trophies/356_2.gif",
            "https://images.neopets.com/trophies/356_1.gif"
        ]
    },
    {
        "name": "Dice of Destiny",
        "images": [
            "https://images.neopets.com/trophies/1126_3.gif",
            "https://images.neopets.com/trophies/1126_2.gif",
            "https://images.neopets.com/trophies/1126_1.gif"
        ]
    },
    {
        "name": "Dice-A-Roo",
        "images": [
            "https://images.neopets.com/trophies/10_3.gif",
            "https://images.neopets.com/trophies/10_2.gif",
            "https://images.neopets.com/trophies/10_1.gif"
        ]
    },
    {
        "name": "Double or Nothing",
        "images": [
            "https://images.neopets.com/trophies/178_3.gif",
            "https://images.neopets.com/trophies/178_2.gif",
            "https://images.neopets.com/trophies/178_1.gif"
        ]
    },
    {
        "name": "Dubloon Disaster",
        "images": [
            "https://images.neopets.com/trophies/772_3.gif",
            "https://images.neopets.com/trophies/772_2.gif",
            "https://images.neopets.com/trophies/772_1.gif"
        ]
    },
    {
        "name": "Dueling Decks",
        "images": [
            "https://images.neopets.com/trophies/1182_3.gif",
            "https://images.neopets.com/trophies/1182_2.gif",
            "https://images.neopets.com/trophies/1182_1.gif"
        ]
    },
    {
        "name": "Dungeon Dash",
        "images": [
            "https://images.neopets.com/trophies/962_3.gif",
            "https://images.neopets.com/trophies/962_2.gif",
            "https://images.neopets.com/trophies/962_1.gif"
        ]
    },
    {
        "name": "Edna's Shadow",
        "images": [
            "https://images.neopets.com/trophies/821_3.gif",
            "https://images.neopets.com/trophies/821_2.gif",
            "https://images.neopets.com/trophies/821_1.gif"
        ]
    },
    {
        "name": "Escape from Meridell Castle",
        "images": [
            "https://images.neopets.com/trophies/197_3.gif",
            "https://images.neopets.com/trophies/197_2.gif",
            "https://images.neopets.com/trophies/197_1.gif"
        ]
    },
    {
        "name": "Escape to Kreludor",
        "images": [
            "https://images.neopets.com/trophies/400_3.gif",
            "https://images.neopets.com/trophies/400_2.gif",
            "https://images.neopets.com/trophies/400_1.gif"
        ]
    },
    {
        "name": "Evil Fuzzles from Beyond the Stars",
        "images": [
            "https://images.neopets.com/trophies/585_3.gif",
            "https://images.neopets.com/trophies/585_2.gif",
            "https://images.neopets.com/trophies/585_1.gif"
        ]
    },
    {
        "name": "Extreme Faerie Cloud Racers",
        "images": [
            "https://images.neopets.com/trophies/1155_3.gif",
            "https://images.neopets.com/trophies/1155_2.gif",
            "https://images.neopets.com/trophies/1155_1.gif"
        ]
    },
    {
        "name": "Extreme Herder",
        "images": [
            "https://images.neopets.com/trophies/149_3.gif",
            "https://images.neopets.com/trophies/149_2.gif",
            "https://images.neopets.com/trophies/149_1.gif"
        ]
    },
    {
        "name": "Extreme Herder 2",
        "images": [
            "https://images.neopets.com/trophies/1117_3.gif",
            "https://images.neopets.com/trophies/1117_2.gif",
            "https://images.neopets.com/trophies/1117_1.gif"
        ]
    },
    {
        "name": "Extreme Potato Counter",
        "images": [
            "https://images.neopets.com/trophies/226_3.gif",
            "https://images.neopets.com/trophies/226_2.gif",
            "https://images.neopets.com/trophies/226_1.gif"
        ]
    },
    {
        "name": "Eye of the Storm",
        "images": [
            "https://images.neopets.com/trophies/720_3.gif",
            "https://images.neopets.com/trophies/720_2.gif",
            "https://images.neopets.com/trophies/720_1.gif"
        ]
    },
    {
        "name": "Faerie Bubbles",
        "images": [
            "https://images.neopets.com/trophies/358_3.gif",
            "https://images.neopets.com/trophies/358_2.gif",
            "https://images.neopets.com/trophies/358_1.gif"
        ]
    },
    {
        "name": "Faerie Caves II - Fyora's Quest",
        "images": [
            "https://images.neopets.com/trophies/489_3.gif",
            "https://images.neopets.com/trophies/489_2.gif",
            "https://images.neopets.com/trophies/489_1.gif"
        ]
    },
    {
        "name": "Faerie Cloud Racers",
        "images": [
            "https://images.neopets.com/trophies/586_3.gif",
            "https://images.neopets.com/trophies/586_2.gif",
            "https://images.neopets.com/trophies/586_1.gif"
        ]
    },
    {
        "name": "Feed Florg",
        "images": [
            "https://images.neopets.com/trophies/645_3.gif",
            "https://images.neopets.com/trophies/645_2.gif",
            "https://images.neopets.com/trophies/645_1.gif"
        ]
    },
    {
        "name": "Fetch!",
        "images": [
            "https://images.neopets.com/trophies/97_3.gif",
            "https://images.neopets.com/trophies/97_2.gif",
            "https://images.neopets.com/trophies/97_1.gif"
        ]
    },
    {
        "name": "Flycatcher",
        "images": [
            "https://images.neopets.com/trophies/570_3.gif",
            "https://images.neopets.com/trophies/570_2.gif",
            "https://images.neopets.com/trophies/570_1.gif"
        ]
    },
    {
        "name": "Freaky Factory",
        "images": [
            "https://images.neopets.com/trophies/390_3.gif",
            "https://images.neopets.com/trophies/390_2.gif",
            "https://images.neopets.com/trophies/390_1.gif"
        ]
    },
    {
        "name": "Frumball",
        "images": [
            "https://images.neopets.com/trophies/313_3.gif",
            "https://images.neopets.com/trophies/313_2.gif",
            "https://images.neopets.com/trophies/313_1.gif"
        ]
    },
    {
        "name": "Gadgadsgame",
        "images": [
            "https://images.neopets.com/trophies/159_3.gif",
            "https://images.neopets.com/trophies/159_2.gif",
            "https://images.neopets.com/trophies/159_1.gif"
        ]
    },
    {
        "name": "Ghost Bopper",
        "images": [
            "https://images.neopets.com/trophies/614_3.gif",
            "https://images.neopets.com/trophies/614_2.gif",
            "https://images.neopets.com/trophies/614_1.gif"
        ]
    },
    {
        "name": "Goparokko",
        "images": [
            "https://images.neopets.com/trophies/887_3.gif",
            "https://images.neopets.com/trophies/887_2.gif",
            "https://images.neopets.com/trophies/887_1.gif"
        ]
    },
    {
        "name": "Gormball",
        "images": [
            "https://images.neopets.com/trophies/6_3.gif",
            "https://images.neopets.com/trophies/6_2.gif",
            "https://images.neopets.com/trophies/6_1.gif"
        ]
    },
    {
        "name": "Gourmet Club Bowls",
        "images": [
            "https://images.neopets.com/trophies/330_3.gif",
            "https://images.neopets.com/trophies/330_2.gif",
            "https://images.neopets.com/trophies/330_1.gif"
        ]
    },
    {
        "name": "Grand Theft Ummagine",
        "images": [
            "https://images.neopets.com/trophies/212_3.gif",
            "https://images.neopets.com/trophies/212_2.gif",
            "https://images.neopets.com/trophies/212_1.gif"
        ]
    },
    {
        "name": "Grarrl Keno",
        "images": [
            "https://images.neopets.com/trophies/48_3.gif",
            "https://images.neopets.com/trophies/48_2.gif",
            "https://images.neopets.com/trophies/48_1.gif"
        ]
    },
    {
        "name": "Gwyl's Great Escape",
        "images": [
            "https://images.neopets.com/trophies/668_3.gif",
            "https://images.neopets.com/trophies/668_2.gif",
            "https://images.neopets.com/trophies/668_1.gif"
        ]
    },
    {
        "name": "Hannah and the Ice Caves",
        "images": [
            "https://images.neopets.com/trophies/473_3.gif",
            "https://images.neopets.com/trophies/473_2.gif",
            "https://images.neopets.com/trophies/473_1.gif"
        ]
    },
    {
        "name": "Hannah and the Kreludor Caves",
        "images": [
            "https://images.neopets.com/trophies/1252_3.gif",
            "https://images.neopets.com/trophies/1252_2.gif",
            "https://images.neopets.com/trophies/1252_1.gif"
        ]
    },
    {
        "name": "Hannah and the Pirate Caves",
        "images": [
            "https://images.neopets.com/trophies/349_3.gif",
            "https://images.neopets.com/trophies/349_2.gif",
            "https://images.neopets.com/trophies/349_1.gif"
        ]
    },
    {
        "name": "Hannah and the Wardrobe of Adventure",
        "images": [
            "https://images.neopets.com/trophies/1229_3.gif",
            "https://images.neopets.com/trophies/1229_2.gif",
            "https://images.neopets.com/trophies/1229_1.gif"
        ]
    },
    {
        "name": "Hasee Bounce",
        "images": [
            "https://images.neopets.com/trophies/368_3.gif",
            "https://images.neopets.com/trophies/368_2.gif",
            "https://images.neopets.com/trophies/368_1.gif"
        ]
    },
    {
        "name": "Hot Dog Hero",
        "images": [
            "https://images.neopets.com/trophies/965_3.gif",
            "https://images.neopets.com/trophies/965_2.gif",
            "https://images.neopets.com/trophies/965_1.gif"
        ]
    },
    {
        "name": "Hubrid's Hero Heist",
        "images": [
            "https://images.neopets.com/trophies/314_3.gif",
            "https://images.neopets.com/trophies/314_2.gif",
            "https://images.neopets.com/trophies/314_1.gif"
        ]
    },
    {
        "name": "Hungry Skeith",
        "images": [
            "https://images.neopets.com/trophies/538_3.gif",
            "https://images.neopets.com/trophies/538_2.gif",
            "https://images.neopets.com/trophies/538_1.gif"
        ]
    },
    {
        "name": "Ice Cream Machine",
        "images": [
            "https://images.neopets.com/trophies/507_3.gif",
            "https://images.neopets.com/trophies/507_2.gif",
            "https://images.neopets.com/trophies/507_1.gif"
        ]
    },
    {
        "name": "Igloo Garage Sale - The Game",
        "images": [
            "https://images.neopets.com/trophies/676_3.gif",
            "https://images.neopets.com/trophies/676_2.gif",
            "https://images.neopets.com/trophies/676_1.gif"
        ]
    },
    {
        "name": "Illusens Glade",
        "images": [
            "https://images.neopets.com/trophies/160_3.gif",
            "https://images.neopets.com/trophies/160_2.gif",
            "https://images.neopets.com/trophies/160_1.gif"
        ]
    },
    {
        "name": "Imperial Exam",
        "images": [
            "https://images.neopets.com/trophies/656_3.gif",
            "https://images.neopets.com/trophies/656_2.gif",
            "https://images.neopets.com/trophies/656_1.gif"
        ]
    },
    {
        "name": "Invasion: Blastoids",
        "images": [
            "https://images.neopets.com/trophies/1330_3.gif",
            "https://images.neopets.com/trophies/1330_2.gif",
            "https://images.neopets.com/trophies/1330_1.gif"
        ]
    },
    {
        "name": "Island Chef Academy",
        "images": [
            "https://images.neopets.com/trophies/1205_3.gif",
            "https://images.neopets.com/trophies/1205_2.gif",
            "https://images.neopets.com/trophies/1205_1.gif"
        ]
    },
    {
        "name": "Itchy Invasion",
        "images": [
            "https://images.neopets.com/trophies/713_3.gif",
            "https://images.neopets.com/trophies/713_2.gif",
            "https://images.neopets.com/trophies/713_1.gif"
        ]
    },
    {
        "name": "Jelly Blobs of Doom",
        "images": [
            "https://images.neopets.com/trophies/359_3.gif",
            "https://images.neopets.com/trophies/359_2.gif",
            "https://images.neopets.com/trophies/359_1.gif"
        ]
    },
    {
        "name": "Jhudoras Bluff",
        "images": [
            "https://images.neopets.com/trophies/126_3.gif",
            "https://images.neopets.com/trophies/126_2.gif",
            "https://images.neopets.com/trophies/126_1.gif"
        ]
    },
    {
        "name": "Jolly Jugglers",
        "images": [
            "https://images.neopets.com/trophies/615_3.gif",
            "https://images.neopets.com/trophies/615_2.gif",
            "https://images.neopets.com/trophies/615_1.gif"
        ]
    },
    {
        "name": "Jubble Bubble",
        "images": [
            "https://images.neopets.com/trophies/619_3.gif",
            "https://images.neopets.com/trophies/619_2.gif",
            "https://images.neopets.com/trophies/619_1.gif"
        ]
    },
    {
        "name": "Jumpin' Gem Heist",
        "images": [
            "https://images.neopets.com/trophies/1191_3.gif",
            "https://images.neopets.com/trophies/1191_2.gif",
            "https://images.neopets.com/trophies/1191_1.gif"
        ]
    },
    {
        "name": "Jungle Raiders",
        "images": [
            "https://images.neopets.com/trophies/1064_3.gif",
            "https://images.neopets.com/trophies/1064_2.gif",
            "https://images.neopets.com/trophies/1064_1.gif"
        ]
    },
    {
        "name": "Kass Basher",
        "images": [
            "https://images.neopets.com/trophies/381_3.gif",
            "https://images.neopets.com/trophies/381_2.gif",
            "https://images.neopets.com/trophies/381_1.gif"
        ]
    },
    {
        "name": "Kiko Match II",
        "images": [
            "https://images.neopets.com/trophies/519_3.gif",
            "https://images.neopets.com/trophies/519_2.gif",
            "https://images.neopets.com/trophies/519_1.gif"
        ]
    },
    {
        "name": "Kiss the Mortog",
        "images": [
            "https://images.neopets.com/trophies/154_3.gif",
            "https://images.neopets.com/trophies/154_2.gif",
            "https://images.neopets.com/trophies/154_1.gif"
        ]
    },
    {
        "name": "Kookia",
        "images": [
            "https://images.neopets.com/trophies/1189_3.gif",
            "https://images.neopets.com/trophies/1189_2.gif",
            "https://images.neopets.com/trophies/1189_1.gif"
        ]
    },
    {
        "name": "Korbats Lab",
        "images": [
            "https://images.neopets.com/trophies/801_3.gif",
            "https://images.neopets.com/trophies/801_2.gif",
            "https://images.neopets.com/trophies/801_1.gif"
        ]
    },
    {
        "name": "Kou-Jong",
        "images": [
            "https://images.neopets.com/trophies/707_3.gif",
            "https://images.neopets.com/trophies/707_2.gif",
            "https://images.neopets.com/trophies/707_1.gif"
        ]
    },
    {
        "name": "Kreludan Mining Corp.",
        "images": [
            "https://images.neopets.com/trophies/404_3.gif",
            "https://images.neopets.com/trophies/404_2.gif",
            "https://images.neopets.com/trophies/404_1.gif"
        ]
    },
    {
        "name": "Legends of Pinball",
        "images": [
            "https://images.neopets.com/trophies/1118_3.gif",
            "https://images.neopets.com/trophies/1118_2.gif",
            "https://images.neopets.com/trophies/1118_1.gif"
        ]
    },
    {
        "name": "Let It Slide",
        "images": [
            "https://images.neopets.com/trophies/970_3.gif",
            "https://images.neopets.com/trophies/970_2.gif",
            "https://images.neopets.com/trophies/970_1.gif"
        ]
    },
    {
        "name": "Lost City Lanes",
        "images": [
            "https://images.neopets.com/trophies/1108_3.gif",
            "https://images.neopets.com/trophies/1108_2.gif",
            "https://images.neopets.com/trophies/1108_1.gif"
        ]
    },
    {
        "name": "Lost in Space Fungus",
        "images": [
            "https://images.neopets.com/trophies/774_3.gif",
            "https://images.neopets.com/trophies/774_2.gif",
            "https://images.neopets.com/trophies/774_1.gif"
        ]
    },
    {
        "name": "MAGAX: Destroyer II",
        "images": [
            "https://images.neopets.com/trophies/763_3.gif",
            "https://images.neopets.com/trophies/763_2.gif",
            "https://images.neopets.com/trophies/763_1.gif"
        ]
    },
    {
        "name": "Magma Blaster",
        "images": [
            "https://images.neopets.com/trophies/571_3.gif",
            "https://images.neopets.com/trophies/571_2.gif",
            "https://images.neopets.com/trophies/571_1.gif"
        ]
    },
    {
        "name": "Maths Nightmare",
        "images": [
            "https://images.neopets.com/trophies/885_3.gif",
            "https://images.neopets.com/trophies/885_2.gif",
            "https://images.neopets.com/trophies/885_1.gif"
        ]
    },
    {
        "name": "Meepit Juice Break",
        "images": [
            "https://images.neopets.com/trophies/379_3.gif",
            "https://images.neopets.com/trophies/379_2.gif",
            "https://images.neopets.com/trophies/379_1.gif"
        ]
    },
    {
        "name": "Meepit vs. Feepit",
        "images": [
            "https://images.neopets.com/trophies/540_3.gif",
            "https://images.neopets.com/trophies/540_2.gif",
            "https://images.neopets.com/trophies/540_1.gif"
        ]
    },
    {
        "name": "Meerca Chase II",
        "images": [
            "https://images.neopets.com/trophies/500_3.gif",
            "https://images.neopets.com/trophies/500_2.gif",
            "https://images.neopets.com/trophies/500_1.gif"
        ]
    },
    {
        "name": "Moon Rock Rampage",
        "images": [
            "https://images.neopets.com/trophies/444_3.gif",
            "https://images.neopets.com/trophies/444_2.gif",
            "https://images.neopets.com/trophies/444_1.gif"
        ]
    },
    {
        "name": "Mootix Drop",
        "images": [
            "https://images.neopets.com/trophies/396_3.gif",
            "https://images.neopets.com/trophies/396_2.gif",
            "https://images.neopets.com/trophies/396_1.gif"
        ]
    },
    {
        "name": "Mop 'n' Bop",
        "images": [
            "https://images.neopets.com/trophies/904_3.gif",
            "https://images.neopets.com/trophies/904_2.gif",
            "https://images.neopets.com/trophies/904_1.gif"
        ]
    },
    {
        "name": "Mutant Graveyard of Doom II",
        "images": [
            "https://images.neopets.com/trophies/1042_3.gif",
            "https://images.neopets.com/trophies/1042_2.gif",
            "https://images.neopets.com/trophies/1042_1.gif"
        ]
    },
    {
        "name": "Mynci Beach Volleyball",
        "images": [
            "https://images.neopets.com/trophies/315_3.gif",
            "https://images.neopets.com/trophies/315_2.gif",
            "https://images.neopets.com/trophies/315_1.gif"
        ]
    },
    {
        "name": "NeggSweeper",
        "images": [
            "https://images.neopets.com/trophies/54_3.gif",
            "https://images.neopets.com/trophies/54_2.gif",
            "https://images.neopets.com/trophies/54_1.gif"
        ]
    },
    {
        "name": "NeoQuest II Race",
        "images": [
            "https://images.neopets.com/trophies/373_3.gif",
            "https://images.neopets.com/trophies/373_2.gif",
            "https://images.neopets.com/trophies/373_1.gif"
        ]
    },
    {
        "name": "Neopian Battlefield Legends",
        "images": [
            "https://images.neopets.com/trophies/1221_3.gif",
            "https://images.neopets.com/trophies/1221_2.gif",
            "https://images.neopets.com/trophies/1221_1.gif"
        ]
    },
    {
        "name": "Neverending Boss Battle",
        "images": [
            "https://images.neopets.com/trophies/552_3.gif",
            "https://images.neopets.com/trophies/552_2.gif",
            "https://images.neopets.com/trophies/552_1.gif"
        ]
    },
    {
        "name": "Nimmos Pond",
        "images": [
            "https://images.neopets.com/trophies/1048_3.gif",
            "https://images.neopets.com/trophies/1048_2.gif",
            "https://images.neopets.com/trophies/1048_1.gif"
        ]
    },
    {
        "name": "Nova Defender",
        "images": [
            "https://images.neopets.com/trophies/1223_3.gif",
            "https://images.neopets.com/trophies/1223_2.gif",
            "https://images.neopets.com/trophies/1223_1.gif"
        ]
    },
    {
        "name": "Pakiko",
        "images": [
            "https://images.neopets.com/trophies/1369_3.gif",
            "https://images.neopets.com/trophies/1369_2.gif",
            "https://images.neopets.com/trophies/1369_1.gif"
        ]
    },
    {
        "name": "Petpet Battles",
        "images": [
            "https://images.neopets.com/trophies/231_3.gif",
            "https://images.neopets.com/trophies/231_2.gif",
            "https://images.neopets.com/trophies/231_1.gif"
        ]
    },
    {
        "name": "Petpet Cannonball",
        "images": [
            "https://images.neopets.com/trophies/553_3.gif",
            "https://images.neopets.com/trophies/553_2.gif",
            "https://images.neopets.com/trophies/553_1.gif"
        ]
    },
    {
        "name": "Petpet Plunge",
        "images": [
            "https://images.neopets.com/trophies/1078_3.gif",
            "https://images.neopets.com/trophies/1078_2.gif",
            "https://images.neopets.com/trophies/1078_1.gif"
        ]
    },
    {
        "name": "Petpet Rescue",
        "images": [
            "https://images.neopets.com/trophies/228_3.gif",
            "https://images.neopets.com/trophies/228_2.gif",
            "https://images.neopets.com/trophies/228_1.gif"
        ]
    },
    {
        "name": "Petpetsitter",
        "images": [
            "https://images.neopets.com/trophies/428_3.gif",
            "https://images.neopets.com/trophies/428_2.gif",
            "https://images.neopets.com/trophies/428_1.gif"
        ]
    },
    {
        "name": "Piper Panic",
        "images": [
            "https://images.neopets.com/trophies/973_3.gif",
            "https://images.neopets.com/trophies/973_2.gif",
            "https://images.neopets.com/trophies/973_1.gif"
        ]
    },
    {
        "name": "Pterattack",
        "images": [
            "https://images.neopets.com/trophies/587_3.gif",
            "https://images.neopets.com/trophies/587_2.gif",
            "https://images.neopets.com/trophies/587_1.gif"
        ]
    },
    {
        "name": "Raiders of Maraqua",
        "images": [
            "https://images.neopets.com/trophies/248_3.gif",
            "https://images.neopets.com/trophies/248_2.gif",
            "https://images.neopets.com/trophies/248_1.gif"
        ]
    },
    {
        "name": "Ready to Roll",
        "images": [
            "https://images.neopets.com/trophies/934_3.gif",
            "https://images.neopets.com/trophies/934_2.gif",
            "https://images.neopets.com/trophies/934_1.gif"
        ]
    },
    {
        "name": "Revel Roundup",
        "images": [
            "https://images.neopets.com/trophies/794_3.gif",
            "https://images.neopets.com/trophies/794_2.gif",
            "https://images.neopets.com/trophies/794_1.gif"
        ]
    },
    {
        "name": "Rink Runner",
        "images": [
            "https://images.neopets.com/trophies/220_3.gif",
            "https://images.neopets.com/trophies/220_2.gif",
            "https://images.neopets.com/trophies/220_1.gif"
        ]
    },
    {
        "name": "Roodoku",
        "images": [
            "https://images.neopets.com/trophies/820_3.gif",
            "https://images.neopets.com/trophies/820_2.gif",
            "https://images.neopets.com/trophies/820_1.gif"
        ]
    },
    {
        "name": "Round Table Poker",
        "images": [
            "https://images.neopets.com/trophies/177_3.gif",
            "https://images.neopets.com/trophies/177_2.gif",
            "https://images.neopets.com/trophies/177_1.gif"
        ]
    },
    {
        "name": "Ruins Rampage",
        "images": [
            "https://images.neopets.com/trophies/600_3.gif",
            "https://images.neopets.com/trophies/600_2.gif",
            "https://images.neopets.com/trophies/600_1.gif"
        ]
    },
    {
        "name": "S.M.E.L.T.",
        "images": [
            "https://images.neopets.com/trophies/1292_3.gif",
            "https://images.neopets.com/trophies/1292_2.gif",
            "https://images.neopets.com/trophies/1292_1.gif"
        ]
    },
    {
        "name": "Scarab 21",
        "images": [
            "https://images.neopets.com/trophies/70_3.gif",
            "https://images.neopets.com/trophies/70_2.gif",
            "https://images.neopets.com/trophies/70_1.gif"
        ]
    },
    {
        "name": "Scorchy Slots",
        "images": [
            "https://images.neopets.com/trophies/8_3.gif",
            "https://images.neopets.com/trophies/8_2.gif",
            "https://images.neopets.com/trophies/8_1.gif"
        ]
    },
    {
        "name": "Scourge of the Lab Jellies",
        "images": [
            "https://images.neopets.com/trophies/760_3.gif",
            "https://images.neopets.com/trophies/760_2.gif",
            "https://images.neopets.com/trophies/760_1.gif"
        ]
    },
    {
        "name": "Sewage Surfer",
        "images": [
            "https://images.neopets.com/trophies/157_3.gif",
            "https://images.neopets.com/trophies/157_2.gif",
            "https://images.neopets.com/trophies/157_1.gif"
        ]
    },
    {
        "name": "Shapeshifter",
        "images": [
            "https://images.neopets.com/trophies/151_3.gif",
            "https://images.neopets.com/trophies/151_2.gif",
            "https://images.neopets.com/trophies/151_1.gif"
        ]
    },
    {
        "name": "Shenkuu River Rush",
        "images": [
            "https://images.neopets.com/trophies/877_3.gif",
            "https://images.neopets.com/trophies/877_2.gif",
            "https://images.neopets.com/trophies/877_1.gif"
        ]
    },
    {
        "name": "Shenkuu Tangram",
        "images": [
            "https://images.neopets.com/trophies/1075_3.gif",
            "https://images.neopets.com/trophies/1075_2.gif",
            "https://images.neopets.com/trophies/1075_1.gif"
        ]
    },
    {
        "name": "Shenkuu Warrior",
        "images": [
            "https://images.neopets.com/trophies/786_3.gif",
            "https://images.neopets.com/trophies/786_2.gif",
            "https://images.neopets.com/trophies/786_1.gif"
        ]
    },
    {
        "name": "Shenkuu Warrior II",
        "images": [
            "https://images.neopets.com/trophies/1266_3.gif",
            "https://images.neopets.com/trophies/1266_2.gif",
            "https://images.neopets.com/trophies/1266_1.gif"
        ]
    },
    {
        "name": "Skies Over Meridell",
        "images": [
            "https://images.neopets.com/trophies/340_3.gif",
            "https://images.neopets.com/trophies/340_2.gif",
            "https://images.neopets.com/trophies/340_1.gif"
        ]
    },
    {
        "name": "Slorgs in Space",
        "images": [
            "https://images.neopets.com/trophies/1146_3.gif",
            "https://images.neopets.com/trophies/1146_2.gif",
            "https://images.neopets.com/trophies/1146_1.gif"
        ]
    },
    {
        "name": "Smug Bug Smite",
        "images": [
            "https://images.neopets.com/trophies/933_3.gif",
            "https://images.neopets.com/trophies/933_2.gif",
            "https://images.neopets.com/trophies/933_1.gif"
        ]
    },
    {
        "name": "Snot Splatter",
        "images": [
            "https://images.neopets.com/trophies/1100_3.gif",
            "https://images.neopets.com/trophies/1100_2.gif",
            "https://images.neopets.com/trophies/1100_1.gif"
        ]
    },
    {
        "name": "Snow Roller",
        "images": [
            "https://images.neopets.com/trophies/1076_3.gif",
            "https://images.neopets.com/trophies/1076_2.gif",
            "https://images.neopets.com/trophies/1076_1.gif"
        ]
    },
    {
        "name": "Snow Wars II",
        "images": [
            "https://images.neopets.com/trophies/544_3.gif",
            "https://images.neopets.com/trophies/544_2.gif",
            "https://images.neopets.com/trophies/544_1.gif"
        ]
    },
    {
        "name": "Snowball Fight",
        "images": [
            "https://images.neopets.com/trophies/633_3.gif",
            "https://images.neopets.com/trophies/633_2.gif",
            "https://images.neopets.com/trophies/633_1.gif"
        ]
    },
    {
        "name": "Snowbeast Snackrifice",
        "images": [
            "https://images.neopets.com/trophies/818_3.gif",
            "https://images.neopets.com/trophies/818_2.gif",
            "https://images.neopets.com/trophies/818_1.gif"
        ]
    },
    {
        "name": "Snowmuncher",
        "images": [
            "https://images.neopets.com/trophies/412_3.gif",
            "https://images.neopets.com/trophies/412_2.gif",
            "https://images.neopets.com/trophies/412_1.gif"
        ]
    },
    {
        "name": "Sophie's Stew",
        "images": [
            "https://images.neopets.com/trophies/659_3.gif",
            "https://images.neopets.com/trophies/659_2.gif",
            "https://images.neopets.com/trophies/659_1.gif"
        ]
    },
    {
        "name": "Sorcerers' Skirmish",
        "images": [
            "https://images.neopets.com/trophies/1202_3.gif",
            "https://images.neopets.com/trophies/1202_2.gif",
            "https://images.neopets.com/trophies/1202_1.gif"
        ]
    },
    {
        "name": "Spacerocked!",
        "images": [
            "https://images.neopets.com/trophies/964_3.gif",
            "https://images.neopets.com/trophies/964_2.gif",
            "https://images.neopets.com/trophies/964_1.gif"
        ]
    },
    {
        "name": "Spell-Or-Starve",
        "images": [
            "https://images.neopets.com/trophies/202_3.gif",
            "https://images.neopets.com/trophies/202_2.gif",
            "https://images.neopets.com/trophies/202_1.gif"
        ]
    },
    {
        "name": "Spellseeker",
        "images": [
            "https://images.neopets.com/trophies/1157_3.gif",
            "https://images.neopets.com/trophies/1157_2.gif",
            "https://images.neopets.com/trophies/1157_1.gif"
        ]
    },
    {
        "name": "Spinacles",
        "images": [
            "https://images.neopets.com/trophies/1134_3.gif",
            "https://images.neopets.com/trophies/1134_2.gif",
            "https://images.neopets.com/trophies/1134_1.gif"
        ]
    },
    {
        "name": "Splat-A-Sloth",
        "images": [
            "https://images.neopets.com/trophies/81_3.gif",
            "https://images.neopets.com/trophies/81_2.gif",
            "https://images.neopets.com/trophies/81_1.gif"
        ]
    },
    {
        "name": "Stowaway Sting",
        "images": [
            "https://images.neopets.com/trophies/852_3.gif",
            "https://images.neopets.com/trophies/852_2.gif",
            "https://images.neopets.com/trophies/852_1.gif"
        ]
    },
    {
        "name": "Super Hasee Bounce",
        "images": [
            "https://images.neopets.com/trophies/1061_3.gif",
            "https://images.neopets.com/trophies/1061_2.gif",
            "https://images.neopets.com/trophies/1061_1.gif"
        ]
    },
    {
        "name": "Sutek's Tomb",
        "images": [
            "https://images.neopets.com/trophies/306_3.gif",
            "https://images.neopets.com/trophies/306_2.gif",
            "https://images.neopets.com/trophies/306_1.gif"
        ]
    },
    {
        "name": "Swarm - The Bugs Strike Back",
        "images": [
            "https://images.neopets.com/trophies/562_3.gif",
            "https://images.neopets.com/trophies/562_2.gif",
            "https://images.neopets.com/trophies/562_1.gif"
        ]
    },
    {
        "name": "Techo Says",
        "images": [
            "https://images.neopets.com/trophies/1000_3.gif",
            "https://images.neopets.com/trophies/1000_2.gif",
            "https://images.neopets.com/trophies/1000_1.gif"
        ]
    },
    {
        "name": "Terror Mountain Tilt",
        "images": [
            "https://images.neopets.com/trophies/925_3.gif",
            "https://images.neopets.com/trophies/925_2.gif",
            "https://images.neopets.com/trophies/925_1.gif"
        ]
    },
    {
        "name": "The Buzzer Game",
        "images": [
            "https://images.neopets.com/trophies/307_3.gif",
            "https://images.neopets.com/trophies/307_2.gif",
            "https://images.neopets.com/trophies/307_1.gif"
        ]
    },
    {
        "name": "The Castle of Eliv Thade",
        "images": [
            "https://images.neopets.com/trophies/230_3.gif",
            "https://images.neopets.com/trophies/230_2.gif",
            "https://images.neopets.com/trophies/230_1.gif"
        ]
    },
    {
        "name": "The Great Desert Race",
        "images": [
            "https://images.neopets.com/trophies/830_3.gif",
            "https://images.neopets.com/trophies/830_2.gif",
            "https://images.neopets.com/trophies/830_1.gif"
        ]
    },
    {
        "name": "The Great Qasalan Caper",
        "images": [
            "https://images.neopets.com/trophies/660_3.gif",
            "https://images.neopets.com/trophies/660_2.gif",
            "https://images.neopets.com/trophies/660_1.gif"
        ]
    },
    {
        "name": "The Last Blast",
        "images": [
            "https://images.neopets.com/trophies/926_3.gif",
            "https://images.neopets.com/trophies/926_2.gif",
            "https://images.neopets.com/trophies/926_1.gif"
        ]
    },
    {
        "name": "The Return of the Return of Dr. Sloth",
        "images": [
            "https://images.neopets.com/trophies/480_3.gif",
            "https://images.neopets.com/trophies/480_2.gif",
            "https://images.neopets.com/trophies/480_1.gif"
        ]
    },
    {
        "name": "The Search for Princess Lunara",
        "images": [
            "https://images.neopets.com/trophies/874_3.gif",
            "https://images.neopets.com/trophies/874_2.gif",
            "https://images.neopets.com/trophies/874_1.gif"
        ]
    },
    {
        "name": "The Usul Suspects",
        "images": [
            "https://images.neopets.com/trophies/789_3.gif",
            "https://images.neopets.com/trophies/789_2.gif",
            "https://images.neopets.com/trophies/789_1.gif"
        ]
    },
    {
        "name": "Time Tunnel",
        "images": [
            "https://images.neopets.com/trophies/536_3.gif",
            "https://images.neopets.com/trophies/536_2.gif",
            "https://images.neopets.com/trophies/536_1.gif"
        ]
    },
    {
        "name": "TNT Staff Smasher",
        "images": [
            "https://images.neopets.com/trophies/198_3.gif",
            "https://images.neopets.com/trophies/198_2.gif",
            "https://images.neopets.com/trophies/198_1.gif"
        ]
    },
    {
        "name": "Top Chop",
        "images": [
            "https://images.neopets.com/trophies/1095_3.gif",
            "https://images.neopets.com/trophies/1095_2.gif",
            "https://images.neopets.com/trophies/1095_1.gif"
        ]
    },
    {
        "name": "Toy Box Escape",
        "images": [
            "https://images.neopets.com/trophies/367_3.gif",
            "https://images.neopets.com/trophies/367_2.gif",
            "https://images.neopets.com/trophies/367_1.gif"
        ]
    },
    {
        "name": "Trouble at the National Neopian",
        "images": [
            "https://images.neopets.com/trophies/371_3.gif",
            "https://images.neopets.com/trophies/371_2.gif",
            "https://images.neopets.com/trophies/371_1.gif"
        ]
    },
    {
        "name": "Tubular Kiko Racing",
        "images": [
            "https://images.neopets.com/trophies/606_3.gif",
            "https://images.neopets.com/trophies/606_2.gif",
            "https://images.neopets.com/trophies/606_1.gif"
        ]
    },
    {
        "name": "Tug 'O' War",
        "images": [
            "https://images.neopets.com/trophies/909_3.gif",
            "https://images.neopets.com/trophies/909_2.gif",
            "https://images.neopets.com/trophies/909_1.gif"
        ]
    },
    {
        "name": "Tunnel Tumble",
        "images": [
            "https://images.neopets.com/trophies/1175_3.gif",
            "https://images.neopets.com/trophies/1175_2.gif",
            "https://images.neopets.com/trophies/1175_1.gif"
        ]
    },
    {
        "name": "Turmac Roll",
        "images": [
            "https://images.neopets.com/trophies/366_3.gif",
            "https://images.neopets.com/trophies/366_2.gif",
            "https://images.neopets.com/trophies/366_1.gif"
        ]
    },
    {
        "name": "Typing Terror",
        "images": [
            "https://images.neopets.com/trophies/574_3.gif",
            "https://images.neopets.com/trophies/574_2.gif",
            "https://images.neopets.com/trophies/574_1.gif"
        ]
    },
    {
        "name": "Tyrannian Mini Golf",
        "images": [
            "https://images.neopets.com/trophies/648_3.gif",
            "https://images.neopets.com/trophies/648_2.gif",
            "https://images.neopets.com/trophies/648_1.gif"
        ]
    },
    {
        "name": "Tyranu Evavu",
        "images": [
            "https://images.neopets.com/trophies/47_3.gif",
            "https://images.neopets.com/trophies/47_2.gif",
            "https://images.neopets.com/trophies/47_1.gif"
        ]
    },
    {
        "name": "Ugga Drop",
        "images": [
            "https://images.neopets.com/trophies/1204_3.gif",
            "https://images.neopets.com/trophies/1204_2.gif",
            "https://images.neopets.com/trophies/1204_1.gif"
        ]
    },
    {
        "name": "Ugga Smash",
        "images": [
            "https://images.neopets.com/trophies/726_3.gif",
            "https://images.neopets.com/trophies/726_2.gif",
            "https://images.neopets.com/trophies/726_1.gif"
        ]
    },
    {
        "name": "Ultimate Bullseye II",
        "images": [
            "https://images.neopets.com/trophies/903_3.gif",
            "https://images.neopets.com/trophies/903_2.gif",
            "https://images.neopets.com/trophies/903_1.gif"
        ]
    },
    {
        "name": "Usuki Frenzy",
        "images": [
            "https://images.neopets.com/trophies/884_3.gif",
            "https://images.neopets.com/trophies/884_2.gif",
            "https://images.neopets.com/trophies/884_1.gif"
        ]
    },
    {
        "name": "Volcano Run II",
        "images": [
            "https://images.neopets.com/trophies/761_3.gif",
            "https://images.neopets.com/trophies/761_2.gif",
            "https://images.neopets.com/trophies/761_1.gif"
        ]
    },
    {
        "name": "Warf Rescue Team",
        "images": [
            "https://images.neopets.com/trophies/305_3.gif",
            "https://images.neopets.com/trophies/305_2.gif",
            "https://images.neopets.com/trophies/305_1.gif"
        ]
    },
    {
        "name": "Web of Vernax",
        "images": [
            "https://images.neopets.com/trophies/353_3.gif",
            "https://images.neopets.com/trophies/353_2.gif",
            "https://images.neopets.com/trophies/353_1.gif"
        ]
    },
    {
        "name": "Wheeler's Wild Ride",
        "images": [
            "https://images.neopets.com/trophies/1080_3.gif",
            "https://images.neopets.com/trophies/1080_2.gif",
            "https://images.neopets.com/trophies/1080_1.gif"
        ]
    },
    {
        "name": "Whirlpool",
        "images": [
            "https://images.neopets.com/trophies/927_3.gif",
            "https://images.neopets.com/trophies/927_2.gif",
            "https://images.neopets.com/trophies/927_1.gif"
        ]
    },
    {
        "name": "Wicked Wocky Wobble",
        "images": [
            "https://images.neopets.com/trophies/881_3.gif",
            "https://images.neopets.com/trophies/881_2.gif",
            "https://images.neopets.com/trophies/881_1.gif"
        ]
    },
    {
        "name": "Wingoball",
        "images": [
            "https://images.neopets.com/trophies/771_3.gif",
            "https://images.neopets.com/trophies/771_2.gif",
            "https://images.neopets.com/trophies/771_1.gif"
        ]
    },
    {
        "name": "Word Poker",
        "images": [
            "https://images.neopets.com/trophies/229_3.gif",
            "https://images.neopets.com/trophies/229_2.gif",
            "https://images.neopets.com/trophies/229_1.gif"
        ]
    },
    {
        "name": "Word Pyramid",
        "images": [
            "https://images.neopets.com/trophies/575_3.gif",
            "https://images.neopets.com/trophies/575_2.gif",
            "https://images.neopets.com/trophies/575_1.gif"
        ]
    },
    {
        "name": "Wrath of the Snowager",
        "images": [
            "https://images.neopets.com/trophies/1269_3.gif",
            "https://images.neopets.com/trophies/1269_2.gif",
            "https://images.neopets.com/trophies/1269_1.gif"
        ]
    },
    {
        "name": "Zurroball",
        "images": [
            "https://images.neopets.com/trophies/207_3.gif",
            "https://images.neopets.com/trophies/207_2.gif",
            "https://images.neopets.com/trophies/207_1.gif"
        ]
    }
];

const cumulativeHighScoreTrophies = [
    {
        "name": "NeggSweeper Cumulative",
        "images": [
            "https://images.neopets.com/trophies/84_3.gif",
            "https://images.neopets.com/trophies/84_2.gif",
            "https://images.neopets.com/trophies/84_1.gif"
        ]
    },
    {
        "name": "Pyramids",
        "images": [
            "https://images.neopets.com/trophies/67_3.gif",
            "https://images.neopets.com/trophies/67_2.gif",
            "https://images.neopets.com/trophies/67_1.gif"
        ]
    },
    {
        "name": "Sakhmet Solitaire",
        "images": [
            "https://images.neopets.com/trophies/76_3.gif",
            "https://images.neopets.com/trophies/76_2.gif",
            "https://images.neopets.com/trophies/76_1.gif"
        ]
    },
    {
        "name": "Scarab 21 Cumulative",
        "images": [
            "https://images.neopets.com/trophies/69_3.gif",
            "https://images.neopets.com/trophies/69_2.gif",
            "https://images.neopets.com/trophies/69_1.gif"
        ]
    },
    {
        "name": "Slots Big Losers",
        "images": [
            "https://images.neopets.com/trophies/448_3.gif",
            "https://images.neopets.com/trophies/448_2.gif",
            "https://images.neopets.com/trophies/448_1.gif"
        ]
    }
];

const otherHighScoreTrophies = [
    {
        "name": "Angry Tax Beast",
        "images": [
            "https://images.neopets.com/trophies/487_3.gif",
            "https://images.neopets.com/trophies/487_2.gif",
            "https://images.neopets.com/trophies/487_1.gif"
        ]
    },
    {
        "name": "Brain Tree Quest",
        "images": [
            "https://images.neopets.com/trophies/75_3.gif",
            "https://images.neopets.com/trophies/75_2.gif",
            "https://images.neopets.com/trophies/75_1.gif"
        ]
    },
    {
        "name": "Card Collector",
        "images": [
            "https://images.neopets.com/trophies/1329_3.gif",
            "https://images.neopets.com/trophies/1329_2.gif",
            "https://images.neopets.com/trophies/1329_1.gif"
        ]
    },
    {
        "name": "Food Club",
        "images": [
            "https://images.neopets.com/trophies/88_3.gif",
            "https://images.neopets.com/trophies/88_2.gif",
            "https://images.neopets.com/trophies/88_1.gif"
        ]
    },
    {
        "name": "Grumpy Old King",
        "images": [
            "https://images.neopets.com/trophies/218_3.gif",
            "https://images.neopets.com/trophies/218_2.gif",
            "https://images.neopets.com/trophies/218_1.gif"
        ]
    },
    {
        "name": "NeoBoard Avatar Collector",
        "images": [
            "https://images.neopets.com/trophies/342_3.gif",
            "https://images.neopets.com/trophies/342_2.gif",
            "https://images.neopets.com/trophies/342_1.gif"
        ]
    },
    {
        "name": "Sloth's Invasion Tax",
        "images": [
            "https://images.neopets.com/trophies/341_3.gif",
            "https://images.neopets.com/trophies/341_2.gif",
            "https://images.neopets.com/trophies/341_1.gif"
        ]
    },
    {
        "name": "Stamp Collector",
        "images": [
            "https://images.neopets.com/trophies/346_3.gif",
            "https://images.neopets.com/trophies/346_2.gif",
            "https://images.neopets.com/trophies/346_1.gif"
        ]
    },
    {
        "name": "Tax Beast",
        "images": [
            "https://images.neopets.com/trophies/196_3.gif",
            "https://images.neopets.com/trophies/196_2.gif",
            "https://images.neopets.com/trophies/196_1.gif"
        ]
    },
    {
        "name": "Test Your Strength",
        "images": [
            "https://images.neopets.com/trophies/331_3.gif",
            "https://images.neopets.com/trophies/331_2.gif",
            "https://images.neopets.com/trophies/331_1.gif"
        ]
    },
    {
        "name": "Vending Machine",
        "images": [
            "https://images.neopets.com/trophies/36_3.gif",
            "https://images.neopets.com/trophies/36_2.gif",
            "https://images.neopets.com/trophies/36_1.gif"
        ]
    },
    {
        "name": "Wise Old King",
        "images": [
            "https://images.neopets.com/trophies/493_3.gif",
            "https://images.neopets.com/trophies/493_2.gif",
            "https://images.neopets.com/trophies/493_1.gif"
        ]
    }
];

const pvpTrophies = [
    {
        "name": "Armada",
        "images": [
            "https://images.neopets.com/trophies/18_3.gif",
            "https://images.neopets.com/trophies/18_2.gif",
            "https://images.neopets.com/trophies/18_1.gif"
        ]
    },
    {
        "name": "Geos",
        "images": [
            "https://images.neopets.com/trophies/113_3.gif",
            "https://images.neopets.com/trophies/113_2.gif",
            "https://images.neopets.com/trophies/113_1.gif"
        ]
    },
    {
        "name": "Kacheekers",
        "images": [
            "https://images.neopets.com/trophies/111_3.gif",
            "https://images.neopets.com/trophies/111_2.gif",
            "https://images.neopets.com/trophies/111_1.gif"
        ]
    }
];

const nonCompetitiveTrophies = [
    {
        "name": "Beating Punchbag Bob",
        "images": [
            "https://images.neopets.com/trophies/115_1.gif"
        ]
    },
    {
        "name": "Cellblock",
        "images": [
            "https://images.neopets.com/trophies/216_3.gif",
            "https://images.neopets.com/trophies/216_2.gif",
            "https://images.neopets.com/trophies/216_1.gif"
        ]
    },
    {
        "name": "Cheat!",
        "images": [
            "https://images.neopets.com/trophies/109_3.gif",
            "https://images.neopets.com/trophies/109_2.gif",
            "https://images.neopets.com/trophies/109_1.gif"
        ]
    },
    {
        "name": "Cosy Campfire Collection",
        "images": [
            "https://images.neopets.com/trophies/1409_3.gif",
            "https://images.neopets.com/trophies/1409_2.gif",
            "https://images.neopets.com/trophies/1409_1.gif"
        ]
    },
    {
        "name": "Go! Go! Go!",
        "images": [
            "https://images.neopets.com/trophies/108_3.gif",
            "https://images.neopets.com/trophies/108_2.gif",
            "https://images.neopets.com/trophies/108_1.gif"
        ]
    },
    {
        "name": "The Neopian Lottery",
        "images": [
            "https://images.neopets.com/trophies/58_3.gif",
            "https://images.neopets.com/trophies/58_2.gif",
            "https://images.neopets.com/trophies/58_1.gif"
        ]
    },
    {
        "name": "NeoQuest",
        "images": [
            "https://images.neopets.com/trophies/91_3.gif",
            "https://images.neopets.com/trophies/91_2.gif",
            "https://images.neopets.com/trophies/91_1.gif"
        ]
    },
    {
        "name": "NeoQuest II",
        "images": [
            "https://images.neopets.com/trophies/372_3.gif",
            "https://images.neopets.com/trophies/372_2.gif",
            "https://images.neopets.com/trophies/372_1.gif"
        ]
    },
    {
        "name": "Plushie Tycoon",
        "images": [
            "https://images.neopets.com/trophies/170_3.gif",
            "https://images.neopets.com/trophies/170_2.gif",
            "https://images.neopets.com/trophies/170_1.gif"
        ]
    },
    {
        "name": "Pyramid Bonus",
        "images": [
            "https://images.neopets.com/trophies/68_3.gif",
            "https://images.neopets.com/trophies/68_2.gif",
            "https://images.neopets.com/trophies/68_1.gif"
        ]
    },
    {
        "name": "Sakhmet Solitaire Bonus",
        "images": [
            "https://images.neopets.com/trophies/77_3.gif",
            "https://images.neopets.com/trophies/77_2.gif",
            "https://images.neopets.com/trophies/77_1.gif"
        ]
    },
    {
        "name": "Snow Wars",
        "images": [
            "https://images.neopets.com/trophies/55_3.gif",
            "https://images.neopets.com/trophies/55_2.gif",
            "https://images.neopets.com/trophies/55_1.gif"
        ]
    }
];

const retiredGameTrophies = [
    {
        "name": "200m Peanut Dash",
        "images": [
            "https://images.neopets.com/trophies/189_3.gif",
            "https://images.neopets.com/trophies/189_2.gif",
            "https://images.neopets.com/trophies/189_1.gif"
        ]
    },
    {
        "name": "Aisha Puzzle",
        "images": [
            "https://images.neopets.com/trophies/21_3.gif",
            "https://images.neopets.com/trophies/21_2.gif",
            "https://images.neopets.com/trophies/21_1.gif"
        ]
    },
    {
        "name": "Alien Invasion",
        "images": [
            "https://images.neopets.com/trophies/4_3.gif",
            "https://images.neopets.com/trophies/4_2.gif",
            "https://images.neopets.com/trophies/4_1.gif"
        ]
    },
    {
        "name": "Alpine Challenge",
        "images": [
            "https://images.neopets.com/trophies/35_3.gif",
            "https://images.neopets.com/trophies/35_2.gif",
            "https://images.neopets.com/trophies/35_1.gif"
        ]
    },
    {
        "name": "Balthazar Basher",
        "images": [
            "https://images.neopets.com/trophies/482_3.gif",
            "https://images.neopets.com/trophies/482_2.gif",
            "https://images.neopets.com/trophies/482_1.gif"
        ]
    },
    {
        "name": "Beast Smack",
        "images": [
            "https://images.neopets.com/trophies/33_3.gif",
            "https://images.neopets.com/trophies/33_2.gif",
            "https://images.neopets.com/trophies/33_1.gif"
        ]
    },
    {
        "name": "Bilge Dice",
        "images": [
            "https://images.neopets.com/trophies/351_3.gif",
            "https://images.neopets.com/trophies/351_2.gif",
            "https://images.neopets.com/trophies/351_1.gif"
        ]
    },
    {
        "name": "Bilge Dice Streak",
        "images": [
            "https://images.neopets.com/trophies/352_3.gif",
            "https://images.neopets.com/trophies/352_2.gif",
            "https://images.neopets.com/trophies/352_1.gif"
        ]
    },
    {
        "name": "Black Pawkeet Slots",
        "images": [
            "https://images.neopets.com/trophies/309_3.gif",
            "https://images.neopets.com/trophies/309_2.gif",
            "https://images.neopets.com/trophies/309_1.gif"
        ]
    },
    {
        "name": "Brucey B Slots",
        "images": [
            "https://images.neopets.com/trophies/300_3.gif",
            "https://images.neopets.com/trophies/300_2.gif",
            "https://images.neopets.com/trophies/300_1.gif"
        ]
    },
    {
        "name": "BUBBLE YUM",
        "images": [
            "https://images.neopets.com/trophies/171_3.gif",
            "https://images.neopets.com/trophies/171_2.gif",
            "https://images.neopets.com/trophies/171_1.gif"
        ]
    },
    {
        "name": "Bullseye",
        "images": [
            "https://images.neopets.com/trophies/39_3.gif",
            "https://images.neopets.com/trophies/39_2.gif",
            "https://images.neopets.com/trophies/39_1.gif"
        ]
    },
    {
        "name": "Bumper Cars",
        "images": [
            "https://images.neopets.com/trophies/61_3.gif",
            "https://images.neopets.com/trophies/61_2.gif",
            "https://images.neopets.com/trophies/61_1.gif"
        ]
    },
    {
        "name": "Carnival of Terror",
        "images": [
            "https://images.neopets.com/trophies/131_3.gif",
            "https://images.neopets.com/trophies/131_2.gif",
            "https://images.neopets.com/trophies/131_1.gif"
        ]
    },
    {
        "name": "Chia Bingo",
        "images": [
            "https://images.neopets.com/trophies/9_3.gif",
            "https://images.neopets.com/trophies/9_2.gif",
            "https://images.neopets.com/trophies/9_1.gif"
        ]
    },
    {
        "name": "Chia Bomber",
        "images": [
            "https://images.neopets.com/trophies/62_3.gif",
            "https://images.neopets.com/trophies/62_2.gif",
            "https://images.neopets.com/trophies/62_1.gif"
        ]
    },
    {
        "name": "Chiazilla Puzzle",
        "images": [
            "https://images.neopets.com/trophies/23_3.gif",
            "https://images.neopets.com/trophies/23_2.gif",
            "https://images.neopets.com/trophies/23_1.gif"
        ]
    },
    {
        "name": "Chomby and the Fungus Balls",
        "images": [
            "https://images.neopets.com/trophies/49_3.gif",
            "https://images.neopets.com/trophies/49_2.gif",
            "https://images.neopets.com/trophies/49_1.gif"
        ]
    },
    {
        "name": "Chute",
        "images": [
            "https://images.neopets.com/trophies/60_3.gif",
            "https://images.neopets.com/trophies/60_2.gif",
            "https://images.neopets.com/trophies/60_1.gif"
        ]
    },
    {
        "name": "CodeBreakers",
        "images": [
            "https://images.neopets.com/trophies/2_3.gif",
            "https://images.neopets.com/trophies/2_2.gif",
            "https://images.neopets.com/trophies/2_1.gif"
        ]
    },
    {
        "name": "Dark Faerie Puzzle",
        "images": [
            "https://images.neopets.com/trophies/24_3.gif",
            "https://images.neopets.com/trophies/24_2.gif",
            "https://images.neopets.com/trophies/24_1.gif"
        ]
    },
    {
        "name": "Deckball Timed",
        "images": [
            "https://images.neopets.com/trophies/83_3.gif",
            "https://images.neopets.com/trophies/83_2.gif",
            "https://images.neopets.com/trophies/83_1.gif"
        ]
    },
    {
        "name": "Deckswabber",
        "images": [
            "https://images.neopets.com/trophies/19_3.gif",
            "https://images.neopets.com/trophies/19_2.gif",
            "https://images.neopets.com/trophies/19_1.gif"
        ]
    },
    {
        "name": "Destruct-O-Match",
        "images": [
            "https://images.neopets.com/trophies/53_3.gif",
            "https://images.neopets.com/trophies/53_2.gif",
            "https://images.neopets.com/trophies/53_1.gif"
        ]
    },
    {
        "name": "Destruct-O-Match II",
        "images": [
            "https://images.neopets.com/trophies/453_3.gif",
            "https://images.neopets.com/trophies/453_2.gif",
            "https://images.neopets.com/trophies/453_1.gif"
        ]
    },
    {
        "name": "Destruct-O-Match II",
        "images": [
            "https://images.neopets.com/trophies/759_3.gif",
            "https://images.neopets.com/trophies/759_2.gif",
            "https://images.neopets.com/trophies/759_1.gif"
        ]
    },
    {
        "name": "Dubloon Disaster",
        "images": [
            "https://images.neopets.com/trophies/143_3.gif",
            "https://images.neopets.com/trophies/143_2.gif",
            "https://images.neopets.com/trophies/143_1.gif"
        ]
    },
    {
        "name": "Earth Faerie Aces",
        "images": [
            "https://images.neopets.com/trophies/40_3.gif",
            "https://images.neopets.com/trophies/40_2.gif",
            "https://images.neopets.com/trophies/40_1.gif"
        ]
    },
    {
        "name": "Earth Faerie Aces - Expert",
        "images": [
            "https://images.neopets.com/trophies/41_3.gif",
            "https://images.neopets.com/trophies/41_2.gif",
            "https://images.neopets.com/trophies/41_1.gif"
        ]
    },
    {
        "name": "Evil Fuzzles from Beyond the Stars",
        "images": [
            "https://images.neopets.com/trophies/128_3.gif",
            "https://images.neopets.com/trophies/128_2.gif",
            "https://images.neopets.com/trophies/128_1.gif"
        ]
    },
    {
        "name": "Faerie Caves",
        "images": [
            "https://images.neopets.com/trophies/43_3.gif",
            "https://images.neopets.com/trophies/43_2.gif",
            "https://images.neopets.com/trophies/43_1.gif"
        ]
    },
    {
        "name": "Faerie Cloud Racers",
        "images": [
            "https://images.neopets.com/trophies/137_3.gif",
            "https://images.neopets.com/trophies/137_2.gif",
            "https://images.neopets.com/trophies/137_1.gif"
        ]
    },
    {
        "name": "Faerie Quest",
        "images": [
            "https://images.neopets.com/trophies/37_3.gif",
            "https://images.neopets.com/trophies/37_2.gif",
            "https://images.neopets.com/trophies/37_1.gif"
        ]
    },
    {
        "name": "Feed Florg",
        "images": [
            "https://images.neopets.com/trophies/156_3.gif",
            "https://images.neopets.com/trophies/156_2.gif",
            "https://images.neopets.com/trophies/156_1.gif"
        ]
    },
    {
        "name": "Fruit Machine",
        "images": [
            "https://images.neopets.com/trophies/20_3.gif",
            "https://images.neopets.com/trophies/20_2.gif",
            "https://images.neopets.com/trophies/20_1.gif"
        ]
    },
    {
        "name": "Grundo Snowthrow",
        "images": [
            "https://images.neopets.com/trophies/31_3.gif",
            "https://images.neopets.com/trophies/31_2.gif",
            "https://images.neopets.com/trophies/31_1.gif"
        ]
    },
    {
        "name": "Ice Caves Puzzle",
        "images": [
            "https://images.neopets.com/trophies/32_3.gif",
            "https://images.neopets.com/trophies/32_2.gif",
            "https://images.neopets.com/trophies/32_1.gif"
        ]
    },
    {
        "name": "Ice Cream Factory",
        "images": [
            "https://images.neopets.com/trophies/57_3.gif",
            "https://images.neopets.com/trophies/57_2.gif",
            "https://images.neopets.com/trophies/57_1.gif"
        ]
    },
    {
        "name": "Igloo Garage Sale - The Game",
        "images": [
            "https://images.neopets.com/trophies/169_3.gif",
            "https://images.neopets.com/trophies/169_2.gif",
            "https://images.neopets.com/trophies/169_1.gif"
        ]
    },
    {
        "name": "Invasion of Meridell",
        "images": [
            "https://images.neopets.com/trophies/182_3.gif",
            "https://images.neopets.com/trophies/182_2.gif",
            "https://images.neopets.com/trophies/182_1.gif"
        ]
    },
    {
        "name": "Jelly Processing Plant",
        "images": [
            "https://images.neopets.com/trophies/95_3.gif",
            "https://images.neopets.com/trophies/95_2.gif",
            "https://images.neopets.com/trophies/95_1.gif"
        ]
    },
    {
        "name": "JubJub Scramble",
        "images": [
            "https://images.neopets.com/trophies/56_3.gif",
            "https://images.neopets.com/trophies/56_2.gif",
            "https://images.neopets.com/trophies/56_1.gif"
        ]
    },
    {
        "name": "Kau Korrall",
        "images": [
            "https://images.neopets.com/trophies/15_3.gif",
            "https://images.neopets.com/trophies/15_2.gif",
            "https://images.neopets.com/trophies/15_1.gif"
        ]
    },
    {
        "name": "Kauvaras Potion Cumulative",
        "images": [
            "https://images.neopets.com/trophies/99_3.gif",
            "https://images.neopets.com/trophies/99_2.gif",
            "https://images.neopets.com/trophies/99_1.gif"
        ]
    },
    {
        "name": "Kauvaras Potion Game",
        "images": [
            "https://images.neopets.com/trophies/98_3.gif",
            "https://images.neopets.com/trophies/98_2.gif",
            "https://images.neopets.com/trophies/98_1.gif"
        ]
    },
    {
        "name": "Kiko Match",
        "images": [
            "https://images.neopets.com/trophies/3_3.gif",
            "https://images.neopets.com/trophies/3_2.gif",
            "https://images.neopets.com/trophies/3_1.gif"
        ]
    },
    {
        "name": "Kiko Match II",
        "images": [
            "https://images.neopets.com/trophies/93_3.gif",
            "https://images.neopets.com/trophies/93_2.gif",
            "https://images.neopets.com/trophies/93_1.gif"
        ]
    },
    {
        "name": "Korbats Lab",
        "images": [
            "https://images.neopets.com/trophies/85_3.gif",
            "https://images.neopets.com/trophies/85_2.gif",
            "https://images.neopets.com/trophies/85_1.gif"
        ]
    },
    {
        "name": "MAGAX: Destroyer",
        "images": [
            "https://images.neopets.com/trophies/162_3.gif",
            "https://images.neopets.com/trophies/162_2.gif",
            "https://images.neopets.com/trophies/162_1.gif"
        ]
    },
    {
        "name": "Maraqua Puzzle",
        "images": [
            "https://images.neopets.com/trophies/22_3.gif",
            "https://images.neopets.com/trophies/22_2.gif",
            "https://images.neopets.com/trophies/22_1.gif"
        ]
    },
    {
        "name": "Maths Nightmare",
        "images": [
            "https://images.neopets.com/trophies/150_3.gif",
            "https://images.neopets.com/trophies/150_2.gif",
            "https://images.neopets.com/trophies/150_1.gif"
        ]
    },
    {
        "name": "Meerca Chase",
        "images": [
            "https://images.neopets.com/trophies/46_3.gif",
            "https://images.neopets.com/trophies/46_2.gif",
            "https://images.neopets.com/trophies/46_1.gif"
        ]
    },
    {
        "name": "Meriball",
        "images": [
            "https://images.neopets.com/trophies/173_3.gif",
            "https://images.neopets.com/trophies/173_2.gif",
            "https://images.neopets.com/trophies/173_1.gif"
        ]
    },
    {
        "name": "Meristones",
        "images": [
            "https://images.neopets.com/trophies/180_3.gif",
            "https://images.neopets.com/trophies/180_2.gif",
            "https://images.neopets.com/trophies/180_1.gif"
        ]
    },
    {
        "name": "Meristones Cumulative",
        "images": [
            "https://images.neopets.com/trophies/181_3.gif",
            "https://images.neopets.com/trophies/181_2.gif",
            "https://images.neopets.com/trophies/181_1.gif"
        ]
    },
    {
        "name": "Moon Puzzle",
        "images": [
            "https://images.neopets.com/trophies/25_3.gif",
            "https://images.neopets.com/trophies/25_2.gif",
            "https://images.neopets.com/trophies/25_1.gif"
        ]
    },
    {
        "name": "Mummy Maze",
        "images": [
            "https://images.neopets.com/trophies/71_3.gif",
            "https://images.neopets.com/trophies/71_2.gif",
            "https://images.neopets.com/trophies/71_1.gif"
        ]
    },
    {
        "name": "Mutant Graveyard of DOOM",
        "images": [
            "https://images.neopets.com/trophies/65_3.gif",
            "https://images.neopets.com/trophies/65_2.gif",
            "https://images.neopets.com/trophies/65_1.gif"
        ]
    },
    {
        "name": "Neo DJ",
        "images": [
            "https://images.neopets.com/trophies/30_3.gif",
            "https://images.neopets.com/trophies/30_2.gif",
            "https://images.neopets.com/trophies/30_1.gif"
        ]
    },
    {
        "name": "Neoknights",
        "images": [
            "https://images.neopets.com/trophies/34_3.gif",
            "https://images.neopets.com/trophies/34_2.gif",
            "https://images.neopets.com/trophies/34_1.gif"
        ]
    },
    {
        "name": "NeoQuest II Artists",
        "images": [
            "https://images.neopets.com/trophies/374_2.gif",
            "https://images.neopets.com/trophies/374_1.gif"
        ]
    },
    {
        "name": "NeoQuest Race",
        "images": [
            "https://images.neopets.com/trophies/90_3.gif",
            "https://images.neopets.com/trophies/90_2.gif",
            "https://images.neopets.com/trophies/90_1.gif"
        ]
    },
    {
        "name": "Nimmos Pond",
        "images": [
            "https://images.neopets.com/trophies/74_3.gif",
            "https://images.neopets.com/trophies/74_2.gif",
            "https://images.neopets.com/trophies/74_1.gif"
        ]
    },
    {
        "name": "Nova Battle",
        "images": [
            "https://images.neopets.com/trophies/1188_3.gif",
            "https://images.neopets.com/trophies/1188_2.gif",
            "https://images.neopets.com/trophies/1188_1.gif"
        ]
    },
    {
        "name": "Omelette Defender",
        "images": [
            "https://images.neopets.com/trophies/127_3.gif",
            "https://images.neopets.com/trophies/127_2.gif",
            "https://images.neopets.com/trophies/127_1.gif"
        ]
    },
    {
        "name": "Pterattack",
        "images": [
            "https://images.neopets.com/trophies/63_3.gif",
            "https://images.neopets.com/trophies/63_2.gif",
            "https://images.neopets.com/trophies/63_1.gif"
        ]
    },
    {
        "name": "Pumpkin Patch",
        "images": [
            "https://images.neopets.com/trophies/64_3.gif",
            "https://images.neopets.com/trophies/64_2.gif",
            "https://images.neopets.com/trophies/64_1.gif"
        ]
    },
    {
        "name": "Skarl's Scramble",
        "images": [
            "https://images.neopets.com/trophies/243_3.gif",
            "https://images.neopets.com/trophies/243_2.gif",
            "https://images.neopets.com/trophies/243_1.gif"
        ]
    },
    {
        "name": "Snow Dogs",
        "images": [
            "https://images.neopets.com/trophies/96_3.gif",
            "https://images.neopets.com/trophies/96_2.gif",
            "https://images.neopets.com/trophies/96_1.gif"
        ]
    },
    {
        "name": "Solo Says",
        "images": [
            "https://images.neopets.com/trophies/11_3.gif",
            "https://images.neopets.com/trophies/11_2.gif",
            "https://images.neopets.com/trophies/11_1.gif"
        ]
    },
    {
        "name": "Super Bullseye",
        "images": [
            "https://images.neopets.com/trophies/42_3.gif",
            "https://images.neopets.com/trophies/42_2.gif",
            "https://images.neopets.com/trophies/42_1.gif"
        ]
    },
    {
        "name": "Swarm",
        "images": [
            "https://images.neopets.com/trophies/66_3.gif",
            "https://images.neopets.com/trophies/66_2.gif",
            "https://images.neopets.com/trophies/66_1.gif"
        ]
    },
    {
        "name": "Techo Says",
        "images": [
            "https://images.neopets.com/trophies/1_3.gif",
            "https://images.neopets.com/trophies/1_2.gif",
            "https://images.neopets.com/trophies/1_1.gif"
        ]
    },
    {
        "name": "The Haunted Shootery",
        "images": [
            "https://images.neopets.com/trophies/1114_3.gif",
            "https://images.neopets.com/trophies/1114_2.gif",
            "https://images.neopets.com/trophies/1114_1.gif"
        ]
    },
    {
        "name": "The Last Smiley",
        "images": [
            "https://images.neopets.com/trophies/576_3.gif",
            "https://images.neopets.com/trophies/576_2.gif",
            "https://images.neopets.com/trophies/576_1.gif"
        ]
    },
    {
        "name": "The Warehouse Of Lost Plushies",
        "images": [
            "https://images.neopets.com/trophies/322_3.gif",
            "https://images.neopets.com/trophies/322_2.gif",
            "https://images.neopets.com/trophies/322_1.gif"
        ]
    },
    {
        "name": "Theme Parks",
        "images": [
            "https://images.neopets.com/trophies/116_3.gif",
            "https://images.neopets.com/trophies/116_2.gif",
            "https://images.neopets.com/trophies/116_1.gif"
        ]
    },
    {
        "name": "Thinkway Toybox Escape",
        "images": [
            "https://images.neopets.com/trophies/236_3.gif",
            "https://images.neopets.com/trophies/236_2.gif",
            "https://images.neopets.com/trophies/236_1.gif"
        ]
    },
    {
        "name": "Tower of Turnips",
        "images": [
            "https://images.neopets.com/trophies/172_3.gif",
            "https://images.neopets.com/trophies/172_2.gif",
            "https://images.neopets.com/trophies/172_1.gif"
        ]
    },
    {
        "name": "Tug-O-War",
        "images": [
            "https://images.neopets.com/trophies/52_3.gif",
            "https://images.neopets.com/trophies/52_2.gif",
            "https://images.neopets.com/trophies/52_1.gif"
        ]
    },
    {
        "name": "Turmac Roll",
        "images": [
            "https://images.neopets.com/trophies/323_3.gif",
            "https://images.neopets.com/trophies/323_2.gif",
            "https://images.neopets.com/trophies/323_1.gif"
        ]
    },
    {
        "name": "Tyrannian Mini Golf",
        "images": [
            "https://images.neopets.com/trophies/395_3.gif",
            "https://images.neopets.com/trophies/395_2.gif",
            "https://images.neopets.com/trophies/395_1.gif"
        ]
    },
    {
        "name": "Uber Faerie Caves",
        "images": [
            "https://images.neopets.com/trophies/44_3.gif",
            "https://images.neopets.com/trophies/44_2.gif",
            "https://images.neopets.com/trophies/44_1.gif"
        ]
    },
    {
        "name": "Ultimate Bullseye",
        "images": [
            "https://images.neopets.com/trophies/152_3.gif",
            "https://images.neopets.com/trophies/152_2.gif",
            "https://images.neopets.com/trophies/152_1.gif"
        ]
    },
    {
        "name": "Usuki Frenzy",
        "images": [
            "https://images.neopets.com/trophies/129_3.gif",
            "https://images.neopets.com/trophies/129_2.gif",
            "https://images.neopets.com/trophies/129_1.gif"
        ]
    },
    {
        "name": "Volcano Run",
        "images": [
            "https://images.neopets.com/trophies/140_3.gif",
            "https://images.neopets.com/trophies/140_2.gif",
            "https://images.neopets.com/trophies/140_1.gif"
        ]
    }
];

const spotlightsAndCompetitionsTrophies = [
    {
        "name": "Caption Competition",
        "images": [
            "https://images.neopets.com/trophies/100_3.gif",
            "https://images.neopets.com/trophies/100_2.gif",
            "https://images.neopets.com/trophies/100_1.gif"
        ]
    },
    {
        "name": "Gallery Spotlight",
        "images": [
            "https://images.neopets.com/trophies/222_1.gif"
        ]
    },
    {
        "name": "Lookup of the Week",
        "images": [
            "https://images.neopets.com/trophies/467_1.gif"
        ]
    },
    {
        "name": "Mystery Pic",
        "images": [
            "https://images.neopets.com/trophies/105_3.gif",
            "https://images.neopets.com/trophies/105_2.gif",
            "https://images.neopets.com/trophies/105_1.gif"
        ]
    },
    {
        "name": "Neopian Times",
        "images": [
            "https://images.neopets.com/trophies/107_1.gif"
        ]
    },
    {
        "name": "Picture Competition",
        "images": [
            "https://images.neopets.com/trophies/102_3.gif",
            "https://images.neopets.com/trophies/102_2.gif",
            "https://images.neopets.com/trophies/102_1.gif"
        ]
    },
    {
        "name": "Poetry Competition",
        "images": [
            "https://images.neopets.com/trophies/103_3.gif",
            "https://images.neopets.com/trophies/103_2.gif",
            "https://images.neopets.com/trophies/103_1.gif"
        ]
    },
    {
        "name": "Storytelling",
        "images": [
            "https://images.neopets.com/trophies/104_3.gif",
            "https://images.neopets.com/trophies/104_2.gif",
            "https://images.neopets.com/trophies/104_1.gif"
        ]
    }
];

function createSection(title, allTrophies, ownedTrophies) {
    const section = document.createElement('details');
    section.open = true;
    section.innerHTML = `<summary style="font-size: 24px">${title}</summary>`;

    const missingTrophiesEl = document.createElement('details');
    const upgradableTrophiesEl = document.createElement('details');
    const ownedTrophiesEl = document.createElement('details');
    missingTrophiesEl.style.marginTop = '24px';
    upgradableTrophiesEl.style.marginTop = '24px';
    ownedTrophiesEl.style.marginTop = '24px';
    missingTrophiesEl.innerHTML = '<summary style="font-size: 18px">Missing Trophies</summary><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;"></div>';
    upgradableTrophiesEl.innerHTML = '<summary style="font-size: 18px">Upgradable Trophies</summary><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;"></div>';
    ownedTrophiesEl.innerHTML = '<summary style="font-size: 18px">Owned Trophies</summary><div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;"></div>';
    upgradableTrophiesEl.open = true;
    missingTrophiesEl.open = true;
    ownedTrophiesEl.open = false;
    section.append(missingTrophiesEl);
    section.append(upgradableTrophiesEl);
    section.append(ownedTrophiesEl);
    const missingTrophiesBodyEl = missingTrophiesEl.querySelector('div');
    const upgradableTrophieBodyEl = upgradableTrophiesEl.querySelector('div');
    const ownedTrophiesBodyEl = ownedTrophiesEl.querySelector('div');

    for (let i = 0; i < allTrophies.length; i += 1) {
        const { name, images } = allTrophies[i];
        const trophyIndex = images.reduce((acc, n, i) => ownedTrophies.has(n) ? i : acc, -1);
        if (trophyIndex === images.length - 1) {
            // owned
            const trophyEl = document.createElement('div');
            trophyEl.innerHTML = `<img src="${images[trophyIndex]}" /><div>${name}</div>`;
            ownedTrophiesBodyEl.append(trophyEl);
        } else if (trophyIndex > -1) {
            // upgradable
            const trophyEl = document.createElement('div');
            trophyEl.innerHTML = `<img src="${images[trophyIndex]}" /><div>${name}</div>`;
            upgradableTrophieBodyEl.append(trophyEl);
        } else {
            // missing
            const trophyEl = document.createElement('div');
            trophyEl.innerHTML = `<img src="${images[images.length - 1]}" style="opacity: 50%;" /><div>${name}</div>`;
            missingTrophiesBodyEl.append(trophyEl);
        }
    }
    return section.outerHTML;
}

function openTrophySummaryPage(existingTrophies) {
    const win = window.open("", "Title");
    win.document.body.style.maxWidth = '1200px';
    win.document.body.style.padding = '16px';
    win.document.body.style.margin = 'auto';
    win.document.body.style.textAlign = 'center';

    win.document.body.innerHTML += '<label for="black">Black</label><input id="black" name="textcolor" checked value="0" type="radio" />' +
      '<label for="white" style="color: white">White</label><input id="white" name="textcolor" value="1" type="radio" />'
    win.document.head.innerHTML += '<style>\n' +
      '#black:checked ~ * { color: black }\n' +
      '#white:checked ~ * { color: white }\n' +
      '</style>'

    win.document.body.innerHTML += createSection('Flash Game High Score Trophies', flashgameHighScoreTrophies, existingTrophies);
    win.document.body.innerHTML += createSection('Cumulative High Score Trophies', cumulativeHighScoreTrophies, existingTrophies);
    win.document.body.innerHTML += createSection('Other High Score Trophies', otherHighScoreTrophies, existingTrophies);
    win.document.body.innerHTML += createSection('Non Competitive Trophies', nonCompetitiveTrophies, existingTrophies);
    win.document.body.innerHTML += createSection('Spotlights & Competitions Trophies', spotlightsAndCompetitionsTrophies, existingTrophies);
    win.document.body.innerHTML += createSection('PVP Trophies (Currently Unobtainable)', pvpTrophies, existingTrophies);
    win.document.body.innerHTML += createSection('Retired Game Trophies', retiredGameTrophies, existingTrophies);
}

(function() {
    'use strict';

    // Your code here...
    try {
        const existingTrophies = new Set(Array.from(document.querySelectorAll('[width="600"] img')).map(n => n.src));
        const button = document.createElement('div');
        button.innerHTML = '<div style="margin-top: 16px"><button>Show missing trophies!</button></div>';
        document.querySelector('.content center').append(button);

        button.querySelector('button').addEventListener('click', function() {
            openTrophySummaryPage(existingTrophies);
        });
    } catch (e) {
        console.log(e);
    }
})();