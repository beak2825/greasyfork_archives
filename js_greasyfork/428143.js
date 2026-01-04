// ==UserScript==
// @name         MH - Minluck & CRE tool v2.0 (new)
// @description  Shows hunt statistics on the camp page
// @author       Chromatical
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @version      5.2.3
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/447193/MH%20-%20Minluck%20%20CRE%20tool%20v20%20%28new%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447193/MH%20-%20Minluck%20%20CRE%20tool%20v20%20%28new%29.meta.js
// ==/UserScript==

// Credits:
// tsitu and contributors - Main CRE ideation and realisation
// selianth - Minluck spreadsheet
// Chromatical - Ideation and realisation
// Kuhmann and Neb - Maintenance and QA
// Pew Pew - Script and rewrite to ease importing from spreadsheet
// Leppy - Addition of special modifiers
// Xellis - Addition of fallback that prevents MiniCRE from opening.
// and anyone else we may have missed :peepolove:

//User Settings-----------------------------
//var turn_red_when = 60; //Turns red when your CR falls below it, in % Deprecated, set it with the tool nox now (click on "i");
//User Settings End-------------------------

const debugLog = false;

const addStyles = (styles) => {
    const style = document.createElement('style');
    style.id = `chro-minluck-styles`;
    style.innerHTML = styles;
    document.head.appendChild(style);

    return style;
};

(function () {
    if (document.getElementsByClassName("trapImageView-trapAuraContainer")[0] && document.getElementById("mousehuntContainer").className.includes("PageCamp")) {
        render();
        trapChangeListener()
    }

    addStyles(`.min-luck-container {
        position: absolute;
        top: 7px;
        right: 7px;
    }

    .min-luck-container-ssst {
        top: 1px;
        right: 10px;
    }

    .min-luck-button {
        width: 20px;
        height: 20px;
    }

    #minluck-list {
        background-color: #f5f5f5;
        position: fixed;
        z-index: 9999;

        border: 3px solid #696969;
        border-radius: 20px;
        padding: 10px;
        text-align: center;
        min-width: 207px;

        left: 35vw;
        top: 28vh;
    }

    #button-Div {
        display: flex;
        justify-content: flex-end;
    }

    #info-button {
        margin-left: 10px;
    }

    #minimise-button {
        cursor: pointer;
        margin-left: 5px;
        display: block;
    }

    #chro-minluck-table.minimised {
        display: none;
    }

    #close-button {
        margin-left: 5px;
    }

    .setup-info {
        text-align: left;
        font-weight: 900;
        float: left;
        margin-left: 5px;
    }

    .power-info, .luck-info {
        font-weight: 400;
    }

    #chro-minluck-table {
        text-align: left;
        border-spacing: 1em 0;
        padding-top: 5px;
    }

    .chro-minluck-header-name,
    .chro-minluck-header-ar,
    .chro-minluck-header-minluck,
    .chro-minluck-header-cr {
        font-weight: 900;
    }

    .chro-minluck-data-ar,
    .chro-minluck-data-cr,
    .chro-minluck-overall-ar,
    .chro-minluck-overall-cr {
        text-align: right;
    }

    .chro-minluck-header-ar,
    .chro-minluck-header-minluck,
    .chro-minluck-header-cr,
    .chro-minluck-data-minluck,
    .chro-minluck-overall-minluck {
        text-align: center;
    }


    .good-minluck {
        color: #228B22;
    }

    .bad-minluck {
        color: #990000;
    }

    .min-luck-button {
        display: none;
    }

    .min-luck-button.blue,
    .min-luck-button.red,
    .min-luck-button.green {
        display: block; /* this is to prevent a flash of the clover changing color */
    }

    .min-luck-button.blue {
        filter: hue-rotate(100deg);
    }

    .min-luck-button.red {
        filter: hue-rotate(185deg);
    }

    .min-luck-button.green {
        filter: hue-rotate(0deg);
    }`);
})();

$(document).ajaxStop(function () {
    var trapContainer = document.getElementsByClassName("trapImageView-trapAuraContainer")[0]
    if (document.getElementsByClassName("min-luck-container")[0]) {
        return;
    } else if (trapContainer && document.getElementById("mousehuntContainer").className.includes("PageCamp")) {
        render();
    }
});

