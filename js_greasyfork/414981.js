// ==UserScript==
// @name         Silver Subscription - Sets of 10 Button
// @namespace    games.dominion.script
// @version      0.7
// @description  Dominion Games Silver Subscription - Add Sets of 10 it the lobby page (table creation)
// @author       barmkin
// @match        https://dominion.games/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414981/Silver%20Subscription%20-%20Sets%20of%2010%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/414981/Silver%20Subscription%20-%20Sets%20of%2010%20Button.meta.js
// ==/UserScript==

/* --- Changelog 0.7 ---
  Add multilanguages support
*/
/* ------------------------------------------------------------------------------- */
/* --- Cards Sets ---------------------------------------------------------------- */
// You can edit this section, see README
var cardsSets = [
    /* Dominion + Silver Sub */
    {
        'name': 'Dominion Only',
        'img': ['images/elements/base-small-white.png'],
        'sets':
        [
            {'First Game': [
                'Cellar', 'Market', 'Merchant', 'Militia', 'Mine',
                'Moat', 'Remodel', 'Smithy', 'Village', 'Workshop'
            ]},
            {'Size Distortion': [
                'Artisan', 'Bandit', 'Bureaucrat', 'Chapel', 'Festival',
                'Gardens', 'Sentry', 'Throne Room', 'Witch', 'Workshop'
            ]},
            {'Deck Top': [
                'Artisan', 'Bureaucrat', 'Council Room', 'Festival', 'Harbinger',
                'Laboratory', 'Moneylender', 'Sentry', 'Vassal', 'Village'
            ]},
            {'Sleight of Hand': [
                'Cellar', 'Council Room', 'Festival', 'Gardens', 'Library',
                'Harbinger', 'Militia', 'Poacher', 'Smithy', 'Throne Room'
            ]},
            {'Improvements': [
                'Artisan', 'Cellar', 'Market', 'Merchant', 'Mine',
                'Moat', 'Moneylender', 'Poacher', 'Remodel', 'Witch'
            ]},
            {'Silver \& Gold': [
                'Bandit', 'Bureaucrat', 'Chapel', 'Harbinger', 'Laboratory',
                'Merchant', 'Mine', 'Moneylender', 'Throne Room', 'Vassal'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Intrigue',
        'img': ['images/elements/base-small-white.png', 'images/elements/intrigue-small-white.png'],
        'sets':
        [
            {'Underlings': [
                'Cellar', 'Festival', 'Library', 'Sentry', 'Vassal',
                'Courtier', 'Diplomat', 'Minion', 'Nobles', 'Pawn'
            ]},
            {'Grand Scheme': [
                'Artisan', 'Council Room', 'Market', 'Militia', 'Workshop',
                'Bridge', 'Mill', 'Mining Village', 'Patrol', 'Shanty Town'
            ]},
            {'Deconstruction': [
                'Bandit', 'Mine', 'Remodel', 'Throne Room', 'Village',
                'Diplomat', 'Harem', 'Lurker', 'Replace', 'Swindler'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Seaside',
        'img': ['images/elements/base-small-white.png', 'images/elements/seaside-small-white.png'],
        'sets':
        [
            {'Reach for Tomorrow': [
                'Artisan', 'Cellar', 'Council Room', 'Vassal', 'Village',
                'Cutpurse', 'Ghost Ship', 'Lookout', 'Sea Hag', 'Treasure Map'
            ]},
            {'Repetition': [
                'Festival', 'Harbinger', 'Militia', 'Workshop', 'Caravan',
                'Explorer', 'Outpost', 'Pearl Diver', 'Pirate Ship', 'Treasury'
            ]},
            {'Give and Take': [
                'Library', 'Market', 'Moneylender', 'Witch', 'Ambassador',
                'Fishing Village', 'Haven', 'Island', 'Salvager', 'Smugglers'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Prosperity',
        'img': ['images/elements/base-small-white.png', 'images/elements/prosperity-small-white.png'],
        'sets':
        [
            {'Biggest Money': [
                'Artisan', 'Harbinger', 'Laboratory', 'Mine', 'Moneylender',
                'Bank', 'Grand Market', 'Mint', 'Royal Seal', 'Venture'
            ]},
            {'The King\'s Army': [
                'Bureaucrat', 'Council Room', 'Merchant', 'Moat', 'Village',
                'Expand', 'Goons', 'King\'s Court', 'Rabble', 'Vault'
            ]},
            {'The Good Life': [
                'Artisan', 'Bureaucrat', 'Cellar', 'Gardens', 'Village',
                'Contraband', 'Counting House', 'Hoard', 'Monument', 'Mountebank'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Cornucopia',
        'img': ['images/elements/base-small-white.png', 'images/elements/cornucopia-small-white.png'],
        'sets':
        [
            {'Bounty of the Hunt': [
                'Cellar', 'Festival', 'Militia', 'Moneylender', 'Smithy',
                'Harvest', 'Horn of Plenty', 'Hunting Party', 'Menagerie', 'Tournament'
            ]},
            {'Bad Omens': [
                'Bureaucrat', 'Laboratory', 'Merchant', 'Poacher', 'Throne Room',
                'Fortune Teller', 'Hamlet', 'Horn of Plenty', 'Jester', 'Remake'
            ]},
            {'The Jester\'s Workshop': [
                'Artisan', 'Laboratory', 'Market', 'Remodel', 'Workshop',
                'Fairgrounds', 'Farming Village', 'Horse Traders', 'Jester', 'Young Witch'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Hinterlands',
        'img': ['images/elements/base-small-white.png', 'images/elements/hinterlands-small-white.png'],
        'sets':
        [
            {'Highway Robbery': [
                'Cellar', 'Library', 'Moneylender', 'Throne Room', 'Workshop',
                'Highway', 'Inn', 'Margrave', 'Noble Brigand', 'Oasis'
            ]},
            {'Adventures Abroad': [
                'Festival', 'Laboratory', 'Remodel', 'Sentry', 'Vassal',
                'Crossroads', 'Farmland', 'Fool\'s Gold', 'Oracle', 'Spice Merchant'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Guilds',
        'img': ['images/elements/base-small-white.png', 'images/elements/guilds-small-white.png'],
        'sets':
        [
            {'Arts and Crafts': [
                'Laboratory', 'Cellar', 'Workshop', 'Festival', 'Moneylender',
                'Stonemason', 'Advisor', 'Baker', 'Journeyman', 'Merchant Guild'
            ]},
            {'Clean Living': [
                'Bandit', 'Militia', 'Moneylender', 'Gardens', 'Village',
                'Butcher', 'Baker', 'Candlestick Maker', 'Doctor', 'Soothsayer'
            ]},
            {'Gilding the Lily': [
                'Library', 'Merchant', 'Remodel', 'Market', 'Sentry',
                'Plaza', 'Masterpiece', 'Candlestick Maker', 'Taxman', 'Herald'
            ]}
        ]
    },

    /* Intrigue  + Silver Sub */
    {
        'name': 'Intrigue Only',
        'img': ['images/elements/intrigue-small-white.png'],
        'sets':
        [
            {'Victory Dance': [
                'Baron', 'Courtier', 'Duke', 'Harem', 'Ironworks',
                'Masquerade', 'Mill', 'Nobles', 'Patrol', 'Replace'
            ]},
            {'The Plot Thickens': [
                'Conspirator', 'Ironworks', 'Lurker', 'Pawn', 'Mining Village',
                'Secret Passage', 'Steward', 'Swindler', 'Torturer', 'Trading Post'
            ]},
            {'Best Wishes': [
                'Baron', 'Conspirator', 'Courtyard', 'Diplomat', 'Duke',
                'Secret Passage', 'Shanty Town', 'Torturer', 'Upgrade', 'Wishing Well'
            ]}
        ]
    },
    {
        'name': 'Intrigue \& Seaside',
        'img': ['images/elements/intrigue-small-white.png', 'images/elements/seaside-small-white.png'],
        'sets':
        [
            {'A Star to Steer By': [
                'Secret Passage', 'Diplomat', 'Swindler', 'Wishing Well', 'Courtier',
                'Lookout', 'Treasure Map', 'Ghost Ship', 'Haven', 'Outpost'
            ]},
            {'Shore Patrol': [
                'Patrol', 'Replace', 'Shanty Town', 'Trading Post', 'Pawn',
                'Island', 'Wharf', 'Cutpurse', 'Lighthouse', 'Warehouse'
            ]},
            {'Bridge Crossing': [
                'Lurker', 'Nobles', 'Duke', 'Conspirator', 'Bridge',
                'Salvager', 'Embargo', 'Smugglers', 'Native Village', 'Treasury'
            ]}
        ]
    },
    {
        'name': 'Intrigue \& Prosperity',
        'img': ['images/elements/intrigue-small-white.png', 'images/elements/prosperity-small-white.png'],
        'sets':
        [
            {'Paths to Victory': [
                'Bishop', 'Counting House', 'Goons', 'Monument', 'Peddler',
                'Baron', 'Harem', 'Pawn', 'Shanty Town', 'Upgrade'
            ]},
            {'All Along the Watchtower': [
                'Hoard', 'Talisman', 'Trade Route', 'Vault', 'Watchtower',
                'Bridge', 'Mill', 'Mining Village', 'Pawn', 'Torturer'
            ]},
            {'Lucky Seven': [
                'Bank', 'Expand', 'Forge', 'King\'s Court', 'Vault',
                'Bridge', 'Lurker', 'Patrol', 'Swindler', 'Wishing Well'
            ]}
        ]
    },
    {
        'name': 'Intrigue \& Cornucopia',
        'img': ['images/elements/intrigue-small-white.png', 'images/elements/cornucopia-small-white.png'],
        'sets':
        [
            {'Last Laughs': [
                'Farming Village', 'Harvest', 'Horse Traders', 'Hunting Party', 'Jester',
                'Minion', 'Nobles', 'Pawn', 'Steward', 'Swindler'
            ]},
            {'The Spice of Life': [
                'Fairgrounds', 'Horn of Plenty', 'Remake', 'Tournament', 'Young Witch',
                'Courtier', 'Courtyard', 'Diplomat', 'Mining Village', 'Replace'
            ]},
            {'Small Victories': [
                'Fortune Teller', 'Hamlet', 'Hunting Party', 'Remake', 'Tournament',
                'Conspirator', 'Duke', 'Harem', 'Pawn', 'Secret Passage'
            ]}
        ]
    },
    {
        'name': 'Intrigue \& Hinterlands',
        'img': ['images/elements/intrigue-small-white.png', 'images/elements/hinterlands-small-white.png'],
        'sets':
        [
            {'Money for Nothing': [
                'Replace', 'Patrol', 'Pawn', 'Shanty Town', 'Torturer',
                'Cache', 'Cartographer', 'Jack of all Trades', 'Silk Road', 'Tunnel'
            ]},
            {'The Duke\'s Ball': [
                'Conspirator', 'Duke', 'Harem', 'Masquerade', 'Upgrade',
                'Duchess', 'Haggler', 'Inn', 'Noble Brigand', 'Scheme'
            ]}
        ]
    },
    {
        'name': 'Intrigue \& Guilds',
        'img': ['images/elements/intrigue-small-white.png', 'images/elements/guilds-small-white.png'],
        'sets':
        [
            {'Name That Card': [
                'Baker', 'Doctor', 'Plaza', 'Advisor', 'Masterpiece',
                'Courtyard', 'Harem', 'Nobles', 'Replace', 'Wishing Well'
            ]},
            {'Tricks of the Trade': [
                'Stonemason', 'Herald', 'Soothsayer', 'Journeyman', 'Butcher',
                'Conspirator', 'Masquerade', 'Mill', 'Nobles', 'Secret Passage'
            ]},
            {'Decisions, Decisions': [
                'Merchant Guild', 'Candlestick Maker', 'Masterpiece', 'Taxman', 'Butcher',
                'Bridge', 'Pawn', 'Mining Village', 'Upgrade', 'Duke'
            ]}
        ]
    },

    /* Seaside + Silver Sub */
    {
        'name': 'Seaside Only',
        'img': ['images/elements/seaside-small-white.png'],
        'sets':
        [
            {'High Seas': [
                'Bazaar', 'Caravan', 'Embargo', 'Explorer', 'Haven',
                'Island', 'Lookout', 'Pirate Ship', 'Smugglers', 'Wharf'
            ]},
            {'Buried Treasure': [
                'Ambassador', 'Cutpurse', 'Fishing Village', 'Lighthouse', 'Outpost',
                'Pearl Diver', 'Tactician', 'Treasure Map', 'Warehouse', 'Wharf'
            ]},
            {'Shipwrecks': [
                'Ghost Ship', 'Merchant Ship', 'Native Village', 'Navigator', 'Pearl Diver',
                'Salvager', 'Sea Hag', 'Smugglers', 'Treasury', 'Warehouse'
            ]}
        ]
    },
    {
        'name': 'Seaside \& Prosperity',
        'img': ['images/elements/seaside-small-white.png', 'images/elements/prosperity-small-white.png'],
        'sets':
        [
            {'Exploding Kingdom': [
                'Bishop', 'City', 'Grand Market', 'King\'s Court', 'Quarry',
                'Fishing Village', 'Lookout', 'Outpost', 'Tactician', 'Wharf'
            ]},
            {'Pirate Bay': [
                'Expand', 'Hoard', 'Mint', 'Trade Route', 'Watchtower',
                'Bazaar', 'Lighthouse', 'Pirate Ship', 'Smugglers', 'Warehouse'
            ]}
        ]
    },
    {
        'name': 'Seaside \& Cornucopia',
        'img': ['images/elements/seaside-small-white.png', 'images/elements/cornucopia-small-white.png'],
        'sets':
        [
            {'Collector': [
                'Embargo', 'Fishing Village', 'Merchant Ship', 'Navigator', 'Smugglers',
                'Fairgrounds', 'Farming Village', 'Fortune Teller', 'Harvest', 'Hunting Party'
            ]},
            {'Collider': [
                'Lighthouse', 'Salvager', 'Treasure Map', 'Treasury', 'Warehouse',
                'Menagerie', 'Horn of Plenty', 'Horse Traders', 'Jester', 'Tournament'
            ]}
        ]
    },
    {
        'name': 'Seaside \& Hinterlands',
        'img': ['images/elements/seaside-small-white.png', 'images/elements/hinterlands-small-white.png'],
        'sets':
        [
            {'Travelers': [
                'Cutpurse', 'Island', 'Lookout', 'Merchant Ship', 'Warehouse',
                'Cartographer', 'Crossroads', 'Farmland', 'Silk Road', 'Stables'
            ]},
            {'Diplomacy': [
                'Ambassador', 'Bazaar', 'Caravan', 'Embargo', 'Smugglers',
                'Embassy', 'Farmland', 'Ill-Gotten Gains', 'Noble Brigand', 'Trader'
            ]}
        ]
    },
    {
        'name': 'Seaside \& Guilds',
        'img': ['images/elements/seaside-small-white.png', 'images/elements/guilds-small-white.png'],
        'sets':
        [
            {'Ghosts \& Taxes': [
                'Cutpurse', 'Ghost Ship', 'Haven', 'Outpost', 'Smugglers',
                'Butcher', 'Candlestick Maker', 'Herald', 'Soothsayer', 'Taxman'
            ]},
            {'Island Builder': [
                'Island', 'Native Village', 'Salvager', 'Tactician', 'Treasury',
                'Baker', 'Doctor', 'Merchant Guild', 'Plaza', 'Stonemason'
            ]}
        ]
    },

    /* Prosperity + Silver Sub */
    {
        'name': 'Prosperity Only',
        'img': ['images/elements/prosperity-small-white.png'],
        'sets':
        [
            {'Beginners': [
                'Bank', 'Counting House', 'Expand', 'Goons', 'Monument',
                'Rabble', 'Royal Seal', 'Venture', 'Watchtower', 'Worker\'s Village'
            ]},
            {'Friendly Interactive': [
                'Bishop', 'City', 'Contraband', 'Forge', 'Hoard',
                'Peddler', 'Royal Seal', 'Trade Route', 'Vault', 'Worker\'s Village'
            ]},
            {'Big Actions': [
                'City', 'Expand', 'Grand Market', 'King\'s Court', 'Loan',
                'Mint', 'Quarry', 'Rabble', 'Talisman', 'Vault'
            ]}
        ]
    },
    {
        'name': 'Prosperity \& Cornucopia',
        'img': ['images/elements/prosperity-small-white.png', 'images/elements/cornucopia-small-white.png'],
        'sets':
        [
            {'Detours': [
                'Rabble', 'Peddler', 'Hoard', 'Trade Route', 'Venture',
                'Farming Village', 'Horn of Plenty', 'Jester', 'Remake', 'Tournament'
            ]}
        ]
    },
    {
        'name': 'Prosperity \& Hinterlands',
        'img': ['images/elements/prosperity-small-white.png', 'images/elements/hinterlands-small-white.png'],
        'sets':
        [
            {'Instant Gratification': [
                'Bishop', 'Expand', 'Hoard', 'Mint', 'Watchtower',
                'Farmland', 'Haggler', 'Ill-Gotten Gains', 'Noble Brigand', 'Trader'
            ]},
            {'Treasure Trove': [
                'Bank', 'Monument', 'Royal Seal', 'Trade Route', 'Venture',
                'Cache', 'Develop', 'Fool\'s Gold', 'Ill-Gotten Gains', 'Mandarin'
            ]}
        ]
    },
    {
        'name': 'Prosperity \& Guilds',
        'img': ['images/elements/prosperity-small-white.png', 'images/elements/guilds-small-white.png'],
        'sets':
        [
            {'Quarrymen': [
                'City', 'Expand', 'Grand Market', 'Mountebank', 'Quarry',
                'Baker', 'Merchant Guild', 'Soothsayer', 'Stonemason', 'Taxman'
            ]},
            {'Metal \& Meat': [
                'Forge', 'King\'s Court', 'Monument', 'Venture', 'Watchtower',
                'Butcher', 'Candlestick Maker', 'Plaza', 'Stonemason', 'Taxman'
            ]},
            {'Penny Pinching': [
                'Bank', 'Counting House', 'Goons', 'Peddler', 'Royal Seal',
                'Advisor', 'Doctor', 'Herald', 'Journeyman', 'Merchant Guild'
            ]}
        ]
    },

    /* Cornucopia + Silver Sub */
    {
        'name': 'Cornucopia \& Hinterlands',
        'img': ['images/elements/cornucopia-small-white.png', 'images/elements/hinterlands-small-white.png'],
        'sets':
        [
            {'Blue Harvest': [
                'Hamlet', 'Horn of Plenty', 'Horse Traders', 'Jester', 'Tournament',
                'Fool\'s Gold', 'Mandarin', 'Noble Brigand', 'Trader', 'Tunnel'
            ]},
            {'Traveling Circus': [
                'Fairgrounds', 'Farming Village', 'Hunting Party', 'Jester', 'Menagerie',
                'Border Village', 'Embassy', 'Fool\'s Gold', 'Nomad Camp', 'Oasis'
            ]}
        ]
    },
    {
        'name': 'Cornucopia \& Guilds',
        'img': ['images/elements/cornucopia-small-white.png', 'images/elements/guilds-small-white.png'],
        'sets':
        [
            {'Misfortune': [
                'Advisor', 'Candlestick Maker', 'Doctor', 'Fairgrounds', 'Farming Village',
                'Fortune Teller', 'Horse Traders', 'Jester', 'Soothsayer', 'Taxman'
            ]},
            {'Baking Contest': [
                'Baker', 'Farming Village', 'Harvest', 'Herald', 'Journeyman',
                'Masterpiece', 'Menagerie', 'Remake', 'Stonemason', 'Tournament'
            ]}
        ]
    },

    /* Cornucopia + Silver Sub */
    {
        'name': 'Hinterlands Only',
        'img': ['images/elements/hinterlands-small-white.png'],
        'sets':
        [
            {'Introduction': [
                'Cache', 'Crossroads', 'Develop', 'Haggler', 'Jack of all Trades',
                'Margrave', 'Nomad Camp', 'Oasis', 'Spice Merchant', 'Stables'
            ]},
            {'Fair Trades': [
                'Border Village', 'Cartographer', 'Develop', 'Duchess', 'Farmland',
                'Ill-Gotten Gains', 'Noble Brigand', 'Silk Road', 'Stables', 'Trader'
            ]},
            {'Bargains': [
                'Border Village', 'Cache', 'Duchess', 'Fool\'s Gold', 'Haggler',
                'Highway', 'Nomad Camp', 'Scheme', 'Spice Merchant', 'Trader'
            ]},
            {'Gambits': [
                'Cartographer', 'Crossroads', 'Embassy', 'Inn', 'Jack of all Trades',
                'Mandarin', 'Nomad Camp', 'Oasis', 'Oracle', 'Tunnel'
            ]}
        ]
    },
    {
        'name': 'Hinterlands \& Guilds',
        'img': ['images/elements/hinterlands-small-white.png', 'images/elements/guilds-small-white.png'],
        'sets':
        [
            {'Exchanges': [
                'Butcher', 'Herald', 'Masterpiece', 'Soothsayer', 'Stonemason',
                'Border Village', 'Develop', 'Ill-Gotten Gains', 'Stables', 'Trader'
            ]},
            {'Road to Riches': [
                'Advisor', 'Baker', 'Candlestick Maker', 'Journeyman', 'Merchant Guild',
                'Crossroads', 'Farmland', 'Highway', 'Spice Merchant', 'Tunnel'
            ]}
        ]
    }
];
/* ------------------------------------------------------------------------------- */

// Global variables
var inLobbyFlag = false;
var cardNumber = 0;
var lastSelectedMatch = 'Dominion Online';


(function() {
    'use strict';
	waitMatchLobby(2500);
})();

function waitMatchLobby(checkFrequencyInMs) {
  (function loopSearch() {
    // Load title
    document.title = lastSelectedMatch;
    // Add buttons
    if (document.evaluate(
			'//button[contains(@class, \'kingdom-selection\') and contains(@ng-click, \'$ctrl.showKingdomSelection()\')]',
			document.body, null, XPathResult.BOOLEAN_TYPE, null).booleanValue) {
      loadMatchButtons();
      inLobbyFlag = true;
	  setTimeout(function () {
        loopSearch();
      }, 5000);
    } else {
      inLobbyFlag = false;
      cardNumber = 0;
      setTimeout(function () {
        loopSearch();
      }, 2500);
    }
  })();
}

function loadMatchButtons() {
    if(inLobbyFlag) return; // Already loaded

	console.log("Loading Sets of 10...");

    let rulesEditor = document.querySelector('.rules-editor');

    for (let sets = 0; sets < cardsSets.length; sets+=1) {

        // Loading Header...
        let lineBreak = document.createElement('br');
        rulesEditor.appendChild(lineBreak);
        let h = document.createElement("h2");

        // Loading Image (if present)
        let imgVals = cardsSets[sets].img;
        if (imgVals != undefined) {
            for (let imgI = 0; imgI < imgVals.length; imgI+=1) {
                let imgEl = document.createElement('img');
                imgEl.src = imgVals[imgI];
                imgEl.style = 'width: 7%; ';
                h.appendChild(imgEl);
            }
        }
        let t = document.createTextNode(' ' + cardsSets[sets].name);
        h.appendChild(t);
        rulesEditor.appendChild(h);

        // Loading Buttons
        let button;
        let buttonText;
        for (let i = 0; i < cardsSets[sets].sets.length; i+=1) {
            button = document.createElement('button');
            button.classList.add('lobby-button');
            button.title = cardsSets[sets].sets[i][Object.getOwnPropertyNames(cardsSets[sets].sets[i])].toString();
            buttonText = document.createTextNode(Object.getOwnPropertyNames(cardsSets[sets].sets[i]).toLocaleString());

            if (Object.getOwnPropertyNames(cardsSets[sets].sets[i]).toLocaleString() == lastSelectedMatch) {
                button.style = 'background-color: green !important;';
            }
            button.onclick = function(){
                setTimeout(loadMatch(cardsSets[sets].sets[i]), 1000);
                var target = document.querySelectorAll('.lobby-button');
                Array.prototype.forEach.call(target, function(element){
                    element.removeAttribute('style');
                });
                this.style = 'background-color: blue !important;'
            };

            button.appendChild(buttonText);
            rulesEditor.appendChild(button);
        }
    }
}

function loadMatch(selectedMatch) {
    console.log('Load cards for ' + Object.getOwnPropertyNames(selectedMatch).toLocaleString());
    lastSelectedMatch = Object.getOwnPropertyNames(selectedMatch).toLocaleString();

    document.evaluate('//button[contains(@class, \'lobby-button\') and contains(@ng-click, \'$ctrl.showKingdomSelection()\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

    document.body.style.cursor='progress';
    // Print waiting...
    let selectedCardsDiv = document.querySelector('.kingdom-choices');
    let loadingCardsEl = document.createElement("p");
    loadingCardsEl.style.color = "#FFFFFF";
    let loadingCardsText = document.createTextNode('Loading Cards');
    loadingCardsEl.appendChild(loadingCardsText);
    selectedCardsDiv.insertBefore(loadingCardsEl, selectedCardsDiv.firstChild);

    waitCardsLoadThenPickCards(500, selectedMatch, loadingCardsEl);
}


function waitCardsLoadThenPickCards(checkFrequencyInMs, selectedMatch, loadingCardsEl) {
  (function loopSearch() {
    let currentNumber = document.evaluate('//div[contains(@class, \'mini-card\')]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;

    if (currentNumber > cardNumber) { // waiting page finish load
        cardNumber = currentNumber;
        setTimeout(function () {
            loopSearch();
        }, checkFrequencyInMs);
    } else if (currentNumber != 0 && currentNumber == cardNumber) { // page load all cards
        document.body.style.cursor='auto';
        pickCards(selectedMatch);
        return;
    } else { // not loading ?
      if (cardNumber <= 5) {
          console.error('Sorry, there is a script error or the page does not load cards...')
          return; // Break loop
      }
      cardNumber -= 1;
      console.info('Waiting page to load...');
      loadingCardsEl.innerText += '.';
      setTimeout(function () {
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

function pickCards(selectedMatch) {
    console.log('Cards are loaded, pickings....');
    let cards = selectedMatch[Object.getOwnPropertyNames(selectedMatch)];

    // Clear previous selected cards
    document.querySelector('.clear-kingdom').click()

    // Pick Cards
    for (let c = 0; c < cards.length; c+=1) {
        pickCard(cards[c]);
    }

    // Push Done
    document.evaluate('//input[contains(@class, \'lobby-button close\')]', document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
}

function pickCard(cardName) {
    console.log("Picking " + cardName);
    let kebabCaseCardName = cardName.replaceAll(' ','-').replaceAll('\'','').toLowerCase();

    if (cardName == 'Random') {
        document.evaluate('//selection-set', document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
		return;
    }

    let miniCards = document.querySelectorAll('.mini-card');
    for(let i=0; i < miniCards.length; i++) {
        let miniCard = miniCards[i];
        // find mini-card-art
        for (let j=0; j < miniCard.childElementCount; j++) {
            let miniCardImage = miniCard.children[j];
            if (miniCard.children[1].classList.value == "mini-card-art") {
                if (miniCard.children[1].style.backgroundImage.includes(kebabCaseCardName)) {
                    miniCards[i].click();
                }
                break;
            }
        }
    }
}
