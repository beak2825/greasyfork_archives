// ==UserScript==
// @name         Torn City - Duke Safe Combinations
// @namespace    http://tampermonkey.net/
// @version      2024-10-26
// @description  Autofill safe combinations based on list provided in this forum thread: https://www.torn.com/forums.php#/p=threads&f=47&t=16406373&b=0&a=0
// @author       dang_nabbit [2173594]
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/514223/Torn%20City%20-%20Duke%20Safe%20Combinations.user.js
// @updateURL https://update.greasyfork.org/scripts/514223/Torn%20City%20-%20Duke%20Safe%20Combinations.meta.js
// ==/UserScript==

const combos = [
  {left: 10, right: 10, first: 24, combos: 3},
  {left: 10, right: 11, first: 25, combos: 3},
  {left: 10, right: 12, first: 26, combos: 4},
  {left: 10, right: 13, first: 27, combos: 4},

  {left: 11, right: 11, first: 26, combos: 4},
  {left: 11, right: 12, first: 27, combos: 4},
  {left: 11, right: 13, first: 28, combos: 4},
  {left: 11, right: 14, first: 30, combos: 4},

  {left: 12, right: 12, first: 28, combos: 4},
  {left: 12, right: 13, first: 30, combos: 4},
  {left: 12, right: 14, first: 31, combos: 4},
  {left: 12, right: 15, first: 32, combos: 4},

  {left: 13, right: 13, first: 31, combos: 4},
  {left: 13, right: 14, first: 32, combos: 4},
  {left: 13, right: 15, first: 33, combos: 4},
  {left: 13, right: 16, first: 34, combos: 5},

  {left: 14, right: 14, first: 33, combos: 4},
  {left: 14, right: 15, first: 34, combos: 5},
  {left: 14, right: 16, first: 36, combos: 4},
  {left: 14, right: 17, first: 37, combos: 4},

  {left: 15, right: 15, first: 36, combos: 4},
  {left: 15, right: 16, first: 37, combos: 4},
  {left: 15, right: 17, first: 38, combos: 5},
  {left: 15, right: 18, first: 39, combos: 5},

  {left: 16, right: 16, first: 38, combos: 5},
  {left: 16, right: 17, first: 39, combos: 5},
  {left: 16, right: 18, first: 40, combos: 5},
  {left: 16, right: 19, first: 42, combos: 5},

  {left: 17, right: 17, first: 40, combos: 5},
  {left: 17, right: 18, first: 42, combos: 5},
  {left: 17, right: 19, first: 43, combos: 5},
  {left: 17, right: 20, first: 44, combos: 5},

  {left: 18, right: 18, first: 43, combos: 5},
  {left: 18, right: 19, first: 44, combos: 5},
  {left: 18, right: 20, first: 45, combos: 5},
  {left: 18, right: 21, first: 46, combos: 6},

  {left: 19, right: 19, first: 45, combos: 5},
  {left: 19, right: 20, first: 46, combos: 6},
  {left: 19, right: 21, first: 48, combos: 5},
  {left: 19, right: 22, first: 49, combos: 5},

  {left: 20, right: 20, first: 48, combos: 5},
  {left: 20, right: 21, first: 49, combos: 5},
  {left: 20, right: 22, first: 50, combos: 6},
  {left: 20, right: 23, first: 51, combos: 6},

  {left: 21, right: 21, first: 50, combos: 6},
  {left: 21, right: 22, first: 51, combos: 6},
  {left: 21, right: 23, first: 52, combos: 6},
  {left: 21, right: 24, first: 54, combos: 6},

  {left: 22, right: 22, first: 52, combos: 6},
  {left: 22, right: 23, first: 54, combos: 6},
  {left: 22, right: 24, first: 55, combos: 6},
  {left: 22, right: 25, first: 56, combos: 6},

  {left: 23, right: 23, first: 55, combos: 6},
  {left: 23, right: 24, first: 56, combos: 6},
  {left: 23, right: 25, first: 57, combos: 6},
  {left: 23, right: 26, first: 58, combos: 7},

  {left: 24, right: 24, first: 57, combos: 6},
  {left: 24, right: 25, first: 58, combos: 7},
  {left: 24, right: 26, first: 60, combos: 6},
  {left: 24, right: 27, first: 61, combos: 6},

  {left: 25, right: 25, first: 60, combos: 6},
  {left: 25, right: 26, first: 61, combos: 6},
  {left: 25, right: 27, first: 62, combos: 7},
  {left: 25, right: 28, first: 63, combos: 7},

  {left: 26, right: 26, first: 62, combos: 7},
  {left: 26, right: 27, first: 63, combos: 7},
  {left: 26, right: 28, first: 64, combos: 7},
  {left: 26, right: 29, first: 66, combos: 7},

  {left: 27, right: 27, first: 64, combos: 7},
  {left: 27, right: 28, first: 66, combos: 7},
  {left: 27, right: 29, first: 67, combos: 7},
  {left: 27, right: 30, first: 68, combos: 7},

  {left: 28, right: 28, first: 67, combos: 7},
  {left: 28, right: 29, first: 68, combos: 7},
  {left: 28, right: 30, first: 69, combos: 7},
  {left: 28, right: 31, first: 70, combos: 8},

  {left: 29, right: 29, first: 69, combos: 7},
  {left: 29, right: 30, first: 70, combos: 8},
  {left: 29, right: 31, first: 72, combos: 7},
  {left: 29, right: 32, first: 73, combos: 7},

  {left: 30, right: 30, first: 72, combos: 7},
  {left: 30, right: 31, first: 73, combos: 7},
  {left: 30, right: 32, first: 74, combos: 8},
  {left: 30, right: 33, first: 75, combos: 8},

  {left: 31, right: 31, first: 74, combos: 8},
  {left: 31, right: 32, first: 75, combos: 8},
  {left: 31, right: 33, first: 76, combos: 8},
  {left: 31, right: 34, first: 78, combos: 8},

  {left: 32, right: 32, first: 76, combos: 8},
  {left: 32, right: 33, first: 78, combos: 8},
  {left: 32, right: 34, first: 79, combos: 8},
  {left: 32, right: 35, first: 80, combos: 8},

  {left: 33, right: 33, first: 79, combos: 8},
  {left: 33, right: 34, first: 80, combos: 8},
  {left: 33, right: 35, first: 81, combos: 8},
  {left: 33, right: 36, first: 82, combos: 9}
];