var allMiceInfo = {
    "⚡Thunderlord⚡": {
        "power": 13500,
        "effs": [0, 300, 0, 0, 0, 0, 0, 0, 0]
    },
    "Abominable Snow": {
        "power": 1900,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Abrasive Abalone": {
        "power": 16000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Absolute Acolyte": {
        "power": 59400,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 2750]
    },
    "Absolutia Harmonius": {
        "power": 72000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Acolyte": {
        "power": 18000,
        "effs": [25, 0, 175, 0, 0, 25, 0, 0, 0]
    },
    "Admiral Arrrgh": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Admiral Cloudbeard": {
        "power": 81690,
        "effs": [500, 500, 500, 500, 500, 500, 500, 500, 0]
    },
    "Aether": {
        "power": 9800,
        "effs": [0, 0, 0, 0, 125, 0, 275, 0, 0]
    },
    "Aged": {
        "power": 9000,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Agent M": {
        "power": 38885,
        "effs": [0, 0, 0, 0, 0, 0, 0, 300, 0]
    },
    "Agitated Gentle Giant": {
        "power": 1000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Alchemist": {
        "power": 1930,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Alnilam": {
        "power": 5500,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Alnitak": {
        "power": 6150,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Alpha Weremouse": {
        "power": 6825,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Amplified Brown": {
        "power": 750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Amplified Grey": {
        "power": 750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Amplified White": {
        "power": 750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Ancient of the Deep": {
        "power": 37999,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Ancient Scribe": {
        "power": 16700,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Ancient Wisdom Keeper": {
        "power": 120000,
        "effs": [0, 0, 0, 600, 0, 0, 0, 0, 0]
    },
    "Angelfish": {
        "power": 4960,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Angler": {
        "power": 8709,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Angry Aphid": {
        "power": 10000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Angry Train Staff": {
        "power": 3499,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Anguished Anemone": {
        "power": 15500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Aquos": {
        "power": 4600,
        "effs": [100, 100, 100, 100, 75, 400, 75, 0, 0]
    },
    "Arcana Overachiever": {
        "power": 43000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Arcane Master Sorcerer": {
        "power": 78000,
        "effs": [400, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Arcane Summoner": {
        "power": 7150,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Arch Champion Necromancer": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Archer": {
        "power": 1500,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Architeuthulhu of the Abyss": {
        "power": 100000,
        "effs": [0, 0, 0, 400, 0, 0, 0, 0, 0]
    },
    "Arcticus the Biting Frost": {
        "power": 189500,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Aristo-Cat Burglar": {
        "power": 14590,
        "effs": [0, 0, 0, 0, 0, 0, 0, 600, 0]
    },
    "Armored Archer": {
        "power": 2590,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Artillery Commander": {
        "power": 21065,
        "effs": [100, 0, 0, 50, 50, 0, 50, 0, 0]
    },
    "Ascended Elder": {
        "power": 375015,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 350]
    },
    "Ash Golem": {
        "power": 13601,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Assassin": {
        "power": 13175,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Assassin Beast": {
        "power": 14999,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Astrological Astronomer": {
        "power": 11825,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Audacious Alchemist": {
        "power": 48000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Automated Sentry": {
        "power": 950,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Automated Stone Sentry": {
        "power": 20250,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Automorat": {
        "power": 3751,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Avalancheus the Glacial": {
        "power": 42250,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Baba Gaga": {
        "power": 3750,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Balack the Banished": {
        "power": 62000,
        "effs": [50, 0, 200, 0, 0, 25, 0, 0, 0]
    },
    "Bandit": {
        "power": 100,
        "effs": [25, 25, 25, 25, 200, 25, 100, 100, 0]
    },
    "Barbaric Barnacle": {
        "power": 14000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Bark": {
        "power": 5000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Bark Burner": {
        "power": 18000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Barkshell": {
        "power": 8000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Barmy Gunner": {
        "power": 275,
        "effs": [100, 100, 100, 175, 100, 100, 100, 100, 0]
    },
    "Barnacle Beautician": {
        "power": 5400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Baroness Von Bean": {
        "power": 31000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Baroque Dancer": {
        "power": 33000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Barracuda": {
        "power": 8600,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Bartender": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Bat": {
        "power": 515,
        "effs": [100, 0, 100, 0, 100, 200, 25, 0, 0]
    },
    "Battering Ram": {
        "power": 60000,
        "effs": [25, 0, 0, 0, 0, 25, 0, 0, 0]
    },
    "Battle Cleric": {
        "power": 10851,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Beachcomber": {
        "power": 8000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Bear": {
        "power": 700,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Bearded Elder": {
        "power": 7825,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Beast Tamer": {
        "power": 3000,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Belchazar Banewright": {
        "power": 206500,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Belligerent Berghia": {
        "power": 22000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Berserker": {
        "power": 600,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Berzerker": {
        "power": 8250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 175]
    },
    "Betta": {
        "power": 4960,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Big Bad Behemoth Burroughs": {
        "power": 35002,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Big Bad Burroughs": {
        "power": 51151,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Bilged Boatswain": {
        "power": 250,
        "effs": [100, 100, 100, 175, 100, 100, 100, 100, 0]
    },
    "Biohazard": {
        "power": 12999,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Bionic": {
        "power": 220,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Birthday": {
        "power": 765,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Bitter Grammarian": {
        "power": 90000,
        "effs": [0, 0, 400, 0, 0, 0, 0, 0, 0]
    },
    "Bitter Root": {
        "power": 6825,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Black Diamond Racer": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Black Mage": {
        "power": 1550,
        "effs": [100, 100, 100, 100, 75, 400, 75, 0, 0]
    },
    "Black Powder Thief": {
        "power": 4999,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Black Widow": {
        "power": 4010,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Blacksmith": {
        "power": 27899,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Blight Incarnate": {
        "power": 300000,
        "effs": [0, 0, 0, 0, 0, 0, 600, 0, 0]
    },
    "Blizzara Winterosa": {
        "power": 42400,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Bloomed Sylvan": {
        "power": 1750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Bog Beast": {
        "power": 4200,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Bonbon Gummy Globlin": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Bookborn": {
        "power": 6100,
        "effs": [0, 0, 0, 0, 125, 0, 200, 0, 0]
    },
    "Bookworm": {
        "power": 35500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Borean Commander": {
        "power": 2400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Bottled": {
        "power": 3600,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Bottom Feeder": {
        "power": 3930,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Boulder Biter": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Bounty Hunter": {
        "power": 2100,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Branch Breaker": {
        "power": 20000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Brash Birch": {
        "power": 23000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Brawny": {
        "power": 882,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Breakdancer": {
        "power": 750,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Breeze Borrower": {
        "power": 3500,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Briegull": {
        "power": 635,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Brimstone": {
        "power": 3200,
        "effs": [150, 0, 125, 0, 0, 200, 0, 0, 0]
    },
    "Broomstick Bungler": {
        "power": 31500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Brothers Grimmaus": {
        "power": 9000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Brown": {
        "power": 3,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Bruticle": {
        "power": 16800,
        "effs": [0, 0, 0, 200, 0, 0, 100, 0, 0]
    },
    "Bruticus the Blazing": {
        "power": 49100,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Buccaneer": {
        "power": 4544,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Buckethead": {
        "power": 500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Budrich Thornborn": {
        "power": 12000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Builder": {
        "power": 559,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Bulwark of Ascent": {
        "power": 818250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 7500]
    },
    "Burglar": {
        "power": 2100,
        "effs": [100, 100, 100, 100, 100, 100, 100, 125, 100]
    },
    "Burly Bruiser": {
        "power": 6300,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Cabin Boy": {
        "power": 100,
        "effs": [100, 100, 100, 175, 100, 100, 100, 100, 0]
    },
    "Cagey Countess": {
        "power": 29000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Calalilly": {
        "power": 6000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Calligraphy": {
        "power": 888,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Camoflower": {
        "power": 9000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Camofusion": {
        "power": 14500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Candy Cane": {
        "power": 172,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Candy Cat": {
        "power": 1250,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Candy Goblin": {
        "power": 1750,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Cannonball": {
        "power": 3499,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Captain": {
        "power": 6885,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Captain Cannonball": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Captain Cloudkicker": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 300, 0, 0]
    },
    "Captain Croissant": {
        "power": 500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Caravan Guard": {
        "power": 9000,
        "effs": [0, 0, 0, 50, 50, 0, 50, 0, 0]
    },
    "Cardshark": {
        "power": 4500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Carefree Cook": {
        "power": 2200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Careless Catfish": {
        "power": 10000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Caretaker": {
        "power": 1600,
        "effs": [0, 0, 0, 100, 100, 0, 175, 0, 0]
    },
    "Carmine the Apothecary": {
        "power": 9998,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Carnivore": {
        "power": 15099,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Carrion Medium": {
        "power": 8000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 300]
    },
    "Cavalier": {
        "power": 1270,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Cavern Crumbler": {
        "power": 3630,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Celestial Summoner": {
        "power": 67000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Cell Sweeper": {
        "power": 16200,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Centaur": {
        "power": 5690,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Centaur Ranger": {
        "power": 7500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Chafed Cellist": {
        "power": 30520,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Chamber Cleaver": {
        "power": 1400,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Chameleon": {
        "power": 635,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Champion": {
        "power": 12000,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Champion Danseuse": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Champion Thief": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Chaotic Chiton": {
        "power": 34000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Charming Chimer": {
        "power": 5100,
        "effs": [150, 50, 0, 0, 0, 100, 0, 0, 0]
    },
    "Cheat Sheet Conjurer": {
        "power": 44000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Cheesy Party": {
        "power": 1010,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Cherry": {
        "power": 1500,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Cherry Sprite": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Chess Master": {
        "power": 55000,
        "effs": [0, 0, 0, 0, 0, 0, 2500, 0, 0]
    },
    "Chillandria Permafrost": {
        "power": 206500,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Chip Chiseler": {
        "power": 1260,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Chipper": {
        "power": 4500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Chitinous": {
        "power": 14000,
        "effs": [0, 0, 0, 0, 0, 200, 0, 0, 0]
    },
    "Chocolate Gold Foil": {
        "power": 2650,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Chocolate Overload": {
        "power": 200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Christmas Tree": {
        "power": 847,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Chrono": {
        "power": 25450,
        "effs": [25, 0, 175, 0, 0, 25, 0, 0, 0]
    },
    "Chronomaster": {
        "power": 3000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 300]
    },
    "Cinderstorm": {
        "power": 9410,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Circuit Judge": {
        "power": 4500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "City Noble": {
        "power": 3810,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "City Worker": {
        "power": 4240,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Class Clown": {
        "power": 67000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Classroom Disrupter": {
        "power": 58000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Classroom Keener": {
        "power": 43000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Clockwork Samurai": {
        "power": 50,
        "effs": [25, 25, 25, 25, 100, 25, 100, 0, 0]
    },
    "Clockwork Timespinner": {
        "power": 2300,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Cloud Collector": {
        "power": 2400,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Cloud Miner": {
        "power": 41950,
        "effs": [500, 500, 500, 500, 500, 500, 500, 500, 0]
    },
    "Cloud Strider": {
        "power": 33400,
        "effs": [0, 0, 0, 600, 0, 0, 0, 0, 0]
    },
    "Clownfish": {
        "power": 5110,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Clump": {
        "power": 1300,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Clumsy Carrier": {
        "power": 6559,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Clumsy Chemist": {
        "power": 233,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Clumsy Cupbearer": {
        "power": 28000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Coal Shoveller": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Cobweb": {
        "power": 1100,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Coco Commander": {
        "power": 2000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Coffin Zombie": {
        "power": 1135,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Colonel Crisp": {
        "power": 47000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Combustius Furnaceheart": {
        "power": 206500,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Confused Courier": {
        "power": 2064,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Conjurer": {
        "power": 6000,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Conqueror": {
        "power": 6600,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Constructively Critical Artist": {
        "power": 71500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Consumed Charm Tinkerer": {
        "power": 18435,
        "effs": [300, 300, 300, 300, 300, 300, 300, 300, 0]
    },
    "Cook": {
        "power": 2650,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Coral": {
        "power": 5400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Coral Cuddler": {
        "power": 3930,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Coral Dragon": {
        "power": 7500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Coral Gardener": {
        "power": 6741,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Coral Guard": {
        "power": 8709,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Coral Harvester": {
        "power": 6380,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Coral Queen": {
        "power": 11150,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Core Sample": {
        "power": 1000,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Cork Defender": {
        "power": 4550,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Corkataur": {
        "power": 15525,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Corky the Collector": {
        "power": 2595,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Corridor Bruiser": {
        "power": 17150,
        "effs": [100, 0, 125, 0, 0, 0, 0, 0, 0]
    },
    "Corrupt": {
        "power": 6351,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Corrupt Commodore": {
        "power": 300,
        "effs": [100, 100, 100, 175, 100, 100, 100, 100, 0]
    },
    "Corrupticus the Blight Baron": {
        "power": 189500,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Costumed Dog": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Dragon": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Horse": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Monkey": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Ox": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Pig": {
        "power": 1300,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Rabbit": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Rat": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Rooster": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Sheep": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Snake": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Costumed Tiger": {
        "power": 1200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Count Vampire": {
        "power": 1000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Covetous Coastguard": {
        "power": 7000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Cowardly": {
        "power": 4,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Cowbell": {
        "power": 570,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Crabolia": {
        "power": 4900,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Crag Elder": {
        "power": 4100,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Craggy Ore": {
        "power": 600,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Cranky Caterpillar": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Crate Camo": {
        "power": 3751,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Crazed Cultivator": {
        "power": 7000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Crazed Goblin": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Creepy Marionette": {
        "power": 4000,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Crematio Scorchworth": {
        "power": 54250,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Crimson Commander": {
        "power": 9299,
        "effs": [125, 125, 0, 125, 125, 0, 125, 0, 0]
    },
    "Crimson Ranger": {
        "power": 5999,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Crimson Titan": {
        "power": 6799,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Crimson Watch": {
        "power": 5600,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Croquet Crusher": {
        "power": 2945,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Crown Collector": {
        "power": 2647,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Crusty Crab": {
        "power": 18000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Crystal Behemoth": {
        "power": 109500,
        "effs": [0, 0, 2500, 0, 0, 0, 0, 0, 0]
    },
    "Crystal Cave Worm": {
        "power": 12526,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystal Controller": {
        "power": 10550,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystal Golem": {
        "power": 17399,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystal Lurker": {
        "power": 24100,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystal Observer": {
        "power": 28400,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystal Queen": {
        "power": 20500,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystalback": {
        "power": 10925,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Crystalline Slasher": {
        "power": 6575,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Cumulost": {
        "power": 19100,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Cupcake Camo": {
        "power": 900,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Cupcake Candle Thief": {
        "power": 290,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Cupcake Cutie": {
        "power": 950,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Cupcake Runner": {
        "power": 600,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Cupid": {
        "power": 680,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Curious Chemist": {
        "power": 800,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Cursed": {
        "power": 4225,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Cursed Crusader": {
        "power": 21500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 600]
    },
    "Cursed Enchanter": {
        "power": 3500,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Cursed Engineer": {
        "power": 6499,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Cursed Librarian": {
        "power": 12499,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Cursed Taskmaster": {
        "power": 12025,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Cursed Thief": {
        "power": 8502,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Cute Cloud Conjurer": {
        "power": 23400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Cute Crate Carrier": {
        "power": 3499,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Cutpurse": {
        "power": 6650,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Cutthroat Cannoneer": {
        "power": 32604,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Cutthroat Pirate": {
        "power": 24375,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Cuttle": {
        "power": 3990,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Cyber Miner": {
        "power": 1350,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Cybernetic Specialist": {
        "power": 880,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Cyborg": {
        "power": 1340,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Cycloness": {
        "power": 10800,
        "effs": [150, 50, 0, 0, 0, 100, 0, 0, 0]
    },
    "Cyclops": {
        "power": 1600,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Cyclops Barbarian": {
        "power": 7500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Dance Party": {
        "power": 500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Dancer": {
        "power": 1280,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Dancing Assassin": {
        "power": 93000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 500]
    },
    "Dangerous Duo": {
        "power": 4999,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Dark Magi": {
        "power": 40001,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Dark Templar": {
        "power": 28901,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Dashing Buccaneer": {
        "power": 225,
        "effs": [100, 100, 100, 175, 100, 100, 100, 100, 0]
    },
    "Dastardly Duchess": {
        "power": 34550,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Data Devourer": {
        "power": 100000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Davy Jones": {
        "power": 2000,
        "effs": [150, 0, 125, 0, 0, 200, 0, 0, 0]
    },
    "Dawn Guardian": {
        "power": 72000,
        "effs": [1000, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Daydreamer": {
        "power": 12565,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Decrepit Tentacle Terror": {
        "power": 24251,
        "effs": [100, 0, 300, 0, 0, 300, 0, 0, 0]
    },
    "Deep": {
        "power": 94990,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Deep Sea Diver": {
        "power": 7500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Defender": {
        "power": 8400,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Dehydrated": {
        "power": 2000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Demolitions": {
        "power": 2300,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Deranged Deckhand": {
        "power": 11150,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Derpicorn": {
        "power": 998,
        "effs": [0, 0, 0, 0, 200, 0, 125, 0, 0]
    },
    "Derpshark": {
        "power": 11302,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Derr Chieftain": {
        "power": 20400,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Derr Lich": {
        "power": 8400,
        "effs": [150, 0, 200, 0, 0, 125, 0, 0, 0]
    },
    "Desert Archer": {
        "power": 4398,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Desert Architect": {
        "power": 11151,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Desert Nomad": {
        "power": 17201,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Desert Soldier": {
        "power": 4900,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Desperado": {
        "power": 4500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Destructoy": {
        "power": 1506,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Devious Gentleman": {
        "power": 5520,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Diamond": {
        "power": 400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Diamondhide": {
        "power": 48748,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Diminutive Detainee": {
        "power": 20000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Dinosuit": {
        "power": 900,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Dire Lycan": {
        "power": 1240,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Dirt Thing": {
        "power": 5925,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Dojo Sensei": {
        "power": 45000,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Doktor": {
        "power": 1150,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Double Black Diamond Racer": {
        "power": 2400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Draconic Warden": {
        "power": 13194,
        "effs": [0, 100, 0, 75, 75, 0, 75, 0, 0]
    },
    "Dragon": {
        "power": 74800,
        "effs": [0, 900, 0, 0, 0, 0, 0, 0, 0]
    },
    "Dragonbreather": {
        "power": 17790,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Dragoon": {
        "power": 48000,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Dread Knight": {
        "power": 2450,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Dread Pirate Mousert": {
        "power": 6380,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Dream Drifter": {
        "power": 947,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Dreck Grimehaven": {
        "power": 47000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Drudge": {
        "power": 7900,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Drummer": {
        "power": 1000,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Dumpling Chef": {
        "power": 2000,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Dumpling Delivery": {
        "power": 2305,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Dunehopper": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Dungeon Master": {
        "power": 104250,
        "effs": [0, 0, 0, 0, 300, 0, 0, 0, 0]
    },
    "Dwarf": {
        "power": 40,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Eagle Owl": {
        "power": 2295,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Eclipse": {
        "power": 37399,
        "effs": [1000, 1000, 100000, 1000, 1000, 1000, 1000, 0, 0]
    },
    "Eel": {
        "power": 4960,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Effervescent": {
        "power": 13500,
        "effs": [0, 0, 0, 0, 125, 0, 250, 0, 0]
    },
    "Egg Painter": {
        "power": 900,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Egg Scrambler": {
        "power": 1250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Eggscavator": {
        "power": 2200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Eggsplosive Scientist": {
        "power": 2100,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Eggsquisite Entertainer": {
        "power": 2200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "El Flamenco": {
        "power": 1400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Elder": {
        "power": 8800,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Elf": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Elite Guardian": {
        "power": 5710,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Elixir Maker": {
        "power": 5050,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Elub Chieftain": {
        "power": 15250,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Elub Lich": {
        "power": 8800,
        "effs": [150, 0, 200, 0, 0, 125, 0, 0, 0]
    },
    "Elven Princess": {
        "power": 1270,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Emberstone Scaled": {
        "power": 15575,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Empyrean Appraiser": {
        "power": 20550,
        "effs": [300, 300, 300, 300, 300, 300, 300, 300, 0]
    },
    "Empyrean Empress": {
        "power": 263025,
        "effs": [500, 500, 500, 500, 500, 500, 500, 500, 0]
    },
    "Empyrean Geologist": {
        "power": 15235,
        "effs": [300, 300, 300, 300, 300, 300, 300, 300, 0]
    },
    "Empyrean Javelineer": {
        "power": 25350,
        "effs": [0, 600, 0, 0, 0, 0, 0, 0, 0]
    },
    "Enchanted Chess Club Champion": {
        "power": 53500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Enginseer": {
        "power": 3930,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Enlightened Labourer": {
        "power": 2180,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Enslaved Spirit": {
        "power": 5730,
        "effs": [150, 0, 125, 0, 0, 200, 0, 0, 0]
    },
    "Epoch Golem": {
        "power": 1250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Escape Artist": {
        "power": 50,
        "effs": [25, 25, 25, 25, 200, 25, 100, 100, 0]
    },
    "Essence Collector": {
        "power": 3275,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Essence Guardian": {
        "power": 3275,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Ethereal Enchanter": {
        "power": 2500,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Ethereal Engineer": {
        "power": 5500,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Ethereal Guardian": {
        "power": 10851,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Ethereal Librarian": {
        "power": 6499,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Ethereal Thief": {
        "power": 6499,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Evil Scientist": {
        "power": 1100,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Excitable Electric": {
        "power": 965,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Exo-Tech": {
        "power": 10851,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Explorator": {
        "power": 4700,
        "effs": [0, 0, 0, 0, 175, 0, 150, 0, 0]
    },
    "Extreme Everysports": {
        "power": 1000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Factory Technician": {
        "power": 1000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Fairy": {
        "power": 2500,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Fall Familiar": {
        "power": 11500,
        "effs": [0, 0, 0, 0, 0, 200, 100, 0, 0]
    },
    "Fallen Champion Footman": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Falling Carpet": {
        "power": 12200,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Farmhand": {
        "power": 600,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Farrier": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Featherlight": {
        "power": 65000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Fencer": {
        "power": 225,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Fete Fromager": {
        "power": 200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Fetid Swamp": {
        "power": 12675,
        "effs": [0, 0, 0, 0, 0, 200, 0, 0, 0]
    },
    "Fibbocchio": {
        "power": 12000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Fiddler": {
        "power": 2000,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Field": {
        "power": 5,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Fiend": {
        "power": 11000,
        "effs": [125, 125, 125, 400, 75, 125, 75, 0, 0]
    },
    "Fiery Crusher": {
        "power": 5095,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Finder": {
        "power": 2350,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Firebreather": {
        "power": 15401,
        "effs": [0, 0, 0, 0, 0, 0, 150, 0, 0]
    },
    "Firefly": {
        "power": 3691,
        "effs": [0, 0, 0, 0, 0, 0, 150, 0, 0]
    },
    "Flamboyant Flautist": {
        "power": 12500,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Flame Archer": {
        "power": 5200,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Flame Ordnance": {
        "power": 7900,
        "effs": [100, 0, 0, 50, 50, 0, 50, 0, 0]
    },
    "Flame Warrior": {
        "power": 5700,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Flamina Cinderbreath": {
        "power": 82750,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Floating Spore": {
        "power": 9200,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Flutterby": {
        "power": 6248,
        "effs": [0, 0, 0, 0, 125, 0, 200, 0, 0]
    },
    "Fluttering Flutist": {
        "power": 8000,
        "effs": [150, 50, 0, 0, 0, 100, 0, 0, 0]
    },
    "Flying": {
        "power": 50,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Fog": {
        "power": 160,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Force Fighter Blue": {
        "power": 1000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Force Fighter Green": {
        "power": 2000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Force Fighter Pink": {
        "power": 1750,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Force Fighter Red": {
        "power": 1500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Force Fighter Yellow": {
        "power": 1250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Forgotten Elder": {
        "power": 29000,
        "effs": [0, 0, 600, 0, 0, 0, 0, 0, 0]
    },
    "Fortuitous Fool": {
        "power": 39150,
        "effs": [200, 200, 200, 200, 200, 200, 200, 200, 0]
    },
    "Foxy": {
        "power": 1650,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Free Skiing": {
        "power": 2064,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Frightened Flying Fireworks": {
        "power": 106,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Frigid Foreman": {
        "power": 1276,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Frigidocius Coldshot": {
        "power": 82750,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Frog": {
        "power": 590,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Frost King": {
        "power": 1768,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Frostbite": {
        "power": 14399,
        "effs": [0, 0, 0, 200, 0, 0, 100, 0, 0]
    },
    "Frostlance Guard": {
        "power": 6500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Frostnip Icebound": {
        "power": 38000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Frostwing Commander": {
        "power": 15250,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Frosty Snow": {
        "power": 280,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Frozen": {
        "power": 80,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Fuel": {
        "power": 3253,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Ful'Mina the Mountain Queen": {
        "power": 78000,
        "effs": [0, 900, 0, 0, 0, 0, 0, 0, 0]
    },
    "Fungal Frog": {
        "power": 1250,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Fungal Spore": {
        "power": 11499,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Fungal Technomorph": {
        "power": 28901,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Funglore": {
        "power": 8525,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Furious Fir": {
        "power": 36000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Fuzzy Drake": {
        "power": 3175,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Gargantuamouse": {
        "power": 93997,
        "effs": [50, 50000, 0, 25, 25, 0, 25, 0, 0]
    },
    "Gargoyle": {
        "power": 5010,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Gate Guardian": {
        "power": 7600,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Gate Keeper": {
        "power": 25185,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Gelatinous Octahedron": {
        "power": 5000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Gemorpher": {
        "power": 8501,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Gemstone Worshipper": {
        "power": 3340,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "General Drheller": {
        "power": 23500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Gentleman Caller": {
        "power": 2000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Ghost": {
        "power": 2200,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Ghost Pirate Queen": {
        "power": 4000,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Giant Snail": {
        "power": 1515,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Gilded Leaf": {
        "power": 1400,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Gingerbread": {
        "power": 558,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Glacia Ice Fist": {
        "power": 1768,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Gladiator": {
        "power": 15600,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Glamorous Gladiator": {
        "power": 28575,
        "effs": [0, 0, 0, 0, 600, 0, 0, 0, 0]
    },
    "Glass Blower": {
        "power": 27899,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Glazy": {
        "power": 2,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Glitchpaw": {
        "power": 785,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Gluttonous Zombie": {
        "power": 820,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Goblin": {
        "power": 2290,
        "effs": [100, 0, 0, 100, 100, 175, 100, 0, 0]
    },
    "Gold": {
        "power": 350,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Goldleaf": {
        "power": 2100,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Golem": {
        "power": 6885,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Goliath Field": {
        "power": 11175,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Goopus Dredgemore": {
        "power": 38000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Gorgon": {
        "power": 9500,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Gourd Ghoul": {
        "power": 3500,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Gourdborg": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Grampa Golem": {
        "power": 2815,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Grand Master of the Dojo": {
        "power": 330997,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Grandfather": {
        "power": 7000,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Granite": {
        "power": 185,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Granny Spice": {
        "power": 4625,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Grave Robber": {
        "power": 2145,
        "effs": [100, 100, 100, 100, 100, 100, 100, 125, 300]
    },
    "Great Giftnapper": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Great Winter Hunt Impostor": {
        "power": 3780,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Greedy Al": {
        "power": 2400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Greenbeard": {
        "power": 11500,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Grey": {
        "power": 2,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Grey Recluse": {
        "power": 2500,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Greyrun": {
        "power": 913,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Grit Grifter": {
        "power": 10000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Grizzled Silth": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Ground Gavaleer": {
        "power": 12475,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Grubling": {
        "power": 1200,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Grubling Herder": {
        "power": 4000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Grunt": {
        "power": 4620,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Guardian": {
        "power": 13200,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Guppy": {
        "power": 4900,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Guqin Player": {
        "power": 4000,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Gyrologer": {
        "power": 18050,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Hall Monitor": {
        "power": 15500,
        "effs": [100, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Hans Cheesetian Squeakersen": {
        "power": 8000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Hapless": {
        "power": 570,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Hapless Marionette": {
        "power": 2,
        "effs": [25, 25, 25, 25, 100, 25, 100, 0, 0]
    },
    "Harbinger of Death": {
        "power": 4250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Hardboiled": {
        "power": 2500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Hardworking Hauler": {
        "power": 1400,
        "effs": [50, 0, 0, 0, 0, 50, 0, 200, 0]
    },
    "Hare Razer": {
        "power": 2600,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Harpy": {
        "power": 14500,
        "effs": [100, 0, 0, 100, 100, 175, 100, 0, 0]
    },
    "Harvest Harrier": {
        "power": 10867,
        "effs": [0, 0, 0, 0, 0, 200, 100, 0, 0]
    },
    "Harvester": {
        "power": 20700,
        "effs": [0, 0, 0, 0, 0, 200, 100, 0, 0]
    },
    "Hazmat": {
        "power": 5799,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Healer": {
        "power": 3650,
        "effs": [0, 0, 0, 100, 175, 0, 100, 0, 0]
    },
    "Heart of the Meteor": {
        "power": 1500000,
        "effs": [1000, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Heavy Blaster": {
        "power": 5000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Heinous Hemlock": {
        "power": 34000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Herbaceous Bravestalk": {
        "power": 4000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Herbicidal Maniac": {
        "power": 180000,
        "effs": [0, 0, 0, 0, 0, 0, 600, 0, 0]
    },
    "Herc": {
        "power": 21625,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "High Roller": {
        "power": 12500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Hired Eidolon": {
        "power": 11900,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Hoarder": {
        "power": 172,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Hollowed": {
        "power": 3500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 200]
    },
    "Hollowed Minion": {
        "power": 4000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 200]
    },
    "Hollowhead": {
        "power": 750,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Homeopathic Apothecary": {
        "power": 1300,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Hookshot": {
        "power": 4250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Hope": {
        "power": 10,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Horned Cork Hoarder": {
        "power": 8565,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Hot Head": {
        "power": 2300,
        "effs": [0, 0, 0, 0, 0, 0, 150, 0, 0]
    },
    "Humphrey Dumphrey": {
        "power": 9500,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Huntereater": {
        "power": 12551,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Hurdle": {
        "power": 1250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Hydra": {
        "power": 5000,
        "effs": [0, 0, 0, 175, 100, 0, 175, 0, 0]
    },
    "Hydrologist": {
        "power": 4970,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Hydrophobe": {
        "power": 1995,
        "effs": [0, 0, 0, 0, 200, 0, 125, 0, 0]
    },
    "Hypnotized Gunslinger": {
        "power": 6500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Ice Regent": {
        "power": 13000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Iceberg Sculptor": {
        "power": 2790,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Iceblade": {
        "power": 7700,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Iceblock": {
        "power": 5400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Icebreaker": {
        "power": 5000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Icewing": {
        "power": 25000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Icicle": {
        "power": 11340,
        "effs": [0, 0, 0, 200, 0, 0, 100, 0, 0]
    },
    "Iciclesius the Defender": {
        "power": 47000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Ignatia": {
        "power": 9400,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Ignis": {
        "power": 2300,
        "effs": [100, 100, 100, 100, 75, 400, 75, 0, 0]
    },
    "Illustrious Illusionist": {
        "power": 58000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Impersonator": {
        "power": 5,
        "effs": [25, 25, 25, 25, 200, 25, 100, 100, 0]
    },
    "Incendarius the Unquenchable": {
        "power": 42250,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Incompetent Ice Climber": {
        "power": 5000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Industrious Digger": {
        "power": 1150,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Inferna the Engulfed": {
        "power": 35325,
        "effs": [500, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Inferno Mage": {
        "power": 4800,
        "effs": [0, 0, 0, 100, 75, 0, 75, 0, 0]
    },
    "Infiltrator": {
        "power": 12500,
        "effs": [0, 0, 0, 0, 125, 0, 250, 0, 0]
    },
    "Invisible Fashionista": {
        "power": 48000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Itty Bitty Rifty Burroughs": {
        "power": 1250,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Itty-Bitty Burroughs": {
        "power": 8250,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Jellyfish": {
        "power": 4300,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Jovial Jailor": {
        "power": 17300,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Joy": {
        "power": 2,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Juliyes": {
        "power": 2999,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Jurassic": {
        "power": 13650,
        "effs": [0, 0, 0, 0, 0, 200, 0, 0, 0]
    },
    "Kalor'ignis of the Geyser": {
        "power": 59640,
        "effs": [0, 900, 0, 0, 0, 0, 0, 0, 0]
    },
    "Karmachameleon": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Keeper": {
        "power": 3485,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Keeper's Assistant": {
        "power": 3300,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Key Master": {
        "power": 23140,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Killer Krill": {
        "power": 36000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "King Grub": {
        "power": 499995,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "King Scarab": {
        "power": 999989,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Kite Flyer": {
        "power": 22275,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Knight": {
        "power": 800,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Koimaid": {
        "power": 2240,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Kung Fu": {
        "power": 5695,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Lab Technician": {
        "power": 1800,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Lady Coldsnap": {
        "power": 18500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Lambent": {
        "power": 1350,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Lambent Crystal": {
        "power": 8000,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Lancer Guard": {
        "power": 15532,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Land Loafer": {
        "power": 8000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Lasso Cowgirl": {
        "power": 2000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Launchpad Labourer": {
        "power": 9512,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Lawbender": {
        "power": 9680,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Leafton Beanwell": {
        "power": 13000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Leprechaun": {
        "power": 27200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Lethargic Guard": {
        "power": 19040,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Leviathan": {
        "power": 13706,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Lich": {
        "power": 20700,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Lightning Rod": {
        "power": 4,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Limestone Miner": {
        "power": 25101,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Little Bo Squeak": {
        "power": 10000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Little Miss Fluffet": {
        "power": 9000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Living Ice": {
        "power": 2000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Living Salt": {
        "power": 3000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Loathsome Locust": {
        "power": 20000,
        "effs": [0, 0, 0, 0, 0, 0, 500, 0, 0]
    },
    "Lockpick": {
        "power": 10,
        "effs": [25, 25, 25, 25, 200, 25, 100, 100, 0]
    },
    "Longtail": {
        "power": 80,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Lord Splodington": {
        "power": 12000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Lost": {
        "power": 6425,
        "effs": [100, 0, 125, 0, 0, 0, 0, 0, 0]
    },
    "Lost Legionnaire": {
        "power": 5300,
        "effs": [100, 0, 125, 0, 0, 0, 0, 0, 0]
    },
    "Loutish Loach": {
        "power": 25000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Lovely Sports": {
        "power": 650,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Lucky": {
        "power": 250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Lumahead": {
        "power": 8275,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Lumberjack": {
        "power": 26000,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Lumi-lancer": {
        "power": 23000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 175]
    },
    "Lunar Red Candle Maker": {
        "power": 88,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Lycan": {
        "power": 8765,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Lycanoid": {
        "power": 1100,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "M1000": {
        "power": 236000,
        "effs": [400, 400, 400, 400, 400, 400, 400, 400, 0]
    },
    "M400": {
        "power": 16400,
        "effs": [0, 0, 0, 0, 50, 0, 50, 0, 0]
    },
    "Mad Elf": {
        "power": 3780,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Madame d'Ormouse": {
        "power": 8500,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Mage Weaver": {
        "power": 29999,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Magic": {
        "power": 300,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Magic Champion": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Magical Multitasker": {
        "power": 71500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Magma Carrier": {
        "power": 14300,
        "effs": [0, 0, 0, 0, 0, 200, 0, 0, 0]
    },
    "Magmarage": {
        "power": 5500,
        "effs": [0, 0, 0, 100, 75, 0, 75, 0, 0]
    },
    "Magmatic Crystal Thief": {
        "power": 5499,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Magmatic Golem": {
        "power": 6000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Magnatius Majestica": {
        "power": 116000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Mairitime Pirate": {
        "power": 137485,
        "effs": [300, 300, 300, 300, 300, 300, 300, 300, 0]
    },
    "Maize Harvester": {
        "power": 3050,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Malevolent Maestro": {
        "power": 184600,
        "effs": [0, 0, 0, 0, 400, 0, 0, 0, 0]
    },
    "Malicious Marquis": {
        "power": 36660,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Malignus Vilestrom": {
        "power": 54250,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Mammoth": {
        "power": 7000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Manaforge Smith": {
        "power": 18501,
        "effs": [100, 0, 5000, 0, 0, 0, 0, 0, 0]
    },
    "Manatee": {
        "power": 3990,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Maniacal Maple": {
        "power": 25000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Market Guard": {
        "power": 42803,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Market Thief": {
        "power": 42900,
        "effs": [0, 0, 0, 0, 300, 0, 300, 400, 0]
    },
    "Martial": {
        "power": 8800,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 300]
    },
    "Masked Pikeman": {
        "power": 13601,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Master Burglar": {
        "power": 3000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 125, 100]
    },
    "Master Exploder": {
        "power": 1450,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Master of the Cheese Belt": {
        "power": 4000,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Master of the Cheese Claw": {
        "power": 4000,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Master of the Cheese Fang": {
        "power": 4000,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Master of the Chi Belt": {
        "power": 115000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 500]
    },
    "Master of the Chi Claw": {
        "power": 115000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 500]
    },
    "Master of the Chi Fang": {
        "power": 115000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 500]
    },
    "Master of the Dojo": {
        "power": 10000,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Matriarch Gander": {
        "power": 7000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Matron of Machinery": {
        "power": 16700,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Matron of Wealth": {
        "power": 15400,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mecha Tail": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Medicine": {
        "power": 1250,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Melancholy Merchant": {
        "power": 900,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Melodramatic Minnow": {
        "power": 11000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Menace of the Rift": {
        "power": 5003,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Menacing Medusozoa": {
        "power": 17500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mermouse": {
        "power": 3300,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Mermousette": {
        "power": 6380,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mershark": {
        "power": 7500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Meteorite Golem": {
        "power": 13650,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Meteorite Miner": {
        "power": 2550,
        "effs": [50, 0, 0, 0, 0, 50, 0, 200, 0]
    },
    "Meteorite Mover": {
        "power": 11000,
        "effs": [50, 0, 0, 0, 0, 50, 0, 200, 0]
    },
    "Meteorite Mystic": {
        "power": 17500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Meteorite Snacker": {
        "power": 1325,
        "effs": [50, 0, 0, 0, 0, 50, 0, 200, 0]
    },
    "Micro": {
        "power": 866,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Mighty Mite": {
        "power": 13000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mighty Mole": {
        "power": 1000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Mild Spicekin": {
        "power": 5725,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Militant Samurai": {
        "power": 18000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Mimic": {
        "power": 18051,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mind Tearer": {
        "power": 20250,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Miner": {
        "power": 3442,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Mining Materials Manager": {
        "power": 1650,
        "effs": [50, 0, 0, 0, 0, 50, 0, 200, 0]
    },
    "Mintaka": {
        "power": 8000,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Mischievous Meteorite Miner": {
        "power": 1950,
        "effs": [50, 0, 0, 0, 0, 50, 0, 200, 0]
    },
    "Mischievous Wereminer": {
        "power": 6825,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Miser": {
        "power": 2790,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Misfortune Teller": {
        "power": 35500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Missile Toe": {
        "power": 2400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Mist Maker": {
        "power": 91674,
        "effs": [0, 0, 0, 300, 0, 0, 0, 0, 0]
    },
    "Mixing Mishap": {
        "power": 28500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Mlounder Flounder": {
        "power": 3710,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mobster": {
        "power": 20400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Mole": {
        "power": 300,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Molten Midas": {
        "power": 491997,
        "effs": [100, 0, 5000, 0, 0, 0, 0, 0, 0]
    },
    "Monarch": {
        "power": 2530,
        "effs": [0, 0, 0, 0, 0, 0, 150, 0, 0]
    },
    "Monk": {
        "power": 6630,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Monsoon Maker": {
        "power": 9500,
        "effs": [100, 50, 0, 0, 0, 150, 0, 0, 0]
    },
    "Monster": {
        "power": 8240,
        "effs": [100, 0, 100, 100, 500, 500, 100, 100, 0]
    },
    "Monster of the Meteor": {
        "power": 88000,
        "effs": [1000, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Monster Tail": {
        "power": 3750,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Monstrous Abomination": {
        "power": 24998,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Monstrous Black Widow": {
        "power": 9000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 200]
    },
    "Monstrous Midge": {
        "power": 110000,
        "effs": [0, 0, 0, 0, 0, 0, 400, 0, 0]
    },
    "Moosker": {
        "power": 45,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Moss Comber": {
        "power": 14000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mossy Moosker": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Mouldy Mole": {
        "power": 5560,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Mountain": {
        "power": 1100,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Mousataur Priestess": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Mouse of Elements": {
        "power": 16000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 500]
    },
    "Mouse of Winter Future": {
        "power": 1276,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Mouse of Winter Past": {
        "power": 1768,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Mouse of Winter Present": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Mouse With No Name": {
        "power": 4999,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Mousevina von Vermin": {
        "power": 18300,
        "effs": [100, 0, 100, 0, 25, 2500, 25, 0, 0]
    },
    "Moussile": {
        "power": 700,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Mummy": {
        "power": 3860,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Muscular Mussel": {
        "power": 38000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mush": {
        "power": 7290,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Mush Monster": {
        "power": 13601,
        "effs": [275, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mushroom Harvester": {
        "power": 10851,
        "effs": [275, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mushroom Sprite": {
        "power": 8800,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Mutant Mongrel": {
        "power": 17499,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mutant Ninja": {
        "power": 11003,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mutated Behemoth": {
        "power": 25000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mutated Brown": {
        "power": 465,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Mutated Grey": {
        "power": 192,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Mutated Mole": {
        "power": 5004,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Mutated Siblings": {
        "power": 3500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Mutated White": {
        "power": 138,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Mysterious Traveller": {
        "power": 3253,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Mystic": {
        "power": 3250,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Mystic Bishop": {
        "power": 10800,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mystic Guardian": {
        "power": 40602,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mystic Herald": {
        "power": 20250,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mystic King": {
        "power": 24000,
        "effs": [0, 0, 0, 0, 0, 0, 2500, 0, 0]
    },
    "Mystic Knight": {
        "power": 8596,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mystic Pawn": {
        "power": 1800,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mystic Queen": {
        "power": 22004,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mystic Rook": {
        "power": 18620,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Mystic Scholar": {
        "power": 28901,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Mythical Dragon Emperor": {
        "power": 290000,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Mythical Giant King": {
        "power": 222150,
        "effs": [0, 0, 0, 0, 300, 0, 0, 0, 0]
    },
    "Mythical Master Sorcerer": {
        "power": 130000,
        "effs": [500, 0, 0, 0, 0, 500, 0, 0, 0]
    },
    "Mythweaver": {
        "power": 200000,
        "effs": [0, 0, 750, 0, 0, 0, 0, 0, 0]
    },
    "Nachore Golem": {
        "power": 2235,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Nachous the Molten": {
        "power": 26675,
        "effs": [0, 0, 0, 0, 0, 500, 0, 0, 0]
    },
    "Narrator": {
        "power": 1330,
        "effs": [0, 0, 0, 100, 100, 0, 175, 0, 0]
    },
    "Naturalist": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Naughty Nougat": {
        "power": 4428,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Necromancer": {
        "power": 2000,
        "effs": [125, 125, 125, 400, 75, 125, 75, 0, 0]
    },
    "Nefarious Nautilus": {
        "power": 15000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Nerg Chieftain": {
        "power": 12600,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Nerg Lich": {
        "power": 8000,
        "effs": [150, 0, 200, 0, 0, 125, 0, 0, 0]
    },
    "New Year's": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Nibbler": {
        "power": 275,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Nice Knitting": {
        "power": 419,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Night Shift Materials Manager": {
        "power": 5500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Night Watcher": {
        "power": 9587.5,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Nightfire": {
        "power": 67600,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Nightmancer": {
        "power": 41600,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Nightshade Flower Girl": {
        "power": 2800,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Nightshade Fungalmancer": {
        "power": 15400,
        "effs": [275, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Nightshade Maiden": {
        "power": 1600,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Nightshade Masquerade": {
        "power": 3800,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Nightshade Nanny": {
        "power": 16700,
        "effs": [275, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Nimbomancer": {
        "power": 13474,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Ninja": {
        "power": 1275,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Nitro Racer": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Nomad": {
        "power": 13175,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Nomadic Warrior": {
        "power": 2500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Noxio Sludgewell": {
        "power": 42400,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Nugget": {
        "power": 900,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Nutcracker": {
        "power": 2400,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Nyagarha the Falls Guardian": {
        "power": 270000,
        "effs": [0, 0, 0, 600, 0, 0, 0, 0, 0]
    },
    "Obstinate Oboist": {
        "power": 19000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Octomermaid": {
        "power": 6741,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Ol' King Coal": {
        "power": 1506,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Old One": {
        "power": 9850,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Old Spice Collector": {
        "power": 3800,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "One-Mouse Band": {
        "power": 11750,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 400]
    },
    "Onion Chopper": {
        "power": 2200,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Ooze": {
        "power": 5205,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Ore Chipper": {
        "power": 1720,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Ornament": {
        "power": 2790,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Outbreak Assassin": {
        "power": 17250,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Outlaw": {
        "power": 4500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Over-Prepared": {
        "power": 2280,
        "effs": [0, 0, 0, 200, 0, 0, 100, 0, 0]
    },
    "Overcaster": {
        "power": 17275,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Oxygen Baron": {
        "power": 7500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Pack": {
        "power": 2700,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Page": {
        "power": 275,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Paladin": {
        "power": 7700,
        "effs": [300, 200, 200, 200, 75, 200, 75, 0, 0]
    },
    "Paladin Weapon Master": {
        "power": 18501,
        "effs": [100, 0, 5000, 0, 0, 0, 0, 0, 0]
    },
    "Pan Slammer": {
        "power": 2500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Para Para Dancer": {
        "power": 900,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Paragon of Arcane": {
        "power": 225000,
        "effs": [500, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Paragon of Dragons": {
        "power": 151650,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Paragon of Forgotten": {
        "power": 315000,
        "effs": [0, 0, 500, 0, 0, 0, 0, 0, 0]
    },
    "Paragon of Shadow": {
        "power": 246650,
        "effs": [0, 0, 0, 0, 0, 500, 0, 0, 0]
    },
    "Paragon of Strength": {
        "power": 305875,
        "effs": [0, 0, 0, 0, 500, 0, 0, 0, 0]
    },
    "Paragon of Tactics": {
        "power": 246965,
        "effs": [0, 0, 0, 0, 0, 0, 500, 0, 0]
    },
    "Paragon of the Lawless": {
        "power": 124100,
        "effs": [0, 0, 0, 0, 0, 0, 0, 500, 0]
    },
    "Paragon of Water": {
        "power": 322000,
        "effs": [0, 0, 0, 500, 0, 0, 0, 0, 0]
    },
    "Parlour Player": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Party Head": {
        "power": 266,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Passenger": {
        "power": 3000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Pathfinder": {
        "power": 1500,
        "effs": [0, 0, 0, 100, 100, 0, 175, 0, 0]
    },
    "Peaceful Prisoner": {
        "power": 15000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Pearl": {
        "power": 5720,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Pearl Diver": {
        "power": 4960,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Pebble": {
        "power": 120,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Peevish Piccoloist": {
        "power": 21000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Peggy the Plunderer": {
        "power": 110950,
        "effs": [700, 700, 700, 700, 700, 700, 700, 700, 0]
    },
    "Penguin": {
        "power": 2508,
        "effs": [0, 0, 0, 200, 0, 0, 100, 0, 0]
    },
    "Pernicious Prince": {
        "power": 86363,
        "effs": [0, 0, 0, 0, 150, 0, 0, 0, 0]
    },
    "Perpetual Detention": {
        "power": 28500,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Pesky Pleco": {
        "power": 23000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Pestilentia the Putrid": {
        "power": 42250,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Phalanx": {
        "power": 900,
        "effs": [50, 50, 50, 50, 50, 50, 200, 0, 0]
    },
    "Phase Zombie": {
        "power": 975,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Photographer": {
        "power": 2752,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Pie Thief": {
        "power": 8600,
        "effs": [0, 0, 0, 0, 300, 0, 300, 400, 0]
    },
    "Pinchy": {
        "power": 635,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Pinkielina": {
        "power": 11000,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Pintail": {
        "power": 600,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Pirate": {
        "power": 1275,
        "effs": [100, 100, 100, 175, 100, 100, 100, 100, 0]
    },
    "Pirate Anchor": {
        "power": 6741,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Plague Hag": {
        "power": 8801,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Plotting Page": {
        "power": 32000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Plutonium Tentacle": {
        "power": 14999,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Pneumatic Dirt Displacement": {
        "power": 1200,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Pocketwatch": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 175, 0, 150, 0, 0]
    },
    "Polar Bear": {
        "power": 5200,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Pompous Perch": {
        "power": 9000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Portable Generator": {
        "power": 1000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Portal Paladin": {
        "power": 8000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Portal Plunderer": {
        "power": 1650,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Portal Pursuer": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 50]
    },
    "Possessed Armaments": {
        "power": 38000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 1000]
    },
    "Praetorian Champion": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Present": {
        "power": 778,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Prestigious Adventurer": {
        "power": 150000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 2500]
    },
    "Prestigious Prestidigitator": {
        "power": 53500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Primal": {
        "power": 12345,
        "effs": [0, 0, 0, 0, 0, 200, 0, 0, 0]
    },
    "Princess and the Olive": {
        "power": 9800,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Princess Fist": {
        "power": 15500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Prospector": {
        "power": 1750,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Protector": {
        "power": 10400,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Prototype": {
        "power": 950,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Puddlemancer": {
        "power": 9925,
        "effs": [0, 0, 0, 0, 200, 0, 125, 0, 0]
    },
    "Puffer": {
        "power": 3990,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Pugilist": {
        "power": 70,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Pump Raider": {
        "power": 1915,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Pumpkin Head": {
        "power": 2400,
        "effs": [0, 0, 0, 0, 0, 200, 100, 0, 0]
    },
    "Pumpkin Hoarder": {
        "power": 1600,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Puppet Champion": {
        "power": 72000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 900]
    },
    "Puppet Master": {
        "power": 100,
        "effs": [25, 25, 25, 25, 100, 25, 100, 0, 0]
    },
    "Puppetto": {
        "power": 2900,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Pygmy Wrangler": {
        "power": 2400,
        "effs": [0, 0, 100, 0, 0, 200, 0, 0, 0]
    },
    "Pyrehyde": {
        "power": 13700,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Pyrite": {
        "power": 650,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Queen Quesada": {
        "power": 42000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 500, 0]
    },
    "Queso Extractor": {
        "power": 4310,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Quesodillo": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Quillback": {
        "power": 8000,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Radioactive Ooze": {
        "power": 1601,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Rain Collector": {
        "power": 2400,
        "effs": [100, 50, 0, 0, 0, 150, 0, 0, 0]
    },
    "Rain Summoner": {
        "power": 7000,
        "effs": [100, 50, 0, 0, 0, 150, 0, 0, 0]
    },
    "Rain Wallower": {
        "power": 3800,
        "effs": [100, 50, 0, 0, 0, 150, 0, 0, 0]
    },
    "Rainbow Racer": {
        "power": 2790,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Rainmancer": {
        "power": 18500,
        "effs": [100, 50, 0, 0, 0, 150, 0, 0, 0]
    },
    "Rainwater Purifier": {
        "power": 3500,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Rambunctious Rain Rumbler": {
        "power": 13700,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Rampaging Redwood": {
        "power": 38000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Rancid Bog Beast": {
        "power": 2199,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Ravenous Zombie": {
        "power": 2385,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Raw Diamond": {
        "power": 1525,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Reality Restitch": {
        "power": 300,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Realm Ripper": {
        "power": 3200,
        "effs": [400, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Reanimated Carver": {
        "power": 14651,
        "effs": [100, 0, 125, 0, 0, 0, 0, 0, 0]
    },
    "Reaper": {
        "power": 11400,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Record Keeper": {
        "power": 2300,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Record Keeper's Assistant": {
        "power": 1650,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Red Coat Bear": {
        "power": 1750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Red Envelope": {
        "power": 888,
        "effs": [101, 101, 101, 101, 101, 101, 101, 300, 300]
    },
    "Red-Eyed Watcher Owl": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Regal Spearman": {
        "power": 68550,
        "effs": [0, 300, 0, 0, 0, 0, 0, 0, 0]
    },
    "Reinbo": {
        "power": 1275,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Relic Hunter": {
        "power": 1250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Renegade": {
        "power": 9700,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Retired Minotaur": {
        "power": 1824975,
        "effs": [100, 0, 5000, 0, 0, 0, 0, 0, 0]
    },
    "Reveling Lycanthrope": {
        "power": 7637.5,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Revenant": {
        "power": 1150,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Ribbon": {
        "power": 106,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Richard the Rich": {
        "power": 33725,
        "effs": [200, 200, 200, 200, 200, 200, 200, 200, 0]
    },
    "Ridiculous Sweater": {
        "power": 558,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Rift Bio Engineer": {
        "power": 980,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Rift Guardian": {
        "power": 1225,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Rift Tiger": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Rifterranian": {
        "power": 1250,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Riftweaver": {
        "power": 900,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Rimeus Polarblast": {
        "power": 54250,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Riptide": {
        "power": 3260,
        "effs": [150, 0, 200, 0, 0, 200, 0, 0, 0]
    },
    "Robat": {
        "power": 975,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Rock Muncher": {
        "power": 1145,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Rocketeer": {
        "power": 27300,
        "effs": [0, 0, 0, 0, 0, 0, 600, 0, 0]
    },
    "Rockstar": {
        "power": 3000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Rogue": {
        "power": 600,
        "effs": [25, 25, 25, 25, 200, 25, 100, 100, 0]
    },
    "Romeno": {
        "power": 1,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Romeo": {
        "power": 3000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Root Rummager": {
        "power": 9000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "RR-8": {
        "power": 7900,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Rubble Rouser": {
        "power": 4225,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Rubble Rummager": {
        "power": 3480,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Ruffian": {
        "power": 2000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "S.N.O.W. Golem": {
        "power": 4720,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Saboteur": {
        "power": 4500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sacred Shrine": {
        "power": 5200,
        "effs": [300, 200, 200, 200, 75, 200, 75, 0, 0]
    },
    "Saloon Gal": {
        "power": 1750,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Salt Water Snapper": {
        "power": 1650,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Saltwater Axolotl": {
        "power": 3990,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Samurai": {
        "power": 6630,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Sand Cavalry": {
        "power": 5500,
        "effs": [0, 0, 0, 75, 75, 0, 100, 0, 0]
    },
    "Sand Colossus": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Sand Dollar Diver": {
        "power": 3750,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sand Dollar Queen": {
        "power": 4300,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sand Pilgrim": {
        "power": 3000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Sand Sifter": {
        "power": 9000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sandmouse": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Sandwing Cavalry": {
        "power": 6200,
        "effs": [0, 0, 0, 75, 75, 0, 100, 0, 0]
    },
    "Sanguinarian": {
        "power": 13601,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Sap Stealer": {
        "power": 16000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Sarcophamouse": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Sardonic Sapling": {
        "power": 15500,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Sassy Salsa Dancer": {
        "power": 24000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Scarab": {
        "power": 7998,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Scarecrow": {
        "power": 2645,
        "effs": [0, 0, 0, 0, 0, 200, 100, 0, 0]
    },
    "Scarlet Revenger": {
        "power": 114000,
        "effs": [300, 300, 300, 300, 300, 300, 300, 300, 0]
    },
    "Scavenger": {
        "power": 5205,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Scheming Squire": {
        "power": 38000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "School of Mish": {
        "power": 3930,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Scorned Pirate": {
        "power": 2350,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Scornful Scallop": {
        "power": 20000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Scout": {
        "power": 1750,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Scrap Metal Monster": {
        "power": 10000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Scribe": {
        "power": 26999,
        "effs": [0, 0, 0, 0, 300, 0, 275, 0, 0]
    },
    "Scrooge": {
        "power": 2064,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Scruffy": {
        "power": 120,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Seadragon": {
        "power": 4900,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Seasoned Islandographer": {
        "power": 20550,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Seer": {
        "power": 8800,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Sentient Slime": {
        "power": 1750,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Sentinel": {
        "power": 4800,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Serpent Monster": {
        "power": 26599,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Serpentine": {
        "power": 7998,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Shackled Servant": {
        "power": 5800,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Shade of the Eclipse": {
        "power": 7000000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100000]
    },
    "Shadow Master Sorcerer": {
        "power": 78000,
        "effs": [100, 0, 0, 0, 0, 400, 0, 0, 0]
    },
    "Shadow Sage": {
        "power": 73500,
        "effs": [0, 0, 0, 0, 0, 300, 0, 0, 0]
    },
    "Shadow Stalker": {
        "power": 51990,
        "effs": [0, 0, 50, 0, 0, 0, 0, 0, 0]
    },
    "Shaman": {
        "power": 755,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Shaolin Kung Fu": {
        "power": 12375,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Shard Centurion": {
        "power": 1340,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Sharpshooter": {
        "power": 4999,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Shattered Carmine": {
        "power": 40000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Shattered Obsidian": {
        "power": 8325,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Shelder": {
        "power": 1270,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Shifty Shrimp": {
        "power": 27000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Shinobi": {
        "power": 2910,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Shipwrecked": {
        "power": 1485,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Shopkeeper": {
        "power": 1500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Shortcut": {
        "power": 1750,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Shorts-All-Year": {
        "power": 2064,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Shroom": {
        "power": 7000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Silth": {
        "power": 60001,
        "effs": [100, 0, 0, 175, 100, 100, 125, 0, 0]
    },
    "Silvertail": {
        "power": 500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Sinister Egg Painter": {
        "power": 1100,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Sinister Squid": {
        "power": 13000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sir Fleekio": {
        "power": 16700,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Siren": {
        "power": 5508,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Sizzle Pup": {
        "power": 5725,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Skeletal Champion": {
        "power": 1550,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Skeleton": {
        "power": 3175,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Sky Dancer": {
        "power": 18375,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Sky Glass Glazier": {
        "power": 16100,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Sky Glass Sorcerer": {
        "power": 11000,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Sky Glider": {
        "power": 24350,
        "effs": [600, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Sky Greaser": {
        "power": 8185,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Sky Highborne": {
        "power": 64845,
        "effs": [300, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Sky Squire": {
        "power": 80460,
        "effs": [0, 0, 0, 0, 300, 0, 0, 0, 0]
    },
    "Sky Surfer": {
        "power": 20374,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sky Swordsman": {
        "power": 18610,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Skydiver": {
        "power": 5950,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Slay Ride": {
        "power": 1067,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Slayer": {
        "power": 9800,
        "effs": [0, 0, 0, 0, 0, 0, 175, 0, 0]
    },
    "Sleep Starved Scholar": {
        "power": 44000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Sleepwalker": {
        "power": 800,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Sleepy Merchant": {
        "power": 420,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Slimefist": {
        "power": 18500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Slope Swimmer": {
        "power": 600,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Sludge": {
        "power": 3900,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sludge Scientist": {
        "power": 462,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Sludge Soaker": {
        "power": 7400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sludge Swimmer": {
        "power": 19000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Smoldersnap": {
        "power": 7820,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Smug Smuggler": {
        "power": 30000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Snake Charmer": {
        "power": 6351,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Snooty": {
        "power": 4000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snow Boulder": {
        "power": 419,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snow Bowler": {
        "power": 6500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Snow Fort": {
        "power": 712,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snow Golem Architect": {
        "power": 882,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snow Golem Jockey": {
        "power": 847,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snow Scavenger": {
        "power": 1506,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snow Slinger": {
        "power": 5400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Snow Sniper": {
        "power": 5600,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Snow Soldier": {
        "power": 5200,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Snow Sorceress": {
        "power": 1508,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snowball Hoarder": {
        "power": 558,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snowblind": {
        "power": 5600,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Snowblower": {
        "power": 1768,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snowflake": {
        "power": 286,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Snowglobe": {
        "power": 1506,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Sock Puppet Ghost": {
        "power": 210,
        "effs": [25, 25, 25, 25, 100, 25, 100, 0, 0]
    },
    "Soldier of the Shade": {
        "power": 350000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 5000]
    },
    "Solemn Soldier": {
        "power": 40602,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Soothsayer": {
        "power": 6775,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Sorcerer": {
        "power": 5208,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Soul Binder": {
        "power": 18501,
        "effs": [100, 0, 5000, 0, 0, 0, 0, 0, 0]
    },
    "Sour Sprout": {
        "power": 22000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Space Party-Time Plumber": {
        "power": 500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Spear Fisher": {
        "power": 9850,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Spectral Butler": {
        "power": 3200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Spectral Swashbuckler": {
        "power": 3000,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Spectre": {
        "power": 5210,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Speedy": {
        "power": 120,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Spellbinder": {
        "power": 5350,
        "effs": [0, 0, 0, 0, 175, 0, 0, 0, 0]
    },
    "Spheric Diviner": {
        "power": 86670,
        "effs": [0, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Spice Farmer": {
        "power": 2455,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Spice Finder": {
        "power": 5575,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Spice Merchant": {
        "power": 13950,
        "effs": [0, 0, 0, 0, 300, 0, 300, 300, 0]
    },
    "Spice Raider": {
        "power": 3810,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Spice Reaper": {
        "power": 6700,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Spice Seer": {
        "power": 1873,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Spice Sovereign": {
        "power": 3080,
        "effs": [100, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    "Spider": {
        "power": 5205,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Spiked Burrower": {
        "power": 5750,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Spiky Devil": {
        "power": 3000,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Spirit Fox": {
        "power": 1750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Spirit Light": {
        "power": 600,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Spirit of Balance": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Spiritual Steel": {
        "power": 1340,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Splintered Stone Sentry": {
        "power": 7050,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Spore": {
        "power": 3000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Spore Muncher": {
        "power": 5275,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Spore Salesman": {
        "power": 2200,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Sporeticus": {
        "power": 5175,
        "effs": [0, 0, 100, 100, 0, 0, 0, 0, 0]
    },
    "Sporty Ski Instructor": {
        "power": 680,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Spotted": {
        "power": 5,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Spring Familiar": {
        "power": 10500,
        "effs": [0, 0, 0, 0, 200, 0, 125, 0, 0]
    },
    "Spring Sprig": {
        "power": 2250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Sprinkly Sweet Cupcake Cook": {
        "power": 1000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Spry Sky Explorer": {
        "power": 9594,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Spry Sky Seer": {
        "power": 16175,
        "effs": [0, 0, 100, 0, 0, 0, 0, 0, 0]
    },
    "Spud": {
        "power": 250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Squeaken": {
        "power": 13250,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Squeaker Bot": {
        "power": 65,
        "effs": [100, 0, 100, 100, 100, 100, 100, 100, 0]
    },
    "Squeaker Claws": {
        "power": 5210,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Squire Sizzleton": {
        "power": 38000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Stack of Thieves": {
        "power": 8400,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Stagecoach Driver": {
        "power": 4500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Stalagmite": {
        "power": 14799,
        "effs": [0, 0, 200, 0, 0, 0, 0, 0, 0]
    },
    "Stealth": {
        "power": 300,
        "effs": [25, 25, 25, 25, 200, 25, 100, 100, 0]
    },
    "Steam Grip": {
        "power": 23001,
        "effs": [0, 0, 0, 0, 300, 0, 275, 0, 0]
    },
    "Steam Sailor": {
        "power": 5365,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Steel": {
        "power": 160,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Steel Horse Rider": {
        "power": 4999,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Stickybomber": {
        "power": 4500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Stinger": {
        "power": 13200,
        "effs": [0, 0, 0, 0, 0, 0, 150, 0, 0]
    },
    "Stingray": {
        "power": 4300,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Stocking": {
        "power": 3245,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Stone Cutter": {
        "power": 2100,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Stone Maiden": {
        "power": 3950,
        "effs": [0, 0, 100, 50, 0, 0, 0, 0, 0]
    },
    "Stonework Warrior": {
        "power": 13450,
        "effs": [0, 0, 0, 0, 0, 200, 0, 0, 0]
    },
    "Stormsurge the Vile Tempest": {
        "power": 52750,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Stoutgear": {
        "power": 4000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Stowaway": {
        "power": 2501,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Stratocaster": {
        "power": 19700,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Strawberry Hotcakes": {
        "power": 4500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Stuck Snowball": {
        "power": 1068,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Student of the Cheese Belt": {
        "power": 2200,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Student of the Cheese Claw": {
        "power": 2200,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Student of the Cheese Fang": {
        "power": 2200,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Student of the Chi Belt": {
        "power": 15000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Student of the Chi Claw": {
        "power": 15000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Student of the Chi Fang": {
        "power": 15000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Stuffy Banker": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Suave Pirate": {
        "power": 18510,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 0]
    },
    "Subterranean": {
        "power": 9500,
        "effs": [100, 0, 0, 0, 100, 100, 100, 0, 0]
    },
    "Sugar Rush": {
        "power": 3200,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Sulfurious the Raging Inferno": {
        "power": 189500,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Sultry Saxophonist": {
        "power": 23000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Summer Mage": {
        "power": 19800,
        "effs": [0, 0, 0, 0, 0, 0, 150, 0, 0]
    },
    "Summoning Scholar": {
        "power": 7900,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Sunken Banshee": {
        "power": 9850,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sunken Citizen": {
        "power": 3930,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Super FighterBot MegaSupreme": {
        "power": 2450,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Super Mega Mecha Ultra RoboGold": {
        "power": 2300,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Supernatural": {
        "power": 980,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Supply Hoarder": {
        "power": 4999,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Supreme Sensei": {
        "power": 404014,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Supremia Magnificus": {
        "power": 250000,
        "effs": [0, 500, 0, 0, 0, 0, 0, 0, 0]
    },
    "Surgeon Bot": {
        "power": 975,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Swabbie": {
        "power": 570,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Swamp Runner": {
        "power": 2150,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Swamp Thang": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Swarm of Pygmy Mice": {
        "power": 1800,
        "effs": [0, 0, 100, 0, 0, 200, 0, 0, 0]
    },
    "Swashblade": {
        "power": 8709,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Sylvan": {
        "power": 200,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Tackle Tracker": {
        "power": 10000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Tadpole": {
        "power": 5400,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Taleweaver": {
        "power": 1600,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Tanglefoot": {
        "power": 4420,
        "effs": [0, 0, 0, 0, 200, 0, 125, 0, 0]
    },
    "Tech Golem": {
        "power": 40602,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Tech Ravenous Zombie": {
        "power": 1100,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Technic Bishop": {
        "power": 10800,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Technic King": {
        "power": 24000,
        "effs": [0, 0, 0, 0, 0, 0, 2500, 0, 0]
    },
    "Technic Knight": {
        "power": 8596,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Technic Pawn": {
        "power": 1800,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Technic Queen": {
        "power": 22004,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Technic Rook": {
        "power": 18620,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Teenage Vampire": {
        "power": 100,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Telekinetic Mutant": {
        "power": 14498,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Teleporting Truant": {
        "power": 65000,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Tentacle": {
        "power": 12000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Terra": {
        "power": 2200,
        "effs": [100, 100, 100, 100, 75, 400, 75, 0, 0]
    },
    "Terrible Twos": {
        "power": 300,
        "effs": [25, 25, 25, 25, 25, 25, 25, 100, 25]
    },
    "Terrified Adventurer": {
        "power": 100,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 150]
    },
    "Terror Knight": {
        "power": 5750,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "The Menace": {
        "power": 20000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "The Total Eclipse": {
        "power": 13500000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100000]
    },
    "Theurgy Warden": {
        "power": 10498,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Thirsty": {
        "power": 999,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Thistle": {
        "power": 4000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Thorn": {
        "power": 6000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Three'amat the Mother of Dragons": {
        "power": 72000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Thunder Strike": {
        "power": 1600,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Thundering Watcher": {
        "power": 16500,
        "effs": [0, 300, 0, 0, 0, 0, 0, 0, 0]
    },
    "Tidal Fisher": {
        "power": 2500,
        "effs": [150, 0, 125, 0, 0, 200, 0, 0, 0]
    },
    "Tiger": {
        "power": 6700,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Time Punk": {
        "power": 1000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Time Tailor": {
        "power": 1500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Time Thief": {
        "power": 2850,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Timeless Lich": {
        "power": 9500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 300]
    },
    "Timelost Thaumaturge": {
        "power": 4700,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Timeslither Pythoness": {
        "power": 8800,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Timid Explorer": {
        "power": 3300,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 100]
    },
    "Tiny": {
        "power": 7,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Tiny Dragonfly": {
        "power": 10390,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Tiny Saboteur": {
        "power": 1120,
        "effs": [0, 0, 0, 0, 0, 0, 0, 100, 0]
    },
    "Tiny Toppler": {
        "power": 2815,
        "effs": [0, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Titanic Brain-Taker": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Toboggan Technician": {
        "power": 1067,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Tomb Exhumer": {
        "power": 1100,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 200]
    },
    "Tome Sprite": {
        "power": 6200,
        "effs": [0, 0, 0, 0, 125, 0, 200, 0, 0]
    },
    "Tonic Salesman": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Torchbearer Tinderhelm": {
        "power": 42400,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Totally Not Tax Fraud": {
        "power": 650,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Toxic Avenger": {
        "power": 2100,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Toxic Warrior": {
        "power": 17000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Toxikinetic": {
        "power": 1700,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Toy": {
        "power": 419,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Toy Sylvan": {
        "power": 3,
        "effs": [25, 25, 25, 25, 100, 25, 100, 0, 0]
    },
    "Toy Tinkerer": {
        "power": 680,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Trailblazer": {
        "power": 2500,
        "effs": [0, 0, 0, 100, 175, 0, 100, 0, 0]
    },
    "Train Conductor": {
        "power": 3253,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Train Engineer": {
        "power": 3499,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Trampoline": {
        "power": 750,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Tranquilia Protecticus": {
        "power": 25000,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Travelling Barber": {
        "power": 3253,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Treacherous Tubaist": {
        "power": 77925,
        "effs": [0, 0, 0, 0, 150, 0, 0, 0, 0]
    },
    "Treant": {
        "power": 760,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Treant Queen": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Treasure Brawler": {
        "power": 27900,
        "effs": [100, 0, 300, 0, 0, 0, 0, 0, 0]
    },
    "Treasure Hoarder": {
        "power": 6549,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Treasure Keeper": {
        "power": 8600,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Treasurer": {
        "power": 2000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Treat": {
        "power": 2000,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Tree Troll": {
        "power": 2000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Tri-dra": {
        "power": 7500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Trick": {
        "power": 2000,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Tricky Witch": {
        "power": 1250,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Triple Lutz": {
        "power": 266,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Tritus": {
        "power": 68501,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Troll": {
        "power": 14460,
        "effs": [100, 0, 0, 100, 100, 175, 100, 0, 0]
    },
    "Tumbleweed": {
        "power": 1375,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Tundra Huntress": {
        "power": 5582,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Turret Guard": {
        "power": 9850,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Twisted Carmine": {
        "power": 20000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Twisted Fiend": {
        "power": 3000,
        "effs": [150, 0, 125, 0, 0, 200, 0, 0, 0]
    },
    "Twisted Hotcakes": {
        "power": 7501,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Twisted Lilly": {
        "power": 9499,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Twisted Treant": {
        "power": 1500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Twisted Twig": {
        "power": 17500,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Tyrannical Thaumaturge": {
        "power": 100000,
        "effs": [150, 0, 0, 0, 0, 100, 0, 0, 0]
    },
    "Uncoordinated Cauldron Carrier": {
        "power": 31500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Undertaker": {
        "power": 4500,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Unwavering Adventurer": {
        "power": 4800,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 175]
    },
    "Upper Class Lady": {
        "power": 2250,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Urchin King": {
        "power": 11150,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Vampire": {
        "power": 2340,
        "effs": [100, 0, 100, 0, 25, 200, 25, 0, 0]
    },
    "Vanguard": {
        "power": 4100,
        "effs": [0, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Vanquisher": {
        "power": 7450,
        "effs": [0, 0, 0, 175, 0, 0, 0, 0, 0]
    },
    "Vaporior": {
        "power": 10000,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Venomona Festerbloom": {
        "power": 82750,
        "effs": [0, 250, 0, 0, 0, 0, 0, 0, 0]
    },
    "Vicious Vampire Squid": {
        "power": 16000,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Vigilant Ward": {
        "power": 5000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Vincent the Magnificent": {
        "power": 4000,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Vindictive Viscount": {
        "power": 25000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Vinetail": {
        "power": 18900,
        "effs": [0, 0, 0, 0, 200, 0, 125, 0, 0]
    },
    "Vinneus Stalkhome": {
        "power": 80900,
        "effs": [0, 0, 0, 0, 400, 0, 0, 0, 0]
    },
    "Violent Violinist": {
        "power": 33090,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Violet Stormchild": {
        "power": 2200,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Wailing Willow": {
        "power": 27000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Walker": {
        "power": 14751,
        "effs": [0, 0, 0, 0, 125, 0, 250, 0, 0]
    },
    "Wandering Monk": {
        "power": 15275,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 200]
    },
    "Warden of Fog": {
        "power": 203580,
        "effs": [400, 400, 400, 400, 400, 400, 400, 400, 0]
    },
    "Warden of Frost": {
        "power": 203580,
        "effs": [400, 400, 400, 400, 400, 400, 400, 400, 0]
    },
    "Warden of Rain": {
        "power": 203580,
        "effs": [400, 400, 400, 400, 400, 400, 400, 400, 0]
    },
    "Warden of Wind": {
        "power": 203580,
        "effs": [400, 400, 400, 400, 400, 400, 400, 400, 0]
    },
    "Warehouse Manager": {
        "power": 4498,
        "effs": [0, 0, 0, 0, 0, 0, 0, 200, 0]
    },
    "Warming Wyvern": {
        "power": 7350,
        "effs": [0, 100, 0, 0, 0, 0, 0, 0, 0]
    },
    "Warmonger": {
        "power": 43007,
        "effs": [75, 0, 0, 75, 100, 0, 75, 0, 0]
    },
    "Water Nymph": {
        "power": 4280,
        "effs": [0, 0, 0, 175, 100, 0, 100, 0, 0]
    },
    "Water Sprite": {
        "power": 1750,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Water Wielder": {
        "power": 7500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Wave Racer": {
        "power": 1250,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Wealth": {
        "power": 1525,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Wealthy Werewarrior": {
        "power": 6142.5,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Werehauler": {
        "power": 5500,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Wereminer": {
        "power": 9425,
        "effs": [100, 0, 0, 0, 0, 150, 0, 0, 0]
    },
    "Whelpling": {
        "power": 1275,
        "effs": [0, 100, 0, 75, 75, 0, 75, 0, 0]
    },
    "Whimsical Waltzer": {
        "power": 22000,
        "effs": [0, 0, 0, 0, 100, 0, 0, 0, 0]
    },
    "Whirleygig": {
        "power": 2185,
        "effs": [0, 0, 0, 0, 0, 200, 100, 0, 0]
    },
    "White": {
        "power": 1,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "White Mage": {
        "power": 5200,
        "effs": [300, 200, 200, 200, 75, 200, 75, 0, 0]
    },
    "Wicked Witch of Whisker Woods": {
        "power": 1270,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Wiggler": {
        "power": 90,
        "effs": [100, 100, 100, 100, 100, 100, 175, 100, 0]
    },
    "Wight": {
        "power": 13780,
        "effs": [200, 0, 100, 0, 0, 100, 0, 0, 0]
    },
    "Wild Chainsaw": {
        "power": 1800,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Wily Weevil": {
        "power": 12000,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Wind Warrior": {
        "power": 21200,
        "effs": [150, 50, 0, 0, 0, 100, 0, 0, 0]
    },
    "Wind Watcher": {
        "power": 4100,
        "effs": [150, 50, 0, 0, 0, 100, 0, 0, 0]
    },
    "Windy Farmer": {
        "power": 2400,
        "effs": [100, 100, 0, 0, 0, 100, 0, 0, 0]
    },
    "Winged Harpy": {
        "power": 2500,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
    "Winter Games": {
        "power": 500,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Winter Mage": {
        "power": 21600,
        "effs": [0, 0, 0, 200, 0, 0, 100, 0, 0]
    },
    "Withered Remains": {
        "power": 29000,
        "effs": [0, 0, 0, 0, 0, 0, 0, 0, 700]
    },
    "Wolfskie": {
        "power": 5600,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Wordsmith": {
        "power": 3000,
        "effs": [0, 0, 0, 100, 175, 0, 100, 0, 0]
    },
    "Worker": {
        "power": 635,
        "effs": [0, 0, 0, 0, 100, 0, 175, 0, 0]
    },
    "Worried Wayfinder": {
        "power": 12410,
        "effs": [0, 0, 0, 0, 0, 0, 100, 0, 0]
    },
    "Wound Up White": {
        "power": 1,
        "effs": [25, 25, 25, 25, 100, 25, 100, 0, 0]
    },
    "Wrathful Warden": {
        "power": 70300,
        "effs": [0, 0, 0, 0, 150, 0, 0, 0, 0]
    },
    "Wreath Thief": {
        "power": 778,
        "effs": [100, 100, 100, 100, 100, 100, 100, 125, 100]
    },
    "Yeti": {
        "power": 6500,
        "effs": [0, 0, 0, 100, 0, 0, 0, 0, 0]
    },
    "Young Prodigy Racer": {
        "power": 712,
        "effs": [100, 100, 100, 100, 100, 100, 100, 100, 100]
    },
    "Zealous Academic": {
        "power": 28000,
        "effs": [0, 0, 0, 0, 0, 600, 0, 0, 0]
    },
    "Zephyr": {
        "power": 4100,
        "effs": [100, 100, 100, 100, 75, 400, 75, 0, 0]
    },
    "Zombie": {
        "power": 920,
        "effs": [100, 0, 100, 0, 100, 200, 25, 0, 0]
    },
    "Zombot Unipire": {
        "power": 330,
        "effs": [101, 101, 101, 101, 101, 101, 101, 101, 300]
    },
    "Zombot Unipire the Third": {
        "power": 1000,
        "effs": [10, 10, 10, 10, 10, 10, 10, 10, 100]
    },
  "Zurreal the Eternal": {
    "power": 73001,
    "effs": [0, 0, 0, 0, 0, 0, 5500, 0, 0]
  }
};

// All ar info guidelines
// The first entry, FTC can be
// 1) 0.00 to indicate this setup will never FTC
// 2) take a value like 0.05. to indicate the 'basic' setup has a 5% chance to FTC, and the sum of AR of the individual mouse should be 95%.
// 3) a value less than zero, e.g. -1.00, to indicate the AR depends on the actual cheese (e.g. gouda/brie),
//     and the AR of the individual mouse are adjusted in the dictionary so the sum is 100%.
//     This allows us to display the correct AR easily by using the known AR of the individual cheese.

var allType = ['Arcane', 'Draconic', 'Forgotten', 'Hydro', 'Physical', 'Shadow', 'Tactical', 'Law', 'Rift'];

var dragonbaneCharmMice = new Set([
    "Dragon",
    "Icewing",
    "Dragoon",
    "Ful'Mina the Mountain Queen",
    "Thunder Strike",
    "Thundering Watcher",
    "⚡Thunderlord⚡",
    "Violet Stormchild",
    "Fuzzy Drake",
    "Cork Defender",
    "Burly Bruiser",
    "Corky the Collector",
    "Horned Cork Hoarder",
    "Rambunctious Rain Rumbler",
    "Corkataur",
    "Steam Sailor",
    "Warming Wyvern",
    "Vaporior",
    "Pyrehyde",
    "Emberstone Scaled",
    "Mild Spicekin",
    "Sizzle Pup",
    "Smoldersnap",
    "Bearded Elder",
    "Ignatia",
    "Cinderstorm",
    "Bruticus the Blazing",
    "Stormsurge the Vile Tempest",
    "Kalor'ignis of the Geyser",
    "Tiny Dragonfly",
    "Lancer Guard",
    "Dragonbreather",
    "Regal Spearman",
    "Paragon of Dragons",
    "Empyrean Javelineer",
    "Absolutia Harmonius",
    "Arcticus the Biting Frost",
    "Avalancheus the Glacial",
    "Belchazar Banewright",
    "Blizzara Winterosa",
    "Chillandria Permafrost",
    "Colonel Crisp",
    "Combustius Furnaceheart",
    "Corrupticus the Blight Baron",
    "Crematio Scorchworth",
    "Dreck Grimehaven",
    "Flamina Cinderbreath",
    "Frigidocius Coldshot",
    "Frostnip Icebound",
    "Goopus Dredgemore",
    "Iciclesius the Defender",
    "Incendarius the Unquenchable",
    "Magnatius Majestica",
    "Malignus Vilestrom",
    "Mythical Dragon Emperor",
    "Noxio Sludgewell",
    "Pestilentia the Putrid",
    "Rimeus Polarblast",
    "Squire Sizzleton",
    "Sulfurious the Raging Inferno",
    "Supremia Magnificus",
    "Three'amat the Mother of Dragons",
    "Torchbearer Tinderhelm",
    "Tranquilia Protecticus",
    "Venomona Festerbloom"
]);

var SSSSTMice = new Set([
    "Barmy Gunner",
    "Pirate",
    "Corrupt Commodore",
    "Buccaneer",
    "Dread Pirate Mousert",
    "Deranged Deckhand",
    "Pirate Anchor",
    "Admiral Arrrgh",
    "Captain Cannonball",
    "Ghost Pirate Queen",
    "Scorned Pirate",
    "Suave Pirate",
    "Cutthroat Pirate",
    "Cutthroat Cannoneer",
    "Scarlet Revenger",
    "Mairitime Pirate",
    "Admiral Cloudbeard",
    "Peggy the Plunderer"
]);

var weremiceMice = new Set([
    "Night Shift Materials Manager",
    "Werehauler",
    "Wealthy Werewarrior",
    "Mischievous Wereminer",
    "Alpha Weremouse",
    "Reveling Lycanthrope",
    "Wereminer"
]);

var cosmicCritterMice = new Set([
    "Hypnotized Gunslinger",
    "Arcane Summoner",
    "Night Watcher",
    "Cursed Taskmaster",
    "Meteorite Golem",
    "Meteorite Mystic"
]);

var riftBases = new Set([
    "Attuned Enerchi Induction Base",
    "Clockwork Base",
    "Elixir Exchanger Base",
    "Enerchi Induction Base",
    "Fissure Base",
    "Fracture Base",
    "Mist Meter Regulator Base",
    "Prestige Base",
    "Rift Base",
    "Rift Mist Diffuser Base"
]);

var weaponName;
var baseName;
var charmName;
var baitName;
var locationName;
var trapPowerType;
var basicTrapPower;
var basicTrapPowerBonus;
var basicTrapPowerTotal;
var basicTrapLuck;
var basicTrapArBonus;
var trapPowerBoost;
var adjustedTrapLuck;
var riftLuckCodex;

function render() {
    const div = document.createElement("div");
    div.className = "min-luck-container";

    if (user.weapon_name == "Smoldering Stone Sentinel Trap"){
        div.classList.add('min-luck-container-ssst');
    }

    const luck_btn = document.createElement("img");
    luck_btn.src = 'https://www.mousehuntgame.com/images/ui/camp/trap/stat_luck.png?asset_cache_version=2'
    luck_btn.className = "min-luck-button"
    luck_btn.onclick = function () {
        renderBox();
    }

    div.appendChild(luck_btn);
    const trap_container = document.getElementsByClassName("trapImageView-trapAuraContainer")[0]
    trap_container.insertAdjacentElement("afterend", div);
    colourClover();
}

let tem_data = [];
async function refreshData() {
    weaponName = user.weapon_name;
    baseName = user.base_name;
    charmName = user.trinket_name;
    // Protection against error when no charm is armed.
    if (charmName == null)
        charmName = "";
    baitName = user.bait_name;
    trapPowerType = user.trap_power_type_name;
    // locationName = user.environment_name // For some reason this is not updated upon travelling.
    let locationElem = document.getElementsByClassName("mousehuntHud-environmentName")[0];
    if (!locationElem) { // This does not exist on old hud
        locationName = document.getElementsByClassName("hud_location")[0].innerText;
    } else {
        locationName = locationElem.innerText;
    }
    logUserInfo();
    riftLuckCodex = user.quests.QuestCodexLibrary.active_codex_page_types.includes("rift_luck_codex_stat_item");

    var powerContainer = document.getElementsByClassName("campPage-trap-trapStat power")[0];
    getTrapStat(powerContainer);
    basicTrapPowerBonus = user.trap_power_bonus; // 0.77 for 77%
    basicTrapPowerTotal = user.trap_power;
    basicTrapLuck = user.trap_luck;
    basicTrapArBonus = Math.min(user.trap_attraction_bonus, 1.0);

    if (calcTrapTotalPower(basicTrapPower, basicTrapPowerBonus) != basicTrapPowerTotal) {
        logger("WARNING: Displayed trap power is " + basicTrapPowerTotal + " while the calculated trap power is " + calcTrapTotalPower(basicTrapPower, basicTrapPowerBonus));
    }
    //if (weapon == "S.S. Scoundrel Sleigher Trap" || weapon.includes("Anniversary") || weapon == "Zugzwang's Ultimate Move" || weapon == "Moonbeam Barrier Trap"){
    // alert("The extra stats from this weapon has not been factored in!")
    // }
    // if (charm == "Dragonbane Charm" || charm == "Super Dragonbane Charm" || charm == "Ultimate Charm" || charm == "EMP400 Charm"){
    //     alert("The extra stats from this charm has not been factored in!")
    // }
    const res = await postReq("https://www.mousehuntgame.com/managers/ajax/users/getmiceeffectiveness.php",
        `sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}`);
    try {
        var response = JSON.parse(res.responseText);
        tem_data = [];
        if (response) {
            var effect = ["Effortless", "Easy", "Moderate", "Challenging", "Difficult", "Overpowering", "Near Impossible", "Impossible"]
            for (var i = 0; i < effect.length; i++) {
                if (response.effectiveness[effect[i]]) {
                    for (var j = 0; j < response.effectiveness[effect[i]].mice.length; j++) {
                        tem_data.push(response.effectiveness[effect[i]].mice[j].name)
                    }
                }
            }
        }
    } catch (error) {
        console.error(error.stack);
    }
}

function getTrapStat(element) {
    basicTrapPower = 0;
    trapPowerBoost = 0;
    element.getElementsByClassName("math")[0].querySelectorAll(".campPage-trap-trapStat-mathRow").forEach(el => {
        let value = el.getElementsByClassName("campPage-trap-trapStat-mathRow-value")[0].textContent;
        // We must extract bonus first, otherwise all bonuses will be applied to raw
        if (value.match(/%/g)) {
        } else if (value.match(/[0-9,]+/g)) {
            if (el.getElementsByClassName("campPage-trap-trapStat-mathRow-name")[0].textContent == "Your trap is receiving a boost!") {
                // trap power boost is applied at the end in the CR formula.
                if (locationName != "Zugzwang's Tower") {
                    // We do not want to get the ZT power boost value as we want to calculate it manually.
                    trapPowerBoost += Number(value.match(/[0-9]/g).join(""));
                }
            } else if (el.getElementsByClassName("campPage-trap-trapStat-mathRow-name")[0].textContent == "Your trap is weakened!") {
                // trap power weakening is applied at the end in the CR formula.
                if (locationName != "Zugzwang's Tower") {
                    // We do not want to get the ZT power weakening value as we want to calculate it manually.
                    trapPowerBoost -= Number(value.match(/[0-9]/g).join(""));
                }
            } else {
                // not a boost or weakening
                basicTrapPower += Number(value.match(/[0-9]/g).join(""));
            }
        }
    })
}

function checkAuraActive(auraName) {
    var panel = document.getElementsByClassName(auraName);
    var isActive = panel[0].classList.contains('active')
    logger(isActive);
    return isActive
}

function removeBox() {
    document
        .querySelectorAll("#minluck-list")
        .forEach(el => el.remove())
}

function renderBox() {
    return new Promise((resolve, reject) => {
        removeBox();

        var power = Number(document.getElementsByClassName("campPage-trap-trapStat power")[0].children[1].innerText.match(/[0-9]/g).join(""))
        var luck = Number(document.getElementsByClassName("campPage-trap-trapStat luck")[0].children[1].innerText)
        var powerType = document.getElementsByClassName("campPage-trap-trapStat power")[0].children[1].innerText.match(/[a-zA-Z]+/g)[0];

        const div = document.createElement("div");
        div.id = "minluck-list";

        var vwvh = localStorage.getItem("Chro-minluck-vwvh")
        var turnRed;
        if (vwvh) {
            var position = JSON.parse(vwvh).split(",");
            div.style.left = position[0] + "vw";
            div.style.top = position[1] + "vh";
            turnRed = Number(position[2]);
        } else {
            turnRed = 60;
            localStorage.setItem("Chro-minluck-vwvh", JSON.stringify("35,28,60"));
        };

        const buttonDiv = document.createElement("div")
        buttonDiv.id = "button-Div"

        const infoButton = document.createElement("button");
        infoButton.id = "info-button"
        infoButton.textContent = "i"

        infoButton.onclick = function () {
            let position = JSON.parse(localStorage.getItem("Chro-minluck-vwvh")).split(",");
            let mes = prompt("More information can be found at:\nhttps://tsitu.github.io/MH-Tools/cre.html\nLast Updated 10 Sept 2025\n\n Change tool's position / Set % for red text?\n\n" +
                "Left: " + position[0] + "\nTop: " + position[1] + "\nRed text at: " + position[2] + "%", "35,28,60");
            if (mes == null || mes == "") {
                return
            } else {
                localStorage.setItem("Chro-minluck-vwvh", JSON.stringify(mes));
                renderBox();
            }
        }

        const minButton = document.createElement("button");
        minButton.id = "minimise-button"
        minButton.textContent = "-"
        minButton.onclick = function () {
            const minluckTable = document.getElementById("chro-minluck-table");
            if (minButton.textContent == "-") {
                minluckTable.classList.add("minimised");
                minButton.textContent = "+";
            } else if (minButton.textContent == "+") {
                minluckTable.classList.remove("minimised");
                minButton.textContent = "-";
            }
        }

        const closeButton = document.createElement("button");
        closeButton.id = "close-button";

        closeButton.textContent = "x";
        closeButton.onclick = function () {
            document.body.removeChild(div);
        };

        const setupInfo = document.createElement("div")
        setupInfo.className = "setup-info"
        setupInfo.textContent = "Catch Rate Estimator"

        const powerInfo = document.createElement("div")
        powerInfo.className = "power-info"
        powerInfo.textContent = "Power: ".concat(power)

        const luckInfo = document.createElement("div")
        luckInfo.className = "luck-info"
        luckInfo.textContent = "Luck: ".concat(luck);

        const locInfo = document.createElement("div")
        locInfo.className = "loc-info"
        locInfo.innerHTML = "Location: ".concat(locationName);
        if (locationName == "Afterword Acres") {
            locInfo.innerHTML = locInfo.innerHTML.concat("<p>Subjected to changes.");
        }
        else if (locationName == "Epilogue Falls") {
            locInfo.innerHTML = locInfo.innerHTML.concat("<p>Subjected to changes.");
        } else if (locationName == "Zugzwang's Tower") {
            if (weaponName == "Technic Pawn Pincher") {
                locInfo.innerHTML = locInfo.innerHTML.concat("<p>This trap has hidden stat changes<br>On Technic Pawn: + 10920 Power, + 51 Luck<br>On Mystic Pawn: - 60 Power, - 0.05 Luck");
            } else if (weaponName == "Mystic Pawn Pincher") {
                locInfo.innerHTML = locInfo.innerHTML.concat("<p>This trap has hidden stat changes<br>On Mystic Pawn: + 10920 Power, + 51 Luck<br>On Technic Pawn: - 60 Power, - 0.05 Luck");
            } else if (weaponName == "Obvious Ambush Trap") {
                locInfo.innerHTML = locInfo.innerHTML.concat("<p>This trap has hidden stat changes<br>On Technic mice: + 1800 Power, + 6 Luck<br>On Mystic mice: -2400 Power, - 9 Luck");
            } else if (weaponName == "Blackstone Pass Trap") {
                locInfo.innerHTML = locInfo.innerHTML.concat("<p>This trap has hidden stat changes<br>On Mystic mice: + 1800 Power, + 6 Luck<br>On Technic mice: -2400 Power, - 9 Luck");
            }
        }

        setupInfo.appendChild(locInfo);
        setupInfo.appendChild(powerInfo);
        setupInfo.appendChild(luckInfo);

        const table = document.createElement("table");
        table.id = "chro-minluck-table"

        const miceheader = document.createElement("th");
        miceheader.className = "chro-minluck-header-name"
        miceheader.innerText = "Mouse Name"
        table.appendChild(miceheader);

        const arheader = document.createElement("th");
        arheader.className = "chro-minluck-header-ar"
        arheader.innerText = "AR"
        table.appendChild(arheader);

        const minluckheader = document.createElement("th");
        minluckheader.className = "chro-minluck-header-minluck"
        minluckheader.innerText = "Minluck"
        table.appendChild(minluckheader);

        const crheader = document.createElement("th");
        crheader.className = "chro-minluck-header-cr"
        crheader.innerText = "CRE"
        table.appendChild(crheader);

        var relevantArInfo = getArInfo();
        var ftc = relevantArInfo.FTC;
        var ar_overAll = 0.0;
        var minLuck_overAll = 0.0;
        var cr_overAll = 0.0;
        var undefinedAr = false;

        for (var i = 0; i < tem_data.length; i++) {
            var row = document.createElement("tr");
            row.className = "chro-minluck-row"
            var mouseName = document.createElement("td");
            mouseName.innerText = tem_data[i];
            var mouseNameConverted = tem_data[i];
            var power_index = allType.indexOf(powerType);

            var cr, cr_string, minluck_string, ar_string;
            var mouse_info = allMiceInfo[mouseNameConverted];
            if (mouse_info) {
                var mice_power = mouse_info.power;
                var mice_eff = mouse_info.effs[power_index];

                cr = calculateCR(mouseNameConverted, mice_power, mice_eff);
                cr_string = convertCRToPercentage(cr);

                ar_string = relevantArInfo[mouseNameConverted];
                if (ar_string == undefined) {
                    ar_string = "";
                    undefinedAr = true;
                } else {
                    ar_string = adjustAr(ar_string, ftc);
                    ar_overAll = ar_overAll + ar_string;
                    cr_overAll = cr_overAll + ar_string * cr;
                    ar_string = convertDoubleToPercentage(ar_string);
                }

                minluck_string = mouseMinluck(mouseNameConverted, mice_power, mice_eff);
                var infinitySym = String.fromCharCode(0x221E)
                if (minluck_string == infinitySym) {
                    minLuck_overAll = infinitySym;
                } else if (minLuck_overAll != infinitySym && minluck_string > minLuck_overAll) {
                    minLuck_overAll = minluck_string;
                }
            } else {
                // Mouse not found in info list, credit to Xellis
                ar_string = cr_string = minluck_string = 'Unknown';
            }

            //attraction rate-------
            var aR = document.createElement("td");
            aR.className = "chro-minluck-data-ar";
            aR.innerText = ar_string;

            //minluck----
            var minLuck = document.createElement("td");
            minLuck.className = "chro-minluck-data-minluck";
            minLuck.innerText = minluck_string;
            if (adjustedTrapLuck >= minluck_string) {
                minLuck.classList.add('good-minluck');
            }

            //catch rate-------
            var cR = document.createElement("td");
            cR.className = "chro-minluck-data-cr";
            cR.innerText = cr_string;
            var cr_number = (parseInt(cr_string))
            if (cr_string == "100.00%") {
                cR.classList.add('good-minluck');
            } else if (cr_number <= turnRed) {
                cR.classList.add('bad-minluck');
            }

            row.appendChild(mouseName);
            row.appendChild(aR);
            row.appendChild(minLuck);
            row.appendChild(cR);
            table.appendChild(row);
        }

        var overAllStatRow = document.createElement("tr");
        overAllStatRow.className = "chro-minluck-row"

        var overAllStatTitle = document.createElement("td");
        overAllStatTitle.innerText = "Overall Stat";
        overAllStatTitle.className = "chro-minluck-header-name"

        var overAllStatAR = document.createElement("td");
        overAllStatAR.className = "chro-minluck-overall-ar"
        if (!undefinedAr) {
            overAllStatAR.innerText = convertDoubleToPercentage(ar_overAll);
        } else {
            arheader.innerText = ""
        }

        var overAllStatMinLuck = document.createElement("td");
        overAllStatMinLuck.className = "chro-minluck-overall-minluck"
        overAllStatMinLuck.innerText = minLuck_overAll;
         if (adjustedTrapLuck >= minLuck_overAll) {
            overAllStatMinLuck.classList.add('good-minluck');
        }

        var overAllStatCR = document.createElement("td");
        overAllStatCR.className = "chro-minluck-overall-cr"
        if (!undefinedAr) {
            overAllStatCR.innerText = convertDoubleToPercentage(cr_overAll);

            var cr_overAll_number = (parseInt(cr_overAll))
            if (overAllStatCR.innerText == "100.00%") {
                overAllStatCR.classList.add('good-minluck');
            } else if (cr_overAll_number <= turnRed) {
                overAllStatCR.classList.add('bad-minluck');
            }
        }

        overAllStatRow.appendChild(overAllStatTitle);
        overAllStatRow.appendChild(overAllStatAR);
        overAllStatRow.appendChild(overAllStatMinLuck);
        overAllStatRow.appendChild(overAllStatCR);
        table.appendChild(overAllStatRow);
        sortTable(table, 2, 3);

        buttonDiv.appendChild(infoButton);
        buttonDiv.appendChild(minButton);
        buttonDiv.appendChild(closeButton);
        div.appendChild(setupInfo);
        div.appendChild(buttonDiv)
        div.appendChild(table);
        document.body.appendChild(div);
        dragElement(div);
        resolve();
    })
}

// Sorting on minluck (desc) and CR (asc)
function sortTable(table_id, sortColumn1, sortColumn2) {
    var rowData = table_id.getElementsByTagName('tr');
    // Do not sort the last row as it's the overall stat.
    for (var i = 1; i < rowData.length - 1; i++) {
        for (var j = 0; j < rowData.length - (i + 1); j++) {
            var sortValue1 = Number(rowData.item(j).getElementsByTagName('td').item(sortColumn1).innerHTML.replace(/[^0-9\.]+/g, ""));
            var sortValue2 = Number(rowData.item(j + 1).getElementsByTagName('td').item(sortColumn1).innerHTML.replace(/[^0-9\.]+/g, ""));
            var sortValue3 = Number(rowData.item(j).getElementsByTagName('td').item(sortColumn2).innerHTML.replace(/[^0-9\.]+/g, ""));
            var sortValue4 = Number(rowData.item(j + 1).getElementsByTagName('td').item(sortColumn2).innerHTML.replace(/[^0-9\.]+/g, ""));

            if (sortValue1 < sortValue2 || (sortValue1 === sortValue2 && sortValue3 > sortValue4)) {
                table_id.insertBefore(rowData.item(j + 1), rowData.item(j));
            }
        }
    }
}

async function postReq(url, form) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(this);
            } else {
                reject(this);
            }
        };
        xhr.onerror = function () {
            reject(this);
        };
        xhr.send(form);
    });
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function convertDoubleToPercentage(value) {
    return (value * 100).toFixed(2) + '%'
}

function mouseMinluck(mouseName, mouse_power, eff) {
    eff = eff / 100;
    var adjustedMP = specialMPEff(mouseName, mouse_power, eff)[0];
    var adjustedEff = specialMPEff(mouseName, mouse_power, eff)[1];

    // Can't evalute infinity symbol, so was replaced with 9999 as minluck instead
    var infinitySym = String.fromCharCode(0x221E)
    if (adjustedEff === 0) {
        return infinitySym;
    }

    // Credits to Beeejk and Neb for minluck formula refinement to handle floats like MH does
    var minluck = Math.ceil(Math.ceil(Math.sqrt(adjustedMP / 2)) / Math.min(adjustedEff, 1.4));
    if (minluck >= 9999) {
        return infinitySym;
    } else {
        if (2 * Math.pow(Math.floor(Math.min(1.4, adjustedEff) * minluck), 2) >= adjustedMP) {
            return minluck
        } else {
            minluck = minluck + 1
            return minluck
        };
    }
};

// Credits to Leppy for including this section to handle special effects.
// Credit to tsitu's MH-Tools for documenting the effects and handling them in code.

function calcTrapTotalPower(rawPower, powerBonus) {
    // "Your trap is receiving a boost!" is applied right at the end.
    var result = rawPower * (1 + powerBonus) + trapPowerBoost;

    // The boost needs to be calculated separately for Zugzwang's Tower as the pincher traps modify the trap power.
    // No need to special treatment for F rift, Twisted Garden until they introduce some traps that have an effect in those areas.
    if (locationName == "Zugzwang's Tower") {
        result *= getZtAmp() / 100
    }
    return Math.ceil(result);
}

function calculateCR(mouseName, mPower, mEff) {
    mEff = mEff / 100;
    var adjustedMP = specialMPEff(mouseName, mPower, mEff)[0];
    var adjustedEff = specialMPEff(mouseName, mPower, mEff)[1];
    var result = CRSpecialBonusAndEffects(mouseName, adjustedMP, adjustedEff)
    return FinalCRModifier(result, mouseName);
}

function convertCRToPercentage(CR) {
    var finalResult = convertDoubleToPercentage(CR);
    if (finalResult == '100.00%' && CR != 1) {
        finalResult = '99.99%';
    }
    return finalResult;
}

// mEff already divided by 100;
function CRFormula(power, luck, mPower, mEff) {
    return Math.min(1, (power * mEff + 2 * Math.pow(Math.floor(luck * Math.min(mEff, 1.4)), 2)) / (mPower + power * mEff));
}

// mEff already divided by 100;
// Situations where we adjust the CR based on power/luck/mouse power.
// Any effect that are already displayed in game does not need to be handled here.
function CRSpecialBonusAndEffects(mouseName, mPower, mEff) {
    var adjustedTrapPower = basicTrapPower;
    var adjustedTrapPowerBonus = basicTrapPowerBonus;
    adjustedTrapLuck = basicTrapLuck;
    if (dragonbaneCharmMice.has(mouseName)) {
        if (checkAuraActive("QuestDragonsMightAura")) {
            // QuestDragonsMightAura gives +300% Power Bonus against Dragon mice
            logCRAdjustmentInfo(mouseName, "Dragon's Might Aura +300% power bonus");
            adjustedTrapPowerBonus += 3;
        }
        if (charmName == "Dragonbane Charm") {
            // When activated, the charm bursts out a jarring cold blast of air, providing a 300% Power Bonus, making these mice easier to catch.
            logCRAdjustmentInfo(mouseName, "DBC +300% power bonus");
            adjustedTrapPowerBonus += 3;
        } else if (charmName == "Super Dragonbane Charm") {
            // When activated, this super charm bursts out a jarring double cold blast of air, providing a 600% Power Bonus, making these mice much easier to catch.
            logCRAdjustmentInfo(mouseName, "SDBC +600% power bonus");
            adjustedTrapPowerBonus += 6;
        } else if (charmName == "Extreme Dragonbane Charm") {
            // When activated, this extreme charm bursts out a jarring triple cold blast of air, providing a 900% Power Bonus, making these mice a breeze to catch.
            logCRAdjustmentInfo(mouseName, "EDBC +900% power bonus");
            adjustedTrapPowerBonus += 9;
        } else if (charmName == "Ultimate Dragonbane Charm") {
            // When activated, this powerful charm bursts out a jarring quadruple cold blast of air, providing a 1200% Power Bonus, making these mice a breeze to catch.
            logCRAdjustmentInfo(mouseName, "UDBC +1200% power bonus");
            adjustedTrapPowerBonus += 12;
        }
    }
    if (locationName == "Fiery Warpath") {
        if (charmName == "Super Warpath Archer Charm" && ["Desert Archer", "Flame Archer", "Crimson Ranger"].includes(mouseName)) {
            // giving a power bonus against Marching Flame Archers (+50%)
            logCRAdjustmentInfo(mouseName, "Super Warpath Charm +50% power bonus");
            adjustedTrapPowerBonus += 0.5;
        } else if (charmName == "Super Warpath Cavalry Charm" && ["Sand Cavalry", "Sandwing Cavalry"].includes(mouseName)) {
            // giving a power bonus against Marching Flame Cavalry (+50%)
            logCRAdjustmentInfo(mouseName, "Super Warpath Charm +50% power bonus");
            adjustedTrapPowerBonus += 0.5;
        } else if (charmName == "Super Warpath Mage Charm" && ["Inferno Mage", "Magmarage"].includes(mouseName)) {
            // giving a power bonus against Marching Flame Mages (+50%)
            logCRAdjustmentInfo(mouseName, "Super Warpath Charm +50% power bonus");
            adjustedTrapPowerBonus += 0.5;
        } else if (charmName == "Super Warpath Scout Charm" && ["Vanguard", "Sentinel", "Crimson Watch"].includes(mouseName)) {
            // giving a power bonus against Marching Flame Scouts (+50%)
            logCRAdjustmentInfo(mouseName, "Super Warpath Charm +50% power bonus");
            adjustedTrapPowerBonus += 0.5;
        } else if (charmName == "Super Warpath Warrior Charm" && ["Desert Soldier", "Flame Warrior", "Crimson Titan"].includes(mouseName)) {
            // giving a power bonus against Marching Flame Warriors (+50%)
            logCRAdjustmentInfo(mouseName, "Super Warpath Charm +50% power bonus");
            adjustedTrapPowerBonus += 0.5;
        } else if (charmName == "Super Warpath Commander's Charm" &&
            mouseName == " Crimson Commander") {
            // This magical charm both assists in attracting and capturing Crimson Commanders of the Marching Flame
            logCRAdjustmentInfo(mouseName, "Super Warpath Charm +50% power bonus");
            adjustedTrapPowerBonus += 0.5;
        }
    }
    if (locationName == "Whisker Woods Rift") {
        if (charmName == "Taunting Charm" && ["Cyclops Barbarian", "Centaur Ranger", "Tri-dra", "Monstrous Black Widow"].includes(mouseName)) {
            var riftSet = riftCount();
            // Riftwalker set bonus for 2 pieces +20% power bonus
            // Riftwalker set bonus for 3 pieces +20% power bonus and +5 luck
            // Riftstalker set bonus for 2 pieces +40% power bonus
            // Riftstalker set bonus for 3 pieces +40% power bonus and +10 luck
            if (riftSet == 1) {
                if (riftLuckCodex) {
                    logCRAdjustmentInfo(mouseName, "Taunting Charm Riftstalker Set bonus +40% trap power bonus");
                    adjustedTrapPowerBonus += 0.4;
                } else {
                    logCRAdjustmentInfo(mouseName, "Taunting Charm Riftwalker Set bonus +20% trap power bonus");
                    adjustedTrapPowerBonus += 0.2;
                }
            }
            if (riftSet == 2) {
                // If we got a rift weapon and a rift base, the TEM would have already included the power bonus.
                if (riftLuckCodex) {
                    logCRAdjustmentInfo(mouseName, "Taunting Charm Riftstalker Set bonus +10 luck");
                    adjustedTrapLuck += 10;
                } else {
                    logCRAdjustmentInfo(mouseName, "Taunting Charm Riftwalker Set bonus +5 luck");
                    adjustedTrapLuck += 5;
                }
            }
        }
    }
    if (locationName == "Zugzwang's Tower") {
        if (weaponName == "Obvious Ambush Trap") {
            // Obvious Ambush and Blackstone Pass give +1800 Power on corresponding side, -2400 Power on opposite side
            if (mouseName.startsWith("Technic")) {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Tower side specific trap +1800 trap power");
                adjustedTrapPower += 1800;
                adjustedTrapLuck += 6;
            } else if (mouseName.startsWith("Mystic")) {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Tower side specific trap -2400 trap power");
                adjustedTrapPower -= 2400;
                adjustedTrapLuck -= 9;
            }
        } else if (weaponName == "Blackstone Pass Trap") {
            // Obvious Ambush and Blackstone Pass give +1800 Power on corresponding side, -2400 Power on opposite side
            if (mouseName.startsWith("Mystic")) {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Tower side specific trap +1800 trap power");
                adjustedTrapPower += 1800;
                adjustedTrapLuck += 6;
            } else if (mouseName.startsWith("Technic")) {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Tower side specific trap -2400 trap power");
                adjustedTrapPower -= 2400;
                adjustedTrapLuck -= 9;
            }
        } else if (weaponName == "Technic Pawn Pincher") {
            //  Pawn Pinchers give +10920 Power and +51 luck on corresponding Pawn, -60 Power and -0.05 Luck on opposite Pawn
            if (mouseName == "Technic Pawn") {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Tower pawn pincher trap +10920 trap power");
                adjustedTrapPower += 10920;
                adjustedTrapLuck += 51;
                } else if (mouseName == "Mystic Pawn") {
                    logCRAdjustmentInfo(mouseName, "Zugzwang's Tower pawn pincher trap -60 trap power, -5 luck");
                    adjustedTrapPower -= 60;
                    adjustedTrapLuck -= 0.05;
            }
        } else if (weaponName == "Mystic Pawn Pincher") {
            // Pawn Pinchers give +10920 Power +51 luck on corresponding Pawn, -60 Power and -0.05 Luck on opposite Pawn
            if (mouseName == "Mystic Pawn") {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Tower pawn pincher trap +10920 trap power");
                adjustedTrapPower += 10920;
                adjustedTrapLuck += 51;
                } else if (mouseName == "Technic Pawn") {
                    logCRAdjustmentInfo(mouseName, "Zugzwang's Tower pawn pincher trap -60 trap power, -5 luck");
                    adjustedTrapPower -= 60;
                    adjustedTrapLuck -= 0.05;
            }
        }
        if (charmName == "Rook Crumble Charm" && ["Mystic Rook", "Technic Rook"].includes(mouseName)) {
            // Rook Crumble Charm gives +300% Power Bonus on Rook mice.
            logCRAdjustmentInfo(mouseName, "Zugzwang's Tower rook crumble charm +300% power bonus");
            adjustedTrapPowerBonus += 3;
        }
    }
    if (locationName == "Sand Crypts") {
        if (["King Grub", "King Scarab"].includes(mouseName)) {
            var minigameContainer = document.getElementsByClassName("minigameContainer grubling")[0];
            if (minigameContainer) {
                var saltContainer = minigameContainer.getElementsByClassName("salt_charms")[0];
                logger(saltContainer);
                if (saltContainer && saltContainer.textContent != "0") {
                    // Weaken the King Grub with Grub Salt charms, and then use a Grub Scent charm to attract it when you're ready!
                    logCRAdjustmentInfo(mouseName, "Sand Crypts salted level " + saltContainer.textContent);
                    mPower = calcSaltedPower(mouseName, mPower, saltContainer.textContent);
                }
            }
        }
    }
    var adjustedTrapPowerTotal = calcTrapTotalPower(adjustedTrapPower, adjustedTrapPowerBonus);
    var result = CRFormula(adjustedTrapPowerTotal, adjustedTrapLuck, mPower, mEff);
    return result;
}

// Situations where we adjust the CR directly without needing power/luck/mouse power.
// Credit to tsitu's MH-Tools for documenting the effects and handling them in code.

// Some need to be factored in for minluck, so they're done separately
function specialMPEff(mouseName, mouse_power, eff) {
    // Special case: Zurreal
    if (locationName == "Crystal Library") {
        if (mouseName == "Zurreal the Eternal" && weaponName != "Zurreal's Folly") {
            // Zurreal's Folly is the only effective weapon against Zurreal the Eternal.
            logCRAdjustmentInfo(mouseName, "Zurreal the Eternal");
            eff = 0;
        }
    }

    // Special case: Absolute Acolyte
    if (locationName == "Bristle Woods Rift") {
        if (mouseName == "Absolute Acolyte") {
            var acolyteSandContainer = document.getElementsByClassName("riftBristleWoodsHUD-acolyteStats-acolyteSand")[0];
            if (acolyteSandContainer && acolyteSandContainer.textContent != "0") {
                // Absoulte Acolyte is invincible while sand not fully drained.
                logCRAdjustmentInfo(mouseName, "Absolute Acolyte");
                eff = 0;
            }
        }
    }

    // Special case: Warmonger and Artillery Commander
    if (locationName == "Fiery Warpath") {
        if (mouseName == "Warmonger") {
            var wave4Container = document.getElementsByClassName("warpathHUD-wave wave_4")[0];
            var wave4GuardContainer = wave4Container.getElementsByClassName("warpathHUD-wave-mouse mousehuntTooltipParent desert_elite_gaurd")[0];
            if (wave4GuardContainer && wave4GuardContainer.classList[3] == "active") {
                // Warmonger is invincible while guarded.
                logCRAdjustmentInfo(mouseName, "Warmonger");
                eff = 0;
            }
        } else if (mouseName == "Artillery Commander") {
            var wavePortalContainer = document.getElementsByClassName("warpathHUD-wave wave_portal")[0];
            var wavePortalGuardContainer = wavePortalContainer.getElementsByClassName("warpathHUD-wave-mouse mousehuntTooltipParent desert_elite_gaurd")[0];
            if (wavePortalGuardContainer && wavePortalGuardContainer.classList[3] == "active") {
                // Artillery Commander is invincible while guarded.
                logCRAdjustmentInfo(mouseName, "Artillery Commander");
                eff = 0;
            }
        }
    }

    // Special cases: Fort Rox
    if (locationName == "Fort Rox") {
        var ballistaContainer = document.getElementsByClassName("fortRoxHUD-fort-upgrade b")[0];
        if (ballistaContainer) {
            if (ballistaContainer.classList[2] == "level_0" && weremiceMice.has(mouseName)) {
                // Level 1 decreases the power of Fort Rox Weremice by 50%. Since we import from selianth's sheet, we need to adjust for level 0.
                logCRAdjustmentInfo(mouseName, "Fort Rox ballista level 0 +100% mouse power");
                mouse_power *= 2;
            }
            if (ballistaContainer.classList[2] == "level_3" && mouseName == "Nightmancer") {
                // Instantly defeats the Nightmancer Mouse.
                logCRAdjustmentInfo(mouseName, "Fort Rox ballista level 3 instant catch");
                mouse_power = 0
                eff = 1;
            }
        }
        var cannonContainer = document.getElementsByClassName("fortRoxHUD-fort-upgrade c")[0];
        if (cannonContainer) {
            if (cannonContainer.classList[2] == "level_0" && cosmicCritterMice.has(mouseName)) {
                // Level 1 decreases the power of Fort Rox Cosmic Critters by 50%. Since we import from selianth's sheet, we need to adjust for level 0.
                logCRAdjustmentInfo(mouseName, "Fort Rox cannon level 0 +100% mouse power");
                mouse_power *= 2;
            }
            if (cannonContainer.classList[2] == "level_3" && mouseName == "Nightfire") {
                // Instantly defeats the Nightfire Mouse.
                logCRAdjustmentInfo(mouseName, "Fort Rox cannon level 3 instant catch");
                mouse_power = 0
                eff = 1;
            }
        }
        var hotmStrength = user.quests.QuestFortRox.lair_width / 100;
        if (user.quests.QuestFortRox.is_lair == true) {
            mouse_power *= hotmStrength;
        }
    }

    // Special cases: Zokor
    // Credit to tsitu and Neb for calculating
    if (locationName == "Zokor") {
        var bossCheck = user.quests.QuestAncientCity.boss;
        if (bossCheck == "defeated" && trapPowerType == "Forgotten") {
                eff += 1;
        }
        var minoStrength = user.quests.QuestAncientCity.width / 100;
        if (bossCheck.includes("hiddenDistrict") && mouseName == "Retired Minotaur") {
            mouse_power *= minoStrength;
        }
    }

    // Special cases: Instacatch
    if (charmName == "Ultimate Charm") {
        // With this charm equipped, you will catch the very next mouse you encounter - guaranteed!
        logCRAdjustmentInfo(mouseName, "Ultimate Charm");
        mouse_power = 0
        eff = 1;
    }
    if (charmName == "Ultimate Anchor Charm" && locationName == "Sunken City") {
        // With this charm equipped, you will catch the very next mouse you encounter - guaranteed!
        // These Ultimate Anchor Charms only work while diving at the Sunken City.
        logCRAdjustmentInfo(mouseName, "Ultimate Anchor Charm");
        mouse_power = 0
        eff = 1;
    }
    if (charmName == "Sheriff's Badge Charm" && mouseName == "Bounty Hunter") {
        // With a Sheriff's Badge Charm equipped, hunters who encounter a Bounty Hunter Mouse are guaranteed to catch him and bring him to justice
        logCRAdjustmentInfo(mouseName, "Sheriff's Badge Charm");
        mouse_power = 0
        eff = 1; //Might need testing :D
    }
    if (weaponName == "Moonbeam Barrier Trap" && mouseName == "Battering Ram") {
        // This trap has a 100% catch rate against the Battering Ram Mouse.
        logCRAdjustmentInfo(mouseName, "Moonbeam Barrier Trap");
        mouse_power = 0;
    }
    return [mouse_power, eff];
};

function FinalCRModifier(currentCR, mouseName) {
    if (weaponName == "Zugzwang's Ultimate Move") {
        // This trap has a chance to trigger its special effect and instantly outwit and capture a mouse
        // as long as your Tower Amplifier has some charge within the Seasonal Garden and Zugzwang's Tower.
        // This trap has a 50% proc rate
        if (locationName == "Seasonal Garden") {
            var ampContainer = document.getElementsByClassName("seasonalGardenHUD-currentAmplifier-value")[0];
            if (ampContainer && ampContainer.textContent != "0") {
                logCRAdjustmentInfo(mouseName, "Zugzwang's Ultimate Move");
                currentCR += (1 - currentCR) * 0.5;
            }
        } else if (locationName == "Zugzwang's Tower" && getZtAmp() > 0) {
            logCRAdjustmentInfo(mouseName, "Zugzwang's Ultimate Move");
            currentCR += (1 - currentCR) * 0.5;
        }
    }
    if (weaponName.startsWith("Anniversary")) {
        // The Anniversary traps have a 10% chance to instantly catch any mouse!
        logCRAdjustmentInfo(mouseName, "Anniversary Trap");
        currentCR += (1 - currentCR) * 0.1;
    }
    if (weaponName === "S.S. Scoundrel Sleigher Trap" && SSSSTMice.has(mouseName)) {
        // This trap has a chance to instantly capture any pirate mouse.
        // This trap is assumed to have a 33% proc rate
        logCRAdjustmentInfo(mouseName, "S.S. Scoundrel Sleigher Trap");
        currentCR += (1 - currentCR) * 0.33;
    }
    if (locationName == "Fort Rox") {
        var ballistaContainer = document.getElementsByClassName("fortRoxHUD-fort-upgrade b")[0];
        if (ballistaContainer) {
            if ((ballistaContainer.classList[2] == "level_2" || ballistaContainer.classList[2] == "level_3") &&
                weremiceMice.has(mouseName)) {
                // Provides a chance to instantly capture Fort Rox Weremice. (50%)
                logCRAdjustmentInfo(mouseName, "Fort Rox ballista level 2/3 instant catch (50%)");
                currentCR += (1 - currentCR) * 0.5;
            }
        }
        var cannonContainer = document.getElementsByClassName("fortRoxHUD-fort-upgrade c")[0];
        if (cannonContainer) {
            if ((cannonContainer.classList[2] == "level_2" || cannonContainer.classList[2] == "level_3") &&
                cosmicCritterMice.has(mouseName)) {
                // Provides a chance to instantly capture Fort Rox Cosmic Critters. (50%)
                logCRAdjustmentInfo(mouseName, "Fort Rox cannon level 2/3 instant catch (50%)");
                currentCR += (1 - currentCR) * 0.5;
            }
        }
        // TODO: tower mana
    }
    return currentCR;
}

// Adjust the mouse power based on the salt level.
// Credit to tsitu's MH-Tools + Xellis
// https://github.com/tsitu/MH-Tools/commit/4fd2f225d9774ffd14d8c293c0a8fff0f3b16c24
function calcSaltedPower(mouseName, mousePower, saltLevel) {
    var saltVal = parseInt(saltLevel, 10) || 0;

    if (saltVal === 0) {
        return mousePower
    }

    var saltedPower = mousePower;
    let saltThresholds;
    let saltCoefficients;
    if (mouseName === "King Grub") {
        // Many different thresholds for KG, see Scarab for easier understanding
        saltThresholds = [0, 6, 7, 10, 14, 18, 23, 24, 27, 34, 44, 48, 50];
        saltCoefficients = [50000, 40000, 20000, 10000, 5000, 2500, 1000, 1500, 1000, 500, 1000, 2000, 0];
    } else if (mouseName === "King Scarab") {
        // 25k MP decrements for up to 30 salt, -12500 from 31 to 40 salt, -6500 to 50 salt
        saltThresholds = [0, 30, 40, 50];
        saltCoefficients = [25000, 12500, 6500, 0];
    }

    for (let i = 0; i < saltThresholds.length - 1; i++) {
        // When salt is below a threshold, it won't contribute to decreasing power
        const currentSalt = Math.max(0, saltVal - saltThresholds[i]);
        // A decrement can apply, at most, the different to the next threshold
        // King Scarab example: 35 salt will provide 30 of the 25k decrements (30 - 0). 40 salt will provide 10 (40 - 30)
        const maxDecrement = saltThresholds[i + 1] - saltThresholds[i];
        saltedPower -= Math.min(maxDecrement, currentSalt) * saltCoefficients[i];
    }

    return saltedPower;
}

// Return the Zugzwang's Tower amplifier level if we are inside the tower.
// 150% is returned as 150.
function getZtAmp() {
    if (locationName == "Zugzwang's Tower") {
        var ampContainer = document.getElementsByClassName("zuzwangsTowerHUD-currentAmplifier")[0];
        if (ampContainer && ampContainer.textContent.match(/[0-9]+/g)) {
            var result = Number(ampContainer.textContent.match(/[0-9]/g).join(""));
            //logger("Zugzwang's Tower's ampiler is at " + result + "%");
            return result;
        }
    }
    return 0;
}

function getArInfo() {
    var stageInfo;
    var arInfo;
    switch(locationName) {
        case "Bountiful Beanstalk":
            stageInfo = getStageForBountifulBeanstalk();
            arInfo = getArInfoForBountifulBeanstalk(stageInfo);
            break;
        /*case "Bristle Woods Rift":
            stageInfo = getStageForBristleWoodsRift();
            break;*/
        case "Foreword Farm":
            stageInfo = getStageForForewordFarm();
            arInfo = getArInfoForForewordFarm(stageInfo);
            break;
        case "Moussu Picchu":
            stageInfo = getStageForMoussuPicchu();
            arInfo = getArInfoForMoussuPicchu(stageInfo);
            break;
        case "Prologue Pond":
            stageInfo = getStageForProloguePond();
            arInfo = getArInfoForProloguePond(stageInfo);
            break;
        case "Table of Contents":
            stageInfo = getStageForTableOfContents();
            arInfo = getArInfoForTableOfContents(stageInfo);
            break;
        case "School of Sorcery":
            stageInfo = getStageForSchoolOfSorcery();
            arInfo = getArInfoForSchoolOfSorcery(stageInfo);
            break;
        case "Zokor":
            stageInfo = getStageForZokor();
            arInfo = getArInfoForZokor(stageInfo);
            break;
        default:
            stageInfo = ["", "", ""];
            arInfo = getInvalidArInfo();
    }

    logger(stageInfo);
    return arInfo;
}

function getStageForSchoolOfSorcery() {
    const location = "School of Sorcery";
    const quest = user.quests.QuestSchoolOfSorcery;

    var subStage = baitName;
    if (isStandardCheese(baitName)) {
        subStage = "Standard Cheese";
    }

    let stage = "";
    if (!quest.in_course) {
        stage = "Hallway";
    } else {
        const currentCourse = quest.current_course;
        stage = quest.course_selections.find(c => c.type == currentCourse.course_type).name;

        // Add power type if exam
        if (quest.in_exam) {
            stage += ` ${currentCourse.power_type.charAt(0).toUpperCase()}${currentCourse.power_type.slice(1)}` ;
        }

        if (currentCourse.is_boss_encounter) {
            subStage = "Boss";
        }
    }

    return [location, stage, subStage];
}

function getArInfoForSchoolOfSorcery(stageInfo) {
    const stage = stageInfo[1];
    const subStage = stageInfo[2];

    const arInfo = {
        "Hallway": {
            "Standard Cheese": {
                "FTC": -1.00,
                "Hall Monitor": 1.000
            },
        },
        "Arcane Arts": {
            "Standard Cheese": {
                "FTC": -1.00,
                "Perpetual Detention": 0.4000,
                "Broomstick Bungler": 0.4000,
                "Misfortune Teller": 0.2000,
            },
            "Apprentice Ambert Cheese": {
                "FTC": 0.00,
                "Arcana Overachiever": 0.4250,
                "Invisible Fashionista": 0.4250,
                "Enchanted Chess Club Champion": 0.1500,
            },
            "Master Mimolette Cheese": {
                "FTC": 0.00,
                "Illustrious Illusionist": 0.4750,
                "Featherlight": 0.3750,
                "Constructively Critical Artist": 0.1500,
            },
            "Boss": {
                "FTC": -1.00,
                "Arcane Master Sorcerer": 1.000
            }
        },
        "Shadow Sciences": {
            "Standard Cheese": {
                "FTC": -1.00,
                "Mixing Mishap": 0.4000,
                "Uncoordinated Cauldron Carrier": 0.4000,
                "Bookworm": 0.2000,
            },
            "Apprentice Ambert Cheese": {
                "FTC": 0.00,
                "Classroom Keener": 0.4250,
                "Audacious Alchemist": 0.4250,
                "Prestigious Prestidigitator": 0.1500,
            },
            "Master Mimolette Cheese": {
                "FTC": 0.00,
                "Classroom Disrupter": 0.4750,
                "Teleporting Truant": 0.3750,
                "Magical Multitasker": 0.1500,
            },
            "Boss": {
                "FTC": -1.00,
                "Shadow Master Sorcerer": 1.000
            }
        },
        "Final Exam Arcane": {
            "Standard Cheese": {
                // VERY low amount of hunts for standard
                // 85 for both FE Arcane + FE Shadow combined
                "FTC": -1.00,
                "Perpetual Detention": 0.3000,
                "Broomstick Bungler": 0.3500,
                "Misfortune Teller": 0.2500,
                "Sleep Starved Scholar": 0.1000,
            },
            "Apprentice Ambert Cheese": {
                "FTC": 0.00,
                "Arcana Overachiever": 0.3500,
                "Invisible Fashionista": 0.3250,
                "Enchanted Chess Club Champion": 0.2250,
                "Class Clown": 0.1000,
            },
            "Master Mimolette Cheese": {
                "FTC": 0.00,
                "Illustrious Illusionist": 0.3000,
                "Featherlight": 0.3500,
                "Constructively Critical Artist": 0.2500,
                "Tyrannical Thaumaturge": 0.1000,
            },
            "Boss": {
                "FTC": -1.00,
                "Mythical Master Sorcerer": 1.000
            }
        },
        "Final Exam Shadow": {
            "Standard Cheese": {
                "FTC": -1.00,
                "Mixing Mishap": 0.3000,
                "Uncoordinated Cauldron Carrier": 0.3500,
                "Bookworm": 0.2500,
                "Cheat Sheet Conjurer": 0.1000,
            },
            "Apprentice Ambert Cheese": {
                "FTC": 0.00,
                "Classroom Keener": 0.3500,
                "Audacious Alchemist": 0.3250,
                "Prestigious Prestidigitator": 0.2250,
                "Celestial Summoner": 0.1000,
            },
            "Master Mimolette Cheese": {
                "FTC": 0.00,
                "Classroom Disrupter": 0.3000,
                "Teleporting Truant": 0.3500,
                "Magical Multitasker": 0.2500,
                "Data Devourer": 0.1000,
            },
            "Boss": {
                "FTC": -1.00,
                "Mythical Master Sorcerer": 1.000
            }
        }
    }

    if (arInfo[stage] && arInfo[stage][subStage]) {
        return arInfo[stage][subStage];
    } else {
        return getInvalidArInfo();
    }
}

function getStageForBountifulBeanstalk() {
    const location = "Bountiful Beanstalk";
    const quest = user.quests.QuestBountifulBeanstalk;

    // Bountiful Beanstalk/Dungeon Floor/Ballroom Floor/Great Hall Floor
    let stage = quest.in_castle ? quest.castle.current_floor.name : "Bountiful Beanstalk";

    var subStage = baitName;
    // Leaping Lavish attracts the same mice as Lavish.
    if (subStage == "Leaping Lavish Beanster Cheese") {
        subStage = "Lavish Beanster Cheese";
    } else if (isSbCheese(baitName)) {
        // There is a SB mouse "outside", but not "inside".
        if (stage == "Bountiful Beanstalk") {
            subStage = "SUPER|brie+";
        } else {
            subStage = "Standard Cheese";
        }
    } else if (isStandardCheese(baitName)) {
        subStage = "Standard Cheese";
    }

    if (!quest.in_castle && quest.beanstalk.is_boss_encounter) {
        subStage = "Boss";
    } else if (quest.in_castle && quest.castle.is_boss_encounter) {
        subStage = "Giant";
    }
    return [location, stage, subStage];
}

function getArInfoForBountifulBeanstalk(stageInfo) {
    var stage = stageInfo[1];
    var subStage = stageInfo[2];

    switch (stage) {
        case "Bountiful Beanstalk":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Budrich Thornborn": 0.5000,
                        "Leafton Beanwell": 0.5000,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Budrich Thornborn": 0.4750,
                        "Leafton Beanwell": 0.4750,
                        "Herbaceous Bravestalk": 0.0500,
                    };
            }
            break;
        case "Dungeon Floor":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Smug Smuggler": 0.3916,
                        "Diminutive Detainee": 0.3396,
                        "Peaceful Prisoner": 0.2688,
                    };
                case "Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Jovial Jailor": 0.4485,
                        "Cell Sweeper": 0.3050,
                        "Lethargic Guard": 0.2465,
                    };
                case "Lavish Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Gate Keeper": 0.5105,
                        "Key Master": 0.4895,
                    };
                case "Royal Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Wrathful Warden": 1.0000,
                    };
                case "Giant":
                    return {
                        "FTC": -1.00,
                        "Dungeon Master": 1.0000,
                    };
            }
            break;
        case "Ballroom Floor":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Baroque Dancer": 0.3815,
                        "Sassy Salsa Dancer": 0.3570,
                        "Whimsical Waltzer": 0.2615,
                    };
                case "Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Peevish Piccoloist": 0.3950,
                        "Obstinate Oboist": 0.3076,
                        "Sultry Saxophonist": 0.2974,
                    };
                case "Lavish Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Violent Violinist": 0.5011,
                        "Chafed Cellist": 0.4989,
                    };
                case "Royal Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Treacherous Tubaist": 1.0000,
                    };
                case "Giant":
                    return {
                        "FTC": -1.00,
                        "Malevolent Maestro": 1.0000,
                    };
            }
            break;
        case "Great Hall Floor":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Plotting Page": 0.4163,
                        "Scheming Squire": 0.3205,
                        "Clumsy Cupbearer": 0.2632,
                    };
                case "Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Baroness Von Bean": 0.4129,
                        "Vindictive Viscount": 0.2968,
                        "Cagey Countess": 0.29030,
                    };
                case "Lavish Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Dastardly Duchess": 0.5040,
                        "Malicious Marquis": 0.4960,
                    };
                case "Royal Beanster Cheese":
                    return {
                        "FTC": 0.00,
                        "Pernicious Prince": 1.0000,
                    };
                case "Giant":
                    return {
                        "FTC": -1.00,
                        "Mythical Giant King": 1.0000,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function getStageForBristleWoodsRift() {
    return document.getElementsByClassName("riftBristleWoodsHUD");
}

function getStageForForewordFarm() {
    var location = "Foreword Farm";

    // No Plants/One Plant/Two Plants/Three Plants/Three Papyrus/Boss
    var stage = "";
    var ffViewContainer = document.getElementsByClassName("folkloreForestRegionView")[0];
    if (ffViewContainer) {
        // <div class="folkloreForestRegionView foreword_farm fuelActive three_papyrus">
        var plants = ffViewContainer.classList[3];
        switch(plants) {
        case "no_plants":
            stage = "No Plants"
            break;
        case "one_plant":
            stage = "One Plant"
            break;
        case "two_plants":
            stage = "Two Plants"
            break;
        case "three_plants":
            stage = "Three Plants"
            break;
        case "three_papyrus":
            stage = "Three Papyrus"
            break;
        case "boss":
            stage = "Boss"
            break;
        }
    }

    var subStage = baitName;
    if (isStandardCheese(baitName)) {
        // There is a SB mouse.
        if (isSbCheese(baitName)) {
            subStage = "SUPER|brie+";
        } else {
            subStage = "Standard Cheese";
        }
    }

    return [location, stage, subStage];
}

function getArInfoForForewordFarm(stageInfo) {
    var stage = stageInfo[1];
    var subStage = stageInfo[2];

    switch (stage) {
        case "No Plants":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Root Rummager": 0.3931,
                        "Land Loafer": 0.3535,
                        "Grit Grifter": 0.2534,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Root Rummager": 0.3005,
                        "Land Loafer": 0.2519,
                        "Grit Grifter": 0.2505,
                        "Crazed Cultivator": 0.1971,
                    };
            }
            break;
        case "One Plant":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Root Rummager": 0.3980,
                        "Grit Grifter": 0.3527,
                        "Angry Aphid": 0.2493,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Root Rummager": 0.3667,
                        "Grit Grifter": 0.2488,
                        "Angry Aphid": 0.1957,
                        "Crazed Cultivator": 0.1888,
                    };
            }
            break;
        case "Two Plants":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Grit Grifter": 0.3507,
                        "Angry Aphid": 0.3471,
                        "Wily Weevil": 0.3022,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Angry Aphid": 0.3038,
                        "Grit Grifter": 0.2999,
                        "Wily Weevil": 0.1996,
                        "Crazed Cultivator": 0.1967,
                    };
            }
            break;
        case "Three Plants":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Angry Aphid": 0.3567,
                        "Wily Weevil": 0.3443,
                        "Mighty Mite": 0.2990,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Wily Weevil": 0.2953,
                        "Angry Aphid": 0.2571,
                        "Mighty Mite": 0.2498,
                        "Crazed Cultivator": 0.1978,
                    };
            }
            break;
        case "Three Papyrus":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Loathsome Locust": 0.3942,
                        "Angry Aphid": 0.2099,
                        "Mighty Mite": 0.1985,
                        "Wily Weevil": 0.1974,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Loathsome Locust": 0.3939,
                        "Crazed Cultivator": 0.1991,
                        "Mighty Mite": 0.1485,
                        "Wily Weevil": 0.1460,
                        "Angry Aphid": 0.1125,
                    };
            }
            break;
        case "Boss":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Monstrous Midge": 1.0000,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Monstrous Midge": 1.0000,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function getStageForMoussuPicchu() {
    var location = "Moussu Picchu";

    // Dragonvine Cheese/Windy Cheese/Rainy Cheese/Glowing Gruyere Cheese/SUPER|brie+/Standard Cheese
    var stage = baitName;
    if (isStandardCheese(baitName)) {
        // There is a SB mouse.
        if (isSbCheese(baitName)) {
            stage = "SUPER|brie+";
        } else {
            stage = "Standard Cheese";
        }
    }

    // low/medium/high/max
    var subStage = "";
    switch (stage) {
        case "Dragonvine Cheese":
            // <div class="moussuPicchuHUD-background storm high">
            // The storm level seems to be one off - 100% wind/rain is showing as high,
            // while medium is showing as medium
            /*var stormViewContainer = document.getElementsByClassName("moussuPicchuHUD-background storm")[0];
            if (stormViewContainer) {
                subStage = stormViewContainer.classList[2];
             }*/
            var windViewContainer1 = document.getElementsByClassName("moussuPicchuHUD-background wind")[0];
            var rainViewContainer1 = document.getElementsByClassName("moussuPicchuHUD-background rain")[0];
            if (windViewContainer1 && rainViewContainer1) {
                var windLevel = windViewContainer1.classList[2];
                var rainLevel = rainViewContainer1.classList[2];
                if (windLevel == "low" || rainLevel == "low") {
                    subStage = "low";
                } else if (windLevel == "medium" || rainLevel == "medium") {
                    subStage = "medium";
                } else if (windLevel == "high" || rainLevel == "high") {
                    subStage = "high";
                } else {
                    subStage = "max";
                }
            }
            break;
        case "Windy Cheese":
            // <div class="moussuPicchuHUD-background wind max">
            var windViewContainer = document.getElementsByClassName("moussuPicchuHUD-background wind")[0];
            if (windViewContainer) {
                subStage = windViewContainer.classList[2];
            }
            break;
        case "Rainy Cheese":
            // <div class="moussuPicchuHUD-background rain high">
            var rainViewContainer = document.getElementsByClassName("moussuPicchuHUD-background rain")[0];
            if (rainViewContainer) {
                subStage = rainViewContainer.classList[2];
            }
            break;
    }

    return [location, stage, subStage];
}

