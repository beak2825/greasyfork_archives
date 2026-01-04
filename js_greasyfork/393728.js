// ==UserScript==
// @name         UnderworldsDB Advanced Deck Info
// @description  Display advanced deck info on underworldsdb.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Maxim Starovoitov
// @license      MIT; http://opensource.org/licenses/MIT
// @match        https://www.underworldsdb.com/shared*
// @match        https://www.underworldsdb.com/
// @match        https://www.underworldsdb.com/#
// @grant        none
// @downloadUrl  https://greasyfork.org/scripts/393728-advanced-deck-info/code/Advanced%20Deck%20Info.user.js
// @history      1.2 DB update for The Wurmspat and Hrothgorn's Mantrappers; various tweaks and improvements
// @history      1.1 DB update for FAR 09.01.2020; minor tweaks and fixes
// @history      1.0 Initial release
// @downloadURL https://update.greasyfork.org/scripts/393728/UnderworldsDB%20Advanced%20Deck%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/393728/UnderworldsDB%20Advanced%20Deck%20Info.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2019 Maxim Starovoitov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

/*
# Installation #
1. Install Tampermonkey browser extension. It's available for Chrome, Microsoft Edge, Safari, Opera Next, and Firefox.
2. Drag & drop this file into your browser. Tampermonkey should offer to install this script.
3. If drag & drop didn't work, click "Create a new script" from Tampermonkey menu and copy paste the content of this file.
    1. Save the script

# Usage #
1. Open any underworldsdb shared deck (url looks like "https://www.underworldsdb.com/shared.php?deck=...")
2. Open underworldsdb home page and start building a deck

**Note**: this script works only for Championship/Alliance valid decks!

# Features #
## 1. Objective cards by difficulty/reliability ##
Every objective card has been assigned a difficulty rating.
Rating is a number (1-5) where:
**1** - Unscorable trash
**2** - Very unreliable; it is scorable, but:
* you have to invest so much that it is probably not worth it
* and/or requirements rely on randomness and chances are bad
* and/or it depends on opponent's actions
* and/or it depends on opponent's warband

**3** - Unreliable
* A lot of resources have to be invested (activations, cards)
* and/or requirements rely on randomness and chances aren't good
* and/or complex setup is required
* and/or opponent can disrupt/prevent this objective from being scored
* (e.g. "Supremacy" falls into this category)

**4** - Reliable
* Objective that can be scored with small resource investment
* and/or with easy setup
* and/or requirements rely on randomness and chances are good
* and it is unlikely that opponent will be able to disrupt this objective
* (e.g. "Fired Up" falls into this category)

**5** - basically, you're going to score it no matter what
* easy condition/setup
* no randomness
* your opponent can't stop it
* (e.g. "Calculated Risk")

This rating can have a faction specific override. E.g. Calculated Risk has rating override for Thorns of the Briar Queen and Lady Harrows Mournflight.

**DISCLAIMER**: ratings were assigned by me - the developer of this script. I am not an expert at the game and I am not a robot so these ratings may be inaccurate or inconsistent.

## 2. Categorized power card list ##
Every card has been assigned one or more categories.
Categories are used to display categorized list and for "support" calculation (more on that later).
There are 4 broad categories and multiple sub-categories in each of them:
* Offence
    * Accuracy - anything that boosts chances to hit
    * Damage   - anything that improves damage or does damage directly
    * Weapon   - upgrades with attack actions
    * Range    - weapons with 3+ range, effects that increase attack range
* Survivability
    * Defence  - anything that boosts chances to defend and/or avoid damage
    * Wounds   - anything that gives wounds or mitigates incoming damage
    * Healing  - self-explanatory
* Mobility
    * Place    - effects that place a fighter into a hex (confusion, shadow step, etc.)
    * Push     - anything that pushes your fighters
    * Move     - anything that improves movement; e.g. distance bonuses, free movement actions, removal of move tokens
* Other
    * Debuff             - anything that diminishes enemy ability to do their thing
    * Enemy Displacement - anything that can move/push/place enemy fighters
    * Inspiration        - anything that inspires your fighters
    * Objective          - anything that interacts with objective tokens
    * Glory              - anything that gives you additional glory
    * Card Draw          - anything that allows to draw cards
    * Spellcasting       - anything that improves spellcasting
    * Anti-spell         - anything that denies spells or debuffs spellcasting
    * ...                - there may be other sub-categories or just uncategorized cards which don't fit into existing categories

**DISCLAIMER**: categories were assigned by me - the developer of this script. I am not an expert at the game and I am not a robot so this categorization may be inaccurate or inconsistent.

## 3. Rated power cards ##
Every power card has a rating. It is not displayed anywhere but it is used for recommendations (more on that later).
Rating is a number (1-5) where:
**1** - effect is abysmally weak and/or condition is unachievable
**2** - bad
**3** - there is probably something better, you need to have a good reason to take this card
**4** - good cards
**5** - very good cards, you need to have a good reason not to take this card

This rating can have a faction specific override. E.g. Archer's Focus has higher rating for warbands with more 3+ range attacks.

**DISCLAIMER**: power cards were rated by me - the developer of this script. I am not an expert at the game and I am not a robot so these ratings may be inaccurate or inconsistent.

## 4. Tags ##
Aside from categories cards can have tags. Some of them were added automatically based on card's text, some were added manually.
Tags are used for card "support" calculation (more on that later).
Tag examples: Restricted, Hunter, Quarry, Scatter, Reaction, Guard, Tome, Knockback, Cleave, Ensnare, Lethal, Self-damage

**DISCLAIMER**: some tags were assigned by me - the developer of this script. I am not a robot so these tags may be inaccurate or inconsistent.
**DISCLAIMER**: some tags were assigned by an automated script. It is not intelligent so these tags may be inaccurate.

## 5. Support cards ##
This script has logic that calculates whether a card is supported by other cards. E.g. "Fired Up" is supported by "Regal Vision".
This feature is used mostly for objective cards. Every card has a list of "Supported by" cards/categories/tags.
When a card is selected (by clicking on it), every card that matches it's "suppported by" condition is highlighted.
This logic is simple and thus may be inaccurate.
**DISCLAIMER**: "supported by" conditions were defined by me - the developer of this script. I am not an expert at the game and I am not a robot so these conditions may be inaccurate or inconsistent.

## 6. Recommendations ##
This script can suggest to remove some cards from the deck (cards with bad rating).
This script suggests cards to include in the deck (usually cards with good rating).
Card synergy ("supported by") slightly affects these recommendations.

# 4. Modification #
You will likely disagree with some of my ratings, and at some point you might want to improve recommendations or synergy calculation.
You are free to modify this script. If you want to change rating, support cards, categories, or tags for a particular card, then do the following:
- Find card data by searching this file by card name
- Find "metadata" section
- Change whatever you want there
- Save the script

**Note**: if you are editing this script outside of Tampermonkey, then you have to re-import it.
 */

GM_addStyle("td.grow {width: 100%;}");
GM_addStyle(".card-line:hover {background-color: #d4edda;}");
GM_addStyle(".card-line.highlight {background-color: #d4edda;}");
GM_addStyle(".card-line.select {background-color: #28a745;}");
GM_addStyle(".my-link {color: #0b2e13;}");
GM_addStyle(".subcategory {text-align: center;}");