const index = {
  leftRight: 0,
  middle: 0
};

const buttonId = 'script-duke-safe-combo';
const safeDivSelector = '.safe-input';

(function() {
  const itemUrl = 'item.php';
  const safeId = '798';

  'use strict';
  // $('body').off('ajaxComplete');
  $('body').on('ajaxComplete', (event, xhr, settings) => {
    if (settings.url.substring(0, itemUrl.length) !== itemUrl) {
      return;
    }

    const params = new URLSearchParams(settings.data);
    let itemId;

    if (params.has('id')) {
      itemId = params.get('id');
    } else if (params.has('itemID')) {
      itemId = params.get('itemID');
    } else {
      return;
    }

    if (itemId === safeId) {
      addButton();
    }
  });
})();

function fillCombo() {
  const currentLeftRight = combos[index.leftRight];

  $('.code-input[name="code1"]').val(currentLeftRight.left);
  $('.code-input[name="code2"]').val(currentLeftRight.first + index.middle);
  $('.code-input[name="code3"]').val(currentLeftRight.right);

  if (index.middle < currentLeftRight.combos - 1) {
    index.middle++;
  } else {
    index.leftRight++;
    index.middle = 0;
  }

  if (!$('#' + buttonId).is(':last-child')) {
    $('#' + buttonId).appendTo($(safeDivSelector));
  }
}

function addButton() {
  $('<div/>', {
    id: buttonId,
    class: 'btn-wrap',
    style: 'margin-top: 0;'
  }).append(
    $('<div/>', {class: 'btn'})
      .append(
        $('<input/>', {
          class: 'torn-btn',
          type: 'button',
          value: 'Next combo'
        }).on('click', fillCombo)
      )
  ).insertBefore($(safeDivSelector + '> .btn-wrap.silver'));
}