function getArInfoForMoussuPicchu(stageInfo) {
    var stage = stageInfo[1];
    var subStage = stageInfo[2];

    switch (stage) {
        case "Dragonvine Cheese":
            switch (subStage) {
                case "max":
                    return {
                        "FTC": 0.00,
                        "Ful'Mina the Mountain Queen": 1.0000,
                    };
                case "high":
                    return {
                        "FTC": 0.00,
                        "Thundering Watcher": 0.5831,
                        "Ful'Mina the Mountain Queen": 0.3699,
                        "Dragoon": 0.0470,
                    };
                case "medium":
                    return {
                        "FTC": 0.00,
                        "⚡Thunderlord⚡": 0.5738,
                        "Thundering Watcher": 0.4262,
                    };
                case "low":
                    return {
                        "FTC": 0.00,
                        "Thunder Strike": 0.6107,
                        "Violet Stormchild": 0.3893,
                    };
            }
            break;
        case "Windy Cheese":
            switch (subStage) {
                case "max":
                    return {
                        "FTC": 0.00,
                        "Wind Warrior": 1.0000,
                    };
                case "high":
                    return {
                        "FTC": 0.00,
                        "Cycloness": 0.5862,
                        "Wind Warrior": 0.4138,
                    };
                case "medium":
                    return {
                        "FTC": 0.00,
                        "Fluttering Flutist": 0.5755,
                        "Cycloness": 0.4245,
                    };
                case "low":
                    return {
                        "FTC": 0.00,
                        "Wind Watcher": 0.6019,
                        "Charming Chimer": 0.3981,
                    };
            }
            break;
        case "Rainy Cheese":
            switch (subStage) {
                case "max":
                    return {
                        "FTC": 0.00,
                        "Rainmancer": 1.0000,
                    };
                case "high":
                    return {
                        "FTC": 0.00,
                        "Monsoon Maker": 0.5850,
                        "Rainmancer": 0.4150,
                    };
                case "medium":
                    return {
                        "FTC": 0.00,
                        "Rain Summoner": 0.5819,
                        "Monsoon Maker": 0.4181,
                    };
                case "low":
                    return {
                        "FTC": 0.00,
                        "Rain Wallower": 0.5959,
                        "Rain Collector": 0.4041,
                    };
            }
            break;
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Rainwater Purifier": 0.2956,
                "Breeze Borrower": 0.2810,
                "Cloud Collector": 0.1638,
                "Windy Farmer": 0.1634,
                "Homeopathic Apothecary": 0.0962,
            };
        case "SUPER|brie+":
            return {
                "FTC": 0.00,
                "Windy Farmer": 0.2417,
                "Cloud Collector": 0.2401,
                "Breeze Borrower": 0.1732,
                "Rainwater Purifier": 0.1721,
                "Nightshade Maiden": 0.0800,
                "Nightshade Flower Girl": 0.0661,
                "Spore Salesman": 0.0268,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Breeze Borrower": 0.1273,
                "Cloud Collector": 0.2195,
                "Nightshade Flower Girl": 0.1480,
                "Rainwater Purifier": 0.1260,
                "Spore Salesman": 0.1580,
                "Windy Farmer": 0.2212,
            };
    }

    return getInvalidArInfo();
}

