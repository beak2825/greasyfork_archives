// ==UserScript==
// @name         dominion.games Gold Subscription - Sets of 10 with Dominion Base
// @namespace    games.dominion.script
// @version      0.3
// @description  Dominion Games Gold Subscription - Add Sets of 10 it the lobby page (table creation)
// @author       barmkin
// @match        https://dominion.games/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414556/dominiongames%20Gold%20Subscription%20-%20Sets%20of%2010%20with%20Dominion%20Base.user.js
// @updateURL https://update.greasyfork.org/scripts/414556/dominiongames%20Gold%20Subscription%20-%20Sets%20of%2010%20with%20Dominion%20Base.meta.js
// ==/UserScript==

/* --- Changelog 0.3 ---
  Add multilanguages support
*/
/* ------------------------------------------------------------------------------- */
/* --- Cards Sets ---------------------------------------------------------------- */
// You can edit this section, see README
var cardsSets = [
    /* Dominion Only */
    {
        'name': 'Dominion Only',
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
        'name': 'Dominion \& Alchemy',
        'sets':
        [
            {'Forbidden Arts': [
                'Bandit', 'Cellar', 'Council Room', 'Gardens', 'Laboratory',
                'Throne Room', 'Apprentice', 'Familiar', 'Possession', 'University'
            ]},
            {'Potion Mixers': [
                'Cellar', 'Festival', 'Militia', 'Poacher', 'Smithy',
                'Alchemist', 'Apothecary', 'Golem', 'Herbalist', 'Transmute'
            ]},
            {'Chemistry Lesson': [
                'Bureaucrat', 'Market', 'Moat', 'Remodel', 'Vassal',
                'Witch', 'Alchemist', 'Golem', 'Philosopher\'s Stone', 'University'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Prosperity',
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
        'name': 'Dominion \& Darkages',
        'sets':
        [
            {'High and Low': [
                'Cellar', 'Moneylender', 'Throne Room', 'Witch', 'Workshop',
                'Hermit', 'Hunting Grounds', 'Mystic', 'Poor House', 'Wandering Minstrel'
            ]},
            {'Chivalry and Revelry': [
                'Festival', 'Gardens', 'Laboratory', 'Library', 'Remodel',
                'Altar', 'Knights', 'Rats', 'Scavenger', 'Squire'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Guilds',
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
    {
        'name': 'Dominion \& Adventures',
        'sets':
        [
            {'Level Up': [
                'Market', 'Merchant', 'Militia', 'Throne Room', 'Workshop',
                'Dungeon', 'Gear', 'Guide', 'Lost City', 'Miser'
            ]},
            {'Son of Size Distortion': [
                'Bandit', 'Bureaucrat', 'Gardens', 'Moneylender', 'Witch',
                'Amulet', 'Duplicate', 'Giant', 'Messenger', 'Treasure Trove'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Empires',
        'sets':
        [
            {'Everything in Moderation': [
                'Cellar', 'Library', 'Remodel', 'Village', 'Workshop',
                'Enchantress', 'Forum', 'Legionary', 'Overlord', 'Temple'
            ]},
            {'Silver Bullets': [
                'Bureaucrat', 'Gardens', 'Laboratory', 'Market', 'Moneylender',
                'Catapult', 'Charm', 'Farmers\' Market', 'Groundskeeper', 'Patrician'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Nocturne',
        'sets':
        [
            {'Night Shift': [
                'Druid', 'Exorcist', 'Ghost Town', 'Idol', 'Night Watchman',
                'Bandit', 'Gardens', 'Mine', 'Poacher', 'Smithy'
            ]},
            {'Idle Hands': [
                'Bard', 'Conclave', 'Cursed Village', 'Devil\'s Workshop', 'Tragic Hero',
                'Cellar', 'Harbinger', 'Market', 'Merchant', 'Moneylender'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Renaissance',
        'sets':
        [
            {'It Takes a Villager': [
                'Acting Troupe', 'Cargo Ship', 'Recruiter', 'Seer', 'Treasurer',
                'Market', 'Merchant', 'Mine', 'Smithy', 'Vassal'
            ]},
            {'Capture the Flag': [
                'Flag Bearer', 'Lackeys', 'Scholar', 'Swashbuckler', 'Villain',
                'Cellar', 'Festival', 'Harbinger', 'Remodel', 'Workshop'
            ]}
        ]
    },
    {
        'name': 'Dominion \& Menagerie',
        'sets':
        [
            {'Pony Express': [
                'Barge', 'Destrier', 'Paddock', 'Stockpile', 'Supplies',
                'Artisan', 'Cellar', 'Market', 'Mine', 'Village'
            ]},
            {'Garden of Cats': [
                'Black Cat', 'Displace', 'Sanctuary', 'Scrap', 'Snowy Village',
                'Bandit', 'Gardens', 'Harbinger', 'Merchant', 'Moat'
            ]}
        ]
    }
];
/* ------------------------------------------------------------------------------- */

// Global variables
var inLobbyFlag = false;
var cardNumber = 0;


(function() {
    'use strict';
	waitMatchLobby(2500);
})();

function waitMatchLobby(checkFrequencyInMs) {
  (function loopSearch() {
    if (document.evaluate(
			'//button[contains(@class, \'kingdom-selection\') and contains(@ng-click, \'$ctrl.showKingdomSelection()\')]',
			document.body, null, XPathResult.BOOLEAN_TYPE, null).booleanValue) {
      loadMatchButtons();
      inLobbyFlag = true;
	  setTimeout(function () {
        loopSearch();
      }, 10000);
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
        let t = document.createTextNode(cardsSets[sets].name);
        h.appendChild(t);
        rulesEditor.appendChild(h);

        // Loading Buttons
        let button;
        let buttonText;
        for (let i = 0; i < cardsSets[sets].sets.length; i+=1) {
            button = document.createElement('button');
            button.classList.add('lobby-button');
            button.onclick = function(){
                setTimeout(loadMatch(cardsSets[sets].sets[i]), 1000);
            };

            buttonText = document.createTextNode(Object.getOwnPropertyNames(cardsSets[sets].sets[i]).toLocaleString());
            button.appendChild(buttonText);
            rulesEditor.appendChild(button);
        }
    }
}

function loadMatch(selectedMatch) {
    console.log('Load cards for ' + Object.getOwnPropertyNames(selectedMatch).toLocaleString());

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
