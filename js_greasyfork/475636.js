// ==UserScript==
// @name         GC Tyranu Evavu Tracker
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.6
// @description  Tracks Tyranu Evavu on the page so you don't need an external tool to count cards and tells you whether to choose Tyranu or Evavu.
// @author       sanjix
// @match        https://www.grundos.cafe/games/tyranuevavu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475636/GC%20Tyranu%20Evavu%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/475636/GC%20Tyranu%20Evavu%20Tracker.meta.js
// ==/UserScript==

//construct deck
var deck = [];
var cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
for (var i = 0; i < cards.length; i++) {
  deck.push(cards[i]);
  deck.push(cards[i]);
  deck.push(cards[i]);
  deck.push(cards[i]);
}

//add current card to list of played cards
function update(card,playedCards){
    playedCards.push(card);
    localStorage.setItem('playedCards',JSON.stringify(playedCards));
}

//remove played cards from deck
function updateDeck(deck, playedCards){
    playedCards.forEach((card) => {
        var rmCard = deck.indexOf(card);
        deck.splice(rmCard, 1);
        return deck
})}

//decide tyranu v evavu
function te(currentCard, deck){
    var smallerCards = deck.filter((card) => currentCard > card);
    var biggerCards = deck.filter((card) => currentCard < card);
    if (smallerCards.length > biggerCards.length){
        direction.textContent = 'Evavu';
    } else if (smallerCards.length < biggerCards.length){
        direction.textContent = 'Tyranu';
    } else {
        //console.log('either');
        direction.textContent = 'Either';
    }
    //console.log('in deck ,', deck);
}

if (document.querySelector('input[value="Play Again"]') != null){
    //reset tracking
    localStorage.removeItem('playedCards');
} else if (document.querySelector('.te-cards') != null) {
    //id current card
    var currentCard = document.querySelector('.te-cards img').src;
    currentCard = currentCard.replace('https://grundoscafe.b-cdn.net/games/cards/','');
    currentCard = parseInt(currentCard.split('_')[0]);

    //find played cards
    var playedCards = JSON.parse(localStorage.getItem('playedCards')) || [];

    //add element to DOM to direct player
    var direction = document.createElement('p');
    document.querySelector('.te-buttons').prepend(direction);
    direction.className = 'te-directions';

    update(currentCard, playedCards);
    updateDeck(deck, playedCards);
    te(currentCard, deck);
    //console.log('played: ',playedCards);

}