function getStageForProloguePond() {
    var location = "Prologue Pond";

    // Stage simply dependeng on the cheese.
    var stage = baitName;
    if (isStandardCheese(baitName)) {
        // There is a SB mouse.
        if (isSbCheese(baitName)) {
            stage = "SUPER|brie+";
        } else {
            stage = "Standard Cheese";
        }
    }

    return [location, stage];
}

function getArInfoForProloguePond(stageInfo) {
    var stage = stageInfo[1];

    switch (stage) {
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Sand Sifter": 0.3968,
                "Beachcomber": 0.3555,
                "Tackle Tracker": 0.2477,
            };
        case "SUPER|brie+":
            return {
                "FTC": 0.00,
                "Sand Sifter": 0.3002,
                "Beachcomber": 0.2565,
                "Tackle Tracker": 0.2488,
                "Covetous Coastguard": 0.1945,
            };
        case "Grubbeen Cheese":
            return {
                "FTC": 0.00,
                "Careless Catfish": 0.3964,
                "Pompous Perch": 0.3565,
                "Melodramatic Minnow": 0.2471,
            };
        case "Clamembert Cheese":
            return {
                "FTC": 0.00,
                "Nefarious Nautilus": 0.3960,
                "Sinister Squid": 0.3565,
                "Vicious Vampire Squid": 0.2475,
            };
        case "Stormy Clamembert Cheese":
            return {
                "FTC": 0.00,
                "Architeuthulhu of the Abyss": 1.0000,
            };
    }

    return getInvalidArInfo();
}

