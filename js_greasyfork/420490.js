// ==UserScript==
// @name     Lichess show mistakes on the board
// @description If your move is a blunder or inaccuracy, a red circle will signal this on the board.
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant    none
// @include     http://*.lichess.org/*
// @include  https://lichess.org/*
// @version     1.6
// @namespace https://greasyfork.org/users/729712
// @downloadURL https://update.greasyfork.org/scripts/420490/Lichess%20show%20mistakes%20on%20the%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/420490/Lichess%20show%20mistakes%20on%20the%20board.meta.js
// ==/UserScript==

let $ = jQuery.noConflict();

$(document).ready(() => {
  setTimeout(() => {
    init();
  }, 500);
});

let clickedElement;

const COLORS = {
  '?': '#E69F00',
  '?!': '#56B4E9',
  '??': '#ff3d00',
};

const MOVE_TYPES = {
  Blunder: '??',
  Mistake: '?!',
  Inaccuracy: '?',
};

/**
 * Highlight the move type on the board (OTB)
 */
const highlightMoveTypeOTB = () => {
  clearBoardIndicators();
  const activeMove = getActiveMove();

  if (activeMove) {
    let moveType;

    moveType = getMoveType(activeMove.innerText);

    const lm = $('.last-move')[0];
    if (moveType) {
      const color = COLORS[moveType];
      lm.innerHTML = `<div>
   <div style="width: 20px;height: 20px;background: ${color};position: absolute;right: 0;border-radius: 10px;"></div>
   <div style="position: absolute;right: 0px;top: 0px;font-weight: bold;width: 20px;height: 20px;/*! align-content: space-evenly; */text-align: center;line-height: 20px;color: black;">${moveType}</div>
 	</div>`;
    } else {
      lm.innerHTML = '';
    }
  } else {
    console.log('no active move found');
  }
};

/**
 * Returns the move type
 */
const getMoveType = (text) => {
  if (text.indexOf(MOVE_TYPES.Blunder) !== -1) return MOVE_TYPES.Blunder;
  if (text.indexOf(MOVE_TYPES.Mistake) !== -1) return MOVE_TYPES.Mistake;
  if (text.indexOf(MOVE_TYPES.Inaccuracy) !== -1) return MOVE_TYPES.Inaccuracy; // check this last!
  return null;
};

/**
 * Clears the board indicators. in case we move away from the main line via explorer
 */
const clearBoardIndicators = () => {
  $('.last-move')[0].innerHTML = '';
  $('.last-move')[1].innerHTML = '';
};

/**
 * determines if a button is a review navigation button
 */
const isReviewNavButton = (but) => {
  const goodActions = ['first', 'prev', 'next', 'last'];
  return goodActions.indexOf(but.dataset.act) !== -1;
};

/**
 * returns all the navigation buttons << < > >>
 */
const getNavButtons = () => {
  const navButtons = [];
  const allButtons = document.getElementsByTagName('button');

  for (let i = 0; i < allButtons.length; i++) {
    if (isReviewNavButton(allButtons[i])) {
      navButtons.push(allButtons[i]);
    }
  }
  return navButtons;
};

/**
 * Returns the active move
 */
const getActiveMove = () => {
  const activeElements = document.getElementsByClassName('active');
  for (let i = 0; i < activeElements.length; i++) {
    if (activeElements[i].tagName === 'MOVE') {
      return activeElements[i];
    }
  }
  return null;
};

/**
 * Highlight the move types in the moves list
 */
const highlightMoveTypeITML = () => {
  const moves = document.getElementsByTagName('move');
  for (let i = 0; i < moves.length; i++) {
    const moveType = getMoveType(moves[i].innerText);
    if (moveType) {
      moves[i].style.color = COLORS[moveType];
    }
  }
};

const init = () => {
  // initial highlight of the moves
  highlightMoveTypeITML();

  // set the listeners for the action buttons
  const navButtons = getNavButtons();
  navButtons.forEach((button) => {
    button.onclick = () => {
      highlightMoveTypeOTB();
      highlightMoveTypeITML();
    };
  });
//   $(document).mousedown((ev) => {
//     clickedElement = ev.target;
//   });

  // tricky one. a user can also click on the bad move and we need to show the move, or on the
  // engine line and we need to clear the mistakes. this will double trigger the render when
  // you click on the arrows
  $(window).mouseup((ev) => {
//     const isMove = clickedElement.tagName === "MOVE" || clickedElement.parentElement.tagName === "MOVE";
//     const isChoiceButton = ev.target.parentElement.classList == "choices";

    setTimeout(()=> {
      clearBoardIndicators();
      highlightMoveTypeOTB();
      highlightMoveTypeITML();
    }, 50);

  });

  // set the listeners for the key down / up
  document.onkeyup = function (e) {
    switch (e.which) {
      case 32: // spacebar
      case 37: // left
      case 38: // up
      case 39: // right
      case 40: // down
        clearBoardIndicators();
        highlightMoveTypeOTB();
        highlightMoveTypeITML();
        break;
      default: // exit this handler for other keys
    }
  };
};
