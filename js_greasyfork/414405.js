// ==UserScript==
// @name         Free Subscription - Base Sets of 10 Buttons
// @namespace    games.dominion.script
// @version      0.2
// @description  This script adds (First Game, Size Distortion, Deck Top, Sleight of Hand, Improvements and Silver & Gold) buttons to table creations
// @author       barmkin
// @match        https://dominion.games/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/414405/Free%20Subscription%20-%20Base%20Sets%20of%2010%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/414405/Free%20Subscription%20-%20Base%20Sets%20of%2010%20Buttons.meta.js
// ==/UserScript==

/* --- Changelog 0.2 ---
  Add multilanguages support
*/

/* ------------------------------------------------------------------------------- */
/* --- Cards Sets ---------------------------------------------------------------- */
// You can edit this section, see README
var cardsSets = [
    {
        'name': 'Base Sets of 10',
        'sets':
        [
            {'First Game': [
                'Cellar', 'Market', 'Merchant', 'Militia', 'Mine', 'Moat', 'Remodel', 'Smithy', 'Village', 'Workshop'
            ]},
            {'Size Distortion': [
                'Artisan', 'Bandit', 'Bureaucrat', 'Chapel', 'Festival', 'Gardens', 'Sentry', 'Throne Room', 'Witch', 'Workshop'
            ]},
            {'Deck Top': [
                'Artisan', 'Bureaucrat', 'Council Room', 'Festival', 'Harbinger', 'Laboratory', 'Moneylender', 'Sentry', 'Vassal', 'Village'
            ]},
            {'Sleight of Hand': [
                'Cellar', 'Council Room', 'Festival', 'Gardens', 'Library', 'Harbinger', 'Militia', 'Poacher', 'Smithy', 'Throne Room'
            ]},
            {'Improvements': [
                'Artisan', 'Cellar', 'Market', 'Merchant', 'Mine', 'Moat', 'Moneylender', 'Poacher', 'Remodel', 'Witch'
            ]},
            {'Silver \& Gold': [
                'Bandit', 'Bureaucrat', 'Chapel', 'Harbinger', 'Laboratory', 'Merchant', 'Mine', 'Moneylender', 'Throne Room', 'Vassal'
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