function getStageForTableOfContents() {
    var location = "Table of Contents";

    // Not writing/Pre-Encyclopedia/Encyclopedia
    var stage = "";
    var tocViewContainer = document.getElementsByClassName("folkloreForestRegionView-environmentHud")[0];
    if (tocViewContainer) {
        var pendingBookContainer = tocViewContainer.getElementsByClassName("tableOfContentsView-pendingBookContainer")[0];
        // Pending = Not writing.
        // <div class="tableOfContentsView-pendingBookContainer active">
        if (pendingBookContainer && pendingBookContainer.classList.length > 1 && pendingBookContainer.classList[1] == "active") {
            stage = "Not Writing";
        } else {
            // Writing
            var bookContainer = tocViewContainer.getElementsByClassName("tableOfContentsView-bookContainer")[0];
            if (bookContainer && bookContainer.classList[1] == "active") {
                //<div class="tableOfContentsView-bookContainer active writing encyclopedia">
                if (bookContainer.classList[2] == "writing") {
                    // Get the book type.
                    if (bookContainer.classList[3] == "encyclopedia") {
                        stage = "Encyclopedia";
                    } else {
                        stage = "Pre-Encyclopedia";
                    }
                } else { // There is a reward to claim
                    // <div class="tableOfContentsView-bookContainer active novel">
                    stage = "Not Writing";
                }
            }
        }
    }

    var subStage = baitName;
    if (isStandardCheese(baitName)) {
        // There is a SB mouse.
        if (isSbCheese(baitName)) {
            subStage = "SUPER|brie+";
        } else {
            subStage = "Standard Cheese";
        }
    }

    return [location, stage, subStage];
}

