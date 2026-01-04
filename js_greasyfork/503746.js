// ==UserScript==
// @name           Shiba's Pyramids Card Counter
// @match        https://www.grundos.cafe/games/pyramids/
// @author       Shiba, with thanks to Cupkait for making things pretty
// @version      1.01
// @license      MIT
// @description  See the remaining cards available in the game.
// @namespace https://greasyfork.org/users/1340979
// @downloadURL https://update.greasyfork.org/scripts/503746/Shiba%27s%20Pyramids%20Card%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/503746/Shiba%27s%20Pyramids%20Card%20Counter.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  var suits = ['spades', 'hearts', 'clubs', 'diamonds']

  var cardCounts = JSON.parse(localStorage.getItem('pyramidsCardCounts')) || {
    spades: {
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 1,
      11: 1,
      12: 1,
      13: 1,
      14: 1
    },
    hearts: {
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 1,
      11: 1,
      12: 1,
      13: 1,
      14: 1
    },
    clubs: {
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 1,
      11: 1,
      12: 1,
      13: 1,
      14: 1
    },
    diamonds: {
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 1,
      11: 1,
      12: 1,
      13: 1,
      14: 1
    }
  }

  var cardSymbols = {
    14: 'A',
    13: 'K',
    12: 'Q',
    11: 'J',
    10: '10',
    9: '9',
    8: '8',
    7: '7',
    6: '6',
    5: '5',
    4: '4',
    3: '3',
    2: '2'
  }

  function createCardCountDisplay () {
    addTableStyle();
    var scoreTable = document.getElementById('pyramids_counts')
    if (!scoreTable || document.getElementById('card-count-grid')) return

    var tableHTML =
      '<span class="flex center-items justify-center no-right-border" id="card-count-grid"><table><tr>'

    // First row: card symbols
    for (var rank = 2; rank <= 14; rank++) {
      tableHTML += `<td id='${rank}'>${cardSymbols[rank]}</td>`
    }
    tableHTML += '</tr><tr>'

    for (rank = 2; rank <= 14; rank++) {
      var sum = suits.reduce((total, suit) => total + cardCounts[suit][rank], 0)
      tableHTML += `<td>${sum}</td>`
    }
    tableHTML += '</tr></table></span>'

    scoreTable.insertAdjacentHTML('beforeend', tableHTML)
  }

  function updateCardCountDisplay () {
    var remainingCells = document.querySelectorAll(
      '#card-count-grid td:not([id])'
    )
    remainingCells.forEach(function (cell, index) {
      var rank = 14 - index
      var sum = suits.reduce((total, suit) => total + cardCounts[suit][rank], 0)
      cell.textContent = sum
    })
  }

  function updateCardCount (cardValue, suit) {
    if (cardCounts[suit] && cardCounts[suit][cardValue] > 0) {
      cardCounts[suit][cardValue]--
    }
    localStorage.setItem('pyramidsCardCounts', JSON.stringify(cardCounts))
  }

  function resetCardCounts () {
    cardCounts = {
      spades: {
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1
      },
      hearts: {
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1
      },
      clubs: {
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1
      },
      diamonds: {
        2: 1,
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        9: 1,
        10: 1,
        11: 1,
        12: 1,
        13: 1,
        14: 1
      }
    }
    localStorage.setItem('pyramidsCardCounts', JSON.stringify(cardCounts))
    updateCardCountDisplay()
  }

  function processDrawPile () {
    var drawPileCard = document.querySelector('img.hand.face_up')

    if (drawPileCard) {
      var regex = new RegExp('/(\\d+)_(spade|heart|club|diamond)s\\.gif')
      var matches = regex.exec(drawPileCard.src)
      if (matches) {
        var cardValue = parseInt(matches[1])
        var suit = matches[2] + 's'
        updateCardCount(cardValue, suit)
      }
    }
  }

  function processFaceUpCards () {
    var face_up_images = document.querySelectorAll('img.face_up.clickable')
    var regex = new RegExp('/(\\d+)_(spade|heart|club|diamond)s\\.gif')

    face_up_images.forEach(function (img) {
      var matches = regex.exec(img.src)
      if (matches) {
        var cardValue = parseInt(matches[1])
        var suit = matches[2] + 's'
        updateCardCount(cardValue, suit)
      }
    })
  }

  function checkForNewGame () {
    var playPyramids = document.querySelector(
      "input[type='submit'][value='Play Pyramids!']"
    )
    if (playPyramids) {
      resetCardCounts()
    }
  }

  function addTableStyle(){
const tableStyle = document.createElement('style');
  //Insert any CSS styling that applies to newly created elements, etc.
  tableStyle.innerHTML = `
#card-count-grid {
display:table;
width:inherit;
background-color:var(--bgcolor);
}
#card-count-grid td {
border-left: 1px solid black;
border-top: 1px solid black;

}
#card-count-grid table {
border-spacing:0px;
width:inherit;

}
#pyramids_counts {
background-color: var(--bgcolor)
}
  `;

  document.head.appendChild(tableStyle);
}

  window.addEventListener('load', function () {
    checkForNewGame()
    processFaceUpCards()
    processDrawPile()
    createCardCountDisplay()
  })
})()
