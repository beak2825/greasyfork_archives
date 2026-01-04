// ==UserScript==
// @name          Up-down arrows buttons (Mobile)
// @description   Creates up-down arrows buttons on chart
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @version       2.0.1
// @match         https://www.tradingview.com/chart/*
// @run-at        document-body
// @grant         GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/525762/Up-down%20arrows%20buttons%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525762/Up-down%20arrows%20buttons%20%28Mobile%29.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* eslint no-multi-spaces: 'off' */

(function() {
  'use strict';

  // The script creates an arrows inside of a buttons. Buttons represent the arrows hitboxes

  // Set to true to show a red outlines representing buttons hitboxes, or false to hide them
  const DEBUG_OUTLINE = false;

  // For a buttons/arrows sizes use these values:
  // '50px' to set 50 pixels or '50vw' to set 50% of view width or '50vh' for a view height.
  // Percents are not recommended because they're always based on width of a parent element

  const X_GAP_SIDE = 'right';    // 'left' or 'right'
  const Y_GAP_SIDE = 'bottom';   // 'top' or 'bottom'
  const BUTTONS_X_GAP = '0px';   // x gap size
  const BUTTONS_Y_GAP = '100px';  // y gap size

  const BUTTONS_WIDTH = '60px';
  const BUTTONS_HEIGHT = '55px';

  // This is useful when you're editing the arrows size related to the buttons hitboxes.
  // Fractional values like 1.4 or 0.7 are allowed too
  const ARROWS_SCALE = 0.85;

  // This is useful when you're editing the arrows position related to the buttons hitboxes.
  // Represents individual inner gaps of the buttons. 4 values representing the sides where
  // first value is the top gap, and the other three are right, bottom, left sides respectively.
  const UP_BUTTON_PADDING   = '5px 5px 0px 5px'; // top right bottom left
  const DOWN_BUTTON_PADDING = '0px 5px 5px 5px';
  const ARROWS_OPACITY = 0.8; // 1 is fully visible, 0.5 is half visible

  const ARROW_UP_ROTATE = 0; // clockwise, may take negative values
  const ARROW_DOWN_ROTATE = 180;

  const ARROW_UP_SRC   = 'https://img.icons8.com/fluency-systems-filled/2962ff/128/triangle.png';
  const ARROW_DOWN_SRC = 'https://img.icons8.com/fluency-systems-filled/2962ff/128/triangle.png';

  const btnsContainer = document.createElement('div');
  const btnUp = document.createElement('button');
  const btnDown = document.createElement('button');

  btnsContainer.classList.add('up-down-arrows');

  GM_addStyle(`
    div.up-down-arrows {
      position: fixed;
      user-select: none;
      z-index: 3;
      ${X_GAP_SIDE}: ${BUTTONS_X_GAP};
      ${Y_GAP_SIDE}: ${BUTTONS_Y_GAP};
    }

    div.up-down-arrows button {
      width: ${BUTTONS_WIDTH};
      height: ${BUTTONS_HEIGHT};
      display: block;
      padding: 0;
      box-sizing: border-box;
      cursor: pointer;
      overflow: hidden;
      background: none;
      border: ${DEBUG_OUTLINE ? '1px solid red' : 'none'};
    }

    div.up-down-arrows img {
      scale: ${ARROWS_SCALE};
      width: 100%;
      opacity: ${ARROWS_OPACITY};
      height: -moz-available;
      height: -webkit-fill-available;
      height: fill-available;
    }
  `);

  btnUp.append(document.createElement('img'));
  btnUp.addEventListener('click', () => pressKey('ArrowUp', 38));
  btnUp.style.padding = UP_BUTTON_PADDING;
  btnUp.firstChild.src = ARROW_UP_SRC;

  if (ARROW_UP_ROTATE) {
    btnUp.firstChild.style.transform = `rotate(${ARROW_UP_ROTATE}deg)`;
  }

  btnDown.append(document.createElement('img'));
  btnDown.addEventListener('click', () => pressKey('ArrowDown', 40));
  btnDown.style.padding = DOWN_BUTTON_PADDING;
  btnDown.firstChild.src = ARROW_DOWN_SRC;

  if (ARROW_DOWN_ROTATE) {
    btnDown.firstChild.style.transform = `rotate(${ARROW_DOWN_ROTATE}deg)`;
  }

  for (const el of [
    btnsContainer, btnUp, btnDown, btnUp.firstChild, btnDown.firstChild,
  ]) {
    el.setAttribute('draggable', 'false');
    el.addEventListener('dragstart', (ev) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    });
  }

  btnsContainer.append(btnUp, btnDown);
  document.body.append(btnsContainer);

  // utils ----------------------------------------------------------------------

  function pressKey(key, code) {
    const event = new KeyboardEvent('keydown', {
      key,
      code,
      keyCode: code,
      which: code,
      bubbles: true,
    });

    document.body.dispatchEvent(event);
  }

  // ---------------------------------------------------------------------- utils
}());