function getArInfoForTableOfContents(stageInfo) {
    var stage = stageInfo[1];
    var subStage = stageInfo[2];

    switch (stage) {
        case "Not Writing":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Brothers Grimmaus": 0.3964,
                        "Hans Cheesetian Squeakersen": 0.3576,
                        "Madame d'Ormouse": 0.2460,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Matriarch Gander": 0.3793,
                        "Brothers Grimmaus": 0.2605,
                        "Hans Cheesetian Squeakersen": 0.1892,
                        "Madame d'Ormouse": 0.1710,
                    };
            }
            break;
        case "Pre-Encyclopedia":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Humphrey Dumphrey": 0.4191,
                        "Little Miss Fluffet": 0.2925,
                        "Little Bo Squeak": 0.2884,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Humphrey Dumphrey": 0.4012,
                        "Little Miss Fluffet": 0.2800,
                        "Little Bo Squeak": 0.2761,
                        "Matriarch Gander": 0.0427,
                    };
                case "First Draft Derby Cheese":
                    return {
                        "FTC": 0.00,
                        "Pinkielina": 0.3862,
                        "Princess and the Olive": 0.3668,
                        "Fibbocchio": 0.2470,
                    };
                case "Second Draft Derby Cheese":
                    return {
                        "FTC": 0.00,
                        "Flamboyant Flautist": 0.3945,
                        "Greenbeard": 0.3542,
                        "Ice Regent": 0.2513,
                    };
                case "Final Draft Derby Cheese":
                    return {
                        "FTC": 0.00,
                        "Bitter Grammarian": 1.0000,
                    };
            }
            break;
        case "Encyclopedia":
            switch (subStage) {
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Humphrey Dumphrey": 0.4191,
                        "Little Miss Fluffet": 0.2925,
                        "Little Bo Squeak": 0.2884,
                    };
                case "SUPER|brie+":
                    return {
                        "FTC": 0.00,
                        "Humphrey Dumphrey": 0.4012,
                        "Little Miss Fluffet": 0.2800,
                        "Little Bo Squeak": 0.2761,
                        "Matriarch Gander": 0.0427,
                    };
                case "First Draft Derby Cheese":
                    return {
                        "FTC": 0.00,
                        "Pinkielina": 0.3862,
                        "Princess and the Olive": 0.3668,
                        "Fibbocchio": 0.2470,
                    };
                case "Second Draft Derby Cheese":
                    return {
                        "FTC": 0.00,
                        "Flamboyant Flautist": 0.3945,
                        "Greenbeard": 0.3542,
                        "Ice Regent": 0.2513,
                    };
                case "Final Draft Derby Cheese":
                    return {
                        "FTC": 0.00,
                        "Bitter Grammarian": 0.6015,
                        "Mythweaver": 0.3985,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function getStageForZokor() {
    var location = "Zokor";

    // District name
    var stage = "";
    var districtNameContainer = document.getElementsByClassName("ancientCityHUD-districtName")[0];
    if (districtNameContainer) {
        stage = districtNameContainer.innerText;
    }

    // Boss/Non-boss
    var subStage = "Non-Boss";
    var bossContainer = document.getElementsByClassName("ancientCityHUD-bossContainer")[0];
    if (bossContainer) {
        // <div class="ancientCityHUD-bossContainer mousehuntTooltipParent ancientCityHUD-boss-y incoming">
        if (bossContainer.classList[3] == "active") {
            subStage = "Boss";
        } else if (bossContainer.classList[3] == "hiddenDistrict" && bossContainer.classList[4] != "napping") {
            // <div class="ancientCityHUD-bossContainer mousehuntTooltipParent ancientCityHUD-boss-n hiddenDistrict napping"
            subStage = "Boss";
        }
    }

    var cheeseType = "";
    if (baitName == "Glowing Gruyere Cheese") {
        cheeseType = baitName;
    } else if (isStandardCheese(baitName)) {
        cheeseType = "Standard Cheese";
    }

    return [location, stage, subStage, cheeseType];
}

function getArInfoForZokor(stageInfo) {
    var stage = stageInfo[1];

    switch (stage) {
        case "The Outer Fealty Shrine":
            return getArInfoForZokorFealtyTier1(stageInfo);
        case "The Inner Fealty Temple":
            return getArInfoForZokorFealtyTier2(stageInfo);
        case "The Templar's Fealty Sanctum":
            return getArInfoForZokorFealtyTier3(stageInfo);
        case "The Neophyte Scholar Study":
            return getArInfoForZokorScholarTier1(stageInfo);
        case "The Master Scholar Auditorium":
            return getArInfoForZokorScholarTier2(stageInfo);
        case "The Dark Scholar Library":
            return getArInfoForZokorScholarTier3(stageInfo);
        case "The Tech Foundry Outskirts":
            return getArInfoForZokorTechTier1(stageInfo);
        case "The Tech Research Center":
            return getArInfoForZokorTechTier2(stageInfo);
        case "The Tech Manaforge":
            return getArInfoForZokorTechTier3(stageInfo);
        case "The Treasure Room":
            return getArInfoForZokorTreasuryTier1(stageInfo);
        case "The Treasure Vault":
            return getArInfoForZokorTreasuryTier2(stageInfo);
        case "The Farming Garden":
            return getArInfoForZokorFarmingTier1(stageInfo);
        case "The Overgrown Farmhouse":
            return getArInfoForZokorFarmingTier2(stageInfo);
        case "The Lair of the Minotaur":
            return getArInfoForZokorMino(stageInfo);
    }

    return getInvalidArInfo();
}

function getArInfoForZokorFealtyTier1(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Masked Pikeman": 0.3652,
                "Drudge": 0.3408,
                "Reanimated Carver": 0.2040,
                "Battle Cleric": 0.0900,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Masked Pikeman": 0.2980,
                "Drudge": 0.2670,
                "Shadow Stalker": 0.2064,
                "Reanimated Carver": 0.1544,
                "Battle Cleric": 0.0742,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorFealtyTier2(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Battle Cleric": 0.3488,
                "Sir Fleekio": 0.3146,
                "Reanimated Carver": 0.1559,
                "Mind Tearer": 0.0965,
                "Solemn Soldier": 0.0644,
                "Drudge": 0.0102,
                "Masked Pikeman": 0.0096,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Battle Cleric": 0.2786,
                "Sir Fleekio": 0.2536,
                "Shadow Stalker": 0.2049,
                "Reanimated Carver": 0.1243,
                "Mind Tearer": 0.0752,
                "Solemn Soldier": 0.0473,
                "Drudge": 0.0082,
                "Masked Pikeman": 0.0079,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorFealtyTier3(stageInfo) {
    var subStage = stageInfo[2];
    var cheeseType = stageInfo[3];

    switch (subStage) {
        case "Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Paladin Weapon Master": 0.5000,
                        "Battle Cleric": 0.1652,
                        "Sir Fleekio": 0.1499,
                        "Reanimated Carver": 0.0590,
                        "Mind Tearer": 0.0451,
                        "Dark Templar": 0.0405,
                        "Solemn Soldier": 0.0304,
                        "Masked Pikeman": 0.0050,
                        "Drudge": 0.0049,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Paladin Weapon Master": 0.5000,
                        "Battle Cleric": 0.1340,
                        "Sir Fleekio": 0.1175,
                        "Shadow Stalker": 0.0983,
                        "Reanimated Carver": 0.0481,
                        "Mind Tearer": 0.0351,
                        "Dark Templar": 0.0336,
                        "Solemn Soldier": 0.0246,
                        "Drudge": 0.0045,
                        "Masked Pikeman": 0.0043,
                    };
            }
            break;
        case "Non-Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Battle Cleric": 0.3303,
                        "Sir Fleekio": 0.2999,
                        "Reanimated Carver": 0.1180,
                        "Mind Tearer": 0.0902,
                        "Dark Templar": 0.0810,
                        "Solemn Soldier": 0.0607,
                        "Masked Pikeman": 0.0101,
                        "Drudge": 0.0098,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Battle Cleric": 0.2679,
                        "Sir Fleekio": 0.2349,
                        "Shadow Stalker": 0.1967,
                        "Reanimated Carver": 0.0962,
                        "Mind Tearer": 0.0702,
                        "Dark Templar": 0.0672,
                        "Solemn Soldier": 0.0491,
                        "Drudge": 0.0091,
                        "Masked Pikeman": 0.0087,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function getArInfoForZokorScholarTier1(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Sanguinarian": 0.3619,
                "Summoning Scholar": 0.3474,
                "Reanimated Carver": 0.2014,
                "Ethereal Guardian": 0.0893,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Summoning Scholar": 0.2843,
                "Sanguinarian": 0.2815,
                "Shadow Stalker": 0.1994,
                "Reanimated Carver": 0.1640,
                "Ethereal Guardian": 0.0708,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorScholarTier2(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Ethereal Guardian": 0.3504,
                "Ancient Scribe": 0.3178,
                "Reanimated Carver": 0.1530,
                "Mystic Herald": 0.0941,
                "Mystic Guardian": 0.0626,
                "Summoning Scholar": 0.0117,
                "Sanguinarian": 0.0104,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Ethereal Guardian": 0.2711,
                "Ancient Scribe": 0.2538,
                "Shadow Stalker": 0.2138,
                "Reanimated Carver": 0.1245,
                "Mystic Herald": 0.0712,
                "Mystic Guardian": 0.0491,
                "Sanguinarian": 0.0085,
                "Summoning Scholar": 0.0080,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorScholarTier3(stageInfo) {
    var subStage = stageInfo[2];
    var cheeseType = stageInfo[3];

    switch (subStage) {
        case "Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Soul Binder": 0.5000,
                        "Ethereal Guardian": 0.1652,
                        "Ancient Scribe": 0.1507,
                        "Reanimated Carver": 0.0597,
                        "Mystic Herald": 0.0458,
                        "Mystic Scholar": 0.0393,
                        "Mystic Guardian": 0.0295,
                        "Summoning Scholar": 0.0050,
                        "Sanguinarian": 0.0048,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Soul Binder": 0.5000,
                        "Ethereal Guardian": 0.1299,
                        "Ancient Scribe": 0.1208,
                        "Shadow Stalker": 0.1009,
                        "Reanimated Carver": 0.0480,
                        "Mystic Herald": 0.0372,
                        "Mystic Scholar": 0.0314,
                        "Mystic Guardian": 0.0236,
                        "Summoning Scholar": 0.0043,
                        "Sanguinarian": 0.0039,

                    };
            }
            break;
        case "Non-Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Ethereal Guardian": 0.3304,
                        "Ancient Scribe": 0.3013,
                        "Reanimated Carver": 0.1195,
                        "Mystic Herald": 0.0915,
                        "Mystic Scholar": 0.0786,
                        "Mystic Guardian": 0.0590,
                        "Summoning Scholar": 0.0101,
                        "Sanguinarian": 0.0096,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Ethereal Guardian": 0.2599,
                        "Ancient Scribe": 0.2417,
                        "Shadow Stalker": 0.2018,
                        "Reanimated Carver": 0.0959,
                        "Mystic Herald": 0.0744,
                        "Mystic Scholar": 0.0628,
                        "Mystic Guardian": 0.0472,
                        "Summoning Scholar": 0.0087,
                        "Sanguinarian": 0.0076,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function getArInfoForZokorTechTier1(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Ash Golem": 0.3718,
                "RR-8": 0.3323,
                "Reanimated Carver": 0.2071,
                "Exo-Tech": 0.0888,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Ash Golem": 0.2994,
                "RR-8": 0.2766,
                "Shadow Stalker": 0.1900,
                "Reanimated Carver": 0.1659,
                "Exo-Tech": 0.0681,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorTechTier2(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Exo-Tech": 0.3348,
                "Matron of Machinery": 0.3013,
                "Reanimated Carver": 0.1474,
                "Automated Stone Sentry": 0.1237,
                "Tech Golem": 0.0485,
                "RR-8": 0.0225,
                "Ash Golem": 0.0218,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Exo-Tech": 0.2571,
                "Matron of Machinery": 0.2451,
                "Shadow Stalker": 0.2066,
                "Reanimated Carver": 0.1190,
                "Automated Stone Sentry": 0.1012,
                "Tech Golem": 0.0382,
                "RR-8": 0.0178,
                "Ash Golem": 0.0150,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorTechTier3(stageInfo) {
    var subStage = stageInfo[2];
    var cheeseType = stageInfo[3];

    switch (subStage) {
        case "Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Manaforge Smith": 0.5000,
                        "Exo-Tech": 0.1655,
                        "Matron of Machinery": 0.1500,
                        "Reanimated Carver": 0.0605,
                        "Automated Stone Sentry": 0.0448,
                        "Fungal Technomorph": 0.0396,
                        "Tech Golem": 0.0296,
                        "Ash Golem": 0.0050,
                        "RR-8": 0.0050,

                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Manaforge Smith": 0.5000,
                        "Exo-Tech": 0.1325,
                        "Matron of Machinery": 0.1211,
                        "Shadow Stalker": 0.0986,
                        "Reanimated Carver": 0.0489,
                        "Automated Stone Sentry": 0.0368,
                        "Fungal Technomorph": 0.0304,
                        "Tech Golem": 0.0241,
                        "Ash Golem": 0.0039,
                        "RR-8": 0.0037,
                    };
            }
            break;
        case "Non-Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Exo-Tech": 0.3310,
                        "Matron of Machinery": 0.3000,
                        "Reanimated Carver": 0.1209,
                        "Automated Stone Sentry": 0.0896,
                        "Fungal Technomorph": 0.0791,
                        "Tech Golem": 0.0593,
                        "Ash Golem": 0.0101,
                        "RR-8": 0.0100,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Exo-Tech": 0.2650,
                        "Matron of Machinery": 0.2421,
                        "Shadow Stalker": 0.1971,
                        "Reanimated Carver": 0.0978,
                        "Automated Stone Sentry": 0.0735,
                        "Fungal Technomorph": 0.0608,
                        "Tech Golem": 0.0482,
                        "Ash Golem": 0.0079,
                        "RR-8": 0.0076,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function getArInfoForZokorTreasuryTier1(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Mimic": 0.3554,
                "Hired Eidolon": 0.2519,
                "Matron of Wealth": 0.2005,
                "Reanimated Carver": 0.1922,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Mimic": 0.2789,
                "Shadow Stalker": 0.2046,
                "Hired Eidolon": 0.1989,
                "Reanimated Carver": 0.1600,
                "Matron of Wealth": 0.1577,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorTreasuryTier2(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Molten Midas": 0.4998,
                "Reanimated Carver": 0.1492,
                "Hired Eidolon": 0.1309,
                "Treasure Brawler": 0.1019,
                "Matron of Wealth": 0.0696,
                "Mimic": 0.0486,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Molten Midas": 0.3994,
                "Shadow Stalker": 0.2067,
                "Reanimated Carver": 0.1168,
                "Hired Eidolon": 0.1003,
                "Treasure Brawler": 0.0849,
                "Matron of Wealth": 0.0512,
                "Mimic": 0.0407,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorFarmingTier1(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Mush Monster": 0.3496,
                "Nightshade Nanny": 0.3141,
                "Reanimated Carver": 0.1910,
                "Mushroom Harvester": 0.1453,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Nightshade Nanny": 0.2416,
                "Mushroom Harvester": 0.2392,
                "Shadow Stalker": 0.1752,
                "Reanimated Carver": 0.1720,
                "Mush Monster": 0.1720,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorFarmingTier2(stageInfo) {
    var cheeseType = stageInfo[3];

    switch (cheeseType) {
        case "Glowing Gruyere Cheese":
            return {
                "FTC": 0.00,
                "Mush Monster": 0.3797,
                "Nightshade Fungalmancer": 0.3002,
                "Nightshade Nanny": 0.1600,
                "Reanimated Carver": 0.1501,
                "Mushroom Harvester": 0.0100,
            };
        case "Standard Cheese":
            return {
                "FTC": -1.00,
                "Mush Monster": 0.3088,
                "Shadow Stalker": 0.1980,
                "Nightshade Nanny": 0.1813,
                "Nightshade Fungalmancer": 0.1672,
                "Reanimated Carver": 0.1198,
                "Mushroom Harvester": 0.0249,
            };
    }

    return getInvalidArInfo();
}

function getArInfoForZokorMino(stageInfo) {
    var subStage = stageInfo[2];
    var cheeseType = stageInfo[3];

    switch (subStage) {
        case "Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Decrepit Tentacle Terror": 0.5431,
                        "Reanimated Carver": 0.2124,
                        "Retired Minotaur": 0.1889,
                        "Corridor Bruiser": 0.0556,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Decrepit Tentacle Terror": 0.4228,
                        "Shadow Stalker": 0.2114,
                        "Reanimated Carver": 0.1748,
                        "Retired Minotaur": 0.1559,
                        "Corridor Bruiser": 0.0351,
                    };
            }
            break;
        case "Non-Boss":
            switch (cheeseType) {
                case "Glowing Gruyere Cheese":
                    return {
                        "FTC": 0.00,
                        "Decrepit Tentacle Terror": 0.6696,
                        "Reanimated Carver": 0.2619,
                        "Corridor Bruiser": 0.0685,
                    };
                case "Standard Cheese":
                    return {
                        "FTC": -1.00,
                        "Decrepit Tentacle Terror": 0.5008,
                        "Shadow Stalker": 0.2504,
                        "Reanimated Carver": 0.2071,
                        "Corridor Bruiser": 0.0417,
                    };
            }
            break;
    }

    return getInvalidArInfo();
}

function isSbCheese(cheese) {
    var sbCheese = new Set([
        "SUPER|brie+",
        "Empowered SUPER|brie+",
    ]);
    return sbCheese.has(cheese);
}

function isStandardCheese(cheese) {
    var standardCheese = new Set([
        "White Cheddar Cheese",
        "Cheddar Cheese",
        "Marble Cheese",
        "Mozzarella Cheese",
        "Swiss Cheese",
        "Brie Cheese",
        "Gouda Cheese",
        "Empowered Brie",
    ]);
    return standardCheese.has(cheese) || isSbCheese(cheese) || isStandardRiftCheese(cheese);
}

function isStandardRiftCheese(cheese) {
    var standardRiftCheese = new Set([
        "Marble String Cheese",
        "Swiss String Cheese",
        "Brie String Cheese",
        "Magical String Cheese",
    ]);
    return standardRiftCheese.has(cheese);
}

function getCheeseAr(cheese) {
    var cheeseAr = {
        "Brie Cheese": 0.85,
        "Brie String Cheese": 0.85,
        "Cheddar Cheese": 0.70,
        "Empowered Brie": 0.85,
        "Empowered SUPER|brie+": 1.00,
        "Gouda Cheese": 0.90,
        "Magical String Cheese": 1.00,
        "Marble Cheese": 0.75,
        "Marble String Cheese": 0.75,
        "Mozzarella Cheese": 0.70,
        "Swiss Cheese": 0.80,
        "Swiss String Cheese": 0.80,
        "SUPER|brie+": 1.00,
        "White Cheddar Cheese": 0.70,
    };

    var result = cheeseAr[cheese];
    if (result == undefined) {
        logger(cheese + " not found in the cheese AR table");
        return 1.0;
    } else {
        return result;
    }
}


function adjustAr(ar, ftc) {;
    // Will never FTC, can use the AR directly.
    if (ftc == 0.0) {
        return ar;
    } else if (ftc > 0.0) {
        return ((1.0 - ftc) + ftc * basicTrapArBonus) * ar / (1.0 - ftc);
    } else {
        var basicAr = getCheeseAr(baitName);
        return (basicAr + (1.0 - basicAr) * basicTrapArBonus) * ar;
    }
}

function getInvalidArInfo() {
    return {
        "FTC": 0.0,
        "Invalid": 0,
    }
}

function logUserInfo() {
    logger(locationName + " / " + weaponName + " / " + baseName + " / " + charmName + " / " + baitName + " / " + trapPowerType)
}

function logCRAdjustmentInfo(mouseName, message) {
    logger(message + ": " + mouseName + " / " + locationName + " / " + weaponName + " / " + baseName + " / " + charmName + " / " + baitName + " / " + trapPowerType)
}

// This function is used for Taunting charm.  Therefore we only look at the weapon and base.
function riftCount() {
    var count = 0;
    if (trapPowerType == "Rift") {
        count += 1;
    }
    if (riftBases.has(baseName)) {
        count += 1;
    }
    return count;
}

// An easy way to turn on/off debugging info.
function logger(message) {
    if (debugLog) {
        console.log(message);
    }
}

function trapChangeListener() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("load", function () {
            if (this.responseURL === "https://www.mousehuntgame.com/managers/ajax/users/changetrap.php") {
                success: {
                    colourClover()
                }
            }
        })
        originalOpen.apply(this, arguments);
    };
};

var lastSetupCache;
async function colourClover(){
    var button = $(".min-luck-button")[0];

    // Add any user properties that indicate trap setup has changed or mouse pool may have changed
    var currentSetupCache = `
        ${user.trap_power}
        ${user.trap_luck}
        ${user.trap_attraction_bonus}
        ${user.trap_cheese_effect}
        ${user.trap_luck}
        ${user.trap_power}
        ${user.trap_power_bonus}
        ${user.trap_power_type_name}
        ${user.trinket_item_id}
        ${user.base_item_id}
        ${user.weapon_item_id}
        ${user.bait_item_id}
        ${user.bait_quantity == 0}
        ${user.environment_id}
    `;

    if (currentSetupCache != lastSetupCache) {
        logger("Setup has changed, getting new data");
        await refreshData();
    }
    lastSetupCache = currentSetupCache;

    renderBox();

    var data = $(".chro-minluck-data-minluck");
    var count = 0;
    for (var i=0; i<data.length; i++){
        data[i].classList.contains("good-minluck") ? count++ : null
    }
    if (count/data.length == 1) {
        button.classList.add("blue");
    } else if (count/data.length >= 0.5) {
        button.classList.add("green");
    } else {
        button.classList.add("red");
    }

    removeBox();
}


// Using function by Program#5219
function hgPromise(endpoint, ...args) {
    return new Promise((resolve, reject) => {
        endpoint(...args, response => resolve(response), error => reject(error));
    });
}
