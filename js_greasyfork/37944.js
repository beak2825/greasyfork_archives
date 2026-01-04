// ==UserScript==
// @name         telegram Mineroobot solver
// @version      0.0.1
// @include      https://web.telegram.org/*
// @description  resolve telegram mineroobot automatically
// @namespace    mineroobot-solver.mmis1000.me
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37944/telegram%20Mineroobot%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/37944/telegram%20Mineroobot%20solver.meta.js
// ==/UserScript==

window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param Number h The hue
 * @param Number s The saturation
 * @param Number l The lightness
 * @return Array The RGB representation
 */

function hslToRgb(h, s, l) {
  var r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic

  }
  else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * @param {number} r range between 0-256
 * @param {number} g range between 0-256
 * @param {number} b range between 0-256
 * @return {string}
 */
function rgbColor(r, g, b) {
  // return `\u001b[${bg ? 48 : 38};2;${r};${g};${b}m`;
  var str = ((r << 16) + (g << 8) + b).toString(16);
  while (str.length < 6) str = '0' + str;
  return '#' + str;
}

/**
 * @param {number} h range between 0-1
 * @param {number} s range between 0-1
 * @param {number} l range between 0-1
 * @return {string}
 */
function hslColor(h, s, l) {
   var [r, g, b] = hslToRgb(h, s, l);
   return rgbColor(r, g, b);
}

/**
 * @param {number} m total
 * @param {number} n selected
 * @return {number}
 */
function c(m, n) {
  var val = 1;

  for (let temp = m; temp > m - n; temp--) {
    val = val * temp / (temp - m + n);
  }
  return val;
}

/**
 * @param {number} w width
 * @param {number} h height
 * @return {function}
 */
function p(w, h) {
  return function ptr(x, y) {
    var pos = {x, y};
    pos.next = function () {
      if (x < 0 || x >= w || y < 0 && y >= h) {
        return null;
      }

      // highest valid pointer
      if (x >= w - 1 && y >= h - 1) {
        return null;
      }

      if (x < w - 1) {
        return ptr(x + 1, y);
      } else {
        return ptr(0, y + 1);
      }
    };

    if (x >= 0 && x < w && y >= 0 && y < h) {
      pos.offset = x + y * w;
    } else {
      pos.offset = null;
    }

    pos.neighbors = function() {
      return [
        ptr(x - 1, y - 1),
        ptr(x, y - 1),
        ptr(x + 1, y - 1),
        ptr(x - 1, y),
        ptr(x + 1, y),
        ptr(x - 1, y + 1),
        ptr(x, y + 1),
        ptr(x + 1, y + 1)
      ];
    };

    return pos;
  };
}

/**
 * @param {number} w width
 * @param {number} h height
 * @param (any} init init value
 * @param {any} outBoundVal value access out of table bound
 * @return {function}
 */
function t(w, h, init, outBoundVal) {
  var data = [];
  var Ptr = p(w, h);

  function table(ptr, val) {
    if (val != null) {
      if (ptr.offset != null) {
        data[ptr.offset] = val;
      }
    } else {
      if (ptr.offset != null) {
        return data[ptr.offset];
      } else {
        return outBoundVal;
      }
    }
  }

  table.w = w;
  table.h = h;
  table.data = data;

  for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
    data[ptr.offset] = init;
  }

  table.clone = function () {
    var newTable = t(w, h, init, outBoundVal);
    var ptr = p(w, h)(0, 0);

    for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
      newTable(ptr, table(ptr));
    }

    return newTable;
  };

  //regex must has global flag
  table.countRegex = function(regex) {
    var counter = 0;

    for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
      if (regex.test(table(ptr))) {
        counter += 1;
      }
    }

    return counter;
  };

  table.count = function (val) {
    var counter = 0;

    for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
      if (table(ptr) === val) {
        counter += 1;
      }
    }

    return counter;
  };

  table.toString = function (seperator) {
    var res = [];
    seperator = seperator == null ? ' ,' : seperator;
    for (var i = 0; i < data.length; i += w) {
      res.push(data.slice(i, i + w).join(seperator));
    }

    return res.join('\r\n');
  };

  return table;
}

/**
 * @param {number} w width
 * @param {number} h height
 * @param (number} totalMines total mines
 * @param {string} str the game board
 * @return {function}
 */