const database = {
    "----------Core set": "Core set",
    "1": {
        "code": "1",
        "name": "A Worthy Skull",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N117"
        }
    },
    "2": {
        "code": "2",
        "name": "Blood for the Blood God!",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if three or more of your fighters made a Charge action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N118"
        }
    },
    "3": {
        "code": "3",
        "name": "Coward!",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter begins a Move action adjacent to one of your fighters and ends it adjacent to none of your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N119"
        }
    },
    "4": {
        "code": "4",
        "name": "Draw the Gaze of Khorne",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes two or more enemy fighters out of action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N120"
        }
    },
    "5": {
        "code": "5",
        "name": "It Begins",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least one fighter from each warband is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N121"
        }
    },
    "6": {
        "code": "6",
        "name": "Khorne Cares Not",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if five or more fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N122"
        }
    },
    "7": {
        "code": "7",
        "name": "Khorne's Champion",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Third",
        "glory": "6",
        "text": "Score this in the third end phase if all fighters except one of your fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N123"
        }
    },
    "8": {
        "code": "8",
        "name": "Let the Blood Flow",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if three or more of your fighters made a successful Attack action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N124"
        }
    },
    "9": {
        "code": "9",
        "name": "There is Only Slaughter",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if no fighter is holding an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N125"
        }
    },
    "10": {
        "code": "10",
        "name": "Blood Offering",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter. They suffer 1 damage. Roll two extra attack dice for their first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N126"
        }
    },
    "11": {
        "code": "11",
        "name": "Blood Rain",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "All Attack actions in the next activation have the <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> characteristic, even if they would normally have the <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> characteristic.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N127"
        }
    },
    "12": {
        "code": "12",
        "name": "Boon of Khorne",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that takes an enemy fighter out of action. Remove all wound tokens from one friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N128"
        }
    },
    "13": {
        "code": "13",
        "name": "Desecrate",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Remove one objective that you hold from the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N129"
        }
    },
    "14": {
        "code": "14",
        "name": "Final Blow",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Attack action that takes an adjacent friendly fighter out of action. Their attacker suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N130"
        }
    },
    "15": {
        "code": "15",
        "name": "Fuelled by Slaughter",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a fighter out of action. A friendly fighter can make an Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N131"
        }
    },
    "16": {
        "code": "16",
        "name": "Insensate",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter who suffers any amount of damage in the next activation only suffers one damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N132"
        }
    },
    "17": {
        "code": "17",
        "name": "Khorne Calls",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll one extra attack dice for your first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N133"
        }
    },
    "18": {
        "code": "18",
        "name": "Rebirth in Blood",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes your last surviving fighter out of action. Roll a defence dice. If you roll a <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> remove all wound tokens from them, and place them on a starting hex in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N134"
        }
    },
    "19": {
        "code": "19",
        "name": "Skulls for the Skull Throne!",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that takes an enemy fighter out of action. Draw up to two power cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N135"
        }
    },
    "20": {
        "code": "20",
        "name": "Berserk Charge",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Both <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> and <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> symbols are successes when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "Blooded Saek",
        "box": "Core set",
        "metadata": {
            "redirect": "N136"
        }
    },
    "21": {
        "code": "21",
        "name": "Bloodslick",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Garrek Gorebeard",
        "box": "Core set",
        "metadata": {
            "redirect": "N137"
        }
    },
    "22": {
        "code": "22",
        "name": "Deadly Spin",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> Targets adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Targor",
        "box": "Core set",
        "metadata": {
            "redirect": "N138"
        }
    },
    "23": {
        "code": "23",
        "name": "Ever-Advancing",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> When this fighter could be driven back during an Attack action (whether or not your opponent chooses to do so), you can instead push them one hex.<div><\/div>",
        "restrictedTo": "Garrek Gorebeard",
        "box": "Core set",
        "metadata": {
            "redirect": "N139"
        }
    },
    "24": {
        "code": "24",
        "name": "Frenzy",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra attack dice when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N140"
        }
    },
    "25": {
        "code": "25",
        "name": "Grisly Trophy",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter takes an enemy fighter out of action, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "Garrek Gorebeard",
        "box": "Core set",
        "metadata": {
            "redirect": "N141"
        }
    },
    "26": {
        "code": "26",
        "name": "Terrifying Howl",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Push each adjacent enemy fighter one hex.<div><\/div>",
        "restrictedTo": "Karsus the Chained",
        "box": "Core set",
        "metadata": {
            "redirect": "N142"
        }
    },
    "27": {
        "code": "27",
        "name": "Unstoppable Charge",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Charge action they can move through other fighters, but their move must end in an empty hex.<div><\/div>",
        "restrictedTo": "Blooded Saek",
        "box": "Core set",
        "metadata": {
            "redirect": "N143"
        }
    },
    "28": {
        "code": "28",
        "name": "Whirlwind of Death",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "Karsus the Chained",
        "box": "Core set",
        "metadata": {
            "redirect": "N144"
        }
    },
    "29": {
        "code": "29",
        "name": "Wicked Blade",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If you roll at least one <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> this Attack action has Cleave.<div><\/div>",
        "restrictedTo": "Arnulf",
        "box": "Core set",
        "metadata": {
            "redirect": "N145"
        }
    },
    "30": {
        "code": "30",
        "name": "Awe-Inspiring",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband has taken two or more fighters out of action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N146"
        }
    },
    "31": {
        "code": "31",
        "name": "Cleanse",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold all objectives <i>in enemy territory<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N147"
        }
    },
    "32": {
        "code": "32",
        "name": "Consecrated Area",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if  there are no enemy fighters adjacent to your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N148"
        }
    },
    "33": {
        "code": "33",
        "name": "Eternals",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if none of your fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N149"
        }
    },
    "34": {
        "code": "34",
        "name": "Immovable Object",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if  the same friendly fighter has held the same objective at the end of two consecutive action phases.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N150"
        }
    },
    "35": {
        "code": "35",
        "name": "Lightning Strikes",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action by a Charge action made by one of your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N151"
        }
    },
    "36": {
        "code": "36",
        "name": "Seize Ground",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if  you hold an objective in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N152"
        }
    },
    "37": {
        "code": "37",
        "name": "Sigmar's Bulwark",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if none of your fighters suffered any damage in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N153"
        }
    },
    "38": {
        "code": "38",
        "name": "Slayers of Tyrants",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N154"
        }
    },
    "39": {
        "code": "39",
        "name": "Heroic Guard",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and put them on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N155"
        }
    },
    "40": {
        "code": "40",
        "name": "Peal of Thunder",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose any enemy fighter and push them one hex in any direction.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N156"
        }
    },
    "41": {
        "code": "41",
        "name": "Righteous Zeal",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Attack action with a Range of 1 or 2 in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N157"
        }
    },
    "42": {
        "code": "42",
        "name": "Sigmarite Wall",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two adjacent friendly fighters and put them on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N158"
        }
    },
    "43": {
        "code": "43",
        "name": "Stormforged Resistance",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Friendly fighters cannot be driven back by the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N159"
        }
    },
    "44": {
        "code": "44",
        "name": "Stormforged Tactics",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "In the next activation, you can make the following Reaction.<br><b>Reaction:<\/b> After an enemy fighter's Attack action that fails, choose up to two friendly fighters and push them up to one hex each.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N160"
        }
    },
    "45": {
        "code": "45",
        "name": "Tireless Assault",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that fails. That fighter can make another Attack action that targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N161"
        }
    },
    "46": {
        "code": "46",
        "name": "Undaunted",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a friendly fighter out of action leaving one surviving friendly fighter on the battlefield. Remove all wound tokens from the surviving fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N162"
        }
    },
    "47": {
        "code": "47",
        "name": "Unstoppable Strike",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action in the next activation gains Cleave.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N163"
        }
    },
    "48": {
        "code": "48",
        "name": "Valiant Attack",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Enemy fighters cannot support the target of the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N164"
        }
    },
    "49": {
        "code": "49",
        "name": "Blessed by Sigmar",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "N165"
        }
    },
    "50": {
        "code": "50",
        "name": "Block",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> This fighter and all adjacent friendly fighters go on Guard.<div><\/div>",
        "restrictedTo": "Angharad Brightshield",
        "box": "Core set",
        "metadata": {
            "redirect": "N166"
        }
    },
    "51": {
        "code": "51",
        "name": "Brave Strike",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Roll an extra attack dice if there are no adjacent friendly fighters.<div><\/div>",
        "restrictedTo": "Obryn the Bold",
        "box": "Core set",
        "metadata": {
            "redirect": "N167"
        }
    },
    "52": {
        "code": "52",
        "name": "Fatal Riposte",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action that targets this fighter and fails, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> this fighter cannot be driven back and they can make an Attack action. It must target the attacker.<div><\/div>",
        "restrictedTo": "Severin Steelheart",
        "box": "Core set",
        "metadata": {
            "redirect": "N168"
        }
    },
    "53": {
        "code": "53",
        "name": "Heroic Might",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack action gains Cleave.<div><\/div>",
        "restrictedTo": "Severin Steelheart, Obryn the Bold",
        "box": "Core set",
        "metadata": {
            "redirect": "N169"
        }
    },
    "54": {
        "code": "54",
        "name": "Heroic Stride",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter ends their activation within two hexes of this fighter, you can push this fighter one hex.<div><\/div>",
        "restrictedTo": "Severin Steelheart",
        "box": "Core set",
        "metadata": {
            "redirect": "N170"
        }
    },
    "55": {
        "code": "55",
        "name": "Lightning Blade",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> On a critical hit, this Attack action has +1 Damage.<div><\/div>",
        "restrictedTo": "Severin Steelheart",
        "box": "Core set",
        "metadata": {
            "redirect": "N171"
        }
    },
    "56": {
        "code": "56",
        "name": "Lightning Blast",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When they make a critical hit, this fighter also inflicts 1 damage on enemy fighters adjacent to the target's hex.<div><\/div>",
        "restrictedTo": "Obryn the Bold",
        "box": "Core set",
        "metadata": {
            "redirect": "N172"
        }
    },
    "57": {
        "code": "57",
        "name": "Righteous Strike",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> <b>Reaction:<\/b> After this Attack action, if it failed and the target was an enemy leader, make this Attack action again.<div><\/div>",
        "restrictedTo": "Angharad Brightshield",
        "box": "Core set",
        "metadata": {
            "redirect": "N173"
        }
    },
    "58": {
        "code": "58",
        "name": "Shield Bash",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an adjacent fighter's Attack action that targets this fighter and fails, this fighter cannot be driven back and you can push their attacker one hex.<div><\/div>",
        "restrictedTo": "Angharad Brightshield",
        "box": "Core set",
        "metadata": {
            "redirect": "N174"
        }
    },
    "236": {
        "code": "236",
        "name": "Annihilation",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if <i>all enemy fighters have been taken out of action<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B264"
        }
    },
    "247": {
        "code": "247",
        "name": "Conquest",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if all of your surviving fighters are <i>in your opponent's territory<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B273"
        }
    },
    "253": {
        "code": "253",
        "name": "Denial",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if there are no enemy fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B275"
        }
    },
    "263": {
        "code": "263",
        "name": "Hold Objective 1",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>1<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B283"
        }
    },
    "264": {
        "code": "264",
        "name": "Hold Objective 2",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>2<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B284"
        }
    },
    "265": {
        "code": "265",
        "name": "Hold Objective 3",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>3<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B285"
        }
    },
    "266": {
        "code": "266",
        "name": "Hold Objective 4",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>4<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B286"
        }
    },
    "267": {
        "code": "267",
        "name": "Hold Objective 5",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>5<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B287"
        }
    },
    "292": {
        "code": "292",
        "name": "Supremacy",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B305"
        }
    },
    "311": {
        "code": "311",
        "name": "Confusion",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two fighters that are adjacent to each other and switch them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B329"
        }
    },
    "360": {
        "code": "360",
        "name": "Sidestep",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B366"
        }
    },
    "389": {
        "code": "389",
        "name": "Great Fortitude",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B396"
        }
    },
    "390": {
        "code": "390",
        "name": "Great Speed",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B397"
        }
    },
    "391": {
        "code": "391",
        "name": "Great Strength",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "-",
        "box": "Core set",
        "metadata": {
            "redirect": "B398"
        }
    },
    "----------Sepulchral Guard expansion": "Sepulchral Guard expansion",
    "59": {
        "code": "59",
        "name": "Battle Without End",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<i>(Errata update)<\/i> Score this in an end phase if one or more friendly fighters returned to the battlefield in the preceding action phase, and a friendly fighter had already returned to the battlefield in that phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "60": {
        "code": "60",
        "name": "Claim the City",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if  you hold <i>every objective<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Mobility",
                "Objective"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "61": {
        "code": "61",
        "name": "Fearless in Death",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there is only one friendly fighter on the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "62": {
        "code": "62",
        "name": "March of the Dead",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if all of your surviving fighters (at least five) made a Move action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [
                [
                    "Move",
                    "Free Action"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "63": {
        "code": "63",
        "name": "More Able Bodies",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took two or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "64": {
        "code": "64",
        "name": "Peerless General",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if you have four or more surviving fighters, and none are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "65": {
        "code": "65",
        "name": "Skills Unforgotten",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your leader takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "66": {
        "code": "66",
        "name": "The Invigorated Dead",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "Third",
        "glory": "1",
        "text": "Score this in the third end phase if all of your surviving fighters (at least three) are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Inspiration"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "67": {
        "code": "67",
        "name": "Undead Swarm",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase <i>if each enemy fighter is adjacent to at least two friendly fighters<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "68": {
        "code": "68",
        "name": "Bone Shrapnel",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that takes a friendly fighter out of action. The fighter that took them out of action suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "69": {
        "code": "69",
        "name": "Ceaseless Attacks",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action. Make an Attack action with another friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "70": {
        "code": "70",
        "name": "Clawing Hands",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Each friendly fighter that is not on the battlefield is considered to be supporting the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "71": {
        "code": "71",
        "name": "Danse Macabre",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Any friendly fighters that make a Move action in the next activation can move one additional hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "72": {
        "code": "72",
        "name": "Grasping Hands",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Reduce the Move characteristic of the first fighter to be activated in the next activation by the number of friendly fighters that are not on the battlefield, to a minimum of 0.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "73": {
        "code": "73",
        "name": "Restless Dead",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Place a friendly fighter that was taken out of action (other than the Sepulchral Warden) on a starting hex in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "74": {
        "code": "74",
        "name": "Spectral Form",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Any friendly fighters that make a Move action in the next activation can move through additional fighters, but must end their moves on empty hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "75": {
        "code": "75",
        "name": "Swift Evasion",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose one friendly fighter and push them up to two hexes. Their new position must be further away from all enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "76": {
        "code": "76",
        "name": "Terrifying Screams",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "77": {
        "code": "77",
        "name": "The Necromancer Commands",
        "faction": "Sepulchral Guard",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that fails. Make the Attack action again.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "78": {
        "code": "78",
        "name": "Ancient Commander",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i> <b>Action:<\/b> Choose three other friendly fighters that have no Move or Charge tokens. Make one Move action with each of the chosen fighters.<div><\/div>",
        "restrictedTo": "The Sepulchral Warden",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "79": {
        "code": "79",
        "name": "Assumed Command",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Each friendly fighter that supports this fighter is considered to be two supporting fighters.<div><\/div>",
        "restrictedTo": "The Prince of Dust",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "80": {
        "code": "80",
        "name": "Deathly Charge",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions with a Range of 1 or 2 have +1 Damage in a phase in which they make a Charge action.<div><\/div>",
        "restrictedTo": "The Champion",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "81": {
        "code": "81",
        "name": "Fatal Strike",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p><b>Reaction:<\/b> Make this Attack action during an Attack action that takes this fighter out of action, before they are removed from the battlefield. It must target their attacker.<div><\/div>",
        "restrictedTo": "The Champion",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "82": {
        "code": "82",
        "name": "Focused Attack",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If you roll at least one <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> this Attack action has Cleave.<div><\/div>",
        "restrictedTo": "The Harvester",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "83": {
        "code": "83",
        "name": "Frightening Speed",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "The Harvester, The Champion, The Prince of Dust",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "84": {
        "code": "84",
        "name": "Grim Cleave",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions gain Cleave.<div><\/div>",
        "restrictedTo": "The Harvester",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "85": {
        "code": "85",
        "name": "Lethal Lunge",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "The Sepulchral Warden",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "86": {
        "code": "86",
        "name": "Remembered Shield",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Defence characteristic changes to <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span>.<div><\/div>",
        "restrictedTo": "The Sepulchral Warden, The Prince of Dust, Petitioners",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "87": {
        "code": "87",
        "name": "Undying",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "281": {
        "code": "281",
        "name": "Plant a Standard",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your leader is holding an objective in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "redirect": "G6"
        }
    },
    "296": {
        "code": "296",
        "name": "Tactical Supremacy 1-2",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold objectives 1 and 2.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "redirect": "G10"
        }
    },
    "297": {
        "code": "297",
        "name": "Tactical Supremacy 3-4",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold objectives 3 and 4.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "redirect": "G11"
        }
    },
    "426": {
        "code": "426",
        "name": "The Dazzling Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding objective 4 in the third end phase, score 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Sepulchral Guard expansion",
        "metadata": {
            "redirect": "G28"
        }
    },
    "----------Ironskull's Boyz expansion": "Ironskull's Boyz expansion",
    "88": {
        "code": "88",
        "name": "'Ard as Iron",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if none of your fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "89": {
        "code": "89",
        "name": "Biggest an' da Best",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your leader took an enemy fighter out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "90": {
        "code": "90",
        "name": "Call of the Waaagh!",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if three or more of your fighters made a Charge action this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "91": {
        "code": "91",
        "name": "Dead Kunnin'",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter has two more supporting fighters than their target when making an Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "92": {
        "code": "92",
        "name": "Dere's More of Us",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have more fighters on the battlefield than <i>your opponent<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "93": {
        "code": "93",
        "name": "Get Da Boss",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "94": {
        "code": "94",
        "name": "Good Scrap",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if <i>three or more fighters<\/i> were taken out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "95": {
        "code": "95",
        "name": "Punch-Up",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if each of your surviving fighters (at least two) made an Attack action against a different enemy fighter in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "96": {
        "code": "96",
        "name": "Too Dumb to Die",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter suffers 3 or more damage in a single attack and is not take out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "supportCards": [
                "Wounds"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "97": {
        "code": "97",
        "name": "'Avin' a Good Time",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a fighter and roll an attack dice. If you roll a <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the can make an Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "98": {
        "code": "98",
        "name": "Brutal But Kunnin'",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action. You can push that fighter up to three hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "99": {
        "code": "99",
        "name": "Deafening Bellow",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter adjacent to one of your fighters. Push that fighter one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "100": {
        "code": "100",
        "name": "Gorkamorka's Blessing",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action with a Range of 1 or 2 in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "101": {
        "code": "101",
        "name": "Kunnin' But Brutal",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Move action. That fighter can make an Attack action. You cannot play this during a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "102": {
        "code": "102",
        "name": "Last Lunge",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an Attack action or ploy that will take a friendly fighter out of action, before removing them from the battlefield. Roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> make an Attack action with that fighter. It must target the attacker.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "103": {
        "code": "103",
        "name": "Leadin' By Example",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action made by your leader that takes an enemy fighter out of action. Another friendly fighter that has not already made a Move or Charge action can make a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "104": {
        "code": "104",
        "name": "More Choppin'",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra attack dice for the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "105": {
        "code": "105",
        "name": "Pillage",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Remove one objective that you hold from the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Removal"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "106": {
        "code": "106",
        "name": "Scrag 'Em",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Each friendly fighter that supports the first Attack action in the next activation is considered to be two supporting fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "107": {
        "code": "107",
        "name": "'Ard Head",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter suffers damage, reduce that damage by 1 to a minimum of 1.<div><\/div>",
        "restrictedTo": "Hakka, Basha",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "108": {
        "code": "108",
        "name": "Aspiring Boss",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action by this fighter that targets an enemy leader and fails, you can re-roll one attack dice.<div><\/div>",
        "restrictedTo": "Hakka",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "109": {
        "code": "109",
        "name": "Brutal Frenzy",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra attack dice when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "Hakka, Basha",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "110": {
        "code": "110",
        "name": "Brutal Swing",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Targets all adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Bonekutta",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "111": {
        "code": "111",
        "name": "Crush and Cleave",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions gain Cleave.<div><\/div>",
        "restrictedTo": "Gurzag Ironskull, Bonekutta",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "112": {
        "code": "112",
        "name": "Dead 'Ard",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter can only be driven back by a critical hit.<div><\/div>",
        "restrictedTo": "Gurzag Ironskull, Bonekutta",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "113": {
        "code": "113",
        "name": "'Eadbutt",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If this Attack action succeeds, the target cannot be activated for the rest of the phase.<div><\/div>",
        "restrictedTo": "Gurzag Ironskull",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "114": {
        "code": "114",
        "name": "Headlong Rush",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions gain Knockback 1 in a phase in which they make a Charge action.<div><\/div>",
        "restrictedTo": "Basha",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "115": {
        "code": "115",
        "name": "Unkillable",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action or ploy that takes this fighter out of action, roll a defence dice. If you roll a <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> they suffer no damage and are not taken out of action, and you discard this upgrade.<div><\/div>",
        "restrictedTo": "Gurzag Ironskull",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "116": {
        "code": "116",
        "name": "Waaagh!",
        "faction": "Ironskull's Boyz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions with a Range of 1 or 2 have +1 Damage in a phase in which they make a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "305": {
        "code": "305",
        "name": "Victorious Duel",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if your leader takes an enemy leader out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "redirect": "G12"
        }
    },
    "315": {
        "code": "315",
        "name": "Daylight Robbery",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an attack dice. If you roll a <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> take one of your opponent's unspent glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "redirect": "G13"
        }
    },
    "318": {
        "code": "318",
        "name": "Distraction",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "redirect": "G14"
        }
    },
    "341": {
        "code": "341",
        "name": "Misdirection",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when a friendly fighter is chosen by a ploy. Choose another friendly fighter that could be chosen by that ploy. That fighter is chosen instead.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "redirect": "G19"
        }
    },
    "416": {
        "code": "416",
        "name": "Shardcaller",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "At the beginning of each action phase, you can switch an objective held by this fighter with any other objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "redirect": "G26"
        }
    },
    "430": {
        "code": "430",
        "name": "The Shadowed Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding objective 2 in the third end phase, score 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ironskull's Boyz expansion",
        "metadata": {
            "redirect": "G32"
        }
    },
    "----------The Chosen Axes expansion": "The Chosen Axes expansion",
    "117": {
        "code": "117",
        "name": "A Claim Retaken",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if a friendly fighter holds an objective that an enemy fighter held at the beginning of the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "118": {
        "code": "118",
        "name": "A Grim Promise",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "119": {
        "code": "119",
        "name": "Ferocious Charge",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter out of action with a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "120": {
        "code": "120",
        "name": "For the Ur-gold",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all your surviving fighters (at least three) are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Inspiration",
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "121": {
        "code": "121",
        "name": "Fury of the Lodge",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all of your surviving fighters (at least three) made a Charge action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "122": {
        "code": "122",
        "name": "Hoarders",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if all of your fighters and no enemy fighters are holding objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "123": {
        "code": "123",
        "name": "Oaths Still to Fulfil",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if none of your fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "124": {
        "code": "124",
        "name": "Scion of Grimnir",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your leader takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                "Damage",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "125": {
        "code": "125",
        "name": "Unstoppable Advance",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if all of your surviving fighters are in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "126": {
        "code": "126",
        "name": "Berserk Fury",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first time a friendly fighter suffers damage in the next activation, roll a defence dice. If the result is a <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> they suffer no damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "127": {
        "code": "127",
        "name": "Indomitable",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first time a friendly fighter suffers damage in the next activation, they only suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "128": {
        "code": "128",
        "name": "Living Wall",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two friendly fighters and push each of them up to one hex. They must end up adjacent to one another.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "129": {
        "code": "129",
        "name": "Oathsworn",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that fails. That fighter can make another Attack action that targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "130": {
        "code": "130",
        "name": "Piercing Stare",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter. They cannot make an Attack action or a Charge action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "131": {
        "code": "131",
        "name": "Slaying Blow",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "If the first Attack action in the next activation is a critical hit, double its Damage characteristic.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "132": {
        "code": "132",
        "name": "The Earth Shakes",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "133": {
        "code": "133",
        "name": "Treasure-lust",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and push them up to three hexes. They must end up holding an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "134": {
        "code": "134",
        "name": "Ur-gold Boon",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> remove up to two wound tokens from them. Otherwise remove one wound token from them.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "135": {
        "code": "135",
        "name": "We Shall Not Be Moved",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Friendly fighters holding objectives cannot be driven back by the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "136": {
        "code": "136",
        "name": "Activated Runes",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Each time this fighter make an Attack action, you can re-roll one dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "137": {
        "code": "137",
        "name": "Brute Strength",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions gain Knockback 1.<div><\/div>",
        "restrictedTo": "Tefk Flamebearer",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "138": {
        "code": "138",
        "name": "Defiant Strike",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Reaction:<\/b> During an Attack action that succeeds against this fighter, this fighter cannot be driven back and makes this Attack action. It must target the attacker.<div><\/div>",
        "restrictedTo": "Tefk Flamebearer",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "139": {
        "code": "139",
        "name": "Flurry of Blows",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p><div><\/div>",
        "restrictedTo": "Mad Maegrim",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "140": {
        "code": "140",
        "name": "Great Swing",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Targets all adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Vol Orrukbane",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "141": {
        "code": "141",
        "name": "Grimnir's Blessing",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action or ploy that would take this fighter out of action, roll a defence dice. If you roll a <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> the damage suffered by this fighter is ignored.<div><\/div>",
        "restrictedTo": "Fjul-Grimnir",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "142": {
        "code": "142",
        "name": "Grimnir's Fortitude",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Fjul-Grimnir",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "143": {
        "code": "143",
        "name": "Grimnir's Speed",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "Fjul-Grimnir",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "144": {
        "code": "144",
        "name": "Returning Axe",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> On a critical hit this Attack action has +1 Damage.<div><\/div>",
        "restrictedTo": "Mad Maegrim",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "145": {
        "code": "145",
        "name": "War Song",
        "faction": "The Chosen Axes",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is considered to be two supporting fighters when they support, rather than one.<div><\/div>",
        "restrictedTo": "Vol Orrukbane",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "294": {
        "code": "294",
        "name": "Tactical Genius 1-3",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold objectives 1, 2 and 3.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "redirect": "G8"
        }
    },
    "344": {
        "code": "344",
        "name": "No Time",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "No more power cards can be played until after the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "redirect": "G20"
        }
    },
    "425": {
        "code": "425",
        "name": "The Blazing Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding objective 3 in the third end phase, score 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Chosen Axes expansion",
        "metadata": {
            "redirect": "G27"
        }
    },
    "----------Spiteclaw's Swarm expansion": "Spiteclaw's Swarm expansion",
    "146": {
        "code": "146",
        "name": "Arm's Length",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes an enemy fighter out of action while they are adjacent to none of your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [
                "Range",
                "Nullstone Spear",
                [
                    "Ploy",
                    "Damage"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "147": {
        "code": "147",
        "name": "Brilliant, Brilliant!",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you scored two or more other objective cards in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "148": {
        "code": "148",
        "name": "Feast-feast",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if <i>all enemy fighters<\/i> have been taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "149": {
        "code": "149",
        "name": "Honed Survival Instincts",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if no friendly fighter was taken out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "150": {
        "code": "150",
        "name": "Leading from the Back",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "Third",
        "glory": "1",
        "text": "Score this in the third end phase if your leader is in your territory and not adjacent to an enemy.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "151": {
        "code": "151",
        "name": "Live to Fight Another Day",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if the only surviving friendly fighter is your leader.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "152": {
        "code": "152",
        "name": "Lives are Cheap",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<i>(Errata update)<\/i> Score this in an end phase if one or more friendly fighters were taken out of action in the preceding action phase, and a friendly fighter had already been taken out of action in that phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [
                "Self-damage"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "153": {
        "code": "153",
        "name": "Numberless Swarm",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "Third",
        "glory": "1",
        "text": "Score this in the third end phase if there are five friendly fighters on the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "154": {
        "code": "154",
        "name": "Skritch is the Greatest, Yes-yes",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your leader takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "155": {
        "code": "155",
        "name": "Aversion to Death",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that takes a friendly fighter out of action. Push up to two friendly fighters one hex each.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "156": {
        "code": "156",
        "name": "Frenzied Stabbing",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action with a Range of 1 or 2 in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "157": {
        "code": "157",
        "name": "Heightened Caution",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra defence dice for the first friendly fighter to be targeted by an Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "158": {
        "code": "158",
        "name": "Momentary Boldness",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter adjacent to two or more friendly fighters. That fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "159": {
        "code": "159",
        "name": "Musk of Fear",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and put them on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "160": {
        "code": "160",
        "name": "Nervous Scrabbling",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter. They switch places with any adjacent fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "161": {
        "code": "161",
        "name": "Scratching in the Shadows",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "162": {
        "code": "162",
        "name": "Skaven Courage",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Play this if there are at least three friendly fighters adjacent to the same enemy fighter. One of those friendly fighters can make an Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "163": {
        "code": "163",
        "name": "Sudden Skittering",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Double the Move characteristic of the first friendly fighter to make a Move action in the next activation. They may not make a Charge action. Once they have moved, they cannot be activated again this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "164": {
        "code": "164",
        "name": "There Are Always More",
        "faction": "Spiteclaw's Swarm",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose one friendly fighter that is out of action (other than Skritch or Krrk). Remove all wound tokens from them and place them on any starting hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "165": {
        "code": "165",
        "name": "Black Hunger",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions with a Range of 1 have +1 Damage, and target all adjacent fighters (friend and foe) - roll for each. Fighters do not provide support for Attack actions against friendly models (in attack or defence).<div><\/div>",
        "restrictedTo": "Hungering Skaven",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "166": {
        "code": "166",
        "name": "Bodyguard for a Price",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If Skritch is adjacent to this fighter, Skritch is on Guard (even if Skritch has made a Charge action this phase).<div><\/div>",
        "restrictedTo": "Krrk the Almost-Trusted",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "167": {
        "code": "167",
        "name": "Expendable",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i> <b>Reaction:<\/b> During an enemy fighter's Attack action that targets this fighter, after the determine success step, if the Attack action is successful, deal 1 damage to the attacker. Then the Attack action fails, the combat sequence ends, and this fighter is taken out of action. No player gains a glory point for this fighter being taken out of action in this way.<div><\/div>",
        "restrictedTo": "Lurking Skaven, Hungering Skaven, Festering Skaven",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Other"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "168": {
        "code": "168",
        "name": "Festering Blades",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "On a critical hit, this fighter's Attack actions with a Range of 1 or 2 have +2 Damage.<div><\/div>",
        "restrictedTo": "Festering Skaven",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "169": {
        "code": "169",
        "name": "Flee!",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> This fighter and one adjacent friendly fighter can make a Move action. Both fighters must end their move further away from all enemy fighters.<div><\/div>",
        "restrictedTo": "Skritch Spiteclaw",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "170": {
        "code": "170",
        "name": "Skitter-scurry",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After any action that this fighter makes, you can push this fighter one hex.<div><\/div>",
        "restrictedTo": "Skritch Spiteclaw, Krrk the Almost-Trusted",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "171": {
        "code": "171",
        "name": "Sneaky Stab-stab",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can push this fighter one hex before they take an Attack action, though not when this fighter takes a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "172": {
        "code": "172",
        "name": "Swarm of Rats",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> Targets all adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Krrk the Almost-Trusted",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "173": {
        "code": "173",
        "name": "Throwing Stars",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p><div><\/div>",
        "restrictedTo": "Lurking Skaven",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "174": {
        "code": "174",
        "name": "Whirling Halberd",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Targets all adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Skritch Spiteclaw",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "249": {
        "code": "249",
        "name": "Cover Ground",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter makes a Move action of six or more hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "redirect": "G3"
        }
    },
    "295": {
        "code": "295",
        "name": "Tactical Genius 3-5",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold objectives 3, 4 and 5.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "redirect": "G9"
        }
    },
    "349": {
        "code": "349",
        "name": "Rebound",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an enemy Attack action that would succeed. Roll a defence dice. On a roll of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the attacker suffers the damage, rather than the target, and neither fighter is driven back.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "redirect": "G21"
        }
    },
    "428": {
        "code": "428",
        "name": "The Fractured Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding objective 5 in the third end phase, score 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Spiteclaw's Swarm expansion",
        "metadata": {
            "redirect": "G30"
        }
    },
    "----------Magore's Fiends expansion": "Magore's Fiends expansion",
    "175": {
        "code": "175",
        "name": "All the Better to Slay Them",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if all friendly fighters (at least three) are adjacent to a different enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "176": {
        "code": "176",
        "name": "Bane of Champions",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if Riptooth takes an enemy leader out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "177": {
        "code": "177",
        "name": "Bloody Annihilation",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase <i>if all enemy fighters have been taken out of action<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "178": {
        "code": "178",
        "name": "Khorne Sees Us",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes two or more enemy fighters out of action in a phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "179": {
        "code": "179",
        "name": "Kill! Kill Again!",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least two fighters from each warband are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "180": {
        "code": "180",
        "name": "No Escape",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if three or more of your fighters made a Charge action this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "181": {
        "code": "181",
        "name": "Rivers of Blood",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if all surviving fighters (at least four) are wounded.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Self-damage"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "182": {
        "code": "182",
        "name": "Save the Best",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if an enemy leader is the only surviving enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "183": {
        "code": "183",
        "name": "Show of Strength",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your leader takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "184": {
        "code": "184",
        "name": "Blood Frenzy",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a fighter out of action. Roll one extra attack dice for the first Attack action in the next activation. Both <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> and <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> are successes for that Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "185": {
        "code": "185",
        "name": "Bloodslick Ground",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "In the next activation, enemy fighters have -2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "186": {
        "code": "186",
        "name": "Bloody Retribution",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that takes a friendly fighter out of action. A friendly fighter adjacent to the attacker makes an Attack action against that fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "187": {
        "code": "187",
        "name": "Continue the Slaughter",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a fighter out of action. The first Attack action in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "188": {
        "code": "188",
        "name": "Daemonic Resilience",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter who suffers any amount of damage in the next activation only suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "189": {
        "code": "189",
        "name": "Fountain of Gore",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a fighter out of action. All friendly fighters have +1 Defence in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "190": {
        "code": "190",
        "name": "Furious Inspiration",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter. The become Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other",
                "Inspiration"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "191": {
        "code": "191",
        "name": "Glory to Khorne",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll one extra attack dice for the first Attack action made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "192": {
        "code": "192",
        "name": "Horrifying Howl",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter that is adjacent to a friendly fighter and push them up to two hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "193": {
        "code": "193",
        "name": "To the Victor, the Spoils",
        "faction": "Magore's Fiends",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that takes an enemy fighter with a Wounds characteristic of 3 or more out of action. Draw three power cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "194": {
        "code": "194",
        "name": "Brutal Charge",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra attack dice when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "Magore Redhand, Ghartok Flayskull, Zharkus the Bloodsighted",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "195": {
        "code": "195",
        "name": "Daemonic Maw",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<\/p> If this Attack action succeeds, remove one wound token from this fighter.<div><\/div>",
        "restrictedTo": "Magore Redhand",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "196": {
        "code": "196",
        "name": "Furious Charge",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Charge action both <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> and <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> are successes.<div><\/div>",
        "restrictedTo": "Zharkus the Bloodsighted",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "197": {
        "code": "197",
        "name": "No Respite",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action or ploy that will take this fighter out of action, you can make an Attack action with them.<div><\/div>",
        "restrictedTo": "Magore Redhand, Ghartok Flayskull, Zharkus the Bloodsighted",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "198": {
        "code": "198",
        "name": "Predatory Leap",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Charge action they can move through other fighters, but their move must end in an empty hex.<div><\/div>",
        "restrictedTo": "Riptooth the Flesh Hound",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "199": {
        "code": "199",
        "name": "Rage-fuelled Attacks",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions with a Range of 1 or 2 have +1 Damage.<div><\/div>",
        "restrictedTo": "Zharkus the Bloodsighted",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "200": {
        "code": "200",
        "name": "Shake About",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's successful Attack actions with a Range of 1 can push the target one hex (instead of driving them back) in addition to inflicting damage.<div><\/div>",
        "restrictedTo": "Riptooth the Flesh Hound",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "201": {
        "code": "201",
        "name": "Trophy Hunter",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter takes an enemy fighter out of action, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "Magore Redhand",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "202": {
        "code": "202",
        "name": "Unshakeable",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action that could drive this fighter back (whether or not your opponent chooses to do so), you can instead push them one hex.<div><\/div>",
        "restrictedTo": "Riptooth the Flesh Hound",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "203": {
        "code": "203",
        "name": "Wrathful Blows",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "All of this fighter's Attack actions have +1 Dice.<div><\/div>",
        "restrictedTo": "Ghartok Flayskull",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "340": {
        "code": "340",
        "name": "Mischievous Spirits",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Taking it in turns with your opponent(s), starting with you and going clockwise, move each objective one hex. Objectives cannot be moved into a hex that already contains an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "redirect": "G18"
        }
    },
    "427": {
        "code": "427",
        "name": "The Formless Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding an objective in the third end phase, score 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Magore's Fiends expansion",
        "metadata": {
            "redirect": "G29"
        }
    },
    "----------The Farstriders expansion": "The Farstriders expansion",
    "204": {
        "code": "204",
        "name": "Behead the Beast",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "205": {
        "code": "205",
        "name": "Brave but Cautious",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have at least one surviving fighter and none of your fighters suffered any damage in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Defence"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "206": {
        "code": "206",
        "name": "Close with the Enemy",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three friendly fighters are adjacent to enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Survivability"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "207": {
        "code": "207",
        "name": "Eternal Supremacy",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "208": {
        "code": "208",
        "name": "Lightning Advance",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all of your surviving fighters (at least two) are in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "209": {
        "code": "209",
        "name": "Meticulous Annihilation",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if <i>all enemy fighters<\/i> have been taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "210": {
        "code": "210",
        "name": "Punishing Volleys",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you made at least three successful Boltstorm Pistol or Overcharged Boltstorm Pistol Attack actions in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                [
                    "Free Action",
                    "Damage"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "211": {
        "code": "211",
        "name": "Ranger Strike",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband has taken two or more fighters out of action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                "Damage",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "212": {
        "code": "212",
        "name": "Sigmar's Finest",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your surviving fighters (at least one) are outnumbered by surviving enemy fighters by at least <i>three to one<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "213": {
        "code": "213",
        "name": "Fearsome Roar",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter adjacent to a friendly fighter. Push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "214": {
        "code": "214",
        "name": "Firm Footing",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra defence dice for friendly fighters holding objectives in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "215": {
        "code": "215",
        "name": "Lightning Blow",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "216": {
        "code": "216",
        "name": "Lightning Stride",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Double the Move characteristic of the first friendly fighter to make a Move action in the next activation. They may not make a Charge action. Once they have moved, they cannot be activated again this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "217": {
        "code": "217",
        "name": "Patient Defence",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter to be targeted by an Attack action in the next activation has +1 Defence.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "218": {
        "code": "218",
        "name": "Rangers, Advance",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two friendly fighters and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "219": {
        "code": "219",
        "name": "Rapid Volley",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Boltstorm Pistol or Overcharged Boltstorm Pistol Attack action. That fighter can make another Boltstorm Pistol or Overcharged Boltstorm Pistol Attack action that targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "220": {
        "code": "220",
        "name": "Retribution",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that damages a friendly fighter. That fighter can make an Attack action that must target the attacker.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Wounds"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "221": {
        "code": "221",
        "name": "Steady Volley",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter to make a Boltstorm Pistol or Overcharged Bolstorm Pistol Attack action in the next activation can be pushed one hex before they do so.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "222": {
        "code": "222",
        "name": "Warning Cry",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and put them on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "223": {
        "code": "223",
        "name": "Aetheric Step",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter can move through other fighters during a Move action, but must end their move in an empty hex.<div><\/div>",
        "restrictedTo": "Sanson Farstrider",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "224": {
        "code": "224",
        "name": "Covering Fire",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter can support an adjacent friendly fighter targeted by an Attack action, even if this fighter is not adjacent to the attacker.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "225": {
        "code": "225",
        "name": "Flashing Handaxe",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<br>Cleave<\/p>.<div><\/div>",
        "restrictedTo": "Sanson Farstrider",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "226": {
        "code": "226",
        "name": "Furious Blow",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action that targets this fighter and has failed, this fighter cannot be driven back and can make an Attack action. It must target the attacker.<div><\/div>",
        "restrictedTo": "Almeric Eagle-Eye",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Defence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "227": {
        "code": "227",
        "name": "Lone Warrior",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Rolls of <img src=\"img\/single-support.png\" alt=\"Single Support\"><span class=\"sr-only\">Single support<\/span> made for this fighter when they are targeted by an Attack action also count as successes when they are adjacent to no friendly fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "228": {
        "code": "228",
        "name": "Overcharged Boltstorm Pistol",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "229": {
        "code": "229",
        "name": "Sharp Eyes",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions gain Cleave.<div><\/div>",
        "restrictedTo": "Almeric Eagle-Eye",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "230": {
        "code": "230",
        "name": "Spinning Strike",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> Targets all adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Elias Swiftblade",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "231": {
        "code": "231",
        "name": "Swift Stride",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "232": {
        "code": "232",
        "name": "Well-timed Lunge",
        "faction": "The Farstriders",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "Elias Swiftblade",
        "box": "The Farstriders expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "246": {
        "code": "246",
        "name": "Concerted Attack",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if three or more friendly fighters made an Attack action against the same enemy fighter in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "361": {
        "code": "361",
        "name": "Spectral Wings",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first fighter to make a Move action in the next activation has +2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "redirect": "G22"
        }
    },
    "429": {
        "code": "429",
        "name": "The Hallowed Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding objective 1 in the third end phase, score 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Farstriders expansion",
        "metadata": {
            "redirect": "G31"
        }
    },
    "----------Leaders": "Leaders",
    "L1": {
        "code": "L1",
        "name": "Invulnerable",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Your leader has +1 Defence for the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L2": {
        "code": "L2",
        "name": "Steelheart's Second",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions have +1 Damage when they are adjacent to a friendly leader.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L3": {
        "code": "L3",
        "name": "The Stage Is Set",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if the only surviving fighters (at least 2) are leaders.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L4": {
        "code": "L4",
        "name": "Coveted Trophy",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when your leader takes an enemy leader out of action. Gain a glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "L5": {
        "code": "L5",
        "name": "Fervent Petition",
        "faction": "Sepulchral Guard",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if three friendly Petitioners are surviving and Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [
                "Inspiration"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L6": {
        "code": "L6",
        "name": "Warden's Call",
        "faction": "Sepulchral Guard",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Choose two friendly fighters (other than your leader) and put them on Guard.<div><\/div>",
        "restrictedTo": "The Sepulchral Warden",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "L7": {
        "code": "L7",
        "name": "Showin' Off",
        "faction": "Ironskull's Boyz",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase is your leader took two or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L8": {
        "code": "L8",
        "name": "Impress da Boss",
        "faction": "Ironskull's Boyz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage for the first Attack action in the next activation made by a friendly fighter adjacent to your leader.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L9": {
        "code": "L9",
        "name": "Pride of the Lodge",
        "faction": "The Chosen Axes",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your leader has three or more upgrades with his warband symbol.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L10": {
        "code": "L10",
        "name": "Grimnir Commands",
        "faction": "The Chosen Axes",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter (other than your leader) to make a Move action (not as part of a Charge action) in the next activation has +2 Move. You can only play this if your leader is on the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L11": {
        "code": "L11",
        "name": "Krrk Now Leads!",
        "faction": "Spiteclaw's Swarm",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your leader is out of action and a friendly fighter named Krrk is on the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L12": {
        "code": "L12",
        "name": "Krrk the Clawchief",
        "faction": "Spiteclaw's Swarm",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Return a friendly fighter (other than Skritch) to the battlefield in an empty hex adjacent to this fighter.<div><\/div>",
        "restrictedTo": "Krrk the Almost-Trusted",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L13": {
        "code": "L13",
        "name": "Khorne's Chosen",
        "faction": "Magore's Fiends",
        "type": "Objective",
        "subtype": "End",
        "glory": "8",
        "text": "Score this in an end phase if your leader is the only surviving fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L14": {
        "code": "L14",
        "name": "Gory Visage",
        "faction": "Magore's Fiends",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Attack actions that target this fighter deal 1 less damage, to a minimum of 1.<div><\/div>",
        "restrictedTo": "Magore Redhand",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L15": {
        "code": "L15",
        "name": "Intervention",
        "faction": "The Farstriders",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your leader takes an enemy holding an objective out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "L16": {
        "code": "L16",
        "name": "Raptor Strike",
        "faction": "The Farstriders",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter within four hexes of your leader. They take 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Leaders",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "----------Nightvault core set": "Nightvault core set",
    "N1": {
        "code": "N1",
        "name": "Blessed Banishment",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N2": {
        "code": "N2",
        "name": "Devastating Blow",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took two or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N3": {
        "code": "N3",
        "name": "Fight as One",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter makes an Attack action with two supporting friendly fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N4": {
        "code": "N4",
        "name": "Harness the Storm",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter successfully casts a spell.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N5": {
        "code": "N5",
        "name": "Heavily Armed",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three or more friendly fighters each have at least one upgrade.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N6": {
        "code": "N6",
        "name": "Magical Supremacy",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband successfully cast two or more spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N7": {
        "code": "N7",
        "name": "Measured Strike",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter makes a successful Attack action that deals exactly enough damage to take their target out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N8": {
        "code": "N8",
        "name": "Overwhelming Storm",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have more surviving fighters <i>than your opponent<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N9": {
        "code": "N9",
        "name": "Purify the Earth",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold an objective held by an enemy fighter at the beginning of the round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N10": {
        "code": "N10",
        "name": "Aetherwing Stance",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Friendly fighter have +1 Defence for the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N11": {
        "code": "N11",
        "name": "Chain Lightning",
        "faction": "Stormsire's Cursebreakers",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast Scatter 3 from the caster's hex. Any enemy fighter in a hex in the chain suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N12": {
        "code": "N12",
        "name": "Cry of Thunder",
        "faction": "Stormsire's Cursebreakers",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter. That fighter and any fighters adjacent to that fighter suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N13": {
        "code": "N13",
        "name": "Empathic Conduction",
        "faction": "Stormsire's Cursebreakers",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose a friendly fighter adjacent to the caster. Remove a wound token from that fighter's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N14": {
        "code": "N14",
        "name": "Gather the Storm",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>)<\/b> for the next spell your warband attempts to cast. This effect persists.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N15": {
        "code": "N15",
        "name": "Lightning Assault",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that fails. That fighter can make another Attack action that targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N16": {
        "code": "N16",
        "name": "Lightning Step",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter to make a Move or Charge action in the next activation can move through occupied and blocked hexes, but must end their move in an empty hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N17": {
        "code": "N17",
        "name": "Safeguard Spirit",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or gambit that takes a friendly fighter adjacent to another friendly fighter out of action. Your opponent doesn't score any glory points for taking that fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N18": {
        "code": "N18",
        "name": "Stormstrike",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Attack action with a Range of 1 or 2 in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N19": {
        "code": "N19",
        "name": "Stormward",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an enemy fighter's spell or spell Attack action, if the spell is cast. Roll a magic dice. On a roll of <img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> that spell is not cast and is not resolved.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Anti-spell"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N20": {
        "code": "N20",
        "name": "Blessed Blade",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<br>Cleave<\/p>.<div><\/div>",
        "restrictedTo": "Averon Stormsire",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N21": {
        "code": "N21",
        "name": "Corposant Staff",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Spell Action (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose a friendly fighter. Their Attack actions with a single target have +1 Range until the end of the phase.<div><\/div>",
        "restrictedTo": "Averon Stormsire",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Spell"
            ]
        }
    },
    "N22": {
        "code": "N22",
        "name": "Disarming Blow",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an Attack action made by an adjacent enemy fighter that targets this fighter and fails, roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, select an Attack action upgrade on the attacking fighter. That upgrade is discarded.<div><\/div>",
        "restrictedTo": "Rastus the Charmed, Ammis Dawnguard",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N23": {
        "code": "N23",
        "name": "Eye of the Storm",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>)<\/b><div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N24": {
        "code": "N24",
        "name": "Hurricane Step",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's Attack action, push this fighter up to one hex.<div><\/div>",
        "restrictedTo": "Rastus the Charmed, Ammis Dawnguard",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N25": {
        "code": "N25",
        "name": "Lightning Whip",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's Attack action that succeeds, deal 1 additional damage to the target of that Attack action.<div><\/div>",
        "restrictedTo": "Rastus the Charmed, Ammis Dawnguard",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N26": {
        "code": "N26",
        "name": "Stunning Blow",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an Attack action made by an adjacent enemy fighter that targets this fighter and fails, roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, place a Charge token next to the attacking fighter.<div><\/div>",
        "restrictedTo": "Rastus the Charmed, Ammis Dawnguard",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N27": {
        "code": "N27",
        "name": "Tempest's Might",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all spell Attack actions.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N28": {
        "code": "N28",
        "name": "Unstoppable Zeal",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Reaction:<\/b> After this fighter's Attack action that takes an enemy fighter out of action, this fighter can make this Attack action.<div><\/div>",
        "restrictedTo": "Rastus the Charmed",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N29": {
        "code": "N29",
        "name": "Warding Blast",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Targets all adjacent enemies - roll for each.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "N30": {
        "code": "N30",
        "name": "As Nagash Commands",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if no enemy fighters are holding objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Enemy Displacement",
                "Accuracy"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N31": {
        "code": "N31",
        "name": "Death Sentence",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if three or more friendly fighters are adjacent to the same enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N32": {
        "code": "N32",
        "name": "Drag Them Down",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if three or more friendly fighters made a successful Attack action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N33": {
        "code": "N33",
        "name": "Execution",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N34": {
        "code": "N34",
        "name": "Swarming Spirits",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if two or more friendly fighters moved through a hex occupied by an enemy fighter in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N35": {
        "code": "N35",
        "name": "Take the City",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you hold all objectives on one or more game boards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N36": {
        "code": "N36",
        "name": "The Vengeful Dead",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters (at least three) are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Inspiration",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N37": {
        "code": "N37",
        "name": "Treacherous Foe",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband makes a reaction.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Reaction"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N38": {
        "code": "N38",
        "name": "Vengeful Advance",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters are <i>in your opponent's territory<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N39": {
        "code": "N39",
        "name": "Drifting Advance",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Push all friendly Chainrasps up to two hexes. This push must take them closer to the nearest enemy fighter in each case. If there is more than one nearest enemy fighter, you can choose which the Chainrasp is pushed towards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N40": {
        "code": "N40",
        "name": "Endless Malice",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that fails. That fighter can make another Attack action that targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N41": {
        "code": "N41",
        "name": "Grasping Chains",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Each friendly Chainrasp providing support in the first Attack action in the next activation is considered to be two supporting fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N42": {
        "code": "N42",
        "name": "Howling Vortex",
        "faction": "Thorns of the Briar Queen",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, push all enemy fighters up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N43": {
        "code": "N43",
        "name": "Maddening Cackle",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Attack action that fails. That fighter is no longer Inspired, and cannot be Inspired. This effect persists.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N44": {
        "code": "N44",
        "name": "Rending Scream",
        "faction": "Thorns of the Briar Queen",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, each enemy fighter adjacent to the caster suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N45": {
        "code": "N45",
        "name": "Spectral Parry",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter that does not have a Guard token. Place a Guard token next to them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N46": {
        "code": "N46",
        "name": "Spectral Touch",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action in the next activation has Cleave.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N47": {
        "code": "N47",
        "name": "Sudden Appearance",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and place them on any starting hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N48": {
        "code": "N48",
        "name": "Vengeful Curse",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Attack action that takes an adjacent friendly fighter out of action. Their attacker suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N49": {
        "code": "N49",
        "name": "Chill Touch",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Rolls of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> are not successes for defence rolls made during Attack actions made by this fighter.<div><\/div>",
        "restrictedTo": "Chainrasp",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "N50": {
        "code": "N50",
        "name": "Creeping Terror",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter makes a Move action, roll an attack dice for the first enemy fighter they moved through in that action. On a <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, the enemy fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N51": {
        "code": "N51",
        "name": "Curse of Unbinding",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an enemy fighter's spell or spell Attack action, if the spell is cast and the caster is within three hexes of this fighter, roll a magic dice. On a roll of <img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> that spell is not cast and is not resolved.<div><\/div>",
        "restrictedTo": "Briar Queen",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Anti-spell"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N52": {
        "code": "N52",
        "name": "Driven by Hatred",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice to their Attack action when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N53": {
        "code": "N53",
        "name": "Face of Death",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an adjacent enemy fighter's Attack action, before any dice are rolled, roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, your opponent rolls 1 fewer dice for that Attack action (to a minimum of 1).<div><\/div>",
        "restrictedTo": "Chainrasp",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N54": {
        "code": "N54",
        "name": "Grasping Thorns",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's successful Attack action, you can push the target of that Attack action up to two hexes. They must end this push adjacent to this fighter.<div><\/div>",
        "restrictedTo": "Briar Queen",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N55": {
        "code": "N55",
        "name": "Inescapable Vengeance",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Move or Charge action, instead of moving them normally you can place them on any starting hex.<div><\/div>",
        "restrictedTo": "Briar Queen",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N56": {
        "code": "N56",
        "name": "Sadistic Strike",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> If the target has any wound tokens, this Attack action deals +2 Damage.<div><\/div>",
        "restrictedTo": "Varclav the Cruel",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N57": {
        "code": "N57",
        "name": "Shacklegheist Chains",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter's Attack action takes an enemy fighter out of action, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "Varclav the Cruel",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N58": {
        "code": "N58",
        "name": "Strangling Coil",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<\/p><div><\/div>",
        "restrictedTo": "The Ever-hanged",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N294": {
        "code": "N294",
        "name": "Annihilation",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if <i>all enemy fighters have been taken out of action<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B264"
        }
    },
    "N306": {
        "code": "N306",
        "name": "Conquest",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if all of your surviving fighters are <i>in your opponent's territory<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B273"
        }
    },
    "N310": {
        "code": "N310",
        "name": "Denial",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if there are no enemy fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B275"
        }
    },
    "N330": {
        "code": "N330",
        "name": "Hold Objective 1",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>1<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B283"
        }
    },
    "N331": {
        "code": "N331",
        "name": "Hold Objective 2",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>2<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B284"
        }
    },
    "N332": {
        "code": "N332",
        "name": "Hold Objective 3",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>3<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B285"
        }
    },
    "N333": {
        "code": "N333",
        "name": "Hold Objective 4",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>4<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B286"
        }
    },
    "N334": {
        "code": "N334",
        "name": "Hold Objective 5",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you are holding objective <i>5<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B287"
        }
    },
    "N374": {
        "code": "N374",
        "name": "Supremacy",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B305"
        }
    },
    "N403": {
        "code": "N403",
        "name": "Confusion",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two fighters that are adjacent to each other and switch them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B329"
        }
    },
    "N409": {
        "code": "N409",
        "name": "Determined Effort",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice for the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N419": {
        "code": "N419",
        "name": "Grinding Earth",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an empty hex adjacent to the caster and place the chasm token on it. A hex with a chasm token is a lethal hex. Remove the token at the end of the action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N446": {
        "code": "N446",
        "name": "Sidestep",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B366"
        }
    },
    "N471": {
        "code": "N471",
        "name": "Vital Surge",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose a friendly fighter and remove up to two wound tokens from their fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N497": {
        "code": "N497",
        "name": "Escape Artist",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Attack action that targets this fighter and fails, push this fighter up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N504": {
        "code": "N504",
        "name": "Great Fortitude",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B396"
        }
    },
    "N505": {
        "code": "N505",
        "name": "Great Speed",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B397"
        }
    },
    "N506": {
        "code": "N506",
        "name": "Great Strength",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "redirect": "B398"
        }
    },
    "N512": {
        "code": "N512",
        "name": "Lucky Trinket",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an enemy fighter's spell or spell Attack action, if the spell is cast and the caster is within three hexes of this fighter, roll three magic dice. If you roll at least one <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that spell is not cast and is not resolved. In either case, discard this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Nightvault core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "----------The Eyes of the Nine expansion": "The Eyes of the Nine expansion",
    "N59": {
        "code": "N59",
        "name": "Agents of Change",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband successfully cast four or more spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N60": {
        "code": "N60",
        "name": "Bind the City",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N61": {
        "code": "N61",
        "name": "Chosen by Destiny",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if either Narvia or Turosh from your warband is on the battlefield and the other is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N62": {
        "code": "N62",
        "name": "Eyes of the Master",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there is at least one friendly fighter in each of the following: your territory, enemy territory, and no one's territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N63": {
        "code": "N63",
        "name": "Harness Knowledge",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if the same friendly fighter has held the same objective at the end of two consecutive action phases.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N64": {
        "code": "N64",
        "name": "Master of Magic",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband successfully casts two or more spells in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N65": {
        "code": "N65",
        "name": "Rising Inferno",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you caused 4 or more damage with spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                [
                    "Spell",
                    "Damage"
                ],
                [
                    "Spell",
                    "Weapon"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N66": {
        "code": "N66",
        "name": "Summoner",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately the second or subsequent time you use Vortemis' action to summon a Blue Horror.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N67": {
        "code": "N67",
        "name": "Ultimate Change",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took two or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N68": {
        "code": "N68",
        "name": "Blessing of Tzeentch",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>)<\/b> for the first spell your warband attempts to cast in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N69": {
        "code": "N69",
        "name": "Bound by Fate",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two friendly fighters that are within three hexes of each other. Switch their positions.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N70": {
        "code": "N70",
        "name": "Deceitful Step",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter that is not adjacent to an enemy fighter and roll a magic dice. On a roll of <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>, place them on any starting hex. Otherwise, place them on any objective token. If you cannot, nothing happens.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N71": {
        "code": "N71",
        "name": "Driven by Ambition",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter to make a Move action (not as part of a Charge action) in the next activation has +2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N72": {
        "code": "N72",
        "name": "Eidetic Memory",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action made by friendly K'charik that fails. They can make another Attack action which targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N73": {
        "code": "N73",
        "name": "Malicious Flames",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an Attack action or gambit that has dealt enough damage to a friendly Brimstone Horrors to take it out of action, but before removing the fighter from the battlefield. Adjacent enemy fighters suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N74": {
        "code": "N74",
        "name": "Ravenous Flame",
        "faction": "The Eyes of the Nine",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, Scatter 3 from any lethal hex. Any fighters in any hex in the chain suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter",
                "Lethal"
            ]
        }
    },
    "N75": {
        "code": "N75",
        "name": "Shield of Fate",
        "faction": "The Eyes of the Nine",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, the caster has +1 Defence. This spell persists until the caster is out of action or the end of the round, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N76": {
        "code": "N76",
        "name": "Stolen Fate",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "You can re-roll one dice for the attack roll of the first Attack action made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N77": {
        "code": "N77",
        "name": "Wracking Change",
        "faction": "The Eyes of the Nine",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast choose an enemy fighter within 4 hexes of the caster. That fighter suffers 1 damage and 1 additional damage for each <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the casting roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N78": {
        "code": "N78",
        "name": "Arcanite Shield",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Defence characteristic changes to <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span>.<div><\/div>",
        "restrictedTo": "Turosh",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N79": {
        "code": "N79",
        "name": "Bizarre Capering",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Blue Horror, Brimstone Horrors",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N80": {
        "code": "N80",
        "name": "Empowered Sorcery",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all spell Attack actions.<div><\/div>",
        "restrictedTo": "Vortemis the All-seeing",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                [
                    "Weapon",
                    "Spell"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N81": {
        "code": "N81",
        "name": "Fateward",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can re-roll the defence roll for this fighter when it is the target of an Attack action.<div><\/div>",
        "restrictedTo": "K\u2019Charik",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N82": {
        "code": "N82",
        "name": "Fiery Blessing",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice to this fighter's Attack actions that have a Range of 3 or more.<div><\/div>",
        "restrictedTo": "Narvia",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N83": {
        "code": "N83",
        "name": "Piercing Bolt",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "Vortemis the All-seeing",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave",
                "Spell"
            ]
        }
    },
    "N84": {
        "code": "N84",
        "name": "Scroll of the Dark Arts",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Sorcerous Bolt Attack action has +1 Range.<div><\/div>",
        "restrictedTo": "Narvia, Turosh",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N85": {
        "code": "N85",
        "name": "Silver Tether",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is holding an objective in the third end phase, score 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N86": {
        "code": "N86",
        "name": "Sorcerous Adept",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>)<\/b><div><\/div>",
        "restrictedTo": "Vortemis the All-seeing",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N87": {
        "code": "N87",
        "name": "Strength of Arrogance",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "K\u2019Charik",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N291": {
        "code": "N291",
        "name": "Acolyte of the Katophranes",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "1",
        "text": "Score this in the third end phase if you have at least one surviving friendly fighter that has at least one Katophrane Tome. Choose a surviving friendly. Gain 1 glory point for each Katophrane Tome that fighter has.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Tome"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Tome",
                "Restricted"
            ]
        }
    },
    "N304": {
        "code": "N304",
        "name": "Charmed Life",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you removed at least 3 wound tokens from a single fighter, and that fighter was not taken out of action, in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Healing"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N318": {
        "code": "N318",
        "name": "Finish Them",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes an enemy fighter out of action with an Attack action with a Damage characteristic of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N319": {
        "code": "N319",
        "name": "Fired Up",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least one surviving friendly fighter is Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Inspiration"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N326": {
        "code": "N326",
        "name": "Great Gains",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you gained at least 5 glory points in this round.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Glory"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N342": {
        "code": "N342",
        "name": "Loner",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least one surviving friendly fighter has no other fighter within three hexes.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "N355": {
        "code": "N355",
        "name": "On a Roll",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you scored at least four other objective cards in this round.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N370": {
        "code": "N370",
        "name": "Sorcerous Retort",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband successfully casts a spell as a reaction.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                [
                    "Spell",
                    "Reaction"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N376": {
        "code": "N376",
        "name": "Tactical Supremacy 1-4",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold objectives 1 and 4.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N378": {
        "code": "N378",
        "name": "Tempting Target",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes an enemy fighter with at least two upgrades out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N385": {
        "code": "N385",
        "name": "What Armour?",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter's Attack action with Cleave succeeds.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "supportCards": [
                "Cleave"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N389": {
        "code": "N389",
        "name": "Abasoth's Withering",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within four hexes of the caster. That fighter has -1 Wounds (to a minimum of 1). This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N395": {
        "code": "N395",
        "name": "Arcane Smothering",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose one persisting spell. That spell is discarded.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N402": {
        "code": "N402",
        "name": "Confusing Reflection",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when an enemy fighter successfully casts a spell with Scatter, before they resolve the Scatter. You resolve the Scatter instead. The effect of the spell remains the same.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Scatter",
                "Reaction"
            ]
        }
    },
    "N404": {
        "code": "N404",
        "name": "Countercharge",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Move action that is part of a Charge action. Choose a friendly fighter and push them up to three hexes. They must end this push adjacent to the enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N422": {
        "code": "N422",
        "name": "Imbue with Life",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an objective token within four hexes of the caster. Scatter 2 from that token's hex, and place the objective token in the end hex. If the end hex is blocked, lethal or contains an objective token, or if the chain would leave the battlefield, leave the objective token where it is.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Positioning"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Scatter",
                "Objective"
            ]
        }
    },
    "N426": {
        "code": "N426",
        "name": "Irresistible Prize",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i> Choose an objective token. Push all fighters that are within 2 hexes 1 hex so that they are standing on or closer to that token in an order you choose.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push",
                "Other",
                "Objective Hold",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N437": {
        "code": "N437",
        "name": "Power Surge",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an attempt to cast a spell, after the dice are rolled but before the spell is resolved or fails, if at least one <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> was rolled in the casting roll. Add a <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> to the casting roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Self-damage"
            ]
        }
    },
    "N448": {
        "code": "N448",
        "name": "Sorcerous Insight",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span><img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose one ploy from your discard pile and add it to your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N450": {
        "code": "N450",
        "name": "Soul Drain",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>) Reaction:<\/b> Cast this spell after an Attack action or gambit that takes an enemy fighter out of action. If this spell is cast, remove up to one wound token from the caster's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N452": {
        "code": "N452",
        "name": "Sphere of Azyr",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose an enemy fighter holding an objective. They suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting",
                "Objective Positioning",
                "Enemy Displacement"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N473": {
        "code": "N473",
        "name": "Arcane Familiar",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Each time this fighter attempts to cast a spell, after the casting roll, you can change one of the symbols rolled to <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N478": {
        "code": "N478",
        "name": "Binding Shard",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Fighters adjacent to this fighter cannot be pushed (or driven back).<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N502": {
        "code": "N502",
        "name": "Gallant's Courage",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter is the target of an Attack action, they cannot be driven back if there are any successes in their defence roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N519": {
        "code": "N519",
        "name": "Nullstone Hammer",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<br>Knockback 1<\/p> You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "N526": {
        "code": "N526",
        "name": "Potion of Clarity",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During this fighter's attempt to cast a spell, after the casting roll, discard this card. You can re-roll one dice from the casting roll.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N534": {
        "code": "N534",
        "name": "Ritual Dagger",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> When a fighter makes this Attack action, the Dice characteristic (before other modifiers) is equal to their wizard level. If there are any <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the attack roll, this Attack action has Cleave.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Spellcasting",
                "Cleave"
            ]
        }
    },
    "N537": {
        "code": "N537",
        "name": "Seeking Stones",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> Rolls of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> are not considered successes against this Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "N538": {
        "code": "N538",
        "name": "Shifting Map",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is not out of action in the third end phase, draw an objective card. If it is worth 1 glory point, you gain 1 glory point (you cannot score the card you draw).<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N543": {
        "code": "N543",
        "name": "Sudden Growth",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-2 Move (to a minimum of 0), +2 Wounds.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "N545": {
        "code": "N545",
        "name": "Tome of Diseases",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Katophrane Tome<\/b><br><b>Action:<\/b> Choose an adjacent enemy fighter. They suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Eyes of the Nine expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "----------Zarbag's Gitz expansion": "Zarbag's Gitz expansion",
    "N88": {
        "code": "N88",
        "name": "Call that a Win",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are five or more surviving friendly fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N89": {
        "code": "N89",
        "name": "Dank Haven",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are no enemy fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Enemy Displacement",
                "Knockback"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N90": {
        "code": "N90",
        "name": "Flash Finale",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action by a spell cast by your warband.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N91": {
        "code": "N91",
        "name": "Infestation",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if you hold <i>every objective<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N92": {
        "code": "N92",
        "name": "Mad Scurry",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if at least five of your surviving fighters made a Move action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N93": {
        "code": "N93",
        "name": "Malicious Kill",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if your warband takes an enemy fighter with two or more upgrades out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N94": {
        "code": "N94",
        "name": "Obliterated",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if a friendly Snirk Sourtongue is Inspired and takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N95": {
        "code": "N95",
        "name": "Scragged",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action while adjacent to three or more friendly fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N96": {
        "code": "N96",
        "name": "Vicious Killers",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if two or more friendly fighters made successful Attack actions that targeted the same fighter, and that fighter was taken out of action, in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N97": {
        "code": "N97",
        "name": "Curse of da Bad Moon",
        "faction": "Zarbag's Gitz",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span><img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose a hex within four hexes of the caster. Any fighter in that hex or any hex adjacent to it suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N98": {
        "code": "N98",
        "name": "Fungal Blessing",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Attack action that takes an adjacent friendly fighter out of action. Their attacker suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N99": {
        "code": "N99",
        "name": "Jealous Hex",
        "faction": "Zarbag's Gitz",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose a fighter that has the highest Wounds characteristic on the battlefield. That fighter has -1 Wounds (to a minimum of 1). This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N100": {
        "code": "N100",
        "name": "Little Waaagh!",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice to the first Attack action made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N101": {
        "code": "N101",
        "name": "Madcap Mushroom",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> <img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>)<\/b> for the next spell your warband attempts to cast. The fighter casting the spell suffers 1 damage if there are any <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in that casting roll, rather than two or more <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N102": {
        "code": "N102",
        "name": "Make Some Noise",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose up to two friendly Squigs and push each of them up to two hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N103": {
        "code": "N103",
        "name": "'Orrible Leer",
        "faction": "Zarbag's Gitz",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, push each enemy fighter adjacent to the caster up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N104": {
        "code": "N104",
        "name": "Sneaky Stabbin'",
        "faction": "Zarbag's Gitz",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, +1 Dice and Cleave to the first Attack action with a Range of 1 or 2 made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N105": {
        "code": "N105",
        "name": "Sneaky Step",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N106": {
        "code": "N106",
        "name": "Stab 'em in the Knee",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "If the first Attack action in the next activation has a Range of 1 or 2, it has +1 Damage for each supporting fighter after the first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N107": {
        "code": "N107",
        "name": "Endless Whirl",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Action: Each adjacent fighter suffers 1 damage. Use this action only if this fighter is Inspired.<div><\/div>",
        "restrictedTo": "Snirk Sourtongue",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Push",
                "Place",
                [
                    "Move",
                    "Free Action"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N108": {
        "code": "N108",
        "name": "Extra Bouncy",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Move or Charge action they can move through other fighters, but their move must end in an empty hex.<div><\/div>",
        "restrictedTo": "Gobbaluk (Squig), Bonekrakka (Squig)",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Mobility"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N109": {
        "code": "N109",
        "name": "Fiery Brand",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "On a critical hit, this fighter's Attack actions with a Range of 1 have +1 Damage.<div><\/div>",
        "restrictedTo": "Drizgit da Squig Herder",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N110": {
        "code": "N110",
        "name": "Grizzled Survivor",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Drizgit da Squig Herder",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N111": {
        "code": "N111",
        "name": "Lurker",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After a fighter is pushed a number of hexes, if that fighter was adjacent to this fighter before the push, push this fighter up to the same number of hexes. This fighter must end the push adjacent to the other fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [
                "Push",
                "Enemy Displacement"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N112": {
        "code": "N112",
        "name": "Nasty Stabba",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> This Attack action has +2 Dice if a friendly Prog is supporting this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N113": {
        "code": "N113",
        "name": "Ravenous",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Attack actions with a Range of 1.<div><\/div>",
        "restrictedTo": "Gobbaluk (Squig), Bonekrakka (Squig)",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N114": {
        "code": "N114",
        "name": "Sniffer Spite",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is in enemy territory in the third end phase, gain 1 glory point.<div><\/div>",
        "restrictedTo": "Zarbag",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N115": {
        "code": "N115",
        "name": "Vindictive Glare",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> On a critical hit, this Attack action has +1 Damage.<div><\/div>",
        "restrictedTo": "Zarbag",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Spell"
            ]
        }
    },
    "N116": {
        "code": "N116",
        "name": "Volley Caller",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter makes the Grot Bow Attack action, an adjacent friendly fighter makes their Grot Bow Attack action.<div><\/div>",
        "restrictedTo": "Stikkit, Dibbz, Redkap",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N296": {
        "code": "N296",
        "name": "Arcane Torrent",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter successfully casts a spell and there are two or more <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the casting roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N303": {
        "code": "N303",
        "name": "Catching Up",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have fewer glory points than an opponent.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N337": {
        "code": "N337",
        "name": "Interdiction",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy wizard out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N346": {
        "code": "N346",
        "name": "Magical Void",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if an opponent's warband attempted to cast at least one spell and did not successfully cast any spells in the preceding phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Anti-spell"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N350": {
        "code": "N350",
        "name": "Master of Terrain",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action by a lethal hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N354": {
        "code": "N354",
        "name": "Nowhere to Go",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if each hex adjacent to an enemy fighter is either occupied, blocked or lethal.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N368": {
        "code": "N368",
        "name": "Solid Gains",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you gained at least 3 glory points in this round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                "Glory"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N371": {
        "code": "N371",
        "name": "Sorcerous Scouring",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes an enemy fighter out of action with a spell.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [
                [
                    "Spell",
                    "Damage"
                ]
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Restricted",
                "Spellcasting"
            ]
        }
    },
    "N387": {
        "code": "N387",
        "name": "With Our Bare Hands",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if there are at least three surviving friendly fighters, and no surviving friendly fighter has an upgrade.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N388": {
        "code": "N388",
        "name": "Abasoth's Unmaking",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an objective token within four hexes of the caster. Remove it from the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Removal"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "N394": {
        "code": "N394",
        "name": "Arcane Shield",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span><img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, reduce all damage suffered by the caster by 1, to a minimum of 1. This spell persists until the caster is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N412": {
        "code": "N412",
        "name": "Encroaching Shadow",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter in an edge hex. They suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N421": {
        "code": "N421",
        "name": "Healing Pulse",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose a friendly fighter within four hexes of the caster. Remove up to one wound token from that fighter's fighter card at the beginning of each round, before the first activation. This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N424": {
        "code": "N424",
        "name": "Infinite Riches",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose one upgrade from your power discard pile and add it to your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw",
                "Upgrades"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N428": {
        "code": "N428",
        "name": "Levitation",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, the caster treats lethal hexes as normal hexes. This spell persists until the caster is out of action or the end of the phase, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N432": {
        "code": "N432",
        "name": "Mirror Move",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an opponent pushes a fighter. Choose a different fighter and push them the same number of hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N434": {
        "code": "N434",
        "name": "One Step Ahead",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "You can only play this card in the final power step of a round. Choose an opponent and name an objective, then roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that opponent cannot score that objective in the subsequent end phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N436": {
        "code": "N436",
        "name": "Pit Trap",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that drives an enemy fighter back. They suffer 1 damage.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Restricted"
            ]
        }
    },
    "N457": {
        "code": "N457",
        "name": "Sphere of Shyish",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within three hexes of the caster. Wound tokens cannot be removed from that fighter's card. This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N484": {
        "code": "N484",
        "name": "Chained Spite",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Scatter 3 from this fighter's hex. Choose one fighter standing in a hex in the chain. They suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N499": {
        "code": "N499",
        "name": "Faneway Crystal",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Move action, they do not move normally. Instead, place them on any objective token, then discard this card. It is still considered to be a Move action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [
                "Objective Positioning"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N501": {
        "code": "N501",
        "name": "Fighter's Ferocity",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If you score a critical hit when making an Attack action with this fighter, that Attack action has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N511": {
        "code": "N511",
        "name": "Low Cunning",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Fighters supported by this fighter have +1 Damage on their Attack actions with a Range or 1 or 2.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N514": {
        "code": "N514",
        "name": "Mutating Maul",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> When a fighter makes this Attack action, choose Cleave or Knockback 1. This Attack action has that rule in this activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Knockback",
                "Cleave"
            ]
        }
    },
    "N516": {
        "code": "N516",
        "name": "Nullstone Axe",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> You can re-roll one dice in the attack roll if the target is a wizard<br><p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> After a fighter makes this Attack action, discard this upgrade. You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N524": {
        "code": "N524",
        "name": "Parrying Blade",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Reaction:<\/b> During an Attack action that targets this fighter and fails, this fighter cannot be pushed back and you make this Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N529": {
        "code": "N529",
        "name": "Potion of Rage",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During this fighter's Attack action, before any dice are rolled, discard this card. The Attack action has +2 Dice until the action is resolved.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N541": {
        "code": "N541",
        "name": "Spiteful Charm",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Attack action that damages this fighter, discard this card. Choose one of the enemy fighter's upgrades. That card is discarded.<div><\/div>",
        "restrictedTo": "-",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N548": {
        "code": "N548",
        "name": "Tome of Incantations",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Katophrane Tome<\/b><br>Each time this fighter attempts to cast a spell, after the casting roll, you can change one of the symbols rolled to <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Zarbag's Gitz expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "----------Garrek's Reavers expansion": "Garrek's Reavers expansion",
    "N117": {
        "code": "N117",
        "name": "A Worthy Skull",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N118": {
        "code": "N118",
        "name": "Blood for the Blood God!",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if three or more of your fighters made a Charge action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N119": {
        "code": "N119",
        "name": "Coward!",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter begins a Move action adjacent to one of your fighters and ends it adjacent to none of your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N120": {
        "code": "N120",
        "name": "Draw the Gaze of Khorne",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes two or more enemy fighters out of action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N121": {
        "code": "N121",
        "name": "It Begins",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least one fighter from each warband is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N122": {
        "code": "N122",
        "name": "Khorne Cares Not",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if five or more fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N123": {
        "code": "N123",
        "name": "Khorne's Champion",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Third",
        "glory": "6",
        "text": "Score this in the third end phase if all fighters except one of your fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N124": {
        "code": "N124",
        "name": "Let the Blood Flow",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if three or more of your fighters made a successful Attack action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N125": {
        "code": "N125",
        "name": "There is Only Slaughter",
        "faction": "Garrek's Reavers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if no fighter is holding an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                "Objective Removal",
                "Objective Flip",
                "Enemy Displacement"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N126": {
        "code": "N126",
        "name": "Blood Offering",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter. They suffer 1 damage. Roll two extra attack dice for their first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N127": {
        "code": "N127",
        "name": "Blood Rain",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "All Attack actions in the next activation have the <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> characteristic, even if they would normally have the <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> characteristic.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N128": {
        "code": "N128",
        "name": "Boon of Khorne",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that takes an enemy fighter out of action. Remove all wound tokens from one friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N129": {
        "code": "N129",
        "name": "Desecrate",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Remove one objective that you hold from the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Removal"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "N130": {
        "code": "N130",
        "name": "Final Blow",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Attack action that takes an adjacent friendly fighter out of action. Their attacker suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N131": {
        "code": "N131",
        "name": "Fuelled by Slaughter",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a fighter out of action. A friendly fighter can make an Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N132": {
        "code": "N132",
        "name": "Insensate",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter who suffers any amount of damage in the next activation only suffers one damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N133": {
        "code": "N133",
        "name": "Khorne Calls",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll one extra attack dice for your first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N134": {
        "code": "N134",
        "name": "Rebirth in Blood",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes your last surviving fighter out of action. Roll a defence dice. If you roll a <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> remove all wound tokens from them, and place them on a starting hex in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N135": {
        "code": "N135",
        "name": "Skulls for the Skull Throne!",
        "faction": "Garrek's Reavers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that takes an enemy fighter out of action. Draw up to two power cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N136": {
        "code": "N136",
        "name": "Berserk Charge",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Both <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> and <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> symbols are successes when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "Blooded Saek",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N137": {
        "code": "N137",
        "name": "Bloodslick",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Garrek Gorebeard",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N138": {
        "code": "N138",
        "name": "Deadly Spin",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> Targets adjacent enemy fighters - roll for each.<div><\/div>",
        "restrictedTo": "Targor",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scything"
            ]
        }
    },
    "N139": {
        "code": "N139",
        "name": "Ever-Advancing",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> When this fighter could be driven back during an Attack action (whether or not your opponent chooses to do so), you can instead push them one hex.<div><\/div>",
        "restrictedTo": "Garrek Gorebeard",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N140": {
        "code": "N140",
        "name": "Frenzy",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an extra attack dice when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N141": {
        "code": "N141",
        "name": "Grisly Trophy",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter takes an enemy fighter out of action, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "Garrek Gorebeard",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N142": {
        "code": "N142",
        "name": "Terrifying Howl",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Push each adjacent enemy fighter one hex.<div><\/div>",
        "restrictedTo": "Karsus the Chained",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N143": {
        "code": "N143",
        "name": "Unstoppable Charge",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Charge action they can move through other fighters, but their move must end in an empty hex.<div><\/div>",
        "restrictedTo": "Blooded Saek",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Mobility"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N144": {
        "code": "N144",
        "name": "Whirlwind of Death",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to all Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "Karsus the Chained",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N145": {
        "code": "N145",
        "name": "Wicked Blade",
        "faction": "Garrek's Reavers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If you roll at least one <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> this Attack action has Cleave.<div><\/div>",
        "restrictedTo": "Arnulf",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N293": {
        "code": "N293",
        "name": "All or Nothing",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "5",
        "text": "Score this in the third end phase if you have scored no objective cards this game. If you do, you cannot score any other objective cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Glory"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N295": {
        "code": "N295",
        "name": "Arcane Implosion",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action while attempting to cast a spell.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N307": {
        "code": "N307",
        "name": "Cornered",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter out of action with an Attack action that is only successful because their target is Trapped.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N308": {
        "code": "N308",
        "name": "Dashed Hopes",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took at least one Inspired enemy fighter out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N324": {
        "code": "N324",
        "name": "Girded for Battle",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters (at least three) have at least one upgrade.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N325": {
        "code": "N325",
        "name": "Grand Melee",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least three enemy fighters were damaged in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Damage",
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N347": {
        "code": "N347",
        "name": "Martyred",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if the first fighter taken out of action in this round is a friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [
                "Self-damage"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N351": {
        "code": "N351",
        "name": "Neck and Neck",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you and an opponent are tied for the same number of glory points (at least 1).<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N352": {
        "code": "N352",
        "name": "No Heroes",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are at least three surviving friendly fighters, and none of them are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N357": {
        "code": "N357",
        "name": "Opening Gambit",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you scored at least one objective card in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N382": {
        "code": "N382",
        "name": "Trash to Treasure",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an opponent discards three objective cards in an end phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N400": {
        "code": "N400",
        "name": "Centre of Attention",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i> Choose a fighter and push all other fighters that are within 2 hexes 1 hex so that they are closer to that fighter in an order you choose.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N405": {
        "code": "N405",
        "name": "Damning Pact",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly wizard. They suffer 1 damage. The first time they attempt to cast a spell before the next power step, any fighter damaged by that spell suffers 1 additional damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N406": {
        "code": "N406",
        "name": "Dancing with Death",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that targets a friendly fighter and fails. You can push the target up to two hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N417": {
        "code": "N417",
        "name": "Ghoulish Pact",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and an upgrade card from your hand that you can apply to that fighter. That fighter suffers 1 damage. If they survive, apply the upgrade to that fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N425": {
        "code": "N425",
        "name": "Instinctive Denial",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when an enemy fighter adjacent to a friendly fighter casts a spell, before the spell is resolved. Roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that spell is not cast.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Anti-spell"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N443": {
        "code": "N443",
        "name": "Revoke",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose one persisting ploy. That ploy is discarded.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N458": {
        "code": "N458",
        "name": "Sphere of Ulgu",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, Attack actions in the next activation have -1 Dice, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N459": {
        "code": "N459",
        "name": "Spiked Surface",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during a friendly fighter's Attack action in which the target fighter is trapped and is in an edge hex and\/or adjacent to a blocked hex. The target fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N463": {
        "code": "N463",
        "name": "Sudden Paranoia",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Enemy fighters cannot provide support during the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N483": {
        "code": "N483",
        "name": "Butcher's Eye",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If there are any <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in an attack roll for this fighter's Attack action, resolve that Attack action as if it had Cleave.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N490": {
        "code": "N490",
        "name": "Dirty Fighting",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's Attack action that targets an adjacent enemy fighter and fails, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that enemy fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N495": {
        "code": "N495",
        "name": "Enchanted Greaves",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter treats lethal hexes as normal hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N503": {
        "code": "N503",
        "name": "Gloryseeker",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Attack actions that target a fighter with a Wounds characteristic of 4 or more.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N522": {
        "code": "N522",
        "name": "Nullstone Sword",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N527": {
        "code": "N527",
        "name": "Potion of Constitution",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action or gambit that will damage this fighter, discard this card. Reduce the damage suffered by 1, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N539": {
        "code": "N539",
        "name": "Slumbering Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is not out of action in the third end phase, gain 1 glory point.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "N544": {
        "code": "N544",
        "name": "Swordbreaker",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> On a critical hit, you can choose one of the target fighter's upgrades that confers an Attack action. That card is discarded.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Accuracy",
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N552": {
        "code": "N552",
        "name": "Tome of Warfare",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Katophrane Tome<\/b><br><b>Action:<\/b> Choose this fighter or an adjacent friendly fighter. Their next Attack action has +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "N553": {
        "code": "N553",
        "name": "Touch of Death",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 1  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<\/p> Place a Charge token next to any fighter damaged by this Attack action.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Garrek's Reavers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "----------Steelheart's Champions expansion": "Steelheart's Champions expansion",
    "N146": {
        "code": "N146",
        "name": "Awe-Inspiring",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband has taken two or more fighters out of action in this phase. <i>(Able to be scored if you draw this card after the condition was met)<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N147": {
        "code": "N147",
        "name": "Cleanse",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if you hold all objectives <i>in enemy territory<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N148": {
        "code": "N148",
        "name": "Consecrated Area",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if  there are no enemy fighters adjacent to your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Enemy Displacement"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N149": {
        "code": "N149",
        "name": "Eternals",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if none of your fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N150": {
        "code": "N150",
        "name": "Immovable Object",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if  the same friendly fighter has held the same objective at the end of two consecutive action phases.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Survivability"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N151": {
        "code": "N151",
        "name": "Lightning Strikes",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action by a Charge action made by one of your fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N152": {
        "code": "N152",
        "name": "Seize Ground",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if  you hold an objective in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N153": {
        "code": "N153",
        "name": "Sigmar's Bulwark",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if none of your fighters suffered any damage in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Defence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N154": {
        "code": "N154",
        "name": "Slayers of Tyrants",
        "faction": "Steelheart's Champions",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N155": {
        "code": "N155",
        "name": "Heroic Guard",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and put them on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N156": {
        "code": "N156",
        "name": "Peal of Thunder",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose any enemy fighter and push them one hex in any direction.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N157": {
        "code": "N157",
        "name": "Righteous Zeal",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Attack action with a Range of 1 or 2 in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N158": {
        "code": "N158",
        "name": "Sigmarite Wall",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two adjacent friendly fighters and put them on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N159": {
        "code": "N159",
        "name": "Stormforged Resistance",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Friendly fighters cannot be driven back by the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N160": {
        "code": "N160",
        "name": "Stormforged Tactics",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "In the next activation, you can make the following Reaction.<br><b>Reaction:<\/b> After an enemy fighter's Attack action that fails, choose up to two friendly fighters and push them up to one hex each.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N161": {
        "code": "N161",
        "name": "Tireless Assault",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that fails. That fighter can make another Attack action that targets the same fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N162": {
        "code": "N162",
        "name": "Undaunted",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action or ploy that takes a friendly fighter out of action leaving one surviving friendly fighter on the battlefield. Remove all wound tokens from the surviving fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N163": {
        "code": "N163",
        "name": "Unstoppable Strike",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action in the next activation gains Cleave.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N164": {
        "code": "N164",
        "name": "Valiant Attack",
        "faction": "Steelheart's Champions",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Enemy fighters cannot support the target of the first Attack action in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N165": {
        "code": "N165",
        "name": "Blessed by Sigmar",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N166": {
        "code": "N166",
        "name": "Block",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> This fighter and all adjacent friendly fighters go on Guard.<div><\/div>",
        "restrictedTo": "Angharad Brightshield",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N167": {
        "code": "N167",
        "name": "Brave Strike",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Roll an extra attack dice if there are no adjacent friendly fighters.<div><\/div>",
        "restrictedTo": "Obryn the Bold",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N168": {
        "code": "N168",
        "name": "Fatal Riposte",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action that targets this fighter and fails, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> this fighter cannot be driven back and they can make an Attack action. It must target the attacker.<div><\/div>",
        "restrictedTo": "Severin Steelheart",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N169": {
        "code": "N169",
        "name": "Heroic Might",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack action gains Cleave.<div><\/div>",
        "restrictedTo": "Severin Steelheart, Obryn the Bold",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N170": {
        "code": "N170",
        "name": "Heroic Stride",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter ends their activation within two hexes of this fighter, you can push this fighter one hex.<div><\/div>",
        "restrictedTo": "Severin Steelheart",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N171": {
        "code": "N171",
        "name": "Lightning Blade",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> On a critical hit, this Attack action has +1 Damage.<div><\/div>",
        "restrictedTo": "Severin Steelheart",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N172": {
        "code": "N172",
        "name": "Lightning Blast",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When they make a critical hit, this fighter also inflicts 1 damage on enemy fighters adjacent to the target's hex.<div><\/div>",
        "restrictedTo": "Obryn the Bold",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N173": {
        "code": "N173",
        "name": "Righteous Strike",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> <b>Reaction:<\/b> After this Attack action, if it failed and the target was an enemy leader, make this Attack action again.<div><\/div>",
        "restrictedTo": "Angharad Brightshield",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N174": {
        "code": "N174",
        "name": "Shield Bash",
        "faction": "Steelheart's Champions",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an adjacent fighter's Attack action that targets this fighter and fails, this fighter cannot be driven back and you can push their attacker one hex.<div><\/div>",
        "restrictedTo": "Angharad Brightshield",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N300": {
        "code": "N300",
        "name": "Brute Force",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter's Attack action succeeds against an enemy fighter who has two or more supporting fighters more than the friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N305": {
        "code": "N305",
        "name": "Combination Strike",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you scored at least two objective cards in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N321": {
        "code": "N321",
        "name": "Ganging Up",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if all hexes adjacent to a single enemy fighter (other than blocked or incomplete hexes) contain friendly fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N327": {
        "code": "N327",
        "name": "Hale and Whole",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if no friendly fighters are out of action and no friendly fighters have wound tokens on their fighter cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N353": {
        "code": "N353",
        "name": "No Openings",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your opponent scored no objectives in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N364": {
        "code": "N364",
        "name": "Quick on Your Feet",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters (at least three) made a Move action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N367": {
        "code": "N367",
        "name": "Singled Out",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if a surviving friendly fighter has three or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N373": {
        "code": "N373",
        "name": "Strong Start",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if the first fighter taken out of action in this round is an enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N375": {
        "code": "N375",
        "name": "Swift Beheading",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<i>(Errata update)<\/i> Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase, and that leader was the first fighter taken out of action in this game.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N381": {
        "code": "N381",
        "name": "Total Dominance",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "6",
        "text": "Score this in the third end phase if there are no surviving enemy fighters and no friendly fighters out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N386": {
        "code": "N386",
        "name": "Witch-Slayer",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your leader takes an enemy wizard out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N397": {
        "code": "N397",
        "name": "Baffling Illusion",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first time a fighter would make a Move action in the next activation, their player instead Scatters X from the hex that fighter occupies, and pushes the fighter along the chain to the end hex. X is the fighter's Move characteristic. If the fighter cannot be pushed into a hex, the push ends in the last hex in the chain they can occupy. Place a Move token next to that fighter.<div><span class=\"badge badge-danger\"><i title=\"Forsaken\" class=\"fas fa-ban\"><\/i> Forsaken <i title=\"Relic\" class=\"fas fa-book\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N410": {
        "code": "N410",
        "name": "Emboldened",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that targets a friendly fighter and fails. Remove up to one wound token from that fighter's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N420": {
        "code": "N420",
        "name": "Haymaker",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Dice for the first Attack action made by a friendly fighter in the next activation. You cannot make defence rolls for that fighter. The latter effect persists until that fighter is out of action or the end of the round, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N427": {
        "code": "N427",
        "name": "Lethal Ward",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an objective token. Any fighter in the same hex as that token suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Objective Positioning"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": ["Anti-Objective"]
        }
    },
    "N438": {
        "code": "N438",
        "name": "Quick Exchange",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two adjacent friendly fighters who each have at least one upgrade that could be applied to the other fighter. Take an upgrade from each fighter and apply it to the other fighter. Each fighter must be eligible for that upgrade.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N441": {
        "code": "N441",
        "name": "Regal Vision",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter that is holding an objective. That fighter becomes Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Inspiration"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N442": {
        "code": "N442",
        "name": "Rend the Earth",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, all fighters adjacent to the caster suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N456": {
        "code": "N456",
        "name": "Sphere of Hysh",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, Attack actions in the next activation have +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N468": {
        "code": "N468",
        "name": "Unchecked Energy",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a lethal hex. Roll an attack dice for each fighter in or adjacent to that hex. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the fighter being rolled for suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N470": {
        "code": "N470",
        "name": "Vertigo",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an action or gambit that uses the scatter token, after the scatter token is placed but before any dice are rolled. Choose how the scatter token is oriented.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Scatter"
            ]
        }
    },
    "N486": {
        "code": "N486",
        "name": "Champion's Fortitude ",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can re-roll one defence dice each time you make a defence roll for this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N487": {
        "code": "N487",
        "name": "Circlet of Companionship",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter is adjacent to two or more friendly fighters, this fighter has +1 Defence.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N488": {
        "code": "N488",
        "name": "Cloak of Shadows",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "While this fighter is adjacent to no fighters, this fighter has +1 Defence.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N508": {
        "code": "N508",
        "name": "Horrifying Armour",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-1 Wound (to a minimum of 1). Adjacent enemy fighters' Attack actions have -1 Dice, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N513": {
        "code": "N513",
        "name": "Mirror of Spite",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an enemy fighter's Attack action that takes this fighter out of action, before removing them from the battlefield, all adjacent enemy fighters suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N518": {
        "code": "N518",
        "name": "Nullstone Darts",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N528": {
        "code": "N528",
        "name": "Potion of Grace",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After a Move token is placed next to this fighter, discard this card. Remove that token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N531": {
        "code": "N531",
        "name": "Ready for the Fight",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Move action that is part of a Charge action, you can push this fighter up to two hexes. This push must bring them adjacent to the enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N536": {
        "code": "N536",
        "name": "Seeking Blade",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> Rolls of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> aren't successes in defence rolls for targets of this Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "N546": {
        "code": "N546",
        "name": "Tome of Glories",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Katophrane Tome<\/b><br><b>Action:<\/b> If this fighter is holding an objective, gain 1 glory point. Place a Charge token next to this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Steelheart's Champions expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "----------Godsworn Hunt expansion": "Godsworn Hunt expansion",
    "N175": {
        "code": "N175",
        "name": "A Worthy Deed",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter with a Wounds characteristic of 4 or more out of action with an Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N176": {
        "code": "N176",
        "name": "Dark Rewards",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters (at least three) are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Inspiration"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N177": {
        "code": "N177",
        "name": "Glory or Damnation",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if a surviving friendly fighter has three or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N178": {
        "code": "N178",
        "name": "Magical Apotheosis",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter successfully casts a spell that requires two or more successes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N179": {
        "code": "N179",
        "name": "Oath of Annihilation",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "You may reveal this card at the start of your first activation in the action phase, then return it to your hand. Score this in an end phase if <i>all enemy fighters<\/i> are out of action. If you revealed this card, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N180": {
        "code": "N180",
        "name": "Oath of Conquest",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "You may reveal this card at the start of your first activation in the action phase, then return it to your hand. Score this in the third end phase if all surviving friendly fighters are in enemy territory. If you revealed this card, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N181": {
        "code": "N181",
        "name": "Oath of Denial",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "You may reveal this card at the start of your first activation in the action phase, then return it to your hand. Score this in the third end phase if there are no enemy fighters in your territory. If you revealed this card, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Enemy Displacement",
                "Offence",
                "Knockback"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N182": {
        "code": "N182",
        "name": "Oath of Murder",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "You may reveal this card at the start of your first activation in the action phase, then return it to your hand. Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase. If you revealed this card, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N183": {
        "code": "N183",
        "name": "Oath of Supremacy",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "You may reveal this card at the start of your first activation in the action phase, then return it to your hand. Score this in an end phase if you hold three or more objectives. If you revealed this card, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N184": {
        "code": "N184",
        "name": "Brutal Sacrifice",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter adjacent to another friendly fighter, and an upgrade in your hand that can be applied to the fighter you chose. The other fighter is taken out of action, and the upgrade is applied to the fighter you chose.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N185": {
        "code": "N185",
        "name": "Dark Destiny",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an Attack action that would take a friendly fighter out of action. Roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the fighter takes no damage, is not driven back and is not taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N186": {
        "code": "N186",
        "name": "Enfeeble",
        "faction": "Godsworn Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within four hexes of the caster. That fighter's Attack actions have -1 Damage (to a minimum of 1). This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N187": {
        "code": "N187",
        "name": "Ensnare",
        "faction": "Godsworn Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within four hexes of the caster. That fighter has -1 Move (to a minimum of 0). This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N188": {
        "code": "N188",
        "name": "Fearless Strike",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during a friendly fighter's Attack action, before the attack roll, if that fighter has no supporting fighters. Any rolls of <img src=\"img\/single-support.png\" alt=\"Single Support\"><span class=\"sr-only\">Single support<\/span> in the attack roll are successes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N189": {
        "code": "N189",
        "name": "Glimpse the Future",
        "faction": "Godsworn Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose a friendly fighter within four hexes of the caster. When they next make an Attack action, you can re-roll one dice in the attack roll. This spell persists until that Attack action is made or that fighter is out of action, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N190": {
        "code": "N190",
        "name": "Heel",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Push a friendly Grawl up to a number of hexes equal to twice its Move characteristic. It must end this push in a hex adjacent to a friendly Ollo.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N191": {
        "code": "N191",
        "name": "Hunting Pack",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during a friendly fighter's Attack action, before the attack roll, if that fighter has two or more supporting fighters. Any rolls of <img src=\"img\/double-support.png\" alt=\"Double Support\"><span class=\"sr-only\">Double support<\/span> in the attack roll are considered to be rolls of <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N192": {
        "code": "N192",
        "name": "Oathsworn Attack",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action made by a friendly fighter in the next activation has +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N193": {
        "code": "N193",
        "name": "Warding Eye",
        "faction": "Godsworn Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose a friendly fighter within four hexes of the caster. They have +1 Defence. This spell persists until the end of the phase or that fighter is out of action, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N194": {
        "code": "N194",
        "name": "Chaos Boon",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-1 Wounds (to a minimum of 1). This fighter's Attack actions with a Range of 1 or 2 have +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N195": {
        "code": "N195",
        "name": "Enchanted Collar",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Grawl",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N196": {
        "code": "N196",
        "name": "Ensorcelled Javelin",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Cleave<\/p> This Attack action has +1 Damage when made during this fighter's Charge action.<div><\/div>",
        "restrictedTo": "Jagathra",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N197": {
        "code": "N197",
        "name": "Grundann's Path",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes a Charge action, rolls of both <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> and <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> are successes in their attack roll.<div><\/div>",
        "restrictedTo": "Grundann Blood-Eye",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N198": {
        "code": "N198",
        "name": "Path to Glory",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds, +1 Dice to this fighter's Attack actions. You may only apply this upgrade to a fighter that has an upgrade.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N199": {
        "code": "N199",
        "name": "Point-blank Shot",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Reaction:<\/b> After an enemy fighter's Move action that ends adjacent to this fighter, make this Attack action. It must target that fighter and cannot drive them back.<div><\/div>",
        "restrictedTo": "Ollo",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N200": {
        "code": "N200",
        "name": "Seized Trophy",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After a friendly fighter's Attack action that takes an adjacent enemy fighter out of action, if this card is in your hand, apply this upgrade to that friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N201": {
        "code": "N201",
        "name": "Shond's Path",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "On a critical hit, this fighter's Attack actions with a Range of 1 or 2 have +1 Damage.<div><\/div>",
        "restrictedTo": "Shond Head-Claimer",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N202": {
        "code": "N202",
        "name": "Theddra's Path",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>)<\/b><div><\/div>",
        "restrictedTo": "Theddra Skull-scryer",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N203": {
        "code": "N203",
        "name": "Trained Killer",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During a friendly Ollo's Attack action, before the attack roll, push this fighter up to two hexes. It must end this push adjacent to the target of the Attack action.<div><\/div>",
        "restrictedTo": "Grawl",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N292": {
        "code": "N292",
        "name": "Aggressive Commander",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if you took the first activation in each round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N311": {
        "code": "N311",
        "name": "Devastation",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if <i>three or more<\/i> enemy fighters were taken out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N329": {
        "code": "N329",
        "name": "Hoarder",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if you have at least 9 unspent glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N336": {
        "code": "N336",
        "name": "Indomitable Defender",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if a single surviving friendly fighter was the target of at least three Attack actions in the preceding action phase and was not taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N343": {
        "code": "N343",
        "name": "Longstrider",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a friendly fighter makes their second or subsequent Move action in a single action phase.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Potion of Grace"
            ],
            "rating": 2,
            "factionRatingOverride": {
                "Mollog's Mob": 5,
                "Spiteclaw's Swarm": 4,
                "Sepulchral Guard": 4,
                "The Grymwatch": 4
            },
            "tags": [
                "Restricted"
            ]
        }
    },
    "N344": {
        "code": "N344",
        "name": "Magical Mastery",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if your warband successfully cast six or more spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N358": {
        "code": "N358",
        "name": "Our Powers Combined",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if all of the successes (at least two) in your attack or defence roll were support symbols.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N360": {
        "code": "N360",
        "name": "Peerless Fighter",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if there are two or more <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in your attack roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N365": {
        "code": "N365",
        "name": "Scorched Earth",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband removes an objective from the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Objective Removal"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N366": {
        "code": "N366",
        "name": "Seize the Initiative",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if you have three or more <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> when rolling to determine who takes the first activation in a round and win that roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N379": {
        "code": "N379",
        "name": "Thin Their Ranks",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three or more enemy fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N393": {
        "code": "N393",
        "name": "Arcane Recall",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>):<\/b> If this spell is cast choose one gambit spell from your power discard pile and add it to your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N396": {
        "code": "N396",
        "name": "Arcane Transposition",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, switch the positions of two adjacent fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N407": {
        "code": "N407",
        "name": "Death Frenzy",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an enemy warband's gambit or enemy fighter's Attack action that takes a friendly fighter out of action. For each fighter adjacent to that fighter, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> the fighter being rolled for suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N408": {
        "code": "N408",
        "name": "Death Grip",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter. Enemy fighters adjacent to that fighter can't be pushed until the next power step.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N414": {
        "code": "N414",
        "name": "Ephemeral Form",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first fighter to be the target of an Attack action in the next activation has a Defence characteristic (before other modifiers) of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> 2, instead of their usual characteristic.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N423": {
        "code": "N423",
        "name": "Incredible Leap",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first fighter to make a Move action in the next activation can pass through blocked and occupied hexes, and treats lethal hexes as normal hexes. They must end this move in an empty hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N440": {
        "code": "N440",
        "name": "Razormaw Swarm",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>):<\/b> If this spell is cast, Scatter 3 from the caster's hex. Any fighter in any hex in the chain suffers 2 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N454": {
        "code": "N454",
        "name": "Sphere of Ghur",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, the first Attack action made by a fighter standing within four hexes of the caster has +1 Dice. This spell persists until such an Attack action is made or the caster is out of action, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N460": {
        "code": "N460",
        "name": "Spirit Sacrifice",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly wizard. They suffer 1 damage. The first time that fighter attempts to cast a spell, roll an extra dice in the casting roll. This effect persists until that fighter attempts to cast a spell or is out of action, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N469": {
        "code": "N469",
        "name": "Unfocused Blast",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, do the following. Scatter 1 from the caster's hex: any fighter in the end hex suffers 1 damage. Do this two more times, scattering from the caster's hex each time.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N474": {
        "code": "N474",
        "name": "Arcane Focus",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> This fighter's next casting roll in this phase has <b>Innate (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>)<\/b>.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N475": {
        "code": "N475",
        "name": "Arcane Savant",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wizard level. Apply this upgrade only to a level 1 wizard.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N476": {
        "code": "N476",
        "name": "Archer's Focus",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can re-roll one dice in the attack roll each time this fighter makes an Attack action with a Range of 3 or more.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": {
                "The Farstriders": 5,
                "Stormsire's Cursebreakers": 3,
                "The Eyes of the Nine": 3,
                "Zarbag's Gitz": 5,
                "Godsworn Hunt": 3,
                "Thundrik's Profiteers": 5,
                "Ylthari's Guardians": 3,
                "Grashrak's Despoilers": 3,
                "Skaeth's Wild Hunt": 3
            },
            "tags": []
        }
    },
    "N479": {
        "code": "N479",
        "name": "Blessing of Argentine",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an adjacent enemy's Attack action that damages this fighter, their attacker suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N491": {
        "code": "N491",
        "name": "Distracting Blow",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> <b>Reaction:<\/b> When an adjacent enemy fighter attempts to cast a spell, but before the casting roll, make this Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Anti-spell"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N492": {
        "code": "N492",
        "name": "Disturbing Presence",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Enemy fighters adjacent to this fighter cannot make Charge actions.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N521": {
        "code": "N521",
        "name": "Nullstone Spear",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N532": {
        "code": "N532",
        "name": "Regenerative Charm",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Remove up to one wound token from this fighter's fighter card at the beginning of each round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N542": {
        "code": "N542",
        "name": "Strong-arm",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Push an adjacent enemy fighter up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N550": {
        "code": "N550",
        "name": "Tome of Offerings",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Katophrane Tome<\/b><br>If this fighter takes an enemy fighter out of action, gain 1 additional glory point.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Godsworn Hunt expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Tome",
                "Restricted"
            ]
        }
    },
    "----------Mollog's Mob expansion": "Mollog's Mob expansion",
    "N204": {
        "code": "N204",
        "name": "Carnage",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband took three or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N205": {
        "code": "N205",
        "name": "Demolished",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter out of action with an Attack action with a Damage characteristic of 5 or more.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                "Damage"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N206": {
        "code": "N206",
        "name": "Earn Your Keep",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if an enemy fighter is taken out of action by an Attack action made by a friendly fighter other than Mollog.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N207": {
        "code": "N207",
        "name": "Easy Pickings",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if two or more enemy fighters are taken out of action by a single Attack action made by a friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                "Damage"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N208": {
        "code": "N208",
        "name": "Feeding Frenzy",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if each surviving friendly fighter (at least three) is adjacent to any enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N209": {
        "code": "N209",
        "name": "Got Them",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately at the beginning of your activation if there are three or more enemy fighters adjacent to a friendly Mollog.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N210": {
        "code": "N210",
        "name": "Is It Asleep",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if a friendly Mollog took no actions in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N211": {
        "code": "N211",
        "name": "Protect the Lair",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are no enemy fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Enemy Displacement",
                "Knockback"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N212": {
        "code": "N212",
        "name": "Rampage",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if your warband took four or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N213": {
        "code": "N213",
        "name": "Brutal Savagery",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action made by a friendly fighter in the next activation has +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N214": {
        "code": "N214",
        "name": "Feast",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Attack action that takes an adjacent enemy fighter out of action. Remove up to one wound token from the friendly fighter's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N215": {
        "code": "N215",
        "name": "Flit",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Push a friendly Bat Squig up to three hexes. This push can take them through occupied hexes but must end in an empty hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N216": {
        "code": "N216",
        "name": "Follow Your Instincts",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Discard an objective card, then draw an objective card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N217": {
        "code": "N217",
        "name": "Hobble",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter adjacent to a friendly Stalagsquig and roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> place a Move token next to that enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N218": {
        "code": "N218",
        "name": "Predatory Growls",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter and push them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N219": {
        "code": "N219",
        "name": "Shrouded in Gloom",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Attack actions with a Range of 3 or more in the next activation have a Dice characteristic (before other modifiers) of <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N220": {
        "code": "N220",
        "name": "Sporeburst",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter adjacent to a friendly Spiteshroom and roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the enemy fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N221": {
        "code": "N221",
        "name": "There the Whole Time",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> return a friendly Stalagsquig that has been taken out of action to any empty hex on the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N222": {
        "code": "N222",
        "name": "Wind Up",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Attack action with a Range of 1 or 2 made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N223": {
        "code": "N223",
        "name": "Blooming Spores",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "Mollog the Mighty",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N224": {
        "code": "N224",
        "name": "Foul Temper",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can re-roll one dice in each attack roll for this fighter's Attack actions.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N225": {
        "code": "N225",
        "name": "Horrific Stench",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Enemy fighters adjacent to this fighter are considered to have one fewer supporting fighters (to a minimum of zero).<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N226": {
        "code": "N226",
        "name": "Inescapable Jaws",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Both <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> and <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> symbols are successes in the attack roll when this fighter makes a Charge action.<div><\/div>",
        "restrictedTo": "Bat Squig",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N227": {
        "code": "N227",
        "name": "Jabbertoad",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Knockback 1<\/p> Discard this card after making this Attack action.<div><\/div>",
        "restrictedTo": "Mollog the Mighty",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "N228": {
        "code": "N228",
        "name": "Regenerate",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "At the beginning of each round, remove up to one wound token from this fighter's fighter card.<div><\/div>",
        "restrictedTo": "Mollog the Mighty",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N229": {
        "code": "N229",
        "name": "Rooted to the Spot",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter can hold objectives, even though its fighter card says it cannot.<div><\/div>",
        "restrictedTo": "Stalagsquig",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Removal"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "N230": {
        "code": "N230",
        "name": "Spore Cloud",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Scatter 2 from this fighter's hex. Any enemy fighters in any hex in the chain suffer 1 damage.<div><\/div>",
        "restrictedTo": "Spiteshroom",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N231": {
        "code": "N231",
        "name": "Unswattable",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an Attack action that targets this fighter and fails, push this fighter up to one hex.<div><\/div>",
        "restrictedTo": "Bat Squig",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N232": {
        "code": "N232",
        "name": "Wrath of Living Rock",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions with a Range of 1 have Cleave.<div><\/div>",
        "restrictedTo": "Stalagsquig",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N312": {
        "code": "N312",
        "name": "Didn't Even Want It",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if an enemy fighter is holding objective 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N313": {
        "code": "N313",
        "name": "Digging Deep",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you drew at least four power and\/or objective cards in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Card Draw"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N314": {
        "code": "N314",
        "name": "Disdain for Knowledge",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this card immediately if your warband takes an enemy fighter out of action, and that fighter has at least one <b>Katophrane Tome<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "N315": {
        "code": "N315",
        "name": "Envious Acquisition",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you hold an objective held by an enemy fighter at the beginning of the round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N320": {
        "code": "N320",
        "name": "Frugal",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have at least 3 unspent glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N322": {
        "code": "N322",
        "name": "Get Thee Hence",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter's Attack action drives an enemy fighter back two or more hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Knockback"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N323": {
        "code": "N323",
        "name": "Giant-slayer",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if your warband takes a fighter with a Wounds characteristic of 5 or more out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N328": {
        "code": "N328",
        "name": "Heroic Effort",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you activated the same fighter four times in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N338": {
        "code": "N338",
        "name": "Keep Chopping",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband made an Attack action in four or more activations in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N348": {
        "code": "N348",
        "name": "Massive Overkill",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter out of action with an Attack action that deals an amount of damage that is at least twice the target's Wounds characteristic.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N363": {
        "code": "N363",
        "name": "Press the Advantage",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have more glory points than an opponent.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N401": {
        "code": "N401",
        "name": "Commanding Stride",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Push your leader up to three hexes. They must end this push on a starting hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N415": {
        "code": "N415",
        "name": "Fearful Visage",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a fighter. The first fighter to make an Attack action while adjacent to that fighter in the next activation has -1 Dice to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N418": {
        "code": "N418",
        "name": "Grievous Riposte",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action with a Range of 1 that targets a friendly fighter and fails, if there are any <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in your defence roll. The attacker suffers 2 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N439": {
        "code": "N439",
        "name": "Quintok's Gamble",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>):<\/b> If this spell is cast, shuffle your power discard pile face down, then add the top card to your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N444": {
        "code": "N444",
        "name": "Shadowed Step",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter with no Move or Charge tokens and place them on an empty hex in no one's territory. Place a Move token next to them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N449": {
        "code": "N449",
        "name": "Sorcerous Riposte",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>) Reaction:<\/b> Play this after an Attack action that targets a friendly wizard and fails. If this spell is cast, the attacker suffers 2 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N453": {
        "code": "N453",
        "name": "Sphere of Chamon",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose a fighter within three hexes of the caster. That fighter has a Defence characteristic (before other modifiers) of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> 1. This spell persists until the next power step or that fighter is out of action, whichever happens first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence",
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N464": {
        "code": "N464",
        "name": "Taunting Challenge",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Move action that is part of a Charge action. Choose a friendly fighter adjacent to that fighter. If the enemy fighter does not target that fighter with their subsequent Attack action, the enemy fighter is no longer Inspired and cannot be Inspired. The latter effect persists until the enemy fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N467": {
        "code": "N467",
        "name": "Transfixing Stare",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter within two hexes of a friendly fighter and place a Move token next to them.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "N472": {
        "code": "N472",
        "name": "Whip into a Frenzy",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter. They suffer 1 damage. Their first Attack action with a Range of 1 or 2 in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N477": {
        "code": "N477",
        "name": "Bag of Tricks",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Search your power deck for a card, reveal it and add it to your hand. Then shuffle your power deck and place a Charge token next to this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N482": {
        "code": "N482",
        "name": "Blessing of Vytrix",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>)<\/b><div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N485": {
        "code": "N485",
        "name": "Challenge Seeker",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes an Attack action that targets a fighter with a higher Wounds characteristic than itself, that Attack action has +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": {
                "Steelheart's Champions": 1,
                "Ironskull's Boyz": 1,
                "The Chosen Axes": 2,
                "Magore's Fiends": 1,
                "The Farstriders": 1,
                "Stormsire's Cursebreakers": 1,
                "Mollog's Mob": 2,
                "Ylthari's Guardians": 3,
                "Ironsoul's Condemners": 1,
                "Lady Harrow's Mournflight": 3
            },
            "tags": []
        }
    },
    "N496": {
        "code": "N496",
        "name": "Envoy's Prerogative",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Draw an objective card, then discard an objective card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Trash"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N510": {
        "code": "N510",
        "name": "Loathe Stone",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Players roll 1 fewer dice in the casting roll (to a minimum of 1) for fighter that attempt to cast a spell within two hexes of this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Anti-spell"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N517": {
        "code": "N517",
        "name": "Nullstone Dagger",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If there are any <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the attack roll, this Attack action has Cleave. You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N525": {
        "code": "N525",
        "name": "Possessed Weapon",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "After each Attack action with a Range of 1 or 2 this fighter makes, they suffer 1 damage. Their Attack actions with a Range of 1 or 2 have +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Self-damage"
            ]
        }
    },
    "N551": {
        "code": "N551",
        "name": "Tome of Vitality",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Katophrane Tome<\/b><br>+1 Wounds.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Tome",
                "Restricted"
            ]
        }
    },
    "N554": {
        "code": "N554",
        "name": "Unstoppable Force",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Attack actions with a Range of 1 or 2 gain Knockback 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Offence"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "N556": {
        "code": "N556",
        "name": "Warding Scroll",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's spell is cast, but before it is resolved, if this fighter is on the battlefield, discard this card. The spell is not cast.<div><\/div>",
        "restrictedTo": "-",
        "box": "Mollog's Mob expansion",
        "metadata": {
            "categories": [
                "Other",
                "Anti-spell"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "----------Thundrik's Profiteers expansion": "Thundrik's Profiteers expansion",
    "N233": {
        "code": "N233",
        "name": "Collect Bounty",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband took an enemy leader out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N234": {
        "code": "N234",
        "name": "Focus Fire",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if the third different friendly fighter makes an Attack action with a Range of 3 or more targeting the same fighter in this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N235": {
        "code": "N235",
        "name": "Headshot",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter scores a critical hit with an Attack action with a Range of 3 or more.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N236": {
        "code": "N236",
        "name": "It's Ours Now",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if two or more friendly fighters are in no one's territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N237": {
        "code": "N237",
        "name": "Live by the Code",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you did not discard any objective cards in the preceding action phase. If you do, you cannot discard any objective cards in this end phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N238": {
        "code": "N238",
        "name": "Search the City",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N239": {
        "code": "N239",
        "name": "Seeking Advancement",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband takes an enemy fighter with a Wounds characteristic of 4 or more out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N240": {
        "code": "N240",
        "name": "Sound Finances",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you have 5 or more unspent glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Glory"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N241": {
        "code": "N241",
        "name": "Stake a Claim",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all friendly fighters are in your territory and no enemy fighters are in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Enemy Displacement",
                "Knockback",
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N242": {
        "code": "N242",
        "name": "Aetheric Augmentation",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action made by a friendly fighter in the next activation has +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N243": {
        "code": "N243",
        "name": "Ambitious Attack",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Attack action with a Range of 1 or 2 made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N244": {
        "code": "N244",
        "name": "Atmospheric Isolation",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Play this only if there is a surviving friendly Thundrik. No more power cards can be played until after the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N245": {
        "code": "N245",
        "name": "Prepared Position",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter that does not have a Guard token. Place a Guard token next to them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N246": {
        "code": "N246",
        "name": "Protect the Boss",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and push them up to two hexes so that they are adjacent to your leader.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N247": {
        "code": "N247",
        "name": "Quiet Contemplation",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose one: draw a power card, or discard an objective card then draw an objective card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N248": {
        "code": "N248",
        "name": "Seek the Skyvessel",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose up to two friendly fighters and make a Move action with each of them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "N249": {
        "code": "N249",
        "name": "Timed Charge",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After a friendly Drakkskewer's Move action that begins adjacent to any enemy fighters, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> those enemy fighters each suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N250": {
        "code": "N250",
        "name": "Toxic Gases",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter. That fighter's player must make a choice: either that fighter suffers 1 damage or you push that fighter up to two hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N251": {
        "code": "N251",
        "name": "Unyielding",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Friendly fighters cannot be driven back in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N252": {
        "code": "N252",
        "name": "Ancestral Fortitude",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N253": {
        "code": "N253",
        "name": "Ancestral Might",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N254": {
        "code": "N254",
        "name": "Augmented Buoyancy",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "Khazgan Drakkskewer",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N255": {
        "code": "N255",
        "name": "Breath of Grungni",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Knockback 1<\/p>.<div><\/div>",
        "restrictedTo": "Bjorgen Thundrik",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "N256": {
        "code": "N256",
        "name": "Empowered Aethershot",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "The Attack actions on this fighter's fighter card with a Range of 3 or more have Cleave.<div><\/div>",
        "restrictedTo": "Garodd Alensen, Enrik Ironhail",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N257": {
        "code": "N257",
        "name": "Magmalt Draught",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action or gambit that will damage this fighter, discard this card. Reduce the damage suffered by 1, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N258": {
        "code": "N258",
        "name": "Paymaster",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can re-roll one dice in each Attack roll made for friendly fighters adjacent to this fighter.<div><\/div>",
        "restrictedTo": "Bjorgen Thundrik",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N259": {
        "code": "N259",
        "name": "Punishing Retort",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Reaction:<\/b> During an adjacent enemy fighter's Attack action that targets this fighter and fails, this fighter cannot be driven back and makes this Attack action. It must target the attacker.<div><\/div>",
        "restrictedTo": "Dead-Eye Lund",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N260": {
        "code": "N260",
        "name": "Rapid Reload",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's first Aethermatic Volley Gun Attack action in a round, they can make that Attack action again.<div><\/div>",
        "restrictedTo": "Enrik Ironhail",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "N261": {
        "code": "N261",
        "name": "Swashbuckler",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice to this fighter's Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "Garodd Alensen",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N297": {
        "code": "N297",
        "name": "Biding Your Time",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have at least one fighter on the battlefield and your warband took no Attack actions in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N299": {
        "code": "N299",
        "name": "Branching Fate",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if you roll three or more dice in an attack or defence roll and they all show a different symbol.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N301": {
        "code": "N301",
        "name": "Building Momentum",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have scored at least 2 other objective cards in this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N302": {
        "code": "N302",
        "name": "Calculated Risk",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter makes a Move action through a lethal hex that damages them but doesn't take them out of action.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": {
                "Thorns of The Briar Queen": 0,
                "Lady Harrow's Mournflight": 0
            },
            "tags": [
                "Restricted",
                "Lethal"
            ]
        }
    },
    "N309": {
        "code": "N309",
        "name": "Death from Afar",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter out of action while at least three hexes from that fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Range",
                "Accuracy",
                [
                    "Spell",
                    "Damage"
                ]
            ],
            "rating": 1,
            "factionRatingOverride": {
                "The Farstriders": 5,
                "Stormsire's Cursebreakers": 5,
                "The Eyes of the Nine": 4,
                "Zarbag's Gitz": 4,
                "Godsworn Hunt": 3,
                "Thundrik's Profiteers": 5,
                "Ylthari's Guardians": 4,
                "Grashrak's Despoilers": 3,
                "Skaeth's Wild Hunt": 3
            },
            "tags": []
        }
    },
    "N316": {
        "code": "N316",
        "name": "Every Trick in the Book",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have no power cards in your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N349": {
        "code": "N349",
        "name": "Master of Mayhem",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if you use your warband's third action or card that Scatters in the same phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Scatter"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N359": {
        "code": "N359",
        "name": "Patient Commander",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if you took the second activation in each round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N377": {
        "code": "N377",
        "name": "Tactical Supremacy 2-5",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold objectives 2 and 5.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N380": {
        "code": "N380",
        "name": "Tireless Slayer",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if a single friendly fighter took three or more enemy fighters out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N384": {
        "code": "N384",
        "name": "Versatile Fighter",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if the same friendly fighter made both an Attack action with a Range of 1 or 2 and an Attack action with a Range of 3 or more in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N390": {
        "code": "N390",
        "name": "Aetherflux",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Until the next power step, spells that would require <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> instead require <img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> and vice versa.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N392": {
        "code": "N392",
        "name": "Amnesiac Backlash",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>:<\/b> Cast this spell after an enemy fighter casts a spell. If this spell is cast, that fighter suffers 1 damage and they can no longer cast spells. This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N398": {
        "code": "N398",
        "name": "Black-powder Sphere",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a hex (other than a blocked hex) within three hexes of a friendly fighter, and Scatter 1 from that hex. Then roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, any fighter in or adjacent to the end hex suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N411": {
        "code": "N411",
        "name": "Empathic Exchange",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose a friendly fighter adjacent to the caster. Take up to 2 wound tokens from that fighter's fighter card and put them on the caster's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing",
                "Other",
                "Trash"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N431": {
        "code": "N431",
        "name": "Magical Dearth",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Until the end of the power step, only rolls of <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> are successes when a fighter attempts to cast a spell.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N435": {
        "code": "N435",
        "name": "Piling On",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action with a Range of 1 or 2 in the next activation has +1 Damage for each supporting fighter after the first.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N445": {
        "code": "N445",
        "name": "Shifting Reflection",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter and an enemy fighter that are both holding an objective. Switch those fighters' positions.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Place"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N451": {
        "code": "N451",
        "name": "Sphere of Aqshy",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within four hexes of the caster. That fighter suffers 1 damage.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "N461": {
        "code": "N461",
        "name": "Stand and Shoot",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Move action that is part of a Charge action. Choose a friendly fighter that is adjacent to them, and make an Attack action with that fighter that has a Range of 3 or more. It must target the enemy fighter, and that fighter cannot be driven back by this Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Range"
            ],
            "rating": 1,
            "factionRatingOverride": {
                "The Farstriders": 5,
                "Stormsire's Cursebreakers": 3,
                "The Eyes of the Nine": 3,
                "Zarbag's Gitz": 3,
                "Godsworn Hunt": 3,
                "Thundrik's Profiteers": 5,
                "Ylthari's Guardians": 3,
                "Grashrak's Despoilers": 3,
                "Skaeth's Wild Hunt": 3
            },
            "tags": [
                "Reaction"
            ]
        }
    },
    "N466": {
        "code": "N466",
        "name": "Trading Up",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter with at least one upgrade. Discard one upgrade from that fighter, and apply another upgrade to that fighter from your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N480": {
        "code": "N480",
        "name": "Blessing of Hydragos",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's Attack action that succeeds, push this fighter up to two hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N489": {
        "code": "N489",
        "name": "Crown of Avarice",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i> <b>Reaction:<\/b> During an opponent's gambit or during an enemy fighter's Attack action that will take this fighter out of action, after the deal damage step, pick one opponent and take up to one of their unspent glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N494": {
        "code": "N494",
        "name": "Earthing Stone",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is standing on an objective token in a player's territory, no fighters in that territory are considered to be holding objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Anti-Objective"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N507": {
        "code": "N507",
        "name": "Hammer of Scorn",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<br>Knockback 2<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "N509": {
        "code": "N509",
        "name": "Hunter's Tenacity",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter makes an Attack action against an adjacent enemy fighter that drives them back, push this fighter into the hex the other was in.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N520": {
        "code": "N520",
        "name": "Nullstone Mace",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> You can re-roll up to two dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N523": {
        "code": "N523",
        "name": "Paradox Armour",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When the target of an Attack action, this fighter counts rolls of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> and <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> as successes, but does not count rolls or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> as successes or critical successes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Trash"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N533": {
        "code": "N533",
        "name": "Reinforced Armour",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter takes no damage from Attack actions with a Damage characteristic (before modifiers) of 1, unless those result in a critical hit.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N547": {
        "code": "N547",
        "name": "Tome of Healing",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i><br><b>Katophrane Tome<\/b><br><b>Action:<\/b> Choose this fighter or an adjacent friendly fighter. Remove up to one wound token from that fighter's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "N555": {
        "code": "N555",
        "name": "Voidsceptre",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> Choose a persisting effect or spell that is affecting a fighter within two hexes of this fighter. That effect or spell ends.<div><\/div>",
        "restrictedTo": "-",
        "box": "Thundrik's Profiteers expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "----------Ylthari's Guardians expansion": "Ylthari's Guardians expansion",
    "N262": {
        "code": "N262",
        "name": "Domain Denied",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if no enemy fighters are holding objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Enemy Displacement",
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N263": {
        "code": "N263",
        "name": "Glade's Last Hope",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if at least 3 wound tokens were removed from the fighter cards of friendly fighters in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Healing"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N264": {
        "code": "N264",
        "name": "Glade's Pride",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if no friendly fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N265": {
        "code": "N265",
        "name": "Lithe Spirits",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband makes its second or subsequent reaction in this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Reaction"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N266": {
        "code": "N266",
        "name": "Reclaim the Lamentiri",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you hold all the objectives in at least one player's territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N267": {
        "code": "N267",
        "name": "Show No Mercy",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if 3 or more enemy fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N268": {
        "code": "N268",
        "name": "Song of Hatred",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if your warband successfully casts their second or subsequent spell in this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N269": {
        "code": "N269",
        "name": "Strike Swiftly",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy fighter out of action with a Charge action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N270": {
        "code": "N270",
        "name": "Vengeful Revenants",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if at least one friendly fighter is out of action, and at least twice as many enemy fighters as friendly fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N271": {
        "code": "N271",
        "name": "Curse of the Dwindling",
        "faction": "Ylthari's Guardians",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within five hexes of the caster. That fighter's Attack actions have -1 Dice (to a minimum of 1). This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N272": {
        "code": "N272",
        "name": "Healing Amphora",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly Gallanghann or a friendly fighter adjacent to a friendly Gallanghann and roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> remove up to two wound tokens from that fighter's fighter card. Otherwise remove up to one wound token from that fighter's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N273": {
        "code": "N273",
        "name": "Last Guardians",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose a friendly fighter that does not have a Guard token. Place a Guard token next to them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N274": {
        "code": "N274",
        "name": "Leech Power",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Play this only if a friendly Ylthari is holding an objective. Remove that objective from the battlefield and remove up to one wound token from that Ylthari's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing",
                "Other",
                "Objective Removal"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "N275": {
        "code": "N275",
        "name": "Mesmerising Gaze",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter adjacent to a friendly fighter and choose one: remove the enemy fighter's Guard tokens, or place a Move token next to the enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N276": {
        "code": "N276",
        "name": "Pangs of the Great Lack",
        "faction": "Ylthari's Guardians",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose an enemy fighter within five hexes of the caster. That fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N277": {
        "code": "N277",
        "name": "Revenant Rage",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action in the next activation has +1 Dice.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N278": {
        "code": "N278",
        "name": "Springseed Step",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Move action. Choose another friendly fighter and push them up to three hexes. They must end this push adjacent to the fighter that moved.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N279": {
        "code": "N279",
        "name": "Strength of the Burgeoning",
        "faction": "Ylthari's Guardians",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, the first Attack action with a Range of 1 or 2 in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N280": {
        "code": "N280",
        "name": "Writhing Roots",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first fighter to make a Move action in the next activation has -2 Move (to a minimum of 0).<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N281": {
        "code": "N281",
        "name": "Cage of Thorns",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> If this Attack action succeeds, place a Move token next to the target.<div><\/div>",
        "restrictedTo": "Ylthari",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Spell"
            ]
        }
    },
    "N282": {
        "code": "N282",
        "name": "Constant Growth",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N283": {
        "code": "N283",
        "name": "Enraged Spite",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "N284": {
        "code": "N284",
        "name": "Inescapable Grasp",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Rolls of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> are not successes in the defence rolls of enemy fighters targeted by this fighter's Attack actions with a Range of 1 or 2.<div><\/div>",
        "restrictedTo": "Ylthari",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "N285": {
        "code": "N285",
        "name": "Menacing Step",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Move action that ends adjacent to at least one other friendly fighter, push this fighter up to two hexes. The push must end with this fighter adjacent to the enemy fighter.<div><\/div>",
        "restrictedTo": "Skhathael",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N286": {
        "code": "N286",
        "name": "Pinning Shot",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is considered to be a supporting fighter for adjacent friendly fighters.<div><\/div>",
        "restrictedTo": "Ahnslaine, Revenant Archer",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N287": {
        "code": "N287",
        "name": "Spiteful Thorns",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Attack action with a Range of 1 that targets this fighter and succeeds, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the attacker suffers 1 damage.<div><\/div>",
        "restrictedTo": "Ylthari",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N288": {
        "code": "N288",
        "name": "Unflinching Guardian",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an enemy fighter's Attack action that targets a friendly fighter supported by this fighter, after the defence roll but before the Attack action succeeds or fails, you can re-roll one defence dice.<div><\/div>",
        "restrictedTo": "Gallanghann of the Glade",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N289": {
        "code": "N289",
        "name": "Vengeful Blow",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> This Attack action has +1 Dice and +1 Damage for each friendly fighter that is out of action.<div><\/div>",
        "restrictedTo": "Skhathael",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N290": {
        "code": "N290",
        "name": "Warding Stance",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Defence.<div><\/div>",
        "restrictedTo": "Gallanghann of the Glade",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N298": {
        "code": "N298",
        "name": "Bloodless Skirmish",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are no fighters out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N335": {
        "code": "N335",
        "name": "Hold What We Have",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you have at least one fighter on the battlefield and your warband made no Move actions in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Range",
                "Push"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N339": {
        "code": "N339",
        "name": "Keep Moving",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband made a Move action in four or more activations in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N341": {
        "code": "N341",
        "name": "Lethal Repertoire",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if a friendly fighter made an Attack action in the preceding action phase printed on an upgrade that you played in the same phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Weapon"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N345": {
        "code": "N345",
        "name": "Magical Storm",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband successfully cast four or more spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N356": {
        "code": "N356",
        "name": "One Fate",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately if you roll three or more dice in an attack or defence roll and they all show the same symbol.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Accuracy",
                "Defence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N361": {
        "code": "N361",
        "name": "Preserve Life",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you removed at least one wound token from each of at least two surviving friendly fighters in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Healing"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N362": {
        "code": "N362",
        "name": "Preserve Their Knowledge",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if all surviving friendly fighters (at least three) have at least one Katophrane Tome.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Tome"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "N369": {
        "code": "N369",
        "name": "Sorcerous Duel",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter takes an enemy wizard out of action with a spell.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Spell"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N372": {
        "code": "N372",
        "name": "Stand Firm",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if all surviving friendly fighters (at least three) have one or more Guard tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Guard"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "N383": {
        "code": "N383",
        "name": "United",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters (at least two) are in a single group with each fighter adjacent to at least one other friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N399": {
        "code": "N399",
        "name": "Bolt of Inspiration",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, Scatter 1 from any hex on the battlefield. Any fighter in the end hex is Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other",
                "Inspiration"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "N413": {
        "code": "N413",
        "name": "Entropic Curse",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose an enemy fighter within four hexes of the caster. That fighter suffers 1 damage at the beginning of each round, before the first activation. This spell persists until that fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N416": {
        "code": "N416",
        "name": "Flexible Strategy",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Discard an objective card and draw an objective card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N429": {
        "code": "N429",
        "name": "Lifesurge",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Remove one wound token from all fighter cards that have at least one wound token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N430": {
        "code": "N430",
        "name": "Magical Damping",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> Cast this spell during an attempt to cast a spell, after the dice are rolled but before the spell is resolved or fails (and before the defence roll, if it is a spell Attack action). If this spell is cast, any damage caused by the other spell is reduced by 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N433": {
        "code": "N433",
        "name": "Noble Sacrifice",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an Attack action that targets your leader, before any dice are rolled. Choose a friendly fighter adjacent to your leader, and roll a defence dice. On a roll of <img src=\"img\/single-support.png\" alt=\"Single Support\"><span class=\"sr-only\">Single support<\/span>, <img src=\"img\/double-support.png\" alt=\"Double Support\"><span class=\"sr-only\">Double support<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, switch the positions of the fighter you chose and your leader. The fighter you chose is now the target of the Attack action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N447": {
        "code": "N447",
        "name": "Silence",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter. They cannot attempt to cast spells for the remainder of the power step.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N455": {
        "code": "N455",
        "name": "Sphere of Ghyran",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose the caster or a friendly fighter adjacent to the caster. Remove 1 wound token from that fighter's fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N462": {
        "code": "N462",
        "name": "Strategic Sorcery",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span><img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, choose one objective card from your objective discard pile and add it to your hand, then discard an objective card if you have more than three in your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N465": {
        "code": "N465",
        "name": "Terrifying Visage",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If this spell is cast, enemy fighters adjacent to the caster have -1 Dice, to a minimum of 1, when they make Attack actions. This spell persists until the caster is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N481": {
        "code": "N481",
        "name": "Blessing of Ignax",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> This fighter's next Attack action with a Range of 1 or 2 in this round has +2 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N493": {
        "code": "N493",
        "name": "Duellist's Speed",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's Attack action, push them up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N498": {
        "code": "N498",
        "name": "Fading Form",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter treats lethal hexes as normal hexes and can move through blocked and occupied hexes, but cannot end their move in a blocked or occupied hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Mobility"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "N500": {
        "code": "N500",
        "name": "Fated Blade",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> -<\/p> Roll five attack dice each time this Attack action succeeds. Its Damage characteristic is equal to the number of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> and <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> rolled.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N515": {
        "code": "N515",
        "name": "Nullstone Arrows",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 4  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> You can re-roll one dice in the attack roll if the target is a wizard.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "N530": {
        "code": "N530",
        "name": "Quick Learner",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Attack action or another warband's gambit that damages this fighter but does not take them out of action, draw a power card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N535": {
        "code": "N535",
        "name": "Scroll of Recall",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's gambit spell is resolved, discard this card and roll a magic dice. On a roll of <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>, place the gambit spell on top of your power deck instead of on your power discard pile.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "N540": {
        "code": "N540",
        "name": "Spinning Defence",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an Attack action that targets this fighter and fails, this fighter cannot be pushed. Scatter 2 from this fighter's hex and push this fighter along the chain to the end hex. If the fighter cannot be pushed into a hex, the push ends in the last hex in the chain they can occupy.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scatter",
                "Reaction"
            ]
        }
    },
    "N549": {
        "code": "N549",
        "name": "Tome of Insight",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i><br><b>Katophrane Tome<\/b><br><b>Action:<\/b> Choose an opponent. They must reveal the power cards in their hand to you.<div><\/div>",
        "restrictedTo": "-",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Tome"
            ]
        }
    },
    "N557": {
        "code": "N557",
        "name": "Well of Power",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "While this fighter is Inspired, you can roll an extra dice when they attempt to cast a spell.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "Wizard",
        "box": "Ylthari's Guardians expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Spellcasting",
                "Restricted"
            ]
        }
    },
    "----------Power Unbound": "Power Unbound",
    "P1": {
        "code": "P1",
        "name": "Focal Formation",
        "faction": "Stormsire's Cursebreakers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly Rastus and a friendly Ammis are both holding objectives after an activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility",
                "Survivability"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P2": {
        "code": "P2",
        "name": "Storm's Fury",
        "faction": "Stormsire's Cursebreakers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first friendly fighter's Attack action in the next activation has +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P3": {
        "code": "P3",
        "name": "Hand of Sigmar",
        "faction": "Stormsire's Cursebreakers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Innate (<img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span>)<\/b><div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P4": {
        "code": "P4",
        "name": "Deathly Clutches",
        "faction": "Thorns of the Briar Queen",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when two or more friendly fighters become Inspired at the start of your activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P5": {
        "code": "P5",
        "name": "Freezing Fear",
        "faction": "Thorns of the Briar Queen",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose an enemy fighter adjacent to your leader. Place a Move token next to the enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P6": {
        "code": "P6",
        "name": "Haunting Obsession",
        "faction": "Thorns of the Briar Queen",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter cannot be pushed while they are adjacent to any enemy fighters. If a push takes this fighter adjacent to any enemy fighters, the push ends in that hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P7": {
        "code": "P7",
        "name": "Architect of Fate",
        "faction": "The Eyes of the Nine",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if a friendly fighter is the target of an enemy Attack action with a Dice characteristic of 3 or more that fails.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Defence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P8": {
        "code": "P8",
        "name": "Forewarned",
        "faction": "The Eyes of the Nine",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an Attack action that targets a friendly fighter, before the attack roll. You can re-roll any number of dice in that fighter's defence roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P9": {
        "code": "P9",
        "name": "Mark of Favour",
        "faction": "The Eyes of the Nine",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Roll a defence dice each time this fighter suffers any amount of damage. On a roll of <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> this fighter does not suffer that damage.<div><\/div>",
        "restrictedTo": "Turosh, Narvia",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P10": {
        "code": "P10",
        "name": "Petty Vindication",
        "faction": "Zarbag's Gitz",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you scored two or more other objective cards in this round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P11": {
        "code": "P11",
        "name": "Leaping Loon",
        "faction": "Zarbag's Gitz",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Your leader has +2 Defence in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P12": {
        "code": "P12",
        "name": "Really Pointy Stick",
        "faction": "Zarbag's Gitz",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "P13": {
        "code": "P13",
        "name": "Worthy Kill",
        "faction": "Godsworn Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately when a friendly fighter makes an Attack action that takes an enemy fighter with a Wounds characteristic of 4 or more out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P14": {
        "code": "P14",
        "name": "Dark Portent",
        "faction": "Godsworn Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an Attack action that targets a friendly fighter, before the attack roll. Rolls of <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the attack roll are not successes or critical successes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P15": {
        "code": "P15",
        "name": "Writhing Charm",
        "faction": "Godsworn Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When exactly 1 damage would be caused to this fighter, this fighter does not duffer that damage. When this happens, roll a defence dice. On anything but a <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> discard this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P16": {
        "code": "P16",
        "name": "Territorial",
        "faction": "Mollog's Mob",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if no enemy fighters are in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Offence",
                "Enemy Displacement"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P17": {
        "code": "P17",
        "name": "Horrible Grin",
        "faction": "Mollog's Mob",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's Attack action with a Range of 1 that targets a friendly Mollog but does not take that Mollog out of action. The enemy fighter is no longer Inspired, and cannot be Inspired. This effect persists.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P18": {
        "code": "P18",
        "name": "Spark of Sentience",
        "faction": "Mollog's Mob",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's activation, draw a power card.<div><\/div>",
        "restrictedTo": "Bat Squig, Spiteshroom, Stalagsquig",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P19": {
        "code": "P19",
        "name": "Steady Aim",
        "faction": "Thundrik's Profiteers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a friendly fighter's attack roll includes only successes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P20": {
        "code": "P20",
        "name": "Duardin Resilience",
        "faction": "Thundrik's Profiteers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first time a friendly fighter suffers any amount of damage in the next activation, they only suffer 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P21": {
        "code": "P21",
        "name": "Disciplined Retreat",
        "faction": "Thundrik's Profiteers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's Attack action, push them up to two hexes.<div><\/div>",
        "restrictedTo": "Dead-Eye Lund",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P22": {
        "code": "P22",
        "name": "Avatar of Vengeance",
        "faction": "Ylthari's Guardians",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately if there is only one surviving friendly fighter after an activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P23": {
        "code": "P23",
        "name": "Bitter Vengeance",
        "faction": "Ylthari's Guardians",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action made by a friendly fighter in the next activation has +1 Dice for each friendly fighter that is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P24": {
        "code": "P24",
        "name": "Spitethorn Arrow",
        "faction": "Ylthari's Guardians",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 4  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> Rolls of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> are not successes against this Attack action. Discard this card after making this Attack action.<div><\/div>",
        "restrictedTo": "Ahnslaine",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "P25": {
        "code": "P25",
        "name": "Burst of Speed",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a friendly fighter makes their second or subsequent Move action in this phase.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "P26": {
        "code": "P26",
        "name": "Champions All",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a second or subsequent enemy fighter is taken out of action in this phase, and each one was taken out of action by an Attack action made by a different friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P27": {
        "code": "P27",
        "name": "Chokepoint",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if a fighter is in each hex (other than blocked hexes) in no one's territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P28": {
        "code": "P28",
        "name": "Fusillade",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband made an Attack action with a Range of 3 or more in four or more activations in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P29": {
        "code": "P29",
        "name": "Grievous Toll",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if three or more enemy fighters, and no friendly fighters, were taken out of action in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P30": {
        "code": "P30",
        "name": "Method in the Madness",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "Score this immediately when an enemy fighter is taken out of action by a spell that has Scatter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                [
                    "Spell",
                    "Scatter"
                ]
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "P31": {
        "code": "P31",
        "name": "Overpower",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a friendly fighter successfully casts a spell if there were one or more <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the casting roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Spell"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Spellcasting"
            ]
        }
    },
    "P32": {
        "code": "P32",
        "name": "Shortcut",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a friendly fighter is taken out of one hex and immediately placed in a different hex, but not as a result of a push or a Move action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Place",
                "Confusion",
                "Shadowed Step",
                "Shifting Reflection",
                "Arcane Transposition",
                "Sudden Appearance",
                "Bound by Fate",
                "Deceitful Step",
                "Nervous Scrabbling"
            ],
            "rating": 3,
            "factionRatingOverride": {
                "Grashrak's Despoilers": 5
            },
            "tags": []
        }
    },
    "P33": {
        "code": "P33",
        "name": "Spike",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately after an enemy fighter suffers damage, and they have suffered 5 or more damage in this phase (damage in excess of their Wounds characteristic counts).<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Damage"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P34": {
        "code": "P34",
        "name": "Staying Power",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are five or more surviving friendly fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P35": {
        "code": "P35",
        "name": "Strange Demise",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when an enemy fighter is taken out of action by a spell that damaged them or by a spell Attack action that damaged them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                [
                    "Spell",
                    "Damage"
                ]
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Spellcasting"
            ]
        }
    },
    "P36": {
        "code": "P36",
        "name": "Warning Shot",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "Score this immediately when a friendly fighter's Attack action with a Range of 3 or more fails.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "supportCards": [
                "Range"
            ],
            "rating": 1,
            "factionRatingOverride": {
                "The Farstriders": 5,
                "Stormsire's Cursebreakers": 3,
                "The Eyes of the Nine": 3,
                "Zarbag's Gitz": 5,
                "Godsworn Hunt": 4,
                "Thundrik's Profiteers": 5,
                "Ylthari's Guardians": 3,
                "Grashrak's Despoilers": 3,
                "Skaeth's Wild Hunt": 3,
                "Rippa's Snarlfangs": 3
            },
            "tags": [
                "Restricted"
            ]
        }
    },
    "P37": {
        "code": "P37",
        "name": "Arrow Snare",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an enemy fighter's Attack action with a Range of 3 or more that targets a friendly fighter, before the attack roll. Place a Guard token next to that friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Guard"
            ]
        }
    },
    "P38": {
        "code": "P38",
        "name": "Fizzle",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when an enemy fighter successfully casts a spell. Roll a magic dice. On a roll of <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> that spell is not cast.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P39": {
        "code": "P39",
        "name": "Fumble",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action made by an enemy fighter in the next activation has -1 Dice, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P40": {
        "code": "P40",
        "name": "Galvanised",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an Attack action that takes a friendly fighter out of action. +2 Dice to the first Attack action made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P41": {
        "code": "P41",
        "name": "Inspired Attack",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action with a Range of 1 made by an Inspired friendly fighter in the next activation has +1 Dice and +1 Damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P42": {
        "code": "P42",
        "name": "Keen Avarice",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action with a Range of 1 or 2 made by a friendly fighter in the next activation has +1 Dice and Cleave if the target is holding an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "P43": {
        "code": "P43",
        "name": "Long Shot",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Attack action with a Range or 3 or more made by a friendly fighter in the next activation has +1 Range.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P44": {
        "code": "P44",
        "name": "Seggut's Salvo",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, choose an enemy fighter within three hexes of the caster. The fighter you chose suffers 1 damage and you can push them one hex - this push must take them further away from the caster.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P45": {
        "code": "P45",
        "name": "Shadow Shape",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If this spell is cast, the caster cannot be pushed. This spell persists until the end of the round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P46": {
        "code": "P46",
        "name": "Sorcerous Flourish",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after resolving a spell cast by a friendly fighter that damaged one or more enemy fighters. Choose one of those enemy fighters. That fighter suffers 1 damage.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Restricted"
            ]
        }
    },
    "P47": {
        "code": "P47",
        "name": "Two Steps Forward",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Choose two friendly fighters and push each of them one hex. Then choose an opponent: they choose one fighter from their warband and push them up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P49": {
        "code": "P49",
        "name": "Blazing Soul",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is Inspired and cannot be un-Inspired. This upgrade cannot be applied to a fighter that cannot be Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other",
                "Inspiration"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P50": {
        "code": "P50",
        "name": "Eldritch Ward",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter suffers damage, reduce that damage by 1 to a minimum to 1.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Spellcasting"
            ]
        }
    },
    "P51": {
        "code": "P51",
        "name": "Huge Presence",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When an opponent chooses a target for an Attack action, they consider this fighter's hex to be a blocked hex, unless this fighter is chosen as the target.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P52": {
        "code": "P52",
        "name": "Leech Stone",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Wound tokens cannot be removed from the fighter cards of fighters within two hexes of this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P53": {
        "code": "P53",
        "name": "Lethal Reflexes",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Move action, if that fighter left a hex adjacent to this fighter during that Move action, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P54": {
        "code": "P54",
        "name": "Prized Vendetta",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<i>(Errata update)<\/i> When you give a fighter this upgrade, choose an enemy fighter. You can re-roll any number of dice in this fighter's attack rolls for Attack actions that target the chosen fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P55": {
        "code": "P55",
        "name": "Quickening Greaves",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "In each round, you can do one of the following: push this fighter one hex before the roll to determine who has the first activation. or push this fighter one hex after the final power step.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P56": {
        "code": "P56",
        "name": "Spectral Armour",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter's Defence characteristic is <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span>, they have +1 Defence.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "P57": {
        "code": "P57",
        "name": "Spiritbond",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When you apply this upgrade, choose a friendly fighter other than the one who receives this upgrade. While the fighter you chose is on the battlefield, they are always considered to be supporting this fighter.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Restricted"
            ]
        }
    },
    "P58": {
        "code": "P58",
        "name": "Swift as an Arrow",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an Attack action in which there were any number of <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in this fighter's attack or defence roll, push this fighter up to that number of hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P59": {
        "code": "P59",
        "name": "Unnatural Defences",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's Attack action with a Range of 1 that damages this fighter, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the attacking fighter suffers 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "P60": {
        "code": "P60",
        "name": "Wall of Force",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 0<\/p> This Attack action deals no damage when it is successful. It has Knockback X, where X is the number of successes in the attack roll.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Power Unbound",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "----------Dreadfane": "Dreadfane",
    "D1": {
        "code": "D1",
        "name": "Aetheric Mastery",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> All friendly fighters are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Inspiration"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D2": {
        "code": "D2",
        "name": "Forceful Banishment",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter is <b>driven back<\/b> by a friendly fighter's <b>Attack action<\/b> that has the <b>Knockback<\/b> ability.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "D3": {
        "code": "D3",
        "name": "Martial Prowess",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately after your warband makes a third or subsequent successful <b>Attack action<\/b> in the same phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D4": {
        "code": "D4",
        "name": "Sacrosanct Purge",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if two or more enemy fighters were taken out of action in this round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D5": {
        "code": "D5",
        "name": "Sally Forth",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there are two or more friendly fighters adjacent to each other in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D6": {
        "code": "D6",
        "name": "Stormforged Heroes",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter has one or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D7": {
        "code": "D7",
        "name": "Strength in Unity",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter has one or more Move tokens, and\/or each surviving friendly fighter has one or more Charge tokens and\/or each surviving friendly fighter has one or more Guard tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Guard",
                "Move",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "D8": {
        "code": "D8",
        "name": "Uncontested Might",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds one or more objectives in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D9": {
        "code": "D9",
        "name": "Vengeance Satisfied",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if more than half of the fighters in one or more enemy warbands are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D10": {
        "code": "D10",
        "name": "Vindicated Arrogance",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your <b>leader<\/b> was the target of our or more <b>Attack actions<\/b> in this round and is on the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D11": {
        "code": "D11",
        "name": "Wrathful Blow",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Dual:<\/b> Score this immediately<br><i>If:<\/i> A friendly fighter's <b>Attack action<\/b> takes an enemy fighter out of action<br><i>And:<\/i> That friendly fighter has one or more wound tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Wounds",
                "Self-damage",
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D12": {
        "code": "D12",
        "name": "Your Turn!",
        "faction": "Ironsoul's Condemners",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter is <b>driven back<\/b> into a hex adjacent to a friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D13": {
        "code": "D13",
        "name": "Adaptive Tactics",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Draw<\/b> up to one objective card and up to one power card, and then <b>discard<\/b> one objective card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D14": {
        "code": "D14",
        "name": "Champions of Sigmar",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation has <b>Innate<\/b> (<img src=\"img\/single-support.png\" alt=\"Single Support\"><span class=\"sr-only\">Single support<\/span>).<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D15": {
        "code": "D15",
        "name": "Fulminating Blast",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Push<\/b> an enemy fighter up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D16": {
        "code": "D16",
        "name": "Improvised Blow",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter adjacent to an enemy fighter. The chosen fighter makes the following <b>Attack action<\/b>.<br><p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "D17": {
        "code": "D17",
        "name": "Inevitable Blow",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick <b>Cleave<\/b> or <b>Ensnare<\/b>. The first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation has that ability<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Cleave",
                "Ensnare"
            ]
        }
    },
    "D18": {
        "code": "D18",
        "name": "Outflank",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter adjacent to another fighter and <b>push<\/b> them up to two hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D19": {
        "code": "D19",
        "name": "Steadfast",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter and <b>give<\/b> them a Guard token<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "D20": {
        "code": "D20",
        "name": "Thunderous Smite",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during a friendly fighter's Range 1 <b>Attack action<\/b> that will <b>succeed<\/b>, before the deal damage step. In that step, instead of dealing damage equal to the Damage characteristic of the <b>Attack action<\/b>, the target is <b>dealt<\/b> 1 damage and each enemy fighter adjacent to the target is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D21": {
        "code": "D21",
        "name": "Unyielding Resolve",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter and roll a defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>, <b>Heal<\/b> (2) that fighter, otherwise <b>Heal<\/b> (1) that fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D22": {
        "code": "D22",
        "name": "Vengeful Strike",
        "faction": "Ironsoul's Condemners",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an enemy fighter's <b>Attack action<\/b> that <b>deals<\/b> damage to an adjacent friendly fighter, before the drive back step. Roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the friendly fighter is not <b>driven back<\/b> and makes an <b>Attack action<\/b> that targets the attacker.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "D23": {
        "code": "D23",
        "name": "Aetherically Charged Shield",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one dice in each defence roll made for this fighter.<div><\/div>",
        "restrictedTo": "Gwynne Ironsoul, Tavian of Sarnassus",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D24": {
        "code": "D24",
        "name": "Aetherically Charged Weapon",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one dice in the attack roll of the first <b>Attack action<\/b> this fighter makes in each round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D25": {
        "code": "D25",
        "name": "Consecrated Pendant",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 wounds<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D26": {
        "code": "D26",
        "name": "Enchanted Robes",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move<br>This fighter treats <b>lethal<\/b> hexes as normal hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Mobility",
                "Move",
                "Survivability"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "D27": {
        "code": "D27",
        "name": "Hallowed Aura",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an <b>Attack action<\/b> that <b>deals<\/b> damage to this fighter, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> <b>Heal<\/b> (1) this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Wounds"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D28": {
        "code": "D28",
        "name": "Punishing Blow",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 4<br>Cleave<\/p> After a fighter makes this <b>Attack action<\/b>, <b>discard<\/b> this card.<div><\/div>",
        "restrictedTo": "Brodus Blightbane",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "D29": {
        "code": "D29",
        "name": "Sanctified Armour",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter is <b>dealt<\/b> damage, reduce that damage by 1, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D30": {
        "code": "D30",
        "name": "Soul-hardened Shield",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter is activated, before making an action with them, <b>give<\/b> them a Guard token.<div><\/div>",
        "restrictedTo": "Gwynne Ironsoul, Tavian of Sarnassus",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "D31": {
        "code": "D31",
        "name": "Spirit Flask",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action: Choose<\/b> one: <b>Deal<\/b> 1 damage to an adjacent enemy fighter, or <b>Heal<\/b> (2) this fighter. <b>Discard<\/b> this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D32": {
        "code": "D32",
        "name": "Stoic Stance",
        "faction": "Ironsoul's Condemners",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter cannot be <b>driven back<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D33": {
        "code": "D33",
        "name": "Bitter Embrace",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter is adjacent to one or more enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D34": {
        "code": "D34",
        "name": "Creeping Dread",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are three or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter has one or more Move and\/or Charge tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D35": {
        "code": "D35",
        "name": "Dominion of Death",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if you have scored the most objective cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D36": {
        "code": "D36",
        "name": "Fleeting Memories",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly fighter finishes a <b>Move action<\/b> and entered two or more different hexes that contained an objective during that <b>Move action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D37": {
        "code": "D37",
        "name": "Frozen in Place",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if one or more enemy fighters each have one or more Guard tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "D38": {
        "code": "D38",
        "name": "Ghostly Torment",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> Two or more surviving fighters each have one or more wound tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Wounds"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D39": {
        "code": "D39",
        "name": "Inescapable Hunger",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly fighter makes a <b>Move action<\/b> through one or more <b>blocked<\/b> hexes and ends that <b>Move action<\/b> adjacent to an enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D40": {
        "code": "D40",
        "name": "Nagash's Tithe",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there are more enemy fighters out of action than friendly fighters out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D41": {
        "code": "D41",
        "name": "Nexus of Terror",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband holds the most objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D42": {
        "code": "D42",
        "name": "One Will",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Dual:<\/b> Score this immediately<br><i>If:<\/i> Your warband holds one or more even numbered objectives<br><i>And:<\/i> Your warband holds one or more odd numbered objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Objective Positioning",
                "Objective Hold"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D43": {
        "code": "D43",
        "name": "Spectral Vortex",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter is the target of a second or subsequent successful <b>Attack action<\/b> in this phase, and each <b>Attack action<\/b> was made by a different friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D44": {
        "code": "D44",
        "name": "Tide of Malice",
        "faction": "Lady Harrow's Mournflight",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter is Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Inspiration"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D45": {
        "code": "D45",
        "name": "Call of the Grave",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> an enemy fighter and <b>push<\/b> them up to two hexes towards a friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D46": {
        "code": "D46",
        "name": "Chilling Scream",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Your opponents cannot play power cards. This <b>persists<\/b> until the end of the power step.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D47": {
        "code": "D47",
        "name": "Dissipate",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an <b>Attack action<\/b>, before the attack roll. <b>Choose<\/b> a friendly fighter. That fighter gains <b>Innate<\/b> (<img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span>). This <b>persists<\/b> until the <b>Attack action<\/b> ends or until that friendly fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D48": {
        "code": "D48",
        "name": "Echoing Spite",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's Range 1 <b>Attack action<\/b> that fails. That fighter makes that <b>Attack action<\/b> again.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D49": {
        "code": "D49",
        "name": "Enervating Sorrow",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when an opponent plays a ploy, before that ploy is resolved. That opponent can <b>discard<\/b> a power card. If they do not, the ploy is not resolved.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D50": {
        "code": "D50",
        "name": "Frightful Aspect",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Push<\/b> an enemy fighter up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D51": {
        "code": "D51",
        "name": "Shared Agony",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter with one or more wound tokens and an enemy fighter adjacent to them. <b>Heal<\/b> (1) the friendly fighter. The enemy fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Self-damage"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D52": {
        "code": "D52",
        "name": "Soaring Spite",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Double the Move characteristic of the first friendly fighter to make a <b>Move action<\/b> (not as part of a <b>Charge action<\/b>) in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D53": {
        "code": "D53",
        "name": "Spectral Charge",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D54": {
        "code": "D54",
        "name": "Spectral Grasp",
        "faction": "Lady Harrow's Mournflight",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Reduce the Move characteristic of the first fighter to be activated in the next activation by the number of friendly fighters that are out of action, to a minimum of 0.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D55": {
        "code": "D55",
        "name": "Arcane Siphon",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action: Choose<\/b> one enemy fighter within three hexes of this fighter. Pick one of that fighter's upgrades. That upgrade is <b>discarded<\/b>. Roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> <b>discard<\/b> this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D56": {
        "code": "D56",
        "name": "Debilitating Aura",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "The <b>Attack actions<\/b> of adjacent enemy fighters have -1 Dice (to a minimum of 1).<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D57": {
        "code": "D57",
        "name": "Gravesand Glass",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an <b>Attack action<\/b> or ploy that takes an enemy fighter out of action, <b>Heal<\/b> (1) this fighter.<div><\/div>",
        "restrictedTo": "Lady Harrow",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D58": {
        "code": "D58",
        "name": "Hollow Hatred",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one dice in the attack roll of the first <b>Attack action<\/b> this fighter makes in each round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D59": {
        "code": "D59",
        "name": "Maddening Hunger",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Range 1 and Range 2 <b>Attack actions<\/b> have +1 Dice if they have a Charge token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D60": {
        "code": "D60",
        "name": "Soul Harvest",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> If one or more enemy fighters are out of action, <b>Heal<\/b> (1) this fighter, and <b>give<\/b> this fighter a Guard token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing",
                "Defence"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "D61": {
        "code": "D61",
        "name": "Soul Leech",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter makes a <b>Move action<\/b>, roll an attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the first enemy fighter they moved through in that <b>Move action<\/b> is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "D62": {
        "code": "D62",
        "name": "Spirit Blade",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "While one or more enemy fighters are out of action, this fighter has the following <b>Attack action:<\/b><br><p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "D63": {
        "code": "D63",
        "name": "Swooping Dash",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "D64": {
        "code": "D64",
        "name": "Veil of Grief",
        "faction": "Lady Harrow's Mournflight",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Dreadfane",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "----------Beastgrave core set": "Beastgrave core set",
    "B1": {
        "code": "B1",
        "name": "Bestial Cunning",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when you play your third or subsequent gambit in a single round.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Card Draw"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B2": {
        "code": "B2",
        "name": "Blood Ritual",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there are two or more Ritual counters on your <b>leader's<\/b> fighter card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B3": {
        "code": "B3",
        "name": "Bloodshed",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if <i>three<\/i> or more enemy fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B4": {
        "code": "B4",
        "name": "Conquerors",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds one or more objectives in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B5": {
        "code": "B5",
        "name": "Despoilers",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if your warband holds three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B6": {
        "code": "B6",
        "name": "Killing Blow",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly fighter's <b>Attack action<\/b> that targets a fighter that has no wound tokens takes the target fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B7": {
        "code": "B7",
        "name": "Proven Superiority",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> Any enemy <b>leaders<\/b> are out of action<br><i>And:<\/i> Your <b>leader<\/b> is not out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B8": {
        "code": "B8",
        "name": "Raiders",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if three or more friendly fighters are in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B9": {
        "code": "B9",
        "name": "Stampede",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a third or subsequent friendly fighter makes a <b>Charge action<\/b> in the same phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B10": {
        "code": "B10",
        "name": "Survival of the Fittest",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are one or more surviving friendly fighters<br><i>And: Five<\/i> or more fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B11": {
        "code": "B11",
        "name": "Swarm the Battlefield",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there are one of more friendly fighters in each of the following: your territory, enemy territory, and no one's territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B12": {
        "code": "B12",
        "name": "Taint of Ruin",
        "faction": "Grashrak's Despoilers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband <b>cast<\/b> two or more spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Spell",
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B13": {
        "code": "B13",
        "name": "Baying Anger",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice to the first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B14": {
        "code": "B14",
        "name": "Baying Hatred",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B15": {
        "code": "B15",
        "name": "Berserk Bellow",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> an enemy fighter adjacent to a friendly fighter and <b>push<\/b> them up to one hex, and up to one additional hex for each wound token the friendly fighter has.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B16": {
        "code": "B16",
        "name": "Bestial Vigour",
        "faction": "Grashrak's Despoilers",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, friendly fighters have +2 Move in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B17": {
        "code": "B17",
        "name": "Blood Taunt",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter. They are <b>dealt<\/b> 1 damage. <b>Give<\/b> them a Guard token. +2 Dice to the first <b>Attack action<\/b> made by that fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Guard",
                "Self-damage"
            ]
        }
    },
    "B18": {
        "code": "B18",
        "name": "Bull Charge",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first <b>Attack action<\/b> made by a friendly fighter as part of a <b>Charge action<\/b> in the next activation has <b>Innate (<img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span>)<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B19": {
        "code": "B19",
        "name": "Devolve",
        "faction": "Grashrak's Despoilers",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span>):<\/b> If <b>cast<\/b>, <b>choose<\/b> an enemy fighter within four hexes of the caster. That fighter is <b>dealt<\/b> 1 damage. Then <b>push<\/b> that fighter up to one hex. This must take them closer to the caster.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B20": {
        "code": "B20",
        "name": "Skirmisher",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's <b>Move action<\/b> (not as part of a <b>Charge action<\/b>). That fighter can make a Range 3+ <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "B21": {
        "code": "B21",
        "name": "Vile Invaders",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> up to two friendly <b>Hunters<\/b> and <b>push<\/b> them up to two hexes each.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Hunter"
            ]
        }
    },
    "B22": {
        "code": "B22",
        "name": "Weight of Numbers",
        "faction": "Grashrak's Despoilers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to the first <b>Attack action<\/b> made by a friendly <b>Hunter<\/b> in the next activation if there are one or more friendly <b>supporting Hunters<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Hunter"
            ]
        }
    },
    "B23": {
        "code": "B23",
        "name": "Blinding Attack",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> This <b>Attack action<\/b> has +1 Damage when it targets an adjacent enemy fighter.<div><\/div>",
        "restrictedTo": "Ushkor",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B24": {
        "code": "B24",
        "name": "Bloodcrazed",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Range 1 and Range 2 <b>Attack actions<\/b> if this fighter has one or more wound tokens and\/or is adjacent to a fighter that has one or more wound tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B25": {
        "code": "B25",
        "name": "Cursed Flint",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "Hunter",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "B26": {
        "code": "B26",
        "name": "Dogged Survivor",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an <b>Attack action<\/b> that targets this fighter and fails, <b>push<\/b> this fighter up to two hexes.<div><\/div>",
        "restrictedTo": "Korsh 'the Sneak'",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B27": {
        "code": "B27",
        "name": "Endless Hatred",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's <b>Attack action<\/b> that takes an enemy fighter out of action, this fighter makes another <b>Attack action<\/b>. You can only use this reaction once per round.<div><\/div>",
        "restrictedTo": "Gnarl",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "B28": {
        "code": "B28",
        "name": "Heedless of Pain",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "Draknar, Murghoth Half-horn",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B29": {
        "code": "B29",
        "name": "Jabbing Spear",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Range to this fighter's Shortspear <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "Murghoth Half-horn, Korsh 'the Sneak'",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B30": {
        "code": "B30",
        "name": "Savage Bolt",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Knockback<\/b> 1. On a <b>critical hit<\/b> this <b>Attack action<\/b> has +1 Damage.<div><\/div>",
        "restrictedTo": "Grashrak Fellhoof",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Knockback",
                "Spell"
            ]
        }
    },
    "B31": {
        "code": "B31",
        "name": "Sorcerous Trinket",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one dice in the casting roll each time this fighter attempts to cast a spell.<div><\/div>",
        "restrictedTo": "Grashrak Fellhoof",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B32": {
        "code": "B32",
        "name": "Trophy Taker",
        "faction": "Grashrak's Despoilers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter's <b>Attack action<\/b> takes an adjacent enemy fighter out of action, gain 1 glory point.<div><\/div>",
        "restrictedTo": "Draknar",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B33": {
        "code": "B33",
        "name": "Aspects of Kurnoth",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if all surviving friendly fighters are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Inspiration"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B34": {
        "code": "B34",
        "name": "Cry of the Wild",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> A friendly Karthaen made the Hunting Horn action in the previous phase<br><i>And:<\/i> There is a surviving friendly Karthaen.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B35": {
        "code": "B35",
        "name": "Gifts of the Kurnoth",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three or more surviving friendly fighters each have one or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B36": {
        "code": "B36",
        "name": "Hunt's End",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Hybrid:<\/b> Score this in an end phase<br><i>If:<\/i> An enemy fighter with a Wounds characteristic of 4 or greater is out of action<br><i>Or:<\/i> Your warband holds three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B37": {
        "code": "B37",
        "name": "Kurnoth's Snare",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter is <b>pushed<\/b> into a <b>lethal<\/b> hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Enemy Displacement"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "B38": {
        "code": "B38",
        "name": "Purifying Rites",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband holds all objectives in one or more player's territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B39": {
        "code": "B39",
        "name": "Ritual Kill",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when your warband takes an enemy fighter standing in the same hex as an objective out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B40": {
        "code": "B40",
        "name": "Run Down",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly fighter takes an enemy fighter out of action with an <b>Attack action<\/b> made as part of a <b>Charge action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B41": {
        "code": "B41",
        "name": "Run Through",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when your <b>leader<\/b> takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B42": {
        "code": "B42",
        "name": "Safety in Swiftness",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three or more surviving friendly fighters each have one or more Move and\/or Charge tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B43": {
        "code": "B43",
        "name": "Slay the Corrupted",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if <i>three<\/i> or more enemy fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B44": {
        "code": "B44",
        "name": "Soulbinding",
        "faction": "Skaeth's Wild Hunt",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when your warband <b>casts<\/b> a spell.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Spell"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B45": {
        "code": "B45",
        "name": "Binding Wind",
        "faction": "Skaeth's Wild Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, <b>choose<\/b> an enemy fighter within four hexes of the caster. <b>Give<\/b> that fighter a Move token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other",
                "Debufff"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B46": {
        "code": "B46",
        "name": "Fleet of Foot",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter that has no Move or Charge tokens. They make a <b>Move action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "B47": {
        "code": "B47",
        "name": "Healing Breeze",
        "faction": "Skaeth's Wild Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, pick a hex within four hexes of the caster. <b>Heal<\/b> (1) any fighters in that hex and in hexes adjacent to that hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B48": {
        "code": "B48",
        "name": "Hunt in Concert",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> up to two friendly fighters and <b>push<\/b> each of them up to one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B49": {
        "code": "B49",
        "name": "Might of Kurnoth",
        "faction": "Skaeth's Wild Hunt",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, <b>choose<\/b> a friendly fighter. Their Range 1 and Range 2 <b>Attack actions<\/b> have +1 Damage. This spell <b>persists<\/b> until the end of the round or until that fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B50": {
        "code": "B50",
        "name": "Pounce",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Push<\/b> a friendly fighter up to three hexes so that they are adjacent to an enemy fighter that has one or more wound tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B51": {
        "code": "B51",
        "name": "Retrieve Javelin",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Your <b>leader<\/b> is no longer considered to have made a Javelin of the Hunt <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "Skaeth",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B52": {
        "code": "B52",
        "name": "Song of Swiftness",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Friendly fighters have +1 Move. This effect <b>persists<\/b> until the end of the round or until the friendly Karthaen is taken out of action.<div><\/div>",
        "restrictedTo": "Karthaen",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B53": {
        "code": "B53",
        "name": "Strike in Concert",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation has +1 Damage for each friendly <b>supporting<\/b> fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B54": {
        "code": "B54",
        "name": "Swift as the Wind",
        "faction": "Skaeth's Wild Hunt",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter that has one or more Move tokens. <b>Remove<\/b> one of those tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B55": {
        "code": "B55",
        "name": "Battle Cry",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action: Remove<\/b> all Guard tokens from adjacent enemy fighters. <b>Push<\/b> all adjacent enemy fighters up to one hex.<div><\/div>",
        "restrictedTo": "Hunter",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "B56": {
        "code": "B56",
        "name": "Divine Strength",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's <b>Attack actions<\/b> have <b>Knockback<\/b> 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "B57": {
        "code": "B57",
        "name": "Eye of Kurnoth",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's <b>Attack actions<\/b> have +1 Dice. If the target is a <b>Quarry<\/b>, this fighter's <b>Attack actions<\/b> also have <b>Ensnare<\/b>.<div><\/div>",
        "restrictedTo": "Hunter",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Quarry",
                "Ensnare"
            ]
        }
    },
    "B58": {
        "code": "B58",
        "name": "Fast Shot",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's activation in which they made a Range 3+ <b>Attack action<\/b>, they make another Range 3+ <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "Althaen",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B59": {
        "code": "B59",
        "name": "Great Strides",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B60": {
        "code": "B60",
        "name": "Hale Charm",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter is <b>dealt<\/b> damage, reduce that damage by 1, to a minimum of 1.<div><\/div>",
        "restrictedTo": "Hunter",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B61": {
        "code": "B61",
        "name": "Hunting Aspect",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<br>+1 Defence.<br>+1 Wounds.<div><\/div>",
        "restrictedTo": "Lighaen",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move",
                "Survivability",
                "Defence",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B62": {
        "code": "B62",
        "name": "Kurnoth's Mark",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one dice in the defence roll when this fighter is the target of an <b>Attack action<\/b>.<br><b>Reaction:<\/b> After a friendly fighter's <b>Attack action<\/b> that takes an adjacent enemy fighter out of action, if this card is in your hand, give that friendly fighter this upgrade (do not spend any glory points).<div><\/div>",
        "restrictedTo": "Hunter",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence",
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B63": {
        "code": "B63",
        "name": "Shield Slash",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 3<\/p><div><\/div>",
        "restrictedTo": "Skaeth",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B64": {
        "code": "B64",
        "name": "Vicious Darts",
        "faction": "Skaeth's Wild Hunt",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <b>Ensnare<\/b>. On a <b>critical hit<\/b> this <b>Attack action<\/b> has +1 Damage.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare",
                "Spell"
            ]
        }
    },
    "B264": {
        "code": "B264",
        "name": "Annihilation",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if <i>all enemy fighters<\/i> are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B273": {
        "code": "B273",
        "name": "Conquest",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if all surviving friendly fighters are <i>in your opponent's territory<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B275": {
        "code": "B275",
        "name": "Denial",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if there are no enemy fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Enemy Displacement",
                "Offence"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B283": {
        "code": "B283",
        "name": "Hold Objective 1",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds objective <i>1<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B284": {
        "code": "B284",
        "name": "Hold Objective 2",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds objective <i>2<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B285": {
        "code": "B285",
        "name": "Hold Objective 3",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds objective <i>3<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B286": {
        "code": "B286",
        "name": "Hold Objective 4",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds objective <i>4<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B287": {
        "code": "B287",
        "name": "Hold Objective 5",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds objective <i>5<\/i>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B305": {
        "code": "B305",
        "name": "Supremacy",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if your warband holds three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B329": {
        "code": "B329",
        "name": "Confusion",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> two fighters that are adjacent to each other. <b>Place<\/b> each fighter in the hex that was occupied by the other fighter when you <b>chose<\/b> them.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Place",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B336": {
        "code": "B336",
        "name": "Eldritch Haze",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, the caster has +1 Defence. This spell <b>persists<\/b> until the end of the round or until the caster is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B357": {
        "code": "B357",
        "name": "Marked",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a fighter. They are a <b>Quarry<\/b>. This <b>persists<\/b> until that fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B366": {
        "code": "B366",
        "name": "Sidestep",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a friendly fighter and <b>push<\/b> them one hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B368": {
        "code": "B368",
        "name": "Snare",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during a friendly <b>Hunter's Attack action<\/b>, after it <b>drives back<\/b> an enemy fighter. The enemy fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": {
                "Grashrak's Despoilers": 5,
                "Skaeth's Wild Hunt": 5,
                "The Grymwatch": 5,
                "Rippa's Snarlfangs": 5
            },
            "tags": [
                "Hunter",
                "Reaction"
            ]
        }
    },
    "B391": {
        "code": "B391",
        "name": "Caltrops",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During a Range 1 <b>Attack action<\/b>, after this fighter is <b>driven back<\/b>, but before they are <b>dealt<\/b> damage by any <b>lethal<\/b> hexes, their attacker is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Lethal"
            ]
        }
    },
    "B396": {
        "code": "B396",
        "name": "Great Fortitude",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B397": {
        "code": "B397",
        "name": "Great Speed",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B398": {
        "code": "B398",
        "name": "Great Strength",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Range 1 and Range 2 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B417": {
        "code": "B417",
        "name": "Predatory Instinct",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Hunter<\/b>. You can <b>re-roll<\/b> one dice in the attack rolls for this fighter's <b>Attack actions<\/b> that target a <b>Quarry<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave core set",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Quarry"
            ]
        }
    },
    "----------The Grymwatch expansion": "The Grymwatch expansion",
    "B65": {
        "code": "B65",
        "name": "Bravely Done!",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly fighter with one or more <b>supporting<\/b> fighters takes an enemy fighter out of action with an <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B66": {
        "code": "B66",
        "name": "Charnel House",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "<b>Hybrid:<\/b> Score this in the third end phase<br><i>If:<\/i> All surviving friendly fighters are in enemy territory<br><i>Or:<\/i> There are no enemy fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B67": {
        "code": "B67",
        "name": "Conquering Heroes",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds one or more objectives in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B68": {
        "code": "B68",
        "name": "Defending the Hearth",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter is taken out of action in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Offence"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B69": {
        "code": "B69",
        "name": "Ghoul Pack",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if three or more friendly fighters are adjacent to the same enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B70": {
        "code": "B70",
        "name": "Glory of the Court",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three or more surviving friendly fighters are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Inspiration"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B71": {
        "code": "B71",
        "name": "In the Name of the King",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if your warband holds three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B72": {
        "code": "B72",
        "name": "Incomprehensible Scheme",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds more objectives than each enemy warband.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B73": {
        "code": "B73",
        "name": "Mordant Triumph",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you have scored five or more <b>surge<\/b> objective cards in this game.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B74": {
        "code": "B74",
        "name": "Mouths to Feed",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if there are fewer surviving enemy fighters than there are enemy fighters out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B75": {
        "code": "B75",
        "name": "Pervasive Delusion",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when you play your third or subsequent gambit card in a single round.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B76": {
        "code": "B76",
        "name": "Shifting Madness",
        "faction": "The Grymwatch",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if your warband holds the objective when the same number as the current round (e.g. objective 1 in the first round).<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B77": {
        "code": "B77",
        "name": "Appalling Visage",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter and one adjacent enemy fighter. <b>Push<\/b> the chosen enemy fighter up to 2 hexes away from the chosen friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B78": {
        "code": "B78",
        "name": "Combat Drill",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After a friendly fighter's <b>Move action<\/b> made as part of a <b>Charge action<\/b>, <b>choose<\/b> another friendly fighter. The chosen fighter makes a <b>Move action<\/b>. The chosen fighter must end that <b>Move action<\/b> adjacent to the fighter making the <b>Charge action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "B79": {
        "code": "B79",
        "name": "Double Time",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's <b>Move action<\/b> (but not during a superaction). That fighter makes another <b>Move action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "B80": {
        "code": "B80",
        "name": "Horrifying Spectacle",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an <b>Attack action<\/b> or gambit that has <b>dealt<\/b> enough damage to an enemy fighter to take it out of action, but before removing the fighter from the battlefield. All friendly fighters adjacent to that fighter are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Inspiration"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B81": {
        "code": "B81",
        "name": "Pack, Advance!",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one or more friendly <b>Crypt Ghouls<\/b> and <b>push<\/b> each of the chosen fighters up to 2 hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B82": {
        "code": "B82",
        "name": "Recycled Riches",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Take all the cards from your power discard pile that have the Grymwatch warband symbol. Shuffle them face down, then add the top card to your hand. Return the other cards to your power discard pile.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B83": {
        "code": "B83",
        "name": "Scrabbling Claws",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter that has one or more upgrades and is adjacent to one or more friendly fighters. The chosen fighter's player picks one of that fighter's upgrades and <b>discards<\/b> it.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B84": {
        "code": "B84",
        "name": "Shattering Impact",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's <b>Attack action<\/b>, if that fighter has one or more upgrades. Pick one of their upgrades and one of their target's upgrades. Both cards are <b>discarded<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B85": {
        "code": "B85",
        "name": "Stench of Victory",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during a friendly fighter's successful <b>Attack action<\/b>, before the deal damage step. <b>Choose<\/b> another friendly fighter and <b>push<\/b> the chosen fighter up to 3 hexes so they are adjacent to the target.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B86": {
        "code": "B86",
        "name": "Strident Summons",
        "faction": "The Grymwatch",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "A friendly Crakmarrow makes the Ghoul Call action.<div><\/div>",
        "restrictedTo": "Duke Crakmarrow",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "B87": {
        "code": "B87",
        "name": "Aura of Command",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action:<\/b> <b>Choose<\/b> two other friendly fighters. You cannot <b>choose<\/b> fighters with any Move or Charge tokens. Each of the chosen fighters makes a <b>Move action<\/b>.<div><\/div>",
        "restrictedTo": "Duke Crakmarrow",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "B88": {
        "code": "B88",
        "name": "Drawn to Weakness",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an activation, <b>push<\/b> this fighter 1 hex towards an enemy fighter that has one or more wound tokens.<div><\/div>",
        "restrictedTo": "Duke's Harriers",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B89": {
        "code": "B89",
        "name": "Grip of Madness",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's <b>Move action<\/b>, if this fighter is holding an objective, place a Madness counter on this card. While there are one or more Madness counters on this card, this fighter cannot be <b>pushed<\/b>. <b>Remove<\/b> all Madness counters from this card when this fighter makes a <b>Move action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Hold"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B90": {
        "code": "B90",
        "name": "Heroic Vision",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Dice to this fighter's Range 1 and Range 2 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B91": {
        "code": "B91",
        "name": "Hunter's Nose",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Each enemy fighter is a <b>Quarry<\/b>. +1 Dice to this fighter's <b>Attack actions<\/b> that target a <b>Quarry<\/b>.<div><\/div>",
        "restrictedTo": "Valreek the Tracker",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B92": {
        "code": "B92",
        "name": "Impervious Delusion",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter would be <b>dealt<\/b> more than 2 damage by an <b>Attack action<\/b> or gambit, they are instead <b>dealt<\/b> 2 damage. This damage cannot be further modified.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B93": {
        "code": "B93",
        "name": "Right-hand Ghoul",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After a friendly Crakmarrow's <b>Move action<\/b>, if this fighter has no Move or Charge tokens, this fighter makes a <b>Move action<\/b>. This fighter must end the <b>Move action<\/b> adjacent to a friendly Crakmarrow<div><\/div>",
        "restrictedTo": "Gristlewel Greatsword",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "B94": {
        "code": "B94",
        "name": "Seized Weapon",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When you give this upgrade to a friendly fighter from your hand, one adjacent enemy fighter is <b>dealt<\/b> 1 damage.<br><p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B95": {
        "code": "B95",
        "name": "Severed Trophy",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter's <b>Attack action<\/b> takes an adjacent enemy fighter out of action, gain 1 additional glory point.<div><\/div>",
        "restrictedTo": "Duke Crakmarrow",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B96": {
        "code": "B96",
        "name": "Well Motivated",
        "faction": "The Grymwatch",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Range 1 and Range 2 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B274": {
        "code": "B274",
        "name": "Coveted Spoils",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if all objectives are held.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B277": {
        "code": "B277",
        "name": "Dug In",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "4",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> Your warband holds three or more objectives<br><b>And:<\/b> Your warband held three or more objectives are the start of the round.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B278": {
        "code": "B278",
        "name": "Fateful Strike",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter's successful <b>Attack action<\/b> that targets a fighter with a Defence characteristic of 2 or more.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B295": {
        "code": "B295",
        "name": "Path to Victory",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> One or more enemy fighters were taken out of action in the previous phase<br><i>And:<\/i> Your warband holds two or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B299": {
        "code": "B299",
        "name": "Scrum",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if four or more fighters on the battlefield are in a single group in which each fighter is adjacent to at least one other fighter in that group.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Mobility",
                "Enemy Displacement"
            ],
            "rating": 4,
            "factionRatingOverride": {
                "Steelheart's Champions": 2,
                "Ironskull's Boyz": 2,
                "The Chosen Axes": 2,
                "Magore's Fiends": 2,
                "The Farstriders": 2,
                "Stormsire's Cursebreakers": 2,
                "Mollog's Mob": 2,
                "Ylthari's Guardians": 2,
                "Ironsoul's Condemners": 2,
                "Lady Harrow's Mournflight": 2,
                "Rippa's Snarlfangs": 2
            },
            "tags": [
                "Restricted"
            ]
        }
    },
    "B306": {
        "code": "B306",
        "name": "Swift Capture",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Dual:<\/b> Score this immediately after an activation<br><i>If:<\/i> Your warband holds one or more objectives in friendly territory<br><i>And:<\/i> Your warband holds one or more objectives in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B311": {
        "code": "B311",
        "name": "The Beast is Slain",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly <b>Hunter's<\/b> <b>Attack action<\/b> that takes an enemy <b>leader<\/b> or enemy <b>Quarry<\/b> out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Hunter"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Quarry"
            ]
        }
    },
    "B312": {
        "code": "B312",
        "name": "The Great Hunt",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Hybrid:<\/b> Score this in an end phase<br><i>If:<\/i> One or more friendly <b>Hunters<\/b> each have three or more upgrades<br><i>Or:<\/i> Three or more friendly <b>Hunters<\/b> each have one or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Hunter"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter"
            ]
        }
    },
    "B314": {
        "code": "B314",
        "name": "To the End",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if there are no cards left in your power deck.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "supportCards": [
                "Card Draw"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B326": {
        "code": "B326",
        "name": "Cloaked in Shadow",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> a fighter. Until the end of the next activation, that fighter is a <b>Quarry<\/b>, players cannot <b>choose<\/b> that fighter when a gambit is played, and that fighter cannot be <b>dealt<\/b> damage by gambits.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B332": {
        "code": "B332",
        "name": "Desperate Flight",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter and <b>Scatter<\/b> 4 from that fighter's hex. <b>Push<\/b> that fighter 3 hexes along the <b>chain<\/b>. If a hex that fighter would be <b>pushed<\/b> into is <b>blocked<\/b> or <b>occupied<\/b>, do not <b>push<\/b> that fighter any further.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Scatter"
            ]
        }
    },
    "B338": {
        "code": "B338",
        "name": "Exhaustion",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Play this only in a power step following your activation. At the end of the next activation, <b>choose<\/b> one enemy fighter that made two or more actions in that activation. The chosen fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B339": {
        "code": "B339",
        "name": "Fate's Decree",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an opponent makes a roll as instructed by a gambit or upgrade (but not during an <b>Attack action<\/b>), before the effect of the roll is resolved. The opponent must <b>re-roll<\/b> that roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B341": {
        "code": "B341",
        "name": "Frenzied Search",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Play this only if your warband holds one or more objectives. <b>Discard<\/b> one power card. If you do, <b>draw<\/b> up to three power cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B355": {
        "code": "B355",
        "name": "Madness Dart",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Poison<\/b><br><b>Choose<\/b> one enemy fighter adjacent to one or more friendly fighters. The chosen fighter's <b>Attack actions<\/b> have the <img src=\"img\/sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> characteristic instead of their printed characteristic. This effect <b>persists<\/b> until the chosen fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Poison"
            ]
        }
    },
    "B358": {
        "code": "B358",
        "name": "Mass Upheaval",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span><img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, roll one magic dice for each feature token in the same players territory as the caster. For each roll of <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>, flip that token. If the caster is in no one's territory, this spell fails.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Flip"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Flip",
                "Objective"
            ]
        }
    },
    "B363": {
        "code": "B363",
        "name": "Restless Prize",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick one objective token and move it into an adjacent hex up to two times. You cannot move it into a <b>lethal<\/b> hex or a hex that includes a feature token.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Positioning"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Objective"
            ]
        }
    },
    "B367": {
        "code": "B367",
        "name": "Sitting Target",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first <b>Attack action<\/b> made by a friendly fighter in the next activation has +1 Dice and <b>Ensnare<\/b> if the target has no Move or Charge tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "B380": {
        "code": "B380",
        "name": "Amberbone Axe",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> After this fighter makes this <b>Attack action<\/b>, <b>discard<\/b> this card.<br><p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If this <b>Attack action<\/b> takes an enemy fighter out of action, <b>discard<\/b> this card and gain 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B389": {
        "code": "B389",
        "name": "Bloodthief",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> <b>Reaction:<\/b> After this <b>Attack action<\/b>, if it succeeded, <b>Heal<\/b> (2) this fighter and <b>discard<\/b> this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B403": {
        "code": "B403",
        "name": "Hunter's Reflexes",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Hunter<\/b>.<br><b>Reaction:<\/b> Use this after an enemy fighter's activation, if that fighter is a <b>Quarry<\/b>. <b>Push<\/b> this fighter 1 hex closer to that enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Quarry",
                "Reaction"
            ]
        }
    },
    "B411": {
        "code": "B411",
        "name": "Larval Lance",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> -<\/p> This <b>Attack action's<\/b> Dice and Damage characteristics are equal to the current round number (e.g. 1 in the first round). They cannot be modified.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B414": {
        "code": "B414",
        "name": "Mazzig's Many Legs",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Lost Page<\/b><br><b>Spell action (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If <b>cast<\/b>, <b>choose<\/b> another friendly fighter within 2 hexes of the caster. <b>Push<\/b> the chosen fighter up to 2 hexes.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Lost Page"
            ]
        }
    },
    "B423": {
        "code": "B423",
        "name": "Soothing Companion",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's activation, unless this fighter made one or more <b>Attack actions<\/b> in that activation, <b>Heal<\/b> (1) this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B428": {
        "code": "B428",
        "name": "Stoneform",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-1 Move (to a minimum of 0).<br>This fighter is a <b>Quarry<\/b>. If this fighter is a <b>Quarry<\/b>, this fighter cannot be <b>pushed<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B431": {
        "code": "B431",
        "name": "Survival Instincts",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Quarry<\/b>. If this fighter is a <b>Quarry<\/b>, this fighter is on Guard.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B434": {
        "code": "B434",
        "name": "Trophy Belt",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Gain 1 spent glory point when this fighter's <b>Attack action<\/b> takes an adjacent enemy fighter out of action. Gain 1 unspent glory point instead if the target was a <b>Quarry<\/b>.<div><\/div>",
        "restrictedTo": "Hunter",
        "box": "The Grymwatch expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "----------Rippa's Snarlfangs expansion": "Rippa's Snarlfangs expansion",
    "B97": {
        "code": "B97",
        "name": "Burning Spite",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if two or more surviving friendly fighters are Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Inspiration"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B98": {
        "code": "B98",
        "name": "Chase Down",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if two or more friendly fighters are adjacent to the same enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B99": {
        "code": "B99",
        "name": "Conquered Land",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband holds all objectives in one or more player's territories.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B100": {
        "code": "B100",
        "name": "Cruel Hunters",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> Two or more enemy fighters are out of action<br><i>And:<\/i> One or more friendly fighters are in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B101": {
        "code": "B101",
        "name": "Feeding Time",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter is taken out of action by a friendly fighter's Snarlfang's Jaws <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B102": {
        "code": "B102",
        "name": "Lay Waste",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if all enemy fighter's are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B103": {
        "code": "B103",
        "name": "Leading the Charge",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after your <b>Leader<\/b> makes a successful <b>Attack action<\/b> as part of a <b>Charge action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B104": {
        "code": "B104",
        "name": "Loaded with Plunder",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if one or more friendly fighters have three or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B105": {
        "code": "B105",
        "name": "Marking Your Territory",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds one or more objectives in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B106": {
        "code": "B106",
        "name": "No Mercy",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter's successful <b>Attack action<\/b> that targeted an enemy fighter with one or more wound tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B107": {
        "code": "B107",
        "name": "Plunderers",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if each surviving friendly fighter has one or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B108": {
        "code": "B108",
        "name": "Swift Hunters",
        "faction": "Rippa's Snarlfangs",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if three or more surviving friendly fighters each have one or more Move and\/or Charge tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B109": {
        "code": "B109",
        "name": "Defensive Manoeuvre",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter. <b>Push<\/b> that fighter up to 1 hex away from the nearest enemy fighter. <b>Give<\/b> the friendly fighter one Guard token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence",
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "B110": {
        "code": "B110",
        "name": "Furious Reprisal",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter's <b>Attack action<\/b> that targeted a friendly fighter. That friendly fighter makes an <b>Attack action<\/b> that must target that enemy fighter, and you can <b>re-roll<\/b> any number of dice in the attack roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Free Action"
            ]
        }
    },
    "B111": {
        "code": "B111",
        "name": "Hamstring",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's  successful Snarlfang's Jaws <b>Attack action<\/b>. <b>Give<\/b> the target of that <b>Attack action<\/b> one Move token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B112": {
        "code": "B112",
        "name": "Narrow Escape",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when a friendly fighter is <b>dealt<\/b> damage, before placing wound tokens on their fighter card. Reduce that damage by 1, to a minimum of 1.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B113": {
        "code": "B113",
        "name": "Pack Tactics",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter and up to two friendly fighters adjacent to that fighter. <b>Push<\/b> each chosen fighter 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B114": {
        "code": "B114",
        "name": "Savage Mauling",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first Range 1 or Range 2 <b>Attack action<\/b> made by a friendly fighter in the next activation has +1 Dice and +1 Damage for each <b>supporting<\/b> friendly fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B115": {
        "code": "B115",
        "name": "Smell Weakness",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first <b>Attack action<\/b> made by a friendly fighter in the next activation has <b>Cleave<\/b> and <b>Ensnare<\/b> if the target has one or more wound tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Cleave",
                "Ensnare"
            ]
        }
    },
    "B116": {
        "code": "B116",
        "name": "Unbridled Ferocity",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's failed Snarlfang's Jaws <b>Attack action<\/b>. That fighter makes a Snarlfang's Jaws <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B117": {
        "code": "B117",
        "name": "Venomous Spittle",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's successful Snarlfang's Jaws <b>Attack action<\/b>. The target of that <b>Attack action<\/b> is <b>dealt<\/b> 1 damage at the end of each action phase. This effect <b>persists<\/b> until the target is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B118": {
        "code": "B118",
        "name": "Vindictive Attack",
        "faction": "Rippa's Snarlfangs",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Dice to the first <b>Attack action<\/b> made by a friendly fighter in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B119": {
        "code": "B119",
        "name": "Bonded",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter makes an <b>Attack action<\/b> that targets an adjacent enemy fighter, or is the target of an <b>Attack action<\/b> made by an adjacent enemy fighter, this fighter is considered to have one additional <b>supporting<\/b> fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B120": {
        "code": "B120",
        "name": "Boss Hat",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If your <b>leader<\/b> is out of action:<br>+1 Defence<br>+1 Damage to this fighter's Range 1 and Range 2 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B121": {
        "code": "B121",
        "name": "Circling Hunter",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's <b>Attack action<\/b> (but not during a superaction) or after an <b>Attack action<\/b> that targets this fighter (but not during a superaction), <b>push<\/b> this fighter 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B122": {
        "code": "B122",
        "name": "Embittered Survivor",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Wounds.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B123": {
        "code": "B123",
        "name": "Fiendish Jab",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Stabbin' Stikka <b>Attack action<\/b> for each <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the attack roll.<div><\/div>",
        "restrictedTo": "Stabbit",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B124": {
        "code": "B124",
        "name": "Hidden Slitta",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Cleave<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "B125": {
        "code": "B125",
        "name": "Hunt as One",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter supports a friendly fighter, this fighter is considered to be two <b>supporting<\/b> fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B126": {
        "code": "B126",
        "name": "Loping Strides",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B127": {
        "code": "B127",
        "name": "Pack Leader",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> any number of dice in this fighter's attack rolls for the Snarlfang's Jaws <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "Rippa Narkbad",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B128": {
        "code": "B128",
        "name": "Quickdrop Venom",
        "faction": "Rippa's Snarlfangs",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's successful <b>Attack action<\/b> (other than a Snarlfang's Jaws <b>Attack action<\/b>), roll one attack dice. On a <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the target of that <b>Attack action<\/b> is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B268": {
        "code": "B268",
        "name": "Beyond Mortal",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Hybrid:<\/b> Score this in an end phase<br><i>If:<\/i> A friendly fighter has 4 or more wound tokens<br><i>Or:<\/i> A surviving friendly fighter has a Move and\/or Wounds characteristic or 8 or more.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Wounds",
                "Move"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B270": {
        "code": "B270",
        "name": "Brought to Bay",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Dual:<\/b> Score this immediately<br><i>If:<\/i> A friendly <b>Hunter<\/b> makes an <b>Attack action<\/b> that takes an enemy fighter out of action<br><i>And:<\/i> That enemy fighter was in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": {
                "Rippa's Snarlfangs": 4,
                "The Grymwatch": 4,
                "Skaeth's Wild Hunt": 4,
                "Grashrak's Despoilers": 3,
                "Hrothgorn's Mantrappers": 4
            },
            "tags": [
                "Hunter"
            ]
        }
    },
    "B272": {
        "code": "B272",
        "name": "Committed",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Hybrid:<\/b> Score this in an end phase<br><i>If:<\/i> Each surviving friendly fighter is adjacent to one or more enemy fighters<br><i>Or:<\/i> One or more friendly fighters are each adjacent to three or more enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B276": {
        "code": "B276",
        "name": "Duck and Parry",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an <b>Attack action<\/b> that targets a friendly fighter with one or more Guard tokens fails.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Survivability",
                "Guard"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Guard"
            ]
        }
    },
    "B281": {
        "code": "B281",
        "name": "Gathered Momentum",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Hybrid:<\/b> Score this immediately<br><i>If:<\/i> You score your second or subsequent <b>surge<\/b> objective card in a phase<br><i>Or:<\/i> A friendly fighter makes a <b>Charge action<\/b> and ends that action five or more hexes from the hex in which they began the action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 3,
            "factionRatingOverride": {
                "Rippa's Snarlfangs": 4,
                "The Grymwatch": 4,
                "Skaeth's Wild Hunt": 4,
                "Lady Harrow's Mournflight": 4,
                "Spiteclaw's Swarm": 5
            },
            "tags": []
        }
    },
    "B298": {
        "code": "B298",
        "name": "Run Ragged",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if each surviving fighter has one or more Move and\/or Charge tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                [
                    "Free Action",
                    "Move"
                ]
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B304": {
        "code": "B304",
        "name": "Steady Assault",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after the same friendly fighter's third or subsequent <b>Attack action<\/b> in a single phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Free Action"
            ],
            "rating": 2,
            "factionRatingOverride": {
                "Mollog's Mob": 4
            },
            "tags": []
        }
    },
    "B308": {
        "code": "B308",
        "name": "Temporary Victory",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if your warband holds three or more objectives.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": {
                "Steelheart's Champions": 1,
                "Ironskull's Boyz": 2,
                "The Chosen Axes": 2,
                "Magore's Fiends": 2,
                "The Farstriders": 1,
                "Stormsire's Cursebreakers": 1,
                "Mollog's Mob": 0,
                "Ylthari's Guardians": 2,
                "Ironsoul's Condemners": 1,
                "Lady Harrow's Mournflight": 2,
                "Rippa's Snarlfangs": 1
            },
            "tags": [
                "Restricted"
            ]
        }
    },
    "B319": {
        "code": "B319",
        "name": "Veteran Survivors",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Third",
        "glory": "2",
        "text": "Score this in the third end phase if there are three or more surviving friendly <b>Hunters<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": {
                "Rippa's Snarlfangs": 3,
                "The Grymwatch": 4,
                "Skaeth's Wild Hunt": 2,
                "Grashrak's Despoilers": 2
            },
            "tags": [
                "Hunter"
            ]
        }
    },
    "B331": {
        "code": "B331",
        "name": "Dangerous Prize",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick one objective token in an <b>empty<\/b> hex. The first fighter to move into, be <b>pushed<\/b> into or be <b>placed<\/b> in the same hex as that objective token in the next activation is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B333": {
        "code": "B333",
        "name": "Downwind",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Push<\/b> one friendly <b>Hunter<\/b> 1 hex closer to an enemy fighter. That enemy fighter is a <b>Quarry<\/b>. This effect persists until that enemy fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Quarry"
            ]
        }
    },
    "B346": {
        "code": "B346",
        "name": "Hostile Ground",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter in your territory that is on or adjacent to one or more <b>lethal<\/b> hexes. That fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "B348": {
        "code": "B348",
        "name": "Hunting Band",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly <b>Hunter<\/b> and any number of adjacent friendly <b>Hunters<\/b>. <b>Give<\/b> each chosen fighter one Guard token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Guard"
            ]
        }
    },
    "B350": {
        "code": "B350",
        "name": "Invert Terrain",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, pick one feature token within five hexes of the caster. Flip that token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Flip"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Flip",
                "Objective"
            ]
        }
    },
    "B360": {
        "code": "B360",
        "name": "Overkill",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's <b>Attack action<\/b> that took an enemy fighter out of action, if the <b>Attack action dealt<\/b> more damage than was necessary to take the target out of action. Gain 1 spent glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Damage",
                "Accuracy"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B369": {
        "code": "B369",
        "name": "Spinetoad Toxin",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Poison<\/b><br>Choose one enemy fighter adjacent to one or more friendly fighters. The enemy fighter is <b>dealt<\/b> 1 damage after each <b>Move action<\/b> they make. This effect <b>persists<\/b> until the enemy fighter is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Poison"
            ]
        }
    },
    "B373": {
        "code": "B373",
        "name": "Tracking",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move to the first fighter to make a <b>Move action<\/b> in the next activation. +2 Move instead if that fighter is a <b>Hunter<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Hunter"
            ]
        }
    },
    "B374": {
        "code": "B374",
        "name": "Unexpected Peril",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick one feature token in an <b>empty<\/b> hex in your territory. Flip that token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Flip"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Flip",
                "Objective"
            ]
        }
    },
    "B382": {
        "code": "B382",
        "name": "Amberbone Hammer",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<br>Knockback 1<\/p> If this <b>Attack action<\/b> takes an enemy fighter out of action, <b>discard<\/b> this card and gain 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Knockback"
            ]
        }
    },
    "B386": {
        "code": "B386",
        "name": "Avatar of the Ur-grub",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This card cannot be included in your deck.<br>This card cannot be removed from this fighter.<br>This fighter is a <b>Quarry<\/b>.<br>This fighter's Range 1 and Range 2 <b>Attack actions<\/b> have +1 Damage and <b>Ensnare<\/b>.<br><b>Reaction:<\/b> After this fighter's successful Range 1 or Range 2 <b>Attack action<\/b>, <b>Heal<\/b> (1) this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Damage",
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": [
                "Quarry",
                "Reaction",
                "Ensnare"
            ]
        }
    },
    "B400": {
        "code": "B400",
        "name": "Hidden Presence",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Quarry<\/b>. If this fighter is a <b>Quarry<\/b>, players cannot <b>choose<\/b> this fighter when a gambit is played.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B401": {
        "code": "B401",
        "name": "Hungry Realmstone",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an activation, place one Potency counter on this card and lose one glory point.<br>+1 Damage to this fighter's Range 1 and Range 2 <b>Attack actions<\/b> for each Potency counter on this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B407": {
        "code": "B407",
        "name": "Iara's Instant Shield",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Lost Page<\/b><br><b>Spell action (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> Use this during an <b>Attack action<\/b> that targets this fighter, after the attack roll. If <b>cast<\/b>, you can <b>re-roll<\/b> any number of dice in the defence roll for that <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Lost Page",
                "Spell",
                "Spellcasting"
            ]
        }
    },
    "B408": {
        "code": "B408",
        "name": "Inescapable Blow",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> <b>Reaction:<\/b> After this fighter's successful <b>Attack action<\/b> with <b>Combo<\/b>, make this <b>Attack action<\/b>. It must target the same fighter and has <b>Cleave<\/b> and <b>Ensnare<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [
                "ComboTrigger"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Cleave",
                "Ensnare",
                "Combo",
                "ComboFollowUp"
            ]
        }
    },
    "B412": {
        "code": "B412",
        "name": "Lethal Snares",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter ends a <b>push<\/b> or a <b>Move action<\/b> in a hex that contains a feature token, or is <b>placed<\/b> in a hex that contains a feature token, flip that token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Flip"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Flip",
                "Objective"
            ]
        }
    },
    "B415": {
        "code": "B415",
        "name": "Opening Strike",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Combo<\/p><div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [
                "ComboFollowUp"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Combo",
                "ComboTrigger"
            ]
        }
    },
    "B421": {
        "code": "B421",
        "name": "Repeating Mirror",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy <b>wizard casts<\/b> a spell (other than a <b>spell Attack action<\/b>), and that spell is resolved, resolve that spell again with the same casting roll result, but do so as if this fighter was the caster and a <b>wizard<\/b>. Then <b>discard<\/b> this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B427": {
        "code": "B427",
        "name": "Sting of the Ur-Grub",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Ur-grub Aspect<\/b><br>+1 Damage to this fighter's Range 1 <b>Attack actions<\/b>.<br>If this fighter has three or more <b>Ur-grub Aspects<\/b>, remove those cards from the game (they do not go into a discard pile) and <b>give<\/b> the Avatar of the Ur-grub upgrade to this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Rippa's Snarlfangs expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Ur-grub Aspect"
            ]
        }
    },
    "----------The Wurmspat expansion": "The Wurmspat expansion",
    "B129": {
        "code": "B129",
        "name": "Blessed Endurance",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an <b>Attack action<\/b> with a Damage characteristic of 3 or more targets a friendly fighter and succeeds, if the friendly fighter is not taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Wounds"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B130": {
        "code": "B130",
        "name": "Blessings Three",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if any surviving friendly fighter has three or more upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B131": {
        "code": "B131",
        "name": "Chosen Warriors",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are one or more surviving friendly fighters<br><i>And: Three<\/i> or more enemy fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Offence"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B132": {
        "code": "B132",
        "name": "Cycle of Decay",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if you played two or more <b>Cycle<\/b> ploys in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Cycle", "Card Draw"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B133": {
        "code": "B133",
        "name": "Faithful Reward",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if each surviving friendly fighter is Inspired.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Offence", "Inspiration"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B134": {
        "code": "B134",
        "name": "Fell the Faithless",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy <b>leader<\/b> is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Offence", "Mobility"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B135": {
        "code": "B135",
        "name": "Nurgle's Garden Grows",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Hybrid:<\/b> Score this in the third end phase<br><i>If:<\/i> There are no enemy fighters in your territory<br><i>Or:<\/i> Your warband holds more objectives than each opposing warband.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility",
                "Enemy Displacement"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B136": {
        "code": "B136",
        "name": "Rotbringers",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband successfully <b>cast<\/b> two or more spells in the preceding action phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Spellcasting", "Spell"],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B137": {
        "code": "B137",
        "name": "Sacred Tri-lobe",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if your warband holds three or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B138": {
        "code": "B138",
        "name": "Seeping Rot",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly fighter holding an objective is the target of an <b>Attack action<\/b> and is not <b>driven back<\/b>, if that fighter survives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [
                "Defence"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B139": {
        "code": "B139",
        "name": "Spread his Blessings",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your warband holds one or more objectives in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B140": {
        "code": "B140",
        "name": "Strength of the Devoted",
        "faction": "The Wurmspat",
        "type": "Objective",
        "subtype": "Third",
        "glory": "3",
        "text": "Score this in the third end phase if no friendly fighters are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [
                "Survivability"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B141": {
        "code": "B141",
        "name": "Blades of Putrefaction",
        "faction": "The Wurmspat",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, friendly fighters' Range 1 and Range 2 <b>Attack actions<\/b> have +1 Damage on a <b>critical hit<\/b>. This spell <b>persists<\/b> until the end of the round.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B142": {
        "code": "B142",
        "name": "Blessing of Rust",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter adjacent to one or more friendly fighters. The chosen fighter's Defence characteristic is <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span>. This effect <b>persists<\/b> until the chosen fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff",
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B143": {
        "code": "B143",
        "name": "Fecund Vigour",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cycle<\/b><br>You can <b>re-roll<\/b> one attack dice in friendly fighter's attack rolls. This effect <b>persists<\/b> until after the next <b>Attack action<\/b> made by a friendly fighter, the end of the round, or you play another <b>Cycle<\/b> ploy.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": ["Cycle"]
        }
    },
    "B144": {
        "code": "B144",
        "name": "Gift of Contagion",
        "faction": "The Wurmspat",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>)<\/b> If <b>cast<\/b>, <b>choose<\/b> one enemy fighter within 3 hexes of the casts. -1 Damage (to a minimum of 1) from the chosen fighter's <b>Attack actions<\/b>. This spell <b>persists<\/b> until the end of the round or the chosen fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff",
                "Survivability",
                "Wounds"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B145": {
        "code": "B145",
        "name": "Nauseous Revulsion",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cycle<\/b><br>-1 Dice (to a minimum of 1) from <b>Attack actions<\/b> made by enemy fighters adjacent to one or more friendly fighters. This effect <b>persists<\/b> until the end of the round or you play another <b>Cycle<\/b> ploy.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": ["Cycle"]
        }
    },
    "B146": {
        "code": "B146",
        "name": "Rampant Disease",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cycle<\/b><br>Roll one attack dice for each enemy fighter adjacent to one or more friendly fighters. For each roll of <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that enemy fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": ["Cycle"]
        }
    },
    "B147": {
        "code": "B147",
        "name": "Rancid Visitations",
        "faction": "The Wurmspat",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span><img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>):<\/b> If <b>cast<\/b>, each enemy fighter adjacent to the caster is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B148": {
        "code": "B148",
        "name": "Steady Advance",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> up to two friendly fighters and <b>push<\/b> each chosen fighter 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B149": {
        "code": "B149",
        "name": "The Burgeoning",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cycle<\/b><br><b>Heal (1)<\/b> the first friendly fighter that moves, is <b>place<\/b>, <b>pushed<\/b>, or <b>driven back<\/b> into a <b>lethal<\/b> hex. That fighter is not <b>dealt<\/b> damage from the <b>lethal<\/b> hex. This effect <b>persists<\/b> until a friendly fighter is healed in this way or you play another <b>Cycle<\/b> ploy.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Lethal",
                "Cycle"
            ]
        }
    },
    "B150": {
        "code": "B150",
        "name": "Unnatural Vitality",
        "faction": "The Wurmspat",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cycle<\/b> +1 Move to friendly fighters. This effect <b>persists<\/b> until the end of the round or you play another <b>Cycle<\/b> ploy.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": ["Cycle"]
        }
    },
    "B151": {
        "code": "B151",
        "name": "Fly Swarm",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-1 Dice (to a minimum of 1) from <b>Attack actions<\/b> with a Range of 3 or more that target this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence",
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B152": {
        "code": "B152",
        "name": "Foetid Shroud",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one dice in this fighter's defence rolls.<div><\/div>",
        "restrictedTo": "Fecula Flyblown",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B153": {
        "code": "B153",
        "name": "Hulking Physique",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-1 Move (to a minimum of 0)<br>+1 Wounds<br>+1 Damage to this fighter's Range 1 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "Ghulgoch the Butcher",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B154": {
        "code": "B154",
        "name": "Living Plague",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After an enemy fighter's successful Range 1 <b>Attack action<\/b> that targets this fighter, roll one defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> that enemy fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B155": {
        "code": "B155",
        "name": "Pestilent Deliverer",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's <b>Attack actions<\/b> made as part of a <b>Charge action<\/b> have <b>Cleave<\/b>.<div><\/div>",
        "restrictedTo": "Sepsimus Plaguesworn",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "B156": {
        "code": "B156",
        "name": "Putrid Vomit",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p><div><\/div>",
        "restrictedTo": "Fecula Flyblown, Ghulgoch the Butcher",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Range"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B157": {
        "code": "B157",
        "name": "Retchling",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Each time this fighter attempts to <b>cast<\/b> a spell, after the casting roll, you can change one of the symbols rolled to <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span>. In addition, this fighter cannot be <b>dealt<\/b> damage by <b>backlash<\/b>.<div><\/div>",
        "restrictedTo": "Fecula Flyblown",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other",
                "Spellcasting"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B158": {
        "code": "B158",
        "name": "Stolid Bulk",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter cannot be <b>driven back<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B159": {
        "code": "B159",
        "name": "Unstoppable Tread",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's activation, <b>push<\/b> this fighter 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B160": {
        "code": "B160",
        "name": "Virulent Blade",
        "faction": "The Wurmspat",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one attack dice in this fighter's attack rolls for Range 1 and Range 2 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "Ghulgoch the Butcher, Sepsimus Plaguesworn",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B259": {
        "code": "B259",
        "name": "Adaptive Strategy",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you have scored 5 or more <b>hybrid<\/b> objective cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Hybrid"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B260": {
        "code": "B260",
        "name": "Addicted to Power",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter is <b>dealt<\/b> damage by <b>backlash<\/b>, if that fighter is not taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": ["Spellcasting"]
        }
    },
    "B265": {
        "code": "B265",
        "name": "Arcane Arrest",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter's spell that <b>deals<\/b> damage to an enemy <b>Hunter<\/b> or <b>Quarry<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [["Spell", "Damage"], "Spellcasting"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Quarry",
                "Spellcasting"
            ]
        }
    },
    "B266": {
        "code": "B266",
        "name": "Arcane Expertise",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an enemy fighter is <b>dealt<\/b> precisely enough damage to take them out of action by a friendly fighter's spell.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [["Spell", "Damage"], "Spellcasting"],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": ["Spellcasting"]
        }
    },
    "B267": {
        "code": "B267",
        "name": "Awesome Resilience",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Hybrid:<\/b> Score this in an end phase<br><i>If:<\/i> Each surviving friendly fighter has no wound tokens<br><i>Or:<\/i> You healed friendly fighters of 3 or more wound tokens in the previous phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Healing"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B280": {
        "code": "B280",
        "name": "Frantic Exchange",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a fifth or subsequent power card is played in the same power step.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B290": {
        "code": "B290",
        "name": "Master of Many Paths",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if there is a surviving friendly fighter who is a <b>leader<\/b>, a <b>wizard<\/b> and a <b>Hunter<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Hunter"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Hunter"
            ]
        }
    },
    "B296": {
        "code": "B296",
        "name": "Perfect Match",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "4",
        "text": "Score this in an end phase if you have scored 10 or more objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B303": {
        "code": "B303",
        "name": "Sorcerous Volley",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after the same friendly fighter's second or subsequent <b>spell Attack action<\/b> in a single phase that targets the same enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "supportCards": ["Push"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B320": {
        "code": "B320",
        "name": "Beast Armour",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, you can <b>re-roll<\/b> one dice in the caster's defence rolls. This spell <b>persists<\/b> until the end of the round or until the caster is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B328": {
        "code": "B328",
        "name": "Collapse",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick three <b>edge<\/b> hexes in a single group with each hex in the group adjacent to at least one other hex in the group, and all in one player's territory. Each fighter in a hex you picked is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B330": {
        "code": "B330",
        "name": "Crushing Charge",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "In the next activation, you can take the following reaction once.<br><b>Reaction:<\/b> After a friendly fighter's <b>Move action<\/b> made as part of a <b>Charge action<\/b>, roll one attack dice for each enemy fighter adjacent to that fighter. For each roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> that enemy fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B340": {
        "code": "B340",
        "name": "Flash of Foresight",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick one:<br>Pick one objective card in an opponent's hand. That opponent must reveal that card to you.<br>Or:<br>Look at the top card of your power or objective deck (without revealing it) and then put it back.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B351": {
        "code": "B351",
        "name": "Irresistible Vision",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Gambit Spell (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span><img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, <b>push<\/b> each other fighter within 2 hexes of the caster up to 1 hex, or up to 2 hexes if that other fighter is a <b>Hunter<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Hunter"
            ]
        }
    },
    "B352": {
        "code": "B352",
        "name": "Leadbone Dust",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Poison<\/b><br><b>Choose<\/b> one enemy fighter adjacent to one or more friendly fighters. <b>Give<\/b> the chosen fighter one Move token. In addition, <b>Attack actions<\/b> that target the chosen fighter have <b>Ensnare<\/b>. This effect <b>persists<\/b> until the chosen fighter is taken out of action, or the end of the round.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare",
                "Poison"
            ]
        }
    },
    "B353": {
        "code": "B353",
        "name": "Leave Nothing to Chance",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick one feature token in a hex that contains a friendly fighter. <b>Remove<\/b> that token from the battlefield.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Removal"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "B354": {
        "code": "B354",
        "name": "Lucky Escape",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when a friendly fighter is <b>dealt<\/b> 1 damage precisely. That damage is not <b>dealt<\/b> to them.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B359": {
        "code": "B359",
        "name": "Nightmare in the Shadows",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter and <b>push<\/b> them 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B381": {
        "code": "B381",
        "name": "Amberbone Dagger",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If there are one or more <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> in the attack roll, this <b>Attack action<\/b> has <b>Cleave<\/b>. If this <b>Attack action<\/b> takes an enemy fighter out of action, <b>discard<\/b> this card and gain 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cleave"
            ]
        }
    },
    "B387": {
        "code": "B387",
        "name": "Barb-laden Net",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-sword.png\" alt=\"Sword\"><span class=\"sr-only\">Fury<\/span> 3  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<\/p> <br>If this <b>Attack action<\/b> is successful, <b>give<\/b> the target one Charge token and <b>discard<\/b> this card.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B406": {
        "code": "B406",
        "name": "Hunting Companion",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During this fighter's successful Range 1 or Range 2 <b>Attack action<\/b> in which you rolled one or more <img src=\"img\/double-support.png\" alt=\"Double Support\"><span class=\"sr-only\">Double support<\/span> in the attack roll, after the deal damage step, the target is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B409": {
        "code": "B409",
        "name": "Jared's Spirited Sphere",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Lost page<\/b><br><p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 3  <img src=\"img\/inv-focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> -  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 1<br>Ensnare<\/p><div><\/div>",
        "restrictedTo": "Wizard",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": ["Spellcasting"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare",
                "Lost Page",
                "Spell"
            ]
        }
    },
    "B419": {
        "code": "B419",
        "name": "Prey's Cunning",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Quarry<\/b>. If this fighter is a <b>Quarry<\/b>, this fighter cannot be <b>dealt<\/b> damage by Gambits.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B425": {
        "code": "B425",
        "name": "Sprinting Charm",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move in round 1<br>+2 Move in round 2<br>-1 Move <i>to a minimum of 0) in round 3.<div><\/div>\t\t\t\t\t\t\t\t\t\t\t\t\t\t<\/i>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B430": {
        "code": "B430",
        "name": "Substance Siphon",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Defence characteristic is <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> X where X is the round number. Their Defence characteristic cannot be modified, and you cannot <b>re-roll<\/b> dice in the defence roll when this fighter is the target of an <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B433": {
        "code": "B433",
        "name": "The Scattered Tome",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "If this fighter is surviving at the end of the third action phase, gain 1 glory point for each <b>Lost Page<\/b> upgrade this fighter has.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": ["Lost Page"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Lost Page"
            ]
        }
    },
    "B435": {
        "code": "B435",
        "name": "Victor's Experience",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Hunter<\/b>.<br><b>Reaction:<\/b> After a friendly fighter's <b>Attack action<\/b> that takes an enemy fighter out of action, if this card is in your hand, give this upgrade to that fighter. This does not cost any glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "The Wurmspat expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Reaction"
            ]
        }
    },
    "----------Hrothgorn's Mantrappers expansion": "Hrothgorn's Mantrappers expansion",
    "B161": {
        "code": "B161",
        "name": "Always Moving",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There is at least one surviving friendly fighter<br><i>And:<\/i> There are no friendly fighters in your territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Mobility"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B162": {
        "code": "B162",
        "name": "Arm of the Everwinter",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when your warband <b>removes<\/b> a feature token from the battlefield, or flips a feature token.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": [
                "Objective Removal",
                "Objective Flip"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Flip"
            ]
        }
    },
    "B163": {
        "code": "B163",
        "name": "Boxed In",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if there are three of more friendly fighters adjacent to the same enemy fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Mobility"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B164": {
        "code": "B164",
        "name": "Butchering",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if there are more enemy fighters out of action than surviving enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Mobility", "Offence"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B165": {
        "code": "B165",
        "name": "Dinner Time",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter Moves into, is <b>pushed<\/b> into or is <b>placed<\/b> in the same hex as a friendly Trap model.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Enemy Displacement"],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B166": {
        "code": "B166",
        "name": "Extra Crunchy",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately when your warband takes an enemy fighter with three or more upgrades out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Offence"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B167": {
        "code": "B167",
        "name": "Flush Them Out",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately if your warband <b>pushes<\/b> an enemy fighter that is not adjacent to your <b>leader<\/b>, and after the <b>push<\/b> they are adjacent to your <b>leader<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Enemy Displacement"],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B168": {
        "code": "B168",
        "name": "Hunter's Feast",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge, Dual:<\/b> Score this immediately<br><i>When:<\/i> Your <b>leader's Attack action<\/b> takes an enemy fighter out of action<br><i>And:<\/i> Your <b>Leader<\/b> made one or more <b>Attack actions<\/b> that took an enemy fighter out of action earlier in this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Offence", "Mobility"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B169": {
        "code": "B169",
        "name": "Momentarily Sated",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "End",
        "glory": "5",
        "text": "Score this in an end phase if <i>all enemy fighters<\/i> are out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Mobility", "Offence"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B170": {
        "code": "B170",
        "name": "Surprising Competence",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when a friendly <b>Gnoblar's Attack action<\/b> takes an enemy fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Offence"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B171": {
        "code": "B171",
        "name": "Top of the Food Chain",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your <b>leader<\/b> is the only surviving <b>leader<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Mobility", "Offence", "Survivability"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B172": {
        "code": "B172",
        "name": "Unexpected Cunning",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after playing your third or subsequent power card in the same phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B173": {
        "code": "B173",
        "name": "Carnivore Senses",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first <b>Attack action<\/b> made by a friendly <b>Hunter<\/b> in the next activation has <b>Ensnare<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Ensnare"
            ]
        }
    },
    "B174": {
        "code": "B174",
        "name": "Driven Onwards",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter that has one or more Move tokens. <b>Remove<\/b> those tokens.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B175": {
        "code": "B175",
        "name": "Frozen Earth",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick a feature token in a hex that contains or is adjacent to your <b>leader<\/b>. <b>Remove<\/b> it from the battlefield.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Removal"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "B176": {
        "code": "B176",
        "name": "Gnoblar Scramble",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Push<\/b> each friendly <b>Gnoblar<\/b> up to 2 hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B177": {
        "code": "B177",
        "name": "Gotcha!",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly fighter's successful Trap Launcher <b>Attack action<\/b> that does not take the target out of action. <b>Give<\/b> the target one Move token.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B178": {
        "code": "B178",
        "name": "Icy Breath",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter within 3 hexes of your <b>leader<\/b> and roll one magic dice. On a roll of <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the chosen fighter is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B179": {
        "code": "B179",
        "name": "More Traps",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Pick one feature token in a hex that contains or is adjacent to a friendly Bushwakka. Flip that token.<div><\/div>",
        "restrictedTo": "Bushwakka",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Flip"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Flip",
                "Objective"
            ]
        }
    },
    "B180": {
        "code": "B180",
        "name": "Near Miss",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after a friendly <b>Hunter's<\/b> failed <b>Attack action<\/b>. <b>Push<\/b> the target 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Reaction"
            ]
        }
    },
    "B181": {
        "code": "B181",
        "name": "Quick Snack",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after an enemy fighter adjacent to your <b>leader<\/b> is taken out of action. If the enemy fighter's Wounds characteristic is 4 or more, <b>Heal (2)<\/b> your <b>leader<\/b>, otherwise <b>Heal (1)<\/b> your <b>leader<\/b>.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B182": {
        "code": "B182",
        "name": "Ravenous Fury",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this after your <b>leader's<\/b> failed Range 1 <b>Attack action<\/b>. Your <b>leader<\/b> makes one <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B183": {
        "code": "B183",
        "name": "Desperate Parry",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> During an <b>Attack action<\/b> that targets this fighter, before the deal damage step, roll one defence dice. On a roll of <img src=\"img\/shield.png\" alt=\"Block\"><span class=\"sr-only\">Block<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the combat sequence ends and this fighter is <b>dealt<\/b> no damage. Then <b>discard<\/b> this card.<div><\/div>",
        "restrictedTo": "Gnoblar",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B184": {
        "code": "B184",
        "name": "Famed Hunter",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "You can <b>re-roll<\/b> one attack dice in this fighter's attack rolls.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B185": {
        "code": "B185",
        "name": "Hunting Beast",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter's successful <b>Attack action<\/b>, pick one:<br><b>Push<\/b> the target 1 hex, or <b>push<\/b> this fighter 1 hex.<div><\/div>",
        "restrictedTo": "Thrafnir",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Push",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": ["Accuracy"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B186": {
        "code": "B186",
        "name": "Living Avalanche",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Damage to this fighter's Range 1 and Range 2 <b>Attack actions<\/b>.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B187": {
        "code": "B187",
        "name": "Massive Bulk",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "-2 Move (to a minimum of 0)<br>+2 Wounds.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B188": {
        "code": "B188",
        "name": "Plucky Pair",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "Rolls of <img src=\"img\/single-support.png\" alt=\"Single Support\"><span class=\"sr-only\">Single support<\/span> are successes in this fighter's attack rolls and defence rolls.<div><\/div>",
        "restrictedTo": "Luggit and Thwak",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B189": {
        "code": "B189",
        "name": "Savage Instinct",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter's Range 1 and Range 2 <b>Attack actions<\/b> have <b>Ensnare<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Ensnare"
            ]
        }
    },
    "B190": {
        "code": "B190",
        "name": "Scion of the Everwinter",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action: Give<\/b> each adjacent enemy fighter one Move token.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Debuff"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B191": {
        "code": "B191",
        "name": "Toughened Hide",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "When this fighter is <b>dealt<\/b> damage, reduce that damage by 1 (to a minimum of 1).<div><\/div>",
        "restrictedTo": "Hunter",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Wounds"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B192": {
        "code": "B192",
        "name": "Veteran Hunter",
        "faction": "Hrothgorn's Mantrappers",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Action: Draw<\/b> up to two power cards.<div><\/div>",
        "restrictedTo": "Hrothgorn Mantrapper, Gnoblar",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B261": {
        "code": "B261",
        "name": "Against the Wall",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately when an enemy fighter in an <b>edge<\/b> hex is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Encroaching Shadow", "Collapse", "Enemy Displacement"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B262": {
        "code": "B262",
        "name": "Aggressive Strategy",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if you have scored 5 or more <b>surge<\/b> objective cards.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B269": {
        "code": "B269",
        "name": "Blaze a Trail",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an activation if each surviving friendly fighter is in enemy territory and adjacent to no enemy fighters.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Mobility", "Enemy Displacement"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B297": {
        "code": "B297",
        "name": "Rising Power",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter <b>casts<\/b> a spell and you rolled three or more dice in the casting roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": [
                "Well of Power",
                "Potion of Rage",
                "Haymaker"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B302": {
        "code": "B302",
        "name": "Skilled Duellist",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter's successful <b>Attack action<\/b> made as a reaction to that fighter's <b>Attack action<\/b> with <b>Combo<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Combo"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Combo"
            ]
        }
    },
    "B307": {
        "code": "B307",
        "name": "Team Effort",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are two or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter made one or more actions in the previous phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Free Action"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B316": {
        "code": "B316",
        "name": "Triumphant Hunt",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> Three or more enemy fighters are out of action<br><i>And:<\/i> At least one enemy <b>Quarry<\/b> is out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": {
                "Hrothgorn's Mantrappers": 3
            },
            "tags": [
                "Quarry"
            ]
        }
    },
    "B317": {
        "code": "B317",
        "name": "Uncontested",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> Your warband holds two or more objectives<br><i>And:<\/i> No enemy fighters hold objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": ["Objective", "Mobility", "Enemy Displacement"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B318": {
        "code": "B318",
        "name": "Unexpected Pitfall",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Hybrid:<\/b> Score this immediately<br><i>After:<\/i> An enemy fighter is taken out of action by a <b>lethal<\/b> hex<br><i>Or:<\/i> An enemy fighter is taken out of action by damage <b>dealt<\/b> by a gambit you played.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "supportCards": [["Damage", "Ploy"], ["Damage", "Spell"], "Enemy Displacement"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Lethal"
            ]
        }
    },
    "B322": {
        "code": "B322",
        "name": "Blindside",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an <b>Attack action<\/b>, before the attack roll. <b>Push<\/b> one friendly fighter up to 2 hexes so that they are a <b>supporting<\/b> fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Accuracy",
                "Survivability",
                "Defence",
                "Mobility",
                "Push"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "B324": {
        "code": "B324",
        "name": "Buried Instinct",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an <b>Attack action<\/b>, that targets a friendly fighter, before the attack roll. <b>Give<\/b> that friendly fighter one Guard token. If that friendly fighter is <b>Quarry<\/b>, you can also <b>re-roll<\/b> 1 dice in the defence roll for that <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Quarry",
                "Reaction",
                "Guard"
            ]
        }
    },
    "B325": {
        "code": "B325",
        "name": "Chain Attack",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The first <b>Attack action<\/b> made by a friendly fighter in the next activation has <b>Combo<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence"
            ],
            "supportCards": ["ComboFollowUp"],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Combo",
                "ComboTrigger"
            ]
        }
    },
    "B334": {
        "code": "B334",
        "name": "Dragged into the Darkness",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter that has one or more Move tokens. The chosen fighter is <b>dealt<\/b> 1 damage if that damage would take the chosen fighter out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B364": {
        "code": "B364",
        "name": "Rocksnake Toxin",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Poison<\/b><br><b>Choose<\/b> one enemy fighter adjacent to one or more friendly fighters. The chosen fighter is <b>dealt<\/b> 1 damage at the end of each action phase. This effect <b>persists<\/b> until the chosen fighter is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Poison"
            ]
        }
    },
    "B371": {
        "code": "B371",
        "name": "Sudden Scarcity",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "The next time an opponent spends any glory points to give a fighter an upgrade, they must spend 1 additional glory point to do so. This effect <b>persists<\/b> until the end of the phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B375": {
        "code": "B375",
        "name": "Unnatural Truce",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Draw<\/b> up to two power cards. Each other player <b>draws<\/b> up to one power card.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Card Draw"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B376": {
        "code": "B376",
        "name": "Vicious Beast",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Place<\/b> the scatter token on a <b>lethal<\/b> hex, then do the following twice. <b>Scatter 1<\/b> from that hex: any fighter in the <b>end hex<\/b> is <b>dealt<\/b> 1 damage.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Scatter",
                "Lethal"
            ]
        }
    },
    "B378": {
        "code": "B378",
        "name": "Wildform",
        "faction": "Universal",
        "type": "Spell",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Spell:<\/b> This spell is <b>cast<\/b> if there are two or more of the same symbol in the casting roll. If this spell is <b>cast<\/b>, +1 Damage to the caster's Range 1 and Range 2 <b>Attack actions<\/b>, and they gain one or more of the following, corresponding to the symbols in the roll.<br><b>2+<\/b> <img src=\"img\/channel.png\" alt=\"Channel\"><span class=\"sr-only\">Channel<\/span> : +1 Move<br><b>2+<\/b> <img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span> : +1 Wounds<br><b>2+<\/b> <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> : +1 Defence<br>This spell <b>persists<\/b> until the caster is taken out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Mobility",
                "Move",
                "Survivability",
                "Wounds",
                "Defence"
            ],
            "supportCards": [
                "Spellcasting"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B384": {
        "code": "B384",
        "name": "Amberbone Spear",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If this <b>Attack action<\/b> takes an enemy fighter out of action, <b>discard<\/b> this card and gain 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon",
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "B388": {
        "code": "B388",
        "name": "Binding Chain",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<br>Combo<\/p> <div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": ["ComboFollowUp"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Combo",
                "ComboTrigger"
            ]
        }
    },
    "B393": {
        "code": "B393",
        "name": "Cryptic Companion",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Quarry<\/b>. If this fighter is a <b>Quarry<\/b> and is holding an objective at the end of an action phase, gain 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": ["Survivability", "Guard"],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B395": {
        "code": "B395",
        "name": "Finishing Blow",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 1  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> <b>Reaction:<\/b> After this fighter's successful <b>Attack action<\/b> with <b>Combo<\/b>, make this <b>Attack action<\/b>. It must target the same fighter. +2 Damage to this <b>Attack action<\/b> when made in this way.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Weapon"
            ],
            "supportCards": ["ComboTrigger"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Combo",
                "ComboFollowUp"
            ]
        }
    },
    "B402": {
        "code": "B402",
        "name": "Hunter's Caution",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is a <b>Hunter<\/b>. If this fighter is the target of a <b>Quarry's Attack action<\/b>, you can <b>re-roll<\/b> one dice in the defence roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Hunter",
                "Quarry"
            ]
        }
    },
    "B413": {
        "code": "B413",
        "name": "Mandibles of the Ur-grub",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Ur-grub Aspect<\/b><br><b>Reaction:<\/b> After this fighter's successful Range 1 <b>Attack action<\/b>, <b>Heal (1)<\/b> this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": ["Accuracy"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Ur-grub Aspect"
            ]
        }
    },
    "B420": {
        "code": "B420",
        "name": "Quintok's Combative Cantrip",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Lost Page<\/b><br><b>Spell Action (<img src=\"img\/focus.png\" alt=\"Focus\"><span class=\"sr-only\">Focus<\/span>):<\/b> If <b>cast<\/b>, <b>push<\/b> one adjacent enemy fighter up to 1 hex, then <b>give<\/b> the caster one Guard token, then <b>push<\/b> the caster up to 1 hex.<div><\/div>",
        "restrictedTo": "Wizard",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence",
                "Mobility",
                "Push",
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": ["Spellcasting"],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Guard",
                "Lost Page"
            ]
        }
    },
    "B432": {
        "code": "B432",
        "name": "Terrifying Aura",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter is not and cannot be a <b>Quarry<\/b>. In addition, opponents cannot <b>re-roll<\/b> dice in attack rolls for <b>Attack actions<\/b> that target this fighter.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Quarry"
            ]
        }
    },
    "B436": {
        "code": "B436",
        "name": "Victor's Speed",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "+1 Move<br><b>Reaction:<\/b> After a friendly fighter's <b>Attack action<\/b> that takes an enemy fighter out of action, if this card is in your hand, give this upgrade to that fighter. This does not cost any glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Hrothgorn's Mantrappers expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "----------Beastgrave Gift Pack expansion": "Beastgrave Gift Pack expansion",
    "G1": {
        "code": "G1",
        "name": "Bold Conquest",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge, Dual:<\/b> Score this immediately after an activation<br><i>If:<\/i> Your <b>leader<\/b> made a <b>Charge action<\/b> in that activation<br><i>And:<\/i> your <b>leader<\/b> is holding an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G2": {
        "code": "G2",
        "name": "Concerted Attack",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a third or subsequent friendly fighter makes an <b>Attack action<\/b> that targets the same enemy fighter in this phase.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G3": {
        "code": "G3",
        "name": "Cover Ground",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after a friendly fighter makes a <b>Move action<\/b> in which they enter 6 or more hexes.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Move"
            ],
            "rating": 2,
            "factionRatingOverride": {
                "Rippa's Snarlfangs": 3,
                "The Grymwatch": 4,
                "Skaeth's Wild Hunt": 4,
                "Lady Harrow's Mournflight": 3,
                "Spiteclaw's Swarm": 4
            },
            "tags": []
        }
    },
    "G4": {
        "code": "G4",
        "name": "Finders of the Way",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> There are three or more surviving friendly fighters<br><i>And:<\/i> Each surviving friendly fighter has one or more <b>Cursed Key<\/b> upgrades.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Cursed Key",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    },
    "G5": {
        "code": "G5",
        "name": "Guardians of the Way",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "<b>Dual:<\/b> Score this in an end phase<br><i>If:<\/i> Your warband holds one or more objectives<br><i>And:<\/i> No enemy warband holds any objectives.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective",
                "Mobility",
                "Enemy Displacement"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G6": {
        "code": "G6",
        "name": "Plant a Standard",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "1",
        "text": "Score this in an end phase if your <b>leader<\/b> is holding an objective in enemy territory.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility",
                "Survivability"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G7": {
        "code": "G7",
        "name": "Steadfast Defender",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "1",
        "text": "<b>Surge:<\/b> Score this immediately after an <b>Attack action<\/b> that targets a friendly fighter holding an objective, if that fighter is still holding that objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Survivability"
            ],
            "rating": 1,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G8": {
        "code": "G8",
        "name": "Tactical Genius 1-3",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if your warband holds objectives 1, 2 and 3.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G9": {
        "code": "G9",
        "name": "Tactical Genius 3-5",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "3",
        "text": "Score this in an end phase if your warband holds objectives 3, 4 and 5.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G10": {
        "code": "G10",
        "name": "Tactical Supremacy 1-2",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband holds objectives 1 and 2.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G11": {
        "code": "G11",
        "name": "Tactical Supremacy 3-4",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "End",
        "glory": "2",
        "text": "Score this in an end phase if your warband holds objectives 3 and 4.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G12": {
        "code": "G12",
        "name": "Victorious Duel",
        "faction": "Universal",
        "type": "Objective",
        "subtype": "Surge",
        "glory": "2",
        "text": "<b>Surge:<\/b> Score this immediately when your <b>leader's Attack action<\/b> takes an enemy <b>leader<\/b> out of action.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "supportCards": [
                "Offence",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G13": {
        "code": "G13",
        "name": "Daylight Robbery",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Roll one attack dice. On a roll of <img src=\"img\/hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> take 1 unspent glory point from one opponent.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G14": {
        "code": "G14",
        "name": "Distraction",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one enemy fighter and <b>push<\/b> them 1 hex.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Enemy Displacement"
            ],
            "supportCards": [],
            "rating": 5,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G15": {
        "code": "G15",
        "name": "Forward Planning",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter with no Charge tokens. <b>Give<\/b> that fighter one Charge token and one upgrade.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G16": {
        "code": "G16",
        "name": "Harnessed Power",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Heal (1)<\/b> each fighter that is holding an objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Survivability",
                "Healing"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": {
                "Ylthari's Guardians": 3
            },
            "tags": []
        }
    },
    "G17": {
        "code": "G17",
        "name": "Jealous Defence",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Choose<\/b> one friendly fighter with no Charge tokens holding an objective. The chosen fighter makes one <b>Attack action<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage"
            ],
            "supportCards": [
                "Objective Positioning",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": [
                "Free Action"
            ]
        }
    },
    "G18": {
        "code": "G18",
        "name": "Mischievous Spirits",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Starting with you and going clockwise, each player does the following: pick one objective that has not been moved with this ploy, and move that objective into an adjacent hex. Do this until each objective has been moved once.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Positioning"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "G19": {
        "code": "G19",
        "name": "Misdirection",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this when a friendly fighter is chosen by a ploy. <b>Choose<\/b> another friendly fighter that could be chosen by that ploy. That fighter is chosen instead.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Survivability"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "G20": {
        "code": "G20",
        "name": "No Time",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "Power cards cannot be played until after the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G21": {
        "code": "G21",
        "name": "Rebound",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> Play this during an enemy fighter's <b>Attack action<\/b>, after the defence roll, if that <b>Attack action<\/b> would succeed. Roll one defence dice. On a roll of <img src=\"img\/dodge.png\" alt=\"Dodge\"><span class=\"sr-only\">Dodge<\/span> or <img src=\"img\/critical-hit.png\" alt=\"Critical success\"><span class=\"sr-only\">Critical success<\/span> the attacker is <b>dealt<\/b> damage equal to the Damage characteristic of the <b>Attack action<\/b>, and the combat sequence ends.<div><span class=\"badge badge-info mr-1\"><i title=\"Restricted\" class=\"fas fa-lock\"><\/i> Restricted <i title=\"Championship\/Alliance\" class=\"fas fa-trophy\"><\/i><\/span><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Damage",
                "Survivability",
                "Defence"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Reaction",
                "Restricted"
            ]
        }
    },
    "G22": {
        "code": "G22",
        "name": "Spectral Wings",
        "faction": "Universal",
        "type": "Ploy",
        "subtype": "-",
        "glory": "-",
        "text": "+2 Move to the first fighter to make a <b>Move action<\/b> in the next activation.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Mobility",
                "Move"
            ],
            "supportCards": [],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G23": {
        "code": "G23",
        "name": "Grim Tenacity",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "This fighter cannot be <b>driven back<\/b>.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G24": {
        "code": "G24",
        "name": "Guardian Glaive",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<p class=\"text-center p-2 mb-2 text-white weapon\"><img src=\"img\/inv-hex.png\" alt=\"Hex\"> 2  <img src=\"img\/inv-hammer.png\" alt=\"Hammer\"><span class=\"sr-only\">Smash<\/span> 2  <img src=\"img\/inv-damage.png\" alt=\"Damage\"> 2<\/p> If this fighter is holding an objective, you can <b>re-roll<\/b> any number of attack dice in the attack roll.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Offence",
                "Weapon"
            ],
            "supportCards": [
                "Objective Positioning",
                "Mobility"
            ],
            "rating": 4,
            "factionRatingOverride": [],
            "tags": []
        }
    },
    "G25": {
        "code": "G25",
        "name": "Lender's Lockbox",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Reaction:<\/b> After this fighter is removed from the battlefield, pick one of their upgrades and return it to your hand.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Upgrades"
            ],
            "supportCards": [],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Reaction"
            ]
        }
    },
    "G26": {
        "code": "G26",
        "name": "Shardcaller",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "At the beginning of each action phase, you can pick one objective held by this fighter and one other objective, then <b>place<\/b> each objective you picked in the hex that contained the other objective.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Objective Positioning"
            ],
            "supportCards": [],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": ["Objective"]
        }
    },
    "G27": {
        "code": "G27",
        "name": "The Blazing Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cursed Key<\/b><br>If this fighter is holding objective 3 in the third end phase, gain 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    },
    "G28": {
        "code": "G28",
        "name": "The Dazzling Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cursed Key<\/b><br>If this fighter is holding objective 4 in the third end phase, gain 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    },
    "G29": {
        "code": "G29",
        "name": "The Formless Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cursed Key<\/b><br>If this fighter is holding an objective in the third end phase, gain 1 glory point.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 2,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    },
    "G30": {
        "code": "G30",
        "name": "The Fractured Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cursed Key<\/b><br>If this fighter is holding objective 5 in the third end phase, gain 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    },
    "G31": {
        "code": "G31",
        "name": "The Hallowed Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cursed Key<\/b><br>If this fighter is holding objective 1 in the third end phase, gain 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    },
    "G32": {
        "code": "G32",
        "name": "The Shadowed Key",
        "faction": "Universal",
        "type": "Upgrade",
        "subtype": "-",
        "glory": "-",
        "text": "<b>Cursed Key<\/b><br>If this fighter is holding objective 2 in the third end phase, gain 2 glory points.<div><\/div>",
        "restrictedTo": "-",
        "box": "Beastgrave Gift Pack expansion",
        "metadata": {
            "categories": [
                "Other",
                "Glory"
            ],
            "supportCards": [
                "Objective Positioning",
                "Objective Hold",
                "Mobility"
            ],
            "rating": 3,
            "factionRatingOverride": [],
            "tags": [
                "Cursed Key"
            ]
        }
    }
};
const icon = {
    surge: `<svg title="Surge" class="svg-inline--fa fa-bolt fa-w-10" aria-labelledby="svg-inline--fa-title-ib3v1xAKpe3O" data-prefix="fas" data-icon="bolt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><title id="svg-inline--fa-title-ib3v1xAKpe3O">Surge</title><path fill="currentColor" d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"></path></svg>`,
    end: '<svg title="An end phase" class="svg-inline--fa fa-clock fa-w-16" aria-labelledby="svg-inline--fa-title-8kJ7NxN7tFDP" data-prefix="fas" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><title id="svg-inline--fa-title-8kJ7NxN7tFDP">An end phase</title><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm57.1 350.1L224.9 294c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v137.7l63.5 46.2c5.4 3.9 6.5 11.4 2.6 16.8l-28.2 38.8c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>',
    third: '<svg title="Third end phase" class="svg-inline--fa fa-hourglass-end fa-w-12" aria-labelledby="svg-inline--fa-title-z5cXUcsdgyw2" data-prefix="fas" data-icon="hourglass-end" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><title id="svg-inline--fa-title-z5cXUcsdgyw2">Third end phase</title><path fill="currentColor" d="M360 64c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24 0 90.965 51.016 167.734 120.842 192C75.016 280.266 24 357.035 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24 0-90.965-51.016-167.734-120.842-192C308.984 231.734 360 154.965 360 64zM192 208c-57.787 0-104-66.518-104-144h208c0 77.945-46.51 144-104 144z"></path></svg>',
    Offence: '<img src="img/inv-hammer.png" alt="Hammer">',
    Survivability: '<img src="img/shield.png" alt="Block">',
    Mobility: '<img src="img/inv-hex.png" alt="Hex">',
    Ploy: '<i title="Ploy" class="ra ra-sword"></i>',
    Spell: '<i title="Spell" class="ra ra-doubled"></i>',
    Restricted: '<svg title="Restricted" class="svg-inline--fa fa-lock fa-w-14 text-info" aria-labelledby="svg-inline--fa-title-VZcYqiJ4vLak" data-prefix="fas" data-icon="lock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><title id="svg-inline--fa-title-VZcYqiJ4vLak">Restricted</title><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>',
};
const faction = {
    "Universal": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="Core set" alt="Core set" src="img/universal-icon.png">',
    },
    "Garrek's Reavers": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="Garrek\'s Reavers expansion" alt="Garrek\'s Reavers expansion" src="img/garreks-reavers-icon.png">',
    },
    "Steelheart's Champions": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="Steelheart\'s Champions expansion" alt="Steelheart\'s Champions expansion" src="img/steelhearts-champions-icon.png">',
    },
    "Sepulchral Guard": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/sepulchral-guard-icon.png">',
    },
    "Ironskull's Boyz": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/ironskulls-boyz-icon.png">',
    },
    "The Chosen Axes": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Chosen Axes expansion" alt="The Chosen Axes expansion" src="img/the-chosen-axes-icon.png">',
    },
    "Spiteclaw's Swarm": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="Spiteclaw\'s Swarm expansion" alt="Spiteclaw\'s Swarm expansion" src="img/spiteclaws-swarm-icon.png">',
    },
    "Magore's Fiends": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/magores-fiends-icon.png">',
    },
    "The Farstriders": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/the-farstriders-icon.png">',
    },
    "Stormsire's Cursebreakers": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/stormsires-cursebreakers-icon.png">',
    },
    "Thorns of the Briar Queen": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/thorns-of-the-briar-queen-icon.png">',
    },
    "The Eyes of the Nine": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="The Eyes of the Nine expansion" alt="The Eyes of the Nine expansion" src="img/the-eyes-of-the-nine-icon.png">',
    },
    "Zarbag's Gitz": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="Zarbag\'s Gitz expansion" alt="Zarbag\'s Gitz expansion" src="img/zarbags-gitz-icon.png">',
    },
    "Godsworn Hunt": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="Godsworn Hunt expansion" alt="Godsworn Hunt expansion" src="img/godsworn-hunt-icon.png">',
    },
    "Mollog's Mob": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="Mollog\'s Mob expansion" alt="Mollog\'s Mob expansion" src="img/mollogs-mob-icon.png">',
    },
    "Thundrik's Profiteers": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="Thundrik\'s Profiteers expansion" alt="Thundrik\'s Profiteers expansion" src="img/thundriks-profiteers-icon.png">',
    },
    "Ylthari's Guardians": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="Ylthari\'s Guardians expansion" alt="Ylthari\'s Guardians expansion" src="img/yltharis-guardians-icon.png">',
    },
    "Ironsoul's Condemners": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/ironsouls-condemners-icon.png">',
    },
    "Lady Harrow's Mournflight": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/lady-harrows-mournflight-icon.png">',
    },
    "Grashrak's Despoilers": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/grashraks-despoilers-icon.png">',
    },
    "Skaeth's Wild Hunt": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/skaeths-wild-hunt-icon.png">',
    },
    "The Grymwatch": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/the-grymwatch-icon.png">',
    },
    "Rippa's Snarlfangs": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="The Grymwatch expansion" alt="The Grymwatch expansion" src="img/rippas-snarlfangs-icon.png">',
    },
    "Hrothgorn's Mantrappers": {
        haveSpellcasting: false,
        icon: '<img class="whuicon" title="Hrothgorn\'s Mantrappers expansion" alt="Hrothgorn\'s Mantrappers expansion" src="img/hrothgorns-mantrappers-icon.png">',
    },
    "The Wurmspat": {
        haveSpellcasting: true,
        icon: '<img class="whuicon" title="The Wurmspat expansion" alt="The Wurmspat expansion" src="img/the-wurmspat-icon.png">',
    },
};

let deck = {},
    deckStats = {},
    isHomepage = window.location.toString() === 'https://www.underworldsdb.com/' || window.location.toString() === 'https://www.underworldsdb.com/#';

(function() {
    'use strict';

    let codes = getCodes();
    deck = loadDeck(codes);
    deckStats = calculateDeckStats(deck);
    // console.log('Deck:');
    // console.log(deck);
    // console.log(deckStats);

    let container = $('<div id="advanced-deckstats" class="row mt-3"></div>');
    drawDeck(deck, container);
    container.insertAfter($('#deckstats'));
    $('.card-line').click(highlightSupport);
    $('.recommendations-toggle').click(toggleElement);
    bootstrapExtend();
})();

function calculateDeckStats(deck) {
    // deckStats.scores = getScores(deck);

    deckStats.considerReplacing = loadDeck(getConsiderReplacing(deck), false);
    deckStats.possibleInclusions = loadDeck(getPossibleInclusions(deck), false);
    calculateSupports(deckStats.possibleInclusions, deck.cardsByCode);
    return deckStats;
}

function getPossibleInclusions(deck) {
    let result = [],
        rating
    ;
    for (let [code, card] of Object.entries(database)) {
        if (typeof card !== 'object'
            || card.metadata.redirect !== undefined
            || card.faction !== deck.faction && card.faction !== 'Universal'
            || !faction[deck.faction].haveSpellcasting && (card.type === 'Spell' || (card.type !== 'Objective' && card.metadata.categories.includes('Spellcasting')) || card.metadata.tags.includes('Spellcasting'))
        ) {
            continue;
        }
        rating = getCardRating(card, deck.faction);
        if (rating < 3 || rating < 4 && card.type !== 'Objective') continue;
        if ((rating >= 4
            || (rating < 4 && getSupportCards(card, deck.cardsByCode).length > 1)
            || (rating < 4 && getSupportedCards(card, deck.cardsByCode).length > 1)
            )
            && deck.cardsByCode[code] === undefined
        ) {
            result.push(card.code);
        }
    }
    return result;
}
function getConsiderReplacing(deck) {
    let result = [], rating;
    for (let [code, card] of Object.entries(deck.cardsByCode)) {
        rating = getCardRating(card, deck.faction);
        if (rating < 2
            || (card.type === 'Objective' && rating < 3 && (deck.supportedBy[code] === undefined || deck.supportedBy[code].length < 2))
            || (card.type !== 'Objective' && rating < 3 && (deck.supports[code] === undefined || deck.supports[code].length < 2))
        ) {
            result.push(card.code);
        }
    }
    return result;
}

function getCardRating(card, faction) {
    return card.metadata.factionRatingOverride[faction] !== undefined
        ? card.metadata.factionRatingOverride[faction]
        : card.metadata.rating;
}

function drawDeck(deck, container) {
    let suggestions = '',
        recommendationsVisible = localStorage.getItem('recommendationsVisible') ? '' : 'style="display: none;"';
    if (deckStats.considerReplacing.count.objectives > 0) {
        suggestions = `
            <hr/>
            <h5>Consider Replacing (${deckStats.considerReplacing.count.objectives})</h5>
            ${printTable(deckStats.considerReplacing.objectives, ['surge', 'end', 'third'], null, -1)}`;
    }
    if (deckStats.possibleInclusions.count.objectives > 0) {
        suggestions += `
            <hr/>
            <h5>Consider Including (${deckStats.possibleInclusions.count.objectives})</h5>
            ${printTable(deckStats.possibleInclusions.objectives, ['surge', 'end', 'third'], deckStats.possibleInclusions, 1)}`;
    }
    let html = `
<div class="col-lg">
    <h5>Objectives (glory) [supported by]</h5>
    ${printTable(deck.objectives, ['surge', 'end', 'third'], deck, -1)}
    <hr/>
    <h5 class="recommendations-toggle" data-class=".recommendations" style="cursor: pointer">Recommendations [show/hide]</h5>
    <div class="recommendations" ${recommendationsVisible}>
        ${suggestions}
    </div>
</div>`;
    suggestions = '';
    if (deckStats.considerReplacing.count.gambits > 0) {
        suggestions = `
            <hr/>
            <h5>Consider Replacing (${deckStats.considerReplacing.count.gambits})</h5>
            ${printTable(deckStats.considerReplacing.gambits, ['Offence', 'Survivability', 'Mobility', 'Other'], null, -1)}`;
    }
    if (deckStats.possibleInclusions.count.gambits > 0) {
        suggestions += `
            <hr/>
            <h5>Consider Including (${deckStats.possibleInclusions.count.gambits})</h5>
            ${printTable(deckStats.possibleInclusions.gambits, ['Offence', 'Survivability', 'Mobility', 'Other'], null, 1)}`;
    }
    html += `
<div class="col-lg">
    <h5>Gambits [supports]</h5>
    ${printTable(deck.gambits, ['Offence', 'Survivability', 'Mobility', 'Other'], deck, -1)}
    <hr/>
    <h5 class="recommendations-toggle" data-class=".recommendations" style="cursor: pointer">Recommendations [show/hide]</h5>
    <div class="recommendations" ${recommendationsVisible}>
        ${suggestions}
    </div>
</div>`;
    suggestions = '';
    if (deckStats.considerReplacing.count.upgrades > 0) {
        suggestions = `
            <hr/>
            <h5>Consider Replacing (${deckStats.considerReplacing.count.upgrades})</h5>
            ${printTable(deckStats.considerReplacing.upgrades, ['Offence', 'Survivability', 'Mobility', 'Other'], null, -1)}`;
    }
    if (deckStats.possibleInclusions.count.upgrades > 0) {
        suggestions += `
            <hr/>
            <h5>Consider Including (${deckStats.possibleInclusions.count.upgrades})</h5>
            ${printTable(deckStats.possibleInclusions.upgrades, ['Offence', 'Survivability', 'Mobility', 'Other'], null, 1)}`;
    }
    html += `
<div class="col-lg">
    <h5>Upgrades [supports]</h5>
    ${printTable(deck.upgrades, ['Offence', 'Survivability', 'Mobility', 'Other'], deck, -1)}
    <hr/>
    <h5 class="recommendations-toggle" data-class=".recommendations" style="cursor: pointer">Recommendations [show/hide]</h5>
    <div class="recommendations" ${recommendationsVisible}>
        ${suggestions}
    </div>
</div>`;
    container.html(html);
}

function printTable(cardsByType, orderedCategories, deck = null, displayButtons = 0) {
    let table = '<table cellspacing="0" border="1">', type, iconString, first = true;
    for (let i = 0; i < orderedCategories.length; i++) {
        type = orderedCategories[i];
        if (cardsByType[type] === undefined) {
            continue;
        }
        first = true;
        for (let [subcat, cards] of Object.entries(cardsByType[type])) {

            table += `<tr${first ? ' style="border-top: 2px solid;"' : ''}>`;
            if (first) {
                iconString = icon[type] === undefined ? '' : icon[type];
                table += `<th rowspan="${Object.keys(cardsByType[type]).length}">${iconString}</th>`;
                first = false;
            }
            table += `<th class="subcategory">${subcat}</th>`;
            table += `<td class="grow">`;
            for (let i = 0; i < cards.length; i++) {
                table += printCard(cards[i], deck, displayButtons);
            }
            table += `</td>`;
            table += `</tr>`;
        }
    }
    table += '</table>';
    return table;
}

function printCard(card, deck = null, displayButton = 0) {
    let bonusInfo = '', support = '', button = '', side, imgName, exp, expansionMap = {
        '': 'shadespire',
        'L': 'leaders',
        'N': 'nightvault',
        'P': 'power unbound',
        'D': 'dreadfane',
        'B': 'beastgrave',
        'G': 'beastgrave gift pack',
    };
    exp = expansionMap[card.code.match(/([A-Z]?)/g)[0]];
    imgName = card.name.replace(/[^\w\s-]/g, '').replace(/\s/g, '-');
    switch (card.type) {
        case 'Objective':
            bonusInfo = `(${card.glory})`;
            side = 'supportedBy';
            break;
        case 'Ploy':
        case 'Spell':
            bonusInfo = `${icon[card.type]}`;
            side = 'supports';
            break;
        case 'Upgrade':
            side = 'supports';
            break;
    }
    if (deck !== null) {
        support = `[${deck[side][card.code] === undefined ? 0 : deck[side][card.code].length}]`;
    }
    if (isHomepage) {
        if (displayButton > 0) {
            button = getAddButton(card);
        }
        if (displayButton < 0) {
            button = getRemoveButton(card);
        }
    }
    return `
        <div class="card-line ${card.code}" data-code="${card.code}">
            ${button}
            ${faction[card.faction].icon} 
            <a class="my-link" 
                href="javascript:;"
                data-toggle="popover" 
                data-trigger="focus" 
                data-html="true" 
                data-content="<img class='img-fluid' src='cards/${exp}/${imgName}.png'>"
                data-original-title="${card.name}"
            >
                ${card.name}
            </a>
            ${bonusInfo} 
            ${card.metadata.tags.includes('Restricted') ? icon.Restricted : ''}
            ${support}
        </div>`;
}

function getAddButton(card) {
    return `
    <a type="button" 
        class="deckbuilder btn btn-success btn-xs" 
        title="Add to deck editor" 
        tabindex="0" 
        data-card="${card.code}" 
        data-name="${card.name}"
    >+</a>`;
}
function getRemoveButton(card) {
    return `
    <a type="button" 
        class="deckeditor btn btn-danger btn-xs" 
        title="Remove from deck editor" 
        tabindex="0" 
        data-card="${card.code}" 
        data-name="${card.name}"
    >-</a>`;
}

function highlightSupport() {
    let el = $(this);
    let code = el.data('code');
    let selector, codes = [];

    $('.card-line.select, .card-line.highlight').removeClass('select').removeClass('highlight');
    el = $(`.card-line.${code}`);
    el.addClass('select');

    if (deck.supportedBy[code] !== undefined) {
        codes = deck.supportedBy[code];
    }
    if (deckStats.possibleInclusions.supportedBy[code] !== undefined) {
        codes = [...codes, ...deckStats.possibleInclusions.supportedBy[code]];
    }
    if (codes.length > 0) {
        selector = '.card-line.' + codes.join(', .card-line.');
        $(selector).addClass('highlight');
    }
    if (deck.supports[code] !== undefined) {
        selector = '.card-line.' + deck.supports[code].join(', .card-line.');
        $(selector).addClass('highlight');
    }
}

function removeEmptyCategories(deck) {
    for (let [cardType, categories] of Object.entries(deck)) {
        if (!['objectives', 'gambits', 'upgrades'].includes(cardType)) continue;
        for (let [category, subcategories] of Object.entries(categories)) {
            for (let [subcategory, cards] of Object.entries(subcategories)) {
                if (cards.length === 0) {
                    delete subcategories[subcategory];
                }
            }
            if (Object.keys(categories[category]).length === 0) {
                delete categories[category];
            }
        }
    }
}

function getCodes() {
    if (isHomepage) {
        return refreshdecklist().toUpperCase().split(',');
    } else {
        return parseURL(window.location).params.deck.toUpperCase().split(',');
    }
}

function loadDeck(codes, mustCalculateSupports = true) {
    let deck = {
        faction: 'Universal',
        objectives: {
            surge: {
                Easy: [],
                Reliable: [],
                Unreliable: [],
                'Very Unreliable': [],
                Trash: []
            },
            end: {
                Easy: [],
                Reliable: [],
                Unreliable: [],
                'Very Unreliable': [],
                Trash: []
            },
            third: {
                Easy: [],
                Reliable: [],
                Unreliable: [],
                'Very Unreliable': [],
                Trash: []
            },
        },
        gambits: {},
        upgrades: {},
        cardsByCode: {},
        supportedBy: {},
        supports: {},
        count: {
            objectives: 0,
            gambits: 0,
            upgrades: 0,
        },
    };
    const ratingMap = ['Trash', 'Trash', 'Very Unreliable', 'Unreliable', 'Reliable', 'Easy'];
    const subcategoryMap = {
        Accuracy: 'Offence',
        Damage: 'Offence',
        Weapon: 'Offence',
        Range: 'Offence',
        Defence: 'Survivability',
        Wounds: 'Survivability',
        Healing: 'Survivability',
        Move: 'Mobility',
        Push: 'Mobility',
        Place: 'Mobility',
    };

    let card, rating, cat, cats, subcats, path, prevCat, type, categoryMap;
    // find faction
    for (let i = 0; i < codes.length; i++) {
        if (codes[i] === '0') {
            continue;
        }
        card = database[codes[i].toUpperCase()];
        if (card === undefined) {
            console.log(`Unrecognized code: ${codes[i]}`);
            continue;
        }
        if (card.redirect !== undefined) {
            card = database[card.redirect];
        }
        if (card.faction !== 'Universal') {
            deck.faction = card.faction;
            break;
        }
    }

    // categorize cards
    for (let i = 0; i < codes.length; i++) {
        if (codes[i] === '0') {
            continue;
        }
        card = database[codes[i].toUpperCase()];
        if (card === undefined) {
            console.log(`Unrecognized code: ${codes[i]}`);
            continue;
        }
        if (card.metadata.redirect !== undefined) {
            card = database[card.metadata.redirect];
        }

        deck.cardsByCode[card.code] = card;

        if (card.type === 'Objective') {
            rating = ratingMap[getCardRating(card, deck.faction)];
            deck.objectives[card.subtype.toLowerCase()][rating].push(card);
            deck.count.objectives++;
        } else {
            type = card.type === 'Upgrade' ? 'upgrades' : 'gambits';
            categoryMap = getCategoryMap();
            cats = Object.keys(categoryMap);
            subcats = Object.keys(subcategoryMap);
            path = [];
            for (let k = 0; k < card.metadata.categories.length; k++) {
                cat = card.metadata.categories[k];
                if (cats.includes(cat)) {
                    addToDeck(deck, type, path, card);
                    path = [cat];
                } else if (subcats.includes(cat)) {
                    if (path.length === 0) {
                        path = [subcategoryMap[cat], cat];
                    } else if (path.length === 1) {
                        prevCat = path[0];
                        if (prevCat === subcategoryMap[cat]) {
                            path.push(cat); // completed category path
                        }
                    }
                    addToDeck(deck, type, path, card);
                    path = [];
                } else { // other subcategories
                    if (path.length === 0) {
                        path = ['Other', cat];
                    } else if (path.length === 1) {
                        path.push(cat); // completed category path
                    }
                    addToDeck(deck, type, path, card);
                    path = [];
                }
            }
            addToDeck(deck, type, path, card);
            deck.count[type]++;
        }
    }

    // supportedBy
    if (mustCalculateSupports) {
        calculateSupports(deck, deck.cardsByCode);
    }

    removeEmptyCategories(deck);
    return deck;
}

function calculateSupports(deck, db) {
    let supportCards;
    for (let [code, card] of Object.entries(deck.cardsByCode)) {
        supportCards = getSupportCards(card, db);
        if (supportCards.length > 0) {
            deck.supportedBy[code] = supportCards;
        }
        for (let i = 0; i < supportCards.length; i++) {
            if (deck.supports[supportCards[i]] === undefined) {
                deck.supports[supportCards[i]] = [];
            }
            deck.supports[supportCards[i]].push(code);
        }
    }
}

function getSupportCards(card, db) {
    let result = [], terms;
    for (let i = 0; i < card.metadata.supportCards.length; i++) {
        terms = card.metadata.supportCards[i];
        result = result.concat(searchCards(db, terms));
    }
    return [...new Set(result)];
}
function getSupportedCards(card, db) {
    let result = [], terms, tmpdb = {};
    tmpdb[card.code] = card;
    for (let [code, dbcard] of Object.entries(db)) {
        if (getSupportCards(dbcard, tmpdb).length > 0) {
            result.push(dbcard.code);
        }
    }
    return [...new Set(result)];
}

function searchCards(db, terms, skipObjectives = true) {
    let result = [],
        matchRequirement = 1, matchCount = 0, term
    ;

    if (!Array.isArray(term)) {
        terms = [terms];
    }
    matchRequirement = terms.length;
    for (let [code, card] of Object.entries(db)) {
        if (skipObjectives && card.type === 'Objective') continue;
        matchCount = 0;
        for (let i = 0; i < matchRequirement; i++) {
            term = terms[i];
             if (card.name === term) {
                 matchCount++;
                 continue;
             }
             if (card.type === term) {
                 matchCount++;
                 continue;
             }
             if (card.metadata.categories !== undefined && card.metadata.categories.includes(term)) {
                 matchCount++;
                 continue;
             }
             if (card.metadata.tags.includes(term)) {
                 matchCount++;
                 continue;
             }
        }
        if (matchCount === matchRequirement) {
            result.push(code);
        }
    }

    return result;
}

function addToDeck(deck, type, path, card) {
    if (path.length === 0) return deck;
    if (path.length === 1) {
        path.push('Uncategorized');
    }

    if (deck[type][path[0]] === undefined) {
        deck[type][path[0]] = {};
    }
    if (deck[type][path[0]][path[1]] === undefined) {
        deck[type][path[0]][path[1]] = [];
    }
    deck[type][path[0]][path[1]].push(card);
    return deck;
}

function getCategoryMap() {
    return {
        Offence: {
            Accuracy: [],
            Damage: [],
            Weapon: [],
            Uncategorized: [],
        },
        Survivability: {
            Defence: [],
            Healing: [],
            Wounds: [],
            Uncategorized: [],
        },
        Mobility: {
            Push: [],
            Move: [],
            Place: [],
            Uncategorized: [],
        },
        Other: {},
    };
}

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

function toggleElement() {
    const el = $(this);
    $(el.data('class')).toggle();
    localStorage.setItem('recommendationsVisible', el.is(':visible'));
}

function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

const originalSetItem = localStorage.setItem;
let lastDecklist = '';
localStorage.setItem = function() {
    originalSetItem.apply(this, arguments);
    // console.log(arguments);

    if (arguments[0] === 'decklist' && lastDecklist !== arguments[1]) {
        lastDecklist = arguments[1];
        let event = document.createEvent('Event');
        event.initEvent('itemInserted', true, true);
        event.arguments = arguments;
     
        document.dispatchEvent(event);
    }
};

document.addEventListener('itemInserted', function (e) {
    console.log('itemInserted');
    deck = loadDeck(getCodes());
    deckStats = calculateDeckStats(deck);
    drawDeck(deck, $('#advanced-deckstats'));
    $('.card-line').click(highlightSupport);
    $('.recommendations-toggle').click(toggleElement);
    deckbuilder();
}, false);