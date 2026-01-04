// ==UserScript==
// @name         🐭️ MouseHunt - Better Spooky Shuffle Tracker
// @version      1.3.0
// @description  Play Spooky Shuffle more easily.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/453305/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Spooky%20Shuffle%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/453305/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Spooky%20Shuffle%20Tracker.meta.js
// ==/UserScript==

((function () {
  'use strict';

  /**
   * Add styles to the page.
   *
   * @param {string} styles The styles to add.
   */
  const addStyles = (styles) => {
    const existingStyles = document.getElementById('mh-mouseplace-custom-styles');

    if (existingStyles) {
      existingStyles.innerHTML += styles;
      return;
    }

    const style = document.createElement('style');
    style.id = 'mh-mouseplace-custom-styles';
    style.innerHTML = styles;
    document.head.appendChild(style);
  };

  /**
   * Do something when ajax requests are completed.
   *
   * @param {Function} callback    The callback to call when an ajax request is completed.
   * @param {string}   url         The url to match. If not provided, all ajax requests will be matched.
   * @param {boolean}  skipSuccess Skip the success check.
   */
  const onAjaxRequest = (callback, url = null, skipSuccess = false) => {
    const req = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener('load', function () {
        if (this.responseText) {
          let response = {};
          try {
            response = JSON.parse(this.responseText);
          } catch (e) {
            return;
          }

          if (response.success || skipSuccess) {
            if (! url) {
              callback(response);
              return;
            }

            if (this.responseURL.indexOf(url) !== -1) {
              callback(response);
            }
          }
        }
      });
      req.apply(this, arguments);
    };
  };

  const getSavedCards = () => {
    return JSON.parse(localStorage.getItem('mh-spooky-shuffle-cards')) || [];
  };

  const saveCard = (card, savedCards) => {
    savedCards[card.id] = card;

    localStorage.setItem('mh-spooky-shuffle-cards', JSON.stringify(savedCards));

    return savedCards;
  };

  const renderSavedCards = () => {
    const savedCards = getSavedCards();
    savedCards.forEach((card) => {
      renderSavedCard(card);
    });
  };

  const renderSavedCard = (card) => {
    if (! card) {
      return;
    }

    const cardElement = document.querySelector(`.halloweenMemoryGame-card-container[data-card-id="${card.id}"]`);
    if (! cardElement) {
      return;
    }

    cardElement.classList.remove('mh-spooky-shuffle-card-match');

    // set the .itemImage child to the card's image
    const cardFront = cardElement.querySelector('.halloweenMemoryGame-card-front');
    const flipper = cardElement.querySelector('.halloweenMemoryGame-card-flipper');
    if (! cardFront || ! flipper) {
      return;
    }

    cardFront.style.background = 'url(https://www.mousehuntgame.com/images/ui/events/spooky_shuffle/game/shuffle_cards.png?asset_cache_version=2) 0 100% no-repeat';
    cardFront.classList.add('mh-spooky-shuffle-card-front');
    if (! card.is_matched) {
      flipper.style.background = `url(${card.thumb}) 5px 0 no-repeat`;
    }

    const nameElement = document.createElement('div');
    nameElement.classList.add('mh-spooky-shuffle-card-name');
    nameElement.classList.add(`mh-spooky-shuffle-card-name-${card.id}`);
    nameElement.innerText = card.name;
    cardElement.appendChild(nameElement);
  };

  const cleanUpCompleteGame = () => {
    localStorage.removeItem('mh-spooky-shuffle-cards');
    const shownCards = document.querySelectorAll('.halloweenMemoryGame-card-flipper');
    if (shownCards) {
      shownCards.forEach((card) => {
        card.style.background = '';
      });
    }

    const cardFronts = document.querySelectorAll('.mh-spooky-shuffle-card-front');
    if (cardFronts) {
      cardFronts.forEach((card) => {
        card.style.background = '';
        card.classList.remove('mh-spooky-shuffle-card-front');
      });
    }
  };

  const processRequest = (req) => {
    if (! req || ! req.memory_game) {
      return;
    }

    if (req.memory_game.is_complete) {
      cleanUpCompleteGame();
      return;
    }

    // Clear out any existing card names.
    const cardNames = document.querySelectorAll('.mh-spooky-shuffle-card-name');
    if (cardNames.length) {
      cardNames.forEach((cardName) => {
        cardName.remove();
      });
    }

    // Get the saved cards.
    const savedCards = getSavedCards();

    // Merge in all the new cards.
    const revealedCards = req.memory_game.cards.filter((card) => card.is_revealed);
    if (revealedCards.length) {
      revealedCards.forEach((card) => {
        saveCard(card, savedCards);
      });
    }

    // Get the new card.
    const newCard = req.memory_game.cards.filter((card) => card.is_revealed && ! card.is_matched);

    // Render the saved cards.
    renderSavedCards();

    if (newCard.length) {
      // if the new card's name matches an already revealed card, then we have a match
      const matchingCard = savedCards.filter((card) => (card?.name === newCard[0].name) && (card.id !== newCard[0].id) && ! card.is_matched);
      if (matchingCard.length && matchingCard[0].id !== false) {
        const matchingCardEl = document.querySelector(`.halloweenMemoryGame-card-container[data-card-id="${matchingCard[0].id}"]`);
        if (matchingCardEl) {
          matchingCardEl.classList.add('mh-spooky-shuffle-card-match');
        }
      }
    }
  };

  addStyles(`.halloweenMemoryGame-card-container {
		position: relative;
	}

	.mh-spooky-shuffle-card-front {
		opacity: .8;
	}

	.mh-spooky-shuffle-card-name {
    text-align: center;
    position: absolute;
    top: 80px;
    background-color: #ffde94;
    border-radius: 5px;
    box-shadow: 0px 8px 4px -5px #b4b0aa;
    padding: 4px 0;
    left: 3px;
    right: 1px;
    border: 1px solid #b9923c;
  }

  .revealed .mh-spooky-shuffle-card-name {
    background-color: #ffac14;
  }

  .halloweenMemoryGame-card-container.is_matched .mh-spooky-shuffle-card-name {
    background-color: #d3f5c9;
    border-color: #89b769;
	}

  .halloweenMemoryGame-card-container.mh-spooky-shuffle-card-match {
    animation: spookyShuffleHappyDance .3s .2s 2;
  }`);

  onAjaxRequest(processRequest, 'managers/ajax/events/spooky_shuffle.php');
})());