function resolve(w, h, totalMines, str) {
  /*
    '-': unknown
    'x': empty
    'o': bomb
    '0' - '9': count near by
  */
  var table = t(w, h, '-', 'x');

  // init
  var Ptr = p(w, h);
  var ptr = Ptr(0, 0);
  var temp = str.replace(/[\r\n]/g, '');

  for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
    table(ptr, temp.slice(ptr.offset, ptr.offset + 1));
  }

  // found slot with no no number neighbors
  // true: has neighbor
  // false: no neighbor
  var mask = t(w, h, false, false);

  for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
    let neightborPtrs = ptr.neighbors();
    mask(ptr, neightborPtrs.reduce(function (prev, ptr) {
      var val = table(ptr);
      return prev || !!val.match(/[0-9]/);
    }, false));
  }

  var unPredicableSlots = mask.count(false);
  var totalFoundMines = table.count('o');
  var minesLeft = totalMines - totalFoundMines;

  // situation when there are n mines drops in unprediactable area;
  var unPredicableMultiplier = {};
  var combinationCounts = {};
  var guessTables = [];

  for (let unPredicableCount = minesLeft; unPredicableCount >= 0; unPredicableCount--) {
    unPredicableMultiplier[unPredicableCount] = c(unPredicableSlots, unPredicableCount);
    combinationCounts[unPredicableCount] = 0;
    guessTables[unPredicableCount] = t(w, h, 0, 0);
  }

  // solve until there is no other possible combination
  function solve(ptr, currentTable, minesLeft) {
    // move until guessable Slot
    while (ptr && (!mask(ptr) || currentTable(ptr) !== '-')) {
      ptr = ptr.next();
    }

    if (!ptr && minesLeft >= 0) {
      // found a possible solution;
      // console.log('hit #' + combinationCounts[minesLeft] + '\r\n' + currentTable.toString());
      combinationCounts[minesLeft] += 1;
      for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
        if (mask(ptr)) {
          var guessTable = guessTables[minesLeft];
          if (!guessTable) {
            console.log(minesLeft);
            return;
          }
          if (currentTable(ptr) === 'o') {
            guessTable(ptr, guessTable(ptr) + 1);
          }
        }
      }

      return;
    }

    // check if this slot can be mine or not be mine
    // and abort the branch if that branch failed;
    var neightbors = ptr.neighbors();
    var canBeMine = true;
    var canBeEmpty = true;

    neightbors.forEach(function (neightbor) {
      if (currentTable(neightbor).match(/[0-9\s]/)) {
        var neightborsOfNeighbor = neightbor.neighbors();
        var number = currentTable(neightbor);
        number = number === ' ' ? 0 : parseInt(number, 10);

        var minesNearBy = neightborsOfNeighbor.reduce(function (prev, curr) {
          if (currentTable(curr) === 'o') {
            return prev + 1;
          } else {
            return prev;
          }
        }, 0);

        var emptyNearBy = neightborsOfNeighbor.reduce(function (prev, curr) {
          if (currentTable(curr).match(/[0-9x\s]/)) {
            return prev + 1;
          } else {
            return prev;
          }
        }, 0);

        var unknownNearBy = 8 - minesNearBy - emptyNearBy;

        var minesToPlace = number - minesNearBy;
        if (minesToPlace === unknownNearBy) canBeEmpty = false;
        if (minesToPlace === 0) canBeMine = false;
      }
    });

    if (canBeMine && minesLeft !== 0) {
      let newTable = currentTable.clone();
      newTable(ptr, 'o');
      solve(ptr.next(), newTable, minesLeft - 1);
      // we still have mine, and we can put mine here
    }

    if (canBeEmpty) {
      let newTable = currentTable.clone();
      newTable(ptr, 'x');
      solve(ptr.next(), newTable, minesLeft);
    }

    // if (!canBeMine && !canBeEmpty) {
    //   console.log('badGuess\r\n' + currentTable)
    // }
  }

  solve(Ptr(0, 0), table.clone(), minesLeft);

  // console.log(unPredicableMultiplier)
  // console.log(combinationCounts)
  // console.log(guessTables.map(function (table, i) {
  //   return '# guessTable ' + i + '\r\n' + table.toString();
  // }).join('\r\n'))

  // sum up the possibility
  var finalBoardCount = 0;
  var finalBoard = t(w, h, 0, 0);

  for (let unPredicableCount = minesLeft; unPredicableCount >= 0; unPredicableCount--) {
    finalBoardCount += (unPredicableMultiplier[unPredicableCount] * combinationCounts[unPredicableCount]);

    // init possibility for unPredicable slot;
    for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
      if (!mask(ptr)) {
        guessTables[unPredicableCount](ptr, combinationCounts[unPredicableCount] * (unPredicableCount / unPredicableSlots));
      }
    }

    for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
      finalBoard(ptr, finalBoard(ptr) + guessTables[unPredicableCount](ptr) * unPredicableMultiplier[unPredicableCount]);
    }
  }

  if (finalBoardCount === 0) {
    throw new Error('invalid board');
  }

  function formatToPercent(num, small) {
    small = small || 2;
    var val = parseFloat(num * 100).toFixed(small) + "%";
    // xxx.<small>
    var totalLength = small + 5;
    while (val.length < totalLength) {
      val = ' ' + val;
    }
    return val;
  }

  var finalBoardPercent = t(w, h, "", "");

  for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
    finalBoard(ptr, finalBoard(ptr) / finalBoardCount);
    finalBoardPercent(ptr, formatToPercent(finalBoard(ptr)));

    if (table(ptr) !== '-') {
      finalBoard(ptr, -1);
      finalBoardPercent(ptr, '  <N/A>');
    }
  }

  var map = {
    '-8': '░',
    '0': '□',
    '1': '▁',
    '2': '▂',
    '3': '▃',
    '4': '▄',
    '5': '▅',
    '6': '▆',
    '7': '▇',
    '8': '█'
  };

  var visualBoard = t(w, h, "  ", "  ");
  // var visualColorBoard = t(w, h, "  ", "  ");

  for (let ptr = Ptr(0, 0); ptr; ptr = ptr.next()) {
    visualBoard(ptr, map[Math.floor(finalBoard(ptr) * 8)]);
    // if(finalBoard(ptr) >= 0) {
    //   visualColorBoard(ptr, hslColor(finalBoard(ptr) / 3, 1, 0.5, true) + ' ' + table(ptr) + '\u001b[0m');
    // } else {
    //   visualColorBoard(ptr, hslColor(2 / 3, 1, 0.5, true) + ' ' + table(ptr) + '\u001b[0m' );
    // }
  }

  console.log('board with ' + totalMines + ' mines');
  console.log(table.toString());
  console.log('result is');
  console.log(finalBoardPercent.toString());
  console.log(visualBoard.toString(' '));
  // console.log(visualColorBoard.toString(''));
  return finalBoard;
}

var map = {
  '?': 'o',
  '?️': 'o',
  '1\u20E3': '1',
  '2\u20E3': '2',
  '3\u20E3': '3',
  '4\u20E3': '4',
  '5\u20E3': '5',
  '6\u20E3': '6',
  '7\u20E3': '7',
  '8\u20E3': '8',
  '9\u20E3': '9',
  ' ': '0',
  '⬜️': '-',
  '?': 'o',
};

var ended = /^? Winner\:/g;

function check() {
  var historyRoot = $('.im_history_messages_peer:visible');
  var topScope = historyRoot.scope();
  var messages = topScope.peerHistory.messages;
  var boardMesssages = messages.filter((m)=> m.viaBotID === 223493268);
  // interate through messages to find board
  // and find board element by id
  var messageEls = historyRoot.find('.im_content_message_wrap');
  boardMesssages.forEach((message)=>{
    var messageEl = messageEls.filter((i, el)=>{
      return $(el).scope().historyMessage.$$hashKey === message.$$hashKey;
    });

    if (messageEl.length > 0 && !messageEl.get(0).watching) {
      track(messageEl.scope(), messageEl);
    }
  });
}

if (typeof unsafeWindow !== 'undefined') {
  window.check = unsafeWindow.check = check;
} else {
  window.check = check;
}


function track($scope, $el) {
  var reply_markup = $scope.historyMessage.reply_markup.rows.map((i)=>i.buttons);
  var buttonEls = $el.find('.reply_markup_button_wrap');
  var reply_markup_els = reply_markup.map((row)=>row.map((button)=>
    buttonEls.filter((i,el)=>$(el).scope().button.$$hashKey === button.$$hashKey)
  ));
  console.log(reply_markup_els);

  if(reply_markup_els.length < 8) {
    // not yet started
    return;
  }

  //$el.get(0).watching = true;

  function compute() {
    var reply_markup = $scope.historyMessage.reply_markup.rows.map((i)=>i.buttons);
    var buttonEls = $el.find('.reply_markup_button_wrap');
    var reply_markup_els = reply_markup.map((row)=>row.map((button)=>
      buttonEls.filter((i,el)=>$(el).scope().button.$$hashKey === button.$$hashKey)
    ));

    console.log(reply_markup_els);
    reply_markup = reply_markup.slice(0, 8);
    reply_markup_els = reply_markup_els.slice(0, 8);
    var board = reply_markup.map((row)=>{
      return row.map((button)=>{
        var mapped = map[button.text];
        if (mapped == null) {
          throw new Error('cannot map ' + button.text);
        }
        return mapped;
      }).join('');
    }).join('\r\n');
    console.log(board);
    try {
    var result = resolve(7, 8, 15, board);
    var ptr =  p(7, 8)(0, 0);
    for (let ptr = p(7, 8)(0, 0); ptr; ptr = ptr.next()) {
      if (result(ptr) >= 0) {
        $(reply_markup_els[ptr.y][ptr.x]).find('button').css('background', hslColor(result(ptr) / 3, 1, 0.5));
      } else {
        console.log(hslColor(2 / 3, 1, 0.5));
        $(reply_markup_els[ptr.y][ptr.x]).find('button').css('background', hslColor(2 / 3, 1, 0.5));
      }
    }
    } catch(e){}
  }

  compute();

  $scope.$watch('historyMessage.message', compute);
}

setInterval(check, 10000);